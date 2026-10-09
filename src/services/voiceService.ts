/**
 * Voice Service: Síntese de Voz (TTS) Neural, Sincronização de Gesticulação em Tempo Real
 * do Avatar TutorIA (IDLE, LISTENING, THINKING, SPEAKING) & Reconhecimento de Voz Contínuo
 */

export type TutorAvatarCoreState =
  | "IDLE"
  | "LISTENING"
  | "THINKING"
  | "SPEAKING";

export type RobotCharacterState =
  | "IDLE"
  | "LISTENING"
  | "THINKING"
  | "TALKING"
  | "SPEAKING"
  | "EXCITED"
  | "SUCCESS"
  | "CONFUSED";

export type ContextualGestureType =
  | "NEUTRAL"
  | "INTRODUCING"
  | "EXPLAINING"
  | "HIGHLIGHTING"
  | "QUESTIONING"
  | "ANSWERING"
  | "CONCLUDING";

export interface TutorSpeechTelemetry {
  isSpeaking: boolean;
  characterState: RobotCharacterState;
  contextualGesture: ContextualGestureType;
  speechAmplitude: number; // 0.0 a 1.0 (intensidade fonética em tempo real com pausas naturais)
  isInNaturalPause: boolean; // true durante vírgulas/pausas respiratórias entre frases
  currentWord: string;
  progressRatio: number; // 0.0 a 1.0
  gestureVariant: number; // 0..5 (varia os gestos ao longo da explicação e entre respostas)
  responseSeed: number; // Semente única por resposta para nunca repetir o mesmo loop
  fullText: string;
}

type SpeechTelemetryListener = (telemetry: TutorSpeechTelemetry) => void;

const telemetryListeners = new Set<SpeechTelemetryListener>();

let responseCounter = 1;

let currentTelemetry: TutorSpeechTelemetry = {
  isSpeaking: false,
  characterState: "IDLE",
  contextualGesture: "NEUTRAL",
  speechAmplitude: 0,
  isInNaturalPause: false,
  currentWord: "",
  progressRatio: 0,
  gestureVariant: 0,
  responseSeed: 1,
  fullText: "",
};

let activeCadenceInterval: number | null = null;

function notifyTelemetry(partial: Partial<TutorSpeechTelemetry>) {
  currentTelemetry = { ...currentTelemetry, ...partial };
  telemetryListeners.forEach((listener) => {
    try {
      listener(currentTelemetry);
    } catch {}
  });
}

export function subscribeToTutorSpeechTelemetry(
  listener: SpeechTelemetryListener
): () => void {
  telemetryListeners.add(listener);
  listener(currentTelemetry);
  return () => {
    telemetryListeners.delete(listener);
  };
}

export function getTutorSpeechTelemetry(): TutorSpeechTelemetry {
  return currentTelemetry;
}

/**
 * Classifica o gesto contextual e a intenção pedagógica a partir do trecho que o TutorIA está falando
 */
