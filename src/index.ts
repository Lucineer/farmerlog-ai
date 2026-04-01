// farmerlog-ai — Cloudflare Worker entry point
import {
  CropManager,
  LivestockTracker,
  FieldOperations,
  WeatherImpact,
  YieldTracker,
  MarketPriceMonitor,
} from "./farm/tracker";

interface Env {
  DEEPSEEK_API_KEY: string;
}

const crops = new CropManager();
const livestock = new LivestockTracker();
const fieldOps = new FieldOperations();
const weather = new WeatherImpact();
const yields = new YieldTracker();
const markets = new MarketPriceMonitor();

// Seed demo data
function seedData() {
  crops.add({ name: "Corn", variety: "Pioneer P1197", acreage: 320, plantingDate: "2026-04-15", status: "planted", fieldId: "north-40" });
  crops.add({ name: "Soybeans", variety: "Asgrow AG38X6", acreage: 240, plantingDate: "2026-05-01", status: "planned", fieldId: "east-80" });
  crops.add({ name: "Wheat", variety: "Syngroup Sy-Wheat", acreage: 160, plantingDate: "2025-10-10", status: "growing", fieldId: "south-160" });
  crops.add({ name: "Alfalfa", variety: "Dairyland Hybrid", acreage: 80, plantingDate: "2026-03-20", status: "growing", fieldId: "west-40" });

  livestock.add({ species: "Cattle", breed: "Angus", count: 145, location: "North Pasture", healthStatus: "healthy", lastCheckup: "2026-03-28" });
  livestock.add({ species: "Cattle", breed: "Hereford", count: 82, location: "South Pasture", healthStatus: "monitoring", lastCheckup: "2026-03-25", notes: "3 head showing respiratory symptoms" });
  livestock.add({ species: "Poultry", breed: "Rhode Island Red", count: 500, location: "Barn A", healthStatus: "healthy", lastCheckup: "2026-03-30" });
  livestock.add({ species: "Goats", breed: "Boer", count: 35, location: "Hill Pasture", healthStatus: "healthy", lastCheckup: "2026-03-20" });

  fieldOps.add({ type: "planting", fieldId: "north-40", date: "2026-04-15", crop: "Corn", details: "Planted Pioneer P1197 at 34k population", equipment: "John Deere 1770NT", cost: 12800, status: "completed" });
  fieldOps.add({ type: "spraying", fieldId: "south-160", date: "2026-03-22", crop: "Wheat", details: "Applied fungicide for rust prevention", equipment: "Case IH Patriot 3240", cost: 4200, status: "completed" });
  fieldOps.add({ type: "fertilizing", fieldId: "north-40", date: "2026-04-10", crop: "Corn", details: "Pre-plant anhydrous ammonia at 180 lbs N/ac", equipment: "Horsch Joker RT", cost: 8600, status: "completed" });
  fieldOps.add({ type: "harvesting", fieldId: "south-160", date: "2026-06-20", crop: "Wheat", details: "Planned wheat harvest", status: "planned" });

  weather.add({ type: "frost", date: "2026-03-15", severity: "moderate", affectedFields: ["south-160"], description: "Late frost event, temperatures dropped to 28F overnight", cropImpact: "Minor leaf burn on early wheat growth", estimatedLoss: 2400 });
  weather.add({ type: "drought", date: "2026-03-01", severity: "low", affectedFields: ["west-40"], description: "Below-average rainfall in February", cropImpact: "Alfalfa slightly behind growth schedule" });

  yields.add({ crop: "Corn", variety: "Pioneer P1197", fieldId: "north-40", harvestDate: "2025-10-05", quantity: 57600, unit: "bushels", qualityGrade: "Grade 2", revenue: 230400 });
  yields.add({ crop: "Soybeans", variety: "Asgrow AG38X6", fieldId: "east-80", harvestDate: "2025-10-20", quantity: 14400, unit: "bushels", qualityGrade: "Grade 1", revenue: 172800 });
  yields.add({ crop: "Wheat", variety: "Syngroup Sy-Wheat", fieldId: "south-160", harvestDate: "2025-06-25", quantity: 9600, unit: "bushels", qualityGrade: "Grade 2", revenue: 57600 });

  markets.add({ commodity: "Corn", price: 4.35, unit: "USD/bu", date: "2026-03-31", change: 0.12, source: "CBOT" });
  markets.add({ commodity: "Soybeans", price: 12.85, unit: "USD/bu", date: "2026-03-31", change: -0.23, source: "CBOT" });
  markets.add({ commodity: "Wheat", price: 6.42, unit: "USD/bu", date: "2026-03-31", change: 0.08, source: "CBOT" });
  markets.add({ commodity: "Cattle (Live)", price: 182.50, unit: "USD/cwt", date: "2026-03-31", change: 1.75, source: "CME" });
  markets.add({ commodity: "Milk", price: 18.90, unit: "USD/cwt", date: "2026-03-31", change: -0.35, source: "CME" });
}

seedData();

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
}

