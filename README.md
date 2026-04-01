# FarmerLog AI

Farm management vessel — crop tracking, livestock management, field operations, weather impact, yield records, market prices, and AI-powered chat. Built on Cloudflare Workers.

## Architecture

- **Cloudflare Worker** (`src/index.ts`) — API server with in-memory data store and SSE chat proxy
- **Farm Tracker** (`src/farm/tracker.ts`) — `CropManager`, `LivestockTracker`, `FieldOperations`, `WeatherImpact`, `YieldTracker`, `MarketPriceMonitor`
- **UI** (`public/app.html`) — Single-page earthy dashboard (green `#15803D`, brown `#78350F`, sky blue `#38BDF8`)

## API Endpoints

| Endpoint | Methods | Description |
|---|---|---|
| `POST /api/chat` | POST | SSE chat proxy to DeepSeek |
| `/api/crops` | GET, POST | Crop plantings with variety, acreage, planting date |
| `/api/crops/:id` | PUT, DELETE | Update/delete crop |
| `/api/livestock` | GET, POST | Herd tracking |
| `/api/livestock/:id` | PUT, DELETE | Update/delete livestock |
| `/api/field-operations` | GET, POST | Planting, spraying, harvesting log |
| `/api/field-operations/:id` | PUT, DELETE | Update/delete operation |
| `/api/weather-impact` | GET, POST | Weather events and effects |
| `/api/weather-impact/:id` | PUT | Update weather event |
| `/api/yields` | GET, POST | Harvest records and yields |
| `/api/yields/:id` | PUT, DELETE | Update/delete yield record |
| `/api/market-prices` | GET, POST | Commodity tracking |
| `/api/market-prices/:id` | PUT | Update market price |
| `/api/dashboard` | GET | Aggregate summary for dashboard |

## Setup

```bash
npm install
npx wrangler dev
```

Set your DeepSeek API key:

```bash
npx wrangler secret put DEEPSEEK_API_KEY
```

## Deploy

```bash
npx wrangler deploy
```

## Author

Superinstance
