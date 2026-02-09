import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AresProvider } from "@/contexts/AresContext";
import AppLayout from "@/components/AppLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ComunicacaoPage from "./pages/ComunicacaoPage";
import SegurancaPage from "./pages/SegurancaPage";
import LogsPage from "./pages/LogsPage";
import ManutencaoPage from "./pages/ManutencaoPage";
import AmbientePage from "./pages/AmbientePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AresProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="comunicacao" element={<ComunicacaoPage />} />
              <Route path="seguranca" element={<SegurancaPage />} />
              <Route path="logs" element={<LogsPage />} />
              <Route path="manutencao" element={<ManutencaoPage />} />
              <Route path="ambiente" element={<AmbientePage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AresProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
