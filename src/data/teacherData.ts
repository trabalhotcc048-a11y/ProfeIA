import {
  TurmaData,
  AlunoData,
  DifficultyRecord,
  ProjectItem,
  AIPedagogicalAlert,
  TopicDifficultyStat,
  TeacherAiRecommendation,
  LessonPlanRecord,
  TeacherInterventionRecord,
  StudentActivityAttempt,
} from "../types";
import { OFFICIAL_STUDENTS_LIST, CLASS_CODE, CLASS_NAME, CLASS_COURSE } from "./studentsData";
import { getBlueprintForDiscipline } from "./pedagogicalPlansData";

export const sampleTurmas: TurmaData[] = [
  {
    id: "turma-3a-info",
    name: "3º Ano A - Técnico em Informática",
    course: "Técnico em Informática Integrado ao Ensino Médio",
    shift: "Manhã",
    studentsCount: 32,
    averageGrade: 7.8,
    completionRate: 84,
    criticalGapsCount: 4
  },
  {
    id: "turma-3b-info",
    name: "3º Ano B - Técnico em Informática",
    course: "Técnico em Informática Integrado ao Ensino Médio",
    shift: "Tarde",
    studentsCount: 29,
    averageGrade: 7.2,
    completionRate: 76,
    criticalGapsCount: 7
  },
  {
    id: "turma-2a-redes",
    name: "2º Ano A - Técnico em Redes",
    course: "Técnico em Redes de Computadores",
    shift: "Manhã",
    studentsCount: 28,
    averageGrade: 8.1,
    completionRate: 89,
    criticalGapsCount: 2
  },
  {
    id: "turma-1b-multi",
    name: "1º Ano B - Multimídia e Design",
    course: "Técnico em Comunicação Visual",
    shift: "Tarde",
    studentsCount: 34,
    averageGrade: 8.4,
    completionRate: 91,
    criticalGapsCount: 3
  }
];

export const sampleAlunos: AlunoData[] = [
  {
    id: "aluno-1",
    name: "Lucas Mendes da Silva",
    email: "lucas.mendes@escola.edu.br",
    turmaId: "turma-3a-info",
    turmaName: "3º Ano A - Informática",
    avatar: "",
    attendancePercent: 94,
    overallGrade: 8.2,
    activitiesCompleted: 38,
    totalActivities: 45,
    streakDays: 7,
    difficultiesCount: 1,
    recentDifficulties: ["Equação do 2º Grau (Discriminante Delta)"],
    lastActive: "Há 15 minutos"
  },
  {
    id: "aluno-2",
    name: "Beatriz Oliveira Santos",
    email: "beatriz.santos@escola.edu.br",
    turmaId: "turma-3a-info",
    turmaName: "3º Ano A - Informática",
    avatar: "",
    attendancePercent: 98,
    overallGrade: 9.4,
    activitiesCompleted: 44,
    totalActivities: 45,
    streakDays: 14,
    difficultiesCount: 0,
    recentDifficulties: [],
    lastActive: "Há 2 horas"
  },
  {
    id: "aluno-3",
    name: "Gabriel Ferreira Costa",
    email: "gabriel.costa@escola.edu.br",
    turmaId: "turma-3a-info",
    turmaName: "3º Ano A - Informática",
    avatar: "",
    attendancePercent: 82,
    overallGrade: 6.4,
    activitiesCompleted: 22,
    totalActivities: 45,
    streakDays: 2,
    difficultiesCount: 3,
    recentDifficulties: ["SQL JOINs", "Fatoração de Polinômios", "AI-5 e Ditadura"],
    lastActive: "Ontem"
  },
  {
    id: "aluno-4",
    name: "Mariana Albuquerque",
    email: "mariana.albuquerque@escola.edu.br",
    turmaId: "turma-3b-info",
    turmaName: "3º Ano B - Informática",
    avatar: "",
    attendancePercent: 89,
    overallGrade: 7.5,
    activitiesCompleted: 31,
    totalActivities: 45,
    streakDays: 5,
    difficultiesCount: 2,
    recentDifficulties: ["Casos de Uso UML", "Genética Molecular"],
    lastActive: "Há 40 minutos"
  },
  {
    id: "aluno-5",
    name: "Rodrigo Antunes",
    email: "rodrigo.antunes@escola.edu.br",
    turmaId: "turma-3b-info",
    turmaName: "3º Ano B - Informática",
    avatar: "",
    attendancePercent: 79,
    overallGrade: 5.8,
    activitiesCompleted: 19,
    totalActivities: 45,
    streakDays: 0,
    difficultiesCount: 4,
    recentDifficulties: ["Delimitação do Tema de TCC", "Ácidos Nucleicos", "Bhaskara"],
    lastActive: "Há 3 dias"
  }
];

