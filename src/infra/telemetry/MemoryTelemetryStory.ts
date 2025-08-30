import { TelemetryPoint, TelemetryStore } from '../../domain/Telemetry';

export class MemoryTelemetryStore implements TelemetryStore {
	constructor(private readonly maxPerVehicle = 200) {}
	private history = new Map<string, TelemetryPoint[]>();

	append(point: TelemetryPoint): void {
		const plateKey = point.plate.toUpperCase();
		const vehicleHistory = this.history.get(plateKey) ?? [];
		vehicleHistory.push(point);
		if (vehicleHistory.length > this.maxPerVehicle) vehicleHistory.shift();
		this.history.set(plateKey, vehicleHistory);
	}

	getHistory(plate: string, limit = 50): TelemetryPoint[] {
		const vehicleHistory = this.history.get(plate.toUpperCase()) ?? [];
		if (limit <= 0) return [...vehicleHistory];
		return vehicleHistory.slice(Math.max(0, vehicleHistory.length - limit));
	}
}
