
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Profile } from "@/types/quiz";
import { Lock } from "lucide-react";

interface ResultCardProps {
  profile: Profile;
  isPrimary?: boolean;
  isLocked?: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({ profile, isPrimary = false, isLocked = false }) => {
  return (
    <Card className={`w-full max-w-lg shadow-lg border-0 relative ${isPrimary ? "bg-gradient-to-r from-persona-orange/10 to-persona-pink/10" : ""}`}>
      {isLocked && (
        <div className="absolute inset-0 backdrop-blur-md flex flex-col items-center justify-center z-10 bg-white/30 rounded-lg">
          <Lock className="h-12 w-12 text-gray-500 mb-2" />
          <p className="font-semibold text-gray-600 text-lg">Disponível para Assinantes</p>
        </div>
      )}
      
      <CardHeader className="text-center">
        <h3 className={`text-2xl font-bold ${isPrimary ? "text-transparent bg-clip-text bg-persona-gradient" : ""}`}>
          {isPrimary ? `Seu perfil principal é: ${profile.name}` : profile.name}
        </h3>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <p className="text-lg italic text-center">{profile.description}</p>
        
        {!isLocked && (
          <div className="space-y-6 pt-4">
            {profile.refuge && (
              <div className="flex items-start">
                <span className="text-xl mr-3">📌</span>
                <div>
                  <p className="font-semibold">Refúgio que procura</p>
                  <p>{profile.refuge}</p>
                </div>
              </div>
            )}
            
            {profile.biblical_character && (
              <div className="flex items-start">
                <span className="text-xl mr-3">📖</span>
                <div>
                  <p className="font-semibold">Personagem bíblico que viveu isso</p>
                  <p>{profile.biblical_character}</p>
                </div>
              </div>
            )}
            
            {profile.exaltation && (
              <div className="flex items-start">
                <span className="text-xl mr-3">✨</span>
                <div>
                  <p className="font-semibold">Como Deus o exaltou</p>
                  <p>{profile.exaltation}</p>
                </div>
              </div>
            )}
            
            {profile.formation && (
              <div className="flex items-start">
                <span className="text-xl mr-3">🧠</span>
                <div>
                  <p className="font-semibold">Como esse perfil se forma</p>
                  <p>{profile.formation}</p>
                </div>
              </div>
            )}
            
            {profile.common_pains && (
              <div className="flex items-start">
                <span className="text-xl mr-3">💔</span>
                <div>
                  <p className="font-semibold">Dores em comum</p>
                  <p>{profile.common_pains}</p>
                </div>
              </div>
            )}
            
            {profile.steps_to_exit && (
              <div className="flex items-start">
                <span className="text-xl mr-3">🛤️</span>
                <div>
                  <p className="font-semibold">O que precisa fazer para sair desse perfil</p>
                  <p>{profile.steps_to_exit}</p>
                </div>
              </div>
            )}
            
            {profile.prophetic_summary && (
              <div className="flex items-start">
                <span className="text-xl mr-3">⚔️</span>
                <div>
                  <p className="font-semibold">Resumo Profético</p>
                  <p>{profile.prophetic_summary}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultCard;
