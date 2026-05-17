export type AmountOperator = "<" | "<=" | ">" | ">=" | "==";

export function matchesAmountFilter(
  amount: number | string,
  operator: string,
  filterValue: string
): boolean {
  if (!filterValue.trim()) return true;

  const threshold = parseFloat(filterValue);
  if (Number.isNaN(threshold)) return true;

  const value = typeof amount === "number" ? amount : parseFloat(String(amount));
  if (Number.isNaN(value)) return false;

  const op = operator.trim() as AmountOperator;

  switch (op) {
    case "<":
      return value < threshold;
    case "<=":
      return value <= threshold;
    case ">":
      return value > threshold;
    case "==":
      return value === threshold;
    case ">=":
    default:
      return value >= threshold;
  }
}
