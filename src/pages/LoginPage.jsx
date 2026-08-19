import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Ticket, Smartphone, Calendar, Mail } from 'lucide-react';
import Footer from '../components/layout/Footer';
import { Link } from 'react-router-dom';

const EVENTS = [
  { name: 'Afro Nation Ghana', date: 'Dec 12', attendees: '4.2k' },
  { name: 'KNUST Tech Summit', date: 'Dec 20', attendees: '800' },
  { name: 'New Year Bash 2026', date: 'Dec 31', attendees: '2.1k' },
];

const FLOATING_TICKETS = [
  { top: '8%', left: '4%', rotate: '-15deg', scale: 0.65, opacity: 0.12, anim: 0 },
  { top: '20%', right: '6%', rotate: '22deg', scale: 0.45, opacity: 0.08, anim: 1 },
  { top: '50%', left: '1%', rotate: '38deg', scale: 0.55, opacity: 0.1, anim: 2 },
  { top: '72%', right: '4%', rotate: '-28deg', scale: 0.7, opacity: 0.08, anim: 3 },
  { top: '88%', left: '8%', rotate: '12deg', scale: 0.4, opacity: 0.06, anim: 4 },
];

const LogoSVG = ({ w = 48, h = 24, bg = '#080810' }) => (
  <svg width={w} height={h} viewBox="0 0 92 48" fill="none">
    <rect x="0" y="2" width="92" height="44" rx="9" fill="#6c47ff" />
    <circle cx="0" cy="24" r="9" fill={bg} />
    <circle cx="92" cy="24" r="9" fill={bg} />
    <line x1="22" y1="4" x2="22" y2="44" stroke={bg} strokeWidth="1.5" strokeDasharray="3 3" />
    <text x="38" y="32" textAnchor="middle" fontSize="22" fontWeight="900" fill="white" fontFamily="system-ui">P</text>
  </svg>
);

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [activeEvent, setActiveEvent] = useState(0);

  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') navigate('/admin', { replace: true });
      else if (!user.roleSelected) navigate('/select-role', { replace: true });
      else navigate(user.role === 'ORGANISER' ? '/org/dashboard' : '/', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const interval = setInterval(() => setActiveEvent(p => (p + 1) % EVENTS.length), 3000);
    return () => clearInterval(interval);
  }, []);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await api.post('/auth/google', { access_token: tokenResponse.access_token });
        login(res.data.token, res.data.user);
        toast.success(`Welcome, ${res.data.user.name}!`);
        if (res.data.user.role === 'ADMIN') {
          navigate('/admin', { replace: true });
        } else if (!res.data.user.roleSelected) {
          navigate('/select-role', { replace: true });
        } else {
          navigate(res.data.user.role === 'ORGANISER' ? '/org/dashboard' : '/dashboard', { replace: true });
        }
      } catch {
        toast.error('Login failed. Please try again.');
      }
    },
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at top left, rgba(108,71,255,0.13) 0%, transparent 40%), radial-gradient(circle at bottom right, rgba(168,85,247,0.1) 0%, transparent 40%), #080810',
      display: 'flex', overflow: 'hidden', position: 'relative',
    }}>

      <style>{`
        @keyframes float0 { 0%,100%{transform:translateY(0px) rotate(-15deg) scale(0.65)} 50%{transform:translateY(-18px) rotate(-15deg) scale(0.65)} }
        @keyframes float1 { 0%,100%{transform:translateY(0px) rotate(22deg) scale(0.45)} 50%{transform:translateY(-14px) rotate(22deg) scale(0.45)} }
        @keyframes float2 { 0%,100%{transform:translateY(0px) rotate(38deg) scale(0.55)} 50%{transform:translateY(-22px) rotate(38deg) scale(0.55)} }
        @keyframes float3 { 0%,100%{transform:translateY(0px) rotate(-28deg) scale(0.7)} 50%{transform:translateY(-16px) rotate(-28deg) scale(0.7)} }
        @keyframes float4 { 0%,100%{transform:translateY(0px) rotate(12deg) scale(0.4)} 50%{transform:translateY(-12px) rotate(12deg) scale(0.4)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .google-btn:hover {
          background:#f0f0f0!important;
          transform:translateY(-3px) scale(1.01)!important;
          box-shadow:0 10px 40px rgba(108,71,255,0.3), 0 4px 16px rgba(0,0,0,0.3)!important;
        }
        .back-btn:hover { color:rgba(255,255,255,0.5)!important; }
        .left-panel { display:none!important; }
        .right-panel { width:100%!important; }
        .mobile-logo { display:flex!important; }
        .mobile-stats { display:flex!important; }
        @media(min-width:1024px) {
          .left-panel { display:flex!important; width:50%!important; flex-shrink:0!important; }
          .right-panel { width:50%!important; flex-shrink:0!important; }
          .mobile-logo { display:none!important; }
          .mobile-stats { display:none!important; }
        }
      `}</style>

      {/* Ambient glows */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: 700, height: 700, background: 'radial-gradient(circle, rgba(108,71,255,0.12) 0%, transparent 65%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 65%)', borderRadius: '50%' }} />
      </div>

      {/* Floating tickets */}
      {FLOATING_TICKETS.map((t, i) => (
        <div key={i} style={{
          position: 'fixed', zIndex: 0,
          top: t.top, left: t.left, right: t.right,
          opacity: t.opacity,
          animation: `float${t.anim} ${7 + i * 1.2}s ease-in-out infinite`,
          pointerEvents: 'none',
        }}>
          <svg width="110" height="52" viewBox="0 0 110 52" fill="none">
            <rect x="0" y="2" width="110" height="48" rx="9" fill="#6c47ff" />
            <circle cx="0" cy="26" r="9" fill="#080810" />
            <circle cx="110" cy="26" r="9" fill="#080810" />
            <line x1="26" y1="4" x2="26" y2="48" stroke="#080810" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="68" y="34" textAnchor="middle" fontSize="20" fontWeight="900" fill="white" fontFamily="system-ui">P</text>
          </svg>
        </div>
      ))}

      {/* ── LEFT PANEL ── */}
      <div className="left-panel" style={{
        flexDirection: 'column', justifyContent: 'center', gap: 40,
        padding: '30px 56px', position: 'relative', zIndex: 1,
        minHeight: '100vh',
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            type="button"
            onClick={() => navigate('/')}
            aria-label="Go to Passify home"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: 0,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            <LogoSVG w={48} h={24} />
            <span style={{ color: 'white', fontWeight: 700, letterSpacing: '0.2em', fontSize: 20 }}>PASSIFY</span>
          </button>
        </div>

        {/* Hero text */}
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(108,71,255,0.15)', border: '1px solid rgba(108,71,255,0.25)',
            borderRadius: 100, padding: '6px 14px', marginBottom: 24,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', animation: 'pulse 2s infinite' }} />
            <span style={{ color: '#a78bfa', fontSize: 15, fontWeight: 500, letterSpacing: '0.05em' }}>Events happening now</span>
          </div>

          <h1 style={{
            color: 'white', fontSize: 52, fontWeight: 800,
            lineHeight: 1.1, margin: '0 0 16px', letterSpacing: '-0.03em',
          }}>
            Your ticket to<br />
            <span style={{ color: '#6c47ff' }}>every experience</span>
          </h1>

          <p style={{ color: 'white', fontSize: 20, lineHeight: 1.7, maxWidth: 380, margin: 0 }}>
            Book tickets, manage events, and validate entry  all in one place.
          </p>
        </div>

        {/* Event ticker */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: 16, padding: '4px 0',
        }}>
          {EVENTS.map((event, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px',
              borderBottom: i < EVENTS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              opacity: activeEvent === i ? 1 : 0.3,
              transform: activeEvent === i ? 'translateX(6px)' : 'translateX(0)',
              transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)',
            }}>
              <div style={{
                width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                background: activeEvent === i ? '#6c47ff' : 'rgba(255,255,255,0.15)',
                boxShadow: activeEvent === i ? '0 0 10px rgba(108,71,255,0.8)' : 'none',
                transition: 'all 0.5s',
              }} />
              <div style={{ flex: 1 }}>
                <p style={{ color: 'white', fontSize: 13, fontWeight: 500, margin: 0 }}>{event.name}</p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: 0 }}>{event.date} · {event.attendees} attending</p>
              </div>
              {activeEvent === i && (
                <span style={{
                  background: 'rgba(108,71,255,0.25)', color: '#a78bfa',
                  fontSize: 9, fontWeight: 700, padding: '3px 8px',
                  borderRadius: 4, letterSpacing: '0.08em',
                }}>LIVE</span>
              )}
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex' }}>
            {['#6c47ff', '#a855f7', '#8b5cf6', '#7c3aed'].map((c, i) => (
              <div key={i} style={{
                width: 28, height: 28, borderRadius: '50%',
                background: c, border: '2px solid #080810',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: 11, fontWeight: 700,
                marginLeft: i > 0 ? -8 : 0,
              }}>
                {['A', 'K', 'E', 'M'][i]}
              </div>
            ))}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: 0 }}>
            Trusted by <span style={{ color: 'rgba(255,255,255,0.7)' }}>500+ organizers</span> across Ghana
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="right-panel" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 40px', position: 'relative', zIndex: 1,
        // borderLeft: '1px solid rgba(255,255,255,0.04)',
        minHeight: '100vh',
      }}>
        <div style={{ width: '100%', maxWidth: 440, maxHeight: '100%', animation: 'slideUp 0.7s ease' }}>

          {/* Mobile logo */}
          {/* Glass card */}
          <div style={{
            borderRadius: 24,
            padding: 40,
            background: 'linear-gradient(145deg, rgba(108,71,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(168,85,247,0.05) 100%)',
            border: '1px solid rgba(108,71,255,0.2)',
            boxShadow: `
      0 25px 80px rgba(0,0,0,0.45),
      0 0 40px rgba(108,71,255,0.06),
      inset 0 1px 0 rgba(255,255,255,0.08)
    `,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
          >
            {/* Centered Mobile Logo */}
            <div className="mobile-logo" style={{ width: '100%', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
              <button
                type="button"
                onClick={() => navigate('/')}
                aria-label="Go to Passify home"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  margin: '0 auto',
                  width: '100%',
                }}
              >
                <LogoSVG w={64} h={34} />
                <span
                  style={{ color: 'white', fontWeight: 700, letterSpacing: '0.22em', textIndent: '0.22em', fontSize: 20, marginTop: 12, display: 'block', textAlign: 'center',
}}
                >
                  PASSIFY
                </span>
              </button>
            </div>
            {/* Heading */}
            <div style={{ marginBottom: 28, alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ color: 'white', fontSize: 30, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                Welcome back
              </h2>
              <p style={{ color: 'white', fontSize: 14, margin: 0 }}>
                Sign in to continue to PASSIFY
              </p>
            </div>

            {/* Google button */}
            <button
              onClick={() => handleGoogleLogin()}
              className="google-btn"
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 10, background: 'white', border: 'none', borderRadius: 80,
                padding: '13px 13px', fontSize: 14, fontWeight: 600, color: '#111',
                cursor: 'pointer', marginBottom: 20, transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              Continue with Google
            </button>
            <p style={{ color: 'white', fontSize: 14, textAlign: 'center', margin: '0 0 14px', lineHeight: 1.6 }}>
              If you're new here, clicking continue will create an account.
            </p>

            {/* Terms */}
<p style={{ color: 'white', fontSize: 15, textAlign: 'center', margin: '0 0 14px',  lineHeight: 1.6,}}
>
  By continuing you agree to PASSIFY&apos;s{' '}
  <Link
    to="/terms"
    style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: 600 }}
  >
    Terms of Service
  </Link>
  {' '}and{' '}
  <Link
    to="/privacy"
    style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: 600 }}
  >
    Privacy Policy
  </Link>
  .
</p>


          </div>
        </div>
      </div>
    </div>

  );
}