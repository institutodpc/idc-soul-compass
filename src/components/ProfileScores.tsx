
import React from "react";
import { UserProfileScore, Profile } from "@/types/quiz";
import { Progress } from "@/components/ui/progress";

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
              <div className="flex justify-between">
                <span className="font-medium">{profile.name}</span>
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
