// SC06 — Lesson 74 Completion · Manzooma Academy Outro (03:30-04:00).
import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Stage, TopBadge, Caption, Check, Mix} from '../kit';

const SC = {from: 6300, dur: 900};

export const Scene6: React.FC = () => {
  const local = useCurrentFrame();

  const cardP = interpolate(local, [0, 90], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const progressP = interpolate(local, [120, 420], [0, 0.974], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const nextP = interpolate(local, [420, 540], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sealP = interpolate(local, [540, 660], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const fadeOut = interpolate(local, [780, 900], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <Stage dur={SC.dur} inFx="fade" outFx="black">
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: cardP * fadeOut}}>
        <div style={{width: 1100, background: `linear-gradient(135deg, ${C.card}, ${C.deep})`, border: `2px solid ${C.border}`, borderRadius: 24, padding: 40, boxShadow: `0 40px 120px rgba(2,6,23,0.7), 0 0 60px ${C.green}22`, backdropFilter: 'blur(20px)'}}>
          {/* Header */}
          <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24}}>
            <div style={{width: 64, height: 64, borderRadius: 12, background: `linear-gradient(135deg, ${C.green}, ${C.blue})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <svg width="36" height="36" viewBox="0 0 36 36"><path d="M6 22 a4 4 0 0 1 1-7 a5 5 0 0 1 10 0 a3 3 0 0 1 -1 7 z" fill="none" stroke="#fff" strokeWidth="2" /><path d="M14 14 L18 18 L24 11" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
            </div>
            <div>
              <Mix style={{fontFamily: FONT, fontSize: 28, fontWeight: 700, color: C.text}}>{'منظومة أكاديمي'}</Mix>
              <div style={{fontFamily: MONO, fontSize: 14, color: C.muted, marginTop: 2}}>{'Manzooma Excel Masterclass Platform'}</div>
            </div>
            <div style={{marginLeft: 'auto', padding: '8px 16px', background: `${C.green}22`, border: `1px solid ${C.green}`, borderRadius: 999, fontFamily: MONO, fontSize: 13, color: C.green}}>{'Lesson 74 · Complete'}</div>
          </div>

          {/* Lesson title */}
          <div style={{textAlign: 'center', marginBottom: 24}}>
            <Mix style={{fontFamily: FONT, fontSize: 30, fontWeight: 700, color: C.text}}>{'Volatile Functions & Performance Impact'}</Mix>
            <Mix style={{fontFamily: FONT, fontSize: 18, color: C.muted, marginTop: 6, display: 'block'}}>{'الدوال المتغيرة وتأثيرها على الأداء'}</Mix>
          </div>

          {/* Progress */}
          <div style={{marginBottom: 24}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
              <span style={{fontFamily: FONT, fontSize: 14, color: C.muted}}>{'تقدم الكورس'}</span>
              <span style={{fontFamily: MONO, fontSize: 14, fontWeight: 700, color: C.green}}>{(progressP * 100).toFixed(1)}%</span>
            </div>
            <div style={{height: 14, background: C.deep, borderRadius: 7, overflow: 'hidden', border: `1px solid ${C.border}`}}>
              <div style={{width: `${progressP * 100}%`, height: '100%', background: `linear-gradient(90deg, ${C.blue}, ${C.green})`, boxShadow: `0 0 20px ${C.green}`}} />
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 8, fontFamily: MONO, fontSize: 12, color: C.muted}}>
              <span>{'الدرس 74 من 76'}</span>
              <span>{'الوحدة 14 من 14'}</span>
            </div>
          </div>

          {/* Next lesson card */}
          <div style={{background: C.deep, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18, marginBottom: 18, opacity: nextP, transform: `translateY(${(1 - nextP) * 16}px)`}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
              <div style={{width: 40, height: 40, borderRadius: 8, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: MONO, fontSize: 14, fontWeight: 700}}>75</div>
              <div style={{flex: 1}}>
                <Mix style={{fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.text}}>{'الدرس القادم: تحسين أداء ملفات Excel وإدارة الحسابات'}</Mix>
                <Mix style={{fontFamily: MONO, fontSize: 12, color: C.muted, marginTop: 2, display: 'block'}}>{'Performance Tuning & Calculation Management · الوحدة 14 من 14'}</Mix>
              </div>
              <svg width="24" height="24" viewBox="0 0 24 24"><path d="M5 12 H19 M13 6 L19 12 L13 18" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>

          {/* Resources */}
          <div style={{display: 'flex', gap: 14, alignItems: 'center'}}>
            <div style={{flex: 1, background: C.deep, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14}}>
              <div style={{fontFamily: FONT, fontSize: 12, color: C.muted, marginBottom: 4}}>{'الملفات والتدريبات'}</div>
              <Mix style={{fontFamily: MONO, fontSize: 16, color: C.blue, fontWeight: 700}}>{'solutions.gomaaintelligence.me'}</Mix>
            </div>
            <div style={{flex: 1, background: C.deep, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14}}>
              <div style={{fontFamily: FONT, fontSize: 12, color: C.muted, marginBottom: 4}}>{'الشيت التدريبي'}</div>
              <Mix style={{fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700}}>{'manzooma_sales_2026.xlsx'}</Mix>
            </div>
          </div>

          {/* Achievement seal */}
          <div style={{display: 'flex', justifyContent: 'center', marginTop: 24, opacity: sealP, transform: `scale(${0.7 + 0.3 * sealP})`}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '10px 22px', background: `linear-gradient(135deg, ${C.green}, ${C.blue})`, borderRadius: 999, boxShadow: `0 0 40px ${C.green}66`}}>
              <Check size={32} p={sealP} />
              <Mix style={{fontFamily: FONT, fontSize: 18, fontWeight: 700, color: '#fff'}}>{'Volatile Functions & Performance Impact Mastered'}</Mix>
            </div>
          </div>
        </div>
      </div>

      <Caption text="الدرس 74 من 76 ──► الوحدة 14 من 14 ──► Volatile Functions & Performance Impact Mastered" from={60} to={720} tone="ok" />
    </Stage>
  );
};
