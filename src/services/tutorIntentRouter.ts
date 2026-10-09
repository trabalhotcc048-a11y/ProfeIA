import { initialDisciplines } from "../data/disciplinesData";

export interface QuestionContextParams {
  question: string;
  selectedSubject?: string;
  selectedSubjectId?: string;
  currentTopic?: string;
  conversationHistory?: Array<{ role: string; content: string }>;
  studentLevel?: string;
  currentDetectedSubject?: string;
  currentDetectedSubjectId?: string;
  currentDetectedTopic?: string;
}

export type TutorIntentType =
  | "explicacao_conceitual"
  | "passo_a_passo"
  | "exemplo_pratico"
  | "exercicio"
  | "duvida_geral"
  | "mudanca_contexto"
  | "clarificacao";

export interface QuestionContextResult {
  detectedSubject: string;
  detectedSubjectId: string;
  detectedTopic: string;
  intent: TutorIntentType;
  confidence: "alta" | "media" | "baixa";
  confidenceScore: number; // 0 to 100
  needsClarification: boolean;
  clarificationPrompt?: string;
  isSubjectSwitch: boolean;
  matchedKeywords: string[];
  pedagogicalSnippet?: string;
}

export interface RelevantEducationalContent {
  subject: string;
  subjectId: string;
  disciplineName: string;
  disciplineId: string;
  topic: string;
  summary: string;
  whiteboard: string;
  whiteboardSnippet: string;
  keyPoints: string[];
  commonMisconceptions?: string[];
  practicalExample?: string;
  suggestedFollowUp?: string;
}

export type EducationalContentResult = RelevantEducationalContent;

/**
 * Normalizes text removing accents, diacritics, and punctuation for strict semantic analysis.
 */
