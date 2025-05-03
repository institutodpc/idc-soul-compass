
import React from "react";
import Logo from "@/components/Logo";

const LoadingState: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white to-gray-50">
      <div className="animate-pulse">
        <Logo className="mb-8" />
      </div>
      <div className="text-center bg-white p-6 rounded-xl shadow-lg">
        <p className="text-lg">Calculando seus resultados...</p>
      </div>
    </div>
  );
};

export default LoadingState;
