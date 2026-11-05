import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Warn, Win, clamp, lin, pop, sec} from '../kit';
import {INVENTORY} from '../data';

// SC05 (170-210s): Enterprise Inventory Pricing Updatable View Dashboard
// Anchors: 171.0 enterprise | 175.0 v_inventory_pricing | 180.0 CASCADED | 185.0 safe update | 192.0 blocked | 200.0 governance | 205.0 seal
const S = START.s5;
const t = (g: number) => sec(g - S);

const ROW_H = 52;
const ROW0 = 50;

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(171.5), 14));
  const dashboardP = clamp(lin(f, t(185), 16));
  const sealP = pop(f, t(200));

  return (
    <Stage dur={1200} inFx="morph" outFx="fade">
      <TopBadge text="التطبيق المؤسسي | Secure Inventory Pricing View" from={sec(1)} to={sec(38)} color={C.green} />

      <Editor
        x={80}
        y={170}
        w={880}
        h={230}
        title="Enterprise View · v_inventory_pricing"
        lines={[
          'CREATE OR REPLACE VIEW v_inventory_pricing AS',
          '  SELECT product_id, product_name, unit_price, status',
          '  FROM store_products',
          "  WHERE status = 'available' AND unit_price > 0",
          '  WITH CASCADED CHECK OPTION;',
        ]}
        start={t(171.5)}
        cps={0.65}
        size={15}
        hl={4}
        hlColor={C.green}
      />

      {/* Report panel right of editor */}
      <Win x={1000} y={170} w={840} h={230} title="executive report · inventory governance" accent={C.green} opacity={clamp(lin(f, t(192), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 12, fontFamily: MONO, fontSize: 20, color: C.green}}>
          Secure Price Management
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 46, right: 24, display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Chip color={C.green} style={{fontSize: 16, padding: '4px 14px'}}>CASCADED CHECK</Chip>
          <Chip color={C.blue} style={{fontSize: 16, padding: '4px 14px'}}>safe UPDATE</Chip>
          <Chip color={C.amber} style={{fontSize: 16, padding: '4px 14px'}}>blocked invalid</Chip>
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 24, right: 24, bottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{fontFamily: MONO, fontSize: 20, color: C.text, fontWeight: 700}}>
            data integrity ✓
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, opacity: clamp(sealP), transform: `scale(${0.85 + 0.15 * clamp(sealP)})`}}>
            <Check p={sealP} size={40} color={C.green} />
            <div style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Seal ✓</div>
          </div>
        </div>
      </Win>

      {/* Dashboard — inventory table with update attempts */}
      <Win x={80} y={420} w={1760} h={500} title="inventory dashboard · safe vs blocked updates" accent={C.green} opacity={dashboardP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
          v_inventory_pricing · authorized updates succeed, invalid blocked
        </div>

        {/* Table header */}
        <div dir="ltr" style={{position: 'absolute', left: 16, right: 16, top: 46, height: ROW0 - 10, display: 'flex', alignItems: 'center', padding: '0 14px', fontFamily: MONO, fontSize: 18, color: C.muted, borderBottom: `1px solid ${C.border}`}}>
          <span style={{width: 70}}>id</span>
          <span style={{width: 220}}>product_name</span>
          <span style={{width: 130, textAlign: 'right'}}>unit_price</span>
          <span style={{width: 130, textAlign: 'right'}}>status</span>
          <span style={{flex: 1, textAlign: 'right'}}>update attempt</span>
        </div>

        {/* Inventory rows */}
        {INVENTORY.map((item, i) => {
          const rowP = clamp(pop(f, t(186 + i * 0.7)));
          const isAvailable = item.status === 'available';
          const isValidUpdate = isAvailable && item.unit_price > 0;
          return (
            <div key={item.id} dir="ltr" style={{position: 'absolute', left: 12, right: 12, top: ROW0 + 36 + i * ROW_H, height: ROW_H - 6, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 14px', fontFamily: MONO, fontSize: 20, background: isValidUpdate ? `${C.green}0e` : `${C.red}0e`, border: `2px solid ${isValidUpdate ? C.green : C.red}`, color: C.text, opacity: rowP, transform: `translateX(${(1 - rowP) * 20}px)`}}>
              <span style={{width: 60, color: C.muted}}>{item.id}</span>
              <span style={{width: 210, color: C.blue}}>{item.name}</span>
              <span style={{width: 120, color: C.text, fontWeight: 700, textAlign: 'right'}}>${item.unit_price}</span>
              <span style={{width: 120, textAlign: 'right', color: isAvailable ? C.green : C.red, fontSize: 16}}>{item.status}</span>
              <span style={{flex: 1, textAlign: 'right', fontWeight: 700, fontSize: 16, color: isValidUpdate ? C.green : C.red}}>
                {isValidUpdate ? "✓ UPDATE allowed" : <span style={{display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8}}><Warn size={24} color={C.red} /> BLOCKED by CHECK</span>}
              </span>
            </div>
          );
        })}

        {/* Bottom summary */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 20, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.green}}>✓ {INVENTORY.filter(i => i.status === 'available' && i.unit_price > 0).length} safe updates</span>
          <span style={{color: C.red}}>✗ {INVENTORY.filter(i => i.status !== 'available' || i.unit_price <= 0).length} blocked</span>
          <span style={{color: C.amber}}>WITH CASCADED CHECK OPTION</span>
        </div>
      </Win>

      <Caption text="Enterprise Updatable Views ──► Secure Inventory Price Management" from={t(175)} to={t(195)} />
      <Caption text="WITH CASCADED CHECK OPTION ──► Guarantees Business Logic & Data Integrity" from={t(197)} to={sec(38.5)} tone="ok" />
    </Stage>
  );
};
