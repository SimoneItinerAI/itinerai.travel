export type Geocode = { name: string; lat: number; lon: number };

export async function geocodeCity(name: string): Promise<Geocode | null> {
  const params = new URLSearchParams({ q: name, format: 'json', limit: '1', 'accept-language': 'it' });
  const res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`);
  if (!res.ok) return null;
  const arr = await res.json();
  const item = Array.isArray(arr) ? arr[0] : null;
  if (!item) return null;
  return { name: item.display_name ?? name, lat: parseFloat(item.lat), lon: parseFloat(item.lon) };
}