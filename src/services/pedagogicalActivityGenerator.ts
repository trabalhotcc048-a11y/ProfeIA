import { ActivityQuestion, ContentItem, Discipline, QuestionOption } from "../types";
import { getDisciplineProfile } from "./pedagogicalCatalog";
import { getTopicDomainKnowledge, TopicDomainKnowledge } from "./pedagogicalKnowledgeBase";

export interface ErrorFeedbackAndMicroLeveling {
  disciplineId: string;
  disciplineName: string;
  topicId: string;
  topicTitle: string;
  moduleTitle: string;
  questionTitle: string;
  questionPrompt: string;
  studentAnswerLabel: string;
  studentAnswerText: string;
  correctAnswerLabel: string;
  correctAnswerText: string;
  whyCorrectExplanation: string;
  specificErrorExplanation: string;
  shortDidacticCorrection: string;
  formulaOrConceptHighlight?: string;
  conceptWithDifficulty: string;
  prerequisiteConcept: string;
  prerequisiteExplanation: string;
  simpleWorkedExample: string;
  reinforcementQuestion: {
    prompt: string;
    options: QuestionOption[];
    explanation: string;
  };
}

function rotateOptions(
  rawOptions: Array<{ text: string; isCorrect: boolean; explanation: string }>,
  baseId: string,
  shift: number
): QuestionOption[] {
  const n = rawOptions.length;
  const k = ((shift % n) + n) % n;
  const rotated = [...rawOptions.slice(k), ...rawOptions.slice(0, k)];
  return rotated.map((opt, idx) => ({
    id: `${baseId}-opt-${idx + 1}`,
    text: opt.text,
    isCorrect: opt.isCorrect,
    explanation: opt.explanation
  }));
}

/**
 * Constrói uma questão de reforço concreta e específica para o mesmo conceito,
 * verificando na prática se o aluno corrigiu a dificuldade identificada.
 */
