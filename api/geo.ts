import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const city = String(req.query.city || '').trim()
  if (!city) return res.status(400).json({ error: 'city required' })
  try {
    const params = new URLSearchParams({ q: city, format: 'json', limit: '1', 'accept-language': 'it' })
    const r = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`)
    if (!r.ok) return res.status(502).json({ error: 'geocode failed' })
    const arr = await r.json()
    const item = Array.isArray(arr) ? arr[0] : null
    if (!item) return res.status(404).json({ error: 'not found' })
    const data = { name: item.display_name ?? city, lat: parseFloat(item.lat), lon: parseFloat(item.lon) }
    return res.status(200).json(data)
  } catch {
    return res.status(500).json({ error: 'internal error' })
  }
}