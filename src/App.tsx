import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import DepartmentsPage from './pages/DepartmentsPage';
import DepartmentDetailPage from './pages/DepartmentDetailPage';
import ClubsPage from './pages/ClubsPage';
import ClubDetailPage from './pages/ClubDetailPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import CreateEventPage from './pages/admin/CreateEventPage';
import EditEventPage from './pages/admin/EditEventPage';
import ManageEventsPage from './pages/admin/ManageEventsPage';
import ManageClubsPage from './pages/admin/ManageClubsPage';
import ManageDepartmentsPage from './pages/admin/ManageDepartmentsPage';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import RegistrationsPage from './pages/admin/RegistrationsPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentCancelPage from './pages/PaymentCancelPage';
import PaidEventRegistrationPage from './pages/PaidEventRegistrationPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { background: '#363636', color: '#fff' },
            success: { style: { background: '#10b981' } },
            error: { style: { background: '#ef4444' } },
          }}
        />
        <Routes>
          <Route path="/" element={<Layout><LandingPage /></Layout>} />
          <Route path="/login" element={<Layout><LoginPage /></Layout>} />
          <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
          <Route path="/events" element={<Layout><EventsPage /></Layout>} />
          <Route path="/events/:id" element={<Layout><EventDetailPage /></Layout>} />
          <Route path="/departments" element={<Layout><DepartmentsPage /></Layout>} />
          <Route path="/departments/:id" element={<Layout><DepartmentDetailPage /></Layout>} />
          <Route path="/clubs" element={<Layout><ClubsPage /></Layout>} />
          <Route path="/clubs/:id" element={<Layout><ClubDetailPage /></Layout>} />

          <Route path="/dashboard" element={
            <PrivateRoute><Layout><DashboardPage /></Layout></PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute><Layout><ProfilePage /></Layout></PrivateRoute>
          } />
          <Route path="/payment/success" element={
            <PrivateRoute><Layout><PaymentSuccessPage /></Layout></PrivateRoute>
          } />
          <Route path="/payment/cancel" element={
            <PrivateRoute><Layout><PaymentCancelPage /></Layout></PrivateRoute>
          } />
          <Route path="/register/:eventId" element={
            <PrivateRoute><Layout><PaidEventRegistrationPage /></Layout></PrivateRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <PrivateRoute adminOnly><Layout><AdminDashboardPage /></Layout></PrivateRoute>
          } />
          <Route path="/admin/events/create" element={
            <PrivateRoute adminOnly><Layout><CreateEventPage /></Layout></PrivateRoute>
          } />
          <Route path="/admin/events/:id/edit" element={
            <PrivateRoute adminOnly><Layout><EditEventPage /></Layout></PrivateRoute>
          } />
          <Route path="/admin/events" element={
            <PrivateRoute adminOnly><Layout><ManageEventsPage /></Layout></PrivateRoute>
          } />
          <Route path="/admin/clubs" element={
            <PrivateRoute adminOnly><Layout><ManageClubsPage /></Layout></PrivateRoute>
          } />
          <Route path="/admin/departments" element={
            <PrivateRoute adminOnly><Layout><ManageDepartmentsPage /></Layout></PrivateRoute>
          } />
          <Route path="/admin/users" element={
            <PrivateRoute adminOnly><Layout><ManageUsersPage /></Layout></PrivateRoute>
          } />
          <Route path="/admin/registrations" element={
            <PrivateRoute adminOnly><Layout><RegistrationsPage /></Layout></PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
