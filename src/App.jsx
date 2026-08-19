import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import TermsPage from './pages/TermsPage';
import SupportPage from './pages/SupportPage';

import LandingPage from './pages/LandingPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MyTicketsPage from './pages/MyTicketsPage';
import TicketViewPage from './pages/TicketViewPage';
import GuestTicketPage from './pages/GuestTicketPage';
import OrgDashboardPage from './pages/OrgDashboardPage';
import CreateEventPage from './pages/CreateEventPage';
import ManageEventPage from './pages/ManageEventPage';
import ValidatePage from './pages/ValidatePage';
import RoleSelectPage from './pages/RoleSelectPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import PaymentVerifyPage from './pages/PaymentVerifyPage';
import BecomeOrganizerPage from './pages/BecomeOrganizerPage';

export default function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#111122',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '14px',
                padding: '14px 18px',
                fontSize: '14px',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: '500',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(108,71,255,0.1)',
                backdropFilter: 'blur(12px)',
                maxWidth: '420px',
              },
              success: {
                style: {
                  background: '#111122',
                  border: '1px solid rgba(74,222,128,0.2)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(74,222,128,0.1)',
                },
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#111122',
                },
              },
              error: {
                style: {
                  background: '#111122',
                  border: '1px solid rgba(248,113,113,0.2)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(248,113,113,0.1)',
                },
                iconTheme: {
                  primary: '#f87171',
                  secondary: '#111122',
                },
              },
              loading: {
                style: {
                  background: '#111122',
                  border: '1px solid rgba(108,71,255,0.2)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(108,71,255,0.1)',
                },
                iconTheme: {
                  primary: '#6c47ff',
                  secondary: '#111122',
                },
              },
            }}
          />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/ticket/:token" element={<GuestTicketPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/my-tickets" element={<ProtectedRoute><MyTicketsPage /></ProtectedRoute>} />
            <Route path="/my-tickets/:id" element={<ProtectedRoute><TicketViewPage /></ProtectedRoute>} />
            <Route path="/org/dashboard" element={<ProtectedRoute role="ORGANISER"><OrgDashboardPage /></ProtectedRoute>} />
            <Route path="/org/events/create" element={<ProtectedRoute role="ORGANISER"><CreateEventPage /></ProtectedRoute>} />
            <Route path="/org/events/:id" element={<ProtectedRoute role="ORGANISER"><ManageEventPage /></ProtectedRoute>} />
            <Route path="/validate/:eventId" element={<ValidatePage />} />
            <Route path="/select-role" element={<RoleSelectPage />} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminPage /></ProtectedRoute>} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/become-organizer" element={<ProtectedRoute><BecomeOrganizerPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/payment/verify" element={<PaymentVerifyPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}