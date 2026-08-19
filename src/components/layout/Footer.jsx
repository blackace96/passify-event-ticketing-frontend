import { useNavigate } from 'react-router-dom';
import { Ticket } from 'lucide-react';
import AboutPage from '@/pages/AboutPage';
import TermsPage from '@/pages/TermsPage';
import FloatingTickets from '@/components/ui/FloatingTickets';

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/5 bg-[#090912] mt-20">
      <FloatingTickets />

      {/* Top glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-[#6c47ff]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 pt-10 pb-6">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-14">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5 cursor-pointer" onClick={() => navigate('/')}>
              <svg width="48" height="24" viewBox="0 0 92 48" fill="none">
                <rect x="0" y="2" width="92" height="44" rx="9" fill="#6c47ff"/>
                <circle cx="0" cy="24" r="9" fill="#0a0a16"/>
                <circle cx="92" cy="24" r="9" fill="#0a0a16"/>
                <line x1="22" y1="4" x2="22" y2="44" stroke="#0a0a16" strokeWidth="1.5" strokeDasharray="3 3"/>
                <text x="38" y="32" textAnchor="middle" fontSize="22" fontWeight="900" fill="white" fontFamily="system-ui">P</text>
              </svg>
              <span className="text-white font-bold tracking-widest text-base">PASSIFY</span>
            </div>
            <p className="text-zinc-500 text-base leading-relaxed max-w-xs">
              The modern event ticketing platform for Ghana and beyond. Book tickets, manage events, validate entry all in one place.
            </p>
          </div>

          {/* Platform links */}
          <div>
            <p className="text-white text-base font-semibold uppercase tracking-widest mb-5">Platform</p>
            <ul className="space-y-3">
              {[
                { label: 'Browse events', path: '/events' },
                { label: 'My tickets', path: '/my-tickets' },
                { label: 'Sign in', path: '/login' },
                { label: 'Create event', path: '/org/events/create' },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-zinc-500 hover:text-white text-base transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#6c47ff] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <p className="text-white text-base font-semibold uppercase tracking-widest mb-5">Company</p>
            <ul className="space-y-3">
              {[
                { label: 'About us', path: '/about' },
                { label: 'Terms of service', path: '/terms' },
                { label: 'Privacy policy', path: '/privacy' },
                { label: 'Support', path: '/support' },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-zinc-500 hover:text-white text-base transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#6c47ff] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-2 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-zinc-400 text-md">
            © {year} PASSIFY. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-zinc-400 text-md">
            <Ticket size={12} className="text-[#6c47ff]" />
            <span>Secure · Fast · Reliable ticketing</span>
          </div>
        </div>
      </div>
    </footer>
  );
}