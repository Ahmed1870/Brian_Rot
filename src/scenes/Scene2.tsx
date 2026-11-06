import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {TSQUERY_EXAMPLE} from '../data';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC02 (40-85s): tsvector & tsquery Architecture — dual streams merge at @@ operator, igniting green match
// Anchors: 41.0 tsvector | 45.0 lexemes | 52.0 tsquery | 60.0 boolean | 68.0 @@ | 75.0 match | 80.0 seal
const S = START.s2;
const t = (g: number) => sec(g - S);

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const vecP = pop(f, t(41));
  const lexP = pop(f, t(45));
  const qryP = pop(f, t(52));
  const boolP = pop(f, t(60));
  const opP = pop(f, t(68));
  const matchP = pop(f, t(75));
  const sealP = pop(f, t(80));

  const pulse = 0.5 + 0.5 * Math.sin(f * 0.17);
  // Stream flow progress
  const vecFlow = clamp(lin(f, t(45), sec(8)));
  const qryFlow = clamp(lin(f, t(52), sec(8)));

  return (
    <Stage dur={1350} inFx="left" outFx="left">
      <TopBadge text="معمارية البحث النصي الكامل | tsvector (blue) & tsquery (purple) ──► @@ Match Operator (green)" from={sec(2)} to={sec(40)} color={C.blue} />

      {/* LEFT: tsvector stream (blue) — text → lexemes */}
      <Win x={80} y={170} w={860} h={540} title="tsvector stream ──► text ──► to_tsvector() ──► indexed lexemes (blue)" accent={C.blue} opacity={clamp(lin(f, t(41.5), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.blue}}>
          raw text ──► to_tsvector('english', ...) ──► lexemes with positions
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.blue} style={{fontSize: 13, padding: '4px 12px'}}>tsvector</Chip>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>{vecFlow > 0.95 ? 'indexed ✓' : '...'}</Chip>
        </div>

        <svg width={820} height={460} style={{position: 'absolute', left: 18, top: 60}}>
          {/* Raw text source (left) */}
          <g style={{opacity: clamp(vecP)}}>
            <rect x={20} y={180} width={170} height={80} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={3} rx={10} />
            <text x={105} y={210} fill={C.amber} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">raw text</text>
            <text x={105} y={230} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">'The fast HDMI</text>
            <text x={105} y={246} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">cable supports 4K'</text>
          </g>

          {/* to_tsvector() node (center) */}
          <g style={{opacity: clamp(lexP)}}>
            <line x1={192} y1={220} x2={250} y2={220} stroke={C.blue} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="244,214 244,226 258,220" fill={C.blue} />
            <rect x={260} y={180} width={220} height={80} fill={`${C.blue}33`} stroke={C.blue} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 ${8 + pulse * 6}px ${C.blue})`}} />
            <text x={370} y={210} fill={C.blue} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">to_tsvector('english',...)</text>
            <text x={370} y={232} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">drop stop words</text>
            <text x={370} y={250} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">stem to lexemes</text>
          </g>

          {/* Arrow to lexeme list */}
          <g style={{opacity: clamp(lexP)}}>
            <line x1={482} y1={220} x2={540} y2={220} stroke={C.blue} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="534,214 534,226 548,220" fill={C.blue} />
          </g>

          {/* Lexeme stream (right) */}
          <g style={{opacity: clamp(lexP)}}>
            {[
              {w: 'fast', p: 2},
              {w: 'hdmi', p: 3},
              {w: 'cabl', p: 4},
              {w: 'support', p: 5},
              {w: '4k', p: 6},
              {w: 'resolut', p: 7},
            ].map((lm, i) => {
              const lmP = clamp(vecFlow - i * 0.08);
              return (
                <g key={i} style={{opacity: clamp(lmP), transform: `translate(${(1 - lmP) * 20}px, 0)`}}>
                  <rect x={550} y={130 + i * 30} width={240} height={26} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={1.5} rx={6} />
                  <text x={670} y={148 + i * 30} fill={C.blue} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{`'${lm.w}':${lm.p}`}</text>
                </g>
              );
            })}
            <text x={670} y={100} fill={C.blue} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">tsvector output</text>
          </g>

          {/* Bottom status */}
          <text x={410} y={430} fill={C.blue} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">tsvector ──► stored in column ──► indexed by GIN</text>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 13, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.amber}}>raw text</span>
          <span style={{color: C.blue}}>to_tsvector()</span>
          <span style={{color: C.green}}>lexemes indexed ✓</span>
        </div>
      </Win>

      {/* LEFT-BOTTOM: tsvector editor */}
      <div style={{opacity: clamp(vecP)}}>
        <Editor
          x={80}
          y={730}
          w={860}
          h={170}
          title="tsvector.sql · build search_vector column"
          lines={[
            "ALTER TABLE store_products ADD COLUMN search_vector tsvector",
            "  GENERATED ALWAYS AS (to_tsvector('english', product_name || ' ' || description)) STORED;",
          ]}
          start={t(45)}
          cps={0.5}
          size={14}
          accent={C.blue}
          hl={1}
          hlColor={C.blue}
        />
      </div>

      {/* RIGHT: tsquery stream (purple) + @@ merge + green match */}
      <Win x={960} y={170} w={880} h={720} title="tsquery stream ──► @@ operator ──► green match (purple + amber → green)" accent={C.purple} opacity={clamp(lin(f, t(52), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.purple}}>
          user query ──► to_tsquery() ──► boolean expr (purple) ──► @@ merge ──► green match
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.purple} style={{fontSize: 13, padding: '4px 12px'}}>tsquery</Chip>
          <Chip color={C.amber} style={{fontSize: 13, padding: '4px 12px'}}>@@</Chip>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>{matchP > 0.5 ? 'MATCH ✓' : 'idle'}</Chip>
        </div>

        <svg width={840} height={600} style={{position: 'absolute', left: 18, top: 60}}>
          {/* User query source (top) */}
          <g style={{opacity: clamp(qryP)}}>
            <rect x={300} y={20} width={240} height={60} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={3} rx={10} />
            <text x={420} y={45} fill={C.amber} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">user query string</text>
            <text x={420} y={65} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">'hdmi &amp; fast'</text>
          </g>

          {/* to_tsquery() node */}
          <g style={{opacity: clamp(qryP)}}>
            <line x1={420} y1={82} x2={420} y2={110} stroke={C.purple} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="414,104 426,104 420,118" fill={C.purple} />
            <rect x={290} y={120} width={260} height={70} fill={`${C.purple}33`} stroke={C.purple} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 ${8 + pulse * 6}px ${C.purple})`}} />
            <text x={420} y={148} fill={C.purple} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">to_tsquery('english',...)</text>
            <text x={420} y={170} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">parse boolean operators</text>
            <text x={420} y={184} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">&amp; (AND) | (OR) ! (NOT)</text>
          </g>

          {/* Boolean expr chips */}
          <g style={{opacity: clamp(boolP)}}>
            <text x={420} y={220} fill={C.purple} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">boolean expression (tsquery)</text>
            <rect x={240} y={230} width={360} height={44} fill={`${C.purple}22`} stroke={C.purple} strokeWidth={2.5} rx={8} />
            <text x={420} y={258} fill={C.purple} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">{TSQUERY_EXAMPLE}</text>

            {/* operator breakdown */}
            {[
              {sym: "'hdmi'", x: 80, c: C.purple, lbl: 'term 1'},
              {sym: '&', x: 200, c: C.amber, lbl: 'AND'},
              {sym: "'fast'", x: 320, c: C.purple, lbl: 'term 2'},
            ].map((op, i) => {
              const opP = clamp(boolP - i * 0.1);
              return (
                <g key={i} style={{opacity: clamp(opP)}}>
                  <rect x={op.x} y={295} width={100} height={48} fill={`${op.c}22`} stroke={op.c} strokeWidth={2} rx={8} />
                  <text x={op.x + 50} y={320} fill={op.c} fontSize={16} fontFamily={MONO} fontWeight={700} textAnchor="middle">{op.sym}</text>
                  <text x={op.x + 50} y={338} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">{op.lbl}</text>
                </g>
              );
            })}
          </g>

          {/* === MERGE ZONE: tsvector + tsquery meet at @@ === */}
          <g style={{opacity: clamp(opP)}}>
            {/* tsvector feeds from left */}
            <line x1={40} y1={400} x2={320} y2={430} stroke={C.blue} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <text x={150} y={395} fill={C.blue} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">tsvector ↓</text>

            {/* tsquery feeds from top */}
            <line x1={420} y1={345} x2={420} y2={400} stroke={C.purple} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <text x={460} y={375} fill={C.purple} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">tsquery ↓</text>

            {/* @@ operator box (amber, glowing) */}
            <rect x={320} y={400} width={200} height={70} fill={`${C.amber}33`} stroke={C.amber} strokeWidth={4} rx={12} style={{filter: `drop-shadow(0 0 ${12 + pulse * 10}px ${C.amber})`}} />
            <text x={420} y={432} fill={C.amber} fontSize={26} fontFamily={MONO} fontWeight={700} textAnchor="middle">@@</text>
            <text x={420} y={456} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">match operator</text>
          </g>

          {/* Green match explosion */}
          <g style={{opacity: clamp(matchP)}}>
            <line x1={520} y1={435} x2={620} y2={435} stroke={C.green} strokeWidth={4} opacity={0.9} style={{filter: `drop-shadow(0 0 6px ${C.green})`}} />
            <polygon points="614,429 614,441 628,435" fill={C.green} />

            <rect x={630} y={400} width={190} height={70} fill={`${C.green}33`} stroke={C.green} strokeWidth={4} rx={12} style={{filter: `drop-shadow(0 0 ${12 + pulse * 10}px ${C.green})`}} />
            <text x={725} y={432} fill={C.green} fontSize={18} fontFamily={MONO} fontWeight={700} textAnchor="middle">MATCH ✓</text>
            <text x={725} y={456} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">GIN Bitmap Scan</text>

            {/* Spark rays */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={i} x1={725} y1={400} x2={725 + Math.cos((i - 2) * 0.5) * 60} y2={400 + Math.sin((i - 2) * 0.5) * 60 - 30} stroke={C.green} strokeWidth={2} opacity={0.6} strokeDasharray="3 3" />
            ))}
          </g>

          {/* Result banner */}
          {matchP > 0.5 ? (
            <g style={{opacity: clamp(pop(f, t(76)))}}>
              <rect x={120} y={510} width={600} height={48} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 12px ${C.green})`}} />
              <text x={420} y={540} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ tsvector @@ tsquery ──► MATCH · sub-millisecond · GIN indexed</text>
            </g>
          ) : null}

          {/* Status text */}
          <text x={420} y={580} fill={C.muted} fontSize={12} fontFamily={MONO} textAnchor="middle">
            {qryFlow < 0.3 ? 'parsing tsquery...' : boolP < 0.5 ? 'building boolean expr...' : opP < 0.5 ? 'merging at @@...' : matchP < 0.5 ? 'evaluating match...' : '✓ match sealed · green ignition'}
          </text>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 13, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.purple}}>tsquery · boolean</span>
          <span style={{color: C.amber}}>@@ merge</span>
          <span style={{color: C.green}}>MATCH ✓</span>
        </div>
      </Win>

      {/* Seal badge bottom-center */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 910, display: 'flex', justifyContent: 'center', opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '12px 26px', border: `3px solid ${C.green}`, borderRadius: 18, background: `${C.green}0d`, boxShadow: `0 0 32px ${C.green}44`}}>
          <Check p={sealP} size={48} color={C.green} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, color: C.green, fontWeight: 700}}>tsvector &amp; tsquery Architecture Seal ✓</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginTop: 2}}>text → lexemes  ·  query → boolean  ·  @@ match operator  ·  GIN Bitmap Scan</div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, marginLeft: 16, padding: '6px 16px', border: `2px solid ${C.green}`, borderRadius: 999, background: `${C.green}1a`}}>
            <Check p={matchP} size={22} color={C.green} />
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700}}>Match ✓</span>
          </div>
        </div>
      </div>

      <Caption text="tsvector ──► lexemes ──► tsquery ──► boolean expr ──► @@ operator ──► MATCH ✓" from={t(60)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
