import React, { useState, useEffect } from "react";
import {
  Plus,
  Users,
  BookOpen,
  Calendar,
  Clock,
  KeyRound,
  Copy,
  Check,
  Edit3,
  Trash2,
  ExternalLink,
  RefreshCw,
  X,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { CLASS_CODE, OFFICIAL_STUDENTS_LIST } from "../../data/studentsData";

export type ClassShift = "Matutino" | "Vespertino" | "Noturno";

export interface TeacherManagedClass {
  id: string;
  name: string;
  discipline: string;
  academicYearSemester: string;
  shift: ClassShift;
  accessCode: string;
  studentsCount: number;
  createdAt: string;
  isOfficialDefault?: boolean;
}

const STORAGE_KEY = "profeia_teacher_classes_v1";
export const CLASSES_UPDATED_EVENT = "profeia-teacher-classes-updated";

const DEFAULT_TEACHER_CLASSES: TeacherManagedClass[] = [
  {
    id: "cls-infves3sb",
    name: "Turma INFVES3SB - Técnico Integrado",
    discipline: "Inteligência Artificial & Banco de Dados",
    academicYearSemester: "2026.1",
    shift: "Vespertino",
    accessCode: CLASS_CODE,
    studentsCount: OFFICIAL_STUDENTS_LIST.length,
    createdAt: "2026-02-10",
    isOfficialDefault: true,
  },
  {
    id: "cls-3ano-b",
    name: "3º Ano B - Ensino Médio",
    discipline: "Matemática",
    academicYearSemester: "2026.1",
    shift: "Matutino",
    accessCode: "MAT3B-7429",
    studentsCount: 32,
    createdAt: "2026-02-15",
  },
  {
    id: "cls-2ano-a",
    name: "2º Ano A - Ensino Médio",
    discipline: "Física",
    academicYearSemester: "2026.1",
    shift: "Noturno",
    accessCode: "FIS2A-9184",
    studentsCount: 28,
    createdAt: "2026-03-01",
  },
];

export function generateClassAccessCode(
  className = "",
  discipline = ""
): string {
  const cleanDisc = discipline
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z]/g, "")
    .toUpperCase()
    .slice(0, 3);
  const prefix = cleanDisc.length >= 2 ? cleanDisc : "TRM";

  const cleanClass = className
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 2);

  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let randomPart = "";
  for (let i = 0; i < 4; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `${prefix}${cleanClass ? cleanClass : "26"}-${randomPart}`;
}

export function getSavedTeacherClasses(): TeacherManagedClass[] {
  if (typeof window === "undefined") return DEFAULT_TEACHER_CLASSES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(DEFAULT_TEACHER_CLASSES)
      );
      return DEFAULT_TEACHER_CLASSES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return DEFAULT_TEACHER_CLASSES;
  } catch {
    return DEFAULT_TEACHER_CLASSES;
  }
}

export function saveTeacherClasses(classes: TeacherManagedClass[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
    window.dispatchEvent(new CustomEvent(CLASSES_UPDATED_EVENT));
  } catch (e) {
    console.warn("Erro ao salvar turmas no localStorage:", e);
  }
}

interface TeacherClassesManagerProps {
  teacherName?: string;
  onAccessClass?: (cls: TeacherManagedClass) => void;
}

const SUGGESTED_DISCIPLINES = [
  "Matemática",
  "Física",
  "Inteligência Artificial",
  "Banco de Dados",
  "Programação & Algoritmos",
  "Química",
  "Biologia",
  "História",
  "Geografia",
  "Língua Portuguesa",
  "Desenvolvimento Web",
  "Redes de Computadores",
];

