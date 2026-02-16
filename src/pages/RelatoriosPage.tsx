import { useState, useCallback } from "react";
import { useAres } from "@/contexts/AresContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, FileSpreadsheet, PenTool, Calendar, CheckCircle } from "lucide-react";

function formatDateBR(d: Date): string {
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const RelatoriosPage = () => {
  const { safeTrack, data, logs } = useAres();
  const { alarmes, indicadoresMensal, indiceSeguranca, statusGeral } = safeTrack;

  const [responsavel, setResponsavel] = useState("");
  const [geradoEm, setGeradoEm] = useState<Date | null>(null);

  const gerarCSV = useCallback(() => {
    const header = "Data/Hora,Tipo,Sensor,Nível,Status,Descrição\n";
    const rows = alarmes
      .map(
        (a) =>
          `"${a.timestamp.toLocaleString("pt-BR")}","${a.tipo}","${a.sensor}","${a.nivelRisco}","${a.status}","${a.descricao}"`
      )
      .join("\n");
    const csv = header + rows;
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ARES_SafeTrack_Alarmes_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [alarmes]);

  const gerarRelatorioPDF = useCallback(() => {
    const agora = new Date();
    const ultimoMes = indicadoresMensal[indicadoresMensal.length - 1];

    let conteudo = `
╔══════════════════════════════════════════════════════════╗
║          ARES SafeTrack — Relatório de Auditoria         ║
║          Monitoramento e Conformidade NR-12               ║
╚══════════════════════════════════════════════════════════╝

Data de Geração: ${formatDateBR(agora)}
Responsável: ${responsavel || "(Não informado)"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. RESUMO EXECUTIVO
───────────────────
• Estado Atual: ${data.estado}
• Status Geral: ${statusGeral}
• Índice de Segurança: ${indiceSeguranca.toFixed(0)}%
• Ciclos Realizados: ${data.kpi.ciclos}
• Tempo Ligado: ${Math.floor(data.kpi.uptime_s / 3600)}h ${Math.floor((data.kpi.uptime_s % 3600) / 60)}m
• Total de Paradas: ${data.kpi.paradas}

2. INDICADORES DO MÊS (${ultimoMes?.mes || "N/A"})
───────────────────
• Total de Falhas: ${ultimoMes?.totalFalhas ?? 0}
  - Graves: ${ultimoMes?.falhasGraves ?? 0}
  - Moderadas: ${ultimoMes?.falhasModeradas ?? 0}
  - Leves: ${ultimoMes?.falhasLeves ?? 0}
• MTBF: ${ultimoMes?.mtbfHoras ?? 0} horas
• Índice de Conformidade NR-12: ${ultimoMes?.indiceConformidade ?? 0}%

3. ALARMES DA SESSÃO (${alarmes.length} registros)
───────────────────
`;

    alarmes.slice(0, 50).forEach((a, i) => {
      conteudo += `  ${i + 1}. [${a.nivelRisco.toUpperCase()}] ${a.tipo} — ${a.sensor}\n`;
      conteudo += `     ${a.descricao}\n`;
      conteudo += `     ${a.timestamp.toLocaleString("pt-BR")} | Status: ${a.status}\n\n`;
    });

    conteudo += `
4. LOGS DO SISTEMA (${logs.length} eventos)
───────────────────
`;
    logs.slice(0, 30).forEach((l) => {
      conteudo += `  [${l.level}] ${l.timestamp.toLocaleTimeString("pt-BR")} — ${l.message} (${l.source})\n`;
    });

    conteudo += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ASSINATURA DIGITAL
Responsável: ${responsavel || "________________________"}
Data: ${formatDateBR(agora)}

Este relatório foi gerado automaticamente pelo sistema
ARES SafeTrack — Interface de Monitoramento e Conformidade.
Painel exclusivamente supervisório, conforme NR-12.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ARES_SafeTrack_Relatorio_${agora.toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setGeradoEm(agora);
  }, [alarmes, indicadoresMensal, indiceSeguranca, statusGeral, data, logs, responsavel]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Relatórios — SafeTrack
        </h1>
        <p className="text-muted-foreground text-sm">
          Geração de relatórios de auditoria e exportação de dados
        </p>
      </div>

      {/* Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground">Alarmes Registrados</p>
            <p className="text-2xl font-mono font-bold text-foreground">{alarmes.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground">Logs de Eventos</p>
            <p className="text-2xl font-mono font-bold text-foreground">{logs.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground">Índice Atual</p>
            <Badge
              variant="outline"
              className={
                statusGeral === "VERDE"
                  ? "bg-success/20 text-success border-success/30"
                  : statusGeral === "AMARELO"
                  ? "bg-warning/20 text-warning border-warning/30"
                  : "bg-destructive/20 text-destructive border-destructive/30"
              }
            >
              {statusGeral} — {indiceSeguranca.toFixed(0)}%
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Assinatura do Responsável */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <PenTool className="h-5 w-5" /> Assinatura do Responsável
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label className="text-foreground">Nome do Responsável Técnico</Label>
            <Input
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
              placeholder="Nome completo do técnico ou supervisor"
              className="bg-secondary border-border max-w-md"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            O nome será incluído como assinatura digital no relatório exportado.
          </p>
        </CardContent>
      </Card>

      {/* Ações de Exportação */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Download className="h-5 w-5" /> Exportar Dados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button onClick={gerarRelatorioPDF} className="gap-2">
              <FileText className="h-4 w-4" />
              Gerar Relatório de Auditoria
            </Button>
            <Button variant="outline" onClick={gerarCSV} className="gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Exportar Alarmes (CSV)
            </Button>
          </div>

          {geradoEm && (
            <div className="flex items-center gap-2 text-sm text-success">
              <CheckCircle className="h-4 w-4" />
              Relatório gerado em {formatDateBR(geradoEm)}
            </div>
          )}

          <div className="bg-secondary rounded-md p-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <Calendar className="h-3.5 w-3.5 inline mr-1" />
              O relatório inclui: resumo executivo, indicadores mensais, lista de alarmes (últimos 50),
              logs do sistema (últimos 30), e assinatura digital do responsável. Ideal para auditorias NR-12.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RelatoriosPage;
