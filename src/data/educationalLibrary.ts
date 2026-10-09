import { initialDisciplines } from "./disciplinesData";
import { sampleQuestions } from "./activitiesData";
import { FlashcardItem, VideoLesson, MindMapNode, ConceptMapNode } from "../types";

export interface EducationalLibraryItem {
  id: string;
  subject: string;
  subjectId: string;
  title: string;
  topic: string;
  subtopic: string;
  type: "resumo" | "mapa-mental" | "mapa-conceitual" | "pesquisa-guiada" | "flashcard" | "video" | "atividade" | "disciplina";
  description: string;
  content: string;
  keywords: string[];
  relatedContent: Array<{
    id: string;
    title: string;
    type: string;
    disciplineId: string;
  }>;
  difficulty: "facil" | "medio" | "dificil";
  videoLinks: VideoLesson[];
  flashcards: FlashcardItem[];
  mindMap: {
    root: MindMapNode;
  };
  conceptMap: {
    relations: ConceptMapNode[];
  };
  guidedResearch: {
    theme: string;
    objective: string;
    prerequisites: string[];
    mainQuestion: string;
    guidingQuestions: string[];
    fundamentalConcepts: string[];
    researchSteps: string[];
    investigationPoints: string[];
    howToOrganize: string;
    reviewQuestions: string[];
    expectedConclusion: string;
    finalActivity: string;
    suggestedSources: string[];
  };
  activities: string[];
  targetContentId?: string;
  targetTab?: "resumo" | "pesquisa" | "flashcards" | "videos" | "mapas-mentais" | "mapas-conceituais";
}

// Extract keywords from text
function extractKeywords(text: string): string[] {
  const commonWords = new Set([
    "a", "o", "as", "os", "um", "uma", "uns", "umas", "de", "do", "da", "dos", "das",
    "em", "no", "na", "nos", "nas", "por", "pelo", "pela", "pelos", "pelas", "com",
    "para", "que", "se", "como", "ao", "aos", "e", "ou", "mas", "mais", "sua", "seu",
    "qual", "quais", "onde", "quando", "quem", "este", "esta", "esse", "essa", "isso",
    "aquele", "aquela", "aquilo", "sao", "são", "tem", "ter", "ser", "foi", "era"
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^\w\sáéíóúâêîôûãõç]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !commonWords.has(w));

  return Array.from(new Set(words));
}

