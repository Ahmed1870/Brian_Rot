import React from 'react';
import TL from '../timeline.json';
import {C, FONT_AR, FONT_MONO} from '../theme';
import {Bg, Glass} from '../components/Glass';
import {Bi, appear, pop} from '../components/Text';
import {LOGO_PATHS, LOGO_VIEW} from '../logoData';
import {eo, hash, mix, prog} from '../lib/anim';

const S = TL.cues.sc06;
const LW = 470;
const LH = (LW * LOGO_VIEW.h) / LOGO_VIEW.w;

const Icon: React.FC<{kind: string; c: string; s?: number}> = ({kind, c, s = 64}) => {
  const p = {fill: 'none', stroke: c, strokeWidth: 3.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  if (kind === 'wa')
    return (
      <svg width={s} height={s} viewBox="0 0 48 48"><path {...p} d="M24 5a19 19 0 0 0-16 29l-3 9 9-3A19 19 0 1 0 24 5z" /><path {...p} d="M17 15c-1.5 0-3 1.4-3 3.4 0 5.6 7.6 13.6 14 13.6 2 0 3.5-1.4 3.5-3l-4.6-2.6-2.4 1.8c-2.8-1.2-5.4-3.8-6.4-6.6l1.8-2.2z" /></svg>
    );
  if (kind === 'globe')
    return (
      <svg width={s} height={s} viewBox="0 0 48 48"><circle {...p} cx="24" cy="24" r="19" /><ellipse {...p} cx="24" cy="24" rx="8" ry="19" /><path {...p} d="M5 24h38M8 14h32M8 34h32" /></svg>
    );
  if (kind === 'cap')
    return (
      <svg width={s} height={s} viewBox="0 0 48 48"><path {...p} d="M3 18 L24 8 L45 18 L24 28 Z" /><path {...p} d="M12 23v10c0 3 6 6 12 6s12-3 12-6V23" /><path {...p} d="M45 18v14" /></svg>
    );
  return (
    <svg width={s} height={s} viewBox="0 0 48 48"><path {...p} d="M6 42V6M6 42h38" /><rect {...p} x="13" y="26" width="7" height="12" /><rect {...p} x="25" y="16" width="7" height="22" /><rect {...p} x="37" y="9" width="7" height="29" /></svg>
  );
};

export const Scene6: React.FC<{t: number}> = ({t}) => {
  const zoom = 1 + 0.05 * prog(t, 195, 228);
  const sweepX = mix(150, 460, ((t - 197) * 0.22) % 1);
  const cardsIn = (k: number) => pop(t, S.cards[0] + k * 0.5, S.cards[0] + k * 0.5 + 0.9);
  const items = [
    {at: S.wa, kind: 'wa', color: '#34D399', label: 'واتساب / تواصل', value: '+201019672878', x: 1260},
    {at: S.svc, kind: 'globe', color: C.accent, label: 'موقع الخدمات', value: 'analytics.gomaaintelligence.me', x: 680},
    {at: S.plat, kind: 'globe', color: C.violet, label: 'المنصة والشيتات', value: 'solutions.gomaaintelligence.me', x: 100},
  ];
  const lightX = mix(-500, 2400, ((t - 206.5) * 0.18) % 1);
  const sweepOn = t > 207;

  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden'}}>
      <Bg t={t} />
      {/* drifting data dots */}
      <svg width="1920" height="1080" style={{position: 'absolute', left: 0, top: 0, opacity: appear(t, 195.2, 197)}}>
        {Array.from({length: 70}).map((_, i) => {
          const sp = 8 + hash(i * 3.3) * 22;
          const y = (((hash(i * 7.1) * 1080 - (t - 195) * sp) % 1080) + 1080) % 1080;
          const x = hash(i * 5.9) * 1920 + Math.sin(t * 0.4 + i) * 14;
          return <circle key={i} cx={x} cy={y} r={1.5 + hash(i) * 3} fill={i % 3 === 0 ? C.accent : '#94A3B8'} opacity={0.12 + hash(i * 2.2) * 0.35} />;
        })}
      </svg>

      {/* logo */}
      <div style={{position: 'absolute', left: 960 - LW / 2, top: 18, width: LW, height: LH, transform: `scale(${zoom})`, transformOrigin: '50% 50%', filter: `drop-shadow(0 0 22px rgba(56,189,248,0.35))`}}>
        <svg width={LW} height={LH} viewBox={`${LOGO_VIEW.x} ${LOGO_VIEW.y} ${LOGO_VIEW.w} ${LOGO_VIEW.h}`}>
          <defs>
            <linearGradient id="logoSweep" gradientUnits="userSpaceOnUse" x1={(sweepX - 60) * 10} y1="0" x2={(sweepX + 60) * 10} y2="0">
              <stop offset="0" stopColor="#F8FAFC" />
              <stop offset="0.42" stopColor="#F8FAFC" />
              <stop offset="0.5" stopColor="#38BDF8" />
              <stop offset="0.58" stopColor="#F8FAFC" />
              <stop offset="1" stopColor="#F8FAFC" />
            </linearGradient>
          </defs>
          <g transform="translate(0,600) scale(0.1,-0.1)" fill="url(#logoSweep)" stroke="none">
            {LOGO_PATHS.map((p, i) => {
              const cx = (p.b[0] + p.b[2]) / 2;
              const cy = (p.b[1] + p.b[3]) / 2;
              let start = S.logo;
              if (p.g === 'icon') start += (Math.hypot(cx - 300, cy - 255) / 150) * 0.9;
              else if (p.g === 'word') start += 1.1 + ((cx - 162) / 276) * 0.9;
              else start += 2.0 + ((cx - 162) / 276) * 0.5;
              const a = eo(prog(t, start, start + 0.7));
              return <path key={i} d={p.d} opacity={a} />;
            })}
          </g>
        </svg>
      </div>

      {/* brand title */}
      <div style={{position: 'absolute', left: 0, top: 428, width: 1920, display: 'flex', justifyContent: 'center', opacity: appear(t, S.title, S.title + 0.6)}}>
        <div style={{textShadow: '0 0 36px rgba(56,189,248,0.45)'}}>
          <Bi ar="منظومة" en="Manzooma Data Solutions" size={70} t={t} start={S.title + 0.1} weight={900} gap={28} />
        </div>
      </div>

      {/* two parallel cards */}
      {[
        {x: 1020, kind: 'chart', no: '01', ar: 'الخدمات الاستشارية وتحليل البيانات للشركات', en: 'Consulting & Data Analytics', c: C.accent},
        {x: 100, kind: 'cap', no: '02', ar: 'المنصة التعليمية والموارد', en: 'Learning Platform & Resources', c: C.violet},
      ].map((cd, k) => {
        const p = cardsIn(k);
        return (
          <div key={k} style={{position: 'absolute', left: cd.x, top: 544, width: 800, height: 220, opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 90}px) scale(${0.94 + 0.06 * p})`}}>
            <Glass w={800} h={220} r={30} t={t + k * 3} tint={cd.c} glow={26} style={{border: `2px solid ${cd.c}77`}}>
              <div style={{position: 'absolute', right: 34, top: 0, bottom: 0, width: 110, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{width: 104, height: 104, borderRadius: 28, background: `${cd.c}22`, border: `2px solid ${cd.c}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Icon kind={cd.kind} c={cd.c} s={62} />
                </div>
              </div>
              <div style={{position: 'absolute', right: 172, left: 34, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10, direction: 'rtl'}}>
                <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 22, color: cd.c, letterSpacing: 3, direction: 'ltr', textAlign: 'right'}}>{cd.no}</div>
                <div style={{fontFamily: FONT_AR, fontWeight: 800, fontSize: k === 0 ? 38 : 44, lineHeight: 1.3, color: C.text}}>{cd.ar}</div>
                <div style={{fontFamily: FONT_MONO, fontWeight: 500, fontSize: 22, color: C.dim, direction: 'ltr', textAlign: 'right'}}>{cd.en}</div>
              </div>
            </Glass>
          </div>
        );
      })}

      {/* contact + links */}
      {items.map((it, i) => {
        const p = pop(t, it.at, it.at + 0.8);
        return (
          <div key={i} style={{position: 'absolute', left: it.x, top: 820, width: 560, height: 168, opacity: Math.min(1, p * 1.6), transform: `translateY(${(1 - p) * 60}px)`}}>
            <Glass w={560} h={168} r={26} t={t + i * 2} tint={it.color} glow={18} sheen={false} style={{border: `2px solid ${it.color}66`}}>
              <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, background: it.color}} />
              <div style={{position: 'absolute', right: 26, top: 22, display: 'flex', alignItems: 'center', gap: 14, direction: 'rtl'}}>
                <div style={{width: 56, height: 56, borderRadius: 16, background: `${it.color}22`, border: `2px solid ${it.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Icon kind={it.kind} c={it.color} s={34} />
                </div>
                <div style={{fontFamily: FONT_AR, fontWeight: 800, fontSize: 30, color: C.text}}>{it.label}</div>
              </div>
              <div style={{position: 'absolute', left: 28, right: 28, bottom: 26, fontFamily: FONT_MONO, fontWeight: 700, fontSize: it.kind === 'wa' ? 44 : 27, color: it.color, direction: 'ltr', textAlign: 'center', whiteSpace: 'nowrap', textShadow: `0 0 20px ${it.color}66`}}>{it.value}</div>
              {sweepOn ? <div style={{position: 'absolute', top: -40, bottom: -40, left: lightX - it.x - 100, width: 140, transform: 'rotate(18deg)', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)'}} /> : null}
            </Glass>
          </div>
        );
      })}
    </div>
  );
};
