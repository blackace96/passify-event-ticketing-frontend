const FLOATING_TICKETS = [
  { top: '8%', left: '4%', rotate: '-15deg', scale: 0.65, opacity: 0.12, anim: 0 },
  { top: '20%', right: '6%', rotate: '22deg', scale: 0.45, opacity: 0.08, anim: 1 },
  { top: '50%', left: '1%', rotate: '38deg', scale: 0.55, opacity: 0.1, anim: 2 },
  { top: '72%', right: '4%', rotate: '-28deg', scale: 0.7, opacity: 0.08, anim: 3 },
  { top: '88%', left: '8%', rotate: '12deg', scale: 0.4, opacity: 0.06, anim: 4 },
];

export default function FloatingTickets() {
  return (
    <>
      <style>{`
        @keyframes float0 { 0%,100%{transform:translateY(0px) rotate(-15deg) scale(0.65)} 50%{transform:translateY(-18px) rotate(-15deg) scale(0.65)} }
        @keyframes float1 { 0%,100%{transform:translateY(0px) rotate(22deg) scale(0.45)} 50%{transform:translateY(-14px) rotate(22deg) scale(0.45)} }
        @keyframes float2 { 0%,100%{transform:translateY(0px) rotate(38deg) scale(0.55)} 50%{transform:translateY(-22px) rotate(38deg) scale(0.55)} }
        @keyframes float3 { 0%,100%{transform:translateY(0px) rotate(-28deg) scale(0.7)} 50%{transform:translateY(-16px) rotate(-28deg) scale(0.7)} }
        @keyframes float4 { 0%,100%{transform:translateY(0px) rotate(12deg) scale(0.4)} 50%{transform:translateY(-12px) rotate(12deg) scale(0.4)} }
      `}</style>
      {FLOATING_TICKETS.map((t, i) => (
        <div key={i} style={{
          position: 'fixed', zIndex: 0,
          top: t.top, left: t.left, right: t.right,
          opacity: t.opacity,
          animation: `float${t.anim} ${7 + i * 1.2}s ease-in-out infinite`,
          pointerEvents: 'none',
        }}>
          <svg width="110" height="52" viewBox="0 0 110 52" fill="none">
            <rect x="0" y="2" width="110" height="48" rx="9" fill="#6c47ff"/>
            <circle cx="0" cy="26" r="9" fill="#080810"/>
            <circle cx="110" cy="26" r="9" fill="#080810"/>
            <line x1="26" y1="4" x2="26" y2="48" stroke="#080810" strokeWidth="1.5" strokeDasharray="3 3"/>
            <text x="68" y="34" textAnchor="middle" fontSize="20" fontWeight="900" fill="white" fontFamily="system-ui">P</text>
          </svg>
        </div>
      ))}
    </>
  );
}