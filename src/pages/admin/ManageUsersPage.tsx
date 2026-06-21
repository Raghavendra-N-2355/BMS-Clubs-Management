import React, { useEffect, useState } from 'react';
import { Users, Search, Shield, GraduationCap } from 'lucide-react';
import { supabase, Tables } from '../../lib/supabase';
import { formatDate, cn } from '../../lib/utils';
import toast from 'react-hot-toast';

type UserWithDept = Tables<'user_profiles'> & {
  departments: { name: string; code: string } | null;
};

const roleBadge: Record<string, string> = {
  student: 'bg-green-100 text-green-700',
  admin: 'bg-blue-100 text-blue-700',
  superadmin: 'bg-red-100 text-red-700',
};

export default function ManageUsersPage() {
  const [users, setUsers] = useState<UserWithDept[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [departments, setDepartments] = useState<Tables<'departments'>[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [{ data: usersData }, { data: deptsData }] = await Promise.all([
      supabase.from('user_profiles').select('*, departments(name, code)').order('created_at', { ascending: false }),
      supabase.from('departments').select('*').order('name'),
    ]);
    if (usersData) setUsers(usersData as UserWithDept[]);
    if (deptsData) setDepartments(deptsData);
    setLoading(false);
  };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.usn || '').toLowerCase().includes(q);
    const matchRole = !roleFilter || u.role === roleFilter;
    const matchDept = !deptFilter || u.department_id === deptFilter;
    return matchSearch && matchRole && matchDept;
  });

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase.from('user_profiles').update({ role: newRole }).eq('id', userId);
      if (error) throw error;
      toast.success('Role updated');
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole as any } : u));
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleToggleActive = async (user: UserWithDept) => {
    try {
      const { error } = await supabase.from('user_profiles').update({ is_active: !user.is_active }).eq('id', user.id);
      if (error) throw error;
      toast.success(user.is_active ? 'User deactivated' : 'User activated');
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_active: !user.is_active } : u));
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const stats = {
    total: users.length,
    students: users.filter(u => u.role === 'student').length,
    admins: users.filter(u => u.role === 'admin' || u.role === 'superadmin').length,
    active: users.filter(u => u.is_active).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-600 mt-1">View and manage all registered users</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Users', value: stats.total, color: 'bg-blue-100', icon: Users, iconColor: 'text-blue-600' },
            { label: 'Students', value: stats.students, color: 'bg-green-100', icon: GraduationCap, iconColor: 'text-green-600' },
            { label: 'Admins', value: stats.admins, color: 'bg-red-100', icon: Shield, iconColor: 'text-red-600' },
            { label: 'Active', value: stats.active, color: 'bg-emerald-100', icon: Users, iconColor: 'text-emerald-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', s.color)}>
                <s.icon className={cn('w-5 h-5', s.iconColor)} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, or USN..."
              className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500" />
          </div>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500">
            <option value="">All Roles</option>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Superadmin</option>
          </select>
          <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500">
            <option value="">All Departments</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>

        <p className="text-sm text-gray-500 mb-4">{filtered.length} user{filtered.length !== 1 ? 's' : ''} found</p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center"><div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">USN</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Department</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Joined</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{u.name}</p>
                            <p className="text-xs text-gray-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{u.usn || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {u.departments ? (
                          <span className="text-sm">{u.departments.code}</span>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={u.role}
                          onChange={e => handleRoleChange(u.id, e.target.value)}
                          className={cn('px-2 py-1 rounded text-xs font-medium border-0 cursor-pointer', roleBadge[u.role])}
                        >
                          <option value="student">Student</option>
                          <option value="admin">Admin</option>
                          <option value="superadmin">Superadmin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(u.created_at)}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleActive(u)}
                          className={cn('px-2 py-1 rounded text-xs font-medium', u.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}
                        >
                          {u.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {u.semester && (
                          <span className="text-xs text-gray-500">Sem {u.semester}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No users found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
