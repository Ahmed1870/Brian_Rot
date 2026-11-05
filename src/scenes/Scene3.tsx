import React from 'react';
import TL from '../timeline.json';
import {C, D, FONT_AR, FONT_MONO} from '../theme';
import {Bg} from '../components/Glass';
import {Code, CodeLine} from '../components/Code';
import {appear, pop} from '../components/Text';
import {Tag} from '../components/Tag';
import {back, eo, prog, pulse} from '../lib/anim';

const S = TL.cues.sc03;
const CODE: CodeLine[] = [{text: "SELECT order_date + INTERVAL '14 days' AS warranty_end FROM orders;", at: S.typeT, dt: 0.05}];
const X = (d: number) => 140 + (d - 1) * 84;
const RY = 600;
const CHIPS = [
  {l: "+ INTERVAL '1 year'", c: D.key}, {l: "- INTERVAL '1 month'", c: D.err}, {l: "+ INTERVAL '3 hours'", c: D.code}, {l: "+ INTERVAL '30 seconds'", c: '#A855F7'},
];

export const Scene3: React.FC<{t: number}> = ({t}) => {
  const enter = appear(t, 85.7, 86.7);
  const warm = 0.5 + 0.5 * pulse(t, 1.2);
  const arrowP = pop(t, S.arrow, S.arrow + 0.8);
  const leap = eo(prog(t, S.leap, S.leap + 1.8));
  const landed = t >= S.leap + 1.8;
  const lock = back(prog(t, S.leap + 1.8, S.leap + 2.6));
  const x0 = X(4), x1 = X(18);
  const ax = x0 + (x1 - x0) * leap, ay = RY - 30 - Math.sin(leap * Math.PI) * 230;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden'}}>
      <Bg t={t} />
      <div style={{position: 'absolute', left: 60, top: 92, height: 60}}><Tag t={t} range={S.tag1} head="order_date + INTERVAL '14 days'" body="──► Dynamic Date Math & SLA Deadlines" color={D.key} size={27} /></div>
      <div style={{position: 'absolute', left: 60, top: 92, height: 60}}><Tag t={t} range={S.tag2} head="Interval Units" body="──► Add/Subtract Years, Months, Days, Hours & Seconds" color={D.cat} size={26} /></div>
      <div style={{opacity: enter}}><Code lines={CODE} t={t} x={60} y={190} w={1800} h={130} title="interval.sql" fontSize={30} lineH={56} accent={D.key} /></div>

      {/* calendar ruler */}
      <div style={{position: 'absolute', left: 60, top: 400, width: 1800, height: 330, borderRadius: 24, background: 'rgba(30,41,59,0.7)', border: '2px solid rgba(255,255,255,0.1)', opacity: enter}}>
        <div style={{position: 'absolute', left: 28, top: 14, fontFamily: FONT_MONO, fontWeight: 800, fontSize: 22, color: C.dim}}>November 2026</div>
      </div>
      <svg width="1920" height="1080" style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', opacity: enter}}>
        <line x1={X(1) - 30} y1={RY} x2={X(21) + 30} y2={RY} stroke="#64748B" strokeWidth="5" strokeLinecap="round" />
        {Array.from({length: 21}).map((_, i) => {
          const d = i + 1;
          const hot = d === 4 || d === 18;
          const filled = d > 4 && d <= 4 + Math.round(14 * leap);
          return (
            <g key={d}>
              <line x1={X(d)} y1={RY - (hot ? 30 : 16)} x2={X(d)} y2={RY + (hot ? 30 : 16)} stroke={d === 4 ? D.code : d === 18 && landed ? D.cat : filled ? D.key : '#64748B'} strokeWidth={hot ? 7 : 4} strokeLinecap="round" />
              <text x={X(d)} y={RY + 62} textAnchor="middle" fontFamily={FONT_MONO} fontWeight={hot ? 800 : 500} fontSize={hot ? 28 : 21} fill={d === 4 ? D.code : d === 18 && landed ? D.cat : '#94A3B8'}>{d}</text>
            </g>
          );
        })}
        {arrowP > 0.01 ? <path d={`M${x0} ${RY - 40} Q ${(x0 + x1) / 2} ${RY - 330} ${x1} ${RY - 40}`} fill="none" stroke={D.key} strokeWidth="4" strokeDasharray="8 12" opacity="0.4" /> : null}
      </svg>
      <div style={{position: 'absolute', left: x0 - 150, top: RY - 150, width: 300, textAlign: 'center', opacity: appear(t, S.arrow - 1, S.arrow), fontFamily: FONT_MONO, fontWeight: 800, fontSize: 25, color: D.code}}>order_date<br />2026-11-04</div>
      {arrowP > 0.01 ? (
        <div style={{position: 'absolute', left: ax - 170, top: ay - 36, opacity: Math.min(1, arrowP * 1.5) * (landed ? 0.0 : 1), transform: `scale(${0.8 + 0.2 * arrowP})`}}>
          <div style={{padding: '10px 24px', borderRadius: 16, background: D.key, color: C.bg, fontFamily: FONT_MONO, fontWeight: 800, fontSize: 28, boxShadow: `0 0 34px ${D.key}`, whiteSpace: 'nowrap'}}>+ INTERVAL '14 days' ➜</div>
        </div>
      ) : null}
      {landed ? (
        <div style={{position: 'absolute', left: x1 - 190, top: RY - 220, width: 380, opacity: Math.min(1, lock * 2), transform: `scale(${0.7 + 0.3 * lock})`}}>
          <div style={{padding: '12px 22px', borderRadius: 18, background: `${D.cat}26`, border: `2.5px solid ${D.cat}`, boxShadow: `0 0 ${28 + 16 * warm}px ${D.cat}`, display: 'flex', alignItems: 'center', gap: 16}}>
            <svg width="40" height="44" viewBox="0 0 24 26" fill="none" stroke={D.cat} strokeWidth="2.6" strokeLinecap="round"><rect x="3" y="11" width="18" height="12" rx="3" fill={`${D.cat}44`} /><path d="M7 11V8a5 5 0 0 1 10 0v3" /></svg>
            <div><div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 24, color: C.text}}>warranty_end</div><div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 30, color: D.cat}}>2026-11-18</div></div>
          </div>
        </div>
      ) : null}

      {/* interval units */}
      <div style={{position: 'absolute', left: 60, top: 790, width: 1800, display: 'flex', gap: 22}}>
        {CHIPS.map((c, i) => {
          const p = back(prog(t, S.units + i * 1.2, S.units + 0.7 + i * 1.2));
          return <div key={c.l} style={{flex: 1, padding: '16px 14px', borderRadius: 18, background: `${c.c}22`, border: `2.5px solid ${c.c}`, fontFamily: FONT_MONO, fontWeight: 800, fontSize: 25, color: C.text, textAlign: 'center', opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 40}px)`, boxShadow: `0 0 22px ${c.c}44`, whiteSpace: 'nowrap'}}>{c.l}</div>;
        })}
      </div>
      {t > S.units + 5 ? <div style={{position: 'absolute', left: 60, top: 900, width: 1800, textAlign: 'center', fontFamily: FONT_AR, fontWeight: 800, fontSize: 32, color: D.cat, direction: 'rtl', opacity: appear(t, S.units + 5, S.units + 6)}}>شروط ديناميكية تعمل تلقائيًا: NOW() - INTERVAL '1 month' بدون تحديث التواريخ يدويًا</div> : null}
    </div>
  );
};
