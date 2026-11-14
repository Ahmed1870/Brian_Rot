// SC06 — 100% Graduation & Certification CTA (03:30-04:00).
import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Stage, TopBadge, Caption, Check, Mix} from '../kit';

const SC = {from: 6300, dur: 900};

export const Scene6: React.FC = () => {
  const local = useCurrentFrame();

  const cardP = interpolate(local, [0, 90], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const progressP = interpolate(local, [120, 420], [0, 1.0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const certP = interpolate(local, [420, 540], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sealP = interpolate(local, [540, 660], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const fadeOut = interpolate(local, [780, 900], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <Stage dur={SC.dur} inFx="fade" outFx="black">
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: cardP * fadeOut}}>
        <div style={{width: 1100, background: `linear-gradient(135deg, ${C.card}, ${C.deep})`, border: `2px solid ${C.gold}`, borderRadius: 24, padding: 40, boxShadow: `0 40px 120px rgba(2,6,23,0.7), 0 0 80px ${C.gold}33`, backdropFilter: 'blur(20px)'}}>
          {/* Header */}
          <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24}}>
            <div style={{width: 64, height: 64, borderRadius: 12, background: `linear-gradient(135deg, ${C.gold}, ${C.amber})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <svg width="36" height="36" viewBox="0 0 36 36"><path d="M18 4 L24 14 L18 24 L12 14 Z" fill="none" stroke="#0B1222" strokeWidth="2" /><path d="M18 24 V32" stroke="#0B1222" strokeWidth="2" /></svg>
            </div>
            <div>
              <Mix style={{fontFamily: FONT, fontSize: 28, fontWeight: 700, color: C.gold}}>{'منظومة أكاديمي'}</Mix>
              <div style={{fontFamily: MONO, fontSize: 14, color: C.muted, marginTop: 2}}>{'Manzooma Excel Masterclass — Graduation Milestone'}</div>
            </div>
            <div style={{marginLeft: 'auto', padding: '8px 16px', background: `${C.gold}22`, border: `1px solid ${C.gold}`, borderRadius: 999, fontFamily: MONO, fontSize: 13, color: C.gold, fontWeight: 700}}>{'100% COMPLETE'}</div>
          </div>

          {/* Graduation title */}
          <div style={{textAlign: 'center', marginBottom: 24}}>
            <Mix style={{fontFamily: FONT, fontSize: 32, fontWeight: 700, color: C.text}}>{'ألف مبروك التخرج!'}</Mix>
            <Mix style={{fontFamily: FONT, fontSize: 18, color: C.gold, marginTop: 6, display: 'block'}}>{'Enterprise Capstone Project Mastered'}</Mix>
          </div>

          {/* Progress (100%) */}
          <div style={{marginBottom: 24}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
              <span style={{fontFamily: FONT, fontSize: 14, color: C.muted}}>{'تقدم الكورس'}</span>
              <span style={{fontFamily: MONO, fontSize: 14, fontWeight: 700, color: C.gold}}>{(progressP * 100).toFixed(0)}%</span>
            </div>
            <div style={{height: 16, background: C.deep, borderRadius: 8, overflow: 'hidden', border: `1px solid ${C.border}`}}>
              <div style={{width: `${progressP * 100}%`, height: '100%', background: `linear-gradient(90deg, ${C.blue}, ${C.green}, ${C.gold})`, boxShadow: `0 0 20px ${C.gold}`}} />
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 8, fontFamily: MONO, fontSize: 12, color: C.muted}}>
              <span>{'76 من 76 درساً ✓'}</span>
              <span>{'14 من 14 وحدة ✓'}</span>
            </div>
          </div>

          {/* Certification card */}
          <div style={{background: `linear-gradient(135deg, ${C.deep}, ${C.card})`, border: `2px solid ${C.gold}`, borderRadius: 12, padding: 22, marginBottom: 18, opacity: certP, transform: `translateY(${(1 - certP) * 16}px)`, boxShadow: `0 0 30px ${C.gold}33`}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10}}>
              <div style={{width: 56, height: 56, borderRadius: 12, background: `linear-gradient(135deg, ${C.gold}, ${C.amber})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${C.gold}66`}}>
                <svg width="32" height="32" viewBox="0 0 32 32"><rect x="6" y="4" width="20" height="24" rx="2" fill="none" stroke="#0B1222" strokeWidth="2" /><path d="M10 10 H22 M10 14 H22 M10 18 H18 M14 22 L17 25 L22 20" fill="none" stroke="#0B1222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div style={{flex: 1}}>
                <Mix style={{fontFamily: FONT, fontSize: 18, fontWeight: 700, color: C.text}}>{'شهادة محلل بيانات محترف في Excel 365'}</Mix>
                <Mix style={{fontFamily: MONO, fontSize: 13, color: C.gold, marginTop: 2, display: 'block'}}>{'Manzooma Certified Excel Data Analyst'}</Mix>
              </div>
            </div>
            <div style={{fontFamily: FONT, fontSize: 14, color: C.muted, marginTop: 6}}>{'ارفع مشروعك النهائي على المنصة لاستلام شهادتك المعتمدة'}</div>
          </div>

          {/* Resources */}
          <div style={{display: 'flex', gap: 14, alignItems: 'center'}}>
            <div style={{flex: 1, background: C.deep, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14}}>
              <div style={{fontFamily: FONT, fontSize: 12, color: C.muted, marginBottom: 4}}>{'ملفات المشروع والتسليم'}</div>
              <Mix style={{fontFamily: MONO, fontSize: 16, color: C.blue, fontWeight: 700}}>{'solutions.gomaaintelligence.me'}</Mix>
            </div>
            <div style={{flex: 1, background: C.deep, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14}}>
              <div style={{fontFamily: FONT, fontSize: 12, color: C.muted, marginBottom: 4}}>{'ملف المشروع'}</div>
              <Mix style={{fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700}}>{'manzooma_sales_2026.xlsx'}</Mix>
            </div>
          </div>

          {/* Graduation seal */}
          <div style={{display: 'flex', justifyContent: 'center', marginTop: 24, opacity: sealP, transform: `scale(${0.7 + 0.3 * sealP})`}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 30px', background: `linear-gradient(135deg, ${C.gold}, ${C.green})`, borderRadius: 999, boxShadow: `0 0 50px ${C.gold}88`}}>
              <Check size={36} p={sealP} />
              <Mix style={{fontFamily: FONT, fontSize: 20, fontWeight: 700, color: '#fff'}}>{'Excel From Zero to Professional · Course Completed 100%'}</Mix>
            </div>
          </div>
        </div>
      </div>

      <Caption text="تم الإنجاز 100% ──► 76 من 76 درساً | 14 من 14 وحدة (Enterprise Capstone Mastered)" from={60} to={720} tone="ok" />
    </Stage>
  );
};
