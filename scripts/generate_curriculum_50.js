import fs from 'fs';
import path from 'path';

// 15 official disciplines
const DISCIPLINES_METADATA = [
  {
    id: "matematica",
    name: "Matemática",
    category: "Exatas e Tecnológicas",
    description: "Álgebra fundamental, funções, geometria plana e espacial, estatística aplicada, trigonometria e cálculo analítico.",
    iconName: "Calculator",
    color: "from-blue-600 to-indigo-600",
    accentColor: "blue",
    progressPercent: 68,
    modules: [
      {
        title: "Fundamentos de Álgebra e Equações Polinomiais",
        description: "Operações algébricas, fatoração, produtos notáveis e resolução de equações polinomiais.",
        topics: [
          "Equações do 2º Grau e Bhaskara",
          "Fatoração de Polinômios e Produtos Notáveis",
          "Relações de Girard: Soma e Produto de Raízes",
          "Equações Biquadradas e Polinomiais de Grau Superior",
          "Sistemas Lineares e Regra de Cramer",
          "Escalonamento de Matrizes e Eliminação Gaussiana",
          "Frações Algébricas e Simplificação Racional",
          "Inequações do 1º e 2º Graus",
          "Equações Irracionais e Domínio de Validade",
          "Inequações Produto e Quociente com Quadro de Sinais"
        ]
      },
      {
        title: "Teoria das Funções, Exponenciais e Logaritmos",
        description: "Estudo analítico de funções afins, quadráticas, exponenciais e logarítmicas.",
        topics: [
          "Função Afim e Taxa de Variação Linear",
          "Função Quadrática e Coordenadas do Vértice",
          "Estudo dos Sinais e Raízes de Funções Reais",
          "Função Composta e Inversa",
          "Propriedades Operatórias de Potências e Radicais",
          "Função Exponencial e Crescimento Populacional",
          "Equações e Inequações Exponenciais",
          "Definição e Axiomas dos Logaritmos",
          "Propriedades dos Logaritmos e Mudança de Base",
          "Equações Logarítmicas e Aplicações em Escalas Científicas"
        ]
      },
      {
        title: "Trigonometria e Geometria Plana",
        description: "Trigonometria no triângulo e no ciclo, áreas, semelhança e congruência.",
        topics: [
          "Razões Trigonométricas no Triângulo Retângulo",
          "Lei dos Senos e Lei dos Cossenos",
          "Ciclo Trigonométrico e Redução ao Primeiro Quadrante",
          "Funções Seno, Cosseno e Tangente e seus Períodos",
          "Identidades Trigonométricas Fundamentais e Fórmulas de Adição",
          "Teorema de Pitágoras e Aplicações Geométricas",
          "Teorema de Tales e Semelhança de Triângulos",
          "Áreas de Figuras Planas Poligonais e Circulares",
          "Polígonos Regulares, Apótema e Inscrição Circunferencial",
          "Comprimento da Circunferência e Setores Circulares"
        ]
      },
      {
        title: "Geometria Espacial e Geometria Analítica",
        description: "Poliedros, corpos redondos, plano cartesiano, retas e circunferências.",
        topics: [
          "Relação de Euler e Poliedros Regulares de Platão",
          "Prismas e Paralelepípedos: Volume e Área da Superfície",
          "Pirâmides e Troncos de Pirâmide",
          "Cilindros Retos e Oblíquos: Seções Meridianas",
          "Cones e Troncos de Cone: Geratriz e Rotação",
          "Esferas: Área Superficial e Volume Esférico",
          "Distância entre Dois Pontos e Ponto Médio no Plano",
          "Equação Geral e Reduzida da Reta",
          "Posições Relativas entre Retas e Distância Ponto-Reta",
          "Equação Geral e Reduzida da Circunferência"
        ]
      },
      {
        title: "Estatística, Probabilidade e Análise Combinatória",
        description: "Contagem, arranjos, permutações, probabilidade clássica e medidas descritivas.",
        topics: [
          "Princípio Fundamental da Contagem (PFC)",
          "Fatorial e Permutações Simples e com Repetição",
          "Arranjos Simples versus Combinações Simples",
          "Binômio de Newton e Triângulo de Pascal",
          "Espaço Amostral e Eventos Probabilísticos",
          "Probabilidade da União de Eventos Mutuamente Exclusivos",
          "Probabilidade Condicional e Teorema de Bayes",
          "Média Aritmética Simples e Ponderada",
          "Mediana, Moda e Separatrizes Quartílicas",
          "Variância, Desvio Padrão e Coeficiente de Variação"
        ]
      }
    ]
  },
  {
    id: "biologia",
    name: "Biologia",
    category: "Ciências da Natureza",
    description: "Citologia, genética mendeliana e molecular, fisiologia celular, evolução, ecologia e biotecnologia.",
    iconName: "Dna",
    color: "from-emerald-600 to-teal-600",
    accentColor: "emerald",
    progressPercent: 74,
    modules: [
      {
        title: "Biologia Celular, Membranas e Bioquímica",
        description: "Macromoléculas, estrutura das membranas plasmáticas e organelas celulares.",
        topics: [
          "Bioquímica Celular: Água, Sais Minerais e Proteínas",
          "Enzimas: Mecanismo de Ação e Cinética de Michaelis-Menten",
          "Lipídios, Carboidratos e Armazenamento Energético",
          "Estrutura e Mosaico Fluido da Membrana Plasmática",
          "Transporte Passivo: Difusão Simples, Facilitada e Osmose",
          "Transporte Ativo: Bomba de Sódio e Potássio e Gradientes Eletroquímicos",
          "Complexo Golgiense, Retículo Endoplasmático e Secreção Celular",
          "Lisossomos, Autofagia e Apoptose Celular",
          "Citoesqueleto: Microtúbulos, Filamentos Intermediários e Microfilamentos",
          "Mitocôndrias e Origem Endossimbiótica das Células Eucarióticas"
        ]
      },
      {
        title: "Metabolismo Energético Celular e Fotossíntese",
        description: "Vias metabólicas da respiração celular, fermentação e fixação de energia.",
        topics: [
          "Fotossíntese: Fase Fotoquímica e Complexo de Evolução de Oxigênio",
          "Fotossíntese: Ciclo de Calvin-Benson e Fixação de Carbono pela RuBisCO",
          "Fotorrespiração e Adaptações de Plantas C3, C4 e CAM",
          "Glicólise Celular e Destinos do Piruvato",
          "Ciclo de Krebs (Ciclo do Ácido Cítrico) e Produção de Coenzimas",
          "Cadeia Respiratória e Fosforilação Oxidativa Quimiosmótica",
          "Fermentação Lática em Músculos e Indústria de Laticínios",
          "Fermentação Alcoólica e Produção de Biocombustíveis",
          "Balanço Energético Comparativo entre Vias Aeróbias e Anaeróbias",
          "Quimiossíntese em Bactérias e Fontes Hidrotermais Oceânicas"
        ]
      },
      {
        title: "Genética Molecular e Biologia dos Ácidos Nucleicos",
        description: "Estrutura do DNA, replicação semiconservativa, transcrição e tradução.",
        topics: [
          "Estrutura Molecular do DNA: Dupla Hélice e Pareamento de Bases",
          "Replicação Semiconservativa do DNA e Ação das DNA Polimerases",
          "Estrutura do RNA: Mensageiro, Transportador e Ribossômico",
          "Transcrição Gênica e Processamento de RNA (Splicing e Capping)",
          "Código Genético: Degenerescência, Universalidade e Códons",
          "Tradução e Síntese Proteica nos Ribossomos",
          "Regulação da Expressão Gênica e o Operon Lac",
          "Mutações Gênicas Pontuais e Cromossômicas Estruturais",
          "Tecnologia do DNA Recombinante e Enzimas de Restrição",
          "Edição Genética por CRISPR-Cas9 e Terapia Gênica"
        ]
      },
      {
        title: "Genética Clássica, Hereditariedade e Citogenética",
        description: "Leis de Mendel, grupos sanguíneos, herança ligada ao sexo e linkage.",
        topics: [
          "Primeira Lei de Mendel: Segregação dos Fatores",
          "Cruzamento-Teste e Retrocruzamento Genético",
          "Segunda Lei de Mendel: Segregação Independente de Dois ou Mais Pares",
          "Alelos Múltiplos e Herança do Sistema ABO e Fator Rh",
          "Eritroblastose Fetal e Incompatibilidade Materno-Fetal",
          "Herança Ligada, Restrita e Influenciada pelo Sexo",
          "Linkage Genético e Crossing-Over na Meiose",
          "Mapeamento Genético e Unidades de Recombinação (Morganídeos)",
          "Pleiotropia, Epistasia e Herança Quantitativa Poligênica",
          "Cariótipo Humano e Aneuploidias (Síndromes de Down, Turner e Klinefelter)"
        ]
      },
      {
        title: "Evolução Biológica, Ecologia e Biodiversidade",
        description: "Seleção natural, especiação, fluxo de energia nos ecossistemas e impactos ambientais.",
        topics: [
          "Teorias Evolutivas: Lamarckismo versus Darwinismo",
          "Teoria Sintética da Evolução (Neodarwinismo) e Frequências Gênicas",
          "Princípio de Hardy-Weinberg e Genética de Populações",
          "Mecanismos de Especiação Alopátrica, Simpátrica e Parapátrica",
          "Evidências da Evolução: Homologia, Analogia e Fósseis",
          "Cadeias e Teias Tróficas: Produtores, Consumidores e Decompositores",
          "Fluxo de Energia e Pirâmides Ecológicas (Número, Biomassa e Energia)",
          "Ciclos Biogeoquímicos: Carbono, Nitrogênio, Água e Fósforo",
          "Relações Ecológicas Harmônicas e Desarmônicas",
          "Impactos Ambientais: Eutrofização, Efeito Estufa e Perda de Biodiversidade"
        ]
      }
    ]
  },
  {
    id: "fisica",
    name: "Física",
    category: "Ciências da Natureza",
    description: "Mecânica clássica, termodinâmica, óptica geométrica, ondas, eletromagnetismo e física moderna.",
    iconName: "Zap",
    color: "from-cyan-600 to-blue-600",
    accentColor: "cyan",
    progressPercent: 62,
    modules: [
      {
        title: "Cinemática Escalar e Vetorial",
        description: "Movimentos retilíneos, vetores, lançamentos oblíquos e movimento circular.",
        topics: [
          "Movimento Retilíneo Uniforme (MRU) e Velocidade Média",
          "Movimento Retilíneo Uniformemente Variado (MRUV) e Equação de Torricelli",
          "Queda Livre e Lançamento Vertical no Vácuo",
          "Cinemática Vetorial: Adição e Decomposição de Vetores",
          "Lançamento Horizontal e Balística Bidimensional",
          "Lançamento Oblíquo: Alcance Máximo e Altura do Vértice",
          "Movimento Circular Uniforme (MCU): Velocidade Angular e Frequência",
          "Aceleração Centrípeta e Força Centrípeta em Curvas",
          "Transmissão de Movimento Circular por Correias e Engrenagens",
          "Gráficos de Posição, Velocidade e Aceleração no Tempo"
        ]
      },
      {
        title: "Dinâmica Newtoniana, Trabalho e Energia",
        description: "Leis de Newton, forças de atrito, gravitação, conservação de energia e momento.",
        topics: [
          "Primeira Lei de Newton (Inércia) e Referenciais Inerciais",
          "Segunda Lei de Newton: Força Resultante e Massa Inercial",
          "Terceira Lei de Newton: Ação e Reação em Pares de Forças",
          "Força Normal, Tração e Forças Elásticas (Lei de Hooke)",
          "Força de Atrito Estático e Cinético",
          "Trabalho de uma Força Constante e Forças Variáveis",
          "Energia Cinética e Teorema da Energia Cinética",
          "Energia Potencial Gravitacional e Elástica",
          "Conservação da Energia Mecânica em Sistemas Isolados",
          "Quantidade de Movimento (Momento Linear), Impulso e Colisões Mecânicas"
        ]
      },
      {
        title: "Termologia, Calorimetria e Termodinâmica",
        description: "Temperatura, dilatação térmica, calor sensível e latente, leis da termodinâmica.",
        topics: [
          "Escalas Termométricas: Celsius, Fahrenheit e Kelvin",
          "Dilatação Térmica Linear, Superficial e Volumétrica dos Sólidos",
          "Comportamento Anômalo da Água e Dilatação dos Líquidos",
          "Calor Sensível, Capacidade Térmica e Calor Específico",
          "Calor Latente e Curvas de Mudança de Fase da Matéria",
          "Processos de Propagação de Calor: Condução, Convecção e Irradiação",
          "Equação Geral dos Gases Ideais (Clapeyron)",
          "Transformações Gasosas: Isotérmica, Isobárica e Isocórica",
          "Primeira Lei da Termodinâmica: Calor, Trabalho e Energia Interna",
          "Segunda Lei da Termodinâmica, Ciclo de Carnot e Entropia"
        ]
      },
      {
        title: "Ondulatória e Óptica Geométrica",
        description: "Propagação de ondas, acústica, reflexão, refração e formação de imagens.",
        topics: [
          "Classificação das Ondas: Mecânicas, Eletromagnéticas, Longitudinais e Transversais",
          "Equação Fundamental da Ondulatória: v = λ · f",
          "Fenômenos Ondulatórios: Reflexão, Refração e Difração",
          "Interferência de Ondas e Ondas Estacionárias em Cordas",
          "Acústica: Altura, Intensidade e Timbre do Som",
          "Efeito Doppler em Ondas Sonoras e Eletromagnéticas",
          "Princípios da Óptica Geométrica e Propagação Retilínea da Luz",
          "Espelhos Planos e Leis da Reflexão Regular",
          "Espelhos Esféricos de Gauss: Côncavos e Convexos",
          "Refração Luminosa, Lei de Snell-Descartes e Lentes Esféricas Delgadas"
        ]
      },
      {
        title: "Eletromagnetismo e Física Moderna",
        description: "Eletrostática, circuitos elétricos, campos magnéticos, indução e relatividade/quântica.",
        topics: [
          "Cargas Elétricas, Processos de Eletrização e Lei de Coulomb",
          "Campo Elétrico e Linhas de Força de Cargas Pontuais",
          "Potencial Elétrico, Energia Potencial e Superfícies Equipotenciais",
          "Corrente Elétrica, Tensão e Resistência (Primeira e Segunda Lei de Ohm)",
          "Circuitos Elétricos: Associação de Resistores em Série e Paralelo",
          "Potência Elétrica, Efeito Joule e Consumo de Energia em kWh",
          "Campo Magnético Gerado por Correntes: Fios, Espiras e Solenoides",
          "Força Magnética sobre Cargas Móveis (Força de Lorentz)",
          "Indução Eletromagnética: Lei de Faraday-Neumann e Lei de Lenz",
          "Física Moderna: Efeito Fotoelétrico e Dualidade Onda-Partícula"
        ]
      }
    ]
  },
  {
    id: "geografia",
    name: "Geografia",
    category: "Ciências Humanas e Sociais",
    description: "Geografia física, relevo, clima, geopolítica global, urbanização, demografia e agronegócio.",
    iconName: "Globe",
    color: "from-amber-600 to-orange-600",
    accentColor: "amber",
    progressPercent: 70,
    modules: [
      {
        title: "Geografia Física, Relevo e Dinâmica da Terra",
        description: "Tectônica de placas, agentes internos e externos do relevo e solos.",
        topics: [
          "Estrutura Interna da Terra e Deriva Continental",
          "Tectônica de Placas: Limites Divergentes, Convergentes e Transformantes",
          "Agentes Endógenos do Relevo: Vulcanismo, Tectonismo e Terremotos",
          "Agentes Exógenos do Relevo: Intemperismo Físico e Químico",
          "Unidades do Relevo Brasileiro segundo Jurandyr Ross",
          "Pedogênese: Formação, Horizontes e Tipos de Solo no Brasil",
          "Bacias Hidrográficas Brasileiras e Potencial Hidrelétrico",
          "Aquíferos Guarani e Alter do Chão: Recursos Hídricos Subterrâneos",
          "Litosfera e Exploração Mineral no Quadrilátero Ferrífero e Carajás",
          "Erosão, Desertificação e Degradação dos Solos Agrícolas"
        ]
      },
      {
        title: "Climatologia, Biomas e Meio Ambiente",
        description: "Fatores climáticos, dinâmicas atmosféricas e domínios morfoclimáticos.",
        topics: [
          "Elementos e Fatores do Clima: Latitude, Altitude e Continentalidade",
          "Massas de Ar atuantes no Território Brasileiro",
          "Tipos Climáticos do Brasil: Equatorial, Tropical, Semiárido e Subtropical",
          "Fenômenos El Niño e La Niña e suas Repercussões Globais",
          "Domínios Morfoclimáticos Brasileiros segundo Aziz Ab'Sáber",
          "Bioma Amazônia: Rios Voadores e Fragilidade Pedológica",
          "Bioma Cerrado: O Berço das Águas e o Avanço da Fronteira Agrícola",
          "Bioma Caatinga: Adaptações Xerófilas e o Polígono das Secas",
          "Mata Atlântica e Floresta de Araucárias: Devastação e Remanescentes",
          "Acordos Ambientais Internacionais: Protocolo de Quioto e Acordo de Paris"
        ]
      },
      {
        title: "Demografia, Migrações e População",
        description: "Transição demográfica, indicadores populacionais e movimentos migratórios.",
        topics: [
          "Conceitos Demográficos: Taxa de Natalidade, Mortalidade e Fecundidade",
          "Transição Demográfica e Envelhecimento Populacional no Brasil",
          "Estrutura Etária e Leitura de Pirâmides Etárias",
          "Distribuição da População e Densidade Demográfica no Território",
          "Migrações Internas no Brasil: Êxodo Rural e Migração de Retorno",
          "Fluxos Migratórios Internacionais e a Crise dos Refugiados",
          "População Economicamente Ativa (PEA) e Divisão do Trabalho",
          "Questões Étnico-Raciais e Distribuição de Renda no Brasil",
          "Comunidades Tradicionais: Povos Indígenas e Territórios Quilombolas",
          "Políticas Populacionais Históricas: Malthusianismo versus Neomalthusianismo"
        ]
      },
      {
        title: "Espaço Urbano e Redes Geográficas",
        description: "Urbanização brasileira, metropolização, hierarquia urbana e problemas socioambientais.",
        topics: [
          "Processo Histórico de Urbanização no Brasil no Século XX",
          "Hierarquia Urbana e a Rede de Cidades segundo o IBGE",
          "Conurbação, Metropolização e Regiões Metropolitanas",
          "Megalópoles Globais e Cidades Globais na Divisão Internacional do Trabalho",
          "Segregação Socioespacial e a Formação de Periferias Urbanas",
          "Gentrificação e Especulação Imobiliária nos Centros Urbanos",
          "Mobilidade Urbana, Transporte Público e Cidades Inteligentes",
          "Ilhas de Calor, Inversão Térmica e Enchentes nas Grandes Cidades",
          "Gestão de Resíduos Sólidos Urbanos e Saneamento Básico",
          "Estatuto da Cidade e Planos Diretores Municipais Participativos"
        ]
      },
      {
        title: "Geopolítica Mundial e Globalização Econômica",
        description: "Guerra Fria, Nova Ordem Mundial, blocos econômicos e conflitos geopolíticos.",
        topics: [
          "Ordem Bipolar da Guerra Fria e a Doutrina de Contenção",
          "A Nova Ordem Mundial Multipolar e o Surgimento dos BRICS",
          "Globalização Econômica e o Papel das Empresas Transnacionais",
          "Blocos Econômicos: Mercosul, União Europeia e USMCA",
          "Divisão Internacional do Trabalho (DIT) da Colônia à Era Digital",
          "Geopolítica do Petróleo e a Organização dos Países Exportadores (OPEP)",
          "Transição Energética Global e Disputa por Minerais Críticos (Lítio e Terras Raras)",
          "Conflitos Geopolíticos no Oriente Médio: Recursos Hídricos e Território",
          "Disputas Territoriais no Leste Europeu e a Expansão da OTAN",
          "Guerra Comercial e Hegemonia Tecnológica entre Estados Unidos e China"
        ]
      }
    ]
  },
  {
    id: "sociologia",
    name: "Sociologia",
    category: "Ciências Humanas e Sociais",
    description: "Teorias clássicas e contemporâneas, estratificação social, cidadania, poder e movimentos sociais.",
    iconName: "Users",
    color: "from-rose-600 to-pink-600",
    accentColor: "rose",
    progressPercent: 76,
    modules: [
      {
        title: "Sociologia Clássica: Durkheim, Marx e Weber",
        description: "Os fundamentos epistemológicos da ciência da sociedade e seus métodos.",
        topics: [
          "Gênese da Sociologia: Iluminismo, Revolução Francesa e Revolução Industrial",
          "Auguste Comte e o Positivismo Científico",
          "Émile Durkheim: O Fato Social e suas Características (Coercitivo, Exterior, Geral)",
          "Solidariedade Mecânica e Solidariedade Orgânica em Durkheim",
          "A Teoria da Anomia e o Estudo Sociológico do Suicídio por Durkheim",
          "Karl Marx: Materialismo Histórico Dialético e Infraestrutura Econômica",
          "Luta de Classes, Burguesia e Proletariado na Teoria Marxista",
          "Mais-Valia Absoluta e Relativa e a Exploração do Trabalho",
          "Alienação Social, Fetiche da Mercadoria e Consciência de Classe",
          "Max Weber: Ação Social, Tipos Ideais e Compreensão Histórica"
        ]
      },
      {
        title: "Poder, Estado e Estratificação Social",
        description: "Conceitos de dominação, legitimidade do Estado, classes sociais e desigualdade.",
        topics: [
          "Max Weber: Tipos Puros de Dominação Legítima (Tradicional, Carismática, Legal-Racional)",
          "Conceito de Estado Moderno e o Monopólio do Uso Legítimo da Força",
          "Estratificação Social: Castas, Estamentos e Classes Sociais",
          "Mobilidade Social Vertical e Horizontal nas Sociedades Contemporâneas",
          "Teoria das Elites: Pareto, Mosca e Robert Michels",
          "Antonio Gramsci: Hegemonia Cultural e Sociedade Civil",
          "Michel Foucault: Microfísica do Poder, Biopolítica e Sociedades Disciplinares",
          "Pierre Bourdieu: Capital Cultural, Capital Social e Habitus",
          "A Reprodução das Desigualdades Sociais pelo Sistema Escolar em Bourdieu",
          "Desigualdade de Renda, Índice de Gini e Políticas Distributivas"
        ]
      },
      {
        title: "Cultura, Identidade e Antropologia Social",
        description: "Conceito de cultura, etnocentrismo, relativismo e diversidade sociocultural.",
        topics: [
          "Conceito Antropológico de Cultura versus Determinismo Biológico e Geográfico",
          "Etnocentrismo e Relativismo Cultural na Obra de Franz Boas",
          "Indústria Cultural e Sociedade de Massa segundo Adorno e Horkheimer",
          "Cultura Erudita, Cultura Popular e Cultura de Massa",
          "Multiculturalismo e Hibridismo Cultural na América Latina",
          "Identidade e Pós-Modernidade segundo Stuart Hall",
          "Representações Sociais e Construção Simbólica da Realidade",
          "Gênero, Patriarcado e Divisão Sexual do Trabalho",
          "Racismo Estrutural e Relações Raciais no Brasil segundo Silvio Almeida",
          "Mito da Democracia Racial e Crítica a Gilberto Freyre por Florestan Fernandes"
        ]
      },
      {
        title: "Movimentos Sociais, Cidadania e Direitos",
        description: "Conquista de direitos civis, políticos e sociais e ação coletiva.",
        topics: [
          "História da Cidadania: Direitos Civis, Políticos e Sociais segundo T. H. Marshall",
          "Cidadania no Brasil: O Conceito de 'Cidadania Concedida' e Cidadãos de Papel",
          "Movimentos Sociais Clássicos versus Novos Movimentos Sociais",
          "O Movimento Operário e as Conquistas das Leis Trabalhistas no Século XX",
          "O Movimento Feminista e as Três Ondas de Luta por Direitos",
          "O Movimento Negro no Brasil: Das Revoltas Quilombolas às Ações Afirmativas",
          "Movimentos Indígenas e a Demarcação de Terras Constitucionais",
          "Movimentos Rurais e Urbanos: Luta pela Terra (MST) e por Moradia (MTST)",
          "Movimentos Ambientais e Justiça Climática nas Periferias",
          "Ativismo Digital, Redes Sociais e as Manifestações de Massa do Século XXI"
        ]
      },
      {
        title: "Trabalho, Globalização e Sociedade em Rede",
        description: "Transformações no mundo do trabalho, precarização e cibercultura.",
        topics: [
          "Modelos de Produção: Taylorismo, Fordismo e a Linha de Montagem",
          "Toyotismo e a Produção Flexível Just-in-Time",
          "Globalização e Desregulamentação do Mercado de Trabalho",
          "Precarização do Trabalho, Terceirização e o Conceito de 'Precariado'",
          "Uberização e Plataformização do Trabalho na Economia de Aplicativos",
          "A Sociedade em Rede e a Era da Informação segundo Manuel Castells",
          "Zygmunt Bauman e a Modernidade Líquida: Relações e Trabalho Instáveis",
          "Byung-Chul Han e a 'Sociedade do Cansaço': Autoexploração e Burnout",
          "Vigilância de Dados e Capitalismo de Vigilância segundo Shoshana Zuboff",
          "Desafios Sociológicos da Inteligência Artificial e Automação no Século XXI"
        ]
      }
    ]
  },
  {
    id: "analise-projeto-sistemas",
    name: "Análise e Projeto de Sistemas",
    category: "Formação Profissional e Projetos",
    description: "Engenharia de requisitos, modelagem de software, diagramas UML, padrões de projeto e testes.",
    iconName: "Binary",
    color: "from-violet-600 to-purple-600",
    accentColor: "violet",
    progressPercent: 80,
    modules: [
      {
        title: "Engenharia de Requisitos de Software",
        description: "Elicitação, análise, especificação e validação de requisitos de sistemas.",
        topics: [
          "Conceito de Requisitos de Software e o Ciclo de Vida da Engenharia de Requisitos",
          "Requisitos Funcionais (RF) versus Requisitos Não Funcionais (RNF)",
          "Técnicas de Elicitação de Requisitos: Entrevistas, Workshops e Observação",
          "Histórias de Usuário (User Stories) e Critérios de Aceite no Framework Ágil",
          "Documento de Especificação de Requisitos de Software (SRS - Padrão IEEE 830)",
          "Matriz de Rastreabilidade de Requisitos e Controle de Mudanças",
          "Prototipação de Baixa e Alta Fidelidade como Ferramenta de Validação",
          "Modelagem de Regras de Negócio e Casos de Uso Essenciais",
          "Análise de Viabilidade Técnica, Operacional e Econômica de Software",
          "Verificação e Validação de Requisitos com Stakeholders"
        ]
      },
      {
        title: "Modelagem de Sistemas com UML (Unified Modeling Language)",
        description: "Diagramas estruturais e comportamentais para arquitetura de software.",
        topics: [
          "Fundamentos da UML 2.5: Diagramas Estruturais versus Comportamentais",
          "Diagrama de Casos de Uso: Atores, Casos, Include, Extend e Generalização",
          "Diagrama de Classes: Atributos, Métodos, Visibilidade e Modificadores",
          "Relacionamentos em Diagrama de Classes: Associação, Agregação e Composição",
          "Diagrama de Sequência: Linhas de Vida, Mensagens Síncronas e Assíncronas",
          "Diagrama de Atividades: Nós de Decisão, Bifurcação (Fork) e União (Join)",
          "Diagrama de Estados: Transições, Gatilhos e Eventos de Ciclo de Vida",
          "Diagrama de Componentes: Módulos, Interfaces Fornecidas e Requeridas",
          "Diagrama de Implantação: Nós de Hardware, Artefatos e Topologia de Rede",
          "Diagrama de Pacotes: Organização de Namespaces e Gestão de Dependências"
        ]
      },
      {
        title: "Padrões de Projeto de Software (Design Patterns)",
        description: "Padrões GoF criacionais, estruturais e comportamentais aplicados à engenharia.",
        topics: [
          "Princípios SOLID de Design Orientado a Objetos",
          "Single Responsibility Principle (SRP) e Open/Closed Principle (OCP)",
          "Liskov Substitution, Interface Segregation e Dependency Inversion",
          "Padrão Criacional: Singleton e Controle de Instâncias Únicas",
          "Padrão Criacional: Factory Method e Abstract Factory",
          "Padrão Criacional: Builder para Construção de Objetos Complexos",
          "Padrão Estrutural: Adapter para Interoperabilidade de Interfaces",
          "Padrão Estrutural: Facade para Simplificação de Subsistemas Complexos",
          "Padrão Comportamental: Observer para Notificação de Eventos Reativos",
          "Padrão Comportamental: Strategy para Algoritmos Intercambiáveis"
        ]
      },
      {
        title: "Arquitetura de Software e Estilos Arquiteturais",
        description: "Arquitetura em camadas, Clean Architecture, microsserviços e mensageria.",
        topics: [
          "Arquitetura em Camadas (Layered Architecture): Apresentação, Negócio e Dados",
          "Model-View-Controller (MVC) e Model-View-ViewModel (MVVM)",
          "Clean Architecture de Robert C. Martin: Regras de Negócio Independentes",
          "Arquitetura Hexagonal (Ports and Adapters) e Isolamento de Domínio",
          "Domain-Driven Design (DDD): Entidades, Value Objects e Agregados",
          "Monólitos versus Arquitetura de Microsserviços: Vantagens e Trade-offs",
          "Design de APIs RESTful: Verbos HTTP, Idempotência e Códigos de Status",
          "Arquitetura Orientada a Eventos (EDA) e Message Brokers (RabbitMQ e Kafka)",
          "Padrão CQRS (Command Query Responsibility Segregation)",
          "Segurança por Design: Autenticação JWT, OAuth2 e Prevenção de Ataques OWASP"
        ]
      },
      {
        title: "Metodologias de Desenvolvimento, Testes e Qualidade",
        description: "Processos ágeis, pirâmide de testes e garantia da qualidade de software.",
        topics: [
          "Modelo Tradicional em Cascata (Waterfall) versus Manifesto Ágil de 2001",
          "Framework Scrum: Papéis (PO, Scrum Master, Devs), Cerimônias e Artefatos",
          "Método Kanban: Limite de WIP, Visualização de Fluxo e Métricas (Lead Time)",
          "Extreme Programming (XP): Programação em Par e Refatoração Contínua",
          "A Pirâmide de Testes de Software: Unidade, Integração e Ponta a Ponta (E2E)",
          "Test-Driven Development (TDD): Ciclo Red-Green-Refactor",
          "Testes Unitários com Mocks, Stubs e Spies",
          "Testes de Integração e Simulação de Banco de Dados",
          "Integração Contínua e Entrega Contínua (CI/CD) com Pipelines Automatizados",
          "Métricas de Qualidade de Código: Cobertura de Testes e Dívida Técnica (SonarQube)"
        ]
      }
    ]
  },
  {
    id: "materia-pratica-estagio-tcc",
    name: "Matéria Prática de Estágio e TCC",
    category: "Formação Profissional e Projetos",
    description: "Metodologia científica, normas da ABNT, redação de monografia, ética profissional e banca examinadora.",
    iconName: "FileSpreadsheet",
    color: "from-indigo-600 to-violet-600",
    accentColor: "indigo",
    progressPercent: 82,
    modules: [
      {
        title: "Metodologia Científica e Definição do Projeto",
        description: "Conceito de método científico, escolha do tema, problema de pesquisa e hipóteses.",
        topics: [
          "O Método Científico: Tipos de Conhecimento (Empírico, Filosófico, Teológico e Científico)",
          "Escolha e Delimitação do Tema de TCC na Área Técnica",
          "Formulação do Problema de Pesquisa: A Pergunta Central Norteadora",
          "Elaboração de Objetivos: Objetivo Geral e Objetivos Específicos",
          "Formulação e Teste de Hipóteses de Pesquisa",
          "Justificativa da Pesquisa: Relevância Teórica, Prática e Social",
          "Classificação da Pesquisa: Qualitativa, Quantitativa e Mista (Quali-Quanti)",
          "Classificação quanto aos Fins: Exploratória, Descritiva e Explicativa",
          "Classificação quanto aos Meios: Bibliográfica, Documental, Experimental e Estudo de Caso",
          "Construção do Cronograma Físico e Matriz de Recursos do TCC"
        ]
      },
      {
        title: "Normas da ABNT e Estruturação Monográfica",
        description: "Padronização técnica de trabalhos acadêmicos segundo a ABNT.",
        topics: [
          "Estrutura Formal do Trabalho Acadêmico segundo a NBR 14724",
          "Elementos Pré-Textuais: Capa, Folha de Rosto, Resumo e Sumário",
          "Elementos Textuais: Introdução, Desenvolvimento, Resultados e Conclusão",
          "Elementos Pós-Textuais: Referências, Apêndices e Anexos",
          "Formatação Tipográfica: Margens, Espaçamento, Alinhamento e Paginação",
          "Citações Diretas Curtas e Longas segundo a NBR 10520",
          "Citações Indiretas (Paráfrases) e Sistema Autor-Data",
          "Elaboração de Referências Bibliográficas segundo a NBR 6023 (Livros, Artigos e Web)",
          "Apresentação de Ilustrações: Tabelas (IBGE) versus Quadros e Figuras",
          "Prevenção ao Plágio Acadêmico e Uso Ético de Ferramentas de IA"
        ]
      },
      {
        title: "Fundamentação Teórica e Revisão Bibliográfica",
        description: "Busca sistemática de literatura, fichamento e articulação de autores.",
        topics: [
          "Estratégias de Busca em Bases Científicas (Scielo, Google Acadêmico, Periódicos CAPES)",
          "Operadores Booleanos (AND, OR, NOT) e Strings de Pesquisa",
          "Critérios de Inclusão e Exclusão na Revisão Bibliográfica",
          "Técnicas de Fichamento de Textos Acadêmicos (Resumo, Citação e Comentário)",
          "Articulação Dialógica entre Autores: Confronto e Convergência Teórica",
          "Estado da Arte e Mapeamento de Lacunas na Literatura Técnica",
          "Estruturação Lógica dos Capítulos de Fundamentação",
          "Redação Científica Impessoal: Clareza, Concisão, Coesão e Precisão Terminológica",
          "Gestão de Referências com Ferramentas Automatizadas (Mendeley, Zotero)",
          "Validação de Fontes Primárias e Secundárias na Computação e Tecnologia"
        ]
      },
      {
        title: "Coleta, Análise de Dados e Desenvolvimento Prático",
        description: "Instrumentos de pesquisa, desenvolvimento do artefato técnico e validação experimental.",
        topics: [
          "Instrumentos de Coleta de Dados: Questionários Fechados e Entrevistas Semiestruturadas",
          "Amostragem Probabilística e Não Probabilística",
          "Aspectos Éticos na Pesquisa: Termo de Consentimento Livre e Esclarecido (TCLE)",
          "Desenvolvimento do Artefato Prático: Documentação do Software ou Protótipo de TCC",
          "Apresentação e Discussão dos Resultados Técnicos Obtidos",
          "Triangulação de Dados: Confrontando Resultados com a Teoria Revisada",
          "Elaboração de Gráficos e Diagramas de Desempenho do Sistema",
          "Redação das Considerações Finais: Respondendo ao Problema de Pesquisa",
          "Apontamento de Limitações Metodológicas e Sugestões para Trabalhos Futuros",
          "Revisão Textual Gramatical e Coerência Global da Monografia"
        ]
      },
      {
        title: "Estágio Supervisionado, Prática Profissional e Banca",
        description: "Relatório de estágio, postura ética no ambiente de trabalho e oratória para defesa.",
        topics: [
          "Legislação do Estágio (Lei 11.788/2008): Direitos, Deveres e Termo de Compromisso",
          "Elaboração do Plano de Atividades de Estágio e Alinhamento com o Curso",
          "Redação do Relatório Circunstanciado de Estágio Supervisionado",
          "Ética Profissional no Trabalho: Sigilo, Propriedade Intelectual e LGPD",
          "Soft Skills no Mercado de TI: Comunicação Assertiva e Trabalho em Equipe",
          "Planejamento da Apresentação Visual para a Banca (Slides e Pitch Técnico)",
          "Técnicas de Oratória e Gestão do Tempo durante a Defesa Oral",
          "Simulação de Perguntas da Banca e Argumentação Técnica Segura",
          "Elaboração da Ata de Defesa e Ajustes Pós-Banca (Versão Definitiva)",
          "Depósito Institucional do TCC no Repositório Digital da Instituição"
        ]
      }
    ]
  },
  {
    id: "banco-de-dados",
    name: "Banco de Dados",
    category: "Formação Profissional e Projetos",
    description: "Modelagem conceitual e relacional, álgebra relacional, linguagem SQL (DML, DDL, DCL), índices e transações.",
    iconName: "Database",
    color: "from-teal-600 to-emerald-600",
    accentColor: "teal",
    progressPercent: 78,
    modules: [
      {
        title: "Modelagem Conceitual e Teoria Relacional",
        description: "Abordagem entidade-relacionamento, cardinalidades e mapeamento para o modelo relacional.",
        topics: [
          "Arquitetura de Três Esquemas de Bancos de Dados (ANSI/SPARC)",
          "Entidades Fortes, Entidades Fracas e Atributos Simples e Compostos",
          "Cardinalidade de Relacionamentos: 1:1, 1:N e N:N",
          "Relacionamentos Ternários e Entidades Associativas",
          "Mapeamento do Modelo Conceitual (DER) para o Modelo Relacional",
          "Chaves Primárias (PK), Chaves Candidatas e Chaves Alternativas",
          "Chaves Estrangeiras (FK) e Integridade Referencial",
          "Regras de Integridade: Not Null, Unique, Check e Default",
          "Álgebra Relacional: Seleção (σ), Projeção (π) e Produto Cartesiano (×)",
          "Álgebra Relacional: Junção Natural (⋈), Junção Externa e Divisão"
        ]
      },
      {
        title: "Normalização de Dados e Qualidade de Esquemas",
        description: "Formas normais para eliminação de redundâncias e anomalias de atualização.",
        topics: [
          "Anomalias de Inserção, Atualização e Exclusão em Tabelas Desnormalizadas",
          "Dependência Funcional Total e Parcial",
          "Primeira Forma Normal (1FN): Atomicidade de Atributos e Vetores",
          "Segunda Forma Normal (2FN): Eliminação de Dependências Parciais",
          "Terceira Forma Normal (3FN): Eliminação de Dependências Transitivas",
          "Forma Normal de Boyce-Codd (FNBC) e Casos Especiais de Chaves",
          "Quarta Forma Normal (4FN) e Dependências Multivaloradas",
          "Desnormalização Controlada: Casos de Uso para Performance de Leitura",
          "Engenharia Reversa de Esquemas de Banco de Dados",
          "Auditoria de Esquemas e Redução de Redundância Armazenada"
        ]
      },
      {
        title: "Linguagem SQL: Definição (DDL) e Manipulação (DML)",
        description: "Comandos CREATE, ALTER, DROP, INSERT, UPDATE, DELETE e consultas básicas.",
        topics: [
          "Comandos DDL: CREATE TABLE, tipos de dados e restrições (Constraints)",
          "Comandos DDL: ALTER TABLE e DROP TABLE com restrições CASCADE e RESTRICT",
          "Comandos DML: INSERT INTO com inserções simples e múltiplas em lote",
          "Comandos DML: UPDATE com cláusula WHERE e boas práticas de segurança",
          "Comandos DML: DELETE versus TRUNCATE TABLE",
          "Consultas SQL Fundamentais: SELECT, FROM, WHERE e operadores lógicos",
          "Operadores de Comparação e Padrões: LIKE, ILIKE, BETWEEN e IN",
          "Tratamento de Valores Nulos: IS NULL, IS NOT NULL e função COALESCE",
          "Ordenação de Resultados com ORDER BY (ASC/DESC) e paginação com LIMIT e OFFSET",
          "Funções de Linha Simples: Strings, Datas, Cálculos Matemáticos e Conversões de Tipo"
        ]
      },
      {
        title: "Consultas Avançadas: Junções, Agrupamentos e Subconsultas",
        description: "JOINs múltiplos, agregações GROUP BY, HAVING, subqueries e CTEs.",
        topics: [
          "INNER JOIN: Junção Interna entre Duas ou Mais Tabelas Relacionadas",
          "LEFT OUTER JOIN e RIGHT OUTER JOIN: Preservação de Registros Órfãos",
          "FULL OUTER JOIN e CROSS JOIN: Usos Específicos e Cuidados de Volume",
          "Auto-junção (Self Join) para Estruturas Hierárquicas",
          "Funções de Agregação: COUNT, SUM, AVG, MIN e MAX",
          "Agrupamento de Dados com GROUP BY e Filtragem Agregada com HAVING",
          "Subconsultas Escalares e Subconsultas de Linha Única",
          "Subconsultas com Operadores de Conjunto: IN, ANY, ALL e EXISTS",
          "Expressões de Tabela Comuns (CTEs com WITH) e CTEs Recursivas",
          "Funções de Janela (Window Functions): ROW_NUMBER, RANK, DENSE_RANK e OVER"
        ]
      },
      {
        title: "Transações, Índices, Otimização e Segurança",
        description: "Propriedades ACID, planos de execução, índices B-Tree e controle de acesso.",
        topics: [
          "Propriedades ACID: Atomicidade, Consistência, Isolamento e Durabilidade",
          "Controle de Transações: BEGIN TRANSACTION, COMMIT e ROLLBACK",
          "Níveis de Isolamento de Transações (Read Uncommitted a Serializable)",
          "Problemas de Concorrência: Dirty Read, Non-Repeatable Read e Phantom Read",
          "Criação e Estrutura de Índices: Índices B-Tree e Índices Hash",
          "Índices Compostos, Índices Únicos e Índices Parciais",
          "Análise do Plano de Execução com EXPLAIN e EXPLAIN ANALYZE",
          "Views (Visões Lógicas) e Views Materializadas para Relatórios Rápidos",
          "Triggers e Stored Procedures em PL/pgSQL",
          "Comandos DCL (GRANT, REVOKE), Roles de Usuários e Proteção contra SQL Injection"
        ]
      }
    ]
  },
  {
    id: "lingua-portuguesa-redacao",
    name: "Língua Portuguesa e Redação",
    category: "Linguagens",
    description: "Sintaxe normativa, concordância, crase, interpretação textual e redação dissertativo-argumentativa nota 1000.",
    iconName: "PenTool",
    color: "from-red-600 to-rose-600",
    accentColor: "red",
    progressPercent: 75,
    modules: [
      {
        title: "Morfologia e Classes Gramaticais",
        description: "Estudo das classes de palavras e seus valores semânticos no discurso.",
        topics: [
          "Estrutura e Formação de Palavras: Derivação e Composição",
          "Substantivos: Classificação, Flexão de Gênero, Número e Grau",
          "Adjetivos: Valor Explicativo versus Restritivo e Locuções Adjetivas",
          "Artigos Definidos e Indefinidos e seus Efeitos Semânticos de Sentido",
          "Pronomes Pessoais, de Tratamento e Colocação Pronominal (Próclise, Ênclise, Mesóclise)",
          "Pronomes Demonstrativos: Uso Espacial, Temporal e Referencial no Texto",
          "Pronomes Relativos: O Emprego Correto de 'Cujo', 'Onde', 'Que' e 'Quem'",
          "Verbos: Modos, Tempos Verbais e Correlação Temporal",
          "Verbos Regulares, Irregulares, Defectivos e Formas Nominais",
          "Advérbios, Preposições e Conjunções Coordenativas e Subordinativas"
        ]
      },
      {
        title: "Sintaxe do Período Simples e Termos da Oração",
        description: "Termos essenciais, integrantes e acessórios da oração.",
        topics: [
          "Frase, Oração e Período: Definições e Distinções Sintáticas",
          "Termos Essenciais: Tipos de Sujeito (Determinado, Oculto, Indeterminado, Inexistente)",
          "Termos Essenciais: Predicado Nominal, Verbal e Verbo-Nominal",
          "Transitividade Verbal: Verbos Transitivos Diretos, Indiretos e Intransitivos",
          "Termos Integrantes: Objeto Direto e Objeto Indireto (Pleonasmos e Preposicionados)",
          "Termos Integrantes: Complemento Nominal versus Adjunto Adnominal",
          "Termos Integrantes: Agente da Passiva e Vozes Verbais (Ativa, Passiva, Reflexiva)",
          "Termos Acessórios: Adjunto Adverbial e suas Circunstâncias Semânticas",
          "Termos Acessórios: Aposto (Explicativo, Enumerativo, Resumidor) e Vocativo",
          "Sintaxe de Regência Verbal e Nominal de Verbos de Alta Complexidade"
        ]
      },
      {
        title: "Sintaxe do Período Composto e Pontuação",
        description: "Orações coordenadas e subordinadas, emprego da crase e da vírgula.",
        topics: [
          "Coordenação: Orações Coordenadas Assindéticas e Sindéticas (Aditivas, Adversativas, etc.)",
          "Subordinação Substantiva: Subjetivas, Objetivas Diretas, Indiretas e Completivas Nominais",
          "Subordinação Adjetiva: Orações Explicativas versus Orações Restritivas",
          "Subordinação Adverbial: Causais, Consecutivas, Concessivas, Condicionais e Finais",
          "Orações Reduzidas de Infinitivo, Gerúndio e Particípio",
          "Concordância Verbal: Regras Gerais e Casos Especiais do Sujeito Composto",
          "Concordância Nominal: Regras com Adjetivos Pospostos e Antepostos",
          "O Fenômeno da Crase: Casos Obrigatórios, Proibidos e Facultativos",
          "Regras Fundamentais de Pontuação: O Emprego da Vírgula nos Períodos",
          "Ponto e Vírgula, Dois-Pontos, Travessões e Parênteses no Encadeamento Textual"
        ]
      },
      {
        title: "Coesão, Coerência e Interpretação Textual",
        description: "Mecanismos anafóricos, catafóricos, operadores argumentativos e gêneros.",
        topics: [
          "Coesão Referencial: Anáfora, Catáfora, Elipse e Substituição Lexical",
          "Coesão Sequencial: O Papel dos Conectivos e Operadores Argumentativos",
          "Coerência Textual: Princípio da Não-Contradição e Relevância Temática",
          "Ambiguidade, Polissemia e Paráfrase na Interpretação de Textos",
          "Denotação versus Conotação e Linguagem Figurada",
          "Figuras de Linguagem de Palavras: Metáfora, Metonímia, Catacrese e Sinestesia",
          "Figuras de Pensamento e Sintaxe: Ironia, Antítese, Paradoxo, Hipérbole e Pleonasmo",
          "Intertextualidade: Paródia, Pastiche, Alusão e Citação Direta",
          "Variação Linguística: Diatópica, Diastrática, Diafásica e Preconceito Linguístico",
          "Tipologias Textuais: Narrativa, Descritiva, Dissertativa, Injuntiva e Expositiva"
        ]
      },
      {
        title: "Redação Dissertativo-Argumentativa Modelo ENEM Nota 1000",
        description: "Projeto de texto estratégico, repertório sociocultural e proposta de intervenção.",
        topics: [
          "A Estrutura do Texto Dissertativo-Argumentativo: Introdução, D1, D2 e Conclusão",
          "As 5 Competências de Avaliação da Matriz do ENEM",
          "Introdução Eficaz: Contextualização, Repertório Sociocultural e Tese Clara",
          "Construção do Projeto de Texto Estratégico e Planejamento Prévio",
          "Desenvolvimento 1 (D1): Tópico Frasal, Repertório Legitimado e Fundamentação Crítica",
          "Desenvolvimento 2 (D2): Causa e Consequência, Contraponto e Aprofundamento Argumentativo",
          "Uso Produtivo de Repertório Sociocultural: Filosofia, Sociologia, História e Literatura",
          "Conclusão Modelo ENEM: Os 5 Elementos Obrigatórios da Proposta de Intervenção",
          "Detalhamento dos Elementos da Intervenção (Agente, Ação, Meio, Efeito, Detalhe)",
          "Checklist de Revisão Pré-Entrega: Evitando Truncamentos e Falhas de Paralelismo"
        ]
      }
    ]
  },
  {
    id: "desenvolvimento-web",
    name: "Desenvolvimento Web",
    category: "Formação Profissional e Projetos",
    description: "HTML5 semântico, CSS3 moderno, JavaScript ES6+, React, TypeScript, APIs e full-stack.",
    iconName: "Code2",
    color: "from-sky-600 to-cyan-600",
    accentColor: "sky",
    progressPercent: 84,
    modules: [
      {
        title: "HTML5 Semântico e Acessibilidade Web (a11y)",
        description: "Estruturação semântica, formulários acessíveis e padrões WCAG.",
        topics: [
          "Arquitetura da Web: Modelo Cliente-Servidor, DNS, HTTP/HTTPS e Navegadores",
          "Estrutura Básica do Documento HTML5 e Meta Tags Essenciais para SEO",
          "Tags Semânticas: header, nav, main, article, section, aside e footer",
          "Tipografia e Texto Semântico: Hierarquia de Headings (h1 a h6) e Parágrafos",
          "Elementos de Mídia: figure, img com alt descritivo, picture, audio e video",
          "Formulários HTML5: input types modernos, labels obrigatórios e validações nativas",
          "Tabelas Semânticas com caption, thead, tbody, tfoot e escopo de colunas",
          "Padrões de Acessibilidade WCAG 2.1 e o Papel dos Atributos ARIA (Roles e States)",
          "Navegação por Teclado e Foco Visível para Leitores de Tela",
          "Auditoria de Acessibilidade e SEO com Google Lighthouse"
        ]
      },
      {
        title: "CSS3 Moderno, Flexbox, Grid e Responsividade",
        description: "Box model, estilização avançada, layouts bidimensionais e Tailwind CSS.",
        topics: [
          "Modelo de Caixa (Box Model): Margin, Border, Padding e Content (box-sizing)",
          "Seletores CSS Avançados: Pseudo-classes, Pseudo-elementos e Especificidade",
          "Posicionamento CSS: Static, Relative, Absolute, Fixed e Sticky",
          "Layout Unidimensional com Flexbox: Flex Container, Flex Items e Alinhamentos",
          "Layout Bidimensional com CSS Grid: Grid Template Columns, Rows e Grid Areas",
          "Design Responsivo e Mobile-First com Media Queries e Unidades Relativas (rem, vw, vh)",
          "Variáveis CSS (Custom Properties) e Implementação de Temas Claro/Escuro",
          "Transições e Animações CSS (@keyframes e funções de timing cubic-bezier)",
          "Frameworks Utilitários: Conceitos e Produtividade com Tailwind CSS",
          "Metodologias de Organização CSS: BEM, CSS Modules e CSS-in-JS"
        ]
      },
      {
        title: "JavaScript Moderno (ES6+) e Manipulação do DOM",
        description: "Lógica de programação para web, escopo, funções de alta ordem e eventos.",
        topics: [
          "Variáveis Modernas: let, const e Escopo de Bloco versus var",
          "Tipos Primitivos, Objetos, Coerção de Tipos e Operadores Estritos (===)",
          "Funções Tradicionais versus Arrow Functions e o Comportamento do 'this'",
          "Métodos de Arrays Funcionais: map, filter, reduce, find e some",
          "Desestruturação de Objetos e Arrays (Destructuring) e Operador Spread/Rest",
          "Manipulação do DOM: Seleção de Elementos e Modificação Dinâmica de Classes e Estilos",
          "Delegação de Eventos e Captura/Borbulhamento (Event Bubbling)",
          "Armazenamento no Navegador: localStorage, sessionStorage e Cookies",
          "Módulos JavaScript: import e export (ES Modules)",
          "Tratamento Robusto de Erros com blocos try/catch/finally e Error Boundaries"
        ]
      },
      {
        title: "Assincronismo, Requisições HTTP e Integração de APIs",
        description: "Event Loop, Promises, async/await, consumo de APIs REST e WebSockets.",
        topics: [
          "O Modelo de Execução do JavaScript: Event Loop, Call Stack e Task Queue",
          "Callbacks Tradicionais e o Problema do Callback Hell",
          "Promises em JavaScript: Estados (Pending, Fulfilled, Rejected) e Encadeamento",
          "Sintaxe Moderna async/await e Tratamento de Exceções Assíncronas",
          "A API Fetch: Fazendo Requisições GET, POST, PUT, PATCH e DELETE",
          "Configuração de Cabeçalhos HTTP, Headers de Autorização e Bearer Tokens",
          "Trabalhando com Formatos de Dados JSON: JSON.parse e JSON.stringify",
          "Tratamento de CORS (Cross-Origin Resource Sharing) no Frontend e Backend",
          "Comunicação Bidirecional em Tempo Real com WebSockets",
          "Debounce e Throttle em Requisições para Otimização de Performance"
        ]
      },
      {
        title: "React Moderno, TypeScript e Estado de Aplicação",
        description: "Componentes funcionais, hooks essenciais, tipagem estática e deploy de SPAs.",
        topics: [
          "Conceito de Single Page Application (SPA) e o Virtual DOM do React",
          "JSX/TSX: Sintaxe Declarativa e Renderização Condicional de Listas",
          "Componentes Funcionais, Props e Tipagem Estática com TypeScript",
          "Hook useState: Gerenciamento de Estado Local e Imutabilidade",
          "Hook useEffect: Ciclo de Vida, Efeitos Colaterais e Funções de Limpeza (Cleanup)",
          "Hook useRef: Acesso a Elementos Nativos do DOM e Valores Persistentes",
          "Hook useMemo e useCallback: Otimização e Prevenção de Rerenders Desnecessários",
          "Compartilhamento de Estado Global com Context API (createContext e useContext)",
          "Roteamento de Páginas no Cliente com React Router Dom",
          "Build e Otimização para Produção com Vite e Boas Práticas de Deploy"
        ]
      }
    ]
  },
  {
    id: "historia",
    name: "História",
    category: "Ciências Humanas e Sociais",
    description: "História antiga, medieval, moderna, contemporânea, Brasil colônia, império e república.",
    iconName: "History",
    color: "from-yellow-600 to-amber-600",
    accentColor: "yellow",
    progressPercent: 72,
    modules: [
      {
        title: "Antiguidade Clássica e Idade Média",
        description: "Grécia e Roma antigas, feudalismo e formação dos estados modernos.",
        topics: [
          "Grécia Antiga: A Polis Grega e o Nascimento da Democracia Ateniense",
          "Esparta: Sociedade Militarizada, Educação Hoplita e Oligarquia",
          "Roma Republicana: Luta Plebeia, Tribunato e Expansão Territorial",
          "Roma Imperial: Pax Romana, Pão e Circo e a Crise do Escravismo",
          "Surgimento e Difusão do Cristianismo no Império Romano",
          "As Invasões Germânicas e a Fragmentação do Império Romano do Ocidente",
          "O Sistema Feudal: Servidão, Suserania e Vassalagem e a Tríplice Ordem Social",
          "A Igreja Católica Medieval: Teocentrismo, Mosteiros e Cruzadas",
          "O Renascimento Comercial e Urbano e o Surgimento da Burguesia",
          "A Crise do Século XIV: Peste Negra, Guerra dos Cem Anos e Fome"
        ]
      },
      {
        title: "Idade Moderna, Renascimento e Expansão Marítima",
        description: "Humanismo, reformas religiosas, mercantilismo e conquista da América.",
        topics: [
          "Renascimento Cultural e Científico: Humanismo, Antropocentrismo e Arte",
          "A Reforma Protestante de Martinho Lutero e João Calvino",
          "A Contrarreforma Católica: Concílio de Trento e a Companhia de Jesus",
          "O Absolutismo Monárquico e Teóricos do Poder Real (Maquiavel, Hobbes, Bossuet)",
          "Mercantilismo: Metalismo, Balança Comercial Favorável e Protecionismo",
          "As Grandes Navegações Ibéricas e a Expansão Marítimo-Comercial Européia",
          "O Tratado de Tordesilhas e a Partilha do Novo Mundo",
          "As Sociedades Pré-Colombianas: Maias, Astecas e Incas frente à Conquista",
          "O Sistema Colonial Tradicional e o Pacto Colonial",
          "O Tráfico Transatlântico de Escravizados e a Diáspora Africana"
        ]
      },
      {
        title: "Brasil Colônia e Brasil Império",
        description: "Ciclo do açúcar, ciclo do ouro, independência e o segundo reinado.",
        topics: [
          "Período Pré-Colonial Brasileiro e a Exploração do Pau-Brasil",
          "Capitanias Hereditárias e o Governo-Geral como Centralização Administrativa",
          "A Economia Açucareira no Nordeste e a Sociedade Patriarcal dos Engenhos",
          "Invasões Holandesas no Nordeste e o Governo de Maurício de Nassau",
          "O Ciclo do Ouro e a Mineração em Minas Gerais no Século XVIII",
          "Revoltas Nativistas: Beckman, Emboabas e Mascates",
          "Revoltas Emancipacionistas: Inconfidência Mineira e Conjuração Baiana",
          "A Vinda da Família Real Portuguesa ao Brasil (1808) e a Abertura dos Portos",
          "O Processo de Independência do Brasil (1822) e o Primeiro Reinado de D. Pedro I",
          "O Segundo Reinado (1840-1889): Economia Cafeeira, Guerra do Paraguai e Abolição"
        ]
      },
      {
        title: "Revoluções Burguesas e o Século XIX",
        description: "Iluminismo, Revolução Francesa, Revolução Industrial e Imperialismo.",
        topics: [
          "O Iluminismo e os Filósofos da Razão (Locke, Voltaire, Rousseau, Montesquieu)",
          "A Independência das Treze Colônias Norte-Americanas (1776)",
          "A Revolução Francesa (1789): Da Queda da Bastilha ao Fim do Antigo Regime",
          "Fases da Revolução Francesa: Monarquia Constitucional, Convenção Jacobina e Diretório",
          "A Era Napoleônica e o Bloqueio Continental à Inglaterra",
          "A Primeira Revolução Industrial na Inglaterra: Vapor, Carvão e Tecelagem",
          "A Segunda Revolução Industrial: Aço, Eletricidade, Petróleo e Motores",
          "O Surgimento do Movimento Operário: Ludismo, Cartismo e Socialismo Científico",
          "As Revoluções de 1848 (Primavera dos Povos) e as Unificações da Itália e Alemanha",
          "O Imperialismo Neocolonialista do Século XIX e a Partilha da África e Ásia"
        ]
      },
      {
        title: "Século XX e Brasil Republicano Contemporâneo",
        description: "Guerras mundiais, Guerra Fria, Era Vargas, Regime Militar e redemocratização.",
        topics: [
          "Primeira Guerra Mundial (1914-1918): Imperialismo, Trincheiras e Tratado de Versalhes",
          "A Revolução Russa de 1917: Da Queda do Czarismo à Criação da União Soviética",
          "A Crise de 1929 e a Grande Depressão Global",
          "A Ascensão dos Totalitarismos: Fascismo Italiano e Nazismo Alemão",
          "A Segunda Guerra Mundial (1939-1945): Holocausto, Eixo versus Aliados e Bomba Atômica",
          "A Guerra Fria: Bipolaridade, Corrida Armamentista, Espacial e Crise dos Mísseis",
          "Brasil República Velha (1889-1930): Coronelismo e Política do Café com Leite",
          "A Era Vargas (1930-1945): Revolução de 30, CLT e o Estado Novo",
          "O Regime Militar Brasileiro (1964-1985): Golpe, Atos Institucionais (AI-5) e Repressão",
          "Redemocratização no Brasil: Diretas Já e a Constituição Cidadã de 1988"
        ]
      }
    ]
  },
  {
    id: "robotica",
    name: "Robótica",
    category: "Formação Profissional e Projetos",
    description: "Sistemas embarcados, Arduino, sensores, atuadores, controle cinemático e robótica autônoma.",
    iconName: "Cpu",
    color: "from-orange-600 to-red-600",
    accentColor: "orange",
    progressPercent: 75,
    modules: [
      {
        title: "Fundamentos de Eletroeletrônica para Robótica",
        description: "Circuitos eletrônicos, componentes passivos e ativos e instrumentos de bancada.",
        topics: [
          "Conceitos Básicos de Tensão, Corrente, Resistência e Potência Elétrica",
          "Uso do Multímetro Digital para Medição de Grandezas Elétricas",
          "Resistores e Código de Cores: Cálculo e Dimensionamento de Resistores de Pull-Up/Pull-Down",
          "Capacitores: Tipos, Carga, Descarga e Filtragem de Ruído em Motores",
          "Diodos Retificadores e Diodos Emissores de Luz (LEDs)",
          "Transistores Bipolares (BJT) e MOSFETs como Chaves de Potência",
          "Relés Eletromecânicos e Módulos Relé de Estado Sólido",
          "Leis de Kirchhoff para Corrente e Tensão em Nós e Malhas",
          "Divisores de Tensão Resistivos e Leitura em Portas Analógicas",
          "Segurança em Bancada Eletrônica e Prevenção contra Curto-Circuitos"
        ]
      },
      {
        title: "Microcontroladores e Plataforma Arduino",
        description: "Arquitetura do ATmega328P, pinos de E/S, PWM e programação em C/C++.",
        topics: [
          "Arquitetura de Microcontroladores versus Microprocessadores (Harvard versus von Neumann)",
          "A Placa Arduino Uno e o Microcontrolador ATmega328P",
          "Estrutura Básica de Código Arduino: setup() e loop()",
          "Entradas e Saídas Digitais: pinMode(), digitalWrite() e digitalRead()",
          "Entradas Analógicas e Conversão A/D de 10 bits: analogRead()",
          "Modulação por Largura de Pulso (PWM) e o Comando analogWrite()",
          "Comunicação Serial UART com o Computador e Serial Monitor",
          "Uso de Funções de Temporização Não-Bloqueantes com millis() versus delay()",
          "Interrupções Externas por Hardware no Arduino",
          "Gravação de Firmware e Inicialização via Bootloader"
        ]
      },
      {
        title: "Sensores e Coleta de Dados do Ambiente",
        description: "Sensores ultrassônicos, infravermelhos, temperatura, luminosidade e inerciais.",
        topics: [
          "Sensor de Distância Ultrassônico (HC-SR04): Princípio de Eco e Cálculo de Distância",
          "Sensores Ópticos Reflexivos Infravermelhos para Detecção de Linha",
          "LDR (Light Dependent Resistor) e Medição de Intensidade Luminosa",
          "Sensor de Temperatura e Umidade (DHT11/DHT22): Leitura por Protocolo de Fio Único",
          "Sensores de Toque e Fins de Curso Eletromecânicos (Bumper Switches)",
          "Giroscópios e Acelerômetros (IMU MPU-6050): Medição de Ângulo e Aceleração",
          "Sensores Magnéticos de Efeito Hall para Encoders de Velocidade",
          "Sensor de Presença Infravermelho Passivo (PIR)",
          "Calibração de Sensores e Redução de Ruído por Média Móvel",
          "Fusão de Dados Sensoriais e Filtro Complementar para Estabilização"
        ]
      },
      {
        title: "Atuadores, Motores e Controle de Potência",
        description: "Servomotores, motores DC, motores de passo e pontes H.",
        topics: [
          "Princípio de Funcionamento dos Motores de Corrente Contínua (DC)",
          "Ponte H e o Circuito Integrado L298N/L293D para Inversão de Rotação",
          "Controle de Velocidade de Motores DC utilizando Sinal PWM",
          "Servomotores de Posição (SG90/MG995): Controle por Pulso Angular",
          "Servomotores de Rotação Contínua em Robôs Móveis",
          "Motores de Passo de Passo Bipolar e Unipolar: Precisão de Posicionamento",
          "Drivers para Motores de Passo (A4988/DRV8825) e Micropasso",
          "Eletroímãs e Solenoides em Robôs Manipuladores",
          "Cálculo de Torque e Relação de Redução de Caixas de Engrenagens",
          "Dimensionamento de Baterias (LiPo, Li-Ion, 18650) e Reguladores de Tensão"
        ]
      },
      {
        title: "Robôs Autônomos, Cinemática e Aplicações Industriais",
        description: "Robôs seguidores de linha, desvio de obstáculos, controle PID e robótica industrial.",
        topics: [
          "Cinemática Diferencial de Robôs Móveis com Duas Rodas de Tração",
          "Algoritmo de Navegação Autônoma para Robô Seguidor de Linha",
          "Algoritmo de Navegação para Desvio de Obstáculos com Sensor Ultrassônico",
          "Algoritmo para Robôs Móveis em Labirintos (Técnica da Mão Direita)",
          "Controle em Malha Fechada: Teoria do Controlador Proporcional, Integral e Derivativo (PID)",
          "Sintonia dos Parâmetros Kp, Ki e Kd no Controle de Linha",
          "Robôs Manipuladores Articulados: Graus de Liberdade e Cinemática Direta",
          "Comunicação Sem Fio em Robótica: Bluetooth (HC-05/06) e Módulos NRF24L01",
          "Introdução à Internet das Coisas (IoT) com ESP32 e Robótica Conectada",
          "Robótica Colaborativa (Cobots) e Segurança na Indústria 4.0"
        ]
      }
    ]
  },
  {
    id: "design-de-interface",
    name: "Design de Interface",
    category: "Formação Profissional e Projetos",
    description: "Design de Experiência do Usuário (UX), Design de Interface (UI), heurísticas de Nielsen, wireframing e design systems.",
    iconName: "Layout",
    color: "from-fuchsia-600 to-pink-600",
    accentColor: "fuchsia",
    progressPercent: 77,
    modules: [
      {
        title: "Fundamentos de UI/UX e Pesquisa com Usuários",
        description: "Diferença entre UI e UX, duplo diamante, personas e jornadas do usuário.",
        topics: [
          "Diferenças Fundamentais entre User Experience (UX) e User Interface (UI)",
          "A Metodologia do Design Thinking e o Modelo do Duplo Diamante",
          "Pesquisa com Usuários (User Research): Métodos Qualitativos e Quantitativos",
          "Construção de Personas Baseadas em Dados de Usuários Reais",
          "Mapeamento da Jornada do Usuário (Customer Journey Map) e Pontos de Dor",
          "Mapas de Empatia para Compreensão de Sentimentos e Necessidades",
          "Benchmarking Competitivo e Análise de Soluções Existentes no Mercado",
          "Arquitetura de Informação: Organização Hierárquica e Rotulagem de Conteúdos",
          "Card Sorting: Métodos Aberto e Fechado para Validação de Categorias",
          "User Flows e Fluxogramas de Navegação entre Telas"
        ]
      },
      {
        title: "Heurísticas de Usabilidade e Acessibilidade",
        description: "10 Heurísticas de Nielsen, leis da psicologia aplicada e acessibilidade visual.",
        topics: [
          "As 10 Heurísticas de Usabilidade de Jakob Nielsen: Visibilidade do Status",
          "Heurísticas de Nielsen: Correspondência com o Mundo Real e Controle do Usuário",
          "Heurísticas de Nielsen: Consistência, Padrões e Prevenção de Erros",
          "Heurísticas de Nielsen: Reconhecimento em vez de Memorização e Flexibilidade",
          "Heurísticas de Nielsen: Estética Minimalista e Recuperação de Erros",
          "Lei de Fitts: Tempo e Distância de Aquisição de Alvos na Interface",
          "Lei de Hick: Tempo de Decisão em Função da Quantidade de Opções",
          "Efeito de Posição Serial: Efeitos de Primazia e Recência na Memória",
          "Teoria da Carga Cognitiva e Simplificação de Tarefas Complexas",
          "Acessibilidade de Cores: Contraste WCAG AA/AAA para Baixa Visão e Daltonismo"
        ]
      },
      {
        title: "Teoria Visual, Tipografia e Teoria das Cores",
        description: "Psicologia das cores, escalas tipográficas, grid layout e hierarquia visual.",
        topics: [
          "Psicologia e Significado das Cores na Interface Digital",
          "Círculo Cromático: Esquemas de Cores Monocromático, Análogo e Complementar",
          "Definição de Paletas de Cores Funcionais: Primária, Secundária, Superfície e Feedback",
          "Anatomia Tipográfica: Serif, Sans-serif, Display e Monospaced",
          "Escala Tipográfica Modular e Hierarquia de Tamanhos e Pesos",
          "Legibilidade Tipográfica: Altura-x, Entrelinha (Line-height) e Kerning",
          "Hierarquia Visual: Escala, Contraste, Espaçamento e Peso Visual",
          "Sistemas de Grids: Grid de 8 Pontos (8-Point Grid System)",
          "Uso do Espaço em Branco (Negative Space) para Respiração do Conteúdo",
          "Microcópia (UX Writing): Redação Clara de Botões, Mensagens de Erro e Placeholders"
        ]
      },
      {
        title: "Prototipação, Wireframes e Ferramentas (Figma)",
        description: "Wireframes de baixa a alta fidelidade, componentes e protótipos navegáveis.",
        topics: [
          "Wireframes de Baixa Fidelidade: Esboços em Papel e Estruturação de Layout",
          "Wireframes de Média Fidelidade: Definição Espacial e Distribuição de Elementos",
          "Interfaces no Figma: Frames, Formas Vetoriais e Painéis de Camadas",
          "O Poder do Auto Layout no Figma para Criação de Interfaces Responsivas",
          "Criação e Gestão de Componentes Reutilizáveis no Figma",
          "Variantes de Componentes e Propriedades Booleanas e de Texto",
          "Construção de Protótipos Interativos com Transições e Conexões",
          "Microinterações e Smart Animate para Feedbacks Visuais Suaves",
          "Organização de Bibliotecas de Estilos Compartilhados no Figma",
          "Handoff de Design para Desenvolvedores: Exportação de Assets e Tokens de Design"
        ]
      },
      {
        title: "Design Systems, Testes com Usuários e Métricas",
        description: "Atomic design, testes de usabilidade práticos e métricas de satisfação.",
        topics: [
          "O Conceito de Design System e sua Importância na Consistência de Produtos",
          "Metodologia Atomic Design de Brad Frost: Átomos, Moléculas e Organismos",
          "Design Tokens: Padronização de Cores, Tipografia, Espaçamentos e Sombras",
          "Criação de Guia de Estilo (Style Guide) e Documentação de Componentes",
          "Planejamento de Testes de Usabilidade Moderados e Não-Moderados",
          "Roteiro de Tarefas para Teste de Usabilidade com Usuários Finais",
          "Técnica Think Aloud (Pensar em Voz Alta) durante a Execução de Tarefas",
          "Métricas de Usabilidade: System Usability Scale (SUS) e Net Promoter Score (NPS)",
          "Testes A/B: Formulação de Hipóteses e Comparação de Desempenho de Telas",
          "Evolução Contínua da Interface com Base em Mapas de Calor (Heatmaps) e Gravações"
        ]
      }
    ]
  },
  {
    id: "empreendedorismo-social",
    name: "Projeto de Empreendedorismo Social e Economia Solidária",
    category: "Formação Profissional e Projetos",
    description: "Modelos de negócios de impacto socioambiental, finanças solidárias, cooperativismo e Social Business Canvas.",
    iconName: "TrendingUp",
    color: "from-purple-600 to-indigo-600",
    accentColor: "purple",
    progressPercent: 79,
    modules: [
      {
        title: "Fundamentos do Empreendedorismo Social e Problemas Coletivos",
        description: "Diferença entre terceiro setor, filantropia e negócios sociais autossustentáveis.",
        topics: [
          "Origens e Conceito de Negócios Sociais segundo Muhammad Yunus",
          "Distinção entre Negócios Tradicionais, Filantropia Assistencialista e Negócios de Impacto",
          "Mapeamento de Dores Comunitárias e Problemas Socioambientais Locais",
          "Teoria da Mudança: Mapeando Insumos, Atividades, Produtos, Resultados e Impacto",
          "Os 17 Objetivos de Desenvolvimento Sustentável (ODS) da ONU como Guia de Projetos",
          "Inovação Social: Novas Respostas para Desafios de Vulnerabilidade e Renda",
          "Liderança Comunitária e Empoderamento Local na Gestão de Projetos",
          "Ética, Transparência e Prestação de Contas em Iniciativas Comunitárias",
          "Casos Emblemáticos de Empreendimentos Sociais no Brasil e no Mundo",
          "Diagnóstico Participativo com Moradores e Coleta de Demandas Reais"
        ]
      },
      {
        title: "Economia Solidária, Cooperativismo e Governança Democrática",
        description: "Princípios da economia solidária de Paul Singer e autogestão coletiva.",
        topics: [
          "Bases Conceituais da Economia Solidária formuladas por Paul Singer",
          "Princípios Internacionais do Cooperativismo da Aliança Cooperativa Internacional (ACI)",
          "Princípio Democrático: 'Um Cooperado, um Voto' versus Voto por Capital",
          "Autogestão Coletiva e Tomada de Decisão em Assembleias Gerais",
          "Estrutura e Funcionamento de Associações Comunitárias sem Fins Lucrativos",
          "Comércio Justo (Fair Trade) e Remuneração Digna de Produtores Locais",
          "Consumo Consciente e Fortalecimento dos Circuitos Curtos de Comercialização",
          "Resolução Pacífica de Conflitos Internos em Empreendimentos Coletivos",
          "Distribuição Equitativa de Sobras Financeiras em Cooperativas",
          "Legislação Brasileira do Cooperativismo (Lei 5.764/1971) e Marco Regulatório"
        ]
      },
      {
        title: "Modelagem de Negócios: O Social Business Canvas",
        description: "Adaptação do Canvas tradicional para mensuração e geração de impacto social.",
        topics: [
          "Visão Geral dos 9 Blocos do Social Business Model Canvas",
          "Bloco 1: Problema Social Específico e População em Situação de Vulnerabilidade",
          "Bloco 2: Proposta de Valor Social e Diferencial de Solução Comunitária",
          "Bloco 3: Segmento de Beneficiários versus Segmento de Clientes Pagantes",
          "Bloco 4: Canais de Relacionamento e Distribuição Acessíveis na Comunidade",
          "Bloco 5: Atividades-Chave e Recursos Estratégicos para Operação Sustentável",
          "Bloco 6: Parcerias Estratégicas com Poder Público, Universidades e ONGs",
          "Bloco 7: Estrutura de Custos Operacionais e Minimização de Desperdícios",
          "Bloco 8: Fontes de Receita e Modelos de Sustentabilidade Financeira",
          "Bloco 9: Mensuração de Métricas de Impacto Social Tangíveis e Intangíveis"
        ]
      },
      {
        title: "Finanças Solidárias, Moedas Sociais e Captação de Recursos",
        description: "Bancos comunitários, microcrédito produtivo orientado e crowdfunding.",
        topics: [
          "O Conceito de Finanças Solidárias e Democratização do Crédito",
          "História e Funcionamento dos Bancos Comunitários de Desenvolvimento (BCDs)",
          "O Caso do Banco Palmas e a Emissão de Moedas Sociais Circulantes",
          "Microcrédito Produtivo Orientado para Empreendedores de Baixa Renda",
          "Fundos Rotativos Solidários Geridos por Coletivos Locais",
          "Estratégias de Captação de Recursos: Editais Públicos e Chamadas de Fomento",
          "Financiamento Coletivo (Crowdfunding): Campanhas Tudo-ou-Nada e Recorrentes",
          "Captação com Doadores Individuais e Responsabilidade Social Corporativa (ESG)",
          "Gestão Financeira Básica: Fluxo de Caixa, DRE Simplificado e Ponto de Equilíbrio",
          "Reinvestimento dos Excedentes no Próprio Bem-Estar Comunitário"
        ]
      },
      {
        title: "Gestão de Projetos, Comunicação e Avaliação de Impacto",
        description: "Metodologia 5W2H, pitch de impacto, comunicação comunitária e avaliação pós-projeto.",
        topics: [
          "Elaboração de Planos de Ação Operacionais utilizando a Ferramenta 5W2H",
          "Matriz de Riscos Socioambientais e Planos de Mitigação de Contingências",
          "Comunicação Comunitária: Linguagem Clara, Rádios Locais e Redes Sociais",
          "Construção de Narrativas de Impacto (Storytelling) para Engajamento de Apoiadores",
          "Estruturação de um Pitch de Impacto Social para Bancas e Investidores",
          "Indicadores de Sucesso: Métricas de Curto, Médio e Longo Prazo",
          "Metodologia SROI (Social Return on Investment): Retorno Social sobre Investimento",
          "Relatórios de Sustentabilidade e Transparência Pública para a Comunidade",
          "Escala de Impacto: Como Replicar Soluções Comunitárias para Outros Territórios",
          "Encerramento de Ciclos de Projeto e Aprendizado Contínuo com Lições Aprendidas"
        ]
      }
    ]
  },
  {
    id: "lingua-inglesa",
    name: "Língua Inglesa",
    category: "Linguagens",
    description: "Gramática comunicativa, reading strategies, verb tenses, cognates, modal verbs, vocabulary e escrita acadêmica.",
    iconName: "Languages",
    color: "from-blue-600 to-sky-600",
    accentColor: "blue",
    progressPercent: 70,
    modules: [
      {
        title: "Fundamentos Gramaticais e Tempos Verbais do Presente",
        description: "Verb to be, Simple Present, Present Continuous e advérbios de frequência.",
        topics: [
          "Verb to Be: Formas Afirmativa, Negativa e Interrogativa no Presente",
          "Simple Present: Regras de Terceira Pessoa do Singular (He, She, It) com -s, -es, -ies",
          "Auxiliares Do e Does em Perguntas e Negações no Presente",
          "Advérbios de Frequência (Always, Usually, Sometimes, Never) e Posição na Frase",
          "Present Continuous: Estrutura Be + Verbo com -ing para Ações em Andamento",
          "Diferenças Cruciais entre Simple Present e Present Continuous",
          "Stative Verbs versus Dynamic Verbs: Verbos que Não Aceitam Forma Contínua",
          "Pronomes Pessoais (Subject and Object Pronouns) e Casos de Uso",
          "Adjetivos e Pronomes Possessivos (My, Mine, Your, Yours) e Caso Genitivo ('s)",
          "Imperativo em Instruções Técnicas, Manuais e Receitas"
        ]
      },
      {
        title: "Tempos Verbais do Passado e Narração",
        description: "Simple Past (verbos regulares e irregulares), Past Continuous e Used to.",
        topics: [
          "Simple Past: Regras de Formação dos Verbos Regulares com terminação -ed",
          "Pronúncia das Terminações -ed: Sons /t/, /d/ e /ɪd/",
          "Verbos Irregulares Mais Frequentes no Simple Past e Estratégias de Fixação",
          "Auxiliar Did em Perguntas e Negações no Passado e a Volta do Verbo ao Infinitivo",
          "Past Continuous: Ações que Estavam em Andamento no Passado com Was e Were",
          "Articulação entre Simple Past e Past Continuous com When e While",
          "Estrutura 'Used to' para Hábitos e Estados Passados que Não Ocorrem Mais",
          "Substantivos Contáveis e Incontáveis: Regras de Plural e Partitivos",
          "Quantificadores: Uso de Much, Many, A lot of, Few e Little",
          "Preposições de Tempo e Lugar Essenciais: In, On e At"
        ]
      },
      {
        title: "Tempos Perfeitos, Futuro e Modais",
        description: "Present Perfect, Past Perfect, formas de futuro e verbos modais.",
        topics: [
          "Present Perfect Simple: Estrutura Have/Has + Particípio Passado",
          "Uso do Present Perfect para Experiências de Vida com Ever e Never",
          "Diferença Crucial entre Simple Past (Tempo Definido) e Present Perfect (Tempo Indefinido)",
          "Present Perfect com Since (Ponto Inicial) e For (Duração)",
          "Uso dos Marcadores Temporais: Just, Already e Yet com Present Perfect",
          "Formas de Futuro: Will (Decisões Espontâneas e Previsões) versus Going to (Planos)",
          "Past Perfect: Ação Anterior a Outro Evento no Passado com Had",
          "Verbos Modais de Capacidade e Permissão: Can, Could e Be Able To",
          "Verbos Modais de Obrigação e Proibição: Must, Have To e Mustn't",
          "Verbos Modais de Conselho e Probabilidade: Should, Ought To, May e Might"
        ]
      },
      {
        title: "Estratégias de Leitura e Vocabulário Técnico",
        description: "Skimming, scanning, falsos cognatos, afixos e interpretação de textos do ENEM.",
        topics: [
          "Técnica de Leitura Skimming: Como Capturar a Ideia Central de um Texto em Inglês",
          "Técnica de Leitura Scanning: Localização Rápida de Informações Específicas e Dados",
          "Identificação de Palavras Cognatas Verdadeiras no Inglês e Português",
          "Cuidado com Falsos Amigos (False Friends / Falsos Cognatos) Frequentes",
          "Formação de Palavras por Prefixos e Sufixos em Inglês",
          "Graus dos Adjetivos: Comparativo de Igualdade, Superioridade e Inferioridade",
          "Graus dos Adjetivos: Superlativo com -est e Most",
          "Vocabulário Técnico de Tecnologia da Informação e Computação",
          "Conectivos Discursivos (Linking Words) para Coesão Textual (However, Therefore, Although)",
          "Resolução de Questões de Interpretação Textual do ENEM e Vestibulares"
        ]
      },
      {
        title: "Estruturas Avançadas, Condicionais e Voz Passiva",
        description: "Zero, First, Second e Third Conditionals, Passive Voice e Phrasal Verbs.",
        topics: [
          "Zero Conditional: Fatos Científicos e Leis Universais (If + Present, Present)",
          "First Conditional: Condições Reais e Possíveis no Futuro (If + Present, Will)",
          "Second Conditional: Situações Hipotéticas no Presente (If + Past, Would)",
          "Third Conditional: Hipóteses Impossíveis sobre o Passado (If + Past Perfect, Would Have)",
          "Passive Voice: Razões de Uso no Texto Científico e Jornalístico",
          "Transformação da Voz Ativa para Voz Passiva no Presente e no Passado",
          "Question Tags: Regras de Confirmação no Final das Frases",
          "Relative Clauses: Defining versus Non-Defining com Who, Which e That",
          "Phrasal Verbs Mais Comuns no Cotidiano e na Tecnologia (Turn on, Look for, Give up)",
          "Inglês Instrumental e Redação de E-mails e Resumos Acadêmicos (Abstracts)"
        ]
      }
    ]
  }
];

