import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

// Reuse connection across warm serverless invocations
let cachedClient = null;

async function getDb() {
  if (cachedClient) return cachedClient.db('mh370tribute');
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
  });
  await client.connect();
  cachedClient = client;
  return client.db('mh370tribute');
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  setCors(res);

  // Preflight
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const db = await getDb();
    const col = db.collection('tributes');

    // ── GET /api/tributes ──────────────────────────────
    if (req.method === 'GET') {
      const page  = Math.max(1, parseInt(req.query.page  ?? '1',  10));
      const limit = Math.min(50, parseInt(req.query.limit ?? '50', 10));
      const skip  = (page - 1) * limit;

      const [tributes, total] = await Promise.all([
        col.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
        col.countDocuments(),
      ]);

      return res.status(200).json({ tributes, total, page, pages: Math.ceil(total / limit) });
    }

    // ── POST /api/tributes ─────────────────────────────
    if (req.method === 'POST') {
      const { name, from, message } = req.body ?? {};

      if (!message?.trim()) {
        return res.status(400).json({ error: 'Message is required.' });
      }

      const doc = {
        name:      (name?.trim()    || 'Anonymous').slice(0, 60),
        from:      (from?.trim()    || '').slice(0, 80),
        message:   message.trim().slice(0, 500),
        createdAt: new Date(),
      };

      const result = await col.insertOne(doc);
      return res.status(201).json({ ...doc, _id: result.insertedId });
    }

    return res.status(405).json({ error: 'Method not allowed.' });

  } catch (err) {
    console.error('[/api/tributes]', err);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}
