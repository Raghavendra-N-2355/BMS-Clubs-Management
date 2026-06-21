import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Building2, Users, Calendar, ChevronLeft, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Tables } from '../lib/supabase';
import ClubCard from '../components/ClubCard';
import EventCard from '../components/EventCard';

type Department = Tables<'departments'>;

type ClubWithDepartment = Tables<'clubs'> & {
  departments: { name: string } | null;
};

type EventWithRelations = Tables<'events'> & {
  clubs: { name: string } | null;
  departments: { name: string } | null;
};

const departmentLogos: Record<string, string> = {
  'CSE': '💻',
  'ISE': '📊',
  'AIML': '🤖',
  'ECE': '📡',
  'EE': '⚡',
  'ME': '⚙️',
  'CE': '🏗️',
  'BT': '🧬',
  'COLLEGE': '🎓',
};

export default function DepartmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [department, setDepartment] = useState<Department | null>(null);
  const [clubs, setClubs] = useState<ClubWithDepartment[]>([]);
  const [events, setEvents] = useState<EventWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const { data: dept, error: deptError } = await supabase
        .from('departments')
        .select('*')
        .eq('id', id)
        .single();

      if (deptError || !dept) {
        navigate('/departments');
        return;
      }
      setDepartment(dept);

      // Fetch clubs
      const { data: clubsData } = await supabase
        .from('clubs')
        .select('*, departments ( name )')
        .eq('department_id', id)
        .eq('is_active', true)
        .order('member_count', { ascending: false });
      if (clubsData) setClubs(clubsData);

      // Fetch upcoming events
      const { data: eventsData } = await supabase
        .from('events')
        .select('*, clubs ( name ), departments ( name )')
        .eq('department_id', id)
        .eq('is_approved', true)
        .eq('is_active', true)
        .gte('event_date', new Date().toISOString().split('T')[0])
        .order('event_date', { ascending: true })
        .limit(6);
      if (eventsData) setEvents(eventsData);

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!department) return null;

  const logo = departmentLogos[department.code] || '📚';

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/departments"
            className="inline-flex items-center text-white/80 hover:text-white mb-6 text-sm"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Departments
          </Link>

          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center text-5xl">
              {logo}
            </div>
            <div>
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm mb-2">
                {department.code}
              </span>
              <h1 className="text-3xl md:text-4xl font-display font-bold">
                {department.name}
              </h1>
              <p className="text-white/80 mt-2 max-w-2xl">
                {department.description}
              </p>
            </div>
          </div>

          <div className="mt-8 flex gap-8">
            <div className="flex items-center gap-2 text-white/80">
              <Users className="w-5 h-5" />
              <span>{clubs.length} Clubs</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Calendar className="w-5 h-5" />
              <span>{events.length} Upcoming Events</span>
            </div>
          </div>
        </div>
      </section>

      {/* Clubs Section */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-display font-bold mb-6">Clubs</h2>

          {clubs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clubs.map(club => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No clubs available in this department</p>
            </div>
          )}
        </div>
      </section>

      {/* Events Section */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold">Upcoming Events</h2>
            <Link
              to={`/events?department=${id}`}
              className="text-primary-600 font-medium hover:text-primary-700"
            >
              View All
            </Link>
          </div>

          {events.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No upcoming events</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
