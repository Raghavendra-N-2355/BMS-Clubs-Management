import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, Calendar, RefreshCw } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>

          <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
            Payment Cancelled
          </h1>
          <p className="text-gray-600 mb-6">
            Your payment was cancelled. You can try again or contact support if you need help.
          </p>

          <div className="bg-gray-50 rounded-xl p-5 mb-6">
            <p className="text-sm text-gray-500">
              Don't worry - no charges were made to your account.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              to="/events"
              className="block w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 inline mr-2" />
              Try Again
            </Link>
            <Link
              to="/dashboard"
              className="block w-full py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
