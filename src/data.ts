export const fmtK = (s: number) => s.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
export const FLAT = [
  ["S-1001", "Mona Adel", "Cairo", "Laptop X1", "Electronics", "Cairo Store 01", 2, 54000], ["S-1002", "Omar Fathy", "Alexandria", "Phone P5", "Electronics", "Alex Store 02", 5, 42000],
  ["S-1003", "Mona Adel", "Cairo", "Laptop X1", "Electronics", "Cairo Store 01", 1, 27000], ["S-1004", "Salma Nabil", "Giza", "Mouse M2", "Accessories", "Giza Store 03", 12, 2400],
  ["S-1005", "Omar Fathy", "Alexandria", "Laptop X1", "Electronics", "Alex Store 02", 1, 27000], ["S-1006", "Mona Adel", "Cairo", "Cable C1", "Accessories", "Cairo Store 01", 20, 3000],
  ["S-1007", "Karim Said", "Giza", "Phone P5", "Electronics", "Giza Store 03", 3, 25200], ["S-1008", "Salma Nabil", "Giza", "Laptop X1", "Electronics", "Giza Store 03", 1, 27000],
];
export const FACT = [
  ["1001", "20260105", "41", "7", "1", 2, 54000, 0], ["1002", "20260105", "42", "12", "2", 5, 42000, 500], ["1003", "20260106", "41", "7", "1", 1, 27000, 0], ["1004", "20260106", "43", "18", "3", 12, 2400, 0],
  ["1005", "20260107", "42", "7", "2", 1, 27000, 0], ["1006", "20260107", "41", "21", "1", 20, 3000, 150], ["1007", "20260108", "44", "12", "3", 3, 25200, 0], ["1008", "20260108", "43", "7", "3", 1, 27000, 0],
  ["1009", "20260109", "45", "15", "2", 4, 9600, 0], ["1010", "20260109", "41", "24", "1", 2, 5800, 0], ["1011", "20260110", "46", "27", "3", 6, 11400, 0],
];
export const DIMP = [["7", "Laptop X1", "Electronics", "Laptops", "Nova"], ["12", "Phone P5", "Electronics", "Phones", "Zeta"], ["15", "Tablet T3", "Electronics", "Tablets", "Zeta"], ["18", "Mouse M2", "Accessories", "Input", "Nova"], ["21", "Cable C1", "Accessories", "Cables", "Volt"], ["24", "Monitor D4", "Electronics", "Displays", "Lumo"], ["27", "Printer R7", "Office", "Printers", "Volt"]];
export const FACT_F = [{n: "OrderLineID"}, {n: "DateKey", kind: "fk" as const}, {n: "CustomerKey", kind: "fk" as const}, {n: "ProductKey", kind: "fk" as const}, {n: "StoreKey", kind: "fk" as const}, {n: "Quantity", kind: "metric" as const}, {n: "SalesAmount", kind: "metric" as const}, {n: "Discount", kind: "metric" as const}];
export const PROD_F = [{n: "ProductKey", kind: "pk" as const}, {n: "ProductName", kind: "attr" as const}, {n: "Category", kind: "attr" as const}, {n: "Subcategory", kind: "attr" as const}, {n: "Brand", kind: "attr" as const}];
export const CUST_F = [{n: "CustomerKey", kind: "pk" as const}, {n: "CustomerName", kind: "attr" as const}, {n: "City", kind: "attr" as const}, {n: "Region", kind: "attr" as const}];
export const STORE_F = [{n: "StoreKey", kind: "pk" as const}, {n: "StoreName", kind: "attr" as const}, {n: "City", kind: "attr" as const}];
