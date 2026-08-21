import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Ticket, Building2, CheckCircle } from 'lucide-react';
import FloatingTickets from '../components/ui/FloatingTickets';

export default function RoleSelectPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);

  const roles = [
    {
      id: 'ATTENDEE',
      label: 'Attendee',
      desc: 'I want to browse events and book tickets',
      icon: Ticket,
      perks: ['Browse all events', 'Book tickets instantly', 'Get QR code ticket', 'View my tickets'],
    },
    {
      id: 'ORGANISER',
      label: 'Organiser',
      desc: 'I want to create and manage events',
      icon: Building2,
      perks: ['Create events', 'Manage attendees', 'Assign gate validators', 'View event analytics'],
    },
  ];

  const handleConfirm = async () => {
    if (!selected) return;
    if (selected === 'ORGANISER' && !orgName.trim()) {
      toast.error('Please enter your organisation name');
      return;
    }
    try {
      setLoading(true);
      const res = await api.patch('/auth/role', { role: selected });
      login(res.data.token, res.data.user);

      // Save org name if organiser
      if (selected === 'ORGANISER' && orgName.trim()) {
        const orgRes = await api.patch('/auth/org-name', { orgName: orgName.trim() });
        login(orgRes.data.token, orgRes.data.user);
      }

      toast.success('Welcome to PASSIFY!');
      navigate(selected === 'ORGANISER' ? '/org/dashboard' : '/dashboard', { replace: true });
    } catch {
      toast.error('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090912] flex items-center justify-center px-4 relative overflow-hidden">
      <FloatingTickets />

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6c47ff] opacity-10 rounded-full blur-[150px]" />
      </div>

      <div className="relative w-full max-w-2xl z-10">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-5">
            <svg width="80" height="40" viewBox="0 0 92 48" fill="none">
              <rect x="0" y="2" width="92" height="44" rx="9" fill="#6c47ff"/>
              <circle cx="0" cy="24" r="9" fill="#0d0d1a"/>
              <circle cx="92" cy="24" r="9" fill="#0d0d1a"/>
              <line x1="22" y1="4" x2="22" y2="44" stroke="#0d0d1a" strokeWidth="1.5" strokeDasharray="3 3"/>
              <text x="38" y="32" textAnchor="middle" fontSize="22" fontWeight="900" fill="white" fontFamily="system-ui">P</text>
            </svg>
          </div>
          <h1 className="text-white text-3xl font-bold mb-2">
            Welcome, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-white">How will you be using PASSIFY?</p>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selected === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelected(role.id)}
                className={`relative text-left bg-[#111122] border rounded-2xl p-6 transition-all duration-200 ${
                  isSelected
                    ? 'border-[#6c47ff] shadow-[0_0_30px_rgba(108,71,255,0.2)]'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle size={20} className="text-[#6c47ff]" />
                  </div>
                )}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                  isSelected ? 'bg-[#6c47ff]' : 'bg-white/5'
                }`}>
                  <Icon size={22} className={isSelected ? 'text-white' : 'text-zinc-400'} />
                </div>
                <h3 className="text-white text-lg font-semibold mb-1">{role.label}</h3>
                <p className="text-white text-base mb-5">{role.desc}</p>
                <ul className="space-y-2">
                  {role.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2 text-zinc-400 text-base">
                      <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#6c47ff]' : 'bg-zinc-600'}`} />
                      {perk}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        {/* Org name field — only shows when Organiser is selected */}
        {selected === 'ORGANISER' && (
          <div className="bg-[#111122] border border-white/10 rounded-2xl p-5 mb-6">
            <label className="block text-zinc-400 text-base font-medium uppercase tracking-wider mb-3">
              Organisation name
            </label>
            <input
              type="text"
              placeholder="e.g. Afro Nation Events, KNUST SRC..."
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-3 text-white text-base placeholder-white outline-none focus:border-[#6c47ff]/50 transition-colors"
            />
            <p className="text-zinc-600 text-base mt-2">This will be shown on your events as the organiser name</p>
          </div>
        )}

        {/* Confirm button */}
        <button
          onClick={handleConfirm}
          disabled={!selected || loading}
          className="w-full flex items-center justify-center gap-2 bg-[#6c47ff] hover:bg-[#7c57ff] disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-4 rounded-full transition-all duration-200 text-base"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            `Continue as ${selected ? roles.find(r => r.id === selected)?.label : '...'}`
          )}
        </button>

        <p className="text-zinc-600 text-base text-center mt-4">
          You can contact support if you need to change your role later.
        </p>
      </div>
    </div>
  );
}