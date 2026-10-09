import { LearningTrackLevel } from "../types";
import { getDisciplineProfile } from "./pedagogicalCatalog";
import { getTopicDomainKnowledge } from "./pedagogicalKnowledgeBase";

export interface ConceptualGapDiagnosis {
  disciplineName: string;
  topic: string;
  conceptWithDifficulty: string;
  identifiedGap: string;
  prerequisiteConcept: string;
  prerequisiteExplanation: string;
  simpleWorkedExample: string;
  analogyExplanation: string;
  simplerConceptFallback: string;
  recommendedStartingLevel: LearningTrackLevel;
  stepByStepRemedialExercise: {
    prompt: string;
    options: Array<{ id: string; text: string; isCorrect: boolean; explanation: string }>;
    guidanceTip: string;
  };
}

export interface DomainAcceleratorChallenge {
  topic: string;
  targetLevel: 4;
  academicQuestion: string;
  contextualResearchCase: string;
  advancedOptions: Array<{ id: string; text: string; isCorrect: boolean; explanation: string }>;
  frontierField: string;
}

/**
 * Generates a topic- and discipline-specific Conceptual Gap Diagnosis and Remedial Exercise
 * for Micro-Nivelamento across all 15 disciplines and 750 topics.
 */
export function getConceptualGapDiagnosis(
  disciplineId: string,
  topicTitle?: string,
  prerequisiteTopic?: string
): ConceptualGapDiagnosis {
  const profile = getDisciplineProfile(disciplineId);
  const effectiveTopic = topicTitle || `Conceitos de ${profile.name}`;
  const domain = getTopicDomainKnowledge(
    profile.id,
    effectiveTopic,
    profile.fieldArea,
    prerequisiteTopic
  );

  return {
    disciplineName: profile.name,
    topic: effectiveTopic,
    conceptWithDifficulty: `${domain.keyTerms.slice(0, 2).join(" e ")} em ${effectiveTopic}`,
    identifiedGap: domain.gapIdentified,
    prerequisiteConcept: domain.prerequisiteTitle,
    prerequisiteExplanation: `Para compreender "${effectiveTopic}" em ${profile.name}, o pré-requisito necessário é "${domain.prerequisiteTitle}": ${domain.coreDefinition} ${domain.mechanismsAndProcesses}`,
    simpleWorkedExample: `Exemplo simples em ${effectiveTopic}: ${domain.practicalExamples[0]}`,
    analogyExplanation: domain.analogyExplanation,
    simplerConceptFallback: domain.prerequisiteTitle,
    recommendedStartingLevel: 1,
    stepByStepRemedialExercise: {
      prompt: `Exercício de Reforço (${effectiveTopic} — ${profile.name}): Considerando o exemplo "${domain.practicalExamples[0].slice(0, 110)}...", qual alternativa aplica corretamente o conceito e corrige a dificuldade identificada?`,
      options: [
        {
          id: "rem-opt-1",
          text: `${domain.mistakeCorrection} (${domain.keyTerms.slice(0, 2).join(" • ")})`,
          isCorrect: true,
          explanation: `Excelente! Você compreendeu o conceito correto de "${effectiveTopic}": ${domain.coreDefinition}`
        },
        {
          id: "rem-opt-2",
          text: domain.commonMistake,
          isCorrect: false,
          explanation: `O erro está em repetir a falha analisada. A correção correta em "${effectiveTopic}" é: ${domain.mistakeCorrection}`
        },
        {
          id: "rem-opt-3",
          text: `Em ${profile.name}, o estudo de "${effectiveTopic}" independe de "${domain.prerequisiteTitle}" e dispensa a verificação dos dados do problema.`,
          isCorrect: false,
          explanation: `O erro está em desconsiderar o pré-requisito "${domain.prerequisiteTitle}", que é a base de "${effectiveTopic}".`
        }
      ],
      guidanceTip: domain.mistakeCorrection
    }
  };
}

/**
 * Generates a topic- and discipline-specific Level 4 Domain Accelerator Challenge
 */
export function getDomainAcceleratorChallenge(
  disciplineId: string,
  topicTitle?: string
): DomainAcceleratorChallenge {
  const profile = getDisciplineProfile(disciplineId);
  const effectiveTopic = topicTitle || `Tópico Avançado de ${profile.name}`;
  const domain = getTopicDomainKnowledge(profile.id, effectiveTopic, profile.fieldArea);

  return {
    topic: effectiveTopic,
    targetLevel: 4,
    frontierField: `${profile.name} • ${domain.moduleTitle}`,
    contextualResearchCase: `${domain.practicalExamples[0]} ${domain.importantRelations}`,
    academicQuestion: `Em nível avançado de ${profile.name}, considerando o estudo de "${effectiveTopic}", qual análise integra corretamente seus fundamentos teóricos e aplicações reais?`,
    advancedOptions: [
      {
        id: "adv-opt-1",
        text: `${domain.coreDefinition} Além disso, sua aplicação exige observar que: ${domain.mistakeCorrection}`,
        isCorrect: true,
        explanation: `Perfeito! Raciocínio de alto nível que articula a definição rigorosa de "${effectiveTopic}" com sua aplicação crítica em ${profile.name}.`
      },
      {
        id: "adv-opt-2",
        text: domain.commonMistake,
        isCorrect: false,
        explanation: `Incorreto. Em nível avançado, é essencial evitar esse equívoco: ${domain.mistakeCorrection}`
      },
      {
        id: "adv-opt-3",
        text: `O tema "${effectiveTopic}" restringe-se a definições isoladas e não apresenta relação com "${domain.prerequisiteTitle}" nem com situações reais.`,
        isCorrect: false,
        explanation: `Incorreto. ${domain.importantRelations}`
      }
    ]
  };
}

export const ANALOGY_KNOWLEDGE_BASE: Record<string, ConceptualGapDiagnosis> = new Proxy(
  {} as Record<string, ConceptualGapDiagnosis>,
  {
    get(_target, prop: string) {
      return getConceptualGapDiagnosis(prop === "default" ? "matematica" : prop);
    }
  }
);

export const DOMAIN_ACCELERATOR_CASES: Record<string, DomainAcceleratorChallenge> = new Proxy(
  {} as Record<string, DomainAcceleratorChallenge>,
  {
    get(_target, prop: string) {
      return getDomainAcceleratorChallenge(prop === "default" ? "matematica" : prop);
    }
  }
);

/**
 * Calculates adaptive spaced repetition intervals
 */
export function calculateSpacedRepetition(
  currentDays: number = 1,
  feedback: "repetir" | "dificil" | "bom" | "facil"
): { nextIntervalDays: number; retentionScore: number; statusText: string } {
  let nextDays = 1;
  let retention = 50;
  let status = "Revisão Imediata Agendada";

  switch (feedback) {
    case "repetir":
      nextDays = 1;
      retention = 40;
      status = "Prioritário: Ativando Nivelamento Automático";
      break;
    case "dificil":
      nextDays = Math.max(2, Math.round(currentDays * 1.3));
      retention = 65;
      status = "Intervalo Curto (Revisão em 48h)";
      break;
    case "bom":
      nextDays = Math.max(4, Math.round(currentDays * 1.8));
      retention = 82;
      status = "Consolidação Estável (Revisão em 4 dias)";
      break;
    case "facil":
      nextDays = Math.max(7, Math.round(currentDays * 2.5));
      retention = 96;
      status = "Domínio Pleno (Revisão em 1 semana)";
      break;
  }

  return {
    nextIntervalDays: nextDays,
    retentionScore: retention,
    statusText: status
  };
}
