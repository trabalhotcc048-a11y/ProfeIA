import {
  TutorAvatarCoreState,
  RobotCharacterState,
  ContextualGestureType,
} from "../../services/voiceService";

/**
 * Pose cinemática completa do Avatar Interativo 3D TutorIA em 60 FPS.
 * Atua diretamente sobre a imagem 3D oficial enviada sem alterar nenhum detalhe do design.
 */
export interface TutoriaLivePose {
  // Postura e respiração global
  globalFloatY: number;
  approachScale: number;

  // Tronco e ombros (pivô na cintura: 0.495, 0.605)
  torsoTiltAngle: number;
  torsoSwayX: number;
  shoulderLiftY: number;

  // Cabeça e Rosto OLED (pivô no pescoço: 0.495, 0.370)
  headTiltAngle: number;
  headNodY: number;
  headTurnX: number;

  // Braço esquerdo do espectador — braço acolhedor com mão aberta
  // Ombro: (0.380, 0.428), Cotovelo: (0.315, 0.495), Punho/Mão: (0.258, 0.488)
  leftShoulderAngle: number;
  leftForearmAngle: number;
  leftHandAngle: number;
  leftHandSpreadScale: number;

  // Braço direito do espectador — braço segurando o tablet "TutorIA"
  // Ombro: (0.608, 0.428), Antebraço/Tablet: (0.635, 0.525)
  rightShoulderAngle: number;
  rightForearmTabletAngle: number;

  // Expressões originais do rosto OLED (olhos digitais azuis, sobrancelhas e sorriso azul)
  eyeBlinkAmount: number; // 0.0 (aberto) a 1.0 (piscada completa)
  eyeGazeX: number; // Olhar horizontal vivo direcionado ao aluno
  eyeGazeY: number; // Olhar vertical vivo
  browLift: number; // Leve variação de expressão das sobrancelhas azuis existentes
  eyeHappyCurve: number; // Sutil expressividade nos olhos digitais azuis
  smileSpeechPulse: number; // Sincronia fonética sutil no sorriso digital azul original

  // Reação luminosa sutil de presença na chamada
  electricBlueGlowBoost: number;
  emeraldCorePulse: number;

  // Levitação sutil e independente dos hologramas ao redor
  hologramFloatLeftY: number;
  hologramFloatRightY: number;
}

export function createNeutralLivePose(): TutoriaLivePose {
  return {
    globalFloatY: 0,
    approachScale: 1,
    torsoTiltAngle: 0,
    torsoSwayX: 0,
    shoulderLiftY: 0,
    headTiltAngle: 0,
    headNodY: 0,
    headTurnX: 0,
    leftShoulderAngle: 0,
    leftForearmAngle: 0,
    leftHandAngle: 0,
    leftHandSpreadScale: 1,
    rightShoulderAngle: 0,
    rightForearmTabletAngle: 0,
    eyeBlinkAmount: 0,
    eyeGazeX: 0,
    eyeGazeY: 0,
    browLift: 0,
    eyeHappyCurve: 0,
    smileSpeechPulse: 0,
    electricBlueGlowBoost: 0.1,
    emeraldCorePulse: 0.12,
    hologramFloatLeftY: 0,
    hologramFloatRightY: 0,
  };
}

function lerp(current: number, target: number, alpha: number): number {
  return current + (target - current) * alpha;
}

/**
 * Calcula a pose em tempo real de acordo com o estado da chamada (IDLE, LISTENING, THINKING, SPEAKING),
 * o gesto contextual da explicação, as pausas naturais da fala e o olhar para o aluno.
 */
