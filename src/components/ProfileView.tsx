import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Mail,
  GraduationCap,
  Award,
  Clock,
  Flame,
  BookOpen,
  Calendar,
  LogOut,
  ShieldCheck,
  Edit3,
  Check,
  Sparkles,
  Camera,
  X,
} from "lucide-react";
import { UserProfile } from "../types";
import {
  OFFICIAL_STUDENTS_LIST,
  CLASS_CODE,
  OfficialStudent,
} from "../data/studentsData";
import {
  GenericSilhouetteAvatar,
  getSavedProfileAvatar,
  saveProfileAvatar,
  processImageFileToDataUrl,
  AVATAR_UPDATED_EVENT,
} from "./common/GenericSilhouetteAvatar";
import { TeacherClassesManager } from "./teacher/TeacherClassesManager";

interface ProfileViewProps {
  user: UserProfile;
  userName?: string;
  userAvatar?: string;
  onUpdateName?: (newName: string) => void;
  onUpdateAvatar?: (newAvatar: string) => void;
  onOpenLogin: () => void;
  onToggleRole?: () => void;
  onSelectOfficialStudent?: (student: OfficialStudent) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  userName = user.name,
  userAvatar,
  onUpdateName,
  onUpdateAvatar,
  onOpenLogin,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const currentDisplayName = user.role === "PROFESSOR" ? user.name : userName;
  const [editedName, setEditedName] = useState(currentDisplayName);
  const [currentAvatar, setCurrentAvatar] = useState<string>(() =>
    userAvatar || getSavedProfileAvatar(user.role, user.id)
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setEditedName(user.role === "PROFESSOR" ? user.name : userName);
  }, [user.name, userName, user.role]);

  useEffect(() => {
    const syncAvatar = () => {
      setCurrentAvatar(getSavedProfileAvatar(user.role, user.id));
    };
    syncAvatar();
    window.addEventListener(AVATAR_UPDATED_EVENT, syncAvatar);
    window.addEventListener("storage", syncAvatar);
    return () => {
      window.removeEventListener(AVATAR_UPDATED_EVENT, syncAvatar);
      window.removeEventListener("storage", syncAvatar);
    };
  }, [user.role, user.id]);

  const handleSaveName = () => {
    if (editedName.trim() && onUpdateName) {
      onUpdateName(editedName.trim());
      setIsEditing(false);
    }
  };

  const handleTriggerPhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await processImageFileToDataUrl(file);
      saveProfileAvatar(dataUrl, user.role, user.id);
      setCurrentAvatar(dataUrl);
      onUpdateAvatar?.(dataUrl);
    } catch (err) {
      console.error("Erro ao atualizar foto de perfil:", err);
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto select-none">
      {/* Profile Header (Aluno e Professor) */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-center gap-6">
        {/* Avatar com Ícone de Câmara e Botão 'Alterar Foto' */}
        <div className="relative flex flex-col items-center gap-2.5 shrink-0">
          <div
            onClick={handleTriggerPhotoUpload}
            className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-400 shadow-xl ring-4 ring-slate-800 cursor-pointer group overflow-visible"
            title="Clique para alterar a foto de perfil (.png, .jpg, .jpeg)"
          >
            <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
              {currentAvatar ? (
                <img
                  src={currentAvatar}
                  alt={`Foto de perfil de ${currentDisplayName}`}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <User className="w-14 h-14 text-slate-400" />
              )}
            </div>

            {/* Overlay no hover sobre o avatar */}
            <div className="absolute inset-0 rounded-full bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white">
              <Camera className="w-6 h-6 text-emerald-400" />
              <span className="text-[10px] font-bold">Alterar Foto</span>
            </div>

            {/* Ícone de Câmara sobre o canto inferior direito do avatar */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleTriggerPhotoUpload();
              }}
              className="absolute -bottom-1 -right-1 w-9 h-9 bg-indigo-600 hover:bg-indigo-500 text-white border-2 border-slate-900 rounded-full shadow-lg flex items-center justify-center transition-transform group-hover:scale-110"
              title="Alterar Foto de Perfil"
              aria-label="Alterar Foto de Perfil"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Botão explícito 'Alterar Foto' */}
          <button
            type="button"
            onClick={handleTriggerPhotoUpload}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 hover:border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-emerald-400" />
            <span>Alterar Foto</span>
          </button>

          {/* Input de arquivo local (.png, .jpg, .jpeg) */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,image/png,image/jpeg"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2 min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            {!isEditing ? (
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  {user.role === "PROFESSOR" ? user.name : userName}
                </h1>
                {onUpdateName && (
                  <button
                    onClick={() => {
                      setEditedName(
                        user.role === "PROFESSOR" ? user.name : userName
                      );
                      setIsEditing(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 transition-colors"
                    title={
                      user.role === "PROFESSOR"
                        ? "Alterar Nome do Docente"
                        : "Editar Nome"
                    }
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-base font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors"
                  title="Salvar Nome"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
              </div>
            )}

            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
              {user.role}
            </span>
          </div>

          <p className="text-xs text-slate-400 font-medium">{user.email}</p>
          <p className="text-xs text-slate-300 mt-1">
            {user.course} • {user.turma}
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-[11px] text-slate-400 font-mono">
            <span>
              Matrícula:{" "}
              <strong className="text-emerald-400">{user.enrollmentId}</strong>
            </span>
            <span>•</span>
            <span>
              Perfil:{" "}
              <strong className="text-slate-300">
                {currentAvatar ? "Foto Personalizada" : "Padrão"}
              </strong>
            </span>
            <span>•</span>
            <span>
              Ano Letivo: <strong>2026</strong>
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <button
            onClick={onOpenLogin}
            className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            title="Desconectar da sessão atual e retornar ao Login"
          >
            <LogOut className="w-3.5 h-3.5" /> Desconectar / Trocar de Conta
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 text-center">
          <Flame className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
          <span className="text-2xl font-black text-white block">
            {user.streakDays} Dias
          </span>
          <span className="text-[11px] text-slate-400 font-semibold">
            {user.role === "PROFESSOR" ? "Regência Ativa" : "Sequência Ativa"}
          </span>
        </div>

        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 text-center">
          <Clock className="w-5 h-5 text-indigo-400 mx-auto mb-1.5" />
          <span className="text-2xl font-black text-white block">
            {user.studyHoursTotal} Horas
          </span>
          <span className="text-[11px] text-slate-400 font-semibold">
            {user.role === "PROFESSOR"
              ? "Orientação & Tutoria"
              : "Tempo de Estudo"}
          </span>
        </div>

        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 text-center">
          <BookOpen className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
          <span className="text-2xl font-black text-white block">
            {user.role === "PROFESSOR" ? "26 Alunos" : "15 Matérias"}
          </span>
          <span className="text-[11px] text-slate-400 font-semibold">
            {user.role === "PROFESSOR"
              ? `Turma ${CLASS_CODE}`
              : "Grade Curricular"}
          </span>
        </div>

        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 text-center">
          <ShieldCheck className="w-5 h-5 text-teal-400 mx-auto mb-1.5" />
          <span className="text-2xl font-black text-emerald-400 block">
            Ativa
          </span>
          <span className="text-[11px] text-slate-400 font-semibold">
            {user.role === "PROFESSOR" ? "Docência Regular" : "Status Regular"}
          </span>
        </div>
      </div>

      {/* SEÇÃO DE GESTÃO E CADASTRO DE TURMAS (Painel do Perfil do Professor) */}
      {user.role === "PROFESSOR" && (
        <TeacherClassesManager teacherName={user.name || "Prof. Adnaldo Alves"} />
      )}

      {/* RELAÇÃO OFICIAL DA TURMA INFVES3SB (26 ALUNOS) */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-0.5 rounded-full border border-emerald-500/20">
                Turma Oficial {CLASS_CODE}
              </span>
              <span className="text-xs text-slate-400">
                26 Alunos Matriculados
              </span>
            </div>
            <h3 className="text-lg font-black text-white">
              Relação Oficial de Estudantes da Turma {CLASS_CODE}
            </h3>
            <p className="text-xs text-slate-400">
              Para entrar com outra conta de estudante ou professor, clique em
              "Desconectar / Trocar de Conta" acima para retornar à tela inicial
              de Login.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {OFFICIAL_STUDENTS_LIST.map((student) => {
            const isSelected =
              student.name.toLowerCase() === userName.toLowerCase();
            return (
              <div
                key={student.id}
                className={`p-3.5 rounded-2xl border text-left flex items-center justify-between ${
                  isSelected
                    ? "bg-indigo-950/40 border-indigo-500 shadow-md ring-1 ring-indigo-500/30"
                    : "bg-slate-950/50 border-slate-800"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <GenericSilhouetteAvatar
                    size="md"
                    role="ALUNO"
                    userId={student.id}
                  />
                  <div className="min-w-0">
                    <p
                      className={`text-xs font-bold truncate ${
                        isSelected
                          ? "text-indigo-300 font-black"
                          : "text-white"
                      }`}
                    >
                      {student.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">
                      {student.enrollmentId}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[9px] text-emerald-400 font-semibold">
                        Debates: {student.metrics.debatesLearningGain}
                      </span>
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <span className="shrink-0 text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/30">
                    Logado
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
