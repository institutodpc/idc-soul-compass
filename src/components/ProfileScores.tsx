
import React from "react";
import { UserProfileScore, Profile } from "@/types/quiz";
import { Progress } from "@/components/ui/progress";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Info, Star } from "lucide-react";

interface ProfileScoresProps {
  scores: UserProfileScore[];
  profiles: Profile[];
  hierarchyData?: any[];
}

const ProfileScores: React.FC<ProfileScoresProps> = ({ scores, profiles, hierarchyData }) => {
  // Sort scores from highest to lowest
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);
  
  return (
    <TooltipProvider>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-persona-gradient text-center mb-8">
          PONTUAÇÃO POR PERFIL
        </h3>
        
        <div className="space-y-6">
          {sortedScores.map((score) => {
            const profile = profiles.find(p => p.id === score.profileId);
            if (!profile) return null;
            
            // Find hierarchy data for this profile
            const hierarchy = hierarchyData?.find(h => h.profileId === score.profileId);
            const dominanceLevel = hierarchy?.dominanceLevel || "UNKNOWN";
            
            // Color based on dominance level
            const dominanceColor = 
              dominanceLevel === "HIGH" ? "text-red-600" :
              dominanceLevel === "MEDIUM" ? "text-amber-600" : 
              "text-blue-600";
            
            return (
              <div key={score.profileId} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {dominanceLevel === "HIGH" && (
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    )}
                    <span className="font-medium">{profile.name}</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="inline-flex items-center justify-center rounded-full w-5 h-5">
                          <Info className="h-4 w-4 text-gray-400" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="max-w-xs space-y-1">
                          <p>{profile.description}</p>
                          {hierarchy && (
                            <p className={`text-sm font-medium ${dominanceColor}`}>
                              Nível de dominância: {dominanceLevel}
                            </p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="font-medium">{score.score}%</span>
                </div>
                <Progress 
                  value={score.score} 
                  className={`h-2 ${
                    dominanceLevel === "HIGH" ? "bg-red-100" : 
                    dominanceLevel === "MEDIUM" ? "bg-amber-100" : 
                    "bg-blue-100"
                  }`} 
                />
              </div>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ProfileScores;
