
import React from "react";
import { Profile } from "@/types/quiz";

interface ProfileCommonPainsProps {
  profile: Profile;
}

// Format common pains into an array
const formatCommonPains = (painsText: string | undefined) => {
  if (!painsText) return [];
  
  // Split by ° and filter out empty lines
  return painsText.split('°')
    .map(pain => pain.trim())
    .filter(pain => pain.length > 0);
};

const ProfileCommonPains: React.FC<ProfileCommonPainsProps> = ({ profile }) => {
  const commonPains = formatCommonPains(profile.common_pains);
  
  if (commonPains.length === 0) return null;
  
  return (
    <div className="bg-gradient-to-bl from-persona-orange to-persona-pink p-[3px] rounded-xl shadow-lg">
      <div className="bg-white h-full rounded-lg p-8">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-persona-gradient text-center mb-8">
          DORES EM COMUM
        </h3>
        
        <div className="space-y-6">
          {commonPains.map((pain, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg flex items-start gap-3 ${
                index % 4 === 0 ? "bg-gradient-to-r from-persona-orange/10 to-persona-pink/5 border-l-4 border-persona-orange" :
                index % 4 === 1 ? "bg-gradient-to-l from-persona-orange/5 to-persona-pink/10 border-r-4 border-persona-pink" :
                index % 4 === 2 ? "bg-gradient-to-b from-persona-orange/10 to-persona-pink/5 border-t-4 border-persona-orange" :
                "bg-gradient-to-t from-persona-orange/5 to-persona-pink/10 border-b-4 border-persona-pink"
              }`}
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-persona-gradient flex items-center justify-center text-white font-medium text-sm">
                °
              </div>
              <p className="text-gray-700 leading-relaxed">{pain}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileCommonPains;
