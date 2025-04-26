
import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserAnswer, QuizResult, User } from "@/types/quiz";
import { calculateResults, getTotalQuestions } from "@/services/quizService";
import { saveAnswers, saveUserProfile } from "@/services/supabaseService";
import { toast } from "sonner";

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

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentQuestionId, setCurrentQuestionId] = useState<number>(1);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const startQuiz = () => {
    setCurrentQuestionId(1);
    setAnswers([]);
    setIsCompleted(false);
    setResult(null);
  };

  const answerQuestion = async (questionId: number, value: number) => {
    if (!user) {
      toast.error("Por favor, registre-se antes de responder às perguntas.");
      return;
    }
    
    const newAnswers = [...answers];
    const existingAnswerIndex = newAnswers.findIndex(a => a.questionId === questionId);
    const answerValue = value as 0 | 1 | 2 | 3;
    
    if (existingAnswerIndex !== -1) {
      newAnswers[existingAnswerIndex] = { questionId, value: answerValue };
    } else {
      newAnswers.push({ questionId, value: answerValue });
    }
    
    setAnswers(newAnswers);
    saveQuizProgress();
    
    try {
      await saveAnswers([{ questionId, value: answerValue }]);
    } catch (error) {
      console.error("Error saving answer:", error);
    }
  };

  const nextQuestion = async () => {
    try {
      const total = await getTotalQuestions();
      if (currentQuestionId < total) {
        setCurrentQuestionId(currentQuestionId + 1);
      } else if (currentQuestionId === total) {
        await completeQuiz();
      }
    } catch (error) {
      console.error("Error moving to next question:", error);
      toast.error("Erro ao avançar para a próxima pergunta.");
    }
  };

  const prevQuestion = () => {
    if (currentQuestionId > 1) {
      setCurrentQuestionId(currentQuestionId - 1);
    }
  };

  const completeQuiz = async () => {
    try {
      if (!user) {
        toast.error("Por favor, registre-se antes de completar o quiz.");
        return;
      }
      
      await saveUserProfile(user);
      await saveAnswers(answers);
      
      const quizResult = await calculateResults(answers);
      setResult(quizResult);
      setIsCompleted(true);
      localStorage.removeItem("quizProgress");
      
      toast.success("Quiz concluído com sucesso!");
      
    } catch (error) {
      console.error("Error completing quiz:", error);
      toast.error("Erro ao salvar resultados. Por favor, tente novamente.");
    }
  };

  const setUserData = (userData: User) => {
    setUser(userData);
  };

  const resetQuiz = () => {
    startQuiz();
    localStorage.removeItem("quizProgress");
    toast.info("Quiz reiniciado. Suas respostas anteriores serão substituídas.");
  };

  const saveQuizProgress = () => {
    try {
      if (!user) return;
      
      const progress = {
        currentQuestionId,
        answers,
        user
      };
      localStorage.setItem("quizProgress", JSON.stringify(progress));
    } catch (error) {
      console.error("Failed to save quiz progress:", error);
    }
  };

  const loadQuizProgress = (): boolean => {
    try {
      const savedProgress = localStorage.getItem("quizProgress");
      if (savedProgress) {
        const { currentQuestionId: savedQuestionId, answers: savedAnswers, user: savedUser } = JSON.parse(savedProgress);
        setCurrentQuestionId(savedQuestionId);
        setAnswers(savedAnswers);
        setUser(savedUser);
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

export const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuizContext must be used within a QuizProvider");
  }
  return context;
};
