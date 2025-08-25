import Vehicle from '../../../domain/Vehichle';
import VehicleRepository from '../../../infra/repository/VehicleRepository';

export default class CreateVehicle {
  constructor(private readonly repo: VehicleRepository) {}

  async execute(input: { plate: string; model: string; manufacturer: string; year: number }) {
    const existing = await this.repo.getByPlate(input.plate);
    if (existing) throw new Error('Vehicle already exists');
    const vehicle = Vehicle.create(input.plate, input.model, input.manufacturer, input.year);
    await this.repo.save(vehicle);
    return { plate: vehicle.plate };
  }
}
