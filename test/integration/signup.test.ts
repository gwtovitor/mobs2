import Signup from '../../src/application/usecase/Signup';
import Login from '../../src/application/usecase/Login';
import { AccountRepositoryMemory } from '../../src/infra/repository/AccountRepository';
import { PasswordHasher, TokenService } from '../../src/domain/Security';

class FakeHasher implements PasswordHasher {
  async hash(plain: string): Promise<string> {
    return `hashed:${plain}`;
  }
  async compare(plain: string, hashed: string): Promise<boolean> {
    return hashed === `hashed:${plain}`;
  }
}
class FakeTokens implements TokenService {
  sign(payload: any, _options?: any): string {
    return `token-for:${payload.sub}`;
  }
  verify<T = any>(_token: string): T {
    return {} as T;
  }
}

let signup: Signup;
let login: Login;
let repo: AccountRepositoryMemory;
let hasher: FakeHasher;
let tokens: FakeTokens;

beforeEach(() => {
  repo = new AccountRepositoryMemory();
  hasher = new FakeHasher();
  tokens = new FakeTokens();
  signup = new Signup(repo, hasher);
  login = new Login(repo, hasher, tokens);
});

test('Deve criar uma conta e permitir login, retornando accessToken', async () => {
  const inputSignup = {
    name: 'Vitor Augusto',
    email: 'test@gmail.com',
    password: 'Senha123@',
  };

  const outputSignup = await signup.execute(inputSignup);
  expect(outputSignup.accountId).toBeDefined();

  const outputLogin = await login.execute({
    email: inputSignup.email,
    password: inputSignup.password,
  });

  expect(outputLogin.accessToken).toBe(`token-for:${outputSignup.accountId}`);

  const saved = await repo.getAccountById(outputSignup.accountId);
  expect(saved.password).toBe(`hashed:${inputSignup.password}`);
});

test('Não deve criar uma conta com nome inválido', async () => {
  const inputSignup = {
    name: 'Vitor', 
    email: 'test@gmail.com',
    password: 'Senha123@',
  };
  await expect(signup.execute(inputSignup)).rejects.toThrow('Invalid name');
});
