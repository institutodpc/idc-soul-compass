
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
    <Card 
      className={`w-full shadow-lg relative overflow-hidden border-0 ${
        isPrimary 
          ? "bg-gradient-to-br from-persona-orange/5 to-persona-pink/5" 
          : "bg-gradient-to-br from-persona-orange/10 via-white to-persona-pink/10"
      }`}
    >
      {/* Decorative corner gradients */}
      <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-persona-orange/20 to-transparent rounded-br-3xl" />
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-persona-pink/20 to-transparent rounded-tl-3xl" />
      
      {isLocked && (
        <div className="absolute inset-0 backdrop-blur-sm flex flex-col items-center justify-center z-10 bg-gradient-to-br from-white/70 via-white/80 to-gray-100/70 rounded-lg">
          <div className="p-3 rounded-full bg-gradient-to-r from-persona-orange to-persona-pink mb-3 shadow-lg">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <p className="font-semibold text-gray-800 text-lg">Disponível para Assinantes</p>
          <div className="mt-2 text-sm text-gray-500">Conheça os planos premium</div>
        </div>
      )}
      
      <CardHeader className="text-center pb-2 relative z-1">
        <div className={`
          inline-block px-6 py-2 rounded-full mb-1
          ${isPrimary 
            ? "bg-persona-gradient text-white" 
            : "bg-gradient-to-r from-persona-orange/20 to-persona-pink/20 text-gray-700"}
        `}>
          <h3 className={`text-xl font-bold ${isPrimary ? "" : "text-transparent bg-clip-text bg-persona-gradient"}`}>
            {profile.name}
          </h3>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-2 relative z-1">
        <p className="text-md text-center text-gray-700 px-2">{profile.description}</p>
      </CardContent>
    </Card>
  );
};

export default ResultCard;