function buildConceptReinforcementQuestion(
  domain: TopicDomainKnowledge,
  baseId: string,
  qIdx: number,
  _conceptFocus?: string
): {
  prompt: string;
  options: QuestionOption[];
  explanation: string;
} {
  const norm = domain.topicTitle.toLowerCase();
  const t = domain.topicTitle;
  const dName = domain.disciplineName;

  if (domain.disciplineId === "matematica") {
    if (norm.includes("bhaskara") || norm.includes("2º grau") || norm.includes("quadrática") || norm.includes("girard") || norm.includes("fatoração")) {
      const isSecondVariant = qIdx % 2 === 0;
      const raw = isSecondVariant
        ? [
            {
              text: "Δ = 1, e aplicando x = (-(-5) ± √1) / (2·1) = (5 ± 1)/2, obtemos as raízes x₁ = 3 e x₂ = 2.",
              isCorrect: true,
              explanation: "Correto! Em x² - 5x + 6 = 0, a = 1, b = -5 e c = 6. Calculamos Δ = (-5)² - 4·1·6 = 25 - 24 = 1. Substituindo na fórmula: x = (5 ± 1)/2, resultando em x₁ = 3 e x₂ = 2."
            },
            {
              text: "Δ = 1, e aplicando x = (-5 ± √1) / 2, obtemos as raízes negativas x₁ = -3 e x₂ = -2.",
              isCorrect: false,
              explanation: "Atenção ao sinal de -b: como b = -5, na fórmula de Bhaskara fica -(-5) = +5 (positivo), portanto as raízes são +3 e +2."
            },
            {
              text: "Δ = 49, pois (-5)² - 4·1·6 = 25 + 24 = 49, gerando x₁ = 6 e x₂ = -1.",
              isCorrect: false,
              explanation: "Erro no termo -4ac: como a = 1 e c = 6 são positivos, fazemos 25 - 24 = 1 (subtração, e não soma)."
            },
            {
              text: "Δ = -49, pois (-5)² = -25, logo a equação não possui raízes reais.",
              isCorrect: false,
              explanation: "Todo número real negativo elevado ao quadrado fica positivo: (-5)² = (-5)·(-5) = +25."
            }
          ]
        : [
            {
              text: "Δ = 16, x = (6 ± √16) / 2 = (6 ± 4) / 2, resultando nas raízes reais x₁ = 5 e x₂ = 1.",
              isCorrect: true,
              explanation: "Exato! Em x² - 6x + 5 = 0, temos a = 1, b = -6 e c = 5. Δ = (-6)² - 4·1·5 = 36 - 20 = 16. Substituindo em Bhaskara: x = (-(-6) ± 4)/2 = (6 ± 4)/2 ⟹ x₁ = 5 e x₂ = 1."
            },
            {
              text: "Δ = 16, x = (-6 ± 4) / 2, resultando nas raízes x₁ = -1 e x₂ = -5.",
              isCorrect: false,
              explanation: "O erro está no sinal de -b: sendo b = -6, temos -b = -(-6) = +6, e não -6."
            },
            {
              text: "Δ = 56, pois 36 + 20 = 56.",
              isCorrect: false,
              explanation: "Na fórmula Δ = b² - 4ac, devemos subtrair 4·1·5 = 20 de 36 (36 - 20 = 16)."
            },
            {
              text: "Δ = 16, x = 6 ± 4, resultando em x₁ = 10 e x₂ = 2 (sem dividir por 2a).",
              isCorrect: false,
              explanation: "Não se esqueça de dividir o numerador (6 ± 4) pelo denominador 2a = 2·1 = 2."
            }
          ];

      return {
        prompt: isSecondVariant
          ? `Exercício de Reforço (${t}): Para verificar a correção do erro no cálculo do discriminante Δ e na substituição em Bhaskara, resolva a equação x² - 5x + 6 = 0 (com a = 1, b = -5 e c = 6):`
          : `Exercício de Reforço (${t}): Aplicando Δ = b² - 4ac e x = (-b ± √Δ) / (2a) na equação x² - 6x + 5 = 0 (onde a = 1, b = -6 e c = 5), qual é a resolução correta?`,
        options: rotateOptions(raw, `${baseId}-rem`, qIdx + 1),
        explanation: isSecondVariant
          ? "Em x² - 5x + 6 = 0: Δ = (-5)² - 4(1)(6) = 25 - 24 = 1; x = (5 ± 1)/2 ⟹ x₁ = 3 e x₂ = 2."
          : "Em x² - 6x + 5 = 0: Δ = (-6)² - 4(1)(5) = 36 - 20 = 16; x = (6 ± 4)/2 ⟹ x₁ = 5 e x₂ = 1."
      };
    }

    if (norm.includes("funç") || norm.includes("afim") || norm.includes("exponencial") || norm.includes("logaritm") || norm.includes("progress")) {
      const raw = [
        {
          text: "Taxa de variação a = 2 (função crescente), valor inicial b = -6 e raiz x = 3 (pois 2·3 - 6 = 0).",
          isCorrect: true,
          explanation: "Correto! Em f(x) = 2x - 6, o coeficiente de x é a = 2 > 0, o termo independente é b = -6 e igualando 2x - 6 = 0 obtemos 2x = 6 ⟹ x = 3."
        },
        {
          text: "Taxa de variação a = -6, valor inicial b = 2 e raiz x = -3.",
          isCorrect: false,
          explanation: "Você inverteu os coeficientes: 'a' multiplica x (a = 2) e 'b' é o termo fixo (b = -6)."
        },
        {
          text: "Taxa de variação a = 2, valor inicial b = -6 e raiz x = -3.",
          isCorrect: false,
          explanation: "Ao isolar x em 2x - 6 = 0, o -6 passa para o outro lado positivo: 2x = +6 ⟹ x = +3."
        },
        {
          text: "Taxa de variação a = 2, valor inicial b = 0 e raiz x = 6.",
          isCorrect: false,
          explanation: "Para achar a raiz, após passar o 6 somando (2x = 6), é necessário dividir por 2: x = 6/2 = 3."
        }
      ];
      return {
        prompt: `Exercício de Reforço (${t}): Dada a função f(x) = 2x - 6, determine corretamente o coeficiente angular (a), o coeficiente linear (b) e a raiz da função (f(x) = 0):`,
        options: rotateOptions(raw, `${baseId}-rem`, qIdx + 1),
        explanation: "Em f(x) = 2x - 6: a = 2, b = -6 e a raiz é 2x - 6 = 0 ⟹ x = 3."
      };
    }
  }

  if (domain.disciplineId === "fisica") {
    if (norm.includes("mru") || norm.includes("velocidade") || norm.includes("torricelli") || norm.includes("queda") || norm.includes("cinemática")) {
      const raw = [
        {
          text: "Convertendo 72 km/h ÷ 3,6 = 20 m/s; em t = 5 s, o deslocamento é Δs = v · t = 20 · 5 = 100 metros.",
          isCorrect: true,
          explanation: "Perfeito! Primeiro convertemos km/h para m/s dividindo por 3,6 (72 ÷ 3,6 = 20 m/s) e depois multiplicamos pelo tempo: 20 m/s × 5 s = 100 m."
        },
        {
          text: "Multiplicando diretamente 72 × 5 = 360 metros, sem converter a unidade de velocidade.",
          isCorrect: false,
          explanation: "Erro de unidade: não se pode multiplicar km/h diretamente por segundos; é obrigatório dividir 72 por 3,6 para obter 20 m/s."
        },
        {
          text: "Multiplicando 72 × 3,6 = 259,2 m/s e obtendo Δs = 1.296 metros.",
          isCorrect: false,
          explanation: "Para converter de km/h para m/s deve-se dividir por 3,6 (e não multiplicar)."
        },
        {
          text: "Convertendo para 20 m/s e dividindo pelo tempo: Δs = 20 ÷ 5 = 4 metros.",
          isCorrect: false,
          explanation: "Pela fórmula v = Δs / Δt, para isolar o deslocamento multiplicamos velocidade pelo tempo: Δs = v · Δt = 20 · 5 = 100 m."
        }
      ];
      return {
        prompt: `Exercício de Reforço (${t}): Um veículo move-se com velocidade constante de 72 km/h durante 5 segundos. Convertendo a velocidade para m/s (SI), qual é a distância percorrida?`,
        options: rotateOptions(raw, `${baseId}-rem`, qIdx + 1),
        explanation: "72 km/h ÷ 3,6 = 20 m/s. Logo, Δs = 20 m/s × 5 s = 100 metros."
      };
    }

    if (norm.includes("newton") || norm.includes("força") || norm.includes("inércia") || norm.includes("atrito")) {
      const raw = [
        {
          text: "Força resultante F_R = 40 - 10 = 30 N; pela 2ª Lei de Newton (F_R = m · a), a = 30 / 6 = 5 m/s².",
          isCorrect: true,
          explanation: "Exato! Subtraímos o atrito oposto (40 - 10 = 30 N) e dividimos pela massa m = 6 kg: a = 30 / 6 = 5 m/s²."
        },
        {
          text: "Força resultante F_R = 40 + 10 = 50 N e aceleração a = 50 / 6 = 8,33 m/s².",
          isCorrect: false,
          explanation: "A força de atrito atua em sentido oposto ao movimento, portanto deve ser subtraída (40 - 10 = 30 N)."
        },
        {
          text: "Força resultante F_R = 30 N e aceleração a = 30 × 6 = 180 m/s².",
          isCorrect: false,
          explanation: "Em F_R = m · a, a massa passa dividindo: a = F_R / m = 30 / 6 = 5 m/s²."
        },
        {
          text: "Força resultante F_R = 40 N (ignorando o atrito) e a = 40 / 6 = 6,67 m/s².",
          isCorrect: false,
          explanation: "Todas as forças horizontais que atuam sobre o bloco devem entrar no cálculo da força resultante."
        }
      ];
      return {
        prompt: `Exercício de Reforço (${t}): Um bloco de massa m = 6 kg sofre uma força horizontal de 40 N para a direita e uma força de atrito de 10 N para a esquerda. Qual é a força resultante e a aceleração do bloco?`,
        options: rotateOptions(raw, `${baseId}-rem`, qIdx + 1),
        explanation: "F_R = 40 - 10 = 30 N. Aplicando F_R = m · a ⟹ a = 30 / 6 = 5 m/s²."
      };
    }

    if (norm.includes("calor") || norm.includes("térmic") || norm.includes("temperatura") || norm.includes("termodinâmica")) {
      const raw = [
        {
          text: "ΔT = 50 - 20 = 30 °C; aplicando Q = m · c · ΔT = 200 · 1,0 · 30 = 6.000 cal (6 kcal).",
          isCorrect: true,
          explanation: "Correto! A variação de temperatura é ΔT = 30 °C e o calor sensível absorvido é Q = 200 × 1,0 × 30 = 6.000 cal."
        },
        {
          text: "Q = 200 · 1,0 · 50 = 10.000 cal (usando apenas a temperatura final em vez de ΔT).",
          isCorrect: false,
          explanation: "Na equação Q = m · c · ΔT utiliza-se a variação de temperatura ΔT = T_final - T_inicial = 50 - 20 = 30 °C."
        },
        {
          text: "ΔT = 20 - 50 = -30 °C e Q = -6.000 cal em um processo de aquecimento.",
          isCorrect: false,
          explanation: "Como a água foi aquecida de 20 °C para 50 °C, ΔT é positivo (+30 °C) e Q > 0 (calor recebido)."
        },
        {
          text: "Q = (200 + 30) · 1,0 = 230 cal.",
          isCorrect: false,
          explanation: "As grandezas massa, calor específico e variação de temperatura devem ser multiplicadas: Q = m · c · ΔT."
        }
      ];
      return {
        prompt: `Exercício de Reforço (${t}): Calcule a quantidade de calor sensível Q necessária para aquecer m = 200 g de água (c = 1,0 cal/g·°C) de 20 °C até 50 °C usando Q = m · c · ΔT:`,
        options: rotateOptions(raw, `${baseId}-rem`, qIdx + 1),
        explanation: "ΔT = 50 - 20 = 30 °C; Q = 200 · 1,0 · 30 = 6.000 cal."
      };
    }
  }

  if (
    domain.disciplineId === "biologia" &&
    (norm.includes("fotossíntese") ||
      norm.includes("fotossintese") ||
      norm.includes("calvin") ||
      norm.includes("rubisco") ||
      norm.includes("cloroplasto") ||
      norm.includes("tilacoide"))
  ) {
    const isCalvinReinforcement =
      norm.includes("calvin") || norm.includes("rubisco") || norm.includes("fase química") || norm.includes("estroma");
    const rawPhoto = isCalvinReinforcement
      ? [
          {
            text: "No estroma do cloroplasto, a enzima RuBisCO fixa o CO₂ na RuBP e o Ciclo de Calvin-Benson consome o ATP e o NADPH produzidos na fase fotoquímica para sintetizar carboidratos (G3P/glicose).",
            isCorrect: true,
            explanation:
              "Correto! No Ciclo de Calvin-Benson (estroma), a enzima RuBisCO catalisa a fixação do CO₂ e utiliza o ATP e o NADPH provenientes dos tilacoides para reduzir o carbono fixado em carboidratos."
          },
          {
            text: "O Ciclo de Calvin-Benson realiza a fotólise da água nos tilacoides para liberar O₂ diretamente a partir da quebra da molécula de CO₂.",
            isCorrect: false,
            explanation:
              "O erro está em confundir as etapas: a fotólise da água e a liberação de O₂ ocorrem nos tilacoides (fase fotoquímica), enquanto o Ciclo de Calvin fixa CO₂ no estroma."
          },
          {
            text: "A enzima RuBisCO atua de forma independente de ATP e NADPH, fixando carbono exclusivamente na ausência total de produtos da etapa fotoquímica.",
            isCorrect: false,
            explanation:
              "O erro está em ignorar que a redução do carbono fixado pela RuBisCO e a regeneração da RuBP dependem diretamente do ATP e do NADPH gerados na fase fotoquímica."
          },
          {
            text: "O Ciclo de Calvin-Benson tem como função oxidar a glicose até CO₂ para gerar ATP, substituindo a etapa fotoquímica do cloroplasto.",
            isCorrect: false,
            explanation:
              "O erro está em inverter o processo: o Ciclo de Calvin-Benson é uma via anabólica de redução de CO₂ (consumindo ATP e NADPH) para sintetizar glicídios no estroma."
          }
        ]
      : [
          {
            text: "Nos tilacoides ocorre a fase fotoquímica (absorção de luz pela clorofila, fotólise da água liberando O₂ e síntese de ATP e NADPH), e no estroma ocorre o Ciclo de Calvin-Benson (fixação de CO₂ pela RuBisCO).",
            isCorrect: true,
            explanation:
              "Correto! A fase fotoquímica nos tilacoides quebra a água (liberando O₂) e gera ATP e NADPH, que abastecem a fixação de CO₂ no estroma."
          },
          {
            text: "O gás oxigênio (O₂) liberado na fotossíntese provém da quebra do gás carbônico (CO₂) no estroma do cloroplasto.",
            isCorrect: false,
            explanation:
              "O erro está na origem do O₂: todo o oxigênio liberado na fotossíntese provém da fotólise da molécula de água (H₂O) nos tilacoides."
          },
          {
            text: "A fase fotoquímica ocorre no estroma consumindo glicose, enquanto o Ciclo de Calvin ocorre nas membranas dos tilacoides liberando O₂.",
            isCorrect: false,
            explanation:
              "O erro está em inverter os compartimentos do cloroplasto: tilacoides realizam a fase fotoquímica e o estroma realiza o Ciclo de Calvin-Benson."
          },
          {
            text: "A síntese de carboidratos no estroma ocorre sem participação da enzima RuBisCO e sem necessidade de ATP ou NADPH.",
            isCorrect: false,
            explanation:
              "O erro está em desconsiderar que a fixação do CO₂ exige a enzima RuBisCO e o consumo de ATP e NADPH da fase fotoquímica."
          }
        ];
    return {
      prompt: isCalvinReinforcement
        ? `Exercício de Reforço (${t}): Considerando especificamente o funcionamento do Ciclo de Calvin-Benson e da enzima RuBisCO no estroma do cloroplasto, assinale a alternativa correta:`
        : `Exercício de Reforço (${t}): Sobre a relação entre a fase fotoquímica nos tilacoides e a fixação de carbono no estroma do cloroplasto durante a fotossíntese, assinale a alternativa correta:`,
      options: rotateOptions(rawPhoto, `${baseId}-rem`, qIdx + 1),
      explanation: isCalvinReinforcement
        ? "No Ciclo de Calvin-Benson (estroma do cloroplasto), a enzima RuBisCO fixa o CO₂ na RuBP e consome ATP e NADPH da fase fotoquímica para produzir carboidratos."
        : "Na fotossíntese, a fotólise da água nos tilacoides libera O₂ e gera ATP e NADPH, que são utilizados no estroma (Ciclo de Calvin-Benson) para fixar o CO₂ em glicídios."
    };
  }

  if (
    domain.disciplineId === "biologia" &&
    (norm.includes("pareamento") ||
      norm.includes("antiparalel") ||
      norm.includes("dupla-hélice") ||
      norm.includes("dupla hélice") ||
      norm.includes("dna") ||
      norm.includes("rna") ||
      norm.includes("transcrição"))
  ) {
    const rawDna = [
      {
        text: "A fita complementar de DNA é 5'- ATG CCA GCT -3' (pareando A-T e C-G) e o RNAm transcrito é 5'- AUG CCA GCU -3' (no sentido antiparalelo 5'→3', substituindo Timina por Uracila).",
        isCorrect: true,
        explanation:
          "Correto! As fitas são antiparalelas (o molde 3'→5' gera fita 5'→3'); no DNA pareiam-se A-T e C-G, e no RNA a Adenina do molde pareia com Uracila (U)."
      },
      {
        text: "A fita complementar de DNA é 3'- ATG CCA GCT -5' e o RNAm transcrito é 3'- AUG CCA GCU -5', mantendo o mesmo sentido 3'→5' da fita molde.",
        isCorrect: false,
        explanation:
          "O erro está em desconsiderar o antiparalelismo: se a fita molde está no sentido 3'→5', a fita complementar e o RNAm são obrigatoriamente sintetizados no sentido 5'→3'."
      },
      {
        text: "O RNAm transcrito é 5'- ATG CCA GCT -3', mantendo a base Timina (T) na molécula de RNA.",
        isCorrect: false,
        explanation:
          "O erro está em incluir Timina (T) no RNA: na transcrição, toda Adenina (A) da fita molde de DNA pareia com Uracila (U) no RNA."
      },
      {
        text: "No pareamento complementar de bases nitrogenadas, a Adenina pareia com a Citosina (A-C) e a Timina pareia com a Guanina (T-G).",
        isCorrect: false,
        explanation:
          "O erro está na complementaridade das bases (Regra de Chargaff): a Adenina pareia exclusivamente com Timina (A=T) ou Uracila (A-U no RNA), e a Citosina pareia exclusivamente com Guanina (C≡G)."
      }
    ];
    return {
      prompt: `Exercício de Reforço (${t}): Considerando o pareamento complementar de bases nitrogenadas e o antiparalelismo das fitas (molde 3'→5' → síntese 5'→3'), dada a fita molde de DNA 3'- TAC GGT CGA -5', assinale a alternativa correta:`,
      options: rotateOptions(rawDna, `${baseId}-rem`, qIdx + 1),
      explanation:
        "Para o molde 3'- TAC GGT CGA -5', a fita complementar de DNA é 5'- ATG CCA GCT -3' (A-T e C-G) e o RNAm transcrito é 5'- AUG CCA GCU -3' (A-U, T-A e C-G em orientação antiparalela 5'→3')."
    };
  }

  if (
    domain.disciplineId === "sociologia" &&
    (norm.includes("fato social") ||
      norm.includes("durkheim") ||
      norm.includes("coercitividade") ||
      norm.includes("exterioridade") ||
      norm.includes("generalidade"))
  ) {
    const rawDurkheim = [
      {
        text: "O Fato Social caracteriza-se pela exterioridade (existe fora e antes das consciências individuais), coercitividade (impõe-se aos indivíduos por sanções legais ou sociais) e generalidade (é coletivo e compartilhado no grupo social).",
        isCorrect: true,
        explanation:
          "Correto! Em Émile Durkheim, todo Fato Social (como as leis, o idioma e os costumes) reúne obrigatoriamente coercitividade, exterioridade e generalidade."
      },
      {
        text: "O Fato Social depende exclusivamente da vontade individual de cada cidadão, não exercendo coerção nem existindo fora da consciência particular.",
        isCorrect: false,
        explanation:
          "O erro está em reduzir o Fato Social à psicologia individual: para Durkheim, os fatos sociais são exteriores ao indivíduo e dotados de força coercitiva coletiva."
      },
      {
        text: "A coercitividade do Fato Social ocorre apenas quando há uso de força física policial, inexistindo coerção moral ou costumeira na sociedade.",
        isCorrect: false,
        explanation:
          "O erro está em ignorar a coerção social difusa: além das sanções jurídicas formais, a sociedade exerce coerção por meio da reprovação moral, do riso e do isolamento."
      },
      {
        text: "Um hábito exclusivamente particular e isolado de um único indivíduo constitui um Fato Social por possuir generalidade.",
        isCorrect: false,
        explanation:
          "O erro está no conceito de generalidade: para ser Fato Social, o fenômeno deve ser coletivo e compartilhado pelo grupo social."
      }
    ];
    return {
      prompt: `Exercício de Reforço (${t}): Segundo o método sociológico de Émile Durkheim, assinale a alternativa que define corretamente o Fato Social e suas três características essenciais:`,
      options: rotateOptions(rawDurkheim, `${baseId}-rem`, qIdx + 1),
      explanation:
        "Para Émile Durkheim, o Fato Social apresenta três características indissociáveis: coercitividade, exterioridade e generalidade."
    };
  }

  if (
    domain.disciplineId === "historia" &&
    (norm.includes("revolução francesa") ||
      norm.includes("bastilha") ||
      norm.includes("antigo regime") ||
      norm.includes("jacobin") ||
      norm.includes("girondin"))
  ) {
    const rawFrenchRev = [
      {
        text: "A Revolução Francesa (1789) derrubou o absolutismo e os privilégios estamentais do Clero (1º Estado) e da Nobreza (2º Estado), proclamando a Declaração dos Direitos do Homem e do Cidadão sob liderança do Terceiro Estado.",
        isCorrect: true,
        explanation:
          "Correto! A Revolução Francesa pôs fim ao Antigo Regime absolutista e estamental na França, instaurando a igualdade jurídica civil."
      },
      {
        text: "A Revolução Francesa manteve intactos o absolutismo de direito divino e a isenção tributária da nobreza e do clero ao longo de todo o processo revolucionário.",
        isCorrect: false,
        explanation:
          "O erro está em afirmar a manutenção do Antigo Regime: a Revolução aboliu os direitos feudais, os privilégios fiscais estamentais e a monarquia absolutista."
      },
      {
        text: "Os Jacobinos defendiam a manutenção do poder absoluto do rei Luís XVI, enquanto o Primeiro Estado liderou a tomada da Bastilha para abolir a propriedade privada.",
        isCorrect: false,
        explanation:
          "O erro está em inverter os grupos políticos: os Jacobinos constituíam a ala republicana mais radical apoiada pelos sans-culottes, enquanto o 1º Estado era o alto clero privilegiado."
      },
      {
        text: "A sociedade francesa pré-revolucionária baseava-se na igualdade de impostos entre os Três Estados e no sufrágio universal irrestrito.",
        isCorrect: false,
        explanation:
          "O erro está em ignorar a estrutura estamental do Antigo Regime, na qual o 3º Estado (burguesia, camponeses e trabalhadores urbanos) sustentava sozinho a carga tributária."
      }
    ];
    return {
      prompt: `Exercício de Reforço (${t}): Considerando a crise do Antigo Regime, a divisão nos Três Estados e os desdobramentos da Revolução Francesa (1789), assinale a alternativa correta:`,
      options: rotateOptions(rawFrenchRev, `${baseId}-rem`, qIdx + 1),
      explanation:
        "A Revolução Francesa suprimiu o absolutismo monárquico e a sociedade estamental do Antigo Regime, afirmando os princípios iluministas de cidadania e igualdade jurídica."
    };
  }

  if (
    domain.disciplineId === "geografia" &&
    (norm.includes("clima") ||
      norm.includes("climátic") ||
      norm.includes("equatorial") ||
      norm.includes("tropical") ||
      norm.includes("semiárido") ||
      norm.includes("subtropical"))
  ) {
    const rawClimate = [
      {
        text: "O Clima Equatorial (Amazônia) é quente e úmido o ano inteiro com baixa amplitude térmica; o Tropical Típico (Brasil Central) alterna verão chuvoso e inverno seco; o Semiárido (Sertão Nordestino) tem altas temperaturas e chuvas escassas/irregulares; e o Subtropical (Região Sul) apresenta chuvas bem distribuídas e a maior amplitude térmica anual pela atuação da mPa.",
        isCorrect: true,
        explanation:
          "Correto! Essa alternativa relaciona com precisão os fatores climáticos (latitude, altitude e massas de ar mEc, mTa e mPa), o regime de temperatura, umidade e precipitação e a distribuição espacial dos tipos climáticos no Brasil."
      },
      {
        text: "O Clima Equatorial possui longo inverno seco na Amazônia, enquanto o Clima Semiárido registra chuvas abundantes e regulares durante todos os meses do ano no Sertão Nordestino.",
        isCorrect: false,
        explanation:
          "O erro está em inverter os regimes de precipitação: na Amazônia (Equatorial) chove o ano todo sob ação da mEc, enquanto no Sertão (Semiárido) as chuvas são escassas e mal distribuídas."
      },
      {
        text: "O Clima Subtropical predomina no Norte do Brasil com baixíssima amplitude térmica, enquanto o Clima Tropical Típico ocorre no extremo Sul com quedas acentuadas de temperatura e neve no verão.",
        isCorrect: false,
        explanation:
          "O erro está na distribuição espacial e térmica: o Clima Subtropical atua no Sul do Brasil (abaixo do Trópico de Capricórnio) com elevada amplitude térmica e invernos frios."
      },
      {
        text: "A temperatura, a umidade e a precipitação nos climas brasileiros independem da latitude, da altitude e da circulação das massas de ar.",
        isCorrect: false,
        explanation:
          "O erro está em desconsiderar os fatores climáticos: latitude, altitude, maritimidade/continentalidade e massas de ar controlam diretamente a temperatura, a umidade e as chuvas no Brasil."
      }
    ];
    return {
      prompt: `Exercício de Reforço (${t}): Considerando a atuação dos fatores climáticos (latitude, altitude e massas de ar) sobre a temperatura, a umidade e a precipitação, assinale a alternativa que caracteriza corretamente a distribuição espacial dos tipos climáticos do Brasil:`,
      options: rotateOptions(rawClimate, `${baseId}-rem`, qIdx + 1),
      explanation:
        "No Brasil, o Clima Equatorial (Amazônia) é quente e chuvoso o ano todo; o Tropical Típico (Brasil Central) possui verão chuvoso e inverno seco; o Semiárido (Sertão) apresenta altas temperaturas e baixa pluviosidade irregular; e o Subtropical (Sul) tem chuvas bem distribuídas e elevada amplitude térmica anual."
    };
  }

  // Para todas as disciplinas (Sociologia, Biologia, História, Geografia, Química, Português, Inglês, Técnicas, etc.):
  // Cria um exercício de reforço centrado diretamente no conceito, exemplo prático e correção do erro específico do tópico!
  const exampleText = domain.practicalExamples[0];
  const rawGenericDomain = [
    {
      text: `${domain.mistakeCorrection} (Aplicando os conceitos de ${domain.keyTerms.slice(0, 2).join(" e ")} em "${t}").`,
      isCorrect: true,
      explanation: `Correto! Você aplicou com precisão o conceito de "${t}" em ${dName}: ${domain.coreDefinition}`
    },
    {
      text: `${domain.commonMistake}`,
      isCorrect: false,
      explanation: `O erro está em repetir o equívoco conceitual analisado. A forma correta em "${t}" é: ${domain.mistakeCorrection}`
    },
    {
      text: `Desconsiderar o papel de ${domain.keyTerms[0] || t} e analisar o problema sem observar ${domain.prerequisiteTitle}.`,
      isCorrect: false,
      explanation: `O erro está em ignorar "${domain.keyTerms[0] || t}" e o pré-requisito "${domain.prerequisiteTitle}", que estruturam "${t}" em ${dName}.`
    },
    {
      text: `Inverter a relação explicada em "${t}", contrariando o processo: ${domain.mechanismsAndProcesses.slice(0, 95)}...`,
      isCorrect: false,
      explanation: `O funcionamento correto de "${t}" em ${dName} exige: ${domain.mechanismsAndProcesses}`
    }
  ];

  return {
    prompt: `Exercício de Reforço sobre "${t}" (${dName}): Considerando o caso prático estudado ("${exampleText.slice(0, 140)}..."), qual alternativa aplica corretamente o conceito e corrige a dificuldade identificada?`,
    options: rotateOptions(rawGenericDomain, `${baseId}-rem`, qIdx + 1),
    explanation: `${domain.mistakeCorrection} ${domain.coreDefinition}`
  };
}

