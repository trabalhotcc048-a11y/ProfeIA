import React from "react";
import {
  Sparkles,
  Flame,
  Target,
  Clock,
  BookOpen,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Video,
  Layers,
  ChevronRight,
  Compass,
  Play,
  Scale,
  Cpu,
  TrendingUp
} from "lucide-react";
import { UserProfile, Discipline, ActivityQuestion, StudentActivityAttempt } from "../../types";
import { GenericSilhouetteAvatar } from "../common/GenericSilhouetteAvatar";
import { StudentJourneyMap } from "./StudentJourneyMap";

interface StudentHomeProps {
  user: UserProfile;
  disciplines: Discipline[];
  questions: ActivityQuestion[];
  attempts?: StudentActivityAttempt[];
  lastStudied?: { disciplineId: string; contentId: string };
  onOpenTutor: (disciplineId?: string, topic?: string) => void;
  onSelectDiscipline: (disciplineId: string) => void;
  onOpenContent: (disciplineId: string, contentId: string) => void;
  onOpenActivity: (questionId: string) => void;
  onNavigateTab: (tab: string) => void;
  onOpenSimulationLab?: () => void;
  onOpenDebateSession?: () => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({
  user,
  disciplines,
  questions,
  attempts = [],
  lastStudied,
  onOpenTutor,
  onSelectDiscipline,
  onOpenContent,
  onOpenActivity,
  onNavigateTab,
  onOpenSimulationLab,
  onOpenDebateSession,
}) => {
  // Recent continue studying topic isolated per user
  const continueSubject =
    (lastStudied &&
      disciplines.find((d) => d.id === lastStudied.disciplineId)) ||
    disciplines[0];
  const continueContent =
    (lastStudied &&
      continueSubject?.modules
        .flatMap((m) => m.contents)
        .find((c) => c.id === lastStudied.contentId)) ||
    continueSubject?.modules[0]?.contents[0];

  // Calculation for daily goal percentage
  const goalPercent = Math.min(
    100,
    Math.round((user.dailyProgressMinutes / user.dailyGoalMinutes) * 100)
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Top Welcome Bento Box */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-indigo-700/50">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-20 -bottom-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <GenericSilhouetteAvatar
              size="lg"
              role="ALUNO"
              userId={user.id}
              avatarUrl={user.avatar}
              editable={true}
              showChangeButton={true}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/15 text-indigo-200 uppercase tracking-wider backdrop-blur-md">
                  {user.turma || "3º Ano Técnico"}
                </span>
                <span className="text-xs text-indigo-200">
                  Matrícula: {user.enrollmentId}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
                Olá, {user.name.split(" ")[0]}! 👋
              </h1>
              <p className="text-sm text-indigo-200 mt-1 max-w-xl">
                Seu plano de aprendizagem adaptativo está atualizado. O TutorIA está pronto para sessões síncronas de voz e vídeo.
              </p>
            </div>
          </div>

          {/* TutorIA Hero Action Button */}
          <div className="w-full md:w-auto">
            <button
              onClick={() => onOpenTutor("matematica", "Equações do 2º Grau e Bhaskara")}
              className="w-full md:w-auto flex items-center justify-center gap-3 px-6 py-3.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-amber-500/20 transition-all transform hover:scale-[1.03] active:scale-[0.98]"
            >
              <div className="w-7 h-7 rounded-xl bg-slate-950/10 flex items-center justify-center">
                <Video className="w-4 h-4 text-slate-950" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold leading-tight uppercase tracking-wider text-slate-900/80">
                  Chamada Educacional
                </div>
                <div className="text-sm font-extrabold leading-none">
                  Iniciar TutorIA com Voz & Vídeo
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-amber-900 animate-spin" />
            </button>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
            <div className="flex items-center gap-2 text-indigo-200 text-xs mb-1">
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
              <span>Sequência de Estudos</span>
            </div>
            <p className="text-xl font-extrabold text-white">
              {user.streakDays} dias seguidos
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
            <div className="flex items-center gap-2 text-indigo-200 text-xs mb-1">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Meta Diária ({user.dailyProgressMinutes}/{user.dailyGoalMinutes} min)</span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xl font-extrabold text-white">{goalPercent}%</p>
              <div className="flex-1 h-2 bg-white/15 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${goalPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
            <div className="flex items-center gap-2 text-indigo-200 text-xs mb-1">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Horas Acumuladas</span>
            </div>
            <p className="text-xl font-extrabold text-white">
              {user.studyHoursTotal} horas
            </p>
          </div>

          <div
            onClick={() => onNavigateTab("disciplinas")}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2 text-indigo-200 text-xs mb-1">
              <BookOpen className="w-4 h-4 text-yellow-400" />
              <span>Disciplinas Ativas</span>
            </div>
            <p className="text-xl font-extrabold text-white">
              {disciplines.length || 15} disciplinas ativas
            </p>
          </div>
        </div>
      </section>

      {/* JORNADA DO ALUNO: MAPA VISUAL DE MARCOS, MEDALHAS E NÍVEIS DE XP */}
      <StudentJourneyMap
        user={user}
        attempts={attempts}
        onOpenActivity={onOpenActivity}
        onOpenTutor={onOpenTutor}
        onSelectDiscipline={onSelectDiscipline}
      />

      {/* REQUISITO 4: MÓDULOS DE ESTUDO INOVADORES */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              Módulos de Aprendizagem Prática & Socrática com TutorIA
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Metodologias Ativas de Alta Retenção
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Laboratório de Simulação Viva */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 border border-indigo-500/30 text-white shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-indigo-400 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                  Laboratório de Simulação Viva
                </span>
                <span className="text-[11px] font-bold text-indigo-300">
                  +60% Aprendizado
                </span>
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-indigo-200 transition-colors">
                Cenários Práticos e Consequências em Tempo Real
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                O TutorIA atua como mestre de cenários vivos (tomadas de decisão políticas, testes de código e debugging em T.I., e mercado financeiro). Cada escolha gera reações e impactos práticos instantâneos.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">
                3 Cenários Práticos Disponíveis
              </span>
              <button
                onClick={() => onOpenSimulationLab?.()}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
              >
                <span>Entrar no Laboratório</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Sessão de Debates com TutorIA */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-3xl p-6 border border-emerald-500/30 text-white shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-emerald-400 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-emerald-400" />
                  Sessão de Debates Socráticos
                </span>
                <span className="text-[11px] font-bold text-emerald-300">
                  +70% Aprendizado
                </span>
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-emerald-200 transition-colors">
                Questionamento Crítico e Oratória Dialética
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                O TutorIA assume contra-argumentos rigorosos, identificando falácias, exigindo evidências históricas e jurídicas e refinando a sua capacidade de argumentação e sustentação oral.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">
                Avaliação Dialética em Tempo Real
              </span>
              <button
                onClick={() => onOpenDebateSession?.()}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2"
              >
                <span>Iniciar Debate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid with Continue Studying & Identified Difficulties */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Studying Card */}
        {continueContent && (
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-indigo-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 flex items-center gap-1.5">
                  <Play className="w-3 h-3 fill-indigo-600" /> Continuar Estudando
                </span>
                <span className="text-xs text-slate-400">
                  {continueContent.estimatedMinutes} min de leitura estimada
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-slate-900">
                {continueContent.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {continueSubject.name} • {continueSubject.modules[0].title}
              </p>
              <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                {continueContent.subtitle}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">
                  6 modos de estudo ativos
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                  Resumo • Pesquisa • Flashcards • Vídeos • Mapas
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    onOpenTutor(continueSubject.id, continueContent.title)
                  }
                  className="px-3 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Discutir com TutorIA
                </button>
                <button
                  onClick={() =>
                    onOpenContent(continueSubject.id, continueContent.id)
                  }
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-indigo-600 rounded-xl transition-all flex items-center gap-1.5"
                >
                  Abrir Conteúdo <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Identified Gaps / Dificuldades Identificadas */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-amber-600">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-extrabold text-slate-900">
                  Dificuldades Identificadas
                </h3>
              </div>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                Nivelamento Ativo
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              O motor adaptativo mapeou pontos de atenção baseados em tentativas recentes de atividades:
            </p>

            <div className="space-y-3">
              <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200/70">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-800">
                    Fatoração de Polinômios
                  </span>
                  <span className="text-[10px] text-amber-700 font-semibold">
                    Matemática
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  Pré-requisito para raízes de equações do 2º grau.
                </p>
                <button
                  onClick={() => onOpenActivity("q-mat-bhaskara-1")}
                  className="mt-2 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  Fazer Nivelamento Guiado <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-800">
                    Delimitação do Tema de TCC
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    Prática de Estágio e TCC
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  Formulações de perguntas investigativas e objetivos.
                </p>
                <button
                  onClick={() =>
                    onOpenTutor(
                      "pratica-estagio-tcc",
                      "Estruturação Rigorosa do TCC e Produto Tecnológico"
                    )
                  }
                  className="mt-2 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  Consultar TutorIA <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab("progresso")}
            className="mt-4 w-full py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all text-center"
          >
            Ver Mapa Completo de Dificuldades
          </button>
        </div>
      </div>

      {/* Recommended Content & Pending Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Atividades Pendentes */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              Atividades Pendentes
            </h3>
            <button
              onClick={() => onNavigateTab("atividades")}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              Ver todas ({questions.length})
            </button>
          </div>

          <div className="space-y-3">
            {questions.slice(0, 3).map((q) => (
              <div
                key={q.id}
                onClick={() => onOpenActivity(q.id)}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/20 transition-all cursor-pointer group flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {q.disciplineName}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        q.difficulty === "facil"
                          ? "bg-emerald-100 text-emerald-800"
                          : q.difficulty === "medio"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {q.difficulty.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mt-1 group-hover:text-indigo-600 line-clamp-1">
                    {q.title}
                  </h4>
                </div>
                <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-indigo-600 text-slate-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conteúdos Recomendados */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-600" />
              Conteúdos Recomendados pela IA
            </h3>
            <span className="text-xs text-slate-400">Currículo Personalizado</span>
          </div>

          <div className="space-y-3">
            <div
              onClick={() => onOpenContent("banco-de-dados", "bd-sql-consultas")}
              className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/20 transition-all cursor-pointer group flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Banco de Dados
                </span>
                <h4 className="text-xs font-bold text-slate-800 mt-1.5 group-hover:text-emerald-700">
                  Linguagem SQL: De SELECT a INNER/LEFT JOINs
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Módulo com flashcards interativos e mapas conceituais.
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
            </div>

            <div
              onClick={() => onOpenContent("desenvolvimento-web", "web-js-async")}
              className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/20 transition-all cursor-pointer group flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Desenvolvimento Web
                </span>
                <h4 className="text-xs font-bold text-slate-800 mt-1.5 group-hover:text-emerald-700">
                  JavaScript Moderno, Manipulação do DOM e Fetch API
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Programação assíncrona e integração com APIs.
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        </div>
      </div>

      {/* The 15 Disciplines Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Disciplinas do Currículo ({disciplines.length || 15} Disciplinas Ativas)
            </h2>
            <p className="text-xs text-slate-500">
              Clique em qualquer disciplina para abrir os 50 tópicos/capítulos ativos, resumos acadêmicos, flashcards e 10 questões por tópico.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab("disciplinas")}
            className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            Visualização em Grade Completa <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {disciplines.map((d, index) => (
            <div
              key={d.id}
              onClick={() => onSelectDiscipline(d.id)}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                    #{index + 1}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    {d.progressPercent}% Concluído
                  </span>
                </div>

                <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
                  {d.name}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {d.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${d.progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">
                    {d.modules.length} {d.modules.length === 1 ? "módulo" : "módulos"}
                  </span>
                  <span className="text-indigo-600 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                    Acessar <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
