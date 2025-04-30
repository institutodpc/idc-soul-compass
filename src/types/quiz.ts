
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
  verse: string;
  tip: string;
  practice: string;
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

export interface QuizResult {
  primaryProfile: Profile;
  secondaryProfiles: Profile[];
}

export interface User {
  id?: string;
  email?: string;
  name?: string;
  whatsapp?: string;
}
