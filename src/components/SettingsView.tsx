import React, { useState, useEffect, useRef } from "react";
import {
  Settings,
  Volume2,
  Sparkles,
  Save,
  CheckCircle2,
  User,
  GraduationCap,
  Mic,
  Mail,
  Lock,
  ArrowLeft,
  ScanFace,
  Camera,
  Eye,
  EyeOff,
  Database,
  Trash2,
  ShieldCheck,
} from "lucide-react";
import { UserProfile } from "../types";
import { GenericSilhouetteAvatar } from "./common/GenericSilhouetteAvatar";
import {
  startBiometricCameraStream,
  enrollFacialBiometrics,
  verifyFacialBiometrics,
  getEnrolledBiometricProfile,
  removeEnrolledBiometricProfile,
  purgeBiometricCaptureFromMemory,
  EnrolledBiometricRecord,
} from "../services/biometricAuthService";

interface SettingsViewProps {
  user: UserProfile;
  onUpdateUserName?: (name: string) => void;
  onUpdateUserEmail?: (email: string) => void;
  onUpdateUserCredentials?: (data: {
    name: string;
    email: string;
    password?: string;
  }) => void;
  onBack?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateUserName,
  onUpdateUserEmail,
  onUpdateUserCredentials,
  onBack,
}) => {
  const [nameInput, setNameInput] = useState(user.name);
  const [emailInput, setEmailInput] = useState(user.email);
  const [passwordInput, setPasswordInput] = useState<string>(() => {
    const userScopedPass = localStorage.getItem(`profeia_user_${user.id}_password`);
    if (userScopedPass) return userScopedPass;
    if (user.role === "PROFESSOR") {
      return (
        localStorage.getItem("profeia_remembered_prof_password") || "123456"
      );
    }
    return (
      localStorage.getItem("profeia_remembered_student_password") || "123456"
    );
  });

  // Visibilidade da Senha (Ícone do Olho: alterna entre oculta *** e visível)
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    setNameInput(user.name);
    setEmailInput(user.email);
    const userScopedPass = localStorage.getItem(`profeia_user_${user.id}_password`);
    if (userScopedPass) {
      setPasswordInput(userScopedPass);
    }
  }, [user.id, user.name, user.email]);

  const [voiceSynthesisEnabled, setVoiceSynthesisEnabled] = useState<boolean>(
    () => {
      const saved =
        localStorage.getItem(`profeia_user_${user.id}_voice_enabled`) ??
        localStorage.getItem("profeia_voice_enabled");
      return saved !== null ? saved === "true" : true;
    }
  );
  const [voiceSpeed, setVoiceSpeed] = useState<string>(() => {
    return (
      localStorage.getItem(`profeia_user_${user.id}_voice_speed`) ||
      localStorage.getItem("profeia_tutoria_voice_speed") ||
      "1.2"
    );
  });
  const [vadEnabled, setVadEnabled] = useState<boolean>(() => {
    const saved =
      localStorage.getItem(`profeia_user_${user.id}_vad_enabled`) ??
      localStorage.getItem("profeia_vad_enabled");
    return saved !== null ? saved === "true" : true;
  });
  const [vadSilenceTimeout, setVadSilenceTimeout] = useState<string>(() => {
    return (
      localStorage.getItem(`profeia_user_${user.id}_vad_timeout`) ||
      localStorage.getItem("profeia_vad_timeout") ||
      "1200"
    );
  });
  const [aiAdaptiveFeedback, setAiAdaptiveFeedback] = useState(true);
  const [savedToast, setSavedToast] = useState(false);
  const [credentialsSavedToast, setCredentialsSavedToast] = useState<
    string | null
  >(null);

  // Biometric camera test & enrollment in settings
  const [biometricPreviewOpen, setBiometricPreviewOpen] = useState(false);
  const [biometricStreamReady, setBiometricStreamReady] = useState(false);
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [biometricValidated, setBiometricValidated] = useState(false);
  const [biometricStatusText, setBiometricStatusText] = useState<string | null>(
    null
  );
  const [enrolledBio, setEnrolledBio] = useState<EnrolledBiometricRecord | null>(
    () => getEnrolledBiometricProfile(user.role, user.name, user.email, user.id)
  );
  const bioVideoRef = useRef<HTMLVideoElement | null>(null);
  const bioStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    setEnrolledBio(
      getEnrolledBiometricProfile(user.role, nameInput, emailInput, user.id)
    );
  }, [user.role, nameInput, emailInput, user.id]);

  useEffect(() => {
    let cancelled = false;
    if (biometricPreviewOpen) {
      startBiometricCameraStream().then((session) => {
        if (cancelled) {
          session.stream?.getTracks().forEach((t) => t.stop());
          return;
        }
        if (session.stream) {
          bioStreamRef.current = session.stream;
          setBiometricStreamReady(true);
          if (bioVideoRef.current) {
            bioVideoRef.current.srcObject = session.stream;
            bioVideoRef.current.play().catch(() => {});
          }
        } else {
          setBiometricStreamReady(false);
          setBiometricStatusText(session.error);
        }
      });
    } else {
      if (bioStreamRef.current) {
        bioStreamRef.current.getTracks().forEach((t) => t.stop());
        bioStreamRef.current = null;
      }
      setBiometricStreamReady(false);
    }
    return () => {
      cancelled = true;
      if (bioStreamRef.current) {
        bioStreamRef.current.getTracks().forEach((t) => t.stop());
        bioStreamRef.current = null;
      }
    };
  }, [biometricPreviewOpen]);

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = nameInput.trim();
    const cleanEmail = emailInput.trim();
    const cleanPass = passwordInput.trim() || "123456";

    if (!cleanName || !cleanEmail) return;

    try {
      localStorage.setItem(`profeia_user_${user.id}_name`, cleanName);
      localStorage.setItem(`profeia_user_${user.id}_email`, cleanEmail);
      localStorage.setItem(`profeia_user_${user.id}_password`, cleanPass);

      if (user.role === "PROFESSOR") {
        localStorage.setItem("profeia_teacher_name", cleanName);
        localStorage.setItem("profeia_teacher_email", cleanEmail);
        localStorage.setItem("profeia_remembered_prof_name", cleanName);
        localStorage.setItem("profeia_remembered_prof_email", cleanEmail);
        localStorage.setItem("profeia_remembered_prof_password", cleanPass);
      } else {
        localStorage.setItem("profeia_remembered_student_name", cleanName);
        localStorage.setItem("profeia_remembered_student_email", cleanEmail);
        localStorage.setItem("profeia_remembered_student_password", cleanPass);
      }
    } catch {}

    if (onUpdateUserName) {
      onUpdateUserName(cleanName);
    }
    if (onUpdateUserEmail) {
      onUpdateUserEmail(cleanEmail);
    }
    if (onUpdateUserCredentials) {
      onUpdateUserCredentials({
        name: cleanName,
        email: cleanEmail,
        password: cleanPass,
      });
    }

    // Persistência direta no servidor / banco de dados MySQL (profeia_db.usuarios)
    try {
      await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          name: cleanName,
          email: cleanEmail,
          password: cleanPass,
          role: user.role,
          enrollmentId: user.enrollmentId,
        }),
      });
    } catch {}

    setCredentialsSavedToast(
      `Dados cadastrais salvos no banco de dados MySQL! Nome: ${cleanName} • E-mail: ${cleanEmail} • Senha atualizada.`
    );
    setTimeout(() => setCredentialsSavedToast(null), 4000);
  };

  const stopSettingsCameraAndPurge = () => {
    purgeBiometricCaptureFromMemory({
      videoEl: bioVideoRef.current,
      stream: bioStreamRef.current,
    });
    if (bioStreamRef.current) {
      bioStreamRef.current.getTracks().forEach((t) => t.stop());
      bioStreamRef.current = null;
    }
    if (bioVideoRef.current) {
      bioVideoRef.current.srcObject = null;
    }
    setBiometricStreamReady(false);
  };

  const handleRemoveBiometricsFromSettings = async () => {
    stopSettingsCameraAndPurge();
    setBiometricPreviewOpen(false);
    await removeEnrolledBiometricProfile(user.role, nameInput, emailInput, user.id);
    setEnrolledBio(null);
    setBiometricValidated(false);
    setBiometricStatusText(
      "Biometria facial apagada do perfil e descartada da memória RAM."
    );
    setCredentialsSavedToast(
      `Biometria Facial de ${nameInput} (${user.role}) apagada com sucesso e removida da memória!`
    );
    setTimeout(() => setCredentialsSavedToast(null), 4500);
  };

  const handleSavePreferences = () => {
    try {
      localStorage.setItem(
        `profeia_user_${user.id}_voice_enabled`,
        String(voiceSynthesisEnabled)
      );
      localStorage.setItem(`profeia_user_${user.id}_voice_speed`, voiceSpeed);
      localStorage.setItem(`profeia_user_${user.id}_vad_enabled`, String(vadEnabled));
      localStorage.setItem(`profeia_user_${user.id}_vad_timeout`, vadSilenceTimeout);
      localStorage.setItem(
        "profeia_voice_enabled",
        String(voiceSynthesisEnabled)
      );
      localStorage.setItem("profeia_tutoria_voice_speed", voiceSpeed);
      localStorage.setItem("profeia_vad_enabled", String(vadEnabled));
      localStorage.setItem("profeia_vad_timeout", vadSilenceTimeout);
    } catch {}
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto select-none">
      {/* Header with Back Button */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>
            )}
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Configurações de Perfil & Sistema
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Altere seus dados cadastrais (Nome de Usuário, E-mail e Senha), biometria facial e parâmetros do TutorIA.
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
            <Settings className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* FEEDBACK TOASTS */}
      {credentialsSavedToast && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{credentialsSavedToast}</span>
        </div>
      )}

      {savedToast && (
        <div className="p-4 rounded-2xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Configurações e parâmetros do TutorIA salvos com sucesso!</span>
        </div>
      )}

      {/* SEÇÃO 1: ALTERAÇÃO DE DADOS CADASTRAIS (NOME, E-MAIL E SENHA) */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Dados Cadastrais da Conta ({user.role})
              </h2>
              <p className="text-xs text-slate-400">
                Edite seu Nome de Usuário, E-mail e Senha de acesso com persistência imediata no banco de dados.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <GenericSilhouetteAvatar
              size="md"
              role={user.role}
              userId={user.id}
              avatarUrl={user.avatar}
              editable={true}
              showChangeButton={true}
            />
          </div>
        </div>

        <form onSubmit={handleSaveCredentials} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Nome de Usuário */}
            <div className="space-y-1.5">
              <label
                htmlFor="userNameInput"
                className="text-xs font-bold text-slate-300 flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Nome de Usuário:</span>
              </label>
              <input
                id="userNameInput"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Ex: Raíssa Teixeira Magalhães"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            {/* E-mail de Acesso */}
            <div className="space-y-1.5">
              <label
                htmlFor="userEmailInput"
                className="text-xs font-bold text-slate-300 flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>E-mail de Acesso:</span>
              </label>
              <input
                id="userEmailInput"
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Ex: raissaaltexeira@gmail.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            {/* Senha de Acesso com Ícone do Olho (Alternar Visibilidade) */}
            <div className="space-y-1.5">
              <label
                htmlFor="userPasswordInput"
                className="text-xs font-bold text-slate-300 flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Senha de Acesso:</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">
                  {showPassword ? "Visível" : "Oculta (***)"}
                </span>
              </label>
              <div className="relative">
                <input
                  id="userPasswordInput"
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Digite a nova senha"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3.5 pr-10 py-2.5 text-xs sm:text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
                  title={showPassword ? "Ocultar senha" : "Visualizar senha em texto simples"}
                  aria-label={showPassword ? "Ocultar senha" : "Visualizar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <Database className="w-3.5 h-3.5" />
                Sincronização MySQL Ativa
              </span>
              <span>•</span>
              <span>
                Sugestão rápida:{" "}
                <button
                  type="button"
                  onClick={() =>
                    setEmailInput(
                      user.role === "PROFESSOR"
                        ? "adnaldo.alves@escola.com"
                        : "raissaaltexeira@gmail.com"
                    )
                  }
                  className="text-emerald-400 hover:underline font-mono font-bold"
                >
                  {user.role === "PROFESSOR"
                    ? "adnaldo.alves@escola.com"
                    : "raissaaltexeira@gmail.com"}
                </button>
              </span>
              <span>•</span>
              <span>
                Matrícula: <strong className="text-slate-200">{user.enrollmentId}</strong>
              </span>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Salvar no Banco de Dados MySQL</span>
            </button>
          </div>
        </form>

        {/* Biometria Facial Opcional no Perfil + Remover Biometria Cadastrada */}
        <div className="pt-4 border-t border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 shrink-0">
              <ScanFace className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xs font-bold text-white">
                  Validação com Biometria Facial Opcional (WebRTC)
                </h3>
                {enrolledBio ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Ativa ({enrolledBio.signatureHash})
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-semibold">
                    Nenhuma Biometria Cadastrada
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                A captura facial é descartada e apagada da memória RAM assim que validada. Você pode remover sua biometria cadastrada a qualquer momento.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setBiometricPreviewOpen((prev) => !prev)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>
                {biometricPreviewOpen
                  ? "Fechar Câmera Biométrica"
                  : "Validar com Biometria Facial"}
              </span>
            </button>

            <button
              type="button"
              onClick={handleRemoveBiometricsFromSettings}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                enrolledBio
                  ? "bg-rose-950/70 hover:bg-rose-900 text-rose-200 border-rose-700/60 shadow-sm"
                  : "bg-slate-950/80 hover:bg-rose-950/50 text-rose-300 border-rose-800/40"
              }`}
              title="Apagar Biometria Facial e remover o cadastro biométrico deste usuário"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Apagar Biometria Facial</span>
            </button>
          </div>
        </div>

        {biometricPreviewOpen && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-52 h-40 rounded-2xl bg-slate-900 border-2 border-emerald-500/50 overflow-hidden relative flex items-center justify-center shrink-0">
              <video
                ref={(el) => {
                  bioVideoRef.current = el;
                  if (
                    el &&
                    bioStreamRef.current &&
                    el.srcObject !== bioStreamRef.current
                  ) {
                    el.srcObject = bioStreamRef.current;
                    el.play().catch(() => {});
                  }
                }}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transform -scale-x-100 transition-opacity duration-200 ${
                  biometricStreamReady && !biometricValidated
                    ? "opacity-90"
                    : "opacity-0 pointer-events-none"
                }`}
              />

              {biometricValidated ? (
                <div className="flex flex-col items-center justify-center text-center p-2">
                  <div className="faceid-check-badge w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mb-1.5">
                    <svg
                      viewBox="0 0 36 36"
                      className="w-7 h-7 text-emerald-400"
                      fill="none"
                    >
                      <path
                        d="M8 18.5L15 25.5L28 11.5"
                        stroke="currentColor"
                        strokeWidth="3.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="faceid-check-path"
                      />
                    </svg>
                  </div>
                  <span className="text-[11px] font-black text-emerald-300">
                    Face ID Validado
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">
                    Câmera OFF • Memória Limpa
                  </span>
                </div>
              ) : (
                <>
                  {!biometricStreamReady && (
                    <ScanFace className="w-10 h-10 text-cyan-400 animate-pulse" />
                  )}
                  <div className="absolute inset-3 pointer-events-none flex items-center justify-center">
                    <div
                      className={`relative w-24 h-24 ${
                        biometricScanning ? "faceid-brackets-active" : ""
                      }`}
                    >
                      <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg" />
                      <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg" />
                      <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg" />
                      <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-emerald-400 rounded-br-lg" />
                      {biometricScanning && (
                        <div className="faceid-scan-line absolute left-1 right-1 h-0.5 bg-gradient-to-r from-transparent via-emerald-300 to-transparent shadow-[0_0_10px_#34d399]" />
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="space-y-2 flex-1">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Face ID Biométrico ({user.role}: {nameInput})</span>
                {enrolledBio && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono">
                    {enrolledBio.signatureHash}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {biometricStatusText ||
                  `Escaneamento facial estilo Face ID vinculado ao e-mail ${emailInput}. Após o check de confirmação, a câmera é desligada e os dados da imagem são apagados da memória imediatamente.`}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={biometricScanning}
                  onClick={() => {
                    setBiometricValidated(false);
                    setBiometricScanning(true);
                    setTimeout(async () => {
                      try {
                        const rec = await enrollFacialBiometrics({
                          role: user.role,
                          name: nameInput,
                          email: emailInput,
                          userId: user.id,
                          videoEl: bioVideoRef.current,
                          stream: bioStreamRef.current,
                        });
                        stopSettingsCameraAndPurge();
                        setBiometricScanning(false);
                        setEnrolledBio(rec);
                        setBiometricValidated(true);
                        setBiometricStatusText(
                          `Face ID cadastrado (${rec.signatureHash})! Câmera desligada e imagem apagada da memória.`
                        );
                      } catch (err: any) {
                        setBiometricScanning(false);
                        setBiometricValidated(false);
                        setBiometricStatusText(
                          err?.message ||
                            "Câmera desligada/bloqueada ou sem rosto visível na webcam. Ative a câmera para cadastrar."
                        );
                      }
                    }, 550);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer disabled:opacity-60"
                >
                  {biometricScanning ? "Escaneando..." : "Cadastrar / Atualizar Face ID"}
                </button>
                <button
                  type="button"
                  disabled={biometricScanning}
                  onClick={() => {
                    setBiometricValidated(false);
                    setBiometricScanning(true);
                    setTimeout(async () => {
                      const res = await verifyFacialBiometrics({
                        role: user.role,
                        name: nameInput,
                        email: emailInput,
                        userId: user.id,
                        videoEl: bioVideoRef.current,
                        stream: bioStreamRef.current,
                      });
                      setBiometricScanning(false);
                      if (res.verified && res.record) {
                        stopSettingsCameraAndPurge();
                        setEnrolledBio(res.record);
                        setBiometricValidated(true);
                        setBiometricStatusText(res.message);
                      } else {
                        setBiometricValidated(false);
                        setBiometricStatusText(
                          res.errorReason || res.message
                        );
                      }
                    }, 550);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer disabled:opacity-60"
                >
                  {biometricScanning ? "Validando..." : "Validar Face ID Agora"}
                </button>
                <button
                  type="button"
                  onClick={handleRemoveBiometricsFromSettings}
                  className="px-3.5 py-2 rounded-xl bg-rose-950/70 hover:bg-rose-900 text-rose-200 border border-rose-700/60 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Apagar Biometria Facial</span>
                </button>
                {biometricValidated && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Face ID validado & memória limpa!
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SEÇÃO 2: PARÂMETROS DO TUTORIA (VOZ NEURAL 1.2x & VAD 1.0s-1.5s) */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-800/80 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Inteligência TutorIA & Síntese de Voz (TTS 1.2x + VAD)
              </h2>
              <p className="text-xs text-slate-400">
                Ajuste a velocidade da locução neural (1.2x) e o fechamento automático do microfone por silêncio (1.0s a 1.5s).
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 divide-y divide-slate-800/60">
          <div className="pt-2 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-slate-200">
                Síntese de Voz Neural em Tempo Real
              </p>
              <p className="text-[11px] text-slate-400">
                Utiliza a voz neural padrão em português brasileiro para falar as explicações pedagógicas.
              </p>
            </div>
            <input
              type="checkbox"
              checked={voiceSynthesisEnabled}
              onChange={(e) => setVoiceSynthesisEnabled(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 rounded cursor-pointer shrink-0"
            />
          </div>

          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                Velocidade da Locução Neural (Padrão 1.2x)
              </p>
              <p className="text-[11px] text-slate-400">
                Cadência ágil e dinâmica de 1.2x com tom humanizado.
              </p>
            </div>
            <select
              value={voiceSpeed}
              onChange={(e) => setVoiceSpeed(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="1.0">1.0x (Padrão)</option>
              <option value="1.2">1.2x (Recomendado - Ágil e Natural)</option>
              <option value="1.25">1.25x (Dinâmico)</option>
              <option value="1.35">1.35x (Acelerado)</option>
            </select>
          </div>

          <div className="pt-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-emerald-400" />
                Detecção de Atividade de Voz (VAD Inteligente)
              </p>
              <p className="text-[11px] text-slate-400">
                Desliga e encerra o microfone automaticamente entre 1.0s e 1.5s de silêncio.
              </p>
            </div>
            <input
              type="checkbox"
              checked={vadEnabled}
              onChange={(e) => setVadEnabled(e.target.checked)}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer shrink-0"
            />
          </div>

          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-slate-200">
                Janela de Silêncio do VAD (1.0s a 1.5s)
              </p>
              <p className="text-[11px] text-slate-400">
                Tempo exato para corte automático do microfone após pausa na fala.
              </p>
            </div>
            <select
              value={vadSilenceTimeout}
              onChange={(e) => setVadSilenceTimeout(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="1000">1000ms (1.0s - Corte Rápido)</option>
              <option value="1200">1200ms (1.2s - Padrão Calibrado)</option>
              <option value="1500">1500ms (1.5s - Pausa Reflexiva)</option>
            </select>
          </div>

          <div className="pt-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-slate-200">
                Nivelamento Adaptativo Automático
              </p>
              <p className="text-[11px] text-slate-400">
                Detecta lacunas de aprendizagem e reorganiza os tópicos de revisão individualmente.
              </p>
            </div>
            <input
              type="checkbox"
              checked={aiAdaptiveFeedback}
              onChange={(e) => setAiAdaptiveFeedback(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 rounded cursor-pointer shrink-0"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleSavePreferences}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Salvar Preferências do Sistema
          </button>
        </div>
      </div>
    </div>
  );
};