function generateSummaryForTopic(disciplineName, topicTitle, moduleTitle) {
  return `O estudo analítico e conceitual de "${topicTitle}" integra o núcleo fundamental de "${disciplineName}", mais especificamente na área de "${moduleTitle}".

1. Contextualização Histórica e Epistemológica:
A formalização sistemática de ${topicTitle} respondeu historicamente à necessidade de estruturar procedimentos analíticos claros, superando métodos empíricos fragmentados e consolidando axiomas indispensáveis na literatura acadêmica de ${disciplineName}. Pesquisadores e teóricos clássicos estabeleceram leis de causalidade, postulados lógicos e padrões operacionais que permanecem válidos e aplicados nos manuais contemporâneos.

2. Fundamentação Teórica e Mecanismos Operacionais:
Em sua dimensão técnica estrutural, ${topicTitle} fundamenta-se na interdependência de variáveis críticas e na conservação de princípios de consistência interna. Os mecanismos operacionais desdobram-se através de etapas encadeadas com rigor formal:
- Definição precisa de termos, conceitos primitivos e hipóteses de trabalho;
- Aplicação de regras de inferência, equações determinísticas ou diretrizes sintáticas padronizadas;
- Análise de estabilidade, verificabilidade e refutabilidade empírica diante de cenários práticos.

3. Exemplos Práticos e Aplicações Reais:
No cotidiano produtivo, na pesquisa científica e nos projetos tecnológicos da sociedade moderna, o domínio consistente de ${topicTitle} viabiliza:
- Diagnóstico preciso de falhas, anomalias ou lacunas em sistemas complexos;
- Otimização do fluxo de trabalho e aumento mensurável de produtividade e segurança técnica;
- Tomada de decisão fundamentada em evidências sólidas e conformidade com as melhores práticas da área.

4. Síntese Didática e Pontos de Atenção:
Para consolidação do aprendizado, é vital não incorrer em confusões terminológicas comuns, exercitar o encadeamento dedutivo passo a passo e conectar este conteúdo aos tópicos subsequentes do currículo de ${disciplineName}.`;
}

