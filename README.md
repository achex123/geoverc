# Geolocation Service

A Node.js service that provides geolocation information based on IP addresses using the ip-api.com service.

## Features

- IP to location lookup
- Country and city information
- Timezone detection
- CORS enabled
- TypeScript support
- Ready for Vercel deployment

## API Endpoints

### POST /api/geolocation
Get location information for an IP address.

Request body:
```json
{
  "ip": "8.8.8.8"
}
```

Response:
```json
{
  "ip": "8.8.8.8",
  "country": "United States",
  "city": "Mountain View",
  "timezone": "America/Los_Angeles",
  "countryCode": "US",
  "region": "California",
  "coordinates": {
    "lat": 37.4223,
    "lon": -122.0847
  }
}
```

### GET /api/health
Health check endpoint.

Response:
```json
{
  "status": "ok"
}
```

## Deployment

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Vercel account
- GitHub account

### Steps to Deploy

1. Clone the repository:
```bash
git clone <repository-url>
cd geolocation-server
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Deploy to Vercel:
- Connect your GitHub repository to Vercel
- Vercel will automatically detect the configuration
- Deploy and get your production URL

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The server will be available at `http://localhost:3001`

## Environment Variables

No environment variables are required as the service uses the free tier of ip-api.com.

## License

MIT

## Author

Altersoul Music
