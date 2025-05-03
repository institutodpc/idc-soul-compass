
import React from "react";
import ResultCard from "@/components/ResultCard";
import { Profile } from "@/types/quiz";

const SecondaryProfiles: React.FC = () => {
  // Placeholder profiles for the locked cards
  const placeholderProfile: Profile = {
    id: 0,
    name: "Perfil Secundário",
    description: "Este é um perfil secundário disponível apenas para assinantes."
  };
  
  return (
    <>
      <h3 className="text-2xl font-bold text-center mt-12 mb-6 text-transparent bg-clip-text bg-persona-gradient">
        Seus perfis secundários são:
      </h3>
      
      <div className="bg-gradient-to-r from-persona-orange to-persona-pink p-[3px] rounded-xl shadow-lg mb-16">
        <div className="bg-white rounded-lg p-6">
          <div className="grid gap-8 md:grid-cols-2">
            <ResultCard 
              profile={placeholderProfile}
              isLocked={true}
            />
            <ResultCard 
              profile={placeholderProfile}
              isLocked={true}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SecondaryProfiles;