export const sampleDifficulties: DifficultyRecord[] = [
  {
    id: "diff-1",
    studentId: "aluno-3",
    studentName: "Gabriel Ferreira Costa",
    disciplineName: "Matemática",
    topic: "Equações do 2º Grau e Fatoração",
    score: 42,
    difficultyLevel: "Crítico",
    aiRecommendation: "Indicar trilha de nivelamento em Produtos Notáveis e agendar tutoria por voz no TutorIA com foco socrático no sinal de Delta.",
    identifiedAt: "14/09/2026",
    resolved: false
  },
  {
    id: "diff-2",
    studentId: "aluno-3",
    studentName: "Gabriel Ferreira Costa",
    disciplineName: "Banco de Dados",
    topic: "Junções Relacionais (INNER e LEFT JOIN)",
    score: 55,
    difficultyLevel: "Moderado",
    aiRecommendation: "Recomendar o módulo visual de diagramas de Venn e consulta comentada no módulo de Banco de Dados.",
    identifiedAt: "12/09/2026",
    resolved: false
  },
  {
    id: "diff-3",
    studentId: "aluno-5",
    studentName: "Rodrigo Antunes",
    disciplineName: "Prática de Estágio e TCC",
    topic: "Problema de Pesquisa e Justificativa",
    score: 48,
    difficultyLevel: "Crítico",
    aiRecommendation: "Realizar intervenção direta na oficina de TCC: apoiar o aluno na delimitação de problema específico e factível.",
    identifiedAt: "11/09/2026",
    resolved: false
  },
  {
    id: "diff-4",
    studentId: "aluno-4",
    studentName: "Mariana Albuquerque",
    disciplineName: "Análise e Projeto de Sistemas",
    topic: "Casos de Uso UML (<<include>> vs <<extend>>)",
    score: 64,
    difficultyLevel: "Leve",
    aiRecommendation: "Revisar flashcard fc-aps-1 e realizar exercício guiado no simulador de diagramas.",
    identifiedAt: "13/09/2026",
    resolved: true
  }
];

export const sampleProjects: ProjectItem[] = [
  {
    id: "proj-1",
    title: "ProfeIA: Plataforma Educacional Inclusiva com IA Adaptativa",
    description: "Desenvolvimento de aplicativo web para apoio aos estudantes do ensino técnico com tutoria por voz e vídeo em tempo real e nivelamento automático.",
    disciplineName: "Prática de Estágio e TCC",
    turma: "3º Ano A - Técnico em Informática",
    members: ["Lucas Mendes da Silva", "Beatriz Oliveira Santos"],
    deadline: "28/11/2026",
    progressPercent: 78,
    status: "Em Desenvolvimento",
    activities: [
      { id: "act-1", title: "Levantamento de Requisitos e Regras Pedagógicas", done: true },
      { id: "act-2", title: "Modelagem Conceitual e Diagramas UML", done: true },
      { id: "act-3", title: "Integração do TutorIA por Voz e Vídeo", done: true },
      { id: "act-4", title: "Testes com Usuários e Redação do Artigo ABNT", done: false },
      { id: "act-5", title: "Apresentação e Defesa na Banca Examinadora", done: false }
    ]
  },
  {
    id: "proj-2",
    title: "EcoSolidário: Aplicativo para Cooperativas de Catadores de Materiais Recicláveis",
    description: "Plataforma de rastreamento logístico e comércio justo para cooperativas locais aumentarem sua renda e eliminarem intermediários abusivos.",
    disciplineName: "Projeto de Empreendedorismo Social e Economia Solidária",
    turma: "3º Ano A - Técnico em Informática",
    members: ["Mariana Albuquerque", "Gabriel Ferreira Costa", "Rodrigo Antunes"],
    deadline: "15/12/2026",
    progressPercent: 60,
    status: "Em Planejamento",
    activities: [
      { id: "act-201", title: "Diagnóstico Comunitário e Pesquisa de Campo", done: true },
      { id: "act-202", title: "Social Business Canvas e Precificação Justa", done: true },
      { id: "act-203", title: "Desenvolvimento do Módulo de Coleta em React", done: false },
      { id: "act-204", title: "Validação Piloto com a Cooperativa VivaVerde", done: false }
    ]
  },
  {
    id: "proj-3",
    title: "Horta Urbana Automatizada com Sensores Arduino e IoT",
    description: "Sistema automatizado de irrigação gota a gota e monitoramento de umidade do solo com placas solares em horta comunitária escolar.",
    disciplineName: "Robótica",
    turma: "2º Ano A - Técnico em Redes",
    members: ["Carla Souza", "Matheus Ribeiro"],
    deadline: "05/11/2026",
    progressPercent: 90,
    status: "Revisão",
    activities: [
      { id: "act-301", title: "Esquema Eletrônico no Fritzing", done: true },
      { id: "act-302", title: "Programação do Microcontrolador C++", done: true },
      { id: "act-303", title: "Montagem Física da Caixa de Proteção IP65", done: true },
      { id: "act-304", title: "Relatório de Eficiência Hídrica", done: false }
    ]
  }
];

export const sampleAIPedagogicalAlerts: AIPedagogicalAlert[] = [
  {
    id: "alert-1",
    turma: "3º Ano B - Informática",
    discipline: "Matemática",
    topic: "Equações do 2º Grau",
    alertType: "high_error_rate",
    message: "43% dos alunos do 3º B apresentaram erros sucessivos no cálculo do discriminante Delta devido a confusão de sinais em coeficientes negativos.",
    actionSuggested: "Aplicar micro-oficina de 15 minutos em sala focando na fórmula com parênteses: (-b)² e -4(a)(c).",
    studentsAffected: 12
  },
  {
    id: "alert-2",
    turma: "3º Ano A - Informática",
    discipline: "Prática de Estágio e TCC",
    topic: "Problema de Pesquisa",
    alertType: "gap_prevention",
    message: "5 duplas de TCC ainda possuem formulações vagas de problema de pesquisa a menos de 4 semanas da qualificação.",
    actionSuggested: "Disponibilizar o roteiro de delimitação com o TutorIA e agendar orientação individualizada.",
    studentsAffected: 10
  }
];

