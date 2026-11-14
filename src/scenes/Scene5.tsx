import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {Caption, XL, pop, prog, ribbonItemBox, sec} from '../kit';
import {Stage} from '../kit';
import {tabBox} from '../xl';
import {Pointer, Wp} from '../lq';
import {Tag} from '../l54';
import {DA_OK, DataAnalysisDlg, Hist, Host63, OUT_FENCE, OUT_N, ST, daItem, f2, fmt, salesCell} from '../l63';

// SC05 anchors (s, abs): 171.6 50,000 invoices | 177.3 file | 181.8 Data tab | 183.2 Data Analysis | 184.1 OK | 184.4-186.4 stats spool | 187.7 rows | 192.2 done | 194.2 seal | 196.6 outliers | 199.4 decisions
const S = START.s5;
const t = (g: number) => sec(g - S);
const DATA = tabBox('Data'), DAB = ribbonItemBox('Data', 'DataAnalysis');
const EV: Array<[number, number, number]> = [[181.8, DATA.cx, 48], [183.2, DAB.cx, DAB.cy], [183.9, daItem(5).x, daItem(5).y], [184.6, DA_OK.x, DA_OK.y]];
const PTS: Wp[] = [{f: 0, x: 900, y: 560}];
const CLICKS: number[] = [];
EV.forEach(([g, x, y]) => { PTS.push({f: t(g - 0.3), x, y}, {f: t(g), x, y}); CLICKS.push(t(g)); });
PTS.push({f: t(186.0), x: 600, y: 560});
const ROWS: Array<[string, string, number]> = [['Mean', f2(ST.mean), 185.0], ['Median', fmt(ST.median), 185.6], ['Mode', fmt(ST.mode), 186.1], ['Percentile 90%', fmt(ST.p90), 186.6], ['TrimMean 10%', f2(ST.tm), 187.0], ['Std Deviation', f2(ST.sd), 187.4], ['Max', fmt(ST.max), 187.8]];

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const dlg = prog(f, t(183.2), 8) * (1 - prog(f, t(184.7), 6));
  const panel = prog(f, t(184.8), 12);
  const seal = pop(f, t(194.2));
  const pulse = 0.6 + 0.4 * Math.sin(f * 0.14);
  return (
    <Stage dur={SCENES.s5.dur} inFx="up" outFx="fade">
      <Host63 tab={at(181.8) ? 'Data' : 'Home'} cell={salesCell} checks={{Analyze: 1}} ribbonHot={at(182.4) && !at(183.2) ? 'DataAnalysis' : undefined} glow={at(194.2) ? C.green : undefined}>
        <DataAnalysisDlg p={dlg} sel={at(183.9) ? 5 : -1} okHot={at(184.5)} />
        <Tag x={720} y={236} text="50,000 sales invoices · manzooma_sales_2026.xlsx" color={C.blue} p={prog(f, t(171.6), 10) * (1 - prog(f, t(181.0), 8))} dark />
        {panel > 0.01 ? (
          <div dir="ltr" style={{position: 'absolute', left: 700, top: 215, width: 320, padding: '10px 16px 12px', background: '#0B1222', border: `2px solid ${C.green}`, borderRadius: 12, opacity: panel, boxShadow: `0 0 18px ${C.green}55`, zIndex: 30}}>
            <div style={{fontFamily: MONO, fontSize: 14, fontWeight: 700, color: C.text}}>Descriptive Statistics · 50,000 rows</div>
            {ROWS.map(([n, v, g]) => (
              <div key={n} style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 15, marginTop: 7, opacity: prog(f, t(g), 8), color: n === 'Mean' ? C.red : n === 'Median' || n === 'Mode' ? C.purple : n.startsWith('Perc') || n.startsWith('Trim') ? C.amber : C.text}}><span>{n}</span><span style={{fontWeight: 700}}>{v}</span></div>
            ))}
            <div style={{marginTop: 12, fontFamily: MONO, fontSize: 13, color: C.green, opacity: prog(f, t(192.2), 10)}}>✓ report complete</div>
          </div>
        ) : null}
        {at(187.4) ? <Hist x={1040} y={215} w={460} h={235} p={prog(f, t(187.4), 18)} mark={prog(f, t(188.0), 12)} fence={prog(f, t(196.6), 14)} /> : null}
        <Tag x={1040} y={462} text={`${fmt(OUT_N)} invoices above the outlier fence (${fmt(Math.round(OUT_FENCE))})`} color={C.amber} p={prog(f, t(197.0), 10)} dark />
        <div dir="ltr" style={{position: 'absolute', left: 1040, top: 504, width: 460, padding: '10px 14px', borderRadius: 14, background: 'rgba(11,18,34,0.94)', border: `2px solid ${C.green}`, boxShadow: `0 0 ${26 * pulse}px ${C.green}77`, display: 'flex', alignItems: 'center', gap: 12, opacity: seal, transform: `scale(${0.8 + 0.2 * seal})`, transformOrigin: '0 50%', zIndex: 30}}>
          <svg width={54} height={54} viewBox="0 0 230 230"><circle cx={115} cy={115} r={104} fill="#10B98122" stroke={C.green} strokeWidth={9} /><polyline points="72,118 104,150 162,84" fill="none" stroke={C.green} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" /></svg>
          <div><div style={{fontFamily: MONO, fontWeight: 700, fontSize: 17, color: C.green}}>ENTERPRISE STATISTICAL SEAL</div><div style={{fontFamily: MONO, fontSize: 13, color: C.text}}>Mean · Median · Mode · Percentiles on 50,000 rows</div></div>
        </div>
        <Tag x={720} y={590} text="Reliable decisions start with the right statistic" color={C.green} p={prog(f, t(199.4), 10)} />
        <Pointer f={f} pts={PTS} clicks={CLICKS} hide={at(186.0)} />
      </Host63>
      <Caption text="Enterprise Statistical Engine ──► Execute Descriptive Statistics & Percentiles on 50,000 Rows" from={t(172.0)} to={t(190.0)} />
      <Caption text="Enterprise Statistical Seal ──► Mean, Median, Mode & Percentiles on 50,000 Rows" from={t(199.8)} to={t(207.5)} tone="ok" />
    </Stage>
  );
};
