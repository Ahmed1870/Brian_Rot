// Lesson 22: Data Validation dialog, Excel message boxes, input-message note, in-cell drop-down, shield.
import React from 'react';
import {C, UIFONT, CELLFONT} from './theme';
import {Btn, CheckBox, Dlg, DropBox, clamp} from './kit';

const T: React.CSSProperties = {fontFamily: UIFONT, fontSize: 12.5, color: '#1B1B1B', whiteSpace: 'nowrap'};
const ab = (x: number, y: number, w?: number, h?: number, extra?: React.CSSProperties): React.CSSProperties => ({position: 'absolute', left: x, top: y, width: w, height: h, ...extra});
export type Allow = 'Any value' | 'Whole number' | 'Decimal' | 'List' | 'Date' | 'Time' | 'Text length' | 'Custom';
export const ALLOW_LIST: Allow[] = ['Any value', 'Whole number', 'Decimal', 'List', 'Date', 'Time', 'Text length', 'Custom'];
export type AlertStyle = 'Stop' | 'Warning' | 'Information';
export const DV = {w: 470, h: 410};

export type DvProps = {
  x: number; y: number; p: number; tab: 'Settings' | 'Input Message' | 'Error Alert';
  allow?: Allow; data?: string; min?: string; max?: string; source?: string; formula?: string;
  allowOpen?: number; hiItem?: Allow | null; hiColor?: string;
  glow?: 'allow' | 'source' | 'formula' | 'min' | 'max' | 'style' | 'title' | 'msg' | null; glowColor?: string;
  style?: AlertStyle; title?: string; msg?: string; inTitle?: string; inMsg?: string; okHot?: boolean; blink?: boolean; focus?: string;
};

const Field: React.FC<{x: number; y: number; w: number; h?: number; text: string; glow?: boolean; color?: string; focus?: boolean; blink?: boolean; wrap?: boolean}> = ({x, y, w, h = 24, text, glow, color = C.blue, focus, blink, wrap}) => (
  <div style={ab(x, y, w, h, {boxSizing: 'border-box', border: glow ? `2px solid ${color}` : `1px solid ${focus ? '#0F6CBD' : '#8A8A8A'}`, boxShadow: glow ? `0 0 12px ${color}` : 'none', background: '#fff', padding: wrap ? '4px 6px' : '0 6px', display: 'flex', alignItems: wrap ? 'flex-start' : 'center', zIndex: glow ? 3 : 1})}>
    <span style={{...T, fontFamily: CELLFONT, fontSize: 13.5, whiteSpace: wrap ? 'normal' : 'nowrap', overflow: 'hidden'}}>{text}{focus && blink ? <span style={{color: '#0F6CBD'}}>|</span> : null}</span>
  </div>
);

