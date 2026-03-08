import { useState } from "react";
import { useAuth, WORKSPACES, type UserRole } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Shield, ShieldCheck, Eye, BarChart3, Plus, Pencil, Trash2, ChevronDown, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────
interface MockUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  /** When empty → inherits all from role. Otherwise explicit IDs. */
  allowedWorkspaceIds: string[];
  allowedReportIds: string[];
}

const roleConfig: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  admin: { label: "Admin", icon: Shield, className: "bg-accent/10 text-accent border-accent/20" },
  gerente: { label: "Gerente", icon: ShieldCheck, className: "bg-primary/10 text-primary border-primary/20" },
  analista: { label: "Analista", icon: BarChart3, className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  visualizador: { label: "Visualizador", icon: Eye, className: "bg-muted text-muted-foreground border-border" },
};

const INITIAL_USERS: MockUser[] = [
  { id: "1", name: "Carlos Administrador", email: "admin@buriti.com", role: "admin", allowedWorkspaceIds: [], allowedReportIds: [] },
  { id: "2", name: "Maria Gerente", email: "gerente@buriti.com", role: "gerente", allowedWorkspaceIds: [], allowedReportIds: [] },
  { id: "3", name: "João Analista", email: "analista@buriti.com", role: "analista", allowedWorkspaceIds: [], allowedReportIds: [] },
  { id: "4", name: "Ana Visualizadora", email: "viewer@buriti.com", role: "visualizador", allowedWorkspaceIds: [], allowedReportIds: [] },
];

let nextId = 5;