export const mockClasses = [
  {
    id: "turma-infves3sb",
    name: "3º Ano B - Informática Vespertino (INFVES3SB)",
    studentCount: 26,
    course: "Técnico em Informática Integrado ao Ensino Médio",
  },
];

// Mapeamento exclusivo dos 26 estudantes oficiais da turma INFVES3SB com silhueta cinza
export const mockStudents = OFFICIAL_STUDENTS_LIST.map((st, i) => ({
  id: st.id,
  name: st.name,
  email: `${st.name.toLowerCase().replace(/[^a-z0-9]/g, ".")}.inf@escola.edu.br`,
  avatar: "", // Silhueta cinza padrão estilo WhatsApp sem foto
  turma: CLASS_CODE,
  progressPercent: 70 + ((i * 7) % 28),
  performanceGrade: 72 + ((i * 9) % 27),
  status: (st.status === "Avançado" ? "excelente" : st.status === "Em Estudo" ? "atencao" : "regular") as "excelente" | "regular" | "atencao",
  lastActive: i % 3 === 0 ? "Hoje às 14:20" : i % 2 === 0 ? "Ontem às 18:45" : "Há 2 horas",
  recentDifficulties: [st.postStudyReport?.mainDifficulty || "Revisão de pré-requisitos"],
  projectTitle: "ProfeIA: Aprendizagem Adaptativa e Inovação Pedagógica",
}));

export const teacherOverviewMetrics = {
  totalStudents: 26,
  activeClasses: 1,
  averageCompletionRate: 88,
  studentsNeedingAttention: 4,
  projectsMentored: 13,
  totalInterventionsCompleted: 38,
};

