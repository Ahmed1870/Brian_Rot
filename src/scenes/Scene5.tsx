import React from 'react';
import TL from '../timeline.json';
import {C, D, FONT_AR, FONT_MONO} from '../theme';
import {Bg} from '../components/Glass';
import {Code, CodeLine} from '../components/Code';
import {appear} from '../components/Text';
import {Tag} from '../components/Tag';
import {back, eo, prog, pulse} from '../lib/anim';

const S = TL.cues.sc05;
const CODE: CodeLine[] = [
  "SELECT DATE_TRUNC('month', order_date) AS sales_month,", '       COUNT(order_id) AS total_orders,', '       SUM(total_amount) AS monthly_revenue', 'FROM orders',
  "WHERE order_date >= NOW() - INTERVAL '6 months'", 'GROUP BY sales_month ORDER BY sales_month DESC;',
].map((text, i) => ({text, at: S.typeT + i * 2.2, dt: 0.03}));
const M = [{l: 'Jun', v: 118}, {l: 'Jul', v: 132}, {l: 'Aug', v: 127}, {l: 'Sep', v: 151}, {l: 'Oct', v: 168}, {l: 'Nov', v: 190}];
const CX = 1040, CY = 190, CHW = 820, CHH = 660, BASE = 700, SC = 2.1;

export const Scene5: React.FC<{t: number}> = ({t}) => {
  const enter = appear(t, 174.2, 175.2);
  const warm = 0.5 + 0.5 * pulse(t, 1.2);
  const stamp = prog(t, S.seal, S.seal + 0.55);
  const stampP = stamp <= 0 ? 0 : stamp < 1 ? 1.8 - 0.8 * eo(stamp) : 1;
  const grow = (i: number) => eo(prog(t, S.rise + i * 0.9, S.rise + i * 0.9 + 1.0));
  const pts = M.map((m, i) => `${CX + 90 + i * 118 + 36},${BASE - m.v * SC * grow(i)}`).join(' ');
  const win = prog(t, S.tag2[0], S.tag2[0] + 1.2);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden'}}>
      <Bg t={t} />
      <div style={{position: 'absolute', left: 60, top: 92, height: 60}}><Tag t={t} range={S.tag1} head="Enterprise Temporal Analytics" body="──► Monthly Cohorts & MoM Revenue Trends" color={D.code} size={27} /></div>
      <div style={{position: 'absolute', left: 60, top: 92, height: 60}}><Tag t={t} range={S.tag2} head="Dynamic Windowing" body="──► NOW() - INTERVAL '6 months' Rolling Window" color={D.key} size={27} /></div>
      <div style={{opacity: enter}}><Code lines={CODE} t={t} x={60} y={190} w={940} h={400} title="monthly_cohorts.sql" fontSize={23} lineH={48} /></div>
      <div style={{position: 'absolute', left: 60, top: 630, width: 940, height: 230, borderRadius: 22, padding: '22px 30px', boxSizing: 'border-box', background: `${D.key}14`, border: `2px solid ${D.key}88`, opacity: appear(t, S.tag2[0], S.tag2[0] + 1)}}>
        <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 26, color: D.key}}>NOW() − INTERVAL '6 months'</div>
        <div style={{fontFamily: FONT_AR, fontWeight: 700, fontSize: 30, color: C.text, direction: 'rtl', marginTop: 10}}>نافذة زمنية متحركة: آخر ستة أشهر فقط، وتتحدث تلقائيًا مع الوقت الحالي</div>
        <div style={{height: 18, borderRadius: 9, background: 'rgba(255,255,255,0.08)', marginTop: 22}}><div style={{width: `${100 * win}%`, height: 18, borderRadius: 9, background: D.key}} /></div>
      </div>

      {/* monthly revenue chart */}
      <div style={{position: 'absolute', left: CX, top: CY, width: CHW, height: CHH, borderRadius: 26, background: 'linear-gradient(160deg,#22304A,#1B2740)', border: `2.5px solid ${D.cat}`, boxShadow: `0 28px 70px rgba(0,0,0,0.5), 0 0 ${24 + 20 * warm * (t > S.seal ? 1 : 0)}px ${D.cat}66`, opacity: appear(t, 175, 176)}}>
        <div style={{position: 'absolute', left: 30, top: 20, fontFamily: FONT_MONO, fontWeight: 800, fontSize: 26, color: C.text}}>monthly_revenue <span style={{color: C.mute, fontSize: 20}}>(EGP K)</span></div>
      </div>
      {M.map((m, i) => {
        const g = grow(i);
        const prev = i ? M[i - 1].v : 0;
        const mom = i ? ((m.v / prev - 1) * 100) : 0;
        const x = CX + 90 + i * 118;
        return (
          <React.Fragment key={m.l}>
            <div style={{position: 'absolute', left: x, top: BASE - m.v * SC * g, width: 72, height: m.v * SC * g, borderRadius: '12px 12px 0 0', background: `linear-gradient(180deg, ${D.cat}, ${D.cat}66)`, boxShadow: `0 0 18px ${D.cat}66`}} />
            <div style={{position: 'absolute', left: x - 14, top: BASE + 10, width: 100, textAlign: 'center', fontFamily: FONT_MONO, fontWeight: 700, fontSize: 22, color: C.dim}}>{m.l}</div>
            {g > 0.8 ? <div style={{position: 'absolute', left: x - 24, top: BASE - m.v * SC * g - 62, width: 120, textAlign: 'center', fontFamily: FONT_MONO, fontWeight: 800, fontSize: 21, color: mom >= 0 ? D.cat : D.err, opacity: Math.min(1, (g - 0.8) * 5)}}>{i ? `${mom >= 0 ? '+' : ''}${mom.toFixed(1)}%` : ''}<br /><span style={{color: C.text, fontSize: 24}}>{m.v}</span></div> : null}
          </React.Fragment>
        );
      })}
      <svg width="1920" height="1080" style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
        <polyline points={pts} fill="none" stroke={C.text} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" opacity="0.8" strokeDasharray="10 10" />
      </svg>
      {stampP > 0 ? (
        <div style={{position: 'absolute', left: 1380, top: 760, opacity: Math.min(1, stamp * 4), transform: `rotate(-8deg) scale(${stampP})`}}>
          <div style={{padding: '12px 28px', borderRadius: 18, border: `5px double ${D.cat}`, background: 'rgba(11,18,34,0.92)', boxShadow: `0 0 ${30 + 20 * warm}px ${D.cat}`, textAlign: 'center'}}>
            <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 40, color: D.cat}}>MoM VERIFIED ✓</div>
            <div style={{fontFamily: FONT_AR, fontWeight: 800, fontSize: 22, color: C.text, direction: 'rtl'}}>اعتماد التقرير الزمني</div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
