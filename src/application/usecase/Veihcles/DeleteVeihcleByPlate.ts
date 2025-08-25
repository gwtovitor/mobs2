import VehicleRepository from "../../../infra/repository/VehicleRepository";


export default class DeleteVehicleByPlate {
  constructor(private readonly repo: VehicleRepository) {}

  async execute(plate: string) {
    const existed = await this.repo.deleteByPlate(plate);
    if (!existed) throw new Error('Vehicle not found');
    return { success: true };
  }
}