// Mapa de Dificuldades contemplando todas as 15 disciplinas curriculares com alunos reais da turma INFVES3SB
const rawTopicDifficultyStats: Array<Omit<TopicDifficultyStat, "affectedStudentsCount">> = [
  {
    id: "stat-matematica",
    disciplineId: "matematica",
    contentId: "matematica-top-1",
    disciplineName: "Matemática",
    topic: "Equações do 2º Grau e Bhaskara",
    prerequisiteIssue: "Fatoração de Polinômios e Regra de Sinais",
    errorRate: 58,
    affectedStudents: [
      "Alessandro Pereira de Santana",
      "Diogo Rocha Amaral",
      "Eliane Leao Salvador de Oliveira",
      "Italo Messias de Jesus dos Santos",
      "Samuel Silva de Jesus Borges",
      "Thiego Romario Oliveira Leite",
      "Wilson Pimentel Neto",
    ],
    recommendedAction: "Aplicar micro-oficina de revisão de produtos notáveis e fatoração antes da fórmula de Bhaskara.",
  },
  {
    id: "stat-banco-dados",
    disciplineId: "banco-de-dados",
    contentId: "banco-de-dados-top-1",
    disciplineName: "Banco de Dados",
    topic: "Consultas Relacionais com INNER JOIN",
    prerequisiteIssue: "Chaves Primárias (PK) e Chaves Estrangeiras (FK)",
    errorRate: 54,
    affectedStudents: [
      "Ana Beatriz Vitoria Santana",
      "Eduardo Alexandre Santana Pereira",
      "Kaloa Sena Santos de Jesus",
      "Luiz Henrique Silva Reis",
      "Sara Jesus de Souza",
      "Miguel Sales de Jesus",
    ],
    recommendedAction: "Utilizar diagramas de Venn e simular tabelas relacionais com dados práticos.",
  },
  {
    id: "stat-redacao",
    disciplineId: "lingua-portuguesa-redacao",
    contentId: "lingua-portuguesa-redacao-top-1",
    disciplineName: "Língua Portuguesa e Redação",
    topic: "Proposta de Intervenção e os 5 Elementos",
    prerequisiteIssue: "Detalhamento e Meio/Modo na Conclusão do ENEM",
    errorRate: 46,
    affectedStudents: [
      "Pamela do Espirito Santo Cruz",
      "Pedro Roberto Bittencourt Silva Bomfim Santos",
      "Alessandro Pereira de Santana",
      "Eduardo Alexandre Santana Pereira",
    ],
    recommendedAction: "Treinar a fórmula dos 5 elementos (Agente, Ação, Meio, Efeito e Detalhamento) em parágrafos de conclusão.",
  },
  {
    id: "stat-biologia",
    disciplineId: "biologia",
    contentId: "biologia-top-1",
    disciplineName: "Biologia",
    topic: "Fase Fotoquímica da Fotossíntese e Fotólise da Água",
    prerequisiteIssue: "Bioenergética e Papel dos Tilacoides na Liberação de O₂",
    errorRate: 50,
    affectedStudents: [
      "Isaque da Silva dos Santos",
      "Kauany Araujo Amorim",
      "Pedro Henrique Costa Conceicao de Santana",
      "Rai Guerra dos Santos",
    ],
    recommendedAction: "Esquematizar visualmente a quebra da molécula de H₂O e a síntese de ATP/NADPH.",
  },
  {
    id: "stat-fisica",
    disciplineId: "fisica",
    contentId: "fisica-top-1",
    disciplineName: "Física",
    topic: "Princípio Fundamental da Dinâmica e Leis de Newton",
    prerequisiteIssue: "Decomposição Vetorial de Forças e Força Resultante",
    errorRate: 52,
    affectedStudents: [
      "Laila Victoria Lessa Silva dos Santos",
      "Miguel Sales de Jesus",
      "Samuel Campos Fernandes Rodrigues",
      "Thiego Romario Oliveira Leite",
    ],
    recommendedAction: "Simular corpos em plano inclinado isolando as forças de ação e reação em diagramas de corpo livre.",
  },
  {
    id: "stat-web",
    disciplineId: "desenvolvimento-web",
    contentId: "desenvolvimento-web-top-1",
    disciplineName: "Desenvolvimento Web",
    topic: "Assincronismo, Promises e Async/Await",
    prerequisiteIssue: "Event Loop e Manipulação do DOM via JavaScript",
    errorRate: 48,
    affectedStudents: [
      "Raíssa Teixeira Magalhães",
      "Diogo Rocha Amaral",
      "Maria Eduarda Souza Silva",
      "Wilson Pimentel Neto",
    ],
    recommendedAction: "Construir requisições fetch com tratamento try/catch e async/await guiadas no console.",
  },
  {
    id: "stat-aps",
    disciplineId: "analise-projeto-sistemas",
    contentId: "analise-projeto-sistemas-top-1",
    disciplineName: "Análise e Projeto de Sistemas",
    topic: "Diagrama de Casos de Uso e Relacionamentos UML",
    prerequisiteIssue: "Diferenciação entre Requisitos Funcionais e Não Funcionais",
    errorRate: 44,
    affectedStudents: [
      "Eliane Leao Salvador de Oliveira",
      "Italo Messias de Jesus dos Santos",
      "Kaloa Sena Santos de Jesus",
      "Samuel Silva de Jesus Borges",
    ],
    recommendedAction: "Mapear cenários de uso com fronteira de sistema e relações <<include>> e <<extend>>.",
  },
  {
    id: "stat-historia",
    disciplineId: "historia",
    contentId: "historia-top-1",
    disciplineName: "História",
    topic: "Regime Militar Brasileiro e Redemocratização",
    prerequisiteIssue: "Ato Institucional nº 5 (AI-5) e Emenda Dante de Oliveira",
    errorRate: 42,
    affectedStudents: [
      "Ana Beatriz Vitoria Santana",
      "Guilherme Spaitel Lima",
      "Kauany Araujo Amorim",
      "Sara Jesus de Souza",
    ],
    recommendedAction: "Analisar fontes históricas primárias e a transição pactuada para a Nova República.",
  },
  {
    id: "stat-geografia",
    disciplineId: "geografia",
    contentId: "geografia-top-1",
    disciplineName: "Geografia",
    topic: "Divisão Internacional do Trabalho (DIT) e Globalização",
    prerequisiteIssue: "Etapas das Revoluções Industriais e Cadeias Globais de Valor",
    errorRate: 40,
    affectedStudents: [
      "Isaque da Silva dos Santos",
      "Luiz Henrique Silva Reis",
      "Rai Guerra dos Santos",
      "Samuel Campos Fernandes Rodrigues",
    ],
    recommendedAction: "Mapear fluxos comerciais globais e especialização produtiva dos países periféricos.",
  },
  {
    id: "stat-sociologia",
    disciplineId: "sociologia",
    contentId: "sociologia-top-1",
    disciplineName: "Sociologia",
    topic: "Ação Social e Tipologia Compreensiva em Max Weber",
    prerequisiteIssue: "Diferença entre Fato Social Durkheimiano e Sentido Subjetivo",
    errorRate: 38,
    affectedStudents: [
      "Anny Carolyne Santos de Jesus Dias",
      "Maria Eduarda Sousa Goncalves Silva",
      "Pedro Henrique Costa Conceicao de Santana",
    ],
    recommendedAction: "Debater exemplos práticos dos 4 tipos de ação social (racional com relação a fins, valores, afetiva e tradicional).",
  },
  {
    id: "stat-estagio-tcc",
    disciplineId: "materia-pratica-estagio-tcc",
    contentId: "materia-pratica-estagio-tcc-top-1",
    disciplineName: "Matéria Prática de Estágio e TCC",
    topic: "Delimitação do Problema de Pesquisa e Objetivos Metodológicos",
    prerequisiteIssue: "Normas ABNT (NBR 14724 / NBR 6023) e Recorte Empírico",
    errorRate: 56,
    affectedStudents: [
      "Alessandro Pereira de Santana",
      "Maria Eduarda Souza Silva",
      "Pedro Roberto Bittencourt Silva Bomfim Santos",
      "Thiego Romario Oliveira Leite",
    ],
    recommendedAction: "Realizar oficina prática de formulação da pergunta norteadora e alinhamento entre objetivo geral e específicos.",
  },
  {
    id: "stat-robotica",
    disciplineId: "robotica",
    contentId: "robotica-top-1",
    disciplineName: "Robótica",
    topic: "Controle de Atuadores com Modulação PWM no Arduino",
    prerequisiteIssue: "Diferença entre Sinais Analógicos e Digitais",
    errorRate: 46,
    affectedStudents: [
      "Diogo Rocha Amaral",
      "Laila Victoria Lessa Silva dos Santos",
      "Miguel Sales de Jesus",
      "Wilson Pimentel Neto",
    ],
    recommendedAction: "Montar circuitos no simulador Tinkercad medindo ciclo de trabalho (duty cycle) no osciloscópio.",
  },
  {
    id: "stat-design-interface",
    disciplineId: "design-de-interface",
    contentId: "design-de-interface-top-1",
    disciplineName: "Design de Interface",
    topic: "Heurísticas de Usabilidade e Acessibilidade WCAG",
    prerequisiteIssue: "Contraste Cromático e Feedback de Estado do Sistema",
    errorRate: 36,
    affectedStudents: [
      "Eliane Leao Salvador de Oliveira",
      "Kauany Araujo Amorim",
      "Pamela do Espirito Santo Cruz",
    ],
    recommendedAction: "Auditar telas de baixa usabilidade aplicando as 10 heurísticas de Jakob Nielsen.",
  },
  {
    id: "stat-empreendedorismo-social",
    disciplineId: "empreendedorismo-social",
    contentId: "empreendedorismo-social-top-1",
    disciplineName: "Projeto de Empreendedorismo Social e Economia Solidária",
    topic: "Social Business Model Canvas e Moedas Sociais",
    prerequisiteIssue: "Sustentabilidade Financeira em Negócios de Impacto Social",
    errorRate: 34,
    affectedStudents: [
      "Ana Beatriz Vitoria Santana",
      "Italo Messias de Jesus dos Santos",
      "Sara Jesus de Souza",
    ],
    recommendedAction: "Desenvolver matriz de impacto social e proposta de valor comunitária em cooperativas locais.",
  },
  {
    id: "stat-lingua-inglesa",
    disciplineId: "lingua-inglesa",
    contentId: "lingua-inglesa-top-1",
    disciplineName: "Língua Inglesa",
    topic: "Simple Present vs Present Continuous e Reading Técnico",
    prerequisiteIssue: "Uso dos Auxiliares Do/Does e Falsos Cognatos em Documentação de TI",
    errorRate: 43,
    affectedStudents: [
      "Raíssa Teixeira Magalhães",
      "Guilherme Spaitel Lima",
      "Luiz Henrique Silva Reis",
      "Samuel Campos Fernandes Rodrigues",
    ],
    recommendedAction: "Aplicar leitura instrumental (Skimming e Scanning) com documentação técnica de software e prática de tempos verbais.",
  },
];

