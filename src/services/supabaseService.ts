
import { supabase } from "@/integrations/supabase/client";
import { Question, Profile, QuestionWeight, UserAnswer, User, QuizResult, ProfileHierarchy, UserProfileScore } from "@/types/quiz";

// Fetch questions from database
export const fetchQuestions = async (): Promise<Question[]> => {
  const { data, error } = await supabase
    .from('questions')
    .select('*');
  
  if (error) throw error;
  
  // Map the data to match our Question type with proper category typing
  return data.map(q => ({
    id: q.id,
    text: q.text || '',
    category: q.category as Question['category']
  })) || [];
};

// Save user answers
export const saveAnswers = async (answers: UserAnswer[]): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;
  
  if (!userId) throw new Error("User is not authenticated");
  
  const { error } = await supabase
    .from('answers')
    .insert(answers.map(answer => ({
      question_id: answer.questionId,
      value: answer.value,
      user_id: userId
    })));
  
  if (error) throw error;
};

// Save user profile
export const saveUserProfile = async (user: User): Promise<void> => {
  const { data: { user: authUser } } = await supabase.auth.getUser();
  const userId = authUser?.id || user.id;
  
  if (!userId) throw new Error("User is not authenticated");
  
  // Use the correct field name 'nome' instead of 'name'
  const { error } = await supabase
    .from('users')
    .insert({
      id: userId,
      nome: user.name, // Map 'name' from our app to 'nome' in the database
      email: user.email,
      whatsapp: user.whatsapp
    });
  
  if (error) {
    console.error("Error saving user profile:", error);
    throw error;
  }
};

// Fetch profiles
export const fetchProfiles = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*');
  
  if (error) throw error;
  
  return data.map(profile => ({
    id: profile.id,
    name: profile.nome || '',
    description: profile.descricao || '',
    refuge: profile.refuge || '',
    biblical_character: profile.biblical_character || '',
    exaltation: profile.exaltation || '',
    formation: profile.formation || '',
    common_pains: profile.common_pains || [],
    steps_to_exit: profile.steps_to_exit || [],
    prophetic_summary: profile.prophetic_summary || ''
  })) || [];
};

// Fetch profile weights
export const fetchProfileWeights = async (): Promise<QuestionWeight[]> => {
  const { data, error } = await supabase
    .from('profile_weights')
    .select('*');
  
  if (error) throw error;
  
  return data.map(weight => ({
    questionId: weight.question_id,
    profileId: weight.profile_id || 0,
    weight: weight.weight || 0
  })) || [];
};

// New function to fetch profile hierarchy
export const fetchProfileHierarchy = async (): Promise<ProfileHierarchy[]> => {
  const { data, error } = await supabase
    .from('profile_hierarchy')
    .select('*')
    .order('hierarchy_position', { ascending: true });
  
  if (error) throw error;
  
  return data.map(hierarchy => ({
    profileId: hierarchy.profile_id,
    hierarchyPosition: hierarchy.hierarchy_position,
    dominanceLevel: hierarchy.dominance_level
  })) || [];
};

// New function to fetch user profile scores
export const fetchUserProfileScores = async (userId: string): Promise<UserProfileScore[]> => {
  const { data, error } = await supabase
    .from('user_profile_scores')
    .select('*')
    .eq('user_id', userId);
  
  if (error) throw error;
  
  return data.map(score => ({
    profileId: score.profile_id,
    score: score.score
  })) || [];
};

// New function to save user profile scores
export const saveUserProfileScores = async (userId: string, scores: UserProfileScore[]): Promise<void> => {
  // First delete existing scores for this user to avoid duplicates
  const { error: deleteError } = await supabase
    .from('user_profile_scores')
    .delete()
    .eq('user_id', userId);
  
  if (deleteError) throw deleteError;
  
  // Then insert the new scores
  const { error } = await supabase
    .from('user_profile_scores')
    .insert(scores.map(score => ({
      user_id: userId,
      profile_id: score.profileId,
      score: score.score
    })));
  
  if (error) throw error;
};
