import {
	TelemetryPoint,
	TelemetryPublisher,
	TelemetryStore,
} from '../../domain/Telemetry';
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
			lng: Number(process.env.TELEMETRY_ORIGIN_LNG ?? -34.9),
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
		const allVehicles = await this.vehicles.listAll();
		const now = Date.now();
		for (const vehicle of allVehicles) {
			const prev = this.last.get(vehicle.plate);
			const point = this.nextPoint(vehicle.plate, prev, now);
			this.last.set(vehicle.plate, point);
			this.store.append(point);
			this.publisher.publish(point);
		}
	}

	private nextPoint(
		plate: string,
		lastPoint: TelemetryPoint | undefined,
		timestamp: number
	): TelemetryPoint {
		if (!lastPoint) {
			return {
				plate,
				lat: this.origin.lat + (Math.random() - 0.5) * 0.02,
				lng: this.origin.lng + (Math.random() - 0.5) * 0.02,
				speed: Math.floor(30 + Math.random() * 40),
				fuel: Math.floor(60 + Math.random() * 40),
				timestamp,
			};
		}
		const differenceLat = (Math.random() - 0.5) * 0.0015;
		const differenceLng = (Math.random() - 0.5) * 0.0015;
		let fuel = lastPoint.fuel - (0.1 + Math.random() * 0.3);
		if (fuel < 5) fuel = 100;

    // speed -5 || speed +5
		const speed = Math.max(
			0,
			Math.min(110, Math.round(lastPoint.speed + (Math.random() - 0.5) * 10))
		);
		return {
			plate,
			lat: lastPoint.lat + differenceLat,
			lng: lastPoint.lng + differenceLng,
			speed,
			fuel: Math.round(fuel),
			timestamp,
		};
	}
}
