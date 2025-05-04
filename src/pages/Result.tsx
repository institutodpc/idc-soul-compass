
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

interface ProfileResult {
  profile_id: number;
  score_normalizado: number;
}

const Result = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [primaryProfile, setPrimaryProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

        // Call the calcular_perfis RPC function - now returns only one profile
        console.log("Calling calcular_perfis for user:", user.id);
        const { data: profileResults, error: rpcError } = await supabase
          .rpc('calcular_perfis', { user_uuid: user.id });

        if (rpcError) {
          console.error("RPC Error:", rpcError);
          throw rpcError;
        }

        console.log("Profile results:", profileResults);
        if (!profileResults || profileResults.length === 0) {
          toast.error("Não foi possível calcular seu perfil. Tente novamente.");
          navigate("/quiz");
          return;
        }

        // Get profile details for the calculated profile ID
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
          common_pains: profileData.common_pains || [],
          steps_to_exit: profileData.steps_to_exit || [],
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white to-gray-50">
        <div className="animate-pulse">
          <Logo className="mb-8" />
        </div>
        <div className="text-center bg-white p-6 rounded-xl shadow-lg">
          <p className="text-lg">Calculando seu resultado...</p>
        </div>
      </div>
    );
  }

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
              Seu perfil é:
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
            
            {/* Right column */}
            <div className="bg-gradient-to-bl from-persona-orange to-persona-pink p-[3px] rounded-xl shadow-lg">
              <div className="bg-white h-full rounded-lg p-8">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-persona-gradient text-center mb-8">
                  DORES EM COMUM
                </h3>
                
                <div className="space-y-4">
                  {primaryProfile.common_pains && primaryProfile.common_pains.length > 0 ? (
                    <ul className="space-y-3">
                      {primaryProfile.common_pains.map((pain, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-persona-orange/10 text-persona-orange mr-3 flex-shrink-0 mt-0.5">
                            •
                          </span>
                          <span className="text-gray-700">{pain}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700">Informações não disponíveis.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Steps to exit section with elegant styling */}
        {primaryProfile && primaryProfile.steps_to_exit && primaryProfile.steps_to_exit.length > 0 && (
          <div className="mb-16">
            <div className="bg-gradient-to-r from-persona-orange to-persona-pink p-[3px] rounded-xl shadow-lg">
              <div className="bg-white rounded-lg p-8">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-persona-gradient text-center mb-8">
                  O QUE PRECISA FAZER PARA SAIR DESSE PERFIL
                </h3>
                
                <Accordion type="single" collapsible className="w-full">
                  {primaryProfile.steps_to_exit.map((step, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left text-gray-800 font-medium">
                        Passo {index + 1}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-700">
                        {step}
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
        
        {/* WhatsApp invite */}
        {primaryProfile && (
          <WhatsAppInvite profileName={primaryProfile.name} />
        )}
      </div>
    </div>
  );
};

export default Result;
