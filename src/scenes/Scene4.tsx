import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {Caption, Mix, Stage, Menu, menuItemY, prog, sec, clamp, pop} from '../kit';
import {CL_ITEMS, FB, ImportDlg, PQEditor, Pointer, STEP_VIEW, Wp, impPos, menuOf, pqBtn} from '../lq';
import {Host, Panel} from '../l46';

// SC04 anchors (s, abs): 135.2 click Close&Load | 136.6 "Close & Load To..." | 137.0 dialog | 138-142.5 Table | 143.5 row limit | 150.6 Only Create Connection | 152.8 Data Model | 155.5 OK | 156.2 memory anim
const S = START.s4;
const t = (g: number) => sec(g - S);
const STEPS = ['Source', 'Navigation', 'Promoted Headers', 'Changed Type', 'Removed Blank Rows'];
const CL = pqBtn('closeLoad');
const CLM = {x: CL.x, y: 150, w: 190};
const clY = menuItemY(CLM.y, CL_ITEMS.map((l) => ({label: l})), 1);
const PTS: Wp[] = [
  {f: 0, x: 760, y: 520}, {f: t(134.6), x: CL.cx, y: CL.cy}, {f: t(135.2), x: CL.cx, y: CL.cy}, {f: t(136.4), x: CLM.x + 70, y: clY}, {f: t(136.6), x: CLM.x + 70, y: clY},
  {f: t(137.6), x: impPos.table.x + 40, y: impPos.table.y}, {f: t(149.9), x: impPos.table.x + 40, y: impPos.table.y}, {f: t(150.55), x: impPos.conn.x + 60, y: impPos.conn.y}, {f: t(150.6), x: impPos.conn.x + 60, y: impPos.conn.y},
  {f: t(152.6), x: impPos.dm.x + 90, y: impPos.dm.y}, {f: t(152.8), x: impPos.dm.x + 90, y: impPos.dm.y}, {f: t(155.3), x: impPos.ok.x, y: impPos.ok.y}, {f: t(155.5), x: impPos.ok.x, y: impPos.ok.y},
];
const CLICKS = [135.2, 136.6, 150.6, 152.8, 155.5].map(t);

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const menuOn = f >= t(135.2) && f < t(136.8);
  const dlg = prog(f, t(137.0), 12) * (1 - prog(f, t(155.7), 8));
  const conn = prog(f, t(150.6), 8), table = 1 - conn;
  const dm = prog(f, t(152.8), 8);
  const gT = prog(f, t(138.0), 8) * (1 - prog(f, t(142.6), 8));
  const gC = prog(f, t(150.6), 8) * (1 - prog(f, t(152.0), 10));
  const gD = prog(f, t(152.8), 8) * (1 - prog(f, t(155.2), 10)) ;
  const lim = prog(f, t(143.4), 14) * (1 - prog(f, t(150.0), 10));
  const small = prog(f, t(138.2), 12) * (1 - prog(f, t(142.8), 10));
  const mem = prog(f, t(156.2), 16);
  const memX = at(156.2) ? f - t(156.2) : 0;
  return (
    <Stage dur={SCENES.s4.dur} inFx="up" outFx="zoom">
      <Host>
        <PQEditor open={1} view={STEP_VIEW(STEPS, 4)} steps={STEPS} sel={4} fb={FB['Removed Blank Rows']} srcCard={1} hotBtn={f >= t(134.6) && f < t(136.8) ? 'closeLoad' : undefined}>
          {menuOn ? <Menu x={CLM.x} y={CLM.y} w={CLM.w} items={menuOf(CL_ITEMS, f >= t(136.2) ? 'Close & Load To...' : '')} /> : null}
          <ImportDlg p={dlg} table={table} conn={conn} dm={dm} okHot={f >= t(155.2)} glowTable={gT} glowConn={gC} glowDm={gD} />
          <div style={{position: 'absolute', left: 1000, top: 190, width: 232, opacity: small, transform: `translateX(${(1 - small) * 30}px)`}}>
            <div style={{border: `2px solid ${C.blue}`, borderRadius: 12, padding: '12px 16px', background: '#F0F9FF', fontFamily: MONO, fontSize: 15, color: '#0B1222'}}><b>Small data</b><br />Table in the worksheet · you see the rows</div>
          </div>
          <div style={{position: 'absolute', left: 1000, top: 190, width: 232, opacity: lim, transform: `translateX(${(1 - lim) * 30}px)`}}>
            <div style={{border: `2px solid ${C.amber}`, borderRadius: 12, padding: '12px 16px', background: '#FFFBEB', fontFamily: MONO, fontSize: 15, color: '#0B1222'}}><b>Millions of rows</b><br />A worksheet stops at 1,048,576 rows</div>
          </div>
          <Pointer f={f} pts={PTS} clicks={CLICKS} hide={at(156.0)} />
        </PQEditor>
      </Host>
      <Panel p={mem * (1 - prog(f, t(169.6), 12))} color={C.green}>
        <div dir="ltr" style={{position: 'absolute', left: 60, top: 400, width: 330, height: 150, borderRadius: 20, background: C.card, border: `3px solid ${C.blue}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 30px ${C.blue}66`}}>
          <div style={{fontFamily: MONO, fontSize: 36, fontWeight: 700, color: C.blue}}>Power Query</div>
          <div style={{fontFamily: MONO, fontSize: 20, color: C.muted}}>cleaned rows</div>
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 1050, top: 90, width: 600, height: 220, borderRadius: 20, background: C.card, border: `3px dashed ${C.border}`, opacity: 0.6 + 0.2 * Math.sin(f * 0.1), padding: 24}}>
          <div style={{fontFamily: MONO, fontSize: 30, fontWeight: 700, color: C.muted}}>Worksheet</div>
          <div style={{fontFamily: MONO, fontSize: 22, color: C.muted, marginTop: 8}}>max 1,048,576 rows</div>
          <div style={{fontFamily: MONO, fontSize: 26, color: C.amber, marginTop: 24, opacity: prog(f, t(158.5), 10)}}>rows NOT poured into the sheet</div>
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 1050, top: 400, width: 600, height: 220, borderRadius: 20, background: C.card, border: `3px solid ${C.green}`, boxShadow: `0 0 50px ${C.green}66`, padding: 24, transform: `scale(${0.96 + 0.04 * pop(f, t(157.5))})`}}>
          <div style={{fontFamily: MONO, fontSize: 30, fontWeight: 700, color: C.green}}>Data Model · in-memory engine</div>
          <div style={{fontFamily: MONO, fontSize: 22, color: C.text, marginTop: 8}}>stored compressed in memory</div>
          <div style={{height: 26, borderRadius: 13, background: C.deep, border: `2px solid ${C.border}`, marginTop: 34, overflow: 'hidden'}}>
            <div style={{width: `${clamp(memX / 130) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${C.blue}, ${C.green})`}} />
          </div>
        </div>
        <svg width={1720} height={730} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
          <path d="M395 440 C 700 440, 780 200, 1040 200" fill="none" stroke={C.border} strokeWidth={5} strokeDasharray="12 10" />
          <path d="M1000 170 l50 30 -50 30" fill="none" stroke={C.border} strokeWidth={5} />
          <line x1={700} y1={190} x2={760} y2={250} stroke={C.red} strokeWidth={8} strokeLinecap="round" opacity={prog(f, t(158.5), 10)} />
          <line x1={760} y1={190} x2={700} y2={250} stroke={C.red} strokeWidth={8} strokeLinecap="round" opacity={prog(f, t(158.5), 10)} />
          <path d="M395 500 C 700 500, 780 510, 1040 510" fill="none" stroke={C.green} strokeWidth={6} />
          {Array.from({length: 7}, (_, k) => { const d = ((memX * 0.02 + k / 7) % 1); const x = 400 + 640 * d; return <rect key={k} x={x} y={494} width={26} height={22} rx={4} fill={C.green} style={{filter: `drop-shadow(0 0 8px ${C.green})`}} opacity={memX > 0 ? 1 : 0} />; })}
        </svg>
        <Mix style={{position: 'absolute', left: 0, right: 0, bottom: 44, textAlign: 'center', fontSize: 40, fontWeight: 700, color: C.text, opacity: prog(f, t(159.5), 12)}}>البيانات في الذاكرة مباشرة — الشيت بدون إجهاد</Mix>
      </Panel>
      <Caption text="Load Target Decisions ──► Close & Load To... Defines Data Destination" from={t(132.2)} to={t(147.6)} />
      <Caption text="Enterprise Memory Optimization ──► Load to Data Model Bypasses 1 Million Row Sheet Limits" from={t(156.0)} to={t(169.0)} tone="ok" />
    </Stage>
  );
};
