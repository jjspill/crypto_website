import { connectToDatabase } from '../utils/mongodb';

const uri = process.env.MONGODB_URI as string;
const dbName = process.env.MONGODB_NAME as string;

if (!uri) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env',
  );
}

if (!dbName) {
  throw new Error(
    'Please define the MONGODB_DB environment variable inside .env',
  );
}

export const dynamic = 'force-dynamic';
export async function GET(): Promise<Response> {
  console.log('GET /api');
  const { client, db } = await connectToDatabase(uri, dbName);
  const data = await db.collection('Data').find().toArray();
  data.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  data.forEach((item) => {
    Object.keys(item).forEach((key: string) => {
      if (key.includes('_time')) {
        item[key] = formatTimestampForExcelEastern(item[key]);
      }
    });
  });
  return new Response(JSON.stringify(data), {
    // return new Response(JSON.stringify([]), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function formatTimestampForExcelEastern(timestamp: number): string {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/New_York', // Eastern Time zone
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };

  const formattedDate = date.toLocaleString('en-US', options);
  return formattedDate.replace(
    /(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2}):(\d{2})/,
    '$3-$1-$2 $4:$5:$6',
  );
}
