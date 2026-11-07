import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {CAREER_READINESS} from '../data';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC05 (170-210s): Enterprise Deployment & Career Readiness Capstone
// git push origin main → GitHub live → 100% career readiness seal
// Anchors: 171.0 Manzooma Store V2 | 175.0 git push | 180.0 GitHub live | 190.0 career ready | 200.0 Module 16 100%
const S = START.s5;
const t = (g: number) => sec(g - S);

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(171), 14));
  const pushP = pop(f, t(171));
  const liveP = pop(f, t(180));
  const readyP = pop(f, t(190));
  const sealP = pop(f, t(200));

  const pulse = 0.5 + 0.5 * Math.sin(f * 0.17);
  // Git push progress
  const pushProg = clamp(lin(f, t(175), sec(8)));

  return (
    <Stage dur={1200} inFx="morph" outFx="fade">
      <TopBadge text="التطبيقات العملية النهائية | git push · Career Readiness · Module 16 100% Complete 🎓" from={sec(2)} to={sec(38)} color={C.green} />

      {/* LEFT: Git push deployment code editor */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={860}
          h={460}
          title="deploy_portfolio.sh · git push · Manzooma Store V2 Capstone"
          lines={[
            '# Lesson 68 · Final Deployment',
            '',
            '# Step 1: Finalize documentation',
            'echo "# Manzooma Store V2 Capstone" > README.md',
            'git add -A',
            'git commit -m "feat: complete capstone - 15 tables, analytics, tuning, security"',
            '',
            '# Step 2: Push to GitHub',
            'git push origin main',
            '',
            '# Result:',
            '# → 35 files deployed',
            '# → 68 commits',
            '# → 142 stars · 38 forks',
            '# → 100% career ready',
            '# → SQL Professional Certified 🎓',
          ]}
          start={t(171)}
          cps={0.5}
          size={14}
          accent={C.green}
          hl={8}
          hlColor={C.amber}
        />
      </div>

      {/* Concept chips below editor */}
      <div style={{position: 'absolute', left: 80, top: 645, width: 860, opacity: clamp(pushP)}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.muted, marginBottom: 8}}>◆ Module 16 capstone — 100% complete · course finale</div>
        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
          <Chip color={C.amber} style={{fontSize: 14, padding: '4px 12px'}}>git push origin main</Chip>
          <Chip color={C.blue} style={{fontSize: 14, padding: '4px 12px'}}>35 files · 68 commits</Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>10min → 0.4s (1500×)</Chip>
          <Chip color={C.purple} style={{fontSize: 14, padding: '4px 12px'}}>5 roles · 12 RLS</Chip>
          <Chip color={C.gold} style={{fontSize: 14, padding: '4px 12px'}}>100% Career Ready 🎓</Chip>
        </div>
      </div>

      {/* Module 16 100% + Course Complete Seal */}
      <Win x={80} y={725} w={860} h={220} title="course complete seal ──► Module 16 · 100% · 68 lessons · SQL Professional 🎓" accent={C.green} opacity={clamp(sealP)}>
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '0 22px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <Check p={sealP} size={64} color={C.gold} />
            <div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 26, color: C.gold, fontWeight: 700}}>🎓 Course Complete · 100% Mastered</div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginTop: 4}}>Module 16 · Capstone Project &amp; Portfolio · 68 lessons · 16 modules · SQL From Zero to Professional — Certified</div>
            </div>
          </div>
          {/* Progress bar at 100% */}
          <div style={{width: '100%', height: 18, borderRadius: 9, background: C.deep, overflow: 'hidden', border: `2px solid ${C.green}`}}>
            <div style={{width: `${1.0 * sealP * 100}%`, height: '100%', background: `linear-gradient(90deg, ${C.blue}, ${C.green}, ${C.gold})`, borderRadius: 9, boxShadow: `0 0 ${10 + pulse * 6}px ${C.green}`}} />
          </div>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.green, fontWeight: 700}}>Manzooma-Store-V2-Capstone · live on GitHub · 100% career ready · SQL Professional Certified 🎓</div>
        </div>
      </Win>

      {/* RIGHT: GitHub deployment dashboard */}
      <Win x={960} y={170} w={880} h={780} title="github deployment dashboard ──► career readiness · 100% complete" accent={C.green} opacity={clamp(lin(f, t(175), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, right: 18, fontFamily: MONO, fontSize: 16, color: C.green, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          Manzooma Store V2 · deployed to GitHub · 100% career ready · SQL Professional
        </div>

        <div style={{position: 'absolute', right: 18, top: 38, display: 'flex', gap: 8}}>
          <Chip color={C.amber} style={{fontSize: 12, padding: '4px 10px'}}>{pushProg > 0.05 && pushProg < 0.99 ? 'pushing...' : 'idle'}</Chip>
          <Chip color={C.green} style={{fontSize: 12, padding: '4px 10px'}}>{pushProg > 0.95 ? 'live ✓' : `${Math.floor(pushProg * 35)}/35`}</Chip>
        </div>

        <svg width={840} height={680} style={{position: 'absolute', left: 18, top: 70}}>
          {/* Git push flow (top) */}
          <g style={{opacity: clamp(pushP)}}>
            <text x={420} y={15} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">Git Push Pipeline · Local → GitHub</text>
            {/* Local repo */}
            <rect x={20} y={30} width={160} height={50} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={2.5} rx={8} />
            <text x={100} y={52} fill={C.amber} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">Local repo</text>
            <text x={100} y={68} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">35 files · 68 commits</text>

            {/* Arrow */}
            <line x1={180} y1={55} x2={240} y2={55} stroke={C.green} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="234,49 234,61 248,55" fill={C.green} />
            <text x={210} y={45} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">git push</text>

            {/* Git push node */}
            <rect x={250} y={30} width={200} height={50} fill={`${C.green}33`} stroke={C.green} strokeWidth={3} rx={8} style={{filter: `drop-shadow(0 0 6px ${C.green}66)`}} />
            <text x={350} y={52} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">git push origin main</text>
            <text x={350} y={68} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">deploying to GitHub...</text>

            {/* Arrow to GitHub */}
            <line x1={450} y1={55} x2={510} y2={55} stroke={C.green} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="504,49 504,61 518,55" fill={C.green} />

            {/* GitHub */}
            <rect x={520} y={30} width={180} height={50} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={2.5} rx={8} />
            <text x={610} y={52} fill={C.blue} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">GitHub</text>
            <text x={610} y={68} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">Manzooma-Store-V2</text>

            {/* Status badge */}
            <rect x={720} y={35} width={100} height={40} fill={`${C.green}22`} stroke={C.green} strokeWidth={2} rx={6} />
            <text x={770} y={52} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">{pushProg > 0.95 ? '✓ LIVE' : `${Math.floor(pushProg * 100)}%`}</text>
            <text x={770} y={66} fill={C.muted} fontSize={8} fontFamily={MONO} textAnchor="middle">deployed</text>
          </g>

          {/* 4 KPI cards */}
          <g style={{opacity: clamp(liveP)}}>
            {[
              {label: 'Files deployed', value: '35', color: C.blue, x: 20},
              {label: 'Total commits', value: '68', color: C.purple, x: 220},
              {label: 'Query speedup', value: '1500×', color: C.green, x: 420},
              {label: 'Career ready', value: '100%', color: C.gold, x: 620},
            ].map((k, i) => {
              const p = clamp(pop(f, t(180 + i * 0.4)));
              return (
                <g key={i} style={{opacity: clamp(p), transform: `translate(0, ${(1 - p) * 14}px)`}}>
                  <rect x={k.x} y={100} width={200} height={70} fill={`${k.color}22`} stroke={k.color} strokeWidth={2.5} rx={8} style={{filter: `drop-shadow(0 0 6px ${k.color}66)`}} />
                  <text x={k.x + 100} y={122} fill={k.color} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">{k.label}</text>
                  <text x={k.x + 100} y={150} fill={C.text} fontSize={20} fontFamily={MONO} fontWeight={700} textAnchor="middle">{k.value}</text>
                </g>
              );
            })}
          </g>

          {/* Career roles table */}
          <g style={{opacity: clamp(readyP)}}>
            <text x={420} y={200} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">Career-Ready Roles · 4 Positions</text>
            {CAREER_READINESS.roles.map((role, i) => {
              const colors = [C.blue, C.purple, C.amber, C.green];
              const color = colors[i];
              const p = clamp(pop(f, t(190 + i * 0.5)));
              return (
                <g key={i} style={{opacity: clamp(p), transform: `translate(${(1 - p) * 30}px, 0)`}}>
                  <rect x={20 + i * 205} y={220} width={190} height={60} fill={`${color}22`} stroke={color} strokeWidth={2.5} rx={8} />
                  <text x={115 + i * 205} y={245} fill={color} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">{role}</text>
                  <rect x={50 + i * 205} y={255} width={130} height={16} fill={`${C.green}22`} stroke={C.green} strokeWidth={1.5} rx={8} />
                  <text x={115 + i * 205} y={267} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ 100% ready</text>
                </g>
              );
            })}
          </g>

          {/* Performance footer */}
          <g style={{opacity: clamp(sealP)}}>
            <rect x={20} y={310} width={800} height={70} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 12px ${C.green})`}} />
            <text x={420} y={338} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ 100% Career Ready · SQL Professional Certified · GitHub Portfolio Live</text>
            <text x={420} y={360} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">15-table schema · analytics pipeline · performance tuning · security · backup · all mastered</text>
          </g>

          {/* Course complete footer */}
          <g style={{opacity: clamp(sealP)}}>
            <rect x={20} y={400} width={800} height={80} fill={`${C.gold}11`} stroke={C.gold} strokeWidth={2.5} rx={10} />
            <text x={420} y={425} fill={C.gold} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">🎓 Course Complete · SQL From Zero to Professional · 100% Mastered</text>
            <rect x={120} y={440} width={600} height={14} fill={C.deep} stroke={C.gold} strokeWidth={1} rx={4} />
            <rect x={120} y={440} width={600 * sealP} height={14} fill={C.gold} rx={4} style={{filter: `drop-shadow(0 0 6px ${C.gold})`}} />
            <text x={420} y={470} fill={C.gold} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">Module 16 · 100% · 68 lessons · 16 modules · SQL Professional Certified 🎓</text>
          </g>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 700, paddingTop: 4, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.amber}}>git push origin main</span>
          <span style={{color: C.green}}>100% career ready 🎓</span>
          <span style={{color: C.gold}}>Module 16 · 100%</span>
        </div>
      </Win>

      <Caption text="git push origin main ──► GitHub live ──► 35 files ──► 68 commits ──► 100% career ready ──► SQL Professional 🎓" from={t(180)} to={sec(40)} tone="ok" />
    </Stage>
  );
};