export function computeLiveAvatarPose(params: {
  timeSec: number;
  coreState: TutorAvatarCoreState;
  characterState: RobotCharacterState;
  gesture: ContextualGestureType;
  speechAmplitude: number;
  isInNaturalPause: boolean;
  progressRatio: number;
  gestureVariant: number;
  responseSeed: number;
  eyeBlinkAmount: number;
  studentGazeX: number;
  studentGazeY: number;
}): TutoriaLivePose {
  const {
    timeSec: t,
    coreState,
    characterState,
    gesture,
    speechAmplitude,
    isInNaturalPause,
    progressRatio,
    gestureVariant,
    responseSeed,
    eyeBlinkAmount,
    studentGazeX,
    studentGazeY,
  } = params;

  // Frequências orgânicas não-harmônicas moduladas pela semente da resposta (nunca repete o mesmo loop)
  const seedPhase = (responseSeed % 11) * 0.57;
  const w1 = Math.sin(t * 1.38 + seedPhase);
  const w2 = Math.sin(t * 2.23 + seedPhase * 1.7);
  const w3 = Math.cos(t * 3.19 + seedPhase * 0.9);
  const slowBreath = Math.sin(t * 1.08);
  const microShift = Math.sin(t * 0.43 + 1.2);

  const pose = createNeutralLivePose();
  pose.eyeBlinkAmount = eyeBlinkAmount;

  // Flutuação muito sutil dos hologramas laterais
  pose.hologramFloatLeftY = 0.0032 * Math.sin(t * 1.25);
  pose.hologramFloatRightY = 0.0032 * Math.sin(t * 1.25 + 2.1);

  // =========================================================================
  // 1. ESTADO IDLE — Esperando na chamada: postura estável, proporções 100%
  //    preservadas, olhar vivo voltado para o aluno e piscadas naturais
  // =========================================================================
  if (coreState === "IDLE") {
    pose.globalFloatY = 0.0012 * slowBreath;
    pose.approachScale = 1.0;
    pose.torsoTiltAngle = 0;
    pose.torsoSwayX = 0;
    pose.shoulderLiftY = 0;

    pose.headTiltAngle = 0;
    pose.headNodY = 0;
    pose.headTurnX = 0;

    pose.leftShoulderAngle = 0;
    pose.leftForearmAngle = 0.006 * Math.sin(t * 0.76);
    pose.leftHandAngle = 0.006 * Math.cos(t * 0.94);
    pose.leftHandSpreadScale = 1.0;

    pose.rightShoulderAngle = 0;
    pose.rightForearmTabletAngle = -0.004 * Math.cos(t * 0.78);

    // Olhar vivo acompanhando o aluno na chamada
    pose.eyeGazeX = 0.0015 * Math.sin(t * 0.48) + studentGazeX * 0.0052;
    pose.eyeGazeY = 0.001 * Math.cos(t * 0.62) + studentGazeY * 0.0042;
    pose.browLift = 0.0005 * slowBreath;
    pose.eyeHappyCurve = 0.12;
    pose.electricBlueGlowBoost = 0.12 + 0.06 * (0.5 + 0.5 * slowBreath);
    pose.emeraldCorePulse = 0.14 + 0.08 * (0.5 + 0.5 * Math.sin(t * 1.3));
    return pose;
  }

  // =========================================================================
  // 2. ESTADO LISTENING — Ouvindo o aluno falar pelo microfone:
  //    Corpo estável sem deformação, olhar focado no aluno e expressão atenta
  // =========================================================================
  if (coreState === "LISTENING") {
    pose.globalFloatY = 0.0014 * slowBreath;
    pose.approachScale = 1.0;
    pose.torsoTiltAngle = 0;
    pose.torsoSwayX = 0;
    pose.shoulderLiftY = 0;

    pose.headTiltAngle = 0;
    pose.headNodY = 0;
    pose.headTurnX = 0;

    pose.leftShoulderAngle = 0;
    pose.leftForearmAngle = 0.01 * Math.sin(t * 1.15);
    pose.leftHandAngle = 0.008 * Math.cos(t * 1.35);
    pose.leftHandSpreadScale = 1.0;

    pose.rightShoulderAngle = 0;
    pose.rightForearmTabletAngle = 0.005 * Math.cos(t * 1.05);

    // Olhar focado diretamente no aluno com sobrancelhas levemente erguidas em atenção
    pose.eyeGazeX = 0.001 * Math.sin(t * 0.7) + studentGazeX * 0.0055;
    pose.eyeGazeY = 0.0008 * Math.cos(t * 0.8) + studentGazeY * 0.0045;
    pose.browLift = 0.0022;
    pose.eyeHappyCurve = 0.22;
    pose.electricBlueGlowBoost = 0.24 + 0.12 * (0.5 + 0.5 * Math.sin(t * 2.2));
    pose.emeraldCorePulse = 0.32 + 0.2 * (0.5 + 0.5 * Math.sin(t * 2.6));
    return pose;
  }

  // =========================================================================
  // 3. ESTADO THINKING — Processando a pergunta do aluno:
  //    Proporções estáveis, olhar consultando o tablet e brilho nos indicadores
  // =========================================================================
  if (coreState === "THINKING") {
    pose.globalFloatY = 0.0014 * slowBreath;
    pose.approachScale = 1.0;
    pose.torsoTiltAngle = 0;
    pose.torsoSwayX = 0;
    pose.shoulderLiftY = 0;

    pose.headTiltAngle = 0;
    pose.headNodY = 0;
    pose.headTurnX = 0;

    pose.leftShoulderAngle = 0;
    pose.leftForearmAngle = 0.01 * w2;
    pose.leftHandAngle = 0.008 * w3;
    pose.leftHandSpreadScale = 1.0;

    pose.rightShoulderAngle = 0;
    pose.rightForearmTabletAngle = 0.008 * w2;

    pose.eyeGazeX = 0.0036 + 0.0012 * w1;
    pose.eyeGazeY = -0.0032 + 0.0012 * w2;
    pose.browLift = 0.0018 * w1;
    pose.eyeHappyCurve = 0.1;
    pose.electricBlueGlowBoost = 0.28 + 0.16 * (0.5 + 0.5 * Math.sin(t * 2.8));
    pose.emeraldCorePulse = 0.42 + 0.32 * (0.5 + 0.5 * Math.sin(t * 3.4));
    return pose;
  }

  // =========================================================================
  // 4. ESTADO SPEAKING — Respondendo por voz na chamada:
  //    Geometria do tronco, cabeça e corpo 100% estável (ZERO scale/compressão).
  //    Animações sutis e naturais nos olhos, boca/tela OLED, braços e postura.
  // =========================================================================
  const isExcited =
    characterState === "EXCITED" || characterState === "SUCCESS";
  const pauseDamping = isInNaturalPause ? 0.42 : 1.0;
  const conclusionTaper =
    progressRatio > 0.85 ? Math.max(0.25, (1.0 - progressRatio) / 0.15) : 1.0;

  const amp = Math.max(0.22, speechAmplitude) * pauseDamping * conclusionTaper;
  const energyMult = isExcited ? 1.12 : 1.0;

  // Mantém tronco, cabeça e escala estritamente estáveis sem compressão
  pose.approachScale = 1.0;
  pose.torsoTiltAngle = 0;
  pose.torsoSwayX = 0;
  pose.shoulderLiftY = 0;
  pose.headTiltAngle = 0;
  pose.headNodY = 0;
  pose.headTurnX = 0;
  pose.leftShoulderAngle = 0;
  pose.rightShoulderAngle = 0;
  pose.leftHandSpreadScale = 1.0;

  // Pequeno movimento natural de postura vertical sem deformar a malha
  pose.globalFloatY = 0.0015 * slowBreath;

  // Animação expressiva no visor/boca OLED e indicadores luminosos
  pose.smileSpeechPulse = isInNaturalPause
    ? 0.08
    : Math.min(1.0, speechAmplitude * 0.95);
  pose.electricBlueGlowBoost = Math.min(
    0.78,
    (0.26 + 0.38 * amp + 0.08 * w1) * (isExcited ? 1.15 : 1.0)
  );
  pose.emeraldCorePulse = Math.min(
    0.82,
    (0.3 + 0.42 * amp + 0.1 * w2) * (isExcited ? 1.12 : 1.0)
  );

  // Gestos sutis apenas no antebraço/mão e expressões oculares/faciais
  switch (gesture) {
    case "INTRODUCING": {
      pose.leftForearmAngle = (0.012 + 0.01 * w2 * amp) * energyMult;
      pose.leftHandAngle = (0.01 + 0.008 * w3 * amp) * energyMult;
      pose.rightForearmTabletAngle = 0.005 * w1 * amp;

      pose.eyeGazeX = 0.0016 * w1 + studentGazeX * 0.0045;
      pose.eyeGazeY = 0.001 * w2 + studentGazeY * 0.0035;
      pose.browLift = 0.0024 * amp;
      pose.eyeHappyCurve = 0.35;
      break;
    }

    case "HIGHLIGHTING": {
      pose.leftForearmAngle = (0.015 + 0.012 * w2 * amp) * energyMult;
      pose.leftHandAngle = (0.012 + 0.009 * w3 * amp) * energyMult;
      pose.rightForearmTabletAngle = 0.006 * w1 * amp;

      pose.eyeGazeX = -0.0018 * w2 + studentGazeX * 0.0045;
      pose.eyeGazeY = -0.0012 + studentGazeY * 0.0035;
      pose.browLift = 0.0032 * amp;
      pose.eyeHappyCurve = 0.28;
      break;
    }

    case "QUESTIONING": {
      pose.leftForearmAngle = (0.014 + 0.01 * w2 * amp) * energyMult;
      pose.leftHandAngle = (0.01 + 0.008 * w3) * energyMult;
      pose.rightForearmTabletAngle = -0.004 * w1;

      pose.eyeGazeX = 0.002 * w1 + studentGazeX * 0.0048;
      pose.eyeGazeY = -0.0016 + studentGazeY * 0.0035;
      pose.browLift = 0.0036;
      pose.eyeHappyCurve = 0.18;
      break;
    }

    case "ANSWERING": {
      const affirmNod = Math.sin(t * 3.4);
      pose.leftForearmAngle = (0.011 + 0.009 * w2 * amp) * energyMult;
      pose.leftHandAngle = (0.009 + 0.007 * w3 * amp) * energyMult;
      pose.rightForearmTabletAngle = 0.005 * w1 * amp;

      pose.eyeGazeX = 0.0014 * w2 + studentGazeX * 0.0045;
      pose.eyeGazeY = 0.0008 * affirmNod + studentGazeY * 0.0035;
      pose.browLift = 0.0018 * amp;
      pose.eyeHappyCurve = 0.38;
      break;
    }

    case "CONCLUDING": {
      pose.leftForearmAngle = (0.008 + 0.006 * w2 * amp) * conclusionTaper;
      pose.leftHandAngle = (0.006 + 0.005 * w3 * amp) * conclusionTaper;
      pose.rightForearmTabletAngle = 0.003 * w1 * amp * conclusionTaper;

      pose.eyeGazeX = studentGazeX * 0.0045;
      pose.eyeGazeY = studentGazeY * 0.0035;
      pose.browLift = 0.001 * conclusionTaper;
      pose.eyeHappyCurve = 0.25;
      break;
    }

    case "EXPLAINING":
    default: {
      pose.leftForearmAngle = (0.012 + 0.01 * w2 * amp) * energyMult;
      pose.leftHandAngle = (0.009 + 0.008 * w3 * amp) * energyMult;
      pose.rightForearmTabletAngle = 0.005 * w1 * amp * energyMult;

      pose.eyeGazeX = 0.0018 * w1 + studentGazeX * 0.0045;
      pose.eyeGazeY = 0.0012 * w2 + studentGazeY * 0.0035;
      pose.browLift = 0.0018 * amp;
      pose.eyeHappyCurve = 0.26;
      break;
    }
  }

  return pose;
}

