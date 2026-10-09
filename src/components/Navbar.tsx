import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Search,
  Bell,
  User,
  GraduationCap,
  BookOpen,
  HelpCircle,
  X,
  ChevronRight,
  CheckCircle2,
  Network,
  Layers,
  Video,
  FileText,
  Clock,
  ArrowRight,
  Filter,
  Check,
  Mail,
  Menu,
  Database,
  WifiOff,
  ArrowLeft
} from "lucide-react";
import { UserProfile, Discipline, NotificationItem } from "../types";
import { searchEducationalLibrary, SearchResultItem } from "../services/searchService";
import { isOfflineTutorModeEnabled } from "../services/offlineTutorDB";
import { NotificationModal } from "./NotificationModal";
import { GenericSilhouetteAvatar } from "./common/GenericSilhouetteAvatar";

interface NavbarProps {
  user: UserProfile;
  disciplines: Discipline[];
  notifications?: NotificationItem[];
  onToggleSidebar?: () => void;
  onBack?: () => void;
  onSelectDiscipline: (disciplineId: string) => void;
  onOpenContent?: (disciplineId: string, contentId: string, initialTab?: any) => void;
  onSelectContent?: (disciplineId: string, contentId: string, initialTab?: any) => void;
  onOpenActivity?: (questionId: string) => void;
  onOpenTutor?: (disciplineId?: string, topic?: string) => void;
  onOpenTutorWithContext?: (disciplineId?: string, topic?: string) => void;
  onOpenOfflineTutor?: () => void;
  onOpenProfile?: () => void;
  onSwitchRole?: () => void;
  onToggleRole?: () => void;
  onOpenLogin?: () => void;
  onMarkNotificationRead?: (id: string) => void;
  onNavigateToNotifications?: () => void;
  onNavigateToAction?: (notif: NotificationItem) => void;
  unreadCount?: number;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  disciplina: <BookOpen className="w-4 h-4 text-indigo-500" />,
  resumo: <FileText className="w-4 h-4 text-blue-500" />,
  "mapa-mental": <Layers className="w-4 h-4 text-violet-500" />,
  "mapa-conceitual": <Network className="w-4 h-4 text-cyan-500" />,
  "pesquisa-guiada": <Sparkles className="w-4 h-4 text-amber-500" />,
  flashcard: <Layers className="w-4 h-4 text-emerald-500" />,
  video: <Video className="w-4 h-4 text-rose-500" />,
  atividade: <GraduationCap className="w-4 h-4 text-orange-500" />,
};

const FILTER_TABS = [
  { id: "all", label: "Tudo" },
  { id: "resumo", label: "Resumos" },
  { id: "mapa-mental", label: "Mapas Mentais" },
  { id: "mapa-conceitual", label: "Mapas Conceituais" },
  { id: "flashcard", label: "Flashcards" },
  { id: "atividade", label: "Atividades" },
  { id: "pesquisa-guiada", label: "Pesquisa Guiada" },
  { id: "video", label: "Vídeos" },
];

