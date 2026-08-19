import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Ticket, Users, Copy, Plus, Trash2, Eye, EyeOff, Send,} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import api from '../services/api';
import toast from 'react-hot-toast';
import FloatingTickets from '../components/ui/FloatingTickets';
import { formatEventTime } from '../utils/dateTime';
import Footer from '@/components/layout/Footer';

function AttendeesTab({ eventId }) {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAttendees();
  }, [eventId]);

  const fetchAttendees = async () => {
    try {
      const res = await api.get(`/events/${eventId}/attendees`);
      setAttendees(res.data);
    } catch {
      setAttendees([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = attendees.filter(t =>
    (t.guestName || t.user?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.guestEmail || t.user?.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 bg-[#111122] border border-white/10 rounded-xl px-4 py-3">
        <Search size={15} className="text-zinc-500" />
        <input
          type="text"
          placeholder="Search attendees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-white text-base placeholder-zinc-500 outline-none flex-1"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total bookings', value: attendees.length },
          { label: 'Validated', value: attendees.filter(t => t.status === 'USED').length },
          { label: 'Pending', value: attendees.filter(t => t.status === 'UNUSED').length },
        ].map(stat => (
          <div key={stat.label} className="bg-[#111122] border border-white/5 rounded-2xl p-4">
            <p className="text-zinc-500 text-base mb-1">{stat.label}</p>
            <p className="text-white text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-[#111122] border border-white/5 rounded-2xl h-16 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#111122] border border-white/5 rounded-2xl p-12 text-center">
          <Users size={40} className="text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500">{search ? 'No attendees match your search' : 'No bookings yet'}</p>
        </div>
      ) : (
        <div className="bg-[#111122] border border-white/5 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/5">
            <p className="text-zinc-500 text-base col-span-1">#</p>
            <p className="text-zinc-500 text-base col-span-4">Name</p>
            <p className="text-zinc-500 text-base col-span-4">Email</p>
            <p className="text-zinc-500 text-base col-span-2">Status</p>
            <p className="text-zinc-500 text-base col-span-1">Type</p>
          </div>
          {filtered.map((ticket, i) => (
            <div key={ticket.id} className="grid grid-cols-12 gap-4 px-5 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors items-center">
              <p className="text-zinc-600 text-base col-span-1">{i + 1}</p>
              <p className="text-white text-base font-medium col-span-4 truncate">
                {ticket.guestName || ticket.user?.name || '—'}
              </p>
              <p className="text-zinc-400 text-base col-span-4 truncate">
                {ticket.guestEmail || ticket.user?.email || '—'}
              </p>
              <div className="col-span-2">
                <span className={`text-base px-2 py-1 rounded-full ${ticket.status === 'USED'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-[#6c47ff]/20 text-[#a78bfa]'
                  }`}>
                  {ticket.status === 'USED' ? '✓ Validated' : '● Valid'}
                </span>
              </div>
              <div className="col-span-1">
                <span className="text-base text-zinc-600">
                  {ticket.userId ? 'User' : 'Guest'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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
    fetchAll();
  }, [id]);

  const fetchAll = async () => {
    try {
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
  };

  const handleAddValidator = async () => {
    if (!validatorForm.name || !validatorForm.email) {
      toast.error('Please fill in name and email');
      return;
    }
    try {
      setAddingValidator(true);
      const res = await api.post('/validators', { ...validatorForm, eventId: id });
      setValidators([...validators, res.data]);
      setValidatorForm({ name: '', email: '' });
      toast.success('Validator added and email sent!');
    } catch {
      toast.error('Failed to add validator');
    } finally {
      setAddingValidator(false);
    }
  };

  const handleCopyPin = () => {
    navigator.clipboard.writeText(event.eventPin);
    toast.success('PIN copied to clipboard!');
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
  // Show pending/rejected message
if (event.status === 'PENDING' || event.status === 'REJECTED' || event.status === 'DRAFT') {
  return (
    <div className="min-h-screen bg-[#090912] text-white">
      <FloatingTickets />
      <Navbar />
      <div className="relative max-w-3xl mx-auto px-6 pt-28 pb-20">
        <button
          onClick={() => navigate('/org/dashboard')}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to dashboard
        </button>

        <div className={`rounded-2xl p-8 border text-center ${
          event.status === 'PENDING' ? 'bg-yellow-500/5 border-yellow-500/20' :
          event.status === 'REJECTED' ? 'bg-red-500/5 border-red-500/20' :
          'bg-white/5 border-white/10'
        }`}>
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 ${
            event.status === 'PENDING' ? 'bg-yellow-500/20' :
            event.status === 'REJECTED' ? 'bg-red-500/20' :
            'bg-white/10'
          }`}>
            <span className="text-3xl">
              {event.status === 'PENDING' ? '⏳' : event.status === 'REJECTED' ? '❌' : '📝'}
            </span>
          </div>

          <h1 className="text-white text-2xl font-bold mb-2">{event.title}</h1>

          <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium mb-4 ${
            event.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
            event.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
            'bg-white/10 text-zinc-400'
          }`}>
            {event.status}
          </span>

          <p className="text-zinc-400 text-sm leading-relaxed max-w-md mx-auto mb-6">
            {event.status === 'PENDING' && "Your event is currently under review. You'll be notified once it's approved by our team."}
            {event.status === 'REJECTED' && "Your event was rejected. Please review our guidelines and submit a new event."}
            {event.status === 'DRAFT' && "This event is saved as a draft. Submit it for review when you're ready."}
          </p>

          <div className="flex items-center justify-center gap-4 text-sm text-zinc-500 mb-8">
            <span>📅 {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span>📍 {event.venue}</span>
            <span>👥 {event.capacity} capacity</span>
          </div>

          <div className="flex items-center justify-center gap-3">
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
                className="bg-[#6c47ff] hover:bg-[#7c57ff] text-white text-sm font-medium px-6 py-3 rounded-xl transition-all"
              >
                Submit for review
              </button>
            )}
            <button
              onClick={() => navigate('/org/dashboard')}
              className="bg-white/5 border border-white/10 hover:border-white/20 text-white text-sm font-medium px-6 py-3 rounded-xl transition-all"
            >
              Back to dashboard
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

  const date = new Date(event.date);
  const ticketCount = event._count?.tickets || 0;
  const capacityPercent = Math.min((ticketCount / event.capacity) * 100, 100);

  return (
    <div className="min-h-screen bg-[#090912] text-white">
      <FloatingTickets />
      <Navbar />

      <div className="relative max-w-5xl mx-auto px-6 pt-28 pb-20">

        {/* Back */}
        <button
          onClick={() => navigate('/org/dashboard')}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to dashboard
        </button>

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">{event.title}</h1>
              <span className={`text-base px-3 py-1 rounded-full ${event.status === 'PUBLISHED' ? 'bg-green-500/20 text-green-400' :
                  event.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                    event.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                      'bg-zinc-700 text-zinc-400'
                }`}>
                {event.status}
              </span>
            </div>
            <p className="text-zinc-500">{event.venue} · {date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} · {formatEventTime(date)}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl ${event.status === 'PUBLISHED' ? 'bg-green-500/10 border border-green-500/20 text-green-400' :
                event.status === 'PENDING' ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400' :
                  event.status === 'REJECTED' ? 'bg-red-500/10 border border-red-500/20 text-red-400' :
                    'bg-white/5 border border-white/10 text-zinc-400'
              }`}>
              {event.status === 'PUBLISHED' && <><Eye size={14} /> Published</>}
              {event.status === 'PENDING' && <><Clock size={14} /> Pending review</>}
              {event.status === 'REJECTED' && <><XCircle size={14} /> Rejected</>}
              {event.status === 'DRAFT' && <><EyeOff size={14} /> Draft</>}
            </div>
            <button
              onClick={handleDeleteEvent}
              className="flex items-center gap-2 text-base font-medium px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-white/5">
          {['overview', 'validators', 'attendees'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-base font-medium capitalize transition-colors border-b-2 -mb-px ${tab === t
                  ? 'border-[#6c47ff] text-white'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {tab === 'overview' && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Tickets booked', value: ticketCount },
                { label: 'Capacity', value: event.capacity },
                { label: 'Validators', value: validators.length },
                { label: 'Spots left', value: event.capacity - ticketCount },
              ].map((stat) => (
                <div key={stat.label} className="bg-[#111122] border border-white/5 rounded-2xl p-5">
                  <p className="text-zinc-500 text-base mb-2">{stat.label}</p>
                  <p className="text-white text-3xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#111122] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white text-base font-medium">Ticket capacity</p>
                <p className="text-zinc-400 text-base">{ticketCount} / {event.capacity}</p>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#6c47ff] rounded-full transition-all duration-500"
                  style={{ width: `${capacityPercent}%` }}
                />
              </div>
              <p className="text-zinc-600 text-base mt-2">{capacityPercent.toFixed(0)}% full</p>
            </div>

            <div className="bg-[#111122] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white font-medium mb-1">Validator PIN</p>
                  <p className="text-zinc-500 text-base">Share this PIN with your gate validators</p>
                </div>
                <button
                  onClick={() => setShowPin(!showPin)}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 font-mono text-2xl tracking-[0.5em] text-white">
                  {showPin ? event.eventPin : '••••••'}
                </div>
                <button
                  onClick={handleCopyPin}
                  className="flex items-center gap-2 bg-[#6c47ff]/20 border border-[#6c47ff]/30 hover:bg-[#6c47ff]/30 text-[#a78bfa] px-4 py-4 rounded-xl transition-all text-base"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Validators tab */}
        {tab === 'validators' && (
          <div className="space-y-5">
            <div className="bg-[#111122] border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-medium mb-4">Add validator</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <input
                  type="text"
                  placeholder="Validator name (e.g. Gate A Staff)"
                  value={validatorForm.name}
                  onChange={(e) => setValidatorForm({ ...validatorForm, name: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-base placeholder-zinc-500 outline-none focus:border-[#6c47ff]/50 transition-colors"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={validatorForm.email}
                  onChange={(e) => setValidatorForm({ ...validatorForm, email: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-base placeholder-zinc-500 outline-none focus:border-[#6c47ff]/50 transition-colors"
                />
              </div>
              <button
                onClick={handleAddValidator}
                disabled={addingValidator}
                className="flex items-center gap-2 bg-[#6c47ff] hover:bg-[#7c57ff] disabled:opacity-50 text-white text-base font-medium px-5 py-3 rounded-xl transition-all"
              >
                {addingValidator ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><Send size={14} /> Add & send magic link</>
                )}
              </button>
            </div>

            {validators.length === 0 ? (
              <div className="bg-[#111122] border border-white/5 rounded-2xl p-10 text-center">
                <Users size={40} className="text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-500">No validators added yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {validators.map((v, i) => (
                  <div key={v.id} className="bg-[#111122] border border-white/5 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#6c47ff]/20 border border-[#6c47ff]/30 flex items-center justify-center text-[#a78bfa] font-bold text-base flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium">{v.name}</p>
                      <p className="text-zinc-500 text-base truncate">{v.email}</p>
                    </div>
                    <span className="text-base px-3 py-1 rounded-full bg-green-500/20 text-green-400">
                      Link sent
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Attendees tab */}
        {tab === 'attendees' && <AttendeesTab eventId={id} />}
      </div>
      <Footer/>
    </div>
  );
}