function generateCurriculum() {
  const disciplines = DISCIPLINES_METADATA.map((disc) => {
    let globalTopicIndex = 1;
    const modules = disc.modules.map((mod, modIdx) => {
      const contents = mod.topics.map((topicTitle, topicIdx) => {
        const topicId = `${disc.id}-top-${globalTopicIndex}`;
        const summary = generateSummaryForTopic(disc.name, topicTitle, mod.title);
        
        const contentItem = {
          id: topicId,
          disciplineId: disc.id,
          title: topicTitle,
          subtitle: `${mod.title} • Aula ${globalTopicIndex} de 50 de ${disc.name}`,
          estimatedMinutes: 25 + ((globalTopicIndex * 3) % 15),
          completed: false,
          prerequisites: topicIdx > 0 ? [mod.topics[topicIdx - 1]] : (modIdx > 0 ? [disc.modules[modIdx - 1].topics[0]] : ["Fundamentos de Ensino Médio"]),
          summary,
          guidedResearch: {
            guidingQuestions: [
              `Quais são os pressupostos epistemológicos e teóricos essenciais de "${topicTitle}" em ${disc.name}?`,
              `Como a aplicação prática de "${topicTitle}" resolve problemas concretos no cenário profissional contemporâneo?`,
              `Quais são os equívocos ou armadilhas conceituais mais frequentes identificados na literatura sobre este tópico?`
            ],
            deepDiveNotes: `Aprofunde a leitura correlacionando "${topicTitle}" com os princípios gerais de ${disc.name}. Observe as interfaces interdisciplinares e a modelagem formal recomendada nas bibliografias acadêmicas de referência.`,
            suggestedSources: [
              `Compêndio Universitário de ${disc.name} - Edição Atualizada 2026`,
              `Artigos e Periódicos Acadêmicos da Sociedade Brasileira de ${disc.name}`
            ],
            practicalChallenge: `Desenvolva um estudo de caso ou resolução analítica demonstrando o funcionamento de "${topicTitle}" aplicado a uma situação real ou problema prático da área.`
          },
          flashcards: [
            {
              id: `fc-${disc.id}-${globalTopicIndex}-1`,
              question: `Qual é o princípio fundamental e definição central de "${topicTitle}"?`,
              answer: `Define-se como o conjunto de preceitos estruturais e procedimentais que regem ${topicTitle} no âmbito de ${disc.name}, assegurando coerência analítica e rigor de aplicação.`,
              difficulty: "facil",
              masteryScore: 85
            },
            {
              id: `fc-${disc.id}-${globalTopicIndex}-2`,
              question: `Qual é a principal aplicação técnica ou utilidade prática de "${topicTitle}"?`,
              answer: `Permite diagnosticar, modelar e solucionar demandas complexas em ${disc.name}, garantindo conformidade com padrões científicos e profissionais.`,
              difficulty: "medio",
              masteryScore: 70
            }
          ],
          videos: [
            {
              id: `v-${disc.id}-${globalTopicIndex}-1`,
              title: `${topicTitle}: Teoria e Fundamentação Completa`,
              duration: "18:25",
              channel: `ProfeIA • ${disc.name}`,
              description: `Aula aprofundada explorando os conceitos essenciais, deduções e contextualização de ${topicTitle}.`
            },
            {
              id: `v-${disc.id}-${globalTopicIndex}-2`,
              title: `Exercícios e Casos Práticos: ${topicTitle}`,
              duration: "14:40",
              channel: "Plantão Pedagógico ProfeIA",
              description: `Resolução comentada passo a passo de exercícios e análises aplicadas de ${topicTitle}.`
            }
          ],
          mentalMap: {
            root: {
              id: `mm-${disc.id}-${globalTopicIndex}-root`,
              label: topicTitle,
              color: "#4f46e5",
              children: [
                { id: `mm-${disc.id}-${globalTopicIndex}-fund`, label: "Fundamentos e Conceitos Básicos" },
                { id: `mm-${disc.id}-${globalTopicIndex}-met`, label: "Metodologia e Procedimentos" },
                { id: `mm-${disc.id}-${globalTopicIndex}-ap`, label: "Aplicações Técnicas e Práticas" }
              ]
            }
          },
          conceptMap: {
            relations: [
              { from: topicTitle, relationship: "fundamenta-se em", to: mod.title },
              { from: topicTitle, relationship: "integra o corpus de", to: disc.name }
            ]
          }
        };

        globalTopicIndex++;
        return contentItem;
      });

      return {
        id: `${disc.id}-mod-${modIdx + 1}`,
        disciplineId: disc.id,
        title: mod.title,
        description: mod.description,
        contents
      };
    });

    return {
      id: disc.id,
      name: disc.name,
      category: disc.category,
      description: disc.description,
      iconName: disc.iconName,
      color: disc.color,
      accentColor: disc.accentColor,
      progressPercent: disc.progressPercent,
      modules
    };
  });

  return disciplines;
}

const allDisciplines50 = generateCurriculum();

// Verify that all 15 disciplines have exactly 50 topics
allDisciplines50.forEach(d => {
  const totalTopics = d.modules.reduce((acc, m) => acc + m.contents.length, 0);
  console.log(`Discipline: ${d.name} (${d.id}) -> ${d.modules.length} modules, ${totalTopics} topics`);
});

const fileHeader = `import { Discipline } from "../types";\n\nexport const initialDisciplines: Discipline[] = `;
const tsContent = fileHeader + JSON.stringify(allDisciplines50, null, 2) + ";\n";

fs.writeFileSync('src/data/disciplinesData.ts', tsContent, 'utf8');
console.log('Successfully written 15 disciplines with 50 topics each to src/data/disciplinesData.ts');
