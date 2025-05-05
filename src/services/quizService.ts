
import { UserAnswer, Profile, QuizResult, ProfileHierarchy, UserProfileScore } from "@/types/quiz";
import { fetchProfiles, fetchProfileWeights, fetchQuestions, fetchProfileHierarchy, saveUserProfileScores } from "./supabaseService";
import { supabase } from "@/integrations/supabase/client";

let cachedProfiles: Profile[] | null = null;
let cachedWeights: any[] | null = null;
let cachedQuestions: any[] | null = null;
let cachedProfileHierarchy: ProfileHierarchy[] | null = null;

// Calculate quiz results based on user answers
export const calculateResults = async (answers: UserAnswer[]): Promise<QuizResult> => {
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

  // Initialize scores for each profile
  const profileScores = cachedProfiles.map(profile => ({
    profile,
    score: 0,
    maxPossibleScore: getMaxPossibleScore(profile.id, cachedWeights),
    normalizedScore: 0,
    hierarchyPosition: cachedProfileHierarchy?.find(h => h.profileId === profile.id)?.hierarchyPosition || 999,
    dominanceLevel: cachedProfileHierarchy?.find(h => h.profileId === profile.id)?.dominanceLevel || 'LOW'
  }));

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

  // Calculate normalized scores
  profileScores.forEach(profileScore => {
    if (profileScore.maxPossibleScore > 0) {
      profileScore.normalizedScore = (profileScore.score / profileScore.maxPossibleScore) * 100;
    }
  });

  // Sort by normalized score, then by hierarchy position if scores are close
  const sortedProfiles = [...profileScores]
    .sort((a, b) => {
      // If scores are within 5% of each other, use hierarchy position
      if (Math.abs(b.normalizedScore - a.normalizedScore) < 5) {
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
