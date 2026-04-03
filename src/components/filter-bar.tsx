"use client";

import { Button } from "@/components/ui/button";
import { COUNTRY_CONFIG, IMPORTANCE_CONFIG } from "@/lib/constants";
import type { Country, Importance } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  countries: Set<Country>;
  importances: Set<Importance>;
  toggleCountry: (c: Country) => void;
  toggleImportance: (i: Importance) => void;
}

export function FilterBar({
  countries,
  importances,
  toggleCountry,
  toggleImportance,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-medium text-muted-foreground mr-1">
          국가
        </span>
        {(Object.entries(COUNTRY_CONFIG) as [Country, (typeof COUNTRY_CONFIG)[Country]][]).map(
          ([code, cfg]) => (
            <Button
              key={code}
              size="sm"
              variant="outline"
              onClick={() => toggleCountry(code)}
              className={cn(
                "h-7 text-xs gap-1",
                countries.has(code) && `${cfg.bg} ${cfg.border} ${cfg.color}`,
              )}
            >
              {cfg.flag} {code}
            </Button>
          ),
        )}
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-medium text-muted-foreground mr-1">
          중요도
        </span>
        {(Object.entries(IMPORTANCE_CONFIG) as [Importance, (typeof IMPORTANCE_CONFIG)[Importance]][]).map(
          ([level, cfg]) => (
            <Button
              key={level}
              size="sm"
              variant="outline"
              onClick={() => toggleImportance(level)}
              className={cn(
                "h-7 text-xs",
                importances.has(level) && `${cfg.bg} ${cfg.color}`,
              )}
            >
              {cfg.label}
            </Button>
          ),
        )}
      </div>
    </div>
  );
}
