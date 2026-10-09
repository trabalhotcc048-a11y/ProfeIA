import { NotificationItem } from "../types";
import { CLASS_CODE, OFFICIAL_STUDENTS_LIST } from "./studentsData";

export const TEACHER_OFFICIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-teacher-1",
    title: "Relatório de Entregas: 18 de 26 alunos entregaram Banco de Dados & SQL",
    description: "69% de adesão na turma INFVES3SB. 8 estudantes com entrega pendente antes do encerramento do prazo regimental.",
    timestamp: "Há 25 minutos",
    read: false,
    type: "report",
    sender: "Secretaria Acadêmica & AVA • Turma INFVES3SB",
    senderEmail: "ava.suporte@profeia.edu.br",
    deadlineDate: "Hoje às 23:59",
    actionLabel: "Ver Relatório Detalhado de Entregas",
    fullBody: `Prezado Professor Edmilson Borges,

O prazo de entrega da atividade "Modelagem Relacional e Consultas com INNER JOIN" da disciplina de Banco de Dados está próximo do término.
Até o momento, 18 dos 26 alunos matriculados na turma INFVES3SB realizaram o envio do script SQL e diagrama ER.

Abaixo consta o demonstrativo nominal dos estudantes com envios validados pelo sistema, bem como a lista de pendências para disparo de lembrete preventivo.`,
    activityReport: {
      activityTitle: "Modelagem Relacional e Consultas com INNER JOIN",
      turma: CLASS_CODE,
      disciplineName: "Banco de Dados",
      submittedCount: 18,
      totalCount: 26,
      submittedStudents: [
        { name: "Raíssa Teixeira Magalhães", enrollmentId: "2026-INF-0412", submittedAt: "14/04 às 14:32" },
        { name: "Alessandro Pereira de Santana", enrollmentId: "2026-INF-0413", submittedAt: "14/04 às 15:10" },
        { name: "Ana Beatriz Vitoria Santana", enrollmentId: "2026-INF-0414", submittedAt: "14/04 às 15:45" },
        { name: "Anny Carolyne Santos de Jesus Dias", enrollmentId: "2026-INF-0415", submittedAt: "14/04 às 16:20" },
        { name: "Eduardo Alexandre Santana Pereira", enrollmentId: "2026-INF-0417", submittedAt: "14/04 às 16:50" },
        { name: "Eliane Leao Salvador de Oliveira", enrollmentId: "2026-INF-0418", submittedAt: "14/04 às 17:05" },
        { name: "Guilherme Spaitel Lima", enrollmentId: "2026-INF-0419", submittedAt: "14/04 às 17:30" },
        { name: "Isaque da Silva dos Santos", enrollmentId: "2026-INF-0420", submittedAt: "14/04 às 18:15" },
        { name: "Italo Messias de Jesus dos Santos", enrollmentId: "2026-INF-0421", submittedAt: "14/04 às 18:40" },
        { name: "Kaloa Sena Santos de Jesus", enrollmentId: "2026-INF-0422", submittedAt: "14/04 às 19:12" },
        { name: "Kauany Araujo Amorim", enrollmentId: "2026-INF-0423", submittedAt: "14/04 às 19:55" },
        { name: "Laila Victoria Lessa Silva dos Santos", enrollmentId: "2026-INF-0424", submittedAt: "15/04 às 08:30" },
        { name: "Luiz Henrique Silva Reis", enrollmentId: "2026-INF-0425", submittedAt: "15/04 às 09:14" },
        { name: "Maria Eduarda Sousa Goncalves Silva", enrollmentId: "2026-INF-0426", submittedAt: "15/04 às 10:02" },
        { name: "Maria Eduarda Souza Silva", enrollmentId: "2026-INF-0427", submittedAt: "15/04 às 10:45" },
        { name: "Miguel Sales de Jesus", enrollmentId: "2026-INF-0428", submittedAt: "15/04 às 11:20" },
        { name: "Pamela do Espirito Santo Cruz", enrollmentId: "2026-INF-0429", submittedAt: "15/04 às 11:58" },
        { name: "Pedro Henrique Costa Conceicao de Santana", enrollmentId: "2026-INF-0430", submittedAt: "15/04 às 13:05" },
      ],
      pendingStudents: [
        { name: "Diogo Rocha Amaral", enrollmentId: "2026-INF-0416" },
        { name: "Pedro Roberto Bittencourt Silva Bomfim Santos", enrollmentId: "2026-INF-0431" },
        { name: "Rai Guerra dos Santos", enrollmentId: "2026-INF-0432" },
        { name: "Samuel Campos Fernandes Rodrigues", enrollmentId: "2026-INF-0433" },
        { name: "Samuel Silva de Jesus Borges", enrollmentId: "2026-INF-0434" },
        { name: "Sara Jesus de Souza", enrollmentId: "2026-INF-0435" },
        { name: "Thiego Romario Oliveira Leite", enrollmentId: "2026-INF-0436" },
        { name: "Wilson Pimentel Neto", enrollmentId: "2026-INF-0437" },
      ]
    }
  },
  {
    id: "notif-teacher-2",
    title: "Alerta de Desempenho e Apoio: 15 alunos apresentam dificuldade em Matemática",
    description: "Diagnóstico preditivo apontou defasagem em Equações do 2º Grau e Bhaskara decorrente de fatoração e regra de sinais.",
    timestamp: "Há 1 hora",
    read: false,
    type: "alert",
    sender: "Motor de IA Pedagógica ProfeIA",
    senderEmail: "ia.diagnostico@profeia.edu.br",
    actionLabel: "Abrir Mapa de Dificuldades",
    actionTarget: {
      tab: "prof-dificuldades",
      topic: "Equações do 2º Grau e Bhaskara",
      disciplineId: "matematica",
    },
    fullBody: `Professor Edmilson Borges,

O sistema detectou uma taxa de erro de 42% no tópico "Equações do 2º Grau e Bhaskara" na turma INFVES3SB.
O pré-requisito crítico identificado como causa raiz é: "Fatoração de Polinômios e Regra de Sinais".

Recomendação: Realizar intervenção coletiva ou agendar aula de nivelamento focada em reconstrução dos fundamentos algébricos antes de prosseguir com a matéria do bimestre.`
  },
  {
    id: "notif-teacher-3",
    title: "Alerta de Desempenho: 14 alunos com defasagem em Consultas com INNER JOIN",
    description: "Banco de Dados: Dificuldade na identificação de chaves estrangeiras (FK) e cruzamento de registros na turma INFVES3SB.",
    timestamp: "Há 3 horas",
    read: false,
    type: "alert",
    sender: "Diagnóstico de Aprendizagem Técnica",
    actionLabel: "Abrir Mapa de Dificuldades",
    actionTarget: {
      tab: "prof-dificuldades",
      topic: "Consultas Relacionais com INNER JOIN",
      disciplineId: "banco-de-dados",
    },
    fullBody: `Professor Edmilson Borges,

14 estudantes da turma INFVES3SB demonstraram dificuldades consistentes na sintaxe e lógica relacional de junções de tabelas (INNER JOIN).
A causa raiz é a compreensão conceitual da relação 1:N entre chaves primárias e estrangeiras. Sugere-se agendamento de nivelamento prático.`
  },
  {
    id: "notif-teacher-4",
    title: "Relatório de Entregas: 21 de 26 alunos entregaram Desenvolvimento Web",
    description: "81% de adesão na atividade 'JavaScript Assíncrono, Promises e Fetch API'. Apenas 5 pendências restantes.",
    timestamp: "Ontem às 18:30",
    read: true,
    type: "report",
    sender: "Coordenação do Curso Técnico em Informática",
    deadlineDate: "Concluído",
    actionLabel: "Ver Relatório Detalhado de Entregas",
    activityReport: {
      activityTitle: "JavaScript Assíncrono, Promises e Fetch API",
      turma: CLASS_CODE,
      disciplineName: "Desenvolvimento Web",
      submittedCount: 21,
      totalCount: 26,
      submittedStudents: OFFICIAL_STUDENTS_LIST.slice(0, 21).map((s, i) => ({
        name: s.name,
        enrollmentId: s.enrollmentId,
        submittedAt: `13/04 às ${14 + (i % 6)}:${10 + ((i * 7) % 50)}`,
      })),
      pendingStudents: OFFICIAL_STUDENTS_LIST.slice(21, 26).map((s) => ({
        name: s.name,
        enrollmentId: s.enrollmentId,
      }))
    }
  },
  {
    id: "notif-teacher-5",
    title: "Alerta de Pré-Requisito: 13 alunos com defasagem em Química",
    description: "Termoquímica & Lei de Hess: Dificuldade em estequiometria e sinais de entalpia (ΔH positivo e negativo).",
    timestamp: "Há 1 dia",
    read: true,
    type: "alert",
    sender: "Diagnóstico Pedagógico ProfeIA",
    actionLabel: "Abrir Mapa de Dificuldades",
    actionTarget: {
      tab: "prof-dificuldades",
      topic: "Termoquímica e Lei de Hess",
      disciplineId: "quimica",
    }
  },
  {
    id: "notif-teacher-6",
    title: "Oficina de Nivelamento Confirmada para Turma INFVES3SB",
    description: "Nivelamento coletivo em 'Equações do 2º Grau' registrado na agenda docente e notificado aos 15 alunos participantes.",
    timestamp: "Há 2 dias",
    read: true,
    type: "recommendation",
    sender: "Coordenação Pedagógica",
    fullBody: "A oficina de nivelamento coletivo foi devidamente incluída no cronograma de estudos dos estudantes selecionados com lembretes automáticos via AVA."
  }
];
