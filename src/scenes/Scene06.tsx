import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Card, Scene, Tag, ease, fs, prog} from '../common';

const skills = ['INNER JOIN والتقاطع الرياضياتي', 'الصياغة الصريحة INNER JOIN ... ON', 'Table Aliases وحل غموض الأعمدة', 'Hash Join مقابل Nested Loop', 'الربط متعدد الجداول (4 جداول)'];

export const Scene06: React.FC = () => {
  const f = useCurrentFrame();
  const fill = ease(prog(f, 150, 430));
  const check = prog(f, 440, 480);
  const m = B.s6.main;
  const url = 'solutions.gomaaintelligence.me';

  return (
    <Scene dur={S.s6.dur} accent={C.green}>
      {/* ---------- achievement ---------- */}
      <Card box={m} accent={C.green} at={4}>
        <div style={{padding: '40px 52px', display: 'flex', flexDirection: 'column', gap: 0}}>
          <div style={{fontWeight: 900, fontSize: 64, color: C.text, direction: 'rtl', lineHeight: 1.2}}>منظومة أكاديمي</div>
          <div style={{fontFamily: mono, fontWeight: 700, fontSize: fs('Manzooma SQL Masterclass', 900, 34, mono), color: C.blue, direction: 'ltr', marginTop: 6}}>Manzooma SQL Masterclass</div>
          <div style={{fontWeight: 700, fontSize: 28, color: C.dim, direction: 'rtl', marginTop: 12}}>الوحدة الخامسة — دمج وربط الجداول</div>

          <div style={{marginTop: 36, display: 'flex', alignItems: 'center', gap: 24, direction: 'ltr', opacity: prog(f, 140, 180)}}>
            <svg width={84} height={84} viewBox="0 0 84 84" style={{flexShrink: 0}}>
              <circle cx={42} cy={42} r={37} fill="rgba(16,185,129,0.15)" stroke={C.green} strokeWidth={6} />
              <polyline points="23,43 37,57 62,28" fill="none" stroke={C.green} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={70} strokeDashoffset={70 * (1 - check)} />
            </svg>
            <div style={{fontFamily: mono, fontWeight: 700, color: C.green, lineHeight: 1.3, fontSize: fs('INNER JOIN & Relational Retrieval Mastered', 760, 34, mono)}}>
              Lesson 16 Completed:<br />INNER JOIN &amp; Relational Retrieval Mastered
            </div>
          </div>

          <div style={{marginTop: 34, direction: 'rtl', opacity: prog(f, 130, 170)}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span style={{fontWeight: 900, fontSize: 30, color: C.text}}>إنجاز الدرس 16</span>
              <span style={{fontFamily: mono, fontWeight: 700, fontSize: 32, color: C.green}}>{Math.round(fill * 100)}%</span>
            </div>
            <div style={{height: 26, background: 'rgba(100,116,139,0.35)', borderRadius: 13, marginTop: 12, direction: 'ltr', overflow: 'hidden'}}>
              <div style={{width: `${fill * 100}%`, height: '100%', background: `linear-gradient(90deg, ${C.blue}, ${C.green})`, borderRadius: 13}} />
            </div>
            <div style={{marginTop: 12, display: 'inline-block', fontFamily: mono, fontSize: 22, fontWeight: 700, color: C.blue, border: `2px solid ${C.blue}`, borderRadius: 999, padding: '4px 18px'}}>Relational Retrieval &amp; Joins Started</div>
          </div>

          <div style={{marginTop: 30, fontWeight: 900, fontSize: 28, color: C.dim, direction: 'rtl'}}>المهارات المكتسبة</div>
          <div style={{marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10}}>
            {skills.map((s, i) => (
              <div key={s} style={{display: 'flex', alignItems: 'center', gap: 14, direction: 'rtl', opacity: prog(f, 500 + i * 36, 530 + i * 36)}}>
                <svg width={30} height={30} viewBox="0 0 34 34" style={{flexShrink: 0}}><polyline points="6,18 14,26 28,8" fill="none" stroke={C.green} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span style={{fontWeight: 700, fontSize: 30, color: C.text}}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* ---------- next lesson ---------- */}
      <Card box={B.s6.next} accent={C.blue} at={300}>
        <div style={{padding: '34px 44px'}}>
          <div style={{fontWeight: 900, fontSize: 28, color: C.blue, direction: 'rtl'}}>الدرس القادم</div>
          <div style={{fontFamily: mono, fontWeight: 700, fontSize: 30, color: C.dim, direction: 'ltr', marginTop: 4}}>Lesson 17</div>
          <div style={{fontWeight: 900, fontSize: 42, color: C.text, direction: 'rtl', marginTop: 10, lineHeight: 1.25}}>الربط الخارجي اليساري واليميني</div>
          <div style={{fontFamily: mono, fontWeight: 700, fontSize: fs('LEFT & RIGHT JOIN', 670, 30, mono), color: C.blue, direction: 'ltr', marginTop: 6}}>LEFT &amp; RIGHT JOIN</div>
          <svg width={672} height={120} viewBox="0 0 672 120" style={{marginTop: 20}}>
            <circle cx={250} cy={60} r={52} fill="rgba(56,189,248,0.30)" stroke={C.blue} strokeWidth={4} />
            <circle cx={330} cy={60} r={52} fill="none" stroke={C.dim} strokeWidth={4} />
            <text x={200} y={68} textAnchor="middle" fontFamily={mono} fontSize={20} fontWeight={700} fill={C.text}>LEFT</text>
            <text x={380} y={68} textAnchor="middle" fontFamily={mono} fontSize={20} fontWeight={700} fill={C.dim}>RIGHT</text>
          </svg>
        </div>
      </Card>

      {/* ---------- resources ---------- */}
      <Card box={B.s6.res} accent={C.amber} at={360}>
        <div style={{padding: '34px 44px'}}>
          <div style={{fontWeight: 900, fontSize: 34, color: C.amber, direction: 'rtl'}}>الشيتات والتمارين</div>
          <div style={{fontWeight: 700, fontSize: 28, color: C.dim, direction: 'rtl', marginTop: 10, lineHeight: 1.5}}>سكريبتات الربط الداخلي المعتمدة + شيت التمارين التطبيقية على منصتنا التعليمية</div>
          <div style={{marginTop: 28, borderTop: `2px solid ${C.line}`, paddingTop: 24, direction: 'ltr', fontFamily: mono, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', fontSize: fs(url, 670, 34, mono)}}>{url}</div>
          <div style={{marginTop: 14}}><Tag color={C.green}>LINK ON SCREEN ✓</Tag></div>
        </div>
      </Card>
    </Scene>
  );
};
