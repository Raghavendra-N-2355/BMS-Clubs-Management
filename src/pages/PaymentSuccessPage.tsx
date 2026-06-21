import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, Download, Ticket } from 'lucide-react';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Your registration has been confirmed. You'll receive a confirmation email shortly.
          </p>

          <div className="bg-gray-50 rounded-xl p-5 mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Ticket className="w-6 h-6 text-primary-600" />
              <span className="font-semibold text-gray-900">Registration Confirmed</span>
            </div>
            <p className="text-sm text-gray-500">
              Your ticket has been generated and sent to your email.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              to="/dashboard"
              className="block w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
            >
              View My Events
            </Link>
            <Link
              to="/events"
              className="block w-full py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Browse More Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
