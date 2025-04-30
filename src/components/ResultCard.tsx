
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Profile } from "@/types/quiz";

interface ResultCardProps {
  profile: Profile;
  isPrimary?: boolean;
  onReset?: () => void;
  score?: number;
}

const ResultCard: React.FC<ResultCardProps> = ({ profile, isPrimary = false, score }) => {
  return (
    <Card className={`w-full max-w-lg shadow-lg border-0 ${isPrimary ? "bg-gradient-to-r from-persona-orange/10 to-persona-pink/10" : ""}`}>
      <CardHeader className="text-center">
        <h3 className={`text-2xl font-bold ${isPrimary ? "text-transparent bg-clip-text bg-persona-gradient" : ""}`}>
          {isPrimary ? `Seu perfil principal é: ${profile.name}` : profile.name}
        </h3>
        {score !== undefined && (
          <p className="text-sm text-muted-foreground mt-1">
            Compatibilidade: {score.toFixed(1)}%
          </p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        <p className="text-lg italic text-center">{profile.description}</p>
        
        <div className="space-y-4 pt-4">
          <div className="flex items-start">
            <span className="text-xl mr-3">📖</span>
            <div>
              <p className="font-semibold">Versículo</p>
              <p>{profile.verse}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <span className="text-xl mr-3">✅</span>
            <div>
              <p className="font-semibold">Dica Prática</p>
              <p>{profile.tip}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <span className="text-xl mr-3">🎯</span>
            <div>
              <p className="font-semibold">Prática Espiritual</p>
              <p>{profile.practice}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultCard;
