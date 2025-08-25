import { TelemetryPoint, TelemetryPublisher, TelemetryStore } from '../../domain/Telemetry';
import VehicleRepository from '../../infra/repository/VehicleRepository';

export default class TelemetrySimulator {
  private timer?: NodeJS.Timeout;
  private last: Map<string, TelemetryPoint> = new Map();

  constructor(
    private readonly vehicles: VehicleRepository,
    private readonly store: TelemetryStore,
    private readonly publisher: TelemetryPublisher,
    private readonly intervalMs = 5000,
    private readonly origin = {
      lat: Number(process.env.TELEMETRY_ORIGIN_LAT ?? -8.05),
      lng: Number(process.env.TELEMETRY_ORIGIN_LNG ?? -34.90)
    }
  ) {}

  start() {
    if (this.timer) return;
    this.timer = setInterval(() => this.tick(), this.intervalMs);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
  }

  private async tick() {
    const all = await this.vehicles.listAll();
    const now = Date.now();
    for (const v of all) {
      const prev = this.last.get(v.plate);
      const point = this.nextPoint(v.plate, prev, now);
      this.last.set(v.plate, point);
      this.store.append(point);
      this.publisher.publish(point);
        
    }
  }

  private nextPoint(plate: string, prev: TelemetryPoint | undefined, timestamp: number): TelemetryPoint {
    if (!prev) {
      return {
        plate,
        lat: this.origin.lat + (Math.random() - 0.5) * 0.02,
        lng: this.origin.lng + (Math.random() - 0.5) * 0.02,
        speed: Math.floor(30 + Math.random() * 40),
        fuel: Math.floor(60 + Math.random() * 40),
        timestamp
      };
    }
    const dLat = (Math.random() - 0.5) * 0.0015;
    const dLng = (Math.random() - 0.5) * 0.0015;
    let fuel = prev.fuel - (0.1 + Math.random() * 0.3);
    if (fuel < 5) fuel = 100;
    const speed = Math.max(0, Math.min(110, Math.round(prev.speed + (Math.random() - 0.5) * 10)));
    return {
      plate,
      lat: prev.lat + dLat,
      lng: prev.lng + dLng,
      speed,
      fuel: Math.round(fuel),
      timestamp
    };
  }
}
