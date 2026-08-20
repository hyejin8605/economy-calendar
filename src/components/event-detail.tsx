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
      <DialogContent className="flex w-[92vw] max-w-[900px] sm:max-w-[900px] max-h-[85vh] flex-col overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle className="pr-8 text-lg leading-snug break-words">
            {country.flag} {event.event}
          </DialogTitle>
        </DialogHeader>
        <div className="min-h-0 flex-1 space-y-4 overflow-x-hidden overflow-y-auto">
          <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
            <span className="min-w-0 truncate">
              {event.date} {event.time && `${event.time}`}
            </span>
            <Badge
              className={`${imp.bg} ${imp.color} shrink-0 whitespace-nowrap border-0`}
            >
              {imp.label}
            </Badge>
          </div>

          {event.period && (
            <div className="text-sm">
              <span className="text-muted-foreground">Period:</span>{" "}
              {event.period}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {dataFields.map((f) => (
              <div
                key={f.label}
                className="rounded-lg border p-3 text-center"
              >
                <div className="text-xs text-muted-foreground mb-1">
                  {f.label}
                </div>
                <div className="font-semibold text-sm break-words">
                  {formatValue(f.value)}
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs text-muted-foreground border-t pt-3 break-words">
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
