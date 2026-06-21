import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Building2, Users, Mail, Phone, MapPin,
  Facebook, Twitter, Linkedin, Instagram, Youtube
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { label: 'Events', path: '/events' },
      { label: 'Departments', path: '/departments' },
      { label: 'Clubs', path: '/clubs' },
      { label: 'Calendar', path: '/events' },
    ],
    resources: [
      { label: 'Student Portal', path: '/dashboard' },
      { label: 'Admin Portal', path: '/admin' },
      { label: 'Help Center', path: '#' },
      { label: 'Guidelines', path: '#' },
    ],
    legal: [
      { label: 'Privacy Policy', path: '#' },
      { label: 'Terms of Service', path: '#' },
      { label: 'Contact Us', path: '#' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-display font-bold text-lg">B</span>
              </div>
              <div>
                <span className="text-lg font-display font-bold text-white">
                  BMSCE Connect
                </span>
                <span className="block text-xs text-gray-400">
                  Clubs & Events Platform
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm mb-6 max-w-md">
              The centralized digital platform for B.M.S. College of Engineering, Bengaluru.
              Discover clubs, register for events, and enhance your college experience.
            </p>
            <div className="space-y-2 text-sm">
              <a href="https://bmsce.ac.in" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-400 hover:text-white transition-colors">
                <MapPin className="w-4 h-4 mr-2" />
                Bull Temple Road, Bengaluru - 560019
              </a>
              <a href="mailto:connect@bmsce.ac.in" className="flex items-center text-gray-400 hover:text-white transition-colors">
                <Mail className="w-4 h-4 mr-2" />
                connect@bmsce.ac.in
              </a>
              <a href="tel:+918026605320" className="flex items-center text-gray-400 hover:text-white transition-colors">
                <Phone className="w-4 h-4 mr-2" />
                +91 80 2660 5320
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-10 pt-6 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors group"
                  >
                    <Icon className="w-5 h-5 text-gray-400 group-hover:text-white" />
                  </a>
                );
              })}
            </div>
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} BMSCE Connect. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
