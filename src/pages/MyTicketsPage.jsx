import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, Calendar, MapPin, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import api from '../services/api';
import FloatingTickets from '../components/ui/FloatingTickets';
import Footer from '../components/layout/Footer';
import { formatEventTime } from '../utils/dateTime';

export default function MyTicketsPage() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/tickets/my');
      setTickets(res.data);
    } catch {
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = tickets.filter((t) => {
    if (filter === 'upcoming') return new Date(t.event.date) >= new Date() && t.status === 'UNUSED';
    if (filter === 'used') return t.status === 'USED';
    if (filter === 'past') return new Date(t.event.date) < new Date();
    return true;
  });

  return (
    <div className="min-h-screen bg-[#090912] text-white">
      <Navbar />
      <FloatingTickets />

      {/* <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#6c47ff] opacity-8 rounded-full blur-[150px]" />
      </div> */}

      <div className="relative max-w-4xl mx-auto px-6 pt-28 pb-20">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Tickets</h1>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-8">
          {[
            { id: 'all', label: 'All' },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'used', label: 'Used' },
            { id: 'past', label: 'Past' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-full text-base font-medium transition-all duration-200 ${
                filter === tab.id
                  ? 'bg-[#6c47ff] text-white'
                  : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tickets */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#111122] border border-white/5 rounded-2xl h-28 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-[#111122] border border-white/5 rounded-2xl p-16 text-center">
            <Ticket size={48} className="text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400 text-lg font-medium mb-1">No tickets found</p>
            <p className="text-zinc-600 text-base mb-6">
              {filter === 'all' ? "You haven't booked any tickets yet" : `No ${filter} tickets`}
            </p>
            <button
              onClick={() => navigate('/events')}
              className="bg-[#6c47ff] hover:bg-[#7c57ff] text-white text-base font-medium px-6 py-3 rounded-full transition-all"
            >
              Browse events
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((ticket) => {
              const date = new Date(ticket.event.date);
              const isUpcoming = new Date(ticket.event.date) >= new Date();
              return (
                <div
                  key={ticket.id}
                  onClick={() => navigate(`/my-tickets/${ticket.qrToken}`)}
                  className="bg-[#111122] border border-white/5 hover:border-[#6c47ff]/40 rounded-2xl p-5 cursor-pointer transition-all duration-200 group"
                >
                  <div className="flex items-center gap-5">

                    {/* Date block */}
                    <div className={`rounded-full p-3 text-center min-w-[56px] ${
                      isUpcoming
                        ? 'bg-[#6c47ff]/20 border border-[#6c47ff]/30'
                        : 'bg-white/5 border border-white/10'
                    }`}>
                      <p className={`text-base uppercase ${isUpcoming ? 'text-[#a78bfa]' : 'text-white'}`}>
                        {date.toLocaleString('default', { month: 'short' })}
                      </p>
                      <p className="text-white text-2xl font-bold leading-none">{date.getDate()}</p>
                      <p className={`text-base ${isUpcoming ? 'text-[#a78bfa]' : 'text-white'}`}>
                        {date.toLocaleString('default', { weekday: 'short' })}
                      </p>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold truncate">{ticket.event.title}</h3>
                        {ticket.status === 'USED' && (
                          <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-white text-base">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> {ticket.event.venue}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {formatEventTime(date)}
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className={`inline-block text-base px-3 py-1 rounded-full ${
                          ticket.status === 'USED'
                            ? 'bg-zinc-800 text-white'
                            : isUpcoming
                            ? 'bg-[#6c47ff]/20 text-[#a78bfa] border border-[#6c47ff]/30'
                            : 'bg-zinc-800 text-white'
                        }`}>
                          {ticket.status === 'USED' ? '✓ Used' : isUpcoming ? '● Valid' : 'Past'}
                        </span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <ArrowRight size={16} className="text-zinc-600 group-hover:text-[#6c47ff] transition-colors flex-shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}