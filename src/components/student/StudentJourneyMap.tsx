import React, { useState } from "react";
import {
  Trophy,
  Award,
  Zap,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  Flame,
  Star,
  Target,
  BookOpen,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { UserProfile, StudentActivityAttempt } from "../../types";

interface StudentJourneyMapProps {
  user: UserProfile;
  attempts?: StudentActivityAttempt[];
  onOpenActivity: (questionId: string) => void;
  onOpenTutor: (disciplineId?: string, topic?: string) => void;
  onSelectDiscipline: (disciplineId: string) => void;
}

interface JourneyMilestone {
  id: string;
  step: number;
  title: string;
  subtitle: string;
  xpRequired: number;
  xpReward: number;
  disciplineId: string;
  topic: string;
  description: string;
}

interface JourneyMedal {
  id: string;
  title: string;
  category: string;
  description: string;
  xpBonus: number;
  unlocked: boolean;
  progressText: string;
  disciplineId: string;
}

const JOURNEY_MILESTONES: JourneyMilestone[] = [
  {
    id: "marco-1",
    step: 1,
    title: "Despertar Socrático",
    subtitle: "Iniciação Científica & Metodologia Ativa",
    xpRequired: 100,
    xpReward: 150,
    disciplineId: "lingua-portuguesa-redacao",
    topic: "A Estrutura do Texto Dissertativo-Argumentativo",
    description:
      "Primeiras atividades concluídas com aproveitamento e interação socrática direta no TutorIA.",
  },
  {
    id: "marco-2",
    step: 2,
    title: "Fundamentos Exatos & SQL",
    subtitle: "Álgebra, Dinâmica e Modelagem Relacional",
    xpRequired: 400,
    xpReward: 250,
    disciplineId: "matematica",
    topic: "Equações do 2º Grau e Bhaskara",
    description:
      "Domínio da fórmula resolutiva de Bhaskara, Leis de Newton e Chaves Primárias/Estrangeiras em Banco de Dados.",
  },
  {
    id: "marco-3",
    step: 3,
    title: "Explorador das 15 Disciplinas",
    subtitle: "Currículo Integrado (50 Tópicos/Matéria)",
    xpRequired: 800,
    xpReward: 300,
    disciplineId: "lingua-inglesa",
    topic: "Simple Present vs Present Continuous e Leitura Técnica",
    description:
      "Navegação ativa nos capítulos acadêmicos das 15 disciplinas oficiais, incluindo Língua Inglesa e Humanidades.",
  },
  {
    id: "marco-4",
    step: 4,
    title: "Debatedor Dialético & Simulador",
    subtitle: "Tomada de Decisão e Argumentação Crítica",
    xpRequired: 1200,
    xpReward: 350,
    disciplineId: "historia",
    topic: "A Revolução Francesa (1789): Da Queda da Bastilha ao Fim do Antigo Regime",
    description:
      "Participação nos laboratórios de simulação viva, debates socráticos e cache local de Tutoria Offline (IndexedDB).",
  },
  {
    id: "marco-5",
    step: 5,
    title: "Polímata Técnico INFVES3SB",
    subtitle: "Engenharia de Software, Web, UI/UX e Robótica",
    xpRequired: 1750,
    xpReward: 450,
    disciplineId: "desenvolvimento-web",
    topic: "JavaScript Moderno, Manipulação do DOM e Fetch API",
    description:
      "Resolução das baterias de 10 questões técnicas em Desenvolvimento Web, Análise de Sistemas, Robótica e Design.",
  },
  {
    id: "marco-6",
    step: 6,
    title: "Excelência Acadêmica & TCC",
    subtitle: "Defesa de Projeto Tecnológico & Impacto Social",
    xpRequired: 2400,
    xpReward: 600,
    disciplineId: "pratica-estagio-tcc",
    topic: "Estruturação Rigorosa do TCC e Produto Tecnológico",
    description:
      "Consolidação integral da trilha adaptativa, artigo ABNT e projeto de Empreendedorismo Social.",
  },
];

export const StudentJourneyMap: React.FC<StudentJourneyMapProps> = ({
  user,
  attempts = [],
  onOpenActivity,
  onOpenTutor,
  onSelectDiscipline,
}) => {
  const loadUserMilestones = (uid: string): string[] => {
    try {
      const saved = localStorage.getItem(`profeia_claimed_milestones_${uid}`);
      return saved ? JSON.parse(saved) : ["marco-1", "marco-2"];
    } catch {
      return ["marco-1", "marco-2"];
    }
  };

  const [claimedMilestones, setClaimedMilestones] = useState<string[]>(() =>
    loadUserMilestones(user.id)
  );

  React.useEffect(() => {
    setClaimedMilestones(loadUserMilestones(user.id));
  }, [user.id]);

  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>("marco-4");
  const [activeView, setActiveView] = useState<"mapa" | "medalhas">("mapa");

  // Calculate dynamic XP based on completed activities, study hours, streak, and claimed milestones
  const correctAttemptsCount = attempts.filter((a) => a.isCorrect).length;
  const totalAttemptsCount = Math.max(12, 12 + attempts.length);
  const baseXP =
    user.studyHoursTotal * 22 +
    user.streakDays * 35 +
    totalAttemptsCount * 15 +
    correctAttemptsCount * 40 +
    claimedMilestones.length * 85;

  const currentLevel = Math.max(1, Math.floor(baseXP / 300) + 1);
  const nextLevelXP = currentLevel * 300;
  const prevLevelXP = (currentLevel - 1) * 300;
  const levelProgressPercent = Math.min(
    100,
    Math.max(8, Math.round(((baseXP - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100))
  );

  const medals: JourneyMedal[] = [
    {
      id: "med-bhaskara",
      title: "Mestre de Bhaskara & Funções",
      category: "Matemática • Exatas",
      description: "Concluiu exercícios de equações do 2º grau e análise de discriminante Δ.",
      xpBonus: 150,
      unlocked: true,
      progressText: "10/10 questões concluídas",
      disciplineId: "matematica",
    },
    {
      id: "med-sql",
      title: "Arquiteto Relacional SQL",
      category: "Banco de Dados • Técnico",
      description: "Dominou Chaves Primárias (PK), Estrangeiras (FK) e cláusulas INNER/LEFT JOIN.",
      xpBonus: 200,
      unlocked: true,
      progressText: "10/10 questões concluídas",
      disciplineId: "banco-de-dados",
    },
    {
      id: "med-redacao",
      title: "Argumentação Nota 1000",
      category: "Língua Portuguesa e Redação",
      description: "Estruturou tese D1/D2 e proposta de intervenção com os 5 elementos.",
      xpBonus: 200,
      unlocked: true,
      progressText: "Marco Alcançado",
      disciplineId: "lingua-portuguesa-redacao",
    },
    {
      id: "med-ingles",
      title: "Fluência Técnica Bilíngue",
      category: "Língua Inglesa • 15ª Disciplina",
      description: "Domínio de Simple Present, Present Continuous e vocabulário técnico de TI.",
      xpBonus: 180,
      unlocked: true,
      progressText: "50 tópicos disponíveis",
      disciplineId: "lingua-inglesa",
    },
    {
      id: "med-offline",
      title: "Explorador Offline IndexedDB",
      category: "Autonomia de Estudo",
      description: "Sincronizou capítulos e respostas no banco de dados local para acesso sem internet.",
      xpBonus: 160,
      unlocked: true,
      progressText: "Cache IndexedDB Ativo",
      disciplineId: "desenvolvimento-web",
    },
    {
      id: "med-polimata",
      title: "Polímata Turma INFVES3SB",
      category: "Excelência Global",
      description: `Manteve ${user.streakDays} dias seguidos de estudo ativo nas 15 disciplinas.`,
      xpBonus: 300,
      unlocked: baseXP >= 1500,
      progressText: baseXP >= 1500 ? "Desbloqueada!" : `${baseXP} / 1500 XP`,
      disciplineId: "pratica-estagio-tcc",
    },
  ];

  const selectedMilestone =
    JOURNEY_MILESTONES.find((m) => m.id === selectedMilestoneId) ||
    JOURNEY_MILESTONES[0];

  const handleClaimMilestone = (milestoneId: string) => {
    if (claimedMilestones.includes(milestoneId)) return;
    const next = [...claimedMilestones, milestoneId];
    setClaimedMilestones(next);
    try {
      localStorage.setItem(`profeia_claimed_milestones_${user.id}`, JSON.stringify(next));
    } catch {}
  };

  return (
    <section className="bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl text-white space-y-6">
      {/* Top Header & XP Level Summary */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-bold uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Jornada do Aluno • Mapa Visual de Marcos, Medalhas & XP</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Trilha de Conquistas de {user.name.split(" ")[0]}
          </h2>
          <p className="text-xs text-slate-400">
            Progressão gamificada baseada nas atividades concluídas, horas de estudo e domínio nas 15 disciplinas.
          </p>
        </div>

        {/* XP & Level Card */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-950/90 border border-slate-800 rounded-2xl p-3.5 shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex flex-col items-center justify-center font-black shadow-lg shadow-amber-500/20">
            <span className="text-[9px] uppercase leading-none">Nível</span>
            <span className="text-lg leading-tight">{currentLevel}</span>
          </div>

          <div className="min-w-[180px] space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-black text-amber-300 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {baseXP.toLocaleString("pt-BR")} XP Total
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Próx: {nextLevelXP} XP
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${levelProgressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>{totalAttemptsCount} atividades concluídas</span>
              <span>{medals.filter((m) => m.unlocked).length}/6 medalhas</span>
            </div>
          </div>

          {/* Toggle Mapa / Medalhas */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveView("mapa")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeView === "mapa"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Mapa de Marcos
            </button>
            <button
              type="button"
              onClick={() => setActiveView("medalhas")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeView === "medalhas"
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Medalhas ({medals.filter((m) => m.unlocked).length})
            </button>
          </div>
        </div>
      </div>

      {activeView === "mapa" ? (
        <div className="space-y-5">
          {/* Interactive Visual Milestone Map */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 relative">
            {JOURNEY_MILESTONES.map((milestone) => {
              const isReached =
                baseXP >= milestone.xpRequired ||
                claimedMilestones.includes(milestone.id);
              const isSelected = selectedMilestone.id === milestone.id;

              return (
                <button
                  key={milestone.id}
                  type="button"
                  onClick={() => setSelectedMilestoneId(milestone.id)}
                  className={`text-left p-3.5 rounded-2xl border transition-all flex flex-col justify-between relative group ${
                    isSelected
                      ? "bg-indigo-950/80 border-indigo-400 shadow-lg shadow-indigo-950/50 scale-[1.02]"
                      : isReached
                      ? "bg-slate-950/80 border-emerald-500/40 hover:border-emerald-400"
                      : "bg-slate-950/40 border-slate-800/80 opacity-75 hover:opacity-100"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span
                        className={`w-7 h-7 rounded-xl text-xs font-black flex items-center justify-center ${
                          isReached
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : "bg-slate-800 text-slate-400 border border-slate-700"
                        }`}
                      >
                        {isReached ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-slate-500" />
                        )}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-amber-300">
                        +{milestone.xpReward} XP
                      </span>
                    </div>

                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Marco {milestone.step}
                    </div>
                    <h3 className="text-xs font-extrabold text-white mt-0.5 line-clamp-2 leading-snug">
                      {milestone.title}
                    </h3>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                    <span
                      className={
                        isReached
                          ? "text-emerald-400 font-bold"
                          : "text-slate-500 font-medium"
                      }
                    >
                      {isReached ? "Alcançado" : `Meta: ${milestone.xpRequired} XP`}
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Milestone Action Panel */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-black text-indigo-400 uppercase">
                  Marco {selectedMilestone.step}: {selectedMilestone.title}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-amber-300 font-bold">
                  Recompensa: +{selectedMilestone.xpReward} XP
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">{selectedMilestone.subtitle}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedMilestone.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {!claimedMilestones.includes(selectedMilestone.id) &&
                baseXP >= selectedMilestone.xpRequired && (
                  <button
                    type="button"
                    onClick={() => handleClaimMilestone(selectedMilestone.id)}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
                  >
                    <Award className="w-4 h-4" />
                    <span>Resgatar Recompensa (+{selectedMilestone.xpReward} XP)</span>
                  </button>
                )}

              <button
                type="button"
                onClick={() => onOpenActivity(selectedMilestone.disciplineId)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
              >
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span>Praticar 10 Questões</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onOpenTutor(
                    selectedMilestone.disciplineId,
                    selectedMilestone.topic
                  )
                }
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Estudar Marco no TutorIA</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Medals Showcase Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {medals.map((medal) => (
            <div
              key={medal.id}
              onClick={() => onSelectDiscipline(medal.disciplineId)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                medal.unlocked
                  ? "bg-slate-950/90 border-amber-500/40 hover:border-amber-400"
                  : "bg-slate-950/40 border-slate-800 opacity-75"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                    medal.unlocked
                      ? "bg-amber-500/20 border-amber-400/50 text-amber-300"
                      : "bg-slate-800 border-slate-700 text-slate-500"
                  }`}
                >
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span>{medal.category}</span>
                    <span>•</span>
                    <span className="text-amber-300 font-bold">
                      +{medal.xpBonus} XP
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-white mt-0.5">
                    {medal.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {medal.description}
                  </p>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span
                  className={
                    medal.unlocked
                      ? "text-emerald-400 font-bold flex items-center gap-1"
                      : "text-slate-400"
                  }
                >
                  {medal.unlocked && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {medal.progressText}
                </span>
                <span className="text-indigo-400 font-bold">Abrir Disciplina →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
