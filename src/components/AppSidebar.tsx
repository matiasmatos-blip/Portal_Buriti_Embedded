import { TrendingUp, DollarSign, Building2, Megaphone, Users, Settings, LogOut, ChevronLeft, LayoutDashboard } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth, type Workspace } from "@/contexts/AuthContext";
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
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { user, logout, getVisibleWorkspaces } = useAuth();
  const workspaces = getVisibleWorkspaces();

  const roleLabel: Record<string, string> = {
    admin: "Administrador",
    gerente: "Gerente",
    analista: "Analista",
    visualizador: "Visualizador",
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Buriti" className={`${collapsed ? "h-8" : "h-10"} w-auto transition-all duration-300`} />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Dashboard */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard" end activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    {!collapsed && <span>Dashboard</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Workspaces */}
        <SidebarGroup defaultOpen>
          <SidebarGroupLabel className="text-sidebar-muted text-[10px] uppercase tracking-wider font-bold px-3">
            {!collapsed && "Workspaces"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {workspaces.map((ws, i) => {
                const Icon = iconMap[ws.icon] || Building2;
                return (
                  <motion.div
                    key={ws.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={`/workspace/${ws.id}`}
                          activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
                          className="hover:bg-sidebar-accent/50 transition-colors rounded-md"
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
            <SidebarGroupLabel className="text-sidebar-muted text-[10px] uppercase tracking-wider font-bold px-3">
              {!collapsed && "Administração"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/admin/users" activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold">
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
            className="flex items-center gap-3 px-2 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="h-8 w-8 rounded-full gradient-brand flex items-center justify-center text-xs font-bold text-primary-foreground">
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
              className="text-sidebar-muted hover:text-accent hover:bg-accent/10 transition-colors"
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
