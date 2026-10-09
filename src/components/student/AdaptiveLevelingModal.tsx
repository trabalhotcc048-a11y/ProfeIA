import React, { useState } from "react";
import {
  AlertTriangle,
  Lightbulb,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  X,
  RotateCcw,
  Zap,
  TrendingUp,
  BrainCircuit,
  GraduationCap
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  getConceptualGapDiagnosis,
  getDomainAcceleratorChallenge,
  ConceptualGapDiagnosis,
  DomainAcceleratorChallenge
} from "../../services/adaptiveEngine";
import { LearningTrackLevel } from "../../types";

interface AdaptiveLevelingModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicTitle: string;
  disciplineId: string;
  isAcceleratorMode?: boolean; // If true, shows the Level 4 Domain Accelerator challenge
  onLevelAdjusted?: (newLevel: LearningTrackLevel) => void;
  onReviewTopic?: () => void;
}

export const AdaptiveLevelingModal: React.FC<AdaptiveLevelingModalProps> = ({
  isOpen,
  onClose,
  topicTitle,
  disciplineId,
  isAcceleratorMode = false,
  onLevelAdjusted,
  onReviewTopic,
}) => {
  if (!isOpen) return null;

  // Fetch contextual gap diagnosis or domain accelerator challenge specific to disciplineId AND topicTitle
  const gapData: ConceptualGapDiagnosis = getConceptualGapDiagnosis(
    disciplineId,
    topicTitle
  );

  const acceleratorData: DomainAcceleratorChallenge = getDomainAcceleratorChallenge(
    disciplineId,
    topicTitle
  );

  // Remedial exercise state
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleSelectOption = (id: string) => {
    if (isSubmitted) return;
    setSelectedOptionId(id);
  };

  const handleVerify = () => {
    if (!selectedOptionId) return;

    if (isAcceleratorMode) {
      const opt = acceleratorData.advancedOptions.find((o) => o.id === selectedOptionId);
      const correct = Boolean(opt?.isCorrect);
      setIsCorrect(correct);
      setIsSubmitted(true);
      if (correct) {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
        onLevelAdjusted?.(4);
      }
    } else {
      const opt = gapData.stepByStepRemedialExercise.options.find((o) => o.id === selectedOptionId);
      const correct = Boolean(opt?.isCorrect);
      setIsCorrect(correct);
      setIsSubmitted(true);
      if (correct) {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
        onLevelAdjusted?.(2);
      }
    }
  };

  const handleReset = () => {
    setSelectedOptionId(null);
    setIsSubmitted(false);
    setIsCorrect(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isAcceleratorMode ? (
          /* ACELERADOR DE DOMÍNIO (NÍVEL 4) */
          <>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-400 border border-purple-700/40">
                    Acelerador de Domínio Ativo
                  </span>
                  <span className="text-xs text-slate-400">Alto Desempenho</span>
                </div>
                <h3 className="text-xl font-black text-white mt-0.5">
                  Atalho Direto para o Nível 4 (Aprofundamento)
                </h3>
              </div>
            </div>

            {/* Frontier Research Context */}
            <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/60 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                <GraduationCap className="w-4 h-4 text-purple-400" />
                <span>Caso de Fronteira & Pesquisa Contemporânea ({acceleratorData.frontierField}):</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {acceleratorData.contextualResearchCase}
              </p>
            </div>

            {/* Academic Challenge Question */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Desafio Teórico de Nível Acadêmico:
              </h4>
              <p className="text-sm font-semibold text-white leading-relaxed p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                {acceleratorData.academicQuestion}
              </p>

              {/* Options */}
              <div className="space-y-2">
                {acceleratorData.advancedOptions.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  let borderClass = "border-slate-800 bg-slate-850/70 hover:bg-slate-800";
                  if (isSelected) borderClass = "border-purple-500 bg-purple-950/40 text-purple-200 ring-2 ring-purple-500/30";
                  if (isSubmitted && opt.isCorrect) borderClass = "border-emerald-500 bg-emerald-950/40 text-emerald-200";
                  if (isSubmitted && isSelected && !opt.isCorrect) borderClass = "border-rose-500 bg-rose-950/40 text-rose-200";

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      disabled={isSubmitted}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${borderClass}`}
                    >
                      <span className="w-5 h-5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {opt.id.slice(-1)}
                      </span>
                      <span className="flex-1 leading-relaxed">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          /* MÓDULO DE NIVELAMENTO AUTOMÁTICO (EM CASO DE ERRO OU DÚVIDA) */
          <>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-600/30">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-700/40">
                    Micro-Nivelamento Direcionado • {gapData.disciplineName}
                  </span>
                  <span className="text-xs text-slate-400">Diagnóstico Pedagógico</span>
                </div>
                <h3 className="text-xl font-black text-white mt-0.5">
                  Reforço em {topicTitle}
                </h3>
              </div>
            </div>

            {/* Gap Diagnosis & Specific Concept */}
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/60 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Conceito com Dificuldade: {gapData.conceptWithDifficulty}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {gapData.identifiedGap}
              </p>
            </div>

            {/* 1. Prerequisite Explanation + 2. Simple Example */}
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/60 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                <Lightbulb className="w-4 h-4 text-indigo-400" />
                <span>1. Pré-Requisito Necessário ({gapData.prerequisiteConcept}):</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {gapData.prerequisiteExplanation}
              </p>
              <div className="pt-2 border-t border-indigo-800/40 space-y-1">
                <div className="text-xs font-bold text-emerald-300">
                  2. Exemplo Simples Resolvido ({topicTitle}):
                </div>
                <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                  {gapData.simpleWorkedExample}
                </p>
              </div>
            </div>

            {/* 3. Step-by-Step Gradual Remedial Exercise */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  3. Exercício de Reforço do Mesmo Conceito:
                </h4>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40">
                  {topicTitle}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                {gapData.stepByStepRemedialExercise.prompt}
              </p>

              {/* Options */}
              <div className="space-y-2">
                {gapData.stepByStepRemedialExercise.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  let borderClass = "border-slate-800 bg-slate-850/70 hover:bg-slate-800";
                  if (isSelected) borderClass = "border-indigo-500 bg-indigo-950/40 text-indigo-200 ring-2 ring-indigo-500/30";
                  if (isSubmitted && opt.isCorrect) borderClass = "border-emerald-500 bg-emerald-950/40 text-emerald-200";
                  if (isSubmitted && isSelected && !opt.isCorrect) borderClass = "border-rose-500 bg-rose-950/40 text-rose-200";

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      disabled={isSubmitted}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${borderClass}`}
                    >
                      <span className="w-5 h-5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {opt.id.slice(-1)}
                      </span>
                      <span className="flex-1 leading-relaxed">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Feedback Section if Submitted */}
        {isSubmitted && (
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 animate-in fade-in duration-200 ${
              isCorrect
                ? "bg-emerald-950/40 border-emerald-800 text-emerald-300"
                : "bg-rose-950/40 border-rose-800 text-rose-300"
            }`}
          >
            {isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider">
                {isCorrect
                  ? isAcceleratorMode
                    ? "Parabéns! Atalho Concedido para Nível 4!"
                    : "Lacuna Superada com Sucesso!"
                  : "Explicação Específica do Erro no Exercício:"}
              </h5>
              <p className="text-xs mt-1 leading-relaxed text-slate-200">
                {isAcceleratorMode
                  ? acceleratorData.advancedOptions.find((o) => o.id === selectedOptionId)?.explanation
                  : gapData.stepByStepRemedialExercise.options.find((o) => o.id === selectedOptionId)?.explanation}
              </p>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
          {isSubmitted ? (
            <>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Tentar Novamente</span>
                </button>
                {!isAcceleratorMode && (
                  <button
                    onClick={() => {
                      if (onReviewTopic) {
                        onReviewTopic();
                      } else {
                        onClose();
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <span>Revisar: {topicTitle}</span>
                  </button>
                )}
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
              >
                <span>{isCorrect ? "Retornar aos Estudos com Domínio Elevado" : "Fechar e Continuar"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              {!isAcceleratorMode ? (
                <button
                  onClick={() => {
                    if (onReviewTopic) {
                      onReviewTopic();
                    } else {
                      onClose();
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 text-xs font-bold transition-colors"
                >
                  Revisar: {topicTitle}
                </button>
              ) : (
                <span className="text-xs text-slate-500">
                  {gapData.stepByStepRemedialExercise.guidanceTip}
                </span>
              )}
              <button
                onClick={handleVerify}
                disabled={!selectedOptionId}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all ml-auto"
              >
                <span>Validar Exercício de Reforço</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
