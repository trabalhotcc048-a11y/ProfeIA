import {
  ContentItem,
  FlashcardItem,
  VideoLesson,
  MindMapNode,
  ConceptMapNode,
  StructuredSummarySection,
  LearningTrackLevel
} from "../types";
import { getDisciplineProfile } from "./pedagogicalCatalog";
import { getTopicDomainKnowledge } from "./pedagogicalKnowledgeBase";

export interface TaxonomySubtreeNode {
  id: string;
  name: string;
  area:
    | "Exatas e Engenharia"
    | "Humanas e Sociais"
    | "Biológicas e Ambientais"
    | "Linguagens e Artes"
    | "Formação Profissional e Projetos";
  disciplineName: string;
  disciplineId: string;
  path: string[];
  description: string;
  focusHighlights: string[];
  levels: Record<
    LearningTrackLevel,
    {
      title: string;
      focus: string;
      summaryDeepDive: string;
      activeRecall: string;
    }
  >;
}

export const KNOWLEDGE_AREAS = [
  "Todas",
  "Exatas e Engenharia",
  "Humanas e Sociais",
  "Biológicas e Ambientais",
  "Linguagens e Artes"
] as const;

export interface TaxonomyDisciplineMeta {
  id: string;
  name: string;
  area:
    | "Exatas e Engenharia"
    | "Humanas e Sociais"
    | "Biológicas e Ambientais"
    | "Linguagens e Artes";
  iconName: string;
  color: string;
  acronym: string;
  description: string;
  sampleSubtree: string[];
}

export const TAXONOMY_DISCIPLINAS: TaxonomyDisciplineMeta[] = [
  {
    id: "matematica",
    name: "Matemática",
    area: "Exatas e Engenharia",
    iconName: "Calculator",
    color: "from-blue-600 to-indigo-600",
    acronym: "Mat",
    description: "Álgebra, geometria, funções, estatística, probabilidade e trigonometria.",
    sampleSubtree: ["Matemática", "Álgebra", "Equações do 2º Grau", "Discriminante e Raízes"]
  },
  {
    id: "fisica",
    name: "Física",
    area: "Exatas e Engenharia",
    iconName: "Zap",
    color: "from-cyan-600 to-blue-600",
    acronym: "Fis",
    description: "Cinemática, dinâmica newtoniana, termologia, óptica e eletromagnetismo.",
    sampleSubtree: ["Física", "Mecânica", "Dinâmica", "Leis de Newton"]
  },
  {
    id: "biologia",
    name: "Biologia",
    area: "Biológicas e Ambientais",
    iconName: "Dna",
    color: "from-emerald-600 to-green-600",
    acronym: "Bio",
    description: "Citologia, bioenergética, genética molecular e clássica, evolução e ecologia.",
    sampleSubtree: ["Biologia", "Metabolismo Celular", "Fotossíntese", "Fase Clara e Ciclo de Calvin"]
  },
  {
    id: "geografia",
    name: "Geografia",
    area: "Humanas e Sociais",
    iconName: "Globe2",
    color: "from-emerald-600 to-teal-600",
    acronym: "Geo",
    description: "Geografia física, climatologia, demografia, urbanização e geopolítica mundial.",
    sampleSubtree: ["Geografia", "Geopolítica e Urbanização", "Espaço Geográfico", "Território"]
  },
  {
    id: "sociologia",
    name: "Sociologia",
    area: "Humanas e Sociais",
    iconName: "Users",
    color: "from-rose-600 to-pink-600",
    acronym: "Socio",
    description: "Sociologia clássica (Durkheim, Weber, Marx), cultura, poder, trabalho e cidadania.",
    sampleSubtree: ["Sociologia", "Teoria Sociológica", "Durkheim, Weber e Marx", "Cidadania"]
  },
  {
    id: "historia",
    name: "História",
    area: "Humanas e Sociais",
    iconName: "Landmark",
    color: "from-amber-600 to-orange-600",
    acronym: "His",
    description: "Antiguidade, Idade Média e Moderna, Brasil Colônia/Império/República e Século XX.",
    sampleSubtree: ["História", "História Geral e do Brasil", "Processos Históricos", "Fontes e Memória"]
  },
  {
    id: "lingua-portuguesa-redacao",
    name: "Língua Portuguesa e Redação",
    area: "Linguagens e Artes",
    iconName: "FileEdit",
    color: "from-pink-600 to-rose-600",
    acronym: "Port",
    description: "Morfossintaxe, coesão e coerência, interpretação textual e redação modelo ENEM.",
    sampleSubtree: ["Língua Portuguesa", "Produção Textual", "Dissertação-Argumentativa", "5 Competências"]
  },
  {
    id: "lingua-inglesa",
    name: "Língua Inglesa",
    area: "Linguagens e Artes",
    iconName: "Languages",
    color: "from-indigo-600 to-blue-600",
    acronym: "Ing",
    description: "Tempos verbais, modais, condicionais, leitura instrumental (Skimming/Scanning) e vocabulário.",
    sampleSubtree: ["Língua Inglesa", "Leitura e Gramática", "Tempos Verbais", "Compreensão Textual"]
  }
];

export const PROGRESSIVE_LEVEL_DEFINITIONS: Record<
  LearningTrackLevel,
  {
    name: string;
    badge: string;
    color: string;
    description: string;
    pedagogicalRole: string;
  }
