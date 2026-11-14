// SC04 — Stage 3: Executive Dashboard & One-Click VBA PDF Export (02:10-02:50).
import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Stage, TopBadge, Caption, Check} from '../kit';
import {KPIS} from '../data';

const SC = {from: 3900, dur: 1200};

const Spark: React.FC<{data: number[]; color: string}> = ({data, color}) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const r = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 80},${20 - ((v - min) / r) * 16 - 2}`).join(' ');
  return <svg width="80" height="20"><polyline points={pts} fill="none" stroke={color} strokeWidth="2" /></svg>;
};

export const Scene4: React.FC = () => {
  const local = useCurrentFrame();

  // Dashboard reveal (0-540)
  const dashP = interpolate(local, [0, 360], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const kpiP = (i: number) => interpolate(local, [60 + i * 60, 120 + i * 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // One-click PDF export (540-900)
  const pdfP = interpolate(local, [540, 720], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const exportP = interpolate(local, [720, 900], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Final seal
  const finalSeal = interpolate(local, [1020, 1140], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const sparkData = [3, 5, 4, 7, 6, 9, 11, 10, 13, 15];

  return (
    <Stage dur={SC.dur} inFx="left" outFx="left">
      <TopBadge text="Stage 3: Executive Dashboard UX ──► Custom KPI Cards, Dynamic Charts, Slicers & Timeline" from={60} to={540} color={C.amber} />

      {/* LEFT: Executive Dashboard */}
      <div style={{position: 'absolute', left: 80, top: 180, width: 1080, height: 680, opacity: dashP}}>
        <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 14}}>{'Executive Dashboard'}</div>

        <div style={{background: C.card, border: `2px solid ${C.amber}`, borderRadius: 12, padding: 18, height: 580, boxShadow: `0 0 30px ${C.amber}33`}}>
          {/* Title bar */}
          <div style={{display: 'flex', alignItems: 'center', padding: '10px 14px', background: C.deep, borderRadius: 8, marginBottom: 14}}>
            <div style={{width: 28, height: 28, borderRadius: 6, background: C.amber, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 10}}>
              <svg width="16" height="16" viewBox="0 0 16 16"><rect x="2" y="2" width="5" height="5" fill="#0B1222" /><rect x="9" y="2" width="5" height="5" fill="#0B1222" opacity="0.8" /><rect x="2" y="9" width="5" height="5" fill="#0B1222" opacity="0.8" /><rect x="9" y="9" width="5" height="5" fill="#0B1222" /></svg>
            </div>
            <span style={{fontFamily: FONT, fontSize: 18, fontWeight: 700, color: C.text}}>{'منظومة ستور · Executive Sales Dashboard'}</span>
            {/* Slicers */}
            <div style={{marginLeft: 'auto', display: 'flex', gap: 6}}>
              {['Branch', 'Year', 'Product'].map((s, i) => (
                <div key={i} style={{padding: '4px 10px', background: C.bg, border: `1px solid ${C.amber}`, borderRadius: 4, fontFamily: FONT, fontSize: 11, color: C.amber}}>{s}</div>
              ))}
            </div>
          </div>

          {/* KPI Cards row */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 14}}>
            {KPIS.map((k, i) => {
              const p = kpiP(i);
              return (
                <div key={i} style={{opacity: p, transform: `translateY(${(1 - p) * 16}px)`, padding: 14, background: C.deep, border: `1px solid ${k.c}`, borderRadius: 8, borderLeft: `4px solid ${k.c}`}}>
                  <div style={{fontFamily: FONT, fontSize: 11, color: C.muted}}>{k.l}</div>
                  <div style={{fontFamily: MONO, fontSize: 24, fontWeight: 700, color: k.c, marginTop: 2}}>{k.v}</div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 4}}>
                    <span style={{fontFamily: MONO, fontSize: 11, color: k.up ? C.green : C.red, fontWeight: 700}}>{k.up ? '▲' : '▼'} {k.d}</span>
                    <Spark data={sparkData} color={k.c} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts area */}
          <div style={{display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 12, height: 240}}>
            {/* Trend chart */}
            <div style={{background: C.deep, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12}}>
              <div style={{fontFamily: FONT, fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 8}}>{'اتجاه المبيعات الشهري'}</div>
              <svg width="100%" height="180" viewBox="0 0 600 180" preserveAspectRatio="none">
                <polyline points="20,140 70,120 120,135 170,90 220,70 270,80 320,50 370,60 420,75 470,45 520,30 570,20" fill="none" stroke={C.amber} strokeWidth="2.5" />
                <polyline points="20,140 70,120 120,135 170,90 220,70 270,80 320,50 370,60 420,75 470,45 520,30 570,20 570,175 20,175" fill={C.amber} fillOpacity="0.15" stroke="none" />
              </svg>
            </div>
            {/* Branch bars */}
            <div style={{background: C.deep, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12}}>
              <div style={{fontFamily: FONT, fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 8}}>{'حصة الفروع'}</div>
              <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                {[80, 60, 50, 30, 20, 15].map((v, i) => (
                  <div key={i} style={{display: 'flex', alignItems: 'center', gap: 8}}>
                    <div style={{width: 30, fontFamily: MONO, fontSize: 10, color: C.muted}}>{'B' + (i + 1)}</div>
                    <div style={{flex: 1, height: 12, background: C.bg, borderRadius: 3, overflow: 'hidden'}}>
                      <div style={{width: `${v}%`, height: '100%', background: C.green}} />
                    </div>
                    <div style={{width: 30, fontFamily: MONO, fontSize: 10, color: C.text, textAlign: 'right'}}>{v}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div style={{marginTop: 12, display: 'flex', alignItems: 'center', gap: 12, padding: '8px 14px', background: C.deep, border: `1px solid ${C.border}`, borderRadius: 8}}>
            <svg width="20" height="20" viewBox="0 0 20 20"><rect x="2" y="3" width="16" height="14" rx="1" fill="none" stroke={C.amber} strokeWidth="1.5" /><line x1="2" y1="7" x2="18" y2="7" stroke={C.amber} strokeWidth="1.5" /></svg>
            <span style={{fontFamily: FONT, fontSize: 13, color: C.amber, fontWeight: 700}}>{'Timeline · 2026'}</span>
            <div style={{flex: 1, display: 'flex', gap: 4}}>
              {Array.from({length: 12}).map((_, i) => (
                <div key={i} style={{flex: 1, height: 16, background: i === 11 ? C.amber : C.bg, border: `1px solid ${i === 11 ? C.amber : C.border}`, borderRadius: 2}} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: One-click VBA PDF Export */}
      <div style={{position: 'absolute', right: 80, top: 180, width: 640, height: 680, opacity: pdfP}}>
        <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 14}}>{'One-Click Automation'}</div>

        <div style={{background: C.card, border: `2px solid ${C.amber}`, borderRadius: 12, padding: 22, height: 580, boxShadow: `0 0 30px ${C.amber}33`}}>
          {/* Check Performance */}
          <div style={{marginBottom: 18}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10}}>
              <div style={{width: 36, height: 36, borderRadius: 6, background: C.amber, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <svg width="18" height="18" viewBox="0 0 18 18"><path d="M3 9 L7 13 L15 5" fill="none" stroke="#0B1222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div>
                <div style={{fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.amber}}>{'Check Performance'}</div>
                <div style={{fontFamily: MONO, fontSize: 11, color: C.muted}}>{'Review → Optimize Sheet'}</div>
              </div>
            </div>
            <div style={{fontFamily: FONT, fontSize: 13, color: C.muted}}>{'ينظف التنسيقات الشبحية ويحسّن الذاكرة'}</div>
          </div>

          {/* VBA code preview */}
          <div style={{padding: 14, background: C.deep, border: `1px solid ${C.amber}`, borderRadius: 8, marginBottom: 18, fontFamily: MONO, fontSize: 12, lineHeight: 1.8}}>
            <div style={{color: C.muted, marginBottom: 4}}>{'— VBA Export Script —'}</div>
            <div style={{color: C.blue}}>{'Sub ExportExecutivePDF()'}</div>
            <div style={{color: C.green}}>{'  Application.ScreenUpdating = False'}</div>
            <div style={{color: C.amber}}>{'  ActiveSheet.ExportAsFixedFormat _'}</div>
            <div style={{color: C.amber, paddingLeft: 12}}>{'Type:=xlTypePDF, _'}</div>
            <div style={{color: C.amber, paddingLeft: 12}}>{'Filename:="Executive_Report.pdf"'}</div>
            <div style={{color: C.green}}>{'  Application.ScreenUpdating = True'}</div>
            <div style={{color: C.blue}}>{'End Sub'}</div>
          </div>

          {/* Export button */}
          <div style={{padding: 18, background: `linear-gradient(135deg, ${C.amber}, ${C.gold})`, borderRadius: 12, textAlign: 'center', boxShadow: `0 0 30px ${C.amber}66`, opacity: exportP, transform: `scale(${0.9 + 0.1 * exportP})`}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12}}>
              <svg width="32" height="32" viewBox="0 0 32 32"><path d="M16 4 V20 M8 12 L16 20 L24 12" fill="none" stroke="#0B1222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 24 V28 H28 V24" fill="none" stroke="#0B1222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <div>
                <div style={{fontFamily: FONT, fontSize: 18, fontWeight: 700, color: '#0B1222'}}>{'Refresh & Export Executive PDF'}</div>
                <div style={{fontFamily: MONO, fontSize: 12, color: '#0B1222', opacity: 0.7}}>{'one-click · boardroom ready'}</div>
              </div>
            </div>
          </div>

          {/* PDF result */}
          {exportP > 0.5 && (
            <div style={{marginTop: 18, padding: 12, background: C.deep, border: `1px solid ${C.green}`, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10, opacity: exportP}}>
              <svg width="32" height="32" viewBox="0 0 32 32"><rect x="6" y="3" width="20" height="26" rx="1" fill="none" stroke={C.green} strokeWidth="2" /><path d="M10 10 H22 M10 14 H22 M10 18 H18" stroke={C.green} strokeWidth="1.5" /></svg>
              <div>
                <div style={{fontFamily: MONO, fontSize: 14, fontWeight: 700, color: C.green}}>{'Executive_Report.pdf ✓'}</div>
                <div style={{fontFamily: FONT, fontSize: 11, color: C.muted}}>{'auto-exported · sealed'}</div>
              </div>
              <Check size={24} p={exportP} />
            </div>
          )}
        </div>
      </div>

      {/* Final seal */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 870, display: 'flex', justifyContent: 'center', opacity: finalSeal}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: C.card, border: `2px solid ${C.amber}`, borderRadius: 999, padding: '12px 30px', boxShadow: `0 0 30px ${C.amber}33`}}>
          <Check size={40} p={finalSeal} color={C.amber} />
          <span style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.amber}}>{'One-Click Automation ──► Check Performance + VBA Refresh + PDF Export'}</span>
        </div>
      </div>

      <Caption text="Stage 3: Executive Dashboard UX ──► Custom KPI Cards, Dynamic Charts, Slicers & Timeline" from={60} to={540} tone="normal" />
      <Caption text="One-Click Automation & Hygiene ──► Check Performance + Optimized VBA Refresh & PDF Export Button" from={660} to={1140} tone="normal" />
    </Stage>
  );
};
