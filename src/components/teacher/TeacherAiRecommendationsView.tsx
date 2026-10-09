import React, { useState, useEffect } from "react";
import {
  Lightbulb,
  CheckCircle2,
  Calendar,
  Send,
  Users,
  Clock,
  Filter,
  ArrowLeft,
  BookOpen,
  FileDown,
  History,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import {
  TeacherAiRecommendation,
  TopicDifficultyStat,
  LessonPlanRecord,
  TeacherInterventionRecord,
} from "../../types";
import {
  findDifficultyForRecommendation,
  loadLessonPlans,
  saveLessonPlan,
  loadTeacherInterventions,
  saveTeacherIntervention,
} from "../../data/teacherData";
import { generateLessonPlanPdf } from "../../services/pdfReportGenerator";
import { LessonPlanModal } from "./LessonPlanModal";
import { AffectedStudentsModal } from "./AffectedStudentsModal";
import { ScheduleLevelingModal } from "./ScheduleLevelingModal";
import { NotifyStudentsModal } from "./NotifyStudentsModal";

interface TeacherAiRecommendationsViewProps {
  recommendations: Array<TeacherAiRecommendation & { disciplineName?: string }>;
  difficulties?: TopicDifficultyStat[];
  onTriggerAction?: (actionType: string, recTitle: string, details?: any) => void;
  onInterventionCreated?: () => void;
  onBack?: () => void;
}

const OFFICIAL_15_DISCIPLINES = [
  "Todas",
  "Matemática",
  "Biologia",
  "Física",
  "Geografia",
  "Sociologia",
  "Análise e Projeto de Sistemas",
  "Matéria Prática de Estágio e TCC",
  "Banco de Dados",
  "Língua Portuguesa e Redação",
  "Desenvolvimento Web",
  "História",
  "Robótica",
  "Design de Interface",
  "Projeto de Empreendedorismo Social e Economia Solidária",
  "Língua Inglesa",
];

export const TeacherAiRecommendationsView: React.FC<
  TeacherAiRecommendationsViewProps
> = ({
  recommendations = [],
  difficulties = [],
  onTriggerAction,
  onInterventionCreated,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<"todas" | "alta" | "projetos">(
    "todas"
  );
  const [selectedDiscipline, setSelectedDiscipline] =
    useState<string>("Todas");
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Modals state
  const [lessonPlanRec, setLessonPlanRec] =
    useState<TeacherAiRecommendation | null>(null);
  const [remediationContext, setRemediationContext] = useState<{
    rec: TeacherAiRecommendation;
    topicStat: TopicDifficultyStat;
  } | null>(null);
  const [scheduleContext, setScheduleContext] = useState<{
    rec: TeacherAiRecommendation;
    topicStat: TopicDifficultyStat;
  } | null>(null);
  const [notifyRec, setNotifyRec] = useState<TeacherAiRecommendation | null>(
    null
  );

  // Persistent records state
  const [interventions, setInterventions] = useState<
    TeacherInterventionRecord[]
  >([]);
  const [lessonPlans, setLessonPlans] = useState<LessonPlanRecord[]>([]);

  const refreshPersistence = () => {
    setInterventions(loadTeacherInterventions());
    setLessonPlans(loadLessonPlans());
    if (onInterventionCreated) {
      onInterventionCreated();
    }
  };

  useEffect(() => {
    setInterventions(loadTeacherInterventions());
    setLessonPlans(loadLessonPlans());
  }, []);

  const showBanner = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 5000);
  };

  const resolveTopicStat = (
    rec: TeacherAiRecommendation
  ): TopicDifficultyStat => {
    const fromProp = difficulties.find(
      (d) =>
        (rec.difficultyStatId && d.id === rec.difficultyStatId) ||
        (rec.disciplineId && d.disciplineId === rec.disciplineId) ||
        (rec.disciplineName &&
          d.disciplineName.toLowerCase() === rec.disciplineName.toLowerCase())
    );
    if (fromProp) return fromProp;

    const fromHelper = findDifficultyForRecommendation(rec, difficulties);
    if (fromHelper) return fromHelper;

    const students = rec.affectedStudents || [];
    return {
      id: rec.difficultyStatId || `diff-${rec.id}`,
      disciplineId: rec.disciplineId || "matematica",
      contentId: rec.contentId,
      disciplineName: rec.disciplineName || "Disciplina",
      topic: rec.topic || rec.title,
      prerequisiteIssue: rec.prerequisiteIssue || rec.description,
      errorRate: rec.errorRate || 45,
      affectedStudentsCount: students.length,
      affectedStudents: students,
      recommendedAction: rec.suggestedAction,
    };
  };

  const safeRecommendations = recommendations || [];
  const filtered = safeRecommendations.filter((r) => {
    const matchesTab =
      activeTab === "todas"
        ? true
        : activeTab === "alta"
        ? r.priority === "alta"
        : r.category === "projeto";
    const matchesDisc =
      selectedDiscipline === "Todas" ||
      r.disciplineName === selectedDiscipline ||
      r.title.toLowerCase().includes(selectedDiscipline.toLowerCase());
    return matchesTab && matchesDisc;
  });

  // Helper to get interventions for a specific recommendation
  const getRecInterventions = (rec: TeacherAiRecommendation) => {
    return interventions.filter(
      (item) =>
        item.recommendationId === rec.id ||
        (rec.disciplineId && item.disciplineId === rec.disciplineId)
    );
  };

  const getSavedPlanForRec = (rec: TeacherAiRecommendation) => {
    return lessonPlans.find(
      (p) =>
        p.recommendationId === rec.id ||
        (rec.disciplineId && p.disciplineId === rec.disciplineId)
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 border border-slate-200 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>
            )}
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Copiloto Pedagógico ProfeIA • 15 Disciplinas
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Sugestão Pedagógica e Intervenções da IA
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Insights analíticos baseados nos dados das 15 disciplinas, atividades respondidas, nivelamentos acionados e cronogramas de TCC.
          </p>
        </div>

        {/* Discipline Filter + Priority Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-2xl border border-slate-200">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={selectedDiscipline}
              onChange={(e) => setSelectedDiscipline(e.target.value)}
              className="bg-transparent border-none text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              {OFFICIAL_15_DISCIPLINES.map((d) => (
                <option key={d} value={d}>
                  {d === "Todas" ? "Todas as 15 Disciplinas" : d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab("todas")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "todas"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Todas ({safeRecommendations.length})
            </button>
            <button
              onClick={() => setActiveTab("alta")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "alta"
                  ? "bg-white text-rose-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Alta Prioridade (
              {safeRecommendations.filter((r) => r.priority === "alta").length})
            </button>
            <button
              onClick={() => setActiveTab("projetos")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "projetos"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              TCC & Projetos (
              {safeRecommendations.filter((r) => r.category === "projeto").length}
              )
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Banner */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-between shadow-lg shadow-emerald-600/20 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-white/80 hover:text-white ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Recommendations Cards List */}
      <div className="space-y-4">
        {filtered.map((rec) => {
          const recInterventions = getRecInterventions(rec);
          const savedPlan = getSavedPlanForRec(rec);
          const topicStat = resolveTopicStat(rec);
          const studentsCount = topicStat.affectedStudents.length;

          return (
            <div
              key={rec.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:border-indigo-300 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      rec.priority === "alta"
                        ? "bg-rose-100 text-rose-800"
                        : rec.priority === "media"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    Prioridade {rec.priority}
                  </span>
                  {rec.disciplineName && (
                    <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                      {rec.disciplineName}
                    </span>
                  )}
                  <span className="text-xs text-slate-500 font-semibold">
                    Alvo: {rec.targetGroup}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {topicStat.errorRate && (
                    <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                      {topicStat.errorRate}% taxa de erro
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setRemediationContext({ rec, topicStat })}
                    className="text-[11px] font-bold text-slate-700 hover:text-indigo-700 bg-slate-100 hover:bg-indigo-50 px-2.5 py-0.5 rounded-full border border-slate-200 transition-colors flex items-center gap-1"
                  >
                    <Users className="w-3 h-3 text-indigo-600" />
                    <span>{studentsCount} alunos diagnosticados</span>
                  </button>
                  <span className="text-xs text-slate-400">
                    Categoria: {rec.category.toUpperCase()}
                  </span>
                </div>
              </div>

              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  {rec.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {rec.description}
                </p>
                {topicStat.prerequisiteIssue && (
                  <div className="mt-3 p-3 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-900">
                      <span className="font-bold">Pré-requisito crítico: </span>
                      <span>{topicStat.prerequisiteIssue}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Badges of Executed Actions (Requisito 5) */}
              {(recInterventions.length > 0 || savedPlan) && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {savedPlan && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        {savedPlan.status === "aplicado"
                          ? `Plano aplicado na turma (${savedPlan.className})`
                          : "Plano criado"}
                      </span>
                      <button
                        type="button"
                        onClick={() => generateLessonPlanPdf(savedPlan)}
                        className="ml-1 underline text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5"
                        title="Baixar PDF do Plano de Aula"
                      >
                        <FileDown className="w-3 h-3" />
                        PDF
                      </button>
                    </span>
                  )}
                  {recInterventions
                    .filter((i) => i.type !== "plano_aula")
                    .map((interv) => (
                      <span
                        key={interv.id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${
                          interv.type === "reforco"
                            ? "bg-purple-50 text-purple-800 border-purple-200"
                            : interv.type === "tutoria"
                            ? "bg-indigo-50 text-indigo-800 border-indigo-200"
                            : "bg-sky-50 text-sky-800 border-sky-200"
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{interv.statusLabel}</span>
                      </span>
                    ))}
                </div>
              )}

              {/* Suggested Action Bar with Explicit Interactive Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-700">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Recomendação: {rec.suggestedAction}</span>
                </div>

                {/* Four Functional Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLessonPlanRec(rec)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-indigo-50 text-slate-800 hover:text-indigo-700 font-bold text-xs rounded-xl border border-slate-200 hover:border-indigo-200 transition-colors flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    <span>
                      {savedPlan ? "Editar Plano de Aula" : "Criar Plano de Aula"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRemediationContext({ rec, topicStat })}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-purple-50 text-slate-800 hover:text-purple-700 font-bold text-xs rounded-xl border border-slate-200 hover:border-purple-200 transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>Enviar Reforço</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setScheduleContext({ rec, topicStat })}
                    className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200/70 transition-colors flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Agendar Tutoria</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNotifyRec(rec)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Notificar Alunos</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Histórico Persistente de Intervenções Realizadas pelo Professor */}
      {interventions.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Histórico de Intervenções Pedagógicas Executadas ({interventions.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Registro persistente de planos de aula, reforços enviados, tutorias agendadas e notificações.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {interventions.slice(0, 12).map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                      {item.disciplineName}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-1">
                      {item.statusLabel}
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {item.summary}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.createdAt || item.timestamp}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                  <span>
                    Alunos alcançados:{" "}
                    <strong>
                      {item.targetStudents?.length ?? item.studentsCount ?? 0}
                    </strong>
                  </span>
                  {item.details?.className && (
                    <span className="font-semibold text-slate-600">
                      {item.details.className}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 1. MODAL DE CRIAR PLANO DE AULA */}
      <LessonPlanModal
        isOpen={!!lessonPlanRec}
        recommendation={lessonPlanRec}
        onClose={() => setLessonPlanRec(null)}
        onSavePlan={(plan) => {
          saveLessonPlan(plan);
          const statusLabel = "Plano criado";
          saveTeacherIntervention({
            id: `int-plan-${plan.id}`,
            recommendationId: plan.recommendationId,
            recommendationTitle: `${plan.disciplineName}: ${plan.topic}`,
            disciplineId: plan.disciplineId,
            disciplineName: plan.disciplineName,
            topic: plan.topic,
            type: "plano_aula",
            statusLabel,
            summary: `${plan.title} (${plan.estimatedTime})`,
            details: {
              lessonPlanId: plan.id,
            },
            targetStudents: plan.affectedStudents,
            createdAt: plan.createdAt,
          });
          refreshPersistence();
          showBanner(
            `${statusLabel}: "${plan.title}" para ${plan.disciplineName}.`
          );
          if (onTriggerAction) {
            onTriggerAction("Criar Plano de Aula", plan.title, {
              ...plan,
              lessonTitle: plan.title,
              className: "INFVES3SB",
            });
          }
        }}
        onApplyPlanToClass={(plan) => {
          const appliedPlan: LessonPlanRecord = {
            ...plan,
            appliedToClass: true,
            status: "aplicado",
            className: "INFVES3SB",
          };
          saveLessonPlan(appliedPlan);
          const statusLabel = "Plano aplicado na turma (INFVES3SB)";
          saveTeacherIntervention({
            id: `int-plan-${plan.id}`,
            recommendationId: plan.recommendationId,
            recommendationTitle: `${plan.disciplineName}: ${plan.topic}`,
            disciplineId: plan.disciplineId,
            disciplineName: plan.disciplineName,
            topic: plan.topic,
            type: "plano_aula",
            statusLabel,
            summary: `${plan.title} aplicado na turma INFVES3SB (${plan.estimatedTime})`,
            details: {
              lessonPlanId: plan.id,
              className: "INFVES3SB",
            },
            targetStudents: plan.affectedStudents,
            createdAt: plan.createdAt,
          });
          refreshPersistence();
          showBanner(
            `${statusLabel}: "${plan.title}" (${plan.disciplineName}).`
          );
          if (onTriggerAction) {
            onTriggerAction("Criar Plano de Aula", plan.title, {
              ...appliedPlan,
              lessonTitle: plan.title,
              className: "INFVES3SB",
            });
          }
        }}
      />

      {/* 2. MODAL DE ENVIAR REFORÇO */}
      <AffectedStudentsModal
        isOpen={!!remediationContext}
        topic={remediationContext?.topicStat || null}
        onClose={() => setRemediationContext(null)}
        onConfirmRemediation={(details) => {
          if (!remediationContext) return;
          const { rec } = remediationContext;
          saveTeacherIntervention({
            id: `int-rem-${Date.now()}`,
            recommendationId: rec.id,
            recommendationTitle: rec.title,
            disciplineId: rec.disciplineId || details.disciplineId || "matematica",
            disciplineName: details.disciplineName,
            topic: details.topicName,
            type: "reforco",
            statusLabel: `Reforço enviado (${details.formatLabel})`,
            summary: `${details.formatLabel} enviado para ${details.selectedStudents.length} aluno(s) de ${details.disciplineName}`,
            details: {
              remediationFormat: details.formatLabel,
              teacherNote: details.teacherNote,
            },
            targetStudents: details.selectedStudents,
            createdAt: new Date().toLocaleString("pt-BR"),
          });
          refreshPersistence();
          showBanner(
            `Reforço (${details.formatLabel}) enviado para ${details.selectedStudents.length} aluno(s) em ${details.disciplineName}!`
          );
          if (onTriggerAction) {
            onTriggerAction("Enviar Atividade de Reforço", rec.title, details);
          }
        }}
      />

      {/* 3. MODAL DE AGENDAR TUTORIA */}
      <ScheduleLevelingModal
        isOpen={!!scheduleContext}
        topic={scheduleContext?.topicStat || null}
        onClose={() => setScheduleContext(null)}
        onConfirmSchedule={(details) => {
          if (!scheduleContext) return;
          const { rec } = scheduleContext;
          const brDate = details.date.split("-").reverse().join("/");
          const statusLabel = `Tutoria agendada para ${brDate} às ${details.time}`;
          saveTeacherIntervention({
            id: `int-tut-${Date.now()}`,
            recommendationId: rec.id,
            recommendationTitle: rec.title,
            disciplineId: rec.disciplineId || details.disciplineId || "matematica",
            disciplineName: details.disciplineName,
            topic: details.topicName,
            type: "tutoria",
            statusLabel,
            summary: `${details.format} agendada para ${brDate} às ${details.time} (${details.affectedStudents.length} alunos)`,
            details: {
              scheduledDate: details.date,
              scheduledTime: details.time,
              sessionFormat: details.format,
              className: details.className,
              teacherNote: details.teacherNote,
            },
            targetStudents: details.affectedStudents,
            createdAt: new Date().toLocaleString("pt-BR"),
          });
          refreshPersistence();
          showBanner(
            `${statusLabel} (${details.disciplineName} — ${details.affectedStudents.length} alunos convocados).`
          );
          if (onTriggerAction) {
            onTriggerAction("Agendar Tutoria", rec.title, details);
          }
        }}
      />

      {/* 4. MODAL DE NOTIFICAR ALUNOS */}
      <NotifyStudentsModal
        isOpen={!!notifyRec}
        recommendation={notifyRec}
        onClose={() => setNotifyRec(null)}
        onConfirmNotify={(payload) => {
          if (!notifyRec) return;
          const statusLabel = `Alunos notificados (${payload.selectedStudents.length})`;
          saveTeacherIntervention({
            id: `int-not-${Date.now()}`,
            recommendationId: notifyRec.id,
            recommendationTitle: notifyRec.title,
            disciplineId: notifyRec.disciplineId || payload.disciplineId || "matematica",
            disciplineName: notifyRec.disciplineName || payload.disciplineName || "Disciplina",
            topic: notifyRec.topic || payload.topic || notifyRec.title,
            type: "notificacao",
            statusLabel,
            summary: `Notificação "${payload.notificationTitle}" enviada para ${payload.selectedStudents.length} aluno(s)`,
            details: {
              notificationTitle: payload.notificationTitle,
              notificationMessage: payload.messageBody,
              recommendedActionType: payload.actionDestination,
            },
            targetStudents: payload.selectedStudents,
            createdAt: new Date().toLocaleString("pt-BR"),
          });
          refreshPersistence();
          showBanner(
            `Notificação enviada para ${payload.selectedStudents.length} aluno(s) com sucesso!`
          );
          if (onTriggerAction) {
            onTriggerAction("Notificar Alunos", notifyRec.title, {
              title: payload.notificationTitle,
              message: payload.messageBody,
              recommendedAction: payload.actionDestination,
              recipients: payload.selectedStudents,
            });
          }
        }}
      />
    </div>
  );
};
