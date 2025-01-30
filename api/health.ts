import { VercelRequest, VercelResponse } from '@vercel/node';
import cors from 'cors';

const corsMiddleware = cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
});

// Helper to wrap async handlers with cors
const withCors = (handler: (req: VercelRequest, res: VercelResponse) => Promise<any>) => {
  return (req: VercelRequest, res: VercelResponse) => {
    return new Promise((resolve, reject) => {
      corsMiddleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(handler(req, res));
      });
    });
  };
};

export default withCors(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.json({ status: 'ok' });
});
