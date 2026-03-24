import { useState, useCallback, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DemoQuestion {
  id: number;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_IN_THE_BLANK';
  content: string;
  options: string[];
  correctAnswer: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  points: number;
  explanation: string;
}

const DEMO_QUESTIONS: DemoQuestion[] = [
  {
    id: 1,
    type: 'MULTIPLE_CHOICE',
    content: 'What is the largest planet in our solar system?',
    options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 'Jupiter',
    difficulty: 'EASY',
    points: 10,
    explanation: 'Jupiter is the largest planet in our solar system, with a mass more than twice that of all other planets combined.',
  },
  {
    id: 2,
    type: 'TRUE_FALSE',
    content: 'The Great Wall of China is visible from space with the naked eye.',
    options: ['TRUE', 'FALSE'],
    correctAnswer: 'FALSE',
    difficulty: 'EASY',
    points: 5,
    explanation: 'This is a common myth. The Great Wall is too narrow to be seen from space without aid, according to astronauts.',
  },
  {
    id: 3,
    type: 'MULTIPLE_CHOICE',
    content: 'Which element has the chemical symbol "Au"?',
    options: ['Silver', 'Aluminum', 'Gold', 'Argon'],
    correctAnswer: 'Gold',
    difficulty: 'MEDIUM',
    points: 15,
    explanation: '"Au" comes from the Latin word "Aurum," meaning gold.',
  },
  {
    id: 4,
    type: 'FILL_IN_THE_BLANK',
    content: 'The process by which plants convert sunlight into energy is called _____.',
    options: [],
    correctAnswer: 'Photosynthesis',
    difficulty: 'MEDIUM',
    points: 10,
    explanation: 'Photosynthesis is the process by which green plants use sunlight, water, and CO₂ to produce glucose and oxygen.',
  },
  {
    id: 5,
    type: 'MULTIPLE_CHOICE',
    content: 'How many bones are in the adult human body?',
    options: ['196', '206', '216', '256'],
    correctAnswer: '206',
    difficulty: 'HARD',
    points: 20,
    explanation: 'An adult human body contains 206 bones. Babies are born with around 270, but many fuse together as they grow.',
  },
];

const difficultyColor: Record<string, string> = {
  EASY: 'border-green-300 text-green-700 dark:text-green-400 dark:border-green-700',
  MEDIUM: 'border-amber-300 text-amber-700 dark:text-amber-400 dark:border-amber-700',
  HARD: 'border-red-300 text-red-700 dark:text-red-400 dark:border-red-700',
};

const DemoExam = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [started, setStarted] = useState(false);

  const question = DEMO_QUESTIONS[currentIndex];
  const totalPoints = DEMO_QUESTIONS.reduce((s, q) => s + q.points, 0);

  const handleAnswer = useCallback((answer: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [question.id]: answer }));
  }, [submitted, question.id]);

  const results = useMemo(() => {
    if (!submitted) return null;
    let score = 0;
    const details = DEMO_QUESTIONS.map(q => {
      const userAnswer = answers[q.id] || '';
      const isCorrect = userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
      if (isCorrect) score += q.points;
      return { ...q, userAnswer, isCorrect };
    });
    return { score, details };
  }, [submitted, answers]);

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / DEMO_QUESTIONS.length) * 100;

  if (!started) {
    return (
      <Card className="max-w-2xl mx-auto overflow-hidden">
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="font-heading text-2xl font-semibold text-foreground mb-2">
              Try a Demo Exam
            </h3>
            <p className="text-muted-foreground">
              Experience our exam interface with 5 sample questions. Instant results included!
            </p>
          </div>
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <span>📝 5 Questions</span>
            <span>⭐ {totalPoints} Points</span>
            <span>⚡ Instant Results</span>
          </div>
          <Button size="lg" onClick={() => setStarted(true)} className="gap-2">
            Start Demo Exam
            <ArrowRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (submitted && results) {
    const percentage = Math.round((results.score / totalPoints) * 100);
    const grade = percentage >= 90 ? 'A' : percentage >= 80 ? 'B' : percentage >= 70 ? 'C' : percentage >= 60 ? 'D' : 'F';

    const gradeStyles: Record<string, { bg: string; text: string; ring: string; emoji: string; message: string }> = {
      A: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', ring: 'ring-green-300 dark:ring-green-700', emoji: '🎉', message: 'Outstanding!' },
      B: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', ring: 'ring-blue-300 dark:ring-blue-700', emoji: '👏', message: 'Great job!' },
      C: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', ring: 'ring-amber-300 dark:ring-amber-700', emoji: '👍', message: 'Good effort!' },
      D: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', ring: 'ring-orange-300 dark:ring-orange-700', emoji: '💪', message: 'Keep trying!' },
      F: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', ring: 'ring-red-300 dark:ring-red-700', emoji: '📚', message: 'Study more & try again!' },
    };
    const gs = gradeStyles[grade];

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Score summary */}
        <Card className={cn('overflow-hidden border-2', gs.ring.replace('ring-', 'border-'))}>
          <CardContent className="p-8 text-center space-y-5">
            <div className="text-5xl">{gs.emoji}</div>
            <h3 className="font-heading text-2xl font-semibold text-foreground">
              Exam Complete!
            </h3>
            <p className={cn('text-lg font-medium', gs.text)}>{gs.message}</p>

            <div className="flex justify-center items-end gap-8">
              <div>
                <p className="text-3xl font-bold text-foreground">{results.score}/{totalPoints}</p>
                <p className="text-sm text-muted-foreground">Score</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{percentage}%</p>
                <p className="text-sm text-muted-foreground">Percentage</p>
              </div>
              <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center ring-2', gs.bg, gs.ring)}>
                <span className={cn('text-3xl font-bold', gs.text)}>{grade}</span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <Button variant="outline" onClick={() => { setStarted(false); setSubmitted(false); setAnswers({}); setCurrentIndex(0); }} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Retake Exam
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Question breakdown */}
        <div className="space-y-4">
          {results.details.map((d, idx) => (
            <Card key={d.id} className={cn(
              'border-l-4 transition-colors',
              d.isCorrect ? 'border-l-green-500' : 'border-l-red-500'
            )}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {d.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        Q{idx + 1}. {d.content}
                      </p>
                      {!d.isCorrect && (
                        <div className="mt-2 text-sm space-y-1">
                          <p className="text-red-600 dark:text-red-400">
                            Your answer: {d.userAnswer || '(No answer)'}
                          </p>
                          <p className="text-green-600 dark:text-green-400">
                            Correct: {d.correctAnswer}
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">{d.explanation}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="shrink-0 text-xs">
                    {d.isCorrect ? d.points : 0}/{d.points}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Active exam view
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {currentIndex + 1} / {DEMO_QUESTIONS.length}
        </span>
        <Progress value={progress} className="flex-1" />
        <span className="text-sm font-medium text-foreground whitespace-nowrap">
          {answeredCount} answered
        </span>
      </div>

      {/* Question card */}
      <Card>
        <CardContent className="p-6 space-y-5">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={difficultyColor[question.difficulty]}>
              {question.difficulty}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {question.type === 'MULTIPLE_CHOICE' ? 'Multiple Choice' : question.type === 'TRUE_FALSE' ? 'True / False' : 'Fill in the Blank'}
            </Badge>
            <span className="ml-auto text-sm text-muted-foreground">{question.points} pts</span>
          </div>

          <p className="text-foreground font-medium leading-relaxed">{question.content}</p>

          {question.type === 'FILL_IN_THE_BLANK' ? (
            <Input
              placeholder="Type your answer..."
              value={answers[question.id] || ''}
              onChange={e => handleAnswer(e.target.value)}
              className="max-w-sm"
            />
          ) : (
            <div className="grid gap-2">
              {question.options.map(option => {
                const isSelected = answers[question.id] === option;
                return (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className={cn(
                      'w-full text-left p-3 rounded-lg border transition-all text-sm',
                      isSelected
                        ? 'border-primary bg-primary/10 text-foreground ring-1 ring-primary'
                        : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-secondary/50'
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentIndex(i => i - 1)}
          disabled={currentIndex === 0}
          className="gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>

        {/* Question dots */}
        <div className="flex gap-1.5">
          {DEMO_QUESTIONS.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                'w-8 h-8 rounded-full text-xs font-medium transition-all',
                idx === currentIndex
                  ? 'bg-primary text-primary-foreground'
                  : answers[q.id]
                    ? 'bg-primary/20 text-primary'
                    : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
              )}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {currentIndex === DEMO_QUESTIONS.length - 1 ? (
          <Button
            size="sm"
            onClick={() => setSubmitted(true)}
            disabled={answeredCount === 0}
            className="gap-1"
          >
            Submit
            <CheckCircle2 className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={() => setCurrentIndex(i => i + 1)}
            className="gap-1"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default DemoExam;
