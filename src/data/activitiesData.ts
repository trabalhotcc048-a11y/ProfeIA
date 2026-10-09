import { ActivityQuestion } from "../types";

export const sampleQuestions: ActivityQuestion[] = [
  {
    id: "q-mat-bhaskara-1",
    disciplineId: "matematica",
    contentId: "matematica-top-1",
    disciplineName: "Matemática",
    contentTitle: "Equações do 2º Grau e Bhaskara",
    title: "Cálculo do Discriminante e Raízes Reais",
    prompt: "Dada a equação quadrática 2x² - 8x + 6 = 0, calcule o valor do discriminante Delta (Δ) e determine o conjunto solução no conjunto dos números reais ℝ.",
    type: "objective",
    difficulty: "medio",
    options: [
      {
        id: "opt-1",
        text: "Δ = 16 e Solução S = {1, 3}",
        isCorrect: true,
        explanation: "Correto! a = 2, b = -8, c = 6. Δ = (-8)² - 4(2)(6) = 64 - 48 = 16. As raízes são: x = (-(-8) ± √16)/(2*2) = (8 ± 4)/4 => x' = 12/4 = 3 e x'' = 4/4 = 1."
      },
      {
        id: "opt-2",
        text: "Δ = -16 e não possui raízes reais",
        isCorrect: false,
        explanation: "Atenção ao sinal: (-8)² é positivo (+64), e -4(2)(6) = -48. Logo, 64 - 48 = +16 (positivo, possui raízes reais)."
      },
      {
        id: "opt-3",
        text: "Δ = 64 e Solução S = {-2, 4}",
        isCorrect: false,
        explanation: "Você calculou apenas b² = 64 e esqueceu de subtrair o termo 4ac (4 * 2 * 6 = 48)."
      },
      {
        id: "opt-4",
        text: "Δ = 16 e Solução S = {-1, -3}",
        isCorrect: false,
        explanation: "Cuidado com o jogo de sinais na fórmula: -b é -(-8) = +8, portanto as raízes são positivas: +1 e +3."
      }
    ],
    correctExplanation: "Para 2x² - 8x + 6 = 0: a=2, b=-8, c=6. O discriminante é Δ = b² - 4ac = (-8)² - 4*2*6 = 64 - 48 = 16. Aplicando Bhaskara: x = (8 ± 4) / 4, obtendo raízes x = 1 e x = 3.",
    prerequisiteFallback: {
      prerequisiteTopic: "Identificação dos coeficientes a, b e c e aplicação correta da fórmula do discriminante (Δ = b² − 4ac)",
      explanation: "Para calcular o discriminante e as raízes reais de uma equação do 2º grau (ax² + bx + c = 0), o pré-requisito diretamente necessário é identificar com precisão os coeficientes a, b e c (incluindo seus sinais) e aplicar Δ = b² − 4ac, elevando b ao quadrado ((−b)² > 0) e subtraindo o produto 4·a·c.",
      remedialQuestion: {
        prompt: "Exercício de Reforço (Cálculo do Discriminante): Dada a equação quadrática x² - 6x + 5 = 0, identifique os coeficientes a, b e c e calcule corretamente o valor do discriminante Δ = b² - 4ac:",
        options: [
          {
            id: "rem-1",
            text: "a = 1, b = -6, c = 5 e Δ = (-6)² - 4·1·5 = 36 - 20 = 16",
            isCorrect: true,
            explanation: "Perfeito! Identificamos a = 1, b = -6 e c = 5, calculamos (-6)² = +36 e subtraímos 4·1·5 = 20, obtendo Δ = 16."
          },
          {
            id: "rem-2",
            text: "a = 1, b = -6, c = 5 e Δ = (-6)² = 36 (sem subtrair 4ac)",
            isCorrect: false,
            explanation: "Você calculou apenas b² = 36 e esqueceu de subtrair o termo 4ac = 4·1·5 = 20. O discriminante correto é Δ = 36 - 20 = 16."
          },
          {
            id: "rem-3",
            text: "a = 1, b = -6, c = 5 e Δ = -36 - 20 = -56",
            isCorrect: false,
            explanation: "Todo número real negativo elevado ao quadrado resulta em valor positivo: (-6)² = +36, logo Δ = 36 - 20 = +16."
          }
        ],
        explanation: "Identificando os coeficientes a = 1, b = -6 e c = 5 e aplicando Δ = b² - 4ac, obtemos Δ = (-6)² - 4(1)(5) = 36 - 20 = 16."
      }
    }
  },
  {
    id: "q-aps-requisitos-1",
    disciplineId: "analise-projeto-sistemas",
    contentId: "analise-projeto-sistemas-top-2",
    disciplineName: "Análise e Projeto de Sistemas",
    contentTitle: "Requisitos Funcionais (RF) versus Requisitos Não Funcionais (RNF)",
    title: "Classificação de Requisitos de Software",
    prompt: "Em um edital de sistema acadêmico, consta a seguinte especificação: 'O sistema deve autenticar o usuário e criptografar as senhas armazenadas utilizando o algoritmo bcrypt com fator de custo mínimo 12, garantindo que o tempo de verificação não ultrapasse 500ms.' Como essa especificação deve ser tecnicamente classificada?",
    type: "objective",
    difficulty: "facil",
    options: [
      {
        id: "aps-opt-1",
        text: "Trata-se exclusivamente de Requisitos Não Funcionais de Segurança e Desempenho.",
        isCorrect: false,
        explanation: "Quase! A criptografia e o tempo são RNF, mas a função de 'autenticar o usuário' é uma funcionalidade (RF)."
      },
      {
        id: "aps-opt-2",
        text: "Combina um Requisito Funcional (autenticar usuário) com Requisitos Não Funcionais (segurança com bcrypt e desempenho <500ms).",
        isCorrect: true,
        explanation: "Excelente! 'Autenticar' é o comportamento/função que o sistema executa (RF). O algoritmo criptográfico e o tempo de resposta são restrições de qualidade técnica (RNF)."
      },
      {
        id: "aps-opt-3",
        text: "Trata-se de um Caso de Uso do tipo <<extend>>.",
        isCorrect: false,
        explanation: "A especificação textual de requisitos antecede e orienta a diagramação de casos de uso."
      }
    ],
    correctExplanation: "Requisitos Funcionais definem as ações que o sistema executa (o que faz), enquanto Requisitos Não Funcionais estipulam critérios de qualidade, segurança e tempo de resposta (como faz).",
    prerequisiteFallback: {
      prerequisiteTopic: "Conceitos Básicos de Engenharia de Software",
      explanation: "Revisão de Fundamento: Para classificar requisitos, pergunte sempre: 'Isto é uma funcionalidade direta do usuário (RF) ou é uma restrição de segurança, velocidade ou plataforma (RNF)?'",
      remedialQuestion: {
        prompt: "Exercício de Nivelamento: A regra 'O aluno pode emitir histórico escolar em formato PDF' é um requisito de qual tipo?",
        options: [
          {
            id: "rem-aps-1",
            text: "Requisito Funcional (RF)",
            isCorrect: true,
            explanation: "Correto! É um serviço direto oferecido ao usuário pelo software."
          },
          {
            id: "rem-aps-2",
            text: "Requisito Não Funcional (RNF)",
            isCorrect: false,
            explanation: "Não, emitir documento é uma função ativa do sistema."
          }
        ],
        explanation: "Funções que executam operações de negócio são Requisitos Funcionais."
      }
    }
  },
  {
    id: "q-tcc-metodologia-1",
    disciplineId: "materia-pratica-estagio-tcc",
    contentId: "materia-pratica-estagio-tcc-top-3",
    disciplineName: "Matéria Prática de Estágio e TCC",
    contentTitle: "Formulação do Problema de Pesquisa: A Pergunta Central Norteadora",
    title: "Construção do Problema de Pesquisa",
    prompt: "Qual das seguintes alternativas apresenta um Problema de Pesquisa adequadamente formulado segundo os preceitos da metodologia científica para um TCC técnico?",
    type: "objective",
    difficulty: "medio",
    options: [
      {
        id: "tcc-opt-1",
        text: "A tecnologia atual é muito boa para a sociedade contemporânea?",
        isCorrect: false,
        explanation: "Essa pergunta é genérica, subjetiva ('muito boa') e impossível de ser delimitada e mensurada cientificamente."
      },
      {
        id: "tcc-opt-2",
        text: "De que maneira a implementação de um sistema web com IA adaptativa reduz o índice de retenção escolar em matemática no 3º ano do ensino técnico?",
        isCorrect: true,
        explanation: "Exato! É uma questão específica, problematizadora, com variáveis delimitadas (sistema web com IA, retenção escolar, matemática, público do 3º ano técnico) e passível de verificação empírica."
      },
      {
        id: "tcc-opt-3",
        text: "Criar um aplicativo escolar para ajudar todos os alunos de todas as escolas.",
        isCorrect: false,
        explanation: "Isso é uma intenção de projeto, não uma pergunta investigativa de pesquisa."
      }
    ],
    correctExplanation: "Um problema de pesquisa rigoroso deve ser formulado como uma pergunta clara, delimitada no tempo e no espaço, e conectada a variáveis mensuráveis.",
    prerequisiteFallback: {
      prerequisiteTopic: "Diferença entre Tema, Problema e Objetivos no TCC",
      explanation: "Revisão Básica: O Tema é a área de interesse (ex: Tecnologia na Educação). O Problema é a pergunta exata que você quer responder. Os Objetivos são o que você fará para respondê-la.",
      remedialQuestion: {
        prompt: "Exercício de Nivelamento: O Problema de Pesquisa deve sempre ter qual formato estrutural?",
        options: [
          {
            id: "rem-tcc-1",
            text: "Uma pergunta reflexiva e delimitada, terminada com ponto de interrogação.",
            isCorrect: true,
            explanation: "Isso mesmo! O problema é literalmente uma pergunta a ser respondida pela pesquisa."
          },
          {
            id: "rem-tcc-2",
            text: "Um parágrafo com verbos no infinitivo listando passos futuros.",
            isCorrect: false,
            explanation: "Listar passos com verbos no infinitivo é a função dos Objetivos Específicos."
          }
        ],
        explanation: "O problema de pesquisa é formulado na forma de pergunta."
      }
    }
  },
  {
    id: "q-bd-sql-1",
    disciplineId: "banco-de-dados",
    contentId: "banco-de-dados-top-31",
    disciplineName: "Banco de Dados",
    contentTitle: "INNER JOIN: Junção Interna entre Duas ou Mais Tabelas Relacionadas",
    title: "Junção de Tabelas Relacionais com INNER JOIN",
    prompt: "Dadas as tabelas 'alunos' (id, nome) e 'matriculas' (id, aluno_id, disciplina, nota), qual consulta SQL retorna o nome de cada aluno e sua respectiva disciplina apenas para matrículas existentes?",
    type: "objective",
    difficulty: "medio",
    options: [
      {
        id: "bd-opt-1",
        text: "SELECT alunos.nome, matriculas.disciplina FROM alunos INNER JOIN matriculas ON alunos.id = matriculas.aluno_id;",
        isCorrect: true,
        explanation: "Correto! O INNER JOIN conecta a chave primária (alunos.id) à chave estrangeira (matriculas.aluno_id), trazendo apenas registros com correspondência em ambas as tabelas."
      },
      {
        id: "bd-opt-2",
        text: "SELECT nome, disciplina FROM alunos WHERE aluno_id = id;",
        isCorrect: false,
        explanation: "A sintaxe está incorreta porque a tabela 'matriculas' não foi incluída na cláusula FROM."
      },
      {
        id: "bd-opt-3",
        text: "UPDATE alunos SET disciplina = matriculas.disciplina;",
        isCorrect: false,
        explanation: "O comando UPDATE é usado para modificar dados salvos, e não para consultar ou extrair tuplas."
      }
    ],
    correctExplanation: "O INNER JOIN utiliza a cláusula ON para estabelecer a condição de igualdade entre Chave Primária e Chave Estrangeira.",
    prerequisiteFallback: {
      prerequisiteTopic: "Conceito de Chave Primária (PK) e Chave Estrangeira (FK)",
      explanation: "Revisão: Para conectar duas tabelas relacionais em SQL, a chave primária (PK) da tabela de origem é referenciada como chave estrangeira (FK) na tabela de destino.",
      remedialQuestion: {
        prompt: "Exercício de Nivelamento: Qual cláusula SQL define a condição de junção das chaves entre duas tabelas no JOIN?",
        options: [
          {
            id: "rem-bd-1",
            text: "A cláusula ON (ex: ON tabelaA.id = tabelaB.ref_id)",
            isCorrect: true,
            explanation: "Exato! A cláusula ON estipula o critério de igualdade entre as chaves."
          },
          {
            id: "rem-bd-2",
            text: "A cláusula GROUP BY",
            isCorrect: false,
            explanation: "GROUP BY serve para agregar linhas com base em colunas iguais."
          }
        ],
        explanation: "A cláusula ON estabelece a correspondência referencial."
      }
    }
  },
  {
    id: "q-bio-genetica-1",
    disciplineId: "biologia",
    contentId: "biologia-top-24",
    disciplineName: "Biologia",
    contentTitle: "Transcrição Gênica e Processamento de RNA (Splicing e Capping)",
    title: "Transcrição Gênica e Pareamento de Bases",
    prompt: "Se uma fita molde de DNA possui a sequência de bases 3'- TAC GGT CGA -5', qual será a sequência correspondente do RNA mensageiro (RNAm) transcrito?",
    type: "objective",
    difficulty: "facil",
    options: [
      {
        id: "bio-opt-1",
        text: "5'- AUG CCA GCU -3'",
        isCorrect: true,
        explanation: "Perfeito! No RNAm complementar: T pareia com A, A pareia com U (Uracila substitui Timina), C pareia com G e G pareia com C. Portanto: TAC -> AUG, GGT -> CCA, CGA -> GCU."
      },
      {
        id: "bio-opt-2",
        text: "5'- ATG CCA GCT -3'",
        isCorrect: false,
        explanation: "Atenção: A Timina (T) não existe no RNA. Em seu lugar entra a Uracila (U)."
      },
      {
        id: "bio-opt-3",
        text: "3'- AUG CCA GCU -5'",
        isCorrect: false,
        explanation: "As fitas são antiparalelas: se o molde é 3'-> 5', a transcrita obrigatoriamente corre no sentido 5'-> 3'."
      }
    ],
    correctExplanation: "A enzima RNA polimerase lê no sentido 3'->5' e sintetiza o RNAm no sentido 5'->3', pareando Adenina com Uracila e Citosina com Guanina."
  },
  {
    id: "q-bio-fotossintese-1",
    disciplineId: "biologia",
    contentId: "biologia-top-11",
    disciplineName: "Biologia",
    contentTitle: "Fotossíntese: Fase Fotoquímica e Complexo de Evolução de Oxigênio",
    title: "Etapa Fotoquímica e Origem do Oxigênio Liberado",
    prompt: "Durante a realização da fotossíntese por plantas superiores, ocorre a liberação contínua de gás oxigênio (O₂) para o meio ambiente. A respeito da origem atômica desse oxigênio e do local subcelular onde a reação de fotólise ocorre, assinale a alternativa correta:",
    type: "objective",
    difficulty: "medio",
    options: [
      {
        id: "foto-opt-1",
        text: "O oxigênio liberado provém da quebra da molécula de água (fotólise da água ou reação de Hill), processo que ocorre nas membranas dos tilacoides do cloroplasto.",
        isCorrect: true,
        explanation: "Correto! O experimento com isótopos comprovou que a molécula de água (H₂O) é oxidada nos tilacoides, liberando elétrons, prótons H⁺ e liberando gás O₂ diretamente para a atmosfera."
      },
      {
        id: "foto-opt-2",
        text: "O oxigênio provém da cisão do gás carbônico (CO₂) fixado pela enzima RuBisCO no estroma do cloroplasto.",
        isCorrect: false,
        explanation: "Incorreto! O oxigênio do CO₂ é incorporado aos esqueletos de carbono da molécula de glicose e à água metabólica no Ciclo de Calvin, e não liberado como O₂."
      },
      {
        id: "foto-opt-3",
        text: "O oxigênio provém da degradação de glicose na matriz mitocondrial da célula vegetal durante a fotofosforilação.",
        isCorrect: false,
        explanation: "Incorreto! A mitocôndria realiza a respiração celular consumindo oxigênio, e não a fotossíntese."
      },
      {
        id: "foto-opt-4",
        text: "O oxigênio liberado é produzido exclusivamente durante a fase escura (Ciclo de Calvin), quando o NADPH é oxidado.",
        isCorrect: false,
        explanation: "Incorreto! O Ciclo de Calvin ocorre no estroma e não libera oxigênio gasoso."
      }
    ],
    correctExplanation: "A fotólise da água (2 H₂O -> 4 H⁺ + 4 e⁻ + O₂) ocorre no lúmen dos tilacoides durante a fase fotoquímica mediada pela absorção de luz no Fotossistema II.",
    prerequisiteFallback: {
      prerequisiteTopic: "Estrutura dos Cloroplastos e Pigmentos",
      explanation: "Lembre-se da anatomia do cloroplasto: os tilacoides são os discos onde a luz é captada pela clorofila, enquanto o estroma é o fluido gelatinoso onde o açúcar é produzido.",
      remedialQuestion: {
        prompt: "Exercício de Nivelamento: Em qual compartimento do cloroplasto encontram-se as moléculas de clorofila responsáveis pela absorção de luz?",
        options: [
          {
            id: "rem-foto-1",
            text: "Nas membranas dos tilacoides",
            isCorrect: true,
            explanation: "Exato! Os tilacoides possuem os fotossistemas e a clorofila ancorada em sua bicamada lipídica."
          },
          {
            id: "rem-foto-2",
            text: "No interior do núcleo celular",
            isCorrect: false,
            explanation: "A clorofila é exclusiva dos cloroplastos no citoplasma vegetal."
          }
        ],
        explanation: "A clorofila fica alojada nos tilacoides."
      }
    }
  },
  {
    id: "q-port-redacao-1",
    disciplineId: "lingua-portuguesa-redacao",
    contentId: "lingua-portuguesa-redacao-top-48",
    disciplineName: "Língua Portuguesa e Redação",
    contentTitle: "Conclusão Modelo ENEM: Os 5 Elementos Obrigatórios da Proposta de Intervenção",
    title: "Identificação dos 5 Elementos da Proposta de Intervenção",
    prompt: "Considere a seguinte conclusão de uma redação: 'Portanto, cabe ao Ministério da Educação, por meio de investimentos em infraestrutura digital nas escolas públicas periféricas, fornecer computadores e acesso à internet de alta velocidade, a fim de democratizar as oportunidades de aprendizado contemporâneo, equipando laboratórios e capacitando os docentes.' Essa proposta atende aos 5 elementos obrigatórios avaliados na Competência 5 do ENEM?",
    type: "objective",
    difficulty: "medio",
    options: [
      {
        id: "red-opt-1",
        text: "Sim, contempla com clareza: Agente (MEC), Meio/Modo (por meio de investimentos...), Ação (fornecer computadores...), Efeito (a fim de democratizar...) e Detalhamento (equipando laboratórios...).",
        isCorrect: true,
        explanation: "Excelente análise! Todos os 5 elementos avaliativos exigidos pela banca do ENEM estão presentes de forma articulada e não genérica."
      },
      {
        id: "red-opt-2",
        text: "Não, pois faltou especificar o Agente Social da proposta de intervenção.",
        isCorrect: false,
        explanation: "O Agente foi expressamente citado: 'Ministério da Educação'."
      },
      {
        id: "red-opt-3",
        text: "Não, pois não apresenta o Efeito ou Finalidade social esperada.",
        isCorrect: false,
        explanation: "O efeito foi indicado pela locução 'a fim de democratizar as oportunidades de aprendizado contemporâneo'."
      }
    ],
    correctExplanation: "Uma proposta de intervenção nota 1000 exige obrigatoriamente: Agente (quem), Ação (o que), Modo/Meio (como), Efeito (para que) e o Detalhamento de um dos elementos anteriores.",
    prerequisiteFallback: {
      prerequisiteTopic: "Os 5 Elementos da Proposta Cidadã",
      explanation: "Lembre-se da regra mnemônica da Competência 5: Quem faz? O que faz? Como faz? Para que faz? E um detalhe extra explicativo.",
      remedialQuestion: {
        prompt: "Exercício de Nivelamento: Na frase 'a fim de promover a inclusão de jovens vulneráveis', qual elemento da proposta de intervenção está sendo expresso?",
        options: [
          {
            id: "rem-red-1",
            text: "Efeito / Finalidade da ação",
            isCorrect: true,
            explanation: "Perfeito! A locução prepositiva 'a fim de' expressa a finalidade e objetivo almejado."
          },
          {
            id: "rem-red-2",
            text: "Agente executor",
            isCorrect: false,
            explanation: "O agente é o executor responsável (ex: Ministério, ONG), enquanto 'a fim de' introduz a meta."
          }
        ],
        explanation: "'A fim de' introduz oração subordinada adverbial final (Efeito/Finalidade)."
      }
    }
  },
  {
    id: "q-fis-cinematica-1",
    disciplineId: "fisica",
    contentId: "fisica-top-12",
    disciplineName: "Física",
    contentTitle: "Segunda Lei de Newton: Força Resultante e Massa Inercial",
    title: "Cálculo de Aceleração e Força Resultante",
    prompt: "Um veículo de massa m = 1200 kg parte do repouso e atinge a velocidade de 20 m/s em um intervalo de tempo de 5 segundos em linha reta horizontal. Desprezando o atrito, qual é a intensidade da força resultante média aplicada sobre o veículo?",
    type: "objective",
    difficulty: "medio",
    options: [
      {
        id: "fis-opt-1",
        text: "F = 4.800 N",
        isCorrect: true,
        explanation: "Correto! Aceleração a = Δv/Δt = 20/5 = 4 m/s². Pela 2ª Lei de Newton: F = m * a = 1200 * 4 = 4.800 N."
      },
      {
        id: "fis-opt-2",
        text: "F = 2.400 N",
        isCorrect: false,
        explanation: "Você dividiu a aceleração por 2 indevidamente. F = 1200 * 4 = 4.800 N."
      },
      {
        id: "fis-opt-3",
        text: "F = 6.000 N",
        isCorrect: false,
        explanation: "Cálculo incorreto da aceleração média. Δv = 20 m/s e Δt = 5 s, logo a = 4 m/s²."
      }
    ],
    correctExplanation: "Aceleração a = (v - v0)/t = (20 - 0)/5 = 4 m/s². Aplicando F_res = m * a: F = 1200 kg * 4 m/s² = 4.800 N.",
    prerequisiteFallback: {
      prerequisiteTopic: "Definição de Aceleração Média (MRUV)",
      explanation: "A aceleração média indica a rapidez com que a velocidade varia no tempo: a = Δv / Δt.",
      remedialQuestion: {
        prompt: "Exercício de Nivelamento: Se um objeto varia sua velocidade em 15 m/s durante 3 segundos, qual a sua aceleração?",
        options: [
          { id: "rem-fis-1", text: "5 m/s²", isCorrect: true, explanation: "Correto! 15 / 3 = 5 m/s²." },
          { id: "rem-fis-2", text: "45 m/s²", isCorrect: false, explanation: "Deve-se dividir a variação de velocidade pelo tempo." }
        ],
        explanation: "a = Δv/Δt = 15/3 = 5 m/s²."
      }
    }
  },
  {
    id: "q-geo-urbanizacao-1",
    disciplineId: "geografia",
    contentId: "geografia-top-33",
    disciplineName: "Geografia",
    contentTitle: "Conurbação, Metropolização e Regiões Metropolitanas",
    title: "Processo de Conurbação e Macrocefalia Urbana",
    prompt: "Qual conceito geográfico define a unificação física e funcional da mancha urbana de dois ou mais municípios limítrofes, decorrente de sua expansão horizontal contínua?",
    type: "objective",
    difficulty: "facil",
    options: [
      {
        id: "geo-opt-1",
        text: "Conurbação urbana",
        isCorrect: true,
        explanation: "Exato! A conurbação ocorre quando o crescimento físico de cidades vizinhas faz com que suas malhas urbanas se encontrem."
      },
      {
        id: "geo-opt-2",
        text: "Gentrificação periférica",
        isCorrect: false,
        explanation: "Gentrificação refere-se à valorização e elitização de áreas centrais ou históricas degradadas."
      },
      {
        id: "geo-opt-3",
        text: "Desmetropolização estrita",
        isCorrect: false,
        explanation: "Desmetropolização é a desconcentração industrial em direção a cidades médias."
      }
    ],
    correctExplanation: "A conurbação é o fenômeno urbano de fusão espacial de duas ou mais cidades vizinhas pela expansão horizontal de suas manchas construídas.",
    prerequisiteFallback: {
      prerequisiteTopic: "Hierarquia Urbana e Regiões Metropolitanas",
      explanation: "Compreender a diferença entre limite político-administrativo municipal e continuidade espacial urbana.",
      remedialQuestion: {
        prompt: "Exercício de Nivelamento: O que caracteriza primordialmente uma Região Metropolitana?",
        options: [
          { id: "rem-geo-1", text: "Conjunto de municípios integrados socioeconomicamente a um polo central metropolitano.", isCorrect: true, explanation: "Perfeito!" },
          { id: "rem-geo-2", text: "Apenas cidades com mais de 10 milhões de habitantes.", isCorrect: false, explanation: "Não há exigência de 10 milhões para regiões metropolitanas no Brasil." }
        ],
        explanation: "Regiões metropolitanas agrupam municípios contíguos com forte integração de transportes e serviços."
      }
    }
  },
  {
    id: "q-soc-trabalho-1",
    disciplineId: "sociologia",
    contentId: "sociologia-top-45",
    disciplineName: "Sociologia",
    contentTitle: "Uberização e Plataformização do Trabalho na Economia de Aplicativos",
    title: "Uberização e Precarização das Relações Laborais",
    prompt: "O conceito sociológico de 'uberização do trabalho' descreve uma tendência recente na qual:",
    type: "objective",
    difficulty: "medio",
    options: [
      {
        id: "soc-opt-1",
        text: "O trabalhador atua sob demanda via plataformas algorítmicas, assumindo individualmente os riscos, custos e sem garantias trabalhistas clássicas.",
        isCorrect: true,
        explanation: "Correto! A uberização transfere os riscos da produção e custos de manutenção para o próprio trabalhador sob a retórica do 'empreendedorismo de si'."
      },
      {
        id: "soc-opt-2",
        text: "O Estado assume integralmente a garantia de renda mínima e estabilidade aos profissionais autônomos digitais.",
        isCorrect: false,
        explanation: "Pelo contrário, há desregulamentação e ausência de garantias estatais nesse modelo."
      },
      {
        id: "soc-opt-3",
        text: "Ocorre a sindicalização massiva e controle operário dos algoritmos de distribuição de serviços.",
        isCorrect: false,
        explanation: "A fragmentação individual dificulta a representação e organização coletiva clássica."
      }
    ],
    correctExplanation: "A uberização representa a subsunção do trabalho a plataformas algorítmicas, transformando assalariados em 'parceiros autônomos' desprovidos de direitos de seguridade social.",
    prerequisiteFallback: {
      prerequisiteTopic: "Modelos Produtivos: Fordismo, Taylorismo e Toyotismo",
      explanation: "A transição do fordismo (trabalho fabril estável) para a acumulação flexível e pós-fordista.",
      remedialQuestion: {
        prompt: "Exercício de Nivelamento: O modelo Toyotista introduziu qual princípio chave na gestão da produção?",
        options: [
          { id: "rem-soc-1", text: "Produção just-in-time e flexibilização da mão de obra.", isCorrect: true, explanation: "Excelente!" },
          { id: "rem-soc-2", text: "Estoque massivo e jornadas rígidas vitalícias.", isCorrect: false, explanation: "Isso era típico do fordismo." }
        ],
        explanation: "O toyotismo eliminou estoques e demandou operários multifuncionais flexíveis."
      }
    }
  },
  {
    id: "q-fis-calorimetria-1",
    disciplineId: "fisica",
    contentId: "fisica-top-23",
    disciplineName: "Física",
    contentTitle: "Calorimetria: Equação Fundamental da Calorimetria (Calor Sensível)",
    title: "Cálculo de Calor Sensível e Variação Térmica",
    prompt: "Em um laboratório de Física Térmica, fornece-se energia térmica a uma massa m = 500 g de água líquida (calor específico c = 1,0 cal/g°C), elevando sua temperatura de 20 °C para 60 °C sem mudança de estado físico. Aplicando a equação fundamental da calorimetria (Q = m · c · ΔT), qual foi a quantidade de calor sensível absorvida pela água?",
    type: "objective",
    difficulty: "medio",
    options: [
      {
        id: "cal-opt-1",
        text: "Q = 20.000 cal (ou 20 kcal)",
        isCorrect: true,
        explanation: "Perfeito! A variação de temperatura é ΔT = 60 - 20 = 40 °C. Aplicando Q = m · c · ΔT = 500 · 1,0 · 40 = 20.000 cal = 20 kcal."
      },
      {
        id: "cal-opt-2",
        text: "Q = 30.000 cal (ou 30 kcal)",
        isCorrect: false,
        explanation: "Você multiplicou pela temperatura final (60 °C) em vez de usar a variação de temperatura ΔT = T_final - T_inicial = 60 - 20 = 40 °C."
      },
      {
        id: "cal-opt-3",
        text: "Q = 10.000 cal (ou 10 kcal)",
        isCorrect: false,
        explanation: "Você utilizou apenas a temperatura inicial (20 °C) no lugar da variação térmica ΔT = 40 °C."
      },
      {
        id: "cal-opt-4",
        text: "Q = 540 cal",
        isCorrect: false,
        explanation: "540 cal/g refere-se ao calor latente de vaporização da água; como não houve mudança de fase, aplica-se o calor sensível Q = m · c · ΔT = 20.000 cal."
      }
    ],
    correctExplanation: "Pela Equação Fundamental da Calorimetria (Q = m · c · ΔT): m = 500 g, c = 1,0 cal/g°C e ΔT = 60 - 20 = 40 °C. Logo, Q = 500 · 1,0 · 40 = 20.000 cal (20 kcal).",
    prerequisiteFallback: {
      prerequisiteTopic: "Temperatura, Calor e Equilíbrio Térmico (Lei Zero da Termodinâmica)",
      explanation: "Calor sensível é a energia térmica em trânsito que provoca apenas variação de temperatura (ΔT = T_final - T_inicial), sem alterar o estado de agregação da matéria.",
      remedialQuestion: {
        prompt: "Exercício de Nivelamento: Se um bloco de alumínio passa da temperatura inicial de 25 °C para a temperatura final de 75 °C, qual é a variação de temperatura ΔT sofrida pelo bloco?",
        options: [
          { id: "rem-cal-1", text: "ΔT = 50 °C (pois 75 °C - 25 °C = 50 °C)", isCorrect: true, explanation: "Correto! A variação de temperatura é sempre a diferença entre a temperatura final e a inicial: 75 - 25 = 50 °C." },
          { id: "rem-cal-2", text: "ΔT = 100 °C (somando 75 °C + 25 °C)", isCorrect: false, explanation: "Para calcular a variação ΔT devemos subtrair a temperatura inicial da final (75 - 25 = 50 °C), e não somar." }
        ],
        explanation: "ΔT = T_final - T_inicial = 75 - 25 = 50 °C."
      }
    }
  },
  {
    id: "q-web-react-1",
    disciplineId: "desenvolvimento-web",
    contentId: "desenvolvimento-web-top-45",
    disciplineName: "Desenvolvimento Web",
    contentTitle: "Hook useEffect: Ciclo de Vida, Efeitos Colaterais e Funções de Limpeza (Cleanup)",
    title: "Gerenciamento de Estado e Ciclo de Vida com useEffect",
    prompt: "Ao utilizar o hook useEffect(callback, [depA, depB]), em quais situações o callback será executado?",
    type: "objective",
    difficulty: "medio",
    options: [
      {
        id: "web-opt-1",
        text: "Na montagem inicial do componente e sempre que o valor de depA ou depB for alterado por comparação de igualdade estrita.",
        isCorrect: true,
        explanation: "Exatamente! O array de dependências aciona a função na montagem e após qualquer render em que pelo menos uma dependência tenha seu valor modificado."
      },
      {
        id: "web-opt-2",
        text: "Exclusivamente antes de o componente ser desmontado da árvore DOM.",
        isCorrect: false,
        explanation: "A desmontagem aciona a função de limpeza (cleanup return), não a execução inicial."
      },
      {
        id: "web-opt-3",
        text: "A cada ciclo de renderização, ignorando o array de dependências.",
        isCorrect: false,
        explanation: "Ignorar dependências ocorre quando o segundo argumento é omitido por completo."
      }
    ],
    correctExplanation: "useEffect com lista de dependências roda após a montagem do componente e a cada re-render no qual qualquer item da lista sofrer mutação ou nova referência (Object.is).",
    prerequisiteFallback: {
      prerequisiteTopic: "Conceito de Re-render e Pureza em Componentes React",
      explanation: "Componentes React reagem a mudanças de props e state, recalculando a interface e sincronizando efeitos colaterais.",
      remedialQuestion: {
        prompt: "Exercício de Nivelamento: O que acontece quando passamos um array de dependências vazio `[]` para o useEffect?",
        options: [
          { id: "rem-web-1", text: "O efeito roda apenas uma vez, logo após a primeira montagem do componente.", isCorrect: true, explanation: "Correto! Equivale ao componentDidMount." },
          { id: "rem-web-2", text: "O efeito nunca é executado.", isCorrect: false, explanation: "Ele roda sim na montagem inicial." }
        ],
        explanation: "Array vazio `[]` garante execução única após a primeira pintura em tela."
      }
    }
  },
  {
    id: "q-his-republica-1",
    disciplineId: "historia",
    contentId: "historia-top-48",
    disciplineName: "História",
    contentTitle: "A Era Vargas (1930-1945): Revolução de 30, CLT e o Estado Novo",
    title: "A Revolução Constitucionalista de 1932 e a Carta de 1934",
    prompt: "Quais foram as principais reivindicações do movimento paulista de 1932 que culminaram na convocação da Assembleia Constituinte e na promulgação da Constituição Brasileira de 1934?",
    type: "objective",
    difficulty: "medio",
    options: [
      {
        id: "his-opt-1",
        text: "Fim do Governo Provisório discricionário de Getúlio Vargas, autonomia estadual e promulgação de uma nova Constituição democrática com voto secreto.",
        isCorrect: true,
        explanation: "Perfeito! São Paulo exigia o retorno à ordem jurídica constitucional, nomeação de interventor civil paulista e a restauração da autonomia dos estados federados."
      },
      {
        id: "his-opt-2",
        text: "Restauração da Monarquia parlamentarista sob regência da Casa de Bragança.",
        isCorrect: false,
        explanation: "O movimento de 1932 era republicano e constitucionalista, não monarquista."
      },
      {
        id: "his-opt-3",
        text: "Instituição imediata da ditadura do Estado Novo com censura prévia.",
        isCorrect: false,
        explanation: "O Estado Novo foi instaurado por Vargas em 1937, fechando o Congresso que 1932 ajudou a abrir."
      }
    ],
    correctExplanation: "A Revolução Constitucionalista de 1932 pressionou o Governo Provisório de Vargas a convocar eleições para a Assembleia Constituinte, que consagrou o voto feminino, voto secreto e as primeiras leis trabalhistas em 1934.",
    prerequisiteFallback: {
      prerequisiteTopic: "A Revolução de 1930 e a Ruptura com a Política do Café com Leite",
      explanation: "Compreender como a deposição de Washington Luís quebrou a alternância de poder oligárquica entre SP e MG.",
      remedialQuestion: {
        prompt: "Exercício de Nivelamento: O que caracterizava a chamada 'Política do Café com Leite' na República Velha?",
        options: [
          { id: "rem-his-1", text: "A alternância de presidentes apoiados pelas oligarquias cafeeira de São Paulo e pecuarista de Minas Gerais.", isCorrect: true, explanation: "Excelente!" },
          { id: "rem-his-2", text: "O monopólio exclusivo das exportações de açúcar no Nordeste.", isCorrect: false, explanation: "O eixo econômico e político era o Centro-Sul." }
        ],
        explanation: "A política oligárquica controlava as eleições federais através do voto de cabresto."
      }
    }
  },
  {
    id: "q-rob-sensores-1",
    disciplineId: "robotica",
    contentId: "robotica-top-33",
    disciplineName: "Robótica",
    contentTitle: "Controle de Velocidade de Motores DC utilizando Sinal PWM",
    title: "Controle de Velocidade via Modulação por Largura de Pulso (PWM)",
    prompt: "Em um circuito com microcontrolador e ponte H acionando um motor CC de 12V, como o sinal PWM (Pulse Width Modulation) regula a velocidade de rotação do motor sem variar a amplitude máxima de tensão?",
    type: "objective",
    difficulty: "medio",
    options: [
      {
        id: "rob-opt-1",
        text: "Variando o ciclo de trabalho (duty cycle), ou seja, a razão entre o tempo em nível alto e o período total do sinal, alterando a tensão média eficaz entregue à carga.",
        isCorrect: true,
        explanation: "Correto! O sinal alterna entre 0V e 12V em alta frequência; quanto maior o tempo em nível alto (duty cycle), maior a tensão média aplicada aos enrolamentos do motor."
      },
      {
        id: "rob-opt-2",
        text: "Aumentando gradualmente a resistência ôhmica interna dos transistores bipolares para dissipar o excesso de corrente em calor.",
        isCorrect: false,
        explanation: "Isso seria controle resistivo linear, altamente ineficiente em comparação ao chaveamento PWM."
      },
      {
        id: "rob-opt-3",
        text: "Invertendo a polaridade dos diodos de roda-livre em sincronia com o sinal de clock.",
        isCorrect: false,
        explanation: "Diodos de roda-livre servem para proteger o circuito contra picos indutivos (tensão de retorno)."
      }
    ],
    correctExplanation: "PWM chaveia a saída entre níveis lógicos 'alto' e 'baixo'. A tensão média V_med = V_max * (t_on / T). Variando t_on/T (duty cycle) de 0% a 100%, controla-se suavemente a velocidade.",
    prerequisiteFallback: {
      prerequisiteTopic: "Conceito de Tensão Elétrica Média e Frequência",
      explanation: "Entender que a inércia mecânica e indutiva do motor integra os pulsos rápidos de tensão em um valor médio contínuo.",
      remedialQuestion: {
        prompt: "Exercício de Nivelamento: Se um sinal PWM de 10V opera com duty cycle de 50%, qual a tensão média equivalente fornecida?",
        options: [
          { id: "rem-rob-1", text: "5V", isCorrect: true, explanation: "Exato! 50% de 10V = 5V." },
          { id: "rem-rob-2", text: "10V", isCorrect: false, explanation: "10V ocorreria apenas com 100% de duty cycle." }
        ],
        explanation: "V_med = 10V * 0.5 = 5V."
      }
    }
  },
  {
    id: "q-ui-acessibilidade-1",
    disciplineId: "design-de-interface",
    contentId: "design-de-interface-top-20",
    disciplineName: "Design de Interface",
    contentTitle: "Acessibilidade de Cores: Contraste WCAG AA/AAA para Baixa Visão e Daltonismo",
    title: "Critérios de Contraste e Navegação por Teclado (WCAG 2.1)",
    prompt: "De acordo com as Diretrizes de Acessibilidade para Conteúdo Web (WCAG 2.1) no nível AA, qual é a razão de contraste mínima exigida entre texto de corpo regular e sua cor de fundo?",
    type: "objective",
    difficulty: "facil",
    options: [
      {
        id: "ui-opt-1",
        text: "4.5:1 para texto normal e 3:1 para texto grande (18pt ou 14pt em negrito).",
        isCorrect: true,
        explanation: "Correto! O critério de sucesso 1.4.3 da WCAG estipula a razão mínima de 4.5:1 para texto padrão e 3:1 para textos em tamanho maior."
      },
      {
        id: "ui-opt-2",
        text: "2:1 para texto normal e 1.5:1 para botões e links.",
        isCorrect: false,
        explanation: "Razão insuficiente, violando as normas de acessibilidade para usuários com baixa visão ou daltonismo."
      },
      {
        id: "ui-opt-3",
        text: "7:1 obrigatoriamente para qualquer elemento visual.",
        isCorrect: false,
        explanation: "7:1 é o requisito exigido para o nível mais rigoroso AAA, não para o nível AA."
      }
    ],
    correctExplanation: "O critério WCAG 1.4.3 (Nível AA) define relação de contraste mínima de 4.5:1 para textos regulares e 3:1 para textos grandes e componentes visuais de interface.",
    prerequisiteFallback: {
      prerequisiteTopic: "Os 4 Princípios Fundamentais da Acessibilidade (POUR)",
      explanation: "Perceptível, Operável, Compreensível e Robusto são os pilares que sustentam todas as diretrizes da WCAG.",
      remedialQuestion: {
        prompt: "Exercício de Nivelamento: Garantir que todos os elementos interativos sejam acessíveis via tecla TAB atende a qual princípio da WCAG?",
        options: [
          { id: "rem-ui-1", text: "Operável", isCorrect: true, explanation: "Excelente! A interface deve ser operável por múltiplos dispositivos de entrada." },
          { id: "rem-ui-2", text: "Perceptível", isCorrect: false, explanation: "Perceptibilidade foca na apresentação sensorial da informação." }
        ],
        explanation: "Navegação por teclado garante operabilidade para quem não utiliza mouse."
      }
    }
  },
  {
    id: "q-emp-canvas-1",
    disciplineId: "empreendedorismo-social",
    contentId: "empreendedorismo-social-top-1",
    disciplineName: "Projeto de Empreendedorismo Social e Economia Solidária",
    contentTitle: "Origens e Conceito de Negócios Sociais segundo Muhammad Yunus",
    title: "Diferença entre Empresa Tradicional e Negócio Social de Impacto",
    prompt: "Em um empreendimento de Economia Solidária e Impacto Social, qual é a diretriz fundamental que orienta a distribuição do superávit (lucro) financeiro apurado ao final do exercício contábil?",
    type: "objective",
    difficulty: "medio",
    options: [
      {
        id: "emp-opt-1",
        text: "Reinvestimento preponderante na missão socioambiental e partilha democrática proporcional decidida em assembleia geral de associados.",
        isCorrect: true,
        explanation: "Exatamente! Negócios sociais e cooperativas priorizam o impacto na comunidade e reinvestem seus excedentes para perenizar o benefício coletivo."
      },
      {
        id: "emp-opt-2",
        text: "Remuneração exclusiva dos acionistas majoritários proporcionalmente ao volume de capital investido.",
        isCorrect: false,
        explanation: "Essa é a lógica da sociedade anônima puramente comercial tradicional de capital aberto."
      },
      {
        id: "emp-opt-3",
        text: "Transferência compulsória de 100% dos ativos para instituições governamentais federais.",
        isCorrect: false,
        explanation: "Negócios de impacto mantêm autonomia jurídica e financeira privada com finalidade pública coletiva."
      }
    ],
    correctExplanation: "Na economia solidária e negócios de impacto, o capital é meio e não fim: a gestão é democrática ('um membro, um voto') e o superávit é reinvestido na causa ou distribuído conforme deliberação coletiva.",
    prerequisiteFallback: {
      prerequisiteTopic: "Princípios do Cooperativismo e Governança Participativa",
      explanation: "A gestão participativa substitui a hierarquia centrada no acionista pelo protagonismo comunitário.",
      remedialQuestion: {
        prompt: "Exercício de Nivelamento: Em uma cooperativa autêntica, quantos votos cada cooperado tem nas assembleias decisórias?",
        options: [
          { id: "rem-emp-1", text: "1 voto por associado, independentemente da cota de capital que possua.", isCorrect: true, explanation: "Perfeito! Princípio da igualdade democrática." },
          { id: "rem-emp-2", text: "Votos proporcionais ao dinheiro depositado.", isCorrect: false, explanation: "Isso violaria o estatuto cooperativista." }
        ],
        explanation: "No cooperativismo vigora a regra 'um cooperado, um voto'."
      }
    }
  },
  {
    id: "q-ing-present-1",
    disciplineId: "lingua-inglesa",
    contentId: "lingua-inglesa-top-6",
    disciplineName: "Língua Inglesa",
    contentTitle: "Diferenças Cruciais entre Simple Present e Present Continuous",
    title: "Uso dos Auxiliares Do/Does e Interpretação Técnica",
    prompt: "Em documentação técnica de software em Língua Inglesa, considere a frase: 'The authentication server validates the token while the client application is waiting for the response.' Qual é a justificativa gramatical correta para os tempos verbais empregados?",
    type: "objective",
    difficulty: "medio",
    options: [
      {
        id: "ing-opt-1",
        text: "'Validates' está no Simple Present (3ª pessoa do singular, indicando rotina/comportamento padrão do servidor) e 'is waiting' está no Present Continuous (ação em progresso no momento da execução).",
        isCorrect: true,
        explanation: "Perfeito! 'The server' (it) exige flexão com -s no Simple Present ('validates') para descrever uma operação sistemática, enquanto 'is waiting' descreve a ação contínua em andamento."
      },
      {
        id: "ing-opt-2",
        text: "Ambos os verbos estão no Simple Past descrevendo eventos já encerrados.",
        isCorrect: false,
        explanation: "Não há verbos no passado (-ed); trata-se de Simple Present e Present Continuous."
      },
      {
        id: "ing-opt-3",
        text: "Na forma negativa, 'validates' deveria ser reescrito como 'do not validates'.",
        isCorrect: false,
        explanation: "Na 3ª pessoa do singular (he/she/it), usa-se o auxiliar 'does not' seguido do verbo na forma base sem -s: 'does not validate'."
      }
    ],
    correctExplanation: "O Simple Present expressa rotinas e fatos gerais (com acréscimo de -s/-es na 3ª pessoa do singular e auxiliar does), enquanto o Present Continuous (am/is/are + verbo-ing) indica ações em andamento.",
    prerequisiteFallback: {
      prerequisiteTopic: "Uso dos Auxiliares Do/Does e Falsos Cognatos em Documentação de TI",
      explanation: "Lembre-se: para He/She/It no Simple Present, usamos 'does' em perguntas e negativas, e o verbo principal volta à forma base.",
      remedialQuestion: {
        prompt: "Exercício de Nivelamento: Qual é a forma interrogativa correta da frase 'The system processes the data'?",
        options: [
          { id: "rem-ing-1", text: "Does the system process the data?", isCorrect: true, explanation: "Correto! Usa-se o auxiliar 'Does' e o verbo principal retorna à forma base 'process'." },
          { id: "rem-ing-2", text: "Do the system processes the data?", isCorrect: false, explanation: "'The system' equivale a 'it' (3ª pessoa do singular), exigindo 'Does' e verbo sem -es." }
        ],
        explanation: "Com 'Does', o verbo principal perde a terminação -s/-es."
      }
    }
  }
];

