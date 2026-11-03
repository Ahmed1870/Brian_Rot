import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { C } from '../../theme';
import { Backdrop, Panel, Code, Pill } from '../ui';

export const Scene02: React.FC = () => {
  const f = useCurrentFrame();
  const line = interpolate(f, [300, 500], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rows = [19.5, 32, 45.5, 61, 78, 88];

  return (
    <>
      <Backdrop
        eyebrow="02 / WHERE"
        title="التصفية بمرجع ديناميكي"
        sub="قارن كل سعر بالمتوسط المحسوب من البيانات"
      />

      <Panel style={{ position: 'absolute', left: 95, top: 270, width: 1040 }}>
        <Code
          lines={[
            'SELECT product_name, unit_price',
            'FROM products',
            'WHERE unit_price > (SELECT AVG(unit_price) FROM products);',
          ]}
          highlight={2}
        />
      </Panel>

      <div style={{ position: 'absolute', left: 120, top: 650, width: 1500 }}>
        <div style={{ height: 5, background: C.line, position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              left: '45.5%',
              top: -24,
              height: 54,
              width: 4,
              background: C.green,
              boxShadow: `0 0 18px ${C.green}`,
              transform: `translateX(${(1 - line) * 120}px)`,
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 30,
            fontFamily: 'monospace',
            fontSize: 19,
          }}
        >
          {rows.map((value, index) => (
            <div
              key={index}
              style={{
                color: value > 45.5 ? C.green : C.red,
                opacity: 0.4 + line * 0.6,
              }}
            >
              ${value.toFixed(2)}
              <div style={{ fontSize: 28 }}>
                {value > 45.5 ? '✓' : '×'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', right: 110, top: 280 }}>
        <Pill color={C.green}>DYNAMIC FILTER</Pill>
      </div>
    </>
  );
};
