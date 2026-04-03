"use client";

import type React from "react";
import { COUNTRY_CONFIG, IMPORTANCE_CONFIG } from "@/lib/constants";
import type { EconomicEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

const COUNTRY_TEXT_COLOR: Record<string, string> = {
  KR: COUNTRY_CONFIG.KR.color,
  US: COUNTRY_CONFIG.US.color,
  BR: COUNTRY_CONFIG.BR.color,
};

interface EventBadgeProps {
  event: EconomicEvent;
  compact?: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export function EventBadge({ event, compact, onClick }: EventBadgeProps) {
  const cfg = IMPORTANCE_CONFIG[event.importance];

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded px-1.5 py-0.5 text-xs overflow-hidden text-ellipsis border cursor-pointer transition-colors hover:opacity-80",
        cfg.bg,
        cfg.border,
        cfg.color,
      )}
      title={event.event}
    >
      <span className={cn("font-semibold", COUNTRY_TEXT_COLOR[event.country])}>
        {event.country}
      </span>
      {!compact && <span> {event.event}</span>}
    </button>
  );
}
