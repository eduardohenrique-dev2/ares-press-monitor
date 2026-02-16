import { useAres } from "@/contexts/AresContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Clock,
  Target,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";

const IndicadoresPage = () => {
  const { safeTrack } = useAres();
  const { indicadoresMensal, indiceSeguranca, alarmes } = safeTrack;

  const ultimoMes = indicadoresMensal[indicadoresMensal.length - 1];
  const totalFalhasMes = ultimoMes?.totalFalhas ?? 0;
  const mtbfMedio = ultimoMes?.mtbfHoras ?? 0;

  // Falha mais recorrente
  const contadorTipos: Record<string, number> = {};
  alarmes.forEach((a) => {
    contadorTipos[a.tipo] = (contadorTipos[a.tipo] || 0) + 1;
  });
  const falhaMaisRecorrente =
    Object.entries(contadorTipos).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  const indiceConformidade = ultimoMes?.indiceConformidade ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          Indicadores de Gestão — SafeTrack
        </h1>
        <p className="text-muted-foreground text-sm">
          Análise de desempenho, conformidade NR-12 e métricas de segurança
        </p>
      </div>

      {/* KPIs do Mês */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> Falhas no Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-mono font-bold text-foreground">{totalFalhasMes}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" /> MTBF (horas)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-mono font-bold text-foreground">{mtbfMedio}</p>
            <p className="text-xs text-muted-foreground">Tempo médio entre falhas</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" /> Falha Mais Recorrente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="bg-warning/20 text-warning border-warning/30 text-sm">
              {falhaMaisRecorrente}
            </Badge>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Conformidade NR-12
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-mono font-bold ${indiceConformidade >= 80 ? "text-success" : indiceConformidade >= 50 ? "text-warning" : "text-destructive"}`}>
              {indiceConformidade}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Falhas Mensais */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-5 w-5" /> Histórico de Falhas por Mês
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={indicadoresMensal}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 18%)" />
                <XAxis dataKey="mes" stroke="hsl(215 15% 55%)" fontSize={12} />
                <YAxis stroke="hsl(215 15% 55%)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(220 18% 11%)",
                    border: "1px solid hsl(220 15% 18%)",
                    borderRadius: "8px",
                    color: "hsl(210 20% 90%)",
                  }}
                />
                <Legend />
                <Bar dataKey="falhasGraves" name="Graves" fill="hsl(0 75% 55%)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="falhasModeradas" name="Moderadas" fill="hsl(38 92% 50%)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="falhasLeves" name="Leves" fill="hsl(210 80% 55%)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Índice */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" /> Índice de Segurança e Conformidade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={indicadoresMensal}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 18%)" />
                <XAxis dataKey="mes" stroke="hsl(215 15% 55%)" fontSize={12} />
                <YAxis stroke="hsl(215 15% 55%)" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(220 18% 11%)",
                    border: "1px solid hsl(220 15% 18%)",
                    borderRadius: "8px",
                    color: "hsl(210 20% 90%)",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="indiceSeguranca" name="Segurança %" stroke="hsl(142 70% 42%)" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="indiceConformidade" name="Conformidade NR-12 %" stroke="hsl(185 70% 45%)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Índice em tempo real */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base">Índice de Segurança em Tempo Real</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="w-full bg-secondary rounded-full h-4 overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 rounded-full ${
                    indiceSeguranca >= 70
                      ? "bg-success"
                      : indiceSeguranca >= 40
                      ? "bg-warning"
                      : "bg-destructive"
                  }`}
                  style={{ width: `${indiceSeguranca}%` }}
                />
              </div>
            </div>
            <span className="text-2xl font-mono font-bold text-foreground w-20 text-right">
              {indiceSeguranca.toFixed(0)}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            O índice recupera automaticamente quando não há condições de risco ativas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default IndicadoresPage;