export const Navbar: React.FC<NavbarProps> = ({
  user,
  disciplines = [],
  notifications = [],
  onToggleSidebar,
  onBack,
  onSelectDiscipline,
  onOpenContent,
  onSelectContent,
  onOpenActivity,
  onOpenTutor,
  onOpenTutorWithContext,
  onOpenOfflineTutor,
  onOpenProfile,
  onSwitchRole,
  onToggleRole,
  onOpenLogin,
  onMarkNotificationRead,
  onNavigateToNotifications,
  onNavigateToAction,
  unreadCount,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotificationModal, setSelectedNotificationModal] = useState<NotificationItem | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(isOfflineTutorModeEnabled());

  useEffect(() => {
    const syncOfflineStatus = () => setIsOfflineMode(isOfflineTutorModeEnabled());
    window.addEventListener("online", syncOfflineStatus);
    window.addEventListener("offline", syncOfflineStatus);
    window.addEventListener("profeia-offline-mode-changed", syncOfflineStatus);
    return () => {
      window.removeEventListener("online", syncOfflineStatus);
      window.removeEventListener("offline", syncOfflineStatus);
      window.removeEventListener("profeia-offline-mode-changed", syncOfflineStatus);
    };
  }, []);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const safeNotifications = notifications || [];
  const unreadNotificationsCount =
    typeof unreadCount === "number"
      ? unreadCount
      : safeNotifications.filter((n) => !n.read).length;

  const handleTriggerTutor = (disciplineId?: string, topic?: string) => {
    if (onOpenTutorWithContext) {
      onOpenTutorWithContext(disciplineId, topic);
    } else if (onOpenTutor) {
      onOpenTutor(disciplineId, topic);
    }
  };

  const handleToggleRole = () => {
    if (onToggleRole) {
      onToggleRole();
    } else if (onSwitchRole) {
      onSwitchRole();
    }
  };

  const handleProfileClick = () => {
    if (onOpenProfile) {
      onOpenProfile();
    } else if (onOpenLogin) {
      onOpenLogin();
    }
  };

  const handleMarkRead = (id: string) => {
    if (onMarkNotificationRead) {
      onMarkNotificationRead(id);
    }
  };

  // Close search on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation: Escape closes dropdown
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setShowSearchResults(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Debounced search results calculation
  const [searchResults, setSearchResults] = useState<{
    results: SearchResultItem[];
    total: number;
    suggestions: string[];
  }>({ results: [], total: 0, suggestions: [] });

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ results: [], total: 0, suggestions: [] });
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      const resp = searchEducationalLibrary(searchQuery, activeFilter);
      setSearchResults({
        results: resp.results,
        total: resp.totalResults,
        suggestions: resp.suggestions,
      });
      setIsSearching(false);
    }, 120);

    return () => clearTimeout(timer);
  }, [searchQuery, activeFilter]);

  const handleOpenResult = (item: SearchResultItem) => {
    setShowSearchResults(false);
    setMobileSearchOpen(false);

    if (item.type === "disciplina") {
      onSelectDiscipline(item.subjectId);
      return;
    }

    if (item.type === "atividade" && onOpenActivity && item.id.startsWith("act-")) {
      const qId = item.id.replace("act-", "");
      onOpenActivity(qId);
      return;
    }

    const openFn = onSelectContent || onOpenContent;
    if (openFn && item.targetContentId) {
      openFn(item.subjectId, item.targetContentId, item.targetTab || "resumo");
    } else {
      onSelectDiscipline(item.subjectId);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Menu Hambúrguer (3 Barrinhas) + Logo and Brand */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Botão Hambúrguer (3 barrinhas retráteis) */}
          <button
            onClick={onToggleSidebar}
            className="p-2 -ml-1 sm:-ml-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="Abrir menu lateral"
            aria-label="Menu principal"
          >
            <Menu className="w-5 h-5 text-slate-800" />
          </button>

          {/* Botão Global Voltar */}
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold flex items-center gap-1 border border-slate-200 transition-colors"
              title="Voltar ao menu anterior"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Voltar</span>
            </button>
          )}

          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Profe<span className="text-indigo-600">IA</span>
              </span>
              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-indigo-200">
                Educação Híbrida
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Aprendizagem Adaptativa com IA
            </p>
          </div>
        </div>

        {/* Global Search Bar (Desktop) */}
        <div
          ref={searchContainerRef}
          className="relative flex-1 max-w-xl hidden md:block"
        >
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              id="barra-pesquisa"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              placeholder="Pesquisar disciplinas, temas, redação, fotossíntese, SQL, Bhaskara..."
              className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 text-slate-800 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setShowSearchResults(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded"
                title="Limpar pesquisa"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Dropdown Results with Categories and Highlighting */}
          {showSearchResults && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[80vh] flex flex-col">
              {/* Header Status & Filters */}
              <div className="p-3 bg-slate-50 border-b border-slate-100 flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <span>Resultados para "{searchQuery}"</span>
                    {isSearching ? (
                      <span className="text-indigo-600 text-[11px] animate-pulse">
                        Buscando no acervo...
                      </span>
                    ) : (
                      <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {searchResults.total} encontrados
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setShowSearchResults(false);
                    }}
                    className="text-[11px] text-slate-400 hover:text-slate-600"
                  >
                    Fechar (Esc)
                  </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {FILTER_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveFilter(tab.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                        activeFilter === tab.id
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto max-h-[420px] divide-y divide-slate-100">
                {searchResults.total === 0 && !isSearching ? (
                  <div className="p-8 text-center text-slate-500">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                      <HelpCircle className="w-6 h-6" />
                    </div>
                    <p className="font-semibold text-slate-700 text-sm">
                      Nenhum resultado encontrado para "{searchQuery}"
                    </p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      Experimente um dos tópicos populares abaixo para explorar o acervo pedagógico:
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                      {searchResults.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setSearchQuery(sug);
                            searchInputRef.current?.focus();
                          }}
                          className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium border border-indigo-200 transition-colors"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  searchResults.results.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleOpenResult(item)}
                      className="p-3.5 hover:bg-indigo-50/60 cursor-pointer transition-colors group flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-white flex items-center justify-center shrink-0 border border-slate-200/80 shadow-xs">
                          {TYPE_ICONS[item.type] || <BookOpen className="w-4 h-4 text-indigo-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                              {item.title}
                            </span>
                            <span className="bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                              {item.typeLabel}
                            </span>
                          </div>
                          <p className="text-[11px] font-medium text-indigo-700 mb-1">
                            {item.subject}
                          </p>
                          {item.snippet && (
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                              {item.snippet}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        className="px-2.5 py-1.5 rounded-lg bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white text-indigo-700 text-xs font-bold shrink-0 transition-colors flex items-center gap-1 mt-1 shadow-xs"
                      >
                        <span>Abrir</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Footer CTA */}
              <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-4">
                <span>Dica: Pressione <strong>Esc</strong> para sair da pesquisa.</span>
                <button
                  onClick={() => {
                    handleTriggerTutor(undefined, searchQuery);
                    setShowSearchResults(false);
                  }}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Perguntar ao TutorIA</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Actions: Search Mobile Button, TutorIA CTA, Notifications, Profile, Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Search Trigger Button */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            title="Abrir busca"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Offline Tutoring (IndexedDB) CTA */}
          {onOpenOfflineTutor && (
            <button
              onClick={onOpenOfflineTutor}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                isOfflineMode
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm"
                  : "bg-slate-900 hover:bg-slate-800 text-emerald-300 border-slate-700"
              }`}
              title="Abrir Tutoria Offline (Cache Local IndexedDB)"
            >
              {isOfflineMode ? (
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Database className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span className="hidden lg:inline">
                {isOfflineMode ? "Offline (IndexedDB)" : "Tutoria Offline"}
              </span>
            </button>
          )}

          {/* TutorIA Quick Voice Call CTA */}
          <button
            onClick={() => handleTriggerTutor()}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-semibold shadow-sm shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Abrir sessão de tutoria por voz e vídeo com o TutorIA"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Chamar TutorIA</span>
            <span className="sm:hidden">TutorIA</span>
          </button>

          {/* Active Profile Info Badge (Sem botão de alternância de papel) */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs select-none">
            <span
              className={`w-2 h-2 rounded-full ${
                user.role === "PROFESSOR" ? "bg-amber-500" : "bg-emerald-500"
              }`}
            />
            <span className="text-[11px] font-bold text-slate-700">
              {user.role === "PROFESSOR" ? "Professor" : "Aluno (INFVES3SB)"}
            </span>
          </div>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors relative"
              title="Notificações e Avisos"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-slate-700" />
                    <span className="text-xs font-bold text-slate-800">
                      Notificações
                    </span>
                    {unreadNotificationsCount > 0 && (
                      <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {unreadNotificationsCount} novas
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {safeNotifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                      Nenhuma notificação no momento.
                    </div>
                  ) : (
                    safeNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          handleMarkRead(notif.id);
                          setShowNotifications(false);
                          setSelectedNotificationModal(notif);
                        }}
                        className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer group hover:bg-slate-100/80 ${
                          notif.read ? "bg-white" : "bg-indigo-50/40"
                        }`}
                        title="Clique para ler o comunicado completo (estilo e-mail)"
                      >
                        <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                              {notif.title}
                            </p>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {notif.timestamp}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">
                            {notif.description}
                          </p>
                          <span className="text-[10px] text-indigo-600 font-semibold mt-1 inline-flex items-center gap-1 group-hover:underline">
                            <Mail className="w-3 h-3" /> Abrir e-mail completo
                          </span>
                        </div>
                        {!notif.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkRead(notif.id);
                            }}
                            className="text-slate-400 hover:text-indigo-600 text-[11px] shrink-0 p-1"
                            title="Marcar como lida"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Popover Footer */}
                {onNavigateToNotifications && (
                  <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        onNavigateToNotifications();
                      }}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>Ver todas as notificações na Central</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile Avatar com ícone de câmara e sincronização instantânea via localStorage */}
          <div
            onClick={handleProfileClick}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            title="Ver Perfil ou Alterar Foto"
          >
            <GenericSilhouetteAvatar
              size="sm"
              role={user.role}
              userId={user.id}
              avatarUrl={user.avatar}
              editable={true}
            />
            <span className="text-xs font-semibold text-slate-700 hidden lg:inline max-w-[100px] truncate">
              {user.name.split(" ")[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay Input */}
      {mobileSearchOpen && (
        <div className="md:hidden p-3 bg-slate-50 border-t border-slate-200 animate-in fade-in slide-in-from-top-1">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar disciplinas, redação, SQL..."
              className="w-full pl-9 pr-9 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            <button
              onClick={() => {
                setMobileSearchOpen(false);
                setSearchQuery("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile search results preview */}
          {searchQuery.trim().length > 0 && searchResults.results.length > 0 && (
            <div className="mt-2 bg-white rounded-xl border border-slate-200 max-h-64 overflow-y-auto divide-y divide-slate-100">
              {searchResults.results.slice(0, 6).map((res) => (
                <button
                  key={res.id}
                  onClick={() => handleOpenResult(res)}
                  className="w-full text-left p-2.5 hover:bg-indigo-50/50 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                      {res.title}
                    </p>
                    <span className="text-[10px] text-indigo-600 font-medium">
                      {res.subject} • {res.typeLabel}
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pop-up Modal Estilo E-mail */}
      <NotificationModal
        notification={selectedNotificationModal}
        isOpen={!!selectedNotificationModal}
        onClose={() => setSelectedNotificationModal(null)}
        onToggleRead={handleMarkRead}
        onAction={onNavigateToAction}
        studentName={user.name}
        userEmail={user.email}
        userRole={user.role === "PROFESSOR" ? "teacher" : "student"}
      />
    </header>
  );
};