// Build the central catalog dynamically from initialDisciplines
export const buildCentralLibrary = (): EducationalLibraryItem[] => {
  const items: EducationalLibraryItem[] = [];

  for (const disc of initialDisciplines) {
    // 1. Index the discipline itself as a library item
    items.push({
      id: `disc-${disc.id}`,
      subject: disc.name,
      subjectId: disc.id,
      title: disc.name,
      topic: disc.category,
      subtopic: "Visão Geral da Disciplina",
      type: "disciplina",
      description: disc.description,
      content: `${disc.name} - ${disc.category}. ${disc.description}`,
      keywords: [
        disc.name.toLowerCase(),
        disc.id,
        disc.category.toLowerCase(),
        ...extractKeywords(disc.description)
      ],
      relatedContent: disc.modules.flatMap((m) =>
        m.contents.map((c) => ({
          id: c.id,
          title: c.title,
          type: "conteudo",
          disciplineId: disc.id,
        }))
      ),
      difficulty: "facil",
      videoLinks: disc.modules.flatMap((m) => m.contents.flatMap((c) => c.videos || [])),
      flashcards: disc.modules.flatMap((m) => m.contents.flatMap((c) => c.flashcards || [])),
      mindMap: disc.modules[0]?.contents[0]?.mentalMap || {
        root: { id: `mm-${disc.id}`, label: disc.name, color: "#4f46e5" },
      },
      conceptMap: disc.modules[0]?.contents[0]?.conceptMap || { relations: [] },
      guidedResearch: {
        theme: disc.name,
        objective: disc.description,
        prerequisites: [],
        mainQuestion: `Como os fundamentos de ${disc.name} se aplicam a problemas práticos do mundo real?`,
        guidingQuestions: [
          `Quais são os conceitos estruturantes de ${disc.name}?`,
          `Como esta área se conecta com as demandas contemporâneas da sociedade e do mercado de trabalho?`
        ],
        fundamentalConcepts: [disc.category, disc.name],
        researchSteps: [
          "Revisão dos fundamentos",
          "Análise de exemplos e estudos de caso",
          "Aplicação em exercícios práticos"
        ],
        investigationPoints: ["Tendências e inovações da área"],
        howToOrganize: "Elabore fichamentos e mapas conceituais para cada módulo temático.",
        reviewQuestions: [`Explique o objetivo geral do estudo de ${disc.name}.`],
        expectedConclusion: `Domínio dos conceitos básicos e intermediários de ${disc.name}.`,
        finalActivity: "Desenvolver um estudo de caso integrador.",
        suggestedSources: ["Acervo ProfeIA", "BNCC Ensino Médio", "MEC"]
      },
      activities: sampleQuestions.filter((q) => q.disciplineId === disc.id).map((q) => q.id),
      targetContentId: disc.modules[0]?.contents[0]?.id,
      targetTab: "resumo"
    });

    for (const mod of disc.modules) {
      for (const c of mod.contents) {
        // Collect related activities
        const contentActivities = sampleQuestions
          .filter((q) => q.contentId === c.id || q.disciplineId === disc.id)
          .map((q) => q.id);

        const contentKeywords = [
          disc.name.toLowerCase(),
          mod.title.toLowerCase(),
          c.title.toLowerCase(),
          c.subtitle.toLowerCase(),
          ...extractKeywords(c.title + " " + c.subtitle + " " + c.summary),
          ...(c.prerequisites || []).map((p) => p.toLowerCase())
        ];

        // Specific high-frequency keywords per topic
        if (c.id === "bio-fotossintese") {
          contentKeywords.push(
            "fotossintese", "fotossíntese", "fase clara", "fase escura", "tilacoide", "tilacoides",
            "estroma", "rubisco", "calvin", "ciclo de calvin", "fotolise da agua", "oxigenio",
            "clorofila", "cloroplasto", "cloroplastos", "ponto de compensacao", "pcf", "bioenergetica"
          );
        } else if (c.id === "port-redacao-nota-1000") {
          contentKeywords.push(
            "redacao", "redação", "redacao dissertativa", "redacao nota 1000", "enem", "tese",
            "introducao", "introdução", "desenvolvimento", "conclusao", "conclusão",
            "proposta de intervencao", "proposta de intervenção", "agente", "acao", "ação",
            "meio", "modo", "efeito", "detalhamento", "repertorio", "repertório sociocultural",
            "coesao", "coesão", "conectivos", "dissertativo argumentativo"
          );
        } else if (c.id === "bd-sql-consultas") {
          contentKeywords.push(
            "sql", "select", "insert", "update", "delete", "join", "inner join", "left join",
            "right join", "where", "group by", "having", "order by", "chave primaria", "chave primária",
            "chave estrangeira", "foreign key", "sgbd", "banco relacional", "bancos de dados"
          );
        } else if (c.id === "mat-eq-2-grau") {
          contentKeywords.push(
            "bhaskara", "baskara", "equacao 2 grau", "equação do 2º grau", "delta", "discriminante",
            "raizes", "raízes reais", "girard", "soma e produto", "parabola", "parábola", "vertice"
          );
        } else if (c.id === "fis-leis-newton") {
          contentKeywords.push(
            "newton", "leis de newton", "inercia", "inércia", "acao e reacao", "ação e reação",
            "forca resultante", "força resultante", "f=ma", "dinamica", "dinâmica", "atrito"
          );
        }

        // Build 12-step guided research
        const guidedResearchFull = {
          theme: c.title,
          objective: c.subtitle,
          prerequisites: c.prerequisites || ["Conhecimentos gerais do Ensino Médio"],
          mainQuestion: c.guidedResearch.guidingQuestions[0] || `Como dominar os conceitos fundamentais de ${c.title}?`,
          guidingQuestions: c.guidedResearch.guidingQuestions,
          fundamentalConcepts: [c.title, mod.title, disc.name],
          researchSteps: [
            "Etapa 1: Leitura atenta do resumo didático estruturado",
            "Etapa 2: Mapeamento de termos-chave e fórmulas essenciais",
            "Etapa 3: Estudo visual com os diagramas do Mapa Mental e Mapa Conceitual",
            "Etapa 4: Assistir aos vídeos pedagógicos selecionados",
            "Etapa 5: Autoavaliação com o baralho de Flashcards",
            "Etapa 6: Resolução de questões diagnósticas e atividades práticas"
          ],
          investigationPoints: [c.guidedResearch.deepDiveNotes || "Aprofunde-se nos casos de aplicação real."],
          howToOrganize: "Registre fichas de estudo separando definições, fórmulas/regras, exemplos cotidianos e pegadinhas comuns.",
          reviewQuestions: c.guidedResearch.guidingQuestions,
          expectedConclusion: `Compreensão analítica e capacidade de resolver problemas e questões contextualizadas sobre ${c.title}.`,
          finalActivity: c.guidedResearch.practicalChallenge || "Resolver a atividade diagnóstica da plataforma.",
          suggestedSources: c.guidedResearch.suggestedSources || ["Biblioteca ProfeIA", "BNCC"]
        };

        // 2. Base content item (Resumo)
        items.push({
          id: c.id,
          subject: disc.name,
          subjectId: disc.id,
          title: c.title,
          topic: mod.title,
          subtopic: c.subtitle,
          type: "resumo",
          description: c.subtitle,
          content: c.summary,
          keywords: Array.from(new Set(contentKeywords)),
          relatedContent: mod.contents.filter((other) => other.id !== c.id).map((other) => ({
            id: other.id,
            title: other.title,
            type: "conteudo",
            disciplineId: disc.id,
          })),
          difficulty: "medio",
          videoLinks: c.videos || [],
          flashcards: c.flashcards || [],
          mindMap: c.mentalMap,
          conceptMap: c.conceptMap,
          guidedResearch: guidedResearchFull,
          activities: contentActivities,
          targetContentId: c.id,
          targetTab: "resumo"
        });

        // 3. Dedicated entry for Mind Map (Mapa Mental)
        items.push({
          id: `${c.id}-mindmap`,
          subject: disc.name,
          subjectId: disc.id,
          title: `Mapa Mental: ${c.title}`,
          topic: mod.title,
          subtopic: "Diagrama visual de conexões e ramos conceituais",
          type: "mapa-mental",
          description: `Mapa mental estruturado com conceitos centrais, ramos principais e subtópicos de ${c.title}.`,
          content: `Mapa mental de ${c.title}. Ramos: ${c.mentalMap.root.children?.map((ch) => ch.label).join(", ") || ""}`,
          keywords: Array.from(new Set([...contentKeywords, "mapa mental", "diagrama", "esquema visual", "resumo visual"])),
          relatedContent: [{ id: c.id, title: c.title, type: "resumo", disciplineId: disc.id }],
          difficulty: "facil",
          videoLinks: c.videos || [],
          flashcards: c.flashcards || [],
          mindMap: c.mentalMap,
          conceptMap: c.conceptMap,
          guidedResearch: guidedResearchFull,
          activities: contentActivities,
          targetContentId: c.id,
          targetTab: "mapas-mentais"
        });

        // 4. Dedicated entry for Concept Map (Mapa Conceitual)
        items.push({
          id: `${c.id}-conceptmap`,
          subject: disc.name,
          subjectId: disc.id,
          title: `Mapa Conceitual: ${c.title}`,
          topic: mod.title,
          subtopic: "Relações proposicionais e conectivos conceituais",
          type: "mapa-conceitual",
          description: `Relações conceituais formais e conectivos entre entidades fundamentais de ${c.title}.`,
          content: `Relações conceituais: ${c.conceptMap.relations.map((r) => `${r.from} --[${r.relationship}]--> ${r.to}`).join("; ")}`,
          keywords: Array.from(new Set([...contentKeywords, "mapa conceitual", "relacoes", "proposicoes", "conceitos"])),
          relatedContent: [{ id: c.id, title: c.title, type: "resumo", disciplineId: disc.id }],
          difficulty: "medio",
          videoLinks: c.videos || [],
          flashcards: c.flashcards || [],
          mindMap: c.mentalMap,
          conceptMap: c.conceptMap,
          guidedResearch: guidedResearchFull,
          activities: contentActivities,
          targetContentId: c.id,
          targetTab: "mapas-conceituais"
        });

        // 5. Dedicated entry for Guided Research (Pesquisa Guiada)
        items.push({
          id: `${c.id}-guidedresearch`,
          subject: disc.name,
          subjectId: disc.id,
          title: `Pesquisa Guiada: ${c.title}`,
          topic: mod.title,
          subtopic: "12 etapas estruturadas de investigação crítica",
          type: "pesquisa-guiada",
          description: `Roteiro estruturado de pesquisa, perguntas norteadoras, referências e desafio prático de ${c.title}.`,
          content: `${c.guidedResearch.guidingQuestions.join(" ")} ${c.guidedResearch.deepDiveNotes || ""} ${c.guidedResearch.practicalChallenge || ""}`,
          keywords: Array.from(new Set([...contentKeywords, "pesquisa guiada", "investigacao", "questoes norteadoras", "desafio pratico"])),
          relatedContent: [{ id: c.id, title: c.title, type: "resumo", disciplineId: disc.id }],
          difficulty: "dificil",
          videoLinks: c.videos || [],
          flashcards: c.flashcards || [],
          mindMap: c.mentalMap,
          conceptMap: c.conceptMap,
          guidedResearch: guidedResearchFull,
          activities: contentActivities,
          targetContentId: c.id,
          targetTab: "pesquisa"
        });

        // 6. Dedicated entry for Flashcards
        if (c.flashcards && c.flashcards.length > 0) {
          items.push({
            id: `${c.id}-flashcards`,
            subject: disc.name,
            subjectId: disc.id,
            title: `Flashcards: ${c.title} (${c.flashcards.length} cartas)`,
            topic: mod.title,
            subtopic: "Cartões de memorização e repetição espaçada",
            type: "flashcard",
            description: `Baralho interativo com cartões de pergunta e resposta classificados por nível de dificuldade para fixação de ${c.title}.`,
            content: c.flashcards.map((f) => `P: ${f.question} R: ${f.answer}`).join("\n"),
            keywords: Array.from(new Set([...contentKeywords, "flashcards", "cartoes", "memorizacao", "repeticao espacada", "revisao"])),
            relatedContent: [{ id: c.id, title: c.title, type: "resumo", disciplineId: disc.id }],
            difficulty: "facil",
            videoLinks: c.videos || [],
            flashcards: c.flashcards || [],
            mindMap: c.mentalMap,
            conceptMap: c.conceptMap,
            guidedResearch: guidedResearchFull,
            activities: contentActivities,
            targetContentId: c.id,
            targetTab: "flashcards"
          });
        }

        // 7. Dedicated entries for Videos
        if (c.videos && c.videos.length > 0) {
          for (const v of c.videos) {
            items.push({
              id: `v-${v.id}`,
              subject: disc.name,
              subjectId: disc.id,
              title: `Vídeo: ${v.title}`,
              topic: mod.title,
              subtopic: `${v.channel} • ${v.duration}`,
              type: "video",
              description: v.description,
              content: `${v.title} - ${v.description} (${v.channel}, duração ${v.duration})`,
              keywords: Array.from(new Set([...contentKeywords, "video", "aula em video", "videoaula", v.title.toLowerCase()])),
              relatedContent: [{ id: c.id, title: c.title, type: "resumo", disciplineId: disc.id }],
              difficulty: "facil",
              videoLinks: [v],
              flashcards: c.flashcards || [],
              mindMap: c.mentalMap,
              conceptMap: c.conceptMap,
              guidedResearch: guidedResearchFull,
              activities: contentActivities,
              targetContentId: c.id,
              targetTab: "videos"
            });
          }
        }
      }
    }
  }

  // Also index all activity questions
  for (const q of sampleQuestions) {
    items.push({
      id: `act-${q.id}`,
      subject: q.disciplineName,
      subjectId: q.disciplineId,
      title: `Atividade: ${q.title}`,
      topic: q.contentTitle,
      subtopic: `Questão prática (${q.difficulty}) com remediação diagnóstica`,
      type: "atividade",
      description: q.prompt.slice(0, 160) + "...",
      content: `${q.prompt}\n${q.options.map((o) => o.text).join("\n")}`,
      keywords: [
        q.disciplineName.toLowerCase(),
        q.contentTitle.toLowerCase(),
        q.title.toLowerCase(),
        "exercicio", "exercício", "atividade", "questao", "questão", "simulado", "pratica", "prática",
        ...extractKeywords(q.prompt)
      ],
      relatedContent: [{ id: q.contentId, title: q.contentTitle, type: "resumo", disciplineId: q.disciplineId }],
      difficulty: q.difficulty,
      videoLinks: [],
      flashcards: [],
      mindMap: { root: { id: `act-mm-${q.id}`, label: q.title, color: "#f59e0b" } },
      conceptMap: { relations: [] },
      guidedResearch: {
        theme: q.title,
        objective: "Avaliação formativa e fixação de conceitos",
        prerequisites: [q.prerequisiteFallback?.prerequisiteTopic || "Conceito básico"],
        mainQuestion: q.prompt,
        guidingQuestions: [q.prompt],
        fundamentalConcepts: [q.contentTitle],
        researchSteps: ["Leitura do enunciado", "Eliminação de alternativas incorretas", "Justificativa da correta"],
        investigationPoints: [q.correctExplanation],
        howToOrganize: "Revise a explicação detalhada de cada alternativa.",
        reviewQuestions: ["Por que a alternativa correta é a única válida?"],
        expectedConclusion: q.correctExplanation,
        finalActivity: "Refazer a questão sem consultar o gabarito.",
        suggestedSources: ["Banco de Questões ProfeIA"]
      },
      activities: [q.id],
      targetContentId: q.contentId,
      targetTab: "resumo"
    });
  }

  return items;
};

