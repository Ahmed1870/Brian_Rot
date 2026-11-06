import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Scene, Tag, Title, ease, fs, lerp, prog} from '../common';

const LINE = "CREATE INDEX idx_active_orders ON orders(order_id) WHERE status = 'active';";
const SHRINK = 450; // 3001

const Idx: React.FC<{box: typeof B.s3.full; partial: boolean}> = ({box, partial}) => {
  const f = useCurrentFrame();
  const col = partial ? C.blue : C.dim;
  const k = partial ? ease(prog(f, SHRINK, SHRINK + 250)) : 0;
  const h = lerp(300, 8, k);
  const mb = Math.round(lerp(800, 12, k));
  return (
    <Card box={box} accent={partial && k > 0.9 ? C.green : col} at={partial ? 24 : 6}>
      <div style={{position: 'absolute', left: 24, top: 18, direction: 'ltr'}}><Tag color={partial ? C.blue : C.dim}>{partial ? "PARTIAL INDEX · WHERE status='active'" : 'FULL INDEX · ALL ROWS'}</Tag></div>
      <div style={{position: 'absolute', left: (box.w - 320) / 2, top: 60 + (300 - h), width: 320, height: h, borderRadius: 16, background: partial ? (k > 0.9 ? C.green : C.blue) : C.row, opacity: 0.9}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 372, textAlign: 'center', direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 58, color: partial && k > 0.9 ? C.green : partial ? C.blue : C.text}}>{mb} MB</div>
      <div style={{position: 'absolute', left: 24, right: 24, bottom: 20, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 28, color: partial ? C.green : C.amber, opacity: prog(f, partial ? SHRINK + 250 : 200, partial ? SHRINK + 310 : 260)}}>
        {partial ? 'الصفوف القديمة من غير تكلفة تحديث ✓' : 'كل UPDATE بيحدّث الفهرس كله'}
      </div>
    </Card>
  );
};

export const Scene03: React.FC = () => {
  const f = useCurrentFrame();
  const K = B.s3.code;
  const size = fs(LINE, K.w - 80, 44, mono);
  const n = Math.floor(prog(f, 20, 300) * LINE.length);
  const t = LINE.slice(0, n);
  return (
    <Scene dur={S.s3.dur} accent={C.blue}>
      <Title ar="الفهارس الجزئية والذاكرة" en="Partial Indexes & RAM Footprint" chip="SC 03 · PARTIAL" accent={C.blue} />
      <Card box={K} accent={C.line} at={6}>
        <div style={{position: 'absolute', left: 36, right: 36, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontFamily: mono, fontWeight: 700, fontSize: size, color: C.text, direction: 'ltr', whiteSpace: 'pre'}}>
          {t.split(/(CREATE INDEX|ON|WHERE)/).map((p, i) => <span key={i} style={{color: p === 'CREATE INDEX' ? C.blue : p === 'ON' || p === 'WHERE' ? C.pink : /^'.*'?;?$/.test(p) ? C.text : C.text}}>{p}</span>)}
        </div>
      </Card>
      <Idx box={B.s3.full} partial={false} />
      <Idx box={B.s3.part} partial />
      <Caption from={90} to={630} color={C.blue}>CREATE INDEX ... WHERE status = 'active' ──► Indexes Only Relevant Rows</Caption>
      <Caption from={750} to={1230} color={C.green}>Memory Savings ──► 800 MB ➔ 12 MB (Reduced DML Write Penalty)</Caption>
    </Scene>
  );
};
