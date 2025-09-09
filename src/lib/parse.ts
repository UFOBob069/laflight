import { z } from 'zod';
import * as cheerio from 'cheerio';
import qp from 'quoted-printable';
import iconv from 'iconv-lite';

const Deal = z.object({
  origin: z.string().min(2),             // e.g., LAX (fallbacks to route codes)
  destination: z.string().min(2),        // e.g., BCN (fallbacks to route codes)
  price: z.number().int().positive().optional(),
  currency: z.literal('USD').default('USD'),
  dates: z.string().optional().default(''),
  link: z.union([z.string().url(), z.literal('')]).optional(),
  airline: z.string().optional(),
  stops: z.string().optional(),
  route: z.string().optional(),
  duration: z.string().optional(),
  discount: z.string().optional(),       // e.g., "SAVE 16%"
});
export type DealT = z.infer<typeof Deal>;

/** Heuristic: if HTML looks quoted-printable, decode it. */
function maybeDecodeQuotedPrintable(input: string): string {
  const looksQP = /=3D|=\r?\n/.test(input);
  if (!looksQP) return input;
  try {
    const buf = qp.decode(input);             // Buffer
    return iconv.decode(buf, 'utf-8');
  } catch {
    return input;
  }
}

function getText($: cheerio.CheerioAPI, el?: cheerio.Element | null): string {
  if (!el) return '';
  return ($(el).text() || '').replace(/\s+/g, ' ').trim();
}

function splitByDot(text: string): string[] {
  // Google uses U+00B7 "·" separators. Handle normal hyphens/dashes too.
  return text.split('·').map(s => s.trim()).filter(Boolean);
}

function cleanPriceToNumber(txt?: string): number | undefined {
  if (!txt) return;
  const m = txt.match(/\$([\d,]+)/);
  if (!m) return;
  return Number(m[1].replace(/,/g, ''));
}

// 1) Find the outer "card" container that wraps date+price, view button, and flight row
function getCardContainer($: cheerio.CheerioAPI, dateTd: cheerio.Element): cheerio.Cheerio<cheerio.Element> {
  const $date = $(dateTd);

  // Prefer nearest ancestor <table> whose class includes "broadIntentMarketContentDiscountedMdp"
  const $tables = $date.parents('table');
  const $containerByClass = $tables.filter((_, t) => (t.attribs?.class || '').includes('broadIntentMarketContentDiscountedMdp')).first();
  if ($containerByClass.length) return $containerByClass;

  // Fallback: climb to the TR that contains the left TD (date/price) and the right TD (View),
  // then take that TR's parent table as the "container".
  const $outerTr =
    $date.closest('tr')             // date row inside tiny inner table
         .closest('table')          // the tiny inner table
         .closest('td')             // left cell
         .closest('tr');            // outer row that also has the right cell with the View btn
  if ($outerTr.length) return $outerTr.closest('table');

  // Last resort: the closest table around the date cell
  return $date.closest('table');
}

// 2) CTA (View) link — look inside the card container first, then nearby siblings
function findCtaForDateRow($: cheerio.CheerioAPI, dateTd: cheerio.Element): string | undefined {
  const $container = getCardContainer($, dateTd);

  // Primary: explicit "view-btn" anchor within the same card container
  let href = $container.find('a[class*="view-btn"]').first().attr('href');
  if (href) return href;

  // Secondary: any c.gle tracking link inside the container
  href = $container.find('a[href*="https://c.gle/"]').first().attr('href');
  if (href) return href;

  // Tertiary: scan a few following sibling rows in case of slight template drift
  let $sib = $container.next();
  for (let i = 0; i < 6 && $sib.length; i++) {
    if ($sib.find('td[class*="date-pair"]').length) break; // stop at next card
    const $a = $sib.find('a[class*="view-btn"], a[href*="https://c.gle/"]').first();
    if ($a.length) return $a.attr('href')!;
    $sib = $sib.next();
  }
  return undefined;
}

