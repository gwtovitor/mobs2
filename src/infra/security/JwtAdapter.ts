import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { TokenService } from '../../domain/Security';

export class JwtAdapter implements TokenService {
  constructor(private readonly secret: Secret) {}

  sign(payload: object, options?: SignOptions): string {
    return jwt.sign(payload, this.secret, options);
  }

  verify<T = any>(token: string): T {
    return jwt.verify(token, this.secret) as T;
  }
}
