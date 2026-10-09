import {
  Discipline,
  ContentItem,
  FlashcardItem,
  ActivityQuestion,
} from "../types";
import { initialDisciplines } from "../data/disciplinesData";
import { getAcademicPaper, AcademicPaper } from "./academicTextService";
import { getEnrichedFlashcards } from "./taxonomyData";
import { getQuestionsForDisciplineAndTopic } from "../data/activitiesData";
import {
  normalizeSemanticText,
  detectQuestionContext,
  findRelevantEducationalContent,
} from "./tutorIntentRouter";

const DB_NAME = "ProfeIAOfflineDB";
const DB_VERSION = 1;

const STORE_CONTENTS = "studied_contents";
const STORE_QA = "tutor_qa_cache";
const STORE_LOGS = "offline_study_logs";

export interface CachedStudiedContent {
  id: string;
  disciplineId: string;
  disciplineName: string;
  category: string;
  title: string;
  subtitle: string;
  summary: string;
  academicPaper: AcademicPaper;
  flashcards: FlashcardItem[];
  questions: ActivityQuestion[];
  prerequisites: string[];
  estimatedMinutes: number;
  lastStudiedAt: string;
  studyCount: number;
  isPinnedOffline: boolean;
  sizeBytes: number;
}

export interface CachedTutorQA {
  id: string;
  normalizedQuery: string;
  originalQuery: string;
  reply: string;
  whiteboardContent: string;
  detectedDisciplineId: string;
  detectedDisciplineName: string;
  detectedTopic: string;
  timestamp: string;
  hitCount: number;
}

export interface OfflineStudyLog {
  id: string;
  actionType: "content_read" | "tutor_query" | "activity_attempt" | "flashcard_review";
  disciplineId: string;
  disciplineName: string;
  topicTitle: string;
  detail: string;
  timestamp: string;
}

export interface OfflineStorageStats {
  cachedTopicsCount: number;
  cachedQACount: number;
  offlineLogsCount: number;
  totalBytes: number;
  disciplinesCovered: string[];
  lastSyncedAt: string;
}

// Memory fallback in case IndexedDB is unavailable in private/sandboxed frame
const memoryContents = new Map<string, CachedStudiedContent>();
const memoryQA = new Map<string, CachedTutorQA>();
const memoryLogs = new Map<string, OfflineStudyLog>();

let dbPromise: Promise<IDBDatabase | null> | null = null;
let isSeeded = false;

/**
 * Opens and initializes the native IndexedDB database (`ProfeIAOfflineDB`)
 */
export function openOfflineDB(): Promise<IDBDatabase | null> {
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    return Promise.resolve(null);
  }

  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(STORE_CONTENTS)) {
          const contentStore = db.createObjectStore(STORE_CONTENTS, { keyPath: "id" });
          contentStore.createIndex("disciplineId", "disciplineId", { unique: false });
          contentStore.createIndex("lastStudiedAt", "lastStudiedAt", { unique: false });
        }

        if (!db.objectStoreNames.contains(STORE_QA)) {
          const qaStore = db.createObjectStore(STORE_QA, { keyPath: "id" });
          qaStore.createIndex("normalizedQuery", "normalizedQuery", { unique: false });
          qaStore.createIndex("detectedDisciplineId", "detectedDisciplineId", { unique: false });
          qaStore.createIndex("timestamp", "timestamp", { unique: false });
        }

        if (!db.objectStoreNames.contains(STORE_LOGS)) {
          const logStore = db.createObjectStore(STORE_LOGS, { keyPath: "id" });
          logStore.createIndex("timestamp", "timestamp", { unique: false });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.warn("IndexedDB open error, using in-memory fallback:", request.error);
        resolve(null);
      };
    } catch (err) {
      console.warn("IndexedDB exception, using in-memory fallback:", err);
      resolve(null);
    }
  });

  return dbPromise;
}

/**
 * Checks if Offline Mode is active (either real browser offline or user-toggled offline mode)
 */
export function isOfflineTutorModeEnabled(): boolean {
  if (typeof window === "undefined") return false;
  const forcedOffline = localStorage.getItem("profeia_offline_tutor_mode") === "true";
  const browserOffline = typeof navigator !== "undefined" && navigator.onLine === false;
  return forcedOffline || browserOffline;
}

export function setOfflineTutorModeForced(enabled: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("profeia_offline_tutor_mode", enabled ? "true" : "false");
  window.dispatchEvent(new CustomEvent("profeia-offline-mode-changed", { detail: { enabled } }));
}

export function getOfflineTutorModeForced(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("profeia_offline_tutor_mode") === "true";
}

