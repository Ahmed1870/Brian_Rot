import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';

// SC03 (85-130s): LIKE Wildcards & Implicit Casting — Side-by-side Corrections
// Anchors: 86.0 LIKE | 90.0 wildcard | 95.0 pg_trgm | 100.0 casting | 110.0 explicit | 118.0 match | 125.0 seal
const S = START.s3;
const t = (g: number) => sec(g - S);

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const leftP = clamp(lin(f, t(86.5), 14));
  const rightP = clamp(lin(f, t(100), 14));
  // LIKE correction animation
  const likeFixP = clamp(lin(f, t(90), sec(8)));
  // Type cast animation
  const castFixP = clamp(lin(f, t(110), sec(8)));
  const trgmP = pop(f, t(95));
  const sealP = pop(f, t(125));

  return (
    <Stage dur={1350} inFx="left" outFx="up">
      <TopBadge text="LIKE والـ Wildcards والتحويل الضمني | LIKE Wildcards & Implicit Casting" from={sec(2)} to={sec(40)} color={C.purple} />

      {/* LEFT: LIKE correction with pg_trgm */}
      <div style={{opacity: leftP, transform: `translateX(${(1 - leftP) * -30}px)`}}>
        <Editor
          x={80}
          y={180}
          w={860}
          h={130}
          title="LIKE Wildcards ──► prefix vs leading %"
          lines={["WHERE name LIKE '%store'   ──►  non-SARGable ✗"]}
          start={t(86.5)}
          cps={0.85}
          size={17}
          accent={C.red}
          hl={0}
          hlColor={C.red}
        />

        <Win x={80} y={330} w={860} h={570} title="LIKE fix ──► prefix match or pg_trgm GIN" accent={C.purple} opacity={leftP}>
          <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.purple}}>
            leading wildcard % breaks B-Tree traversal
          </div>

          {/* SVG: B-Tree traversal difference */}
          <svg width={820} height={420} style={{position: 'absolute', left: 20, top: 50}}>
            {/* BEFORE: %store — broken */}
            <text x={20} y={20} fill={C.red} fontSize={13} fontFamily={MONO} fontWeight={700}>BEFORE: LIKE "%store" (leading wildcard)</text>
            <rect x={20} y={35} width={780} height={130} fill={`${C.red}0d`} stroke={C.red} strokeWidth={2} strokeDasharray="6 4" rx={8} />
            {/* B-Tree cannot start anywhere */}
            <text x={410} y={65} fill={C.red} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">B-Tree index unusable · cannot anchor search</text>
            {/* Multiple red leaves (all must be scanned) */}
            {[100, 180, 260, 340, 420, 500, 580, 660].map((x, i) => (
              <g key={`bad-${i}`}>
                <rect x={x} y={90} width={60} height={50} fill={`${C.red}11`} stroke={C.red} strokeWidth={1.5} strokeDasharray="3 3" rx={6} />
                <text x={x + 30} y={120} fill={C.red} fontSize={11} fontFamily={MONO} textAnchor="middle">leaf</text>
              </g>
            ))}
            <text x={410} y={158} fill={C.red} fontSize={12} fontFamily={MONO} textAnchor="middle">all leaves scanned ──► fallback to Seq Scan</text>

            {/* AFTER: store% — green path */}
            <text x={20} y={210} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700}>AFTER: LIKE "store%" (prefix match)</text>
            <rect x={20} y={225} width={780} height={130} fill={likeFixP > 0.5 ? `${C.green}0d` : 'transparent'} stroke={C.green} strokeWidth={2} strokeDasharray={likeFixP > 0.5 ? 'none' : '6 4'} rx={8} />
            {/* B-Tree can anchor at "store" prefix */}
            <circle cx={100} cy={265} r={22} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} style={{filter: likeFixP > 0.5 ? `drop-shadow(0 0 8px ${C.green})` : 'none'}} />
            <text x={100} y={270} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">store</text>
            <text x={100} y={305} fill={C.green} fontSize={10} fontFamily={MONO} textAnchor="middle">anchor ✓</text>

            {/* Green laser to leaves */}
            {[180, 260, 340].map((x, i) => (
              <g key={`good-${i}`}>
                <line x1={122} y1={265} x2={x + 30} y2={290} stroke={C.green} strokeWidth={likeFixP > 0.5 ? 2.5 : 1} strokeOpacity={likeFixP > 0.5 ? 0.9 : 0.3} />
                <rect x={x} y={275} width={60} height={40} fill={likeFixP > 0.5 ? `${C.green}33` : 'transparent'} stroke={C.green} strokeWidth={2} rx={6} />
                <text x={x + 30} y={300} fill={C.green} fontSize={11} fontFamily={MONO} textAnchor="middle">store*</text>
              </g>
            ))}

            {/* Non-matched leaves dimmed */}
            {[420, 500, 580, 660].map((x, i) => (
              <g key={`dim-${i}`}>
                <rect x={x} y={275} width={60} height={40} fill="transparent" stroke={C.border} strokeWidth={1.5} strokeDasharray="3 3" rx={6} />
                <text x={x + 30} y={300} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">skip</text>
              </g>
            ))}
            <text x={410} y={345} fill={C.green} fontSize={12} fontFamily={MONO} textAnchor="middle">only matching prefix visited ──► Index Scan ✓</text>
          </svg>

          {/* pg_trgm GIN option */}
          <div style={{position: 'absolute', left: 18, right: 18, bottom: 60, padding: '12px 14px', border: `2px solid ${C.amber}`, borderRadius: 10, background: `${C.amber}0d`, opacity: clamp(trgmP)}}>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.amber, fontWeight: 700, marginBottom: 4}}>✓ Need substring search? Use pg_trgm GIN index:</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.text}}>
              CREATE EXTENSION pg_trgm; CREATE INDEX idx_trgm ON tbl USING gin (name gin_trgm_ops);
            </div>
          </div>

          {/* Bottom status */}
          <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.purple, fontWeight: 700, paddingTop: 4, borderTop: '1px solid ' + C.border, background: C.deep}}>
            <span>prefix match = index-safe</span>
            <span>leading % breaks B-Tree</span>
          </div>
        </Win>
      </div>

      {/* RIGHT: Implicit casting correction */}
      <div style={{opacity: rightP, transform: `translateX(${(1 - rightP) * 30}px)`}}>
        <Editor
          x={980}
          y={180}
          w={860}
          h={130}
          title="Implicit Casting ──► phone_no = 0100 (numeric literal)"
          lines={['WHERE phone_no = 0100   ──►  non-SARGable ✗']}
          start={t(100.5)}
          cps={0.85}
          size={17}
          accent={C.red}
          hl={0}
          hlColor={C.red}
        />

        <Win x={980} y={330} w={860} h={570} title="cast fix ──► explicit type matching" accent={C.amber} opacity={rightP}>
          <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.amber}}>
            numeric literal vs varchar column ──► implicit cast breaks index
          </div>

          {/* SVG: type mismatch visualization */}
          <svg width={820} height={420} style={{position: 'absolute', left: 20, top: 50}}>
            {/* Column type */}
            <text x={20} y={20} fill={C.amber} fontSize={13} fontFamily={MONO} fontWeight={700}>Column: phone_no (varchar)  ·  Literal: 0100 (integer)</text>

            {/* BEFORE: type mismatch */}
            <text x={20} y={55} fill={C.red} fontSize={13} fontFamily={MONO} fontWeight={700}>BEFORE: phone_no = 0100 (integer)</text>
            <rect x={20} y={70} width={780} height={120} fill={`${C.red}0d`} stroke={C.red} strokeWidth={2} strokeDasharray="6 4" rx={8} />

            {/* Column block */}
            <rect x={50} y={95} width={180} height={70} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={2} rx={8} />
            <text x={140} y={120} fill={C.amber} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">phone_no</text>
            <text x={140} y={145} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">type: varchar</text>

            {/* Cast arrow */}
            <g>
              <line x1={240} y1={130} x2={320} y2={130} stroke={C.red} strokeWidth={3} strokeDasharray="6 4" />
              <polygon points="314,124 314,136 328,130" fill={C.red} />
              <text x={280} y={115} fill={C.red} fontSize={11} fontFamily={MONO} textAnchor="middle">implicit CAST()</text>
              <text x={280} y={158} fill={C.red} fontSize={10} fontFamily={MONO} textAnchor="middle">column → integer</text>
            </g>

            {/* Literal block */}
            <rect x={340} y={95} width={180} height={70} fill={`${C.green}22`} stroke={C.green} strokeWidth={2} rx={8} />
            <text x={430} y={120} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">0100</text>
            <text x={430} y={145} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">type: integer</text>

            {/* Result */}
            <text x={620} y={120} fill={C.red} fontSize={13} fontFamily={MONO} fontWeight={700}>✗ Index</text>
            <text x={620} y={145} fill={C.red} fontSize={13} fontFamily={MONO} fontWeight={700}>  broken</text>

            {/* AFTER: explicit varchar literal */}
            <text x={20} y={240} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700}>AFTER: phone_no = "0100" (quoted varchar)</text>
            <rect x={20} y={255} width={780} height={120} fill={castFixP > 0.5 ? `${C.green}0d` : 'transparent'} stroke={C.green} strokeWidth={2} strokeDasharray={castFixP > 0.5 ? 'none' : '6 4'} rx={8} />

            {/* Column block */}
            <rect x={50} y={280} width={180} height={70} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={2} rx={8} />
            <text x={140} y={305} fill={C.amber} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">phone_no</text>
            <text x={140} y={330} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">type: varchar</text>

            {/* No cast arrow */}
            <g>
              <line x1={240} y1={315} x2={320} y2={315} stroke={C.green} strokeWidth={3} />
              <polygon points="314,309 314,321 328,315" fill={C.green} />
              <text x={280} y={300} fill={C.green} fontSize={11} fontFamily={MONO} textAnchor="middle">no cast ✓</text>
              <text x={280} y={343} fill={C.green} fontSize={10} fontFamily={MONO} textAnchor="middle">types match</text>
            </g>

            {/* Quoted literal */}
            <rect x={340} y={280} width={180} height={70} fill={`${C.green}33`} stroke={C.green} strokeWidth={3} rx={8} style={castFixP > 0.5 ? {filter: `drop-shadow(0 0 8px ${C.green})`} : undefined} />
            <text x={430} y={305} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">"0100"</text>
            <text x={430} y={330} fill={C.green} fontSize={11} fontFamily={MONO} textAnchor="middle">type: varchar ✓</text>

            {/* Result */}
            <text x={620} y={305} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700}>✓ Index</text>
            <text x={620} y={330} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700}>  Scan ✓</text>
          </svg>

          {/* Best practice callout */}
          <div style={{position: 'absolute', left: 18, right: 18, bottom: 60, padding: '12px 14px', border: `2px solid ${C.green}`, borderRadius: 10, background: `${C.green}0d`, opacity: clamp(pop(f, t(118)))}}>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700, marginBottom: 4}}>✓ Match column type explicitly</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.text}}>
              varchar column → quote the literal · integer column → use bare integer · always avoid implicit CAST() on indexed column.
            </div>
          </div>

          {/* Bottom status */}
          <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.amber, fontWeight: 700, paddingTop: 4, borderTop: '1px solid ' + C.border, background: C.deep}}>
            <span>implicit CAST() = index killer</span>
            <span>explicit type matching = index-safe</span>
          </div>
        </Win>
      </div>

      {/* Seal badge */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 920, display: 'flex', justifyContent: 'center', opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={sealP} size={36} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>LIKE Prefix Match · Explicit Type Casting ✓</div>
        </div>
      </div>

      <Caption text="LIKE 'store%' (prefix) ──► Index Scan · phone_no = '0100' (varchar) ──► Index Scan" from={t(110)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
