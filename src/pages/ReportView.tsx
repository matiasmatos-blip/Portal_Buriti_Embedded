import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useAuth, WORKSPACES } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { BuritiLoader } from "@/components/BuritiLoader";
import { useState, useEffect } from "react";
import { MonitorPlay, Star, ChevronLeft } from "lucide-react";

const ReportView = () => {
  const { id, reportId } = useParams();
  const { user, isFavorite, toggleFavorite } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const workspace = WORKSPACES.find((w) => w.id === id);
  const report = workspace?.reports.find((r) => r.id === reportId);
  const favorited = report ? isFavorite(report.id) : false;

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [reportId]);

  if (!workspace || !report) return <Navigate to="/dashboard" replace />;
  if (user && !workspace.allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/workspace/${workspace.id}`)}
            className="h-9 w-9 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs text-muted-foreground">{workspace.name}</p>
            <h1 className="text-xl font-bold text-foreground">{report.name}</h1>
          </div>
        </div>
        <button
          onClick={() => toggleFavorite(report.id)}
          className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
            favorited
              ? "bg-primary/10 text-primary"
              : "bg-muted/50 text-muted-foreground hover:text-primary hover:bg-primary/10"
          }`}
          title={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Star className={`h-5 w-5 ${favorited ? "fill-primary" : ""}`} />
        </button>
      </motion.div>

      <motion.div
        className="mt-6 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden shadow-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-[550px]">
            <BuritiLoader text="Carregando relatório..." />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[550px] text-center px-8">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center mb-4">
              <MonitorPlay className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Power BI Embedded</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              Aqui será incorporado o relatório <strong>{report.name}</strong> do workspace <strong>{workspace.name}</strong>.
            </p>
            <p className="text-xs text-muted-foreground mt-1">{report.description}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ReportView;
