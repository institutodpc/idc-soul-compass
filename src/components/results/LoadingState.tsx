
import React from "react";
import Logo from "@/components/Logo";
import { Loader2 } from "lucide-react";

const LoadingState: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white to-gray-50">
      <div className="animate-bounce mb-8">
        <Logo className="mb-2" size="large" />
      </div>
      
      <div className="bg-gradient-to-r from-persona-orange to-persona-pink p-[3px] rounded-xl shadow-lg max-w-md w-full">
        <div className="bg-white p-6 rounded-lg flex flex-col items-center">
          <div className="flex items-center justify-center mb-4">
            <Loader2 className="h-8 w-8 text-persona-orange animate-spin mr-2" />
            <h2 className="text-xl font-medium text-gray-800">Calculando resultados</h2>
          </div>
          <p className="text-center text-gray-600">
            Estamos analisando suas respostas para gerar seu perfil personalizado. 
            Por favor, aguarde um momento...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
