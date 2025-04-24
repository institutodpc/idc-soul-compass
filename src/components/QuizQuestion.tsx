
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Question, UserAnswer } from "@/types/quiz";

interface QuizQuestionProps {
  question: Question;
  answer: UserAnswer | undefined;
  onAnswer: (questionId: number, value: number) => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({ question, answer, onAnswer }) => {
  const options = [
    { value: 0, label: "Nunca" },
    { value: 1, label: "Às vezes" },
    { value: 2, label: "Frequentemente" },
    { value: 3, label: "Sempre" }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-xl font-medium text-center mb-6">{question.text}</div>
      
      <RadioGroup
        value={answer ? String(answer.value) : undefined}
        onValueChange={(value) => onAnswer(question.id, parseInt(value))}
        className="flex flex-col md:flex-row justify-between space-y-3 md:space-y-0 md:space-x-2"
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center justify-center flex-1">
            <RadioGroupItem
              value={String(option.value)}
              id={`answer-${question.id}-${option.value}`}
              className="peer sr-only"
            />
            <Label
              htmlFor={`answer-${question.id}-${option.value}`}
              className="flex flex-col items-center justify-center w-full p-4 border-2 rounded-lg cursor-pointer 
                        peer-data-[state=checked]:border-persona-pink peer-data-[state=checked]:bg-pink-50
                        hover:bg-slate-50 transition-all duration-200"
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
