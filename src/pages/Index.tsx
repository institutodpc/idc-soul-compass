
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GradientButton from "@/components/GradientButton";
import Logo from "@/components/Logo";
import { useQuizContext } from "@/context/QuizContext";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const { startQuiz, loadQuizProgress } = useQuizContext();

  useEffect(() => {
    // Check if there's a saved quiz progress
    const hasSavedProgress = localStorage.getItem("quizProgress") !== null;
    
    if (hasSavedProgress) {
      toast("Você tem um quiz não finalizado", {
        description: "Deseja continuar de onde parou?",
        action: {
          label: "Continuar",
          onClick: () => {
            loadQuizProgress();
            navigate("/quiz");
          },
        },
      });
    }
  }, [loadQuizProgress, navigate]);

  const handleStartQuiz = () => {
    startQuiz();
    navigate("/quiz");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white to-pink-50">
      <div className="w-full max-w-md text-center space-y-8">
        <Logo size="large" className="mx-auto" />
        
        <h1 className="text-3xl font-bold tracking-tight">
          IDC Persona.io
        </h1>
        
        <p className="text-xl text-gray-600">
          Olá, gostaria de descobrir qual perfil está vivendo?
        </p>
        
        <div className="pt-6">
          <GradientButton 
            onClick={handleStartQuiz} 
            size="lg"
            className="text-lg px-8 py-6"
          >
            Começar agora
          </GradientButton>
        </div>
        
        <p className="text-sm text-gray-500 pt-4">
          Um quiz com 33 perguntas para descobrir seu perfil espiritual e comportamental.
        </p>
      </div>
    </div>
  );
};

export default Index;
