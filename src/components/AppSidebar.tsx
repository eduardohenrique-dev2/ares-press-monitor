import {
  LayoutDashboard,
  Radio,
  ShieldAlert,
  ScrollText,
  Wrench,
  Leaf,
  LogOut,
  Bell,
  BarChart3,
  FileText,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import logoAres from "@/assets/logo_ARES.png";

const navPrincipal = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Comunicação", url: "/comunicacao", icon: Radio },
  { title: "Segurança NR-12", url: "/seguranca", icon: ShieldAlert },
  { title: "Logs & Eventos", url: "/logs", icon: ScrollText },
  { title: "Manutenção", url: "/manutencao", icon: Wrench },
  { title: "Ambiente", url: "/ambiente", icon: Leaf },
];

const navSafeTrack = [
  { title: "Alarmes", url: "/alarmes", icon: Bell },
  { title: "Indicadores", url: "/indicadores", icon: BarChart3 },
  { title: "Relatórios", url: "/relatorios", icon: FileText },
];

export function AppSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("ares_auth");
    navigate("/login");
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
        <img src={logoAres} alt="ARES" className="h-8" />
        <div className="min-w-0">
          <p className="text-sm font-bold text-sidebar-primary truncate">ARES Press</p>
          <p className="text-xs text-sidebar-foreground/60">SafeTrack</p>
        </div>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider">
            Navegação
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navPrincipal.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-sidebar-accent/50 transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider">
            SafeTrack
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navSafeTrack.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-sidebar-accent/50 transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-sidebar-foreground/60 hover:text-destructive transition-colors w-full px-2 py-1.5 rounded-md hover:bg-sidebar-accent/30"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
