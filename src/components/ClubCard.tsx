import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, ArrowRight } from 'lucide-react';
import { Tables } from '../lib/supabase';
import { truncate, cn } from '../lib/utils';

interface ClubCardProps {
  club: Tables<'clubs'> & {
    departments: { name: string } | null;
  };
}

const clubColors = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-green-500 to-emerald-500',
  'from-orange-500 to-amber-500',
  'from-red-500 to-rose-500',
  'from-indigo-500 to-violet-500',
];

export default function ClubCard({ club }: ClubCardProps) {
  const colorIndex = Math.abs(club.name.charCodeAt(0) - 65) % clubColors.length;
  const gradientClass = clubColors[colorIndex];

  return (
    <Link
      to={`/clubs/${club.id}`}
      className="group block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-primary-200 transition-all duration-300"
    >
      {/* Club Cover */}
      <div className={cn(
        'relative h-32 bg-gradient-to-br',
        gradientClass
      )}>
        {club.cover_image_url ? (
          <img
            src={club.cover_image_url}
            alt={club.name}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white/40 text-6xl font-bold">
              {club.name.charAt(0)}
            </span>
          </div>
        )}

        {/* Logo overlay */}
        <div className="absolute -bottom-8 left-4">
          <div className={cn(
            'w-16 h-16 rounded-xl bg-gradient-to-br shadow-lg flex items-center justify-center border-4 border-white',
            gradientClass
          )}>
            {club.logo_url ? (
              <img src={club.logo_url} alt="" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <span className="text-white text-xl font-bold">
                {club.name.charAt(0)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-12 px-5 pb-5">
        <div className="mb-2">
          <span className="text-xs font-medium text-gray-500">
            {club.departments?.name}
          </span>
        </div>

        <h3 className="font-display font-semibold text-lg text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
          {club.name}
        </h3>

        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {truncate(club.description || 'No description available', 100)}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-1.5 text-gray-400" />
            {club.member_count}+ members
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
            Active
          </div>
        </div>

        {/* Action */}
        <div className="flex items-center justify-end pt-3 border-t border-gray-100">
          <div className="flex items-center text-primary-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
            View Club
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
