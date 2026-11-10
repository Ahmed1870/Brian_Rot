// Overlays drawn in logical Excel coordinates: cursor, menus, Windows-style dialogs.
import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {CELLFONT, UIFONT} from './theme';
import {Caret, G, Ico} from './xl';

const ab = (x: number, y: number, w?: number, h?: number, extra?: React.CSSProperties): React.CSSProperties => ({position: 'absolute', left: x, top: y, width: w, height: h, ...extra});
const T: React.CSSProperties = {fontFamily: UIFONT, fontSize: 12, color: '#1B1B1B', whiteSpace: 'nowrap'};

/* ---------------------------------------------------------------- pointer */
export const Cursor: React.FC<{x: number; y: number; down?: boolean; hide?: boolean}> = ({x, y, down, hide}) => (
  <svg style={{position: 'absolute', left: x - 1, top: y - 1, width: 22, height: 26, zIndex: 50, opacity: hide ? 0 : 1, transform: down ? 'scale(0.9)' : 'none', transformOrigin: '2px 2px', filter: 'drop-shadow(1px 2px 1.5px rgba(0,0,0,0.35))'}} viewBox="0 0 22 26">
    <path d="M2 1.5v18.2l4.6-4.2 3.2 7.2 3.1-1.4-3.2-7 6.4-.2z" fill="#fff" stroke="#111" strokeWidth={1.3} strokeLinejoin="round" />
  </svg>
);
export const Ripple: React.FC<{x: number; y: number; f: number; at: number; color?: string}> = ({x, y, f, at, color = '#107C41'}) => {
  const t = (f - at) / 14;
  const r = 4 + 20 * t;
  return (
    <div style={{display: 'contents'}}>
      <Sequence from={Math.round(at)} durationInFrames={10} layout="none"><Audio src={staticFile('sfx_click.mp3')} volume={0.5} /></Sequence>
      {t < 0 || t > 1 ? null : <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: r, border: `2px solid ${color}`, opacity: 1 - t, zIndex: 49, boxSizing: 'border-box'}} />}
    </div>
  );
};

/* ---------------------------------------------------------------- context menu */
export type MenuItem = {label: string; check?: boolean; sep?: boolean; right?: string; hot?: boolean; dim?: boolean; arrow?: boolean; icon?: string; bold?: boolean; checkP?: number};
export const MENU_ITEM_H = 24;
export const MENU_SEP_H = 8;
export const menuItemY = (y: number, items: MenuItem[], i: number, itemH = MENU_ITEM_H, pad = 4, title = false) => {
  let acc = y + pad + (title ? 24 : 0);
  for (let k = 0; k < i; k++) acc += items[k].sep ? MENU_SEP_H : itemH;
  return acc + itemH / 2;
};
export const menuHeight = (items: MenuItem[], itemH = MENU_ITEM_H, pad = 4, title = false) => items.reduce((a, b) => a + (b.sep ? MENU_SEP_H : itemH), pad * 2) + (title ? 24 : 0);

