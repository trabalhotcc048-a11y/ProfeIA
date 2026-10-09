import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  Users,
  AlertTriangle,
  BookOpen,
  Send,
  Check,
  MessageSquare,
  CheckSquare,
  Square,
  GraduationCap,
} from "lucide-react";
import { TopicDifficultyStat } from "../../types";
import { CLASS_CODE, CLASS_NAME } from "../../data/studentsData";
import { loadTeacherClasses } from "../../data/teacherData";
import { GenericSilhouetteAvatar } from "../common/GenericSilhouetteAvatar";

interface ScheduleLevelingModalProps {
  isOpen: boolean;
  topic: TopicDifficultyStat | null;
  onClose: () => void;
  onConfirmSchedule?: (details: {
    topicId: string;
    disciplineId?: string;
    topicName: string;
    disciplineName: string;
    className: string;
    date: string;
    time: string;
    format: string;
    teacherNote?: string;
    affectedStudents: string[];
  }) => void;
}

export const ScheduleLevelingModal: React.FC<ScheduleLevelingModalProps> = ({
  isOpen,
  topic,
  onClose,
  onConfirmSchedule,
}) => {
  const [selectedDate, setSelectedDate] = useState("2026-04-18");
  const [selectedTime, setSelectedTime] = useState("14:30");
  const [selectedFormat, setSelectedFormat] = useState(
    "Oficina Prática de Resolução de Problemas"
  );
  const [selectedClass, setSelectedClass] = useState(
    `${CLASS_CODE} — ${CLASS_NAME}`
  );
  const [teacherNote, setTeacherNote] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [availableClasses, setAvailableClasses] = useState<string[]>([
    `${CLASS_CODE} — ${CLASS_NAME}`,
  ]);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && topic) {
      setSelectedStudents([...topic.affectedStudents]);
      setTeacherNote("");
      setIsSuccess(false);
      const classes = loadTeacherClasses();
      const opts = classes.map((c) => `${c.accessCode} — ${c.name}`);
      if (opts.length > 0) {
        setAvailableClasses(opts);
        setSelectedClass(opts[0]);
      }
    }
  }, [isOpen, topic]);

  if (!isOpen || !topic) return null;

  const toggleStudent = (st: string) => {
    setSelectedStudents((prev) =>
      prev.includes(st) ? prev.filter((item) => item !== st) : [...prev, st]
    );
  };

  const toggleAll = () => {
    if (selectedStudents.length === topic.affectedStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents([...topic.affectedStudents]);
    }
  };

  const formatBrDate = (isoDate: string) => {
    const parts = isoDate.split("-");
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return isoDate;
  };

  const handleConfirm = () => {
    if (selectedStudents.length === 0) return;
    setIsSuccess(true);
    if (onConfirmSchedule) {
      onConfirmSchedule({
        topicId: topic.id,
        disciplineId: topic.disciplineId,
        topicName: topic.topic,
        disciplineName: topic.disciplineName,
        className: selectedClass,
        date: selectedDate,
        time: selectedTime,
        format: selectedFormat,
        teacherNote: teacherNote.trim(),
        affectedStudents: selectedStudents,
      });
    }

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="p-8 sm:p-10 flex flex-col items-center text-center space-y-4 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-white">
              Tutoria e Nivelamento Agendados!
            </h3>
            <p className="text-sm text-slate-300 max-w-md">
              A sessão para <strong>{topic.topic}</strong> ({topic.disciplineName}) foi confirmada na turma <strong>{selectedClass}</strong>. Uma notificação automática com data e roteiro foi registrada para <strong>{selectedStudents.length} aluno(s)</strong>.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-xs text-slate-300">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                {formatBrDate(selectedDate)} às {selectedTime} • {selectedFormat}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-1 min-h-0 max-h-[92vh] overflow-hidden">
            {/* Scrollable Content */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-5 flex-1 min-h-0">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                    {topic.disciplineName}
                  </span>
                  <span className="text-xs text-rose-400 font-bold">
                    {topic.errorRate}% Taxa de Erro
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Agendar Tutoria / Nivelamento
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Tópico foco: <strong className="text-slate-200">{topic.topic}</strong>
                </p>
              </div>

              {/* Diagnostic Box */}
              <div className="p-4 bg-slate-950/80 rounded-2xl border border-amber-500/30 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Pré-requisito Crítico a ser Nivelado</span>
                </div>
                <p className="text-sm font-bold text-amber-200">
                  {topic.prerequisiteIssue}
                </p>
                <p className="text-xs text-slate-400">
                  Ação recomendada: <strong>{topic.recommendedAction}</strong>
                </p>
              </div>

              {/* Turma Selector */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                  Turma Vinculada
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  {availableClasses.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    Data da Sessão
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    Horário
                  </label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Format Selection */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  Formato Pedagógico da Sessão
                </label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Oficina Prática de Resolução de Problemas">
                    Oficina Prática de Resolução de Problemas
                  </option>
                  <option value="Roteiro Socrático & Mediação em Debates">
                    Roteiro Socrático & Mediação em Debates
                  </option>
                  <option value="Laboratório de Simulação Viva de Cenários">
                    Laboratório de Simulação Viva de Cenários
                  </option>
                  <option value="Estudo Dirigido com Flashcards e Mapas Mentais">
                    Estudo Dirigido com Flashcards e Mapas Mentais
                  </option>
                </select>
              </div>

              {/* Teacher Note */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                  Observação Opcional do Professor
                </label>
                <textarea
                  rows={2}
                  value={teacherNote}
                  onChange={(e) => setTeacherNote(e.target.value)}
                  placeholder="Ex.: Trazer caderno de anotações e dúvidas sobre o pré-requisito..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Recipients Summary with Checkboxes */}
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-rose-400" />
                    Alunos Convocados ({selectedStudents.length} de {topic.affectedStudents.length}):
                  </span>
                  <button
                    type="button"
                    onClick={toggleAll}
                    className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 underline"
                  >
                    {selectedStudents.length === topic.affectedStudents.length
                      ? "Desmarcar todos"
                      : "Selecionar todos"}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                  {topic.affectedStudents.map((st, i) => {
                    const isChecked = selectedStudents.includes(st);
                    return (
                      <button
                        type="button"
                        key={i}
                        onClick={() => toggleStudent(st)}
                        className={`inline-flex items-center gap-1.5 text-[11px] border px-2.5 py-1 rounded-lg transition-all ${
                          isChecked
                            ? "bg-indigo-950/60 border-indigo-500/40 text-white"
                            : "bg-slate-900 border-slate-800 text-slate-500"
                        }`}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-3 h-3 text-indigo-400" />
                        ) : (
                          <Square className="w-3 h-3 text-slate-600" />
                        )}
                        <GenericSilhouetteAvatar size="xs" />
                        <span>{st}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Actions (Sticky at bottom, always reachable) */}
            <div className="p-4 sm:px-8 bg-slate-950/95 border-t border-slate-800 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={selectedStudents.length === 0}
                onClick={handleConfirm}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  Confirmar Agendamento ({selectedStudents.length} alunos)
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
