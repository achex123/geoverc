import { VercelRequest, VercelResponse } from '@vercel/node';
import axios, { AxiosError } from 'axios';
import cors from 'cors';

interface GeoLocation {
  status: string;
  country: string;
  city: string;
  timezone: string;
  countryCode: string;
  region: string;
  regionName: string;
  lat: number;
  lon: number;
}

const corsMiddleware = cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-CSRF-Token', 'X-Requested-With', 'Accept', 'Accept-Version', 'Content-Length', 'Content-MD5', 'Date', 'X-Api-Version'],
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
  // Add security headers
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ip } = req.body;

  if (!ip) {
    return res.status(400).json({ error: 'IP address is required' });
  }

  try {
    const response = await axios.get<GeoLocation>(
      `http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,regionName,city,timezone,lat,lon`
    );

    if (response.data.status === 'fail') {
      return res.status(400).json({ error: 'Failed to get location data' });
    }

    const geoResponse = {
      ip,
      country: response.data.country,
      city: response.data.city,
      timezone: response.data.timezone,
      countryCode: response.data.countryCode,
      region: response.data.regionName,
      coordinates: {
        lat: response.data.lat,
        lon: response.data.lon,
      },
    };

    return res.json(geoResponse);
  } catch (error: unknown) {
    const errorMessage = error instanceof AxiosError 
      ? error.response?.data?.message || error.message
      : 'Failed to get location data';
    console.error('Geolocation error:', errorMessage);
    return res.status(500).json({ error: errorMessage });
  }
});
