import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  RotateCw,
  Sparkles,
  BookOpen,
  ArrowLeft,
  Award,
  HelpCircle,
  ChevronRight,
  Unlock,
  Layers,
  GraduationCap,
  Lightbulb,
  Filter
} from "lucide-react";
import confetti from "canvas-confetti";
import { ActivityQuestion, StudentActivityAttempt } from "../../types";
import { initialDisciplines } from "../../data/disciplinesData";
import { getQuestionsForDisciplineAndTopic } from "../../data/activitiesData";
import { diagnoseQuestionErrorAndBuildLeveling } from "../../services/pedagogicalActivityGenerator";

interface ActivityEngineProps {
  questions: ActivityQuestion[];
  initialQuestionId?: string;
  onBack: () => void;
  onOpenTutor: (disciplineId: string, topic: string) => void;
  onOpenContent?: (disciplineId: string, contentId: string, initialTab?: any) => void;
  onRecordAttempt: (attempt: StudentActivityAttempt) => void;
}

export const ActivityEngine: React.FC<ActivityEngineProps> = ({
  questions,
  initialQuestionId,
  onBack,
  onOpenTutor,
  onOpenContent,
  onRecordAttempt,
}) => {
  // Discipline selector filter (dentre as 15 disciplinas)
  const [selectedDisciplineFilter, setSelectedDisciplineFilter] = useState<string>(() => {
    if (initialQuestionId) {
      const q = questions.find((item) => item.id === initialQuestionId);
      if (q) return q.disciplineId;
      const matchedDisc = initialDisciplines.find((d) => d.id === initialQuestionId);
      if (matchedDisc) return matchedDisc.id;
      const matchedByTopic = initialDisciplines.find((d) =>
        d.modules.some((m) => m.contents.some((c) => c.id === initialQuestionId))
      );
      if (matchedByTopic) return matchedByTopic.id;
    }
    return initialDisciplines[0].id;
  });

  const currentDisciplineObj =
    initialDisciplines.find((d) => d.id === selectedDisciplineFilter) ||
    initialDisciplines[0];

  const allDisciplineTopics = currentDisciplineObj.modules.flatMap((m) => m.contents);

  // Topic selector filter (dentre os 50 tópicos da disciplina)
  const [selectedTopicId, setSelectedTopicId] = useState<string>(() => {
    if (initialQuestionId) {
      const directTopic = allDisciplineTopics.find((t) => t.id === initialQuestionId);
      if (directTopic) return directTopic.id;
      const q = questions.find((item) => item.id === initialQuestionId);
      if (q) {
        const qTopic = allDisciplineTopics.find(
          (t) =>
            t.id === q.contentId ||
            t.title.toLowerCase() === q.contentTitle.toLowerCase()
        );
        if (qTopic) return qTopic.id;
      }
    }
    return allDisciplineTopics[0]?.id || "";
  });

  const activeTopicId = allDisciplineTopics.some((t) => t.id === selectedTopicId)
    ? selectedTopicId
    : allDisciplineTopics[0]?.id;

  // Generate/load the 10 questions for the selected discipline and topic
  const activeQuestions = getQuestionsForDisciplineAndTopic(
    currentDisciplineObj.id,
    activeTopicId
  );

  const [currentIdx, setCurrentIdx] = useState(0);

  const question = activeQuestions[currentIdx] || activeQuestions[0];

  // Selected answer state
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [discursiveText, setDiscursiveText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gabaritoRevealed, setGabaritoRevealed] = useState(false);

  // Adaptive Leveling (Nivelamento Automático) state
  const [levelingMode, setLevelingMode] = useState(false);
  const [remedialSelectedOption, setRemedialSelectedOption] = useState<string | null>(null);
  const [remedialSubmitted, setRemedialSubmitted] = useState(false);
  const [remedialCorrect, setRemedialCorrect] = useState<boolean | null>(null);

  const resetQuestionState = () => {
    setSelectedOptionId(null);
    setDiscursiveText("");
    setIsSubmitted(false);
    setIsCorrect(null);
    setGabaritoRevealed(false);
    setLevelingMode(false);
    setRemedialSubmitted(false);
    setRemedialCorrect(null);
  };

  useEffect(() => {
    if (!initialQuestionId) return;
    // Check if initialQuestionId matches a specific topic ID in any discipline
    for (const disc of initialDisciplines) {
      const matchedTopic = disc.modules
        .flatMap((m) => m.contents)
        .find((c) => c.id === initialQuestionId || c.title.toLowerCase() === initialQuestionId.toLowerCase());
      if (matchedTopic) {
        setSelectedDisciplineFilter(disc.id);
        setSelectedTopicId(matchedTopic.id);
        setCurrentIdx(0);
        resetQuestionState();
        return;
      }
    }
    // Check if initialQuestionId matches a question ID
    const q = questions.find((item) => item.id === initialQuestionId);
    if (q) {
      setSelectedDisciplineFilter(q.disciplineId);
      setSelectedTopicId(q.contentId);
      setCurrentIdx(0);
      resetQuestionState();
    }
  }, [initialQuestionId]);

  const handleFilterDiscipline = (discId: string) => {
    setSelectedDisciplineFilter(discId);
    const nextDisc = initialDisciplines.find((d) => d.id === discId) || initialDisciplines[0];
    const firstTopic = nextDisc.modules.flatMap((m) => m.contents)[0];
    if (firstTopic) {
      setSelectedTopicId(firstTopic.id);
    }
    setCurrentIdx(0);
    resetQuestionState();
  };

  const handleFilterTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    setCurrentIdx(0);
    resetQuestionState();
  };

  const handleJumpToQuestion = (idx: number) => {
    setCurrentIdx(idx);
    resetQuestionState();
  };

  const handleSelectOption = (optionId: string) => {
    if (isSubmitted) return;
    setSelectedOptionId(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId && question.type === "objective") return;
    if (!discursiveText.trim() && question.type === "discursive") return;

    let correct = false;
    if (question.type === "objective") {
      const selected = question.options?.find((o) => o.id === selectedOptionId);
      correct = Boolean(selected?.isCorrect);
    } else {
      correct = discursiveText.trim().length > 20;
    }

    setIsCorrect(correct);
    setIsSubmitted(true);
    setGabaritoRevealed(true);

    if (correct) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }

    const currentDiagnosis = diagnoseQuestionErrorAndBuildLeveling(
      question,
      selectedOptionId,
      discursiveText
    );

    // Record attempt for student progress tracking
    onRecordAttempt({
      questionId: question.id,
      disciplineId: question.disciplineId,
      subconcept: currentDiagnosis.conceptWithDifficulty,
      subconceito: currentDiagnosis.conceptWithDifficulty,
      subconceitoExato: currentDiagnosis.conceptWithDifficulty,
      conceptWithDifficulty: currentDiagnosis.conceptWithDifficulty,
      topicTitle: currentDiagnosis.topicTitle,
      topicId: currentDiagnosis.topicId,
      questionTitle: question.title,
      selectedOptionId: selectedOptionId || undefined,
      discursiveAnswer: discursiveText || undefined,
      isCorrect: correct,
      timestamp: new Date().toISOString(),
      difficultyExperienced: question.difficulty,
      remedialTriggered: !correct && Boolean(question.prerequisiteFallback),
    });
  };

  // Diagnóstico pedagógico completo e micro-nivelamento contextualizado nascidos exatamente do erro na questão
  const errorDiagnosis = diagnoseQuestionErrorAndBuildLeveling(
    question,
    selectedOptionId,
    discursiveText
  );

  const handleStartRemedial = () => {
    setLevelingMode(true);
    setRemedialSelectedOption(null);
    setRemedialSubmitted(false);
    setRemedialCorrect(null);
  };

  const handleSubmitRemedial = () => {
    if (!remedialSelectedOption) return;
    const remOpt = errorDiagnosis.reinforcementQuestion.options.find(
      (o) => o.id === remedialSelectedOption
    );
    const correct = Boolean(remOpt?.isCorrect);
    setRemedialCorrect(correct);
    setRemedialSubmitted(true);

    if (correct) {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
      });
    }
  };

  const handleUnlockGabarito = () => {
    setGabaritoRevealed(true);
  };

  const handleReturnToMainQuestion = () => {
    setLevelingMode(false);
    setIsSubmitted(false);
    setIsCorrect(null);
    setSelectedOptionId(null);
    setGabaritoRevealed(false);
  };

  const handleReviewTopicContent = () => {
    if (onOpenContent) {
      onOpenContent(errorDiagnosis.disciplineId, errorDiagnosis.topicId, "resumo");
    }
  };

  const handleNextQuestion = () => {
    setSelectedOptionId(null);
    setDiscursiveText("");
    setIsSubmitted(false);
    setIsCorrect(null);
    setGabaritoRevealed(false);
    setLevelingMode(false);
    setRemedialSubmitted(false);
    setRemedialCorrect(null);
    setCurrentIdx((prev) => (prev + 1) % activeQuestions.length);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors flex items-center gap-2 text-xs font-bold w-fit"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          Voltar às Atividades
        </button>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs font-bold text-slate-400">
            Questão {currentIdx + 1} de {activeQuestions.length}
          </span>
          <span
            className={`text-xs font-black px-3 py-1 rounded-full uppercase ${
              question.difficulty === "facil"
                ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                : question.difficulty === "medio"
                ? "bg-indigo-950/80 text-indigo-300 border border-indigo-500/40"
                : "bg-rose-950/80 text-rose-300 border border-rose-500/40"
            }`}
          >
            {question.difficulty}
          </span>
        </div>
      </div>

      {/* Discipline & Topic Selector (15 Disciplinas x 50 Tópicos = 10 Questões por Tópico) */}
      <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5 text-xs font-bold text-slate-200">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-white font-extrabold text-sm">
                Gerador de Atividades por Disciplina e Tópico
              </span>
              <span className="text-[11px] text-slate-400">
                Selecione uma das 15 disciplinas e qualquer um dos 50 tópicos (10 questões por tópico)
              </span>
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-lg self-start sm:self-auto">
            {activeQuestions.length} Questões Ativas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              1. Selecionar Disciplina ({initialDisciplines.length} disponíveis)
            </label>
            <select
              value={currentDisciplineObj.id}
              onChange={(e) => handleFilterDiscipline(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 hover:border-slate-600 rounded-xl text-xs font-bold text-emerald-300 focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"
            >
              {initialDisciplines.map((disc) => (
                <option key={disc.id} value={disc.id}>
                  {disc.name} (50 tópicos)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              2. Selecionar Tópico ({allDisciplineTopics.length} capítulos da matéria)
            </label>
            <select
              value={activeTopicId}
              onChange={(e) => handleFilterTopic(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 hover:border-slate-600 rounded-xl text-xs font-bold text-indigo-300 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
            >
              {allDisciplineTopics.map((topic, idx) => (
                <option key={topic.id} value={topic.id}>
                  Tópico {idx + 1}: {topic.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Navegação Rápida das 10 Questões do Tópico */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-slate-400">
            Caderno de 10 Questões do Tópico:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {activeQuestions.map((qItem, i) => (
              <button
                key={qItem.id}
                onClick={() => handleJumpToQuestion(i)}
                className={`w-7 h-7 rounded-lg text-xs font-black transition-all ${
                  i === currentIdx
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400/50"
                    : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                }`}
                title={qItem.title}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Container */}
      {!levelingMode ? (
        /* Regular Question Flow */
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
                {question.disciplineName}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {question.contentTitle}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
              {question.title}
            </h2>
            <p className="text-sm text-slate-300 mt-3 leading-relaxed">
              {question.prompt}
            </p>
          </div>

          {/* Options (Objective) or Discursive Input */}
          {question.type === "objective" && question.options && (
            <div className="space-y-3">
              {question.options.map((opt, idx) => {
                const isSelected = selectedOptionId === opt.id;
                let optionStyle =
                  "border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 text-slate-200";

                if (isSubmitted) {
                  // Only reveal green if gabaritoRevealed is true!
                  if (gabaritoRevealed && opt.isCorrect) {
                    optionStyle =
                      "border-emerald-500 bg-emerald-950/40 text-emerald-100 font-semibold shadow-[0_0_15px_rgba(16,185,129,0.2)]";
                  } else if (isSelected && !opt.isCorrect) {
                    optionStyle =
                      "border-rose-500 bg-rose-950/40 text-rose-200 font-semibold shadow-[0_0_15px_rgba(244,63,94,0.2)]";
                  } else {
                    optionStyle = "border-slate-800/60 bg-slate-950/40 text-slate-500";
                  }
                } else if (isSelected) {
                  optionStyle =
                    "border-indigo-500 bg-indigo-950/50 text-indigo-100 font-bold shadow-md";
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={isSubmitted}
                    className={`w-full p-4 rounded-2xl border-2 text-left text-xs sm:text-sm transition-all flex items-start gap-3 ${optionStyle}`}
                  >
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 mt-0.5 ${
                        isSubmitted && gabaritoRevealed && opt.isCorrect
                          ? "bg-emerald-500 text-slate-950"
                          : isSubmitted && isSelected && !opt.isCorrect
                          ? "bg-rose-500 text-white"
                          : isSelected
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-800 border border-slate-700 text-slate-300"
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-relaxed">{opt.text}</span>
                    {isSubmitted && gabaritoRevealed && opt.isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {isSubmitted && isSelected && !opt.isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {question.type === "discursive" && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                Sua Resposta Discursiva sobre {question.contentTitle}:
              </label>
              <textarea
                value={discursiveText}
                onChange={(e) => setDiscursiveText(e.target.value)}
                disabled={isSubmitted}
                rows={5}
                placeholder={`Elabore sua resposta sobre "${question.contentTitle}" abordando os conceitos principais, mecanismos/processos e exemplos de ${question.disciplineName}...`}
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors leading-relaxed"
              />
            </div>
          )}

          {/* Submit Action */}
          {!isSubmitted ? (
            <div className="pt-4 border-t border-slate-800 flex items-center justify-end">
              <button
                onClick={handleSubmitAnswer}
                disabled={
                  (question.type === "objective" && !selectedOptionId) ||
                  (question.type === "discursive" && !discursiveText.trim())
                }
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-40"
              >
                Confirmar Resposta
              </button>
            </div>
          ) : (
            /* Post-Submission Feedback & Immediate Leveling Card */
            <div className="pt-4 border-t border-slate-800 space-y-4 animate-in fade-in">
              {isCorrect ? (
                /* Correct Answer */
                <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-100 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Resposta Correta! Excelente raciocínio!</span>
                  </div>
                  <p className="text-xs text-emerald-200/90 leading-relaxed">
                    {question.correctExplanation}
                  </p>
                </div>
              ) : (
                /* Incorreta: 5. FEEDBACK PEDAGÓGICO COMPLETO + 6. MICRO-NIVELAMENTO CONTEXTUALIZADO */
                <div className="space-y-4">
                  {/* Cadeia Pedagógica Preservada */}
                  <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-bold text-slate-300 flex flex-wrap items-center gap-1.5">
                    <span className="text-emerald-400">{errorDiagnosis.disciplineName}</span>
                    <span className="text-slate-600">→</span>
                    <span className="text-indigo-300">{errorDiagnosis.topicTitle}</span>
                    <span className="text-slate-600">→</span>
                    <span className="text-slate-200">{errorDiagnosis.questionTitle}</span>
                    <span className="text-slate-600">→</span>
                    <span className="text-rose-400">Erro Identificado</span>
                    <span className="text-slate-600">→</span>
                    <span className="text-amber-300">{errorDiagnosis.conceptWithDifficulty}</span>
                  </div>

                  {/* 1. Resposta Correta e Por Que Ela É Correta */}
                  <div className="p-5 rounded-2xl bg-slate-950 border-2 border-emerald-500/50 space-y-3 animate-in fade-in">
                    <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      <span className="break-words leading-snug">Resposta Correta e Por Que Está Correta ({errorDiagnosis.conceptWithDifficulty})</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-100">
                      <span className="font-black text-emerald-300 block mb-1">
                        {errorDiagnosis.correctAnswerLabel}:
                      </span>
                      <p className="font-semibold leading-relaxed break-words">
                        {errorDiagnosis.correctAnswerText}
                      </p>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-200 leading-relaxed">
                      <p className="break-words">
                        <strong className="text-emerald-300 font-bold">
                          Por que a resposta correta é correta:{" "}
                        </strong>
                        {errorDiagnosis.whyCorrectExplanation}
                      </p>
                    </div>
                  </div>

                  {/* 2. Sua Resposta e Onde Está Especificamente o Erro */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div className="space-y-2 flex-1">
                      <div className="text-xs font-black text-rose-200 break-words leading-snug">
                        Diagnóstico do Erro na Sua Resposta ({question.disciplineName} • {errorDiagnosis.conceptWithDifficulty})
                      </div>
                      <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800/60 text-[11px] text-rose-200">
                        <span className="font-bold text-rose-300">Sua Resposta ({errorDiagnosis.studentAnswerLabel}): </span>
                        <span className="break-words">"{errorDiagnosis.studentAnswerText}"</span>
                      </div>
                      <p className="text-xs text-rose-100 leading-relaxed break-words">
                        <strong className="font-bold text-rose-300">Onde está o erro da sua resposta: </strong>
                        {errorDiagnosis.specificErrorExplanation}
                      </p>
                      <div className="pt-1 text-[11px] text-amber-300 font-semibold break-words leading-snug">
                        <strong className="text-amber-200">Conceito específico com dificuldade: </strong>
                        <span>{errorDiagnosis.conceptWithDifficulty}</span>
                      </div>
                    </div>
                  </div>

                  {/* 3. Explicação Curta e Didática Antes do Micro-Nivelamento */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-black text-indigo-300 uppercase tracking-wider">
                      <Lightbulb className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>Explicação Curta e Didática: Como Corrigir Este Erro</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed break-words">
                      {errorDiagnosis.shortDidacticCorrection}
                    </p>
                    {errorDiagnosis.formulaOrConceptHighlight && (
                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-indigo-500/30 text-xs font-mono text-indigo-200 break-words">
                        <strong className="font-sans text-indigo-300">Expressão / Estrutura do Tópico: </strong>
                        {errorDiagnosis.formulaOrConceptHighlight}
                      </div>
                    )}
                  </div>

                  {/* 4. Card de Micro-Nivelamento Nascido Exatamente do Erro */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/50 via-slate-900 to-amber-950/30 border-2 border-amber-500/60 shadow-xl space-y-4">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 text-amber-400 font-black text-xs uppercase tracking-wider">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                        </span>
                        <span>Micro-Nivelamento Direcionado • {question.disciplineName}</span>
                      </div>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
                        Questão → Erro → Conceito → Explicação → Reforço → Revisar
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-sm font-bold text-white break-words leading-snug">
                        Reforço do Conceito: {errorDiagnosis.conceptWithDifficulty}
                      </h4>
                      <p className="text-xs text-amber-200/90 leading-relaxed break-words">
                        Pré-requisito trabalhado nesta etapa:{" "}
                        <strong className="text-amber-300">"{errorDiagnosis.prerequisiteConcept}"</strong>{" "}
                        aplicado diretamente a <strong className="text-white">"{errorDiagnosis.conceptWithDifficulty}"</strong>.
                        Você verá a explicação do pré-requisito, um exemplo simples resolvido e uma nova questão de reforço sobre este mesmo conceito.
                      </p>
                    </div>

                    {/* Remedial & Review Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={handleStartRemedial}
                        className="p-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 text-center"
                      >
                        <Layers className="w-4 h-4 shrink-0" />
                        <span>Iniciar Micro-Nivelamento</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleReviewTopicContent}
                        className="p-3 bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-200 border border-emerald-500/40 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 text-center"
                      >
                        <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="break-words leading-tight">Revisar "{errorDiagnosis.conceptWithDifficulty}"</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onOpenTutor(question.disciplineId, errorDiagnosis.conceptWithDifficulty)
                        }
                        className="p-3 bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-200 border border-indigo-500/40 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 text-center"
                      >
                        <Sparkles className="w-4 h-4 text-indigo-300 shrink-0" />
                        <span>Tirar Dúvida no TutorIA</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation / Next Question Action */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() =>
                      onOpenTutor(question.disciplineId, errorDiagnosis.conceptWithDifficulty)
                    }
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold rounded-xl transition-all flex items-center gap-2 border border-slate-700"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Dúvidas no TutorIA</span>
                  </button>

                  <button
                    onClick={handleReviewTopicContent}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-bold rounded-xl transition-all flex items-center gap-2 border border-slate-700"
                  >
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    <span>Revisar "{errorDiagnosis.conceptWithDifficulty}"</span>
                  </button>
                </div>

                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/30"
                >
                  <span>Próxima Questão</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Remedial / Micro-Leveling Flow: QUESTÃO -> RESPOSTA DO ALUNO -> ERRO IDENTIFICADO -> CONCEITO COM DIFICULDADE -> EXPLICAÇÃO -> EXERCÍCIO DE REFORÇO -> REVISAR */
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-amber-500/50 shadow-2xl space-y-6 animate-in slide-in-from-right-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Micro-Nivelamento Contextualizado • {errorDiagnosis.disciplineName}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleReviewTopicContent}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Revisar "{errorDiagnosis.conceptWithDifficulty}"</span>
              </button>
              <button
                onClick={handleReturnToMainQuestion}
                className="text-xs font-bold text-slate-400 hover:text-white"
              >
                Voltar à questão original
              </button>
            </div>
          </div>

          {/* Cadeia Obrigatória: Disciplina -> Tópico -> Conteúdo -> Questão -> Erro -> Conceito -> Reforço */}
          <div>
            <div className="text-xs font-bold text-indigo-400 mb-1 break-words">
              {errorDiagnosis.disciplineName} → {errorDiagnosis.moduleTitle} → {errorDiagnosis.conceptWithDifficulty}
            </div>
            <h3 className="text-lg font-black text-white break-words leading-snug">
              Micro-Nivelamento: {errorDiagnosis.conceptWithDifficulty}
            </h3>
          </div>

          {/* ETAPAS 1 a 4: QUESTÃO -> RESPOSTA DO ALUNO -> ERRO IDENTIFICADO -> CONCEITO COM DIFICULDADE */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                1. Questão Original ({errorDiagnosis.questionTitle}):
              </div>
              <p className="text-xs text-slate-200 mt-0.5 leading-relaxed break-words">
                {errorDiagnosis.questionPrompt}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <div className="text-[10px] font-black uppercase tracking-wider text-rose-400">
                2. Resposta do Aluno ({errorDiagnosis.studentAnswerLabel}):
              </div>
              <p className="text-xs text-rose-200 mt-0.5 leading-relaxed break-words">
                "{errorDiagnosis.studentAnswerText}"
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <div className="text-[10px] font-black uppercase tracking-wider text-rose-300">
                3. Erro Identificado:
              </div>
              <p className="text-xs text-slate-200 mt-0.5 leading-relaxed break-words">
                {errorDiagnosis.specificErrorExplanation}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <div className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                4. Conceito Específico com Dificuldade:
              </div>
              <p className="text-xs font-bold text-amber-200 mt-0.5 break-words leading-snug">
                {errorDiagnosis.conceptWithDifficulty}
              </p>
            </div>
          </div>

          {/* ETAPA 5: EXPLICAÇÃO (PRIMEIRO O PRÉ-REQUISITO NECESSÁRIO + DEPOIS UM EXEMPLO SIMPLES) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-indigo-950/40 border border-indigo-800/60 space-y-3">
            <div className="flex items-center gap-2 text-xs font-black text-indigo-300 uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>5. Explicação Direcionada (Pré-Requisito + Exemplo Simples)</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-indigo-500/30 space-y-1">
              <div className="text-[11px] font-bold text-amber-300 break-words">
                Passo 5.1 — Pré-Requisito Necessário: {errorDiagnosis.prerequisiteConcept}
              </div>
              <p className="text-xs text-slate-200 leading-relaxed break-words">
                {errorDiagnosis.prerequisiteExplanation}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
              <div className="text-[11px] font-bold text-emerald-300 break-words">
                Passo 5.2 — Exemplo Simples de Aplicação em "{errorDiagnosis.conceptWithDifficulty}":
              </div>
              <p className="text-xs text-emerald-100 leading-relaxed break-words">
                {errorDiagnosis.simpleWorkedExample}
              </p>
            </div>
          </div>

          {/* ETAPA 6: EXERCÍCIO DE REFORÇO (NOVA QUESTÃO RELACIONADA AO MESMO CONCEITO) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                6. Exercício de Reforço (Verificação do Mesmo Conceito)
              </span>
              <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-700/40 break-words leading-snug">
                {errorDiagnosis.conceptWithDifficulty}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed p-4 rounded-2xl bg-slate-950 border border-slate-800">
              {errorDiagnosis.reinforcementQuestion.prompt}
            </p>

            {/* Remedial Options */}
            <div className="space-y-2.5">
              {errorDiagnosis.reinforcementQuestion.options.map((remOpt, idx) => {
                const isSelected = remedialSelectedOption === remOpt.id;
                let style = "border-slate-800 bg-slate-950/60 text-slate-200";

                if (remedialSubmitted) {
                  if (remOpt.isCorrect) {
                    style = "border-emerald-500 bg-emerald-950/40 text-emerald-200 font-bold";
                  } else if (isSelected && !remOpt.isCorrect) {
                    style = "border-rose-500 bg-rose-950/40 text-rose-200";
                  }
                } else if (isSelected) {
                  style = "border-amber-500 bg-amber-950/50 text-amber-200 font-bold";
                }

                return (
                  <button
                    key={remOpt.id}
                    onClick={() =>
                      !remedialSubmitted && setRemedialSelectedOption(remOpt.id)
                    }
                    className={`w-full p-4 rounded-2xl border-2 text-left text-xs sm:text-sm transition-all flex items-start gap-3 ${style}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1">{remOpt.text}</span>
                    {remedialSubmitted && remOpt.isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit / Etapa 7: REVISAR */}
          {!remedialSubmitted ? (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={handleSubmitRemedial}
                disabled={!remedialSelectedOption}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition-all disabled:opacity-40"
              >
                Validar Exercício de Reforço
              </button>
              <button
                type="button"
                onClick={handleReviewTopicContent}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="break-words">7. Revisar: "{errorDiagnosis.conceptWithDifficulty}"</span>
              </button>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div
                className={`text-xs font-bold ${
                  remedialCorrect ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {remedialCorrect
                  ? "Excelente! Você compreendeu o conceito e superou a dificuldade identificada."
                  : "Atenção à explicação do exercício de reforço para consolidar o conceito:"}
              </div>
              <p className="text-xs text-slate-200 leading-relaxed break-words">
                {errorDiagnosis.reinforcementQuestion.options.find(
                  (o) => o.id === remedialSelectedOption
                )?.explanation || errorDiagnosis.reinforcementQuestion.explanation}
              </p>
              <p className="text-xs text-emerald-300/90 leading-relaxed break-words">
                <strong>Síntese da Resolução: </strong>
                {errorDiagnosis.reinforcementQuestion.explanation}
              </p>

              {/* Etapa 7: Botão Revisar (abre exatamente o tópico/conteúdo relacionado ao erro) + Retornar à Questão */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleReviewTopicContent}
                  className="py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 text-center"
                >
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span className="break-words">Revisar: "{errorDiagnosis.conceptWithDifficulty}"</span>
                </button>

                <button
                  type="button"
                  onClick={handleReturnToMainQuestion}
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 text-center"
                >
                  <span>Retornar à Questão Original</span>
                  <ChevronRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
