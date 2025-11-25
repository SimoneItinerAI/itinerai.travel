export interface CityPoi {
  id: string;
  name: string;
  lat: number;
  lon: number;
  category?: string;
  importance?: number;
  shortDescription?: string;
}

export type TripParams = {
  destination: string;
  startDate: string;
  endDate: string;
  days: number;
  people: number;
  budgetLevel?: 'low' | 'medium' | 'high';
};

export interface ItineraryDayItem {
  timeOfDay?: 'morning' | 'afternoon' | 'evening';
  description: string;
  poiId?: string;
}

export interface ItineraryDay {
  dayIndex: number;
  title: string;
  items: ItineraryDayItem[];
}

export interface Itinerary {
  params: TripParams;
  summaryTitle: string;
  summarySubtitle?: string;
  days: ItineraryDay[];
  poisUsed?: CityPoi[];
}
