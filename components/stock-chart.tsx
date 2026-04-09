"use client";

import { useEffect, useRef } from "react";

type Point = { time: string; open: number; high: number; low: number; close: number; volume: number };

export function StockChart({ data }: { data: Point[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let chart: { dispose: () => void; setOption: (opt: unknown) => void } | null = null;

    async function render() {
      if (!ref.current) return;
      const echarts = await import("echarts");
      if (disposed || !ref.current) return;
      chart = echarts.init(ref.current, undefined, { renderer: "canvas" });
      chart.setOption({
        backgroundColor: "transparent",
        tooltip: { trigger: "axis" },
        xAxis: { type: "category", data: data.map((d) => d.time.slice(0, 10)), axisLine: { lineStyle: { color: "#64748b" } } },
        yAxis: [{ scale: true, axisLine: { lineStyle: { color: "#64748b" } } }, { scale: true, gridIndex: 1 }],
        grid: [{ left: 40, right: 20, top: 20, height: "60%" }, { left: 40, right: 20, top: "72%", height: "18%" }],
        series: [
          {
            type: "candlestick",
            data: data.map((d) => [d.open, d.close, d.low, d.high]),
            itemStyle: { color: "#2ecc71", color0: "#e74c3c", borderColor: "#2ecc71", borderColor0: "#e74c3c" }
          },
          {
            type: "bar",
            xAxisIndex: 0,
            yAxisIndex: 1,
            data: data.map((d) => d.volume),
            itemStyle: { color: "#50B4FF" }
          }
        ]
      });
    }

    render();
    return () => {
      disposed = true;
      chart?.dispose();
    };
  }, [data]);

  return <div ref={ref} className="h-[420px] w-full" />;
}
