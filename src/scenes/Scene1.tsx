import React from 'react';
import TL from '../timeline.json';
import {C, D, FONT_AR, FONT_MONO} from '../theme';
import {Bg} from '../components/Glass';
import {Bi, appear, pop} from '../components/Text';
import {Tag} from '../components/Tag';
import {eio, eo, mix, prog, pulse, seg} from '../lib/anim';

const S = TL.cues.sc01;
const RAW = [
  {t: '2026-03-15 14:20:45', m: 0}, {t: '2026-03-02 09:05:11', m: 0}, {t: '2026-04-08 11:15:02', m: 1},
  {t: '2026-03-27 22:48:30', m: 0}, {t: '2026-04-19 17:42:09', m: 1}, {t: '2026-05-03 08:30:55', m: 2},
];
const BINS = [{l: '2026-03-01 00:00:00', y: 220}, {l: '2026-04-01 00:00:00', y: 410}, {l: '2026-05-01 00:00:00', y: 600}];
const RY = (i: number) => 230 + i * 92;

export const Scene1: React.FC<{t: number}> = ({t}) => {
  const badgeP = pop(t, S.badge[0], S.badge[0] + 0.8) * (1 - seg(t, S.badge[1] - 0.4, S.badge[1]));
  const warm = 0.5 + 0.5 * pulse(t, 1.2);
  const slotCount = [0, 0, 0];
  // piston: down while any chip is being pressed
  let press = 0;
  S.presses.forEach((T) => { press = Math.max(press, Math.sin(prog(t, T - 0.3, T + 0.4) * Math.PI)); });
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden'}}>
      <Bg t={t} />
      <div style={{position: 'absolute', left: 0, top: 92, width: 1920, display: 'flex', justifyContent: 'center', opacity: Math.min(1, badgeP * 1.5), transform: `translateY(${(1 - badgeP) * -60}px)`}}>
        {badgeP > 0.01 ? <div style={{padding: '16px 50px', borderRadius: 999, background: 'rgba(30,41,59,0.95)', border: `2px solid ${D.code}`, boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${D.code}55`}}><Bi ar="المعالجة الزمنية المتقدمة" en="Advanced Temporal Processing" size={48} t={t} start={S.badge[0] + 0.15} /></div> : null}
      </div>
      <div style={{position: 'absolute', left: 60, top: 96, height: 60}}><Tag t={t} range={S.tag} head="DATE_TRUNC('month', order_date)" body="──► Snaps Timestamps to Period Start" color={D.code} size={27} /></div>

      {/* raw timeline */}
      <div style={{position: 'absolute', left: 60, top: 190, fontFamily: FONT_MONO, fontWeight: 800, fontSize: 22, color: D.err, opacity: appear(t, 1, 2)}}>order_date (raw timestamps)</div>
      {RAW.map((r, i) => <div key={i} style={{position: 'absolute', left: 60, top: RY(i), width: 540, height: 66, borderRadius: 16, border: `2px dashed rgba(255,255,255,0.12)`, opacity: appear(t, 1.5 + i * 0.2, 2.2 + i * 0.2)}} />)}

      {/* press station */}
      <div style={{position: 'absolute', left: 690, top: 150, width: 320, opacity: appear(t, 3, 4)}}>
        <div style={{width: 16, height: 300 + 60 * press, margin: '0 auto', background: `linear-gradient(90deg,#64748B,#CBD5E1,#64748B)`, borderRadius: 8}} />
        <div style={{width: 320, height: 84, marginTop: -4, borderRadius: 18, background: `${D.code}33`, border: `3px solid ${D.code}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_MONO, fontWeight: 800, fontSize: 20, color: D.code, boxShadow: `0 0 ${24 + 40 * press}px ${D.code}`, transform: `translateY(${0}px)`, position: 'relative', top: 0}}>DATE_TRUNC('month')</div>
      </div>
      <div style={{position: 'absolute', left: 660, top: 640, width: 380, height: 16, borderRadius: 8, background: '#334155', opacity: appear(t, 3, 4)}} />

      {/* chips */}
      {RAW.map((r, i) => {
        const T = S.presses[i];
        const u1 = eio(prog(t, T - 1.5, T - 0.35));
        const u3 = eio(prog(t, T + 0.5, T + 1.6));
        const pressed = t >= T;
        const bin = BINS[r.m];
        const slot = RAW.slice(0, i).filter((x) => x.m === r.m).length;
        const tx = 1100 + slot * 250, ty = bin.y + 84;
        const x = t < T + 0.5 ? mix(60, 690, u1) : mix(690, tx, u3);
        const y = t < T + 0.5 ? mix(RY(i), 548, u1) : mix(548, ty, u3);
        const w = t < T + 0.5 ? mix(540, 320, u1) : mix(320, 230, u3);
        const sq = Math.sin(prog(t, T - 0.3, T + 0.4) * Math.PI);
        const text = pressed ? r.t.slice(0, 8) + '01 00:00:00' : r.t;
        const small = u3 > 0.5;
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, width: w, height: 66 - 14 * sq, borderRadius: 16, background: pressed ? `${D.cat}33` : `${D.err}22`, border: `2.5px solid ${pressed ? D.cat : D.err}`, boxShadow: pressed ? `0 0 ${18 + 22 * Math.max(0, 1 - (t - T) / 1.0)}px ${D.cat}` : undefined, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_MONO, fontWeight: 700, fontSize: small ? 17 : 24, color: pressed ? D.cat : C.text, whiteSpace: 'nowrap', overflow: 'hidden', opacity: appear(t, 1.5 + i * 0.2, 2.2 + i * 0.2)}}>{text}</div>
        );
      })}

      {/* monthly bins */}
      {BINS.map((b, k) => {
        const n = RAW.filter((r, i) => r.m === k && t >= S.presses[i] + 1.4).length;
        const total = RAW.filter((r) => r.m === k).length;
        return (
          <div key={k} style={{position: 'absolute', left: 1080, top: b.y, width: 780, height: 160, borderRadius: 22, border: `2.5px solid ${n ? D.cat : 'rgba(255,255,255,0.14)'}`, background: n ? `${D.cat}14` : 'rgba(255,255,255,0.03)', opacity: appear(t, 3.5 + k * 0.3, 4.3 + k * 0.3), boxShadow: n ? `0 0 ${20 + 14 * warm}px ${D.cat}44` : undefined}}>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '14px 24px', fontFamily: FONT_MONO, fontWeight: 800, fontSize: 25, color: n ? D.cat : C.mute}}><span>{b.l}</span><span>{n} / {total} orders</span></div>
          </div>
        );
      })}
      {t > S.snap + 2 ? <div style={{position: 'absolute', left: 60, top: 810, width: 960, fontFamily: FONT_AR, fontWeight: 800, fontSize: 34, color: D.cat, direction: 'rtl', opacity: appear(t, S.snap + 2, S.snap + 3)}}>تصفير الساعات والدقائق والأيام → تجميع شهري نظيف مع بقاء النوع TIMESTAMPTZ</div> : null}
    </div>
  );
};
