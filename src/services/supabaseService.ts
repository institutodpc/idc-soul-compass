
import { supabase } from "@/integrations/supabase/client";
import { Question, Profile, QuestionWeight, UserAnswer, User, QuizResult } from "@/types/quiz";

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
  
  const { error } = await supabase
    .from('users')
    .insert({
      id: userId,
      nome: user.name,
      email: user.email,
      whatsapp: user.whatsapp
    });
  
  if (error) throw error;
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
    verse: profile.versiculo || '',
    tip: profile.dica || '',
    practice: profile.pratica || '',
    refuge: profile.refuge || '',
    biblical_character: profile.biblical_character || '',
    exaltation: profile.exaltation || '',
    formation: profile.formation || '',
    common_pains: profile.common_pains || '',
    steps_to_exit: profile.steps_to_exit || '',
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
