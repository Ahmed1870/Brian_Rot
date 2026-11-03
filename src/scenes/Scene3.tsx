import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Caption, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lerp, pop, prog, sec} from '../kit';

// SC03 (frames 2390-3745, global 79.7-124.8s): UPDATE ... WHERE, the blind-UPDATE trap, MVCC dead tuples, VACUUM.
const S = 79.67;
const t = (g: number) => sec(g - S);

const PRODUCTS = [
  {id: 1, n: 'Keyboard', cat: 5, p: 120},
  {id: 2, n: 'Mouse', cat: 5, p: 80},
  {id: 3, n: 'Monitor', cat: 2, p: 250},
  {id: 4, n: 'Cable', cat: 5, p: 45},
  {id: 5, n: 'Laptop', cat: 3, p: 300},
  {id: 6, n: 'Webcam', cat: 2, p: 60},
];

const Tuple: React.FC<{y: number; label: string; price: string; state: 'live' | 'dead' | 'new' | 'free'; p: number; tag?: string}> = ({y, label, price, state, p, tag}) => {
  const col = state === 'new' ? C.green : state === 'dead' ? C.muted : state === 'free' ? C.border : C.blue;
  return (
    <div dir="ltr" style={{position: 'absolute', left: 30, right: 30, top: y, height: 96, borderRadius: 16, border: `2px ${state === 'free' ? 'dashed' : 'solid'} ${col}`, background: state === 'new' ? `${C.green}18` : state === 'free' ? 'transparent' : C.deep, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 24, fontFamily: MONO, color: state === 'dead' ? C.muted : C.text, opacity: clamp(p), transform: `translateY(${(1 - clamp(p)) * 24}px)`}}>
      <span style={{fontSize: 22, color: col, width: 120}}>{label}</span>
      <span style={{fontSize: 26, flex: 1}}>{state === 'free' ? 'free space' : `product_id=1 · unit_price=${price}`}</span>
      {tag && <Chip color={state === 'dead' ? C.red : C.green} style={{fontSize: 20}}>{tag}</Chip>}
    </div>
  );
};

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const tbl = prog(f, t(81.4), 24);
  const hi = prog(f, t(84.0), 18);
  const raise = prog(f, t(85.0), 20);
  const blind = prog(f, t(92.8), 22);
  const alarm = prog(f, t(93.7), 18);
  const mvcc = prog(f, t(99.3), 24);
  const tblOut = 1 - mvcc;
  const oldDead = prog(f, t(109.4), sec(2.6));
  const newPop = pop(f, t(112.9));
  const vac = prog(f, t(117.4), sec(3));
  const shake = f >= t(93.7) && f < t(96.5) ? Math.sin(f * 2.4) * 6 * (1 - prog(f, t(93.7), sec(2.8))) : 0;
  const rowsAffected = Math.round(lerp(3, 6, blind));

  return (
    <Stage dur={1355} inFx="left" outFx="up">
      <TopBadge text="UPDATE ... SET · قوة وحذر التحديث" from={t(81.2)} to={t(98)} color={C.amber} />

      <Editor x={90} y={170} w={900} h={250} title="update_prices.sql" lines={['UPDATE products', 'SET unit_price = unit_price * 1.10', 'WHERE category_id = 5;']} start={t(81.2)} cps={0.75} size={26} accent={C.amber} strikeLine={blind > 0.5 && mvcc < 0.5 ? 2 : -1} dim={mvcc > 0.5} />

      {/* products table (correct vs blind) */}
      <div style={{opacity: tbl * tblOut}}>
        <Win x={90} y={460} w={900} h={440} title="products" accent={blind > 0.5 ? C.red : C.border} opacity={1}>
          <div dir="ltr" style={{padding: '14px 12px 0 12px', transform: `translateX(${shake}px)`}}>
            <div style={{display: 'flex', fontFamily: MONO, fontSize: 19, color: C.muted, borderBottom: `2px solid ${C.border}`, paddingBottom: 8}}>
              <div style={{width: 110, paddingLeft: 10}}>id</div>
              <div style={{width: 260, paddingLeft: 10}}>name</div>
              <div style={{width: 200, paddingLeft: 10}}>category_id</div>
              <div style={{width: 200, paddingLeft: 10}}>unit_price</div>
            </div>
            {PRODUCTS.map((r) => {
              const target = r.cat === 5;
              const hot = target && hi > 0.5;
              const changed = (target && raise > 0.5) || blind > 0.5;
              const price = changed ? String(Math.round(r.p * 1.1 * 10) / 10) : String(r.p);
              const rowCol = blind > 0.5 ? C.red : C.green;
              return (
                <div key={r.id} style={{display: 'flex', alignItems: 'center', height: 54, fontFamily: MONO, fontSize: 22, color: C.text, background: blind > 0.5 ? `${C.red}22` : hot ? `${C.blue}1F` : 'transparent', borderBottom: `1px solid ${C.border}`, borderRadius: 6}}>
                  <div style={{width: 110, paddingLeft: 10, color: C.muted}}>{r.id}</div>
                  <div style={{width: 260, paddingLeft: 10}}>{r.n}</div>
                  <div style={{width: 200, paddingLeft: 10, color: target ? C.blue : C.muted, fontWeight: target ? 700 : 400}}>{r.cat}</div>
                  <div style={{width: 200, paddingLeft: 10, color: changed ? rowCol : C.text, fontWeight: changed ? 700 : 400}}>{price}</div>
                </div>
              );
            })}
          </div>
        </Win>
      </div>

      {/* right side: correct behaviour counter / danger banner */}
      <div style={{position: 'absolute', left: 1050, top: 170, width: 780, opacity: tbl * tblOut}}>
        <div dir="ltr" style={{background: C.card, border: `2px solid ${blind > 0.5 ? C.red : C.green}`, borderRadius: 22, padding: '26px 34px'}}>
          <div style={{fontFamily: MONO, fontSize: 22, color: C.muted}}>rows affected</div>
          <div style={{fontFamily: MONO, fontSize: 110, fontWeight: 700, lineHeight: 1.1, color: blind > 0.5 ? C.red : C.green}}>{hi > 0.5 ? rowsAffected : 0}<span style={{fontSize: 44, color: C.muted}}> / 6</span></div>
          <Chip color={blind > 0.5 ? C.red : C.green} style={{marginTop: 8}}>{blind > 0.5 ? 'NO WHERE → entire table' : 'WHERE category_id = 5'}</Chip>
        </div>
        <div style={{marginTop: 26, borderRadius: 22, border: `3px solid ${C.red}`, background: `${C.red}1A`, padding: '24px 30px', opacity: alarm, transform: `translateY(${(1 - alarm) * 30}px) translateX(${shake}px)`}}>
          <div dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 20}}>
            <svg width={70} height={64} viewBox="0 0 70 64"><path d="M35 4 L66 58 H4 Z" fill="none" stroke={C.red} strokeWidth={6} strokeLinejoin="round" /><line x1={35} y1={24} x2={35} y2={40} stroke={C.red} strokeWidth={6} strokeLinecap="round" /><circle cx={35} cy={50} r={3.5} fill={C.red} /></svg>
            <div style={{fontFamily: MONO, fontSize: 26, fontWeight: 700, color: C.red, lineHeight: 1.3}}>Blind UPDATE Trap:<br />Omitting WHERE updates the entire table!</div>
          </div>
          <Mix style={{display: 'block', marginTop: 12, fontSize: 36, fontWeight: 700, color: C.text}}>التحديث الأعمى = تغيير الجدول بالكامل</Mix>
        </div>
      </div>

      {/* MVCC heap page */}
      <div style={{opacity: mvcc}}>
        <Win x={1050} y={170} w={780} h={600} title="Heap Page · MVCC" accent={C.blue} opacity={1}>
          <Tuple y={26} label="ctid (0,1)" price="120" state={vac > 0.7 ? 'free' : oldDead > 0.5 ? 'dead' : 'live'} p={1} tag={vac > 0.7 ? undefined : oldDead > 0.5 ? 'DEAD TUPLE' : undefined} />
          <div style={{opacity: newPop}}>
            <Tuple y={150} label="ctid (0,2)" price="132" state="new" p={newPop} tag="NEW VERSION" />
          </div>
          <Tuple y={274} label="ctid (0,3)" price="—" state="free" p={vac > 0.7 ? 1 : 0} />
          <div dir="ltr" style={{position: 'absolute', left: 30, top: 410, fontFamily: MONO, fontSize: 22, color: C.muted}}>old row is never overwritten — flagged, then cleaned</div>
          <div style={{position: 'absolute', left: 30, right: 30, top: 460, opacity: vac}}>
            <Chip color={C.green} style={{fontSize: 28, padding: '10px 26px'}}>VACUUM → space reclaimed ✓</Chip>
          </div>
          <div style={{position: 'absolute', left: -60 + vac * 880, top: 26, width: 8, height: 96, background: C.green, opacity: vac > 0 && vac < 1 ? 0.9 : 0, boxShadow: `0 0 18px ${C.green}`}} />
        </Win>
      </div>

      <Caption text="UPDATE products SET unit_price = unit_price * 1.10 WHERE ..." from={t(83)} to={t(98)} />
      <Caption text="MVCC Mechanics ──► Creates New Tuple Version & Flags Dead Tuple" from={t(105)} to={t(123.5)} />
    </Stage>
  );
};
