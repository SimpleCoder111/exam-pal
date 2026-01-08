import { useState, useEffect } from "react";

export interface ApiQuestion {
  id: number;
  subjectId: number;
  chapterId: number;
  questionType: string;
  questionContent: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  createdBy: string;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  chapterId: number;
}

// Mock options generator - replace when API provides real options
const generateMockOptions = (questionContent: string): { options: string[]; correctAnswer: number } => {
  const mockOptionsMap: Record<number, { options: string[]; correctAnswer: number }> = {
    302: { options: ["Dennis Ritchie", "James Gosling", "Bjarne Stroustrup", "Ken Thompson"], correctAnswer: 0 },
    303: { options: ["Object-oriented", "Procedural", "Functional", "Logic"], correctAnswer: 1 },
    304: { options: ["start()", "main()", "begin()", "init()"], correctAnswer: 1 },
    305: { options: [":", ".", ";", ","], correctAnswer: 2 },
    306: { options: ["float", "char", "int", "double"], correctAnswer: 2 },
    307: { options: ["static", "const", "final", "define"], correctAnswer: 1 },
    308: { options: ["print()", "printf()", "cout", "echo()"], correctAnswer: 1 },
    309: { options: ["<stdlib.h>", "<string.h>", "<stdio.h>", "<conio.h>"], correctAnswer: 2 },
    310: { options: ["-", "*", "+", "/"], correctAnswer: 2 },
    311: { options: ["=", "==", "!=", ":="], correctAnswer: 1 },
    312: { options: ["for", "while", "if", "switch"], correctAnswer: 2 },
    313: { options: ["if-else", "for", "switch", "while"], correctAnswer: 2 },
    314: { options: ["while", "do-while", "for", "foreach"], correctAnswer: 2 },
    315: { options: ["for", "while", "do-while", "foreach"], correctAnswer: 2 },
    316: { options: ["1", "0", "-1", "Depends on compiler"], correctAnswer: 1 },
    317: { options: ["\\n", "\\0", "\\t", "NULL"], correctAnswer: 1 },
    318: { options: ["A variable", "A data type", "A reusable block of code", "A loop"], correctAnswer: 2 },
    319: { options: ["&", "*", "#", "@"], correctAnswer: 1 },
    320: { options: ["2 bytes", "4 bytes", "8 bytes", "Depends on compiler"], correctAnswer: 1 },
    321: { options: ["Print x", "Read integer into x", "Compare x", "Initialize x"], correctAnswer: 1 },
    322: { options: ["+", "*", "()", "=="], correctAnswer: 2 },
    323: { options: ["Continues to next case", "Exits the switch", "Causes error", "Restarts switch"], correctAnswer: 1 },
    324: { options: ["4 times", "5 times", "6 times", "Infinite"], correctAnswer: 1 },
    325: { options: ["By value only", "By pointer/reference", "Cannot pass arrays", "By copy"], correctAnswer: 1 },
    326: { options: ["size()", "length()", "strlen()", "strlength()"], correctAnswer: 2 },
    327: { options: ["void", "int", "float", "char"], correctAnswer: 1 },
    328: { options: ["A value", "A memory address", "A data type", "A function"], correctAnswer: 1 },
    329: { options: ["To create loops", "To group related data", "To define functions", "To allocate memory"], correctAnswer: 1 },
    330: { options: ["10", "11", "12", "Undefined behavior"], correctAnswer: 3 },
    331: { options: ["Compilation error", "Infinite loop", "Runs once", "Never runs"], correctAnswer: 1 },
    332: { options: ["int arr[10];", "int *arr = malloc(10);", "int *arr = (int*)malloc(10 * sizeof(int));", "int arr = new int[10];"], correctAnswer: 2 },
    333: { options: ["Slow performance", "Buffer overflow vulnerability", "Memory leak", "Type mismatch"], correctAnswer: 1 },
    334: { options: ["Returns 0", "Undefined behavior/crash", "Compilation error", "Returns NULL"], correctAnswer: 1 },
  };

  return mockOptionsMap[0] || { 
    options: ["Option A", "Option B", "Option C", "Option D"], 
    correctAnswer: 0 
  };
};

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
        
        // Transform API questions to exam format with mock options
        const transformedQuestions: Question[] = apiQuestions.map((q) => {
          const { options, correctAnswer } = generateMockOptions(q.questionContent);
          return {
            id: q.id,
            question: q.questionContent,
            options,
            correctAnswer,
            difficulty: q.difficulty,
            chapterId: q.chapterId,
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
