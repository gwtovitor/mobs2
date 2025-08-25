import { WebSocketServer, WebSocket, RawData } from 'ws';
import { Server, IncomingMessage } from 'http';
import { URL } from 'url';
import { TokenService } from '../../domain/Security';
import { TelemetryPublisher, TelemetryStore, TelemetryPoint } from '../../domain/Telemetry';

type ClientCtx = {
  socket: WebSocket;
  accountId: string;

  plates: Set<string>;
};

export class WsAdapter implements TelemetryPublisher {
  private wss: WebSocketServer;
  private clients = new Set<ClientCtx>();

  constructor(
    httpServer: Server,
    private readonly tokens: TokenService,
    private readonly store: TelemetryStore,
    path = '/ws'
  ) {
    this.wss = new WebSocketServer({ server: httpServer, path });
    this.wss.on('connection', (socket, req) => this.handleConnection(socket, req));
  }

  private handleConnection(socket: WebSocket, req: IncomingMessage) {
    const accountId = this.authenticate(req, socket);
    if (!accountId) return;

    const ctx: ClientCtx = { socket, accountId, plates: new Set() };
    this.clients.add(ctx);

    socket.on('message', (raw: RawData) => this.handleMessage(ctx, raw));
    socket.on('close', () => this.clients.delete(ctx));
  }

  private authenticate(req: IncomingMessage, socket: WebSocket): string | null {
    try {
      const url = new URL(req.url || '', 'http://localhost');
      const token = url.searchParams.get('token');
      if (!token) throw new Error('no token');
      const payload = this.tokens.verify<{ sub: string }>(token);
      if (!payload?.sub) throw new Error('no sub');
      return payload.sub;
    } catch {
      socket.close(1008, 'Unauthorized');
      return null;
    }
  }

  private async handleMessage(ctx: ClientCtx, raw: RawData) {
    let msg: any;
    try { msg = JSON.parse(raw.toString()); } catch { return; }

    switch (msg.type) {
      case 'subscribe': {
        if (!msg.plate) {
          ctx.plates.clear();
        } else {
          ctx.plates.add(String(msg.plate).toUpperCase());
        }
        break;
      }
      case 'unsubscribe': {
        if (!msg.plate) {
          ctx.plates = new Set();
        } else {
          ctx.plates.delete(String(msg.plate).toUpperCase());
        }
        break;
      }
      case 'history': {
        if (!msg.plate) return;
        const plate = String(msg.plate);
        const limit = msg.limit ?? 50;
        const history = await Promise.resolve(this.store.getHistory(plate, limit));
        this.safeSend(ctx.socket, { type: 'telemetry-batch', plate, history });
        break;
      }
      default:
        break;
    }
  }

  publish(point: TelemetryPoint): void {
    for (const c of this.clients) {
      if (c.socket.readyState !== WebSocket.OPEN) continue;
      if (c.plates.size > 0 && !c.plates.has(point.plate.toUpperCase())) continue;
      this.safeSend(c.socket, { type: 'telemetry', data: point });
    }
  }

  private safeSend(socket: WebSocket, data: any) {
    try { socket.send(JSON.stringify(data)); } catch { /* noop */ }
  }
}
