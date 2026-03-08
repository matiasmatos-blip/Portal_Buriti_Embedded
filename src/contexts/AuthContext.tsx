import React, { createContext, useContext, useState, useCallback } from "react";

export type UserRole = "admin" | "gerente" | "analista" | "visualizador";

export interface Workspace {
  id: string;
  name: string;
  icon: string;
  allowedRoles: UserRole[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Mock workspaces - will come from database later
export const WORKSPACES: Workspace[] = [
  { id: "1", name: "Vendas", icon: "TrendingUp", allowedRoles: ["admin", "gerente", "analista", "visualizador"] },
  { id: "2", name: "Financeiro", icon: "DollarSign", allowedRoles: ["admin", "gerente", "analista"] },
  { id: "3", name: "Empreendimentos", icon: "Building2", allowedRoles: ["admin", "gerente", "analista", "visualizador"] },
  { id: "4", name: "Marketing", icon: "Megaphone", allowedRoles: ["admin", "gerente"] },
  { id: "5", name: "RH", icon: "Users", allowedRoles: ["admin", "gerente"] },
  { id: "6", name: "Administrativo", icon: "Settings", allowedRoles: ["admin"] },
];

// Mock users
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

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 1500));
    const entry = MOCK_USERS[email.toLowerCase()];
    if (entry && entry.password === password) {
      setUser(entry.user);
      localStorage.setItem("buriti_user", JSON.stringify(entry.user));
      setIsLoading(false);
      return { success: true };
    }
    setIsLoading(false);
    return { success: false, error: "E-mail ou senha inválidos" };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("buriti_user");
  }, []);

  const getVisibleWorkspaces = useCallback(() => {
    if (!user) return [];
    return WORKSPACES.filter((w) => w.allowedRoles.includes(user.role));
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, getVisibleWorkspaces }}>
      {children}
    </AuthContext.Provider>
  );
};
