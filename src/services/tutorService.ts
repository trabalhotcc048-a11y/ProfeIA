import { TutorSessionSummary, FlashcardItem } from "../types";
import {
  detectQuestionContext,
  findRelevantEducationalContent,
  QuestionContextResult,
  RelevantEducationalContent,
} from "./tutorIntentRouter";
import {
  isOfflineTutorModeEnabled,
  resolveOfflineTutorQuery,
  cacheTutorInteraction,
} from "./offlineTutorDB";

export interface TutorStreamCallbacks {
  onMeta?: (meta: {
    detectedDisciplineName: string;
    detectedDisciplineId: string;
    detectedTopic: string;
    intent?: string;
    confidence?: "alta" | "media" | "baixa";
    confidenceScore?: number;
    isTopicSwitch?: boolean;
    whiteboardContent?: string;
  }) => void;
  onChunk?: (partialReply: string, delta: string) => void;
}

export interface ProcessTutorMessageParams {
  message: string;
  selectedSubject?: string;
  selectedSubjectId?: string;
  currentTopic?: string;
  currentDetectedSubject?: string;
  currentDetectedTopic?: string;
  conversationHistory?: Array<{
    role: string;
    content: string;
    detectedSubject?: string;
    detectedTopic?: string;
  }>;
  studentName?: string;
  studentLevel?: string;
  difficulties?: string[];
  recentErrors?: string[];
  inputMode?: "text" | "voice";
  streamCallbacks?: TutorStreamCallbacks;
}

export interface TutorResponse {
  reply: string;
  whiteboardContent?: string;
  detectedDisciplineName: string;
  detectedDisciplineId: string;
  detectedTopic: string;
  intent?: string;
  confidence?: "alta" | "media" | "baixa";
  confidenceScore?: number;
  isTopicSwitch?: boolean;
  needsClarification?: boolean;
  source?: string;
}

export interface AskTutorPayload {
  message: string;
  discipline?: string;
  topic?: string;
  studentName?: string;
  difficulties?: string[];
  recentErrors?: string[];
  history?: Array<{ role: string; content: string }>;
}

/**
 * PROCESS TUTOR MESSAGE (CÉREBRO ÚNICO PARA TEXTO, VOZ E TUTORIA OFFLINE INDEXEDDB)
 * 
 * Fluxo Obrigatório:
 * MENSAGEM DO ALUNO (digitada ou transcrita da fala)
 * ↓
 * VERIFICAÇÃO DE CONEXÃO / MODO TUTORIA OFFLINE (IndexedDB)
 * ↓
 * ANÁLISE DA INTENÇÃO E DETECÇÃO DA DISCIPLINA / TÓPICO (detectQuestionContext)
 * Ordem de Prioridade:
 * 1. Pergunta atual do aluno
 * 2. Contexto recente da conversa
 * 3. Tópico atual
 * 4. Disciplina selecionada (último fallback)
 * ↓
 * CONSULTA À BIBLIOTECA EDUCACIONAL / CACHE INDEXEDDB
 * ↓
 * MONTAGEM DO CONTEXTO PEDAGÓGICO
 * ↓
 * GERAÇÃO DA RESPOSTA (Servidor Gemini / Cache Local IndexedDB / Motor Pedagógico)
 * ↓
 * ATUALIZAÇÃO DO CACHE INDEXEDDB E DO CONTEXTO DA CONVERSA
 */
