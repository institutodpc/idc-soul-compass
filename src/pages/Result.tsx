
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/quiz";
import { toast } from "sonner";
import ResultCard from "@/components/ResultCard";
import Logo from "@/components/Logo";
import WhatsAppInvite from "@/components/WhatsAppInvite";
import { useAuth } from "@/context/AuthContext";

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
        <Logo className="mb-8" />
        <div className="text-center">
          <p className="text-lg">Calculando seus resultados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Logo and header */}
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        
        {/* Main heading */}
        <h1 className="text-center text-2xl font-medium mb-2">
          Seu perfil principal é:
        </h1>
        
        {/* Profile name highlight */}
        {primaryProfile && (
          <h2 className="text-center text-3xl font-bold text-persona-pink uppercase mb-6">
            {primaryProfile.name}
          </h2>
        )}
        
        {/* Profile description */}
        {primaryProfile && (
          <p className="text-center text-gray-700 max-w-2xl mx-auto mb-10">
            {primaryProfile.description}
          </p>
        )}
        
        {/* Main results card */}
        <div className="mb-12">
          {primaryProfile ? (
            <div className="bg-gradient-to-r from-persona-orange/90 to-persona-pink/90 rounded-xl p-1">
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-xl font-bold text-persona-pink text-center mb-6">
                  COMO ESSE PERFIL SE FORMA
                </h3>
                
                <div className="space-y-4">
                  {primaryProfile.formation && (
                    <p className="text-gray-700">{primaryProfile.formation}</p>
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
        
        {/* Profile details grid */}
        {primaryProfile && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Left column */}
            <div className="bg-gradient-to-r from-persona-orange/90 to-persona-pink/90 rounded-xl p-1">
              <div className="bg-white h-full rounded-lg p-6">
                <h3 className="text-xl font-bold text-persona-pink text-center mb-6">
                  REFÚGIO QUE PROCURA
                </h3>
                
                <div className="space-y-4">
                  {primaryProfile.refuge && (
                    <p className="text-gray-700">{primaryProfile.refuge}</p>
                  )}
                  
                  {primaryProfile.biblical_character && (
                    <div className="mt-4">
                      <h4 className="font-semibold">Personagem bíblico que viveu isso:</h4>
                      <p className="text-gray-700">{primaryProfile.biblical_character}</p>
                    </div>
                  )}
                  
                  {primaryProfile.exaltation && (
                    <div className="mt-4">
                      <h4 className="font-semibold">Como Deus o exaltou:</h4>
                      <p className="text-gray-700">{primaryProfile.exaltation}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right column */}
            <div className="bg-gradient-to-r from-persona-orange/90 to-persona-pink/90 rounded-xl p-1">
              <div className="bg-white h-full rounded-lg p-6">
                <h3 className="text-xl font-bold text-persona-pink text-center mb-6">
                  DORES EM COMUM
                </h3>
                
                <div className="space-y-4">
                  {primaryProfile.common_pains && (
                    <p className="text-gray-700">{primaryProfile.common_pains}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Steps to exit section */}
        {primaryProfile && primaryProfile.steps_to_exit && (
          <div className="mb-12">
            <div className="bg-gradient-to-r from-persona-orange/90 to-persona-pink/90 rounded-xl p-1">
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-xl font-bold text-persona-pink text-center mb-6">
                  O QUE PRECISA FAZER PARA SAIR DESSE PERFIL
                </h3>
                
                <div className="space-y-4">
                  <p className="text-gray-700">{primaryProfile.steps_to_exit}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Summary section */}
        {primaryProfile && primaryProfile.prophetic_summary && (
          <div className="mb-12">
            <div className="bg-gradient-to-r from-persona-orange/90 to-persona-pink/90 rounded-xl p-1">
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-xl font-bold text-center mb-6 text-gray-800">
                  RESUMO
                </h3>
                
                <div className="space-y-4">
                  <p className="text-gray-700">{primaryProfile.prophetic_summary}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Secondary profiles */}
        <h3 className="text-xl font-semibold text-center mt-12 mb-6">
          Seus perfis secundários são:
        </h3>
        
        <div className="grid gap-6 md:grid-cols-2 mb-12">
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
