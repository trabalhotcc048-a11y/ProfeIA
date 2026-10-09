import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  MessageSquare,
  Scale,
  BrainCircuit,
  CheckCircle2,
  X,
  Send,
  RotateCcw,
  TrendingUp,
  Award,
  AlertCircle,
  HelpCircle,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  BookOpen,
  ArrowLeft
} from "lucide-react";
import { speakNaturalVoice, startVadSpeechRecognition } from "../../services/voiceService";
import {
  ALL_14_DEBATE_TOPICS,
  DebateTopic
} from "../../data/simulationsAndDebatesData";

interface DebateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  initialDisciplineId?: string;
  onCompleteDebate?: (report: { topicTitle: string; learningGain: string; mainDifficulty: string }) => void;
}

export const DebateSessionModal: React.FC<DebateSessionModalProps> = ({
  isOpen,
  onClose,
  studentName,
  initialDisciplineId,
  onCompleteDebate,
}) => {
  const getInitialTopic = () => {
    if (initialDisciplineId) {
      const found = ALL_14_DEBATE_TOPICS.find((t) => t.disciplineId === initialDisciplineId);
      if (found) return found;
    }
    return ALL_14_DEBATE_TOPICS[0];
  };

  const [selectedTopic, setSelectedTopic] = useState<DebateTopic>(getInitialTopic);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [studentInput, setStudentInput] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [conversation, setConversation] = useState<
    { sender: "TUTOR" | "STUDENT"; text: string; socraticTag?: string }[]
  >([
    {
      sender: "TUTOR",
      text: getInitialTopic().starterPrompt,
      socraticTag: "Tese Inicial Socrática",
    },
  ]);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);
  const [activeSpeechIndex, setActiveSpeechIndex] = useState<number | null>(null);

  const vadControllerRef = useRef<{ stop: () => void } | null>(null);
  const speechCancelRef = useRef<(() => void) | null>(null);

  // Socratic Dialectic Metrics (0 - 100)
  const [cohesion, setCohesion] = useState<number>(65);
  const [evidence, setEvidence] = useState<number>(60);
  const [refutation, setRefutation] = useState<number>(55);

  useEffect(() => {
    if (initialDisciplineId) {
      const topic = ALL_14_DEBATE_TOPICS.find((t) => t.disciplineId === initialDisciplineId);
      if (topic) {
        handleSelectTopic(topic);
      }
    }
  }, [initialDisciplineId]);

  useEffect(() => {
    return () => {
      if (vadControllerRef.current) {
        vadControllerRef.current.stop();
        vadControllerRef.current = null;
      }
      if (speechCancelRef.current) {
        speechCancelRef.current();
        speechCancelRef.current = null;
      }
    };
  }, []);

  if (!isOpen) return null;

  // Síntese de voz neural humanizada a 1.2x (ritmo ágil de conversa)
  const handleSpeakTutor = (text: string, index: number) => {
    if (speechCancelRef.current) {
      speechCancelRef.current();
      speechCancelRef.current = null;
    }

    if (activeSpeechIndex === index && isAiSpeaking) {
      setIsAiSpeaking(false);
      setActiveSpeechIndex(null);
      return;
    }

    setIsAiSpeaking(true);
    setActiveSpeechIndex(index);

    speechCancelRef.current = speakNaturalVoice(text, {
      rate: 1.2, // Estritamente 1.2x como solicitado
      pitch: 1.0,
      onEnd: () => {
        setIsAiSpeaking(false);
        setActiveSpeechIndex(null);
      },
      onError: () => {
        setIsAiSpeaking(false);
        setActiveSpeechIndex(null);
      },
    });
  };

  const handleSelectTopic = (topic: DebateTopic) => {
    if (vadControllerRef.current) {
      vadControllerRef.current.stop();
      vadControllerRef.current = null;
    }
    if (speechCancelRef.current) {
      speechCancelRef.current();
      speechCancelRef.current = null;
    }
    setIsAiSpeaking(false);
    setActiveSpeechIndex(null);
    setIsRecording(false);

    setSelectedTopic(topic);
    setCurrentRound(1);
    setStudentInput("");
    setIsFinished(false);
    setCohesion(65);
    setEvidence(60);
    setRefutation(55);
    setConversation([
      {
        sender: "TUTOR",
        text: topic.starterPrompt,
        socraticTag: "Tese Inicial Socrática",
      },
    ]);
  };

  const handleSendArgument = () => {
    if (!studentInput.trim()) return;

    if (vadControllerRef.current) {
      vadControllerRef.current.stop();
      vadControllerRef.current = null;
    }
    setIsRecording(false);

    const userText = studentInput.trim();
    const newConv = [
      ...conversation,
      { sender: "STUDENT" as const, text: userText },
    ];
    setStudentInput("");

    // Simulate TutorIA Socratic Evaluation & Counterpoint
    if (currentRound === 1) {
      setCurrentRound(2);
      setCohesion((c) => Math.min(100, c + 15));
      setEvidence((e) => Math.min(100, e + 12));
      setTimeout(() => {
        setConversation([
          ...newConv,
          {
            sender: "TUTOR",
            text: selectedTopic.tutorCounterArg,
            socraticTag: "Objeção Socrática & Contra-Ponto",
          },
        ]);
        // Auto-play counter argument audio at 1.2x
        handleSpeakTutor(selectedTopic.tutorCounterArg, newConv.length);
      }, 400);
    } else if (currentRound === 2) {
      setCurrentRound(3);
      setRefutation((r) => Math.min(100, r + 25));
      setCohesion((c) => Math.min(100, c + 10));
      setTimeout(() => {
        const conclusionText = `Magnífica sustentação, ${studentName}! Você rebateu o contra-ponto em ${selectedTopic.disciplineName}, demonstrando domínio do tema e articulação dialética com rigor conceitual.`;
        setConversation([
          ...newConv,
          {
            sender: "TUTOR",
            text: conclusionText,
            socraticTag: "Síntese Dialética & Validação Socrática",
          },
        ]);
        handleSpeakTutor(conclusionText, newConv.length);
        setIsFinished(true);
        if (onCompleteDebate) {
          onCompleteDebate({
            topicTitle: selectedTopic.title,
            learningGain: "+70% de aprendizado",
            mainDifficulty: selectedTopic.mappedDifficulty,
          });
        }
      }, 500);
    }
  };

  // VAD Inteligente: desliga o microfone automaticamente após o aluno parar de falar (1.0s a 1.5s de silêncio)
  const handleToggleVoice = () => {
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
        setIsAiSpeaking(false);
        setActiveSpeechIndex(null);
      }

      // Threshold calibrado entre 1.0s e 1.5s (padrão 1200ms)
      const vadTimeout = 1200;

      const controller = startVadSpeechRecognition({
        silenceThresholdMs: vadTimeout,
        onStartListening: () => {
          setIsRecording(true);
        },
        onStopListening: () => {
          setIsRecording(false);
          vadControllerRef.current = null;
        },
        onTranscript: (interim) => {
          setStudentInput(interim);
        },
        onFinalTranscript: (final) => {
          setStudentInput(final);
          setIsRecording(false);
          vadControllerRef.current = null;
        },
        onError: () => {
          setIsRecording(false);
          vadControllerRef.current = null;
        },
      });

      vadControllerRef.current = controller;
    }
  };

  const handleResetDebate = () => {
    handleSelectTopic(selectedTopic);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
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
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Sessão de Debates Socráticos • Disciplinas
                </span>
                <span className="text-[11px] text-indigo-400 font-bold hidden sm:inline">
                  {selectedTopic.disciplineName}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                {selectedTopic.title}
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

        {/* Barra de Seleção das 14 Disciplinas para Debate */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-950/40 border-b border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-xs font-bold text-slate-400 shrink-0">Disciplina:</span>
          {ALL_14_DEBATE_TOPICS.map((top) => (
            <button
              key={top.id}
              onClick={() => handleSelectTopic(top)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                selectedTopic.id === top.id
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/50"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{top.disciplineName}</span>
            </button>
          ))}
        </div>

        {/* Dialectic Metrics Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-950/40 border-b border-slate-800 grid grid-cols-3 gap-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Coesão Lógica:</span>
            <span className="font-bold text-emerald-400">{cohesion}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Fundamentação:</span>
            <span className="font-bold text-indigo-400">{evidence}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Refutação Socrática:</span>
            <span className="font-bold text-amber-400">{refutation}%</span>
          </div>
        </div>

        {/* Dialogue Scrollable Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {conversation.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                msg.sender === "STUDENT" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 space-y-1.5 shadow-md ${
                  msg.sender === "STUDENT"
                    ? "bg-indigo-600 text-white rounded-tr-xs"
                    : "bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-xs"
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-[11px] opacity-80 border-b border-white/10 pb-1">
                  <span className="font-bold">
                    {msg.sender === "STUDENT" ? `${studentName} (Você)` : "TutorIA Socrático"}
                  </span>
                  {msg.socraticTag && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/20 text-yellow-300">
                      {msg.socraticTag}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm leading-relaxed">{msg.text}</p>

                {msg.sender === "TUTOR" && (
                  <div className="pt-1 flex items-center justify-end">
                    <button
                      onClick={() => handleSpeakTutor(msg.text, idx)}
                      className="text-[11px] text-indigo-300 hover:text-white flex items-center gap-1 transition-colors"
                      title="Ouvir resposta socrática a 1.2x"
                    >
                      {activeSpeechIndex === idx && isAiSpeaking ? (
                        <>
                          <VolumeX className="w-3 h-3 text-emerald-400 animate-pulse" />
                          <span className="text-emerald-300 font-bold">Pausar Voz</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3" />
                          <span>Ouvir 1.2x</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isFinished && (
            <div className="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-500/40 text-center space-y-2 animate-in zoom-in-95">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 mx-auto flex items-center justify-center text-emerald-400">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">
                Ciclo Dialético Validado pelo TutorIA!
              </h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Sua proficiência em argumentação lógica para a disciplina de{" "}
                <strong className="text-emerald-300">{selectedTopic.disciplineName}</strong> foi consolidada.
              </p>
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                Ganho Registrado: +70% de Aprendizado & Oratória
              </div>
            </div>
          )}
        </div>

        {/* Footer Input Area */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 space-y-2">
          {!isFinished ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleVoice}
                className={`p-3 rounded-2xl border transition-all shrink-0 ${
                  isRecording
                    ? "bg-rose-600 text-white border-rose-500 animate-pulse shadow-lg shadow-rose-600/30"
                    : "bg-slate-800 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-700"
                }`}
                title={
                  isRecording
                    ? "Microfone aberto (desliga automaticamente ao parar de falar)"
                    : "Falar argumento por voz (VAD Inteligente 1.0s-1.5s)"
                }
              >
                {isRecording ? <Mic className="w-5 h-5 animate-bounce" /> : <MicOff className="w-5 h-5" />}
              </button>

              <input
                type="text"
                value={studentInput}
                onChange={(e) => setStudentInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendArgument()}
                placeholder={
                  isRecording
                    ? "Ouvindo sua resposta... (O microfone desliga após falar)"
                    : "Digite ou fale seu contra-argumento ou tese socrática..."
                }
                className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />

              <button
                disabled={!studentInput.trim()}
                onClick={handleSendArgument}
                className={`p-3 rounded-2xl font-bold transition-all shrink-0 ${
                  studentInput.trim()
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 hover:scale-105"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50"
                }`}
                title="Submeter argumento"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3 py-1">
              <button
                onClick={handleResetDebate}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reiniciar este Debate</span>
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30"
              >
                Finalizar e Voltar
              </button>
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span>
              {isRecording
                ? "🎙️ Microfone ativo com VAD inteligente: encerra sozinho com 1.2s de silêncio."
                : "Dica: Use evidências históricas, conceituais e leis para sustentar sua refutação."}
            </span>
            <span>Rodada {currentRound} de 3</span>
          </div>
        </div>
      </div>
    </div>
  );
};