export function normalizeSemanticText(text: string): string {
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Master Discipline Knowledge Definition with Synonyms, Topics, and Priority Weights
 */
export interface DisciplineDomainDef {
  id: string;
  name: string;
  defaultTopic: string;
  priorityKeywords: string[];
  subtopicKeywords: Record<string, string[]>;
}

export const DISCIPLINE_DOMAINS: DisciplineDomainDef[] = [
  {
    id: "lingua-portuguesa-redacao",
    name: "Língua Portuguesa e Redação",
    defaultTopic: "Sintaxe do Período Composto: Orações Coordenadas e Subordinadas",
    priorityKeywords: [
      "redacao", "redação", "dissertacao", "dissertação", "dissertativa", "dissertativo",
      "argumentativa", "argumentativo", "texto dissertativo", "redacao nota 1000",
      "tese", "proposta de intervencao", "proposta de intervenção", "repertorio", "repertório",
      "d1", "d2", "competencia 1", "competencia 2", "competencia 3", "competencia 4", "competencia 5",
      "enem", "coesao", "coesão", "coerencia", "coerência", "conectivo", "conectivos",
      "crase", "concordancia", "concordância", "regencia", "regência", "sintaxe", "figuras de linguagem",
      "oracao coordenada", "oração coordenada", "oracoes coordenadas", "orações coordenadas",
      "oracao subordinada", "oração subordinada", "oracoes subordinadas", "orações subordinadas",
      "oracao", "oração", "oracoes", "orações", "coordenada", "coordenadas", "subordinada", "subordinadas",
      "periodo composto", "período composto", "periodo simples", "período simples",
      "assindetica", "assindética", "sindetica", "sindética", "substantiva", "substantivas",
      "adjetiva", "adjetivas", "adverbial", "adverbiais", "gramatica", "gramática",
      "lingua portuguesa", "língua portuguesa", "portugues", "português", "sujeito", "predicado",
      "transitividade verbal", "objeto direto", "objeto indireto", "complemento nominal",
      "adjunto adnominal", "adjunto adverbial", "aposto", "vocativo", "voz passiva", "voz ativa",
      "pontuacao", "pontuação", "acentuacao", "acentuação"
    ],
    subtopicKeywords: {
      "Sintaxe do Período Composto: Orações Coordenadas e Subordinadas": [
        "oracao coordenada", "oração coordenada", "oracoes coordenadas", "orações coordenadas",
        "oracao subordinada", "oração subordinada", "oracoes subordinadas", "orações subordinadas",
        "coordenada", "coordenadas", "subordinada", "subordinadas", "periodo composto", "período composto",
        "assindetica", "assindética", "sindetica", "sindética", "oracao", "oração", "oracoes", "orações",
        "substantiva", "adjetiva", "adverbial"
      ],
      "Introdução da Redação": ["introducao", "introdução", "fazer introducao", "como inicio", "como começar", "paragrafo introdutorio", "tese inicial"],
      "Desenvolvimento e Argumentação (D1 e D2)": ["desenvolvimento", "d1", "d2", "argumentacao", "argumentação", "repertorio sociocultural", "topico frasal"],
      "Conclusão e Proposta de Intervenção": ["conclusao", "conclusão", "proposta de intervencao", "proposta de intervenção", "agente", "acao", "efeito", "detalhamento"],
      "Gramática, Concordância e Sintaxe": ["crase", "concordancia", "regencia", "sintaxe", "conectivos", "pontuacao", "gramatica", "transitividade"]
    }
  },
  {
    id: "banco-de-dados",
    name: "Banco de Dados",
    defaultTopic: "Modelo Relacional e SQL",
    priorityKeywords: [
      "sql", "select", "insert", "update", "delete", "from", "where", "join", "inner join",
      "left join", "right join", "full join", "cross join", "chave primaria", "chave primária",
      "primary key", "pk", "chave estrangeira", "foreign key", "fk", "sgbd", "mysql",
      "postgresql", "tabela relacional", "banco relacional", "normalizacao", "normalização",
      "1fn", "2fn", "3fn", "der", "mer", "cardinalidade", "group by", "having", "order by"
    ],
    subtopicKeywords: {
      "Chave Primária e Chave Estrangeira": ["chave primaria", "chave primária", "primary key", "pk", "chave estrangeira", "foreign key", "fk"],
      "Consultas SQL e JOINs": ["join", "inner join", "left join", "right join", "select", "from", "where", "group by"],
      "Modelagem e Normalização": ["normalizacao", "normalização", "1fn", "2fn", "3fn", "der", "mer", "cardinalidade"]
    }
  },
  {
    id: "biologia",
    name: "Biologia",
    defaultTopic: "Biologia Celular, Genética e Bioenergética",
    priorityKeywords: [
      "fotossintese", "fotossíntese", "fase clara", "fase fotoquimica", "fase escura", "estroma",
      "tilacoide", "tilacoides", "rubisco", "calvin", "ciclo de calvin", "fotolise", "fotólise da agua",
      "clorofila", "cloroplasto", "cloroplastos", "glicose", "dna", "rna", "genetica",
      "genética", "mutacao", "mutação", "mitose", "meiose", "celula", "célula", "celulas", "células",
      "citologia", "organela", "organelas", "mitocondria", "mitocôndria", "ribossomo", "membrana plasmatica",
      "citoplasma", "nucleo celular", "eucarionte", "procarionte", "ecologia",
      "cadeia alimentar", "teia alimentar", "selecao natural", "evolucao", "metabolismo", "respiracao celular"
    ],
    subtopicKeywords: {
      "Citologia: Estrutura e Função da Célula": [
        "celula", "célula", "celulas", "células", "citologia", "organela", "organelas",
        "membrana plasmatica", "citoplasma", "mitocondria", "mitocôndria", "ribossomo",
        "reticulo endoplasmatico", "complexo de golgi", "lisossomo", "eucarionte", "procarionte",
        "procariontes", "eucariontes", "teoria celular"
      ],
      "Fotossíntese e Bioenergética": [
        "fotossintese", "fotossíntese", "fase clara", "fase fotoquimica", "tilacoide", "estroma", "calvin", "rubisco", "cloroplasto", "clorofila"
      ],
      "Divisão Celular: Mitose e Meiose": [
        "mitose", "meiose", "divisao celular", "divisão celular", "ciclo celular", "cromossomo", "cromossomos"
      ],
      "Genética e Ácidos Nucleicos": [
        "dna", "rna", "genetica", "genética", "mutacao", "transcricao", "traducao", "genes", "hereditariedade", "mendel"
      ],
      "Ecologia e Cadeias Tróficas": [
        "ecologia", "cadeia alimentar", "consumidores", "decompositores", "bioma", "ecossistema", "teia alimentar"
      ]
    }
  },
  {
    id: "matematica",
    name: "Matemática",
    defaultTopic: "Equações do 2º Grau e Bhaskara",
    priorityKeywords: [
      "bhaskara", "baskara", "delta", "equacao do segundo grau", "equação do segundo grau",
      "equacao do 2 grau", "equação do 2º grau", "equacao quadratica", "equação quadrática",
      "parabola", "parábola", "vertice", "vértice da parabola", "girard", "raizes reais",
      "funcao afim", "função de 1 grau", "trigonometria", "seno", "cosseno", "tangente",
      "probabilidade", "estatistica", "geometria plana", "teorema de pitagoras", "logaritmo",
      "matriz", "determinante"
    ],
    subtopicKeywords: {
      "Equações do 2º Grau": ["bhaskara", "baskara", "delta", "equacao do segundo grau", "equacao do 2 grau", "equacao quadratica"],
      "Funções Afim e Quadrática": ["funcao quadratica", "parabola", "vertice", "funcao afim", "grafico"],
      "Trigonometria": ["trigonometria", "seno", "cosseno", "tangente", "triangulo retangulo"]
    }
  },
  {
    id: "fisica",
    name: "Física",
    defaultTopic: "Leis de Newton e Dinâmica",
    priorityKeywords: [
      "newton", "leis de newton", "inercia", "inércia", "acao e reacao", "ação e reação",
      "forca resultante", "força resultante", "f=ma", "dinamica", "dinâmica", "cinematica",
      "cinemática", "velocidade media", "aceleracao", "aceleração", "gravidade", "mru",
      "mruv", "atrito", "trabalho e energia", "energia cinetica", "energia potencial",
      "termodinamica", "termodinâmica", "calorimetria", "optica", "óptica", "eletrodinamica",
      "circuito eletrico", "lei de ohm"
    ],
    subtopicKeywords: {
      "Leis de Newton": ["newton", "inercia", "acao e reacao", "forca resultante", "f=ma", "dinamica"],
      "Cinemática": ["cinematica", "velocidade media", "aceleracao", "mru", "mruv", "queda livre"],
      "Termodinâmica e Eletricidade": ["termodinamica", "calor", "lei de ohm", "resistor", "circuito"]
    }
  },
  {
    id: "desenvolvimento-web",
    name: "Desenvolvimento Web",
    defaultTopic: "JavaScript Moderno e APIs",
    priorityKeywords: [
      "javascript", "js", "html", "html5", "css", "css3", "react", "frontend", "backend",
      "dom", "fetch", "api", "rest", "async", "await", "promise", "promises", "typescript",
      "componente", "node", "npm", "json", "flexbox", "css grid", "evento click", "state"
    ],
    subtopicKeywords: {
      "JavaScript Moderno": ["javascript", "js", "async", "await", "promise", "fetch", "dom", "arrow function"],
      "Frontend React": ["react", "componente", "state", "props", "hook"],
      "HTML5 e CSS3": ["html", "css", "flexbox", "grid", "layout responsivo"]
    }
  },
  {
    id: "analise-projeto-sistemas",
    name: "Análise e Projeto de Sistemas",
    defaultTopic: "Requisitos de Software e UML",
    priorityKeywords: [
      "requisito", "requisitos", "rf", "rnf", "requisito funcional", "requisito nao funcional",
      "uml", "diagrama de classes", "caso de uso", "diagrama de sequencia", "scrum", "sprint",
      "agil", "ágil", "kanban", "historia de usuario", "arquitetura de software", "solid", "design pattern"
    ],
    subtopicKeywords: {
      "Engenharia de Requisitos": ["requisito", "funcional", "nao funcional", "rf", "rnf", "historia de usuario"],
      "Diagramas UML": ["uml", "diagrama de classes", "caso de uso", "diagrama de sequencia"],
      "Metodologias Ágeis": ["scrum", "sprint", "kanban", "agil"]
    }
  },
  {
    id: "materia-pratica-estagio-tcc",
    name: "Matéria Prática de Estágio e TCC",
    defaultTopic: "Estruturação Rigorosa do TCC",
    priorityKeywords: [
      "tcc", "trabalho de conclusao", "trabalho de conclusão", "abnt", "normas abnt", "banca", "banca examinadora",
      "problema de pesquisa", "metodologia cientifica", "metodologia científica", "justificativa", "estagio", "estágio",
      "relatorio de estagio", "relatório de estágio", "portfolio", "artigo cientifico", "monografia", "nbr 14724", "nbr 6023"
    ],
    subtopicKeywords: {
      "TCC e Normas ABNT": ["tcc", "abnt", "banca", "problema de pesquisa", "metodologia", "monografia"],
      "Estágio e Portfólio": ["estagio", "relatorio", "portfolio", "postura profissional"]
    }
  },
  {
    id: "historia",
    name: "História",
    defaultTopic: "Revolução Francesa e Era Contemporânea",
    priorityKeywords: [
      "revolucao francesa", "revolução francesa", "queda da bastilha", "bastilha", "jacobinos", "girondinos",
      "robespierre", "antigo regime", "era napoleonica", "napoleao", "estados gerais", "iluminismo",
      "ditadura", "ditadura militar", "regime militar", "ai 5", "ai-5", "diretas ja",
      "redemocratizacao", "redemocratização", "constituicao 1988", "era vargas",
      "republica velha", "revolucao industrial", "guerra fria", "brasil colonia", "brasil imperio",
      "idade media", "feudalismo", "grecia antiga", "roma antiga", "segunda guerra", "primeira guerra", "escravidao"
    ],
    subtopicKeywords: {
      "Revolução Francesa (1789)": ["revolucao francesa", "revolução francesa", "bastilha", "jacobinos", "girondinos", "antigo regime", "napoleao", "robespierre"],
      "Regime Militar e Redemocratização": ["ditadura", "regime militar", "ai 5", "diretas ja", "redemocratizacao"],
      "Era Vargas e República": ["era vargas", "republica velha", "tenentismo", "industrializacao"]
    }
  },
  {
    id: "sociologia",
    name: "Sociologia",
    defaultTopic: "Durkheim, Marx e Weber",
    priorityKeywords: [
      "durkheim", "marx", "weber", "fato social", "luta de classes", "acao social",
      "mais valia", "alienacao", "estratificacao", "cidadania", "movimentos sociais", "bourdieu", "foucault", "bauman"
    ],
    subtopicKeywords: {
      "Três Matrizes Sociológicas": ["durkheim", "marx", "weber", "fato social", "luta de classes", "acao social"],
      "Cidadania e Desigualdade": ["cidadania", "estratificacao", "alienacao", "mais valia"]
    }
  },
  {
    id: "geografia",
    name: "Geografia",
    defaultTopic: "Globalização e Divisão Internacional do Trabalho",
    priorityKeywords: [
      "globalizacao", "globalização", "geopolitica", "geopolítica", "dit", "divisao internacional do trabalho",
      "urbanizacao", "climatologia", "bacia hidrografica", "migracao", "biomas brasileiros", "relevo", "placas tectonicas"
    ],
    subtopicKeywords: {
      "Globalização e Geopolítica": ["globalizacao", "geopolitica", "dit", "divisao internacional"],
      "Geografia Física e Ambiental": ["clima", "relevo", "bioma", "bacia hidrografica"]
    }
  },
  {
    id: "robotica",
    name: "Robótica",
    defaultTopic: "Microcontroladores Arduino e Sensores",
    priorityKeywords: [
      "arduino", "sensor", "ultrassonico", "microcontrolador", "atuador", "pwm",
      "protoboard", "servo motor", "analogread", "digitalwrite", "circuito", "automacao", "ponte h", "motor dc"
    ],
    subtopicKeywords: {
      "Arduino e Sensores": ["arduino", "sensor", "microcontrolador", "ultrassonico", "pwm"]
    }
  },
  {
    id: "design-de-interface",
    name: "Design de Interface",
    defaultTopic: "Hierarquia Visual, UX e UI",
    priorityKeywords: [
      "ui", "ux", "interface", "figma", "wireframe", "prototipo", "nielsen", "heuristicas",
      "acessibilidade", "wcag", "contraste", "design system", "tipografia", "usabilidade"
    ],
    subtopicKeywords: {
      "Fundamentos de UI/UX": ["ui", "ux", "figma", "wireframe", "heuristicas", "nielsen"]
    }
  },
  {
    id: "empreendedorismo-social",
    name: "Projeto de Empreendedorismo Social e Economia Solidária",
    defaultTopic: "Social Business Model Canvas",
    priorityKeywords: [
      "empreendedorismo social", "impacto social", "economia solidaria", "cooperativa",
      "canvas social", "social business canvas", "moeda social", "sustentabilidade", "paul singer"
    ],
    subtopicKeywords: {
      "Negócios Sociais": ["empreendedorismo social", "impacto social", "canvas social", "cooperativa"]
    }
  },
  {
    id: "lingua-inglesa",
    name: "Língua Inglesa",
    defaultTopic: "Verb Tenses, Reading Strategies and Phrasal Verbs",
    priorityKeywords: [
      "ingles", "inglês", "english", "verb to be", "simple present", "present continuous",
      "simple past", "past continuous", "present perfect", "past perfect", "modal verbs",
      "phrasal verbs", "false friends", "falsos cognatos", "skimming", "scanning", "linking words",
      "passive voice", "conditionals", "if clauses", "reading strategies"
    ],
    subtopicKeywords: {
      "Verb Tenses & Grammar": ["verb to be", "simple present", "present continuous", "simple past", "present perfect", "modal verbs"],
      "Reading Strategies & Vocabulary": ["skimming", "scanning", "false friends", "falsos cognatos", "linking words", "phrasal verbs"]
    }
  },
  {
    id: "quimica",
    name: "Química",
    defaultTopic: "Reações Químicas e Transformações da Matéria",
    priorityKeywords: [
      "quimica", "química", "reacoes quimicas", "reações químicas", "reacao quimica", "reação química",
      "tabela periodica", "tabela periódica", "estequiometria", "atomistica", "atomística",
      "ligacao quimica", "ligação química", "ligacoes quimicas", "ligações químicas",
      "ligacao covalente", "ligação iônica", "ligacao ionica", "ligacao metalica", "ligação metálica",
      "acidos e bases", "ácidos e bases", "acidos", "ácidos", "bases", "sais", "oxidos", "óxidos",
      "termoquimica", "termoquímica", "cinetica quimica", "cinética química", "equilibrio quimico", "equilíbrio químico",
      "eletroquimica", "eletroquímica", "pilhas", "eletrólise", "eletrolise",
      "quimica organica", "química orgânica", "hidrocarbonetos", "funcoes organicas", "funções orgânicas",
      "ph", "poh", "mols", "massa molar", "massa atomica", "solucoes", "soluções", "concentracao", "concentração",
      "entalpia", "le chatelier", "leis ponderais", "lavoisier", "proust", "oxirreducao", "oxirredução",
      "balanceamento", "reagentes", "produtos", "substancias", "misturas", "modelos atomicos"
    ],
    subtopicKeywords: {
      "Reações Químicas e Transformações da Matéria": [
        "reacoes quimicas", "reações químicas", "reacao quimica", "reação química",
        "balanceamento", "reagentes", "produtos", "oxirreducao", "oxirredução", "precipitacao", "combustao",
        "leis ponderais", "lavoisier", "proust"
      ],
      "Tabela Periódica e Ligações Químicas": [
        "tabela periodica", "tabela periódica", "ligacao quimica", "ligações químicas",
        "ligacao covalente", "ligacao ionica", "eletronegatividade", "raio atomico", "familias da tabela"
      ],
      "Estequiometria e Cálculos Químicos": [
        "estequiometria", "numero de mols", "massa molar", "rendimento", "reagente limitante", "avogadro"
      ],
      "Ácidos, Bases e Funções Inorgânicas": [
        "acidos", "ácidos", "bases", "sais", "oxidos", "ph", "poh", "arrhenius", "neutralizacao"
      ],
      "Termoquímica e Cinética Química": [
        "termoquimica", "cinetica quimica", "entalpia", "energia de ativacao", "catalisador", "le chatelier", "endotermica", "exotermica"
      ],
      "Química Orgânica e Hidrocarbonetos": [
        "quimica organica", "hidrocarbonetos", "funcoes organicas", "alcool", "cetona", "aldeido", "isomeria", "cadeias carbonicas"
      ]
    }
  },
  {
    id: "filosofia",
    name: "Filosofia",
    defaultTopic: "Ética, Epistemologia e Filosofia Política",
    priorityKeywords: [
      "filosofia", "filosófica", "filosofo", "filósofo", "ética", "etica", "moral", "epistemologia",
      "platao", "platão", "aristoteles", "aristóteles", "socrates", "sócrates", "descartes", "kant",
      "nietzsche", "mito da caverna", "imperativo categorico", "racionalismo", "empirismo",
      "contratualismo", "hobbes", "locke", "rousseau", "maquiavel"
    ],
    subtopicKeywords: {
      "Ética e Filosofia Política": ["etica", "moral", "politica", "contratualismo", "maquiavel", "kant"],
      "Epistemologia e Teoria do Conhecimento": ["epistemologia", "descartes", "platao", "mito da caverna", "empirismo", "racionalismo"]
    }
  }
];

/**
 * Follow-up indicators for conversational continuity
 */
const FOLLOW_UP_PATTERNS = [
  "e como", "como faco", "como faço", "como construir", "como estruturar",
  "me de um exemplo", "me dê um exemplo", "me da um exemplo", "me dá um exemplo",
  "outro exemplo", "mais um exemplo", "e a introducao", "e a introdução",
  "e o desenvolvimento", "e a conclusao", "e a conclusão", "e o d1", "e o d2",
  "continue", "pode explicar melhor", "nao entendi", "não entendi", "me explica mais",
  "e depois", "e agora", "qual a diferenca", "qual a diferença", "e no caso",
  "como funciona isso", "e como fica", "e qual a formula", "e qual a fórmula"
];

/**
 * Intent Router Engine:
 * Implements strict hierarchy:
 * 1. Current student question (Priority 1)
 * 2. Recent conversation context / continuity (Priority 2)
 * 3. Active topic (Priority 3)
 * 4. Selected subject (Priority 4 - absolute fallback only)
 */
export function detectQuestionContext(params: QuestionContextParams): QuestionContextResult {
  const {
    question,
    selectedSubject,
    selectedSubjectId,
    currentTopic,
    conversationHistory = [],
    currentDetectedSubject,
    currentDetectedSubjectId,
    currentDetectedTopic,
  } = params;

  const normQuery = normalizeSemanticText(question);

  // 0. Determine Question Intent Type
  let intent: TutorIntentType = "explicacao_conceitual";
  if (
    normQuery.includes("exemplo") ||
    normQuery.includes("mostre um exemplo") ||
    normQuery.includes("na pratica")
  ) {
    intent = "exemplo_pratico";
  } else if (
    normQuery.includes("passo a passo") ||
    normQuery.includes("como faco") ||
    normQuery.includes("como faco") ||
    normQuery.includes("como resolvo") ||
    normQuery.includes("como construir")
  ) {
    intent = "passo_a_passo";
  } else if (
    normQuery.includes("exercicio") ||
    normQuery.includes("questao") ||
    normQuery.includes("praticar")
  ) {
    intent = "exercicio";
  } else if (
    normQuery.includes("agora me explica") ||
    normQuery.includes("mudando de assunto") ||
    normQuery.includes("outra materia")
  ) {
    intent = "mudanca_contexto";
  }

  // Check if current query is an explicit follow-up question
  const isFollowUp = FOLLOW_UP_PATTERNS.some((p) => normQuery.includes(normalizeSemanticText(p)));

  // -------------------------------------------------------------
  // PRIORITY 1: Check Current Question against all 14 Disciplines
  // -------------------------------------------------------------
  let bestDiscipline: DisciplineDomainDef | null = null;
  let highestScore = 0;
  let bestDetectedSubtopic = "";
  const matchedKeywords: string[] = [];

  for (const domain of DISCIPLINE_DOMAINS) {
    let score = 0;
    let domainSubtopic = "";
    let domainSubtopicScore = 0;

    // Check full discipline name
    const normDomainName = normalizeSemanticText(domain.name);
    if (normQuery.includes(normDomainName)) {
      score += 100;
      matchedKeywords.push(domain.name);
    }

    // Check priority keywords with word boundaries
    for (const kw of domain.priorityKeywords) {
      const normKw = normalizeSemanticText(kw);
      const regex = new RegExp(`\\b${normKw}\\b`, "i");
      if (regex.test(normQuery)) {
        const wordCount = normKw.split(" ").length;
        const kwWeight = wordCount >= 3 ? 75 : wordCount === 2 ? 55 : 35;
        score += kwWeight;
        matchedKeywords.push(kw);
      }
    }

    // Check specific subtopics with word boundaries
    for (const [subtopicName, subKeywords] of Object.entries(domain.subtopicKeywords)) {
      for (const subKw of subKeywords) {
        const normSubKw = normalizeSemanticText(subKw);
        const regex = new RegExp(`\\b${normSubKw}\\b`, "i");
        if (regex.test(normQuery)) {
          const subWeight = 45;
          score += subWeight;
          if (subWeight > domainSubtopicScore) {
            domainSubtopicScore = subWeight;
            domainSubtopic = subtopicName;
          }
          matchedKeywords.push(subKw);
        }
      }
    }

    // Check against all 50 curriculum topics of this discipline in initialDisciplines
    const discObj = initialDisciplines.find((d) => d.id === domain.id);
    if (discObj) {
      for (const mod of discObj.modules) {
        for (const content of mod.contents) {
          const normTitle = normalizeSemanticText(content.title);
          if (normQuery.includes(normTitle)) {
            score += 80;
            domainSubtopic = content.title;
            domainSubtopicScore = 80;
            matchedKeywords.push(content.title);
          } else {
            const titleWords = normTitle.split(" ").filter((w) => w.length > 4);
            let matchedWords = 0;
            for (const tw of titleWords) {
              if (new RegExp(`\\b${tw}\\b`, "i").test(normQuery)) {
                matchedWords++;
              }
            }
            if (matchedWords >= 2) {
              const wScore = matchedWords * 25;
              score += wScore;
              if (wScore > domainSubtopicScore) {
                domainSubtopicScore = wScore;
                domainSubtopic = content.title;
              }
            }
          }
        }
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestDiscipline = domain;
      bestDetectedSubtopic = domainSubtopic;
    }
  }

  // If Priority 1 found a match (score >= 20), it takes immediate precedence over everything!
  if (bestDiscipline && highestScore >= 20) {
    // Se a pergunta menciona um conceito específico que não caiu em subtopicKeywords predefinido,
    // preserva o conceito perguntado em vez de forçar o defaultTopic genérico
    let finalTopic = bestDetectedSubtopic;
    if (!finalTopic) {
      const specificConceptMatch = question
        .trim()
        .match(/(?:o que [eé]|explique[^:]*|como funciona|fale sobre|defina|conceito de)\s+(?:uma?\s+|o\s+|a\s+|os\s+|as\s+)?([^?.!]+)/i);
      if (specificConceptMatch && specificConceptMatch[1]) {
        const extracted = specificConceptMatch[1].trim();
        if (extracted.length >= 3 && extracted.length <= 60) {
          finalTopic = extracted.charAt(0).toUpperCase() + extracted.slice(1);
        }
      }
    }
    if (!finalTopic) {
      finalTopic = bestDiscipline.defaultTopic;
    }

    const isSubjectSwitch = Boolean(
      (selectedSubject && !selectedSubject.toLowerCase().includes(bestDiscipline.name.toLowerCase())) ||
      (currentDetectedSubjectId && currentDetectedSubjectId !== bestDiscipline.id)
    );

    return {
      detectedSubject: bestDiscipline.name,
      detectedSubjectId: bestDiscipline.id,
      detectedTopic: finalTopic,
      intent,
      confidence: highestScore >= 50 ? "alta" : "media",
      confidenceScore: Math.min(100, Math.round(highestScore * 1.4)),
      needsClarification: false,
      isSubjectSwitch,
      matchedKeywords,
    };
  }

  // ----------------------------------------------------------------------
  // PRIORITY 2: Conversation Context (for follow-ups and conversational continuity)
  // ----------------------------------------------------------------------
  // If the query is a follow-up ("como faço a introdução?", "me dá um exemplo", "e depois?")
  // OR previous turn established a subject:
  if (isFollowUp || (conversationHistory && conversationHistory.length > 0)) {
    // 2a. First, check if caller provided active detected subject in session
    if (currentDetectedSubjectId) {
      const activeDomain = DISCIPLINE_DOMAINS.find((d) => d.id === currentDetectedSubjectId);
      if (activeDomain) {
        // Refine subtopic if query mentions subtopic parts (e.g. "introducao" in Redação)
        let refinedTopic = currentDetectedTopic || activeDomain.defaultTopic;
        for (const [subName, subKws] of Object.entries(activeDomain.subtopicKeywords)) {
          if (subKws.some((k) => normQuery.includes(normalizeSemanticText(k)))) {
            refinedTopic = subName;
            break;
          }
        }
        return {
          detectedSubject: activeDomain.name,
          detectedSubjectId: activeDomain.id,
          detectedTopic: refinedTopic,
          intent,
          confidence: "alta",
          confidenceScore: 88,
          needsClarification: false,
          isSubjectSwitch: false,
          matchedKeywords: ["contexto-conversa-ativo"],
        };
      }
    }

    // 2b. Scan recent user messages (excluding system greeting) to preserve subject
    for (let i = conversationHistory.length - 1; i >= 0; i--) {
      const turn = conversationHistory[i];
      if (turn.role === "user") {
        const normPrev = normalizeSemanticText(turn.content);
        for (const domain of DISCIPLINE_DOMAINS) {
          if (
            domain.priorityKeywords.some((k) => normPrev.includes(normalizeSemanticText(k))) ||
            normPrev.includes(normalizeSemanticText(domain.name))
          ) {
            let refinedTopic = domain.defaultTopic;
            for (const [subName, subKws] of Object.entries(domain.subtopicKeywords)) {
              if (subKws.some((k) => normQuery.includes(normalizeSemanticText(k)))) {
                refinedTopic = subName;
                break;
              }
            }
            return {
              detectedSubject: domain.name,
              detectedSubjectId: domain.id,
              detectedTopic: refinedTopic,
              intent,
              confidence: "alta",
              confidenceScore: 85,
              needsClarification: false,
              isSubjectSwitch: false,
              matchedKeywords: ["historico-conversa"],
            };
          }
        }
      }
    }
  }

  // -------------------------------------------------------------
  // PRIORITY 3: Check Current Topic in Session
  // -------------------------------------------------------------
  if (currentTopic) {
    const normTopic = normalizeSemanticText(currentTopic);
    for (const domain of DISCIPLINE_DOMAINS) {
      if (
        normTopic.includes(normalizeSemanticText(domain.defaultTopic)) ||
        domain.priorityKeywords.some((k) => normTopic.includes(normalizeSemanticText(k)))
      ) {
        return {
          detectedSubject: domain.name,
          detectedSubjectId: domain.id,
          detectedTopic: currentTopic,
          intent,
          confidence: "media",
          confidenceScore: 60,
          needsClarification: false,
          isSubjectSwitch: false,
          matchedKeywords: ["topico-sessao"],
        };
      }
    }
  }

  // -------------------------------------------------------------
  // PRIORITY 4: Selected Subject (ABSOLUTE LAST RESORT FALLBACK)
  // -------------------------------------------------------------
  // Only used if the query had zero discipline markers and no conversational context
  const selectedDomain =
    DISCIPLINE_DOMAINS.find(
      (d) =>
        d.id === selectedSubjectId ||
        (selectedSubject && d.name.toLowerCase().includes(selectedSubject.toLowerCase()))
    ) || DISCIPLINE_DOMAINS[0];

  return {
    detectedSubject: selectedDomain.name,
    detectedSubjectId: selectedDomain.id,
    detectedTopic: currentTopic || selectedDomain.defaultTopic,
    intent,
    confidence: "baixa",
    confidenceScore: 35,
    needsClarification: normQuery.length < 5,
    clarificationPrompt:
      normQuery.length < 5
        ? `Você gostaria de explorar ${selectedDomain.name} ou prefere tirar uma dúvida sobre outra disciplina?`
        : undefined,
    isSubjectSwitch: false,
    matchedKeywords: [],
  };
}

/**
 * Educational Library Query Engine:
 * Searches disciplinesData and pre-compiled pedagogical material for precise answers
 */
export function findRelevantEducationalContent(params: {
  subjectId?: string;
  disciplineId?: string;
  disciplineName?: string;
  topic?: string;
  query?: string;
}): RelevantEducationalContent {
  const subjectId = params.subjectId || params.disciplineId || "lingua-portuguesa-redacao";
  const { topic, query = "" } = params;
  const norm = normalizeSemanticText(query || topic || "");

  // 1A. Língua Portuguesa: Sintaxe do Período Composto (Orações Coordenadas e Subordinadas)
  if (
    norm.includes("oracao") ||
    norm.includes("oracoes") ||
    norm.includes("coordenada") ||
    norm.includes("coordenadas") ||
    norm.includes("subordinada") ||
    norm.includes("subordinadas") ||
    norm.includes("periodo composto") ||
    norm.includes("sintaxe") ||
    norm.includes("assindetica") ||
    norm.includes("sindetica")
  ) {
    const wb = `=== SINTAXE DO PERÍODO COMPOSTO: COORDENAÇÃO E SUBORDINAÇÃO ===
1. ORAÇÕES COORDENADAS (Sintaticamente Independentes):
   - Assindéticas: unidas por vírgula, sem conjunção ("Chegou, viu, venceu").
   - Sindéticas: introduzidas por conjunções coordenativas:
     • Aditivas: e, nem, mas também ("Estuda e trabalha");
     • Adversativas: mas, porém, contudo, todavia ("Tentou, mas não conseguiu");
     • Alternativas: ou... ou, ora... ora ("Ou estuda, ou trabalha");
     • Conclusivas: portanto, logo, por isso ("Estudou, portanto foi aprovado");
     • Explicativas: pois (antes do verbo), que, porque ("Venha, pois chove").

2. ORAÇÕES SUBORDINADAS (Relação de Dependência Sintática):
   - Substantivas: exercem função de termo da oração principal (Subjetiva, Objetiva Direta, Objetiva Indireta, Completiva Nominal, Predicativa, Apositiva).
   - Adjetivas: exercem função de adjunto adnominal (introduzidas por 'que/cujo'):
     • Explicativas: entre vírgulas ("O ser humano, que pensa, erra");
     • Restritivas: sem vírgulas ("Os alunos que estudaram passaram").
   - Adverbiais: exercem função de adjunto adverbial (Causal, Consecutiva, Concessiva, Condicional, Comparativa, Conformativa, Temporal, Proporcional, Final).`;

    return {
      subject: "Língua Portuguesa e Redação",
      subjectId: "lingua-portuguesa-redacao",
      disciplineName: "Língua Portuguesa e Redação",
      disciplineId: "lingua-portuguesa-redacao",
      topic: "Sintaxe do Período Composto: Orações Coordenadas e Subordinadas",
      summary:
        "No período composto da Língua Portuguesa, as orações coordenadas mantêm independência sintática entre si (dividindo-se em assindéticas e sindéticas aditivas, adversativas, alternativas, conclusivas e explicativas), enquanto as orações subordinadas exercem função sintática indispensável em relação à oração principal (classificando-se em substantivas, adjetivas explicativas/restritivas e adverbiais).",
      whiteboard: wb,
      whiteboardSnippet: wb,
      keyPoints: [
        "Orações coordenadas não desempenham função sintática dentro da vizinha; orações subordinadas dependem da principal.",
        "Orações adjetivas explicativas vêm obrigatoriamente entre vírgulas; restritivas nunca levam vírgula.",
        "A conjunção 'e' pode assumir valor adversativo dependendo da construção ('Estudou muito, e não passou')."
      ],
      practicalExample:
        "'Estudou muito (coordenada assindética), mas não descansou (coordenada sindética adversativa)' vs 'Espero (oração principal) que você compreenda (subordinada substantiva objetiva direta)'."
    };
  }

  // 1B. Língua Portuguesa e Redação (somente quando a pergunta/tópico realmente aborda Redação)
  if (
    norm.includes("redacao") ||
    norm.includes("dissertacao") ||
    norm.includes("dissertativo") ||
    norm.includes("introducao") ||
    norm.includes("tese") ||
    norm.includes("proposta de intervencao") ||
    (subjectId === "lingua-portuguesa-redacao" && !query)
  ) {
    if (norm.includes("introducao") || norm.includes("como faco") || norm.includes("comecar")) {
      const wb = `=== INTRODUÇÃO NOTA 1000: TRIPÉ ESTRUTURAL ===
1. CONTEXTUALIZAÇÃO (Linhas 1 a 3):
   - Alusão histórica, filosófica, literária ou midiática legítima.
   - Exemplo: "Na obra 'Cidadãos de Papel', Gilberto Dimenstein..."

2. PROBLEMATIZAÇÃO (Linhas 4 e 5):
   - Conector adversativo/analógico conectando a alusão ao tema real.
   - Exemplo: "De maneira análoga, no Brasil atual, o acesso a..."

3. TESE COM D1 E D2 (Linhas 6 a 8):
   - D1: Causa estrutural 1 (será o foco do Desenvolvimento 1).
   - D2: Causa estrutural 2 (será o foco do Desenvolvimento 2).`;
      return {
        subject: "Língua Portuguesa e Redação",
        subjectId: "lingua-portuguesa-redacao",
        disciplineName: "Língua Portuguesa e Redação",
        disciplineId: "lingua-portuguesa-redacao",
        topic: "Introdução da Redação Dissertativo-Argumentativa",
        summary:
          "A introdução da redação do ENEM e vestibulares deve ter entre 6 e 8 linhas e 3 movimentos: 1) Contextualização (repertório histórico/literário/filosófico); 2) Problematização do tema exato; 3) Tese com 2 argumentos declarados (D1 e D2).",
        whiteboard: wb,
        whiteboardSnippet: wb,
        keyPoints: [
          "Apresentar a tese com clareza antes de terminar o parágrafo introdutório.",
          "Evitar clichês como 'desde os primórdios da humanidade'.",
          "Garantir que D1 e D2 antecipem exatamente o que será discutido nos desenvolvimentos."
        ],
        practicalExample:
          "Tema: Democratização do cinema. Alusão: Dimenstein (Cidadãos de Papel). Tese: O problema persiste pela omissão governamental (D1) e pela concentração geográfica das salas nas capitais (D2)."
      };
    }

    const wb = `=== ESTRUTURA GERAL DA REDAÇÃO (4 PARÁGRAFOS) ===
[§1 INTRODUÇÃO]: Contextualização + Tema + Tese (D1 e D2).
[§2 DESENVOLVIMENTO 1]: Tópico Frasal D1 + Repertório Legitimado + Argumento Crítico + Desfecho.
[§3 DESENVOLVIMENTO 2]: Tópico Frasal D2 + Repertório Legitimado + Argumento Crítico + Desfecho.
[§4 CONCLUSÃO]: Retomada da Tese + Proposta de Intervenção Completa (Agente, Ação, Meio/Modo, Efeito e Detalhamento).`;
    return {
      subject: "Língua Portuguesa e Redação",
      subjectId: "lingua-portuguesa-redacao",
      disciplineName: "Língua Portuguesa e Redação",
      disciplineId: "lingua-portuguesa-redacao",
      topic: "Estrutura da Redação Dissertativo-Argumentativa",
      summary:
        "A dissertação é dividida em 4 parágrafos rígidos: 1 Introdução (contextualização + tese D1/D2), 2 Desenvolvimentos (tópico frasal + repertório + argumentação crítica + fechamento) e 1 Conclusão com a proposta de intervenção de 5 elementos.",
      whiteboard: wb,
      whiteboardSnippet: wb,
      keyPoints: [
        "Texto dissertativo exige defesa de ponto de vista, não apenas exposição de fatos.",
        "Proposta de intervenção precisa de todos os 5 elementos para nota 200 na Competência 5.",
        "Uso de operadores argumentativos interparágrafos (Ademais, Outrossim, Portanto)."
      ]
    };
  }

  // 2. Banco de Dados / SQL / Chaves
  if (
    norm.includes("chave primaria") ||
    norm.includes("primary key") ||
    norm.includes("chave estrangeira") ||
    norm.includes("join") ||
    norm.includes("sql") ||
    (subjectId === "banco-de-dados" && !query)
  ) {
    if (norm.includes("chave primaria") || norm.includes("primary key") || norm.includes("pk") || norm.includes("chave estrangeira") || !query) {
      const wb = `=== MODELO RELACIONAL: CHAVES PRIMÁRIAS E ESTRANGEIRAS ===
1. CHAVE PRIMÁRIA (PRIMARY KEY - PK):
   - Garante a integridade de entidade (cada linha é única).
   - Não aceita valores nulos (NOT NULL) nem duplicados (UNIQUE).
   - Exemplo:
     CREATE TABLE Alunos (
       id INT PRIMARY KEY,
       nome VARCHAR(100) NOT NULL
     );

2. CHAVE ESTRANGEIRA (FOREIGN KEY - FK):
   - Garante a integridade referencial entre duas tabelas.
   - Aponta diretamente para a PK de outra tabela.
   - Exemplo:
     CREATE TABLE Matriculas (
       id INT PRIMARY KEY,
       aluno_id INT,
       FOREIGN KEY (aluno_id) REFERENCES Alunos(id)
     );`;
      return {
        subject: "Banco de Dados",
        subjectId: "banco-de-dados",
        disciplineName: "Banco de Dados",
        disciplineId: "banco-de-dados",
        topic: "Chave Primária e Chave Estrangeira",
        summary:
          "Uma Chave Primária (Primary Key - PK) é o atributo identificador exclusivo e obrigatório (NOT NULL e UNIQUE) de cada tupla em uma tabela relacional. Uma Chave Estrangeira (Foreign Key - FK) é uma referência à chave primária de outra tabela.",
        whiteboard: wb,
        whiteboardSnippet: wb,
        keyPoints: [
          "PK identifica a linha; FK conecta as tabelas.",
          "Sem FK, o banco de dados perde a integridade referencial.",
          "Uma tabela só pode ter UMA chave primária (mesmo que composta por mais de uma coluna)."
        ]
      };
    }

    if (norm.includes("join")) {
      const wb = `=== GUIA VISUAL DE JOINS EM SQL ===
1. INNER JOIN:
   - Interseção exata. Retorna somente linhas com correspondência mútua.
   SELECT a.nome, c.nome_curso
   FROM alunos a
   INNER JOIN cursos c ON a.curso_id = c.id;

2. LEFT JOIN (ou LEFT OUTER JOIN):
   - Todas as linhas da tabela esquerda, preenchendo a direita com NULL se não houver par.
   SELECT a.nome, c.nome_curso
   FROM alunos a
   LEFT JOIN cursos c ON a.curso_id = c.id;

3. RIGHT JOIN:
   - Todas as linhas da tabela direita, preenchendo a esquerda com NULL.`;
      return {
        subject: "Banco de Dados",
        subjectId: "banco-de-dados",
        disciplineName: "Banco de Dados",
        disciplineId: "banco-de-dados",
        topic: "Linguagem SQL: Comandos JOIN",
        summary:
          "Os comandos JOIN unem colunas de duas ou mais tabelas relacionais com base em uma condição relacional (geralmente PK = FK).",
        whiteboard: wb,
        whiteboardSnippet: wb,
        keyPoints: [
          "INNER JOIN = apenas correspondências simultâneas.",
          "LEFT JOIN = todos da esquerda, mesmo sem correspondência na direita.",
          "Sempre use a cláusula ON para associar a PK com a FK."
        ]
      };
    }
  }

  // 2B. Química: Reações Químicas, Tabela Periódica, Ácidos e Bases, Estequiometria
  if (
    norm.includes("quimica") ||
    norm.includes("reacao quimica") ||
    norm.includes("reacoes quimicas") ||
    norm.includes("tabela periodica") ||
    norm.includes("estequiometria") ||
    norm.includes("ligacao quimica") ||
    norm.includes("ligacoes quimicas") ||
    norm.includes("acidos e bases") ||
    norm.includes("termoquimica") ||
    norm.includes("balanceamento") ||
    (subjectId === "quimica" && !query)
  ) {
    const wb = `=== QUÍMICA: REAÇÕES E TRANSFORMAÇÕES DA MATÉRIA ===
1. DEFINIÇÃO FUNDAMENTAL:
   - Reação Química: processo em que substâncias iniciais (Reagentes) sofrem quebra e rearranjo de ligações para formar novas substâncias (Produtos).
   - Lei de Lavoisier (Conservação da Massa): "Na natureza nada se cria, nada se perde, tudo se transforma." (Massa total reagentes = Massa total produtos).

2. EVIDÊNCIAS EXPERIMENTAIS DE OCORRÊNCIA:
   • Mudança de coloração da mistura
   • Liberação ou absorção de calor (Exotérmica vs Endotérmica)
   • Efervescência (desprendimento de gás)
   • Formação de precipitado sólido insolúvel
   • Emissão de luz / chama

3. TIPOS CLÁSSICOS DE REAÇÕES:
   • Síntese (Adição): A + B ---> AB
   • Decomposição (Análise): AB ---> A + B
   • Simples Troca (Deslocamento): A + BC ---> AC + B
   • Dupla Troca: AB + CD ---> AD + CB

4. EXEMPLO CLÁSSICO DE COMBUSTÃO:
   CH₄ (g) + 2 O₂ (g) ---> CO₂ (g) + 2 H₂O (v) + Calor`;

    return {
      subject: "Química",
      subjectId: "quimica",
      disciplineName: "Química",
      disciplineId: "quimica",
      topic: "Reações Químicas e Transformações da Matéria",
      summary:
        "No estudo da Química, uma reação química é uma transformação em que ligações interatômicas de reagentes são rompidas e reorganizadas para formar produtos com novas propriedades físicas e químicas, obedecendo rigorosamente às Leis Ponderais de Lavoisier e Proust.",
      whiteboard: wb,
      whiteboardSnippet: wb,
      keyPoints: [
        "Reações químicas ocorrem com conservação estrita do número total de átomos e da massa.",
        "Diferenciam-se de transformações físicas por alterarem a identidade química das substâncias envolvidas.",
        "Evidências macroscópicas: liberação de gás, alteração de cor, precipitação e troca térmica."
      ]
    };
  }

  // 3A. Biologia: Citologia / Célula (prioridade imediata quando o aluno pergunta sobre célula!)
  if (
    norm.includes("celula") ||
    norm.includes("citologia") ||
    norm.includes("organela") ||
    norm.includes("eucarionte") ||
    norm.includes("procarionte") ||
    norm.includes("membrana plasmatica") ||
    norm.includes("mitocondria")
  ) {
    const wb = `=== CITOLOGIA: ESTRUTURA E ORGANIZAÇÃO CELULAR ===
1. DEFINIÇÃO FUNDAMENTAL:
   - A célula é a unidade morfofisiológica (estrutural e funcional) básica de todos os seres vivos.

2. COMPONENTES ESSENCIAIS DE TODA CÉLULA:
   - Membrana Plasmática: bicamada fosfolipídica com permeabilidade seletiva.
   - Citoplasma (Citosol): matriz onde ocorrem reações metabólicas e ficam as organelas.
   - Material Genético (DNA): armazena e transmite a informação hereditária.

3. CLASSIFICAÇÃO CELULAR:
   - Procariontes (ex: bactérias): sem carioteca (DNA circular disperso no nucleoide) e sem organelas membranosas; possuem ribossomos 70S.
   - Eucariontes (ex: animais, plantas, fungos): núcleo verdadeiro delimitado por carioteca e organelas especializadas (mitocôndrias, complexo de Golgi, retículo endoplasmático, lisossomos, cloroplastos nas vegetais).`;
    return {
      subject: "Biologia",
      subjectId: "biologia",
      disciplineName: "Biologia",
      disciplineId: "biologia",
      topic: "Citologia: Estrutura e Função da Célula",
      summary:
        "A célula é a unidade estrutural, funcional e genética fundamental de todos os seres vivos. Toda célula possui membrana plasmática (controle seletivo), citoplasma e material genético (DNA). Divide-se em procariontes (sem núcleo organizado, como bactérias) e eucariontes (com núcleo delimitado por carioteca e organelas membranosas, como células animais e vegetais).",
      whiteboard: wb,
      whiteboardSnippet: wb,
      keyPoints: [
        "Tríade básica universal: Membrana Plasmática, Citoplasma e DNA.",
        "Procariontes não possuem carioteca nem organelas membranosas.",
        "Eucariontes vegetais possuem parede celulósica, vacúolo de suco celular e cloroplastos (onde ocorre a fotossíntese)."
      ]
    };
  }

  // 3B. Biologia: Fotossíntese (somente quando a pergunta é realmente sobre fotossíntese ou na abertura sem query)
  if (
    norm.includes("fotossintese") ||
    norm.includes("tilacoide") ||
    norm.includes("calvin") ||
    norm.includes("cloroplasto") ||
    norm.includes("rubisco") ||
    (subjectId === "biologia" && !query)
  ) {
    const wb = `=== EQUAÇÃO E FASES DA FOTOSSÍNTESE ===
Equação Geral:
6 CO₂ + 12 H₂O + Luz Solar ---> C₆H₁₂O₆ + 6 O₂ + 6 H₂O

1. FASE FOTOQUÍMICA (CLARA) - Nas membranas dos TILACOIDES:
   - Clorofila absorve fótons de luz.
   - Fotólise da água: quebra de H₂O liberando gás oxigênio (O₂)!
   - Síntese de ATP e redução de NADP⁺ a NADPH.

2. FASE QUÍMICA / CICLO DE CALVIN - No ESTROMA:
   - A enzima RuBisCO fixa o gás carbônico (CO₂).
   - Utiliza o ATP e NADPH gerados na fase clara para sintetizar Glicose.`;
    return {
      subject: "Biologia",
      subjectId: "biologia",
      disciplineName: "Biologia",
      disciplineId: "biologia",
      topic: "Fotossíntese e Bioenergética Celular",
      summary:
        "A fotossíntese é o processo bioquímico autotrófico que converte energia solar em glicose nos cloroplastos, em duas etapas coordenadas: a fase fotoquímica (tilacoides) e o ciclo de Calvin (estroma).",
      whiteboard: wb,
      whiteboardSnippet: wb,
      keyPoints: [
        "Todo o oxigênio liberado na atmosfera vem da água (H₂O), e NÃO do CO₂!",
        "Fase clara ocorre nos tilacoides; ciclo de Calvin ocorre no estroma.",
        "RuBisCO é a enzima chave para a fixação de carbono."
      ]
    };
  }

  // 4. Matemática / Bhaskara (somente quando a pergunta aborda equação de 2º grau/Bhaskara ou na abertura sem query)
  if (
    norm.includes("bhaskara") ||
    norm.includes("baskara") ||
    norm.includes("equacao do segundo grau") ||
    norm.includes("equacao do 2 grau") ||
    norm.includes("delta") ||
    (subjectId === "matematica" && !query)
  ) {
    const wb = `=== EQUAÇÃO DO 2º GRAU E BHASKARA ===
Forma Padrão: ax² + bx + c = 0 (a ≠ 0)

1. Discriminante Delta:
   Δ = b² - 4ac
   - Se Δ > 0: 2 raízes reais distintas (x' ≠ x'')
   - Se Δ = 0: 1 raiz real dupla (x' = x'')
   - Se Δ < 0: Nenhuma raiz real (conjunto ℝ vazio)

2. Fórmula Resolutiva de Bhaskara:
   x = (-b ± √Δ) / (2a)

3. Relações de Girard (Soma e Produto):
   Soma: S = x' + x'' = -b / a
   Produto: P = x' * x'' = c / a

Exemplo: x² - 5x + 6 = 0
a = 1, b = -5, c = 6
Δ = (-5)² - 4(1)(6) = 25 - 24 = 1
x = (5 ± 1) / 2 => x₁ = 3, x₂ = 2. S = {2, 3}`;
    return {
      subject: "Matemática",
      subjectId: "matematica",
      disciplineName: "Matemática",
      disciplineId: "matematica",
      topic: "Equações do 2º Grau e Bhaskara",
      summary:
        "Equação ax² + bx + c = 0 (com a ≠ 0). O discriminante Δ = b² - 4ac indica a quantidade e tipo de raízes reais, resolvidas pela fórmula x = (-b ± √Δ) / 2a.",
      whiteboard: wb,
      whiteboardSnippet: wb,
      keyPoints: [
        "Sempre iguale a equação a zero antes de identificar a, b e c.",
        "Delta negativo não possui raízes reais.",
        "Soma e produto auxiliam na verificação rápida do resultado."
      ]
    };
  }

  // 5. Física / Newton (somente quando a pergunta aborda Newton/Inércia/Força ou na abertura sem query)
  if (
    norm.includes("newton") ||
    norm.includes("inercia") ||
    norm.includes("acao e reacao") ||
    (subjectId === "fisica" && !query)
  ) {
    const wb = `=== AS TRÊS LEIS DE NEWTON ===
1ª LEI - INÉRCIA:
   Se Força Resultante = 0:
   - Corpo parado permanece em repouso.
   - Corpo em movimento permanece em Movimento Retilíneo Uniforme (MRU).

2ª LEI - PRINCÍPIO FUNDAMENTAL DA DINÂMICA:
   Fr = m * a
   (Força em Newtons [N], massa em kg, aceleração em m/s²)

3ª LEI - AÇÃO E REAÇÃO:
   Fab = -Fba
   - Mesma intensidade e mesma direção.
   - Sentidos opostos.
   - ATUAM EM CORPOS DIFERENTES (portanto, NUNCA se anulam mutuamente!).`;
    return {
      subject: "Física",
      subjectId: "fisica",
      disciplineName: "Física",
      disciplineId: "fisica",
      topic: "As Três Leis de Newton",
      summary:
        "As leis de Newton regem a mecânica clássica: Inércia (1ª lei), Princípio Fundamental da Dinâmica Fr = m*a (2ª lei) e Ação e Reação (3ª lei).",
      whiteboard: wb,
      whiteboardSnippet: wb,
      keyPoints: [
        "Ação e reação agem em corpos distintos.",
        "Aceleração depende diretamente da força e inversamente da massa.",
        "Inércia é proporcional à massa do corpo."
      ]
    };
  }

  // 6. História / Revolução Francesa (somente quando a pergunta aborda Revolução Francesa ou na abertura sem query)
  if (
    norm.includes("revolucao francesa") ||
    norm.includes("bastilha") ||
    norm.includes("jacobinos") ||
    (subjectId === "historia" && !query)
  ) {
    const wb = `=== REVOLUÇÃO FRANCESA (1789-1799) ===
1. CAUSAS E ANTIGO REGIME:
   - Sociedade estamental: 1º Estado (Clero), 2º Estado (Nobreza), 3º Estado (Burguesia, camponeses e sans-culottes).
   - Crise econômica, privilégios fiscais e difusão do Iluminismo.

2. FASES DA REVOLUÇÃO:
   - Assembleia Nacional e Queda da Bastilha (14/07/1789): Declaração dos Direitos do Homem e do Cidadão.
   - Convenção Nacional (1792-1795): República Jacobina (Robespierre) e o Período do Terror.
   - Diretório (1795-1799): Reação Girondina e Golpe do 18 Brumário (Napoleão Bonaparte).`;
    return {
      subject: "História",
      subjectId: "historia",
      disciplineName: "História",
      disciplineId: "historia",
      topic: topic || "A Revolução Francesa (1789): Da Queda da Bastilha ao Fim do Antigo Regime",
      summary:
        "A Revolução Francesa (1789) derrubou o absolutismo e os privilégios feudais do Antigo Regime, guiada pelos ideais iluministas de Liberdade, Igualdade e Fraternidade, dividindo-se nas fases da Assembleia Nacional, Convenção Jacobina e Diretório Girondino.",
      whiteboard: wb,
      whiteboardSnippet: wb,
      keyPoints: [
        "Terceiro Estado sustentava a França com impostos sem direitos políticos.",
        "Girondinos representavam a alta burguesia moderada; Jacobinos, a ala radical liderada por Robespierre.",
        "Consolidou o Estado burguês moderno e o fim da servidão feudal."
      ]
    };
  }

  // 7. Língua Inglesa
  if (
    norm.includes("verb to be") ||
    norm.includes("simple present") ||
    norm.includes("present perfect") ||
    (subjectId === "lingua-inglesa" && !query)
  ) {
    const wb = `=== LÍNGUA INGLESA: TEMPOS VERBAIS E ESTRATÉGIAS DE LEITURA ===
1. SIMPLE PRESENT vs PRESENT CONTINUOUS:
   - Simple Present (Rotina/Fato): "She studies database modeling every day."
   - Present Continuous (Ação agora): "She is studying English right now."

2. SIMPLE PAST vs PRESENT PERFECT:
   - Simple Past (Tempo fechado): "I visited London in 2024."
   - Present Perfect (Experiência/Reflexo no presente): "I have already read this chapter."

3. READING STRATEGIES (ENEM):
   - Skimming: leitura rápida para ideia geral.
   - Scanning: busca direta de dados específicos, datas e palavras-chave.`;
    return {
      subject: "Língua Inglesa",
      subjectId: "lingua-inglesa",
      disciplineName: "Língua Inglesa",
      disciplineId: "lingua-inglesa",
      topic: topic || "Verb Tenses, Reading Strategies and Phrasal Verbs",
      summary:
        "Na Língua Inglesa, o domínio dos tempos verbais (Simple Present, Present Continuous, Simple Past e Present Perfect) aliado às estratégias de leitura Skimming e Scanning e ao reconhecimento de falsos cognatos (como pretend = fingir e push = empurrar) garante precisão comunicativa e interpretativa.",
      whiteboard: wb,
      whiteboardSnippet: wb,
      keyPoints: [
        "Na 3ª pessoa do singular (He/She/It) no Simple Present, acrescenta-se -s/-es/-ies na afirmativa.",
        "Falsos cognatos (False Friends): Actually = na verdade; Pretend = fingir.",
        "Skimming busca o tema central; Scanning busca palavras específicas."
      ]
    };
  }

  // 8. Busca dinâmica nos 750 tópicos de initialDisciplines priorizando as palavras da pergunta atual (query)
  const discObj = initialDisciplines.find((d) => d.id === subjectId);
  const allContents = discObj?.modules.flatMap((m) => m.contents) || [];
  const queryWords = normalizeSemanticText(query)
    .split(" ")
    .filter((w) => w.length > 3 && !["explique", "detalhada", "forma", "sobre", "qual", "como", "funciona", "para"].includes(w));

  let matchedContent = queryWords.length > 0
    ? allContents.find((c) => {
        const nt = normalizeSemanticText(c.title);
        return queryWords.some((qw) => nt.includes(qw));
      })
    : undefined;

  if (!matchedContent && !query && topic) {
    matchedContent = allContents.find((c) =>
      normalizeSemanticText(c.title).includes(normalizeSemanticText(topic))
    );
  }

  const domain = DISCIPLINE_DOMAINS.find((d) => d.id === subjectId) || DISCIPLINE_DOMAINS[0];
  const resolvedTopic = matchedContent?.title || topic || domain.defaultTopic;
  const resolvedSummary = matchedContent
    ? matchedContent.summary
    : query
    ? `Foco prioritário na pergunta do estudante ("${query.trim()}") no contexto complementar de ${domain.name}.`
    : `Conteúdo didático estruturado para ${domain.name} sobre "${resolvedTopic}". Foco em conceitos fundamentais, deduções formais e aplicação prática.`;
  const wb = `=== ${resolvedTopic.toUpperCase()} ===\nDisciplina: ${domain.name}\n${
    query ? `Dúvida em foco: ${query.trim()}\n\n` : "\n"
  }${resolvedSummary.slice(0, 420)}`;
  return {
    subject: domain.name,
    subjectId: domain.id,
    disciplineName: domain.name,
    disciplineId: domain.id,
    topic: resolvedTopic,
    summary: resolvedSummary,
    whiteboard: wb,
    whiteboardSnippet: wb,
    keyPoints: ["Definição conceitual clara", "Características e mecanismos principais", "Aplicação prática e exemplos"]
  };
}

/**
 * Generates a complete, didactic, high-school/technical-level explanation directly answering
 * the student's current question, using the active session topic only as complementary context.
 */
export function generateDetailedConceptExplanation(
  question: string,
  context: QuestionContextResult,
  library: RelevantEducationalContent,
  activeSessionTopic?: string
): string {
  const raw = (question || "").trim();
  const norm = normalizeSemanticText(raw);
  const sessionTopic = activeSessionTopic || context.detectedTopic || "";
  const normSessionTopic = normalizeSemanticText(sessionTopic);

  const isGreetingOnly =
    /^(ola|oi|bom dia|boa tarde|boa noite|e ai|opa|alo|tudo bem|oi tutoria|ola tutoria)$/i.test(norm);
  const isVagueOnly =
    norm.length < 4 ||
    /^(nao entendi|me ajuda|ajuda|explica|me explica|pode explicar|tenho duvida|uma duvida|nao sei|como assim|detalhe|explique melhor)$/i.test(
      norm
    );

  if (isGreetingOnly || isVagueOnly) {
    return `Estou acompanhando seu estudo em ${context.detectedSubject}${
      sessionTopic ? ` (contexto: "${sessionTopic}")` : ""
    }. Sua pergunta ficou um pouco aberta — qual conceito, termo ou problema específico você gostaria que eu explicasse agora?`;
  }

  // Química: Reações Químicas, Matéria, Tabela Periódica, Ligações Químicas
  if (
    context.detectedSubjectId === "quimica" ||
    /\b(quimica|quimicas|reacao quimica|reacoes quimicas|tabela periodica|estequiometria|ligacao quimica|ligacoes quimicas|ligacao covalente|ligacao ionica|acidos e bases|termoquimica|balanceamento)\b/i.test(
      norm
    )
  ) {
    const isSubjectDiff =
      context.isSubjectSwitch ||
      (normSessionTopic && !normSessionTopic.includes("quimica"));

    const intro = isSubjectDiff
      ? "No âmbito da Química, uma reação química é o processo fundamental em que uma ou mais substâncias originais (chamadas reagentes) sofrem o rompimento de suas ligações atômicas e se reorganizam em novas substâncias (chamadas produtos), com propriedades químicas e físicas inteiramente distintas.\n\n"
      : "Uma reação química é a transformação da matéria em que os reagentes se convertem em novos produtos por meio do rearranjo e formação de novas ligações químicas:\n\n";

    return (
      intro +
      "1. Lei de Conservação da Massa (Lei de Lavoisier): Em um sistema fechado, a massa total antes e depois da reação permanece rigorosamente constante ('Na natureza nada se cria, nada se perde, tudo se transforma'). Por isso, o número total de átomos de cada elemento deve ser conservado, exigindo o balanceamento das equações químicas.\n\n" +
      "2. Evidências Macroscópicas de Ocorrência:\n" +
      "• Variação de temperatura: reações exotérmicas liberam calor (como combustões), enquanto reações endotérmicas absorvem calor;\n" +
      "• Efervescência e liberação gasosa (como efervescentes em água);\n" +
      "• Alteração nítida de coloração ou emissão de luz/chama;\n" +
      "• Formação de precipitado sólido insolúvel em meio líquido.\n\n" +
      "3. Classificação das Reações Químicas:\n" +
      "• Síntese ou Adição: dois ou mais reagentes formam um único produto (A + B → AB);\n" +
      "• Decomposição ou Análise: um único reagente origina múltiplos produtos (AB → A + B);\n" +
      "• Simples Troca ou Deslocamento: uma substância simples reage com uma composta (A + BC → AC + B);\n" +
      "• Dupla Troca: dois compostos trocam fragmentos iônicos entre si (AB + CD → AD + CB).\n\n" +
      "4. Exemplo Concreto: Na combustão completa do gás metano (CH₄ + 2 O₂ → CO₂ + 2 H₂O + calor), as ligações moleculares iniciais são rompidas e novos arranjos estáveis de gás carbônico e vapor de água são formados, liberando grande quantidade de energia."
    );
  }

  // Biologia: Citologia / O que é uma célula / Organelas
  if (
    /\b(celula|celulas|citologia|organela|organelas|procarionte|procariontes|eucarionte|eucariontes|membrana plasmatica|citoplasma|mitocondria|ribossomo|complexo de golgi|reticulo endoplasmatico|lisossomo)\b/i.test(
      norm
    )
  ) {
    const complementPhotosynthesis =
      normSessionTopic.includes("fotossintese") || normSessionTopic.includes("bioenergetica")
        ? "\n\n5. Relação com Fotossíntese e Bioenergética: Conectando ao contexto da sua aula, as células eucariontes vegetais possuem organelas exclusivas chamadas cloroplastos (ricos em clorofila), onde ocorre a fotossíntese para converter energia luminosa em glicose, enquanto as mitocôndrias realizam a respiração celular para gerar ATP."
        : "";

    return (
      "A célula é a unidade estrutural, morfológica, genética e funcional fundamental de todos os seres vivos. Pela Teoria Celular, todo organismo vivo é composto por uma única célula (unicelular, como bactérias e protozoários) ou por múltiplas células integradas (pluricelular, como plantas e animais).\n\n" +
      "1. Estrutura Básica Universal: Toda célula viva possui três partes essenciais:\n" +
      "• Membrana Plasmática: bicamada fosfolipídica com proteínas que delimita a célula e exerce a permeabilidade seletiva (controla a entrada de nutrientes e saída de excretas);\n" +
      "• Citoplasma (Citosol): matriz gelatinosa rica em água, íons e enzimas onde ocorrem as reações do metabolismo celular e ficam imersas as organelas;\n" +
      "• Material Genético (DNA): armazena as informações hereditárias e coordena o funcionamento e a reprodução celular.\n\n" +
      "2. Classificação Celular:\n" +
      "• Células Procariontes (ex.: bactérias e arqueas): têm estrutura simples, não possuem carioteca (o DNA circular fica disperso no nucleoide) e não possuem organelas membranosas, contando apenas com ribossomos para síntese proteica.\n" +
      "• Células Eucariontes (ex.: animais, vegetais, fungos e protozoários): são maiores e mais complexas, possuem núcleo verdadeiro delimitado pela carioteca e diversas organelas membranosas.\n\n" +
      "3. Principais Organelas e Funções:\n" +
      "• Mitocôndrias: respiração celular aeróbica e produção de energia (ATP);\n" +
      "• Ribossomos: síntese de proteínas;\n" +
      "• Retículo Endoplasmático Rugoso (produção de proteínas) e Liso (síntese de lipídios e desintoxicação);\n" +
      "• Complexo de Golgi: modificação, empacotamento e secreção de substâncias, além de originar os lisossomos;\n" +
      "• Lisossomos: digestão intracelular;\n" +
      "• Cloroplastos e Parede Celular Celulósica (exclusivos de células vegetais e algas): responsáveis pela fotossíntese e sustentação.\n\n" +
      "4. Exemplos Práticos: No corpo humano, as células assumem formatos adaptados às suas funções, como os neurônios (transmissão de impulsos nervosos), as hemácias (transporte de oxigênio) e as fibras musculares (contração)." +
      complementPhotosynthesis
    );
  }

  // Biologia: Fotossíntese
  if (
    /\b(fotossintese|fase clara|fase fotoquimica|fase escura|ciclo de calvin|calvin|tilacoide|tilacoides|estroma|cloroplasto|cloroplastos|clorofila|fotolise|rubisco)\b/i.test(
      norm
    )
  ) {
    return (
      "A fotossíntese é o processo bioquímico autotrófico realizado por plantas, algas e cianobactérias que converte energia luminosa em energia química (glicose, C₆H₁₂O₆) a partir de gás carbônico (CO₂) e água (H₂O), liberando gás oxigênio (O₂): 6 CO₂ + 12 H₂O + Luz → C₆H₁₂O₆ + 6 O₂ + 6 H₂O.\n\n" +
      "1. Fase Fotoquímica (Fase Clara — nos Tilacoides do cloroplasto): Depende diretamente da luz. A clorofila absorve fótons e ocorre a fotólise da água (quebra da molécula de H₂O), que libera todo o oxigênio (O₂) para a atmosfera e produz ATP e NADPH.\n\n" +
      "2. Fase Química ou Ciclo de Calvin (no Estroma do cloroplasto): Utiliza o ATP e o NADPH gerados na fase clara para que a enzima RuBisCO fixe o carbono do CO₂ e sintetize glicose, garantindo a base energética das cadeias alimentares."
    );
  }

  // Biologia: DNA, RNA e Genética
  if (/\b(dna|rna|genetica|gene|genes|cromossomo|cromossomos|mutacao|transcricao|traducao|mendel|hereditariedade)\b/i.test(norm)) {
    return (
      "Os ácidos nucleicos (DNA e RNA) são polímeros de nucleotídeos responsáveis pelo armazenamento e expressão da informação genética celular.\n\n" +
      "1. DNA (Ácido Desoxirribonucleico): Formado por dupla hélice com açúcar desoxirribose e pareamento obrigatório de bases nitrogenadas: Adenina (A) com Timina (T) e Citosina (C) com Guanina (G). Cada segmento funcional de DNA que codifica uma proteína ou RNA é um gene.\n\n" +
      "2. RNA (Ácido Ribonucleico): Formado por fita simples com açúcar ribose e a base Uracila (U) no lugar da Timina. Na transcrição, o DNA serve de molde para sintetizar o RNA mensageiro (RNAm); na tradução, os ribossomos leem o RNAm com auxílio do RNA transportador (RNAt) para montar as proteínas."
    );
  }

  // Biologia: Mitose e Meiose
  if (/\b(mitose|meiose|divisao celular|ciclo celular)\b/i.test(norm)) {
    return (
      "A divisão celular permite a reprodução e renovação das células por dois processos principais nos eucariontes:\n\n" +
      "1. Mitose (Divisão Equacional, 2n → 2n): Uma célula-mãe origina 2 células-filhas geneticamente idênticas (mesmo número de cromossomos), atuando no crescimento corporal, regeneração e cicatrização de tecidos.\n\n" +
      "2. Meiose (Divisão Reducional, 2n → n): Uma célula diploide sofre duas divisões sucessivas para formar 4 células haploides (metade dos cromossomos), atuando na formação de gametas (espermatozoides e óvulos) e gerando variabilidade genética pelo crossing-over."
    );
  }

  // Biologia: Ecologia e Evolução
  if (/\b(ecologia|cadeia alimentar|teia alimentar|ecossistema|bioma|selecao natural|evolucao|darwin|produtores|consumidores|decompositores)\b/i.test(norm)) {
    return (
      "A Ecologia analisa as relações entre os seres vivos (fatores bióticos) e o ambiente físico (fatores abióticos) nos ecossistemas.\n\n" +
      "1. Estrutura Trófica: Os produtores (plantas e algas) são autótrofos e formam a base da cadeia alimentar; os consumidores (herbívoros e carnívoros) são heterótrofos; e os decompositores (fungos e bactérias) reciclam a matéria orgânica em minerais.\n\n" +
      "2. Energia e Matéria: Enquanto a matéria realiza um ciclo fechado reaproveitado pelos decompositores, o fluxo de energia é unidirecional e diminui a cada nível trófico (cerca de 10% é transferido ao nível seguinte)."
    );
  }

  // Língua Portuguesa e Redação
  if (context.detectedSubjectId === "lingua-portuguesa-redacao") {
    if (/\b(orac(ao|oes)|coordenad(a|as)|subordinad(a|as)|periodo composto|sintaxe|assindetic|sindetic)\b/i.test(norm)) {
      return (
        "Na Língua Portuguesa e Sintaxe do Período Composto, as orações articulam-se por meio de dois processos fundamentais: Coordenação e Subordinação.\n\n" +
        "1. Orações Coordenadas (Independência Sintática):\n" +
        "São orações sintaticamente completas e autônomas entre si. Classificam-se em:\n" +
        "• Assindéticas: Não possuem conjunção, ligadas apenas por pontuação (Ex.: 'Chegou, sentou, começou a escrever').\n" +
        "• Sindéticas: Introduzidas por conjunções coordenativas em 5 tipos:\n" +
        "  - Aditivas (e, nem, não só... mas também): somam pensamentos ('Estudou e foi aprovado');\n" +
        "  - Adversativas (mas, porém, contudo, todavia, no entanto): indicam oposição ou quebra de expectativa ('Esforçou-se muito, contudo não atingiu a meta');\n" +
        "  - Alternativas (ou... ou, ora... ora, quer... quer): indicam alternância ou exclusão ('Ou você revisa o plano, ou adia a entrega');\n" +
        "  - Conclusivas (portanto, logo, por isso, por conseguinte): exprimem dedução lógica ('Praticou redação diariamente, logo obteve nota máxima');\n" +
        "  - Explicativas (que, porque, pois antes do verbo): justificam a oração anterior ('Entre logo, pois está chovendo').\n\n" +
        "2. Orações Subordinadas (Dependência Sintática):\n" +
        "Exercem uma função sintática indispensável em relação à oração principal. Dividem-se em 3 grandes grupos:\n" +
        "• Substantivas: Exercem papel de substantivo (Subjetiva, Objetiva Direta, Objetiva Indireta, Completiva Nominal, Predicativa e Apositiva). Exemplo: 'Quero [oração principal] que você compreenda a regra [subordinada substantiva objetiva direta]'.\n" +
        "• Adjetivas: Exercem função de adjunto adnominal, introduzidas por pronome relativo (que, cujo, quem):\n" +
        "  - Explicativas: isoladas por vírgulas, atribuem uma propriedade geral ao antecedente ('O oxigênio, que é vital, renova-se nas plantas');\n" +
        "  - Restritivas: sem vírgulas, limitam o sentido a um subconjunto ('Os estudantes que revisaram o módulo gabaritaram a prova').\n" +
        "• Adverbiais: Exercem função de adjunto adverbial da oração principal, classificadas em 9 circunstâncias (Causal, Consecutiva, Concessiva, Condicional, Comparativa, Conformativa, Temporal, Proporcional e Final). Exemplo: 'Embora estivesse cansado (concessiva), concluiu o simulado'."
      );
    }
    if (/\b(crase|acento grave)\b/i.test(norm)) {
      return (
        "A crase é a fusão da preposição 'a' com o artigo feminino 'a' (ou pronome demonstrativo), indicada pelo acento grave (`à`).\n\n" +
        "1. Regra Prática: Ocorre antes de palavras femininas quando o termo anterior exige a preposição 'a'. Substitua a palavra feminina por uma masculina: se virar 'ao', há crase (Ex.: 'Refiro-me à diretora' → 'Refiro-me ao diretor').\n\n" +
        "2. Quando NÃO usar crase: Antes de palavras masculinas ('andar a cavalo'), verbos no infinitivo ('começou a falar'), pronomes pessoais ('entregou a ela') e expressões com palavras repetidas ('dia a dia')."
      );
    }
    if (/\b(conclusao|proposta de intervencao|intervencao)\b/i.test(norm)) {
      return (
        "A conclusão da redação dissertativo-argumentativa deve apresentar uma Proposta de Intervenção estruturada nos 5 elementos obrigatórios da Competência 5:\n\n" +
        "1. Agente: quem executa a medida (ex.: Ministério da Educação);\n" +
        "2. Ação: o que deve ser feito na prática (ex.: criar campanhas e oficinas formativas);\n" +
        "3. Meio/Modo: como será colocado em prática (ex.: por meio de verbas públicas e parcerias escolares);\n" +
        "4. Efeito: qual o objetivo final para solucionar o problema;\n" +
        "5. Detalhamento: uma explicação ou exemplo adicional sobre um dos quatro elementos anteriores."
      );
    }
    return (
      "A redação dissertativo-argumentativa estrutura-se em 4 parágrafos estratégicos:\n\n" +
      "1. Introdução: Contextualização com repertório sociocultural legítimo + apresentação do tema + tese explícita indicando os dois argumentos (D1 e D2);\n" +
      "2. Desenvolvimento 1 e 2: Tópico frasal claro, fundamentação com repertório, argumentação crítica de causa/consequência e fechamento;\n" +
      "3. Conclusão: Retomada dos eixos da tese e proposta de intervenção completa com Agente, Ação, Meio/Modo, Efeito e Detalhamento."
    );
  }

  // Banco de Dados
  if (context.detectedSubjectId === "banco-de-dados") {
    if (/\b(join|inner join|left join|right join)\b/i.test(norm)) {
      return (
        "As cláusulas JOIN em SQL servem para consultar dados combinados de duas ou mais tabelas relacionais por meio da ligação entre a Chave Primária (PK) e a Chave Estrangeira (FK):\n\n" +
        "• INNER JOIN: Traz apenas os registros que possuem correspondência simultânea nas duas tabelas;\n" +
        "• LEFT JOIN: Traz todos os registros da tabela da esquerda e os correspondentes da direita (ou NULL quando não houver par);\n" +
        "• RIGHT JOIN: Traz todos os registros da tabela da direita.\n\n" +
        "Exemplo: `SELECT a.nome, t.nome_turma FROM Alunos a INNER JOIN Turmas t ON a.turma_id = t.id;`."
      );
    }
    return (
      "Em Banco de Dados Relacional, os dados são organizados em tabelas (relações) compostas por linhas (tuplas) e colunas (atributos):\n\n" +
      "1. Chave Primária (Primary Key — PK): Identifica cada registro de forma única e obrigatória (UNIQUE e NOT NULL);\n" +
      "2. Chave Estrangeira (Foreign Key — FK): Referencia a Chave Primária de outra tabela para manter a integridade referencial nos relacionamentos (1:1, 1:N, N:N);\n" +
      "3. Normalização (1FN, 2FN, 3FN): Elimina redundâncias e anomalias de atualização nas tabelas."
    );
  }

  // Matemática
  if (context.detectedSubjectId === "matematica") {
    return (
      "Na resolução de uma equação do 2º grau completa ax² + bx + c = 0 (com a ≠ 0), utilizamos a Fórmula de Bhaskara:\n\n" +
      "1. Discriminante (Delta): Δ = b² - 4·a·c. Se Δ > 0, existem 2 raízes reais distintas; se Δ = 0, há 1 raiz real dupla; se Δ < 0, não há raízes reais.\n" +
      "2. Fórmula das Raízes: x = (-b ± √Δ) / (2a), além das Relações de Girard para conferência rápida: Soma das raízes S = -b/a e Produto P = c/a.\n" +
      "Exemplo: Para x² - 5x + 6 = 0, temos Δ = (-5)² - 4(1)(6) = 1, gerando x₁ = 3 e x₂ = 2."
    );
  }

  // Física
  if (context.detectedSubjectId === "fisica") {
    return (
      "As três Leis de Newton descrevem a relação entre as forças que atuam sobre um corpo e o seu movimento:\n\n" +
      "1. Primeira Lei (Inércia): Se a força resultante for nula (Fr = 0), um corpo em repouso permanece em repouso e um corpo em movimento segue em Movimento Retilíneo Uniforme (MRU).\n" +
      "2. Segunda Lei (Princípio Fundamental da Dinâmica): A força resultante é igual ao produto da massa pela aceleração (Fr = m · a, medida em Newtons).\n" +
      "3. Terceira Lei (Ação e Reação): A toda ação corresponde uma reação de mesma intensidade, mesma direção e sentido oposto (Fab = -Fba), aplicadas em corpos diferentes."
    );
  }

  if (library.summary && !library.summary.startsWith("Foco prioritário na pergunta")) {
    const kpText =
      library.keyPoints && library.keyPoints.length > 0
        ? `\n\nPontos e características essenciais:\n${library.keyPoints.map((k) => `• ${k}`).join("\n")}`
        : "";
    return `${library.summary}${kpText}`;
  }

  return (
    `Sobre "${context.detectedTopic}" na disciplina de ${context.detectedSubject}:\n\n` +
    `1. Definição e Conceito Central: Trata-se de um princípio estruturante de ${context.detectedSubject} que explica como os elementos fundamentais do tema se organizam e interagem.\n` +
    `2. Características e Aplicação: Compreender suas propriedades permite analisar situações práticas, resolver questões com fundamentação teórica e conectar o conceito aos demais conteúdos de ${context.detectedSubject}.`
  );
}

