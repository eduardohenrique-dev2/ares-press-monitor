import { useAres } from "@/contexts/AresContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, ShieldCheck, OctagonX, ScanLine, ArrowUpToLine, ArrowDownToLine, Eye } from "lucide-react";

interface SafetyCardProps {
  title: string;
  icon: React.ReactNode;
  active: boolean;
  safeText: string;
  riskText: string;
  description: string;
  critical: boolean;
}

const SafetyCard = ({ title, icon, active, safeText, riskText, description, critical }: SafetyCardProps) => {
  const isRisk = critical ? active : !active;

  return (
    <Card className={`border-border bg-card transition-shadow ${isRisk ? "glow-destructive border-destructive/30" : ""}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span className="flex items-center gap-2">
            {icon}
            {title}
          </span>
          <Badge
            variant="outline"
            className={
              isRisk
                ? "bg-destructive/20 text-destructive border-destructive/30"
                : "bg-success/20 text-success border-success/30"
            }
          >
            {isRisk ? "RISCO" : "SEGURO"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-success/10 rounded-md p-2 border border-success/20">
            <p className="text-success font-medium text-xs mb-1">✓ Condição Segura</p>
            <p className="text-foreground/80 text-xs">{safeText}</p>
          </div>
          <div className="bg-destructive/10 rounded-md p-2 border border-destructive/20">
            <p className="text-destructive font-medium text-xs mb-1">✕ Condição de Risco</p>
            <p className="text-foreground/80 text-xs">{riskText}</p>
          </div>
        </div>
        <div className="bg-secondary rounded-md p-3">
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        </div>
        <p className="text-xs text-muted-foreground">
          Estado atual: <span className="font-mono font-medium text-foreground">{active ? "ATIVO (1)" : "INATIVO (0)"}</span>
        </p>
      </CardContent>
    </Card>
  );
};

const SegurancaPage = () => {
  const { data } = useAres();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-primary" />
          Segurança & Sensores — NR-12
        </h1>
        <p className="text-muted-foreground text-sm">
          Dispositivos de segurança conforme Norma Regulamentadora NR-12 — Segurança no Trabalho em Máquinas e Equipamentos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SafetyCard
          title="Parada de Emergência (E-Stop)"
          icon={<OctagonX className="h-5 w-5 text-destructive" />}
          active={data.seguranca.estop === 1}
          critical={true}
          safeText="Botão não acionado. Máquina em condição operacional."
          riskText="Botão acionado! Máquina em parada de emergência. Todos os movimentos cessados."
          description="Dispositivo de segurança prioritário conforme NR-12 item 12.6. Deve ser de fácil acesso e com ação positiva. O acionamento interrompe imediatamente todas as funções perigosas da máquina."
        />

        <SafetyCard
          title="Cortina de Segurança"
          icon={<ScanLine className="h-5 w-5 text-warning" />}
          active={data.seguranca.cortina === 1}
          critical={true}
          safeText="Barreira óptica livre. Zona de perigo sem obstrução detectada."
          riskText="Obstrução detectada! Presença na zona de perigo. Movimento bloqueado."
          description="Dispositivo optoeletrônico de proteção (AOPD) conforme NR-12 item 12.38. Monitora a zona de perigo e impede o funcionamento quando detecta presença."
        />

        <SafetyCard
          title="Fim de Curso Superior"
          icon={<ArrowUpToLine className="h-5 w-5 text-info" />}
          active={data.seguranca.topo === 1}
          critical={false}
          safeText="Sensor ativo. Cilindro na posição superior (recuado)."
          riskText="Sensor inativo. Cilindro fora da posição superior."
          description="Sensor de posição que indica o recuo completo do cilindro hidráulico. Conforme NR-12, delimita o curso máximo superior para evitar danos mecânicos e garantir posicionamento seguro."
        />

        <SafetyCard
          title="Fim de Curso Inferior"
          icon={<ArrowDownToLine className="h-5 w-5 text-info" />}
          active={data.seguranca.base === 1}
          critical={false}
          safeText="Sensor ativo. Cilindro na posição inferior (avançado)."
          riskText="Sensor inativo. Cilindro fora da posição inferior."
          description="Sensor de posição que indica o avanço completo do cilindro hidráulico. Delimita o curso máximo inferior, prevenindo sobre-pressão e esmagamento."
        />

        <SafetyCard
          title="Sensor de Proximidade"
          icon={<Eye className="h-5 w-5 text-warning" />}
          active={data.seguranca.proximidade === 1}
          critical={true}
          safeText="Nenhuma presença detectada na zona de operação."
          riskText="Presença detectada! Operação deve ser interrompida por segurança."
          description="Sensor indutivo/capacitivo que detecta presença na zona de operação. Complementa a cortina de segurança como dispositivo adicional de proteção conforme NR-12, prevenindo acesso indevido à área de risco."
        />
      </div>

      <Card className="border-border bg-card">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div className="text-xs text-muted-foreground leading-relaxed">
              <p className="font-medium text-foreground mb-1">Nota de Segurança — NR-12</p>
              <p>
                Este painel é exclusivamente supervisório. Toda a lógica de segurança e controle de movimento está implementada 
                no controlador ESP32. O painel web não pode, em nenhuma hipótese, controlar ou interferir no funcionamento da máquina. 
                Conforme NR-12, o sistema de segurança não depende de software supervisório para sua operação.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SegurancaPage;
