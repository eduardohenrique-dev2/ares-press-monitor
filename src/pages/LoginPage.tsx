import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Shield, Lock } from "lucide-react";
import logoAres from "@/assets/logo_ARES.png";

const LoginPage = () => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === "ares" && pass === "ares2025") {
      localStorage.setItem("ares_auth", "true");
      navigate("/dashboard");
    } else {
      setError("Credenciais inválidas. Use: ares / ares2025");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <img src={logoAres} alt="ARES Industrial Press" className="h-20 mx-auto" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">ARES Industrial Press</h1>
            <p className="text-muted-foreground text-sm">Painel Supervisório SCADA</p>
          </div>
        </div>

        <Card className="border-border bg-card">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 text-primary">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">Acesso Restrito — NR-12</span>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user" className="text-foreground">Usuário</Label>
                <Input
                  id="user"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  placeholder="Operador"
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pass" className="text-foreground">Senha</Label>
                <Input
                  id="pass"
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="••••••••"
                  className="bg-secondary border-border"
                />
              </div>
              {error && <p className="text-destructive text-sm">{error}</p>}
              <Button type="submit" className="w-full">
                <Lock className="mr-2 h-4 w-4" />
                Entrar no Painel
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Painel somente supervisório • Conforme NR-12
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
