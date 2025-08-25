import Vehicle from '../../../domain/Vehichle';
import VehicleRepository from '../../../infra/repository/VehicleRepository';

export default class UpdateVehicleByPlate {
  constructor(private readonly repo: VehicleRepository) {}

  async execute(plate: string, input: Partial<{ model: string; manufacturer: string; year: number }>) {
    const current = await this.repo.getByPlate(plate);
    if (!current) throw new Error('Vehicle not found');

    const updated = Vehicle.create(
      current.plate,
      input.model ?? current.model,
      input.manufacturer ?? current.manufacturer,
      input.year ?? current.year
    );
    await this.repo.updateByPlate(plate, updated);
    return {
      plate: updated.plate,
      model: updated.model,
      manufacturer: updated.manufacturer,
      year: updated.year
    };
  }
}