export async function processTutorMessage(
  params: ProcessTutorMessageParams
): Promise<TutorResponse> {
  const query = (params.message || "").trim();

  // 1. Semantic router with 4-level priority rules
  const context: QuestionContextResult = detectQuestionContext({
    question: query,
    selectedSubject: params.selectedSubject,
    selectedSubjectId: params.selectedSubjectId,
    conversationHistory: params.conversationHistory,
    currentTopic: params.currentTopic,
    currentDetectedSubject: params.currentDetectedSubject,
    currentDetectedTopic: params.currentDetectedTopic,
    studentLevel: params.studentLevel,
  });

  // 2. If Offline Tutoring Mode is enabled or browser is offline, serve directly from IndexedDB
  if (isOfflineTutorModeEnabled()) {
    const offlineResult = await resolveOfflineTutorQuery({
      query,
      selectedSubject: params.selectedSubject,
      selectedSubjectId: params.selectedSubjectId,
      currentTopic: params.currentTopic,
      conversationHistory: params.conversationHistory,
    });

    const cleanedOffline = cleanDirectTutorReply(offlineResult.reply);
    params.streamCallbacks?.onMeta?.({
      detectedDisciplineName: offlineResult.detectedDisciplineName,
      detectedDisciplineId: offlineResult.detectedDisciplineId,
      detectedTopic: offlineResult.detectedTopic,
      intent: context.intent,
      confidence: context.confidence,
      confidenceScore: context.confidenceScore,
      isTopicSwitch: context.isSubjectSwitch,
      whiteboardContent: offlineResult.whiteboardContent,
    });
    params.streamCallbacks?.onChunk?.(cleanedOffline, cleanedOffline);

    return {
      reply: cleanedOffline,
      whiteboardContent: offlineResult.whiteboardContent,
      detectedDisciplineName: offlineResult.detectedDisciplineName,
      detectedDisciplineId: offlineResult.detectedDisciplineId,
      detectedTopic: offlineResult.detectedTopic,
      intent: context.intent,
      confidence: context.confidence,
      confidenceScore: context.confidenceScore,
      isTopicSwitch: context.isSubjectSwitch,
      needsClarification: context.needsClarification,
      source: offlineResult.cacheSource,
    };
  }

  // 3. Query Central Educational Library
  const libraryContent: RelevantEducationalContent = findRelevantEducationalContent({
    disciplineId: context.detectedSubjectId,
    disciplineName: context.detectedSubject,
    topic: context.detectedTopic,
    query,
  });

  // Notifica imediatamente o contexto detectado e o quadro branco antes mesmo da rede responder
  params.streamCallbacks?.onMeta?.({
    detectedDisciplineName: context.detectedSubject,
    detectedDisciplineId: context.detectedSubjectId,
    detectedTopic: context.detectedTopic,
    intent: context.intent,
    confidence: context.confidence,
    confidenceScore: context.confidenceScore,
    isTopicSwitch: context.isSubjectSwitch,
    whiteboardContent: libraryContent.whiteboardSnippet,
  });

  const requestBody = {
    message: query,
    detectedSubject: context.detectedSubject,
    detectedSubjectId: context.detectedSubjectId,
    detectedTopic: context.detectedTopic,
    intent: context.intent,
    confidence: context.confidence,
    confidenceScore: context.confidenceScore,
    isSubjectSwitch: context.isSubjectSwitch,
    educationalSummary: libraryContent.summary,
    whiteboardSnippet: libraryContent.whiteboardSnippet,
    studentName: params.studentName || "Estudante",
    studentLevel: params.studentLevel || "Ensino Médio e Técnico",
    difficulties: params.difficulties || [],
    recentErrors: params.recentErrors || [],
    history: params.conversationHistory || [],
    selectedSubjectFallback: params.selectedSubject,
    topicFallback: params.currentTopic,
    inputMode: params.inputMode || "text",
  };

  try {
    // Quando callbacks de streaming estão presentes, utiliza /api/tutor/stream (SSE) para resposta progressiva imediata
    if (params.streamCallbacks) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 18000);

      try {
        const res = await fetch("/api/tutor/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        });

        if (res.ok && res.body) {
          const reader = res.body.getReader();
          const decoder = new TextDecoder("utf-8");
          let buffer = "";
          let latestReply = "";
          let doneData: any = null;

          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            const parts = buffer.split("\n\n");
            buffer = parts.pop() || "";

            for (const rawEvent of parts) {
              const line = rawEvent
                .split("\n")
                .find((l) => l.startsWith("data:"));
              if (!line) continue;
              const jsonStr = line.slice(5).trim();
              if (!jsonStr) continue;

              try {
                const evt = JSON.parse(jsonStr);
                if (evt.type === "meta") {
                  params.streamCallbacks.onMeta?.(evt);
                } else if (evt.type === "chunk") {
                  latestReply = evt.reply || latestReply;
                  if (latestReply) {
                    params.streamCallbacks.onChunk?.(
                      latestReply,
                      evt.delta || ""
                    );
                  }
                } else if (evt.type === "done") {
                  doneData = evt;
                  latestReply = evt.reply || latestReply;
                }
              } catch {}
            }
          }

          clearTimeout(timeoutId);

          if (latestReply) {
            const cleanedReply = cleanDirectTutorReply(latestReply);
            const finalDisciplineName =
              doneData?.detectedDisciplineName || context.detectedSubject;
            const finalDisciplineId =
              doneData?.detectedDisciplineId || context.detectedSubjectId;
            const finalTopic =
              doneData?.detectedTopic || context.detectedTopic;
            const finalWhiteboard =
              doneData?.whiteboardContent || libraryContent.whiteboardSnippet;

            cacheTutorInteraction({
              query,
              reply: cleanedReply,
              whiteboardContent: finalWhiteboard,
              detectedDisciplineId: finalDisciplineId,
              detectedDisciplineName: finalDisciplineName,
              detectedTopic: finalTopic,
            }).catch(() => {});

            return {
              reply: cleanedReply,
              whiteboardContent: finalWhiteboard,
              detectedDisciplineName: finalDisciplineName,
              detectedDisciplineId: finalDisciplineId,
              detectedTopic: finalTopic,
              intent: context.intent,
              confidence: context.confidence,
              confidenceScore: context.confidenceScore,
              isTopicSwitch:
                doneData?.isTopicSwitch ?? context.isSubjectSwitch,
              needsClarification: context.needsClarification,
              source: doneData?.source || "gemini-stream",
            };
          }
        }
      } finally {
        clearTimeout(timeoutId);
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const res = await fetch("/api/tutor/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();

    const cleanedReply = cleanDirectTutorReply(data.reply);
    params.streamCallbacks?.onChunk?.(cleanedReply, cleanedReply);
    const finalDisciplineName = data.detectedDisciplineName || context.detectedSubject;
    const finalDisciplineId = data.detectedDisciplineId || context.detectedSubjectId;
    const finalTopic = data.detectedTopic || context.detectedTopic;
    const finalWhiteboard = data.whiteboardContent || libraryContent.whiteboardSnippet;

    // Persist interaction in local IndexedDB for offline access
    cacheTutorInteraction({
      query,
      reply: cleanedReply,
      whiteboardContent: finalWhiteboard,
      detectedDisciplineId: finalDisciplineId,
      detectedDisciplineName: finalDisciplineName,
      detectedTopic: finalTopic,
    }).catch(() => {});

    return {
      reply: cleanedReply,
      whiteboardContent: finalWhiteboard,
      detectedDisciplineName: finalDisciplineName,
      detectedDisciplineId: finalDisciplineId,
      detectedTopic: finalTopic,
      intent: context.intent,
      confidence: context.confidence,
      confidenceScore: context.confidenceScore,
      isTopicSwitch: data.isTopicSwitch ?? context.isSubjectSwitch,
      needsClarification: context.needsClarification,
      source: data.source || "gemini",
    };
  } catch (err) {
    console.warn("ProcessTutorMessage: Ativando cache local IndexedDB ProfeIA:", err);

    try {
      const offlineResult = await resolveOfflineTutorQuery({
        query,
        selectedSubject: params.selectedSubject,
        selectedSubjectId: params.selectedSubjectId,
        currentTopic: params.currentTopic,
        conversationHistory: params.conversationHistory,
      });

      return {
        reply: cleanDirectTutorReply(offlineResult.reply),
        whiteboardContent: offlineResult.whiteboardContent,
        detectedDisciplineName: offlineResult.detectedDisciplineName,
        detectedDisciplineId: offlineResult.detectedDisciplineId,
        detectedTopic: offlineResult.detectedTopic,
        intent: context.intent,
        confidence: context.confidence,
        confidenceScore: context.confidenceScore,
        isTopicSwitch: context.isSubjectSwitch,
        needsClarification: context.needsClarification,
        source: offlineResult.cacheSource,
      };
    } catch {
      const localReply = generateDeterministicTutorReply(
        query,
        context,
        libraryContent
      );

      return {
        reply: cleanDirectTutorReply(localReply),
        whiteboardContent: libraryContent.whiteboardSnippet,
        detectedDisciplineName: context.detectedSubject,
        detectedDisciplineId: context.detectedSubjectId,
        detectedTopic: context.detectedTopic,
        intent: context.intent,
        confidence: context.confidence,
        confidenceScore: context.confidenceScore,
        isTopicSwitch: context.isSubjectSwitch,
        needsClarification: context.needsClarification,
        source: "educational-library-engine",
      };
    }
  }
}

/**
 * Sanitiza e remove estritamente qualquer saudação, cumprimento ou frase de cortesia inicial (Zero Fluff).
 * A resposta deve começar imediatamente pela explicação do conteúdo ou pela resposta direta da pergunta.
 */
export function cleanDirectTutorReply(text: string): string {
  if (!text) return "";
  let cleaned = text.trim();

  // Strip banned greetings and courtesy fluff prefixes iteratively
  const bannedPrefixPatterns = [
    // Greetings with optional names (ex: "Olá Raíssa!", "Oi!", "Bom dia!", "Boa tarde!", "Saudações!")
    /^(ol[aá]|oi|bom dia|boa tarde|boa noite|sauda[cç][oõ]es)\b[^.!?\n]*[.!?\n]*/i,
    // Compliments and filler affirmations (ex: "Ótima pergunta!", "Excelente dúvida!", "Com certeza!")
    /^([oó]tima pergunta|[oó]tima d[uú]vida|excelente pergunta|excelente d[uú]vida|com certeza|com certeza,|claro que sim|claro|perfeito|muito bem|que bom que perguntou|entendido|compreendido|sem problemas|certamente)[!.,\s-]*/i,
    // Bot self-introduction or preamble
    /^(sou a professora sofia|sou o tutoria|como seu tutor educacional|aqui est[aá] a explica[cç][aã]o|vamos l[aá]|vamos entender|entendi sua d[uú]vida sobre|compreendi sua d[uú]vida sobre)[^.!?\n]*[.!?\n]*/i,
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

/**
 * Deterministic Pedagogical Reply based on the DETECTED subject and topic
 * NEVER forces the initial selected subject!
 */
function generateDeterministicTutorReply(
  query: string,
  context: QuestionContextResult,
  library: RelevantEducationalContent
): string {
  const norm = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Saudação isolada sem pergunta: direciona imediatamente para o conteúdo
  if (
    (norm === "ola" || norm === "oi" || norm === "bom dia" || norm === "boa tarde" || norm === "boa noite") ||
    (norm.length <= 15 && (norm.startsWith("ola") || norm.startsWith("oi")))
  ) {
    return `Qual conceito ou disciplina você gostaria de aprender ou revisar agora? Você pode perguntar diretamente sobre Redação, Matemática, Biologia, Banco de Dados ou qualquer outra das 14 disciplinas cadastradas.`;
  }

  // 1. Língua Portuguesa e Redação
  if (context.detectedSubjectId === "lingua-portuguesa-redacao") {
    if (norm.includes("introducao") || norm.includes("como faco") || norm.includes("como faco a introducao")) {
      return "Para construir uma introdução exemplar na redação, siga o tripé dissertativo em 3 etapas (cerca de 6 a 8 linhas):\n\n1) Contextualização sociocultural: inicie com um repertório filosófico, histórico ou literário legítimo (ex: Dimenstein, Bauman, Constituição Cidadã);\n2) Apresentação do tema problematizado: mostre a distância entre o direito ideal e a realidade prática brasileira;\n3) Apresentação explícita da Tese com D1 e D2: antecipe os dois eixos causais que você aprofundará nos parágrafos de desenvolvimento.\n\nDiga-me: qual é o tema sobre o qual você está escrevendo ou gostaria de treinar agora?";
    }
    if (norm.includes("conclusao") || norm.includes("proposta de intervencao") || norm.includes("intervencao")) {
      return "A conclusão dissertativa do ENEM requer uma Proposta de Intervenção completa com os 5 elementos obrigatórios:\n\n1. Agente: Quem executa? (Ex: Ministério da Educação);\n2. Ação: O que fazer? (Ex: implementar programas permanentes de letramento digital);\n3. Meio/Modo: Como fazer? (Ex: por meio de parcerias com institutos federais);\n4. Efeito: Para que fazer? (Ex: com o objetivo de democratizar o acesso à tecnologia);\n5. Detalhamento: Explicar detalhadamente um dos 4 itens anteriores.\n\nFicou claro como encaixar os 5 elementos?";
    }
    return "A redação dissertativo-argumentativa é a espinha dorsal dos exames e vestibulares. Ela se organiza em 4 parágrafos bem equilibrados:\n\n- Introdução: Contextualização do tema + Tese clara antecipando dois argumentos (D1 e D2);\n- Desenvolvimento 1: Aprofundamento do primeiro argumento sustentado por repertório legitimado;\n- Desenvolvimento 2: Aprofundamento do segundo argumento com análise crítica das causas e consequências;\n- Conclusão: Retomada da tese e proposta de intervenção completa com os 5 elementos.\n\nQual dessas partes você deseja praticar neste momento?";
  }

  // 2. Banco de Dados
  if (context.detectedSubjectId === "banco-de-dados") {
    if (norm.includes("chave primaria") || norm.includes("primary key") || norm.includes("pk")) {
      return "Uma Chave Primária (Primary Key ou PK) é o identificador único de cada registro dentro de uma tabela relacional. Suas duas regras invioláveis são:\n\n1) Unicidade Absoluta: não podem existir dois registros com a mesma chave primária;\n2) Não-Nulidade (NOT NULL): a chave primária nunca pode ser nula.\n\nExemplo: na tabela 'Alunos', o campo 'id_aluno' é a PK. Quando precisamos relacionar esse aluno aos seus cursos na tabela 'Matriculas', guardamos o 'aluno_id' como Chave Estrangeira (Foreign Key). Gostaria de ver o comando SQL para criá-las?";
    }
    if (norm.includes("join") || norm.includes("inner join") || norm.includes("left join")) {
      return "No SQL relacional, as cláusulas JOIN são usadas para combinar linhas de duas ou mais tabelas com base em uma coluna comum entre elas:\n\n- INNER JOIN: Retorna apenas os registros que possuem valores correspondentes em AMBAS as tabelas (interseção pura);\n- LEFT JOIN: Retorna todos os registros da tabela à esquerda, combinando com a tabela da direita quando houver correspondência, ou preenchendo com NULL quando não houver;\n- RIGHT JOIN: Retorna todos os registros da tabela à direita.\n\nGostaria que eu demonstrasse uma consulta SELECT prática com INNER JOIN?";
    }
    return "Em Banco de Dados Relacional, organizamos as informações em entidades (tabelas) com atributos (colunas) e tuplas (linhas). Para garantir integridade e velocidade de busca, aplicamos modelagem conceitual (DER), normalização (1FN, 2FN, 3FN) e consultas otimizadas via SQL. Qual parte desse conteúdo você quer explorar?";
  }

  // 2. Química
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
      "Em um sistema fechado, a massa total antes e depois da transformação é rigorosamente constante ('Na natureza nada se cria, nada se perde, tudo se transforma'). Por isso, o número total de átomos de cada elemento deve ser conservado, exigindo o balanceamento das equações químicas.\n\n" +
      "2) Evidências Experimentais de Reação:\n" +
      "- Variação térmica sensível: liberação de calor (reação exotérmica, como combustão) ou absorção de calor (reação endotérmica);\n" +
      "- Efervescência e liberação gasosa (como na reação entre bicarbonato e vinagre);\n" +
      "- Formação de precipitado sólido insolúvel;\n" +
      "- Mudança evidente de coloração ou emissão de luz/chama.\n\n" +
      "3) Classificação Geral das Reações:\n" +
      "- Síntese ou Adição: dois ou mais reagentes unem-se formando um produto (A + B → AB);\n" +
      "- Decomposição ou Análise: uma substância decompõe-se em duas ou mais (AB → A + B);\n" +
      "- Simples Troca ou Deslocamento: uma substância simples reage com uma composta (A + BC → AC + B);\n" +
      "- Dupla Troca: dois compostos trocam fragmentos iônicos entre si (AB + CD → AD + CB).\n\n" +
      "4) Exemplo Clássico: Na combustão completa do gás metano (CH₄ + 2 O₂ → CO₂ + 2 H₂O + calor), as moléculas de metano e oxigênio reagem produzindo dióxido de carbono e vapor de água com intensa liberação de energia térmica."
    );
  }

  // 3. Biologia
  if (
    context.detectedSubjectId === "biologia" ||
    norm.includes("celula") ||
    norm.includes("citologia") ||
    norm.includes("fotossintese")
  ) {
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
        "A célula é a unidade estrutural, funcional e genética fundamental de todos os seres vivos — desde organismos unicelulares (como bactérias) até pluricelulares (como plantas e animais).\n\n" +
        "1) Estrutura Básica Universal:\n" +
        "- Membrana Plasmática: bicamada fosfolipídica que envolve a célula e realiza o controle seletivo de substâncias (permeabilidade seletiva);\n" +
        "- Citoplasma (Citosol): matriz gelatinosa onde ocorrem as reações químicas do metabolismo e onde ficam imersas as organelas;\n" +
        "- Material Genético (DNA): armazena as informações hereditárias e comanda o funcionamento e a reprodução celular.\n\n" +
        "2) Classificação Principal:\n" +
        "- Células Procariontes (ex: bactérias): não possuem carioteca (o DNA fica disperso no nucleoide) nem organelas membranosas, possuindo apenas ribossomos;\n" +
        "- Células Eucariontes (ex: animais, plantas e fungos): possuem núcleo verdadeiro delimitado por carioteca e organelas especializadas, como mitocôndrias (respiração celular e produção de ATP), retículo endoplasmático, complexo de Golgi e lisossomos.\n\n" +
        "3) Exemplos e Relação com a Bioenergética: As células eucariontes vegetais possuem ainda parede celular celulósica, vacúolo central e cloroplastos — organelas responsáveis pela fotossíntese."
      );
    }
    if (norm.includes("fotossintese") || norm.includes("cloroplasto") || norm.includes("calvin") || norm.includes("tilacoide")) {
      return "A fotossíntese é o processo biológico autotrófico que converte energia solar em energia química na forma de glicose. Ela ocorre nos cloroplastos em duas fases interdependentes:\n\n1) Fase Fotoquímica (Fase Clara nos Tilacoides): A clorofila absorve luz solar e realiza a fotólise da água (quebra de H₂O), liberando o gás oxigênio (O₂) para o ar e gerando ATP e NADPH. Atenção: o oxigênio liberado vem 100% da quebra da água, e NÃO do gás carbônico!\n\n2) Fase Química (Ciclo de Calvin no Estroma): A enzima RuBisCO fixa o CO₂ atmosférico, consumindo o ATP e NADPH gerados na fase clara para produzir glicose.";
    }
    if (norm.includes("mitose") || norm.includes("meiose")) {
      return "A divisão celular permite a reprodução e o crescimento dos organismos eucariontes por duas vias:\n\n1) Mitose (2n → 2n): Uma célula-mãe origina duas células-filhas geneticamente idênticas, mantendo o número de cromossomos (atua no crescimento e regeneração tecidual);\n2) Meiose (2n → n): Uma célula diploide sofre duas divisões sucessivas formando quatro células haploides com metade dos cromossomos (atua na formação de gametas e variabilidade genética).";
    }
  }

  // 4. Matemática
  if (context.detectedSubjectId === "matematica") {
    if (norm.includes("bhaskara") || norm.includes("equacao do segundo grau") || norm.includes("delta")) {
      return "Para resolver uma equação do 2º grau na forma ax² + bx + c = 0 (com a ≠ 0), utilizamos a fórmula resolutiva de Bhaskara em dois passos:\n\n1) Discriminante Delta: Δ = b² - 4ac\n   - Se Δ > 0: duas raízes reais distintas (x' ≠ x'');\n   - Se Δ = 0: duas raízes reais iguais (x' = x'');\n   - Se Δ < 0: não há raízes reais no conjunto ℝ.\n\n2) Raízes: x = (-b ± √Δ) / (2a).\n\nTambém podemos checar rapidamente pelas Relações de Girard: Soma = -b/a e Produto = c/a.";
    }
  }

  // 5. Física
  if (context.detectedSubjectId === "fisica") {
    if (norm.includes("newton") || norm.includes("inercia") || norm.includes("leis de newton")) {
      return "As três Leis de Newton formam o pilar da Mecânica Clássica:\n\n1ª Lei (Princípio da Inércia): Se a força resultante sobre um corpo é nula (Fr = 0), ele permanece em repouso ou em Movimento Retilíneo Uniforme (MRU);\n2ª Lei (Princípio Fundamental da Dinâmica): A aceleração é diretamente proporcional à força resultante e inversamente proporcional à massa (Fr = m * a);\n3ª Lei (Ação e Reação): Para toda força de ação exercida sobre um corpo A, existe uma reação de mesmo módulo, mesma direção e sentido oposto aplicada em outro corpo B (Fab = -Fba). Elas NUNCA se anulam porque atuam em corpos distintos!";
    }
  }

  // General pedagogical response using the queried library content
  if (library.summary) {
    return `${library.summary}\n\n${
      library.keyPoints?.length
        ? `Pontos-chave:\n${library.keyPoints.map((kp, i) => `${i + 1}) ${kp}`).join("\n")}`
        : ""
    }`.trim();
  }

  return `Analisando sua pergunta sobre "${query.trim()}" em ${context.detectedSubject}: este conceito envolve a definição estrutural de seus elementos, suas propriedades operacionais e sua aplicação prática dentro de ${context.detectedTopic}.`;
}

