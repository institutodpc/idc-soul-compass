
import { UserAnswer, Profile, QuizResult } from "@/types/quiz";
import { mockQuestions, mockProfiles, mockWeights, getMaxPossibleScore } from "@/data/mockQuizData";

// Calculate quiz results based on user answers
export const calculateResults = (answers: UserAnswer[]): QuizResult => {
  // Initialize scores for each profile
  const profileScores = mockProfiles.map(profile => ({
    profile,
    score: 0,
    maxPossibleScore: getMaxPossibleScore(profile.id),
    normalizedScore: 0
  }));

  // Calculate raw scores
  answers.forEach(answer => {
    const relevantWeights = mockWeights.filter(w => w.questionId === answer.questionId);
    
    relevantWeights.forEach(weight => {
      const profileScore = profileScores.find(p => p.profile.id === weight.profileId);
      if (profileScore) {
        profileScore.score += weight.weight * answer.value;
      }
    });
  });

  // Calculate normalized scores (percentage of max possible)
  profileScores.forEach(profileScore => {
    if (profileScore.maxPossibleScore > 0) {
      profileScore.normalizedScore = (profileScore.score / profileScore.maxPossibleScore) * 100;
    }
  });

  // Sort by normalized score (highest first)
  const sortedProfiles = [...profileScores]
    .sort((a, b) => b.normalizedScore - a.normalizedScore);

  // Select primary profile (highest score)
  const primaryProfile = sortedProfiles[0].profile;
  
  // Select secondary profiles (>50% of max possible score, excluding primary)
  const secondaryProfiles = sortedProfiles
    .filter(p => p.profile.id !== primaryProfile.id && p.normalizedScore >= 50)
    .slice(0, 2) // Limit to top 2 secondary profiles
    .map(p => p.profile);

  return {
    primaryProfile,
    secondaryProfiles
  };
};

// Get all questions
export const getQuestions = () => mockQuestions;

// Get a specific question by ID
export const getQuestionById = (id: number) => 
  mockQuestions.find(q => q.id === id);

// Get total number of questions
export const getTotalQuestions = () => mockQuestions.length;
