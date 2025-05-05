
import React from "react";
import { UserProfileScore, Profile } from "@/types/quiz";
import { Progress } from "@/components/ui/progress";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface ProfileScoresProps {
  scores: UserProfileScore[];
  profiles: Profile[];
}

const ProfileScores: React.FC<ProfileScoresProps> = ({ scores, profiles }) => {
  // Sort scores from highest to lowest
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-persona-gradient text-center mb-8">
        PONTUAÇÃO POR PERFIL
      </h3>
      
      <div className="space-y-6">
        {sortedScores.map((score) => {
          const profile = profiles.find(p => p.id === score.profileId);
          if (!profile) return null;
          
          return (
            <div key={score.profileId} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{profile.name}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="inline-flex items-center justify-center rounded-full w-5 h-5">
                          <Info className="h-4 w-4 text-gray-400" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{profile.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className="font-medium">{score.score}%</span>
              </div>
              <Progress value={score.score} className="h-2" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileScores;
