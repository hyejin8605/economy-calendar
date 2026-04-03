"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EventBadge } from "@/components/event-badge";
import { DAYS_KO, IMPORTANCE_CONFIG } from "@/lib/constants";
import {
  formatMonthLabel,
  getMonthDays,
  sortByImportance,
} from "@/lib/date-utils";
import type { EconomicEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

const MAX_VISIBLE = 3;

interface MonthViewProps {
  year: number;
  month: number;
  eventsByDate: Map<string, EconomicEvent[]>;
  onPrev: () => void;
  onNext: () => void;
  onSelectEvent: (e: EconomicEvent) => void;
}

export function MonthView({
  year,
  month,
  eventsByDate,
  onPrev,
  onNext,
  onSelectEvent,
}: MonthViewProps) {
  const days = getMonthDays(year, month);
  const today = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const selectedDateEvents = selectedDate
    ? sortByImportance(eventsByDate.get(selectedDate) || [])
    : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="sm" onClick={onPrev}>
          ← 이전
        </Button>
        <h2 className="text-lg font-semibold">
          {formatMonthLabel(year, month)}
        </h2>
        <Button variant="outline" size="sm" onClick={onNext}>
          다음 →
        </Button>
      </div>

      <div className="grid grid-cols-7 border-b">
        {DAYS_KO.map((d, i) => (
          <div
            key={d}
            className={cn(
              "text-center text-sm font-medium py-2",
              i === 0 && "text-red-500",
              i === 6 && "text-blue-500",
            )}
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map(({ date, isCurrentMonth }) => {
          const dayEvents = sortByImportance(eventsByDate.get(date) || []);
          const dayNum = parseInt(date.slice(8), 10);
          const isToday = date === today;

          return (
            <div
              key={date}
              role="button"
              tabIndex={0}
              onClick={() => dayEvents.length > 0 && setSelectedDate(date)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && dayEvents.length > 0)
                  setSelectedDate(date);
              }}
              className={cn(
                "min-h-[100px] border-b border-r p-1 text-xs",
                !isCurrentMonth && "bg-muted/40 text-muted-foreground",
                dayEvents.length > 0 &&
                  "cursor-pointer hover:bg-muted/60 transition-colors",
              )}
            >
              <div
                className={cn(
                  "text-right text-sm mb-1 font-medium",
                  isToday &&
                    "bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center ml-auto",
                )}
              >
                {dayNum}
              </div>
              <div className="space-y-0.5">
                {dayEvents.slice(0, MAX_VISIBLE).map((ev, i) => (
                  <EventBadge
                    key={i}
                    event={ev}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectEvent(ev);
                    }}
                  />
                ))}
                {dayEvents.length > MAX_VISIBLE && (
                  <div className="text-muted-foreground text-center text-[10px]">
                    +{dayEvents.length - MAX_VISIBLE}개
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Date events modal */}
      <Dialog
        open={selectedDate !== null}
        onOpenChange={(open) => !open && setSelectedDate(null)}
      >
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedDate} 이벤트</DialogTitle>
          </DialogHeader>
          <div className="text-xs text-muted-foreground mb-2">
            총 {selectedDateEvents.length}개
          </div>
          <div className="space-y-1">
            {selectedDateEvents.map((ev, i) => {
              const imp = IMPORTANCE_CONFIG[ev.importance];
              return (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedDate(null);
                    onSelectEvent(ev);
                  }}
                  className="w-full text-left rounded-lg border p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-12 shrink-0">
                      {ev.time || "--:--"}
                    </span>
                    <span className="text-xs font-medium w-8 shrink-0">
                      {ev.country}
                    </span>
                    <span className="text-sm truncate flex-1">{ev.event}</span>
                    <Badge
                      className={cn(
                        "shrink-0 border-0 text-[10px]",
                        imp.bg,
                        imp.color,
                      )}
                    >
                      {imp.label}
                    </Badge>
                  </div>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
