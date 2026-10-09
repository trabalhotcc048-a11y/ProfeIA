export interface OfficialStudent {
  id: string;
  name: string;
  turma: string;
  course: string;
  enrollmentId: string;
  avatar: string;
  isActiveProfile?: boolean;
  status: "Ativo" | "Em Estudo" | "Nivelamento Concluído" | "Avançado";
  hasFaceId?: boolean;
  faceIdData?: string | null;
  preferredLearningStyle?: {
    style: string;
    badge: string;
    description: string;
  };
  // Interactive Module Metrics (Sem notas numéricas)
  metrics: {
    debatesLearningGain: string; // ex: "+70% de aprendizado"
    simulationLearningGain: string; // ex: "+60% de aprendizado"
    activitiesProficiency: string; // ex: "+85% de proficiência"
    socraticReasoningScore: string; // ex: "+78% em dialética e oratória"
    activeStudyHours: number;
    completedInteractiveSessions: number;
  };
  // Post-Study Session Report
  postStudyReport: {
    lastSessionDate: string;
    sessionType: "Sessão de Debates" | "Laboratório de Simulação" | "Atividades & Nivelamento";
    sessionTopic: string;
    mainDifficulty: string; // ex: "Dificuldade na Sessão de Debates: Fundamentação jurídica da Constituição de 1934"
    identifiedGaps: string[];
    pedagogicalAction: string;
    criticalThinkingLevel: "Excelente" | "Em Consolidação" | "Requer Mediação";
    argumentCohesion: string;
  };
}

/**
 * Retorna o estilo de aprendizagem em que o aluno aprende melhor
 */
