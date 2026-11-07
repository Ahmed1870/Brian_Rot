import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC01 (0-40s): Career Readiness & Portfolio Concept — Course Finale
// Manzooma emblem → GitHub repo opens → green badge "Course Finale & Career Readiness Engine"
// Anchors: 1.0 welcome | 6.0 GitHub | 18.0 career readiness | 28.0 seal | 35.0 finale
const S = START.s1;
const t = (g: number) => sec(g - S);

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(1.5), 14));
  const repoP = pop(f, t(6));
  const badgeP = pop(f, t(14));
  const sealP = pop(f, t(28));
  const finaleP = pop(f, t(35));

  const pulse = 0.5 + 0.5 * Math.sin(f * 0.18);

  return (
    <Stage dur={1200} inFx="zoom" outFx="left">
      <TopBadge text="إعداد البورتفوليو والتحضير لمقابلات العمل | SQL Portfolio &amp; Career Readiness — Course Finale 🎓" from={sec(2)} to={sec(18)} color={C.green} />

      {/* LEFT: Intro code editor */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={680}
          h={300}
          title="portfolio_intro.sh · GitHub deployment (Lesson 68 Finale)"
          lines={[
            '-- Lesson 68 · Course Finale',
            '-- Portfolio & Career Readiness',
            '',
            '# Initialize portfolio repository',
            'git init Manzooma-Store-V2-Capstone',
            'cd Manzooma-Store-V2-Capstone',
            '',
            '# Professional structure',
            '# /schema  /queries  /benchmarks',
            '# /security  /docs  README.md',
            '',
            '# Deploy to GitHub',
            'git push origin main',
            '# → Career ready: SQL Data Analyst',
          ]}
          start={t(1.5)}
          cps={0.55}
          size={15}
          accent={C.green}
          hl={4}
          hlColor={C.blue}
        />
      </div>

      {/* Concept chips below editor */}
      <div style={{position: 'absolute', left: 80, top: 490, width: 680, opacity: clamp(lin(f, t(5), 14))}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.muted, marginBottom: 10}}>◆ Career readiness golden rule</div>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Chip color={C.blue} style={{fontSize: 16, padding: '4px 14px'}}>GitHub Portfolio</Chip>
          <Chip color={C.purple} style={{fontSize: 16, padding: '4px 14px'}}>Technical Interviews</Chip>
          <Chip color={C.amber} style={{fontSize: 16, padding: '4px 14px'}}>Think Aloud</Chip>
          <Chip color={C.green} style={{fontSize: 16, padding: '4px 14px'}}>100% Career Ready ✓</Chip>
          <Chip color={C.gold} style={{fontSize: 16, padding: '4px 14px'}}>Course Finale 🎓</Chip>
        </div>
      </div>

      {/* Course Finale seal panel */}
      <Win x={80} y={570} w={680} h={330} title="course finale engine ──► 68 lessons · 16 modules · 100% complete (green seal)" accent={C.green} opacity={clamp(lin(f, t(9), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, right: 18, fontFamily: MONO, fontSize: 14, color: C.green, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          68 lessons mastered · 16 modules complete · SQL Professional Certified
        </div>

        <div style={{position: 'absolute', right: 18, top: 38, display: 'flex', gap: 10}}>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>
            <Check p={finaleP} size={16} color={C.green} /> Finale
          </Chip>
        </div>

        <svg width={640} height={220} style={{position: 'absolute', left: 20, top: 70}}>
          {/* 16 modules journey bar */}
          <g style={{opacity: clamp(pop(f, t(9)))}}>
            <text x={320} y={20} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">Module journey · all 16 modules mastered · Course Complete</text>
            {Array.from({length: 16}, (_, i) => {
              const x = 20 + i * 38;
              return (
                <g key={i}>
                  <rect x={x} y={40} width={32} height={32} fill={`${C.green}22`} stroke={C.green} strokeWidth={2} rx={4} />
                  <text x={x + 16} y={60} fill={C.green} fontSize={9} fontFamily={MONO} fontWeight={700} textAnchor="middle">{i + 1}</text>
                </g>
              );
            })}
            <text x={320} y={95} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ All 16 modules · 68 lessons · SQL Professional</text>
          </g>

          {/* Bottom: career readiness */}
          <g style={{opacity: clamp(sealP)}}>
            <rect x={20} y={115} width={600} height={80} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 ${12 + pulse * 8}px ${C.green})`}} />
            <text x={320} y={145} fill={C.green} fontSize={16} fontFamily={MONO} fontWeight={700} textAnchor="middle">Course Finale &amp; Career Readiness Engine</text>
            <text x={320} y={168} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">GitHub Portfolio · Technical Interviews · 100% Career Ready</text>
            <text x={320} y={186} fill={C.gold} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">🎓 SQL From Zero to Professional — Certified</text>
          </g>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>68 lessons · 16 modules</span>
          <span>100% Complete 🎓</span>
        </div>
      </Win>

      {/* RIGHT: GitHub repository visualization */}
      <Win x={800} y={170} w={1040} h={720} title="github portfolio ──► Manzooma-Store-V2-Capstone · professional repository" accent={C.blue} opacity={clamp(lin(f, t(6), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, right: 18, fontFamily: MONO, fontSize: 16, color: C.blue, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          github.com/ahmed-sql-analyst/Manzooma-Store-V2-Capstone · 142 stars · 38 forks
        </div>

        <div style={{position: 'absolute', right: 18, top: 38, display: 'flex', gap: 10}}>
          <Chip color={C.blue} style={{fontSize: 13, padding: '4px 12px'}}>5 folders</Chip>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>{repoP > 0.5 ? 'live ✓' : '...'}</Chip>
        </div>

        <svg width={1000} height={610} style={{position: 'absolute', left: 20, top: 70}}>
          {/* Repository header */}
          <g style={{opacity: clamp(repoP)}}>
            <rect x={20} y={10} width={960} height={80} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 8px ${C.blue}66)`}} />
            <text x={60} y={40} fill={C.blue} fontSize={16} fontFamily={MONO} fontWeight={700}>Manzooma-Store-V2-Capstone</text>
            <text x={60} y={62} fill={C.muted} fontSize={11} fontFamily={MONO}>Enterprise PostgreSQL 16 capstone: 15-table schema, analytics pipeline, tuning, security &amp; backup</text>
            <text x={60} y={80} fill={C.amber} fontSize={10} fontFamily={MONO}>★ 142</text>
            <text x={130} y={80} fill={C.muted} fontSize={10} fontFamily={MONO}>⑂ 38 forks</text>
            <text x={220} y={80} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700}>● main branch</text>
          </g>

          {/* README.md preview (top-left) */}
          <g style={{opacity: clamp(pop(f, t(10)))}}>
            <rect x={20} y={110} width={460} height={220} fill={`${C.deep}cc`} stroke={C.blue} strokeWidth={2.5} rx={10} />
            <rect x={20} y={110} width={460} height={28} fill={C.blue} rx={10} />
            <text x={40} y={129} fill={C.bg} fontSize={12} fontFamily={MONO} fontWeight={700}>README.md</text>
            <text x={40} y={160} fill={C.blue} fontSize={14} fontFamily={MONO} fontWeight={700}># Manzooma Store V2 — Enterprise SQL Capstone</text>
            <text x={40} y={185} fill={C.text} fontSize={11} fontFamily={MONO}>## Business Problem</text>
            <text x={40} y={205} fill={C.muted} fontSize={10} fontFamily={MONO}>E-commerce analytics for millions of transactions</text>
            <text x={40} y={225} fill={C.text} fontSize={11} fontFamily={MONO}>## Data Architecture (ERD)</text>
            <text x={40} y={245} fill={C.muted} fontSize={10} fontFamily={MONO}>15 relational tables · 3NF normalized</text>
            <text x={40} y={265} fill={C.text} fontSize={11} fontFamily={MONO}>## Performance Benchmarks</text>
            <text x={40} y={285} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700}>Query: 10min → 0.4s (1500× speedup)</text>
            <text x={40} y={305} fill={C.text} fontSize={11} fontFamily={MONO}>## Security &amp; Backup</text>
            <text x={40} y={325} fill={C.muted} fontSize={10} fontFamily={MONO}>5 roles · 12 RLS · encrypted pg_dump</text>
          </g>

          {/* Folder structure (top-right) */}
          <g style={{opacity: clamp(pop(f, t(12)))}}>
            <rect x={500} y={110} width={480} height={220} fill={`${C.deep}cc`} stroke={C.purple} strokeWidth={2.5} rx={10} />
            <text x={520} y={135} fill={C.purple} fontSize={13} fontFamily={MONO} fontWeight={700}>📁 Repository Structure</text>
            {[
              {folder: '/schema', desc: 'DDL · constraints · ERD', color: C.blue, x: 520, y: 160},
              {folder: '/queries', desc: 'CTEs · window · MV', color: C.purple, x: 520, y: 185},
              {folder: '/benchmarks', desc: 'tuning · GIN/B-Tree', color: C.green, x: 520, y: 210},
              {folder: '/security', desc: 'roles · RLS · pg_dump', color: C.amber, x: 520, y: 235},
              {folder: '/docs', desc: 'README · ERD diagrams', color: C.blue, x: 520, y: 260},
            ].map((fld, i) => (
              <g key={i}>
                <text x={fld.x} y={fld.y} fill={fld.color} fontSize={11} fontFamily={MONO} fontWeight={700}>{fld.folder}</text>
                <text x={fld.x + 120} y={fld.y} fill={C.muted} fontSize={10} fontFamily={MONO}>{fld.desc}</text>
              </g>
            ))}
            <text x={520} y={295} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700}>✓ 35 files · 68 commits · professional documentation</text>
            <text x={520} y={315} fill={C.gold} fontSize={10} fontFamily={MONO}>🎓 Manzooma SQL Masterclass Certified</text>
          </g>

          {/* Career roles (bottom) */}
          <g style={{opacity: clamp(pop(f, t(18)))}}>
            <text x={500} y={360} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">Career-Ready Roles · 100% Prepared</text>
            {[
              {role: 'SQL Data Analyst', color: C.blue, x: 50},
              {role: 'Database Engineer', color: C.purple, x: 280},
              {role: 'Data Engineer', color: C.amber, x: 510},
              {role: 'BI Developer', color: C.green, x: 740},
            ].map((r, i) => {
              const p = clamp(pop(f, t(20 + i * 0.5)));
              return (
                <g key={i} style={{opacity: clamp(p), transform: `translate(0, ${(1 - p) * 20}px)`}}>
                  <rect x={r.x} y={380} width={200} height={60} fill={`${r.color}22`} stroke={r.color} strokeWidth={2.5} rx={10} style={{filter: `drop-shadow(0 0 6px ${r.color}66)`}} />
                  <text x={r.x + 100} y={410} fill={r.color} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">{r.role}</text>
                  <text x={r.x + 100} y={428} fill={C.green} fontSize={10} fontFamily={MONO} textAnchor="middle">✓ ready</text>
                </g>
              );
            })}
          </g>

          {/* Result banner */}
          {sealP > 0.5 ? (
            <g style={{opacity: clamp(pop(f, t(28)))}}>
              <rect x={150} y={470} width={700} height={50} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 12px ${C.green})`}} />
              <text x={500} y={500} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ Portfolio Sealed · GitHub live · 100% career ready · SQL Professional Certified 🎓</text>
            </g>
          ) : null}

          {/* Status text */}
          <text x={500} y={555} fill={C.muted} fontSize={12} fontFamily={MONO} textAnchor="middle">
            {f < t(6) ? 'preparing portfolio repository...' :
              f < t(28) ? 'deploying to GitHub · documenting architecture...' :
              '✓ portfolio live · career ready · course complete'}
          </text>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.blue}}>GitHub repo</span>
          <span style={{color: C.green}}>100% career ready 🎓</span>
        </div>
      </Win>

      {/* Seal badge bottom-left */}
      <div style={{position: 'absolute', left: 80, top: 920, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={sealP} size={36} color={C.green} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Portfolio · Sealed ✓</div>
        </div>
      </div>

      {/* Finale chip bottom-right */}
      <div style={{position: 'absolute', right: 80, top: 920, opacity: clamp(finaleP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.gold}`, borderRadius: 14, background: `${C.gold}0d`}}>
          <Check p={finaleP} size={36} color={C.gold} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.gold, fontWeight: 700}}>Course Finale 🎓</div>
        </div>
      </div>

      <Caption text="GitHub portfolio ──► README ──► ERD ──► benchmarks ──► technical interviews ──► career ready ──► 100% 🎓" from={t(20)} to={sec(38)} tone="ok" />
    </Stage>
  );
};
