
import React from "react";
import { useNavigate } from "react-router-dom";
import GradientButton from "@/components/GradientButton";
import Logo from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartQuiz = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    navigate("/quiz");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 sm:p-6 bg-gradient-to-br from-white to-blue-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl text-center space-y-8 sm:space-y-12 pt-8 sm:pt-12"
      >
        <div className="flex justify-center w-full">
          <Logo size="large" className="hover:scale-105 transition-transform duration-300" />
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-6"
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-amber-500 px-4 drop-shadow-sm">
            Descubra seu Perfil Espiritual
          </h1>
          
          <div className="space-y-6 max-w-2xl mx-auto px-4">
            <p className="text-xl sm:text-2xl text-gray-700 font-medium">
              {user ? 'Pronto para descobrir seu perfil espiritual?' : 'Você está vivendo como um crente... ou como um verdadeiro cristão?'}
            </p>
            
            <p className="text-lg sm:text-xl text-gray-600">
              Descubra o que te impede de viver o propósito de Deus em sua vida através deste teste de perfil espiritual.
            </p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="pt-6"
        >
          <GradientButton 
            onClick={handleStartQuiz} 
            size="lg"
            className="text-lg sm:text-xl px-8 sm:px-12 py-5 sm:py-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            {user ? 'Iniciar Quiz' : 'Começar Agora'}
          </GradientButton>
          
          <p className="text-sm sm:text-base text-gray-500 mt-6 animate-fade-in">
            Quiz com 33 perguntas para identificar seu perfil espiritual dominante e seus comportamentos limitantes.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
