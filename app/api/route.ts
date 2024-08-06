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

export async function GET(request: Request): Promise<Response> {
  const { client, db } = await connectToDatabase(uri, dbName);
  const data = await db.collection('Data').find().toArray();
  data.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  return new Response(JSON.stringify(data), {
    // return new Response(JSON.stringify([]), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
