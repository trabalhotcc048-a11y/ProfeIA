export type UserRole = "ALUNO" | "PROFESSOR" | "ADMIN";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  turma?: string;
  course?: string;
  enrollmentId: string;
  streakDays: number;
  studyHoursTotal: number;
  dailyGoalMinutes: number;
  dailyProgressMinutes: number;
  hasFaceId?: boolean;
  faceIdData?: string | null;
}

export type FlashcardType =
  | "conceito"
  | "causa_efeito"
  | "formula"
  | "comparacao"
  | "erro_comum"
  | "aplicacao";

export interface FlashcardItem {
  id: string;
  question: string;
  answer: string;
  difficulty?: "facil" | "medio" | "dificil";
  masteryScore?: number; // 0 to 100
  type?: FlashcardType;
  cognitiveLevel?: 1 | 2 | 3 | 4;
  relatedTopic?: string;
  spacedRepetitionDays?: number;
  reviewCount?: number;
  lastReviewed?: string;
}

export interface VideoLesson {
  id: string;
  title: string;
  duration: string;
  channel: string;
  description: string;
  url?: string;
  level?: 1 | 2 | 3 | 4;
  prerequisites?: string[];
  whatWillBeLearned?: string[];
  practicalImportance?: string;
  nextStepsToStudy?: string;
  tags?: string[];
}

export interface MindMapNode {
  id: string;
  label: string;
  description?: string;
  color?: string;
  level?: number; // 0 (Tema Raiz), 1 (Conceito), 2 (Subconceito), 3 (Detalhe Técnico/Aplicação)
  technicalDetail?: string;
  example?: string;
  children?: MindMapNode[];
}

export interface ConceptMapNode {
  from: string;
  relationship: string; // Ex: "utiliza como reagente", "gera por consequência", "formaliza através de"
  to: string;
  interdisciplinaryArea?: string; // Ex: "Química", "Física", "Matemática", "Computação", "Sociologia"
  contextNote?: string;
}

export type LearningTrackLevel = 1 | 2 | 3 | 4;

export interface StructuredSummarySection {
  whatIsAndContext: string;
  keyConcepts: Array<{
    concept: string;
    deepExplanation: string;
    mechanism?: string;
  }>;
  practicalDailyExamples: string[];
  technicalApplications: Array<{
    field: string;
    application: string;
  }>;
  commonPitfalls: Array<{
    mistake: string;
    correction: string;
    examTrick?: string;
  }>;
  synthesisTable: Array<{
    concept: string;
    definition: string;
    mnemonicOrRule: string;
  }>;
  activeRecallCheckpoint: {
    question: string;
    hint: string;
    modelAnswer: string;
  };
}

export interface SocraticGuidedResearch {
  guidingQuestions: string[];
  chronologicalAndConceptualPhases?: Array<{
    phaseTitle: string;
    drivingQuestion: string;
    epistemicContext: string;
  }>;
  causesAndContext?: string;
  socioeconomicAndTechnicalContext?: string;
  contemporaryOutcomesAndImpacts?: string;
  historiographicalAndScientificDebates?: string;
  practicalChallenge: string;
  hypothesisToInvestigate?: string;
  suggestedSources: string[];
  deepDiveNotes: string;
}

export interface ProgressiveLevelData {
  title: string;
  focus: string;
  summaryDeepDive: string;
  activeRecall: string;
}

export interface ContentItem {
  id: string;
  disciplineId: string;
  title: string;
  subtitle: string;
  summary: string;
  structuredSummary?: StructuredSummarySection;
  progressiveLevels?: Record<LearningTrackLevel, ProgressiveLevelData>;
  guidedResearch: {
    guidingQuestions: string[];
    deepDiveNotes: string;
    suggestedSources: string[];
    practicalChallenge: string;
    causesAndContext?: string;
    socioeconomicAndTechnicalContext?: string;
    contemporaryOutcomesAndImpacts?: string;
    historiographicalAndScientificDebates?: string;
    hypothesisToInvestigate?: string;
    chronologicalAndConceptualPhases?: Array<{
      phaseTitle: string;
      drivingQuestion: string;
      epistemicContext: string;
    }>;
  };
  flashcards: FlashcardItem[];
  videos: VideoLesson[];
  mentalMap: {
    root: MindMapNode;
  };
  conceptMap: {
    relations: ConceptMapNode[];
  };
  prerequisites?: string[];
  subTaxonomyPath?: string[];
  estimatedMinutes: number;
  completed?: boolean;
}

