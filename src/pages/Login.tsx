import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BuritiLoader } from "@/components/BuritiLoader";
import { Eye, EyeOff, LogIn } from "lucide-react";
import logo from "@/assets/logo-buriti.png";

const Login = () => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || "Erro ao fazer login");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left - Branding */}
      <motion.div
        className="hidden lg:flex lg:w-1/2 gradient-dark relative overflow-hidden items-center justify-center"
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(82 56% 45%) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }} />
        </div>
        
        {/* Decorative shapes */}
        <motion.div
          className="absolute top-20 right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-20 h-48 w-48 rounded-full bg-accent/10 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="relative z-10 flex flex-col items-center gap-8 px-12 text-center">
          <motion.img
            src={logo}
            alt="Buriti Empreendimentos"
            className="h-24 w-auto drop-shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-sidebar-foreground">
              Portal de Inteligência
            </h2>
            <p className="mt-2 text-sidebar-muted text-sm max-w-sm">
              Acompanhe indicadores, métricas e dashboards de todos os empreendimentos em um único lugar.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right - Login Form */}
      <motion.div
        className="flex flex-1 items-center justify-center p-6 sm:p-12 bg-background"
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex justify-center lg:hidden">
            <img src={logo} alt="Buriti" className="h-16 w-auto" />
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-2xl font-bold text-foreground">Bem-vindo de volta</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Acesse sua conta para continuar
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                    {error}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 gradient-brand text-primary-foreground font-semibold shadow-brand hover:opacity-90 transition-opacity"
            >
              {isLoading ? (
                <BuritiLoader text="" />
              ) : (
                <>
                  <LogIn size={18} className="mr-2" />
                  Entrar
                </>
              )}
            </Button>
          </motion.form>

          <motion.div
            className="mt-8 rounded-lg border border-border bg-muted/50 p-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-xs font-semibold text-muted-foreground mb-2">Usuários de teste:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><span className="font-medium text-foreground">Admin:</span> admin@buriti.com / admin123</p>
              <p><span className="font-medium text-foreground">Gerente:</span> gerente@buriti.com / gerente123</p>
              <p><span className="font-medium text-foreground">Analista:</span> analista@buriti.com / analista123</p>
              <p><span className="font-medium text-foreground">Visualizador:</span> viewer@buriti.com / viewer123</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
