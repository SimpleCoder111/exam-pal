import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, ChevronLeft, ChevronRight, Flag, AlertCircle } from "lucide-react";
import QuestionCard from "@/components/exam/QuestionCard";
import ExamHeader from "@/components/exam/ExamHeader";
import QuestionNavigator from "@/components/exam/QuestionNavigator";

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
    correctAnswer: 1,
  },
  {
    id: 4,
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: 2,
  },
  {
    id: 5,
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: 2,
  },
  {
    id: 6,
    question: "Which ocean is the largest?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswer: 3,
  },
  {
    id: 7,
    question: "What year did World War II end?",
    options: ["1943", "1944", "1945", "1946"],
    correctAnswer: 2,
  },
  {
    id: 8,
    question: "What is the speed of light in vacuum?",
    options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
    correctAnswer: 0,
  },
];

const EXAM_DURATION_MINUTES = 10;

const Exam = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_MINUTES * 60);
  const [showNavigator, setShowNavigator] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleFlagToggle = (questionId: number) => {
    setFlagged((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleSubmit = useCallback(() => {
    let score = 0;
    sampleQuestions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        score++;
      }
    });

    navigate("/results", {
      state: {
        score,
        total: sampleQuestions.length,
        answers,
        questions: sampleQuestions,
      },
    });
  }, [answers, navigate]);

  const goToQuestion = (index: number) => {
    setCurrentQuestion(index);
    setShowNavigator(false);
  };

  const progress = (Object.keys(answers).length / sampleQuestions.length) * 100;
  const currentQ = sampleQuestions[currentQuestion];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <ExamHeader
        timeLeft={timeLeft}
        formatTime={formatTime}
        onShowNavigator={() => setShowNavigator(!showNavigator)}
      />

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{Object.keys(answers).length} of {sampleQuestions.length} answered</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <QuestionCard
          question={currentQ}
          currentIndex={currentQuestion}
          totalQuestions={sampleQuestions.length}
          selectedAnswer={answers[currentQ.id]}
          isFlagged={flagged.has(currentQ.id)}
          onAnswerSelect={handleAnswerSelect}
          onFlagToggle={handleFlagToggle}
        />

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="flex gap-2">
            {Object.keys(answers).length === sampleQuestions.length && (
              <Button variant="success" onClick={handleSubmit}>
                Submit Exam
              </Button>
            )}
          </div>

          <Button
            variant="outline"
            onClick={() => setCurrentQuestion((prev) => Math.min(sampleQuestions.length - 1, prev + 1))}
            disabled={currentQuestion === sampleQuestions.length - 1}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Warning for unanswered */}
        {Object.keys(answers).length < sampleQuestions.length && (
          <div className="mt-8 p-4 bg-accent/20 border border-accent/40 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-accent-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">
                {sampleQuestions.length - Object.keys(answers).length} questions unanswered
              </p>
              <p className="text-sm text-muted-foreground">
                Answer all questions before submitting the exam.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Question Navigator Sidebar */}
      {showNavigator && (
        <QuestionNavigator
          questions={sampleQuestions}
          answers={answers}
          flagged={flagged}
          currentQuestion={currentQuestion}
          onSelect={goToQuestion}
          onClose={() => setShowNavigator(false)}
        />
      )}
    </div>
  );
};

export default Exam;
