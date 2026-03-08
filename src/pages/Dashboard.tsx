import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Building2, Users, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const statCards = [
  { label: "Vendas do Mês", value: "R$ 4.2M", change: "+12%", icon: TrendingUp, positive: true },
  { label: "Lotes Disponíveis", value: "1.240", change: "-3%", icon: Building2, positive: false },
  { label: "Novos Clientes", value: "89", change: "+24%", icon: Users, positive: true },
  { label: "Receita Prevista", value: "R$ 12.8M", change: "+8%", icon: DollarSign, positive: true },
];

const Dashboard = () => {
  const { user, getVisibleWorkspaces } = useAuth();
  const navigate = useNavigate();
  const workspaces = getVisibleWorkspaces();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Olá, {user?.name.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Aqui está um resumo dos seus indicadores
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-card-hover transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                stat.positive 
                  ? "bg-primary/10 text-primary"
                  : "bg-accent/10 text-accent"
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Workspaces Grid */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Seus Workspaces</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map((ws, i) => (
            <motion.button
              key={ws.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
              onClick={() => navigate(`/workspace/${ws.id}`)}
              className="group rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all text-left"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{ws.name}</h3>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Clique para acessar os relatórios
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
