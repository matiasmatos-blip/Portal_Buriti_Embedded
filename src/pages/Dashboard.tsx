import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Building2, Users, ArrowUpRight, BarChart3 } from "lucide-react";
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
            transition={{ delay: i * 0.07 }}
            className="group relative rounded-2xl border border-border/60 bg-card p-5 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
          >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/[0.03] to-transparent rounded-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  stat.positive
                    ? "bg-primary/10 text-primary"
                    : "bg-accent/10 text-accent"
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Workspaces Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Seus Workspaces</h2>
          <span className="text-xs text-muted-foreground">{workspaces.length} disponíveis</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map((ws, i) => (
            <motion.button
              key={ws.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              onClick={() => navigate(`/workspace/${ws.id}`)}
              className="group relative rounded-2xl border border-border/60 bg-card p-5 shadow-card hover:shadow-card-hover transition-all duration-300 text-left overflow-hidden"
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/[0.04] to-transparent rounded-2xl" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{ws.name}</h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Relatórios e dashboards
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
