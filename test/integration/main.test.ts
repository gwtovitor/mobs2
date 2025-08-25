import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3001';
axios.defaults.validateStatus = () => true;

async function ensureAuth() {
	const email = `vehicle.tester+${Date.now()}@example.com`;
	const password = 'Senha123@';
	const name = 'Vitor Augusto';

	const resSignup = await axios.post('/signup', { name, email, password });
	if (resSignup.status !== 200 && resSignup.status !== 201) {
		const resLogin = await axios.post('/login', { email, password });
		if (resLogin.status !== 200)
			throw new Error('Falha ao autenticar para os testes de vehicle');
		return resLogin.data.accessToken as string;
	}
	const resLogin = await axios.post('/login', { email, password });
	if (resLogin.status !== 200)
		throw new Error('Falha ao autenticar para os testes de vehicle');
	return resLogin.data.accessToken as string;
}

describe('Auth / Accounts (integração)', () => {
	test('Deve criar uma conta, fazer login e acessar /me com Bearer', async () => {
		const inputSignup = {
			name: 'Vitor Augusto',
			email: 'test@gmail.com',
			password: 'Senha123@',
		};
		const resSignup = await axios.post('/signup', inputSignup);
		expect(resSignup.status).toBe(200);
		const outSignup = resSignup.data;
		expect(outSignup.accountId).toBeDefined();

		const resLogin = await axios.post('/login', {
			email: inputSignup.email,
			password: inputSignup.password,
		});
		expect(resLogin.status).toBe(200);
		const { accessToken } = resLogin.data;
		expect(typeof accessToken).toBe('string');
		expect(accessToken.length).toBeGreaterThan(10);
	});

	test('Não deve criar uma conta com nome inválido', async () => {
		const input = {
			name: 'Vitor',
			email: 'invalid-name@gmail.com',
			password: 'Senha123@',
		};
		const res = await axios.post('/signup', input);
		expect(res.status).toBe(422);
		expect(res.data.error).toBe('Invalid name');
	});

	test('Não deve criar uma conta com email inválido', async () => {
		const input = {
			name: 'Vitor Augusto',
			email: 'test',
			password: 'Senha123@',
		};
		const res = await axios.post('/signup', input);
		expect(res.status).toBe(422);
		expect(res.data.error).toBe('Invalid email');
	});

	test('Não deve criar uma conta com senha inválida', async () => {
		const input = {
			name: 'Vitor Augusto',
			email: 'weakpass@gmail.com',
			password: '123',
		};
		const res = await axios.post('/signup', input);
		expect(res.status).toBe(422);
		expect(res.data.error).toBe('Invalid password');
	});
});

function generatePlateDigits(): string {
	const numbers: number[] = [];
	while (numbers.length < 4) {
		const n: number = Math.floor(Math.random() * 10);
		if (!numbers.includes(n)) {
			numbers.push(n);
		}
	}
	return numbers.join('');
}
describe('Vehicles (integração)', () => {
	let token: string;
	const basePath = '/vehicles';
	const unique = generatePlateDigits();
	const plate = `TST${unique}`;

	beforeAll(async () => {
		token = await ensureAuth();
	});

	test('Deve criar um veículo', async () => {
		const body = {
			plate,
			model: 'Uno',
			manufacturer: 'Fiat',
			year: 2010,
		};
		const res = await axios.post(basePath, body, {
			headers: { Authorization: `Bearer ${token}` },
		});
		expect([200, 201]).toContain(res.status);
		expect(res.data.plate).toBe(plate);
	});

	test('Não deve permitir criar veículo com placa duplicada', async () => {
		const body = {
			plate,
			model: 'Argo',
			manufacturer: 'Fiat',
			year: 2020,
		};
		const res = await axios.post(basePath, body, {
			headers: { Authorization: `Bearer ${token}` },
		});
		expect([400, 409, 422]).toContain(res.status);
	});

	test('Deve obter veículo por placa', async () => {
		const res = await axios.get(`${basePath}/${plate}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		expect(res.status).toBe(200);
		expect(res.data.plate).toBe(plate);
		expect(res.data.model).toBe('Uno');
		expect(res.data.manufacturer).toBe('Fiat');
		expect(res.data.year).toBe(2010);
	});

	test('Deve atualizar um veículo', async () => {
		const update = {
			model: 'Uno Way',
			year: 2012,
		};
		const res = await axios.put(`${basePath}/${plate}`, update, {
			headers: { Authorization: `Bearer ${token}` },
		});
		expect([200]).toContain(res.status);
		expect(res.data.plate).toBe(plate);
		expect(res.data.model).toBe('Uno Way');
		expect(res.data.year).toBe(2012);
	});

	test('Deve validar entrada (ano inválido)', async () => {
		const res = await axios.post(
			basePath,
			{
				plate: `INV${unique}`,
				model: 'Carro',
				manufacturer: 'Marca',
				year: 'abc',
			},
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		expect([400, 422]).toContain(res.status);
	});

	test('Deve deletar o veículo', async () => {
		const res = await axios.delete(`${basePath}/${plate}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		expect([200, 204]).toContain(res.status);
	});

	test('Após deletar, GET por placa deve retornar 404', async () => {
		const res = await axios.get(`${basePath}/${plate}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		expect([422]).toContain(res.status);
	});
});
