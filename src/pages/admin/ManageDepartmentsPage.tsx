import React, { useEffect, useState } from 'react';
import { Building2, Plus, Edit, Search } from 'lucide-react';
import { supabase, Tables } from '../../lib/supabase';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

type DeptWithStats = Tables<'departments'> & {
  clubs: { count: number }[];
};

const codeColors: Record<string, string> = {
  CSE: 'from-blue-500 to-cyan-500',
  ISE: 'from-green-500 to-emerald-500',
  AIML: 'from-purple-500 to-pink-500',
  ECE: 'from-orange-500 to-amber-500',
  EE: 'from-yellow-500 to-orange-500',
  ME: 'from-red-500 to-rose-500',
  CE: 'from-teal-500 to-cyan-500',
  BT: 'from-lime-500 to-green-500',
  COLLEGE: 'from-gray-500 to-slate-500',
};

export default function ManageDepartmentsPage() {
  const [departments, setDepartments] = useState<DeptWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState<DeptWithStats | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', description: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const { data } = await supabase.from('departments').select('*, clubs(count)').order('name');
    if (data) setDepartments(data as DeptWithStats[]);
    setLoading(false);
  };

  const filtered = departments.filter(d =>
    !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.code.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingDept(null);
    setFormData({ name: '', code: '', description: '' });
    setShowModal(true);
  };

  const openEdit = (dept: DeptWithStats) => {
    setEditingDept(dept);
    setFormData({ name: dept.name, code: dept.code, description: dept.description || '' });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      toast.error('Name and code are required');
      return;
    }
    setSaving(true);
    try {
      if (editingDept) {
        const { error } = await supabase.from('departments').update(formData).eq('id', editingDept.id);
        if (error) throw error;
        toast.success('Department updated');
      } else {
        const { error } = await supabase.from('departments').insert(formData);
        if (error) throw error;
        toast.success('Department created');
      }
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Departments</h1>
            <p className="text-gray-600 mt-1">{departments.length} departments at BMSCE</p>
          </div>
          <button onClick={openCreate} className="inline-flex items-center px-5 py-2.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700">
            <Plus className="w-5 h-5 mr-2" />
            Add Department
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search departments..." className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(dept => {
              const clubCount = dept.clubs?.[0]?.count || 0;
              const gradient = codeColors[dept.code] || 'from-gray-500 to-slate-500';
              return (
                <div key={dept.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className={cn('h-24 bg-gradient-to-br relative', gradient)}>
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute bottom-3 left-4 text-white">
                      <span className="text-xs font-medium opacity-80">{dept.code}</span>
                      <p className="font-display font-bold text-lg leading-tight">{dept.name}</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{dept.description || 'No description'}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span>{clubCount} clubs</span>
                      </div>
                      <button onClick={() => openEdit(dept)} className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium">
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-display font-bold">{editingDept ? 'Edit Department' : 'Add Department'}</h2>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department Name *</label>
                <input type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                <input type="text" value={formData.code} onChange={e => setFormData(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., CSE" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-50 rounded-xl">Cancel</button>
                <button type="submit" disabled={saving} className="px-6 py-2.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50">
                  {saving ? 'Saving...' : (editingDept ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