export function analyzeTextGestureAndState(
  fullText: string,
  charIndex: number,
  progressRatio: number,
  stepCounter: number,
  responseSeed: number
): {
  characterState: RobotCharacterState;
  contextualGesture: ContextualGestureType;
} {
  const lowerFull = (fullText || "").toLowerCase();

  // Janela ao redor da cláusula atual sendo pronunciada
  const windowStart = Math.max(0, charIndex - 32);
  const windowEnd = Math.min(fullText.length, charIndex + 88);
  const activeClause = fullText.slice(windowStart, windowEnd).toLowerCase();

  const isSuccess =
    /\b(parabens|parabéns|correto|exato|exatamente|muito bem|acertou|perfeito|excelente)\b/i.test(
      activeClause
    );
  const isExcited =
    /\b(incrivel|incrível|fantastico|fantástico|maravilha|fascinante|surpreendente|vamos la|vamos lá)\b/i.test(
      activeClause
    ) ||
    (activeClause.includes("!") && progressRatio < 0.45);
  const isQuestioning =
    activeClause.includes("?") ||
    /\b(por que|porque|como voce|como você|qual e|qual é|o que acha|voce ja|você já|percebeu|reparou|consegue ver|faz sentido)\b/i.test(
      activeClause
    );
  const isHighlighting =
    /\b(importante|atencao|atenção|fundamental|essencial|chave|fórmula|formula|regra|note que|observe|destaque|lembre-se|ponto principal|repare)\b/i.test(
      activeClause
    );
  const isConcluding =
    progressRatio > 0.85 ||
    /\b(portanto|em resumo|concluindo|dessa forma|assim|por fim|finalizando|resumindo)\b/i.test(
      activeClause
    );
  const isIntroducing =
    progressRatio < 0.14 ||
    /\b(vamos iniciar|primeiro|para comecar|para começar|introducao|introdução|conceito de|imagine que|olá|ola)\b/i.test(
      activeClause
    );

  let contextualGesture: ContextualGestureType = "EXPLAINING";
  if (isQuestioning) {
    contextualGesture = "QUESTIONING";
  } else if (isConcluding) {
    contextualGesture = "CONCLUDING";
  } else if (isHighlighting) {
    contextualGesture = "HIGHLIGHTING";
  } else if (isIntroducing) {
    contextualGesture = "INTRODUCING";
  } else {
    // Sequência variada por resposta para que cada explicação combine diferentes gestos de professor
    const gestureCycles: ContextualGestureType[][] = [
      ["EXPLAINING", "ANSWERING", "HIGHLIGHTING", "EXPLAINING", "QUESTIONING"],
      ["ANSWERING", "EXPLAINING", "HIGHLIGHTING", "ANSWERING", "EXPLAINING"],
      ["EXPLAINING", "HIGHLIGHTING", "EXPLAINING", "ANSWERING", "HIGHLIGHTING"],
    ];
    const selectedCycle = gestureCycles[responseSeed % gestureCycles.length];
    contextualGesture = selectedCycle[stepCounter % selectedCycle.length];
  }

  let characterState: RobotCharacterState = "SPEAKING";
  if (isSuccess) {
    characterState = "SUCCESS";
  } else if (isExcited) {
    characterState = "EXCITED";
  } else if (
    isQuestioning &&
    /\b(duvida|dúvida|dificil|difícil|confuso|ajuda)\b/i.test(lowerFull)
  ) {
    characterState = "CONFUSED";
  }

  return { characterState, contextualGesture };
}

/**
 * Calcula a energia fonética (0.0 a 1.0) e detecta se a palavra precede uma pausa natural de pontuação
 */
function computeWordPhoneticProfile(wordWithPunct: string): {
  energy: number;
  hasPauseAfter: boolean;
} {
  const raw = (wordWithPunct || "").trim();
  if (!raw) return { energy: 0.25, hasPauseAfter: false };

  const hasPauseAfter = /[.,!?;:]$/.test(raw);
  const clean = raw.replace(/[.,!?;:]/g, "");
  if (!clean) return { energy: 0.2, hasPauseAfter: true };

  const vowels = (clean.match(/[aeiouáéíóúâêôãõ]/gi) || []).length;
  const hasAccent = /[áéíóúâêôãõ!]/i.test(raw);
  const lengthFactor = Math.min(1, clean.length / 9);
  const vowelFactor = Math.min(1, vowels / 4);
  const base =
    0.36 +
    lengthFactor * 0.28 +
    vowelFactor * 0.24 +
    (hasAccent ? 0.12 : 0);

  return {
    energy: Math.min(1, Math.max(0.22, base)),
    hasPauseAfter,
  };
}

// Cache para vozes carregadas assincronamente
let cachedVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

/**
 * Busca a melhor voz neural disponível no navegador com ênfase em vozes naturais brasileiras (pt-BR)
 */
