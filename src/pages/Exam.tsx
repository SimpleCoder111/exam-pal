import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, AlertCircle, Loader2 } from "lucide-react";
import QuestionCard from "@/components/exam/QuestionCard";
import ExamHeader from "@/components/exam/ExamHeader";
import QuestionNavigator from "@/components/exam/QuestionNavigator";
import SecurityWarning from "@/components/exam/SecurityWarning";
import ExamStatusBar from "@/components/exam/ExamStatusBar";
import { useQuestions, Question } from "@/hooks/useQuestions";
import { useExamSecurity, SecurityViolation } from "@/hooks/useExamSecurity";
import { useExamCache } from "@/hooks/useExamCache";
import { toast } from "sonner";

export type { Question };

const EXAM_DURATION_MINUTES = 30;
const MAX_VIOLATIONS = 3;

const Exam = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const subjectId = parseInt(searchParams.get("subjectId") || "52");
  const examId = searchParams.get("examId") || "default";
  const isSecureMode = searchParams.get("secure") === "true";
  
  const { questions, loading, error } = useQuestions(subjectId);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_MINUTES * 60);
  const [showNavigator, setShowNavigator] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [currentViolation, setCurrentViolation] = useState<SecurityViolation | null>(null);

  // Exam cache for auto-save
  const {
    saveToCache,
    loadFromCache,
    clearCache,
    isSaving,
    lastSaved,
    isOffline,
  } = useExamCache({
    examId,
    enabled: examStarted,
    autoSaveInterval: 5000,
  });

  // Security monitoring
  const { remainingChances } = useExamSecurity({
    enabled: examStarted && isSecureMode,
    maxViolations: MAX_VIOLATIONS,
    onViolation: (violation, count) => {
      setCurrentViolation(violation);
      toast.error(`Warning ${count}/${MAX_VIOLATIONS + 1}: ${violation.message}`);
    },
    onMaxViolations: () => {
      toast.error("Maximum violations reached. Your exam has been auto-submitted.");
      handleSubmit();
    },
  });

  // Load cached data on mount
  useEffect(() => {
    const cached = loadFromCache();
    if (cached && cached.examId === examId) {
      setAnswers(cached.answers);
      setFlagged(new Set(cached.flagged));
      setCurrentQuestion(cached.currentQuestion);
      setTimeLeft(cached.timeLeft);
      setExamStarted(true);
      toast.info("Your previous progress has been restored.");
    }
  }, [examId, loadFromCache]);

  // Auto-save effect
  useEffect(() => {
    if (!examStarted) return;

    const interval = setInterval(() => {
      saveToCache({
        answers,
        flagged: Array.from(flagged),
        currentQuestion,
        timeLeft,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [examStarted, answers, flagged, currentQuestion, timeLeft, saveToCache]);

  // Timer effect
  useEffect(() => {
    if (!examStarted || loading || questions.length === 0) return;
    
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
  }, [examStarted, loading, questions.length]);

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
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        score++;
      }
    });

    // Clear cache on submit
    clearCache();

    navigate("/results", {
      state: {
        score,
        total: questions.length,
        answers,
        questions,
      },
    });
  }, [answers, navigate, questions, clearCache]);

  const goToQuestion = (index: number) => {
    setCurrentQuestion(index);
    setShowNavigator(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Failed to load questions</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  // No questions
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No questions available</h2>
          <p className="text-muted-foreground mb-4">There are no questions for this subject.</p>
          <Button onClick={() => navigate("/student/exams")}>Back to Exams</Button>
        </div>
      </div>
    );
  }

  // Start exam screen
  if (!examStarted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-lg w-full mx-4 p-8 bg-card rounded-xl border shadow-elegant">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              C Programming Exam
            </h1>
            <p className="text-muted-foreground">Subject ID: {subjectId}</p>
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between p-4 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground">Total Questions</span>
              <span className="font-semibold">{questions.length}</span>
            </div>
            <div className="flex justify-between p-4 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-semibold">{EXAM_DURATION_MINUTES} minutes</span>
            </div>
            <div className="flex justify-between p-4 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground">Difficulty Mix</span>
              <span className="font-semibold">
                {questions.filter(q => q.difficulty === "EASY").length} Easy, {" "}
                {questions.filter(q => q.difficulty === "MEDIUM").length} Medium, {" "}
                {questions.filter(q => q.difficulty === "HARD").length} Hard
              </span>
            </div>
          </div>

          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg mb-8">
            <p className="text-sm text-foreground">
              <strong>Instructions:</strong> Answer all questions. You can flag questions to review later. 
              The exam will auto-submit when time runs out.
              {isSecureMode && " Security monitoring is enabled."}
            </p>
          </div>

          <Button 
            className="w-full" 
            size="lg" 
            onClick={() => setExamStarted(true)}
          >
            Start Exam
          </Button>
        </div>
      </div>
    );
  }

  const progress = (Object.keys(answers).length / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Security Warning Overlay */}
      {isSecureMode && (
        <SecurityWarning
          violation={currentViolation}
          remainingChances={remainingChances}
          maxViolations={MAX_VIOLATIONS}
        />
      )}

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
            <span>{Object.keys(answers).length} of {questions.length} answered</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <QuestionCard
          question={currentQ}
          currentIndex={currentQuestion}
          totalQuestions={questions.length}
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
            {Object.keys(answers).length === questions.length && (
              <Button variant="success" onClick={handleSubmit}>
                Submit Exam
              </Button>
            )}
          </div>

          <Button
            variant="outline"
            onClick={() => setCurrentQuestion((prev) => Math.min(questions.length - 1, prev + 1))}
            disabled={currentQuestion === questions.length - 1}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Warning for unanswered */}
        {Object.keys(answers).length < questions.length && (
          <div className="mt-8 p-4 bg-accent/20 border border-accent/40 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-accent-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">
                {questions.length - Object.keys(answers).length} questions unanswered
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
          questions={questions}
          answers={answers}
          flagged={flagged}
          currentQuestion={currentQuestion}
          onSelect={goToQuestion}
          onClose={() => setShowNavigator(false)}
        />
      )}

      {/* Status Bar */}
      {isSecureMode && (
        <ExamStatusBar
          remainingChances={remainingChances}
          maxViolations={MAX_VIOLATIONS}
          isOffline={isOffline}
          lastSaved={lastSaved}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};

export default Exam;
