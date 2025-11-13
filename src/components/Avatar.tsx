type Props = {
  speaking?: boolean;
  preset?: 'default' | 'energetic-hero' | 'supersain';
};

export default function Avatar({ speaking = false, preset = 'default' }: Props) {
  // color variations for presets
  const bg = preset === 'energetic-hero' ? '#ffdd57' : '#e2e8f0';
  const cheek = preset === 'energetic-hero' ? '#ffb4b4' : '#fca5a5';
  const hairColor = preset === 'supersain' ? '#FFD54A' : '#333333';
  const auraColor = preset === 'supersain' ? '#FFD54A' : 'transparent';

  return (
    <div role="img" aria-label={`Avatar (${preset})`} className="avatar-root" style={{ width: 48, height: 48 }}>
      <svg viewBox="0 0 64 64" width="48" height="48" aria-hidden="false" focusable="false" role="img">
        <title>{`Avatar — ${preset}`}</title>
        <desc>Stylized avatar with optional glowing aura for the "supersain" preset.</desc>
        <defs>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1" />
          </filter>
          <radialGradient id="auraGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={auraColor} stopOpacity="0.9" />
            <stop offset="60%" stopColor={auraColor} stopOpacity="0.35" />
            <stop offset="100%" stopColor={auraColor} stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* aura */}
        {preset === 'supersain' && (
          <g>
            <circle cx="32" cy="32" r="34" fill="url(#auraGrad)" style={{ mixBlendMode: 'screen', filter: 'blur(6px)', opacity: 0.9 }} />
            <circle cx="32" cy="32" r="34" fill="none" stroke={auraColor} strokeWidth="1" style={{ filter: 'blur(2px)', opacity: 0.6 }} />
          </g>
        )}

        <circle cx="32" cy="32" r="30" fill={bg} stroke="#cbd5e1" strokeWidth="1" />
        {/* spiky hair */}
        {preset === 'supersain' && (
          <g transform="translate(0,-6)">
            <path d="M8 18 L16 8 L24 20 L32 6 L40 20 L48 8 L56 18 C50 12 44 10 32 12 C20 10 14 12 8 18 Z" fill={hairColor} />
            {/* small highlights */}
            <path d="M20 14 L28 10" stroke="#fff3b0" strokeWidth="1" strokeOpacity="0.25" strokeLinecap="round" />
          </g>
        )}
        {/* eyes */}
        <circle cx="22" cy="24" r="4" fill="#111827" />
        <circle cx="42" cy="24" r="4" fill="#111827" />
        {/* cheeks */}
        <circle cx="18" cy="34" r="3" fill={cheek} opacity="0.9" />
        <circle cx="46" cy="34" r="3" fill={cheek} opacity="0.9" />

        {/* mouth group - animate scaleY when speaking */}
        <g transform="translate(32,44)">
          <rect
            x={-8}
            y={-2}
            width={16}
            height={6}
            rx={3}
            fill="#111827"
            style={{ transformOrigin: 'center', transform: speaking ? 'scaleY(1.5)' : 'scaleY(1)', transition: 'transform 120ms ease-in-out' }}
          />
        </g>
      </svg>

      <style>{`
        .avatar-root { display: inline-block; }
        .avatar-root svg { display: block; }
        /* reduce pointer events to avoid unexpected focus */
        .avatar-root svg { pointer-events: none; }
      `}</style>
    </div>
  );
}
