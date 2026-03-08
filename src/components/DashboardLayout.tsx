import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, Search, Bell, Globe, Facebook, Instagram } from "lucide-react";

export const DashboardLayout = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full gradient-page">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center border-b border-border/50 bg-card/60 backdrop-blur-xl px-6 sticky top-0 z-30">
            <SidebarTrigger className="mr-4 text-muted-foreground hover:text-foreground transition-colors">
              <Menu size={20} />
            </SidebarTrigger>

            {/* Search bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full h-9 pl-9 pr-4 rounded-xl bg-muted/50 border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              <a href="https://btsa.com.br/empreendimentos/" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all" title="Site">
                <Globe size={17} />
              </a>
              <a href="https://www.facebook.com/brasilterrenos" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all" title="Facebook">
                <Facebook size={17} />
              </a>
              <a href="https://www.instagram.com/brasilterrenos" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all" title="Instagram">
                <Instagram size={17} />
              </a>
              <div className="w-px h-6 bg-border/50 mx-1" />
              <button className="h-9 w-9 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                <Bell size={18} />
              </button>
              <div className="h-9 w-9 rounded-xl gradient-brand flex items-center justify-center text-xs font-bold text-primary-foreground shadow-brand">
                {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
            </div>
          </header>
          <main className="flex-1 p-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              key={location.pathname}
            >
              <Outlet />
            </motion.div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
