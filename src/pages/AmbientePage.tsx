import { useAres } from "@/contexts/AresContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, ShieldCheck, Thermometer, Factory, GraduationCap, Camera, Droplets, Wind } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const useSimulatedSensors = () => {
  const [sensors, setSensors] = useState({
    temperatura: 24.5,
    umidade: 55,
    qualidadeAr: 42,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSensors((prev) => ({
        temperatura: Math.max(18, Math.min(38, prev.temperatura + (Math.random() - 0.5) * 0.8)),
        umidade: Math.max(30, Math.min(85, prev.umidade + (Math.random() - 0.5) * 2)),
        qualidadeAr: Math.max(0, Math.min(150, prev.qualidadeAr + (Math.random() - 0.5) * 5)),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return sensors;
};

const getAirQualityLabel = (value: number) => {
  if (value <= 50) return { label: "Boa", className: "bg-success/20 text-success border-success/30" };
  if (value <= 100) return { label: "Moderada", className: "bg-warning/20 text-warning border-warning/30" };
  return { label: "Ruim", className: "bg-destructive/20 text-destructive border-destructive/30" };
};

const AmbientePage = () => {
  const { data, status } = useAres();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const sensors = useSimulatedSensors();

  const modoTrabalho = status === "mock" ? "Demonstração / Educacional" : "Operacional";
  const airQuality = getAirQualityLabel(sensors.qualidadeAr);

  const toggleCamera = async () => {
    if (cameraActive) {
      const stream = videoRef.current?.srcObject as MediaStream | null;
      stream?.getTracks().forEach((t) => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
      setCameraActive(false);
      setCameraError(null);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
      setCameraError(null);
    } catch {
      setCameraError("Não foi possível acessar a câmera.");
    }
  };

  useEffect(() => {
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream | null;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

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

      {/* Camera Card - full width */}
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Camera className="h-5 w-5" /> Câmera de Monitoramento
          </CardTitle>
          <button
            onClick={toggleCamera}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
              cameraActive
                ? "bg-destructive/20 text-destructive hover:bg-destructive/30"
                : "bg-primary/20 text-primary hover:bg-primary/30"
            }`}
          >
            {cameraActive ? "Desligar" : "Ligar Câmera"}
          </button>
        </CardHeader>
        <CardContent>
          <div className="relative w-full aspect-video bg-black/60 rounded-md overflow-hidden flex items-center justify-center">
            <video
              ref={videoRef}
              className={`w-full h-full object-cover ${cameraActive ? "block" : "hidden"}`}
              muted
              playsInline
            />
            {!cameraActive && !cameraError && (
              <div className="text-center text-muted-foreground text-sm space-y-1">
                <Camera className="h-10 w-10 mx-auto opacity-30" />
                <p>Câmera desligada</p>
                <p className="text-xs">Clique em "Ligar Câmera" para iniciar o monitoramento</p>
              </div>
            )}
            {cameraError && (
              <p className="text-destructive text-sm">{cameraError}</p>
            )}
            {cameraActive && (
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                <span className="text-xs text-white font-mono bg-black/50 px-1.5 py-0.5 rounded">
                  AO VIVO
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Thermometer className="h-4 w-4" /> Temperatura
              </span>
              <span className="font-mono text-sm text-foreground">{sensors.temperatura.toFixed(1)} °C</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Droplets className="h-4 w-4" /> Umidade
              </span>
              <span className="font-mono text-sm text-foreground">{sensors.umidade.toFixed(0)} %</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Wind className="h-4 w-4" /> Qualidade do Ar (AQI)
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-foreground">{sensors.qualidadeAr.toFixed(0)}</span>
                <Badge variant="outline" className={airQuality.className}>
                  {airQuality.label}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AmbientePage;
