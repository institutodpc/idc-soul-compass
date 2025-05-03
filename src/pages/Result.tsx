
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/quiz";
import { toast } from "sonner";
import ResultCard from "@/components/ResultCard";
import Logo from "@/components/Logo";
import WhatsAppInvite from "@/components/WhatsAppInvite";
import { useAuth } from "@/context/AuthContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface ProfileResult {
  profile_id: number;
  score_normalizado: number;
}

const Result = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [primaryProfile, setPrimaryProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Placeholder profiles for the locked cards
  const placeholderProfile: Profile = {
    id: 0,
    name: "Perfil Secundário",
    description: "Este é um perfil secundário disponível apenas para assinantes."
  };

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        if (!user) {
          navigate("/auth");
          return;
        }

        // Verificar respostas existentes
        const { data: answers, error: answersError } = await supabase
          .from('answers')
          .select('*')
          .eq('user_id', user.id);

        console.log("Respostas encontradas:", answers);
        if (answersError) {
          console.error("Erro ao buscar respostas:", answersError);
        }

        // Call the calcular_perfis RPC function
        console.log("Calling calcular_perfis for user:", user.id);
        const { data: profileResults, error: rpcError } = await supabase
          .rpc('calcular_perfis', { user_uuid: user.id });

        if (rpcError) {
          console.error("RPC Error:", rpcError);
          throw rpcError;
        }

        console.log("Profile results:", profileResults);
        if (!profileResults || profileResults.length === 0) {
          toast.error("Não foi possível calcular seus perfis. Tente novamente.");
          navigate("/quiz");
          return;
        }

        // Get profile details for the calculated profile IDs
        const primaryProfileId = profileResults[0].profile_id;
        console.log("Primary Profile ID:", primaryProfileId);
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', primaryProfileId)
          .single();

        if (profileError) {
          console.error("Profile Error:", profileError);
          throw profileError;
        }

        console.log("Fetched profile:", profileData);
        // Map the profile data to our Profile type
        const typedProfile: Profile = {
          id: profileData.id,
          name: profileData.nome || '',
          description: profileData.descricao || '',
          refuge: profileData.refuge || '',
          biblical_character: profileData.biblical_character || '',
          exaltation: profileData.exaltation || '',
          formation: profileData.formation || '',
          common_pains: profileData.common_pains || '',
          steps_to_exit: profileData.steps_to_exit || '',
          prophetic_summary: profileData.prophetic_summary || ''
        };

        setPrimaryProfile(typedProfile);
      } catch (error) {
        console.error("Error fetching results:", error);
        toast.error("Ocorreu um erro ao buscar seus resultados");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [user, navigate]);

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

  // Format common pains into an array
  const formatCommonPains = (painsText: string | undefined) => {
    if (!painsText) return [];
    
    // Split by ° and filter out empty lines
    return painsText.split('°')
      .map(pain => pain.trim())
      .filter(pain => pain.length > 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white to-gray-50">
        <div className="animate-pulse">
          <Logo className="mb-8" />
        </div>
        <div className="text-center bg-white p-6 rounded-xl shadow-lg">
          <p className="text-lg">Calculando seus resultados...</p>
        </div>
      </div>
    );
  }

  const exitSteps = formatExitSteps(primaryProfile?.steps_to_exit);
  const commonPains = formatCommonPains(primaryProfile?.common_pains);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Logo and header with improved styling */}
        <div className="flex justify-center mb-12">
          <Logo className="transform hover:scale-105 transition-transform duration-300" />
        </div>
        
        {/* Profile section with gradient background */}
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
            {primaryProfile && (
              <h2 className="text-center text-4xl font-bold text-transparent bg-clip-text bg-persona-gradient uppercase mb-6">
                {primaryProfile.name}
              </h2>
            )}
            
            {/* Profile description with improved typography */}
            {primaryProfile && (
              <p className="text-center text-gray-700 max-w-2xl mx-auto mb-10 text-lg">
                {primaryProfile.description}
              </p>
            )}
          </div>
        </div>
        
        {/* Main results card with gradient border */}
        <div className="mb-16">
          {primaryProfile ? (
            <div className="bg-gradient-to-r from-persona-orange to-persona-pink p-[3px] rounded-xl shadow-lg">
              <div className="bg-white rounded-lg p-8">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-persona-gradient text-center mb-8">
                  COMO ESSE PERFIL SE FORMA
                </h3>
                
                <div className="space-y-4">
                  {primaryProfile.formation && (
                    <p className="text-gray-700 text-lg leading-relaxed">{primaryProfile.formation}</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-6 bg-white rounded-lg shadow">
              <p className="text-lg text-red-500">Não foi possível encontrar seu perfil principal.</p>
            </div>
          )}
        </div>
        
        {/* Profile details grid with enhanced visuals */}
        {primaryProfile && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Left column */}
            <div className="bg-gradient-to-br from-persona-orange to-persona-pink p-[3px] rounded-xl shadow-lg">
              <div className="bg-white h-full rounded-lg p-8">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-persona-gradient text-center mb-8">
                  REFÚGIO QUE PROCURA
                </h3>
                
                <div className="space-y-6">
                  {primaryProfile.refuge && (
                    <p className="text-gray-700">{primaryProfile.refuge}</p>
                  )}
                  
                  {primaryProfile.biblical_character && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border-l-4 border-persona-pink">
                      <h4 className="font-semibold text-gray-800">Personagem bíblico que viveu isso:</h4>
                      <p className="text-gray-700 mt-2">{primaryProfile.biblical_character}</p>
                    </div>
                  )}
                  
                  {primaryProfile.exaltation && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border-l-4 border-persona-orange">
                      <h4 className="font-semibold text-gray-800">Como Deus o exaltou:</h4>
                      <p className="text-gray-700 mt-2">{primaryProfile.exaltation}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right column - Common Pains with new style */}
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
          </div>
        )}
        
        {/* Steps to exit section with FAQ-style accordion */}
        {primaryProfile && exitSteps.length > 0 && (
          <div className="mb-16">
            <div className="bg-gradient-to-r from-persona-orange to-persona-pink p-[3px] rounded-xl shadow-lg">
              <div className="bg-white rounded-lg p-8">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-persona-gradient text-center mb-8">
                  O QUE PRECISA FAZER PARA SAIR DESSE PERFIL
                </h3>
                
                <Accordion type="single" collapsible className="space-y-4">
                  {exitSteps.map((step, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`step-${index}`} 
                      className="border-0 bg-gradient-to-r from-persona-orange/10 to-persona-pink/10 rounded-lg overflow-hidden"
                    >
                      <AccordionTrigger className="px-6 py-4 hover:no-underline">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-persona-gradient flex items-center justify-center text-white font-medium">
                            {index + 1}
                          </div>
                          <h4 className="text-left font-medium text-gray-800">{step.title}</h4>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4 pt-0 pl-18">
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
        )}
        
        {/* Summary section */}
        {primaryProfile && primaryProfile.prophetic_summary && (
          <div className="mb-16">
            <div className="bg-gradient-to-r from-persona-orange to-persona-pink p-[3px] rounded-xl shadow-lg">
              <div className="bg-white rounded-lg p-8">
                <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
                  RESUMO
                </h3>
                
                <div className="space-y-4">
                  <p className="text-gray-700 text-lg leading-relaxed">{primaryProfile.prophetic_summary}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Secondary profiles with enhanced gradient styling */}
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
        
        {/* WhatsApp invite */}
        <WhatsAppInvite />
      </div>
    </div>
  );
};

export default Result;
