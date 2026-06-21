import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(time: string | null): string {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatEventType(type: string): string {
  const types: Record<string, string> = {
    workshop: 'Workshop',
    hackathon: 'Hackathon',
    seminar: 'Seminar',
    competition: 'Competition',
    cultural: 'Cultural Event',
    sports: 'Sports Event',
    technical: 'Technical Event',
    other: 'Event',
  };
  return types[type] || type;
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    workshop: 'workshop',
    hackathon: 'code',
    seminar: 'presentation',
    competition: 'trophy',
    cultural: 'music',
    sports: 'trophy',
    technical: 'cpu',
    other: 'calendar',
  };
  return icons[category] || 'calendar';
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    workshop: 'bg-blue-500',
    hackathon: 'bg-purple-500',
    seminar: 'bg-green-500',
    competition: 'bg-amber-500',
    cultural: 'bg-pink-500',
    sports: 'bg-orange-500',
    technical: 'bg-cyan-500',
    other: 'bg-gray-500',
  };
  return colors[category] || 'bg-gray-500';
}

export function getDaysUntil(date: string | Date): number {
  const eventDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);
  const diffTime = eventDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function isRegistrationOpen(
  isRegistrationOpen: boolean,
  registrationDeadline: string | null,
  maxParticipants: number | null,
  currentParticipants: number
): boolean {
  if (!isRegistrationOpen) return false;

  if (registrationDeadline) {
    const deadline = new Date(registrationDeadline);
    if (deadline < new Date()) return false;
  }

  if (maxParticipants !== null && currentParticipants >= maxParticipants) {
    return false;
  }

  return true;
}

export function getStatusBadgeColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    waitlisted: 'bg-blue-100 text-blue-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getPaymentStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
}

export function generateQRValue(ticketNumber: string, eventId: string, userId: string): string {
  return `BMSCE-${ticketNumber}-${eventId}-${userId}`;
}

export function calculateEndTime(start: string, durationMinutes: number): string {
  const [hours, minutes] = start.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
}