> = {
  1: {
    name: "Nível 1 (Básico)",
    badge: "Fundamentos & Conceitos",
    color: "from-blue-600 to-cyan-600",
    description: "Definições essenciais, exemplos claros do cotidiano e contextualização inicial do tema.",
    pedagogicalRole: "Construção da base conceitual e compreensão dos pré-requisitos."
  },
  2: {
    name: "Nível 2 (Intermediário)",
    badge: "Aplicações & Relações",
    color: "from-emerald-600 to-teal-600",
    description: "Articulação entre conceitos, resolução de problemas e análise contextualizada da matéria.",
    pedagogicalRole: "Consolidação do raciocínio próprio da disciplina e autonomia nos estudos."
  },
  3: {
    name: "Nível 3 (Avançado)",
    badge: "Análise Crítica & Rigor",
    color: "from-amber-600 to-orange-600",
    description: "Aprofundamento teórico, interpretação de casos complexos e questões de vestibulares e exames.",
    pedagogicalRole: "Desenvolvimento de análise crítica e domínio aprofundado do conteúdo."
  },
  4: {
    name: "Nível 4 (Aprofundamento)",
    badge: "Síntese & Interdisciplinaridade",
    color: "from-purple-600 to-pink-600",
    description: "Diálogo interdisciplinar, leitura de obras de referência e debates contemporâneos da área.",
    pedagogicalRole: "Iniciação científica e síntese autônoma do conhecimento."
  }
};

/**
 * Generates a structured pedagogical summary specific to the topic and discipline
 */
export function getStructuredSummary(
  content: ContentItem,
  level: LearningTrackLevel
): StructuredSummarySection {
  const profile = getDisciplineProfile(content.disciplineId, content.subtitle);
  const domain = getTopicDomainKnowledge(
    content.disciplineId,
    content.title,
    content.subtitle,
    content.prerequisites?.[0]
  );

  return {
    whatIsAndContext: `${domain.coreDefinition}\n\nContextualização em ${profile.name} (${PROGRESSIVE_LEVEL_DEFINITIONS[level].name}): ${domain.historicalContext}`,
    keyConcepts: [
      {
        concept: `Conceito Central de ${content.title}`,
        deepExplanation: domain.coreDefinition,
        mechanism: domain.mechanismsAndProcesses
      },
      {
        concept: `Articulação com ${domain.prerequisiteTitle}`,
        deepExplanation: domain.importantRelations,
        mechanism: domain.formulaOrSyntax || ` Termos-chave: ${domain.keyTerms.join(", ")}.`
      }
    ],
    practicalDailyExamples: domain.practicalExamples,
    technicalApplications: [
      {
        field: profile.name,
        application: domain.practicalExamples[0] || domain.coreDefinition
      },
      {
        field: domain.moduleTitle,
        application: domain.importantRelations
      }
    ],
    commonPitfalls: [
      {
        mistake: domain.commonMistake,
        correction: domain.mistakeCorrection,
        examTrick: `Nas questões sobre ${content.title}, fique atento à distinção conceitual apresentada acima.`
      }
    ],
    synthesisTable: domain.keyTerms.slice(0, 4).map((term, i) => ({
      concept: term,
      definition:
        i === 0
          ? domain.coreDefinition
          : i === 1
          ? domain.mechanismsAndProcesses
          : i === 2
          ? domain.importantRelations
          : domain.mistakeCorrection,
      mnemonicOrRule:
        i === 0 && domain.formulaOrSyntax
          ? domain.formulaOrSyntax
          : `Relacionado a ${domain.moduleTitle}`
    })),
    activeRecallCheckpoint: {
      question: `Explique com suas palavras o conceito central de "${content.title}" em ${profile.name} e cite um exemplo concreto de aplicação.`,
      hint: `Lembre-se dos elementos essenciais: ${domain.keyTerms.slice(0, 3).join(", ")}.`,
      modelAnswer: `${domain.coreDefinition} Exemplo prático: ${domain.practicalExamples[0]}`
    }
  };
}

/**
 * Returns discipline-specific and topic-specific Guided Research (Pesquisa Guiada)
 * without generic engineering/variables/experiments jargon where inappropriate and with real sources.
 */
