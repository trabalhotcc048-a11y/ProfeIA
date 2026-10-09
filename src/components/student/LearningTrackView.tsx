import React from "react";
import {
  CheckCircle2,
  Play,
  Lock,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ChevronRight,
  BookOpen
} from "lucide-react";
import { Discipline } from "../../types";

interface LearningTrackViewProps {
  disciplines: Discipline[];
  onOpenContent: (disciplineId: string, contentId: string) => void;
  onOpenTutor: (disciplineId: string, topic: string) => void;
}

export const LearningTrackView: React.FC<LearningTrackViewProps> = ({
  disciplines,
  onOpenContent,
  onOpenTutor,
}) => {
  // Synthesize learning track stages across key topics
  const trackNodes = [
    {
      id: "node-1",
      disciplineId: "matematica",
      contentId: "mat-eq-2-grau",
      disciplineName: "Matemática",
      title: "Conjuntos Numéricos e Operações",
      status: "concluido" as const,
      grade: 95,
      description: "Operações fundamentais, frações e propriedades dos números reais.",
    },
    {
      id: "node-2",
      disciplineId: "matematica",
      contentId: "mat-eq-2-grau",
      disciplineName: "Matemática",
      title: "Fatoração de Polinômios e Produtos Notáveis",
      status: "revisao" as const,
      grade: 62,
      description: "Identificada necessidade de reforço em fatoração por agrupamento.",
    },
    {
      id: "node-3",
      disciplineId: "matematica",
      contentId: "mat-eq-2-grau",
      disciplineName: "Matemática",
      title: "Equações do 2º Grau e Bhaskara",
      status: "atual" as const,
      grade: 70,
      description: "Conteúdo ativo da semana com simulação de raízes no TutorIA.",
    },
    {
      id: "node-4",
      disciplineId: "analise-projeto-sistemas",
      contentId: "aps-requisitos-uml",
      disciplineName: "Análise e Projeto de Sistemas",
      title: "Requisitos de Software e Casos de Uso UML",
      status: "recomendado" as const,
      grade: 88,
      description: "Recomendado pela IA para complementar o desenvolvimento do TCC.",
    },
    {
      id: "node-5",
      disciplineId: "pratica-estagio-tcc",
      contentId: "tcc-estrutura-completa",
      disciplineName: "Prática de Estágio e TCC",
      title: "Problema de Pesquisa e Justificativa",
      status: "dificuldade" as const,
      grade: 55,
      description: "Ponto de atenção: delimitação do problema e hipóteses científicas.",
    },
    {
      id: "node-6",
      disciplineId: "banco-de-dados",
      contentId: "bd-sql-consultas",
      disciplineName: "Banco de Dados",
      title: "Consultas Relacionais com INNER e LEFT JOIN",
      status: "proximo" as const,
      grade: 0,
      description: "Próxima etapa desbloqueada do itinerário formativo.",
    },
    {
      id: "node-7",
      disciplineId: "desenvolvimento-web",
      contentId: "web-js-async",
      disciplineName: "Desenvolvimento Web",
      title: "APIs Assíncronas, Fetch e Consumo REST",
      status: "bloqueado" as const,
      grade: 0,
      description: "Requer conclusão do módulo de Banco de Dados Relacional.",
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Trilha de Aprendizagem Adaptativa
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
            Seu Roteiro Personalizado
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Acompanhe o status de cada etapa: concluído, atual, revisão, recomendação ou bloqueado conforme o seu ritmo cognitivo.
          </p>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Concluído
          </div>
          <div className="flex items-center gap-1.5 text-indigo-700 font-bold">
            <Play className="w-3.5 h-3.5 fill-indigo-600" /> Atual
          </div>
          <div className="flex items-center gap-1.5 text-amber-700 font-bold">
            <RotateCcw className="w-3.5 h-3.5" /> Em Revisão
          </div>
          <div className="flex items-center gap-1.5 text-rose-700 font-bold">
            <AlertTriangle className="w-3.5 h-3.5" /> Dificuldade
          </div>
          <div className="flex items-center gap-1.5 text-purple-700 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Recomendação
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 font-bold">
            <Lock className="w-3.5 h-3.5" /> Bloqueado
          </div>
        </div>
      </div>

      {/* Visual Timeline Path */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
        {trackNodes.map((node, i) => {
          let badgeBg = "bg-slate-100 text-slate-600";
          let badgeBorder = "border-slate-200";
          let icon = <BookOpen className="w-4 h-4" />;

          if (node.status === "concluido") {
            badgeBg = "bg-emerald-500 text-white shadow-emerald-200 shadow-md";
            icon = <CheckCircle2 className="w-4 h-4" />;
          } else if (node.status === "atual") {
            badgeBg = "bg-indigo-600 text-white shadow-indigo-200 shadow-md ring-4 ring-indigo-100";
            icon = <Play className="w-4 h-4 fill-white" />;
          } else if (node.status === "revisao") {
            badgeBg = "bg-amber-500 text-white shadow-amber-200 shadow-md";
            icon = <RotateCcw className="w-4 h-4" />;
          } else if (node.status === "dificuldade") {
            badgeBg = "bg-rose-500 text-white shadow-rose-200 shadow-md";
            icon = <AlertTriangle className="w-4 h-4" />;
          } else if (node.status === "recomendado") {
            badgeBg = "bg-purple-600 text-white shadow-purple-200 shadow-md";
            icon = <Sparkles className="w-4 h-4" />;
          } else if (node.status === "bloqueado") {
            badgeBg = "bg-slate-300 text-slate-600";
            icon = <Lock className="w-4 h-4" />;
          }

          return (
            <div key={node.id} className="relative flex items-start gap-4">
              {/* Timeline Marker */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center -translate-x-7 sm:-translate-x-8 shrink-0 transition-transform ${badgeBg}`}
              >
                {icon}
              </div>

              {/* Node Card */}
              <div
                className={`flex-1 bg-white rounded-2xl p-5 border-2 transition-all ${
                  node.status === "atual"
                    ? "border-indigo-500 shadow-md"
                    : node.status === "dificuldade"
                    ? "border-rose-200"
                    : "border-slate-200 hover:border-indigo-300"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {node.disciplineName}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                          node.status === "concluido"
                            ? "bg-emerald-100 text-emerald-800"
                            : node.status === "atual"
                            ? "bg-indigo-100 text-indigo-800"
                            : node.status === "revisao"
                            ? "bg-amber-100 text-amber-800"
                            : node.status === "dificuldade"
                            ? "bg-rose-100 text-rose-800"
                            : node.status === "recomendado"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {node.status}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 mt-1">
                      {node.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {node.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center pt-2 sm:pt-0">
                    {node.status !== "bloqueado" && (
                      <button
                        onClick={() => onOpenTutor(node.disciplineId, node.title)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-indigo-600" />
                        TutorIA
                      </button>
                    )}

                    {node.status !== "bloqueado" ? (
                      <button
                        onClick={() => onOpenContent(node.disciplineId, node.contentId)}
                        className="px-4 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
                      >
                        Acessar <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> Bloqueado
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
