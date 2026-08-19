import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Ticket, ArrowLeft, Clock } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { formatEventTime } from '../utils/dateTime';
import toast from 'react-hot-toast';
import FloatingTickets from '../components/ui/FloatingTickets';
import EventMap from '../components/ui/EventMap';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${id}`);
      setEvent(res.data);
    } catch {
      setEvent(MOCK_EVENT);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!user && !showGuestForm) {
      setShowGuestForm(true);
      return;
    }

    const name = user ? user.name : guestName;
    const email = user ? user.email : guestEmail;

    if (showGuestForm && (!guestName || !guestEmail)) {
      toast.error('Please fill in your name and email');
      return;
    }

    // Paid event — initialize Paystack
    if (event.price > 0) {
      try {
        setBooking(true);
        const res = await api.post('/payments/initialize', {
          eventId: event.id,
          email,
          name,
          userId: user?.id || null,
        });
        // Redirect to Paystack
        window.location.href = res.data.authorization_url;
      } catch {
        toast.error('Payment initialization failed. Try again.');
      } finally {
        setBooking(false);
      }
      return;
    }

    // Free event — book directly
    try {
      setBooking(true);
      const payload = user
        ? { eventId: event.id, userId: user.id, guestName: user.name, guestEmail: user.email }
        : { eventId: event.id, guestName, guestEmail };

      const res = await api.post('/tickets/book', payload);
      toast.success('Ticket booked! Check your email.');
      if (user) {
        navigate(`/my-tickets/${res.data.ticket.id}`);
      } else {
        navigate(`/ticket/${res.data.ticket.qrToken}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Booking failed. Try again.');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090912] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#6c47ff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const date = new Date(event.date);

  return (
    <div className="min-h-screen bg-[#090912] text-white">
      <FloatingTickets />
      <Navbar />

      <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-20">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to events
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left — main content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Hero image */}
            <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden">
              <img
                src={event.image || 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80'}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1a] via-transparent to-transparent" />
              <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full border border-white/10">
                {event.category || 'Event'}
              </span>
            </div>

            {/* Event info */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{event.title}</h1>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                  <Calendar size={15} className="text-[#6c47ff]" />
                  {date.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                  <Clock size={15} className="text-[#6c47ff]" />
                  {formatEventTime(date)}
                </div>
                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                  <MapPin size={15} className="text-[#6c47ff]" />
                  {event.venue}
                </div>
                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                  <Users size={15} className="text-[#6c47ff]" />
                  {event.capacity} capacity
                </div>
              </div>

              {/* Description */}
              <div className="bg-[#111122] border border-white/5 rounded-2xl p-6">
                <h2 className="text-white font-semibold mb-3">About this event</h2>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {event.description || 'Join us for an unforgettable experience. This event promises to be one of the highlights of the season. Secure your spot now before tickets run out.'}
                </p>
              </div>

              {/* Organiser */}
              <div className="bg-[#111122] border border-white/5 rounded-2xl p-6 mt-4">
                <h2 className="text-white font-semibold mb-3">Organised by</h2>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#6c47ff] flex items-center justify-center text-white font-bold text-sm">
                    {event.organiser?.name?.[0] || 'O'}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{event.organiser?.name || 'Event Organiser'}</p>
                    <p className="text-zinc-500 text-xs">Event organiser</p>
                  </div>
                </div>
              </div>
              {/* Map */}
              {event.latitude && event.longitude && (
                <EventMap
                  latitude={event.latitude}
                  longitude={event.longitude}
                  venue={event.venue}
                  className="h-64 mt-4"
                />
              )}
            </div>
          </div>

          {/* Right — booking card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-[#111122] border border-white/10 rounded-2xl p-6 space-y-5">
              <div>
                <p className="text-zinc-500 text-sm mb-1">Ticket price</p>
                {event.price > 0 ? (
                  <p className="text-3xl font-bold text-white">
                    GHS <span>{event.price.toFixed(2)}</span>
                  </p>
                ) : (
                  <p className="text-3xl font-bold text-white">
                    Free <span className="text-zinc-500 text-base font-normal">entry</span>
                  </p>
                )}
              </div>

              <div className="border-t border-white/5 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Date</span>
                  <span className="text-white">{date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Venue</span>
                  <span className="text-white text-right max-w-[150px]">{event.venue}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Capacity</span>
                  <span className="text-white">{event.capacity}</span>
                </div>
              </div>

              {/* Guest form */}
              {showGuestForm && !user && (
                <div className="border-t border-white/5 pt-4 space-y-3">
                  <p className="text-white text-sm font-medium">Your details</p>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-500 outline-none focus:border-[#6c47ff]/50 transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-500 outline-none focus:border-[#6c47ff]/50 transition-colors"
                  />
                </div>
              )}

              <button
                onClick={handleBook}
                disabled={booking || (showGuestForm && (!guestName || !guestEmail))}
                className="w-full flex items-center justify-center gap-2 bg-[#6c47ff] hover:bg-[#7c57ff] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3.5 rounded-xl transition-all duration-200"
              >
                {booking ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Ticket size={16} />
                    {event.price > 0
                      ? `Pay GHS ${event.price.toFixed(2)}`
                      : showGuestForm && !user ? 'Confirm Booking' : user ? 'Book Ticket' : 'Get Ticket'}
                  </>
                )}
              </button>

              {!user && !showGuestForm && (
                <p className="text-zinc-600 text-xs text-center">
                  Have an account?{' '}
                  <button onClick={() => navigate('/login')} className="text-[#a78bfa] hover:text-white transition-colors">
                    Sign in
                  </button>{' '}
                  for faster booking
                </p>
              )}

              {!user && showGuestForm && (
                <p className="text-zinc-600 text-xs text-center">
                  Your QR ticket will be sent to your email
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const MOCK_EVENT = {
  id: '1',
  title: 'Afro Nation Ghana',
  venue: 'Accra Sports Stadium',
  date: '2025-12-12T20:00:00',
  capacity: 5000,
  category: 'Concert',
  description: 'Afro Nation Ghana is the biggest Afrobeats festival on the continent. Featuring top artists from across Africa and the diaspora, this is a night you cannot afford to miss.',
  image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
  organiser: { name: 'Afro Nation Events' },
};