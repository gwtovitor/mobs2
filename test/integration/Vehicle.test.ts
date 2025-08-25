import CreateVehicle from '../../src/application/usecase/Veihcles/CreateVehicle';
import DeleteVehicleByPlate from '../../src/application/usecase/Veihcles/DeleteVeihcleByPlate';
import GetVehicleByPlate from '../../src/application/usecase/Veihcles/GetVehicleByPlate';
import UpdateVehicleByPlate from '../../src/application/usecase/Veihcles/UpdateVehicleByPlate';
import DatabaseConnection, {
	PgPromiseAdapter,
} from '../../src/infra/database/DatabaseConnection';
import VehicleRepository, {
	VehicleRepositoryDatabase,
	VehicleRepositoryMemory,
} from '../../src/infra/repository/VehicleRepository';

let repo: VehicleRepository;
let createVehicle: CreateVehicle;
let getVehicle: GetVehicleByPlate;
let updateVehicle: UpdateVehicleByPlate;
let deleteVehicle: DeleteVehicleByPlate;
let connection: DatabaseConnection;

beforeEach(() => {
	connection = new PgPromiseAdapter("postgres://postgres:123456@localhost:5432/app");
	repo = new VehicleRepositoryDatabase(connection);
	createVehicle = new CreateVehicle(repo);
	getVehicle = new GetVehicleByPlate(repo);
	updateVehicle = new UpdateVehicleByPlate(repo);
	deleteVehicle = new DeleteVehicleByPlate(repo);
});

test('Deve criar, buscar, atualizar e deletar um veículo pela placa', async () => {
	await createVehicle.execute({
		plate: 'ABC-1234',
		model: 'Corolla',
		manufacturer: 'Toyota',
		year: 2020,
	});

	const got = await getVehicle.execute('ABC-1234');
	expect(got.model).toBe('Corolla');

	const updated = await updateVehicle.execute('ABC-1234', {
		model: 'Corolla XEi',
		year: 2021,
	});
	expect(updated.model).toBe('Corolla XEi');
	expect(updated.year).toBe(2021);

	const del = await deleteVehicle.execute('ABC-1234');
	expect(del.success).toBe(true);

	await expect(getVehicle.execute('ABC-1234')).rejects.toThrow(
		'Vehicle not found'
	);
});


test('Deve validar placa e ano', async () => {
	await expect(
		createVehicle.execute({
			plate: 'INVALID',
			model: 'Uno',
			manufacturer: 'Fiat',
			year: 2010,
		})
	).rejects.toThrow('Invalid plate');

	await expect(
		createVehicle.execute({
			plate: 'DEF-0001',
			model: 'Uno',
			manufacturer: 'Fiat',
			year: 1800,
		})
	).rejects.toThrow('Invalid year');
});

