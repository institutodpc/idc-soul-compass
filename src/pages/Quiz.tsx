
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuizContext } from "@/context/QuizContext";
import { getQuestionById, getTotalQuestions } from "@/services/quizService";
import { useAuth } from "@/context/AuthContext";
import QuizCard from "@/components/QuizCard";
import ProgressBar from "@/components/ProgressBar";
import QuizQuestion from "@/components/QuizQuestion";
import QuizNavigation from "@/components/QuizNavigation";
import { Question } from "@/types/quiz";
import Logo from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentQuestionId,
    answers,
    answerQuestion,
    nextQuestion,
    prevQuestion,
    completeQuiz,
    loadQuizProgress,
  } = useQuizContext();
  
  const { user } = useAuth();

  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasAttemptedToLoadProgress, setHasAttemptedToLoadProgress] = useState<boolean>(false);
  
  const currentAnswer = answers.find(a => a.questionId === currentQuestionId);
  const isLastQuestion = currentQuestionId === totalQuestions;
  const canGoNext = !!currentAnswer;

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      // Check authentication status from Supabase directly
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      // If no user, redirect to auth page
      if (!authUser) {
        navigate("/auth");
        return;
      }

      // Try to load saved progress only once and silently
      if (!hasAttemptedToLoadProgress) {
        const hasSavedProgress = localStorage.getItem("quizProgress") !== null;
        if (hasSavedProgress) {
          loadQuizProgress();
        }
        setHasAttemptedToLoadProgress(true);
      }

      // Load question data
      setIsLoading(true);
      try {
        const total = await getTotalQuestions();
        setTotalQuestions(total);
        
        const question = await getQuestionById(currentQuestionId);
        setCurrentQuestion(question || null);
      } catch (error) {
        console.error("Error loading question data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthAndLoadData();
  }, [currentQuestionId, navigate, user, loadQuizProgress, hasAttemptedToLoadProgress]);

  const handleCompleteQuiz = async () => {
    try {
      await completeQuiz();
      navigate("/result");
    } catch (error) {
      console.error("Error completing quiz:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Logo className="mb-8" />
        <div className="text-center">
          <p className="text-lg">Carregando questão...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Logo className="mb-8" />
      
      {currentQuestion && (
        <QuizCard
          headerContent={
            <div className="space-y-2">
              <ProgressBar currentStep={currentQuestionId} totalSteps={totalQuestions} />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Pergunta {currentQuestionId} de {totalQuestions}</span>
              </div>
            </div>
          }
          footerContent={
            <QuizNavigation
              onNext={nextQuestion}
              onPrev={prevQuestion}
              onComplete={handleCompleteQuiz}
              canGoNext={canGoNext}
              isLastQuestion={isLastQuestion}
            />
          }
        >
          <QuizQuestion
            question={currentQuestion}
            answer={currentAnswer}
            onAnswer={answerQuestion}
          />
        </QuizCard>
      )}
    </div>
  );
};

export default Quiz;
