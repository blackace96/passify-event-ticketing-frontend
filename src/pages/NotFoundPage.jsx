import { useNavigate } from 'react-router-dom';
import { Ticket, Home, ArrowLeft } from 'lucide-react';
import FloatingTickets from '../components/ui/FloatingTickets';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#090912] text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <FloatingTickets />

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6c47ff] opacity-10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 text-center max-w-md">

        {/* Big 404 */}
        <div className="relative mb-8">
          <p className="text-[160px] font-black leading-none text-white/5 select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-3xl bg-[#6c47ff]/20 border border-[#6c47ff]/30 flex items-center justify-center">
              <Ticket size={44} className="text-[#6c47ff]" />
            </div>
          </div>
        </div>

        {/* Text */}
        <h1 className="text-3xl font-bold text-white mb-3">Page not found</h1>
        <p className="text-zinc-500 text-base leading-relaxed mb-10">
          Looks like this ticket has expired. The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-white/20 text-white text-base font-medium px-6 py-3 rounded-xl transition-all w-full sm:w-auto justify-center"
          >
            <ArrowLeft size={16} /> Go back
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-[#6c47ff] hover:bg-[#7c57ff] text-white text-base font-medium px-6 py-3 rounded-xl transition-all w-full sm:w-auto justify-center"
          >
            <Home size={16} /> Back to home
          </button>
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mt-12 opacity-30">
          <svg width="36" height="18" viewBox="0 0 92 48" fill="none">
            <rect x="0" y="2" width="92" height="44" rx="9" fill="#6c47ff"/>
            <circle cx="0" cy="24" r="9" fill="#0d0d1a"/>
            <circle cx="92" cy="24" r="9" fill="#0d0d1a"/>
            <line x1="22" y1="4" x2="22" y2="44" stroke="#0d0d1a" strokeWidth="1.5" strokeDasharray="3 3"/>
            <text x="38" y="32" textAnchor="middle" fontSize="22" fontWeight="900" fill="white" fontFamily="system-ui">P</text>
          </svg>
          <span className="text-white font-bold tracking-widest text-base">PASSIFY</span>
        </div>
      </div>
    </div>
  );
}