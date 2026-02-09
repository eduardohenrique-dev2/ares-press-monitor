import { useAres } from "@/contexts/AresContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollText } from "lucide-react";

const LogsPage = () => {
  const { logs } = useAres();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <ScrollText className="h-6 w-6 text-primary" />
          Logs & Eventos
        </h1>
        <p className="text-muted-foreground text-sm">
          Registro cronológico de transições de estado (últimos 50 eventos)
        </p>
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-muted-foreground">
            {logs.length} evento{logs.length !== 1 ? "s" : ""} registrado{logs.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              Nenhum evento registrado. Ative o modo MOCK ou conecte ao ESP32.
            </p>
          ) : (
            <div className="space-y-1 max-h-[60vh] overflow-auto">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 px-3 py-2 rounded-md bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <Badge
                    variant="outline"
                    className={`shrink-0 text-xs mt-0.5 ${
                      log.level === "ALERTA"
                        ? "bg-destructive/20 text-destructive border-destructive/30"
                        : "bg-info/20 text-info border-info/30"
                    }`}
                  >
                    {log.level}
                  </Badge>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground">{log.message}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {log.timestamp.toLocaleTimeString("pt-BR")} • {log.source}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LogsPage;
