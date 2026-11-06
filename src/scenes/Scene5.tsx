import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {ENTERPRISE_TX_LINES} from '../data';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC05 (170-210s): Enterprise Banking & Inventory — Atomic Financial Transaction
// Anchors: 171.0 enterprise | 175.0 banking | 180.0 balance | 185.0 stock | 192.0 commit/rollback | 200.0 seal | 205.0 protected
const S = START.s5;
const t = (g: number) => sec(g - S);

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(171.5), 14));
  const reportP = clamp(lin(f, t(175), 14));
  const bankP = clamp(lin(f, t(180), 14));
  // Banking balance deduction animation
  const balProg = clamp(lin(f, t(180), sec(8)));
  // Stock decrement animation
  const stockProg = clamp(lin(f, t(185), sec(8)));
  // Commit/rollback branch animation
  const branchProg = clamp(lin(f, t(192), sec(10)));
  const sealP = pop(f, t(200));
  const protP = pop(f, t(205));

  // Interpolated values
  const balanceBefore = 5000;
  const balanceAfter = lerp(5000, 3500, balProg);
  const stockBefore = 12;
  const stockAfter = lerp(12, 11, stockProg);

  return (
    <Stage dur={1200} inFx="morph" outFx="fade">
      <TopBadge text="تطبيق مؤسسي | Enterprise Banking & Inventory — Atomic Financial Transaction" from={sec(1)} to={sec(38)} color={C.green} />

      {/* LEFT: Editor with enterprise banking + inventory transaction */}
      <Editor
        x={80}
        y={170}
        w={880}
        h={320}
        title="Enterprise · Banking + Inventory transaction (manzooma_store_db)"
        lines={ENTERPRISE_TX_LINES.concat([
          '',
          '-- atomic: both UPDATEs succeed or both revert',
          '-- ACID: balance + stock change together as one unit',
        ])}
        start={t(171.5)}
        cps={0.55}
        size={15}
        accent={C.green}
        hl={1}
        hlColor={C.blue}
      />

      {/* RIGHT: Executive report panel */}
      <Win x={1000} y={170} w={840} h={320} title="executive report · banking + inventory atomicity" accent={C.green} opacity={reportP}>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 12, fontFamily: MONO, fontSize: 20, color: C.green}}>
          Banking &amp; Inventory · Module 13 Capstone
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 46, right: 24, display: 'flex', gap: 8, flexWrap: 'wrap'}}>
          <Chip color={C.blue} style={{fontSize: 14, padding: '4px 12px'}}>balance deduction</Chip>
          <Chip color={C.amber} style={{fontSize: 14, padding: '4px 12px'}}>stock decrement</Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>atomic ✓</Chip>
          <Chip color={C.purple} style={{fontSize: 14, padding: '4px 12px'}}>XID-tagged</Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>WAL-flushed</Chip>
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 24, right: 24, top: 110, padding: '12px 14px', border: `1px solid ${C.border}`, borderRadius: 8, background: C.deep, fontFamily: MONO, fontSize: 13, color: C.text, lineHeight: 1.5}}>
          <span style={{color: '#64748B'}}>transaction strategy:</span> single BEGIN ──► both UPDATEs execute ──► COMMIT (success) or ROLLBACK (insufficient balance / stock). ACID guarantees zero torn writes between bank and inventory ledgers.
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 24, right: 24, top: 200, display: 'flex', gap: 12}}>
          <div style={{flex: 1, padding: '10px 12px', border: `2px solid ${C.blue}`, borderRadius: 10, background: `${C.blue}0d`}}>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.blue, fontWeight: 700}}>Customer 101</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 12, color: C.text}}>balance: {balanceBefore.toFixed(0)} → {balanceAfter.toFixed(0)}</div>
          </div>
          <div style={{flex: 1, padding: '10px 12px', border: `2px solid ${C.amber}`, borderRadius: 10, background: `${C.amber}0d`}}>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.amber, fontWeight: 700}}>Product 502</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 12, color: C.text}}>stock: {stockBefore} → {stockAfter}</div>
          </div>
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 24, right: 24, bottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{fontFamily: MONO, fontSize: 18, color: C.text, fontWeight: 700}}>
            atomic financial block ✓
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, opacity: clamp(sealP), transform: `scale(${0.85 + 0.15 * clamp(sealP)})`}}>
            <Check p={sealP} size={36} color={C.green} />
            <div style={{fontFamily: MONO, fontSize: 16, color: C.green, fontWeight: 700}}>Module 13 Seal ✓</div>
          </div>
        </div>
      </Win>

      {/* BOTTOM: Banking panel with COMMIT ✓ / ROLLBACK ✗ paths */}
      <Win x={80} y={510} w={1760} h={380} title="banking & inventory execution ──► COMMIT vs ROLLBACK outcome" accent={C.green} opacity={bankP}>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 12, fontFamily: MONO, fontSize: 20, color: C.green}}>
          both UPDATEs succeed ──► COMMIT ✓  ·  either fails ──► ROLLBACK ✗
        </div>

        {/* Two large panels: COMMIT path / ROLLBACK path */}
        <div style={{position: 'absolute', left: 24, right: 24, top: 56, display: 'flex', gap: 18}}>
          {/* COMMIT success path */}
          <div style={{flex: 1, padding: '16px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`, opacity: clamp(pop(f, t(192))), boxShadow: branchProg > 0.6 ? `0 0 24px ${C.green}44` : 'none'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
              <span style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>COMMIT ✓ (success path)</span>
              <Check p={1} size={28} color={C.green} />
            </div>
            <div style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginBottom: 4}}>conditions:</div>
            <div dir="ltr" style={{padding: '10px 12px', border: `1px solid ${C.border}`, borderRadius: 6, background: C.deep, fontFamily: MONO, fontSize: 12, color: C.text, minHeight: 80, whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginBottom: 14}}>
              {`✓ balance >= 1500  (customer 101 has ${balanceAfter.toFixed(0)} after)\n✓ stock_qty >= 1   (product 502 has ${stockAfter} after)\n✓ all constraints satisfied\n→ COMMIT; ──► permanent ✓`}
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 13, color: C.muted, marginBottom: 4}}>
              <span>both ledgers updated</span>
              <span style={{color: C.green, fontWeight: 700}}>atomic ✓</span>
            </div>
            <div style={{height: 14, borderRadius: 7, background: C.border, overflow: 'hidden'}}>
              <div style={{height: '100%', width: `${Math.max(20, balProg * 100)}%`, background: C.green, borderRadius: 7}} />
            </div>
            <div style={{marginTop: 10, fontFamily: MONO, fontSize: 13, color: C.green, fontWeight: 700}}>→ bank: -1500 · inventory: -1 · WAL flushed</div>
          </div>

          {/* Arrow divider */}
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, width: 80}}>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.amber, fontWeight: 700, textAlign: 'center'}}>branch</div>
            <svg width={60} height={60}>
              <line x1={30} y1={10} x2={30} y2={50} stroke={C.amber} strokeWidth={3} />
              <polygon points="22,18 22,30 14,24" fill={C.green} />
              <polygon points="38,18 38,30 46,24" fill={C.red} />
            </svg>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 12, color: C.muted, textAlign: 'center'}}>success / fail</div>
          </div>

          {/* ROLLBACK failure path */}
          <div style={{flex: 1, padding: '16px', border: `2px solid ${C.red}`, borderRadius: 14, background: `${C.red}0d`, opacity: clamp(pop(f, t(194)))}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
              <span style={{fontFamily: MONO, fontSize: 18, color: C.red, fontWeight: 700}}>ROLLBACK ✗ (failure path)</span>
              <svg width={28} height={28} viewBox="0 0 28 28">
                <circle cx={14} cy={14} r={12} fill={`${C.red}22`} stroke={C.red} strokeWidth={2.5} />
                <line x1={8} y1={8} x2={20} y2={20} stroke={C.red} strokeWidth={3} strokeLinecap="round" />
                <line x1={20} y1={8} x2={8} y2={20} stroke={C.red} strokeWidth={3} strokeLinecap="round" />
              </svg>
            </div>
            <div style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginBottom: 4}}>conditions:</div>
            <div dir="ltr" style={{padding: '10px 12px', border: `1px solid ${C.border}`, borderRadius: 6, background: C.deep, fontFamily: MONO, fontSize: 12, color: C.text, minHeight: 80, whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginBottom: 14}}>
              {`✗ balance < 1500  (insufficient funds)\n✗ stock_qty < 1   (out of stock)\n✗ constraint / trigger violation\n→ ROLLBACK; ──► full revert ✗`}
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 13, color: C.muted, marginBottom: 4}}>
              <span>both ledgers restored</span>
              <span style={{color: C.red, fontWeight: 700}}>atomic ✗→✓</span>
            </div>
            <div style={{height: 14, borderRadius: 7, background: C.border, overflow: 'hidden'}}>
              <div style={{height: '100%', width: `${Math.max(20, branchProg * 100)}%`, background: C.red, borderRadius: 7}} />
            </div>
            <div style={{marginTop: 10, fontFamily: MONO, fontSize: 13, color: C.red, fontWeight: 700}}>→ bank: unchanged · inventory: unchanged · no torn writes</div>
          </div>
        </div>

        {/* Financial Quality Stamp seal */}
        <div style={{position: 'absolute', left: 24, right: 24, bottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 18px', border: `2px solid ${C.amber}`, borderRadius: 14, background: `${C.amber}0d`, opacity: clamp(sealP)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <Check p={sealP} size={42} color={C.amber} />
            <div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.amber, fontWeight: 700}}>Financial Quality Stamp ✓</div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted}}>Banking + Inventory ACID guarantees · zero torn writes</div>
            </div>
          </div>
          <div style={{fontFamily: MONO, fontSize: 22, color: C.green, fontWeight: 700, textShadow: `0 0 12px ${C.green}66`}}>
            Atomic · Durable
          </div>
        </div>
      </Win>

      {/* Protected seal badge bottom */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 910, display: 'flex', justifyContent: 'center', opacity: clamp(protP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={protP} size={32} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Banking &amp; Inventory Protected · Financial Integrity ✓</div>
        </div>
      </div>

      <Caption text="Enterprise Transaction ──► Banking (-1500) + Inventory (-1) ──► COMMIT ✓ OR ROLLBACK ✗" from={t(192)} to={sec(38)} tone="ok" />
    </Stage>
  );
};
