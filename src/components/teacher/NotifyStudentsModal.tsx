import React, { useState, useEffect } from "react";
import {
  X,
  Send,
  Users,
  AlertTriangle,
  MessageSquare,
  CheckSquare,
  Square,
  BookOpen,
} from "lucide-react";
import { TeacherAiRecommendation } from "../../types";
import { getBlueprintForDiscipline } from "../../data/pedagogicalPlansData";
import {
  CLASS_CODE,
  OFFICIAL_STUDENTS_LIST,
  getStudentOfficialEmail,
} from "../../data/studentsData";
import { GenericSilhouetteAvatar } from "../common/GenericSilhouetteAvatar";

export interface NotifyStudentsPayload {
  recommendationId: string;
  disciplineId: string;
  contentId?: string;
  disciplineName: string;
  topic: string;
  notificationTitle: string;
  messageBody: string;
  selectedStudents: string[];
  actionDestination: "content-study" | "atividades" | "tutor";
}

interface NotifyStudentsModalProps {
  isOpen: boolean;
  recommendation: TeacherAiRecommendation | null;
  teacherName?: string;
  onClose: () => void;
  onConfirmNotify: (payload: NotifyStudentsPayload) => void;
}

export const NotifyStudentsModal: React.FC<NotifyStudentsModalProps> = ({
  isOpen,
  recommendation,
  teacherName = "Prof. Adnaldo Alves",
  onClose,
  onConfirmNotify,
}) => {
  const [notificationTitle, setNotificationTitle] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [actionDestination, setActionDestination] = useState<
    "content-study" | "atividades" | "tutor"
  >("content-study");
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!recommendation) return;
    const bp = getBlueprintForDiscipline(
      recommendation.disciplineId || recommendation.disciplineName
    );
    setNotificationTitle(
      `Orientação Docente (${recommendation.disciplineName}): ${recommendation.topic}`
    );
    setMessageBody(
      `${bp.notificationTemplate}\n\nPré-requisito essencial para revisar: ${recommendation.prerequisiteIssue}.\nAção recomendada: ${recommendation.suggestedAction}.\n\nAtenciosamente,\n${teacherName} (${CLASS_CODE})`
    );
    setSelectedStudents([...recommendation.affectedStudents]);
    setActionDestination("content-study");
    setValidationError(null);
  }, [recommendation, teacherName, isOpen]);

  if (!isOpen || !recommendation) return null;

  const toggleStudent = (name: string) => {
    setSelectedStudents((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
    setValidationError(null);
  };

  const toggleSelectAll = () => {
    if (selectedStudents.length === recommendation.affectedStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents([...recommendation.affectedStudents]);
    }
    setValidationError(null);
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudents.length === 0) {
      setValidationError(
        "Selecione pelo menos 1 aluno destinatário para enviar a notificação."
      );
      return;
    }
    if (!messageBody.trim()) {
      setValidationError("A mensagem da notificação não pode ficar em branco.");
      return;
    }

    onConfirmNotify({
      recommendationId: recommendation.id,
      disciplineId: recommendation.disciplineId,
      contentId: recommendation.contentId,
      disciplineName: recommendation.disciplineName,
      topic: recommendation.topic,
      notificationTitle:
        notificationTitle.trim() ||
        `Comunicado de ${recommendation.disciplineName}: ${recommendation.topic}`,
      messageBody: messageBody.trim(),
      selectedStudents,
      actionDestination,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <form
        onSubmit={handleConfirm}
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-950/80 border-b border-slate-800 flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="font-bold text-indigo-300">
                  {recommendation.disciplineName}
                </span>
                <span aria-hidden="true">·</span>
                <span>{recommendation.topic}</span>
                <span aria-hidden="true">·</span>
                <span>Turma {CLASS_CODE}</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
                Notificar Alunos sobre Recomendação Pedagógica
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {validationError && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Recommendation Origin Summary */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-300">
                Recomendação de Origem ({recommendation.errorRate}% de erro)
              </span>
              <span className="text-slate-400">
                Pré-requisito: {recommendation.prerequisiteIssue}
              </span>
            </div>
            <p className="text-xs font-bold text-white">
              {recommendation.title}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              {recommendation.description}
            </p>
          </div>

          {/* Recipient Students Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-400" />
                Alunos Destinatários ({selectedStudents.length} de{" "}
                {recommendation.affectedStudents.length} selecionados)
              </span>
              <button
                type="button"
                onClick={toggleSelectAll}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {selectedStudents.length ===
                recommendation.affectedStudents.length
                  ? "Desmarcar todos"
                  : "Selecionar todos"}
              </button>
            </div>

            <div className="max-h-40 overflow-y-auto p-2.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              {recommendation.affectedStudents.map((stName) => {
                const isSelected = selectedStudents.includes(stName);
                const stRecord = OFFICIAL_STUDENTS_LIST.find(
                  (s) => s.name === stName
                );
                return (
                  <button
                    key={stName}
                    type="button"
                    onClick={() => toggleStudent(stName)}
                    className={`w-full p-2 rounded-xl border text-left flex items-center justify-between gap-2 transition-colors ${
                      isSelected
                        ? "bg-indigo-950/40 border-indigo-500/40 text-white"
                        : "bg-slate-900/60 border-slate-800 text-slate-400"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-indigo-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                      <GenericSilhouetteAvatar
                        size="xs"
                        role="ALUNO"
                        disableSessionAvatar={!stRecord?.isActiveProfile}
                      />
                      <div>
                        <span className="text-xs font-bold block">{stName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {stRecord?.enrollmentId || CLASS_CODE} ·{" "}
                          {getStudentOfficialEmail(stName)}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notification Title & Editable Message */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">
                Assunto / Título da Notificação
              </label>
              <input
                type="text"
                value={notificationTitle}
                onChange={(e) => setNotificationTitle(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">
                Mensagem Pedagógica para os Alunos (Editável)
              </label>
              <textarea
                rows={4}
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                Ação Direta ao Clicar na Notificação (Ambiente do Aluno)
              </label>
              <select
                value={actionDestination}
                onChange={(e) =>
                  setActionDestination(
                    e.target.value as "content-study" | "atividades" | "tutor"
                  )
                }
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="content-study">
                  Abrir Estudo do Tópico ({recommendation.topic} em{" "}
                  {recommendation.disciplineName})
                </option>
                <option value="atividades">
                  Abrir Lista de Questões Adaptativas de{" "}
                  {recommendation.disciplineName}
                </option>
                <option value="tutor">
                  Iniciar Sessão de Tutoria com TutorIA sobre{" "}
                  {recommendation.topic}
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>
              Confirmar e Enviar para {selectedStudents.length}{" "}
              {selectedStudents.length === 1 ? "Aluno" : "Alunos"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};
