import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, pop, prog, sec} from '../kit';

// SC05 (frames 5100-6300, global 170-210s): both techniques together in manzooma_store_db (timings are illustrative).
const S = 170;
const t = (g: number) => sec(g - S);
const REPORT = [
  {d: '2025-03-01', n: 42, v: '18,450'},
  {d: '2025-03-02', n: 51, v: '22,130'},
  {d: '2025-03-03', n: 38, v: '16,900'},
];
const FOUND = ['Wireless Mouse', 'WIRELESS MOUSE PRO', 'wireless mouse mini'];

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const c1 = prog(f, t(181.4), 26);
  const c2 = prog(f, t(187.3), 26);
  const rep = (i: number) => pop(f, t(190.1) + i * 9);
  const fnd = (i: number) => pop(f, t(192.0) + i * 9);
  const ms1 = pop(f, t(194.0));
  const ms2 = pop(f, t(195.6));
  const seal = pop(f, t(200.7));
  const stable = pop(f, t(198.0));
  const glow = 0.5 + 0.5 * Math.sin(f / 8);

  return (
    <Stage dur={1200} inFx="zoom" outFx="down">
      <TopBadge text="التطبيق المؤسسي | Dual Indexing in manzooma_store_db" from={t(171.4)} to={t(184)} color={C.green} />

      <Editor x={90} y={150} w={1250} h={190} title="enterprise_indexes.sql" lines={['CREATE INDEX idx_branch_order_date ON store_orders (branch_id, order_date);', 'CREATE INDEX idx_lower_product_name ON store_products (LOWER(product_name));']} start={t(176.0)} cps={0.6} size={22} accent={C.green} />

      <div dir="ltr" style={{position: 'absolute', left: 1380, top: 160, width: 450, display: 'flex', flexDirection: 'column', gap: 16}}>
        <div style={{opacity: c1}}><Chip color={C.blue} style={{fontSize: 22}}>Multi-Column (branch, date)</Chip></div>
        <div style={{opacity: c2}}><Chip color={C.purple} style={{fontSize: 22}}>Expression (LOWER name)</Chip></div>
      </div>

      {/* BI report card */}
      <Win x={90} y={370} w={840} h={510} title="BI report · branch + date" accent={c1 > 0.5 ? C.blue : C.border} opacity={c1}>
        <div dir="ltr" style={{padding: '14px 26px', fontFamily: MONO}}>
          <div style={{fontSize: 21, color: C.text}}>WHERE branch_id = 3<br />  AND order_date BETWEEN '2025-03-01' AND '2025-03-03'</div>
          <div style={{marginTop: 18}}>
            {REPORT.map((r, i) => (
              <div key={r.d} style={{display: 'flex', alignItems: 'center', height: 52, marginBottom: 8, borderRadius: 10, border: `2px solid ${C.blue}`, background: `${C.blue}14`, padding: '0 18px', fontSize: 22, color: C.text, opacity: clamp(rep(i)), transform: `translateX(${(1 - clamp(rep(i))) * -60}px)`}}>
                <span style={{width: 200}}>{r.d}</span>
                <span style={{width: 130, color: C.muted}}>{r.n} orders</span>
                <span style={{color: C.green, fontWeight: 700}}>{r.v}</span>
              </div>
            ))}
          </div>
          <div style={{marginTop: 10, transform: `scale(${clamp(ms1)})`, opacity: clamp(ms1), transformOrigin: 'left center'}}><Chip color={C.green} style={{fontSize: 22}}>Index Scan · ≈ 0.8 ms</Chip></div>
        </div>
      </Win>

      {/* case-insensitive search card */}
      <Win x={990} y={370} w={840} h={510} title="search · case-insensitive" accent={c2 > 0.5 ? C.purple : C.border} opacity={c2}>
        <div dir="ltr" style={{padding: '14px 26px', fontFamily: MONO}}>
          <div style={{fontSize: 21, color: C.text}}>WHERE LOWER(product_name)<br />  = 'wireless mouse'</div>
          <div style={{marginTop: 18}}>
            {FOUND.map((r, i) => (
              <div key={r} style={{display: 'flex', alignItems: 'center', height: 52, marginBottom: 8, borderRadius: 10, border: `2px solid ${C.purple}`, background: `${C.purple}14`, padding: '0 18px', fontSize: 22, color: C.text, opacity: clamp(fnd(i)), transform: `translateX(${(1 - clamp(fnd(i))) * 60}px)`}}>{r}</div>
            ))}
          </div>
          <div style={{marginTop: 10, transform: `scale(${clamp(ms2)})`, opacity: clamp(ms2), transformOrigin: 'left center'}}><Chip color={C.green} style={{fontSize: 22}}>Index Scan · ≈ 0.6 ms</Chip></div>
        </div>
      </Win>

      <div dir="ltr" style={{position: 'absolute', left: 90, top: 893, display: 'flex', alignItems: 'center', gap: 22}}>
        <div style={{transform: `scale(${clamp(stable)})`, opacity: clamp(stable), transformOrigin: 'left center'}}><Mix style={{fontSize: 26, color: C.muted}}>استقرار أقصى للسيرفر</Mix></div>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, transform: `scale(${clamp(seal)})`, opacity: clamp(seal), transformOrigin: 'left center'}}>
          <Check p={clamp(seal)} size={40} />
          <Chip color={C.green} style={{fontSize: 22, boxShadow: `0 0 ${16 * glow}px ${C.green}55`}}>Enterprise Quality Seal · illustrative timings</Chip>
        </div>
      </div>

      <Caption text="Enterprise Indexing ──► Multi-Column (Branch, Date) + Expression (LOWER Name)" from={t(177.0)} to={t(189.6)} />
      <Caption text="Production Analytics ──► Instant Multi-Filter BI & Case-Insensitive Search" from={t(190.4)} to={t(206)} />
    </Stage>
  );
};
