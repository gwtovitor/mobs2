import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import http from 'http';

export type Middleware = (req: Request, res: Response, next: NextFunction) => unknown;

export default interface HttpServer {
  route(
    method: string,
    url: string,
    callback: Function,
    middlewares?: Middleware[]
  ): void;
  listen(port: number): void;
  getServer(): http.Server | undefined; 
}

export enum HttpMethods {
  get = 'get',
  post = 'post',
  put = 'put',
  delete = 'delete',
}

export class ExpressAdapter implements HttpServer {
  app: Express;
  private server?: http.Server;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
  }

  route(
    method: HttpMethods,
    url: string,
    callback: Function,
    middlewares: Middleware[] = []
  ): void {
    const wrapped = async (req: Request, res: Response) => {
      try {
        const output = await callback({
          params: req.params,
          body: req.body,
          headers: req.headers,
          query: req.query,
          req,
          res,
        });
        if (!res.headersSent) res.json(output);
      } catch (e: any) {
        if (!res.headersSent) res.status(422).json({ error: e.message });
      }
    };

    (this.app as any)[method](url, ...middlewares, wrapped);
  }

  listen(port: number): void {
    this.server = this.app.listen(port, () => {
      console.log(`Server running at port ${port}`);
    });
  }

  getServer(): http.Server | undefined {
    return this.server;
  }
}
