export const PRODUCTS: Array<[number, string]> = [[1, 'Laptop'], [2, 'Mouse'], [3, 'Keyboard'], [4, 'Monitor']];
// OrderID, ProductID, Quantity, UnitPrice (training data from the lesson sheet)
export const SALES: Array<[number, number, number, number]> = [
  [1001, 1, 2, 15000],
  [1002, 2, 5, 250],
  [1003, 3, 3, 600],
  [1004, 4, 1, 4500],
];
export const lineAmount = (r: [number, number, number, number]): number => r[2] * r[3];
export const productSales = (pid: number): number => SALES.filter((r) => r[1] === pid).reduce((a, r) => a + lineAmount(r), 0);
export const TOTAL_SALES = SALES.reduce((a, r) => a + lineAmount(r), 0);
export const fmt = (n: number): string => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
