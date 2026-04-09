"use client";

import { useEffect, useRef } from "react";

type Point = { time: string; open: number; high: number; low: number; close: number; volume: number };

export function StockChart({ data }: { data: Point[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let chart: { dispose: () => void; setOption: (opt: unknown) => void; resize: () => void } | null = null;

    async function render() {
      if (!ref.current || data.length === 0) return;
      const echarts = await import("echarts");
      if (disposed || !ref.current) return;

      const safeData = data.filter((d) => [d.open, d.high, d.low, d.close, d.volume].every((v) => Number.isFinite(v)));
      if (safeData.length === 0) return;

      chart = echarts.init(ref.current, undefined, { renderer: "canvas" });
      chart.setOption({
        backgroundColor: "transparent",
        animation: false,
        tooltip: { trigger: "axis" },
        grid: [
          { left: 50, right: 20, top: 20, height: "62%" },
          { left: 50, right: 20, top: "74%", height: "16%" }
        ],
        xAxis: [
          {
            type: "category",
            data: safeData.map((d) => d.time.slice(0, 10)),
            axisLine: { lineStyle: { color: "#64748b" } },
            axisLabel: { color: "#94a3b8" },
            boundaryGap: true
          },
          {
            type: "category",
            gridIndex: 1,
            data: safeData.map((d) => d.time.slice(0, 10)),
            axisLine: { lineStyle: { color: "#64748b" } },
            axisLabel: { show: false },
            boundaryGap: true
          }
        ],
        yAxis: [
          {
            scale: true,
            axisLine: { lineStyle: { color: "#64748b" } },
            splitLine: { lineStyle: { color: "rgba(148,163,184,0.15)" } },
            axisLabel: { color: "#94a3b8" }
          },
          {
            gridIndex: 1,
            scale: true,
            axisLine: { lineStyle: { color: "#64748b" } },
            splitLine: { show: false },
            axisLabel: { color: "#94a3b8" }
          }
        ],
        series: [
          {
            type: "candlestick",
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: safeData.map((d) => [d.open, d.close, d.low, d.high]),
            itemStyle: { color: "#2ecc71", color0: "#e74c3c", borderColor: "#2ecc71", borderColor0: "#e74c3c" }
          },
          {
            type: "bar",
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: safeData.map((d) => d.volume),
            itemStyle: { color: "#50B4FF" }
          }
        ]
      });
      chart.resize();
    }

    render();

    function onResize() {
      chart?.resize();
    }
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      window.removeEventListener("resize", onResize);
      chart?.dispose();
    };
  }, [data]);

  return <div ref={ref} className="h-[420px] w-full" />;
}
