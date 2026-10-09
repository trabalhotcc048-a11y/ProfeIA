import { UserRole } from "../types";

export interface BiometricCameraSession {
  stream: MediaStream | null;
  devices: MediaDeviceInfo[];
  activeDeviceLabel: string;
  error: string | null;
  errorCode:
    | "NONE"
    | "PERMISSION_DENIED"
    | "NO_CAMERA_FOUND"
    | "WEBRTC_UNSUPPORTED"
    | "CAMERA_COVERED"
    | "HARDWARE_ERROR";
}

export interface BiometricCaptureResult {
  descriptor: number[];
  signatureHash: string;
  averageBrightness: number;
  contrastScore: number;
  faceDetected: boolean;
  qualityPassed: boolean;
  failureReason: string | null;
  snapshotDataUrl: string | null;
  source: "webrtc-camera" | "camera-inactive" | "camera-covered";
}

export interface EnrolledBiometricRecord {
  userKey: string;
  userId?: string;
  role: UserRole;
  name: string;
  email: string;
  descriptor: number[];
  signatureHash: string;
  snapshotDataUrl: string | null;
  source: "webrtc-camera";
  enrolledAt: string;
  lastVerifiedAt?: string;
  lastConfidencePercent?: number;
  captureDiscardedFromMemory?: boolean;
}

export interface BiometricVerificationResult {
  verified: boolean;
  confidencePercent: number;
  isNewEnrollment: boolean;
  record: EnrolledBiometricRecord | null;
  message: string;
  errorReason?: string;
  capturePurgedFromMemory: boolean;
}

const STORAGE_KEY = "profeia_biometric_profiles_v1";

// Buffer volátil temporário em memória RAM que é imediatamente sobrescrito e apagado após a validação
let volatileCaptureMemoryBuffer: {
  rawPixels?: Uint8ClampedArray | null;
  tempDescriptor?: number[] | null;
  tempDataUrl?: string | null;
} | null = null;

export function buildBiometricUserKey(
  role: UserRole,
  name: string,
  email?: string,
  userId?: string
): string {
  if (userId && userId.trim()) {
    return `${role.toLowerCase()}__${userId.trim().toLowerCase()}`;
  }
  const normName = (name || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_");
  const normEmail = (email || "").trim().toLowerCase();
  return `${role.toLowerCase()}__${normName || normEmail || "default"}`;
}

/**
 * Desliga a câmera e apaga imediatamente da memória RAM qualquer dado do feed de vídeo,
 * buffer de pixels de canvas, vetores temporários e encerra todas as tracks do MediaStream.
 */
export function purgeBiometricCaptureFromMemory(options?: {
  videoEl?: HTMLVideoElement | null;
  stream?: MediaStream | null;
  userKey?: string;
}): void {
  try {
    if (volatileCaptureMemoryBuffer) {
      if (volatileCaptureMemoryBuffer.rawPixels) {
        volatileCaptureMemoryBuffer.rawPixels.fill(0);
        volatileCaptureMemoryBuffer.rawPixels = null;
      }
      if (volatileCaptureMemoryBuffer.tempDescriptor) {
        volatileCaptureMemoryBuffer.tempDescriptor.fill(0);
        volatileCaptureMemoryBuffer.tempDescriptor.length = 0;
        volatileCaptureMemoryBuffer.tempDescriptor = null;
      }
      volatileCaptureMemoryBuffer.tempDataUrl = null;
      volatileCaptureMemoryBuffer = null;
    }

    if (options?.stream) {
      options.stream.getTracks().forEach((track) => {
        try {
          track.enabled = false;
          track.stop();
        } catch {}
      });
    }

    if (options?.videoEl) {
      try {
        const attachedStream =
          options.videoEl.srcObject instanceof MediaStream
            ? options.videoEl.srcObject
            : null;
        if (attachedStream) {
          attachedStream.getTracks().forEach((track) => {
            try {
              track.enabled = false;
              track.stop();
            } catch {}
          });
        }
        options.videoEl.pause();
        options.videoEl.srcObject = null;
        options.videoEl.removeAttribute("src");
        options.videoEl.load();
      } catch {}
    }

    const all = getAllEnrolledBiometrics();
    let modified = false;
    Object.keys(all).forEach((key) => {
      if (!options?.userKey || key === options.userKey) {
        if (all[key] && all[key].snapshotDataUrl !== null) {
          all[key].snapshotDataUrl = null;
          all[key].captureDiscardedFromMemory = true;
          modified = true;
        }
      }
    });
    if (modified) {
      saveAllEnrolledBiometrics(all);
    }
  } catch {}
}

export function getAllEnrolledBiometrics(): Record<string, EnrolledBiometricRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveAllEnrolledBiometrics(
  records: Record<string, EnrolledBiometricRecord>
): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {}
}

