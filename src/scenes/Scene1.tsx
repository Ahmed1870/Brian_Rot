import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';
import {PRODUCTS} from '../data';

// SC01 (0-40s): Updatable Views — DML Pass-Through Gateway
// Anchors: 1.0 welcome | 5.0 updatable | 9.0 DML | 14.0 INSERT UPDATE DELETE | 20.0 translate | 28.0 base table | 35.0 seamless
const S = START.s1;
const t = (g: number) => sec(g - S);

const ROW_H = 48;
const ROW0 = 50;

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(2), 14));
  const tableP = clamp(lin(f, t(4), 14));
  // DML command passes through the gateway
  const dmlProg = clamp(lin(f, t(8), sec(20)));
  const sealP = pop(f, t(33));

  return (
    <Stage dur={1200} inFx="zoom" outFx="left">
      <TopBadge text="التحديث عبر المناظير | Updatable Views & DML Operations" from={sec(2)} to={sec(18)} />

      {/* SQL editor on the left */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={180}
          w={820}
          h={200}
          title="Query Editor"
          lines={[
            "UPDATE v_active_products",
            "   SET price = 150",
            " WHERE product_id = 101;",
          ]}
          start={t(2)}
          cps={0.85}
          size={20}
          accent={C.blue}
          hl={0}
          hlColor={C.blue}
        />
      </div>

      {/* Concept callout */}
      <div style={{position: 'absolute', left: 80, top: 400, width: 820, opacity: clamp(lin(f, t(9), 14))}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.muted, marginBottom: 10}}>◆ DML operations</div>
        <div style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}>
          <Chip color={C.blue}>INSERT</Chip>
          <Chip color={C.green}>UPDATE</Chip>
          <Chip color={C.amber}>DELETE</Chip>
        </div>
      </div>

      {/* Performance badge */}
      <div style={{position: 'absolute', left: 80, top: 510, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 22px', border: `2px solid ${C.green}`, borderRadius: 16, background: `${C.green}0d`}}>
          <Check p={sealP} size={44} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, color: C.green, fontWeight: 700}}>Direct base table update</div>
            <Mix style={{fontSize: 18, color: C.muted}}>ترجمة فورية للجدول الأصلي</Mix>
          </div>
        </div>
      </div>

      {/* Gateway visualization + base table on the right */}
      <Win x={940} y={180} w={900} h={720} title="v_active_products (view) → products (base table)" accent={C.blue} opacity={tableP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.blue}}>
          interactive view gateway · DML pass-through
        </div>

        {/* Gateway frame (top section) */}
        <div style={{position: 'absolute', left: 20, right: 20, top: 44, height: 100, borderRadius: 14, border: `3px solid ${C.blue}`, background: `${C.blue}0d`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${C.blue}55`}}>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, fontWeight: 700, color: C.blue}}>◄ VIEW GATEWAY ►</div>
          <div dir="ltr" style={{position: 'absolute', right: 20, fontFamily: MONO, fontSize: 14, color: C.muted}}>v_active_products</div>
        </div>

        {/* DML beam — green laser passing from gateway to base table */}
        {dmlProg > 0 && dmlProg < 1 ? (
          <svg width={900} height={600} style={{position: 'absolute', left: 0, top: 140, pointerEvents: 'none'}}>
            <line x1={450} y1={0} x2={450} y2={60 + dmlProg * 80} stroke={C.green} strokeWidth={4} strokeDasharray="6 4" style={{filter: `drop-shadow(0 0 8px ${C.green})`}} />
            <polygon points={`444,${50 + dmlProg * 80} 456,${50 + dmlProg * 80} 450,${60 + dmlProg * 80}`} fill={C.green} />
            <text x={470} y={30 + dmlProg * 40} fill={C.green} fontSize={16} fontFamily={MONO} fontWeight={700}>DML pass-through</text>
          </svg>
        ) : null}

        {/* Base table header */}
        <div dir="ltr" style={{position: 'absolute', left: 20, right: 20, top: 200, fontFamily: MONO, fontSize: 16, color: C.muted}}>base table: products</div>

        {/* Base table rows */}
        <div style={{position: 'absolute', left: 16, right: 16, top: 230}}>
          <div dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: 0, height: ROW0 - 10, display: 'flex', alignItems: 'center', padding: '0 14px', fontFamily: MONO, fontSize: 18, color: C.muted, borderBottom: `1px solid ${C.border}`}}>
            <span style={{width: 60}}>id</span>
            <span style={{width: 180}}>name</span>
            <span style={{width: 100, textAlign: 'right'}}>price</span>
            <span style={{width: 120, textAlign: 'right'}}>status</span>
          </div>
          {PRODUCTS.map((p, i) => {
            const isTarget = p.id === 101;
            const isUpdated = isTarget && dmlProg > 0.5;
            return (
              <div key={p.id} dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: ROW0 + i * ROW_H - 10, height: ROW_H - 6, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 14px', fontFamily: MONO, fontSize: 20, background: isTarget ? `${C.green}22` : 'transparent', border: `2px solid ${isTarget ? C.green : 'transparent'}`, color: C.text, opacity: p.status === 'active' ? 1 : 0.5}}>
                <span style={{width: 56, color: C.muted}}>{p.id}</span>
                <span style={{width: 170, color: C.blue}}>{p.name}</span>
                <span style={{width: 90, color: isUpdated ? C.green : C.text, fontWeight: 700, textAlign: 'right', textDecoration: isUpdated ? 'line-through' : 'none', opacity: isUpdated ? 0.5 : 1}}>
                  {isUpdated ? p.price : p.price}
                </span>
                {isUpdated ? <span style={{width: 90, color: C.green, fontWeight: 700, textAlign: 'right'}}>→ 150</span> : <span style={{width: 90}} />}
                <span style={{width: 100, textAlign: 'right', color: p.status === 'active' ? C.green : C.red, fontSize: 16}}>{p.status}</span>
              </div>
            );
          })}
        </div>

        {/* Bottom summary */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 44, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 18, color: C.blue, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>UPDATE v_active_products</span>
          <span>{dmlProg >= 1 ? '✓ base table updated' : 'translating...'}</span>
        </div>
      </Win>

      <Caption text="UPDATE v_products ──► Translates Directly to Base Table Updates" from={t(22)} to={sec(38)} />
    </Stage>
  );
};
