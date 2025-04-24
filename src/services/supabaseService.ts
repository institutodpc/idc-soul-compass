
import { supabase } from "@/integrations/supabase/client";
import { Question, Profile, QuestionWeight, UserAnswer, User, QuizResult } from "@/types/quiz";

// Fetch questions from database
export const fetchQuestions = async (): Promise<Question[]> => {
  const { data, error } = await supabase
    .from('questions')
    .select('*');
  
  if (error) throw error;
  return data || [];
};

// Save user answers
export const saveAnswers = async (answers: UserAnswer[]): Promise<void> => {
  const { error } = await supabase
    .from('answers')
    .insert(answers.map(answer => ({
      question_id: answer.questionId,
      value: answer.value,
      user_id: supabase.auth.getUser().then(({ data }) => data.user?.id)
    })));
  
  if (error) throw error;
};

// Save user profile
export const saveUserProfile = async (user: User): Promise<void> => {
  const { error } = await supabase
    .from('users')
    .insert({
      id: (await supabase.auth.getUser()).data.user?.id,
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
    name: profile.nome,
    description: profile.descricao,
    verse: profile.versiculo,
    tip: profile.dica,
    practice: profile.pratica
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
    profileId: weight.profile_id,
    weight: weight.weight
  })) || [];
};
