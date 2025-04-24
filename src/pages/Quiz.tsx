
import React, { useEffect, useState } from "react";
import { useQuizContext } from "@/context/QuizContext";
import { getQuestionById, getTotalQuestions } from "@/services/quizService";
import QuizCard from "@/components/QuizCard";
import ProgressBar from "@/components/ProgressBar";
import QuizQuestion from "@/components/QuizQuestion";
import QuizNavigation from "@/components/QuizNavigation";
import UserRegistrationForm from "@/components/UserRegistrationForm";
import { User, Question } from "@/types/quiz";
import ResultCard from "@/components/ResultCard";
import Logo from "@/components/Logo";

const Quiz: React.FC = () => {
  const {
    currentQuestionId,
    answers,
    isCompleted,
    result,
    user,
    answerQuestion,
    nextQuestion,
    prevQuestion,
    completeQuiz,
    setUserData,
    resetQuiz,
  } = useQuizContext();

  const [showRegistration, setShowRegistration] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const currentAnswer = answers.find(a => a.questionId === currentQuestionId);
  const isLastQuestion = currentQuestionId === totalQuestions;
  const canGoNext = !!currentAnswer;

  // Load question data
  useEffect(() => {
    const loadQuestionData = async () => {
      setIsLoading(true);
      try {
        // Fetch total questions count
        const total = await getTotalQuestions();
        setTotalQuestions(total);
        
        // Fetch current question
        const question = await getQuestionById(currentQuestionId);
        setCurrentQuestion(question || null);
      } catch (error) {
        console.error("Error loading question data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadQuestionData();
  }, [currentQuestionId]);

  // When all questions are answered, show registration form
  useEffect(() => {
    if (isLastQuestion && canGoNext && !showRegistration && !isCompleted) {
      setShowRegistration(true);
    }
  }, [isLastQuestion, canGoNext, showRegistration, isCompleted]);

  const handleRegistrationSubmit = (userData: User) => {
    setUserData(userData);
    completeQuiz();
    setShowRegistration(false);
  };

  // Show result page if quiz is completed
  if (isCompleted && result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Logo className="mb-8" />
        
        <div className="w-full max-w-4xl space-y-8">
          <ResultCard 
            profile={result.primaryProfile} 
            isPrimary={true} 
            onReset={resetQuiz} 
          />
          
          {result.secondaryProfiles.length > 0 && (
            <>
              <h3 className="text-xl font-semibold text-center mt-8 mb-4">
                Seus perfis secundários são:
              </h3>
              
              <div className="grid gap-6 md:grid-cols-2">
                {result.secondaryProfiles.map((profile) => (
                  <ResultCard 
                    key={profile.id} 
                    profile={profile} 
                    onReset={resetQuiz} 
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Show registration form
  if (showRegistration) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Logo className="mb-8" />
        
        <QuizCard 
          headerContent={
            <div className="text-center">
              <h2 className="text-2xl font-bold">Pronto para descobrir seu perfil?</h2>
              <p className="text-muted-foreground mt-2">
                Cadastre-se para ver seu resultado!
              </p>
            </div>
          }
        >
          <UserRegistrationForm onSubmit={handleRegistrationSubmit} />
        </QuizCard>
      </div>
    );
  }

  // Show loading state
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

  // Show the quiz question
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
                <span>{currentQuestion.category}</span>
              </div>
            </div>
          }
          footerContent={
            <QuizNavigation
              onNext={nextQuestion}
              onPrev={prevQuestion}
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
