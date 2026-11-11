import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {Caption, Mix, Stage, Menu, menuItemY, prog, sec, clamp, pop, KeyBadge, ExcelWindow, ExcelApp, CAM0, Check, ribbonItemBox, CellV} from '../kit';
import {RangeFx} from '../l7';
import {CL_ITEMS, FB, ImportDlg, PQEditor, Pointer, STEP_VIEW, Wp, impPos, menuOf, pqBtn} from '../lq';
import {Host, Panel} from '../l46';
import {sale} from '../data';

// SC05 anchors (s, abs): 172 caption | 177 file card | 182.4 count 50,000 | 185.6 steps | 188.9 Close&Load | 190 dialog | 191.2 OK | 191.6 load | 192.8 source +200 | 194.7 Ctrl+Alt+F5 | 195.5 totals update | 198 seal
const S = START.s5;
const t = (g: number) => sec(g - S);
const STEPS = ['Source', 'Navigation', 'Promoted Headers', 'Changed Type', 'Removed Blank Rows'];
const BR = ['Alexandria', 'Cairo', 'Giza', 'Mansoura', 'Tanta'];
const totals = (n: number) => { const m: Record<string, number> = {}; for (let i = 1; i <= n; i++) { const s = sale(i); m[s.branch] = (m[s.branch] ?? 0) + s.total; } return m; };
const T0 = totals(50000), T1 = totals(50200);
const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
const CL = pqBtn('closeLoad');
const CLM = {x: CL.x, y: 150, w: 190};
const clY = menuItemY(CLM.y, CL_ITEMS.map((l) => ({label: l})), 1);
const PTS: Wp[] = [
  {f: 0, x: 700, y: 500}, {f: t(188.5), x: CL.cx, y: CL.cy}, {f: t(188.9), x: CL.cx, y: CL.cy}, {f: t(189.4), x: CLM.x + 70, y: clY}, {f: t(189.6), x: CLM.x + 70, y: clY},
  {f: t(190.9), x: impPos.ok.x, y: impPos.ok.y}, {f: t(191.1), x: impPos.ok.x, y: impPos.ok.y},
];
const CLICKS = [188.9, 189.6, 191.1].map(t);
const colW5 = (c: number) => [0, 130, 130, 40][c] ?? 64;
const RF = ribbonItemBox('Data', 'RefreshAll');

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const pqOpen = 1 - prog(f, t(191.5), 10);
  const load = prog(f, t(191.5), 40);
  const refresh = at(194.7);
  const upd = prog(f, t(195.4), 30);
  const rows = Math.round(50000 + 200 * prog(f, t(195.0), 40));
  const T = (b: string) => T0[b] + (T1[b] - T0[b]) * (at(195.6) ? 1 : 0);
  const sumAll = BR.reduce((a, b) => a + T(b), 0);
  const cell = (r: number, c: number): CellV | undefined => {
    if (r === 1) return c === 1 ? {t: 'Row Labels', b: true, bg: '#DDEBF7'} : c === 2 ? {t: 'Sum of Total', b: true, bg: '#DDEBF7', al: 'r'} : undefined;
    if (r >= 2 && r <= 6) return c === 1 ? {t: BR[r - 2]} : c === 2 ? {t: fmt(T(BR[r - 2])), num: 1, al: 'r', bg: upd > 0.05 && upd < 0.95 ? '#D1FAE5' : undefined} : undefined;
    if (r === 7) return c === 1 ? {t: 'Grand Total', b: true, bg: '#F2F2F2'} : c === 2 ? {t: fmt(sumAll), b: true, num: 1, al: 'r', bg: '#F2F2F2'} : undefined;
    return undefined;
  };
  const spin = (f * 12) % 360;
  const cnt = Math.round(50000 * prog(f, t(182.4), 40));
  const card = prog(f, t(176.8), 14) * pqOpen;
  const flash: Record<number, number> = {};
  STEPS.forEach((_, i) => { const g = 185.6 + i * 0.5; if (at(g)) flash[i] = clamp(1 - (f - t(g)) / 40); });
  const dlg = prog(f, t(190.0), 10) * (1 - prog(f, t(191.3), 6));
  const menuOn = f >= t(188.9) && f < t(189.8);
  return (
    <Stage dur={SCENES.s5.dur} inFx="up" outFx="fade">
      {pqOpen < 0.99 ? (
        <Host tab="Data" cell={cell} sheets={['Sales Report']} sheet="Sales Report" colW={colW5} glow={C.green} ribbonHot={refresh && !at(197.6) ? 'RefreshAll' : undefined}>
          <div style={{position: 'absolute', left: 1236, top: 160, width: 300, height: 432, background: '#fff', borderLeft: '1px solid #C8C8C8', boxShadow: '-6px 0 18px rgba(0,0,0,.12)', fontFamily: 'sans-serif', zIndex: 10}}>
            <div style={{height: 28, borderBottom: '1px solid #E0E0E0', display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: 13, fontWeight: 700, color: '#1B1B1B'}}>Queries &amp; Connections</div>
            <div style={{display: 'flex', gap: 18, padding: '6px 12px', fontSize: 12, color: '#444', borderBottom: '1px solid #E0E0E0'}}><b style={{borderBottom: '2px solid #107C41'}}>Queries</b><span>Connections</span></div>
            <div style={{margin: 12, border: `2px solid ${at(195.0) && !at(197.4) ? C.blue : '#C8C8C8'}`, borderRadius: 6, padding: '10px 12px', boxShadow: refresh && !at(197.4) ? `0 0 16px ${C.blue}` : 'none'}}>
              <div style={{fontSize: 13, fontWeight: 700, color: '#1B1B1B'}}>Sales_Clean</div>
              <div style={{fontSize: 11.5, color: '#444', marginTop: 4}}>Connection only · Data Model</div>
              <div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 10}}>
                {load < 1 || (refresh && !at(197.4)) ? (
                  <svg width={16} height={16} viewBox="0 0 16 16" style={{transform: `rotate(${spin}deg)`}}><circle cx={8} cy={8} r={6} fill="none" stroke="#0F6CBD" strokeWidth={2.2} strokeDasharray="22 12" /></svg>
                ) : <span style={{color: '#107C41', fontWeight: 700}}>✓</span>}
                <span style={{fontSize: 12.5, color: '#1B1B1B'}}>{rows.toLocaleString('en-US')} rows loaded</span>
              </div>
              <div style={{height: 8, borderRadius: 4, background: '#E5E5E5', marginTop: 10, overflow: 'hidden'}}><div style={{width: `${(refresh && !at(197.4) ? clamp((f - t(194.7)) / 60) : load) * 100}%`, height: '100%', background: '#107C41'}} /></div>
            </div>
          </div>
          <RangeFx rect={{x: 44, y: 208, w: 260, h: 140}} color={C.green} p={upd * (1 - prog(f, t(199.0), 12)) * (at(195.6) ? 1 : 0)} fill={0.08} label="all reports updated" labelBelow />
        </Host>
      ) : null}
      {pqOpen > 0.01 ? (
        <div style={{position: 'absolute', inset: 0, opacity: pqOpen}}>
          <Host>
            <PQEditor open={1} view={STEP_VIEW(STEPS, 4)} steps={STEPS} sel={4} fb={FB['Removed Blank Rows']} query="Sales_Clean" flash={flash} status="5 COLUMNS, 999+ ROWS" srcCard={0}
              hotBtn={f >= t(188.5) && f < t(189.7) ? 'closeLoad' : undefined}>
              <div style={{position: 'absolute', left: 900, top: 200, width: 330, opacity: card, transform: `translateX(${(1 - card) * 30}px)`}}>
                <div style={{border: `2px solid ${C.green}`, borderRadius: 14, padding: '14px 18px', background: '#ECFDF5', fontFamily: MONO, color: '#0B1222'}}>
                  <div style={{fontSize: 13, fontWeight: 700, color: '#047857'}}>SOURCE · manzooma_sales_2026.xlsx</div>
                  <div style={{fontSize: 34, fontWeight: 700, marginTop: 6}}>{cnt.toLocaleString('en-US')}</div>
                  <div style={{fontSize: 14, color: '#334155'}}>rows × 5 columns</div>
                </div>
              </div>
              {menuOn ? <Menu x={CLM.x} y={CLM.y} w={CLM.w} items={menuOf(CL_ITEMS, f >= t(189.3) ? 'Close & Load To...' : '')} /> : null}
              <ImportDlg p={dlg} table={0} conn={1} dm={1} okHot={f >= t(190.9)} />
              <Pointer f={f} pts={PTS} clicks={CLICKS} hide={at(191.4)} />
            </PQEditor>
          </Host>
        </div>
      ) : null}
      <div style={{position: 'absolute', left: 620, top: 330, opacity: prog(f, t(192.8), 12) * (1 - prog(f, t(195.2), 12)), transform: `translateY(${(1 - prog(f, t(192.8), 12)) * 20}px)`, zIndex: 8}} dir="ltr">
        <div style={{borderRadius: 18, border: `2px solid ${C.blue}`, background: C.card, padding: '16px 26px', boxShadow: `0 0 30px ${C.blue}55`, fontFamily: MONO}}>
          <div style={{fontSize: 22, color: C.muted}}>manzooma_sales_2026.xlsx</div>
          <div style={{fontSize: 30, fontWeight: 700, color: C.green, marginTop: 6}}>+ 200 new rows at the source</div>
          {[0, 1, 2].map((i) => <div key={i} style={{height: 14, borderRadius: 4, background: `${C.green}55`, marginTop: 8, width: `${prog(f, t(193.0 + i * 0.35), 8) * 100}%`}} />)}
        </div>
      </div>
      {refresh ? <KeyBadge keys={['Ctrl', 'Alt', 'F5']} p={prog(f, t(194.7), 8) * (1 - prog(f, t(197.4), 10))} /> : null}
      <div dir="ltr" style={{position: 'absolute', left: 1330, top: 560, width: 420, padding: '10px 0 14px', borderRadius: 24, background: 'rgba(11,18,34,0.92)', border: `2px solid ${C.green}`, boxShadow: `0 0 40px ${C.green}66`, textAlign: 'center', opacity: pop(f, t(198.0)), transform: `scale(${0.7 + 0.3 * pop(f, t(198.0))})`, zIndex: 9}}>
        <svg width={150} height={150} viewBox="0 0 230 230"><circle cx={115} cy={115} r={104} fill="#10B98122" stroke={C.green} strokeWidth={6} /><circle cx={115} cy={115} r={86} fill="none" stroke={C.green} strokeWidth={2} strokeDasharray="6 6" /><polyline points="72,118 104,150 162,84" fill="none" stroke={C.green} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" /></svg>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 24, color: C.green, marginTop: -4}}>ENTERPRISE POWER QUERY</div>
        <div style={{fontFamily: MONO, fontSize: 19, color: C.text}}>50,000+ rows · one refresh</div>
      </div>
      <Caption text="Enterprise ETL Pipeline ──► Process & Clean 50,000 Sales Records Instantly" from={t(172.0)} to={t(190.0)} />
      <Caption text="Automated Refresh ──► One-Click Refresh Updates All Transformations" from={t(194.0)} to={t(208.0)} tone="ok" />
    </Stage>
  );
};
