
import { UserAnswer, Profile, QuizResult } from "@/types/quiz";
import { fetchProfiles, fetchProfileWeights, fetchQuestions } from "./supabaseService";

let cachedProfiles: Profile[] | null = null;
let cachedWeights: any[] | null = null;
let cachedQuestions: any[] | null = null;

// Calculate quiz results based on user answers
export const calculateResults = async (answers: UserAnswer[]): Promise<QuizResult> => {
  // Fetch profiles and weights if not cached
  if (!cachedProfiles) {
    cachedProfiles = await fetchProfiles();
  }
  if (!cachedWeights) {
    cachedWeights = await fetchProfileWeights();
  }

  // Initialize scores for each profile
  const profileScores = cachedProfiles.map(profile => {
    // Calculate max possible score for this profile
    const maxPossibleScore = getMaxPossibleScore(profile.id, cachedWeights);
    
    return {
      profile,
      score: 0,
      maxPossibleScore,
      normalizedScore: 0,
      questionCount: 0
    };
  });

  // Track questions answered per profile
  const profileQuestions: Record<number, Set<number>> = {};
  cachedProfiles?.forEach(profile => {
    profileQuestions[profile.id] = new Set();
  });

  // Calculate raw scores
  answers.forEach(answer => {
    const relevantWeights = cachedWeights?.filter(w => w.questionId === answer.questionId) || [];
    
    relevantWeights.forEach(weight => {
      const profileScore = profileScores.find(p => p.profile.id === weight.profileId);
      if (profileScore) {
        profileScore.score += weight.weight * answer.value;
        profileQuestions[weight.profileId]?.add(answer.questionId);
      }
    });
  });

  // Update question counts and calculate normalized scores
  profileScores.forEach(profileScore => {
    profileScore.questionCount = profileQuestions[profileScore.profile.id]?.size || 0;
    
    if (profileScore.maxPossibleScore > 0) {
      profileScore.normalizedScore = (profileScore.score / profileScore.maxPossibleScore) * 100;
    }
  });

  console.log("Profile scores calculated:", profileScores.map(p => ({
    id: p.profile.id,
    name: p.profile.name,
    score: p.score,
    maxScore: p.maxPossibleScore,
    normalized: p.normalizedScore,
    questions: p.questionCount
  })));

  // Sort by normalized score
  const sortedProfiles = [...profileScores]
    .sort((a, b) => b.normalizedScore - a.normalizedScore);

  // Select primary profile
  const primaryProfile = sortedProfiles[0].profile;
  
  // Select secondary profiles
  const secondaryProfiles = sortedProfiles
    .filter(p => p.profile.id !== primaryProfile.id && p.normalizedScore >= 50)
    .slice(0, 2)
    .map(p => p.profile);

  return {
    primaryProfile,
    secondaryProfiles,
    scores: sortedProfiles.map(p => ({
      profileId: p.profile.id,
      score: p.normalizedScore,
      questionCount: p.questionCount
    }))
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
