import React, { useState, useEffect } from "react";
import {
  Wifi,
  WifiOff,
  Database,
  BookOpen,
  MessageSquare,
  Download,
  Trash2,
  CheckCircle2,
  Sparkles,
  Send,
  X,
  HardDrive,
  RefreshCw,
  Layers,
  HelpCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  FileText,
  Zap,
} from "lucide-react";
import { Discipline } from "../../types";
import {
  CachedStudiedContent,
  CachedTutorQA,
  OfflineStorageStats,
  OfflineStudyLog,
  getAllCachedContents,
  getAllCachedTutorQA,
  getOfflineStorageStats,
  getOfflineStudyLogs,
  cacheDisciplinePackageOffline,
  removeCachedContent,
  clearOfflineCache,
  resolveOfflineTutorQuery,
  isOfflineTutorModeEnabled,
  setOfflineTutorModeForced,
  getOfflineTutorModeForced,
} from "../../services/offlineTutorDB";

interface OfflineTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  disciplines: Discipline[];
  onOpenCachedContent?: (disciplineId: string, contentId: string) => void;
  onOpenVoiceTutor?: (disciplineId: string, topic: string) => void;
}

export const OfflineTutorModal: React.FC<OfflineTutorModalProps> = ({
  isOpen,
  onClose,
  disciplines,
  onOpenCachedContent,
  onOpenVoiceTutor,
}) => {
  const [activeTab, setActiveTab] = useState<
    "tutor-chat" | "cached-contents" | "sync-packages" | "logs"
  >("tutor-chat");

  const [isOfflineForced, setIsOfflineForced] = useState<boolean>(
    getOfflineTutorModeForced()
  );
  const [browserOnline, setBrowserOnline] = useState<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  const [stats, setStats] = useState<OfflineStorageStats>({
    cachedTopicsCount: 0,
    cachedQACount: 0,
    offlineLogsCount: 0,
    totalBytes: 0,
    disciplinesCovered: [],
    lastSyncedAt: new Date().toISOString(),
  });

  const [cachedContents, setCachedContents] = useState<CachedStudiedContent[]>([]);
  const [cachedQAs, setCachedQAs] = useState<CachedTutorQA[]>([]);
  const [studyLogs, setStudyLogs] = useState<OfflineStudyLog[]>([]);
  const [selectedContentPreview, setSelectedContentPreview] =
    useState<CachedStudiedContent | null>(null);

  // Sync package state
  const [syncingDisciplineId, setSyncingDisciplineId] = useState<string | null>(null);
  const [syncSuccessBanner, setSyncSuccessBanner] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [selectedDisciplineFilter, setSelectedDisciplineFilter] =
    useState<string>("todas");

  // Offline Tutor Chat State
  const [chatInput, setChatInput] = useState<string>("");
  const [selectedChatDisciplineId, setSelectedChatDisciplineId] =
    useState<string>("geral");
  const [isQueryingOffline, setIsQueryingOffline] = useState<boolean>(false);
  const [offlineMessages, setOfflineMessages] = useState<
    Array<{
      id: string;
      role: "user" | "assistant";
      content: string;
      detectedDiscipline?: string;
      detectedTopic?: string;
      cacheSource?: string;
      whiteboard?: string;
      timestamp: string;
    }>
  >([
    {
      id: "off-init-1",
      role: "assistant",
      content:
        "Modo de Tutoria Offline (IndexedDB) pronto. Selecione um capítulo em cache ou faça sua pergunta abaixo: as respostas e explicações são extraídas diretamente do banco de dados local do navegador sem depender de conexão com a internet.",
      detectedDiscipline: "Cache Local IndexedDB",
      detectedTopic: "Acesso Básico Garantido",
      cacheSource: "indexeddb-qa",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const loadIndexedDBData = async () => {
    const [loadedContents, loadedQAs, loadedStats, loadedLogs] = await Promise.all([
      getAllCachedContents(),
      getAllCachedTutorQA(),
      getOfflineStorageStats(),
      getOfflineStudyLogs(),
    ]);
    setCachedContents(loadedContents);
    setCachedQAs(loadedQAs);
    setStats(loadedStats);
    setStudyLogs(loadedLogs);
    if (!selectedContentPreview && loadedContents.length > 0) {
      setSelectedContentPreview(loadedContents[0]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadIndexedDBData();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleOnline = () => setBrowserOnline(true);
    const handleOffline = () => setBrowserOnline(false);
    const handleDBUpdated = () => {
      if (isOpen) loadIndexedDBData();
    };
    const handleModeChanged = () => {
      setIsOfflineForced(getOfflineTutorModeForced());
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("profeia-indexeddb-updated", handleDBUpdated);
    window.addEventListener("profeia-offline-mode-changed", handleModeChanged);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("profeia-indexeddb-updated", handleDBUpdated);
      window.removeEventListener("profeia-offline-mode-changed", handleModeChanged);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isOfflineActive = !browserOnline || isOfflineForced;

  const handleToggleOfflineMode = () => {
    const next = !isOfflineForced;
    setOfflineTutorModeForced(next);
    setIsOfflineForced(next);
  };

  const handleSendOfflineQuestion = async (presetQuery?: string) => {
    const query = (presetQuery || chatInput).trim();
    if (!query) return;
    if (!presetQuery) setChatInput("");

    const userMsg = {
      id: `u-off-${Date.now()}`,
      role: "user" as const,
      content: query,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setOfflineMessages((prev) => [...prev, userMsg]);
    setIsQueryingOffline(true);

    try {
      const selectedDisc =
        selectedChatDisciplineId !== "geral"
          ? disciplines.find((d) => d.id === selectedChatDisciplineId)
          : undefined;

      const result = await resolveOfflineTutorQuery({
        query,
        selectedSubject: selectedDisc?.name,
        selectedSubjectId: selectedDisc?.id,
        conversationHistory: offlineMessages.slice(-4).map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      const assistantMsg = {
        id: `a-off-${Date.now()}`,
        role: "assistant" as const,
        content: result.reply,
        detectedDiscipline: result.detectedDisciplineName,
        detectedTopic: result.detectedTopic,
        cacheSource: result.cacheSource,
        whiteboard: result.whiteboardContent,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setOfflineMessages((prev) => [...prev, assistantMsg]);
      await loadIndexedDBData();
    } finally {
      setIsQueryingOffline(false);
    }
  };

  const handleSyncDiscipline = async (disc: Discipline) => {
    setSyncingDisciplineId(disc.id);
    try {
      const count = await cacheDisciplinePackageOffline(disc, 12);
      await loadIndexedDBData();
      setSyncSuccessBanner(
        `${count} capítulos completos de ${disc.name} foram salvos no IndexedDB para acesso sem internet!`
      );
      setTimeout(() => setSyncSuccessBanner(null), 4500);
    } finally {
      setSyncingDisciplineId(null);
    }
  };

  const handleClearAndReseed = async () => {
    await clearOfflineCache();
    await loadIndexedDBData();
    setSyncSuccessBanner(
      "Cache IndexedDB redefinido e populado com os capítulos essenciais das 15 disciplinas."
    );
    setTimeout(() => setSyncSuccessBanner(null), 4000);
  };

  const filteredContents = cachedContents.filter((c) => {
    const matchesDisc =
      selectedDisciplineFilter === "todas" ||
      c.disciplineId === selectedDisciplineFilter;
    const matchesSearch =
      !searchFilter.trim() ||
      c.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.disciplineName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.summary.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesDisc && matchesSearch;
  });

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl text-white">
        {/* ================================================================ */}
        {/* HEADER                                                           */}
        {/* ================================================================ */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
              title="Voltar ao painel anterior"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar</span>
            </button>
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-lg ${
                isOfflineActive
                  ? "bg-amber-500/20 border-amber-400/50 text-amber-300"
                  : "bg-emerald-500/20 border-emerald-400/40 text-emerald-300"
              }`}
            >
              {isOfflineActive ? (
                <WifiOff className="w-5 h-5" />
              ) : (
                <Database className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Tutoria Offline • Banco Local IndexedDB
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1.5 ${
                    isOfflineActive
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isOfflineActive ? "bg-amber-400 animate-ping" : "bg-emerald-400"
                    }`}
                  />
                  {isOfflineActive
                    ? "Modo Offline Ativo (IndexedDB)"
                    : "Conectado • Sincronização IndexedDB Ativa"}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Cache local de conteúdos estudados, capítulos acadêmicos, flashcards e
                respostas do TutorIA para estudo contínuo sem internet.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Toggle Offline Mode Button */}
            <button
              type="button"
              onClick={handleToggleOfflineMode}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                isOfflineForced
                  ? "bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
              }`}
            >
              {isOfflineForced ? (
                <>
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>Modo Offline Ativado</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ativar Modo Offline</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================================================================ */}
        {/* INDEXEDDB STORAGE METRICS BAR                                    */}
        {/* ================================================================ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 px-5 py-3 bg-slate-950/60 border-b border-slate-800/80 shrink-0">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2 flex items-center gap-3">
            <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs text-slate-400">Capítulos no IndexedDB</div>
              <div className="text-sm font-black text-white">
                {stats.cachedTopicsCount} tópicos salvos
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2 flex items-center gap-3">
            <MessageSquare className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <div className="text-xs text-slate-400">Respostas TutorIA em Cache</div>
              <div className="text-sm font-black text-white">
                {stats.cachedQACount} interações Q&A
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2 flex items-center gap-3">
            <HardDrive className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <div className="text-xs text-slate-400">Armazenamento Local</div>
              <div className="text-sm font-black text-white">
                {formatBytes(stats.totalBytes)} (ProfeIAOfflineDB)
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2 flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs text-slate-400">Cobertura Offline</div>
              <div className="text-sm font-black text-white">
                {stats.disciplinesCovered.length} disciplinas ativas
              </div>
            </div>
          </div>
        </div>

        {/* Notification Banner */}
        {syncSuccessBanner && (
          <div className="bg-emerald-950/90 border-b border-emerald-700/60 px-5 py-2.5 text-xs text-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold">{syncSuccessBanner}</span>
            </div>
            <button
              onClick={() => setSyncSuccessBanner(null)}
              className="text-emerald-400 hover:text-white font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* ================================================================ */}
        {/* NAVIGATION TABS                                                  */}
        {/* ================================================================ */}
        <div className="px-5 pt-3 bg-slate-900 border-b border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("tutor-chat")}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === "tutor-chat"
                ? "border-emerald-400 text-emerald-300 bg-slate-800/70"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Chat Tutoria Offline</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("cached-contents")}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === "cached-contents"
                ? "border-emerald-400 text-emerald-300 bg-slate-800/70"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Conteúdos Estudados em Cache ({stats.cachedTopicsCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("sync-packages")}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === "sync-packages"
                ? "border-emerald-400 text-emerald-300 bg-slate-800/70"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Baixar Pacotes por Disciplina</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("logs")}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === "logs"
                ? "border-emerald-400 text-emerald-300 bg-slate-800/70"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Histórico & Q&A Salvos ({stats.cachedQACount})</span>
          </button>
        </div>

        {/* ================================================================ */}
        {/* TAB 1: OFFLINE TUTOR CHAT                                        */}
        {/* ================================================================ */}
        {activeTab === "tutor-chat" && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
            {/* Left column: Chat conversation */}
            <div className="flex-1 flex flex-col border-r border-slate-800 min-h-0">
              <div className="px-4 py-2.5 bg-slate-900/70 border-b border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-300">
                    Contexto opcional:
                  </span>
                  <select
                    value={selectedChatDisciplineId}
                    onChange={(e) => setSelectedChatDisciplineId(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="geral">Detecção Automática (15 Disciplinas)</option>
                    {disciplines.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                {onOpenVoiceTutor && (
                  <button
                    type="button"
                    onClick={() => {
                      setOfflineTutorModeForced(true);
                      onClose();
                      onOpenVoiceTutor(
                        selectedChatDisciplineId === "geral"
                          ? "matematica"
                          : selectedChatDisciplineId,
                        "Tutoria Offline IndexedDB"
                      );
                    }}
                    className="px-3 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Abrir Chamada de Voz em Modo Offline</span>
                  </button>
                )}
              </div>

              {/* Messages list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {offlineMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-emerald-600 text-white font-medium rounded-br-none"
                          : "bg-slate-800/90 border border-slate-700/80 text-slate-100 rounded-bl-none"
                      }`}
                    >
                      {msg.role === "assistant" && msg.detectedDiscipline && (
                        <div className="flex flex-wrap items-center gap-1.5 mb-2 pb-1.5 border-b border-slate-700/70 text-[11px]">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold">
                            {msg.detectedDiscipline}
                          </span>
                          {msg.detectedTopic && (
                            <span className="text-slate-300 font-semibold">
                              • {msg.detectedTopic}
                            </span>
                          )}
                          <span className="ml-auto px-2 py-0.5 rounded bg-slate-900 text-cyan-300 font-mono text-[10px] border border-slate-700">
                            {msg.cacheSource === "indexeddb-qa"
                              ? "IndexedDB: tutor_qa_cache"
                              : msg.cacheSource === "indexeddb-content"
                              ? "IndexedDB: studied_contents"
                              : "IndexedDB: Biblioteca Local"}
                          </span>
                        </div>
                      )}
                      <div className="whitespace-pre-line">{msg.content}</div>
                      {msg.whiteboard && (
                        <div className="mt-3 p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 font-mono text-[11px] text-emerald-300 whitespace-pre-line">
                          {msg.whiteboard}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}
                {isQueryingOffline && (
                  <div className="text-xs text-emerald-400 animate-pulse px-2">
                    Consultando stores locais do IndexedDB (ProfeIAOfflineDB)...
                  </div>
                )}
              </div>

              {/* Input bar */}
              <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendOfflineQuestion();
                  }}
                  placeholder="Pergunte qualquer dúvida (ex: Bhaskara, Revolução Francesa, Chave Primária, Simple Present)..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => handleSendOfflineQuestion()}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span>Consultar Cache</span>
                </button>
              </div>
            </div>

            {/* Right column: Quick Cached Prompts & Recent Studied Chapters */}
            <div className="w-full lg:w-80 bg-slate-950/50 p-4 overflow-y-auto space-y-4 shrink-0">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Perguntas Frequentes no IndexedDB</span>
                </h3>
                <div className="space-y-1.5">
                  {cachedQAs.slice(0, 6).map((qa) => (
                    <button
                      key={qa.id}
                      type="button"
                      onClick={() => handleSendOfflineQuestion(qa.originalQuery)}
                      className="w-full text-left p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800/90 transition-colors group"
                    >
                      <div className="text-[10px] font-bold text-emerald-400 mb-0.5">
                        {qa.detectedDisciplineName}
                      </div>
                      <div className="text-xs text-slate-200 group-hover:text-white line-clamp-2 font-medium">
                        {qa.originalQuery}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Capítulos Prontos Sem Internet</span>
                </h3>
                <div className="space-y-1.5">
                  {cachedContents.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold text-cyan-400 truncate">
                          {item.disciplineName}
                        </div>
                        <div className="text-xs text-slate-200 font-semibold truncate">
                          {item.title}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleSendOfflineQuestion(`Explique ${item.title}`)
                        }
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-emerald-600 text-[10px] font-bold text-slate-200 hover:text-white shrink-0 transition-colors"
                      >
                        Revisar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 2: CACHED STUDIED CONTENTS (INDEXEDDB VIEWER)                */}
        {/* ================================================================ */}
        {activeTab === "cached-contents" && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
            {/* Left list of cached chapters */}
            <div className="w-full lg:w-5/12 border-r border-slate-800 flex flex-col min-h-0">
              <div className="p-3 bg-slate-900/80 border-b border-slate-800 space-y-2">
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filtrar capítulos em cache..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <select
                  value={selectedDisciplineFilter}
                  onChange={(e) => setSelectedDisciplineFilter(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-semibold"
                >
                  <option value="todas">Todas as Disciplinas em Cache</option>
                  {disciplines.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {filteredContents.map((item) => {
                  const isSelected = selectedContentPreview?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedContentPreview(item)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-emerald-950/40 border-emerald-500/60"
                          : "bg-slate-900/80 hover:bg-slate-800/70 border-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 text-[10px] font-bold">
                          {item.disciplineName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {formatBytes(item.sizeBytes || 2400)}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                        {item.summary}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                        <span>
                          {item.academicPaper?.chapters?.length || 4} cap. •{" "}
                          {item.questions?.length || 10} questões
                        </span>
                        <div className="flex items-center gap-2">
                          {onOpenCachedContent && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                                onOpenCachedContent(item.disciplineId, item.id);
                              }}
                              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                            >
                              <span>Abrir Estudo</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={async (e) => {
                              e.stopPropagation();
                              await removeCachedContent(item.id);
                              await loadIndexedDBData();
                            }}
                            className="text-slate-500 hover:text-rose-400"
                            title="Remover do cache"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right preview of selected cached chapter */}
            <div className="flex-1 overflow-y-auto p-5 bg-slate-950/40">
              {selectedContentPreview ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                          {selectedContentPreview.disciplineName}
                        </span>
                        <span className="text-xs text-slate-400">
                          Salvo em{" "}
                          {new Date(
                            selectedContentPreview.lastStudiedAt
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-white mt-1">
                        {selectedContentPreview.title}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {selectedContentPreview.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {onOpenCachedContent && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenCachedContent(
                              selectedContentPreview.disciplineId,
                              selectedContentPreview.id
                            );
                          }}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Abrir Capítulo Completo</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("tutor-chat");
                          handleSendOfflineQuestion(
                            `Explique os pontos principais de ${selectedContentPreview.title}`
                          );
                        }}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold flex items-center gap-1.5 border border-slate-700"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Perguntar no Tutor Offline</span>
                      </button>
                    </div>
                  </div>

                  {/* Cached Summary */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">
                      Resumo Estruturado (Cache Local IndexedDB)
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {selectedContentPreview.summary}
                    </p>
                  </div>

                  {/* Cached Academic Paper Chapters */}
                  {selectedContentPreview.academicPaper?.chapters && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                        Texto Acadêmico Armazenado Offline (
                        {selectedContentPreview.academicPaper.chapters.length}{" "}
                        Seções)
                      </h4>
                      {selectedContentPreview.academicPaper.chapters
                        .slice(0, 2)
                        .map((ch, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2"
                          >
                            <div className="text-xs font-bold text-white">
                              {ch.heading}
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {ch.paragraphs[0]}
                            </p>
                            {ch.highlightEquation && (
                              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300">
                                {ch.highlightEquation}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Cached Questions Preview */}
                  {selectedContentPreview.questions &&
                    selectedContentPreview.questions.length > 0 && (
                      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                          Banco de Questões Offline (
                          {selectedContentPreview.questions.length} questões
                          disponíveis sem internet)
                        </h4>
                        <div className="space-y-2">
                          {selectedContentPreview.questions
                            .slice(0, 2)
                            .map((q, idx) => (
                              <div
                                key={q.id}
                                className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300"
                              >
                                <span className="font-bold text-amber-300">
                                  Questão {idx + 1}:{" "}
                                </span>
                                {q.statement}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-500">
                  Selecione um capítulo à esquerda para inspecionar o conteúdo salvo no
                  IndexedDB.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 3: DOWNLOAD DISCIPLINE PACKAGES FOR OFFLINE ACCESS           */}
        {/* ================================================================ */}
        {activeTab === "sync-packages" && (
          <div className="flex-1 overflow-y-auto p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-black text-white">
                  Sincronizar Pacotes de Disciplinas no IndexedDB
                </h3>
                <p className="text-xs text-slate-400">
                  Salve capítulos, apostilas acadêmicas, flashcards e listas de 10
                  questões de qualquer uma das 15 disciplinas diretamente no navegador.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClearAndReseed}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 border border-slate-700"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Redefinir Cache Padrão</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {disciplines.map((disc) => {
                const cachedForDisc = cachedContents.filter(
                  (c) => c.disciplineId === disc.id
                ).length;
                const totalTopics = disc.modules.reduce(
                  (acc, m) => acc + m.contents.length,
                  0
                );
                const isSyncing = syncingDisciplineId === disc.id;

                return (
                  <div
                    key={disc.id}
                    className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                          {disc.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300">
                          {cachedForDisc} / {totalTopics} em cache
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1">
                        {disc.name}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                        {disc.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={isSyncing}
                      onClick={() => handleSyncDiscipline(disc)}
                      className="w-full py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-2 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>
                        {isSyncing
                          ? "Salvando no IndexedDB..."
                          : cachedForDisc >= 10
                          ? "Atualizar Pacote Offline"
                          : "Salvar Pacote no IndexedDB"}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 4: LOGS & SAVED Q&A PAIRS                                    */}
        {/* ================================================================ */}
        {activeTab === "logs" && (
          <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Respostas do TutorIA Salvas no IndexedDB (tutor_qa_cache)
              </h3>
              {cachedQAs.map((qa) => (
                <div
                  key={qa.id}
                  className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                      {qa.detectedDisciplineName} • {qa.detectedTopic}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("tutor-chat");
                        handleSendOfflineQuestion(qa.originalQuery);
                      }}
                      className="text-emerald-400 hover:underline font-bold"
                    >
                      Carregar no Chat
                    </button>
                  </div>
                  <div className="text-xs font-bold text-white">
                    P: {qa.originalQuery}
                  </div>
                  <div className="text-xs text-slate-300 line-clamp-3">
                    {qa.reply}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Registros de Estudo Offline (offline_study_logs)
              </h3>
              {studyLogs.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
                  Os eventos de sincronização e estudo offline aparecerão aqui
                  automaticamente conforme você estuda capítulos ou consulta o
                  TutorIA.
                </div>
              ) : (
                studyLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="text-[10px] font-bold text-emerald-400">
                        {log.disciplineName} • {log.topicTitle}
                      </div>
                      <div className="text-xs text-slate-200 mt-0.5">
                        {log.detail}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
