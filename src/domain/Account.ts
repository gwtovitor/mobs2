export default class Account {
	
    constructor(
		readonly accountId: string,
		readonly name: string,
		readonly email: string,
		readonly password: string
	) {
		if (!this.isValidName(name)) throw new Error('Invalid name');
		if (!this.isValidEmail(email)) throw new Error('Invalid email');
		if (!this.isValidPassword(password))
			throw new Error('Invalid password');
	}

	static create(name: string, email: string, password: string) {
		const accountId = crypto.randomUUID();
		return new Account(accountId, name, email, password);
	}

	isValidName(name: string) {
		return /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ]+)+$/.test(
			name.trim()
		);
	}
	isValidEmail(email: string) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}
	isValidPassword(password: string) {
		if (password.length < 8) return false;
		if (!/\d/.test(password)) return false;
		if (!/[a-z]/.test(password)) return false;
		if (!/[A-Z]/.test(password)) return false;
		if (!/[^\w\s]/.test(password)) return false;
		return true;
	}
}
