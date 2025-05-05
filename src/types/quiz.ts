
// Quiz Types
export type QuestionCategory = 
  | "Comportamento Pessoal"
  | "Espiritualidade e Práticas Religiosas"
  | "Atitudes em relação aos outros"
  | "Saúde emocional e mental"
  | "Relacionamentos";

export type AnswerValue = 0 | 1 | 2 | 3;

export interface Question {
  id: number;
  text: string;
  category: QuestionCategory;
}

export interface Profile {
  id: number;
  name: string;
  description: string;
  refuge?: string;
  biblical_character?: string;
  exaltation?: string;
  formation?: string;
  common_pains?: string[];
  steps_to_exit?: string[];
  prophetic_summary?: string;
}

export interface ProfileHierarchy {
  profileId: number;
  hierarchyPosition: number;
  dominanceLevel: string;
}

export interface QuestionWeight {
  questionId: number;
  profileId: number;
  weight: number;
}

export interface UserAnswer {
  questionId: number;
  value: AnswerValue;
}

export interface UserProfileScore {
  profileId: number;
  score: number;
}

export interface QuizResult {
  primaryProfile: Profile;
  secondaryProfiles: Profile[];
  profileScores?: UserProfileScore[]; // Optional to not break existing code
}

export interface User {
  id?: string;
  email?: string;
  name?: string;
  whatsapp?: string;
}
