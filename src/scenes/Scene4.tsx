import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Warn, Win, clamp, lin, pop, sec} from '../kit';

// SC04 (130-170s): TIDs + DML Write Overhead — Index Pages ↔ Heap Laser Threads
// Anchors: 131.0 TIDs | 136.0 heap | 140.0 block offset | 145.0 index pages | 150.0 DML | 155.0 overhead | 160.0 warning | 165.0 seal
const S = START.s4;
const t = (g: number) => sec(g - S);

// 5 redundant indexes on the table (each must be updated on INSERT)
const REDUNDANT_INDEXES = [
  {name: 'idx_price', col: 'unit_price', type: 'B-Tree'},
  {name: 'idx_sku', col: 'sku', type: 'Hash'},
  {name: 'idx_tags', col: 'tags', type: 'GIN'},
  {name: 'idx_created', col: 'created_at', type: 'B-Tree'},
  {name: 'idx_name', col: 'name', type: 'B-Tree'},
];

// Index pages on the left
const INDEX_PAGES = [
  {name: 'idx_price', y: 60},
  {name: 'idx_sku', y: 140},
  {name: 'idx_tags', y: 220},
];

// Heap TIDs on the right (block + offset)
const HEAP_TIDS = [
  {block: 12, offset: 4, y: 60},
  {block: 12, offset: 5, y: 140},
  {block: 13, offset: 1, y: 220},
  {block: 13, offset: 2, y: 300},
];

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(131.5), 14));
  const laserP = clamp(lin(f, t(140), 14));
  // INSERT trigger animation
  const insertP = clamp(lin(f, t(150), sec(8)));
  // Flashing red for redundant indexes
  const flashPhase = Math.floor(f / 8) % 2;
  const isFlashing = insertP > 0.3 && insertP < 0.95;
  const overheadP = clamp(lin(f, t(155), sec(6)));
  const warnP = pop(f, t(160));
  const sealP = pop(f, t(165));

  // Laser line opacity pulsing
  const laserPulse = (0.6 + 0.4 * Math.sin(f * 0.3));

  return (
    <Stage dur={1200} inFx="zoom" outFx="morph">
      <TopBadge text="معرفات الصفوف وعبء الكتابة | TIDs & DML Write Overhead" from={sec(2)} to={sec(40)} color={C.red} />

      {/* EXPLAIN editor at top */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={180}
          w={1760}
          h={140}
          title="TID · Heap Tuple Identifier (Block + Offset)"
          lines={[
            'INSERT INTO products (sku, name, unit_price) VALUES (?, ?, ?);',
            "-- EXPLAIN: TID = (block, offset) ──► every index must be updated",
          ]}
          start={t(131.5)}
          cps={0.78}
          size={16}
          accent={C.blue}
          hl={0}
          hlColor={C.blue}
        />
      </div>

      {/* LEFT: Index Pages ↔ Heap TIDs laser threads */}
      <Win x={80} y={340} w={860} h={540} title="index pages ──► heap TIDs (laser threads)" accent={C.blue} opacity={clamp(lin(f, t(140), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.blue}}>
          index page ──► TID pointer ──► heap block
        </div>

        {/* SVG with index pages (left) and heap TIDs (right) connected by laser lines */}
        <svg width={820} height={420} style={{position: 'absolute', left: 20, top: 50}}>
          {/* Section labels */}
          <text x={20} y={20} fill={C.blue} fontSize={13} fontFamily={MONO} fontWeight={700}>Index Pages</text>
          <text x={680} y={20} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700}>Heap TIDs</text>

          {/* Laser lines connecting pages to TIDs */}
          {INDEX_PAGES.map((page, pi) =>
            HEAP_TIDS.map((tid, ti) => {
              const visible = laserP > 0.3 + (pi + ti) * 0.05;
              return (
                <line
                  key={`${pi}-${ti}`}
                  x1={210}
                  y1={page.y + 40}
                  x2={620}
                  y2={tid.y + 30}
                  stroke={C.blue}
                  strokeWidth={visible ? 1.5 : 0}
                  strokeOpacity={visible ? laserPulse * 0.7 : 0}
                  strokeDasharray="3 4"
                  style={{filter: visible ? `drop-shadow(0 0 3px ${C.blue})` : 'none'}}
                />
              );
            })
          )}

          {/* Index Pages (left column) */}
          {INDEX_PAGES.map((page, i) => (
            <g key={i}>
              <rect x={20} y={page.y} width={190} height={60} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={2} rx={8} />
              <text x={115} y={page.y + 25} fill={C.blue} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">{page.name}</text>
              <text x={115} y={page.y + 44} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">page #{i + 1}</text>
            </g>
          ))}

          {/* Heap TIDs (right column) */}
          {HEAP_TIDS.map((tid, i) => {
            const visible = laserP > 0.3 + i * 0.1;
            return (
              <g key={i} style={{opacity: visible ? 1 : 0.3}}>
                <rect x={620} y={tid.y} width={180} height={50} fill={`${C.green}22`} stroke={C.green} strokeWidth={2} rx={8} />
                <text x={710} y={tid.y + 22} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">TID ({tid.block}, {tid.offset})</text>
                <text x={710} y={tid.y + 40} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">block + offset</text>
              </g>
            );
          })}
        </svg>

        {/* Storage callouts */}
        <div style={{position: 'absolute', left: 18, right: 18, bottom: 50, display: 'flex', gap: 10}}>
          <Chip color={C.blue} style={{fontSize: 14, padding: '4px 12px'}}>Index Pages</Chip>
          <Chip color={C.amber} style={{fontSize: 14, padding: '4px 12px'}}>→ TID pointers</Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>Heap Blocks</Chip>
        </div>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.blue, fontWeight: 700, paddingTop: 4, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>heap · unordered rows</span>
          <span>TID = (block, offset)</span>
        </div>
      </Win>

      {/* RIGHT: 5 redundant indexes flashing red on INSERT */}
      <Win x={980} y={340} w={860} h={540} title="INSERT triggers 5 index updates ──► DML Write Overhead" accent={C.red} opacity={clamp(lin(f, t(150), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.red}}>
          single INSERT ──► 5 indexes must be updated
        </div>

        {/* Index list with flashing red */}
        <div style={{position: 'absolute', left: 18, right: 18, top: 60, display: 'flex', flexDirection: 'column', gap: 10}}>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 12, color: C.muted, marginBottom: 4}}>redundant indexes on products:</div>
          {REDUNDANT_INDEXES.map((idx, i) => {
            const visible = clamp(pop(f, t(150 + i * 0.4)));
            const flashing = isFlashing && flashPhase === 0;
            return (
              <div key={i} dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px', border: `2px solid ${flashing ? C.red : C.border}`, borderRadius: 8, background: flashing ? `${C.red}22` : 'transparent', opacity: clamp(visible)}}>
                <span style={{fontFamily: MONO, fontSize: 14, color: flashing ? C.red : C.amber, fontWeight: 700}}>{flashing ? '⚡' : '○'}</span>
                <span style={{fontFamily: MONO, fontSize: 15, color: C.text, fontWeight: 700, minWidth: 130}}>{idx.name}</span>
                <span style={{fontFamily: MONO, fontSize: 13, color: C.muted, flex: 1}}>({idx.col}) · {idx.type}</span>
                <span style={{fontFamily: MONO, fontSize: 12, color: flashing ? C.red : C.muted, fontWeight: 700}}>{flashing ? 'updating...' : 'idle'}</span>
              </div>
            );
          })}
        </div>

        {/* DML overhead meter */}
        <div style={{position: 'absolute', left: 18, right: 18, top: 330, padding: '12px 14px', border: `2px solid ${C.amber}`, borderRadius: 10, background: `${C.amber}0d`, opacity: clamp(overheadP)}}>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.amber, fontWeight: 700, marginBottom: 6}}>DML Write Overhead per INSERT</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.muted, minWidth: 80}}>heap write</span>
            <div style={{flex: 1, height: 12, borderRadius: 6, background: C.border, overflow: 'hidden'}}>
              <div style={{height: '100%', width: `${overheadP * 20}%`, background: C.green, borderRadius: 6}} />
            </div>
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 12, color: C.green, fontWeight: 700, minWidth: 50}}>1×</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 6}}>
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.muted, minWidth: 80}}>index writes</span>
            <div style={{flex: 1, height: 12, borderRadius: 6, background: C.border, overflow: 'hidden'}}>
              <div style={{height: '100%', width: `${overheadP * 100}%`, background: C.red, borderRadius: 6}} />
            </div>
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 12, color: C.red, fontWeight: 700, minWidth: 50}}>5×</span>
          </div>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 12, color: C.muted, marginTop: 8}}>total writes per INSERT = 6 (1 heap + 5 index)</div>
        </div>

        {/* Warning sign */}
        <div style={{position: 'absolute', left: 18, right: 18, bottom: 60, display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', border: `2px solid ${C.red}`, borderRadius: 10, background: `${C.red}0d`, opacity: clamp(warnP)}}>
          <Warn size={48} color={C.red} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.red, fontWeight: 700}}>DML Write Overhead</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginTop: 4}}>redundant indexes slow down INSERT / UPDATE / DELETE</div>
          </div>
        </div>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.red, fontWeight: 700, paddingTop: 4, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>5 indexes updated</span>
          <span>rule: drop unused indexes</span>
        </div>
      </Win>

      {/* Seal badge */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 920, display: 'flex', justifyContent: 'center', opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.amber}`, borderRadius: 14, background: `${C.amber}0d`}}>
          <Check p={sealP} size={36} color={C.amber} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.amber, fontWeight: 700}}>TID = (Block, Offset) · Each INSERT Writes To Every Index</div>
        </div>
      </div>

      <Caption text="TID (Block, Offset) ──► Each INSERT Updates ALL Indexes (DML Write Overhead)" from={t(155)} to={sec(44)} tone="danger" />
    </Stage>
  );
};
