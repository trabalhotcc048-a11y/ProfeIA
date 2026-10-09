import React, { useState } from "react";
import {
  FolderGit2,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  Sparkles,
  UploadCloud,
  FileText,
  AlertCircle,
  Paperclip,
  ArrowRight,
  Code2,
  GraduationCap,
  Layers,
  ChevronRight,
  FileCheck2,
  Check
} from "lucide-react";
import { ProjectTracking } from "../../types";

interface ProjectsViewProps {
  project?: ProjectTracking;
  onOpenTutor: (disciplineId: string, topic: string) => void;
}

type ProjectDisciplineTab = "praest" | "apsis";

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  project,
  onOpenTutor,
}) => {
  const [activeTab, setActiveTab] = useState<ProjectDisciplineTab>("praest");

  // PraEsT Deliveries State
  const [praestFiles, setPraestFiles] = useState([
    {
      name: "TCC_Pre_Projeto_Raissa_Teixeira_v2_Aprovado.pdf",
      size: "2.4 MB",
      date: "14 Mar 2026",
      status: "Avaliado",
    },
    {
      name: "Termo_Compromisso_Estagio_Supervisionado_Assinado.pdf",
      size: "1.1 MB",
      date: "28 Fev 2026",
      status: "Homologado",
    },
  ]);

  // AP Sis Deliveries State
  const [apsisFiles, setApsisFiles] = useState([
    {
      name: "AP_Sis_Documento_Requisitos_RF_RNF_v1.docx",
      size: "1.8 MB",
      date: "22 Mar 2026",
      status: "Avaliado",
    },
    {
      name: "Diagrama_Casos_de_Uso_UML_v3.png",
      size: "950 KB",
      date: "04 Abr 2026",
      status: "Em Revisão",
    },
  ]);

  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newFile = {
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        date: "Hoje às " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "Enviado",
      };

      if (activeTab === "praest") {
        setPraestFiles((prev) => [newFile, ...prev]);
      } else {
        setApsisFiles((prev) => [newFile, ...prev]);
      }
    }
  };

  return (
    <div className="space-y-8 pb-12 select-none">
      {/* ==================================================================== */}
      {/* HEADER BANNER & DISCIPLINE SWITCHER (PraEsT vs AP Sis)               */}
      {/* ==================================================================== */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
              Projetos & TCC
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Acompanhamento de Entregas & Prazos Oficiais
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Gestão de Projetos Acadêmicos
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Monitore o cronograma de entregas, feedbacks docentes e submissões para as disciplinas obrigatórias de Prática de Estágio / TCC (PraEsT) e Análise e Projeto de Sistemas (AP Sis).
          </p>
        </div>

        {/* Action Button: Consult TutorIA */}
        <button
          onClick={() =>
            onOpenTutor(
              activeTab === "praest" ? "pratica-estagio-tcc" : "analise-projeto-sistemas",
              activeTab === "praest"
                ? "Estruturação Rigorosa do TCC e Monografia"
                : "Engenharia de Requisitos e Modelagem UML"
            )
          }
          className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all transform hover:scale-[1.02] shrink-0"
        >
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>Consultar TutorIA ({activeTab === "praest" ? "PraEsT" : "AP Sis"})</span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* DUAL-TRACK DISCIPLINE SELECTOR TABS                                  */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Tab 1: PraEsT */}
        <button
          onClick={() => setActiveTab("praest")}
          className={`p-5 rounded-3xl border-2 text-left transition-all flex items-start justify-between relative overflow-hidden group ${
            activeTab === "praest"
              ? "bg-gradient-to-br from-slate-900 to-slate-800 border-emerald-500 shadow-xl shadow-emerald-950/40"
              : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400"
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                PraEsT
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                Cód: PRAEST-03
              </span>
            </div>
            <h3 className="text-base font-black text-white group-hover:text-emerald-300 transition-colors">
              Prática de Estágio & TCC
            </h3>
            <p className="text-xs text-slate-400">
              Orientador: Prof. Dr. Ricardo Vasconcelos
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-black text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30">
              60% Concluído
            </span>
            <span className="block text-[11px] text-slate-500 mt-2">
              Próx: 20 de Abril
            </span>
          </div>
        </button>

        {/* Tab 2: AP Sis */}
        <button
          onClick={() => setActiveTab("apsis")}
          className={`p-5 rounded-3xl border-2 text-left transition-all flex items-start justify-between relative overflow-hidden group ${
            activeTab === "apsis"
              ? "bg-gradient-to-br from-slate-900 to-slate-800 border-indigo-500 shadow-xl shadow-indigo-950/40"
              : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400"
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                AP Sis
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                Cód: APSIS-03
              </span>
            </div>
            <h3 className="text-base font-black text-white group-hover:text-indigo-300 transition-colors">
              Análise e Projeto de Sistemas
            </h3>
            <p className="text-xs text-slate-400">
              Docente: Profª Drª Beatriz Alencar
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-black text-indigo-400 bg-indigo-950/80 px-2.5 py-1 rounded-full border border-indigo-500/30">
              70% Concluído
            </span>
            <span className="block text-[11px] text-slate-500 mt-2">
              Próx: 18 de Abril
            </span>
          </div>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* ACTIVE TRACK CONTENT: PRAEST (TCC / ESTÁGIO)                         */}
      {/* ==================================================================== */}
      {activeTab === "praest" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <span className="text-xs text-slate-400 font-semibold block">
                Tema de Pesquisa
              </span>
              <p className="text-xs font-bold text-white mt-1">
                Plataforma Educacional Inclusiva com IA Adaptativa
              </p>
              <span className="text-[11px] text-emerald-400 font-medium block mt-1">
                Linha: Informática na Educação
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <span className="text-xs text-slate-400 font-semibold block">
                Horas de Estágio Concluídas
              </span>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-2xl font-black text-emerald-400">120h</span>
                <span className="text-xs text-slate-400">de 160h obrigatórias</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "75%" }} />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <span className="text-xs text-slate-400 font-semibold block">
                Próxima Entrega Crítica
              </span>
              <p className="text-sm font-black text-amber-300 mt-1">
                20 de Abril de 2026
              </p>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Revisão Bibliográfica & Fundamentação Teórica
              </span>
            </div>
          </div>

          {/* PraEsT Deliveries Roadmap */}
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                Cronograma Oficial de Entregas - PraEsT
              </h2>
              <span className="text-xs text-slate-400">Ano Letivo 2026</span>
            </div>

            <div className="space-y-4">
              {[
                {
                  id: "pr-1",
                  title: "1. Delimitação do Tema & Justificativa Científica",
                  desc: "Problematização, objetivos gerais e específicos, referencial preliminar e aceite do orientador.",
                  status: "concluido",
                  grade: "Nota 9.8",
                  date: "28 de Fevereiro de 2026",
                },
                {
                  id: "pr-2",
                  title: "2. Revisão Bibliográfica & Metodologia (ABNT)",
                  desc: "Estado da arte em aprendizagem adaptativa, taxonomia de Bloom e metodologia de desenvolvimento.",
                  status: "em_andamento",
                  date: "20 de Abril de 2026",
                },
                {
                  id: "pr-3",
                  title: "3. Relatório Técnico de Estágio Supervisionado",
                  desc: "Comprovação de frequência, atividades desenvolvidas em campo e validação institucional.",
                  status: "em_andamento",
                  date: "05 de Maio de 2026",
                },
                {
                  id: "pr-4",
                  title: "4. Artigo Científico Completo & Produto Tecnológico",
                  desc: "Redação do artigo nos moldes SBC/ABNT com protótipo funcional e resultados preliminares.",
                  status: "pendente",
                  date: "15 de Junho de 2026",
                },
                {
                  id: "pr-5",
                  title: "5. Banca Avaliadora Presencial & Defesa do TCC",
                  desc: "Apresentação perante banca examinadora com arguição e avaliação final.",
                  status: "pendente",
                  date: "30 de Junho de 2026",
                },
              ].map((stage, idx) => (
                <div
                  key={stage.id}
                  className={`p-5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    stage.status === "concluido"
                      ? "border-emerald-500/40 bg-emerald-950/20"
                      : stage.status === "em_andamento"
                      ? "border-amber-500/40 bg-amber-950/20"
                      : "border-slate-800 bg-slate-950/40"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">
                        Etapa 0{idx + 1}
                      </span>
                      {stage.grade && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {stage.grade}
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          stage.status === "concluido"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : stage.status === "em_andamento"
                            ? "bg-amber-500/20 text-amber-300 animate-pulse"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {stage.status.replace("_", " ")}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {stage.title}
                    </h3>
                    <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                      {stage.desc}
                    </p>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[11px] text-slate-400 block">Prazo Final</span>
                    <span className="text-xs font-bold text-slate-200">{stage.date}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Advisor Feedback */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-emerald-500/30 flex items-start gap-4">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black uppercase text-emerald-300 tracking-wider">
                  Parecer do Orientador & IA Pedagógica
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  "Raíssa, o delineamento do seu TCC em ProfeIA é exemplar. Para a próxima entrega de 20 de Abril, certifique-se de fundamentar teoricamente os princípios de repetição espaçada e mediação socrática, citando fontes indexadas (SciELO/IEEE)."
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* ACTIVE TRACK CONTENT: AP SIS (ANÁLISE E PROJETO DE SISTEMAS)         */}
      {/* ==================================================================== */}
      {activeTab === "apsis" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <span className="text-xs text-slate-400 font-semibold block">
                Projeto Prático da Disciplina
              </span>
              <p className="text-xs font-bold text-white mt-1">
                Engenharia de Software do Sistema ProfeIA
              </p>
              <span className="text-[11px] text-indigo-400 font-medium block mt-1">
                Arquitetura Client-Server & Modelagem UML
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <span className="text-xs text-slate-400 font-semibold block">
                Requisitos de Software Validados
              </span>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-2xl font-black text-indigo-400">18 RF / 8 RNF</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-medium block mt-1">
                Matriz de Rastreabilidade Concluída
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <span className="text-xs text-slate-400 font-semibold block">
                Próxima Entrega Crítica
              </span>
              <p className="text-sm font-black text-amber-300 mt-1">
                18 de Abril de 2026
              </p>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Diagramas de Casos de Uso (UML) e Cenários
              </span>
            </div>
          </div>

          {/* AP Sis Deliveries Roadmap */}
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-indigo-400" />
                Cronograma de Entregas - AP Sis (Análise e Projeto de Sistemas)
              </h2>
              <span className="text-xs text-slate-400">Módulo Técnico</span>
            </div>

            <div className="space-y-4">
              {[
                {
                  id: "aps-1",
                  title: "1. Documento de Visão e Escopo de Software",
                  desc: "Definição dos stakeholders, regras de negócio e objetivos estratégicos da aplicação.",
                  status: "concluido",
                  grade: "Nota 10.0",
                  date: "10 de Março de 2026",
                },
                {
                  id: "aps-2",
                  title: "2. Especificação de Requisitos (RF e RNF)",
                  desc: "Detalhamento de requisitos funcionais, critérios de aceitação e atributos de qualidade.",
                  status: "concluido",
                  grade: "Nota 9.5",
                  date: "25 de Março de 2026",
                },
                {
                  id: "aps-3",
                  title: "3. Modelagem de Diagramas de Casos de Uso (UML)",
                  desc: "Diagrama com atores (Aluno, Docente, TutorIA), relacionamentos include/extend e cenários.",
                  status: "em_andamento",
                  date: "18 de Abril de 2026",
                },
                {
                  id: "aps-4",
                  title: "4. Diagrama de Classes & Modelo Conceitual/Lógico",
                  desc: "Mapeamento das entidades do domínio, atributos, visibilidade e cardinalidade das tabelas.",
                  status: "pendente",
                  date: "02 de Maio de 2026",
                },
                {
                  id: "aps-5",
                  title: "5. Diagrama de Sequência & Arquitetura em Camadas",
                  desc: "Interação temporal de chamadas entre UI, Controladores, Serviços de IA e Banco de Dados.",
                  status: "pendente",
                  date: "22 de Maio de 2026",
                },
                {
                  id: "aps-6",
                  title: "6. Protótipo Interativo & Plano de Testes de Software",
                  desc: "Validação da interface, heurísticas de Nielsen e casos de teste unitários e de integração.",
                  status: "pendente",
                  date: "08 de Junho de 2026",
                },
              ].map((stage, idx) => (
                <div
                  key={stage.id}
                  className={`p-5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    stage.status === "concluido"
                      ? "border-indigo-500/40 bg-indigo-950/20"
                      : stage.status === "em_andamento"
                      ? "border-amber-500/40 bg-amber-950/20"
                      : "border-slate-800 bg-slate-950/40"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">
                        Entrega 0{idx + 1}
                      </span>
                      {stage.grade && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {stage.grade}
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          stage.status === "concluido"
                            ? "bg-indigo-500/20 text-indigo-300"
                            : stage.status === "em_andamento"
                            ? "bg-amber-500/20 text-amber-300 animate-pulse"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {stage.status.replace("_", " ")}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {stage.title}
                    </h3>
                    <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                      {stage.desc}
                    </p>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[11px] text-slate-400 block">Prazo Final</span>
                    <span className="text-xs font-bold text-slate-200">{stage.date}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Engineering Feedback */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-blue-950/40 border border-indigo-500/30 flex items-start gap-4">
              <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black uppercase text-indigo-300 tracking-wider">
                  Avaliação Docente de AP Sis
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  "Parabéns pelo documento de requisitos. Para o Diagrama de Casos de Uso, destaque o fluxo do TutorIA em tempo real como caso de uso estendido (extend) com pontos de extensão para o nivelamento automático."
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SHARED FILE UPLOAD & REPOSITORY SECTION                             */}
      {/* ==================================================================== */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-emerald-400" />
            <span>Repositório de Arquivos & Entregas ({activeTab === "praest" ? "PraEsT" : "AP Sis"})</span>
          </h2>
          <span className="text-xs text-slate-400">Formatos aceitos: PDF, DOCX, ZIP, PNG</span>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              const file = e.dataTransfer.files[0];
              const newFile = {
                name: file.name,
                size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
                date: "Hoje às " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                status: "Enviado",
              };
              if (activeTab === "praest") setPraestFiles((prev) => [newFile, ...prev]);
              else setApsisFiles((prev) => [newFile, ...prev]);
            }
          }}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            dragOver
              ? "border-emerald-400 bg-emerald-950/30"
              : "border-slate-700 bg-slate-950/40 hover:border-slate-600"
          }`}
        >
          <UploadCloud className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
          <p className="text-xs sm:text-sm font-bold text-white">
            Arraste seu arquivo da entrega aqui ou clique para selecionar
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Arquivos enviados são automaticamente auditados para verificação de normas e requisitos.
          </p>
          <label className="mt-4 inline-block px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-md">
            Selecionar do Computador
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Uploaded Files List */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400">
            Arquivos Submetidos Recentemente:
          </span>
          {(activeTab === "praest" ? praestFiles : apsisFiles).map((file, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-bold text-slate-200 truncate">{file.name}</span>
                <span className="text-slate-500 text-[11px] shrink-0">({file.size})</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] text-slate-400">{file.date}</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                  {file.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
