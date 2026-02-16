// ARES SafeTrack – Tipos do módulo de monitoramento e conformidade

export type NivelRisco = "grave" | "moderado" | "leve";
export type StatusAlarme = "ativo" | "resolvido";
export type StatusGeral = "VERDE" | "AMARELO" | "VERMELHO";

export interface Alarme {
  id: string;
  timestamp: Date;
  tipo: string;
  sensor: string;
  nivelRisco: NivelRisco;
  descricao: string;
  status: StatusAlarme;
  resolvidoEm?: Date;
}

export interface IndicadoresMensal {
  mes: string;
  totalFalhas: number;
  falhasGraves: number;
  falhasModeradas: number;
  falhasLeves: number;
  mtbfHoras: number;
  indiceSeguranca: number;
  indiceConformidade: number;
}

export interface SafeTrackState {
  indiceSeguranca: number;
  statusGeral: StatusGeral;
  alarmes: Alarme[];
  indicadoresMensal: IndicadoresMensal[];
  temperaturaOleo: number;
}
