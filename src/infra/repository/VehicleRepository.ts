import Vehicle from '../../domain/Vehichle';
import DatabaseConnection from '../database/DatabaseConnection';

export default interface VehicleRepository {
	save(vehicle: Vehicle): Promise<void>;
	getByPlate(plate: string): Promise<Vehicle | null>;
	updateByPlate(plate: string, vehicle: Vehicle): Promise<void>;
	deleteByPlate(plate: string): Promise<boolean>;
	listAll(): Promise<Vehicle[]>;
}

export class VehicleRepositoryDatabase implements VehicleRepository {
	constructor(private readonly connection: DatabaseConnection) {}


	async listAll(): Promise<Vehicle[]> {
		const rows = await this.connection.query(
			`select plate, model, manufacturer, year
         from mobs.vehicle
        order by plate asc`,
			[]
		);
		return rows.map(
			(r: any) => new Vehicle(r.plate, r.model, r.manufacturer, r.year)
		);
	}

	async save(vehicle: Vehicle): Promise<void> {
		await this.connection.query(
			`insert into mobs.vehicle (plate, model, manufacturer, year, created_at, updated_at)
       values ($1, $2, $3, $4, now(), now())`,
			[vehicle.plate, vehicle.model, vehicle.manufacturer, vehicle.year]
		);
	}

	async getByPlate(plate: string): Promise<Vehicle | null> {
		const rows = await this.connection.query(
			`select plate, model, manufacturer, year
         from mobs.vehicle
        where plate = $1
        limit 1`,
			[plate.toUpperCase()]
		);
		const row = rows?.[0];
		if (!row) return null;
		return new Vehicle(row.plate, row.model, row.manufacturer, row.year);
	}

	async updateByPlate(plate: string, vehicle: Vehicle): Promise<void> {
		const result = await this.connection.query(
			`update mobs.vehicle
          set model = $2,
              manufacturer = $3,
              year = $4,
              updated_at = now()
        where plate = $1`,
			[
				plate.toUpperCase(),
				vehicle.model,
				vehicle.manufacturer,
				vehicle.year,
			]
		);
	}

	async deleteByPlate(plate: string): Promise<boolean> {
		const rows = await this.connection.query(
			`delete from mobs.vehicle where plate = $1 returning plate`,
			[plate.toUpperCase()]
		);
		return !!rows?.[0];
	}
}

export class VehicleRepositoryMemory implements VehicleRepository {
	vehicles: Map<string, Vehicle> = new Map();

	async listAll(): Promise<Vehicle[]> {
		return Array.from(this.vehicles.values());
	}

	async save(vehicle: Vehicle): Promise<void> {
		this.vehicles.set(vehicle.plate, vehicle);
	}

	async getByPlate(plate: string): Promise<Vehicle | null> {
		return this.vehicles.get(plate.toUpperCase()) ?? null;
	}

	async updateByPlate(plate: string, vehicle: Vehicle): Promise<void> {
		if (!this.vehicles.has(plate.toUpperCase()))
			throw new Error('Vehicle not found');
		this.vehicles.set(plate.toUpperCase(), vehicle);
	}

	async deleteByPlate(plate: string): Promise<boolean> {
		return this.vehicles.delete(plate.toUpperCase());
	}
}
