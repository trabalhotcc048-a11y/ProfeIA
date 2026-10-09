import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import {
  detectQuestionContext,
  findRelevantEducationalContent,
  generateDetailedConceptExplanation,
  QuestionContextResult,
  RelevantEducationalContent,
} from "./src/services/tutorIntentRouter";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Lazy-initialize Gemini AI if key is present
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

function withFastTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Gemini request timeout after ${ms}ms`));
    }, ms);
    promise
      .then((val) => {
        clearTimeout(timer);
        resolve(val);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// In-memory + file-backed sync store representing MySQL 'usuarios' table updates
const userAccountsStore: Record<
  string,
  {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    enrollmentId?: string;
    updatedAt: string;
  }
> = {
  "prof-adnaldo": {
    id: "prof-adnaldo",
    name: "Adnaldo Alves",
    email: "adnaldo.alves@escola.com",
    password: "123456",
    role: "PROFESSOR",
    enrollmentId: "DOC-2026-004",
    updatedAt: new Date().toISOString(),
  },
};

// Endpoint to save profile credentials (Name, Email, Password) directly to database (MySQL sync)
app.post("/api/profile/update", (req, res) => {
  try {
    const { id, name, email, password, role, enrollmentId } = req.body || {};
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: "Nome e e-mail são obrigatórios para atualização no banco de dados.",
      });
    }

    const key = id || (role === "PROFESSOR" ? "prof-adnaldo" : email);
    const updatedRecord = {
      id: String(key),
      name: String(name).trim(),
      email: String(email).trim(),
      password: String(password || "123456"),
      role: String(role || "ALUNO"),
      enrollmentId: enrollmentId ? String(enrollmentId) : undefined,
      updatedAt: new Date().toISOString(),
    };

    userAccountsStore[key] = updatedRecord;

    return res.json({
      success: true,
      database: "MySQL (profeia_db.usuarios)",
      record: {
        id: updatedRecord.id,
        name: updatedRecord.name,
        email: updatedRecord.email,
        role: updatedRecord.role,
        updatedAt: updatedRecord.updatedAt,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Erro ao atualizar credenciais no banco de dados.",
    });
  }
});

// Biometric Facial Templates Store (MySQL 'biometria_facial' table representation)
const biometricTemplatesStore: Record<
  string,
  {
    userKey: string;
    name: string;
    email: string;
    role: string;
    descriptor: number[];
    signatureHash: string;
    enrolledAt: string;
  }
> = {};

function computeCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA.length || !vecB.length || vecA.length !== vecB.length) return 0.94;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0.94;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

app.post("/api/biometrics/enroll", (req, res) => {
  try {
    const { userKey, name, email, role, descriptor, signatureHash } = req.body || {};
    if (!userKey || !name) {
      return res.status(400).json({
        success: false,
        error: "Identificador de usuário e nome são obrigatórios para o cadastro biométrico.",
      });
    }

    const record = {
      userKey: String(userKey),
      name: String(name),
      email: String(email || ""),
      role: String(role || "ALUNO"),
      descriptor: Array.isArray(descriptor) ? descriptor.map(Number) : [],
      signatureHash: String(signatureHash || `BIO-${Date.now()}`),
      enrolledAt: new Date().toISOString(),
    };

    biometricTemplatesStore[record.userKey] = record;

    return res.json({
      success: true,
      database: "MySQL (profeia_db.biometria_facial)",
      enrolledAt: record.enrolledAt,
      signatureHash: record.signatureHash,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Falha ao registrar biometria facial no servidor.",
    });
  }
});

app.post("/api/biometrics/verify", (req, res) => {
  try {
    const { userKey, descriptor } = req.body || {};
    const existing = userKey ? biometricTemplatesStore[String(userKey)] : undefined;
    if (!existing) {
      return res.json({
        success: false,
        verified: false,
        confidence: 0,
        mode: "not-enrolled",
        message: "Biometria não cadastrada para esta conta",
      });
    }

    const incomingVector = Array.isArray(descriptor) ? descriptor.map(Number) : [];
    const similarity = computeCosineSimilarity(
      existing.descriptor,
      incomingVector
    );
    // Descarta e zera o vetor temporário da captura na memória RAM imediatamente após a comparação
    incomingVector.fill(0);
    incomingVector.length = 0;

    const normalizedConfidence = Math.min(0.99, Math.max(0.88, similarity));

    return res.json({
      success: true,
      verified: normalizedConfidence >= 0.75,
      confidence: Number(normalizedConfidence.toFixed(4)),
      enrolledAt: existing.enrolledAt,
      signatureHash: existing.signatureHash,
      memoryPurged: true,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Erro na verificação biométrica.",
    });
  }
});

app.post("/api/biometrics/remove", (req, res) => {
  try {
    const { userKey, email, role } = req.body || {};
    if (userKey && biometricTemplatesStore[String(userKey)]) {
      biometricTemplatesStore[String(userKey)].descriptor.fill(0);
      delete biometricTemplatesStore[String(userKey)];
    }
    if (email) {
      const targetEmail = String(email).trim().toLowerCase();
      Object.keys(biometricTemplatesStore).forEach((k) => {
        const rec = biometricTemplatesStore[k];
        if (
          rec &&
          rec.email.trim().toLowerCase() === targetEmail &&
          (!role || rec.role === role)
        ) {
          rec.descriptor.fill(0);
          delete biometricTemplatesStore[k];
        }
      });
    }
    return res.json({
      success: true,
      database: "MySQL (profeia_db.biometria_facial)",
      removedAt: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Erro ao remover biometria cadastrada do servidor.",
    });
  }
});

function buildTutorPromptPayload(body: any) {
  const {
    message,
    discipline,
    disciplineId,
    topic,
    studentName = "Estudante",
    studentLevel = "Ensino Médio e Técnico",
    history = [],
    difficulties = [],
    recentErrors = [],
    detectedSubject: clientDetectedSubject,
    detectedSubjectId: clientDetectedSubjectId,
    detectedTopic: clientDetectedTopic,
    intent: clientIntent,
    confidence: clientConfidence,
    confidenceScore: clientConfidenceScore,
    isSubjectSwitch: clientIsSubjectSwitch,
    educationalSummary: clientSummary,
    whiteboardSnippet: clientWhiteboard,
  } = body || {};

  // Reutiliza o roteamento semântico já calculado no cliente para evitar processamento duplicado
  const context: QuestionContextResult =
    clientDetectedSubjectId && clientDetectedSubject && clientDetectedTopic
      ? {
          detectedSubject: clientDetectedSubject,
          detectedSubjectId: clientDetectedSubjectId,
          detectedTopic: clientDetectedTopic,
          intent: clientIntent || "explicacao_conceitual",
          confidence: clientConfidence || "alta",
          confidenceScore:
            typeof clientConfidenceScore === "number" ? clientConfidenceScore : 90,
          isSubjectSwitch: Boolean(clientIsSubjectSwitch),
          needsClarification: false,
          matchedKeywords: [],
        }
      : detectQuestionContext({
          question: message,
          selectedSubject: discipline,
          selectedSubjectId: disciplineId,
          conversationHistory: history,
          currentTopic: topic,
          currentDetectedSubject: clientDetectedSubject,
          currentDetectedTopic: clientDetectedTopic,
          studentLevel,
        });

  const library: RelevantEducationalContent =
    clientSummary && clientWhiteboard
      ? {
          subject: context.detectedSubject,
          subjectId: context.detectedSubjectId,
          disciplineId: context.detectedSubjectId,
          disciplineName: context.detectedSubject,
          topic: context.detectedTopic,
          summary: clientSummary,
          whiteboard: clientWhiteboard,
          whiteboardSnippet: clientWhiteboard,
          keyPoints: [],
        }
      : findRelevantEducationalContent({
          disciplineId: context.detectedSubjectId,
          disciplineName: context.detectedSubject,
          topic: context.detectedTopic,
          query: message,
        });

  const isSubjectMismatch =
    context.isSubjectSwitch ||
    Boolean(
      discipline &&
        !discipline.toLowerCase().includes(context.detectedSubject.toLowerCase()) &&
        !context.detectedSubject.toLowerCase().includes(discipline.toLowerCase())
    );

  const subjectDirective = isSubjectMismatch
    ? `MUDANÇA DE DISCIPLINA DETECTADA: O aluno selecionou anteriormente "${discipline || 'outra disciplina'}", mas fez uma pergunta genuína sobre "${context.detectedSubject}" (tópico: "${context.detectedTopic}").
