import Vehicle from "../../src/domain/Vehichle";


test("Deve criar um veículo válido", () => {
  const vehicle = Vehicle.create("ABC-1234", "Corolla", "Toyota", 2020);
  expect(vehicle).toBeDefined();
  expect(vehicle.plate).toBe("ABC-1234");
  expect(vehicle.model).toBe("Corolla");
  expect(vehicle.manufacturer).toBe("Toyota");
  expect(vehicle.year).toBe(2020);
});

test("Não deve criar um veículo com placa inválida", () => {
  expect(() =>
    Vehicle.create("INVALID", "Corolla", "Toyota", 2020)
  ).toThrow(new Error("Invalid plate"));
});

test("Não deve criar um veículo com modelo inválido", () => {
  expect(() =>
    Vehicle.create("ABC-1234", "", "Toyota", 2020)
  ).toThrow(new Error("Invalid model"));
});

test("Não deve criar um veículo com fabricante inválido", () => {
  expect(() =>
    Vehicle.create("ABC-1234", "Corolla", "", 2020)
  ).toThrow(new Error("Invalid manufacturer"));
});

test("Não deve criar um veículo com ano inválido", () => {
  expect(() =>
    Vehicle.create("ABC-1234", "Corolla", "Toyota", 1800)
  ).toThrow(new Error("Invalid year"));
});
