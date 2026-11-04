import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, EmailChip, Mix, Stage, TopBadge, Warn, Win, clamp, lin, pop, sec} from '../kit';
import {EMAILS, EMAIL_REGEX} from '../data';

// SC03 (85-130s): Regular Expressions — ~, ~*, REGEXP_MATCH
// Anchors (s): 86.1 regex | 95.0 operators | 100.0 ~ and ~* | 105.0 REGEXP_MATCH | 115.0 emails | 120.0 SKUs | 125.0 precise
const S = START.s3;
const t = (g: number) => sec(g - S);

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(86.5), 14));
  const meshP = clamp(lin(f, t(95), 16));
  const opP = clamp(lin(f, t(100), 14));
  const scanP = clamp(lin(f, t(110), sec(15)));

  // Mesh filter visualization: emails flow from left, hit the mesh, valid pass through (green) and invalid bounce off (red)
  const MESH_X = 760;

  return (
    <Stage dur={1350} inFx="left" outFx="up">
      <TopBadge text="التعابير النمطية | Regular Expressions: ~, ~*, REGEXP_MATCH" from={sec(2)} to={sec(40)} color={C.green} />

      {/* Editor with the regex query */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={180}
          w={1760}
          h={170}
          title="PostgreSQL · Email Validation Query"
          lines={[`SELECT email FROM customers WHERE email ~* '${EMAIL_REGEX}';`]}
          start={t(86.5)}
          cps={1.6}
          size={26}
          accent={C.green}
          hl={0}
          hlColor={C.green}
        />
      </div>

      {/* Operator explainer on the left */}
      <div style={{position: 'absolute', left: 80, top: 380, width: 600, opacity: opP, transform: `translateY(${(1 - opP) * 24}px)`}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, color: C.muted, marginBottom: 12}}>◆ PostgreSQL Regex Operators</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
          <div dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 18, padding: '12px 18px', border: `2px solid ${C.amber}`, borderRadius: 12, background: `${C.amber}0d`}}>
            <span style={{fontFamily: MONO, fontSize: 36, fontWeight: 700, color: C.amber, width: 60}}>~</span>
            <div>
              <div style={{fontFamily: MONO, fontSize: 22, color: C.text, fontWeight: 700}}>case-sensitive match</div>
              <div style={{fontFamily: MONO, fontSize: 18, color: C.muted}}>POSIX regex · returns rows matching</div>
            </div>
          </div>
          <div dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 18, padding: '12px 18px', border: `2px solid ${C.green}`, borderRadius: 12, background: `${C.green}0d`}}>
            <span style={{fontFamily: MONO, fontSize: 36, fontWeight: 700, color: C.green, width: 60}}>~*</span>
            <div>
              <div style={{fontFamily: MONO, fontSize: 22, color: C.text, fontWeight: 700}}>case-insensitive match</div>
              <div style={{fontFamily: MONO, fontSize: 18, color: C.muted}}>ignores case · flexible search</div>
            </div>
          </div>
          <div dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 18, padding: '12px 18px', border: `2px solid ${C.blue}`, borderRadius: 12, background: `${C.blue}0d`}}>
            <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.blue, width: 150, lineHeight: 1.2, textAlign: 'center'}}>REGEXP_MATCH</span>
            <div>
              <div style={{fontFamily: MONO, fontSize: 20, color: C.text, fontWeight: 700}}>extract matching substrings</div>
              <div style={{fontFamily: MONO, fontSize: 16, color: C.muted}}>returns matched groups as array</div>
            </div>
          </div>
        </div>
      </div>

      {/* Regex Mesh Filter visualization on the right */}
      <Win x={720} y={380} w={1120} h={520} title="Regex Mesh Filter · email validation" accent={C.green} opacity={meshP}>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 14, fontFamily: MONO, fontSize: 22, color: C.green}}>
          pattern: ~* '{EMAIL_REGEX}'
        </div>

        {/* Mesh vertical line (the filter gate) */}
        <div style={{position: 'absolute', left: 480, top: 50, bottom: 80, width: 4, background: C.green, opacity: meshP, boxShadow: `0 0 28px ${C.green}`}} />
        {/* Mesh grid pattern (dashed vertical lines suggesting a filter) */}
        <svg width={1120} height={520} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
          {[440, 460, 500, 520].map((x) => (
            <line key={x} x1={x} y1={50} x2={x} y2={440} stroke={C.green} strokeWidth={1} strokeDasharray="3 6" opacity={meshP * 0.5} />
          ))}
          <text x={490} y={460} fill={C.green} fontSize={18} fontFamily={MONO} textAnchor="middle" opacity={meshP}>mesh gate</text>
        </svg>

        {/* Email chips flow in from the left, hit the mesh, valid pass to the right (green), invalid bounce back (red) */}
        {EMAILS.slice(0, 7).map((e, i) => {
          const row = i;
          const startY = 56 + row * 48;
          // Each email starts flowing at t(98 + i*1.5) — early enough to fill the scene
          const flowStart = t(98 + i * 1.5);
          const flowP = clamp(lin(f, flowStart, sec(2.5)));
          // x position: from 30 to either 540 (passed, valid) or back to 30 (rejected, invalid)
          let endX: number;
          if (e.valid) {
            endX = 540;
          } else {
            // rejected — moves to mesh then bounces back
            endX = 30;
          }
          const x = e.valid ? 30 + (endX - 30) * flowP : (flowP < 0.5 ? 30 + (480 - 30) * (flowP * 2) : 480 - (480 - 30) * ((flowP - 0.5) * 2));
          const rejected = !e.valid && flowP > 0.5;
          const passed = e.valid && flowP > 0.8;
          const visible = flowP > 0;
          return (
            <EmailChip
              key={i}
              x={x}
              y={startY}
              w={400}
              addr={e.addr}
              valid={e.valid}
              p={visible ? 1 : 0}
              rejected={rejected}
              passed={passed}
            />
          );
        })}

        {/* Result summary bottom-right */}
        <div dir="ltr" style={{position: 'absolute', right: 24, bottom: 18, display: 'flex', gap: 14, opacity: clamp(pop(f, t(122)))}}>
          <Chip color={C.green} style={{fontSize: 22}}>✓ {EMAILS.filter((e) => e.valid).length} valid</Chip>
          <Chip color={C.red} style={{fontSize: 22}}>✗ {EMAILS.filter((e) => !e.valid).length} rejected</Chip>
        </div>
      </Win>

      <Caption text="column ~* '^pattern$' ──► Regular Expression Matching in PostgreSQL" from={t(95)} to={t(115)} />
      <Caption text="Regex Validation ──► Verifies Complex Formats (Emails, Phones, SKUs)" from={t(117)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
