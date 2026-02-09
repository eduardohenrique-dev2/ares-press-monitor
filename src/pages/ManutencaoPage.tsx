import { useState } from "react";
import { useAres } from "@/contexts/AresContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Wrench, RotateCw, AlertTriangle, ShieldCheck, ClipboardList } from "lucide-react";

const checklistItems = [
  "Verificar nível de óleo hidráulico",
  "Inspecionar mangueiras e conexões",
  "Testar botão de emergência (E-Stop)",
  "Verificar cortina de segurança",
  "Checar sensores de fim de curso",
  "Inspecionar sensor de proximidade",
  "Verificar alinhamento do cilindro",
  "Lubrificar guias e eixos",
  "Testar comunicação ESP32/Wi-Fi",
  "Verificar aterramento elétrico",
];

const ManutencaoPage = () => {
  const { data, logs } = useAres();
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [notes, setNotes] = useState("");

  const alertCount = logs.filter((l) => l.level === "ALERTA").length;
  const completedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Wrench className="h-6 w-6 text-primary" />
          Manutenção Industrial
        </h1>
        <p className="text-muted-foreground text-sm">
          Controle preventivo e indicadores de manutenção conforme NR-12
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <RotateCw className="h-4 w-4" /> Ciclos Realizados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-mono font-bold text-foreground">{data.kpi.ciclos}</p>
            <p className="text-xs text-muted-foreground mt-1">Próxima manutenção: a cada 500 ciclos</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> Falhas Registradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-mono font-bold text-foreground">{alertCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Alertas na sessão atual</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-mono font-bold text-foreground">
              {completedCount}/{checklistItems.length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {completedCount === checklistItems.length ? "✓ Manutenção completa" : "Itens pendentes"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardList className="h-5 w-5" /> Checklist de Manutenção Preventiva
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {checklistItems.map((item, i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer group">
                <Checkbox
                  checked={!!checked[i]}
                  onCheckedChange={(v) => setChecked((prev) => ({ ...prev, [i]: !!v }))}
                />
                <span className={`text-sm transition-colors ${checked[i] ? "text-muted-foreground line-through" : "text-foreground"}`}>
                  {item}
                </span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base">Observações Técnicas</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Registre observações de manutenção, inspeções realizadas, peças substituídas..."
            className="bg-secondary border-border min-h-[120px] font-mono text-sm"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ManutencaoPage;
