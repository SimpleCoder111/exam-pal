import { useState, useEffect, useCallback, useRef } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, AlertCircle, Loader2 } from "lucide-react";
import QuestionCard from "@/components/exam/QuestionCard";
import ExamHeader from "@/components/exam/ExamHeader";
import QuestionNavigator from "@/components/exam/QuestionNavigator";
import SecurityWarning from "@/components/exam/SecurityWarning";
import ExamStatusBar from "@/components/exam/ExamStatusBar";
import { useExamSecurity, SecurityViolation } from "@/hooks/useExamSecurity";
import { useExamCache } from "@/hooks/useExamCache";
import { useNetworkLatency } from "@/hooks/useNetworkLatency";
import { useSaveProgress, buildSaveProgressPayload } from "@/hooks/useSaveProgress";
import { useSubmitExam, buildSubmitPayload } from "@/hooks/useSubmitExam";
import { useExamViolation } from "@/hooks/useExamViolation";
import { toast } from "sonner";
import type { TakeExamData, TakeExamQuestion } from "@/hooks/useTakeExam";
import { getClientIpAddress, getLatencyString } from "@/lib/clientInfo";

// Transformed question type for the exam UI
export interface Question {
  id: number;
  question: string;
  options: string[];
  optionIds: number[];
  correctAnswer: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  chapter: string;
  chapterId: number;
  questionType: string;
}

const MAX_VIOLATIONS = 3;

const QUESTION_TYPE_ORDER: Record<string, number> = {
  MULTIPLE_CHOICE: 0,
  TRUE_FALSE: 1,
  FILL_IN_THE_BLANK: 2,
  CODING: 3,
  WRITING: 4,
};

const transformQuestions = (apiQuestions: TakeExamQuestion[]): Question[] => {
  return [...apiQuestions]
    .sort((a, b) => (QUESTION_TYPE_ORDER[a.questionType] ?? 99) - (QUESTION_TYPE_ORDER[b.questionType] ?? 99))
    .map((q) => ({
      id: q.questionId,
      question: q.questionText || "—",
      options: q.optionLists,
      optionIds: q.optionLists.map((_, i) => i),
      correctAnswer: -1,
      difficulty: "MEDIUM" as const,
      chapter: q.chapterName || "—",
      chapterId: q.chapterId,
      questionType: q.questionType,
    }));
};

// Extract previously saved answers from API response
const extractSavedAnswers = (apiQuestions: TakeExamQuestion[]) => {
  const savedAnswers: Record<number, number> = {};
  const savedTextAnswers: Record<number, string> = {};

  apiQuestions.forEach((q) => {
    if (!q.studentAnswer) return;

    const isText = ["FILL_IN_THE_BLANK", "WRITING", "CODING"].includes(q.questionType);
    if (isText) {
      savedTextAnswers[q.questionId] = q.studentAnswer;
    } else {
      // MCQ / TRUE_FALSE — match option text to find index
      const idx = q.optionLists.findIndex(
        (opt) => opt.toLowerCase() === q.studentAnswer!.toLowerCase()
      );
      if (idx !== -1) {
        savedAnswers[q.questionId] = idx;
      }
    }
  });

  return { savedAnswers, savedTextAnswers };
};

