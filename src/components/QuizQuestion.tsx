
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Question, UserAnswer } from "@/types/quiz";

interface QuizQuestionProps {
  question: Question;
  answer: UserAnswer | undefined;
  onAnswer: (questionId: number, value: number) => void;
  selectedValue: number | null;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({ 
  question, 
  answer, 
  onAnswer,
  selectedValue 
}) => {
  const options = [
    { value: 0, label: "Nunca" },
    { value: 1, label: "Às vezes" },
    { value: 2, label: "Frequentemente" },
    { value: 3, label: "Sempre" }
  ];

  const handleValueChange = (value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      onAnswer(question.id, numValue);
    }
  };
  
  // Força o reset do RadioGroup quando a questão muda
  const radioGroupKey = `question-${question.id}`;
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-medium text-center">{question.text}</h2>
      </div>
      
      <RadioGroup
        key={radioGroupKey}
        defaultValue={undefined}
        value={selectedValue?.toString()}
        onValueChange={handleValueChange}
        className="flex flex-col md:flex-row justify-between space-y-3 md:space-y-0 md:space-x-2"
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center justify-center flex-1">
            <RadioGroupItem
              value={option.value.toString()}
              id={`answer-${question.id}-${option.value}`}
              className="peer sr-only"
            />
            <Label
              htmlFor={`answer-${question.id}-${option.value}`}
              className={`flex flex-col items-center justify-center w-full p-4 border-2 rounded-lg cursor-pointer 
                        transition-all duration-200
                        ${selectedValue === option.value 
                          ? 'border-persona-pink bg-pink-50 font-bold' 
                          : 'border-transparent hover:bg-slate-50'}`}
            >
              <span className="font-medium">{option.label}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default QuizQuestion;