async function handleChat(body: { messages: { role: string; content: string }[] }, env: Env): Promise<Response> {
  const apiKey = env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return json({ error: "DeepSeek API key not configured" }, 500);
  }

  const systemPrompt = `You are FarmerLog AI, an expert farm management assistant. You help farmers with crop planning, livestock management, field operations, weather preparedness, yield optimization, and market analysis. Be practical, concise, and use agricultural terminology appropriately. Reference current commodity prices and seasonal considerations when relevant.`;

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "system", content: systemPrompt }, ...body.messages],
      stream: true,
    }),
  });

  return new Response(response.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // ── Chat (SSE) ──
    if (path === "/api/chat" && request.method === "POST") {
      const body = (await request.json()) as { messages: { role: string; content: string }[] };
      return handleChat(body, env);
    }

    // ── Crops ──
    if (path === "/api/crops") {
      if (request.method === "GET") return json(crops.list());
      if (request.method === "POST") {
        const body = await request.json();
        return json(crops.add(body as Parameters<typeof crops.add>[0]), 201);
      }
    }
    if (path.startsWith("/api/crops/") && request.method === "PUT") {
      const id = path.split("/").pop()!;
      const body = await request.json();
      const updated = crops.update(id, body as Parameters<typeof crops.update>[1]);
      return updated ? json(updated) : json({ error: "Crop not found" }, 404);
    }
    if (path.startsWith("/api/crops/") && request.method === "DELETE") {
      const id = path.split("/").pop()!;
      return crops.remove(id) ? json({ ok: true }) : json({ error: "Crop not found" }, 404);
    }

    // ── Livestock ──
    if (path === "/api/livestock") {
      if (request.method === "GET") return json(livestock.list());
      if (request.method === "POST") {
        const body = await request.json();
        return json(livestock.add(body as Parameters<typeof livestock.add>[0]), 201);
      }
    }
    if (path.startsWith("/api/livestock/") && request.method === "PUT") {
      const id = path.split("/").pop()!;
      const body = await request.json();
      const updated = livestock.update(id, body as Parameters<typeof livestock.update>[1]);
      return updated ? json(updated) : json({ error: "Livestock not found" }, 404);
    }
    if (path.startsWith("/api/livestock/") && request.method === "DELETE") {
      const id = path.split("/").pop()!;
      return livestock.remove(id) ? json({ ok: true }) : json({ error: "Livestock not found" }, 404);
    }

    // ── Field Operations ──
    if (path === "/api/field-operations") {
      if (request.method === "GET") return json(fieldOps.list());
      if (request.method === "POST") {
        const body = await request.json();
        return json(fieldOps.add(body as Parameters<typeof fieldOps.add>[0]), 201);
      }
    }
    if (path.startsWith("/api/field-operations/") && request.method === "PUT") {
      const id = path.split("/").pop()!;
      const body = await request.json();
      const updated = fieldOps.update(id, body as Parameters<typeof fieldOps.update>[1]);
      return updated ? json(updated) : json({ error: "Operation not found" }, 404);
    }
    if (path.startsWith("/api/field-operations/") && request.method === "DELETE") {
      const id = path.split("/").pop()!;
      return fieldOps.remove(id) ? json({ ok: true }) : json({ error: "Operation not found" }, 404);
    }

    // ── Weather Impact ──
    if (path === "/api/weather-impact") {
      if (request.method === "GET") {
        const alertsOnly = url.searchParams.get("alerts");
        return json(alertsOnly ? weather.activeAlerts() : weather.list());
      }
      if (request.method === "POST") {
        const body = await request.json();
        return json(weather.add(body as Parameters<typeof weather.add>[0]), 201);
      }
    }
    if (path.startsWith("/api/weather-impact/") && request.method === "PUT") {
      const id = path.split("/").pop()!;
      const body = await request.json();
      const updated = weather.update(id, body as Parameters<typeof weather.update>[1]);
      return updated ? json(updated) : json({ error: "Event not found" }, 404);
    }

    // ── Yields ──
    if (path === "/api/yields") {
      if (request.method === "GET") return json(yields.list());
      if (request.method === "POST") {
        const body = await request.json();
        return json(yields.add(body as Parameters<typeof yields.add>[0]), 201);
      }
    }
    if (path.startsWith("/api/yields/") && request.method === "PUT") {
      const id = path.split("/").pop()!;
      const body = await request.json();
      const updated = yields.update(id, body as Parameters<typeof yields.update>[1]);
      return updated ? json(updated) : json({ error: "Record not found" }, 404);
    }
    if (path.startsWith("/api/yields/") && request.method === "DELETE") {
      const id = path.split("/").pop()!;
      return yields.remove(id) ? json({ ok: true }) : json({ error: "Record not found" }, 404);
    }

    // ── Market Prices ──
    if (path === "/api/market-prices") {
      if (request.method === "GET") return json(markets.list());
      if (request.method === "POST") {
        const body = await request.json();
        return json(markets.add(body as Parameters<typeof markets.add>[0]), 201);
      }
    }
    if (path.startsWith("/api/market-prices/") && request.method === "PUT") {
      const id = path.split("/").pop()!;
      const body = await request.json();
      const updated = markets.update(id, body as Parameters<typeof markets.update>[1]);
      return updated ? json(updated) : json({ error: "Price not found" }, 404);
    }

    // ── Dashboard Summary ──
    if (path === "/api/dashboard") {
      return json({
        crops: crops.summary(),
        livestock: livestock.summary(),
        fieldOps: fieldOps.summary(),
        weather: weather.summary(),
        yields: yields.summary(),
        markets: markets.summary(),
      });
    }

    // ── Serve static HTML ──
    if (path === "/" || path === "/index.html") {
      const html = await fetch(new URL("/app.html", url.origin));
      return new Response(html.body, { headers: { "Content-Type": "text/html" } });
    }

    return json({ error: "Not found" }, 404);
  },
};
