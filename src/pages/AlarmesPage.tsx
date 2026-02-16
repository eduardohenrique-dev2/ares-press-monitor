import { useState, useMemo } from "react";
import { useAres } from "@/contexts/AresContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Bell, CheckCircle, Filter, XCircle } from "lucide-react";
import type { NivelRisco } from "@/types/safetrack";

const nivelColors: Record<NivelRisco, string> = {
  grave: "bg-destructive/20 text-destructive border-destructive/30",
  moderado: "bg-warning/20 text-warning border-warning/30",
  leve: "bg-info/20 text-info border-info/30",
};

const AlarmesPage = () => {
  const { safeTrack } = useAres();
  const { alarmes, resolverAlarme } = safeTrack;

  const [filtroNivel, setFiltroNivel] = useState<string>("todos");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [filtroBusca, setFiltroBusca] = useState("");

  const alarmesFiltrados = useMemo(() => {
    return alarmes.filter((a) => {
      if (filtroNivel !== "todos" && a.nivelRisco !== filtroNivel) return false;
      if (filtroStatus !== "todos" && a.status !== filtroStatus) return false;
      if (filtroBusca && !a.descricao.toLowerCase().includes(filtroBusca.toLowerCase()) && !a.sensor.toLowerCase().includes(filtroBusca.toLowerCase())) return false;
      return true;
    });
  }, [alarmes, filtroNivel, filtroStatus, filtroBusca]);

  const ativos = alarmes.filter((a) => a.status === "ativo").length;
  const graves = alarmes.filter((a) => a.nivelRisco === "grave" && a.status === "ativo").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Bell className="h-6 w-6 text-primary" />
          Alarmes — SafeTrack
        </h1>
        <p className="text-muted-foreground text-sm">
          Lista cronológica de alarmes com classificação de risco automática
        </p>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground">Total de Alarmes</p>
            <p className="text-2xl font-mono font-bold text-foreground">{alarmes.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground">Ativos</p>
            <p className="text-2xl font-mono font-bold text-warning">{ativos}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground">Graves Ativos</p>
            <p className="text-2xl font-mono font-bold text-destructive">{graves}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground">Resolvidos</p>
            <p className="text-2xl font-mono font-bold text-success">{alarmes.length - ativos}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Input
              placeholder="Buscar por sensor ou descrição..."
              value={filtroBusca}
              onChange={(e) => setFiltroBusca(e.target.value)}
              className="bg-secondary border-border max-w-xs"
            />
            <Select value={filtroNivel} onValueChange={setFiltroNivel}>
              <SelectTrigger className="w-[160px] bg-secondary border-border">
                <SelectValue placeholder="Nível de Risco" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Níveis</SelectItem>
                <SelectItem value="grave">Grave</SelectItem>
                <SelectItem value="moderado">Moderado</SelectItem>
                <SelectItem value="leve">Leve</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-[140px] bg-secondary border-border">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="resolvido">Resolvido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Alarmes */}
      <Card className="border-border bg-card">
        <CardContent className="pt-4">
          {alarmesFiltrados.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              Nenhum alarme registrado. Ative o modo MOCK para simular eventos.
            </p>
          ) : (
            <div className="space-y-2 max-h-[60vh] overflow-auto">
              {alarmesFiltrados.map((alarme) => (
                <div
                  key={alarme.id}
                  className={`flex items-start gap-3 px-4 py-3 rounded-md bg-secondary/50 hover:bg-secondary transition-colors ${
                    alarme.status === "resolvido" ? "opacity-60" : ""
                  }`}
                >
                  {alarme.nivelRisco === "grave" ? (
                    <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  ) : alarme.nivelRisco === "moderado" ? (
                    <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                  ) : (
                    <Bell className="h-5 w-5 text-info shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className={nivelColors[alarme.nivelRisco]}>
                        {alarme.nivelRisco.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {alarme.sensor}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          alarme.status === "ativo"
                            ? "bg-warning/20 text-warning border-warning/30"
                            : "bg-success/20 text-success border-success/30"
                        }
                      >
                        {alarme.status === "ativo" ? "ATIVO" : "RESOLVIDO"}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground mt-1">{alarme.descricao}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-1">
                      {alarme.timestamp.toLocaleString("pt-BR")}
                      {alarme.resolvidoEm && ` • Resolvido: ${alarme.resolvidoEm.toLocaleString("pt-BR")}`}
                    </p>
                  </div>
                  {alarme.status === "ativo" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resolverAlarme(alarme.id)}
                      className="shrink-0 gap-1 text-xs"
                    >
                      <CheckCircle className="h-3 w-3" />
                      Resolver
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AlarmesPage;