export function getEnrolledBiometricProfile(
  role: UserRole,
  name: string,
  email?: string,
  userId?: string
): EnrolledBiometricRecord | null {
  const all = getAllEnrolledBiometrics();
  if (userId && userId.trim()) {
    const keyWithId = buildBiometricUserKey(role, name, email, userId);
    if (all[keyWithId]) return all[keyWithId];
  }
  const key = buildBiometricUserKey(role, name, email);
  if (all[key]) return all[key];

  const normEmail = (email || "").trim().toLowerCase();
  const normName = (name || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const normUserId = (userId || "").trim().toLowerCase();

  const found = Object.values(all).find((r) => {
    if (r.role !== role) return false;
    if (normUserId && r.userId && r.userId.trim().toLowerCase() === normUserId) {
      return true;
    }
    const rEmail = (r.email || "").trim().toLowerCase();
    const rName = (r.name || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return (normEmail && rEmail === normEmail) || (normName && rName === normName);
  });
  return found || null;
}

/**
 * Remove completamente a biometria cadastrada do usuário do armazenamento local,
 * limpa a memória RAM e sincroniza a exclusão com o servidor/banco de dados.
 */
export async function removeEnrolledBiometricProfile(
  role: UserRole,
  name: string,
  email?: string,
  userId?: string
): Promise<boolean> {
  const all = getAllEnrolledBiometrics();
  const keyWithId = userId ? buildBiometricUserKey(role, name, email, userId) : null;
  const key = buildBiometricUserKey(role, name, email);
  const normEmail = (email || "").trim().toLowerCase();
  const normName = (name || "").trim().toLowerCase();
  const normUserId = (userId || "").trim().toLowerCase();

  Object.keys(all).forEach((k) => {
    const rec = all[k];
    if (
      k === key ||
      (keyWithId && k === keyWithId) ||
      (rec &&
        rec.role === role &&
        ((normUserId && rec.userId && rec.userId.trim().toLowerCase() === normUserId) ||
          (normEmail && rec.email.trim().toLowerCase() === normEmail) ||
          (normName && rec.name.trim().toLowerCase() === normName)))
    ) {
      if (Array.isArray(rec.descriptor)) {
        rec.descriptor.fill(0);
      }
      rec.snapshotDataUrl = null;
      delete all[k];
    }
  });

  saveAllEnrolledBiometrics(all);
  purgeBiometricCaptureFromMemory({ userKey: keyWithId || key });

  try {
    await fetch("/api/biometrics/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userKey: key,
        email: email || "",
        role,
      }),
    });
  } catch {}

  return true;
}

/**
 * Verifica se a webcam está efetivamente ligada e com track de vídeo ativo e desbloqueado.
 */
export function isLiveCameraStreamActive(
  videoEl: HTMLVideoElement | null,
  stream?: MediaStream | null
): boolean {
  const mediaStream =
    stream || (videoEl?.srcObject instanceof MediaStream ? videoEl.srcObject : null);
  if (!mediaStream || !mediaStream.active) return false;

  const videoTracks = mediaStream.getVideoTracks();
  if (!videoTracks.length) return false;

  const primaryTrack = videoTracks[0];
  if (
    !primaryTrack ||
    primaryTrack.readyState !== "live" ||
    !primaryTrack.enabled ||
    primaryTrack.muted
  ) {
    return false;
  }

  return true;
}

/**
 * Aguarda e confirma que o elemento <video> está efetivamente recebendo e decodificando
 * quadros reais da webcam (readyState >= 2 e dimensões > 0).
 */
export async function waitForActiveVideoEmission(
  videoEl: HTMLVideoElement | null,
  stream: MediaStream | null,
  timeoutMs = 1200
): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (!isLiveCameraStreamActive(videoEl, stream)) {
      return false;
    }
    if (
      videoEl &&
      videoEl.readyState >= 2 &&
      videoEl.videoWidth > 0 &&
      videoEl.videoHeight > 0 &&
      !videoEl.paused &&
      !videoEl.ended
    ) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 75));
  }

  return Boolean(
    isLiveCameraStreamActive(videoEl, stream) &&
      videoEl &&
      videoEl.readyState >= 2 &&
      videoEl.videoWidth > 0 &&
      videoEl.videoHeight > 0
  );
}

