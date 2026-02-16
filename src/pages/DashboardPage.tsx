import { useAres } from "@/contexts/AresContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  ArrowUp,
  ArrowDown,
  Square,
  ShieldAlert,
  Eye,
  Gauge,
  Ruler,
  RotateCw,
  Clock,
  AlertTriangle,
  FlaskConical,
  Thermometer,
  ShieldCheck,
} from "lucide-react";

const estadoColors: Record<string, string> = {
  PARADO: "bg-muted text-muted-foreground",
  SUBINDO: "bg-success/20 text-success border-success/30 glow-success",
  DESCENDO: "bg-info/20 text-info border-info/30",
  EMERGENCIA: "bg-destructive/20 text-destructive border-destructive/30 glow-destructive animate-pulse-glow",
  BLOQUEADO: "bg-warning/20 text-warning border-warning/30 glow-warning",
};

const statusGeralColors = {
  VERDE: "bg-success/20 text-success border-success/30 glow-success",
  AMARELO: "bg-warning/20 text-warning border-warning/30 glow-warning",
  VERMELHO: "bg-destructive/20 text-destructive border-destructive/30 glow-destructive animate-pulse-glow",
};

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

const DashboardPage = () => {
  const { data, status, mockMode, toggleMock, safeTrack } = useAres();
  const { indiceSeguranca, statusGeral, temperaturaOleo, alarmes } = safeTrack;
  const alarmesAtivos = alarmes.filter((a) => a.status === "ativo").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard — SafeTrack</h1>
          <p className="text-muted-foreground text-sm">Monitoramento inteligente em tempo real</p>
        </div>
        <Button
          variant={mockMode ? "default" : "outline"}
          size="sm"
          onClick={toggleMock}
          className="gap-2"
        >
          <FlaskConical className="h-4 w-4" />
          {mockMode ? "MOCK Ativo" : "Ativar MOCK"}
        </Button>
      </div>

      {/* Status Geral + Índice de Segurança */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Status Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={`text-lg px-4 py-1 ${statusGeralColors[statusGeral]}`}>
              {statusGeral}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              {statusGeral === "VERDE" ? "Operação normal" : statusGeral === "AMARELO" ? "Atenção necessária" : "Condição crítica"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              Índice de Segurança
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-mono font-bold ${
              indiceSeguranca >= 70 ? "text-success" : indiceSeguranca >= 40 ? "text-warning" : "text-destructive"
            }`}>
              {indiceSeguranca.toFixed(0)}%
            </p>
            <div className="w-full bg-secondary rounded-full h-2 mt-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 rounded-full ${
                  indiceSeguranca >= 70 ? "bg-success" : indiceSeguranca >= 40 ? "bg-warning" : "bg-destructive"
                }`}
                style={{ width: `${indiceSeguranca}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Estado da Prensa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={`text-lg px-4 py-1 ${estadoColors[data.estado] || ""}`}>
              {data.estado}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Conexão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant="outline"
              className={
                status === "conectado"
                  ? "bg-success/20 text-success border-success/30"
                  : status === "mock"
                  ? "bg-warning/20 text-warning border-warning/30"
                  : "bg-destructive/20 text-destructive border-destructive/30"
              }
            >
              {status === "conectado" ? "Online" : status === "mock" ? "MOCK" : "Offline"}
            </Badge>
            {alarmesAtivos > 0 && (
              <Badge variant="outline" className="ml-2 bg-destructive/20 text-destructive border-destructive/30">
                {alarmesAtivos} alarme{alarmesAtivos > 1 ? "s" : ""}
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sensores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Gauge className="h-4 w-4" /> Pressão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-mono font-bold ${data.sensores.pressao_psi > 2500 ? "text-destructive" : "text-primary"}`}>
              {data.sensores.pressao_psi.toFixed(1)}
              <span className="text-sm text-muted-foreground ml-1">PSI</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Ruler className="h-4 w-4" /> Curso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-mono font-bold text-primary">
              {data.sensores.curso_cm.toFixed(2)}
              <span className="text-sm text-muted-foreground ml-1">cm</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Thermometer className="h-4 w-4" /> Temperatura do Óleo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-mono font-bold ${temperaturaOleo > 65 ? "text-destructive" : temperaturaOleo > 50 ? "text-warning" : "text-primary"}`}>
              {temperaturaOleo.toFixed(1)}
              <span className="text-sm text-muted-foreground ml-1">°C</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Comandos e Segurança */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Comandos (Visualização)</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Badge variant="outline" className={`gap-1 ${data.comandos.subir ? "bg-success/20 text-success border-success/30" : ""}`}>
              <ArrowUp className="h-3.5 w-3.5" /> Subir {data.comandos.subir ? "ON" : "OFF"}
            </Badge>
            <Badge variant="outline" className={`gap-1 ${data.comandos.descer ? "bg-info/20 text-info border-info/30" : ""}`}>
              <ArrowDown className="h-3.5 w-3.5" /> Descer {data.comandos.descer ? "ON" : "OFF"}
            </Badge>
            <Badge variant="outline" className={`gap-1 ${data.comandos.parar ? "bg-warning/20 text-warning border-warning/30" : ""}`}>
              <Square className="h-3.5 w-3.5" /> Parar {data.comandos.parar ? "ON" : "OFF"}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" /> Segurança NR-12
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {[
              { label: "E-Stop", value: data.seguranca.estop, critical: true },
              { label: "Cortina", value: data.seguranca.cortina, critical: true },
              { label: "Topo", value: data.seguranca.topo, critical: false },
              { label: "Base", value: data.seguranca.base, critical: false },
              { label: "Proximidade", value: data.seguranca.proximidade, critical: true },
            ].map((s) => (
              <Badge
                key={s.label}
                variant="outline"
                className={
                  s.value === 1
                    ? s.critical
                      ? "bg-destructive/20 text-destructive border-destructive/30"
                      : "bg-success/20 text-success border-success/30"
                    : "bg-muted text-muted-foreground"
                }
              >
                {s.value === 1 && s.critical && <AlertTriangle className="h-3 w-3 mr-1" />}
                {s.value === 1 && !s.critical && <Eye className="h-3 w-3 mr-1" />}
                {s.label}: {s.value ? "ATIVO" : "—"}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <RotateCw className="h-4 w-4" /> Ciclos Realizados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-mono font-bold text-foreground">{data.kpi.ciclos}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" /> Tempo Ligado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-mono font-bold text-foreground">{formatUptime(data.kpi.uptime_s)}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> Paradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-mono font-bold text-foreground">{data.kpi.paradas}</p>
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        ⚠️ Painel exclusivamente supervisório — Conforme NR-12, toda lógica de segurança reside no ESP32
      </p>
    </div>
  );
};

export default DashboardPage;
