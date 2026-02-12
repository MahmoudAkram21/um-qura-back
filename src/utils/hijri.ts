/**
 * Hijri date utilities: current Hijri date and Arabic month names.
 * Uses hijri-converter (Umm al-Qura) for Gregorian <-> Hijri.
 */
import { toHijri } from "hijri-converter";

export interface HijriDate {
  year: number;
  month: number; // 1-12
  day: number;
}

/** Get today's date in Hijri (local date, then convert). */
export function getCurrentHijri(): HijriDate {
  const now = new Date();
  const gy = now.getFullYear();
  const gm = now.getMonth() + 1; // 1-12
  const gd = now.getDate();
  const { hy, hm, hd } = toHijri(gy, gm, gd);
  return { year: hy, month: hm, day: hd };
}

/** Next Hijri month (1-12, wraps to 1 after 12). */
export function nextHijriMonth(month: number): number {
  return month >= 12 ? 1 : month + 1;
}

/** Arabic names for Hijri months (1 = Muharram, 12 = Dhu al-Hijjah). */
export const HIJRI_MONTH_NAMES_AR: Record<number, string> = {
  1: "محرم",
  2: "صفر",
  3: "ربيع الأول",
  4: "ربيع الآخر",
  5: "جمادى الأولى",
  6: "جمادى الآخرة",
  7: "رجب",
  8: "شعبان",
  9: "رمضان",
  10: "شوال",
  11: "ذو القعدة",
  12: "ذو الحجة",
};

export function getHijriMonthNameAr(month: number): string {
  return HIJRI_MONTH_NAMES_AR[month] ?? String(month);
}

/** Format Hijri date for display: e.g. "10 ذو الحجة" */
export function formatHijriDateAr(day: number, month: number): string {
  return `${day} ${getHijriMonthNameAr(month)}`;
}