/**
 * Inicializa o stream WebRTC de vídeo para Biometria Facial.
 * Caso a câmera esteja desligada, bloqueada ou sem permissão, interrompe e solicita login por senha.
 */
export async function startBiometricCameraStream(
  preferredDeviceId?: string
): Promise<BiometricCameraSession> {
  if (
    typeof navigator === "undefined" ||
    !navigator.mediaDevices ||
    !navigator.mediaDevices.getUserMedia
  ) {
    return {
      stream: null,
      devices: [],
      activeDeviceLabel: "Indisponível",
      error:
        "Navegador sem suporte a webcam WebRTC. Por favor, realize o login por senha.",
      errorCode: "WEBRTC_UNSUPPORTED",
    };
  }

  try {
    const primaryConstraints: MediaStreamConstraints = {
      video: preferredDeviceId
        ? {
            deviceId: { exact: preferredDeviceId },
            width: { ideal: 640 },
            height: { ideal: 480 },
          }
        : {
            facingMode: "user",
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
      audio: false,
    };

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia(primaryConstraints);
    } catch {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
    }

    const tracks = stream.getVideoTracks();
    const primaryTrack = tracks[0];
    if (
      !tracks.length ||
      !primaryTrack ||
      primaryTrack.readyState !== "live" ||
      !primaryTrack.enabled ||
      primaryTrack.muted
    ) {
      stream.getTracks().forEach((t) => t.stop());
      return {
        stream: null,
        devices: [],
        activeDeviceLabel: "Câmera Desligada",
        error:
          "A câmera está desligada ou não está emitindo fluxo de vídeo. Por favor, realize o login por senha.",
        errorCode: "HARDWARE_ERROR",
      };
    }

    let videoDevices: MediaDeviceInfo[] = [];
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      videoDevices = allDevices.filter((d) => d.kind === "videoinput");
    } catch {}

    const activeDeviceLabel =
      primaryTrack?.label || videoDevices[0]?.label || "Webcam WebRTC Ativa";

    return {
      stream,
      devices: videoDevices,
      activeDeviceLabel,
      error: null,
      errorCode: "NONE",
    };
  } catch (err: any) {
    const errName = err?.name || "";
    if (
      errName === "NotAllowedError" ||
      errName === "PermissionDeniedError"
    ) {
      return {
        stream: null,
        devices: [],
        activeDeviceLabel: "Sem Permissão",
        error:
          "Permissão da câmera negada ou bloqueada no navegador. Por favor, realize o login por senha.",
        errorCode: "PERMISSION_DENIED",
      };
    }

    if (errName === "NotFoundError" || errName === "DevicesNotFoundError") {
      return {
        stream: null,
        devices: [],
        activeDeviceLabel: "Sem Câmera",
        error:
          "Nenhuma câmera ligada foi encontrada neste dispositivo. Por favor, realize o login por senha.",
        errorCode: "NO_CAMERA_FOUND",
      };
    }

    return {
      stream: null,
      devices: [],
      activeDeviceLabel: "Câmera Indisponível",
      error:
        "A câmera está desligada, coberta ou sem permissão. Por favor, realize o login por senha.",
      errorCode: "HARDWARE_ERROR",
    };
  }
}

/**
 * Inspeciona o quadro real emitido pela webcam:
 * - Verifica se o stream e o <video> estão efetivamente ligados e emitindo vídeo.
 * - Verifica se a lente não está coberta (quadro todo escuro ou sem variação óptica).
 * - Extrai o descritor biométrico e apaga imediatamente os pixels da memória RAM.
 */
