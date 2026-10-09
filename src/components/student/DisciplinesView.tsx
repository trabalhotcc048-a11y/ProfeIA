import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Layers,
  Search,
  ChevronRight,
  Filter,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  Cpu,
  Scale,
  HardDrive
} from "lucide-react";
import { Discipline } from "../../types";
import { TAXONOMY_DISCIPLINAS } from "../../services/taxonomyData";
import { isDisciplineSavedOffline } from "../../services/offlineTutorDB";

interface DisciplinesViewProps {
  disciplines: Discipline[];
  onSelectDiscipline: (disciplineId: string) => void;
  onOpenTutor: (disciplineId?: string) => void;
  onOpenSimulationLab?: (disciplineId?: string) => void;
  onOpenDebateSession?: (disciplineId?: string) => void;
}

// Mapeamento Oficial das 15 Siglas
export const OFFICIAL_DISCIPLINE_ACRONYMS: Record<string, string> = {
  matematica: "Mat",
  biologia: "Bio",
  fisica: "Fis",
  geografia: "Geo",
  sociologia: "Socio",
  "analise-projeto-sistemas": "AP Sis",
  "materia-pratica-estagio-tcc": "PraEsT",
  quimica: "Qui",
  "banco-de-dados": "BaDa",
  "lingua-portuguesa-redacao": "LPRed",
  "desenvolvimento-web": "DesWeb",
  historia: "His",
  robotica: "Robo",
  "design-interface": "Design",
  "empreendedorismo-social": "EmEcS",
  "lingua-inglesa": "Inglês",
};

export const DisciplinesView: React.FC<DisciplinesViewProps> = ({
  disciplines = [],
  onSelectDiscipline,
  onOpenTutor,
  onOpenSimulationLab,
  onOpenDebateSession,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [offlineDisciplineIds, setOfflineDisciplineIds] = useState<Set<string>>(() => {
    return new Set(disciplines.filter((d) => isDisciplineSavedOffline(d.id)).map((d) => d.id));
  });

  useEffect(() => {
    const updateOfflineList = () => {
      setOfflineDisciplineIds(
        new Set(disciplines.filter((d) => isDisciplineSavedOffline(d.id)).map((d) => d.id))
      );
    };
    window.addEventListener("profeia-discipline-cached", updateOfflineList);
    window.addEventListener("profeia-indexeddb-updated", updateOfflineList);
    return () => {
      window.removeEventListener("profeia-discipline-cached", updateOfflineList);
      window.removeEventListener("profeia-indexeddb-updated", updateOfflineList);
    };
  }, [disciplines]);

  const categories = [
    "Todas",
    "Exatas e Tecnológicas",
    "Ciências da Natureza",
    "Ciências Humanas e Sociais",
    "Linguagens",
    "Formação Profissional e Projetos",
  ];

  const safeDisciplines = disciplines || [];
  const filtered = safeDisciplines.filter((d) => {
    const matchesCategory =
      selectedCategory === "Todas" || d.category === selectedCategory;
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (OFFICIAL_DISCIPLINE_ACRONYMS[d.id] || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
              Grade Curricular Oficial
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              Disciplinas Integradas ProfeIA
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Central de Disciplinas
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Acesso didático completo a todas as matérias com alternância limpa: Resumos teóricos, Mapas Mentais/Conceituais, Pesquisa Guiada, Flashcards e Vídeos.
          </p>
        </div>

        <button
          onClick={() => onOpenTutor()}
          className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all transform hover:scale-[1.02] shrink-0"
        >
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>Dúvidas Gerais? Abrir TutorIA</span>
        </button>
      </div>

      {/* Filters and Search Strip */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Local Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome ou sigla (ex: PraEsT, AP Sis)..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-slate-500"
          />
        </div>
      </div>

      {/* Grid of the 14 Official Disciplines */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((d) => {
          const acronym = OFFICIAL_DISCIPLINE_ACRONYMS[d.id] || d.name.slice(0, 4);

          return (
            <div
              key={d.id}
              onClick={() => onSelectDiscipline(d.id)}
              className="bg-slate-900 rounded-3xl p-6 border border-slate-800 hover:border-emerald-500/60 hover:shadow-2xl hover:shadow-emerald-950/20 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Subtle top glow bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-black font-mono px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {acronym}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md truncate max-w-[130px]">
                      {d.category}
                    </span>
                    {offlineDisciplineIds.has(d.id) && (
                      <span className="text-[9px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <HardDrive className="w-2.5 h-2.5 text-emerald-400" />
                        Offline
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-black text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    {d.progressPercent}%
                  </span>
                </div>

                <h2 className="text-base font-black text-white group-hover:text-emerald-300 transition-colors">
                  {d.name}
                </h2>
                <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {d.description}
                </p>

                {/* Subárvore Taxonômica Profunda */}
                {(() => {
                  const meta = TAXONOMY_DISCIPLINAS.find((t) => t.id === d.id);
                  if (!meta?.sampleSubtree) return null;
                  return (
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[10px] text-slate-400">
                      <span className="text-indigo-400 font-bold block mb-0.5">Trilha Taxonômica:</span>
                      <span className="truncate block font-mono text-slate-300">
                        {meta.sampleSubtree.slice(1).join(" → ")}
                      </span>
                    </div>
                  );
                })()}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-3">
                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Domínio do Conteúdo</span>
                    <span className="font-semibold text-emerald-400">
                      {d.progressPercent}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                      style={{ width: `${d.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Ações Práticas: Simulação Viva & Debate Socrático para esta disciplina */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenSimulationLab) {
                        onOpenSimulationLab(d.id);
                      }
                    }}
                    className="py-1.5 px-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                    title={`Abrir Laboratório de Simulação de ${d.name}`}
                  >
                    <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Simulação</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenDebateSession) {
                        onOpenDebateSession(d.id);
                      }
                    }}
                    className="py-1.5 px-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                    title={`Abrir Debate Socrático de ${d.name}`}
                  >
                    <Scale className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Debate</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-400 font-medium">
                    {d.modules.reduce((acc, m) => acc + m.contents.length, 0)} conteúdos
                  </span>
                  <span className="text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Abrir Matéria <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
