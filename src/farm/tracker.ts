// farmerlog-ai — Farm Management Tracker Module
// CropManager, LivestockTracker, FieldOperations, WeatherImpact, YieldTracker, MarketPriceMonitor

export interface Crop {
  id: string;
  name: string;
  variety: string;
  acreage: number;
  plantingDate: string;
  status: "planned" | "planted" | "growing" | "harvested";
  fieldId?: string;
  notes?: string;
}

export interface Livestock {
  id: string;
  species: string;
  breed: string;
  count: number;
  location: string;
  healthStatus: "healthy" | "monitoring" | "veterinary-care";
  lastCheckup: string;
  notes?: string;
}

export interface FieldOperation {
  id: string;
  type: "planting" | "spraying" | "fertilizing" | "irrigating" | "harvesting" | "tillage";
  fieldId: string;
  date: string;
  crop?: string;
  details: string;
  equipment?: string;
  cost?: number;
  status: "planned" | "in-progress" | "completed";
}

export interface WeatherEvent {
  id: string;
  type: "drought" | "flood" | "frost" | "hail" | "storm" | "heatwave" | "wind";
  date: string;
  severity: "low" | "moderate" | "high" | "severe";
  affectedFields: string[];
  description: string;
  cropImpact?: string;
  estimatedLoss?: number;
}

export interface YieldRecord {
  id: string;
  crop: string;
  variety: string;
  fieldId: string;
  harvestDate: string;
  quantity: number;
  unit: string;
  qualityGrade: string;
  revenue?: number;
}

export interface MarketPrice {
  id: string;
  commodity: string;
  price: number;
  unit: string;
  date: string;
  change: number;
  source: string;
}

function generateId(): string {
  return crypto.randomUUID();
}

// ── CropManager ──────────────────────────────────────────────

export class CropManager {
  private crops: Map<string, Crop> = new Map();

  add(data: Omit<Crop, "id">): Crop {
    const crop: Crop = { id: generateId(), ...data };
    this.crops.set(crop.id, crop);
    return crop;
  }

  get(id: string): Crop | undefined {
    return this.crops.get(id);
  }

  list(): Crop[] {
    return [...this.crops.values()];
  }

  update(id: string, data: Partial<Omit<Crop, "id">>): Crop | undefined {
    const crop = this.crops.get(id);
    if (!crop) return undefined;
    Object.assign(crop, data);
    return crop;
  }

  remove(id: string): boolean {
    return this.crops.delete(id);
  }

  summary(): { totalAcreage: number; byStatus: Record<string, number>; cropTypes: number } {
    const all = this.list();
    return {
      totalAcreage: all.reduce((sum, c) => sum + c.acreage, 0),
      byStatus: all.reduce<Record<string, number>>((acc, c) => {
        acc[c.status] = (acc[c.status] || 0) + 1;
        return acc;
      }, {}),
      cropTypes: new Set(all.map((c) => c.name)).size,
    };
  }
}

// ── LivestockTracker ─────────────────────────────────────────

export class LivestockTracker {
  private herds: Map<string, Livestock> = new Map();

  add(data: Omit<Livestock, "id">): Livestock {
    const entry: Livestock = { id: generateId(), ...data };
    this.herds.set(entry.id, entry);
    return entry;
  }

  get(id: string): Livestock | undefined {
    return this.herds.get(id);
  }

  list(): Livestock[] {
    return [...this.herds.values()];
  }

  update(id: string, data: Partial<Omit<Livestock, "id">>): Livestock | undefined {
    const entry = this.herds.get(id);
    if (!entry) return undefined;
    Object.assign(entry, data);
    return entry;
  }

  remove(id: string): boolean {
    return this.herds.delete(id);
  }

  summary(): { totalHead: number; bySpecies: Record<string, number>; healthAlerts: number } {
    const all = this.list();
    return {
      totalHead: all.reduce((sum, h) => sum + h.count, 0),
      bySpecies: all.reduce<Record<string, number>>((acc, h) => {
        acc[h.species] = (acc[h.species] || 0) + h.count;
        return acc;
      }, {}),
      healthAlerts: all.filter((h) => h.healthStatus !== "healthy").length,
    };
  }
}

// ── FieldOperations ──────────────────────────────────────────

export class FieldOperations {
  private ops: Map<string, FieldOperation> = new Map();

  add(data: Omit<FieldOperation, "id">): FieldOperation {
    const op: FieldOperation = { id: generateId(), ...data };
    this.ops.set(op.id, op);
    return op;
  }

  get(id: string): FieldOperation | undefined {
    return this.ops.get(id);
  }