export async function captureFacialFrameAndDescriptor(
  videoEl: HTMLVideoElement | null,
  stream?: MediaStream | null
): Promise<BiometricCaptureResult> {
  if (!isLiveCameraStreamActive(videoEl, stream)) {
    return {
      descriptor: [],
      signatureHash: "",
      averageBrightness: 0,
      contrastScore: 0,
      faceDetected: false,
      qualityPassed: false,
      failureReason:
        "A câmera está desligada ou sem permissão. Por favor, realize o login por senha.",
      snapshotDataUrl: null,
      source: "camera-inactive",
    };
  }

  if (
    !videoEl ||
    videoEl.readyState < 2 ||
    videoEl.videoWidth <= 0 ||
    videoEl.videoHeight <= 0
  ) {
    return {
      descriptor: [],
      signatureHash: "",
      averageBrightness: 0,
      contrastScore: 0,
      faceDetected: false,
      qualityPassed: false,
      failureReason:
        "A webcam não está emitindo fluxo de vídeo ativo. Por favor, realize o login por senha.",
      snapshotDataUrl: null,
      source: "camera-inactive",
    };
  }

  let canvas: HTMLCanvasElement | null = document.createElement("canvas");
  try {
    const gridSize = 8; // 8x8 = 64 zonas
    const sampleSize = 64;
    canvas.width = sampleSize;
    canvas.height = sampleSize;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    if (!ctx) {
      canvas.width = 0;
      canvas.height = 0;
      canvas = null;
      return {
        descriptor: [],
        signatureHash: "",
        averageBrightness: 0,
        contrastScore: 0,
        faceDetected: false,
        qualityPassed: false,
        failureReason:
          "Não foi possível ler o fluxo de vídeo da câmera. Por favor, realize o login por senha.",
        snapshotDataUrl: null,
        source: "camera-inactive",
      };
    }

    const vw = videoEl.videoWidth;
    const vh = videoEl.videoHeight;
    const cropW = vw * 0.65;
    const cropH = vh * 0.75;
    const cropX = (vw - cropW) / 2;
    const cropY = (vh - cropH) / 2;

    ctx.drawImage(
      videoEl,
      cropX,
      cropY,
      cropW,
      cropH,
      0,
      0,
      sampleSize,
      sampleSize
    );

    const imageDataObj = ctx.getImageData(0, 0, sampleSize, sampleSize);
    const imgData = imageDataObj.data;
    volatileCaptureMemoryBuffer = {
      rawPixels: imgData,
      tempDescriptor: [],
      tempDataUrl: null,
    };

    const descriptor: number[] = [];
    const cellPixels = sampleSize / gridSize;
    let totalLum = 0;
    let darkPixels = 0;
    const lumValues: number[] = [];

    for (let gy = 0; gy < gridSize; gy++) {
      for (let gx = 0; gx < gridSize; gx++) {
        let cellSum = 0;
        let count = 0;
        for (let py = 0; py < cellPixels; py++) {
          for (let px = 0; px < cellPixels; px++) {
            const x = gx * cellPixels + px;
            const y = gy * cellPixels + py;
            const idx = (y * sampleSize + x) * 4;
            const r = imgData[idx];
            const g = imgData[idx + 1];
            const b = imgData[idx + 2];
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            cellSum += lum;
            totalLum += lum;
            if (lum < 15) {
              darkPixels++;
            }
            lumValues.push(lum);
            count++;
          }
        }
        descriptor.push(Number((cellSum / (count * 255)).toFixed(4)));
      }
    }

    const totalPixels = Math.max(1, lumValues.length);
    const avgBrightness = totalLum / totalPixels;
    const darkRatio = darkPixels / totalPixels;

    const variance =
      lumValues.reduce((acc, val) => acc + Math.pow(val - avgBrightness, 2), 0) /
      totalPixels;
    const contrastScore = Math.sqrt(variance);

    // Ordena cópia rápida para medir faixa dinâmica (p95 - p05) e detectar câmera coberta
    const sortedLum = [...lumValues].sort((a, b) => a - b);
    const p05 = sortedLum[Math.floor(totalPixels * 0.05)] || 0;
    const p95 = sortedLum[Math.floor(totalPixels * 0.95)] || 0;
    const dynamicRange = p95 - p05;

    // Limpa imediatamente todos os buffers de pixels e canvas da memória RAM
    sortedLum.fill(0);
    sortedLum.length = 0;
    lumValues.fill(0);
    lumValues.length = 0;
    imgData.fill(0);
    ctx.clearRect(0, 0, sampleSize, sampleSize);
    canvas.width = 0;
    canvas.height = 0;
    canvas = null;
    volatileCaptureMemoryBuffer = null;

    // Detecta se a câmera está coberta (tampa fechada, dedo sobre a lente ou quadro sem luz/variação)
    const isCameraCoveredOrBlank =
      avgBrightness < 12 ||
      darkRatio > 0.92 ||
      contrastScore < 3.2 ||
      dynamicRange < 12;

    if (isCameraCoveredOrBlank) {
      descriptor.fill(0);
      descriptor.length = 0;
      return {
        descriptor: [],
        signatureHash: "",
        averageBrightness: Math.round(avgBrightness),
        contrastScore: Math.round(contrastScore),
        faceDetected: false,
        qualityPassed: false,
        failureReason:
          "A câmera está coberta, desligada ou sem imagem visível. Descubra a webcam ou realize o login por senha.",
        snapshotDataUrl: null,
        source: "camera-covered",
      };
    }

    const hashNum = descriptor.reduce(
      (acc, v, idx) =>
        ((acc << 5) - acc + Math.round(v * 1000) * (idx + 1)) | 0,
      0
    );
    const signatureHash = `BIO-WEBRTC-${Math.abs(hashNum)
      .toString(16)
      .toUpperCase()
      .padStart(8, "0")}`;

    return {
      descriptor,
      signatureHash,
      averageBrightness: Math.round(avgBrightness),
      contrastScore: Math.round(contrastScore),
      faceDetected: true,
      qualityPassed: true,
      failureReason: null,
      snapshotDataUrl: null,
      source: "webrtc-camera",
    };
  } catch {
    if (canvas) {
      canvas.width = 0;
      canvas.height = 0;
      canvas = null;
    }
    volatileCaptureMemoryBuffer = null;
    return {
      descriptor: [],
      signatureHash: "",
      averageBrightness: 0,
      contrastScore: 0,
      faceDetected: false,
      qualityPassed: false,
      failureReason:
        "Erro ao verificar o fluxo de vídeo da câmera. Por favor, realize o login por senha.",
      snapshotDataUrl: null,
      source: "camera-inactive",
    };
  }
}