// Quantidade de alunos afetados sempre coerente com os nomes reais presentes no array affectedStudents
export const topicDifficultyStats: TopicDifficultyStat[] = rawTopicDifficultyStats.map((stat) => ({
  ...stat,
  affectedStudentsCount: stat.affectedStudents.length,
}));

const rawRecommendationsConfig: Array<{
  id: string;
  difficultyStatId: string;
  priority: "alta" | "media" | "baixa";
  category: "conteudo" | "turma" | "projeto" | "intervencao";
  title: string;
  description: string;
  suggestedAction: string;
  timestamp: string;
}> = [
  {
    id: "rec-matematica",
    difficultyStatId: "stat-matematica",
    priority: "alta",
    category: "conteudo",
    title: "Matemática: 58% da turma errou fatoração antes de Bhaskara",
    description: "Os dados das tentativas de atividades mostram que a raiz do erro não é a fórmula de Bhaskara, e sim produtos notáveis e regra de sinais no discriminante Δ.",
    suggestedAction: "Agendar aula de revisão de pré-requisito e disparar lista adaptativa de 10 questões",
    timestamp: "Hoje às 08:30",
  },
  {
    id: "rec-biologia",
    difficultyStatId: "stat-biologia",
    priority: "media",
    category: "conteudo",
    title: "Biologia: Confusão entre Fase Fotoquímica e Ciclo de Calvin",
    description: "Alunos associaram a liberação de O₂ ao CO₂ em vez da fotólise da água nos tilacoides.",
    suggestedAction: "Ativar simulação visual de bioenergética celular e flashcards no TutorIA",
    timestamp: "Hoje às 08:15",
  },
  {
    id: "rec-fisica",
    difficultyStatId: "stat-fisica",
    priority: "alta",
    category: "intervencao",
    title: "Física: Decomposição vetorial nas Leis de Newton",
    description: "Dificuldade identificada na projeção ortogonal de forças (P·senθ e P·cosθ) em planos inclinados.",
    suggestedAction: "Aplicar diagrama de corpo livre interativo no quadro branco do TutorIA",
    timestamp: "Hoje às 08:00",
  },
  {
    id: "rec-geografia",
    difficultyStatId: "stat-geografia",
    priority: "baixa",
    category: "turma",
    title: "Geografia: Análise da Nova Divisão Internacional do Trabalho (DIT)",
    description: "Consolidar a relação entre cadeias produtivas globais e industrialização tardia.",
    suggestedAction: "Promover debate socrático sobre geopolítica e blocos econômicos",
    timestamp: "Ontem às 17:40",
  },
  {
    id: "rec-sociologia",
    difficultyStatId: "stat-sociologia",
    priority: "baixa",
    category: "conteudo",
    title: "Sociologia: Distinção entre Fato Social (Durkheim) e Ação Social (Weber)",
    description: "Reforçar os quatro tipos puros de ação social na sociologia compreensiva.",
    suggestedAction: "Enviar estudo de caso comparado com repertório para redação",
    timestamp: "Ontem às 17:10",
  },
  {
    id: "rec-aps",
    difficultyStatId: "stat-aps",
    priority: "media",
    category: "projeto",
    title: "Análise e Projeto de Sistemas: Relacionamentos <<include>> e <<extend>> em UML",
    description: "Equipes de projeto inverteram a direção das setas de inclusão obrigatória nos diagramas de casos de uso.",
    suggestedAction: "Realizar revisão guiada de modelagem UML aplicada ao projeto de TCC",
    timestamp: "Ontem às 16:45",
  },
  {
    id: "rec-tcc",
    difficultyStatId: "stat-estagio-tcc",
    priority: "alta",
    category: "projeto",
    title: "Matéria Prática de Estágio e TCC: Ajuste na metodologia e normas ABNT",
    description: "4 grupos precisam delimitar o escopo do problema de pesquisa e padronizar citações diretas/indiretas segundo a NBR 6023.",
    suggestedAction: "Disparar roteiro de qualificação ABNT e mentoria individual com TutorIA",
    timestamp: "Hoje às 07:45",
  },
  {
    id: "rec-bd",
    difficultyStatId: "stat-banco-dados",
    priority: "alta",
    category: "conteudo",
    title: "Banco de Dados: Integridade Referencial e Junções INNER/LEFT JOIN",
    description: "Erros frequentes ao omitir a cláusula ON relacionando Chave Primária (PK) e Chave Estrangeira (FK).",
    suggestedAction: "Praticar consultas SQL relacionais no laboratório prático",
    timestamp: "Ontem às 16:20",
  },
  {
    id: "rec-redacao",
    difficultyStatId: "stat-redacao",
    priority: "media",
    category: "conteudo",
    title: "Língua Portuguesa e Redação: Detalhamento dos 5 elementos na Conclusão",
    description: "As propostas de intervenção apresentam Agente e Ação, mas omitem o Meio/Modo ou o Detalhamento exigidos na Competência 5.",
    suggestedAction: "Aplicar oficina de parágrafos conclusivos com checklist dos 5 elementos",
    timestamp: "Ontem às 15:30",
  },
  {
    id: "rec-web",
    difficultyStatId: "stat-web",
    priority: "media",
    category: "conteudo",
    title: "Desenvolvimento Web: Tratamento de Promises e Async/Await no Fetch",
    description: "Necessidade de reforçar estados de carregamento e captura de erros HTTP em aplicações React.",
    suggestedAction: "Disponibilizar bateria de 10 questões práticas sobre consumo de APIs REST",
    timestamp: "Ontem às 14:50",
  },
  {
    id: "rec-historia",
    difficultyStatId: "stat-historia",
    priority: "baixa",
    category: "turma",
    title: "História: Conexão entre Revolução Francesa, Era Vargas e Cidadania",
    description: "Excelente engajamento nos debates históricos; recomenda-se conectar os direitos civis à Constituição de 1988.",
    suggestedAction: "Agendar sessão de debate socrático interdisciplinar",
    timestamp: "Ontem às 14:00",
  },
  {
    id: "rec-robotica",
    difficultyStatId: "stat-robotica",
    priority: "media",
    category: "projeto",
    title: "Robótica: Calibração de Sensores Ultrassônicos e Modulação PWM",
    description: "Ajustar leitura de pinos analógicos versus saídas PWM nos protótipos com microcontroladores Arduino.",
    suggestedAction: "Executar simulação de bancada com cálculo de duty cycle",
    timestamp: "Ontem às 11:20",
  },
  {
    id: "rec-design",
    difficultyStatId: "stat-design-interface",
    priority: "baixa",
    category: "conteudo",
    title: "Design de Interface: Aplicação das 10 Heurísticas de Nielsen e WCAG AA",
    description: "Aprimorar hierarquia tipográfica, estados de foco e contraste cromático nos protótipos das equipes.",
    suggestedAction: "Realizar avaliação heurística cruzada entre os grupos da turma",
    timestamp: "Ontem às 10:15",
  },
  {
    id: "rec-empreendedorismo",
    difficultyStatId: "stat-empreendedorismo-social",
    priority: "baixa",
    category: "projeto",
    title: "Projeto de Empreendedorismo Social e Economia Solidária: Indicadores de Impacto e ODS",
    description: "Estruturar métricas claras de geração de renda solidária e sustentabilidade financeira no Social Business Canvas.",
    suggestedAction: "Orientar validação de impacto social junto à comunidade local",
    timestamp: "12 de Março",
  },
  {
    id: "rec-ingles",
    difficultyStatId: "stat-lingua-inglesa",
    priority: "media",
    category: "conteudo",
    title: "Língua Inglesa: Simple Present vs Present Continuous e Inglês Técnico",
    description: "Reforçar o uso dos auxiliares Do/Does na 3ª pessoa e estratégias de Skimming/Scanning em documentação técnica.",
    suggestedAction: "Liberar trilha bilíngue com 10 exercícios de interpretação técnica e gramática aplicada",
    timestamp: "Hoje às 09:00",
  },
];