export function getEnrichedGuidedResearch(content: ContentItem) {
  const t = content.title;
  const profile = getDisciplineProfile(content.disciplineId, content.subtitle);
  const domain = getTopicDomainKnowledge(
    content.disciplineId,
    content.title,
    content.subtitle,
    content.prerequisites?.[0]
  );

  if (domain.areaType === "humanas") {
    return {
      guidingQuestions: [
        `1. Em qual contexto histórico, social e econômico emergiu a discussão sobre "${t}" em ${profile.name}?`,
        `2. Quais são os conceitos centrais, autores ou sujeitos históricos envolvidos na análise de "${t}"?`,
        `3. Como diferentes correntes teóricas ou grupos sociais interpretam os impactos de "${t}"?`,
        `4. Quais permanências, transformações e desafios ligados a "${t}" podem ser observados na sociedade brasileira contemporânea?`
      ],
      chronologicalAndConceptualPhases: [
        {
          phaseTitle: "Etapa 1: Contextualização Histórica e Social",
          drivingQuestion: `Quais processos históricos e transformações sociais deram origem ao debate sobre "${t}"?`,
          epistemicContext: domain.historicalContext
        },
        {
          phaseTitle: "Etapa 2: Conceitos Fundamentais e Autores de Referência",
          drivingQuestion: `Quais categorias de análise explicam "${t}" em ${profile.name}?`,
          epistemicContext: domain.coreDefinition
        },
        {
          phaseTitle: "Etapa 3: Análise de Fontes, Dados e Comparação",
          drivingQuestion: `Como analisar documentos, indicadores sociais ou relatos históricos sobre "${t}"?`,
          epistemicContext: domain.mechanismsAndProcesses
        },
        {
          phaseTitle: "Etapa 4: Reflexão Crítica e Realidade Brasileira",
          drivingQuestion: `Como "${t}" se manifesta nos debates públicos, na cidadania e no território hoje?`,
          epistemicContext: domain.importantRelations
        }
      ],
      causesAndContext: domain.historicalContext,
      socioeconomicAndTechnicalContext: `${domain.coreDefinition} ${domain.practicalExamples[0]}`,
      contemporaryOutcomesAndImpacts: `${domain.practicalExamples[1] || ""} ${domain.importantRelations}`,
      historiographicalAndScientificDebates: `Na literatura de ${profile.name}, o debate sobre "${t}" enfatiza a superação do senso comum e de visões redutoras: ${domain.mistakeCorrection}`,
      practicalChallenge: `Roteiro Prático de Pesquisa em ${profile.name}: Selecione uma fonte documental, reportagem ou indicador oficial (como dados do IBGE, IPEA ou acervo histórico) relacionado a "${t}". Analise: (a) o contexto em que foi produzido; (b) os conceitos de ${profile.name} (${domain.keyTerms.slice(0, 3).join(", ")}) presentes no caso; e (c) elabore uma conclusão crítica relacionando o tema à realidade social brasileira.`,
      hypothesisToInvestigate: `Questão Norteadora de Conclusão: De que maneira a compreensão de "${t}" permite interpretar criticamente as relações sociais, históricas ou espaciais estudadas em ${profile.name}?`,
      suggestedSources: profile.realSources,
      deepDiveNotes: `Orientação de Estudo: Registre em seu fichamento as definições de ${domain.keyTerms.slice(0, 3).join(", ")} e compare os exemplos analisados com os conceitos de "${domain.prerequisiteTitle}".`
    };
  }

  if (domain.areaType === "biologicas") {
    return {
      guidingQuestions: [
        `1. Quais estruturas celulares, biomoléculas ou sistemas fisiológicos participam diretamente de "${t}"?`,
        `2. Quais são as etapas sequenciais do processo biológico em "${t}" e onde cada uma ocorre?`,
        `3. Qual a importância funcional e adaptativa de "${t}" para a manutenção da vida e o equilíbrio ecológico?`,
        `4. Como alterações ambientais, genéticas ou fisiológicas afetam o funcionamento de "${t}"?`
      ],
      chronologicalAndConceptualPhases: [
        {
          phaseTitle: "Etapa 1: Estruturas e Componentes Biológicos",
          drivingQuestion: `Onde ocorre "${t}" e quais organelas, moléculas ou tecidos estão envolvidos?`,
          epistemicContext: domain.coreDefinition
        },
        {
          phaseTitle: "Etapa 2: Etapas e Mecanismos do Processo Biológico",
          drivingQuestion: `Como se encadeiam as reações, divisões ou interações biológicas em "${t}"?`,
          epistemicContext: domain.mechanismsAndProcesses
        },
        {
          phaseTitle: "Etapa 3: Função Fisiológica, Evolutiva e Ecológica",
          drivingQuestion: `Qual o papel biológico de "${t}" para o organismo e para o ecossistema?`,
          epistemicContext: domain.importantRelations
        },
        {
          phaseTitle: "Etapa 4: Aplicações em Saúde, Biotecnologia e Meio Ambiente",
          drivingQuestion: `Como o conhecimento de "${t}" é aplicado na medicina, agricultura ou conservação ambiental?`,
          epistemicContext: domain.practicalExamples.join(" ")
        }
      ],
      causesAndContext: domain.historicalContext,
      socioeconomicAndTechnicalContext: domain.coreDefinition,
      contemporaryOutcomesAndImpacts: domain.practicalExamples.join(" "),
      historiographicalAndScientificDebates: `Ponto essencial na Biologia: ${domain.mistakeCorrection}`,
      practicalChallenge: `Investigação Biológica Guiada: Construa um quadro comparativo ou fluxograma detalhando as etapas de "${t}", indicando: (1) local de ocorrência na célula/organismo; (2) principais estruturas ou enzimas participantes; (3) relação com "${domain.prerequisiteTitle}"; e (4) conclusão sobre sua importância para a saúde humana ou preservação ambiental.`,
      hypothesisToInvestigate: `Síntese Esperada: Explicar como a estrutura morfofuncional determina cada etapa de "${t}" e quais seriam as consequências biológicas caso esse processo fosse interrompido.`,
      suggestedSources: profile.realSources,
      deepDiveNotes: `Dica de Biologia: Relacione sempre a estrutura (organela/molécula) à sua função específica e revise os termos: ${domain.keyTerms.join(", ")}.`
    };
  }

  if (domain.areaType === "linguagens") {
    return {
      guidingQuestions: [
        `1. Qual é a função comunicativa, expressiva e estrutural de "${t}" em ${profile.name}?`,
        `2. Como essa estrutura gramatical ou estratégia textual constrói sentido dentro de diferentes gêneros textuais?`,
        `3. Quais são os principais desvios ou armadilhas de interpretação relacionados a "${t}"?`,
        `4. Como aplicar "${t}" com precisão na leitura crítica e na produção textual autoral?`
      ],
      chronologicalAndConceptualPhases: [
        {
          phaseTitle: "Etapa 1: Compreensão da Regra e Estrutura Linguística",
          drivingQuestion: `O que caracteriza formalmente "${t}" em ${profile.name}?`,
          epistemicContext: domain.coreDefinition
        },
        {
          phaseTitle: "Etapa 2: Análise do Uso em Contexto e Construção de Sentido",
          drivingQuestion: `Que efeitos de sentido o uso de "${t}" provoca na leitura de um texto?`,
          epistemicContext: domain.mechanismsAndProcesses
        },
        {
          phaseTitle: "Etapa 3: Comparação de Construções e Adequação Vocabular",
          drivingQuestion: `Como distinguir os usos adequados dos desvios frequentes em "${t}"?`,
          epistemicContext: `${domain.commonMistake} → ${domain.mistakeCorrection}`
        },
        {
          phaseTitle: "Etapa 4: Aplicação na Leitura e Produção Textual",
          drivingQuestion: `Como empregar "${t}" em redações, análises textuais e questões do ENEM?`,
          epistemicContext: domain.practicalExamples.join(" ")
        }
      ],
      causesAndContext: domain.historicalContext,
      socioeconomicAndTechnicalContext: domain.coreDefinition,
      contemporaryOutcomesAndImpacts: domain.practicalExamples.join(" "),
      historiographicalAndScientificDebates: `Orientação linguística e normativa: ${domain.mistakeCorrection}`,
      practicalChallenge: `Atividade de Investigação Linguística: Analise dois parágrafos (jornalístico, acadêmico ou redação modelo ENEM) em que ocorra a aplicação de "${t}". Identifique os elementos estruturais empregados, explique o efeito de sentido construído pelo autor e reescreva um trecho aplicando a regra estudada.`,
      hypothesisToInvestigate: `Conclusão Esperada: Demonstrar como o domínio consciente de "${t}" amplia a clareza argumentativa, a coesão textual e a precisão na interpretação de textos em ${profile.name}.`,
      suggestedSources: profile.realSources,
      deepDiveNotes: `Foco de Linguagens: Nunca analise palavras soltas fora do texto; observe sempre a relação sintática e semântica no enunciado completo.`
    };
  }

  // Exatas (Matemática, Física, Robótica) e Técnicas (APS, Banco de Dados, Web, Design, TCC)
  return {
    guidingQuestions: [
      `1. Qual é a definição fundamental e o princípio de funcionamento de "${t}" em ${profile.name}?`,
      `2. Quais propriedades, regras ou relações formais permitem aplicar "${t}" na resolução de problemas?`,
      `3. Quais são os erros mais comuns na resolução de exercícios ou projetos sobre "${t}" e como evitá-los?`,
      `4. Como "${t}" é aplicado em situações práticas e conectado a "${domain.prerequisiteTitle}"?`
    ],
    chronologicalAndConceptualPhases: [
      {
        phaseTitle: "Etapa 1: Conceito Fundamental e Contextualização",
        drivingQuestion: `Qual problema real de ${profile.name} é resolvido por "${t}"?`,
        epistemicContext: `${domain.coreDefinition} ${domain.historicalContext}`
      },
      {
        phaseTitle: "Etapa 2: Propriedades, Regras e Procedimento Passo a Passo",
        drivingQuestion: `Quais são as etapas lógicas para aplicar "${t}" corretamente?`,
        epistemicContext: domain.mechanismsAndProcesses
      },
      {
        phaseTitle: "Etapa 3: Resolução de Casos Práticos e Verificação",
        drivingQuestion: `Como validar o resultado obtido ao aplicar "${t}"?`,
        epistemicContext: domain.practicalExamples.join(" ")
      },
      {
        phaseTitle: "Etapa 4: Prevenção de Erros e Conexões na Disciplina",
        drivingQuestion: `Quais cuidados garantem a precisão técnica em "${t}"?`,
        epistemicContext: `${domain.mistakeCorrection} ${domain.importantRelations}`
      }
    ],
    causesAndContext: domain.historicalContext,
    socioeconomicAndTechnicalContext: `${domain.coreDefinition} ${domain.formulaOrSyntax ? `Expressão/Sintaxe de referência: ${domain.formulaOrSyntax}.` : ""}`,
    contemporaryOutcomesAndImpacts: domain.practicalExamples.join(" "),
    historiographicalAndScientificDebates: `Atenção técnica e conceitual: ${domain.mistakeCorrection}`,
    practicalChallenge: `Desafio Prático em ${profile.name}: Resolva e documente passo a passo um caso prático envolvendo "${t}". Explicite: (1) os dados ou requisitos iniciais; (2) o desenvolvimento detalhado aplicando as regras de ${profile.name}; e (3) a interpretação final do resultado obtido.`,
    hypothesisToInvestigate: `Conclusão Esperada: Comprovar como a aplicação estruturada de "${t}" conduz a resultados consistentes e verificáveis em ${profile.name}.`,
    suggestedSources: profile.realSources,
    deepDiveNotes: `Síntese de Estudo: Revise o pré-requisito "${domain.prerequisiteTitle}" e pratique a resolução passo a passo conferindo as unidades e condições do enunciado.`
  };
}

