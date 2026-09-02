/**
 * Date utilities for PG Bill Generator
 */

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

/**
 * Format date as "02 September 2026"
 */
export function formatSystemDate(date: Date = new Date()): string {
  const day = String(date.getDate()).padStart(2, "0");
  const monthName = MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${monthName} ${year}`;
}

/**
 * Month list for dropdown selection
 */
export const PAYMENT_MONTHS = MONTHS;

/**
 * Current month name
 */
export function getCurrentMonthName(): string {
  return MONTHS[new Date().getMonth()];
}

/**
 * Current year
 */
export function getCurrentYear(): number {
  return new Date().getFullYear();
}

/**
 * Generate year range from current - 2 to current + 5
 */
export function getAvailableYears(): number[] {
  const current = getCurrentYear();
  const years: number[] = [];
  for (let y = current - 2; y <= current + 5; y++) {
    years.push(y);
  }
  return years;
}
