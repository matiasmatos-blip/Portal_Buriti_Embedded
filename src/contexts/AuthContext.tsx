import React, { createContext, useContext, useState, useCallback } from "react";

export type UserRole = "admin" | "gerente" | "analista" | "visualizador";

export interface Report {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
}

export interface Workspace {
  id: string;
  name: string;
  icon: string;
  allowedRoles: UserRole[];
  reports: Report[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Mock workspaces with reports
export const WORKSPACES: Workspace[] = [
  {
    id: "1", name: "Vendas", icon: "TrendingUp",
    allowedRoles: ["admin", "gerente", "analista", "visualizador"],
    reports: [
      { id: "1-1", workspaceId: "1", name: "Recebimento de Parcelas", description: "Acompanhamento de recebimentos e inadimplência por empreendimento" },
      { id: "1-2", workspaceId: "1", name: "Projeção de Distratos", description: "Análise preditiva de cancelamentos e impacto financeiro" },
      { id: "1-3", workspaceId: "1", name: "Funil de Vendas", description: "Pipeline completo de leads até fechamento de contrato" },
      { id: "1-4", workspaceId: "1", name: "Performance de Corretores", description: "Ranking e métricas individuais da equipe de vendas" },
    ],
  },
  {
    id: "2", name: "Financeiro", icon: "DollarSign",
    allowedRoles: ["admin", "gerente", "analista"],
    reports: [
      { id: "2-1", workspaceId: "2", name: "Fluxo de Caixa", description: "Entradas e saídas consolidadas por período" },
      { id: "2-2", workspaceId: "2", name: "DRE Gerencial", description: "Demonstração de resultados por empreendimento" },
      { id: "2-3", workspaceId: "2", name: "Contas a Pagar", description: "Visão detalhada de compromissos e vencimentos" },
    ],
  },
  {
    id: "3", name: "Empreendimentos", icon: "Building2",
    allowedRoles: ["admin", "gerente", "analista", "visualizador"],
    reports: [
      { id: "3-1", workspaceId: "3", name: "Mapa de Lotes", description: "Situação de cada lote: vendido, disponível ou reservado" },
      { id: "3-2", workspaceId: "3", name: "Andamento de Obras", description: "Cronograma físico-financeiro dos empreendimentos" },
      { id: "3-3", workspaceId: "3", name: "Indicadores por Empreendimento", description: "KPIs consolidados de cada projeto" },
    ],
  },
  {
    id: "4", name: "Marketing", icon: "Megaphone",
    allowedRoles: ["admin", "gerente"],
    reports: [
      { id: "4-1", workspaceId: "4", name: "Campanhas Ativas", description: "Performance e ROI de cada campanha publicitária" },
      { id: "4-2", workspaceId: "4", name: "Leads por Canal", description: "Origem e qualificação de leads por canal de captação" },
    ],
  },
  {
    id: "5", name: "RH", icon: "Users",
    allowedRoles: ["admin", "gerente"],
    reports: [
      { id: "5-1", workspaceId: "5", name: "Quadro de Colaboradores", description: "Headcount, admissões e desligamentos" },
      { id: "5-2", workspaceId: "5", name: "Indicadores de RH", description: "Turnover, absenteísmo e produtividade" },
    ],
  },
  {
    id: "6", name: "Administrativo", icon: "Settings",
    allowedRoles: ["admin"],
    reports: [
      { id: "6-1", workspaceId: "6", name: "Contratos e Documentos", description: "Gestão documental e status de assinaturas" },
      { id: "6-2", workspaceId: "6", name: "Indicadores Operacionais", description: "Métricas de eficiência dos processos internos" },
    ],
  },
];

const MOCK_USERS: Record<string, { password: string; user: User }> = {
  "admin@buriti.com": {
    password: "admin123",
    user: { id: "1", name: "Carlos Administrador", email: "admin@buriti.com", role: "admin" },
  },
  "gerente@buriti.com": {
    password: "gerente123",
    user: { id: "2", name: "Maria Gerente", email: "gerente@buriti.com", role: "gerente" },
  },
  "analista@buriti.com": {
    password: "analista123",
    user: { id: "3", name: "João Analista", email: "analista@buriti.com", role: "analista" },
  },
  "viewer@buriti.com": {
    password: "viewer123",
    user: { id: "4", name: "Ana Visualizadora", email: "viewer@buriti.com", role: "visualizador" },
  },
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  getVisibleWorkspaces: () => Workspace[];
  favorites: string[]; // report IDs
  toggleFavorite: (reportId: string) => void;
  isFavorite: (reportId: string) => boolean;
  getFavoriteReports: () => (Report & { workspaceName: string })[];
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("buriti_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("buriti_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    const entry = MOCK_USERS[email.toLowerCase()];
    if (entry && entry.password === password) {
      setUser(entry.user);
      localStorage.setItem("buriti_user", JSON.stringify(entry.user));
      const userFavs = localStorage.getItem(`buriti_favorites_${entry.user.id}`);
      setFavorites(userFavs ? JSON.parse(userFavs) : []);
      setIsLoading(false);
      return { success: true };
    }
    setIsLoading(false);
    return { success: false, error: "E-mail ou senha inválidos" };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setFavorites([]);
    localStorage.removeItem("buriti_user");
  }, []);

  const getVisibleWorkspaces = useCallback(() => {
    if (!user) return [];
    return WORKSPACES.filter((w) => w.allowedRoles.includes(user.role));
  }, [user]);

  const toggleFavorite = useCallback((reportId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(reportId)
        ? prev.filter((id) => id !== reportId)
        : [...prev, reportId];
      if (user) {
        localStorage.setItem(`buriti_favorites_${user.id}`, JSON.stringify(next));
      }
      return next;
    });
  }, [user]);

  const isFavorite = useCallback((reportId: string) => {
    return favorites.includes(reportId);
  }, [favorites]);

  const getFavoriteReports = useCallback(() => {
    if (!user) return [];
    const visibleWorkspaces = WORKSPACES.filter((w) => w.allowedRoles.includes(user.role));
    const result: (Report & { workspaceName: string })[] = [];
    for (const ws of visibleWorkspaces) {
      for (const report of ws.reports) {
        if (favorites.includes(report.id)) {
          result.push({ ...report, workspaceName: ws.name });
        }
      }
    }
    return result;
  }, [user, favorites]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, getVisibleWorkspaces, favorites, toggleFavorite, isFavorite, getFavoriteReports }}>
      {children}
    </AuthContext.Provider>
  );
};