/**
 * Returns 6 domain-authentic flashcards for any topic, adapting card types to the discipline
 * and using formulas ONLY when the topic genuinely has formulas.
 */
export function getEnrichedFlashcards(content: ContentItem): FlashcardItem[] {
  const t = content.title;
  const profile = getDisciplineProfile(content.disciplineId, content.subtitle);
  const domain = getTopicDomainKnowledge(
    content.disciplineId,
    content.title,
    content.subtitle,
    content.prerequisites?.[0]
  );

  // 1. HUMANAS (Sociologia, História, Geografia, Empreendedorismo Social) — SEM fórmulas matemáticas ou jargão de sistemas
  if (domain.areaType === "humanas") {
    return [
      {
        id: `${content.id}-fc-1`,
        type: "conceito",
        question: `[Conceito Central — ${profile.name}] Como se define "${t}" e qual sua importância no estudo de ${domain.moduleTitle}?`,
        answer: domain.coreDefinition,
        difficulty: "facil",
        masteryScore: 85,
        cognitiveLevel: 1,
        spacedRepetitionDays: 3
      },
      {
        id: `${content.id}-fc-2`,
        type: "causa_efeito",
        question: `[Contexto Histórico e Social] Quais processos históricos e transformações sociais explicam a origem e o desenvolvimento de "${t}"?`,
        answer: domain.historicalContext,
        difficulty: "medio",
        masteryScore: 75,
        cognitiveLevel: 2,
        spacedRepetitionDays: 2
      },
      {
        id: `${content.id}-fc-3`,
        type: "conceito",
        question: `[Autores, Sujeitos e Categorias de Análise] Quais elementos teóricos e passos de análise são mobilizados para compreender "${t}" em ${profile.name}?`,
        answer: domain.mechanismsAndProcesses,
        difficulty: "medio",
        masteryScore: 70,
        cognitiveLevel: 2,
        spacedRepetitionDays: 2
      },
      {
        id: `${content.id}-fc-4`,
        type: "comparacao",
        question: `[Comparação e Articulação] Como "${t}" se relaciona com "${domain.prerequisiteTitle}" e com outros debates de ${profile.name}?`,
        answer: domain.importantRelations,
        difficulty: "dificil",
        masteryScore: 60,
        cognitiveLevel: 3,
        spacedRepetitionDays: 1
      },
      {
        id: `${content.id}-fc-5`,
        type: "erro_comum",
        question: `[Cuidado Interpretativo] Qual é o equívoco conceitual mais frequente ao analisar "${t}" em provas de ${profile.name} e como evitá-lo?`,
        answer: `Equívoco comum: ${domain.commonMistake} Correção: ${domain.mistakeCorrection}`,
        difficulty: "medio",
        masteryScore: 65,
        cognitiveLevel: 2,
        spacedRepetitionDays: 2
      },
      {
        id: `${content.id}-fc-6`,
        type: "aplicacao",
        question: `[Exemplificação Concreta] Cite um exemplo real e contextualizado que ilustra "${t}" na prática social ou histórica.`,
        answer: domain.practicalExamples.join(" "),
        difficulty: "dificil",
        masteryScore: 55,
        cognitiveLevel: 4,
        spacedRepetitionDays: 1
      }
    ];
  }

  // 2. BIOLOGIA — Estruturas, processos, funções, etapas, comparações e aplicações
  if (domain.areaType === "biologicas") {
    return [
      {
        id: `${content.id}-fc-1`,
        type: "conceito",
        question: `[Estrutura e Definição Biológica] O que caracteriza "${t}" na Biologia e quais estruturas celulares ou sistemas estão envolvidos?`,
        answer: domain.coreDefinition,
        difficulty: "facil",
        masteryScore: 85,
        cognitiveLevel: 1,
        spacedRepetitionDays: 3
      },
      {
        id: `${content.id}-fc-2`,
        type: "causa_efeito",
        question: `[Etapas e Mecanismos Fisiológicos] Como ocorrem as etapas sequenciais do processo estudado em "${t}"?`,
        answer: domain.mechanismsAndProcesses,
        difficulty: "medio",
        masteryScore: 72,
        cognitiveLevel: 2,
        spacedRepetitionDays: 2
      },
      {
        id: `${content.id}-fc-3`,
        type: "conceito",
        question: `[Descoberta Científica e Contexto] Como a ciência elucidou os mecanismos biológicos de "${t}"?`,
        answer: domain.historicalContext,
        difficulty: "facil",
        masteryScore: 80,
        cognitiveLevel: 1,
        spacedRepetitionDays: 3
      },
      {
        id: `${content.id}-fc-4`,
        type: "comparacao",
        question: `[Relação Funcional e Ecológica] Qual é a conexão biológica entre "${t}", "${domain.prerequisiteTitle}" e o funcionamento dos seres vivos/ecossistemas?`,
        answer: domain.importantRelations,
        difficulty: "dificil",
        masteryScore: 60,
        cognitiveLevel: 3,
        spacedRepetitionDays: 1
      },
      {
        id: `${content.id}-fc-5`,
        type: "erro_comum",
        question: `[Armadilha Conceitual em Biologia] Qual confusão frequente os estudantes cometem sobre "${t}" e qual é a explicação biológica correta?`,
        answer: `Confusão frequente: ${domain.commonMistake} Explicação correta: ${domain.mistakeCorrection}`,
        difficulty: "medio",
        masteryScore: 65,
        cognitiveLevel: 2,
        spacedRepetitionDays: 2
      },
      {
        id: `${content.id}-fc-6`,
        type: "aplicacao",
        question: `[Aplicação Prática e Fisiológica] Como "${t}" se manifesta em exemplos concretos da natureza, saúde ou agronomia?`,
        answer: domain.practicalExamples.join(" "),
        difficulty: "dificil",
        masteryScore: 50,
        cognitiveLevel: 4,
        spacedRepetitionDays: 1
      }
    ];
  }

  // 3. LINGUAGENS (Português/Redação e Inglês) — Regras gramaticais, texto, contexto e desvios
  if (domain.areaType === "linguagens") {
    return [
      {
        id: `${content.id}-fc-1`,
        type: "conceito",
        question: `[Definição Linguística — ${profile.name}] Em que consiste "${t}" e qual sua função na estruturação de enunciados e textos?`,
        answer: domain.coreDefinition,
        difficulty: "facil",
        masteryScore: 85,
        cognitiveLevel: 1,
        spacedRepetitionDays: 3
      },
      {
        id: `${content.id}-fc-2`,
        type: "causa_efeito",
        question: `[Construção de Sentido e Regras de Uso] Quais passos permitem identificar e empregar corretamente "${t}" no contexto comunicativo?`,
        answer: domain.mechanismsAndProcesses,
        difficulty: "medio",
        masteryScore: 70,
        cognitiveLevel: 2,
        spacedRepetitionDays: 2
      },
      {
        id: `${content.id}-fc-3`,
        type: "comparacao",
        question: `[Análise Contrastiva em Contexto] Como a escolha adequada em "${t}" altera a clareza, a coesão ou o sentido da frase?`,
        answer: `${domain.practicalExamples[0]} ${domain.formulaInterpretation || ""}`,
        difficulty: "medio",
        masteryScore: 68,
        cognitiveLevel: 2,
        spacedRepetitionDays: 2
      },
      {
        id: `${content.id}-fc-4`,
        type: "erro_comum",
        question: `[Desvio Comum / Pegadinha de Prova] Qual é o erro mais recorrente no uso ou interpretação de "${t}" e como corrigi-lo?`,
        answer: `Desvio comum: ${domain.commonMistake} Como acertar: ${domain.mistakeCorrection}`,
        difficulty: "medio",
        masteryScore: 60,
        cognitiveLevel: 3,
        spacedRepetitionDays: 2
      },
      {
        id: `${content.id}-fc-5`,
        type: "aplicacao",
        question: `[Aplicação Prática em Textos e Exames] Dê um exemplo concreto de aplicação de "${t}" na leitura crítica ou redação.`,
        answer: domain.practicalExamples[1] || domain.practicalExamples[0],
        difficulty: "dificil",
        masteryScore: 55,
        cognitiveLevel: 3,
        spacedRepetitionDays: 1
      },
      {
        id: `${content.id}-fc-6`,
        type: "conceito",
        question: `[Analogia e Fixação Rápida] Qual síntese prática ajuda a não esquecer o funcionamento de "${t}"?`,
        answer: domain.analogyExplanation,
        difficulty: "facil",
        masteryScore: 80,
        cognitiveLevel: 4,
        spacedRepetitionDays: 3
      }
    ];
  }

  // 4. EXATAS (Matemática, Física, Robótica) — Com Fórmula real quando aplicável
  if (domain.areaType === "exatas") {
    return [
      {
        id: `${content.id}-fc-1`,
        type: "conceito",
        question: `[Conceito e Propriedade — ${profile.name}] O que define "${t}" e quais grandezas ou elementos matemáticos/físicos relaciona?`,
        answer: domain.coreDefinition,
        difficulty: "facil",
        masteryScore: 85,
        cognitiveLevel: 1,
        spacedRepetitionDays: 3
      },
      {
        id: `${content.id}-fc-2`,
        type: "formula",
        question: `[Fórmula e Significado dos Termos] Qual é a expressão matemática/física de referência em "${t}" e o que representa cada grandeza?`,
        answer: `${domain.formulaOrSyntax || domain.coreDefinition}. ${domain.formulaInterpretation || ""}`,
        difficulty: "medio",
        masteryScore: 70,
        cognitiveLevel: 2,
        spacedRepetitionDays: 2
      },
      {
        id: `${content.id}-fc-3`,
        type: "causa_efeito",
        question: `[Procedimento Passo a Passo de Cálculo] Quais etapas devem ser seguidas para resolver problemas de "${t}" sem erro?`,
        answer: domain.mechanismsAndProcesses,
        difficulty: "medio",
        masteryScore: 68,
        cognitiveLevel: 2,
        spacedRepetitionDays: 2
      },
      {
        id: `${content.id}-fc-4`,
        type: "aplicacao",
        question: `[Exemplo Resolvido com Cálculo] Demonstre um exemplo numérico prático de aplicação de "${t}".`,
        answer: domain.practicalExamples[0],
        difficulty: "dificil",
        masteryScore: 55,
        cognitiveLevel: 3,
        spacedRepetitionDays: 1
      },
      {
        id: `${content.id}-fc-5`,
        type: "erro_comum",
        question: `[Erro Comum de Cálculo ou Unidade] Qual é a falha mais frequente ao resolver questões de "${t}" e como evitá-la?`,
        answer: `Erro frequente: ${domain.commonMistake} Correção: ${domain.mistakeCorrection}`,
        difficulty: "medio",
        masteryScore: 60,
        cognitiveLevel: 2,
        spacedRepetitionDays: 2
      },
      {
        id: `${content.id}-fc-6`,
        type: "comparacao",
        question: `[Interpretação Física/Matemática] Como interpretar o resultado obtido em "${t}" e conectá-lo a "${domain.prerequisiteTitle}"?`,
        answer: `${domain.practicalExamples[1] || ""} ${domain.importantRelations}`,
        difficulty: "dificil",
        masteryScore: 50,
        cognitiveLevel: 4,
        spacedRepetitionDays: 1
      }
    ];
  }

  // 5. TÉCNICAS E COMPUTAÇÃO (APS, Banco de Dados, Desenvolvimento Web, Design de Interface, TCC)
  return [
    {
      id: `${content.id}-fc-1`,
      type: "conceito",
      question: `[Conceito Técnico — ${profile.name}] O que define "${t}" no contexto de ${domain.moduleTitle}?`,
      answer: domain.coreDefinition,
      difficulty: "facil",
      masteryScore: 85,
      cognitiveLevel: 1,
      spacedRepetitionDays: 3
    },
    {
      id: `${content.id}-fc-2`,
      type: "causa_efeito",
      question: `[Funcionamento e Etapa Metodológica] Como aplicar corretamente as regras e etapas técnicas de "${t}"?`,
      answer: domain.mechanismsAndProcesses,
      difficulty: "medio",
      masteryScore: 72,
      cognitiveLevel: 2,
      spacedRepetitionDays: 2
    },
    {
      id: `${content.id}-fc-3`,
      type: "comparacao",
      question: `[Distinção Técnica e Critérios] Qual é a distinção conceitual ou sintática essencial estudada em "${t}"?`,
      answer: `${domain.formulaOrSyntax ? `Estrutura/Padrão: ${domain.formulaOrSyntax}. ` : ""}${domain.formulaInterpretation || domain.importantRelations}`,
      difficulty: "medio",
      masteryScore: 68,
      cognitiveLevel: 2,
      spacedRepetitionDays: 2
    },
    {
      id: `${content.id}-fc-4`,
      type: "erro_comum",
      question: `[Erro Comum de Projeto / Implementação] Qual falha deve ser evitada ao trabalhar com "${t}" e qual é a boa prática recomendada?`,
      answer: `Falha comum: ${domain.commonMistake} Boa prática: ${domain.mistakeCorrection}`,
      difficulty: "medio",
      masteryScore: 62,
      cognitiveLevel: 3,
      spacedRepetitionDays: 2
    },
    {
      id: `${content.id}-fc-5`,
      type: "aplicacao",
      question: `[Caso Prático de Aplicação] Dê um exemplo concreto de uso de "${t}" em um projeto real de ${profile.name}.`,
      answer: domain.practicalExamples.join(" "),
      difficulty: "dificil",
      masteryScore: 55,
      cognitiveLevel: 4,
      spacedRepetitionDays: 1
    },
    {
      id: `${content.id}-fc-6`,
      type: "conceito",
      question: `[Síntese Intuitiva] Como explicar de forma clara e direta a função de "${t}" para a equipe de projeto?`,
      answer: domain.analogyExplanation,
      difficulty: "facil",
      masteryScore: 80,
      cognitiveLevel: 1,
      spacedRepetitionDays: 3
    }
  ];
}