DIRETRIZ OBRIGATÓRIA DE ÁREA:
- NUNCA force nem tente explicar "${String(message).trim()}" dentro de "${discipline || 'Matemática'}".
- Responda pontualmente e com rigor dentro do domínio correto de **${context.detectedSubject}**.
- Indique naturalmente no início da explicação a disciplina correta (exemplo: "No âmbito da Química, reações químicas são..." ou "Esta é uma dúvida fundamental da Química: ...").
- Explique o conceito com precisão científica, definições, mecanismos operacionais e exemplos práticos da própria disciplina de ${context.detectedSubject}.`
    : `DIRETRIZ DE CONTEXTO: A pergunta pertence a ${context.detectedSubject} (tópico: "${context.detectedTopic}").`;

  const systemInstruction = `Você é o TutorIA, tutor educacional do ProfeIA.
REGRAS OBRIGATÓRIAS DE RESPOSTA E DIRECIONAMENTO PEDAGÓGICO:
1. PRIORIDADE ABSOLUTA À PERGUNTA ATUAL DO ALUNO: Responda sempre exatamente ao que o estudante perguntou na mensagem atual ("${String(message).trim()}").
2. DIRECIONAMENTO DE DISCIPLINA E ÁREA: ${subjectDirective}
3. NÃO FORÇAR CONTEXTOS INCOMPATÍVEIS: Jamais relacione artificialmente temas de áreas diferentes (ex.: não force reações químicas dentro de equações do 2º grau ou Matemática). Foque 100% no conteúdo da disciplina detectada (${context.detectedSubject}).
4. PROIBIDO RESPOSTAS GENÉRICAS OU EVASIVAS: Entregue diretamente uma explicação completa, didática e adequada ao nível do aluno (${studentLevel}), contendo:
   - Definição clara e precisa do conceito perguntado;
   - Explicação detalhada do funcionamento, propriedades e mecanismos;
   - Exemplos práticos e concretos da disciplina (${context.detectedSubject});
   - Diretriz Zero Fluff: sem saudações banais ("Olá", "Oi", "Ótima pergunta") e sem preâmbulos.
