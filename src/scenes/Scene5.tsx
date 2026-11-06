import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {AUDIT_TRIGGER_CODE} from '../data';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC05 (170-210s): Enterprise Audit Logging — trg_audit_customer_changes compares NEW.balance vs OLD.balance, audit_logs panel shows entries
// Anchors: 171.0 enterprise | 175.0 audit | 180.0 balance | 185.0 trigger | 192.0 automatic | 200.0 module 14 seal | 205.0 complete
const S = START.s5;
const t = (g: number) => sec(g - S);

// Audit log entries that appear automatically as triggers fire
const AUDIT_ROWS = [
  {id: 1, customer: 101, oldBal: 1000, newBal: 950, ts: '2024-11-12 14:22:03'},
  {id: 2, customer: 102, oldBal: 2400, newBal: 2520, ts: '2024-11-12 14:22:08'},
  {id: 3, customer: 103, oldBal: 5800, newBal: 6090, ts: '2024-11-12 14:22:14'},
  {id: 4, customer: 104, oldBal: 1750, newBal: 1838, ts: '2024-11-12 14:22:19'},
  {id: 5, customer: 105, oldBal: 3200, newBal: 3360, ts: '2024-11-12 14:22:25'},
];

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(171.5), 14));
  const auditP = pop(f, t(175));
  const balanceP = pop(f, t(180));
  const trigP = pop(f, t(185));
  // Trigger fires automatically — audit rows appear
  const autoProg = clamp(lin(f, t(192), sec(8)));
  const autoP = pop(f, t(192));
  const sealP = pop(f, t(200));
  const completeP = pop(f, t(205));

  return (
    <Stage dur={1200} inFx="morph" outFx="fade">
      <TopBadge text="تدقيق المؤسسات التلقائي | Enterprise Audit Logging — trg_audit_customer_changes (NEW vs OLD · audit_logs)" from={sec(1)} to={sec(38)} color={C.green} />

      {/* LEFT: Enterprise audit trigger editor */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={820}
          h={380}
          title="Enterprise · CREATE FUNCTION fn_log_balance_change + CREATE TRIGGER trg_audit_customer_changes"
          lines={AUDIT_TRIGGER_CODE.concat([
            '',
            '-- fires AFTER UPDATE on store_customers',
            '-- compares NEW.balance vs OLD.balance',
            '-- inserts audit_logs row automatically',
          ])}
          start={t(171.5)}
          cps={0.4}
          size={13}
          accent={C.green}
          hl={9}
          hlColor={C.purple}
        />
      </div>

      {/* Trigger characteristics chips */}
      <div style={{position: 'absolute', left: 80, top: 570, width: 820, opacity: clamp(auditP)}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.muted, marginBottom: 8}}>◆ Enterprise audit characteristics:</div>
        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>
            <Check p={auditP} size={16} color={C.green} /> AFTER UPDATE
          </Chip>
          <Chip color={C.amber} style={{fontSize: 14, padding: '4px 12px'}}>
            <Check p={balanceP} size={16} color={C.amber} /> NEW vs OLD
          </Chip>
          <Chip color={C.purple} style={{fontSize: 14, padding: '4px 12px'}}>
            <Check p={trigP} size={16} color={C.purple} /> trg_audit_customer_changes
          </Chip>
          <Chip color={C.blue} style={{fontSize: 14, padding: '4px 12px'}}>
            <Check p={autoP} size={16} color={C.blue} /> audit_logs auto-insert ✓
          </Chip>
        </div>
      </div>

      {/* Automatic audit logging badge */}
      <div style={{position: 'absolute', left: 80, top: 660, width: 820, opacity: clamp(autoP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 22px', border: `3px solid ${C.blue}`, borderRadius: 16, background: `${C.blue}0d`, boxShadow: `0 0 24px ${C.blue}33`}}>
          <Check p={autoP} size={44} color={C.blue} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.blue, fontWeight: 700}}>Automatic Audit Logging ✓</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginTop: 2}}>Every balance change captured · zero app code · tamper-evident history · compliance-ready</div>
          </div>
          <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, padding: '6px 16px', border: `2px solid ${C.blue}`, borderRadius: 999, background: `${C.blue}1a`}}>
            <Check p={completeP} size={22} color={C.blue} />
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.blue, fontWeight: 700}}>Auto ✓</span>
          </div>
        </div>
      </div>

      {/* Module 14 Mastery Seal at bottom-left */}
      <div style={{position: 'absolute', left: 80, top: 760, width: 820, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 22px', border: `3px solid ${C.green}`, borderRadius: 16, background: `${C.green}0d`, boxShadow: `0 0 24px ${C.green}33`}}>
          <Check p={sealP} size={44} color={C.green} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.green, fontWeight: 700}}>Module 14 Mastery Seal ✓</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginTop: 2}}>Triggers · BEFORE/AFTER · INSTEAD OF · NEW/OLD · RETURN NULL · Audit Automation — complete</div>
          </div>
        </div>
      </div>

      {/* RIGHT: Audit logs panel showing automatic entries */}
      <Win x={940} y={170} w={900} h={720} title="audit_logs ──► AFTER trigger auto-inserts row on every balance change" accent={C.green} opacity={clamp(auditP)}>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
          trg_audit_customer_changes fires ──► IF NEW.balance ≠ OLD.balance ──► INSERT audit_logs (auto)
        </div>

        <div style={{position: 'absolute', right: 24, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.amber} style={{fontSize: 13, padding: '4px 12px'}}>{autoProg > 0.05 && autoProg < 0.99 ? 'Auditing...' : 'idle'}</Chip>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>{autoProg > 0.95 ? '✓ Audit Complete' : '...'}</Chip>
        </div>

        {/* SVG: audit flow + audit_logs table */}
        <svg width={860} height={600} style={{position: 'absolute', left: 20, top: 60}}>
          {/* UPDATE source (top-left) */}
          <g style={{opacity: clamp(auditP)}}>
            <rect x={20} y={20} width={260} height={60} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 8px ${C.amber}44)`}} />
            <text x={150} y={42} fill={C.amber} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">UPDATE store_customers</text>
            <text x={150} y={62} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">SET balance = balance * 1.05</text>
          </g>

          {/* Arrow: UPDATE -> store_customers */}
          <g style={{opacity: clamp(auditP)}}>
            <line x1={280} y1={50} x2={380} y2={50} stroke={C.green} strokeWidth={3.5} strokeDasharray="8 4" opacity={0.4 + 0.6 * autoProg} />
            <polygon points={`${380 + autoProg * 80 - 8},42 ${380 + autoProg * 80 - 8},58 ${380 + autoProg * 80 + 4},50`} fill={C.green} />
            <text x={330} y={40} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">update ──►</text>
          </g>

          {/* store_customers table (top-right) */}
          <g style={{opacity: clamp(auditP)}}>
            <rect x={620} y={20} width={220} height={60} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} />
            <text x={730} y={42} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">store_customers</text>
            <text x={730} y={62} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">balance updated · COMMIT</text>
          </g>

          {/* AFTER trigger fires (center) */}
          <g style={{opacity: clamp(trigP)}}>
            <rect x={280} y={100} width={300} height={50} fill={`${C.purple}33`} stroke={C.purple} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 8px ${C.purple}44)`}} />
            <text x={430} y={122} fill={C.purple} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">AFTER UPDATE — trg_audit_customer_changes</text>
            <text x={430} y={140} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">IF NEW.balance ≠ OLD.balance THEN INSERT</text>

            {/* Arrow down */}
            <line x1={430} y1={150} x2={430} y2={180} stroke={C.purple} strokeWidth={3} strokeDasharray="5 3" opacity={0.7} />
            <polygon points="424,176 436,176 430,186" fill={C.purple} />
          </g>

          {/* audit_logs table */}
          <g style={{opacity: clamp(balanceP)}}>
            <text x={20} y={210} fill={C.text} fontSize={14} fontFamily={MONO} fontWeight={700}>audit_logs (auto-inserted by trigger)</text>

            {/* Table header */}
            <rect x={20} y={220} width={820} height={28} fill={C.deep} stroke={C.border} strokeWidth={1} rx={4} />
            <text x={50} y={238} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700}>ID</text>
            <text x={120} y={238} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700}>CUSTOMER</text>
            <text x={280} y={238} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700}>OLD_BAL</text>
            <text x={420} y={238} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700}>NEW_BAL</text>
            <text x={560} y={238} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700}>CHANGED_AT</text>
            <text x={780} y={238} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700}>Δ</text>

            {/* Audit rows */}
            {AUDIT_ROWS.map((row, i) => {
              const rowP = clamp((autoProg - i * 0.1) * 1.4);
              return (
                <g key={i} style={{opacity: clamp(rowP)}}>
                  <rect x={20} y={250 + i * 34} width={820} height={30} fill={`${C.green}11`} stroke={C.border} strokeWidth={0.5} rx={4} />
                  <text x={50} y={270 + i * 34} fill={C.amber} fontSize={11} fontFamily={MONO} fontWeight={700}>{row.id}</text>
                  <text x={120} y={270 + i * 34} fill={C.text} fontSize={11} fontFamily={MONO}>{row.customer}</text>
                  <text x={280} y={270 + i * 34} fill={C.muted} fontSize={11} fontFamily={MONO}>{row.oldBal}</text>
                  <text x={420} y={270 + i * 34} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700}>{row.newBal}</text>
                  <text x={560} y={270 + i * 34} fill={C.muted} fontSize={10} fontFamily={MONO}>{row.ts}</text>
                  <text x={780} y={270 + i * 34} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700}>+{row.newBal - row.oldBal}</text>
                </g>
              );
            })}

            {/* Audit complete indicator */}
            <g style={{opacity: clamp(autoProg > 0.95 ? pop(f, t(198)) : 0)}}>
              <rect x={620} y={426} width={220} height={30} fill={`${C.green}33`} stroke={C.green} strokeWidth={2} rx={6} style={{filter: `drop-shadow(0 0 8px ${C.green}66)`}} />
              <text x={730} y={446} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ 5 audit entries auto-logged</text>
            </g>
          </g>

          {/* Compliance banner */}
          <g style={{opacity: clamp(autoP)}}>
            <text x={20} y={480} fill={C.text} fontSize={14} fontFamily={MONO} fontWeight={700}>Compliance benefits:</text>

            <rect x={20} y={495} width={195} height={50} fill={`${C.green}22`} stroke={C.green} strokeWidth={2} rx={6} />
            <text x={117} y={518} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">Tamper-evident</text>
            <text x={117} y={536} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">trigger writes</text>

            <rect x={225} y={495} width={195} height={50} fill={`${C.green}22`} stroke={C.green} strokeWidth={2} rx={6} />
            <text x={322} y={518} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">Zero app code</text>
            <text x={322} y={536} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">automatic capture</text>

            <rect x={430} y={495} width={195} height={50} fill={`${C.green}22`} stroke={C.green} strokeWidth={2} rx={6} />
            <text x={527} y={518} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">Full history</text>
            <text x={527} y={536} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">every change tracked</text>

            <rect x={635} y={495} width={195} height={50} fill={`${C.green}22`} stroke={C.green} strokeWidth={2} rx={6} />
            <text x={732} y={518} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">Audit-ready</text>
            <text x={732} y={536} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">SOX / GDPR / HIPAA</text>
          </g>

          {/* Result banner */}
          {autoProg > 0.95 ? (
            <g style={{opacity: clamp(pop(f, t(200)))}}>
              <rect x={120} y={555} width={620} height={36} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 10px ${C.green}66)`}} />
              <text x={430} y={578} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ Enterprise Audit Complete · Automatic Logging · Module 14 Mastery Seal · Production-Ready</text>
            </g>
          ) : null}
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.amber}}>UPDATE store_customers</span>
          <span style={{color: autoProg >= 1 ? C.green : C.amber}}>{autoProg >= 1 ? '✓ audit complete' : autoProg > 0 ? `auditing... ${Math.round(autoProg * 100)}%` : 'idle'}</span>
          <span style={{color: C.green}}>audit_logs ✓</span>
        </div>
      </Win>

      <Caption text="AFTER UPDATE ──► trg_audit_customer_changes ──► NEW vs OLD ──► audit_logs ──► Module 14 ✓" from={t(185)} to={sec(38)} tone="ok" />
    </Stage>
  );
};
