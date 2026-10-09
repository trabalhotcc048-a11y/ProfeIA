import { jsPDF } from "jspdf";
import {
  OFFICIAL_STUDENTS_LIST,
  CLASS_CODE,
  CLASS_NAME,
  CLASS_COURSE,
  OfficialStudent,
  getStudentOfficialEmail,
  calculateStudentAttendance,
  getClassAttendanceSummary,
} from "../data/studentsData";
import { initialDisciplines } from "../data/disciplinesData";
import { sampleQuestions, getQuestionsForDisciplineAndTopic } from "../data/activitiesData";
import { diagnoseQuestionErrorAndBuildLeveling } from "./pedagogicalActivityGenerator";
import { TopicDifficultyStat, TeacherAiRecommendation, LessonPlanRecord } from "../types";

export interface GenerateClassPdfOptions {
  teacherName: string;
  difficulties: TopicDifficultyStat[];
  recommendations: TeacherAiRecommendation[];
  students?: OfficialStudent[];
}

/**
 * Converte caracteres especiais matemáticos, gregos e sintaxe LaTeX
 * em texto simples limpo e legível para renderização sem falhas no jsPDF (Helvetica).
 * Exemplo: 'Cálculo do Discriminante (Δ = b² − 4ac)' -> 'Cálculo do Discriminante (Delta = b^2 - 4ac)'
 */
export function sanitizeSubconceptForPdf(text: string): string {
  if (!text) return "";
  return text
    // LaTeX replacements
    .replace(/\\Delta/g, "Delta")
    .replace(/\\times/g, "x")
    .replace(/\\cdot/g, "*")
    .replace(/\\pm/g, "+/-")
    .replace(/\\mp/g, "-/+")
    .replace(/\\rightarrow/g, "->")
    .replace(/\\leftarrow/g, "<-")
    .replace(/\\(le|leq)/g, "<=")
    .replace(/\\(ge|geq)/g, ">=")
    .replace(/\\neq/g, "!=")
    .replace(/\^\{?(\d+)\}?/g, "^$1")
    // Símbolos gregos e matemáticos
    .replace(/[Δ]/g, "Delta")
    .replace(/[δ]/g, "delta")
    .replace(/[²]/g, "^2")
    .replace(/[³]/g, "^3")
    .replace(/[⁴]/g, "^4")
    .replace(/[⁵]/g, "^5")
    .replace(/[⁶]/g, "^6")
    .replace(/[⁷]/g, "^7")
    .replace(/[⁸]/g, "^8")
    .replace(/[⁹]/g, "^9")
    .replace(/[⁰]/g, "^0")
    // Fórmulas químicas e subscritos comuns
    .replace(/CO₂/g, "CO2")
    .replace(/H₂O/g, "H2O")
    .replace(/O₂/g, "O2")
    .replace(/[₀]/g, "0")
    .replace(/[₁]/g, "1")
    .replace(/[₂]/g, "2")
    .replace(/[₃]/g, "3")
    .replace(/[₄]/g, "4")
    // Traços, menos matemáticos e setas
    .replace(/[−]/g, "-")
    .replace(/[—–]/g, "-")
    .replace(/[→]/g, "->")
    .replace(/[←]/g, "<-")
    .replace(/[•]/g, "-")
    .replace(/[≠]/g, "!=")
    .replace(/[≤]/g, "<=")
    .replace(/[≥]/g, ">=")
    .replace(/[±]/g, "+/-")
    .replace(/\s+/g, " ")
    .trim();
}

