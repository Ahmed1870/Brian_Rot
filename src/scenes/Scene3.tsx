import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {RANKING_QUERY} from '../data';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC03 (85-130s): ts_rank & ts_headline — code editor with ranking query, ts_rank for ORDER BY, ts_headline for highlighted snippets
// GENERATED ALWAYS AS STORED column concept. Results sort dynamically, keywords highlighted in amber.
// Anchors: 86.0 ts_rank | 90.0 relevance | 95.0 ORDER BY | 100.0 ts_headline | 110.0 highlight | 118.0 GENERATED | 125.0 seal
const S = START.s3;
const t = (g: number) => sec(g - S);

interface RankRow {
  title: string;
  rank: number;
  snippet: string;
  keywords: string[];
}

const ROWS: RankRow[] = [
  {title: 'MacBook Pro 16"', rank: 0.982, snippet: 'MacBook <b>Pro</b> with M3 <b>Max</b> chip', keywords: ['Pro', 'Max']},
  {title: 'iPad Pro 12.9"', rank: 0.871, snippet: 'iPad <b>Pro</b> featuring M2 chip', keywords: ['Pro']},
  {title: 'Mac Studio (Max)', rank: 0.812, snippet: 'Mac Studio with M2 <b>Max</b>', keywords: ['Max']},
  {title: 'Mac mini', rank: 0.421, snippet: 'Mac mini desktop computer', keywords: []},
  {title: 'iMac 24"', rank: 0.298, snippet: 'iMac all-in-one desktop', keywords: []},
];

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(86), 14));
  const rankP = pop(f, t(86));
  const relP = pop(f, t(90));
  const orderP = pop(f, t(95));
  const headP = pop(f, t(100));
  const hlP = pop(f, t(110));
  const genP = pop(f, t(118));
  const sealP = pop(f, t(125));

  const pulse = 0.5 + 0.5 * Math.sin(f * 0.18);
  // Sort animation: rows rearrange based on rank descending
  const sortProg = clamp(lin(f, t(95), sec(8)));
  // Highlight animation: keywords turn amber
  const hlProg = clamp(lin(f, t(110), sec(6)));

  // Sort rows by rank descending — show before/after positions
  const sorted = [...ROWS].sort((a, b) => b.rank - a.rank);

  // Compute current visual y position by interpolating from initial index to sorted index
  const rowY = (origIdx: number) => {
    const sortedIdx = sorted.findIndex((r) => r === ROWS[origIdx]);
    const from = origIdx;
    const to = sortedIdx;
    const y = lerp(from, to, sortProg);
    return y * 76;
  };

  return (
    <Stage dur={1350} inFx="left" outFx="up">
      <TopBadge text="ترتيب النتائج وإبرازها | ts_rank (relevance) & ts_headline (highlighted snippets) ──► GENERATED ALWAYS AS STORED" from={sec(2)} to={sec(40)} color={C.amber} />

      {/* LEFT: Ranking query editor */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={880}
          h={360}
          title="ranking.sql · ts_rank + ts_headline (PostgreSQL 16)"
          lines={RANKING_QUERY}
          start={t(86)}
          cps={0.55}
          size={15}
          accent={C.amber}
          hl={1}
          hlColor={C.amber}
        />
      </div>

      {/* Concept chips below editor */}
      <div style={{position: 'absolute', left: 80, top: 545, width: 880, opacity: clamp(relP)}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.muted, marginBottom: 10}}>◆ Relevance ranking golden rule</div>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Chip color={C.amber} style={{fontSize: 16, padding: '4px 14px'}}>ts_rank</Chip>
          <Chip color={C.blue} style={{fontSize: 16, padding: '4px 14px'}}>ORDER BY rank</Chip>
          <Chip color={C.green} style={{fontSize: 16, padding: '4px 14px'}}>ts_headline</Chip>
          <Chip color={C.purple} style={{fontSize: 16, padding: '4px 14px'}}>highlight &lt;b&gt;</Chip>
          <Chip color={C.amber} style={{fontSize: 16, padding: '4px 14px'}}>GENERATED STORED</Chip>
        </div>
      </div>

      {/* GENERATED ALWAYS AS STORED box */}
      <Win x={80} y={620} w={880} h={280} title="generated column ──► search_vector GENERATED ALWAYS AS STORED (purple)" accent={C.purple} opacity={clamp(genP)}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.purple}}>
          ALTER TABLE … ADD COLUMN search_vector tsvector GENERATED ALWAYS AS (to_tsvector(...)) STORED
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.purple} style={{fontSize: 13, padding: '4px 12px'}}>GENERATED</Chip>
          <Chip color={C.amber} style={{fontSize: 13, padding: '4px 12px'}}>ALWAYS</Chip>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>STORED ✓</Chip>
        </div>

        <svg width={840} height={180} style={{position: 'absolute', left: 18, top: 60}}>
          {/* product_name + description (sources) */}
          <g style={{opacity: clamp(genP)}}>
            <rect x={20} y={40} width={170} height={50} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={2.5} rx={8} />
            <text x={105} y={60} fill={C.amber} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">product_name</text>
            <text x={105} y={78} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">text column</text>

            <rect x={20} y={100} width={170} height={50} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={2.5} rx={8} />
            <text x={105} y={120} fill={C.amber} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">description</text>
            <text x={105} y={138} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">text column</text>
          </g>

          {/* Concat + to_tsvector (center) */}
          <g style={{opacity: clamp(genP)}}>
            <line x1={192} y1={95} x2={250} y2={95} stroke={C.blue} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="244,89 244,101 258,95" fill={C.blue} />
            <rect x={260} y={60} width={240} height={70} fill={`${C.blue}33`} stroke={C.blue} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 ${8 + pulse * 6}px ${C.blue})`}} />
            <text x={380} y={90} fill={C.blue} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">to_tsvector('english',...)</text>
            <text x={380} y={110} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">auto-computed on INSERT/UPDATE</text>
          </g>

          {/* Arrow to STORED column */}
          <g style={{opacity: clamp(genP)}}>
            <line x1={502} y1={95} x2={560} y2={95} stroke={C.purple} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="554,89 554,101 568,95" fill={C.purple} />
            <rect x={570} y={60} width={250} height={70} fill={`${C.purple}33`} stroke={C.purple} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 ${8 + pulse * 6}px ${C.purple})`}} />
            <text x={695} y={88} fill={C.purple} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">search_vector</text>
            <text x={695} y={108} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">tsvector · STORED on disk</text>
            <text x={695} y={122} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">auto-maintained ✓</text>
          </g>

          {/* Bottom note */}
          <text x={420} y={160} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">no triggers needed · PostgreSQL auto-recomputes on every row write</text>
        </svg>
      </Win>

      {/* RIGHT: Ranked results panel with ts_rank sorting + ts_headline highlighting */}
      <Win x={980} y={170} w={860} h={730} title="ranked results ──► ts_rank DESC · ts_headline amber highlights" accent={C.green} opacity={clamp(lin(f, t(90), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
          ts_rank computes relevance (0.0–1.0) · ts_headline wraps matches in &lt;b&gt; tags · ORDER BY rank DESC
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.amber} style={{fontSize: 13, padding: '4px 12px'}}>ts_rank</Chip>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>{sortProg > 0.95 ? 'sorted ✓' : 'sorting...'}</Chip>
        </div>

        <svg width={820} height={620} style={{position: 'absolute', left: 18, top: 60}}>
          {/* Header row */}
          <g style={{opacity: clamp(rankP)}}>
            <rect x={20} y={10} width={780} height={36} fill={`${C.deep}cc`} stroke={C.border} strokeWidth={1} rx={6} />
            <text x={50} y={34} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700}>#</text>
            <text x={100} y={34} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700}>title</text>
            <text x={450} y={34} fill={C.amber} fontSize={11} fontFamily={MONO} fontWeight={700}>ts_rank</text>
            <text x={580} y={34} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700}>ts_headline snippet</text>
          </g>

          {/* Rows (sorting in real time) */}
          {ROWS.map((row, origIdx) => {
            const y = 60 + rowY(origIdx);
            const isMatch = row.keywords.length > 0;
            const rankBar = Math.min(1, row.rank);
            return (
              <g key={origIdx} style={{opacity: clamp(rankP)}}>
                {/* Row container */}
                <rect x={20} y={y} width={780} height={66} fill={isMatch ? `${C.green}11` : `${C.deep}88`} stroke={isMatch ? C.green : C.border} strokeWidth={1.5} rx={8} />

                {/* Position number */}
                <text x={50} y={y + 28} fill={isMatch ? C.green : C.muted} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">{origIdx + 1}</text>

                {/* Title */}
                <text x={100} y={y + 28} fill={C.text} fontSize={13} fontFamily={MONO} fontWeight={700}>{row.title}</text>

                {/* Rank bar */}
                <rect x={100} y={y + 38} width={300} height={10} fill={C.deep} stroke={C.border} strokeWidth={1} rx={3} />
                <rect x={100} y={y + 38} width={300 * rankBar} height={10} fill={C.amber} rx={3} style={{filter: `drop-shadow(0 0 4px ${C.amber}88)`}} />
                <text x={460} y={y + 30} fill={C.amber} fontSize={13} fontFamily={MONO} fontWeight={700}>{row.rank.toFixed(3)}</text>

                {/* Snippet with ts_headline highlighting */}
                {(() => {
                  const parts = row.snippet.split(/(<b>.*?<\/b>)/);
                  return (
                    <text x={560} y={y + 30} fill={C.text} fontSize={11} fontFamily={MONO}>
                      {parts.map((part, i) => {
                        const isBold = part.startsWith('<b>') && part.endsWith('</b>');
                        const text = isBold ? part.replace(/<\/?b>/g, '') : part;
                        return (
                          <tspan key={i} fill={isBold ? C.amber : C.text} fontWeight={isBold ? 700 : 400}>{text}</tspan>
                        );
                      })}
                    </text>
                  );
                })()}

                {/* Match checkmark */}
                {isMatch ? (
                  <g style={{opacity: clamp(hlP)}}>
                    <circle cx={775} cy={y + 32} r={10} fill={`${C.green}22`} stroke={C.green} strokeWidth={2} />
                    <polyline points={`770,${y + 33} 774,${y + 37} 781,${y + 28}`} fill="none" stroke={C.green} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                ) : null}
              </g>
            );
          })}

          {/* Order by indicator */}
          <g style={{opacity: clamp(orderP)}}>
            <rect x={20} y={460} width={780} height={50} fill={`${C.amber}11`} stroke={C.amber} strokeWidth={2} strokeDasharray="5 4" rx={8} />
            <text x={410} y={485} fill={C.amber} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">ORDER BY rank DESC ──► highest relevance floats to top</text>
            <text x={410} y={502} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">ts_rank weights: cover density · word proximity · frequency</text>
          </g>

          {/* Snippet highlight explanation */}
          <g style={{opacity: clamp(hlP)}}>
            <rect x={20} y={525} width={780} height={70} fill={`${C.green}11`} stroke={C.green} strokeWidth={2} rx={8} />
            <text x={410} y={552} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">ts_headline('english', description, query)</text>
            <text x={410} y={572} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">wraps matched lexemes in &lt;b&gt;…&lt;/b&gt; tags</text>
            <text x={410} y={588} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">frontend renders &lt;b&gt; as amber highlight · max 35 words · configurable</text>
          </g>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 13, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.amber}}>ts_rank · relevance</span>
          <span style={{color: C.green}}>ts_headline · highlight</span>
        </div>
      </Win>

      {/* Seal badge bottom-center */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 920, display: 'flex', justifyContent: 'center', opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '10px 26px', border: `3px solid ${C.amber}`, borderRadius: 18, background: `${C.amber}0d`, boxShadow: `0 0 28px ${C.amber}44`}}>
          <Check p={sealP} size={44} color={C.amber} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, color: C.amber, fontWeight: 700}}>ts_rank &amp; ts_headline Seal ✓</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', border: `2px solid ${C.green}`, borderRadius: 999, background: `${C.green}1a`}}>
            <Check p={sealP} size={20} color={C.green} />
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.green, fontWeight: 700}}>Ranked ✓</span>
          </div>
        </div>
      </div>

      <Caption text="ts_rank ──► relevance ──► ORDER BY DESC ──► ts_headline ──► &lt;b&gt; highlight ──► GENERATED STORED ──► Seal ✓" from={t(95)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
