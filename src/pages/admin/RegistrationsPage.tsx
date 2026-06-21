import React, { useEffect, useState } from 'react';
import { Ticket, Download, Search, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Tables } from '../../lib/supabase';
import { formatDate, formatCurrency, cn, getStatusBadgeColor, getPaymentStatusColor } from '../../lib/utils';

type RegistrationWithDetails = Tables<'registrations'> & {
  events: Tables<'events'> | null;
  user_profiles: { name: string; email: string; usn: string | null } | null;
};

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<RegistrationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const { data } = await supabase
        .from('registrations')
        .select(`
          *,
          events ( id, title, event_date, registration_fee ),
          user_profiles ( name, email, usn )
        `)
        .order('registered_at', { ascending: false });
      if (data) setRegistrations(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRegistrations = registrations.filter(reg => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!reg.user_profiles?.name?.toLowerCase().includes(query) &&
          !reg.user_profiles?.email?.toLowerCase().includes(query) &&
          !reg.events?.title?.toLowerCase().includes(query)) {
        return false;
      }
    }
    if (statusFilter && reg.status !== statusFilter) return false;
    if (paymentFilter && reg.payment_status !== paymentFilter) return false;
    return true;
  });

  const handleUpdateStatus = async (regId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ status })
        .eq('id', regId);

      if (error) throw error;
      fetchRegistrations();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Registrations</h1>
            <p className="text-gray-600 mt-1">View and manage all event registrations</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Search by name, email, or event..."
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="waitlisted">Waitlisted</option>
            </select>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Payments</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : filteredRegistrations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Student</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Event</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Payment</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRegistrations.map(reg => (
                    <tr key={reg.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{reg.user_profiles?.name}</p>
                          <p className="text-sm text-gray-500">{reg.user_profiles?.email}</p>
                          {reg.user_profiles?.usn && (
                            <p className="text-xs text-gray-400">{reg.user_profiles.usn}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{reg.events?.title}</p>
                          <p className="text-sm text-gray-500">{formatDate(reg.events?.event_date || '')}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(reg.registered_at)}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={reg.status}
                          onChange={(e) => handleUpdateStatus(reg.id, e.target.value)}
                          className={cn(
                            'px-2 py-1 rounded text-xs font-medium border-0 cursor-pointer',
                            getStatusBadgeColor(reg.status)
                          )}
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="pending">Pending</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="waitlisted">Waitlisted</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          'inline-block px-2 py-1 rounded text-xs font-medium',
                          getPaymentStatusColor(reg.payment_status)
                        )}>
                          {reg.payment_status}
                        </span>
                        {reg.amount_paid > 0 && (
                          <p className="text-sm text-gray-500 mt-1">{formatCurrency(reg.amount_paid)}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-primary-600 text-sm font-medium hover:text-primary-700">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No registrations found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
