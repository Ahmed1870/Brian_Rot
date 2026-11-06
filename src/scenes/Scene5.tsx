import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {ENTERPRISE_TX_LINES} from '../data';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC05 (170-210s): Enterprise Resilient Checkout — Coupon Rollback, Main Order Preserved
// Anchors: 171.0 enterprise | 175.0 checkout | 180.0 coupon | 185.0 rollback | 192.0 commit | 200.0 seal | 205.0 resilient
const S = START.s5;
const t = (g: number) => sec(g - S);

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(171.5), 14));
  const reportP = clamp(lin(f, t(175), 14));
  const couponP = clamp(lin(f, t(180), sec(8)));
  // Coupon rollback animation
  const rollbackProg = clamp(lin(f, t(185), sec(8)));
  // Commit animation
  const commitProg = clamp(lin(f, t(192), sec(8)));
  const sealP = pop(f, t(200));
  const resP = pop(f, t(205));

  // Order amount interp (illustrative)
  const orderTotal = 1500;
  const invalidDiscount = lerp(200, 0, rollbackProg); // discount reverted to 0
  const finalTotal = orderTotal - invalidDiscount;

  return (
    <Stage dur={1200} inFx="morph" outFx="fade">
      <TopBadge text="تطبيق مؤسسي | Enterprise Resilient Checkout — SAVEPOINT-Protected Coupon Apply" from={sec(1)} to={sec(38)} color={C.green} />

      {/* LEFT: Editor with enterprise checkout transaction */}
      <Editor
        x={80}
        y={170}
        w={880}
        h={340}
        title="Enterprise · resilient checkout transaction (manzooma_store_db)"
        lines={ENTERPRISE_TX_LINES.concat([
          '',
          '-- main order commits · coupon UPDATE reverted',
          '-- transaction stays resilient through invalid coupon',
        ])}
        start={t(171.5)}
        cps={0.5}
        size={15}
        accent={C.green}
        hl={3}
        hlColor={C.red}
      />

      {/* RIGHT: Executive report panel */}
      <Win x={1000} y={170} w={840} h={340} title="executive report · resilient checkout atomicity" accent={C.green} opacity={reportP}>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 12, fontFamily: MONO, fontSize: 20, color: C.green}}>
          Resilient Checkout · Module 13 Capstone
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 46, right: 24, display: 'flex', gap: 8, flexWrap: 'wrap'}}>
          <Chip color={C.blue} style={{fontSize: 14, padding: '4px 12px'}}>order paid ✓</Chip>
          <Chip color={C.amber} style={{fontSize: 14, padding: '4px 12px'}}>SAVEPOINT coupon_apply</Chip>
          <Chip color={C.red} style={{fontSize: 14, padding: '4px 12px'}}>invalid coupon ✗</Chip>
          <Chip color={C.purple} style={{fontSize: 14, padding: '4px 12px'}}>ROLLBACK TO SAVEPOINT</Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>COMMIT ✓</Chip>
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 24, right: 24, top: 110, padding: '12px 14px', border: `1px solid ${C.border}`, borderRadius: 8, background: C.deep, fontFamily: MONO, fontSize: 13, color: C.text, lineHeight: 1.5}}>
          <span style={{color: '#64748B'}}>resilient strategy:</span> SAVEPOINT before risky coupon UPDATE ──► on invalid coupon ──► ROLLBACK TO SAVEPOINT ──► COMMIT main order anyway. Zero torn checkout · graceful degradation.
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 24, right: 24, top: 200, display: 'flex', gap: 12}}>
          <div style={{flex: 1, padding: '10px 12px', border: `2px solid ${C.green}`, borderRadius: 10, background: `${C.green}0d`}}>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.green, fontWeight: 700}}>Order 901</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 12, color: C.text}}>status: pending → paid ✓</div>
          </div>
          <div style={{flex: 1, padding: '10px 12px', border: `2px solid ${rollbackProg > 0.5 ? C.red : C.amber}`, borderRadius: 10, background: `${rollbackProg > 0.5 ? C.red : C.amber}0d`}}>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: rollbackProg > 0.5 ? C.red : C.amber, fontWeight: 700}}>Coupon INVALID</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 12, color: C.text}}>discount: {invalidDiscount.toFixed(0)} → 0 (reverted)</div>
          </div>
          <div style={{flex: 1, padding: '10px 12px', border: `2px solid ${C.blue}`, borderRadius: 10, background: `${C.blue}0d`}}>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.blue, fontWeight: 700}}>Final Total</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 12, color: C.text}}>${finalTotal.toFixed(0)}</div>
          </div>
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 24, right: 24, bottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{fontFamily: MONO, fontSize: 18, color: C.text, fontWeight: 700}}>
            resilient block ✓
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, opacity: clamp(sealP), transform: `scale(${0.85 + 0.15 * clamp(sealP)})`}}>
            <Check p={sealP} size={36} color={C.green} />
            <div style={{fontFamily: MONO, fontSize: 16, color: C.green, fontWeight: 700}}>Module 13 Seal ✓</div>
          </div>
        </div>
      </Win>

      {/* BOTTOM: Checkout execution panel */}
      <Win x={80} y={530} w={1760} h={380} title="resilient checkout execution ──► main order succeeds · coupon reverted" accent={C.green} opacity={couponP}>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 12, fontFamily: MONO, fontSize: 20, color: C.green}}>
          order commits anyway ──► coupon UPDATE reverted via ROLLBACK TO SAVEPOINT
        </div>

        {/* Three-stage execution timeline */}
        <div style={{position: 'absolute', left: 24, right: 24, top: 60, display: 'flex', gap: 14}}>
          {/* Stage 1: order paid */}
          <div style={{flex: 1, padding: '14px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`, opacity: clamp(couponP), boxShadow: `0 0 20px ${C.green}33`}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
              <span style={{fontFamily: MONO, fontSize: 16, color: C.green, fontWeight: 700}}>① UPDATE order → paid</span>
              <Check p={1} size={26} color={C.green} />
            </div>
            <div dir="ltr" style={{padding: '8px 10px', border: `1px solid ${C.border}`, borderRadius: 6, background: C.deep, fontFamily: MONO, fontSize: 11, color: C.text, minHeight: 56, whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>
              {`UPDATE store_orders\nSET status = 'paid'\nWHERE order_id = 901;`}
            </div>
            <div style={{marginTop: 8, fontFamily: MONO, fontSize: 12, color: C.green, fontWeight: 700}}>→ order status: paid ✓</div>
          </div>

          {/* Stage 2: SAVEPOINT + coupon attempt */}
          <div style={{flex: 1, padding: '14px', border: `2px solid ${C.amber}`, borderRadius: 14, background: `${C.amber}0d`, opacity: clamp(couponP)}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
              <span style={{fontFamily: MONO, fontSize: 16, color: C.amber, fontWeight: 700}}>② SAVEPOINT coupon_apply</span>
              <svg width={26} height={26} viewBox="0 0 26 26">
                <circle cx={13} cy={13} r={11} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={2.5} />
                <circle cx={13} cy={13} r={4} fill={C.amber} />
              </svg>
            </div>
            <div dir="ltr" style={{padding: '8px 10px', border: `1px solid ${C.border}`, borderRadius: 6, background: C.deep, fontFamily: MONO, fontSize: 11, color: C.text, minHeight: 56, whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>
              {`SAVEPOINT coupon_apply;\nUPDATE store_orders\nSET discount = 200\nWHERE coupon_code = 'INVALID';`}
            </div>
            <div style={{marginTop: 8, fontFamily: MONO, fontSize: 12, color: C.red, fontWeight: 700}}>→ coupon UPDATE fails ✗</div>
          </div>

          {/* Stage 3: ROLLBACK TO SAVEPOINT + COMMIT */}
          <div style={{flex: 1, padding: '14px', border: `2px solid ${C.purple}`, borderRadius: 14, background: `${C.purple}0d`, opacity: clamp(rollbackProg), boxShadow: rollbackProg > 0.5 ? `0 0 20px ${C.purple}44` : 'none'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
              <span style={{fontFamily: MONO, fontSize: 16, color: C.purple, fontWeight: 700}}>③ ROLLBACK TO + COMMIT</span>
              <svg width={26} height={26} viewBox="0 0 26 26">
                <circle cx={13} cy={13} r={11} fill={`${C.purple}22`} stroke={C.purple} strokeWidth={2.5} />
                <polyline points="7,13 11,17 19,9" fill="none" stroke={C.purple} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div dir="ltr" style={{padding: '8px 10px', border: `1px solid ${C.border}`, borderRadius: 6, background: C.deep, fontFamily: MONO, fontSize: 11, color: C.text, minHeight: 56, whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>
              {`ROLLBACK TO SAVEPOINT coupon_apply;\n-- coupon reverted\nCOMMIT;`}
            </div>
            <div style={{marginTop: 8, fontFamily: MONO, fontSize: 12, color: commitProg > 0.5 ? C.green : C.amber, fontWeight: 700}}>
              {commitProg > 0.5 ? '→ main order committed ✓' : '→ committing...'}
            </div>
          </div>
        </div>

        {/* Result summary footer */}
        <div style={{position: 'absolute', left: 24, right: 24, top: 250, display: 'flex', gap: 14}}>
          <div style={{flex: 1, padding: '12px 14px', border: `2px solid ${C.green}`, borderRadius: 12, background: `${C.green}0d`}}>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.green, fontWeight: 700, marginBottom: 4}}>✓ Checkout Outcome</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 12, color: C.text, lineHeight: 1.5}}>
              main order commits · customer pays full ${orderTotal} · invalid coupon UPDATE reverted · zero torn writes · checkout does not crash.
            </div>
          </div>
          <div style={{flex: 1, padding: '12px 14px', border: `2px solid ${C.amber}`, borderRadius: 12, background: `${C.amber}0d`}}>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.amber, fontWeight: 700, marginBottom: 4}}>⚠ Invalid Coupon</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 12, color: C.text, lineHeight: 1.5}}>
              coupon UPDATE within SAVEPOINT block · ROLLBACK TO SAVEPOINT isolates the failure · main order work preserved prior to the anchor.
            </div>
          </div>
          <div style={{flex: 1, padding: '12px 14px', border: `2px solid ${C.purple}`, borderRadius: 12, background: `${C.purple}0d`}}>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.purple, fontWeight: 700, marginBottom: 4}}>✓ Resilience Pattern</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 12, color: C.text, lineHeight: 1.5}}>
              wrap risky DML in SAVEPOINT / ROLLBACK TO ──► degrade gracefully · COMMIT what works · revert what fails.
            </div>
          </div>
        </div>

        {/* Enterprise Quality Stamp seal */}
        <div style={{position: 'absolute', left: 24, right: 24, bottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 18px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`, opacity: clamp(sealP)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <Check p={sealP} size={42} color={C.green} />
            <div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Enterprise Quality Seal ✓</div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted}}>Resilient checkout · SAVEPOINT-protected · zero torn writes</div>
            </div>
          </div>
          <div style={{fontFamily: MONO, fontSize: 22, color: C.green, fontWeight: 700, textShadow: `0 0 12px ${C.green}66`}}>
            Resilient · Atomic
          </div>
        </div>
      </Win>

      {/* Resilient seal badge bottom */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 930, display: 'flex', justifyContent: 'center', opacity: clamp(resP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={resP} size={32} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Resilient Checkout · Coupon Reverted · Order Committed ✓</div>
        </div>
      </div>

      <Caption text="Resilient Checkout ──► order paid + SAVEPOINT + coupon fails + ROLLBACK TO + COMMIT ✓" from={t(192)} to={sec(38)} tone="ok" />
    </Stage>
  );
};