function buildRemedialFallback(
  domain: TopicDomainKnowledge,
  baseId: string,
  qIdx: number,
  conceptFocus?: string
): NonNullable<ActivityQuestion["prerequisiteFallback"]> {
  const reinforcement = buildConceptReinforcementQuestion(domain, baseId, qIdx, conceptFocus);
  return {
    prerequisiteTopic: domain.prerequisiteTitle,
    explanation: `Pré-requisito necessário (${domain.prerequisiteTitle}): ${domain.coreDefinition} Exemplo simples: ${domain.practicalExamples[0]}`,
    remedialQuestion: reinforcement
  };
}

/**
 * Identifica o SUBCONCEITO MAIS ESPECÍFICO avaliado pela questão usando prioritariamente:
 * questão + enunciado + alternativas + resposta correta + resposta do aluno.
 * Impede que um conceito amplo (como "Bioquímica Celular: Água, Sais Minerais e Proteínas")
 * seja usado quando a questão avalia um subconceito específico (como "Pareamento complementar de bases nitrogenadas e antiparalelismo do DNA").
 */
function resolveSpecificQuestionSubconcept(
  question: ActivityQuestion,
  selectedOpt?: QuestionOption,
  correctOpt?: QuestionOption,
  discursiveAnswer?: string
): { subconcept: string; reviewTopicId: string; evidenceText: string } {
  const optionsText = (question.options || [])
    .map((o) => `${o.text} ${o.explanation || ""}`)
    .join(" ");
  const answerAndPromptNorm = `${question.prompt} ${optionsText} ${correctOpt?.text || ""} ${correctOpt?.explanation || ""} ${question.correctExplanation || ""} ${selectedOpt?.text || ""} ${selectedOpt?.explanation || ""} ${discursiveAnswer || ""}`.toLowerCase();
  const fullNorm = `${answerAndPromptNorm} ${question.title} ${question.contentTitle}`.toLowerCase();

  const strippedQuestionTitle = question.title
    .replace(/^Questão\s+\d+\s*[:—-]\s*/i, "")
    .replace(
      /^(Conceito Central|Cálculo e Aplicação de Fórmula em|Resolução de Problema Prático|Contextualização e Fundamentos de|Análise de Caso e Interpretação em|Estruturas e Etapas Biológicas em|Análise Fisiológica e Aplicação em|Estrutura e Funcionamento Prático de|Análise de Exemplo Prático em|Prevenção de Erros Frequentes em|Conexão com Pré-Requisito|Interpretação Contextualizada|Análise de Conceitos-Chave em|Raciocínio Didático e Aplicação de|Síntese Avançada de Teoria e Prática em|Questão Discursiva:\s*Análise Completa de)\s*[:—-]?\s*/i,
      ""
    )
    .trim();

  // 1. MATEMÁTICA
  if (question.disciplineId === "matematica") {
    if (
      answerAndPromptNorm.includes("discriminante") ||
      answerAndPromptNorm.includes("bhaskara") ||
      answerAndPromptNorm.includes("4ac") ||
      answerAndPromptNorm.includes("Δ") ||
      fullNorm.includes("discriminante") ||
      fullNorm.includes("bhaskara")
    ) {
      return {
        subconcept: "Cálculo do Discriminante (Δ = b² − 4ac)",
        reviewTopicId: "matematica-top-1",
        evidenceText: answerAndPromptNorm
      };
    }
    if (answerAndPromptNorm.includes("girard") || answerAndPromptNorm.includes("soma e produto") || fullNorm.includes("girard")) {
      return {
        subconcept: "Relações de Girard: Soma e Produto de Raízes",
        reviewTopicId: "matematica-top-3",
        evidenceText: answerAndPromptNorm
      };
    }
    if (
      answerAndPromptNorm.includes("fatoração") ||
      answerAndPromptNorm.includes("produtos notáveis") ||
      answerAndPromptNorm.includes("trinômio quadrado perfeito") ||
      answerAndPromptNorm.includes("diferença de dois quadrados")
    ) {
      return {
        subconcept: "Fatoração de Polinômios e Produtos Notáveis",
        reviewTopicId: "matematica-top-2",
        evidenceText: answerAndPromptNorm
      };
    }
    if (
      answerAndPromptNorm.includes("função afim") ||
      answerAndPromptNorm.includes("coeficiente angular") ||
      answerAndPromptNorm.includes("taxa de variação linear")
    ) {
      return {
        subconcept: "Função Afim (f(x) = ax + b) — Coeficiente Angular, Linear e Raiz",
        reviewTopicId: "matematica-top-11",
        evidenceText: answerAndPromptNorm
      };
    }
    if (answerAndPromptNorm.includes("logaritm") || fullNorm.includes("logaritm")) {
      return {
        subconcept: "Logaritmos — Definição e Propriedades Operatórias",
        reviewTopicId: question.contentId.startsWith("matematica-top-") ? question.contentId : "matematica-top-18",
        evidenceText: answerAndPromptNorm
      };
    }
    if (answerAndPromptNorm.includes("exponencial") || answerAndPromptNorm.includes("2^t") || fullNorm.includes("exponencial")) {
      return {
        subconcept: "Função e Equação Exponencial",
        reviewTopicId: question.contentId.startsWith("matematica-top-") ? question.contentId : "matematica-top-16",
        evidenceText: answerAndPromptNorm
      };
    }
    if (
      answerAndPromptNorm.includes("pitágoras") ||
      answerAndPromptNorm.includes("hipotenusa") ||
      answerAndPromptNorm.includes("cateto oposto") ||
      answerAndPromptNorm.includes("razões trigonométricas")
    ) {
      return {
        subconcept: "Teorema de Pitágoras e Razões Trigonométricas no Triângulo Retângulo",
        reviewTopicId: question.contentId.startsWith("matematica-top-") ? question.contentId : "matematica-top-21",
        evidenceText: answerAndPromptNorm
      };
    }
  }

  // 2. BIOLOGIA
  if (question.disciplineId === "biologia") {
    if (
      answerAndPromptNorm.includes("antiparalel") ||
      answerAndPromptNorm.includes("pareamento") ||
      answerAndPromptNorm.includes("dupla-hélice") ||
      answerAndPromptNorm.includes("dupla hélice") ||
      answerAndPromptNorm.includes("fita molde") ||
      answerAndPromptNorm.includes("3'-") ||
      answerAndPromptNorm.includes("5'-") ||
      answerAndPromptNorm.includes("3'→5'") ||
      answerAndPromptNorm.includes("5'→3'") ||
      answerAndPromptNorm.includes("uracila") ||
      answerAndPromptNorm.includes("timina") ||
      fullNorm.includes("pareamento de bases") ||
      fullNorm.includes("estrutura molecular do dna")
    ) {
      return {
        subconcept: "Pareamento complementar de bases nitrogenadas e antiparalelismo do DNA",
        reviewTopicId:
          question.contentId === "biologia-top-24" ||
          question.contentId === "biologia-top-22" ||
          question.contentId === "biologia-top-23"
            ? question.contentId
            : "biologia-top-21",
        evidenceText: answerAndPromptNorm
      };
    }
    if (
      answerAndPromptNorm.includes("calvin") ||
      answerAndPromptNorm.includes("rubisco") ||
      answerAndPromptNorm.includes("fixação de carbono") ||
      answerAndPromptNorm.includes("fixação do co₂") ||
      answerAndPromptNorm.includes("rubp") ||
      fullNorm.includes("calvin") ||
      fullNorm.includes("rubisco")
    ) {
      return {
        subconcept: "Fotossíntese — Ciclo de Calvin-Benson e Fixação de CO₂ pela RuBisCO",
        reviewTopicId: "biologia-top-12",
        evidenceText: answerAndPromptNorm
      };
    }
    if (
      answerAndPromptNorm.includes("fotólise") ||
      answerAndPromptNorm.includes("reação de hill") ||
      answerAndPromptNorm.includes("tilacoide") ||
      answerAndPromptNorm.includes("fase fotoquímica") ||
      fullNorm.includes("fase fotoquímica")
    ) {
      return {
        subconcept: "Fotossíntese — Fase Fotoquímica e Fotólise da Água nos Tilacoides",
        reviewTopicId: "biologia-top-11",
        evidenceText: answerAndPromptNorm
      };
    }
    if (
      answerAndPromptNorm.includes("glicólise") ||
      answerAndPromptNorm.includes("ciclo de krebs") ||
      answerAndPromptNorm.includes("fosforilação oxidativa") ||
      answerAndPromptNorm.includes("cadeia respiratória") ||
      answerAndPromptNorm.includes("fermentação")
    ) {
      return {
        subconcept: question.contentTitle.includes("Bioquímica")
          ? "Respiração Celular — Glicólise, Ciclo de Krebs e Fosforilação Oxidativa"
          : question.contentTitle,
        reviewTopicId:
          question.contentId === "biologia-top-15" ||
          question.contentId === "biologia-top-16" ||
          question.contentId === "biologia-top-17" ||
          question.contentId === "biologia-top-18"
            ? question.contentId
            : "biologia-top-14",
        evidenceText: answerAndPromptNorm
      };
    }
    if (
      answerAndPromptNorm.includes("osmose") ||
      answerAndPromptNorm.includes("hipertônic") ||
      answerAndPromptNorm.includes("hipotônic") ||
      answerAndPromptNorm.includes("bomba de sódio") ||
      answerAndPromptNorm.includes("mosaico fluido")
    ) {
      return {
        subconcept: "Transporte através da Membrana Plasmática — Osmose, Difusão e Transporte Ativo",
        reviewTopicId:
          question.contentId === "biologia-top-4" || question.contentId === "biologia-top-6"
            ? question.contentId
            : "biologia-top-5",
        evidenceText: answerAndPromptNorm
      };
    }
  }

  // 3. GEOGRAFIA
  if (question.disciplineId === "geografia") {
    if (
      answerAndPromptNorm.includes("tipos climáticos") ||
      answerAndPromptNorm.includes("semiárido") ||
      answerAndPromptNorm.includes("subtropical") ||
      answerAndPromptNorm.includes("tropical típico") ||
      answerAndPromptNorm.includes("amplitude térmica") ||
      fullNorm.includes("tipos climáticos do brasil")
    ) {
      return {
        subconcept: "Tipos Climáticos do Brasil",
        reviewTopicId: "geografia-top-13",
        evidenceText: answerAndPromptNorm
      };
    }
    if (
      answerAndPromptNorm.includes("conurbação") ||
      answerAndPromptNorm.includes("metropolização") ||
      answerAndPromptNorm.includes("macrocefalia urbana")
    ) {
      return {
        subconcept: "Conurbação, Metropolização e Regiões Metropolitanas",
        reviewTopicId: "geografia-top-33",
        evidenceText: answerAndPromptNorm
      };
    }
  }

  // 4. SOCIOLOGIA
  if (question.disciplineId === "sociologia") {
    if (
      answerAndPromptNorm.includes("fato social") ||
      answerAndPromptNorm.includes("coercitividade") ||
      answerAndPromptNorm.includes("exterioridade") ||
      answerAndPromptNorm.includes("generalidade") ||
      fullNorm.includes("fato social")
    ) {
      return {
        subconcept: "Fato Social — coercitividade, exterioridade e generalidade",
        reviewTopicId: "sociologia-top-3",
        evidenceText: answerAndPromptNorm
      };
    }
    if (
      answerAndPromptNorm.includes("uberização") ||
      answerAndPromptNorm.includes("plataformização") ||
      fullNorm.includes("uberização")
    ) {
      return {
        subconcept: "Uberização e Plataformização do Trabalho",
        reviewTopicId: "sociologia-top-45",
        evidenceText: answerAndPromptNorm
      };
    }
    if (
      answerAndPromptNorm.includes("mais-valia") ||
      answerAndPromptNorm.includes("materialismo histórico") ||
      answerAndPromptNorm.includes("luta de classes")
    ) {
      return {
        subconcept: question.contentTitle,
        reviewTopicId: question.contentId.startsWith("sociologia-top-") ? question.contentId : "sociologia-top-6",
        evidenceText: answerAndPromptNorm
      };
    }
  }

  // 5. HISTÓRIA
  if (question.disciplineId === "historia") {
    if (
      answerAndPromptNorm.includes("revolução francesa") ||
      answerAndPromptNorm.includes("queda da bastilha") ||
      answerAndPromptNorm.includes("jacobinos") ||
      answerAndPromptNorm.includes("girondinos") ||
      answerAndPromptNorm.includes("antigo regime") ||
      fullNorm.includes("revolução francesa")
    ) {
      return {
        subconcept: "Revolução Francesa",
        reviewTopicId: question.contentId === "historia-top-34" ? "historia-top-34" : "historia-top-33",
        evidenceText: answerAndPromptNorm
      };
    }
    if (
      answerAndPromptNorm.includes("era vargas") ||
      answerAndPromptNorm.includes("revolução de 1930") ||
      answerAndPromptNorm.includes("constitucionalista de 1932") ||
      answerAndPromptNorm.includes("estado novo")
    ) {
      return {
        subconcept: "Era Vargas (1930–1945) — Revolução de 1930, CLT e Estado Novo",
        reviewTopicId: "historia-top-48",
        evidenceText: answerAndPromptNorm
      };
    }
  }

  // Demais disciplinas e tópicos: usa o subconceito específico da questão sem concatenar listas genéricas
  const fallbackSubconcept =
    strippedQuestionTitle &&
    !strippedQuestionTitle.toLowerCase().startsWith("análise ") &&
    !strippedQuestionTitle.toLowerCase().startsWith("interpretação ") &&
    !strippedQuestionTitle.toLowerCase().startsWith("raciocínio ") &&
    !strippedQuestionTitle.toLowerCase().startsWith("síntese ")
      ? strippedQuestionTitle
      : question.contentTitle;

  return {
    subconcept: fallbackSubconcept,
    reviewTopicId: question.contentId,
    evidenceText: answerAndPromptNorm
  };
}

