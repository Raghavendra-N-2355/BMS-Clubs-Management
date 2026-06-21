import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Users, Building2, Trophy, Sparkles, ArrowRight,
  Clock, MapPin, Star, ChevronRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Tables } from '../lib/supabase';
import { formatDate, formatTime, getDaysUntil, cn } from '../lib/utils';
import EventCard from '../components/EventCard';
import ClubCard from '../components/ClubCard';
import DepartmentCard from '../components/DepartmentCard';

type EventWithRelations = Tables<'events'> & {
  clubs: { name: string } | null;
  departments: { name: string } | null;
};

type ClubWithDepartment = Tables<'clubs'> & {
  departments: { name: string } | null;
};

type DepartmentWithStats = Tables<'departments'> & {
  clubs: { count: number } | null;
  _count?: { clubs: number };
};

export default function LandingPage() {
  const [upcomingEvents, setUpcomingEvents] = useState<EventWithRelations[]>([]);
  const [popularClubs, setPopularClubs] = useState<ClubWithDepartment[]>([]);
  const [departments, setDepartments] = useState<DepartmentWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalClubs: 0,
    totalDepartments: 0,
    totalRegistrations: 0
  });

  useEffect(() => {
    fetchLandingData();
  }, []);

  const fetchLandingData = async () => {
    try {
      setLoading(true);

      // Fetch upcoming events
      const { data: eventsData } = await supabase
        .from('events')
        .select(`
          *,
          clubs ( name ),
          departments ( name )
        `)
        .eq('is_approved', true)
        .eq('is_active', true)
        .gte('event_date', new Date().toISOString().split('T')[0])
        .order('event_date', { ascending: true })
        .limit(6);

      if (eventsData) setUpcomingEvents(eventsData as EventWithRelations[]);

      // Fetch popular clubs
      const { data: clubsData } = await supabase
        .from('clubs')
        .select(`
          *,
          departments ( name )
        `)
        .eq('is_active', true)
        .order('member_count', { ascending: false })
        .limit(6);

      if (clubsData) setPopularClubs(clubsData as ClubWithDepartment[]);

      // Fetch departments
      const { data: deptData } = await supabase
        .from('departments')
        .select('*, clubs(count)')
        .neq('code', 'COLLEGE')
        .order('name');

      if (deptData) setDepartments(deptData);

      // Fetch stats
      const [eventsCount, clubsCount, deptsCount] = await Promise.all([
        supabase.from('events').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('clubs').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('departments').select('id', { count: 'exact', head: true })
      ]);

      setStats({
        totalEvents: eventsCount.count || 0,
        totalClubs: clubsCount.count || 0,
        totalDepartments: deptsCount.count || 0,
        totalRegistrations: 1250
      });

    } catch (error) {
      console.error('Error fetching landing data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-white">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4 mr-2 text-yellow-300" />
                B.M.S. College of Engineering, Bengaluru
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
                Discover, Connect &{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400">
                  Thrive
                </span>
              </h1>

              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-lg">
                Your gateway to clubs, events, workshops, hackathons, and countless opportunities.
                Join 10,000+ BMSCE students exploring their passions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/events"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Explore Events
                </Link>
                <Link
                  to="/clubs"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Browse Clubs
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6">
                {[
                  { label: 'Events', value: stats.totalEvents, icon: Calendar },
                  { label: 'Clubs', value: stats.totalClubs, icon: Users },
                  { label: 'Departments', value: stats.totalDepartments, icon: Building2 },
                  { label: 'Registrations', value: stats.totalRegistrations, icon: Trophy },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="text-center">
                      <div className="flex items-center justify-center w-10 h-10 bg-white/10 rounded-lg mx-auto mb-2">
                        <Icon className="w-5 h-5 text-white/80" />
                      </div>
                      <div className="text-2xl font-bold">{stat.value}+</div>
                      <div className="text-sm text-white/70">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hero Image / Event Highlights */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Main Event Card */}
                {upcomingEvents[0] && (
                  <div className="absolute top-0 right-0 w-80 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-xl animate-fade-in">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center mr-3">
                        <Star className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="text-white/60 text-xs">Featured Event</span>
                        <p className="text-white font-semibold text-sm">{upcomingEvents[0].title}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-white/70 text-sm mb-2">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(upcomingEvents[0].event_date)}
                    </div>
                    <div className="flex items-center text-white/70 text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      {formatTime(upcomingEvents[0].start_time)}
                    </div>
                  </div>
                )}

                {/* Secondary Card */}
                {upcomingEvents[1] && (
                  <div className="absolute top-32 right-24 w-72 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 animate-fade-in delay-300">
                    <p className="text-white/90 font-medium text-sm truncate">{upcomingEvents[1].title}</p>
                    <p className="text-white/50 text-xs mt-1">{upcomingEvents[1].clubs?.name}</p>
                  </div>
                )}

                {/* Stats Card */}
                <div className="absolute top-64 right-8 w-64 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-white">{getDaysUntil(upcomingEvents[0]?.event_date || '')}</p>
                      <p className="text-white/60 text-sm">days until</p>
                      <p className="text-white font-medium text-sm">next event</p>
                    </div>
                    <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center">
                      <Calendar className="w-8 h-8 text-white/60" />
                    </div>
                  </div>
                </div>

                {/* Gradient Orb */}
                <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-amber-400/20 to-yellow-500/20 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold text-gray-900">
                Upcoming Events
              </h2>
              <p className="text-gray-600 mt-2">
                Don't miss out on these exciting events happening on campus
              </p>
            </div>
            <Link
              to="/events"
              className="hidden sm:inline-flex items-center px-5 py-2.5 text-primary-600 font-semibold hover:bg-primary-50 rounded-lg transition-colors"
            >
              View All Events
              <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-96 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-2xl"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.slice(0, 6).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No upcoming events at the moment</p>
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/events"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              View All Events
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900">
              Explore Departments
            </h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              Discover clubs and events across various engineering departments at BMSCE
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl h-48 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {departments.slice(0, 8).map((dept) => (
                <DepartmentCard key={dept.id} department={dept as any} />
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              to="/departments"
              className="inline-flex items-center px-6 py-3 text-primary-600 font-semibold hover:bg-primary-50 rounded-lg transition-colors"
            >
              View All Departments
              <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Clubs Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold text-gray-900">
                Popular Clubs
              </h2>
              <p className="text-gray-600 mt-2">
                Join vibrant communities and pursue your passions
              </p>
            </div>
            <Link
              to="/clubs"
              className="hidden sm:inline-flex items-center px-5 py-2.5 text-primary-600 font-semibold hover:bg-primary-50 rounded-lg transition-colors"
            >
              View All Clubs
              <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-72 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularClubs.slice(0, 6).map((club) => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
            Ready to Join the Community?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Create your account today and start exploring events, joining clubs,
            and connecting with fellow BMSCE students.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-lg"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/events"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
