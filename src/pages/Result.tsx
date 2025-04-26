
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/quiz";
import { toast } from "sonner";
import ResultCard from "@/components/ResultCard";
import Logo from "@/components/Logo";
import WhatsAppInvite from "@/components/WhatsAppInvite";
import { useAuth } from "@/context/AuthContext";
import GradientButton from "@/components/GradientButton";

interface ProfileResult {
  profile_id: number;
  score_normalizado: number;
}

const Result = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [primaryProfile, setPrimaryProfile] = useState<Profile | null>(null);
  const [secondaryProfiles, setSecondaryProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        if (!user) {
          navigate("/auth");
          return;
        }

        // Call the calcular_perfis RPC function
        const { data: profileResults, error: rpcError } = await supabase
          .rpc('calcular_perfis', { user_uuid: user.id });

        if (rpcError) {
          throw rpcError;
        }

        if (!profileResults || profileResults.length === 0) {
          toast.error("Não foi possível calcular seus perfis. Tente novamente.");
          navigate("/quiz");
          return;
        }

        // Get profile details for the calculated profile IDs
        const profileIds = profileResults.map((result: ProfileResult) => result.profile_id);
        
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', profileIds);

        if (profilesError) {
          throw profilesError;
        }

        // Map the profile data to our Profile type
        const typedProfiles: Profile[] = profiles.map(p => ({
          id: p.id,
          name: p.nome || '',
          description: p.descricao || '',
          verse: p.versiculo || '',
          tip: p.dica || '',
          practice: p.pratica || ''
        }));

        // Find the primary profile (highest score)
        const primary = typedProfiles.find(p => 
          p.id === profileResults[0].profile_id
        ) || null;

        // Find secondary profiles (up to 2)
        const secondary = typedProfiles
          .filter(p => p.id !== primary?.id)
          .slice(0, 2);

        setPrimaryProfile(primary);
        setSecondaryProfiles(secondary);
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
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Logo className="mb-8" />
        <div className="text-center">
          <p className="text-lg">Calculando seus resultados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Logo className="mb-8" />
      
      <div className="w-full max-w-4xl space-y-8">
        {primaryProfile ? (
          <ResultCard 
            profile={primaryProfile} 
            isPrimary={true} 
            onReset={() => navigate("/quiz")} 
          />
        ) : (
          <div className="text-center p-6">
            <p className="text-lg text-red-500">Não foi possível encontrar seu perfil principal.</p>
            <GradientButton onClick={() => navigate("/quiz")} className="mt-4">
              Refazer Quiz
            </GradientButton>
          </div>
        )}
        
        {secondaryProfiles.length > 0 && (
          <>
            <h3 className="text-xl font-semibold text-center mt-8 mb-4">
              Seus perfis secundários são:
            </h3>
            
            <div className="grid gap-6 md:grid-cols-2">
              {secondaryProfiles.map((profile) => (
                <ResultCard 
                  key={profile.id} 
                  profile={profile} 
                  onReset={() => navigate("/quiz")} 
                />
              ))}
            </div>
          </>
        )}
        
        <WhatsAppInvite />
      </div>
    </div>
  );
};

export default Result;