/**
 * Diagnóstica especificamente o erro cometido pelo aluno na questão atual e gera:
 * 1) Feedback Pedagógico detalhado (Resposta correta, por que é correta, onde está o erro na resposta do aluno usando o conteúdo da questão, e explicação curta e didática antes do nivelamento);
 * 2) Micro-Nivelamento contextualizado seguindo estritamente o fluxo:
 *    QUESTÃO -> RESPOSTA DO ALUNO -> ERRO IDENTIFICADO -> CONCEITO COM DIFICULDADE -> EXPLICAÇÃO (Pré-requisito + Exemplo Simples) -> EXERCÍCIO DE REFORÇO -> REVISAR
 */
export function diagnoseQuestionErrorAndBuildLeveling(
  question: ActivityQuestion,
  selectedOptionId: string | null,
  discursiveAnswer?: string
): ErrorFeedbackAndMicroLeveling {
  const options = question.options || [];
  const selectedIdx = options.findIndex((o) => o.id === selectedOptionId);
  const selectedOpt = selectedIdx >= 0 ? options[selectedIdx] : undefined;
  const correctIdx = options.findIndex((o) => o.isCorrect);
  const correctOpt = correctIdx >= 0 ? options[correctIdx] : undefined;

  const { subconcept, reviewTopicId, evidenceText } = resolveSpecificQuestionSubconcept(
    question,
    selectedOpt,
    correctOpt,
    discursiveAnswer
  );

  // Obtém o conhecimento de domínio estritamente para o subconceito identificado na questão
  const domain = getTopicDomainKnowledge(
    question.disciplineId,
    subconcept,
    question.disciplineName,
    undefined,
    evidenceText
  );

  const studentAnswerLabel =
    question.type === "objective" && selectedIdx >= 0
      ? `Alternativa ${String.fromCharCode(65 + selectedIdx)}`
      : "Resposta Discursiva Enviada";

  const studentAnswerText =
    question.type === "objective"
      ? selectedOpt?.text || "Nenhuma alternativa selecionada"
      : discursiveAnswer?.trim() || "Texto discursivo incompleto";

  const correctAnswerLabel =
    question.type === "objective" && correctIdx >= 0
      ? `Alternativa ${String.fromCharCode(65 + correctIdx)}`
      : "Resposta-Modelo Esperada";

  const correctAnswerText =
    question.type === "objective"
      ? correctOpt?.text || question.correctExplanation
      : question.correctExplanation;

  // Explicação de por que a resposta correta é correta (construída exclusivamente a partir da questão, alternativas e subconceito avaliado)
  const rawCorrectOptExp = (correctOpt?.explanation || "").replace(/^(Correto!|Perfeito!|Exato!|Excelente!|Muito bem!)\s*/i, "");
  const whyCorrectExplanation =
    rawCorrectOptExp && !question.correctExplanation.includes(rawCorrectOptExp.slice(0, 35))
      ? `${question.correctExplanation} ${rawCorrectOptExp}`
      : question.correctExplanation;

  // Explicação específica de onde está o erro da resposta do aluno (usando o próprio conteúdo da questão)
  const rawStudentOptExp = (selectedOpt?.explanation || "").replace(/^(Incorreto|Quase|Não)[\.:!]?\s*/i, "");

  const isBhaskaraOrDiscriminant =
    domain.disciplineId === "matematica" &&
    subconcept === "Cálculo do Discriminante (Δ = b² − 4ac)";

  // O mesmo subconceito exato é usado em todo o Feedback Pedagógico e Micro-Nivelamento
  const conceptWithDifficulty = subconcept;
  let prerequisiteConcept: string;
  let prerequisiteExplanation: string;
  let simpleWorkedExample: string;

  if (isBhaskaraOrDiscriminant) {
    prerequisiteConcept =
      "Identificação dos coeficientes a, b e c e aplicação correta da fórmula do discriminante (Δ = b² − 4ac)";
    prerequisiteExplanation = `Para calcular corretamente o discriminante e as raízes reais em "${conceptWithDifficulty}", você precisa dominar diretamente a identificação dos coeficientes reais a (que acompanha x²), b (que acompanha x) e c (termo independente) com seus sinais e aplicar Δ = b² − 4ac: 1º) Eleve b ao quadrado, lembrando que todo número negativo ao quadrado é positivo ((−b)² > 0); 2º) Calcule o produto 4·a·c e subtraia de b²; 3º) Substitua Δ na fórmula de Bhaskara x = (−b ± √Δ) / (2a), invertendo o sinal de b em −b.`;
    simpleWorkedExample = `Exemplo simples do mesmo conceito (${conceptWithDifficulty}): Dada a equação 2x² − 8x + 6 = 0, identificamos os coeficientes a = 2, b = −8 e c = 6. Aplicamos Δ = b² − 4ac: calculamos b² = (−8)² = +64 e subtraímos 4·a·c = 4 · 2 · 6 = 48, obtendo Δ = 64 − 48 = 16. Em seguida, x = (−(−8) ± √16) / (2·2) = (8 ± 4) / 4, resultando nas raízes reais x₁ = 3 e x₂ = 1.`;
  } else {
    prerequisiteConcept = domain.prerequisiteTitle;
    prerequisiteExplanation = `Para superar a dificuldade identificada em "${conceptWithDifficulty}" (${question.disciplineName}), o pré-requisito diretamente necessário é "${prerequisiteConcept}": ${domain.coreDefinition} Procedimento específico do conceito: ${domain.mechanismsAndProcesses}`;
    simpleWorkedExample = `Exemplo simples do mesmo conceito (${conceptWithDifficulty}): ${domain.practicalExamples[0]}`;
  }

  const specificErrorExplanation =
    question.type === "objective" && selectedOpt
      ? isBhaskaraOrDiscriminant
        ? `Aplicação incorreta de Δ = b² − 4ac no conceito "${conceptWithDifficulty}": você marcou a ${studentAnswerLabel} ("${selectedOpt.text}"). Por que está errado: ${
            rawStudentOptExp || domain.mistakeCorrection
          } A resposta correta é a ${correctAnswerLabel} ("${correctAnswerText}"), pois resolve a questão aplicando corretamente: ${whyCorrectExplanation}`
        : `Na avaliação do conceito "${conceptWithDifficulty}", você marcou a ${studentAnswerLabel} ("${selectedOpt.text}"). Por que está errado: ${
            rawStudentOptExp || domain.mistakeCorrection
          } A resposta correta é a ${correctAnswerLabel} ("${correctAnswerText}"), que resolve o enunciado porque: ${whyCorrectExplanation}`
      : `Sua resposta ("${studentAnswerText.slice(0, 90)}...") apresentou dificuldade no conceito "${conceptWithDifficulty}". O enunciado exige explicar: ${whyCorrectExplanation}`;

  // Explicação curta e didática antes do micro-nivelamento (focada estritamente em corrigir o erro no subconceito da questão atual)
  let shortDidacticCorrection = "";
  if (isBhaskaraOrDiscriminant) {
    shortDidacticCorrection = `Passo a passo para corrigir este erro em "${conceptWithDifficulty}" (ax² + bx + c = 0): 1º) Identifique os coeficientes a, b e c com seus sinais e calcule o discriminante Δ = b² - 4·a·c (lembrando que (-b)² é sempre positivo e que você deve subtrair 4ac); 2º) Substitua na fórmula de Bhaskara x = (-b ± √Δ) / (2·a), invertendo o sinal de b em -b; 3º) Calcule separadamente as duas raízes x₁ = (-b + √Δ)/(2a) e x₂ = (-b - √Δ)/(2a). Nesta questão: ${whyCorrectExplanation}`;
  } else if (domain.formulaOrSyntax) {
    shortDidacticCorrection = `Como corrigir este erro em "${conceptWithDifficulty}" (${question.disciplineName}): aplique ${domain.formulaOrSyntax} (${domain.formulaInterpretation || ""}). ${domain.mistakeCorrection} Na questão atual: ${whyCorrectExplanation}`;
  } else {
    shortDidacticCorrection = `Como corrigir este erro em "${conceptWithDifficulty}" (${question.disciplineName}): ${domain.mistakeCorrection} Aplicando diretamente à questão atual: ${whyCorrectExplanation}`;
  }

  // Exercício de reforço que verifica se o aluno realmente corrigiu a dificuldade no mesmo subconceito
  const reinforcementQuestion = buildConceptReinforcementQuestion(
    domain,
    question.id,
    selectedIdx >= 0 ? selectedIdx + 1 : 1,
    conceptWithDifficulty
  );

  return {
    disciplineId: question.disciplineId,
    disciplineName: question.disciplineName,
    topicId: reviewTopicId,
    topicTitle: conceptWithDifficulty,
    moduleTitle: domain.moduleTitle,
    questionTitle: conceptWithDifficulty,
    questionPrompt: question.prompt,
    studentAnswerLabel,
    studentAnswerText,
    correctAnswerLabel,
    correctAnswerText,
    whyCorrectExplanation,
    specificErrorExplanation,
    shortDidacticCorrection,
    formulaOrConceptHighlight: domain.formulaOrSyntax,
    conceptWithDifficulty,
    prerequisiteConcept,
    prerequisiteExplanation,
    simpleWorkedExample,
    reinforcementQuestion
  };
}

