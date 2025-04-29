
import { useReducer, useCallback } from 'react';
import { QuizState, QuizAction } from '@/types/quizContext';
import { UserAnswer, User } from '@/types/quiz';
import { saveAnswers, saveUserProfile } from '@/services/supabaseService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Initial state for quiz
const initialState: QuizState = {
  currentQuestionId: 1,
  answers: [],
  isCompleted: false,
  result: null,
  user: null,
  hasLoadedProgress: false
};

// Reducer to handle quiz state changes
const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case 'START_QUIZ':
      return {
        ...initialState,
        user: state.user // Keep user info when restarting
      };
    
    case 'SET_CURRENT_QUESTION':
      return {
        ...state,
        currentQuestionId: action.payload
      };
    
    case 'ANSWER_QUESTION': {
      const { questionId, value } = action.payload;
      const newAnswers = [...state.answers];
      const existingAnswerIndex = newAnswers.findIndex(a => a.questionId === questionId);
      const answerValue = value as 0 | 1 | 2 | 3;
      
      if (existingAnswerIndex !== -1) {
        newAnswers[existingAnswerIndex] = { questionId, value: answerValue };
      } else {
        newAnswers.push({ questionId, value: answerValue });
      }
      
      return {
        ...state,
        answers: newAnswers
      };
    }
    
    case 'COMPLETE_QUIZ':
      return {
        ...state,
        isCompleted: true
      };
    
    case 'SET_USER':
      return {
        ...state,
        user: action.payload
      };
    
    case 'SET_ANSWERS':
      return {
        ...state,
        answers: action.payload
      };
      
    case 'SET_HAS_LOADED_PROGRESS':
      return {
        ...state,
        hasLoadedProgress: action.payload
      };
      
    case 'RESET_QUIZ':
      return initialState;
      
    default:
      return state;
  }
};

export const useQuizState = () => {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const startQuiz = useCallback(() => {
    dispatch({ type: 'START_QUIZ' });
  }, []);

  const setCurrentQuestion = useCallback((questionId: number) => {
    dispatch({ type: 'SET_CURRENT_QUESTION', payload: questionId });
  }, []);

  const answerQuestion = useCallback(async (questionId: number, value: number) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        console.error("User not authenticated");
        return;
      }
      
      dispatch({ type: 'ANSWER_QUESTION', payload: { questionId, value } });
      
      // Save to database
      try {
        await saveAnswers([{ questionId, value: value as 0 | 1 | 2 | 3 }]);
      } catch (error) {
        console.error("Error saving answer:", error);
        // Continue even if saving fails
      }
    } catch (error) {
      console.error("Error in answerQuestion:", error);
    }
  }, []);

  const nextQuestion = useCallback(() => {
    setCurrentQuestion(state.currentQuestionId + 1);
  }, [state.currentQuestionId, setCurrentQuestion]);

  const prevQuestion = useCallback(() => {
    if (state.currentQuestionId > 1) {
      setCurrentQuestion(state.currentQuestionId - 1);
    }
  }, [state.currentQuestionId, setCurrentQuestion]);

  const completeQuiz = useCallback(async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        console.error("User not authenticated");
        throw new Error("User not authenticated");
      }
      
      if (state.user) {
        try {
          await saveUserProfile(state.user);
        } catch (profileError) {
          console.error("Error saving user profile:", profileError);
          // Continue even if profile saving fails
        }
      }
      
      // Ensure we save all remaining answers
      try {
        await saveAnswers(state.answers);
      } catch (answersError) {
        console.error("Error saving answers:", answersError);
        // Continue even if saving answers fails
      }
      
      // Mark as completed
      dispatch({ type: 'COMPLETE_QUIZ' });
      localStorage.removeItem("quizProgress");
      
    } catch (error) {
      console.error("Error completing quiz:", error);
      // Set completed anyway to ensure navigation works
      dispatch({ type: 'COMPLETE_QUIZ' });
      localStorage.removeItem("quizProgress");
    }
  }, [state.user, state.answers]);

  const setUserData = useCallback((userData: User) => {
    dispatch({ type: 'SET_USER', payload: userData });
  }, []);

  const resetQuiz = useCallback(() => {
    dispatch({ type: 'RESET_QUIZ' });
    localStorage.removeItem("quizProgress");
    toast.info("Quiz reiniciado. Suas respostas anteriores serão substituídas.");
  }, []);

  return {
    state,
    dispatch,
    startQuiz,
    answerQuestion,
    nextQuestion,
    prevQuestion,
    completeQuiz,
    setUserData,
    resetQuiz
  };
};