// Cached central library instance
export const centralEducationalLibrary: EducationalLibraryItem[] = buildCentralLibrary();

// Helper to look up an item by ID
export function getLibraryItemById(id: string): EducationalLibraryItem | undefined {
  return centralEducationalLibrary.find((item) => item.id === id);
}

// Helper to get items for a discipline
export function getLibraryItemsByDiscipline(disciplineId: string): EducationalLibraryItem[] {
  return centralEducationalLibrary.filter((item) => item.subjectId === disciplineId);
}

// 14 Disciplines Knowledge Map for Subject Detection
export const DISCIPLINE_KNOWLEDGE_MAP: Record<
  string,
  {
    name: string;
    id: string;
    primaryKeywords: string[];
    topics: string[];
  }
> = {
  matematica: {
    id: "matematica",
    name: "Matemática",
    primaryKeywords: [
      "bhaskara", "baskara", "equacao", "equação", "2º grau", "segundo grau", "delta",
      "discriminante", "raizes", "raízes", "funcao", "função", "quadratica", "quadrática",
      "afim", "parabola", "parábola", "vertice", "vértice", "girard", "trigonometria",
      "seno", "cosseno", "tangente", "probabilidade", "estatistica", "estatística",
      "geometria", "matriz", "determinante", "fatoracao", "fatoração", "polinomio", "polinômio"
    ],
    topics: ["Equações do 2º Grau e Bhaskara", "Funções Afim e Quadrática", "Trigonometria", "Estatística"]
  },
  biologia: {
    id: "biologia",
    name: "Biologia",
    primaryKeywords: [
      "fotossintese", "fotossíntese", "fase clara", "fase escura", "tilacoide", "tilacoides",
      "estroma", "rubisco", "calvin", "ciclo de calvin", "fotolise", "fotólise da agua",
      "clorofila", "cloroplasto", "cloroplastos", "ponto de compensacao", "pcf",
      "dna", "rna", "genetica", "genética", "mutacao", "mutação", "transcricao", "transcrição",
      "traducao", "tradução", "ribossomo", "celula", "célula", "mitose", "meiose",
      "ecologia", "cadeia alimentar", "cadeia trofica", "bioenergetica", "bioenergética"
    ],
    topics: ["Fotossíntese e Bioenergética Celular", "Ácidos Nucleicos: DNA, RNA e Síntese Proteica", "Genética Mendeliana", "Ecologia"]
  },
  fisica: {
    id: "fisica",
    name: "Física",
    primaryKeywords: [
      "newton", "leis de newton", "inercia", "inércia", "acao e reacao", "ação e reação",
      "dinamica", "dinâmica", "forca", "força", "f=ma", "atrito", "cinematica", "cinemática",
      "velocidade", "aceleracao", "aceleração", "gravidade", "trabalho", "energia cinetica",
      "energia potencial", "termodinamica", "termodinâmica", "calor", "optica", "óptica", "onda", "ondas"
    ],
    topics: ["As Três Leis de Newton e Dinâmica", "Cinemática e Movimento", "Termodinâmica", "Ondulatória e Óptica"]
  },
  geografia: {
    id: "geografia",
    name: "Geografia",
    primaryKeywords: [
      "globalizacao", "globalização", "geopolitica", "geopolítica", "dit", "divisao internacional do trabalho",
      "territorio", "território", "urbanizacao", "urbanização", "clima", "vegetacao", "vegetação",
      "relevo", "bacia hidrografica", "bacia hidrográfica", "migracao", "migração", "demografia",
      "agropecuaria", "agropecuária", "cartografia", "bioma", "biomas"
    ],
    topics: ["Globalização e a Nova Divisão Internacional do Trabalho", "Geopolítica Contemporânea", "Urbanização Brasileira", "Climatologia"]
  },
  sociologia: {
    id: "sociologia",
    name: "Sociologia",
    primaryKeywords: [
      "durkheim", "marx", "weber", "fato social", "luta de classes", "acao social", "ação social",
      "mais valia", "alienacao", "alienação", "estratificacao", "estratificação", "cidadania",
      "movimentos sociais", "desigualdade social", "cultura", "instituicoes sociais", "anomia"
    ],
    topics: ["Durkheim, Marx e Weber: As Três Matrizes Sociológicas", "Estratificação Social", "Cidadania e Movimentos Sociais", "Teoria Crítica"]
  },
  "analise-projeto-sistemas": {
    id: "analise-projeto-sistemas",
    name: "Análise e Projeto de Sistemas",
    primaryKeywords: [
      "requisito", "requisitos", "rf", "rnf", "funcionais", "nao funcionais", "não funcionais",
      "uml", "diagrama de classes", "caso de uso", "casos de uso", "diagrama de sequencia",
      "diagrama de sequência", "scrum", "agil", "ágil", "sprint", "kanban", "arquitetura de software"
    ],
    topics: ["Requisitos de Software e Diagramação UML Essencial", "Engenharia de Requisitos e Modelagem Ágil", "Metodologias Ágeis"]
  },
  "pratica-estagio-tcc": {
    id: "pratica-estagio-tcc",
    name: "Prática de Estágio e TCC",
    primaryKeywords: [
      "tcc", "trabalho de conclusao", "trabalho de conclusão", "abnt", "normas abnt", "banca",
      "banca examinadora", "problema de pesquisa", "metodologia cientifica", "metodologia científica",
      "justificativa", "objetivos", "estagio", "estágio", "relatorio de estagio", "relatório de estágio",
      "postura profissional", "entrevista tecnica", "entrevista técnica", "portfolio", "portfólio"
    ],
    topics: ["Estruturação Rigorosa do TCC e Produto Tecnológico", "Ética Profissional, Postura e Portfólio no Mercado Técnico", "Metodologia Científica"]
  },
  "banco-de-dados": {
    id: "banco-de-dados",
    name: "Banco de Dados",
    primaryKeywords: [
      "sql", "select", "insert", "update", "delete", "join", "inner join", "left join",
      "right join", "full join", "where", "group by", "having", "order by", "chave primaria",
      "chave primária", "pk", "chave estrangeira", "fk", "normalizacao", "normalização",
      "1fn", "2fn", "3fn", "sgbd", "mer", "der", "tabela relacional", "banco relacional"
    ],
    topics: ["Linguagem SQL: De SELECT a INNER/LEFT JOINs", "Modelagem Relacional e DER", "Normalização de Banco de Dados"]
  },
  "lingua-portuguesa-redacao": {
    id: "lingua-portuguesa-redacao",
    name: "Língua Portuguesa e Redação",
    primaryKeywords: [
      "redacao", "redação", "dissertativa", "dissertativo", "argumentativa", "argumentativo",
      "tese", "introducao", "introdução", "desenvolvimento", "d1", "d2", "conclusao", "conclusão",
      "proposta de intervencao", "proposta de intervenção", "agente", "acao", "ação", "meio", "modo",
      "efeito", "detalhamento", "repertorio", "repertório", "enem", "conectivo", "conectivos",
      "coesao", "coesão", "coerencia", "coerência", "crase", "concordancia", "concordância",
      "regencia", "regência", "sintaxe", "figuras de linguagem", "generos textuais", "gêneros textuais"
    ],
    topics: ["A Estrutura da Redação Dissertativo-Argumentativa", "Produção Textual e Redação Nota 1000", "Sintaxe e Coesão Normativa"]
  },
  "desenvolvimento-web": {
    id: "desenvolvimento-web",
    name: "Desenvolvimento Web",
    primaryKeywords: [
      "javascript", "js", "html", "html5", "css", "css3", "react", "frontend", "backend",
      "dom", "fetch", "api", "rest", "async", "await", "promises", "flexbox", "grid",
      "typescript", "componente", "json", "git", "github"
    ],
    topics: ["JavaScript Moderno, Manipulação do DOM e Fetch API", "Frontend Moderno: HTML, CSS e JavaScript", "APIs REST e Assincronismo"]
  },
  historia: {
    id: "historia",
    name: "História",
    primaryKeywords: [
      "ditadura", "ditadura militar", "regime militar", "ai 5", "ai-5", "diretas ja", "diretas já",
      "redemocratizacao", "redemocratização", "constituicao 1988", "constituição de 1988",
      "era vargas", "republica velha", "república velha", "revolucao industrial", "revolução industrial",
      "guerra mundial", "iluminismo", "brasil colonia", "brasil império"
    ],
    topics: ["O Regime Militar Brasileiro e o Processo de Abertura Política", "Brasil Contemporâneo", "Era Vargas e Industrialização"]
  },
  robotica: {
    id: "robotica",
    name: "Robótica",
    primaryKeywords: [
      "arduino", "sensor", "sensores", "ultrassonico", "ultrassônico", "microcontrolador",
      "atuador", "pwm", "analogread", "digitalwrite", "protoboard", "servo motor",
      "led", "circuito", "automacao", "automação", "embarcados"
    ],
    topics: ["Microcontroladores: Arquitetura Arduino e Sensores Analógicos", "Sistemas Embarcados com Arduino e Sensores", "Automação e Robótica Educativa"]
  },
  "design-de-interface": {
    id: "design-de-interface",
    name: "Design de Interface",
    primaryKeywords: [
      "ui", "ux", "interface", "figma", "wireframe", "prototipo", "protótipo", "nielsen",
      "heuristicas", "heurísticas de nielsen", "acessibilidade", "wcag", "contraste",
      "design system", "tipografia", "hierarquia visual", "grid de 8px", "usabilidade"
    ],
    topics: ["Hierarquia Visual, Cores e Tipografia em Interfaces Modernas", "Fundamentos de UX/UI e Design Systems", "Heurísticas de Usabilidade"]
  },
  "empreendedorismo-social": {
    id: "empreendedorismo-social",
    name: "Projeto de Empreendedorismo Social e Economia Solidária",
    primaryKeywords: [
      "empreendedorismo social", "impacto social", "economia solidaria", "economia solidária",
      "cooperativa", "cooperativismo", "canvas social", "social business canvas", "banco comunitário",
      "moeda social", "sustentabilidade", "gestao democratica", "gestão democrática", "paul singer"
    ],
    topics: ["O Social Business Model Canvas e Gestão Coletiva", "Modelos de Negócio de Impacto e Economia Solidária", "Cooperativismo e Moedas Sociais"]
  }
};

