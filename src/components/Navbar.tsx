import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, User, LogOut, Calendar, Building2, Users,
  Settings, LayoutDashboard, ChevronDown, Bell, Shield,
  Ticket, UserCog
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const profileRef = useRef<HTMLDivElement>(null);
  const adminRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
    setIsAdminDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setIsProfileDropdownOpen(false);
      if (adminRef.current && !adminRef.current.contains(e.target as Node)) setIsAdminDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isAdmin = profile?.role === 'admin' || profile?.role === 'superadmin';

  const navLinks = [
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/departments', label: 'Departments', icon: Building2 },
    { path: '/clubs', label: 'Clubs', icon: Users },
  ];

  const adminLinks = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/events', label: 'Events', icon: Calendar },
    { path: '/admin/clubs', label: 'Clubs', icon: Users },
    { path: '/admin/departments', label: 'Departments', icon: Building2 },
    { path: '/admin/users', label: 'Users', icon: UserCog },
    { path: '/admin/registrations', label: 'Registrations', icon: Ticket },
  ];

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-display font-bold text-lg">B</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-display font-bold text-gray-900 leading-tight">BMSCE Connect</span>
              <span className="text-xs text-gray-500 -mt-0.5">Clubs & Events</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + '/');
              return (
                <Link key={link.path} to={link.path}
                  className={cn('flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}>
                  <Icon className="w-4 h-4 mr-2" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                {/* Admin Dropdown */}
                {isAdmin && (
                  <div className="relative" ref={adminRef}>
                    <button
                      onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                      className={cn('flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        location.pathname.startsWith('/admin') ? 'bg-red-50 text-red-700' : 'text-gray-600 hover:bg-gray-100'
                      )}
                    >
                      <Shield className="w-4 h-4 mr-1.5" />
                      Admin
                      <ChevronDown className={cn('w-3.5 h-3.5 ml-1 transition-transform', isAdminDropdownOpen && 'rotate-180')} />
                    </button>
                    {isAdminDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 py-2 animate-slide-down">
                        <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin Panel</p>
                        {adminLinks.map(link => {
                          const Icon = link.icon;
                          // Hide "Create Event" for non-superadmins
                          if (link.path === '/admin/events/create' && profile?.role !== 'superadmin') {
                            return null;
                          }
                          return (
                            <Link key={link.path} to={link.path}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                              <Icon className="w-4 h-4 mr-3 text-gray-400" />
                              {link.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{profile?.name?.charAt(0).toUpperCase() || 'U'}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">{profile?.name || 'User'}</span>
                    <ChevronDown className={cn('w-4 h-4 text-gray-500 transition-transform', isProfileDropdownOpen && 'rotate-180')} />
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 animate-slide-down">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{profile?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
                        <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1',
                          profile?.role === 'superadmin' ? 'bg-red-100 text-red-700' :
                          profile?.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        )}>
                          {profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1)}
                        </span>
                      </div>
                      <Link to="/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <LayoutDashboard className="w-4 h-4 mr-3" />Dashboard
                      </Link>
                      <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <User className="w-4 h-4 mr-3" />My Profile
                      </Link>
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button onClick={signOut} className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                          <LogOut className="w-4 h-4 mr-3" />Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                  Sign in
                </Link>
                <Link to="/register" className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-medium rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all shadow-md hover:shadow-lg">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 animate-slide-down">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link key={link.path} to={link.path}
                  className={cn('flex items-center px-4 py-3 text-base font-medium transition-colors',
                    isActive ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-600' : 'text-gray-600 hover:bg-gray-50'
                  )}>
                  <Icon className="w-5 h-5 mr-3" />
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-4 pt-4 border-t border-gray-100">
              {user ? (
                <>
                  <Link to="/dashboard" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50">
                    <LayoutDashboard className="w-5 h-5 mr-3" />Dashboard
                  </Link>
                  <Link to="/profile" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50">
                    <User className="w-5 h-5 mr-3" />Profile
                  </Link>
                  {isAdmin && (
                    <>
                      <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-2">Admin</div>
                      {adminLinks.map(link => {
                        const Icon = link.icon;
                        return (
                          <Link key={link.path} to={link.path} className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 pl-8">
                            <Icon className="w-5 h-5 mr-3" />{link.label}
                          </Link>
                        );
                      })}
                    </>
                  )}
                  <button onClick={signOut} className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 mt-2 border-t border-gray-100">
                    <LogOut className="w-5 h-5 mr-3" />Sign out
                  </button>
                </>
              ) : (
                <div className="space-y-2 px-4">
                  <Link to="/login" className="block w-full py-3 text-center text-gray-700 hover:text-primary-600">Sign in</Link>
                  <Link to="/register" className="block w-full py-3 text-center bg-primary-600 text-white rounded-lg hover:bg-primary-700">Get Started</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
