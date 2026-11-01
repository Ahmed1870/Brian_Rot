import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {mono} from '../fonts';
import {Caption, Scene, Title, prog} from '../common';

const CARD = {w: 440, h: 380, y: 230};
const XS = [120, 740, 1360];
const stages = [
  {tag: 'INPUT', ar: 'عميل القاهرة', sub: 'UTC+2', val: "'2026-11-01 10:00:00+02'", color: C.amber, at: 40},
  {tag: 'STORAGE', ar: 'القرص الصلب', sub: 'always UTC', val: '08:00:00 UTC', color: C.green, at: 380},
  {tag: 'OUTPUT', ar: 'محلل دبي', sub: "Asia/Dubai", val: '12:00:00 GST', color: C.blue, at: 760},
];

export const Scene03: React.FC = () => {
  const f = useCurrentFrame();
  const flow = (a: number, b: number, k: number) => {
    const t = ((f - a) * 0.011 + k * 0.33) % 1;
    return f > a && f < b ? t : -1;
  };

  return (
    <Scene dur={S.s3.dur}>
      <Title ar="ميكانيكية PostgreSQL الداخلية" en="Always Store in UTC" />

      {/* cards */}
      {stages.map((s, i) => (
        <div key={s.tag} className="absolute" style={{left: XS[i], top: CARD.y, width: CARD.w, height: CARD.h, background: C.panel, border: `3px solid ${s.color}`, borderRadius: 24, opacity: prog(f, s.at, s.at + 25), transform: `translateY(${(1 - prog(f, s.at, s.at + 25)) * 30}px)`}}>
          <div style={{padding: '24px 30px 0', fontFamily: mono, fontSize: 28, fontWeight: 700, color: s.color, direction: 'ltr'}}>{String(i + 1)} · {s.tag}</div>
          <div style={{padding: '14px 30px 0', fontSize: 44, fontWeight: 900, color: C.text, direction: 'rtl', textAlign: 'center'}}>{s.ar}</div>
          <div style={{fontFamily: mono, fontSize: 28, color: C.dim, textAlign: 'center', direction: 'ltr', marginTop: 4}}>{s.sub}</div>
          <div style={{position: 'absolute', bottom: 48, left: 0, right: 0, textAlign: 'center', fontFamily: mono, fontWeight: 700, fontSize: i === 0 ? 30 : 44, color: s.color, direction: 'ltr'}}>{s.val}</div>
        </div>
      ))}

      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {/* connectors */}
        {[0, 1].map((i) => {
          const x1 = XS[i] + CARD.w, x2 = XS[i + 1];
          const y = CARD.y + CARD.h / 2;
          const vis = prog(f, i === 0 ? 300 : 680, i === 0 ? 340 : 720);
          return (
            <g key={i} opacity={vis}>
              <line x1={x1 + 6} y1={y} x2={x2 - 14} y2={y} stroke={C.dim} strokeWidth={5} strokeDasharray="12 10" />
              <polygon points={`${x2 - 6},${y} ${x2 - 28},${y - 14} ${x2 - 28},${y + 14}`} fill={C.dim} />
              <text x={(x1 + x2) / 2} y={y - 24} textAnchor="middle" fontSize={40} fontWeight={700} fill={i === 0 ? C.amber : C.blue} fontFamily={mono}>{i === 0 ? '−2h' : '+4h'}</text>
            </g>
          );
        })}
        {/* particles */}
        {[0, 1, 2].map((k) => {
          const t1 = flow(330, 760, k);
          const t2 = flow(720, 1200, k);
          const y = CARD.y + CARD.h / 2;
          return (
            <g key={k}>
              {t1 >= 0 && <circle cx={XS[0] + CARD.w + 10 + t1 * (XS[1] - XS[0] - CARD.w - 30)} cy={y} r={11} fill={C.green} />}
              {t2 >= 0 && <circle cx={XS[1] + CARD.w + 10 + t2 * (XS[2] - XS[1] - CARD.w - 30)} cy={y} r={11} fill={C.blue} />}
            </g>
          );
        })}
      </svg>

      {/* explanation strip (y 660-860) - below the cards, above the caption */}
      <div className="absolute w-full flex justify-center" style={{top: 680, gap: 70, direction: 'rtl'}}>
        <div style={{width: 520, textAlign: 'center', opacity: prog(f, 460, 500)}}>
          <div style={{fontSize: 44, fontWeight: 900, color: C.green}}>تخزين موحّد على القرص</div>
          <div style={{fontSize: 28, fontWeight: 700, color: C.dim, marginTop: 6}}>المحرك بيطرح الفرق ويحفظ UTC</div>
        </div>
        <div style={{width: 520, textAlign: 'center', opacity: prog(f, 850, 890)}}>
          <div style={{fontSize: 44, fontWeight: 900, color: C.blue}}>عرض مرن لكل عميل</div>
          <div style={{fontSize: 28, fontWeight: 700, color: C.dim, marginTop: 6}}>بيضيف فرق منطقة العميل وقت القراءة</div>
        </div>
      </div>

      <Caption from={60} to={600} color={C.text} size={36}>Input (+02:00) ──► Stored as UTC (08:00:00) ──► Output (+04:00)</Caption>
      <Caption from={750} to={1260} color={C.green}>PostgreSQL Internal Standard: Always Store in UTC</Caption>
    </Scene>
  );
};