export function generateClassProficiencyPdf({
  teacherName = "Adnaldo Alves",
  difficulties,
  recommendations,
  students = OFFICIAL_STUDENTS_LIST,
}: GenerateClassPdfOptions): string {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  const ensureSpace = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 16) {
      doc.addPage();
      y = 18;
      // Top header strip on continuation pages
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, 10, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(226, 232, 240);
      doc.text(
        `ProfeIA • Relatório Oficial de Proficiência • Turma ${CLASS_CODE} • Prof. ${teacherName}`,
        margin,
        6.5
      );
      doc.setTextColor(15, 23, 42);
      y = 16;
    }
  };

  // =========================================================================
  // BANNER DE CABEÇALHO INSTITUCIONAL (PÁGINA 1)
  // =========================================================================
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 38, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  doc.text(
    `RELATÓRIO DE PROFICIÊNCIA E PROGRESSO • TURMA ${CLASS_CODE}`,
    margin,
    14
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(165, 243, 252);
  doc.text(
    `${CLASS_NAME} • ${CLASS_COURSE}`,
    margin,
    21
  );

  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  const nowStr = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  doc.text(
    `Professor Responsável: ${teacherName}   |   Emissão: ${nowStr}   |   Total: ${students.length} Alunos e 15 Disciplinas (50 Tópicos/Matéria)`,
    margin,
    29
  );

  y = 45;

  // =========================================================================
  // 1. INDICADORES GERAIS DA TURMA INFVES3SB
  // =========================================================================
  const classAttendance = getClassAttendanceSummary(students, 40);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11.5);
  doc.setTextColor(15, 23, 42);
  doc.text("1. SÍNTESE EXECUTIVA DE PROFICIÊNCIA E FREQUÊNCIA ESCOLAR", margin, y);
  y += 5;

  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(`• Estudantes Matriculados: ${students.length} alunos (${CLASS_CODE})`, margin + 4, y + 6.5);
  doc.text(`• Matriz Curricular: 15 Disciplinas Ativas (50 Tópicos cada)`, margin + 96, y + 6.5);
  doc.text(`• Frequência Escolar Média: ${classAttendance.averageAttendancePercent}% (${classAttendance.totalLoggedHours}h logadas)`, margin + 4, y + 13);
  doc.text(`• Ganho Médio em Debates Socráticos: +70%`, margin + 96, y + 13);
  doc.text(`• Ganho Médio em Simulações Vivas: +65%`, margin + 4, y + 19.5);
  doc.text(`• Alunos com Assiduidade >= 75%: ${classAttendance.excellentCount + classAttendance.regularCount}/${students.length}`, margin + 96, y + 19.5);

  y += 31;

  // =========================================================================
  // 2. PROGRESSO INDIVIDUAL DOS 26 ALUNOS DA TURMA INFVES3SB
  // =========================================================================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11.5);
  doc.setTextColor(15, 23, 42);
  doc.text(
    `2. PROGRESSO INDIVIDUAL DOS ${students.length} ALUNOS (${CLASS_CODE})`,
    margin,
    y
  );
  y += 5;

  // Cabeçalho da Tabela de Alunos
  doc.setFillColor(30, 41, 59);
  doc.rect(margin, y, contentWidth, 7.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text("#", margin + 2, y + 5);
  doc.text("Nome Completo do Estudante", margin + 8, y + 5);
  doc.text("Matrícula", margin + 78, y + 5);
  doc.text("Debates", margin + 104, y + 5);
  doc.text("Simulação", margin + 123, y + 5);
  doc.text("Status", margin + 143, y + 5);
  doc.text("Horas", margin + 169, y + 5);
  y += 7.5;

  students.forEach((st, idx) => {
    ensureSpace(12);

    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 11, "F");
    }

    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + 11, margin + contentWidth, y + 11);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(String(idx + 1).padStart(2, "0"), margin + 2, y + 4.5);
    doc.text(st.name.slice(0, 38), margin + 8, y + 4.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text(st.enrollmentId, margin + 78, y + 4.5);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(5, 150, 105);
    doc.text(st.metrics.debatesLearningGain, margin + 104, y + 4.5);

    doc.setTextColor(79, 70, 229);
    doc.text(st.metrics.simulationLearningGain, margin + 123, y + 4.5);

    doc.setTextColor(30, 41, 59);
    doc.text(st.status, margin + 143, y + 4.5);
    const stAtt = calculateStudentAttendance(st, 40);
    doc.text(`${stAtt.attendancePercent}% (${st.metrics.activeStudyHours}h)`, margin + 163, y + 4.5);

    // Segunda linha compacta com Tópico e Dificuldade Mapeada do Aluno
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    const studentEmail = getStudentOfficialEmail(st.name);
    const detailLine = `E-mail: ${studentEmail}  |  Último Tópico: ${st.postStudyReport.sessionTopic}  |  Foco: ${st.postStudyReport.mainDifficulty}`;
    doc.text(detailLine.slice(0, 122), margin + 8, y + 9);

    y += 11;
  });

  y += 7;

  // =========================================================================
  // 3. MAPA DE DIFICULDADES POR DISCIPLINA E TÓPICOS CRÍTICOS (15 MATÉRIAS)
  // =========================================================================
  ensureSpace(24);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11.5);
  doc.setTextColor(15, 23, 42);
  doc.text(
    `3. MAPA DE DIFICULDADES E TÓPICOS MONITORADOS (${difficulties.length} DISCIPLINAS)`,
    margin,
    y
  );
  y += 5;

  difficulties.forEach((diff, idx) => {
    ensureSpace(16);

    doc.setFillColor(idx % 2 === 0 ? 254 : 248, idx % 2 === 0 ? 242 : 250, idx % 2 === 0 ? 242 : 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 14, 1.5, 1.5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    const cleanDiffTopic = sanitizeSubconceptForPdf(diff.topic);
    doc.text(
      `${idx + 1}. ${diff.disciplineName} — Subconceito/Tópico: ${cleanDiffTopic}`,
      margin + 3,
      y + 4.8
    );

    doc.setTextColor(185, 28, 28);
    doc.text(
      `Taxa de Erro: ${diff.errorRate}% (${diff.affectedStudentsCount} alunos)`,
      margin + contentWidth - 48,
      y + 4.8
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text(
      `Pré-requisito: ${diff.prerequisiteIssue.slice(0, 95)}`,
      margin + 3,
      y + 9
    );
    doc.setTextColor(67, 56, 202);
    doc.text(
      `Ação Recomendada IA: ${diff.recommendedAction.slice(0, 105)}`,
      margin + 3,
      y + 12.6
    );

    y += 15.5;
  });

  y += 5;

  // =========================================================================
  // 4. CATÁLOGO CURRICULAR DAS 15 DISCIPLINAS E LISTA DE TÓPICOS ATIVOS
  // =========================================================================
  ensureSpace(24);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11.5);
  doc.setTextColor(15, 23, 42);
  doc.text(
    `4. MATRIZ CURRICULAR E LISTA DE TÓPICOS DAS 15 DISCIPLINAS (50 TÓPICOS/MATÉRIA)`,
    margin,
    y
  );
  y += 5;

  initialDisciplines.forEach((disc, idx) => {
    const allContents = disc.modules.flatMap((m) => m.contents);
    ensureSpace(22);

    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, y, contentWidth, 19, 1.5, 1.5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(
      `${idx + 1}. ${disc.name} (${disc.category}) — Proficiência Média: ${disc.progressPercent}% | ${allContents.length} Tópicos Ativos`,
      margin + 3,
      y + 5
    );

    // Amostra dos tópicos ativos da disciplina
    const sampleTopics = allContents
      .slice(0, 8)
      .map((c, i) => `${i + 1}. ${c.title}`)
      .join(" • ");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.8);
    doc.setTextColor(51, 65, 85);
    const wrappedTopics = doc.splitTextToSize(
      `Tópicos Principais (Catálogo 1 a ${allContents.length}): ${sampleTopics} ... (+${Math.max(
        0,
        allContents.length - 8
      )} capítulos estruturados com 10 questões cada).`,
      contentWidth - 6
    );
    doc.text(wrappedTopics.slice(0, 3), margin + 3, y + 9.5);

    y += 21;
  });

  // =========================================================================
  // 5. RECOMENDAÇÕES PEDAGÓGICAS DA IA PARA O DOCENTE
  // =========================================================================
  if (recommendations && recommendations.length > 0) {
    ensureSpace(24);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11.5);
    doc.setTextColor(15, 23, 42);
    doc.text(
      `5. SUGESTÕES PEDAGÓGICAS DA IA (${recommendations.length} INTERVENÇÕES)`,
      margin,
      y
    );
    y += 5;

    recommendations.forEach((rec, idx) => {
      ensureSpace(14);
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, 12, 1.5, 1.5, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.8);
      doc.setTextColor(15, 23, 42);
      doc.text(
        `${idx + 1}. [${rec.priority.toUpperCase()}] ${rec.title} (${rec.targetGroup})`,
        margin + 3,
        y + 4.8
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.8);
      doc.setTextColor(71, 85, 105);
      doc.text(
        `Ação Sugerida: ${rec.suggestedAction} — ${rec.description.slice(0, 95)}`,
        margin + 3,
        y + 9.5
      );

      y += 13.5;
    });
  }

  // Numeração de páginas no rodapé
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `ProfeIA • Educação Híbrida e Aprendizagem Adaptativa • Turma ${CLASS_CODE} • Página ${p} de ${totalPages}`,
      margin,
      pageHeight - 7
    );
  }

  const fileName = `Relatorio_Proficiencia_${CLASS_CODE}_ProfeIA.pdf`;
  doc.save(fileName);
  return fileName;
}

