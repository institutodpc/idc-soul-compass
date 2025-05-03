
import React from "react";
import { Profile } from "@/types/quiz";

interface ProfileRefugeProps {
  profile: Profile;
}

const ProfileRefuge: React.FC<ProfileRefugeProps> = ({ profile }) => {
  if (!profile.refuge) return null;
  
  return (
    <div className="bg-gradient-to-br from-persona-orange to-persona-pink p-[3px] rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
      <div className="bg-white h-full rounded-lg p-8 backdrop-blur-sm">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-persona-gradient text-center mb-8">
          REFÚGIO QUE PROCURA
        </h3>
        
        <div className="space-y-6">
          {profile.refuge && (
            <p className="text-gray-700 leading-relaxed">{profile.refuge}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileRefuge;
