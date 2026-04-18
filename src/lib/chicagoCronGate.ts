import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

/** Central US (handles CST/CDT). Override with CRON_TIMEZONE if needed. */
const DEFAULT_TZ = 'America/Chicago';

/**
 * Vercel crons run on UTC wall-clock. We schedule hourly and only execute when the
 * target local hour matches (1 = 1:xx AM, 2 = 2:xx AM in CRON_TIMEZONE).
 */
export function shouldRunChicagoCronHour(
  targetLocalHour: number,
  now: Date = new Date()
): { run: boolean; localTime: string; timezone: string } {
  const tz = process.env.CRON_TIMEZONE?.trim() || DEFAULT_TZ;
  const local = dayjs(now).tz(tz);
  return {
    run: local.hour() === targetLocalHour,
    localTime: local.format('YYYY-MM-DD HH:mm z'),
    timezone: tz,
  };
}
