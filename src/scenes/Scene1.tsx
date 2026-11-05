import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';

// SC01 (0-40s): Materialized Views — Physical Snapshots on Disk
// Anchors: 1.0 welcome | 5.0 materialized | 9.0 physical | 14.0 snapshot | 20.0 disk | 28.0 fast read | 35.0 refresh
const S = START.s1;
const t = (g: number) => sec(g - S);

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(2), 14));
  const compareP = clamp(lin(f, t(4), 14));
  // Solid block drops and locks onto disk
  const dropProg = clamp(lin(f, t(8), sec(16)));
  const sealP = pop(f, t(28));

  return (
    <Stage dur={1200} inFx="zoom" outFx="left">
      <TopBadge text="المناظير المادية وإعادة الإنعاش | Materialized Views (CREATE MATERIALIZED VIEW)" from={sec(2)} to={sec(18)} />

      {/* SQL editor on the left */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={180}
          w={820}
          h={220}
          title="Query Editor"
          lines={[
            'CREATE MATERIALIZED VIEW mv_sales AS',
            '  SELECT store_id,',
            '         SUM(total_amount) AS revenue',
            '  FROM store_orders',
            '  GROUP BY store_id;',
          ]}
          start={t(2)}
          cps={0.85}
          size={18}
          accent={C.blue}
          hl={0}
          hlColor={C.blue}
        />
      </div>

      {/* Concept callout */}
      <div style={{position: 'absolute', left: 80, top: 420, width: 820, opacity: clamp(lin(f, t(9), 14))}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.muted, marginBottom: 10}}>◆ physical storage</div>
        <div style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}>
          <Chip color={C.blue}>Heap Table on Disk</Chip>
          <Chip color={C.green}>Pre-computed</Chip>
          <Chip color={C.amber}>Snapshot</Chip>
        </div>
      </div>

      {/* Performance badge */}
      <div style={{position: 'absolute', left: 80, top: 530, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 22px', border: `2px solid ${C.green}`, borderRadius: 16, background: `${C.green}0d`}}>
          <Check p={sealP} size={44} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, color: C.green, fontWeight: 700}}>Physical Storage on Disk</div>
            <Mix style={{fontSize: 18, color: C.muted}}>لقطة زمنية ثابتة على القرص الصلب</Mix>
          </div>
        </div>
      </div>

      {/* Comparison visualization on the right */}
      <Win x={940} y={180} w={900} h={720} title="standard view vs materialized view" accent={C.blue} opacity={compareP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.blue}}>
          virtual query vs physical snapshot
        </div>

        {/* Standard View (left half — virtual, transparent) */}
        <div style={{position: 'absolute', left: 20, top: 50, width: 400, height: 580, border: `2px dashed ${C.muted}`, borderRadius: 16, background: `${C.muted}08`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.6}}>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.muted, fontWeight: 700, marginBottom: 16}}>Standard View</div>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.muted, textAlign: 'center', padding: '0 20px'}}>
            virtual · re-runs<br/>query every time
          </div>
          {/* Transparent/ghost effect */}
          <div style={{marginTop: 30, fontSize: 48, color: C.muted, opacity: 0.3}}>👻</div>
        </div>

        {/* Materialized View (right half — solid, physical) */}
        <div style={{position: 'absolute', right: 20, top: 50, width: 400}}>
          {/* Solid block that drops and locks */}
          <div style={{
            position: 'relative',
            width: 400,
            height: 580,
            borderRadius: 16,
            border: `3px solid ${C.blue}`,
            background: `${C.blue}14`,
            boxShadow: `0 0 32px ${C.blue}44`,
            transform: `translateY(${(1 - dropProg) * -80}px)`,
            opacity: dropProg,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.blue, fontWeight: 700, marginBottom: 16}}>Materialized View</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.blue, textAlign: 'center', padding: '0 20px'}}>
              physical · pre-computed<br/>stored on disk
            </div>
            {/* Solid block icon */}
            <div style={{marginTop: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
              <svg width={80} height={80} viewBox="0 0 80 80">
                <rect x={10} y={10} width={60} height={60} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={3} rx={8} />
                <rect x={18} y={18} width={44} height={8} fill={C.blue} opacity={0.6} rx={2} />
                <rect x={18} y={32} width={44} height={8} fill={C.blue} opacity={0.6} rx={2} />
                <rect x={18} y={46} width={44} height={8} fill={C.blue} opacity={0.6} rx={2} />
              </svg>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700}}>Heap Table ✓</div>
            </div>
            {/* Storage badge */}
            {dropProg >= 0.9 ? (
              <div style={{position: 'absolute', bottom: 20, padding: '8px 16px', border: `2px solid ${C.green}`, borderRadius: 10, background: `${C.green}0d`, fontFamily: MONO, fontSize: 16, color: C.green, fontWeight: 700, opacity: clamp(pop(f, t(20)))}}>
                💾 Physical Storage on Disk
              </div>
            ) : null}
          </div>
        </div>

        {/* Bottom summary */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 44, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 18, color: C.blue, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>CREATE MATERIALIZED VIEW</span>
          <span>{dropProg >= 1 ? '✓ snapshot stored' : 'materializing...'}</span>
        </div>
      </Win>

      <Caption text="CREATE MATERIALIZED VIEW mv_sales AS ... ──► Stores Query Results Physical on Disk" from={t(22)} to={sec(38)} />
    </Stage>
  );
};