export const DvDialog: React.FC<DvProps> = (d) => {
  const {x, y, p, tab, allow = 'Any value', glow, glowColor = C.purple} = d;
  if (p <= 0.01) return null;
  const tabs: Array<[string, number, number]> = [['Settings', 14, 84], ['Input Message', 98, 112], ['Error Alert', 210, 96]];
  const L = (xx: number, yy: number, s: string) => <span style={{...T, position: 'absolute', left: xx, top: yy}}>{s}</span>;
  const g = (k: string) => glow === k;
  return (
    <Dlg x={x} y={y} w={DV.w} h={DV.h} title="Data Validation" p={clamp(p)}>
      {tabs.map(([n, tx, tw]) => (
        <div key={n} style={ab(tx, 6, tw, 24, {boxSizing: 'border-box', border: '1px solid #ADADAD', borderBottom: n === tab ? '1px solid #fff' : '1px solid #ADADAD', background: n === tab ? '#fff' : '#F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: n === tab ? 2 : 0})}><span style={T}>{n}</span></div>
      ))}
      <div style={ab(8, 29, DV.w - 16, 300, {boxSizing: 'border-box', border: '1px solid #ADADAD', background: '#fff'})} />
      {tab === 'Settings' ? (
        <>
          <span style={{...T, position: 'absolute', left: 20, top: 40, fontWeight: 700, color: '#106B3C'}}>Validation criteria</span>
          {L(24, 64, 'Allow:')}
          <DropBox x={24} y={82} w={280} text={allow} />
          {g('allow') ? <div style={ab(22, 80, 284, 28, {border: `2px solid ${glowColor}`, boxShadow: `0 0 14px ${glowColor}`, zIndex: 4})} /> : null}
          <CheckBox x={326} y={80} label="Ignore blank" p={1} w={120} />
          {allow === 'List' ? <CheckBox x={326} y={104} label="In-cell dropdown" p={1} w={130} /> : null}
          {allow === 'Whole number' || allow === 'Date' ? (
            <>
              {L(24, 118, 'Data:')}<DropBox x={24} y={136} w={280} text={d.data ?? 'between'} />
              {L(24, 172, allow === 'Date' ? 'Start date:' : 'Minimum:')}<Field x={24} y={190} w={280} text={d.min ?? ''} glow={g('min')} color={glowColor} />
              {L(24, 226, allow === 'Date' ? 'End date:' : 'Maximum:')}<Field x={24} y={244} w={280} text={d.max ?? ''} glow={g('max')} color={glowColor} />
            </>
          ) : null}
          {allow === 'List' ? <>{L(24, 118, 'Source:')}<Field x={24} y={136} w={420} text={d.source ?? ''} glow={g('source')} color={glowColor} focus={d.focus === 'source'} blink={d.blink} /></> : null}
          {allow === 'Custom' ? <>{L(24, 118, 'Formula:')}<Field x={24} y={136} w={420} text={d.formula ?? ''} glow={g('formula')} color={glowColor} focus={d.focus === 'formula'} blink={d.blink} /></> : null}
          <CheckBox x={24} y={296} label="Apply these changes to all other cells with the same settings" p={0} w={420} />
          {d.allowOpen ? (
            <div style={ab(24, 106, 280, 8 * 22 + 4, {background: '#fff', border: '1px solid #7A7A7A', boxShadow: '0 6px 16px rgba(0,0,0,.35)', zIndex: 8, opacity: clamp(d.allowOpen)})}>
              {ALLOW_LIST.map((n, i) => (
                <div key={n} style={ab(2, 2 + i * 22, 276, 22, {background: d.hiItem === n ? (d.hiColor ?? '#CFE8D8') : 'transparent', boxShadow: d.hiItem === n ? `inset 0 0 0 2px ${d.hiColor ?? '#10B981'}` : 'none', display: 'flex', alignItems: 'center', padding: '0 8px'})}><span style={T}>{n}</span></div>
              ))}
            </div>
          ) : null}
        </>
      ) : null}
      {tab === 'Input Message' ? (
        <>
          <CheckBox x={24} y={44} label="Show input message when cell is selected" p={1} w={380} />
          {L(24, 74, 'When cell is selected, show this input message:')}
          {L(24, 102, 'Title:')}<Field x={24} y={120} w={420} text={d.inTitle ?? ''} glow={g('title')} color={glowColor} />
          {L(24, 152, 'Input message:')}<Field x={24} y={170} w={420} h={116} text={d.inMsg ?? ''} glow={g('msg')} color={glowColor} wrap />
        </>
      ) : null}
      {tab === 'Error Alert' ? (
        <>
          <CheckBox x={24} y={44} label="Show error alert after invalid data is entered" p={1} w={380} />
          {L(24, 74, 'When user enters invalid data, show this error alert:')}
          {L(24, 102, 'Style:')}<DropBox x={24} y={120} w={190} text={d.style ?? 'Stop'} />
          {g('style') ? <div style={ab(22, 118, 194, 28, {border: `2px solid ${glowColor}`, boxShadow: `0 0 14px ${glowColor}`, zIndex: 4})} /> : null}
          <div style={ab(236, 112, 36, 36)}><AlertIcon kind={d.style ?? 'Stop'} s={34} /></div>
          {L(24, 156, 'Title:')}<Field x={24} y={174} w={300} text={d.title ?? ''} glow={g('title')} color={glowColor} />
          {L(24, 206, 'Error message:')}<Field x={24} y={224} w={300} h={96} text={d.msg ?? ''} glow={g('msg')} color={glowColor} wrap />
        </>
      ) : null}
      <Btn x={14} y={342} w={86} label="Clear All" />
      <Btn x={DV.w - 190} y={342} w={86} label="OK" def hot={d.okHot} />
      <Btn x={DV.w - 96} y={342} w={86} label="Cancel" />
    </Dlg>
  );
};

export const AlertIcon: React.FC<{kind: AlertStyle; s?: number}> = ({kind, s = 40}) => kind === 'Stop' ? (
  <svg width={s} height={s} viewBox="0 0 40 40"><circle cx={20} cy={20} r={17} fill="#D13438" /><path d="M13 13l14 14M27 13L13 27" stroke="#fff" strokeWidth={4} strokeLinecap="round" /></svg>
) : kind === 'Warning' ? (
  <svg width={s} height={s} viewBox="0 0 40 40"><path d="M20 4L38 35H2Z" fill="#FFC83D" stroke="#B58A00" strokeWidth={1.5} strokeLinejoin="round" /><rect x={18.3} y={14} width={3.4} height={11} fill="#3B2F00" /><rect x={18.3} y={27} width={3.4} height={3.4} fill="#3B2F00" /></svg>
) : (
  <svg width={s} height={s} viewBox="0 0 40 40"><circle cx={20} cy={20} r={17} fill="#0F6CBD" /><rect x={18.2} y={17} width={3.6} height={13} fill="#fff" /><rect x={18.2} y={10} width={3.6} height={3.6} fill="#fff" /></svg>
);

const BTNS: Record<AlertStyle, string[]> = {Stop: ['Retry', 'Cancel', 'Help'], Warning: ['Yes', 'No', 'Cancel', 'Help'], Information: ['OK', 'Cancel', 'Help']};
export const MsgBox: React.FC<{x: number; y: number; p: number; kind: AlertStyle; title: string; msg: string; hot?: number; glow?: string}> = ({x, y, p, kind, title, msg, hot = -1, glow}) => {
  if (p <= 0.01) return null;
  const bt = BTNS[kind];
  return (
    <div style={ab(x, y + (1 - clamp(p)) * 12, 380, 168, {background: '#fff', border: '1px solid #8C8C8C', borderRadius: 7, boxShadow: glow ? `0 12px 40px rgba(0,0,0,.5), 0 0 26px ${glow}` : '0 12px 40px rgba(0,0,0,.5)', opacity: clamp(p), zIndex: 60, overflow: 'hidden'})}>
      <div style={ab(0, 0, 380, 30, {borderBottom: '1px solid #E5E5E5'})}><span style={{...T, position: 'absolute', left: 12, top: 7}}>{title}</span></div>
      <div style={ab(16, 44, 40, 40)}><AlertIcon kind={kind} s={38} /></div>
      <div style={ab(68, 44, 296, 60)}><span style={{...T, fontSize: 13.5, whiteSpace: 'normal', lineHeight: 1.35}}>{msg}</span></div>
      {bt.map((b, i) => <Btn key={b} x={380 - 12 - (bt.length - i) * 84 + 6} y={126} w={76} label={b} def={i === 0} hot={hot === i} />)}
    </div>
  );
};

export const InputNote: React.FC<{x: number; y: number; p: number; title: string; msg: string; glow?: string}> = ({x, y, p, title, msg, glow}) => p <= 0.01 ? null : (
  <div style={ab(x, y + (1 - clamp(p)) * 8, 230, 66, {background: '#FFFFE1', border: '1px solid #767676', boxShadow: glow ? `0 0 18px ${glow}, 0 4px 10px rgba(0,0,0,.3)` : '0 3px 8px rgba(0,0,0,.3)', padding: '5px 8px', boxSizing: 'border-box', opacity: clamp(p), zIndex: 30})}>
    <div style={{...T, fontWeight: 700, whiteSpace: 'normal'}}>{title}</div><div style={{...T, whiteSpace: 'normal', lineHeight: 1.3}}>{msg}</div>
  </div>
);

/** In-cell drop-down: arrow button right of the cell + optional list below. */
export const CellDrop: React.FC<{rect: {x: number; y: number; w: number; h: number}; arrow: number; list: string[]; open: number; hi?: number; hiNew?: number; hiColor?: string}> = ({rect, arrow, list, open, hi = -1, hiNew = -1, hiColor = '#CCE8FF'}) => (
  <>
    {arrow > 0.01 ? <div style={ab(rect.x + rect.w + 1, rect.y + 1, 18, rect.h - 2, {background: '#F3F3F3', border: '1px solid #A6A6A6', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: clamp(arrow), zIndex: 22})}><svg width={9} height={6} viewBox="0 0 9 6"><path d="M0 0H9L4.5 6Z" fill="#444" /></svg></div> : null}
    {open > 0.01 ? (
      <div style={ab(rect.x, rect.y + rect.h + 2, rect.w + 19, list.length * 21 + 4, {background: '#fff', border: '1px solid #7A7A7A', boxShadow: '0 5px 14px rgba(0,0,0,.35)', opacity: clamp(open), zIndex: 24})}>
        {list.map((n, i) => (
          <div key={n} style={ab(2, 2 + i * 21, rect.w + 15, 21, {background: i === hi ? hiColor : i === hiNew ? '#D1FAE5' : 'transparent', boxShadow: i === hiNew ? 'inset 0 0 0 2px #10B981' : 'none', display: 'flex', alignItems: 'center', padding: '0 6px'})}><span style={{fontFamily: CELLFONT, fontSize: 14, color: '#1B1B1B'}}>{n}</span></div>
        ))}
      </div>
    ) : null}
  </>
);

export const Shield: React.FC<{p: number; hit: number; color?: string; size?: number}> = ({p, hit, color = C.blue, size = 150}) => p <= 0.01 ? null : (
  <svg width={size} height={size * 1.15} viewBox="0 0 100 115" style={{opacity: clamp(p), transform: `scale(${0.6 + 0.4 * clamp(p) + 0.1 * hit})`, filter: `drop-shadow(0 0 ${14 + 24 * hit}px ${color})`}}>
    <path d="M50 4 L92 20 V56 C92 84 72 102 50 111 C28 102 8 84 8 56 V20 Z" fill={`${color}33`} stroke={color} strokeWidth={5} strokeLinejoin="round" />
    <path d="M30 58 L45 73 L72 40" fill="none" stroke={C.green} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
