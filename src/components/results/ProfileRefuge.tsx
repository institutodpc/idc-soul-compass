
import React from "react";
import { Profile } from "@/types/quiz";

interface ProfileRefugeProps {
  profile: Profile;
}

const ProfileRefuge: React.FC<ProfileRefugeProps> = ({ profile }) => {
  if (!profile.refuge && !profile.biblical_character && !profile.exaltation) return null;
  
  return (
    <div className="bg-gradient-to-br from-persona-orange to-persona-pink p-[3px] rounded-xl shadow-lg">
      <div className="bg-white h-full rounded-lg p-8">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-persona-gradient text-center mb-8">
          REFÚGIO QUE PROCURA
        </h3>
        
        <div className="space-y-6">
          {profile.refuge && (
            <p className="text-gray-700">{profile.refuge}</p>
          )}
          
          {profile.biblical_character && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border-l-4 border-persona-pink">
              <h4 className="font-semibold text-gray-800">Personagem bíblico que viveu isso:</h4>
              <p className="text-gray-700 mt-2">{profile.biblical_character}</p>
            </div>
          )}
          
          {profile.exaltation && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border-l-4 border-persona-orange">
              <h4 className="font-semibold text-gray-800">Como Deus o exaltou:</h4>
              <p className="text-gray-700 mt-2">{profile.exaltation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileRefuge;
