import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, ChevronLeft, Upload, Check, AlertCircle,
  CreditCard, ArrowRight, QrCode, Image, FileImage
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../lib/supabase';
import { Tables } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { formatDate, formatTime, formatCurrency, cn } from '../lib/utils';
import toast from 'react-hot-toast';

type EventWithRelations = Tables<'events'> & {
  clubs: { id: string; name: string } | null;
  departments: { id: string; name: string } | null;
};

// Dummy UPI details for demo
const UPI_DETAILS = {
  upiId: 'bmsce.events@oksbi',
  name: 'BMSCE Events',
  note: 'Event Registration Fee',
};

export default function PaidEventRegistrationPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [event, setEvent] = useState<EventWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [registrationData, setRegistrationData] = useState<Tables<'registrations'> | null>(null);

  useEffect(() => {
    if (!user) {
      toast.error('Please login to register for events');
      navigate('/login');
      return;
    }
    if (eventId) fetchEvent();
  }, [eventId, user]);

  const fetchEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          clubs ( id, name ),
          departments ( id, name )
        `)
        .eq('id', eventId)
        .single();

      if (error) throw error;

      // Check if already registered
      const { data: existingReg } = await supabase
        .from('registrations')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', user!.id)
        .maybeSingle();

      if (existingReg) {
        setRegistrationData(existingReg);
        setRegistrationComplete(true);
      }

      setEvent(data);
    } catch (error) {
      console.error('Error fetching event:', error);
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      setScreenshotFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setScreenshotPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!utrNumber.trim()) {
      toast.error('Please enter the UTR/Transaction ID');
      return;
    }

    if (!screenshotFile) {
      toast.error('Please upload the payment screenshot');
      return;
    }

    if (!event || !user) return;

    setSubmitting(true);

    try {
      // Upload screenshot to storage (we'll store it as base64 for demo simplicity)
      let screenshotUrl = '';
      const reader = new FileReader();
      reader.readAsDataURL(screenshotFile);

      await new Promise<void>((resolve) => {
        reader.onload = async () => {
          screenshotUrl = reader.result as string;
          resolve();
        };
      });

      // Create registration with pending status
      const { data: registration, error: regError } = await supabase
        .from('registrations')
        .insert({
          event_id: event.id,
          user_id: user.id,
          status: 'pending',
          payment_status: 'pending',
          amount_paid: event.registration_fee,
          notes: `UTR: ${utrNumber}\nScreenshot: ${screenshotUrl.substring(0, 100)}...`,
        })
        .select()
        .single();

      if (regError) throw regError;

      // Update current participants count
      await supabase
        .from('events')
        .update({ current_participants: (event.current_participants || 0) + 1 })
        .eq('id', event.id);

      // Create payment record for admin verification
      await supabase
        .from('payments')
        .insert({
          registration_id: registration.id,
          user_id: user.id,
          amount: event.registration_fee,
          currency: 'INR',
          status: 'pending',
          payment_method: 'upi',
          receipt_url: screenshotUrl,
        });

      setRegistrationData(registration);
      setRegistrationComplete(true);
      toast.success('Registration submitted! Awaiting admin verification.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit registration');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen pt-24 bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Event not found</p>
      </div>
    );
  }

  const upiPaymentString = `upi://pay?pa=${UPI_DETAILS.upiId}&pn=${encodeURIComponent(UPI_DETAILS.name)}&am=${event.registration_fee}&tn=${encodeURIComponent(UPI_DETAILS.note + ' - ' + event.title)}`;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Link
          to={`/events/${event.id}`}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 text-sm"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Event
        </Link>

        {registrationComplete ? (
          /* Success State */
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
              Registration Submitted!
            </h1>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Your registration for <strong>{event.title}</strong> has been submitted successfully.
              Our admin team will verify your payment and confirm your registration shortly.
            </p>

            {registrationData && (
              <div className="inline-block p-6 bg-gray-50 rounded-xl mb-6">
                <p className="text-sm text-gray-500 mb-2">Registration ID</p>
                <p className="font-mono font-bold text-lg text-gray-900">{registrationData.ticket_number || registrationData.id.substring(0, 8)}</p>
                <p className="text-xs text-gray-400 mt-2">Status: Pending Verification</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
              >
                View My Registrations
              </Link>
              <Link
                to="/events"
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Browse More Events
              </Link>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left side - Payment QR */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h2>

                {/* Event Summary */}
                <div className="p-4 bg-gray-50 rounded-xl mb-6">
                  <p className="font-medium text-gray-900">{event.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{event.clubs?.name}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                    <span className="text-gray-600">Registration Fee</span>
                    <span className="text-xl font-bold text-primary-600">
                      {formatCurrency(event.registration_fee)}
                    </span>
                  </div>
                </div>

                {/* QR Code */}
                <div className="text-center mb-6">
                  <p className="text-sm font-medium text-gray-600 mb-4">Scan QR to Pay</p>
                  <div className="inline-block p-4 bg-white rounded-xl shadow-md border border-gray-100">
                    <QRCodeSVG
                      value={upiPaymentString}
                      size={180}
                      level="H"
                      includeMargin
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Scan with any UPI app (GPay, PhonePe, Paytm, etc.)
                  </p>
                </div>

                {/* UPI Details */}
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-xs font-medium text-blue-900 uppercase tracking-wide mb-2">UPI ID</p>
                  <p className="text-lg font-mono font-semibold text-blue-700">{UPI_DETAILS.upiId}</p>
                  <p className="text-xs text-blue-600 mt-2">
                    Amount: {formatCurrency(event.registration_fee)}
                  </p>
                </div>

                {/* Instructions */}
                <div className="mt-6 space-y-3 text-sm text-gray-600">
                  <p className="font-medium text-gray-900">How to Pay:</p>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Scan the QR code or use the UPI ID</li>
                    <li>Pay exactly <strong>{formatCurrency(event.registration_fee)}</strong></li>
                    <li>Save the UTR/Transaction ID</li>
                    <li>Take a screenshot of the payment</li>
                    <li>Fill the form and submit</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-display font-bold text-gray-900 mb-6">
                  Complete Registration
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* User Details */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-2">Registering as</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                        {profile?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{profile?.name}</p>
                        <p className="text-sm text-gray-500">{profile?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* UTR Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      UTR / Transaction ID <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 16))}
                        placeholder="e.g., 123456789012"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1.5">
                        Enter the 12-digit UTR number from your payment confirmation
                      </p>
                    </div>
                  </div>

                  {/* Screenshot Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Screenshot <span className="text-red-500">*</span>
                    </label>

                    {screenshotPreview ? (
                      <div className="relative">
                        <img
                          src={screenshotPreview}
                          alt="Payment screenshot"
                          className="w-full max-h-64 object-contain rounded-xl border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setScreenshotPreview(null);
                            setScreenshotFile(null);
                          }}
                          className="absolute top-2 right-2 p-2 bg-white/90 rounded-lg shadow-sm hover:bg-white"
                        >
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    ) : (
                      <label className="block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleScreenshotChange}
                          className="hidden"
                        />
                        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                        <p className="font-medium text-gray-700">Click to upload screenshot</p>
                        <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                      </label>
                    )}
                    <p className="text-xs text-gray-500 mt-1.5">
                      Upload a clear screenshot showing the successful payment
                    </p>
                  </div>

                  {/* Important Notice */}
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-amber-800">
                        <p className="font-medium">Important</p>
                        <ul className="mt-1 space-y-1 text-amber-700">
                          <li>Your registration will be confirmed after admin verifies the payment</li>
                          <li>Make sure the UTR number matches your payment</li>
                          <li>Payment verification may take up to 24 hours</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={submitting || !utrNumber || !screenshotFile}
                      className={cn(
                        'w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all',
                        submitting || !utrNumber || !screenshotFile
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl'
                      )}
                    >
                      {submitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Registration
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
