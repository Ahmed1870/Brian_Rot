import React from 'react';
import {C, fr, T} from '../theme';
import {ChalkDefs, Code, Marker, Stroke, Txt, rectD} from '../lib/chalk';
import {Sheet} from '../lib/board';
import {Header} from '../lib/ar';
import {ramp} from '../lib/anim';

const S = (t: number) => fr(t);
const W = 1080, H = 1920;

const BANDS = [
  {id: 'sql', y: 130, title: 'SQL: SELF JOIN for matching transactions', key: 'SELF JOIN', t0: T.sql, t1: T.python, lines: [
    'SELECT a.product AS item_a,', '       b.product AS item_b,', '       COUNT(*)  AS together', 'FROM orders a', 'JOIN orders b ON a.order_id = b.order_id', ' AND a.product < b.product', 'GROUP BY 1, 2;']},
  {id: 'py', y: 665, title: 'Python: mlxtend (Apriori Algorithm)', key: 'apriori', t0: T.python, t1: T.powerbi, lines: [
    'from mlxtend.frequent_patterns import apriori, association_rules', '', 'freq = apriori(basket, min_support=0.05, use_colnames=True)', 'rules = association_rules(freq, metric="lift", min_threshold=1)', 'print(rules[["antecedents", "consequents", "lift"]])']},
  {id: 'dax', y: 1200, title: 'Power BI: DAX Basket Logic', key: 'DAX', t0: T.powerbi, t1: 75.6, lines: [
    'Lift =', 'VAR sAB = DIVIDE([Orders A and B], [All Orders])', 'VAR sA  = DIVIDE([Orders A], [All Orders])', 'VAR sB  = DIVIDE([Orders B], [All Orders])', 'RETURN DIVIDE(sAB, sA * sB)']},
];

/** Scene 3 (59 - 75.6s): three horizontal bands, each typed at machine speed exactly while the VO names its tool. */
export const Scene3_Code: React.FC<{f: number}> = ({f}) => {
  const a0 = S(T.how) - 12, a1 = S(75.6);
  return (
    <>
      <Sheet f={f} from={a0} to={a1}>
  <Header f={f - a0} label="IN CODE" n={3} />
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
          <ChalkDefs />
          <Txt x={540} y={112} text="How do we implement it?" f={f} from={S(T.how)} size={36} anchor="middle" color={C.dim} cps={1.5} />
          {BANDS.map((b, i) => {
            const t0 = S(b.t0), t1 = S(b.t1);
            const act = ramp(f, t0 - 6, t0) * (1 - ramp(f, t1 - 4, t1));
            const col = act > 0.5 ? C.yellow : C.chalk;
            const op = 0.5 + 0.5 * Math.max(act, f >= t1 ? 0.55 : 0);
            return (
              <g key={b.id} opacity={Math.min(1, op)}>
                <g filter="url(#chalk)"><Stroke d={rectD(40, b.y, 1000, 500, 20 + i)} f={f} from={S(T.how) + i * 8} dur={24} w={act > 0.5 ? 5.5 : 3.5} color={col} /></g>
                <Txt x={70} y={b.y + 60} text={b.title} f={f} from={S(T.how) + 10 + i * 8} size={30} weight={900} color={col} cps={1.6} />
                <Marker x={70} y={b.y + 72} w={Math.min(560, b.title.length * 17)} f={f} from={t0 + 10} h={8} />
                <Code x={70} y={b.y + 140} lines={b.lines} f={f} from={t0 + 4} size={23} lh={50} cps={2.8} />
              </g>
            );
          })}
        </svg>
      </Sheet>
    </>
  );
};
