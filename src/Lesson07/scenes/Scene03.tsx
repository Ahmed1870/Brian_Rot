import React from 'react';
import { C, FONT_MONO } from '../../theme';
import { AR, EN, Reveal, Card, Header, Arrowed, MiniTable } from '../../components/common';
import type { Col } from '../../components/common';
import { p, lin, win, bump } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s3;
const PARTS: [string, string, [number, number]][] = [
  ['CONSTRAINT chk_margin CHECK (', C.text, T.typeA as [number, number]],
  ['unit_price > 0', C.opt, T.typeB as [number, number]],
  [' AND cost_price < unit_price', C.db, T.typeC as [number, number]],
  [')', C.text, [T.typeC[1], T.typeC[1] + 0.2]],
];
const COLS: Col[] = [
  { k: 'name', w: 260, ar: true },
  { k: 'cost_price', w: 250, color: C.opt },
  { k: 'unit_price', w: 250, color: C.db },
];
const ROWS = [['لابتوب', '900', '1,250'], ['شاشة', '260', '380']];

export const Scene03: React.FC<{ t: number }> = ({ t }) => {
  const ed = p(t, T.editorAt, 0.8);
  const cmp = p(t, T.cmpAt, 0.6);
  const vio = p(t, T.violateAt, 0.6);
  const err = p(t, T.errorAt, 0.4);
  const shake = t >= T.errorAt && t < T.errorAt + 1.2 ? Math.sin(t * 60) * 8 * (1 - lin(t, T.errorAt, 1.2)) : 0;
  const fly = lin(t, T.violateAt + 0.4, 2.3);
  const flyX = 1700 - (1700 - 1000) * Math.min(1, fly * 1.6);
  const bounceX = fly > 0.62 ? 1000 + (fly - 0.62) / 0.38 * 600 : flyX;
  const gx = 1030;

  return (
    <g>
      <Header t={t} a={T.editorAt} b={T.typeA[0] + 0.5} ar="القيد الجبار CHECK" en="Check Constraint" y={105} color={C.opt} />

      {/* DDL editor */}
      <g opacity={ed} transform={`translate(0 ${(1 - ed) * 24})`}>
        <Card x={90} y={190} w={1740} h={170} stroke={C.client} glow={0.4} r={24} />
        <circle cx={130} cy={224} r={7} fill={C.accent} />
        <circle cx={156} cy={224} r={7} fill={C.opt} />
        <circle cx={182} cy={224} r={7} fill={C.db} />
        <EN x={1790} y={232} size={22} anchor="end" fill={C.muted}>products.ddl</EN>
        <text x={130} y={316} fontFamily={FONT_MONO} fontSize={32} fontWeight={600} direction="ltr">
          {PARTS.map(([s, c, [a, b]], i) => {
            const n = Math.floor(lin(t, a, b - a) * s.length);
            return <tspan key={i} fill={c} xmlSpace="preserve">{s.slice(0, n)}</tspan>;
          })}
        </text>
      </g>

      {/* products + cross-column comparison */}
      <g opacity={cmp} transform={`translate(0 ${(1 - cmp) * 24})`}>
        <Card x={90} y={410} w={900} h={430} stroke={C.line} glow={0.3} r={24} />
        <EN x={120} y={458} size={26} anchor="start" fill={C.opt} weight={600}>products</EN>
        <MiniTable x={120} y={476} cols={COLS} rows={[...ROWS, ['منتج جديد', '800', '500']]} rowH={62} hdrH={54} fs={24}
          rowStyle={(i) => (i === 2 ? { opacity: vio, dx: (1 - vio) * 40, fill: '#3A2030', stroke: C.accent, txt: '#FCA5A5' } : {})} />
        {/* cost > price warning marker */}
        <g opacity={vio}>
          <EN x={420 + 250} y={476 + 54 + 3 * 62 + 30} size={20} fill={C.accent}>800 &gt; 500 ✗</EN>
        </g>
      </g>

      {/* gate: cost < unit ? */}
      <g opacity={cmp}>
        <Card x={1030} y={410} w={800} h={170} stroke={C.line} r={24} />
        <path d="M 1430 440 L 1500 495 L 1430 550 L 1360 495 Z" fill={vio > 0.5 ? C.accent : C.db} fillOpacity={0.14} stroke={vio > 0.5 ? C.accent : C.db} strokeWidth={5} />
        <EN x={1430} y={503} size={17} fill={vio > 0.5 ? C.accent : C.db} weight={600}>cost &lt; unit?</EN>
        <EN x={1210} y={503} size={26} fill={C.muted}>row →</EN>
        <EN x={1640} y={472} size={22} fill={C.db} weight={600}>TRUE ✓ insert</EN>
        <EN x={1640} y={528} size={22} fill={C.accent} weight={600}>FALSE ✗ reject</EN>
      </g>
      {fly > 0 && fly < 1 && (
        <g>
          <circle cx={bounceX} cy={495} r={22} fill={C.accent} opacity={0.25} />
          <circle cx={bounceX} cy={495} r={11} fill={C.accent} />
        </g>
      )}

      {/* error card */}
      <g opacity={err} transform={`translate(${shake} ${(1 - err) * 20})`}>
        <rect x={1030} y={620} width={800} height={220} rx={22} fill="#2A1620" stroke={C.accent} strokeWidth={5} />
        <EN x={1062} y={680} size={28} anchor="start" fill={C.accent} weight={600}>ERROR: check_violation</EN>
        <EN x={1062} y={730} size={21} anchor="start" fill="#FCA5A5">{'new row for relation "products" violates'}</EN>
        <EN x={1062} y={764} size={21} anchor="start" fill="#FCA5A5">{'check constraint "chk_margin"'}</EN>
        <EN x={1062} y={812} size={20} anchor="start" fill={C.muted}>statement terminated — nothing written</EN>
      </g>

      {/* caption */}
      <g opacity={win(t, T.cap1[0], T.cap1[1], 0.4)}>
        <Arrowed y={985} left="CHECK (cost_price < unit_price)" right="Cross-Column Validation" leftColor={C.opt} rightColor={C.text} size={34} />
      </g>
    </g>
  );
};
