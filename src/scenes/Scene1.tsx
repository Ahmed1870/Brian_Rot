// SC01 — Task Automation with Macro Recorder Engine (00:00-00:40).
import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Stage, TopBadge, Caption, Check, Mix} from '../kit';

const SC = {from: 0, dur: 1200};

export const Scene1: React.FC = () => {
  const local = useCurrentFrame();

  const chaosOp = interpolate(local, [0, 60, 540, 720], [0, 1, 1, 0]);
  const macroP = interpolate(local, [180, 540], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sealP = interpolate(local, [900, 1080], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // Manual steps on the left (the repetitive workflow)
  const manualSteps = [
    'افتح ملف التصدير الأسبوعي',
    'حدد صف الترويسة',
    'لوّن الخلفية يدوياً',
    'اضبط عرض كل عمود',
    'كرر لكل صف',
    'أضف معادلة الإجمالي',
    'كرر العملية كل أسبوع',
  ];

  return (
    <Stage dur={SC.dur} inFx="fade" outFx="left">
      <TopBadge text="الدرس 71 من 76 ──► بداية الوحدة 14 من 14 ──► Task Automation with Macro Recorder Engine" from={60} to={1140} color={C.blue} />

      {/* LEFT: Repetitive manual work */}
      <div style={{position: 'absolute', left: 80, top: 200, width: 760, height: 620, opacity: chaosOp}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14}}>
          <svg width="42" height="42" viewBox="0 0 42 42"><path d="M21 4 L38 36 H4 Z" fill="none" stroke={C.red} strokeWidth="3" strokeLinejoin="round" /><line x1="21" y1="16" x2="21" y2="26" stroke={C.red} strokeWidth="3" strokeLinecap="round" /><circle cx="21" cy="32" r="2" fill={C.red} /></svg>
          <div style={{fontFamily: FONT, fontSize: 28, fontWeight: 700, color: C.red}}>تكرار يدوي مرهق · ساعات كل أسبوع</div>
        </div>
        <div style={{position: 'relative', width: '100%', height: 560, background: C.card, border: `2px solid ${C.red}`, borderRadius: 12, overflow: 'hidden', boxShadow: `0 0 30px ${C.red}33`}}>
          {/* Clock */}
          <div style={{position: 'absolute', top: 16, right: 16, display: 'flex', alignItems: 'center', gap: 8, background: C.deep, padding: '8px 14px', borderRadius: 8, border: `1px solid ${C.red}`}}>
            <svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="7.5" fill="none" stroke={C.red} strokeWidth="1.5" /><path d="M9 4.5 V9 L12.5 11" fill="none" stroke={C.red} strokeWidth="1.5" strokeLinecap="round" /></svg>
            <span style={{fontFamily: MONO, fontSize: 14, color: C.red, fontWeight: 700}}>4h 30m / أسبوع</span>
          </div>
          {/* Manual steps list */}
          <div style={{padding: '20px 24px'}}>
            {manualSteps.map((step, i) => {
              const stepP = interpolate(local, [60 + i * 30, 90 + i * 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
              return (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', opacity: stepP, borderBottom: i < manualSteps.length - 1 ? `1px solid ${C.border}` : 'none'}}>
                  <div style={{width: 28, height: 28, borderRadius: 4, background: C.red, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 700}}>
                    {i + 1}
                  </div>
                  <span style={{fontFamily: FONT, fontSize: 16, color: C.text, flex: 1}}>{step}</span>
                  {i > 0 && (
                    <svg width="20" height="20" viewBox="0 0 20 20"><path d="M3 10 H15 M11 5 L16 10 L11 15" fill="none" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Arrow showing transformation */}
      <div style={{position: 'absolute', left: 840, top: 470, opacity: interpolate(local, [240, 360, 540], [0, 1, 0])}}>
        <svg width="80" height="60" viewBox="0 0 80 60">
          <path d="M5 30 L70 30 M55 15 L70 30 L55 45" fill="none" stroke={C.blue} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* RIGHT: Macro Recorder Engine */}
      <div style={{position: 'absolute', left: 920, top: 200, width: 920, height: 620, opacity: interpolate(local, [360, 540], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14}}>
          <div style={{width: 42, height: 42, borderRadius: 8, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${C.blue}`}}>
            <svg width="22" height="22" viewBox="0 0 22 22"><circle cx="11" cy="11" r="5" fill="none" stroke="#fff" strokeWidth="2" /><circle cx="11" cy="11" r="2" fill="#fff" /></svg>
          </div>
          <div style={{fontFamily: FONT, fontSize: 28, fontWeight: 700, color: C.blue}}>Macro Recorder · أتمتة فورية</div>
        </div>
        <div style={{position: 'relative', width: '100%', height: 560, background: C.card, border: `2px solid ${C.blue}`, borderRadius: 12, overflow: 'hidden', boxShadow: `0 0 40px ${C.blue}55`}}>
          {/* Macro recorder header */}
          <div style={{position: 'absolute', left: 0, top: 0, right: 0, height: 56, background: C.deep, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', padding: '0 20px', opacity: macroP}}>
            <div style={{width: 12, height: 12, borderRadius: 6, background: C.red, marginRight: 8, boxShadow: `0 0 8px ${C.red}`}} />
            <span style={{fontFamily: MONO, fontSize: 14, color: C.red, fontWeight: 700}}>REC</span>
            <span style={{fontFamily: FONT, fontSize: 16, color: C.text, marginLeft: 16}}>Recording: FormatWeeklyReport</span>
            <span style={{marginLeft: 'auto', fontFamily: MONO, fontSize: 12, color: C.muted}}>00:0{Math.min(9, Math.floor(local / 30))}</span>
          </div>

          {/* VBA code stream */}
          <div style={{position: 'absolute', left: 16, right: 16, top: 70, bottom: 100, background: C.deep, borderRadius: 8, border: `1px solid ${C.border}`, padding: 16, fontFamily: MONO, fontSize: 13, color: C.text, overflow: 'hidden', opacity: macroP}}>
            <div style={{color: C.muted, marginBottom: 8}}>{'— Macro Recorder Output —'}</div>
            {[
              'Sub FormatWeeklyReport()',
              '    Range("A1:F1").Select',
              '    Selection.Font.Bold = True',
              '    Selection.Interior.Color = RGB(16,124,65)',
              '    Columns.AutoFit',
              '    Range("G2").Formula = "=SUM(B2:F2)"',
              'End Sub',
            ].map((line, i) => {
              const lp = interpolate(local, [300 + i * 30, 330 + i * 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
              return (
                <div key={i} style={{opacity: lp, transform: `translateX(${(1 - lp) * 20}px)`, color: line.startsWith('Sub') || line.startsWith('End') ? C.blue : line.includes('Selection') ? C.green : line.includes('Range') ? C.amber : C.text}}>
                  <span style={{color: C.muted, marginRight: 8}}>{i + 1}</span>{line}
                </div>
              );
            })}
          </div>

          {/* One-click replay button */}
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 20, display: 'flex', justifyContent: 'center', opacity: macroP}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 12, background: C.blue, color: '#0B1222', padding: '14px 30px', borderRadius: 8, fontWeight: 700, fontFamily: FONT, fontSize: 18, boxShadow: `0 0 20px ${C.blue}66`}}>
              <svg width="22" height="22" viewBox="0 0 22 22"><polygon points="6,4 18,11 6,18" fill="#0B1222" /></svg>
              <span>تشغيل بضغطة واحدة · One-Click Replay</span>
            </div>
          </div>
        </div>
      </div>

      {/* Final seal */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 850, display: 'flex', justifyContent: 'center', opacity: sealP}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: C.card, border: `2px solid ${C.green}`, borderRadius: 999, padding: '12px 30px', boxShadow: `0 0 30px ${C.green}33`}}>
          <Check size={40} p={sealP} />
          <Mix style={{fontFamily: FONT, fontSize: 24, fontWeight: 700, color: C.green}}>Zero-Code Workflow Automation ──► Record Once, Replay in One Click</Mix>
        </div>
      </div>

      <Caption text="الدرس 71 من 76 ──► Task Automation with Macro Recorder Engine" from={60} to={540} tone="normal" />
      <Caption text="Zero-Code Workflow Automation ──► Record Repetitive Actions Once, Replay in One Click" from={660} to={1140} tone="ok" />
    </Stage>
  );
};
