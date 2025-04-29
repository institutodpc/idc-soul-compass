
import { useCallback } from 'react';
import { UserAnswer, User } from '@/types/quiz';
import { QuizState } from '@/types/quizContext';
import { toast } from 'sonner';

interface UseQuizProgressProps {
  state: QuizState;
  dispatch: React.Dispatch<any>;
}

export const useQuizProgress = ({ state, dispatch }: UseQuizProgressProps) => {
  const saveQuizProgress = useCallback(() => {
    try {
      if (!state.user) return;
      
      const progress = {
        currentQuestionId: state.currentQuestionId,
        answers: state.answers,
        user: state.user
      };
      localStorage.setItem("quizProgress", JSON.stringify(progress));
    } catch (error) {
      console.error("Failed to save quiz progress:", error);
    }
  }, [state.currentQuestionId, state.answers, state.user]);

  const loadQuizProgress = useCallback((): boolean => {
    try {
      if (state.hasLoadedProgress) {
        return false;
      }
      
      const savedProgress = localStorage.getItem("quizProgress");
      if (savedProgress) {
        const { currentQuestionId: savedQuestionId, answers: savedAnswers, user: savedUser } = JSON.parse(savedProgress);
        dispatch({ type: 'SET_CURRENT_QUESTION', payload: savedQuestionId });
        dispatch({ type: 'SET_ANSWERS', payload: savedAnswers });
        dispatch({ type: 'SET_USER', payload: savedUser });
        dispatch({ type: 'SET_HAS_LOADED_PROGRESS', payload: true });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to load quiz progress:", error);
      return false;
    }
  }, [state.hasLoadedProgress, dispatch]);

  return {
    saveQuizProgress,
    loadQuizProgress
  };
};