// Constrói as recomendações vinculadas relacionalmente às estatísticas de dificuldade de cada disciplina
export function buildLinkedRecommendations(
  stats: TopicDifficultyStat[] = topicDifficultyStats
): TeacherAiRecommendation[] {
  return rawRecommendationsConfig.map((cfg) => {
    const linkedStat =
      stats.find((s) => s.id === cfg.difficultyStatId) || stats[0];
    const blueprint = getBlueprintForDiscipline(linkedStat.disciplineId);
    const actualCount = linkedStat.affectedStudents.length;

    return {
      id: cfg.id,
      difficultyStatId: linkedStat.id,
      disciplineId: linkedStat.disciplineId,
      contentId: linkedStat.contentId,
      disciplineName: linkedStat.disciplineName,
      topic: linkedStat.topic,
      priority: cfg.priority,
      targetGroup: `Turma ${CLASS_CODE} (${actualCount} ${actualCount === 1 ? "aluno" : "alunos"})`,
      category: cfg.category,
      title: cfg.title,
      description: cfg.description,
      prerequisiteIssue: linkedStat.prerequisiteIssue,
      errorRate: linkedStat.errorRate,
      affectedStudentsCount: actualCount,
      affectedStudents: [...linkedStat.affectedStudents],
      learningObjective: blueprint.learningObjective,
      suggestedAction: cfg.suggestedAction,
      timestamp: cfg.timestamp,
    };
  });
}

