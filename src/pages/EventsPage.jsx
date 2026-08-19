import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Calendar, MapPin, Ticket, SlidersHorizontal } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import api from '../services/api';
import FloatingTickets from '../components/ui/FloatingTickets';
import Footer from '../components/layout/Footer';
import { formatEventTime } from '../utils/dateTime';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const q = searchParams.get('search') || '';
    setSearch(q);
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch {
      // use mock data if API not ready
      setEvents(MOCK_EVENTS);
    } finally {
      setLoading(false);
    }
  };

  const filtered = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.venue.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#090912] text-white">
      <FloatingTickets />
      <Navbar />

      {/* Background glow */}
      {/* <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#6c47ff] opacity-8 rounded-full blur-[150px]" />
      </div> */}

      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">All Events</h1>
          <p className="text-zinc-200 text-base">Discover and book tickets for events happening around you</p>
        </div>

        {/* Search + Filter bar */}
        <div className="flex flex-col md:flex-row gap-3 mb-10">
          <div className="flex-1 flex items-center gap-3 bg-[#111122] border border-white/10 rounded-xl px-4 py-3">
            <Search size={16} className="text-zinc-500" />
            <input
              type="text"
              placeholder="Search events, venues..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-white text-base placeholder-zinc-500 outline-none flex-1"
            />
          </div>
          <div className="flex items-center gap-3 bg-[#111122] border border-white/10 rounded-xl px-4 py-3 md:w-44">
            <Calendar size={16} className="text-zinc-500" />
            <span className="text-zinc-500 text-base">Any date</span>
          </div>
          <div className="flex items-center gap-3 bg-[#111122] border border-white/10 rounded-xl px-4 py-3 md:w-44">
            <MapPin size={16} className="text-zinc-500" />
            <span className="text-zinc-500 text-base">Any location</span>
          </div>
          <button className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-400 text-base px-4 py-3 rounded-xl transition-all">
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2">
          {['All', 'Concert', 'Conference', 'Nightclub', 'Festival', 'Sports', 'Art'].map((cat) => (
            <button
              key={cat}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-base font-medium transition-all duration-200 ${
                cat === 'All'
                  ? 'bg-[#6c47ff] text-white'
                  : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-[#6c47ff]/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-[#111122] border border-white/5 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-white/5" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-white/5 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Ticket size={48} className="text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500 text-lg">No events found</p>
            <p className="text-zinc-600 text-base mt-1">Try a different search or check back later</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map((event) => {
              const date = new Date(event.date);
              return (
                <div
                  key={event.id}
                  onClick={() => navigate(`/events/${event.id}`)}
                  className="bg-[#111122] border border-white/5 rounded-2xl overflow-hidden cursor-pointer group hover:border-[#6c47ff]/50 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image || 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80'}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111122] to-transparent" />
                    <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-base px-3 py-1 rounded-full border border-white/10">
                      {event.category || 'Event'}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex items-start gap-4">
                    <div className="text-center min-w-[40px]">
                      <p className="text-zinc-500 text-base uppercase">
                        {date.toLocaleString('default', { month: 'short' })}
                      </p>
                      <p className="text-white text-2xl font-bold leading-none">{date.getDate()}</p>
                      <p className="text-zinc-500 text-base">
                        {date.toLocaleString('default', { weekday: 'short' })}
                      </p>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-base mb-1">{event.title}</h3>
                      <p className="text-zinc-500 text-base mb-1">{event.venue}</p>
                      <p className="text-zinc-600 text-sm mb-4">{formatEventTime(date)}</p>
                      <button className="flex items-center gap-2 bg-[#6c47ff] hover:bg-[#7c57ff] text-white text-base font-medium px-4 py-2 rounded-lg transition-all duration-200">
                        <Ticket size={12} />
                        Get Ticket
                      </button>
                    </div>
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

const MOCK_EVENTS = [
  {
    id: '1',
    title: 'Afro Nation Ghana',
    venue: 'Accra Sports Stadium',
    date: '2025-12-12',
    category: 'Concert',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80',
  },
  {
    id: '2',
    title: 'KNUST Tech Summit',
    venue: 'KNUST Great Hall',
    date: '2025-12-20',
    category: 'Conference',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
  },
  {
    id: '3',
    title: 'New Year Bash 2026',
    venue: 'Kempinski Hotel, Accra',
    date: '2025-12-31',
    category: 'Nightclub',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80',
  },
  {
    id: '4',
    title: 'Detty December Festival',
    venue: 'Labadi Beach, Accra',
    date: '2025-12-26',
    category: 'Festival',
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&q=80',
  },
  {
    id: '5',
    title: 'Ghana Business Summit',
    venue: 'Accra International Conference Centre',
    date: '2025-12-15',
    category: 'Conference',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80',
  },
  {
    id: '6',
    title: 'Kumasi Cultural Night',
    venue: 'Manhyia Palace Museum',
    date: '2025-12-18',
    category: 'Art',
    image: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=600&q=80',
  },
];