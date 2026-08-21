import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Download, Share2, Ticket } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import FloatingTickets from '../components/ui/FloatingTickets';
import { formatEventTime } from '../utils/dateTime';

export default function GuestTicketPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTicket();
  }, [token]);

  const fetchTicket = async () => {
    try {
      const res = await api.get(`/tickets/token/${token}`);
      setTicket(res.data);
      const qrRes = await api.get(`/tickets/qr/${token}`);
      setQrDataUrl(qrRes.data.qrDataUrl);
    } catch {
      toast.error('Ticket not found');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `passify-ticket.png`;
    link.click();
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: ticket?.event?.title, url });
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090912] flex items-center justify-center">
        <FloatingTickets />
        <div className="w-8 h-8 border-2 border-[#6c47ff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-[#090912] flex flex-col items-center justify-center text-white px-6">
        <FloatingTickets />
        <Ticket size={48} className="text-zinc-700 mb-4" />
        <h1 className="text-xl font-bold mb-2">Ticket not found</h1>
        <p className="text-white text-base mb-6">This ticket may be invalid or expired</p>
        <button
          onClick={() => navigate('/')}
          className="bg-[#6c47ff] hover:bg-[#7c57ff] text-white px-6 py-3 rounded-full text-base font-medium transition-all"
        >
          Go to PASSIFY
        </button>
      </div>
    );
  }

  const date = new Date(ticket.event.date);

  return (
    <div className="min-h-screen bg-[#090912] text-white flex flex-col items-center justify-center px-4 py-12">
      <FloatingTickets />

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6c47ff] opacity-10 rounded-full blur-[150px]" />
      </div>

      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <svg width="52" height="26" viewBox="0 0 92 48" fill="none">
          <rect x="0" y="2" width="92" height="44" rx="9" fill="#6c47ff"/>
          <circle cx="0" cy="24" r="9" fill="#0d0d1a"/>
          <circle cx="92" cy="24" r="9" fill="#0d0d1a"/>
          <line x1="22" y1="4" x2="22" y2="44" stroke="#0d0d1a" strokeWidth="1.5" strokeDasharray="3 3"/>
          <text x="38" y="32" textAnchor="middle" fontSize="22" fontWeight="900" fill="white" fontFamily="system-ui">P</text>
        </svg>
        <span className="text-white font-bold tracking-widest text-base">PASSIFY</span>
      </div>

      {/* Ticket card */}
      <div className="relative w-full max-w-sm bg-[#111122] border border-white/10 rounded-3xl overflow-hidden">

        {/* Event image */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={ticket.event.image || 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80'}
            alt={ticket.event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111122] to-transparent" />
          <div className="absolute bottom-4 left-5">
            <span className={`text-base px-3 py-1 rounded-full ${
              ticket.status === 'USED'
                ? 'bg-zinc-800 text-zinc-400'
                : 'bg-[#6c47ff]/80 text-white'
            }`}>
              {ticket.status === 'USED' ? 'Used' : '● Valid'}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <h1 className="text-white text-xl font-bold mb-3">{ticket.event.title}</h1>
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-zinc-400 text-base">
              <Calendar size={14} className="text-[#6c47ff]" />
              {date.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="flex items-center gap-2 text-zinc-400 text-base">
              <Clock size={14} className="text-[#6c47ff]" />
              {formatEventTime(date)}
            </div>
            <div className="flex items-center gap-2 text-zinc-400 text-base">
              <MapPin size={14} className="text-[#6c47ff]" />
              {ticket.event.venue}
            </div>
          </div>

          {/* Divider with notches */}
          <div className="relative flex items-center my-6">
            <div className="absolute -left-6 w-5 h-5 rounded-full bg-[#090912] border-r border-white/10" />
            <div className="flex-1 border-t border-dashed border-white/10" />
            <div className="absolute -right-6 w-5 h-5 rounded-full bg-[#090912] border-l border-white/10" />
          </div>

          {/* QR */}
          <div className="flex flex-col items-center gap-3">
            {qrDataUrl ? (
              <div className="bg-white p-4 rounded-2xl">
                <img src={qrDataUrl} alt="QR Code" className="w-44 h-44" />
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-2xl w-52 h-52 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[#6c47ff] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <p className="text-white text-base text-center">Show this QR code at the entrance</p>
          </div>

          {/* Attendee */}
          <div className="mt-6 bg-white/5 border border-white/10 rounded-full p-4">
            <p className="text-white text-base mb-1">Ticket holder</p>
            <p className="text-white text-base font-medium">{ticket.guestName || ticket.user?.name}</p>
            <p className="text-white text-base">{ticket.guestEmail || ticket.user?.email}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-5 w-full max-w-sm">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 bg-[#111122] border border-white/10 hover:border-[#6c47ff]/40 text-white text-base font-medium py-3.5 rounded-full transition-all"
        >
          <Download size={16} /> Download
        </button>
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 bg-[#6c47ff] hover:bg-[#7c57ff] text-white text-base font-medium py-3.5 rounded-full transition-all"
        >
          <Share2 size={16} /> Share
        </button>
      </div>

      <p className="text-zinc-700 text-base mt-6 text-center">
        Powered by PASSIFY · <button onClick={() => navigate('/')} className="hover:text-white transition-colors">Visit site</button>
      </p>
    </div>
  );
}