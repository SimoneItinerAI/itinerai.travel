// TODO: sostituirò questa costante con il mio link affiliato reale di Skyscanner
const SKYSCANNER_BASE_URL =
  'https://www.skyscanner.it/trasporti/voli-da-__ORIGIN__-a-__DEST__/?adults=__PEOPLE__&outboundDate=__START__&inboundDate=__END__';

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
  const destSlug = encodeURIComponent(destination.trim());
  const originSlug = origin ? encodeURIComponent(origin.trim()) : '';
  const adults = typeof people === 'number' && people > 0 ? String(people) : '1';
  const start = startDate && startDate.length >= 10 ? startDate : '';
  const end = endDate && endDate.length >= 10 ? endDate : '';

  let url = SKYSCANNER_BASE_URL
    .replace('__DEST__', destSlug)
    .replace('__ORIGIN__', originSlug || 'ovunque')
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
