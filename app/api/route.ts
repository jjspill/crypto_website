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
  const response = {
    data: data,
    updated: new Date().toISOString(),
  };
  return new Response(JSON.stringify(response), {
    // return new Response(JSON.stringify([]), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function formatTimestampForExcelEastern(timestamp: number): string {
  const date = new Date(timestamp);

  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZoneName: 'short',
  };

  const dateString = new Intl.DateTimeFormat('en-US', options).format(date);
  return dateString;
}
