
import React from "react";
import { Profile } from "@/types/quiz";

interface ProfileFormationProps {
  profile: Profile;
}

const ProfileFormation: React.FC<ProfileFormationProps> = ({ profile }) => {
  if (!profile.formation) return null;
  
  return (
    <div className="mb-16">
      <div className="bg-gradient-to-r from-persona-orange to-persona-pink p-[3px] rounded-xl shadow-lg">
        <div className="bg-white rounded-lg p-8">
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-persona-gradient text-center mb-8">
            COMO ESSE PERFIL SE FORMA
          </h3>
          
          <div className="space-y-4">
            <p className="text-gray-700 text-lg leading-relaxed">{profile.formation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileFormation;
