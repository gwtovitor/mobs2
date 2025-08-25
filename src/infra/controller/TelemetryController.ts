import { TelemetryStore } from '../../domain/Telemetry';
import HttpServer, { HttpMethods, Middleware } from '../http/HttpServer';

export default class TelemetryController {
  static config(http: HttpServer, store: TelemetryStore, auth: Middleware) {
    http.route(
      HttpMethods.get,
      '/telemetry/:plate',
      async ({ params, query }: any) => {
        const limit = query?.limit ? Number(query.limit) : 50;
        const history = await store.getHistory(params.plate, limit);
        return { plate: params.plate, history };
      },
      [auth]
    );
  }
}