/**
 * Interpola suavemente a pose atual em direção à pose-alvo (amortecimento orgânico em 60 FPS).
 */
export function interpolateLivePose(
  current: TutoriaLivePose,
  target: TutoriaLivePose,
  dtSec: number
): TutoriaLivePose {
  const alpha = Math.min(1, dtSec * 6.2);
  const fastAlpha = Math.min(1, dtSec * 15);

  return {
    globalFloatY: lerp(current.globalFloatY, target.globalFloatY, alpha),
    approachScale: lerp(current.approachScale, target.approachScale, alpha),
    torsoTiltAngle: lerp(current.torsoTiltAngle, target.torsoTiltAngle, alpha),
    torsoSwayX: lerp(current.torsoSwayX, target.torsoSwayX, alpha),
    shoulderLiftY: lerp(current.shoulderLiftY, target.shoulderLiftY, alpha),
    headTiltAngle: lerp(current.headTiltAngle, target.headTiltAngle, alpha),
    headNodY: lerp(current.headNodY, target.headNodY, alpha),
    headTurnX: lerp(current.headTurnX, target.headTurnX, alpha),
    leftShoulderAngle: lerp(
      current.leftShoulderAngle,
      target.leftShoulderAngle,
      alpha
    ),
    leftForearmAngle: lerp(
      current.leftForearmAngle,
      target.leftForearmAngle,
      alpha
    ),
    leftHandAngle: lerp(current.leftHandAngle, target.leftHandAngle, alpha),
    leftHandSpreadScale: lerp(
      current.leftHandSpreadScale,
      target.leftHandSpreadScale,
      alpha
    ),
    rightShoulderAngle: lerp(
      current.rightShoulderAngle,
      target.rightShoulderAngle,
      alpha
    ),
    rightForearmTabletAngle: lerp(
      current.rightForearmTabletAngle,
      target.rightForearmTabletAngle,
      alpha
    ),
    eyeBlinkAmount: lerp(
      current.eyeBlinkAmount,
      target.eyeBlinkAmount,
      fastAlpha
    ),
    eyeGazeX: lerp(current.eyeGazeX, target.eyeGazeX, alpha),
    eyeGazeY: lerp(current.eyeGazeY, target.eyeGazeY, alpha),
    browLift: lerp(current.browLift, target.browLift, alpha),
    eyeHappyCurve: lerp(current.eyeHappyCurve, target.eyeHappyCurve, alpha),
    smileSpeechPulse: lerp(
      current.smileSpeechPulse,
      target.smileSpeechPulse,
      fastAlpha
    ),
    electricBlueGlowBoost: lerp(
      current.electricBlueGlowBoost,
      target.electricBlueGlowBoost,
      fastAlpha
    ),
    emeraldCorePulse: lerp(
      current.emeraldCorePulse,
      target.emeraldCorePulse,
      fastAlpha
    ),
    hologramFloatLeftY: lerp(
      current.hologramFloatLeftY,
      target.hologramFloatLeftY,
      alpha
    ),
    hologramFloatRightY: lerp(
      current.hologramFloatRightY,
      target.hologramFloatRightY,
      alpha
    ),
  };
}

