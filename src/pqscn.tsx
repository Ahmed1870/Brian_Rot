import {Col, PCell} from "./pq";
import {rowAt, R, money, pct} from "./data";
import {C} from "./theme";

export const BASE: Col[] = [
  {k: "OrderID", label: "OrderID", w: 100, t: "123"}, {k: "Branch", label: "Branch", w: 94, t: "abc"}, {k: "Region", label: "Region", w: 108, t: "abc"},
  {k: "UnitPrice", label: "UnitPrice", w: 112, t: "1.2"}, {k: "Quantity", label: "Quantity", w: 104, t: "123"}, {k: "DiscountRate", label: "DiscountRate", w: 162, t: "1.2"}, {k: "Amount", label: "Amount", w: 96, t: "1.2"},
];
export const CAT: Col = {k: "CustomerCategory", label: "CustomerCategory", w: 196, t: "abc"};
export const NET: Col = {k: "NetValue", label: "NetValue", w: 120, t: "1.2"};
export const LOC: Col = {k: "Location", label: "Location", w: 140, t: "abc"};
export const mkCols = (cat: boolean, net: boolean, loc: boolean) => [...BASE, ...(cat ? [CAT] : []), ...(net ? [NET] : []), ...(loc ? [LOC] : [])];
export const pick = (n: number, branch?: string): R[] => { const out: R[] = []; for (let i = 0; out.length < n && i < 5000; i++) { const r = rowAt(i); if (!branch || r.branch === branch) out.push(r); } return out; };
export const catColor = (c: string) => (c === "VIP" ? "#9A6700" : c === "Premium" ? "#0F6CBD" : "#555");
export const mkCell = (rows: R[], show: {cat?: number; net?: number; loc?: number}, f: number) => (r: number, k: string): PCell | undefined => {
  const d = rows[r]; if (!d) return undefined;
  switch (k) {
    case "OrderID": return {text: String(d.id), num: true};
    case "Branch": return {text: d.branch};
    case "Region": return {text: d.region};
    case "UnitPrice": return {text: money(d.unit), num: true};
    case "Quantity": return {text: String(d.qty), num: true};
    case "DiscountRate": return {text: pct(d.disc), num: true};
    case "Amount": return {text: money(d.amount), num: true};
    case "CustomerCategory": return show.cat !== undefined && f >= show.cat + r * 3 ? {text: d.cat, color: catColor(d.cat), bold: true, bg: "rgba(16,185,129,.08)"} : undefined;
    case "NetValue": return show.net !== undefined && f >= show.net + r * 3 ? {text: money(d.net), num: true, bg: "rgba(245,158,11,.10)"} : undefined;
    case "Location": return show.loc !== undefined && f >= show.loc + r * 3 ? {text: d.loc, bg: "rgba(245,158,11,.10)"} : undefined;
    default: return undefined;
  }
};
export const F_TYPE = '= Table.TransformColumnTypes(Source, {{"OrderID", Int64.Type}, {"Branch", type text}, {"Region", type text}, …})';
export const F_COND = '= Table.AddColumn(#"Changed Type", "CustomerCategory", each if [Amount] > 10000 then "VIP" else if [Amount] > 5000 then "Premium" else "Standard")';
export const F_NET = '= Table.AddColumn(#"Added Conditional Column", "NetValue", each [UnitPrice] * [Quantity] * (1 - [DiscountRate]), type number)';
export const F_LOC = '= Table.AddColumn(#"Added Custom", "Location", each Text.Combine({[Branch], [Region]}, " - "), type text)';
export const F_FILT = '= Table.SelectRows(#"Added Custom1", each ([Branch] = TargetBranch))';
export const _c = C;
