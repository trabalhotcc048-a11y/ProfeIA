import React, { useState } from "react";
import {
  AlertTriangle,
  Lightbulb,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Filter,
  BarChart2,
  X,
  Send,
  HelpCircle,
  GraduationCap,
  ArrowLeft
} from "lucide-react";
import { TopicDifficultyStat } from "../../types";
import { GenericSilhouetteAvatar } from "../common/GenericSilhouetteAvatar";
import { OFFICIAL_STUDENTS_LIST, CLASS_CODE } from "../../data/studentsData";
import { saveTeacherIntervention } from "../../data/teacherData";
import { AffectedStudentsModal } from "./AffectedStudentsModal";
import { ScheduleLevelingModal } from "./ScheduleLevelingModal";

interface DifficultyMapViewProps {
  difficulties: TopicDifficultyStat[];
  onOpenRecommendationModal?: (topic: string) => void;
  onScheduleLeveling?: (details: any) => void;
  onInterventionCreated?: () => void;
  onBack?: () => void;
}

export const DifficultyMapView: React.FC<DifficultyMapViewProps> = ({
  difficulties = [],
  onOpenRecommendationModal,
  onScheduleLeveling,
  onInterventionCreated,
  onBack,
}) => {
  const safeDifficulties = difficulties || [];
  const [selectedTopicId, setSelectedTopicId] = useState<string | undefined>(
    safeDifficulties[0]?.id
  );
  const selectedTopic =
    safeDifficulties.find((d) => d.id === selectedTopicId) || safeDifficulties[0];
  const [filterDiscipline, setFilterDiscipline] = useState<string>("Todas");
  const [affectedModalTopic, setAffectedModalTopic] = useState<TopicDifficultyStat | null>(null);
  const [scheduleModalTopic, setScheduleModalTopic] = useState<TopicDifficultyStat | null>(null);

  // Lista oficial das 15 disciplinas cadastradas na plataforma
  const disciplines = [
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
    "Língua Inglesa"
  ];

  const filtered = safeDifficulties.filter(
    (d) => filterDiscipline === "Todas" || d.disciplineName === filterDiscipline
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>
            )}
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-950/80 px-3 py-1 rounded-full border border-rose-800/50">
              Diagnóstico de Pré-Requisitos • 15 Disciplinas
            </span>
            <span className="text-xs text-slate-400">
              Turma {CLASS_CODE} • Análise Preditiva de Erros
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Mapa de Dificuldades da Turma (15 Disciplinas)
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Identifique tópicos críticos onde a taxa de erro decorre de déficits em pré-requisitos fundamentais e aplique intervenções coletivas recomendadas.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-2xl border border-slate-800 shrink-0">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterDiscipline}
            onChange={(e) => setFilterDiscipline(e.target.value)}
            className="bg-transparent border-none text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
          >
            {disciplines.map((d) => (
              <option key={d} value={d} className="bg-slate-900 text-slate-200">
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main split view: Grid of cards + Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List of Difficulty Topics */}
        <div className="lg:col-span-2 space-y-4">
          {filtered.map((diff) => {
            const isSelected = selectedTopic?.id === diff.id;
            return (
              <div
                key={diff.id}
                onClick={() => setSelectedTopicId(diff.id)}
                className={`p-6 rounded-3xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? "border-rose-500 bg-slate-900 shadow-xl shadow-rose-950/20"
                    : "border-slate-800 bg-slate-900/70 hover:border-slate-700"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                        {diff.disciplineName}
                      </span>
                      <span className="text-xs font-black text-rose-300 bg-rose-950 px-2.5 py-0.5 rounded-full border border-rose-800/60">
                        {diff.errorRate}% Taxa de Erro
                      </span>
                    </div>
                    <h3 className="text-base font-black text-white mt-1">
                      {diff.topic}
                    </h3>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setAffectedModalTopic(diff);
                    }}
                    className="text-xs text-rose-400 hover:text-rose-300 font-bold self-start sm:self-auto bg-rose-950/50 hover:bg-rose-900/50 px-3 py-1.5 rounded-xl border border-rose-800/40 transition-colors flex items-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>{diff.affectedStudentsCount} alunos afetados</span>
                  </button>
                </div>

                {/* Root cause indicator */}
                <div className="mt-4 p-3.5 bg-slate-950/90 rounded-2xl border border-amber-500/30">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block mb-0.5">
                    Pré-requisito Crítico Identificado:
                  </span>
                  <p className="text-xs font-bold text-amber-200">
                    {diff.prerequisiteIssue}
                  </p>
                </div>

                {/* Recommended Action & Trigger Modal */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-indigo-300 font-bold flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    {diff.recommendedAction}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setAffectedModalTopic(diff);
                    }}
                    className="text-rose-400 hover:text-rose-300 font-bold text-xs flex items-center gap-1 group"
                  >
                    <span>Ver Alunos Afetados</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Topic Breakdown */}
        {selectedTopic && (
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-6 self-start">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                Detalhamento Pedagógico
              </span>
              <h3 className="text-lg font-black text-white mt-0.5">
                {selectedTopic.topic}
              </h3>
              <p className="text-xs text-slate-400">
                {selectedTopic.disciplineName}
              </p>
            </div>

            {/* Error Gauge */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center text-xs font-bold mb-1.5 text-slate-300">
                <span>Índice Geral de Falha na Turma</span>
                <span className="text-rose-400 font-black">
                  {selectedTopic.errorRate}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${selectedTopic.errorRate}%` }}
                />
              </div>
            </div>

            {/* List of Affected Students */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-400" />
                  Alunos Diagnosticados ({selectedTopic.affectedStudents.length}):
                </h4>
                <button
                  onClick={() => setAffectedModalTopic(selectedTopic)}
                  className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 underline"
                >
                  Ver Lista Completa
                </button>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-none">
                {selectedTopic.affectedStudents.map((st, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 text-xs font-bold text-slate-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <GenericSilhouetteAvatar size="xs" />
                      <span>{st}</span>
                    </div>
                    <span className="text-[10px] text-amber-300 bg-amber-950/70 border border-amber-800/50 px-2 py-0.5 rounded-md font-semibold">
                      Intervenção
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons for Teacher */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setAffectedModalTopic(selectedTopic)}
                className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4 text-rose-200" />
                Abrir Painel dos {selectedTopic.affectedStudents.length} Alunos Afetados
              </button>

              <button
                onClick={() => setScheduleModalTopic(selectedTopic)}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-indigo-200" />
                Agendar Nivelamento Coletivo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL COMPLETO "VER ALUNOS AFETADOS" COM SUPORTE A FLASHCARDS E MAPAS MENTAIS */}
      <AffectedStudentsModal
        isOpen={!!affectedModalTopic}
        topic={affectedModalTopic}
        onClose={() => setAffectedModalTopic(null)}
        onConfirmRemediation={(details) => {
          saveTeacherIntervention({
            id: `int-rem-${Date.now()}`,
            recommendationId: `rec-${details.disciplineId || details.topicId}`,
            recommendationTitle: `${details.disciplineName}: ${details.topicName}`,
            disciplineId: details.disciplineId || "matematica",
            disciplineName: details.disciplineName,
            topic: details.topicName,
            type: "reforco",
            statusLabel: "Reforço enviado",
            summary: `Reforço enviado (${details.formatLabel}) para ${details.selectedStudents.length} aluno(s)`,
            details: {
              remediationFormat: details.formatLabel,
              teacherNote: details.teacherNote,
            },
            targetStudents: details.selectedStudents,
            createdAt: new Date().toLocaleString("pt-BR"),
          });
          if (onInterventionCreated) onInterventionCreated();
        }}
      />

      {/* MODAL DE CONFIRMAÇÃO DO AGENDAMENTO DE NIVELAMENTO COLETIVO */}
      <ScheduleLevelingModal
        isOpen={!!scheduleModalTopic}
        topic={scheduleModalTopic}
        onClose={() => setScheduleModalTopic(null)}
        onConfirmSchedule={(details) => {
          const brDate = details.date.split("-").reverse().join("/");
          saveTeacherIntervention({
            id: `int-tut-${Date.now()}`,
            recommendationId: `rec-${details.disciplineId || details.topicId}`,
            recommendationTitle: `${details.disciplineName}: ${details.topicName}`,
            disciplineId: details.disciplineId || "matematica",
            disciplineName: details.disciplineName,
            topic: details.topicName,
            type: "tutoria",
            statusLabel: `Tutoria agendada para ${brDate} às ${details.time}`,
            summary: `Tutoria (${details.format}) agendada para ${brDate} às ${details.time}`,
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
          if (onScheduleLeveling) {
            onScheduleLeveling(details);
          }
          if (onInterventionCreated) onInterventionCreated();
        }}
      />
    </div>
  );
};
