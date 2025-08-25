export interface TokenService {
  sign(payload: object, options?: { expiresIn?: string | number }): string;
  verify<T = any>(token: string): T;
}

export interface PasswordHasher {
  hash(plain: string): Promise<string>;
  compare(plain: string, hashed: string): Promise<boolean>;
}
