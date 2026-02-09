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
} from "lucide-react";

const estadoColors: Record<string, string> = {
  PARADO: "bg-muted text-muted-foreground",
  SUBINDO: "bg-success/20 text-success border-success/30 glow-success",
  DESCENDO: "bg-info/20 text-info border-info/30",
  EMERGENCIA: "bg-destructive/20 text-destructive border-destructive/30 glow-destructive animate-pulse-glow",
  BLOQUEADO: "bg-warning/20 text-warning border-warning/30 glow-warning",
};

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

const DashboardPage = () => {
  const { data, status, mockMode, toggleMock } = useAres();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Monitoramento em tempo real</p>
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

      {/* Status Geral */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <Gauge className="h-4 w-4" />
              Pressão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-mono font-bold text-primary">
              {data.sensores.pressao_psi.toFixed(1)}
              <span className="text-sm text-muted-foreground ml-1">PSI</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              Curso
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
