/**
 * Types for Stars API responses and payloads.
 */

export interface StarCalendarItem {
  id: number;
  name: string;
  date_range: string;
  start_date: string;
  end_date: string;
  description: string | null;
  agricultural_info: string[];
  weather_info: string | null;
  tips: string[];
}

export interface SeasonCalendarItem {
  id: number;
  season_name: string;
  duration: string;
  color_hex: string;
  icon_name: string;
  stars: StarCalendarItem[];
}

export type CalendarResponse = SeasonCalendarItem[];