function getCalculationScenario(domain: TopicDomainKnowledge, topicTitle: string) {
  const norm = topicTitle.toLowerCase();

  if (domain.disciplineId === "matematica") {
    if (norm.includes("bhaskara") || norm.includes("2º grau") || norm.includes("quadrática") || norm.includes("girard") || norm.includes("fatoração")) {
      return {
        calc1Prompt: `Considere a equação do 2º grau x² - 7x + 10 = 0, relacionada ao estudo de "${topicTitle}". Aplicando a fórmula resolutiva de Bhaskara (Δ = b² - 4ac e x = (-b ± √Δ)/2a) ou as relações de soma e produto de Girard, quais são o valor do discriminante Δ e o conjunto solução real S?`,
        calc1Correct: "Δ = 9 e conjunto solução S = {2, 5}",
        calc1Exp: "Para x² - 7x + 10 = 0, temos a = 1, b = -7 e c = 10. O discriminante é Δ = (-7)² - 4·1·10 = 49 - 40 = 9. Substituindo na fórmula de Bhaskara: x = (-(-7) ± √9)/(2·1) = (7 ± 3)/2, resultando nas raízes x₁ = (7+3)/2 = 5 e x₂ = (7-3)/2 = 2.",
        calc1Dist: [
          { text: "Δ = 9 e conjunto solução S = {-2, -5}", exp: "Você calculou Δ = 9 corretamente, mas esqueceu de inverter o sinal de b = -7 no termo -b da fórmula: -(-7) = +7 (positivo), o que gera raízes positivas {2, 5} em vez de {-2, -5}." },
          { text: "Δ = 89 e conjunto solução S = {1, 10}", exp: "No cálculo de Δ = b² - 4ac, como a = 1 e c = 10 são positivos, você deve subtrair 4·1·10 = 40 de 49 (49 - 40 = 9), e não somar 49 + 40 = 89." },
          { text: "Δ = -9 e a equação não possui raízes reais", exp: "Ao elevar b = -7 ao quadrado, (-7)² = (-7)·(-7) = +49 positivo (e não -49); logo Δ = 49 - 40 = +9 > 0, existindo duas raízes reais distintas." }
        ],
        calc2Prompt: `Em um problema prático de "${topicTitle}", um terreno retangular possui lados medindo x metros e (x + 3) metros, totalizando uma área de 28 m² (ou seja, x(x + 3) = 28 ⟹ x² + 3x - 28 = 0). Qual é a medida real do lado menor x desse terreno?`,
        calc2Correct: "x = 4 metros (pois 4 · (4 + 3) = 4 · 7 = 28 m²)",
        calc2Exp: "Na equação x² + 3x - 28 = 0 (a = 1, b = 3, c = -28): Δ = 3² - 4(1)(-28) = 9 + 112 = 121 (√121 = 11). Pela fórmula de Bhaskara: x = (-3 ± 11)/2, gerando x₁ = 4 e x₂ = -7. Como medida geométrica de lado não pode ser negativa, x = 4 m.",
        calc2Dist: [
          { text: "x = -7 metros", exp: "Embora x = -7 anule algebricamente a equação x² + 3x - 28 = 0, um comprimento geométrico de terreno deve ser estritamente positivo (x > 0), portanto adota-se a raiz x = 4 metros." },
          { text: "x = 7 metros (pois 7 · 10 = 70 m²)", exp: "7 metros corresponde à medida do lado maior (x + 3 = 4 + 3 = 7 m). O enunciado pede o lado menor x, que mede 4 metros." },
          { text: "x = 3 metros (pois 3 · 6 = 18 m²)", exp: "Se x fosse 3 m, a área seria 3 · (3 + 3) = 18 m², e não os 28 m² exigidos pelo problema." }
        ]
      };
    }

    if (norm.includes("funç") || norm.includes("afim") || norm.includes("exponencial") || norm.includes("logaritm") || norm.includes("progress")) {
      return {
        calc1Prompt: `No estudo de "${topicTitle}", considere a função afim f(x) = 3x - 12. Quais são, respectivamente, o coeficiente angular (taxa de variação), o ponto de interseção com o eixo vertical y (quando x = 0) e a raiz ou zero da função (quando f(x) = 0)?`,
        calc1Correct: "Coeficiente angular a = 3, interseção em y = -12 e raiz x = 4",
        calc1Exp: "Em f(x) = 3x - 12: a taxa de variação que multiplica x é a = 3 (crescente); para x = 0 temos f(0) = 3(0) - 12 = -12; e igualando 3x - 12 = 0 obtemos 3x = 12 ⟹ x = 12/3 = 4.",
        calc1Dist: [
          { text: "Coeficiente angular a = -12, interseção em y = 3 e raiz x = -4", exp: "Você trocou os papéis dos coeficientes: 'a' é quem multiplica x (a = 3) e 'b' é o termo independente (b = -12)." },
          { text: "Coeficiente angular a = 3, interseção em y = -12 e raiz x = -4", exp: "Ao resolver 3x - 12 = 0, o termo -12 passa para o segundo membro com sinal positivo: 3x = +12 ⟹ x = +4 (e não -4)." },
          { text: "Coeficiente angular a = 4, interseção em y = 0 e raiz x = 3", exp: "Você confundiu o valor da raiz (x = 4) com o coeficiente angular (a = 3) e esqueceu que f(0) = -12." }
        ],
        calc2Prompt: `Aplicando os conceitos de crescimento e funções estudados em "${topicTitle}": uma cultura inicial de 500 bactérias dobra sua população a cada hora segundo a lei N(t) = 500 · 2^t. Após t = 4 horas, qual será a população total N(4)?`,
        calc2Correct: "N(4) = 8.000 bactérias (pois 500 · 2⁴ = 500 · 16 = 8.000)",
        calc2Exp: "Substituindo t = 4 na função exponencial N(t) = 500 · 2^t, resolvemos primeiro a potência 2⁴ = 2·2·2·2 = 16 e depois multiplicamos pelo valor inicial 500: 500 · 16 = 8.000 bactérias.",
        calc2Dist: [
          { text: "N(4) = 4.000 bactérias (calculando 500 · 2 · 4)", exp: "Você multiplicou a base pelo expoente (2 · 4 = 8) em vez de calcular a potência 2⁴ = 2·2·2·2 = 16. O correto é 500 · 16 = 8.000." },
          { text: "N(4) = 2.000 bactérias (somando 500 a cada hora)", exp: "Como a população dobra a cada hora, trata-se de uma progressão geométrica/exponencial (multiplicação por 2^t), e não de soma constante." },
          { text: "N(4) = 16.000 bactérias (calculando 500 · 2⁵)", exp: "Você utilizou o expoente t = 5 (2⁵ = 32) em vez do tempo t = 4 horas informado no enunciado (2⁴ = 16)." }
        ]
      };
    }

    if (norm.includes("trigonometr") || norm.includes("seno") || norm.includes("cosseno") || norm.includes("triângulo") || norm.includes("geometria") || norm.includes("poliedro") || norm.includes("prisma") || norm.includes("pirâmide") || norm.includes("cilindro") || norm.includes("cone") || norm.includes("esfera") || norm.includes("euler")) {
      return {
        calc1Prompt: `No contexto de "${topicTitle}", uma rampa retilínea de acesso possui cateto horizontal (base) medindo 8 metros e cateto vertical (altura) medindo 6 metros. Aplicando o Teorema de Pitágoras (a² = b² + c²) e as razões trigonométricas, qual é o comprimento da hipotenusa da rampa e o seno do ângulo de inclinação θ?`,
        calc1Correct: "Hipotenusa = 10 m e sen(θ) = 6/10 = 0,6",
        calc1Exp: "Pelo Teorema de Pitágoras: a² = 6² + 8² = 36 + 64 = 100 ⟹ a = √100 = 10 m. O seno de θ é a razão entre o cateto oposto (altura = 6 m) e a hipotenusa (10 m): sen(θ) = 6/10 = 0,6.",
        calc1Dist: [
          { text: "Hipotenusa = 14 m e sen(θ) = 6/14", exp: "Você somou diretamente os catetos (6 + 8 = 14 m) em vez de somar os seus quadrados e extrair a raiz quadrada: √(6² + 8²) = √100 = 10 m." },
          { text: "Hipotenusa = 10 m e sen(θ) = 8/10 = 0,8", exp: "Você usou o cateto adjacente (8 m) no numerador, o que calcula o cosseno (cos θ = 0,8); o seno exige o cateto oposto (altura = 6 m): sen θ = 6/10 = 0,6." },
          { text: "Hipotenusa = 100 m e sen(θ) = 0,06", exp: "Você encontrou a² = 100, mas esqueceu de extrair a raiz quadrada no final para obter a = √100 = 10 m." }
        ],
        calc2Prompt: `Aplicando os cálculos métricos de "${topicTitle}": um reservatório em formato de prisma reto de base retangular possui dimensões de 4 m de comprimento, 3 m de largura e 2,5 m de altura. Qual é o volume total desse reservatório em metros cúbicos (m³) e em litros?`,
        calc2Correct: "Volume = 30 m³, o que equivale a 30.000 litros",
        calc2Exp: "O volume do bloco retangular é V = comprimento × largura × altura = 4 · 3 · 2,5 = 30 m³. Como cada 1 m³ equivale a 1.000 litros, temos 30 × 1.000 = 30.000 litros.",
        calc2Dist: [
          { text: "Volume = 9,5 m³, o que equivale a 9.500 litros", exp: "Você somou as três dimensões (4 + 3 + 2,5 = 9,5) em vez de multiplicá-las (4 × 3 × 2,5 = 30 m³)." },
          { text: "Volume = 10 m³, o que equivale a 10.000 litros", exp: "Você dividiu o volume por 3 (30 / 3 = 10 m³), regra que só se aplica a pirâmides e cones, não a prismas retos." },
          { text: "Volume = 30 m³, o que equivale a 300 litros", exp: "Erro na conversão de m³ para litros: 1 m³ contém 1.000 litros (e não 10 litros), portanto 30 m³ = 30.000 L." }
        ]
      };
    }

    return {
      calc1Prompt: `No estudo de "${topicTitle}", as notas de 5 estudantes em uma avaliação foram: 8, 5, 10, 7 e 5. Calculando as medidas de tendência central (média aritmética, mediana e moda), quais valores são obtidos?`,
      calc1Correct: "Média = 7,0 | Mediana = 7,0 | Moda = 5,0",
      calc1Exp: "Média = (8 + 5 + 10 + 7 + 5) / 5 = 35 / 5 = 7,0. Ordenando o rol crescente (5, 5, 7, 8, 10), o termo central (3º valor) é a Mediana = 7,0. O valor que mais se repete é a Moda = 5,0.",
      calc1Dist: [
        { text: "Média = 7,0 | Mediana = 10,0 | Moda = 5,0", exp: "Você pegou o 3º número da lista desordenada (10) como mediana; é obrigatório ordenar os dados primeiro (5, 5, 7, 8, 10) para encontrar o termo central 7,0." },
        { text: "Média = 8,75 | Mediana = 7,0 | Moda = 10,0", exp: "Você dividiu a soma 35 por 4 em vez de 5 notas na média, e confundiu a moda (valor mais frequente = 5,0) com a maior nota (10,0)." },
        { text: "Média = 5,0 | Mediana = 5,0 | Moda = 7,0", exp: "Você trocou os conceitos: 5,0 é a moda (aparece duas vezes), enquanto 7,0 é tanto a média aritmética quanto a mediana." }
      ],
      calc2Prompt: `Em um problema de contagem e probabilidade de "${topicTitle}", uma turma de 6 estudantes precisa escolher uma dupla de representantes (sem distinção de cargo entre os dois). Quantas duplas distintas podem ser formadas e qual a probabilidade de dois colegas específicos estarem juntos nessa dupla?`,
      calc2Correct: "15 duplas possíveis (C₆,₂ = 15) e probabilidade P = 1/15",
      calc2Exp: "Como a ordem não diferencia a dupla, usamos Combinação: C(6,2) = (6 · 5) / 2! = 30 / 2 = 15 duplas. A probabilidade de uma dupla específica ser escolhida é P = 1/15.",
      calc2Dist: [
        { text: "30 duplas possíveis (A₆,₂ = 30) e probabilidade P = 1/30", exp: "Você usou Arranjo (6 · 5 = 30) sem dividir por 2!; como a dupla {A, B} é igual a {B, A}, devemos dividir por 2, obtendo 15 duplas." },
        { text: "12 duplas possíveis (6 × 2) e probabilidade P = 1/12", exp: "Na combinação C(6,2) multiplicamos os dois fatores decrescentes 6 × 5 e dividimos por 2 (resultando em 15), e não 6 × 2." },
        { text: "36 duplas possíveis (6²) e probabilidade P = 1/36", exp: "O cálculo 6² = 36 permitiria repetir a mesma pessoa duas vezes na dupla e contaria a ordem; o correto é C(6,2) = 15." }
      ]
    };
  }

  if (domain.disciplineId === "fisica") {
    if (norm.includes("mru") || norm.includes("velocidade") || norm.includes("torricelli") || norm.includes("queda") || norm.includes("cinemática") || norm.includes("lançamento")) {
      return {
        calc1Prompt: `Em um problema de Cinemática sobre "${topicTitle}", um móvel parte com velocidade inicial v₀ = 10 m/s e acelera uniformemente à razão constante de a = 3 m/s² durante t = 4 segundos. Quais são a velocidade final v atingida e o deslocamento Δs percorrido nesse intervalo?`,
        calc1Correct: "Velocidade final v = 22 m/s e deslocamento Δs = 64 metros",
        calc1Exp: "Pela função da velocidade: v = v₀ + a·t = 10 + 3·4 = 22 m/s. Pela função horária da posição no MRUV: Δs = v₀·t + ½·a·t² = 10·4 + ½·3·(4²) = 40 + 24 = 64 metros.",
        calc1Dist: [
          { text: "Velocidade final v = 12 m/s e deslocamento Δs = 48 metros", exp: "Você calculou apenas a·t = 3·4 = 12 m/s e esqueceu de somar a velocidade inicial v₀ = 10 m/s na fórmula v = v₀ + a·t." },
          { text: "Velocidade final v = 22 m/s e deslocamento Δs = 88 metros", exp: "Você multiplicou a velocidade final pelo tempo (22 · 4 = 88 m) como se a velocidade fosse constante; no MRUV deve-se usar Δs = v₀·t + ½·a·t² = 64 m." },
          { text: "Velocidade final v = 30 m/s e deslocamento Δs = 40 metros", exp: "No cálculo do deslocamento você considerou apenas v₀·t = 40 m e esqueceu de somar a parcela da aceleração ½·a·t² = 24 m." }
        ],
        calc2Prompt: `Um motorista trafega a 108 km/h quando avista um obstáculo e aciona os freios, imprimindo uma desaceleração constante de módulo 5 m/s² até parar completamente (v = 0). Convertendo a velocidade para o SI e aplicando a Equação de Torricelli (v² = v₀² + 2·a·Δs), qual é a distância mínima de frenagem?`,
        calc2Correct: "v₀ = 30 m/s e distância de frenagem Δs = 90 metros",
        calc2Exp: "Convertendo para o SI: v₀ = 108 / 3,6 = 30 m/s. Aplicando Torricelli (v² = v₀² + 2·a·Δs): 0² = 30² + 2·(-5)·Δs ⟹ 0 = 900 - 10·Δs ⟹ Δs = 900 / 10 = 90 metros.",
        calc2Dist: [
          { text: "v₀ = 108 m/s e distância de frenagem Δs = 1.166,4 metros", exp: "Você aplicou 108 km/h diretamente na fórmula sem dividir por 3,6 para converter para metros por segundo (30 m/s)." },
          { text: "v₀ = 30 m/s e distância de frenagem Δs = 180 metros", exp: "Na Equação de Torricelli o termo é 2·a·Δs = 2·(-5)·Δs = -10·Δs; você dividiu 900 apenas por 5 em vez de dividir por 2·5 = 10." },
          { text: "v₀ = 30 m/s e distância de frenagem Δs = 6 metros", exp: "O valor 30 / 5 = 6 s representa o tempo de frenagem (em segundos), e não a distância percorrida Δs = 90 metros." }
        ]
      };
    }

    if (norm.includes("newton") || norm.includes("força") || norm.includes("inércia") || norm.includes("atrito") || norm.includes("trabalho") || norm.includes("energia") || norm.includes("potência")) {
      return {
        calc1Prompt: `Aplicando as Leis de Newton e a Dinâmica estudadas em "${topicTitle}": uma caixa de massa m = 8 kg apoiada em uma superfície horizontal recebe uma força horizontal F = 50 N para a direita, enquanto atua uma força de atrito cinético F_at = 18 N para a esquerda. Qual é o módulo da força resultante F_R e a aceleração adquirida pela caixa?`,
        calc1Correct: "Força resultante F_R = 32 N e aceleração a = 4,0 m/s²",
        calc1Exp: "Como F e F_at têm sentidos contrários, F_R = 50 - 18 = 32 N. Pela 2ª Lei de Newton (F_R = m · a), isolamos a aceleração: a = 32 / 8 = 4,0 m/s².",
        calc1Dist: [
          { text: "Força resultante F_R = 68 N e aceleração a = 8,5 m/s²", exp: "Você somou a força de atrito (50 + 18 = 68 N) em vez de subtraí-la; como o atrito se opõe ao movimento, F_R = 50 - 18 = 32 N." },
          { text: "Força resultante F_R = 50 N e aceleração a = 6,25 m/s²", exp: "Você desconsiderou a força de atrito F_at = 18 N que atua em sentido contrário à força F = 50 N." },
          { text: "Força resultante F_R = 32 N e aceleração a = 256 m/s²", exp: "Na 2ª Lei de Newton (F_R = m · a), para encontrar a aceleração deve-se dividir a força resultante pela massa (32 / 8 = 4 m/s²), e não multiplicar." }
        ],
        calc2Prompt: `No estudo de Trabalho e Energia Mecânica relacionado a "${topicTitle}", qual é a energia cinética (E_c = ½ · m · v²) de um automóvel de massa m = 1.000 kg movendo-se a v = 20 m/s (72 km/h)?`,
        calc2Correct: "E_c = 200.000 J (ou 200 kJ)",
        calc2Exp: "Substituindo m = 1.000 kg e v = 20 m/s na fórmula E_c = ½ · m · v²: E_c = 0,5 · 1.000 · (20²) = 500 · 400 = 200.000 J = 200 kJ.",
        calc2Dist: [
          { text: "E_c = 10.000 J (ou 10 kJ)", exp: "Você calculou ½ · 1.000 · 20 sem elevar a velocidade ao quadrado (20² = 400)." },
          { text: "E_c = 400.000 J (ou 400 kJ)", exp: "Você multiplicou m · v² = 1.000 · 400 = 400.000, mas esqueceu de dividir por 2 conforme a fórmula E_c = (m · v²) / 2." },
          { text: "E_c = 20.000 J (ou 20 kJ)", exp: "Você calculou m · v = 1.000 · 20 (que é a quantidade de movimento), e não a energia cinética ½ · m · v² = 200.000 J." }
        ]
      };
    }

    return {
      calc1Prompt: `No estudo de Eletrodinâmica e Física em "${topicTitle}", um resistor ôhmico de resistência R = 20 Ω é submetido a uma tensão elétrica U = 120 V. Aplicando a 1ª Lei de Ohm (U = R · i) e a fórmula da potência elétrica (P = U · i), quais são a corrente elétrica i e a potência dissipada P?`,
      calc1Correct: "Corrente elétrica i = 6 A e potência dissipada P = 720 W",
      calc1Exp: "Pela 1ª Lei de Ohm: i = U / R = 120 / 20 = 6 A. Pela potência elétrica: P = U · i = 120 · 6 = 720 Watts.",
      calc1Dist: [
        { text: "Corrente elétrica i = 2.400 A e potência dissipada P = 288 kW", exp: "Na 1ª Lei de Ohm (U = R · i), para isolar a corrente elétrica divide-se a tensão pela resistência (i = 120 / 20 = 6 A), e não se multiplica." },
        { text: "Corrente elétrica i = 6 A e potência dissipada P = 20 W", exp: "Para calcular a potência P = U · i, multiplica-se a tensão (120 V) pela corrente (6 A), obtendo 720 W." },
        { text: "Corrente elétrica i = 0,16 A e potência dissipada P = 20 W", exp: "Você inverteu a divisão ao calcular R / U (20 / 120) em vez de i = U / R (120 / 20 = 6 A)." }
      ],
      calc2Prompt: `Um aparelho elétrico de potência P = 1.500 W (1,5 kW) permanece ligado durante Δt = 4 horas por dia. Qual é o consumo diário de energia elétrica (E = P · Δt) desse aparelho em quilowatt-hora (kWh)?`,
      calc2Correct: "Consumo diário E = 6,0 kWh",
      calc2Exp: "Convertendo a potência para quilowatts: 1.500 W = 1,5 kW. Multiplicando pelo tempo em horas: E = P · Δt = 1,5 kW · 4 h = 6,0 kWh.",
      calc2Dist: [
        { text: "Consumo diário E = 6.000 kWh", exp: "6.000 é o valor em Watt-hora (Wh); para expressar em quilowatt-hora (kWh), é obrigatório dividir por 1.000, obtendo 6,0 kWh." },
        { text: "Consumo diário E = 0,375 kWh", exp: "O consumo de energia é o produto da potência pelo tempo (E = P · Δt = 1,5 × 4 = 6,0 kWh), e não a divisão." },
        { text: "Consumo diário E = 5,5 kWh", exp: "Você somou 1,5 + 4 = 5,5 em vez de multiplicar P · Δt = 1,5 × 4 = 6,0 kWh." }
      ]
    };
  }

  // Robótica
  return {
    calc1Prompt: `Em uma montagem prática de Robótica sobre "${topicTitle}", deseja-se ligar um LED vermelho (tensão nominal V_LED = 2,0 V e corrente máxima i = 15 mA = 0,015 A) em uma porta digital de 5,0 V do Arduino Uno. Aplicando a Lei de Ohm (R = (V_fonte - V_LED) / i), qual resistor limitador deve ser utilizado em série?`,
    calc1Correct: "R = 200 Ω (pois (5,0 - 2,0) / 0,015 = 3,0 / 0,015 = 200 Ω)",
    calc1Exp: "A queda de tensão que deve ficar sobre o resistor é V_R = 5,0 - 2,0 = 3,0 V. Convertendo 15 mA para 0,015 A e aplicando R = V_R / i: R = 3,0 / 0,015 = 200 Ω.",
    calc1Dist: [
      { text: "R = 333 Ω (calculando 5,0 / 0,015 sem descontar a tensão do LED)", exp: "Você esqueceu de subtrair a tensão própria do LED (2,0 V) da tensão da porta do Arduino (5,0 V) antes de dividir pela corrente." },
      { text: "R = 0,2 Ω (dividindo 3,0 V por 15 sem converter mA para Ampère)", exp: "Na Lei de Ohm a corrente deve estar em Ampères: 15 mA = 15 / 1000 = 0,015 A (logo 3,0 / 0,015 = 200 Ω)." },
      { text: "Não é necessário resistor, pois a porta digital do Arduino limita sozinha em 15 mA", exp: "Ligar o LED diretamente nos 5 V sem resistor limitador provoca sobrecorrente e queima o LED e a saída digital do microcontrolador." }
    ],
    calc2Prompt: `No controle de motores e leitura de sensores em "${topicTitle}" com Arduino Uno: se o comando analogWrite(pinoMotor, 191) é executado em uma saída PWM (escala de 0 a 255), qual é aproximadamente o ciclo de trabalho (Duty Cycle) aplicado ao motor?`,
    calc2Correct: "Aproximadamente 75% da potência máxima (pois 191 / 255 ≈ 0,75 = 75%)",
    calc2Exp: "A saída PWM de 8 bits do Arduino varia de 0 (0%) a 255 (100%). Portanto, Duty Cycle = (191 / 255) × 100% ≈ 75%.",
    calc2Dist: [
      { text: "Aproximadamente 19% da potência máxima (calculando 191 / 1023)", exp: "Você dividiu por 1023 (que é a resolução de 10 bits da entrada analógica analogRead), mas a saída PWM analogWrite opera de 0 a 255 (8 bits)." },
      { text: "100% da potência máxima, pois qualquer valor acima de 100 satura o pino", exp: "No PWM de 8 bits, 100% corresponde ao valor 255; o valor 191 entrega 75% da tensão máxima." },
      { text: "50% da potência máxima", exp: "50% de Duty Cycle na escala de 0 a 255 corresponde ao valor 127 ou 128, e não 191." }
    ]
  };
}

