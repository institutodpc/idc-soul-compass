
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Question, UserAnswer } from "@/types/quiz";
import { motion } from "framer-motion";

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-medium text-center leading-relaxed text-gray-800">{question.text}</h2>
      </motion.div>
      
      <RadioGroup
        value={answer ? String(answer.value) : undefined}
        onValueChange={(value) => onAnswer(question.id, parseInt(value))}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {options.map((option, index) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
            key={option.value}
            className="flex items-center justify-center"
          >
            <RadioGroupItem
              value={String(option.value)}
              id={`answer-${question.id}-${option.value}`}
              className="peer sr-only"
            />
            <Label
              htmlFor={`answer-${question.id}-${option.value}`}
              className={`flex flex-col items-center justify-center w-full p-6 border-2 rounded-xl cursor-pointer 
                        transition-all duration-300 hover:shadow-md
                        ${answer !== undefined && Number(answer.value) === option.value 
                          ? 'border-persona-pink bg-pink-50/80 font-bold shadow-md scale-105' 
                          : 'hover:bg-slate-50 hover:border-gray-300'}`}
            >
              <span className="font-medium text-lg">{option.label}</span>
            </Label>
          </motion.div>
        ))}
      </RadioGroup>
    </motion.div>
  );
};

export default QuizQuestion;
