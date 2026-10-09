import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  Search,
  Layers,
  Video,
  Network,
  Share2,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Clock,
  Play,
  Lightbulb,
  AlertTriangle,
  BrainCircuit,
  Filter,
  Eye,
  Shuffle,
  Calendar,
  Flame,
  Check,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  FileText,
  Compass,
  ArrowRight,
  Database
} from "lucide-react";
import {
  ContentItem,
  Discipline,
  LearningTrackLevel,
  FlashcardType,
  FlashcardItem
} from "../../types";
import {
  getStructuredSummary,
  getEnrichedGuidedResearch,
  getEnrichedFlashcards,
  getEnrichedVideos,
  getEnrichedMindMap,
  getEnrichedConceptMap,
  PROGRESSIVE_LEVEL_DEFINITIONS
} from "../../services/taxonomyData";
import { getAcademicPaper } from "../../services/academicTextService";
import { calculateSpacedRepetition } from "../../services/adaptiveEngine";
import {
  cacheStudiedContent,
  recordOfflineStudyLog,
} from "../../services/offlineTutorDB";
import { LevelTrackSelector } from "./LevelTrackSelector";
import { AdaptiveLevelingModal } from "./AdaptiveLevelingModal";

interface ContentStudyViewProps {
  discipline: Discipline;
  content: ContentItem;
  userId?: string;
  userName?: string;
  initialTab?: "resumo" | "pesquisa" | "flashcards" | "videos" | "mapas-mentais" | "mapas-conceituais";
  onBack: () => void;
  onOpenTutor: (disciplineId: string, topic: string) => void;
  onOpenActivity: (disciplineId: string) => void;
  onOpenOfflineTutor?: () => void;
}

