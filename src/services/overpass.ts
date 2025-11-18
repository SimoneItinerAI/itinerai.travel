export type Attraction = { id: string; name: string };

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
  const elements = Array.isArray(data?.elements) ? data.elements : [];
  const list = elements.map((e: any) => ({ id: String(e.id), name: e?.tags?.name })).filter((a: Attraction) => a.name);
  return list.slice(0, limit);
}