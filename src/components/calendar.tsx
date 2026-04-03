"use client";

import { useCallback, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventDetail } from "@/components/event-detail";
import { FilterBar } from "@/components/filter-bar";
import { ListView } from "@/components/list-view";
import { MonthView } from "@/components/month-view";
import { WeekView } from "@/components/week-view";
import { useEvents } from "@/hooks/use-events";
import type { EconomicEvent, ViewMode } from "@/lib/types";

export function Calendar() {
  const {
    filtered,
    eventsByDate,
    countries,
    importances,
    toggleCountry,
    toggleImportance,
  } = useEvents();

  const [view, setView] = useState<ViewMode>("month");
  const [selectedEvent, setSelectedEvent] = useState<EconomicEvent | null>(
    null,
  );

  // Month navigation (default: April 2026 to match data)
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(3); // 0-indexed, 3 = April

  // Week navigation
  const [weekBase, setWeekBase] = useState(() => new Date(2026, 3, 1));

  const prevMonth = useCallback(() => {
    setMonth((m) => {
      if (m === 0) {
        setYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  }, []);

  const nextMonth = useCallback(() => {
    setMonth((m) => {
      if (m === 11) {
        setYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  }, []);

  const prevWeek = useCallback(() => {
    setWeekBase((d) => {
      const n = new Date(d);
      n.setDate(d.getDate() - 7);
      return n;
    });
  }, []);

  const nextWeek = useCallback(() => {
    setWeekBase((d) => {
      const n = new Date(d);
      n.setDate(d.getDate() + 7);
      return n;
    });
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs
          value={view}
          onValueChange={(v) => setView(v as ViewMode)}
        >
          <TabsList>
            <TabsTrigger value="month">월간</TabsTrigger>
            <TabsTrigger value="week">주간</TabsTrigger>
            <TabsTrigger value="list">리스트</TabsTrigger>
          </TabsList>
        </Tabs>
        <FilterBar
          countries={countries}
          importances={importances}
          toggleCountry={toggleCountry}
          toggleImportance={toggleImportance}
        />
      </div>

      <div className="text-xs text-muted-foreground">
        총 {filtered.length}개 이벤트
      </div>

      {view === "month" && (
        <MonthView
          year={year}
          month={month}
          eventsByDate={eventsByDate}
          onPrev={prevMonth}
          onNext={nextMonth}
          onSelectEvent={setSelectedEvent}
        />
      )}
      {view === "week" && (
        <WeekView
          baseDate={weekBase}
          eventsByDate={eventsByDate}
          onPrev={prevWeek}
          onNext={nextWeek}
          onSelectEvent={setSelectedEvent}
        />
      )}
      {view === "list" && (
        <div className="overflow-x-auto">
          <ListView events={filtered} onSelectEvent={setSelectedEvent} />
        </div>
      )}

      <EventDetail
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}
