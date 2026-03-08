import { useParams, Navigate } from "react-router-dom";
import { useAuth, WORKSPACES } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { BuritiLoader } from "@/components/BuritiLoader";
import { useState, useEffect } from "react";
import { MonitorPlay } from "lucide-react";

const WorkspaceView = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const workspace = WORKSPACES.find((w) => w.id === id);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [id]);

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
          Relatórios e dashboards do workspace
        </p>
      </motion.div>

      <motion.div
        className="mt-8 rounded-xl border border-border bg-card overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-[500px]">
            <BuritiLoader text="Carregando relatório..." />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[500px] text-center px-8">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <MonitorPlay className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Power BI Embedded</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              Aqui será incorporado o relatório Power BI do workspace <strong>{workspace.name}</strong>. 
              Configure a integração com o Power BI Embedded API para exibir os dashboards.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default WorkspaceView;
