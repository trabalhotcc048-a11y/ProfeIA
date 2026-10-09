import { getDisciplineProfile } from "./pedagogicalCatalog";

export interface TopicDomainKnowledge {
  disciplineId: string;
  disciplineName: string;
  areaType: "exatas" | "biologicas" | "humanas" | "linguagens" | "tecnicas";
  topicTitle: string;
  moduleTitle: string;
  prerequisiteTitle: string;
  coreDefinition: string;
  historicalContext: string;
  mechanismsAndProcesses: string;
  practicalExamples: string[];
  importantRelations: string;
  formulaOrSyntax?: string;
  formulaInterpretation?: string;
  commonMistake: string;
  mistakeCorrection: string;
  analogyExplanation: string;
  gapIdentified: string;
  keyTerms: string[];
}

function resolveSpecificPrerequisite(
  disciplineId: string,
  disciplineName: string,
  topicTitle: string
): string {
  const norm = topicTitle.toLowerCase();

  if (disciplineId === "matematica") {
    if (norm.includes("bhaskara") || norm.includes("2º grau") || norm.includes("quadrática") || norm.includes("discriminante")) {
      return "Identificação dos coeficientes a, b e c e aplicação correta da fórmula do discriminante (Δ = b² − 4ac)";
    }
    if (norm.includes("girard") || norm.includes("soma e produto")) {
      return "Identificação dos coeficientes a, b e c em ax² + bx + c = 0 e relações de soma (−b/a) e produto (c/a)";
    }
    if (norm.includes("fatoração") || norm.includes("produtos notáveis") || norm.includes("polinômio")) {
      return "Fator comum em evidência e identidade dos produtos notáveis ((a ± b)² e a² − b²)";
    }
    if (norm.includes("logaritm") || norm.includes("exponencial")) {
      return "Propriedades operatórias de potenciação de mesma base e definição de logaritmo (log_b(a) = x ⟺ b^x = a)";
    }
    if (norm.includes("funç") || norm.includes("afim") || norm.includes("progress")) {
      return "Identificação da taxa de variação (coeficiente angular a), termo inicial (b) e cálculo da raiz (f(x) = 0)";
    }
    if (norm.includes("trigonometr") || norm.includes("seno") || norm.includes("cosseno") || norm.includes("triângulo") || norm.includes("geometria") || norm.includes("prisma") || norm.includes("pirâmide") || norm.includes("cilindro") || norm.includes("cone") || norm.includes("esfera") || norm.includes("poliedro")) {
      return "Teorema de Pitágoras (a² = b² + c²), razões trigonométricas no triângulo retângulo e relação entre área da base e altura perpendicular";
    }
    return "Princípio Fundamental da Contagem, ordenação de dados em rol e distinção entre agrupamentos ordenados (Arranjo) e não ordenados (Combinação)";
  }

  if (disciplineId === "fisica") {
    if (norm.includes("mru") || norm.includes("velocidade") || norm.includes("torricelli") || norm.includes("queda") || norm.includes("cinemática") || norm.includes("lançamento")) {
      return "Conversão de unidades de velocidade (km/h ÷ 3,6 = m/s) e relação entre variação de espaço (Δs), velocidade (v), aceleração (a) e tempo (Δt)";
    }
    if (norm.includes("newton") || norm.includes("força") || norm.includes("inércia") || norm.includes("atrito") || norm.includes("trabalho") || norm.includes("energia") || norm.includes("potência")) {
      return "Cálculo da força resultante vetorial (F_R) e relação direta entre força resultante, massa e aceleração (F_R = m · a)";
    }
    if (norm.includes("term") || norm.includes("calor") || norm.includes("dilatação") || norm.includes("gases") || norm.includes("celsius") || norm.includes("kelvin")) {
      return "Cálculo da variação de temperatura (ΔT = T_final − T_inicial) e distinção entre calor sensível (Q = m·c·ΔT) e calor latente (Q = m·L)";
    }
    return "Relação fundamental entre grandezas elétricas na 1ª Lei de Ohm (U = R · i), potência elétrica (P = U · i) e equação da onda (v = λ · f)";
  }

  if (disciplineId === "biologia") {
    if (norm.includes("fotossíntese") || norm.includes("fotossintese") || norm.includes("calvin") || norm.includes("rubisco") || norm.includes("cloroplasto")) {
      return "Compartimentalização do cloroplasto (tilacoides vs. estroma) e papel da fotólise da água (H₂O) na liberação de O₂ e do CO₂ no Ciclo de Calvin";
    }
    if (norm.includes("respiração") || norm.includes("atp") || norm.includes("mitocôndria") || norm.includes("fermentação")) {
      return "Etapas metabólicas da respiração celular (glicólise no citosol, Ciclo de Krebs na matriz mitocondrial e fosforilação oxidativa nas cristas)";
    }
    if (norm.includes("dna") || norm.includes("rna") || norm.includes("transcrição") || norm.includes("tradução") || norm.includes("proteica")) {
      return "Antiparalelismo das fitas (3'→5' e 5'→3') e pareamento complementar de bases nitrogenadas (A-U e C-G na transcrição do RNA)";
    }
    if (norm.includes("genética") || norm.includes("mendel") || norm.includes("alelo") || norm.includes("sangue") || norm.includes("abo") || norm.includes("cromossomo") || norm.includes("mitose") || norm.includes("meiose")) {
      return "Segregação de alelos dominantes e recessivos na formação de gametas e distinção entre genótipo e fenótipo";
    }
    return `Mecanismo fisiológico, estrutura celular/orgânica atuante e função biológica em ${topicTitle}`;
  }

  if (disciplineId === "historia") {
    if (norm.includes("francesa") || norm.includes("iluminismo") || norm.includes("bastilha") || norm.includes("jacobino") || norm.includes("girondino") || norm.includes("antigo regime") || norm.includes("napole")) {
      return "Sociedade estamental do Antigo Regime (Três Estados), crítica iluminista ao absolutismo e projetos de Girondinos e Jacobinos";
    }
    if (norm.includes("industrial") || norm.includes("operário") || norm.includes("ludismo") || norm.includes("cartismo") || norm.includes("imperialismo") || norm.includes("neocolonial")) {
      return "Cercamento dos campos, maquinofatura a vapor, divisão entre burguesia industrial e proletariado e expansão imperialista do século XIX";
    }
    if (norm.includes("grécia") || norm.includes("atenas") || norm.includes("esparta") || norm.includes("roma") || norm.includes("feudal") || norm.includes("medieval") || norm.includes("cruzada") || norm.includes("peste")) {
      return "Cidadania na Pólis Grega, instituições da República/Império Romano e relações de servidão e suserania no Sistema Feudal";
    }
    if (norm.includes("renascimento") || norm.includes("reforma") || norm.includes("absolutismo") || norm.includes("mercantilismo") || norm.includes("navegações") || norm.includes("tordesilhas") || norm.includes("pacto colonial") || norm.includes("pré-colombian") || norm.includes("tráfico")) {
      return "Formação das Monarquias Nacionais, práticas mercantilistas, Pacto Colonial e estrutura da expansão marítima moderna";
    }
    if (norm.includes("colônia") || norm.includes("colonial") || norm.includes("açucar") || norm.includes("holandes") || norm.includes("ouro") || norm.includes("mineração") || norm.includes("inconfidência") || norm.includes("conjuração") || norm.includes("independência do brasil") || norm.includes("reinado") || norm.includes("capitania")) {
      return "Estrutura agroexportadora colonial, mão de obra escravizada, fiscalismo metropolitano e formação do Estado Imperial brasileiro";
    }
    return "Processos políticos e socioeconômicos do século XX, crise das oligarquias, Era Vargas, industrialização e redemocratização no Brasil";
  }

  if (disciplineId === "geografia") {
    if (norm.includes("clima") || norm.includes("climátic") || norm.includes("equatorial") || norm.includes("tropical") || norm.includes("semiárido") || norm.includes("subtropical") || norm.includes("massa") || norm.includes("latitude") || norm.includes("altitude") || norm.includes("el niño") || norm.includes("la niña")) {
      return "Fatores climáticos (latitude, altitude, maritimidade/continentalidade e massas de ar) e comportamento da temperatura, umidade e precipitação";
    }
    if (norm.includes("bioma") || norm.includes("morfoclimátic") || norm.includes("amazônia") || norm.includes("cerrado") || norm.includes("caatinga") || norm.includes("mata atlântica") || norm.includes("araucária") || norm.includes("quioto") || norm.includes("paris")) {
      return "Relação entre clima, relevo, solo e cobertura vegetal nos domínios morfoclimáticos e biomas brasileiros";
    }
    if (norm.includes("estrutura interna") || norm.includes("deriva continental") || norm.includes("tectônica") || norm.includes("placas") || norm.includes("crosta") || norm.includes("manto") || norm.includes("núcleo") || norm.includes("endógeno") || norm.includes("vulcanismo") || norm.includes("terremoto") || norm.includes("litosfera")) {
      return "Camadas internas da Terra (Crosta/Litosfera, Manto/Astenosfera e Núcleo), Correntes de Convecção e Deriva Continental";
    }
    if (norm.includes("relevo") || norm.includes("intemperismo") || norm.includes("exógeno") || norm.includes("erosão") || norm.includes("solo") || norm.includes("pedogênese") || norm.includes("desertificação") || norm.includes("bacia") || norm.includes("hidrográfic") || norm.includes("aquífero") || norm.includes("mineral")) {
      return "Atuação do intemperismo físico e químico, unidades do relevo brasileiro (planaltos, planícies e depressões) e dinâmica das bacias hidrográficas";
    }
    if (norm.includes("demogr") || norm.includes("natalidade") || norm.includes("mortalidade") || norm.includes("fecundidade") || norm.includes("pirâmide") || norm.includes("popula") || norm.includes("migra") || norm.includes("êxodo") || norm.includes("refugiado") || norm.includes("pea") || norm.includes("malthus")) {
      return "Indicadores demográficos (natalidade, mortalidade, fecundidade e crescimento vegetativo), transição demográfica e fluxos migratórios";
    }
    if (norm.includes("urban") || norm.includes("cidade") || norm.includes("metropol") || norm.includes("conurbação") || norm.includes("segregação") || norm.includes("gentrificação") || norm.includes("mobilidade") || norm.includes("calor") || norm.includes("inversão térmica") || norm.includes("saneamento")) {
      return "Processo de urbanização, hierarquia da rede urbana, conurbação metropolitana e organização do espaço intraurbano";
    }
    return "Divisão Internacional do Trabalho (DIT), blocos econômicos, multipolaridade geopolítica e fluxos da globalização";
  }

  if (disciplineId === "sociologia") {
    if (norm.includes("gênese") || norm.includes("iluminismo") || norm.includes("revolução") || norm.includes("comte") || norm.includes("positivismo")) {
      return "Racionalismo Iluminista e transformações históricas da Revolução Industrial e da Revolução Francesa na formação da sociedade moderna";
    }
    if (norm.includes("durkheim") || norm.includes("fato social") || norm.includes("solidariedade") || norm.includes("anomia") || norm.includes("suicídio")) {
      return "Definição de Fato Social (Coercitividade, Exterioridade e Generalidade) e distinção entre Solidariedade Mecânica e Orgânica em Durkheim";
    }
    if (norm.includes("marx") || norm.includes("materialismo") || norm.includes("classe") || norm.includes("mais-valia") || norm.includes("alienação") || norm.includes("taylorismo") || norm.includes("fordismo") || norm.includes("toyotismo") || norm.includes("uberização") || norm.includes("precarização") || norm.includes("trabalho")) {
      return "Relações sociais de produção, divisão social do trabalho e transformações dos modelos produtivos (Fordismo, Toyotismo e Plataformização)";
    }
    if (norm.includes("weber") || norm.includes("ação social") || norm.includes("dominação") || norm.includes("estado") || norm.includes("estratificação") || norm.includes("mobilidade") || norm.includes("elite") || norm.includes("gramsci") || norm.includes("foucault") || norm.includes("bourdieu")) {
      return "Sentido subjetivo da Ação Social, tipos de dominação legítima em Max Weber e estruturas de poder e estratificação social";
    }
    return "Conceito antropológico de cultura, superação do etnocentrismo pelo relativismo cultural e dimensões dos direitos de cidadania";
  }

  if (disciplineId === "lingua-portuguesa-redacao") {
    if (norm.includes("substantivo")) {
      return "Critérios de classificação dos substantivos (comum/próprio, concreto/abstrato, primitivo/derivado, simples/composto, coletivo) e flexão de gênero, número e grau";
    }
    if (norm.includes("formação de palavras") || norm.includes("derivação") || norm.includes("composição") || norm.includes("adjetivo") || norm.includes("artigo") || norm.includes("pronome") || norm.includes("verbo") || norm.includes("advérbio") || norm.includes("preposição") || norm.includes("conjunç")) {
      return `Classificação morfológica, estrutura vocabular e função das classes de palavras em ${topicTitle}`;
    }
    if (norm.includes("sujeito") || norm.includes("predicado") || norm.includes("transitividade") || norm.includes("objeto") || norm.includes("complemento") || norm.includes("adjunto") || norm.includes("passiva") || norm.includes("aposto") || norm.includes("regência") || norm.includes("concordância") || norm.includes("crase") || norm.includes("pontuação") || norm.includes("vírgula") || norm.includes("coordenação") || norm.includes("subordinação") || norm.includes("oração") || norm.includes("orações")) {
      return `Relações sintáticas entre termos da oração, transitividade verbal e regras de concordância, regência e pontuação em ${topicTitle}`;
    }
    if (norm.includes("redação") || norm.includes("dissertativ") || norm.includes("enem") || norm.includes("tese") || norm.includes("intervenção") || norm.includes("repertório") || norm.includes("competência")) {
      return "Estrutura do texto dissertativo-argumentativo (Tese, Argumentação com Repertório e Proposta de Intervenção com 5 elementos)";
    }
    return `Mecanismos de coesão referencial e sequencial, coerência textual e efeitos de sentido na interpretação de ${topicTitle}`;
  }

  if (disciplineId === "lingua-inglesa") {
    return `Estrutura verbal em inglês, uso de verbos auxiliares (do/does/did/have/will) e interpretação contextual em ${topicTitle}`;
  }

  if (disciplineId === "empreendedorismo-social") {
    return `Distinção entre negócio tradicional, filantropia e negócio de impacto social, autogestão cooperativa e modelagem no Social Business Canvas em ${topicTitle}`;
  }

  if (disciplineId === "analise-projeto-sistemas") {
    return `Distinção entre Requisitos Funcionais (o que o sistema faz) e Não Funcionais (restrições de qualidade) e modelagem UML em ${topicTitle}`;
  }

  if (disciplineId === "banco-de-dados") {
    return `Integridade referencial entre Chave Primária (PK) e Chave Estrangeira (FK), normalização e estrutura de cláusulas SQL em ${topicTitle}`;
  }

  if (disciplineId === "desenvolvimento-web") {
    return `Semântica HTML5, layout responsivo CSS (Flexbox/Grid), assincronismo JavaScript e gerenciamento imutável de estado em React em ${topicTitle}`;
  }

  if (disciplineId === "robotica" || disciplineId === "robotica-educacional") {
    return `Aplicação da Lei de Ohm (U = R · i), leitura analógica (0–1023) e modulação por largura de pulso PWM (0–255) em ${topicTitle}`;
  }

  if (disciplineId === "design-de-interface") {
    return `Diferenciação entre UX e UI, Heurísticas de Usabilidade de Nielsen e critérios de contraste e acessibilidade WCAG em ${topicTitle}`;
  }

  if (disciplineId === "materia-pratica-estagio-tcc") {
    return `Delimitação entre Tema, Problema de Pesquisa (pergunta norteadora) e Objetivos (verbos no infinitivo) e normas ABNT em ${topicTitle}`;
  }

  return `Conceitos estruturantes e relações diretas de ${topicTitle} (${disciplineName})`;
}

/**
 * Analisa semanticamente o título do tópico, subtítulo e disciplina para produzir
 * conhecimento específico e real da matéria (sem jargões genéricos de sistemas/engenharia).
 */
