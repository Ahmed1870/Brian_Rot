import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {SYNERGY_DATA, SYNERGY_ROWS} from '../data';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed,
} from '../kit';

// SC04: Master Synergy Pipeline — LET + SEQUENCE + RANDARRAY + HSTACK in one cell.
// Single Excel window. Typed formula builds a 10-row testing dataset.
const S = START.s4;
const t = (g: number) => sec(g - S);

const colW = (c: number) => [0, 110, 160, 110][c] ?? XL.colW;
const FORMULA = '=LET(Rows, 10, IDs, SEQUENCE(Rows, 1, 5001), Values, RANDARRAY(Rows, 1, 1000, 5000, TRUE), HSTACK(IDs, Values))';

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 300, fy: 240, z: 1.15}, prog(f, t(2), 30));

  // Typing the master formula (131-145s)
  const typedFormula = typed(FORMULA, f, t(131), 1.1);
  const typingDone = f >= t(145);
  const fbEdit = f >= t(131) && f < t(145.5);

  // Spill progress: rows fill one-by-one (146s onwards)
  const spillP = typingDone ? prog(f, t(146), 20) : 0;
  const filledRows = Math.floor(spillP * SYNERGY_ROWS);

  // Variable highlights during typing
  const rowsVarP = prog(f, t(133), 12) * (1 - prog(f, t(170), 12));
  const idsVarP = prog(f, t(136), 12) * (1 - prog(f, t(170), 12));
  const valuesVarP = prog(f, t(139), 12) * (1 - prog(f, t(170), 12));
  const hstackP = prog(f, t(142), 12) * (1 - prog(f, t(170), 12));

  // Cursor: B2 → formula bar → Enter
  const b2 = cellCenter(2, 2, {colW});
  const fbY = geo(1, 0, 1).fbTop + 14;
  const pts = dwell([
    {f: t(131), x: 200, y: fbY},
    {f: t(145), x: b2.x, y: b2.y},
    {f: t(147), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [145];
  const curHide = f > t(148);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s4.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="Synergy_Pipeline.xlsx" nameBox="B2" formula={typedFormula} fbEdit={fbEdit}
          cell={(r, c) => {
            if (r === 1) {
              if (c < 2 || c > 3) return undefined;
              return {t: c === 2 ? 'IDs (SEQUENCE)' : 'Values (RANDARRAY)', b: true, bg: '#D1FAE5', al: 'l', color: '#107C41'};
            }
            if (r >= 2 && r <= SYNERGY_ROWS + 1 && c >= 2 && c <= 3) {
              const idx = r - 2;
              if (idx < filledRows) {
                const row = SYNERGY_DATA[idx];
                if (c === 2) return {t: String(row.id), color: '#107C41'};
                return {t: 'EGP ' + row.value.toLocaleString('en-US'), al: 'r', color: '#107C41'};
              }
              return undefined;
            }
            return undefined;
          }} colW={colW}
          sel={{r1: 2, c1: 2, r2: 2, c2: 2}} active={{r: 2, c: 2}}
          thumb={0} thumbSize={0.55}
        >
          {/* Spill border around B2:C11 */}
          {spillP > 0.05 ? (
            <Neon
              x={cellCenter(2, 2, {colW}).x - colW(2) / 2}
              y={cellCenter(2, 2, {colW}).y - XL.rowH / 2}
              w={colW(2) + colW(3)}
              h={XL.rowH * SYNERGY_ROWS}
              color={C.green}
              p={spillP * (1 - prog(f, t(170), 12))}
              label="HSTACK spill: 10 rows × 2 cols"
              labelBelow
            />
          ) : null}
          {/* Variable highlight on cell B2 (the formula source) */}
          {typingDone ? (
            <Neon x={cellCenter(2, 2, {colW}).x - colW(2) / 2} y={cellCenter(2, 2, {colW}).y - XL.rowH / 2} w={colW(2) + colW(3)} h={XL.rowH} color={C.purple} p={0.4 * (1 - prog(f, t(170), 12))} label="Single-cell formula" labelBelow />
          ) : null}
          {/* Click ripples */}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={C.green} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>

      {/* Variable tracking badges at bottom */}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'center', gap: 12, opacity: clamp(prog(f, t(131), 12) * (1 - prog(f, t(170), 12)))}}>
        <div style={{background: `${C.purple}22`, border: `1.5px solid ${C.purple}`, borderRadius: 8, padding: '8px 14px', boxShadow: rowsVarP > 0.1 ? `0 0 ${14 * rowsVarP}px ${C.purple}88` : 'none', opacity: 0.4 + 0.6 * rowsVarP}}>
          <div style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, color: C.purple}}>Rows = 10</div>
        </div>
        <div style={{background: `${C.blue}22`, border: `1.5px solid ${C.blue}`, borderRadius: 8, padding: '8px 14px', boxShadow: idsVarP > 0.1 ? `0 0 ${14 * idsVarP}px ${C.blue}88` : 'none', opacity: 0.4 + 0.6 * idsVarP}}>
          <div style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, color: C.blue}}>IDs = SEQUENCE(Rows, 1, 5001)</div>
        </div>
        <div style={{background: `${C.amber}22`, border: `1.5px solid ${C.amber}`, borderRadius: 8, padding: '8px 14px', boxShadow: valuesVarP > 0.1 ? `0 0 ${14 * valuesVarP}px ${C.amber}88` : 'none', opacity: 0.4 + 0.6 * valuesVarP}}>
          <div style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, color: C.amber}}>Values = RANDARRAY(Rows, 1, 1000, 5000, TRUE)</div>
        </div>
        <div style={{background: `${C.green}22`, border: `1.5px solid ${C.green}`, borderRadius: 8, padding: '8px 14px', boxShadow: hstackP > 0.1 ? `0 0 ${14 * hstackP}px ${C.green}88` : 'none', opacity: 0.4 + 0.6 * hstackP}}>
          <div style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, color: C.green}}>HSTACK(IDs, Values)</div>
        </div>
      </div>

      <TopBadge text="Master Synergy ──► LET + SEQUENCE + RANDARRAY + HSTACK in One Cell" from={t(131.0)} to={t(150.0)} />
      {spillP < 0.3 ? <Caption text="Single-Cell Simulation ──► Generates Complete Multi-Column Testing Datasets" from={t(150.0)} to={t(169.0)} tone="ok" /> : null}
    </Stage>
  );
};
