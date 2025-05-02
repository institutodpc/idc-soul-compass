import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/quiz";
import { toast } from "sonner";
import ResultCard from "@/components/ResultCard";
import Logo from "@/components/Logo";
import WhatsAppInvite from "@/components/WhatsAppInvite";
import { useAuth } from "@/context/AuthContext";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
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
        
        {/* FAQ-style accordion for profile details */}
        {primaryProfile && (
          <div className="space-y-6 mb-16">
            {/* Formation section */}
            <div className="bg-gradient-to-r from-persona-orange to-persona-pink p-[3px] rounded-xl shadow-lg overflow-hidden">
              <Accordion type="single" collapsible className="bg-white rounded-lg">
                <AccordionItem value="formation" className="border-0">
                  <AccordionTrigger className="px-8 py-6 hover:no-underline group">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-persona-gradient text-white mr-4">
                        <span className="font-bold">1</span>
                      </div>
                      <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-persona-gradient group-hover:opacity-75 transition-opacity">
                        COMO ESSE PERFIL SE FORMA
                      </h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-8 pb-6 pt-2">
                    <div className="pl-14">
                      {primaryProfile.formation && (
                        <p className="text-gray-700 text-lg leading-relaxed">{primaryProfile.formation}</p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            {/* Refuge section */}
            <div className="bg-gradient-to-r from-persona-orange to-persona-pink p-[3px] rounded-xl shadow-lg overflow-hidden">
              <Accordion type="single" collapsible className="bg-white rounded-lg">
                <AccordionItem value="refuge" className="border-0">
                  <AccordionTrigger className="px-8 py-6 hover:no-underline group">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-persona-gradient text-white mr-4">
                        <span className="font-bold">2</span>
                      </div>
                      <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-persona-gradient group-hover:opacity-75 transition-opacity">
                        REFÚGIO QUE PROCURA
                      </h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-8 pb-6 pt-2">
                    <div className="pl-14 space-y-6">
                      {primaryProfile.refuge && (
                        <p className="text-gray-700">{primaryProfile.refuge}</p>
                      )}
                      
                      {primaryProfile.biblical_character && (
                        <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-persona-pink">
                          <h4 className="font-semibold text-gray-800">Personagem bíblico que viveu isso:</h4>
                          <p className="text-gray-700 mt-2">{primaryProfile.biblical_character}</p>
                        </div>
                      )}
                      
                      {primaryProfile.exaltation && (
                        <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-persona-orange">
                          <h4 className="font-semibold text-gray-800">Como Deus o exaltou:</h4>
                          <p className="text-gray-700 mt-2">{primaryProfile.exaltation}</p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            {/* Common Pains section */}
            <div className="bg-gradient-to-r from-persona-orange to-persona-pink p-[3px] rounded-xl shadow-lg overflow-hidden">
              <Accordion type="single" collapsible className="bg-white rounded-lg">
                <AccordionItem value="pains" className="border-0">
                  <AccordionTrigger className="px-8 py-6 hover:no-underline group">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-persona-gradient text-white mr-4">
                        <span className="font-bold">3</span>
                      </div>
                      <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-persona-gradient group-hover:opacity-75 transition-opacity">
                        DORES EM COMUM
                      </h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-8 pb-6 pt-2">
                    <div className="pl-14">
                      {primaryProfile.common_pains && (
                        <p className="text-gray-700">{primaryProfile.common_pains}</p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            {/* Steps to exit section */}
            {primaryProfile.steps_to_exit && (
              <div className="bg-gradient-to-r from-persona-orange to-persona-pink p-[3px] rounded-xl shadow-lg overflow-hidden">
                <Accordion type="single" collapsible className="bg-white rounded-lg">
                  <AccordionItem value="steps" className="border-0">
                    <AccordionTrigger className="px-8 py-6 hover:no-underline group">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-persona-gradient text-white mr-4">
                          <span className="font-bold">4</span>
                        </div>
                        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-persona-gradient group-hover:opacity-75 transition-opacity">
                          O QUE PRECISA FAZER PARA SAIR DESSE PERFIL
                        </h3>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-8 pb-6 pt-2">
                      <div className="pl-14">
                        <p className="text-gray-700 text-lg leading-relaxed">{primaryProfile.steps_to_exit}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
            
            {/* Summary section */}
            {primaryProfile.prophetic_summary && (
              <div className="bg-gradient-to-r from-persona-orange to-persona-pink p-[3px] rounded-xl shadow-lg overflow-hidden">
                <Accordion type="single" collapsible className="bg-white rounded-lg">
                  <AccordionItem value="summary" className="border-0">
                    <AccordionTrigger className="px-8 py-6 hover:no-underline group">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-persona-gradient text-white mr-4">
                          <span className="font-bold">5</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 group-hover:opacity-75 transition-opacity">
                          RESUMO
                        </h3>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-8 pb-6 pt-2">
                      <div className="pl-14">
                        <p className="text-gray-700 text-lg leading-relaxed">{primaryProfile.prophetic_summary}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
          </div>
        )}
        
        {/* Secondary profiles with improved card design */}
        <h3 className="text-2xl font-bold text-center mt-12 mb-6 text-transparent bg-clip-text bg-persona-gradient">
          Seus perfis secundários são:
        </h3>
        
        <div className="grid gap-8 md:grid-cols-2 mb-16">
          <ResultCard 
            profile={placeholderProfile}
            isLocked={true}
          />
          <ResultCard 
            profile={placeholderProfile}
            isLocked={true}
          />
        </div>
        
        {/* WhatsApp invite */}
        <WhatsAppInvite />
      </div>
    </div>
  );
};

export default Result;
