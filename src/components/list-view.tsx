"use client";

import { Badge } from "@/components/ui/badge";
import { COUNTRY_CONFIG, IMPORTANCE_CONFIG } from "@/lib/constants";
import type { EconomicEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ListViewProps {
  events: EconomicEvent[];
  onSelectEvent: (e: EconomicEvent) => void;
}

export function ListView({ events, onSelectEvent }: ListViewProps) {
  if (events.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-12">
        필터 조건에 맞는 이벤트가 없습니다.
      </p>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted text-left">
            <th className="px-3 py-2 font-medium">날짜</th>
            <th className="px-3 py-2 font-medium">시간</th>
            <th className="px-3 py-2 font-medium">국가</th>
            <th className="px-3 py-2 font-medium">이벤트</th>
            <th className="px-3 py-2 font-medium">Period</th>
            <th className="px-3 py-2 font-medium text-right">Survey</th>
            <th className="px-3 py-2 font-medium text-right">Actual</th>
            <th className="px-3 py-2 font-medium text-right">Prior</th>
            <th className="px-3 py-2 font-medium">중요도</th>
          </tr>
        </thead>
        <tbody>
          {events.map((ev, i) => {
            const cc = COUNTRY_CONFIG[ev.country];
            const imp = IMPORTANCE_CONFIG[ev.importance];
            return (
              <tr
                key={i}
                onClick={() => onSelectEvent(ev)}
                className="border-t cursor-pointer hover:bg-accent transition-colors"
              >
                <td className="px-3 py-2 whitespace-nowrap">{ev.date}</td>
                <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">
                  {ev.time || "—"}
                </td>
                <td className="px-3 py-2">
                  <span className={cn("font-medium", cc.color)}>
                    {cc.flag} {ev.country}
                  </span>
                </td>
                <td className="px-3 py-2 max-w-[280px] truncate">
                  {ev.event}
                </td>
                <td className="px-3 py-2 text-muted-foreground">
                  {ev.period || "—"}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {formatCell(ev.survey)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums font-medium">
                  {formatCell(ev.actual)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {formatCell(ev.prior)}
                </td>
                <td className="px-3 py-2">
                  <Badge
                    className={cn(
                      "text-[10px] border-0",
                      imp.bg,
                      imp.color,
                    )}
                  >
                    {imp.label}
                  </Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function formatCell(v: number | string | null) {
  if (v === null || v === undefined) return "—";
  if (typeof v === "number") {
    if (Math.abs(v) >= 1e9) return `${(v / 1e9).toFixed(1)}B`;
    if (Math.abs(v) >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
    return v.toLocaleString("en-US", { maximumFractionDigits: 4 });
  }
  return String(v);
}
