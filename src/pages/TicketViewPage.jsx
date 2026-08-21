import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  CalendarPlus,
  Clock,
  Download,
  MapPin,
  Navigation,
  Share2,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import FloatingTickets from '../components/ui/FloatingTickets';
import api from '../services/api';
import toast from 'react-hot-toast';
import { formatEventTime } from '../utils/dateTime';

const formatCalendarDate = (value) =>
  value.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');

const FALLBACK_EVENT_IMAGE = 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=900&q=80';

export default function TicketViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    let active = true;

    const fetchTicket = async () => {
      setLoading(true);
      setTicket(null);
      setQrDataUrl(null);

      try {
        const ticketResponse = await api.get(`/tickets/token/${id}`);
        const currentTicket = ticketResponse.data;

        if (!active) return;

        setTicket(currentTicket);

        try {
          const qrResponse = await api.get(`/tickets/qr/${currentTicket.qrToken}`);
          if (active) setQrDataUrl(qrResponse.data.qrDataUrl);
        } catch {
          if (active) toast.error('Could not load QR code. Try refreshing.');
        }
      } catch {
        if (active) {
          toast.error('Ticket not found');
          navigate('/my-tickets', { replace: true });
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchTicket();
    return () => { active = false; };
  }, [id, navigate]);

  const handleDownload = () => {
    if (!qrDataUrl || !ticket) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `passify-ticket-${ticket.id}.png`;
    link.click();
  };

  const handleShare = async () => {
    if (!ticket) return;
    const url = `${window.location.origin}/ticket/${ticket.qrToken}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: ticket.event?.title || 'My Passify ticket', url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Ticket link copied to clipboard!');
      }
    } catch (error) {
      if (error.name !== 'AbortError') toast.error('Could not share this ticket.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090912] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#6c47ff] border-t-transparent rounded-full animate-spin" aria-label="Loading ticket" />
      </div>
    );
  }

  if (!ticket) return null;

  const eventDate = new Date(ticket.event?.date);
  const eventEndDate = ticket.event?.endDate
    ? new Date(ticket.event.endDate)
    : new Date(eventDate.getTime() + 2 * 60 * 60 * 1000);
  const isUsed = ticket.status === 'USED';
  const isPast = !isUsed && eventDate < new Date();
  const statusLabel = isUsed ? 'Used' : isPast ? 'Event ended' : 'Valid ticket';
  const venue = ticket.event?.venue || '';
  const latitude = Number(ticket.event?.latitude);
const longitude = Number(ticket.event?.longitude);

const hasCoordinates =
  Number.isFinite(latitude) && Number.isFinite(longitude);

const directionsUrl = hasCoordinates
  ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
  : ticket.event?.directionsUrl ||
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venue)}`;
  const calendarUrl =
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent(ticket.event?.title || 'Passify event')}` +
    `&dates=${formatCalendarDate(eventDate)}/${formatCalendarDate(eventEndDate)}` +
    `&location=${encodeURIComponent(venue)}`;

  return (
    <div className="min-h-screen bg-[#090912] text-white">
      <FloatingTickets />
      <Navbar />

      <main className="relative max-w-lg mx-auto px-5 pt-28 pb-20 sm:px-6">
        <button
          type="button"
          onClick={() => navigate('/my-tickets')}
          className="group mb-8 flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          My tickets
        </button>

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#111122] shadow-2xl shadow-black/20">
          <div className="relative h-44 overflow-hidden">
            <img
              src={ticket.event?.image || FALLBACK_EVENT_IMAGE}
              alt={ticket.event?.title || 'Event'}
              onError={(event) => { event.currentTarget.src = FALLBACK_EVENT_IMAGE; }}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111122] via-[#111122]/25 to-transparent" />
            <span className={`absolute bottom-4 left-5 rounded-full px-3 py-1 text-xs font-semibold ${isUsed || isPast ? 'bg-zinc-800 text-zinc-300' : 'bg-violet-500/90 text-white'}`}>
              {isUsed ? 'Used' : isPast ? 'Event ended' : '● Valid ticket'}
            </span>
          </div>

          <div className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">Your Passify ticket</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">{ticket.event?.title}</h1>

            <div className="mt-5 space-y-3 text-sm text-zinc-400">
              <div className="flex items-start gap-3"><Calendar size={16} className="mt-0.5 shrink-0 text-violet-300" />{eventDate.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div className="flex items-start gap-3"><Clock size={16} className="mt-0.5 shrink-0 text-violet-300" />{formatEventTime(eventDate)}</div>
              <div className="flex items-start gap-3"><MapPin size={16} className="mt-0.5 shrink-0 text-violet-300" />{venue || 'Venue to be confirmed'}</div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <a href={directionsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-3 text-sm font-semibold text-zinc-100 transition hover:border-violet-300/35 hover:bg-violet-400/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300">
                <Navigation size={16} className="text-violet-300" /> Directions
              </a>
              <a href={calendarUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-3 text-sm font-semibold text-zinc-100 transition hover:border-violet-300/35 hover:bg-violet-400/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300">
                <CalendarPlus size={16} className="text-violet-300" /> Add to calendar
              </a>
            </div>

            <div className="relative my-7 flex items-center">
              <div className="absolute -left-6 h-5 w-5 rounded-full border-r border-white/10 bg-[#090912]" />
              <div className="flex-1 border-t border-dashed border-white/10" />
              <div className="absolute -right-6 h-5 w-5 rounded-full border-l border-white/10 bg-[#090912]" />
            </div>

            <div className="flex flex-col items-center gap-4">
              {qrDataUrl ? (
                <div className="rounded-2xl bg-white p-4 shadow-lg shadow-black/20"><img src={qrDataUrl} alt="Ticket QR code" className="h-48 w-48" /></div>
              ) : (
                <div className="flex h-56 w-56 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]"><div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" /></div>
              )}
              <div className="text-center"><p className="font-medium text-zinc-200">Ready at the entrance</p><p className="mt-1 text-sm text-white">Show this QR code to the event staff.</p></div>
            </div>

            <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-white">Ticket holder</p>
              <p className="mt-2 font-medium text-white">{ticket.guestName || ticket.user?.name || 'Guest attendee'}</p>
              <p className="mt-1 text-sm text-white">{ticket.guestEmail || ticket.user?.email || 'Email not available'}</p>
            </div>
          </div>
        </section>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button type="button" onClick={handleDownload} disabled={!qrDataUrl} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-[#111122] px-4 py-3.5 font-semibold text-white transition hover:border-violet-300/40 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-50">
            <Download size={17} /> Download QR
          </button>
          <button type="button" onClick={handleShare} className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-500 px-4 py-3.5 font-semibold text-white transition hover:bg-violet-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300">
            <Share2 size={17} /> Share ticket
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
