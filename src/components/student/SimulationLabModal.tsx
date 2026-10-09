import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Terminal,
  Activity,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  X,
  Play,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Award,
  Layers,
  Cpu,
  Landmark,
  BarChart2,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Radio,
  BookOpen
} from "lucide-react";
import { speakNaturalVoice, startVadSpeechRecognition } from "../../services/voiceService";
import {
  ALL_14_SIMULATION_SCENARIOS,
  SimulationScenario,
  SimulationStepChoice
} from "../../data/simulationsAndDebatesData";

interface SimulationLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  initialDisciplineId?: string;
  onCompleteSimulation?: (report: { scenarioTitle: string; learningGain: string; note: string }) => void;
}

export const SimulationLabModal: React.FC<SimulationLabModalProps> = ({
  isOpen,
  onClose,
  studentName,
  initialDisciplineId,
  onCompleteSimulation,
}) => {
  // Find initial scenario or default to first of 14
  const getInitialScenario = () => {
    if (initialDisciplineId) {
      const found = ALL_14_SIMULATION_SCENARIOS.find((s) => s.disciplineId === initialDisciplineId);
      if (found) return found;
    }
    return ALL_14_SIMULATION_SCENARIOS[0];
  };

  const [selectedScenario, setSelectedScenario] = useState<SimulationScenario>(getInitialScenario);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [hasSubmittedChoice, setHasSubmittedChoice] = useState<boolean>(false);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // HUD Dynamic Gauges (0 - 100)
  const [stability, setStability] = useState<number>(50);
  const [confidence, setConfidence] = useState<number>(50);
  const [rigor, setRigor] = useState<number>(50);

  // Audio state (TTS & VAD)
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [speechTranscript, setSpeechTranscript] = useState<string>("");
  const speechCancelRef = useRef<(() => void) | null>(null);
  const vadControllerRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    if (initialDisciplineId) {
      const scen = ALL_14_SIMULATION_SCENARIOS.find((s) => s.disciplineId === initialDisciplineId);
      if (scen) {
        handleSelectScenario(scen);
      }
    }
  }, [initialDisciplineId]);

  useEffect(() => {
    return () => {
      if (speechCancelRef.current) {
        speechCancelRef.current();
        speechCancelRef.current = null;
      }
      if (vadControllerRef.current) {
        vadControllerRef.current.stop();
        vadControllerRef.current = null;
      }
    };
  }, []);

  if (!isOpen) return null;

  const currentStep = selectedScenario.steps[currentStepIdx] || selectedScenario.steps[0];
  const activeChoice = currentStep.choices.find((c) => c.id === selectedChoiceId);

  // Síntese de voz neural humanizada a 1.2x
  const speakScenarioText = (text: string) => {
    if (speechCancelRef.current) {
      speechCancelRef.current();
      speechCancelRef.current = null;
    }
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    speechCancelRef.current = speakNaturalVoice(text, {
      rate: 1.2, // Estritamente 1.2x (ritmo ágil de conversa)
      pitch: 1.0,
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  // VAD Inteligente: encerra o microfone após 1.0s a 1.5s de silêncio
  const handleToggleVoiceInput = () => {
    if (isRecording) {
      if (vadControllerRef.current) {
        vadControllerRef.current.stop();
        vadControllerRef.current = null;
      }
      setIsRecording(false);
    } else {
      if (speechCancelRef.current) {
        speechCancelRef.current();
        speechCancelRef.current = null;
        setIsSpeaking(false);
      }

      setSpeechTranscript("");
      const vadTimeout = 1200; // 1.2s dentro do intervalo 1.0s - 1.5s

      const controller = startVadSpeechRecognition({
        silenceThresholdMs: vadTimeout,
        onStartListening: () => {
          setIsRecording(true);
        },
        onStopListening: () => {
          setIsRecording(false);
          vadControllerRef.current = null;
        },
        onTranscript: (interimText) => {
          setSpeechTranscript(interimText);
        },
        onFinalTranscript: (finalText) => {
          setSpeechTranscript(finalText);
          setIsRecording(false);
          vadControllerRef.current = null;

          // Se o aluno falou algo correspondente a uma escolha, seleciona
          const lower = finalText.toLowerCase();
          const choices = currentStep.choices;
          if (lower.includes("primeira") || lower.includes("opção 1") || lower.includes("opcao 1") || lower.includes("letra a")) {
            setSelectedChoiceId(choices[0]?.id || null);
          } else if (lower.includes("segunda") || lower.includes("opção 2") || lower.includes("opcao 2") || lower.includes("letra b")) {
            setSelectedChoiceId(choices[1]?.id || null);
          } else if (lower.includes("terceira") || lower.includes("opção 3") || lower.includes("opcao 3") || lower.includes("letra c")) {
            setSelectedChoiceId(choices[2]?.id || null);
          } else {
            // Tenta encontrar palavras-chave das opções
            const matched = choices.find((c) =>
              c.label.toLowerCase().split(" ").some((word) => word.length > 4 && lower.includes(word))
            );
            if (matched) {
              setSelectedChoiceId(matched.id);
            }
          }
        },
        onError: () => {
          setIsRecording(false);
          vadControllerRef.current = null;
        },
      });

      vadControllerRef.current = controller;
    }
  };

  const handleSelectScenario = (scen: SimulationScenario) => {
    if (speechCancelRef.current) {
      speechCancelRef.current();
      speechCancelRef.current = null;
    }
    if (vadControllerRef.current) {
      vadControllerRef.current.stop();
      vadControllerRef.current = null;
    }
    setIsSpeaking(false);
    setIsRecording(false);
    setSelectedScenario(scen);
    setCurrentStepIdx(0);
    setSelectedChoiceId(null);
    setHasSubmittedChoice(false);
    setSimulationLog([]);
    setIsFinished(false);
    setStability(50);
    setConfidence(50);
    setRigor(50);
  };

  const handleConfirmDecision = () => {
    if (!activeChoice) return;
    setHasSubmittedChoice(true);

    const newStability = Math.min(100, Math.max(10, stability + activeChoice.metricsDelta.stability));
    const newConfidence = Math.min(100, Math.max(10, confidence + activeChoice.metricsDelta.confidence));
    const newRigor = Math.min(100, Math.max(10, rigor + activeChoice.metricsDelta.rigor));

    setStability(newStability);
    setConfidence(newConfidence);
    setRigor(newRigor);

    setSimulationLog((prev) => [
      ...prev,
      `[Rodada ${currentStep.round}]: Decisão de ${studentName} -> "${activeChoice.label}"`,
      `[Consequência]: ${activeChoice.consequence}`,
    ]);

    // Lê a consequência com áudio dinâmico humanizado a 1.2x
    speakScenarioText(activeChoice.consequence);
  };

  const handleNextStep = () => {
    if (currentStepIdx + 1 < selectedScenario.steps.length) {
      setCurrentStepIdx((prev) => prev + 1);
      setSelectedChoiceId(null);
      setHasSubmittedChoice(false);
    } else {
      setIsFinished(true);
      if (onCompleteSimulation) {
        onCompleteSimulation({
          scenarioTitle: selectedScenario.title,
          learningGain: "+60% de aprendizado",
          note: "Decisões práticas consolidadas com análise de consequências reais pelo TutorIA.",
        });
      }
    }
  };

  const handleReset = () => {
    setCurrentStepIdx(0);
    setSelectedChoiceId(null);
    setHasSubmittedChoice(false);
    setSimulationLog([]);
    setIsFinished(false);
    setStability(50);
    setConfidence(50);
    setRigor(50);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors shrink-0"
              title="Voltar ao menu anterior"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar</span>
            </button>
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Laboratório de Simulação Viva • Disciplinas
                </span>
                <span className="text-[11px] text-emerald-400 font-bold hidden sm:inline">
                  {selectedScenario.disciplineName}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                {selectedScenario.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra Seletora de Todas as 14 Disciplinas */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-950/40 border-b border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-xs font-bold text-slate-400 shrink-0">Matéria:</span>
          {ALL_14_SIMULATION_SCENARIOS.map((scen) => (
            <button
              key={scen.id}
              onClick={() => handleSelectScenario(scen)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                selectedScenario.id === scen.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/50"
              }`}
            >
              <scen.icon className="w-3.5 h-3.5" />
              <span>{scen.disciplineName}</span>
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Real-time HUD Gauges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  Estabilidade
                </span>
                <span className="font-bold text-emerald-400">{stability}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${stability}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  Confiança
                </span>
                <span className="font-bold text-indigo-400">{confidence}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${confidence}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                  Rigor Técnico
                </span>
                <span className="font-bold text-amber-400">{rigor}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${rigor}%` }}
                />
              </div>
            </div>
          </div>

          {/* Contexto do Incidente */}
          <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-800/80 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong className="text-white">Briefing do Caso Real:</strong> {selectedScenario.brief}
            </div>
          </div>

          {!isFinished ? (
            <div className="space-y-5">
              {/* Tutor Master Prompt com Suporte a Voz Neural (1.2x) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    Rodada {currentStep.round} de {selectedScenario.steps.length} • Desafio Prático
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => speakScenarioText(currentStep.tutorMasterPrompt)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                        isSpeaking
                          ? "bg-emerald-600 text-white animate-pulse shadow-md"
                          : "bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30"
                      }`}
                      title="Ouvir TutorIA a 1.2x"
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span>{isSpeaking ? "Pausar Voz" : "Ouvir 1.2x"}</span>
                    </button>

                    {/* Botão de Voz Interativa com VAD (1.0s - 1.5s) */}
                    <button
                      onClick={handleToggleVoiceInput}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                        isRecording
                          ? "bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/40"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                      }`}
                      title="Falar Resposta (VAD inteligente com auto-desligamento)"
                    >
                      {isRecording ? <Mic className="w-3.5 h-3.5 animate-bounce" /> : <MicOff className="w-3.5 h-3.5" />}
                      <span>{isRecording ? "Ouvindo Aluno..." : "Responder por Voz"}</span>
                    </button>
                  </div>
                </div>

                <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                  {currentStep.tutorMasterPrompt}
                </p>

                {speechTranscript && (
                  <div className="p-2.5 bg-slate-950/80 rounded-xl border border-indigo-500/30 text-xs text-indigo-200 flex items-center gap-2">
                    <span className="font-bold text-emerald-400">Transcrição por Voz:</span>
                    <span>"{speechTranscript}"</span>
                  </div>
                )}
              </div>

              {/* Choices list */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Selecione sua intervenção técnica (ou fale por voz):
                </span>
                {currentStep.choices.map((choice, idx) => {
                  const isSelected = selectedChoiceId === choice.id;
                  return (
                    <button
                      key={choice.id}
                      disabled={hasSubmittedChoice}
                      onClick={() => setSelectedChoiceId(choice.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? "bg-indigo-600/20 border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg"
                          : "bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40"
                      } ${hasSubmittedChoice ? "cursor-default opacity-80" : ""}`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs font-bold mt-0.5 ${
                          isSelected
                            ? "bg-indigo-500 text-white"
                            : "bg-slate-800 text-slate-400 border border-slate-700"
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm font-semibold text-slate-200">
                          {choice.label}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Feedback de Consequência após Decisão */}
              {hasSubmittedChoice && activeChoice && (
                <div
                  className={`p-4 sm:p-5 rounded-2xl border animate-in fade-in duration-300 space-y-2 ${
                    activeChoice.isOptimal
                      ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
                      : "bg-amber-950/40 border-amber-500/40 text-amber-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {activeChoice.isOptimal ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                    )}
                    <span className="font-bold text-xs sm:text-sm">
                      {activeChoice.isOptimal
                        ? "Intervenção Ótima Conduzida com Rigor!"
                        : "Impacto no Sistema Registrado"}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-white font-medium">
                    {activeChoice.consequence}
                  </p>
                  <p className="text-xs text-slate-300 italic">
                    <strong>Nota Pedagógica da IA:</strong> {activeChoice.learningNote}
                  </p>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleReset}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reiniciar Simulação</span>
                </button>

                {!hasSubmittedChoice ? (
                  <button
                    disabled={!selectedChoiceId}
                    onClick={handleConfirmDecision}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                      selectedChoiceId
                        ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 hover:scale-[1.02]"
                        : "bg-slate-800 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    <span>Executar Decisão Técnica</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleNextStep}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
                  >
                    <span>
                      {currentStepIdx + 1 < selectedScenario.steps.length
                        ? "Avançar Próxima Rodada"
                        : "Finalizar Simulação"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Tela Final com Síntese e Ganho de Aprendizagem */
            <div className="text-center py-8 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">
                  Simulação Concluída em {selectedScenario.disciplineName}!
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto mt-1">
                  Parabéns, {studentName}. Suas intervenções práticas consolidaram as habilidades da disciplina através do método empírico guiado por IA.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>Ganho Registrado: +60% de Aprendizado Prático</span>
              </div>

              {simulationLog.length > 0 && (
                <div className="max-w-xl mx-auto p-4 bg-slate-950 rounded-2xl border border-slate-800 text-left space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Diário de Bordo da Simulação:
                  </span>
                  <div className="space-y-1.5 text-xs text-slate-300 font-mono max-h-36 overflow-y-auto">
                    {simulationLog.map((log, i) => (
                      <div key={i} className="border-b border-slate-900 pb-1">
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
                >
                  Repetir Cenário
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30"
                >
                  Concluir e Voltar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
