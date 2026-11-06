import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {TOKENIZATION_EXAMPLE} from '../data';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC01 (0-40s): Full-Text Search Concept — slow LIKE query (red scanning cloud) vs FTS engine (green)
// Text decomposes into blue lexemes; stop words ignored; FTS Engine badge seals the concept
// Anchors: 1.0 welcome | 5.0 FTS | 9.0 lexemes | 14.0 stop words | 20.0 tokenization | 28.0 seal | 35.0 engine
const S = START.s1;
const t = (g: number) => sec(g - S);

const STOP_WORDS = TOKENIZATION_EXAMPLE.stopWords;
const LEXEMES = TOKENIZATION_EXAMPLE.lexemes;

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(1.5), 14));
  const ftsP = pop(f, t(5));
  const lexP = clamp(lin(f, t(9), 14));
  const stopP = pop(f, t(14));
  const tokP = clamp(lin(f, t(20), sec(8)));
  const sealP = pop(f, t(28));
  const engP = pop(f, t(35));

  // Pulse for LIKE scanning cloud
  const pulse = 0.5 + 0.5 * Math.sin(f * 0.18);
  // LIKE scan progress (slow, red)
  const scanProg = clamp(lin(f, t(2), sec(20)));
  // FTS quick flash (instant, green)
  const ftsProg = clamp(lin(f, t(5), sec(2)));

  // Tokenization animation: words lift off into lexemes
  const wordFloat = clamp(lin(f, t(20), sec(5)));

  return (
    <Stage dur={1200} inFx="zoom" outFx="left">
      <TopBadge text="البحث النصي الكامل | Full-Text Search (FTS) — Lexeme Tokenization, Stop-Word Removal, @@ Match Operator (Module 15)" from={sec(2)} to={sec(18)} color={C.green} />

      {/* LEFT: Code editor — slow LIKE query vs instant FTS query */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={680}
          h={320}
          title="Query Editor · LIKE vs Full-Text Search (PostgreSQL 16)"
          lines={[
            '-- SLOW: LIKE scans every row',
            "SELECT * FROM store_products",
            "  WHERE description LIKE '%laptop%';",
            '',
            '-- FAST: FTS uses tsvector + tsquery',
            "SELECT * FROM store_products",
            "  WHERE search_vector @@ to_tsquery('english','laptop');",
            '',
            '-- 4200ms (Seq Scan)  vs  0.5ms (GIN Bitmap Scan)',
          ]}
          start={t(1.5)}
          cps={0.6}
          size={15}
          accent={C.green}
          hl={5}
          hlColor={C.green}
        />
      </div>

      {/* Concept chips below editor */}
      <div style={{position: 'absolute', left: 80, top: 510, width: 680, opacity: clamp(lin(f, t(5), 14))}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.muted, marginBottom: 10}}>◆ Full-Text Search golden rule</div>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Chip color={C.red} style={{fontSize: 16, padding: '4px 14px'}}>LIKE %x%</Chip>
          <Chip color={C.blue} style={{fontSize: 16, padding: '4px 14px'}}>tsvector</Chip>
          <Chip color={C.purple} style={{fontSize: 16, padding: '4px 14px'}}>tsquery</Chip>
          <Chip color={C.amber} style={{fontSize: 16, padding: '4px 14px'}}>@@ match</Chip>
          <Chip color={C.green} style={{fontSize: 16, padding: '4px 14px'}}>GIN index ✓</Chip>
        </div>
      </div>

      {/* Module 15 FTS Engine badge panel */}
      <Win x={80} y={590} w={680} h={320} title="module 15 architecture ──► FTS engine (lexeme tokenization seal)" accent={C.green} opacity={clamp(lin(f, t(9), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
          raw text ──► tokenization ──► lexemes ──► stop words dropped ──► indexed
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>
            <Check p={engP} size={16} color={C.green} /> FTS Engine
          </Chip>
        </div>

        <svg width={640} height={220} style={{position: 'absolute', left: 20, top: 50}}>
          {/* Raw text source (left) */}
          <g style={{opacity: clamp(pop(f, t(9)))}}>
            <rect x={20} y={50} width={150} height={80} fill={`${C.amber}11`} stroke={C.amber} strokeWidth={2} strokeDasharray="5 4" rx={8} />
            <text x={95} y={78} fill={C.amber} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">raw text</text>
            <text x={95} y={98} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">'The fast HDMI</text>
            <text x={95} y={114} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">cable supports 4K'</text>
          </g>

          {/* Arrow into tokenizer */}
          <g style={{opacity: clamp(pop(f, t(14)))}}>
            <line x1={172} y1={90} x2={230} y2={90} stroke={C.amber} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="224,84 224,96 238,90" fill={C.amber} />
            <text x={200} y={80} fill={C.amber} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">tokenize</text>
          </g>

          {/* Tokenizer box (center) */}
          <g style={{opacity: clamp(stopP)}}>
            <rect x={240} y={50} width={170} height={80} fill={`${C.blue}33`} stroke={C.blue} strokeWidth={3} rx={8} style={{filter: `drop-shadow(0 0 ${8 + pulse * 6}px ${C.blue})`}} />
            <text x={325} y={78} fill={C.blue} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">to_tsvector()</text>
            <text x={325} y={98} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">drop stop words</text>
            <text x={325} y={114} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">stem lexemes</text>
          </g>

          {/* Arrow to indexed lexemes */}
          <g style={{opacity: clamp(pop(f, t(20)))}}>
            <line x1={412} y1={90} x2={470} y2={90} stroke={C.blue} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="464,84 464,96 478,90" fill={C.blue} />
            <text x={442} y={80} fill={C.blue} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">stem</text>
          </g>

          {/* Indexed lexemes (right) */}
          <g style={{opacity: clamp(pop(f, t(20)))}}>
            <rect x={480} y={50} width={140} height={80} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={8} />
            <text x={550} y={78} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">tsvector</text>
            <text x={550} y={98} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">'fast':2 'hdmi':3</text>
            <text x={550} y={114} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">'cabl':4 '4k':6</text>
          </g>

          {/* Stop words row */}
          <g style={{opacity: clamp(stopP)}}>
            <text x={325} y={170} fill={C.red} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">✗ dropped: {STOP_WORDS.join(', ')}</text>
            <text x={325} y={195} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ lexemes indexed: {LEXEMES.length}</text>
          </g>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>raw ──► tokenizer</span>
          <span>lexemes ✓</span>
        </div>
      </Win>

      {/* RIGHT: Big visualization — slow LIKE scanning cloud vs instant FTS */}
      <Win x={800} y={170} w={1040} h={720} title="FTS concept ──► slow LIKE (red scanning cloud) ──► instant FTS engine (green)" accent={C.green} opacity={lexP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
          LIKE '%laptop%' scans every row (red cloud, 4200ms)  ·  FTS @@ to_tsquery matches via GIN Bitmap Scan (0.5ms)
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.red} style={{fontSize: 13, padding: '4px 12px'}}>LIKE · 4200ms</Chip>
          <Chip color={C.amber} style={{fontSize: 13, padding: '4px 12px'}}>{scanProg > 0.05 && scanProg < 0.99 ? 'scanning...' : 'idle'}</Chip>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>{ftsProg > 0.95 ? 'FTS ✓ 0.5ms' : '...'}</Chip>
        </div>

        <svg width={1000} height={600} style={{position: 'absolute', left: 20, top: 60}}>
          {/* === TOP: Slow LIKE scanning cloud (red) === */}
          <g style={{opacity: clamp(pop(f, t(1.5)))}}>
            <text x={500} y={30} fill={C.red} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">SLOW · Seq Scan · LIKE '%laptop%' · 4200ms</text>

            {/* Red scanning cloud */}
            <ellipse cx={500} cy={130} rx={120 + pulse * 18} ry={36 + pulse * 8} fill={`${C.red}22`} stroke={C.red} strokeWidth={3} strokeDasharray="8 6" style={{filter: `drop-shadow(0 0 ${12 + pulse * 10}px ${C.red})`}} />
            <text x={500} y={126} fill={C.red} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">scanning cloud</text>
            <text x={500} y={146} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">checks every row · every substring</text>

            {/* Row stream being scanned */}
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const rowX = 100 + i * 130;
              const scanned = scanProg > (i + 0.5) / 6;
              return (
                <g key={i}>
                  <rect x={rowX} y={180} width={110} height={28} fill={scanned ? `${C.red}22` : `${C.border}22`} stroke={scanned ? C.red : C.border} strokeWidth={1.5} rx={4} />
                  <text x={rowX + 55} y={198} fill={scanned ? C.red : C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">row #{i + 1}</text>
                </g>
              );
            })}

            <text x={500} y={230} fill={C.red} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{scanProg < 0.99 ? `scanning... ${Math.round(scanProg * 100)}%` : '✓ match found · but slow'}</text>
          </g>

          {/* Divider */}
          <line x1={50} y1={260} x2={950} y2={260} stroke={C.border} strokeWidth={2} strokeDasharray="6 6" opacity={0.5} />

          {/* === BOTTOM: FTS engine — text decomposes into lexemes === */}
          <g style={{opacity: clamp(pop(f, t(5)))}}>
            <text x={500} y={290} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">FAST · GIN Bitmap Scan · @@ to_tsquery · 0.5ms</text>
          </g>

          {/* Raw text being tokenized */}
          <g style={{opacity: clamp(pop(f, t(9)))}}>
            <rect x={300} y={310} width={400} height={50} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={2.5} rx={8} />
            <text x={500} y={342} fill={C.amber} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">'The fast HDMI cable supports 4K resolution'</text>
          </g>

          {/* Decomposition arrows */}
          <g style={{opacity: clamp(pop(f, t(14)))}}>
            {LEXEMES.map((lm, i) => {
              const startX = 320 + i * 60;
              const endX = 80 + i * 130;
              const endY = 430;
              return (
                <line key={i} x1={startX} y1={360} x2={endX + 55} y2={endY} stroke={C.blue} strokeWidth={1.5} strokeDasharray="4 3" opacity={0.4} />
              );
            })}
          </g>

          {/* Stop words row (dropped) */}
          <g style={{opacity: clamp(stopP)}}>
            {STOP_WORDS.map((w, i) => {
              const x = 200 + i * 90;
              return (
                <g key={i}>
                  <rect x={x} y={375} width={70} height={28} fill={`${C.red}11`} stroke={C.red} strokeWidth={1.5} strokeDasharray="3 3" rx={6} />
                  <text x={x + 35} y={393} fill={C.red} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle" textDecoration="line-through">{w}</text>
                </g>
              );
            })}
            <text x={500} y={418} fill={C.red} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">✗ stop words dropped</text>
          </g>

          {/* Lexeme chips (kept & indexed) */}
          <g style={{opacity: clamp(pop(f, t(20)))}}>
            {LEXEMES.map((lm, i) => {
              const x = 80 + i * 130;
              const float = clamp(wordFloat - i * 0.08);
              return (
                <g key={i} style={{opacity: clamp(float), transform: `translate(0, ${(1 - float) * 12}px)`}}>
                  <rect x={x} y={430} width={110} height={50} fill={`${C.blue}33`} stroke={C.blue} strokeWidth={2.5} rx={8} style={{filter: `drop-shadow(0 0 6px ${C.blue}66)`}} />
                  <text x={x + 55} y={452} fill={C.blue} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">{`'${lm.word}'`}</text>
                  <text x={x + 55} y={470} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">pos {lm.pos}</text>
                </g>
              );
            })}
          </g>

          {/* tsvector → @@ → tsquery → green match */}
          <g style={{opacity: clamp(pop(f, t(20)))}}>
            <rect x={120} y={510} width={160} height={50} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={3} rx={10} />
            <text x={200} y={532} fill={C.blue} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">tsvector</text>
            <text x={200} y={550} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">indexed lexemes</text>

            <line x1={284} y1={535} x2={360} y2={535} stroke={C.amber} strokeWidth={4} opacity={0.9} />
            <polygon points="354,529 354,541 368,535" fill={C.amber} />
            <text x={322} y={525} fill={C.amber} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">@@</text>

            <rect x={372} y={510} width={160} height={50} fill={`${C.purple}33`} stroke={C.purple} strokeWidth={3} rx={10} />
            <text x={452} y={532} fill={C.purple} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">tsquery</text>
            <text x={452} y={550} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">'laptop' boolean expr</text>

            <line x1={536} y1={535} x2={612} y2={535} stroke={C.green} strokeWidth={4} opacity={0.9} style={{filter: `drop-shadow(0 0 6px ${C.green})`}} />
            <polygon points="606,529 606,541 620,535" fill={C.green} />

            <rect x={624} y={510} width={200} height={50} fill={`${C.green}33`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 ${8 + pulse * 6}px ${C.green})`}} />
            <text x={724} y={532} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">MATCH ✓</text>
            <text x={724} y={550} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">GIN Bitmap Scan · 0.5ms</text>
          </g>

          {/* Result banner */}
          {ftsProg > 0.95 ? (
            <g style={{opacity: clamp(pop(f, t(26)))}}>
              <rect x={250} y={585} width={500} height={46} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 12px ${C.green})`}} />
              <text x={500} y={614} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ FTS Sealed · Lexeme Tokenization · @@ Match · GIN Index · Module 15</text>
            </g>
          ) : null}
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 16, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.red}}>LIKE · Seq Scan · 4200ms</span>
          <span style={{color: ftsProg >= 1 ? C.green : C.amber, opacity: clamp(pop(f, t(20)))}}>
            {ftsProg >= 1 ? '✓ FTS sealed · 0.5ms' : ftsProg > 0 ? `indexing... ${Math.round(ftsProg * 100)}%` : 'tokenizing...'}
          </span>
          <span style={{color: C.green}}>FTS Engine ✓</span>
        </div>
      </Win>

      {/* Seal badge bottom-left */}
      <div style={{position: 'absolute', left: 80, top: 920, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={sealP} size={36} color={C.green} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>FTS Concept · Sealed ✓</div>
        </div>
      </div>

      {/* FTS Engine chip bottom-right */}
      <div style={{position: 'absolute', right: 80, top: 920, opacity: clamp(engP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.blue}`, borderRadius: 14, background: `${C.blue}0d`}}>
          <Check p={engP} size={36} color={C.blue} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.blue, fontWeight: 700}}>FTS Engine · Activated ✓</div>
        </div>
      </div>

      <Caption text="LIKE %x% ──► tsvector ──► lexemes ──► stop words ──► @@ match ──► GIN index ──► FTS ✓" from={t(20)} to={sec(38)} tone="ok" />
    </Stage>
  );
};
