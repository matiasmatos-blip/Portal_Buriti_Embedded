import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldCheck, Eye, BarChart3 } from "lucide-react";

const mockUsers = [
  { name: "Carlos Administrador", email: "admin@buriti.com", role: "admin" },
  { name: "Maria Gerente", email: "gerente@buriti.com", role: "gerente" },
  { name: "João Analista", email: "analista@buriti.com", role: "analista" },
  { name: "Ana Visualizadora", email: "viewer@buriti.com", role: "visualizador" },
];

const roleConfig: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  admin: { label: "Admin", icon: Shield, className: "bg-accent/10 text-accent border-accent/20" },
  gerente: { label: "Gerente", icon: ShieldCheck, className: "bg-primary/10 text-primary border-primary/20" },
  analista: { label: "Analista", icon: BarChart3, className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  visualizador: { label: "Visualizador", icon: Eye, className: "bg-muted text-muted-foreground border-border" },
};

const AdminUsers = () => {
  const { user } = useAuth();
  if (user?.role !== "admin") return <Navigate to="/dashboard" replace />;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground">Gerenciar Usuários</h1>
      <p className="text-sm text-muted-foreground mt-1">Controle de acesso e permissões</p>

      <motion.div
        className="mt-8 rounded-xl border border-border bg-card overflow-hidden"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Usuário</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">E-mail</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Nível</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((u, i) => {
                const rc = roleConfig[u.role];
                const Icon = rc.icon;
                return (
                  <motion.tr
                    key={u.email}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 + i * 0.05 }}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full gradient-brand flex items-center justify-center text-xs font-bold text-primary-foreground">
                          {u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <span className="font-medium text-sm text-foreground">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{u.email}</td>
                    <td className="px-5 py-4">
                      <Badge variant="outline" className={`${rc.className} gap-1`}>
                        <Icon className="h-3 w-3" />
                        {rc.label}
                      </Badge>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminUsers;
