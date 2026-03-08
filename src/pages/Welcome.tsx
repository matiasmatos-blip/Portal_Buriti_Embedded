import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { BarChart3, Star, ArrowUpRight, Sparkles, LayoutGrid, ShieldCheck, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: LayoutGrid,
    title: "Workspaces organizados",
    description: "Navegue pelos relatórios de cada área da empresa de forma simples e intuitiva.",
  },
  {
    icon: Star,
    title: "Favoritos",
    description: "Marque seus relatórios mais utilizados com uma estrela para acessá-los rapidamente.",
  },
  {
    icon: ShieldCheck,
    title: "Acesso por nível",
    description: "Você só visualiza os workspaces liberados para o seu perfil de acesso.",
  },
  {
    icon: BookOpen,
    title: "Power BI Embedded",
    description: "Os dashboards são carregados diretamente no portal, sem precisar abrir outra ferramenta.",
  },
];

const Welcome = () => {
  const { user, getVisibleWorkspaces, isFavorite } = useAuth();
  const navigate = useNavigate();
  const workspaces = getVisibleWorkspaces();
  const favoriteWorkspaces = workspaces.filter((ws) => isFavorite(ws.id));

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          Portal de Inteligência
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          Bem-vindo, {user?.name.split(" ")[0]}! 👋
        </h1>
        <p className="mt-3 text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Este é o seu portal de relatórios e dashboards. Navegue pelos workspaces no menu lateral
          para acessar os dados de cada área da Buriti Empreendimentos.
        </p>
      </motion.div>

      {/* Favorites quick access */}
      {favoriteWorkspaces.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-4 w-4 text-primary fill-primary" />
            <h2 className="text-lg font-semibold text-foreground">Favoritos</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {favoriteWorkspaces.map((ws, i) => (
              <motion.button
                key={ws.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.04 }}
                onClick={() => navigate(`/workspace/${ws.id}`)}
                className="group relative flex items-center gap-3 p-4 rounded-2xl border border-border/60 bg-card shadow-card hover:shadow-card-hover transition-all duration-300 text-left overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/[0.04] to-transparent rounded-2xl" />
                <div className="relative flex items-center gap-3 w-full">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center shrink-0">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-semibold text-foreground text-sm">{ws.name}</span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary ml-auto transition-colors" />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold text-foreground mb-4">Como funciona</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.06 }}
              className="group relative rounded-2xl border border-border/60 bg-card p-5 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/[0.03] to-transparent rounded-2xl" />
              <div className="relative flex gap-4">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center shrink-0">
                  <feat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{feat.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{feat.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* All workspaces */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Seus Workspaces</h2>
          <span className="text-xs text-muted-foreground">{workspaces.length} disponíveis</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map((ws, i) => (
            <motion.button
              key={ws.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.04 }}
              onClick={() => navigate(`/workspace/${ws.id}`)}
              className="group relative rounded-2xl border border-border/60 bg-card p-5 shadow-card hover:shadow-card-hover transition-all duration-300 text-left overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/[0.04] to-transparent rounded-2xl" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{ws.name}</h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Relatórios e dashboards</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Welcome;