/**
 * Returns structured audiovisual progression tracks across the 4 levels
 */
export function getEnrichedVideos(content: ContentItem): VideoLesson[] {
  const t = content.title;
  const profile = getDisciplineProfile(content.disciplineId, content.subtitle);
  const domain = getTopicDomainKnowledge(
    content.disciplineId,
    content.title,
    content.subtitle,
    content.prerequisites?.[0]
  );

  return [
    {
      id: `${content.id}-vid-1`,
      title: `Aula 1: Conceitos Fundamentais e Contextualização de ${t}`,
      channel: `ProfeIA • ${profile.name} (Nível 1)`,
      duration: "14:20",
      description: domain.coreDefinition,
      level: 1,
      prerequisites: [domain.prerequisiteTitle],
      whatWillBeLearned: [
        `Definição clara e contextualizada de ${t}`,
        `Contexto histórico e origem em ${profile.name}`,
        `Termos essenciais: ${domain.keyTerms.slice(0, 3).join(", ")}`
      ],
      practicalImportance: `Constrói a base indispensável para compreender ${domain.moduleTitle}.`,
      nextStepsToStudy: "Avançar para a Aula 2 e revisar os flashcards de conceito."
    },
    {
      id: `${content.id}-vid-2`,
      title: `Aula 2: Desenvolvimento Prático e Exemplos de ${t}`,
      channel: `ProfeIA • ${profile.name} (Nível 2)`,
      duration: "21:45",
      description: domain.mechanismsAndProcesses,
      level: 2,
      prerequisites: [`Compreensão inicial de ${t} e ${domain.prerequisiteTitle}`],
      whatWillBeLearned: [
        profile.coreMethodologies?.[0] || `Análise passo a passo de ${t}`,
        `Exemplos concretos comentados de ${profile.name}`,
        `Como evitar o erro comum: ${domain.commonMistake.slice(0, 80)}...`
      ],
      practicalImportance: "Prepara diretamente para resolver as atividades diagnósticas do tópico.",
      nextStepsToStudy: "Resolver o caderno de 10 questões na aba de Atividades."
    },
    {
      id: `${content.id}-vid-3`,
      title: `Aula 3: Análise Aprofundada e Questões Comentadas de ${t}`,
      channel: `Plantão Pedagógico • ${profile.name} (Nível 3)`,
      duration: "26:10",
      description: domain.practicalExamples.join(" "),
      level: 3,
      prerequisites: [`Domínio intermediário de ${domain.moduleTitle}`],
      whatWillBeLearned: [
        "Resolução comentada de questões contextualizadas e exames",
        "Comparação de casos e análise de armadilhas frequentes",
        `Articulação avançada em ${profile.name}`
      ],
      practicalImportance: "Consolida o domínio analítico e interpretativo em avaliações complexas.",
      nextStepsToStudy: "Explorar o Mapa Conceitual e o roteiro de Pesquisa Guiada."
    },
    {
      id: `${content.id}-vid-4`,
      title: `Aula 4: Conexões Interdisciplinares e Debates Contemporâneos sobre ${t}`,
      channel: `Seminário Integrador • ${profile.name} (Nível 4)`,
      duration: "29:30",
      description: domain.importantRelations,
      level: 4,
      prerequisites: [`Conclusão das etapas anteriores de ${t}`],
      whatWillBeLearned: [
        "Conexões interdisciplinares com outras áreas do currículo",
        "Fontes de referência e aplicações contemporâneas",
        "Síntese crítica para projetos e redação acadêmica"
      ],
      practicalImportance: "Amplia a visão interdisciplinar e a autonomia intelectual do estudante.",
      nextStepsToStudy: "Debater o tema na chamada educacional com o TutorIA."
    }
  ];
}

