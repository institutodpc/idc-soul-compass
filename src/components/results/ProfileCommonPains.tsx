
import React from "react";
import { Profile } from "@/types/quiz";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

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
    <div className="bg-gradient-to-bl from-persona-orange to-persona-pink p-[3px] rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
      <div className="bg-white h-full rounded-lg p-8 backdrop-blur-sm">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-persona-gradient text-center mb-8">
          DORES EM COMUM
        </h3>
        
        <div className="space-y-4">
          {commonPains.map((pain, index) => (
            <Collapsible key={index} className="w-full">
              <CollapsibleTrigger className="flex items-center w-full p-4 rounded-lg bg-gradient-to-r from-persona-orange/10 to-persona-pink/10 text-left hover:from-persona-orange/20 hover:to-persona-pink/20 transition-all duration-300">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-persona-gradient flex items-center justify-center text-white font-medium text-sm mr-3">
                  {index + 1}
                </div>
                <span className="font-medium text-gray-800 flex-grow">{pain.length > 80 ? `${pain.substring(0, 80)}...` : pain}</span>
                <ChevronDown className="h-5 w-5 text-gray-500 transform transition-transform duration-200 flex-shrink-0" />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2 pb-4 px-4">
                <div className="ml-11 text-gray-700 leading-relaxed">
                  <p>{pain}</p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileCommonPains;
