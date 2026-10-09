import React, { useState, useEffect } from "react";
import { UserProfile, UserRole, Discipline, ContentItem, ActivityQuestion, StudentActivityAttempt, NotificationItem } from "./types";
import { initialDisciplines } from "./data/disciplinesData";
import { initialActivityQuestions } from "./data/activitiesData";
import {
  teacherOverviewMetrics,
  mockStudents,
  topicDifficultyStats,
  teacherAiRecommendations,
  mockClasses,
  mockProjectTracking,
  loadTeacherDifficulties,
  loadTeacherRecommendations,
  updateTeacherDataFromStudentAttempt,
} from "./data/teacherData";
import { TEACHER_OFFICIAL_NOTIFICATIONS } from "./data/teacherNotifications";

import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { AuthModal } from "./components/AuthModal";
import { TutorCallView } from "./components/tutor/TutorCallView";
import { OfflineTutorModal } from "./components/tutor/OfflineTutorModal";
import { ensureInitialOfflineCacheSeeded } from "./services/offlineTutorDB";

// Student Views
import { StudentHome } from "./components/student/StudentHome";
import { DisciplinesView } from "./components/student/DisciplinesView";
import { DisciplineDetailView } from "./components/student/DisciplineDetailView";
import { ContentStudyView } from "./components/student/ContentStudyView";
import { ActivityEngine } from "./components/student/ActivityEngine";
import { LearningTrackView } from "./components/student/LearningTrackView";
import { ProgressView } from "./components/student/ProgressView";
import { ProjectsView } from "./components/student/ProjectsView";
import { SimulationLabModal } from "./components/student/SimulationLabModal";
import { DebateSessionModal } from "./components/student/DebateSessionModal";
import { OFFICIAL_STUDENTS_LIST, OfficialStudent } from "./data/studentsData";

// Teacher Views
import { TeacherDashboard } from "./components/teacher/TeacherDashboard";
import { DifficultyMapView } from "./components/teacher/DifficultyMapView";
import { ClassStudentsView } from "./components/teacher/ClassStudentsView";
import { TeacherAiRecommendationsView } from "./components/teacher/TeacherAiRecommendationsView";

// General Views
import { NotificationsView } from "./components/NotificationsView";
import { ProfileView } from "./components/ProfileView";
import { SettingsView } from "./components/SettingsView";
import {
  getSavedProfileAvatar,
  saveProfileAvatar,
  setActiveSessionUserId,
  AVATAR_UPDATED_EVENT,
} from "./components/common/GenericSilhouetteAvatar";

function buildDefaultNotificationsForStudent(user: UserProfile): NotificationItem[] {
  const firstName = (user.name || "Estudante").trim().split(" ")[0];
  const matchedOfficial = OFFICIAL_STUDENTS_LIST.find((s) => s.id === user.id);
  const recommendedTopic =
    matchedOfficial?.postStudyReport?.sessionTopic ||
    "Equações do 2º Grau e Bhaskara";

  return [
    {
      id: `n-1-${user.id}`,
      title: `Lembrete do TutorIA: ${recommendedTopic}`,
      description: `O TutorIA preparou um roteiro socrático personalizado para ${firstName} avançar neste tema.`,
      timestamp: "Há 10 min",
      read: false,
      type: "recommendation",
      sender: "TutorIA - Inteligência Pedagógica",
      senderEmail: "tutoria.ia@profeia.edu.br",
      actionLabel: "Iniciar Tutoria com TutorIA",
      actionTarget: {
        tab: "tutor",
        disciplineId: "matematica",
        topic: recommendedTopic,
      },
      fullBody: `Olá, ${firstName}!

Identifiquei em sua trilha de estudos que podemos aprofundar os conceitos de "${recommendedTopic}".

Preparei um roteiro interativo com analogias visuais no nosso quadro digital e resolução guiada passo a passo. Quando estiver pronto(a), basta iniciar a chamada de tutoria para praticarmos juntos!

Bons estudos!
— TutorIA (Robô Assistente Pedagógico)`,
    },
    {
      id: `n-2-${user.id}`,
      title: "Atividade Avaliativa: Banco de Dados & SQL",
      description: "A lista de comandos DDL/DML e consultas relacionais encerra em 20 de Abril.",
      timestamp: "Há 1 hora",
      read: false,
      type: "deadline",
      sender: "Coordenação do Curso Técnico em Informática",
      senderEmail: "informatica@escola.edu.br",
      deadlineDate: "20 de Abril de 2026 às 23h59",
      actionLabel: "Ir para as Atividades",
      actionTarget: {
        tab: "atividades",
      },
      fullBody: `Prezado(a) ${user.name} (${user.turma || "Turma INFVES3SB"}),

Informamos que o prazo para a submissão dos exercícios práticos de Banco de Dados (Modelagem Conceitual, Relacional e queries SQL) encerra-se no dia 20 de Abril de 2026 às 23h59.

Checklist da Atividade:
1. Criação do script DDL com chaves primárias e estrangeiras bem definidas.
2. Consultas DML utilizando junções (INNER JOIN, LEFT JOIN) e agrupamentos (GROUP BY, HAVING).
3. Otimização de índices e integridade referencial.

Submeta sua resolução na aba Atividades antes do fechamento do prazo.

Atenciosamente,
Coordenação do Curso Técnico em Informática`,
    },
    {
      id: `n-3-${user.id}`,
      title: "Prazo de AP Sis: Casos de Uso (UML)",
      description: "Submissão da modelagem de Casos de Uso e Cenários Expandidos encerra em 18 de Abril.",
      timestamp: "Há 3 horas",
      read: false,
      type: "deadline",
      sender: "Prof. Dr. Ricardo Vasconcelos (Análise e Projeto de Sistemas)",
      senderEmail: "ricardo.vasconcelos@escola.edu.br",
      deadlineDate: "18 de Abril de 2026 às 23h59",
      actionLabel: "Ver Matéria de AP Sis",
      actionTarget: {
        tab: "disciplina",
        disciplineId: "ap-sis",
      },
      fullBody: `Prezado(a) ${firstName} e turma do 3º Ano B - Informática,

A Entrega 2 do projeto semestral de Análise e Projeto de Sistemas (AP Sis) deve contemplar o Diagrama de Casos de Uso completo e a especificação detalhada de pelo menos 3 cenários expandidos (Fluxo Principal, Fluxos Alternativos e Fluxos de Exceção).

Envie o documento compilado pelo portal antes do encerramento do prazo.

Prof. Dr. Ricardo Vasconcelos`,
    },
    {
      id: `n-4-${user.id}`,
      title: "Progresso Adaptativo Atualizado!",
      description: `Parabéns, ${firstName}! Seu desempenho recente desbloqueou novos desafios na trilha adaptativa.`,
      timestamp: "Ontem às 19:40",
      read: true,
      type: "system",
      sender: "Sistema de Avaliação Adaptativa ProfeIA",
      senderEmail: "sistema@profeia.edu.br",
      actionLabel: "Ver Matérias & Progresso",
      actionTarget: {
        tab: "disciplinas",
      },
      fullBody: `Parabéns pelo seu empenho e dedicação, ${user.name}!

Após a realização das atividades diagnósticas e sessões orientadas pelo TutorIA, seu perfil adaptativo registrou evolução consistente nas competências da turma INFVES3SB. Continue com esse ritmo!

Equipe Pedagógica ProfeIA`,
    },
  ];
}

