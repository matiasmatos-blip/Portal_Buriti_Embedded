import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Star, BarChart3, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Favoritos = () => {
  const { getFavoriteReports, toggleFavorite } = useAuth();
  const navigate = useNavigate();
  const favoriteReports = getFavoriteReports();

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <Star className="h-5 w-5 text-primary fill-primary" />
          <h1 className="text-2xl font-bold text-foreground">Favoritos</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Acesse rapidamente os relatórios que você mais utiliza
        </p>
      </motion.div>

      {favoriteReports.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-12 text-center"
        >
          <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
            <Star className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <h3 className="font-semibold text-foreground">Nenhum favorito ainda</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            Navegue pelos workspaces e clique na ⭐ dos relatórios que mais usa para adicioná-los aqui.
          </p>
        </motion.div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteReports.map((report, i) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group relative rounded-2xl border border-border/60 bg-card shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/[0.04] to-transparent rounded-2xl" />
              <div className="relative p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center shrink-0">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <button
                    onClick={() => toggleFavorite(report.id)}
                    className="h-8 w-8 rounded-lg flex items-center justify-center bg-primary/10 text-primary transition-all duration-200 hover:bg-accent/10 hover:text-accent"
                    title="Remover dos favoritos"
                  >
                    <Star className="h-4 w-4 fill-primary" />
                  </button>
                </div>
                <h3 className="font-semibold text-foreground text-sm">{report.name}</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">{report.workspaceName}</p>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
                  {report.description}
                </p>
                <button
                  onClick={() => navigate(`/workspace/${report.workspaceId}/report/${report.id}`)}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  Abrir relatório
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favoritos;
