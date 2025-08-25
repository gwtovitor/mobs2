import { TelemetryPoint, TelemetryStore } from "../../domain/Telemetry";


export class MemoryTelemetryStore implements TelemetryStore {
  constructor(private readonly maxPerVehicle = 200) {}
  private history = new Map<string, TelemetryPoint[]>();

  append(point: TelemetryPoint): void {
    const key = point.plate.toUpperCase();
    const arr = this.history.get(key) ?? [];
    arr.push(point);
    if (arr.length > this.maxPerVehicle) arr.shift();
    this.history.set(key, arr);
  }

  getHistory(plate: string, limit = 50): TelemetryPoint[] {
    const arr = this.history.get(plate.toUpperCase()) ?? [];
    if (limit <= 0) return [...arr];
    return arr.slice(Math.max(0, arr.length - limit));
  }
}
