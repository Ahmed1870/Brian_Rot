import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Warn, Win, clamp, lin, pop, sec} from '../kit';

// SC03 (85-130s): WITH CHECK OPTION — LOCAL vs CASCADED
// Anchors: 86.0 CHECK OPTION | 90.0 WHERE | 95.0 INSERT | 100.0 reject | 110.0 error | 118.0 LOCAL | 125.0 CASCADED
const S = START.s3;
const t = (g: number) => sec(g - S);

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(86.5), 14));
  const shieldP = clamp(lin(f, t(95), 16));
  const errorP = pop(f, t(100));
  const compareP = clamp(lin(f, t(118), 16));

  return (
    <Stage dur={1350} inFx="left" outFx="up">
      <TopBadge text="حوكمة السلامة | WITH CHECK OPTION (LOCAL vs CASCADED)" from={sec(2)} to={sec(40)} color={C.purple} />

      {/* SQL editor at top — full width */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={180}
          w={1760}
          h={210}
          title="PostgreSQL · WITH CHECK OPTION"
          lines={[
            'CREATE VIEW v_active_products AS',
            '  SELECT product_id, name, price, status',
            '  FROM products',
            "  WHERE status = 'active'",
            '  WITH CASCADED CHECK OPTION;',
          ]}
          start={t(86.5)}
          cps={0.8}
          size={18}
          accent={C.purple}
          hl={4}
          hlColor={C.purple}
        />
      </div>

      {/* LEFT: Valid INSERT (passes shield) */}
      <Win x={80} y={390} w={860} h={510} title="valid INSERT · passes CHECK OPTION" accent={C.green} opacity={clamp(lin(f, t(95), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
          ✓ status = 'active' → allowed
        </div>
        <div style={{position: 'absolute', left: 18, right: 18, top: 50}}>
          <div dir="ltr" style={{padding: '12px 14px', border: `2px solid ${C.green}`, borderRadius: 10, background: `${C.green}0d`, fontFamily: MONO, fontSize: 16, color: C.text}}>
            <div style={{color: '#64748B', fontSize: 12, marginBottom: 4}}>-- valid insert</div>
            <div>INSERT INTO v_active_products (product_id, name, price, status)</div>
            <div>VALUES (109, 'New Tablet', 350, 'active');</div>
          </div>

          {/* Shield pass visualization */}
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 30, gap: 20}}>
            <div style={{padding: '10px 16px', border: `2px solid ${C.green}`, borderRadius: 10, background: `${C.green}0d`, fontFamily: MONO, fontSize: 16, color: C.green, fontWeight: 700}}>INSERT</div>
            <svg width={60} height={40}>
              <line x1={5} y1={20} x2={50} y2={20} stroke={C.green} strokeWidth={3} strokeDasharray="4 3" />
              <polygon points="45,14 45,26 55,20" fill={C.green} />
            </svg>
            <div style={{padding: '10px 16px', border: `2px solid ${C.purple}`, borderRadius: 10, background: `${C.purple}0d`, fontFamily: MONO, fontSize: 16, color: C.purple, fontWeight: 700}}>🛡 SHIELD</div>
            <svg width={60} height={40}>
              <line x1={5} y1={20} x2={50} y2={20} stroke={C.green} strokeWidth={3} strokeDasharray="4 3" />
              <polygon points="45,14 45,26 55,20" fill={C.green} />
            </svg>
            <div style={{padding: '10px 16px', border: `2px solid ${C.green}`, borderRadius: 10, background: `${C.green}22`, fontFamily: MONO, fontSize: 16, color: C.green, fontWeight: 700}}>✓ ACCEPTED</div>
          </div>

          {/* Result */}
          <div style={{marginTop: 30, display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', border: `2px solid ${C.green}`, borderRadius: 10, background: `${C.green}0d`}}>
            <Check p={1} size={36} color={C.green} />
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>INSERT 0 1 · row added to base table</div>
          </div>
        </div>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: MONO, fontSize: 16, color: C.green, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          ✓ status='active' matches WHERE → pass
        </div>
      </Win>

      {/* RIGHT: Invalid INSERT (blocked by shield) */}
      <Win x={980} y={390} w={860} h={510} title="invalid INSERT · blocked by CHECK OPTION" accent={C.red} opacity={shieldP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.red}}>
          ✗ status = 'discontinued' → BLOCKED
        </div>
        <div style={{position: 'absolute', left: 18, right: 18, top: 50}}>
          <div dir="ltr" style={{padding: '12px 14px', border: `2px solid ${C.red}`, borderRadius: 10, background: `${C.red}0d`, fontFamily: MONO, fontSize: 16, color: C.text}}>
            <div style={{color: '#64748B', fontSize: 12, marginBottom: 4}}>-- invalid insert</div>
            <div>INSERT INTO v_active_products (product_id, name, price, status)</div>
            <div>VALUES (110, 'Old Item', 50, 'discontinued');</div>
          </div>

          {/* Shield block visualization */}
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 30, gap: 20}}>
            <div style={{padding: '10px 16px', border: `2px solid ${C.red}`, borderRadius: 10, background: `${C.red}0d`, fontFamily: MONO, fontSize: 16, color: C.red, fontWeight: 700}}>INSERT</div>
            <svg width={60} height={40}>
              <line x1={5} y1={20} x2={45} y2={20} stroke={C.red} strokeWidth={3} strokeDasharray="4 3" />
              <line x1={45} y1={10} x2={45} y2={30} stroke={C.purple} strokeWidth={4} />
            </svg>
            <div style={{padding: '10px 16px', border: `2px solid ${C.purple}`, borderRadius: 10, background: `${C.purple}0d`, fontFamily: MONO, fontSize: 16, color: C.purple, fontWeight: 700, boxShadow: `0 0 20px ${C.purple}`}}>🛡 SHIELD</div>
            <div style={{padding: '10px 16px', border: `2px solid ${C.red}`, borderRadius: 10, background: `${C.red}22`, fontFamily: MONO, fontSize: 16, color: C.red, fontWeight: 700}}>✗ REJECTED</div>
          </div>

          {/* Error box */}
          <div style={{marginTop: 20, display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', border: `2px solid ${C.red}`, borderRadius: 10, background: `${C.red}14`, opacity: clamp(errorP)}}>
            <Warn size={36} color={C.red} />
            <div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.red, fontWeight: 700}}>ERROR: new row violates</div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.red, fontWeight: 700}}>check option for view</div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.muted, marginTop: 4}}>INSERT blocked · 0 rows affected</div>
            </div>
          </div>
        </div>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: MONO, fontSize: 16, color: C.red, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          ✗ status='discontinued' ≠ WHERE → rejected
        </div>
      </Win>

      {/* LOCAL vs CASCADED comparison at bottom */}
      <div style={{position: 'absolute', left: 80, top: 920, width: 1760, opacity: compareP, display: 'flex', gap: 28, justifyContent: 'center'}}>
        <Chip color={C.blue} style={{fontSize: 22}}>LOCAL → checks current view only</Chip>
        <Chip color={C.purple} style={{fontSize: 22}}>CASCADED (default) → checks all nested views</Chip>
      </div>

      <Caption text="WITH CHECK OPTION ──► Enforces WHERE Condition on INSERT & UPDATE" from={t(90)} to={t(108)} />
      <Caption text="ERROR: new row violates check option for view" from={t(110)} to={sec(44)} tone="danger" />
    </Stage>
  );
};
