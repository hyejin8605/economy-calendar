"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { COUNTRY_CONFIG, IMPORTANCE_CONFIG } from "@/lib/constants";
import type { EconomicEvent } from "@/lib/types";

function formatValue(v: number | string | null) {
  if (v === null || v === undefined) return "—";
  if (typeof v === "number") {
    if (Math.abs(v) >= 1e9) return `${(v / 1e9).toFixed(2)}B`;
    if (Math.abs(v) >= 1e6) return `${(v / 1e6).toFixed(2)}M`;
    if (Math.abs(v) >= 1e3 && Number.isInteger(v / 1000))
      return `${(v / 1e3).toFixed(1)}K`;
    return v.toLocaleString();
  }
  return String(v);
}

interface EventDetailProps {
  event: EconomicEvent | null;
  onClose: () => void;
}

export function EventDetail({ event, onClose }: EventDetailProps) {
  if (!event) return null;
  const country = COUNTRY_CONFIG[event.country];
  const imp = IMPORTANCE_CONFIG[event.importance];

  const dataFields = [
    { label: "Survey", value: event.survey },
    { label: "Actual", value: event.actual },
    { label: "Prior", value: event.prior },
    { label: "Revised", value: event.revised },
  ];

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg leading-snug">
            {country.flag} {event.event}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              {event.date} {event.time && `${event.time}`}
            </span>
            <Badge className={`${imp.bg} ${imp.color} border-0`}>
              {imp.label}
            </Badge>
          </div>

          {event.period && (
            <div className="text-sm">
              <span className="text-muted-foreground">Period:</span>{" "}
              {event.period}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {dataFields.map((f) => (
              <div
                key={f.label}
                className="rounded-lg border p-3 text-center"
              >
                <div className="text-xs text-muted-foreground mb-1">
                  {f.label}
                </div>
                <div className="font-semibold text-sm">
                  {formatValue(f.value)}
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs text-muted-foreground border-t pt-3">
            <span className="font-medium">Ticker:</span> {event.ticker}
            {event.relevance !== null && (
              <>
                {" · "}
                <span className="font-medium">Relevance:</span>{" "}
                {event.relevance}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
