import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, Users, Calendar, Eye, AlertCircle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import FloatingTickets from '../components/ui/FloatingTickets';
import Footer from '../components/layout/Footer';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pending');
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingId, setRejectingId] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [eventsRes, usersRes] = await Promise.all([api.get('/admin/events'), api.get('/admin/users')]);
        setEvents(eventsRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error('Failed to load admin data:', error);
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      await api.patch(`/admin/events/${id}/approve`);
      setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, status: 'PUBLISHED' } : e)));
      toast.success('Event approved and published!');
    } catch (error) {
      console.error('Failed to approve event:', error);
      toast.error('Failed to approve event');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    setProcessingId(id);
    try {
      await api.patch(`/admin/events/${id}/reject`, { reason: rejectReason });
      setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, status: 'REJECTED', rejectionReason: rejectReason } : e)));
      setRejectingId(null);
      setRejectReason('');
      toast.success('Event rejected');
    } catch (error) {
      console.error('Failed to reject event:', error);
      toast.error('Failed to reject event');
    } finally {
      setProcessingId(null);
    }
  };

  const { pendingCount, publishedCount, rejectedCount, filteredEvents } = useMemo(() => {
    const pCount = events.filter((e) => e.status === 'PENDING').length;
    const pubCount = events.filter((e) => e.status === 'PUBLISHED').length;
    const rCount = events.filter((e) => e.status === 'REJECTED').length;
    const filtered = events.filter((e) => tab === 'all' || e.status === tab.toUpperCase());
    return { pendingCount: pCount, publishedCount: pubCount, rejectedCount: rCount, filteredEvents: filtered };
  }, [events, tab]);

  const stats = [
    { label: 'Total events', value: events.length, icon: Calendar },
    { label: 'Pending review', value: pendingCount, icon: Clock },
    { label: 'Published', value: publishedCount, icon: CheckCircle },
    { label: 'Total users', value: users.length, icon: Users },
  ];

  const tabs = [
    { id: 'pending', label: 'Pending', count: pendingCount },
    { id: 'published', label: 'Published', count: publishedCount },
    { id: 'rejected', label: 'Rejected', count: rejectedCount },
    { id: 'users', label: 'Users', count: users.length },
  ];

  const getStatusStyles = (status) => {
    if (status === 'PUBLISHED') return 'bg-green-500/10 border-green-500/20 text-green-400';
    if (status === 'REJECTED') return 'bg-red-500/10 border-red-500/20 text-red-400';
    return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
  };

  const getUserRoleStyles = (role) => {
    if (role === 'ADMIN') return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    if (role === 'ORGANISER') return 'bg-[#6c47ff]/10 text-[#a78bfa] border-[#6c47ff]/20';
    return 'bg-white/5 text-zinc-400 border-white/5';
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#090912] text-white">
      <Navbar />
      <FloatingTickets />

      <main className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 sm:pb-20">
        {/* Header */}
        <section className="mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-2">
            <div className="flex items-center gap-3 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">Admin Dashboard</h1>
              {pendingCount > 0 && (
                <span className="flex-shrink-0 bg-[#6c47ff] text-white text-xs sm:text-sm font-bold px-2.5 sm:px-3 py-1 rounded-full">
                  {pendingCount} pending
                </span>
              )}
            </div>
          </div>
          <p className="text-sm sm:text-base text-zinc-500">Review and manage events and users</p>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-[#111122] border border-white/5 rounded-2xl p-4 sm:p-5 min-w-0 hover:border-white/10 transition-colors">
              <div className="flex items-center justify-between gap-2 mb-3">
                <p className="text-xs sm:text-sm text-zinc-500 truncate">{label}</p>
                <Icon size={15} className="flex-shrink-0 text-[#6c47ff]" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-white">{value}</p>
            </div>
          ))}
        </section>

        {/* Tabs Bar */}
        <div className="mb-7 sm:mb-8 border-b border-white/5">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-hide overflow-y-hidden">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`flex-shrink-0 whitespace-nowrap flex items-center gap-2 px-3 sm:px-4 py-3 text-sm sm:text-base font-medium border-b-2 -mb-px transition-colors ${
                  tab === item.id ? 'border-[#6c47ff] text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {item.label}
                {item.id === 'pending' && item.count > 0 && (
                  <span className="min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-[#6c47ff] text-white text-[11px] font-bold">
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Events View */}
        {tab !== 'users' && (
          <section className="space-y-3 sm:space-y-4">
            {loading ? (
              [1, 2, 3].map((i) => <div key={i} className="bg-[#111122] border border-white/5 rounded-2xl h-36 sm:h-28 animate-pulse" />)
            ) : filteredEvents.length === 0 ? (
              <div className="bg-[#111122] border border-white/5 rounded-2xl p-8 sm:p-12 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <Calendar size={22} className="text-zinc-600" />
                </div>
                <p className="text-sm sm:text-base text-zinc-500">No {tab} events</p>
              </div>
            ) : (
              filteredEvents.map((event) => {
                const isProcessing = processingId === event.id;
                return (
                  <article key={event.id} className="bg-[#111122] border border-white/5 rounded-2xl p-4 sm:p-5 hover:border-white/10 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="w-full h-40 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                        <img
                          src={event.image || 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80'}
                          alt={event.title || 'Event'}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <h3 className="text-sm sm:text-base font-semibold text-white break-words">{event.title}</h3>
                          <span className={`inline-flex flex-shrink-0 items-center text-[10px] sm:text-xs font-medium px-2 py-1 rounded-full border ${getStatusStyles(event.status)}`}>
                            {event.status}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-500 break-words">
                          {event.venue || 'Venue not specified'} · {new Date(event.date).toLocaleDateString()}
                        </p>
                        <p className="text-xs sm:text-sm text-zinc-600 mt-1.5 break-words">
                          By {event.organiser?.name || 'Unknown organiser'} · {event._count?.tickets || 0} tickets · Capacity {event.capacity || 0}
                        </p>
                      </div>

                      {event.status === 'PENDING' && (
                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => navigate(`/events/${event.id}`)}
                            disabled={isProcessing}
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm text-zinc-400 hover:text-white px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all disabled:opacity-50"
                          >
                            <Eye size={13} /> Preview
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApprove(event.id)}
                            disabled={isProcessing}
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 text-green-400 text-xs sm:text-sm px-3 py-2.5 rounded-lg transition-all disabled:opacity-50"
                          >
                            <CheckCircle size={13} /> {isProcessing ? 'Processing...' : 'Approve'}
                          </button>
                          <button
                            type="button"
                            onClick={() => { setRejectingId(event.id); setRejectReason(''); }}
                            disabled={isProcessing}
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-xs sm:text-sm px-3 py-2.5 rounded-lg transition-all disabled:opacity-50"
                          >
                            <XCircle size={13} /> Reject
                          </button>
                        </div>
                      )}
                    </div>

                    {rejectingId === event.id && (
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <div className="flex items-start gap-3 mb-3">
                          <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-red-400" />
                          <div>
                            <p className="text-sm font-medium text-white">Reject this event</p>
                            <p className="text-xs text-zinc-500 mt-0.5">You can optionally provide a reason for the organiser.</p>
                          </div>
                        </div>
                        <input
                          type="text"
                          placeholder="Reason for rejection (optional)"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          disabled={isProcessing}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-red-500/50 transition-colors disabled:opacity-50"
                        />
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3">
                          <button
                            type="button"
                            onClick={() => handleReject(event.id)}
                            disabled={isProcessing}
                            className="inline-flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-sm px-4 py-2.5 rounded-xl transition-all disabled:opacity-50"
                          >
                            <XCircle size={14} /> {isProcessing ? 'Rejecting...' : 'Confirm rejection'}
                          </button>
                          <button
                            type="button"
                            onClick={() => { setRejectingId(null); setRejectReason(''); }}
                            disabled={isProcessing}
                            className="text-zinc-500 hover:text-white text-sm px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </section>
        )}

        {/* Users View */}
        {tab === 'users' && (
          <section className="bg-[#111122] border border-white/5 rounded-2xl overflow-hidden">
            <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/5 text-xs sm:text-sm text-zinc-500">
              <p className="col-span-4">Name</p>
              <p className="col-span-4">Email</p>
              <p className="col-span-2">Role</p>
              <p className="col-span-2">Activity</p>
            </div>

            {loading ? (
              <div className="p-5 space-y-3">
                {[1, 2, 3, 4].map((i) => <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />)}
              </div>
            ) : users.length === 0 ? (
              <div className="p-10 text-center">
                <Users size={32} className="mx-auto mb-3 text-zinc-700" />
                <p className="text-sm text-zinc-500">No users found</p>
              </div>
            ) : (
              users.map((user) => (
                <div key={user.id} className="flex flex-col gap-4 sm:grid sm:grid-cols-12 sm:gap-4 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <div className="sm:col-span-4 min-w-0">
                    <p className="text-[11px] text-zinc-600 mb-1 sm:hidden uppercase tracking-wide">Name</p>
                    <p className="text-sm text-white font-medium truncate">{user.name || 'Unnamed user'}</p>
                  </div>
                  <div className="sm:col-span-4 min-w-0">
                    <p className="text-[11px] text-zinc-600 mb-1 sm:hidden uppercase tracking-wide">Email</p>
                    <p className="text-sm text-zinc-400 break-all">{user.email}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-[11px] text-zinc-600 mb-1 sm:hidden uppercase tracking-wide">Role</p>
                    <span className={`inline-flex text-xs px-2 py-1 rounded-full border ${getUserRoleStyles(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-[11px] text-zinc-600 mb-1 sm:hidden uppercase tracking-wide">Activity</p>
                    <p className="text-sm text-zinc-500">
                      {user._count?.tickets || 0} tickets · {user._count?.events || 0} events
                    </p>
                  </div>
                </div>
              ))
            )}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}