// Backwards-compatible aliases
export async function askTutor(payload: AskTutorPayload): Promise<TutorResponse> {
  return processTutorMessage({
    message: payload.message,
    selectedSubject: payload.discipline,
    currentTopic: payload.topic,
    studentName: payload.studentName,
    difficulties: payload.difficulties,
    recentErrors: payload.recentErrors,
    conversationHistory: payload.history,
    inputMode: "text",
  });
}

export const tutorService = {
  processTutorMessage,
  sendChatMessage: async (params: {
    message: string;
    discipline?: string;
    disciplineId?: string;
    topic?: string;
    currentSubject?: string;
    currentTopic?: string;
    currentDetectedSubject?: string;
    currentDetectedTopic?: string;
    conversationHistory?: Array<{
      role: string;
      content: string;
      detectedSubject?: string;
      detectedTopic?: string;
    }>;
    studentName?: string;
    studentLevel?: string;
    difficulties?: string[];
    recentErrors?: string[];
    inputMode?: "text" | "voice";
    streamCallbacks?: TutorStreamCallbacks;
  }): Promise<TutorResponse> => {
    return processTutorMessage({
      message: params.message,
      selectedSubject: params.discipline || params.currentSubject,
      selectedSubjectId: params.disciplineId,
      currentTopic: params.topic || params.currentTopic,
      currentDetectedSubject: params.currentDetectedSubject,
      currentDetectedTopic: params.currentDetectedTopic,
      conversationHistory: params.conversationHistory,
      studentName: params.studentName,
      studentLevel: params.studentLevel,
      difficulties: params.difficulties,
      recentErrors: params.recentErrors,
      inputMode: params.inputMode || "text",
      streamCallbacks: params.streamCallbacks,
    });
  },
  chatWithTutor: async (params: {
    message: string;
    disciplineName?: string;
    disciplineId?: string;
    currentTopic?: string;
    currentDetectedSubject?: string;
    currentDetectedTopic?: string;
    conversationHistory?: Array<{
      role: string;
      content: string;
      detectedSubject?: string;
      detectedTopic?: string;
    }>;
    inputMode?: "text" | "voice";
  }): Promise<TutorResponse> => {
    return processTutorMessage({
      message: params.message,
      selectedSubject: params.disciplineName,
      selectedSubjectId: params.disciplineId,
      currentTopic: params.currentTopic,
      currentDetectedSubject: params.currentDetectedSubject,
      currentDetectedTopic: params.currentDetectedTopic,
      conversationHistory: params.conversationHistory,
      inputMode: params.inputMode || "text",
    });
  },
  askTutor,
  generatePedagogicalRecommendation,
  generateSummary,
  generateFlashcards,
  identifyLearningGap,
  generateStudyPlan,
};

