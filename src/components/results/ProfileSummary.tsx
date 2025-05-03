
import React from "react";
import { Profile } from "@/types/quiz";

interface ProfileSummaryProps {
  profile: Profile;
}

const ProfileSummary: React.FC<ProfileSummaryProps> = ({ profile }) => {
  if (!profile.prophetic_summary) return null;
  
  return (
    <div className="mb-16">
      <div className="bg-gradient-to-r from-persona-orange to-persona-pink p-[3px] rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="bg-white rounded-lg p-8 backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-center mb-8 text-transparent bg-clip-text bg-persona-gradient">
            RESUMO
          </h3>
          
          <div className="space-y-4">
            <p className="text-gray-700 text-lg leading-relaxed">{profile.prophetic_summary}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSummary;
