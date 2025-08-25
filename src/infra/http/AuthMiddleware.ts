import { Middleware } from './HttpServer';
import { TokenService } from '../../domain/Security';

export const makeAuthMiddleware = (tokens: TokenService): Middleware => {
  return (req, res, next) => {
    const auth = req.headers['authorization'] as string | undefined;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = auth.slice(7);
    try {
      const payload = tokens.verify<{ sub: string }>(token);
      (req as any).accountId = payload.sub;
      next();
    } catch {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
};
