import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, Ticket, Award, CreditCard,
  Users, ChevronRight, ExternalLink, Sparkles, TrendingUp, Star
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase, Tables } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
  formatDate, formatTime, formatCurrency, cn,
  getStatusBadgeColor, getPaymentStatusColor, generateQRValue
} from '../lib/utils';

type RegistrationWithEvent = Tables<'registrations'> & {
  events: Tables<'events'> & {
    clubs: { name: string } | null;
    departments: { name: string } | null;
  } | null;
};

type EventRec = Tables<'events'> & {
  clubs: { name: string } | null;
  departments: { name: string } | null;
};

const categoryColors: Record<string, string> = {
  workshop: 'bg-blue-500',
  hackathon: 'bg-purple-500',
  seminar: 'bg-green-500',
  competition: 'bg-amber-500',
  cultural: 'bg-pink-500',
  sports: 'bg-orange-500',
  technical: 'bg-cyan-500',
  other: 'bg-gray-500',
};

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [registrations, setRegistrations] = useState<RegistrationWithEvent[]>([]);
  const [recommendations, setRecommendations] = useState<EventRec[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [joinedClubs, setJoinedClubs] = useState<any[]>([]);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [{ data: regs }, { data: clubs }, { data: events }] = await Promise.all([
        supabase.from('registrations').select(`
          *, events ( id, title, description, event_date, start_time, end_time, venue, category, event_type, registration_fee, clubs(name), departments(name) )
        `).eq('user_id', user!.id).order('registered_at', { ascending: false }),

        supabase.from('club_members').select('id, clubs(id, name, departments(name))').eq('user_id', user!.id),

        supabase.from('events').select('*, clubs(name), departments(name)')
          .eq('is_approved', true).eq('is_active', true).eq('is_registration_open', true)
          .gte('event_date', new Date().toISOString().split('T')[0])
          .order('event_date', { ascending: true }).limit(5),
      ]);

      if (regs) setRegistrations(regs);
      if (clubs) setJoinedClubs(clubs);
      if (events) {
        const registeredEventIds = new Set(regs?.map(r => r.event_id) || []);
        setRecommendations(events.filter(e => !registeredEventIds.has(e.id)).slice(0, 4));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingRegs = registrations.filter(r => r.events && new Date(r.events.event_date) >= new Date());
  const pastRegs = registrations.filter(r => r.events && new Date(r.events.event_date) < new Date());
  const confirmedCount = registrations.filter(r => r.status === 'confirmed').length;
  const certCount = registrations.filter(r => r.certificate_issued).length;

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {profile?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-gray-900">
                Welcome back, {profile?.name?.split(' ')[0]}!
              </h1>
              <p className="text-gray-500 text-sm">
                {profile?.usn && <span className="font-medium">{profile.usn} · </span>}
                {profile?.semester && <span>Semester {profile.semester} · </span>}
                <span className="capitalize">{profile?.role}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Upcoming Events', value: upcomingRegs.length, icon: Calendar, color: 'bg-primary-100', iconColor: 'text-primary-600' },
            { label: 'Confirmed Tickets', value: confirmedCount, icon: Ticket, color: 'bg-green-100', iconColor: 'text-green-600' },
            { label: 'Clubs Joined', value: joinedClubs.length, icon: Users, color: 'bg-amber-100', iconColor: 'text-amber-600' },
            { label: 'Certificates', value: certCount, icon: Award, color: 'bg-purple-100', iconColor: 'text-purple-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-3', s.color)}>
                <s.icon className={cn('w-5 h-5', s.iconColor)} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h2 className="text-lg font-semibold text-gray-900">Recommended for You</h2>
                  <span className="ml-auto text-xs text-gray-400">Upcoming events</span>
                </div>
                <div className="space-y-3">
                  {recommendations.map(event => (
                    <Link key={event.id} to={`/events/${event.id}`}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', categoryColors[event.category] || 'bg-gray-500')}>
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate group-hover:text-primary-600 transition-colors">{event.title}</p>
                        <p className="text-xs text-gray-500">{event.clubs?.name} · {formatDate(event.event_date)}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-primary-600">
                          {event.registration_fee > 0 ? formatCurrency(event.registration_fee) : 'Free'}
                        </p>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 ml-auto" />
                      </div>
                    </Link>
                  ))}
                </div>
                <Link to="/events" className="flex items-center justify-center gap-2 mt-4 py-2 text-primary-600 font-medium text-sm hover:bg-primary-50 rounded-lg transition-colors">
                  Browse All Events
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* Registrations */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="flex border-b border-gray-100">
                {(['upcoming', 'past'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={cn('flex-1 px-6 py-4 font-medium capitalize transition-colors',
                      activeTab === tab ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'
                    )}>
                    {tab} ({tab === 'upcoming' ? upcomingRegs.length : pastRegs.length})
                  </button>
                ))}
              </div>

              <div className="p-6">
                {(activeTab === 'upcoming' ? upcomingRegs : pastRegs).length > 0 ? (
                  <div className="space-y-4">
                    {(activeTab === 'upcoming' ? upcomingRegs : pastRegs).map(reg => (
                      <div key={reg.id} className="border border-gray-200 rounded-xl p-4 hover:border-primary-200 transition-colors">
                        <div className="flex items-start gap-4">
                          {reg.status === 'confirmed' && (
                            <div className="hidden sm:block p-2 bg-gray-50 rounded-xl flex-shrink-0">
                              <QRCodeSVG value={generateQRValue(reg.ticket_number || '', reg.event_id, user?.id || '')} size={60} />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900 leading-tight">{reg.events?.title}</h3>
                              {reg.ticket_number && (
                                <span className="text-xs text-gray-400 flex-shrink-0">{reg.ticket_number}</span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mb-3">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDate(reg.events?.event_date || '')}
                              </span>
                              {reg.events?.start_time && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  {formatTime(reg.events.start_time)}
                                </span>
                              )}
                              {reg.events?.venue && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5" />
                                  {reg.events.venue}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className={cn('px-2 py-1 rounded text-xs font-medium', getStatusBadgeColor(reg.status))}>
                                {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                              </span>
                              {reg.events?.registration_fee && reg.events.registration_fee > 0 && (
                                <span className={cn('px-2 py-1 rounded text-xs font-medium', getPaymentStatusColor(reg.payment_status))}>
                                  Payment: {reg.payment_status}
                                </span>
                              )}
                              {reg.certificate_issued && (
                                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                                  Certificate Issued
                                </span>
                              )}
                            </div>
                          </div>
                          <Link to={`/events/${reg.event_id}`} className="p-2 text-gray-400 hover:text-primary-600 flex-shrink-0">
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </div>
                        {reg.events?.registration_fee && reg.events.registration_fee > 0 && reg.payment_status === 'pending' && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <button className="w-full py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 flex items-center justify-center gap-2">
                              <CreditCard className="w-4 h-4" />
                              Complete Payment - {formatCurrency(reg.amount_paid)}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No {activeTab} events</p>
                    <p className="text-sm text-gray-400 mt-1">Register for events to see them here</p>
                    <Link to="/events" className="inline-flex items-center mt-4 px-5 py-2.5 bg-primary-600 text-white font-medium rounded-xl text-sm hover:bg-primary-700">
                      Browse Events
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Your Profile</h3>
              <div className="space-y-3 text-sm">
                {[
                  { label: 'Name', value: profile?.name },
                  { label: 'Email', value: profile?.email },
                  profile?.usn ? { label: 'USN', value: profile.usn } : null,
                  profile?.phone ? { label: 'Phone', value: profile.phone } : null,
                  profile?.semester ? { label: 'Semester', value: `Semester ${profile.semester}` } : null,
                  { label: 'Role', value: profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : '' },
                ].filter(Boolean).map((item: any) => (
                  <div key={item.label} className="flex justify-between gap-2">
                    <span className="text-gray-500 flex-shrink-0">{item.label}</span>
                    <span className="font-medium text-gray-900 text-right truncate">{item.value}</span>
                  </div>
                ))}
              </div>
              <Link to="/profile" className="block w-full mt-4 py-2 text-center text-sm text-primary-600 font-medium hover:bg-primary-50 rounded-lg transition-colors">
                Edit Profile
              </Link>
            </div>

            {/* Joined Clubs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">My Clubs</h3>
                <span className="text-xs text-gray-400">{joinedClubs.length} joined</span>
              </div>
              {joinedClubs.length > 0 ? (
                <div className="space-y-2">
                  {joinedClubs.slice(0, 5).map((club: any) => (
                    <Link key={club.id} to={`/clubs/${club.clubs?.id}`}
                      className="flex items-center p-2.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="font-bold text-primary-600 text-xs">{club.clubs?.name?.charAt(0)}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{club.clubs?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{club.clubs?.departments?.name}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Users className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No clubs joined yet</p>
                </div>
              )}
              <Link to="/clubs" className="block w-full mt-3 py-2 text-center text-sm text-primary-600 font-medium hover:bg-primary-50 rounded-lg transition-colors">
                Browse Clubs
              </Link>
            </div>

            {/* Trending Events Banner */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-yellow-300" />
                <h3 className="font-semibold">What's Trending</h3>
              </div>
              <p className="text-white/80 text-sm mb-4">
                Join hackathons, workshops and more. Your next opportunity awaits.
              </p>
              <Link to="/events" className="block w-full py-2.5 bg-white text-primary-700 font-semibold text-sm rounded-xl text-center hover:bg-gray-50 transition-colors">
                Explore Events
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
