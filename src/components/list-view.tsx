"use client";

import { useCallback, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { COUNTRY_CONFIG, IMPORTANCE_CONFIG } from "@/lib/constants";
import type { EconomicEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

type SortKey =
  | "date"
  | "time"
  | "country"
  | "event"
  | "period"
  | "survey"
  | "actual"
  | "prior"
  | "revised"
  | "importance";
type SortDir = "asc" | "desc";

const IMPORTANCE_ORDER: Record<string, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

function compareValues(
  a: number | string | null,
  b: number | string | null,
): number {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b));
}

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
          cmp =
            a.date.localeCompare(b.date) ||
            (a.time || "").localeCompare(b.time || "");
          break;
        case "time":
          cmp = (a.time || "").localeCompare(b.time || "");
          break;
        case "country":
          cmp = a.country.localeCompare(b.country);
          break;
        case "event":
          cmp = a.event.localeCompare(b.event, "ko");
          break;
        case "period":
          cmp = (a.period || "").localeCompare(b.period || "");
          break;
        case "survey":
          cmp = compareValues(a.survey, b.survey);
          break;
        case "actual":
          cmp = compareValues(a.actual, b.actual);
          break;
        case "prior":
          cmp = compareValues(a.prior, b.prior);
          break;
        case "revised":
          cmp = compareValues(a.revised, b.revised);
          break;
        case "importance":
          cmp =
            (IMPORTANCE_ORDER[a.importance] ?? 3) -
            (IMPORTANCE_ORDER[b.importance] ?? 3);
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
    <div className="border rounded-lg overflow-x-auto">
      <table className="w-full text-sm min-w-[900px]">
        <thead>
          <tr className="bg-muted text-left">
            <SortTh onClick={() => handleSort("date")}>
              날짜{arrow("date")}
            </SortTh>
            <SortTh onClick={() => handleSort("time")}>
              시간{arrow("time")}
            </SortTh>
            <SortTh onClick={() => handleSort("country")}>
              국가{arrow("country")}
            </SortTh>
            <SortTh onClick={() => handleSort("event")}>
              이벤트{arrow("event")}
            </SortTh>
            <SortTh onClick={() => handleSort("period")}>
              Period{arrow("period")}
            </SortTh>
            <SortTh className="text-right" onClick={() => handleSort("survey")}>
              Survey{arrow("survey")}
            </SortTh>
            <SortTh className="text-right" onClick={() => handleSort("actual")}>
              Actual{arrow("actual")}
            </SortTh>
            <SortTh className="text-right" onClick={() => handleSort("prior")}>
              Prior{arrow("prior")}
            </SortTh>
            <SortTh
              className="text-right"
              onClick={() => handleSort("revised")}
            >
              Revised{arrow("revised")}
            </SortTh>
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
                <td className="px-3 py-2 whitespace-nowrap">{ev.date}</td>
                <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">
                  {ev.time || "—"}
                </td>
                <td className="px-3 py-2">
                  <span className={cn("font-medium", cc.color)}>
                    {ev.country}
                  </span>
                </td>
                <td className="px-3 py-2 max-w-[280px] truncate">
                  {ev.event}
                </td>
                <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">
                  {ev.period || "—"}
                </td>
                <td className="px-3 py-2 text-right tabular-nums whitespace-nowrap">
                  {formatCell(ev.survey)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums font-medium whitespace-nowrap">
                  {formatCell(ev.actual)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums whitespace-nowrap">
                  {formatCell(ev.prior)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums whitespace-nowrap">
                  {formatCell(ev.revised)}
                </td>
                <td className="px-3 py-2">
                  <Badge
                    className={cn("text-[10px] border-0", imp.bg, imp.color)}
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
        "px-3 py-2 font-medium cursor-pointer select-none whitespace-nowrap hover:bg-muted-foreground/10 transition-colors",
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
  return String(v);
}
