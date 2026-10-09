import { LessonPlanStep } from "../types";
import { sampleQuestions } from "./activitiesData";

export interface DomainPedagogicalBlueprint {
  disciplineId: string;
  disciplineName: string;
  lessonTitle: string;
  learningObjective: string;
  difficultyDiagnosis: string;
  steps: LessonPlanStep[];
  didacticResources: string[];
  estimatedTime: string;
  evaluationStrategy: string;
  flashcards: Array<{ question: string; answer: string }>;
  mindMapNodes: Array<{ label: string; type: string; desc: string }>;
  writtenSummary: string;
  notificationTemplate: string;
}

export const DOMAIN_PEDAGOGICAL_BLUEPRINTS: Record<string, DomainPedagogicalBlueprint> = {
  matematica: {
    disciplineId: "matematica",
    disciplineName: "Matemática",
    lessonTitle: "Revisão Dirigida: Fatoração Algébrica, Regra de Sinais no Discriminante (Δ) e Fórmula de Bhaskara",
    learningObjective:
      "Dominar a fatoração de expressões quadráticas (fator comum, trinômio quadrado perfeito e diferença de quadrados) e aplicar corretamente a regra de sinais no cálculo do discriminante Δ = b² - 4ac para encontrar as raízes reais pela fórmula de Bhaskara.",
    difficultyDiagnosis:
      "Os estudantes compreendem a estrutura geral de ax² + bx + c = 0, mas cometem erros ao calcular (-b)² quando b é negativo e ao multiplicar -4·a·c com coeficientes negativos, além de não simplificarem a equação colocando o fator comum em evidência antes de aplicar Bhaskara.",
    steps: [
      {
        stepNumber: 1,
        stageTitle: "Etapa 1 — Retomada do Conceito (Pré-requisito)",
        duration: "10 min",
        description:
          "Revisão de fatoração algébrica: colocar fator comum em evidência (ex.: 2x² - 8x + 6 = 2(x² - 4x + 3)), produtos notáveis ((a ± b)²) e potenciação de números negativos com parênteses ((-8)² = +64 vs -8² = -64).",
      },
      {
        stepNumber: 2,
        stageTitle: "Etapa 2 — Explicação Orientada",
        duration: "15 min",
        description:
          "Dedução passo a passo da fórmula de Bhaskara x = (-b ± √Δ) / 2a, destacando o papel geométrico do discriminante Δ = b² - 4ac na parábola (Δ > 0: duas raízes reais distintas; Δ = 0: vértice tangente ao eixo x; Δ < 0: sem raízes reais).",
      },
      {
        stepNumber: 3,
        stageTitle: "Etapa 3 — Exemplo Prático",
        duration: "15 min",
        description:
          "Resolução comparada no quadro: resolver 2x² - 8x + 6 = 0 primeiro simplificando por fator comum (x² - 4x + 3 = 0 → soma S = 4, produto P = 3 → x' = 1, x'' = 3) e depois confirmando via Δ = (-8)² - 4(2)(6) = 64 - 48 = 16.",
      },
      {
        stepNumber: 4,
        stageTitle: "Etapa 4 — Atividade Aplicada",
        duration: "20 min",
        description:
          "Lista progressiva em duplas com 5 equações do 2º grau contendo coeficientes negativos e problemas contextualizados de área máxima e lançamento oblíquo.",
      },
      {
        stepNumber: 5,
        stageTitle: "Etapa 5 — Verificação da Aprendizagem",
        duration: "10 min",
        description:
          "Desafio rápido de saída (Exit Ticket): identificar e corrigir o erro de sinal em uma resolução incorreta de x² - 6x - 7 = 0, validando as raízes por Girard (x' + x'' = -b/a e x'·x'' = c/a).",
      },
    ],
    didacticResources: [
      "Quadro digital com representação gráfica de parábolas (GeoGebra / TutorIA)",
      "Cartões de verificação de sinais para o discriminante Δ = b² - 4ac",
      "Lista adaptativa de 10 questões de Equações do 2º Grau e Fatoração no ProfeIA",
    ],
    estimatedTime: "70 minutos (2 aulas de 35 min)",
    evaluationStrategy:
      "Avaliação formativa por meio da resolução comentada do Exit Ticket e verificação da taxa de acerto na bateria de questões adaptativas de Matemática na plataforma.",
    flashcards: [
      {
        question: "Por que (-b)² no discriminante Δ = b² - 4ac resulta sempre em um valor positivo ou zero para b real?",
        answer: "Porque todo número real negativo elevado ao quadrado (multiplicado por si mesmo: (-) · (-) = (+)) resulta em número positivo. Ex.: para b = -8, (-8)² = +64.",
      },
      {
        question: "O que acontece com o termo -4·a·c quando o coeficiente 'c' é negativo (e 'a' é positivo)?",
        answer: "Pela regra de sinais na multiplicação, o produto de dois negativos resulta em positivo: -4 · (+a) · (-c) = +4ac, somando-se ao valor de b².",
      },
      {
        question: "Como a fatoração por fator comum simplifica a equação 2x² - 8x + 6 = 0 antes de usar Bhaskara?",
        answer: "Colocando o 2 em evidência obtemos 2(x² - 4x + 3) = 0. Assim trabalhamos com coeficientes menores (a=1, b=-4, c=3), reduzindo erros aritméticos.",
      },
    ],
    mindMapNodes: [
      { label: "Equação do 2º Grau (ax² + bx + c = 0)", type: "core", desc: "Forma canônica com a ≠ 0" },
      { label: "Fatoração e Produtos Notáveis", type: "prerequisite", desc: "Fator comum, Soma e Produto (Girard)" },
      { label: "Discriminante Δ = b² - 4ac", type: "branch", desc: "Atenção aos parênteses em (-b)² e sinal de -4ac" },
      { label: "Fórmula de Bhaskara: x = (-b ± √Δ)/2a", type: "branch", desc: "Determinação das raízes x' e x''" },
      { label: "Interpretação Geométrica na Parábola", type: "check", desc: "Interseções com o eixo x e concavidade" },
    ],
    writtenSummary:
      "Na resolução de equações quadráticas ax² + bx + c = 0 (com a ≠ 0), a principal causa de erro aritmético reside no tratamento de sinais dos coeficientes b e c. Ao calcular o discriminante Δ = b² - 4ac, deve-se sempre isolar o coeficiente b entre parênteses: se b = -8, temos (-8)² = +64. Da mesma forma, no produto -4·a·c, caso c seja negativo, o sinal final torna-se positivo. Sempre que os coeficientes forem múltiplos de um mesmo número (como em 2x² - 8x + 6 = 0), recomenda-se dividir toda a equação ou colocar o fator comum em evidência: 2(x² - 4x + 3) = 0, permitindo inclusive encontrar as raízes rapidamente pelas Relações de Girard (soma S = -b/a = 4 e produto P = c/a = 3, logo x' = 1 e x'' = 3).",
    notificationTemplate:
      "Olá! Identificamos que revisar Fatoração de Polinômios e a Regra de Sinais no cálculo do discriminante Delta (Δ = b² - 4ac) vai ajudar você a dominar completamente a Fórmula de Bhaskara em Matemática. Acesse o roteiro de revisão e resolva os exercícios práticos separados para a turma!",
  },

  biologia: {
    disciplineId: "biologia",
    disciplineName: "Biologia",
    lessonTitle: "Bioenergética Vegetal: Fase Fotoquímica nos Tilacoides vs. Ciclo de Calvin no Estroma",
    learningObjective:
      "Diferenciar os compartimentos do cloroplasto (tilacoides e estroma) e compreender que o O₂ liberado na fotossíntese provém da fotólise da água (reação de Hill) e não do CO₂ atmosférico.",
    difficultyDiagnosis:
      "Os estudantes confundem a origem atômica do oxigênio molecular (O₂) liberado na fotossíntese, associando-o à quebra do gás carbônico (CO₂) em vez da oxidação da água (H₂O) nos tilacoides durante a etapa fotoquímica.",
    steps: [
      {
        stepNumber: 1,
        stageTitle: "Etapa 1 — Retomada do Conceito (Pré-requisito)",
        duration: "10 min",
        description:
          "Revisão da anatomia ultraestrutural do cloroplasto: membranas dos tilacoides (onde se localizam os fotossistemas I e II com clorofila) e estroma (matriz fluida rica em enzimas solúveis).",
      },
      {
        stepNumber: 2,
        stageTitle: "Etapa 2 — Explicação Orientada",
        duration: "15 min",
        description:
          "Análise da Fase Fotoquímica (Fase Clara): excitação luminosa da clorofila, fotólise da água (2 H₂O → 4 H⁺ + 4 e⁻ + O₂↑) e síntese de ATP e NADPH para alimentar a etapa química.",
      },
      {
        stepNumber: 3,
        stageTitle: "Etapa 3 — Exemplo Prático",
        duration: "15 min",
        description:
          "Estudo do experimento clássico de Ruben e Kamen com o isótopo pesado ¹⁸O: demonstração experimental de que plantas regadas com H₂¹⁸O liberam ¹⁸O₂, enquanto plantas expostas a C¹⁸O₂ incorporam o ¹⁸O na glicose.",
      },
      {
        stepNumber: 4,
        stageTitle: "Etapa 4 — Atividade Aplicada",
        duration: "20 min",
        description:
          "Construção de esquema acoplado ligando os produtos da fase clara (ATP e NADPH) ao Ciclo de Calvin-Benson no estroma (fixação do CO₂ pela enzima RuBisCO e regeneração da RuBP).",
      },
      {
        stepNumber: 5,
        stageTitle: "Etapa 5 — Verificação da Aprendizagem",
        duration: "10 min",
        description:
          "Questão diagnóstica sobre o efeito de um inibidor da enzima RuBisCO sobre a taxa de produção de ATP/NADPH e consumo de CO₂.",
      },
    ],
    didacticResources: [
      "Diagrama interativo do cloroplasto (Tilacoide vs. Estroma)",
      "Baralho de Flashcards sobre Fotólise da Água e Ciclo de Calvin",
      "Simulação visual de Bioenergética Celular no ProfeIA",
    ],
    estimatedTime: "60 minutos",
    evaluationStrategy:
      "Verificação do preenchimento correto do fluxo de elétrons (H₂O → PSII → PSI → NADPH) e resolução da lista de questões de Biologia.",
    flashcards: [
      {
        question: "De qual molécula provém o gás oxigênio (O₂) liberado para a atmosfera durante a fotossíntese?",
        answer: "Da quebra da molécula de água (fotólise da água: 2 H₂O → 4 H⁺ + 4 e⁻ + O₂), reação que ocorre nas membranas dos tilacoides sob ação da luz.",
      },
      {
        question: "Quais moléculas energéticas produzidas na Fase Fotoquímica são enviadas para o Ciclo de Calvin no estroma?",
        answer: "O ATP (energia química) e o NADPH (poder redutor), que serão consumidos para reduzir o CO₂ fixado em carboidratos (gliceraldeído-3-fosfato / glicose).",
      },
      {
        question: "Qual é o papel da enzima RuBisCO no estroma do cloroplasto?",
        answer: "Catalisar a fixação do carbono inorgânico (CO₂) unindo-o à ribulose-1,5-bisfosfato (RuBP) na primeira etapa do Ciclo de Calvin.",
      },
    ],
    mindMapNodes: [
      { label: "Fotossíntese nos Cloroplastos", type: "core", desc: "Conversão de energia luminosa em energia química" },
      { label: "Tilacoides vs. Estroma", type: "prerequisite", desc: "Compartimentalização das fases clara e escura" },
      { label: "Fase Fotoquímica (Tilacoides)", type: "branch", desc: "Fotólise da H₂O → Liberação de O₂, geração de ATP e NADPH" },
      { label: "Ciclo de Calvin (Estroma)", type: "branch", desc: "Fixação do CO₂ pela RuBisCO consumindo ATP e NADPH" },
      { label: "Experimento com Isótopo ¹⁸O", type: "check", desc: "Comprova que o O₂ vem da H₂O e não do CO₂" },
    ],
    writtenSummary:
      "A fotossíntese divide-se em duas etapas interdependentes no interior do cloroplasto: (1) A Fase Fotoquímica ocorre nas membranas dos tilacoides e depende diretamente da luz absorvida pela clorofila nos fotossistemas II e I. Nela ocorre a fotólise da água (reação de Hill: 2 H₂O → 4 H⁺ + 4 e⁻ + O₂), sendo esta a única fonte do gás oxigênio liberado para a atmosfera, além de gerar ATP e NADPH. (2) A Fase Química (Ciclo de Calvin-Benson) ocorre no estroma do cloroplasto: a enzima RuBisCO fixa o CO₂ atmosférico e utiliza o ATP e o NADPH provenientes dos tilacoides para sintetizar glicídios (C₆H₁₂O₆), regenerando ADP + Pi e NADP⁺ para a fase fotoquímica.",
    notificationTemplate:
      "Olá! Preparamos um roteiro visual de Biologia para esclarecer de vez a diferença entre a Fase Fotoquímica (nos tilacoides, com fotólise da água e liberação de O₂) e o Ciclo de Calvin (no estroma, com fixação de CO₂). Confira o material e pratique nos flashcards!",
  },

  fisica: {
    disciplineId: "fisica",
    disciplineName: "Física",
    lessonTitle: "Dinâmica Vetorial: Decomposição da Força Peso no Plano Inclinado e 2ª Lei de Newton",
    learningObjective:
      "Construir o diagrama de corpo livre em planos inclinados, decompor corretamente a força peso em Px = P·senθ e Py = P·cosθ e calcular a aceleração do bloco pela 2ª Lei de Newton (F_R = m·a).",
    difficultyDiagnosis:
      "Os estudantes trocam os fatores trigonométricos seno e cosseno ao decompor a força peso no plano inclinado (usando P·cosθ para a componente paralela ao movimento em vez de P·senθ) e esquecem que a força normal N equilibra Py = P·cosθ e não o peso total P.",
    steps: [
      {
        stepNumber: 1,
        stageTitle: "Etapa 1 — Retomada do Conceito (Pré-requisito)",
        duration: "10 min",
        description:
          "Revisão de trigonometria no triângulo retângulo (senθ = cateto oposto / hipotenusa; cosθ = cateto adjacente / hipotenusa) e semelhança de ângulos entre a rampa de inclinação θ e o eixo perpendicular ao plano.",
      },
      {
        stepNumber: 2,
        stageTitle: "Etapa 2 — Explicação Orientada",
        duration: "15 min",
        description:
          "Traçado do Diagrama de Corpo Livre adotando eixos cartesianos rotacionados (eixo x paralelo à rampa e eixo y perpendicular à rampa): demonstração geométrica de que Px = m·g·senθ puxa o bloco rampa abaixo e Py = m·g·cosθ comprime a superfície (N = Py).",
      },
      {
        stepNumber: 3,
        stageTitle: "Etapa 3 — Exemplo Prático",
        duration: "15 min",
        description:
          "Resolução guiada: um bloco de 10 kg desliza em um plano inclinado de θ = 30° (sen 30° = 0,5; cos 30° ≈ 0,87; g = 10 m/s²) com coeficiente de atrito μ = 0,2. Cálculo de Px = 50 N, N = Py = 87 N, Fat = 17,4 N e aceleração a = (50 - 17,4)/10 = 3,26 m/s².",
      },
      {
        stepNumber: 4,
        stageTitle: "Etapa 4 — Atividade Aplicada",
        duration: "15 min",
        description:
          "Análise de casos limites para validação intuitiva: testar θ = 0° (plano horizontal → sen 0° = 0 → Px = 0 e N = P) e θ = 90° (queda livre → sen 90° = 1 → Px = P e N = 0).",
      },
      {
        stepNumber: 5,
        stageTitle: "Etapa 5 — Verificação da Aprendizagem",
        duration: "10 min",
        description:
          "Exercício de verificação individual com cálculo da tração em fio e força resultante sobre bloco em plano inclinado.",
      },
    ],
    didacticResources: [
      "Quadro branco do TutorIA com simulação vetorial de Plano Inclinado",
      "Guia prático do teste de ângulo limite (θ → 0° e θ → 90°)",
      "Lista de 10 exercícios de Leis de Newton e Decomposição Vetorial",
    ],
    estimatedTime: "65 minutos",
    evaluationStrategy:
      "Avaliação do Diagrama de Corpo Livre desenhado pelos alunos e conferência dos cálculos de força resultante e aceleração.",
    flashcards: [
      {
        question: "Em um plano inclinado de ângulo θ com a horizontal, qual é a expressão da componente tangencial do peso (Px) que atua na direção da rampa?",
        answer: "Px = P · sen(θ) = m · g · sen(θ). Mnemônico prático: 'Sem atrito, o bloco desce escorregando no SENo (Px = P·senθ); se está colado na rampa, usa COSSeno (Py = P·cosθ)'.",
      },
      {
        question: "Por que a força Normal (N) em um plano inclinado não é igual ao Peso total (P = m·g)?",
        answer: "Porque a Normal é perpendicular à superfície de apoio e equilibra apenas a componente perpendicular do peso: N = Py = m · g · cos(θ).",
      },
      {
        question: "Como usar o teste do caso limite θ = 0° para nunca errar seno e cosseno no plano inclinado?",
        answer: "Se θ = 0° (chão reto), o bloco não escorrega sozinho (Px = 0). Como sen(0°) = 0 e cos(0°) = 1, a componente de descida só pode ser P·sen(θ) e a normal só pode ser P·cos(θ).",
      },
    ],
    mindMapNodes: [
      { label: "Leis de Newton no Plano Inclinado", type: "core", desc: "F_resultante = m · a" },
      { label: "Decomposição Vetorial Ortogonal", type: "prerequisite", desc: "Eixo x (paralelo à rampa) e Eixo y (perpendicular)" },
      { label: "Componente Tangencial: Px = P·senθ", type: "branch", desc: "Responsável pela tendência de descida na rampa" },
      { label: "Componente Normal: Py = P·cosθ", type: "branch", desc: "Equilibra a reação Normal (N = Py) e define Fat = μ·N" },
      { label: "Teste de Limites (0° e 90°)", type: "check", desc: "Validação física contra inversão de seno/cosseno" },
    ],
    writtenSummary:
      "Para aplicar o Princípio Fundamental da Dinâmica (F_R = m·a) a um corpo sobre um plano inclinado de ângulo θ em relação à horizontal, adota-se um referencial com eixo x paralelo à rampa e eixo y perpendicular a ela. A força peso P = m·g (sempre vertical para baixo) forma o ângulo θ com o eixo perpendicular y. Assim, a componente que comprime o plano é Py = P·cosθ (equilibrada pela força Normal: N = P·cosθ), enquanto a componente que traciona o bloco ao longo da rampa é Px = P·senθ. Havendo atrito dinâmico, a força de atrito vale Fat = μ·N = μ·m·g·cosθ, e a equação do movimento na descida torna-se: m·g·senθ - μ·m·g·cosθ = m·a.",
    notificationTemplate:
      "Olá! Disponibilizamos uma revisão prática de Física sobre Decomposição Vetorial no Plano Inclinado (Px = P·senθ e Py = P·cosθ) e 2ª Lei de Newton, incluindo o método de casos limites para nunca confundir seno e cosseno. Bons estudos!",
  },

  "banco-de-dados": {
    disciplineId: "banco-de-dados",
    disciplineName: "Banco de Dados",
    lessonTitle: "Modelagem Relacional Prática: Integridade Referencial (PK/FK) e Junções SQL (INNER JOIN vs. LEFT JOIN)",
    learningObjective:
      "Compreender o vínculo de integridade referencial entre Chave Primária (PK) e Chave Estrangeira (FK) e escrever consultas SQL utilizando INNER JOIN e LEFT JOIN com a cláusula ON explicitamente declarada.",
    difficultyDiagnosis:
      "Os alunos omitem a cláusula ON nas consultas JOIN (gerando produto cartesiano indesejado) ou invertem a coluna da Chave Primária (PK) com a Chave Estrangeira (FK) ao relacionar duas tabelas.",
    steps: [
      {
        stepNumber: 1,
        stageTitle: "Etapa 1 — Retomada do Conceito (Pré-requisito)",
        duration: "10 min",
        description:
          "Revisão de Chave Primária (identificador único da tupla na tabela origem, ex.: alunos.id) e Chave Estrangeira (coluna na tabela dependente que referencia a PK, ex.: matriculas.aluno_id).",
      },
      {
        stepNumber: 2,
        stageTitle: "Etapa 2 — Explicação Orientada",
        duration: "15 min",
        description:
          "Representação visual com Diagramas de Venn: comparação entre INNER JOIN (retorna apenas registros com correspondência em ambas as tabelas) e LEFT JOIN (retorna todos os registros da tabela à esquerda, preenchendo com NULL onde não houver correspondência à direita).",
      },
      {
        stepNumber: 3,
        stageTitle: "Etapa 3 — Exemplo Prático",
        duration: "15 min",
        description:
          "Execução comentada da query: SELECT a.nome, m.disciplina FROM alunos a INNER JOIN matriculas m ON a.id = m.aluno_id; demonstrando o erro de produto cartesiano quando a condição ON é omitida.",
      },
      {
        stepNumber: 4,
        stageTitle: "Etapa 4 — Atividade Aplicada",
        duration: "20 min",
        description:
          "Laboratório prático SQL: escrever 4 consultas relacionando as tabelas 'alunos', 'turmas' e 'matriculas', incluindo um LEFT JOIN com filtro WHERE m.id IS NULL para listar alunos ainda sem matrícula.",
      },
      {
        stepNumber: 5,
        stageTitle: "Etapa 5 — Verificação da Aprendizagem",
        duration: "10 min",
        description:
          "Revisão cruzada de queries SQL para validar o uso de aliases de tabela e a igualdade exata ON pk = fk.",
      },
    ],
    didacticResources: [
      "Diagramas de Venn para Junções SQL (INNER, LEFT, RIGHT JOIN)",
      "Esquema relacional das tabelas 'alunos' e 'matriculas' da turma INFVES3SB",
      "Bateria de exercícios práticos de SQL no ProfeIA",
    ],
    estimatedTime: "70 minutos",
    evaluationStrategy:
      "Validação sintática e semântica das consultas SQL escritas pelos alunos e resolução das questões de Banco de Dados.",
    flashcards: [
      {
        question: "Qual é a função obrigatória da cláusula ON em um comando INNER JOIN ou LEFT JOIN no SQL?",
        answer: "Estabelecer a condição lógica de igualdade entre a Chave Primária (PK) de uma tabela e a Chave Estrangeira (FK) da outra (ex.: ON alunos.id = matriculas.aluno_id).",
      },
      {
        question: "Qual é a diferença prática entre o resultado de um INNER JOIN e o de um LEFT JOIN?",
        answer: "O INNER JOIN traz apenas as linhas que possuem correspondência nas duas tabelas; o LEFT JOIN traz todas as linhas da tabela da esquerda, mesmo que não tenham registro correspondente na tabela da direita.",
      },
      {
        question: "O que acontece se juntarmos duas tabelas em SQL sem especificar a condição de junção entre PK e FK?",
        answer: "Ocorre um Produto Cartesiano (CROSS JOIN), combinando cada linha da primeira tabela com todas as linhas da segunda tabela e gerando dados duplicados e incorretos.",
      },
    ],
    mindMapNodes: [
      { label: "Consultas Relacionais SQL (JOINs)", type: "core", desc: "Combinação de dados entre múltiplas tabelas" },
      { label: "PK (Primary Key) e FK (Foreign Key)", type: "prerequisite", desc: "Base da integridade referencial relacional" },
      { label: "Cláusula ON (ON a.id = b.a_id)", type: "branch", desc: "Critério de igualdade que evita produto cartesiano" },
      { label: "INNER JOIN (Interseção)", type: "branch", desc: "Retorna apenas tuplas com vínculo em ambas as tabelas" },
      { label: "LEFT JOIN (Inclusão à Esquerda)", type: "check", desc: "Preserva todos os registros da tabela principal" },
    ],
    writtenSummary:
      "Em bancos de dados relacionais, os dados são normalizados em tabelas distintas conectadas por Chaves Primárias (PK) e Chaves Estrangeiras (FK). Para reconstruir informações consolidadas em uma consulta SELECT, utiliza-se a operação JOIN seguida obrigatoriamente da cláusula ON, que iguala a PK da tabela pai à FK da tabela filha (ex.: FROM alunos a INNER JOIN matriculas m ON a.id = m.aluno_id). Enquanto o INNER JOIN filtra apenas a interseção (alunos que possuem matrícula), o LEFT JOIN preserva integralmente os registros da tabela à esquerda, permitindo inclusive identificar registros órfãos ou pendentes com WHERE m.aluno_id IS NULL.",
    notificationTemplate:
      "Olá! Liberamos um material prático de Banco de Dados sobre Chave Primária (PK), Chave Estrangeira (FK) e consultas com INNER JOIN e LEFT JOIN usando a cláusula ON. Confira os exemplos SQL e pratique nas atividades!",
  },

  "lingua-portuguesa-redacao": {
    disciplineId: "lingua-portuguesa-redacao",
    disciplineName: "Língua Portuguesa e Redação",
    lessonTitle: "Oficina de Redação Nota 1000: Os 5 Elementos Obrigatórios da Proposta de Intervenção (Competência 5)",
    learningObjective:
      "Estruturar parágrafos conclusivos completos na redação dissertativo-argumentativa articulando de forma explícita os 5 elementos avaliados na Competência 5 do ENEM: Agente, Ação, Meio/Modo, Efeito e Detalhamento.",
    difficultyDiagnosis:
      "Os estudantes indicam o Agente social (ex.: Ministério da Educação) e a Ação interventiva, mas omitem o Meio/Modo de execução ('por meio de...') ou deixam de detalhar um dos elementos com aposto explicativo, exemplificação ou justificativa.",
    steps: [
      {
        stepNumber: 1,
        stageTitle: "Etapa 1 — Retomada do Conceito (Pré-requisito)",
        duration: "10 min",
        description:
          "Revisão da função do parágrafo de conclusão no texto dissertativo-argumentativo e das 5 perguntas-chave: Quem fará? (Agente), O que fará? (Ação), Como fará? (Meio/Modo), Para que fará? (Efeito) e Qual informação extra explica um desses itens? (Detalhamento).",
      },
      {
        stepNumber: 2,
        stageTitle: "Etapa 2 — Explicação Orientada",
        duration: "15 min",
        description:
          "Diferenciação sintática e semântica entre Meio/Modo (instrumento técnico, financeiro ou pedagógico introduzido por 'mediante', 'por meio de', 'através de') e Efeito (finalidade introduzida por 'a fim de', 'com o intuito de', 'para que').",
      },
      {
        stepNumber: 3,
        stageTitle: "Etapa 3 — Exemplo Prático",
        duration: "15 min",
        description:
          "Decomposição colorida em tela de um parágrafo conclusivo nota 1000, identificando cada um dos 5 elementos e mostrando como inserir um aposto explicativo entre travessões ou vírgulas para garantir a pontuação do Detalhamento.",
      },
      {
        stepNumber: 4,
        stageTitle: "Etapa 4 — Atividade Aplicada",
        duration: "20 min",
        description:
          "Reescrita orientada: cada aluno recebe uma conclusão incompleta (nota 120/200) e deve reescrevê-la acrescentando o Meio/Modo e o Detalhamento ausentes.",
      },
      {
        stepNumber: 5,
        stageTitle: "Etapa 5 — Verificação da Aprendizagem",
        duration: "10 min",
        description:
          "Aplicação do checklist de 5 pontos em pares: auditoria cruzada do parágrafo escrito pelo colega.",
      },
    ],
    didacticResources: [
      "Checklist visual dos 5 Elementos da Competência 5 (Agente, Ação, Meio, Efeito, Detalhamento)",
      "Banco de conectivos conclusivos e estruturas de detalhamento por aposto",
      "Atividades práticas de Redação e Língua Portuguesa no ProfeIA",
    ],
    estimatedTime: "70 minutos",
    evaluationStrategy:
      "Correção analítica do parágrafo conclusivo reescrito verificando a presença explícita dos 5 elementos obrigatórios.",
    flashcards: [
      {
        question: "Quais são os 5 elementos obrigatórios avaliados na Competência 5 da redação do ENEM?",
        answer: "1. Agente (quem executa); 2. Ação (o que será feito); 3. Meio/Modo (como será executado); 4. Efeito/Finalidade (para que será feito); 5. Detalhamento (explicação, exemplo ou justificativa de um dos elementos).",
      },
      {
        question: "Como introduzir claramente o Meio/Modo na proposta de intervenção sem confundi-lo com a Ação?",
        answer: "Utilizando locuções prepositivas instrumentais como 'por meio de...', 'mediante...' ou 'por intermédio de...', especificando os recursos humanos, pedagógicos ou legais utilizados.",
      },
      {
        question: "Qual é a forma mais segura de garantir o Detalhamento na conclusão da redação?",
        answer: "Inserir um aposto explicativo ou oração adjetiva entre travessões ou vírgulas logo após o Agente (ex.: 'cabe ao MEC — órgão máximo da educação nacional —') ou exemplificar o Meio/Modo.",
      },
    ],
    mindMapNodes: [
      { label: "Proposta de Intervenção (Competência 5)", type: "core", desc: "Solução concreta e respeitosa aos Direitos Humanos" },
      { label: "Meio/Modo vs. Detalhamento", type: "prerequisite", desc: "Elementos mais esquecidos nas redações da turma" },
      { label: "Agente + Ação", type: "branch", desc: "Ator social específico (GOMIFES) + verbo de ação concreta" },
      { label: "Meio/Modo ('por meio de...')", type: "branch", desc: "Instrumento prático que viabiliza a execução da ação" },
      { label: "Efeito ('a fim de...') + Detalhamento", type: "check", desc: "Finalidade social e explicação adicional de um elemento" },
    ],
    writtenSummary:
      "Para alcançar a nota máxima (200 pontos) na Competência 5 da redação dissertativo-argumentativa, o parágrafo conclusivo deve articular cinco elementos indispensáveis: (1) Agente: quem executará a medida (ex.: Ministério da Educação, Secretarias Estaduais, mídia, escolas); (2) Ação: o que será feito de forma prática (evitando verbos vagos como 'conscientizar'); (3) Meio/Modo: como a ação será viabilizada na prática, introduzido por expressões como 'por meio de' ou 'mediante'; (4) Efeito: o impacto social esperado, introduzido por 'a fim de' ou 'com o fito de'; e (5) Detalhamento: uma informação adicional que qualifica, exemplifica ou justifica um dos quatro elementos anteriores (por exemplo, um aposto entre travessões caracterizando o Agente ou desdobrando o Meio/Modo).",
    notificationTemplate:
      "Olá! Preparamos um guia prático de Língua Portuguesa e Redação com o checklist dos 5 Elementos da Proposta de Intervenção (Agente, Ação, Meio/Modo, Efeito e Detalhamento) para você garantir 200 pontos na Competência 5!",
  },

  geografia: {
    disciplineId: "geografia",
    disciplineName: "Geografia",
    lessonTitle: "Geopolítica e Economia Global: Da DIT Clássica à Nova Divisão Internacional do Trabalho",
    learningObjective:
      "Analisar as transformações da Divisão Internacional do Trabalho (DIT) ao longo das Revoluções Industriais, compreendendo o papel das cadeias globais de valor e dos países emergentes industrializados.",
    difficultyDiagnosis:
      "Os estudantes confundem a DIT Clássica (metrópoles industriais vs. colônias/periferias exclusivamente agroexportadoras) com a Nova DIT pós-Terceira Revolução Industrial, na qual países emergentes (como Brasil, México, China e Índia) também são industrializados, mas dependem de tecnologia de ponta e royalties das matrizes centrais.",
    steps: [
      {
        stepNumber: 1,
        stageTitle: "Etapa 1 — Retomada do Conceito (Pré-requisito)",
        duration: "10 min",
        description:
          "Linha do tempo das 1ª, 2ª e 3ª Revoluções Industriais (Revolução Técnico-Científico-Informacional) e o processo de transnacionalização produtiva a partir da segunda metade do século XX.",
      },
      {
        stepNumber: 2,
        stageTitle: "Etapa 2 — Explicação Orientada",
        duration: "15 min",
        description:
          "Comparação estrutural entre a DIT Clássica e a Nova DIT: desconcentração fabril para países periféricos/emergentes em busca de mão de obra qualificada mais barata, incentivos fiscais e amplo mercado consumidor, mantendo os centros de P&D (Pesquisa e Desenvolvimento) nos países centrais.",
      },
      {
        stepNumber: 3,
        stageTitle: "Etapa 3 — Exemplo Prático",
        duration: "15 min",
        description:
          "Estudo da cadeia global de um smartphone: design de arquitetura e patentes nos EUA/Europa, fabricação de semicondutores em Taiwan/Coreia do Sul, montagem industrial na Ásia e extração mineral na América Latina/África.",
      },
      {
        stepNumber: 4,
        stageTitle: "Etapa 4 — Atividade Aplicada",
        duration: "15 min",
        description:
          "Análise de fluxos cartográficos de investimentos diretos estrangeiros (IDE), remessa de lucros e balança tecnológica entre países desenvolvidos, emergentes e periféricos.",
      },
      {
        stepNumber: 5,
        stageTitle: "Etapa 5 — Verificação da Aprendizagem",
        duration: "10 min",
        description:
          "Resolução comentada de questão contextualizada sobre desindustrialização prematura e reprimarização da pauta exportadora.",
      },
    ],
    didacticResources: [
      "Mapa de fluxos da Nova Divisão Internacional do Trabalho e Cadeias Globais de Valor",
      "Quadro comparativo: DIT Colonial, DIT Clássica e Nova DIT",
      "Flashcards e questões de Geografia Econômica no ProfeIA",
    ],
    estimatedTime: "65 minutos",
    evaluationStrategy:
      "Análise da argumentação geográfica dos estudantes na distinção entre industrialização clássica e industrialização tardia/periférica.",
    flashcards: [
      {
        question: "O que diferencia fundamentalmente a Nova DIT (pós-1950) da DIT Clássica?",
        answer: "Na Nova DIT, países subdesenvolvidos/emergentes deixaram de exportar apenas matérias-primas e passaram a abrigar filiais de multinacionais e exportar produtos industrializados, embora mantenham dependência financeira e tecnológica (royalties/patentes) em relação aos países centrais.",
      },
      {
        question: "Por que as empresas transnacionais transferiram fábricas para países emergentes na 3ª Revolução Industrial?",
        answer: "Para reduzir custos produtivos por meio de mão de obra mais barata, isenções fiscais, legislação ambiental flexibilizada e proximidade a novos mercados consumidores em expansão.",
      },
      {
        question: "Onde permanecem concentrados os centros de Pesquisa e Desenvolvimento (P&D) nas cadeias globais de valor?",
        answer: "Nas sedes (matrizes) localizadas nos países centrais desenvolvidos, que detêm a propriedade intelectual e o maior valor agregado da cadeia produtiva.",
      },
    ],
    mindMapNodes: [
      { label: "Divisão Internacional do Trabalho (DIT)", type: "core", desc: "Especialização produtiva e trocas econômicas globais" },
      { label: "Revoluções Industriais e Globalização", type: "prerequisite", desc: "Expansão das empresas transnacionais pelo mundo" },
      { label: "DIT Clássica", type: "branch", desc: "Países Centrais (Manufaturas) x Periferia (Matérias-primas)" },
      { label: "Nova DIT Contemporânea", type: "branch", desc: "Emergentes Industrializados x Centro detentor de P&D e Patentes" },
      { label: "Cadeias Globais de Valor", type: "check", desc: "Fragmentação produtiva em escala planetária" },
    ],
    writtenSummary:
      "A Divisão Internacional do Trabalho (DIT) expressa a forma como as funções produtivas e comerciais são distribuídas entre os países no sistema econômico mundial. Na DIT Clássica (séculos XIX e início do XX), havia uma oposição rígida entre os países centrais industrializados (exportadores de manufaturas e capitais) e os países periféricos (fornecedores exclusivos de matérias-primas agrícolas e minerais). Após a Segunda Guerra Mundial e a Terceira Revolução Industrial, configurou-se a Nova DIT: corporações transnacionais instalaram parques fabris em países emergentes de industrialização tardia (como Brasil, México e Tigres Asiáticos). Assim, a periferia emergente passou também a exportar bens manufaturados, mas a hierarquia global manteve-se através do controle de tecnologia de ponta, patentes, fluxos financeiros e Pesquisa & Desenvolvimento (P&D) sediados nas metrópoles desenvolvidas.",
    notificationTemplate:
      "Olá! Disponibilizamos o roteiro de Geografia sobre a Nova Divisão Internacional do Trabalho (DIT), Cadeias Globais de Valor e Industrialização Tardia. Revise o quadro comparativo e pratique nas questões!",
  },

  sociologia: {
    disciplineId: "sociologia",
    disciplineName: "Sociologia",
    lessonTitle: "Clássicos da Sociologia: Fato Social em Émile Durkheim vs. Ação Social e Tipologia em Max Weber",
    learningObjective:
      "Distinguir o paradigma positivista/funcionalista do Fato Social em Durkheim (coercitividade, exterioridade e generalidade) do método compreensivo da Ação Social em Max Weber e seus quatro tipos ideais.",
    difficultyDiagnosis:
      "Os alunos confundem a perspectiva estrutural de Émile Durkheim (na qual a sociedade se impõe sobre o indivíduo) com a sociologia compreensiva de Max Weber (centrada no sentido subjetivo atribuído pelo agente à sua conduta).",
    steps: [
      {
        stepNumber: 1,
        stageTitle: "Etapa 1 — Retomada do Conceito (Pré-requisito)",
        duration: "10 min",
        description:
          "Revisão das características do Fato Social segundo Émile Durkheim: exterioridade (existe antes e fora da consciência individual), coercitividade (impõe sanções legais ou morais) e generalidade (repete-se na coletividade).",
      },
      {
        stepNumber: 2,
        stageTitle: "Etapa 2 — Explicação Orientada",
        duration: "15 min",
        description:
          "Apresentação da Sociologia Compreensiva de Max Weber: definição de Ação Social como toda conduta humana dotada de sentido subjetivo orientado pelo comportamento de outros indivíduos.",
      },
      {
        stepNumber: 3,
        stageTitle: "Etapa 3 — Exemplo Prático",
        duration: "15 min",
        description:
          "Exemplificação cotidiana dos 4 tipos puros (tipos ideais) de ação social em Weber: (1) Racional com relação a fins (estudar para passar no concurso/vestibular); (2) Racional com relação a valores (agir por convicção ética/religiosa inegociável); (3) Afetiva (agir movido por emoção imediata); (4) Tradicional (agir por hábito ou costume enraizado).",
      },
      {
        stepNumber: 4,
        stageTitle: "Etapa 4 — Atividade Aplicada",
        duration: "15 min",
        description:
          "Estudo de caso comparado: analisar um mesmo fenômeno contemporâneo (ex.: escolha profissional e trabalho digital) sob a ótica de Durkheim e sob a ótica de Weber.",
      },
      {
        stepNumber: 5,
        stageTitle: "Etapa 5 — Verificação da Aprendizagem",
        duration: "10 min",
        description:
          "Classificação rápida de 4 situações sociais reais nos tipos ideais weberianos e identificação dos atributos durkheimianos.",
      },
    ],
    didacticResources: [
      "Quadro comparativo: Durkheim (Fato Social) x Weber (Ação Social)",
      "Estudos de caso dos 4 Tipos Ideais de Ação Social para repertório de redação",
      "Flashcards e exercícios comentados de Sociologia no ProfeIA",
    ],
    estimatedTime: "65 minutos",
    evaluationStrategy:
      "Verificação da precisão conceitual na distinção entre coerção coletiva (Durkheim) e sentido subjetivo da ação (Weber).",
    flashcards: [
      {
        question: "Quais são as três características fundamentais que definem um Fato Social para Émile Durkheim?",
        answer: "Coercitividade (força impositiva sobre os indivíduos), Exterioridade (independe da vontade individual) e Generalidade (manifesta-se de forma coletiva na sociedade).",
      },
      {
        question: "O que define uma Ação Social na sociologia compreensiva de Max Weber?",
        answer: "É toda conduta humana à qual o agente atribui um sentido ou significado subjetivo, orientando-se pela ação passada, presente ou esperada de outros indivíduos.",
      },
      {
        question: "Quais são os 4 tipos puros (tipos ideais) de Ação Social formulados por Max Weber?",
        answer: "1. Ação racional com relação a fins; 2. Ação racional com relação a valores; 3. Ação afetiva (emocional); 4. Ação tradicional (costumes/hábitos).",
      },
    ],
    mindMapNodes: [
      { label: "Teoria Sociológica Clássica", type: "core", desc: "Relação entre Indivíduo e Sociedade" },
      { label: "Durkheim vs. Weber", type: "prerequisite", desc: "Estrutura coletiva objetiva vs. Sentido subjetivo da ação" },
      { label: "Émile Durkheim: Fato Social", type: "branch", desc: "Exterioridade, Coercitividade e Generalidade" },
      { label: "Max Weber: Ação Social", type: "branch", desc: "Método compreensivo e Tipos Ideais de conduta" },
      { label: "Os 4 Tipos de Ação Social", type: "check", desc: "Racional a fins, Racional a valores, Afetiva e Tradicional" },
    ],
    writtenSummary:
      "Na sociologia clássica, Émile Durkheim e Max Weber estabeleceram matrizes metodológicas distintas para explicar a vida em sociedade. Para Durkheim (método funcionalista/objetivista), o objeto da Sociologia é o Fato Social — maneiras coletivas de agir, pensar e sentir que são exteriores ao indivíduo, gerais no grupo e dotadas de poder coercitivo (impondo sanções jurídicas ou morais). Já para Max Weber (método compreensivo), a sociedade é compreendida a partir da Ação Social, isto é, a conduta dotada de sentido subjetivo pelo próprio sujeito em referência a outros atores. Para analisá-la, Weber propôs quatro tipos ideais: ação racional com relação a fins (cálculo estratégico entre meios e objetivos), ação racional com relação a valores (fidelidade a princípios éticos ou religiosos), ação afetiva (motivada por sentimentos imediatos) e ação tradicional (guiada por costumes arraigados).",
    notificationTemplate:
      "Olá! Liberamos o estudo comparado de Sociologia entre Fato Social (Émile Durkheim) e Ação Social (Max Weber), incluindo exemplos práticos dos 4 tipos de ação social e repertório sociocultural. Confira!",
  },

  "analise-projeto-sistemas": {
    disciplineId: "analise-projeto-sistemas",
    disciplineName: "Análise e Projeto de Sistemas",
    lessonTitle: "Modelagem UML 2.5: Requisitos de Software e Relacionamentos <<include>> e <<extend>> em Casos de Uso",
    learningObjective:
      "Classificar corretamente Requisitos Funcionais (RF) e Não Funcionais (RNF) e construir Diagramas de Casos de Uso UML aplicando a semântica e direção corretas das setas tracejadas <<include>> e <<extend>>.",
    difficultyDiagnosis:
      "As equipes de projeto invertem a direção da seta tracejada entre os estereótipos <<include>> e <<extend>> nos diagramas UML e confundem regras de qualidade/restrições técnicas (RNF) com casos de uso do usuário (RF).",
    steps: [
      {
        stepNumber: 1,
        stageTitle: "Etapa 1 — Retomada do Conceito (Pré-requisito)",
        duration: "10 min",
        description:
          "Distinção prática entre Requisito Funcional (serviço/ação que o sistema oferece ao ator, ex.: 'Realizar Empréstimo') e Requisito Não Funcional (restrição de desempenho, segurança, usabilidade ou disponibilidade, ex.: 'Tempo de resposta < 500ms').",
      },
      {
        stepNumber: 2,
        stageTitle: "Etapa 2 — Explicação Orientada",
        duration: "15 min",
        description:
          "Semântica e direção das setas na UML 2.5: no <<include>> (execução obrigatória em toda chamada), a seta aponta do Caso de Uso Base para o Caso de Uso Incluído; no <<extend>> (execução condicional/opcional mediante ponto de extensão), a seta aponta do Caso de Uso Estendido de volta para o Caso de Uso Base.",
      },
      {
        stepNumber: 3,
        stageTitle: "Etapa 3 — Exemplo Prático",
        duration: "15 min",
        description:
          "Modelagem ao vivo de um sistema acadêmico: 'Confirmar Matrícula' ──<<include>>──> 'Validar Pré-requisitos' (sempre executado) versus 'Emitir Comprovante por E-mail' ──<<extend>>──> 'Confirmar Matrícula' (opcional).",
      },
      {
        stepNumber: 4,
        stageTitle: "Etapa 4 — Atividade Aplicada",
        duration: "20 min",
        description:
          "Revisão e correção do Diagrama de Casos de Uso do próprio projeto de TCC da equipe, demarcando a fronteira do sistema, os atores primários/secundários e os relacionamentos.",
      },
      {
        stepNumber: 5,
        stageTitle: "Etapa 5 — Verificação da Aprendizagem",
        duration: "10 min",
        description:
          "Inspeção rápida de 3 cenários UML identificando se a relação correta é associação simples, generalização, <<include>> ou <<extend>>.",
      },
    ],
    didacticResources: [
      "Guia visual de notação UML 2.5 (direção das setas em <<include>> vs. <<extend>>)",
      "Checklist de distinção entre Requisitos Funcionais (RF) e Não Funcionais (RNF)",
      "Questões diagnósticas de Análise e Projeto de Sistemas no ProfeIA",
    ],
    estimatedTime: "70 minutos",
    evaluationStrategy:
      "Auditoria técnica do Diagrama de Casos de Uso da equipe verificando a direção das setas tracejadas e a exclusão de RNFs de dentro das elipses de casos de uso.",
    flashcards: [
      {
        question: "Qual é a diferença de obrigatoriedade e direção da seta entre <<include>> e <<extend>> no Diagrama de Casos de Uso UML?",
        answer: "O <<include>> é obrigatório (sempre executado) e a seta vai do Caso Base para o Caso Incluído. O <<extend>> é opcional/condicional e a seta aponta do Caso Estendido para o Caso Base.",
      },
      {
        question: "Qual é a diferença entre um Requisito Funcional (RF) e um Requisito Não Funcional (RNF)?",
        answer: "O RF define o que o sistema faz (funcionalidades e casos de uso entregues ao usuário); o RNF define como o sistema deve operar (critérios de segurança, desempenho, disponibilidade e padrões técnicos).",
      },
      {
        question: "Um Requisito Não Funcional (como 'criptografar senha com bcrypt em menos de 500ms') deve ser desenhado como uma elipse de Caso de Uso na UML?",
        answer: "Não! Elipses de Casos de Uso representam objetivos funcionais do ator (RFs). Restrições técnicas (RNFs) são documentadas na especificação suplementar ou nas regras do caso de uso.",
      },
    ],
    mindMapNodes: [
      { label: "Engenharia de Requisitos e UML 2.5", type: "core", desc: "Modelagem comportamental de sistemas de software" },
      { label: "RF (O que faz) vs. RNF (Restrições)", type: "prerequisite", desc: "Base para identificar casos de uso reais" },
      { label: "Relacionamento <<include>>", type: "branch", desc: "Inclusão obrigatória: Seta do Base → Incluído" },
      { label: "Relacionamento <<extend>>", type: "branch", desc: "Extensão condicional: Seta do Estendido → Base" },
      { label: "Fronteira do Sistema e Atores", type: "check", desc: "Delimitação clara do escopo do software" },
    ],
    writtenSummary:
      "Na Análise e Projeto de Sistemas, o levantamento de requisitos separa os Requisitos Funcionais (RF — funcionalidades e interações diretas entre usuário e sistema) dos Requisitos Não Funcionais (RNF — restrições de performance, segurança, usabilidade e arquitetura). Apenas os Requisitos Funcionais dão origem às elipses do Diagrama de Casos de Uso UML. Ao relacionar casos de uso entre si, utilizam-se dois estereótipos principais: (1) <<include>>, quando um comportamento complementar é obrigatoriamente executado todas as vezes em que o caso base ocorre (a seta tracejada parte do Caso Base para o Caso Incluído); e (2) <<extend>>, quando um comportamento adicional ocorre apenas sob uma condição específica em um ponto de extensão (a seta tracejada parte do Caso Estendido em direção ao Caso Base).",
    notificationTemplate:
      "Olá! Disponibilizamos o guia visual de Análise e Projeto de Sistemas sobre Requisitos (RF vs. RNF) e a direção correta das setas em <<include>> e <<extend>> nos Diagramas de Casos de Uso UML. Revise para aplicar no seu projeto!",
  },

  "materia-pratica-estagio-tcc": {
    disciplineId: "materia-pratica-estagio-tcc",
    disciplineName: "Matéria Prática de Estágio e TCC",
    lessonTitle: "Oficina Metodológica de TCC: Delimitação do Problema de Pesquisa, Objetivos e Normas ABNT (NBR 14724 / NBR 6023)",
    learningObjective:
      "Formular uma pergunta norteadora (Problema de Pesquisa) clara, específica e empiricamente verificável, alinhada ao Objetivo Geral, Objetivos Específicos e às regras de citação e referência da ABNT.",
    difficultyDiagnosis:
      "Os grupos de TCC apresentam temas excessivamente amplos sem recorte empírico, confundem a pergunta do Problema de Pesquisa com os verbos no infinitivo dos Objetivos e cometem falhas na formatação de citações diretas longas (> 3 linhas) e indiretas segundo a ABNT.",
    steps: [
      {
        stepNumber: 1,
        stageTitle: "Etapa 1 — Retomada do Conceito (Pré-requisito)",
        duration: "10 min",
        description:
          "Diferenciação prática entre Tema (assunto geral), Delimitação do Tema (recorte espacial, temporal e público-alvo), Problema de Pesquisa (pergunta científica interrogativa) e Objetivos (verbos de ação no infinitivo).",
      },
      {
        stepNumber: 2,
        stageTitle: "Etapa 2 — Explicação Orientada",
        duration: "15 min",
        description:
          "Estrutura de alinhamento metodológico: como transformar a pergunta do Problema no Objetivo Geral (ex.: 'Desenvolver / Analisar...') e desdobrá-lo em 3 a 4 Objetivos Específicos sequenciais (diagnosticar, modelar, implementar, validar).",
      },
      {
        stepNumber: 3,
        stageTitle: "Etapa 3 — Exemplo Prático",
        duration: "15 min",
        description:
          "Padronização ABNT ao vivo (NBR 10520 e NBR 6023): diferença entre citação indireta/paráfrase — Autor (2026) —, citação direta curta (até 3 linhas, com aspas e página) e citação direta longa (mais de 3 linhas, recuo de 4 cm, fonte 10, espaçamento simples e sem aspas).",
      },
      {
        stepNumber: 4,
        stageTitle: "Etapa 4 — Atividade Aplicada",
        duration: "20 min",
        description:
          "Refinamento da Matriz de Consistência Metodológica de cada equipe de TCC (Tema Delimitado + Pergunta-Problema + Objetivo Geral + 3 Objetivos Específicos).",
      },
      {
        stepNumber: 5,
        stageTitle: "Etapa 5 — Verificação da Aprendizagem",
        duration: "10 min",
        description:
          "Validação da Matriz de Consistência de cada dupla/grupo junto ao professor orientador.",
      },
    ],
    didacticResources: [
      "Matriz de Consistência Metodológica do TCC (Problema x Objetivos x Justificativa)",
      "Guia Rápido ABNT NBR 14724, NBR 10520 (Citações) e NBR 6023 (Referências)",
      "Questões práticas de Metodologia Científica e TCC no ProfeIA",
    ],
    estimatedTime: "70 minutos",
    evaluationStrategy:
      "Avaliação direta da pergunta-problema delimitada, da coerência dos verbos no infinitivo nos objetivos e da formatação ABNT.",
    flashcards: [
      {
        question: "Qual é a diferença estrutural entre o Problema de Pesquisa e o Objetivo Geral no TCC?",
        answer: "O Problema de Pesquisa é sempre formulado como uma pergunta delimitada e investigativa (terminada com '?'), enquanto o Objetivo Geral é uma frase afirmativa iniciada por verbo no infinitivo que declara o propósito central para responder àquela pergunta.",
      },
      {
        question: "Como deve ser formatada uma citação direta com mais de 3 linhas segundo a ABNT (NBR 10520)?",
        answer: "Em parágrafo próprio isolado, com recuo de 4 cm da margem esquerda, fonte menor (tamanho 10), espaçamento simples, sem aspas e indicando (AUTOR, ano, p. XX).",
      },
      {
        question: "Por que os Objetivos Específicos devem começar com verbos no infinitivo como 'identificar', 'modelar', 'implementar' e 'avaliar'?",
        answer: "Porque representam as etapas operacionais intermediárias e mensuráveis que, somadas, garantem o atingimento do Objetivo Geral da pesquisa.",
      },
    ],
    mindMapNodes: [
      { label: "Estrutura Metodológica do TCC", type: "core", desc: "Rigor científico e desenvolvimento tecnológico" },
      { label: "Normas ABNT (NBR 14724 / 10520 / 6023)", type: "prerequisite", desc: "Padronização acadêmica de citações e referências" },
      { label: "Problema de Pesquisa", type: "branch", desc: "Pergunta clara, delimitada e empiricamente verificável" },
      { label: "Objetivo Geral e Específicos", type: "branch", desc: "Verbos no infinitivo alinhados à Taxonomia de Bloom" },
      { label: "Citações Diretas e Indiretas", type: "check", desc: "Prevenção de plágio e fundamentação teórica sólida" },
    ],
    writtenSummary:
      "Na elaboração do Trabalho de Conclusão de Curso (TCC), a solidez metodológica depende do alinhamento estrito entre Delimitação do Tema, Problema de Pesquisa e Objetivos. O Problema de Pesquisa deve ser redigido na forma de uma pergunta específica, viável e delimitada quanto ao público e ao contexto técnico. O Objetivo Geral responde diretamente ao problema iniciando com um verbo amplo no infinitivo (ex.: 'Desenvolver', 'Analisar'), enquanto os Objetivos Específicos detalham as etapas práticas da execução. Na redação da fundamentação teórica, devem-se respeitar as normas da ABNT: citações indiretas (paráfrases) exigem apenas autor e ano, citações diretas de até 3 linhas vão entre aspas no corpo do texto com número de página, e citações diretas longas (> 3 linhas) exigem recuo de 4 cm, fonte 10 e ausência de aspas.",
    notificationTemplate:
      "Olá! Disponibilizamos o roteiro prático de Estágio e TCC sobre Delimitação do Problema de Pesquisa, alinhamento de Objetivos (Geral e Específicos) e normas de citação ABNT (NBR 14724 / NBR 6023). Revise e aplique no seu projeto!",
  },

  "desenvolvimento-web": {
    disciplineId: "desenvolvimento-web",
    disciplineName: "Desenvolvimento Web",
    lessonTitle: "JavaScript Assíncrono e React: Event Loop, Promises, Async/Await e Tratamento de Erros no Fetch",
    learningObjective:
      "Compreender o funcionamento assíncrono das Promises no JavaScript e implementar requisições HTTP com fetch() utilizando async/await, blocos try/catch/finally e estados de carregamento em componentes React.",
    difficultyDiagnosis:
      "Os estudantes esquecem de utilizar o operador await tanto na chamada do fetch() quanto na conversão response.json(), além de não verificarem response.ok e não gerenciarem os estados de loading e error na interface React.",
    steps: [
      {
        stepNumber: 1,
        stageTitle: "Etapa 1 — Retomada do Conceito (Pré-requisito)",
        duration: "10 min",
        description:
          "Revisão do Event Loop do JavaScript (Call Stack vs. Task/Microtask Queue) e os três estados de uma Promise: pending (pendente), fulfilled (resolvida) e rejected (rejeitada).",
      },
      {
        stepNumber: 2,
        stageTitle: "Etapa 2 — Explicação Orientada",
        duration: "15 min",
        description:
          "Por que o fetch() exige dois awaits consecutivos: o primeiro aguarda os cabeçalhos da resposta HTTP (Response) e o segundo aguarda a leitura e o parsing do fluxo de dados em JSON (await response.json()).",
      },
      {
        stepNumber: 3,
        stageTitle: "Etapa 3 — Exemplo Prático",
        duration: "15 min",
        description:
          "Codificação ao vivo de um hook/componente React completo com estados [data, setData], [isLoading, setIsLoading] e [error, setError], utilizando try { ... } catch (err) { ... } finally { setIsLoading(false) } dentro do useEffect.",
      },
      {
        stepNumber: 4,
        stageTitle: "Etapa 4 — Atividade Aplicada",
        duration: "20 min",
        description:
          "Refatoração prática: converter um código encadeado com .then()/.catch() sem tratamento de erro HTTP (status 404/500) para uma função assíncrona limpa com async/await e verificação if (!res.ok) throw new Error(...).",
      },
      {
        stepNumber: 5,
        stageTitle: "Etapa 5 — Verificação da Aprendizagem",
        duration: "10 min",
        description:
          "Depuração rápida de código React identificando por que um estado recebia um objeto '[object Promise]' em vez do array de dados da API.",
      },
    ],
    didacticResources: [
      "Visualizador passo a passo do Event Loop e Ciclo de Vida de Promises",
      "Template de consumo de API REST com Fetch + Async/Await + Try/Catch em React",
      "Lista de 10 questões práticas de Desenvolvimento Web no ProfeIA",
    ],
    estimatedTime: "70 minutos",
    evaluationStrategy:
      "Verificação prática do código React escrito pelos estudantes consumindo um endpoint JSON com tratamento completo de loading e erro.",
    flashcards: [
      {
        question: "Por que precisamos usar dois comandos 'await' ao consumir uma API JSON com a função fetch()?",
        answer: "Porque o primeiro 'await fetch(url)' resolve apenas os cabeçalhos HTTP (objeto Response), e o método 'await response.json()' também é assíncrono e retorna outra Promise que lê e converte o corpo da resposta.",
      },
      {
        question: "Qual é a função do bloco 'finally' em uma estrutura try / catch / finally ao buscar dados em um componente React?",
        answer: "Garantir que o estado de carregamento seja encerrado (setIsLoading(false)) tanto quando a requisição tem sucesso (try) quanto quando ocorre uma falha (catch).",
      },
      {
        question: "Por que é necessário verificar 'if (!response.ok)' após o fetch(), mesmo dentro de um bloco try/catch?",
        answer: "Porque o fetch() só rejeita a Promise automaticamente em falhas de rede; respostas HTTP de erro como 404 (Not Found) ou 500 (Server Error) não disparam o catch a menos que lancemos um erro manualmente.",
      },
    ],
    mindMapNodes: [
      { label: "Assincronismo Web (Promises & Async/Await)", type: "core", desc: "Comunicação não bloqueante com APIs REST" },
      { label: "Event Loop e Estados da Promise", type: "prerequisite", desc: "Pending, Fulfilled e Rejected na fila de microtasks" },
      { label: "Duplo Await no Fetch API", type: "branch", desc: "await fetch(url) + await response.json()" },
      { label: "Tratamento Try / Catch / Finally", type: "branch", desc: "Captura de erros de rede e validação de response.ok" },
      { label: "Estados de UI no React", type: "check", desc: "Sincronização de isLoading, error e data no useEffect" },
    ],
    writtenSummary:
      "No Desenvolvimento Web moderno com JavaScript e React, operações de rede são não bloqueantes e baseadas em Promises. A sintaxe async/await permite escrever código assíncrono de forma legível e sequencial. Ao realizar uma requisição com a Fetch API, são necessárias duas etapas assíncronas: (1) const response = await fetch(url), que aguarda a resposta do servidor, devendo-se validar if (!response.ok) throw new Error('Falha HTTP'); e (2) const data = await response.json(), que converte o payload para objeto JavaScript. Em componentes React, essa chamada é envolvida por um bloco try/catch/finally acionado via useEffect, garantindo que estados visuais de carregamento (loading), erro amigável (error) e renderização de dados (data) mantenham a interface responsiva e resiliente.",
    notificationTemplate:
      "Olá! Liberamos o roteiro prático de Desenvolvimento Web sobre Promises, Async/Await no Fetch API e gerenciamento de estados (loading/error) em React. Confira os exemplos de código e pratique nas questões!",
  },

  historia: {
    disciplineId: "historia",
    disciplineName: "História",
    lessonTitle: "Brasil Republicano: Era Vargas (1930–1945), Regime Militar (AI-5) e a Redemocratização de 1988",
    learningObjective:
      "Compreender as rupturas e continuidades institucionais entre a Constituição de 1934 (Era Vargas), o endurecimento autoritário do AI-5 (1968) e a conquista dos direitos civis, políticos e sociais na Constituição Cidadã de 1988.",
    difficultyDiagnosis:
      "Os estudantes confundem os marcos constitucionais brasileiros (especialmente as diferenças entre a Carta democrática de 1934 e a Carta outorgada do Estado Novo em 1937) e o mecanismo político da transição pactuada na Redemocratização (Emenda Dante de Oliveira de 1984 vs. eleição indireta de 1985).",
    steps: [
      {
        stepNumber: 1,
        stageTitle: "Etapa 1 — Retomada do Conceito (Pré-requisito)",
        duration: "10 min",
        description:
          "Linha do tempo das Constituições Brasileiras no século XX: distinção entre Constituição Promulgada (votada por Assembleia Constituinte eleita: 1934, 1946, 1988) e Constituição Outorgada (imposta pelo Executivo: 1937, 1967/EC-1 de 1969).",
      },
      {
        stepNumber: 2,
        stageTitle: "Etapa 2 — Explicação Orientada",
        duration: "15 min",
        description:
          "Análise do Ato Institucional nº 5 (AI-5, dezembro de 1968): fechamento do Congresso Nacional, suspensão do habeas corpus para crimes políticos, cassação de mandatos e censura prévia aos meios de comunicação.",
      },
      {
        stepNumber: 3,
        stageTitle: "Etapa 3 — Exemplo Prático",
        duration: "15 min",
        description:
          "Leitura de fontes históricas primárias sobre a campanha das 'Diretas Já' (1983–1984): o objetivo da Emenda Constitucional Dante de Oliveira (restabelecer eleições diretas para presidente em 1985), sua rejeição por falta de quórum na Câmara e a posterior eleição indireta de Tancredo Neves no Colégio Eleitoral.",
      },
      {
        stepNumber: 4,
        stageTitle: "Etapa 4 — Atividade Aplicada",
        duration: "15 min",
        description:
          "Debate socrático estruturado comparando os avanços trabalhistas e eleitorais de 1934 (voto secreto e voto feminino) com a ampliação de direitos fundamentais e sociais na Constituição Cidadã de 1988.",
      },
      {
        stepNumber: 5,
        stageTitle: "Etapa 5 — Verificação da Aprendizagem",
        duration: "10 min",
        description:
          "Resolução comentada de questão comparativa sobre o processo de abertura política ('lenta, gradual e segura'), Lei da Anistia (1979) e Assembleia Nacional Constituinte (1987–1988).",
      },
    ],
    didacticResources: [
      "Linha do Tempo Comparada das Constituições Brasileiras (1934, 1937, 1967/AI-5 e 1988)",
      "Acervo de documentos históricos sobre a Revolução de 1932 e as Diretas Já (1984)",
      "Flashcards e questões de História do Brasil Republicano no ProfeIA",
    ],
    estimatedTime: "65 minutos",
    evaluationStrategy:
      "Avaliação da precisão histórica na diferenciação entre cartas promulgadas e outorgadas e na explicação do processo de redemocratização.",
    flashcards: [
      {
        question: "Quais foram as principais conquistas democráticas introduzidas pela Constituição Brasileira de 1934?",
        answer: "Instituição do voto secreto, conquista do voto feminino constitucionalizado, criação da Justiça Eleitoral e constitucionalização dos primeiros direitos trabalhistas.",
      },
      {
        question: "Quais medidas caracterizaram o Ato Institucional nº 5 (AI-5) decretado em dezembro de 1968?",
        answer: "Concedeu poderes ao Presidente para fechar o Congresso Nacional, cassar mandatos parlamentares, suspender direitos políticos e suspender a garantia de habeas corpus em casos de crimes políticos.",
      },
      {
        question: "O que propunha a Emenda Dante de Oliveira (1984) na campanha das 'Diretas Já' e qual foi seu desfecho imediato?",
        answer: "Propunha o retorno imediato das eleições diretas para Presidente da República em 1985. Embora tenha mobilizado milhões nas ruas, não alcançou os 2/3 dos votos na Câmara, levando à eleição indireta de Tancredo Neves no Colégio Eleitoral.",
      },
    ],
    mindMapNodes: [
      { label: "Cidadania e Constituições no Brasil Republicano", type: "core", desc: "Alternância entre períodos democráticos e autoritários" },
      { label: "AI-5 (1968) e Emenda Dante de Oliveira (1984)", type: "prerequisite", desc: "Marcos do Regime Militar e da luta pela Redemocratização" },
      { label: "Era Vargas e Carta de 1934", type: "branch", desc: "Voto secreto, voto feminino e legislação trabalhista" },
      { label: "Abertura Política e Diretas Já", type: "branch", desc: "Lei da Anistia (1979), mobilização civil e transição de 1985" },
      { label: "Constituição Cidadã de 1988", type: "check", desc: "Soberania popular, direitos fundamentais e voto aos 16 anos" },
    ],
    writtenSummary:
      "A trajetória republicana brasileira no século XX foi marcada por tensões entre ampliação da cidadania e rupturas autoritárias. Na Era Vargas, após a Revolução Constitucionalista de 1932, a Constituição promulgada de 1934 consagrou o voto secreto, o voto feminino e direitos trabalhistas, mas foi interrompida pelo golpe do Estado Novo (1937). Durante o Regime Militar (1964–1985), o Ato Institucional nº 5 (AI-5, de 1968) representou o ápice do fechamento político, suspendendo o habeas corpus e fechando o Congresso. No processo de redemocratização, a campanha das 'Diretas Já' (1984) mobilizou a sociedade em torno da Emenda Dante de Oliveira pelo voto direto presidencial; mesmo derrotada no Congresso em 1984, pavimentou a transição civil de 1985 e a convocação da Assembleia Constituinte que promulgou a Constituição Cidadã de 1988.",
    notificationTemplate:
      "Olá! Disponibilizamos o material de História conectando a Era Vargas (Constituição de 1934), o Regime Militar (AI-5) e a Redemocratização (Diretas Já e Constituição de 1988). Revise os flashcards e participe das atividades!",
  },

  robotica: {
    disciplineId: "robotica",
    disciplineName: "Robótica",
    lessonTitle: "Sistemas Embarcados e Arduino: Entradas Analógicas (ADC) vs. Controle de Atuadores por Modulação PWM",
    learningObjective:
      "Diferenciar a leitura de sinais analógicos no conversor ADC de 10 bits (0 a 1023) da geração de sinais PWM de 8 bits (0 a 255) e calcular o ciclo de trabalho (duty cycle) para controle de velocidade de motores e calibração de sensores.",
    difficultyDiagnosis:
      "Os estudantes confundem a escala de leitura das portas analógicas analogRead() (10 bits: 0 a 1023) com a escala de escrita das portas PWM analogWrite() (8 bits: 0 a 255), esquecendo de aplicar a função map(valor, 0, 1023, 0, 255) ou dividir por 4.",
    steps: [
      {
        stepNumber: 1,
        stageTitle: "Etapa 1 — Retomada do Conceito (Pré-requisito)",
        duration: "10 min",
        description:
          "Diferença física entre sinal digital puro (apenas dois estados lógicos: 0V/LOW ou 5V/HIGH), sinal analógico contínuo (varia em infinitos valores entre 0V e 5V) e sinal PWM (onda quadrada chaveada em alta frequência).",
      },
      {
        stepNumber: 2,
        stageTitle: "Etapa 2 — Explicação Orientada",
        duration: "15 min",
        description:
          "Cálculo da tensão média eficaz no PWM: V_med = V_max · (t_on / T) = V_max · DutyCycle. Demonstração da resolução de 10 bits do ADC do Arduino (2¹⁰ = 1024 níveis, de 0 a 1023) versus 8 bits do temporizador PWM (2⁸ = 256 níveis, de 0 a 255).",
      },
      {
        stepNumber: 3,
        stageTitle: "Etapa 3 — Exemplo Prático",
        duration: "15 min",
        description:
          "Programação C++ comentada no simulador: leitura de um potenciômetro no pino A0 (analogRead) controlando proporcionalmente a velocidade de um motor CC via Ponte H no pino PWM ~9 (analogWrite) utilizando map(leitura, 0, 1023, 0, 255).",
      },
      {
        stepNumber: 4,
        stageTitle: "Etapa 4 — Atividade Aplicada",
        duration: "20 min",
        description:
          "Calibração prática de sensor ultrassônico HC-SR04 (cálculo da distância d = (tempo_echo · 0,034) / 2) acionando alerta luminoso e modulação PWM conforme a proximidade do obstáculo.",
      },
      {
        stepNumber: 5,
        stageTitle: "Etapa 5 — Verificação da Aprendizagem",
        duration: "10 min",
        description:
          "Desafio de bancada: calcular qual valor de analogWrite(pino, X) entrega uma tensão média de 3,75V em um sistema de 5V (75% de duty cycle → X = 191).",
      },
    ],
    didacticResources: [
      "Diagrama de pinagem do Arduino UNO (Portas A0–A5 vs. Portas Digitais PWM ~3, ~5, ~6, ~9, ~10, ~11)",
      "Simulador de formas de onda PWM e Duty Cycle (0%, 25%, 50%, 75%, 100%)",
      "Lista de exercícios de Robótica e Sistemas Embarcados no ProfeIA",
    ],
    estimatedTime: "70 minutos",
    evaluationStrategy:
      "Verificação do código C++/Arduino e do cálculo exato do duty cycle e conversão entre escalas de 10 bits e 8 bits.",
    flashcards: [
      {
        question: "Por que o comando analogRead() no Arduino UNO retorna valores de 0 a 1023, enquanto o analogWrite() (PWM) aceita valores apenas de 0 a 255?",
        answer: "Porque o conversor Analógico-Digital (ADC) de entrada possui resolução de 10 bits (2¹⁰ = 1024 valores: 0 a 1023), enquanto o gerador PWM de saída opera com registradores de 8 bits (2⁸ = 256 valores: 0 a 255).",
      },
      {
        question: "Qual é a tensão média entregue por um pino PWM de 5V quando executamos o comando analogWrite(9, 127)?",
        answer: "127 corresponde a aproximadamente 50% de ciclo de trabalho (127/255 ≈ 0,5). Logo, a tensão média eficaz é 5V × 0,5 = 2,5V.",
      },
      {
        question: "Como converter corretamente a leitura de um sensor analógico (0 a 1023) para acionar uma saída PWM (0 a 255) no Arduino?",
        answer: "Utilizando a função map(valorLido, 0, 1023, 0, 255) ou dividindo o valor inteiro lido por 4.",
      },
    ],
    mindMapNodes: [
      { label: "Controle de Sensores e Atuadores no Arduino", type: "core", desc: "Interface entre mundo físico e microcontrolador" },
      { label: "Sinais Analógicos (ADC) vs. Digitais (PWM)", type: "prerequisite", desc: "Diferença entre leitura contínua e modulação de pulso" },
      { label: "Entrada Analógica: analogRead (10 bits)", type: "branch", desc: "Pinos A0–A5: converte 0–5V em valores de 0 a 1023" },
      { label: "Saída PWM: analogWrite (8 bits)", type: "branch", desc: "Pinos com til (~): regula Duty Cycle de 0 a 255" },
      { label: "Cálculo de Duty Cycle e Função map()", type: "check", desc: "V_med = V_max · (DutyCycle %) e calibração de atuadores" },
    ],
    writtenSummary:
      "Em sistemas embarcados baseados na plataforma Arduino UNO (ATmega328P), a leitura de sensores analógicos e o acionamento proporcional de cargas utilizam arquiteturas distintas. As portas de entrada analógica (A0 a A5) contam com um Conversor Analógico-Digital (ADC) de 10 bits, mapeando tensões de 0V a 5V em números inteiros de 0 a 1023 via analogRead(). Já para controlar a velocidade de motores CC ou o brilho de LEDs sem variar a tensão de pico da fonte, utilizam-se as portas digitais com suporte a PWM (~3, ~5, ~6, ~9, ~10, ~11) através de analogWrite(), que opera em 8 bits (valores de 0 a 255). O PWM chaveia rapidamente a saída entre 0V e 5V, onde o ciclo de trabalho (duty cycle = t_alto / período) determina a tensão média eficaz entregue ao atuador.",
    notificationTemplate:
      "Olá! Disponibilizamos o material prático de Robótica sobre entradas analógicas (ADC 10 bits: 0 a 1023), modulação PWM (8 bits: 0 a 255) e cálculo de duty cycle no Arduino. Confira o resumo e pratique nas questões!",
  },

  "design-de-interface": {
    disciplineId: "design-de-interface",
    disciplineName: "Design de Interface",
    lessonTitle: "UX/UI e Acessibilidade Digital: As 10 Heurísticas de Jakob Nielsen e Diretrizes WCAG 2.1 Nível AA",
    learningObjective:
      "Avaliar interfaces digitais aplicando as 10 Heurísticas de Usabilidade de Jakob Nielsen e garantir conformidade com os critérios de contraste cromático (4.5:1) e navegação por teclado da WCAG 2.1 Nível AA.",
    difficultyDiagnosis:
      "Os estudantes criam protótipos visualmente atraentes, mas com baixa taxa de contraste entre texto e fundo (abaixo dos 4.5:1 exigidos pela WCAG AA) e ausência de feedback imediato de estado do sistema (1ª Heurística de Nielsen) durante ações de salvamento ou erro.",
    steps: [
      {
        stepNumber: 1,
        stageTitle: "Etapa 1 — Retomada do Conceito (Pré-requisito)",
        duration: "10 min",
        description:
          "Diferença entre UI (User Interface: camada visual, tipografia, cores e componentes) e UX (User Experience: jornada completa, eficiência, prevenção de erros e acessibilidade conforme os 4 princípios POUR da WCAG: Perceptível, Operável, Compreensível e Robusto).",
      },
      {
        stepNumber: 2,
        stageTitle: "Etapa 2 — Explicação Orientada",
        duration: "15 min",
        description:
          "Estudo aplicado das Heurísticas críticas de Jakob Nielsen: #1 Visibilidade do Status do Sistema (loading states, toasts, progresso), #3 Controle e Liberdade do Usuário (desfazer/cancelar), #4 Consistência e Padrões e #5 Prevenção de Erros.",
      },
      {
        stepNumber: 3,
        stageTitle: "Etapa 3 — Exemplo Prático",
        duration: "15 min",
        description:
          "Auditoria de contraste ao vivo segundo o critério WCAG 1.4.3 (Nível AA): demonstração de que textos normais exigem razão mínima de contraste de 4.5:1 (e textos grandes ≥ 18pt ou 14pt bold exigem 3:1), corrigindo botões cinza-claro ilegíveis.",
      },
      {
        stepNumber: 4,
        stageTitle: "Etapa 4 — Atividade Aplicada",
        duration: "20 min",
        description:
          "Avaliação Heurística Cruzada: cada grupo inspeciona a tela principal do projeto de outra equipe preenchendo um checklist de usabilidade e acessibilidade (foco visível por tecla Tab, rótulos de formulário <label> e contraste).",
      },
      {
        stepNumber: 5,
        stageTitle: "Etapa 5 — Verificação da Aprendizagem",
        duration: "10 min",
        description:
          "Resolução de estudo de caso identificando qual heurística de Nielsen foi violada em 4 telas com problemas reais de UX.",
      },
    ],
    didacticResources: [
      "Checklist das 10 Heurísticas de Usabilidade de Jakob Nielsen",
      "Tabela de referência de Contraste Cromático WCAG 2.1 (Nível AA: 4.5:1 e 3:1)",
      "Flashcards e questões de Design de Interface no ProfeIA",
    ],
    estimatedTime: "70 minutos",
    evaluationStrategy:
      "Avaliação do relatório de inspeção heurística produzido pelas equipes e verificação dos ajustes de contraste e feedback nos protótipos.",
    flashcards: [
      {
        question: "Qual é a razão mínima de contraste exigida pela diretriz WCAG 2.1 no Nível AA para textos de tamanho regular?",
        answer: "A razão mínima é de 4.5:1 entre a cor do texto e a cor de fundo (e de 3:1 para textos grandes acima de 18pt ou 14pt em negrito).",
      },
      {
        question: "O que preconiza a 1ª Heurística de Jakob Nielsen ('Visibilidade do Status do Sistema')?",
        answer: "O sistema deve manter o usuário sempre informado sobre o que está acontecendo (ex.: indicadores de carregamento, confirmação de envio, etapa atual de um formulário) por meio de feedback claro e em tempo razoável.",
      },
      {
        question: "Qual é a diferença entre a 5ª Heurística ('Prevenção de Erros') e a 9ª Heurística ('Ajudar os usuários a reconhecer, diagnosticar e recuperar-se de erros')?",
        answer: "A Prevenção de Erros evita que a falha aconteça antes da ação (ex.: desabilitar botão inválido ou pedir confirmação antes de excluir); a 9ª Heurística atua após o erro ocorrer, exibindo mensagem clara em linguagem humana com a solução.",
      },
    ],
    mindMapNodes: [
      { label: "Usabilidade (Nielsen) e Acessibilidade (WCAG)", type: "core", desc: "Interfaces inclusivas, eficientes e centradas no humano" },
      { label: "Contraste Cromático e Feedback do Sistema", type: "prerequisite", desc: "Legibilidade visual e resposta clara às ações" },
      { label: "10 Heurísticas de Jakob Nielsen", type: "branch", desc: "Visibilidade de status, consistência, prevenção de erros" },
      { label: "Diretrizes WCAG 2.1 Nível AA", type: "branch", desc: "Contraste mínimo 4.5:1, foco visível e navegação via teclado" },
      { label: "Princípios POUR da Acessibilidade", type: "check", desc: "Perceptível, Operável, Compreensível e Robusto" },
    ],
    writtenSummary:
      "O Design de Interface (UI) e de Experiência do Usuário (UX) une estética funcional à usabilidade e acessibilidade universal. As 10 Heurísticas de Jakob Nielsen fornecem princípios de avaliação para evitar fricções cognitivas, destacando-se a Visibilidade do Status do Sistema (fornecer feedback imediato a cada clique ou carregamento), a Consistência de Padrões e a Prevenção de Erros. Paralelamente, as Diretrizes de Acessibilidade para Conteúdo Web (WCAG 2.1, estruturadas nos pilares Perceptível, Operável, Compreensível e Robusto — POUR) determinam, no Nível AA, razão de contraste mínima de 4.5:1 para textos regulares, área de toque/clique adequada (≥ 44px), rótulos semânticos e suporte completo à navegação por teclado com indicador de foco visível.",
    notificationTemplate:
      "Olá! Liberamos o roteiro de Design de Interface sobre as 10 Heurísticas de Usabilidade de Jakob Nielsen e os critérios de contraste (4.5:1) e acessibilidade da WCAG 2.1 Nível AA. Confira e aplique nos seus protótipos!",
  },

  "empreendedorismo-social": {
    disciplineId: "empreendedorismo-social",
    disciplineName: "Projeto de Empreendedorismo Social e Economia Solidária",
    lessonTitle: "Negócios de Impacto Social: Social Business Model Canvas, Cooperativismo e Indicadores ODS",
    learningObjective:
      "Estruturar um modelo de negócio de impacto comunitário no Social Business Model Canvas, diferenciando a autogestão solidária da empresa tradicional e definindo indicadores mensuráveis alinhados aos Objetivos de Desenvolvimento Sustentável (ODS).",
    difficultyDiagnosis:
      "As equipes confundem filantropia/doação eventual com Negócio Social autossustentável (que gera receita própria para manter a operação e reinveste o superávit na causa comunitária) e deixam de especificar indicadores concretos de impacto social no Canvas.",
    steps: [
      {
        stepNumber: 1,
        stageTitle: "Etapa 1 — Retomada do Conceito (Pré-requisito)",
        duration: "10 min",
        description:
          "Distinção entre Empresa Tradicional (foco na maximização de dividendos para acionistas), ONG/Filantropia (dependente de doações e editais) e Negócio de Impacto Social / Cooperativa Solidária (sustentabilidade financeira própria com missão socioambiental prioritária).",
      },
      {
        stepNumber: 2,
        stageTitle: "Etapa 2 — Explicação Orientada",
        duration: "15 min",
        description:
          "Análise dos blocos específicos do Social Business Model Canvas: Proposta de Valor Social (para os beneficiários), Proposta de Valor de Mercado (para os clientes pagantes), Destinação do Superávit e Métricas de Impacto Social.",
      },
      {
        stepNumber: 3,
        stageTitle: "Etapa 3 — Exemplo Prático",
        duration: "15 min",
        description:
          "Estudo do caso de uma cooperativa local de reciclagem apoiada por plataforma digital e banco comunitário (moeda social): como medir o aumento percentual da renda mensal dos cooperados (ODS 1 e ODS 8) e o volume de resíduos desviados de aterros (ODS 11 e ODS 12).",
      },
      {
        stepNumber: 4,
        stageTitle: "Etapa 4 — Atividade Aplicada",
        duration: "20 min",
        description:
          "Preenchimento colaborativo dos blocos de 'Sustentabilidade Financeira' e 'Indicadores de Impacto Social (ODS)' do projeto de intervenção comunitária da turma.",
      },
      {
        stepNumber: 5,
        stageTitle: "Etapa 5 — Verificação da Aprendizagem",
        duration: "10 min",
        description:
          "Pitch de 2 minutos por equipe apresentando a fonte de receita autossustentável e o indicador principal de transformação comunitária.",
      },
    ],
    didacticResources: [
      "Template interativo do Social Business Model Canvas",
      "Guia dos 17 Objetivos de Desenvolvimento Sustentável (ODS / Agenda 2030 da ONU)",
      "Flashcards e questões de Empreendedorismo Social e Economia Solidária no ProfeIA",
    ],
    estimatedTime: "70 minutos",
    evaluationStrategy:
      "Avaliação da coerência entre a geração de receita operacional, o princípio de autogestão democrática e a mensurabilidade dos indicadores de impacto.",
    flashcards: [
      {
        question: "Qual é a principal diferença entre um Negócio de Impacto Social (segundo Muhammad Yunus) e uma instituição filantrópica tradicional?",
        answer: "O Negócio de Impacto Social é financeiramente autossustentável por meio da venda de produtos ou serviços a preços justos, cobrindo seus custos operacionais e reinvestindo o superávit na ampliação do impacto social, sem depender exclusivamente de doações.",
      },
      {
        question: "Como funciona a tomada de decisão nas assembleias de um empreendimento de Economia Solidária e Cooperativismo?",
        answer: "Vigora o princípio da autogestão democrática ('cada pessoa associada tem direito a 1 voto'), independentemente do valor de quota-parte ou função exercida.",
      },
      {
        question: "Quais blocos adicionais diferenciam o Social Business Model Canvas do Business Model Canvas comercial tradicional?",
        answer: "A inclusão explícita da Missão/Problema Socioambiental, da separação entre Beneficiários e Clientes, dos Indicadores de Impacto Social (ODS) e da política de Reinvestimento do Superávit.",
      },
    ],
    mindMapNodes: [
      { label: "Empreendedorismo Social e Economia Solidária", type: "core", desc: "Inovação socioambiental com sustentabilidade econômica" },
      { label: "Sustentabilidade Financeira vs. Impacto", type: "prerequisite", desc: "Equilíbrio entre receita operacional e missão comunitária" },
      { label: "Social Business Model Canvas", type: "branch", desc: "Proposta de valor social, beneficiários e reinvestimento" },
      { label: "Autogestão e Moedas Sociais", type: "branch", desc: "Governança democrática ('1 membro, 1 voto') e desenvolvimento local" },
      { label: "Indicadores ODS (Agenda 2030)", type: "check", desc: "Métricas quantitativas e qualitativas de transformação social" },
    ],
    writtenSummary:
      "O Empreendedorismo Social e a Economia Solidária propõem modelos produtivos nos quais a atividade econômica está a serviço do desenvolvimento humano e da regeneração socioambiental. Diferentemente das empresas tradicionais focadas na distribuição de lucros aos acionistas e das entidades puramente assistenciais dependentes de doações, os negócios de impacto social geram receitas próprias com a comercialização ética de bens e serviços, garantindo sustentabilidade financeira e reinvestindo o excedente na própria comunidade. Por meio do Social Business Model Canvas, estruturam-se tanto a fonte de receita quanto os indicadores objetivos de transformação social alinhados aos Objetivos de Desenvolvimento Sustentável (ODS da ONU), sob governança participativa e autogestionária.",
    notificationTemplate:
      "Olá! Disponibilizamos o roteiro de Empreendedorismo Social e Economia Solidária sobre o Social Business Model Canvas, sustentabilidade financeira em negócios de impacto e métricas alinhadas aos ODS. Confira e aplique no seu projeto!",
  },

  "lingua-inglesa": {
    disciplineId: "lingua-inglesa",
    disciplineName: "Língua Inglesa",
    lessonTitle: "Inglês Instrumental e Gramática Aplicada: Simple Present vs. Present Continuous e Leitura Técnica de TI",
    learningObjective:
      "Aplicar corretamente os auxiliares Do/Does e a flexão de 3ª pessoa no Simple Present em contraste com o Present Continuous, utilizando técnicas de Skimming e Scanning e identificando falsos cognatos em documentações técnicas de software.",
    difficultyDiagnosis:
      "Os estudantes omitem o auxiliar 'does' (ou mantêm o '-s' no verbo principal após 'does not') na 3ª pessoa do singular (he/she/it) no Simple Present e confundem falsos cognatos clássicos de documentação técnica de TI (como 'actually', 'library', 'pretend', 'realize' e 'support').",
    steps: [
      {
        stepNumber: 1,
        stageTitle: "Etapa 1 — Retomada do Conceito (Pré-requisito)",
        duration: "10 min",
        description:
          "Revisão da regra de 3ª pessoa do singular (He, She, It / 'the server', 'the application', 'the function'): acréscimo de -s/-es/-ies nas frases afirmativas do Simple Present e retorno do verbo à forma base quando acompanhado do auxiliar 'does' ou 'doesn't'.",
      },
      {
        stepNumber: 2,
        stageTitle: "Etapa 2 — Explicação Orientada",
        duration: "15 min",
        description:
          "Contraste funcional: Simple Present para descrever rotinas, especificações permanentes e comportamento padrão de sistemas ('The API returns a JSON object') vs. Present Continuous (am/is/are + verbo-ing) para processos em execução no momento ('The container is building the image now').",
      },
      {
        stepNumber: 3,
        stageTitle: "Etapa 3 — Exemplo Prático",
        duration: "15 min",
        description:
          "Leitura instrumental de um trecho real de documentação técnica (React / MDN / Git) aplicando Skimming (leitura rápida de títulos e palavras-chave para captar a ideia geral) e Scanning (busca localizada de um parâmetro ou mensagem de erro específica).",
      },
      {
        stepNumber: 4,
        stageTitle: "Etapa 4 — Atividade Aplicada",
        duration: "15 min",
        description:
          "Identificação e tradução contextualizada de Falsos Cognatos (False Friends) em logs e manuais técnicos: 'actually' (na verdade, e não atualmente), 'library' (biblioteca de código, e não livraria), 'argument' (argumento/parâmetro de função), 'deprecated' (obsoleto/descontinuado).",
      },
      {
        stepNumber: 5,
        stageTitle: "Etapa 5 — Verificação da Aprendizagem",
        duration: "10 min",
        description:
          "Exercício rápido de preenchimento e reescrita de frases técnicas nas formas afirmativa, negativa e interrogativa do Simple Present e Present Continuous.",
      },
    ],
    didacticResources: [
      "Tabela comparativa: Simple Present (Do/Does) vs. Present Continuous (Be + -ing)",
      "Glossário de Falsos Cognatos e Vocabulário Técnico de TI em Inglês",
      "Trilha de 10 exercícios de Língua Inglesa e Reading Técnico no ProfeIA",
    ],
    estimatedTime: "65 minutos",
    evaluationStrategy:
      "Verificação da correção gramatical no uso de Do/Does e precisão na interpretação de trechos de documentação técnica em inglês.",
    flashcards: [
      {
        question: "Como ficam as formas afirmativa, negativa e interrogativa de 'The server validates the data' no Simple Present?",
        answer: "Afirmativa: 'The server validates the data.' | Negativa: 'The server does not (doesn't) validate the data.' | Interrogativa: 'Does the server validate the data?' (com 'does', o verbo perde o -s final).",
      },
      {
        question: "Qual é a diferença entre as técnicas de leitura instrumental Skimming e Scanning em Inglês Técnico?",
        answer: "Skimming é a leitura panorâmica rápida (títulos, subtítulos, palavras transparentes) para identificar o assunto geral do texto; Scanning é a varredura focada para localizar uma informação específica (como um código de erro, versão ou comando).",
      },
      {
        question: "O que significam os falsos cognatos 'actually', 'library' e 'currently' em um texto técnico em inglês?",
        answer: "'Actually' significa 'na verdade / de fato' (não 'atualmente'); 'library' significa 'biblioteca (de livros ou de código)' (não 'livraria'); e 'currently' significa 'atualmente'.",
      },
    ],
    mindMapNodes: [
      { label: "Inglês Técnico e Gramática Aplicada", type: "core", desc: "Leitura de documentação de software e comunicação" },
      { label: "Auxiliares Do/Does e Falsos Cognatos", type: "prerequisite", desc: "Regras de 3ª pessoa (he/she/it) e vocabulário de TI" },
      { label: "Simple Present", type: "branch", desc: "Comportamento padrão e rotinas: 'The API returns JSON'" },
      { label: "Present Continuous", type: "branch", desc: "Ação em andamento no momento: 'The server is running'" },
      { label: "Skimming & Scanning", type: "check", desc: "Estratégias de compreensão rápida de manuais técnicos" },
    ],
    writtenSummary:
      "O domínio da Língua Inglesa aplicada à tecnologia combina estruturas gramaticais essenciais com estratégias de leitura instrumental (English for Specific Purposes). Gramaticalmente, o Simple Present descreve comportamentos permanentes, regras de negócio e especificações técnicas (exigindo sufixo -s/-es na 3ª pessoa do singular afirmativa e o auxiliar 'does' com retorno do verbo à forma base em perguntas e negativas), enquanto o Present Continuous (am/is/are + verbo com -ing) indica processos em execução no momento atual. Na leitura de documentações de software, aplicam-se o Skimming (visão global rápida do texto) e o Scanning (localização imediata de parâmetros ou erros), mantendo atenção redobrada aos falsos cognatos como 'actually' (na verdade), 'library' (biblioteca) e 'notice' (notar/aviso).",
    notificationTemplate:
      "Olá! Liberamos a trilha de Língua Inglesa sobre Simple Present vs. Present Continuous (uso correto de Do/Does), estratégias de leitura Skimming/Scanning e falsos cognatos em documentação técnica de TI. Confira!",
  },
};

