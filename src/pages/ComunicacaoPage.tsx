import { useState } from "react";
import { useAres } from "@/contexts/AresContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Radio, Save, Plug, Unplug, FlaskConical, Terminal } from "lucide-react";

const ComunicacaoPage = () => {
  const { wsUrl, saveWsUrl, connectWebSocket, disconnect, status, mockMode, toggleMock, lastRawMessage } = useAres();
  const [urlInput, setUrlInput] = useState(wsUrl);

  const handleSave = () => {
    saveWsUrl(urlInput);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Radio className="h-6 w-6 text-primary" />
          Comunicação ESP32
        </h1>
        <p className="text-muted-foreground text-sm">Configuração e teste de conexão WebSocket</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base">Endereço WebSocket</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground">URL do WebSocket</Label>
              <Input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="ws://192.168.0.120:81"
                className="font-mono bg-secondary border-border"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} variant="outline" size="sm" className="gap-1">
                <Save className="h-4 w-4" /> Salvar
              </Button>
              <Button onClick={connectWebSocket} size="sm" className="gap-1">
                <Plug className="h-4 w-4" /> Conectar
              </Button>
              <Button onClick={disconnect} variant="outline" size="sm" className="gap-1">
                <Unplug className="h-4 w-4" /> Desconectar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base">Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Conexão:</span>
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
                {status === "conectado" ? "Conectado" : status === "mock" ? "Modo MOCK" : "Desconectado"}
              </Badge>
            </div>
            <div>
              <Button
                variant={mockMode ? "default" : "outline"}
                size="sm"
                onClick={toggleMock}
                className="gap-1"
              >
                <FlaskConical className="h-4 w-4" />
                {mockMode ? "Desativar MOCK" : "Ativar MOCK"}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                O modo MOCK simula dados para testes e apresentações
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Terminal className="h-4 w-4" /> Debug — Última Mensagem
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-secondary rounded-md p-4 text-xs font-mono text-foreground overflow-auto max-h-72 whitespace-pre-wrap">
            {lastRawMessage || "Nenhuma mensagem recebida"}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComunicacaoPage;