export function getBestPortugueseVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return null;
  }

  const voices =
    cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const topNeuralVoices = [
    "francisca",
    "antonio",
    "google português do brasil",
    "natural",
    "neural",
    "luciana",
    "camila",
    "leticia",
    "letícia",
    "heloisa",
    "heloísa",
    "brenda",
    "daniel",
  ];

  for (const keyword of topNeuralVoices) {
    const found = voices.find(
      (v) =>
        v.lang.replace("_", "-").toLowerCase().startsWith("pt") &&
        v.name.toLowerCase().includes(keyword)
    );
    if (found) return found;
  }

  const ptBrVoice = voices.find((v) =>
    v.lang.replace("_", "-").toLowerCase().includes("pt-br")
  );
  if (ptBrVoice) return ptBrVoice;

  return voices.find((v) => v.lang.toLowerCase().startsWith("pt")) || null;
}

export interface SpeakOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (e: any) => void;
  onBoundary?: (telemetry: TutorSpeechTelemetry) => void;
}

/**
 * Limpa e humaniza o texto para síntese natural sem tropeços ou pontuações robóticas
 */
function cleanAndHumanizeText(rawText: string): string {
  return rawText
    .replace(/[*#_`~>\[\]]/g, "")
    .replace(/\(.*?\)/g, "")
    .replace(/\bTutorIA\b/gi, "Tutor I A")
    .replace(/\bProfeIA\b/gi, "Profe I A")
    .replace(/\bSQL\b/g, "S Q L")
    .replace(/\bDDL\b/g, "D D L")
    .replace(/\bDML\b/g, "D M L")
    .replace(/\bCPU\b/g, "C P U")
    .replace(/\bIPCA\b/g, "I P C A")
    .replace(/\bVAD\b/gi, "V A D")
    .replace(/\bTTS\b/gi, "T T S")
    .replace(/\.{2,}/g, ".")
    .replace(/!{2,}/g, "!")
    .replace(/\?{2,}/g, "?")
    .replace(/([.,!?;:])/g, "$1 ")
    .replace(/\s+/g, " ")
    .trim();
}

function stopCadenceLoop() {
  if (activeCadenceInterval !== null && typeof window !== "undefined") {
    window.clearInterval(activeCadenceInterval);
    activeCadenceInterval = null;
  }
}

/**
 * Executa a síntese de voz usando configurações de TTS neural humano a 1.2x
 * e transmite telemetria em tempo real (amplitude, pausas naturais, palavras e gestos contextuais)
 * para o avatar interativo TutorIA.
 */
export function speakNaturalVoice(
  text: string,
  options: SpeakOptions = {}
): () => void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    options.onEnd?.();
    return () => {};
  }

  stopCadenceLoop();
  try {
    window.speechSynthesis.cancel();
  } catch (e) {}

  const cleanText = cleanAndHumanizeText(text);
  const currentSeed = ++responseCounter;

  if (!cleanText) {
    notifyTelemetry({
      isSpeaking: false,
      characterState: "IDLE",
      contextualGesture: "NEUTRAL",
      speechAmplitude: 0,
      isInNaturalPause: false,
      currentWord: "",
      progressRatio: 0,
      responseSeed: currentSeed,
    });
    options.onEnd?.();
    return () => {};
  }

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = "pt-BR";

  let targetRate = 1.2;
  if (typeof window !== "undefined") {
    try {
      const savedRate = parseFloat(
        localStorage.getItem("profeia_tutoria_voice_speed") || "1.2"
      );
      if (!isNaN(savedRate) && savedRate > 0) targetRate = savedRate;
    } catch (e) {}
  }
  utterance.rate = options.rate ?? targetRate;
  utterance.pitch = options.pitch ?? 1.0;
  utterance.volume = options.volume ?? 1.0;

  const bestVoice = getBestPortugueseVoice();
  if (bestVoice) {
    utterance.voice = bestVoice;
  }

  const rawWords = cleanText.split(/\s+/).filter(Boolean);
  const estimatedDurationMs = Math.max(
    1800,
    (rawWords.length / (2.85 * utterance.rate)) * 1000
  );
  let startTime = Date.now();
  let lastBoundaryTime = 0;
  let stepCounter = 0;
  let pauseUntilTime = 0;

  const finishSpeechTelemetry = () => {
    stopCadenceLoop();
    notifyTelemetry({
      isSpeaking: false,
      characterState: "IDLE",
      contextualGesture: "NEUTRAL",
      speechAmplitude: 0,
      isInNaturalPause: false,
      currentWord: "",
      progressRatio: 1,
    });
  };

  utterance.onstart = () => {
    startTime = Date.now();
    stepCounter = 0;
    const initial = analyzeTextGestureAndState(
      cleanText,
      0,
      0,
      0,
      currentSeed
    );
    notifyTelemetry({
      isSpeaking: true,
      characterState: initial.characterState,
      contextualGesture: initial.contextualGesture,
      speechAmplitude: 0.52,
      isInNaturalPause: false,
      currentWord: (rawWords[0] || "").replace(/[.,!?;:]/g, ""),
      progressRatio: 0,
      gestureVariant: currentSeed % 6,
      responseSeed: currentSeed,
      fullText: cleanText,
    });
    options.onStart?.();

    // Loop de cadência contínua a cada 75ms para sincronizar sílabas, pausas respiratórias e alternância de gestos
    activeCadenceInterval = window.setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        return;
      }
      const now = Date.now();
      const elapsed = now - startTime;
      const ratio = Math.min(0.99, elapsed / estimatedDurationMs);
      const inPause = now < pauseUntilTime;

      if (now - lastBoundaryTime > 280) {
        const approxCharIndex = Math.floor(ratio * cleanText.length);
        const approxWordIdx = Math.min(
          rawWords.length - 1,
          Math.floor(ratio * rawWords.length)
        );
        const rawWord = rawWords[approxWordIdx] || "";
        const profile = computeWordPhoneticProfile(rawWord);

        // Se encontrou pontuação, agenda uma breve pausa natural de respiração/fraseado
        if (profile.hasPauseAfter && now > pauseUntilTime + 400) {
          pauseUntilTime = now + 210;
        }

        const gestureStep = Math.floor(elapsed / 2100);
        if (gestureStep !== stepCounter) {
          stepCounter = gestureStep;
        }

        const analysis = analyzeTextGestureAndState(
          cleanText,
          approxCharIndex,
          ratio,
          stepCounter,
          currentSeed
        );

        const syllableWave =
          0.5 +
          0.32 * Math.sin(elapsed * 0.015 + currentSeed) +
          0.18 * Math.cos(elapsed * 0.031);

        const rawAmp = inPause
          ? 0.12
          : Math.min(
              1,
              Math.max(0.18, profile.energy * 0.65 + syllableWave * 0.35)
            );

        notifyTelemetry({
          isSpeaking: true,
          characterState: analysis.characterState,
          contextualGesture: analysis.contextualGesture,
          speechAmplitude: Number(rawAmp.toFixed(3)),
          isInNaturalPause: inPause,
          currentWord: rawWord.replace(/[.,!?;:]/g, ""),
          progressRatio: Number(ratio.toFixed(3)),
          gestureVariant: (stepCounter + currentSeed) % 6,
          responseSeed: currentSeed,
        });
      }
    }, 75);
  };

  utterance.onboundary = (event: SpeechSynthesisEvent) => {
    lastBoundaryTime = Date.now();
    const charIndex = event.charIndex || 0;
    const ratio = Math.min(0.99, charIndex / Math.max(1, cleanText.length));
    const remaining = cleanText.slice(charIndex);
    const rawToken = remaining.split(/\s+/)[0] || "";
    const profile = computeWordPhoneticProfile(rawToken);

    if (profile.hasPauseAfter) {
      pauseUntilTime = lastBoundaryTime + 190;
    }

    const elapsed = lastBoundaryTime - startTime;
    stepCounter = Math.floor(elapsed / 2000);

    const analysis = analyzeTextGestureAndState(
      cleanText,
      charIndex,
      ratio,
      stepCounter,
      currentSeed
    );

    notifyTelemetry({
      isSpeaking: true,
      characterState: analysis.characterState,
      contextualGesture: analysis.contextualGesture,
      speechAmplitude: profile.energy,
      isInNaturalPause: false,
      currentWord: rawToken.replace(/[.,!?;:]/g, ""),
      progressRatio: Number(ratio.toFixed(3)),
      gestureVariant: (stepCounter + currentSeed) % 6,
      responseSeed: currentSeed,
    });
    options.onBoundary?.(currentTelemetry);
  };

  utterance.onend = () => {
    finishSpeechTelemetry();
    options.onEnd?.();
  };

  utterance.onerror = (e) => {
    finishSpeechTelemetry();
    if (e.error !== "canceled" && e.error !== "interrupted") {
      console.warn("TTS Notice:", e);
    }
    options.onError?.(e);
  };

  window.speechSynthesis.speak(utterance);

  return () => {
    finishSpeechTelemetry();
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  };
}

