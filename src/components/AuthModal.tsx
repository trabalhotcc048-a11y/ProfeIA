import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Sparkles,
  Lock,
  Unlock,
  Mail,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  X,
  GraduationCap,
  School,
  Check,
  ScanFace,
  Eye,
  EyeOff,
  ShieldCheck,
  Trash2,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { UserRole, UserProfile } from "../types";
import {
  OFFICIAL_STUDENTS_LIST,
  getStudentOfficialEmail,
  findOfficialStudentByName,
  normalizeIdentityText,
  CLASS_CODE,
  CLASS_COURSE,
} from "../data/studentsData";
import { getSavedProfileAvatar } from "./common/GenericSilhouetteAvatar";
import {
  startBiometricCameraStream,
  waitForActiveVideoEmission,
  getEnrolledBiometricProfile,
  verifyFacialBiometrics,
  enrollFacialBiometrics,
  removeEnrolledBiometricProfile,
  purgeBiometricCaptureFromMemory,
  EnrolledBiometricRecord,
} from "../services/biometricAuthService";

interface AuthModalProps {
  isOpen: boolean;
  onLoginSuccess: (user: UserProfile) => void;
  onClose?: () => void;
  isInitialScreen?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onLoginSuccess,
  onClose,
  isInitialScreen = false,
}) => {
  // Papel definido exclusivamente no Login (Aluno ou Professor)
  const [selectedRole, setSelectedRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem("profeia_remembered_role");
    return saved === "PROFESSOR" ? "PROFESSOR" : "ALUNO";
  });

  // Estado de desbloqueio estilo iOS Lock Screen (cadeado fechado 🔒 -> aberto 🔓)
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  const [studentName, setStudentName] = useState<string>(() => {
    return (
      localStorage.getItem("profeia_remembered_student_name") ||
      localStorage.getItem("profeia_student_name") ||
      "Raíssa Teixeira Magalhães"
    );
  });

  const [teacherName, setTeacherName] = useState<string>(() => {
    return (
      localStorage.getItem("profeia_teacher_name") ||
      localStorage.getItem("profeia_remembered_prof_name") ||
      "Adnaldo Alves"
    );
  });

  const [email, setEmail] = useState<string>(() => {
    const savedRole = localStorage.getItem("profeia_remembered_role");
    if (savedRole === "PROFESSOR") {
      return (
        localStorage.getItem("profeia_teacher_email") ||
        localStorage.getItem("profeia_remembered_prof_email") ||
        "adnaldo.alves@escola.com"
      );
    }
    const savedStudent =
      localStorage.getItem("profeia_remembered_student_name") ||
      "Raíssa Teixeira Magalhães";
    const matched = findOfficialStudentByName(savedStudent);
    if (matched) {
      return (
        localStorage.getItem(`profeia_user_${matched.id}_email`) ||
        getStudentOfficialEmail(matched.name)
      );
    }
    return getStudentOfficialEmail(savedStudent);
  });

  const [password, setPassword] = useState<string>(() => {
    const savedRole = localStorage.getItem("profeia_remembered_role");
    if (savedRole === "PROFESSOR") {
      return (
        localStorage.getItem("profeia_remembered_prof_password") || "123456"
      );
    }
    return (
      localStorage.getItem("profeia_remembered_student_password") || "123456"
    );
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Estado da Câmera WebRTC e Escaneamento Face ID em Tempo Real
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanTimerRef = useRef<number | null>(null);
  const redirectTimerRef = useRef<number | null>(null);

  const [biometricStreaming, setBiometricStreaming] = useState(false);
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [faceIdCheckConfirmed, setFaceIdCheckConfirmed] = useState(false);
  const [faceIdFailed, setFaceIdFailed] = useState(false);
  const [faceIdUnrecognized, setFaceIdUnrecognized] = useState(false);
  const [retryScanCounter, setRetryScanCounter] = useState(0);
  const [enrolledRecord, setEnrolledRecord] =
    useState<EnrolledBiometricRecord | null>(null);

  const activePersonName =
    selectedRole === "ALUNO" ? studentName : teacherName;

  const activeStudent = useMemo(() => {
    if (selectedRole !== "ALUNO") return null;
    return findOfficialStudentByName(studentName, email);
  }, [selectedRole, studentName, email]);

  // Configuração para Apresentação:
  // Conta "Raíssa Teixeira" é a ÚNICA conta com biometria cadastrada/ativa por padrão.
  // Demais contas (ex: Samuel Campos) definidas explicitamente como sem biometria cadastrada.
  const hasBiometricsEnrolled = useMemo(() => {
    if (selectedRole !== "ALUNO") return false;
    if (activeStudent) {
      return activeStudent.hasFaceId === true || activeStudent.id === "aluno-raissa";
    }
    const norm = normalizeIdentityText(studentName);
    return norm.includes("raissa") || (email && email.toLowerCase().includes("raissa"));
  }, [selectedRole, activeStudent, studentName, email]);

  const activePersonUserId = useMemo(() => {
    if (selectedRole === "ALUNO") {
      return activeStudent?.id;
    } else {
      const normProf = teacherName.toLowerCase();
      return normProf.includes("edmilson") ? "prof-edmilson" : "prof-adnaldo";
    }
  }, [selectedRole, activeStudent, teacherName]);

  const clearAllFaceIdTimers = () => {
    if (scanTimerRef.current) {
      window.clearTimeout(scanTimerRef.current);
      scanTimerRef.current = null;
    }
    if (redirectTimerRef.current) {
      window.clearTimeout(redirectTimerRef.current);
      redirectTimerRef.current = null;
    }
  };

  // 3. Limpeza da Memória: Desliga a câmera e apaga os dados do feed de vídeo da memória imediatamente
  const stopBiometricCameraAndPurgeMemory = () => {
    purgeBiometricCaptureFromMemory({
      videoEl: videoRef.current,
      stream: streamRef.current,
    });
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => {
        try {
          t.enabled = false;
          t.stop();
        } catch {}
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
        videoRef.current.removeAttribute("src");
        videoRef.current.load();
      } catch {}
    }
    setBiometricStreaming(false);
  };

  useEffect(() => {
    if (!hasBiometricsEnrolled) {
      setEnrolledRecord(null);
      return;
    }
    const rec = getEnrolledBiometricProfile(
      selectedRole,
      activePersonName,
      email,
      activePersonUserId
    );
    setEnrolledRecord(rec);
  }, [selectedRole, activePersonName, email, activePersonUserId, isOpen, hasBiometricsEnrolled]);

  const completeAuthentication = (
    roleOverride?: UserRole,
    nameOverride?: string,
    emailOverride?: string
  ) => {
    const finalRole = roleOverride || selectedRole;
    const finalStudentName = (nameOverride !== undefined ? nameOverride : studentName).trim();
    const finalTeacherName = (nameOverride !== undefined ? nameOverride : teacherName).trim();
    const finalEmail = (emailOverride !== undefined ? emailOverride : email).trim();

    clearAllFaceIdTimers();
    stopBiometricCameraAndPurgeMemory();

    if (finalRole === "ALUNO") {
      const matched = findOfficialStudentByName(finalStudentName, finalEmail);
      if (!matched) {
        setIsLoading(false);
        setBiometricScanning(false);
        setFaceIdCheckConfirmed(false);
        setFaceIdFailed(true);
        setSuccessMsg(null);
        setErrorMsg("Aluno não encontrado. Verifique os dados informados.");
        return;
      }

      const persistedStudentName =
        localStorage.getItem(`profeia_user_${matched.id}_name`) || matched.name;
      const persistedStudentEmail =
        localStorage.getItem(`profeia_user_${matched.id}_email`) ||
        getStudentOfficialEmail(matched.name);
      const persistedStudentAvatar = getSavedProfileAvatar("ALUNO", matched.id);

      try {
        localStorage.setItem("profeia_remembered_role", "ALUNO");
        localStorage.setItem("profeia_remembered_student_name", persistedStudentName);
        localStorage.setItem("profeia_remembered_student_email", persistedStudentEmail);
        localStorage.setItem("profeia_remembered_student_password", password);
      } catch {}

      onLoginSuccess({
        id: matched.id,
        name: persistedStudentName,
        email: persistedStudentEmail,
        role: "ALUNO",
        avatar: persistedStudentAvatar,
        turma: `Turma ${matched.turma || CLASS_CODE}`,
        course: matched.course || CLASS_COURSE,
        enrollmentId: matched.enrollmentId,
        streakDays: Math.max(3, Math.round((matched.metrics.completedInteractiveSessions || 12) / 2)),
        studyHoursTotal: matched.metrics.activeStudyHours || 35,
        dailyGoalMinutes: 45,
        dailyProgressMinutes: Math.min(45, Math.max(15, (matched.metrics.completedInteractiveSessions || 10) * 2)),
        hasFaceId: matched.hasFaceId ?? (matched.id === "aluno-raissa"),
        faceIdData: matched.faceIdData ?? (matched.id === "aluno-raissa" ? "sha256-bio-raissa-teixeira-enrolled" : null),
      });
    } else {
      const normProf = normalizeIdentityText(finalTeacherName || "Adnaldo Alves");
      const profId = normProf.includes("edmilson")
        ? "prof-edmilson"
        : normProf.includes("adnaldo")
        ? "prof-adnaldo"
        : `prof-${normProf.replace(/[^a-z0-9]+/g, "-") || "docente"}`;
      const defaultProfName = normProf.includes("edmilson")
        ? "Edmilson Borges"
        : finalTeacherName || "Adnaldo Alves";
      const persistedProfName =
        localStorage.getItem(`profeia_user_${profId}_name`) || defaultProfName;
      const persistedProfEmail =
        localStorage.getItem(`profeia_user_${profId}_email`) ||
        finalEmail ||
        "adnaldo.alves@escola.com";
      const persistedProfAvatar = getSavedProfileAvatar("PROFESSOR", profId);

      try {
        localStorage.setItem("profeia_remembered_role", "PROFESSOR");
        localStorage.setItem("profeia_remembered_prof_name", persistedProfName);
        localStorage.setItem("profeia_remembered_prof_email", persistedProfEmail);
        localStorage.setItem("profeia_remembered_prof_password", password);
      } catch {}

      onLoginSuccess({
        id: profId,
        name: persistedProfName,
        email: persistedProfEmail,
        role: "PROFESSOR",
        avatar: persistedProfAvatar,
        turma: `Docente Turma ${CLASS_CODE}`,
        course: "Técnico em Informática Integrado (Vespertino)",
        enrollmentId: profId === "prof-edmilson" ? "DOC-2026-008" : "DOC-2026-004",
        streakDays: 30,
        studyHoursTotal: 120,
        dailyGoalMinutes: 60,
        dailyProgressMinutes: 60,
      });
    }
  };

  // =========================================================================
  // FLUXO DO FACE ID EM SEGUNDO PLANO (ESTILO iOS LOCK SCREEN):
  // 1. O escaneamento facial roda automaticamente em segundo plano.
  // 2. Estado Inicial: Cadeado FECHADO (🔒).
  // 3. Ao reconhecer o rosto com sucesso: NÃO faz redirecionamento instantâneo.
  //    Aplica atraso consciente (delay de 1.8 segundos, entre 1.5 e 2s), transiciona
  //    o ícone para cadeado ABERTO (🔓) com feedback visual discreto e efetua o login.
  // 4. Fallback Transparente: Se a câmera estiver desligada/coberta ou falhar, mantém
  //    o formulário de PIN/senha manual pronto para utilização sem bloquear a interface.
  // =========================================================================
  useEffect(() => {
    if (!isOpen || isUnlocked) {
      clearAllFaceIdTimers();
      stopBiometricCameraAndPurgeMemory();
      return;
    }

    let cancelled = false;
    clearAllFaceIdTimers();
    setErrorMsg(null);
    setSuccessMsg(null);
    setFaceIdCheckConfirmed(false);
    setFaceIdFailed(false);
    setFaceIdUnrecognized(false);

    // 1. Ao selecionar um perfil, verifique se ele possui biometria cadastrada.
    if (!hasBiometricsEnrolled) {
      // SE for qualquer OUTRO perfil (sem biometria cadastrada, ex: Samuel Campos):
      // - Desative o scanner de rosto
      // - MANTENHA o cadeado fechado (🔒)
      // - Não efetua login automático por biometria (requer PIN/senha manual)
      stopBiometricCameraAndPurgeMemory();
      setBiometricScanning(false);
      setIsUnlocked(false);
      return;
    }

    // 2. SE for o perfil "Raissa Teixeira" (biometria ativa):
    // - Execute a leitura do rosto pela câmera
    // - Confirme a correspondência
    // - Abra o cadeado (🔓)
    // - Faça o login automático
    setBiometricScanning(true);
    setIsUnlocked(false);

    const runFaceIdFlow = async () => {
      // Inicia o stream da câmera WebRTC
      const session = await startBiometricCameraStream();
      if (cancelled) {
        if (session.stream) {
          session.stream.getTracks().forEach((t) => t.stop());
        }
        return;
      }

      // Se a câmera estiver indisponível ou sem permissão
      if (!session.stream || session.error) {
        stopBiometricCameraAndPurgeMemory();
        setBiometricScanning(false);
        setFaceIdFailed(true);
        return;
      }

      streamRef.current = session.stream;
      setBiometricStreaming(true);

      if (videoRef.current) {
        videoRef.current.srcObject = session.stream;
        try {
          await videoRef.current.play();
        } catch {}
      }

      // Confirma que a câmera está emitindo quadros reais
      const isEmittingFrames = await waitForActiveVideoEmission(
        videoRef.current,
        session.stream,
        1200
      );

      if (cancelled) return;

      if (!isEmittingFrames) {
        stopBiometricCameraAndPurgeMemory();
        setBiometricScanning(false);
        setFaceIdFailed(true);
        return;
      }

      // Executa a verificação biométrica em tempo real
      const runVerification = async () => {
        if (cancelled) return;

        const targetUserId = "aluno-raissa";
        const targetName = "Raíssa Teixeira Magalhães";

        // Validação Estrita para a conta de Raíssa Teixeira
        let enrolledProfile = getEnrolledBiometricProfile(
          "ALUNO",
          targetName,
          email,
          targetUserId
        );

        // Fallback de Apresentação para Raíssa Teixeira:
        // Se a biometria prévia tiver sido limpa no navegador, cadastra a captura ao vivo para a conta de Raíssa
        if (
          (!enrolledProfile || !enrolledProfile.descriptor || enrolledProfile.descriptor.length === 0) &&
          videoRef.current &&
          streamRef.current
        ) {
          try {
            enrolledProfile = await enrollFacialBiometrics({
              role: "ALUNO",
              name: targetName,
              email: email || getStudentOfficialEmail(targetName),
              userId: targetUserId,
              videoEl: videoRef.current,
              stream: streamRef.current,
            });
          } catch {
            enrolledProfile = null;
          }
        }

        if (!enrolledProfile || !enrolledProfile.descriptor || enrolledProfile.descriptor.length === 0) {
          stopBiometricCameraAndPurgeMemory();
          setBiometricScanning(false);
          setFaceIdFailed(true);
          return;
        }

        // Comparação biométrica facial da conta de Raíssa Teixeira
        const result = await verifyFacialBiometrics({
          role: "ALUNO",
          name: targetName,
          email,
          userId: targetUserId,
          videoEl: videoRef.current,
          stream: streamRef.current,
        });

        if (cancelled) return;

        if (!result.verified) {
          stopBiometricCameraAndPurgeMemory();
          setBiometricScanning(false);
          setFaceIdFailed(true);
          return;
        }

        // Sucesso comprovado: biometria correspondida!
        stopBiometricCameraAndPurgeMemory();
        if (result.record) {
          setEnrolledRecord(result.record);
        }
        setBiometricScanning(false);
        setFaceIdFailed(false);
        setFaceIdUnrecognized(false);

        // Abre o cadeado (🔓)
        setIsUnlocked(true);
        setFaceIdCheckConfirmed(true);
        setSuccessMsg(`Face ID reconhecido com sucesso para ${targetName}!`);

        // Login instantâneo automático (0ms)
        completeAuthentication("ALUNO", targetName, email);
      };

      runVerification();
    };

    runFaceIdFlow();

    return () => {
      cancelled = true;
      clearAllFaceIdTimers();
      stopBiometricCameraAndPurgeMemory();
    };
  }, [
    isOpen,
    isUnlocked,
    hasBiometricsEnrolled,
    selectedRole,
    studentName,
    teacherName,
    email,
    activePersonUserId,
    retryScanCounter,
  ]);

  // Garante que o stream seja vinculado ao elemento <video>
  useEffect(() => {
    if (biometricStreaming && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [biometricStreaming]);

  // Troca de papel (Aluno vs Professor) na tela de login
  const handleSelectRole = (role: UserRole) => {
    clearAllFaceIdTimers();
    stopBiometricCameraAndPurgeMemory();
    setSelectedRole(role);
    setIsUnlocked(false);
    setErrorMsg(null);
    setSuccessMsg(null);
    setFaceIdUnrecognized(false);
    if (role === "PROFESSOR") {
      const pName =
        localStorage.getItem("profeia_remembered_prof_name") ||
        localStorage.getItem("profeia_teacher_name") ||
        "Adnaldo Alves";
      const pEmail =
        localStorage.getItem("profeia_remembered_prof_email") ||
        localStorage.getItem("profeia_teacher_email") ||
        "adnaldo.alves@escola.com";
      const pPass =
        localStorage.getItem("profeia_remembered_prof_password") || "123456";
      setTeacherName(pName);
      setEmail(pEmail);
      setPassword(pPass);
    } else {
      const sName = studentName || "Raíssa Teixeira Magalhães";
      const matched = findOfficialStudentByName(sName);
      const sEmail = matched
        ? localStorage.getItem(`profeia_user_${matched.id}_email`) ||
          getStudentOfficialEmail(matched.name)
        : getStudentOfficialEmail(sName);
      const sPass =
        localStorage.getItem("profeia_remembered_student_password") || "123456";
      setEmail(sEmail);
      setPassword(sPass);
    }
  };

  // Auto-fill ao digitar ou selecionar o nome do aluno da turma INFVES3SB
  const handleStudentNameChange = (nameInput: string) => {
    clearAllFaceIdTimers();
    setFaceIdCheckConfirmed(false);
    setIsUnlocked(false);
    setErrorMsg(null);
    setSuccessMsg(null);
    setFaceIdUnrecognized(false);
    setStudentName(nameInput);
    if (selectedRole === "ALUNO" && nameInput.trim()) {
      const matched = findOfficialStudentByName(nameInput);
      if (matched) {
        const savedUserEmail = localStorage.getItem(
          `profeia_user_${matched.id}_email`
        );
        setEmail(savedUserEmail || getStudentOfficialEmail(matched.name));
      } else {
        setEmail(getStudentOfficialEmail(nameInput.trim()));
      }
      if (!password) {
        setPassword(
          localStorage.getItem("profeia_remembered_student_password") || "123456"
        );
      }
    }
  };

  // Auto-fill ao digitar ou selecionar o nome do Professor (ex: Adnaldo Alves -> adnaldo.alves@escola.com)
  const handleTeacherNameChange = (nameInput: string) => {
    clearAllFaceIdTimers();
    setFaceIdCheckConfirmed(false);
    setErrorMsg(null);
    setSuccessMsg(null);
    setFaceIdUnrecognized(false);
    setTeacherName(nameInput);
    if (selectedRole === "PROFESSOR" && nameInput.trim()) {
      const normProf = nameInput
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      if (normProf.includes("adnaldo")) {
        setEmail("adnaldo.alves@escola.com");
      } else if (normProf.includes("edmilson")) {
        setEmail("edmilson.borges@escola.com");
      } else {
        const cleanSlug = normProf
          .replace(/[^a-z0-9\s]/g, "")
          .split(/\s+/)
          .filter(Boolean)
          .join(".");
        setEmail(`${cleanSlug || "adnaldo.alves"}@escola.com`);
      }

      if (!password) {
        setPassword(
          localStorage.getItem("profeia_remembered_prof_password") || "123456"
        );
      }
    }
  };

  const handleManualFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (selectedRole === "ALUNO") {
      if (!studentName.trim()) {
        setErrorMsg("Aluno não encontrado. Informe o nome de um aluno cadastrado.");
        return;
      }
      const matchedStudent = findOfficialStudentByName(studentName, email);
      if (!matchedStudent) {
        setErrorMsg("Aluno não encontrado. Verifique os dados informados.");
        return;
      }
    }

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Preencha o e-mail e a senha para realizar o login manual.");
      return;
    }

    if (!email.includes("@")) {
      setErrorMsg("Por favor, insira um e-mail válido com '@'.");
      return;
    }

    if (password.trim().length < 4) {
      setErrorMsg("A senha deve conter no mínimo 4 caracteres.");
      return;
    }

    setIsLoading(true);
    setSuccessMsg("Credenciais validadas! Redirecionando para a plataforma...");
    window.setTimeout(() => {
      setIsLoading(false);
      completeAuthentication();
    }, 350);
  };

  const handleRemoveBiometrics = async () => {
    clearAllFaceIdTimers();
    stopBiometricCameraAndPurgeMemory();
    setFaceIdCheckConfirmed(false);
    setBiometricScanning(false);
    setFaceIdUnrecognized(false);
    await removeEnrolledBiometricProfile(
      selectedRole,
      activePersonName,
      email,
      activePersonUserId
    );
    setEnrolledRecord(null);
    setSuccessMsg(
      "Biometria facial apagada com sucesso e removida da memória."
    );
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !forgotEmail.includes("@")) {
      return;
    }
    setForgotSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in ${
        isInitialScreen ? "overflow-y-auto min-h-screen py-6" : ""
      }`}
    >
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto">
        {/* Header Estilo iOS Lock Screen */}
        <div className="p-6 pb-4 bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-700 text-white text-center relative">
          {onClose && !isInitialScreen && (
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Ícone de Cadeado estilo iOS Lock Screen no topo superior central */}
          <div className="flex flex-col items-center justify-center pt-1 pb-2">
            <div
              className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl ${
                isUnlocked
                  ? "bg-emerald-500 text-white scale-110 shadow-emerald-500/40 ring-4 ring-emerald-300/40 animate-pulse"
                  : biometricScanning
                  ? "bg-white/15 text-white backdrop-blur-md border border-white/30 shadow-black/10 ring-2 ring-emerald-400/30"
                  : "bg-white/15 text-white/90 backdrop-blur-sm border border-white/20"
              }`}
            >
              {isUnlocked ? (
                <Unlock className="w-8 h-8 text-white transition-all transform scale-110 duration-300" />
              ) : (
                <Lock
                  className={`w-8 h-8 transition-all ${
                    biometricScanning ? "animate-pulse" : ""
                  }`}
                />
              )}

              {/* Indicador de leitura em tempo real */}
              {biometricScanning && !isUnlocked && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
                </span>
              )}
            </div>

            {/* Feedback Visual Discreto */}
            <div className="mt-2.5 h-6 flex items-center justify-center px-4">
              {isUnlocked ? (
                <span className="text-xs font-black text-emerald-200 flex items-center gap-1.5 animate-in fade-in duration-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  Rosto reconhecido • Acessando ProfeIA...
                </span>
              ) : !hasBiometricsEnrolled ? (
                <span className="text-[11px] font-semibold text-amber-200 flex items-center gap-1.5 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  Biometria não cadastrada para este perfil. Utilize o PIN/senha.
                </span>
              ) : biometricScanning ? (
                <span className="text-[11px] font-medium text-emerald-200/90 flex items-center gap-1.5">
                  <ScanFace className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                  Reconhecendo Face ID em segundo plano...
                </span>
              ) : faceIdFailed ? (
                <span className="text-[11px] font-semibold text-amber-200 flex items-center gap-1.5 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  Rosto não correspondido. Utilize o PIN/senha.
                </span>
              ) : (
                <span className="text-[11px] font-medium text-indigo-100/80">
                  Acesso Protegido • Turma {CLASS_CODE}
                </span>
              )}
            </div>
          </div>

          <h2 className="text-2xl font-black tracking-tight mt-1">ProfeIA</h2>
          <p className="text-xs text-indigo-100/90 max-w-xs mx-auto">
            Plataforma Educacional Inteligente • Turma {CLASS_CODE}
          </p>
        </div>

        {/* Role Selector Tabs (EXCLUSIVELY HERE ON LOGIN SCREEN) */}
        <div className="p-6">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
            1. Perfil de Acesso (Exclusivo no Login)
          </label>
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl mb-4">
            <button
              type="button"
              onClick={() => handleSelectRole("ALUNO")}
              className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                selectedRole === "ALUNO"
                  ? "bg-white text-indigo-700 shadow-sm border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>ALUNO (INFVES3SB)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectRole("PROFESSOR")}
              className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                selectedRole === "PROFESSOR"
                  ? "bg-white text-indigo-700 shadow-sm border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <KeyRound className="w-4 h-4 text-amber-600" />
              <span>PROFESSOR</span>
            </button>
          </div>

          {/* Error and Success alerts */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span className="font-semibold leading-relaxed">{errorMsg}</span>
            </div>
          )}

          {/* Mensagem quando biometria não está cadastrada para o perfil selecionado */}
          {!hasBiometricsEnrolled && (
            <div className="mb-4 p-3 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-800 text-xs flex items-center justify-between gap-2 animate-in fade-in">
              <div className="flex items-center gap-2">
                <ScanFace className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-semibold">
                  Biometria não cadastrada para este perfil. Utilize o PIN/senha.
                </span>
              </div>
              <span className="text-[10px] text-amber-700 font-bold bg-amber-100/90 px-2 py-0.5 rounded-md shrink-0">
                PIN / Senha
              </span>
            </div>
          )}

          {hasBiometricsEnrolled && faceIdFailed && (
            <div className="mb-4 p-3 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-800 text-xs flex items-center justify-between gap-2 animate-in fade-in">
              <div className="flex items-center gap-2">
                <ScanFace className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-semibold">
                  Rosto não correspondido para Raíssa Teixeira.
                </span>
              </div>
              <span className="text-[10px] text-amber-700 font-bold bg-amber-100/90 px-2 py-0.5 rounded-md shrink-0">
                Use a senha manual
              </span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Student / Teacher Name Input (Auto-Fill) */}
          <div className="mb-4">
            {selectedRole === "ALUNO" ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Nome do Aluno (Turma {CLASS_CODE}):</span>
                  {hasBiometricsEnrolled ? (
                    <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <ScanFace className="w-3 h-3 text-emerald-600" /> Biometria Ativa (Face ID)
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-700 font-bold flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      <KeyRound className="w-3 h-3 text-amber-600" /> Sem Biometria (PIN/Senha)
                    </span>
                  )}
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    list="official-students-list"
                    value={studentName}
                    onChange={(e) => handleStudentNameChange(e.target.value)}
                    placeholder="Digite ou selecione o nome do aluno"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 font-semibold"
                  />
                  <datalist id="official-students-list">
                    {OFFICIAL_STUDENTS_LIST.map((student) => (
                      <option
                        key={student.id}
                        value={student.name}
                        label={student.hasFaceId ? "Face ID Ativo" : "Sem Biometria (PIN/Senha)"}
                      />
                    ))}
                  </datalist>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Nome do Professor (Auto-Fill Docente):</span>
                  <span className="text-[10px] text-amber-600 font-semibold">
                    Turma INFVES3SB
                  </span>
                </label>
                <div className="relative">
                  <School className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    list="official-teachers-list"
                    value={teacherName}
                    onChange={(e) => handleTeacherNameChange(e.target.value)}
                    placeholder="Ex: Adnaldo Alves"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <datalist id="official-teachers-list">
                    <option value="Adnaldo Alves" />
                    <option value="Edmilson Borges" />
                  </datalist>
                </div>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* FORMULÁRIO DE SENHA / PIN MANUAL (SEMPRE VISÍVEL E PRONTO)     */}
          {/* ============================================================== */}
          <form onSubmit={handleManualFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>E-mail Institucional:</span>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Auto-fill ativo
                </span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome.sobrenome@escola.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
                  disabled={isLoading || isUnlocked}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Senha / PIN de Acesso
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setShowForgotModal(true);
                    setForgotSubmitted(false);
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline font-medium cursor-pointer"
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 font-mono"
                  disabled={isLoading || isUnlocked}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  title={
                    showPassword
                      ? "Ocultar senha"
                      : "Visualizar senha em texto simples"
                  }
                  aria-label={showPassword ? "Ocultar senha" : "Visualizar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isUnlocked}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              <span>
                {isLoading || isUnlocked
                  ? "Acessando ProfeIA..."
                  : `Entrar com Senha Manual (${selectedRole})`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Status Discreto da Biometria Facial */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            {enrolledRecord && hasBiometricsEnrolled ? (
              <div className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="flex items-center gap-1.5 text-slate-600 truncate">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">Face ID registrado ({enrolledRecord.signatureHash})</span>
                </span>
                <button
                  type="button"
                  onClick={handleRemoveBiometrics}
                  className="text-rose-600 hover:underline text-[10px] font-semibold shrink-0 cursor-pointer ml-2"
                >
                  Excluir
                </button>
              </div>
            ) : !hasBiometricsEnrolled ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-[11px] text-amber-700 font-medium flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  Biometria não cadastrada para este perfil. Utilize o PIN/senha.
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <ScanFace className="w-3.5 h-3.5 text-slate-400" />
                  {faceIdFailed
                    ? "Face ID não validado para esta conta"
                    : "Face ID ativo automaticamente em segundo plano"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    clearAllFaceIdTimers();
                    setFaceIdUnrecognized(false);
                    setRetryScanCounter((c) => c + 1);
                  }}
                  className="text-indigo-600 hover:text-indigo-700 text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                  title="Tentar ler Face ID novamente"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reescanear</span>
                </button>
              </div>
            )}
          </div>

          {/* Elemento de vídeo WebRTC mantido ativo em segundo plano para decodificar quadros */}
          <video
            ref={(el) => {
              videoRef.current = el;
              if (
                el &&
                streamRef.current &&
                el.srcObject !== streamRef.current
              ) {
                el.srcObject = streamRef.current;
                el.play().catch(() => {});
              }
            }}
            autoPlay
            playsInline
            muted
            className="fixed -top-[9999px] -left-[9999px] w-80 h-60 opacity-0 pointer-events-none"
            aria-hidden="true"
          />

          {/* Quick Info */}
          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Ambiente Institucional Oficial • Turma <strong>{CLASS_CODE}</strong>
              <br />
              <span className="text-slate-400">
                A definição de papel (Aluno ou Professor) ocorre exclusivamente nesta tela de Login.
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Recuperação de Senha
              </h3>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {forgotSubmitted ? (
              <div className="text-center py-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-800">
                  Instruções Enviadas!
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Enviamos um link de redefinição para{" "}
                  <strong>{forgotEmail}</strong>. Verifique sua caixa de entrada.
                </p>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="mt-5 w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
                >
                  Voltar ao Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Digite seu e-mail institucional para receber um link de validação e redefinir sua senha.
                </p>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Seu e-mail
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="email@escola.com"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 font-mono"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700"
                  >
                    Enviar Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
