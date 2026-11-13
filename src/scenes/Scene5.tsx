// SC05 — Enterprise Cloud Execution on 50,000 rows (02:50-03:30).
import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Stage, TopBadge, Caption, Check, Mix} from '../kit';
import {EXEC_STATS, POWER_AUTOMATE_TRIGGERS} from '../data';

const SC = {from: 5100, dur: 1200};

export const Scene5: React.FC = () => {
  const local = useCurrentFrame();

  // File load (0-120)
  const loadP = interpolate(local, [0, 120], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Script execution (120-360)
  const execP = interpolate(local, [120, 360], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Stats (360-720)
  const statP = (i: number) => interpolate(local, [360 + i * 60, 420 + i * 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Benchmark (720-900)
  const benchP = interpolate(local, [720, 900], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Seal (900-1200)
  const sealP = interpolate(local, [900, 1180], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const latency = (1 - benchP) * 8 + 1.8;
  const rowsProcessed = Math.floor(benchP * 50000);

  return (
    <Stage dur={SC.dur} inFx="left" outFx="up">
      <TopBadge text="Enterprise Cloud Pipeline ──► Process 50,000 SharePoint Rows via getUsedRange() & Bulk setValues()" from={60} to={630} color={C.green} />

      {/* File load banner */}
      {loadP < 1 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 200, display: 'flex', justifyContent: 'center', opacity: loadP}}>
          <div style={{background: C.card, border: `2px solid ${C.blue}`, borderRadius: 12, padding: '20px 40px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: `0 0 30px ${C.blue}44`}}>
            <svg width="40" height="40" viewBox="0 0 40 40">
              <path d="M4 14 a4 4 0 0 1 1-7 a5 5 0 0 1 10 0 a3 3 0 0 1 -1 7 z" fill="none" stroke={C.blue} strokeWidth="2.5" strokeLinejoin="round" />
            </svg>
            <div>
              <div style={{fontFamily: MONO, fontSize: 20, fontWeight: 700, color: C.text}}>{'manzooma_sales_2026.xlsx'}</div>
              <div style={{fontFamily: MONO, fontSize: 13, color: C.muted}}>{'loading from SharePoint · 50,000 rows'}</div>
            </div>
            <svg width="50" height="50" viewBox="0 0 50 50">
              <circle cx="25" cy="25" r="20" fill="none" stroke={C.border} strokeWidth="3" />
              <circle cx="25" cy="25" r="20" fill="none" stroke={C.blue} strokeWidth="3" strokeDasharray={`${loadP * 125.6} 125.6`} transform="rotate(-90 25 25)" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      )}

      {/* LEFT: Script execution pipeline */}
      <div style={{position: 'absolute', left: 80, top: 200, width: 1080, opacity: execP}}>
        <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 14}}>{'Cloud Script Pipeline · خطوات المعالجة'}</div>
        <div style={{background: C.card, border: `2px solid ${C.green}`, borderRadius: 12, padding: 18, boxShadow: `0 0 30px ${C.green}33`}}>
          {[
            {n: '01', l: 'قراءة النطاق الفعلي', ts: 'sheet.getUsedRange()', color: C.green, done: '50,000 rows captured'},
            {n: '02', l: 'سحب القيم كمصفوفة', ts: 'range.getValues()', color: C.purple, done: 'Bulk 2D array ready'},
            {n: '03', l: 'حساب صافي الأرباح', ts: 'profit = revenue - cost', color: C.amber, done: '50,000 calculations'},
            {n: '04', l: 'كتابة النتائج دفعة واحدة', ts: 'range.setValues(values)', color: C.purple, done: 'Single bulk write'},
            {n: '05', l: 'حفظ الملف بصيغة آمنة', ts: '.xlsx stays safe', color: C.green, done: 'No .xlsm risk'},
            {n: '06', l: 'مزامنة مع SharePoint', ts: 'auto-sync to cloud', color: C.blue, done: 'Team shares instantly'},
          ].map((step, i) => {
            const p = interpolate(local, [180 + i * 50, 220 + i * 50], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', opacity: p, borderBottom: i < 5 ? `1px solid ${C.border}` : 'none'}}>
                <div style={{width: 36, height: 36, borderRadius: 6, background: p > 0.5 ? step.color : C.deep, border: `1px solid ${step.color}`, color: p > 0.5 ? '#fff' : step.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 700}}>
                  {step.n}
                </div>
                <div style={{flex: 1}}>
                  <div style={{fontFamily: FONT, fontSize: 14, fontWeight: 600, color: C.text}}>{step.l}</div>
                  <div style={{fontFamily: MONO, fontSize: 11, color: C.muted}}>{step.ts}</div>
                </div>
                <div style={{padding: '4px 10px', background: p > 0.5 ? `${step.color}22` : C.deep, border: `1px solid ${step.color}`, borderRadius: 4, fontFamily: MONO, fontSize: 11, color: step.color, fontWeight: 700}}>
                  {p > 0.5 ? step.done : '...'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT: Stats + benchmark */}
      <div style={{position: 'absolute', left: 1200, top: 200, width: 640, opacity: execP}}>
        <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 14}}>{'Cloud Execution Stats'}</div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14}}>
          {EXEC_STATS.map((s, i) => {
            const p = statP(i);
            const displayValue = i === 0 && benchP > 0 ? rowsProcessed.toLocaleString() : s.v;
            return (
              <div key={i} style={{background: C.card, border: `2px solid ${s.color}`, borderRadius: 10, padding: 14, opacity: p, transform: `translateY(${(1 - p) * 16}px)`, boxShadow: `0 0 20px ${s.color}33`}}>
                <div style={{fontFamily: FONT, fontSize: 12, color: C.muted}}>{s.l}</div>
                <div style={{display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4}}>
                  <span style={{fontFamily: MONO, fontSize: 26, fontWeight: 700, color: s.color}}>{displayValue}</span>
                  <span style={{fontFamily: MONO, fontSize: 12, color: C.muted}}>{s.s}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Latency benchmark */}
        <div style={{background: C.card, border: `2px solid ${C.green}`, borderRadius: 12, padding: 18, boxShadow: `0 0 30px ${C.green}33`, opacity: benchP}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <div style={{position: 'relative', width: 100, height: 100}}>
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke={C.border} strokeWidth="6" />
                <circle cx="50" cy="50" r="42" fill="none" stroke={C.green} strokeWidth="6" strokeDasharray={`${benchP * 264} 264`} transform="rotate(-90 50 50)" strokeLinecap="round" />
              </svg>
              <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <span style={{fontFamily: MONO, fontSize: 20, fontWeight: 700, color: C.green}}>{latency.toFixed(1)}</span>
                <span style={{fontFamily: MONO, fontSize: 10, color: C.muted}}>ms</span>
              </div>
            </div>
            <div>
              <div style={{fontFamily: FONT, fontSize: 18, fontWeight: 700, color: C.text}}>{'Safe Cloud Execution'}</div>
              <div style={{fontFamily: FONT, fontSize: 12, color: C.muted, marginTop: 2}}>{'50,000 صف · .xlsx نظيف'}</div>
              <div style={{fontFamily: FONT, fontSize: 12, color: C.green, marginTop: 6, fontWeight: 700}}>{'✓ صفر تدخل بشري'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enterprise seal */}
      <div style={{position: 'absolute', left: 80, top: 880, right: 80, display: 'flex', justifyContent: 'center', opacity: sealP}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 30px', background: `linear-gradient(135deg, ${C.green}, ${C.blue})`, borderRadius: 12, boxShadow: `0 0 40px ${C.green}66`, transform: `scale(${0.85 + 0.15 * sealP})`}}>
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="22" fill="none" stroke="#fff" strokeWidth="2" />
            <circle cx="24" cy="24" r="18" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="3 3" />
            <path d="M14 24 L21 31 L34 17" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: '#fff'}}>{'Enterprise Cloud Automation Seal'}</div>
            <div style={{fontFamily: MONO, fontSize: 13, color: '#fff', opacity: 0.9}}>{'Office Scripts + Power Automate · Manzooma Verified'}</div>
          </div>
        </div>
      </div>

      <Caption text="Enterprise Cloud Pipeline ──► Process 50,000 SharePoint Rows via getUsedRange() & Bulk setValues()" from={60} to={630} tone="ok" />
      <Caption text="Safe .xlsx Cloud Execution ──► High-Speed Office Scripts Engine Completing in <2ms" from={660} to={1140} tone="ok" />
    </Stage>
  );
};