export const Menu: React.FC<{x: number; y: number; w: number; items: MenuItem[]; title?: string; itemH?: number; opacity?: number; maxRight?: number}> = ({x, y, w, items, title, itemH = MENU_ITEM_H, opacity = 1}) => (
  <div style={ab(x, y, w, menuHeight(items, itemH, 4, !!title), {background: '#fff', border: '1px solid #CFCFCF', borderRadius: 6, boxShadow: '0 6px 20px rgba(0,0,0,0.28)', boxSizing: 'border-box', opacity, zIndex: 30, padding: '4px 0'})}>
    {title ? <div style={{height: 24, ...T, fontWeight: 700, padding: '0 12px', lineHeight: '24px', borderBottom: '1px solid #E5E5E5', marginBottom: 0}}>{title}</div> : null}
    {items.map((it, i) => it.sep ? (
      <div key={i} style={{height: MENU_SEP_H, display: 'flex', alignItems: 'center'}}><div style={{height: 1, background: '#E1E1E1', width: '100%'}} /></div>
    ) : (
      <div key={i} style={{height: itemH, display: 'flex', alignItems: 'center', padding: '0 12px 0 8px', background: it.hot ? '#E6E6E6' : 'transparent', opacity: it.dim ? 0.5 : 1}}>
        <div style={{width: 22, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          {it.icon ? <Ico n={it.icon} s={16} /> : null}
          {it.check !== undefined ? <div style={{transform: `scale(${it.checkP ?? (it.check ? 1 : 0)})`, opacity: Math.min(1, it.checkP ?? (it.check ? 1 : 0))}}><Ico n="check" s={14} c="#1B1B1B" /></div> : null}
        </div>
        <span style={{...T, fontWeight: it.bold ? 700 : 400, marginLeft: 6, flex: 1}}>{it.label}</span>
        {it.right ? <span style={{...T, color: '#5E5E5E', marginLeft: 24}}>{it.right}</span> : null}
        {it.arrow ? <svg width={8} height={10} viewBox="0 0 8 10" style={{marginLeft: 12}}><path d="M2 1l4 4-4 4" fill="none" stroke="#444" strokeWidth={1.3} /></svg> : null}
      </div>
    ))}
  </div>
);

export const QAT_MENU: MenuItem[] = [
  {label: 'AutoSave', check: true}, {label: 'New'}, {label: 'Open'}, {label: 'Save', check: true}, {label: 'Email'}, {label: 'Quick Print'},
  {label: 'Print Preview and Print'}, {label: 'Spelling'}, {label: 'Undo', check: true}, {label: 'Redo', check: true},
  {label: 'Sort Ascending'}, {label: 'Sort Descending'}, {label: 'Touch/Mouse Mode'}, {sep: true, label: ''}, {label: 'More Commands...'}, {label: 'Show Below the Ribbon'},
];

export const statusMenuItems = (on: Record<string, number>): MenuItem[] => {
  const ck = (k: string, d: boolean) => (on[k] !== undefined ? on[k] : d ? 1 : 0);
  const mk = (label: string, d: boolean, right?: string): MenuItem => ({label, check: ck(label, d) > 0.5, checkP: ck(label, d), right});
  return [
    mk('Cell Mode', true, 'Ready'), mk('Flash Fill Blank Cells', true), mk('Flash Fill Changed Cells', true), {sep: true, label: ''},
    mk('Signatures', false, 'Off'), mk('Information Management Policy', false, 'Off'), mk('Permissions', false, 'Off'), {sep: true, label: ''},
    mk('Caps Lock', false, 'Off'), mk('Num Lock', true, 'On'), mk('Scroll Lock', false, 'Off'), mk('Fixed Decimal', false, 'Off'), mk('Overtype Mode', false),
    mk('End Mode', false), mk('Macro Recording', false, 'Not Recording'), mk('Selection Mode', false), mk('Page Number', false), {sep: true, label: ''},
    mk('Average', true), mk('Count', true), mk('Numerical Count', false), mk('Minimum', false), mk('Maximum', false), mk('Sum', true), {sep: true, label: ''},
    mk('Upload Status', true), mk('View Shortcuts', true), mk('Zoom', true), mk('Zoom Slider', true),
  ];
};

/* ---------------------------------------------------------------- form widgets */
export const Btn: React.FC<{x: number; y: number; w: number; h?: number; label: string; def?: boolean; hot?: boolean; icon?: string}> = ({x, y, w, h = 26, label, def, hot}) => (
  <div style={ab(x, y, w, h, {boxSizing: 'border-box', border: def ? '2px solid #0F6CBD' : '1px solid #ADADAD', background: hot ? '#CFE8D8' : '#E9E9E9', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center'})}>
    <span style={T}>{label}</span>
  </div>
);
export const CheckBox: React.FC<{x: number; y: number; label: string; p: number; w?: number}> = ({x, y, label, p, w = 360}) => (
  <div style={ab(x, y, w, 18, {display: 'flex', alignItems: 'center', gap: 8})}>
    <div style={{width: 14, height: 14, boxSizing: 'border-box', border: '1px solid #555', background: '#fff', position: 'relative', flexShrink: 0}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 12, height: 12, background: `rgba(16,124,65,${0.18 * p})`, transform: `scale(${0.4 + 0.6 * p})`}} />
      <div style={{position: 'absolute', left: -1, top: -2, opacity: p, transform: `scale(${p})`}}><Ico n="check" s={14} c={G.greenDark} /></div>
    </div>
    <span style={T}>{label}</span>
  </div>
);
export const Radio: React.FC<{x: number; y: number; label: string; p: number; w?: number; glow?: number}> = ({x, y, label, p, w = 360, glow = 0}) => (
  <div style={ab(x, y, w, 18, {display: 'flex', alignItems: 'center', gap: 8})}>
    <div style={{width: 14, height: 14, borderRadius: 7, boxSizing: 'border-box', border: '1px solid #555', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: glow ? `0 0 ${10 * glow}px rgba(245,158,11,${glow})` : 'none'}}>
      <div style={{width: 8, height: 8, borderRadius: 4, background: '#1B1B1B', transform: `scale(${p})`, opacity: p}} />
    </div>
    <span style={T}>{label}</span>
  </div>
);
export const DropBox: React.FC<{x: number; y: number; w: number; text: string; h?: number}> = ({x, y, w, text, h = 24}) => (
  <div style={ab(x, y, w, h, {boxSizing: 'border-box', border: '1px solid #8A8A8A', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6px'})}>
    <span style={T}>{text}</span><Caret />
  </div>
);
export const SectionTitle: React.FC<{x: number; y: number; w: number; label: string}> = ({x, y, w, label}) => (
  <div style={ab(x, y, w, 18, {display: 'flex', alignItems: 'center', gap: 8})}>
    <span style={{...T, fontWeight: 700, color: G.greenDark}}>{label}</span><div style={{flex: 1, height: 1, background: '#CFCFCF'}} />
  </div>
);

/* ---------------------------------------------------------------- Windows dialog frame */
export const Dlg: React.FC<{x: number; y: number; w: number; h: number; title: string; p?: number; children?: React.ReactNode}> = ({x, y, w, h, title, p = 1, children}) => (
  <div style={ab(x, y + (1 - p) * 14, w, h, {background: '#fff', border: '1px solid #8C8C8C', boxShadow: '0 12px 40px rgba(0,0,0,0.45)', opacity: p, zIndex: 40, borderRadius: 7, overflow: 'hidden', boxSizing: 'border-box'})}>
    <div style={ab(0, 0, w, 32, {background: '#fff', borderBottom: '1px solid #E5E5E5'})}>
      <span style={{...T, fontSize: 12.5, position: 'absolute', left: 12, top: 8}}>{title}</span>
      <span style={{...T, position: 'absolute', right: 56, top: 7, fontWeight: 600}}>?</span>
      <svg style={ab(w - 34, 10, 12, 12)} width={12} height={12} viewBox="0 0 12 12"><path d="M1 1l10 10M11 1L1 11" stroke="#333" strokeWidth={1.1} /></svg>
    </div>
    <div style={ab(0, 32, w, h - 32)}>{children}</div>
  </div>
);

/* ---------------------------------------------------------------- Excel Options dialog */
export const OPT_NAV = ['General', 'Formulas', 'Data', 'Proofing', 'Save', 'Language', 'Accessibility', 'Advanced', 'Customize Ribbon', 'Quick Access Toolbar', 'Add-ins', 'Trust Center'];
export const OPT = {x: 348, y: 52, w: 840, h: 568};
export const optNavY = (name: string) => OPT.y + 32 + 10 + OPT_NAV.indexOf(name) * 28 + 14;

export type LeftItem = {label: string; icon?: string};
export const ALL_CMDS_CLEAR: LeftItem[] = [
  {label: 'Clear'}, {label: 'Clear All'}, {label: 'Clear Contents'}, {label: 'Clear Formats', icon: 'clearFormats'}, {label: 'Clear Hyperlinks'}, {label: 'Clear Print Area'}, {label: 'Clear Validation Circles'},
  {label: 'Clipboard'}, {label: 'Close'}, {label: 'Close All'}, {label: 'Color Scales'}, {label: 'Column Width...'}, {label: 'Comma Style'}, {label: 'Comment'},
];
export const ALL_CMDS_FILTER: LeftItem[] = [
  {label: 'Fill Right'}, {label: 'Fill Up'}, {label: 'Filter', icon: 'filter'}, {label: 'Filter by Selected Cell\'s Color'}, {label: 'Find'}, {label: 'Find & Select'}, {label: 'Flash Fill'},
  {label: 'Font'}, {label: 'Font Color', icon: 'fontColor'}, {label: 'Font Size'}, {label: 'Format Cells'}, {label: 'Format Painter', icon: 'painter'}, {label: 'Freeze Panes'}, {label: 'Function'},
];
export const ALL_CMDS_PASTE: LeftItem[] = [
  {label: 'Page Setup'}, {label: 'Paste', icon: 'paste'}, {label: 'Paste Formatting'}, {label: 'Paste Formulas'}, {label: 'Paste Link'}, {label: 'Paste Special...'}, {label: 'Paste Values', icon: 'pasteValues'},
  {label: 'Percent Style', icon: 'percent'}, {label: 'Picture'}, {label: 'PivotTable'}, {label: 'Print'}, {label: 'Print Area'}, {label: 'Protect Sheet'}, {label: 'Quick Print'},
];
export const ALL_CMDS_SORT: LeftItem[] = [
  {label: 'Shapes'}, {label: 'Sheet Options'}, {label: 'Show Detail'}, {label: 'Slicer'}, {label: 'Sort'}, {label: 'Sort Ascending', icon: 'sortAsc'}, {label: 'Sort Descending', icon: 'sortDesc'},
  {label: 'Sort & Filter'}, {label: 'Sparklines'}, {label: 'Spelling...'}, {label: 'Split'}, {label: 'Stop Recording'}, {label: 'Subtotal'}, {label: 'Sum'},
];
export const POPULAR_CMDS: LeftItem[] = [
  {label: 'Add or Remove Filters', icon: 'filter'}, {label: 'Borders', icon: 'borders'}, {label: 'Calculate Now'}, {label: 'Center', icon: 'alignC'}, {label: 'Conditional Formatting', icon: 'condFmt'},
  {label: 'Copy', icon: 'copy'}, {label: 'Custom Sort...'}, {label: 'Cut', icon: 'cut'}, {label: 'Decrease Font Size', icon: 'shrinkFont'}, {label: 'Delete Cells...', icon: 'delete'},
  {label: 'Email'}, {label: 'Fill Color', icon: 'fill'}, {label: 'Font Color', icon: 'fontColor'}, {label: 'Format Painter', icon: 'painter'},
];
export const QAT_LISTS: Record<string, LeftItem[]> = {popular: POPULAR_CMDS, clear: ALL_CMDS_CLEAR, filter: ALL_CMDS_FILTER, paste: ALL_CMDS_PASTE, sort: ALL_CMDS_SORT};

export const QAT_PAGE = {
  leftX: 214, listY: 118, listW: 240, listH: 322, itemH: 22,
  midX: 462, rightX: 558, rightW: 240,
};
export const qatLeftItemPos = (idx: number) => ({x: OPT.x + QAT_PAGE.leftX + 80, y: OPT.y + 32 + QAT_PAGE.listY + 4 + idx * QAT_PAGE.itemH + QAT_PAGE.itemH / 2});
export const qatRightItemPos = (idx: number) => ({x: OPT.x + QAT_PAGE.rightX + 80, y: OPT.y + 32 + QAT_PAGE.listY + 4 + idx * QAT_PAGE.itemH + QAT_PAGE.itemH / 2});
export const qatAddBtn = () => ({x: OPT.x + QAT_PAGE.midX + 44, y: OPT.y + 32 + 176});
export const qatRemoveBtn = () => ({x: OPT.x + QAT_PAGE.midX + 44, y: OPT.y + 32 + 214});
export const optOk = () => ({x: OPT.x + OPT.w - 148, y: OPT.y + OPT.h - 28});

export type OptionsState = {
  page: 'General' | 'Formulas' | 'Data' | 'Proofing' | 'Quick Access Toolbar';
  p?: number;                       // open animation
  leftList?: string;                // key in QAT_LISTS
  leftCombo?: string;
  leftSel?: number;
  rightItems?: LeftItem[];
  rightSel?: number;
  addHot?: boolean; removeHot?: boolean; okHot?: boolean;
  flying?: {item: LeftItem; t: number} | null;
  calcRadio?: number;               // 0 automatic, 1 except tables, 2 manual
  calcGlow?: number;
  acBtnHot?: boolean;
  navHot?: string;
};

const RowItem: React.FC<{y: number; item: LeftItem; sel: boolean; w: number}> = ({y, item, sel, w}) => (
  <div style={ab(0, y, w, QAT_PAGE.itemH, {background: sel ? '#CFE8D8' : 'transparent', display: 'flex', alignItems: 'center', gap: 8, padding: '0 6px', boxSizing: 'border-box'})}>
    <div style={{width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{item.icon ? <Ico n={item.icon} s={16} /> : null}</div>
    <span style={T}>{item.label}</span>
  </div>
);

export const OptionsDialog: React.FC<{s: OptionsState; navCheck?: Record<string, number>}> = ({s}) => {
  const p = s.p ?? 1;
  const left = QAT_LISTS[s.leftList ?? 'paste'] ?? ALL_CMDS_PASTE;
  const body = (() => {
    switch (s.page) {
      case 'Quick Access Toolbar':
        return (
          <div>
            <div style={ab(214, 8, 560, 24, {display: 'flex', alignItems: 'center', gap: 8})}>
              <Ico n="save" s={20} /><span style={{...T, fontSize: 13}}>Customize the Quick Access Toolbar.</span>
            </div>
            <span style={ab(214, 44, 250, 16, T)}>Choose commands from:</span>
            <span style={ab(QAT_PAGE.rightX, 44, 250, 16, T)}>Customize Quick Access Toolbar:</span>
            <DropBox x={214} y={62} w={QAT_PAGE.listW} text={s.leftCombo ?? 'All Commands'} />
            <DropBox x={QAT_PAGE.rightX} y={62} w={QAT_PAGE.rightW} text="For all documents (default)" />
            <div style={ab(QAT_PAGE.leftX, QAT_PAGE.listY, QAT_PAGE.listW, QAT_PAGE.listH, {border: '1px solid #8A8A8A', background: '#fff', boxSizing: 'border-box', padding: '4px 0', overflow: 'hidden'})}>
              {left.map((it, i) => <RowItem key={it.label} y={4 + i * QAT_PAGE.itemH} item={it} sel={s.leftSel === i} w={QAT_PAGE.listW - 2} />)}
            </div>
            <Btn x={QAT_PAGE.midX} y={152} w={88} label="Add >>" hot={s.addHot} />
            <Btn x={QAT_PAGE.midX} y={190} w={88} label="<< Remove" hot={s.removeHot} />
            <div style={ab(QAT_PAGE.rightX, QAT_PAGE.listY, QAT_PAGE.rightW, QAT_PAGE.listH, {border: '1px solid #8A8A8A', background: '#fff', boxSizing: 'border-box', padding: '4px 0', overflow: 'hidden'})}>
              {(s.rightItems ?? []).map((it, i) => <RowItem key={it.label} y={4 + i * QAT_PAGE.itemH} item={it} sel={s.rightSel === i} w={QAT_PAGE.rightW - 2} />)}
            </div>
            <div style={ab(QAT_PAGE.rightX + QAT_PAGE.rightW + 8, 200, 24, 24, {border: '1px solid #ADADAD', background: '#E9E9E9', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box'})}><svg width={10} height={10} viewBox="0 0 10 10"><path d="M5 1l4 6H1z" fill="#444" /></svg></div>
            <div style={ab(QAT_PAGE.rightX + QAT_PAGE.rightW + 8, 230, 24, 24, {border: '1px solid #ADADAD', background: '#E9E9E9', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box'})}><svg width={10} height={10} viewBox="0 0 10 10"><path d="M5 9L1 3h8z" fill="#444" /></svg></div>
            <span style={ab(214, 460, 120, 16, T)}>Show Quick Access Toolbar below the Ribbon</span>
            <span style={ab(QAT_PAGE.rightX, 460, 120, 16, T)}>Customizations:</span>
            <div style={ab(QAT_PAGE.rightX + 90, 454, 76, 24, {border: '1px solid #ADADAD', background: '#E9E9E9', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6})}><span style={T}>Reset</span><Caret /></div>
            {s.flying ? (
              <div style={ab(QAT_PAGE.leftX + (QAT_PAGE.rightX - QAT_PAGE.leftX) * s.flying.t, QAT_PAGE.listY + 60 + (40 - 60) * s.flying.t, 160, QAT_PAGE.itemH, {background: '#CFE8D8', border: `1px solid ${G.green}`, display: 'flex', alignItems: 'center', gap: 8, padding: '0 6px', boxSizing: 'border-box', zIndex: 5, opacity: 0.95, boxShadow: '0 0 12px rgba(16,185,129,0.8)'})}>
                {s.flying.item.icon ? <Ico n={s.flying.item.icon} s={16} /> : null}<span style={T}>{s.flying.item.label}</span>
              </div>
            ) : null}
          </div>
        );
      case 'Formulas':
        return (
          <div>
            <div style={ab(214, 8, 560, 40, {display: 'flex', alignItems: 'center', gap: 8})}>
              <span style={{...T, fontSize: 13, whiteSpace: 'normal'}}>Change options related to formula calculation, performance, and error handling.</span>
            </div>
            <SectionTitle x={214} y={58} w={560} label="Calculation options" />
            <span style={ab(224, 88, 200, 16, T)}>Workbook Calculation</span>
            <Radio x={240} y={112} label="Automatic" p={s.calcRadio === 0 || s.calcRadio === undefined ? 1 : 0} glow={s.calcGlow ?? 0} />
            <Radio x={240} y={136} label="Automatic except for data tables" p={s.calcRadio === 1 ? 1 : 0} />
            <Radio x={240} y={160} label="Manual" p={s.calcRadio === 2 ? 1 : 0} />
            <CheckBox x={262} y={184} label="Recalculate workbook before saving" p={0} />
            <CheckBox x={224} y={214} label="Enable iterative calculation" p={0} />
            <span style={ab(262, 240, 200, 16, T)}>Maximum Iterations:</span><div style={ab(380, 236, 60, 22, {border: '1px solid #8A8A8A', boxSizing: 'border-box', padding: '2px 6px'})}><span style={T}>100</span></div>
            <span style={ab(262, 268, 200, 16, T)}>Maximum Change:</span><div style={ab(380, 264, 60, 22, {border: '1px solid #8A8A8A', boxSizing: 'border-box', padding: '2px 6px'})}><span style={T}>0.001</span></div>
            <SectionTitle x={214} y={306} w={560} label="Working with formulas" />
            <CheckBox x={224} y={334} label="R1C1 reference style" p={0} />
            <CheckBox x={224} y={358} label="Formula AutoComplete" p={1} />
            <CheckBox x={224} y={382} label="Use table names in formulas" p={1} />
            <CheckBox x={224} y={406} label="Use GetPivotData functions for PivotTable references" p={1} />
          </div>
        );
      case 'Proofing':
        return (
          <div>
            <div style={ab(214, 8, 560, 24, {display: 'flex', alignItems: 'center'})}><span style={{...T, fontSize: 13}}>Change how Excel corrects and formats your text.</span></div>
            <SectionTitle x={214} y={46} w={560} label="AutoCorrect options" />
            <span style={ab(224, 78, 360, 16, T)}>Change how Excel corrects and formats text as you type:</span>
            <Btn x={560} y={72} w={160} label="AutoCorrect Options..." hot={s.acBtnHot} />
            <SectionTitle x={214} y={126} w={560} label="When correcting spelling in Excel" />
            <CheckBox x={224} y={154} label="Ignore words in UPPERCASE" p={1} />
            <CheckBox x={224} y={178} label="Ignore words that contain numbers" p={1} />
            <CheckBox x={224} y={202} label="Ignore Internet and file addresses" p={1} />
            <CheckBox x={224} y={226} label="Flag repeated words" p={1} />
          </div>
        );
      case 'Data':
        return (
          <div>
            <div style={ab(214, 8, 560, 24)}><span style={{...T, fontSize: 13}}>Change the default settings for data analysis.</span></div>
            <SectionTitle x={214} y={46} w={560} label="Data options" />
            <CheckBox x={224} y={76} label="Do not automatically create a Data Model when saving a PivotTable" p={0} w={520} />
            <CheckBox x={224} y={100} label="Enable undo for Refresh All" p={1} />
          </div>
        );
      default:
        return (
          <div>
            <div style={ab(214, 8, 560, 24, {display: 'flex', alignItems: 'center'})}><span style={{...T, fontSize: 13}}>General options for working with Excel.</span></div>
            <SectionTitle x={214} y={46} w={560} label="User Interface options" />
            <CheckBox x={224} y={76} label="Show Mini Toolbar on selection" p={1} />
            <CheckBox x={224} y={100} label="Show Quick Analysis options on selection" p={1} />
            <CheckBox x={224} y={124} label="Enable Live Preview" p={1} />
            <CheckBox x={224} y={148} label="Update document content while dragging" p={1} />
            <SectionTitle x={214} y={196} w={560} label="When creating new workbooks" />
            <span style={ab(224, 228, 200, 16, T)}>Use this font:</span><DropBox x={400} y={224} w={180} text="Body Font" />
            <span style={ab(224, 262, 200, 16, T)}>Font size:</span><DropBox x={400} y={258} w={80} text="11" />
            <span style={ab(224, 296, 200, 16, T)}>Default view for new sheets:</span><DropBox x={400} y={292} w={180} text="Normal View" />
            <span style={ab(224, 330, 220, 16, T)}>Include this many sheets:</span><DropBox x={400} y={326} w={80} text="1" />
          </div>
        );
    }
  })();
  return (
    <Dlg x={OPT.x} y={OPT.y} w={OPT.w} h={OPT.h} title="Excel Options" p={p}>
      <div style={ab(0, 0, 200, OPT.h - 32 - 48, {background: '#F3F3F3', borderRight: '1px solid #E0E0E0'})}>
        {OPT_NAV.map((n, i) => (
          <div key={n} style={ab(6, 10 + i * 28, 188, 28, {display: 'flex', alignItems: 'center', padding: '0 10px', boxSizing: 'border-box', background: s.page === n ? '#DADADA' : (s.navHot === n ? '#E8E8E8' : 'transparent'), borderRadius: 4, borderLeft: s.page === n ? `3px solid ${G.green}` : '3px solid transparent'})}>
            <span style={{...T, fontSize: 12.5}}>{n}</span>
          </div>
        ))}
      </div>
      {body}
      <div style={ab(0, OPT.h - 32 - 48, OPT.w, 48, {borderTop: '1px solid #E5E5E5', background: '#F7F7F7'})}>
        <Btn x={OPT.w - 188} y={10} w={84} label="OK" def hot={s.okHot} />
        <Btn x={OPT.w - 96} y={10} w={84} label="Cancel" />
      </div>
    </Dlg>
  );
};

/* ---------------------------------------------------------------- AutoCorrect dialog (AutoFormat As You Type) */
export const AC = {x: 488, y: 96, w: 560, h: 470};
export const acOk = () => ({x: AC.x + AC.w - 160 + 40, y: AC.y + AC.h - 24});
export const acCheckPos = (i: number) => ({x: AC.x + 36, y: AC.y + 32 + 96 + [0, 66, 90][i] + 9});
export const AutoCorrectDialog: React.FC<{p: number; checks: [number, number, number]; okHot?: boolean}> = ({p, checks, okHot}) => (
  <Dlg x={AC.x} y={AC.y} w={AC.w} h={AC.h} title="AutoCorrect: English (United States)" p={p}>
    <div style={ab(14, 10, AC.w - 28, 26, {display: 'flex'})}>
      {['AutoCorrect', 'Math AutoCorrect', 'AutoFormat As You Type'].map((t, i) => (
        <div key={t} style={{padding: '0 14px', height: 26, display: 'flex', alignItems: 'center', border: '1px solid #C8C8C8', borderBottom: i === 2 ? '1px solid #fff' : '1px solid #C8C8C8', background: i === 2 ? '#fff' : '#F0F0F0', marginRight: -1, zIndex: i === 2 ? 2 : 0}}>
          <span style={T}>{t}</span>
        </div>
      ))}
    </div>
    <div style={ab(14, 36, AC.w - 28, AC.h - 32 - 36 - 56, {border: '1px solid #C8C8C8', boxSizing: 'border-box'})} />
    <SectionTitle x={28} y={48} w={AC.w - 56} label="Replace as you type" />
    <CheckBox x={36} y={96} label="Internet and network paths with hyperlinks" p={checks[0]} w={440} />
    <SectionTitle x={28} y={122} w={AC.w - 56} label="Apply as you work" />
    <CheckBox x={36} y={162} label="Include new rows and columns in table" p={checks[1]} w={440} />
    <CheckBox x={36} y={186} label="Fill formulas in tables to create calculated columns" p={checks[2]} w={440} />
    <Btn x={AC.w - 196} y={AC.h - 32 - 40} w={84} label="OK" def hot={okHot} />
    <Btn x={AC.w - 104} y={AC.h - 32 - 40} w={84} label="Cancel" />
  </Dlg>
);

/* ---------------------------------------------------------------- Filter dropdown (AutoFilter) */
export const FilterMenu: React.FC<{x: number; y: number; branch: string; checks: Record<string, number>; hotOk?: boolean}> = ({x, y, branch, checks, hotOk}) => {
  const items: MenuItem[] = [
    {label: 'Sort A to Z', icon: 'sortAsc'}, {label: 'Sort Z to A', icon: 'sortDesc'}, {label: 'Sort by Color', arrow: true}, {sep: true, label: ''},
    {label: `Clear Filter From "${branch}"`, dim: true}, {label: 'Filter by Color', arrow: true}, {label: 'Text Filters', arrow: true},
  ];
  const h = menuHeight(items) + 30 + 128 + 40;
  const names = ['(Select All)', 'Alexandria', 'Cairo', 'Giza', 'Mansoura', 'Tanta'];
  return (
    <div style={ab(x, y, 250, h, {background: '#fff', border: '1px solid #CFCFCF', borderRadius: 6, boxShadow: '0 6px 20px rgba(0,0,0,0.28)', zIndex: 30, boxSizing: 'border-box'})}>
      <Menu x={-1} y={-1} w={250} items={items} />
      <div style={ab(10, menuHeight(items) + 4, 228, 22, {border: '1px solid #8A8A8A', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 6, padding: '0 6px'})}><Ico n="search" s={13} /><span style={{...T, color: '#777'}}>Search</span></div>
      <div style={ab(10, menuHeight(items) + 32, 228, 128, {border: '1px solid #8A8A8A', boxSizing: 'border-box', overflow: 'hidden'})}>
        {names.map((n, i) => <CheckBox key={n} x={8} y={6 + i * 20} label={n} p={checks[n] ?? 0} w={200} />)}
      </div>
      <Btn x={90} y={h - 34} w={72} h={24} label="OK" def hot={hotOk} />
      <Btn x={168} y={h - 34} w={72} h={24} label="Cancel" />
    </div>
  );
};
export const filterMenuGeom = (x: number, y: number) => {
  const items: MenuItem[] = new Array(7).fill(0).map((_, i) => (i === 3 ? {sep: true, label: ''} : {label: 'x'}));
  const h = menuHeight(items) + 30 + 128 + 40;
  const base = menuHeight(items);
  return {h, checkY: (i: number) => y + base + 32 + 6 + i * 20 + 9, checkX: x + 18, ok: {x: x + 126, y: y + h - 22}};
};

/* ---------------------------------------------------------------- screen-space keycaps */
export const KeyBadge: React.FC<{keys: string[]; p: number; color?: string; left?: number; top?: number; size?: number}> = ({keys, p, color = '#10B981', left = 1330, top = 80, size = 1}) => (
  <div style={{position: 'absolute', left, top, display: 'flex', alignItems: 'center', gap: 10, opacity: Math.min(1, p), transform: `scale(${(0.8 + 0.2 * p) * size})`, transformOrigin: '0 0', zIndex: 60}}>
    {keys.map((k, i) => (
      <div key={k + i + 'c'} style={{display: 'flex', alignItems: 'center', gap: 10}}>
        <div style={{minWidth: 54, height: 50, padding: '0 14px', boxSizing: 'border-box', borderRadius: 10, background: '#1E293B', border: `2px solid ${color}`, boxShadow: `0 6px 0 #0B1222, 0 0 22px ${color}99`, color: '#F8FAFC', fontFamily: 'Consolas, "DejaVu Sans Mono", monospace', fontSize: 24, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{k}</div>
        {i < keys.length - 1 ? <span style={{color, fontSize: 26, fontWeight: 700, fontFamily: 'Consolas, monospace'}}>+</span> : null}
      </div>
    ))}
  </div>
);
