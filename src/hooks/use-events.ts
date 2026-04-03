"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Country, EconomicEvent, Importance } from "@/lib/types";

export function useEvents() {
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [countries, setCountries] = useState<Set<Country>>(
    new Set(["KR", "US", "BR"]),
  );
  const [importances, setImportances] = useState<Set<Importance>>(
    new Set(["high", "medium", "low"]),
  );

  useEffect(() => {
    fetch("/data/events.json")
      .then((r) => r.json())
      .then(setEvents);
  }, []);

  const filtered = useMemo(
    () =>
      events.filter(
        (e) => countries.has(e.country) && importances.has(e.importance),
      ),
    [events, countries, importances],
  );

  const eventsByDate = useMemo(() => {
    const map = new Map<string, EconomicEvent[]>();
    for (const e of filtered) {
      const arr = map.get(e.date);
      if (arr) arr.push(e);
      else map.set(e.date, [e]);
    }
    return map;
  }, [filtered]);

  const toggleCountry = useCallback((c: Country) => {
    setCountries((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  }, []);

  const toggleImportance = useCallback((i: Importance) => {
    setImportances((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }, []);

  return {
    filtered,
    eventsByDate,
    countries,
    importances,
    toggleCountry,
    toggleImportance,
  };
}