export function getStudentBestLearningStyle(student: OfficialStudent): {
  style: string;
  badge: string;
  description: string;
} {
  if (student.preferredLearningStyle) return student.preferredLearningStyle;

  const styles = [
    {
      style: "Resumos Discursivos Acadêmicos & Leitura Estruturada",
      badge: "Resumos Aprofundados",
      description: "Aprende melhor com textos acadêmicos contínuos, fundamentação histórica e encadeamento lógico de argumentos.",
    },
    {
      style: "Flashcards Inteligentes com Repetição Espaçada",
      badge: "Flashcards & Recall",
      description: "Absorve conceitos com maior retenção através de repetição ativa, memorização e testes rápidos de fixação.",
    },
    {
      style: "Mapas Mentais em Árvore & Relações Conceituais",
      badge: "Visual & Mapas",
      description: "Maior facilidade com representações espaciais, diagramação de tópicos e mapas conceituais ramificados.",
    },
    {
      style: "Laboratório de Simulação Viva de Cenários",
      badge: "Simulação Prática",
      description: "Retém com excelência ao vivenciar tomada de decisão técnica em tempo real com consequências imediatas.",
    },
    {
      style: "Sessão de Debates Socráticos & Dialética",
      badge: "Debate & Oratória",
      description: "Desenvolve domínio ao ser desafiado com perguntas socráticas, defesa de teses e refutação argumentativa.",
    },
  ];

  // Hash determinístico baseado no ID para consistência
  let hash = 0;
  for (let i = 0; i < student.id.length; i++) {
    hash = (hash << 5) - hash + student.id.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % styles.length;
  return styles[index];
}

export const CLASS_CODE = "INFVES3SB";
export const CLASS_NAME = "3º Ano B - Informática Vespertino (INFVES3SB)";
export const CLASS_COURSE = "Técnico em Informática Integrado ao Ensino Médio";

export const OFFICIAL_STUDENTS_LIST: OfficialStudent[] = [
  {
    id: "aluno-raissa",
    name: "Raíssa Teixeira Magalhães",
    turma: CLASS_CODE,
    course: CLASS_COURSE,
    enrollmentId: "2026-INF-0412",
    avatar: "",
    isActiveProfile: true,
    status: "Avançado",
    hasFaceId: true,
    faceIdData: "sha256-bio-raissa-teixeira-enrolled",
    metrics: {
      debatesLearningGain: "+70% de aprendizado",
      simulationLearningGain: "+60% de aprendizado",
      activitiesProficiency: "+85% de proficiência",
      socraticReasoningScore: "+88% em dialética e oratória",
      activeStudyHours: 42,
      completedInteractiveSessions: 18,
    },
    postStudyReport: {
      lastSessionDate: "Hoje às 15:30",
      sessionType: "Sessão de Debates",
      sessionTopic: "A Era Vargas e as Reformas da Constituição de 1934",
      mainDifficulty: "Dificuldade na Sessão de Debates: Fundamentação jurídica da Constituição de 1934",
      identifiedGaps: [
        "Distinção entre direitos sindicais autônomos e atrelamento corporativista ao Ministério do Trabalho.",
        "Articulação entre a Carta Constitucional de 1934 e a posterior outorga do Estado Novo em 1937."
      ],
      pedagogicalAction: "Recomenda-se disponibilizar o infográfico comparativo de Direito Constitucional e propor uma rodada socrática focada no Código Eleitoral de 1932.",
      criticalThinkingLevel: "Excelente",
      argumentCohesion: "Excelente estrutura lógica, com boa refutação oral e oratória fluida."
    }
  },
  {
    id: "aluno-alessandro",
    name: "Alessandro Pereira de Santana",
    turma: CLASS_CODE,
    course: CLASS_COURSE,
    enrollmentId: "2026-INF-0401",
    avatar: "",
    status: "Ativo",
    metrics: {
      debatesLearningGain: "+65% de aprendizado",
      simulationLearningGain: "+75% de aprendizado",
      activitiesProficiency: "+80% de proficiência",
      socraticReasoningScore: "+70% em dialética e oratória",
      activeStudyHours: 35,
      completedInteractiveSessions: 14,
    },
    postStudyReport: {
      lastSessionDate: "Ontem às 14:10",
      sessionType: "Laboratório de Simulação",
      sessionTopic: "Incidente Crítico de Produção e Queda de Servidor SQL",
      mainDifficulty: "Dificuldade no Laboratório de Simulação: Dimensionamento de buffers e latência em filas assíncronas",
      identifiedGaps: ["Otimização de índices compostos em tabelas transacionais de alto tráfego."],
      pedagogicalAction: "Realizar micro-nivelamento prático sobre transações ACID e isolamento de leitura.",
      criticalThinkingLevel: "Em Consolidação",
      argumentCohesion: "Raciocínio prático consistente na tomada de decisões técnicas sob pressão."
    }
  },
  {
    id: "aluno-ana-beatriz",
    name: "Ana Beatriz Vitoria Santana",
    turma: CLASS_CODE,
    course: CLASS_COURSE,
    enrollmentId: "2026-INF-0402",
    avatar: "",
    status: "Em Estudo",
    metrics: {
      debatesLearningGain: "+72% de aprendizado",
      simulationLearningGain: "+68% de aprendizado",
      activitiesProficiency: "+82% de proficiência",
      socraticReasoningScore: "+76% em dialética e oratória",
      activeStudyHours: 38,
      completedInteractiveSessions: 16,
    },
    postStudyReport: {
      lastSessionDate: "Hoje às 11:20",
      sessionType: "Sessão de Debates",
      sessionTopic: "Propriedade Intelectual e Autoria de Código em Inteligência Artificial",
      mainDifficulty: "Dificuldade na Sessão de Debates: Enquadramento ético do direito moral do autor no modelo Berne",
      identifiedGaps: ["Diferenciação entre autoria algorítmica e ferramentas auxiliares de compilação."],
      pedagogicalAction: "Incentivar debate guiado sobre a Lei de Software nº 9.609/98 e diretrizes internacionais da WIPO.",
      criticalThinkingLevel: "Excelente",
      argumentCohesion: "Ótima sustentação teórica e capacidade de síntese sob contra-argumentação."
    }
  },
  {
    id: "aluno-anny",
    name: "Anny Carolyne Santos de Jesus Dias",
    turma: CLASS_CODE,
    course: CLASS_COURSE,
    enrollmentId: "2026-INF-0403",
    avatar: "",
    status: "Ativo",
    metrics: {
      debatesLearningGain: "+68% de aprendizado",
      simulationLearningGain: "+64% de aprendizado",
      activitiesProficiency: "+78% de proficiência",
      socraticReasoningScore: "+74% em dialética e oratória",
      activeStudyHours: 31,
      completedInteractiveSessions: 12,
    },
    postStudyReport: {
      lastSessionDate: "Há 2 dias",
      sessionType: "Laboratório de Simulação",
      sessionTopic: "Crise Orçamentária e Gestão de Liquidez Financeira",
      mainDifficulty: "Dificuldade no Laboratório de Simulação: Cálculo de custo de oportunidade em taxas de juros flutuantes",
      identifiedGaps: ["Interpretação da curva de rendimentos e marcação a mercado de títulos."],
      pedagogicalAction: "Oferecer simulação assistida com gráficos interativos de fluxo de caixa descontado.",
      criticalThinkingLevel: "Em Consolidação",
      argumentCohesion: "Boa argumentação de risco econômico com prudência fiscal."
    }
  },
  {
    id: "aluno-diogo",
    name: "Diogo Rocha Amaral",
    turma: CLASS_CODE,
    course: CLASS_COURSE,
    enrollmentId: "2026-INF-0404",
    avatar: "",
    status: "Nivelamento Concluído",
    metrics: {
      debatesLearningGain: "+62% de aprendizado",
      simulationLearningGain: "+70% de aprendizado",
      activitiesProficiency: "+84% de proficiência",
      socraticReasoningScore: "+71% em dialética e oratória",
      activeStudyHours: 29,
      completedInteractiveSessions: 11,
    },
    postStudyReport: {
      lastSessionDate: "Há 1 dia",
      sessionType: "Atividades & Nivelamento",
      sessionTopic: "Modelagem Relacional de Banco de Dados e 3FN",
      mainDifficulty: "Dificuldade no Nivelamento: Eliminação de dependências transitivas na 3ª Forma Normal",
      identifiedGaps: ["Identificação precisa de chaves candidatas e determinantes secundários."],
      pedagogicalAction: "Nivelamento automatizado concluído com sucesso; aluno avançou para consultas JOIN avançadas.",
      criticalThinkingLevel: "Em Consolidação",
      argumentCohesion: "Raciocínio lógico estruturado e boa aderência a esquemas normalizados."
    }
  },
  {
    id: "aluno-eduardo",
    name: "Eduardo Alexandre Santana Pereira",
    turma: CLASS_CODE,
    course: CLASS_COURSE,
    enrollmentId: "2026-INF-0405",
    avatar: "",
    status: "Ativo",
    metrics: {
      debatesLearningGain: "+74% de aprendizado",
      simulationLearningGain: "+80% de aprendizado",
      activitiesProficiency: "+88% de proficiência",
      socraticReasoningScore: "+82% em dialética e oratória",
      activeStudyHours: 40,
      completedInteractiveSessions: 17,
    },
    postStudyReport: {
      lastSessionDate: "Hoje às 10:00",
      sessionType: "Laboratório de Simulação",
      sessionTopic: "Defesa de Infraestrutura Crítica Governamental contra Ataques DDoS",
      mainDifficulty: "Dificuldade no Laboratório de Simulação: Balanceamento de carga Anycast versus mitigação de scrubbing center",
      identifiedGaps: ["Políticas de rate limiting dinâmico em camadas L4 e L7."],
      pedagogicalAction: "Disponibilizar desafio prático de configuração de firewalls de aplicação web (WAF).",
      criticalThinkingLevel: "Excelente",
      argumentCohesion: "Execução estratégica rápida com alta precisão técnica."
    }
  },
  {
    id: "aluno-eliane",
    name: "Eliane Leao Salvador de Oliveira",
    turma: CLASS_CODE,
    course: CLASS_COURSE,
    enrollmentId: "2026-INF-0406",
    avatar: "",
    status: "Em Estudo",
    metrics: {
      debatesLearningGain: "+66% de aprendizado",
      simulationLearningGain: "+63% de aprendizado",
      activitiesProficiency: "+79% de proficiência",
      socraticReasoningScore: "+75% em dialética e oratória",
      activeStudyHours: 33,
      completedInteractiveSessions: 13,
    },
    postStudyReport: {
      lastSessionDate: "Ontem às 16:40",
      sessionType: "Sessão de Debates",
      sessionTopic: "Fato Social em Durkheim vs Ação Social em Max Weber",
      mainDifficulty: "Dificuldade na Sessão de Debates: Aplicação do método compreensivo ao individualismo metodológico",
      identifiedGaps: ["Conceituação dos tipos ideais de dominação tradicional e carismática."],
      pedagogicalAction: "Propor estudo de caso contemporâneo comparando burocracia institucional e líderes digitais.",
      criticalThinkingLevel: "Em Consolidação",
      argumentCohesion: "Construção textual clara com vocabulário sociológico enriquecido."
    }
  },
  {
    id: "aluno-guilherme",
    name: "Guilherme Spaitel Lima",
    turma: CLASS_CODE,
    course: CLASS_COURSE,
    enrollmentId: "2026-INF-0407",
    avatar: "",
    status: "Avançado",
    metrics: {
      debatesLearningGain: "+76% de aprendizado",
      simulationLearningGain: "+82% de aprendizado",
      activitiesProficiency: "+91% de proficiência",
      socraticReasoningScore: "+85% em dialética e oratória",
      activeStudyHours: 44,
      completedInteractiveSessions: 20,
    },
    postStudyReport: {
      lastSessionDate: "Hoje às 14:00",
      sessionType: "Laboratório de Simulação",
      sessionTopic: "Refatoração de Microsserviços e Consistência Eventual",
      mainDifficulty: "Dificuldade no Laboratório de Simulação: Implementação do padrão Saga com orquestração centralizada",
      identifiedGaps: ["Mecanismos de compensação em falhas de transações distribuídas."],
      pedagogicalAction: "Liberar módulo acelerador de nível acadêmico em Arquitetura Distribuída.",
      criticalThinkingLevel: "Excelente",
      argumentCohesion: "Demonstra domínio analítico e postura investigativa independente."
    }
  },
  {
    id: "aluno-isaque",
    name: "Isaque da Silva dos Santos",
    turma: CLASS_CODE,
    course: CLASS_COURSE,
    enrollmentId: "2026-INF-0408",
    avatar: "",
    status: "Ativo",
    metrics: {
      debatesLearningGain: "+64% de aprendizado",
      simulationLearningGain: "+69% de aprendizado",
      activitiesProficiency: "+81% de proficiência",
      socraticReasoningScore: "+72% em dialética e oratória",
      activeStudyHours: 28,
      completedInteractiveSessions: 10,
    },
    postStudyReport: {
      lastSessionDate: "Há 3 dias",
      sessionType: "Sessão de Debates",
      sessionTopic: "Sustentabilidade Energética e Transição para Fontes Renováveis",
      mainDifficulty: "Dificuldade na Sessão de Debates: Avaliação do fator de capacidade de usinas eólicas off-shore",
      identifiedGaps: ["Integração da rede de transmissão e intermitência de geração."],
      pedagogicalAction: "Fornecer dados analíticos do ONS para fundamentação empírica dos argumentos.",
      criticalThinkingLevel: "Em Consolidação",
      argumentCohesion: "Boa defesa de teses ecológicas com foco em impactos socioeconômicos."
    }
  },
  {
    id: "aluno-italo",
    name: "Italo Messias de Jesus dos Santos",
    turma: CLASS_CODE,
    course: CLASS_COURSE,
    enrollmentId: "2026-INF-0409",
    avatar: "",
    status: "Em Estudo",
    metrics: {
      debatesLearningGain: "+67% de aprendizado",
      simulationLearningGain: "+71% de aprendizado",
      activitiesProficiency: "+83% de proficiência",
      socraticReasoningScore: "+77% em dialética e oratória",
      activeStudyHours: 32,
      completedInteractiveSessions: 14,
    },
    postStudyReport: {
      lastSessionDate: "Há 1 dia",
      sessionType: "Laboratório de Simulação",
      sessionTopic: "Engenharia de Prompt e Modelos de Linguagem na Automação de Processos",
      mainDifficulty: "Dificuldade no Laboratório de Simulação: Prevenção de injeção de prompt e jailbreak em pipelines com RAG",
      identifiedGaps: ["Controle de limites contextuais e sanitização de dados não confiáveis."],
      pedagogicalAction: "Propor lab de segurança com técnicas de Few-Shot robustas e guardrails.",
      criticalThinkingLevel: "Excelente",
      argumentCohesion: "Raciocínio experimental aguçado e clareza de testes."
    }
  },
  {
    id: "aluno-kaloa",
    name: "Kaloa Sena Santos de Jesus",
    turma: CLASS_CODE,
    course: CLASS_COURSE,
    enrollmentId: "2026-INF-0410",
    avatar: "",
    status: "Ativo",
    metrics: {
      debatesLearningGain: "+69% de aprendizado",
      simulationLearningGain: "+65% de aprendizado",
      activitiesProficiency: "+80% de proficiência",
      socraticReasoningScore: "+76% em dialética e oratória",
      activeStudyHours: 30,
      completedInteractiveSessions: 12,
    },
    postStudyReport: {
      lastSessionDate: "Hoje às 09:15",
      sessionType: "Sessão de Debates",
      sessionTopic: "A Crise de 1929 e a Ascensão do Estado de Bem-Estar Social",
      mainDifficulty: "Dificuldade na Sessão de Debates: Mecanismo de transmissão da deflação e o modelo Keynesiano de demanda efetiva",
      identifiedGaps: ["Relação entre desregulamentação bancária e especulação de margem acionária."],
      pedagogicalAction: "Sugerir mapa conceitual conectando o New Deal às políticas monetárias modernas.",
      criticalThinkingLevel: "Em Consolidação",
      argumentCohesion: "Discurso articulado com bom uso de contra-exemplos históricos."
    }
  },
  {
    id: "aluno-kauany",
    name: "Kauany Araujo Amorim",
    turma: CLASS_CODE,
    course: CLASS_COURSE,
    enrollmentId: "2026-INF-0411",
    avatar: "",
    status: "Avançado",
    metrics: {
      debatesLearningGain: "+78% de aprendizado",
      simulationLearningGain: "+73% de aprendizado",
      activitiesProficiency: "+89% de proficiência",
      socraticReasoningScore: "+86% em dialética e oratória",
      activeStudyHours: 41,
      completedInteractiveSessions: 19,
    },
    postStudyReport: {
      lastSessionDate: "Hoje às 13:45",
      sessionType: "Sessão de Debates",
      sessionTopic: "Direitos Humanos e Cidadania Digital na Sociedade da Informação",
      mainDifficulty: "Dificuldade na Sessão de Debates: Conciliação entre soberania de dados nacionais e arquiteturas de nuvem transfronteiriças",
      identifiedGaps: ["Jurisprudência de extraterritorialidade no GDPR e na LGPD."],
      pedagogicalAction: "Propor simulação de tribunal simulado sobre privacidade e consentimento de dados de menores.",
      criticalThinkingLevel: "Excelente",
      argumentCohesion: "Alto rigor conceitual e capacidade dialética notável."
    }
  },
  {
    id: "aluno-laila",
    name: "Laila Victoria Lessa Silva dos Santos",
    turma: CLASS_CODE,
    course: CLASS_COURSE,
    enrollmentId: "2026-INF-0413",
    avatar: "",
    status: "Ativo",
    metrics: {
      debatesLearningGain: "+68% de aprendizado",
      simulationLearningGain: "+70% de aprendizado",
      activitiesProficiency: "+82% de proficiência",
      socraticReasoningScore: "+75% em dialética e oratória",
      activeStudyHours: 34,
      completedInteractiveSessions: 15,
    },
    postStudyReport: {
      lastSessionDate: "Há 1 dia",
      sessionType: "Laboratório de Simulação",
      sessionTopic: "Acessibilidade Web e Inclusão Digital (Diretrizes WCAG 2.2)",
      mainDifficulty: "Dificuldade no Laboratório de Simulação: Implementação de navegação por teclado e foco gerenciado em componentes modais",
      identifiedGaps: ["Aplicação correta dos atributos ARIA Live Regions para leitores de tela."],
      pedagogicalAction: "Disponibilizar checklist de validação de contraste e suporte a tecnologias assistivas.",
      criticalThinkingLevel: "Excelente",
      argumentCohesion: "Empatia no design e defesa sólida de padrões inclusivos."
    }
  },
  {
    id: "aluno-luiz",
    name: "Luiz Henrique Silva Reis",
    turma: CLASS_CODE,
    course: CLASS_COURSE,
    enrollmentId: "2026-INF-0414",
    avatar: "",
    status: "Em Estudo",
    metrics: {
      debatesLearningGain: "+63% de aprendizado",
      simulationLearningGain: "+74% de aprendizado",
      activitiesProficiency: "+80% de proficiência",
      socraticReasoningScore: "+73% em dialética e oratória",
      activeStudyHours: 31,
      completedInteractiveSessions: 12,
    },
    postStudyReport: {
      lastSessionDate: "Há 2 dias",
      sessionType: "Laboratório de Simulação",
      sessionTopic: "Configuração de Rede Local, Roteamento VLAN e Protocolo STP",
      mainDifficulty: "Dificuldade no Laboratório de Simulação: Convergência de pontes raízes em topologias com Rapid Spanning Tree",
      identifiedGaps: ["Prioridade de bridge IDs e estados de bloqueio de portas redundantes."],
      pedagogicalAction: "Exercício guiado no simulador com cálculo manual de custos de enlace.",
      criticalThinkingLevel: "Em Consolidação",
      argumentCohesion: "Bom raciocínio topológico e capacidade de troubleshooting."
    }
  },
  {
    id: "aluno-maria-eduarda-sg",
    name: "Maria Eduarda Sousa Goncalves Silva",
    turma: CLASS_CODE,
    course: CLASS_COURSE,
    enrollmentId: "2026-INF-0415",
    avatar: "",
    status: "Ativo",
    metrics: {
      debatesLearningGain: "+70% de aprendizado",
      simulationLearningGain: "+67% de aprendizado",
      activitiesProficiency: "+85% de proficiência",
      socraticReasoningScore: "+79% em dialética e oratória",
      activeStudyHours: 37,
      completedInteractiveSessions: 16,
    },
    postStudyReport: {
      lastSessionDate: "Hoje às 11:50",
      sessionType: "Sessão de Debates",
      sessionTopic: "Globalização e a Nova Divisão Internacional do Trabalho",
      mainDifficulty: "Dificuldade na Sessão de Debates: Análise da vulnerabilidade de cadeias globais de suprimento de semicondutores",
      identifiedGaps: ["Impacto da concentração geográfica fabril no leste asiático versus políticas de nearshoring."],
      pedagogicalAction: "Propor leitura socrática de artigos sobre soberania tecnológica nacional.",
      criticalThinkingLevel: "Excelente",
      argumentCohesion: "Articulação de conceitos geográficos com conjuntura econômica global."
    }
  },
  {
    id: "aluno-maria-eduarda-ss",
    name: "Maria Eduarda Souza Silva",
    turma: CLASS_CODE,
    course: CLASS_COURSE,
    enrollmentId: "2026-INF-0416",
    avatar: "",
    status: "Em Estudo",
    metrics: {
      debatesLearningGain: "+65% de aprendizado",
      simulationLearningGain: "+66% de aprendizado",
      activitiesProficiency: "+78% de proficiência",
      socraticReasoningScore: "+74% em dialética e oratória",
      activeStudyHours: 29,
      completedInteractiveSessions: 11,
    },
    postStudyReport: {
      lastSessionDate: "Há 1 dia",
      sessionType: "Atividades & Nivelamento",
      sessionTopic: "Genética Mendeliana e Probabilidade em Heredogramas",
      mainDifficulty: "Dificuldade no Nivelamento: Aplicação da regra do produto em cruzamentos de di-hibridismo com segregação independente",
      identifiedGaps: ["Determinação correta do genótipo parental por análise retrospectiva de fenótipos recessivos."],
      pedagogicalAction: "Resolver exercícios visuais com quadros de Punnett passo a passo.",
      criticalThinkingLevel: "Em Consolidação",
      argumentCohesion: "Boa interpretação biológica e evolução contínua no raciocínio quantitativo."
    }
  },
  {
    id: "aluno-miguel",
    name: "Miguel Sales de Jesus",
    turma: CLASS_CODE,
    course: CLASS_COURSE,
    enrollmentId: "2026-INF-0417",
    avatar: "",
    status: "Ativo",
    metrics: {
      debatesLearningGain: "+71% de aprendizado",
      simulationLearningGain: "+76% de aprendizado",
      activitiesProficiency: "+86% de proficiência",
      socraticReasoningScore: "+80% em dialética e oratória",
      activeStudyHours: 39,
      completedInteractiveSessions: 17,
    },
    postStudyReport: {
      lastSessionDate: "Hoje às 16:00",
      sessionType: "Laboratório de Simulação",
      sessionTopic: "Controle PID em Robótica Autônoma e Sensores Ultrassônicos",
      mainDifficulty: "Dificuldade no Laboratório de Simulação: Sintonia da constante derivativa (Kd) para eliminação de sobre-sinais em curvas bruscas",
      identifiedGaps: ["Ajuste manual da resposta transitória antes da saturação dos atuadores."],
      pedagogicalAction: "Oferecer simulação gráfica com curva de erro e resposta ao degrau em tempo real.",
      criticalThinkingLevel: "Excelente",
      argumentCohesion: "Forte base empírica em hardware e lógica computacional."
    }
  },
  {
    id: "aluno-pamela",
    name: "Pamela do Espirito Santo Cruz",
    turma: CLASS_CODE,
    course: CLASS_COURSE,
    enrollmentId: "2026-INF-0418",
    avatar: "",
    status: "Ativo",
    metrics: {
      debatesLearningGain: "+69% de aprendizado",
      simulationLearningGain: "+72% de aprendizado",
      activitiesProficiency: "+84% de proficiência",
      socraticReasoningScore: "+78% em dialética e oratória",
      activeStudyHours: 36,
      completedInteractiveSessions: 15,
    },
    postStudyReport: {
      lastSessionDate: "Hoje às 10:30",
      sessionType: "Sessão de Debates",
      sessionTopic: "Empreendedorismo de Impacto Social vs Maximizações de Lucro Tradicionais",
      mainDifficulty: "Dificuldade na Sessão de Debates: Métrica de Retorno Social sobre o Investimento (SROI) em projetos de favela",
      identifiedGaps: ["Valoração de externalidades positivas e capital social comunitário."],
      pedagogicalAction: "Apresentar casos práticos de cooperativas de catadores e tecnologia social aberta.",
      criticalThinkingLevel: "Excelente",
      argumentCohesion: "Postura propositiva e oratória estruturada com alto senso de cidadania."
    }
  },
  {
    id: "aluno-pedro-henrique",
    name: "Pedro Henrique Costa Conceicao de Santana",
    turma: CLASS_CODE,
    course: CLASS_COURSE,
    enrollmentId: "2026-INF-0419",
    avatar: "",
    status: "Ativo",
    metrics: {
      debatesLearningGain: "+66% de aprendizado",
      simulationLearningGain: "+75% de aprendizado",
      activitiesProficiency: "+83% de proficiência",
      socraticReasoningScore: "+73% em dialética e oratória",
      activeStudyHours: 33,
      completedInteractiveSessions: 13,
    },
    postStudyReport: {
      lastSessionDate: "Há 2 dias",
      sessionType: "Laboratório de Simulação",
      sessionTopic: "Otimização de Consultas SQL com Índices B-Tree",
      mainDifficulty: "Dificuldade no Laboratório de Simulação: Leitura de planos de execução (EXPLAIN ANALYZE) e identificação de Seq Scans",
      identifiedGaps: ["Impacto de funções não sargables sobre colunas indexadas."],
      pedagogicalAction: "Demonstrar reescrita de consultas substituindo LIKE '%termo%' por índices trigram ou full-text search.",
      criticalThinkingLevel: "Em Consolidação",
      argumentCohesion: "Capacidade analítica precisa para depuração de desempenho de queries."
    }
  },
  {
    id: "aluno-pedro-roberto",
    name: "Pedro Roberto Bittencourt Silva Bomfim Santos",
    turma: CLASS_CODE,
    course: CLASS_COURSE,
    enrollmentId: "2026-INF-0420",
    avatar: "",
    status: "Nivelamento Concluído",
    metrics: {
      debatesLearningGain: "+61% de aprendizado",
      simulationLearningGain: "+68% de aprendizado",
      activitiesProficiency: "+81% de proficiência",
      socraticReasoningScore: "+70% em dialética e oratória",
      activeStudyHours: 27,
      completedInteractiveSessions: 10,
    },
    postStudyReport: {
      lastSessionDate: "Há 1 dia",
      sessionType: "Atividades & Nivelamento",
      sessionTopic: "Cinemática e Funções Horárias do MRUV",
      mainDifficulty: "Dificuldade no Nivelamento: Interpretação de concavidade da parábola no gráfico posição x tempo",
      identifiedGaps: ["Diferenciação entre movimento acelerado e retardado conforme os sinais concordantes ou discordantes de v e a."],
      pedagogicalAction: "Realizado nivelamento com analogia do velocímetro e frenagem veicular; lacuna sanada.",
      criticalThinkingLevel: "Em Consolidação",
      argumentCohesion: "Raciocínio dedutivo seguro após o reforço de pré-requisitos."
    }
  },
  {
    id: "aluno-rai",
    name: "Rai Guerra dos Santos",
    turma: CLASS_CODE,
    course: CLASS_COURSE,
    enrollmentId: "2026-INF-0421",
    avatar: "",
    status: "Ativo",
    metrics: {
      debatesLearningGain: "+70% de aprendizado",
      simulationLearningGain: "+77% de aprendizado",
      activitiesProficiency: "+86% de proficiência",
      socraticReasoningScore: "+79% em dialética e oratória",
      activeStudyHours: 35,
      completedInteractiveSessions: 14,
    },
    postStudyReport: {
      lastSessionDate: "Hoje às 15:00",
      sessionType: "Laboratório de Simulação",
      sessionTopic: "Auditoria de Segurança de Aplicações Web (OWASP Top 10)",
      mainDifficulty: "Dificuldade no Laboratório de Simulação: Prevenção de falhas de autenticação em tokens JWT com chave simétrica fraca",
      identifiedGaps: ["Configuração correta de tempos de expiração e chaves assimétricas RS256."],
      pedagogicalAction: "Propor desafio prático de rotação de segredos e uso de cookies HttpOnly com flags SameSite.",
      criticalThinkingLevel: "Excelente",
      argumentCohesion: "Postura preventiva e profundo senso crítico em segurança cibernética."
    }
  },
  {
    id: "aluno-samuel-campos",
    name: "Samuel Campos Fernandes Rodrigues",
    turma: CLASS_CODE,
    course: CLASS_COURSE,
    enrollmentId: "2026-INF-0422",
    avatar: "",
    status: "Em Estudo",
    hasFaceId: false,
    faceIdData: null,
    metrics: {
      debatesLearningGain: "+64% de aprendizado",
      simulationLearningGain: "+69% de aprendizado",
      activitiesProficiency: "+79% de proficiência",
      socraticReasoningScore: "+72% em dialética e oratória",
      activeStudyHours: 30,
      completedInteractiveSessions: 11,
    },
    postStudyReport: {
      lastSessionDate: "Há 1 dia",
      sessionType: "Sessão de Debates",
      sessionTopic: "A Revolução Industrial e a Alienação do Trabalhador segundo Marx",
      mainDifficulty: "Dificuldade na Sessão de Debates: Distinção entre Mais-Valia Absoluta e Mais-Valia Relativa",
      identifiedGaps: ["Efeito da introdução de maquinários sobre a redução do tempo de trabalho necessário."],
      pedagogicalAction: "Revisar exemplos práticos de esteiras de montagem versus automatização robotizada contemporânea.",
      criticalThinkingLevel: "Em Consolidação",
      argumentCohesion: "Boa capacidade reflexiva e sensibilidade a processos históricos de trabalho."
    }
  },
  {
    id: "aluno-samuel-silva",
    name: "Samuel Silva de Jesus Borges",
    turma: CLASS_CODE,
    course: CLASS_COURSE,
    enrollmentId: "2026-INF-0423",
    avatar: "",
    status: "Ativo",
    metrics: {
      debatesLearningGain: "+68% de aprendizado",
      simulationLearningGain: "+74% de aprendizado",
      activitiesProficiency: "+83% de proficiência",
      socraticReasoningScore: "+77% em dialética e oratória",
      activeStudyHours: 32,
      completedInteractiveSessions: 13,
    },
    postStudyReport: {
      lastSessionDate: "Hoje às 11:00",
      sessionType: "Laboratório de Simulação",
      sessionTopic: "Automação com Python e Processamento de Linguagem Natural",
      mainDifficulty: "Dificuldade no Laboratório de Simulação: Regularização L2 em classificadores de texto para evitar overfitting de vocabulário raro",
      identifiedGaps: ["TF-IDF com n-grams e truncamento de matriz de termos esparsa."],
      pedagogicalAction: "Oferecer notebook interativo com visualização da superfície de perda e validação cruzada k-fold.",
      criticalThinkingLevel: "Excelente",
      argumentCohesion: "Foco prático em dados e argumentação técnica consistente."
    }
  },
  {
    id: "aluno-sara",
    name: "Sara Jesus de Souza",
    turma: CLASS_CODE,
    course: CLASS_COURSE,
    enrollmentId: "2026-INF-0424",
    avatar: "",
    status: "Avançado",
    metrics: {
      debatesLearningGain: "+75% de aprendizado",
      simulationLearningGain: "+71% de aprendizado",
      activitiesProficiency: "+88% de proficiência",
      socraticReasoningScore: "+84% em dialética e oratória",
      activeStudyHours: 40,
      completedInteractiveSessions: 18,
    },
    postStudyReport: {
      lastSessionDate: "Hoje às 14:30",
      sessionType: "Sessão de Debates",
      sessionTopic: "A Crise Climática Global e o Princípio da Precaução no Direito Ambiental",
      mainDifficulty: "Dificuldade na Sessão de Debates: Inversão do ônus da prova em casos de dano ambiental incerto",
      identifiedGaps: ["Aplicação do princípio da responsabilidade comum mas diferenciada nos Acordos de Paris."],
      pedagogicalAction: "Incentivar redação de artigo socrático para a feira de ciências da escola.",
      criticalThinkingLevel: "Excelente",
      argumentCohesion: "Oratória segura, empatia discursiva e profundidade de fundamentação."
    }
  },
  {
    id: "aluno-thiego",
    name: "Thiego Romario Oliveira Leite",
    turma: CLASS_CODE,
    course: CLASS_COURSE,
    enrollmentId: "2026-INF-0425",
    avatar: "",
    status: "Ativo",
    metrics: {
      debatesLearningGain: "+67% de aprendizado",
      simulationLearningGain: "+73% de aprendizado",
      activitiesProficiency: "+82% de proficiência",
      socraticReasoningScore: "+75% em dialética e oratória",
      activeStudyHours: 33,
      completedInteractiveSessions: 14,
    },
    postStudyReport: {
      lastSessionDate: "Há 1 dia",
      sessionType: "Laboratório de Simulação",
      sessionTopic: "Desenvolvimento de APIs RESTful com Arquitetura Limpa (Clean Architecture)",
      mainDifficulty: "Dificuldade no Laboratório de Simulação: Desacoplamento da camada de domínio em relação ao ORM e bibliotecas externas",
      identifiedGaps: ["Inversão de dependência através de interfaces de repositório puras."],
      pedagogicalAction: "Demonstrar diagrama de camadas concêntricas e testes unitários com mocks.",
      criticalThinkingLevel: "Em Consolidação",
      argumentCohesion: "Boa disciplina de projeto de software e adesão a boas práticas."
    }
  },
  {
    id: "aluno-wilson",
    name: "Wilson Pimentel Neto",
    turma: CLASS_CODE,
    course: CLASS_COURSE,
    enrollmentId: "2026-INF-0426",
    avatar: "",
    status: "Ativo",
    metrics: {
      debatesLearningGain: "+69% de aprendizado",
      simulationLearningGain: "+76% de aprendizado",
      activitiesProficiency: "+85% de proficiência",
      socraticReasoningScore: "+78% em dialética e oratória",
      activeStudyHours: 35,
      completedInteractiveSessions: 15,
    },
    postStudyReport: {
      lastSessionDate: "Hoje às 15:45",
      sessionType: "Laboratório de Simulação",
      sessionTopic: "Otimização de Renderização no React com Profiler e Memoização",
      mainDifficulty: "Dificuldade no Laboratório de Simulação: Prevenção de renderizações em cascata provocadas por referências instáveis de objetos em hooks",
      identifiedGaps: ["Uso judicioso de useMemo vs refatoração da hierarquia de estado compartilhado."],
      pedagogicalAction: "Desafio prático de redução de tempo de commit em árvore de componentes com mais de 500 nós.",
      criticalThinkingLevel: "Excelente",
      argumentCohesion: "Agilidade técnica e precisão na identificação de gargalos de frontend."
    }
  }
];

// Configuração dos Perfis para Apresentação:
// Conta "Raíssa Teixeira" é a ÚNICA conta com biometria cadastrada/ativa por padrão (hasFaceId: true).
// Demais contas (ex: Samuel Campos) definidas explicitamente sem biometria cadastrada (hasFaceId: false, faceIdData: null).
OFFICIAL_STUDENTS_LIST.forEach((student) => {
  if (student.id === "aluno-raissa") {
    student.hasFaceId = true;
    student.faceIdData = "sha256-bio-raissa-teixeira-enrolled";
  } else {
    student.hasFaceId = false;
    student.faceIdData = null;
  }
});

export function normalizeIdentityText(value: string): string {
  return (value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

/**
 * Localiza um aluno oficial cadastrado na turma INFVES3SB pelo ID, nome completo,
 * primeiro nome exato ou nome atualizado no perfil do próprio aluno (por ID).
 * Retorna null se o aluno não existir (NUNCA faz fallback para outro aluno).
 */
export function findOfficialStudentByName(
  nameInput: string,
  emailInput?: string
): OfficialStudent | null {
  const normInput = normalizeIdentityText(nameInput);
  if (!normInput || normInput.length < 2) return null;

  // 1. Correspondência exata pelo nome oficial completo
  const exactFull = OFFICIAL_STUDENTS_LIST.find(
    (s) => normalizeIdentityText(s.name) === normInput
  );
  if (exactFull) return exactFull;

  // 2. Correspondência por nome customizado salvo especificamente para o ID daquele aluno
  if (typeof window !== "undefined") {
    for (const s of OFFICIAL_STUDENTS_LIST) {
      try {
        const customName = localStorage.getItem(`profeia_user_${s.id}_name`);
        if (customName && normalizeIdentityText(customName) === normInput) {
          return s;
        }
      } catch {}
    }
  }

  // 3. Correspondência por palavras exatas do nome oficial (ex: "Thiego" -> "Thiego Romario Oliveira Leite")
  const inputTokens = normInput.split(" ").filter(Boolean);
  const tokenMatches = OFFICIAL_STUDENTS_LIST.filter((s) => {
    const officialNorm = normalizeIdentityText(s.name);
    const officialTokens = officialNorm.split(" ").filter(Boolean);
    if (inputTokens.length === 1) {
      return officialTokens[0] === inputTokens[0];
    }
    return inputTokens.every((t) => officialTokens.includes(t));
  });

  if (tokenMatches.length === 1) {
    return tokenMatches[0];
  }

  // Desempate por e-mail para alunos com mesmo pré-nome (ex: Pedro, Samuel, Maria Eduarda)
  if (tokenMatches.length > 1 && emailInput) {
    const normEmail = emailInput.trim().toLowerCase();
    const byEmail = tokenMatches.find(
      (s) => getStudentOfficialEmail(s.name).toLowerCase() === normEmail
    );
    if (byEmail) return byEmail;
  }

  return null;
}

export function getStudentOfficialEmail(studentName: string): string {
  const normalized = studentName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .split(/\s+/)
    .join(".");
  return `${normalized}@escola.com`;
}

export interface StudentAttendanceInfo {
  loggedHours: number;
  targetHours: number;
  attendancePercent: number;
  statusLabel: "Assiduidade Excelente" | "Frequência Regular" | "Atenção (Abaixo de 75%)";
  badgeColor: "emerald" | "indigo" | "amber";
}

/**
 * Calcula a Frequência Escolar (Assiduidade %) do aluno da turma INFVES3SB
 * com base nas horas logadas na plataforma em relação à carga horária de referência.
 */
export function calculateStudentAttendance(
  studentOrHours: OfficialStudent | number,
  targetHours = 40
): StudentAttendanceInfo {
  const loggedHours =
    typeof studentOrHours === "number"
      ? studentOrHours
      : studentOrHours.metrics.activeStudyHours;

  const safeTarget = Math.max(10, targetHours);
  const rawPercent = Math.round((loggedHours / safeTarget) * 100);
  const attendancePercent = Math.min(100, Math.max(45, rawPercent));

  if (attendancePercent >= 90) {
    return {
      loggedHours,
      targetHours: safeTarget,
      attendancePercent,
      statusLabel: "Assiduidade Excelente",
      badgeColor: "emerald",
    };
  }

  if (attendancePercent >= 75) {
    return {
      loggedHours,
      targetHours: safeTarget,
      attendancePercent,
      statusLabel: "Frequência Regular",
      badgeColor: "indigo",
    };
  }

  return {
    loggedHours,
    targetHours: safeTarget,
    attendancePercent,
    statusLabel: "Atenção (Abaixo de 75%)",
    badgeColor: "amber",
  };
}

export function getClassAttendanceSummary(
  students: OfficialStudent[] = OFFICIAL_STUDENTS_LIST,
  targetHours = 40
) {
  const records = students.map((st) => ({
    student: st,
    attendance: calculateStudentAttendance(st, targetHours),
  }));

  const totalLoggedHours = records.reduce(
    (sum, r) => sum + r.attendance.loggedHours,
    0
  );
  const averageLoggedHours = Number(
    (totalLoggedHours / Math.max(1, records.length)).toFixed(1)
  );
  const averageAttendancePercent = Math.round(
    records.reduce((sum, r) => sum + r.attendance.attendancePercent, 0) /
      Math.max(1, records.length)
  );
  const excellentCount = records.filter(
    (r) => r.attendance.attendancePercent >= 90
  ).length;
  const regularCount = records.filter(
    (r) =>
      r.attendance.attendancePercent >= 75 &&
      r.attendance.attendancePercent < 90
  ).length;
  const alertCount = records.filter(
    (r) => r.attendance.attendancePercent < 75
  ).length;

  return {
    totalStudents: records.length,
    targetHours,
    totalLoggedHours,
    averageLoggedHours,
    averageAttendancePercent,
    excellentCount,
    regularCount,
    alertCount,
    records,
  };
}