const Exam = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const examData = location.state?.examData as TakeExamData | undefined;

  const examId = examData ? String(examData.examId) : "default";
  const examDuration = examData?.examDuration || 30;
  const isSecureMode = true;

  const questions = examData ? transformQuestions(examData.questionLists) : [];

  // Pre-populate saved answers from API response
  const initialAnswers = examData
    ? extractSavedAnswers(examData.questionLists)
    : { savedAnswers: {}, savedTextAnswers: {} };

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>(initialAnswers.savedAnswers);
  const [textAnswers, setTextAnswers] = useState<Record<number, string>>(initialAnswers.savedTextAnswers);
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(examDuration * 60);
  const [showNavigator, setShowNavigator] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [currentViolation, setCurrentViolation] = useState<SecurityViolation | null>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [clientIp, setClientIp] = useState('');

  // Network latency monitoring
  const latency = useNetworkLatency({ enabled: examStarted, interval: 15000 });

  // Exam cache for auto-save (local)
  const {
    saveToCache,
    loadFromCache,
    clearCache,
    isSaving: isCacheSaving,
    lastSaved: cacheLastSaved,
    isOffline,
  } = useExamCache({
    examId,
    enabled: examStarted,
    autoSaveInterval: 5000,
  });

  // Real save-progress API
  const saveProgressMutation = useSaveProgress();
  // Real submit API
  const submitExamMutation = useSubmitExam();
  const violationMutation = useExamViolation();
  const isSaving = isCacheSaving || saveProgressMutation.isPending;
  const lastSaved = saveProgressMutation.data?.lastSaved
    ? new Date(saveProgressMutation.data.lastSaved)
    : cacheLastSaved;

  // Map local violation types to backend violation types
  const mapViolationType = (type: string): string => {
    switch (type) {
      case 'tab_switch': return 'Switch Tab';
      case 'copy_paste': return 'Copy-Paste';
      case 'minimize': return 'Minimize Window';
      case 'dev_tools': return 'Developer Tools';
      case 'resize': return 'Window Resize';
      default: return type;
    }
  };

  // Security monitoring
  const { remainingChances } = useExamSecurity({
    enabled: examStarted && isSecureMode,
    maxViolations: MAX_VIOLATIONS,
    onViolation: (violation, count) => {
      setCurrentViolation(violation);
      toast.error(`Warning ${count}/${MAX_VIOLATIONS + 1}: ${violation.message}`);

      // Report violation to backend
      if (examData) {
        violationMutation.mutate({
          studentId: examData.studentId,
          examId: examData.examId,
          violationType: mapViolationType(violation.type),
          violationCount: count,
          examSessionId: examData.examSessionId,
        });
      }
    },
    onMaxViolations: () => {
      toast.error("Maximum violations reached. Your exam has been flagged for review.");
      // Auto-submit disabled for testing
      // handleSubmit();
    },
  });

  // Notify if answers were restored from API
  useEffect(() => {
    const hasRestoredAnswers =
      Object.keys(initialAnswers.savedAnswers).length > 0 ||
      Object.keys(initialAnswers.savedTextAnswers).length > 0;
    if (hasRestoredAnswers) {
      toast.info("📝 Your previously saved answers have been restored.", { duration: 4000 });
    }
  }, []);

  // Load cached data on mount (merge with API answers, cache takes priority for fresher data)
  useEffect(() => {
    const cached = loadFromCache();
    if (cached && cached.examId === examId) {
      setAnswers((prev) => ({ ...prev, ...cached.answers }));
      setFlagged(new Set(cached.flagged));
      setCurrentQuestion(cached.currentQuestion);
      setTimeLeft(cached.timeLeft);
      setExamStarted(true);
      toast.info("Your local progress has been restored.");
    }
  }, [examId, loadFromCache]);

  // Local cache save every 5s
  useEffect(() => {
    if (!examStarted) return;

    const cacheInterval = setInterval(() => {
      saveToCache({
        answers,
        flagged: Array.from(flagged),
        currentQuestion,
        timeLeft,
      });
    }, 5000);

    return () => clearInterval(cacheInterval);
  }, [examStarted, answers, flagged, currentQuestion, timeLeft, saveToCache]);

  // Refs to hold latest values without re-triggering the interval
  const answersRef = useRef(answers);
  const textAnswersRef = useRef(textAnswers);
  const examDataRef = useRef(examData);
  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => { textAnswersRef.current = textAnswers; }, [textAnswers]);
  useEffect(() => { examDataRef.current = examData; }, [examData]);

  // Server save function (stable reference — reads from refs)
  const serverSaveRef = useCallback(() => {
    const currentExamData = examDataRef.current;
    const currentAnswers = answersRef.current;
    const currentTextAnswers = textAnswersRef.current;
    if (!currentExamData) return;

    const hasAnswers = Object.keys(currentAnswers).length > 0 || Object.keys(currentTextAnswers).length > 0;

    if (navigator.onLine) {
      const payload = buildSaveProgressPayload(currentExamData, currentAnswers, currentTextAnswers);
      console.log('[auto-save] Sending save-progress to server...', new Date().toISOString());
      saveProgressMutation.mutate(payload, {
        onSuccess: () => {
          toast.success(
            hasAnswers
              ? "✅ Your answers have been saved to the server"
              : "✅ Session synced with server",
            { duration: 2500, id: "save-progress" }
          );
        },
        onError: (err) => {
          console.error('[auto-save] Save failed:', err);
          toast.warning("⚠️ Server save failed — your answers are safely cached locally", { duration: 3000, id: "save-progress" });
        },
      });
    } else {
      toast.info("📴 You're offline — answers saved locally and will sync when reconnected", { duration: 3000, id: "save-offline" });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // First save after 10s, then every 60s
  useEffect(() => {
    if (!examStarted || !examData) return;

    console.log('[auto-save] Setting up: initial in 10s, then every 60s');
    const initialTimeout = setTimeout(serverSaveRef, 10000);
    const serverInterval = setInterval(serverSaveRef, 60000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(serverInterval);
    };
  }, [examStarted, examData, serverSaveRef]);

  // Sync to server when coming back online
  useEffect(() => {
    if (!examStarted || !examData) return;

    const handleOnline = () => {
      toast.info("Connection restored — syncing your answers...", { duration: 3000, id: "reconnect" });
      serverSaveRef();
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [examStarted, examData, serverSaveRef]);

  // Timer effect
  useEffect(() => {
    if (!examStarted || questions.length === 0) return;

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
  }, [examStarted, questions.length]);

  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleTextAnswerChange = (questionId: number, text: string) => {
    setTextAnswers((prev) => ({ ...prev, [questionId]: text }));
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
    if (!examData) return;

    const payload = buildSubmitPayload(examData, answers, textAnswers);

    submitExamMutation.mutate(payload, {
      onSuccess: (result) => {
        clearCache();
        navigate("/results", {
          state: {
            obtainedScore: result.obtainedScore,
            totalPossibleScore: result.totalPossibleScore,
            answeredCount: result.answeredCount,
            totalQuestions: result.totalQuestions,
            submittedAt: result.submittedAt,
            isLate: result.isLate,
            status: result.status,
            examSessionId: result.examSessionId,
            examTitle: examData.examTitle,
            subjectName: examData.subjectName,
            questions,
            answers,
            questionGradeDetails: result.questionGradeDetails,
          },
        });
      },
      onError: (error) => {
        toast.error(`Submit failed: ${error.message}. Please try again.`);
      },
    });
  }, [answers, navigate, questions, clearCache, examData, submitExamMutation]);

  const goToQuestion = (index: number) => {
    setCurrentQuestion(index);
    setShowNavigator(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // No exam data (direct navigation without API)
  if (!examData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Exam Data</h2>
          <p className="text-muted-foreground mb-4">
            Please start an exam from the exams page.
          </p>
          <Button onClick={() => navigate("/student/exams")}>Back to Exams</Button>
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
          <p className="text-muted-foreground mb-4">This exam has no questions.</p>
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
              {examData.examTitle || "Exam"}
            </h1>
            <p className="text-muted-foreground">
              {examData.subjectName || "—"} • {examData.className || "—"}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between p-4 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground">Student</span>
              <span className="font-semibold">{examData.studentName || "—"}</span>
            </div>
            <div className="flex justify-between p-4 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground">Total Questions</span>
              <span className="font-semibold">{questions.length}</span>
            </div>
            <div className="flex justify-between p-4 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-semibold">{examDuration} minutes</span>
            </div>
            <div className="flex justify-between p-4 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground">Session ID</span>
              <span className="font-semibold">{examData.examSessionId || "—"}</span>
            </div>
          </div>

          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg mb-8">
            <p className="text-sm text-foreground">
              <strong>Instructions:</strong> Answer all questions. You can flag questions to review later.
              The exam will auto-submit when time runs out. Security monitoring is enabled.
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

  const isTextType = (type: string) => ["FILL_IN_THE_BLANK", "WRITING", "CODING"].includes(type);
  const answeredCount = questions.filter((q) =>
    isTextType(q.questionType)
      ? !!textAnswers[q.id]?.trim()
      : answers[q.id] !== undefined
  ).length;
  const progress = (answeredCount / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Security Warning Overlay */}
      <SecurityWarning
        violation={currentViolation}
        remainingChances={remainingChances}
        maxViolations={MAX_VIOLATIONS}
      />

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
            <span>{answeredCount} of {questions.length} answered</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <QuestionCard
          question={currentQ}
          currentIndex={currentQuestion}
          totalQuestions={questions.length}
          selectedAnswer={answers[currentQ.id]}
          textAnswer={textAnswers[currentQ.id]}
          isFlagged={flagged.has(currentQ.id)}
          onAnswerSelect={handleAnswerSelect}
          onTextAnswerChange={handleTextAnswerChange}
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
            <Button variant="success" onClick={() => setShowSubmitDialog(true)} disabled={submitExamMutation.isPending}>
              {submitExamMutation.isPending ? (
                <><Loader2 className="w-4 h-4 mr-1 animate-spin" />Submitting...</>
              ) : (
                "Submit Exam"
              )}
            </Button>
          </div>

          {/* Submit Confirmation Dialog */}
          <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="space-y-2">
                    <p>You have answered {answeredCount} of {questions.length} questions.</p>
                    {answeredCount < questions.length && (
                      <p className="text-destructive font-medium">
                        ⚠ You have {questions.length - answeredCount} unanswered question(s). They will be marked as blank.
                      </p>
                    )}
                    {flagged.size > 0 && (
                      <p className="text-yellow-600 font-medium">
                        You still have {flagged.size} flagged question(s) to review.
                      </p>
                    )}
                    <p>Once submitted, you cannot make any changes.</p>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Review Again</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit}>Confirm Submit</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

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
        {answeredCount < questions.length && (
          <div className="mt-8 p-4 bg-accent/20 border border-accent/40 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-accent-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">
                {questions.length - answeredCount} questions unanswered
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
      <ExamStatusBar
        remainingChances={remainingChances}
        maxViolations={MAX_VIOLATIONS}
        isOffline={isOffline}
        lastSaved={lastSaved}
        isSaving={isSaving}
        latency={latency}
      />
    </div>
  );
};

export default Exam;
