import type { VercelRequest, VercelResponse } from '@vercel/node'

type Wiki = { title?: string; description?: string; extract?: string; thumbnailUrl?: string; pageUrl?: string }
type Attr = { id: string; name: string; lat?: number; lon?: number; wiki?: Wiki }

type OverpassElement = {
  id: number | string
  tags?: { name?: string }
  lat?: number
  lon?: number
  center?: { lat: number; lon: number }
}

const cache = new Map<string, { ts: number; data: Attr[] }>()
const TTL = 1000 * 60 * 30

async function geocode(city: string) {
  const params = new URLSearchParams({ q: city, format: 'json', limit: '1', 'accept-language': 'it' })
  const r = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`)
  if (!r.ok) return null
  const arr = await r.json()
  const item = Array.isArray(arr) ? arr[0] : null
  if (!item) return null
  return { name: item.display_name ?? city, lat: parseFloat(item.lat), lon: parseFloat(item.lon) }
}

async function overpass(lat: number, lon: number, radius: number, limit: number) {
  const q = `
    [out:json][timeout:25];
    (
      node(around:${radius},${lat},${lon})["tourism"="attraction"];
      way(around:${radius},${lat},${lon})["tourism"="attraction"];
      relation(around:${radius},${lat},${lon})["tourism"="attraction"];
    );
    out center;
  `
  const r = await fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: q })
  if (!r.ok) return []
  const data = await r.json()
  const elements = Array.isArray(data?.elements) ? (data.elements as OverpassElement[]) : []
  const list: Attr[] = elements
    .map((e: OverpassElement) => ({ id: String(e.id), name: e?.tags?.name, lat: e?.lat ?? e?.center?.lat, lon: e?.lon ?? e?.center?.lon }))
    .filter((a) => a.name)
  return list.slice(0, limit)
}

async function enrichWiki(a: Attr, lang = 'it'): Promise<Attr> {
  let wiki: Wiki | undefined
  try {
    const t = encodeURIComponent(a.name)
    const sRes = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${t}`)
    if (sRes.ok) {
      const s = await sRes.json()
      wiki = { title: s?.title, description: s?.description, extract: s?.extract, thumbnailUrl: s?.thumbnail?.source, pageUrl: s?.content_urls?.desktop?.page }
    } else if (a.lat && a.lon) {
      const params = new URLSearchParams({ action: 'query', format: 'json', origin: '*', list: 'geosearch', gscoord: `${a.lat}|${a.lon}`, gsradius: '1000', gslimit: '1' })
      const gsRes = await fetch(`https://${lang}.wikipedia.org/w/api.php?${params.toString()}`)
      if (gsRes.ok) {
        const gs = await gsRes.json()
        const title = gs?.query?.geosearch?.[0]?.title
        if (title) {
          const s2Res = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`)
          if (s2Res.ok) {
            const s2 = await s2Res.json()
            wiki = { title: s2?.title, description: s2?.description, extract: s2?.extract, thumbnailUrl: s2?.thumbnail?.source, pageUrl: s2?.content_urls?.desktop?.page }
          }
        }
      }
    }
  } catch { void 0 }
  return { ...a, wiki }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const city = String(req.query.city || '').trim()
  const radius = parseInt(String(req.query.radius || '10000'))
  const limit = parseInt(String(req.query.limit || '12'))
  let lat = req.query.lat ? parseFloat(String(req.query.lat)) : undefined
  let lon = req.query.lon ? parseFloat(String(req.query.lon)) : undefined

  if (city && (!lat || !lon)) {
    const g = await geocode(city)
    if (!g) return res.status(404).json({ error: 'city not found' })
    lat = g.lat
    lon = g.lon
  }
  if (lat === undefined || lon === undefined) return res.status(400).json({ error: 'lat/lon or city required' })

  const key = `a:${city}:${lat}:${lon}:${radius}:${limit}`
  const hit = cache.get(key)
  if (hit && Date.now() - hit.ts < TTL) return res.status(200).json(hit.data)

  try {
    const base = await overpass(lat, lon, radius, limit)
    const enriched = await Promise.all(base.map((a) => enrichWiki(a)))
    cache.set(key, { ts: Date.now(), data: enriched })
    return res.status(200).json(enriched)
  } catch {
    return res.status(502).json({ error: 'upstream error' })
  }
}