export function generateTopicSpecificQuestions(
  disc: Discipline,
  targetContent: ContentItem,
  handcraftedQuestions: ActivityQuestion[]
): ActivityQuestion[] {
  const profile = getDisciplineProfile(disc.id, disc.name);
  const prereqTopic =
    targetContent.prerequisites?.[0] || `Conceitos Estruturantes de ${disc.name}`;
  const domain = getTopicDomainKnowledge(
    disc.id,
    targetContent.title,
    targetContent.subtitle,
    prereqTopic
  );

  const t = targetContent.title;
  const dName = disc.name;
  const generated: ActivityQuestion[] = [...handcraftedQuestions];

  const baseQuestionSpecs: Array<{
    title: string;
    difficulty: "facil" | "medio" | "dificil";
    type: "objective" | "discursive";
    prompt: string;
    correctExplanation: string;
    rawOptions?: Array<{ text: string; isCorrect: boolean; explanation: string }>;
  }> = [];

  // Q1: Definição e Conceito Central do Tópico
  baseQuestionSpecs.push({
    title: `Conceito Central: ${t}`,
    difficulty: "facil",
    type: "objective",
    prompt: `No estudo de ${dName} (${domain.moduleTitle}), ao analisarmos o tema "${t}", qual alternativa expressa corretamente sua definição e seus elementos fundamentais?`,
    correctExplanation: `${domain.coreDefinition} ${domain.formulaOrSyntax ? `Expressão/Regra central: ${domain.formulaOrSyntax}.` : ""}`,
    rawOptions: [
      {
        text: domain.coreDefinition,
        isCorrect: true,
        explanation: `Correto! Esta alternativa define com exatidão "${t}" em ${dName}, articulando ${domain.keyTerms.slice(0, 3).join(", ")}.`
      },
      {
        text: domain.commonMistake,
        isCorrect: false,
        explanation: `Esta alternativa apresenta um equívoco conceitual sobre "${t}". Para corrigir: ${domain.mistakeCorrection}`
      },
      {
        text: `Define "${t}" invertendo a função de ${domain.keyTerms[0] || t} e desconsiderando o processo: ${domain.mechanismsAndProcesses.slice(0, 110)}...`,
        isCorrect: false,
        explanation: `O erro está em desconsiderar como o processo realmente ocorre em "${t}": ${domain.mechanismsAndProcesses}`
      },
      {
        text: `Afirma que "${t}" ocorre sem relação com "${domain.prerequisiteTitle}" e sem aplicação prática nos estudos de ${dName}.`,
        isCorrect: false,
        explanation: `Na verdade, "${t}" depende diretamente de "${domain.prerequisiteTitle}" e aplica-se em casos como: ${domain.practicalExamples[0]}`
      }
    ]
  });

  // Q2 & Q3: Variam conforme a natureza da disciplina
  if (domain.areaType === "exatas") {
    const calc = getCalculationScenario(domain, t);
    baseQuestionSpecs.push({
      title: `Cálculo e Aplicação de Fórmula em ${t}`,
      difficulty: "medio",
      type: "objective",
      prompt: calc.calc1Prompt,
      correctExplanation: calc.calc1Exp,
      rawOptions: [
        {
          text: calc.calc1Correct,
          isCorrect: true,
          explanation: `Correto! ${calc.calc1Exp}`
        },
        ...calc.calc1Dist.map((d) => ({
          text: d.text,
          isCorrect: false,
          explanation: d.exp
        }))
      ]
    });

    baseQuestionSpecs.push({
      title: `Resolução de Problema Prático: ${t}`,
      difficulty: "medio",
      type: "objective",
      prompt: calc.calc2Prompt,
      correctExplanation: calc.calc2Exp,
      rawOptions: [
        {
          text: calc.calc2Correct,
          isCorrect: true,
          explanation: `Excelente resolução! ${calc.calc2Exp}`
        },
        ...calc.calc2Dist.map((d) => ({
          text: d.text,
          isCorrect: false,
          explanation: d.exp
        }))
      ]
    });
  } else if (domain.areaType === "humanas") {
    baseQuestionSpecs.push({
      title: `Contextualização e Fundamentos de ${t}`,
      difficulty: "facil",
      type: "objective",
      prompt: `Considerando os fundamentos e a contextualização de "${t}" em ${dName}, assinale a alternativa correta:`,
      correctExplanation: domain.historicalContext,
      rawOptions: [
        {
          text: domain.historicalContext,
          isCorrect: true,
          explanation: `Correto! Essa alternativa contextualiza com precisão o estudo de "${t}" em ${dName}.`
        },
        {
          text: `O tema "${t}" ocorre de modo isolado, sem relação com ${domain.keyTerms.slice(0, 2).join(" e ")} ou com os fatores analisados em ${dName}.`,
          isCorrect: false,
          explanation: `O erro está em desconsiderar os fatores específicos de "${t}" em ${dName}: ${domain.historicalContext}`
        },
        {
          text: `Em "${t}", as características de ${domain.keyTerms[0] || t} permanecem idênticas em qualquer escala, sem depender de ${domain.prerequisiteTitle}.`,
          isCorrect: false,
          explanation: `O erro está em ignorar a variação e os fundamentos de "${t}": ${domain.coreDefinition}`
        },
        {
          text: domain.commonMistake,
          isCorrect: false,
          explanation: `${domain.mistakeCorrection}`
        }
      ]
    });

    baseQuestionSpecs.push({
      title: `Análise de Caso e Interpretação em ${dName}`,
      difficulty: "medio",
      type: "objective",
      prompt: `Leia a situação-problema a seguir no âmbito de ${dName}:\n"${domain.practicalExamples[0]}"\nA partir dessa leitura e dos conceitos de "${t}", conclui-se corretamente que:`,
      correctExplanation: `${domain.mechanismsAndProcesses} ${domain.importantRelations}`,
      rawOptions: [
        {
          text: `${domain.mechanismsAndProcesses}`,
          isCorrect: true,
          explanation: `Exato! A leitura interpreta o caso aplicando diretamente os conceitos de ${dName} sobre "${t}" (${domain.keyTerms.slice(0, 3).join(", ")}).`
        },
        {
          text: `O caso descrito ocorre de maneira independente de ${domain.keyTerms.slice(0, 2).join(" e ")}, contrariando os processos de "${t}".`,
          isCorrect: false,
          explanation: `O erro está em negar a atuação direta de ${domain.keyTerms.slice(0, 2).join(" e ")} no caso analisado de "${t}".`
        },
        {
          text: domain.commonMistake,
          isCorrect: false,
          explanation: `${domain.mistakeCorrection}`
        },
        {
          text: `Na análise de "${t}" em ${dName}, não há relação entre ${domain.keyTerms[0] || t} e ${domain.keyTerms[1] || domain.prerequisiteTitle}.`,
          isCorrect: false,
          explanation: `O erro está em separar conceitos que atuam juntos neste tema de ${dName}: ${domain.importantRelations}`
        }
      ]
    });
  } else if (domain.areaType === "biologicas") {
    baseQuestionSpecs.push({
      title: `Estruturas e Etapas Biológicas em ${t}`,
      difficulty: "facil",
      type: "objective",
      prompt: `No estudo biológico de "${t}", como se articulam as estruturas celulares/moleculares e as etapas fisiológicas do processo?`,
      correctExplanation: domain.mechanismsAndProcesses,
      rawOptions: [
        {
          text: domain.mechanismsAndProcesses,
          isCorrect: true,
          explanation: `Perfeito! Você identificou as estruturas biológicas corretas e a sequência funcional de "${t}".`
        },
        {
          text: domain.commonMistake,
          isCorrect: false,
          explanation: `Essa alternativa contém uma confusão biológica frequente sobre "${t}": ${domain.mistakeCorrection}`
        },
        {
          text: `O processo biológico de "${t}" ocorre sem participação de enzimas, membranas ou material genético, fora do metabolismo celular.`,
          isCorrect: false,
          explanation: `O erro está em afirmar que o processo independe da maquinaria celular; em "${t}", participam diretamente ${domain.keyTerms.slice(0, 3).join(", ")}.`
        },
        {
          text: `A função biológica de "${t}" ocorre exclusivamente em vírus acelulares isolados fora de qualquer célula hospedeira.`,
          isCorrect: false,
          explanation: `Vírus são parasitas intracelulares obrigatórios sem metabolismo próprio; o processo de "${t}" depende das estruturas celulares descritas (${domain.keyTerms.slice(0, 2).join(" e ")}).`
        }
      ]
    });

    baseQuestionSpecs.push({
      title: `Análise Fisiológica e Aplicação em Biologia`,
      difficulty: "medio",
      type: "objective",
      prompt: `Considere o seguinte exemplo biológico relacionado a "${t}":\n"${domain.practicalExamples[0]}"\nQual interpretação explica corretamente esse fenômeno?`,
      correctExplanation: `${domain.mistakeCorrection} ${domain.importantRelations}`,
      rawOptions: [
        {
          text: `${domain.mistakeCorrection} Além disso, esse mecanismo é essencial pois: ${domain.importantRelations}`,
          isCorrect: true,
          explanation: `Excelente análise biológica! Você articulou o mecanismo fisiológico de "${t}" com sua função vital e ecológica.`
        },
        {
          text: `Os organismos modificam intencionalmente seu DNA por esforço próprio imediato para se adaptarem ao ambiente (finalismo lamarckista).`,
          isCorrect: false,
          explanation: `O erro está na explicação lamarckista/finalista: na Biologia, os organismos não alteram o DNA por vontade própria; atuam mecanismos genéticos, fisiológicos e seleção natural.`
        },
        {
          text: `O fenômeno biológico descrito em "${t}" independe de fatores como temperatura, pH, água ou disponibilidade energética.`,
          isCorrect: false,
          explanation: `O erro está em ignorar a regulação metabólica: enzimas e processos fisiológicos em "${t}" dependem diretamente de condições adequadas de pH, temperatura e energia.`
        },
        {
          text: domain.commonMistake,
          isCorrect: false,
          explanation: `${domain.mistakeCorrection}`
        }
      ]
    });
  } else {
    // Linguagens & Técnicas
    baseQuestionSpecs.push({
      title: `Estrutura e Funcionamento Prático de ${t}`,
      difficulty: "facil",
      type: "objective",
      prompt: `Em ${dName}, para aplicar corretamente os conhecimentos de "${t}", qual procedimento ou regra estrutural deve ser observado?`,
      correctExplanation: domain.mechanismsAndProcesses,
      rawOptions: [
        {
          text: domain.mechanismsAndProcesses,
          isCorrect: true,
          explanation: `Correto! Essa alternativa descreve com exatidão as etapas e regras de "${t}" em ${dName}.`
        },
        {
          text: domain.commonMistake,
          isCorrect: false,
          explanation: `${domain.mistakeCorrection}`
        },
        {
          text: `Empregar "${t}" sem observar a relação entre ${domain.keyTerms.slice(0, 2).join(" e ")} e ignorando o pré-requisito "${domain.prerequisiteTitle}".`,
          isCorrect: false,
          explanation: `O erro está em desconectar ${domain.keyTerms.slice(0, 2).join(" e ")}; para aplicar "${t}" corretamente, siga: ${domain.mechanismsAndProcesses}`
        },
        {
          text: `Suprimir a validação estrutural/semântica em "${t}", assumindo que a forma não altera o resultado ou sentido.`,
          isCorrect: false,
          explanation: `Em ${dName}, a estrutura de "${t}" (${domain.formulaOrSyntax || domain.keyTerms[0]}) determina diretamente a correção e o funcionamento do resultado.`
        }
      ]
    });

    baseQuestionSpecs.push({
      title: `Análise de Exemplo Prático em ${t}`,
      difficulty: "medio",
      type: "objective",
      prompt: `Analise o seguinte caso prático de ${dName} sobre "${t}":\n"${domain.practicalExamples[0]}"\nPor que essa construção/implementação está correta?`,
      correctExplanation: `${domain.formulaInterpretation || domain.coreDefinition} ${domain.mistakeCorrection}`,
      rawOptions: [
        {
          text: `${domain.formulaInterpretation || domain.coreDefinition} Respeita-se assim a diretriz: ${domain.mistakeCorrection}`,
          isCorrect: true,
          explanation: `Perfeito! Você justificou corretamente o funcionamento prático do exemplo em "${t}".`
        },
        {
          text: domain.commonMistake,
          isCorrect: false,
          explanation: `Essa alternativa aponta justamente o erro que o exemplo evita: ${domain.mistakeCorrection}`
        },
        {
          text: `Porque substitui os princípios de ${domain.moduleTitle} por improvisação sem critério em ${dName}.`,
          isCorrect: false,
          explanation: `O exemplo funciona justamente porque aplica com rigor os conceitos de ${domain.keyTerms.slice(0, 3).join(", ")} em "${t}".`
        },
        {
          text: `Porque dispensa o conhecimento prévio de "${domain.prerequisiteTitle}" dentro de ${dName}.`,
          isCorrect: false,
          explanation: `O exemplo apoia-se diretamente em "${domain.prerequisiteTitle}" para executar "${t}" com precisão.`
        }
      ]
    });
  }

  // Q4: Identificação e Correção de Erro Comum no Tópico
  baseQuestionSpecs.push({
    title: `Prevenção de Erros Frequentes em ${t}`,
    difficulty: "medio",
    type: "objective",
    prompt: `Durante a resolução de questões de ${dName} sobre "${t}", um estudante cometeu a seguinte falha:\n"${domain.commonMistake}"\nQual orientação pedagógica corrige especificamente esse erro?`,
    correctExplanation: domain.mistakeCorrection,
    rawOptions: [
      {
        text: domain.mistakeCorrection,
        isCorrect: true,
        explanation: `Exato! Essa é a correção conceitual e prática exata para superar a falha em "${t}".`
      },
      {
        text: `Manter o procedimento "${domain.commonMistake.slice(0, 75)}...", pois ele não altera o resultado em "${t}".`,
        isCorrect: false,
        explanation: `O erro está em manter a falha descrita no enunciado; ela altera diretamente o resultado. A correção correta é: ${domain.mistakeCorrection}`
      },
      {
        text: `Substituir a análise de ${domain.keyTerms.slice(0, 2).join(" e ")} por uma estimativa sem verificar os dados da questão.`,
        isCorrect: false,
        explanation: `Para corrigir o erro em "${t}", é necessário verificar ${domain.keyTerms.slice(0, 2).join(" e ")} aplicando: ${domain.mistakeCorrection}`
      },
      {
        text: `Descartar o conceito de "${domain.prerequisiteTitle}", pois ele contradiz o estudo de "${t}".`,
        isCorrect: false,
        explanation: `"${domain.prerequisiteTitle}" não contradiz "${t}"; pelo contrário, é o pré-requisito que permite aplicar: ${domain.mistakeCorrection}`
      }
    ]
  });

  // Q5: Articulação com o Pré-Requisito e Módulo Temático
  baseQuestionSpecs.push({
    title: `Conexão com Pré-Requisito: ${domain.prerequisiteTitle}`,
    difficulty: "facil",
    type: "objective",
    prompt: `No currículo de ${dName}, o domínio de "${t}" apoia-se no pré-requisito "${domain.prerequisiteTitle}" e integra "${domain.moduleTitle}". Como esses conhecimentos se conectam na prática?`,
    correctExplanation: `${domain.importantRelations} A base de "${domain.prerequisiteTitle}" fornece os conceitos necessários para compreender ${domain.keyTerms.slice(0, 3).join(", ")}.`,
    rawOptions: [
      {
        text: `Os conceitos de "${domain.prerequisiteTitle}" fornecem a base direta para compreender ${domain.keyTerms.slice(0, 3).join(", ")} e executar: ${domain.mechanismsAndProcesses.slice(0, 110)}...`,
        isCorrect: true,
        explanation: `Correto! A progressão em ${dName} conecta "${domain.prerequisiteTitle}" diretamente ao funcionamento de "${t}".`
      },
      {
        text: `Não existe relação entre "${domain.prerequisiteTitle}" e "${t}", pois tratam de fenômenos opostos e desconectados.`,
        isCorrect: false,
        explanation: `O erro está em negar a ligação entre os dois conceitos: sem "${domain.prerequisiteTitle}", não é possível realizar as etapas de "${t}" (${domain.keyTerms.slice(0, 2).join(", ")}).`
      },
      {
        text: `O estudo de "${t}" invalida as regras e propriedades vistas em "${domain.prerequisiteTitle}".`,
        isCorrect: false,
        explanation: `O erro está em achar que "${t}" anula o pré-requisito; na verdade, "${t}" aplica e aprofunda "${domain.prerequisiteTitle}".`
      },
      {
        text: domain.commonMistake,
        isCorrect: false,
        explanation: `${domain.mistakeCorrection}`
      }
    ]
  });

  // Q6: Interpretação de Segundo Caso / Aplicação Contextualizada
  baseQuestionSpecs.push({
    title: `Interpretação Contextualizada: ${t}`,
    difficulty: "medio",
    type: "objective",
    prompt: `Considere a aplicação contextualizada de "${t}" em ${dName}:\n"${domain.practicalExamples[1] || domain.practicalExamples[0]}"\nA análise desse caso demonstra que:`,
    correctExplanation: `${domain.coreDefinition} ${domain.importantRelations}`,
    rawOptions: [
      {
        text: `${domain.importantRelations}`,
        isCorrect: true,
        explanation: `Muito bem! O caso ilustra na prática como "${t}" (${domain.keyTerms.slice(0, 2).join(", ")}) explica situações concretas de ${dName}.`
      },
      {
        text: `Os conceitos de ${domain.keyTerms.slice(0, 2).join(" e ")} em "${t}" não possuem relação com a situação prática apresentada no enunciado.`,
        isCorrect: false,
        explanation: `O erro está em dissociar a teoria do exemplo do enunciado: o caso apresentado é uma aplicação direta de ${domain.keyTerms.slice(0, 2).join(" e ")} (${domain.importantRelations}).`
      },
      {
        text: domain.commonMistake,
        isCorrect: false,
        explanation: `${domain.mistakeCorrection}`
      },
      {
        text: `O caso analisado ocorre de maneira contrária a: ${domain.mechanismsAndProcesses.slice(0, 100)}...`,
        isCorrect: false,
        explanation: `O exemplo do enunciado segue exatamente o processo de "${t}": ${domain.mechanismsAndProcesses}`
      }
    ]
  });

  // Q7: Comparação Conceitual e Critérios da Disciplina
  baseQuestionSpecs.push({
    title: `Análise de Conceitos-Chave em ${t}`,
    difficulty: "dificil",
    type: "objective",
    prompt: `Ao relacionarmos os conceitos-chave de "${t}" (${domain.keyTerms.slice(0, 4).join(", ")}) na disciplina de ${dName}, qual proposição apresenta rigor conceitual?`,
    correctExplanation: `${domain.coreDefinition} ${domain.mechanismsAndProcesses}`,
    rawOptions: [
      {
        text: `${domain.formulaInterpretation || domain.mechanismsAndProcesses}`,
        isCorrect: true,
        explanation: `Correto! Essa proposição articula com rigor os conceitos de ${domain.keyTerms.slice(0, 3).join(", ")} em "${t}".`
      },
      {
        text: `Os conceitos de ${domain.keyTerms[0]} e ${domain.keyTerms[1] || domain.prerequisiteTitle} são sinônimos idênticos e exercem a mesma função em "${t}".`,
        isCorrect: false,
        explanation: `O erro está em tratar "${domain.keyTerms[0]}" e "${domain.keyTerms[1] || domain.prerequisiteTitle}" como idênticos; veja a função específica de cada elemento: ${domain.coreDefinition}`
      },
      {
        text: domain.commonMistake,
        isCorrect: false,
        explanation: `${domain.mistakeCorrection}`
      },
      {
        text: `Em "${t}", o resultado independe de ${domain.keyTerms[0]} e contraria a relação: ${domain.importantRelations.slice(0, 95)}...`,
        isCorrect: false,
        explanation: `O erro está em excluir "${domain.keyTerms[0]}": ${domain.importantRelations}`
      }
    ]
  });

  // Q8: Compreensão Didática e Exemplo Prático
  baseQuestionSpecs.push({
    title: `Raciocínio Didático e Aplicação de ${t}`,
    difficulty: "medio",
    type: "objective",
    prompt: `Para compreender de forma clara o funcionamento de "${t}" em ${dName}, qual síntese explica corretamente a lógica desse conteúdo?`,
    correctExplanation: `${domain.analogyExplanation} ${domain.coreDefinition}`,
    rawOptions: [
      {
        text: domain.analogyExplanation,
        isCorrect: true,
        explanation: `Perfeito! Essa explicação traduz com fidelidade e clareza o funcionamento de "${t}" em ${dName}.`
      },
      {
        text: domain.commonMistake,
        isCorrect: false,
        explanation: `${domain.mistakeCorrection}`
      },
      {
        text: `Em "${t}", basta memorizar a nomenclatura de ${domain.keyTerms[0]}, pois não existe relação causal nem processo passo a passo.`,
        isCorrect: false,
        explanation: `O erro está em reduzir "${t}" à decoração de nomes; o tema envolve o processo: ${domain.mechanismsAndProcesses}`
      },
      {
        text: `O funcionamento de "${t}" contradiz o exemplo prático "${domain.practicalExamples[0].slice(0, 80)}...".`,
        isCorrect: false,
        explanation: `Pelo contrário, esse exemplo prático demonstra exatamente como "${t}" funciona: ${domain.practicalExamples[0]}`
      }
    ]
  });

  // Q9: Questão de Nível Avançado / Síntese Teoria e Prática
  baseQuestionSpecs.push({
    title: `Síntese Avançada de Teoria e Prática em ${t}`,
    difficulty: "dificil",
    type: "objective",
    prompt: `Em uma questão de aprofundamento de ${dName} sobre "${t}", considerando as referências da área (${profile.realSources[0]}), qual conclusão integra corretamente definição, processo e prevenção de erros?`,
    correctExplanation: `${domain.coreDefinition} ${domain.mistakeCorrection}`,
    rawOptions: [
      {
        text: `O domínio de "${t}" articula ${domain.keyTerms.slice(0, 3).join(", ")}, aplicando a regra "${domain.mistakeCorrection}" em consonância com ${domain.moduleTitle}.`,
        isCorrect: true,
        explanation: `Excelente! Você integrou a definição central, os conceitos-chave e a prevenção do erro clássico de "${t}" em ${dName}.`
      },
      {
        text: domain.commonMistake,
        isCorrect: false,
        explanation: `${domain.mistakeCorrection}`
      },
      {
        text: `Na resolução avançada de "${t}", deve-se omitir a verificação de ${domain.keyTerms[0]} e de "${domain.prerequisiteTitle}".`,
        isCorrect: false,
        explanation: `O erro está em omitir a verificação de ${domain.keyTerms[0]} e do pré-requisito "${domain.prerequisiteTitle}", que são a base de "${t}".`
      },
      {
        text: `O estudo de "${t}" aplica-se apenas a situações hipotéticas que contrariam o caso "${domain.practicalExamples[0].slice(0, 75)}...".`,
        isCorrect: false,
        explanation: `"${t}" possui aplicação direta em problemas reais de ${dName}, como: ${domain.practicalExamples[0]}`
      }
    ]
  });

  // Q10: Questão Discursiva Contextualizada sobre o Tema
  baseQuestionSpecs.push({
    title: `Questão Discursiva: Análise Completa de ${t}`,
    difficulty: "dificil",
    type: "discursive",
    prompt: `[QUESTÃO DISCURSIVA — ${dName.toUpperCase()}] Elabore uma resposta discursiva completa sobre "${t}" (${domain.moduleTitle}). Em seu texto, aborde: (1) a definição central do tema e sua relação com "${domain.prerequisiteTitle}"; (2) como funcionam seus principais conceitos/processos (${domain.keyTerms.slice(0, 3).join(", ")}); e (3) um exemplo concreto de aplicação e como evitar o erro comum (${domain.commonMistake.slice(0, 70)}...).`,
    correctExplanation: `Resposta-modelo esperada para "${t}" (${dName}): 1) Definição: ${domain.coreDefinition} 2) Funcionamento/Processo: ${domain.mechanismsAndProcesses} 3) Exemplo e Cuidado: ${domain.practicalExamples[0]} Como evitar o erro comum: ${domain.mistakeCorrection}`
  });

  // Fill until we have 10 complete topic-specific questions
  let specIdx = 0;
  while (generated.length < 10 && specIdx < baseQuestionSpecs.length) {
    const spec = baseQuestionSpecs[specIdx];
    const qNumber = generated.length + 1;
    const baseId = `q-${targetContent.id}-${qNumber}`;

    generated.push({
      id: baseId,
      disciplineId: disc.id,
      contentId: targetContent.id,
      disciplineName: disc.name,
      contentTitle: t,
      title: `Questão ${qNumber} — ${spec.title}`,
      prompt: spec.prompt,
      type: spec.type,
      difficulty: spec.difficulty,
      options: spec.rawOptions
        ? rotateOptions(spec.rawOptions, baseId, qNumber + targetContent.title.length)
        : undefined,
      expectedKeywords: domain.keyTerms,
      correctExplanation: spec.correctExplanation,
      prerequisiteFallback: buildRemedialFallback(domain, baseId, qNumber, spec.title)
    });

    specIdx++;
  }

  return generated.slice(0, 10);
}