export function getTopicDomainKnowledge(
  disciplineId: string,
  topicTitle: string,
  subtitle?: string,
  _prereqTopicIgnore?: string,
  questionContext?: string
): TopicDomainKnowledge {
  const profile = getDisciplineProfile(disciplineId, subtitle);
  const norm = `${topicTitle} ${questionContext || ""}`.toLowerCase();
  const moduleTitle = subtitle ? subtitle.split("•")[0].trim() : profile.fieldArea;
  const prereq = resolveSpecificPrerequisite(profile.id, profile.name, `${topicTitle} ${questionContext || ""}`);

  // =========================================================================
  // 1. MATEMÁTICA
  // =========================================================================
  if (profile.id === "matematica") {
    if (norm.includes("bhaskara") || norm.includes("2º grau") || norm.includes("quadrática") || norm.includes("discriminante") || norm.includes("girard") || norm.includes("fatoração") || norm.includes("polinômio")) {
      const isGirard = norm.includes("girard") || norm.includes("soma e produto");
      const isFatoracao = norm.includes("fatoração") || norm.includes("produtos notáveis");
      const specificMathPrereq = isFatoracao
        ? "Reconhecimento de Fator Comum em Evidência e Produtos Notáveis ((a ± b)² e a² − b²)"
        : isGirard
        ? "Identificação dos coeficientes a, b e c em ax² + bx + c = 0 e Relações de Soma (−b/a) e Produto (c/a)"
        : "Identificação dos coeficientes a, b e c e aplicação correta da fórmula do discriminante (Δ = b² − 4ac)";
      return {
        disciplineId: profile.id,
        disciplineName: profile.name,
        areaType: "exatas",
        topicTitle,
        moduleTitle,
        prerequisiteTitle: specificMathPrereq,
        coreDefinition: isGirard
          ? `O estudo de "${topicTitle}" estabelece a relação direta entre os coeficientes (a, b, c) de uma equação polinomial ax² + bx + c = 0 (com a ≠ 0) e suas raízes x₁ e x₂: a soma das raízes é S = x₁ + x₂ = -b/a e o produto é P = x₁ · x₂ = c/a.`
          : isFatoracao
          ? `O estudo de "${topicTitle}" consiste em transformar expressões algébricas polinomiais em produtos de fatores equivalentes, utilizando fator comum em evidência, agrupamento, diferença de dois quadrados (a² - b² = (a+b)(a-b)) e trinômio quadrado perfeito ((a ± b)² = a² ± 2ab + b²).`
          : `O estudo de "${topicTitle}" analisa as equações do 2º grau na forma canônica ax² + bx + c = 0 (com a, b, c ∈ ℝ e a ≠ 0), em que a existência e o cálculo das raízes reais dependem diretamente do discriminante Δ = b² - 4ac e da fórmula resolutiva de Bhaskara x = (-b ± √Δ) / (2a).`,
        historicalContext:
          "Historicamente, problemas envolvendo equações quadráticas já eram resolvidos na Babilônia antiga (c. 1800 a.C.). No século IX, o matemático persa Al-Khwarizmi sistematizou o método de completamento de quadrados, e no século XII o matemático indiano Bhaskara Akaria difundiu a resolução algébrica que recebeu notação simbólica moderna com François Viète e René Descartes.",
        mechanismsAndProcesses: isGirard
          ? "1) Escrever a equação na forma reduzida ax² + bx + c = 0; 2) Identificar os coeficientes a, b e c com seus respectivos sinais; 3) Calcular a soma S = -b/a e o produto P = c/a; 4) Determinar os dois números cuja soma é S e cujo produto é P."
          : isFatoracao
          ? "1) Observar se há um fator numérico ou literal comum a todos os termos para colocá-lo em evidência; 2) Verificar se o binômio é uma diferença de quadrados a² - b²; 3) Testar se o trinômio possui dois quadrados perfeitos nas extremidades e termo central igual a ±2ab; 4) Simplificar frações algébricas cancelando apenas fatores multiplicativos."
          : "1) Ordenar a equação na forma geral ax² + bx + c = 0 e identificar os coeficientes reais a, b e c com seus sinais; 2) Calcular o discriminante Δ = b² - 4ac (se Δ > 0 há 2 raízes reais distintas; se Δ = 0 há 1 raiz real dupla; se Δ < 0 não há raízes reais); 3) Aplicar a fórmula de Bhaskara x = (-b ± √Δ)/(2a) para determinar x₁ e x₂.",
        practicalExamples: isGirard
          ? [
              "Na equação x² - 7x + 10 = 0 (a = 1, b = -7, c = 10), a soma das raízes é S = -(-7)/1 = 7 e o produto é P = 10/1 = 10; os números que somam 7 e multiplicam 10 são x₁ = 2 e x₂ = 5.",
              "Para construir uma equação do 2º grau cujas raízes sejam 3 e 4, calculamos S = 3 + 4 = 7 e P = 3 · 4 = 12, obtendo x² - 7x + 12 = 0."
            ]
          : isFatoracao
          ? [
              "Na expressão x² - 9, reconhecemos a diferença de dois quadrados (x² - 3²) e fatoramos diretamente como (x + 3)(x - 3).",
              "No trinômio quadrado perfeito x² + 6x + 9, como √x² = x, √9 = 3 e o termo central é 2·x·3 = 6x, a forma fatorada é (x + 3)²."
            ]
          : [
              "Na equação 2x² - 8x + 6 = 0, identificamos a = 2, b = -8 e c = 6. Calculando o discriminante Δ = (-8)² - 4·2·6 = 64 - 48 = 16, aplicamos Bhaskara: x = (-(-8) ± √16)/(2·2) = (8 ± 4)/4, obtendo as raízes reais x₁ = 3 e x₂ = 1.",
              "Na equação x² - 6x + 9 = 0 (a = 1, b = -6, c = 9), o discriminante é Δ = (-6)² - 4·1·9 = 36 - 36 = 0, resultando em uma única raiz real dupla x = 6 / 2 = 3."
            ],
        importantRelations: isGirard
          ? "Relaciona diretamente os coeficientes a, b e c da equação do 2º grau à soma e ao produto de suas raízes reais."
          : isFatoracao
          ? "Sustenta a simplificação de frações algébricas e a decomposição de polinômios em fatores lineares."
          : "Fundamenta a resolução algébrica de equações polinomiais de 2º grau, a análise da existência de raízes reais pelo discriminante Δ e o cálculo das raízes pela fórmula de Bhaskara.",
        formulaOrSyntax: isGirard
          ? "x₁ + x₂ = -b/a   |   x₁ · x₂ = c/a   |   x² - Sx + P = 0"
          : isFatoracao
          ? "(a ± b)² = a² ± 2ab + b²   |   a² - b² = (a + b)(a - b)"
          : "ax² + bx + c = 0  ⟹  Δ = b² - 4ac  ⟹  x = (-b ± √Δ) / (2a)",
        formulaInterpretation:
          "Onde 'a' é o coeficiente de x² (a ≠ 0), 'b' é o coeficiente de x, 'c' é o termo independente e Δ = b² - 4ac determina a quantidade de raízes reais.",
        commonMistake:
          "Errar o sinal de -b quando o coeficiente b é negativo (ex: em b = -8, escrever -8 na fórmula em vez de -(-8) = +8), calcular (-b)² como negativo ou esquecer de subtrair o produto 4ac no discriminante.",
        mistakeCorrection:
          "Substituir os coeficientes negativos entre parênteses: (-8)² = +64, subtrair o produto 4·a·c (Δ = b² - 4ac) e inverter o sinal de b em -b = -(-8) = +8.",
        analogyExplanation:
          "Pense no discriminante Δ = b² - 4ac como o termômetro das raízes reais da equação do 2º grau: quando Δ é positivo (Δ > 0), a equação possui duas raízes reais diferentes; quando Δ é zero (Δ = 0), possui uma raiz real dupla; e quando Δ é negativo (Δ < 0), não existem raízes reais.",
        gapIdentified: `Identificação dos coeficientes a, b e c e aplicação de Δ = b² − 4ac em ${topicTitle}.`,
        keyTerms: isFatoracao
          ? ["Fatoração de Polinômios", "Fator Comum em Evidência", "Produtos Notáveis", "Trinômio Quadrado Perfeito", "Diferença de Dois Quadrados", "Expressões Algébricas"]
          : isGirard
          ? ["Relações de Girard", "Soma das Raízes (-b/a)", "Produto das Raízes (c/a)", "Coeficientes a, b e c", "Equação do 2º Grau", "Raízes Reais"]
          : ["Equação do 2º Grau (ax² + bx + c = 0)", "Coeficientes a, b e c", "Discriminante (Δ = b² − 4ac)", "Fórmula de Bhaskara", "Raízes Reais", "Resolução Algébrica"]
      };
    }

    if (norm.includes("funç") || norm.includes("afim") || norm.includes("exponencial") || norm.includes("logaritm") || norm.includes("progress") || norm.includes("pa ") || norm.includes("pg ")) {
      const isExpLog = norm.includes("exponencial") || norm.includes("logaritm");
      const isProg = norm.includes("progress") || norm.includes("pa ") || norm.includes("pg ");
      return {
        disciplineId: profile.id,
        disciplineName: profile.name,
        areaType: "exatas",
        topicTitle,
        moduleTitle,
        prerequisiteTitle: prereq,
        coreDefinition: isExpLog
          ? `O estudo de "${topicTitle}" analisa as funções exponenciais f(x) = a · b^x (crescimento ou decrescimento multiplicativo com base b > 0 e b ≠ 1) e sua operação inversa, o logaritmo log_b(a) = x ⟺ b^x = a, aplicando as propriedades operatórias de potências e logaritmos.`
          : isProg
          ? `O estudo de "${topicTitle}" analisa as sequências numéricas regidas por uma lei de formação constante: a Progressão Aritmética (PA, em que cada termo soma uma razão constante r: a_n = a₁ + (n - 1)·r) e a Progressão Geométrica (PG, em que cada termo multiplica uma razão constante q: a_n = a₁ · q^(n - 1)).`
          : `O estudo de "${topicTitle}" investiga a relação funcional f(x) = ax + b entre variáveis reais, analisando o domínio, a imagem, a taxa de variação (coeficiente angular a), o valor inicial (coeficiente linear b), o zero da função (f(x) = 0) e a representação gráfica no plano cartesiano.`,
        historicalContext:
          "O conceito de função foi formalizado por matemáticos como Gottfried Wilhelm Leibniz, Leonhard Euler (que introduziu a notação f(x) no século XVIII) e Peter Gustave Lejeune Dirichlet, enquanto os logaritmos foram criados por John Napier no século XVII.",
        mechanismsAndProcesses: isExpLog
          ? "1) Verificar a condição de existência (base b > 0 e b ≠ 1; logaritmando a > 0); 2) Igualar as bases nas equações exponenciais (b^x = b^y ⟹ x = y) ou aplicar a definição log_b(a) = x ⟺ b^x = a; 3) Aplicar as propriedades do logaritmo do produto (soma), do quociente (subtração) e da potência (multiplicação pelo expoente)."
          : isProg
          ? "1) Identificar o primeiro termo (a₁) e a razão da sequência (r = a₂ - a₁ na PA ou q = a₂ / a₁ na PG); 2) Aplicar a fórmula do termo geral para encontrar a posição n ou o valor de a_n; 3) Aplicar a fórmula da soma dos n primeiros termos (S_n)."
          : "1) Identificar o coeficiente angular 'a' (que multiplica x) e o coeficiente linear 'b' (termo independente); 2) Calcular a raiz ou zero da função resolvendo ax + b = 0 (x = -b/a); 3) Determinar se a função é crescente (a > 0) ou decrescente (a < 0) e localizar os interceptos nos eixos cartesianos.",
        practicalExamples: isExpLog
          ? [
              "Em uma cultura de 500 bactérias que dobra a cada hora segundo N(t) = 500 · 2^t, após t = 4 horas a população será N(4) = 500 · 2⁴ = 500 · 16 = 8.000 bactérias.",
              "Pela definição de logaritmo, log₂(32) = 5 porque a base 2 elevada ao expoente 5 resulta em 2⁵ = 32."
            ]
          : isProg
          ? [
              "Em uma PA com primeiro termo a₁ = 4 e razão r = 3, o 10º termo é a₁₀ = 4 + (10 - 1)·3 = 4 + 27 = 31.",
              "Em uma PG com a₁ = 5 e razão q = 2, o 5º termo é a₅ = 5 · 2^(5-1) = 5 · 16 = 80."
            ]
          : [
              "Em uma função afim C(x) = 15x + 120, o valor inicial fixo é b = 120 (quando x = 0) e a taxa de variação é a = 15 por unidade.",
              "Para encontrar a raiz da função f(x) = 3x - 12, igualamos 3x - 12 = 0 ⟹ 3x = 12 ⟹ x = 4."
            ],
        importantRelations: isExpLog
          ? "Conecta as propriedades operatórias da potenciação à resolução de equações exponenciais e logarítmicas."
          : isProg
          ? "Relaciona a razão constante das sequências numéricas ao cálculo do termo geral e da soma finita ou infinita."
          : "Articula os coeficientes algébricos 'a' e 'b' da lei de formação f(x) = ax + b à inclinação e aos interceptos da reta no gráfico cartesiano.",
        formulaOrSyntax: isExpLog
          ? "f(x) = a · b^x   |   log_b(a) = x ⟺ b^x = a   |   log_b(x · y) = log_b(x) + log_b(y)"
          : isProg
          ? "PA: a_n = a₁ + (n - 1)·r   |   PG: a_n = a₁ · q^(n - 1)"
          : "f(x) = ax + b   |   Raiz: f(x) = 0 ⟹ x = -b / a",
        formulaInterpretation: isExpLog
          ? "Na função exponencial e no logaritmo, a base b > 1 determina crescimento e 0 < b < 1 determina decrescimento."
          : isProg
          ? "Na PA soma-se a razão constante r a cada passo; na PG multiplica-se pela razão constante q a cada passo."
          : "Na função afim f(x) = ax + b, 'a' é a taxa de variação (inclinação da reta) e 'b' é o valor onde a reta corta o eixo vertical y.",
        commonMistake: isExpLog
          ? "Multiplicar a base pelo expoente em vez de calcular a potência (ex: fazer 2⁴ = 8 em vez de 16) ou aplicar log(a + b) como se fosse log(a) + log(b)."
          : isProg
          ? "Esquecer de subtrair 1 do número de termos no fator (n - 1) da fórmula do termo geral a_n = a₁ + (n - 1)·r."
          : "Trocar os papéis do coeficiente angular 'a' (que acompanha x) e do coeficiente linear 'b' (termo fixo) ou esquecer de inverter o sinal ao resolver ax + b = 0.",
        mistakeCorrection: isExpLog
          ? "Calcular a potência multiplicando a base por ela mesma (2⁴ = 2·2·2·2 = 16) e lembrar que log_b(x · y) = log_b(x) + log_b(y)."
          : isProg
          ? "Para ir do 1º termo (a₁) até o n-ésimo termo (a_n), damos exatamente (n - 1) passos de razão r (na PA) ou q^(n-1) (na PG)."
          : "Identificar sempre 'a' como o coeficiente que multiplica a variável x e 'b' como o valor de f(0), isolando x com operação inversa ao calcular a raiz.",
        analogyExplanation: isExpLog
          ? "O logaritmo é simplesmente a pergunta inversa da potência: perguntar quanto vale log₂(16) é perguntar 'a qual expoente devo elevar a base 2 para obter 16?' (resposta: 4, pois 2⁴ = 16)."
          : isProg
          ? "Pense em subir uma escada a partir do 1º degrau (a₁): para chegar ao 10º degrau (a₁₀), você sobe 9 degraus (n - 1 = 9) de tamanho r!"
          : "Pense na função afim f(x) = ax + b como uma corrida de táxi: 'b' é a bandeirada fixa inicial na partida (x = 0) e 'a' é o valor cobrado por cada quilômetro rodado!",
        gapIdentified: `Domínio da lei de formação e resolução algébrica em ${topicTitle}.`,
        keyTerms: isExpLog
          ? ["Função Exponencial", "Potenciação de Mesma Base", "Definição de Logaritmo", "Propriedades dos Logaritmos", "Crescimento Multiplicativo", "Equação Exponencial e Logarítmica"]
          : isProg
          ? ["Progressão Aritmética (PA)", "Progressão Geométrica (PG)", "Razão Constante", "Termo Geral (a_n)", "Soma dos Termos (S_n)", "Sequências Numéricas"]
          : ["Domínio e Imagem", "Função Afim f(x) = ax + b", "Coeficiente Angular (Taxa de Variação)", "Coeficiente Linear", "Raiz ou Zero da Função", "Gráfico Cartesiano"]
      };
    }

    if (norm.includes("trigonometr") || norm.includes("seno") || norm.includes("cosseno") || norm.includes("tangente") || norm.includes("triângulo") || norm.includes("pitágoras") || norm.includes("geometria") || norm.includes("poliedro") || norm.includes("prisma") || norm.includes("pirâmide") || norm.includes("cilindro") || norm.includes("cone") || norm.includes("esfera") || norm.includes("euler")) {
      const isTrig = norm.includes("trigonometr") || norm.includes("seno") || norm.includes("cosseno") || norm.includes("tangente") || norm.includes("triângulo") || norm.includes("pitágoras");
      return {
        disciplineId: profile.id,
        disciplineName: profile.name,
        areaType: "exatas",
        topicTitle,
        moduleTitle,
        prerequisiteTitle: prereq,
        coreDefinition: isTrig
          ? `O estudo de "${topicTitle}" analisa as relações métricas e angulares no triângulo retângulo e no ciclo trigonométrico, aplicando o Teorema de Pitágoras (a² = b² + c²) e as razões trigonométricas seno (cateto oposto / hipotenusa), cosseno (cateto adjacente / hipotenusa) e tangente (cateto oposto / cateto adjacente).`
          : `O estudo de "${topicTitle}" aborda as propriedades métricas e espaciais das figuras planas e dos sólidos geométricos (poliedros, prismas, pirâmides, cilindros, cones e esferas), relacionando vértices, arestas e faces (V - A + F = 2), áreas de superfície e volumes tridimensionais.`,
        historicalContext:
          "Desde os Elementos de Euclides de Alexandria (século III a.C.), o Teorema de Pitágoras e os tratados de Arquimedes sobre áreas e volumes até a trigonometria de Hiparco e a relação topológica de Leonhard Euler.",
        mechanismsAndProcesses: isTrig
          ? "1) Identificar no triângulo retângulo a hipotenusa (lado oposto ao ângulo de 90°) e os catetos oposto e adjacente ao ângulo θ; 2) Aplicar o Teorema de Pitágoras (a² = b² + c²) para determinar o lado desconhecido; 3) Calcular sen(θ) = CO/HIP, cos(θ) = CA/HIP e tg(θ) = CO/CA."
          : "1) Identificar o formato da base e a altura perpendicular (h) do sólido geométrico; 2) Calcular a área da base (A_base) e a área lateral; 3) Aplicar V = A_base · h para prismas e cilindros, V = (A_base · h)/3 para pirâmides e cones, ou V = (4/3)πr³ para esferas, convertendo unidades (1 m³ = 1.000 L).",
        practicalExamples: isTrig
          ? [
              "Em um triângulo retângulo com catetos 6 m e 8 m, a hipotenusa mede a = √(6² + 8²) = √(36 + 64) = √100 = 10 m, sendo o seno do ângulo oposto ao cateto 6 igual a sen(θ) = 6/10 = 0,6.",
              "Pela relação fundamental da trigonometria (sen²θ + cos²θ = 1), se sen(θ) = 0,6 em um ângulo agudo, então cos²θ = 1 - 0,36 = 0,64 ⟹ cos(θ) = 0,8."
            ]
          : [
              "Um reservatório em forma de prisma retangular com 4 m de comprimento, 3 m de largura e 2,5 m de altura possui volume V = 4 · 3 · 2,5 = 30 m³, equivalente a 30.000 litros.",
              "Um cilindro reto de raio r = 2 m e altura h = 5 m possui volume V = π · r² · h = π · 4 · 5 = 20π m³."
            ],
        importantRelations: isTrig
          ? "Articula o Teorema de Pitágoras às razões trigonométricas no triângulo retângulo e à relação fundamental sen²θ + cos²θ = 1."
          : "Relaciona o cálculo de áreas de polígonos planos à determinação da área total e do volume de prismas, pirâmides, cilindros, cones e esferas.",
        formulaOrSyntax: isTrig
          ? "a² = b² + c²   |   sen(θ) = CO / HIP   |   cos(θ) = CA / HIP   |   tg(θ) = CO / CA   |   sen²θ + cos²θ = 1"
          : "V - A + F = 2   |   V_prisma/cilindro = A_base · h   |   V_pirâmide/cone = (A_base · h) / 3",
        formulaInterpretation: isTrig
          ? "A hipotenusa 'a' é sempre o maior lado do triângulo retângulo (oposto ao ângulo reto de 90°), e o seno e o cosseno de ângulos agudos são números entre 0 e 1."
          : "Em prismas e cilindros o volume é o produto da área da base pela altura (A_base · h); em pirâmides e cones divide-se esse produto por 3.",
        commonMistake: isTrig
          ? "Somar os catetos diretamente (b + c) em vez de somar seus quadrados (b² + c²) no Teorema de Pitágoras, ou trocar o cateto oposto pelo cateto adjacente no cálculo do seno."
          : "Somar as dimensões em vez de multiplicá-las no cálculo do volume, esquecer de dividir por 3 no volume de pirâmides/cones ou errar a conversão de 1 m³ = 1.000 litros.",
        mistakeCorrection: isTrig
          ? "Elevar cada cateto ao quadrado antes de somar e extrair a raiz quadrada ao final (a = √(b² + c²)), verificando qual cateto está de frente para o ângulo θ (cateto oposto)."
          : "Multiplicar área da base pela altura perpendicular (dividindo por 3 apenas em pirâmides e cones) e multiplicar o volume em m³ por 1.000 para converter em litros.",
        analogyExplanation: isTrig
          ? "Para nunca confundir os catetos: o Cateto Oposto é aquele que o ângulo θ está 'olhando de frente', enquanto o Cateto Adjacente é o lado que 'encosta no ombro' do ângulo θ (sem ser a hipotenusa)!"
          : "Imagine encher de água um copo cilíndrico reto e um cone de mesma base e mesma altura: são necessários exatamente 3 cones cheios para encher 1 cilindro!",
        gapIdentified: `Aplicação das relações métricas e trigonométricas em ${topicTitle}.`,
        keyTerms: isTrig
          ? ["Teorema de Pitágoras", "Hipotenusa e Catetos", "Seno, Cosseno e Tangente", "Arcos Notáveis (30°, 45°, 60°)", "Relação Fundamental da Trigonometria", "Triângulo Retângulo"]
          : ["Geometria Plana e Espacial", "Relação de Euler (V - A + F = 2)", "Área da Base e Área Total", "Volume de Prismas e Cilindros", "Volume de Pirâmides, Cones e Esferas", "Conversão m³ para Litros"]
      };
    }

    const isEstatistica = norm.includes("estatística") || norm.includes("média") || norm.includes("mediana") || norm.includes("moda") || norm.includes("desvio") || norm.includes("variância");
    return {
      disciplineId: profile.id,
      disciplineName: profile.name,
      areaType: "exatas",
      topicTitle,
      moduleTitle,
      prerequisiteTitle: prereq,
      coreDefinition: isEstatistica
        ? `O estudo de "${topicTitle}" analisa a organização de dados em rol e tabelas de frequência, o cálculo das medidas de tendência central — Média Aritmética (soma dos valores dividida pela quantidade), Mediana (valor central do rol ordenado) e Moda (valor mais frequente) — e as medidas de dispersão (variância e desvio-padrão).`
        : `O estudo de "${topicTitle}" investiga os métodos de contagem sistemática de agrupamentos — Princípio Fundamental da Contagem, Permutações (P_n = n!), Arranjos (quando a ordem importa) e Combinações (quando a ordem não importa) — e o cálculo de probabilidades P(E) = n(E) / n(Ω) em espaços amostrais equiprováveis.`,
      historicalContext:
        "A Teoria das Probabilidades e a Estatística desenvolveram-se a partir dos estudos de Blaise Pascal e Pierre de Fermat no século XVII, sendo axiomatizadas no século XX por Andrey Kolmogorov, Karl Pearson e Ronald Fisher.",
      mechanismsAndProcesses: isEstatistica
        ? "1) Ordenar o conjunto de dados em ordem crescente (rol); 2) Calcular a Média somando todos os termos e dividindo pelo total n de elementos; 3) Localizar a Mediana no termo central do rol ordenado (ou média dos dois termos centrais se n for par) e identificar a Moda como o elemento de maior frequência."
        : "1) Verificar se a ordem de escolha dos elementos altera o agrupamento formado: se a ordem importa, aplicar Arranjo A(n,p) = n!/(n-p)!; se a ordem NÃO importa, aplicar Combinação C(n,p) = n!/[p!(n-p)!]; 2) Em problemas de probabilidade, dividir o número de casos favoráveis n(E) pelo total de casos possíveis do espaço amostral n(Ω).",
      practicalExamples: isEstatistica
        ? [
            "Para as notas 8, 5, 10, 7 e 5: ordenando o rol (5, 5, 7, 8, 10), a Média é (5+5+7+8+10)/5 = 35/5 = 7,0; a Mediana (3º termo ordenado) é 7,0; e a Moda (valor que mais se repete) é 5,0.",
            "Quando duas turmas possuem a mesma média 7,0, a turma cujas notas estão mais próximas de 7,0 apresenta menor desvio-padrão (maior regularidade)."
          ]
        : [
            "Para escolher uma comissão de 2 representantes em uma turma de 6 alunos (a ordem não diferencia a dupla), usamos Combinação: C(6,2) = (6 · 5) / 2! = 15 duplas possíveis.",
            "Para formar uma senha de 3 algarismos distintos (a ordem importa) entre 10 dígitos, usamos Arranjo: 10 · 9 · 8 = 720 senhas possíveis."
          ],
      importantRelations: isEstatistica
        ? "Articula as medidas de tendência central (média, mediana e moda) às medidas de dispersão (variância e desvio-padrão) na interpretação de conjuntos de dados."
        : "Conecta a contagem do espaço amostral pela Análise Combinatória ao cálculo de probabilidades P(E) = n(E)/n(Ω).",
      formulaOrSyntax: isEstatistica
        ? "x̄ = (x₁ + x₂ + ... + x_n) / n   |   Mediana = termo central do rol   |   Moda = valor mais frequente"
        : "P_n = n!   |   A(n,p) = n! / (n-p)!   |   C(n,p) = n! / [p!(n-p)!]   |   P(E) = n(E) / n(Ω)",
      formulaInterpretation: isEstatistica
        ? "A mediana exige obrigatoriamente que os dados estejam ordenados (rol), enquanto a média pondera todos os valores do conjunto."
        : "No Arranjo a troca de ordem cria um novo agrupamento; na Combinação divide-se por p! porque a ordem dos escolhidos não altera o grupo.",
      commonMistake: isEstatistica
        ? "Pegar o elemento do meio da lista desordenada como mediana sem antes organizar os dados em ordem crescente (rol)."
        : "Usar Arranjo (sem dividir por p!) quando a ordem dos elementos escolhidos não diferencia o grupo formado.",
      mistakeCorrection: isEstatistica
        ? "Sempre ordenar os dados do menor para o maior antes de identificar a mediana e conferir a quantidade total de termos ao dividir na média."
        : "Testar a inversão de dois elementos escolhidos (ex: dupla {A, B} = {B, A}): se o grupo continua o mesmo, trata-se de Combinação e deve-se dividir por p!.",
      analogyExplanation: isEstatistica
        ? "Na Estatística, a Média é a divisão igualitária de tudo entre todos, a Mediana é quem está exatamente no meio da fila ordenada por tamanho, e a Moda é o valor 'campeão de audiência' que mais aparece!"
        : "Pense na diferença entre uma SENHA (1-2-3 ≠ 3-2-1, a ordem importa: Arranjo) e uma DUPLA de representantes (Ana e Bruno é a mesma dupla que Bruno e Ana, a ordem não importa: Combinação)!",
      gapIdentified: `Aplicação dos conceitos de ${topicTitle}.`,
      keyTerms: isEstatistica
        ? ["Média Aritmética e Ponderada", "Mediana e Rol Ordenado", "Moda", "Variância", "Desvio-Padrão", "Tabelas e Gráficos de Frequência"]
        : ["Princípio Fundamental da Contagem", "Permutação e Fatorial", "Arranjo vs Combinação", "Espaço Amostral", "Probabilidade P(E) = n(E)/n(Ω)", "Eventos Independentes"]
    };
  }

  // =========================================================================
  // 2. FÍSICA
  // =========================================================================
  if (profile.id === "fisica") {
    if (norm.includes("mru") || norm.includes("velocidade") || norm.includes("torricelli") || norm.includes("queda livre") || norm.includes("cinemática") || norm.includes("lançamento") || norm.includes("vetorial") || norm.includes("circular")) {
      return {
        disciplineId: profile.id,
        disciplineName: profile.name,
        areaType: "exatas",
        topicTitle,
        moduleTitle,
        prerequisiteTitle: prereq,
        coreDefinition: `O estudo de "${topicTitle}" na Cinemática descreve matematicamente o movimento dos corpos no espaço em função do tempo — analisando posição (s), deslocamento (Δs), velocidade (v) e aceleração (a) — no Movimento Retilíneo Uniforme (MRU, velocidade constante) e no Movimento Retilíneo Uniformemente Variado (MRUV, aceleração constante).`,
        historicalContext:
          "Galileu Galilei, no início do século XVII (Discursos e Demonstrações Matemáticas sobre Duas Novas Ciências, 1638), demonstrou experimentalmente que corpos em queda livre no vácuo caem com a mesma aceleração constante da gravidade (g), independentemente de suas massas.",
        mechanismsAndProcesses:
          "1) Converter as unidades para o Sistema Internacional (m, s, m/s, m/s² — dividindo km/h por 3,6 para obter m/s); 2) Identificar se a velocidade é constante (MRU: a = 0 e Δs = v · Δt) ou se há aceleração constante (MRUV: v = v₀ + a·t, Δs = v₀t + ½at² e Equação de Torricelli v² = v₀² + 2·a·Δs).",
        practicalExamples: [
          "Um veículo a 72 km/h (72 ÷ 3,6 = 20 m/s) que freia uniformemente com desaceleração a = -4 m/s² até parar (v = 0) percorre, pela Equação de Torricelli (0² = 20² + 2·(-4)·Δs), uma distância de frenagem Δs = 400 / 8 = 50 metros.",
          "Um móvel que parte com v₀ = 10 m/s e acelera a 3 m/s² durante t = 4 s atinge velocidade v = 10 + 3·4 = 22 m/s e percorre Δs = 10·4 + ½·3·16 = 64 metros."
        ],
        importantRelations:
          "Relaciona as funções horárias de posição e velocidade no MRU e MRUV com a Equação de Torricelli e a interpretação de gráficos cinemáticos.",
        formulaOrSyntax: "v_m = Δs / Δt   |   v = v₀ + a·t   |   Δs = v₀t + ½at²   |   v² = v₀² + 2·a·Δs",
        formulaInterpretation:
          "Em todas as equações cinemáticas, v₀ é a velocidade inicial (em m/s) e 'a' é a aceleração (em m/s²); quando o tempo t não é informado, aplica-se a Equação de Torricelli (v² = v₀² + 2·a·Δs).",
        commonMistake:
          "Substituir a velocidade em km/h diretamente nas fórmulas com tempo em segundos e aceleração em m/s² sem dividir por 3,6.",
        mistakeCorrection:
          "Sempre converter km/h para m/s dividindo por 3,6 antes de realizar os cálculos cinemáticos no Sistema Internacional (SI).",
        analogyExplanation:
          "No MRU a velocidade é constante (aceleração zero); já no MRUV a aceleração indica exatamente quantos m/s a velocidade aumenta (ou diminui na frenagem) a cada 1 segundo!",
        gapIdentified: `Conversão de unidades (km/h ⇄ m/s) e aplicação das equações cinemáticas em ${topicTitle}.`,
        keyTerms: ["Referencial e Deslocamento", "Velocidade Escalar Média", "MRU e MRUV", "Aceleração Escalar", "Equação de Torricelli", "Queda Livre"]
      };
    }

    if (norm.includes("newton") || norm.includes("força") || norm.includes("inércia") || norm.includes("atrito") || norm.includes("trabalho") || norm.includes("energia") || norm.includes("potência") || norm.includes("impulso") || norm.includes("momento") || norm.includes("gravitação") || norm.includes("hidrostática") || norm.includes("empuxo")) {
      const isEnergy = norm.includes("trabalho") || norm.includes("energia") || norm.includes("potência");
      return {
        disciplineId: profile.id,
        disciplineName: profile.name,
        areaType: "exatas",
        topicTitle,
        moduleTitle,
        prerequisiteTitle: prereq,
        coreDefinition: isEnergy
          ? `O estudo de "${topicTitle}" analisa a transferência e conservação de energia mecânica nos sistemas físicos: o Trabalho de uma força (τ = F · d · cosθ), a Energia Cinética de movimento (E_c = ½·m·v²), a Energia Potencial Gravitacional (E_pg = m·g·h) e Elástica (E_pe = ½·k·x²) e a Potência Mecânica (P = τ / Δt).`
          : `O estudo de "${topicTitle}" investiga as causas do movimento e do equilíbrio dos corpos por meio das Três Leis de Newton: 1ª Lei (Inércia: resultante nula mantém repouso ou MRU), 2ª Lei (Princípio Fundamental da Dinâmica: F_R = m · a) e 3ª Lei (Ação e Reação: forças de mesmo módulo e sentidos opostos atuando em corpos diferentes).`,
        historicalContext:
          "Em 1687, Isaac Newton publicou Philosophiae Naturalis Principia Mathematica, estabelecendo as três leis fundamentais da Dinâmica clássica, posteriormente articuladas aos teoremas de trabalho e conservação de energia no século XIX.",
        mechanismsAndProcesses: isEnergy
          ? "1) Identificar as grandezas no SI (massa em kg, velocidade em m/s, altura em m, energia em Joules); 2) Calcular a Energia Cinética E_c = (m · v²) / 2 ou a Energia Potencial E_pg = m · g · h; 3) Em sistemas conservativos (sem atrito), igualar a energia mecânica inicial à final (E_c1 + E_p1 = E_c2 + E_p2)."
          : "1) Identificar todas as forças que atuam sobre o corpo (Peso P = m·g, Normal N, Tração T e Força de Atrito F_at = μ·N em sentido oposto ao movimento); 2) Calcular a Força Resultante vetorial F_R (subtraindo forças de sentidos opostos); 3) Aplicar a 2ª Lei de Newton (F_R = m · a ⟹ a = F_R / m).",
        practicalExamples: isEnergy
          ? [
              "Um automóvel de massa m = 1.000 kg movendo-se a v = 20 m/s possui energia cinética E_c = ½ · 1.000 · (20²) = 500 · 400 = 200.000 J (200 kJ).",
              "Um corpo de 2 kg elevado a h = 5 m sob g = 10 m/s² armazena energia potencial gravitacional E_pg = 2 · 10 · 5 = 100 J."
            ]
          : [
              "Uma caixa de massa m = 8 kg submetida a uma força horizontal de 50 N para a direita contra uma força de atrito de 18 N para a esquerda possui força resultante F_R = 50 - 18 = 32 N e aceleração a = 32 / 8 = 4,0 m/s².",
              "Um veículo de massa m = 1.200 kg que parte do repouso e atinge 20 m/s em 5 s possui aceleração a = 20 / 5 = 4 m/s² e força resultante F_R = 1.200 · 4 = 4.800 N."
            ],
        importantRelations: isEnergy
          ? "Articula o Teorema do Trabalho-Energia Cinética (τ_R = ΔE_c) à conservação da Energia Mecânica total (E_m = E_c + E_p)."
          : "Relaciona diretamente o cálculo da Força Resultante (F_R = m · a) à variação de velocidade (aceleração) e às condições de equilíbrio dinâmico e estático.",
        formulaOrSyntax: isEnergy
          ? "τ = F · d · cosθ   |   E_c = ½ · m · v²   |   E_pg = m · g · h   |   E_m = E_c + E_p"
          : "F_R = m · a   |   P = m · g   |   F_at = μ · N   |   a = Δv / Δt",
        formulaInterpretation: isEnergy
          ? "Na energia cinética E_c = ½·m·v², a energia cresce com o quadrado da velocidade: dobrar a velocidade quadruplica a energia cinética."
          : "Na 2ª Lei de Newton (F_R = m · a), a aceleração 'a' tem sempre a mesma direção e sentido da força resultante F_R e é inversamente proporcional à massa m.",
        commonMistake: isEnergy
          ? "Esquecer de elevar a velocidade ao quadrado ou esquecer de dividir por 2 na fórmula da energia cinética E_c = (m · v²) / 2."
          : "Somar a força de atrito em vez de subtraí-la da força motriz, ou multiplicar F_R pela massa em vez de dividir (a = F_R / m).",
        mistakeCorrection: isEnergy
          ? "Elevar primeiro a velocidade ao quadrado (v²), multiplicar pela massa m e dividir o resultado por 2."
          : "Subtrair as forças que atuam em sentido oposto ao movimento para achar F_R e dividir F_R pela massa m para obter a aceleração a = F_R / m.",
        analogyExplanation: isEnergy
          ? "A Energia Potencial é como uma bateria carregada no alto de uma rampa (guardada pela altura h), que se transforma em Energia Cinética (velocidade v) conforme o carrinho desce!"
          : "Pense na 2ª Lei de Newton (F_R = m · a) como empurrar um carrinho de supermercado: quanto maior a força líquida (descontado o atrito), maior a aceleração; quanto mais pesado o carrinho (massa m), menor a aceleração para a mesma força!",
        gapIdentified: `Cálculo e aplicação das leis físicas em ${topicTitle}.`,
        keyTerms: isEnergy
          ? ["Trabalho de uma Força", "Energia Cinética (E_c = ½mv²)", "Energia Potencial Gravitacional e Elástica", "Conservação da Energia Mecânica", "Potência e Rendimento", "Teorema Trabalho-Energia"]
          : ["Inércia (1ª Lei de Newton)", "Força Resultante e 2ª Lei (F_R = m·a)", "Ação e Reação (3ª Lei)", "Força Peso e Força Normal", "Força de Atrito", "Aceleração e Massa Inercial"]
      };
    }

    if (norm.includes("term") || norm.includes("calor") || norm.includes("dilatação") || norm.includes("gases") || norm.includes("celsius") || norm.includes("kelvin")) {
      return {
        disciplineId: profile.id,
        disciplineName: profile.name,
        areaType: "exatas",
        topicTitle,
        moduleTitle,
        prerequisiteTitle: prereq,
        coreDefinition: `O estudo de "${topicTitle}" analisa a temperatura (grau de agitação térmica molecular), o calor como energia térmica em trânsito motivada por diferença de temperatura, a Equação Fundamental da Calorimetria para o calor sensível (Q = m · c · ΔT, onde ΔT = T_final − T_inicial), o calor latente de mudança de estado físico (Q = m · L) e o equilíbrio térmico.`,
        historicalContext:
          "No século XIX, James Prescott Joule demonstrou a equivalência mecânica entre trabalho e calor, enquanto Joseph Black estabeleceu a distinção experimental entre calor específico (sensível) e calor latente de fusão e vaporização.",
        mechanismsAndProcesses:
          "1) Calcular a variação de temperatura ΔT = T_final − T_inicial; 2) Aplicar Q = m · c · ΔT quando há variação de temperatura sem mudança de fase, ou Q = m · L durante a mudança de estado físico (temperatura constante em substâncias puras); 3) No equilíbrio térmico em sistema isolado, aplicar ΣQ_cedido + ΣQ_recebido = 0.",
        practicalExamples: [
          "Para aquecer m = 500 g de água líquida (c = 1,0 cal/g°C) de 20 °C até 60 °C (ΔT = 60 - 20 = 40 °C), a quantidade de calor sensível absorvida é Q = 500 · 1,0 · 40 = 20.000 cal (20 kcal).",
          "Para aquecer m = 200 g de água (c = 1,0 cal/g°C) de 20 °C até 50 °C (ΔT = 30 °C), são necessárias Q = 200 · 1,0 · 30 = 6.000 cal (6 kcal)."
        ],
        importantRelations:
          "Relaciona a variação de temperatura (ΔT), a massa (m) e o calor específico (c) à quantidade de calor sensível (Q = m · c · ΔT) e ao equilíbrio térmico entre corpos.",
        formulaOrSyntax: "ΔT = T_final − T_inicial   |   Q = m · c · ΔT   |   Q = m · L   |   ΣQ = 0",
        formulaInterpretation:
          "Em Q = m · c · ΔT, Q é o calor sensível (cal ou J), m é a massa (g ou kg), c é o calor específico da substância e ΔT é a diferença entre a temperatura final e a inicial.",
        commonMistake:
          "Usar apenas a temperatura final ou a inicial no lugar da variação de temperatura ΔT = T_final − T_inicial ao aplicar Q = m · c · ΔT, ou confundir calor sensível com calor latente.",
        mistakeCorrection:
          "Calcular sempre primeiro a variação térmica ΔT = T_final − T_inicial e depois multiplicar pela massa m e pelo calor específico c (Q = m · c · ΔT).",
        analogyExplanation:
          "O Calor Sensível (Q = m·c·ΔT) é aquele que o termômetro 'sente' porque muda a temperatura (ΔT ≠ 0); já o Calor Latente (Q = m·L) muda apenas o estado físico (como gelo derretendo a 0 °C constantes)!",
        gapIdentified: `Cálculo da variação de temperatura (ΔT = T_final − T_inicial) e aplicação de Q = m · c · ΔT em ${topicTitle}.`,
        keyTerms: ["Temperatura e Equilíbrio Térmico", "Calor Sensível (Q = m·c·ΔT)", "Variação de Temperatura (ΔT)", "Calor Específico e Capacidade Térmica", "Calor Latente (Q = m·L)", "Trocas de Calor"]
      };
    }

    const isOndasOptica = norm.includes("onda") || norm.includes("óptica") || norm.includes("optica") || norm.includes("luz") || norm.includes("espelho") || norm.includes("lente") || norm.includes("refração") || norm.includes("difração") || norm.includes("acústica") || norm.includes("som") || norm.includes("frequência");
    return {
      disciplineId: profile.id,
      disciplineName: profile.name,
      areaType: "exatas",
      topicTitle,
      moduleTitle,
      prerequisiteTitle: isOndasOptica
        ? "Relação entre velocidade de propagação, comprimento de onda e frequência na Equação Fundamental da Onda (v = λ · f)"
        : "Relação entre tensão elétrica (U), resistência (R), corrente elétrica (i) na 1ª Lei de Ohm (U = R · i) e potência elétrica (P = U · i)",
      coreDefinition: isOndasOptica
        ? `O estudo de "${topicTitle}" investiga a propagação de ondas mecânicas e eletromagnéticas (que transportam energia sem transportar matéria segundo a equação v = λ · f) e os fenômenos ondulatórios e ópticos de reflexão, refração, difração e interferência.`
        : `O estudo de "${topicTitle}" analisa os circuitos elétricos e fenômenos eletromagnéticos regidos pela 1ª Lei de Ohm (U = R · i), associação de resistores em série e em paralelo, potência elétrica (P = U · i = R · i² = U²/R) e consumo de energia elétrica (E = P · Δt).`,
      historicalContext: isOndasOptica
        ? "De Christiaan Huygens e Isaac Newton nos estudos sobre a propagação da luz e das ondas até a síntese eletromagnética de James Clerk Maxwell e os experimentos de Heinrich Hertz."
        : "De Charles-Augustin de Coulomb, Alessandro Volta e Georg Simon Ohm (que formulou a proporcionalidade entre tensão e corrente em 1827) até Michael Faraday e James Clerk Maxwell.",
      mechanismsAndProcesses: isOndasOptica
        ? "1) Identificar o comprimento de onda λ (em metros) e a frequência f = 1/T (em Hertz); 2) Aplicar a equação fundamental v = λ · f; 3) Na refração (mudança de meio), lembrar que a frequência f permanece constante enquanto a velocidade v e o comprimento de onda λ variam proporcionalmente."
        : "1) Identificar a tensão elétrica U (em Volts), a resistência R (em Ohms, Ω) e a corrente elétrica i (em Ampères, A); 2) Aplicar a 1ª Lei de Ohm (U = R · i ⟹ i = U / R); 3) Calcular a potência elétrica P = U · i (em Watts) e a energia consumida E = P · Δt (em Wh ou kWh).",
      practicalExamples: isOndasOptica
        ? [
            "Uma onda sonora de frequência f = 680 Hz propagando-se no ar com velocidade v = 340 m/s apresenta comprimento de onda λ = v / f = 340 / 680 = 0,5 metro.",
            "Quando um feixe de luz passa do ar para a água (refração), sua velocidade diminui e seu comprimento de onda diminui na mesma proporção, mas sua frequência (cor) permanece inalterada."
          ]
        : [
            "Um resistor de R = 20 Ω submetido a uma tensão U = 120 V é percorrido por uma corrente i = U / R = 120 / 20 = 6 A e dissipa uma potência P = U · i = 120 · 6 = 720 W.",
            "Um aparelho de potência P = 1.500 W (1,5 kW) ligado por Δt = 4 horas consome E = P · Δt = 1,5 · 4 = 6,0 kWh."
          ],
      importantRelations: isOndasOptica
        ? "Relaciona a velocidade de propagação da onda às características do meio material e a frequência exclusivamente à fonte emissora."
        : "Conecta a 1ª Lei de Ohm (U = R · i) ao dimensionamento de circuitos em série e paralelo e ao cálculo de potência e energia elétrica.",
      formulaOrSyntax: isOndasOptica
        ? "v = λ · f   |   f = 1 / T   |   n₁ · sen(θ₁) = n₂ · sen(θ₂)"
        : "U = R · i   |   P = U · i = R · i² = U² / R   |   E = P · Δt",
      formulaInterpretation: isOndasOptica
        ? "Na equação v = λ · f, a velocidade v depende apenas do meio de propagação e a frequência f depende apenas da fonte."
        : "Em U = R · i, para uma resistência ôhmica constante R, a corrente elétrica i é diretamente proporcional à tensão U aplicada.",
      commonMistake: isOndasOptica
        ? "Achar que a frequência de uma onda muda quando ela passa de um meio para outro (refração)."
        : "Multiplicar tensão por resistência em vez de dividir ao calcular a corrente (i = U / R), ou esquecer de dividir Wh por 1.000 para obter kWh.",
      mistakeCorrection: isOndasOptica
        ? "A frequência é determinada exclusivamente pela fonte emissora e não se altera na refração; mudam apenas a velocidade e o comprimento de onda."
        : "Para isolar a corrente elétrica na 1ª Lei de Ohm, divida a tensão pela resistência (i = U / R); para a potência, multiplique tensão por corrente (P = U · i).",
      analogyExplanation: isOndasOptica
        ? "Pense em passos caminhando (v = λ · f): o comprimento de onda (λ) é o tamanho de cada passo e a frequência (f) é quantos passos você dá por segundo; multiplicando os dois, você tem sua velocidade (v)!"
        : "Em um circuito elétrico, a Tensão (U, em Volts) é a pressão que empurra os elétrons, a Corrente (i, em Ampères) é o fluxo de cargas passando pelo fio, e a Resistência (R, em Ohms) é a oposição à passagem!",
      gapIdentified: `Aplicação das relações físicas em ${topicTitle}.`,
      keyTerms: isOndasOptica
        ? ["Equação Fundamental da Onda (v = λ·f)", "Frequência e Período", "Comprimento de Onda", "Reflexão e Refração", "Difração e Interferência", "Óptica e Acústica"]
        : ["1ª Lei de Ohm (U = R·i)", "Tensão, Corrente e Resistência", "Potência Elétrica (P = U·i)", "Consumo de Energia (kWh)", "Resistores em Série e Paralelo", "Eletrodinâmica"]
    };
  }

  // =========================================================================
  // 3. BIOLOGIA
  // =========================================================================
  if (profile.id === "biologia") {
    if (
      norm.includes("fotossíntese") ||
      norm.includes("fotossintese") ||
      norm.includes("calvin") ||
      norm.includes("rubisco") ||
      norm.includes("cloroplasto") ||
      norm.includes("tilacoide") ||
      norm.includes("fotólise") ||
      norm.includes("clorofila") ||
      norm.includes("c3") ||
      norm.includes("c4") ||
      norm.includes("cam")
    ) {
      const isCalvin =
        norm.includes("calvin") ||
        norm.includes("rubisco") ||
        norm.includes("fase química") ||
        norm.includes("fixação");
      return {
        disciplineId: profile.id,
        disciplineName: profile.name,
        areaType: "biologicas",
        topicTitle,
        moduleTitle,
        prerequisiteTitle: isCalvin
          ? "Atuação da enzima RuBisCO na fixação de CO₂ no estroma do cloroplasto e consumo de ATP e NADPH no Ciclo de Calvin-Benson"
          : "Compartimentalização do cloroplasto (tilacoides e estroma), absorção de luz pelas clorofilas e fotólise da água (H₂O) na liberação de O₂",
        coreDefinition: isCalvin
          ? `O estudo de "${topicTitle}" analisa a etapa química da fotossíntese (Ciclo de Calvin-Benson), realizada no estroma do cloroplasto, na qual a enzima RuBisCO fixa o gás carbônico (CO₂) na ribulose-1,5-bisfosfato (RuBP) e utiliza o ATP e o NADPH gerados na fase fotoquímica para reduzir o carbono fixado em gliceraldeído-3-fosfato (G3P), sintetizando carboidratos e regenerando a RuBP.`
          : `O estudo de "${topicTitle}" analisa o processo fotossintético nos cloroplastos: na fase fotoquímica (nas membranas dos tilacoides), a luz absorvida pelas clorofilas promove a fotólise da água (liberando O₂ a partir da H₂O) e produz ATP e NADPH, que em seguida alimentam a fixação de CO₂ no estroma para a síntese de glicídios.`,
        historicalContext:
          "Desde os experimentos de Jan Ingenhousz (1779) demonstrando o papel da luz nas partes verdes das plantas, até a comprovação isotópica de Ruben e Kamen (1941) de que o O₂ liberado na fotossíntese provém exclusivamente da água (H₂O) e a elucidação do Ciclo de Calvin-Benson (1950) com carbono-14.",
        mechanismsAndProcesses: isCalvin
          ? "1) Carboxilação (Fixação do Carbono) no estroma: a enzima RuBisCO incorpora o CO₂ à molécula aceptora de 5 carbonos (RuBP), originando moléculas de 3 carbonos (3-fosfoglicerato / PGA); 2) Redução: o PGA consome ATP e é reduzido pelo NADPH (vindos dos tilacoides) formando gliceraldeído-3-fosfato (G3P); 3) Regeneração: parte do G3P origina glicose e amido, enquanto a maior fração regenera a RuBP com gasto de ATP para manter o Ciclo de Calvin-Benson ativo."
          : "1) Fase Fotoquímica na membrana dos tilacoides: excitação luminosa das clorofilas nos fotossistemas II e I, fotólise da água (2 H₂O → 4 H⁺ + 4 e⁻ + O₂) e síntese de ATP e NADPH; 2) Fase Química no estroma do cloroplasto: consumo do ATP e do NADPH para fixar o CO₂ pela enzima RuBisCO e produzir carboidratos.",
        practicalExamples: isCalvin
          ? [
              "Para sintetizar 1 molécula de glicose (C₆H₁₂O₆), o Ciclo de Calvin-Benson fixa 6 moléculas de CO₂ pela ação da enzima RuBisCO no estroma do cloroplasto, consumindo 18 moléculas de ATP e 12 de NADPH fornecidos pela etapa fotoquímica.",
              "Em ambientes quentes e secos, plantas C4 (como milho e cana-de-açúcar) e CAM concentram previamente o CO₂ em torno da RuBisCO para evitar a fotorrespiração (ligação competitiva do O₂ ao sítio ativo da RuBisCO) e aumentar a eficiência do Ciclo de Calvin."
            ]
          : [
              "A marcação isotópica com oxigênio-18 (¹⁸O) comprovou que todo o gás oxigênio (O₂) liberado para a atmosfera na fotossíntese provém da quebra da molécula de água (fotólise da H₂O nos tilacoides), enquanto o oxigênio do CO₂ passa a integrar a glicose.",
              "Plantas de clima quente e seco possuem adaptações fotossintéticas como a via C4 (milho e cana-de-açúcar) e o metabolismo CAM (cactáceas que abrem os estômatos à noite) para minimizar a perda de água por transpiração."
            ],
        importantRelations: isCalvin
          ? "Conecta os produtos energéticos da fase fotoquímica (ATP e NADPH) à fixação enzimática do CO₂ pela RuBisCO no estroma para a síntese de carboidratos."
          : "Relaciona a captação luminosa pelas clorofilas e a fotólise da água nos tilacoides à liberação de O₂ e ao fornecimento de ATP e NADPH para a síntese orgânica no cloroplasto.",
        commonMistake: isCalvin
          ? "Achar que o Ciclo de Calvin-Benson ocorre no escuro de forma independente da fase fotoquímica ou afirmar que a RuBisCO libera O₂ a partir da quebra do CO₂."
          : "Achar que o oxigênio (O₂) liberado pelas plantas na fotossíntese provém do gás carbônico (CO₂) em vez da molécula de água (H₂O).",
        mistakeCorrection: isCalvin
          ? "Embora não utilize luz diretamente, o Ciclo de Calvin-Benson ocorre na presença de luz porque depende continuamente do ATP e do NADPH produzidos nos tilacoides, sendo a RuBisCO responsável por fixar o CO₂ na RuBP no estroma."
          : "O O₂ liberado na fotossíntese provém exclusivamente da fotólise da água (2 H₂O → 4 H⁺ + 4 e⁻ + O₂) nas membranas dos tilacoides durante a fase fotoquímica.",
        analogyExplanation:
          "Pense no cloroplasto como uma unidade solar dividida em dois compartimentos: os tilacoides captam a luz solar e quebram a água para carregar o ATP e o NADPH (liberando O₂), enquanto o estroma (Ciclo de Calvin-Benson) utiliza esse ATP e NADPH para que a enzima RuBisCO una o CO₂ e produza carboidratos!",
        gapIdentified: isCalvin
          ? `Papel da enzima RuBisCO, da RuBP e do consumo de ATP e NADPH nas etapas de fixação, redução e regeneração do Ciclo de Calvin-Benson em ${topicTitle}.`
          : `Relação entre tilacoides (fotólise da água e produção de ATP/NADPH) e estroma na realização da fotossíntese em ${topicTitle}.`,
        keyTerms: isCalvin
          ? ["Estroma do Cloroplasto", "Ciclo de Calvin-Benson", "Enzima RuBisCO e RuBP", "Fixação de CO₂", "Consumo de ATP e NADPH", "Síntese de G3P e Glicose"]
          : ["Cloroplasto e Tilacoides", "Clorofila e Fotossistemas", "Fotólise da Água (Liberação de O₂)", "Síntese de ATP e NADPH", "Estroma e Fixação de Carbono", "Fotossíntese"]
      };
    }

    if (
      norm.includes("respiração celular") ||
      norm.includes("glicólise") ||
      norm.includes("krebs") ||
      norm.includes("fosforilação") ||
      norm.includes("mitocôndria") ||
      norm.includes("fermentação") ||
      norm.includes("atp")
    ) {
      return {
        disciplineId: profile.id,
        disciplineName: profile.name,
        areaType: "biologicas",
        topicTitle,
        moduleTitle,
        prerequisiteTitle: "Etapas da respiração celular aeróbica (glicólise no citosol, Ciclo de Krebs na matriz mitocondrial e fosforilação oxidativa nas cristas) e fermentação",
        coreDefinition: `O estudo de "${topicTitle}" analisa a obtenção de energia celular (ATP) pela oxidação de compostos orgânicos: na respiração celular aeróbica — dividida em glicólise (no citosol/hialoplasma), Ciclo de Krebs (na matriz mitocondrial) e cadeia respiratória com fosforilação oxidativa (nas cristas mitocondriais, tendo o O₂ como aceptor final de elétrons) — e nos processos anaeróbicos de fermentação lática e alcoólica.`,
        historicalContext:
          "A elucidação da glicólise (Embden-Meyerhof), do Ciclo do Ácido Cítrico por Hans Krebs (1937) e da teoria quimiosmótica da fosforilação oxidativa por Peter Mitchell demonstrou como as mitocôndrias convertem a energia química da glicose em moléculas de ATP.",
        mechanismsAndProcesses:
          "1) Glicólise no citosol (anaeróbica): quebra de 1 glicose (6C) em 2 piruvatos (3C), com saldo de 2 ATP e 2 NADH; 2) Ciclo de Krebs na matriz mitocondrial: oxidação completa do acetil-CoA liberando CO₂ e gerando NADH, FADH₂ e ATP; 3) Fosforilação Oxidativa nas cristas mitocondriais: transferência de elétrons até o O₂ (formando água) acoplada à síntese da maior parte do ATP pela ATP-sintase.",
        practicalExamples: [
          "Nas cristas mitocondriais, o gás oxigênio (O₂) atua como o aceptor final de elétrons e íons H⁺ da cadeia respiratória, formando água metabólica (H₂O) e permitindo o bombeamento de prótons que aciona a síntese de ATP.",
          "Na ausência de oxigênio, células musculares sob esforço intenso ou bactérias lactobacilos realizam fermentação lática no citosol (convertendo piruvato em ácido lático), enquanto leveduras realizam fermentação alcoólica (produzindo etanol e CO₂)."
        ],
        importantRelations:
          "Relaciona a compartimentalização entre citosol, matriz mitocondrial e cristas mitocondriais ao rendimento energético de ATP na presença ou ausência de oxigênio.",
        commonMistake:
          "Achar que a glicólise ocorre dentro da mitocôndria (ela ocorre no citosol) ou confundir o papel do O₂ (aceptor final de elétrons nas cristas mitocondriais) com a liberação de CO₂ (que ocorre na oxidação do piruvato e no Ciclo de Krebs).",
        mistakeCorrection:
          "A glicólise ocorre sempre no citosol (hialoplasma); o Ciclo de Krebs ocorre na matriz mitocondrial (liberando CO₂); e a fosforilação oxidativa ocorre nas cristas mitocondriais (consumindo O₂ para formar H₂O e a maior parte do ATP).",
        analogyExplanation:
          "Pense na respiração celular como uma usina em três etapas: no citosol (Glicólise) a glicose é dividida ao meio; na matriz da mitocôndria (Ciclo de Krebs) os carbonos são oxidados carregando transportadores de elétrons (NADH e FADH₂); e nas cristas mitocondriais (Fosforilação Oxidativa) esses elétrons movem a turbina (ATP-sintase) que fabrica a maior quantidade de ATP!",
        gapIdentified: `Localização celular e função da glicólise, Ciclo de Krebs, fosforilação oxidativa e fermentação em ${topicTitle}.`,
        keyTerms: ["Glicólise no Citosol", "Matriz Mitocondrial e Ciclo de Krebs", "Cristas Mitocondriais e Fosforilação Oxidativa", "Oxigênio como Aceptor Final", "Síntese de ATP", "Fermentação Lática e Alcoólica"]
      };
    }

    if (
      norm.includes("dna") ||
      norm.includes("rna") ||
      norm.includes("proteica") ||
      norm.includes("transcrição") ||
      norm.includes("tradução") ||
      norm.includes("códon") ||
      norm.includes("ácidos nucleicos") ||
      norm.includes("replicação") ||
      norm.includes("splicing") ||
      norm.includes("antiparalel") ||
      norm.includes("pareamento") ||
      norm.includes("dupla hélice") ||
      norm.includes("dupla-hélice")
    ) {
      const isTranslationFocus =
        (norm.includes("tradução") || norm.includes("códon") || norm.includes("síntese proteica")) &&
        !norm.includes("antiparalel") &&
        !norm.includes("pareamento") &&
        !norm.includes("dupla hélice") &&
        !norm.includes("dupla-hélice");
      return {
        disciplineId: profile.id,
        disciplineName: profile.name,
        areaType: "biologicas",
        topicTitle,
        moduleTitle,
        prerequisiteTitle: isTranslationFocus
          ? "Leitura de trincas de bases do RNAm (códons, iniciando em AUG) pelos anticódons do RNAt nos ribossomos e formação de ligações peptídicas"
          : "Antiparalelismo das fitas (3'→5' e 5'→3') e pareamento complementar de bases nitrogenadas no DNA (A-T, C-G) e no RNA (A-U, C-G)",
        coreDefinition: isTranslationFocus
          ? `O estudo de "${topicTitle}" analisa o código genético (universal e degenerado, organizado em 64 códons) e o processo de tradução nos ribossomos, em que cada trinca de bases do RNA mensageiro (códon) é reconhecida pelo anticódon complementar do RNA transportador (RNAt) para unir aminoácidos específicos por ligações peptídicas.`
          : `O estudo de "${topicTitle}" analisa a estrutura em dupla-hélice antiparalela do DNA (uma fita no sentido 5'→3' e a complementar no sentido 3'→5'), o pareamento específico de bases nitrogenadas por pontes de hidrogênio no DNA (Adenina com Timina, A=T; Citosina com Guanina, C≡G) e na transcrição do RNA (leitura do molde 3'→5' para sintetizar o RNA no sentido 5'→3', substituindo Timina por Uracila: A-U, T-A e C-G).`,
        historicalContext:
          "Em 1953, James Watson, Francis Crick, Rosalind Franklin e Maurice Wilkins elucidaram a estrutura em dupla-hélice antiparalela do DNA com base nas regras de complementaridade de Erwin Chargaff ([A]=[T] e [C]=[G]).",
        mechanismsAndProcesses: isTranslationFocus
          ? "1) Iniciação: acoplamento do ribossomo ao códon de início AUG (Metionina) no RNAm; 2) Alongamento: leitura dos códons no sentido 5'→3' pelo pareamento com os anticódons do RNAt e formação de ligações peptídicas entre aminoácidos; 3) Terminação: reconhecimento de um códon de parada (UAA, UAG ou UGA) com liberação da cadeia polipeptídica."
          : "1) Orientação antiparalela: identificar o sentido da fita molde de DNA (3'→5') e inverter para o sentido antiparalelo (5'→3') na fita complementar sintetizada; 2) Pareamento no DNA (replicação semiconservativa): Adenina (A) pareia com Timina (T) e Citosina (C) pareia com Guanina (G); 3) Pareamento na transcrição do RNA: onde há Adenina (A) no molde de DNA entra Uracila (U) no RNA, onde há Timina (T) entra Adenina (A), e Citosina (C) pareia com Guanina (G).",
        practicalExamples: isTranslationFocus
          ? [
              "No código genético universal e degenerado, 64 códons possíveis codificam 20 aminoácidos (iniciando em AUG e encerrando em UAA, UAG ou UGA), razão pela qual mutações silenciosas na 3ª base do códon podem manter o mesmo aminoácido.",
              "Durante a tradução ribossômica, cada RNAt porta um anticódon complementar ao códon do RNAm e entrega o aminoácido correspondente à cadeia polipeptídica em crescimento."
            ]
          : [
              "Se uma fita molde de DNA possui a sequência 3'- TAC GGT CGA -5', a fita complementar de DNA terá a sequência antiparalela 5'- ATG CCA GCT -3' (pareando A-T e C-G), e o RNA mensageiro transcrito terá a sequência 5'- AUG CCA GCU -3' (substituindo T por U).",
              "Pela Regra de Chargaff na dupla-hélice de DNA, se um segmento de fita dupla possui 20% de Adenina (A), terá obrigatoriamente 20% de Timina (T), restando 60% divididos igualmente em 30% de Citosina (C) e 30% de Guanina (G)."
            ],
        importantRelations: isTranslationFocus
          ? "Conecta a sequência de códons do RNA mensageiro à sequência primária de aminoácidos da proteína sintetizada nos ribossomos."
          : "Relaciona diretamente o antiparalelismo das fitas (3'→5' e 5'→3') e a especificidade do pareamento complementar de bases nitrogenadas (A-T/A-U e C-G) à fidelidade da replicação do DNA e da transcrição do RNA.",
        commonMistake: isTranslationFocus
          ? "Confundir códon (trinca de bases no RNAm) com anticódon (trinca complementar no RNAt) ou achar que os códons de parada (UAA, UAG, UGA) codificam aminoácidos."
          : "Inserir a base Timina (T) na fita de RNA em vez da Uracila (U), ou esquecer de inverter a orientação antiparalela das fitas (molde 3'→5' gera fita complementar 5'→3').",
        mistakeCorrection: isTranslationFocus
          ? "Ler os códons do RNAm no sentido 5'→3' a partir do códon de iniciação AUG até encontrar um códon de parada (UAA, UAG ou UGA)."
          : "Verificar sempre a orientação antiparalela (molde 3'→5' → fita complementar 5'→3') e respeitar o pareamento específico de bases: A com T (no DNA) ou A com U (no RNA), T com A, e C com G.",
        analogyExplanation:
          "Pense nas duas fitas de DNA como duas vias paralelas de mão contrária (uma 3'→5' e outra 5'→3') unidas por degraus de encaixe exclusivo: A só encaixa com T (ou com U no RNA) e C só encaixa com G!",
        gapIdentified: `Pareamento complementar de bases nitrogenadas e antiparalelismo das fitas (3'→5' e 5'→3') em ${topicTitle}.`,
        keyTerms: isTranslationFocus
          ? ["Código Genético (Códons)", "Anticódon e RNAt", "Códon de Início (AUG)", "Códons de Parada (UAA, UAG, UGA)", "Ribossomos e Ligação Peptídica", "Tradução e Síntese Proteica"]
          : ["Pareamento Complementar de Bases (A-T, A-U e C-G)", "Antiparalelismo das Fitas (3'→5' e 5'→3')", "Dupla-Hélice do DNA", "Regra de Chargaff", "Substituição de Timina por Uracila no RNA", "Replicação e Transcrição"]
      };
    }

    if (
      norm.includes("mitose") ||
      norm.includes("meiose") ||
      norm.includes("divisão celular") ||
      norm.includes("ciclo celular") ||
      norm.includes("interfase") ||
      norm.includes("gametogênese")
    ) {
      return {
        disciplineId: profile.id,
        disciplineName: profile.name,
        areaType: "biologicas",
        topicTitle,
        moduleTitle,
        prerequisiteTitle: "Fases da Interfase (G1, S e G2), ploidia celular (2n vs. n) e diferença entre divisão equacional (Mitose) e reducional (Meiose)",
        coreDefinition: `O estudo de "${topicTitle}" analisa o ciclo celular — composto pela Interfase (fases G1, S de duplicação do DNA e G2) e pela divisão celular — diferenciando a Mitose (divisão equacional em que uma célula-mãe origina duas células-filhas geneticamente idênticas com a mesma ploidia) da Meiose (divisão reducional em duas etapas que reduz o número de cromossomos pela metade, 2n → n, gerando quatro células haploides com variabilidade genética pelo crossing-over e segregação independente).`,
        historicalContext:
          "Descritas citologicamente no final do século XIX por Walther Flemming (mitose) e Oscar Hertwig e Edouard van Beneden (meiose), as divisões celulares fundamentaram a Teoria Cromossômica da Herança de Sutton e Boveri.",
        mechanismsAndProcesses:
          "1) Verificar que a duplicação do DNA ocorre na fase S da Interfase (antes do início da divisão); 2) Na Mitose (Prófase, Metáfase, Anáfase com separação das cromátides-irmãs e Telófase), manter o número cromossômico constante para crescimento e regeneração tecidual; 3) Na Meiose I (Prófase I com permutação/crossing-over, Metáfase I, Anáfase I com separação dos cromossomos homólogos) e Meiose II (separação das cromátides-irmãs), produzir gametas haploides (n).",
        practicalExamples: [
          "Em uma célula humana diploide (2n = 46 cromossomos), após a duplicação do DNA na fase S da interfase, a célula entra em divisão com 46 cromossomos duplicados (92 cromátides): a mitose origina 2 células com 2n = 46, enquanto a meiose origina 4 gametas haploides com n = 23 cromossomos.",
          "Na Prófase I da Meiose ocorre o pareamento dos cromossomos homólogos (sinapse) e a permutação (crossing-over), trocando segmentos entre cromátides homólogas e aumentando a variabilidade genética dos gametas."
        ],
        importantRelations:
          "Relaciona a duplicação semiconservativa do DNA na fase S da Interfase ao comportamento das cromátides-irmãs e dos cromossomos homólogos nas fases da Mitose e da Meiose.",
        commonMistake:
          "Afirmar que o DNA se duplica durante a prófase da mitose/meiose (ele se duplica na fase S da Interfase) ou confundir a Anáfase I da meiose (separação de cromossomos homólogos) com a Anáfase da mitose (separação de cromátides-irmãs).",
        mistakeCorrection:
          "A duplicação do DNA ocorre exclusivamente no período S da Interfase. Na Anáfase da Mitose e na Anáfase II da Meiose separam-se as cromátides-irmãs, enquanto na Anáfase I da Meiose separam-se os cromossomos homólogos duplicados.",
        analogyExplanation:
          "Pense na Mitose como tirar uma fotocópia fiel de um conjunto de cromossomos para formar duas células iguais (2n → 2n), e na Meiose como dividir os pares de cromossomos homólogos ao meio após embaralhar trechos (crossing-over) para formar gametas (2n → n)!",
        gapIdentified: `Diferenciação entre as etapas da Interfase, Mitose e Meiose e variação da quantidade de DNA e cromossomos em ${topicTitle}.`,
        keyTerms: ["Interfase (Fases G1, S e G2)", "Mitose (Divisão Equacional)", "Meiose I e II (Divisão Reducional)", "Prófase, Metáfase, Anáfase e Telófase", "Cromossomos Homólogos e Cromátides-Irmãs", "Crossing-Over (Permutação)"]
      };
    }

    if (
      norm.includes("genética") ||
      norm.includes("mendel") ||
      norm.includes("alelo") ||
      norm.includes("sangue") ||
      norm.includes("abo") ||
      norm.includes("heredograma") ||
      norm.includes("dominância") ||
      norm.includes("herança") ||
      norm.includes("cromossomo")
    ) {
      return {
        disciplineId: profile.id,
        disciplineName: profile.name,
        areaType: "biologicas",
        topicTitle,
        moduleTitle,
        prerequisiteTitle: "Distinção entre genótipo e fenótipo, alelos dominantes e recessivos (homozigose e heterozigose) e segregação de alelos na formação de gametas",
        coreDefinition: `O estudo de "${topicTitle}" analisa os mecanismos de transmissão hereditária das características biológicas: a 1ª Lei de Mendel (segregação de um par de alelos na formação dos gametas), a 2ª Lei de Mendel (segregação independente de dois ou mais pares de genes não ligados), a interpretação de heredogramas e os casos de codominância e polialelia (como o sistema sanguíneo ABO e o fator Rh).`,
        historicalContext:
          "Gregor Mendel (1865) formulou os princípios fundamentais da hereditariedade a partir de cruzamentos estatísticos controlados com ervilhas (Pisum sativum), redescobertos em 1900 por De Vries, Correns e Tschermak.",
        mechanismsAndProcesses:
          "1) Identificar os alelos envolvidos (dominante A vs. recessivo a, ou alelos múltiplos I^A, I^B e i no sistema ABO) e o genótipo dos parentais (homozigoto AA/aa ou heterozigoto Aa); 2) Determinar os tipos e proporções de gametas produzidos por cada parental; 3) Montar o Quadro de Punnett e calcular as probabilidades genotípicas e fenotípicas da descendência.",
        practicalExamples: [
          "No cruzamento entre dois indivíduos heterozigotos (Aa × Aa) segundo a 1ª Lei de Mendel, obtém-se a proporção genotípica de 1/4 AA (25%), 2/4 Aa (50%) e 1/4 aa (25%), resultando na proporção fenotípica de 3 dominantes (75%) para 1 recessivo (25%).",
          "No sistema sanguíneo ABO (polialelia e codominância entre I^A e I^B sobre o recessivo i), um casal formado por mãe tipo A heterozigota (I^A i) e pai tipo B heterozigoto (I^B i) pode ter filhos dos quatro grupos sanguíneos: AB (I^A I^B), A (I^A i), B (I^B i) ou O (ii), com 25% de chance para cada um."
        ],
        importantRelations:
          "Relaciona a segregação dos alelos durante a formação dos gametas ao cálculo de probabilidades genéticas em cruzamentos e heredogramas familiares.",
        commonMistake:
          "Confundir genótipo (constituição alélica do indivíduo, ex: Aa) com fenótipo (característica manifestada resultante da interação do genótipo com o meio), ou esquecer que pais fenotipicamente normais que têm um filho afetado por característica recessiva (aa) são obrigatoriamente heterozigotos (Aa).",
        mistakeCorrection:
          "Em heredogramas, sempre que dois genitores de mesmo fenótipo originam um descendente com fenótipo diferente, o fenótipo do filho é recessivo (aa) e ambos os pais são portadores heterozigotos (Aa).",
        analogyExplanation:
          "Pense no Quadro de Punnett como uma tabela de combinações possíveis entre as moedas genéticas do pai e da mãe: cada pai entrega 1 alelo por gameta, e o cruzamento das linhas e colunas mostra todas as combinações genotípicas possíveis para os filhos!",
        gapIdentified: `Montagem do Quadro de Punnett, segregação de alelos e cálculo de proporções genotípicas e fenotípicas em ${topicTitle}.`,
        keyTerms: ["1ª e 2ª Leis de Mendel", "Genótipo e Fenótipo", "Homozigoto e Heterozigoto", "Alelos Dominantes e Recessivos", "Quadro de Punnett e Heredogramas", "Sistema ABO e Polialelia"]
      };
    }

    if (
      norm.includes("membrana") ||
      norm.includes("osmose") ||
      norm.includes("difusão") ||
      norm.includes("transporte") ||
      norm.includes("bomba de sódio") ||
      norm.includes("fagocitose") ||
      norm.includes("endocitose")
    ) {
      return {
        disciplineId: profile.id,
        disciplineName: profile.name,
        areaType: "biologicas",
        topicTitle,
        moduleTitle,
        prerequisiteTitle: "Estrutura da membrana plasmática (modelo mosaico fluido), gradiente de concentração e diferença entre transporte passivo e transporte ativo",
        coreDefinition: `O estudo de "${topicTitle}" analisa a estrutura lipoproteica da membrana plasmática (modelo do Mosaico Fluido com bicamada de fosfolipídios e proteínas) e os mecanismos de permeabilidade seletiva: Transporte Passivo a favor do gradiente sem gasto de energia (difusão simples, difusão facilitada por permeases e osmose) e Transporte Ativo contra o gradiente de concentração com gasto de ATP (como a bomba de sódio e potássio Na⁺/K⁺), além do transporte em bloco por endocitose e exocitose.`,
        historicalContext:
          "O modelo do Mosaico Fluido da membrana plasmática foi formulado por S. J. Singer e Garth Nicolson em 1972, e o mecanismo enzimático da bomba de Na⁺/K⁺ ATPase foi demonstrado por Jens Christian Skou.",
        mechanismsAndProcesses:
          "1) No Transporte Passivo (sem gasto de ATP): os solutos movem-se do meio mais concentrado (hipertônico) para o menos concentrado (hipotônico) na difusão simples e facilitada, enquanto na Osmose o solvente (água) atravessa a membrana semipermeável do meio hipotônico (menos concentrado em soluto) para o meio hipertônico (mais concentrado em soluto); 2) No Transporte Ativo (com hidrólise de ATP): proteínas carreadoras bombeiam íons contra o gradiente de concentração (do meio menos concentrado para o mais concentrado).",
        practicalExamples: [
          "Quando hemácias humanas são colocadas em uma solução hipertônica (alta concentração de sal), perdem água por osmose para o meio externo e sofrem crenação (murcham); em solução hipotônica (água destilada), ganham água por osmose e podem sofrer hemólise.",
          "A bomba de sódio e potássio (Na⁺/K⁺ ATPase) consome ATP para bombear ativamente 3 íons Na⁺ para fora da célula e 2 íons K⁺ para dentro da célula contra seus gradientes de concentração."
        ],
        importantRelations:
          "Relaciona a bicamada fosfolipídica e as proteínas de membrana ao controle osmótico celular e à manutenção dos gradientes iônicos através da membrana.",
        commonMistake:
          "Inverter o sentido da osmose (achar que a água se desloca do meio hipertônico para o hipotônico) ou afirmar que a difusão facilitada e a osmose gastam ATP.",
        mistakeCorrection:
          "Na osmose, é o solvente (ÁGUA) que se desloca passivamente (sem gasto de ATP) do meio hipotônico (menor concentração de soluto) para o meio hipertônico (maior concentração de soluto). O gasto de ATP ocorre no transporte ativo contra o gradiente.",
        analogyExplanation:
          "O transporte passivo (difusão e osmose) é como descer uma correnteza a favor do fluxo sem gastar energia; já o transporte ativo (bomba de Na⁺/K⁺) é remar contra a correnteza, exigindo gasto direto de energia (ATP)!",
        gapIdentified: `Sentido do fluxo na osmose e difusão e distinção entre transporte passivo (sem ATP) e ativo (com ATP) em ${topicTitle}.`,
        keyTerms: ["Membrana Plasmática (Mosaico Fluido)", "Permeabilidade Seletiva", "Osmose (Meio Hipotônico para Hipertônico)", "Difusão Simples e Facilitada", "Transporte Ativo e Bomba de Na⁺/K⁺", "Endocitose e Exocitose"]
      };
    }

    if (
      norm.includes("fisiologia") ||
      norm.includes("digest") ||
      norm.includes("circula") ||
      norm.includes("cardiovascular") ||
      norm.includes("respira") ||
      norm.includes("excre") ||
      norm.includes("néfron") ||
      norm.includes("nervos") ||
      norm.includes("neurônio") ||
      norm.includes("sinapse") ||
      norm.includes("endócrin") ||
      norm.includes("hormôn") ||
      norm.includes("imun") ||
      norm.includes("vacina") ||
      norm.includes("soro") ||
      norm.includes("homeostase")
    ) {
      return {
        disciplineId: profile.id,
        disciplineName: profile.name,
        areaType: "biologicas",
        topicTitle,
        moduleTitle,
        prerequisiteTitle: `Mecanismo fisiológico, estruturas anatômicas/celulares atuantes e regulação da homeostase em ${topicTitle}`,
        coreDefinition: `Na Fisiologia Biológica, o estudo de "${topicTitle}" investiga os mecanismos funcionais, anatômicos e reguladores dos sistemas orgânicos responsáveis pela manutenção da homeostase — compreendendo a integração entre órgãos, tecidos, enzimas digestivas, trocas gasosas e transporte sanguíneo, filtração renal, condução de impulsos nervosos, sinalização hormonal endócrina e resposta imunológica (imunidade ativa por vacinas e passiva por soros).`,
        historicalContext:
          "O conceito de estabilidade do meio interno foi formulado por Claude Bernard no século XIX e denominado 'homeostase' por Walter Cannon no século XX, estruturando a fisiologia médica e comparada moderna.",
        mechanismsAndProcesses:
          "1) Identificar os órgãos, células especializadas e mediadores químicos (enzimas, hormônios, neurotransmissores ou anticorpos) que atuam especificamente no processo de " +
          topicTitle +
          "; 2) Analisar as condições fisiológicas (como pH específico de cada enzima digestiva ou mecanismos de feedback negativo hormonal); 3) Relacionar a etapa funcional à manutenção do equilíbrio interno do organismo.",
        practicalExamples: [
          "Na fisiologia digestória humana, cada enzima atua em uma faixa ótima de pH: a amilase salivar (ptialina) atua sobre o amido em pH neutro (~7,0) na boca; a pepsina digere proteínas em pH fortemente ácido (~2,0) no estômago; e a tripsina atua em pH alcalino (~8,0) no duodeno.",
          "Na fisiologia imunológica, a vacina contém antígenos atenuados ou inativados que estimulam o organismo a produzir anticorpos e células de memória (imunização ativa e duradoura), enquanto o soro fornece anticorpos prontos para neutralização imediata de toxinas (imunização passiva)."
        ],
        importantRelations:
          "Articula a função específica de cada órgão e mediador fisiológico aos mecanismos de retroalimentação (feedback) que mantêm a homeostase do organismo.",
        commonMistake:
          "Confundir a função preventiva da vacina (antígenos que geram memória imunológica ativa) com a ação curativa imediata do soro (anticorpos prontos), ou trocar o pH ótimo de atuação das enzimas digestivas.",
        mistakeCorrection:
          "Relacionar sempre cada estrutura fisiológica ao seu mediador e condição específica: vacinas induzem produção ativa de anticorpos e memória; soros entregam anticorpos prontos; e enzimas dependem de temperatura e pH específicos.",
        analogyExplanation:
          "A Homeostase funciona como um termostato inteligente do organismo: quando uma variável fisiológica sobe ou desce além do normal, os sistemas nervoso, endócrino e orgânicos acionam respostas compensatórias para restaurar o equilíbrio!",
        gapIdentified: `Identificação do mecanismo fisiológico específico e sua função reguladora em ${topicTitle}.`,
        keyTerms: ["Homeostase e Feedback", "Sistemas Fisiológicos", "Ação Enzimática e pH", "Condução Nervosa e Regulação Hormonal", "Imunização Ativa (Vacina) vs Passiva (Soro)", "Fisiologia Humana e Comparada"]
      };
    }

    if (
      norm.includes("evolução") ||
      norm.includes("darwin") ||
      norm.includes("lamarck") ||
      norm.includes("seleção natural") ||
      norm.includes("especiação") ||
      norm.includes("adaptação") ||
      norm.includes("neodarwinismo") ||
      norm.includes("origem da vida")
    ) {
      return {
        disciplineId: profile.id,
        disciplineName: profile.name,
        areaType: "biologicas",
        topicTitle,
        moduleTitle,
        prerequisiteTitle: "Diferença entre Lamarckismo e Darwinismo, papel da Seleção Natural e fontes de variabilidade genética (mutação e recombinação) no Neodarwinismo",
        coreDefinition: `No estudo de Evolução Biológica em "${topicTitle}", analisa-se a transformação das populações ao longo do tempo por meio da Seleção Natural (proposta por Charles Darwin e Alfred Russel Wallace) integrada à Genética na Teoria Sintética da Evolução (Neodarwinismo): as mutações e a recombinação gênica geram variabilidade genética ao acaso, e o ambiente seleciona os indivíduos portadores de características adaptativas favoráveis, que deixam mais descendentes, podendo levar à especiação (isolamento geográfico e reprodutivo).`,
        historicalContext:
          "Jean-Baptiste de Lamarck (1809) propôs o transformismo baseado na lei do uso e desuso e na transmissão dos caracteres adquiridos; em 1859, Charles Darwin publicou 'A Origem das Espécies' demonstrando a evolução por Seleção Natural, ampliada no século XX pelo Neodarwinismo (Dobzhansky, Mayr, Simpson).",
        mechanismsAndProcesses:
          "1) Distinguir a explicação lamarckista (o ambiente cria a necessidade e o esforço modifica o organismo, transmitindo o caráter adquirido) da explicação darwinista/neodarwinista (a variabilidade genética já existe na população por mutação aleatória e recombinação, e o ambiente seleciona os mais aptos); 2) Analisar como o isolamento geográfico seguido de diferenciação genética e isolamento reprodutivo origina novas espécies (especiação alopátrica).",
        practicalExamples: [
          "O uso inadequado de antibióticos não faz as bactérias sofrerem mutação 'para se defenderem' (visão lamarckista incorreta); na verdade, o antibiótico elimina as bactérias sensíveis e seleciona as cepas mutantes resistentes que já existiam na população (Seleção Natural), que passam a se reproduzir.",
          "Quando uma barreira geográfica (como um rio ou cadeia montanhosa) divide uma população ancestral em dois grupos isolados submetidos a pressões seletivas diferentes até atingirem isolamento reprodutivo, ocorre especiação alopátrica."
        ],
        importantRelations:
          "Articula a geração aleatória de variabilidade genética (mutação e crossing-over/recombinação) à ação direcionadora da Seleção Natural e aos mecanismos de isolamento reprodutivo na especiação.",
        commonMistake:
          "Explicar a adaptação evolutiva de forma finalista/lamarckista, afirmando que os seres vivos 'sofrem mutação para se adaptar ao ambiente' ou 'se acostumam' ao antibiótico/inseticida.",
        mistakeCorrection:
          "As mutações ocorrem de forma aleatória (ao acaso), independentemente de serem úteis ou não; o ambiente atua depois, selecionando os indivíduos que já possuem características vantajosas para sobreviver e reproduzir (Seleção Natural).",
        analogyExplanation:
          "Na Evolução, a Mutação e a Recombinação sorteiam cartas variadas na população ao acaso, enquanto a Seleção Natural é o filtro do ambiente que permite que os portadores das combinações mais favoráveis sobrevivam e passem seus genes adiante!",
        gapIdentified: `Distinção entre Lamarckismo e Seleção Natural Darwinista/Neodarwinista em ${topicTitle}.`,
        keyTerms: ["Seleção Natural (Darwin e Wallace)", "Lamarckismo (Uso e Desuso)", "Teoria Sintética da Evolução (Neodarwinismo)", "Mutação e Recombinação Gênica", "Adaptação Evolutiva", "Isolamento Reprodutivo e Especiação"]
      };
    }

    if (
      norm.includes("ecologia") ||
      norm.includes("cadeia") ||
      norm.includes("trófic") ||
      norm.includes("biogeoquímic") ||
      norm.includes("nitrogênio") ||
      norm.includes("carbono") ||
      norm.includes("relações ecológicas") ||
      norm.includes("sucessão") ||
      norm.includes("ecossistema") ||
      norm.includes("populações") ||
      norm.includes("pirâmide")
    ) {
      return {
        disciplineId: profile.id,
        disciplineName: profile.name,
        areaType: "biologicas",
        topicTitle,
        moduleTitle,
        prerequisiteTitle: "Níveis tróficos (produtores, consumidores e decompositores), fluxo unidirecional de energia e ciclagem da matéria nos ecossistemas",
        coreDefinition: `No estudo de Ecologia em "${topicTitle}", analisa-se a estrutura e funcionamento dos ecossistemas: a organização dos níveis tróficos nas cadeias e teias alimentares (produtores autótrofos, consumidores primários, secundários, terciários e decompositores), o fluxo unidirecional e decrescente de energia (pirâmides ecológicas), a reciclagem cíclica da matéria nos ciclos biogeoquímicos (carbono, nitrogênio, água e oxigênio), as relações ecológicas intra e interespecíficas e a sucessão ecológica.`,
        historicalContext:
          "O termo 'Ecologia' foi cunhado por Ernst Haeckel em 1866, e a ecologia quantitativa de ecossistemas e fluxo energético foi sistematizada no século XX por Raymond Lindeman (lei dos 10% de transferência trófica) e Eugene Odum.",
        mechanismsAndProcesses:
          "1) Identificar a posição de cada organismo na cadeia alimentar (Produtores no 1º nível trófico → Consumidores Primários/herbívoros no 2º nível → Consumidores Secundários/carnívoros no 3º nível → Decompositores reciclando a matéria orgânica em inorgânica); 2) Compreender que a energia flui de modo unidirecional e diminui a cada nível trófico (dissipação metabólica e calor), enquanto os elementos químicos realizam ciclos fechados (ciclos biogeoquímicos); 3) Classificar as interações ecológicas em harmônicas (+/+, +/0) e desarmônicas (+/-, -/-).",
        practicalExamples: [
          "Em uma cadeia alimentar 'Capim (Produtor) → Gafanhoto (Consumidor Primário) → Sapo (Consumidor Secundário) → Serpente (Consumidor Terciário)', a quantidade de energia disponível diminui progressivamente do produtor para o topo, mas poluentes não biodegradáveis (como mercúrio ou DDT) sofrem magnificação trófica (bioacumulação crescente no topo).",
          "No ciclo biogeoquímico do nitrogênio, bactérias fixadoras (como Rhizobium nas raízes de leguminosas) convertem N₂ atmosférico em amônia, bactérias nitrificantes (Nitrosomonas e Nitrobacter) produzem nitrito e nitrato assimilável pelas plantas, e bactérias desnitrificantes devolvem o N₂ à atmosfera."
        ],
        importantRelations:
          "Conecta a produtividade primária e a reciclagem da matéria pelos decompositores e bactérias do ciclo do nitrogênio/carbono ao equilíbrio das populações e comunidades nos ecossistemas.",
        commonMistake:
          "Afirmar que a energia é reciclada pelos decompositores de volta para os produtores (a energia é unidirecional e não se recicla; apenas a matéria é reciclada) ou confundir o nível trófico de um organismo com a relação de magnificação trófica.",
        mistakeCorrection:
          "Nos ecossistemas, a MATÉRIA realiza um ciclo fechado graças aos decompositores, mas a ENERGIA tem fluxo estritamente unidirecional e decrescente (entra pela luz solar nos produtores e dissipa-se a cada nível trófico).",
        analogyExplanation:
          "Pense nos níveis tróficos do ecossistema como degraus de uma pirâmide energética: a cada degrau que sobe (do produtor ao consumidor de topo), cerca de 90% da energia é gasta no metabolismo ou perdida como calor, sobrando apenas ~10% para o nível seguinte!",
        gapIdentified: `Compreensão do fluxo unidirecional de energia, níveis tróficos, ciclos biogeoquímicos e relações ecológicas em ${topicTitle}.`,
        keyTerms: ["Cadeias e Teias Alimentares", "Níveis Tróficos (Produtores, Consumidores e Decompositores)", "Fluxo Unidirecional de Energia", "Pirâmides Ecológicas e Magnificação Trófica", "Ciclos Biogeoquímicos (Nitrogênio e Carbono)", "Relações Ecológicas e Sucessão"]
      };
    }

    if (
      norm.includes("bioquímica") ||
      norm.includes("água") ||
      norm.includes("sais minerais") ||
      norm.includes("proteína") ||
      norm.includes("enzima") ||
      norm.includes("michaelis") ||
      norm.includes("lipídio") ||
      norm.includes("carboidrato") ||
      norm.includes("aminoácido") ||
      norm.includes("vitamin")
    ) {
      const isEnzymeFocus = norm.includes("enzima") || norm.includes("michaelis") || norm.includes("catálise");
      return {
        disciplineId: profile.id,
        disciplineName: profile.name,
        areaType: "biologicas",
        topicTitle,
        moduleTitle,
        prerequisiteTitle: isEnzymeFocus
          ? "Especificidade enzima-substrato (sítio ativo), redução da energia de ativação e influência da temperatura e do pH na velocidade enzimática"
          : "Polaridade e pontes de hidrogênio da água, funções dos sais minerais e estrutura das proteínas (aminoácidos unidos por ligações peptídicas)",
        coreDefinition: isEnzymeFocus
          ? `O estudo de "${topicTitle}" analisa o mecanismo de ação das enzimas como biocatalisadores proteicos que diminuem a energia de ativação das reações químicas celulares por meio do encaixe específico entre o substrato e o sítio ativo (modelo chave-fechadura / ajuste induzido), bem como a cinética de Michaelis-Menten (V_máx e K_m) e os efeitos do pH, da temperatura e de inibidores competitivos e não competitivos.`
          : `O estudo de "${topicTitle}" analisa os componentes químicos essenciais ao metabolismo celular: a molécula de água (dipolo elétrico unido por pontes de hidrogênio, responsável pelo alto calor específico, coesão/adesão e papel de solvente universal), os sais minerais (cofatores enzimáticos, equilíbrio osmótico e condução nervosa) e as proteínas (polímeros de aminoácidos unidos por ligações peptídicas com níveis estruturais primário, secundário, terciário e quaternário).`,
        historicalContext:
          "A caracterização das proteínas como cadeias polipeptídicas por Emil Fischer e a formulação do modelo chave-fechadura (1894) e da cinética enzimática por Leonor Michaelis e Maud Menten (1913) estabeleceram as bases da bioquímica celular moderna.",
        mechanismsAndProcesses: isEnzymeFocus
          ? "1) Reconhecimento e ligação específica do substrato ao sítio ativo da enzima formando o complexo enzima-substrato (ES); 2) Redução da energia de ativação necessária para converter o substrato em produto, sem que a enzima seja consumida na reação; 3) Regulação da velocidade de reação pela concentração de substrato (saturação em V_máx), temperatura ótima e pH ótimo."
          : "1) Relacionar a polaridade da água e as pontes de hidrogênio à regulação térmica celular e à dissolução de substâncias hidrofílicas; 2) Identificar o papel específico dos íons minerais (Fe²⁺ na hemoglobina, Mg²⁺ na clorofila, Ca²⁺ na coagulação e contração muscular, Na⁺/K⁺ nos impulsos nervosos); 3) Compreender que as proteínas são formadas por aminoácidos ligados por ligações peptídicas e que alterações extremas de temperatura ou pH provocam desnaturação (perda da forma espacial e da função biológica).",
        practicalExamples: isEnzymeFocus
          ? [
              "Quando a temperatura ultrapassa o limite fisiológico ou o pH foge da faixa ótima da enzima, ocorre a desnaturação da estrutura tridimensional do sítio ativo, impedindo o encaixe do substrato e interrompendo a catálise.",
              "Na cinética de Michaelis-Menten, um menor valor de K_m indica maior afinidade da enzima pelo seu substrato, atingindo metade da velocidade máxima (V_máx / 2) em baixas concentrações de substrato."
            ]
          : [
              "O elevado calor específico da água — resultante das pontes de hidrogênio entre suas moléculas — impede variações bruscas de temperatura no interior das células, garantindo a estabilidade térmica do metabolismo.",
              "Quando uma proteína globular é submetida a aquecimento excessivo ou pH extremo, rompe-se sua conformação tridimensional (estruturas secundária, terciária e quaternária) no processo de desnaturação, perdendo sua função biológica mesmo mantendo a sequência primária de aminoácidos."
            ],
        importantRelations: isEnzymeFocus
          ? "Relaciona a conformação tridimensional do sítio ativo enzimático à redução da energia de ativação e à regulação da velocidade das vias metabólicas."
          : "Articula as propriedades físico-químicas da água e dos íons minerais à estabilidade conformacional e funcional das proteínas na célula.",
        commonMistake: isEnzymeFocus
          ? "Afirmar que as enzimas são consumidas durante a reação química ou que o aumento indefinido da temperatura sempre aumenta a velocidade enzimática sem causar desnaturação."
          : "Achar que a desnaturação proteica pelo calor rompe as ligações peptídicas da estrutura primária, em vez de desfazer apenas o enovelamento tridimensional (estruturas secundária, terciária e quaternária).",
        mistakeCorrection: isEnzymeFocus
          ? "As enzimas não são consumidas na reação e atuam diminuindo a energia de ativação; porém, temperaturas acima do ponto ótimo desnaturam a proteína enzimática e fazem a atividade cair abruptamente."
          : "A desnaturação altera a forma tridimensional da proteína (rompendo interações fracas e pontes de hidrogênio) e anula sua função, mas preserva a sequência linear de aminoácidos unidos por ligações peptídicas.",
        analogyExplanation:
          "Na bioquímica celular, a função de uma proteína ou enzima depende diretamente da sua forma 3D (como uma chave depende do desenho de seus dentes): se o calor excessivo entortar essa chave (desnaturação), ela deixa de abrir a fechadura!",
        gapIdentified: `Propriedades da água, funções dos sais minerais e estrutura/desnaturação de proteínas e enzimas em ${topicTitle}.`,
        keyTerms: isEnzymeFocus
          ? ["Catálise Enzimática e Sítio Ativo", "Energia de Ativação", "Modelo Chave-Fechadura e Ajuste Induzido", "Cinética de Michaelis-Menten (V_máx e K_m)", "Temperatura e pH Ótimos", "Desnaturação Enzimática"]
          : ["Água e Pontes de Hidrogênio", "Calor Específico e Solvente Universal", "Sais Minerais e Cofatores", "Aminoácidos e Ligações Peptídicas", "Estrutura das Proteínas (Primária a Quaternária)", "Desnaturação Proteica"]
      };
    }

    // Citologia e Organelas Citoplasmáticas
    return {
      disciplineId: profile.id,
      disciplineName: profile.name,
      areaType: "biologicas",
      topicTitle,
      moduleTitle,
      prerequisiteTitle: `Estrutura celular (procariontes vs. eucariontes) e função específica das organelas citoplasmáticas em ${topicTitle}`,
      coreDefinition: `Na Citologia, o estudo de "${topicTitle}" examina a organização morfológica e funcional das células procarióticas e eucarióticas (animais e vegetais), detalhando o papel específico de cada organela citoplasmática (ribossomos, retículo endoplasmático rugoso e liso, complexo golgiense, lisossomos, peroxissomos, citoesqueleto e centríolos).`,
      historicalContext:
        "A Teoria Celular formulada no século XIX por Matthias Schleiden, Theodor Schwann e Rudolf Virchow estabeleceu que todos os seres vivos celulares são constituídos por células (unidades morfológicas e fisiológicas) e que toda célula provém de outra preexistente.",
      mechanismsAndProcesses:
        "1) Distinguir células procarióticas (bactérias e arqueas: sem carioteca e sem organelas membranosas, possuindo DNA circular no nucleoide e ribossomos) de células eucarióticas (com núcleo individualizado por carioteca e sistema de endomembranas); 2) Relacionar cada organela à sua função: Ribossomos (síntese proteica), Retículo Endoplasmático Rugoso (síntese e transporte de proteínas de exportação), Retículo Liso (síntese de lipídios e desintoxicação), Complexo Golgiense (modificação, endereçamento e secreção vesicular, além de formação do acrossomo e dos lisossomos) e Lisossomos (digestão intracelular heterofágica e autofágica).",
      practicalExamples: [
        "Na via secretora celular (ex: células acinares do pâncreas que secretam enzimas digestivas), as proteínas são sintetizadas nos ribossomos aderidos ao Retículo Endoplasmático Rugoso, transportadas em vesículas até o Complexo Golgiense (onde são maturadas e empacotadas) e liberadas por exocitose.",
        "Os lisossomos contêm hidrolases ácidas que realizam a digestão intracelular de partículas englobadas (heterofagia) e a reciclagem de organelas desgastadas da própria célula (autofagia)."
      ],
      importantRelations:
        "Relaciona a compartimentalização funcional do sistema de endomembranas (RER, REL, Complexo Golgiense e Lisossomos) ao tráfego vesicular e à manutenção celular.",
      commonMistake:
        "Confundir as funções do Retículo Endoplasmático Rugoso (síntese de proteínas), Retículo Liso (síntese de lipídios e desintoxicação) e Complexo Golgiense (empacotamento, secreção e formação do acrossomo/lisossomos).",
      mistakeCorrection:
        "Associar cada organela à sua função exata: Ribossomos e RER sintetizam proteínas; REL sintetiza lipídios e metaboliza toxinas; Complexo Golgiense modifica, empacota e secreta substâncias; e Lisossomos realizam a digestão intracelular ácida.",
      analogyExplanation:
        "Pense no citoplasma eucariótico como uma linha de produção organizada: os Ribossomos e o Retículo Rugoso são as bancadas que montam as proteínas; o Complexo Golgiense é a central de acabamento e expedição que coloca etiqueta e envia as vesículas; e os Lisossomos são o setor de digestão e reciclagem celular!",
      gapIdentified: `Relação entre as organelas citoplasmáticas e suas funções específicas em ${topicTitle}.`,
      keyTerms: ["Teoria Celular (Procariontes vs Eucariontes)", "Ribossomos e Retículo Endoplasmático (RER e REL)", "Complexo Golgiense e Secreção Celular", "Lisossomos e Autofagia", "Citoesqueleto e Centríolos", "Organelas Citoplasmáticas"]
    };
  }

  // =========================================================================
  // 4. SOCIOLOGIA
  // =========================================================================
  if (profile.id === "sociologia") {
    if (norm.includes("gênese") || norm.includes("iluminismo") || norm.includes("revolução") || norm.includes("comte") || norm.includes("positivismo")) {
      return {
        disciplineId: profile.id,
        disciplineName: profile.name,
        areaType: "humanas",
        topicTitle,
        moduleTitle,
        prerequisiteTitle: "Racionalismo Iluminista e transformações históricas da Revolução Industrial e da Revolução Francesa na formação da sociedade moderna",
        coreDefinition: `Na Sociologia, o tema "${topicTitle}" investiga as raízes históricas e filosóficas que tornaram possível o surgimento da Sociologia como ciência no século XIX: o Iluminismo (que substituiu explicações teológicas pela razão crítica e observação científica), a Revolução Francesa (que derrubou a ordem estamental do Antigo Regime) e a Revolução Industrial (que provocou intensa urbanização, surgimento da classe operária e novos conflitos sociais).`,
        historicalContext:
          "Entre os séculos XVIII e XIX, pensadores iluministas (Montesquieu, Rousseau, Voltaire) questionaram o absolutismo e a naturalização das hierarquias sociais. Com a consolidação do capitalismo industrial na Europa e a crise das instituições tradicionais, Auguste Comte cunhou o termo 'Sociologia' (Física Social) e Émile Durkheim estabeleceu seu método científico autônomo.",
        mechanismsAndProcesses:
          "1) Compreender o papel do Iluminismo na desnaturalização da vida social por meio da razão; 2) Relacionar a Revolução Industrial às transformações materiais (fábricas, êxodo rural, jornada exaustiva, questão social); 3) Relacionar a Revolução Francesa às transformações políticas e jurídicas (cidadania, laicidade e igualdade formal); 4) Explicar como a Sociologia nasce para investigar cientificamente essa nova sociedade urbano-industrial.",
        practicalExamples: [
          "O crescimento explosivo de cidades industriais como Manchester e Londres no século XIX — marcado por desemprego, cortiços e greves operárias — mostrou que os problemas coletivos não eram castigos divinos nem falhas morais individuais, exigindo investigação científica sociológica.",
          "A substituição do direito divino dos reis pela soberania popular e pelos direitos civis após a Revolução Francesa de 1789 demonstrou que as instituições políticas são construídas historicamente pelos seres humanos."
        ],
        importantRelations:
          "Fundamenta a transição do pensamento filosófico-social para a investigação sociológica empírica e estrutura as bases teóricas de Durkheim, Marx e Weber.",
        commonMistake:
          "Afirmar que a Sociologia surgiu na Antiguidade ou na Idade Média como filosofia moral abstrata, desvinculada das transformações do Iluminismo, da Revolução Francesa e da Revolução Industrial.",
        mistakeCorrection:
          "Vincular sempre a gênese da Sociologia ao contexto histórico da modernidade europeia (séculos XVIII e XIX): o racionalismo iluminista forneceu a base epistemológica, e a Dupla Revolução (Industrial e Francesa) produziu os fenômenos sociais que demandaram uma nova ciência.",
        analogyExplanation:
          "Imagine que a sociedade europeia passou por um terremoto duplo (a Revolução Industrial mudou o modo de trabalhar e viver nas cidades; a Revolução Francesa mudou o poder político), enquanto o Iluminismo acendeu os refletores da razão científica para analisar as novas estruturas que surgiram!",
        gapIdentified: `Relação entre o racionalismo iluminista, as transformações da Revolução Industrial e Francesa e o nascimento da Sociologia em ${topicTitle}.`,
        keyTerms: ["Iluminismo e Racionalismo", "Revolução Industrial e Urbanização", "Revolução Francesa e Cidadania", "Desnaturalização Social", "Auguste Comte e Positivismo", "Surgimento da Sociologia"]
      };
    }

    if (norm.includes("durkheim") || norm.includes("fato social") || norm.includes("solidariedade") || norm.includes("anomia") || norm.includes("suicídio")) {
      return {
        disciplineId: profile.id,
        disciplineName: profile.name,
        areaType: "humanas",
        topicTitle,
        moduleTitle,
        prerequisiteTitle: "Definição de Fato Social (Coercitividade, Exterioridade e Generalidade) e Coesão Social em Émile Durkheim",
        coreDefinition: `Em Émile Durkheim, o estudo de "${topicTitle}" estabelece o Fato Social como objeto próprio da Sociologia — compreendendo toda maneira de agir, pensar e sentir que apresenta três características fundamentais: exterioridade (existe fora das consciências individuais e antecede o indivíduo), coercitividade (exerce força impositiva sobre os indivíduos por meio de sanções legais ou sociais) e generalidade (repete-se na coletividade) — além de explicar a coesão social pela Solidariedade Mecânica (sociedades tradicionais por semelhança) e Solidariedade Orgânica (sociedades modernas por divisão do trabalho e interdependência).`,
        historicalContext:
          "Na obra 'As Regras do Método Sociológico' (1895) e em 'Da Divisão do Trabalho Social' (1893), o sociólogo francês Émile Durkheim consolidou a Sociologia como ciência empírica e universitária, demonstrando que os fenômenos coletivos possuem leis próprias que não se reduzem à psicologia individual.",
        mechanismsAndProcesses:
          "1) Identificar as 3 características do Fato Social em situações concretas: é exterior ao indivíduo? Exerce coerção com punição legal ou reprovação moral? É geral no grupo social?; 2) Diferenciar Solidariedade Mecânica (baixa divisão do trabalho, consciência coletiva forte e semelhança entre os membros) de Solidariedade Orgânica (alta divisão do trabalho social e interdependência funcional nas sociedades urbano-industriais); 3) Compreender a Anomia como ausência ou enfraquecimento das normas integradoras.",
        practicalExamples: [
          "O idioma português, o uso de roupas adequadas em espaços públicos, o sistema monetário e o Código Penal são exemplos concretos de Fatos Sociais: já existiam antes de nascermos (exterioridade), são compartilhados pela sociedade (generalidade) e impõem multas, penas ou isolamento a quem os viola (coercitividade).",
          "Em uma grande metrópole contemporânea, o médico depende do padeiro, do motorista de ônibus, do eletricista e do professor para viver: essa interdependência gerada pela especialização profissional exemplifica a Solidariedade Orgânica de Durkheim."
        ],
        importantRelations:
          "Relaciona a objetividade metodológica do Fato Social à função integradora das instituições sociais (família, escola, direito e divisão do trabalho) na manutenção da coesão coletiva.",
        commonMistake:
          "Confundir Fato Social com qualquer acontecimento eventual na sociedade ou inverter os conceitos de Solidariedade Mecânica e Solidariedade Orgânica.",
        mistakeCorrection:
          "Para ser um Fato Social durkheimiano, o fenômeno precisa reunir obrigatoriamente Coercitividade, Exterioridade e Generalidade. E lembre-se: Solidariedade Mecânica ocorre em sociedades tradicionais (coesão por semelhança), enquanto Solidariedade Orgânica ocorre em sociedades capitalistas complexas (coesão por interdependência e divisão do trabalho, como órgãos de um organismo vivo).",
        analogyExplanation:
          "Pense no Fato Social como a correnteza de um rio: enquanto você nada a favor das normas sociais (idioma, leis, costumes), quase não sente seu peso; mas basta tentar nadar contra elas para sentir imediatamente a força da coercitividade social!",
        gapIdentified: `Reconhecimento das três características do Fato Social (coercitivo, exterior e geral) e distinção entre solidariedade mecânica e orgânica em ${topicTitle}.`,
        keyTerms: ["Émile Durkheim", "Fato Social", "Coercitividade, Exterioridade e Generalidade", "Solidariedade Mecânica e Orgânica", "Consciência Coletiva", "Anomia Social"]
      };
    }

    if (norm.includes("weber") || norm.includes("ação social") || norm.includes("dominação") || norm.includes("burocracia") || norm.includes("protestante")) {
      return {
        disciplineId: profile.id,
        disciplineName: profile.name,
        areaType: "humanas",
        topicTitle,
        moduleTitle,
        prerequisiteTitle: "Sentido subjetivo da Ação Social e os três tipos puros de dominação legítima em Max Weber",
        coreDefinition: `Na Sociologia Compreensiva de Max Weber, o estudo de "${topicTitle}" analisa a Ação Social (toda conduta humana dotada de um sentido subjetivo orientado pelo comportamento de outros indivíduos) classificada em quatro tipos ideais (racional com relação a fins, racional com relação a valores, afetiva e tradicional) e explica as três formas de Dominação Legítima: racional-legal (leis e burocracia), tradicional (costumes e patriarcalismo) e carismática (qualidades excepcionais do líder).`,
        historicalContext:
          "No início do século XX, o sociólogo alemão Max Weber (autor de 'Economia e Sociedade' e 'A Ética Protestante e o Espírito do Capitalismo') formulou o método compreensivo e o recurso analítico do Tipo Ideal, destacando a racionalização e a burocratização do mundo moderno.",
        mechanismsAndProcesses:
          "1) Identificar se a conduta do agente leva em conta a reação de outras pessoas (Ação Social); 2) Classificar a motivação da ação: cálculo de meios para atingir um objetivo (racional com relação a fins), fidelidade a um princípio ético/religioso (racional com relação a valores), emoção imediata (afetiva) ou hábito enraizado (tradicional); 3) Distinguir a fonte de legitimidade do poder (estatuto legal burocrático, tradição costumeira ou carisma pessoal).",
        practicalExamples: [
          "Um estudante que planeja sua rotina de estudos para ser aprovado em um concurso age de modo racional com relação a fins; já quem devolve uma carteira encontrada na rua por convicção ética inegociável realiza uma ação racional com relação a valores.",
          "A autoridade de um servidor público concursado ou de um juiz baseia-se na dominação racional-legal (normas impessoais e burocracia), enquanto a de um rei absolutista baseia-se na dominação tradicional."
        ],
        importantRelations:
          "Articula a tipologia da Ação Social com a legitimidade do Estado moderno (que detém o monopólio legítimo do uso da força física dentro de um território) e a racionalização burocrática.",
        commonMistake:
          "Confundir poder (capacidade de impor a própria vontade, mesmo contra resistência) com dominação legítima (probabilidade de encontrar obediência voluntária baseada na crença na legitimidade de quem manda).",
        mistakeCorrection:
          "Em Max Weber, a dominação distingue-se do mero uso da força bruta porque envolve o reconhecimento de legitimidade pelos governados, seja pela lei impessoal (racional-legal), pelo costume antigo (tradicional) ou pelo magnetismo pessoal do líder (carismática).",
        analogyExplanation:
          "Para diferenciar os 4 tipos de Ação Social de Weber, pergunte 'por que a pessoa agiu assim?': se calculou estrategicamente o resultado, é Racional com relação a Fins; se seguiu um princípio moral inegociável, é Racional com relação a Valores; se agiu por impulso emocional, é Afetiva; se repetiu um costume antigo, é Tradicional!",
        gapIdentified: `Classificação dos quatro tipos de Ação Social e dos três tipos de Dominação Legítima em ${topicTitle}.`,
        keyTerms: ["Max Weber e Sociologia Compreensiva", "Ação Social e Sentido Subjetivo", "Ação Racional (Fins e Valores), Afetiva e Tradicional", "Dominação Racional-Legal, Tradicional e Carismática", "Tipo Ideal e Burocracia", "Racionalização Moderna"]
      };
    }

    if (norm.includes("taylorismo") || norm.includes("fordismo") || norm.includes("toyotismo") || norm.includes("uberização") || norm.includes("precarização") || norm.includes("modelo produtivo") || norm.includes("modelos produtivos")) {
      return {
        disciplineId: profile.id,
        disciplineName: profile.name,
        areaType: "humanas",
        topicTitle,
        moduleTitle,
        prerequisiteTitle: "Diferenciação entre produção em série rígida (Taylorismo/Fordismo), acumulação flexível (Toyotismo) e trabalho mediado por plataformas digitais",
        coreDefinition: `Na Sociologia do Trabalho, o estudo de "${topicTitle}" analisa a organização técnica e social dos processos produtivos: o Taylorismo (gerência científica e separação entre concepção e execução), o Fordismo (linha de montagem rígida, produção em massa para consumo em massa e grandes estoques), o Toyotismo (acumulação flexível, produção enxuta sob demanda just-in-time e trabalhador polivalente) e a plataformização/uberização contemporânea.`,
        historicalContext:
          "Ao longo do século XX, a organização industrial passou do modelo taylorista-fordista (hegemônico nas grandes fábricas norte-americanas até a crise da década de 1970) para a reestruturação produtiva japonesa do Toyotismo e, no século XXI, para o gerenciamento algorítmico de trabalhadores por aplicativos.",
        mechanismsAndProcesses:
          "1) Caracterizar o Taylorismo/Fordismo: cronometragem de tempos e movimentos, esteira rolante, especialização do operário em uma única tarefa repetitiva e formação de grandes estoques; 2) Caracterizar o Toyotismo: produção puxada pela demanda (just-in-time), redução de estoques, controle de qualidade total, terceirização e trabalhador multifuncional; 3) Analisar os efeitos da uberização sobre a jornada e a proteção trabalhista.",
        practicalExamples: [
          "Na fábrica fordista clássica, cada operário realizava repetidamente uma única operação fixa diante da esteira para formar grandes estoques padronizados; no Toyotismo, equipes polivalentes produzem apenas o que já foi demandado (just-in-time).",
          "No trabalho plataformizado contemporâneo, algoritmos distribuem tarefas e definem tarifas em tempo real para entregadores e motoristas sem vínculo empregatício formal tradicional."
        ],
        importantRelations:
          "Relaciona as transformações tecnológicas e organizacionais da produção industrial e de serviços às mudanças na qualificação profissional e na regulamentação do trabalho.",
        commonMistake:
          "Confundir o modelo Fordista (produção rígida em série com grandes estoques e trabalhador especializado em uma única função) com o modelo Toyotista (produção flexível just-in-time sem estoques e trabalhador multifuncional).",
        mistakeCorrection:
          "O Fordismo baseia-se na produção em massa com esteira rígida, tarefas fragmentadas e grandes estoques, enquanto o Toyotismo baseia-se na produção enxuta sob demanda (just-in-time), flexibilização e polivalência do trabalhador.",
        analogyExplanation:
          "Compare uma fábrica antiga que produzia milhares de carros idênticos e guardava em um pátio gigante esperando compradores (Fordismo) com uma fábrica enxuta que só monta o lote no momento exato do pedido do cliente, sem manter estoque parado (Toyotismo)!",
        gapIdentified: `Diferenciação entre os modelos produtivos Taylorista/Fordista, Toyotista e trabalho plataformizado em ${topicTitle}.`,
        keyTerms: ["Taylorismo e Gerência Científica", "Fordismo e Linha de Montagem", "Toyotismo e Just-in-Time", "Acumulação Flexível e Polivalência", "Terceirização", "Uberização do Trabalho"]
      };
    }

    if (norm.includes("marx") || norm.includes("materialismo") || norm.includes("classe") || norm.includes("mais-valia") || norm.includes("alienação") || norm.includes("trabalho")) {
      return {
        disciplineId: profile.id,
        disciplineName: profile.name,
        areaType: "humanas",
        topicTitle,
        moduleTitle,
        prerequisiteTitle: "Relações sociais de produção, divisão entre meios de produção e força de trabalho e conceitos de mais-valia e alienação em Karl Marx",
        coreDefinition: `Na teoria sociológica de Karl Marx, o estudo de "${topicTitle}" analisa o materialismo histórico-dialético, a relação entre forças produtivas e relações sociais de produção (burguesia detentora dos meios de produção e proletariado vendedor da força de trabalho) e os mecanismos de extração da mais-valia (absoluta e relativa) e de alienação do trabalhador em relação ao produto e ao processo de trabalho.`,
        historicalContext:
          "No século XIX, diante da consolidação do capitalismo industrial europeu, Karl Marx e Friedrich Engels formularam a crítica da economia política ('O Capital'), analisando historicamente como a produção da vida material estrutura as classes sociais e seus conflitos.",
        mechanismsAndProcesses:
          "1) Identificar os elementos do modo de produção: meios de produção (máquinas, terras, matérias-primas) e força de trabalho humana; 2) Distinguir Mais-Valia Absoluta (prolongamento da jornada de trabalho) de Mais-Valia Relativa (aumento da produtividade por inovação tecnológica e intensificação do ritmo no mesmo tempo de jornada); 3) Compreender a alienação/estranhamento quando o produtor não se reconhece no fruto do seu trabalho.",
        practicalExamples: [
          "Quando uma fábrica estende a jornada diária de 8 para 10 horas sem aumentar proporcionalmente o salário, ocorre extração de mais-valia absoluta.",
          "Quando a introdução de máquinas mais velozes permite ao trabalhador gerar o valor equivalente ao seu salário em menos horas, ampliando o tempo de trabalho excedente sem aumentar a duração da jornada, configura-se a mais-valia relativa."
        ],
        importantRelations:
          "Conecta a estrutura econômica do modo de produção (infraestrutura) às instituições jurídicas, políticas e ideológicas (superestrutura) e à dinâmica das classes sociais.",
        commonMistake:
          "Confundir Mais-Valia Absoluta (baseada na extensão do tempo da jornada de trabalho) com Mais-Valia Relativa (baseada no ganho de produtividade tecnológica que reduz o tempo de trabalho necessário).",
        mistakeCorrection:
          "Mais-Valia Absoluta amplia o trabalho excedente aumentando as horas trabalhadas na jornada; já a Mais-Valia Relativa amplia o trabalho excedente aumentando a velocidade e a tecnologia produtiva sem precisar estender a jornada.",
        analogyExplanation:
          "Na jornada de trabalho, há a parte do tempo em que o trabalhador produz o valor equivalente ao seu salário (trabalho necessário) e a parte em que produz valor excedente não pago (mais-valia): aumentar a duração total do dia é mais-valia absoluta; acelerar a tecnologia para produzir mais rápido no mesmo dia é mais-valia relativa!",
        gapIdentified: `Compreensão das relações sociais de produção, alienação e diferença entre mais-valia absoluta e relativa em ${topicTitle}.`,
        keyTerms: ["Materialismo Histórico-Dialético", "Meios de Produção e Força de Trabalho", "Burguesia e Proletariado", "Mais-Valia Absoluta e Relativa", "Alienação no Trabalho", "Mercadoria e Valor"]
      };
    }

    if (norm.includes("cultura") || norm.includes("etnocentrismo") || norm.includes("relativismo") || norm.includes("antropologia") || norm.includes("identidade") || norm.includes("socialização") || norm.includes("indústria cultural")) {
      return {
        disciplineId: profile.id,
        disciplineName: profile.name,
        areaType: "humanas",
        topicTitle,
        moduleTitle,
        prerequisiteTitle: "Conceito antropológico de cultura (material e imaterial) e distinção entre etnocentrismo e relativismo cultural",
        coreDefinition: `Na Antropologia e Sociologia da Cultura, o estudo de "${topicTitle}" analisa o conceito amplo de cultura (todo complexo de saberes, crenças, línguas, costumes e artefatos materiais e imateriais produzidos pelos grupos humanos), o processo de socialização primária e secundária e a superação do etnocentrismo pelo relativismo cultural (Franz Boas).`,
        historicalContext:
          "No século XX, a Antropologia Cultural de Franz Boas refutou o evolucionismo social eurocêntrico ao demonstrar que não existem culturas 'superiores' ou 'inferiores', mas trajetórias históricas particulares que devem ser compreendidas a partir de sua própria lógica interna (relativismo cultural).",
        mechanismsAndProcesses:
          "1) Reconhecer que todo grupo humano produz cultura material (objetos, arquitetura, instrumentos) e imaterial (línguas, festas, saberes, rituais); 2) Identificar e superar o Etnocentrismo (atitude de julgar outra cultura a partir dos próprios padrões considerando-a inferior ou atrasada); 3) Aplicar o Relativismo Cultural (compreender os significados simbólicos e práticas de um grupo dentro de seu próprio contexto histórico e social).",
        practicalExamples: [
          "Quando um pesquisador estuda os rituais, línguas e sistemas agrícolas de povos indígenas brasileiros compreendendo seus significados internos sem impor os padrões urbanos como régua de julgamento, ele aplica o Relativismo Cultural.",
          "O registro do frevo, do samba de roda, do modo artesanal de fazer queijo de minas e da arte kusiwa Wajãpi pelo IPHAN preserva o patrimônio cultural imaterial brasileiro."
        ],
        importantRelations:
          "Relaciona os processos de socialização e construção da identidade coletiva à valorização da diversidade cultural e ao combate à intolerância e ao preconceito.",
        commonMistake:
          "Usar o termo 'cultura' apenas como sinônimo de escolaridade formal/erudição ou confundir Etnocentrismo com Relativismo Cultural.",
        mistakeCorrection:
          "No sentido antropológico, não existe pessoa ou sociedade 'sem cultura': todo grupo humano possui cultura. O Etnocentrismo julga o outro como inferior a partir do próprio umbigo cultural, enquanto o Relativismo Cultural busca compreender o outro em seus próprios termos.",
        analogyExplanation:
          "O Etnocentrismo é como tentar ler um livro escrito em outro idioma usando apenas as regras do seu próprio idioma e concluir que o livro 'está errado'; o Relativismo Cultural é aprender a gramática própria daquela cultura para entender o sentido real do que ela expressa!",
        gapIdentified: `Distinção entre cultura material e imaterial e entre etnocentrismo e relativismo cultural em ${topicTitle}.`,
        keyTerms: ["Conceito Antropológico de Cultura", "Cultura Material e Imaterial", "Etnocentrismo", "Relativismo Cultural (Franz Boas)", "Socialização Primária e Secundária", "Diversidade e Identidade Cultural"]
      };
    }

    return {
      disciplineId: profile.id,
      disciplineName: profile.name,
      areaType: "humanas",
      topicTitle,
      moduleTitle,
      prerequisiteTitle: "Dimensões dos direitos de cidadania (Direitos Civis, Políticos e Sociais em T. H. Marshall), democracia e movimentos sociais",
      coreDefinition: `Na Sociologia Política, o estudo de "${topicTitle}" analisa a construção histórica da cidadania moderna em suas três dimensões formuladas por T. H. Marshall — Direitos Civis (liberdades individuais e igualdade perante a lei), Direitos Políticos (participação no poder pelo voto e organização política) e Direitos Sociais (bem-estar, educação, saúde, trabalho e moradia digna) — bem como a atuação dos movimentos sociais e as garantias da Constituição Federal de 1988.`,
      historicalContext:
        "T. H. Marshall sistematizou a conquista histórica dos direitos de cidadania (civis no século XVIII, políticos no século XIX e sociais no século XX), que no Brasil alcançaram seu marco institucional mais amplo na Constituição Cidadã de 1988.",
      mechanismsAndProcesses:
        "1) Diferenciar as três dimensões de direitos: Direitos Civis (liberdade de ir e vir, expressão, propriedade e acesso à justiça), Direitos Políticos (votar, ser votado, criar partidos, sindicatos e manifestar-se politicamente) e Direitos Sociais (acesso à saúde pública, educação, previdência, lazer e proteção trabalhista); 2) Distinguir cidadania formal (prevista no texto da lei) de cidadania substantiva (efetivada na vida real da população); 3) Analisar o papel dos movimentos sociais na conquista e ampliação de direitos.",
      practicalExamples: [
        "Na Constituição Federal de 1988, a garantia da liberdade de expressão e de crença corresponde a um Direito Civil; o sufrágio universal mediante voto direto e secreto corresponde a um Direito Político; e o acesso gratuito ao SUS e à escola pública corresponde a um Direito Social.",
        "Movimentos sociais urbanos, rurais e de defesa dos direitos humanos atuam historicamente para converter direitos previstos no papel (cidadania formal) em políticas públicas efetivas (cidadania substantiva)."
      ],
      importantRelations:
        "Conecta as três dimensões de direitos (civis, políticos e sociais) ao funcionamento do Estado Democrático de Direito e à participação cidadã.",
      commonMistake:
        "Confundir Direitos Civis (liberdades individuais e garantias jurídicas) com Direitos Sociais (condições materiais de bem-estar, saúde, educação e proteção ao trabalho).",
      mistakeCorrection:
        "Direitos Civis protegem a liberdade individual perante o Estado e a lei; Direitos Políticos garantem a participação nas decisões do poder público; e Direitos Sociais asseguram condições materiais dignas de vida (educação, saúde, trabalho e previdência).",
      analogyExplanation:
        "Pense na Cidadania Plena como um banco sustentado por três pés: o primeiro pé é a Liberdade Individual (Direitos Civis), o segundo é a Voz na Democracia (Direitos Políticos) e o terceiro é a Dignidade Social com saúde e educação (Direitos Sociais)!",
      gapIdentified: `Diferenciação entre Direitos Civis, Direitos Políticos e Direitos Sociais (T. H. Marshall) e participação cidadã em ${topicTitle}.`,
      keyTerms: ["Direitos Civis (Liberdades Individuais)", "Direitos Políticos (Sufrágio e Participação)", "Direitos Sociais (Educação, Saúde e Trabalho)", "T. H. Marshall e Cidadania", "Constituição Federal de 1988", "Movimentos Sociais"]
    };
  }

  // =========================================================================
  // 5. HISTÓRIA
  // =========================================================================
  if (profile.id === "historia") {
    if (norm.includes("francesa") || norm.includes("iluminismo") || norm.includes("bastilha") || norm.includes("jacobino") || norm.includes("girondino") || norm.includes("antigo regime") || norm.includes("napole")) {
      return {
        disciplineId: profile.id,
        disciplineName: profile.name,
        areaType: "humanas",
        topicTitle,
        moduleTitle,
        prerequisiteTitle: "Crise do Antigo Regime (Sociedade Estamental e Absolutismo), Ideais Iluministas e Fases da Revolução Francesa",
        coreDefinition: `Na História, o estudo de "${topicTitle}" analisa a crise do Antigo Regime absolutista e estamental na França do final do século XVIII — dividida em Primeiro Estado (clero), Segundo Estado (nobreza isenta de impostos) e Terceiro Estado (burguesia, camponeses e sans-culottes que sustentavam o reino) — e o processo revolucionário iniciado em 1789 sob inspiração iluminista (Liberdade, Igualdade e Fraternidade), que aboliu os privilégios feudais, proclamou a Declaração dos Direitos do Homem e do Cidadão e inaugurou a Idade Contemporânea.`,
        historicalContext:
          "Impulsionada pela crise financeira e agrícola francesa, pela crítica iluminista ao absolutismo e pela convocação dos Estados Gerais em 1789, a Revolução Francesa percorreu a Assembleia Nacional Constituinte (1789-1791), a Monarquia Constitucional, a Convenção Nacional Republicana sob hegemonia girondina e jacobina (1792-1794) e o Diretório (1795-1799), culminando na Era Napoleônica.",
        mechanismsAndProcesses:
          "1) Identificar as causas estruturais da Revolução (desigualdade fiscal entre os Três Estados, crise econômica e difusão do Iluminismo); 2) Diferenciar os projetos políticos em disputa: Girondinos (alta burguesia moderada, defesa da propriedade e do voto censitário) versus Jacobinos e sans-culottes (pequena burguesia e camadas populares, defesa da República democrática, sufrágio universal masculino, tabelamento de preços e abolição da escravidão nas colônias); 3) Analisar as consequências jurídicas e políticas duradouras para o Estado moderno.",
        practicalExamples: [
          "A Declaração dos Direitos do Homem e do Cidadão (agosto de 1789) estabeleceu a igualdade jurídica de todos perante a lei, a liberdade de expressão, a resistência à opressão e o princípio de que a soberania reside na nação, extinguindo os privilégios de nascimento do clero e da nobreza.",
          "Durante a Convenção Jacobina (1793-1794), liderada por Robespierre, Danton e Marat com apoio dos sans-culottes, foi aprovada a Lei do Máximo (congelamento dos preços dos alimentos básicos), o ensino público gratuito e a abolição da escravidão nas colônias francesas como o Haiti."
        ],
        importantRelations:
          "Relaciona a queda do absolutismo e dos privilégios estamentais na França à consolidação do constitucionalismo moderno, do Código Civil Napoleônico e das lutas emancipacionistas nas Américas.",
        commonMistake:
          "Tratar o Terceiro Estado como um bloco social homogêneo sem perceber as divergências entre a alta burguesia (girondinos) e as camadas populares/pequena burguesia (jacobinos e sans-culottes), ou inverter as posições de girondinos e jacobinos.",
        mistakeCorrection:
          "Lembrar que, embora todo o Terceiro Estado tenha se unido contra o absolutismo e os privilégios feudais em 1789, os Girondinos representavam a alta burguesia moderada (defensora do voto censitário), enquanto os Jacobinos, apoiados pelos sans-culottes, conduziram a fase mais popular e radical da República.",
        analogyExplanation:
          "Imagine a sociedade francesa pré-1789 como uma pirâmide em que a base inteira (o Terceiro Estado: 98% da população) carregava nas costas o peso dos impostos e do trabalho para sustentar o topo privilegiado (Clero e Nobreza). A Revolução Francesa derrubou essa estrutura de privilégios de nascimento e fundou a cidadania moderna baseada na lei!",
        gapIdentified: `Compreensão das causas (crise do Antigo Regime e Três Estados), grupos políticos (Girondinos vs Jacobinos) e consequências históricas em ${topicTitle}.`,
        keyTerms: ["Antigo Regime e Três Estados", "Queda da Bastilha (1789)", "Declaração dos Direitos do Homem e do Cidadão", "Girondinos vs Jacobinos", "Sans-Culottes", "Iluminismo e Cidadania"]
      };
    }

    if (norm.includes("império") || norm.includes("reinado") || norm.includes("regencial") || norm.includes("moderador") || norm.includes("independência") || norm.includes("abolição") || norm.includes("lei áurea") || norm.includes("paraguai")) {
      return {
        disciplineId: profile.id,
        disciplineName: profile.name,
        areaType: "humanas",
        topicTitle,
        moduleTitle,
        prerequisiteTitle: "Instituições políticas do Império do Brasil (Constituição de 1824, Poder Moderador e voto censitário), Período Regencial e crise do escravismo no Segundo Reinado",
        coreDefinition: `Na História do Brasil Império (1822–1889), o estudo de "${topicTitle}" analisa o processo de Independência, a organização política sob a Constituição outorgada de 1824 (que instituiu a monarquia unitária, o voto censitário e o Poder Moderador exclusivo do Imperador), as revoltas provinciais do Período Regencial (Cabanagem, Farroupilha, Sabinada, Balaiada e Revolta dos Malês) e a dinâmica econômica cafeeira, abolicionista e republicana do Segundo Reinado.`,
        historicalContext:
          "Entre a emancipação política em 1822 e a Proclamação da República em 1889, o Estado Imperial brasileiro consolidou a unidade territorial sob forte centralização monárquica, deslocou o eixo econômico para a cafeicultura do Vale do Paraíba e do Oeste Paulista e enfrentou a gradual desagregação do regime escravista até a Lei Áurea (1888).",
        mechanismsAndProcesses:
          "1) Compreender a estrutura da Constituição de 1824: quatro poderes (Executivo, Legislativo, Judiciário e Poder Moderador acima dos demais) e eleições indiretas e censitárias (baseadas na renda); 2) Relacionar as tensões entre centralização (Conservadores/Regresso) e autonomia provincial (Liberais) às revoltas regenciais; 3) Analisar as leis abolicionistas (Eusébio de Queirós em 1850, Ventre Livre em 1871, Sexagenários em 1885 e Lei Áurea em 1888), a resistência negra e quilombola e a transição para o trabalho imigrante assalariado.",
        practicalExamples: [
          "Na Constituição de 1824, o Poder Moderador funcionava como a 'chave de toda a organização política', permitindo a D. Pedro I e depois a D. Pedro II nomear senadores vitalícios, escolher ministros e dissolver a Câmara dos Deputados.",
          "Durante o Período Regencial (1831–1840), revoltas de forte participação popular e escravizada — como a Cabanagem no Grão-Pará, a Balaiada no Maranhão e a Revolta dos Malês na Bahia (1835) — contestaram a miséria, a opressão local e a escravidão."
        ],
        importantRelations:
          "Relaciona a expansão cafeeira e o fim do tráfico transatlântico (1850) à crise das bases de sustentação da monarquia (questões abolicionista, militar e religiosa) que levou à República em 1889.",
        commonMistake:
          "Achar que a Independência de 1822 aboliu a escravidão e o latifúndio, ou confundir o Poder Moderador da Constituição de 1824 com o sistema de três poderes autônomos da República.",
        mistakeCorrection:
          "A Independência rompeu o Pacto Colonial com Portugal, mas manteve a monarquia, o latifúndio agroexportador e a escravidão (que só foi abolida formalmente em 1888), além de concentrar autoridade no Imperador por meio do Poder Moderador.",
        analogyExplanation:
          "No Império sob a Constituição de 1824, em vez de três poderes equilibrados em um triângulo, havia um quarto poder no topo da pirâmide — o Poder Moderador — que dava ao Imperador a palavra final sobre o Parlamento e o gabinete de ministros!",
        gapIdentified: `Compreensão do Poder Moderador (Constituição de 1824), das revoltas regenciais e da crise do escravismo no Segundo Reinado em ${topicTitle}.`,
        keyTerms: ["Constituição de 1824 e Poder Moderador", "Primeiro Reinado", "Período Regencial e Revoltas Provinciais", "Segundo Reinado e Economia Cafeeira", "Movimento Abolicionista e Lei Áurea (1888)", "Crise da Monarquia"]
      };
    }

    if (norm.includes("colônia") || norm.includes("colonial") || norm.includes("açucar") || norm.includes("açúcar") || norm.includes("holandes") || norm.includes("ouro") || norm.includes("mineração") || norm.includes("inconfidência") || norm.includes("conjuração") || norm.includes("capitania") || norm.includes("escravidão") || norm.includes("pré-colombian") || norm.includes("navegações") || norm.includes("pacto colonial")) {
      return {
        disciplineId: profile.id,
        disciplineName: profile.name,
        areaType: "humanas",
        topicTitle,
        moduleTitle,
        prerequisiteTitle: "Funcionamento do Pacto Colonial mercantilista, tripé da plantation (latifúndio, monocultura e trabalho escravizado) e economia mineradora",
        coreDefinition: `Na História do Brasil Colônia, o estudo de "${topicTitle}" analisa a montagem da colonização sob o Antigo Sistema Colonial mercantilista (Pacto Colonial, plantation voltada ao mercado externo, latifúndio monocultor e trabalho escravizado indígena e africano), a interiorização pela pecuária, bandeirismo e mineração aurífera no século XVIII e as revoltas coloniais nativistas e emancipacionistas (Inconfidência Mineira de 1789 e Conjuração Baiana de 1798).`,
        historicalContext:
          "Integrado ao mercantilismo europeu a partir do século XVI, o Brasil Colônia estruturou-se inicialmente na agroindústria açucareira do Nordeste e, no século XVIII, deslocou seu eixo econômico e administrativo para o Centro-Sul com a mineração de ouro e diamantes e a transferência da capital de Salvador para o Rio de Janeiro (1763).",
        mechanismsAndProcesses:
          "1) Compreender o Pacto Colonial (exclusivo comercial metropolitano) e o tripé da plantation (latifúndio, monocultura de exportação e mão de obra escravizada); 2) Diferenciar a sociedade açucareira (rural, senhorial e polarizada entre senhores de engenho e escravizados) da sociedade mineradora do século XVIII (mais urbanizada, com camadas médias livres e forte fiscalização pela cobrança do Quinto e da Derrama); 3) Distinguir revoltas nativistas (Emboabas, Mascates, Vila Rica) de revoltas emancipacionistas (Inconfidência Mineira elitista vs. Conjuração Baiana popular e abolicionista).",
        practicalExamples: [
          "Enquanto a Inconfidência Mineira (1789) reuniu proprietários de lavras, militares e intelectuais de Vila Rica contra a Derrama sem consenso sobre a abolição da escravidão, a Conjuração Baiana (Revolta dos Alfaiates, 1798) mobilizou artesãos, soldados e escravizados em Salvador defendendo a República e o fim imediato da escravidão.",
          "A resistência negra à escravidão colonial manifestou-se cotidianamente por fugas, preservação cultural e formação de quilombos, destacando-se o Quilombo dos Palmares na Serra da Barriga sob liderança de Ganga Zumba e Zumbi."
        ],
        importantRelations:
          "Explica as bases históricas da estrutura fundiária concentrada, da economia agroexportadora e da resistência indígena e quilombola no período colonial.",
        commonMistake:
          "Confundir revoltas nativistas (que contestavam abusos fiscais ou monopólios locais sem propor separar o Brasil de Portugal) com revoltas emancipacionistas (que buscavam romper o Pacto Colonial e proclamar a independência).",
        mistakeCorrection:
          "Revoltas nativistas (Beckman, Emboabas, Mascates, Filipe dos Santos) questionavam conflitos locais mantendo o vínculo com a Coroa, enquanto as emancipacionistas do fim do século XVIII (Inconfidência Mineira e Conjuração Baiana) propunham a ruptura política com Portugal.",
        analogyExplanation:
          "Pense no Pacto Colonial como uma via comercial de mão única imposta pela Metrópole: a Colônia era obrigada a vender seus produtos tropicais e ouro exclusivamente para a Metrópole e a comprar manufaturados caros somente dela!",
        gapIdentified: `Compreensão do Pacto Colonial, da plantation açucareira, da sociedade mineradora e das revoltas coloniais em ${topicTitle}.`,
        keyTerms: ["Pacto Colonial e Exclusivo Metropolitano", "Plantation Açucareira e Engenho", "Escravidão e Resistência Quilombola", "Sociedade Mineradora (Quinto e Derrama)", "Revoltas Nativistas", "Inconfidência Mineira vs Conjuração Baiana"]
      };
    }

    if (norm.includes("vargas") || norm.includes("república") || norm.includes("republican") || norm.includes("oligárqu") || norm.includes("café com leite") || norm.includes("coronelismo") || norm.includes("estado novo") || norm.includes("clt") || norm.includes("ditadura") || norm.includes("militar") || norm.includes("redemocratização")) {
      return {
        disciplineId: profile.id,
        disciplineName: profile.name,
        areaType: "humanas",
        topicTitle,
        moduleTitle,
        prerequisiteTitle: "Mecanismos políticos da Primeira República (coronelismo e voto de cabresto), Era Vargas (industrialização e trabalhismo) e redemocratização brasileira",
        coreDefinition: `Na História do Brasil Republicano, o estudo de "${topicTitle}" analisa a Primeira República (1889–1930, marcada pelo federalismo oligárquico, Política dos Governadores, coronelismo e voto aberto de cabresto), a Era Vargas (1930–1945, com centralização estatal, industrialização de base e legislação trabalhista urbana na CLT), o período democrático-populista (1945–1964), o Regime Militar (1964–1985) e a Redemocratização consolidada na Constituição de 1988.`,
        historicalContext:
          "A partir de 1930, o Brasil transitou de uma república agroexportadora cafeeira dominada pelas oligarquias estaduais para um Estado nacional-desenvolvimentista urbano e industrial, atravessando períodos de fechamento autoritário (Estado Novo de 1937–1945 e Regime Militar de 1964–1985) e conquistas democráticas.",
        mechanismsAndProcesses:
          "1) Na Primeira República: compreender a engrenagem entre Coronelismo (poder local dos grandes proprietários), Voto de Cabresto (voto aberto controlado pelos coronéis) e Política dos Governadores (apoio mútuo entre Presidência e oligarquias estaduais); 2) Na Era Vargas: relacionar a criação das indústrias de base (CSN e Vale do Rio Doce) ao Trabalhismo (concessão de direitos trabalhistas na CLT de 1943 atrelada ao controle dos sindicatos pelo Estado); 3) Analisar os Atos Institucionais (como o AI-5 em 1968) e o processo de abertura política e Diretas Já.",
        practicalExamples: [
          "Na Primeira República (1891–1930), como o voto não era secreto, os eleitores rurais sofriam pressão direta dos chefes políticos locais (coronéis), caracterizando o 'voto de cabresto' que sustentava as oligarquias estaduais.",
          "Durante a Era Vargas (1930–1945), a Consolidação das Leis do Trabalho (CLT, 1943) regulamentou o salário mínimo, as férias remuneradas e a jornada de 8 horas para os trabalhadores urbanos, ao mesmo tempo em que o Estado Novo proibia greves e atrelava os sindicatos ao Ministério do Trabalho."
        ],
        importantRelations:
          "Articula o processo de urbanização e industrialização brasileira do século XX às disputas por direitos trabalhistas, sociais e políticos.",
        commonMistake:
          "Confundir o sistema político descentralizado e oligárquico da Primeira República (1889–1930) com o Estado centralizador, nacionalista e industrializante da Era Vargas (1930–1945).",
        mistakeCorrection:
          "A Primeira República baseava-se no predomínio das oligarquias agrárias estaduais e no voto aberto (coronelismo), enquanto a Era Vargas centralizou o poder federal, impulsionou a indústria de base e instituiu o trabalhismo (CLT).",
        analogyExplanation:
          "Na Primeira República, o poder político funcionava como uma pirâmide de acordos entre o Presidente, os governadores estaduais e os coronéis locais que controlavam o voto aberto; a Revolução de 1930 quebrou esse arranjo regional e concentrou as decisões no governo federal e no mundo urbano-industrial!",
        gapIdentified: `Compreensão do coronelismo na Primeira República, do trabalhismo e industrialização na Era Vargas e das fases republicanas em ${topicTitle}.`,
        keyTerms: ["Primeira República e Coronelismo", "Política dos Governadores e Voto de Cabresto", "Era Vargas (1930–1945) e Estado Novo", "Industrialização de Base e CLT", "Regime Militar e AI-5", "Redemocratização e Constituição de 1988"]
      };
    }

    if (norm.includes("antiguidade") || norm.includes("grécia") || norm.includes("atenas") || norm.includes("esparta") || norm.includes("roma") || norm.includes("feudal") || norm.includes("idade média") || norm.includes("medieval") || norm.includes("cruzada") || norm.includes("renascimento") || norm.includes("reforma") || norm.includes("absolutismo") || norm.includes("mercantilismo")) {
      return {
        disciplineId: profile.id,
        disciplineName: profile.name,
        areaType: "humanas",
        topicTitle,
        moduleTitle,
        prerequisiteTitle: "Instituições da Antiguidade Clássica (pólis grega e direito romano), estrutura feudo-vasálica medieval e transição para o Estado Moderno",
        coreDefinition: `Na História Antiga, Medieval e Moderna, o estudo de "${topicTitle}" analisa a organização política e social das civilizações clássicas (a democracia direta restrita em Atenas e a República/Império Romano), a estrutura do Feudalismo medieval europeu (relações de suserania e vassalagem, servidão na gleba, descentralização política e hegemonia da Igreja) e a transição para a Idade Moderna (Renascimento Cultural, Reformas Religiosas, Absolutismo Monárquico e Mercantilismo).`,
        historicalContext:
          "Da formação das cidades-Estado gregas e da expansão romana no Mediterrâneo, passando pela fragmentação do poder na Europa Feudal (séculos V a XV), até a centralização monárquica e a expansão comercial marítima que inauguraram o Mundo Moderno.",
        mechanismsAndProcesses:
          "1) Diferenciar a democracia ateniense antiga (direta na Ágora, mas restrita aos homens livres nascidos em Atenas, excluindo mulheres, metecos e escravizados) da democracia representativa contemporânea; 2) Compreender o Feudalismo: vínculo horizontal entre nobres (suserania e vassalagem) e vínculo vertical de exploração camponesa (servidão presa à terra com obrigações como corveia, talha e banalidades); 3) Relacionar o Renascimento comercial e urbano à formação das Monarquias Nacionais Absolutistas.",
        practicalExamples: [
          "Em Atenas no século V a.C., os cidadãos reuniam-se pessoalmente na Eclésia (Assembleia) para votar leis e decidir sobre a guerra, mas apenas cerca de 10% a 15% dos habitantes possuíam estatuto de cidadão.",
          "No senhorio feudal medieval, o servo não era uma mercadoria vendida como o escravo antigo, mas estava juridicamente preso à terra e devia tributos ao senhor feudal: a corveia (dias de trabalho gratuito no manso senhorial), a talha (parte da colheita) e as banalidades (taxa pelo uso do moinho e forno)."
        ],
        importantRelations:
          "Conecta o legado institucional greco-romano (cidadania, filosofia e Direito Romano) às transformações sociais e políticas da Idade Média e da Idade Moderna.",
        commonMistake:
          "Confundir a democracia ateniense antiga (direta e excludente) com a democracia atual (representativa e com sufrágio universal), ou confundir servidão feudal com escravidão.",
        mistakeCorrection:
          "Na Atenas Clássica a democracia era direta, mas excluía mulheres, estrangeiros e escravizados. Na Idade Média, o servo estava preso à terra e pagava tributos (corveia e talha), diferindo do escravo que era propriedade comercializável.",
        analogyExplanation:
          "No Feudalismo, a sociedade organizava-se em três ordens com funções fixas: os que oravam (clero), os que guerreavam (nobreza suserana e vassala) e os que trabalhavam na terra sustentando a todos (servos)!",
        gapIdentified: `Compreensão da cidadania antiga, das relações feudais (servidão, suserania e vassalagem) e da formação do Estado Moderno em ${topicTitle}.`,
        keyTerms: ["Democracia Direta Ateniense", "República e Direito Romano", "Feudalismo (Suserania e Vassalagem)", "Servidão (Corveia, Talha e Banalidades)", "Renascimento e Reformas Religiosas", "Absolutismo e Mercantilismo"]
      };
    }

    return {
      disciplineId: profile.id,
      disciplineName: profile.name,
      areaType: "humanas",
      topicTitle,
      moduleTitle,
      prerequisiteTitle: `Contextualização histórica da Revolução Industrial, do Imperialismo e dos conflitos geopolíticos contemporâneos em ${topicTitle}`,
      coreDefinition: `Na História Contemporânea, o estudo de "${topicTitle}" analisa as transformações da Revolução Industrial (maquinofatura, divisão fabril do trabalho e movimento operário), a expansão imperialista e neocolonial do século XIX na África e na Ásia, as duas Guerras Mundiais, a Crise de 1929, a ascensão dos regimes totalitários no entreguerras e a ordem geopolítica da Guerra Fria no século XX.`,
      historicalContext:
        "A partir da Revolução Industrial na Inglaterra (século XVIII) e da Segunda Revolução Industrial (aço, eletricidade e petróleo no século XIX), a disputa por mercados, matérias-primas e hegemonia geopolítica conduziu ao choque imperialista da Primeira Guerra Mundial (1914–1918), à Segunda Guerra Mundial (1939–1945) e à bipolaridade da Guerra Fria (1947–1991).",
      mechanismsAndProcesses:
        "1) Distinguir artesanato, manufatura e maquinofatura industrial (substituição da ferramenta manual pela máquina a vapor/elétrica e assalariamento fabril); 2) Relacionar a Segunda Revolução Industrial ao Neocolonialismo/Imperialismo (Partilha da África na Conferência de Berlim, 1884–1885) e às alianças da Primeira Guerra Mundial; 3) Compreender a bipolaridade ideológica, econômica e militar entre EUA (capitalismo) e URSS (socialismo) na Guerra Fria e a descolonização afro-asiática.",
      practicalExamples: [
        "Na Primeira Revolução Industrial inglesa, o cercamento dos campos (Enclosure Acts), as reservas de carvão mineral e ferro e a acumulação de capitais permitiram a transição da manufatura para a maquinofatura têxtil a vapor.",
        "Durante a Guerra Fria (1947–1991), EUA e URSS evitaram o confronto militar nuclear direto entre si, mas disputaram zonas de influência por meio da corrida espacial, de alianças militares (OTAN vs. Pacto de Varsóvia) e de conflitos regionais indiretos."
      ],
      importantRelations:
        "Relaciona a industrialização e o imperialismo europeu às fronteiras geopolíticas contemporâneas, às organizações internacionais (ONU) e às transformações tecnológicas do século XX.",
      commonMistake:
        "Confundir o Colonialismo Mercantilista dos séculos XVI–XVIII (focado na América e em especiarias/metais preciosos) com o Imperialismo/Neocolonialismo do século XIX (focado na partilha da África e da Ásia pelo capitalismo industrial e financeiro).",
      mistakeCorrection:
        "O Neocolonialismo do século XIX foi impulsionado pela Segunda Revolução Industrial em busca de matérias-primas (petróleo, borracha, minérios), mercados consumidores e áreas para investimento de capitais monopolistas na África e na Ásia.",
      analogyExplanation:
        "Enquanto na Primeira Revolução Industrial o motor era o carvão e o ferro nas fábricas têxteis inglesas, na Segunda Revolução Industrial o motor passou a ser o petróleo, a eletricidade e o aço, levando as potências a dividirem o mapa da África e da Ásia em busca de matérias-primas e mercados!",
      gapIdentified: `Compreensão das fases da Revolução Industrial, do Imperialismo/Neocolonialismo e dos conflitos do século XX em ${topicTitle}.`,
      keyTerms: ["Revolução Industrial e Maquinofatura", "Movimento Operário (Ludismo e Cartismo)", "Imperialismo e Partilha da África", "Primeira e Segunda Guerra Mundial", "Crise de 1929 e Período Entreguerras", "Guerra Fria e Descolonização"]
    };
  }

  // =========================================================================
  // 6. GEOGRAFIA
  // =========================================================================
  if (profile.id === "geografia") {
    if (
      norm.includes("clima") ||
      norm.includes("climátic") ||
      norm.includes("equatorial") ||
      norm.includes("tropical") ||
      norm.includes("semiárido") ||
      norm.includes("subtropical") ||
      norm.includes("massa") ||
      norm.includes("latitude") ||
      norm.includes("altitude") ||
      norm.includes("el niño") ||
      norm.includes("la niña") ||
      norm.includes("atmosfera") ||
      norm.includes("precipitação")
    ) {
      return {
        disciplineId: profile.id,
        disciplineName: profile.name,
        areaType: "humanas",
        topicTitle,
        moduleTitle,
        prerequisiteTitle: "Fatores climáticos (latitude, altitude, maritimidade/continentalidade e massas de ar) e comportamento da temperatura, umidade e precipitação",
        coreDefinition: `Na Geografia, o estudo de "${topicTitle}" analisa a atuação dos fatores climáticos (latitude, altitude, maritimidade/continentalidade, relevo e massas de ar) sobre os elementos atmosféricos (temperatura, umidade e precipitação), caracterizando a distribuição espacial dos tipos climáticos no Brasil: Equatorial (quente e úmido o ano todo na Amazônia, com baixa amplitude térmica), Tropical Típico (duas estações bem definidas: verão chuvoso e inverno seco no Brasil Central), Semiárido (altas temperaturas e chuvas escassas e mal distribuídas no Sertão Nordestino) e Subtropical (no Sul do país, abaixo do Trópico de Capricórnio, com chuvas bem distribuídas e elevada amplitude térmica anual).`,
        historicalContext:
          "A classificação climática do território brasileiro baseia-se nos estudos de circulação atmosférica e massas de ar sistematizados por Arthur Strahler, Carlos Augusto de Figueiredo Monteiro e Aziz Ab'Sáber, além do monitoramento meteorológico do INMET, considerando que 92% do Brasil situa-se na zona intertropical (entre a Linha do Equador e o Trópico de Capricórnio) e 8% na zona temperada subtropical ao sul.",
        mechanismsAndProcesses:
          "1) Analisar a influência dos fatores climáticos (latitude, altitude, maritimidade/continentalidade e circulação das cinco massas de ar que atuam no Brasil: mEc, mEa, mTa, mTc e mPa) sobre a temperatura, a umidade e o regime de precipitação; 2) Identificar as características específicas de cada clima brasileiro: Equatorial (ação da mEc, elevada pluviosidade anual sem estação seca), Tropical Típico (alternância entre verão chuvoso pelo avanço da mEc e inverno seco), Semiárido (baixa pluviosidade inferior a 800 mm/ano e altas médias térmicas no interior nordestino) e Subtropical (atuação da mPa, chuvas distribuídas todo o ano e invernos frios com maior amplitude térmica); 3) Associar cada tipo climático à sua distribuição espacial nas regiões brasileiras e aos respectivos climogramas.",
        practicalExamples: [
          "No Clima Equatorial (Região Amazônica), a proximidade da Linha do Equador (baixa latitude) e a evapotranspiração da floresta alimentam a Massa Equatorial Continental (mEc), gerando temperaturas médias elevadas (25 °C a 28 °C), baixa amplitude térmica e chuvas abundantes durante todos os meses do ano.",
          "Enquanto o Clima Tropical Típico (Centro-Oeste e interior do Sudeste) apresenta verão quente/chuvoso e inverno seco bem demarcados, o Clima Subtropical (Região Sul) registra chuvas regulares o ano todo e a maior amplitude térmica anual do Brasil devido à entrada da Massa Polar Atlântica (mPa)."
        ],
        importantRelations:
          "Relaciona diretamente os fatores climáticos (latitude, altitude e massas de ar) ao regime pluviométrico e térmico das regiões brasileiras, à interpretação de climogramas e à distribuição espacial dos climas Equatorial, Tropical, Semiárido e Subtropical no Brasil.",
        commonMistake:
          "Confundir o regime pluviométrico do Clima Equatorial (quente e chuvoso o ano inteiro, sem estação seca) com o do Clima Tropical Típico (verão chuvoso e inverno seco), ou inverter as características térmicas e pluviométricas do Clima Semiárido e do Clima Subtropical.",
        mistakeCorrection:
          "Diferenciar pela distribuição de chuvas e temperatura: o Clima Equatorial é quente e úmido o ano todo (Amazônia); o Tropical Típico tem verão chuvoso e inverno seco (Brasil Central); o Semiárido apresenta altas temperaturas e chuvas escassas e irregulares (Sertão Nordestino); e o Subtropical possui chuvas bem distribuídas o ano todo e invernos frios com elevada amplitude térmica (Região Sul).",
        analogyExplanation:
          "Para ler qualquer climograma dos tipos climáticos do Brasil, observe duas pistas geográficas: as barras azuis (precipitação mensal de chuva) mostram se chove o ano todo (Equatorial e Subtropical), se o inverno é seco (Tropical) ou se chove muito pouco (Semiárido); já a linha da temperatura revela se faz calor constante o ano inteiro (baixa latitude ao norte) ou se a temperatura cai bastante no inverno (Subtropical no Sul)!",
        gapIdentified: `Relação entre fatores climáticos (latitude, altitude, massas de ar), comportamento da temperatura/umidade/precipitação e distribuição espacial dos climas em ${topicTitle}.`,
        keyTerms: ["Fatores Climáticos (Latitude e Altitude)", "Massas de Ar no Brasil (mEc, mTa, mPa)", "Temperatura, Umidade e Precipitação", "Clima Equatorial e Clima Tropical", "Clima Semiárido e Clima Subtropical", "Distribuição Espacial e Climogramas"]
      };
    }

    if (
      norm.includes("bioma") ||
      norm.includes("morfoclimátic") ||
      norm.includes("amazônia") ||
      norm.includes("cerrado") ||
      norm.includes("caatinga") ||
      norm.includes("mata atlântica") ||
      norm.includes("pampa") ||
      norm.includes("pantanal") ||
      norm.includes("araucária") ||
      norm.includes("quioto") ||
      norm.includes("paris") ||
      norm.includes("desmatamento") ||
      norm.includes("ambiental") ||
      norm.includes("sustentável")
    ) {
      return {
        disciplineId: profile.id,
        disciplineName: profile.name,
        areaType: "humanas",
        topicTitle,
        moduleTitle,
        prerequisiteTitle: "Relação entre clima, relevo, solo e cobertura vegetal nos domínios morfoclimáticos e biomas brasileiros",
        coreDefinition: `Na Geografia, o estudo de "${topicTitle}" analisa a interação entre relevo, solo, hidrografia, clima e vegetação que configura os seis Domínios Morfoclimáticos de Aziz Ab'Sáber (Amazônico, Cerrado, Mares de Morros, Caatinga, Araucárias e Pradarias, além das faixas de transição como o Pantanal) e os grandes biomas brasileiros, avaliando suas características fitogeográficas e os desafios de conservação ambiental.`,
        historicalContext:
          "O geógrafo brasileiro Aziz Nacib Ab'Sáber sistematizou a classificação dos Domínios Morfoclimáticos e Fitogeográficos do Brasil, demonstrando como a combinação entre condições climáticas, modelado do relevo e tipos de solo origina paisagens naturais específicas e faixas de transição.",
        mechanismsAndProcesses:
          "1) Identificar as adaptações da vegetação às condições de clima e solo de cada domínio (floresta ombrófila densa e latifoliada na Amazônia; árvores de troncos tortuosos, casca grossa e raízes profundas em solos ácidos no Cerrado; vegetação xerófila e caducifólia na Caatinga); 2) Localizar espacialmente os domínios morfoclimáticos e as faixas de transição no mapa do Brasil; 3) Avaliar os impactos ambientais (desmatamento, queimadas, perda de biodiversidade) e as unidades de conservação.",
        practicalExamples: [
          "No domínio do Cerrado (Brasil Central), sob clima tropical sazonal e solos antigos e ácidos, a vegetação desenvolveu raízes profundas para alcançar o lençol freático e cascas corticosas grossas resistentes à passagem natural do fogo.",
          "No domínio da Caatinga (Sertão Nordestino), adaptado ao clima semiárido, predominam plantas xerófilas (como cactáceas que armazenam água) e caducifólias (que perdem as folhas na estação seca para evitar a transpiração)."
        ],
        importantRelations:
          "Relaciona diretamente o regime climático e pedológico de cada região brasileira às características adaptativas da cobertura vegetal e ao zoneamento socioambiental do território.",
        commonMistake:
          "Confundir as características da vegetação do Cerrado (tropófila, com troncos retorcidos e raízes profundas em clima tropical sazonal) com as da Caatinga (xerófila, adaptada à escassez hídrica do clima semiárido).",
        mistakeCorrection:
          "Associar cada bioma e domínio morfoclimático ao seu respectivo clima e relevo: Amazônia (clima equatorial úmido e floresta latifoliada), Cerrado (clima tropical típico e savana arborizada), Caatinga (clima semiárido e vegetação xerófila) e Mares de Morros (clima tropical úmido e Mata Atlântica).",
        analogyExplanation:
          "Pense nos Domínios Morfoclimáticos como retratos completos da paisagem brasileira: a vegetação nunca aparece sozinha; ela é o espelho direto da quantidade de chuva que cai (clima), da forma do terreno (relevo) e dos nutrientes disponíveis na terra (solo)!",
        gapIdentified: `Correlação entre condições climáticas, relevo, solo e cobertura vegetal nos biomas e domínios morfoclimáticos em ${topicTitle}.`,
        keyTerms: ["Domínios Morfoclimáticos (Aziz Ab'Sáber)", "Amazônia e Mata Atlântica", "Cerrado e Caatinga (Vegetação Xerófila)", "Araucárias, Pradarias e Pantanal", "Faixas de Transição", "Conservação Ambiental"]
      };
    }

    if (
      norm.includes("estrutura interna") ||
      norm.includes("deriva continental") ||
      norm.includes("tectônica") ||
      norm.includes("placas") ||
      norm.includes("crosta") ||
      norm.includes("manto") ||
      norm.includes("núcleo") ||
      norm.includes("endógeno") ||
      norm.includes("vulcanismo") ||
      norm.includes("terremoto") ||
      norm.includes("litosfera")
    ) {
      return {
        disciplineId: profile.id,
        disciplineName: profile.name,
        areaType: "humanas",
        topicTitle,
        moduleTitle,
        prerequisiteTitle: "Caracterização das camadas internas da Terra (Crosta, Manto e Núcleo), Correntes de Convecção e evidências da Deriva Continental de Wegener",
        coreDefinition: `Na Geografia Física e Geologia, o estudo de "${topicTitle}" analisa a estrutura interna da Terra — dividida em Crosta Terrestre (camada superficial sólida, subdividida em crosta continental granítica/SIAL e oceânica basáltica/SIMA, que junto ao topo do manto superior forma a Litosfera rígida), Manto (camada intermediária onde a Astenosfera apresenta magma pastoso em movimento por Correntes de Convecção Térmica) e Núcleo (composto de níquel e ferro — NIFE —, com núcleo externo líquido gerador do campo magnético terrestre e núcleo interno sólido) — e explica a Deriva Continental (Alfred Wegener, 1912) e a Tectônica de Placas.`,
        historicalContext:
          "Em 1912, o cientista alemão Alfred Wegener formulou a Teoria da Deriva Continental, propondo que há cerca de 225 milhões de anos todos os continentes estavam unidos em um único supercontinente chamado Pangeia (cercado pelo oceano Pantalassa). Na década de 1960, o mapeamento do assoalho oceânico (Harry Hess e Tuzo Wilson) confirmou a expansão do fundo oceânico e consolidou a Teoria da Tectônica de Placas.",
        mechanismsAndProcesses:
          "1) Distinguir a composição, temperatura e estado físico de cada camada (Crosta/Litosfera rígida → Manto/Astenosfera com correntes de convecção de magma → Núcleo externo líquido e interno sólido); 2) Compreender que as Correntes de Convecção do Manto são o motor térmico que move as placas litosféricas; 3) Relacionar as evidências da Deriva Continental (encaixe geométrico entre a costa leste da América do Sul e a costa oeste da África, fósseis idênticos de répteis como o Mesosaurus e plantas Glossopteris e continuidade de estruturas rochosas) aos limites de placas (divergentes, convergentes e transformantes).",
        practicalExamples: [
          "O contorno do litoral do Nordeste brasileiro encaixa-se com precisão no Golfo da Guiné (África), e em ambos os lados do Oceano Atlântico encontram-se fósseis do réptil de água doce Mesosaurus (que jamais conseguiria nadar milhares de quilômetros em mar aberto), comprovando a antiga união na Pangeia.",
          "Nos limites divergentes (como a Dorsal Mesoatlântica), o magma sobe pelas correntes de convecção do manto afastando as placas e criando nova crosta oceânica; já nos limites convergentes (como o encontro da Placa de Nazca com a Placa Sul-Americana), ocorre subducção e soerguimento da Cordilheira dos Andes."
        ],
        importantRelations:
          "Explica por que o território brasileiro (localizado no interior centro-oriental da Placa Sul-Americana, distante das bordas de placas) apresenta estabilidade tectônica relativa, ausência de vulcões ativos e predomínio de planaltos antigos e bacias sedimentares.",
        commonMistake:
          "Confundir a Litosfera rígida (crosta + topo do manto superior) com a Astenosfera plástica onde ocorrem as correntes de convecção, ou achar que os continentes flutuam diretamente sobre a água dos oceanos em vez de integrarem placas tectônicas rochosas sobre o manto.",
        mistakeCorrection:
          "As placas tectônicas são blocos rígidos da Litosfera (abrangendo tanto continentes quanto o fundo oceânico) que se deslocam sobre o magma viscoso da Astenosfera (no Manto Superior), impulsionadas pelas correntes de convecção geradas pelo calor interno da Terra.",
        analogyExplanation:
          "Imagine uma panela de sopa espessa aquecida no fogão com fatias de torrada flutuando na superfície: o calor do fundo faz o líquido quente subir e o mais frio descer em círculos (correntes de convecção no Manto), empurrando lentamente as fatias rígidas na superfície (as Placas Tectônicas da Crosta/Litosfera)!",
        gapIdentified: `Diferenciação entre Crosta (Litosfera), Manto (Correntes de Convecção) e Núcleo e compreensão das evidências da Deriva Continental em ${topicTitle}.`,
        keyTerms: ["Crosta, Manto e Núcleo", "Litosfera e Astenosfera", "Correntes de Convecção Magmática", "Deriva Continental (Alfred Wegener)", "Pangeia e Evidências Fósseis", "Tectônica de Placas"]
      };
    }

    if (
      norm.includes("bacia") ||
      norm.includes("hidrográfic") ||
      norm.includes("hidrografia") ||
      norm.includes("aquífero") ||
      norm.includes("guarani") ||
      norm.includes("alter do chão") ||
      norm.includes("rios") ||
      norm.includes("fluvial")
    ) {
      return {
        disciplineId: profile.id,
        disciplineName: profile.name,
        areaType: "humanas",
        topicTitle,
        moduleTitle,
        prerequisiteTitle: "Estrutura das bacias hidrográficas (nascente, foz, afluentes e divisores de águas), regime dos rios brasileiros e reservatórios subterrâneos (aquíferos)",
        coreDefinition: `Na Hidrografia, o estudo de "${topicTitle}" analisa o ciclo hidrológico continental, os elementos de uma bacia hidrográfica (rio principal, afluentes, subafluentes, nascente, foz e divisores topográficos de águas), as grandes regiões hidrográficas do Brasil (Amazônica, Paraná, São Francisco, Tocantins-Araguaia, entre outras) e os principais sistemas de águas subterrâneas (Aquífero Guarani e Aquífero Alter do Chão).`,
        historicalContext:
          "O gerenciamento dos recursos hídricos no Brasil é regido pela Política Nacional de Recursos Hídricos (Lei nº 9.433/1997) e monitorado pela Agência Nacional de Águas (ANA), que organiza o território em 12 Regiões Hidrográficas com predomínio de rios de regime pluvial e drenagem exorreica.",
        mechanismsAndProcesses:
          "1) Identificar os elementos da bacia hidrográfica e o tipo de drenagem (exorreica quando deságua no mar, como predomina no Brasil); 2) Diferenciar rios de planalto (alto potencial hidrelétrico, como nas bacias do Paraná e do São Francisco) de rios de planície (favoráveis à navegação fluvial, como na Bacia Amazônica); 3) Compreender a recarga e a importância estratégica dos aquíferos sedimentares (Guarani no Centro-Sul e Alter do Chão na Amazônia).",
        practicalExamples: [
          "A Bacia do Paraná concentra a maior capacidade instalada de geração hidrelétrica do país por percorrer áreas de planalto com desníveis topográficos, enquanto a Bacia Amazônica detém a maior vazão de água doce do planeta e extensas hidrovias naturais de planície.",
          "O Rio São Francisco ('Rio da Integração Nacional') nasce na Serra da Canastra (MG) em clima tropical úmido e atravessa o Sertão Semiárido mantendo-se perene."
        ],
        importantRelations:
          "Relaciona o relevo e o regime pluviométrico ao aproveitamento múltiplo das águas (abastecimento, irrigação, navegação e geração hidrelétrica) e à preservação das matas ciliares.",
        commonMistake:
          "Confundir a Bacia Amazônica (maior volume total de água e área no Brasil) com a Bacia do Paraná (maior aproveitamento hidrelétrico instalado próximo ao centro consumidor do Centro-Sul).",
        mistakeCorrection:
          "A Região Hidrográfica Amazônica detém a maior disponibilidade hídrica superficial do Brasil, enquanto a Bacia do Paraná concentra o maior parque hidrelétrico instalado devido aos rios de planalto e à proximidade dos grandes centros industriais e urbanos.",
        analogyExplanation:
          "Pense em uma Bacia Hidrográfica como uma grande folha de árvore sob a chuva: as bordas mais altas (divisores de águas nas serras) direcionam todas as gotas que caem para as nervuras menores (afluentes), que deságuam na nervura central principal (o rio principal)!",
        gapIdentified: `Compreensão das bacias hidrográficas brasileiras, potencial hidrelétrico vs navegável e aquíferos subterrâneos em ${topicTitle}.`,
        keyTerms: ["Bacias e Regiões Hidrográficas do Brasil", "Rios de Planalto vs Rios de Planície", "Bacia Amazônica, do Paraná e do São Francisco", "Aquífero Guarani e Alter do Chão", "Ciclo Hidrológico e Drenagem Exorreica", "Gestão de Recursos Hídricos"]
      };
    }

    if (
      norm.includes("relevo") ||
      norm.includes("intemperismo") ||
      norm.includes("exógeno") ||
      norm.includes("erosão") ||
      norm.includes("solo") ||
      norm.includes("pedogênese") ||
      norm.includes("desertificação") ||
      norm.includes("mineral")
    ) {
      return {
        disciplineId: profile.id,
        disciplineName: profile.name,
        areaType: "humanas",
        topicTitle,
        moduleTitle,
        prerequisiteTitle: "Atuação do intemperismo físico e químico, formação dos solos (pedogênese) e unidades do relevo brasileiro (planaltos, depressões e planícies)",
        coreDefinition: `Na Geomorfologia e Pedologia, o estudo de "${topicTitle}" investiga a modelagem da superfície terrestre pelos agentes exógenos (intemperismo físico e químico, erosão pluvial, fluvial e eólica), a formação e conservação dos solos (pedogênese) e a compartimentação do relevo brasileiro segundo Jurandyr Ross em planaltos, depressões e planícies.`,
        historicalContext:
          "A classificação do relevo brasileiro evoluiu dos estudos pioneiros de Aroldo de Azevedo (1940) e Aziz Ab'Sáber (1958) até o mapeamento geomorfológico de Jurandyr Ross (1989, com imagens de radar do Projeto RADAMBRASIL), que identificou 28 unidades entre planaltos, depressões periféricas/marginais e planícies.",
        mechanismsAndProcesses:
          "1) Diferenciar intemperismo físico (desagregação mecânica da rocha por variação térmica) de intemperismo químico (decomposição mineralógica pela ação da água, predominante no clima tropical úmido brasileiro); 2) Distinguir Planaltos (superfícies onde o desgaste erosivo supera a sedimentação), Depressões (áreas rebaixadas em relação ao entorno por erosão prolongada) e Planícies (áreas planas onde a deposição de sedimentos supera a erosão); 3) Aplicar práticas de conservação do solo (curvas de nível, terraceamento e plantio direto).",
        practicalExamples: [
          "No Brasil, por predominar o clima quente e úmido, o intemperismo químico atua intensamente sobre a rocha-mãe, originando solos profundos (latossolos) e modelando formas arredondadas nos planaltos do Sudeste ('Mares de Morros').",
          "Para evitar a erosão laminar, as ravinas e as voçorocas em encostas agrícolas, utiliza-se o plantio em curvas de nível e o terraceamento, que reduzem a velocidade do escoamento superficial da água da chuva."
        ],
        importantRelations:
          "Conecta a estrutura geológica (escudos cristalinos e bacias sedimentares) e a ação climática ao modelado do relevo e à conservação pedológica.",
        commonMistake:
          "Definir planaltos e planícies apenas pela altitude absoluta em metros, em vez de considerar o processo geomorfológico predominante (erosão nos planaltos versus sedimentação nas planícies).",
        mistakeCorrection:
          "Na classificação geomorfológica de Aziz Ab'Sáber e Jurandyr Ross, nos Planaltos predomina o processo de desgaste erosivo (erosão > sedimentação), enquanto nas Planícies predomina o acúmulo recente de sedimentos (sedimentação > erosão).",
        analogyExplanation:
          "Pense no relevo como uma escultura de pedra ao ar livre: os agentes exógenos (a chuva, o vento e os rios) funcionam como o cinzel do escultor, desgastando as partes mais altas (planaltos e depressões) e depositando os sedimentos nas partes mais baixas (planícies)!",
        gapIdentified: `Diferenciação entre intemperismo físico e químico e classificação geomorfológica de planaltos, depressões e planícies em ${topicTitle}.`,
        keyTerms: ["Intemperismo Físico e Químico", "Erosão e Conservação de Solos (Pedogênese)", "Planaltos, Depressões e Planícies (Jurandyr Ross)", "Escudos Cristalinos e Bacias Sedimentares", "Curvas de Nível e Terraceamento", "Geomorfologia Brasileira"]
      };
    }

    if (
      norm.includes("demogr") ||
      norm.includes("natalidade") ||
      norm.includes("mortalidade") ||
      norm.includes("fecundidade") ||
      norm.includes("pirâmide") ||
      norm.includes("popula") ||
      norm.includes("migra") ||
      norm.includes("êxodo") ||
      norm.includes("refugiado") ||
      norm.includes("pea") ||
      norm.includes("malthus")
    ) {
      return {
        disciplineId: profile.id,
        disciplineName: profile.name,
        areaType: "humanas",
        topicTitle,
        moduleTitle,
        prerequisiteTitle: "Indicadores demográficos (natalidade, mortalidade, fecundidade e crescimento vegetativo), transição demográfica e fluxos migratórios",
        coreDefinition: `Na Geografia da População, o estudo de "${topicTitle}" analisa a dinâmica demográfica — crescimento vegetativo (diferença entre taxa de natalidade e taxa de mortalidade), taxa de fecundidade, transição demográfica, estrutura etária representada nas pirâmides etárias, distribuição da População Economicamente Ativa (PEA) e movimentos migratórios internos e internacionais.`,
        historicalContext:
          "A partir da segunda metade do século XX, os Censos Demográficos do IBGE registraram uma profunda transição demográfica no Brasil: inicialmente caiu a taxa de mortalidade (avanços sanitários, vacinação e urbanização) e, a partir da década de 1970, caiu acentuadamente a taxa de fecundidade (de mais de 6 filhos por mulher para cerca de 1,6), provocando o estreitamento da base da pirâmide etária e o envelhecimento populacional.",
        mechanismsAndProcesses:
          "1) Calcular e distinguir Crescimento Vegetativo (Natalidade − Mortalidade) de Crescimento Demográfico Total (que soma o saldo migratório); 2) Interpretar o formato da Pirâmide Etária (base larga indica alta natalidade e população jovem; topo alargado e base estreita indicam baixa fecundidade e envelhecimento populacional); 3) Analisar os fatores de repulsão e atração nos fluxos migratórios (êxodo rural, migrações inter-regionais, migração pendular e deslocamentos internacionais).",
        practicalExamples: [
          "No Brasil contemporâneo, a queda da taxa de fecundidade abaixo do nível de reposição (2,1 filhos por mulher) estreitou a base da pirâmide etária e aumentou a proporção de idosos, exigindo planejamento previdenciário e de saúde pública.",
          "Nas grandes Regiões Metropolitanas brasileiras, milhões de trabalhadores realizam diariamente a migração pendular (deslocamento cotidiano de ida e volta entre o município de moradia na periferia e o local de trabalho ou estudo no município-polo)."
        ],
        importantRelations:
          "Relaciona as fases da transição demográfica ao aproveitamento do bônus demográfico (janela em que a PEA em idade ativa supera a proporção de crianças e idosos dependentes) e à redistribuição espacial da população no território.",
        commonMistake:
          "Confundir país populoso (grande população absoluta total, como o Brasil) com país povoado (alta densidade demográfica ou população relativa em hab/km²), ou confundir taxa de natalidade com taxa de fecundidade.",
        mistakeCorrection:
          "População absoluta é o número total de habitantes (populoso), enquanto população relativa ou densidade demográfica é a divisão da população absoluta pela área territorial em km² (povoado). Já a taxa de fecundidade mede o número médio de filhos por mulher em idade reprodutiva.",
        analogyExplanation:
          "Olhar para uma Pirâmide Etária é como ver a fotografia de gerações de um país: a base mostra as crianças nascidas agora, o meio mostra os jovens e adultos trabalhando (PEA) e o topo mostra os idosos. Quando nascem menos bebês e as pessoas vivem mais anos, a pirâmide deixa de ter forma de triângulo e ganha o formato de um jarro mais largo no centro e no topo!",
        gapIdentified: `Diferenciação entre indicadores demográficos (natalidade, fecundidade, crescimento vegetativo, populoso vs povoado) e leitura de pirâmides etárias em ${topicTitle}.`,
        keyTerms: ["Crescimento Vegetativo e Transição Demográfica", "Taxa de Natalidade e Fecundidade", "Pirâmide Etária e Bônus Demográfico", "Populoso vs Povoado (Densidade Demográfica)", "Êxodo Rural e Migração Pendular", "População Economicamente Ativa (PEA)"]
      };
    }

    if (
      norm.includes("urban") ||
      norm.includes("cidade") ||
      norm.includes("metropol") ||
      norm.includes("conurbação") ||
      norm.includes("segregação") ||
      norm.includes("gentrificação") ||
      norm.includes("mobilidade") ||
      norm.includes("calor") ||
      norm.includes("inversão térmica") ||
      norm.includes("saneamento")
    ) {
      return {
        disciplineId: profile.id,
        disciplineName: profile.name,
        areaType: "humanas",
        topicTitle,
        moduleTitle,
        prerequisiteTitle: "Processo de urbanização, hierarquia da rede urbana, conurbação metropolitana e organização do espaço intraurbano",
        coreDefinition: `Na Geografia Urbana, o estudo de "${topicTitle}" analisa o crescimento das cidades e a transição da população rural para a urbana, a formação de Regiões Metropolitanas e megalópoles pelo fenômeno da conurbação (encontro físico das manchas urbanas de municípios vizinhos), a hierarquia da rede urbana (metrópoles globais, nacionais, capitais regionais e centros locais), a segregação socioespacial e os impactos microclimáticos urbanos (ilhas de calor e inversão térmica).`,
        historicalContext:
          "Impulsionada pela industrialização substitutiva de importações e pela mecanização do campo a partir da década de 1950 (governo JK e décadas seguintes), a urbanização brasileira ocorreu de forma rápida e concentrada, fazendo a população urbana saltar de 36% em 1950 para mais de 84% no século XXI.",
        mechanismsAndProcesses:
          "1) Compreender a Conurbação (unificação física e funcional da malha urbana de duas ou mais cidades limítrofes, formando uma Região Metropolitana); 2) Analisar a Segregação Socioespacial e a Gentrificação (valorização imobiliária que expulsa populações de baixa renda para periferias distantes sem infraestrutura); 3) Explicar os fenômenos ambientais urbanos: Ilha de Calor (aquecimento das áreas centrais asfaltadas e verticalizadas em relação às áreas verdes periféricas) e Inversão Térmica (retenção do ar frio e poluentes próximo à superfície no inverno).",
        practicalExamples: [
          "Quando a expansão horizontal da capital de um estado encontra fisicamente a mancha urbana dos municípios vizinhos, integrando fluxos diários de transporte e serviços, ocorre a conurbação, base para a instituição de uma Região Metropolitana.",
          "Nos centros densamente construídos, a substituição de vegetação por concreto e asfalto (que absorvem muita radiação solar) e a concentração de veículos criam Ilhas de Calor, elevando a temperatura local em vários graus acima dos bairros arborizados."
        ],
        importantRelations:
          "Relaciona o ritmo acelerado da urbanização brasileira à macrocefalia urbana, à demanda por mobilidade e saneamento básico e ao planejamento diretor municipal.",
        commonMistake:
          "Confundir Ilha de Calor (diferença de temperatura entre o centro impermeabilizado e a periferia arborizada) com Inversão Térmica (camada de ar frio retida abaixo de uma camada de ar quente que impede a dispersão vertical de poluentes).",
        mistakeCorrection:
          "A Ilha de Calor é uma elevação térmica nas zonas centrais urbanas por excesso de concreto, asfalto e falta de áreas verdes; já a Inversão Térmica é um fenômeno meteorológico natural (agravado pela poluição urbana no inverno) em que o ar frio denso fica preso perto do solo sob uma camada de ar mais quente, impedindo a subida e dispersão dos poluentes.",
        analogyExplanation:
          "Pense na Conurbação como duas manchas de tinta que crescem no papel até se tocarem: antes havia uma estrada vazia separando duas cidades vizinhas, mas ambas cresceram tanto que hoje você atravessa uma rua e já mudou de município sem perceber onde um termina e o outro começa!",
        gapIdentified: `Compreensão de conurbação, hierarquia urbana, segregação socioespacial e diferença entre ilha de calor e inversão térmica em ${topicTitle}.`,
        keyTerms: ["Urbanização e Êxodo Rural", "Conurbação e Região Metropolitana", "Hierarquia e Rede Urbana", "Segregação Socioespacial e Gentrificação", "Ilha de Calor Urbana", "Inversão Térmica"]
      };
    }

    return {
      disciplineId: profile.id,
      disciplineName: profile.name,
      areaType: "humanas",
      topicTitle,
      moduleTitle,
      prerequisiteTitle: "Divisão Internacional do Trabalho (DIT), blocos econômicos, multipolaridade geopolítica e fluxos da globalização",
      coreDefinition: `Na Geografia Econômica e Geopolítica, o estudo de "${topicTitle}" analisa a organização do espaço mundial, a transição da ordem bipolar da Guerra Fria (EUA vs. URSS) para a Nova Ordem Mundial multipolar, as fases da Divisão Internacional do Trabalho (DIT), os níveis de integração dos Blocos Econômicos regionais (Mercosul, União Europeia, USMCA), a atuação dos países emergentes (BRICS) e as redes técnicas, financeiras e comerciais da globalização.`,
      historicalContext:
        "Após a queda do Muro de Berlim (1989) e a dissolução da União Soviética (1991), o sistema internacional deixou a bipolaridade militar-ideológica e ingressou na multipolaridade econômico-tecnológica do meio técnico-científico-informacional (conceito de Milton Santos), marcada pela ascensão de blocos econômicos e novas potências emergentes como a China e o grupo BRICS.",
      mechanismsAndProcesses:
        "1) Distinguir a Ordem Bipolar da Guerra Fria (disputa hegemônica entre capitalismo norte-americano e socialismo soviético) da Nova Ordem Multipolar (múltiplos polos de poder econômico: EUA, União Europeia, China/Ásia-Pacífico e potências regionais); 2) Classificar os estágios dos Blocos Econômicos: Zona de Livre Comércio → União Aduaneira (Tarifa Externa Comum, como o Mercosul) → Mercado Comum (livre circulação de pessoas, bens, serviços e capitais) → União Econômica e Monetária (moeda única, como o Euro na União Europeia); 3) Analisar a posição dos países na Divisão Internacional do Trabalho (DIT).",
      practicalExamples: [
        "Na evolução dos blocos econômicos, enquanto o USMCA atua como Zona de Livre Comércio (redução de tarifas alfandegárias para mercadorias entre os países-membros), a União Europeia atingiu os estágios de Mercado Comum (livre circulação de cidadãos pelo Espaço Schengen) e União Monetária (adoção do Euro na Zona do Euro).",
        "Na Nova Divisão Internacional do Trabalho, países emergentes industrializados (como Brasil, México, China e Índia) deixaram de ser apenas exportadores exclusivos de matérias-primas coloniais e passaram a abrigar parques industriais, transnacionais e centros de serviços, embora ainda enfrentem assimetrias tecnológicas."
      ],
      importantRelations:
        "Articula os fluxos comerciais, financeiros e informacionais da globalização com a soberania dos Estados-nação, as fronteiras estratégicas e os acordos de integração regional.",
      commonMistake:
        "Confundir Zona de Livre Comércio (apenas redução ou eliminação de tarifas internas sobre mercadorias) com Mercado Comum (que exige também a livre circulação de pessoas/trabalhadores, capitais e serviços).",
      mistakeCorrection:
        "Observar a escala crescente de integração dos blocos econômicos: 1º Zona de Livre Comércio (mercadorias); 2º União Aduaneira (Zona de Livre Comércio + Tarifa Externa Comum para países de fora); 3º Mercado Comum (União Aduaneira + livre circulação de pessoas, serviços e capitais); 4º União Econômica e Monetária (Mercado Comum + moeda e banco central únicos).",
      analogyExplanation:
        "Pense nos estágios dos Blocos Econômicos como níveis de parceria entre vizinhos: na Zona de Livre Comércio, eles apenas tiram a taxa para vender produtos um ao outro; na União Aduaneira, combinam cobrar o mesmo preço de quem vem de fora (TEC); no Mercado Comum, abrem os portões para qualquer morador trabalhar e morar livremente na casa vizinha; e na União Monetária, passam a usar a mesma moeda na carteira!",
      gapIdentified: `Distinção entre ordem bipolar e multipolar, fases da Divisão Internacional do Trabalho (DIT) e estágios de integração dos blocos econômicos em ${topicTitle}.`,
      keyTerms: ["Ordem Bipolar vs Multipolar", "Divisão Internacional do Trabalho (DIT)", "Globalização e Meio Técnico-Científico-Informacional", "Blocos Econômicos (Mercosul e União Europeia)", "BRICS e Países Emergentes", "Geopolítica e Conflitos Territoriais"]
    };
  }

  // =========================================================================
  // 7. LÍNGUA PORTUGUESA E REDAÇÃO
  // =========================================================================
  if (profile.id === "lingua-portuguesa-redacao") {
    if (norm.includes("substantivo") || (norm.includes("flexão") && norm.includes("gênero"))) {
      return {
        disciplineId: profile.id,
        disciplineName: profile.name,
        areaType: "linguagens",
        topicTitle,
        moduleTitle,
        prerequisiteTitle: "Identificação da função nomeadora do substantivo, critérios de classificação (comum/próprio, concreto/abstrato, primitivo/derivado, simples/composto, coletivo) e regras de flexão de gênero, número e grau",
        coreDefinition: `Na Língua Portuguesa, o estudo de "${topicTitle}" compreende a classe gramatical variável que nomeia seres, objetos, lugares, fenômenos, sentimentos, estados, qualidades e ações. Sua análise abrange: 1) a Classificação semântica e morfológica em Comum vs. Próprio, Concreto (existência independente real ou imaginária) vs. Abstrato (ações, estados, qualidades e sentimentos dependentes de outro ser), Primitivo vs. Derivado, Simples vs. Composto e Coletivo; e 2) a Flexão Nominal de Gênero (biformes vs. uniformes: epicenos, comuns de dois gêneros e sobrecomuns), Número (singular e plural dos simples e compostos) e Grau (aumentativo e diminutivo analítico e sintético).`,
        historicalContext:
          "Na gramática descritiva e normativa da Língua Portuguesa (Evanildo Bechara, Celso Cunha e Lindley Cintra), o substantivo constitui o núcleo do sintagma nominal (sujeito, objeto direto/indireto, predicativo, aposto), em torno do qual concordam em gênero e número os determinantes (artigos, adjetivos, pronomes e numerais).",
        mechanismsAndProcesses:
          "1) Para classificar o substantivo: verificar se designa toda uma espécie ('rio' = comum) ou um ser individualizado ('Amazonas' = próprio); se tem existência autônoma ('casa', 'ar', 'sereia' = concreto) ou se designa ação/estado/qualidade dependente de um ser ('corrida', 'beleza', 'alegria' = abstrato); se é formado por um radical ('sol' = simples) ou mais de um ('girassol', 'guarda-chuva' = composto); 2) Para flexionar em gênero e número: diferenciar substantivos comuns de dois gêneros (mudam o artigo: 'o/a estudante'), sobrecomuns (gênero único para pessoas: 'a criança', 'a vítima') e epicenos (animais com 'macho/fêmea': 'a onça macho/fêmea'); e no plural dos compostos, flexionar variáveis (substantivo, adjetivo, numeral) mantendo invariáveis verbos e advérbios ('guarda-chuvas', 'quartas-feiras').",
        practicalExamples: [
          "Na frase 'A coragem da estudante garantiu a vitória da equipe na competição', 'estudante' é substantivo comum, concreto, simples e comum de dois gêneros; 'coragem' e 'vitória' são substantivos abstratos (nomeiam qualidade e resultado de ação dependentes de alguém); e 'equipe' é substantivo coletivo.",
          "Na flexão de número dos substantivos compostos: em 'guarda-noturno' (substantivo + adjetivo) ambos vão para o plural ('guardas-noturnos'); já em 'guarda-chuva' (verbo guardar + substantivo chuva), apenas o segundo elemento varia ('guarda-chuvas')."
        ],
        importantRelations:
          "É a base direta para o domínio da Concordância Nominal (ajuste de gênero e número entre o substantivo e seus determinantes) e para a precisão vocabular e coesão nominal na Redação.",
        commonMistake:
          "Confundir substantivo concreto com 'aquilo que é palpável/físico' e classificar seres imaginários ('fada', 'dragão') ou elementos como 'vento' e 'fogo' como abstratos, ou errar o plural de substantivos compostos que contêm verbo.",
        mistakeCorrection:
          "Substantivo concreto nomeia qualquer ser de existência autônoma no mundo real ou ficcional ('vento', 'sombra', 'fada', 'livro'), enquanto substantivo abstrato nomeia exclusivamente ações ('leitura', 'viagem'), estados ('velhice', 'doença'), sentimentos ('amor', 'saudade') e qualidades ('honestidade', 'beleza') que precisam de um ser para se manifestar.",
        analogyExplanation:
          "Pense na diferença entre Concreto e Abstrato assim: a 'lâmpada' e o 'pintor' têm existência própria como seres (substantivos concretos), mas a 'claridade' e a 'pintura' (no sentido do ato de pintar) só existem porque a lâmpada brilha ou o pintor age (substantivos abstratos)!",
        gapIdentified: `Diferenciação entre substantivo concreto e abstrato, comum e próprio, primitivo e derivado e regras de flexão de gênero e número em ${topicTitle}.`,
        keyTerms: ["Substantivo Comum e Próprio", "Substantivo Concreto e Abstrato", "Substantivo Primitivo, Derivado e Coletivo", "Gênero: Epiceno, Sobrecomum e Comum de Dois", "Plural dos Substantivos Compostos", "Flexão de Grau Analítico e Sintético"]
      };
    }

    const isRedacao = norm.includes("redação") || norm.includes("dissertativ") || norm.includes("enem") || norm.includes("tese") || norm.includes("intervenção") || norm.includes("repertório") || norm.includes("competência");
    return {
      disciplineId: profile.id,
      disciplineName: profile.name,
      areaType: "linguagens",
      topicTitle,
      moduleTitle,
      prerequisiteTitle: isRedacao
        ? "Estrutura do texto dissertativo-argumentativo (Tese, Argumentação com Repertório e Proposta de Intervenção com 5 elementos)"
        : `Análise morfossintática, semântica e coesão textual aplicada a ${topicTitle}`,
      coreDefinition: isRedacao
        ? `O estudo de "${topicTitle}" aborda o planejamento e a construção do texto dissertativo-argumentativo segundo a matriz de referência do ENEM: estruturação estética em Introdução (contextualização, repertório sociocultural legítimo e tese com dois argumentos), Desenvolvimento (D1 e D2 com tópico frasal, fundamentação, argumentação crítica e fechamento) e Conclusão por Proposta de Intervenção detalhada (Agente, Ação, Meio/Modo, Efeito e Detalhamento), respeitando os Direitos Humanos e o uso de operadores argumentativos.`
        : `O estudo de "${topicTitle}" analisa a estrutura morfossintática, semântica e discursiva da Língua Portuguesa — abrangendo formação de palavras, classes gramaticais, termos da oração, coordenação e subordinação, pontuação expressiva, concordância, regência, crase e mecanismos de coesão referencial e sequencial — aplicada à interpretação crítica e à produção de textos.`,
      historicalContext:
        "A tradição gramatical e linguística em língua portuguesa articula a gramática normativa de referência (Evanildo Bechara, Celso Cunha e Lindley Cintra) com a Linguística Textual e Análise do Discurso contemporâneas (Ingedore Villaça Koch, Luiz Antônio Marcuschi, José Luiz Fiorin), demonstrando que as escolhas lexicais e sintáticas produzem sentidos precisos no texto.",
      mechanismsAndProcesses: isRedacao
        ? "1) Analisar todos os termos da frase temática para evitar fuga ou tangenciamento ao tema; 2) Estruturar o projeto de texto com tese clara e dois encaminhamentos argumentativos (A1 e A2); 3) Mobilizar repertório sociocultural legítimo, pertinente e produtivo nos parágrafos de desenvolvimento, conectando períodos e parágrafos com operadores argumentativos inter e intraparágrafos; 4) Elaborar na conclusão uma Proposta de Intervenção contendo obrigatoriamente os 5 elementos válidos (Agente, Ação, Meio/Modo, Efeito e Detalhamento de um deles)."
        : "1) Analisar a função de cada termo dentro do contexto da oração (não apenas a palavra isolada, pois a classe e a função dependem da relação sintática); 2) Observar como a pontuação (especialmente o uso da vírgula em orações adjetivas restritivas vs explicativas, ou o isolamento de adjuntos adverbiais deslocados) altera o sentido do enunciado; 3) Verificar os elos de coesão referencial (pronomes, sinônimos, hiperônimos, elipses) e sequencial (conectivos adversativos, concessivos, causais, conclusivos).",
      practicalExamples: [
        "Na sintaxe e semântica da pontuação, comparar 'Os alunos que estudaram passaram' (oração subordinada adjetiva restritiva, sem vírgulas: restringe o universo apenas àqueles que estudaram) com 'Os alunos, que estudaram, passaram' (oração adjetiva explicativa, entre vírgulas: afirma que todos estudaram e todos passaram).",
        "Na Competência 5 da redação do ENEM, uma intervenção completa articula os 5 elementos: 'Portanto, cabe ao Ministério da Educação — instituição federal responsável pelas diretrizes pedagógicas [Agente + Detalhamento] — promover oficinas de letramento digital nas escolas públicas [Ação], por meio de parceria com universidades e verbas do FUNDEB [Meio/Modo], a fim de formar cidadãos críticos diante da desinformação [Efeito].'"
      ],
      importantRelations:
        "Articula a análise morfossintática e a pontuação expressiva com a progressão temática, a coesão referencial/sequencial e a estrutura argumentativa do texto.",
      commonMistake:
        "Separar com vírgula o sujeito do verbo (ex: 'O avanço da tecnologia no Brasil, provocou mudanças') ou usar conectivos cujo valor semântico contradiz a relação lógica entre as ideias (ex: usar 'portanto' conclusivo onde cabe 'entretanto' adversativo).",
      mistakeCorrection:
        "Nunca inserir uma única vírgula entre o sujeito e o predicado (a menos que haja um termo intercalado entre DUAS vírgulas). Na redação e interpretação, sempre conferir o valor semântico exato do operador argumentativo (oposição, concessão, causa, consequência, finalidade).",
      analogyExplanation:
        "Pense na sintaxe e na coesão textual como a engenharia de uma ponte: cada oração é um pilar e os conectivos ('contudo', 'portanto', 'visto que') são as vigas de aço que indicam para qual direção o raciocínio está indo. Se você colocar uma placa de 'retorno' (conectivo de oposição) quando queria seguir em frente (conclusão), o leitor se perde no caminho!",
      gapIdentified: `Reconhecimento das relações morfossintáticas, pontuação, operadores coesivos e estrutura argumentativa em ${topicTitle}.`,
      keyTerms: ["Morfossintaxe Contextual", "Coesão Referencial e Sequencial", "Operadores Argumentativos", "Orações Coordenadas e Subordinadas", "Texto Dissertativo-Argumentativo", "5 Elementos da Proposta de Intervenção"]
    };
  }

  // =========================================================================
  // 8. LÍNGUA INGLESA
  // =========================================================================
  if (profile.id === "lingua-inglesa") {
    return {
      disciplineId: profile.id,
      disciplineName: profile.name,
      areaType: "linguagens",
      topicTitle,
      moduleTitle,
      prerequisiteTitle: prereq,
      coreDefinition: `Na disciplina de Língua Inglesa, o estudo de "${topicTitle}" desenvolve a competência comunicativa, gramatical e leitora em inglês — abrangendo tempos verbais (Present, Past, Perfect e Future), verbos auxiliares e modais, orações condicionais (If-clauses), voz passiva, conectivos (Linking Words), vocabulário técnico e estratégias de leitura instrumental (Skimming, Scanning, Cognatos e Falsos Cognatos).`,
      historicalContext:
        "Consolidada como língua franca da ciência, da tecnologia da informação e da comunicação internacional contemporânea, a aprendizagem de Língua Inglesa no Ensino Médio e Técnico integra a abordagem comunicativa e o Inglês para Fins Específicos (ESP / Inglês Instrumental), permitindo a leitura crítica de artigos científicos, documentações técnicas, notícias globais e provas como o ENEM.",
      mechanismsAndProcesses:
        "1) Identificar a estrutura verbal e os marcadores de tempo da frase (ex: 'always/every day' no Simple Present; 'now/at the moment' no Present Continuous; 'yesterday/ago/in 2020' no Simple Past; 'since/for/already/yet' no Present Perfect); 2) Observar o funcionamento dos auxiliares ('do/does' no presente, 'did' no passado, 'have/has' no Present Perfect, 'will/would' no futuro e condicionais); 3) Na leitura textual, aplicar Skimming (leitura rápida de títulos e palavras-chave para captar a ideia central) e Scanning (varredura para localizar dados específicos) evitando armadilhas de falsos cognatos.",
      practicalExamples: [
        "No Simple Present na 3ª pessoa do singular (he/she/it), o verbo recebe -s/-es/-ies na afirmativa ('The system processes data'), mas em perguntas e negativas com 'does/doesn't' o verbo principal retorna obrigatoriamente à forma base ('Does the system process data?' / 'It does not process').",
        "Na leitura instrumental e no ENEM, é fundamental distinguir cognatos verdadeiros ('technology', 'important', 'information') de falsos amigos (False Friends) clássicos, como 'actually' (que significa 'na verdade', e não 'atualmente' = nowadays/currently) e 'pretend' (que significa 'fingir', e não 'pretender' = intend)."
      ],
      importantRelations:
        "Articula o domínio dos tempos verbais, verbos modais e conectivos (linking words) em Língua Inglesa com as estratégias de leitura instrumental (skimming e scanning) e interpretação de textos.",
      formulaOrSyntax: "Simple Present (He/She/It + V-s/es; Does + S + V_base?)   |   Present Perfect (Have/Has + Past Participle)   |   Conditionals (If + Present, Will / If + Past, Would)",
      formulaInterpretation:
        "Nos tempos verbais simples em inglês (Simple Present e Simple Past), sempre que um verbo auxiliar (do, does, did) entra na oração interrogativa ou negativa, ele absorve a marca de tempo/pessoa e o verbo principal volta ao infinitivo sem 'to'.",
      commonMistake:
        "Manter o '-s' ou '-ed' no verbo principal após usar 'does/doesn't' ou 'did/didn't' (ex: escrever 'Did she went?' em vez do correto 'Did she go?'), ou usar Present Perfect quando há um tempo passado fechado como 'yesterday' ou 'last year'.",
      mistakeCorrection:
        "Com expressões de tempo passado concluído e definido ('yesterday', 'last week', 'in 1999'), usa-se obrigatoriamente o Simple Past ('I visited'), reservando o Present Perfect ('I have visited') para tempo indefinido ou ações que se conectam ao presente.",
      analogyExplanation:
        "Pense nos auxiliares 'Do', 'Does' e 'Did' como um guarda-costas que assume o crachá do tempo verbal na frase negativa ou interrogativa: quando o auxiliar 'Does' ou 'Did' entra em cena, ele já carrega a marca de 3ª pessoa ou de passado, então o verbo principal tira o uniforme (-s ou -ed) e fica na sua forma básica original!",
      gapIdentified: `Uso correto de verbos auxiliares, tempos verbais, conectivos e distinção de falsos cognatos em ${topicTitle}.`,
      keyTerms: ["Simple Present vs Continuous", "Simple Past vs Present Perfect", "Auxiliary & Modal Verbs", "If-Clauses (Conditionals)", "Skimming & Scanning", "False Friends (Falsos Cognatos)"]
    };
  }

  // =========================================================================
  // 9. EMPREENDEDORISMO SOCIAL E ECONOMIA SOLIDÁRIA
  // =========================================================================
  if (profile.id === "empreendedorismo-social") {
    return {
      disciplineId: profile.id,
      disciplineName: profile.name,
      areaType: "humanas",
      topicTitle,
      moduleTitle,
      prerequisiteTitle: prereq,
      coreDefinition: `O estudo de "${topicTitle}" investiga a concepção, modelagem e gestão de empreendimentos sociais, cooperativas e iniciativas de economia solidária voltados à resolução de problemas socioambientais reais da comunidade, aliando viabilidade econômica, autogestão democrática e geração mensurável de impacto positivo.`,
      historicalContext:
        "O campo apoia-se em dois grandes pilares históricos e teóricos: a formulação dos Negócios Sociais e do microcrédito produtivo pelo economista e Prêmio Nobel da Paz Muhammad Yunus (criador do Grameen Bank em Bangladesh) e a sistematização da Economia Solidária no Brasil pelo economista e sociólogo Paul Singer, articulada à tradição do cooperativismo internacional (Aliança Cooperativa Internacional e Lei nº 5.764/1971) e aos Bancos Comunitários brasileiros (como o pioneiro Banco Palmas no Ceará, fundado em 1998).",
      mechanismsAndProcesses:
        "1) Realizar o diagnóstico participativo junto aos moradores para mapear dores comunitárias reais (evitando soluções impostas de fora); 2) Estruturar os 9 blocos do Social Business Model Canvas distinguindo claramente Beneficiários (público vulnerável impactado) e Clientes Pagantes, além do reinvestimento dos excedentes na própria missão social; 3) Aplicar a governança democrática ('um cooperado, um voto' em assembleia), o plano de ação 5W2H e a mensuração de indicadores de impacto social.",
      practicalExamples: [
        "No modelo do Banco Palmas (Fortaleza/CE), a criação de uma moeda social circulante local articulada ao microcrédito solidário faz com que a riqueza gerada pelos moradores circule nos comércios do próprio bairro, gerando trabalho e renda na comunidade.",
        "Diferentemente de uma empresa tradicional (cujo objetivo central é maximizar dividendos para acionistas) e de uma filantropia puramente assistencialista (dependente apenas de doações pontuais), um Negócio Social comercializa produtos ou serviços de modo financeiramente autossustentável com o propósito primordial de erradicar um problema social ou ambiental."
      ],
      importantRelations:
        "Relaciona o diagnóstico participativo comunitário à estruturação do Social Business Model Canvas, à autogestão cooperativa e à mensuração de indicadores de impacto social.",
      commonMistake:
        "Confundir Negócio de Impacto Social com caridade assistencialista sem sustentabilidade financeira, ou confundir a gestão de uma cooperativa (onde cada pessoa tem direito a 1 voto na assembleia) com uma sociedade anônima (onde vota quem tem mais capital/ações).",
      mistakeCorrection:
        "Em cooperativas e empreendimentos de economia solidária, vigora a autogestão democrática ('um membro, um voto'), e nos negócios sociais a operação busca autossuficiência financeira reinvestindo o resultado na ampliação do impacto socioambiental.",
      analogyExplanation:
        "Imagine uma cooperativa de reciclagem ou um negócio social comunitário como um barco a remo conduzido por todos os moradores: diferentemente de um navio onde apenas um dono decide a rota visando apenas o lucro individual, na economia solidária todos remam juntos, decidem o rumo em assembleia com voto igual e compartilham os frutos para melhorar a vida de toda a comunidade!",
      gapIdentified: `Distinção entre negócio tradicional, filantropia e negócio de impacto/economia solidária e aplicação do Social Business Canvas em ${topicTitle}.`,
      keyTerms: ["Negócios Sociais (Muhammad Yunus)", "Economia Solidária (Paul Singer)", "Autogestão e Cooperativismo", "Social Business Model Canvas", "Bancos Comunitários e Moeda Social", "Indicadores de Impacto e 5W2H"]
    };
  }

  // =========================================================================
  // 10. ANÁLISE E PROJETO DE SISTEMAS
  // =========================================================================
  if (profile.id === "analise-projeto-sistemas") {
    return {
      disciplineId: profile.id,
      disciplineName: profile.name,
      areaType: "tecnicas",
      topicTitle,
      moduleTitle,
      prerequisiteTitle: prereq,
      coreDefinition: `Na disciplina de Análise e Projeto de Sistemas, o estudo de "${topicTitle}" compreende os métodos de Engenharia de Software para levantar, especificar, modelar e arquitetar sistemas computacionais de qualidade — abrangendo Engenharia de Requisitos (RF, RNF e Regras de Negócio), modelagem visual com UML 2.5 (Casos de Uso, Classes, Sequência, Atividades), princípios SOLID, Padrões de Projeto (Design Patterns), Arquitetura de Software (MVC, Camadas, Clean Architecture) e metodologias ágeis (Scrum e Kanban).`,
      historicalContext:
        "A Engenharia de Software surgiu formalmente na conferência da OTAN em 1968 para superar a chamada 'crise do software' (projetos com atrasos, estouro de orçamento e falhas críticas). Evoluiu dos modelos sequenciais em Cascata (Waterfall) para a unificação da linguagem de modelagem orientada a objetos UML nos anos 1990 (Grady Booch, James Rumbaugh e Ivar Jacobson) e o Manifesto Ágil de 2001.",
      mechanismsAndProcesses:
        "1) Elicitar as necessidades dos stakeholders (entrevistas, workshops, prototipação) e separá-las em Requisitos Funcionais (o que o sistema faz: ex. 'emitir nota fiscal') e Requisitos Não Funcionais (restrições de qualidade: desempenho, segurança, disponibilidade, usabilidade); 2) Modelar os cenários em Diagramas de Casos de Uso (diferenciando <<include>> obrigatório de <<extend>> opcional/condicional) e a estrutura estática no Diagrama de Classes (encapsulamento, associação, agregação, composição e herança); 3) Organizar a arquitetura desacoplada aplicando os princípios SOLID e ciclos iterativos Scrum/Kanban.",
      practicalExamples: [
        "Em um sistema escolar, 'permitir que o professor lance a frequência diária dos alunos' é um Requisito Funcional (RF), enquanto 'carregar a pauta em menos de 1,5 segundo sob criptografia HTTPS/TLS 1.3' é um Requisito Não Funcional (RNF) de desempenho e segurança.",
        "No Diagrama de Casos de Uso da UML, 'Realizar Pagamento' possui relação <<include>> com 'Validar Saldo' (pois toda transação executa obrigatoriamente essa validação), mas possui relação <<extend>> com 'EmitirSegundaViaRecibo' (pois só ocorre opcionalmente se o cliente solicitar)."
      ],
      importantRelations:
        "Conecta-se diretamente ao Banco de Dados (transformação do Diagrama de Classes no Modelo Relacional), ao Desenvolvimento Web (implementação das camadas de front-end e API) e ao TCC.",
      commonMistake:
        "Inverter o significado de <<include>> e <<extend>> no Diagrama de Casos de Uso da UML, ou classificar uma restrição técnica de segurança/velocidade como Requisito Funcional.",
      mistakeCorrection:
        "Use <<include>> quando o caso de uso base executa OBRIGATORIAMENTE o subcaso em 100% das vezes; use <<extend>> quando o comportamento adicional é OPCIONAL ou ocorre apenas sob uma condição específica.",
      analogyExplanation:
        "Pense na construção de um edifício: antes de assentar o primeiro tijolo (escrever código), o engenheiro e o arquiteto conversam com o morador para saber quantos quartos ele precisa (Requisitos Funcionais), qual o isolamento acústico e resistência estrutural exigidos (Requisitos Não Funcionais) e desenham as plantas baixas padronizadas (Diagramas UML) para que toda a equipe construa sem retrabalho!",
      gapIdentified: `Classificação entre Requisitos Funcionais e Não Funcionais e semântica dos relacionamentos UML e arquitetura em ${topicTitle}.`,
      keyTerms: ["Requisitos Funcionais e Não Funcionais", "Diagrama de Casos de Uso (Include/Extend)", "Diagrama de Classes e Orientação a Objetos", "Princípios SOLID e Design Patterns", "Arquitetura MVC e Camadas", "Metodologias Ágeis (Scrum e Kanban)"]
    };
  }

  // =========================================================================
  // 11. BANCO DE DADOS
  // =========================================================================
  if (profile.id === "banco-de-dados") {
    return {
      disciplineId: profile.id,
      disciplineName: profile.name,
      areaType: "tecnicas",
      topicTitle,
      moduleTitle,
      prerequisiteTitle: prereq,
      coreDefinition: `Na disciplina de Banco de Dados, o estudo de "${topicTitle}" aborda a modelagem conceitual (Modelo Entidade-Relacionamento — MER/DER), o modelo relacional (tabelas, tuplas, Chaves Primárias PK e Chaves Estrangeiras FK), a normalização de dados (1FN, 2FN e 3FN), a linguagem estruturada de consulta SQL (DDL, DML, DQL com JOINs e agregações) e o gerenciamento de transações seguras com propriedades ACID.`,
      historicalContext:
        "Em 1970, Edgar Frank Codd (pesquisador da IBM) revolucionou a computação ao publicar o artigo 'A Relational Model of Data for Large Shared Data Banks', fundamentando os bancos de dados na teoria matemática dos conjuntos e na lógica de predicados, seguido pela criação da linguagem SQL (Structured Query Language) e do Modelo Entidade-Relacionamento por Peter Chen em 1976.",
      mechanismsAndProcesses:
        "1) Na Modelagem e Normalização: identificar entidades, atributos e cardinalidades (1:1, 1:N, N:N — onde relacionamentos N:N geram uma tabela associativa), aplicando a 1FN (atributos atômicos sem valores multivalorados), 2FN (sem dependência funcional parcial da chave composta) e 3FN (sem dependência transitiva entre atributos não-chave); 2) Em SQL: usar DDL (CREATE, ALTER, DROP) para estruturar esquemas, DML (INSERT, UPDATE, DELETE sempre com cláusula WHERE) para manipular registros e DQL (SELECT ... FROM ... JOIN ... ON ... WHERE ... GROUP BY ... HAVING) para consultar informações.",
      practicalExamples: [
        "Para listar o nome dos alunos e suas notas conectando as tabelas 'alunos' (PK: id) e 'matriculas' (FK: aluno_id), executa-se: SELECT a.nome, m.nota FROM alunos a INNER JOIN matriculas m ON a.id = m.aluno_id WHERE m.nota >= 7.0;",
        "Em uma transferência bancária via SQL, as propriedades ACID garantem a Atomicidade ('tudo ou nada'): se o débito na conta A funcionar mas o crédito na conta B falhar no meio do caminho, o comando ROLLBACK desfaz toda a transação para que nenhum dinheiro desapareça."
      ],
      importantRelations:
        "Integra-se diretamente à Análise e Projeto de Sistemas (mapeamento objeto-relacional) e ao Desenvolvimento Web (persistência de dados de APIs back-end).",
      formulaOrSyntax: "SELECT col FROM tabA INNER JOIN tabB ON tabA.id = tabB.fk_id WHERE condicao GROUP BY col HAVING agregacao;",
      formulaInterpretation:
        "No SQL, a cláusula WHERE filtra linhas individuais ANTES do agrupamento (GROUP BY), enquanto a cláusula HAVING filtra grupos DEPOIS da aplicação de funções de agregação (COUNT, SUM, AVG, MAX, MIN).",
      commonMistake:
        "Executar um comando UPDATE ou DELETE sem a cláusula WHERE (o que sobrescreve ou apaga TODOS os registros da tabela inteira!) ou confundir INNER JOIN com LEFT JOIN.",
      mistakeCorrection:
        "Sempre validar a condição WHERE antes de rodar UPDATE ou DELETE. Nas junções, lembrar que o INNER JOIN retorna apenas registros com correspondência nas duas tabelas, enquanto o LEFT JOIN traz todos os registros da tabela da esquerda mesmo que não possuam correspondente na direita.",
      analogyExplanation:
        "Pense na Chave Primária (PK) como o número único de matrícula ou CPF de um aluno na tabela 'Alunos' (ninguém pode ter igual nem ficar em branco), e na Chave Estrangeira (FK) como a referência a esse número de matrícula anotada na ficha de 'Empréstimo da Biblioteca' para saber exatamente qual aluno pegou qual livro!",
      gapIdentified: `Integridade referencial entre Chave Primária (PK) e Estrangeira (FK), Formas Normais e sintaxe de consultas SQL em ${topicTitle}.`,
      keyTerms: ["Modelo Entidade-Relacionamento (1:1, 1:N, N:N)", "Chave Primária (PK) e Estrangeira (FK)", "Formas Normais (1FN, 2FN, 3FN)", "Comandos SQL (DDL, DML, DQL)", "INNER JOIN e LEFT JOIN", "Propriedades ACID de Transações"]
    };
  }

  // =========================================================================
  // 12. DESENVOLVIMENTO WEB
  // =========================================================================
  if (profile.id === "desenvolvimento-web") {
    return {
      disciplineId: profile.id,
      disciplineName: profile.name,
      areaType: "tecnicas",
      topicTitle,
      moduleTitle,
      prerequisiteTitle: prereq,
      coreDefinition: `Na disciplina de Desenvolvimento Web, o estudo de "${topicTitle}" aborda a arquitetura cliente-servidor sob o protocolo HTTP/HTTPS e a construção de aplicações web modernas utilizando HTML5 semântico e acessível (WCAG), estilização responsiva com CSS3 (Box Model, Flexbox, CSS Grid), programação interativa e assíncrona em JavaScript ES6+ (DOM, Event Loop, Promises, async/await, Fetch API) e componentização declarativa com React e TypeScript.`,
      historicalContext:
        "Desde a criação da World Wide Web, do protocolo HTTP e do HTML por Tim Berners-Lee no CERN em 1989-1991, passando pela padronização do W3C, a introdução do CSS por Håkon Wium Lie e do JavaScript por Brendan Eich em 1995, o desenvolvimento web evoluiu de páginas estáticas de documentos para aplicações ricas e reativas (Single Page Applications — SPAs) com tipagem estática.",
      mechanismsAndProcesses:
        "1) No HTML5: estruturar o documento com tags semânticas (<header>, <nav>, <main>, <article>, <section>, <footer>) e atributos de acessibilidade (alt, aria-label, labels associadas a inputs); 2) No CSS3: controlar o dimensionamento com box-sizing: border-box e organizar layouts unidimensionais com Flexbox (display: flex, justify-content, align-items) e bidimensionais com CSS Grid; 3) No JavaScript e React: gerenciar eventos, consumir APIs REST de forma assíncrona com fetch() e async/await (tratando erros em blocos try/catch) e atualizar a interface de forma imutável através de Props e State (useState, useEffect).",
      practicalExamples: [
        "No JavaScript moderno, o operador de igualdade estrita (5 === '5' retorna false) compara tanto o valor quanto o tipo do dado sem coerção implícita, evitando bugs comuns do operador frouxo (5 == '5' retorna true).",
        "No React com TypeScript, ao atualizar um estado com useState, nunca se muta a variável diretamente: invoca-se a função atualizadora (ex: setItems(prev => [...prev, novoItem])) para que o React reconcilie o Virtual DOM e re-renderize o componente na tela."
      ],
      importantRelations:
        "Conecta-se diretamente ao Design de Interface (implementação fiel de layouts do Figma, responsividade e acessibilidade WCAG) e ao Banco de Dados e Análise de Sistemas (integração front-end / back-end via JSON e REST).",
      formulaOrSyntax: "<main> / display: flex / const res = await fetch(url); const data = await res.json(); / const [state, setState] = useState<T>(init);",
      formulaInterpretation:
        "Na arquitetura web moderna, o HTML5 define a estrutura e o significado semântico do conteúdo, o CSS3 define a apresentação visual e responsividade, e o JavaScript/React controla o comportamento dinâmico e o estado da aplicação.",
      commonMistake:
        "Usar apenas tags genéricas <div> para toda a página prejudicando leitores de tela e SEO, esquecer o 'await' ao ler uma Promise do fetch() ou modificar diretamente uma variável de estado no React sem chamar o 'setState'.",
      mistakeCorrection:
        "Priorizar tags semânticas nativas (<button>, <nav>, <main>), utilizar async/await com tratamento de status HTTP (res.ok) e preservar a imutabilidade do estado nos componentes React.",
      analogyExplanation:
        "Pense na construção de uma aplicação web como o funcionamento de um teatro moderno: o HTML5 é a estrutura física do palco e das cadeiras com placas de sinalização acessíveis; o CSS3 é a iluminação, o figurino e a decoração que se adaptam ao tamanho do salão; e o JavaScript/React é o diretor de cena que coordena as ações em tempo real quando o público interage!",
      gapIdentified: `Semântica HTML5, posicionamento responsivo CSS (Flexbox/Grid), assincronismo JavaScript e fluxo de dados em React em ${topicTitle}.`,
      keyTerms: ["HTML5 Semântico e Acessibilidade (a11y)", "Box Model, Flexbox e CSS Grid", "JavaScript ES6+ e Manipulação do DOM", "Promises, Async/Await e Fetch API", "Componentes React, Props e Hooks", "Tipagem Estática com TypeScript"]
    };
  }

  // =========================================================================
  // 13. ROBÓTICA
  // =========================================================================
  if (profile.id === "robotica") {
    return {
      disciplineId: profile.id,
      disciplineName: profile.name,
      areaType: "exatas",
      topicTitle,
      moduleTitle,
      prerequisiteTitle: prereq,
      coreDefinition: `Na disciplina de Robótica, o estudo de "${topicTitle}" integra os fundamentos de eletroeletrônica (tensão, corrente, resistência, Lei de Ohm e potência), a programação de microcontroladores (plataforma Arduino Uno / ATmega328P com funções setup() e loop()), a leitura de sensores analógicos e digitais (ultrassônico HC-SR04, infravermelho, LDR) e o acionamento de atuadores e motores (Ponte H, servomotores e modulação por largura de pulso — PWM).`,
      historicalContext:
        "A robótica moderna e os sistemas embarcados evoluíram da cibernética de Norbert Wiener e dos primeiros manipuladores industriais (Unimate, 1961) até a democratização da prototipagem eletrônica aberta com a criação da plataforma Arduino em Ivrea, na Itália (2005, por Massimo Banzi e equipe), baseada em microcontroladores AVR de arquitetura Harvard.",
      mechanismsAndProcesses:
        "1) Dimensionar eletricamente os componentes aplicando a Lei de Ohm (U = R · i), garantindo resistores limitadores de corrente para LEDs e resistores de pull-up/pull-down para botões; 2) Configurar os pinos no setup() com pinMode(pino, INPUT/OUTPUT) e realizar a leitura no loop() com digitalRead() ou analogRead() (conversor A/D de 10 bits: valores de 0 a 1023 para 0V a 5V); 3) Controlar a velocidade e direção de motores DC usando sinal PWM (analogWrite de 0 a 255) acoplado a um driver de potência (Ponte H L298N/L293D).",
      practicalExamples: [
        "Para ligar um LED vermelho (tensão nominal V_LED = 2 V e corrente máxima i = 20 mA = 0,02 A) em uma porta digital de 5 V do Arduino, calcula-se o resistor em série: R = (5 - 2) / 0,02 = 3 / 0,02 = 150 Ω (adotando-se o valor comercial de 150 Ω ou 220 Ω).",
        "No sensor ultrassônico HC-SR04, o pino Trigger emite um pulso sonoro de 40 kHz e o pino Echo mede o tempo Δt (em microssegundos) de ida e volta do eco; a distância até o obstáculo em centímetros é dada por d = (v_som · Δt) / 2 ≈ Δt / 58."
      ],
      importantRelations:
        "Integra o dimensionamento elétrico pela Lei de Ohm com a programação de portas digitais/analógicas, controle de atuadores via PWM e leitura de sensores no microcontrolador.",
      formulaOrSyntax: "U = R · i   |   P = U · i   |   R_LED = (V_fonte - V_LED) / i_LED   |   Duty Cycle PWM (0 a 255)   |   ADC 10 bits (0 a 1023)",
      formulaInterpretation:
        "No Arduino Uno, o conversor analógico-digital (analogRead) possui resolução de 10 bits (2¹⁰ = 1024 níveis, de 0 a 1023), enquanto a saída PWM (analogWrite) possui resolução de 8 bits (2⁸ = 256 níveis, de 0 a 255).",
      commonMistake:
        "Conectar um motor DC diretamente aos pinos digitais do Arduino sem usar uma Ponte H ou transistor (o que queima a porta do microcontrolador, que fornece no máximo 40 mA), ou esquecer de dividir o tempo do sensor ultrassônico por 2 (pois o som faz o caminho de ida e volta).",
      mistakeCorrection:
        "Sempre utilizar um circuito driver de potência (como a Ponte H L298N) com fonte externa compartilhando o pino GND comum com o Arduino para acionar motores, e usar resistores em série com LEDs.",
      analogyExplanation:
        "Pense em um robô autônomo como o corpo humano em ação: os sensores (ultrassônico, LDR, infravermelho) funcionam como os olhos e ouvidos que captam informações do ambiente; o microcontrolador Arduino é o cérebro que processa essas leituras dentro do loop(); a Ponte H e os motores são os músculos que executam o movimento; e a bateria regulada é o coração que fornece energia na tensão certa!",
      gapIdentified: `Cálculo elétrico pela Lei de Ohm, diferença entre leitura analógica (0–1023) e escrita PWM (0–255) e integração de sensores e atuadores em ${topicTitle}.`,
      keyTerms: ["Lei de Ohm e Dimensionamento de Resistores", "Arduino Uno (setup e loop)", "Leitura Analógica (ADC 0-1023) vs Digital", "Controle PWM (0-255) e Ponte H", "Sensor Ultrassônico HC-SR04 e LDR", "Robôs Seguidores de Linha e Desvio de Obstáculos"]
    };
  }

  // =========================================================================
  // 14. DESIGN DE INTERFACE (UI/UX)
  // =========================================================================
  if (profile.id === "design-de-interface") {
    return {
      disciplineId: profile.id,
      disciplineName: profile.name,
      areaType: "tecnicas",
      topicTitle,
      moduleTitle,
      prerequisiteTitle: prereq,
      coreDefinition: `Na disciplina de Design de Interface, o estudo de "${topicTitle}" aborda os fundamentos de User Experience (UX) e User Interface (UI), a metodologia centrada no usuário (Design Thinking e Duplo Diamante), as 10 Heurísticas de Usabilidade de Jakob Nielsen, a acessibilidade digital (diretrizes WCAG de contraste e navegação), a teoria visual (hierarquia tipográfica, psicologia e harmonia das cores, grids), a prototipação em baixa, média e alta fidelidade no Figma e a arquitetura de Design Systems (Atomic Design e Design Tokens).`,
      historicalContext:
        "O campo de Interação Humano-Computador (IHC) e Design de Experiência do Usuário foi consolidado por pesquisadores como Donald Norman (que cunhou o termo 'User Experience' nos anos 1990 e introduziu os conceitos de affordance e feedback em O Design do Dia a Dia), Jakob Nielsen (criador das 10 Heurísticas de Usabilidade em 1994), Steve Krug (Não Me Faça Pensar) e Brad Frost (metodologia Atomic Design).",
      mechanismsAndProcesses:
        "1) Compreender as necessidades e dores reais das pessoas usuárias através de pesquisas qualitativas e quantitativas antes de desenhar telas; 2) Estruturar a arquitetura da informação em wireframes de baixa e média fidelidade, aplicando as Heurísticas de Nielsen (visibilidade do status do sistema, prevenção de erros, consistência e padrões, reconhecimento em vez de memorização); 3) Definir tokens visuais (escala tipográfica, espaçamentos em múltiplos de 4px/8px e contraste mínimo de 4.5:1 da WCAG AA) e componentizar a interface em Átomos, Moléculas e Organismos no Figma.",
      practicalExamples: [
        "Quando um aplicativo exibe uma barra de carregamento clara ('Enviando arquivo: 65%') ou desabilita o botão 'Confirmar Pagamento' após o primeiro clique para evitar cobrança duplicada, ele aplica diretamente as heurísticas de Nielsen de 'Visibilidade do Status do Sistema' e 'Prevenção de Erros'.",
        "Na metodologia Atomic Design de Brad Frost, um botão isolado e um campo de texto (<input>) são 'Átomos'; quando combinados juntos em uma barra de busca ('Campo + Botão Buscar'), formam uma 'Molécula'; e quando inseridos dentro do cabeçalho completo do site com logotipo e menu, compõem um 'Organismo'."
      ],
      importantRelations:
        "Conecta-se diretamente ao Desenvolvimento Web (tradução de componentes e tokens do Figma para HTML5 semântico, CSS Flexbox/Grid e componentes React) e à Análise de Sistemas.",
      commonMistake:
        "Confundir UI (a camada visual e interativa da tela: botões, tipografia, cores e layout) com UX (a experiência completa, usabilidade, fluxo de tarefas e satisfação do usuário ao resolver seu problema), ou usar apenas a cor (vermelho/verde) sem ícone ou texto para indicar erro em um formulário, prejudicando pessoas com daltonismo.",
      mistakeCorrection:
        "Sempre aliar estética visual (UI) à facilidade de uso e acessibilidade (UX), garantindo taxa de contraste mínima de 4.5:1 para textos normais (WCAG AA) e mensagens de feedback claras com ícone e texto explicativo.",
      analogyExplanation:
        "Pense na diferença entre UX e UI como o projeto de um restaurante: a UI é a beleza dos pratos, o design do cardápio impresso e a decoração das mesas; já a UX é a experiência completa — conseguir ler o cardápio sem esforço, a comida chegar rápido na temperatura certa, a cadeira ser confortável e o pagamento ser simples e sem fila!",
      gapIdentified: `Distinção entre UX e UI, aplicação das Heurísticas de Usabilidade de Nielsen, acessibilidade WCAG e organização em Design Systems em ${topicTitle}.`,
      keyTerms: ["UX (User Experience) vs UI (User Interface)", "10 Heurísticas de Jakob Nielsen", "Acessibilidade Digital (WCAG 4.5:1)", "Hierarquia Visual, Tipografia e Cores", "Wireframes e Prototipação no Figma", "Atomic Design e Design Tokens"]
    };
  }

  // =========================================================================
  // 15. MATÉRIA PRÁTICA DE ESTÁGIO E TCC
  // =========================================================================
  return {
    disciplineId: profile.id,
    disciplineName: profile.name,
    areaType: "tecnicas",
    topicTitle,
    moduleTitle,
    prerequisiteTitle: prereq,
    coreDefinition: `Na disciplina de Matéria Prática de Estágio e TCC, o estudo de "${topicTitle}" orienta a elaboração rigorosa do Trabalho de Conclusão de Curso e do Relatório de Estágio Supervisionado — abrangendo o método científico, a delimitação do tema e do problema de pesquisa, a formulação de hipóteses e objetivos (geral e específicos com verbos no infinitivo), a revisão bibliográfica em bases científicas indexadas, as normas técnicas da ABNT (NBR 14724, NBR 10520 e NBR 6023), a ética em pesquisa (TCLE) e a legislação do estágio (Lei nº 11.788/2008).`,
    historicalContext:
      "A metodologia do trabalho científico e a padronização documental consolidaram-se para garantir a verificabilidade, a honestidade intelectual (combate ao plágio por meio da correta atribuição de autoria) e a democratização do conhecimento produzido nas instituições de ensino técnico e superior, sendo normatizadas no Brasil pela Associação Brasileira de Normas Técnicas (ABNT) e pela Lei Federal do Estágio nº 11.788/2008.",
    mechanismsAndProcesses:
      "1) Delimitar um Tema específico e viável e transformá-lo em um Problema de Pesquisa (formulado como uma pergunta clara e investigável); 2) Definir o Objetivo Geral (a meta central da pesquisa) e os Objetivos Específicos (etapas intermediárias iniciadas por verbos no infinitivo: analisar, mapear, desenvolver, validar); 3) Fundamentar o referencial teórico com citações diretas (curtas até 3 linhas entre aspas; longas com mais de 3 linhas em recuo de 4 cm e fonte menor) e citações indiretas (paráfrases) segundo a ABNT NBR 10520, listando todas as obras nas Referências (NBR 6023).",
    practicalExamples: [
      "Na norma ABNT NBR 10520, uma citação direta curta (até 3 linhas) permanece inserida no parágrafo entre aspas duplas com indicação de autor, ano e página — ex: Segundo Gil (2017, p. 33), \"todo problema de pesquisa científica deve ser formulado na forma de pergunta\" —, enquanto uma citação direta com mais de 3 linhas deve ficar em parágrafo próprio com recuo de 4 cm, fonte tamanho 10 e sem aspas.",
      "No Estágio Supervisionado regido pela Lei nº 11.788/2008, a atividade é um ato educativo escolar supervisionado que exige obrigatoriamente a celebração do Termo de Compromisso de Estágio (TCE) assinado pelo educando, pela parte concedente e pela instituição de ensino, além de seguro contra acidentes pessoais."
    ],
    importantRelations:
      "Integra todas as disciplinas da formação técnica e propedêutica, unindo a redação científica formal (Língua Portuguesa) ao desenvolvimento do projeto tecnológico ou estudo de caso da área.",
    commonMistake:
      "Formular Objetivos (Geral ou Específicos) sem começar com verbo no infinitivo, confundir Tema amplo com Problema de Pesquisa (que deve ser uma pergunta delimitada) ou inserir citações no texto sem incluí-las na lista final de Referências (ou vice-versa).",
    mistakeCorrection:
      "O Problema de Pesquisa é sempre uma pergunta delimitada (terminada em '?'); os Objetivos começam sempre com verbos de ação no infinitivo ('Desenvolver...', 'Analisar...', 'Comparar...'); e toda fonte citada no corpo do trabalho deve constar obrigatoriamente na seção de Referências segundo a NBR 6023.",
    analogyExplanation:
      "Pense no seu TCC como uma viagem científica planejada: o Tema é a região para onde você vai; o Problema de Pesquisa é a pergunta exata que você quer desvendar lá; a Justificativa explica por que essa viagem é importante; o Objetivo Geral é o destino final; os Objetivos Específicos são as paradas intermediárias do roteiro; e a Metodologia é o veículo e as ferramentas que você usará para chegar lá com segurança!",
    gapIdentified: `Distinção entre Tema, Problema, Hipótese e Objetivos, aplicação das normas ABNT (NBR 14724, 10520 e 6023) e diretrizes da Lei do Estágio em ${topicTitle}.`,
    keyTerms: ["Problema de Pesquisa e Hipótese", "Objetivo Geral e Específicos (Verbos no Infinitivo)", "Citações Diretas e Indiretas (NBR 10520)", "Estrutura do TCC (NBR 14724) e Referências (NBR 6023)", "Ética em Pesquisa e TCLE", "Lei do Estágio (Lei nº 11.788/2008)"]
  };
}
