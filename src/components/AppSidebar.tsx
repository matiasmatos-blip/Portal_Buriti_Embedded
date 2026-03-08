import { TrendingUp, DollarSign, Building2, Megaphone, Users, Settings, LogOut, LayoutDashboard, Star } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import logo from "@/assets/logo-buriti.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const iconMap: Record<string, React.ElementType> = {
  TrendingUp, DollarSign, Building2, Megaphone, Users, Settings,
};

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, logout, getVisibleWorkspaces, getFavoriteReports } = useAuth();
  const workspaces = getVisibleWorkspaces();
  const hasFavorites = getFavoriteReports().length > 0;

  const roleLabel: Record<string, string> = {
    admin: "Administrador",
    gerente: "Gerente",
    analista: "Analista",
    visualizador: "Visualizador",
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="p-4 pb-6">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Buriti"
            className={`${collapsed ? "h-8" : "h-11"} w-auto transition-all duration-300`}
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Home */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/dashboard"
                    end
                    activeClassName="gradient-brand text-primary-foreground shadow-brand font-semibold"
                    className="rounded-xl transition-all duration-200 hover:bg-sidebar-accent"
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    {!collapsed && <span>Início</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Favorites link */}
        {hasFavorites && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/favoritos"
                      activeClassName="gradient-brand text-primary-foreground shadow-brand font-semibold"
                      className="rounded-xl transition-all duration-200 hover:bg-sidebar-accent"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      {!collapsed && <span>Favoritos</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Workspaces */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-muted text-[10px] uppercase tracking-widest font-bold px-3 mb-1">
            {!collapsed && "Workspaces"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {workspaces.map((ws, i) => {
                const Icon = iconMap[ws.icon] || Building2;
                return (
                  <motion.div
                    key={ws.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={`/workspace/${ws.id}`}
                          activeClassName="gradient-brand text-primary-foreground shadow-brand font-semibold"
                          className="rounded-xl transition-all duration-200 hover:bg-sidebar-accent"
                        >
                          <Icon className="h-4 w-4 mr-2 shrink-0" />
                          {!collapsed && <span>{ws.name}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin */}
        {user?.role === "admin" && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-muted text-[10px] uppercase tracking-widest font-bold px-3 mb-1">
              {!collapsed && "Administração"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/admin/users"
                      activeClassName="gradient-brand text-primary-foreground shadow-brand font-semibold"
                      className="rounded-xl transition-all duration-200 hover:bg-sidebar-accent"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      {!collapsed && <span>Usuários</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-sidebar-border">
        {!collapsed && user && (
          <motion.div
            className="flex items-center gap-3 px-2 mb-3 py-2 rounded-xl bg-muted/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="h-9 w-9 rounded-xl gradient-brand flex items-center justify-center text-xs font-bold text-primary-foreground shadow-brand">
              {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-sidebar-foreground truncate">{user.name}</p>
              <p className="text-[10px] text-sidebar-muted">{roleLabel[user.role]}</p>
            </div>
          </motion.div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={logout}
              className="text-sidebar-muted hover:text-accent hover:bg-accent/10 transition-all rounded-xl"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {!collapsed && <span>Sair</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