export function getBlueprintForDiscipline(
  disciplineIdOrName: string
): DomainPedagogicalBlueprint {
  const normalized = (disciplineIdOrName || "").toLowerCase().trim();
  if (DOMAIN_PEDAGOGICAL_BLUEPRINTS[normalized]) {
    return DOMAIN_PEDAGOGICAL_BLUEPRINTS[normalized];
  }
  const byName = Object.values(DOMAIN_PEDAGOGICAL_BLUEPRINTS).find(
    (b) =>
      b.disciplineName.toLowerCase() === normalized ||
      normalized.includes(b.disciplineName.toLowerCase()) ||
      b.disciplineName.toLowerCase().includes(normalized)
  );
  return byName || DOMAIN_PEDAGOGICAL_BLUEPRINTS.matematica;
}

export function getDomainPedagogicalContent(
  disciplineIdOrName: string,
  disciplineName?: string,
  topic?: string,
  prerequisiteIssue?: string
) {
  const bp = getBlueprintForDiscipline(disciplineIdOrName || disciplineName || "matematica");
  const matchedQuestions = sampleQuestions
    .filter(
      (q) =>
        q.disciplineId === bp.disciplineId ||
        q.disciplineName.toLowerCase() === bp.disciplineName.toLowerCase()
    )
    .map((q) => {
      const opts = (q.options || []).map((o) => o.text);
      const correctIdx = Math.max(
        0,
        (q.options || []).findIndex((o) => o.isCorrect)
      );
      return {
        question: q.prompt,
        options: opts,
        correctAnswer: correctIdx,
        explanation: q.correctExplanation,
      };
    });

  const adaptiveQuestions =
    matchedQuestions.length > 0
      ? matchedQuestions
      : bp.flashcards.map((fc, idx) => ({
          question: fc.question,
          options: [
            fc.answer,
            `Aplicação parcial sem considerar o pré-requisito (${prerequisiteIssue || bp.lessonTitle}).`,
            `Inversão direta dos conceitos de ${topic || bp.disciplineName}.`,
            `Omissão das etapas de validação em ${bp.disciplineName}.`,
          ],
          correctAnswer: 0,
          explanation: fc.answer,
        }));

  return {
    ...bp,
    adaptiveQuestions,
  };
}
