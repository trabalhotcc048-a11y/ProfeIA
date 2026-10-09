import { centralEducationalLibrary, EducationalLibraryItem } from "../data/educationalLibrary";

export interface SearchResultItem {
  id: string;
  title: string;
  subject: string;
  subjectId: string;
  type: "resumo" | "mapa-mental" | "mapa-conceitual" | "pesquisa-guiada" | "flashcard" | "video" | "atividade" | "disciplina";
  typeLabel: string;
  snippet: string;
  highlightIndices?: [number, number];
  targetContentId?: string;
  targetTab?: "resumo" | "pesquisa" | "flashcards" | "videos" | "mapas-mentais" | "mapas-conceituais";
  score: number;
}

export interface SearchResponse {
  query: string;
  totalResults: number;
  results: SearchResultItem[];
  suggestions: string[];
}

/**
 * Robust string normalization:
 * - Lowercases
 * - Removes diacritics / accents (e.g. "fotossíntese" -> "fotossintese", "redação" -> "redacao")
 * - Trims extra whitespace
 * - Normalizes singular/plural suffix basics in Portuguese (e.g. "equacoes" -> "equacao", "bancos" -> "banco")
 */
export function normalizeSearchString(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Basic Portuguese stemmer / singularizer helper
 */
function getWordVariants(word: string): string[] {
  const norm = normalizeSearchString(word);
  if (!norm || norm.length <= 2) return [norm];

  const variants = new Set<string>([norm]);

  // Plural to singular common patterns in Portuguese
  if (norm.endsWith("oes")) {
    variants.add(norm.slice(0, -3) + "ao"); // equacoes -> equacao, reacoes -> reacao
  } else if (norm.endsWith("aes")) {
    variants.add(norm.slice(0, -3) + "ao");
  } else if (norm.endsWith("ns")) {
    variants.add(norm.slice(0, -2) + "m"); // nuvens -> nuvem
  } else if (norm.endsWith("is")) {
    variants.add(norm.slice(0, -2) + "l"); // variaveis -> variavel
  } else if (norm.endsWith("es") && norm.length > 4) {
    variants.add(norm.slice(0, -2)); // redações -> redação
  } else if (norm.endsWith("s") && !norm.endsWith("ss")) {
    variants.add(norm.slice(0, -1)); // celulas -> celula, bancos -> banco
  }

  // Common aliases
  if (norm === "sql" || norm === "sqls") {
    variants.add("banco de dados");
    variants.add("select");
    variants.add("join");
  }
  if (norm === "bhaskara" || norm === "baskara") {
    variants.add("equacao do 2 grau");
    variants.add("delta");
  }
  if (norm === "newton" || norm === "leis de newton") {
    variants.add("dinamica");
    variants.add("inercia");
    variants.add("forca resultante");
  }
  if (norm === "redacao" || norm === "redacoes") {
    variants.add("dissertativo");
    variants.add("tese");
    variants.add("proposta de intervencao");
    variants.add("introducao");
    variants.add("conclusao");
  }
  if (norm === "fotossintese") {
    variants.add("cloroplasto");
    variants.add("tilacoide");
    variants.add("calvin");
    variants.add("fase clara");
  }

  return Array.from(variants);
}

/**
 * Extract an informative snippet around the matched search terms
 */
function extractSnippet(text: string, queryTerms: string[], maxLength: number = 160): string {
  if (!text) return "";
  const cleanText = text.replace(/\s+/g, " ").trim();
  const normalizedText = normalizeSearchString(cleanText);

  let earliestIndex = -1;
  for (const term of queryTerms) {
    const idx = normalizedText.indexOf(term);
    if (idx !== -1 && (earliestIndex === -1 || idx < earliestIndex)) {
      earliestIndex = idx;
    }
  }

  if (earliestIndex === -1) {
    return cleanText.length > maxLength ? cleanText.slice(0, maxLength) + "..." : cleanText;
  }

  const start = Math.max(0, earliestIndex - 40);
  const end = Math.min(cleanText.length, earliestIndex + maxLength - 40);

  let snippet = cleanText.slice(start, end);
  if (start > 0) snippet = "..." + snippet;
  if (end < cleanText.length) snippet = snippet + "...";

  return snippet;
}

const TYPE_LABELS: Record<string, string> = {
  disciplina: "Disciplina",
  resumo: "Resumo Didático",
  "mapa-mental": "Mapa Mental",
  "mapa-conceitual": "Mapa Conceitual",
  "pesquisa-guiada": "Pesquisa Guiada",
  flashcard: "Flashcards",
  video: "Vídeo Aula",
  atividade: "Atividade Prática"
};

/**
 * Search the central educational library with relevance scoring
 */
export function searchEducationalLibrary(
  query: string,
  filterType?: string
): SearchResponse {
  const normQuery = normalizeSearchString(query);

  if (!normQuery || normQuery.length < 2) {
    return {
      query,
      totalResults: 0,
      results: [],
      suggestions: ["Fotossíntese", "Redação Dissertativa", "SQL e JOINs", "Bhaskara", "Leis de Newton", "Desenvolvimento Web"]
    };
  }

  const terms = normQuery.split(" ").filter((t) => t.length > 1);
  const expandedTerms = new Set<string>();
  for (const t of terms) {
    for (const v of getWordVariants(t)) {
      expandedTerms.add(v);
    }
  }
  const termArray = Array.from(expandedTerms);

  const scoredResults: SearchResultItem[] = [];

  for (const item of centralEducationalLibrary) {
    if (filterType && filterType !== "all" && item.type !== filterType) {
      continue;
    }

    const normTitle = normalizeSearchString(item.title);
    const normSubject = normalizeSearchString(item.subject);
    const normTopic = normalizeSearchString(item.topic);
    const normSubtopic = normalizeSearchString(item.subtopic);
    const normContent = normalizeSearchString(item.content);
    const normKeywords = item.keywords.map(normalizeSearchString);

    let score = 0;

    // 1. Exact query match in Title (Highest weight: 120 points)
    if (normTitle === normQuery) {
      score += 150;
    } else if (normTitle.includes(normQuery)) {
      score += 100;
    }

    // 1b. Exact query match in Subject Name (e.g. "Biologia", "Matemática")
    if (normSubject === normQuery) {
      score += 120;
    } else if (normSubject.includes(normQuery)) {
      score += 80;
    }

    // 2. Main Topic match
    if (normTopic.includes(normQuery)) {
      score += 70;
    }

    // 3. Subtopic match
    if (normSubtopic.includes(normQuery)) {
      score += 50;
    }

    // 4. Keyword matches
    for (const kw of normKeywords) {
      if (kw === normQuery) {
        score += 80;
      } else if (kw.includes(normQuery)) {
        score += 45;
      } else {
        for (const t of termArray) {
          if (kw.includes(t)) {
            score += 20;
          }
        }
      }
    }

    // 5. Title term matching
    for (const t of termArray) {
      if (normTitle.includes(t)) {
        score += 35;
      }
      if (normTopic.includes(t)) {
        score += 25;
      }
    }

    // 6. Content body matching
    if (normContent.includes(normQuery)) {
      score += 40;
    } else {
      let matchedContentTerms = 0;
      for (const t of termArray) {
        if (normContent.includes(t)) {
          matchedContentTerms++;
        }
      }
      if (matchedContentTerms > 0) {
        score += Math.min(30, matchedContentTerms * 10);
      }
    }

    // If score passes minimum relevance threshold
    if (score >= 20) {
      const snippet = extractSnippet(
        item.content || item.description,
        termArray,
        140
      );

      scoredResults.push({
        id: item.id,
        title: item.title,
        subject: item.subject,
        subjectId: item.subjectId,
        type: item.type,
        typeLabel: TYPE_LABELS[item.type] || item.type,
        snippet,
        targetContentId: item.targetContentId,
        targetTab: item.targetTab || "resumo",
        score,
      });
    }
  }

  // Sort descending by relevance score
  scoredResults.sort((a, b) => b.score - a.score);

  // Suggestions if results are low
  const defaultSuggestions = [
    "Fotossíntese",
    "Redação Dissertativa",
    "SQL e JOINs",
    "Bhaskara e Funções",
    "Leis de Newton",
    "JavaScript e APIs"
  ];

  return {
    query,
    totalResults: scoredResults.length,
    results: scoredResults,
    suggestions: scoredResults.length === 0 ? defaultSuggestions : [],
  };
}
