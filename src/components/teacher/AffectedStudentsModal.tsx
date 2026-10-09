import React, { useState, useEffect } from "react";
import {
  X,
  AlertTriangle,
  Send,
  Sparkles,
  BookOpen,
  BrainCircuit,
  Layers,
  CheckCircle2,
  HelpCircle,
  CheckSquare,
  Square,
  MessageSquare,
} from "lucide-react";
import { DifficultyTopic } from "../../types";
import {
  OFFICIAL_STUDENTS_LIST,
  CLASS_CODE,
  getStudentBestLearningStyle,
} from "../../data/studentsData";
import { getDomainPedagogicalContent } from "../../data/pedagogicalPlansData";
import { GenericSilhouetteAvatar } from "../common/GenericSilhouetteAvatar";

interface AffectedStudentsModalProps {
  topic: DifficultyTopic | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmRemediation?: (details: {
    topicId: string;
    disciplineId?: string;
    disciplineName: string;
    topicName: string;
    format: LearningStyle;
    formatLabel: string;
    selectedStudents: string[];
    teacherNote: string;
  }) => void;
}

export type LearningStyle =
  | "flashcards"
  | "mapas-mentais"
  | "resumo-nivelamento"
  | "questoes-adaptativas";

const FORMAT_LABELS: Record<LearningStyle, string> = {
  flashcards: "Flashcards de Fixação",
  "mapas-mentais": "Mapa Mental Relacional",
  "resumo-nivelamento": "Resumo Escrito Estruturado",
  "questoes-adaptativas": "Questões Adaptativas Comentadas",
};

