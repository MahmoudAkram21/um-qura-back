/**
 * Date formatting utilities for calendar display.
 * Uses current year when formatting date ranges.
 */

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * Format a date as ISO date string (YYYY-MM-DD) for API responses.
 */
export function formatDateForApi(date: Date): string {
  return date.toISOString().split("T")[0]!;
}

/**
 * Format date range for display: "18 October - 30 October"
 * Uses the year from the start date (or current year for display consistency).
 */
export function formatDateRange(startDate: Date, endDate: Date): string {
  const startDay = startDate.getDate();
  const startMonth = MONTH_NAMES[startDate.getMonth()];
  const endDay = endDate.getDate();
  const endMonth = MONTH_NAMES[endDate.getMonth()];
  if (startMonth === endMonth) {
    return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
  }
  return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
}
