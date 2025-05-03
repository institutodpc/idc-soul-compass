
import React from "react";
import { Profile } from "@/types/quiz";

interface ProfileBiblicalCharacterProps {
  profile: Profile;
}

const ProfileBiblicalCharacter: React.FC<ProfileBiblicalCharacterProps> = ({ profile }) => {
  if (!profile.biblical_character && !profile.exaltation) return null;
  
  return (
    <div className="bg-gradient-to-bl from-persona-orange to-persona-pink p-[3px] rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
      <div className="bg-white h-full rounded-lg p-8 backdrop-blur-sm">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-persona-gradient text-center mb-8">
          PERSONAGEM BÍBLICO
        </h3>
        
        <div className="space-y-6">
          {profile.biblical_character && (
            <div className="p-4 bg-gradient-to-r from-persona-orange/10 to-persona-pink/5 rounded-lg border-l-4 border-persona-orange">
              <h4 className="font-semibold text-gray-800 mb-2">Personagem bíblico que viveu isso:</h4>
              <p className="text-gray-700">{profile.biblical_character}</p>
            </div>
          )}
          
          {profile.exaltation && (
            <div className="mt-6 p-4 bg-gradient-to-r from-persona-pink/10 to-persona-orange/5 rounded-lg border-l-4 border-persona-pink">
              <h4 className="font-semibold text-gray-800 mb-2">Como Deus o exaltou:</h4>
              <p className="text-gray-700">{profile.exaltation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileBiblicalCharacter;
