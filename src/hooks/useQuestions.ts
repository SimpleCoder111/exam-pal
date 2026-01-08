import { useState, useEffect } from "react";

export interface ApiOption {
  optionId: number;
  optionText: string;
  isCorrect: boolean;
}

export interface ApiQuestion {
  questionId: number;
  subjectId: number;
  questionType: string;
  questionContent: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  createdBy: string;
  optionLists: ApiOption[];
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

export const useQuestions = (subjectId: number) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `http://localhost:7000/getQuestionBankBySubject?subjectId=${subjectId}`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }
        
        const apiQuestions: ApiQuestion[] = await response.json();
        
        // Transform API questions to exam format with real options
        const transformedQuestions: Question[] = apiQuestions.map((q) => {
          const options = q.optionLists.map(opt => opt.optionText);
          const correctAnswer = q.optionLists.findIndex(opt => opt.isCorrect);
          
          return {
            id: q.questionId,
            question: q.questionContent,
            options,
            correctAnswer: correctAnswer >= 0 ? correctAnswer : 0,
            difficulty: q.difficulty,
          };
        });
        
        setQuestions(transformedQuestions);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [subjectId]);

  return { questions, loading, error };
};