function loadUserNotificationsFromStorage(user: UserProfile): NotificationItem[] {
  if (user.role === "PROFESSOR") {
    try {
      const saved = localStorage.getItem(`profeia_user_${user.id}_notifications_v2`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return TEACHER_OFFICIAL_NOTIFICATIONS;
  }
  try {
    const saved = localStorage.getItem(`profeia_user_${user.id}_notifications_v2`);
    if (saved) return JSON.parse(saved);
  } catch {}
  return buildDefaultNotificationsForStudent(user);
}

function loadUserDisciplinesFromStorage(userId: string): Discipline[] {
  try {
    const saved = localStorage.getItem(`profeia_user_${userId}_disciplines_v2`);
    if (saved) {
      const progressMap: Record<string, number> = JSON.parse(saved);
      return initialDisciplines.map((d) => ({
        ...d,
        progressPercent:
          typeof progressMap[d.id] === "number" ? progressMap[d.id] : d.progressPercent,
      }));
    }
  } catch {}

  // Gera progresso inicial determinístico por aluno para que cada conta tenha seus próprios dados
  if (userId && userId !== "aluno-raissa" && userId.startsWith("aluno-")) {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = (hash << 5) - hash + userId.charCodeAt(i);
      hash |= 0;
    }
    const offset = (Math.abs(hash) % 19) - 9;
    return initialDisciplines.map((d, idx) => ({
      ...d,
      progressPercent: Math.min(
        98,
        Math.max(25, d.progressPercent + offset + ((idx % 3) - 1) * 4)
      ),
    }));
  }

  return initialDisciplines.map((d) => ({ ...d }));
}

function saveUserDisciplinesToStorage(userId: string, list: Discipline[]): void {
  if (!userId) return;
  try {
    const map: Record<string, number> = {};
    list.forEach((d) => {
      map[d.id] = d.progressPercent;
    });
    localStorage.setItem(`profeia_user_${userId}_disciplines_v2`, JSON.stringify(map));
  } catch {}
}

function loadUserLastStudiedFromStorage(
  userId: string
): { disciplineId: string; contentId: string } {
  try {
    const saved = localStorage.getItem(`profeia_user_${userId}_last_studied_v2`);
    if (saved) return JSON.parse(saved);
  } catch {}

  if (userId && userId !== "aluno-raissa" && userId.startsWith("aluno-")) {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = (hash << 5) - hash + userId.charCodeAt(i);
      hash |= 0;
    }
    const discIdx = Math.abs(hash) % initialDisciplines.length;
    const disc = initialDisciplines[discIdx] || initialDisciplines[0];
    const firstContent = disc.modules[0]?.contents[0];
    if (firstContent) {
      return { disciplineId: disc.id, contentId: firstContent.id };
    }
  }

  return {
    disciplineId: initialDisciplines[0].id,
    contentId: initialDisciplines[0].modules[0]?.contents[0]?.id || "",
  };
}

function loadUserAttemptsFromStorage(userId: string): StudentActivityAttempt[] {
  try {
    const saved = localStorage.getItem(`profeia_user_${userId}_attempts_v2`);
    if (saved) return JSON.parse(saved);
  } catch {}
  return [];
}

