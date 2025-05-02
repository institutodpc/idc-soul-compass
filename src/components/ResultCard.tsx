
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
    <Card className={`w-full shadow-lg relative ${isPrimary ? "bg-gradient-to-r from-persona-orange/10 to-persona-pink/10" : ""}`}>
      {isLocked && (
        <div className="absolute inset-0 backdrop-blur-sm flex flex-col items-center justify-center z-10 bg-white/60 rounded-lg">
          <Lock className="h-10 w-10 text-persona-pink mb-2" />
          <p className="font-semibold text-gray-700 text-lg">Disponível para Assinantes</p>
        </div>
      )}
      
      <CardHeader className="text-center pb-2">
        <h3 className={`text-xl font-bold ${isPrimary ? "text-transparent bg-clip-text bg-persona-gradient" : "text-persona-pink"}`}>
          {profile.name}
        </h3>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-2">
        <p className="text-md text-center text-gray-700">{profile.description}</p>
      </CardContent>
    </Card>
  );
};

export default ResultCard;
