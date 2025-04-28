
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
    <div className={`flex justify-between w-full ${className}`}>
      <Button 
        variant="outline" 
        onClick={onPrev}
        className="border-gray-200 hover:bg-gray-50"
      >
        Anterior
      </Button>
      
      {isLastQuestion ? (
        <GradientButton 
          onClick={onComplete} 
          disabled={!canGoNext}
          className="px-6 py-2"
        >
          Finalizar
        </GradientButton>
      ) : (
        <GradientButton 
          onClick={onNext} 
          disabled={!canGoNext}
          className="px-6 py-2"
        >
          Próxima
        </GradientButton>
      )}
    </div>
  );
};

export default QuizNavigation;
