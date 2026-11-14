import {useCurrentFrame} from "remotion";
import {Cap, Cursor, PPWindow, Tag, eo, lerp, prog, rgba} from "../kit";
import {C, F} from "../theme";
import {Chip, Root, Stage, anchor, win} from "./common";

const a = (k: number) => anchor(3, k);
const TXT = ["Mona Adel · Cairo · Laptop X1 · Cairo Store 01", "Omar Fathy · Alexandria · Phone P5 · Alex Store 02", "Mona Adel · Cairo · Laptop X1 · Cairo Store 01", "Salma Nabil · Giza · Mouse M2 · Giza Store 03", "Mona Adel · Cairo · Cable C1 · Cairo Store 01", "Omar Fathy · Alexandria · Laptop X1 · Alex Store 02"];
const KEYS = ["41 · 7 · 1", "42 · 12 · 2", "41 · 7 · 1", "43 · 18 · 3", "41 · 21 · 1", "42 · 7 · 2"];
const DICT: [string, string][] = [["41", "Mona Adel"], ["42", "Omar Fathy"], ["43", "Salma Nabil"], ["7", "Laptop X1"], ["12", "Phone P5"], ["1", "Cairo Store 01"]];

export const Sc4 = () => {
  const f = useCurrentFrame();
  const swap = prog(f, a(1), 40), cmp = prog(f, a(3), 70);
  const flatMB = 12.4, starMB = 1.3;
  const h = (mb: number) => 150 * (mb / flatMB);
  const starH = lerp(h(flatMB), h(starMB), eo(cmp));
  return (
    <Stage strip={[
      <Cap key="0" f={f} a={a(1)} b={a(3)}><Tag label="Cardinality Optimization" color={C.emerald} parts={[{t: "Replaces Heavy Text Strings with Compact Integer Keys"}]} /></Cap>,
      <Cap key="1" f={f} a={a(3)} b={9999}><Tag label="VertiPaq Efficiency" color={C.emerald} parts={[{t: "Fact/Dim Separation Reduces RAM Memory Footprint by up to 90%"}]} /></Cap>,
    ]}>
      <Root>
        <PPWindow view="diagram" status="">
          <div style={{position: "absolute", left: 24, top: 16, width: 610, height: 330, background: C.slate, border: `2.5px solid ${C.red}`, borderRadius: 14, boxShadow: `0 0 18px ${rgba(C.red, 0.4)}`, boxSizing: "border-box", fontFamily: F.ui, color: "#fff", padding: 16}}>
            <div style={{fontWeight: 700, fontSize: 18, color: C.red}}>Flat table · text repeated 50,000 ×</div>
            {TXT.map((t, i) => <div key={i} style={{marginTop: 8, fontFamily: F.mono, fontSize: 13.5, background: rgba(C.red, 0.12), padding: "3px 8px", borderRadius: 5, opacity: 1 - 0.7 * swap * 0 }}>{t}</div>)}
            <div style={{position: "absolute", right: 24, bottom: 20, width: 90, height: h(flatMB), background: `linear-gradient(180deg, ${C.red}, #7F1D1D)`, borderRadius: 6}} />
            <div style={{position: "absolute", right: 126, bottom: 60, fontWeight: 700, fontSize: 28, color: C.red}}>{flatMB.toFixed(1)} MB</div>
          </div>
          <div style={{position: "absolute", left: 650, top: 16, width: 610, height: 330, background: C.slate, border: `2.5px solid ${C.emerald}`, borderRadius: 14, boxShadow: `0 0 18px ${rgba(C.emerald, 0.4)}`, boxSizing: "border-box", fontFamily: F.ui, color: "#fff", padding: 16}}>
            <div style={{fontWeight: 700, fontSize: 18, color: C.emerald}}>Fact_Sales (integer keys) + Dim tables (text once)</div>
            {KEYS.map((t, i) => <div key={i} style={{marginTop: 8, fontFamily: F.mono, fontSize: 13.5, background: rgba(C.emerald, 0.12 * swap), padding: "3px 8px", borderRadius: 5, opacity: swap}}>{t}</div>)}
            <div style={{position: "absolute", left: 16, top: 230, opacity: swap}}>
              {DICT.map(([k, v]) => <div key={k} style={{fontFamily: F.mono, fontSize: 12, lineHeight: "14px", color: "#CBD5E1"}}>{k} → {v}</div>)}
            </div>
            <div style={{position: "absolute", right: 24, bottom: 20, width: 90, height: starH, background: `linear-gradient(180deg, ${C.emerald}, #065F46)`, borderRadius: 6}} />
            <div style={{position: "absolute", right: 126, bottom: 60, fontWeight: 700, fontSize: 28, color: C.emerald}}>{lerp(flatMB, starMB, eo(cmp)).toFixed(1)} MB</div>
          </div>
        </PPWindow>
        {f >= a(2) && f < a(3) ? <Chip x={330} y={548} w={640} color={C.blue} k={win(f, a(2), a(3))} size={14}>Text stored once per dimension · fact keeps small integers</Chip> : null}
        {cmp > 0.9 ? <Chip x={650} y={548} w={420} color={C.emerald} k={eo(prog(f, a(3) + 70, 14))} size={15}>12.4 → 1.3 MB ≈ −89.5% (up to ~90%)</Chip> : null}
        {f >= a(4) ? <Chip x={140} y={548} w={480} color={C.blue} k={eo(prog(f, a(4), 14))} size={14}>Filters scan compact integer columns → faster</Chip> : null}
        {f >= a(4) ? <div style={{position: "absolute", left: 1100, top: 552, color: "#94A3B8", fontFamily: F.ui, fontSize: 12.5}}>illustrative sizes</div> : null}
        <Cursor keys={[{f: a(1) - 20, x: 640, y: 480}, {f: a(1) + 20, x: 800, y: 180}, {f: a(3), x: 1000, y: 300}, {f: a(3) + 120, x: 900, y: 520}]} />
      </Root>
    </Stage>
  );
};
