import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  Play,
  Layers,
  HelpCircle,
  HardDrive,
  Download,
  RefreshCw
} from "lucide-react";
import { Discipline, ContentItem } from "../../types";
import { getTopicDomainKnowledge } from "../../services/pedagogicalKnowledgeBase";
import {
  isDisciplineSavedOffline,
  downloadDisciplineForOffline,
  getDisciplineOfflineMeta
} from "../../services/offlineTutorDB";

interface DisciplineDetailViewProps {
  discipline: Discipline;
  onBack: () => void;
  onOpenContent: (disciplineId: string, contentId: string) => void;
  onOpenTutorWithContext: (disciplineId: string, topic: string) => void;
}

export const DisciplineDetailView: React.FC<DisciplineDetailViewProps> = ({
  discipline,
  onBack,
  onOpenContent,
  onOpenTutorWithContext,
}) => {
  const [isSaved, setIsSaved] = useState<boolean>(() => isDisciplineSavedOffline(discipline.id));
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  useEffect(() => {
    setIsSaved(isDisciplineSavedOffline(discipline.id));
  }, [discipline.id]);

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      await downloadDisciplineForOffline(discipline);
      setIsSaved(true);
    } finally {
      setIsDownloading(false);
    }
  };
  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb Back */}
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors flex items-center gap-1.5 text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Disciplinas
        </button>
        <span className="text-xs text-slate-400">/</span>
        <span className="text-xs font-semibold text-slate-700">{discipline.name}</span>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-indigo-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                {discipline.category}
              </span>
              {isSaved ? (
                <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-400/40 px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Salvo para Acesso Offline
                </span>
              ) : (
                <button
                  type="button"
                  disabled={isDownloading}
                  onClick={handleDownload}
                  className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-3 py-1 rounded-full transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  {isDownloading ? "Baixando..." : "Salvar no Cache Offline"}
                </button>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-3">
              {discipline.name}
            </h1>
            <p className="text-sm text-indigo-200 mt-2 max-w-2xl leading-relaxed">
              {discipline.description}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shrink-0 text-center sm:text-left">
            <span className="text-xs text-indigo-200 block font-medium">Progresso Geral</span>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-3xl font-black">{discipline.progressPercent}%</span>
              <div className="w-24 h-2.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full"
                  style={{ width: `${discipline.progressPercent}%` }}
                />
              </div>
            </div>
            <span className="text-[11px] text-indigo-300 mt-1 block">
              {discipline.modules.length} {discipline.modules.length === 1 ? "módulo estruturado" : "módulos estruturados"}
            </span>
          </div>
        </div>
      </div>

      {/* Modules and Topics List */}
      <div className="space-y-6">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          Módulos e Tópicos de Aprendizagem
        </h2>

        {discipline.modules.map((module, mIdx) => (
          <div
            key={module.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm"
          >
            <div className="p-6 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Módulo {mIdx + 1}
                </span>
                <h3 className="text-base font-black text-slate-900 mt-0.5">
                  {module.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{module.description}</p>
              </div>
              <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1 rounded-xl border border-slate-200 self-start sm:self-auto">
                {module.contents.length} {module.contents.length === 1 ? "tópico" : "tópicos"}
              </span>
            </div>

            <div className="p-6 divide-y divide-slate-100">
              {module.contents.map((content) => (
                <div
                  key={content.id}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col lg:flex-row lg:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        content.completed
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-indigo-50 text-indigo-600"
                      }`}
                    >
                      {content.completed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Play className="w-4 h-4 fill-indigo-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {content.title}
                        </h4>
                        {content.completed && (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            Concluído
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                        {content.subtitle}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          ~{content.estimatedMinutes} minutos
                        </span>
                        <span>•</span>
                        <span>{content.flashcards.length} Flashcards</span>
                        <span>•</span>
                        <span>{content.videos.length} Videoaulas</span>
                        <span>•</span>
                        <span className="text-amber-600 font-medium">
                          Pré-requisito: {getTopicDomainKnowledge(discipline.id, content.title, content.subtitle).prerequisiteTitle}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                    <button
                      onClick={() => onOpenTutorWithContext(discipline.id, content.title)}
                      className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                      title="Abrir TutorIA focado neste tópico"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      TutorIA
                    </button>
                    <button
                      onClick={() => onOpenContent(discipline.id, content.id)}
                      className="px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                    >
                      Estudar Tópico
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