/**
 * Caches a studied topic/chapter into IndexedDB with its academic paper, flashcards, and 10 questions
 */
export async function cacheStudiedContent(
  discipline: Discipline,
  content: ContentItem,
  options?: { isPinnedOffline?: boolean; incrementStudy?: boolean }
): Promise<CachedStudiedContent> {
  const db = await openOfflineDB();
  const existing = await getCachedContentById(content.id);

  const academicPaper = getAcademicPaper(
    discipline.name,
    content.title,
    2,
    discipline.id,
    content.subtitle,
    content.prerequisites?.[0]
  );
  const questions = getQuestionsForDisciplineAndTopic(discipline.id, content.id);
  const enrichedFlashcards = getEnrichedFlashcards(content);

  const payload: CachedStudiedContent = {
    id: content.id,
    disciplineId: discipline.id,
    disciplineName: discipline.name,
    category: discipline.category,
    title: content.title,
    subtitle: academicPaper.subtitle || content.subtitle,
    summary: academicPaper.abstract,
    academicPaper,
    flashcards: enrichedFlashcards,
    questions,
    prerequisites: content.prerequisites || [],
    estimatedMinutes: content.estimatedMinutes || 25,
    lastStudiedAt: new Date().toISOString(),
    studyCount: existing
      ? existing.studyCount + (options?.incrementStudy === false ? 0 : 1)
      : 1,
    isPinnedOffline: options?.isPinnedOffline ?? existing?.isPinnedOffline ?? true,
    sizeBytes: 0,
  };

  const serializedSize = new Blob([JSON.stringify(payload)]).size;
  payload.sizeBytes = serializedSize;

  memoryContents.set(payload.id, payload);

  if (db) {
    await new Promise<void>((resolve) => {
      try {
        const tx = db.transaction(STORE_CONTENTS, "readwrite");
        const store = tx.objectStore(STORE_CONTENTS);
        store.put(payload);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("profeia_offline_last_sync", new Date().toISOString());
      window.dispatchEvent(new CustomEvent("profeia-indexeddb-updated"));
    } catch {}
  }
  return payload;
}

/**
 * Caches multiple or all topics of a discipline into IndexedDB for offline access
 */
export async function cacheDisciplinePackageOffline(
  discipline: Discipline,
  maxTopics: number = 15
): Promise<number> {
  const allTopics = discipline.modules.flatMap((m) => m.contents).slice(0, maxTopics);
  let count = 0;
  for (const topic of allTopics) {
    await cacheStudiedContent(discipline, topic, {
      isPinnedOffline: true,
      incrementStudy: false,
    });
    count++;
  }
  await recordOfflineStudyLog({
    actionType: "content_read",
    disciplineId: discipline.id,
    disciplineName: discipline.name,
    topicTitle: `Pacote Offline (${count} capítulos)`,
    detail: `Sincronizados ${count} capítulos completos de ${discipline.name} no IndexedDB.`,
  });
  return count;
}

export interface DisciplineOfflineCacheMeta {
  disciplineId: string;
  disciplineName: string;
  topicsCount: number;
  totalSizeBytes: number;
  formattedSize: string;
  savedAt: string;
}

export function formatStorageBytes(bytes: number): string {
  if (bytes <= 0) return "0 KB";
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Baixa e persiste todos os conteúdos da disciplina atual em cache local (IndexedDB e LocalStorage),
 * garantindo acesso integral mesmo sem qualquer conexão com a internet.
 */
export async function downloadDisciplineForOffline(
  discipline: Discipline,
  onProgress?: (current: number, total: number, topicTitle: string) => void
): Promise<DisciplineOfflineCacheMeta> {
  const allTopics = discipline.modules.flatMap((m) => m.contents);
  const total = allTopics.length;
  let current = 0;
  let totalSizeBytes = 0;

  for (const topic of allTopics) {
    current++;
    onProgress?.(current, total, topic.title);
    const cachedItem = await cacheStudiedContent(discipline, topic, {
      isPinnedOffline: true,
      incrementStudy: false,
    });
    totalSizeBytes += cachedItem.sizeBytes || 2048;
  }

  const formattedSize = formatStorageBytes(totalSizeBytes);
  const meta: DisciplineOfflineCacheMeta = {
    disciplineId: discipline.id,
    disciplineName: discipline.name,
    topicsCount: total,
    totalSizeBytes,
    formattedSize,
    savedAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(`profeia_offline_saved_${discipline.id}`, "true");
      localStorage.setItem(`profeia_offline_meta_${discipline.id}`, JSON.stringify(meta));
      localStorage.setItem(
        `profeia_offline_discipline_snapshot_${discipline.id}`,
        JSON.stringify(discipline)
      );

      const rawList = localStorage.getItem("profeia_offline_disciplines_list");
      const list: string[] = rawList ? JSON.parse(rawList) : [];
      if (!list.includes(discipline.id)) {
        list.push(discipline.id);
        localStorage.setItem("profeia_offline_disciplines_list", JSON.stringify(list));
      }
    } catch (e) {
      console.warn("LocalStorage snapshot fallback exception:", e);
    }
  }

  await recordOfflineStudyLog({
    actionType: "content_read",
    disciplineId: discipline.id,
    disciplineName: discipline.name,
    topicTitle: `Pacote Completo Offline (${total} capítulos)`,
    detail: `Todos os ${total} capítulos e materiais de ${discipline.name} foram sincronizados no cache local permanente (${formattedSize}).`,
  });

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("profeia-discipline-cached", {
        detail: { disciplineId: discipline.id, meta },
      })
    );
    window.dispatchEvent(new CustomEvent("profeia-indexeddb-updated"));
  }

  return meta;
}

