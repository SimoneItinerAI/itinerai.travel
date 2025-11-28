import type { TripParams } from '../types/trip';

const STORAGE_KEY = 'itinerai:current-search-params';

export function parseSearchParams(): TripParams | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as TripParams;
    if (!data.destination || !data.startDate || !data.endDate || !data.days || !data.people) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function saveSearchParams(params: TripParams): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
  } catch (e) {
    console.warn('Failed to save search params', e);
  }
}

export function clearSearchParams(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear search params', e);
  }
}

export function calculateTripDuration(startDate: string, endDate: string): { nights: number; days: number } {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const days = nights + 1;
  return { nights, days };
}

export function formatDateRange(startDate: string, endDate: string, locale = 'it-IT'): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startFormatted = start.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
  const endFormatted = end.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
  return `${startFormatted} - ${endFormatted}`;
}
