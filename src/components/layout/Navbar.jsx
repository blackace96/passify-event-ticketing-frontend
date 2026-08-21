import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bell, User, LogOut, Ticket, CheckCheck, X, Menu, BadgeCheck } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import api from '../../services/api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);

  const notifRef = useRef(null);
  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMenuOpen(false);
    setNotifOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
      setUnread(res.data.filter((n) => !n.read).length);
    } catch { }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnread(0);
    } catch { }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      setUnread((prev) => Math.max(0, prev - 1));
    } catch { }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setUnread((prev) => {
        const notif = notifications.find((n) => n.id === id);
        return notif && !notif.read ? Math.max(0, prev - 1) : prev;
      });
    } catch { }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const timeAgo = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const dashboardLink =
    user?.role === 'ADMIN'
      ? { to: '/admin', label: 'Dashboard' }
      : user?.role === 'ORGANISER'
        ? { to: '/org/dashboard', label: 'Dashboard' }
        : user?.role === 'ATTENDEE'
          ? { to: '/dashboard', label: 'Dashboard' }
          : null;

  const navLinks = [
    { label: 'Events', to: '/events' },
    ...(user ? [{ label: 'My Tickets', to: '/my-tickets' }] : []),
    ...(dashboardLink ? [dashboardLink] : []),
    { label: 'About us', to: '/about' },
  ];

  return (
    <>
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#090912]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <svg width="48" height="24" viewBox="0 0 92 48" fill="none">
              <rect x="0" y="2" width="92" height="44" rx="9" fill="#6c47ff" />
              <circle cx="0" cy="24" r="9" fill="#090912" />
              <circle cx="92" cy="24" r="9" fill="#090912" />
              <line x1="22" y1="4" x2="22" y2="44" stroke="#090912" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="38" y="32" textAnchor="middle" fontSize="22" fontWeight="900" fill="white" fontFamily="system-ui">P</text>
            </svg>
            <span className="text-white font-bold tracking-widest text-base">PASSIFY</span>
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-zinc-200 hover:text-white text-base font-semibold transition-colors duration-200 relative group"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              {/* Notification Bell */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => {
                    setNotifOpen(!notifOpen);
                    setMenuOpen(false);
                    setMobileMenuOpen(false);
                  }}
                  className="relative text-zinc-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
                  aria-label="Notifications"
                >
                  <Bell size={25} />
                  {unread > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-[#6c47ff] rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </button>

                {/* Notifications Panel */}
                {notifOpen && (
                  <div className="absolute right-0 top-12 w-80 max-w-[calc(100vw-2rem)] bg-[#111122] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                      <p className="text-white text-sm font-semibold">Notifications</p>
                      {unread > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="flex items-center gap-1 text-[#a78bfa] text-xs hover:text-white transition-colors"
                        >
                          <CheckCheck size={12} /> Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="py-10 text-center">
                          <Bell size={28} className="text-white mx-auto mb-2" />
                          <p className="text-white text-sm">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => handleMarkRead(n.id)}
                            className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 ${!n.read ? 'bg-[#6c47ff]/5' : ''
                              }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${!n.read ? 'bg-[#6c47ff]/20' : 'bg-white/5'}`}>
                              <Ticket size={14} className={!n.read ? 'text-[#a78bfa]' : 'text-white'} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium truncate ${!n.read ? 'text-white' : 'text-zinc-400'}`}>{n.title}</p>
                              <p className="text-zinc-400 text-xs mt-0.5 leading-relaxed">{n.message}</p>
                              <p className="text-white text-[11px] mt-1">{timeAgo(n.createdAt)}</p>
                            </div>
                            {!n.read && <div className="w-2 h-2 rounded-full bg-[#6c47ff] flex-shrink-0 mt-2" />}
                            <button
                              onClick={(e) => handleDelete(e, n.id)}
                              className="text-white hover:text-zinc-300 transition-colors flex-shrink-0 mt-0.5 p-1"
                              aria-label="Delete notification"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => {
                    setMenuOpen(!menuOpen);
                    setNotifOpen(false);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 p-1 text-zinc-400 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#6c47ff] flex items-center justify-center">
                    {user?.role === 'ORGANISER' ? (
                      <BadgeCheck size={17} className="text-white" strokeWidth={1.8} />
                    ) : (
                      <User size={14} className="text-white" />
                    )}
                  </div>

                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-12 bg-[#111122] border border-white/10 rounded-2xl shadow-2xl w-48 py-2 z-50">
                    <div className="px-4 py-2 border-b border-white/5">
                      {user?.role === 'ORGANISER' ? (
                        <p className="text-white text-sm font-medium truncate">{user.orgName}</p>
                      ) : (
                        <p className="text-white text-sm font-medium truncate">{user.name}</p>
                      )}
                      <p className="text-white text-xs truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-zinc-300 hover:text-white hover:bg-white/5 text-sm transition-colors"
                    >
                      <User size={14} /> My Profile
                    </Link>
                    <button
                      onClick={() => setShowLogoutDialog(true)}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-white/5 text-sm transition-colors"
                    >
                      <LogOut size={14} /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-[#6c47ff] hover:bg-[#7c57ff] text-white text-sm font-semibold px-4 py-2 rounded-full transition-all shadow-md shadow-[#6c47ff]/20"
            >
              Sign in
            </Link>
          )}

          {/* Mobile Hamburger Button */}
          <div className="relative md:hidden" ref={mobileMenuRef}>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setNotifOpen(false);
                setMenuOpen(false);
              }}
              className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/5 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
              <div className="absolute right-0 top-12 w-56 bg-[#111122] border border-white/10 rounded-2xl shadow-2xl py-2 z-50 backdrop-blur-xl">
                <div className="px-3 py-1 space-y-1">
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.to;
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center px-3 py-2 rounded-full text-sm font-medium transition-colors ${isActive
                          ? 'bg-[#6c47ff]/15 text-[#a78bfa] font-semibold'
                          : 'text-zinc-300 hover:text-white hover:bg-white/5'
                          }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
            
          </div>
        </div>

      </div>
    </nav>
    {/* Sign Out Confirmation Modal */}
{showLogoutDialog && (
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 backdrop-blur-md"
    role="dialog"
    aria-modal="true"
    aria-labelledby="navbar-logout-title"
  >
    <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-[#11111f] shadow-2xl shadow-black/60">

      {/* Glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-red-500/10 blur-3xl" />

      <div className="relative p-6 sm:p-8">

        {/* Icon */}
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10">
          <LogOut
            size={28}
            strokeWidth={1.8}
            className="text-red-300"
          />
        </div>

        {/* Heading */}
        <h2
          id="navbar-logout-title"
          className="text-2xl font-bold tracking-tight text-white sm:text-3xl"
        >
          Are you sure?
        </h2>

        <p className="mt-3 text-base leading-7 text-zinc-400">
          Are you sure you want to sign out of your Passify account?
        </p>

        <p className="mt-2 text-sm font-medium text-zinc-500">
          You can always sign back in whenever you're ready.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={() => setShowLogoutDialog(false)}
            className="w-full rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/[0.08] hover:text-white sm:w-auto"
          >
            Stay signed in
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-950/30 transition hover:bg-red-400 sm:w-auto"
          >
            Yes, sign out
          </button>

        </div>
      </div>
    </div>
  </div>
)}
    </>
    
  );
}