import {C, FONT} from '../theme';
import {pop} from './anim';
import {Dax, charW} from './dax';
import {RAIL_W, BODY_Y, DATA_X, FORM_H} from './desk';
import {PRODUCTS, SALES, lineAmount, fmt, productSales} from './data';

export const BG = 'linear-gradient(135deg,' + C.navy + ',' + C.navy2 + ')';

type Col = {h: string; w: number; num?: boolean};
export const MiniTable = ({x, y, title, cols, rows, hi = [], dim = [], hiColor = '#FDE68A', scale = 1, op = 1, ghost = -1, ghostOp = 0, titleColor = '#E2E8F0'}: {x: number; y: number; title: string; cols: Col[]; rows: string[][]; hi?: number[]; dim?: number[]; hiColor?: string; scale?: number; op?: number; ghost?: number; ghostOp?: number; titleColor?: string}) => {
  if (op < 0.01) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: op, transform: 'scale(' + scale + ')', transformOrigin: '0 0', fontFamily: FONT, direction: 'ltr'}}>
      <div style={{fontSize: 34, fontWeight: 700, color: titleColor, marginBottom: 10}}>{title}</div>
      <div style={{background: '#FFFFFF', border: '2px solid #94A3B8'}}>
        <div style={{display: 'flex', height: 64, background: '#E2E8F0'}}>
          {cols.map((c, i) => (
            <div key={c.h} style={{width: c.w, lineHeight: '64px', padding: '0 14px', boxSizing: 'border-box', whiteSpace: 'nowrap', fontSize: 27, fontWeight: 700, color: C.ink, opacity: i === ghost ? ghostOp : 1, borderRight: '1px solid #CBD5E1', border: i === ghost ? '2px dashed #64748B' : undefined}}>{c.h}</div>
          ))}
        </div>
        {rows.map((r, ri) => (
          <div key={ri} style={{display: 'flex', height: 64, borderTop: '1px solid #CBD5E1', background: hi.includes(ri) ? hiColor : '#FFFFFF', opacity: dim.includes(ri) ? 0.35 : 1}}>
            {r.map((v, ci) => (
              <div key={ci} style={{width: cols[ci].w, lineHeight: '64px', padding: '0 14px', boxSizing: 'border-box', whiteSpace: 'nowrap', fontSize: 28, color: C.ink, textAlign: cols[ci].num ? 'right' : 'left', borderRight: '1px solid #CBD5E1', opacity: ci === ghost ? ghostOp : 1}}>{ci === ghost ? '؟' : v}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const PROD_COLS: Col[] = [{h: 'ProductID', w: 160}, {h: 'Product', w: 220}, {h: 'Product Sales', w: 250, num: true}];
export const SALES_COLS: Col[] = [{h: 'OrderID', w: 140}, {h: 'ProductID', w: 150, num: true}, {h: 'Quantity', w: 150, num: true}, {h: 'UnitPrice', w: 150, num: true}, {h: 'Line Amount', w: 220, num: true}];
export const PROD_X = 1230;
export const SALES_X = 60;
export const TBL_Y = 300;
export const prodRows = (): string[][] => PRODUCTS.map((p) => [String(p[0]), p[1], '']);
export const salesRows = (): string[][] => SALES.map((r) => [String(r[0]), String(r[1]), String(r[2]), fmt(r[3]), fmt(lineAmount(r))]);
export const LINE_Y = TBL_Y + 34 + 32; // header centre
export const LINE_X0 = SALES_X + 810 + 4; // right edge of Sales
export const LINE_X1 = PROD_X - 4; // left edge of Products

export const Relationship = ({fr, at, pulseAt}: {fr: number; at: number; pulseAt?: number}) => {
  const p = pop(fr, at, 16);
  if (p < 0.01) return null;
  const len = (LINE_X1 - LINE_X0) * p;
  const pl = pulseAt !== undefined ? pop(fr, pulseAt, 28) : -1;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, fontFamily: FONT, pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: LINE_X1 - len, top: LINE_Y - 2, width: len, height: 5, background: '#38BDF8'}} />
      <div style={{position: 'absolute', left: LINE_X1 - 30, top: LINE_Y - 52, fontSize: 40, fontWeight: 700, color: '#38BDF8', opacity: p}}>1</div>
      <div style={{position: 'absolute', left: LINE_X0 + 8, top: LINE_Y - 44, fontSize: 44, fontWeight: 700, color: '#38BDF8', opacity: p}}>*</div>
      <div style={{position: 'absolute', left: LINE_X0, top: LINE_Y + 18, width: LINE_X1 - LINE_X0, textAlign: 'center', fontSize: 26, color: '#BAE6FD', opacity: p}}>One-to-Many</div>
      {pl >= 0 && pl < 0.999 ? <div style={{position: 'absolute', left: LINE_X1 - (LINE_X1 - LINE_X0) * pl - 11, top: LINE_Y - 11, width: 22, height: 22, borderRadius: 11, background: C.yellow}} /> : null}
    </div>
  );
};

export const FormulaBar = ({text, caret = true, fr}: {text: string; caret?: boolean; fr: number}) => (
  <div style={{position: 'absolute', left: RAIL_W, top: BODY_Y, width: DATA_X - RAIL_W, height: FORM_H, background: '#FFFFFF', borderBottom: '1px solid ' + C.line, fontFamily: FONT, direction: 'ltr'}}>
    <div style={{position: 'absolute', left: 18, top: 14, fontSize: 28, color: C.gray, letterSpacing: 10}}>✕ ✓</div>
    <div style={{position: 'absolute', left: 120, top: 24}}>
      <Dax text={text + (caret && Math.floor(fr / 15) % 2 === 0 ? '|' : '')} size={26} />
    </div>
  </div>
);
export const FB_CODE_X = RAIL_W + 120;
export const FB_CODE_Y = BODY_Y + 24;
export const FB_CHAR = charW(26);
export const FB_LINE = 26 * 1.3;

export const Head = ({fr, at, text, color = C.yellow, y = 50}: {fr: number; at: number; text: string; color?: string; y?: number}) => {
  const p = pop(fr, at, 12);
  return <div style={{position: 'absolute', left: 0, top: y, width: 1920, textAlign: 'center', direction: 'rtl', fontFamily: FONT, fontSize: 54, fontWeight: 700, color, opacity: p}}>{text}</div>;
};

export const productSalesOf = (pid: number): string => fmt(productSales(pid));

export const Arrow = ({x, y, w = 110, op = 1}: {x: number; y: number; w?: number; op?: number}) => (
  <svg width={w} height={50} viewBox="0 0 110 50" style={{position: 'absolute', left: x, top: y, opacity: op}}>
    <path d="M104 25 H12 M36 6 L10 25 L36 44" stroke="#F2C811" strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
