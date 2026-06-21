import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, ArrowRight } from 'lucide-react';
import { Tables } from '../lib/supabase';
import { formatDate, formatTime, formatCurrency, getDaysUntil, cn, isRegistrationOpen, getCategoryColor } from '../lib/utils';

interface EventCardProps {
  event: Tables<'events'> & {
    clubs: { name: string } | null;
    departments: { name: string } | null;
  };
  compact?: boolean;
}

export default function EventCard({ event, compact = false }: EventCardProps) {
  const daysUntil = getDaysUntil(event.event_date);
  const registrationOpen = isRegistrationOpen(
    event.is_registration_open,
    event.registration_deadline,
    event.max_participants,
    event.current_participants
  );

  const isPast = daysUntil < 0;
  const isToday = daysUntil === 0;
  const isTomorrow = daysUntil === 1;

  if (compact) {
    return (
      <Link
        to={`/events/${event.id}`}
        className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{event.title}</p>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              {formatDate(event.event_date)}
            </div>
          </div>
          <span className={cn(
            'px-2 py-1 rounded text-xs font-medium',
            getCategoryColor(event.category),
            'text-white'
          )}>
            {event.category}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/events/${event.id}`}
      className="group block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-primary-200 transition-all duration-300"
    >
      {/* Event Image Placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {event.poster_url ? (
          <img
            src={event.poster_url}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className={cn(
            'w-full h-full flex items-center justify-center',
            getCategoryColor(event.category)
          )}>
            <Calendar className="w-16 h-16 text-white/50" />
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-gray-700 shadow-sm">
            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
          </span>
        </div>

        {/* Date Badge */}
        <div className="absolute top-4 right-4">
          {isToday ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-500 text-white shadow-sm">
              Today!
            </span>
          ) : isTomorrow ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-500 text-white shadow-sm">
              Tomorrow
            </span>
          ) : daysUntil <= 7 && !isPast ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-500 text-white shadow-sm">
              In {daysUntil} days
            </span>
          ) : null}
        </div>

        {/* Registration Status */}
        {!registrationOpen && !isPast && (
          <div className="absolute bottom-4 right-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-800/80 text-white backdrop-blur-sm">
              {event.max_participants && event.current_participants >= event.max_participants
                ? 'Sold Out'
                : 'Registration Closed'}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-3">
          <span className="text-xs font-medium text-primary-600 uppercase tracking-wider">
            {event.clubs?.name}
          </span>
        </div>

        <h3 className="font-display font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {event.title}
        </h3>

        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {event.description}
        </p>

        {/* Meta Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            {formatDate(event.event_date)}
            {event.start_time && (
              <>
                <span className="mx-2 text-gray-300">|</span>
                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                {formatTime(event.start_time)}
                {event.end_time && ` - ${formatTime(event.end_time)}`}
              </>
            )}
          </div>

          {event.venue && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
              {event.venue}
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-2 text-gray-400" />
              {event.current_participants}
              {event.max_participants && ` / ${event.max_participants}`} participants
            </div>
            {event.registration_fee > 0 ? (
              <span className="font-semibold text-primary-600">
                {formatCurrency(event.registration_fee)}
              </span>
            ) : (
              <span className="text-sm font-medium text-green-600">Free</span>
            )}
          </div>
        </div>

        {/* Action */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-sm font-medium text-gray-500">
            {event.departments?.name}
          </span>
          <div className="flex items-center text-primary-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
            View Details
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
