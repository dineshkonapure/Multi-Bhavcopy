export const HOLIDAYS: Record<number, Set<string>> = {
  2025: new Set([
    '2025-02-26', '2025-03-14', '2025-03-31', '2025-04-10', '2025-04-14', '2025-04-18',
    '2025-05-01', '2025-08-15', '2025-08-27', '2025-10-02', '2025-10-21', '2025-10-22',
    '2025-11-05', '2025-12-25'
  ]),
  2026: new Set([])
};

export const HOLIDAY_NAMES: Record<string, string> = {
  '2025-10-21': 'Diwali (Laxmi Pujan)',
  '2025-10-22': 'Diwali-Balipratipada',
  '2025-04-10': 'Mahavir Jayanti',
  '2025-04-18': 'Good Friday',
  '2025-12-25': 'Christmas',
  '2025-02-26': 'Mahashivratri',
  '2025-03-14': 'Holi',
  '2025-03-31': 'Id-Ul-Fitr',
  '2025-04-14': 'Dr. Baba Saheb Ambedkar Jayanti',
  '2025-05-01': 'Maharashtra Day',
  '2025-08-15': 'Independence Day',
  '2025-08-27': 'Ganesh Chaturthi',
  '2025-10-02': 'Mahatma Gandhi Jayanti',
  '2025-11-05': 'Diwali-Balipratipada',
};

export const pad = (n: number): string => (n < 10 ? '0' : '') + n;

export const ymd = (d: Date): string => 
  d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());

export const dmy2 = (d: Date): string => 
  pad(d.getDate()) + pad(d.getMonth() + 1) + String(d.getFullYear()).slice(2);

export const yyyy_mm_dd = (d: Date): string => 
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const fmtHuman = (d: Date): string => 
  new Intl.DateTimeFormat('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit' }).format(d);

export const inIST = (date: Date = new Date()): Date => 
  new Date(new Date(date).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

export const isHoliday = (d: Date): boolean => {
  const s = yyyy_mm_dd(d);
  const set = HOLIDAYS[d.getFullYear()];
  return !!(set && set.has(s));
};

export const holidayName = (d: Date): string => HOLIDAY_NAMES[yyyy_mm_dd(d)] || '';

export const isWeekend = (d: Date): boolean => d.getDay() === 0 || d.getDay() === 6;

export const isFuture = (d: Date): boolean => {
  const t = inIST();
  const today = new Date(t.getFullYear(), t.getMonth(), t.getDate());
  return d > today;
};

export const isMarketDay = (d: Date): boolean => !isWeekend(d) && !isHoliday(d);

export const isMarketDayNoFuture = (d: Date): boolean => isMarketDay(d) && !isFuture(d);

export const nextMktDay = (d: Date): Date => {
  const x = new Date(d);
  do {
    x.setDate(x.getDate() + 1);
  } while (!isMarketDay(x));
  return x;
};

export const prevMktDay = (d: Date): Date => {
  const x = new Date(d);
  do {
    x.setDate(x.getDate() - 1);
  } while (!isMarketDay(x));
  return x;
};

export const buildUrls = (d: Date): string[] => [
  `https://nsearchives.nseindia.com/content/cm/BhavCopy_NSE_CM_0_0_0_${ymd(d)}_F_0000.csv.zip`,
  `https://www.bseindia.com/download/BhavCopy/Equity/BhavCopy_BSE_CM_0_0_0_${ymd(d)}_F_0000.csv`,
  `https://archives.nseindia.com/archives/equities/bhavcopy/pr/PR${dmy2(d)}.zip`
];

export const sameDay = (a: Date | null, b: Date | null): boolean => 
  !!(a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate());

export const inRange = (d: Date, s: Date | null, e: Date | null): boolean => {
  if (!s || !e) return false;
  const a = s < e ? s : e;
  const b = s < e ? e : s;
  const t = d.getTime();
  return t > a.getTime() && t < b.getTime();
};

export const monthCells = (y: number, m: number): Date[] => {
  const first = new Date(y, m, 1);
  const startDow = first.getDay();
  const start = new Date(y, m, 1 - startDow);
  const arr: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    arr.push(d);
  }
  return arr;
};

export const statusText = (d: Date): string => {
  const date = fmtHuman(d);
  if (isHoliday(d)) {
    const name = holidayName(d);
    return `${date} — (Market holiday)${name ? ' ' + name : ''}`;
  }
  if (isWeekend(d)) return `${date} — (Weekend)`;
  if (isFuture(d)) return `${date} — (Future date)`;
  return `${date} — (Market day)`;
};

export const selectedDates = (rangeStart: Date | null, rangeEnd: Date | null): Date[] => {
  if (!rangeStart || !rangeEnd) return rangeStart ? [rangeStart] : [];
  const s = rangeStart < rangeEnd ? rangeStart : rangeEnd;
  const e = rangeStart < rangeEnd ? rangeEnd : rangeStart;
  const out: Date[] = [];
  const x = new Date(s);
  while (x <= e) {
    if (isMarketDayNoFuture(x)) out.push(new Date(x));
    x.setDate(x.getDate() + 1);
  }
  return out;
};

export const latestAvailableTradingDay = (): Date => {
  const now = inIST();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const after530 = now.getHours() > 17 || (now.getHours() === 17 && now.getMinutes() >= 30);
  return after530
    ? (isMarketDay(today) ? today : prevMktDay(today))
    : prevMktDay(today);
};

export const getInitialDate = (): Date => {
  const now = inIST();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const after530 = now.getHours() > 17 || (now.getHours() === 17 && now.getMinutes() >= 30);
  if (after530) {
    return isMarketDay(today) ? today : prevMktDay(today);
  } else {
    return isMarketDay(today) ? prevMktDay(today) : prevMktDay(today);
  }
};