export interface VadRecognitionOptions {
  onTranscript?: (spokenText: string) => void;
  onFinalTranscript?: (spokenText: string) => void;
  onStartListening?: () => void;
  onStopListening?: () => void;
  onError?: (err: string) => void;
  silenceThresholdMs?: number;
}

/**
 * Inicia escuta com Detecção de Atividade de Voz (VAD Inteligente)
 */
export function startVadSpeechRecognition(options: VadRecognitionOptions): {
  stop: () => void;
} {
  if (typeof window === "undefined") {
    options.onError?.("Ambiente sem suporte a áudio.");
    return { stop: () => {} };
  }

  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    options.onError?.("Reconhecimento de voz não suportado neste navegador.");
    return { stop: () => {} };
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "pt-BR";
  recognition.continuous = false;
  recognition.interimResults = true;

  let silenceThreshold = options.silenceThresholdMs ?? 1200;
  if (typeof window !== "undefined") {
    try {
      const savedTimeout = parseInt(
        localStorage.getItem("profeia_vad_timeout") || "1200",
        10
      );
      if (
        !isNaN(savedTimeout) &&
        savedTimeout >= 1000 &&
        savedTimeout <= 1500
      ) {
        silenceThreshold = savedTimeout;
      }
    } catch (e) {}
  }
  silenceThreshold = Math.min(1500, Math.max(1000, silenceThreshold));

  let finalTranscript = "";
  let silenceTimer: any = null;
  let isClosed = false;

  const closeMicAndSubmit = (text: string) => {
    if (isClosed) return;
    isClosed = true;

    if (silenceTimer) {
      clearTimeout(silenceTimer);
      silenceTimer = null;
    }

    try {
      recognition.stop();
    } catch (e) {}

    options.onStopListening?.();

    const trimmed = text.trim();
    if (trimmed.length > 1) {
      options.onTranscript?.(trimmed);
      options.onFinalTranscript?.(trimmed);
    }
  };

  recognition.onstart = () => {
    isClosed = false;
    options.onStartListening?.();
  };

  recognition.onresult = (event: any) => {
    if (isClosed) return;

    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const item = event.results[i];
      if (item.isFinal) {
        finalTranscript += item[0].transcript + " ";
      } else {
        interim += item[0].transcript;
      }
    }

    const currentSpoken = (finalTranscript + interim).trim();

    if (currentSpoken) {
      options.onTranscript?.(currentSpoken);
    }

    if (silenceTimer) clearTimeout(silenceTimer);

    if (currentSpoken.length > 1) {
      silenceTimer = setTimeout(() => {
        closeMicAndSubmit(currentSpoken);
      }, silenceThreshold);
    }
  };

  recognition.onerror = (event: any) => {
    if (silenceTimer) clearTimeout(silenceTimer);
    isClosed = true;
    if (event.error !== "no-speech") {
      options.onError?.(event.error);
    }
    options.onStopListening?.();
  };

  recognition.onend = () => {
    if (silenceTimer) clearTimeout(silenceTimer);
    if (!isClosed && finalTranscript.trim().length > 1) {
      closeMicAndSubmit(finalTranscript.trim());
    } else {
      isClosed = true;
      options.onStopListening?.();
    }
  };

  try {
    recognition.start();
  } catch (err: any) {
    options.onError?.(err?.message || "Erro ao iniciar microfone");
    return { stop: () => {} };
  }

  return {
    stop: () => {
      isClosed = true;
      if (silenceTimer) clearTimeout(silenceTimer);
      try {
        recognition.stop();
      } catch (e) {}
      options.onStopListening?.();
    },
  };
}
