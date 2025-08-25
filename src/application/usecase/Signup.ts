import Account from '../../domain/Account';
import AccountRepository from '../../infra/repository/AccountRepository';
import { PasswordHasher } from '../../domain/Security';

export default class Signup {
  constructor(
    readonly accountDAO: AccountRepository,
    readonly hasher: PasswordHasher
  ) {}

  async execute(input: any): Promise<any> {
    const account = Account.create(input.name, input.email, input.password);
    const hashed = await this.hasher.hash(account.password);
    const toSave = new Account(account.accountId, account.name, account.email, hashed);
    await this.accountDAO.saveAccount(toSave);
    return { accountId: account.accountId };
  }
}
