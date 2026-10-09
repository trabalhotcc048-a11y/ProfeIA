import React, { useState } from "react";
import {
  Users,
  Search,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  X,
  BookOpen,
  Scale,
  Cpu,
  TrendingUp,
  Award,
  Clock,
  Send,
  GraduationCap,
  CalendarCheck
} from "lucide-react";
import {
  OFFICIAL_STUDENTS_LIST,
  CLASS_CODE,
  CLASS_NAME,
  CLASS_COURSE,
  OfficialStudent,
  getStudentBestLearningStyle,
  calculateStudentAttendance,
  getClassAttendanceSummary
} from "../../data/studentsData";
import { GenericSilhouetteAvatar } from "../common/GenericSilhouetteAvatar";
import { TeacherClassesManager } from "./TeacherClassesManager";

interface ClassStudentsViewProps {
  selectedStudentId?: string | null;
  onSelectStudentId?: (studentId: string | null) => void;
}

export const ClassStudentsView: React.FC<ClassStudentsViewProps> = ({
  selectedStudentId: externalSelectedId,
  onSelectStudentId,
}) => {
  const [internalSelectedStudent, setInternalSelectedStudent] = useState<OfficialStudent | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const classAttendance = getClassAttendanceSummary(OFFICIAL_STUDENTS_LIST, 40);

  const activeSelectedStudent =
    externalSelectedId
      ? OFFICIAL_STUDENTS_LIST.find((s) => s.id === externalSelectedId) || internalSelectedStudent
      : internalSelectedStudent;

  const handleSelect = (st: OfficialStudent | null) => {
    setInternalSelectedStudent(st);
    if (onSelectStudentId) {
      onSelectStudentId(st ? st.id : null);
    }
  };

  const filteredStudents = OFFICIAL_STUDENTS_LIST.filter((st) => {
    const matchesStatus = statusFilter === "all" || st.status === statusFilter;
    const matchesSearch =
      st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.enrollmentId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {feedbackToast && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-between gap-3 shadow-xl animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{feedbackToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackToast(null)}
            className="px-2.5 py-1 rounded-lg bg-slate-950/20 hover:bg-slate-950/30 text-slate-950 text-xs font-bold"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              Turma Oficial {CLASS_CODE}
            </span>
            <span className="text-xs text-slate-400">
              {OFFICIAL_STUDENTS_LIST.length} Estudantes Cadastrados
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Gestão Discente & Relatórios Pós-Estudo
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            {CLASS_NAME}. Acompanhamento de ganho de aprendizado (%), raciocínio socrático e mapeamento dinâmico de dificuldades em tempo real.
          </p>
        </div>

        {/* Quick Class Pill */}
        <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 shrink-0 space-y-1">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
            <GraduationCap className="w-4 h-4" />
            {CLASS_COURSE}
          </div>
          <p className="text-xs text-slate-300">
            {OFFICIAL_STUDENTS_LIST.length} alunos • Turno Vespertino
          </p>
          <p className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
            <CalendarCheck className="w-3.5 h-3.5" />
            Assiduidade Média: {classAttendance.averageAttendancePercent}% ({classAttendance.totalLoggedHours}h logadas)
          </p>
        </div>
      </div>

      {/* Gestão e Cadastro de Turmas (Persistido no localStorage) */}
      <TeacherClassesManager teacherName="Prof. Adnaldo Alves" />

      {/* Filters Bar */}
      <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar estudante por nome ou matrícula..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-200 placeholder-slate-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 shrink-0 font-medium">Filtrar:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">Todos os Status ({OFFICIAL_STUDENTS_LIST.length})</option>
            <option value="Avançado">Avançado</option>
            <option value="Ativo">Ativo</option>
            <option value="Em Estudo">Em Estudo</option>
            <option value="Nivelamento Concluído">Nivelamento Concluído</option>
          </select>
        </div>
      </div>

      {/* Students Table (Utilizando apenas nomes sem notas) */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase font-black text-[10px] tracking-wider">
              <tr>
                <th className="py-4 px-4 sm:px-6">Estudante (Sem Notas)</th>
                <th className="py-4 px-4">Turma</th>
                <th className="py-4 px-4">Frequência Escolar</th>
                <th className="py-4 px-4">Ganho em Debates</th>
                <th className="py-4 px-4">Ganho em Simulação</th>
                <th className="py-4 px-4">Proficiência Atividades</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Relatório</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStudents.map((st) => {
                const isCurrentActive = st.isActiveProfile;
                const att = calculateStudentAttendance(st, 40);
                return (
                  <tr
                    key={st.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isCurrentActive ? "bg-indigo-950/20" : ""
                    }`}
                  >
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <GenericSilhouetteAvatar size="sm" />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-extrabold text-white text-sm">
                              {st.name}
                            </p>
                            {isCurrentActive && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                Perfil Ativo
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {st.enrollmentId} • {st.metrics.activeStudyHours}h de estudo
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-300">
                      {st.turma}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1 min-w-[130px]">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-black text-emerald-400">
                            {att.attendancePercent}%
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {att.loggedHours}h/{att.targetHours}h
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              att.badgeColor === "emerald"
                                ? "bg-emerald-500"
                                : att.badgeColor === "indigo"
                                ? "bg-indigo-500"
                                : "bg-amber-500"
                            }`}
                            style={{ width: `${att.attendancePercent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold text-[11px]">
                        {st.metrics.debatesLearningGain}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold text-[11px]">
                        {st.metrics.simulationLearningGain}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold text-[11px]">
                        {st.metrics.activitiesProficiency}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] tracking-tight ${
                          st.status === "Avançado"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : st.status === "Ativo"
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            : st.status === "Nivelamento Concluído"
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {st.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleSelect(st)}
                        className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 font-bold text-xs rounded-xl transition-all inline-flex items-center gap-1 shadow-sm"
                      >
                        Relatório Pós-Estudo
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILED POST-STUDY REPORT MODAL (REQUISITO 5) */}
      {activeSelectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto my-auto">
            {/* Header with Student Identity */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <GenericSilhouetteAvatar size="lg" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-white">
                      {activeSelectedStudent.name}
                    </h3>
                    {activeSelectedStudent.isActiveProfile && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Perfil Ativo
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Turma {activeSelectedStudent.turma} • Matrícula: {activeSelectedStudent.enrollmentId}
                  </p>
                  <span className="inline-block mt-1 text-[11px] text-indigo-400 font-semibold">
                    {activeSelectedStudent.course}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleSelect(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* REQUISITO 6: ESTILO ONDE ELE APRENDE MELHOR (DIAGNÓSTICO DIVERSIFICADO) */}
            {(() => {
              const bestStyle = getStudentBestLearningStyle(activeSelectedStudent);
              return (
                <div className="p-4 bg-gradient-to-r from-indigo-950/80 via-slate-950 to-purple-950/60 rounded-2xl border border-indigo-500/30 space-y-1.5 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      Estilo Onde Ele Aprende Melhor
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                      {bestStyle.badge}
                    </span>
                  </div>
                  <p className="text-sm font-black text-white">
                    {bestStyle.style}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {bestStyle.description}
                  </p>
                </div>
              );
            })()}

            {/* REQUISITO 5.A: Ganho de Aprendizado em Porcentagem (%) por Módulo Interativo */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Ganho de Aprendizado em Porcentagem (%) por Módulo
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-slate-950 rounded-2xl border border-emerald-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-emerald-400" />
                      Sessão de Debates
                    </span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      Dialética
                    </span>
                  </div>
                  <p className="text-xl font-black text-emerald-300 mt-2">
                    {activeSelectedStudent.metrics.debatesLearningGain}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {activeSelectedStudent.metrics.socraticReasoningScore}
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-indigo-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-indigo-400" />
                      Laboratório de Simulação
                    </span>
                    <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                      Cenários
                    </span>
                  </div>
                  <p className="text-xl font-black text-indigo-300 mt-2">
                    {activeSelectedStudent.metrics.simulationLearningGain}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Decisões práticas e impacto em tempo real
                  </p>
                </div>
              </div>
            </div>

            {/* REQUISITO 5.B: Mapeamento de Dificuldades da Sessão */}
            <div className="p-5 bg-slate-950 rounded-2xl border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Mapeamento de Dificuldades (Última Sessão)
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {activeSelectedStudent.postStudyReport.lastSessionDate}
                </span>
              </div>

              {/* Identified Primary Difficulty */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                <p className="text-xs font-bold text-amber-200">
                  {activeSelectedStudent.postStudyReport.mainDifficulty}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Tópico avaliado: {activeSelectedStudent.postStudyReport.sessionTopic}
                </p>
              </div>

              {/* Identified Conceptual Gaps */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-400 font-semibold block">
                  Lacunas Conceituais Identificadas pelo TutorIA:
                </span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {activeSelectedStudent.postStudyReport.identifiedGaps.map((gap, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 mt-0.5">•</span>
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action for Teacher */}
              <div className="p-3 bg-indigo-950/40 border border-indigo-800/40 rounded-xl text-xs text-indigo-300">
                <strong className="text-indigo-200 block mb-0.5">
                  Recomendação de Ação Pedagógica Docente:
                </strong>
                {activeSelectedStudent.postStudyReport.pedagogicalAction}
              </div>
            </div>

            {/* Critical Thinking Assessment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Nível de Pensamento Crítico:</span>
                <span className="font-bold text-emerald-400">
                  {activeSelectedStudent.postStudyReport.criticalThinkingLevel}
                </span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Coesão e Oratória:</span>
                <span className="text-slate-300">
                  {activeSelectedStudent.postStudyReport.argumentCohesion}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setFeedbackToast(
                    `Intervenção socrática enviada diretamente para o perfil de ${activeSelectedStudent.name}!`
                  );
                  handleSelect(null);
                  setTimeout(() => setFeedbackToast(null), 4500);
                }}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                Enviar Material de Nivelamento Direto
              </button>
              <button
                onClick={() => handleSelect(null)}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
