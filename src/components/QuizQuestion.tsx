
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Question, UserAnswer } from "@/types/quiz";
import { 
  Heart, 
  Book, 
  Brain, 
  Users, 
  SmilePlus 
} from "lucide-react";

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

  // Get icon based on category
  const getIcon = () => {
    switch(question.category) {
      case "Comportamento Pessoal":
        return <Brain className="h-6 w-6 text-purple-500" />;
      case "Espiritualidade e Práticas Religiosas":
        return <Book className="h-6 w-6 text-blue-500" />;
      case "Atitudes em relação aos outros":
        return <Users className="h-6 w-6 text-green-500" />;
      case "Saúde emocional e mental":
        return <SmilePlus className="h-6 w-6 text-orange-500" />;
      case "Relacionamentos":
        return <Heart className="h-6 w-6 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-center gap-3 mb-6">
        {getIcon()}
        <h2 className="text-xl font-medium text-center">{question.text}</h2>
      </div>
      
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
              disabled={answer !== undefined && Number(answer.value) !== option.value}
            />
            <Label
              htmlFor={`answer-${question.id}-${option.value}`}
              className={`flex flex-col items-center justify-center w-full p-4 border-2 rounded-lg cursor-pointer 
                        transition-all duration-200
                        ${answer !== undefined && Number(answer.value) === option.value 
                          ? 'border-persona-pink bg-pink-50 font-bold' 
                          : answer !== undefined 
                            ? 'opacity-40 cursor-not-allowed' 
                            : 'hover:bg-slate-50'}`}
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
