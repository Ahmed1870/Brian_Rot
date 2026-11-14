export const BRANCHES = ["Cairo", "Alex", "Giza", "Aswan"];
export const REGION_OF: Record<string, string> = {Cairo: "Capital", Alex: "Coastal", Giza: "Capital", Aswan: "Upper Egypt"};
const UNIT = [150, 480, 1200, 3500, 260, 780, 2200, 90, 950, 1800, 340, 5200];
const DISC = [0, 0.05, 0.1, 0.15];
const H = (i: number, s: number) => (Math.imul(i + s, 2654435761) >>> 0) / 4294967296;
export type R = {id: number; branch: string; region: string; unit: number; qty: number; disc: number; amount: number; cat: string; net: number; loc: string};
export const rowAt = (i: number): R => {
  const hb = H(i, 11);
  const branch = hb < 0.4 ? "Cairo" : hb < 0.7 ? "Alex" : hb < 0.9 ? "Giza" : "Aswan";
  const unit = UNIT[Math.floor(H(i, 23) * 12)];
  const qty = 1 + Math.floor(H(i, 37) * 9);
  const disc = DISC[Math.floor(H(i, 51) * 4)];
  const amount = unit * qty;
  return {id: 1001 + i, branch, region: REGION_OF[branch], unit, qty, disc, amount, cat: amount > 10000 ? "VIP" : amount > 5000 ? "Premium" : "Standard", net: amount * (1 - disc), loc: `${branch} - ${REGION_OF[branch]}`};
};
export const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
export const money = (n: number) => (Math.round(n * 100) / 100).toLocaleString("en-US", {minimumFractionDigits: 0, maximumFractionDigits: 2});
export const pct = (d: number) => d.toFixed(2);
// counts over 50,000 rows (computed once)
export const COUNT_BY: Record<string, number> = {Cairo: 0, Alex: 0, Giza: 0, Aswan: 0};
for (let i = 0; i < 50000; i++) COUNT_BY[rowAt(i).branch]++;
export const M_CODE = [
  "let",
  '    Source = Excel.CurrentWorkbook(){[Name="tbl_Sales"]}[Content],',
  '    #"Changed Type" = Table.TransformColumnTypes(Source, {{"OrderID", Int64.Type}, {"Branch", type text},',
  '        {"Region", type text}, {"UnitPrice", type number}, {"Quantity", Int64.Type},',
  '        {"DiscountRate", type number}, {"Amount", type number}}),',
  '    #"Added Conditional Column" = Table.AddColumn(#"Changed Type", "CustomerCategory",',
  '        each if [Amount] > 10000 then "VIP" else if [Amount] > 5000 then "Premium" else "Standard"),',
  '    #"Added Custom" = Table.AddColumn(#"Added Conditional Column", "NetValue",',
  '        each [UnitPrice] * [Quantity] * (1 - [DiscountRate]), type number),',
  '    #"Added Custom1" = Table.AddColumn(#"Added Custom", "Location",',
  '        each Text.Combine({[Branch], [Region]}, " - "), type text),',
  '    #"Filtered Rows" = Table.SelectRows(#"Added Custom1", each ([Branch] = TargetBranch))',
  "in",
  '    #"Filtered Rows"',
];
