import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, S} from '../theme';
import {mono} from '../fonts';
import {Scene, prog} from '../common';

const skills = ['TIMESTAMP vs TIMESTAMPTZ', 'التخزين الموحّد بصيغة UTC', 'AT TIME ZONE · EXTRACT · AGE', 'GROUP BY آمن زمنياً'];

const Glass: React.FC<{x: number; y: number; w: number; h: number; at: number; stroke?: string; children: React.ReactNode}> = ({x, y, w, h, at, stroke = 'rgba(148,163,184,0.35)', children}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f - at, fps, config: {damping: 16, stiffness: 110}});
  return (
    <div className="absolute" style={{left: x, top: y, width: w, height: h, background: 'linear-gradient(135deg, rgba(30,41,59,0.92), rgba(15,23,42,0.78))', border: `2px solid ${stroke}`, borderRadius: 28, opacity: Math.min(1, Math.max(0, p)), transform: `translateY(${(1 - Math.min(1, p)) * 50}px)`, padding: '34px 44px'}}>
      {children}
    </div>
  );
};

export const Scene06: React.FC = () => {
  const f = useCurrentFrame();
  const fill = prog(f, 150, 420);
  const check = prog(f, 430, 470);

  return (
    <Scene dur={S.s6.dur}>
      {/* LEFT: achievement card (x 100-1100, y 70-1010) */}
      <Glass x={100} y={70} w={1000} h={940} at={5} stroke={C.green}>
        <div style={{fontSize: 56, fontWeight: 900, color: C.text, direction: 'rtl', lineHeight: 1.25}}>منظومة أكاديمي</div>
        <div style={{fontSize: 30, fontWeight: 700, color: C.blue, fontFamily: mono, direction: 'ltr', marginTop: 4}}>Manzooma SQL Masterclass</div>
        <div style={{fontSize: 26, fontWeight: 700, color: C.dim, direction: 'rtl', marginTop: 14}}>الوحدة الثانية — أنواع البيانات والقيود البنيوية</div>

        {/* completed badge */}
        <div style={{marginTop: 34, display: 'flex', alignItems: 'center', gap: 20, direction: 'ltr', opacity: prog(f, 150, 180)}}>
          <svg width={74} height={74} viewBox="0 0 74 74">
            <circle cx={37} cy={37} r={33} fill="none" stroke={C.green} strokeWidth={6} />
            <polyline points="20,38 33,51 55,24" fill="none" stroke={C.green} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={60} strokeDashoffset={60 * (1 - check)} />
          </svg>
          <div style={{fontFamily: mono, fontSize: 28, fontWeight: 700, color: C.green, lineHeight: 1.35}}>Lesson 05 Completed:<br />TIMESTAMPTZ &amp; UTC Mastered</div>
        </div>

        {/* progress */}
        <div style={{marginTop: 36, direction: 'rtl', opacity: prog(f, 140, 170)}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 28, fontWeight: 700, color: C.text}}>
            <span>إنجاز الدرس 05</span>
            <span style={{fontFamily: mono, color: C.green}}>{Math.round(fill * 100)}%</span>
          </div>
          <div style={{height: 26, background: 'rgba(100,116,139,0.35)', borderRadius: 13, marginTop: 12, direction: 'ltr'}}>
            <div style={{width: `${fill * 100}%`, height: 26, background: C.green, borderRadius: 13}} />
          </div>
        </div>

        {/* skills */}
        <div style={{marginTop: 34, fontSize: 28, fontWeight: 900, color: C.dim, direction: 'rtl'}}>المهارات المكتسبة</div>
        <div style={{marginTop: 12, display: 'flex', flexDirection: 'column', gap: 14}}>
          {skills.map((s, i) => (
            <div key={s} style={{display: 'flex', alignItems: 'center', gap: 16, direction: 'rtl', opacity: prog(f, 480 + i * 40, 510 + i * 40)}}>
              <svg width={34} height={34} viewBox="0 0 34 34"><polyline points="6,18 14,26 28,8" fill="none" stroke={C.green} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span style={{fontSize: 32, fontWeight: 700, color: C.text}}>{s}</span>
            </div>
          ))}
        </div>
      </Glass>

      {/* RIGHT TOP: next lesson (x 1180-1820, y 70-520) */}
      <Glass x={1180} y={70} w={640} h={450} at={300} stroke={C.blue}>
        <div style={{fontSize: 28, fontWeight: 900, color: C.blue, direction: 'rtl'}}>الدرس القادم</div>
        <div style={{fontFamily: mono, fontSize: 30, fontWeight: 700, color: C.dim, direction: 'ltr', marginTop: 6}}>Lesson 06</div>
        <div style={{fontSize: 40, fontWeight: 900, color: C.text, direction: 'rtl', marginTop: 12, lineHeight: 1.3}}>السلامة المرجعية والمفاتيح</div>
        <div style={{fontFamily: mono, fontSize: 30, fontWeight: 700, color: C.blue, direction: 'ltr', marginTop: 6}}>Foreign Keys</div>
        {/* mini thumbnail: two tables linked by a key */}
        <svg width={552} height={120} viewBox="0 0 552 120" style={{marginTop: 18}}>
          <rect x={20} y={14} width={190} height={92} rx={12} fill="none" stroke={C.dim} strokeWidth={3} />
          <line x1={20} y1={44} x2={210} y2={44} stroke={C.dim} strokeWidth={3} />
          <rect x={342} y={14} width={190} height={92} rx={12} fill="none" stroke={C.blue} strokeWidth={3} />
          <line x1={342} y1={44} x2={532} y2={44} stroke={C.blue} strokeWidth={3} />
          <path d="M 210 76 L 342 76" stroke={C.blue} strokeWidth={4} strokeDasharray="8 8" />
          <circle cx={276} cy={76} r={13} fill={C.bg} stroke={C.amber} strokeWidth={4} />
          <text x={115} y={36} textAnchor="middle" fontSize={20} fill={C.dim} fontFamily={mono}>orders</text>
          <text x={437} y={36} textAnchor="middle" fontSize={20} fill={C.blue} fontFamily={mono}>customers</text>
        </svg>
      </Glass>

      {/* RIGHT BOTTOM: resources (x 1180-1820, y 560-1010) */}
      <Glass x={1180} y={560} w={640} h={450} at={360} stroke={C.amber}>
        <div style={{fontSize: 34, fontWeight: 900, color: C.amber, direction: 'rtl'}}>الشيتات والتمارين</div>
        <div style={{fontSize: 28, fontWeight: 700, color: C.dim, direction: 'rtl', marginTop: 10, lineHeight: 1.5}}>أوراق عمل تطبيقية + حلول الدرس على منصتنا التعليمية</div>
        <div style={{marginTop: 34, fontFamily: mono, fontSize: 25, fontWeight: 700, color: C.text, direction: 'ltr', borderTop: `2px solid ${C.line}`, paddingTop: 26, wordBreak: 'break-all'}}>
          solutions.gomaaintelligence.me
        </div>
        <div style={{marginTop: 18, fontSize: 26, fontWeight: 700, color: C.green, direction: 'rtl'}}>الرابط ظاهر على الشاشة ← نزّل الشيت دلوقتي</div>
      </Glass>
    </Scene>
  );
};
