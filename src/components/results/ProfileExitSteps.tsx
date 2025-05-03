
import React from "react";
import { Profile } from "@/types/quiz";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ProfileExitStepsProps {
  profile: Profile;
}

// Format exit steps into an array of ordered steps
const formatExitSteps = (stepsText: string | undefined) => {
  if (!stepsText) return [];
  
  // Split by line breaks and filter out empty lines
  const lines = stepsText.split('\n').filter(line => line.trim().length > 0);
  const steps = [];
  
  let currentStep = '';
  let currentDescription = '';
  
  for (const line of lines) {
    if (line.startsWith('>')) {
      // If we already have a step collected, push it before starting a new one
      if (currentStep) {
        steps.push({
          title: currentStep.trim(),
          description: currentDescription.trim()
        });
        currentDescription = '';
      }
      // Start a new step
      currentStep = line.substring(1).trim();
    } else if (currentStep) {
      // Add to current description
      currentDescription += ' ' + line.trim();
    }
  }
  
  // Add the last step if there is one
  if (currentStep) {
    steps.push({
      title: currentStep.trim(),
      description: currentDescription.trim()
    });
  }
  
  return steps;
};

const ProfileExitSteps: React.FC<ProfileExitStepsProps> = ({ profile }) => {
  const exitSteps = formatExitSteps(profile.steps_to_exit);
  
  if (exitSteps.length === 0) return null;
  
  return (
    <div className="mb-16">
      <div className="bg-gradient-to-r from-persona-orange to-persona-pink p-[3px] rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="bg-white rounded-lg p-8 backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-persona-gradient text-center mb-8">
            O QUE PRECISA FAZER PARA SAIR DESSE PERFIL
          </h3>
          
          <Accordion type="single" collapsible className="space-y-4">
            {exitSteps.map((step, index) => (
              <AccordionItem 
                key={index} 
                value={`step-${index}`} 
                className="border-0 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-persona-orange to-persona-pink p-[1px] rounded-lg">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline bg-white rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-persona-gradient flex items-center justify-center text-white font-medium">
                        {index + 1}
                      </div>
                      <h4 className="text-left font-medium text-gray-800">{step.title}</h4>
                    </div>
                  </AccordionTrigger>
                </div>
                <AccordionContent className="px-6 pb-4 pt-2 pl-18 bg-white border border-t-0 border-gray-100 rounded-b-lg">
                  <div className="ml-12">
                    <p className="text-gray-700 leading-relaxed">{step.description}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default ProfileExitSteps;
