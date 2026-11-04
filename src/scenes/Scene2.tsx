import React from 'react';
import TL from '../timeline.json';
import {C, D, FONT_AR, FONT_MONO} from '../theme';
import {Bg} from '../components/Glass';
import {Code, CodeLine} from '../components/Code';
import {appear, pop} from '../components/Text';
import {Tag} from '../components/Tag';
import {back, eo, prog, pulse} from '../lib/anim';

const S = TL.cues.sc02;
const CUST = [{id: 1, n: 'سارة'}, {id: 2, n: 'منى'}, {id: 3, n: 'عمر'}, {id: 4, n: 'أحمد'}];
const ORD = [4, 1, 1, 2, 4, 1, 2, 4]; // orders.customer_id per row
const STEP = 0.28;
const CODE: CodeLine[] = [{text: 'WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id)', at: S.typeT, dt: 0.045}];

export const Scene2: React.FC<{t: number}> = ({t}) => {
  const enter = appear(t, 40.3, 41.3);
  let k = -1;
  S.cycles.forEach((s, i) => { if (t >= s) k = i; });
  const s0 = k >= 0 ? S.cycles[k] : 0;
  const cust = k >= 0 ? CUST[k] : CUST[0];
  const first = ORD.findIndex((x) => x === cust.id);
  const total = first < 0 ? ORD.length : first + 1;
  const scanned = k < 0 ? 0 : Math.min(total, Math.max(0, Math.floor((t - s0 - 0.3) / STEP) + 1));
  const stopped = k >= 0 && scanned >= total;
  const verdict = (i: number) => (i < k || (i === k && stopped)) ? (CUST[i].id !== 3) : null;
  const snap = k >= 0 && stopped && first >= 0 ? Math.sin(prog(t - s0 - 0.3 - total * STEP, 0, 0.6) * Math.PI) : 0;
  const alt = Math.floor(t / 2) % 2 === 0;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden'}}>
      <Bg t={t} />
      <div style={{position: 'absolute', left: 60, top: 92, height: 60}}><Tag t={t} range={S.tag1} head="WHERE EXISTS" body="(SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id)" color={D.code} size={25} /></div>
      <div style={{position: 'absolute', left: 60, top: 92, height: 60}}><Tag t={t} range={S.tag2} head="Short-Circuiting Mechanics" body="──► Stops Scanning Upon FIRST Matching Row (High Speed)" color={D.cat} size={25} /></div>
      <div style={{opacity: enter}}><Code lines={CODE} t={t} x={60} y={190} w={1800} h={130} title="exists.sql" fontSize={30} lineH={56} /></div>
      {t > 55 ? <div style={{position: 'absolute', right: 80, top: 196, opacity: appear(t, 55, 56), fontFamily: FONT_MONO, fontWeight: 800, fontSize: 24, color: D.key}}>SELECT {alt ? '1' : '*'} <span style={{color: D.cat}}>≡ نفس النتيجة</span></div> : null}

      {/* customers (outer) */}
      <div style={{position: 'absolute', left: 60, top: 370, width: 560, opacity: enter}}>
        <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 24, color: D.code, marginBottom: 12}}>customers c</div>
        {CUST.map((c, i) => {
          const v = verdict(i);
          const act = i === k && !stopped;
          return (
            <div key={c.id} style={{height: 96, marginBottom: 14, borderRadius: 18, display: 'flex', alignItems: 'center', gap: 18, padding: '0 24px', background: act || (i === k) ? `${D.code}26` : 'rgba(255,255,255,0.05)', border: `2px solid ${i === k ? D.code : 'rgba(255,255,255,0.12)'}`, boxShadow: i === k ? `0 0 26px ${D.code}55` : undefined}}>
              <span style={{fontFamily: FONT_MONO, fontSize: 26, color: C.mute}}>{c.id}</span>
              <span style={{fontFamily: FONT_AR, fontWeight: 800, fontSize: 36, color: C.text}}>{c.n}</span>
              <span style={{marginLeft: 'auto', padding: '6px 20px', borderRadius: 12, fontFamily: FONT_MONO, fontWeight: 800, fontSize: 26, background: v === null ? 'transparent' : v ? D.cat : '#334155', color: v === null ? 'transparent' : v ? C.bg : C.dim, transform: `scale(${v === null ? 0.6 : 1})`}}>{v ? 'TRUE' : 'FALSE'}</span>
            </div>
          );
        })}
      </div>

      {/* orders (inner) with laser scanner */}
      <div style={{position: 'absolute', left: 700, top: 370, width: 620, opacity: enter}}>
        <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 24, color: D.key, marginBottom: 12}}>orders o</div>
        <div style={{borderRadius: 20, background: '#0B1222', border: `2px solid ${D.key}66`, overflow: 'hidden', position: 'relative'}}>
          {ORD.map((cid, r) => {
            const hit = k >= 0 && cid === cust.id && r === first;
            const scannedRow = r < scanned;
            const cut = stopped && first >= 0 && r >= total;
            return (
              <div key={r} style={{height: 62, display: 'flex', alignItems: 'center', gap: 30, padding: '0 28px', fontFamily: FONT_MONO, fontSize: 26, borderTop: r ? '1px solid rgba(71,85,105,0.4)' : undefined, color: cut ? '#334155' : C.text, background: hit && stopped ? `${D.cat}44` : scannedRow ? `${D.key}1F` : 'transparent', boxShadow: hit && stopped ? `inset 0 0 ${30 * (0.5 + snap)}px ${D.cat}` : undefined, opacity: cut ? 0.45 : 1}}>
                <span style={{color: C.mute, width: 70}}>#{101 + r}</span><span>customer_id = {cid}</span>
                {hit && stopped ? <span style={{marginLeft: 'auto', color: D.cat, fontWeight: 800}}>MATCH ✓</span> : null}
              </div>
            );
          })}
          {k >= 0 && !stopped ? <div style={{position: 'absolute', left: 0, right: 0, top: Math.min(8, scanned) * 62 - 4, height: 8, background: `linear-gradient(90deg,transparent,${D.code},transparent)`, boxShadow: `0 0 20px ${D.code}`}} /> : null}
        </div>
      </div>

      {/* counters */}
      <div style={{position: 'absolute', left: 1400, top: 370, width: 460, opacity: appear(t, 52, 53)}}>
        <div style={{borderRadius: 24, padding: '28px 32px', background: stopped && first >= 0 ? `${D.cat}1F` : 'rgba(255,255,255,0.05)', border: `2px solid ${stopped && first >= 0 ? D.cat : 'rgba(255,255,255,0.14)'}`, boxShadow: stopped && first >= 0 ? `0 0 ${30 + 20 * snap}px ${D.cat}` : undefined}}>
          <div style={{fontFamily: FONT_MONO, fontSize: 20, color: C.mute, letterSpacing: 2}}>ROWS SCANNED</div>
          <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 90, color: stopped && first >= 0 ? D.cat : C.text, lineHeight: 1.1}}>{scanned}<span style={{fontSize: 38, color: C.mute}}> / {ORD.length}</span></div>
          <div style={{fontFamily: FONT_AR, fontWeight: 800, fontSize: 30, color: stopped && first >= 0 ? D.cat : C.dim, direction: 'rtl', minHeight: 44}}>{stopped ? (first >= 0 ? 'توقف مبكر: وُجد أول سطر مطابق' : 'مسح كامل: لا يوجد تطابق') : 'جارٍ المسح…'}</div>
        </div>
      </div>
    </div>
  );
};
