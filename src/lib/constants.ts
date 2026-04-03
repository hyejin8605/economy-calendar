import type { Country, Importance } from "./types";

export const COUNTRY_CONFIG: Record<
  Country,
  { label: string; flag: string; color: string; bg: string; border: string }
> = {
  KR: {
    label: "한국",
    flag: "🇰🇷",
    color: "text-blue-700",
    bg: "bg-blue-100",
    border: "border-blue-300",
  },
  US: {
    label: "미국",
    flag: "🇺🇸",
    color: "text-yellow-700",
    bg: "bg-yellow-100",
    border: "border-yellow-300",
  },
  BR: {
    label: "브라질",
    flag: "🇧🇷",
    color: "text-green-700",
    bg: "bg-green-100",
    border: "border-green-300",
  },
};

export const IMPORTANCE_CONFIG: Record<
  Importance,
  { label: string; color: string; bg: string; border: string }
> = {
  high: { label: "High", color: "text-red-700", bg: "bg-red-100", border: "border-red-300" },
  medium: { label: "Medium", color: "text-orange-700", bg: "bg-orange-100", border: "border-orange-300" },
  low: { label: "Low", color: "text-gray-600", bg: "bg-gray-100", border: "border-gray-300" },
};

export const DAYS_KO = ["일", "월", "화", "수", "목", "금", "토"];