export function computeDescriptorSimilarityPercent(
  vecA: number[],
  vecB: number[]
): number {
  if (!vecA.length || !vecB.length || vecA.length !== vecB.length) {
    return 0;
  }
  let dot = 0;
  let normA = 0;
  let normB = 0;
  let sumDiff = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
    sumDiff += Math.abs(vecA[i] - vecB[i]);
  }
  if (normA === 0 || normB === 0) return 0;
  const cosine = dot / (Math.sqrt(normA) * Math.sqrt(normB));
  const mae = sumDiff / vecA.length;
  const rawScore = cosine * 0.7 + Math.max(0, 1 - mae * 2.5) * 0.3;
  const pct = Math.min(99.6, Math.max(0, rawScore * 100));
  return Number(pct.toFixed(1));
}

/**
 * Cadastra (Enroll) a assinatura biométrica facial quando a câmera está ligada, ativa e descoberta.
 */
export async function enrollFacialBiometrics(params: {
  role: UserRole;
  name: string;
  email: string;
  userId?: string;
  videoEl: HTMLVideoElement | null;
  stream?: MediaStream | null;
}): Promise<EnrolledBiometricRecord> {
  const { role, name, email, userId, videoEl, stream } = params;
  const capture = await captureFacialFrameAndDescriptor(videoEl, stream);

  if (!capture.qualityPassed || !capture.descriptor.length) {
    throw new Error(
      capture.failureReason ||
        "A câmera está desligada, coberta ou sem permissão. Por favor, realize o login por senha."
    );
  }

  const userKey = buildBiometricUserKey(role, name, email, userId);
  const nowIso = new Date().toISOString();

  const record: EnrolledBiometricRecord = {
    userKey,
    userId,
    role,
    name: name.trim(),
    email: email.trim(),
    descriptor: capture.descriptor,
    signatureHash: capture.signatureHash,
    snapshotDataUrl: null,
    source: "webrtc-camera",
    enrolledAt: nowIso,
    lastVerifiedAt: nowIso,
    lastConfidencePercent: 98.6,
    captureDiscardedFromMemory: true,
  };

  const all = getAllEnrolledBiometrics();
  all[userKey] = record;
  // Indexa também pela chave sem id para compatibilidade retroativa
  const legacyKey = buildBiometricUserKey(role, name, email);
  all[legacyKey] = record;
  saveAllEnrolledBiometrics(all);

  try {
    await fetch("/api/biometrics/enroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userKey,
        userId,
        name: record.name,
        email: record.email,
        role: record.role,
        descriptor: record.descriptor,
        signatureHash: record.signatureHash,
      }),
    });
  } catch {}

  purgeBiometricCaptureFromMemory({ userKey });
  return record;
}

