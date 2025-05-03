
import React from "react";
import { Profile } from "@/types/quiz";

interface ProfileHeaderProps {
  profile: Profile | null;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  if (!profile) {
    return (
      <div className="text-center p-6 bg-white rounded-lg shadow">
        <p className="text-lg text-red-500">Não foi possível encontrar seu perfil principal.</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl mb-16">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-persona-orange/20 to-transparent rounded-br-full" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-persona-pink/20 to-transparent rounded-tl-full" />
      
      <div className="relative z-10 p-8">
        {/* Main heading with elegant typography */}
        <h1 className="text-center text-2xl font-medium mb-2">
          Seu perfil principal é:
        </h1>
        
        {/* Profile name with gradient highlight */}
        <h2 className="text-center text-4xl font-bold text-transparent bg-clip-text bg-persona-gradient uppercase mb-6">
          {profile.name}
        </h2>
        
        {/* Profile description with improved typography */}
        <p className="text-center text-gray-700 max-w-2xl mx-auto mb-10 text-lg">
          {profile.description}
        </p>
      </div>
    </div>
  );
};

export default ProfileHeader;
