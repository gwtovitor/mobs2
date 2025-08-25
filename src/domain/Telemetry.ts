export type TelemetryPoint = {
  plate: string;
  lat: number;
  lng: number;
  speed: number;
  fuel: number;  
  timestamp: number; 
};

export interface TelemetryStore {
  append(point: TelemetryPoint): Promise<void> | void;
  getHistory(plate: string, limit?: number): Promise<TelemetryPoint[]> | TelemetryPoint[];
}

export interface TelemetryPublisher {
  publish(point: TelemetryPoint): void;
}
