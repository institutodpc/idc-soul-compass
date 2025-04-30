
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
import { toast } from "sonner";

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
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCompletingQuiz, setIsCompletingQuiz] = useState<boolean>(false);
  
  const currentAnswer = answers.find(a => a.questionId === currentQuestionId);
  const isLastQuestion = currentQuestionId === totalQuestions;
  const canGoNext = !!currentAnswer;

  // Reset selectedAnswer when the question changes
  useEffect(() => {
    const savedAnswer = answers.find(a => a.questionId === currentQuestionId);
    setSelectedAnswer(savedAnswer ? savedAnswer.value : null);
  }, [currentQuestionId, answers]);

  const handleNextQuestion = () => {
    // Reseta o selectedAnswer antes de ir para a próxima questão
    setSelectedAnswer(null);
    nextQuestion();
  };

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

  const handleAnswerQuestion = async (questionId: number, value: number) => {
    try {
      setSelectedAnswer(value);
      
      // Use upsert instead of separate insert/update
      const { data, error } = await supabase
        .from('answers')
        .upsert({
          question_id: questionId,
          value: value,
          user_id: user?.id
        }, {
          onConflict: 'user_id,question_id'
        });
  
      if (error) {
        console.error('Error saving answer:', error);
        toast.error('Erro ao salvar resposta. Por favor, tente novamente.');
        return;
      }
      
      answerQuestion(questionId, value);
    } catch (error) {
      console.error('Error saving answer:', error);
      toast.error('Erro ao salvar resposta. Por favor, tente novamente.');
    }
  };

  const handleCompleteQuiz = async () => {
    try {
      setIsCompletingQuiz(true);
      
      // Verifica se todas as questões foram respondidas
      if (answers.length < totalQuestions) {
        const missingQuestions = totalQuestions - answers.length;
        toast.error(`Faltam ${missingQuestions} questões para completar o quiz.`);
        return;
      }
  
      // Verifica se há respostas inválidas - ajustando para o range correto (0-3)
      const invalidAnswers = answers.filter(a => a.value < 0 || a.value > 3);
      if (invalidAnswers.length > 0) {
        toast.error("Algumas respostas são inválidas. Por favor, revise suas respostas.");
        return;
      }
  
      // Adiciona log para debug
      console.log('Enviando respostas:', answers);
  
      const result = await completeQuiz();
      
      // Adiciona log para debug do resultado
      console.log('Resultado do cálculo:', result);
      
      if (!result) {
        toast.error("Erro ao calcular perfis. Por favor, verifique se todas as respostas foram salvas corretamente.");
        return;
      }
      
      // Se chegou aqui, significa que deu tudo certo
      navigate("/result");
    } catch (error) {
      console.error("Erro detalhado ao completar quiz:", error);
      toast.error("Erro ao processar respostas. Detalhes no console para debug.");
    } finally {
      setIsCompletingQuiz(false);
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-white to-blue-50">
      <Logo className="mb-8" />
      
      {currentQuestion && (
        <QuizCard
          className="backdrop-blur-md bg-white/80 border border-gray-100 shadow-xl"
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
              onNext={handleNextQuestion}
              onPrev={prevQuestion}
              onComplete={handleCompleteQuiz}
              canGoNext={canGoNext}
              isLastQuestion={isLastQuestion}
              className="mt-6"
            />
          }
        >
          <QuizQuestion
            question={currentQuestion}
            answer={currentAnswer}
            onAnswer={handleAnswerQuestion}
            selectedValue={selectedAnswer}
          />
        </QuizCard>
      )}
    </div>
  );
};

export default Quiz;
