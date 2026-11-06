import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC01 (0-40s): Virtual Tables Concept — Physical tables project through a blue lens into a virtual view
// Anchors: 1.0 welcome | 5.0 views | 9.0 virtual | 14.0 zero disk | 20.0 projection | 28.0 seal | 35.0 module 14
const S = START.s1;
const t = (g: number) => sec(g - S);

// Physical tables stacked on the left of the SVG
const TABLES = [
  {name: 'store_orders', y: 60, rows: ['order_id', 'customer_id', 'product_id', 'total_amount']},
  {name: 'store_customers', y: 200, rows: ['customer_id', 'customer_name', 'city']},
  {name: 'store_products', y: 340, rows: ['product_id', 'product_name', 'price']},
];

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(1.5), 14));
  const tablesP = clamp(lin(f, t(5), 14));
  const virtualP = clamp(lin(f, t(9), 14));
  const zeroP = pop(f, t(14));
  // Projection beam animation (light beams from tables converging into the lens)
  const beamProg = clamp(lin(f, t(20), sec(8)));
  const sealP = pop(f, t(28));
  const modP = pop(f, t(35));

  // Lens pulse
  const pulse = 0.5 + 0.5 * Math.sin(f * 0.15);

  return (
    <Stage dur={1200} inFx="zoom" outFx="left">
      <TopBadge text="الجداول الافتراضية | Virtual Tables — CREATE VIEW &amp; Projection Lens (Module 14 Start)" from={sec(2)} to={sec(18)} color={C.blue} />

      {/* LEFT: Code editor with CREATE VIEW query */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={180}
          w={680}
          h={300}
          title="Query Editor · CREATE VIEW defines a virtual table"
          lines={[
            'CREATE VIEW vw_store_sales AS',
            '  SELECT o.order_id, c.customer_name,',
            '         p.product_name, o.total_amount',
            '  FROM store_orders o',
            '  JOIN store_customers c',
            '    ON o.customer_id = c.customer_id',
            '  JOIN store_products p',
            '    ON o.product_id = p.product_id;',
          ]}
          start={t(1.5)}
          cps={0.7}
          size={15}
          accent={C.blue}
          hl={0}
          hlColor={C.blue}
        />
      </div>

      {/* Concept chips below editor */}
      <div style={{position: 'absolute', left: 80, top: 500, width: 680, opacity: clamp(lin(f, t(5), 14))}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.muted, marginBottom: 10}}>◆ Virtual table golden rule</div>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Chip color={C.blue} style={{fontSize: 16, padding: '4px 14px'}}>CREATE VIEW</Chip>
          <Chip color={C.green} style={{fontSize: 16, padding: '4px 14px'}}>Zero Disk ✓</Chip>
          <Chip color={C.amber} style={{fontSize: 16, padding: '4px 14px'}}>Stored Query ✓</Chip>
          <Chip color={C.purple} style={{fontSize: 16, padding: '4px 14px'}}>Queryable ✓</Chip>
        </div>
      </div>

      {/* Module 14 Architecture badge panel */}
      <Win x={80} y={580} w={680} h={320} title="module 14 architecture ──► virtual tables foundation" accent={C.green} opacity={clamp(lin(f, t(14), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
          CREATE VIEW ──► projection lens ──► virtual table ──► zero storage overhead
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>
            <Check p={modP} size={16} color={C.green} /> Module 14 Start
          </Chip>
        </div>

        <svg width={640} height={220} style={{position: 'absolute', left: 20, top: 50}}>
          {/* Physical tables (3 stacked blocks on left) */}
          <rect x={20} y={30} width={150} height={44} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={2} rx={8} />
          <text x={95} y={56} fill={C.blue} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">store_orders</text>

          <rect x={20} y={90} width={150} height={44} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={2} rx={8} />
          <text x={95} y={116} fill={C.blue} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">store_customers</text>

          <rect x={20} y={150} width={150} height={44} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={2} rx={8} />
          <text x={95} y={176} fill={C.blue} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">store_products</text>

          {/* Beams converging to lens */}
          <line x1={170} y1={52} x2={320} y2={112} stroke={C.blue} strokeWidth={2.5} strokeDasharray="6 4" opacity={0.7} />
          <line x1={170} y1={112} x2={320} y2={112} stroke={C.blue} strokeWidth={2.5} strokeDasharray="6 4" opacity={0.7} />
          <line x1={170} y1={172} x2={320} y2={112} stroke={C.blue} strokeWidth={2.5} strokeDasharray="6 4" opacity={0.7} />

          {/* Blue lens (CREATE VIEW) */}
          <ellipse cx={340} cy={112} rx={36} ry={36} fill={`${C.blue}33`} stroke={C.blue} strokeWidth={3} style={{filter: `drop-shadow(0 0 ${10 + pulse * 8}px ${C.blue})`}} />
          <text x={340} y={108} fill={C.blue} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">CREATE</text>
          <text x={340} y={120} fill={C.blue} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">VIEW</text>

          {/* Projected beam to virtual table */}
          <line x1={376} y1={112} x2={470} y2={112} stroke={C.green} strokeWidth={3} strokeDasharray="6 4" />
          <polygon points="464,106 464,118 478,112" fill={C.green} />

          {/* Virtual table (transparent grid) */}
          <rect x={480} y={60} width={150} height={100} fill={`${C.green}11`} stroke={C.green} strokeWidth={2} strokeDasharray="5 4" rx={8} />
          <text x={555} y={84} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">vw_store_sales</text>
          <line x1={490} y1={94} x2={620} y2={94} stroke={C.green} strokeWidth={1} opacity={0.5} />
          <line x1={490} y1={110} x2={620} y2={110} stroke={C.green} strokeWidth={1} opacity={0.5} />
          <line x1={490} y1={126} x2={620} y2={126} stroke={C.green} strokeWidth={1} opacity={0.5} />
          <line x1={490} y1={142} x2={620} y2={142} stroke={C.green} strokeWidth={1} opacity={0.5} />
          <text x={555} y={178} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">virtual · zero disk</text>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>physical ──► lens</span>
          <span>virtual ✓</span>
        </div>
      </Win>

      {/* RIGHT: Projection visualization with physical tables + lens + virtual grid */}
      <Win x={800} y={180} w={1040} h={720} title="projection lens ──► physical tables converge into a virtual view" accent={C.blue} opacity={tablesP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.blue}}>
          3 physical tables ──► blue CREATE VIEW lens ──► transparent virtual table (zero disk space)
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.blue} style={{fontSize: 13, padding: '4px 12px'}}>Physical Tables</Chip>
          <Chip color={C.amber} style={{fontSize: 13, padding: '4px 12px'}}>{beamProg > 0.05 ? 'Projecting...' : 'idle'}</Chip>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>{beamProg > 0.95 ? 'Virtual ✓' : '...'}</Chip>
        </div>

        {/* SVG projection diagram */}
        <svg width={1000} height={600} style={{position: 'absolute', left: 20, top: 60}}>
          {/* Three physical tables stacked on the left */}
          {TABLES.map((tbl, i) => {
            const ap = clamp(pop(f, t(5.5 + i * 0.6)));
            return (
              <g key={i} style={{opacity: clamp(ap)}}>
                <rect x={20} y={tbl.y} width={220} height={120} fill={`${C.blue}18`} stroke={C.blue} strokeWidth={2.5} rx={12} />
                <rect x={20} y={tbl.y} width={220} height={30} fill={C.blue} rx={12} />
                <rect x={20} y={tbl.y + 18} width={220} height={12} fill={C.blue} />
                <text x={130} y={tbl.y + 20} fill={C.bg} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">{tbl.name}</text>
                {tbl.rows.map((r, j) => (
                  <text key={j} x={36} y={tbl.y + 56 + j * 18} fill={C.text} fontSize={12} fontFamily={MONO}>{r}</text>
                ))}
                {/* Database disk icon */}
                <g transform={`translate(200, ${tbl.y + 80})`}>
                  <ellipse cx={0} cy={0} rx={14} ry={5} fill="none" stroke={C.amber} strokeWidth={2} />
                  <path d="M -14 0 V 14 A 14 5 0 0 0 14 14 V 0" fill="none" stroke={C.amber} strokeWidth={2} />
                  <ellipse cx={0} cy={7} rx={14} ry={5} fill="none" stroke={C.amber} strokeWidth={1.5} opacity={0.6} />
                </g>
              </g>
            );
          })}

          {/* Light beams from each table converging into the lens */}
          <g style={{opacity: clamp(pop(f, t(20)))}}>
            {TABLES.map((tbl, i) => {
              const startY = tbl.y + 60;
              const beamO = clamp((beamProg - i * 0.1) * 1.5);
              return (
                <line
                  key={i}
                  x1={240}
                  y1={startY}
                  x2={460}
                  y2={300}
                  stroke={C.blue}
                  strokeWidth={3}
                  strokeDasharray="8 4"
                  opacity={0.25 + 0.6 * beamO}
                  style={{filter: `drop-shadow(0 0 6px ${C.blue})`}}
                />
              );
            })}
          </g>

          {/* Blue CREATE VIEW lens (center) */}
          <g style={{opacity: clamp(pop(f, t(20)))}}>
            <circle cx={500} cy={300} r={60} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={4} style={{filter: `drop-shadow(0 0 ${16 + pulse * 10}px ${C.blue})`}} />
            <circle cx={500} cy={300} r={44} fill="none" stroke={C.blue} strokeWidth={2} opacity={0.5} />
            <text x={500} y={292} fill={C.blue} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">CREATE</text>
            <text x={500} y={312} fill={C.blue} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">VIEW</text>
            <text x={500} y={385} fill={C.blue} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">projection lens</text>
          </g>

          {/* Projected beam from lens to virtual table */}
          <g style={{opacity: clamp(pop(f, t(20)))}}>
            <line x1={560} y1={300} x2={720} y2={300} stroke={C.green} strokeWidth={3.5} strokeDasharray="8 4" opacity={0.7 + 0.3 * beamProg} />
            <polygon points="714,294 714,306 728,300" fill={C.green} />
            <text x={640} y={288} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">projects ──►</text>
          </g>

          {/* Virtual table (transparent grid) on the right */}
          <g style={{opacity: clamp(virtualP)}}>
            <rect x={730} y={160} width={250} height={280} fill={`${C.green}0d`} stroke={C.green} strokeWidth={2.5} strokeDasharray="6 4" rx={12} style={{filter: `drop-shadow(0 0 12px ${C.green}44)`}} />
            <text x={855} y={192} fill={C.green} fontSize={15} fontFamily={MONO} fontWeight={700} textAnchor="middle">vw_store_sales</text>
            <text x={855} y={212} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">Virtual Table</text>
            {/* Grid rows */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((r) => (
              <line key={r} x1={745} y1={234 + r * 22} x2={965} y2={234 + r * 22} stroke={C.green} strokeWidth={1} opacity={0.4} />
            ))}
            {/* Phantom rows of data */}
            <text x={760} y={252} fill={C.green} fontSize={11} fontFamily={MONO} opacity={0.8}>101 | Ahmed | Mouse | 250</text>
            <text x={760} y={274} fill={C.green} fontSize={11} fontFamily={MONO} opacity={0.6}>102 | Sara  | Keys  | 480</text>
            <text x={760} y={296} fill={C.green} fontSize={11} fontFamily={MONO} opacity={0.5}>103 | Omar  | Cable | 90</text>
            <text x={760} y={318} fill={C.green} fontSize={11} fontFamily={MONO} opacity={0.4}>104 | Hana  | Cam   | 720</text>
            {/* Zero disk badge */}
            <rect x={760} y={400} width={190} height={32} fill={`${C.green}22`} stroke={C.green} strokeWidth={2} rx={16} />
            <text x={855} y={421} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">Zero Disk Space ✓</text>
          </g>

          {/* Projection status banner */}
          {beamProg > 0.95 ? (
            <g style={{opacity: clamp(pop(f, t(27)))}}>
              <rect x={250} y={500} width={500} height={50} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 12px ${C.green})`}} />
              <text x={500} y={532} fill={C.green} fontSize={15} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ Virtual Table Materialized on Demand · Zero Storage Overhead</text>
            </g>
          ) : null}

          {/* Caption-style status text below */}
          <text x={500} y={580} fill={C.muted} fontSize={13} fontFamily={MONO} textAnchor="middle">
            {beamProg < 0.3 ? 'physical tables ready...' : beamProg < 0.9 ? 'blue lens projecting query...' : 'virtual table live ✓ · zero disk'}
          </text>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 16, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.blue}}>Physical · on disk</span>
          <span style={{color: beamProg >= 1 ? C.green : C.amber, opacity: clamp(pop(f, t(20)))}}>
            {beamProg >= 1 ? '✓ virtual table live' : beamProg > 0 ? `projecting... ${Math.round(beamProg * 100)}%` : 'idle'}
          </span>
          <span style={{color: C.green}}>Virtual · zero disk</span>
        </div>
      </Win>

      {/* Seal badge bottom-left */}
      <div style={{position: 'absolute', left: 80, top: 920, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={sealP} size={36} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Virtual Table · Sealed ✓</div>
        </div>
      </div>

      {/* Module 14 Architecture chip bottom-right */}
      <div style={{position: 'absolute', right: 80, top: 920, opacity: clamp(modP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={modP} size={36} color={C.green} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Module 14 Architecture ✓</div>
        </div>
      </div>

      <Caption text="CREATE VIEW ──► Projection Lens ──► Virtual Table ──► Zero Disk Space ──► Module 14 Start" from={t(20)} to={sec(38)} tone="ok" />
    </Stage>
  );
};