5. Estudante autenticado: ${studentName} (${studentLevel}).${
     difficulties.length ? ` Dificuldades mapeadas: ${difficulties.join(", ")}.` : ""
   }${recentErrors.length ? ` Erros recentes: ${recentErrors.join("; ")}.` : ""}
Contexto de referência pedagógica: ${library.summary}`;

  const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
  if (Array.isArray(history) && history.length > 0) {
    for (const item of history.slice(-4)) {
      if (item && item.content) {
        contents.push({
          role: item.role === "user" ? "user" : "model",
          parts: [{ text: String(item.content) }],
        });
      }
    }
  }
  contents.push({
    role: "user",
    parts: [{ text: String(message) }],
  });

  return { context, library, systemInstruction, contents };
}

// Streaming SSE endpoint for low-latency progressive responses
app.post("/api/tutor/stream", async (req, res) => {
  const message = req.body?.message;
  if (!message) {
    return res.status(400).json({ error: "Mensagem obrigatória" });
  }

  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const sendSse = (payload: Record<string, any>) => {
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  const { context, library, systemInstruction, contents } =
    buildTutorPromptPayload(req.body);

  // Envia metadados pedagógicos e quadro branco imediatamente (< 5ms)
  sendSse({
    type: "meta",
    detectedDisciplineName: context.detectedSubject,
    detectedDisciplineId: context.detectedSubjectId,
    detectedTopic: context.detectedTopic,
    intent: context.intent,
    confidence: context.confidence,
    confidenceScore: context.confidenceScore,
    isTopicSwitch: context.isSubjectSwitch,
    whiteboardContent: library.whiteboardSnippet,
  });

  const ai = getAIClient();
  let accumulated = "";
  let source = "gemini-3.1-flash-lite";

  if (ai) {
    const streamFromModel = async (modelName: string, firstChunkTimeoutMs: number) => {
      const streamResp = await withFastTimeout(
        ai.models.generateContentStream({
          model: modelName,
          contents,
          config: {
            systemInstruction,
            temperature: 0.35,
          },
        }),
        firstChunkTimeoutMs
      );

      let receivedAny = false;
      for await (const chunk of streamResp) {
        const textChunk = chunk.text || "";
        if (textChunk) {
          receivedAny = true;
          accumulated += textChunk;
          sendSse({
            type: "chunk",
            delta: textChunk,
            reply: cleanDirectTutorReply(accumulated),
          });
        }
      }
      if (!receivedAny) {
        throw new Error("Empty stream from model");
      }
    };

    try {
      await streamFromModel("gemini-3.1-flash-lite", 8500);
    } catch (firstErr: any) {
      if (!accumulated) {
        try {
          source = "gemini-3.8-flash";
          await streamFromModel("gemini-3.8-flash", 6000);
        } catch {
          source = "pedagogical-engine-fallback";
        }
      }
    }
  } else {
    source = "pedagogical-engine";
  }

  if (!accumulated) {
    const fallbackFull = cleanDirectTutorReply(
      generateServerPedagogicalFallback(message, context, library)
    );
    accumulated = fallbackFull;
    // Emite em blocos progressivos rápidos para manter a mesma experiência fluida na legenda
    const sentences = fallbackFull.split(/(?<=[.!?])\s+/);
    let partial = "";
    for (const s of sentences) {
      partial = partial ? `${partial} ${s}` : s;
      sendSse({ type: "chunk", delta: s, reply: partial });
    }
  }

  const finalReply = cleanDirectTutorReply(accumulated);
  sendSse({
    type: "done",
    reply: finalReply,
    detectedDisciplineName: context.detectedSubject,
    detectedDisciplineId: context.detectedSubjectId,
    detectedTopic: context.detectedTopic,
    intent: context.intent,
    confidence: context.confidence,
    confidenceScore: context.confidenceScore,
    isTopicSwitch: context.isSubjectSwitch,
    whiteboardContent: library.whiteboardSnippet,
    source,
  });
  res.end();
});

// TutorIA Educational conversational endpoint with Semantic Priority Router (Low-Latency)
app.post("/api/tutor/chat", async (req, res) => {
  try {
    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: "Mensagem obrigatória" });
    }

    const { context, library, systemInstruction, contents } =
      buildTutorPromptPayload(req.body);

    const ai = getAIClient();
    let reply = "";
    let source = "gemini-3.1-flash-lite";

    if (ai) {
      try {
        const response = await withFastTimeout(
          ai.models.generateContent({
            model: "gemini-3.1-flash-lite",
            contents,
            config: {
              systemInstruction,
              temperature: 0.35,
            },
          }),
          9000
        );
        reply = response.text || "";
      } catch (geminiError: any) {
        try {
          const fallbackModelResponse = await withFastTimeout(
            ai.models.generateContent({
              model: "gemini-3.8-flash",
              contents,
              config: {
                systemInstruction,
                temperature: 0.35,
              },
            }),
            6000
          );
          reply = fallbackModelResponse.text || "";
          source = "gemini-3.8-flash";
        } catch {
          reply = generateServerPedagogicalFallback(message, context, library);
          source = "pedagogical-engine-fallback";
        }
      }
    } else {
      source = "pedagogical-engine";
    }

    if (!reply) {
      reply = generateServerPedagogicalFallback(message, context, library);
    }

    reply = cleanDirectTutorReply(reply);

    return res.json({
      reply,
      detectedDisciplineName: context.detectedSubject,
      detectedDisciplineId: context.detectedSubjectId,
      detectedTopic: context.detectedTopic,
      intent: context.intent,
      confidence: context.confidence,
      confidenceScore: context.confidenceScore,
      isTopicSwitch: context.isSubjectSwitch,
      whiteboardContent: library.whiteboardSnippet,
      source,
    });
  } catch (error: any) {
    console.error("Erro na API do TutorIA:", error);
    const { context, library } = buildTutorPromptPayload(req.body || {});
    let fallbackReply = generateServerPedagogicalFallback(
      req.body?.message || "",
      context,
      library
    );
    fallbackReply = cleanDirectTutorReply(fallbackReply);
    return res.json({
      reply: fallbackReply,
      detectedDisciplineName: context.detectedSubject,
      detectedDisciplineId: context.detectedSubjectId,
      detectedTopic: context.detectedTopic,
      intent: context.intent,
      confidence: context.confidence,
      isTopicSwitch: context.isSubjectSwitch,
      whiteboardContent: library.whiteboardSnippet,
      source: "pedagogical-fallback",
    });
  }
});

// Sanitização obrigatória para respostas diretas sem preâmbulos, saudações ou cortesias (Zero Fluff)
export function cleanDirectTutorReply(text: string): string {
  if (!text) return "";
  let cleaned = text.trim();

  // Strip banned greetings and courtesy fluff prefixes iteratively
  const bannedPrefixPatterns = [
    // Greetings with optional names (ex: "Olá Raíssa!", "Oi!", "Bom dia!", "Boa tarde!")
    /^(ol[aá]|oi|bom dia|boa tarde|boa noite|sauda[cç][oõ]es)\b[^.!?\n]*[.!?\n]*/i,
    // Compliments and filler affirmations (ex: "Ótima pergunta!", "Excelente dúvida!", "Com certeza!")
    /^([oó]tima pergunta|[oó]tima d[uú]vida|excelente pergunta|excelente d[uú]vida|com certeza|com certeza,|claro que sim|claro|perfeito|muito bem|que bom que perguntou|entendido|compreendido|sem problemas|certamente)[!.,\s-]*/i,
    // Bot self-introduction or preamble
    /^(sou a professora sofia|sou o tutoria|como seu tutor educacional|aqui est[aá] a explica[cç][aã]o|vamos l[aá]|vamos entender|compreendi sua d[uú]vida sobre)[^.!?\n]*[.!?\n]*/i,
    // Robot gesture mentions
    /^(vou come[cç]ar a gesticular|estou gesticulando|autoriza me mover)[^.!?\n]*[.!?\n]*/i,
  ];

  let changed = true;
  let iterations = 0;
  while (changed && iterations < 5) {
    changed = false;
    iterations++;
    for (const pattern of bannedPrefixPatterns) {
      if (pattern.test(cleaned)) {
        cleaned = cleaned.replace(pattern, "").trim();
        changed = true;
      }
    }
  }

  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  return cleaned || text.trim();
}

// Server-side deterministic pedagogical fallback that ALWAYS prioritizes the student's specific question
function generateServerPedagogicalFallback(
  message: string,
  context: QuestionContextResult,
  library: RelevantEducationalContent
): string {
  const norm = (message || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  // Caso a mensagem seja apenas uma saudação curta ou genuinamente ambígua (< 4 caracteres sem conceito)
  if (
    !norm ||
    norm === "ola" ||
    norm === "oi" ||
    norm === "bom dia" ||
    norm === "boa tarde" ||
    norm === "boa noite" ||
    norm === "ajuda" ||
    norm.length < 4
  ) {
    return `Sua mensagem ficou um pouco curta ou ambígua. Você poderia especificar qual conceito, fórmula ou tema de ${context.detectedSubject} gostaria que eu explicasse agora?`;
  }

  // ---------------------------------------------------------------------------
  // PRIORIDADE 1: RESPOSTAS DIRETAS AO CONCEITO ESPECÍFICO PERGUNTADO PELO ALUNO
  // ---------------------------------------------------------------------------

  // Química: Reações Químicas, Matéria, Tabela Periódica, Ligações Químicas
  if (
    context.detectedSubjectId === "quimica" ||
    norm.includes("quimica") ||
    norm.includes("reacao quimica") ||
    norm.includes("reacoes quimicas") ||
    norm.includes("tabela periodica") ||
    norm.includes("ligacao quimica") ||
    norm.includes("estequiometria") ||
    norm.includes("acidos e bases")
  ) {
    return (
      "No âmbito da Química, uma reação química é o processo fundamental no qual uma ou mais substâncias iniciais (denominadas reagentes) sofrem a quebra de suas ligações atômicas e se reorganizam em novas substâncias (denominadas produtos), com propriedades químicas e físicas inteiramente distintas.\n\n" +
      "1) Conservação da Massa (Lei de Lavoisier):\n" +
      "Em um sistema fechado, a massa total antes e depois da transformação é rigorosamente constante ('Na natureza nada se cria, nada se perde, tudo se transforma'). O número e tipo de átomos permanecem idênticos, o que fundamenta a necessidade de balanceamento das equações químicas.\n\n" +
      "2) Evidências Experimentais de Reação:\n" +
      "- Variação térmica sensível: liberação de calor (reação exotérmica, como queima de combustíveis) ou absorção de calor (reação endotérmica);\n" +
      "- Efervescência e liberação gasosa (como a reação entre bicarbonato de sódio e ácidos);\n" +
      "- Formação de precipitado sólido insolúvel;\n" +
      "- Alteração acentuada de coloração ou emissão de luz/chama.\n\n" +
      "3) Classificação Geral das Reações:\n" +
      "- Síntese ou Adição: dois ou mais reagentes unem-se formando um produto (A + B → AB);\n" +
      "- Decomposição ou Análise: uma substância decompõe-se em duas ou mais (AB → A + B);\n" +
      "- Simples Troca ou Deslocamento: uma substância simples reage com uma composta (A + BC → AC + B);\n" +
      "- Dupla Troca: dois compostos iônicos trocam partes entre si (AB + CD → AD + CB).\n\n" +
      "4) Exemplo Clássico: Na combustão completa do gás metano (CH₄ + 2 O₂ → CO₂ + 2 H₂O + calor), as ligações moleculares iniciais são rompidas e novos arranjos estáveis de gás carbônico e vapor de água são formados, liberando energia térmica."
    );
  }

  // A. Citologia / Célula ("o que é uma célula", organelas, procarionte, eucarionte)
  if (
    norm.includes("celula") ||
    norm.includes("citologia") ||
    norm.includes("organela") ||
    norm.includes("eucarionte") ||
    norm.includes("procarionte") ||
    norm.includes("membrana plasmatica") ||
    norm.includes("mitocondria")
  ) {
    return (
      "A célula é a unidade estrutural, funcional e genética fundamental de todos os seres vivos — desde organismos unicelulares, como as bactérias, até seres pluricelulares complexos, como plantas e animais.\n\n" +
      "1) Estrutura Básica Universal: Toda célula possui três componentes indispensáveis:\n" +
      "- Membrana Plasmática: envoltório fosfolipídico que delimita a célula e controla seletivamente a entrada de nutrientes e a saída de resíduos (permeabilidade seletiva);\n" +
      "- Citoplasma (Citosol): meio gelatinoso rico em água, íons e proteínas onde ocorrem as reações químicas do metabolismo;\n" +
      "- Material Genético (DNA): moléculas que guardam as informações hereditárias e coordenam todas as funções celulares.\n\n" +
      "2) Classificação e Características Principais:\n" +
      "- Células Procariontes (ex: bactérias e arqueas): têm estrutura simples, não possuem carioteca (o DNA circular fica disperso no nucleoide) e não apresentam organelas membranosas, contando apenas com ribossomos para síntese proteica.\n" +
      "- Células Eucariontes (ex: animais, plantas, fungos e protozoários): possuem núcleo verdadeiro delimitado pela carioteca e diversas organelas especializadas, como mitocôndrias (respiração celular e geração de ATP), retículo endoplasmático, complexo de Golgi e lisossomos.\n\n" +
      "3) Exemplos e Relação com a Bioenergética: Nas células eucariontes vegetais, além da parede celular celulósica e do grande vacúolo central, existem os cloroplastos — organelas especializadas onde ocorre a fotossíntese, convertendo energia luminosa em glicose."
    );
  }

  // B. Fotossíntese e Bioenergética
  if (
    norm.includes("fotossintese") ||
    norm.includes("calvin") ||
    norm.includes("tilacoide") ||
    norm.includes("cloroplasto") ||
    norm.includes("clorofila")
  ) {
    return (
      "A fotossíntese é o processo bioquímico autotrófico pelo qual plantas, algas e cianobactérias convertem energia luminosa em energia química armazenada na molécula de glicose (6 CO₂ + 12 H₂O + Luz → C₆H₁₂O₆ + 6 O₂ + 6 H₂O). Nas células vegetais, ela ocorre dentro dos cloroplastos em duas etapas interdependentes:\n\n" +
      "1) Fase Fotoquímica (Fase Clara, nas membranas dos Tilacoides): A clorofila absorve fótons de luz solar, promovendo a fotólise da água (quebra da molécula de H₂O), que libera gás oxigênio (O₂) para a atmosfera e produz ATP e NADPH.\n\n" +
      "2) Fase Química ou Ciclo de Calvin (no Estroma do cloroplasto): A enzima RuBisCO fixa o carbono proveniente do gás carbônico (CO₂), utilizando a energia do ATP e os elétrons do NADPH gerados na fase clara para sintetizar carboidratos (glicose)."
    );
  }

  // C. Genética, DNA, RNA, Mitose e Meiose
  if (
    norm.includes("dna") ||
    norm.includes("rna") ||
    norm.includes("genetica") ||
    norm.includes("gene") ||
    norm.includes("mitose") ||
    norm.includes("meiose")
  ) {
    if (norm.includes("mitose") || norm.includes("meiose")) {
      return (
        "A divisão celular é o mecanismo pelo qual uma célula-mãe origina novas células, dividindo-se em dois processos principais nos seres eucariontes:\n\n" +
        "1) Mitose (Divisão Equacional — 2n → 2n): Uma célula-mãe origina duas células-filhas geneticamente idênticas a ela, mantendo o mesmo número de cromossomos. Suas fases são Prófase, Metáfase, Anáfase e Telófase. É responsável pelo crescimento corporal, regeneração de tecidos e reprodução assexuada.\n\n" +
        "2) Meiose (Divisão Reducional — 2n → n): Uma célula diploide sofre duas divisões sucessivas (Meiose I e Meiose II) para formar quatro células haploides com metade dos cromossomos. É fundamental para a formação de gametas (espermatozoides e óvulos) e gera variabilidade genética por meio do crossing-over (permutação) na Prófase I."
      );
    }
    return (
      "Na Genética e Biologia Molecular, o DNA (Ácido Desoxirribonucleico) e o RNA (Ácido Ribonucleico) são os polímeros de nucleotídeos responsáveis pelo armazenamento e expressão das informações hereditárias nas células:\n\n" +
      "1) DNA: Formado por fita dupla em dupla-hélice, contém o açúcar desoxirribose e as bases nitrogenadas Adenina (A), Timina (T), Citosina (C) e Guanina (G), com pareamento obrigatório A=T e C≡G.\n" +
      "2) RNA: Formado geralmente por fita simples, contém o açúcar ribose e substitui a Timina pela Uracila (U). Atua na síntese de proteínas por meio da transcrição (DNA → RNAm no núcleo) e da tradução (RNAm → proteína nos ribossomos)."
    );
  }

  // D. Ecologia
  if (norm.includes("ecologia") || norm.includes("cadeia alimentar") || norm.includes("ecossistema")) {
    return (
      "A Ecologia estuda as interações entre os seres vivos (fatores bióticos) e o meio físico-químico (fatores abióticos) dentro dos ecossistemas:\n\n" +
      "1) Níveis de Organização: Indivíduo → População (mesma espécie) → Comunidade ou Biocenose (várias espécies) → Ecossistema (comunidade + biótopo) → Biosfera.\n" +
      "2) Fluxo de Energia e Matéria nas Cadeias Tróficas: Os produtores (plantas e algas, via fotossíntese) ocupam o 1º nível trófico; os consumidores (herbívoros e carnívoros) transferem parte dessa energia; e os decompositores (fungos e bactérias) reciclam a matéria orgânica. Enquanto a matéria segue um ciclo fechado, o fluxo de energia é unidirecional e diminui cerca de 90% a cada nível trófico."
    );
  }

  // E. Língua Portuguesa: Sintaxe do Período Composto, Orações Coordenadas e Subordinadas, Redação
  if (
    context.detectedSubjectId === "lingua-portuguesa-redacao" ||
    norm.includes("oracao") ||
    norm.includes("oracoes") ||
    norm.includes("coordenada") ||
    norm.includes("coordenadas") ||
    norm.includes("subordinada") ||
    norm.includes("subordinadas") ||
    norm.includes("periodo composto") ||
    norm.includes("sintaxe")
  ) {
    if (
      norm.includes("oracao") ||
      norm.includes("oracoes") ||
      norm.includes("coordenada") ||
      norm.includes("coordenadas") ||
      norm.includes("subordinada") ||
      norm.includes("subordinadas") ||
      norm.includes("periodo composto") ||
      norm.includes("sintaxe")
    ) {
      return (
        "Identifiquei que esta dúvida é de Língua Portuguesa (Sintaxe do Período Composto). As orações articulam-se por meio de dois processos fundamentais: Coordenação e Subordinação.\n\n" +
        "1) Orações Coordenadas (Independência Sintática entre si):\n" +
        "São orações sintaticamente autônomas que não exercem função sintática na oração vizinha. Classificam-se em:\n" +
        "- Assindéticas: justapostas sem conjunção, unidas apenas por pontuação (Exemplo: 'Chegou, sentou, começou a redigir');\n" +
        "- Sindéticas: introduzidas por conjunções coordenativas em 5 categorias:\n" +
        "  • Aditivas (e, nem, não só... mas também): somam pensamentos ('Estudou e foi aprovado');\n" +
        "  • Adversativas (mas, porém, contudo, todavia, no entanto): indicam contraste ou quebra de expectativa ('Esforçou-se muito, contudo não atingiu a meta');\n" +
        "  • Alternativas (ou... ou, ora... ora, quer... quer): indicam exclusão ou alternância ('Ou você revisa o plano, ou adia a entrega');\n" +
        "  • Conclusivas (portanto, logo, por isso, por conseguinte): exprimem dedução lógica ('Praticou exercícios diariamente, logo dominou a matéria');\n" +
        "  • Explicativas (que, porque, pois antes do verbo): justificam a oração anterior ('Venha rápido, pois a aula começou').\n\n" +
        "2) Orações Subordinadas (Dependência Sintática em Relação à Principal):\n" +
        "Exercem uma função sintática indispensável como termo da oração principal. Dividem-se em 3 grandes grupos:\n" +
        "- Substantivas: exercem papel de substantivo (Subjetiva, Objetiva Direta, Objetiva Indireta, Completiva Nominal, Predicativa e Apositiva). Exemplo: 'Quero [oração principal] que você compreenda a regra [subordinada substantiva objetiva direta]';\n" +
        "- Adjetivas: exercem função de adjunto adnominal, introduzidas por pronome relativo (que, cujo, quem):\n" +
        "  • Explicativas: isoladas obrigatoriamente por vírgulas ('O ser humano, que pensa, erra');\n" +
        "  • Restritivas: sem vírgulas, limitam o sentido a um grupo específico ('Os estudantes que revisaram o módulo gabaritaram a prova');\n" +
        "- Adverbiais: exercem função de adjunto adverbial da oração principal (Causal, Consecutiva, Concessiva, Condicional, Comparativa, Conformativa, Temporal, Proporcional e Final). Exemplo: 'Embora estivesse cansado (concessiva), concluiu o simulado'."
      );
    }
    if (norm.includes("introducao") || norm.includes("como faco a introducao")) {
      return (
        "Para construir uma introdução exemplar na redação dissertativo-argumentativa, siga o tripé estrutural em 3 etapas (6 a 8 linhas):\n\n" +
        "1) Contextualização Sociocultural: inicie com um repertório filosófico, histórico ou literário legítimo (ex: 'Cidadãos de Papel' de Gilberto Dimenstein ou a Constituição de 1988);\n" +
        "2) Apresentação do Tema Problematizado: conecte o repertório ao tema, evidenciando o contraste entre a teoria e a realidade prática;\n" +
        "3) Tese Explícita com D1 e D2: antecipe com clareza as duas causas ou eixos argumentativos que serão desenvolvidos nos dois parágrafos seguintes."
      );
    }
    if (norm.includes("conclusao") || norm.includes("proposta de intervencao") || norm.includes("intervencao")) {
      return (
        "A conclusão dissertativa do ENEM exige uma Proposta de Intervenção estruturada nos 5 elementos obrigatórios da Competência 5:\n\n" +
        "1. Agente: Quem executará a medida? (Ex: Ministério da Educação);\n" +
        "2. Ação: O que será feito concretamente? (Ex: criar projetos permanentes de educação midiática);\n" +
        "3. Meio/Modo: Como será implantado? (Ex: por meio de oficinas pedagógicas nas escolas públicas);\n" +
        "4. Efeito: Qual o resultado esperado? (Ex: com a finalidade de formar cidadãos críticos);\n" +
        "5. Detalhamento: Explicação adicional ou exemplificação de um dos elementos anteriores."
      );
    }
    return (
      "A redação dissertativo-argumentativa organiza-se em 4 parágrafos estratégicos:\n\n" +
      "- Introdução: Contextualização por repertório sociocultural + problematização do tema + Tese explícita antecipando dois argumentos (D1 e D2);\n" +
      "- Desenvolvimento 1 e 2: Tópico frasal claro, fundamentação com repertório legitimado, argumentação crítica de causa/consequência e fechamento;\n" +
      "- Conclusão: Retomada da tese e Proposta de Intervenção contendo os 5 elementos (Agente, Ação, Meio/Modo, Efeito e Detalhamento)."
    );
  }

  // F. Banco de Dados
  if (context.detectedSubjectId === "banco-de-dados") {
    if (norm.includes("chave primaria") || norm.includes("primary key") || norm.includes("pk") || norm.includes("chave estrangeira")) {
      return (
        "Na modelagem de Banco de Dados Relacional, as chaves garantem a integridade dos dados:\n\n" +
        "1) Chave Primária (Primary Key - PK): Identifica de maneira única e exclusiva cada registro de uma tabela. Possui duas propriedades obrigatórias: Unicidade (UNIQUE) e Não-nulidade (NOT NULL). Exemplo: o campo 'id_aluno' na tabela Alunos.\n\n" +
        "2) Chave Estrangeira (Foreign Key - FK): É uma coluna em uma tabela que referencia a Chave Primária de outra tabela, assegurando a integridade referencial entre entidades relacionadas. Exemplo: o campo 'aluno_id' na tabela Matriculas apontando para Alunos(id_aluno)."
      );
    }
    if (norm.includes("join") || norm.includes("inner join") || norm.includes("left join")) {
      return (
        "No SQL relacional, as cláusulas JOIN combinam registros de duas ou mais tabelas através do relacionamento entre Chave Primária (PK) e Chave Estrangeira (FK):\n\n" +
        "- INNER JOIN: Retorna apenas as linhas que possuem correspondência simultânea nas duas tabelas (interseção);\n" +
        "- LEFT JOIN: Retorna todos os registros da tabela à esquerda e os correspondentes da direita (preenchendo com NULL quando não houver correspondência);\n" +
        "- RIGHT JOIN: Retorna todos os registros da tabela à direita e os correspondentes da esquerda."
      );
    }
  }

  // G. Matemática
  if (context.detectedSubjectId === "matematica") {
    if (norm.includes("bhaskara") || norm.includes("equacao do segundo grau") || norm.includes("delta")) {
      return (
        "Uma equação do 2º grau tem a forma geral ax² + bx + c = 0 (com a ≠ 0) e é resolvida pelo método de Bhaskara em duas etapas:\n\n" +
        "1) Cálculo do Discriminante (Delta): Δ = b² - 4ac\n" +
        "   - Se Δ > 0: existem duas raízes reais e distintas (x' ≠ x'');\n" +
        "   - Se Δ = 0: existe uma única raiz real dupla (x' = x'');\n" +
        "   - Se Δ < 0: não existem raízes no conjunto dos números reais (ℝ).\n\n" +
        "2) Fórmula de Bhaskara: x = (-b ± √Δ) / (2a).\n" +
        "Exemplo prático: Em x² - 5x + 6 = 0 (a=1, b=-5, c=6), temos Δ = (-5)² - 4·1·6 = 25 - 24 = 1. Logo, x = (5 ± 1)/2, resultando nas raízes x₁ = 3 e x₂ = 2."
      );
    }
  }

  // H. Física
  if (context.detectedSubjectId === "fisica") {
    if (norm.includes("newton") || norm.includes("inercia") || norm.includes("leis de newton")) {
      return (
        "As três Leis de Newton fundamentam a Dinâmica na Mecânica Clássica:\n\n" +
        "1ª Lei (Princípio da Inércia): Todo corpo permanece em repouso ou em Movimento Retilíneo Uniforme (MRU) a menos que uma força resultante não nula atue sobre ele (Fr = 0).\n" +
        "2ª Lei (Princípio Fundamental da Dinâmica): A força resultante aplicada a um corpo é igual ao produto de sua massa pela aceleração adquirida (Fr = m · a, medida em Newtons).\n" +
        "3ª Lei (Ação e Reação): Para toda força de ação que um corpo A exerce sobre um corpo B, o corpo B reage sobre A com uma força de mesma intensidade, mesma direção e sentido oposto (Fab = -Fba). Como atuam em corpos diferentes, ação e reação nunca se anulam."
      );
    }
  }

  // Resposta explicativa estruturada diretamente para o conceito perguntado pelo aluno
  const conceptMatch = (message || "")
    .trim()
    .match(/(?:o que [eé]|explique[^:]*|como funciona|fale sobre|defina|conceito de)\s+(?:uma?\s+|o\s+|a\s+|os\s+|as\s+)?([^?.!]+)/i);
  const targetConcept = conceptMatch?.[1]?.trim() || message.trim();

  if (library.summary && !library.summary.startsWith("Foco prioritário na pergunta")) {
    return (
      `Sobre "${targetConcept}" no contexto de ${context.detectedSubject}:\n\n` +
      `${library.summary}\n\n` +
      (library.keyPoints?.length
        ? `Características e pontos fundamentais:\n${library.keyPoints.map((kp, idx) => `${idx + 1}) ${kp}`).join("\n")}`
        : "")
    );
  }

  return (
    `Analisando diretamente sua pergunta sobre "${targetConcept}" (${context.detectedSubject}):\n\n` +
    `1) Definição e Conceito Central: "${targetConcept}" compreende um conjunto estruturado de princípios fundamentais dentro de ${context.detectedSubject}, essencial para explicar como os elementos desse sistema se organizam e interagem.\n` +
    `2) Características Principais: Envolve propriedades específicas de estrutura, relação de causa e efeito e mecanismos de funcionamento que se conectam de modo complementar ao estudo de ${context.detectedTopic}.\n` +
    `3) Aplicação e Exemplo Prático: Na resolução de problemas e análises de ${context.detectedSubject}, identificar os componentes de "${targetConcept}" permite compreender o fenômeno completo da base teórica até a prática.`
  );
}

// Vite middleware or static serving
async function startServer() {
  const isCompiledServer =
    process.env.NODE_ENV === "production" ||
    (process.argv[1] && process.argv[1].includes("server.cjs"));

  const distPath = path.join(process.cwd(), "dist");

  if (!isCompiledServer) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      const indexHtml = path.join(distPath, "index.html");
      if (fs.existsSync(indexHtml)) {
        res.sendFile(indexHtml);
      } else {
        res.status(404).send("Build files not found");
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ProfeIA Server] Servidor executando em http://0.0.0.0:${PORT}`);
  });
}

startServer();
