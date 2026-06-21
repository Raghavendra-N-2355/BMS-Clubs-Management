import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, ChevronRight } from 'lucide-react';
import { Tables } from '../lib/supabase';
import { cn } from '../lib/utils';

interface DepartmentCardProps {
  department: Tables<'departments'> & {
    clubs: { count: number } | null;
  _count?: { clubs: number };
  club_count?: number;
  member_count?: number;
  event_count?: number;
  upcoming_events?: number;
  total_members?: number;
  clubs?: any[];
  total_clubs?: number;
};
}

const departmentColors: Record<string, string> = {
  'CSE': 'from-blue-600 to-cyan-500',
  'ISE': 'from-green-600 to-emerald-500',
  'AIML': 'from-purple-600 to-pink-500',
  'ECE': 'from-orange-600 to-amber-500',
  'EE': 'from-yellow-600 to-orange-500',
  'ME': 'from-red-600 to-rose-500',
  'CE': 'from-teal-600 to-cyan-500',
  'BT': 'from-lime-600 to-green-500',
  'COLLEGE': 'from-gray-600 to-slate-500',
};

const departmentIcons: Record<string, string> = {
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

export default function DepartmentCard({ department }: DepartmentCardProps) {
  const gradientClass = departmentColors[department.code] || 'from-gray-600 to-slate-500';
  const icon = departmentIcons[department.code] || '📚';
  const clubCount = department._count?.clubs || department.club_count || department.clubs?.length || department.total_clubs || 0;

  return (
    <Link
      to={`/departments/${department.id}`}
      className="group relative block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-primary-200 transition-all duration-300"
    >
      {/* Gradient Header */}
      <div className={cn(
        'h-28 bg-gradient-to-br relative overflow-hidden',
        gradientClass
      )}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-4 right-4 text-4xl opacity-40 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div className="absolute bottom-4 left-4">
          <span className="text-white/80 text-sm font-medium">
            {department.code}
          </span>
          <h3 className="text-white font-display font-bold text-lg max-w-[200px] truncate">
            {department.name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {department.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <Building2 className="w-4 h-4 mr-1.5 text-gray-400" />
            {clubCount} Club{clubCount !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center text-primary-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
            Explore
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
