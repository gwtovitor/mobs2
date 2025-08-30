import Account from '../../src/domain/Account';

test('Deve criar uma conta', () => {
	const account = Account.create(
		'Vitor Augusto',
		'gwtovitorpw@gmail.com',
		'Vitor1997@'
	);
	expect(account).toBeDefined();
});
test('Nao deve criar uma conta com nome inválido', () => {
	expect(() =>
		Account.create('Vitor', 'gwtovitorpw@gmail.com', 'Vitor1997@')
	).toThrow(new Error('Invalid name'));
});
test('Nao deve criar uma conta com email inválido', () => {
	expect(() =>
		Account.create('Vitor Augusto', 'gwtovi', 'Vitor1997@')
	).toThrow(new Error('Invalid email'));
});
test('Nao deve criar uma conta com senha inválida', () => {
	expect(() =>
		Account.create('Vitor Augusto', 'gwtovitorpw@gmail.com', '123')
	).toThrow(new Error('Invalid password'));
});
