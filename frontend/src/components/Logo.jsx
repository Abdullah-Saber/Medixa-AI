export default function Logo({ size = 28 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="15" stroke="#0bceaa" strokeWidth="1.5" strokeDasharray="4 2" />
        <circle cx="16" cy="16" r="6" fill="rgba(11,206,170,.15)" stroke="#0bceaa" strokeWidth="1.5" />
        <circle cx="16" cy="16" r="2.5" fill="#0bceaa" />
        <line x1="16" y1="4"  x2="16" y2="10" stroke="#0bceaa" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="16" y1="22" x2="16" y2="28" stroke="#0bceaa" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="4"  y1="16" x2="10" y2="16" stroke="#0bceaa" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="22" y1="16" x2="28" y2="16" stroke="#0bceaa" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span
        style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 700,
          fontSize: size * 0.7,
          color: '#e8f4f0',
          letterSpacing: '-.3px',
        }}
      >
        Smart<span style={{ color: '#0bceaa' }}>Lab</span>
      </span>
    </div>
  );
}
