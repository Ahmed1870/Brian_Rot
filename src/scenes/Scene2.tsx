import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Chip, Editor, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';
import {SKUS} from '../data';

// SC02 (43-85s): SUBSTRING - two laser cutters slice the SKU.
// Anchors (s): 43.5 extract | 50.0 SUBSTRING | 54.6 start + length | 58.5 FROM 1 FOR 3 | 61.3 technique | 70.2 postal codes | 73.8 separate columns
const S = START.s2;
const t = (g: number) => sec(g - S);
const TXT = 'ELEC-2026-99';
const CW = 120;
const X0 = (1920 - TXT.length * CW + 12) / 2;
const BY = 480;

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const cut = clamp(lin(f, t(54.6), 20));
  const slice = clamp(lin(f, t(58.5), 22));
  const year = clamp(lin(f, t(66.0), 16));
  const cutterY = 430 + 190 * cut;
  const xa = X0 - 7;
  const xb = X0 + 3 * CW - 7;

  return (
    <Stage dur={1260} inFx="left" outFx="up">
      <TopBadge text="استقطاع النصوص | Slicing Text with SUBSTRING" from={sec(1)} to={sec(40)} color={C.amber} />

      <Editor x={80} y={180} w={1100} h={210} title="Query Editor" lines={['SELECT sku,', '  SUBSTRING(sku FROM 1 FOR 3) AS category_code', 'FROM products;']} start={t(43.5)} cps={1.0} size={28} hl={f > t(50.0) ? 1 : -1} hlColor={C.amber} />
      <div style={{position: 'absolute', left: 1230, top: 200, opacity: year}}>
        <Chip color={C.purple} style={{fontSize: 26}}>FROM 6 FOR 4 → '2026'</Chip>
      </div>

      {/* sku string */}
      {TXT.split('').map((ch, i) => {
        const p = clamp(pop(f, t(47 + i * 0.08)));
        const inCut = i < 3;
        const inYear = i >= 5 && i <= 8;
        const col = slice > 0.1 && inCut ? C.green : year > 0.3 && inYear ? C.purple : C.blue;
        const dy = inCut ? 70 * slice : 0;
        return (
          <div key={i}>
            <div dir="ltr" style={{position: 'absolute', left: X0 + i * CW, top: BY + dy, width: 108, height: 90, borderRadius: 14, border: `4px solid ${col}`, background: `${col}22`, color: C.text, fontFamily: MONO, fontSize: 52, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: p * (slice > 0.1 && !inCut ? 0.55 : 1), transform: `scale(${0.7 + 0.3 * p})`, boxShadow: slice > 0.1 && inCut ? `0 0 26px ${C.green}99` : 'none'}}>{ch}</div>
            <div dir="ltr" style={{position: 'absolute', left: X0 + i * CW, top: BY - 34, width: 108, textAlign: 'center', fontFamily: MONO, fontSize: 22, color: C.muted, opacity: p}}>{i + 1}</div>
          </div>
        );
      })}

      {/* two laser cutters */}
      {[xa, xb].map((x, k) => (
        <div key={k}>
          <div style={{position: 'absolute', left: x - 2, top: 430, width: 5, height: Math.max(0, cutterY - 430), background: C.amber, boxShadow: `0 0 18px 4px ${C.amber}`, opacity: cut > 0 ? 1 - 0.7 * slice : 0, borderRadius: 3}} />
          <div dir="ltr" style={{position: 'absolute', left: x - 70, top: 394, width: 140, textAlign: 'center', fontFamily: MONO, fontSize: 22, fontWeight: 700, color: C.amber, opacity: cut}}>{k === 0 ? 'start = 1' : 'length = 3'}</div>
        </div>
      ))}

      {/* result table */}
      <Win x={240} y={650} w={1440} h={270} title="result" accent={C.green} opacity={clamp(lin(f, t(60.0), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: 0, height: 50, display: 'flex', alignItems: 'center', padding: '0 40px', fontFamily: MONO, fontSize: 24, color: C.muted, borderBottom: `1px solid ${C.border}`}}>
          <span style={{width: 640}}>sku</span>
          <span>category_code</span>
        </div>
        {SKUS.map((r, i) => {
          const p = clamp(lin(f, t([60.2, 70.2, 71.4][i]), 14));
          return (
            <div key={r.sku} dir="ltr" style={{position: 'absolute', left: 24, right: 24, top: 58 + i * 52, height: 46, display: 'flex', alignItems: 'center', padding: '0 16px', fontFamily: MONO, fontSize: 30, opacity: p, transform: `translateX(${(1 - p) * 30}px)`}}>
              <span style={{width: 616, color: C.text}}>{r.sku}</span>
              <span style={{color: C.green, fontWeight: 700, textShadow: `0 0 14px ${C.green}`}}>{r.cat}</span>
            </div>
          );
        })}
      </Win>

      <Caption text="SUBSTRING(sku FROM 1 FOR 3) ──► Slices Text Chunks precisely" from={t(54)} to={t(63)} />
      <Caption text="Sub-string Extraction ──► Extracts Category Codes & Serial Patterns" from={t(64)} to={sec(40)} tone="ok" />
    </Stage>
  );
};
