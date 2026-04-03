"use client";

import { useCallback, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { COUNTRY_CONFIG, IMPORTANCE_CONFIG } from "@/lib/constants";
import type { EconomicEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

type SortKey = "date" | "time" | "country" | "importance" | "event";
type SortDir = "asc" | "desc";

const IMPORTANCE_ORDER: Record<string, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

interface ListViewProps {
  events: EconomicEvent[];
  onSelectEvent: (e: EconomicEvent) => void;
}

export function ListView({ events, onSelectEvent }: ListViewProps) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = useCallback(
    (key: SortKey) => {
      if (sortKey === key) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDir("asc");
      }
    },
    [sortKey],
  );

  const sorted = useMemo(() => {
    const dir = sortDir === "asc" ? 1 : -1;
    return [...events].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "date":
          cmp = a.date.localeCompare(b.date) || (a.time || "").localeCompare(b.time || "");
          break;
        case "time":
          cmp = (a.time || "").localeCompare(b.time || "");
          break;
        case "country":
          cmp = a.country.localeCompare(b.country);
          break;
        case "importance":
          cmp =
            (IMPORTANCE_ORDER[a.importance] ?? 3) -
            (IMPORTANCE_ORDER[b.importance] ?? 3);
          break;
        case "event":
          cmp = a.event.localeCompare(b.event, "ko");
          break;
      }
      return cmp * dir;
    });
  }, [events, sortKey, sortDir]);

  if (events.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-12">
        필터 조건에 맞는 이벤트가 없습니다.
      </p>
    );
  }

  const arrow = (key: SortKey) =>
    sortKey === key ? (sortDir === "asc" ? " ↑" : " ↓") : "";

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted text-left">
            <SortTh onClick={() => handleSort("date")}>
              날짜{arrow("date")}
            </SortTh>
            <SortTh
              className="hidden md:table-cell"
              onClick={() => handleSort("time")}
            >
              시간{arrow("time")}
            </SortTh>
            <SortTh onClick={() => handleSort("country")}>
              국가{arrow("country")}
            </SortTh>
            <SortTh onClick={() => handleSort("event")}>
              이벤트{arrow("event")}
            </SortTh>
            <th className="px-3 py-2 font-medium hidden lg:table-cell">
              Period
            </th>
            <th className="px-3 py-2 font-medium text-right hidden lg:table-cell">
              Survey
            </th>
            <th className="px-3 py-2 font-medium text-right hidden md:table-cell">
              Actual
            </th>
            <th className="px-3 py-2 font-medium text-right hidden lg:table-cell">
              Prior
            </th>
            <SortTh onClick={() => handleSort("importance")}>
              중요도{arrow("importance")}
            </SortTh>
          </tr>
        </thead>
        <tbody>
          {sorted.map((ev, i) => {
            const cc = COUNTRY_CONFIG[ev.country];
            const imp = IMPORTANCE_CONFIG[ev.importance];
            return (
              <tr
                key={i}
                onClick={() => onSelectEvent(ev)}
                className="border-t cursor-pointer hover:bg-accent transition-colors"
              >
                <td className="px-3 py-2 whitespace-nowrap">
                  <span className="hidden md:inline">{ev.date}</span>
                  <span className="md:hidden">{ev.date.slice(5)}</span>
                  <span className="md:hidden text-muted-foreground text-xs ml-1">
                    {ev.time || ""}
                  </span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-muted-foreground hidden md:table-cell">
                  {ev.time || "—"}
                </td>
                <td className="px-3 py-2">
                  <span className={cn("font-medium", cc.color)}>
                    {ev.country}
                  </span>
                </td>
                <td className="px-3 py-2 max-w-[140px] md:max-w-[280px] truncate">
                  {ev.event}
                </td>
                <td className="px-3 py-2 text-muted-foreground hidden lg:table-cell">
                  {ev.period || "—"}
                </td>
                <td className="px-3 py-2 text-right tabular-nums hidden lg:table-cell">
                  {formatCell(ev.survey)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums font-medium hidden md:table-cell">
                  {formatCell(ev.actual)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums hidden lg:table-cell">
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

function SortTh({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
}) {
  return (
    <th
      className={cn(
        "px-3 py-2 font-medium cursor-pointer select-none hover:bg-muted-foreground/10 transition-colors",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </th>
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
