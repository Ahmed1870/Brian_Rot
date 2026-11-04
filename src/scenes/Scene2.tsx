import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Warn, Win, clamp, lin, pop, sec} from '../kit';
import {NAMES} from '../data';

// SC02 (40-85s): LIKE vs ILIKE — Wildcards and Case Sensitivity
// Anchors (s): 41.1 wildcards | 45.0 LIKE | 52.0 ILIKE | 60.0 % | 65.0 _ | 70.0 case-insensitive | 78.0 easy find
const S = START.s2;
const t = (g: number) => sec(g - S);

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  // Left panel: LIKE 'a%' (case-sensitive) — only 'ahmed' matches
  // Right panel: ILIKE 'a%' (case-insensitive) — both 'ahmed' and 'Ahmed' match
  const leftP = clamp(lin(f, t(41.5), 14));
  const rightP = clamp(lin(f, t(52), 14));
  const wildcardP = clamp(lin(f, t(60), 14));

  // Scan animation: a laser passes through the rows
  const leftScan = clamp(lin(f, t(46), sec(5)));
  const rightScan = clamp(lin(f, t(53), sec(5)));

  const ROW_H = 56;
  const ROW0 = 70;

  return (
    <Stage dur={1350} inFx="left" outFx="left">
      <TopBadge text="المطابقة بالأنماط | LIKE vs ILIKE Wildcards" from={sec(2)} to={sec(40)} color={C.amber} />

      {/* LEFT: LIKE 'a%' — case-sensitive */}
      <div style={{opacity: leftP, transform: `translateX(${(1 - leftP) * -30}px)`}}>
        <Editor x={80} y={180} w={860} h={150} title="PostgreSQL · Case-Sensitive" lines={["WHERE name LIKE 'a%'"]} start={t(42)} cps={1.0} size={28} accent={C.red} />
        <Win x={80} y={350} w={860} h={540} title="LIKE 'a%' · matches lowercase only" accent={C.red}>
          <div dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: 0, height: ROW0, display: 'flex', alignItems: 'center', padding: '0 30px', fontFamily: MONO, fontSize: 22, color: C.muted, borderBottom: `1px solid ${C.border}`}}>
            <span style={{width: 80}}>id</span>
            <span style={{flex: 1}}>name</span>
            <span style={{width: 180, textAlign: 'right'}}>match</span>
          </div>
          {NAMES.map((n, i) => {
            const scanRow = Math.floor(leftScan * NAMES.length);
            const scanned = i <= scanRow;
            const isMatch = n.name === 'ahmed'; // case-sensitive: only 'ahmed' (lowercase)
            const showMatch = scanned && isMatch;
            const showReject = scanned && !isMatch && n.name.toLowerCase() === 'ahmed'; // 'Ahmed' would be a case-mismatch
            const showMiss = scanned && !isMatch && n.name.toLowerCase() !== 'ahmed';
            return (
              <div key={n.id} dir="ltr" style={{position: 'absolute', left: 14, right: 14, top: ROW0 + i * ROW_H + 4, height: ROW_H - 8, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 16px', fontFamily: MONO, fontSize: 26, background: showMatch ? `${C.red}33` : 'transparent', border: `2px solid ${showMatch ? C.red : 'transparent'}`, color: showMiss ? '#64748B' : C.text, opacity: scanned ? 1 : 0.4}}>
                <span style={{width: 64, fontWeight: 700, color: C.blue}}>{n.id}</span>
                <span style={{flex: 1}}>{n.name}</span>
                <span style={{width: 180, textAlign: 'right', color: showMatch ? C.green : showReject ? C.red : '#475569', fontWeight: 700}}>
                  {showMatch ? '✓ match' : showReject ? '✗ case mismatch' : showMiss ? '— no' : ''}
                </span>
              </div>
            );
          })}
          {/* scan laser */}
          {leftScan < 1 ? (
            <div style={{position: 'absolute', left: 0, right: 0, top: ROW0 + leftScan * NAMES.length * ROW_H, height: 3, background: C.red, boxShadow: `0 0 20px ${C.red}`, opacity: 0.9}} />
          ) : null}
          <div dir="ltr" style={{position: 'absolute', left: 24, right: 24, bottom: 24, display: 'flex', gap: 12, alignItems: 'center', opacity: clamp(pop(f, t(58)))}}>
            <Warn size={44} />
            <div style={{fontFamily: MONO, fontSize: 26, color: C.red, fontWeight: 700}}>Result: 1 row · misses 'Ahmed'</div>
          </div>
        </Win>
      </div>

      {/* RIGHT: ILIKE 'a%' — case-insensitive */}
      <div style={{opacity: rightP, transform: `translateX(${(1 - rightP) * 30}px)`}}>
        <Editor x={980} y={180} w={860} h={150} title="PostgreSQL · Case-Insensitive" lines={["WHERE name ILIKE 'a%'"]} start={t(52.5)} cps={1.0} size={28} accent={C.green} />
        <Win x={980} y={350} w={860} h={540} title="ILIKE 'a%' · matches any case" accent={C.green}>
          <div dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: 0, height: ROW0, display: 'flex', alignItems: 'center', padding: '0 30px', fontFamily: MONO, fontSize: 22, color: C.muted, borderBottom: `1px solid ${C.border}`}}>
            <span style={{width: 80}}>id</span>
            <span style={{flex: 1}}>name</span>
            <span style={{width: 180, textAlign: 'right'}}>match</span>
          </div>
          {NAMES.map((n, i) => {
            const scanRow = Math.floor(rightScan * NAMES.length);
            const scanned = i <= scanRow;
            const isMatch = n.name.toLowerCase().startsWith('a'); // case-insensitive: both 'ahmed' and 'Ahmed' match
            const showMatch = scanned && isMatch;
            const showMiss = scanned && !isMatch;
            return (
              <div key={n.id} dir="ltr" style={{position: 'absolute', left: 14, right: 14, top: ROW0 + i * ROW_H + 4, height: ROW_H - 8, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 16px', fontFamily: MONO, fontSize: 26, background: showMatch ? `${C.green}33` : 'transparent', border: `2px solid ${showMatch ? C.green : 'transparent'}`, color: showMiss ? '#64748B' : C.text, opacity: scanned ? 1 : 0.4}}>
                <span style={{width: 64, fontWeight: 700, color: C.blue}}>{n.id}</span>
                <span style={{flex: 1}}>{n.name}</span>
                <span style={{width: 180, textAlign: 'right', color: showMatch ? C.green : showMiss ? '#475569' : '#475569', fontWeight: 700}}>{showMatch ? '✓ match' : showMiss ? '— no' : ''}</span>
              </div>
            );
          })}
          {rightScan < 1 ? (
            <div style={{position: 'absolute', left: 0, right: 0, top: ROW0 + rightScan * NAMES.length * ROW_H, height: 3, background: C.green, boxShadow: `0 0 20px ${C.green}`, opacity: 0.9}} />
          ) : null}
          <div dir="ltr" style={{position: 'absolute', left: 24, right: 24, bottom: 24, display: 'flex', gap: 12, alignItems: 'center', opacity: clamp(pop(f, t(66)))}}>
            <Check p={pop(f, t(66))} size={44} />
            <div style={{fontFamily: MONO, fontSize: 24, color: C.green, fontWeight: 700}}>Result: 2 rows · both 'ahmed' & 'Ahmed'</div>
          </div>
        </Win>
      </div>

      {/* Wildcard legend at bottom */}
      <div style={{position: 'absolute', left: 80, top: 892, width: 1760, opacity: wildcardP, display: 'flex', gap: 24, justifyContent: 'center'}}>
        <Chip color={C.amber} style={{fontSize: 26}}>
          <span style={{fontSize: 32, fontWeight: 700}}>%</span> &nbsp;multiple chars
        </Chip>
        <Chip color={C.amber} style={{fontSize: 26}}>
          <span style={{fontSize: 32, fontWeight: 700}}>_</span> &nbsp;single char
        </Chip>
        <Chip color={C.red} style={{fontSize: 26}}>LIKE = case-sensitive</Chip>
        <Chip color={C.green} style={{fontSize: 26}}>ILIKE = case-insensitive</Chip>
      </div>

      <Caption text="LIKE 'a%' ──► Case-Sensitive Matching (% = Multiple, _ = Single)" from={t(42)} to={t(60)} tone="danger" />
      <Caption text="ILIKE 'a%' ──► PostgreSQL Case-Insensitive Pattern Matching" from={t(62)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
