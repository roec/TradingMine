import { ReactNode } from "react";

export function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="card">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">{title}</h3>
      {children}
    </section>
  );
}

export function Badge({ value }: { value: string }) {
  const tone =
    value === "Exit"
      ? "bg-danger/20 text-danger"
      : value === "Reduce"
      ? "bg-warning/20 text-warning"
      : value === "Warning"
      ? "bg-yellow-400/20 text-yellow-300"
      : "bg-success/20 text-success";
  return <span className={`rounded-full px-3 py-1 text-xs font-medium ${tone}`}>{value}</span>;
}
