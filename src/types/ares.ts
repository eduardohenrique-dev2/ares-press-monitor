// Tipos do sistema ARES Industrial Press

export interface ComandosData {
  subir: 0 | 1;
  descer: 0 | 1;
  parar: 0 | 1;
}

export interface SegurancaData {
  estop: 0 | 1;
  cortina: 0 | 1;
  topo: 0 | 1;
  base: 0 | 1;
  proximidade: 0 | 1;
}

export interface SensoresData {
  pressao_psi: number;
  curso_cm: number;
}

export interface KpiData {
  ciclos: number;
  uptime_s: number;
  paradas: number;
}

export type EstadoPrensa = "PARADO" | "SUBINDO" | "DESCENDO" | "EMERGENCIA" | "BLOQUEADO";

export interface AresPressData {
  estado: EstadoPrensa;
  comandos: ComandosData;
  seguranca: SegurancaData;
  sensores: SensoresData;
  kpi: KpiData;
}

export type LogLevel = "INFO" | "ALERTA";

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  source: string;
}

export type ConnectionStatus = "conectado" | "desconectado" | "mock";