export default function App() {
  // Sessão desconecta ao fechar ou recarregar a sessão; credenciais salvas no formulário para 1 clique
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Estado do usuário autenticado na sessão atual (isolado por conta)
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    setActiveSessionUserId(null);
    return {
      id: "aluno-raissa",
      name: "Raíssa Teixeira Magalhães",
      email: "raissa.teixeira.magalhaes@escola.com",
      role: "ALUNO",
      avatar: "",
      turma: "Turma INFVES3SB",
      course: "Técnico em Informática Integrado (Vespertino)",
      enrollmentId: "2026-INF-0412",
      streakDays: 7,
      studyHoursTotal: 42,
      dailyGoalMinutes: 45,
      dailyProgressMinutes: 30,
      hasFaceId: true,
      faceIdData: "sha256-bio-raissa-teixeira-enrolled",
    };
  });

  const [userName, setUserName] = useState<string>(currentUser.name);
  const [teacherName, setTeacherName] = useState<string>("Adnaldo Alves");
  const [currentRole, setCurrentRole] = useState<"ALUNO" | "PROFESSOR">("ALUNO");

  // Mantém currentUser.avatar sincronizado em tempo real apenas para o currentUser.id autenticado
  useEffect(() => {
    const syncAvatar = () => {
      if (!isAuthenticated || !currentUser.id) return;
      const updatedAvatar = getSavedProfileAvatar(currentUser.role, currentUser.id);
      setCurrentUser((prev) =>
        prev.avatar === updatedAvatar ? prev : { ...prev, avatar: updatedAvatar }
      );
    };
    window.addEventListener(AVATAR_UPDATED_EVENT, syncAvatar);
    window.addEventListener("storage", syncAvatar);
    return () => {
      window.removeEventListener(AVATAR_UPDATED_EVENT, syncAvatar);
      window.removeEventListener("storage", syncAvatar);
    };
  }, [isAuthenticated, currentUser.role, currentUser.id]);

  // Current active navigation tab (inicia no dashboard correspondente)
  const [currentTab, setCurrentTab] = useState<string>("home");

  // Estado do Menu Lateral Retrátil (Hambúrguer) - Fechado por padrão
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [offlineTutorModalOpen, setOfflineTutorModalOpen] = useState<boolean>(false);

  // Initialize & seed local IndexedDB offline cache on mount
  useEffect(() => {
    ensureInitialOfflineCacheSeeded().catch(() => {});
  }, []);

  // Disciplines, attempts, & lastStudied state isolados por usuário
  const [disciplines, setDisciplines] = useState<Discipline[]>(initialDisciplines);
  const [questions] = useState<ActivityQuestion[]>(initialActivityQuestions);
  const [studentAttempts, setStudentAttempts] = useState<StudentActivityAttempt[]>([]);
  const [lastStudied, setLastStudied] = useState<{ disciplineId: string; contentId: string }>(() =>
    loadUserLastStudiedFromStorage("aluno-raissa")
  );
  const [teacherDifficulties, setTeacherDifficulties] = useState(() =>
    loadTeacherDifficulties()
  );
  const [teacherRecommendations, setTeacherRecommendations] = useState(() =>
    loadTeacherRecommendations()
  );

  // Drilldown selection state
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<string | null>(null);
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [selectedContentTab, setSelectedContentTab] = useState<
    "resumo" | "pesquisa" | "flashcards" | "videos" | "mapas-mentais" | "mapas-conceituais" | undefined
  >(undefined);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  // Selected student for teacher detail view & post-study report (Requisito 5)
  const [selectedOfficialStudentId, setSelectedOfficialStudentId] = useState<string | null>("aluno-raissa");

  // Innovative Modules Modals (Requisito 4)
  const [simulationLabOpen, setSimulationLabOpen] = useState(false);
  const [simulationDisciplineId, setSimulationDisciplineId] = useState<string | undefined>(undefined);
  const [debateSessionOpen, setDebateSessionOpen] = useState(false);
  const [debateDisciplineId, setDebateDisciplineId] = useState<string | undefined>(undefined);

  const handleOpenSimulationLab = (disciplineId?: string) => {
    setSimulationDisciplineId(disciplineId);
    setSimulationLabOpen(true);
  };

  const handleOpenDebateSession = (disciplineId?: string) => {
    setDebateDisciplineId(disciplineId);
    setDebateSessionOpen(true);
  };

  // TutorIA modal call state - Inicia em detecção dinâmica sem travar em Matemática
  const [tutorCallOpen, setTutorCallOpen] = useState(false);
  const [tutorCallDisciplineId, setTutorCallDisciplineId] = useState("geral");
  const [tutorCallTopic, setTutorCallTopic] = useState("Detecção Dinâmica");

  // Central de Notificações isolada para o usuário autenticado
  const [studentNotifications, setStudentNotifications] = useState<NotificationItem[]>(() =>
    buildDefaultNotificationsForStudent(currentUser)
  );
  const [teacherNotifications, setTeacherNotifications] = useState<NotificationItem[]>(
    TEACHER_OFFICIAL_NOTIFICATIONS
  );

  // Notificações ativas de acordo com o perfil atual (Aluno ou Professor)
  const currentNotifications =
    currentUser.role === "PROFESSOR" ? teacherNotifications : studentNotifications;
  const unreadCount = currentNotifications.filter((n) => !n.read).length;

  // Handle manual username update (Aluno ou Professor com persistência vinculada ao ID único do usuário)
  const handleUpdateUserName = (newName: string) => {
    const clean = newName.trim();
    if (!clean) return;
    try {
      localStorage.setItem(`profeia_user_${currentUser.id}_name`, clean);
    } catch {}
    if (currentUser.role === "PROFESSOR") {
      setTeacherName(clean);
      try {
        localStorage.setItem("profeia_teacher_name", clean);
        localStorage.setItem("profeia_remembered_prof_name", clean);
      } catch {}
      setCurrentUser((prev) => ({ ...prev, name: clean }));
    } else {
      setUserName(clean);
      try {
        localStorage.setItem("profeia_remembered_student_name", clean);
      } catch {}
      setCurrentUser((prev) => ({ ...prev, name: clean }));
    }
  };

  // Handle manual email update (Aluno ou Professor com persistência vinculada ao ID único do usuário)
  const handleUpdateUserEmail = (newEmail: string) => {
    const clean = newEmail.trim();
    if (!clean) return;
    try {
      localStorage.setItem(`profeia_user_${currentUser.id}_email`, clean);
    } catch {}
    if (currentUser.role === "PROFESSOR") {
      try {
        localStorage.setItem("profeia_teacher_email", clean);
        localStorage.setItem("profeia_remembered_prof_email", clean);
      } catch {}
      setCurrentUser((prev) => ({ ...prev, email: clean }));
    } else {
      try {
        localStorage.setItem("profeia_remembered_student_email", clean);
      } catch {}
      setCurrentUser((prev) => ({ ...prev, email: clean }));
    }
  };

  // Global back navigation handler
  const handleGlobalBack = () => {
    const defaultHome = currentUser.role === "PROFESSOR" ? "prof-dashboard" : "home";
    if (currentTab === "content-study") {
      setCurrentTab("disciplina-detail");
    } else if (currentTab === "disciplina-detail") {
      setCurrentTab("disciplinas");
    } else {
      setCurrentTab(defaultHome);
    }
  };

  // Desconectar da sessão atual, limpar estados visuais/sessão anterior e retornar ao login
  const handleDisconnect = () => {
    setActiveSessionUserId(null);
    setIsSidebarOpen(false);
    setTutorCallOpen(false);
    setSimulationLabOpen(false);
    setDebateSessionOpen(false);
    setOfflineTutorModalOpen(false);
    setSelectedDisciplineId(null);
    setSelectedContentId(null);
    setSelectedQuestionId(null);
    setIsAuthenticated(false);
    setAuthModalOpen(true);
  };

  // Sucesso de autenticação na tela de login: carrega exclusivamente os dados do novo usuário
  const handleLoginSuccess = (newUser: UserProfile) => {
    setActiveSessionUserId(newUser.id);

    const persistedName =
      localStorage.getItem(`profeia_user_${newUser.id}_name`) || newUser.name;
    const persistedEmail =
      localStorage.getItem(`profeia_user_${newUser.id}_email`) || newUser.email;
    const savedAvatar = getSavedProfileAvatar(newUser.role, newUser.id);

    let savedDailyProgress = newUser.dailyProgressMinutes;
    try {
      const rawMetrics = localStorage.getItem(`profeia_user_${newUser.id}_metrics_v2`);
      if (rawMetrics) {
        const parsed = JSON.parse(rawMetrics);
        if (typeof parsed.dailyProgressMinutes === "number") {
          savedDailyProgress = parsed.dailyProgressMinutes;
        }
      }
    } catch {}

    const hydratedUser: UserProfile = {
      ...newUser,
      name: persistedName,
      email: persistedEmail,
      avatar: savedAvatar,
      dailyProgressMinutes: savedDailyProgress,
    };

    setCurrentUser(hydratedUser);
    if (hydratedUser.role === "ALUNO") {
      setUserName(hydratedUser.name);
      setDisciplines(loadUserDisciplinesFromStorage(hydratedUser.id));
      setStudentAttempts(loadUserAttemptsFromStorage(hydratedUser.id));
      setLastStudied(loadUserLastStudiedFromStorage(hydratedUser.id));
      setStudentNotifications(loadUserNotificationsFromStorage(hydratedUser));
    } else {
      setTeacherName(hydratedUser.name);
      setDisciplines(initialDisciplines.map((d) => ({ ...d })));
      setTeacherNotifications(loadUserNotificationsFromStorage(hydratedUser));
    }

    setSelectedDisciplineId(null);
    setSelectedContentId(null);
    setSelectedQuestionId(null);
    setIsSidebarOpen(false);
    setCurrentRole(hydratedUser.role);
    setIsAuthenticated(true);
    setAuthModalOpen(false);
    setCurrentTab(hydratedUser.role === "ALUNO" ? "home" : "prof-dashboard");
  };

  // Open TutorIA Call with context (Sem travar em Matemática)
  const handleOpenTutor = (disciplineId?: string, topic?: string) => {
    setTutorCallDisciplineId(disciplineId || "geral");
    setTutorCallTopic(topic || "Detecção Dinâmica");
    setTutorCallOpen(true);
  };

  // Select a discipline to view details
  const handleSelectDiscipline = (disciplineId: string) => {
    setSelectedDisciplineId(disciplineId);
    setCurrentTab("disciplina-detail");
  };

  // Open a specific topic for study and persist "onde parei de estudar" para o usuário atual
  const handleOpenContent = (disciplineId: string, contentId: string, initialTab?: any) => {
    const normalizedDiscId =
      disciplineId === "pratica-estagio-tcc"
        ? "materia-pratica-estagio-tcc"
        : disciplineId === "robotica"
        ? "robotica-educacional"
        : disciplineId;

    const targetDisc =
      disciplines.find((d) => d.id === normalizedDiscId || d.id === disciplineId) ||
      disciplines[0];

    const allDiscContents = targetDisc.modules.flatMap((m) => m.contents);
    const legacySlugMap: Record<string, string> = {
      "mat-eq-2-grau": "matematica-top-1",
      "bd-sql-consultas": "banco-de-dados-top-31",
      "tcc-estrutura-completa": "materia-pratica-estagio-tcc-top-1",
      "bio-dna-rna": "biologia-top-24",
      "aps-requisitos-uml": "analise-projeto-sistemas-top-2",
    };
    const resolvedId = legacySlugMap[contentId] || contentId;
    const matchedContent =
      allDiscContents.find(
        (c) =>
          c.id === resolvedId ||
          c.title.toLowerCase() === resolvedId.toLowerCase() ||
          c.title.toLowerCase().includes(resolvedId.toLowerCase())
      ) || allDiscContents[0];

    setSelectedDisciplineId(targetDisc.id);
    setSelectedContentId(matchedContent.id);
    if (initialTab) {
      setSelectedContentTab(initialTab);
    } else {
      setSelectedContentTab("resumo");
    }
    if (currentUser.role === "ALUNO" && currentUser.id) {
      const nextLast = { disciplineId: targetDisc.id, contentId: matchedContent.id };
      setLastStudied(nextLast);
      try {
        localStorage.setItem(
          `profeia_user_${currentUser.id}_last_studied_v2`,
          JSON.stringify(nextLast)
        );
      } catch {}
    }
    setCurrentTab("content-study");
  };

  // Open an activity question
  const handleOpenActivity = (questionId?: string) => {
    if (questionId) setSelectedQuestionId(questionId);
    setCurrentTab("atividades");
  };

  // Record an activity attempt and update student daily metrics + teacher difficulty/recommendation data
  const handleRecordAttempt = (attempt: StudentActivityAttempt) => {
    setStudentAttempts((prev) => {
      const next = [attempt, ...prev];
      try {
        localStorage.setItem(
          `profeia_user_${currentUser.id}_attempts_v2`,
          JSON.stringify(next)
        );
      } catch {}
      return next;
    });

    // Increase daily progress by 5 minutes for the current user
    setCurrentUser((prev) => {
      const nextProgress = Math.min(
        prev.dailyGoalMinutes,
        prev.dailyProgressMinutes + 5
      );
      try {
        localStorage.setItem(
          `profeia_user_${prev.id}_metrics_v2`,
          JSON.stringify({ dailyProgressMinutes: nextProgress })
        );
      } catch {}
      return {
        ...prev,
        dailyProgressMinutes: nextProgress,
      };
    });

    // If correct, update discipline progress for the current user
    if (attempt.isCorrect) {
      setDisciplines((prev) => {
        const next = prev.map((d) => {
          if (d.id === attempt.disciplineId) {
            return {
              ...d,
              progressPercent: Math.min(100, d.progressPercent + 2),
            };
          }
          return d;
        });
        saveUserDisciplinesToStorage(currentUser.id, next);
        return next;
      });
    }

    // Dynamically synchronize teacher difficulties and AI recommendations
    const updated = updateTeacherDataFromStudentAttempt(attempt, currentUser.name);
    setTeacherDifficulties(updated.difficulties);
    setTeacherRecommendations(updated.recommendations);
  };

  // Notification handlers sincronizados e persistidos para o usuário ativo
  const handleMarkAsRead = (id: string) => {
    if (currentUser.role === "PROFESSOR") {
      setTeacherNotifications((prev) => {
        const next = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
        try {
          localStorage.setItem(
            `profeia_user_${currentUser.id}_notifications_v2`,
            JSON.stringify(next)
          );
        } catch {}
        return next;
      });
    } else {
      setStudentNotifications((prev) => {
        const next = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
        try {
          localStorage.setItem(
            `profeia_user_${currentUser.id}_notifications_v2`,
            JSON.stringify(next)
          );
        } catch {}
        return next;
      });
    }
  };

  const handleClearAllNotifications = () => {
    if (currentUser.role === "PROFESSOR") {
      setTeacherNotifications((prev) => {
        const next = prev.map((n) => ({ ...n, read: true }));
        try {
          localStorage.setItem(
            `profeia_user_${currentUser.id}_notifications_v2`,
            JSON.stringify(next)
          );
        } catch {}
        return next;
      });
    } else {
      setStudentNotifications((prev) => {
        const next = prev.map((n) => ({ ...n, read: true }));
        try {
          localStorage.setItem(
            `profeia_user_${currentUser.id}_notifications_v2`,
            JSON.stringify(next)
          );
        } catch {}
        return next;
      });
    }
  };

  // Confirmação de agendamento de nivelamento coletivo com disparo automático de notificação para a turma
  const handleScheduleLeveling = (details: {
    topicId: string;
    topicName: string;
    disciplineName: string;
    date: string;
    time: string;
    format: string;
    affectedStudents: string[];
  }) => {
    const newId = `notif-leveling-${Date.now()}`;
    const newTeacherNotif: NotificationItem = {
      id: newId,
      title: `Nivelamento Coletivo Agendado: ${details.topicName}`,
      description: `Oficina confirmada para ${details.date} às ${details.time} (${details.disciplineName}). Notificação automática enviada para os ${details.affectedStudents.length} alunos afetados da turma INFVES3SB.`,
      timestamp: "Agora",
      read: false,
      type: "alert",
      sender: "Gestão Pedagógica de Nivelamento",
      actionLabel: "Ver Mapa de Dificuldades",
      actionTarget: {
        tab: "prof-dificuldades",
      },
      fullBody: `Oficina de Nivelamento Coletivo agendada com sucesso!\n\nDisciplina: ${details.disciplineName}\nTópico: ${details.topicName}\nData: ${details.date} às ${details.time}\nFormato: ${details.format}\nAlunos Convocados da Turma INFVES3SB:\n${details.affectedStudents.map((s, i) => `${i + 1}. ${s}`).join("\n")}`,
    };

    const newStudentNotif: NotificationItem = {
      id: `student-${newId}`,
      title: `Oficina de Nivelamento: ${details.topicName}`,
      description: `O Prof. ${teacherName} agendou uma oficina de revisão para ${details.date} às ${details.time} em ${details.disciplineName}.`,
      timestamp: "Agora",
      read: false,
      type: "recommendation",
      sender: `Prof. ${teacherName}`,
      actionLabel: "Abrir Conteúdo",
      actionTarget: {
        tab: "disciplinas",
      },
      fullBody: `Você foi convocado(a) para a oficina de nivelamento coletivo em ${details.disciplineName} focada em ${details.topicName}.\nData: ${details.date} às ${details.time}.\nParticipe para superar os pré-requisitos fundamentais!`,
    };

    setTeacherNotifications((prev) => [newTeacherNotif, ...prev]);
    setStudentNotifications((prev) => [newStudentNotif, ...prev]);
  };

  // Handler real para as ações de "Sugestões Pedagógicas da IA"
  const handleTeacherAiAction = (
    actionType: string,
    recTitle: string,
    details?: any
  ) => {
    if (actionType === "Agendar Tutoria" && details) {
      handleScheduleLeveling(details);
      return;
    }

    const nowId = `notif-ia-${Date.now()}`;
    if (actionType === "Criar Plano de Aula" && details) {
      const teacherNotif: NotificationItem = {
        id: nowId,
        title: `Plano de Aula Salvo: ${details.disciplineName}`,
        description: `Plano "${details.lessonTitle}" registrado para a turma ${details.className}.`,
        timestamp: "Agora",
        read: false,
        type: "recommendation",
        sender: "Copiloto Pedagógico ProfeIA",
        actionLabel: "Ver Sugestões da IA",
        actionTarget: { tab: "prof-ia" },
        fullBody: `Plano de Aula: ${details.lessonTitle}\nDisciplina: ${details.disciplineName}\nTópico: ${details.topic}\nObjetivo: ${details.learningObjective}`,
      };
      setTeacherNotifications((prev) => [teacherNotif, ...prev]);
    } else if (actionType === "Enviar Atividade de Reforço" && details) {
      const teacherNotif: NotificationItem = {
        id: nowId,
        title: `Reforço Enviado: ${details.disciplineName}`,
        description: `${details.formatLabel} enviado para ${details.selectedStudents?.length || 0} aluno(s) sobre ${details.topicName}.`,
        timestamp: "Agora",
        read: false,
        type: "recommendation",
        sender: "Gestão Pedagógica de Nivelamento",
        actionLabel: "Ver Sugestões da IA",
        actionTarget: { tab: "prof-ia" },
        fullBody: `Reforço pedagógico (${details.formatLabel}) enviado para ${details.selectedStudents?.join(", ")}.`,
      };
      const studentNotif: NotificationItem = {
        id: `st-${nowId}`,
        title: `Novo Material de Reforço: ${details.disciplineName}`,
        description: `O Prof. ${teacherName} disponibilizou ${details.formatLabel} sobre ${details.topicName}.`,
        timestamp: "Agora",
        read: false,
        type: "recommendation",
        sender: `Prof. ${teacherName}`,
        actionLabel: "Abrir Disciplinas",
        actionTarget: { tab: "disciplinas", disciplineId: details.disciplineId },
        fullBody: `Material de reforço liberado em ${details.disciplineName}: ${details.topicName} (${details.formatLabel}).${details.teacherNote ? `\n\nObservação do professor: ${details.teacherNote}` : ""}`,
      };
      setTeacherNotifications((prev) => [teacherNotif, ...prev]);
      setStudentNotifications((prev) => [studentNotif, ...prev]);
    } else if (actionType === "Notificar Alunos" && details) {
      const teacherNotif: NotificationItem = {
        id: nowId,
        title: `Notificação Enviada (${details.recipients?.length || 0} alunos)`,
        description: `${details.title} — Ação: ${details.recommendedAction}.`,
        timestamp: "Agora",
        read: false,
        type: "alert",
        sender: "Central de Comunicação Docente",
        actionLabel: "Ver Sugestões da IA",
        actionTarget: { tab: "prof-ia" },
        fullBody: `${details.message}\n\nDestinatários: ${details.recipients?.join(", ")}`,
      };
      const studentNotif: NotificationItem = {
        id: `st-${nowId}`,
        title: details.title || `Aviso do Prof. ${teacherName}`,
        description: details.message,
        timestamp: "Agora",
        read: false,
        type: "recommendation",
        sender: `Prof. ${teacherName}`,
        actionLabel: "Iniciar Ação Recomendada",
        actionTarget: { tab: "atividades" },
        fullBody: `${details.message}\n\nAção recomendada: ${details.recommendedAction}`,
      };
      setTeacherNotifications((prev) => [teacherNotif, ...prev]);
      setStudentNotifications((prev) => [studentNotif, ...prev]);
    }
  };

  // Handle direct actions triggered from within notifications modal
  const handleNotificationAction = (notif: NotificationItem) => {
    if (notif.actionTarget?.tab) {
      if (notif.actionTarget.tab === "tutor") {
        handleOpenTutor(
          notif.actionTarget.disciplineId,
          notif.actionTarget.topic
        );
      } else if (notif.actionTarget.tab === "disciplina" && notif.actionTarget.disciplineId) {
        handleSelectDiscipline(notif.actionTarget.disciplineId);
      } else {
        setCurrentTab(notif.actionTarget.tab);
      }
    } else if (notif.type === "deadline") {
      setCurrentTab("atividades");
    } else if (notif.type === "recommendation" || notif.type === "tutor") {
      handleOpenTutor();
    }
  };

  // Get active discipline object if selected
  const currentDiscipline =
    disciplines.find((d) => d.id === selectedDisciplineId) || disciplines[0];

  // Get active content item if selected
  const currentContent =
    currentDiscipline?.modules
      .flatMap((m) => m.contents)
      .find((c) => c.id === selectedContentId) ||
    currentDiscipline?.modules[0]?.contents[0];

  // Se não estiver autenticado, exibe a tela de login inicial com credenciais salvas para 1 clique
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-sans selection:bg-indigo-600 selection:text-white">
        <AuthModal
          isOpen={true}
          isInitialScreen={true}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Universal Navbar */}
      <Navbar
        user={currentUser}
        disciplines={disciplines}
        notifications={currentNotifications}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        onBack={
          currentTab !== (currentUser.role === "PROFESSOR" ? "prof-dashboard" : "home")
            ? handleGlobalBack
            : undefined
        }
        onOpenTutor={() => handleOpenTutor()}
        onOpenOfflineTutor={() => setOfflineTutorModalOpen(true)}
        onSelectDiscipline={handleSelectDiscipline}
        onSelectContent={handleOpenContent}
        onOpenContent={handleOpenContent}
        onOpenActivity={handleOpenActivity}
        onOpenProfile={() => setCurrentTab("perfil")}
        onOpenLogin={handleDisconnect}
        onMarkNotificationRead={handleMarkAsRead}
        onNavigateToNotifications={() => setCurrentTab("notificacoes")}
        onNavigateToAction={handleNotificationAction}
        unreadCount={unreadCount}
      />

      {/* Main Responsive Body (Sidebar + Content Container) */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar Retrátil (Drawer com Menu Hambúrguer) */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          currentTab={currentTab}
          role={currentUser.role}
          user={currentUser}
          onNavigate={(tab) => {
            setIsSidebarOpen(false);
            if (tab === "tutoria") {
              handleOpenTutor();
            } else if (tab === "tutoria-offline") {
              setOfflineTutorModalOpen(true);
            } else {
              setCurrentTab(tab);
            }
          }}
          unreadCount={unreadCount}
          currentDiscipline={currentDiscipline}
          disciplines={disciplines}
          onOpenOfflineModal={() => setOfflineTutorModalOpen(true)}
          onOpenContent={(disciplineId, contentId) => {
            setIsSidebarOpen(false);
            handleOpenContent(disciplineId, contentId);
          }}
        />

        {/* Dynamic Center Canvas with smooth vertical scrolling */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 pb-24 md:pb-12 overflow-y-auto">
          {/* SHARED DISCIPLINE CATALOG & DEEP STUDY CONTENT (REQUISITO 2: SINCRONIZAÇÃO ALUNO & PROFESSOR) */}
          {currentTab === "disciplinas" && (
            <DisciplinesView
              disciplines={disciplines}
              onSelectDiscipline={handleSelectDiscipline}
              onOpenTutor={handleOpenTutor}
              onOpenSimulationLab={handleOpenSimulationLab}
              onOpenDebateSession={handleOpenDebateSession}
            />
          )}

          {currentTab === "disciplina-detail" && currentDiscipline && (
            <DisciplineDetailView
              discipline={currentDiscipline}
              onBack={() => setCurrentTab("disciplinas")}
              onOpenContent={handleOpenContent}
              onOpenTutorWithContext={handleOpenTutor}
            />
          )}

          {currentTab === "content-study" && currentDiscipline && currentContent && (
            <ContentStudyView
              discipline={currentDiscipline}
              content={currentContent}
              userId={currentUser.id}
              userName={currentUser.name}
              initialTab={selectedContentTab || "resumo"}
              onBack={() => setCurrentTab("disciplina-detail")}
              onOpenTutor={handleOpenTutor}
              onOpenActivity={handleOpenActivity}
              onOpenOfflineTutor={() => setOfflineTutorModalOpen(true)}
            />
          )}

          {/* STUDENT ROLE VIEWS */}
          {currentUser.role === "ALUNO" && (
            <>
              {currentTab === "home" && (
                <StudentHome
                  user={currentUser}
                  disciplines={disciplines}
                  questions={questions}
                  attempts={studentAttempts}
                  lastStudied={lastStudied}
                  onOpenTutor={handleOpenTutor}
                  onSelectDiscipline={handleSelectDiscipline}
                  onOpenContent={handleOpenContent}
                  onOpenActivity={handleOpenActivity}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                  onOpenSimulationLab={handleOpenSimulationLab}
                  onOpenDebateSession={handleOpenDebateSession}
                />
              )}

              {currentTab === "atividades" && (
                <ActivityEngine
                  questions={questions}
                  initialQuestionId={selectedQuestionId || undefined}
                  onBack={() => setCurrentTab("home")}
                  onOpenTutor={handleOpenTutor}
                  onOpenContent={handleOpenContent}
                  onRecordAttempt={handleRecordAttempt}
                />
              )}

              {currentTab === "progresso" && (
                <ProgressView
                  user={currentUser}
                  disciplines={disciplines}
                  attempts={studentAttempts}
                  onSelectDiscipline={handleSelectDiscipline}
                  onOpenContent={handleOpenContent}
                  onOpenTutor={handleOpenTutor}
                />
              )}

              {currentTab === "trilha" && (
                <LearningTrackView
                  disciplines={disciplines}
                  onOpenContent={handleOpenContent}
                  onOpenTutor={handleOpenTutor}
                />
              )}
            </>
          )}

          {/* TEACHER ROLE VIEWS */}
          {currentUser.role === "PROFESSOR" && (
            <>
              {currentTab === "prof-dashboard" && (
                <TeacherDashboard
                  metrics={teacherOverviewMetrics}
                  students={mockStudents}
                  difficulties={teacherDifficulties}
                  recommendations={teacherRecommendations}
                  classes={mockClasses}
                  teacherName={teacherName}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                  onSelectStudent={(st) => {
                    setSelectedOfficialStudentId(st.id);
                    setCurrentTab("prof-alunos");
                  }}
                />
              )}

              {(currentTab === "prof-turmas" || currentTab === "prof-alunos") && (
                <ClassStudentsView
                  selectedStudentId={selectedOfficialStudentId}
                  onSelectStudentId={(id) => setSelectedOfficialStudentId(id)}
                />
              )}

              {currentTab === "prof-dificuldades" && (
                <DifficultyMapView
                  difficulties={teacherDifficulties}
                  onOpenRecommendationModal={() => setCurrentTab("prof-ia")}
                  onScheduleLeveling={handleScheduleLeveling}
                />
              )}

              {currentTab === "prof-ia" && (
                <TeacherAiRecommendationsView
                  recommendations={teacherRecommendations}
                  difficulties={teacherDifficulties}
                  onTriggerAction={handleTeacherAiAction}
                />
              )}
            </>
          )}

          {/* COMMON VIEWS FOR BOTH ROLES */}
          {currentTab === "notificacoes" && (
            <NotificationsView
              notifications={currentNotifications}
              onMarkAsRead={handleMarkAsRead}
              onClearAll={handleClearAllNotifications}
              onNavigateToContext={handleNotificationAction}
              studentName={currentUser.role === "PROFESSOR" ? teacherName : userName}
              userEmail={currentUser.email}
              userRole={currentUser.role === "PROFESSOR" ? "teacher" : "student"}
            />
          )}

          {currentTab === "perfil" && (
            <ProfileView
              user={currentUser}
              userName={userName}
              userAvatar={currentUser.avatar}
              onUpdateName={handleUpdateUserName}
              onUpdateAvatar={(newAvatar) => {
                saveProfileAvatar(newAvatar, currentUser.role, currentUser.id);
                setCurrentUser((prev) => ({ ...prev, avatar: newAvatar }));
              }}
              onSelectOfficialStudent={(student) => {
                try {
                  localStorage.setItem("profeia_remembered_student_name", student.name);
                  localStorage.setItem("profeia_remembered_student_email", student.email);
                } catch {}
                handleLoginSuccess({
                  id: student.id,
                  name: student.name,
                  email: student.email,
                  role: "ALUNO",
                  avatar: getSavedProfileAvatar("ALUNO", student.id),
                  turma: `Turma ${student.classCode}`,
                  course: student.course,
                  enrollmentId: student.enrollmentId,
                  streakDays: student.streakDays,
                  studyHoursTotal: student.studyHoursTotal,
                  dailyGoalMinutes: 45,
                  dailyProgressMinutes: Math.min(45, Math.round(student.engagementScore * 0.42)),
                });
                setCurrentTab("perfil");
              }}
              onOpenLogin={handleDisconnect}
            />
          )}

          {currentTab === "configuracoes" && (
            <SettingsView
              user={currentUser}
              onUpdateUserName={handleUpdateUserName}
              onUpdateUserEmail={handleUpdateUserEmail}
              onBack={handleGlobalBack}
            />
          )}
        </main>
      </div>

      {/* REQUISITO 4: MODAL DO LABORATÓRIO DE SIMULAÇÃO VIVA */}
      <SimulationLabModal
        isOpen={simulationLabOpen}
        onClose={() => setSimulationLabOpen(false)}
        studentName={userName}
        initialDisciplineId={simulationDisciplineId}
      />

      {/* REQUISITO 4: MODAL DA SESSÃO DE DEBATES SOCRÁTICOS */}
      <DebateSessionModal
        isOpen={debateSessionOpen}
        onClose={() => setDebateSessionOpen(false)}
        studentName={userName}
        initialDisciplineId={debateDisciplineId}
      />

      {/* Synchronous Real-Time Educational Tutor Call (Modal Overlay with Voice/Video/Whiteboard) */}
      {tutorCallOpen && (
        <TutorCallView
          initialDisciplineId={tutorCallDisciplineId}
          initialTopic={tutorCallTopic}
          disciplines={disciplines}
          studentName={userName}
          studentAvatar={currentUser.avatar}
          onCloseCall={() => setTutorCallOpen(false)}
        />
      )}

      {/* Offline Tutoring & Local IndexedDB Cache Modal */}
      <OfflineTutorModal
        isOpen={offlineTutorModalOpen}
        onClose={() => setOfflineTutorModalOpen(false)}
        disciplines={disciplines}
        onOpenCachedContent={(disciplineId, contentId) =>
          handleOpenContent(disciplineId, contentId, "resumo")
        }
        onOpenVoiceTutor={(disciplineId, topic) =>
          handleOpenTutor(disciplineId, topic)
        }
      />

      {/* Functional Auth Modal with Role Selection and Password Recovery */}
      <AuthModal
        isOpen={authModalOpen}
        onLoginSuccess={handleLoginSuccess}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}
