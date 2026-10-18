import React from 'react';
import {C, clamp, ss, eo} from '../theme';
import {CAIRO} from '../fonts';

export const HERO = {x: 92, y: 268, w: 400, h: 250};
export const HERO_C = {x: HERO.x + HERO.w / 2, y: HERO.y + HERO.h / 2};

type Rect = {x: number; y: number; w: number; h: number};
const SCREEN: Rect = {x: 62, y: 142, w: 956, h: 1636};

const redTile: React.CSSProperties = {
  position: 'absolute',
  borderRadius: 28,
  background: 'linear-gradient(165deg, rgba(239,68,68,0.20), rgba(239,68,68,0.05))',
  boxShadow: 'inset 0 0 0 2px rgba(239,68,68,0.42), 0 18px 50px rgba(0,0,0,0.35)',
};
const label: React.CSSProperties = {fontFamily: CAIRO, fontWeight: 700, fontSize: 24, letterSpacing: 2, color: C.mute};

type Props = {t: number};

/** لوحة التحكم الضخمة: كارت أخضر صغير (+10M) وسط خسائر حمرا. إحداثيات العالم = إحداثيات الشاشة عند مقياس 1. */
export const Dashboard: React.FC<Props> = ({t}) => {
  // ===== الكارت الأخضر (البطل) =====
  const press = ss(1.0, 1.07, t) * (1 - ss(1.07, 1.3, t));
  const approved = t >= 1.06;
  const pulse = 1 + 0.025 * Math.sin(t * 5);
  const ripple = clamp((t - 1.0) / 0.7);

  // ===== ظهور العناصر الحمرا مع الارتداد (dof: خلفية مموهة في الماكرو) =====
  const dof = ss(5.0, 5.7, t);
  const ghost = (ti: number) => 0.08 + 0.92 * ss(ti, ti + 0.45, t);
  const blur = 20 * (1 - dof);
  const wrapStyle = (ti: number, extra?: React.CSSProperties): React.CSSProperties => ({opacity: ghost(ti), filter: blur > 0.2 ? `blur(${blur}px)` : undefined, ...extra});

  // الرقم الأحمر -85M
  const count = Math.round(85 * eo((t - 5.4) / 1.4));
  const chartP = eo((t - 5.6) / 1.4);
  const dotP = 0.5 + 0.5 * Math.sin(t * 7);
  const led = t > 6.0 ? (Math.floor(t * 3) % 2 === 0 ? C.red : '#7F1D1D') : '#14532D';
  const outline = ss(7.3, 7.9, t);
  const sheen = ((t * 0.12) % 1.4) - 0.2;

  const chart = [
    [40, 110], [120, 150], [200, 140], [290, 215], [370, 205], [460, 285], [540, 270], [640, 350], [730, 340], [820, 410], [870, 430],
  ];
  const lineD = chart.map((p, i) => `${i ? 'L' : 'M'} ${p[0]} ${p[1] + 20}`).join(' ');
  const areaD = `${lineD} L 870 440 L 40 440 Z`;

  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920}}>
      {/* إطار الشاشة (Bezel) */}
      <div style={{position: 'absolute', left: 30, top: 110, width: 1020, height: 1700, borderRadius: 62, background: 'linear-gradient(145deg, #243049, #0A0F1C 60%)', boxShadow: '0 60px 140px rgba(0,0,0,0.7), inset 0 0 0 2px rgba(255,255,255,0.10)'}} />
      <div style={{position: 'absolute', left: SCREEN.x, top: SCREEN.y, width: SCREEN.w, height: SCREEN.h, borderRadius: 36, background: `radial-gradient(ellipse at 30% 10%, #172036, ${C.bg} 60%)`, boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.06)', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: `${sheen * 100 - 40}%`, top: -200, width: 340, height: 2200, transform: 'rotate(18deg)', background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.05), rgba(255,255,255,0))'}} />
      </div>
      <div style={{position: 'absolute', left: 520, top: 1786, width: 40, height: 8, borderRadius: 4, background: led, boxShadow: `0 0 14px ${led}`}} />

      {/* الهيدر */}
      <div style={{position: 'absolute', left: 92, top: 178, width: 904, display: 'flex', justifyContent: 'space-between', alignItems: 'center', direction: 'ltr', ...wrapStyle(5.0)}}>
        <div style={{fontFamily: CAIRO, fontWeight: 900, fontSize: 34, color: C.white}}>Executive Dashboard</div>
        <div style={{fontFamily: CAIRO, fontWeight: 700, fontSize: 22, color: C.mute, padding: '6px 18px', borderRadius: 20, boxShadow: 'inset 0 0 0 2px rgba(248,250,252,0.16)'}}>Q4 · FY25</div>
      </div>

      {/* ===== الكارت الأخضر: +10M Sales ===== */}
      <div style={{position: 'absolute', left: HERO.x, top: HERO.y, width: HERO.w, height: HERO.h, borderRadius: 30, background: 'linear-gradient(160deg, rgba(34,197,94,0.28), rgba(34,197,94,0.07))', boxShadow: `inset 0 0 0 2px rgba(34,197,94,0.6), 0 0 70px rgba(34,197,94,0.4), 0 20px 60px rgba(0,0,0,0.4)`, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 22, textAlign: 'center', fontFamily: CAIRO, fontWeight: 700, fontSize: 24, letterSpacing: 6, color: '#86EFAC'}}>SALES</div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 36, textAlign: 'center', fontFamily: CAIRO, fontWeight: 900, fontSize: 138, lineHeight: 1.25, color: C.green, textShadow: `0 0 28px rgba(34,197,94,0.9), 0 0 80px rgba(34,197,94,0.55)`, direction: 'ltr'}}>+10M</div>
        <div style={{position: 'absolute', left: 50, top: 188, width: 300, height: 46, borderRadius: 23, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: CAIRO, fontWeight: 900, fontSize: 19, letterSpacing: 2, color: approved ? '#052E16' : '#DCFCE7', background: approved ? C.green : 'rgba(34,197,94,0.18)', boxShadow: `inset 0 0 0 2px ${C.green}, 0 0 ${24 + 16 * press}px rgba(34,197,94,${0.55 + 0.3 * press})`, transform: `scale(${(approved ? 1 : pulse) * (1 - 0.06 * press)})`, direction: 'ltr'}}>
          {approved ? (
            <>
              <svg width={22} height={22} viewBox="0 0 24 24"><path d="M4 12.5 L10 18 L20 6" fill="none" stroke="#052E16" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" /></svg>
              APPROVED
            </>
          ) : (
            '[ APPROVE BUDGET ]'
          )}
        </div>
        {ripple > 0 && ripple < 1 && <div style={{position: 'absolute', left: 200 - 20 - 260 * ripple, top: 211 - 260 * ripple, width: 40 + 520 * ripple, height: 40 + 520 * ripple, borderRadius: 999, boxShadow: `inset 0 0 0 ${4 * (1 - ripple) + 1}px rgba(34,197,94,${1 - ripple})`}} />}
      </div>

      {/* مؤشر "ده الرقم اللي قرّرت عليه" */}
      {outline > 0 && (
        <div style={{position: 'absolute', left: HERO.x - 14, top: HERO.y - 14, width: HERO.w + 28, height: HERO.h + 28, borderRadius: 40, boxShadow: `inset 0 0 0 3px rgba(248,250,252,${0.8 * outline})`, opacity: outline}}>
          <div style={{position: 'absolute', left: 14, top: HERO.h + 38, fontFamily: CAIRO, fontWeight: 700, fontSize: 26, color: C.white, direction: 'rtl', whiteSpace: 'nowrap'}}>الرقم اللي قرّرت عليه ↑</div>
        </div>
      )}

      {/* تايلات حمرا جنب الكارت */}
      <div style={{...redTile, left: 506, top: 268, width: 238, height: 250, ...wrapStyle(5.25)}}>
        <div style={{...label, position: 'absolute', left: 22, top: 20}}>MARGIN</div>
        <div style={{position: 'absolute', left: 22, top: 90, fontFamily: CAIRO, fontWeight: 900, fontSize: 68, color: C.red, direction: 'ltr', textShadow: '0 0 26px rgba(239,68,68,0.6)'}}>-31%</div>
      </div>
      <div style={{...redTile, left: 758, top: 268, width: 238, height: 250, ...wrapStyle(5.4)}}>
        <div style={{...label, position: 'absolute', left: 22, top: 20}}>CUSTOMERS</div>
        <div style={{position: 'absolute', left: 22, top: 90, fontFamily: CAIRO, fontWeight: 900, fontSize: 68, color: C.red, direction: 'ltr', textShadow: '0 0 26px rgba(239,68,68,0.6)'}}>-18K</div>
      </div>

      {/* اللوحة الحمرا الضخمة: -85M Net Profit */}
      <div style={{position: 'absolute', left: 92, top: 590, width: 904, height: 440, borderRadius: 34, background: 'linear-gradient(180deg, rgba(239,68,68,0.28), rgba(239,68,68,0.04))', boxShadow: 'inset 0 0 0 2px rgba(239,68,68,0.5), 0 0 90px rgba(239,68,68,0.28)', overflow: 'hidden', ...wrapStyle(5.1)}}>
        <svg width={904} height={440} viewBox="0 0 904 440" style={{position: 'absolute', left: 0, top: 0}}>
          <defs>
            <linearGradient id="redArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.red} stopOpacity={0.45} />
              <stop offset="100%" stopColor={C.red} stopOpacity={0} />
            </linearGradient>
          </defs>
          <path d={areaD} fill="url(#redArea)" opacity={chartP} />
          <path d={lineD} fill="none" stroke={C.red} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - chartP} style={{filter: 'drop-shadow(0 0 12px rgba(239,68,68,0.9))'}} />
          {chartP > 0.97 && <circle cx={870} cy={450} r={10 + 8 * dotP} fill={C.red} opacity={0.9} />}
        </svg>
        <div style={{...label, position: 'absolute', left: 36, top: 26, fontSize: 28}}>NET PROFIT</div>
        <div style={{position: 'absolute', left: 36, top: 60, fontFamily: CAIRO, fontWeight: 900, fontSize: 240, lineHeight: 1.1, color: C.red, direction: 'ltr', textShadow: '0 0 40px rgba(239,68,68,0.75), 0 0 110px rgba(239,68,68,0.45)'}}>-{count}M</div>
        <div style={{position: 'absolute', right: 40, top: 40, fontFamily: CAIRO, fontWeight: 700, fontSize: 40, color: C.white, direction: 'rtl', opacity: 0.9}}>صافي الربح</div>
      </div>

      {/* صف تاني */}
      {[
        {x: 92, k: 'REFUNDS', v: '-12M', t: 5.6},
        {x: 551, k: 'CHURN', v: '-9.4M', t: 5.75},
      ].map((o) => (
        <div key={o.k} style={{...redTile, left: o.x, top: 1056, width: 445, height: 205, ...wrapStyle(o.t)}}>
          <div style={{...label, position: 'absolute', left: 26, top: 20}}>{o.k}</div>
          <div style={{position: 'absolute', left: 26, top: 66, fontFamily: CAIRO, fontWeight: 900, fontSize: 88, color: C.red, direction: 'ltr', textShadow: '0 0 28px rgba(239,68,68,0.55)'}}>{o.v}</div>
        </div>
      ))}

      {/* خسائر تفصيلية */}
      {[
        {k: 'تكلفة الإعلانات', v: '-23M', t: 5.9},
        {k: 'مخزون راكد', v: '-11M', t: 6.05},
        {k: 'ديون متأخرة', v: '-8M', t: 6.2},
      ].map((o, i) => (
        <div key={o.k} style={{position: 'absolute', left: 92, top: 1285 + i * 108, width: 904, height: 92, display: 'flex', direction: 'rtl', justifyContent: 'space-between', alignItems: 'center', padding: '0 34px', boxSizing: 'border-box', borderRadius: 24, background: 'rgba(239,68,68,0.08)', boxShadow: 'inset 0 0 0 2px rgba(239,68,68,0.28)', ...wrapStyle(o.t)}}>
          <span style={{fontFamily: CAIRO, fontWeight: 700, fontSize: 38, color: C.white}}>{o.k}</span>
          <span style={{fontFamily: CAIRO, fontWeight: 900, fontSize: 48, color: C.red, direction: 'ltr'}}>{o.v}</span>
        </div>
      ))}
    </div>
  );
};