// 3) Price + discount — read them from within the same card container
function findPriceNearDate(
  $: cheerio.CheerioAPI,
  dateTd: cheerio.Element
): { price?: number; raw?: string; discount?: string } {
  const $container = getCardContainer($, dateTd);

  // Prefer an explicit "price" span inside this card
  const $priceSpan = $container.find('span[class*="price"]').filter((_, el) => /\$\d/.test($(el).text())).first();
  if ($priceSpan.length) {
    const raw = ($priceSpan.text() || '').replace(/\s+/g, ' ').trim();     // e.g., "From $618"
    const m = raw.match(/\$([\d,]+)/);
    const price = m ? Number(m[1].replace(/,/g, '')) : undefined;

    let discount: string | undefined;
    const $badge = $container.find('span[class*="badge"]').first();         // e.g., "SAVE 16%"
    if ($badge.length) {
      discount = ($badge.text() || '').replace(/\s+/g, ' ').trim();
    } else {
      const txt = $container.text();
      const dm = txt.match(/SAVE\s+(\d+)%/i);
      if (dm) discount = `SAVE ${dm[1]}%`;
    }
    return { price, raw, discount };
  }

  // Fallback: scan container text
  const txt = $container.text();
  const m = txt.match(/From\s+\$([\d,]+)/i);
  if (m) {
    const price = Number(m[1].replace(/,/g, ''));
    const dm = txt.match(/SAVE\s+(\d+)%/i);
    return { price, raw: `From $${m[1]}`, discount: dm ? `SAVE ${dm[1]}%` : undefined };
  }
  return {};
}

// 4) Flight row — lives inside the same card container, usually as <tr class="flight">
function findFlightRowAfterDate($: cheerio.CheerioAPI, dateTd: cheerio.Element) {
  const $container = getCardContainer($, dateTd);

  // Primary: explicit row with class "flight"
  let $row = $container.find('tr.flight').first();
  if ($row.length) return $row;

  // Secondary: any row within container that looks like "Airline · Nonstop · LAX–BCN · 12 hr"
  $row = $container.find('tr').filter((_, tr) => {
    const t = ($(tr).text() || '').replace(/\s+/g, ' ');
    return /·/.test(t) && /[A-Z]{3}\s*[–-]\s*[A-Z]{3}/.test(t);
  }).first();
  return $row.length ? $row : null;
}

function parseFlightBlob(text: string) {
  // Expected: "Iberia · Nonstop · LAX–BCN · 12 hr"
  const parts = splitByDot(text);
  let airline: string | undefined;
  let stops: string | undefined;
  let route: string | undefined;
  let duration: string | undefined;

  if (parts.length >= 1) airline = parts[0];
  if (parts.length >= 2) stops = parts[1];
  if (parts.length >= 3) route = parts[2].replace(/\s*-\s*/g, '–'); // normalize hyphen to en-dash
  if (parts.length >= 4) duration = parts[3].toLowerCase();

  // basic cleanup
  if (stops) {
    const m = stops.match(/(Nonstop|\d+\s*stop)/i);
    if (m) stops = m[1].replace(/\s+/g, ' ').trim();
  }
  if (route && !/[A-Z]{3}\s*–\s*[A-Z]{3}/.test(route)) {
    const m = route.match(/([A-Z]{3})\s*[–-]\s*([A-Z]{3})/);
    if (m) route = `${m[1]}–${m[2]}`;
  }
  if (duration) {
    const m = duration.match(/(\d+\s*hr(?:\s*\d*\s*min)?)/i);
    if (m) duration = m[1].toLowerCase();
  }

  return { airline, stops, route, duration };
}

function deriveOriginDest(
  subjectOrigin: string | undefined,
  subjectDest: string | undefined,
  route?: string
): { origin: string; destination: string } {
  // Prefer airport codes in route (e.g., LAX–BCN). Otherwise fallback to subject.
  if (route) {
    const m = route.match(/([A-Z]{3})\s*–\s*([A-Z]{3})/);
    if (m) return { origin: m[1], destination: m[2] };
    const m2 = route.match(/([A-Z]{3})\s*-\s*([A-Z]{3})/);
    if (m2) return { origin: m2[1], destination: m2[2] };
  }
  const origin = (subjectOrigin || 'UNK').trim();
  const destination = (subjectDest || 'UNK').trim();
  return { origin, destination };
}

function extractDealFromDateRow(
  $: cheerio.CheerioAPI,
  dateTd: cheerio.Element,
  subjectOrigin?: string,
  subjectDestination?: string
): DealT {
  const dates = getText($, dateTd);
  console.log('📅 Processing dates:', dates);

  // Price + discount near the date row
  const { price, discount } = findPriceNearDate($, dateTd);
  console.log('💰 Found price:', price, 'discount:', discount);

  // Flight details row
  const flightRow = findFlightRowAfterDate($, dateTd);
  const flightText = flightRow ? getText($, flightRow.get(0)) : '';
  console.log('✈️ Flight text:', flightText);
  const { airline, stops, route, duration } = parseFlightBlob(flightText);
  console.log('✈️ Parsed flight details:', { airline, stops, route, duration });

  // Booking link (View)
  const ctaRaw = findCtaForDateRow($, dateTd);
  const link = ctaRaw ? decodeURIComponent(ctaRaw) : '';
  console.log('🔗 Booking link:', link);

  // Origin/Dest
  const { origin, destination } = deriveOriginDest(subjectOrigin, subjectDestination, route);

  const deal: DealT = {
    origin,
    destination,
    price,
    currency: 'USD',
    dates,
    link,
    airline,
    stops,
    route,
    duration,
    discount
  };

  console.log('✈️ Final deal:', deal);
  return deal;
}

