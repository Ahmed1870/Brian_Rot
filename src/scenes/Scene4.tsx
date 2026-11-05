import React from 'react';
import TL from '../timeline.json';
import {C, D, FONT_AR, FONT_MONO} from '../theme';
import {Bg} from '../components/Glass';
import {Code, CodeLine} from '../components/Code';
import {appear, pop} from '../components/Text';
import {Tag} from '../components/Tag';
import {back, eo, hash, prog, pulse} from '../lib/anim';

const S = TL.cues.sc04;
const CODE: CodeLine[] = [{text: 'SELECT AGE(shipped_date, order_date) AS delivery_time FROM orders;', at: S.typeT, dt: 0.045}];
const XA = 280, XB = 1640, GY = 540;
const pad = (n: number) => (n < 10 ? '0' + n : String(n));

export const Scene4: React.FC<{t: number}> = ({t}) => {
  const enter = appear(t, 132.2, 133.2);
  const warm = 0.5 + 0.5 * pulse(t, 1.2);
  const st = eo(prog(t, S.stretch, S.stretch + 2.4));
  const settle = prog(t, S.settle - 1.2, S.settle);
  const live = t >= S.stretch && t < S.settle;
  const jit = live ? (1 - settle) * 0.9 : 0;
  const f = Math.floor(t * 18);
  const d = 2;
  const hh = live ? Math.max(0, Math.round(4 * st + (hash(f) - 0.5) * 8 * jit)) : t >= S.settle ? 4 : 0;
  const mm = live ? Math.max(0, Math.round(30 * st + (hash(f + 3) - 0.5) * 40 * jit)) % 60 : t >= S.settle ? 30 : 0;
  const ss = live ? Math.round(hash(f + 7) * 59 * jit) : 0;
  const dd = live ? (st > 0.6 ? d : Math.round(d * st / 0.6)) : t >= S.settle ? d : 0;
  const barEnd = XA + (XB - XA) * st;
  const sla = back(prog(t, S.sla, S.sla + 0.8));
  const ten = back(prog(t, S.tenure, S.tenure + 0.8));
  const done = t >= S.settle;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden'}}>
      <Bg t={t} />
      <div style={{position: 'absolute', left: 60, top: 92, height: 60}}><Tag t={t} range={S.tag1} head="AGE(delivered_at, ordered_at)" body="──► Computes Precise Elapsed Duration" color={D.code} size={27} /></div>
      <div style={{position: 'absolute', left: 60, top: 92, height: 60}}><Tag t={t} range={S.tag2} head="SLA Tracking" body="──► Measures Shipping Speeds & Customer Tenure" color={D.cat} size={27} /></div>
      <div style={{opacity: enter}}><Code lines={CODE} t={t} x={60} y={190} w={1800} h={130} title="age.sql" fontSize={30} lineH={56} /></div>

      {/* delivery duration gauge */}
      <div style={{position: 'absolute', left: 60, top: 360, width: 1800, height: 330, borderRadius: 24, background: 'rgba(30,41,59,0.7)', border: '2px solid rgba(255,255,255,0.1)', opacity: enter}} />
      <svg width="1920" height="1080" style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', opacity: enter}}>
        <line x1={XA} y1={GY} x2={XB} y2={GY} stroke="#475569" strokeWidth="6" strokeLinecap="round" />
        {[0, 1, 2].map((k) => <line key={k} x1={XA + (XB - XA) * (k / 2.1875)} y1={GY - 14} x2={XA + (XB - XA) * (k / 2.1875)} y2={GY + 14} stroke="#64748B" strokeWidth="4" />)}
        <line x1={XA} y1={GY} x2={barEnd} y2={GY} stroke={done ? D.cat : D.code} strokeWidth="16" strokeLinecap="round" style={{filter: `drop-shadow(0 0 12px ${done ? D.cat : D.code})`}} />
        <circle cx={XA} cy={GY} r="16" fill={D.code} />
        <circle cx={barEnd} cy={GY} r="16" fill={done ? D.cat : D.code} />
      </svg>
      <div style={{position: 'absolute', left: XA - 170, top: GY + 36, width: 340, textAlign: 'center', fontFamily: FONT_MONO, fontWeight: 800, fontSize: 24, color: D.code}}>order_date<br /><span style={{color: C.text}}>2026-11-01 10:00</span></div>
      <div style={{position: 'absolute', left: XB - 170, top: GY + 36, width: 340, textAlign: 'center', fontFamily: FONT_MONO, fontWeight: 800, fontSize: 24, color: done ? D.cat : D.code, opacity: st > 0.9 ? 1 : 0.3}}>shipped_date<br /><span style={{color: C.text}}>2026-11-03 14:30</span></div>
      <div style={{position: 'absolute', left: 560, top: 390, width: 800, textAlign: 'center', opacity: appear(t, S.stretch + 0.5, S.stretch + 1.2)}}>
        <div style={{fontFamily: FONT_MONO, fontSize: 21, color: C.mute, letterSpacing: 2}}>AGE(shipped_date, order_date)</div>
        <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 76, color: done ? D.cat : D.code, textShadow: `0 0 ${24 + (done ? 14 * warm : 0)}px ${done ? D.cat : D.code}`}}>{dd} days {pad(hh)}:{pad(mm)}:{pad(ss)}</div>
      </div>
      {sla > 0.01 ? (
        <div style={{position: 'absolute', left: 1330, top: 396, opacity: Math.min(1, sla * 2), transform: `scale(${0.6 + 0.4 * sla}) rotate(${(1 - sla) * -10}deg)`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', borderRadius: 16, background: D.cat, color: C.bg, fontFamily: FONT_MONO, fontWeight: 800, fontSize: 28, boxShadow: `0 0 ${28 + 16 * warm}px ${D.cat}`}}>SLA ✓ PASS</div>
        </div>
      ) : null}

      {/* tenure + date subtraction */}
      {ten > 0.01 ? (
        <div style={{position: 'absolute', left: 60, top: 730, width: 1800, display: 'flex', gap: 28, opacity: Math.min(1, ten * 2), transform: `translateY(${(1 - ten) * 40}px)`}}>
          <div style={{flex: 1.3, borderRadius: 22, padding: '20px 30px', background: `${D.code}1A`, border: `2.5px solid ${D.code}`}}>
            <div style={{fontFamily: FONT_MONO, fontSize: 22, color: C.mute}}>Customer Tenure</div>
            <div style={{fontFamily: FONT_MONO, fontWeight: 700, fontSize: 26, color: C.text, marginTop: 6}}>AGE('2026-11-04', '2024-01-15')</div>
            <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 42, color: D.code, marginTop: 8}}>2 years 9 mons 20 days</div>
          </div>
          <div style={{flex: 1, borderRadius: 22, padding: '20px 30px', background: `${D.key}1A`, border: `2.5px solid ${D.key}`}}>
            <div style={{fontFamily: FONT_AR, fontSize: 24, color: C.mute, direction: 'rtl'}}>أو الطرح المباشر بين التواريخ</div>
            <div style={{fontFamily: FONT_MONO, fontWeight: 700, fontSize: 25, color: C.text, marginTop: 6}}>delivered::date - ordered::date</div>
            <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 42, color: D.key, marginTop: 8}}>= 2 <span style={{fontSize: 26}}>days</span></div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