/**
 * Returns a 4-level deep tree Mind Map tailored to the topic and discipline
 */
export function getEnrichedMindMap(content: ContentItem): MindMapNode {
  const t = content.title;
  const profile = getDisciplineProfile(content.disciplineId, content.subtitle);
  const domain = getTopicDomainKnowledge(
    content.disciplineId,
    content.title,
    content.subtitle,
    content.prerequisites?.[0]
  );

  return {
    id: `root-${content.id}`,
    label: `${t} (${profile.name})`,
    level: 0,
    color: "from-indigo-600 to-blue-600",
    description: `${domain.moduleTitle} • Eixo Central`,
    technicalDetail: domain.coreDefinition,
    children: [
      {
        id: `branch-fundamentos-${content.id}`,
        label: "1. Conceitos Fundamentais e Contexto",
        level: 1,
        color: "from-blue-600 to-cyan-600",
        description: `Definição central e origem histórica em ${profile.name}.`,
        children: [
          {
            id: `sub-conceito-base-${content.id}`,
            label: "Definição e Contexto",
            level: 2,
            description: domain.coreDefinition,
            children: [
              {
                id: `leaf-detalhe-1-${content.id}`,
                label: domain.keyTerms[0] || "Conceito Nuclear",
                level: 3,
                technicalDetail: domain.historicalContext,
                example: domain.practicalExamples[0]
              },
              {
                id: `leaf-detalhe-2-${content.id}`,
                label: `Pré-requisito: ${domain.prerequisiteTitle}`,
                level: 3,
                technicalDetail: `Base necessária para avançar em ${t}.`,
                example: `Revisão articulada com ${domain.moduleTitle}.`
              }
            ]
          }
        ]
      },
      {
        id: `branch-metodos-${content.id}`,
        label:
          domain.areaType === "humanas"
            ? "2. Processos Históricos e Categorias de Análise"
            : domain.areaType === "biologicas"
            ? "2. Estruturas e Mecanismos Biológicos"
            : "2. Regras, Propriedades e Desenvolvimento",
        level: 1,
        color: "from-emerald-600 to-teal-600",
        description: domain.mechanismsAndProcesses,
        children: [
          {
            id: `sub-algoritmo-solucao-${content.id}`,
            label: domain.keyTerms[1] || "Mecanismos Principais",
            level: 2,
            description: domain.formulaInterpretation || domain.mechanismsAndProcesses,
            children: [
              {
                id: `leaf-resolucao-1-${content.id}`,
                label: domain.keyTerms[2] || "Análise e Aplicação",
                level: 3,
                technicalDetail: domain.formulaOrSyntax || domain.mechanismsAndProcesses,
                example: domain.practicalExamples[1] || domain.practicalExamples[0]
              },
              {
                id: `leaf-resolucao-2-${content.id}`,
                label: "Prevenção de Erros Comuns",
                level: 3,
                technicalDetail: domain.commonMistake,
                example: domain.mistakeCorrection
              }
            ]
          }
        ]
      },
      {
        id: `branch-aplicacoes-${content.id}`,
        label: "3. Exemplos Reais e Conexões na Área",
        level: 1,
        color: "from-purple-600 to-pink-600",
        description: domain.importantRelations,
        children: [
          {
            id: `sub-industria-${content.id}`,
            label: "Aplicações e Fontes de Estudo",
            level: 2,
            description: `Articulação prática em ${profile.name}.`,
            children: [
              {
                id: `leaf-app-1-${content.id}`,
                label: domain.keyTerms[3] || "Síntese Aplicada",
                level: 3,
                technicalDetail: domain.importantRelations,
                example: `Referência: ${profile.realSources[0]}`
              }
            ]
          }
        ]
      }
    ]
  };
}

