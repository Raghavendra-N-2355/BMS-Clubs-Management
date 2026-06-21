import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Users, Calendar, Mail, MapPin, ExternalLink, UserPlus } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../lib/supabase';
import { Tables } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import EventCard from '../components/EventCard';
import { formatDate, cn } from '../lib/utils';
import toast from 'react-hot-toast';

type Club = Tables<'clubs'> & {
  departments: { id: string; name: string } | null;
};

type EventWithRelations = Tables<'events'> & {
  clubs: { name: string } | null;
  departments: { name: string } | null;
};

const clubGradients: Record<string, string> = {
  'Protocol Club': 'from-blue-500 to-cyan-500',
  'CodeC Club': 'from-purple-500 to-pink-500',
  'AI Research Club': 'from-green-500 to-emerald-500',
  'Cyber Security Club': 'from-red-500 to-rose-500',
  'TechNova Club': 'from-indigo-500 to-violet-500',
  'DataVerse Club': 'from-orange-500 to-amber-500',
  'Neural Nexus': 'from-teal-500 to-cyan-500',
  'Vision AI Club': 'from-pink-500 to-rose-500',
};

export default function ClubDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [club, setClub] = useState<Club | null>(null);
  const [events, setEvents] = useState<EventWithRelations[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchData();
  }, [id, user]);

  const fetchData = async () => {
    try {
      const { data: clubData, error: clubError } = await supabase
        .from('clubs')
        .select('*, departments ( id, name )')
        .eq('id', id)
        .single();

      if (clubError || !clubData) {
        navigate('/clubs');
        return;
      }
      setClub(clubData);

      // Fetch events
      const { data: eventsData } = await supabase
        .from('events')
        .select('*, clubs ( name ), departments ( name )')
        .eq('club_id', id)
        .eq('is_approved', true)
        .eq('is_active', true)
        .order('event_date', { ascending: true });
      if (eventsData) setEvents(eventsData);

      // Check if user is member
      if (user) {
        const { data: membership } = await supabase
          .from('club_members')
          .select('id')
          .eq('club_id', id)
          .eq('user_id', user.id)
          .maybeSingle();
        setIsMember(!!membership);
      }

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClub = async () => {
    if (!user) {
      toast.error('Please login to join clubs');
      return;
    }

    try {
      const { error } = await supabase
        .from('club_members')
        .insert({ club_id: id!, user_id: user.id });

      if (error) throw error;

      // Update member count
      await supabase
        .from('clubs')
        .update({ member_count: (club?.member_count || 0) + 1 })
        .eq('id', id);

      setIsMember(true);
      toast.success('Successfully joined the club!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to join club');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!club) return null;

  const gradientClass = clubGradients[club.name] || 'from-primary-500 to-primary-600';

  const upcomingEvents = events.filter(e => new Date(e.event_date) >= new Date());
  const pastEvents = events.filter(e => new Date(e.event_date) < new Date());

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <div className={cn('relative h-48 md:h-64 bg-gradient-to-br', gradientClass)}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            <Link
              to="/clubs"
              className="inline-flex items-center text-white/80 hover:text-white mb-4 text-sm"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Clubs
            </Link>

            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl font-bold text-white">
                {club.name.charAt(0)}
              </div>
              <div>
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-2">
                  {club.departments?.name}
                </span>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
                  {club.name}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-display font-bold mb-4">About</h2>
              <p className="text-gray-600">{club.description}</p>

              <div className="mt-6 flex items-center gap-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-5 h-5" />
                  <span>{club.member_count}+ Members</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span>{events.length} Events</span>
                </div>
              </div>
            </div>

            {/* Coordinators */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Coordinators</h3>

              <div className="grid md:grid-cols-2 gap-4">
                {club.faculty_coordinator_name && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Faculty Coordinator</p>
                    <p className="font-medium text-gray-900">{club.faculty_coordinator_name}</p>
                    {club.faculty_coordinator_email && (
                      <a href={`mailto:${club.faculty_coordinator_email}`} className="text-sm text-primary-600 hover:underline flex items-center mt-1">
                        <Mail className="w-4 h-4 mr-1" />
                        {club.faculty_coordinator_email}
                      </a>
                    )}
                  </div>
                )}

                {club.student_coordinator_name && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Student Coordinator</p>
                    <p className="font-medium text-gray-900">{club.student_coordinator_name}</p>
                    {club.student_coordinator_email && (
                      <a href={`mailto:${club.student_coordinator_email}`} className="text-sm text-primary-600 hover:underline flex items-center mt-1">
                        <Mail className="w-4 h-4 mr-1" />
                        {club.student_coordinator_email}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <div>
                <h2 className="text-xl font-display font-bold mb-4">Upcoming Events</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {upcomingEvents.slice(0, 4).map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <div>
                <h2 className="text-xl font-display font-bold mb-4">Past Events</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {pastEvents.slice(0, 4).map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              {isMember ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="font-semibold text-gray-900 mb-1">You're a member!</p>
                  <p className="text-sm text-gray-500">You'll receive updates about club events</p>
                </div>
              ) : (
                <button
                  onClick={handleJoinClub}
                  className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                >
                  <UserPlus className="w-5 h-5 inline mr-2" />
                  Join Club
                </button>
              )}

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Department</span>
                  <Link
                    to={`/departments/${club.departments?.id}`}
                    className="text-primary-600 font-medium hover:underline flex items-center"
                  >
                    {club.departments?.name}
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Upcoming Events</span>
                  <span className="font-semibold">{upcomingEvents.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Events</span>
                  <span className="font-semibold">{events.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