export const TeacherClassesManager: React.FC<TeacherClassesManagerProps> = ({
  teacherName = "Prof. Adnaldo Alves",
  onAccessClass,
}) => {
  const [classes, setClasses] = useState<TeacherManagedClass[]>(() =>
    getSavedTeacherClasses()
  );

  // Modal state (Create / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);

  // Form fields
  const [className, setClassName] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [academicYearSemester, setAcademicYearSemester] = useState("2026.1");
  const [shift, setShift] = useState<ClassShift>("Vespertino");
  const [accessCode, setAccessCode] = useState("");
  const [studentsCount, setStudentsCount] = useState<number>(26);
  const [formError, setFormError] = useState<string | null>(null);

  // Active viewed class modal / drawer when clicking "Acessar Turma"
  const [accessedClass, setAccessedClass] =
    useState<TeacherManagedClass | null>(null);

  // Delete confirmation state (inline / modal without window.alert)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Feedback toast & copied code state
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const syncClasses = () => {
      setClasses(getSavedTeacherClasses());
    };
    window.addEventListener(CLASSES_UPDATED_EVENT, syncClasses);
    window.addEventListener("storage", syncClasses);
    return () => {
      window.removeEventListener(CLASSES_UPDATED_EVENT, syncClasses);
      window.removeEventListener("storage", syncClasses);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const handleOpenCreateModal = () => {
    setEditingClassId(null);
    setClassName("");
    setDiscipline("");
    setAcademicYearSemester("2026.1");
    setShift("Vespertino");
    setAccessCode(generateClassAccessCode("3B", "MAT"));
    setStudentsCount(25);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cls: TeacherManagedClass) => {
    setEditingClassId(cls.id);
    setClassName(cls.name);
    setDiscipline(cls.discipline);
    setAcademicYearSemester(cls.academicYearSemester);
    setShift(cls.shift);
    setAccessCode(cls.accessCode);
    setStudentsCount(cls.studentsCount);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleRegenerateCode = () => {
    setAccessCode(generateClassAccessCode(className, discipline));
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = className.trim();
    const trimmedDisc = discipline.trim();
    const trimmedYear = academicYearSemester.trim();
    const trimmedCode =
      accessCode.trim() || generateClassAccessCode(trimmedName, trimmedDisc);

    if (!trimmedName) {
      setFormError("Por favor, informe o Nome da Turma.");
      return;
    }
    if (!trimmedDisc) {
      setFormError("Por favor, informe a Disciplina / Matéria.");
      return;
    }
    if (!trimmedYear) {
      setFormError("Por favor, informe o Ano Letivo / Semestre.");
      return;
    }

    if (editingClassId) {
      const updated = classes.map((c) =>
        c.id === editingClassId
          ? {
              ...c,
              name: trimmedName,
              discipline: trimmedDisc,
              academicYearSemester: trimmedYear,
              shift,
              accessCode: trimmedCode.toUpperCase(),
              studentsCount: Math.max(0, Number(studentsCount) || 0),
            }
          : c
      );
      setClasses(updated);
      saveTeacherClasses(updated);
      showToast(`Turma "${trimmedName}" atualizada com sucesso!`);
    } else {
      const newClass: TeacherManagedClass = {
        id: `cls-${Date.now()}`,
        name: trimmedName,
        discipline: trimmedDisc,
        academicYearSemester: trimmedYear,
        shift,
        accessCode: trimmedCode.toUpperCase(),
        studentsCount: Math.max(0, Number(studentsCount) || 0),
        createdAt: new Date().toISOString().slice(0, 10),
      };
      const updated = [newClass, ...classes];
      setClasses(updated);
      saveTeacherClasses(updated);
      showToast(
        `Nova turma "${trimmedName}" criada com o código ${newClass.accessCode}!`
      );
    }

    setIsModalOpen(false);
    setEditingClassId(null);
  };

  const handleRemoveClass = (id: string) => {
    const target = classes.find((c) => c.id === id);
    const updated = classes.filter((c) => c.id !== id);
    setClasses(updated);
    saveTeacherClasses(updated);
    setConfirmDeleteId(null);
    if (accessedClass?.id === id) {
      setAccessedClass(null);
    }
    if (target) {
      showToast(`Turma "${target.name}" removida com sucesso.`);
    }
  };

  const handleCopyAccessCode = (id: string, code: string) => {
    try {
      navigator.clipboard?.writeText(code);
    } catch {}
    setCopiedCodeId(id);
    setTimeout(() => {
      setCopiedCodeId((prev) => (prev === id ? null : prev));
    }, 2000);
  };

  const getShiftBadgeStyle = (s: ClassShift) => {
    switch (s) {
      case "Matutino":
        return "bg-amber-500/15 text-amber-300 border-amber-500/30";
      case "Vespertino":
        return "bg-sky-500/15 text-sky-300 border-sky-500/30";
      case "Noturno":
        return "bg-indigo-500/15 text-indigo-300 border-indigo-500/30";
    }
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
      {/* Feedback Toast */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-300 hover:text-white text-xs font-black"
          >
            ✕
          </button>
        </div>
      )}

      {/* Cabeçalho da Seção: Gestão e Cadastro de Turmas + Botão '+ Nova Turma' */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-indigo-300 bg-indigo-500/15 px-3 py-0.5 rounded-full border border-indigo-500/30 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Portal Docente • {teacherName}
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              {classes.length}{" "}
              {classes.length === 1 ? "turma ativa" : "turmas ativas"}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Gestão e Cadastro de Turmas
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Crie novas turmas, gere códigos de acesso para os estudantes e
            gerencie suas disciplinas por turno e semestre letivo.
          </p>
        </div>

        {/* 1. Botão Destacado '+ Nova Turma' */}
        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Nova Turma</span>
        </button>
      </div>

      {/* 3. Visualização em Grelha / Grid de Cards Modernos */}
      {classes.length === 0 ? (
        <div className="p-10 rounded-2xl bg-slate-950/60 border border-dashed border-slate-800 text-center space-y-3">
          <GraduationCap className="w-10 h-10 text-slate-500 mx-auto" />
          <p className="text-sm font-bold text-slate-300">
            Nenhuma turma cadastrada no momento.
          </p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Clique no botão &ldquo;+ Nova Turma&rdquo; acima para cadastrar sua
            primeira turma e gerar automaticamente o código de acesso para os
            alunos.
          </p>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nova Turma</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls) => {
            const isDeleting = confirmDeleteId === cls.id;
            const isCopied = copiedCodeId === cls.id;

            return (
              <div
                key={cls.id}
                className="group relative rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 p-5 flex flex-col justify-between gap-4 shadow-lg hover:shadow-indigo-950/30 transition-all"
              >
                <div className="space-y-3">
                  {/* Topo do Card: Turno + Ano/Semestre */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getShiftBadgeStyle(
                        cls.shift
                      )}`}
                    >
                      Turno {cls.shift}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {cls.academicYearSemester}
                    </span>
                  </div>

                  {/* Nome da Turma & Disciplina */}
                  <div>
                    <h3 className="text-base font-black text-white group-hover:text-indigo-200 transition-colors leading-snug">
                      {cls.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold mt-1">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{cls.discipline}</span>
                    </div>
                  </div>

                  {/* Métricas Rápidas: Quantidade de Alunos & Código de Acesso */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/90 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0">
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 block leading-none">
                          Inscritos
                        </span>
                        <strong className="text-xs font-black text-white">
                          {cls.studentsCount} alunos
                        </strong>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/90 flex items-center justify-between gap-1.5">
                      <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 block leading-none">
                          Código de Acesso
                        </span>
                        <strong className="text-xs font-mono font-black text-amber-300 truncate block mt-0.5">
                          {cls.accessCode}
                        </strong>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyAccessCode(cls.id, cls.accessCode)
                        }
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0 cursor-pointer"
                        title="Copiar código de acesso da turma"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Rodapé do Card: Botões Rápidos ('Acessar Turma', 'Editar', 'Remover') */}
                {isDeleting ? (
                  <div className="pt-3 border-t border-rose-900/50 flex items-center justify-between gap-2 bg-rose-950/25 -mx-2 px-2 py-1.5 rounded-xl">
                    <span className="text-[11px] font-bold text-rose-200">
                      Confirmar exclusão?
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleRemoveClass(cls.id)}
                        className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-black cursor-pointer"
                      >
                        Sim, Remover
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAccessedClass(cls);
                        onAccessClass?.(cls);
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Acessar Turma</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(cls)}
                      className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Editar Turma"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                      <span>Editar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(cls.id)}
                      className="py-2 px-2.5 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Remover Turma"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>Remover</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Visualização Rápida ao Clicar em "Acessar Turma" */}
      {accessedClass && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl text-white">
            <div className="p-6 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border-b border-slate-800 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getShiftBadgeStyle(
                      accessedClass.shift
                    )}`}
                  >
                    Turno {accessedClass.shift}
                  </span>
                  <span className="text-xs font-mono text-indigo-300 font-bold">
                    Semestre {accessedClass.academicYearSemester}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white">
                  {accessedClass.name}
                </h3>
                <p className="text-xs text-emerald-300 font-semibold mt-0.5">
                  Disciplina: {accessedClass.discipline}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAccessedClass(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">
                    Código de Acesso dos Alunos
                  </span>
                  <div className="flex items-center justify-between mt-1">
                    <strong className="text-base font-mono font-black text-amber-300">
                      {accessedClass.accessCode}
                    </strong>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyAccessCode(
                          accessedClass.id,
                          accessedClass.accessCode
                        )
                      }
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedCodeId === accessedClass.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">
                    Estudantes Inscritos
                  </span>
                  <strong className="text-base font-black text-white mt-1 block">
                    {accessedClass.studentsCount} alunos ativos
                  </strong>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">
                    Professor Responsável
                  </span>
                  <strong className="text-sm font-black text-emerald-300 mt-1 block truncate">
                    {teacherName}
                  </strong>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200 space-y-1.5">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Sincronização Ativa com o TutorIA</span>
                </div>
                <p className="leading-relaxed text-slate-300">
                  Os estudantes matriculados em{" "}
                  <strong className="text-white">{accessedClass.name}</strong>{" "}
                  utilizam o código{" "}
                  <strong className="text-amber-300 font-mono">
                    {accessedClass.accessCode}
                  </strong>{" "}
                  para ingressar na turma e recebem acompanhamento adaptativo em{" "}
                  <strong className="text-emerald-300">
                    {accessedClass.discipline}
                  </strong>
                  .
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const target = accessedClass;
                    setAccessedClass(null);
                    handleOpenEditModal(target);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                  <span>Editar Dados da Turma</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAccessedClass(null)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black cursor-pointer"
                >
                  Concluído
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal / Formulário de Cadastro e Edição de Turma */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl text-white">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {editingClassId
                      ? "Editar Turma Cadastrada"
                      : "Cadastrar Nova Turma"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Preencha os dados acadêmicos da turma para gerar o acesso
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveClass} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-xs text-rose-200 font-semibold">
                  {formError}
                </div>
              )}

              {/* Campo 1: Nome da Turma */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Nome da Turma *
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => {
                    const nextName = e.target.value;
                    setClassName(nextName);
                    if (!editingClassId) {
                      setAccessCode(
                        generateClassAccessCode(nextName, discipline)
                      );
                    }
                  }}
                  placeholder="Ex.: 3º Ano B - Ensino Médio"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
              </div>

              {/* Campo 2: Disciplina / Matéria */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Disciplina / Matéria *
                </label>
                <input
                  type="text"
                  list="profeia-suggested-disciplines"
                  value={discipline}
                  onChange={(e) => {
                    const nextDisc = e.target.value;
                    setDiscipline(nextDisc);
                    if (!editingClassId) {
                      setAccessCode(
                        generateClassAccessCode(className, nextDisc)
                      );
                    }
                  }}
                  placeholder="Ex.: Matemática, Física, Inteligência Artificial"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <datalist id="profeia-suggested-disciplines">
                  {SUGGESTED_DISCIPLINES.map((d) => (
                    <option key={d} value={d} />
                  ))}
                </datalist>
              </div>

              {/* Campo 3 e 4: Ano Letivo / Semestre & Turno */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Ano Letivo / Semestre *
                  </label>
                  <input
                    type="text"
                    value={academicYearSemester}
                    onChange={(e) => setAcademicYearSemester(e.target.value)}
                    placeholder="Ex.: 2026.1"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Turno *
                  </label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value as ClassShift)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Matutino">Matutino</option>
                    <option value="Vespertino">Vespertino</option>
                    <option value="Noturno">Noturno</option>
                  </select>
                </div>
              </div>

              {/* Campo 5: Código de Acesso da Turma (gerado automaticamente) & Alunos Inscritos */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Código de Acesso da Turma (Automático)
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <KeyRound className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={accessCode}
                        onChange={(e) =>
                          setAccessCode(e.target.value.toUpperCase())
                        }
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-amber-500/40 rounded-xl text-xs sm:text-sm font-mono font-black text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleRegenerateCode}
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                      title="Gerar novo código automático"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Nº de Alunos
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={200}
                    value={studentsCount}
                    onChange={(e) =>
                      setStudentsCount(Math.max(0, parseInt(e.target.value) || 0))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Botões do Modal */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  {editingClassId ? "Salvar Alterações" : "Criar Turma"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