export const initialActivityQuestions = sampleQuestions;

import { initialDisciplines } from "./disciplinesData";
import { generateTopicSpecificQuestions } from "../services/pedagogicalActivityGenerator";

/**
 * Gera obrigatoriamente 10 questões completas (múltipla escolha e discursivas)
 * semanticamente específicas à disciplina, ao módulo e ao tópico selecionados,
 * variando a composição conforme a área (Exatas com cálculos e fórmulas,
 * Humanas com contexto histórico/social e análise de fontes, Biologia com estruturas/processos,
 * Linguagens e Técnicas com aplicação real).
 */
export function getQuestionsForDisciplineAndTopic(
  disciplineId: string,
  contentId?: string
): ActivityQuestion[] {
  const disc =
    initialDisciplines.find((d) => d.id === disciplineId) || initialDisciplines[0];
  const allContents = disc.modules.flatMap((m) => m.contents);
  const targetContent =
    (contentId ? allContents.find((c) => c.id === contentId) : undefined) ||
    allContents[0];

  const topicTitle = targetContent.title;

  // Include any matching hand-crafted questions for this discipline/topic when they match the exact topic
  const matchingHandcrafted = sampleQuestions.filter(
    (q) =>
      q.disciplineId === disc.id &&
      (q.contentId === targetContent.id ||
        q.contentTitle.toLowerCase() === topicTitle.toLowerCase())
  );

  return generateTopicSpecificQuestions(
    disc,
    targetContent,
    matchingHandcrafted
  );
}


