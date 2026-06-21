import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, Users, Tag, ChevronLeft, Share2,
  Heart, ExternalLink, Ticket, CreditCard, AlertCircle, Check
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../lib/supabase';
import { Tables } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
  formatDate, formatTime, formatCurrency, getDaysUntil,
  isRegistrationOpen, cn, generateQRValue, getCategoryColor
} from '../lib/utils';
import toast from 'react-hot-toast';

type EventWithRelations = Tables<'events'> & {
  clubs: { id: string; name: string; description: string } | null;
  departments: { id: string; name: string } | null;
};

type Registration = Tables<'registrations'>;

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [event, setEvent] = useState<EventWithRelations | null>(null);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEvent();
      if (user) {
        fetchRegistration();
      }
    }
  }, [id, user]);

  const fetchEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          clubs ( id, name, description ),
          departments ( id, name )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setEvent(data);
    } catch (error) {
      console.error('Error fetching event:', error);
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistration = async () => {
    const { data } = await supabase
      .from('registrations')
      .select('*')
      .eq('event_id', id)
      .eq('user_id', user!.id)
      .maybeSingle();

    if (data) setRegistration(data);
  };

  const handleRegister = async () => {
    if (!user) {
      toast.error('Please login to register for events');
      navigate('/login');
      return;
    }

    if (!event) return;

    const isOpen = isRegistrationOpen(
      event.is_registration_open,
      event.registration_deadline,
      event.max_participants,
      event.current_participants
    );

    if (!isOpen) {
      toast.error('Registration is closed for this event');
      return;
    }

    // For paid events, redirect to the payment page
    if (event.registration_fee > 0) {
      navigate(`/register/${event.id}`);
      return;
    }

    // Free event - register directly
    setRegistering(true);

    try {
      const { data, error } = await supabase
        .from('registrations')
        .insert({
          event_id: event.id,
          user_id: user.id,
          status: 'confirmed',
          payment_status: 'completed',
          amount_paid: 0,
        })
        .select()
        .single();

      if (error) throw error;

      // Update current participants count
      await supabase
        .from('events')
        .update({ current_participants: event.current_participants + 1 })
        .eq('id', event.id);

      toast.success('Successfully registered for the event!');
      setRegistration(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to register');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen pt-24 bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Event not found</p>
      </div>
    );
  }

  const daysUntil = getDaysUntil(event.event_date);
  const isOpen = isRegistrationOpen(
    event.is_registration_open,
    event.registration_deadline,
    event.max_participants,
    event.current_participants
  );
  const isPast = daysUntil < 0;
  const isFull = event.max_participants !== null && event.current_participants >= event.max_participants;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <div className={cn(
        'relative h-64 md:h-80',
        getCategoryColor(event.category)
      )}>
        {event.poster_url ? (
          <img
            src={event.poster_url}
            alt={event.title}
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Calendar className="w-24 h-24 text-white/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <Link
              to="/events"
              className="inline-flex items-center text-white/80 hover:text-white mb-4 text-sm"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Events
            </Link>

            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white mb-3">
                  {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                </span>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
                  {event.title}
                </h1>
                <p className="text-white/80 mt-2">
                  by {event.clubs?.name} | {event.departments?.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-display font-bold text-gray-900 mb-4">About Event</h2>
              <p className="text-gray-600 whitespace-pre-line">{event.description}</p>

              {event.prerequisites && (
                <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <h3 className="font-semibold text-amber-900 mb-2 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Prerequisites
                  </h3>
                  <p className="text-amber-800 text-sm">{event.prerequisites}</p>
                </div>
              )}

              {event.tags && event.tags.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Club Info */}
            {event.clubs && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Organizing Club</h3>
                <Link
                  to={`/clubs/${event.clubs.id}`}
                  className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold">
                    {event.clubs.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">{event.clubs.name}</p>
                    <p className="text-sm text-gray-500 line-clamp-1">{event.clubs.description}</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 ml-auto" />
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              {/* QR Code if registered */}
              {registration && registration.status === 'confirmed' && (
                <div className="text-center mb-6 pb-6 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-600 mb-3">Your Ticket</p>
                  <div className="inline-block p-4 bg-white rounded-xl shadow-inner">
                    <QRCodeSVG
                      value={generateQRValue(
                        registration.ticket_number || '',
                        event.id,
                        user?.id || ''
                      )}
                      size={128}
                      level="H"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{registration.ticket_number}</p>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-semibold">{formatDate(event.event_date)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Time</span>
                  <span className="font-semibold">
                    {formatTime(event.start_time)}
                    {event.end_time && ` - ${formatTime(event.end_time)}`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Type</span>
                  <span className="font-semibold capitalize">{event.event_type}</span>
                </div>
                {event.venue && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Venue</span>
                    <div className="text-right">
                      <span className="font-semibold">{event.venue}</span>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Participants</span>
                  <span className="font-semibold">
                    {event.current_participants}
                    {event.max_participants && ` / ${event.max_participants}`}
                  </span>
                </div>
                <hr />
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Registration Fee</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {event.registration_fee > 0 ? formatCurrency(event.registration_fee) : 'Free'}
                  </span>
                </div>
              </div>

              {/* Status badge */}
              {isPast ? (
                <div className="mt-6 py-3 text-center bg-gray-100 rounded-xl text-gray-500 font-medium">
                  Event has ended
                </div>
              ) : registration ? (
                <div className="mt-6 space-y-3">
                  <div className={cn(
                    'py-3 text-center rounded-xl font-medium',
                    registration.status === 'confirmed' && 'bg-green-100 text-green-800',
                    registration.status === 'pending' && 'bg-yellow-100 text-yellow-800',
                    registration.status === 'cancelled' && 'bg-red-100 text-red-800'
                  )}>
                    {registration.status === 'confirmed' && (
                      <span className="flex items-center justify-center">
                        <Check className="w-5 h-5 mr-2" />
                        Registered
                      </span>
                    )}
                    {registration.status === 'pending' && 'Payment Pending'}
                    {registration.status === 'cancelled' && 'Registration Cancelled'}
                  </div>
                  {event.registration_fee > 0 && registration.payment_status === 'pending' && (
                    <button
                      onClick={() => navigate(`/register/${event.id}`)}
                      className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                    >
                      <CreditCard className="w-5 h-5 inline mr-2" />
                      Complete Payment
                    </button>
                  )}
                </div>
              ) : !isOpen ? (
                <div className="mt-6 py-3 text-center bg-gray-100 rounded-xl text-gray-500 font-medium">
                  {isFull ? 'Registration Full' : 'Registration Closed'}
                </div>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="mt-6 w-full py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {registering ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                  ) : (
                    <>
                      <Ticket className="w-5 h-5 inline mr-2" />
                      {event.registration_fee > 0 ? 'Register & Pay' : 'Register Now'}
                    </>
                  )}
                </button>
              )}

              {daysUntil > 0 && daysUntil <= 7 && (
                <p className="text-center text-sm text-gray-500 mt-4">
                  Only {daysUntil} day{daysUntil !== 1 ? 's' : ''} left!
                </p>
              )}
            </div>

            {/* Share */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <button className="w-full flex items-center justify-center py-2 text-gray-600 hover:text-primary-600 transition-colors">
                <Share2 className="w-5 h-5 mr-2" />
                Share Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