export async function generatePedagogicalRecommendation(data: {
  turma: string;
  subject: string;
  averageScore: number;
  lowMasteryTopics: string[];
}): Promise<string> {
  try {
    const res = await fetch("/api/tutor/recommendation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Falha na chamada de recomendação");
    const json = await res.json();
    return json.recommendation;
  } catch (err) {
    return `Intervenção Pedagógica Sugerida: Para a turma ${data.turma} em ${data.subject}, recomenda-se uma dinâmica em pequenos grupos com resolução socrática de exercícios no ProfeIA, priorizando o tópico ${data.lowMasteryTopics[0] || 'fundamental'}.`;
  }
}

export function generateSummary(topic: string, discipline: string, durationMin: number): TutorSessionSummary {
  return {
    id: "session-" + Date.now(),
    discipline,
    topic,
    durationSeconds: durationMin * 60,
    startTime: new Date(Date.now() - durationMin * 60000).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    endTime: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    topicsCovered: [
      `Fundamentos e definições de ${topic}`,
      "Dedução prática e aplicação contextualizada",
      "Análise de casos de erro comum e como evitá-los",
      "Resolução orientada com perguntas socráticas",
    ],
    identifiedDoubts: [
      "Aplicação correta de pré-requisitos conceituais",
      "Estruturação de passos lógicos antes da resolução",
    ],
    pedagogicalRecommendations: [
      "Realizar a série de flashcards de fixação diária",
      "Fazer o exercício prático no módulo de Atividades para consolidar o aprendizado",
      "Revisitar o Mapa Mental para fixar as conexões entre os conceitos",
    ],
    nextSuggestedActivity: {
      title: `Atividade Prática: Fixação de ${topic}`,
      disciplineId: "matematica",
      contentId: "mat-eq-2-grau",
    },
  };
}

