import React from "react";
import {
  Sparkles,
  Award,
  Zap,
  BookOpen,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Lock,
  Compass
} from "lucide-react";
import { LearningTrackLevel } from "../../types";
import { PROGRESSIVE_LEVEL_DEFINITIONS } from "../../services/taxonomyData";

interface LevelTrackSelectorProps {
  currentLevel: LearningTrackLevel;
  onSelectLevel: (level: LearningTrackLevel) => void;
  onTriggerAccelerator?: () => void;
  showAcceleratorPrompt?: boolean;
}

export const LevelTrackSelector: React.FC<LevelTrackSelectorProps> = ({
  currentLevel,
  onSelectLevel,
  onTriggerAccelerator,
  showAcceleratorPrompt = false,
}) => {
  const levels: LearningTrackLevel[] = [1, 2, 3, 4];

  return (
    <div className="bg-slate-900/90 rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-4">
      {/* Header with Title and Accelerator Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-950/80 text-indigo-400 border border-indigo-700/40">
              Trilha de Aprendizagem Progressiva
            </span>
            <span className="text-xs text-slate-400 font-semibold hidden md:inline">
              4 Níveis Sequenciais de Conhecimento
            </span>
          </div>
          <h2 className="text-lg font-black text-white mt-1 flex items-center gap-2">
            <span>Progressão Cognitiva Adaptativa</span>
            <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
              {PROGRESSIVE_LEVEL_DEFINITIONS[currentLevel].badge}
            </span>
          </h2>
        </div>

        {/* Quick Shortcut to Level 4 (Aprofundamento) */}
        {onTriggerAccelerator && (
          <button
            onClick={onTriggerAccelerator}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-lg ${
              showAcceleratorPrompt
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white animate-pulse shadow-purple-600/30 ring-2 ring-purple-400"
                : "bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30"
            }`}
            title="Acesso direto ao Nível 4 (Artigos de Fronteira e Pós-Graduação)"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-300" />
            <span>Acelerador de Domínio (Nível 4)</span>
          </button>
        )}
      </div>

      {/* 4 Levels Progress Step Buttons (Bento Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {levels.map((lvl) => {
          const meta = PROGRESSIVE_LEVEL_DEFINITIONS[lvl];
          const isActive = currentLevel === lvl;
          const isPassed = currentLevel > lvl;

          return (
            <button
              key={lvl}
              onClick={() => onSelectLevel(lvl)}
              className={`text-left p-3.5 rounded-2xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between group ${
                isActive
                  ? "bg-slate-800/90 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg shadow-indigo-950/50"
                  : "bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700"
              }`}
            >
              {/* Level Indicator Top Strip */}
              <div className="flex items-center justify-between w-full mb-2">
                <span
                  className={`text-xs font-black px-2.5 py-0.5 rounded-lg border ${
                    isActive
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : isPassed
                      ? "bg-emerald-950/80 text-emerald-400 border-emerald-700/40"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}
                >
                  Nível {lvl}
                </span>

                {isPassed && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Concluído</span>
                  </span>
                )}
                {isActive && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 animate-pulse">
                    <Zap className="w-3 h-3 fill-indigo-400" />
                    <span>Em Estudo</span>
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-xs font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                  {meta.name}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                  {meta.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                <span className="truncate">{meta.badge}</span>
                <ArrowRight
                  className={`w-3 h-3 transition-transform ${
                    isActive ? "text-indigo-400 translate-x-1" : "text-slate-600"
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Level Pedagogical Focus Pill */}
      <div className="p-3 bg-slate-850/90 rounded-2xl border border-slate-800 flex items-center gap-3 text-xs text-slate-300">
        <Compass className="w-4 h-4 text-indigo-400 shrink-0" />
        <p className="leading-relaxed">
          <strong className="text-white font-bold">
            Foco Pedagógico do {PROGRESSIVE_LEVEL_DEFINITIONS[currentLevel].name}:
          </strong>{" "}
          {PROGRESSIVE_LEVEL_DEFINITIONS[currentLevel].pedagogicalRole}
        </p>
      </div>
    </div>
  );
};
