/**
 * Academic Text Service
 *
 * Fornece textos didático-acadêmicos contínuos, fluidos e semanticamente específicos
 * ao tema e à disciplina selecionados para o módulo de Resumo, sem jargões genéricos
 * de engenharia/sistemas e sem referências ou citações inventadas.
 */

import { getDisciplineProfile } from "./pedagogicalCatalog";
import { getTopicDomainKnowledge } from "./pedagogicalKnowledgeBase";

export interface AcademicPaper {
  title: string;
  subtitle: string;
  discipline: string;
  fieldArea: string;
  cduCode: string;
  abntCitation: string;
  estimatedReadingMinutes: number;
  abstract: string;
  keywords: string[];
  chapters: {
    sectionNumber: string;
    heading: string;
    paragraphs: string[];
    highlightEquation?: string;
    epigraph?: string;
  }[];
  academicConclusions: string[];
  bibliographicReferences: string[];
}

export function getAcademicPaper(
  disciplineName: string,
  topicTitle: string,
  level: number = 2,
  disciplineId?: string,
  subtitle?: string,
  prerequisite?: string
): AcademicPaper {
  const normalizedTopic = topicTitle.toLowerCase();
  const profile = getDisciplineProfile(disciplineId || disciplineName, disciplineName);
  const domain = getTopicDomainKnowledge(
    profile.id,
    topicTitle,
    subtitle,
    prerequisite
  );

  // 1. ESTUDO ESPECÍFICO DE FOTOSSÍNTESE E BIOENERGÉTICA CELULAR
  if (
    profile.id === "biologia" &&
    (normalizedTopic.includes("fotossíntese") || normalizedTopic.includes("fotossintese"))
  ) {
    return {
      title: `Estudo Aprofundado: ${topicTitle}`,
      subtitle:
        "Da Etapa Fotoquímica nos Tilacoides à Fixação Enzimática do Carbono no Ciclo de Calvin-Benson",
      discipline: profile.name,
      fieldArea: profile.fieldArea,
      cduCode: `${profile.cduPrefix} • Biologia Celular e Fisiologia Vegetal`,
      abntCitation: profile.realReferences[0],
      estimatedReadingMinutes: 12,
      abstract:
        "Este resumo estruturado analisa os fundamentos bioenergéticos e as etapas celulares da fotossíntese oxigênica nos organismos autotróficos. Examina-se a conversão da energia luminosa em energia química armazenada em ligações orgânicas, articulando a fase fotoquímica (fase clara) nas membranas dos tilacoides e a fase química (Ciclo de Calvin-Benson) no estroma dos cloroplastos, além do papel da enzima RuBisCO e das adaptações fisiológicas de plantas C3, C4 e CAM.",
      keywords: [
        "Fotossíntese",
        "Cloroplastos e Tilacoides",
        "Fotólise da Água",
        "RuBisCO e Ciclo de Calvin",
        "ATP e NADPH",
        "Ponto de Compensação Fótico"
      ],
      chapters: [
        {
          sectionNumber: "1",
          heading: "Contexto Histórico e Natureza Bioquímica da Nutrição Autotrófica",
          paragraphs: [
            "A compreensão da fotossíntese como processo essencial de entrada de energia na biosfera consolidou-se a partir das investigações clássicas da fisiologia vegetal. No século XVIII, Joseph Priestley e Jan Ingenhousz demonstraram que as partes verdes das plantas, na presença de luz solar, renovam o oxigênio do ar. No século XX, utilizando isótopos marcados de oxigênio (¹⁸O), Samuel Ruben e Martin Kamen comprovaram que todo o gás oxigênio (O₂) liberado para a atmosfera provém exclusivamente da quebra da molécula de água (H₂O), e não do dióxido de carbono (CO₂).",
            "Sob a ótica da bioenergética celular, a fotossíntese é um processo anabólico e endergônico no qual substâncias inorgânicas simples (água e gás carbônico) são convertidas em carboidratos ricos em energia (como o gliceraldeído-3-fosfato e a glicose) mediante a captação de luz pelos pigmentos fotossintetizantes."
          ]
        },
        {
          sectionNumber: "2",
          heading: "Estrutura dos Cloroplastos e Pigmentos Fotossintetizantes",
          paragraphs: [
            "Nos eucariontes fotossintetizantes (plantas e algas), o processo ocorre no interior dos cloroplastos, organelas delimitadas por dupla membrana e originadas por endossimbiose. O espaço interno é preenchido por uma matriz gelatinosa rica em enzimas e DNA circular denominada estroma, onde está mergulhado um sistema membranoso de sacos achatados chamados tilacoides (cujas pilhas formam os grana).",
            "Inseridos na membrana dos tilacoides encontram-se os fotossistemas I e II, constituídos por moléculas de clorofila a, clorofila b e carotenoides. Esses pigmentos absorvem com máxima eficiência os comprimentos de onda correspondentes à luz azul-violeta e ao vermelho, refletindo a luz verde."
          ]
        },
        {
          sectionNumber: "3",
          heading: "Etapa Fotoquímica (Fase Clara) e Fotólise da Água",
          highlightEquation:
            "12 H₂O + 6 CO₂  —(Luz / Clorofila)→  C₆H₁₂O₆ + 6 O₂ + 6 H₂O",
          paragraphs: [
            "A etapa fotoquímica ocorre obrigatoriamente na membrana dos tilacoides e depende diretamente da incidência luminosa. A luz excita os elétrons da clorofila nos Fotossistemas II (P680) e I (P700), promovendo seu transporte através de uma cadeia transportadora de elétrons associada ao bombeamento de prótons (H⁺) para o lúmen do tilacoide.",
            "Para repor os elétrons cedidos pelo Fotossistema II, ocorre a fotólise da água (Reação de Hill), que decompõe a molécula de H₂O liberando elétrons, íons H⁺ e gás oxigênio (O₂) para o ambiente. O gradiente de H⁺ aciona a enzima ATP-sintase (fotofosforilação), produzindo ATP, enquanto o NADP⁺ recebe elétrons e hidrogênios formando NADPH."
          ]
        },
        {
          sectionNumber: "4",
          heading: "Etapa Química (Ciclo de Calvin-Benson) e Fatores Limitantes",
          paragraphs: [
            "No estroma do cloroplasto, o ATP e o NADPH gerados na fase clara são consumidos no Ciclo de Calvin-Benson para promover a fixação do carbono do CO₂ atmosférico. A enzima RuBisCO catalisa a união do CO₂ à pentose ribulose-1,5-bisfosfato (RuBP), dando origem a moléculas de fosfoglicerato que são reduzidas a gliceraldeído-3-fosfato (G3P), precursor da glicose e do amido.",
            "A taxa fotossintética varia em função da intensidade luminosa, da concentração de CO₂ e da temperatura. No Ponto de Compensação Fótico (PCF), a quantidade de O₂ produzida na fotossíntese iguala o O₂ consumido na respiração celular; acima do PCF, a planta acumula reservas orgânicas e cresce."
          ]
        }
      ],
      academicConclusions: [
        "A fotossíntese divide-se de forma complementar entre a fase fotoquímica nos tilacoides (que consome água e luz para gerar O₂, ATP e NADPH) e o Ciclo de Calvin no estroma (que consome CO₂, ATP e NADPH para sintetizar carboidratos).",
        "O oxigênio liberado na fotossíntese origina-se da fotólise da água, enquanto o carbono e o oxigênio que passam a integrar a molécula de glicose provêm do gás carbônico (CO₂) fixado pela RuBisCO.",
        "A compreensão conjunta da fotossíntese e da respiração celular permite interpretar o balanço energético das plantas, as adaptações C3, C4 e CAM e o ciclo global do carbono."
      ],
      bibliographicReferences: profile.realReferences
    };
  }

  // 2. ESTUDO ESPECÍFICO DE MATEMÁTICA: EQUAÇÕES DO 2º GRAU E BHASKARA
  if (
    profile.id === "matematica" &&
    (normalizedTopic.includes("equações do 2º grau") || normalizedTopic.includes("bhaskara"))
  ) {
    return {
      title: `Estudo Aprofundado: ${topicTitle}`,
      subtitle:
        "Dedução da Fórmula Resolutiva, Análise do Discriminante (Δ), Relações de Girard e Aplicações",
      discipline: profile.name,
      fieldArea: profile.fieldArea,
      cduCode: `${profile.cduPrefix} • Álgebra e Equações Polinomiais`,
      abntCitation: profile.realReferences[0],
      estimatedReadingMinutes: 10,
      abstract:
        "Este resumo apresenta a estrutura algébrica das equações polinomiais do 2º grau na forma ax² + bx + c = 0 (com a ≠ 0), a dedução da fórmula resolutiva de Bhaskara por completamento de quadrados, o estudo do sinal do discriminante (Δ = b² - 4ac) na determinação das raízes reais e a relação de soma e produto das raízes.",
      keywords: [
        "Equação do 2º Grau",
        "Fórmula de Bhaskara",
        "Discriminante Delta",
        "Raízes Reais",
        "Soma e Produto (Girard)",
        "Parábola"
      ],
      chapters: [
        {
          sectionNumber: "1",
          heading: "Definição Formal, Coeficientes e Contexto Histórico",
          paragraphs: [
            "Denomina-se equação do 2º grau na incógnita x toda sentença algébrica que pode ser reduzida à forma canônica ax² + bx + c = 0, em que a, b e c são números reais chamados coeficientes e a ≠ 0. O coeficiente 'a' acompanha o termo quadrático x², 'b' acompanha o termo linear x e 'c' é o termo independente.",
            "Quando b = 0 ou c = 0, a equação é chamada de incompleta e pode ser resolvida diretamente por isolamento de x (quando b = 0, ex: x² - 9 = 0 ⟹ x = ±3) ou colocando x em evidência (quando c = 0, ex: x² - 5x = 0 ⟹ x(x - 5) = 0 ⟹ x = 0 ou x = 5). Historicamente, métodos de resolução já eram empregados por matemáticos babilônios, por Al-Khwarizmi no século IX e por Bhaskara Akaria no século XII."
          ]
        },
        {
          sectionNumber: "2",
          heading: "Fórmula Resolutiva de Bhaskara e o Discriminante (Δ)",
          highlightEquation:
            "ax² + bx + c = 0  (a ≠ 0)   ⟹   Δ = b² - 4ac   ⟹   x = (-b ± √Δ) / (2a)",
          paragraphs: [
            "Pelo método de completamento de quadrados, demonstra-se que as raízes de qualquer equação completa ou incompleta do 2º grau são obtidas calculando-se primeiramente o discriminante Δ = b² - 4ac e, em seguida, aplicando-se x = (-b ± √Δ) / (2a).",
            "O sinal do discriminante Δ determina a natureza das raízes no conjunto dos números reais (ℝ): (1) se Δ > 0, a equação possui duas raízes reais e distintas (x₁ ≠ x₂); (2) se Δ = 0, a equação possui duas raízes reais e iguais (uma única raiz real dupla x₁ = x₂ = -b/2a); (3) se Δ < 0, a equação não possui raízes reais, pois não existe raiz quadrada real de número negativo."
          ]
        },
        {
          sectionNumber: "3",
          heading: "Exemplos Resolvidos Passo a Passo e Relações de Soma e Produto",
          paragraphs: [
            "Exemplo 1 (Cálculo das raízes): Na equação 2x² - 8x + 6 = 0, identificamos a = 2, b = -8 e c = 6. O discriminante é Δ = (-8)² - 4 · 2 · 6 = 64 - 48 = 16. Como Δ > 0, calculamos x = (-(-8) ± √16) / (2 · 2) = (8 ± 4) / 4, obtendo x₁ = 12/4 = 3 e x₂ = 4/4 = 1. Logo, o conjunto solução é S = {1, 3}.",
            "Pelas Relações de Girard, sem precisar calcular as raízes separadamente, sabemos que a soma das raízes vale S = x₁ + x₂ = -b/a = -(-8)/2 = 4 e o produto vale P = x₁ · x₂ = c/a = 6/2 = 3, o que permite também escrever a forma fatorada a(x - x₁)(x - x₂) = 2(x - 1)(x - 3) = 0."
          ]
        },
        {
          sectionNumber: "4",
          heading: "Relações com a Função Quadrática e Aplicações Práticas",
          paragraphs: [
            "As raízes reais da equação ax² + bx + c = 0 correspondem geometricamente às abscissas dos pontos em que a parábola da função quadrática f(x) = ax² + bx + c corta o eixo horizontal Ox no plano cartesiano.",
            "Na resolução de problemas práticos — como o cálculo das dimensões de terrenos retangulares de área conhecida, a trajetória balística de projéteis na Física (s = s₀ + v₀t + at²/2) ou a maximização de receitas —, é indispensável verificar se as raízes encontradas atendem às restrições do enunciado (por exemplo, medidas de comprimento e tempo devem ser positivas)."
          ]
        }
      ],
      academicConclusions: [
        "O coeficiente 'a' nunca pode ser nulo em uma equação do 2º grau, e a correta identificação dos sinais de a, b e c é o passo mais importante antes de calcular Δ = b² - 4ac.",
        "O estudo do discriminante (Δ > 0, Δ = 0 ou Δ < 0) permite prever a quantidade de soluções reais e a posição da parábola em relação ao eixo x.",
        "As relações de soma (-b/a) e produto (c/a) agilizam a verificação das raízes e a fatoração do trinômio do segundo grau."
      ],
      bibliographicReferences: profile.realReferences
    };
  }

  // 3. GERADOR ESPECÍFICO POR DISCIPLINA E TÓPICO (PARA TODAS AS 15 DISCIPLINAS)
  const levelFocusText =
    level === 1
      ? "com foco introdutório, linguagem acessível e construção sólida dos conceitos fundamentais"
      : level === 3
      ? "com aprofundamento analítico, resolução de situações complexas e análise crítica de casos"
      : level === 4
      ? "em nível de aprofundamento interdisciplinar, articulação teórica avançada e aplicação crítica"
      : "com foco na consolidação conceitual, exemplos práticos contextualizados e articulação com a disciplina";

  const chapters: AcademicPaper["chapters"] = [
    {
      sectionNumber: "1",
      heading: `Conceito Central e Contextualização de ${topicTitle}`,
      paragraphs: [
        domain.coreDefinition,
        domain.historicalContext
      ]
    },
    {
      sectionNumber: "2",
      heading:
        domain.areaType === "humanas"
          ? `Fundamentos Teóricos, Processos Históricos e Categorias de Análise`
          : domain.areaType === "biologicas"
          ? `Estruturas Biológicas, Etapas do Processo e Mecanismos Fisiológicos`
          : domain.areaType === "linguagens"
          ? `Regras de Estruturação, Funcionamento Linguístico e Construção de Sentido`
          : `Princípios Fundamentais, Regras Operacionais e Desenvolvimento Passo a Passo`,
      highlightEquation: domain.formulaOrSyntax,
      paragraphs: [
        domain.mechanismsAndProcesses,
        domain.formulaInterpretation
          ? `${domain.formulaInterpretation} O estudo deste tópico (${levelFocusText}) tem como pré-requisito direto a compreensão de "${domain.prerequisiteTitle}", articulando-se ao módulo "${domain.moduleTitle}".`
          : `Para o domínio consistente de "${topicTitle}" (${levelFocusText}), é fundamental articular os conceitos deste capítulo com a base de "${domain.prerequisiteTitle}" dentro do eixo temático "${domain.moduleTitle}".`
      ]
    },
    {
      sectionNumber: "3",
      heading: `Exemplos Concretos e Aplicações em ${profile.name}`,
      paragraphs: [
        ...domain.practicalExamples,
        domain.importantRelations
      ]
    },
    {
      sectionNumber: "4",
      heading: `Pontos de Atenção, Erros Frequentes e Síntese do Conteúdo`,
      paragraphs: [
        `Um erro frequente observado no estudo de "${topicTitle}" consiste em: ${domain.commonMistake}`,
        `Como corrigir e acertar nas atividades: ${domain.mistakeCorrection}`,
        `Analogia didática para fixação: ${domain.analogyExplanation}`
      ]
    }
  ];

  return {
    title: topicTitle,
    subtitle: `${domain.moduleTitle} • Estudo Estruturado de ${profile.name}`,
    discipline: profile.name,
    fieldArea: profile.fieldArea,
    cduCode: `${profile.cduPrefix} • ${profile.name}`,
    abntCitation: profile.realReferences[0],
    estimatedReadingMinutes: 10,
    abstract: `${domain.coreDefinition} Este resumo aborda a contextualização histórica e teórica do tema em ${profile.name}, seus conceitos estruturantes, exemplos concretos, conexões com "${domain.prerequisiteTitle}" e orientações práticas para resolução de questões.`,
    keywords: domain.keyTerms,
    chapters,
    academicConclusions: [
      `O estudo de "${topicTitle}" em ${profile.name} exige compreender seus conceitos próprios (${domain.keyTerms.slice(0, 3).join(", ")}), evitando memorizações isoladas.`,
      domain.mistakeCorrection,
      domain.importantRelations
    ],
    bibliographicReferences: profile.realReferences
  };
}