export function generateFlashcards(topic: string): FlashcardItem[] {
  return [
    {
      id: `fc-gen-1-${Date.now()}`,
      question: `Qual é o princípio fundamental de ${topic}?`,
      answer: `O princípio essencial em ${topic} envolve a compreensão estruturada de suas variáveis e a aplicação coerente das regras teóricas e práticas.`,
      difficulty: "facil",
      masteryScore: 80,
    },
    {
      id: `fc-gen-2-${Date.now()}`,
      question: `Como evitar erros clássicos ao trabalhar com ${topic}?`,
      answer: `Verificar sempre as condições de contorno, as premissas conceituais e os pré-requisitos antes de avançar para a solução.`,
      difficulty: "medio",
      masteryScore: 60,
    },
  ];
}

export function identifyLearningGap(answers: { isCorrect: boolean; topic: string }[]): string | null {
  const safeAnswers = answers || [];
  const incorrect = safeAnswers.filter((a) => !a.isCorrect);
  if (incorrect.length === 0) return null;
  return `Identificamos uma lacuna em: ${incorrect[0].topic}. Recomendamos uma breve revisão no ProfeIA.`;
}

export function generateStudyPlan(studentName: string, weakSubjects: string[]): string[] {
  return [
    `Semana 1: Foco intensivo em ${weakSubjects[0] || "Matemática"} (30 minutos/dia com TutorIA).`,
    `Semana 2: Revisão de ${weakSubjects[1] || "Banco de Dados"} com flashcards de repetição espaçada.`,
    "Semana 3: Simulado geral de nivelamento e resolução de exercícios comentados.",
  ];
}
