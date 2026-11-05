import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';
import {CUSTOMER_SPENDING, NTILE_QUARTILES} from '../data';

// SC01 (0-40s): NTILE(4) — Statistical Bucket Slicing
// Anchors (s): 1.0 welcome | 5.0 NTILE | 9.0 N buckets | 14.0 remainder | 20.0 VIP | 28.0 quartile | 35.0 slicing
const S = START.s1;
const t = (g: number) => sec(g - S);

const ROW_H = 48;
const ROW0 = 50;

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(2), 14));
  const tableP = clamp(lin(f, t(4), 14));
  // Laser dividers descend: start at t(7), all 3 dividers in place by t(18)
  const sliceProg = clamp(lin(f, t(7), sec(11)));
  const sealP = pop(f, t(28));

  // Quartile colors
  const qColors = [C.green, C.blue, C.amber, C.purple];
  const qLabels = ['Q1 · VIP', 'Q2 · High', 'Q3 · Mid', 'Q4 · Low'];

  return (
    <Stage dur={1200} inFx="zoom" outFx="left">
      <TopBadge text="التقسيم الإحصائي والتوزيع المئوي | Statistical Bucket Slicing & NTILE" from={sec(2)} to={sec(18)} />

      {/* SQL editor on the left */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={180}
          w={820}
          h={180}
          title="Query Editor"
          lines={[
            'SELECT customer_id, name, total_spent,',
            '       NTILE(4) OVER(ORDER BY total_spent DESC)',
            '         AS quartile',
            'FROM customer_stats;',
          ]}
          start={t(2)}
          cps={0.8}
          size={18}
          accent={C.purple}
          hl={f >= t(5) ? 1 : -1}
          hlColor={C.purple}
        />
      </div>

      {/* Concept callout */}
      <div style={{position: 'absolute', left: 80, top: 360, width: 820, opacity: clamp(lin(f, t(9), 14))}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.muted, marginBottom: 10}}>◆ bucket slicing</div>
        <div style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}>
          <Chip color={C.purple}>NTILE(4)</Chip>
          <Chip color={C.green}>4 equal quartiles</Chip>
          <Chip color={C.amber}>remainder → first buckets</Chip>
        </div>
      </div>

      {/* VIP badge */}
      <div style={{position: 'absolute', left: 80, top: 470, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 22px', border: `2px solid ${C.green}`, borderRadius: 16, background: `${C.green}0d`}}>
          <Check p={sealP} size={44} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, color: C.green, fontWeight: 700}}>Top 25% VIP isolated</div>
            <Mix style={{fontSize: 18, color: C.muted}}>شريحة كبار العملاء بدقة تحليلية</Mix>
          </div>
        </div>
      </div>

      {/* Remainder distribution explanation */}
      <div style={{position: 'absolute', left: 80, top: 580, width: 820, opacity: clamp(lin(f, t(14), 16))}}>
        <div style={{padding: '14px 18px', border: `2px solid ${C.amber}`, borderRadius: 12, background: `${C.amber}0d`}}>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.amber, fontWeight: 700, marginBottom: 6}}>remainder distribution</div>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.text}}>10 rows ÷ 4 buckets = 2 remainder</div>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.muted, marginTop: 4}}>→ Q1: 3 rows · Q2: 3 rows · Q3: 2 rows · Q4: 2 rows</div>
        </div>
      </div>

      {/* Customer spending table on the right */}
      <Win x={940} y={180} w={900} h={720} title="customer_stats · NTILE(4) quartiles" accent={C.purple} opacity={tableP}>
        <div dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: 0, height: ROW0, display: 'flex', alignItems: 'center', padding: '0 18px', fontFamily: MONO, fontSize: 19, color: C.muted, borderBottom: `1px solid ${C.border}`}}>
          <span style={{width: 60}}>id</span>
          <span style={{width: 130}}>name</span>
          <span style={{width: 140, textAlign: 'right'}}>total_spent</span>
          <span style={{flex: 1, textAlign: 'right', color: C.purple}}>quartile</span>
        </div>

        {/* Quartile bucket overlays — colored bands behind rows */}
        {[0, 3, 6, 8].map((startIdx, qi) => {
          const endIdx = qi < 3 ? [3, 6, 8, 10][qi] : 10;
          const bandHeight = (endIdx - startIdx) * ROW_H;
          const bandTop = ROW0 + startIdx * ROW_H;
          const visible = sliceProg > (qi / 4);
          return (
            <div key={qi} style={{position: 'absolute', left: 8, right: 8, top: bandTop, height: bandHeight, borderRadius: 10, border: `2px solid ${qColors[qi]}`, background: `${qColors[qi]}0d`, opacity: visible ? 0.6 : 0, pointerEvents: 'none', transition: 'none'}} />
          );
        })}

        {CUSTOMER_SPENDING.map((row, i) => {
          const quartile = NTILE_QUARTILES[i];
          const qColor = qColors[quartile - 1];
          const qLabel = qLabels[quartile - 1];
          const inBucket = sliceProg > (quartile / 4);
          return (
            <div key={row.id} dir="ltr" style={{position: 'absolute', left: 12, right: 12, top: ROW0 + i * ROW_H + 3, height: ROW_H - 6, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 14px', fontFamily: MONO, fontSize: 22, color: C.text, opacity: inBucket ? 1 : 0.4, zIndex: 2}}>
              <span style={{width: 50, color: C.muted}}>#{row.id}</span>
              <span style={{width: 120, color: C.blue}}>{row.name}</span>
              <span style={{width: 130, color: C.text, fontWeight: 700, textAlign: 'right'}}>${row.total_spent.toLocaleString()}</span>
              <span style={{flex: 1, textAlign: 'right', color: qColor, fontWeight: 700}}>
                {inBucket ? `Q${quartile} · ${qLabel.split('· ')[1]}` : '—'}
              </span>
            </div>
          );
        })}

        {/* Laser dividers — purple lines between quartiles */}
        {sliceProg > 0 ? (
          <>
            {[3, 6, 8].map((divIdx, di) => {
              const divVisible = sliceProg > ((di + 1) / 4);
              const divTop = ROW0 + divIdx * ROW_H;
              return divVisible ? (
                <div key={di} style={{position: 'absolute', left: 8, right: 8, top: divTop, height: 3, background: C.purple, boxShadow: `0 0 16px ${C.purple}`, zIndex: 3}} />
              ) : null;
            })}
          </>
        ) : null}

        {/* Bottom summary */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 44, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 20, color: C.purple, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>NTILE(4) OVER(ORDER BY total_spent DESC)</span>
          <span>4 quartiles · 10 rows</span>
        </div>
      </Win>

      <Caption text="NTILE(4) OVER(ORDER BY total_spent DESC) ──► Divides Dataset into 4 Equal Quartiles" from={t(22)} to={sec(38)} />
    </Stage>
  );
};
