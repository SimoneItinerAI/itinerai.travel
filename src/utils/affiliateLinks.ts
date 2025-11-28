const SKYSCANNER_BASE_URL =
  (import.meta.env.VITE_FLIGHTS_REF_BASE as string | undefined) ??
  'https://www.skyscanner.it/trasporti/voli-da-__ORIGIN__-a-__DEST__/?adults=__PEOPLE__&outboundDate=__START__&inboundDate=__END__';

const DEST_IATA: Record<string, string> = {
  roma: 'FCO',
  milano: 'MXP',
  venezia: 'VCE',
  napoli: 'NAP',
  torino: 'TRN',
  bologna: 'BLQ',
  pisa: 'PSA',
  palermo: 'PMO',
  cagliari: 'CAG',
  catania: 'CTA',
  firenze: 'FLR',
  praga: 'PRG',
  parigi: 'CDG',
  londra: 'LHR',
  barcellona: 'BCN',
  madrid: 'MAD',
  berlino: 'BER',
  lisbona: 'LIS',
  amsterdam: 'AMS',
  vienna: 'VIE',
  budapest: 'BUD',
  atene: 'ATH',
  dublino: 'DUB',
  varsavia: 'WAW',
  bruxelles: 'BRU',
};

function resolveIata(input: string): string | null {
  const v = input.trim();
  const code = v.toUpperCase();
  if (/^[A-Z]{3}$/.test(code)) return code;
  const key = v.toLowerCase();
  return DEST_IATA[key] ?? null;
}

export function buildSkyscannerUrl({
  destination,
  startDate,
  endDate,
  people,
  origin,
}: {
  destination: string;
  startDate?: string;
  endDate?: string;
  people?: number;
  origin?: string;
}): string {
  const destCode = resolveIata(destination);
  const originCode = origin ? resolveIata(origin) : null;
  const adults = typeof people === 'number' && people > 0 ? String(people) : '1';
  const start = startDate && startDate.length >= 10 ? startDate : '';
  const end = endDate && endDate.length >= 10 ? endDate : '';

  if (!originCode || !destCode) {
    return '';
  }

  const hasPlaceholders = SKYSCANNER_BASE_URL.includes('__DEST__') || SKYSCANNER_BASE_URL.includes('__ORIGIN__');
  const template = hasPlaceholders
    ? SKYSCANNER_BASE_URL
    : 'https://www.skyscanner.it/transport/flights/__ORIGIN__/__DEST__/?adults=__PEOPLE__&outboundDate=__START__&inboundDate=__END__';

  let url = template
    .replace('__DEST__', encodeURIComponent(destCode))
    .replace('__ORIGIN__', encodeURIComponent(originCode))
    .replace('__PEOPLE__', adults)
    .replace('__START__', start)
    .replace('__END__', end);

  // Pulisci query se mancano date
  if (!start) {
    url = url.replace('&outboundDate=__START__', '');
  }
  if (!end) {
    url = url.replace('&inboundDate=__END__', '');
  }
  return url;
}
