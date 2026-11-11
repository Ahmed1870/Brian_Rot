import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, SCENES, START} from '../theme';
import {Caption, Chip, Stage, Menu, menuItemY, prog, sec, clamp} from '../kit';
import {DT_ITEMS, FB, PQ, PQEditor, Pointer, RR_ITEMS, STEP_VIEW, Wp, colX, menuOf, pqBtn, stepPos, typeIconPos, ZONES} from '../lq';
import {Host} from '../l46';

// SC03 anchors (s, abs): 86.3 settings | 93.5 promote | 95.3-97.4 type Date | 99.9-100.7 remove blanks | 105.0 rewind | 108-111 edit formula | 112.2 delete X | 113.6 source safe | 121.9 re-apply
const S = START.s3;
const t = (g: number) => sec(g - S);
const BASE = ['Source', 'Navigation'];
const FIRST = pqBtn('firstRow'), RR = pqBtn('remRows');
const TI = typeIconPos(1);
const DTM = {x: colX(1), y: PQ.body + PQ.hdrH, w: 210};
const RRM = {x: RR.x, y: PQ.rib + PQ.ribH, w: 200};
const dtY = menuItemY(DTM.y, DT_ITEMS.map((l) => ({label: l})), 5);
const rrY = menuItemY(RRM.y, RR_ITEMS.map((l) => ({label: l})), 4);
const st = (i: number) => stepPos(i);
const PTS: Wp[] = [
  {f: 0, x: 900, y: 520}, {f: t(93.2), x: FIRST.cx, y: FIRST.cy}, {f: t(93.5), x: FIRST.cx, y: FIRST.cy},
  {f: t(95.0), x: TI.x, y: TI.y}, {f: t(95.3), x: TI.x, y: TI.y}, {f: t(97.2), x: DTM.x + 60, y: dtY}, {f: t(97.4), x: DTM.x + 60, y: dtY},
  {f: t(99.6), x: RR.cx, y: RR.cy}, {f: t(99.9), x: RR.cx, y: RR.cy}, {f: t(100.5), x: RRM.x + 70, y: rrY}, {f: t(100.65), x: RRM.x + 70, y: rrY},
  {f: t(104.8), x: st(2).nameX, y: st(2).y}, {f: t(105.0), x: st(2).nameX, y: st(2).y},
  {f: t(108.8), x: st(4).nameX, y: st(4).y}, {f: t(109.0), x: st(4).nameX, y: st(4).y},
  {f: t(111.8), x: st(4).xX, y: st(4).y}, {f: t(112.2), x: st(4).xX, y: st(4).y},
  {f: t(120.4), x: RR.cx, y: RR.cy}, {f: t(120.8), x: RR.cx, y: RR.cy}, {f: t(121.6), x: RRM.x + 70, y: rrY}, {f: t(121.75), x: RRM.x + 70, y: rrY},
  {f: t(123.5), x: 700, y: 560},
];
const CLICKS = [93.5, 95.3, 97.4, 99.9, 100.65, 105.0, 109.0, 112.2, 120.8, 121.75].map(t);

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  // steps timeline
  const steps = [...BASE];
  const adds: Array<[string, number]> = [['Promoted Headers', 93.6], ['Changed Type', 97.5], ['Removed Blank Rows', 100.7]];
  adds.forEach(([n, g]) => { if (at(g)) steps.push(n); });
  let delStart = 112.3;
  if (at(delStart)) steps.pop();
  if (at(121.9)) steps.push('Removed Blank Rows');
  const flash: Record<number, number> = {};
  [['Promoted Headers', 93.6], ['Changed Type', 97.5], ['Removed Blank Rows', 100.7]].forEach(([n, g]) => {
    const i = steps.indexOf(n as string); const p = at(g as number) ? clamp(1 - (f - t(g as number)) / 48) : 0; if (i >= 0 && p > 0) flash[i] = p;
  });
  if (at(121.9)) flash[steps.length - 1] = clamp(1 - (f - t(121.9)) / 48);
  // selection (rewind)
  let sel = steps.length - 1;
  if (f >= t(105.0) && f < t(109.0)) sel = 2;
  const view = STEP_VIEW(steps, sel);
  const fb = FB[steps[sel]];
  const xHot = f >= t(111.2) && f < t(112.4) ? 4 : -1;
  const ghost = f >= t(112.3) ? {name: 'Removed Blank Rows', p: prog(f, t(112.3), 6) * (1 - prog(f, t(113.4), 14))} : null;
  const dtOpen = f >= t(95.4) && f < t(97.6);
  const rrOpen = (f >= t(100.0) && f < t(100.8)) || (f >= t(121.0) && f < t(121.85));
  const dateGlow = at(97.5) ? clamp(1 - (f - t(97.5)) / 50) : 0;
  const zones = {settings: prog(f, t(86.3), 8) * (1 - prog(f, t(91.0), 10)) * (f < t(91.2) ? 1 : 0)};
  const fbGlow = prog(f, t(107.8), 8) * (1 - prog(f, t(111.0), 10));
  const src = prog(f, t(113.6), 16);
  return (
    <Stage dur={SCENES.s3.dur} inFx="left" outFx="up">
      <Host>
        <PQEditor open={1} view={view} steps={steps} sel={sel} xHot={xHot} xRed={1} flash={flash} ghost={ghost} fb={fb} fbGlow={fbGlow} zones={zones} srcCard={src}
          hotBtn={f >= t(93.2) && f < t(94.0) ? 'firstRow' : f >= t(99.6) && f < t(100.8) ? 'remRows' : f >= t(120.4) && f < t(121.8) ? 'remRows' : undefined}
          hotType={dtOpen || (f >= t(94.8) && f < t(95.4)) ? 1 : -1} dateGlow={dateGlow} gearHot={-1}>
          {dtOpen ? <Menu x={DTM.x} y={DTM.y} w={DTM.w} items={menuOf(DT_ITEMS, f >= t(96.8) ? 'Date' : '')} /> : null}
          {rrOpen ? <Menu x={RRM.x} y={RRM.y} w={RRM.w} items={menuOf(RR_ITEMS, f >= (f >= t(120) ? t(121.4) : t(100.4)) ? 'Remove Blank Rows' : '')} /> : null}
          <Pointer f={f} pts={PTS} clicks={CLICKS} />
        </PQEditor>
      </Host>
      <Caption text="Dynamic Applied Steps ──► Automatic Recording of Every Data Transformation Step" from={t(92.0)} to={t(106.0)} />
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(115.5), 10) * (1 - prog(f, t(127.5), 10))}}>
        <Chip color={C.purple}>Non-Destructive Editing ──► Delete or Modify Steps Without Affecting Source Files</Chip>
      </div>
    </Stage>
  );
};
