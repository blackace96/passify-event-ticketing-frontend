import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Copy, Trash2, Eye, EyeOff, Send, Search, Clock, XCircle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingTickets from '../components/ui/FloatingTickets';
import api from '../services/api';
import toast from 'react-hot-toast';
import { formatEventTime } from '../utils/dateTime';

/* ATTENDEES TAB */
function AttendeesTab({ eventId }) {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/events/${eventId}/attendees`);
        setAttendees(res.data);
      } catch {
        setAttendees([]);
        toast.error('Failed to load attendees');
      } finally {
        setLoading(false);
      }
    })();
  }, [eventId]);

  const filtered = attendees.filter((t) => {
    const name = (t.guestName || t.user?.name || '').toLowerCase();
    const email = (t.guestEmail || t.user?.email || '').toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  const validatedCount = attendees.filter((t) => t.status === 'USED').length;
  const pendingCount = attendees.filter((t) => t.status === 'UNUSED').length;

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Search */}
      <div className="flex items-center gap-3 bg-[#111122] border border-white/10 rounded-full px-4 py-3">
        <Search size={17} className="text-white shrink-0" />
        <input
          type="text"
          placeholder="Search attendees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-white text-sm sm:text-base placeholder-white outline-none flex-1 min-w-0"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-[#111122] border border-white/5 rounded-2xl p-4">
          <p className="text-white text-xs sm:text-sm mb-1">Total bookings</p>
          <p className="text-white text-2xl sm:text-3xl font-bold">{attendees.length}</p>
        </div>
        <div className="bg-[#111122] border border-white/5 rounded-2xl p-4">
          <p className="text-white text-xs sm:text-sm mb-1">Validated</p>
          <p className="text-white text-2xl sm:text-3xl font-bold">{validatedCount}</p>
        </div>
        <div className="bg-[#111122] border border-white/5 rounded-2xl p-4 col-span-2 sm:col-span-1">
          <p className="text-white text-xs sm:text-sm mb-1">Pending</p>
          <p className="text-white text-2xl sm:text-3xl font-bold">{pendingCount}</p>
        </div>
      </div>

      {/* List / Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-[#111122] border border-white/5 rounded-2xl h-20 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#111122] border border-white/5 rounded-2xl p-8 sm:p-12 text-center">
          <Users size={40} className="text-zinc-700 mx-auto mb-3" />
          <p className="text-white text-sm sm:text-base">
            {search ? 'No attendees match your search' : 'No bookings yet'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-[#111122] border border-white/5 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/5 text-white text-sm font-medium">
              <span className="col-span-1">#</span>
              <span className="col-span-4">Name</span>
              <span className="col-span-4">Email</span>
              <span className="col-span-2">Status</span>
              <span className="col-span-1">Type</span>
            </div>
            {filtered.map((ticket, index) => (
              <div
                key={ticket.id}
                className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors items-center text-sm"
              >
                <span className="text-zinc-600 col-span-1">{index + 1}</span>
                <span className="text-white font-medium col-span-4 truncate">
                  {ticket.guestName || ticket.user?.name || '—'}
                </span>
                <span className="text-zinc-400 col-span-4 truncate">
                  {ticket.guestEmail || ticket.user?.email || '—'}
                </span>
                <div className="col-span-2">
                  <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full whitespace-nowrap ${ticket.status === 'USED' ? 'bg-green-500/20 text-green-400' : 'bg-[#6c47ff]/20 text-[#a78bfa]'}`}>
                    {ticket.status === 'USED' ? '✓ Validated' : '● Valid'}
                  </span>
                </div>
                <span className="text-xs text-zinc-600 col-span-1">{ticket.userId ? 'User' : 'Guest'}</span>
              </div>
            ))}
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden bg-[#111122] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
            {filtered.map((ticket, index) => (
              <div key={ticket.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-zinc-600 text-xs">#{index + 1}</span>
                      <p className="text-white text-sm font-medium truncate">{ticket.guestName || ticket.user?.name || '—'}</p>
                    </div>
                    <p className="text-white text-xs truncate">{ticket.guestEmail || ticket.user?.email || '—'}</p>
                  </div>
                  <span className={`inline-flex items-center text-[11px] px-2 py-1 rounded-full whitespace-nowrap shrink-0 ${ticket.status === 'USED' ? 'bg-green-500/20 text-green-400' : 'bg-[#6c47ff]/20 text-[#a78bfa]'}`}>
                    {ticket.status === 'USED' ? '✓ Validated' : '● Valid'}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3 text-xs">
                  <span className="text-zinc-600">{ticket.userId ? 'Registered user' : 'Guest'}</span>
                  <span className={ticket.status === 'USED' ? 'text-green-500/70' : 'text-[#a78bfa]/70'}>
                    {ticket.status === 'USED' ? 'Checked in' : 'Not checked in'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* MAIN PAGE */
export default function ManageEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [validators, setValidators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPin, setShowPin] = useState(false);
  const [addingValidator, setAddingValidator] = useState(false);
  const [validatorForm, setValidatorForm] = useState({ name: '', email: '' });
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [eventRes, validatorRes] = await Promise.all([
          api.get(`/events/${id}`),
          api.get(`/validators/${id}`),
        ]);
        setEvent(eventRes.data);
        setValidators(validatorRes.data);
      } catch {
        toast.error('Failed to load event');
        navigate('/org/dashboard');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const handleAddValidator = async () => {
    if (!validatorForm.name.trim() || !validatorForm.email.trim()) {
      toast.error('Please fill in name and email');
      return;
    }
    try {
      setAddingValidator(true);
      const res = await api.post('/validators', { ...validatorForm, eventId: id });
      setValidators((prev) => [...prev, res.data]);
      setValidatorForm({ name: '', email: '' });
      toast.success('Validator added and email sent!');
    } catch {
      toast.error('Failed to add validator');
    } finally {
      setAddingValidator(false);
    }
  };

  const handleCopyPin = async () => {
    try {
      await navigator.clipboard.writeText(event.eventPin);
      toast.success('PIN copied to clipboard!');
    } catch {
      toast.error('Failed to copy PIN');
    }
  };

  const handleDeleteEvent = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`/events/${id}`);
      toast.success('Event deleted');
      navigate('/org/dashboard');
    } catch {
      toast.error('Failed to delete event');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090912] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#6c47ff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) return null;

  /* Pending, Rejected, Draft status screen */
  if (['PENDING', 'REJECTED', 'DRAFT'].includes(event.status)) {
    const isPending = event.status === 'PENDING';
    const isRejected = event.status === 'REJECTED';

    return (
      <div className="min-h-screen bg-[#090912] text-white flex flex-col">
        <FloatingTickets />
        <Navbar />
        <main className="relative max-w-3xl w-full mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-16 sm:pb-20 flex-1">
          <div className={`rounded-2xl p-5 sm:p-8 border text-center ${isPending ? 'bg-yellow-500/5 border-yellow-500/20' : isRejected ? 'bg-red-500/5 border-red-500/20' : 'bg-white/5 border-white/10'}`}>
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 ${isPending ? 'bg-yellow-500/20' : isRejected ? 'bg-red-500/20' : 'bg-white/10'}`}>
              <span className="text-2xl sm:text-3xl">{isPending ? '⏳' : isRejected ? '❌' : '📝'}</span>
            </div>

            <h1 className="text-white text-xl sm:text-2xl font-bold mb-3 break-words">{event.title}</h1>
            <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium mb-4 ${isPending ? 'bg-yellow-500/20 text-yellow-400' : isRejected ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-zinc-400'}`}>
              {event.status}
            </span>

            <p className="text-zinc-400 text-sm leading-relaxed max-w-md mx-auto mb-6">
              {isPending && "Your event is currently under review. You'll be notified once it's approved by our team."}
              {isRejected && 'Your event was rejected. Please review our guidelines and submit a new event.'}
              {event.status === 'DRAFT' && "This event is saved as a draft. Submit it for review when you're ready."}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-white mb-8">
              <span>📅 {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span className="hidden sm:inline">•</span>
              <span className="max-w-full truncate">📍 {event.venue}</span>
              <span className="hidden sm:inline">•</span>
              <span>👥 {event.capacity} capacity</span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              {event.status === 'DRAFT' && (
                <button
                  onClick={async () => {
                    try {
                      await api.put(`/events/${event.id}`, { ...event, status: 'PENDING' });
                      toast.success('Event submitted for review!');
                      navigate('/org/dashboard');
                    } catch {
                      toast.error('Failed to submit event');
                    }
                  }}
                  className="bg-[#6c47ff] hover:bg-[#7c57ff] text-white text-sm font-medium px-6 py-3 rounded-full transition-all w-full sm:w-auto"
                >
                  Submit for review
                </button>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const date = new Date(event.date);
  const ticketCount = event._count?.tickets || 0;
  const capacityPercent = event.capacity > 0 ? Math.min((ticketCount / event.capacity) * 100, 100) : 0;
  const spotsLeft = Math.max(event.capacity - ticketCount, 0);

  return (
    <div className="min-h-screen bg-[#090912] text-white flex flex-col">
      <FloatingTickets />
      <Navbar />

      <main className="relative max-w-5xl w-full mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-16 sm:pb-20 flex-1">
        
        {/* Event Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 mb-7 sm:mb-8">
          <div className="min-w-0 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-white break-words">{event.title}</h1>
              <span
                className={`self-start sm:self-auto text-xs sm:text-sm px-3 py-1 rounded-full whitespace-nowrap ${
                  event.status === 'PUBLISHED'
                    ? 'bg-green-500/20 text-green-400'
                    : event.status === 'PENDING'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : event.status === 'REJECTED'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-zinc-700 text-zinc-400'
                }`}
              >
                {event.status}
              </span>
            </div>
            <p className="text-white text-sm leading-relaxed break-words">
              {event.venue} · {date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} · {formatEventTime(date)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div
              className={`flex items-center gap-2 text-xs sm:text-sm font-medium px-3 sm:px-4 py-2.5 rounded-full ${
                event.status === 'PUBLISHED'
                  ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                  : event.status === 'PENDING'
                  ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'
                  : event.status === 'REJECTED'
                  ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                  : 'bg-white/5 border border-white/10 text-zinc-400'
              }`}
            >
              {event.status === 'PUBLISHED' && <><Eye size={14} /> Published</>}
              {event.status === 'PENDING' && <><Clock size={14} /> Pending review</>}
              {event.status === 'REJECTED' && <><XCircle size={14} /> Rejected</>}
              {event.status === 'DRAFT' && <><EyeOff size={14} /> Draft</>}
            </div>

            <button
              onClick={handleDeleteEvent}
              className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium px-3 sm:px-4 py-2.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex items-center gap-1 sm:gap-2 mb-6 sm:mb-8 border-b border-white/5 overflow-x-auto scrollbar-hide">
          {['overview', 'validators', 'attendees'].map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`px-3 sm:px-4 py-3 text-sm sm:text-base font-medium capitalize transition-colors border-b-2 -mb-px whitespace-nowrap ${
                tab === item ? 'border-[#6c47ff] text-white' : 'border-transparent text-white hover:text-zinc-300'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {tab === 'overview' && (
          <div className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-[#111122] border border-white/5 rounded-2xl p-4 sm:p-5">
                <p className="text-white text-xs sm:text-sm mb-2">Tickets booked</p>
                <p className="text-white text-2xl sm:text-3xl font-bold">{ticketCount}</p>
              </div>
              <div className="bg-[#111122] border border-white/5 rounded-2xl p-4 sm:p-5">
                <p className="text-white text-xs sm:text-sm mb-2">Capacity</p>
                <p className="text-white text-2xl sm:text-3xl font-bold">{event.capacity}</p>
              </div>
              <div className="bg-[#111122] border border-white/5 rounded-2xl p-4 sm:p-5">
                <p className="text-white text-xs sm:text-sm mb-2">Validators</p>
                <p className="text-white text-2xl sm:text-3xl font-bold">{validators.length}</p>
              </div>
              <div className="bg-[#111122] border border-white/5 rounded-2xl p-4 sm:p-5">
                <p className="text-white text-xs sm:text-sm mb-2">Spots left</p>
                <p className="text-white text-2xl sm:text-3xl font-bold">{spotsLeft}</p>
              </div>
            </div>

            <div className="bg-[#111122] border border-white/5 rounded-2xl p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4 mb-3">
                <p className="text-white text-sm sm:text-base font-medium">Ticket capacity</p>
                <p className="text-zinc-400 text-sm sm:text-base whitespace-nowrap">{ticketCount} / {event.capacity}</p>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-[#6c47ff] rounded-full transition-all duration-500" style={{ width: `${capacityPercent}%` }} />
              </div>
              <p className="text-zinc-600 text-xs sm:text-sm mt-2">{capacityPercent.toFixed(0)}% full</p>
            </div>

            <div className="bg-[#111122] border border-white/5 rounded-2xl p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="min-w-0">
                  <p className="text-white text-sm sm:text-base font-medium mb-1">Validator PIN</p>
                  <p className="text-white text-xs sm:text-sm">Share this PIN with your gate validators</p>
                </div>
                <button
                  onClick={() => setShowPin(!showPin)}
                  className="text-white hover:text-white transition-colors shrink-0"
                  aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
                >
                  {showPin ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-full px-3 sm:px-5 py-3 sm:py-4 font-mono text-lg sm:text-2xl tracking-[0.25em] sm:tracking-[0.5em] text-white overflow-hidden">
                  <span className="block truncate">{showPin ? event.eventPin : '••••••'}</span>
                </div>
                <button
                  onClick={handleCopyPin}
                  className="flex items-center justify-center bg-[#6c47ff]/20 border border-[#6c47ff]/30 hover:bg-[#6c47ff]/30 text-[#a78bfa] w-12 h-12 sm:w-auto sm:h-auto sm:px-4 sm:py-4 rounded-full transition-all shrink-0"
                  aria-label="Copy PIN"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VALIDATORS */}
        {tab === 'validators' && (
          <div className="space-y-4 sm:space-y-5">
            <div className="bg-[#111122] border border-white/10 rounded-2xl p-5 sm:p-6">
              <h3 className="text-white text-sm sm:text-base font-medium mb-4">Add validator</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <input
                  type="text"
                  placeholder="Validator name (e.g. Gate A Staff)"
                  value={validatorForm.name}
                  onChange={(e) => setValidatorForm({ ...validatorForm, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-3 text-white text-sm sm:text-base placeholder-white outline-none focus:border-[#6c47ff]/50 transition-colors"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={validatorForm.email}
                  onChange={(e) => setValidatorForm({ ...validatorForm, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-3 text-white text-sm sm:text-base placeholder-white outline-none focus:border-[#6c47ff]/50 transition-colors"
                />
              </div>
              <button
                onClick={handleAddValidator}
                disabled={addingValidator}
                className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#6c47ff] hover:bg-[#7c57ff] disabled:opacity-50 text-white text-sm sm:text-base font-medium px-5 py-3 rounded-full transition-all"
              >
                {addingValidator ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={14} /> Add & send magic link
                  </>
                )}
              </button>
            </div>

            {validators.length === 0 ? (
              <div className="bg-[#111122] border border-white/5 rounded-2xl p-8 sm:p-10 text-center">
                <Users size={40} className="text-zinc-700 mx-auto mb-3" />
                <p className="text-white text-sm sm:text-base">No validators added yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {validators.map((validator, index) => (
                  <div key={validator.id} className="bg-[#111122] border border-white/5 rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#6c47ff]/20 border border-[#6c47ff]/30 flex items-center justify-center text-[#a78bfa] font-bold text-sm shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm sm:text-base font-medium truncate">{validator.name}</p>
                      <p className="text-white text-xs sm:text-sm truncate mt-0.5">{validator.email}</p>
                    </div>
                    <span className="hidden sm:inline-flex text-xs px-2.5 sm:px-3 py-1 rounded-full bg-green-500/20 text-green-400 whitespace-nowrap shrink-0">
                      Link sent
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ATTENDEES */}
        {tab === 'attendees' && <AttendeesTab eventId={id} />}
      </main>

      <Footer />
    </div>
  );
}