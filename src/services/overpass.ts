export type Attraction = { id: string; name: string; lat?: number; lon?: number };

type OverpassElement = {
  id: number | string;
  tags?: { name?: string };
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
};

export async function fetchAttractions(lat: number, lon: number, radius = 10000, limit = 12): Promise<Attraction[]> {
  const q = `
    [out:json][timeout:25];
    (
      node(around:${radius},${lat},${lon})["tourism"="attraction"];
      way(around:${radius},${lat},${lon})["tourism"="attraction"];
      relation(around:${radius},${lat},${lon})["tourism"="attraction"];
    );
    out center;
  `;
  const res = await fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: q });
  if (!res.ok) return [];
  const data = await res.json();
  const elements = Array.isArray(data?.elements) ? (data.elements as OverpassElement[]) : [];
  const list = elements.map((e: OverpassElement) => ({
    id: String(e.id),
    name: e?.tags?.name,
    lat: e?.lat ?? e?.center?.lat,
    lon: e?.lon ?? e?.center?.lon,
  }));

  const hasValidName = (
    a: { id: string; name?: string; lat?: number; lon?: number }
  ): a is Attraction => typeof a.name === 'string' && a.name.trim().length > 0;

  const filtered: Attraction[] = list
    .filter(hasValidName)
    .map((a) => ({ ...a, name: a.name!.trim() }));

  return filtered.slice(0, Math.max(0, limit));
}
