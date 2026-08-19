import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Ticket, Calendar, ArrowRight, Eye, Settings } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import FloatingTickets from '../components/ui/FloatingTickets';
import Footer from '../components/layout/Footer';

export default function OrgDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events/my');
      setEvents(res.data);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const totalTickets = events.reduce((acc, e) => acc + (e._count?.tickets || 0), 0);
  const published = events.filter((e) => e.status === 'PUBLISHED').length;
  const draft = events.filter((e) => e.status === 'DRAFT').length;

  const displayName = user?.orgName || user?.name || 'Organiser';

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#090912] text-white">
      <FloatingTickets />
      <Navbar />

      <div className="relative mx-auto max-w-6xl px-4 pt-24 pb-16 sm:px-6 sm:pt-28 sm:pb-20">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="mb-1 text-sm text-zinc-200 sm:text-base">Organiser dashboard</p>
            <h1 className="text-2xl font-bold leading-tight text-white sm:text-3xl break-words">
              Welcome back, {displayName}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => navigate('/org/events/create')}
            className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#6c47ff] px-5 py-3 font-medium text-white transition-all duration-200 hover:bg-[#7c57ff] sm:w-auto"
          >
            <Plus size={18} />
            Create event
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:mb-10 sm:gap-4 md:grid-cols-4">
          {[
            { label: 'Total events', value: events.length, icon: Calendar },
            { label: 'Published', value: published, icon: Eye },
            { label: 'Drafts', value: draft, icon: Settings },
            { label: 'Tickets sold', value: totalTickets, icon: Ticket },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/5 bg-[#111122] p-4 sm:p-5"
              >
                <div className="mb-2 flex items-center justify-between sm:mb-3">
                  <p className="text-xs text-zinc-500 sm:text-sm">{stat.label}</p>
                  <Icon size={14} className="shrink-0 text-[#6c47ff]" />
                </div>
                <p className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Events list */}
        <div>
          <div className="mb-4 flex items-center justify-between sm:mb-5">
            <h2 className="text-base font-semibold text-white sm:text-lg">Your events</h2>
          </div>

          {loading ? (
            <div className="space-y-3 sm:space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-2xl border border-white/5 bg-[#111122] sm:h-28"
                />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-2xl border border-white/5 bg-[#111122] p-8 text-center sm:p-16">
              <Calendar size={40} className="mx-auto mb-4 text-zinc-700 sm:h-12 sm:w-12" />
              <p className="mb-1 text-base font-medium text-zinc-400 sm:text-lg">No events yet</p>
              <p className="mb-6 text-sm text-zinc-600 sm:text-base">Create your first event to get started</p>
              <button
                type="button"
                onClick={() => navigate('/org/events/create')}
                className="mx-auto flex items-center gap-2 rounded-xl bg-[#6c47ff] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[#7c57ff] sm:text-base"
              >
                <Plus size={16} />
                Create event
              </button>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {events.map((event) => {
                const date = new Date(event.date);
                const ticketCount = event._count?.tickets || 0;

                return (
                  <div
                    key={event.id}
                    className="rounded-2xl border border-white/5 bg-[#111122] p-4 transition-all duration-200 hover:border-[#6c47ff]/40 sm:p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                      {/* Date + info */}
                      <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center sm:gap-4">
                        <div className="shrink-0 rounded-xl border border-[#6c47ff]/30 bg-[#6c47ff]/20 p-2.5 text-center min-w-[48px] sm:min-w-[52px] sm:p-3">
                          <p className="text-xs uppercase text-[#a78bfa] sm:text-sm">
                            {date.toLocaleString('default', { month: 'short' })}
                          </p>
                          <p className="text-lg font-bold leading-none text-white sm:text-xl">
                            {date.getDate()}
                          </p>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <h3 className="min-w-0 truncate text-sm font-semibold text-white sm:text-base">
                              {event.title}
                            </h3>
                            <span
                              className={`shrink-0 rounded-full px-2 py-0.5 text-xs sm:text-sm ${
                                event.status === 'PUBLISHED'
                                  ? 'bg-green-500/20 text-green-400'
                                  : event.status === 'CANCELLED'
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'bg-zinc-700 text-zinc-400'
                              }`}
                            >
                              {event.status}
                            </span>
                          </div>
                          <p className="truncate text-sm text-zinc-500 sm:text-base">{event.venue}</p>

                          {/* Mobile stats */}
                          <div className="mt-2 flex gap-4 text-xs text-zinc-500 sm:text-sm md:hidden">
                            <span>
                              <span className="font-semibold text-white">{ticketCount}</span> tickets
                            </span>
                            <span>
                              <span className="font-semibold text-white">{event.capacity}</span> capacity
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Desktop stats + action */}
                      <div className="flex items-center justify-between gap-3 sm:shrink-0 sm:justify-end sm:gap-6">
                        <div className="hidden items-center gap-6 text-sm md:flex">
                          <div className="text-center">
                            <p className="font-semibold text-white">{ticketCount}</p>
                            <p className="text-zinc-500">tickets</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold text-white">{event.capacity}</p>
                            <p className="text-zinc-500">capacity</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => navigate(`/org/events/${event.id}`)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-zinc-400 transition-all hover:border-[#6c47ff]/40 hover:bg-[#6c47ff]/20 hover:text-white sm:flex-none sm:py-2 sm:text-base"
                        >
                          Manage
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