export const ContentStudyView: React.FC<ContentStudyViewProps> = ({
  discipline,
  content: initialContent,
  userId = "aluno",
  userName = "Estudante",
  initialTab = "resumo",
  onBack,
  onOpenTutor,
  onOpenActivity,
  onOpenOfflineTutor,
}) => {
  const allDisciplineContents = discipline.modules.flatMap((m) => m.contents);
  const [activeContentId, setActiveContentId] = useState<string>(initialContent.id);
  const [isCachedInIndexedDB, setIsCachedInIndexedDB] = useState<boolean>(false);

  useEffect(() => {
    setActiveContentId(initialContent.id);
  }, [initialContent.id]);

  const content =
    allDisciplineContents.find((c) => c.id === activeContentId) || initialContent;
  const currentTopicIndex = Math.max(
    0,
    allDisciplineContents.findIndex((c) => c.id === content.id)
  );

  // Auto-cache studied content in local IndexedDB (ProfeIAOfflineDB) whenever topic changes
  useEffect(() => {
    let active = true;
    cacheStudiedContent(discipline, content, { isPinnedOffline: true })
      .then(() => {
        if (active) setIsCachedInIndexedDB(true);
        return recordOfflineStudyLog({
          actionType: "content_read",
          disciplineId: discipline.id,
          disciplineName: discipline.name,
          topicTitle: content.title,
          detail: `Capítulo sincronizado no IndexedDB para acesso offline.`,
        });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [discipline, content]);

  // 4-Level Progressive Learning Track state
  const [currentLevel, setCurrentLevel] = useState<LearningTrackLevel>(2);

  // Active study tab state (6 methods)
  const [activeTab, setActiveTab] = useState<
    "resumo" | "pesquisa" | "flashcards" | "videos" | "mapas-mentais" | "mapas-conceituais"
  >(initialTab);

  // Sync initial tab when props change and reset internal states to prevent overlap
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, content.id]);

  // Modals for Adaptive Leveling & Domain Accelerator
  const [isLevelingModalOpen, setIsLevelingModalOpen] = useState(false);
  const [isAcceleratorModalOpen, setIsAcceleratorModalOpen] = useState(false);

  // Active Recall revealing state in Resumo
  const [showActiveRecallAnswer, setShowActiveRecallAnswer] = useState(false);

  // Flashcards state
  const [selectedFlashcardType, setSelectedFlashcardType] = useState<string>("todos");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isQuestionInverted, setIsQuestionInverted] = useState(false); // Invert question / answer sides
  const [feedbackGiven, setFeedbackGiven] = useState<string | null>(null);
  const [retentionStats, setRetentionStats] = useState({
    estimatedRetention: 78,
    reviewedCount: 0,
    streak: 0,
  });

  // Videos state: simulated video player with notes scoped per user and topic
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const notesStorageKey = `profeia_notes_${userId}_${content.id}`;
  const defaultNotes = `Anotações de ${userName}: Focar nos conceitos fundamentais de ${content.title} para a lista semanal.`;
  const [studentNotes, setStudentNotes] = useState<string>(() => {
    try {
      return localStorage.getItem(notesStorageKey) || defaultNotes;
    } catch {
      return defaultNotes;
    }
  });

  useEffect(() => {
    try {
      setStudentNotes(localStorage.getItem(notesStorageKey) || defaultNotes);
    } catch {
      setStudentNotes(defaultNotes);
    }
  }, [notesStorageKey, defaultNotes]);

  // Mind map state: expanded branches
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    [`root-${content.id}`]: true,
    [`branch-fundamentos-${content.id}`]: true,
    [`branch-metodos-${content.id}`]: true,
    [`branch-aplicacoes-${content.id}`]: true,
  });

  // Concept map state: filter for interdisciplinary relations
  const [interdisciplinaryFilter, setInterdisciplinaryFilter] = useState<boolean>(false);

  // Dynamic Data Providers
  const academicPaper = getAcademicPaper(
    discipline.name,
    content.title,
    currentLevel,
    discipline.id,
    content.subtitle,
    content.prerequisites?.[0]
  );
  const structuredSummary = getStructuredSummary(content, currentLevel);
  const socraticResearch = getEnrichedGuidedResearch(content);
  const allFlashcards = getEnrichedFlashcards(content);
  const videos = getEnrichedVideos(content);
  const mindMapRoot = getEnrichedMindMap(content);
  const conceptMapRelations = getEnrichedConceptMap(content);

  // Filtered flashcards
  const filteredFlashcards = selectedFlashcardType === "todos"
    ? allFlashcards
    : allFlashcards.filter((f) => f.type === selectedFlashcardType);

  const currentCard = filteredFlashcards[currentCardIndex] || filteredFlashcards[0] || allFlashcards[0];

  const handleNextCard = () => {
    setIsFlipped(false);
    setFeedbackGiven(null);
    setCurrentCardIndex((prev) => (prev + 1) % filteredFlashcards.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setFeedbackGiven(null);
    setCurrentCardIndex((prev) =>
      prev === 0 ? filteredFlashcards.length - 1 : prev - 1
    );
  };

  const handleCardFeedback = (feedback: "repetir" | "dificil" | "bom" | "facil") => {
    const calc = calculateSpacedRepetition(currentCard?.spacedRepetitionDays || 1, feedback);
    setFeedbackGiven(calc.statusText);

    if (feedback === "repetir") {
      // Trigger Módulo de Nivelamento Automático
      setTimeout(() => {
        setIsLevelingModalOpen(true);
      }, 500);
      setRetentionStats((prev) => ({ ...prev, streak: 0 }));
    } else {
      const newStreak = retentionStats.streak + 1;
      setRetentionStats((prev) => ({
        estimatedRetention: Math.min(100, prev.estimatedRetention + 3),
        reviewedCount: prev.reviewedCount + 1,
        streak: newStreak,
      }));

      // If high performance streak, suggest Domain Accelerator (Nível 4)
      if (newStreak >= 3 && currentLevel < 4) {
        setTimeout(() => {
          setIsAcceleratorModalOpen(true);
        }, 700);
      }
    }

    setTimeout(() => {
      handleNextCard();
    }, 900);
  };

  const toggleNodeExpansion = (nodeId: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  // Subtree taxonomy path breadcrumbs
  const taxonomyPath = content.subTaxonomyPath || [
    discipline.name,
    content.title,
    PROGRESSIVE_LEVEL_DEFINITIONS[currentLevel].badge
  ];

  return (
    <div className="space-y-6 pb-16 select-none overflow-y-auto min-w-0">
      {/* Top Breadcrumbs & Quick Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
          <button
            onClick={onBack}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors flex items-center gap-1 text-xs font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar</span>
          </button>
          <span>/</span>
          {taxonomyPath.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <span
                className={`truncate max-w-[140px] sm:max-w-[200px] ${
                  idx === taxonomyPath.length - 1
                    ? "font-bold text-indigo-400"
                    : "text-slate-400"
                }`}
              >
                {crumb}
              </span>
              {idx < taxonomyPath.length - 1 && <span>→</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Quick Access to TutorIA, Offline Cache and Exercise Practice */}
        <div className="flex items-center gap-2 shrink-0">
          {onOpenOfflineTutor && (
            <button
              onClick={onOpenOfflineTutor}
              className="px-3.5 py-2 rounded-xl bg-emerald-950/70 border border-emerald-700/50 hover:bg-emerald-900/70 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              title="Abrir Cache Local IndexedDB (Modo Tutoria Offline)"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isCachedInIndexedDB ? "Em Cache Offline (IndexedDB)" : "Tutoria Offline"}</span>
            </button>
          )}

          <button
            onClick={() => onOpenActivity(content.id)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Exercícios</span>
          </button>

          <button
            onClick={() => onOpenTutor(discipline.id, content.title)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-black flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            <span>Chamar TutorIA</span>
          </button>
        </div>
      </div>

      {/* 1. ARQUITETURA DA TRILHA DE APRENDIZAGEM PROGRESSIVA (4 NÍVEIS) */}
      <LevelTrackSelector
        currentLevel={currentLevel}
        onSelectLevel={(lvl) => setCurrentLevel(lvl)}
        onTriggerAccelerator={() => setIsAcceleratorModalOpen(true)}
        showAcceleratorPrompt={retentionStats.streak >= 3 && currentLevel < 4}
      />

      {/* Title Card & Quick Summary Strip */}
      <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-2.5 py-0.5 rounded-full border border-indigo-700/40">
              {discipline.name}
            </span>
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              Estimativa: {content.estimatedMinutes} min
            </span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-800/40">
              {PROGRESSIVE_LEVEL_DEFINITIONS[currentLevel].name}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {content.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            {academicPaper.subtitle || content.subtitle}
          </p>
        </div>

        {/* Level Quick Jump Pill */}
        <div className="p-3 bg-slate-850 rounded-2xl border border-slate-800 flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-black text-sm">
            N{currentLevel}
          </div>
          <div className="text-left text-xs">
            <p className="font-bold text-white">Nível Ativo</p>
            <p className="text-[11px] text-slate-400">{PROGRESSIVE_LEVEL_DEFINITIONS[currentLevel].badge}</p>
          </div>
        </div>
      </div>

      {/* NAVEGAÇÃO RÁPIDA ENTRE AS 50 AULAS / CAPÍTULOS DA DISCIPLINA */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xs font-black text-indigo-400 bg-indigo-950/80 px-2.5 py-1.5 rounded-xl border border-indigo-500/30 shrink-0">
            Aula {currentTopicIndex + 1} de {allDisciplineContents.length}
          </span>
          <select
            value={content.id}
            onChange={(e) => setActiveContentId(e.target.value)}
            className="flex-1 min-w-0 px-3 py-2 bg-slate-950 border border-slate-700 hover:border-slate-600 rounded-xl text-xs font-bold text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            {allDisciplineContents.map((item, idx) => (
              <option key={item.id} value={item.id}>
                Capítulo {idx + 1}: {item.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 shrink-0 justify-end">
          <button
            onClick={() => {
              const prevIdx =
                currentTopicIndex > 0
                  ? currentTopicIndex - 1
                  : allDisciplineContents.length - 1;
              setActiveContentId(allDisciplineContents[prevIdx].id);
            }}
            className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 flex items-center gap-1 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Aula Anterior</span>
          </button>
          <button
            onClick={() => {
              const nextIdx = (currentTopicIndex + 1) % allDisciplineContents.length;
              setActiveContentId(allDisciplineContents[nextIdx].id);
            }}
            className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white flex items-center gap-1 transition-colors shadow-sm"
          >
            <span>Próxima Aula</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. REESTRUTURAÇÃO DOS 6 MÉTODOS DE ESTUDO (TAB BAR) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-800/80">
        {[
          { id: "resumo", label: "Resumo (Aula Estruturada)", icon: BookOpen },
          { id: "pesquisa", label: "Pesquisa Guiada (Socrática)", icon: Search },
          { id: "flashcards", label: "Flashcards Inteligentes", icon: Layers },
          { id: "videos", label: "Trilha de Vídeos", icon: Video },
          { id: "mapas-mentais", label: "Mapa Mental em Árvore", icon: Network },
          { id: "mapas-conceituais", label: "Mapa Conceitual de Relações", icon: Share2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400/20"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-slate-800"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT PANELS (BENTO BOX DARK THEME) */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl min-h-[480px]">
        {/* ========================================================================= */}
        {/* TAB 1: RESUMO (TEXTO ACADÊMICO E DE PESQUISA CONTÍNUO E APROFUNDADO) */}
        {/* ========================================================================= */}
        {activeTab === "resumo" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Header Acadêmico Formal */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/50">
                    Artigo Acadêmico & Ensaio de Pesquisa
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {academicPaper.cduCode}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
                  {academicPaper.title}
                </h2>
                <p className="text-sm font-semibold text-indigo-300 mt-1">
                  {academicPaper.subtitle}
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400">
                  <span>Área: <strong className="text-slate-300">{academicPaper.fieldArea}</strong></span>
                  <span>•</span>
                  <span>Tempo de Leitura: <strong className="text-slate-300">~{academicPaper.estimatedReadingMinutes} min</strong></span>
                  <span>•</span>
                  <span>Nível: <strong className="text-indigo-400">{PROGRESSIVE_LEVEL_DEFINITIONS[currentLevel].name}</strong></span>
                </div>
              </div>

              {/* Controles de Nível & Ações */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
                  {[1, 2, 3, 4].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setCurrentLevel(lvl as LearningTrackLevel)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                        currentLevel === lvl
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                      title={`Aprofundamento Nível ${lvl}`}
                    >
                      Nível {lvl}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => onOpenTutor(discipline.id, content.title)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>Discutir com TutorIA</span>
                </button>
              </div>
            </div>

            {/* ARTIGO ACADÊMICO CONTÍNUO (SEM CARDS OU BLOCOS FRAGMENTADOS) */}
            <article className="max-w-4xl mx-auto space-y-8 text-slate-200 font-sans leading-relaxed">
              {/* Citação ABNT de Referência Inicial */}
              <div className="p-4 bg-slate-950/60 rounded-2xl border-l-4 border-indigo-500 border border-slate-800/80 text-xs font-mono text-slate-300">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Como citar este ensaio (Padrão ABNT NBR 6023):
                </span>
                {academicPaper.abntCitation}
              </div>

              {/* Resumo Acadêmico (Abstract) */}
              <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-indigo-400">
                  RESUMO EXECUTIVO (ABSTRACT)
                </h3>
                <p className="text-sm text-slate-300 italic leading-relaxed text-justify">
                  {academicPaper.abstract}
                </p>
                <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
                  <strong className="text-slate-400 font-semibold">Palavras-chave:</strong>
                  {academicPaper.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700/60 text-slate-300 text-[11px]"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Capítulos com Texto Científico Contínuo e Fluido */}
              <div className="space-y-10 pt-4">
                {academicPaper.chapters.map((chapter) => (
                  <section key={chapter.sectionNumber} className="space-y-4">
                    <div className="border-b border-slate-800/80 pb-2">
                      <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                        Seção {chapter.sectionNumber}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                        {chapter.heading}
                      </h3>
                    </div>

                    {chapter.epigraph && (
                      <blockquote className="text-xs italic text-indigo-300/90 pl-4 border-l-2 border-indigo-500 my-2">
                        {chapter.epigraph}
                      </blockquote>
                    )}

                    {chapter.highlightEquation && (
                      <div className="my-4 p-4 rounded-xl bg-slate-950 border border-indigo-500/30 text-center font-mono text-xs sm:text-sm text-emerald-300 font-bold shadow-inner">
                        {chapter.highlightEquation}
                      </div>
                    )}

                    <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed text-justify">
                      {chapter.paragraphs.map((p, pIdx) => (
                        <p key={pIdx} className="indent-6">
                          {p}
                        </p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              {/* Considerações Finais e Implicações Epistemológicas */}
              <section className="space-y-4 pt-6 border-t border-slate-800">
                <div className="border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                    Síntese Conclusiva
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                    Considerações Epistemológicas e Síntese Científica
                  </h3>
                </div>

                <div className="space-y-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                  {academicPaper.academicConclusions.map((conclusion, cIdx) => (
                    <p key={cIdx} className="indent-6 text-justify">
                      {conclusion}
                    </p>
                  ))}
                </div>
              </section>

              {/* Referências Bibliográficas em Formato ABNT NBR 6023 */}
              <section className="space-y-3 pt-6 border-t border-slate-800">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  REFERÊNCIAS BIBLIOGRÁFICAS (ABNT NBR 6023)
                </h4>
                <div className="space-y-2 text-xs font-mono text-slate-400">
                  {academicPaper.bibliographicReferences.map((ref, rIdx) => (
                    <p key={rIdx} className="pl-4 -indent-4">
                      [{rIdx + 1}] {ref}
                    </p>
                  ))}
                </div>
              </section>
            </article>

            {/* Rodapé de Ação Pedagógica */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Texto discursivo integral gerado com rigor científico.</span>
              </div>
              <button
                onClick={() => onOpenTutor(discipline.id, content.title)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>Iniciar Debate Socrático sobre este Texto com TutorIA</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PESQUISA GUIADA (SOCRÁTICA & INVESTIGAÇÃO CIENTÍFICA) */}
        {/* ========================================================================= */}
        {activeTab === "pesquisa" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950 px-2.5 py-0.5 rounded-full border border-indigo-800/50">
                  Mestre de Investigação Socrática
                </span>
                <span className="text-xs text-slate-400">Trilha Conceitual e Cronológica</span>
              </div>
              <h3 className="text-xl font-black text-white mt-1">
                Investigação Crítica: {content.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Descoberta orientada com causas, contexto socioeconômico, impactos atuais e debates contemporâneos.
              </p>
            </div>

                {/* Questões Norteadoras da Investigação */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">
                Questões Norteadoras da Pesquisa sobre {content.title}:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-200 leading-relaxed">
                {socraticResearch.guidingQuestions.map((gq, qIdx) => (
                  <li key={qIdx} className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{gq}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4 Fases Cronológicas e Conceituais */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Etapas de Investigação e Análise:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {socraticResearch.chronologicalAndConceptualPhases.map((phase, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <h5 className="text-xs font-bold text-white">{phase.phaseTitle}</h5>
                    </div>
                    <p className="text-xs font-semibold text-indigo-300 pl-8 leading-relaxed">
                      "{phase.drivingQuestion}"
                    </p>
                    <p className="text-[11px] text-slate-400 pl-8 leading-relaxed">
                      {phase.epistemicContext}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contexto e Conceitos Estruturantes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Compass className="w-4 h-4" />
                  <span>Contexto Histórico, Teórico & Origem</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {socraticResearch.causesAndContext}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Flame className="w-4 h-4" />
                  <span>Fundamentação Conceitual & Exemplos</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {socraticResearch.socioeconomicAndTechnicalContext}
                </p>
              </div>
            </div>

            {/* Desdobramentos e Pontos de Atenção */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Relações Importantes & Aplicações Atuais</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {socraticResearch.contemporaryOutcomesAndImpacts}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" />
                  <span>Análise Crítica & Cuidados Conceituais</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {socraticResearch.historiographicalAndScientificDebates}
                </p>
              </div>
            </div>

            {/* Desafio Prático e Conclusão Orientada */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/30 to-orange-950/20 border border-amber-800/60 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>Desafio Prático de Pesquisa e Análise ({discipline.name}):</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {socraticResearch.practicalChallenge}
              </p>
              {socraticResearch.hypothesisToInvestigate && (
                <div className="mt-3 p-3 rounded-xl bg-slate-900/80 border border-amber-800/40 text-xs text-amber-200">
                  <strong className="font-bold">Objetivo de Síntese e Conclusão:</strong>{" "}
                  {socraticResearch.hypothesisToInvestigate}
                </div>
              )}
              {socraticResearch.deepDiveNotes && (
                <p className="text-[11px] text-slate-300 pt-1">
                  {socraticResearch.deepDiveNotes}
                </p>
              )}
            </div>

            {/* Fontes Reais e Identificáveis da Disciplina */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                Fontes de Pesquisa Reais e Identificáveis ({discipline.name}):
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {socraticResearch.suggestedSources.map((src, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-850 border border-slate-800 rounded-2xl text-xs text-slate-300 flex items-center justify-between hover:border-indigo-600 transition-colors"
                  >
                    <span className="pr-2 leading-snug">{src}</span>
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Registro de Análise e Conclusão do Aluno */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Sua Síntese e Conclusão sobre {content.title}:</span>
              </h4>
              <textarea
                value={studentNotes}
                onChange={(e) => {
                  const val = e.target.value;
                  setStudentNotes(val);
                  try {
                    localStorage.setItem(notesStorageKey, val);
                  } catch {}
                }}
                rows={3}
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-sans leading-relaxed"
                placeholder={`Registre aqui sua análise das fontes e sua conclusão sobre "${content.title}" em ${discipline.name}...`}
              />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: FLASHCARDS INTELIGENTES & CONECTADOS COM SPACES REPETITION */}
        {/* ========================================================================= */}
        {activeTab === "flashcards" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header & Metrics */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800/50">
                    Repetição Espaçada (Spaced Repetition)
                  </span>
                  <span className="text-xs text-slate-400">
                    Retenção Estimada: {retentionStats.estimatedRetention}%
                  </span>
                </div>
                <h3 className="text-xl font-black text-white mt-1">
                  Flashcards Conectados por Tipologia
                </h3>
              </div>

              {/* Action: Manual Leveling Trigger */}
              <button
                onClick={() => setIsLevelingModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 border border-amber-700/60 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <BrainCircuit className="w-3.5 h-3.5 text-amber-400" />
                <span>Módulo de Nivelamento</span>
              </button>
            </div>

            {/* Tipology Filter Pills (adaptadas à disciplina — fórmula somente quando existir no conteúdo) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: "todos", label: "Todos os Cards" },
                { id: "conceito", label: "Conceito/Definição" },
                { id: "causa_efeito", label: "Processo/Contexto" },
                ...(allFlashcards.some((f) => f.type === "formula")
                  ? [{ id: "formula", label: "Fórmula/Interpretação" }]
                  : []),
                { id: "comparacao", label: "Comparação & Relações" },
                { id: "erro_comum", label: "Erro Comum" },
                { id: "aplicacao", label: "Aplicação Prática" },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => {
                    setSelectedFlashcardType(pill.id);
                    setCurrentCardIndex(0);
                    setIsFlipped(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedFlashcardType === pill.id
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Flashcard Area */}
            <div className="max-w-2xl mx-auto space-y-4">
              {/* Card Meta Bar */}
              <div className="flex items-center justify-between text-xs text-slate-400 px-2">
                <span>
                  Cartão {currentCardIndex + 1} de {filteredFlashcards.length}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsQuestionInverted(!isQuestionInverted)}
                    className="hover:text-indigo-400 transition-colors flex items-center gap-1"
                    title="Inverter pergunta e resposta"
                  >
                    <Shuffle className="w-3 h-3" />
                    <span>Inverter Lados</span>
                  </button>
                  <span className="font-bold text-indigo-400 bg-indigo-950/80 px-2.5 py-0.5 rounded-md border border-indigo-800/40">
                    Tipo: {currentCard?.type || "Conceito"}
                  </span>
                </div>
              </div>

              {/* The 3D-Like Flippable Card */}
              <div
                id="flashcard"
                onClick={() => setIsFlipped(!isFlipped)}
                className={`min-h-[260px] sm:min-h-[300px] p-6 sm:p-8 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-2xl relative select-none ${
                  isFlipped
                    ? "bg-slate-850 border-emerald-500/80 ring-2 ring-emerald-500/20"
                    : "bg-slate-850/90 border-slate-700 hover:border-indigo-500/80 hover:bg-slate-800"
                }`}
              >
                {/* Side Tag */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                      isFlipped
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800/40"
                        : "bg-indigo-950 text-indigo-400 border border-indigo-800/40"
                    }`}
                  >
                    {isFlipped
                      ? isQuestionInverted ? "Pergunta Original" : "Resposta & Explicação"
                      : isQuestionInverted ? "Resposta (Adivinhe o Conceito)" : "Pergunta de Fixação"}
                  </span>

                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <RotateCw className="w-3 h-3" />
                    Clique para virar
                  </span>
                </div>

                {/* Card Content Text */}
                <div className="my-auto py-4 text-center">
                  <p
                    className={`leading-relaxed font-sans ${
                      isFlipped
                        ? "text-sm sm:text-base text-slate-100 font-medium"
                        : "text-base sm:text-lg text-white font-bold"
                    }`}
                  >
                    {isFlipped
                      ? isQuestionInverted ? currentCard?.question : currentCard?.answer
                      : isQuestionInverted ? currentCard?.answer : currentCard?.question}
                  </p>
                </div>

                {/* Card Footer Hint */}
                <div className="text-center pt-2 border-t border-slate-800/80 text-[11px] text-slate-500">
                  {isFlipped ? "Como foi sua resposta mental?" : "Tente responder antes de virar"}
                </div>
              </div>

              {/* Status Feedback Toast */}
              {feedbackGiven && (
                <div className="p-3 bg-indigo-950/60 border border-indigo-800/60 rounded-2xl text-center text-xs font-bold text-indigo-300 animate-in fade-in">
                  {feedbackGiven}
                </div>
              )}

              {/* Spaced Repetition Feedback Buttons (4 Intervalos) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <button
                  onClick={() => handleCardFeedback("repetir")}
                  className="p-3 rounded-2xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 text-xs font-bold flex flex-col items-center justify-center gap-0.5 transition-colors"
                >
                  <span>Errei / Repetir</span>
                  <span className="text-[10px] opacity-70">Nivelamento Imediato</span>
                </button>

                <button
                  onClick={() => handleCardFeedback("dificil")}
                  className="p-3 rounded-2xl bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800/60 text-amber-300 text-xs font-bold flex flex-col items-center justify-center gap-0.5 transition-colors"
                >
                  <span>Difícil</span>
                  <span className="text-[10px] opacity-70">Rever em 2 dias</span>
                </button>

                <button
                  onClick={() => handleCardFeedback("bom")}
                  className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-bold flex flex-col items-center justify-center gap-0.5 transition-colors"
                >
                  <span>Bom / Médio</span>
                  <span className="text-[10px] opacity-70">Rever em 4 dias</span>
                </button>

                <button
                  onClick={() => handleCardFeedback("facil")}
                  className="p-3 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 text-emerald-300 text-xs font-bold flex flex-col items-center justify-center gap-0.5 transition-colors"
                >
                  <span>Fácil / Domínio</span>
                  <span className="text-[10px] opacity-70">Rever em 7 dias</span>
                </button>
              </div>

              {/* Card Navigation Arrows */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handlePrevCard}
                  className="px-4 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>

                <button
                  onClick={handleNextCard}
                  className="px-4 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <span>Próximo</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: TRILHA AUDIOVISUAL (VÍDEOS DO BÁSICO AO APROFUNDAMENTO) */}
        {/* ========================================================================= */}
        {activeTab === "videos" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950 px-2.5 py-0.5 rounded-full border border-indigo-800/50">
                  Trilha Audiovisual Progressiva
                </span>
                <span className="text-xs text-slate-400">Do Nível 1 ao Nível 4</span>
              </div>
              <h3 className="text-xl font-black text-white mt-1">
                Aulas Recomendadas para {content.title}
              </h3>
            </div>

            {/* Video Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {videos.map((vid) => (
                <div
                  key={vid.id}
                  className="p-5 rounded-3xl border border-slate-800 bg-slate-850/80 hover:bg-slate-850 transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    {/* Simulated Player Thumb */}
                    <div className="relative w-full h-40 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center text-white mb-3 shadow-inner border border-slate-800">
                      <div
                        onClick={() => setSelectedVideoId(vid.id)}
                        className="w-14 h-14 rounded-full bg-indigo-600/90 hover:bg-indigo-500 hover:scale-110 flex items-center justify-center text-white cursor-pointer shadow-lg shadow-indigo-600/40 transition-transform"
                      >
                        <Play className="w-6 h-6 fill-white translate-x-0.5" />
                      </div>
                      <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 text-[11px] font-mono font-bold">
                        {vid.duration}
                      </span>
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-indigo-950/90 border border-indigo-700/60 text-indigo-300 text-[10px] font-black uppercase">
                        Nível {vid.level || 1}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white leading-snug">
                      {vid.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {vid.description}
                    </p>
                  </div>

                  {/* Mandated Video Metadata Specs */}
                  <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
                    {/* Pré-requisitos necessários */}
                    <div>
                      <strong className="text-slate-400 text-[11px] uppercase tracking-wider block">
                        Pré-requisitos Necessários:
                      </strong>
                      <p className="text-slate-200 text-xs">
                        {vid.prerequisites?.join(", ") || "Conceitos fundamentais da disciplina."}
                      </p>
                    </div>

                    {/* O que será aprendido */}
                    <div>
                      <strong className="text-slate-400 text-[11px] uppercase tracking-wider block">
                        O que será Aprendido:
                      </strong>
                      <ul className="list-disc list-inside text-indigo-300 space-y-0.5 text-xs">
                        {vid.whatWillBeLearned?.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        )) || <li>Dedução formal e resolução prática.</li>}
                      </ul>
                    </div>

                    {/* Importância prática */}
                    <div>
                      <strong className="text-slate-400 text-[11px] uppercase tracking-wider block">
                        Importância Prática:
                      </strong>
                      <p className="text-emerald-400 text-xs">
                        {vid.practicalImportance || "Aplicação direta em simulados e projetos técnicos."}
                      </p>
                    </div>

                    {/* O que estudar em seguida */}
                    <div>
                      <strong className="text-slate-400 text-[11px] uppercase tracking-wider block">
                        O que Estudar em Seguida:
                      </strong>
                      <p className="text-amber-300 text-xs">
                        {vid.nextStepsToStudy || "Resolver a próxima lista de exercícios e revisar flashcards."}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-400">{vid.channel}</span>
                    <button
                      onClick={() => setSelectedVideoId(vid.id)}
                      className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
                    >
                      <span>Abrir Player Integrado</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* In-App Video Study Notes Simulator */}
            <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Caderno de Notas de Aula ({userName})</span>
              </h4>
              <textarea
                value={studentNotes}
                onChange={(e) => {
                  const val = e.target.value;
                  setStudentNotes(val);
                  try {
                    localStorage.setItem(notesStorageKey, val);
                  } catch {}
                }}
                rows={3}
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-sans"
                placeholder="Escreva suas anotações das videoaulas aqui..."
              />
              <span className="text-[10px] text-slate-500 block">
                As anotações ficam salvas e integradas ao seu histórico pedagógico do TutorIA.
              </span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: MAPA MENTAL (HIERARQUIA VISUAL EM ÁRVORE PROFUNDA DE 4 NÍVEIS) */}
        {/* ========================================================================= */}
        {activeTab === "mapas-mentais" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950 px-2.5 py-0.5 rounded-full border border-indigo-800/50">
                    Hierarquia Visual em Árvore
                  </span>
                  <span className="text-xs text-slate-400">Mínimo 4 Níveis de Profundidade</span>
                </div>
                <h3 className="text-xl font-black text-white mt-1">
                  Mapa Mental Expansível: {content.title}
                </h3>
              </div>

              <div className="text-xs text-slate-400">
                <span>Clique nos ramos para expandir ou recolher subconceitos.</span>
              </div>
            </div>

            {/* Tree Container Bento Box */}
            <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 space-y-6 overflow-x-auto">
              {/* Root Node (Nível 0) */}
              <div className="flex flex-col items-center">
                <div className="px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black text-base shadow-xl text-center max-w-md border border-indigo-400/30">
                  {mindMapRoot.label}
                  <p className="text-xs font-normal text-indigo-200 mt-1">
                    {mindMapRoot.description}
                  </p>
                </div>
                <div className="w-0.5 h-6 bg-indigo-500/50" />
              </div>

              {/* Level 1 Branches */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mindMapRoot.children?.map((branch) => {
                  const isBranchOpen = Boolean(expandedNodes[branch.id]);
                  return (
                    <div
                      key={branch.id}
                      className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between"
                    >
                      {/* Branch Header (Nível 1) */}
                      <div>
                        <button
                          onClick={() => toggleNodeExpansion(branch.id)}
                          className="w-full text-left flex items-center justify-between p-3 rounded-2xl bg-slate-850 hover:bg-slate-800 border border-slate-700/80 transition-colors"
                        >
                          <span className="text-xs font-black text-indigo-300">
                            {branch.label}
                          </span>
                          {isBranchOpen ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                        <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                          {branch.description}
                        </p>
                      </div>

                      {/* Level 2 & Level 3 Children */}
                      {isBranchOpen && branch.children && (
                        <div className="space-y-3 pt-2 border-t border-slate-800">
                          {branch.children.map((subNode) => {
                            const isSubOpen = Boolean(expandedNodes[subNode.id] ?? true);
                            return (
                              <div
                                key={subNode.id}
                                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2"
                              >
                                <button
                                  onClick={() => toggleNodeExpansion(subNode.id)}
                                  className="w-full text-left flex items-center justify-between"
                                >
                                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    <span>{subNode.label}</span>
                                  </span>
                                  {isSubOpen ? (
                                    <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                                  ) : (
                                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                                  )}
                                </button>

                                <p className="text-[10px] text-slate-400 leading-relaxed">
                                  {subNode.description}
                                </p>

                                {/* Level 3 Leaf Nodes (Detalhe Técnico & Exemplo) */}
                                {isSubOpen && subNode.children && (
                                  <div className="space-y-2 pt-2 border-t border-slate-850">
                                    {subNode.children.map((leaf) => (
                                      <div
                                        key={leaf.id}
                                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px] space-y-1"
                                      >
                                        <div className="font-bold text-indigo-300">
                                          • {leaf.label}
                                        </div>
                                        {leaf.technicalDetail && (
                                          <p className="text-slate-400 text-[10px]">
                                            <strong className="text-slate-300">Técnico:</strong> {leaf.technicalDetail}
                                          </p>
                                        )}
                                        {leaf.example && (
                                          <p className="text-emerald-400 text-[10px]">
                                            <strong>Exemplo:</strong> {leaf.example}
                                          </p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: MAPA CONCEITUAL (REDE SEMÂNTICA COM VERBOS DE LIGAÇÃO E INTERDISCIPLINARIDADE) */}
        {/* ========================================================================= */}
        {activeTab === "mapas-conceituais" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950 px-2.5 py-0.5 rounded-full border border-indigo-800/50">
                    Rede Semântica de Proposições
                  </span>
                  <span className="text-xs text-slate-400">Verbos de Ligação Explícitos</span>
                </div>
                <h3 className="text-xl font-black text-white mt-1">
                  Grafo Conceitual: {content.title}
                </h3>
              </div>

              {/* Interdisciplinary Filter Toggle */}
              <button
                onClick={() => setInterdisciplinaryFilter(!interdisciplinaryFilter)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  interdisciplinaryFilter
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30 ring-2 ring-purple-400"
                    : "bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-800"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                <span>
                  {interdisciplinaryFilter ? "Exibindo Interdisciplinares" : "Filtrar Interdisciplinares"}
                </span>
              </button>
            </div>

            {/* Relations List (Bento Box Semantic Edges) */}
            <div className="space-y-3">
              {conceptMapRelations
                .filter((rel) => !interdisciplinaryFilter || Boolean(rel.interdisciplinaryArea))
                .map((rel, i) => (
                  <div
                    key={i}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* From Node */}
                      <div className="flex-1">
                        <span className="text-xs font-bold text-white bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 block sm:inline-block">
                          {rel.from}
                        </span>
                      </div>

                      {/* Relationship Verb (Explicativo) */}
                      <div className="flex flex-col items-center justify-center shrink-0 px-2">
                        <span className="text-xs font-black text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-lg border border-indigo-800/50 shadow-sm">
                          — {rel.relationship} —▶
                        </span>
                      </div>

                      {/* To Node */}
                      <div className="flex-1 sm:text-right">
                        <span className="text-xs font-bold text-indigo-200 bg-indigo-950/60 px-3 py-1.5 rounded-xl border border-indigo-700/50 block sm:inline-block">
                          {rel.to}
                        </span>
                      </div>
                    </div>

                    {/* Context Note & Interdisciplinary Badge */}
                    <div className="pt-2 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400">
                      <span>{rel.contextNote}</span>
                      {rel.interdisciplinaryArea && (
                        <span className="text-purple-400 bg-purple-950/80 px-2.5 py-0.5 rounded-md border border-purple-800/40 font-bold shrink-0 inline-flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Conexão com {rel.interdisciplinaryArea}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: MÓDULO DE NIVELAMENTO AUTOMÁTICO (EM CASO DE ERRO OU DÚVIDA) */}
      <AdaptiveLevelingModal
        isOpen={isLevelingModalOpen}
        onClose={() => setIsLevelingModalOpen(false)}
        topicTitle={content.title}
        disciplineId={discipline.id}
        isAcceleratorMode={false}
        onLevelAdjusted={(newLevel) => {
          setCurrentLevel(newLevel);
          setIsLevelingModalOpen(false);
        }}
        onReviewTopic={() => {
          setActiveTab("resumo");
          setIsLevelingModalOpen(false);
        }}
      />

      {/* MODAL: ACELERADOR DE DOMÍNIO (NÍVEL 4 APROFUNDAMENTO) */}
      <AdaptiveLevelingModal
        isOpen={isAcceleratorModalOpen}
        onClose={() => setIsAcceleratorModalOpen(false)}
        topicTitle={content.title}
        disciplineId={discipline.id}
        isAcceleratorMode={true}
        onLevelAdjusted={(newLevel) => {
          setCurrentLevel(newLevel);
          setIsAcceleratorModalOpen(false);
        }}
      />
    </div>
  );
};