export const AffectedStudentsModal: React.FC<AffectedStudentsModalProps> = ({
  topic,
  isOpen,
  onClose,
  onConfirmRemediation,
}) => {
  const [activeStyle, setActiveStyle] = useState<LearningStyle>("flashcards");
  const [isSent, setIsSent] = useState(false);
  const [activeFlashcardIdx, setActiveFlashcardIdx] = useState(0);
  const [showFlashcardAnswer, setShowFlashcardAnswer] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [teacherNote, setTeacherNote] = useState("");

  useEffect(() => {
    if (topic && isOpen) {
      setSelectedStudents([...topic.affectedStudents]);
      setActiveFlashcardIdx(0);
      setShowFlashcardAnswer(false);
      setTeacherNote("");
      setIsSent(false);
    }
  }, [topic, isOpen]);

  if (!isOpen || !topic) return null;

  const domainContent = getDomainPedagogicalContent(
    topic.disciplineId || topic.disciplineName,
    topic.disciplineName,
    topic.topic,
    topic.prerequisiteIssue
  );

  const topicFlashcards = domainContent.flashcards;
  const mindMapNodes = domainContent.mindMapNodes;
  const writtenSummary = domainContent.writtenSummary;
  const adaptiveQuestions = domainContent.adaptiveQuestions;

  const toggleStudent = (name: string) => {
    setSelectedStudents((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const toggleAllStudents = () => {
    if (selectedStudents.length === topic.affectedStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents([...topic.affectedStudents]);
    }
  };

  const handleSendRemediation = () => {
    if (selectedStudents.length === 0) return;
    setIsSent(true);
    if (onConfirmRemediation) {
      onConfirmRemediation({
        topicId: topic.id,
        disciplineId: topic.disciplineId,
        disciplineName: topic.disciplineName,
        topicName: topic.topic,
        format: activeStyle,
        formatLabel: FORMAT_LABELS[activeStyle],
        selectedStudents,
        teacherNote: teacherNote.trim(),
      });
    }
    setTimeout(() => {
      setIsSent(false);
      onClose();
    }, 1900);
  };

  const safeCardIdx = Math.min(activeFlashcardIdx, Math.max(0, topicFlashcards.length - 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header Modal */}
        <div className="p-4 sm:p-6 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Reforço Pedagógico • {topic.disciplineName}
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  Turma {CLASS_CODE}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                {topic.topic}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Card de Diagnóstico do Pré-Requisito Crítico */}
          <div className="p-4 bg-amber-950/30 rounded-2xl border border-amber-500/30 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-amber-300">
              <span className="flex items-center gap-1.5 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Pré-Requisito Crítico Mapeado
              </span>
              <span className="text-rose-400 font-black">
                {topic.errorRate}% Taxa de Erro ({topic.affectedStudents.length} alunos)
              </span>
            </div>
            <p className="text-sm font-bold text-white">
              {topic.prerequisiteIssue}
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ação Recomendada: {topic.recommendedAction}
            </p>
          </div>

          {/* Abas de Estilos de Aprendizado para Nivelamento */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Recursos de Reforço Específicos de {topic.disciplineName}:
              </h3>
              <span className="text-[11px] text-slate-400">
                Escolha o formato para envio
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setActiveStyle("flashcards")}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1 ${
                  activeStyle === "flashcards"
                    ? "bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-950/40"
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Flashcards</span>
                </div>
                <span className="text-[10px] text-slate-400 leading-tight">
                  {topicFlashcards.length} cards da matéria
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveStyle("mapas-mentais")}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1 ${
                  activeStyle === "mapas-mentais"
                    ? "bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-950/40"
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <BrainCircuit className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mapas Mentais</span>
                </div>
                <span className="text-[10px] text-slate-400 leading-tight">
                  {mindMapNodes.length} nós conceituais
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveStyle("resumo-nivelamento")}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1 ${
                  activeStyle === "resumo-nivelamento"
                    ? "bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-950/40"
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Resumo Escrito</span>
                </div>
                <span className="text-[10px] text-slate-400 leading-tight">
                  Revisão estruturada
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveStyle("questoes-adaptativas")}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1 ${
                  activeStyle === "questoes-adaptativas"
                    ? "bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-950/40"
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Questões Adaptativas</span>
                </div>
                <span className="text-[10px] text-slate-400 leading-tight">
                  Prática comentada
                </span>
              </button>
            </div>

            {/* Painel do Estilo Selecionado */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              {activeStyle === "flashcards" && topicFlashcards[safeCardIdx] && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-bold text-indigo-300">
                      Flashcard {safeCardIdx + 1} de {topicFlashcards.length} • {topic.disciplineName}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowFlashcardAnswer(!showFlashcardAnswer)}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold underline text-[11px]"
                    >
                      {showFlashcardAnswer ? "Ocultar Resposta" : "Revelar Resposta Pedagógica"}
                    </button>
                  </div>

                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-700/80 space-y-2">
                    <p className="text-xs font-bold text-white">
                      Pergunta: {topicFlashcards[safeCardIdx].question}
                    </p>
                    {showFlashcardAnswer && (
                      <p className="text-xs text-emerald-300 border-t border-slate-800 pt-2 leading-relaxed">
                        💡 {topicFlashcards[safeCardIdx].answer}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      disabled={safeCardIdx === 0}
                      onClick={() => {
                        setActiveFlashcardIdx((prev) => Math.max(0, prev - 1));
                        setShowFlashcardAnswer(false);
                      }}
                      className="text-xs text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      ← Anterior
                    </button>
                    <button
                      type="button"
                      disabled={safeCardIdx === topicFlashcards.length - 1}
                      onClick={() => {
                        setActiveFlashcardIdx((prev) =>
                          Math.min(topicFlashcards.length - 1, prev + 1)
                        );
                        setShowFlashcardAnswer(false);
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-bold disabled:opacity-30"
                    >
                      Próximo Card →
                    </button>
                  </div>
                </div>
              )}

              {activeStyle === "mapas-mentais" && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-emerald-400 block">
                    Grafo Conceitual de {topic.disciplineName} ({topic.topic}):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {mindMapNodes.map((node, i) => (
                      <div
                        key={i}
                        className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between gap-2 text-xs"
                      >
                        <div>
                          <p className="font-bold text-white">{node.label}</p>
                          <p className="text-[10px] text-slate-400">{node.desc}</p>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 shrink-0">
                          Nó #{i + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeStyle === "resumo-nivelamento" && (
                <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                  <p className="font-bold text-amber-300">
                    Síntese Estruturada de Nivelamento — {topic.disciplineName}:
                  </p>
                  <p className="text-justify bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-slate-200 leading-relaxed">
                    {writtenSummary}
                  </p>
                </div>
              )}

              {activeStyle === "questoes-adaptativas" && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-rose-400 block">
                    Questões Diagnósticas Adaptativas ({adaptiveQuestions.length}):
                  </span>
                  <div className="space-y-3">
                    {adaptiveQuestions.map((q, qIdx) => (
                      <div
                        key={qIdx}
                        className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-xs"
                      >
                        <p className="font-bold text-white">
                          {qIdx + 1}. {q.question}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {q.options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className={`px-2.5 py-1.5 rounded-lg border text-[11px] ${
                                oIdx === q.correctAnswer
                                  ? "bg-emerald-950/50 border-emerald-500/40 text-emerald-300 font-bold"
                                  : "bg-slate-950 border-slate-800 text-slate-400"
                              }`}
                            >
                              {String.fromCharCode(65 + oIdx)}) {opt}
                            </div>
                          ))}
                        </div>
                        <p className="text-[11px] text-indigo-300 bg-indigo-950/40 border border-indigo-500/20 px-2.5 py-1.5 rounded-lg">
                          <strong>Gabarito Comentado:</strong> {q.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Observação Opcional do Professor */}
          <div>
            <label className="text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              Observação Pedagógica do Professor (Opcional)
            </label>
            <textarea
              rows={2}
              value={teacherNote}
              onChange={(e) => setTeacherNote(e.target.value)}
              placeholder={`Ex.: Revisar os exemplos de ${topic.topic} antes da próxima aula prática...`}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Lista Nominal dos Alunos Afetados com Seleção */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                Alunos Afetados Selecionados ({selectedStudents.length} de {topic.affectedStudents.length}):
              </h4>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleAllStudents}
                  className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 underline"
                >
                  {selectedStudents.length === topic.affectedStudents.length
                    ? "Desmarcar todos"
                    : "Selecionar todos"}
                </button>
                <span className="text-xs font-mono font-bold text-rose-400">
                  Turma: {OFFICIAL_STUDENTS_LIST.length} alunos
                </span>
              </div>
            </div>

            <div className="max-h-56 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-800/40">
              {topic.affectedStudents.map((stName, idx) => {
                const studentData = OFFICIAL_STUDENTS_LIST.find(
                  (s) =>
                    s.name.toLowerCase() === stName.toLowerCase() ||
                    s.name.includes(stName) ||
                    stName.includes(s.name.split(" ")[0])
                );
                const bestStyle = studentData
                  ? getStudentBestLearningStyle(studentData)
                  : null;
                const isChecked = selectedStudents.includes(stName);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStudent(stName)}
                    className={`pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs cursor-pointer transition-opacity ${
                      isChecked ? "opacity-100" : "opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStudent(stName);
                        }}
                        className="text-indigo-400 hover:text-indigo-300"
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-indigo-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600" />
                        )}
                      </button>
                      <GenericSilhouetteAvatar size="sm" />
                      <div>
                        <p className="font-bold text-white">{stName}</p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {studentData
                            ? `Matrícula: ${studentData.enrollmentId}`
                            : `Estudante Turma ${CLASS_CODE}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {bestStyle && (
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1"
                          title={bestStyle.description}
                        >
                          <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                          <span>{bestStyle.badge}</span>
                        </span>
                      )}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {isChecked ? "Receberá Reforço" : "Não selecionado"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-950/60 border-t border-slate-800 flex items-center gap-3 shrink-0">
          <button
            type="button"
            disabled={isSent || selectedStudents.length === 0}
            onClick={handleSendRemediation}
            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSent ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  Reforço ({FORMAT_LABELS[activeStyle]}) enviado para {selectedStudents.length} aluno(s)!
                </span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>
                  Enviar Reforço ({FORMAT_LABELS[activeStyle]}) para {selectedStudents.length} Aluno(s)
                </span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