  list(): FieldOperation[] {
    return [...this.ops.values()].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  update(id: string, data: Partial<Omit<FieldOperation, "id">>): FieldOperation | undefined {
    const op = this.ops.get(id);
    if (!op) return undefined;
    Object.assign(op, data);
    return op;
  }

  remove(id: string): boolean {
    return this.ops.delete(id);
  }

  summary(): { totalOps: number; byType: Record<string, number>; totalCost: number } {
    const all = this.list();
    return {
      totalOps: all.length,
      byType: all.reduce<Record<string, number>>((acc, o) => {
        acc[o.type] = (acc[o.type] || 0) + 1;
        return acc;
      }, {}),
      totalCost: all.reduce((sum, o) => sum + (o.cost || 0), 0),
    };
  }
}

// ── WeatherImpact ────────────────────────────────────────────

export class WeatherImpact {
  private events: Map<string, WeatherEvent> = new Map();

  add(data: Omit<WeatherEvent, "id">): WeatherEvent {
    const event: WeatherEvent = { id: generateId(), ...data };
    this.events.set(event.id, event);
    return event;
  }

  get(id: string): WeatherEvent | undefined {
    return this.events.get(id);
  }

  list(): WeatherEvent[] {
    return [...this.events.values()].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  update(id: string, data: Partial<Omit<WeatherEvent, "id">>): WeatherEvent | undefined {
    const event = this.events.get(id);
    if (!event) return undefined;
    Object.assign(event, data);
    return event;
  }

  remove(id: string): boolean {
    return this.events.delete(id);
  }

  activeAlerts(): WeatherEvent[] {
    return this.list().filter((e) => e.severity === "high" || e.severity === "severe");
  }

  summary(): { totalEvents: number; totalEstimatedLoss: number; bySeverity: Record<string, number> } {
    const all = this.list();
    return {
      totalEvents: all.length,
      totalEstimatedLoss: all.reduce((sum, e) => sum + (e.estimatedLoss || 0), 0),
      bySeverity: all.reduce<Record<string, number>>((acc, e) => {
        acc[e.severity] = (acc[e.severity] || 0) + 1;
        return acc;
      }, {}),
    };
  }
}

// ── YieldTracker ─────────────────────────────────────────────

export class YieldTracker {
  private records: Map<string, YieldRecord> = new Map();

  add(data: Omit<YieldRecord, "id">): YieldRecord {
    const record: YieldRecord = { id: generateId(), ...data };
    this.records.set(record.id, record);
    return record;
  }

  get(id: string): YieldRecord | undefined {
    return this.records.get(id);
  }

  list(): YieldRecord[] {
    return [...this.records.values()].sort(
      (a, b) => new Date(b.harvestDate).getTime() - new Date(a.harvestDate).getTime()
    );
  }

  update(id: string, data: Partial<Omit<YieldRecord, "id">>): YieldRecord | undefined {
    const record = this.records.get(id);
    if (!record) return undefined;
    Object.assign(record, data);
    return record;
  }

  remove(id: string): boolean {
    return this.records.delete(id);
  }

  summary(): { totalHarvest: number; totalRevenue: number; byCrop: Record<string, { quantity: number; revenue: number }> } {
    const all = this.list();
    const byCrop: Record<string, { quantity: number; revenue: number }> = {};
    for (const r of all) {
      if (!byCrop[r.crop]) byCrop[r.crop] = { quantity: 0, revenue: 0 };
      byCrop[r.crop].quantity += r.quantity;
      byCrop[r.crop].revenue += r.revenue || 0;
    }
    return {
      totalHarvest: all.reduce((sum, r) => sum + r.quantity, 0),
      totalRevenue: all.reduce((sum, r) => sum + (r.revenue || 0), 0),
      byCrop,
    };
  }
}

// ── MarketPriceMonitor ───────────────────────────────────────

export class MarketPriceMonitor {
  private prices: Map<string, MarketPrice> = new Map();

  add(data: Omit<MarketPrice, "id">): MarketPrice {
    const entry: MarketPrice = { id: generateId(), ...data };
    this.prices.set(entry.id, entry);
    return entry;
  }

  get(id: string): MarketPrice | undefined {
    return this.prices.get(id);
  }

  list(): MarketPrice[] {
    return [...this.prices.values()].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  update(id: string, data: Partial<Omit<MarketPrice, "id">>): MarketPrice | undefined {
    const entry = this.prices.get(id);
    if (!entry) return undefined;
    Object.assign(entry, data);
    return entry;
  }

  remove(id: string): boolean {
    return this.prices.delete(id);
  }

  summary(): { trackedCommodities: number; avgChange: number; topGainer: string | null; topLoser: string | null } {
    const all = this.list();
    const latestByCommodity = new Map<string, MarketPrice>();
    for (const p of all) {
      const existing = latestByCommodity.get(p.commodity);
      if (!existing || new Date(p.date) > new Date(existing.date)) {
        latestByCommodity.set(p.commodity, p);
      }
    }
    const latest = [...latestByCommodity.values()];
    const avgChange = latest.length > 0 ? latest.reduce((s, p) => s + p.change, 0) / latest.length : 0;
    const sorted = [...latest].sort((a, b) => b.change - a.change);
    return {
      trackedCommodities: latestByCommodity.size,
      avgChange: Math.round(avgChange * 100) / 100,
      topGainer: sorted[0]?.commodity ?? null,
      topLoser: sorted[sorted.length - 1]?.commodity ?? null,
    };
  }
}
