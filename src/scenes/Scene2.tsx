import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';
import {AUTO_UPDATABLE_RULES} from '../data';

// SC02 (40-85s): Auto-Updatable Rules vs Complex INSTEAD OF Triggers
// Anchors: 41.0 rules | 45.0 single table | 52.0 GROUP BY | 60.0 JOINs | 68.0 INSTEAD OF | 75.0 trigger | 80.0 route
const S = START.s2;
const t = (g: number) => sec(g - S);

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const leftP = clamp(lin(f, t(41.5), 14));
  const rightP = clamp(lin(f, t(52), 14));
  const triggerP = clamp(lin(f, t(60), 16));
  const sealP = pop(f, t(75));

  return (
    <Stage dur={1350} inFx="left" outFx="left">
      <TopBadge text="الشروط المعمارية | Updatability Rules & Triggers" from={sec(2)} to={sec(40)} color={C.green} />

      {/* LEFT: Auto-updatable view (simple) */}
      <div style={{opacity: leftP, transform: `translateX(${(1 - leftP) * -30}px)`}}>
        <Editor
          x={80}
          y={180}
          w={860}
          h={150}
          title="Simple View · Automatically Updatable"
          lines={[
            'CREATE VIEW v_active_products AS',
            '  SELECT product_id, name, price, status',
            '  FROM products',
            '  WHERE status = \'active\';',
          ]}
          start={t(41.5)}
          cps={0.8}
          size={18}
          accent={C.green}
          hl={2}
          hlColor={C.green}
        />
        <Win x={80} y={350} w={860} h={550} title="auto-updatable checklist · single base table" accent={C.green} opacity={leftP}>
          <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
            ✓ all conditions met → direct DML allowed
          </div>
          <div style={{position: 'absolute', left: 18, right: 18, top: 50, display: 'flex', flexDirection: 'column', gap: 10}}>
            {AUTO_UPDATABLE_RULES.map((rule, i) => {
              const visible = clamp(pop(f, t(43 + i * 0.8)));
              return (
                <div key={i} dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px', border: `2px solid ${rule.passed ? C.green : C.red}`, borderRadius: 10, background: rule.passed ? `${C.green}0d` : `${C.red}0d`, opacity: visible, transform: `translateX(${(1 - visible) * 20}px)`}}>
                  <Check p={visible} size={32} color={C.green} />
                  <span style={{fontFamily: MONO, fontSize: 18, color: C.text, flex: 1}}>{rule.rule}</span>
                </div>
              );
            })}
          </div>

          {/* Bottom status */}
          <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 44, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: MONO, fontSize: 20, color: C.green, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep, opacity: clamp(sealP)}}>
            ✓ Automatically Updatable · no triggers needed
          </div>
        </Win>
      </div>

      {/* RIGHT: Complex view (multi-table JOIN) — requires INSTEAD OF trigger */}
      <div style={{opacity: rightP, transform: `translateX(${(1 - rightP) * 30}px)`}}>
        <Editor
          x={980}
          y={180}
          w={860}
          h={220}
          title="Complex View · Multi-Table JOIN (NOT auto-updatable)"
          lines={[
            'CREATE VIEW v_order_summary AS',
            '  SELECT o.order_id, c.name, p.product_name,',
            '         o.quantity * p.unit_price AS total',
            '  FROM orders o',
            '  JOIN customers c ON o.customer_id = c.id',
            '  JOIN products p ON o.product_id = p.id;',
          ]}
          start={t(52.5)}
          cps={0.7}
          size={15}
          accent={C.amber}
          hl={3}
          hlColor={C.amber}
        />
        <Win x={980} y={420} w={860} h={480} title="complex view · INSTEAD OF trigger required" accent={C.amber} opacity={rightP}>
          <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.amber}}>
            ⚠ multi-table JOIN → ambiguity → needs trigger
          </div>

          {/* Trigger piston visualization */}
          <div style={{position: 'absolute', left: 18, right: 18, top: 50, display: 'flex', flexDirection: 'column', gap: 12}}>
            <div dir="ltr" style={{padding: '12px 16px', border: `2px solid ${C.amber}`, borderRadius: 10, background: `${C.amber}0d`, opacity: clamp(triggerP)}}>
              <div style={{fontFamily: MONO, fontSize: 18, color: C.amber, fontWeight: 700, marginBottom: 6}}>INSTEAD OF TRIGGER</div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.muted}}>routes DML to correct target table</div>
            </div>

            {/* Trigger routing diagram */}
            <div style={{display: 'flex', gap: 14, marginTop: 10}}>
              {[
                {label: 'INSERT → orders', color: C.blue},
                {label: 'UPDATE → products', color: C.green},
                {label: 'DELETE → orders', color: C.red},
              ].map((route, i) => {
                const visible = clamp(pop(f, t(68 + i * 1.2)));
                return (
                  <div key={i} dir="ltr" style={{flex: 1, padding: '10px 12px', border: `2px solid ${route.color}`, borderRadius: 8, background: `${route.color}0d`, opacity: visible, transform: `translateY(${(1 - visible) * 14}px)`}}>
                    <div style={{fontFamily: MONO, fontSize: 14, color: route.color, fontWeight: 700, textAlign: 'center'}}>{route.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Code snippet */}
            <div dir="ltr" style={{padding: '12px 14px', border: `2px solid ${C.border}`, borderRadius: 10, background: C.deep, fontFamily: MONO, fontSize: 14, color: C.text, marginTop: 10, opacity: clamp(triggerP)}}>
              <div style={{color: '#64748B', fontSize: 12, marginBottom: 4}}>-- trigger definition</div>
              <div>CREATE TRIGGER trg_order_summary</div>
              <div>  INSTEAD OF INSERT OR UPDATE OR DELETE</div>
              <div>  ON v_order_summary</div>
              <div>  FOR EACH ROW EXECUTE FUNCTION ...</div>
            </div>
          </div>

          {/* Bottom status */}
          <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 44, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: MONO, fontSize: 18, color: C.amber, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep, opacity: clamp(sealP)}}>
            ⚠ Complex Views ──► INSTEAD OF Triggers route DML
          </div>
        </Win>
      </div>

      <Caption text="Automatically Updatable ──► Single Base Table, No Aggregates / GROUP BY" from={t(42)} to={t(60)} />
      <Caption text="Complex Views ──► Requires INSTEAD OF Triggers to Route DML" from={t(62)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
