import { useState, useEffect, useCallback, useRef } from "react";
import type { AresPressData } from "@/types/ares";
import type { Alarme, NivelRisco, StatusGeral, IndicadoresMensal, SafeTrackState } from "@/types/safetrack";

const MAX_ALARMES = 200;
const INDICE_INICIAL = 100;

function criarAlarme(tipo: string, sensor: string, nivel: NivelRisco, descricao: string): Alarme {
  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    timestamp: new Date(),
    tipo,
    sensor,
    nivelRisco: nivel,
    descricao,
    status: "ativo",
  };
}

function calcularStatusGeral(indice: number): StatusGeral {
  if (indice >= 70) return "VERDE";
  if (indice >= 40) return "AMARELO";
  return "VERMELHO";
}

function gerarIndicadoresMock(): IndicadoresMensal[] {
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const now = new Date();
  const mesAtual = now.getMonth();
  return meses.slice(0, mesAtual + 1).map((mes, i) => {
    const graves = Math.floor(Math.random() * 3);
    const moderadas = Math.floor(Math.random() * 8);
    const leves = Math.floor(Math.random() * 15);
    return {
      mes,
      totalFalhas: graves + moderadas + leves,
      falhasGraves: graves,
      falhasModeradas: moderadas,
      falhasLeves: leves,
      mtbfHoras: Math.round(50 + Math.random() * 150),
      indiceSeguranca: Math.round(60 + Math.random() * 40),
      indiceConformidade: Math.round(70 + Math.random() * 30),
    };
  });
}

export function useSafeTrack(data: AresPressData) {
  const [indiceSeguranca, setIndiceSeguranca] = useState(INDICE_INICIAL);
  const [alarmes, setAlarmes] = useState<Alarme[]>([]);
  const [temperaturaOleo, setTemperaturaOleo] = useState(42);
  const [indicadoresMensal] = useState<IndicadoresMensal[]>(() => gerarIndicadoresMock());
  const prevDataRef = useRef<AresPressData | null>(null);

  const adicionarAlarme = useCallback((tipo: string, sensor: string, nivel: NivelRisco, descricao: string) => {
    const alarme = criarAlarme(tipo, sensor, nivel, descricao);
    setAlarmes((prev) => [alarme, ...prev].slice(0, MAX_ALARMES));

    // Atualizar índice de segurança
    setIndiceSeguranca((prev) => {
      const penalidade = nivel === "grave" ? 20 : nivel === "moderado" ? 5 : 1;
      return Math.max(0, prev - penalidade);
    });
  }, []);

  const resolverAlarme = useCallback((id: string) => {
    setAlarmes((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "resolvido" as const, resolvidoEm: new Date() } : a))
    );
  }, []);

  const resetarIndice = useCallback(() => {
    setIndiceSeguranca(INDICE_INICIAL);
  }, []);

  // Classificação automática de riscos
  useEffect(() => {
    const prev = prevDataRef.current;
    if (!prev) {
      prevDataRef.current = data;
      return;
    }

    // E-Stop acionado
    if (prev.seguranca.estop === 0 && data.seguranca.estop === 1) {
      adicionarAlarme("Emergência", "E-Stop", "grave", "Botão de emergência acionado. Máquina em parada total.");
    }

    // Cortina violada durante ciclo
    if (prev.seguranca.cortina === 0 && data.seguranca.cortina === 1) {
      const duranteCiclo = data.estado === "DESCENDO" || data.estado === "SUBINDO";
      adicionarAlarme(
        "Proteção",
        "Cortina de Segurança",
        duranteCiclo ? "grave" : "moderado",
        duranteCiclo
          ? "Cortina violada durante ciclo ativo! Risco grave de acidente."
          : "Cortina de segurança ativada. Verificar área de operação."
      );
    }

    // Proximidade detectada
    if (prev.seguranca.proximidade === 0 && data.seguranca.proximidade === 1) {
      adicionarAlarme("Presença", "Sensor Proximidade", "moderado", "Presença detectada na zona de operação.");
    }

    // Pressão excessiva (> 2500 PSI)
    if (prev.sensores.pressao_psi <= 2500 && data.sensores.pressao_psi > 2500) {
      adicionarAlarme("Sobrepressão", "Sensor Pressão", "moderado", `Pressão acima do limite: ${data.sensores.pressao_psi.toFixed(0)} PSI.`);
    }

    // Estado de emergência
    if (prev.estado !== "EMERGENCIA" && data.estado === "EMERGENCIA") {
      adicionarAlarme("Sistema", "Estado", "grave", "Sistema entrou em estado de EMERGÊNCIA.");
    }

    // Bloqueio
    if (prev.estado !== "BLOQUEADO" && data.estado === "BLOQUEADO") {
      adicionarAlarme("Bloqueio", "Estado", "moderado", "Sistema bloqueado. Verificar condições de segurança.");
    }

    prevDataRef.current = data;
  }, [data, adicionarAlarme]);

  // Simular temperatura do óleo
  useEffect(() => {
    const interval = setInterval(() => {
      setTemperaturaOleo((prev) => {
        const base = data.estado === "PARADO" ? -0.3 : 0.2;
        return Math.max(25, Math.min(85, prev + base + (Math.random() - 0.5) * 1.5));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [data.estado]);

  // Recuperar índice lentamente quando tudo está seguro
  useEffect(() => {
    const interval = setInterval(() => {
      const isSeguro =
        data.seguranca.estop === 0 &&
        data.seguranca.cortina === 0 &&
        data.seguranca.proximidade === 0 &&
        data.estado !== "EMERGENCIA" &&
        data.estado !== "BLOQUEADO";
      if (isSeguro && indiceSeguranca < 100) {
        setIndiceSeguranca((prev) => Math.min(100, prev + 0.5));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [data, indiceSeguranca]);

  const statusGeral = calcularStatusGeral(indiceSeguranca);

  const state: SafeTrackState = {
    indiceSeguranca,
    statusGeral,
    alarmes,
    indicadoresMensal,
    temperaturaOleo,
  };

  return {
    ...state,
    adicionarAlarme,
    resolverAlarme,
    resetarIndice,
  };
}
