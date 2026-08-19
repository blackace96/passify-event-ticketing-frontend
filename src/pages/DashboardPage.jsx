import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, Calendar, MapPin, ArrowRight, Clock } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { formatEventTime } from '../utils/dateTime';
import FloatingTickets from '../components/ui/FloatingTickets';
import Footer from '../components/layout/Footer';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const upcoming = tickets.filter(t => new Date(t.event.date) >= new Date());
  const past = tickets.filter(t => new Date(t.event.date) < new Date());

  return (
    <div className="min-h-screen bg-[#090912] text-white">
      <Navbar />
      < FloatingTickets />
      <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-20">

        {/* Header */}
        <div className="mb-10">
          <p className="text-white text-base mb-1">Welcome back</p>
          <h1 className="text-3xl font-bold text-white">{user?.name} 👋</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total tickets', value: tickets.length, icon: Ticket },
            { label: 'Upcoming', value: upcoming.length, icon: Calendar },
            { label: 'Past events', value: past.length, icon: Clock },
            { label: 'Events attended', value: past.filter(t => t.status === 'USED').length, icon: MapPin },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-[#111122] border border-white/5 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-zinc-500 text-base">{stat.label}</p>
                  <Icon size={14} className="text-[#6c47ff]" />
                </div>
                <p className="text-white text-3xl font-bold">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Upcoming tickets */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold text-lg">Upcoming tickets</h2>
            <button
              onClick={() => navigate('/my-tickets')}
              className="group inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#6c47ff] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#6c47ff]/20 transition-all hover:bg-[#7c57ff] hover:scale-[1.02] active:scale-[0.98] sm:self-auto"
            >
              View all <ArrowRight size={14} />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map(i => (
                <div key={i} className="bg-[#111122] border border-white/5 rounded-2xl h-32 animate-pulse" />
              ))}
            </div>
          ) : upcoming.length === 0 ? (
            <div className="bg-[#111122] border border-white/5 rounded-2xl p-10 text-center">
              <Ticket size={40} className="text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500">No upcoming tickets</p>
              <button
                onClick={() => navigate('/events')}
                className="mt-4 bg-[#6c47ff] hover:bg-[#7c57ff] text-white text-base font-medium px-6 py-2.5 rounded-xl transition-all"
              >
                Browse events
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcoming.slice(0, 4).map((ticket) => {
                const date = new Date(ticket.event.date);
                return (
                  <div
                    key={ticket.id}
                    onClick={() => navigate(`/my-tickets/${ticket.qrToken}`)}
                    className="bg-[#111122] border border-white/5 hover:border-[#6c47ff]/40 rounded-2xl p-5 cursor-pointer transition-all duration-200 flex items-center gap-4"
                  >
                    {/* Date block */}
                    <div className="bg-[#6c47ff]/20 border border-[#6c47ff]/30 rounded-xl p-3 text-center min-w-[52px]">
                      <p className="text-[#a78bfa] text-base uppercase">
                        {date.toLocaleString('default', { month: 'short' })}
                      </p>
                      <p className="text-white text-xl font-bold leading-none">{date.getDate()}</p>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{ticket.event.title}</p>
                      <p className="text-zinc-500 text-base truncate">{ticket.event.venue}</p>
                      <p className="text-zinc-600 text-sm mt-0.5">{formatEventTime(date)}</p>
                      <span className={`inline-block mt-1.5 text-base px-2 py-0.5 rounded-full ${
                        ticket.status === 'USED'
                          ? 'bg-zinc-800 text-zinc-500'
                          : 'bg-[#6c47ff]/20 text-[#a78bfa]'
                      }`}>
                        {ticket.status === 'USED' ? 'Used' : 'Valid'}
                      </span>
                    </div>

                    <ArrowRight size={16} className="text-zinc-600 flex-shrink-0" />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Browse more events CTA */}
        <div className="bg-gradient-to-r from-[#6c47ff]/20 to-[#6c47ff]/5 border border-[#6c47ff]/20 rounded-2xl p-8 flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-lg mb-1">Discover more events</h3>
            <p className="text-zinc-500 text-base">Find and book tickets for upcoming events near you</p>
          </div>
          <button
            onClick={() => navigate('/events')}
            className="bg-[#6c47ff] hover:bg-[#7c57ff] text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
          >
            Browse events <ArrowRight size={16} />
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}