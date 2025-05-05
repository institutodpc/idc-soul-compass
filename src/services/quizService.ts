
import { UserAnswer, Profile, QuizResult, ProfileHierarchy, UserProfileScore } from "@/types/quiz";
import { fetchProfiles, fetchProfileWeights, fetchQuestions, fetchProfileHierarchy, saveUserProfileScores } from "./supabaseService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

let cachedProfiles: Profile[] | null = null;
let cachedWeights: any[] | null = null;
let cachedQuestions: any[] | null = null;
let cachedProfileHierarchy: ProfileHierarchy[] | null = null;

// Calculate quiz results based on user answers
export const calculateResults = async (answers: UserAnswer[]): Promise<QuizResult> => {
  try {
    // Fetch profiles and weights if not cached
    if (!cachedProfiles) {
      cachedProfiles = await fetchProfiles();
    }
    if (!cachedWeights) {
      cachedWeights = await fetchProfileWeights();
    }
    if (!cachedProfileHierarchy) {
      try {
        cachedProfileHierarchy = await fetchProfileHierarchy();
      } catch (error) {
        console.error("Error fetching profile hierarchy:", error);
        cachedProfileHierarchy = [];
      }
    }

    // Initialize scores for each profile with hierarchy data
    const profileScores = cachedProfiles.map(profile => {
      // Find hierarchy data for this profile
      const hierarchyData = cachedProfileHierarchy?.find(h => h.profileId === profile.id);
      const hierarchyPosition = hierarchyData?.hierarchyPosition || 999;
      const dominanceLevel = hierarchyData?.dominanceLevel || 'LOW';
      
      // Calculate hierarchy weight factor based on dominance level
      // Higher dominance gets stronger influence
      let hierarchyFactor = 1.0;
      if (dominanceLevel === 'HIGH') {
        hierarchyFactor = 1.25; // Increased from 1.2 to give more weight
      } else if (dominanceLevel === 'MEDIUM') {
        hierarchyFactor = 1.15; // Increased from 1.1 to give more weight
      }

      return {
        profile,
        score: 0,
        maxPossibleScore: getMaxPossibleScore(profile.id, cachedWeights),
        normalizedScore: 0,
        hierarchyPosition: hierarchyPosition,
        dominanceLevel: dominanceLevel,
        hierarchyFactor: hierarchyFactor
      };
    });

    // Calculate raw scores
    answers.forEach(answer => {
      const relevantWeights = cachedWeights.filter(w => w.questionId === answer.questionId);
      
      relevantWeights.forEach(weight => {
        const profileScore = profileScores.find(p => p.profile.id === weight.profileId);
        if (profileScore) {
          profileScore.score += weight.weight * answer.value;
        }
      });
    });

    // Calculate normalized scores with hierarchy influence
    profileScores.forEach(profileScore => {
      if (profileScore.maxPossibleScore > 0) {
        // Apply hierarchy factor to influence the score
        const baseScore = (profileScore.score / profileScore.maxPossibleScore) * 100;
        
        // Apply hierarchy factor and ensure score doesn't exceed 100
        profileScore.normalizedScore = Math.min(100, baseScore * profileScore.hierarchyFactor);
      }
    });

    // Sort by normalized score, then by hierarchy position if scores are close
    // Widened the range to 15% to give hierarchy position more influence
    const sortedProfiles = [...profileScores]
      .sort((a, b) => {
        // Use a wider range (15%) for considering hierarchy position
        if (Math.abs(b.normalizedScore - a.normalizedScore) < 15) {
          return a.hierarchyPosition - b.hierarchyPosition;
        }
        return b.normalizedScore - a.normalizedScore;
      });

    // Save scores to database
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const userProfileScores: UserProfileScore[] = sortedProfiles.map(p => ({
          profileId: p.profile.id,
          score: Math.round(p.normalizedScore)
        }));
        
        await saveUserProfileScores(user.id, userProfileScores);
      }
    } catch (error) {
      console.error("Failed to save user profile scores:", error);
      toast.error("Erro ao salvar seus resultados, mas você ainda pode vê-los");
    }

    // Select primary profile
    const primaryProfile = sortedProfiles[0].profile;
    
    // Select secondary profiles
    const secondaryProfiles = sortedProfiles
      .filter(p => p.profile.id !== primaryProfile.id && p.normalizedScore >= 50)
      .slice(0, 2)
      .map(p => p.profile);

    // Add profile scores to result
    const profileScoresResult = sortedProfiles.map(p => ({
      profileId: p.profile.id,
      score: Math.round(p.normalizedScore)
    }));

    return {
      primaryProfile,
      secondaryProfiles,
      profileScores: profileScoresResult
    };
  } catch (error) {
    console.error("Error calculating quiz results:", error);
    throw error;
  }
};

// Get maximum possible score for a profile
const getMaxPossibleScore = (profileId: number, weights: any[]): number => {
  return weights
    .filter(w => w.profileId === profileId)
    .reduce((sum, weight) => sum + (weight.weight * 3), 0);
};

// Get all questions (with caching)
export const getQuestions = async () => {
  if (!cachedQuestions) {
    cachedQuestions = await fetchQuestions();
  }
  return cachedQuestions;
};

// Get a specific question by ID
export const getQuestionById = async (id: number) => {
  const questions = await getQuestions();
  return questions.find(q => q.id === id);
};

// Get total number of questions
export const getTotalQuestions = async () => {
  const questions = await getQuestions();
  return questions.length;
};
