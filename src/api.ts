process.loadEnvFile();

import { Server } from 'http';

import { ExpressAdapter } from './infra/http/HttpServer';
import { PgPromiseAdapter } from './infra/database/DatabaseConnection';

import { JwtAdapter } from './infra/security/JwtAdapter';
import { BcryptAdapter } from './infra/security/BcryptAdapter';
import { makeAuthMiddleware } from './infra/http/AuthMiddleware';

import { AccountRepositoryDatabase } from './infra/repository/AccountRepository';
import Signup from './application/usecase/Signup';
import Login from './application/usecase/Login';
import AccountController from './infra/controller/AccountController';

import VehicleController from './infra/controller/VehicleController';


import TelemetryController from './infra/controller/TelemetryController';
import { WsAdapter } from './infra/ws/WsAdapter';
import { VehicleRepositoryDatabase } from './infra/repository/VehicleRepository';
import TelemetrySimulator from './application/services/TelemetrySimulator';
import CreateVehicle from './application/usecase/Veihcles/CreateVehicle';
import DeleteVehicleByPlate from './application/usecase/Veihcles/DeleteVeihcleByPlate';
import GetVehicleByPlate from './application/usecase/Veihcles/GetVehicleByPlate';
import UpdateVehicleByPlate from './application/usecase/Veihcles/UpdateVehicleByPlate';
import { MemoryTelemetryStore } from './infra/telemetry/MemoryTelemetryStory';
import ListAllVehicles from './application/usecase/Veihcles/ListAllVehicles';

const PORT = Number(process.env.PORT) || 3001;

const httpServer = new ExpressAdapter();
const connection = new PgPromiseAdapter();

const tokens = new JwtAdapter(process.env.JWT_SECRET || 'dev_secret');
const hasher = new BcryptAdapter();
const auth = makeAuthMiddleware(tokens);

const accountRepository = new AccountRepositoryDatabase(connection);
const signup = new Signup(accountRepository, hasher);
const login = new Login(accountRepository, hasher, tokens);
AccountController.config(httpServer, signup, login, auth);

const vehicleRepo = new VehicleRepositoryDatabase(connection);
const createVehicle = new CreateVehicle(vehicleRepo);
const getVehicleByPlate = new GetVehicleByPlate(vehicleRepo);
const updateVehicleByPlate = new UpdateVehicleByPlate(vehicleRepo);
const deleteVehicleByPlate = new DeleteVehicleByPlate(vehicleRepo);
const listAllVehicles = new ListAllVehicles(vehicleRepo);
VehicleController.config(
  httpServer,
  createVehicle,
  getVehicleByPlate,
  listAllVehicles,
  updateVehicleByPlate,
  deleteVehicleByPlate,
  auth
);

const telemetryStore = new MemoryTelemetryStore(200);
TelemetryController.config(httpServer, telemetryStore, auth);

httpServer.listen(PORT);

const server = httpServer.getServer() as Server;
if (!server) throw new Error('HTTP server not started');

const wsPublisher = new WsAdapter(server, tokens, telemetryStore, '/ws');

const simulator = new TelemetrySimulator(vehicleRepo, telemetryStore, wsPublisher, 5000);
simulator.start();