// ============================================================================
// PESOS ANATÔMICOS CIRÚRGICOS (ISOLA O ROBÔ DOS HOLOGRAMAS LATERAIS)
// ============================================================================

interface VertexSkinWeights {
  u: number;
  v: number;
  wTorso: number;
  wHead: number;
  wLeftArm: number;
  wLeftForearm: number;
  wLeftHand: number;
  wRightArm: number;
  wRightTablet: number;
  wHoloLeft: number;
  wHoloRight: number;
}

function smoothFalloff(
  u: number,
  v: number,
  cu: number,
  cv: number,
  ru: number,
  rv: number,
  innerRatio = 0.5
): number {
  const du = (u - cu) / ru;
  const dv = (v - cv) / rv;
  const dist = Math.sqrt(du * du + dv * dv);
  if (dist >= 1.0) return 0;
  if (dist <= innerRatio) return 1;
  const t = (dist - innerRatio) / (1.0 - innerRatio);
  return 0.5 * (1 + Math.cos(Math.PI * t));
}

function smoothBoxMask(
  u: number,
  v: number,
  uMin: number,
  uMax: number,
  vMin: number,
  vMax: number,
  feather = 0.022
): number {
  const left = Math.min(1, Math.max(0, (u - uMin) / feather));
  const right = Math.min(1, Math.max(0, (uMax - u) / feather));
  const top = Math.min(1, Math.max(0, (v - vMin) / feather));
  const bottom = Math.min(1, Math.max(0, (vMax - v) / feather));
  return left * right * top * bottom;
}

