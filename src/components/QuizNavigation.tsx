
import React from "react";
import GradientButton from "@/components/GradientButton";
import { Button } from "@/components/ui/button";

interface QuizNavigationProps {
  onNext: () => void;
  onPrev: () => void;
  onComplete?: () => void;
  canGoNext: boolean;
  isLastQuestion: boolean;
  className?: string;
}

const QuizNavigation: React.FC<QuizNavigationProps> = ({
  onNext,
  onPrev,
  onComplete,
  canGoNext,
  isLastQuestion,
  className = "",
}) => {
  return (
    <div className={`flex justify-between w-full items-center ${className}`}>
      <Button 
        variant="outline" 
        onClick={onPrev}
        className="px-6 py-2 text-base backdrop-blur-sm bg-white/50 hover:bg-white/70 transition-all duration-300"
      >
        Anterior
      </Button>
      
      {isLastQuestion ? (
        <GradientButton 
          onClick={onComplete} 
          disabled={!canGoNext}
          className="px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
        >
          Finalizar
        </GradientButton>
      ) : (
        <GradientButton 
          onClick={onNext} 
          disabled={!canGoNext}
          className="px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
        >
          Próxima
        </GradientButton>
      )}
    </div>
  );
};

export default QuizNavigation;
