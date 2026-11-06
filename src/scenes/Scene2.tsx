import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC02 (40-85s): Abstraction & Security — Views mask sensitive columns behind a security wall
// Anchors: 41.0 abstraction | 45.0 security | 52.0 JOIN | 60.0 mask | 68.0 wall | 75.0 green | 80.0 seal
const S = START.s2;
const t = (g: number) => sec(g - S);

// Sensitive columns exposed in the direct-access path
const DIRECT_COLS = [
  {name: 'user_id', masked: false},
  {name: 'email', masked: false},
  {name: 'password_hash', masked: false, danger: true},
  {name: 'ssn', masked: false, danger: true},
  {name: 'credit_card', masked: false, danger: true},
];

// Columns exposed through the clean view
const VIEW_cols = [
  {name: 'user_id'},
  {name: 'email'},
  {name: 'display_name'},
];

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const leftP = clamp(lin(f, t(41.5), 14));
  const rightP = clamp(lin(f, t(45), 14));
  const joinP = clamp(lin(f, t(52), 14));
  const maskP = pop(f, t(60));
  const wallP = pop(f, t(68));
  const greenP = pop(f, t(75));
  const sealP = pop(f, t(80));

  // Masking reveal animation: password column gets redacted behind wall
  const maskProg = clamp(lin(f, t(60), sec(8)));

  // Wall rise animation
  const wallRise = clamp(lin(f, t(68), sec(6)));
  const wallY = lerp(420, 0, wallRise);

  return (
    <Stage dur={1350} inFx="left" outFx="left">
      <TopBadge text="التجريد والأمان | Abstraction &amp; Security — Views Mask Sensitive Columns" from={sec(2)} to={sec(40)} color={C.purple} />

      {/* LEFT: Unsecure direct access with complex JOIN + exposed password column */}
      <Win x={80} y={170} w={860} h={720} title="unsecure direct access ──► complex JOIN exposes password_hash (RED)" accent={C.red} opacity={leftP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.red}}>
          application queries base tables directly ──► password_hash, ssn, credit_card exposed
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.red} style={{fontSize: 13, padding: '4px 12px'}}>Direct Access</Chip>
          <Chip color={C.amber} style={{fontSize: 13, padding: '4px 12px'}}>Complex JOIN</Chip>
          <Chip color={C.red} style={{fontSize: 13, padding: '4px 12px'}}>Leak ✗</Chip>
        </div>

        {/* Complex JOIN editor (red border) */}
        <div style={{position: 'absolute', left: 18, right: 18, top: 56}}>
          <Editor
            x={0}
            y={0}
            w={824}
            h={210}
            title="unsecure_app.sql · direct table access"
            lines={[
              'SELECT u.user_id, u.email, u.password_hash,',
              '       u.ssn, u.credit_card, p.profile_name',
              'FROM users u',
              'JOIN profiles p ON u.user_id = p.user_id;',
            ]}
            start={t(52)}
            cps={0.6}
            size={14}
            accent={C.red}
            hl={1}
            hlColor={C.red}
          />
        </div>

        {/* Result set with red password column */}
        <div style={{position: 'absolute', left: 18, right: 18, top: 290}}>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginBottom: 6}}>result set · sensitive columns exposed:</div>
          <svg width={824} height={300} style={{position: 'absolute', left: 0, top: 24}}>
            {/* Header row */}
            <rect x={0} y={0} width={824} height={36} fill={C.deep} stroke={C.border} strokeWidth={2} rx={6} />
            {DIRECT_COLS.map((col, i) => {
              const x = 12 + i * 162;
              return (
                <text key={i} x={x + 76} y={23} fill={col.danger ? C.red : C.muted} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">{col.name}</text>
              );
            })}

            {/* Data rows (3 rows) */}
            {[0, 1, 2].map((r) => (
              <g key={r}>
                <rect x={0} y={40 + r * 38} width={824} height={36} fill={r % 2 === 0 ? `${C.card}` : `${C.deep}`} stroke={C.border} strokeWidth={1} rx={4} />
                {/* Normal cols */}
                <text x={88} y={62 + r * 38} fill={C.text} fontSize={12} fontFamily={MONO} textAnchor="middle">{101 + r}</text>
                <text x={250} y={62 + r * 38} fill={C.text} fontSize={12} fontFamily={MONO} textAnchor="middle">{['ahmed@x.io', 'sara@y.io', 'omar@z.io'][r]}</text>
                {/* Danger cols (red, exposed) */}
                <rect x={332 + 0 * 162} y={46 + r * 38} width={150} height={24} fill={`${C.red}22`} stroke={C.red} strokeWidth={1.5} rx={4} />
                <text x={410} y={62 + r * 38} fill={C.red} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">$2b$12$..EXPOSED..</text>
                <rect x={332 + 1 * 162} y={46 + r * 38} width={150} height={24} fill={`${C.red}22`} stroke={C.red} strokeWidth={1.5} rx={4} />
                <text x={572} y={62 + r * 38} fill={C.red} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">***-**-{1000 + r}</text>
                <rect x={332 + 2 * 162} y={46 + r * 38} width={150} height={24} fill={`${C.red}22`} stroke={C.red} strokeWidth={1.5} rx={4} />
                <text x={734} y={62 + r * 38} fill={C.red} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">4111...{1000 + r}</text>
              </g>
            ))}

            {/* Warning banner */}
            <g style={{opacity: clamp(pop(f, t(58)))}}>
              <rect x={120} y={200} width={580} height={44} fill={`${C.red}22`} stroke={C.red} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 10px ${C.red}66)`}} />
              <text x={410} y={228} fill={C.red} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">⚠ Sensitive data leaked to application layer</text>
            </g>
          </svg>
        </div>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.red, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>direct JOIN</span>
          <span>password_hash ✗</span>
          <span>LEAK ✗</span>
        </div>
      </Win>

      {/* RIGHT: Purple security wall masking sensitive fields, clean view in green */}
      <Win x={980} y={170} w={860} h={720} title="secure view access ──► purple wall masks sensitive columns" accent={C.purple} opacity={rightP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.purple}}>
          application queries the clean view ──► purple wall hides password_hash, ssn, credit_card
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.purple} style={{fontSize: 13, padding: '4px 12px'}}>Security Wall</Chip>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>Clean View</Chip>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>Safe ✓</Chip>
        </div>

        {/* Clean view editor (green) */}
        <div style={{position: 'absolute', left: 18, right: 18, top: 56}}>
          <Editor
            x={0}
            y={0}
            w={824}
            h={210}
            title="secure_app.sql · clean view access"
            lines={[
              'CREATE VIEW vw_clean_data AS',
              '  SELECT user_id, email, display_name',
              '  FROM users JOIN profiles USING (user_id);',
              '',
              'SELECT * FROM vw_clean_data;',
            ]}
            start={t(60)}
            cps={0.6}
            size={14}
            accent={C.green}
            hl={4}
            hlColor={C.green}
          />
        </div>

        {/* SVG: security wall masking + clean view result */}
        <svg width={824} height={360} style={{position: 'absolute', left: 18, top: 290}}>
          {/* Base table representation behind wall (faded) */}
          <rect x={20} y={40} width={780} height={120} fill={`${C.deep}`} stroke={C.border} strokeWidth={2} strokeDasharray="4 4" rx={8} opacity={0.6} />
          <text x={410} y={62} fill={C.muted} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">users table (full · hidden behind wall)</text>
          {/* All columns faded */}
          {DIRECT_COLS.map((col, i) => {
            const x = 40 + i * 150;
            return (
              <g key={i}>
                <rect x={x} y={76} width={130} height={70} fill={`${C.red}0d`} stroke={C.border} strokeWidth={1.5} rx={6} />
                <text x={x + 65} y={96} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">{col.name}</text>
                <text x={x + 65} y={120} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle" opacity={0.5}>{col.danger ? '****' : 'value'}</text>
              </g>
            );
          })}

          {/* Purple security wall (rises from below) */}
          <g style={{opacity: clamp(wallP)}}>
            <rect x={20} y={40 + wallY * 0.3} width={780} height={120} fill={`${C.purple}22`} stroke={C.purple} strokeWidth={4} rx={8} style={{filter: `drop-shadow(0 0 ${12 + wallRise * 8}px ${C.purple})`}} />
            <text x={410} y={100 + wallY * 0.3} fill={C.purple} fontSize={18} fontFamily={MONO} fontWeight={700} textAnchor="middle">🛡 Security Wall (View Definition)</text>
            <text x={410} y={130 + wallY * 0.3} fill={C.purple} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">masks: password_hash · ssn · credit_card</text>
          </g>

          {/* Masked out indicator */}
          <g style={{opacity: clamp(maskP)}}>
            <text x={410} y={180} fill={C.purple} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ sensitive columns hidden · masked at view boundary</text>
          </g>

          {/* Clean view result (green, only safe columns) */}
          <g style={{opacity: clamp(greenP)}}>
            <text x={410} y={210} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">▼ clean view result (application sees only this) ▼</text>

            {/* Header */}
            <rect x={120} y={220} width={580} height={36} fill={C.deep} stroke={C.green} strokeWidth={2} rx={6} />
            {VIEW_cols.map((col, i) => {
              const x = 120 + i * 193;
              return (
                <text key={i} x={x + 96} y={243} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">{col.name}</text>
              );
            })}

            {/* Data rows (3 rows, safe data only) */}
            {[0, 1, 2].map((r) => (
              <g key={r}>
                <rect x={120} y={260 + r * 32} width={580} height={28} fill={r % 2 === 0 ? `${C.green}0d` : `${C.deep}`} stroke={C.green} strokeWidth={1} opacity={0.7} rx={4} />
                <text x={216} y={278 + r * 32} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">{101 + r}</text>
                <text x={409} y={278 + r * 32} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">{['ahmed@x.io', 'sara@y.io', 'omar@z.io'][r]}</text>
                <text x={602} y={278 + r * 32} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">{['Ahmed K.', 'Sara M.', 'Omar A.'][r]}</text>
              </g>
            ))}

            {/* Safe badge */}
            <rect x={220} y={360} width={380} height={40} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={20} style={{filter: `drop-shadow(0 0 12px ${C.green}66)`}} />
            <text x={410} y={386} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ Application Sees Only Safe Columns · Zero Leakage</text>
          </g>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.purple}}>purple wall</span>
          <span style={{color: C.purple}}>masked ✓</span>
          <span style={{color: C.green}}>clean view ✓</span>
        </div>
      </Win>

      {/* Seal badge bottom-center */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 910, display: 'flex', justifyContent: 'center', opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '12px 26px', border: `3px solid ${C.purple}`, borderRadius: 18, background: `${C.purple}0d`, boxShadow: `0 0 32px ${C.purple}44`}}>
          <Check p={sealP} size={48} color={C.purple} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, color: C.purple, fontWeight: 700}}>Abstraction &amp; Security Seal ✓</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginTop: 2}}>View = abstraction boundary · masks sensitive columns · apps see only safe projection</div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, marginLeft: 16, padding: '6px 16px', border: `2px solid ${C.green}`, borderRadius: 999, background: `${C.green}1a`}}>
            <Check p={greenP} size={22} color={C.green} />
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700}}>Safe ✓</span>
          </div>
        </div>
      </div>

      <Caption text="Direct JOIN ──► Leak ──► Purple Security Wall ──► Masked Columns ──► Clean View ✓" from={t(60)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