function rotatePoint2D(
  x: number,
  y: number,
  px: number,
  py: number,
  angle: number
): [number, number] {
  if (Math.abs(angle) < 0.00001) return [x, y];
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dx = x - px;
  const dy = y - py;
  return [px + dx * cos - dy * sin, py + dx * sin + dy * cos];
}

export class TutoriaLiveAvatarEngine {
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private texture: WebGLTexture | null = null;
  private posBuffer: WebGLBuffer | null = null;
  private uvBuffer: WebGLBuffer | null = null;
  private indexBuffer: WebGLBuffer | null = null;
  private gridSize = 64;
  private weights: VertexSkinWeights[] = [];
  private positions: Float32Array;
  private indexCount = 0;

  // Uniform locations
  private uBlinkLoc: WebGLUniformLocation | null = null;
  private uGazeLoc: WebGLUniformLocation | null = null;
  private uBrowLiftLoc: WebGLUniformLocation | null = null;
  private uEyeHappyLoc: WebGLUniformLocation | null = null;
  private uSmilePulseLoc: WebGLUniformLocation | null = null;
  private uBlueGlowLoc: WebGLUniformLocation | null = null;
  private uEmeraldPulseLoc: WebGLUniformLocation | null = null;

  constructor(canvas: HTMLCanvasElement, image: HTMLImageElement) {
    const N = this.gridSize;
    const vertexCount = (N + 1) * (N + 1);
    this.positions = new Float32Array(vertexCount * 2);
    const uvs = new Float32Array(vertexCount * 2);

    // Pré-calcula os pesos anatômicos precisos sobre a imagem 3D oficial do TutorIA
    for (let iy = 0; iy <= N; iy++) {
      for (let ix = 0; ix <= N; ix++) {
        const u = ix / N;
        const v = iy / N;
        const idx = iy * (N + 1) + ix;

        uvs[idx * 2] = u;
        uvs[idx * 2 + 1] = v;

        // Mantém as bordas externas da imagem 100% ancoradas
        const borderSafe = smoothBoxMask(u, v, 0.015, 0.985, 0.015, 0.985, 0.03);

        // 1. Cabeça e Visor OLED (u: 0.278..0.708, v: 0.062..0.376 — isolado dos hologramas do livro e Pitágoras)
        const headBox = smoothBoxMask(u, v, 0.276, 0.71, 0.06, 0.378, 0.025);
        const wHead =
          borderSafe *
          headBox *
          smoothFalloff(u, v, 0.495, 0.222, 0.218, 0.162, 0.68);

        // 2. Braço Esquerdo, Antebraço e Mão Aberta Acolhedora
        // Isolado cirurgicamente do átomo (u <= 0.184), integral (v <= 0.362) e </> (v >= 0.545, u <= 0.218)
        const leftArmSafeBox =
          smoothBoxMask(u, v, 0.194, 0.4, 0.388, 0.552, 0.018) *
          (u < 0.225 && v > 0.535 ? 0 : 1);

        const wLeftArm =
          borderSafe *
          leftArmSafeBox *
          Math.max(
            smoothFalloff(u, v, 0.335, 0.47, 0.1, 0.085, 0.52),
            smoothFalloff(u, v, 0.255, 0.482, 0.095, 0.078, 0.55)
          );

        const wLeftForearm =
          borderSafe *
          leftArmSafeBox *
          smoothFalloff(u, v, 0.272, 0.486, 0.088, 0.072, 0.54);

        const wLeftHand =
          borderSafe *
          leftArmSafeBox *
          smoothFalloff(u, v, 0.242, 0.48, 0.065, 0.062, 0.56);

        // 3. Braço Direito e Tablet "TutorIA"
        // Isolado cirurgicamente do código Python (u >= 0.728) e lâmpada verde (u >= 0.778)
        const rightArmSafeBox = smoothBoxMask(
          u,
          v,
          0.57,
          0.718,
          0.395,
          0.645,
          0.018
        );

        const wRightArm =
          borderSafe *
          rightArmSafeBox *
          smoothFalloff(u, v, 0.635, 0.515, 0.095, 0.125, 0.54);

        const wRightTablet =
          borderSafe *
          rightArmSafeBox *
          smoothFalloff(u, v, 0.642, 0.54, 0.082, 0.105, 0.56);

        // 4. Tronco e Ombros (carrega cabeça e braços hierarquicamente, ancorando quadris/pernas/pés)
        const torsoSafeBox = smoothBoxMask(
          u,
          v,
          0.365,
          0.625,
          0.365,
          0.625,
          0.025
        );
        const wTorsoCore =
          borderSafe *
          torsoSafeBox *
          smoothFalloff(u, v, 0.495, 0.485, 0.145, 0.14, 0.55);

        const wTorso = Math.min(
          1,
          Math.max(wTorsoCore, wHead * 0.94, wLeftArm * 0.88, wRightArm * 0.88)
        );

        // 5. Hologramas Educacionais Laterais (flutuação leve sem tocar no robô)
        const robotTotalMask = Math.min(
          1,
          wHead + wTorsoCore + wLeftArm + wRightArm
        );
        const wHoloLeft =
          borderSafe *
          (1 - robotTotalMask) *
          smoothFalloff(u, v, 0.13, 0.38, 0.14, 0.32, 0.5);
        const wHoloRight =
          borderSafe *
          (1 - robotTotalMask) *
          smoothFalloff(u, v, 0.85, 0.38, 0.14, 0.32, 0.5);

        this.weights.push({
          u,
          v,
          wTorso,
          wHead,
          wLeftArm,
          wLeftForearm,
          wLeftHand,
          wRightArm,
          wRightTablet,
          wHoloLeft,
          wHoloRight,
        });
      }
    }

    const indices: number[] = [];
    for (let iy = 0; iy < N; iy++) {
      for (let ix = 0; ix < N; ix++) {
        const topLeft = iy * (N + 1) + ix;
        const topRight = topLeft + 1;
        const bottomLeft = (iy + 1) * (N + 1) + ix;
        const bottomRight = bottomLeft + 1;
        indices.push(topLeft, bottomLeft, topRight);
        indices.push(topRight, bottomLeft, bottomRight);
      }
    }
    this.indexCount = indices.length;

    const gl =
      (canvas.getContext("webgl", {
        alpha: true,
        antialias: true,
        premultipliedAlpha: false,
      }) as WebGLRenderingContext | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl) return;
    this.gl = gl;

    const vsSource = `
      attribute vec2 a_position;
      attribute vec2 a_uv;
      varying vec2 v_uv;
      void main() {
        v_uv = a_uv;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment Shader:
    // - Mantém 100% os pixels e cores originais do robô 3D TutorIA
    // - Anima apenas os elementos já existentes no visor OLED:
    //   1. Olhar vivo (gaze) nos dois grandes olhos digitais azuis (0.422, 0.252) e (0.568, 0.252)
    //   2. Piscadas naturais suaves no visor OLED preto
    //   3. Expressividade sutil nas sobrancelhas azuis existentes
    //   4. Cadência fonética sutil no sorriso digital azul original durante a fala
    const fsSource = `
      precision mediump float;
      varying vec2 v_uv;
      uniform sampler2D u_tex;
      uniform float u_blink;
      uniform vec2 u_gaze;
      uniform float u_browLift;
      uniform float u_eyeHappy;
      uniform float u_smilePulse;
      uniform float u_blueGlow;
      uniform float u_emeraldPulse;

      void main() {
        vec2 uv = v_uv;

        // Centros exatos dos dois grandes olhos digitais azuis no visor OLED
        vec2 leftEyeCenter = vec2(0.422, 0.252);
        vec2 rightEyeCenter = vec2(0.568, 0.252);
        float eyeRadius = 0.047;

        float distLeft = distance(uv, leftEyeCenter);
        float distRight = distance(uv, rightEyeCenter);

        float inEye = 0.0;
        vec2 activeEyeCenter = leftEyeCenter;
        if (distLeft < eyeRadius) {
          inEye = smoothstep(eyeRadius, eyeRadius * 0.65, distLeft);
          activeEyeCenter = leftEyeCenter;
        } else if (distRight < eyeRadius) {
          inEye = smoothstep(eyeRadius, eyeRadius * 0.65, distRight);
          activeEyeCenter = rightEyeCenter;
        }

        // 1. Olhar vivo acompanhando o aluno na chamada (move suavemente os olhos dentro do OLED)
        if (inEye > 0.001) {
          uv -= u_gaze * inEye;
        }

        // 2. Expressividade sutil nas sobrancelhas digitais azuis originais (v: 0.168..0.204)
        float inBrowX = smoothstep(0.375, 0.395, uv.x) * (1.0 - smoothstep(0.595, 0.615, uv.x));
        float inBrowY = smoothstep(0.166, 0.176, uv.y) * (1.0 - smoothstep(0.196, 0.205, uv.y));
        float inBrow = inBrowX * inBrowY;
        if (inBrow > 0.001) {
          uv.y += u_browLift * inBrow;
        }

        // 3. Cadência sutil de fala no sorriso digital azul original (centro 0.495, 0.308)
        float distSmile = distance(uv, vec2(0.495, 0.308));
        float inSmile = 0.0;
        if (distSmile < 0.042) {
          inSmile = smoothstep(0.042, 0.014, distSmile);
          float dySmile = uv.y - 0.308;
          // Expande sutilmente a curvatura vertical do sorriso digital em sincronia com a voz
          uv.y = 0.308 + dySmile * (1.0 - u_smilePulse * 0.16 * inSmile);
        }

        vec4 color = texture2D(u_tex, clamp(uv, 0.0, 1.0));

        // 4. Piscadas naturais dos grandes olhos digitais azuis no visor OLED
        if (inEye > 0.01 && (u_blink > 0.01 || u_eyeHappy > 0.01)) {
          float dy = v_uv.y - activeEyeCenter.y;
          float normY = abs(dy) / (eyeRadius * 0.90);

          // Pálpebra superior e inferior fechando suavemente sobre os pixels luminosos do olho
          float lidThreshold = max(0.0, 1.0 - u_blink * 1.06);
          float blinkMask = smoothstep(lidThreshold, lidThreshold + 0.14, normY) * inEye;

          // Leve curvatura alegre na base inferior do olho durante fala/sorriso
          float lowerCurve = 0.0;
          if (dy > 0.0 && u_eyeHappy > 0.01) {
            float dxNorm = (v_uv.x - activeEyeCenter.x) / eyeRadius;
            float arch = 1.0 - 0.35 * dxNorm * dxNorm;
            lowerCurve = smoothstep(0.84 - u_eyeHappy * 0.12 * arch, 0.96, dy / eyeRadius) * inEye * 0.55;
          }

          float totalLidMask = clamp(max(blinkMask, lowerCurve), 0.0, 1.0);
          vec3 oledDark = vec3(0.014, 0.029, 0.068);
          float isBrightEyePixel = clamp((color.b - 0.10) * 2.4, 0.0, 1.0);
          color.rgb = mix(color.rgb, oledDark, totalLidMask * isBrightEyePixel);
        }

        // 5. Realce sutil de brilho no sorriso digital e nos elementos azul-elétrico durante a voz
        float isElectricBlue = clamp((color.b - max(color.r * 1.45, 0.22)) * 2.2, 0.0, 1.0);
        float visorZone = smoothstep(0.68, 0.24, distance(v_uv, vec2(0.495, 0.35)));
        float smileBoost = inSmile * u_smilePulse * 0.28;
        color.rgb += color.rgb * isElectricBlue * (u_blueGlow * (0.14 + 0.12 * visorZone) + smileBoost);

        // 6. Pulso sutil nos indicadores verde-esmeralda (chapéu, atuadores e luz do peito)
        float isEmerald = clamp((color.g - max(color.r * 1.35, color.b * 1.03)) * 2.6, 0.0, 1.0);
        color.rgb += vec3(0.06, 0.34, 0.22) * isEmerald * u_emeraldPulse * 0.52;

        gl_FragColor = vec4(clamp(color.rgb, 0.0, 1.0), color.a);
      }
    `;

    const compileShader = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;

    this.program = prog;
    gl.useProgram(prog);

    this.posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.DYNAMIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    this.uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
    const aUv = gl.getAttribLocation(prog, "a_uv");
    gl.enableVertexAttribArray(aUv);
    gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 0, 0);

    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW
    );

    const tex = gl.createTexture();
    this.texture = tex;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      image
    );

    this.uBlinkLoc = gl.getUniformLocation(prog, "u_blink");
    this.uGazeLoc = gl.getUniformLocation(prog, "u_gaze");
    this.uBrowLiftLoc = gl.getUniformLocation(prog, "u_browLift");
    this.uEyeHappyLoc = gl.getUniformLocation(prog, "u_eyeHappy");
    this.uSmilePulseLoc = gl.getUniformLocation(prog, "u_smilePulse");
    this.uBlueGlowLoc = gl.getUniformLocation(prog, "u_blueGlow");
    this.uEmeraldPulseLoc = gl.getUniformLocation(prog, "u_emeraldPulse");
  }

  public isReady(): boolean {
    return Boolean(this.gl && this.program && this.texture);
  }

  public renderFrame(pose: TutoriaLivePose): void {
    const gl = this.gl;
    if (!gl || !this.program || !this.posBuffer) return;

    const count = this.weights.length;
    for (let i = 0; i < count; i++) {
      const w = this.weights[i];
      let x = w.u;
      let y = w.v;

      // 0. Flutuação independente dos hologramas laterais
      if (w.wHoloLeft > 0.001) {
        y += pose.hologramFloatLeftY * w.wHoloLeft;
      }
      if (w.wHoloRight > 0.001) {
        y += pose.hologramFloatRightY * w.wHoloRight;
      }

      // 1. Postura do Robô (sem scale, sem skew e sem compressão da geometria do corpo)
      if (w.wTorso > 0.001) {
        const wt = w.wTorso;
        y = y - pose.globalFloatY * wt;
      }

      // 2. Cadeia do Braço Esquerdo: movimentos sutis apenas no antebraço e mão aberta
      if (w.wLeftForearm > 0.001) {
        const wf = w.wLeftForearm;
        [x, y] = rotatePoint2D(
          x,
          y,
          0.315,
          0.495,
          pose.leftForearmAngle * wf
        );
      }
      if (w.wLeftHand > 0.001) {
        const whd = w.wLeftHand;
        [x, y] = rotatePoint2D(x, y, 0.258, 0.488, pose.leftHandAngle * whd);
      }

      // 3. Cadeia do Braço Direito + Tablet "TutorIA": movimento sutil sem comprimir o tronco
      if (w.wRightTablet > 0.001) {
        const wrt = w.wRightTablet;
        [x, y] = rotatePoint2D(
          x,
          y,
          0.635,
          0.525,
          pose.rightForearmTabletAngle * wrt
        );
      }

      this.positions[i * 2] = x * 2.0 - 1.0;
      this.positions[i * 2 + 1] = 1.0 - y * 2.0;
    }

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.024, 0.051, 0.122, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(this.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.positions);

    if (this.uBlinkLoc) gl.uniform1f(this.uBlinkLoc, pose.eyeBlinkAmount);
    if (this.uGazeLoc)
      gl.uniform2f(this.uGazeLoc, pose.eyeGazeX, pose.eyeGazeY);
    if (this.uBrowLiftLoc) gl.uniform1f(this.uBrowLiftLoc, pose.browLift);
    if (this.uEyeHappyLoc) gl.uniform1f(this.uEyeHappyLoc, pose.eyeHappyCurve);
    if (this.uSmilePulseLoc)
      gl.uniform1f(this.uSmilePulseLoc, pose.smileSpeechPulse);
    if (this.uBlueGlowLoc)
      gl.uniform1f(this.uBlueGlowLoc, pose.electricBlueGlowBoost);
    if (this.uEmeraldPulseLoc)
      gl.uniform1f(this.uEmeraldPulseLoc, pose.emeraldCorePulse);

    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
  }

  public dispose(): void {
    const gl = this.gl;
    if (!gl) return;
    if (this.texture) gl.deleteTexture(this.texture);
    if (this.posBuffer) gl.deleteBuffer(this.posBuffer);
    if (this.uvBuffer) gl.deleteBuffer(this.uvBuffer);
    if (this.indexBuffer) gl.deleteBuffer(this.indexBuffer);
    if (this.program) gl.deleteProgram(this.program);
  }
}
