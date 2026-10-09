import React, { useState } from "react";
import {
  Users,
  GraduationCap,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
  Scale,
  Cpu,
  BookOpen,
  FileDown,
  CheckCircle2,
  CalendarCheck
} from "lucide-react";
import {
  TeacherOverviewMetrics,
  TopicDifficultyStat,
  TeacherAiRecommendation,
  ClassGroup
} from "../../types";
import {
  OFFICIAL_STUDENTS_LIST,
  CLASS_CODE,
  CLASS_NAME,
  OfficialStudent,
  calculateStudentAttendance,
  getClassAttendanceSummary
} from "../../data/studentsData";
import { GenericSilhouetteAvatar } from "../common/GenericSilhouetteAvatar";
import { AffectedStudentsModal } from "./AffectedStudentsModal";
import { generateClassProficiencyPdf } from "../../services/pdfReportGenerator";
import { TeacherClassesManager } from "./TeacherClassesManager";
import {
  loadTeacherInterventions,
  saveTeacherIntervention,
} from "../../data/teacherData";

interface TeacherDashboardProps {
  metrics: TeacherOverviewMetrics;
  students?: any[];
  difficulties: TopicDifficultyStat[];
  recommendations: TeacherAiRecommendation[];
  classes: ClassGroup[];
  onNavigateTab: (tab: string) => void;
  onSelectStudent: (student: any) => void;
  teacherName?: string;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  metrics,
  difficulties,
  recommendations,
  onNavigateTab,
  onSelectStudent,
  teacherName,
}) => {
  const [affectedModalTopic, setAffectedModalTopic] = useState<any | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [pdfFeedback, setPdfFeedback] = useState<string | null>(null);
  const [targetAttendanceHours, setTargetAttendanceHours] = useState<number>(40);
  const [attendanceFilter, setAttendanceFilter] = useState<"all" | "excelente" | "regular" | "alerta">("all");
  const [showAll26Students, setShowAll26Students] = useState<boolean>(true);
  const [savedInterventions, setSavedInterventions] = useState(() =>
    loadTeacherInterventions()
  );

  const bdDifficulty =
    difficulties.find((d) => d.disciplineId === "banco-de-dados") ||
    difficulties[0];
  const matDifficulty =
    difficulties.find((d) => d.disciplineId === "matematica") ||
    difficulties[0];

  const attendanceSummary = getClassAttendanceSummary(
    OFFICIAL_STUDENTS_LIST,
    targetAttendanceHours
  );

  const filteredAttendanceRecords = attendanceSummary.records.filter((rec) => {
    if (attendanceFilter === "excelente")
      return rec.attendance.attendancePercent >= 90;
    if (attendanceFilter === "regular")
      return (
        rec.attendance.attendancePercent >= 75 &&
        rec.attendance.attendancePercent < 90
      );
    if (attendanceFilter === "alerta")
      return rec.attendance.attendancePercent < 75;
    return true;
  });

  const displayedStudents = showAll26Students
    ? filteredAttendanceRecords
    : filteredAttendanceRecords.slice(0, 8);

  const handleExportPdf = () => {
    setIsExportingPdf(true);
    try {
      const fileName = generateClassProficiencyPdf({
        teacherName: teacherName || "Adnaldo Alves",
        difficulties,
        recommendations,
        students: OFFICIAL_STUDENTS_LIST,
      });
      setPdfFeedback(
        `Relatório PDF "${fileName}" gerado com sucesso (${OFFICIAL_STUDENTS_LIST.length} alunos da turma ${CLASS_CODE}, 15 disciplinas e 50 tópicos/matéria)!`
      );
      setTimeout(() => setPdfFeedback(null), 5000);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {pdfFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-between gap-3 shadow-xl animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{pdfFeedback}</span>
          </div>
          <button
            type="button"
            onClick={() => setPdfFeedback(null)}
            className="px-2.5 py-1 rounded-lg bg-slate-950/20 hover:bg-slate-950/30 text-slate-950 text-xs font-bold"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl border border-indigo-900/50">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 rounded-full backdrop-blur-md">
                Portal de Gestão Pedagógica Docente
              </span>
              <span className="text-xs text-indigo-200">
                Turma {CLASS_CODE} • 2026.1
              </span>
            </div>
            <div className="flex items-center gap-4 mt-3">
              <GenericSilhouetteAvatar
                size="lg"
                role="PROFESSOR"
                editable={true}
                showChangeButton={true}
              />
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Painel Docente de Métricas e Aprendizado
                </h1>
                <p className="text-xs font-semibold text-indigo-300">
                  Professor Responsável: <span className="text-white font-bold">{teacherName || "Adnaldo Alves"}</span> • Turma {CLASS_CODE}
                </p>
              </div>
            </div>
            <p className="text-sm text-indigo-200 mt-2 max-w-2xl leading-relaxed">
              Acompanhamento sincronizado das 15 disciplinas curriculares (50 tópicos cada), evolução dos 26 alunos e mapeamento dinâmico de dificuldades conceituais.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-row gap-2 shrink-0">
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-2xl shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
              title="Compilar e baixar PDF com os 26 alunos da turma INFVES3SB e tópicos das 15 disciplinas"
            >
              <FileDown className="w-4 h-4 text-slate-950" />
              <span>
                {isExportingPdf ? "Gerando PDF..." : "Exportar Relatório PDF"}
              </span>
            </button>
            <button
              onClick={() => onNavigateTab("disciplinas")}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-2xl border border-slate-700 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-indigo-400" />
              Disciplinas (Currículo)
            </button>
            <button
              onClick={() => onNavigateTab("prof-ia")}
              className="px-4 py-3 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-xs rounded-2xl shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Lightbulb className="w-4 h-4 text-slate-950" />
              {recommendations.length} Recomendações da IA
            </button>
          </div>
        </div>

        {/* REQUISITO 6: ALERTAS AUTOMATIZADOS PARA O PROFESSOR */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Alertas Automatizados da Turma INFVES3SB (Ação Imediata):</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div
              onClick={() => onNavigateTab("prof-dificuldades")}
              className="p-3.5 bg-rose-950/40 hover:bg-rose-900/40 border border-rose-800/50 rounded-2xl transition-all cursor-pointer flex items-start gap-3"
            >
              <span className="text-rose-400 text-base font-black shrink-0">⚠️</span>
              <div>
                <p className="text-xs font-black text-white">
                  {bdDifficulty ? bdDifficulty.affectedStudents.length : 7} alunos precisam de atenção
                </p>
                <p className="text-[11px] text-rose-200 mt-0.5 leading-relaxed">
                  Defasagem coletiva detectada em Banco de Dados (Modelagem Relacional e Chaves Estrangeiras).
                </p>
                <span className="text-[10px] text-rose-300 font-bold mt-1.5 inline-block underline">
                  Abrir alunos afetados no mapa →
                </span>
              </div>
            </div>

            <div
              onClick={() => onNavigateTab("prof-dificuldades")}
              className="p-3.5 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-800/50 rounded-2xl transition-all cursor-pointer flex items-start gap-3"
            >
              <span className="text-amber-400 text-base font-black shrink-0">⚠️</span>
              <div>
                <p className="text-xs font-black text-white">
                  {matDifficulty ? matDifficulty.affectedStudents.length : 7} alunos com dúvidas em Bhaskara
                </p>
                <p className="text-[11px] text-amber-200 mt-0.5 leading-relaxed">
                  Dificuldade crítica na interpretação do discriminante Delta (Δ &lt; 0) em Matemática.
                </p>
                <span className="text-[10px] text-amber-300 font-bold mt-1.5 inline-block underline">
                  Agendar nivelamento socrático →
                </span>
              </div>
            </div>

            <div
              onClick={() => onNavigateTab("prof-alunos")}
              className="p-3.5 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-800/50 rounded-2xl transition-all cursor-pointer flex items-start gap-3"
            >
              <span className="text-emerald-400 text-base font-black shrink-0">💡</span>
              <div>
                <p className="text-xs font-black text-white">
                  Ganho acelerado de +72%
                </p>
                <p className="text-[11px] text-emerald-200 mt-0.5 leading-relaxed">
                  Desempenho exemplar da turma nos debates dialéticos de História (Constituição de 1934).
                </p>
                <span className="text-[10px] text-emerald-300 font-bold mt-1.5 inline-block underline">
                  Ver relatórios dos alunos →
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick KPI Strip */}
        <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-slate-800">
            <span className="text-xs text-indigo-300 font-semibold block">
              Turma {CLASS_CODE}
            </span>
            <p className="text-2xl sm:text-3xl font-black text-white mt-1">
              {OFFICIAL_STUDENTS_LIST.length}
            </p>
            <span className="text-[10px] text-emerald-400 font-bold mt-0.5 block">
              Alunos Cadastrados
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-emerald-500/40">
            <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1">
              <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" />
              Frequência Escolar
            </span>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
              {attendanceSummary.averageAttendancePercent}%
            </p>
            <span className="text-[10px] text-emerald-300 font-bold mt-0.5 block">
              {attendanceSummary.totalLoggedHours}h logadas ({attendanceSummary.averageLoggedHours}h/aluno)
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-slate-800">
            <span className="text-xs text-indigo-300 font-semibold block">
              Ganho Médio em Debates
            </span>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
              +70%
            </p>
            <span className="text-[10px] text-emerald-300 font-bold mt-0.5 block">
              Sessões socráticas ativas
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-slate-800">
            <span className="text-xs text-indigo-300 font-semibold block">
              Ganho em Simulação
            </span>
            <p className="text-2xl sm:text-3xl font-black text-indigo-400 mt-1">
              +65%
            </p>
            <span className="text-[10px] text-indigo-300 font-bold mt-0.5 block">
              Laboratório de tomada de decisão
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-slate-800">
            <span className="text-xs text-indigo-300 font-semibold block">
              Dificuldades Mapeadas
            </span>
            <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">
              {difficulties.length}
            </p>
            <span className="text-[10px] text-amber-200 font-bold mt-0.5 block">
              Intervenções ativas
            </span>
          </div>
        </div>
      </div>

      {/* SEÇÃO COMPLETA: GESTÃO E CADASTRO DE TURMAS DO PROFESSOR */}
      <TeacherClassesManager
        teacherName={teacherName || "Prof. Adnaldo Alves"}
        onAccessClass={() => onNavigateTab("prof-turmas")}
      />

      {/* Main Grid: AI Recommendations & Critical Difficulties */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* IA Suggestions */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400 font-black text-base">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Sugestões Pedagógicas da IA
            </div>
            <button
              onClick={() => onNavigateTab("prof-ia")}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Ver todas
            </button>
          </div>

          <div className="space-y-3">
            {recommendations.slice(0, 3).map((rec) => {
              const recInterventions = savedInterventions.filter(
                (i) =>
                  i.recommendationId === rec.id ||
                  (rec.disciplineId && i.disciplineId === rec.disciplineId)
              );
              return (
                <div
                  key={rec.id}
                  onClick={() => onNavigateTab("prof-ia")}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-2 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        rec.priority === "alta"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : rec.priority === "media"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      }`}
                    >
                      Prioridade {rec.priority}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {rec.targetGroup}
                    </span>
                  </div>
                  <h4 className="text-xs font-extrabold text-white">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {rec.description}
                  </p>
                  {recInterventions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {recInterventions.slice(0, 2).map((interv) => (
                        <span
                          key={interv.id}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                        >
                          ✓ {interv.statusLabel}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-indigo-400 font-bold">
                      Ação: {rec.suggestedAction}
                    </span>
                    <span className="text-indigo-300 font-semibold underline">
                      Executar ação →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Conteúdos com Maior Índice de Erro */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-400 font-black text-base">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              Mapeamento de Lacunas e Dificuldades
            </div>
            <button
              onClick={() => onNavigateTab("prof-dificuldades")}
              className="text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors"
            >
              Mapa Completo
            </button>
          </div>

          <div className="space-y-3">
            {difficulties.slice(0, 3).map((diff) => (
              <div
                key={diff.id}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-rose-500/40 transition-all"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-extrabold text-white">
                    {diff.topic} ({diff.disciplineName})
                  </span>
                  <span className="font-black text-rose-300 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                    {diff.errorRate}% de Erro
                  </span>
                </div>
                <p className="text-[11px] text-amber-300 font-semibold mt-1">
                  Pré-requisito crítico: {diff.prerequisiteIssue}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {diff.affectedStudentsCount} alunos com dificuldade mapeada.
                </p>
                <p className="text-[11px] text-indigo-400 font-bold mt-2">
                  Sugestão: {diff.recommendedAction}
                </p>

                {/* Botão Ver Alunos Afetados no Mapa de Dificuldades */}
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => setAffectedModalTopic(diff)}
                    className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors group"
                    title={`Ver lista de alunos com dificuldade em ${diff.topic}`}
                  >
                    <Users className="w-3.5 h-3.5 text-rose-400" />
                    <span>Ver alunos afetados ({diff.affectedStudentsCount})</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </button>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Flashcards & Mapas
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Official Students Spotlight & Frequência Escolar (Assiduidade dos 26 Alunos) */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CalendarCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-black text-white">
                Frequência Escolar & Assiduidade • Turma {CLASS_CODE} (26 Alunos)
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Cálculo automático de assiduidade dos 26 estudantes da turma {CLASS_CODE} com base nas horas logadas na plataforma (Referência: {targetAttendanceHours}h letivas digitais).
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Controle de Carga Horária Base para Cálculo de Assiduidade */}
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <label
                htmlFor="target-hours-select"
                className="text-[11px] font-bold text-slate-300"
              >
                Carga Horária Base:
              </label>
              <select
                id="target-hours-select"
                value={targetAttendanceHours}
                onChange={(e) => setTargetAttendanceHours(Number(e.target.value))}
                className="bg-slate-900 text-emerald-300 font-black text-xs px-2 py-0.5 rounded-lg border border-slate-700 focus:outline-none"
              >
                <option value={35}>35h</option>
                <option value={40}>40h (Padrão)</option>
                <option value={45}>45h</option>
                <option value={50}>50h</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleExportPdf}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Exportar Relatório PDF (26 Alunos)</span>
            </button>
            <button
              onClick={() => onNavigateTab("prof-alunos")}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              Gestão Completa <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Resumo Rápido de Assiduidade da Turma INFVES3SB */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => setAttendanceFilter("all")}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              attendanceFilter === "all"
                ? "bg-indigo-950/50 border-indigo-500/60"
                : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block">
              Assiduidade Média ({CLASS_CODE})
            </span>
            <p className="text-xl font-black text-white mt-0.5">
              {attendanceSummary.averageAttendancePercent}% • {attendanceSummary.totalStudents} Alunos
            </p>
            <span className="text-[10px] text-slate-400">
              Total acumulado: {attendanceSummary.totalLoggedHours}h logadas
            </span>
          </button>

          <button
            type="button"
            onClick={() => setAttendanceFilter("excelente")}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              attendanceFilter === "excelente"
                ? "bg-emerald-950/50 border-emerald-500/60"
                : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
              Assiduidade Excelente (≥ 90%)
            </span>
            <p className="text-xl font-black text-emerald-300 mt-0.5">
              {attendanceSummary.excellentCount} alunos
            </p>
            <span className="text-[10px] text-slate-400">
              Engajamento contínuo na plataforma
            </span>
          </button>

          <button
            type="button"
            onClick={() => setAttendanceFilter("regular")}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              attendanceFilter === "regular"
                ? "bg-blue-950/50 border-blue-500/60"
                : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">
              Frequência Regular (75% a 89%)
            </span>
            <p className="text-xl font-black text-blue-300 mt-0.5">
              {attendanceSummary.regularCount} alunos
            </p>
            <span className="text-[10px] text-slate-400">
              Acima do mínimo legal de 75%
            </span>
          </button>

          <button
            type="button"
            onClick={() => setAttendanceFilter("alerta")}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              attendanceFilter === "alerta"
                ? "bg-amber-950/50 border-amber-500/60"
                : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
              Atenção (&lt; 75% das Horas)
            </span>
            <p className="text-xl font-black text-amber-300 mt-0.5">
              {attendanceSummary.alertCount} alunos
            </p>
            <span className="text-[10px] text-slate-400">
              Monitoramento preventivo de faltas
            </span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-3">Aluno ({CLASS_CODE})</th>
                <th className="py-3 px-3">Horas Logadas</th>
                <th className="py-3 px-3">Frequência Escolar (Assiduidade)</th>
                <th className="py-3 px-3">Sessão de Debates</th>
                <th className="py-3 px-3">Laboratório de Simulação</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Relatório Pós-Estudo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {displayedStudents.map(({ student: st, attendance }, index) => (
                <tr key={st.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-400">
                    {String(index + 1).padStart(2, "0")}
                  </td>
                  <td className="py-3 px-3 font-bold text-white">
                    <div className="flex items-center gap-2.5">
                      <GenericSilhouetteAvatar
                        size="xs"
                        role="ALUNO"
                        disableSessionAvatar={!st.isActiveProfile}
                      />
                      <div>
                        <span>{st.name}</span>
                        {st.isActiveProfile && (
                          <span className="ml-2 text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Ativo
                          </span>
                        )}
                        <span className="block text-[10px] text-slate-400 font-mono">
                          {st.enrollmentId}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-200">
                    {attendance.loggedHours}h{" "}
                    <span className="text-slate-500 font-normal">
                      / {attendance.targetHours}h
                    </span>
                  </td>
                  <td className="py-3 px-3 min-w-[180px]">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span
                        className={`font-black text-xs ${
                          attendance.badgeColor === "emerald"
                            ? "text-emerald-400"
                            : attendance.badgeColor === "indigo"
                            ? "text-indigo-300"
                            : "text-amber-400"
                        }`}
                      >
                        {attendance.attendancePercent}%
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                          attendance.badgeColor === "emerald"
                            ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                            : attendance.badgeColor === "indigo"
                            ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
                            : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                        }`}
                      >
                        {attendance.statusLabel}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          attendance.badgeColor === "emerald"
                            ? "bg-emerald-500"
                            : attendance.badgeColor === "indigo"
                            ? "bg-indigo-500"
                            : "bg-amber-500"
                        }`}
                        style={{ width: `${attendance.attendancePercent}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold text-[11px]">
                      {st.metrics.debatesLearningGain}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold text-[11px]">
                      {st.metrics.simulationLearningGain}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        st.status === "Avançado"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : st.status === "Ativo"
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {st.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        onSelectStudent(st);
                        onNavigateTab("prof-alunos");
                      }}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Abrir Relatório
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
          <span className="text-[11px] text-slate-400">
            Exibindo <strong>{displayedStudents.length}</strong> de{" "}
            <strong>{filteredAttendanceRecords.length}</strong> alunos da turma{" "}
            {CLASS_CODE}
          </span>
          <button
            type="button"
            onClick={() => setShowAll26Students((prev) => !prev)}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            {showAll26Students
              ? "Recolher visualização compacta (8 alunos)"
              : `Expandir todos os ${filteredAttendanceRecords.length} alunos da turma`}
          </button>
        </div>
      </div>

      {/* Modal de Alunos Afetados no Mapa de Dificuldades */}
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
            statusLabel: `Reforço enviado (${details.formatLabel})`,
            summary: `Reforço (${details.formatLabel}) enviado para ${details.selectedStudents.length} aluno(s)`,
            details: {
              remediationFormat: details.formatLabel,
              teacherNote: details.teacherNote,
            },
            targetStudents: details.selectedStudents,
            createdAt: new Date().toLocaleString("pt-BR"),
          });
          setSavedInterventions(loadTeacherInterventions());
        }}
      />
    </div>
  );
};
