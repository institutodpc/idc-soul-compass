
import { QuizResult, User, UserAnswer } from "./quiz";

export interface QuizContextType {
  currentQuestionId: number;
  answers: UserAnswer[];
  isCompleted: boolean;
  result: QuizResult | null;
  user: User | null;
  startQuiz: () => void;
  answerQuestion: (questionId: number, value: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  completeQuiz: () => Promise<void>;
  setUserData: (userData: User) => void;
  resetQuiz: () => void;
  saveQuizProgress: () => void;
  loadQuizProgress: () => boolean;
}

export interface QuizState {
  currentQuestionId: number;
  answers: UserAnswer[];
  isCompleted: boolean;
  result: QuizResult | null;
  user: User | null;
  hasLoadedProgress: boolean;
}

export type QuizAction =
  | { type: 'START_QUIZ' }
  | { type: 'SET_CURRENT_QUESTION', payload: number }
  | { type: 'ANSWER_QUESTION', payload: { questionId: number, value: number } }
  | { type: 'COMPLETE_QUIZ' }
  | { type: 'SET_USER', payload: User }
  | { type: 'SET_ANSWERS', payload: UserAnswer[] }
  | { type: 'SET_HAS_LOADED_PROGRESS', payload: boolean }
  | { type: 'RESET_QUIZ' };
