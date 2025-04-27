
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GradientButton from "@/components/GradientButton";
import Logo from "@/components/Logo";
import { useQuizContext } from "@/context/QuizContext";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { startQuiz, loadQuizProgress } = useQuizContext();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Check if there's a saved quiz progress and load it silently without toast
      const hasSavedProgress = localStorage.getItem("quizProgress") !== null;
      
      if (hasSavedProgress) {
        loadQuizProgress();
      }
    }
  }, [loadQuizProgress, navigate, user]);

  const handleStartQuiz = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    startQuiz();
    navigate("/quiz");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 sm:p-6 bg-gradient-to-br from-white to-blue-50">
      <div className="w-full max-w-3xl text-center space-y-6 sm:space-y-8">
        <div className="flex justify-center w-full">
          <Logo size="large" />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-amber-500 px-4">
          Descubra seu Perfil Espiritual
        </h1>
        
        <div className="space-y-4 max-w-2xl mx-auto px-4">
          <p className="text-lg sm:text-xl text-gray-700">
            <span className="font-semibold">
              {user ? 'Pronto para descobrir seu perfil espiritual?' : 'Você está vivendo como um crente... ou como um verdadeiro cristão?'}
            </span>
          </p>
          
          <p className="text-base sm:text-lg text-gray-600">
            Descubra o que te impede de viver o propósito de Deus em sua vida através deste teste de perfil espiritual.
          </p>
        </div>
        
        <div className="pt-4 sm:pt-6">
          <GradientButton 
            onClick={handleStartQuiz} 
            size="lg"
            className="text-base sm:text-lg px-6 sm:px-10 py-4 sm:py-6 animate-pulse"
          >
            {user ? 'Iniciar Quiz' : 'Começar Agora'}
          </GradientButton>
        </div>
        
        <p className="text-xs sm:text-sm text-gray-500 pt-4">
          Quiz com 33 perguntas para identificar seu perfil espiritual dominante e seus comportamentos limitantes.
        </p>
      </div>
    </div>
  );
};

export default Index;
