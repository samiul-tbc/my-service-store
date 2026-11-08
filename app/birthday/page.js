'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { decodeBirthday } from '../../lib/birthday';
import Icon from '../../components/icons';

const THEMES = {
  midnight: {
    bg: 'radial-gradient(1100px 600px at 85% -10%, rgba(147, 51, 234, 0.35), transparent 60%), radial-gradient(900px 500px at 8% 110%, rgba(245, 197, 66, 0.16), transparent 60%), linear-gradient(160deg, #1d0b38 0%, #0a0618 70%)',
    accent: '#ffd166',
    accentSoft: 'rgba(255, 209, 102, 0.16)',
    accentBorder: 'rgba(255, 209, 102, 0.45)',
    textGlow: 'rgba(255, 209, 102, 0.55)',
    balloons: ['#ffd166', '#c084fc', '#f472b6', '#60a5fa', '#a6f36a', '#fb7185'],
  },
  candy: {
    bg: 'radial-gradient(1100px 600px at 85% -10%, rgba(251, 113, 133, 0.32), transparent 60%), radial-gradient(900px 500px at 8% 110%, rgba(244, 114, 182, 0.2), transparent 60%), linear-gradient(160deg, #42082c 0%, #170512 70%)',
    accent: '#fda4af',
    accentSoft: 'rgba(251, 113, 133, 0.16)',
    accentBorder: 'rgba(251, 113, 133, 0.5)',
    textGlow: 'rgba(251, 113, 133, 0.55)',
    balloons: ['#fb7185', '#f472b6', '#fda4af', '#e879f9', '#fbbf24', '#a6f36a'],
  },
  ocean: {
    bg: 'radial-gradient(1100px 600px at 85% -10%, rgba(56, 189, 248, 0.3), transparent 60%), radial-gradient(900px 500px at 8% 110%, rgba(45, 212, 191, 0.18), transparent 60%), linear-gradient(160deg, #07305c 0%, #04101f 70%)',
    accent: '#7dd3fc',
    accentSoft: 'rgba(56, 189, 248, 0.16)',
    accentBorder: 'rgba(56, 189, 248, 0.5)',
    textGlow: 'rgba(56, 189, 248, 0.55)',
    balloons: ['#38bdf8', '#2dd4bf', '#818cf8', '#7dd3fc', '#a6f36a', '#f472b6'],
  },
};

const BALLOON_SPOTS = [
  { left: '4%', top: '9%', size: 54, dur: '5.2s', delay: '0s' },
  { left: '13%', top: '22%', size: 38, dur: '6.4s', delay: '0.7s' },
  { right: '5%', top: '12%', size: 60, dur: '5.8s', delay: '0.3s' },
  { right: '14%', top: '26%', size: 36, dur: '6.9s', delay: '1.1s' },
  { left: '7%', top: '52%', size: 34, dur: '7.3s', delay: '0.5s' },
  { right: '8%', top: '55%', size: 40, dur: '6.1s', delay: '1.4s' },
];

const STARS = Array.from({ length: 26 }, (_, i) => ({
  left: `${(i * 37.7 + 11) % 100}%`,
  top: `${(i * 23.3 + 7) % 60}%`,
  size: 2 + (i % 3),
  delay: `${(i % 7) * 0.45}s`,
}));

// Happy Birthday melody (Hz, beats)
const MELODY = [
  [392, 0.75], [392, 0.25], [440, 1], [392, 1], [523, 1], [494, 1.75], [0, 0.25],
  [392, 0.75], [392, 0.25], [440, 1], [392, 1], [587, 1], [523, 1.75], [0, 0.25],
  [392, 0.75], [392, 0.25], [784, 1], [659, 1], [523, 1], [494, 1], [440, 1.75], [0, 0.25],
  [698, 0.75], [698, 0.25], [659, 1], [523, 1], [587, 1], [523, 2],
];
const BEAT = 0.42;

