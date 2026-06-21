import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase, Tables } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { ChevronLeft, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [departments, setDepartments] = useState<Tables<'departments'>[]>([]);
  const [clubs, setClubs] = useState<Tables<'clubs'>[]>([]);

  // Only superadmin can edit events
  const canEditEvents = profile?.role === 'superadmin';

  const [formData, setFormData] = useState({
    title: '', description: '', club_id: '', department_id: '',
    category: 'workshop', event_type: 'offline', venue: '',
    online_link: '', event_date: '', start_time: '', end_time: '',
    registration_fee: '0', max_participants: '', registration_deadline: '',
    prerequisites: '', tags: '', is_registration_open: true, is_approved: true,
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (formData.department_id) fetchClubsByDept(formData.department_id);
  }, [formData.department_id]);

  const fetchData = async () => {
    const [{ data: event }, { data: depts }] = await Promise.all([
      supabase.from('events').select('*').eq('id', id!).single(),
      supabase.from('departments').select('*').neq('code', 'COLLEGE').order('name'),
    ]);
    if (depts) setDepartments(depts);
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        club_id: event.club_id || '',
        department_id: event.department_id || '',
        category: event.category,
        event_type: event.event_type,
        venue: event.venue || '',
        online_link: event.online_link || '',
        event_date: event.event_date,
        start_time: event.start_time || '',
        end_time: event.end_time || '',
        registration_fee: String(event.registration_fee),
        max_participants: event.max_participants ? String(event.max_participants) : '',
        registration_deadline: event.registration_deadline ? event.registration_deadline.substring(0, 16) : '',
        prerequisites: event.prerequisites || '',
        tags: (event.tags || []).join(', '),
        is_registration_open: event.is_registration_open,
        is_approved: event.is_approved,
      });
    }
    setLoading(false);
  };

  const fetchClubsByDept = async (deptId: string) => {
    const { data } = await supabase.from('clubs').select('*').eq('department_id', deptId).eq('is_active', true);
    if (data) setClubs(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.club_id || !formData.event_date) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from('events').update({
        title: formData.title,
        description: formData.description || null,
        club_id: formData.club_id,
        department_id: formData.department_id || null,
        category: formData.category as any,
        event_type: formData.event_type as any,
        venue: formData.venue || null,
        online_link: formData.online_link || null,
        event_date: formData.event_date,
        start_time: formData.start_time || null,
        end_time: formData.end_time || null,
        registration_fee: parseFloat(formData.registration_fee) || 0,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
        registration_deadline: formData.registration_deadline || null,
        prerequisites: formData.prerequisites || null,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : null,
        is_registration_open: formData.is_registration_open,
        is_approved: formData.is_approved,
      }).eq('id', id!);
      if (error) throw error;
      toast.success('Event updated successfully!');
      navigate('/admin/events');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update event');
    } finally {
      setSaving(false);
    }
  };

  // Redirect if not superadmin
  if (profile && !canEditEvents) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-xl font-display font-bold text-gray-900 mb-2">Read-Only Access</h2>
            <p className="text-gray-600 mb-6">Your viewer account does not have permission to edit events. Please contact a super admin for event modifications.</p>
            <button
              onClick={() => navigate('/admin/events')}
              className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700"
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/admin/events" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 text-sm">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Events
        </Link>
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">Edit Event</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea name="description" rows={4} value={formData.description} onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select name="department_id" value={formData.department_id} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500">
                  <option value="">Select Department</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Club *</label>
                <select name="club_id" value={formData.club_id} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" required>
                  <option value="">Select Club</option>
                  {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select name="category" value={formData.category} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500">
                  {['workshop','hackathon','seminar','competition','cultural','sports','technical','other'].map(c => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Type *</label>
                <select name="event_type" value={formData.event_type} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500">
                  <option value="offline">Offline (In-person)</option>
                  <option value="online">Online</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                <input type="date" name="event_date" value={formData.event_date} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                <input type="time" name="start_time" value={formData.start_time} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                <input type="time" name="end_time" value={formData.end_time} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
              <input type="text" name="venue" value={formData.venue} onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Registration Fee (INR)</label>
                <input type="number" name="registration_fee" value={formData.registration_fee} onChange={handleChange}
                  min="0" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Participants</label>
                <input type="number" name="max_participants" value={formData.max_participants} onChange={handleChange}
                  min="1" placeholder="Unlimited"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Registration Deadline</label>
                <input type="datetime-local" name="registration_deadline" value={formData.registration_deadline} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
              <input type="text" name="tags" value={formData.tags} onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                placeholder="react, workshop, beginner" />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_registration_open" checked={formData.is_registration_open}
                  onChange={e => setFormData(p => ({ ...p, is_registration_open: e.target.checked }))}
                  className="w-4 h-4 text-primary-600 rounded" />
                <span className="text-sm font-medium text-gray-700">Registration Open</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_approved" checked={formData.is_approved}
                  onChange={e => setFormData(p => ({ ...p, is_approved: e.target.checked }))}
                  className="w-4 h-4 text-primary-600 rounded" />
                <span className="text-sm font-medium text-gray-700">Approved</span>
              </label>
            </div>
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
              <button type="button" onClick={() => navigate('/admin/events')}
                className="px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-xl transition-colors">Cancel</button>
              <button type="submit" disabled={saving}
                className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
