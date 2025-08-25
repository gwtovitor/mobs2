import AccountRepository from "../../infra/repository/AccountRepository";
import { PasswordHasher, TokenService } from "../../domain/Security";

export default class Login {
  constructor(
    private readonly accountDAO: AccountRepository,
    private readonly hasher: PasswordHasher,
    private readonly tokens: TokenService
  ) {}

  async execute(input: { email: string; password: string }): Promise<{ accessToken: string }> {
    const account = await this.accountDAO.getAccountByEmail(input.email);
    if (!account) throw new Error('Invalid credentials');
    const passwordVerfy = await this.hasher.compare(input.password, account.password);
    if (!passwordVerfy) throw new Error('Invalid credentials');
    const accessToken = this.tokens.sign(
      { sub: account.accountId, name: account.name, email: account.email },
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
    return { accessToken };
  }
}
