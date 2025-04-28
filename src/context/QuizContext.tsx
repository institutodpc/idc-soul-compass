
import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserAnswer, QuizResult, User } from "@/types/quiz";
import { calculateResults, getTotalQuestions } from "@/services/quizService";
import { saveAnswers, saveUserProfile } from "@/services/supabaseService";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  completeQuiz: () => Promise<void>;
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
  const [hasLoadedProgress, setHasLoadedProgress] = useState<boolean>(false);

  const startQuiz = () => {
    setCurrentQuestionId(1);
    setAnswers([]);
    setIsCompleted(false);
    setResult(null);
  };

  const answerQuestion = async (questionId: number, value: number) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        console.error("User not authenticated");
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
      
      // Save answer to database
      await saveAnswers([{ questionId, value: answerValue }]);
    } catch (error) {
      console.error("Error saving answer:", error);
      // Continue even if saving fails
    }
  };

  const nextQuestion = async () => {
    try {
      const total = await getTotalQuestions();
      if (currentQuestionId < total) {
        setCurrentQuestionId(currentQuestionId + 1);
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
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        console.error("User not authenticated");
        throw new Error("User not authenticated");
      }
      
      if (user) {
        try {
          await saveUserProfile(user);
        } catch (profileError) {
          console.error("Error saving user profile:", profileError);
          // Continue even if profile saving fails
        }
      }
      
      // Ensure we save all remaining answers
      try {
        await saveAnswers(answers);
      } catch (answersError) {
        console.error("Error saving answers:", answersError);
        // Continue even if saving answers fails
      }
      
      // Call the RPC function to calculate profiles
      try {
        await supabase.rpc('calcular_perfis', { user_uuid: authUser.id });
      } catch (rpcError) {
        console.error("Error calculating profiles:", rpcError);
        // Continue even if calculation fails
      }
      
      setIsCompleted(true);
      localStorage.removeItem("quizProgress");
      
      // No need to return anything, the caller will handle navigation
    } catch (error) {
      console.error("Error completing quiz:", error);
      // Rethrow so the component can handle it
      throw error;
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
      if (hasLoadedProgress) {
        return false;
      }
      
      const savedProgress = localStorage.getItem("quizProgress");
      if (savedProgress) {
        const { currentQuestionId: savedQuestionId, answers: savedAnswers, user: savedUser } = JSON.parse(savedProgress);
        setCurrentQuestionId(savedQuestionId);
        setAnswers(savedAnswers);
        setUser(savedUser);
        setHasLoadedProgress(true);
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
