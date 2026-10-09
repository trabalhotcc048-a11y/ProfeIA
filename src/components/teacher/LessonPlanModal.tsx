import React, { useState, useEffect } from "react";
import {
  X,
  BookOpen,
  AlertTriangle,
  Users,
  Clock,
  CheckCircle2,
  FileDown,
  Save,
  Send,
  Target,
  ClipboardCheck,
  Layers,
} from "lucide-react";
import {
  TeacherAiRecommendation,
  LessonPlanRecord,
  LessonPlanStep,
} from "../../types";
import { getBlueprintForDiscipline } from "../../data/pedagogicalPlansData";
import { getSavedLessonPlans } from "../../data/teacherData";
import { generateLessonPlanPdf } from "../../services/pdfReportGenerator";
import { CLASS_CODE } from "../../data/studentsData";

interface LessonPlanModalProps {
  isOpen: boolean;
  recommendation: TeacherAiRecommendation | null;
  teacherName?: string;
  onClose: () => void;
  onSavePlan: (plan: LessonPlanRecord) => void;
  onApplyPlanToClass: (plan: LessonPlanRecord) => void;
  onExportedPdf?: (fileName: string, plan: LessonPlanRecord) => void;
}

export const LessonPlanModal: React.FC<LessonPlanModalProps> = ({
  isOpen,
  recommendation,
  teacherName = "Prof. Adnaldo Alves",
  onClose,
  onSavePlan,
  onApplyPlanToClass,
  onExportedPdf,
}) => {
  const [title, setTitle] = useState("");
  const [learningObjective, setLearningObjective] = useState("");
  const [prerequisiteToReview, setPrerequisiteToReview] = useState("");
  const [difficultyDiagnosis, setDifficultyDiagnosis] = useState("");
  const [steps, setSteps] = useState<LessonPlanStep[]>([]);
  const [didacticResources, setDidacticResources] = useState<string[]>([]);
  const [estimatedTime, setEstimatedTime] = useState("");
  const [evaluationStrategy, setEvaluationStrategy] = useState("");
  const [localFeedback, setLocalFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!recommendation) return;

    const savedPlans = getSavedLessonPlans();
    const existing = savedPlans.find(
      (p) => p.recommendationId === recommendation.id
    );

    if (existing) {
      setTitle(existing.title);
      setLearningObjective(existing.learningObjective);
      setPrerequisiteToReview(existing.prerequisiteToReview);
      setDifficultyDiagnosis(existing.difficultyDiagnosis);
      setSteps(existing.steps);
      setDidacticResources(existing.didacticResources);
      setEstimatedTime(existing.estimatedTime);
      setEvaluationStrategy(existing.evaluationStrategy);
    } else {
      const bp = getBlueprintForDiscipline(
        recommendation.disciplineId || recommendation.disciplineName
      );
      setTitle(bp.lessonTitle);
      setLearningObjective(bp.learningObjective);
      setPrerequisiteToReview(recommendation.prerequisiteIssue);
      setDifficultyDiagnosis(bp.difficultyDiagnosis);
      setSteps(bp.steps.map((s) => ({ ...s })));
      setDidacticResources([...bp.didacticResources]);
      setEstimatedTime(bp.estimatedTime);
      setEvaluationStrategy(bp.evaluationStrategy);
    }
    setLocalFeedback(null);
  }, [recommendation, isOpen]);

  if (!isOpen || !recommendation) return null;

  const buildPlanRecord = (applied = false): LessonPlanRecord => ({
    id: `plan-${recommendation.id}`,
    recommendationId: recommendation.id,
    disciplineId: recommendation.disciplineId,
    disciplineName: recommendation.disciplineName,
    topic: recommendation.topic,
    title: title.trim() || `Plano de Aula: ${recommendation.topic}`,
    learningObjective: learningObjective.trim(),
    prerequisiteToReview: prerequisiteToReview.trim(),
    difficultyDiagnosis: difficultyDiagnosis.trim(),
    errorRate: recommendation.errorRate,
    affectedStudentsCount: recommendation.affectedStudents.length,
    affectedStudents: [...recommendation.affectedStudents],
    steps,
    didacticResources,
    estimatedTime: estimatedTime.trim() || "60 minutos",
    evaluationStrategy: evaluationStrategy.trim(),
    createdAt: new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    appliedToClass: applied,
  });

  const handleStepChange = (index: number, newDescription: string) => {
    setSteps((prev) =>
      prev.map((s, i) => (i === index ? { ...s, description: newDescription } : s))
    );
  };

  const handleSave = () => {
    const record = buildPlanRecord(false);
    onSavePlan(record);
    setLocalFeedback(
      `Plano de aula salvo com sucesso para ${recommendation.disciplineName} (${recommendation.topic}).`
    );
  };

  const handleExportPdf = () => {
    const record = buildPlanRecord(false);
    onSavePlan(record);
    const fileName = generateLessonPlanPdf(record, teacherName);
    if (onExportedPdf) {
      onExportedPdf(fileName, record);
    }
    setLocalFeedback(`PDF "${fileName}" gerado e baixado com sucesso!`);
  };

  const handleApplyToClass = () => {
    const record = buildPlanRecord(true);
    onApplyPlanToClass(record);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-950/80 border-b border-slate-800 flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="font-bold text-indigo-300">
                  {recommendation.disciplineName}
                </span>
                <span aria-hidden="true">·</span>
                <span>Tópico: {recommendation.topic}</span>
                <span aria-hidden="true">·</span>
                <span>Turma {CLASS_CODE}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                Plano de Aula Contextualizado da Intervenção
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {localFeedback && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{localFeedback}</span>
              </div>
              <button
                type="button"
                onClick={() => setLocalFeedback(null)}
                className="text-emerald-300 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>
          )}

          {/* Context Summary Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">
                Dificuldade Detectada & Taxa de Erro
              </span>
              <p className="text-sm font-black text-rose-400 mt-0.5 tabular-nums">
                {recommendation.errorRate}% de erro nas tentativas
              </p>
              <span className="text-[11px] text-slate-300 mt-0.5 block">
                {recommendation.title}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">
                Pré-requisito Crítico a Revisar
              </span>
              <p className="text-xs font-bold text-amber-300 mt-1">
                {prerequisiteToReview}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">
                Alunos Afetados ({recommendation.affectedStudents.length})
              </span>
              <p className="text-xs font-bold text-indigo-300 mt-1 line-clamp-2">
                {recommendation.affectedStudents.join(", ")}
              </p>
            </div>
          </div>

          {/* Title & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-3">
              <label className="text-xs font-bold text-slate-300 mb-1.5 block">
                Título da Aula
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                Tempo Estimado
              </label>
              <input
                type="text"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Learning Objective & Diagnosis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                Objetivo Pedagógico de Aprendizagem
              </label>
              <textarea
                rows={3}
                value={learningObjective}
                onChange={(e) => setLearningObjective(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Diagnóstico Específico da Dificuldade
              </label>
              <textarea
                rows={3}
                value={difficultyDiagnosis}
                onChange={(e) => setDifficultyDiagnosis(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* 5 Pedagogical Steps */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-indigo-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-400" />
              Estrutura Metodológica da Aula (Etapas 1 a 5)
            </h3>

            <div className="space-y-2.5">
              {steps.map((step, idx) => (
                <div
                  key={step.stepNumber}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">
                      {step.stageTitle}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      Duração: {step.duration}
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={step.description}
                    onChange={(e) => handleStepChange(idx, e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Didactic Resources & Evaluation Strategy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-200 block">
                Recursos Didáticos Sugeridos ({recommendation.disciplineName})
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                {didacticResources.map((res, i) => (
                  <li key={i} className="leading-relaxed">
                    {res}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <ClipboardCheck className="w-3.5 h-3.5 text-emerald-400" />
                Estratégia de Avaliação Formativa
              </label>
              <textarea
                rows={3}
                value={evaluationStrategy}
                onChange={(e) => setEvaluationStrategy(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Target Students List */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-rose-400" />
                Estudantes Foco desta Intervenção ({recommendation.affectedStudents.length} alunos da Turma {CLASS_CODE}):
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {recommendation.affectedStudents.join(" · ")}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:px-6 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
          >
            Fechar
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleExportPdf}
              className="px-4 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileDown className="w-4 h-4" />
              <span>Exportar PDF</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4 text-indigo-400" />
              <span>Salvar Plano de Aula</span>
            </button>

            <button
              type="button"
              onClick={handleApplyToClass}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Aplicar à Turma ({recommendation.affectedStudents.length} alunos)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