function Balloon({ color, spot }) {
  return (
    <div style={{ position: 'absolute', ...spot, animation: `bdayFloat ${spot.dur} ease-in-out ${spot.delay} infinite`, pointerEvents: 'none', zIndex: 1 }}>
      <svg width={spot.size} height={spot.size * 1.25} viewBox="0 0 60 76" fill="none">
        <path d="M30 3C16 3 6 13.5 6 26.5 6 41 19 52 30 52s24-11 24-25.5C54 13.5 44 3 30 3Z" fill={color} fillOpacity="0.9" />
        <ellipse cx="21" cy="19" rx="6" ry="10" fill="#fff" fillOpacity="0.35" transform="rotate(-18 21 19)" />
        <path d="M27 52h6l-3 5z" fill={color} />
        <path d="M30 57c-3 4 3 6 0 10" stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function Cake({ accent }) {
  const tier = (w, h, bg, extra = {}) => (
    <div style={{ width: w, height: h, background: bg, borderRadius: '10px 10px 6px 6px', position: 'relative', boxShadow: 'inset 0 -8px 14px rgba(0,0,0,0.25), inset 0 4px 8px rgba(255,255,255,0.25)', ...extra }} />
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '6px' }}>
      <div style={{ display: 'flex', gap: '26px', marginBottom: '-2px', zIndex: 2 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '11px', height: '15px', background: 'radial-gradient(circle at 50% 78%, #fff7cc 0%, #ffd166 38%, #ff8a3c 72%, rgba(255,120,40,0) 100%)', borderRadius: '50% 50% 50% 50% / 62% 62% 38% 38%', boxShadow: '0 0 14px 4px rgba(255, 190, 60, 0.55)', animation: `bdayFlicker ${0.32 + i * 0.09}s ease-in-out infinite alternate`, transformOrigin: '50% 100%' }} />
            <div style={{ width: '5px', height: '20px', background: 'repeating-linear-gradient(45deg, #f8fafc 0 4px, #fb7185 4px 8px)', borderRadius: '3px' }} />
          </div>
        ))}
      </div>
      {tier(86, 26, 'linear-gradient(180deg, #fff7ed, #fed7aa)')}
      <div style={{ width: '86px', height: '7px', background: 'radial-gradient(circle at 8px -2px, transparent 7px, #fff7ed 7.5px)', backgroundSize: '16px 8px', backgroundRepeat: 'repeat-x', marginTop: '-26px', marginBottom: '19px', opacity: 0.001 }} />
      {tier(122, 30, 'linear-gradient(180deg, #fbcfe8, #f472b6)')}
      {tier(158, 34, 'linear-gradient(180deg, #fde68a, #d97706)')}
      <div style={{ width: '196px', height: '12px', background: 'linear-gradient(180deg, #e2e8f0, #94a3b8)', borderRadius: '50%', marginTop: '3px', boxShadow: '0 10px 24px rgba(0,0,0,0.45)' }} />
      <div style={{ fontSize: '10px', letterSpacing: '2.5px', color: accent, fontWeight: '800', marginTop: '10px', textTransform: 'uppercase' }}>Make a wish</div>
    </div>
  );
}

