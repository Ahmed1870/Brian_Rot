import {MONO} from '../theme';

type Tok = {t: string; k: 'fn' | 'ref' | 'tbl' | 'num' | 'txt'};
export const tokenize = (s: string): Tok[] => {
  const out: Tok[] = [];
  const re = /([A-Za-z_]+)(?=\s*\()|\[[^\]]*\]|[A-Za-z_]+(?=\[)|\d+|\s+|[\s\S]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    const t = m[0];
    let k: Tok['k'] = 'txt';
    if (m[1] !== undefined) k = 'fn';
    else if (t.startsWith('[')) k = 'ref';
    else if (/^[A-Za-z_]+$/.test(t) && s[m.index + t.length] === '[') k = 'tbl';
    else if (/^\d+$/.test(t)) k = 'num';
    out.push({t, k});
  }
  return out;
};

const LIGHT = {fn: '#0F6CBD', ref: '#7A3E9D', tbl: '#8A5A00', num: '#0B7A4B', txt: '#201F1E'};
const DARK = {fn: '#7DD3FC', ref: '#D8B4FE', tbl: '#FCD34D', num: '#86EFAC', txt: '#E2E8F0'};

export const Dax = ({text, size = 28, dark = false, line = 1.3}: {text: string; size?: number; dark?: boolean; line?: number}) => {
  const pal = dark ? DARK : LIGHT;
  return (
    <div dir="ltr" style={{fontFamily: MONO, fontSize: size, lineHeight: line, whiteSpace: 'pre', textAlign: 'left', unicodeBidi: 'isolate'}}>
      {tokenize(text).map((k, i) => (
        <span key={i} style={{color: pal[k.k], fontWeight: k.k === 'fn' ? 700 : 400}}>
          {k.t}
        </span>
      ))}
    </div>
  );
};

/** Width of one monospace char (DejaVu Sans Mono = 0.602 em). */
export const charW = (size: number): number => size * 0.602;
