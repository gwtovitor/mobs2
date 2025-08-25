import CreateVehicle from '../../application/usecase/Veihcles/CreateVehicle';
import DeleteVehicleByPlate from '../../application/usecase/Veihcles/DeleteVeihcleByPlate';
import GetVehicleByPlate from '../../application/usecase/Veihcles/GetVehicleByPlate';
import ListAllVehicles from '../../application/usecase/Veihcles/ListAllVehicles';
import UpdateVehicleByPlate from '../../application/usecase/Veihcles/UpdateVehicleByPlate';
import HttpServer, { HttpMethods, Middleware } from '../http/HttpServer';


export default class VehicleController {
  static config(
    http: HttpServer,
    createVehicle: CreateVehicle,
    getByPlate: GetVehicleByPlate,
    listAll: ListAllVehicles,    
    updateByPlate: UpdateVehicleByPlate,
    deleteByPlate: DeleteVehicleByPlate,
    auth: Middleware
  ) {
    http.route(HttpMethods.post, '/vehicles', async ({ body }: any) => {
      return await createVehicle.execute(body); 
    }, [auth]);

    http.route(HttpMethods.get, '/vehicles/:plate', async ({ params }: any) => {
      return await getByPlate.execute(params.plate);
    }, [auth]);

    http.route(
      HttpMethods.get,'/vehicles', async () => {
        return await listAll.execute();
      },
      [auth]
    );

    http.route(HttpMethods.put, '/vehicles/:plate', async ({ params, body }: any) => {
      return await updateByPlate.execute(params.plate, body);
    }, [auth]);

    http.route(HttpMethods.delete, '/vehicles/:plate', async ({ params }: any) => {
      return await deleteByPlate.execute(params.plate);
    }, [auth]);
  }
}