// Normalize text for matching
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Intelligent Semantic Subject Detector
 * Analyzes any query or message and identifies the exact discipline among all 14.
 * Does NOT stay locked into the currently active discipline!
 */
export function detectSubjectFromQuery(
  query: string,
  previousContext?: { disciplineId?: string; topic?: string }
): {
  disciplineId: string;
  disciplineName: string;
  topic?: string;
  confidence: number;
  isFollowUp: boolean;
} {
  const norm = normalizeText(query);

  // Check for clear follow-up questions that should retain context
  // e.g. "E como faço a introdução?", "Me dá um exemplo.", "E a conclusão?", "Pode explicar melhor?"
  const followUpTriggers = [
    "e como", "como faco", "como faço", "me da um exemplo", "me dá um exemplo",
    "mais um exemplo", "e a introducao", "e a conclusão", "e o desenvolvimento",
    "e o d1", "e o d2", "pode explicar melhor", "nao entendi", "não entendi",
    "me explica mais", "continue", "e depois", "e agora", "qual a formula",
    "qual a fórmula", "como calculo", "como resolvo"
  ];

  const hasFollowUpTrigger = followUpTriggers.some((t) => norm.includes(normalizeText(t)));

  // Score each discipline
  let bestDisciplineId = "";
  let highestScore = 0;
  let detectedTopic = "";

  for (const [discId, info] of Object.entries(DISCIPLINE_KNOWLEDGE_MAP)) {
    let score = 0;

    // Check primary keywords
    for (const kw of info.primaryKeywords) {
      const normKw = normalizeText(kw);
      if (norm.includes(normKw)) {
        // Multi-word exact matches get much higher weight
        const wordCount = normKw.split(" ").length;
        score += wordCount > 1 ? 40 * wordCount : 20;

        // Exact keyword match
        const regex = new RegExp(`\\b${normKw}\\b`, "i");
        if (regex.test(norm)) {
          score += 15;
        }
      }
    }

    // Check discipline name
    const normName = normalizeText(info.name);
    if (norm.includes(normName)) {
      score += 60;
    }

    // Check topics
    for (const top of info.topics) {
      const normTop = normalizeText(top);
      if (norm.includes(normTop)) {
        score += 35;
        detectedTopic = top;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestDisciplineId = discId;
    }
  }

  // If a strong match is found in another discipline, switch immediately!
  if (highestScore >= 20) {
    const matched = DISCIPLINE_KNOWLEDGE_MAP[bestDisciplineId];
    return {
      disciplineId: matched.id,
      disciplineName: matched.name,
      topic: detectedTopic || matched.topics[0],
      confidence: Math.min(100, Math.round(highestScore * 2)),
      isFollowUp: false,
    };
  }

  // If query is vague or a follow-up, and we have previous context, preserve context!
  if (previousContext?.disciplineId && DISCIPLINE_KNOWLEDGE_MAP[previousContext.disciplineId]) {
    const prev = DISCIPLINE_KNOWLEDGE_MAP[previousContext.disciplineId];
    return {
      disciplineId: prev.id,
      disciplineName: prev.name,
      topic: previousContext.topic || prev.topics[0],
      confidence: hasFollowUpTrigger ? 85 : 50,
      isFollowUp: true,
    };
  }

  // Fallback to default
  const defaultDisc = DISCIPLINE_KNOWLEDGE_MAP["matematica"];
  return {
    disciplineId: defaultDisc.id,
    disciplineName: defaultDisc.name,
    topic: defaultDisc.topics[0],
    confidence: 30,
    isFollowUp: false,
  };
}
