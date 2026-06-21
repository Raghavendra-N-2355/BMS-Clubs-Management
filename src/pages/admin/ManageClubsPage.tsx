import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Plus, Edit, Trash2, Eye, Search } from 'lucide-react';
import { supabase, Tables } from '../../lib/supabase';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

type ClubWithDept = Tables<'clubs'> & {
  departments: { name: string; code: string } | null;
};

const departmentColors: Record<string, string> = {
  CSE: 'bg-blue-100 text-blue-700',
  ISE: 'bg-green-100 text-green-700',
  AIML: 'bg-purple-100 text-purple-700',
  ECE: 'bg-orange-100 text-orange-700',
  EE: 'bg-yellow-100 text-yellow-700',
  ME: 'bg-red-100 text-red-700',
  CE: 'bg-teal-100 text-teal-700',
  BT: 'bg-lime-100 text-lime-700',
  COLLEGE: 'bg-gray-100 text-gray-700',
};

export default function ManageClubsPage() {
  const [clubs, setClubs] = useState<ClubWithDept[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [departments, setDepartments] = useState<Tables<'departments'>[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingClub, setEditingClub] = useState<ClubWithDept | null>(null);
  const [formData, setFormData] = useState({
    name: '', department_id: '', description: '',
    faculty_coordinator_name: '', faculty_coordinator_email: '',
    student_coordinator_name: '', student_coordinator_email: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [{ data: clubsData }, { data: deptsData }] = await Promise.all([
      supabase.from('clubs').select('*, departments(name, code)').order('name'),
      supabase.from('departments').select('*').order('name'),
    ]);
    if (clubsData) setClubs(clubsData);
    if (deptsData) setDepartments(deptsData);
    setLoading(false);
  };

  const filtered = clubs.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.departments?.name.toLowerCase().includes(q);
    const matchDept = !deptFilter || c.department_id === deptFilter;
    return matchSearch && matchDept;
  });

  const openCreate = () => {
    setEditingClub(null);
    setFormData({ name: '', department_id: '', description: '', faculty_coordinator_name: '', faculty_coordinator_email: '', student_coordinator_name: '', student_coordinator_email: '' });
    setShowCreateModal(true);
  };

  const openEdit = (club: ClubWithDept) => {
    setEditingClub(club);
    setFormData({
      name: club.name,
      department_id: club.department_id,
      description: club.description || '',
      faculty_coordinator_name: club.faculty_coordinator_name || '',
      faculty_coordinator_email: club.faculty_coordinator_email || '',
      student_coordinator_name: club.student_coordinator_name || '',
      student_coordinator_email: club.student_coordinator_email || '',
    });
    setShowCreateModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.department_id) {
      toast.error('Name and department are required');
      return;
    }
    setSaving(true);
    try {
      if (editingClub) {
        const { error } = await supabase.from('clubs').update(formData).eq('id', editingClub.id);
        if (error) throw error;
        toast.success('Club updated');
      } else {
        const { error } = await supabase.from('clubs').insert(formData);
        if (error) throw error;
        toast.success('Club created');
      }
      setShowCreateModal(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (club: ClubWithDept) => {
    try {
      const { error } = await supabase.from('clubs').update({ is_active: !club.is_active }).eq('id', club.id);
      if (error) throw error;
      toast.success(club.is_active ? 'Club deactivated' : 'Club activated');
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Manage Clubs</h1>
            <p className="text-gray-600 mt-1">{clubs.length} clubs across all departments</p>
          </div>
          <button onClick={openCreate} className="inline-flex items-center px-5 py-2.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors">
            <Plus className="w-5 h-5 mr-2" />
            Add Club
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search clubs..."
              className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Departments</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {['CSE', 'ISE', 'AIML', 'ECE'].map(code => {
            const count = clubs.filter(c => c.departments?.code === code).length;
            return (
              <div key={code} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
                <span className={cn('px-2 py-1 rounded text-xs font-bold', departmentColors[code])}>{code}</span>
                <div>
                  <p className="text-xl font-bold text-gray-900">{count}</p>
                  <p className="text-xs text-gray-500">clubs</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Club</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Department</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Coordinators</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Members</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(club => (
                    <tr key={club.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {club.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{club.name}</p>
                            <p className="text-xs text-gray-500 line-clamp-1 max-w-xs">{club.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn('px-2 py-1 rounded text-xs font-medium', departmentColors[club.departments?.code || ''] || 'bg-gray-100 text-gray-700')}>
                          {club.departments?.code}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{club.faculty_coordinator_name || '-'}</p>
                        <p className="text-xs text-gray-500">{club.student_coordinator_name || '-'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">{club.member_count}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleActive(club)}
                          className={cn('px-2 py-1 rounded text-xs font-medium', club.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}
                        >
                          {club.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/clubs/${club.id}`} className="p-2 text-gray-400 hover:text-primary-600">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button onClick={() => openEdit(club)} className="p-2 text-gray-400 hover:text-blue-600">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-display font-bold text-gray-900">{editingClub ? 'Edit Club' : 'Create Club'}</h2>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Club Name *</label>
                  <input type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                  <select value={formData.department_id} onChange={e => setFormData(p => ({ ...p, department_id: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" required>
                    <option value="">Select Department</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Faculty Coordinator Name</label>
                  <input type="text" value={formData.faculty_coordinator_name} onChange={e => setFormData(p => ({ ...p, faculty_coordinator_name: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Faculty Coordinator Email</label>
                  <input type="email" value={formData.faculty_coordinator_email} onChange={e => setFormData(p => ({ ...p, faculty_coordinator_email: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Coordinator Name</label>
                  <input type="text" value={formData.student_coordinator_name} onChange={e => setFormData(p => ({ ...p, student_coordinator_name: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Coordinator Email</label>
                  <input type="email" value={formData.student_coordinator_email} onChange={e => setFormData(p => ({ ...p, student_coordinator_email: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-50 rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={saving}
                  className="px-6 py-2.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50">
                  {saving ? 'Saving...' : (editingClub ? 'Update Club' : 'Create Club')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