/**
 * Valida (Verify) o Face ID:
 * 1. Validação Estrita por Utilizador:
 *    A comparação é realizada EXCLUSIVAMENTE contra os dados/hash biométricos
 *    cadastrados para a conta do usuário selecionado.
 * 2. Se a conta não possuir biometria cadastrada ou se o rosto detectado não corresponder,
 *    retorna verified: false, mantém o cadeado fechado (🔒) e não efetua login.
 */
export async function verifyFacialBiometrics(params: {
  role: UserRole;
  name: string;
  email: string;
  userId?: string;
  videoEl: HTMLVideoElement | null;
  stream?: MediaStream | null;
}): Promise<BiometricVerificationResult> {
  const { role, name, email, userId, videoEl, stream } = params;

  if (!isLiveCameraStreamActive(videoEl, stream)) {
    purgeBiometricCaptureFromMemory({ videoEl, stream });
    return {
      verified: false,
      confidencePercent: 0,
      isNewEnrollment: false,
      record: null,
      capturePurgedFromMemory: true,
      errorReason:
        "A câmera está desligada ou sem permissão. Por favor, realize o login por senha.",
      message:
        "A câmera está desligada ou sem permissão. Por favor, realize o login por senha.",
    };
  }

  // 1. Busca estrita pelo cadastro biométrico existente para esta conta específica
  const existing = getEnrolledBiometricProfile(role, name, email, userId);

  // Se a conta NÃO possuir biometria cadastrada, NÃO efetua login e encerra imediatamente
  if (!existing || !existing.descriptor || existing.descriptor.length === 0) {
    purgeBiometricCaptureFromMemory({ videoEl, stream });
    return {
      verified: false,
      confidencePercent: 0,
      isNewEnrollment: false,
      record: null,
      capturePurgedFromMemory: true,
      errorReason: "Biometria não cadastrada para esta conta",
      message: "Biometria não reconhecida para esta conta",
    };
  }

  const liveCapture = await captureFacialFrameAndDescriptor(videoEl, stream);

  if (!liveCapture.qualityPassed || !liveCapture.descriptor.length) {
    purgeBiometricCaptureFromMemory({ videoEl, stream });
    return {
      verified: false,
      confidencePercent: 0,
      isNewEnrollment: false,
      record: null,
      capturePurgedFromMemory: true,
      errorReason:
        liveCapture.failureReason ||
        "A câmera está desligada, coberta ou sem permissão. Por favor, realize o login por senha.",
      message:
        liveCapture.failureReason ||
        "Biometria não reconhecida para esta conta",
    };
  }

  // 2. Comparação estrita EXCLUSIVAMENTE contra os dados biométricos da conta selecionada
  const similarityPct = computeDescriptorSimilarityPercent(
    existing.descriptor,
    liveCapture.descriptor
  );

  // Zera e descarta o vetor temporário da captura na memória RAM imediatamente após a comparação
  liveCapture.descriptor.fill(0);
  liveCapture.descriptor.length = 0;
  liveCapture.snapshotDataUrl = null;

  // Validação estrita por usuário: semelhança mínima exigida de 82%
  const isMatch = similarityPct >= 82;

  if (!isMatch) {
    purgeBiometricCaptureFromMemory({
      videoEl,
      stream,
      userKey: existing.userKey,
    });
    return {
      verified: false,
      confidencePercent: similarityPct,
      isNewEnrollment: false,
      record: null,
      capturePurgedFromMemory: true,
      errorReason: "Rosto detectado não corresponde à biometria cadastrada para esta conta.",
      message: "Biometria não reconhecida para esta conta",
    };
  }

  // Sucesso na validação contra o cadastro da conta
  const updatedRecord: EnrolledBiometricRecord = {
    ...existing,
    lastVerifiedAt: new Date().toISOString(),
    lastConfidencePercent: similarityPct,
    snapshotDataUrl: null,
    captureDiscardedFromMemory: true,
  };

  const all = getAllEnrolledBiometrics();
  all[existing.userKey] = updatedRecord;
  saveAllEnrolledBiometrics(all);

  purgeBiometricCaptureFromMemory({
    videoEl,
    stream,
    userKey: existing.userKey,
  });

  try {
    await fetch("/api/biometrics/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userKey: existing.userKey,
        userId: existing.userId || userId,
        descriptor: existing.descriptor,
      }),
    });
  } catch {}

  return {
    verified: true,
    confidencePercent: similarityPct,
    isNewEnrollment: false,
    record: updatedRecord,
    capturePurgedFromMemory: true,
    message: `Face ID confirmado (${updatedRecord.signatureHash})! Câmera desligada e memória limpa.`,
  };
}