function BirthdayInner() {
  const params = useSearchParams();
  const data = useMemo(() => decodeBirthday(params?.get('d')), [params]);
  const theme = THEMES[data?.theme] || THEMES.midnight;
  const [opened, setOpened] = useState(false);
  const [muted, setMuted] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);
  const cardRef = useRef(null);
  const audioRef = useRef(null);
  const partsRef = useRef([]);
  const rafRef = useRef(0);

  // ---- confetti engine ----
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      partsRef.current = partsRef.current.filter((p) => p.life > 0);
      for (const p of partsRef.current) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.14; p.vx *= 0.99; p.rot += p.vr; p.life -= 1;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 40));
        ctx.fillStyle = p.color;
        if (p.circle) { ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); ctx.fill(); }
        else ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
        ctx.restore();
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize); };
  }, []);

  const burst = (xRatio, yRatio, n, colors) => {
    const w = window.innerWidth, h = window.innerHeight;
    for (let i = 0; i < n; i++) {
      const ang = Math.random() * Math.PI * 2;
      const sp = 4 + Math.random() * 9;
      partsRef.current.push({
        x: w * xRatio, y: h * yRatio,
        vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 5,
        size: 6 + Math.random() * 7, rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3, life: 130 + Math.random() * 70,
        color: colors[i % colors.length], circle: Math.random() > 0.55,
      });
    }
  };

  // ---- music ----
  const stopMusic = () => {
    if (audioRef.current) {
      try { audioRef.current.gain.disconnect(); audioRef.current.ctx.close(); } catch {}
      audioRef.current = null;
    }
  };
  const playMusic = () => {
    try {
      stopMusic();
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const gain = ctx.createGain();
      gain.gain.value = 0.16;
      gain.connect(ctx.destination);
      let at = ctx.currentTime + 0.08;
      for (const [freq, beats] of MELODY) {
        const dur = beats * BEAT;
        if (freq > 0) {
          const osc = ctx.createOscillator();
          const og = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = freq;
          og.gain.setValueAtTime(0, at);
          og.gain.linearRampToValueAtTime(1, at + 0.03);
          og.gain.setValueAtTime(1, at + dur - 0.06);
          og.gain.linearRampToValueAtTime(0, at + dur);
          osc.connect(og); og.connect(gain);
          osc.start(at); osc.stop(at + dur + 0.02);
        }
        at += dur;
      }
      audioRef.current = { ctx, gain };
    } catch {}
  };
  useEffect(() => () => stopMusic(), []);

  const openCard = () => {
    if (opened) return;
    setOpened(true);
    playMusic();
    const colors = [...theme.balloons, '#ffffff'];
    setTimeout(() => burst(0.5, 0.55, 130, colors), 120);
    setTimeout(() => burst(0.12, 0.7, 80, colors), 380);
    setTimeout(() => burst(0.88, 0.7, 80, colors), 560);
  };

  const toggleMute = () => {
    if (muted) { setMuted(false); playMusic(); }
    else { setMuted(true); stopMusic(); }
  };

  // ---- 3D tilt ----
  const onTilt = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${px * 14}deg) rotateX(${-py * 12}deg)`;
  };
  const resetTilt = () => { if (cardRef.current) cardRef.current.style.transform = 'rotateY(0deg) rotateX(0deg)'; };

  if (!data) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', padding: '24px', textAlign: 'center' }}>
        <Icon name="gift" size={44} color="#a6f36a" />
        <p style={{ color: '#cbd5e1', fontSize: '15px', margin: 0 }}>This birthday card link is not valid.</p>
        <Link href="/" style={{ color: '#a6f36a', fontWeight: '800', textDecoration: 'none' }}>Go to Hub Cart</Link>
      </div>
    );
  }

  const msg = data.msg || 'Wishing you a day filled with happiness and a year filled with joy. May all your dreams come true!';
  const fullLink = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div style={{ position: 'relative', minHeight: '100dvh', background: theme.bg, overflow: 'hidden', color: '#fff' }}>
      <style>{`
        @keyframes bdayFloat { 0%, 100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-16px) rotate(2.5deg); } }
        @keyframes bdayFlicker { from { transform: scale(1) rotate(-2deg); } to { transform: scale(1.14, 1.22) rotate(2.5deg); } }
        @keyframes bdayTwinkle { 0%, 100% { opacity: 0.15; } 50% { opacity: 0.95; } }
        @keyframes bdayRise { from { opacity: 0; transform: translateY(26px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes bdayPulse { 0% { box-shadow: 0 0 0 0 ${theme.textGlow}; } 70% { box-shadow: 0 0 0 20px rgba(0,0,0,0); } 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0); } }
      `}</style>

      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 40 }} />
      {STARS.map((st, i) => (
        <span key={i} style={{ position: 'absolute', left: st.left, top: st.top, width: st.size, height: st.size, borderRadius: '50%', background: '#fff', animation: `bdayTwinkle 2.6s ease-in-out ${st.delay} infinite`, pointerEvents: 'none' }} />
      ))}
      {BALLOON_SPOTS.map((spot, i) => <Balloon key={i} color={theme.balloons[i % theme.balloons.length]} spot={spot} />)}

      {opened && (
        <button onClick={toggleMute} aria-label="music" style={{ position: 'fixed', top: '14px', right: '14px', zIndex: 60, width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Icon name={muted ? 'eyeOff' : 'message'} size={17} color="#fff" />
        </button>
      )}

      <main style={{ position: 'relative', zIndex: 5, minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px 16px 90px', perspective: '1100px' }}>
        {opened && (
          <div style={{ animation: 'bdayRise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both', width: '100%', maxWidth: '430px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              ref={cardRef}
              onPointerMove={onTilt}
              onPointerLeave={resetTilt}
              onClick={() => burst(0.5, 0.45, 70, [...theme.balloons, '#ffffff'])}
              style={{
                width: '100%', borderRadius: '28px', padding: '30px 24px 26px', textAlign: 'center',
                background: 'linear-gradient(165deg, rgba(255,255,255,0.14), rgba(255,255,255,0.05))',
                border: `1px solid ${theme.accentBorder}`, backdropFilter: 'blur(16px)',
                boxShadow: `0 34px 70px rgba(0,0,0,0.5), 0 0 60px ${theme.accentSoft}`,
                transformStyle: 'preserve-3d', transition: 'transform 0.25s ease-out', cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '11px', letterSpacing: '4px', fontWeight: '800', color: theme.accent, textTransform: 'uppercase', marginBottom: '8px' }}>Happy Birthday</div>
              <h1 style={{
                fontSize: 'clamp(36px, 9vw, 56px)', lineHeight: 1.12, fontWeight: 900, margin: '0 0 6px', color: '#fff', wordBreak: 'break-word',
                textShadow: `1px 1px 0 rgba(0,0,0,0.35), 2px 2px 0 rgba(0,0,0,0.3), 3px 3px 0 rgba(0,0,0,0.24), 4px 4px 0 rgba(0,0,0,0.18), 6px 6px 22px ${theme.textGlow}`,
              }}>{data.name}</h1>
              {data.age && (
                <span style={{ display: 'inline-block', marginTop: '6px', background: theme.accentSoft, border: `1px solid ${theme.accentBorder}`, color: theme.accent, fontSize: '12.5px', fontWeight: '800', padding: '5px 14px', borderRadius: '999px' }}>Turning {data.age} today</span>
              )}
              <Cake accent={theme.accent} />
              <p style={{ fontSize: '14.5px', lineHeight: 1.75, color: '#e2e8f0', margin: '20px 0 0', whiteSpace: 'pre-line' }}>{msg}</p>
              {data.from && (
                <div style={{ marginTop: '16px', fontSize: '13px', color: theme.accent, fontWeight: '700' }}>— with love, {data.from}</div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '22px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                onClick={async () => { try { await navigator.clipboard.writeText(fullLink); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {} }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontWeight: '800', fontSize: '13px', padding: '11px 18px', borderRadius: '999px', cursor: 'pointer', backdropFilter: 'blur(8px)' }}
              >
                <Icon name={copied ? 'check' : 'send'} size={14} color="#fff" /> {copied ? 'Copied' : 'Copy Link'}
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Happy Birthday ${data.name}! Open your surprise card: ${fullLink}`)}`}
                target="_blank" rel="noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: '#25d366', border: '1px solid #25d366', color: '#06281a', fontWeight: '900', fontSize: '13px', padding: '11px 18px', borderRadius: '999px', textDecoration: 'none' }}
              >
                <Icon name="message" size={14} color="#06281a" /> Share
              </a>
            </div>
            <div style={{ marginTop: '26px', fontSize: '11.5px', color: 'rgba(255,255,255,0.55)' }}>
              Made with <Link href="/" style={{ color: theme.accent, fontWeight: '800', textDecoration: 'none' }}>Hub Cart</Link>
            </div>
          </div>
        )}
      </main>

      {!opened && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(5, 3, 12, 0.6)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '18px', padding: '24px', textAlign: 'center' }}>
          <div style={{ width: '104px', height: '104px', borderRadius: '50%', background: theme.accentSoft, border: `1.5px solid ${theme.accentBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'bdayPulse 1.8s ease-out infinite' }}>
            <Icon name="gift" size={46} color={theme.accent} />
          </div>
          <div>
            <div style={{ fontSize: '13px', letterSpacing: '3px', color: theme.accent, fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}>A surprise for you</div>
            <div style={{ fontSize: '27px', fontWeight: 900, color: '#fff', lineHeight: 1.25 }}>{data.name}</div>
            <p style={{ fontSize: '13.5px', color: '#cbd5e1', margin: '10px 0 0' }}>Someone sent you a birthday card</p>
          </div>
          <button onClick={openCard} style={{ background: `linear-gradient(135deg, ${theme.accent}, #ffffff)`, color: '#1c1030', border: 'none', fontWeight: 900, fontSize: '15px', padding: '14px 34px', borderRadius: '999px', cursor: 'pointer', boxShadow: `0 14px 34px ${theme.accentSoft}` }}>
            Tap to Open
          </button>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>Made with Hub Cart</div>
        </div>
      )}
    </div>
  );
}

export default function BirthdayPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '80vh' }} />}>
      <BirthdayInner />
    </Suspense>
  );
}
