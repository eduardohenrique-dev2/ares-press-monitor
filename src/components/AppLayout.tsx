import { Navigate, Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAres } from "@/contexts/AresContext";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, FlaskConical } from "lucide-react";

const statusConfig = {
  conectado: { label: "ESP32 Online", icon: Wifi, className: "bg-success/20 text-success border-success/30" },
  desconectado: { label: "Desconectado", icon: WifiOff, className: "bg-destructive/20 text-destructive border-destructive/30" },
  mock: { label: "Modo MOCK", icon: FlaskConical, className: "bg-warning/20 text-warning border-warning/30" },
};

export default function AppLayout() {
  const isAuth = localStorage.getItem("ares_auth") === "true";
  const { status } = useAres();

  if (!isAuth) return <Navigate to="/login" replace />;

  const cfg = statusConfig[status];
  const StatusIcon = cfg.icon;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-card/50 backdrop-blur-sm shrink-0">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <span className="text-sm font-mono text-muted-foreground hidden sm:block">ARES SCADA</span>
            </div>
            <Badge variant="outline" className={`gap-1.5 ${cfg.className}`}>
              <StatusIcon className="h-3.5 w-3.5" />
              {cfg.label}
            </Badge>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
