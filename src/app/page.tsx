import { redirect } from 'next/navigation'

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

export const dynamic = 'force-dynamic';

export default async function Home() {
  redirect("/" + dayjs().tz("Asia/Tokyo").format("YYYY-MM-DD"));
};