export interface ModuleItem {
  id: string;
  disciplineId: string;
  title: string;
  description: string;
  contents: ContentItem[];
}

export interface Discipline {
  id: string;
  name: string;
  category: "Exatas e Tecnológicas" | "Ciências da Natureza" | "Ciências Humanas e Sociais" | "Linguagens" | "Formação Profissional e Projetos";
  description: string;
  iconName: string;
  color: string;
  accentColor: string;
  progressPercent: number;
  modules: ModuleItem[];
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface ActivityQuestion {
  id: string;
  disciplineId: string;
  contentId: string;
  disciplineName: string;
  contentTitle: string;
  title: string;
  prompt: string;
  type: "objective" | "discursive";
  difficulty: "facil" | "medio" | "dificil";
  options?: QuestionOption[];
  expectedKeywords?: string[];
  correctExplanation: string;
  prerequisiteFallback?: {
    prerequisiteTopic: string;
    explanation: string;
    remedialQuestion: {
      prompt: string;
      options: QuestionOption[];
      explanation: string;
    };
  };
}

export interface StudentActivityAttempt {
  questionId: string;
  disciplineId: string;
  subconcept?: string;
  subconceito?: string;
  subconceitoExato?: string;
  conceptWithDifficulty?: string;
  topicTitle?: string;
  topicId?: string;
  questionTitle?: string;
  selectedOptionId?: string;
  discursiveAnswer?: string;
  isCorrect: boolean;
  timestamp: string;
  difficultyExperienced: "facil" | "medio" | "dificil";
  remedialTriggered?: boolean;
}

export interface TutorTranscriptEntry {
  id: string;
  sender: "ALUNO" | "TUTORIA";
  text: string;
  timestamp: string;
}

export interface TutorSessionSummary {
  id: string;
  discipline: string;
  topic: string;
  durationSeconds: number;
  startTime: string;
  endTime: string;
  topicsCovered: string[];
  identifiedDoubts: string[];
  pedagogicalRecommendations: string[];
  nextSuggestedActivity: {
    title: string;
    disciplineId: string;
    contentId: string;
  };
}

export interface ActivityReportItem {
  activityTitle: string;
  turma: string;
  submittedCount: number;
  totalCount: number;
  disciplineName: string;
  submittedStudents: Array<{
    name: string;
    enrollmentId?: string;
    submittedAt: string;
  }>;
  pendingStudents: Array<{
    name: string;
    enrollmentId?: string;
  }>;
}

export interface NotificationItem {
  id: string;
  title: string;
  message?: string;
  description?: string;
  timestamp: string;
  read: boolean;
  type: "activity" | "ai_recommendation" | "recommendation" | "tutor" | "system" | "alert" | "deadline" | "report";
  sender?: string;
  senderEmail?: string;
  fullBody?: string;
  deadlineDate?: string;
  actionLabel?: string;
  actionTarget?: {
    tab: string;
    id?: string;
    disciplineId?: string;
    topic?: string;
  };
  activityReport?: ActivityReportItem;
}

export interface DifficultyRecord {
  id: string;
  studentId: string;
  studentName: string;
  disciplineName: string;
  topic: string;
  score: number;
  difficultyLevel: "Crítico" | "Moderado" | "Leve";
  aiRecommendation: string;
  identifiedAt: string;
  resolved: boolean;
}

export interface TurmaData {
  id: string;
  name: string;
  course: string;
  shift: "Manhã" | "Tarde" | "Noite";
  studentsCount: number;
  averageGrade: number;
  completionRate: number;
  criticalGapsCount: number;
}

export interface AlunoData {
  id: string;
  name: string;
  email: string;
  turmaId: string;
  turmaName: string;
  avatar: string;
  attendancePercent: number; // frequência
  overallGrade: number;
  activitiesCompleted: number;
  totalActivities: number;
  streakDays: number;
  difficultiesCount: number;
  recentDifficulties: string[];
  lastActive: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  disciplineName: string;
  turma: string;
  members: string[];
  deadline: string;
  progressPercent: number;
  status: "Em Planejamento" | "Em Desenvolvimento" | "Revisão" | "Concluído";
  activities: { id: string; title: string; done: boolean }[];
}

export interface AIPedagogicalAlert {
  id: string;
  turma: string;
  discipline: string;
  topic: string;
  alertType: "gap_prevention" | "high_error_rate" | "low_engagement";
  message: string;
  actionSuggested: string;
  studentsAffected: number;
}

export interface TutorMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  type?: "text" | "whiteboard" | "action";
  detectedSubject?: string;
  detectedTopic?: string;
  confidence?: "alta" | "media" | "baixa";
}

