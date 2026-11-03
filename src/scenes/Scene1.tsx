import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO} from '../theme';
import {Caption, Chip, Mix, Stage, TopBadge, Win, clamp, lerp, pop, prog, sec} from '../kit';

// SC01 (frames 0-1170, global 0-39s): INNER JOIN loses rows; LEFT JOIN preserves every left row and pads with NULL.
const t = (g: number) => sec(g);
const CUST = ['Ahmed', 'Sara', 'Omar', 'Mona', 'Karim'];
const ORD = [
  {id: 101, c: 'Ahmed', a: 250},
  {id: 102, c: 'Ahmed', a: 90},
  {id: 103, c: 'Sara', a: 410},
  {id: 104, c: 'Mona', a: 130},
];
// joined rows: name, order, amount, inner index, left index
const ROWS = [
  {n: 'Ahmed', o: 101, a: 250, i1: 0, i2: 0},
  {n: 'Ahmed', o: 102, a: 90, i1: 1, i2: 1},
  {n: 'Sara', o: 103, a: 410, i1: 2, i2: 2},
  {n: 'Omar', o: null, a: null, i1: 3, i2: 3},
  {n: 'Mona', o: 104, a: 130, i1: 3, i2: 4},
  {n: 'Karim', o: null, a: null, i1: 4, i2: 5},
] as const;
const RH = 48;

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const src = prog(f, t(3.5), 24);
  const innerOn = prog(f, t(12.7), 20);
  const lost = prog(f, t(17.7), 18);
  const lm = prog(f, t(21.4), 22);
  const nulls = (i: number) => pop(f, t(25.6) + i * 18);
  const done = pop(f, t(34.9));
  const mode = lm > 0.5 ? 'LEFT JOIN' : 'INNER JOIN';
  const modeColor = lm > 0.5 ? C.blue : C.red;
  const tbl = prog(f, t(11.8), 22);

  return (
    <Stage dur={1170} inFx="none" outFx="zoom">
      <TopBadge text="الربط الخارجي اليساري | LEFT JOIN & Record Preservation" from={t(2)} to={t(18)} color={C.blue} />

      <Win x={90} y={150} w={640} h={330} title="customers (LEFT table)" accent={lm > 0.5 ? C.blue : C.border} opacity={src}>
        <div dir="ltr" style={{padding: '14px 24px', fontFamily: MONO, fontSize: 22, color: C.text}}>
          {CUST.map((c, i) => (
            <div key={c} style={{display: 'flex', height: 48, alignItems: 'center', borderBottom: `1px solid ${C.border}`, color: lm > 0.5 ? C.blue : C.text}}>
              <span style={{width: 60, color: C.muted}}>{i + 1}</span>
              {c}
            </div>
          ))}
        </div>
      </Win>
      <Win x={1190} y={150} w={640} h={330} title="orders (RIGHT table)" accent={C.border} opacity={src}>
        <div dir="ltr" style={{padding: '14px 24px', fontFamily: MONO, fontSize: 22, color: C.text}}>
          {ORD.map((o) => (
            <div key={o.id} style={{display: 'flex', height: 48, alignItems: 'center', borderBottom: `1px solid ${C.border}`}}>
              <span style={{width: 120, color: C.green}}>#{o.id}</span>
              <span style={{width: 200}}>{o.c}</span>
              <span style={{color: C.muted}}>{o.a}</span>
            </div>
          ))}
        </div>
      </Win>

      {/* join mode */}
      <div style={{position: 'absolute', left: 760, top: 250, width: 400, textAlign: 'center', opacity: innerOn}}>
        <Chip color={modeColor} style={{fontSize: 36, padding: '10px 30px'}}>{mode}</Chip>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.muted, marginTop: 12}}>ON c.customer_id = o.customer_id</div>
      </div>

      {/* result */}
      <Win x={360} y={510} w={1200} h={392} title={`result · ${mode}`} accent={modeColor} opacity={tbl}>
        <div dir="ltr" style={{padding: '8px 22px 0 22px', position: 'relative'}}>
          <div style={{display: 'flex', fontFamily: MONO, fontSize: 19, color: C.muted, height: 38, alignItems: 'center', borderBottom: `2px solid ${C.border}`}}>
            <div style={{width: 280}}>customer</div>
            <div style={{width: 130}} />
            <div style={{width: 260}}>order_id</div>
            <div>amount</div>
          </div>
          {ROWS.map((r, i) => {
            const un = r.o === null;
            const idx = lerp(r.i1, r.i2, lm);
            const y = 46 + idx * RH;
            const ghost = un ? prog(f, t(13.2), 16) * (1 - lm) * 0.55 : 0;
            const solid = un ? lm : clamp(tbl);
            const lostMark = un && lm < 0.5 && lost > 0.3;
            return (
              <div key={i} style={{position: 'absolute', left: 22, right: 22, top: y, height: RH - 6, display: 'flex', alignItems: 'center', fontFamily: MONO, fontSize: 24, color: C.text, borderRadius: 10, background: C.deep, border: `2px ${un && lm < 0.5 ? 'dashed' : 'solid'} ${un && lm < 0.5 ? C.red : lm > 0.5 ? C.blue : C.border}`, opacity: un ? Math.max(ghost, solid) : solid}}>
                <div style={{width: 280, paddingLeft: 14, color: lm > 0.5 ? C.blue : C.text, fontWeight: lm > 0.5 ? 700 : 400}}>{r.n}</div>
                <div style={{width: 130, display: 'flex', alignItems: 'center'}}>
                  <div style={{height: 5, width: !un && lm > 0.1 ? 90 * lm : 0, background: C.green, borderRadius: 3, boxShadow: `0 0 10px ${C.green}`}} />
                </div>
                <div style={{width: 260}}>{!un ? r.o : ''}</div>
                <div>{!un ? r.a : ''}</div>
                {un && (
                  <div style={{position: 'absolute', left: 280 + 130 + 4, top: 2, width: 420, height: RH - 14, borderRadius: 8, background: `${C.amber}33`, border: `2px solid ${C.amber}`, color: C.amber, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: 4, opacity: clamp(nulls(i === 3 ? 0 : 1)), transform: `translateX(${(1 - clamp(nulls(i === 3 ? 0 : 1))) * 300}px)`}}>NULL</div>
                )}
                {lostMark && <span style={{position: 'absolute', right: 16, color: C.red, fontSize: 20}}>✕ lost in INNER JOIN</span>}
              </div>
            );
          })}
        </div>
      </Win>

      <div style={{position: 'absolute', left: 0, right: 0, top: 905, display: 'flex', justifyContent: 'center', opacity: clamp(done), transform: `scale(${0.9 + 0.1 * clamp(done)})`}}>
        <Chip color={C.green} style={{fontSize: 24}}><Mix>٥ عملاء محفوظين · لا سطر مفقود ✓</Mix></Chip>
      </div>

      <Caption text="LEFT JOIN ──► Preserves ALL Left Rows + Pads Missing Right Data with NULL" from={t(22)} to={t(37.5)} />
    </Stage>
  );
};
