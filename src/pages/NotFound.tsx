
import React from "react";
import { useNavigate } from "react-router-dom";
import GradientButton from "@/components/GradientButton";
import Logo from "@/components/Logo";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white to-pink-50">
      <div className="w-full max-w-md text-center space-y-8">
        <Logo size="medium" className="mx-auto" />
        
        <h1 className="text-3xl font-bold tracking-tight">
          Página não encontrada
        </h1>
        
        <p className="text-xl text-gray-600">
          Desculpe, a página que você está procurando não existe.
        </p>
        
        <div className="pt-6">
          <GradientButton 
            onClick={() => navigate("/")}
            className="text-lg px-8"
          >
            Voltar para o início
          </GradientButton>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