export interface ProjectStage {
  id: string;
  title: string;
  description: string;
  status: "pendente" | "em_andamento" | "concluido";
  deadline: string;
}

export interface ProjectTracking {
  id: string;
  title: string;
  theme: string;
  advisor: string;
  status: "planejamento" | "em_andamento" | "revisao" | "concluido";
  nextDeadline: string;
  stages: ProjectStage[];
  aiFeedback: string;
}

export interface StudentSummary {
  id: string;
  name: string;
  email: string;
  avatar: string;
  turma: string;
  progressPercent: number;
  performanceGrade: number;
  status: "excelente" | "regular" | "atencao";
  lastActive: string;
  recentDifficulties: string[];
  projectTitle?: string;
}

export interface ClassGroup {
  id: string;
  name: string;
  studentCount: number;
  course: string;
}

export interface TopicDifficultyStat {
  id: string;
  disciplineId: string;
  contentId?: string;
  disciplineName: string;
  topic: string;
  prerequisiteIssue: string;
  errorRate: number;
  affectedStudentsCount: number;
  affectedStudents: string[];
  recommendedAction: string;
}

export type DifficultyTopic = TopicDifficultyStat;

export interface TeacherAiRecommendation {
  id: string;
  difficultyStatId: string;
  disciplineId: string;
  contentId?: string;
  disciplineName: string;
  topic: string;
  priority: "alta" | "media" | "baixa";
  targetGroup: string;
  category: "conteudo" | "turma" | "projeto" | "intervencao";
  title: string;
  description: string;
  prerequisiteIssue: string;
  errorRate: number;
  affectedStudentsCount: number;
  affectedStudents: string[];
  learningObjective: string;
  suggestedAction: string;
  timestamp: string;
}

export interface LessonPlanStep {
  stepNumber: number;
  stageTitle: string;
  duration: string;
  description: string;
}

export interface LessonPlanRecord {
  id: string;
  recommendationId: string;
  disciplineId: string;
  disciplineName: string;
  topic: string;
  title: string;
  lessonTitle?: string;
  className?: string;
  status?: "salvo" | "aplicado";
  learningObjective: string;
  prerequisiteToReview: string;
  difficultyDiagnosis: string;
  errorRate: number;
  affectedStudentsCount: number;
  affectedStudents: string[];
  steps: LessonPlanStep[];
  didacticResources: string[];
  estimatedTime: string;
  evaluationStrategy: string;
  createdAt: string;
  appliedToClass?: boolean;
}

export interface TeacherInterventionRecord {
  id: string;
  recommendationId: string;
  recommendationTitle?: string;
  disciplineId?: string;
  actionType?: "plano_aula" | "reforco" | "tutoria" | "notificacao";
  type?: "plano_aula" | "reforco" | "tutoria" | "notificacao";
  statusLabel?: string;
  disciplineName: string;
  topic: string;
  summary: string;
  studentsCount?: number;
  targetStudents?: string[];
  details?: Record<string, any>;
  timestamp?: string;
  createdAt?: string;
}

export interface TeacherOverviewMetrics {
  totalStudents: number;
  activeClasses: number;
  averageCompletionRate: number;
  studentsNeedingAttention: number;
  projectsMentored: number;
  totalInterventionsCompleted: number;
}