/**
 * Returns an enriched concept map tailored to the topic and discipline
 */
export function getEnrichedConceptMap(content: ContentItem): ConceptMapNode[] {
  const t = content.title;
  const profile = getDisciplineProfile(content.disciplineId, content.subtitle);
  const domain = getTopicDomainKnowledge(
    content.disciplineId,
    content.title,
    content.subtitle,
    content.prerequisites?.[0]
  );

  return [
    {
      from: t,
      relationship: "integra o eixo temático de",
      to: domain.moduleTitle,
      contextNote: `Estrutura curricular de ${profile.name}.`
    },
    {
      from: t,
      relationship: "tem como pré-requisito fundamental",
      to: domain.prerequisiteTitle,
      contextNote: `A consolidação de "${domain.prerequisiteTitle}" facilita a compreensão de "${t}".`
    },
    {
      from: t,
      relationship: "mobiliza os conceitos-chave de",
      to: domain.keyTerms.slice(0, 3).join(", "),
      contextNote: domain.coreDefinition
    },
    {
      from: domain.keyTerms[0] || t,
      relationship: "explica na prática",
      to: domain.keyTerms[1] || domain.moduleTitle,
      contextNote: domain.practicalExamples[0]
    },
    {
      from: t,
      relationship: "exige atenção para evitar",
      to: domain.commonMistake.slice(0, 70) + "...",
      contextNote: domain.mistakeCorrection
    },
    {
      from: t,
      relationship: "conecta-se de forma interdisciplinar com",
      to:
        domain.areaType === "humanas"
          ? "História, Geografia, Sociologia e Redação Cidadã"
          : domain.areaType === "biologicas"
          ? "Química, Saúde Pública e Ciências Ambientais"
          : domain.areaType === "linguagens"
          ? "Ciências Humanas, Comunicação e Interpretação Crítica"
          : "Ciências da Natureza, Matemática e Tecnologia Aplicada",
      interdisciplinaryArea: profile.fieldArea.split("•")[0].trim(),
      contextNote: domain.importantRelations
    }
  ];
}
