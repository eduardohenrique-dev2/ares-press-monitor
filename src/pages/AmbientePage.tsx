import { useAres } from "@/contexts/AresContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, ShieldCheck, Thermometer, Factory, GraduationCap } from "lucide-react";

const AmbientePage = () => {
  const { data, status } = useAres();

  const modoTrabalho = status === "mock" ? "Demonstração / Educacional" : "Operacional";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          Ambiente Operacional
        </h1>
        <p className="text-muted-foreground text-sm">
          Condições do ambiente e modo de operação do sistema
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Factory className="h-5 w-5" /> Estado Geral do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Estado da Prensa</span>
              <Badge variant="outline" className="font-mono">{data.estado}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Conexão</span>
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
                {status}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Pressão Atual</span>
              <span className="font-mono text-sm text-foreground">{data.sensores.pressao_psi.toFixed(1)} PSI</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Curso Atual</span>
              <span className="font-mono text-sm text-foreground">{data.sensores.curso_cm.toFixed(2)} cm</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <GraduationCap className="h-5 w-5" /> Modo de Trabalho
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Modo Atual</span>
              <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                {modoTrabalho}
              </Badge>
            </div>
            <div className="bg-secondary rounded-md p-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {status === "mock"
                  ? "Sistema em modo de demonstração. Dados simulados estão sendo gerados para fins educacionais e de apresentação."
                  : "Sistema conectado ao ESP32. Monitoramento de dados reais em tempo real."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" /> Segurança do Ambiente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "E-Stop", safe: data.seguranca.estop === 0 },
              { label: "Cortina de Segurança", safe: data.seguranca.cortina === 0 },
              { label: "Sensor de Proximidade", safe: data.seguranca.proximidade === 0 },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <Badge
                  variant="outline"
                  className={
                    item.safe
                      ? "bg-success/20 text-success border-success/30"
                      : "bg-destructive/20 text-destructive border-destructive/30"
                  }
                >
                  {item.safe ? "OK" : "ALERTA"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Thermometer className="h-5 w-5" /> Sensores Ambientais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-secondary rounded-md p-4 text-center">
              <p className="text-muted-foreground text-sm">
                Preparado para integração futura com sensores de temperatura, umidade e qualidade do ar.
              </p>
              <Badge variant="outline" className="mt-3">Em desenvolvimento</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AmbientePage;
