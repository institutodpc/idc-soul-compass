
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/quiz";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import WhatsAppInvite from "@/components/WhatsAppInvite";
import { useAuth } from "@/context/AuthContext";
import LoadingState from "@/components/results/LoadingState";
import ProfileHeader from "@/components/results/ProfileHeader";
import ProfileFormation from "@/components/results/ProfileFormation";
import ProfileRefuge from "@/components/results/ProfileRefuge";
import ProfileCommonPains from "@/components/results/ProfileCommonPains";
import ProfileExitSteps from "@/components/results/ProfileExitSteps";
import ProfileSummary from "@/components/results/ProfileSummary";
import SecondaryProfiles from "@/components/results/SecondaryProfiles";

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
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Logo and header with improved styling */}
        <div className="flex justify-center mb-12">
          <Logo className="transform hover:scale-105 transition-transform duration-300" />
        </div>
        
        {/* Profile header section */}
        <ProfileHeader profile={primaryProfile} />
        
        {/* Main profile details */}
        {primaryProfile && (
          <>
            <ProfileFormation profile={primaryProfile} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <ProfileRefuge profile={primaryProfile} />
              <ProfileCommonPains profile={primaryProfile} />
            </div>
            
            <ProfileExitSteps profile={primaryProfile} />
            <ProfileSummary profile={primaryProfile} />
          </>
        )}
        
        {/* Secondary profiles */}
        <SecondaryProfiles />
        
        {/* WhatsApp invite */}
        <WhatsAppInvite />
      </div>
    </div>
  );
};

export default Result;
