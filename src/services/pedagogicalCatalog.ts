export interface DisciplinePedagogicalProfile {
  id: string;
  name: string;
  areaType: "exatas" | "biologicas" | "humanas" | "linguagens" | "tecnicas";
  cduPrefix: string;
  fieldArea: string;
  realReferences: string[];
  realSources: string[];
  coreMethodologies: string[];
  hasFormulas: boolean;
}

export const DISCIPLINE_PROFILES: Record<string, DisciplinePedagogicalProfile> = {
  matematica: {
    id: "matematica",
    name: "Matemática",
    areaType: "exatas",
    cduPrefix: "CDU 51",
    fieldArea: "Matemática Pura e Aplicada • Ensino Médio",
    realReferences: [
      "IEZZI, Gelson et al. Fundamentos de Matemática Elementar. 9. ed. São Paulo: Atual, 2013.",
      "LIMA, Elon Lages et al. A Matemática do Ensino Médio. 11. ed. Rio de Janeiro: SBM, 2016.",
      "DANTE, Luiz Roberto. Matemática: Contexto & Aplicações. 3. ed. São Paulo: Ática, 2016.",
      "BRASIL. Ministério da Educação. Base Nacional Comum Curricular (BNCC): Matemática e suas Tecnologias. Brasília: MEC, 2018."
    ],
    realSources: [
      "Portal da Matemática OBMEP (IMPA) — Videoaulas e Apostilas Oficiais",
      "Sociedade Brasileira de Matemática (SBM) — Revista do Professor de Matemática",
      "Fundamentos de Matemática Elementar (Gelson Iezzi) e Coleção IMPA"
    ],
    coreMethodologies: [
      "Identificação dos coeficientes, dados numéricos e incógnitas do problema",
      "Aplicação das propriedades algébricas, geométricas ou funcionais com verificação de domínio",
      "Resolução passo a passo e interpretação do significado matemático do resultado"
    ],
    hasFormulas: true
  },
  fisica: {
    id: "fisica",
    name: "Física",
    areaType: "exatas",
    cduPrefix: "CDU 53",
    fieldArea: "Física Clássica e Moderna • Ciências da Natureza",
    realReferences: [
      "HALLIDAY, David; RESNICK, Robert; WALKER, Jearl. Fundamentos de Física. 10. ed. Rio de Janeiro: LTC, 2016.",
      "RAMALHO JUNIOR, Francisco; FERRARO, Nicolau Gilberto; SOARES, Paulo Antônio de Toledo. Os Fundamentos da Física. 11. ed. São Paulo: Moderna, 2015.",
      "HEWITT, Paul G. Física Conceitual. 12. ed. Porto Alegre: Bookman, 2015.",
      "TIPLER, Paul A.; MOSCA, Gene. Física para Cientistas e Engenheiros. 6. ed. Rio de Janeiro: LTC, 2009."
    ],
    realSources: [
      "Sociedade Brasileira de Física (SBF) — Revista Brasileira de Ensino de Física (SciELO)",
      "Simulações Interativas PhET Colorado (Física Universitária e Ensino Médio)",
      "Acervo de Física Conceitual (Paul Hewitt) e Fundamentos de Física (Halliday & Resnick)"
    ],
    coreMethodologies: [
      "Levantamento das grandezas físicas e conversão para o Sistema Internacional de Unidades (SI)",
      "Representação vetorial ou esquemática das forças, movimentos, trocas de calor ou campos",
      "Aplicação das leis físicas pertinentes e interpretação física do valor numérico obtido"
    ],
    hasFormulas: true
  },
  biologia: {
    id: "biologia",
    name: "Biologia",
    areaType: "biologicas",
    cduPrefix: "CDU 57",
    fieldArea: "Ciências Biológicas • Citologia, Genética, Fisiologia e Ecologia",
    realReferences: [
      "URRY, Lisa A. et al. Biologia de Campbell. 12. ed. Porto Alegre: Artmed, 2022.",
      "AMABIS, José Mariano; MARTHO, Gilberto Rodrigues. Biologia Moderna. São Paulo: Moderna, 2016.",
      "ALBERTS, Bruce et al. Biologia Molecular da Célula. 6. ed. Porto Alegre: Artmed, 2017.",
      "LOPES, Sônia; ROSSO, Sergio. Bio: Volume Único. 4. ed. São Paulo: Saraiva, 2018."
    ],
    realSources: [
      "Biologia de Campbell (Artmed) e Biologia Molecular da Célula (Alberts)",
      "Portal SciELO Brasil — Periódicos de Ciências Biológicas e Saúde",
      "Fundação Oswaldo Cruz (Fiocruz) e Instituto Butantan — Divulgação Científica"
    ],
    coreMethodologies: [
      "Identificação das estruturas celulares, biomoléculas, tecidos ou níveis de organização envolvidos",
      "Análise das etapas do processo fisiológico, metabólico, genético ou ecológico",
      "Relação direta entre estrutura morfofuncional, mecanismo biológico e importância adaptativa"
    ],
    hasFormulas: false
  },
  geografia: {
    id: "geografia",
    name: "Geografia",
    areaType: "humanas",
    cduPrefix: "CDU 91",
    fieldArea: "Geografia Física, Humana e Geopolítica • Ciências Humanas",
    realReferences: [
      "SANTOS, Milton. A Natureza do Espaço: Técnica e Tempo, Razão e Emoção. 4. ed. São Paulo: Edusp, 2006.",
      "ROSS, Jurandyr Luciano Sanches (org.). Geografia do Brasil. 6. ed. São Paulo: Edusp, 2019.",
      "MOREIRA, João Carlos; SENE, Eustáquio de. Geografia Geral e do Brasil. 4. ed. São Paulo: Scipione, 2018.",
      "TEIXEIRA, Wilson et al. Decifrando a Terra. 2. ed. São Paulo: Companhia Editora Nacional, 2009."
    ],
    realSources: [
      "Instituto Brasileiro de Geografia e Estatística (IBGE) — Atlas Geográfico Escolar e Censo Demográfico",
      "Instituto de Pesquisa Econômica Aplicada (IPEA) e INPE (Monitoramento Ambiental)",
      "Obras de Milton Santos, Aziz Ab'Sáber e Jurandyr Ross (Edusp)"
    ],
    coreMethodologies: [
      "Leitura espacial da paisagem, do território e das escalas local, regional e global",
      "Articulação entre dinâmicas físico-naturais (clima, relevo, hidrografia) e ações antrópicas",
      "Análise crítica de indicadores socioeconômicos, demográficos, mapas e conflitos geopolíticos"
    ],
    hasFormulas: false
  },
  sociologia: {
    id: "sociologia",
    name: "Sociologia",
    areaType: "humanas",
    cduPrefix: "CDU 301",
    fieldArea: "Ciências Sociais, Antropologia e Ciência Política • Ciências Humanas",
    realReferences: [
      "DURKHEIM, Émile. As Regras do Método Sociológico. 4. ed. São Paulo: Martins Fontes, 2014.",
      "WEBER, Max. Economia e Sociedade: Fundamentos da Sociologia Compreensiva. Brasília: Editora UnB, 2012.",
      "GIDDENS, Anthony. Sociologia. 6. ed. Porto Alegre: Penso, 2012.",
      "SILVA, Afrânio et al. Sociologia em Movimento. 2. ed. São Paulo: Moderna, 2016."
    ],
    realSources: [
      "Clássicos da Sociologia: Émile Durkheim, Max Weber e Karl Marx",
      "Portal SciELO — Revista Brasileira de Ciências Sociais (ANPOCS)",
      "IBGE (Síntese de Indicadores Sociais) e IPEA (Retratos das Desigualdades no Brasil)"
    ],
    coreMethodologies: [
      "Desnaturalização e estranhamento dos fenômenos sociais, culturais e institucionais",
      "Contextualização histórica das relações de poder, trabalho, cultura e estratificação social",
      "Comparação entre matrizes teóricas clássicas e contemporâneas na interpretação da realidade"
    ],
    hasFormulas: false
  },
  historia: {
    id: "historia",
    name: "História",
    areaType: "humanas",
    cduPrefix: "CDU 93/99",
    fieldArea: "Historiografia Geral e do Brasil • Ciências Humanas",
    realReferences: [
      "FAUSTO, Boris. História do Brasil. 14. ed. São Paulo: Edusp, 2013.",
      "SCHWARCZ, Lilia Moritz; STARLING, Heloisa Murgel. Brasil: Uma Biografia. São Paulo: Companhia das Letras, 2015.",
      "HOBSBAWM, Eric. A Era das Revoluções / A Era dos Extremos. São Paulo: Companhia das Letras, 2014.",
      "VAINFAS, Ronaldo et al. História: Volume Único. São Paulo: Saraiva, 2018."
    ],
    realSources: [
      "Biblioteca Nacional Digital e Arquivo Nacional do Brasil — Documentos Históricos Primários",
      "FGV CPDOC — Atlas Histórico do Brasil e Acervo Republicano",
      "Historiografia de referência: Boris Fausto, Lilia Schwarcz, José Murilo de Carvalho e Eric Hobsbawm"
    ],
    coreMethodologies: [
      "Contextualização temporal e espacial dos processos históricos (evitando o anacronismo)",
      "Análise crítica de fontes históricas materiais, escritas e iconográficas",
      "Identificação de permanências, rupturas, múltiplos sujeitos históricos e relações político-econômicas"
    ],
    hasFormulas: false
  },
  "lingua-portuguesa-redacao": {
    id: "lingua-portuguesa-redacao",
    name: "Língua Portuguesa e Redação",
    areaType: "linguagens",
    cduPrefix: "CDU 811.134.3",
    fieldArea: "Linguística, Gramática Normativa e Produção Textual • Linguagens",
    realReferences: [
      "BECHARA, Evanildo. Moderna Gramática Portuguesa. 39. ed. Rio de Janeiro: Nova Fronteira, 2019.",
      "CUNHA, Celso; CINTRA, Lindley. Nova Gramática do Português Contemporâneo. 7. ed. Rio de Janeiro: Lexikon, 2016.",
      "FIORIN, José Luiz; SAVIOLI, Francisco Platão. Para Entender o Texto: Leitura e Redação. 17. ed. São Paulo: Ática, 2007.",
      "KOCH, Ingedore Villaça; ELIAS, Vanda Maria. Ler e Escrever: Estratégias de Produção Textual. São Paulo: Contexto, 2015."
    ],
    realSources: [
      "Cartilha do Participante — A Redação no ENEM (INEP / Ministério da Educação)",
      "Academia Brasileira de Letras (ABL) — Vocabulário Ortográfico da Língua Portuguesa (VOLP)",
      "Moderna Gramática Portuguesa (Evanildo Bechara) e Obras de Coesão Textual (Ingedore Koch)"
    ],
    coreMethodologies: [
      "Análise morfossintática e semântica dos enunciados em função do contexto comunicativo",
      "Identificação de mecanismos de coesão referencial, coesão sequencial e progressão temática",
      "Construção argumentativa estruturada em tese, repertório sociocultural legítimo e proposta de intervenção"
    ],
    hasFormulas: false
  },
  "lingua-inglesa": {
    id: "lingua-inglesa",
    name: "Língua Inglesa",
    areaType: "linguagens",
    cduPrefix: "CDU 811.111",
    fieldArea: "Língua Estrangeira Moderna e Leitura Instrumental • Linguagens",
    realReferences: [
      "MURPHY, Raymond. English Grammar in Use. 5. ed. Cambridge: Cambridge University Press, 2019.",
      "SWAN, Michael. Practical English Usage. 4. ed. Oxford: Oxford University Press, 2016.",
      "SOUZA, Adriana Grade Fiori et al. Leitura em Língua Inglesa: Uma Abordagem Instrumental. São Paulo: Disal, 2010.",
      "BRASIL. Ministério da Educação. Base Nacional Comum Curricular (BNCC): Língua Inglesa. Brasília: MEC, 2018."
    ],
    realSources: [
      "Cambridge Dictionary & Oxford Learner's Dictionaries — Referência Lexical e Gramatical",
      "English Grammar in Use (Raymond Murphy — Cambridge University Press)",
      "British Council LearnEnglish e Provas Anteriores de Língua Inglesa do ENEM (INEP)"
    ],
    coreMethodologies: [
      "Reconhecimento da estrutura gramatical (tempo verbal, auxiliar, modal ou conectivo) no contexto comunicativo",
      "Aplicação das estratégias de leitura instrumental (Skimming, Scanning, Cognatos e Inferência Contextual)",
      "Distinção de falsos cognatos (false friends) e adequação de registro formal ou técnico"
    ],
    hasFormulas: false
  },
  "analise-projeto-sistemas": {
    id: "analise-projeto-sistemas",
    name: "Análise e Projeto de Sistemas",
    areaType: "tecnicas",
    cduPrefix: "CDU 004.41",
    fieldArea: "Engenharia de Software e Modelagem de Sistemas • Formação Técnica",
    realReferences: [
      "SOMMERVILLE, Ian. Engenharia de Software. 10. ed. São Paulo: Pearson, 2019.",
      "PRESSMAN, Roger S.; MAXIM, Bruce R. Engenharia de Software: Uma Abordagem Profissional. 9. ed. Porto Alegre: AMGH, 2021.",
      "BOOCH, Grady; RUMBAUGH, James; JACOBSON, Ivar. UML: Guia do Usuário. 2. ed. Rio de Janeiro: Elsevier, 2006.",
      "MARTIN, Robert C. Arquitetura Limpa: O Guia do Artesão para Estrutura e Design de Software. Rio de Janeiro: Alta Books, 2019."
    ],
    realSources: [
      "Object Management Group (OMG) — Especificação Oficial UML 2.5",
      "Engenharia de Software (Ian Sommerville / Roger Pressman) e Manifesto Ágil (Agile Alliance)",
      "Guia Oficial do Scrum (Ken Schwaber & Jeff Sutherland — Scrum.org)"
    ],
    coreMethodologies: [
      "Levantamento e classificação precisa de Requisitos Funcionais (RF), Não Funcionais (RNF) e Regras de Negócio",
      "Modelagem estrutural e comportamental utilizando diagramas padronizados da UML e princípios SOLID",
      "Validação da arquitetura de software, padrões de projeto e ciclos iterativos ágeis"
    ],
    hasFormulas: false
  },
  "banco-de-dados": {
    id: "banco-de-dados",
    name: "Banco de Dados",
    areaType: "tecnicas",
    cduPrefix: "CDU 004.65",
    fieldArea: "Sistemas de Bancos de Dados Relacionais e SQL • Formação Técnica",
    realReferences: [
      "ELMASRI, Ramez; NAVATHE, Shamkant B. Sistemas de Banco de Dados. 7. ed. São Paulo: Pearson, 2019.",
      "SILBERSCHATZ, Abraham; KORTH, Henry F.; SUDARSHAN, S. Sistema de Banco de Dados. 7. ed. Rio de Janeiro: LTC, 2020.",
      "HEUSER, Carlos Alberto. Projeto de Banco de Dados. 6. ed. Porto Alegre: Bookman, 2009.",
      "DATE, C. J. Introdução a Sistemas de Bancos de Dados. 8. ed. Rio de Janeiro: Elsevier, 2004."
    ],
    realSources: [
      "Sistemas de Banco de Dados (Elmasri & Navathe) e Projeto de Banco de Dados (Carlos Heuser)",
      "Documentação Oficial PostgreSQL e Padrão ANSI/ISO SQL",
      "Sistema de Banco de Dados (Silberschatz, Korth & Sudarshan)"
    ],
    coreMethodologies: [
      "Modelagem Conceitual (MER/DER), Lógica e Física com definição de Chaves Primárias (PK) e Estrangeiras (FK)",
      "Aplicação das Formas Normais (1FN, 2FN, 3FN) para eliminar redundâncias e anomalias de atualização",
      "Escrita e otimização de comandos SQL (DDL, DML, DQL com JOINs, agregações e transações ACID)"
    ],
    hasFormulas: false
  },
  "desenvolvimento-web": {
    id: "desenvolvimento-web",
    name: "Desenvolvimento Web",
    areaType: "tecnicas",
    cduPrefix: "CDU 004.738.5",
    fieldArea: "Engenharia Front-End, Padrões Web e Aplicações Modernas • Formação Técnica",
    realReferences: [
      "FLANAGAN, David. JavaScript: O Guia Definitivo. 7. ed. Porto Alegre: Bookman, 2021.",
      "DUCKETT, Jon. HTML & CSS: Projete e Construa Websites. Rio de Janeiro: Alta Books, 2016.",
      "MOZILLA DEVELOPER NETWORK. MDN Web Docs: HTML, CSS, HTTP and JavaScript Standards. Mozilla Foundation, 2024.",
      "W3C. World Wide Web Consortium: Web Content Accessibility Guidelines (WCAG) 2.1. W3C Recommendation, 2018."
    ],
    realSources: [
      "MDN Web Docs (Mozilla Developer Network) — Documentação de HTML5, CSS3 e JavaScript ES6+",
      "W3C (World Wide Web Consortium) e Diretrizes de Acessibilidade WCAG",
      "Documentação Oficial do React (react.dev) e TypeScript (typescriptlang.org)"
    ],
    coreMethodologies: [
      "Estruturação semântica do documento HTML5 com foco em acessibilidade (a11y) e SEO",
      "Estilização responsiva utilizando Box Model, Flexbox, CSS Grid e Media Queries",
      "Programação assíncrona, manipulação de eventos/DOM e componentização reativa com estado tipado"
    ],
    hasFormulas: false
  },
  robotica: {
    id: "robotica",
    name: "Robótica",
    areaType: "exatas",
    cduPrefix: "CDU 621.38",
    fieldArea: "Eletroeletrônica, Microcontroladores e Robótica Educacional • Formação Técnica",
    realReferences: [
      "BOYLESTAD, Robert L. Introdução à Análise de Circuitos. 13. ed. São Paulo: Pearson, 2019.",
      "MONK, Simon. Programação com Arduino: Começando com Sketches. 2. ed. Porto Alegre: Bookman, 2017.",
      "MCROBERTS, Michael. Arduino Básico. 2. ed. São Paulo: Novatec, 2015.",
      "CRAIG, John J. Robótica. 3. ed. São Paulo: Pearson, 2012."
    ],
    realSources: [
      "Documentação Oficial Arduino (docs.arduino.cc) e Datasheets do ATmega328P",
      "Introdução à Análise de Circuitos (Robert L. Boylestad) e Arduino Básico (Michael McRoberts)",
      "Olimpíada Brasileira de Robótica (OBR) — Cadernos Técnicos e Tutoriais"
    ],
    coreMethodologies: [
      "Dimensionamento elétrico do circuito aplicando a Lei de Ohm (U = R · i) e cálculo de potência (P = U · i)",
      "Interfaceamento seguro de sensores (analógicos/digitais) e atuadores (Ponte H, PWM, Servos) no microcontrolador",
      "Implementação da lógica embarcada de leitura, filtragem e controle em malha aberta ou fechada"
    ],
    hasFormulas: true
  },
  "design-de-interface": {
    id: "design-de-interface",
    name: "Design de Interface",
    areaType: "tecnicas",
    cduPrefix: "CDU 004.5",
    fieldArea: "Interação Humano-Computador (IHC), UI/UX e Design Systems • Formação Técnica",
    realReferences: [
      "NORMAN, Donald A. O Design do Dia a Dia. Rio de Janeiro: Rocco, 2006.",
      "NIELSEN, Jakob; LORANGER, Hoa. Usabilidade na Web. Rio de Janeiro: Elsevier, 2007.",
      "KRUG, Steve. Não Me Faça Pensar: Uma Abordagem de Bom Senso à Usabilidade na Web. Rio de Janeiro: Alta Books, 2014.",
      "FROST, Brad. Atomic Design. Pittsburgh: Brad Frost Web, 2016."
    ],
    realSources: [
      "Nielsen Norman Group (NN/g) — As 10 Heurísticas de Usabilidade de Jakob Nielsen",
      "W3C WCAG 2.1 — Diretrizes de Contraste e Acessibilidade Digital",
      "Obras de Don Norman (O Design do Dia a Dia), Steve Krug e Brad Frost (Atomic Design)"
    ],
    coreMethodologies: [
      "Pesquisa centrada no usuário (User Research), mapeamento de personas e jornada de uso",
      "Estruturação de hierarquia visual, tipografia, contraste cromático acessível e wireframes",
      "Avaliação heurística de usabilidade (Nielsen), prototipação interativa e componentização em Design System"
    ],
    hasFormulas: false
  },
  "materia-pratica-estagio-tcc": {
    id: "materia-pratica-estagio-tcc",
    name: "Matéria Prática de Estágio e TCC",
    areaType: "tecnicas",
    cduPrefix: "CDU 001.8",
    fieldArea: "Metodologia da Pesquisa Científica, Normas ABNT e Prática Profissional",
    realReferences: [
      "GIL, Antonio Carlos. Como Elaborar Projetos de Pesquisa. 6. ed. São Paulo: Atlas, 2017.",
      "MARCONI, Marina de Andrade; LAKATOS, Eva Maria. Fundamentos de Metodologia Científica. 8. ed. São Paulo: Atlas, 2017.",
      "SEVERINO, Antônio Joaquim. Metodologia do Trabalho Científico. 24. ed. São Paulo: Cortez, 2016.",
      "ASSOCIAÇÃO BRASILEIRA DE NORMAS TÉCNICAS. ABNT NBR 14724 / NBR 6023 / NBR 10520: Trabalhos Acadêmicos, Referências e Citações. Rio de Janeiro: ABNT, 2018-2023."
    ],
    realSources: [
      "Normas Oficiais da ABNT: NBR 14724 (Trabalhos Acadêmicos), NBR 6023 (Referências) e NBR 10520 (Citações)",
      "Como Elaborar Projetos de Pesquisa (Antonio Carlos Gil) e Metodologia Científica (Marconi & Lakatos)",
      "Lei Federal nº 11.788/2008 (Lei do Estágio) e Portal de Periódicos CAPES / SciELO"
    ],
    coreMethodologies: [
      "Delimitação do tema, formulação do problema de pesquisa, hipótese e objetivos (geral e específicos)",
      "Revisão bibliográfica sistemática em bases indexadas e aplicação das normas ABNT (NBR 14724, 10520 e 6023)",
      "Coleta ética de dados, desenvolvimento do produto técnico/relatório de estágio e defesa perante banca"
    ],
    hasFormulas: false
  },
  "empreendedorismo-social": {
    id: "empreendedorismo-social",
    name: "Projeto de Empreendedorismo Social e Economia Solidária",
    areaType: "humanas",
    cduPrefix: "CDU 334",
    fieldArea: "Inovação Social, Cooperativismo e Economia Solidária • Formação Cidadã e Técnica",
    realReferences: [
      "YUNUS, Muhammad. Criando um Negócio Social: Como Iniciativas Econômicas Podem Suprir as Necessidades da Humanidade. Rio de Janeiro: Elsevier, 2010.",
      "SINGER, Paul. Introdução à Economia Solidária. São Paulo: Fundação Perseu Abramo, 2002.",
      "BARKI, Edgard et al. Negócios com Impacto Social no Brasil. São Paulo: Peirópolis, 2013.",
      "BRASIL. Lei nº 5.764, de 16 de dezembro de 1971 (Política Nacional de Cooperativismo) e Lei nº 12.690/2012."
    ],
    realSources: [
      "Obras de Muhammad Yunus (Negócios Sociais) e Paul Singer (Introdução à Economia Solidária)",
      "Instituto Banco Palmas e Rede Brasileira de Bancos Comunitários",
      "Aliança Cooperativa Internacional (ACI), SEBRAE Negócios de Impacto e Lei nº 5.764/1971"
    ],
    coreMethodologies: [
      "Diagnóstico participativo do território para identificar demandas socioambientais reais da comunidade",
      "Modelagem sustentável através do Social Business Model Canvas e princípios de autogestão cooperativa",
      "Planejamento de ações (5W2H), finanças solidárias e avaliação de indicadores de impacto social"
    ],
    hasFormulas: false
  }
};