export function parseDealEmail(subject: string, html?: string, text?: string): DealT[] {
  console.log('🔍 Parsing email. Subject:', subject.slice(0, 120));

  // Try to parse origin/destination from subject if present
  // Example pattern (optional): "Your tracked route: <origin> to <destination> flights"
  const subjectRoute = subject.match(/Your tracked route:\s*(.*?)\s+to\s+(.*?)\s+flights/i);
  const subjectOrigin = subjectRoute?.[1]?.trim();
  const subjectDestination = subjectRoute?.[2]?.trim();

  const deals: DealT[] = [];

  // Prefer HTML parsing
  if (html && html.trim()) {
    const decoded = maybeDecodeQuotedPrintable(html);
    const $ = cheerio.load(decoded);

    // Debug: Log some HTML structure
    console.log('🔍 HTML structure sample:');
    console.log('🔍 First 1000 chars:', decoded.substring(0, 1000));
    
    // Each option is anchored by a td.date-pair
    const dateRows = $('td[class*="date-pair"]');
    console.log('📅 date rows found:', dateRows.length);
    
    // Debug: Log the first date row structure
    if (dateRows.length > 0) {
      const firstDateRow = dateRows.first();
      console.log('🔍 First date row HTML:', $.html(firstDateRow));
      console.log('🔍 Parent table structure:', $.html(firstDateRow.closest('table')));
    }

    dateRows.each((_, dateTd) => {
      try {
        const deal = extractDealFromDateRow($, dateTd, subjectOrigin, subjectDestination);

        // Validate (and keep EVERYTHING). If origin/dest are still empty, set to UNK.
        const safeDeal = Deal.parse({
          ...deal,
          origin: deal.origin && deal.origin.length >= 2 ? deal.origin : 'UNK',
          destination: deal.destination && deal.destination.length >= 2 ? deal.destination : 'UNK'
        });

        deals.push(safeDeal);
      } catch (e) {
        console.warn('⚠️ Failed to parse a deal row:', e);
        // KEEP ALL OPTIONS: push a minimal-but-valid placeholder if needed
        const fallback: DealT = {
          origin: subjectOrigin || 'UNK',
          destination: subjectDestination || 'UNK',
          dates: getText($, dateTd),
          currency: 'USD',
          link: ''
        };
        const safe = Deal.parse(fallback);
        deals.push(safe);
      }
    });
  } else if (text && text.trim()) {
    // Lightweight text fallback (keeps options but less structured)
    const t = text;
    const datePattern = /([A-Z][a-z]{2},?\s+[A-Z][a-z]{2}\s+\d{1,2})\s*[–-]\s*([A-Z][a-z]{2},?\s+[A-Z][a-z]{2}\s+\d{1,2})/g;
    const matches = [...t.matchAll(datePattern)];
    for (const m of matches) {
      const dates = `${m[1]} – ${m[2]}`;
      const after = t.slice((m.index ?? 0) + m[0].length);
      const priceM = after.match(/From\s+\$([\d,]+)/i);
      const price = priceM ? Number(priceM[1].replace(/,/g, '')) : undefined;
      const discM = after.match(/SAVE\s+(\d+)%/i);
      const discount = discM ? `SAVE ${discM[1]}%` : undefined;

      // try to find route codes (e.g., LAX–BCN) nearby
      const routeM = after.match(/([A-Z]{3})\s*[–-]\s*([A-Z]{3})/);
      const route = routeM ? `${routeM[1]}–${routeM[2]}` : undefined;
      const { origin, destination } = deriveOriginDest(subjectOrigin, subjectDestination, route);

      const linkM = after.match(/https:\/\/c\.gle\/[A-Za-z0-9_-]+/);
      const link = linkM ? decodeURIComponent(linkM[0]) : '';

      deals.push(Deal.parse({
        origin,
        destination,
        price,
        currency: 'USD',
        dates,
        link,
        route,
        discount
      }));
    }
  }

  console.log('📊 Total deals created:', deals.length);
  return deals;
}