export const teacherAiRecommendations: TeacherAiRecommendation[] =
  buildLinkedRecommendations(topicDifficultyStats);

// Chaves de persistência no localStorage para manter as ações do professor sincronizadas
const DIFFICULTIES_STORAGE_KEY = "profeia_teacher_difficulties_v2";
const LESSON_PLANS_STORAGE_KEY = "profeia_teacher_lesson_plans_v1";
const INTERVENTIONS_STORAGE_KEY = "profeia_teacher_interventions_v1";

export function getSavedTeacherDifficulties(): TopicDifficultyStat[] {
  if (typeof window === "undefined") return topicDifficultyStats;
  try {
    const raw = localStorage.getItem(DIFFICULTIES_STORAGE_KEY);
    if (!raw) return topicDifficultyStats;
    const parsed = JSON.parse(raw) as TopicDifficultyStat[];
    if (Array.isArray(parsed) && parsed.length === topicDifficultyStats.length) {
      return parsed.map((d) => ({
        ...d,
        affectedStudentsCount: Array.isArray(d.affectedStudents)
          ? d.affectedStudents.length
          : d.affectedStudentsCount,
      }));
    }
    return topicDifficultyStats;
  } catch {
    return topicDifficultyStats;
  }
}

export function saveTeacherDifficulties(stats: TopicDifficultyStat[]): void {
  if (typeof window === "undefined") return;
  try {
    const normalized = stats.map((d) => ({
      ...d,
      affectedStudentsCount: d.affectedStudents.length,
    }));
    localStorage.setItem(DIFFICULTIES_STORAGE_KEY, JSON.stringify(normalized));
  } catch (e) {
    console.warn("Erro ao salvar estatísticas de dificuldade:", e);
  }
}

export function getSavedLessonPlans(): LessonPlanRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LESSON_PLANS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLessonPlanRecord(plan: LessonPlanRecord): LessonPlanRecord[] {
  const existing = getSavedLessonPlans();
  const idx = existing.findIndex((p) => p.id === plan.id || p.recommendationId === plan.recommendationId);
  const updated =
    idx >= 0
      ? existing.map((p, i) => (i === idx ? plan : p))
      : [plan, ...existing];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LESSON_PLANS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Erro ao salvar plano de aula:", e);
    }
  }
  return updated;
}

