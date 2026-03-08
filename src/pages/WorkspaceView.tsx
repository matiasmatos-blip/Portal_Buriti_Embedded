import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useAuth, WORKSPACES } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Star, BarChart3, ArrowUpRight } from "lucide-react";

const WorkspaceView = () => {
  const { id } = useParams();
  const { user, isFavorite, toggleFavorite } = useAuth();
  const navigate = useNavigate();

  const workspace = WORKSPACES.find((w) => w.id === id);

  if (!workspace) return <Navigate to="/dashboard" replace />;
  if (user && !workspace.allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-foreground">{workspace.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Selecione um relatório para visualizar
        </p>
      </motion.div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {workspace.reports.map((report, i) => {
          const favorited = isFavorite(report.id);
          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="group relative rounded-2xl border border-border/60 bg-card shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/[0.04] to-transparent rounded-2xl" />

              <div className="relative p-5">
                {/* Header: icon + favorite */}
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center shrink-0">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(report.id);
                    }}
                    className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                      favorited
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground/40 hover:text-primary hover:bg-primary/10"
                    }`}
                    title={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                  >
                    <Star className={`h-4 w-4 ${favorited ? "fill-primary" : ""}`} />
                  </button>
                </div>

                {/* Content */}
                <h3 className="font-semibold text-foreground text-sm">{report.name}</h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
                  {report.description}
                </p>

                {/* Action */}
                <button
                  onClick={() => navigate(`/workspace/${workspace.id}/report/${report.id}`)}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  Abrir relatório
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkspaceView;
