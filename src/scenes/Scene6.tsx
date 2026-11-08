import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {C, LESSON, LOGO_FILE, MONO, SCENES, START, TOTAL_LESSONS, TOTAL_UNITS, UNIT} from '../theme';
import {Check, Mix, Stage, clamp, pop, prog, sec} from '../kit';

// SC06: Lesson 25 completion card — 25/76, Unit 5/14, next: Unpivoting & Data Normalization.
const S = START.s6;
const t = (g: number) => sec(g - S);

const SKILLS = [
  {a: 'تتبع المراجع والمسبقات', e: 'Trace Precedents & Dependents · Vector arrows visualize data flow', at: 212.5},
  {a: 'التقييم المباشر للمعادلات', e: 'Evaluate Formula · Step-by-step nested formula inspection', at: 213.7},
  {a: 'نافذة المراقبة Watch Window', e: 'Floating monitor for KPI cells across multiple sheets', at: 214.9},
  {a: 'تشخيص أخطاء 365', e: '#SPILL! (blocked) · #CALC! (empty) · #REF! (deleted) · #N/A', at: 216.1},
  {a: 'المعالجة الآمنة', e: 'Prefer IFNA over blind IFERROR · Avoid hiding structural bugs', at: 217.3},
];

export const Scene6: React.FC = () => {
  const f = useCurrentFrame();
  const card = prog(f, 0, 28);
  const head = prog(f, t(210.5), 22);
  const badge = pop(f, t(211));
  const fill = prog(f, t(212.5), sec(2.6)) * (LESSON / TOTAL_LESSONS);
  const res = prog(f, t(216), 20);
  const linkPulse = 0.5 + 0.5 * Math.sin(f * 0.18);
  const linkHot = prog(f, t(219), 10) * (1 - prog(f, t(222), 10));
  const next = prog(f, t(220), 22);
  const tag = pop(f, t(226));
  const idle = Math.sin(f * 0.05);
  const pct = Math.round((LESSON / TOTAL_LESSONS) * 100);

  return (
    <Stage dur={SCENES.s6.dur} inFx="none" outFx="black">
      <div style={{position: 'absolute', left: 100, top: 96, width: 1720, height: 880, borderRadius: 36, background: 'rgba(30,41,59,0.72)', border: `2px solid ${C.green}`, boxShadow: `0 50px 140px rgba(2,6,23,.8), 0 0 50px ${C.green}33`, opacity: card, transform: `translateY(${(1 - card) * 36}px)`}}>
        <div style={{position: 'absolute', left: 60, top: 36, display: 'flex', alignItems: 'center', gap: 24, opacity: head}}>
          <Img src={staticFile(LOGO_FILE)} style={{height: 104, width: 125}} />
          <div>
            <Mix style={{fontSize: 52, fontWeight: 700, color: C.text}}>منظومة أكاديمي</Mix>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 34, fontWeight: 700, color: C.green, marginTop: 2}}>Manzooma Excel Masterclass</div>
          </div>
        </div>

        <div dir="ltr" style={{position: 'absolute', left: 60, top: 176, display: 'flex', alignItems: 'center', gap: 18}}>
          <Check p={badge} size={64} />
          <div style={{fontFamily: MONO, fontSize: 24, fontWeight: 700, color: C.text, opacity: clamp(badge), lineHeight: 1.3}}>
            Lesson {String(LESSON).padStart(2, '0')} of {TOTAL_LESSONS} Completed:<br /><span style={{color: C.green}}>Formula Diagnostics Mastered (Unit {UNIT}/{TOTAL_UNITS})</span>
          </div>
        </div>

        <div dir="ltr" style={{position: 'absolute', left: 60, top: 282, width: 940, opacity: head}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 22, color: C.muted, marginBottom: 10}}>
            <span>Unit {UNIT} of {TOTAL_UNITS} · Data Quality &amp; Structural Cleaning</span><span style={{color: C.green, fontWeight: 700}}>{pct}% of course</span>
          </div>
          <div style={{height: 26, borderRadius: 13, background: C.deep, border: `2px solid ${C.border}`, overflow: 'hidden'}}>
            <div style={{width: `${(fill / (LESSON / TOTAL_LESSONS)) * 100}%`, minWidth: fill > 0 ? 8 : 0, height: '100%', background: `linear-gradient(90deg, ${C.blue}, ${C.green})`, borderRadius: 13, boxShadow: `0 0 16px ${C.green}`}} />
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 8, fontFamily: MONO, fontSize: 16, color: C.muted}}>
            <span>Lesson 25 · {pct}%</span><span>76 lessons total</span>
          </div>
        </div>

        <div style={{position: 'absolute', left: 60, top: 392, width: 940}}>
          {SKILLS.map((s, i) => {
            const p = prog(f, t(s.at), 16);
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 20, marginBottom: 22, opacity: p, transform: `translateX(${(1 - p) * -30}px)`}}>
                <Check p={clamp(p)} size={42} />
                <div>
                  <Mix style={{fontSize: 30, fontWeight: 600, color: C.text}}>{s.a}</Mix>
                  <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.muted, marginTop: 2}}>{s.e}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{position: 'absolute', left: 1060, top: 50, width: 600, opacity: res, transform: `translateY(${(1 - res) * 24}px)`}}>
          <div style={{borderRadius: 24, background: C.card, border: `2px solid ${linkHot > 0.1 ? C.green : C.border}`, padding: '26px 32px', boxShadow: linkHot > 0.1 ? `0 0 ${30 * linkPulse}px ${C.green}88` : 'none'}}>
            <Mix style={{fontSize: 30, fontWeight: 700, color: C.text}}>الملفات والتدريبات</Mix>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 26, fontWeight: 700, color: C.blue, marginTop: 14, wordBreak: 'break-all'}}>solutions.gomaaintelligence.me</div>
            <Mix style={{fontSize: 22, color: C.muted, display: 'block', marginTop: 10}}>نزّل manzooma_sales_2026.xlsx وطبّق Formula Auditing بنفسك</Mix>
          </div>
        </div>

        <div style={{position: 'absolute', left: 1060, top: 330, width: 600, opacity: next, transform: `translateY(${(1 - next) * 30}px)`}}>
          <div style={{borderRadius: 24, background: C.card, border: `2px solid ${C.blue}`, padding: '24px 30px', boxShadow: `0 0 0 6px ${C.blue}22`}}>
            <Mix style={{fontSize: 24, color: C.blue, fontWeight: 700}}>الدرس القادم · 26 من 76</Mix>
            <Mix style={{fontSize: 32, fontWeight: 700, color: C.text, display: 'block', marginTop: 6}}>تغيير هيكل البيانات غير المنتظمة</Mix>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, color: C.muted, marginTop: 8}}>Unpivoting &amp; Advanced Data Normalization</div>
            <svg width={540} height={120} viewBox="0 0 540 120" style={{marginTop: 16}}>
              <rect x={1} y={1} width={538} height={118} rx={10} fill="#fff" stroke="#334155" />
              {/* Unpivot visual: wide table → tall table */}
              <text x={30} y={35} fill="#242424" fontFamily="Consolas, monospace" fontSize={12} fontWeight={700}>Wide (pivoted):</text>
              <rect x={30} y={42} width={140} height={22} fill="rgba(245,158,11,0.2)" stroke={C.amber} strokeWidth={1.5} rx={3} />
              <rect x={170} y={42} width={60} height={22} fill="rgba(245,158,11,0.2)" stroke={C.amber} strokeWidth={1.5} rx={3} />
              <rect x={30} y={66} width={140} height={22} fill="rgba(245,158,11,0.2)" stroke={C.amber} strokeWidth={1.5} rx={3} />
              <rect x={170} y={66} width={60} height={22} fill="rgba(245,158,11,0.2)" stroke={C.amber} strokeWidth={1.5} rx={3} />
              {/* Arrow */}
              <path d="M260 60 L320 60" stroke={C.blue} strokeWidth={3} markerEnd="url(#ah25)" />
              <defs><marker id="ah25" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill={C.blue} /></marker></defs>
              {/* Tall (unpivoted) */}
              <text x={350} y={35} fill="#242424" fontFamily="Consolas, monospace" fontSize={12} fontWeight={700}>Tall (normalized):</text>
              <rect x={350} y={42} width={120} height={18} fill="rgba(16,185,129,0.2)" stroke={C.green} strokeWidth={1.5} rx={3} />
              <rect x={350} y={62} width={120} height={18} fill="rgba(16,185,129,0.2)" stroke={C.green} strokeWidth={1.5} rx={3} />
              <rect x={350} y={82} width={120} height={18} fill="rgba(16,185,129,0.2)" stroke={C.green} strokeWidth={1.5} rx={3} />
            </svg>
            <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: -8, transform: `scale(${0.8 + 0.2 * tag})`, opacity: clamp(tag)}}>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, fontWeight: 700, color: C.green, border: `2px solid ${C.green}`, borderRadius: 999, padding: '4px 16px', background: `${C.green}18`}}>UNPIVOT</div>
            </div>
          </div>
        </div>

        <div style={{position: 'absolute', left: 60, right: 60, bottom: 26, height: 3, background: C.border, opacity: 0.6}} />
        <div style={{position: 'absolute', left: 60 + 40 * idle + 40, bottom: 24, width: 120, height: 7, borderRadius: 4, background: C.green, opacity: 0.8}} />
      </div>
    </Stage>
  );
};
