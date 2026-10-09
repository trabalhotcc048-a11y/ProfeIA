import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Award,
  Clock,
  Flame,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  FileDown
} from "lucide-react";
import { Discipline, UserProfile, StudentActivityAttempt } from "../../types";
import { generateStudentActivityReportPdf } from "../../services/pdfReportGenerator";

interface ProgressViewProps {
  user: UserProfile;
  disciplines: Discipline[];
  attempts?: StudentActivityAttempt[];
  onSelectDiscipline: (id: string) => void;
  onOpenContent: (disciplineId: string, contentId: string) => void;
  onOpenTutor: (disciplineId: string, topic: string) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  user,
  disciplines,
  attempts = [],
  onSelectDiscipline,
  onOpenContent,
  onOpenTutor,
}) => {
  const [pdfFeedback, setPdfFeedback] = useState<string | null>(null);

  const handleExportStudentPdf = () => {
    try {
      const fileName = generateStudentActivityReportPdf({
        studentName: user.name || "Estudante",
        attempts,
        disciplines,
      });
      setPdfFeedback(`Relatório PDF "${fileName}" gerado com sucesso com histórico de subconceitos!`);
      setTimeout(() => setPdfFeedback(null), 5000);
    } catch {
      setPdfFeedback("Erro ao gerar o relatório em PDF.");
      setTimeout(() => setPdfFeedback(null), 4000);
    }
  };

  // Average progress across all 15 disciplines
  const overallAvg = Math.round(
    disciplines.reduce((acc, d) => acc + d.progressPercent, 0) /
      disciplines.length
  );

  return (
    <div className="space-y-8 pb-12">
      {pdfFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-between gap-3 shadow-xl animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{pdfFeedback}</span>
          </div>
          <button
            type="button"
            onClick={() => setPdfFeedback(null)}
            className="px-2.5 py-1 rounded-lg bg-slate-950/20 hover:bg-slate-950/30 text-slate-950 text-xs font-bold"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Relatório de Desempenho e Evolução
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
            Dashboard de Progresso
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Métricas consolidadas de aprendizagem, tempo de estudo, taxa de acerto e evolução contínua em todas as disciplinas.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportStudentPdf}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <FileDown className="w-4 h-4" />
          <span>Baixar Relatório (PDF)</span>
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold mb-2">
            <TrendingUp className="w-4 h-4" />
            Progresso Geral
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">
            {overallAvg}%
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Média das 14 disciplinas
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-orange-500 text-xs font-bold mb-2">
            <Flame className="w-4 h-4 fill-orange-500" />
            Sequência Ativa
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">
            {user.streakDays} dias
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Meta diária cumprida
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-cyan-600 text-xs font-bold mb-2">
            <Clock className="w-4 h-4" />
            Tempo Dedicado
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">
            {user.studyHoursTotal} horas
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Sessões síncronas e assíncronas
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold mb-2">
            <CheckCircle2 className="w-4 h-4" />
            Atividades Realizadas
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">
            38 / 45
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            84.4% de taxa de conclusão
          </p>
        </div>
      </div>

      {/* Progress per Discipline (All 14) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Progresso Individual por Disciplina (14)
            </h2>
            <p className="text-xs text-slate-500">
              Taxa de domínio e conclusão de conteúdos e atividades.
            </p>
          </div>
          <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
            14 Registros
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {disciplines.map((d) => (
            <div
              key={d.id}
              onClick={() => onSelectDiscipline(d.id)}
              className="p-3.5 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {d.name}
                </span>
                <span className="font-black text-indigo-700">
                  {d.progressPercent}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${d.progressPercent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dificuldades Mapeadas e Conteúdos para Revisar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dificuldades */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-rose-600">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <h3 className="text-base font-extrabold text-slate-900">
              Dificuldades Cognitivas Mapeadas
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Assuntos em que foram registrados erros reincidentes ou pré-requisitos não consolidados.
          </p>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80">
              <div className="flex justify-between items-start">
                <span className="text-xs font-black text-rose-950">
                  Equações do 2º Grau: Sinal de Delta
                </span>
                <span className="text-[10px] font-bold bg-rose-200 text-rose-800 px-2 py-0.5 rounded-full">
                  Crítico
                </span>
              </div>
              <p className="text-xs text-rose-800/90 mt-1 leading-relaxed">
                Tendência a errar o produto -4ac quando 'c' ou 'b' é negativo.
              </p>
              <button
                onClick={() => onOpenTutor("matematica", "Equações do 2º Grau e Bhaskara")}
                className="mt-2 text-xs font-bold text-indigo-700 hover:underline flex items-center gap-1"
              >
                Praticar com TutorIA <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
              <div className="flex justify-between items-start">
                <span className="text-xs font-black text-amber-950">
                  Banco de Dados: Cláusula ON em INNER JOIN
                </span>
                <span className="text-[10px] font-bold bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">
                  Moderado
                </span>
              </div>
              <p className="text-xs text-amber-800/90 mt-1 leading-relaxed">
                Esquecimento ocasional de especificar a correspondência entre PK e FK.
              </p>
              <button
                onClick={() => onOpenContent("banco-de-dados", "bd-sql-consultas")}
                className="mt-2 text-xs font-bold text-indigo-700 hover:underline flex items-center gap-1"
              >
                Revisar Conceito <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdos para Revisar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-indigo-600">
            <RotateCcw className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-extrabold text-slate-900">
              Conteúdos Sugeridos para Revisão
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Baseados na curva de esquecimento de Ebbinghaus e intervalos de repetição espaçada.
          </p>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-indigo-200">
                  Prática de Estágio e TCC
                </span>
                <h4 className="text-xs font-bold text-slate-900 mt-1">
                  Estruturação Rigorosa do TCC e Produto Tecnológico
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Revisar antes da entrega do pré-projeto.
                </p>
              </div>
              <button
                onClick={() =>
                  onOpenContent("pratica-estagio-tcc", "tcc-estrutura-completa")
                }
                className="px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Revisar
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-indigo-200">
                  Biologia
                </span>
                <h4 className="text-xs font-bold text-slate-900 mt-1">
                  Ácidos Nucleicos: DNA, RNA e Síntese Proteica
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Fixar regra de pareamento A-T e C-G.
                </p>
              </div>
              <button
                onClick={() => onOpenContent("biologia", "bio-dna-rna")}
                className="px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Revisar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
