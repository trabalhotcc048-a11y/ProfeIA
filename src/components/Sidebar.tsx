import React, { useState, useEffect } from "react";
import {
  Home,
  BookOpen,
  Sparkles,
  CheckSquare,
  BarChart3,
  Bell,
  User,
  Settings,
  Users,
  AlertTriangle,
  Lightbulb,
  X,
  Menu,
  GraduationCap,
  Database,
  Wifi,
  WifiOff,
  Download,
  CheckCircle2,
  RefreshCw,
  HardDrive,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { UserRole, UserProfile, Discipline } from "../types";
import { GenericSilhouetteAvatar } from "./common/GenericSilhouetteAvatar";
import { initialDisciplines } from "../data/disciplinesData";
import {
  isOfflineTutorModeEnabled,
  setOfflineTutorModeForced,
  downloadDisciplineForOffline,
  isDisciplineSavedOffline,
  getDisciplineOfflineMeta,
  DisciplineOfflineCacheMeta,
  getOfflineStorageStats,
  OfflineStorageStats,
} from "../services/offlineTutorDB";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: string;
  role: UserRole;
  user?: UserProfile;
  onNavigate: (tab: string) => void;
  unreadCount: number;
  currentDiscipline?: Discipline | null;
  disciplines?: Discipline[];
  onOpenOfflineModal?: () => void;
  onOpenContent?: (disciplineId: string, contentId: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  highlight?: boolean;
  count?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentTab,
  role,
  user,
  onNavigate,
  unreadCount,
  currentDiscipline,
  disciplines = initialDisciplines,
  onOpenOfflineModal,
  onOpenContent,
}) => {
  // Active discipline context for the offline download functionality
  const activeDiscipline = currentDiscipline || disciplines[0] || initialDisciplines[0];

  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(() => isOfflineTutorModeEnabled());
  const [isNetworkOnline, setIsNetworkOnline] = useState<boolean>(() =>
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [isSavedOffline, setIsSavedOffline] = useState<boolean>(() =>
    activeDiscipline ? isDisciplineSavedOffline(activeDiscipline.id) : false
  );
  const [savedMeta, setSavedMeta] = useState<DisciplineOfflineCacheMeta | null>(() =>
    activeDiscipline ? getDisciplineOfflineMeta(activeDiscipline.id) : null
  );
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<{
    current: number;
    total: number;
    title: string;
  }>({ current: 0, total: 0, title: "" });
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [offlineStats, setOfflineStats] = useState<OfflineStorageStats | null>(null);

  // Status consolidado de conexão (Verde se online e conectado; Cinza se Modo Offline ativo ou rede indisponível)
  const isConnectionActive = !isOfflineMode && isNetworkOnline;

  // Sync state whenever the active discipline changes
  useEffect(() => {
    if (activeDiscipline) {
      setIsSavedOffline(isDisciplineSavedOffline(activeDiscipline.id));
      setSavedMeta(getDisciplineOfflineMeta(activeDiscipline.id));
      setFeedbackMessage(null);
    }
  }, [activeDiscipline?.id]);

  // Sync state with global window offline events and load IndexedDB stats
  useEffect(() => {
    const handleSync = async () => {
      setIsOfflineMode(isOfflineTutorModeEnabled());
      setIsNetworkOnline(typeof navigator !== "undefined" ? navigator.onLine : true);
      if (activeDiscipline) {
        setIsSavedOffline(isDisciplineSavedOffline(activeDiscipline.id));
        setSavedMeta(getDisciplineOfflineMeta(activeDiscipline.id));
      }
      try {
        const stats = await getOfflineStorageStats();
        setOfflineStats(stats);
      } catch {}
    };

    handleSync();

    window.addEventListener("online", handleSync);
    window.addEventListener("offline", handleSync);
    window.addEventListener("profeia-offline-mode-changed", handleSync);
    window.addEventListener("profeia-discipline-cached", handleSync);
    window.addEventListener("profeia-indexeddb-updated", handleSync);

    return () => {
      window.removeEventListener("online", handleSync);
      window.removeEventListener("offline", handleSync);
      window.removeEventListener("profeia-offline-mode-changed", handleSync);
      window.removeEventListener("profeia-discipline-cached", handleSync);
      window.removeEventListener("profeia-indexeddb-updated", handleSync);
    };
  }, [activeDiscipline?.id]);

  // Baixa os conteúdos da disciplina atual para o cache local persistente (IndexedDB & LocalStorage)
  const handleDownloadCurrentDiscipline = async () => {
    if (!activeDiscipline || isDownloading) return;
    setIsDownloading(true);
    setFeedbackMessage(null);

    try {
      const meta = await downloadDisciplineForOffline(
        activeDiscipline,
        (current, total, title) => {
          setDownloadProgress({ current, total, title });
        }
      );
      setIsSavedOffline(true);
      setSavedMeta(meta);
      setFeedbackMessage(
        `✓ ${meta.topicsCount} capítulos de ${activeDiscipline.name} salvos (${meta.formattedSize})`
      );

      // Garante ativação do modo offline para disponibilizar o conteúdo imediatamente
      if (!isOfflineMode) {
        setOfflineTutorModeForced(true);
        setIsOfflineMode(true);
      }
    } catch (err) {
      console.error("Erro ao sincronizar disciplina offline:", err);
      setFeedbackMessage("Falha ao salvar no cache local.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Toggle do Modo Offline na Sidebar
  const handleToggleOfflineMode = () => {
    const nextMode = !isOfflineMode;
    setOfflineTutorModeForced(nextMode);
    setIsOfflineMode(nextMode);

    // Se estiver ativando o modo offline e a disciplina atual ainda não estiver salva, inicia o download imediatamente
    if (nextMode && !isSavedOffline && activeDiscipline && !isDownloading) {
      handleDownloadCurrentDiscipline();
    }
  };

  // Acessar conteúdos offline imediatamente
  const handleStudyOffline = () => {
    if (activeDiscipline) {
      const firstContent = activeDiscipline.modules[0]?.contents[0];
      if (firstContent && onOpenContent) {
        onOpenContent(activeDiscipline.id, firstContent.id);
        onClose();
        return;
      }
      onNavigate("disciplinas");
      onClose();
    }
  };
  // Navigation items for student (Aluno)
  const studentNav: NavItem[] = [
    { id: "home", label: "Dashboard", icon: Home },
    { id: "disciplinas", label: "Disciplinas", icon: BookOpen },
    { id: "tutoria", label: "TutorIA", icon: Sparkles, highlight: true },
    { id: "tutoria-offline", label: "Tutoria Offline (IndexedDB)", icon: Database, badge: "Local" },
    { id: "atividades", label: "Atividades", icon: CheckSquare },
    { id: "progresso", label: "Progresso", icon: BarChart3 },
    { id: "notificacoes", label: "Notificações", icon: Bell, count: unreadCount },
    { id: "perfil", label: "Meu Perfil", icon: User },
    { id: "configuracoes", label: "Configurações", icon: Settings },
  ];

  // Navigation items for teacher (Professor) - com Tutoria Offline (IndexedDB)
  const teacherNav: NavItem[] = [
    { id: "prof-dashboard", label: "Dashboard", icon: Home },
    { id: "disciplinas", label: "Disciplinas", icon: BookOpen },
    { id: "tutoria-offline", label: "Tutoria Offline (IndexedDB)", icon: Database, badge: "Local" },
    { id: "prof-alunos", label: "Turma INFVES3SB", icon: Users, badge: "26" },
    { id: "prof-dificuldades", label: "Mapa de Dificuldades", icon: AlertTriangle },
    { id: "prof-ia", label: "Recomendações da IA", icon: Lightbulb, highlight: true },
    { id: "notificacoes", label: "Notificações", icon: Bell, count: unreadCount },
    { id: "perfil", label: "Meu Perfil", icon: User },
    { id: "configuracoes", label: "Configurações", icon: Settings },
  ];

  // Navigation items for administrator (Administrador)
  const adminNav: NavItem[] = [
    { id: "home", label: "Dashboard", icon: Home },
    { id: "disciplinas", label: "Disciplinas", icon: BookOpen },
    { id: "tutoria-offline", label: "Tutoria Offline (IndexedDB)", icon: Database, badge: "Local" },
    { id: "prof-alunos", label: "Turma INFVES3SB", icon: Users, badge: "26" },
    { id: "prof-dificuldades", label: "Mapa de Dificuldades", icon: AlertTriangle },
    { id: "prof-ia", label: "Recomendações da IA", icon: Lightbulb, highlight: true },
    { id: "notificacoes", label: "Notificações", icon: Bell, count: unreadCount },
    { id: "perfil", label: "Meu Perfil", icon: User },
    { id: "configuracoes", label: "Configurações", icon: Settings },
  ];

  const currentNav =
    role === "ALUNO" ? studentNav : role === "ADMIN" ? adminNav : teacherNav;

  const handleItemClick = (id: string) => {
    onNavigate(id);
    onClose(); // Recolhe o menu ao selecionar a rota
  };

  return (
    <>
      {/* Backdrop de sobreposição quando o menu retrátil estiver aberto */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
          aria-hidden="true"
        />
      )}

      {/* Menu Lateral Retrátil (Drawer) - Fechado por padrão, abre via Menu Hambúrguer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 sm:w-80 bg-slate-900 border-r border-slate-800 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out select-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Menu de Navegação Principal"
      >
        {/* Cabeçalho do Menu com Indicador de Conexão e Botão de Fechar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-indigo-900/40 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-white tracking-tight">
                  Profe<span className="text-indigo-400">IA</span>
                </span>
                {/* Bolinha indicadora de status de conexão rápida */}
                <span
                  className={`w-2 h-2 rounded-full transition-all duration-300 shrink-0 ${
                    isConnectionActive
                      ? "bg-emerald-400 shadow-sm shadow-emerald-400/80 animate-pulse"
                      : "bg-slate-500 ring-1 ring-slate-600"
                  }`}
                  title={
                    isConnectionActive
                      ? "Status de Conexão: Online"
                      : isOfflineMode
                      ? "Status de Conexão: Modo Offline Ativo"
                      : "Status de Conexão: Rede Indisponível"
                  }
                />
              </div>
              <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 truncate">
                <span>Menu {role === "ALUNO" ? "do Aluno" : role === "ADMIN" ? "do Administrador" : "do Docente"}</span>
                <span className="text-slate-600">•</span>
                <span
                  className={`font-mono text-[10px] font-bold ${
                    isConnectionActive ? "text-emerald-400" : "text-slate-400"
                  }`}
                >
                  {isConnectionActive ? "Online" : "Offline"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Pill indicador visual de status de conexão (Bolinha Verde / Cinza) */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold transition-all select-none ${
                isConnectionActive
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-sm shadow-emerald-950/20"
                  : "bg-slate-800/90 border-slate-700 text-slate-400"
              }`}
              title={
                isConnectionActive
                  ? "Conexão ativa e sincronizada (Online)"
                  : isOfflineMode
                  ? "Modo Offline ativado manualmente (operando via cache local)"
                  : "Rede indisponível (operando via cache local)"
              }
              aria-label={
                isConnectionActive
                  ? "Status de conexão: Conectado (Online)"
                  : "Status de conexão: Desconectado (Offline)"
              }
            >
              {/* Bolinha verde quando online / cinza quando offline ou sem rede */}
              <span
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isConnectionActive
                    ? "bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/80"
                    : "bg-slate-500 ring-1 ring-slate-600"
                }`}
              />
              <span className="hidden xs:inline sm:inline">
                {isConnectionActive ? "Online" : "Offline"}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Fechar menu lateral"
              aria-label="Fechar menu lateral"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Barra / Indicador de Status Offline Global ("Pronto para ficar offline" / IndexedDB) */}
        <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800">
          <button
            type="button"
            onClick={() => {
              if (onOpenOfflineModal) onOpenOfflineModal();
              else onNavigate("tutoria-offline");
            }}
            className={`w-full text-left rounded-xl p-2.5 px-3 flex items-center justify-between gap-2.5 border transition-all hover:scale-[1.01] ${
              isOfflineMode
                ? "bg-amber-950/40 border-amber-500/40 text-amber-300 shadow-sm shadow-amber-950/30 hover:bg-amber-950/60"
                : "bg-emerald-950/30 border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/50 shadow-sm shadow-emerald-950/20"
            }`}
            title="Abrir Tutoria Offline (Cache Local IndexedDB)"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isOfflineMode
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-emerald-500/20 text-emerald-400"
                }`}
              >
                {isOfflineMode ? (
                  <WifiOff className="w-4 h-4" />
                ) : (
                  <Database className="w-4 h-4" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-black leading-tight text-white">
                    {isOfflineMode ? "Modo Offline Ativo" : "Pronto para ficar offline"}
                  </span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 shrink-0">
                    IndexedDB
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium truncate flex items-center gap-1 mt-0.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      isOfflineMode ? "bg-amber-400" : "bg-emerald-400 animate-pulse"
                    }`}
                  />
                  <span>
                    {isOfflineMode
                      ? "Operando 100% via IndexedDB"
                      : offlineStats && offlineStats.cachedTopicsCount > 0
                      ? `${offlineStats.cachedTopicsCount} tópicos salvos no IndexedDB`
                      : "Banco local IndexedDB sincronizado"}
                  </span>
                </p>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>
        </div>

        {/* Lista de Opções da Navegação */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-none">
          <p className="px-3 text-[10px] font-black tracking-wider text-slate-500 uppercase mb-2">
            Navegação Principal
          </p>

          {currentNav.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all group ${
                  isActive
                    ? item.highlight
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/40"
                      : "bg-indigo-950/80 text-indigo-300 border border-indigo-500/40"
                    : item.highlight
                    ? "bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50 border border-emerald-500/30"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      isActive
                        ? item.highlight
                          ? "text-emerald-200"
                          : "text-indigo-400"
                        : item.highlight
                        ? "text-emerald-400"
                        : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-indigo-500/30 text-indigo-200 border border-indigo-500/40"
                          : "bg-slate-800 text-slate-400 border border-slate-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {item.count !== undefined && item.count > 0 && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-500 text-white shadow-md shadow-rose-500/30 animate-pulse">
                      {item.count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
          {/* Card Interativo: Modo Offline & Cache Local da Disciplina Atual */}
          <div className="pt-3 pb-1">
            <div
              className={`p-3.5 rounded-2xl border transition-all ${
                isOfflineMode
                  ? "bg-slate-950/90 border-amber-500/40 shadow-lg shadow-amber-950/20"
                  : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
              }`}
            >
              {/* Header com Toggle Switch */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isOfflineMode
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-emerald-500/20 text-emerald-400"
                    }`}
                  >
                    {isOfflineMode ? (
                      <WifiOff className="w-4 h-4" />
                    ) : (
                      <Database className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-white leading-tight flex items-center gap-1.5 flex-wrap">
                      <span>{isOfflineMode ? "Modo Offline Ativo" : "Pronto para ficar offline"}</span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-indigo-500/25 text-indigo-300 border border-indigo-500/30">
                        IndexedDB
                      </span>
                    </h4>
                    <span className="text-[10px] text-slate-400 font-medium block truncate">
                      {isOfflineMode ? "Cache Local IndexedDB Operante" : "Banco Local Global Pronto"}
                    </span>
                  </div>
                </div>

                {/* Toggle Switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={isOfflineMode}
                  onClick={handleToggleOfflineMode}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    isOfflineMode ? "bg-emerald-500" : "bg-slate-700"
                  }`}
                  title={
                    isOfflineMode
                      ? "Desativar Modo Offline (Retornar para Online)"
                      : "Ativar Modo Offline e operar via IndexedDB"
                  }
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      isOfflineMode ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Informações da Disciplina Atual */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                <div className="flex items-start justify-between gap-1 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Disciplina Atual
                  </span>
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Pronto para ficar offline
                  </span>
                </div>

                <p className="text-xs font-bold text-slate-200 truncate">
                  {activeDiscipline.name}
                </p>
                <p className="text-[10px] text-slate-400">
                  {activeDiscipline.modules.flatMap((m) => m.contents).length} capítulos • {activeDiscipline.category}
                </p>

                {/* Barra de Progresso durante download */}
                {isDownloading && (
                  <div className="mt-2.5 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-medium text-slate-300">
                      <span className="flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 text-emerald-400 animate-spin" />
                        Baixando para cache local...
                      </span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {downloadProgress.current}/{downloadProgress.total}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.round(
                            (downloadProgress.current /
                              Math.max(1, downloadProgress.total)) *
                              100
                          )}%`,
                        }}
                      />
                    </div>
                    {downloadProgress.title && (
                      <p className="text-[9px] text-slate-400 truncate italic">
                        {downloadProgress.title}
                      </p>
                    )}
                  </div>
                )}

                {/* Feedback de sucesso */}
                {feedbackMessage && !isDownloading && (
                  <div className="mt-2 p-2 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-[10px] text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                    <span className="leading-tight">{feedbackMessage}</span>
                  </div>
                )}

                {/* Botões de Ação para o Cache Local */}
                <div className="mt-2.5 space-y-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenOfflineModal) onOpenOfflineModal();
                      else onNavigate("tutoria-offline");
                      onClose();
                    }}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-indigo-300 hover:text-white border border-slate-700/80 text-xs font-bold transition-all shadow-sm"
                  >
                    <Database className="w-3.5 h-3.5 text-indigo-400" />
                    Tutoria Offline (IndexedDB)
                  </button>

                  {!isSavedOffline ? (
                    <button
                      type="button"
                      disabled={isDownloading}
                      onClick={handleDownloadCurrentDiscipline}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/40"
                    >
                      <Download className="w-3.5 h-3.5" />
                      {isDownloading ? "Baixando..." : "Baixar Conteúdos da Disciplina"}
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleStudyOffline}
                        className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-sm shadow-indigo-950/40"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        Estudar Offline
                      </button>
                      <button
                        type="button"
                        disabled={isDownloading}
                        onClick={handleDownloadCurrentDiscipline}
                        className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                        title="Atualizar conteúdos em cache"
                      >
                        <RefreshCw
                          className={`w-3.5 h-3.5 ${isDownloading ? "animate-spin" : ""}`}
                        />
                      </button>
                    </div>
                  )}

                  {/* Informações de persistência */}
                  <p className="text-[9px] text-slate-400 leading-tight flex items-center gap-1 pt-0.5">
                    <HardDrive className="w-2.5 h-2.5 shrink-0 text-slate-400" />
                    <span>Cache persistente em IndexedDB mantido globalmente para todos os perfis</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé do Menu com Foto de Perfil / Silhueta e Status */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <GenericSilhouetteAvatar
              size="sm"
              role={user?.role || role}
              userId={user?.id}
              avatarUrl={user?.avatar}
              editable={true}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {user?.name || (role === "PROFESSOR" ? "Adnaldo Alves" : role === "ADMIN" ? "Administrador do Sistema" : "Estudante")}
              </p>
              <span className="text-[10px] text-slate-400 font-medium block truncate">
                {role === "ADMIN"
                  ? "Administração • ProfeIA"
                  : role === "PROFESSOR"
                  ? `Docente • ${user?.turma || "Turma INFVES3SB"}`
                  : `Estudante • ${user?.turma || "INFVES3SB"}${user?.enrollmentId ? ` • ${user.enrollmentId}` : ""}`}
              </span>
            </div>
            <span
              className={`w-2 h-2 rounded-full ${
                isOfflineMode ? "bg-amber-400" : "bg-emerald-500 animate-pulse"
              }`}
              title={isOfflineMode ? "Modo Offline Ativo (IndexedDB)" : "Online • Pronto para ficar offline (IndexedDB)"}
            />
          </div>
        </div>
      </aside>
    </>
  );
};
