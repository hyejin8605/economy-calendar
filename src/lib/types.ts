export interface EconomicEvent {
  date: string;
  time: string;
  country: "KR" | "US" | "BR";
  event: string;
  period: string | null;
  survey: number | string | null;
  actual: number | string | null;
  prior: number | string | null;
  revised: number | string | null;
  relevance: number | null;
  importance: "high" | "medium" | "low";
  ticker: string;
}

export type ViewMode = "month" | "week" | "list";
export type Country = "KR" | "US" | "BR";
export type Importance = "high" | "medium" | "low";
