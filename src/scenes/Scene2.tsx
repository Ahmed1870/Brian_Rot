import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';
import {JSONB_DOC, JSONB_KEYS} from '../data';

// SC02 (40-85s): Hash Index + GIN Inverted Index — Equality vs Containment
// Anchors: 41.0 hash | 45.0 equality | 52.0 GIN | 60.0 JSONB | 68.0 arrays | 75.0 inverted | 80.0 fast
const S = START.s2;
const t = (g: number) => sec(g - S);

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const leftP = clamp(lin(f, t(41.5), 14));
  const rightP = clamp(lin(f, t(52), 14));
  // Hash flow animation
  const hashFlowP = clamp(lin(f, t(45), sec(20)));
  // GIN decomposition animation
  const ginDecompP = clamp(lin(f, t(60), sec(20)));
  const visibleKeys = Math.max(0, Math.floor(ginDecompP * JSONB_KEYS.length));
  const sealP = pop(f, t(75));
  const fastP = pop(f, t(80));

  // Hash buckets — 8 buckets, the email hashes to bucket #3
  const hashBuckets = [0, 1, 2, 3, 4, 5, 6, 7];
  const targetBucket = 3;

  return (
    <Stage dur={1350} inFx="left" outFx="left">
      <TopBadge text="هاش و GIN | Hash Index & GIN Inverted Index" from={sec(2)} to={sec(40)} color={C.amber} />

      {/* LEFT: Hash Index — equality lookup */}
      <div style={{opacity: leftP, transform: `translateX(${(1 - leftP) * -30}px)`}}>
        <Editor
          x={80}
          y={180}
          w={860}
          h={130}
          title="Hash Index ──► equality only (=)"
          lines={['CREATE INDEX idx_email ON users USING hash (email);']}
          start={t(41.5)}
          cps={0.85}
          size={18}
          accent={C.blue}
          hl={0}
          hlColor={C.blue}
        />
        <Win x={80} y={330} w={860} h={570} title="hash index · maps key to bucket via hash function" accent={C.blue} opacity={leftP}>
          <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.blue}}>
            exact equality lookup ──► no range support
          </div>

          {/* Flow visualization: input → hash function → bucket → TID */}
          <div style={{position: 'absolute', left: 18, right: 18, top: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
            {/* Step 1: input key */}
            <div style={{display: 'flex', alignItems: 'center', gap: 14, opacity: hashFlowP > 0.05 ? 1 : 0.4}}>
              <div dir="ltr" style={{padding: '10px 18px', border: `2px solid ${C.blue}`, borderRadius: 10, background: `${C.blue}0d`, fontFamily: MONO, fontSize: 16, color: C.text}}>
                email = 'user@example.com'
              </div>
            </div>

            {/* Arrow down */}
            <svg width={60} height={28}>
              <line x1={30} y1={2} x2={30} y2={22} stroke={C.blue} strokeWidth={3} strokeDasharray="5 3" />
              <polygon points="24,18 36,18 30,26" fill={C.blue} />
            </svg>

            {/* Step 2: hash function */}
            <div style={{display: 'flex', alignItems: 'center', gap: 16, opacity: hashFlowP > 0.15 ? 1 : 0.4}}>
              <div style={{width: 80, height: 80, borderRadius: 40, border: `3px solid ${C.blue}`, background: `${C.blue}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 14, color: C.blue, fontWeight: 700, textAlign: 'center'}}>
                hash()
              </div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.blue}}>
                ──►
              </div>
              <div dir="ltr" style={{padding: '10px 18px', border: `2px solid ${C.blue}`, borderRadius: 10, background: C.deep, fontFamily: MONO, fontSize: 18, color: C.amber, fontWeight: 700}}>
                0x3F4A
              </div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.muted}}>
                mod 8 = bucket #{targetBucket}
              </div>
            </div>

            {/* Arrow down */}
            <svg width={60} height={28}>
              <line x1={30} y1={2} x2={30} y2={22} stroke={C.blue} strokeWidth={3} strokeDasharray="5 3" />
              <polygon points="24,18 36,18 30,26" fill={C.blue} />
            </svg>

            {/* Step 3: bucket array */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, width: '100%', maxWidth: 700}}>
              {hashBuckets.map((b) => {
                const isTarget = b === targetBucket;
                const active = isTarget && hashFlowP > 0.5;
                return (
                  <div key={b} dir="ltr" style={{padding: '10px 8px', border: `2px solid ${active ? C.green : isTarget ? C.amber : C.border}`, borderRadius: 8, background: active ? `${C.green}0d` : isTarget ? `${C.amber}0d` : 'transparent', textAlign: 'center', fontFamily: MONO, fontSize: 14, color: active ? C.green : isTarget ? C.amber : C.muted, fontWeight: 700}}>
                    <div>#{b}</div>
                    <div style={{fontSize: 11, color: active ? C.green : C.muted, marginTop: 4}}>{active ? 'TID ✓' : '—'}</div>
                  </div>
                );
              })}
            </div>

            {/* Result */}
            {hashFlowP > 0.7 ? (
              <div style={{padding: '10px 18px', border: `2px solid ${C.green}`, borderRadius: 10, background: `${C.green}0d`, display: 'flex', alignItems: 'center', gap: 12, opacity: clamp(pop(f, t(50)))}}>
                <Check p={1} size={32} color={C.green} />
                <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.green, fontWeight: 700}}>TID (block=12, offset=4) ──► row found</div>
              </div>
            ) : null}
          </div>

          {/* Bottom status */}
          <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.blue, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
            <span>operator: =</span>
            <span style={{color: C.muted}}>no range, no sorting</span>
            <span>cost: O(1) avg</span>
          </div>
        </Win>
      </div>

      {/* RIGHT: GIN Index — JSONB / arrays / full-text */}
      <div style={{opacity: rightP, transform: `translateX(${(1 - rightP) * 30}px)`}}>
        <Editor
          x={980}
          y={180}
          w={860}
          h={130}
          title="GIN Index ──► inverted index (arrays, JSONB, tsvector)"
          lines={['CREATE INDEX idx_specs ON products USING gin (specs_jsonb);']}
          start={t(52.5)}
          cps={0.78}
          size={17}
          accent={C.amber}
          hl={0}
          hlColor={C.amber}
        />
        <Win x={980} y={330} w={860} h={570} title="GIN · inverted index · decompose JSONB into keys" accent={C.amber} opacity={rightP}>
          <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.amber}}>
            each key/element ──► list of TIDs (inverted index)
          </div>

          {/* JSONB document on the left, decomposed keys on the right */}
          <div style={{position: 'absolute', left: 18, right: 18, top: 60, display: 'flex', gap: 14}}>
            {/* JSONB document */}
            <div style={{flex: 1, padding: '12px 14px', border: `2px solid ${C.amber}`, borderRadius: 10, background: C.deep, fontFamily: MONO, fontSize: 12, color: C.text, lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}>
              <div style={{color: '#64748B', fontSize: 11, marginBottom: 6}}>JSONB document (specs_jsonb column)</div>
              {JSONB_DOC}
            </div>

            {/* Decomposition arrow */}
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6}}>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 12, color: C.amber, fontWeight: 700}}>decompose</div>
              <svg width={50} height={30}>
                <line x1={4} y1={15} x2={40} y2={15} stroke={C.amber} strokeWidth={3} strokeDasharray="5 3" />
                <polygon points="34,9 34,21 46,15" fill={C.amber} />
              </svg>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 11, color: C.muted}}>extract keys</div>
            </div>

            {/* Inverted index matrix */}
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 6}}>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 12, color: '#64748B', marginBottom: 2}}>inverted index · key ──► TID list</div>
              {JSONB_KEYS.map((k, i) => {
                const visible = i < visibleKeys;
                return (
                  <div key={i} dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', border: `1px solid ${visible ? C.amber : C.border}`, borderRadius: 6, background: visible ? `${C.amber}0d` : 'transparent', fontFamily: MONO, fontSize: 12, opacity: visible ? 1 : 0.35}}>
                    <span style={{color: C.amber, fontWeight: 700, minWidth: 110}}>{k.key}</span>
                    <span style={{color: C.muted}}>=&gt;</span>
                    <span style={{color: C.text}}>"{k.value}"</span>
                    <span style={{color: C.green, marginLeft: 'auto'}}>→ TID(8,{i + 1})</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Containment query demo */}
          {ginDecompP > 0.6 ? (
            <div style={{position: 'absolute', left: 18, right: 18, bottom: 70, padding: '12px 14px', border: `2px solid ${C.green}`, borderRadius: 10, background: `${C.green}0d`, opacity: clamp(pop(f, t(68)))}}>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700, marginBottom: 4}}>containment operator @&gt; supported:</div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.text}}>
                {"SELECT * FROM products WHERE specs_jsonb @> '{\"tags\": [\"gaming\"]}';"}
              </div>
            </div>
          ) : null}

          {/* Bottom status */}
          <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.amber, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
            <span>operators: @&gt; ? ?| ?&amp;</span>
            <span style={{color: C.muted}}>arrays · JSONB · tsvector</span>
            <span>cost: O(matches)</span>
          </div>
        </Win>
      </div>

      {/* Seal badge */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 920, display: 'flex', justifyContent: 'center', opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={sealP} size={36} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Hash = Equality · GIN = Containment</div>
        </div>
      </div>

      <Caption text="Hash Index ──► Equality (=) O(1) · GIN ──► Inverted Index for JSONB / Arrays" from={t(60)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
