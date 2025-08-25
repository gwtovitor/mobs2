import bcrypt from 'bcrypt';
import { PasswordHasher } from '../../domain/Security';

export class BcryptAdapter implements PasswordHasher {
  constructor(private readonly rounds: number = 10) {}
  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.rounds);
  }
  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