export function generateLessonPlanPdf(
  plan: LessonPlanRecord,
  teacherName = "Prof. Adnaldo Alves"
): string {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - 16) {
      doc.addPage();
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, 10, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(226, 232, 240);
      doc.text(
        `ProfeIA • Plano de Aula Pedagógico • ${plan.disciplineName} • Turma ${CLASS_CODE}`,
        margin,
        6.5
      );
      y = 16;
    }
  };

  // Cabeçalho Institucional
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 36, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text(`PLANO DE AULA E INTERVENÇÃO PEDAGÓGICA • PROFEIA`, margin, 13);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(165, 243, 252);
  doc.text(
    `Disciplina: ${plan.disciplineName}   |   Tópico: ${plan.topic}`,
    margin,
    20.5
  );

  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text(
    `Docente: ${teacherName}   |   Turma: ${CLASS_CODE}   |   Tempo Estimado: ${plan.estimatedTime}`,
    margin,
    28
  );

  y = 44;

  // Título da Aula
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  const titleLines = doc.splitTextToSize(`Título da Aula: ${plan.title}`, contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 5 + 3;

  // Quadro de Diagnóstico e Pré-Requisito
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 26, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(185, 28, 28);
  doc.text(
    `• Pré-requisito a revisar: ${plan.prerequisiteToReview}   |   Taxa de Erro Detectada: ${plan.errorRate}% (${plan.affectedStudentsCount} alunos afetados)`,
    margin + 3,
    y + 6
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const diagLines = doc.splitTextToSize(
    `Diagnóstico da Dificuldade: ${plan.difficultyDiagnosis}`,
    contentWidth - 6
  );
  doc.text(diagLines.slice(0, 3), margin + 3, y + 12);
  y += 31;

  // Objetivo de Aprendizagem
  ensureSpace(20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("1. OBJETIVO DE APRENDIZAGEM", margin, y);
  y += 4.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const objLines = doc.splitTextToSize(plan.learningObjective, contentWidth);
  doc.text(objLines, margin, y);
  y += objLines.length * 4.5 + 4;

  // Etapas da Aula
  ensureSpace(20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("2. ROTEIRO METODOLÓGICO DA AULA (5 ETAPAS)", margin, y);
  y += 5;

  plan.steps.forEach((step) => {
    const stepDescLines = doc.splitTextToSize(step.description, contentWidth - 8);
    const boxHeight = Math.max(14, stepDescLines.length * 4.2 + 8);
    ensureSpace(boxHeight + 3);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, boxHeight, 1.5, 1.5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(67, 56, 202);
    doc.text(`${step.stageTitle} (${step.duration})`, margin + 3, y + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(stepDescLines, margin + 3, y + 10);

    y += boxHeight + 3;
  });

  y += 3;

  // Recursos Didáticos e Avaliação
  ensureSpace(32);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("3. RECURSOS DIDÁTICOS E ESTRATÉGIA DE AVALIAÇÃO", margin, y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  plan.didacticResources.forEach((res) => {
    doc.text(`• ${res}`, margin + 2, y);
    y += 4.5;
  });

  y += 2;
  doc.setFont("helvetica", "bold");
  doc.text("Avaliação:", margin, y);
  doc.setFont("helvetica", "normal");
  const evalLines = doc.splitTextToSize(plan.evaluationStrategy, contentWidth - 20);
  doc.text(evalLines, margin + 18, y);
  y += evalLines.length * 4.5 + 5;

  // Alunos Foco
  ensureSpace(20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(
    `4. ESTUDANTES DIAGNOSTICADOS (${plan.affectedStudents.length} alunos • Turma ${CLASS_CODE}):`,
    margin,
    y
  );
  y += 4.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  const stLine = doc.splitTextToSize(plan.affectedStudents.join(" • "), contentWidth);
  doc.text(stLine, margin, y);

  const safeDisc = plan.disciplineName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "_");
  const fileName = `Plano_de_Aula_${safeDisc}_${CLASS_CODE}.pdf`;
  doc.save(fileName);
  return fileName;
}

export interface GenerateStudentActivityPdfOptions {
  studentName: string;
  className?: string;
  attempts: import("../types").StudentActivityAttempt[];
  disciplines?: import("../types").Discipline[];
}

/**
 * Extrai rigorosamente o SUBCONCEITO EXATO do objeto da tentativa pedagógica,
 * inspecionando propriedades prioritárias (subconceito, subconcept, subconceitoExato, etc.)
 * e resolvendo via diagnóstico da questão se necessário, garantindo que nunca
 * seja exibido 'Subconceito Geral'.
 */
export function extractSubconceptFromAttempt(
  att: any,
  disciplines: import("../types").Discipline[] = initialDisciplines
): { subconcept: string; topic: string } {
  // 1. Extração direta de propriedades prioritárias do objeto
  const directCandidate =
    att?.subconceitoExato ||
    att?.subconceito_exato ||
    att?.subconceito ||
    att?.subconcept ||
    att?.conceptWithDifficulty ||
    att?.specificSubconcept ||
    att?.subtopic ||
    att?.subTopico;

  if (
    directCandidate &&
    typeof directCandidate === "string" &&
    directCandidate.trim() &&
    directCandidate.trim() !== "Subconceito Geral"
  ) {
    const topic = att?.topicTitle || att?.topic || att?.contentTitle || directCandidate.trim();
    return { subconcept: directCandidate.trim(), topic };
  }

  // 2. Se houver questionId, busca na base de questões para diagnosticar o subconceito exato
  if (att?.questionId) {
    let matchedQ = sampleQuestions.find((q) => q.id === att.questionId);
    if (!matchedQ && att?.disciplineId) {
      const topicIdMatch = String(att.questionId).replace(/^q-/, "").replace(/-\d+$/, "");
      if (topicIdMatch) {
        const generatedList = getQuestionsForDisciplineAndTopic(att.disciplineId, topicIdMatch);
        matchedQ = generatedList.find((q) => q.id === att.questionId) || generatedList[0];
      }
    }
    if (matchedQ) {
      const diag = diagnoseQuestionErrorAndBuildLeveling(
        matchedQ,
        att.selectedOptionId || null,
        att.discursiveAnswer
      );
      if (diag?.conceptWithDifficulty && diag.conceptWithDifficulty !== "Subconceito Geral") {
        return {
          subconcept: diag.conceptWithDifficulty,
          topic: diag.topicTitle || matchedQ.contentTitle || diag.conceptWithDifficulty,
        };
      }
    }
  }

  // 3. Extração via topicTitle, topic ou contentTitle
  const titleCandidate = att?.topicTitle || att?.topic || att?.contentTitle;
  if (
    titleCandidate &&
    typeof titleCandidate === "string" &&
    titleCandidate.trim() &&
    titleCandidate.trim() !== "Subconceito Geral"
  ) {
    return { subconcept: titleCandidate.trim(), topic: titleCandidate.trim() };
  }

  // 4. Se houver questionTitle, limpa prefixos de template de questão
  if (att?.questionTitle && typeof att.questionTitle === "string") {
    const cleanedTitle = att.questionTitle
      .replace(/^Questão\s+\d+\s*[:—-]\s*/i, "")
      .replace(
        /^(Conceito Central|Cálculo e Aplicação de Fórmula em|Resolução de Problema Prático|Contextualização e Fundamentos de|Análise de Caso e Interpretação em|Estruturas e Etapas Biológicas em|Análise Fisiológica e Aplicação em|Estrutura e Funcionamento Prático de|Análise de Exemplo Prático em|Prevenção de Erros Frequentes em|Conexão com Pré-Requisito|Interpretação Contextualizada|Análise de Conceitos-Chave em|Raciocínio Didático e Aplicação de|Síntese Avançada de Teoria e Prática em|Questão Discursiva:\s*Análise Completa de)\s*[:—-]?\s*/i,
        ""
      )
      .trim();

    if (cleanedTitle && cleanedTitle !== "Subconceito Geral") {
      return { subconcept: cleanedTitle, topic: cleanedTitle };
    }
  }

  // 5. Se houver topicId ou contentId, busca no catálogo de disciplinas
  const targetId = att?.topicId || att?.contentId || att?.questionId;
  if (targetId && typeof targetId === "string") {
    for (const disc of disciplines) {
      for (const mod of disc.modules) {
        for (const content of mod.contents) {
          if (content.id === targetId || targetId.includes(content.id) || content.id.includes(targetId)) {
            return {
              subconcept: content.title,
              topic: content.title,
            };
          }
        }
      }
    }
  }

  // 6. Fallback estruturado no catálogo da disciplina cadastrada
  const matchedDisc = disciplines.find((d) => d.id === att?.disciplineId);
  const fallbackTopic =
    matchedDisc?.modules[0]?.contents[0]?.title ||
    (matchedDisc ? `Conceito Estruturante de ${matchedDisc.name}` : "Conceito Pedagógico Avaliado");

  return {
    subconcept: fallbackTopic,
    topic: fallbackTopic,
  };
}

export function generateStudentActivityReportPdf({
  studentName,
  className = CLASS_CODE,
  attempts = [],
  disciplines = initialDisciplines,
}: GenerateStudentActivityPdfOptions): string {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - 16) {
      doc.addPage();
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, 10, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(226, 232, 240);
      doc.text(
        `ProfeIA • Relatório de Atividades e Subconceitos • ${studentName} • Turma ${className}`,
        margin,
        6.5
      );
      doc.setTextColor(15, 23, 42);
      y = 16;
    }
  };

  // Header Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 38, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(
    `RELATÓRIO DE ATIVIDADES E SUBCONCEITOS PEDAGÓGICOS`,
    margin,
    14
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(165, 243, 252);
  doc.text(
    `Estudante: ${studentName}   |   Turma: ${className} (${CLASS_COURSE})`,
    margin,
    21
  );

  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  const nowStr = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  doc.text(
    `Emissão: ${nowStr}   |   Total de Tentativas: ${attempts.length}   |   Plataforma ProfeIA`,
    margin,
    29
  );

  y = 45;

  // 1. Síntese Geral
  const correctCount = attempts.filter((a) => a.isCorrect).length;
  const incorrectCount = attempts.length - correctCount;
  const accuracyRate = attempts.length > 0 ? Math.round((correctCount / attempts.length) * 100) : 100;
  const remedialCount = attempts.filter((a) => a.remedialTriggered).length;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("1. SÍNTESE DO HISTÓRICO DE APRENDIZAGEM", margin, y);
  y += 5;

  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(`• Tentativas Registradas: ${attempts.length}`, margin + 4, y + 6);
  doc.text(`• Taxa Global de Acerto: ${accuracyRate}%`, margin + 96, y + 6);
  doc.text(`• Acertos de Primeira: ${correctCount}`, margin + 4, y + 12);
  doc.text(`• Micro-Nivelamentos Ativados: ${remedialCount}`, margin + 96, y + 12);
  doc.text(`• Matriz Avaliada: 15 Disciplinas com Subconceitos Específicos`, margin + 4, y + 18);

  y += 28;

  // 2. Histórico Detalhado por Subconceito Unificado
  ensureSpace(24);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("2. HISTÓRICO DETALHADO COM SUBCONCEITO UNIFICADO", margin, y);
  y += 5;

  if (attempts.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text("Nenhuma tentativa de atividade registrada nesta sessão ainda.", margin + 4, y + 5);
    y += 12;
  } else {
    // Tabela de tentativas com quebra automática de linha, altura dinâmica e sanitização
    attempts.forEach((att, idx) => {
      const discObj = disciplines.find((d) => d.id === att.disciplineId);
      const discName = discObj?.name || att.disciplineId?.toUpperCase() || "GERAL";
      const { subconcept: rawSubconceptName, topic: rawTopicName } = extractSubconceptFromAttempt(att, disciplines);

      // Limpeza de caracteres especiais e sintaxe LaTeX para texto simples legível (ex: Δ -> Delta, ² -> ^2, − -> -)
      const cleanSubconcept = sanitizeSubconceptForPdf(rawSubconceptName);
      const cleanTopicName = sanitizeSubconceptForPdf(rawTopicName);
      const cleanDiscName = sanitizeSubconceptForPdf(discName);
      const cleanQuestionTitle = sanitizeSubconceptForPdf(att.questionTitle || att.questionId);

      const formattedDate = new Date(att.timestamp || Date.now()).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });

      // 1. Largura máxima explícita para o título do subconceito (70% da largura útil do card)
      // para forçar a quebra de linha com margem de segurança total antes de atingir o selo 'MICRO-NIVELADO'
      const titleMaxWidth = contentWidth * 0.70;

      // Parâmetros de tipografia e espaçamento vertical
      const titleLineHeight = 4.2; // Altura de cada linha do título em mm
      const subLineHeight = 3.6;   // Altura de cada linha de metadados em mm
      const topPadding = 4.6;      // Margem superior até a primeira linha do título
      const gapBetweenTitleAndMeta = 2.2; // Espaço vertical entre título e metadados
      const bottomPadding = 4.6;   // Margem inferior de respiro para garantir que nenhum texto extravase

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      const titleText = `${idx + 1}. [${cleanDiscName}] Subconceito: ${cleanSubconcept}`;
      const titleLines: string[] = doc.splitTextToSize(titleText, titleMaxWidth);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.8);
      const subLine = `Tópico: ${cleanTopicName}  |  Questão: ${cleanQuestionTitle}  |  Dificuldade: ${att.difficultyExperienced || "médio"}  |  Registro: ${formattedDate}`;
      const subLines: string[] = doc.splitTextToSize(subLine, contentWidth - 6);

      // 3. Aumente a altura total do card (cardHeight) proporcionalmente ao número de linhas do subconceito para evitar o extravasamento
      const cardHeight = Math.max(
        16,
        topPadding + (titleLines.length * titleLineHeight) + gapBetweenTitleAndMeta + (subLines.length * subLineHeight) + bottomPadding
      );

      ensureSpace(cardHeight + 2);

      // Fundo do card
      doc.setFillColor(att.isCorrect ? 240 : 254, att.isCorrect ? 253 : 242, att.isCorrect ? 244 : 242);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, cardHeight, 1.5, 1.5, "FD");

      // Badge no lado direito (largura fixa e alinhamento no topo direito do card, sem sobreposição)
      const badgeWidth = 34;
      const badgeX = margin + contentWidth - badgeWidth - 3;
      const badgeY = y + 4.0;
      if (att.isCorrect) {
        doc.setFillColor(209, 250, 229);
        doc.setDrawColor(167, 243, 208);
        doc.roundedRect(badgeX, badgeY, badgeWidth, 5.2, 1, 1, "FD");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(5, 150, 105);
        doc.text("CORRETO", badgeX + badgeWidth / 2, badgeY + 3.7, { align: "center" });
      } else {
        doc.setFillColor(254, 226, 226);
        doc.setDrawColor(254, 202, 202);
        doc.roundedRect(badgeX, badgeY, badgeWidth, 5.2, 1, 1, "FD");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(6.8);
        doc.setTextColor(185, 28, 28);
        doc.text("MICRO-NIVELADO", badgeX + badgeWidth / 2, badgeY + 3.7, { align: "center" });
      }

      // Impressão do título com quebra automática linha a linha
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      let titleY = y + topPadding;
      titleLines.forEach((line) => {
        doc.text(line, margin + 3.5, titleY);
        titleY += titleLineHeight;
      });

      // 2. Calcule a posição Y da linha inferior (Tópico, Questão, Dificuldade, Registro)
      // dinamicamente com base no número de linhas do título (lines.length * lineHeight),
      // empurrando os detalhes para baixo com espaçamento uniforme.
      const metaStartY = y + topPadding + (titleLines.length * titleLineHeight) + gapBetweenTitleAndMeta;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.8);
      doc.setTextColor(71, 85, 105);
      let metaY = metaStartY;
      subLines.forEach((line) => {
        doc.text(line, margin + 3.5, metaY);
        metaY += subLineHeight;
      });

      y += cardHeight + 2.5;
    });
  }

  y += 5;

  // 3. Recomendações e Nivelamento Pedagógico
  ensureSpace(24);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("3. DIRETRIZES DE REVISÃO E MICRO-NIVELAMENTO CONTEXTUALIZADO", margin, y);
  y += 5;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 20, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  const adviceLines = doc.splitTextToSize(
    "O ProfeIA orienta o aprendizado com base na hierarquia DISCIPLINA -> TEMA -> SUBCONCEITO EXATO. Sempre que uma dificuldade é detectada em uma atividade, o sistema aciona imediatamente a explicação do pré-requisito necessário, um exemplo simples resolvido e um exercício de reforço correspondente antes de disponibilizar o botão de revisão aprofundada.",
    contentWidth - 6
  );
  doc.text(adviceLines, margin + 3, y + 5);

  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `ProfeIA • Aprendizagem Adaptativa e Micro-Nivelamento Contextualizado • Página ${p} de ${totalPages}`,
      margin,
      pageHeight - 7
    );
  }

  const safeName = studentName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "_");
  const fileName = `Relatorio_Atividades_${safeName}_ProfeIA.pdf`;
  doc.save(fileName);
  return fileName;
}

// Alias em português solicitado para compatibilidade
export const gerarRelatorioDeAtividadesDoAlunoPDF = generateStudentActivityReportPdf;
