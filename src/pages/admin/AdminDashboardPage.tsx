import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Calendar, Building2, Ticket, TrendingUp,
  Plus, DollarSign, Clock, BarChart2, ArrowUpRight,
  CheckCircle, AlertCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Tables } from '../../lib/supabase';
import { formatCurrency, formatDate, cn } from '../../lib/utils';

type EventWithRelations = Tables<'events'> & {
  clubs: { name: string } | null;
};

type RecentRegistration = Tables<'registrations'> & {
  user_profiles: { name: string } | null;
  events: { title: string; event_date: string } | null;
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

export default function AdminDashboardPage() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalEvents: 0, upcomingEvents: 0, totalRegistrations: 0,
    totalRevenue: 0, pendingPayments: 0, totalUsers: 0,
    totalClubs: 0, totalDepartments: 0,
  });
  const [categoryBreakdown, setCategoryBreakdown] = useState<{ category: string; count: number }[]>([]);
  const [recentEvents, setRecentEvents] = useState<EventWithRelations[]>([]);
  const [recentRegistrations, setRecentRegistrations] = useState<RecentRegistration[]>([]);
  const [pendingApproval, setPendingApproval] = useState<EventWithRelations[]>([]);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        { count: totalEvents },
        { count: upcomingEvents },
        { count: totalRegistrations },
        { count: pendingPayments },
        { count: totalUsers },
        { count: totalClubs },
        { count: totalDepartments },
        { data: payments },
        { data: events },
        { data: regs },
        { data: pendingEvents },
        { data: allEvents },
      ] = await Promise.all([
        supabase.from('events').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('events').select('id', { count: 'exact', head: true }).eq('is_active', true).eq('is_approved', true).gte('event_date', new Date().toISOString().split('T')[0]),
        supabase.from('registrations').select('id', { count: 'exact', head: true }),
        supabase.from('registrations').select('id', { count: 'exact', head: true }).eq('payment_status', 'pending'),
        supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
        supabase.from('clubs').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('departments').select('id', { count: 'exact', head: true }),
        supabase.from('payments').select('amount').eq('status', 'succeeded'),
        supabase.from('events').select('*, clubs(name)').eq('is_active', true).order('created_at', { ascending: false }).limit(5),
        supabase.from('registrations').select('*, user_profiles(name), events(title, event_date)').order('registered_at', { ascending: false }).limit(6),
        supabase.from('events').select('*, clubs(name)').eq('is_approved', false).eq('is_active', true).order('created_at', { ascending: false }).limit(3),
        supabase.from('events').select('category').eq('is_active', true),
      ]);

      const totalRevenue = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      // Category breakdown
      const cats: Record<string, number> = {};
      allEvents?.forEach(e => { cats[e.category] = (cats[e.category] || 0) + 1; });
      const breakdown = Object.entries(cats).sort((a, b) => b[1] - a[1]).map(([category, count]) => ({ category, count }));

      setStats({ totalEvents: totalEvents || 0, upcomingEvents: upcomingEvents || 0, totalRegistrations: totalRegistrations || 0, totalRevenue, pendingPayments: pendingPayments || 0, totalUsers: totalUsers || 0, totalClubs: totalClubs || 0, totalDepartments: totalDepartments || 0 });
      setCategoryBreakdown(breakdown);
      setRecentEvents(events || []);
      setRecentRegistrations(regs || []);
      setPendingApproval(pendingEvents || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (eventId: string) => {
    await supabase.from('events').update({ is_approved: true }).eq('id', eventId);
    setPendingApproval(prev => prev.filter(e => e.id !== eventId));
    setStats(prev => ({ ...prev, upcomingEvents: prev.upcomingEvents + 1 }));
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const maxCount = Math.max(...categoryBreakdown.map(c => c.count), 1);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {profile?.name}.</p>
          </div>
          {profile?.role === 'superadmin' && (
            <Link to="/admin/events/create" className="inline-flex items-center px-5 py-2.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700">
              <Plus className="w-5 h-5 mr-2" />
              Create Event
            </Link>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Events', value: stats.totalEvents, icon: Calendar, color: 'bg-blue-100', iconColor: 'text-blue-600', change: `${stats.upcomingEvents} upcoming` },
            { label: 'Registrations', value: stats.totalRegistrations, icon: Ticket, color: 'bg-purple-100', iconColor: 'text-purple-600', change: `${stats.pendingPayments} pending` },
            { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: DollarSign, color: 'bg-amber-100', iconColor: 'text-amber-600', change: 'from payments' },
            { label: 'Students', value: stats.totalUsers, icon: Users, color: 'bg-green-100', iconColor: 'text-green-600', change: `across ${stats.totalDepartments} depts` },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', s.color)}>
                  <s.icon className={cn('w-5 h-5', s.iconColor)} />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-600 mt-0.5">{s.label}</p>
              <p className="text-xs text-gray-400 mt-1">{s.change}</p>
            </div>
          ))}
        </div>

        {/* Second row stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Clubs', value: stats.totalClubs, icon: Users, color: 'bg-cyan-100', iconColor: 'text-cyan-600' },
            { label: 'Departments', value: stats.totalDepartments, icon: Building2, color: 'bg-teal-100', iconColor: 'text-teal-600' },
            { label: 'Upcoming Events', value: stats.upcomingEvents, icon: Clock, color: 'bg-indigo-100', iconColor: 'text-indigo-600' },
            { label: 'Pending Payments', value: stats.pendingPayments, icon: AlertCircle, color: 'bg-red-100', iconColor: 'text-red-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-3', s.color)}>
                <s.icon className={cn('w-5 h-5', s.iconColor)} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-600">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Category Breakdown */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart2 className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Events by Category</h2>
            </div>
            <div className="space-y-3">
              {categoryBreakdown.map(({ category, count }) => (
                <div key={category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">{category}</span>
                    <span className="text-sm font-bold text-gray-900">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full', categoryColors[category] || 'bg-gray-400')}
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Approval */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Pending Approval</h2>
              <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">{pendingApproval.length}</span>
            </div>
            {pendingApproval.length > 0 ? (
              <div className="space-y-3">
                {pendingApproval.map(event => (
                  <div key={event.id} className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="font-medium text-gray-900 text-sm">{event.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{event.clubs?.name}</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleApprove(event.id)}
                        className="flex-1 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700"
                      >
                        <CheckCircle className="w-3 h-3 inline mr-1" />
                        Approve
                      </button>
                      <Link to={`/admin/events/${event.id}/edit`} className="flex-1 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 text-center">
                        Review
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-10 h-10 text-green-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">All events approved</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              {[
                { label: 'Create Event', sub: 'Add a new event', to: '/admin/events/create', color: 'bg-primary-600', icon: Plus, superAdminOnly: true },
                { label: 'Manage Events', sub: `${stats.totalEvents} total`, to: '/admin/events', color: 'bg-blue-600', icon: Calendar },
                { label: 'Manage Clubs', sub: `${stats.totalClubs} active`, to: '/admin/clubs', color: 'bg-purple-600', icon: Users },
                { label: 'Manage Users', sub: `${stats.totalUsers} registered`, to: '/admin/users', color: 'bg-green-600', icon: Users },
                { label: 'Registrations', sub: `${stats.totalRegistrations} total`, to: '/admin/registrations', color: 'bg-amber-600', icon: Ticket },
                { label: 'Departments', sub: `${stats.totalDepartments} depts`, to: '/admin/departments', color: 'bg-teal-600', icon: Building2 },
              ].filter(action => !action.superAdminOnly || profile?.role === 'superadmin').map(action => (
                <Link key={action.to} to={action.to}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center text-white', action.color)}>
                    <action.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{action.label}</p>
                    <p className="text-xs text-gray-500">{action.sub}</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Events */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Events</h2>
              <Link to="/admin/events" className="text-primary-600 font-medium text-sm hover:text-primary-700 flex items-center gap-1">
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentEvents.map(event => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-2 h-8 rounded-full', categoryColors[event.category] || 'bg-gray-400')} />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{event.title}</p>
                      <p className="text-xs text-gray-500">{event.clubs?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatDate(event.event_date)}</p>
                    <span className={cn('text-xs font-medium', event.is_approved ? 'text-green-600' : 'text-amber-600')}>
                      {event.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Registrations */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Registrations</h2>
              <Link to="/admin/registrations" className="text-primary-600 font-medium text-sm hover:text-primary-700 flex items-center gap-1">
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentRegistrations.map(reg => (
                <div key={reg.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-xs">
                      {reg.user_profiles?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{reg.user_profiles?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{reg.events?.title}</p>
                    </div>
                  </div>
                  <span className={cn('px-2 py-1 rounded text-xs font-medium',
                    reg.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    reg.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  )}>
                    {reg.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
