const API_BASE = 'https://api.opentripmap.com/0.1/it/places';

function getKey(): string | undefined {
  return import.meta.env.VITE_OPENTRIPMAP_API_KEY as string | undefined;
}

export type Geocode = { name: string; lat: number; lon: number };
export type Poi = { xid: string; name: string; kinds?: string; desc?: string };

export async function geocodeCity(name: string): Promise<Geocode | null> {
  const key = getKey();
  if (!key) return null;
  const url = `${API_BASE}/geoname?name=${encodeURIComponent(name)}&apikey=${key}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  if (!data || typeof data.lat !== 'number' || typeof data.lon !== 'number') return null;
  return { name: data.name ?? name, lat: data.lat, lon: data.lon };
}

export async function listPOIs(lat: number, lon: number, radius = 10000, limit = 12): Promise<Poi[]> {
  const key = getKey();
  if (!key) return [];
  const params = new URLSearchParams({
    radius: String(radius),
    lon: String(lon),
    lat: String(lat),
    rate: '3',
    limit: String(limit),
    apikey: key,
  });
  const res = await fetch(`${API_BASE}/radius?${params.toString()}`);
  if (!res.ok) return [];
  const data = await res.json();
  const items = Array.isArray(data?.features) ? data.features : [];
  return items
    .map((f: any) => ({ xid: f.properties?.xid, name: f.properties?.name, kinds: f.properties?.kinds }))
    .filter((p: Poi) => p.xid && p.name);
}

export async function getPOIDetail(xid: string): Promise<Poi | null> {
  const key = getKey();
  if (!key) return null;
  const res = await fetch(`${API_BASE}/xid/${xid}?apikey=${key}`);
  if (!res.ok) return null;
  const d = await res.json();
  const desc = d?.wikipedia_extracts?.text || d?.info?.descr || undefined;
  return { xid, name: d?.name, kinds: d?.kinds, desc };
}