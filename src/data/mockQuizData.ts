
import { Question, Profile, QuestionWeight } from "@/types/quiz";

// Sample questions data
export const mockQuestions: Question[] = [
  {
    id: 1,
    text: "Eu costumo adiar tarefas importantes, mesmo quando sei que não deveria.",
    category: "Comportamento Pessoal"
  },
  {
    id: 2,
    text: "Tenho dificuldade em falar 'não' quando alguém me pede um favor.",
    category: "Relacionamentos"
  },
  {
    id: 3,
    text: "Me sinto sobrecarregado(a) com muitas responsabilidades.",
    category: "Saúde emocional e mental"
  },
  {
    id: 4,
    text: "Sinto que minhas orações são repetitivas e sem profundidade.",
    category: "Espiritualidade e Práticas Religiosas"
  },
  {
    id: 5,
    text: "Frequentemente julgo as escolhas ou comportamentos dos outros.",
    category: "Atitudes em relação aos outros"
  },
  // Add more questions to total 33 in a full implementation
];

// For the demo, we're adding just a few. In production you'd have all 33.
for (let i = 6; i <= 33; i++) {
  mockQuestions.push({
    id: i,
    text: `Esta é a pergunta de exemplo #${i}. Não respondê-la não afetará seu resultado.`,
    category: "Comportamento Pessoal" 
  });
}

// Sample profiles data
export const mockProfiles: Profile[] = [
  {
    id: 1,
    name: "Procrastinador",
    description: "Você tem deixado para amanhã o que Deus já te chamou pra fazer hoje?",
    refuge: "Distração e conforto momentâneo.",
    biblical_character: "Jonas que fugiu de Nínive.",
    exaltation: "Quando Jonas se arrependeu e cumpriu sua missão.",
    formation: "Evitando responsabilidades e temendo falhar.",
    common_pains: [
      "Ansiedade", 
      "Culpa por tarefas não cumpridas"
    ],
    steps_to_exit: [
      "Divida tarefas grandes em pequenas",
      "Comece agora"
    ],
    prophetic_summary: "Deus está chamando você para agir hoje, não amanhã."
  },
  {
    id: 2,
    name: "Ansioso",
    description: "Você se preocupa excessivamente com o futuro, esquecendo de confiar em Deus no presente?",
    refuge: "Planejamento excessivo e controle.",
    biblical_character: "Marta, preocupada com muitas coisas.",
    exaltation: "Quando aprendemos a descansar aos pés de Jesus como Maria.",
    formation: "Tentando controlar o incontrolável.",
    common_pains: [
      "Insônia", 
      "Preocupação constante", 
      "Medo do futuro"
    ],
    steps_to_exit: [
      "Pratique exercícios de respiração",
      "Ore nos momentos de ansiedade"
    ],
    prophetic_summary: "Deus já está no seu amanhã. Confie no tempo Dele."
  },
  {
    id: 3,
    name: "Perfeccionista",
    description: "Você se cobra demais por resultados perfeitos, esquecendo que a graça de Deus é suficiente?",
    refuge: "Auto-exigência e crítica constante.",
    biblical_character: "Paulo lutando contra o espinho na carne.",
    exaltation: "Quando Paulo compreendeu que na fraqueza a graça se aperfeiçoa.",
    formation: "Estabelecendo padrões irreais para si mesmo e para outros.",
    common_pains: [
      "Frustração constante", 
      "Dificuldade em celebrar conquistas"
    ],
    steps_to_exit: [
      "Estabeleça limites realistas para suas tarefas",
      "Celebre o progresso"
    ],
    prophetic_summary: "A graça de Deus é suficiente. Você não precisa ser perfeito."
  },
  // More profiles would be added in production
];

// Sample weights data - simplified for demonstration
export const mockWeights: QuestionWeight[] = [
  // Question 1 (procrastinação) strongly affects profile 1 (Procrastinador) 
  { questionId: 1, profileId: 1, weight: 3 },
  { questionId: 1, profileId: 3, weight: 1 }, // Slightly affects Perfeccionista
  
  // Question 2 (dificuldade em dizer não) affects Ansioso
  { questionId: 2, profileId: 2, weight: 2 },
  
  // Question 3 (sobrecarga) affects all three
  { questionId: 3, profileId: 1, weight: 1 },
  { questionId: 3, profileId: 2, weight: 2 },
  { questionId: 3, profileId: 3, weight: 2 },
  
  // Question 4 (orações) affects profiles
  { questionId: 4, profileId: 2, weight: 1 },
  { questionId: 4, profileId: 3, weight: 1 },
  
  // Question 5 (julgamento) affects profiles
  { questionId: 5, profileId: 3, weight: 3 },
  
  // Other questions would have weights too in a full implementation
];

// Helper function to calculate max possible score for a profile
export const getMaxPossibleScore = (profileId: number): number => {
  return mockWeights
    .filter(w => w.profileId === profileId)
    .reduce((sum, weight) => sum + (weight.weight * 3), 0); // 3 is max answer value
};
