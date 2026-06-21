import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Tables } from '../lib/supabase';
import DepartmentCard from '../components/DepartmentCard';

type DepartmentWithStats = Tables<'departments'> & {
  clubs: { count: number } | null;
  _count?: { clubs: number };
};

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<DepartmentWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*, clubs(count)')
        .order('name');

      if (error) throw error;
      setDepartments(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Departments
          </h1>
          <p className="text-white/80 max-w-2xl">
            Explore engineering departments and discover their clubs, events, and activities at BMSCE
          </p>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl animate-pulse">
                  <div className="h-28 bg-gray-200"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : departments.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {departments.map(dept => (
                <DepartmentCard key={dept.id} department={dept as any} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No departments found
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
