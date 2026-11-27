export interface UsageDisk {
  id: string;
  name: string;
  path: string;
  totalBytes: number | null;
  usedBytes: number | null;
  freeBytes: number | null;
  error: string | null;
}

export interface UsageSample {
  schemaVersion: number;
  measuredAt: string;
  date: string;
  disks: UsageDisk[];
}

export interface CurrentUsage {
  actual: UsageSample | null;
  error: string | null;
  storageUsage: {
    datastoreSize: number | null;
    objectstoreSize: number | null;
    usersSize: number | null;
    calculatedAt: string | null;
  };
}

export interface UsageHistory {
  samples: UsageSample[];
  error: string | null;
}

export type UsagePeriod = 'day' | 'week' | 'month';
export interface UsagePoint {
  date: string;
  measuredAt: string | null;
  usedBytes: number | null;
  growthBytes: number | null;
}

const DAY = 86400000;
function iso(date: Date): string { return date.toISOString().slice(0, 10); }
function bucket(date: Date, period: UsagePeriod): string {
  const start = new Date(date);
  if (period === 'week') start.setUTCDate(start.getUTCDate() - (start.getUTCDay() + 6) % 7);
  if (period === 'month') start.setUTCDate(1);
  return iso(start);
}

/** Calendar dates come from the collector, not the browser's timezone.
 * Use the last day in each period for occupancy. Growth is the sum of daily
 * differences; any missing day or failed disk leaves an unknown result.
 */
export function usagePoints(samples: UsageSample[], diskId: string, period: UsagePeriod): UsagePoint[] {
  if (!samples.length) return [];
  const ordered = [...samples].sort((a, b) => a.date.localeCompare(b.date));
  const days = new Map(ordered.map(sample => [sample.date, sample]));
  const points: UsagePoint[] = [];
  let previous: number | null = null;
  let key = '';
  let growth: number | null = null;
  const end = Date.parse(ordered[ordered.length - 1].date + 'T00:00:00Z');
  for (let time = Date.parse(ordered[0].date + 'T00:00:00Z'); time <= end; time += DAY) {
    const date = new Date(time);
    const sample = days.get(iso(date));
    const disk = sample?.disks.find(item => item.id === diskId);
    const used = disk && !disk.error ? disk.usedBytes : null;
    const delta = used != null && previous != null ? used - previous : null;
    const nextKey = bucket(date, period);
    if (key !== nextKey) {
      key = nextKey;
      growth = delta;
      points.push({date: key, measuredAt: null, usedBytes: null, growthBytes: null});
    } else {
      growth = growth != null && delta != null ? growth + delta : null;
    }
    Object.assign(points[points.length - 1], {
      measuredAt: sample?.measuredAt ?? null, usedBytes: used ?? null, growthBytes: growth
    });
    previous = used ?? null;
  }
  return points;
}

export function formatUsageBytes(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return '—';
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'];
  const index = Math.min(units.length - 1, Math.floor(Math.log2(Math.max(1, Math.abs(value))) / 10));
  return `${+(value / 1024 ** index).toFixed(1)} ${units[index]}`;
}
