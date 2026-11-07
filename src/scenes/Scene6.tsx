import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Check, Chip, Mix, Sql, Stage, clamp, pop, prog, sec, typed} from '../kit';

// SC06 (210-240s): Manzooma Academy outro — Module 16 at 75% (Performance, Security &amp; Backup Mastered)
// Skills: shared_buffers ✓, work_mem ✓, GRANT/REVOKE ✓, CREATE ROLE ✓, RLS ✓, pg_dump ✓, WAL ✓, pg_hba.conf ✓
// Next lesson 68: SQL Data Analyst Portfolio &amp; Career Readiness (Course Finale)
// Anchors: 211.0 excellent | 213.5 skills | 220.0 next lesson | 225.0 finale preview | 230.0 75% complete
const S = START.s6;
const t = (g: number) => sec(g - S);

const SKILLS = [
  'shared_buffers ✓',
  'work_mem tuning ✓',
  'GRANT / REVOKE ✓',
  'CREATE ROLE ✓',
  'Row-Level Security ✓',
  'pg_dump / pg_restore ✓',
  'WAL crash recovery ✓',
  'pg_hba.conf auth ✓',
];

export const Scene6: React.FC = () => {
  const f = useCurrentFrame();
  const card = prog(f, 0, 30);
  const head = prog(f, t(211), 24);
  const badge = pop(f, t(211.6));
  const fill = prog(f, t(212.2), sec(4.8));
  const modStart = prog(f, t(213.5), 20);
  const res = prog(f, t(215), 24);
  const next = prog(f, t(220), 28);
  const code = typed(
    "-- Lesson 68 · Course Finale · SQL Data Analyst Portfolio\n-- Build your professional portfolio:\n-- 1. GitHub repository with capstone project\n-- 2. README.md with SQL schema + analytics queries\n-- 3. LinkedIn headline: 'SQL Data Analyst · Manzooma Certified'\n-- 4. Resume bullets: 'Optimized queries by 60%, secured 15-table schema'\n-- 5. Interview prep: window functions, normalization, indexes, RLS\n-- You are now production-ready. Congratulations! 🎓",
    f,
    t(225),
    0.42,
  ).split('\n');
  const pct = Math.round(fill * 75); // 75% — Module 16 three-quarters (Lesson 3 of N in Module 16)

  return (
    <Stage dur={900} inFx="fade" outFx="black">
      <div style={{position: 'absolute', left: 190, top: 100, width: 1540, height: 880, borderRadius: 34, background: 'rgba(30,41,59,0.62)', border: `2px solid ${C.border}`, boxShadow: '0 40px 120px rgba(2,6,23,.7)', opacity: card, transform: `translateY(${(1 - card) * 40}px)`}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 46, textAlign: 'center', opacity: head, transform: `translateY(${(1 - head) * 20}px)`}}>
          <div style={{display: 'inline-flex', alignItems: 'center', gap: 22}}>
            <svg width={70} height={70} viewBox="0 0 70 70">
              <line x1={14} y1={52} x2={35} y2={16} stroke={C.blue} strokeWidth={5} />
              <line x1={35} y1={16} x2={56} y2={52} stroke={C.green} strokeWidth={5} />
              <line x1={14} y1={52} x2={56} y2={52} stroke={C.amber} strokeWidth={5} />
              <circle cx={14} cy={52} r={9} fill={C.blue} />
              <circle cx={35} cy={16} r={9} fill={C.text} />
              <circle cx={56} cy={52} r={9} fill={C.green} />
            </svg>
            <Mix style={{fontSize: 62, fontWeight: 700, color: C.text}}>منظومة أكاديمي</Mix>
            <span style={{fontFamily: MONO, fontSize: 40, color: C.muted}}>|</span>
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 40, fontWeight: 700, color: C.blue}}>Manzooma SQL Masterclass</span>
          </div>
        </div>

        <div dir="ltr" style={{position: 'absolute', left: 90, right: 90, top: 170}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20, transform: `scale(${0.9 + 0.1 * badge})`, transformOrigin: 'left center', opacity: clamp(badge)}}>
            <Check p={badge} size={64} />
            <div style={{fontFamily: MONO, fontSize: 24, fontWeight: 700, color: C.green}}>
              Lesson 67 Completed: <span style={{color: C.text}}>Performance Tuning, Security &amp; Backup/Restore (shared_buffers, work_mem, maintenance_work_mem, GRANT/REVOKE, CREATE ROLE, Row-Level Security, CREATE POLICY, pg_dump, pg_restore, Write-Ahead Logging, pg_hba.conf, pg_roles, Module 16 75% Capstone Seal) Mastered</span>
            </div>
          </div>
          <div style={{marginTop: 30, display: 'flex', alignItems: 'center', gap: 28}}>
            <div style={{flex: 1, height: 28, borderRadius: 14, background: C.deep, overflow: 'hidden', border: `2px solid ${C.green}`}}>
              <div style={{width: `${fill * 75}%`, height: '100%', background: `linear-gradient(90deg, ${C.blue}, ${C.green})`, borderRadius: 14, boxShadow: `0 0 12px ${C.green}`}} />
            </div>
            <div style={{fontFamily: MONO, fontSize: 36, fontWeight: 700, color: C.green, width: 130, textAlign: 'right'}}>{pct}%</div>
          </div>
          <div style={{marginTop: 12, fontFamily: MONO, fontSize: 22, color: modStart > 0.5 ? C.green : C.muted}}>
            Module 16 · Capstone Project &amp; Portfolio — {modStart > 0.5 ? 'IN PROGRESS · Lesson 3 of Module 16 · Memory Tuning, RBAC + RLS, pg_dump/pg_restore, WAL Crash Recovery, pg_hba.conf Authentication' : 'in progress'}
          </div>
        </div>

        <div dir="ltr" style={{position: 'absolute', left: 90, top: 364, display: 'flex', gap: 12, flexWrap: 'wrap', maxWidth: 1540}}>
          {SKILLS.map((s, i) => {
            const p = pop(f, t(214 + i * 0.3));
            const color = i < 2 ? C.blue : i < 5 ? C.purple : i < 7 ? C.amber : C.green;
            return (
              <div key={s} style={{opacity: clamp(p), transform: `translateY(${(1 - clamp(p)) * 18}px)`}}>
                <Chip color={color} style={{fontSize: 16}}>{s}</Chip>
              </div>
            );
          })}
        </div>

        <div dir="ltr" style={{position: 'absolute', left: 90, top: 470, opacity: res, transform: `translateY(${(1 - res) * 24}px)`}}>
          <Chip color={C.amber} style={{fontSize: 28, padding: '10px 26px'}}>
            <Mix>الشيتات والتمارين</Mix> <span style={{color: C.text}}>→ solutions.gomaaintelligence.me</span>
          </Chip>
        </div>

        <div style={{position: 'absolute', left: 90, right: 90, top: 540, height: 310, borderRadius: 26, background: C.deep, border: `2px solid ${C.green}`, opacity: next, transform: `translateY(${(1 - next) * 60}px)`, display: 'flex', alignItems: 'center', padding: '0 46px', gap: 40}}>
          <div style={{flex: 1}}>
            <Mix style={{fontSize: 30, color: C.green, fontWeight: 700, display: 'block'}}>الدرس القادم · 68 · ختام المسار 🎓</Mix>
            <Mix style={{fontSize: 26, fontWeight: 700, color: C.text, display: 'block', marginTop: 10, lineHeight: 1.3}}>إعداد البورتفوليو الاحترافي والتحضير لمقابلات العمل — SQL Data Analyst Portfolio &amp; Career Readiness [Course Finale]</Mix>
          </div>
          <div dir="ltr" style={{width: 600, height: 250, borderRadius: 18, background: C.bg, border: `2px solid ${C.border}`, padding: '18px 24px', fontFamily: MONO, fontSize: 11, color: C.text}}>
            <div style={{color: '#64748B', fontSize: 13, marginBottom: 8}}>-- Lesson 68 · Course Finale · SQL Data Analyst Portfolio</div>
            {code.map((l, i) => (
              <div key={i} style={{whiteSpace: 'pre', minHeight: 16}}>
                <Sql text={l} />
                {i === code.length - 1 ? <span style={{color: C.green}}>▌</span> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Stage>
  );
};
