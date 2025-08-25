import VehicleRepository from '../../../infra/repository/VehicleRepository';

export type VehicleDTO = {
  plate: string;
  model: string;
  manufacturer: string;
  year: number;
};

export default class ListAllVehicles {
  constructor(private readonly repo: VehicleRepository) {}

  async execute(): Promise<VehicleDTO[]> {
    const vehicles = await this.repo.listAll();
    return vehicles.map(v => ({
      plate: v.plate,
      model: v.model,
      manufacturer: v.manufacturer,
      year: v.year
    }));
  }
}
