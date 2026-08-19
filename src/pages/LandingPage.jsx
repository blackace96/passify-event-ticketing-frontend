import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  MapPin,
  Search,
  Sparkles,
  Star,
  Ticket,
  Users,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import FloatingTickets from '../components/ui/FloatingTickets';
import api from '../services/api';
import { formatEventTime } from '../utils/dateTime';
import Footer from '../components/layout/Footer';


const CATEGORIES = [
  'All',
  'Concert',
  'Conference',
  'Festival',
  'Nightclub',
  'Sports',
  'Art',
];

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=85';

function getEventDate(dateValue) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return { month: 'TBA', day: '—', full: 'Date to be announced' };
  }

  return {
    month: date.toLocaleString('en', { month: 'short' }),
    day: date.getDate(),
    full: `${date.toLocaleDateString('en-GB', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })} · ${formatEventTime(date)}`,
  };
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events');
        setEvents(Array.isArray(res.data) ? res.data : []);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    if (activeCategory === 'All') return events;

    return events.filter(
      (event) =>
        event.category?.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [events, activeCategory]);

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (search.trim()) params.set('search', search.trim());
    if (activeCategory !== 'All') params.set('category', activeCategory);

    navigate(`/events${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#090912] text-white">
      <Navbar />
      <FloatingTickets />

      {/* Hero */}
      <section className="relative isolate flex min-h-[760px] items-center overflow-hidden">
        <div className="absolute inset-0 -z-20">
          <img
            src={FALLBACK_IMAGE}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#090912]/75" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d1a]/30 via-[#0d0d1a]/30 to-[#0d0d1a]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d1a]/80 via-transparent to-[#0d0d1a]/60" />
        </div>

        <div className="absolute -left-48 top-1/4 -z-10 h-96 w-96 rounded-full bg-[#6c47ff]/30 blur-[140px]" />
        <div className="absolute -right-48 bottom-0 -z-10 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-[140px]" />

        <div className="relative mx-auto w-full max-w-6xl px-6 pt-32 pb-20">
          <div className="max-w-3xl">
            <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.05em] sm:text-6xl md:text-8xl">
              Your next
              <br />
              <span className="bg-gradient-to-r from-[#a78bfa] via-[#6c47ff] to-fuchsia-400 bg-clip-text text-transparent">
                unforgettable
              </span>
              <br />
              moment starts here.
            </h1>

            <p className="mt-7 max-w-xl text-base leading-relaxed text-white font-semibold sm:text-lg">
              Discover concerts, festivals, conferences, and experiences worth
              showing up for. Book in seconds and receive your QR ticket
              instantly.
            </p>

            <form
              onSubmit={handleSearch}
              className="mt-10 flex max-w-2xl flex-col gap-2 rounded-2xl border border-white/15 bg-white/10 p-2 shadow-2xl backdrop-blur-xl sm:flex-row"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2">
                <Search size={19} className="shrink-0 text-white/45" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search events, artists, or venues"
                  className="w-full bg-transparent text-base text-white outline-none placeholder:text-white/40"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6c47ff] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#7c57ff] hover:shadow-lg hover:shadow-[#6c47ff]/30"
              >
                Explore events
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-base text-white/55">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#a78bfa]" />
                Instant QR tickets
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#a78bfa]" />
                Secure booking
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#a78bfa]" />
                No printing needed
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured events */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 text-base font-semibold uppercase tracking-[0.18em] text-[#a78bfa]">
              <Sparkles size={15} />
              Happening soon
            </p>
            <h2 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
              Find your next event
            </h2>
          </div>

          <button
  type="button"
  onClick={() => navigate('/events')}
  className="group inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#6c47ff] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#6c47ff]/20 transition-all hover:bg-[#7c57ff] hover:scale-[1.02] active:scale-[0.98] sm:self-auto"
>
  View all events
  <ArrowRight
    size={16}
    className="transition-transform group-hover:translate-x-0.5"
  />
</button>
        </div>

        <div className="mb-10 flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-base font-medium transition ${
                activeCategory === category
                  ? 'bg-[#6c47ff] text-white shadow-lg shadow-[#6c47ff]/25'
                  : 'border border-white/10 bg-white/5 text-zinc-400 hover:border-[#6c47ff]/45 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-white/5 bg-[#111122] animate-pulse"
              >
                <div className="h-52 bg-white/5" />
                <div className="space-y-4 p-5">
                  <div className="h-5 w-3/4 rounded bg-white/5" />
                  <div className="h-4 w-1/2 rounded bg-white/5" />
                  <div className="h-9 w-full rounded bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-[#111122] px-6 py-20 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6c47ff]/10">
              <Ticket size={25} className="text-[#a78bfa]" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              No {activeCategory === 'All' ? '' : activeCategory.toLowerCase()} events yet
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-base leading-relaxed text-zinc-500">
              Try another category, or browse all upcoming events.
            </p>
            <button
              type="button"
              onClick={() => setActiveCategory('All')}
              className="mt-6 rounded-xl bg-[#6c47ff] px-5 py-3 text-base font-semibold transition hover:bg-[#7c57ff]"
            >
              Browse all events
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.slice(0, 6).map((event, index) => {
              const eventDate = getEventDate(event.date);
              const isFeatured = index === 0;

              return (
                <article
                  key={event.id}
                  className={`group overflow-hidden rounded-2xl border border-white/5 bg-[#111122] transition duration-300 hover:-translate-y-1 hover:border-[#6c47ff]/50 hover:shadow-2xl hover:shadow-[#6c47ff]/15 ${
                    isFeatured ? 'md:col-span-2' : ''
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="block w-full text-left"
                    aria-label={`View ${event.title}`}
                  >
                    <div
                      className={`relative overflow-hidden bg-[#1a1a2e] ${
                        isFeatured ? 'h-64' : 'h-52'
                      }`}
                    >
                      <img
                        src={event.image || FALLBACK_IMAGE}
                        alt={event.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111122] via-transparent to-transparent" />

                      <div className="absolute left-4 top-4 flex gap-2">
                        <span className="rounded-full border border-white/10 bg-black/50 px-3 py-1 text-base font-medium text-white backdrop-blur-md">
                          {event.category || 'Event'}
                        </span>

                        {isFeatured && (
                          <span className="flex items-center gap-1 rounded-full bg-[#6c47ff] px-3 py-1 text-base font-medium text-white">
                            <Star size={11} fill="currentColor" />
                            Featured
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4 px-5 pt-5">
                      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl border border-[#6c47ff]/25 bg-[#6c47ff]/10">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-[#a78bfa]">
                          {eventDate.month}
                        </span>
                        <span className="text-lg font-black leading-none text-white">
                          {eventDate.day}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-base font-bold text-white">
                          {event.title}
                        </h3>
                        <p className="mt-1 flex items-center gap-1.5 truncate text-base text-zinc-500">
                          <MapPin size={13} className="shrink-0 text-[#a78bfa]" />
                          {event.venue || 'Venue to be announced'}
                        </p>
                      </div>
                    </div>
                  </button>

                  <div className="flex items-center justify-between px-5 pb-5 pt-4">
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 text-base text-zinc-500">
                        <Calendar size={12} />
                        {eventDate.full}
                      </p>
                      {event.capacity && (
                        <p className="mt-1 flex items-center gap-1.5 text-base text-zinc-600">
                          <Users size={12} />
                          {event.capacity.toLocaleString()} capacity
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/events/${event.id}`)}
                      className="ml-3 inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#6c47ff] px-3 py-2 text-base font-semibold text-white transition hover:bg-[#7c57ff]"
                    >
                      <Ticket size={13} />
                      Tickets
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="border-y border-white/5 bg-[#111122]/40 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <p className="mb-2 text-base font-semibold uppercase tracking-[0.18em] text-[#a78bfa]">
              Simple and secure
            </p>
            <h2 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
              From discovery to entry in three steps
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                number: '01',
                title: 'Discover an event',
                description:
                  'Browse experiences you love and see the important details before booking.',
                Icon: Search,
              },
              {
                number: '02',
                title: 'Book your ticket',
                description:
                  'Reserve your place in moments with a smooth, secure checkout flow.',
                Icon: Ticket,
              },
              {
                number: '03',
                title: 'Show your QR code',
                description:
                  'Your digital ticket is ready instantly—just scan it at the entrance.',
                Icon: CheckCircle2,
              },
            ].map(({ number, title, description, Icon }) => (
              <div
                key={number}
                className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#090912] p-7"
              >
                <span className="absolute right-5 top-3 text-6xl font-black text-white/[0.035]">
                  {number}
                </span>
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#6c47ff]/30 bg-[#6c47ff]/15 text-[#a78bfa]">
                  <Icon size={22} />
                </div>
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <p className="mt-3 text-base leading-relaxed text-zinc-500">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organiser CTA */}
      <section className="px-6 py-20">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-[#6c47ff]/30 bg-gradient-to-br from-[#6c47ff]/30 via-[#241d50] to-[#111122] px-7 py-12 text-center sm:px-12">
          <div className="absolute -left-16 -top-20 h-64 w-64 rounded-full bg-[#a855f7]/30 blur-[100px]" />
          <div className="absolute -bottom-24 -right-12 h-64 w-64 rounded-full bg-[#6c47ff]/30 blur-[100px]" />

          <div className="relative">
            <Sparkles className="mx-auto mb-5 text-[#c4b5fd]" size={27} />
            <h2 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              Ready to host something memorable?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/65">
              Create your event, manage tickets, and welcome attendees with
              fast, secure QR validation.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="rounded-xl bg-[#6c47ff] px-7 py-3.5 text-base font-semibold text-white transition hover:bg-[#7c57ff] hover:shadow-lg hover:shadow-[#6c47ff]/30"
              >
                Create an event
              </button>
              <button
                type="button"
                onClick={() => navigate('/events')}
                className="rounded-xl border border-white/15 bg-white/10 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-white/15"
              >
                Browse events
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}