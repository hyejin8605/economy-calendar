"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { COUNTRY_CONFIG, DAYS_KO, IMPORTANCE_CONFIG } from "@/lib/constants";
import { formatWeekLabel, getWeekDays } from "@/lib/date-utils";
import type { EconomicEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

interface WeekViewProps {
  baseDate: Date;
  eventsByDate: Map<string, EconomicEvent[]>;
  onPrev: () => void;
  onNext: () => void;
  onSelectEvent: (e: EconomicEvent) => void;
}

export function WeekView({
  baseDate,
  eventsByDate,
  onPrev,
  onNext,
  onSelectEvent,
}: WeekViewProps) {
  const days = getWeekDays(baseDate);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="sm" onClick={onPrev}>
          ← 이전 주
        </Button>
        <h2 className="text-lg font-semibold">{formatWeekLabel(days)}</h2>
        <Button variant="outline" size="sm" onClick={onNext}>
          다음 주 →
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((date, i) => {
          const dayEvents = eventsByDate.get(date) || [];
          const dayNum = parseInt(date.slice(8), 10);
          const dow = new Date(date + "T00:00:00").getDay();
          const isToday = date === today;

          return (
            <div key={date} className="min-h-[200px]">
              <div
                className={cn(
                  "text-center py-2 rounded-t-lg border-b-2 font-medium text-sm",
                  isToday ? "bg-primary text-primary-foreground" : "bg-muted",
                  dow === 0 && "text-red-500",
                  dow === 6 && "text-blue-500",
                )}
              >
                {DAYS_KO[dow]} {dayNum}
              </div>
              <div className="space-y-1 pt-2">
                {dayEvents.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    일정 없음
                  </p>
                )}
                {dayEvents.map((ev, j) => {
                  const cc = COUNTRY_CONFIG[ev.country];
                  const imp = IMPORTANCE_CONFIG[ev.importance];
                  return (
                    <button
                      key={j}
                      onClick={() => onSelectEvent(ev)}
                      className={cn(
                        "w-full text-left rounded-md border p-2 text-xs cursor-pointer transition-colors hover:bg-accent",
                        cc.border,
                      )}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-muted-foreground">
                          {ev.time || "종일"}
                        </span>
                        <Badge
                          className={cn(
                            "text-[10px] px-1.5 py-0 h-4 border-0",
                            imp.bg,
                            imp.color,
                          )}
                        >
                          {imp.label}
                        </Badge>
                      </div>
                      <div className={cn("font-medium truncate", cc.color)}>
                        {cc.flag} {ev.event}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
