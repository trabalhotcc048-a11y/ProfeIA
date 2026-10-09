import React, { useState, useEffect, useRef } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  FileSpreadsheet,
  Eraser,
  PenTool,
  Share2,
  MonitorUp,
  MessageSquare,
  BookOpen,
  Zap,
  AlertCircle,
  X,
  Maximize2,
  Minimize2,
  Database,
  WifiOff,
  ArrowLeft
} from "lucide-react";
import { TutorMessage, Discipline } from "../../types";
import { tutorService } from "../../services/tutorService";
import {
  findRelevantEducationalContent,
  detectQuestionContext,
  DISCIPLINE_DOMAINS,
} from "../../services/tutorIntentRouter";
import { speakNaturalVoice } from "../../services/voiceService";
import {
  isOfflineTutorModeEnabled,
  setOfflineTutorModeForced,
  getOfflineTutorModeForced,
} from "../../services/offlineTutorDB";
import { RobotAssistant } from "./RobotAssistant";
import { GenericSilhouetteAvatar } from "../common/GenericSilhouetteAvatar";

export interface TutorCallViewProps {
  initialDisciplineId?: string;
  initialTopic?: string;
  disciplines: Discipline[];
  studentName?: string;
  studentAvatar?: string;
  onCloseCall: () => void;
}

export type TutorStatus = "pronto" | "escutando" | "processando" | "respondendo";
export type RobotAnimationState = "ativo" | "estatico";