export function isDisciplineSavedOffline(disciplineId: string): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(`profeia_offline_saved_${disciplineId}`) === "true";
}

export function getDisciplineOfflineMeta(
  disciplineId: string
): DisciplineOfflineCacheMeta | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(`profeia_offline_meta_${disciplineId}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DisciplineOfflineCacheMeta;
  } catch {
    return null;
  }
}

export function getAllSavedOfflineDisciplinesList(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("profeia_offline_disciplines_list");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function removeDisciplineOfflinePackage(disciplineId: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(`profeia_offline_saved_${disciplineId}`);
    localStorage.removeItem(`profeia_offline_meta_${disciplineId}`);
    localStorage.removeItem(`profeia_offline_discipline_snapshot_${disciplineId}`);
    const rawList = localStorage.getItem("profeia_offline_disciplines_list");
    const list: string[] = rawList ? JSON.parse(rawList) : [];
    const updated = list.filter((id) => id !== disciplineId);
    localStorage.setItem("profeia_offline_disciplines_list", JSON.stringify(updated));
    window.dispatchEvent(
      new CustomEvent("profeia-discipline-cached", { detail: { disciplineId } })
    );
    window.dispatchEvent(new CustomEvent("profeia-indexeddb-updated"));
  } catch (e) {
    console.warn("Error removing offline package:", e);
  }
}

/**
 * Retrieves a single cached content item by ID from IndexedDB
 */
export async function getCachedContentById(
  contentId: string
): Promise<CachedStudiedContent | null> {
  const db = await openOfflineDB();
  if (!db) {
    return memoryContents.get(contentId) || null;
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_CONTENTS, "readonly");
      const store = tx.objectStore(STORE_CONTENTS);
      const req = store.get(contentId);
      req.onsuccess = () => resolve((req.result as CachedStudiedContent) || memoryContents.get(contentId) || null);
      req.onerror = () => resolve(memoryContents.get(contentId) || null);
    } catch {
      resolve(memoryContents.get(contentId) || null);
    }
  });
}

/**
 * Retrieves all cached studied contents from IndexedDB sorted by most recently studied
 */
export async function getAllCachedContents(): Promise<CachedStudiedContent[]> {
  await ensureInitialOfflineCacheSeeded();
  const db = await openOfflineDB();
  if (!db) {
    return Array.from(memoryContents.values()).sort((a, b) =>
      b.lastStudiedAt.localeCompare(a.lastStudiedAt)
    );
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_CONTENTS, "readonly");
      const store = tx.objectStore(STORE_CONTENTS);
      const req = store.getAll();
      req.onsuccess = () => {
        const list = (req.result as CachedStudiedContent[]) || [];
        const merged = list.length > 0 ? list : Array.from(memoryContents.values());
        resolve(
          merged.sort((a, b) => b.lastStudiedAt.localeCompare(a.lastStudiedAt))
        );
      };
      req.onerror = () =>
        resolve(
          Array.from(memoryContents.values()).sort((a, b) =>
            b.lastStudiedAt.localeCompare(a.lastStudiedAt)
          )
        );
    } catch {
      resolve(
        Array.from(memoryContents.values()).sort((a, b) =>
          b.lastStudiedAt.localeCompare(a.lastStudiedAt)
        )
      );
    }
  });
}

/**
 * Removes a specific topic from IndexedDB cache
 */
export async function removeCachedContent(contentId: string): Promise<void> {
  memoryContents.delete(contentId);
  const db = await openOfflineDB();
  if (db) {
    await new Promise<void>((resolve) => {
      try {
        const tx = db.transaction(STORE_CONTENTS, "readwrite");
        tx.objectStore(STORE_CONTENTS).delete(contentId);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }
  window.dispatchEvent(new CustomEvent("profeia-indexeddb-updated"));
}

/**
 * Caches a TutorIA question & answer pair into IndexedDB
 */
export async function cacheTutorInteraction(params: {
  query: string;
  reply: string;
  whiteboardContent?: string;
  detectedDisciplineId: string;
  detectedDisciplineName: string;
  detectedTopic: string;
}): Promise<CachedTutorQA> {
  const norm = normalizeSemanticText(params.query);
  const id = `qa-${params.detectedDisciplineId}-${norm.slice(0, 48).replace(/\s+/g, "-")}`;
  const db = await openOfflineDB();

  const item: CachedTutorQA = {
    id,
    normalizedQuery: norm,
    originalQuery: params.query.trim(),
    reply: params.reply,
    whiteboardContent:
      params.whiteboardContent ||
      `=== ${params.detectedTopic.toUpperCase()} (${params.detectedDisciplineName}) ===\n${params.reply.slice(0, 280)}`,
    detectedDisciplineId: params.detectedDisciplineId,
    detectedDisciplineName: params.detectedDisciplineName,
    detectedTopic: params.detectedTopic,
    timestamp: new Date().toISOString(),
    hitCount: 1,
  };

  memoryQA.set(id, item);

  if (db) {
    await new Promise<void>((resolve) => {
      try {
        const tx = db.transaction(STORE_QA, "readwrite");
        tx.objectStore(STORE_QA).put(item);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  window.dispatchEvent(new CustomEvent("profeia-indexeddb-updated"));
  return item;
}

/**
 * Retrieves all cached Tutor Q&A pairs from IndexedDB
 */
export async function getAllCachedTutorQA(): Promise<CachedTutorQA[]> {
  await ensureInitialOfflineCacheSeeded();
  const db = await openOfflineDB();
  if (!db) {
    return Array.from(memoryQA.values()).sort((a, b) =>
      b.timestamp.localeCompare(a.timestamp)
    );
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_QA, "readonly");
      const req = tx.objectStore(STORE_QA).getAll();
      req.onsuccess = () => {
        const list = (req.result as CachedTutorQA[]) || [];
        const merged = list.length > 0 ? list : Array.from(memoryQA.values());
        resolve(merged.sort((a, b) => b.timestamp.localeCompare(a.timestamp)));
      };
      req.onerror = () =>
        resolve(
          Array.from(memoryQA.values()).sort((a, b) =>
            b.timestamp.localeCompare(a.timestamp)
          )
        );
    } catch {
      resolve(
        Array.from(memoryQA.values()).sort((a, b) =>
          b.timestamp.localeCompare(a.timestamp)
        )
      );
    }
  });
}

/**
 * Records a local study log in IndexedDB
 */
export async function recordOfflineStudyLog(
  entry: Omit<OfflineStudyLog, "id" | "timestamp">
): Promise<void> {
  const log: OfflineStudyLog = {
    ...entry,
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
  };
  memoryLogs.set(log.id, log);

  const db = await openOfflineDB();
  if (db) {
    await new Promise<void>((resolve) => {
      try {
        const tx = db.transaction(STORE_LOGS, "readwrite");
        tx.objectStore(STORE_LOGS).put(log);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }
}

export async function getOfflineStudyLogs(): Promise<OfflineStudyLog[]> {
  const db = await openOfflineDB();
  if (!db) {
    return Array.from(memoryLogs.values()).sort((a, b) =>
      b.timestamp.localeCompare(a.timestamp)
    );
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_LOGS, "readonly");
      const req = tx.objectStore(STORE_LOGS).getAll();
      req.onsuccess = () => {
        const list = (req.result as OfflineStudyLog[]) || [];
        resolve(
          list.sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 30)
        );
      };
      req.onerror = () => resolve([]);
    } catch {
      resolve([]);
    }
  });
}

/**
 * Searches the local IndexedDB (`tutor_qa_cache` + `studied_contents`) to answer a student question offline!
 * Follows strict Zero Fluff (no greetings) and dynamic discipline routing.
 */
export async function resolveOfflineTutorQuery(params: {
  query: string;
  selectedSubject?: string;
  selectedSubjectId?: string;
  currentTopic?: string;
  conversationHistory?: Array<{ role: string; content: string }>;
}): Promise<{
  reply: string;
  whiteboardContent: string;
  detectedDisciplineId: string;
  detectedDisciplineName: string;
  detectedTopic: string;
  matchedCacheId?: string;
  cacheSource: "indexeddb-qa" | "indexeddb-content" | "indexeddb-library";
}> {
  await ensureInitialOfflineCacheSeeded();

  const normQuery = normalizeSemanticText(params.query);
  const queryWords = normQuery.split(" ").filter((w) => w.length > 3);

  // 1. Dynamic Subject & Topic Detection
  const context = detectQuestionContext({
    question: params.query,
    selectedSubject: params.selectedSubject,
    selectedSubjectId: params.selectedSubjectId,
    currentTopic: params.currentTopic,
    conversationHistory: params.conversationHistory,
  });

  // 2. Search IndexedDB Q&A Store for exact or high-similarity match
  const allQA = await getAllCachedTutorQA();
  let bestQA: CachedTutorQA | null = null;
  let bestQAScore = 0;

  for (const qa of allQA) {
    if (qa.normalizedQuery === normQuery) {
      bestQA = qa;
      bestQAScore = 100;
      break;
    }
    let score = 0;
    if (qa.detectedDisciplineId === context.detectedSubjectId) {
      score += 15;
    }
    for (const w of queryWords) {
      if (qa.normalizedQuery.includes(w)) {
        score += 18;
      }
    }
    if (score > bestQAScore) {
      bestQAScore = score;
      bestQA = qa;
    }
  }

  if (bestQA && bestQAScore >= 45) {
    await recordOfflineStudyLog({
      actionType: "tutor_query",
      disciplineId: bestQA.detectedDisciplineId,
      disciplineName: bestQA.detectedDisciplineName,
      topicTitle: bestQA.detectedTopic,
      detail: `Resposta recuperada do cache Q&A IndexedDB: "${params.query.slice(0, 50)}"`,
    });

    return {
      reply: bestQA.reply,
      whiteboardContent: bestQA.whiteboardContent,
      detectedDisciplineId: bestQA.detectedDisciplineId,
      detectedDisciplineName: bestQA.detectedDisciplineName,
      detectedTopic: bestQA.detectedTopic,
      matchedCacheId: bestQA.id,
      cacheSource: "indexeddb-qa",
    };
  }

  // 3. Search IndexedDB Studied Contents Store (`studied_contents`)
  // Somente utiliza um capítulo em cache se a pergunta realmente corresponder às palavras-chave do título daquele capítulo
  const cachedContents = await getAllCachedContents();
  let bestContent: CachedStudiedContent | null = null;
  let bestContentScore = 0;
  const meaningfulQueryWords = queryWords.filter(
    (w) => !["explique", "detalhada", "forma", "sobre", "qual", "como", "funciona", "para", "oque", "significa"].includes(w)
  );

  for (const item of cachedContents) {
    let score = 0;
    let matchedTitleWord = false;
    const normTitle = normalizeSemanticText(item.title);
    const normSummary = normalizeSemanticText(item.summary);

    if (normQuery.includes(normTitle) || normTitle.includes(normQuery)) {
      score += 65;
      matchedTitleWord = true;
    }
    for (const w of meaningfulQueryWords) {
      if (normTitle.includes(w)) {
        score += 30;
        matchedTitleWord = true;
      } else if (normSummary.includes(w)) {
        score += 8;
      }
    }
    if (matchedTitleWord && item.disciplineId === context.detectedSubjectId) {
      score += 15;
    }

    if (matchedTitleWord && score > bestContentScore) {
      bestContentScore = score;
      bestContent = item;
    }
  }

  if (bestContent && bestContentScore >= 45) {
    const ch1 = bestContent.academicPaper?.chapters?.[0];
    const ch2 = bestContent.academicPaper?.chapters?.[1];
    const flashcardHint = bestContent.flashcards?.[0]
      ? `\n\nPonto-Chave de Fixação: ${bestContent.flashcards[0].question} → ${bestContent.flashcards[0].answer}`
      : "";

    const directOfflineReply = `${bestContent.summary}\n\n${
      ch1 ? `Fundamentação (${ch1.heading}): ${ch1.paragraphs[0]}` : ""
    }${flashcardHint}`;

    const wb = `=== CACHE OFFLINE INDEXEDDB: ${bestContent.title.toUpperCase()} ===
Disciplina: ${bestContent.disciplineName}
Status: Conteúdo sincronizado localmente (Acesso Sem Internet)

RESUMO ESTRUTURAL:
${bestContent.summary.slice(0, 360)}

${
  ch2?.highlightEquation
    ? `FÓRMULA / SINTAXE EM DESTAQUE:\n${ch2.highlightEquation}`
    : `PRÉ-REQUISITOS: ${bestContent.prerequisites.join(", ") || "Base Geral"}`
}`;

    await recordOfflineStudyLog({
      actionType: "tutor_query",
      disciplineId: bestContent.disciplineId,
      disciplineName: bestContent.disciplineName,
      topicTitle: bestContent.title,
      detail: `Explicação gerada via Capítulo em Cache IndexedDB: "${bestContent.title}"`,
    });

    return {
      reply: directOfflineReply,
      whiteboardContent: wb,
      detectedDisciplineId: bestContent.disciplineId,
      detectedDisciplineName: bestContent.disciplineName,
      detectedTopic: bestContent.title,
      matchedCacheId: bestContent.id,
      cacheSource: "indexeddb-content",
    };
  }

  // 4. Fallback to Local Curriculum Library & auto-cache it into IndexedDB
  const library = findRelevantEducationalContent({
    disciplineId: context.detectedSubjectId,
    disciplineName: context.detectedSubject,
    topic: context.detectedTopic,
    query: params.query,
  });

  const targetDisc =
    initialDisciplines.find((d) => d.id === context.detectedSubjectId) ||
    initialDisciplines[0];
  const targetTopicObj =
    targetDisc.modules
      .flatMap((m) => m.contents)
      .find((c) =>
        normalizeSemanticText(c.title).includes(
          normalizeSemanticText(context.detectedTopic)
        )
      ) || targetDisc.modules[0].contents[0];

  if (targetTopicObj) {
    await cacheStudiedContent(targetDisc, targetTopicObj, {
      incrementStudy: false,
    });
  }

  const reply = `${library.summary}\n\n${
    library.keyPoints?.length
      ? `Características e pontos essenciais:\n${library.keyPoints.map((kp, i) => `${i + 1}. ${kp}`).join("\n")}`
      : ""
  }`.trim();

  await cacheTutorInteraction({
    query: params.query,
    reply,
    whiteboardContent: library.whiteboardSnippet,
    detectedDisciplineId: context.detectedSubjectId,
    detectedDisciplineName: context.detectedSubject,
    detectedTopic: library.topic,
  });

  return {
    reply,
    whiteboardContent: library.whiteboardSnippet,
    detectedDisciplineId: context.detectedSubjectId,
    detectedDisciplineName: context.detectedSubject,
    detectedTopic: library.topic,
    cacheSource: "indexeddb-library",
  };
}

/**
 * Returns storage statistics for the IndexedDB Offline Cache
 */
export async function getOfflineStorageStats(): Promise<OfflineStorageStats> {
  const contents = await getAllCachedContents();
  const qas = await getAllCachedTutorQA();
  const logs = await getOfflineStudyLogs();

  const contentBytes = contents.reduce((acc, c) => acc + (c.sizeBytes || 2048), 0);
  const qaBytes = qas.reduce(
    (acc, q) => acc + new Blob([JSON.stringify(q)]).size,
    0
  );
  const disciplinesSet = new Set(contents.map((c) => c.disciplineName));

  return {
    cachedTopicsCount: contents.length,
    cachedQACount: qas.length,
    offlineLogsCount: logs.length,
    totalBytes: contentBytes + qaBytes,
    disciplinesCovered: Array.from(disciplinesSet),
    lastSyncedAt:
      (typeof window !== "undefined"
        ? localStorage.getItem("profeia_offline_last_sync")
        : null) || new Date().toISOString(),
  };
}

/**
 * Clears and re-seeds the IndexedDB database with essential baseline topics
 */
export async function clearOfflineCache(): Promise<void> {
  memoryContents.clear();
  memoryQA.clear();
  memoryLogs.clear();
  isSeeded = false;

  const db = await openOfflineDB();
  if (db) {
    await new Promise<void>((resolve) => {
      try {
        const tx = db.transaction(
          [STORE_CONTENTS, STORE_QA, STORE_LOGS],
          "readwrite"
        );
        tx.objectStore(STORE_CONTENTS).clear();
        tx.objectStore(STORE_QA).clear();
        tx.objectStore(STORE_LOGS).clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }
  await ensureInitialOfflineCacheSeeded();
  window.dispatchEvent(new CustomEvent("profeia-indexeddb-updated"));
}

/**
 * Seeds essential topics and Q&A pairs into IndexedDB on first run so the student
 * always has immediate offline access even before manually downloading chapters.
 */
export async function ensureInitialOfflineCacheSeeded(): Promise<void> {
  if (isSeeded) return;
  isSeeded = true;

  const db = await openOfflineDB();
  let existingCount = memoryContents.size;

  if (db) {
    existingCount = await new Promise<number>((resolve) => {
      try {
        const tx = db.transaction(STORE_CONTENTS, "readonly");
        const req = tx.objectStore(STORE_CONTENTS).count();
        req.onsuccess = () => resolve(req.result || 0);
        req.onerror = () => resolve(0);
      } catch {
        resolve(0);
      }
    });
  }

  if (existingCount > 0) return;

  // Seed first topic of each of the 15 official disciplines into IndexedDB
  for (const disc of initialDisciplines) {
    const firstTopic = disc.modules[0]?.contents[0];
    if (firstTopic) {
      await cacheStudiedContent(disc, firstTopic, {
        isPinnedOffline: true,
        incrementStudy: false,
      });
    }
  }

  // Seed high-frequency Q&A pairs for instant offline tutoring
  const starterQAs: Array<{
    query: string;
    reply: string;
    whiteboardContent: string;
    detectedDisciplineId: string;
    detectedDisciplineName: string;
    detectedTopic: string;
  }> = [
    {
      query: "Me explique de forma detalhada o que é uma célula",
      reply:
        "A célula é a unidade estrutural, funcional e genética fundamental de todos os seres vivos. Todos os organismos — desde bactérias unicelulares até plantas e animais pluricelulares — são constituídos por células.\n\n1. Estrutura Básica Universal:\n- Membrana Plasmática: bicamada fosfolipídica com permeabilidade seletiva que controla o que entra e sai da célula;\n- Citoplasma (Citosol): fluido gelatinoso onde ocorrem as reações químicas do metabolismo e onde estão as organelas;\n- Material Genético (DNA): armazena e transmite as instruções hereditárias para o funcionamento e divisão celular.\n\n2. Classificação e Características:\n- Células Procariontes (ex: bactérias): mais simples, não possuem núcleo delimitado por membrana (o DNA fica no nucleoide) e não têm organelas membranosas;\n- Células Eucariontes (ex: animais, plantas e fungos): possuem núcleo verdadeiro delimitado pela carioteca e organelas especializadas, como mitocôndrias (respiração celular e produção de ATP), retículo endoplasmático, complexo de Golgi, lisossomos e, nas células vegetais, parede celulósica e cloroplastos (onde ocorre a fotossíntese).",
      whiteboardContent:
        "=== CITOLOGIA: ESTRUTURA DA CÉLULA ===\nTríade Básica: Membrana Plasmática + Citoplasma + DNA\nProcariontes: Sem carioteca (Ex: Bactérias)\nEucariontes: Com núcleo (carioteca) e organelas (Mitocôndrias, Golgi, Retículo, Cloroplastos nas plantas)",
      detectedDisciplineId: "biologia",
      detectedDisciplineName: "Biologia",
      detectedTopic: "Citologia: Estrutura e Função da Célula",
    },
    {
      query: "Como resolver uma equação do segundo grau por Bhaskara?",
      reply:
        "Para resolver uma equação do 2º grau ax² + bx + c = 0 (com a ≠ 0):\n\n1. Identifique os coeficientes reais a, b e c.\n2. Calcule o discriminante Delta: Δ = b² - 4ac.\n   - Se Δ > 0: duas raízes reais e distintas.\n   - Se Δ = 0: duas raízes reais e iguais.\n   - Se Δ < 0: não possui raízes reais.\n3. Aplique a fórmula de Bhaskara: x = (-b ± √Δ) / (2a).\n\nDeseja resolver o exemplo x² - 5x + 6 = 0 passo a passo?",
      whiteboardContent:
        "=== EQUAÇÃO DO 2º GRAU (BHASKARA) ===\nForma Geral: ax² + bx + c = 0\nDiscriminante: Δ = b² - 4ac\nFórmula: x = (-b ± √Δ) / (2a)\nSoma: S = -b/a | Produto: P = c/a",
      detectedDisciplineId: "matematica",
      detectedDisciplineName: "Matemática",
      detectedTopic: "Equações do 2º Grau e Bhaskara",
    },
    {
      query: "Qual a diferença entre Chave Primária e Chave Estrangeira em Banco de Dados?",
      reply:
        "Na modelagem relacional de Banco de Dados:\n\n1. Chave Primária (Primary Key - PK): Identifica unicamente cada registro de uma tabela. É obrigatoriamente única (UNIQUE) e não nula (NOT NULL).\n2. Chave Estrangeira (Foreign Key - FK): É um atributo em uma tabela que referencia a Chave Primária de outra tabela, estabelecendo integridade referencial e permitindo junções (INNER JOIN).\n\nComo você estruturaria o relacionamento 1:N entre as tabelas Turma e Alunos?",
      whiteboardContent:
        "=== PK vs FK (MODELO RELACIONAL) ===\nPK (Primary Key): Identificador único da entidade (NOT NULL, UNIQUE).\nFK (Foreign Key): Referencia a PK de outra tabela (Integridade Referencial).\nComando SQL: FOREIGN KEY (turma_id) REFERENCES Turmas(id)",
      detectedDisciplineId: "banco-de-dados",
      detectedDisciplineName: "Banco de Dados",
      detectedTopic: "Chaves Primárias (PK) e Chaves Estrangeiras (FK)",
    },
    {
      query: "O que foi a Revolução Francesa e quais suas fases?",
      reply:
        "A Revolução Francesa (1789-1799) encerrou o absolutismo monárquico e os privilégios feudais do Antigo Regime na França, impulsionada pelo Iluminismo e pela revolta do Terceiro Estado.\n\nSuas três fases principais foram:\n1. Assembleia Nacional e Monarquia Constitucional (1789-1792): Queda da Bastilha e Declaração dos Direitos do Homem e do Cidadão.\n2. Convenção Nacional (1792-1795): Proclamação da República e hegemonia Jacobina liderada por Robespierre.\n3. Diretório (1795-1799): Retorno da alta burguesia Girondina, encerrado pelo Golpe do 18 Brumário de Napoleão Bonaparte.\n\nQual dessas fases você gostaria de aprofundar?",
      whiteboardContent:
        "=== REVOLUÇÃO FRANCESA (1789) ===\nSociedade Estamental: 1º Estado (Clero), 2º Estado (Nobreza), 3º Estado (Burguesia + Povo)\nFases: 1. Assembleia Nacional | 2. Convenção Jacobina | 3. Diretório Girondino",
      detectedDisciplineId: "historia",
      detectedDisciplineName: "História",
      detectedTopic: "A Revolução Francesa (1789): Da Queda da Bastilha ao Fim do Antigo Regime",
    },
    {
      query: "Como funciona a estrutura da redação dissertativo-argumentativa do ENEM?",
      reply:
        "A redação dissertativo-argumentativa estrutura-se em 4 parágrafos estratégicos:\n\n1. Introdução: Contextualização (repertório sociocultural) + Tema + Tese com dois argumentos (D1 e D2).\n2. Desenvolvimento 1 (D1): Tópico frasal + Repertório legitimado + Argumentação crítica do primeiro problema.\n3. Desenvolvimento 2 (D2): Tópico frasal + Repertório + Aprofundamento do segundo argumento.\n4. Conclusão: Proposta de Intervenção contendo os 5 elementos obrigatórios: Agente, Ação, Meio/Modo, Efeito e Detalhamento.\n\nSobre qual tema você gostaria de estruturar um parágrafo agora?",
      whiteboardContent:
        "=== REDAÇÃO NOTA 1000 ===\n§1 Introdução: Repertório + Tema + Tese (D1 + D2)\n§2 e §3 Desenvolvimentos: Tópico Frasal + Repertório + Crítica\n§4 Conclusão: Agente + Ação + Meio + Efeito + Detalhamento",
      detectedDisciplineId: "lingua-portuguesa-redacao",
      detectedDisciplineName: "Língua Portuguesa e Redação",
      detectedTopic: "A Estrutura do Texto Dissertativo-Argumentativo",
    },
    {
      query: "Qual a diferença entre Simple Present e Present Continuous em Língua Inglesa?",
      reply:
        "Em Língua Inglesa, a diferença central reside no aspecto temporal da ação:\n\n1. Simple Present: Expressa rotinas, hábitos e fatos universais. Na 3ª pessoa do singular (He/She/It), adiciona-se -s/-es/-ies ao verbo na afirmativa e usa-se o auxiliar 'Does' em perguntas e negações (Ex: 'She studies every afternoon').\n2. Present Continuous: Expressa ações que estão acontecendo no exato momento da fala, formado pelo verbo To Be (am/is/are) + verbo principal com -ing (Ex: 'She is studying right now').\n\nQuer praticar a transformação de uma frase afirmativa para interrogativa?",
      whiteboardContent:
        "=== SIMPLE PRESENT vs PRESENT CONTINUOUS ===\nSimple Present (Rotina/Fato): Subject + Verb (-s in He/She/It) | Aux: Do/Does\nPresent Continuous (Agora): Subject + am/is/are + Verb-ing",
      detectedDisciplineId: "lingua-inglesa",
      detectedDisciplineName: "Língua Inglesa",
      detectedTopic: "Diferenças Cruciais entre Simple Present e Present Continuous",
    },
  ];

  for (const qa of starterQAs) {
    await cacheTutorInteraction(qa);
  }
}
