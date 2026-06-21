import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, Edit2, Trash2, Eye, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Tables } from '../../lib/supabase';
import { formatDate, formatCurrency, cn } from '../../lib/utils';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

type EventWithRelations = Tables<'events'> & {
  clubs: { name: string } | null;
  departments: { name: string } | null;
};

const isSuperAdmin = (profile: any) => profile?.role === 'superadmin';

export default function ManageEventsPage() {
  const { profile } = useAuth();
  const [events, setEvents] = useState<EventWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [approvedFilter, setApprovedFilter] = useState('');

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await supabase
        .from('events')
        .select('*, clubs(name), departments(name)')
        .eq('is_active', true)
        .order('event_date', { ascending: false });
      if (data) setEvents(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = events.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = !q || e.title.toLowerCase().includes(q) || e.clubs?.name?.toLowerCase().includes(q);
    const matchCat = !categoryFilter || e.category === categoryFilter;
    const matchApproved = approvedFilter === '' ? true : approvedFilter === 'approved' ? e.is_approved : !e.is_approved;
    return matchSearch && matchCat && matchApproved;
  });

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const { error } = await supabase.from('events').update({ is_active: false }).eq('id', eventId);
      if (error) throw error;
      toast.success('Event deleted');
      fetchEvents();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete event');
    }
  };

  const handleToggleApproval = async (event: EventWithRelations) => {
    try {
      const { error } = await supabase.from('events').update({ is_approved: !event.is_approved }).eq('id', event.id);
      if (error) throw error;
      toast.success(event.is_approved ? 'Event unapproved' : 'Event approved');
      fetchEvents();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Manage Events</h1>
            <p className="text-gray-600 mt-1">{events.length} events total</p>
          </div>
          {isSuperAdmin(profile) && (
            <Link to="/admin/events/create" className="inline-flex items-center px-5 py-2.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700">
              <Plus className="w-5 h-5 mr-2" />
              Create Event
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search events..." className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500" />
          </div>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500">
            <option value="">All Categories</option>
            {['workshop','hackathon','seminar','competition','cultural','sports','technical','other'].map(c => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
          <select value={approvedFilter} onChange={e => setApprovedFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500">
            <option value="">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending Approval</option>
          </select>
        </div>

        <p className="text-sm text-gray-500 mb-4">{filtered.length} events found</p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : filtered.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Event</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Club</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Participants</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Fee</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(event => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{event.title}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs capitalize">{event.category}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{event.clubs?.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(event.event_date)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {event.current_participants}/{event.max_participants || '∞'}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {event.registration_fee > 0 ? formatCurrency(event.registration_fee) : 'Free'}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleApproval(event)}
                          className={cn('px-2 py-1 rounded text-xs font-medium', event.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700')}
                        >
                          {event.is_approved ? 'Approved' : 'Pending'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/events/${event.id}`} className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                            <Eye className="w-4 h-4" />
                          </Link>
                          {isSuperAdmin(profile) && (
                            <>
                              <Link to={`/admin/events/${event.id}/edit`} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                <Edit2 className="w-4 h-4" />
                              </Link>
                              <button onClick={() => handleDelete(event.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No events found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