export const TutorCallView: React.FC<TutorCallViewProps> = ({
  initialDisciplineId = "geral",
  initialTopic = "Detecção Dinâmica",
  disciplines,
  studentName = "Raíssa Teixeira",
  studentAvatar = "",
  onCloseCall,
}) => {
  // Garante que todas as disciplinas de DISCIPLINE_DOMAINS (incluindo Química, Filosofia, etc.) estejam mapeadas e selecionáveis
  const allAvailableDisciplines = React.useMemo(() => {
    const list = [...disciplines];
    for (const domain of DISCIPLINE_DOMAINS) {
      if (!list.some((d) => d.id === domain.id)) {
        list.push({
          id: domain.id,
          name: domain.name,
          code: domain.id.toUpperCase().slice(0, 6),
          category: "Ciências da Natureza",
          progressPercent: 75,
          iconName: "Atom",
          modules: [
            {
              id: `${domain.id}-mod-1`,
              disciplineId: domain.id,
              title: domain.defaultTopic,
              description: `Módulo formativo de ${domain.name}`,
              contents: [
                {
                  id: `${domain.id}-top-1`,
                  disciplineId: domain.id,
                  title: domain.defaultTopic,
                  subtitle: `${domain.name} • Conteúdo Programático`,
                  estimatedMinutes: 30,
                  completed: false,
                  prerequisites: [],
                },
              ],
            },
          ],
        });
      }
    }
    return list;
  }, [disciplines]);

  // Call Controls State (cameraActive true by default for Voz & Vídeo call)
  const [micActive, setMicActive] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);
  const [audioMuted, setAudioMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [selectedDisciplineId, setSelectedDisciplineId] = useState(initialDisciplineId);
  const [currentTopic, setCurrentTopic] = useState(initialTopic);

  // Panels visibility (FaceTime mode allows docking or popping out whiteboard & chat)
  const [showWhiteboard, setShowWhiteboard] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [offlineModeActive, setOfflineModeActive] = useState<boolean>(
    isOfflineTutorModeEnabled()
  );

  useEffect(() => {
    const syncOffline = () => setOfflineModeActive(isOfflineTutorModeEnabled());
    window.addEventListener("online", syncOffline);
    window.addEventListener("offline", syncOffline);
    window.addEventListener("profeia-offline-mode-changed", syncOffline);
    return () => {
      window.removeEventListener("online", syncOffline);
      window.removeEventListener("offline", syncOffline);
      window.removeEventListener("profeia-offline-mode-changed", syncOffline);
    };
  }, []);

  // Auto-detection banner
  const [detectedBadge, setDetectedBadge] = useState<{
    name: string;
    topic?: string;
    timestamp: number;
  } | null>(null);

  // Real Camera State & Stream Ref (prevents black screen on mount)
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const [hasRealCamera, setHasRealCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Speech Recognition (Web Speech API) State — Turn-based capture (LISTENING -> THINKING -> SPEAKING -> IDLE)
  const [isListening, setIsListening] = useState(false);
  const [liveSpokenText, setLiveSpokenText] = useState("");
  const [liveAiSubtitle, setLiveAiSubtitle] = useState("");
  const [speechError, setSpeechError] = useState<string | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const silenceTimeoutRef = useRef<any>(null);
  const maxUtteranceTimeoutRef = useRef<any>(null);
  const micActiveRef = useRef(false);
  const isListeningRef = useRef(false);
  const isLoadingAiRef = useRef(false);
  const isAiSpeakingRef = useRef(false);
  const hasSubmittedTurnRef = useRef(false);
  const latestSpokenRef = useRef("");
  const isRequestInFlightRef = useRef(false);
  const lastSubmittedQueryRef = useRef<{ text: string; time: number }>({
    text: "",
    time: 0,
  });

  // AI Speaking & Loading State
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Animation State do Robô TutorIA: "ativo" durante a fala TTS e "estatico" em repouso
  const [animationState, setAnimationState] = useState<RobotAnimationState>("estatico");
  const animationStateRef = useRef<RobotAnimationState>("estatico");
  const activeTtsCancelRef = useRef<(() => void) | null>(null);

  // Interrompe imediatamente a captura de microfone e limpa timers de silêncio
  const stopMicrophoneCapture = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    if (maxUtteranceTimeoutRef.current) {
      clearTimeout(maxUtteranceTimeoutRef.current);
      maxUtteranceTimeoutRef.current = null;
    }
    micActiveRef.current = false;
    isListeningRef.current = false;
    setMicActive(false);
    setIsListening(false);
    setLiveSpokenText("");
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (e) {}
    }
  };

  // Interrompe imediatamente qualquer áudio ativo e retorna o avatar para o estado estático (IDLE)
  const stopSpeaking = () => {
    if (activeTtsCancelRef.current) {
      try {
        activeTtsCancelRef.current();
      } catch (e) {}
      activeTtsCancelRef.current = null;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsAiSpeaking(false);
    isAiSpeakingRef.current = false;
    setAnimationState("estatico");
    animationStateRef.current = "estatico";
    setLiveAiSubtitle("");
  };

  // Keep refs synchronized
  useEffect(() => {
    micActiveRef.current = micActive;
  }, [micActive]);

  useEffect(() => {
    isLoadingAiRef.current = isLoadingAi;
  }, [isLoadingAi]);

  useEffect(() => {
    isAiSpeakingRef.current = isAiSpeaking;
  }, [isAiSpeaking]);

  // Tracked Conversation Context State
  const initialDiscObj = initialDisciplineId && initialDisciplineId !== "geral"
    ? allAvailableDisciplines.find((d) => d.id === initialDisciplineId)
    : undefined;
  const [currentDetectedSubject, setCurrentDetectedSubject] = useState<string>(
    initialDiscObj?.name || "Detecção Dinâmica"
  );
  const [currentDetectedTopic, setCurrentDetectedTopic] = useState<string>(initialTopic);
  const [currentIntent, setCurrentIntent] = useState<string>("explicacao_conceitual");
  const [currentConfidence, setCurrentConfidence] = useState<"alta" | "media" | "baixa">("alta");

  // Whiteboard content / Shared Content State
  const [whiteboardText, setWhiteboardText] = useState<string>(() => {
    if (initialDisciplineId && initialDisciplineId !== "geral" && initialDiscObj) {
      const initialEdu = findRelevantEducationalContent({
        disciplineId: initialDisciplineId,
        disciplineName: initialDiscObj.name,
        topic: initialTopic,
      });
      return `# ${initialEdu.disciplineName} - ${initialEdu.topic}\n\n${initialEdu.whiteboardSnippet}`;
    }
    return `# TutorIA • Central Pedagógica Inteligente\n\nPergunte sobre qualquer assunto por voz ou texto.\nA disciplina correta será contextualizada automaticamente em tempo real sem travar em Matemática!`;
  });

  // Active view mode: "formula" or "draw"
  const [activeBoardMode, setActiveBoardMode] = useState<"formula" | "draw">("formula");

  // Chat & Transcript State - ZERO FLUFF: sem saudações ou preâmbulos de cortesia
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: "m-1",
      role: "assistant",
      content: `Qual conceito ou conteúdo você gostaria de explorar agora? O microfone possui detecção de voz automática (VAD) ou você pode digitar diretamente no chat. Qualquer disciplina será identificada e contextualizada instantaneamente.`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "text",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoadingAi]);

  // Real Camera Handler (WebRTC MediaDevices with guaranteed stream attachment)
  useEffect(() => {
    let isCancelled = false;

    if (cameraActive) {
      if (navigator.mediaDevices?.getUserMedia) {
        setCameraError(null);
        navigator.mediaDevices
          .getUserMedia({
            video: {
              facingMode: "user",
              width: { ideal: 640 },
              height: { ideal: 480 },
            },
            audio: false,
          })
          .then((stream) => {
            if (isCancelled) {
              stream.getTracks().forEach((t) => t.stop());
              return;
            }
            cameraStreamRef.current = stream;
            setHasRealCamera(true);
            setCameraError(null);
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.onloadedmetadata = () => {
                videoRef.current?.play().catch(() => {});
              };
              videoRef.current.play().catch(() => {});
            }
          })
          .catch((err) => {
            console.warn("Câmera indisponível ou permissão bloqueada:", err);
            setHasRealCamera(false);
            if (
              err.name === "NotAllowedError" ||
              err.name === "PermissionDeniedError"
            ) {
              setCameraError("Permissão de câmera bloqueada pelo navegador.");
            } else if (
              err.name === "NotFoundError" ||
              err.name === "DevicesNotFoundError"
            ) {
              setCameraError("Nenhuma câmera detectada neste computador.");
            } else {
              setCameraError("Não foi possível acessar a câmera do dispositivo.");
            }
          });
      } else {
        setHasRealCamera(false);
        setCameraError("Navegador não suporta streaming de câmera (getUserMedia).");
      }
    } else {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((track) => track.stop());
        cameraStreamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setHasRealCamera(false);
    }

    return () => {
      isCancelled = true;
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((track) => track.stop());
        cameraStreamRef.current = null;
      }
    };
  }, [cameraActive]);

  // Synchronize stream attachment whenever hasRealCamera or videoRef updates
  useEffect(() => {
    if (cameraActive && hasRealCamera && videoRef.current && cameraStreamRef.current) {
      if (videoRef.current.srcObject !== cameraStreamRef.current) {
        videoRef.current.srcObject = cameraStreamRef.current;
      }
      videoRef.current.play().catch(() => {});
    }
  }, [cameraActive, hasRealCamera]);

  // Screen Share Handler
  const handleToggleScreenShare = async () => {
    if (isScreenSharing) {
      setIsScreenSharing(false);
      return;
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setIsScreenSharing(true);
        stream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
        };
      } catch (err: any) {
        if (err.name !== "NotAllowedError") {
          console.warn("Screen share cancelado ou indisponível:", err);
        }
      }
    } else {
      alert("O compartilhamento de tela não é suportado pelo navegador atual ou neste ambiente.");
    }
  };

  // Speech Recognition Engine com Detecção Confiável de Silêncio/Fim de Fala e Encerramento Automático
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError("Reconhecimento de voz não suportado pelo navegador. Use o campo de texto.");
      return;
    }

    const recognition = new SpeechRecognition();
    // Modo de captura por turno único: encerra automaticamente no fim da fala sem ficar aberto indefinidamente
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.lang = "pt-BR";
    speechRecognitionRef.current = recognition;

    let finalTranscript = "";

    const finalizeVoiceTurn = (rawSpoken: string) => {
      if (hasSubmittedTurnRef.current) return;
      const cleaned = (rawSpoken || "").trim();
      stopMicrophoneCapture();
      finalTranscript = "";
      latestSpokenRef.current = "";

      if (
        cleaned.length > 1 &&
        !isLoadingAiRef.current &&
        !isAiSpeakingRef.current &&
        !isRequestInFlightRef.current
      ) {
        hasSubmittedTurnRef.current = true;
        handleSendMessage(cleaned);
      }
    };

    recognition.onstart = () => {
      hasSubmittedTurnRef.current = false;
      finalTranscript = "";
      latestSpokenRef.current = "";
      setIsListening(true);
      isListeningRef.current = true;
      setSpeechError(null);
    };

    recognition.onresult = (event: any) => {
      // Ignora qualquer áudio se o TutorIA já estiver em THINKING ou SPEAKING ou se o turno já foi enviado
      if (
        hasSubmittedTurnRef.current ||
        isLoadingAiRef.current ||
        isAiSpeakingRef.current ||
        !micActiveRef.current
      ) {
        return;
      }

      let interim = "";
      let hasFinalResult = false;
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        const transcriptPiece = item[0]?.transcript || "";
        if (item.isFinal) {
          finalTranscript += transcriptPiece + " ";
          hasFinalResult = true;
        } else {
          interim += transcriptPiece;
        }
      }

      const activeSpoken = (finalTranscript + interim).replace(/\s+/g, " ").trim();
      if (!activeSpoken) return;

      const textChanged = activeSpoken !== latestSpokenRef.current;
      latestSpokenRef.current = activeSpoken;
      setLiveSpokenText(activeSpoken);

      // Inicia uma janela máxima de fala (7.5s) a partir da primeira palavra detectada
      // para impedir que som ambiente/TV mantenha o microfone aberto indefinidamente
      if (!maxUtteranceTimeoutRef.current) {
        maxUtteranceTimeoutRef.current = setTimeout(() => {
          if (latestSpokenRef.current.length > 1 && !hasSubmittedTurnRef.current) {
            finalizeVoiceTurn(latestSpokenRef.current);
          } else {
            stopMicrophoneCapture();
          }
        }, 7500);
      }

      // Se o navegador já marcou o segmento como isFinal, aguarda apenas uma breve pausa (650ms) e encerra o microfone
      // Caso contrário, aguarda 1100ms de silêncio após a última mudança real de palavras
      if (textChanged || hasFinalResult) {
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }

        const waitMs = hasFinalResult ? 650 : 1100;
        silenceTimeoutRef.current = setTimeout(() => {
          if (latestSpokenRef.current.length > 1 && !hasSubmittedTurnRef.current) {
            finalizeVoiceTurn(latestSpokenRef.current);
          }
        }, waitMs);
      }
    };

    recognition.onspeechend = () => {
      // Assim que o navegador detecta fim da fala do usuário, agenda fechamento rápido
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      silenceTimeoutRef.current = setTimeout(() => {
        if (latestSpokenRef.current.length > 1 && !hasSubmittedTurnRef.current) {
          finalizeVoiceTurn(latestSpokenRef.current);
        } else {
          stopMicrophoneCapture();
        }
      }, 450);
    };

    recognition.onerror = (event: any) => {
      console.warn("Speech recognition error:", event.error);
      if (event.error === "not-allowed") {
        setSpeechError("Permissão de microfone negada no navegador.");
      }
      stopMicrophoneCapture();
    };

    recognition.onend = () => {
      // Quando a captura termina, envia o texto acumulado se ainda não enviado e encerra o microfone (NUNCA reinicia sozinho)
      if (!hasSubmittedTurnRef.current && latestSpokenRef.current.trim().length > 1) {
        finalizeVoiceTurn(latestSpokenRef.current);
      } else {
        stopMicrophoneCapture();
      }
    };

    return () => {
      stopMicrophoneCapture();
      stopSpeaking();
    };
  }, []);

  const handleToggleMic = () => {
    if (!speechRecognitionRef.current) {
      setSpeechError("Reconhecimento de voz não suportado. Digite sua dúvida no campo abaixo.");
      return;
    }

    // Se o TutorIA estiver falando e o aluno clicar no microfone, interrompe a fala imediatamente
    if (isAiSpeakingRef.current) {
      stopSpeaking();
    }

    if (micActive || isListening) {
      stopMicrophoneCapture();
    } else {
      hasSubmittedTurnRef.current = false;
      latestSpokenRef.current = "";
      setLiveSpokenText("");
      setMicActive(true);
      micActiveRef.current = true;
      setSpeechError(null);
      try {
        speechRecognitionRef.current.start();
      } catch (e) {
        console.warn("Speech recognition start notice:", e);
      }
    }
  };

  // Text-To-Speech (Voz Neural Humanizada a 1.2x com sincronização de estados: SPEAKING -> IDLE sem reativar microfone)
  const speakText = (text: string) => {
    // Garante que o microfone esteja 100% encerrado antes e durante a fala do TutorIA
    stopMicrophoneCapture();
    stopSpeaking();

    const cleanedText = (text || "").trim();
    if (!cleanedText || audioMuted) {
      setAnimationState("estatico");
      animationStateRef.current = "estatico";
      setIsAiSpeaking(false);
      isAiSpeakingRef.current = false;
      setLiveAiSubtitle("");
      return;
    }

    setLiveAiSubtitle(cleanedText);

    const cancelFn = speakNaturalVoice(cleanedText, {
      rate: 1.2,
      pitch: 1.0,
      onStart: () => {
        // Estado SPEAKING: microfone permanece desligado
        stopMicrophoneCapture();
        setAnimationState("ativo");
        animationStateRef.current = "ativo";
        setIsAiSpeaking(true);
        isAiSpeakingRef.current = true;
      },
      onEnd: () => {
        // Finaliza resposta e volta para IDLE (sem reativar o microfone automaticamente)
        setAnimationState("estatico");
        animationStateRef.current = "estatico";
        setIsAiSpeaking(false);
        isAiSpeakingRef.current = false;
        setLiveAiSubtitle("");
        activeTtsCancelRef.current = null;
      },
      onError: () => {
        setAnimationState("estatico");
        animationStateRef.current = "estatico";
        setIsAiSpeaking(false);
        isAiSpeakingRef.current = false;
        setLiveAiSubtitle("");
        activeTtsCancelRef.current = null;
      },
    });

    activeTtsCancelRef.current = cancelFn;
  };

  // Drawing Canvas Functions
  const handleStartDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const handleStopDraw = () => {
    isDrawing.current = false;
  };

  const handleClearDraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Send Message Handler (com bloqueio de chamadas duplicadas e streaming progressivo)
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    // Evita chamadas duplicadas para a mesma pergunta ou enquanto uma resposta já está sendo processada
    const now = Date.now();
    if (
      isRequestInFlightRef.current ||
      (lastSubmittedQueryRef.current.text.toLowerCase() === query.toLowerCase() &&
        now - lastSubmittedQueryRef.current.time < 2200)
    ) {
      return;
    }
    isRequestInFlightRef.current = true;
    lastSubmittedQueryRef.current = { text: query, time: now };

    // Garante encerramento imediato do microfone e de qualquer fala anterior
    stopMicrophoneCapture();
    stopSpeaking();

    if (!textToSend) {
      setInputText("");
    }

    // 1. Classificação Prévia de Disciplina (Router Pedagógico):
    // Antes de gerar qualquer resposta, analisa o texto da pergunta do aluno.
    // Se a dúvida contiver termos pertencentes a outra matéria
    // (ex.: "oração coordenada e subordinada" -> Língua Portuguesa; "reações químicas" -> Química; "fórmula de Bhaskara" -> Matemática),
    // SOBRESCREVE o parâmetro de disciplina enviado no prompt e atualiza a interface em tempo real!
    const isDynamic = selectedDisciplineId === "geral" || currentTopic === "Detecção Dinâmica";
    const currentActiveDisc = !isDynamic ? allAvailableDisciplines.find((d) => d.id === selectedDisciplineId) : undefined;

    const preContext = detectQuestionContext({
      question: query,
      selectedSubject: isDynamic ? undefined : currentActiveDisc?.name,
      selectedSubjectId: isDynamic ? undefined : selectedDisciplineId,
      currentTopic: isDynamic ? undefined : currentTopic,
      currentDetectedSubject,
      currentDetectedTopic,
      conversationHistory: messages.slice(-4).map((m) => ({
        role: m.role,
        content: m.content,
      })),
      studentLevel: "Ensino Médio e Técnico",
    });

    const targetDisciplineName = preContext.detectedSubject;
    const targetDisciplineId = preContext.detectedSubjectId;
    const targetTopic = preContext.detectedTopic;

    // 3. Atualização da Interface em Tempo Real:
    // Atualiza imediatamente a disciplina e o tópico no topo da chamada, no Quadro Branco e na Transcrição
    setSelectedDisciplineId(targetDisciplineId);
    setCurrentTopic(targetTopic);
    setCurrentDetectedSubject(targetDisciplineName);
    setCurrentDetectedTopic(targetTopic);
    setCurrentIntent(preContext.intent);
    setCurrentConfidence(preContext.confidence);
    setDetectedBadge({
      name: targetDisciplineName,
      topic: targetTopic,
      timestamp: Date.now(),
    });

    // Se houver conteúdo pré-estruturado da biblioteca pedagógica, atualiza o quadro branco imediatamente
    const targetEdu = findRelevantEducationalContent({
      disciplineId: targetDisciplineId,
      disciplineName: targetDisciplineName,
      topic: targetTopic,
      query,
    });
    if (targetEdu && targetEdu.whiteboardSnippet) {
      setWhiteboardText(
        `# ${targetDisciplineName} • ${targetTopic}\n\n${targetEdu.whiteboardSnippet}`
      );
    }

    const msgTimestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMsg: TutorMessage = {
      id: `usr-${now}`,
      role: "user",
      content: query,
      timestamp: msgTimestamp,
      type: "text",
      detectedSubject: targetDisciplineName,
      detectedTopic: targetTopic,
    };

    const streamingAiMsgId = `ai-${now + 1}`;
    let hasReceivedFirstChunk = false;

    setMessages((prev) => [...prev, userMsg]);
    setIsLoadingAi(true);
    isLoadingAiRef.current = true;

    try {
      const response = await tutorService.sendChatMessage({
        message: query,
        discipline: targetDisciplineName,
        disciplineId: targetDisciplineId,
        topic: targetTopic,
        currentSubject: targetDisciplineName,
        currentTopic: targetTopic,
        currentDetectedSubject: targetDisciplineName,
        currentDetectedTopic: targetTopic,
        conversationHistory: messages.slice(-4).map((m) => ({
          role: m.role,
          content: m.content,
          detectedSubject: m.detectedSubject,
          detectedTopic: m.detectedTopic,
        })),
        studentName: studentName,
        inputMode: textToSend ? "voice" : "text",
        streamCallbacks: {
          onMeta: (meta) => {
            if (meta.detectedDisciplineName) {
              setCurrentDetectedSubject(meta.detectedDisciplineName);
              setDetectedBadge({
                name: meta.detectedDisciplineName,
                topic: meta.detectedTopic,
                timestamp: Date.now(),
              });
            }
            if (meta.detectedTopic) {
              setCurrentDetectedTopic(meta.detectedTopic);
              setCurrentTopic(meta.detectedTopic);
            }
            if (meta.detectedDisciplineId) {
              setSelectedDisciplineId(meta.detectedDisciplineId);
            }
            if (meta.intent) {
              setCurrentIntent(meta.intent);
            }
            if (meta.confidence) {
              setCurrentConfidence(meta.confidence);
            }
            if (meta.whiteboardContent) {
              setWhiteboardText(
                `# ${meta.detectedDisciplineName || targetDisciplineName} • ${meta.detectedTopic || targetTopic}\n\n${meta.whiteboardContent}`
              );
            }
          },
          onChunk: (partialReply) => {
            if (!partialReply) return;
            // Assim que o primeiro trecho chega, encerra THINKING e exibe o conteúdo progressivamente
            if (!hasReceivedFirstChunk) {
              hasReceivedFirstChunk = true;
              setIsLoadingAi(false);
              isLoadingAiRef.current = false;
              setIsAiSpeaking(true);
              isAiSpeakingRef.current = true;
              setAnimationState("ativo");
              animationStateRef.current = "ativo";
            }
            setLiveAiSubtitle(partialReply);
            setMessages((prev) => {
              const exists = prev.some((m) => m.id === streamingAiMsgId);
              if (exists) {
                return prev.map((m) =>
                  m.id === streamingAiMsgId ? { ...m, content: partialReply } : m
                );
              }
              return [
                ...prev,
                {
                  id: streamingAiMsgId,
                  role: "assistant",
                  content: partialReply,
                  timestamp: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  type: "text",
                },
              ];
            });
          },
        },
      });

      const finalAiMsg: TutorMessage = {
        id: streamingAiMsgId,
        role: "assistant",
        content: response.reply,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: "text",
        detectedSubject: response.detectedDisciplineName,
        detectedTopic: response.detectedTopic,
        confidence: response.confidence,
      };

      setMessages((prev) => {
        const exists = prev.some((m) => m.id === streamingAiMsgId);
        if (exists) {
          return prev.map((m) => (m.id === streamingAiMsgId ? finalAiMsg : m));
        }
        return [...prev, finalAiMsg];
      });

      if (response.detectedDisciplineName) {
        setCurrentDetectedSubject(response.detectedDisciplineName);
        setDetectedBadge({
          name: response.detectedDisciplineName,
          topic: response.detectedTopic,
          timestamp: Date.now(),
        });
      }
      if (response.detectedTopic) {
        setCurrentDetectedTopic(response.detectedTopic);
        setCurrentTopic(response.detectedTopic);
      }
      if (response.detectedDisciplineId) {
        setSelectedDisciplineId(response.detectedDisciplineId);
      }
      if (response.intent) {
        setCurrentIntent(response.intent);
      }
      if (response.confidence) {
        setCurrentConfidence(response.confidence);
      }
      if (response.whiteboardContent) {
        setWhiteboardText(
          `# ${response.detectedDisciplineName || response.detectedTopic}\n\n${response.whiteboardContent}`
        );
      }

      setIsLoadingAi(false);
      isLoadingAiRef.current = false;

      // Inicia síntese de voz (SPEAKING -> ao finalizar volta para IDLE sem reativar o microfone)
      speakText(response.reply);
    } catch (error) {
      console.error("Tutor error:", error);
      const fallbackMsg: TutorMessage = {
        id: `ai-err-${Date.now()}`,
        role: "assistant",
        content:
          "Estou aqui com você! A chave desse conceito é compreender a relação causa-efeito e estrutura fundamental antes de decorar fórmulas. Gostaria de um exemplo prático aplicado?",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      setIsLoadingAi(false);
      isLoadingAiRef.current = false;
      setIsAiSpeaking(false);
      isAiSpeakingRef.current = false;
      setAnimationState("estatico");
      animationStateRef.current = "estatico";
    } finally {
      isRequestInFlightRef.current = false;
      setIsLoadingAi(false);
      isLoadingAiRef.current = false;
    }
  };

  // Quick Action Handlers
  const handleQuickAction = (actionKey: string) => {
    switch (actionKey) {
      case "simples":
        handleSendMessage(
          `Poderia explicar "${currentTopic}" de forma bem mais simples e didática, como se eu estivesse começando do zero?`
        );
        break;
      case "exemplo":
        handleSendMessage(
          `Dê um exemplo prático e aplicado no mundo real sobre "${currentTopic}".`
        );
        break;
      case "exercicio":
        handleSendMessage(
          `Crie um exercício rápido de fixação sobre "${currentTopic}" com uma pergunta direta para eu responder agora.`
        );
        break;
      case "quadro":
        setActiveBoardMode("formula");
        setShowWhiteboard(true);
        handleSendMessage(
          `Por favor, estruture as fórmulas, passos ou sintaxes fundamentais de "${currentTopic}" no quadro branco compartilhado.`
        );
        break;
      case "ponto-fraco":
        handleSendMessage(
          `Baseado no que estamos conversando, qual é o principal ponto de atenção ou erro comum que os alunos cometem em "${currentTopic}"?`
        );
        break;
      default:
        break;
    }
  };

  const activeDiscipline = allAvailableDisciplines.find((d) => d.id === selectedDisciplineId);

  // Compute Current Continuous Status
  const currentStatus: TutorStatus = isLoadingAi
    ? "processando"
    : isAiSpeaking
    ? "respondendo"
    : isListening
    ? "escutando"
    : "pronto";

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col overflow-hidden select-none animate-in fade-in duration-200">
      {/* ==================================================================== */}
      {/* TOP CALL HEADER                                                      */}
      {/* ==================================================================== */}
      <header className="h-16 bg-slate-900/95 border-b border-slate-800 px-3 sm:px-6 flex items-center justify-between shrink-0 gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            type="button"
            onClick={onCloseCall}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors shrink-0"
            title="Voltar ao painel anterior"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Voltar</span>
          </button>

          <div className="flex items-center gap-2 shrink-0">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
            </span>
            <div className="flex items-center gap-1.5 font-black text-sm tracking-tight text-white">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>TutorIA</span>
              <span className="hidden xl:inline text-slate-400 font-normal">
                • Chamada Síncrona FaceTime
              </span>
            </div>
          </div>

          <span className="hidden md:inline text-slate-700 select-none">|</span>

          {/* Container Disciplina e Tópico com espaçamento claro (gap-3), divisor visual e truncamento elegante */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Badge Disciplina */}
            <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 rounded-xl px-2.5 py-1.5 shrink-0 max-w-[170px] sm:max-w-[210px] shadow-sm">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden lg:inline shrink-0">
                Disciplina:
              </span>
              <select
                value={selectedDisciplineId}
                onChange={(e) => {
                  setSelectedDisciplineId(e.target.value);
                  const disc = allAvailableDisciplines.find((d) => d.id === e.target.value);
                  if (disc && disc.modules[0]?.contents[0]) {
                    setCurrentTopic(disc.modules[0].contents[0].title);
                  }
                }}
                className="bg-transparent border-0 text-xs font-semibold text-slate-100 focus:outline-none focus:ring-0 truncate w-full cursor-pointer pr-1"
                title="Selecionar ou alterar disciplina"
              >
                {allAvailableDisciplines.map((d) => (
                  <option key={d.id} value={d.id} className="bg-slate-900 text-slate-100">
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Divisor visual claro entre Disciplina e Tópico */}
            <span className="text-slate-600/80 select-none font-light">|</span>

            {/* Badge Tópico com truncamento elegante */}
            <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/30 rounded-xl px-3 py-1.5 min-w-0 max-w-[140px] sm:max-w-[210px] md:max-w-[280px] lg:max-w-[360px] xl:max-w-md shadow-sm">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider shrink-0">
                Tópico:
              </span>
              <span
                className="text-xs font-medium text-emerald-200 truncate"
                title={currentTopic}
              >
                {currentTopic}
              </span>
            </div>
          </div>
        </div>

        {/* Panel Toggles e Controles */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Toggle Offline IndexedDB Mode */}
          <button
            onClick={() => {
              const next = !getOfflineTutorModeForced();
              setOfflineTutorModeForced(next);
              setOfflineModeActive(isOfflineTutorModeEnabled());
            }}
            className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              offlineModeActive
                ? "bg-amber-500/25 text-amber-300 border border-amber-500/50"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
            title="Alternar Modo de Tutoria Offline (Cache Local IndexedDB)"
          >
            {offlineModeActive ? (
              <WifiOff className="w-4 h-4 text-amber-400" />
            ) : (
              <Database className="w-4 h-4 text-emerald-400" />
            )}
            <span className="hidden md:inline">
              {offlineModeActive ? "Offline (IndexedDB)" : "IndexedDB"}
            </span>
          </button>

          {/* Toggle Whiteboard */}
          <button
            onClick={() => setShowWhiteboard(!showWhiteboard)}
            className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              showWhiteboard
                ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
            title="Alternar Quadro Branco"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="hidden md:inline">Quadro</span>
          </button>

          {/* Toggle Chat */}
          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              showChat
                ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
            title="Alternar Transcrição / Chat"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden md:inline">Chat</span>
          </button>

          {/* Highlighted End Call Button */}
          <button
            onClick={onCloseCall}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-rose-600/40 shrink-0 transform active:scale-95"
          >
            <PhoneOff className="w-4 h-4" />
            <span className="hidden sm:inline">Encerrar Chamada</span>
          </button>
        </div>
      </header>

      {/* Discrete Discipline Switch Alert Banner */}
      {detectedBadge && (
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border-b border-emerald-700/60 px-4 py-2 text-xs flex items-center justify-between animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-slate-300">Identifiquei sua dúvida como: </span>
              <strong className="text-emerald-300 font-bold">{detectedBadge.name}</strong>
              {detectedBadge.topic && (
                <span className="text-cyan-200 ml-1">({detectedBadge.topic})</span>
              )}
            </div>
          </div>
          <button
            onClick={() => setDetectedBadge(null)}
            className="text-slate-400 hover:text-white px-2 py-0.5 rounded text-xs transition-colors"
          >
            Entendido
          </button>
        </div>
      )}

      {/* Speech error banner if permission denied */}
      {speechError && (
        <div className="bg-rose-950/80 border-b border-rose-800 px-4 py-2 text-xs text-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{speechError}</span>
          </div>
          <button
            onClick={() => setSpeechError(null)}
            className="text-rose-400 hover:text-white ml-2 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MAIN FACETIME STAGE                                                  */}
      {/* ==================================================================== */}
      <div className="flex-1 flex overflow-hidden p-3 gap-3">
        {/* Left/Center Stage: Primary FaceTime Video Box with PiP & Controls */}
        <div className="flex-1 flex flex-col rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 relative shadow-2xl">
          {/* ================================================================= */}
          {/* FACETIME ROBOT VIDEO CANVAS (OFFICIAL ROBOT WITH HOLOGRAMS)        */}
          {/* ================================================================= */}
          <div className="flex-1 relative w-full h-full min-h-[360px] overflow-hidden">
            <RobotAssistant
              status={currentStatus}
              isAiSpeaking={isAiSpeaking}
              isListening={isListening}
              currentSubject={activeDiscipline?.name}
              currentTopic={currentTopic}
              animationState={animationState}
              liveStudentTranscript={liveSpokenText}
              liveAiSubtitle={liveAiSubtitle}
            />

            {/* Live Status Badge in Top-Left */}
            <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/80 shadow-lg text-xs font-bold">
                {currentStatus === "processando" && (
                  <>
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                    </span>
                    <span className="text-amber-300">Processando Pedagogia...</span>
                  </>
                )}
                {currentStatus === "respondendo" && (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                    <span className="text-emerald-300">TutorIA Falando (1.2x)...</span>
                  </>
                )}
                {currentStatus === "escutando" && (
                  <>
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
                    </span>
                    <span className="text-rose-300 font-black animate-pulse">
                      Ouvindo {studentName.split(" ")[0]}...
                    </span>
                  </>
                )}
                {currentStatus === "pronto" && (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]"></span>
                    <span className="text-slate-200">Pronto para Ouvir</span>
                  </>
                )}
              </div>

              {/* Indicador de Estado de Animação do Robô (Ativo vs Estático) */}
              <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/80 shadow-lg text-xs">
                <span
                  className={`w-2 h-2 rounded-full ${
                    animationState === "ativo"
                      ? "bg-emerald-400 shadow-[0_0_8px_#10b981] animate-ping"
                      : "bg-slate-500"
                  }`}
                />
                <span
                  className={
                    animationState === "ativo"
                      ? "text-emerald-300 font-bold"
                      : "text-slate-400 font-medium"
                  }
                >
                  {animationState === "ativo"
                    ? "Robô: Gesticulação Ativa"
                    : "Robô: Estado Estático"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (animationState === "ativo") {
                      stopSpeaking();
                    } else {
                      speakText(
                        "Olá! Sou a professora Sofia no TutorIA. Vamos analisar este conceito juntos, conectando os fundamentos teóricos à prática de sala de aula com clareza."
                      );
                    }
                  }}
                  className="ml-1 text-[10px] text-indigo-400 hover:text-indigo-300 underline font-semibold transition-colors"
                >
                  {animationState === "ativo" ? "Pausar" : "Ouvir Explicação"}
                </button>
              </div>
            </div>

            {/* Screen Share Active Notice */}
            {isScreenSharing && (
              <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-indigo-900/80 border border-indigo-400/40 px-3 py-1.5 rounded-full backdrop-blur-md text-xs font-bold text-indigo-200">
                <MonitorUp className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Compartilhando Tela</span>
              </div>
            )}

            {/* =============================================================== */}
            {/* PICTURE-IN-PICTURE (PIP) OF STUDENT RAÍSSA TEIXEIRA              */}
            {/* =============================================================== */}
            <div className="absolute bottom-20 right-4 sm:bottom-24 sm:right-6 z-30 w-36 h-28 sm:w-52 sm:h-36 rounded-2xl overflow-hidden border-2 border-emerald-500/60 shadow-[0_10px_25px_rgba(0,0,0,0.6)] backdrop-blur-md bg-slate-900/90 transition-all hover:scale-105">
              {cameraActive ? (
                <div className="relative w-full h-full bg-slate-950 flex items-center justify-center">
                  <video
                    ref={(el) => {
                      videoRef.current = el;
                      if (
                        el &&
                        cameraStreamRef.current &&
                        el.srcObject !== cameraStreamRef.current
                      ) {
                        el.srcObject = cameraStreamRef.current;
                        el.play().catch(() => {});
                      }
                    }}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover transform -scale-x-100 ${
                      hasRealCamera ? "block" : "hidden"
                    }`}
                  />
                  {!hasRealCamera && (
                    <div className="flex flex-col items-center justify-center p-2 text-center">
                      <div className="mb-1">
                        <GenericSilhouetteAvatar size="sm" />
                      </div>
                      <p className="text-[10px] font-bold text-slate-200">Câmera Ativa</p>
                      <p className="text-[9px] text-slate-400 truncate max-w-[120px]">
                        {cameraError || "Conectando stream WebRTC..."}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-gradient-to-b from-slate-800 to-slate-900 text-center relative">
                  <div className="mb-1">
                    <GenericSilhouetteAvatar size="md" />
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                    <VideoOff className="w-3 h-3 text-slate-500" />
                    <span>Vídeo Desligado</span>
                  </div>
                </div>
              )}

              {/* PiP Student Label Tag */}
              <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-bold text-white border border-white/10">
                <span className="truncate">{studentName} (Você)</span>
                {micActive ? (
                  <Mic className="w-3 h-3 text-emerald-400 shrink-0" />
                ) : (
                  <MicOff className="w-3 h-3 text-rose-400 shrink-0" />
                )}
              </div>
            </div>

            {/* Quick Socratic Action Chips Floating Bar */}
            <div className="absolute bottom-3 left-4 right-4 sm:right-60 z-20 flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
              <button
                onClick={() => handleQuickAction("simples")}
                className="px-2.5 py-1.5 bg-slate-900/80 hover:bg-slate-800 text-cyan-200 border border-cyan-500/30 rounded-xl text-[11px] font-bold whitespace-nowrap backdrop-blur-md transition-colors shadow-sm"
              >
                💡 Explicar mais simples
              </button>
              <button
                onClick={() => handleQuickAction("exemplo")}
                className="px-2.5 py-1.5 bg-slate-900/80 hover:bg-slate-800 text-emerald-200 border border-emerald-500/30 rounded-xl text-[11px] font-bold whitespace-nowrap backdrop-blur-md transition-colors shadow-sm"
              >
                🎯 Exemplo prático
              </button>
              <button
                onClick={() => handleQuickAction("exercicio")}
                className="px-2.5 py-1.5 bg-slate-900/80 hover:bg-slate-800 text-indigo-200 border border-indigo-500/30 rounded-xl text-[11px] font-bold whitespace-nowrap backdrop-blur-md transition-colors shadow-sm"
              >
                📝 Exercício rápido
              </button>
              <button
                onClick={() => handleQuickAction("quadro")}
                className="px-2.5 py-1.5 bg-slate-900/80 hover:bg-slate-800 text-purple-200 border border-purple-500/30 rounded-xl text-[11px] font-bold whitespace-nowrap backdrop-blur-md transition-colors shadow-sm"
              >
                📊 No quadro branco
              </button>
              <button
                onClick={() => handleQuickAction("ponto-fraco")}
                className="px-2.5 py-1.5 bg-slate-900/80 hover:bg-slate-800 text-amber-200 border border-amber-500/30 rounded-xl text-[11px] font-bold whitespace-nowrap backdrop-blur-md transition-colors shadow-sm"
              >
                🔍 Ponto de atenção
              </button>
            </div>
          </div>

          {/* ================================================================= */}
          {/* FACETIME FLOATING BOTTOM CONTROL BAR                              */}
          {/* ================================================================= */}
          <div className="bg-slate-900/90 border-t border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0 backdrop-blur-md">
            {/* Left Controls: Audio / Video / Screen */}
            <div className="flex items-center gap-2">
              {/* Mic Button */}
              <button
                onClick={handleToggleMic}
                className={`p-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-md ${
                  micActive
                    ? isListening
                      ? "bg-rose-600 text-white ring-4 ring-rose-500/30 animate-pulse"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                }`}
                title={micActive ? "Desativar microfone" : "Ativar microfone para falar com o robô TutorIA"}
              >
                {micActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                <span className="hidden sm:inline">
                  {micActive ? (isListening ? "Escutando..." : "Microfone Ligado") : "Ativar Voz"}
                </span>
              </button>

              {/* Camera Toggle */}
              <button
                onClick={() => setCameraActive(!cameraActive)}
                className={`p-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                  cameraActive
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                }`}
                title={cameraActive ? "Desligar câmera" : "Ligar câmera da aluna"}
              >
                {cameraActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                <span className="hidden sm:inline">
                  {cameraActive ? "Câmera On" : "Ligar Câmera"}
                </span>
              </button>

              {/* Screen Share Button */}
              <button
                onClick={handleToggleScreenShare}
                className={`p-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isScreenSharing
                    ? "bg-emerald-600 text-white ring-2 ring-emerald-400"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                }`}
                title="Compartilhar Tela com o TutorIA"
              >
                <MonitorUp className="w-4 h-4" />
                <span className="hidden md:inline">
                  {isScreenSharing ? "Compartilhando" : "Compartilhar Tela"}
                </span>
              </button>

              {/* Speaker Volume Toggle */}
              <button
                onClick={() => {
                  const willMute = !audioMuted;
                  if (willMute) {
                    stopSpeaking();
                  }
                  setAudioMuted(willMute);
                }}
                className={`p-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                  audioMuted
                    ? "bg-rose-950/80 text-rose-300 border border-rose-700"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                }`}
                title="Ligar/Desligar Voz Sintetizada do TutorIA"
              >
                {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="hidden md:inline">
                  {audioMuted ? "Voz Silenciada" : "Voz Ativa"}
                </span>
              </button>
            </div>

            {/* Right: End Call Action */}
            <button
              onClick={onCloseCall}
              className="px-5 py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-rose-600/40 flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 shrink-0"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Encerrar Chamada</span>
            </button>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* OPTIONAL DOCKABLE WHITEBOARD & PEDAGOGICAL CONTENT (RIGHT / SIDE)     */}
        {/* ==================================================================== */}
        {showWhiteboard && (
          <div className="hidden xl:flex flex-col w-80 2xl:w-96 rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl shrink-0">
            {/* Whiteboard Header */}
            <div className="p-3.5 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200 min-w-0">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="shrink-0">Quadro Branco</span>
                <span
                  className="text-[10px] text-emerald-300 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md font-semibold truncate max-w-[170px]"
                  title={`${activeDiscipline?.name || currentDetectedSubject} • ${currentTopic}`}
                >
                  ({activeDiscipline?.name || currentDetectedSubject} • {currentTopic})
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveBoardMode("formula")}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                    activeBoardMode === "formula"
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-700 text-slate-300"
                  }`}
                >
                  Fórmulas
                </button>
                <button
                  onClick={() => setActiveBoardMode("draw")}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                    activeBoardMode === "draw"
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-700 text-slate-300"
                  }`}
                >
                  Desenho
                </button>
                {activeBoardMode === "draw" && (
                  <button
                    onClick={handleClearDraw}
                    className="p-1 text-slate-400 hover:text-white"
                    title="Limpar quadro"
                  >
                    <Eraser className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setShowWhiteboard(false)}
                  className="p-1 text-slate-400 hover:text-white ml-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Whiteboard Body */}
            <div className="flex-1 p-4 bg-slate-950 overflow-auto font-mono text-xs text-emerald-100">
              {activeBoardMode === "formula" ? (
                <div className="whitespace-pre-line leading-relaxed selection:bg-emerald-700">
                  {whiteboardText}
                </div>
              ) : (
                <canvas
                  ref={canvasRef}
                  width={340}
                  height={420}
                  onMouseDown={handleStartDraw}
                  onMouseMove={handleDraw}
                  onMouseUp={handleStopDraw}
                  onMouseLeave={handleStopDraw}
                  className="w-full h-full bg-slate-900/60 rounded-xl cursor-crosshair border border-slate-800"
                />
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* OPTIONAL DOCKABLE LIVE TRANSCRIPT & CHAT                             */}
        {/* ==================================================================== */}
        {showChat && (
          <div className="hidden lg:flex flex-col w-80 2xl:w-96 rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl shrink-0">
            {/* Chat Header */}
            <div className="p-3.5 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200 min-w-0">
                <MessageSquare className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="shrink-0">Transcrição</span>
                <span
                  className="text-[10px] text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-md font-semibold truncate max-w-[170px]"
                  title={`${activeDiscipline?.name || currentDetectedSubject} • ${currentTopic}`}
                >
                  ({activeDiscipline?.name || currentDetectedSubject} • {currentTopic})
                </span>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center justify-between w-full max-w-[90%] text-[10px] text-slate-400 mb-0.5 px-1">
                    <div className="flex items-center gap-1">
                      <span>{m.role === "user" ? studentName.split(" ")[0] : "TutorIA"}</span>
                      <span>•</span>
                      <span>{m.timestamp}</span>
                    </div>
                    {m.role === "assistant" && (
                      <button
                        type="button"
                        onClick={() => speakText(m.content)}
                        className="flex items-center gap-1 text-[9px] text-emerald-400 hover:text-emerald-300 font-bold transition-colors p-0.5"
                        title="Ouvir resposta com sincronização de gesticulação do robô"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Ouvir (1.2x)</span>
                      </button>
                    )}
                  </div>
                  <div
                    className={`max-w-[90%] p-3 rounded-2xl text-xs leading-relaxed ${
                      m.role === "user"
                        ? "bg-indigo-600 text-white rounded-tr-none shadow-md"
                        : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700 whitespace-pre-line"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {isLoadingAi && (
                <div className="flex items-center gap-2 p-3 bg-slate-800 rounded-2xl text-xs text-emerald-300 animate-pulse border border-slate-700">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>TutorIA processando resposta...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Text Input Footer */}
            <div className="p-3 bg-slate-950 border-t border-slate-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Pergunte algo ao TutorIA...`}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isLoadingAi}
                  className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all disabled:opacity-30"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
