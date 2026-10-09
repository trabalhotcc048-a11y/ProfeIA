import React, { useEffect, useRef, useState } from "react";
import { TutorStatus, RobotAnimationState } from "./TutorCallView";
import tutoriaOfficialImg from "../../assets/images/tutoria_official_fixed_1790562551206.jpg";
import {
  TutorAvatarCoreState,
  RobotCharacterState,
  ContextualGestureType,
  TutorSpeechTelemetry,
  subscribeToTutorSpeechTelemetry,
  getTutorSpeechTelemetry,
} from "../../services/voiceService";
import {
  TutoriaLiveAvatarEngine,
  computeLiveAvatarPose,
  createNeutralLivePose,
  interpolateLivePose,
} from "./tutoriaLiveAvatarEngine";

interface RobotAssistantProps {
  status: TutorStatus;
  isAiSpeaking: boolean;
  isListening: boolean;
  currentSubject?: string;
  currentTopic?: string;
  animationState?: RobotAnimationState;
  liveStudentTranscript?: string;
  liveAiSubtitle?: string;
}

export const RobotAssistant: React.FC<RobotAssistantProps> = ({
  status,
  isAiSpeaking,
  isListening,
  animationState,
  liveStudentTranscript,
  liveAiSubtitle,
}) => {
  const [telemetry, setTelemetry] = useState<TutorSpeechTelemetry>(() =>
    getTutorSpeechTelemetry()
  );
  const [engineReady, setEngineReady] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<TutoriaLiveAvatarEngine | null>(null);
  const currentPoseRef = useRef(createNeutralLivePose());
  const telemetryRef = useRef<TutorSpeechTelemetry>(telemetry);

  // Olhar vivo direcionado ao aluno (com acompanhamento suave do foco/cursor)
  const studentGazeRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Agendador de piscadas naturais dos olhos digitais azuis
  const blinkStateRef = useRef<{
    nextBlinkTime: number;
    blinkEndTime: number;
    isDoubleBlink: boolean;
  }>({
    nextBlinkTime: 2.0,
    blinkEndTime: 0,
    isDoubleBlink: false,
  });

  // Sincronização em tempo real com o estado do TTS (voiceService)
  useEffect(() => {
    const unsubscribe = subscribeToTutorSpeechTelemetry((nextTelemetry) => {
      telemetryRef.current = nextTelemetry;
      setTelemetry(nextTelemetry);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const isSpeakingNow =
    telemetry.isSpeaking ||
    (animationState ? animationState === "ativo" : isAiSpeaking) ||
    status === "respondendo";

  // Estado real do avatar controlado pelo fluxo de conversa e TTS:
  // IDLE = esperando | LISTENING = ouvindo o aluno | THINKING = processando | SPEAKING = respondendo
  const coreState: TutorAvatarCoreState = isSpeakingNow
    ? "SPEAKING"
    : status === "processando"
    ? "THINKING"
    : isListening || status === "escutando"
    ? "LISTENING"
    : "IDLE";

  const effectiveCharacterState: RobotCharacterState =
    coreState === "SPEAKING"
      ? telemetry.characterState === "IDLE"
        ? "SPEAKING"
        : telemetry.characterState
      : coreState;

  const effectiveGesture: ContextualGestureType =
    coreState === "SPEAKING"
      ? telemetry.contextualGesture === "NEUTRAL"
        ? "EXPLAINING"
        : telemetry.contextualGesture
      : "NEUTRAL";

  const liveStateRef = useRef<{
    coreState: TutorAvatarCoreState;
    characterState: RobotCharacterState;
    gesture: ContextualGestureType;
  }>({
    coreState,
    characterState: effectiveCharacterState,
    gesture: effectiveGesture,
  });

  useEffect(() => {
    liveStateRef.current = {
      coreState,
      characterState: effectiveCharacterState,
      gesture: effectiveGesture,
    };
  }, [coreState, effectiveCharacterState, effectiveGesture]);

  // Loop de 60 FPS do Avatar Vivo sobre a imagem oficial 3D do TutorIA
  useEffect(() => {
    let isCancelled = false;
    let animFrameId = 0;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = tutoriaOfficialImg;

    img.onload = () => {
      if (isCancelled || !canvasRef.current) return;

      const engine = new TutoriaLiveAvatarEngine(canvasRef.current, img);
      if (!engine.isReady()) {
        setEngineReady(false);
        return;
      }

      engineRef.current = engine;
      setEngineReady(true);

      let lastTime = performance.now();
      const startOrigin = lastTime;

      const tick = (now: number) => {
        if (isCancelled) return;
        const dtSec = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
        lastTime = now;
        const timeSec = (now - startOrigin) / 1000;

        // Piscadas naturais dos olhos digitais azuis (a cada 2.6s a 5.2s, com ocasionais piscadas duplas)
        const b = blinkStateRef.current;
        let eyeBlinkAmount = 0;
        if (timeSec >= b.nextBlinkTime) {
          b.blinkEndTime = timeSec + 0.16;
          if (b.isDoubleBlink) {
            b.isDoubleBlink = false;
            b.nextBlinkTime = timeSec + 2.8 + Math.random() * 2.5;
          } else if (Math.random() < 0.2) {
            b.isDoubleBlink = true;
            b.nextBlinkTime = timeSec + 0.26;
          } else {
            b.nextBlinkTime = timeSec + 2.6 + Math.random() * 2.6;
          }
        }
        if (timeSec < b.blinkEndTime) {
          const remaining = b.blinkEndTime - timeSec;
          const progress = 1 - remaining / 0.16;
          eyeBlinkAmount = Math.sin(progress * Math.PI);
        }

        const liveTel = telemetryRef.current;
        const {
          coreState: activeCore,
          characterState: activeChar,
          gesture: activeGesture,
        } = liveStateRef.current;

        const fallbackCadence =
          0.45 +
          0.25 * Math.sin(timeSec * 5.8 + liveTel.responseSeed) +
          0.18 * Math.cos(timeSec * 9.2);

        const speechAmplitude =
          activeCore === "SPEAKING"
            ? liveTel.speechAmplitude > 0.04
              ? liveTel.speechAmplitude
              : fallbackCadence
            : 0;

        const targetPose = computeLiveAvatarPose({
          timeSec,
          coreState: activeCore,
          characterState: activeChar,
          gesture: activeGesture,
          speechAmplitude,
          isInNaturalPause: liveTel.isInNaturalPause,
          progressRatio: liveTel.progressRatio,
          gestureVariant: liveTel.gestureVariant,
          responseSeed: liveTel.responseSeed,
          eyeBlinkAmount,
          studentGazeX: studentGazeRef.current.x,
          studentGazeY: studentGazeRef.current.y,
        });

        currentPoseRef.current = interpolateLivePose(
          currentPoseRef.current,
          targetPose,
          dtSec
        );
        engine.renderFrame(currentPoseRef.current);

        animFrameId = window.requestAnimationFrame(tick);
      };

      animFrameId = window.requestAnimationFrame(tick);
    };

    return () => {
      isCancelled = true;
      if (animFrameId) window.cancelAnimationFrame(animFrameId);
      if (engineRef.current) {
        engineRef.current.dispose();
        engineRef.current = null;
      }
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
    const ny = ((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1;
    studentGazeRef.current = {
      x: Math.max(-1, Math.min(1, nx)),
      y: Math.max(-1, Math.min(1, ny)),
    };
  };

  const handleMouseLeave = () => {
    studentGazeRef.current = { x: 0, y: 0 };
  };

  const imgStateClass =
    coreState === "SPEAKING"
      ? "tutoria-img-talking"
      : coreState === "THINKING"
      ? "tutoria-img-thinking"
      : coreState === "LISTENING"
      ? "tutoria-img-listening"
      : "tutoria-img-idle";

  return (
    <div
      data-avatar-state={coreState}
      data-character-state={effectiveCharacterState}
      data-contextual-gesture={effectiveGesture}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full flex flex-col items-center justify-center bg-[#060d1f] select-none overflow-hidden"
    >
      {/* Palco de videochamada FaceTime: TutorIA grande, centralizado e em corpo inteiro sem molduras que alterem seu visual */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-2 sm:p-4">
        <div className="relative h-full max-h-[640px] aspect-square flex items-center justify-center mx-auto">
          {/* Imagem 3D oficial de referência (mantida 100% fiel ao arquivo original) */}
          <img
            src={tutoriaOfficialImg}
            alt="TutorIA - Professor Virtual 3D"
            referrerPolicy="no-referrer"
            data-state={coreState}
            className={`tutoria-img-base ${imgStateClass} w-full h-full object-contain mx-auto transition-opacity duration-150 ${
              engineReady ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          />

          {/* Avatar Vivo em 60 FPS renderizando exatamente a imagem oficial do TutorIA com olhos, cabeça, mãos, braços e postura sincronizados */}
          <canvas
            ref={canvasRef}
            width={960}
            height={960}
            className={`absolute inset-0 w-full h-full object-contain mx-auto transition-opacity duration-150 ${
              engineReady ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          />
        </div>
      </div>

      {/* Legenda / Subtítulo ao vivo na frente do TutorIA (fala do aluno em LISTENING ou legenda progressiva do TutorIA em SPEAKING) */}
      {liveStudentTranscript && coreState === "LISTENING" ? (
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-20 max-w-lg px-4 py-2 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-sky-500/30 text-xs text-sky-100 shadow-lg text-center pointer-events-none">
          <span className="text-sky-400 font-bold mr-1.5">Você:</span>
          <span>“{liveStudentTranscript}”</span>
        </div>
      ) : (
        (liveAiSubtitle || telemetry.fullText) &&
        coreState === "SPEAKING" && (
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-20 max-w-xl w-[90%] sm:w-auto px-4 py-2.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-emerald-500/40 text-xs text-emerald-100 shadow-xl text-center pointer-events-none line-clamp-3">
            <span className="text-emerald-400 font-bold mr-1.5">TutorIA:</span>
            <span>{liveAiSubtitle || telemetry.fullText}</span>
          </div>
        )
      )}
    </div>
  );
};
