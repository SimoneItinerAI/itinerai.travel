export interface BaseItineraryContext {
  city: string;
  days?: number;
  guests?: number;
}

const bookingConfig = {
  baseUrl: import.meta.env.VITE_BOOKING_REF_BASE || "",
};

const airbnbConfig = {
  baseUrl: import.meta.env.VITE_AIRBNB_REF_BASE || "",
};

const gygConfig = {
  baseUrl: import.meta.env.VITE_GYG_REF_BASE || "",
};

const flightsConfig = {
  baseUrl: import.meta.env.VITE_FLIGHTS_REF_BASE || "",
};

export function buildBookingUrl(ctx: BaseItineraryContext): string {
  const { city } = ctx;
  if (!bookingConfig.baseUrl) return "";
  if (!city) return bookingConfig.baseUrl;
  return bookingConfig.baseUrl + encodeURIComponent(city);
}

export function buildAirbnbUrl(ctx: BaseItineraryContext): string {
  const { city } = ctx;
  if (!airbnbConfig.baseUrl) return "";
  if (!city) return airbnbConfig.baseUrl;
  return airbnbConfig.baseUrl + encodeURIComponent(city);
}

export function buildGetYourGuideUrl(ctx: BaseItineraryContext): string {
  const { city, days, guests } = ctx;
  if (!gygConfig.baseUrl) return "";
  const parts: string[] = [];
  if (city) parts.push(city);
  if (typeof days === 'number' && days > 0) parts.push(days === 1 ? '1 giorno' : `${days} giorni`);
  if (typeof guests === 'number' && guests > 0) parts.push(guests === 1 ? 'per 1 persona' : `per ${guests} persone`);
  if (parts.length === 0) return gygConfig.baseUrl;
  return gygConfig.baseUrl + encodeURIComponent(parts.join(' '));
}

export function buildFlightsUrl(ctx: BaseItineraryContext): string {
  const { city } = ctx;
  if (!flightsConfig.baseUrl) return "";
  if (!city) return flightsConfig.baseUrl;
  return flightsConfig.baseUrl + encodeURIComponent(city);
}

