
import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserAnswer, QuizResult, User } from "@/types/quiz";
import { calculateResults, getTotalQuestions } from "@/services/quizService";
import { toast } from "@/components/ui/sonner";

interface QuizContextType {
  currentQuestionId: number;
  answers: UserAnswer[];
  isCompleted: boolean;
  result: QuizResult | null;
  user: User | null;
  startQuiz: () => void;
  answerQuestion: (questionId: number, value: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  completeQuiz: () => void;
  setUserData: (userData: User) => void;
  resetQuiz: () => void;
  saveQuizProgress: () => void;
  loadQuizProgress: () => boolean;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuizContext must be used within a QuizProvider");
  }
  return context;
};

interface QuizProviderProps {
  children: ReactNode;
}

export const QuizProvider: React.FC<QuizProviderProps> = ({ children }) => {
  const [currentQuestionId, setCurrentQuestionId] = useState<number>(1);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Start or reset quiz
  const startQuiz = () => {
    setCurrentQuestionId(1);
    setAnswers([]);
    setIsCompleted(false);
    setResult(null);
  };

  // Answer the current question
  const answerQuestion = (questionId: number, value: number) => {
    const newAnswers = [...answers];
    const existingAnswerIndex = newAnswers.findIndex(a => a.questionId === questionId);
    
    if (existingAnswerIndex !== -1) {
      newAnswers[existingAnswerIndex] = { questionId, value: value as 0 | 1 | 2 | 3 };
    } else {
      newAnswers.push({ questionId, value: value as 0 | 1 | 2 | 3 });
    }
    
    setAnswers(newAnswers);
  };

  // Move to next question
  const nextQuestion = () => {
    if (currentQuestionId < getTotalQuestions()) {
      setCurrentQuestionId(currentQuestionId + 1);
      saveQuizProgress();
    }
  };

  // Move to previous question
  const prevQuestion = () => {
    if (currentQuestionId > 1) {
      setCurrentQuestionId(currentQuestionId - 1);
    }
  };

  // Complete the quiz and calculate results
  const completeQuiz = () => {
    const quizResult = calculateResults(answers);
    setResult(quizResult);
    setIsCompleted(true);
    
    // Clear saved progress
    localStorage.removeItem("quizProgress");
  };

  // Set user data
  const setUserData = (userData: User) => {
    setUser(userData);
  };

  // Reset quiz to start
  const resetQuiz = () => {
    startQuiz();
    localStorage.removeItem("quizProgress");
  };

  // Save quiz progress to localStorage
  const saveQuizProgress = () => {
    try {
      const progress = {
        currentQuestionId,
        answers
      };
      localStorage.setItem("quizProgress", JSON.stringify(progress));
    } catch (error) {
      console.error("Failed to save quiz progress:", error);
    }
  };

  // Load quiz progress from localStorage
  const loadQuizProgress = (): boolean => {
    try {
      const savedProgress = localStorage.getItem("quizProgress");
      if (savedProgress) {
        const { currentQuestionId: savedQuestionId, answers: savedAnswers } = JSON.parse(savedProgress);
        setCurrentQuestionId(savedQuestionId);
        setAnswers(savedAnswers);
        toast.info("Progresso anterior carregado!");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to load quiz progress:", error);
      return false;
    }
  };

  const value = {
    currentQuestionId,
    answers,
    isCompleted,
    result,
    user,
    startQuiz,
    answerQuestion,
    nextQuestion,
    prevQuestion,
    completeQuiz,
    setUserData,
    resetQuiz,
    saveQuizProgress,
    loadQuizProgress
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
