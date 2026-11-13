// SC04 — Report Connections & UI Lockdown (02:10–02:50).
import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Stage, TopBadge, Caption, Check} from '../kit';

const SC = {from: 3900, dur: 1200};

const SLICERS = ['القاهرة', 'الإسكندرية', 'الجيزة', 'المنصورة', 'طنطا', 'أسيوط'];
const YEARS = ['2024', '2025', '2026'];
const PIVOTS = [
  {n: 'PivotTable 1', label: 'مبيعات الفروع', checked: true},
  {n: 'PivotTable 2', label: 'اتجاه شهري', checked: true},
  {n: 'PivotChart 1', label: 'رسم حصة الفئات', checked: true},
  {n: 'PivotChart 2', label: 'رسم اتجاه المبيعات', checked: true},
  {n: 'PivotTable 3', label: 'تفاصيل المعاملات', checked: false},
];

const LOCK_ITEMS = [
  {label: 'Gridlines', desc: 'خطوط الشبكة', check: false, from: 480},
  {label: 'Headings', desc: 'عناوين الأعمدة', check: false, from: 520},
  {label: 'Formula Bar', desc: 'شريط الصيغة', check: false, from: 560},
];

export const Scene4: React.FC = () => {
  const local = useCurrentFrame();

  // Phase 1: Report Connections dialog (3900→4350)
  const dlgP = interpolate(local, [0, 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const checkP = (i: number) => interpolate(local, [60 + i * 50, 90 + i * 50], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Phase 2: UI Lockdown (4350→5100)
  const lockPhase = interpolate(local, [450, 540], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const chartPropP = interpolate(local, [840, 960], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const finalSeal = interpolate(local, [1080, 1180], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <Stage dur={SC.dur} inFx="left" outFx="left">
      <TopBadge text="Cross-Chart Interactivity ──► Report Connections + Multi-Column Slicers" from={60} to={540} color={C.amber} />

      {/* LEFT: Slicer + Report Connections dialog */}
      <div style={{position: 'absolute', left: 80, top: 180, width: 880, height: 700}}>
        <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 14}}>Report Connections · ربط السلايسر بكل المخططات</div>

        {/* Multi-column slicer */}
        <div style={{background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, marginBottom: 14}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10}}>
            <svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 3 H14 L9 9 V13 L7 14 V9 Z" fill="none" stroke={C.amber} strokeWidth="1.5" /></svg>
            <span style={{fontFamily: FONT, fontSize: 14, fontWeight: 700, color: C.text}}>Slicer · الفروع (6 أعمدة)</span>
            <span style={{marginLeft: 'auto', fontFamily: MONO, fontSize: 11, color: C.muted}}>Columns = 6 · Hide items with no data ✓</span>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6}}>
            {SLICERS.map((s, i) => {
              const sel = i < 4;
              return (
                <div key={i} style={{padding: '8px 10px', background: sel ? C.amber : C.deep, color: sel ? '#0B1222' : C.muted, borderRadius: 4, textAlign: 'center', fontFamily: FONT, fontSize: 13, fontWeight: 600, border: `1px solid ${sel ? C.amber : C.border}`}}>
                  {s}
                </div>
              );
            })}
          </div>
        </div>

        {/* Year slicer (Timeline) */}
        <div style={{background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, marginBottom: 14}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10}}>
            <svg width="16" height="16" viewBox="0 0 16 16"><rect x="2" y="3" width="12" height="11" rx="1" fill="none" stroke={C.amber} strokeWidth="1.5" /><line x1="2" y1="6" x2="14" y2="6" stroke={C.amber} strokeWidth="1.5" /><line x1="5" y1="1" x2="5" y2="5" stroke={C.amber} strokeWidth="1.5" /><line x1="11" y1="1" x2="11" y2="5" stroke={C.amber} strokeWidth="1.5" /></svg>
            <span style={{fontFamily: FONT, fontSize: 14, fontWeight: 700, color: C.text}}>Timeline · السنوات</span>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6}}>
            {YEARS.map((y, i) => {
              const sel = y === '2026';
              return (
                <div key={i} style={{padding: '8px 10px', background: sel ? C.amber : C.deep, color: sel ? '#0B1222' : C.muted, borderRadius: 4, textAlign: 'center', fontFamily: MONO, fontSize: 14, fontWeight: 700, border: `1px solid ${sel ? C.amber : C.border}`}}>
                  {y}
                </div>
              );
            })}
          </div>
        </div>

        {/* Report Connections dialog */}
        <div style={{position: 'relative', background: C.card, border: `2px solid ${C.amber}`, borderRadius: 10, padding: 16, boxShadow: `0 0 30px ${C.amber}44`, opacity: dlgP}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12}}>
            <div style={{fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.text}}>Report Connections</div>
            <button style={{background: 'transparent', border: 'none', color: C.muted, fontSize: 18, cursor: 'pointer'}}>✕</button>
          </div>
          <div style={{fontFamily: FONT, fontSize: 12, color: C.muted, marginBottom: 8}}>اختر الجداول المحورية والمخططات المرتبطة بالسلايسر:</div>
          <div>
            {PIVOTS.map((p, i) => {
              const cp = checkP(i);
              return (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 12, padding: '8px 10px', borderBottom: i < PIVOTS.length - 1 ? `1px solid ${C.border}` : 'none'}}>
                  <div style={{width: 18, height: 18, borderRadius: 3, border: `2px solid ${p.checked ? C.amber : C.muted}`, background: cp > 0.5 && p.checked ? C.amber : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: cp}}>
                    {cp > 0.5 && p.checked && (
                      <svg width="14" height="14" viewBox="0 0 14 14"><polyline points="3,8 6,11 11,4" fill="none" stroke="#0B1222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    )}
                  </div>
                  <div style={{fontFamily: MONO, fontSize: 12, color: C.muted, minWidth: 110}}>{p.n}</div>
                  <div style={{fontFamily: FONT, fontSize: 14, color: C.text}}>{p.label}</div>
                  {cp > 0.5 && p.checked && <span style={{marginLeft: 'auto', fontFamily: MONO, fontSize: 11, color: C.amber}}>linked ✓</span>}
                </div>
              );
            })}
          </div>
          <div style={{display: 'flex', gap: 10, marginTop: 14}}>
            <button style={{background: C.amber, color: '#0B1222', border: 'none', padding: '8px 24px', borderRadius: 6, fontFamily: FONT, fontSize: 14, fontWeight: 700, cursor: 'pointer'}}>OK</button>
            <button style={{background: 'transparent', color: C.muted, border: `1px solid ${C.border}`, padding: '8px 24px', borderRadius: 6, fontFamily: FONT, fontSize: 14}}>Cancel</button>
            <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, opacity: checkP(3)}}>
              <span style={{fontFamily: MONO, fontSize: 11, color: C.green}}>4/5 linked</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: View tab + chart properties */}
      <div style={{position: 'absolute', left: 1000, top: 180, width: 840, height: 700}}>
        <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 14}}>Executive UI Lockdown · View → Hide</div>

        {/* Excel View tab mock */}
        <div style={{background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, marginBottom: 14}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${C.border}`}}>
            <div style={{padding: '4px 12px', background: C.amber, color: '#0B1222', borderRadius: 4, fontFamily: FONT, fontSize: 12, fontWeight: 700}}>View</div>
            <span style={{fontFamily: FONT, fontSize: 13, color: C.muted}}>→ Show group</span>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10}}>
            {LOCK_ITEMS.map((item, i) => {
              const cp = interpolate(local, [item.from, item.from + 30], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
              return (
                <div key={i} style={{background: C.deep, border: `1px solid ${C.border}`, borderRadius: 6, padding: 10, display: 'flex', alignItems: 'center', gap: 10}}>
                  <div style={{width: 18, height: 18, borderRadius: 3, border: `2px solid ${cp > 0.5 ? C.amber : C.green}`, background: cp > 0.5 ? C.amber : C.deep, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    {cp > 0.5 ? (
                      <svg width="12" height="12" viewBox="0 0 12 12"><polyline points="3,7 5,9 9,4" fill="none" stroke="#0B1222" strokeWidth="2" /></svg>
                    ) : (
                      <svg width="10" height="10" viewBox="0 0 10 10"><line x1="2" y1="2" x2="8" y2="8" stroke={C.green} strokeWidth="2" /><line x1="8" y1="2" x2="2" y2="8" stroke={C.green} strokeWidth="2" /></svg>
                    )}
                  </div>
                  <div>
                    <div style={{fontFamily: FONT, fontSize: 13, fontWeight: 600, color: C.text}}>{item.label}</div>
                    <div style={{fontFamily: MONO, fontSize: 10, color: C.muted}}>{item.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart properties panel */}
        <div style={{background: C.card, border: `2px solid ${C.amber}`, borderRadius: 10, padding: 16, boxShadow: `0 0 20px ${C.amber}33`, opacity: chartPropP}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12}}>
            <span style={{fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.text}}>Format Chart Area → Properties</span>
          </div>
          <div style={{display: 'flex', gap: 14}}>
            <div style={{flex: 1, background: C.deep, borderRadius: 6, padding: 12}}>
              <div style={{fontFamily: FONT, fontSize: 12, color: C.muted, marginBottom: 8}}>Object positioning</div>
              {[
                {l: 'Move and size with cells', sel: false},
                {l: 'Move but don\'t size with cells', sel: false},
                {l: "Don't move or size with cells", sel: true},
              ].map((o, i) => {
                const cp = interpolate(local, [540 + i * 30, 570 + i * 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
                return (
                  <div key={i} style={{display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', opacity: cp}}>
                    <div style={{width: 14, height: 14, borderRadius: 7, border: `2px solid ${o.sel ? C.amber : C.muted}`, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      {o.sel && <div style={{width: 6, height: 6, borderRadius: 3, background: C.amber}} />}
                    </div>
                    <span style={{fontFamily: FONT, fontSize: 13, color: o.sel ? C.amber : C.muted, fontWeight: o.sel ? 700 : 400}}>{o.l}</span>
                  </div>
                );
              })}
            </div>
            <div style={{width: 180, background: C.deep, borderRadius: 6, padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                <rect x="6" y="6" width="68" height="68" rx="4" fill="none" stroke={C.amber} strokeWidth="2" />
                <rect x="14" y="44" width="14" height="22" fill={C.amber} />
                <rect x="33" y="30" width="14" height="36" fill={C.amber} />
                <rect x="52" y="20" width="14" height="46" fill={C.amber} />
                <line x1="6" y1="68" x2="74" y2="68" stroke={C.muted} strokeWidth="1" />
              </svg>
              <div style={{fontFamily: MONO, fontSize: 11, color: C.muted, marginTop: 6}}>chart_area</div>
              <div style={{marginTop: 6, padding: '3px 10px', background: C.green, color: '#0B1222', borderRadius: 4, fontFamily: MONO, fontSize: 10, fontWeight: 700, opacity: chartPropP}}>LOCKED ✓</div>
            </div>
          </div>
        </div>

        {/* Final summary */}
        <div style={{marginTop: 14, background: C.card, border: `2px solid ${C.green}`, borderRadius: 8, padding: 14, opacity: finalSeal}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
            <Check size={36} p={finalSeal} />
            <div>
              <div style={{fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.green}}>UI Lockdown Complete</div>
              <div style={{fontFamily: FONT, fontSize: 13, color: C.muted, marginTop: 2}}>Gridlines hidden · Formula Bar off · Chart dimensions locked</div>
            </div>
          </div>
        </div>
      </div>

      <Caption text="Cross-Chart Interactivity ──► Report Connections + Multi-Column Slicers (Hide Empty Items)" from={60} to={540} tone="normal" />
      <Caption text="Executive UI Lockdown ──► Hide Gridlines & Set Don't Move or Size with Cells" from={660} to={1140} tone="normal" />
    </Stage>
  );
};
