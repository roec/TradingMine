import { ScreenerCondition } from "@/core/types/domain";

export type ScreenableRow = Record<string, number | boolean | string> & {
  symbol: string;
  riskLevel?: string;
};

function compare(left: number | boolean | string, op: ScreenerCondition["op"], right: number | boolean | string): boolean {
  switch (op) {
    case ">":
      return Number(left) > Number(right);
    case ">=":
      return Number(left) >= Number(right);
    case "<":
      return Number(left) < Number(right);
    case "<=":
      return Number(left) <= Number(right);
    case "=":
      return left === right;
    case "!=":
      return left !== right;
    default:
      return false;
  }
}

export function runScreener(rows: ScreenableRow[], conditions: ScreenerCondition[]) {
  return rows.filter((row) =>
    conditions.every((condition) => compare(row[condition.indicator], condition.op, condition.value))
  );
}

export function rankRows(rows: ScreenableRow[], key: string, order: "asc" | "desc" = "desc") {
  return [...rows].sort((a, b) => {
    const diff = Number(a[key]) - Number(b[key]);
    return order === "desc" ? -diff : diff;
  });
}