// ─── Component ───────────────────────────────────────────
const AdminUsers = () => {
  const { user } = useAuth();

  const [users, setUsers] = useState<MockUser[]>(INITIAL_USERS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MockUser | null>(null);
  const [editingUser, setEditingUser] = useState<MockUser | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState<UserRole>("visualizador");
  const [formWorkspaces, setFormWorkspaces] = useState<string[]>([]);
  const [formReports, setFormReports] = useState<string[]>([]);
  const [expandedWs, setExpandedWs] = useState<string[]>([]);

  if (user?.role !== "admin") return <Navigate to="/dashboard" replace />;

  const resetForm = () => {
    setFormName("");
    setFormEmail("");
    setFormRole("visualizador");
    setFormWorkspaces([]);
    setFormReports([]);
    setExpandedWs([]);
    setEditingUser(null);
  };

  const openAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (u: MockUser) => {
    setEditingUser(u);
    setFormName(u.name);
    setFormEmail(u.email);
    setFormRole(u.role);
    setFormWorkspaces(u.allowedWorkspaceIds);
    setFormReports(u.allowedReportIds);
    setExpandedWs([]);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formEmail.trim()) {
      toast.error("Preencha nome e e-mail.");
      return;
    }

    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? { ...u, name: formName.trim(), email: formEmail.trim(), role: formRole, allowedWorkspaceIds: formWorkspaces, allowedReportIds: formReports }
            : u,
        ),
      );
      toast.success("Usuário atualizado com sucesso.");
    } else {
      const newUser: MockUser = {
        id: String(nextId++),
        name: formName.trim(),
        email: formEmail.trim(),
        role: formRole,
        allowedWorkspaceIds: formWorkspaces,
        allowedReportIds: formReports,
      };
      setUsers((prev) => [...prev, newUser]);
      toast.success("Usuário adicionado com sucesso.");
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
    toast.success(`${deleteTarget.name} foi removido.`);
    setDeleteTarget(null);
  };

  // Permission helpers
  const toggleWorkspace = (wsId: string) => {
    setFormWorkspaces((prev) => {
      const next = prev.includes(wsId) ? prev.filter((id) => id !== wsId) : [...prev, wsId];
      // When toggling a full workspace, also toggle its reports
      const ws = WORKSPACES.find((w) => w.id === wsId);
      if (ws) {
        if (next.includes(wsId)) {
          // Add all reports of this workspace
          setFormReports((rp) => {
            const reportIds = ws.reports.map((r) => r.id);
            return [...new Set([...rp, ...reportIds])];
          });
        } else {
          // Remove all reports of this workspace
          setFormReports((rp) => rp.filter((id) => !ws.reports.some((r) => r.id === id)));
        }
      }
      return next;
    });
  };

  const toggleReport = (reportId: string, wsId: string) => {
    setFormReports((prev) => {
      const next = prev.includes(reportId) ? prev.filter((id) => id !== reportId) : [...prev, reportId];
      // Check if all reports in workspace are selected → auto-select workspace
      const ws = WORKSPACES.find((w) => w.id === wsId);
      if (ws) {
        const allSelected = ws.reports.every((r) => next.includes(r.id));
        setFormWorkspaces((wsPrev) =>
          allSelected ? [...new Set([...wsPrev, wsId])] : wsPrev.filter((id) => id !== wsId),
        );
      }
      return next;
    });
  };

  const toggleExpandWs = (wsId: string) => {
    setExpandedWs((prev) => (prev.includes(wsId) ? prev.filter((id) => id !== wsId) : [...prev, wsId]));
  };

  const getPermissionSummary = (u: MockUser) => {
    if (u.role === "admin") return "Acesso total";
    if (u.allowedWorkspaceIds.length === 0 && u.allowedReportIds.length === 0) return "Padrão do nível";
    const parts: string[] = [];
    if (u.allowedWorkspaceIds.length > 0) parts.push(`${u.allowedWorkspaceIds.length} workspace(s)`);
    const extraReports = u.allowedReportIds.filter(
      (rId) => !WORKSPACES.some((ws) => u.allowedWorkspaceIds.includes(ws.id) && ws.reports.some((r) => r.id === rId)),
    );
    if (extraReports.length > 0) parts.push(`${extraReports.length} relatório(s)`);
    return parts.join(" + ") || "Padrão do nível";
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gerenciar Usuários</h1>
          <p className="text-sm text-muted-foreground mt-1">Controle de acesso e permissões</p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="h-4 w-4" /> Adicionar Usuário
        </Button>
      </div>

      {/* Users table */}
      <motion.div
        className="mt-8 rounded-xl border border-border bg-card overflow-hidden"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Usuário</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">E-mail</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Nível</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Permissões</th>
                <th className="text-right text-xs font-semibold text-muted-foreground px-5 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {users.map((u, i) => {
                  const rc = roleConfig[u.role];
                  const Icon = rc.icon;
                  return (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ delay: 0.05 + i * 0.03 }}
                      className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full gradient-brand flex items-center justify-center text-xs font-bold text-primary-foreground">
                            {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          <span className="font-medium text-sm text-foreground">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{u.email}</td>
                      <td className="px-5 py-4">
                        <Badge variant="outline" className={`${rc.className} gap-1`}>
                          <Icon className="h-3 w-3" />
                          {rc.label}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{getPermissionSummary(u)}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(u)} title="Editar">
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setDeleteTarget(u)}
                            title="Excluir"
                            disabled={u.email === user?.email}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setDialogOpen(open); }}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
            <DialogDescription>
              {editingUser ? "Atualize as informações e permissões." : "Preencha os dados e defina as permissões de acesso."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="user-name">Nome</Label>
              <Input id="user-name" placeholder="Nome completo" value={formName} onChange={(e) => setFormName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-email">E-mail</Label>
              <Input id="user-email" type="email" placeholder="email@buriti.com" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Nível de Acesso</Label>
              <Select value={formRole} onValueChange={(v) => setFormRole(v as UserRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roleConfig).map(([key, cfg]) => (
                    <SelectItem key={key} value={key}>
                      <span className="flex items-center gap-2">
                        <cfg.icon className="h-3.5 w-3.5" /> {cfg.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Permissions */}
            {formRole !== "admin" && (
              <div className="space-y-2">
                <Label>Permissões de Visualização</Label>
                <p className="text-xs text-muted-foreground">Selecione workspaces completos ou relatórios específicos. Sem seleção = padrão do nível.</p>
                <div className="border border-border rounded-lg divide-y divide-border max-h-60 overflow-y-auto">
                  {WORKSPACES.map((ws) => {
                    const isExpanded = expandedWs.includes(ws.id);
                    const wsChecked = formWorkspaces.includes(ws.id);
                    return (
                      <div key={ws.id}>
                        <div className="flex items-center gap-2 px-3 py-2.5 hover:bg-muted/30 transition-colors">
                          <button
                            type="button"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => toggleExpandWs(ws.id)}
                          >
                            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </button>
                          <Checkbox
                            checked={wsChecked}
                            onCheckedChange={() => toggleWorkspace(ws.id)}
                            id={`ws-${ws.id}`}
                          />
                          <label htmlFor={`ws-${ws.id}`} className="text-sm font-medium text-foreground cursor-pointer flex-1">
                            {ws.name}
                          </label>
                          <span className="text-xs text-muted-foreground">{ws.reports.length} relatórios</span>
                        </div>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-10 pr-3 pb-2 space-y-1">
                                {ws.reports.map((r) => (
                                  <div key={r.id} className="flex items-center gap-2 py-1">
                                    <Checkbox
                                      checked={formReports.includes(r.id)}
                                      onCheckedChange={() => toggleReport(r.id, ws.id)}
                                      id={`rp-${r.id}`}
                                    />
                                    <label htmlFor={`rp-${r.id}`} className="text-xs text-muted-foreground cursor-pointer">
                                      {r.name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { resetForm(); setDialogOpen(false); }}>Cancelar</Button>
            <Button onClick={handleSave}>{editingUser ? "Salvar" : "Adicionar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir usuário?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover <strong>{deleteTarget?.name}</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminUsers;