export function getDisciplineProfile(disciplineId: string, disciplineName?: string): DisciplinePedagogicalProfile {
  if (DISCIPLINE_PROFILES[disciplineId]) {
    return DISCIPLINE_PROFILES[disciplineId];
  }
  const norm = (disciplineId + " " + (disciplineName || "")).toLowerCase();
  if (norm.includes("mat")) return DISCIPLINE_PROFILES.matematica;
  if (norm.includes("fis") || norm.includes("fís")) return DISCIPLINE_PROFILES.fisica;
  if (norm.includes("bio")) return DISCIPLINE_PROFILES.biologia;
  if (norm.includes("geo")) return DISCIPLINE_PROFILES.geografia;
  if (norm.includes("soc")) return DISCIPLINE_PROFILES.sociologia;
  if (norm.includes("hist")) return DISCIPLINE_PROFILES.historia;
  if (norm.includes("port") || norm.includes("redac") || norm.includes("redaç")) return DISCIPLINE_PROFILES["lingua-portuguesa-redacao"];
  if (norm.includes("ing")) return DISCIPLINE_PROFILES["lingua-inglesa"];
  if (norm.includes("banco") || norm.includes("sql")) return DISCIPLINE_PROFILES["banco-de-dados"];
  if (norm.includes("web") || norm.includes("html")) return DISCIPLINE_PROFILES["desenvolvimento-web"];
  if (norm.includes("rob")) return DISCIPLINE_PROFILES.robotica;
  if (norm.includes("design") || norm.includes("interface")) return DISCIPLINE_PROFILES["design-de-interface"];
  if (norm.includes("tcc") || norm.includes("estagio") || norm.includes("estágio")) return DISCIPLINE_PROFILES["materia-pratica-estagio-tcc"];
  if (norm.includes("empreend") || norm.includes("solid")) return DISCIPLINE_PROFILES["empreendedorismo-social"];
  if (norm.includes("analise") || norm.includes("análise") || norm.includes("sistema")) return DISCIPLINE_PROFILES["analise-projeto-sistemas"];
  return DISCIPLINE_PROFILES.matematica;
}
