
import React, { createContext, useContext, ReactNode } from "react";
import { QuizContextType } from "@/types/quizContext";
import { QuizResult, User } from "@/types/quiz";
import { useQuizState } from "@/hooks/useQuizState";
import { useQuizProgress } from "@/hooks/useQuizProgress";

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    state,
    dispatch,
    startQuiz,
    answerQuestion,
    nextQuestion,
    prevQuestion,
    completeQuiz,
    setUserData,
    resetQuiz
  } = useQuizState();

  const { saveQuizProgress, loadQuizProgress } = useQuizProgress({ state, dispatch });

  const value: QuizContextType = {
    currentQuestionId: state.currentQuestionId,
    answers: state.answers,
    isCompleted: state.isCompleted,
    result: state.result,
    user: state.user,
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
