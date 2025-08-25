import Account from '../../domain/Account';
import DatabaseConnection from '../database/DatabaseConnection';

export default interface AccountRepository {
	saveAccount(account: Account): Promise<void>;
	getAccountById(accountId: string): Promise<Account>;
	getAccountByEmail(email: string): Promise<Account | null>; // novo
}

export class AccountRepositoryDatabase implements AccountRepository {
	constructor(readonly connection: DatabaseConnection) {}

	async saveAccount(account: any): Promise<void> {
		await this.connection.query(
			`insert into mobs.account (account_id, name, email, password)
               values ($1, $2, $3, $4)`,
			[account.accountId, account.name, account.email, account.password]
		);
	}
	async getAccountById(accountId: string): Promise<Account> {
		const accountData = await this.connection.query(
			`select account_id as "accountId", name, email, password
			from mobs.account
			where account_id = $1`,
			[accountId]
		);
		if (!accountData) throw new Error('Account not found');
		return new Account(
			accountData.account_id,
			accountData.name,
			accountData.email,
			accountData.password
		);
	}
	async getAccountByEmail(email: string): Promise<Account | null> {
		const rows = await this.connection.query(
			`select account_id as "accountId", name, email, password
     from mobs.account where email = $1 limit 1`,
			[email]
		);
		const accountData = rows?.[0];
		if (!accountData) return null;
		return new Account(
			accountData.accountId,
			accountData.name,
			accountData.email,
			accountData.password
		);
	}
}

export class AccountRepositoryMemory implements AccountRepository {
  accounts: Account[] = [];

  async saveAccount(account: Account): Promise<void> {
    this.accounts.push(account);
  }

  async getAccountById(accountId: string): Promise<Account> {
    const account = this.accounts.find(a => a.accountId === accountId);
    if (!account) throw new Error('account not found');
    return account;
  }

  async getAccountByEmail(email: string): Promise<Account | null> {
    return this.accounts.find(a => a.email === email) ?? null;
  }
}