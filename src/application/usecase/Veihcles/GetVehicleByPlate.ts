import VehicleRepository from "../../../infra/repository/VehicleRepository";

export default class GetVehicleByPlate {
  constructor(private readonly repo: VehicleRepository) {}

  async execute(plate: string) {
    const vehicle = await this.repo.getByPlate(plate);
    if (!vehicle) throw new Error('Vehicle not found');
    return {
      plate: vehicle.plate,
      model: vehicle.model,
      manufacturer: vehicle.manufacturer,
      year: vehicle.year
    };
  }
}
