import { useState, useEffect, useCallback, useRef } from "react";
import type { AresPressData, ConnectionStatus, LogEntry, LogLevel } from "@/types/ares";

const DEFAULT_WS_URL = "ws://192.168.0.120:81";
const MAX_LOGS = 50;

const INITIAL_DATA: AresPressData = {
  estado: "PARADO",
  comandos: { subir: 0, descer: 0, parar: 0 },
  seguranca: { estop: 0, cortina: 0, topo: 0, base: 0, proximidade: 0 },
  sensores: { pressao_psi: 0, curso_cm: 0 },
  kpi: { ciclos: 0, uptime_s: 0, paradas: 0 },
};

function generateMockData(): AresPressData {
  const estados: AresPressData["estado"][] = ["PARADO", "SUBINDO", "DESCENDO"];
  return {
    estado: estados[Math.floor(Math.random() * estados.length)],
    comandos: {
      subir: Math.random() > 0.7 ? 1 : 0,
      descer: Math.random() > 0.7 ? 1 : 0,
      parar: Math.random() > 0.8 ? 1 : 0,
    },
    seguranca: {
      estop: 0,
      cortina: Math.random() > 0.9 ? 1 : 0,
      topo: Math.random() > 0.5 ? 1 : 0,
      base: Math.random() > 0.5 ? 1 : 0,
      proximidade: Math.random() > 0.7 ? 1 : 0,
    },
    sensores: {
      pressao_psi: Math.round(Math.random() * 3000 * 100) / 100,
      curso_cm: Math.round(Math.random() * 30 * 100) / 100,
    },
    kpi: {
      ciclos: Math.floor(Math.random() * 500),
      uptime_s: Math.floor(Math.random() * 86400),
      paradas: Math.floor(Math.random() * 20),
    },
  };
}

function createLogEntry(level: LogLevel, message: string, source: string): LogEntry {
  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    timestamp: new Date(),
    level,
    message,
    source,
  };
}

export function useAresPressSocket() {
  const [data, setData] = useState<AresPressData>(INITIAL_DATA);
  const [status, setStatus] = useState<ConnectionStatus>("desconectado");
  const [mockMode, setMockMode] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [lastRawMessage, setLastRawMessage] = useState<string>("");
  const [wsUrl, setWsUrl] = useState(() => localStorage.getItem("ares_ws_url") || DEFAULT_WS_URL);

  const wsRef = useRef<WebSocket | null>(null);
  const mockIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevDataRef = useRef<AresPressData>(INITIAL_DATA);

  const addLog = useCallback((level: LogLevel, message: string, source: string) => {
    setLogs((prev) => {
      const newLog = createLogEntry(level, message, source);
      const updated = [newLog, ...prev];
      return updated.slice(0, MAX_LOGS);
    });
  }, []);

  const detectChanges = useCallback(
    (newData: AresPressData) => {
      const prev = prevDataRef.current;

      if (prev.estado !== newData.estado) {
        const level: LogLevel = newData.estado === "EMERGENCIA" || newData.estado === "BLOQUEADO" ? "ALERTA" : "INFO";
        addLog(level, `Estado alterado: ${prev.estado} → ${newData.estado}`, "Sistema");
      }

      const segKeys = ["estop", "cortina", "topo", "base", "proximidade"] as const;
      for (const key of segKeys) {
        if (prev.seguranca[key] !== newData.seguranca[key]) {
          const label =
            key === "estop" ? "Parada de Emergência" :
            key === "cortina" ? "Cortina de Segurança" :
            key === "topo" ? "Fim de Curso Superior" :
            key === "base" ? "Fim de Curso Inferior" :
            "Sensor de Proximidade";
          const value = newData.seguranca[key];
          const level: LogLevel = (key === "estop" && value === 1) || (key === "proximidade" && value === 1) ? "ALERTA" : "INFO";
          addLog(level, `${label}: ${value === 1 ? "ATIVO" : "INATIVO"}`, "Segurança");
        }
      }

      prevDataRef.current = newData;
    },
    [addLog]
  );

  const saveWsUrl = useCallback((url: string) => {
    setWsUrl(url);
    localStorage.setItem("ares_ws_url", url);
  }, []);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus("conectado");
        addLog("INFO", "Conexão WebSocket estabelecida", "Comunicação");
      };

      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data as string) as AresPressData;
          setLastRawMessage(event.data as string);
          detectChanges(parsed);
          setData(parsed);
        } catch {
          addLog("ALERTA", "Mensagem WebSocket inválida", "Comunicação");
        }
      };

      ws.onclose = () => {
        setStatus("desconectado");
        addLog("INFO", "Conexão WebSocket encerrada", "Comunicação");
      };

      ws.onerror = () => {
        setStatus("desconectado");
        addLog("ALERTA", "Erro na conexão WebSocket", "Comunicação");
      };
    } catch {
      setStatus("desconectado");
      addLog("ALERTA", "Falha ao criar conexão WebSocket", "Comunicação");
    }
  }, [wsUrl, addLog, detectChanges]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const toggleMock = useCallback(() => {
    setMockMode((prev) => {
      const next = !prev;
      if (next) {
        setStatus("mock");
        addLog("INFO", "Modo MOCK ativado", "Sistema");
      } else {
        setStatus("desconectado");
        addLog("INFO", "Modo MOCK desativado", "Sistema");
      }
      return next;
    });
  }, [addLog]);

  // Mock data generation
  useEffect(() => {
    if (mockMode && status !== "conectado") {
      mockIntervalRef.current = setInterval(() => {
        const mockData = generateMockData();
        detectChanges(mockData);
        setData(mockData);
        setLastRawMessage(JSON.stringify(mockData, null, 2));
      }, 2000);
    }

    return () => {
      if (mockIntervalRef.current) {
        clearInterval(mockIntervalRef.current);
        mockIntervalRef.current = null;
      }
    };
  }, [mockMode, status, detectChanges]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
      if (mockIntervalRef.current) clearInterval(mockIntervalRef.current);
    };
  }, [disconnect]);

  return {
    data,
    status,
    mockMode,
    logs,
    lastRawMessage,
    wsUrl,
    saveWsUrl,
    connectWebSocket,
    disconnect,
    toggleMock,
    addLog,
  };
}