export function getSavedTeacherInterventions(): TeacherInterventionRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(INTERVENTIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function recordTeacherIntervention(
  entry: Omit<TeacherInterventionRecord, "id" | "timestamp">
): TeacherInterventionRecord[] {
  const existing = getSavedTeacherInterventions();
  const nowStr = new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const newRecord: TeacherInterventionRecord = {
    ...entry,
    id: `interv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: `Hoje às ${nowStr}`,
  };
  const updated = [newRecord, ...existing];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(INTERVENTIONS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Erro ao salvar histórico de intervenção:", e);
    }
  }
  return updated;
}

/**
 * Atualiza de maneira coerente as estatísticas de dificuldade e as recomendações do professor
 * quando um aluno realiza tentativas de atividades no sistema.
 */
export function updateDifficultiesAfterStudentAttempt(
  currentStats: TopicDifficultyStat[],
  attempt: StudentActivityAttempt,
  studentName: string
): TopicDifficultyStat[] {
  const updated = currentStats.map((stat) => {
    if (stat.disciplineId !== attempt.disciplineId) return stat;

    let nextStudents = [...stat.affectedStudents];
    let nextErrorRate = stat.errorRate;

    if (attempt.isCorrect) {
      nextErrorRate = Math.max(12, stat.errorRate - 2);
      // Se o aluno acertou sem precisar de fallback de pré-requisito e estava na lista de atenção, remove-o se ficar com pelo menos 1 aluno
      if (!attempt.remedialTriggered && nextStudents.includes(studentName) && nextStudents.length > 1) {
        nextStudents = nextStudents.filter((s) => s !== studentName);
      }
    } else {
      nextErrorRate = Math.min(95, stat.errorRate + 3);
      if (studentName && !nextStudents.includes(studentName)) {
        nextStudents = [studentName, ...nextStudents];
      }
    }

    return {
      ...stat,
      errorRate: nextErrorRate,
      affectedStudents: nextStudents,
      affectedStudentsCount: nextStudents.length,
    };
  });

  saveTeacherDifficulties(updated);
  return updated;
}

export const loadTeacherDifficulties = getSavedTeacherDifficulties;

export function loadTeacherRecommendations(): TeacherAiRecommendation[] {
  return buildLinkedRecommendations(getSavedTeacherDifficulties());
}

export function updateTeacherDataFromStudentAttempt(
  attempt: StudentActivityAttempt,
  studentName: string
): {
  difficulties: TopicDifficultyStat[];
  recommendations: TeacherAiRecommendation[];
} {
  const difficulties = updateDifficultiesAfterStudentAttempt(
    getSavedTeacherDifficulties(),
    attempt,
    studentName
  );
  const recommendations = buildLinkedRecommendations(difficulties);
  return { difficulties, recommendations };
}

export const loadLessonPlans = getSavedLessonPlans;
export const saveLessonPlan = saveLessonPlanRecord;
export const loadTeacherInterventions = getSavedTeacherInterventions;

export function saveTeacherIntervention(
  entry: Partial<TeacherInterventionRecord> & {
    recommendationId: string;
    disciplineName: string;
    topic: string;
    summary: string;
  }
): TeacherInterventionRecord[] {
  const existing = getSavedTeacherInterventions();
  const nowStr = new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const targetStudents = entry.targetStudents || [];
  const actionType = entry.actionType || entry.type || "reforco";
  const newRecord: TeacherInterventionRecord = {
    id: entry.id || `interv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    recommendationId: entry.recommendationId,
    recommendationTitle: entry.recommendationTitle,
    disciplineId: entry.disciplineId,
    actionType,
    type: actionType,
    statusLabel: entry.statusLabel || entry.summary,
    disciplineName: entry.disciplineName,
    topic: entry.topic,
    summary: entry.summary,
    studentsCount: entry.studentsCount ?? targetStudents.length,
    targetStudents,
    details: entry.details,
    timestamp: entry.timestamp || `Hoje às ${nowStr}`,
    createdAt: entry.createdAt || `Hoje às ${nowStr}`,
  };
  const filtered = existing.filter((item) => item.id !== newRecord.id);
  const updated = [newRecord, ...filtered];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(INTERVENTIONS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Erro ao salvar histórico de intervenção:", e);
    }
  }
  return updated;
}

export function findDifficultyForRecommendation(
  rec: TeacherAiRecommendation,
  diffs: TopicDifficultyStat[] = topicDifficultyStats
): TopicDifficultyStat | undefined {
  return (
    diffs.find(
      (d) =>
        (rec.difficultyStatId && d.id === rec.difficultyStatId) ||
        (rec.disciplineId && d.disciplineId === rec.disciplineId) ||
        (rec.disciplineName &&
          d.disciplineName.toLowerCase() === rec.disciplineName.toLowerCase())
    ) || diffs[0]
  );
}

export function loadTeacherClasses(): Array<{
  id: string;
  name: string;
  discipline: string;
  academicPeriod: string;
  shift: string;
  accessCode: string;
  studentsCount: number;
}> {
  const fallback = [
    {
      id: "turma-infves3sb",
      name: "3º Ano B - Técnico em Informática Integrado",
      discipline: "15 Disciplinas Curriculares (Grade Integrada)",
      academicPeriod: "2026.1",
      shift: "Vespertino",
      accessCode: "INFVES3SB",
      studentsCount: 26,
    },
  ];
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem("profeia_teacher_classes_v1");
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export const mockProjectTracking = {
  id: "proj-1",
  title: "ProfeIA: Plataforma Educacional Inclusiva com IA Adaptativa",
  theme: "Desenvolvimento de plataforma web de apoio aos estudantes com tutoria por voz e vídeo em tempo real, nivelamento adaptativo e gestão pedagógica integrada.",
  advisor: "Prof. Dr. Ricardo Vasconcelos",
  status: "em_andamento" as const,
  nextDeadline: "20 de Abril de 2026",
  stages: [
    {
      id: "stage-1",
      title: "1. Delimitação do Tema e Problema de Pesquisa",
      description: "Definição do problema científico, objetivos gerais e específicos, justificativa e relevância educacional.",
      status: "concluido" as const,
      deadline: "28 de Fevereiro de 2026"
    },
    {
      id: "stage-2",
      title: "2. Revisão Bibliográfica & Levantamento de Requisitos",
      description: "Estado da arte em IA generativa, pedagogia socrática e modelagem de casos de uso com UML.",
      status: "em_andamento" as const,
      deadline: "20 de Abril de 2026"
    },
    {
      id: "stage-3",
      title: "3. Prototipação, Desenvolvimento e Integração com TutorIA",
      description: "Implementação da interface, arquitetura client-server, chamada em tempo real e banco de dados.",
      status: "pendente" as const,
      deadline: "15 de Junho de 2026"
    },
    {
      id: "stage-4",
      title: "4. Testes com Usuários, Redação Final ABNT e Defesa na Banca",
      description: "Coleta de métricas de usabilidade com alunos reais, redação do artigo e apresentação presencial.",
      status: "pendente" as const,
      deadline: "28 de Novembro de 2026"
    }
  ],
  aiFeedback: "Excelente formulação dos objetivos do TCC. O foco em aprendizagem adaptativa e apoio pré-requisito atende com louvor às diretrizes de inovação pedagógica do MEC. Recomendo citar a taxonomia de Bloom e os métodos de repetição espaçada de Ebbinghaus na fundamentação teórica."
};

