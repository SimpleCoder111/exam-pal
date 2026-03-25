import { useState } from 'react';
import {
  Trophy,
  Medal,
  Crown,
  TrendingUp,
  Users,
  BookOpen,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { studentNavItems } from '@/config/studentNavItems';
import { useStudentClassrooms } from '@/hooks/useStudentClassrooms';
import { useStudentExams } from '@/hooks/useStudentExams';
import { useExamLeaderboard, useSubjectLeaderboard } from '@/hooks/useStudentLeaderboard';

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="w-6 h-6 text-amber-500" />;
  if (rank === 2) return <Medal className="w-6 h-6 text-slate-400" />;
  if (rank === 3) return <Medal className="w-6 h-6 text-amber-700" />;
  return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
};

const getRankBadge = (rank: number, total: number) => {
  const pct = total > 0 ? ((total - rank + 1) / total) * 100 : 0;
  if (rank === 1) return { label: '🥇 1st Place', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-300 dark:border-amber-700' };
  if (rank === 2) return { label: '🥈 2nd Place', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300 border-slate-300 dark:border-slate-600' };
  if (rank === 3) return { label: '🥉 3rd Place', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-300 dark:border-orange-700' };
  if (pct >= 75) return { label: `#${rank} Top 25%`, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-300 dark:border-green-700' };
  if (pct >= 50) return { label: `#${rank} Top 50%`, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-300 dark:border-blue-700' };
  return { label: `#${rank}`, color: 'bg-muted text-muted-foreground border-border' };
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600 dark:text-green-400';
  if (score >= 60) return 'text-blue-600 dark:text-blue-400';
  if (score >= 50) return 'text-amber-600 dark:text-amber-400';
  return 'text-destructive';
};

const RankCard = ({
  title,
  subtitle,
  rank,
  totalScore,
  totalParticipants,
  isLoading,
  error,
}: {
  title: string;
  subtitle?: string;
  rank?: number;
  totalScore?: number;
  totalParticipants?: number;
  isLoading: boolean;
  error: Error | null;
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="flex items-center gap-6">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-destructive">Failed to load leaderboard data.</p>
        </CardContent>
      </Card>
    );
  }

  if (rank === undefined || totalParticipants === undefined) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Users className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Select an item to view your ranking.</p>
        </CardContent>
      </Card>
    );
  }

  const badge = getRankBadge(rank, totalParticipants);
  const percentile = totalParticipants > 0 ? Math.round(((totalParticipants - rank + 1) / totalParticipants) * 100) : 0;

  return (
    <Card className="overflow-hidden">
      <div className={`h-1.5 ${rank === 1 ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500' : rank === 2 ? 'bg-gradient-to-r from-slate-300 to-slate-400' : rank === 3 ? 'bg-gradient-to-r from-orange-400 to-amber-600' : 'bg-primary/30'}`} />
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          <Badge variant="outline" className={`${badge.color} border`}>
            {badge.label}
          </Badge>
        </div>

        <div className="flex items-center gap-6">
          {/* Rank circle */}
          <div className={`w-20 h-20 rounded-full flex flex-col items-center justify-center shrink-0 ${
            rank === 1 ? 'bg-gradient-to-br from-amber-100 to-yellow-200 dark:from-amber-900/40 dark:to-yellow-800/30 ring-2 ring-amber-300 dark:ring-amber-600' :
            rank === 2 ? 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800/40 dark:to-slate-700/30 ring-2 ring-slate-300 dark:ring-slate-600' :
            rank === 3 ? 'bg-gradient-to-br from-orange-100 to-amber-200 dark:from-orange-900/40 dark:to-amber-800/30 ring-2 ring-orange-300 dark:ring-orange-600' :
            'bg-muted ring-2 ring-border'
          }`}>
            {getRankIcon(rank)}
            <span className="text-[10px] font-medium text-muted-foreground mt-0.5">
              of {totalParticipants}
            </span>
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-bold ${getScoreColor(totalScore ?? 0)}`}>
                  {totalScore ?? 0}%
                </span>
                <span className="text-sm text-muted-foreground">score</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Percentile</span>
                <span className="font-medium">{percentile}%</span>
              </div>
              <Progress value={percentile} className="h-2" />
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              {totalParticipants} participant{totalParticipants !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const StudentLeaderboard = () => {
  const [activeTab, setActiveTab] = useState('exam');
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  const { data: classrooms, isLoading: classroomsLoading } = useStudentClassrooms();
  const { data: exams, isLoading: examsLoading } = useStudentExams();

  const { data: examLeaderboard, isLoading: examLbLoading, error: examLbError } = useExamLeaderboard(selectedExamId);
  const { data: subjectLeaderboard, isLoading: subjectLbLoading, error: subjectLbError } = useSubjectLeaderboard(selectedSubjectId);

  const examsArray = Array.isArray(exams) ? exams : [];
  const classroomsArray = Array.isArray(classrooms) ? classrooms : [];

  // Derive unique subjects from classes (which have numeric subjectId)
  const uniqueSubjects = useMemo(() => {
    const seen = new Map<number, { subjectId: number; className: string }>();
    classroomsArray.forEach((c) => {
      if (!seen.has(c.subjectId)) {
        // Extract subject name from className (e.g., "Class A - C Programming" → "C Programming")
        const subjectName = c.className.includes(' - ') ? c.className.split(' - ').slice(1).join(' - ') : c.className;
        seen.set(c.subjectId, { subjectId: c.subjectId, className: subjectName });
      }
    });
    return Array.from(seen.values());
  }, [classroomsArray]);

  const selectedExam = examsArray.find(e => String(e.examId) === selectedExamId);
  const selectedSubject = uniqueSubjects.find(s => String(s.subjectId) === selectedSubjectId);

  return (
    <DashboardLayout navItems={studentNavItems} role="student">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-heading text-3xl font-semibold text-foreground flex items-center gap-3">
            <Trophy className="w-8 h-8 text-primary" />
            Leaderboard
          </h1>
          <p className="text-muted-foreground mt-1">See how you rank among your peers.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="exam" className="gap-2">
              <FileText className="w-4 h-4" />
              By Exam
            </TabsTrigger>
            <TabsTrigger value="subject" className="gap-2">
              <BookOpen className="w-4 h-4" />
              By Subject
            </TabsTrigger>
          </TabsList>

          {/* Exam Leaderboard */}
          <TabsContent value="exam" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select an Exam</CardTitle>
                <CardDescription>Choose an exam to view your ranking among classmates.</CardDescription>
              </CardHeader>
              <CardContent>
                {examsLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : examsArray.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No exams found.</p>
                ) : (
                  <Select value={selectedExamId ?? ''} onValueChange={setSelectedExamId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an exam..." />
                    </SelectTrigger>
                    <SelectContent>
                      {examsArray.map((e) => (
                        <SelectItem key={e.examId} value={String(e.examId)}>
                          {e.examTitle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </CardContent>
            </Card>

            {selectedExamId && (
              <RankCard
                title={selectedExam?.examTitle ?? 'Exam'}
                subtitle={`Exam ID: ${selectedExamId}`}
                rank={examLeaderboard?.rank}
                totalScore={examLeaderboard?.totalScore}
                totalParticipants={examLeaderboard?.totalParticipants}
                isLoading={examLbLoading}
                error={examLbError}
              />
            )}
          </TabsContent>

          {/* Subject Leaderboard */}
          <TabsContent value="subject" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select a Subject</CardTitle>
                <CardDescription>Choose a subject to see your overall ranking across all exams.</CardDescription>
              </CardHeader>
              <CardContent>
                {subjectsLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : subjectsArray.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No subjects found.</p>
                ) : (
                  <Select value={selectedSubjectId ?? ''} onValueChange={setSelectedSubjectId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a subject..." />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectsArray.map((s) => (
                        <SelectItem key={s.subjectId} value={String(s.subjectId)}>
                          {s.subjectName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </CardContent>
            </Card>

            {selectedSubjectId && (
              <RankCard
                title={selectedSubject?.subjectName ?? 'Subject'}
                subtitle={selectedSubject?.teacherName ? `Teacher: ${selectedSubject.teacherName}` : undefined}
                rank={subjectLeaderboard?.rank}
                totalScore={subjectLeaderboard?.totalScore}
                totalParticipants={subjectLeaderboard?.totalParticipants}
                isLoading={subjectLbLoading}
                error={subjectLbError}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentLeaderboard;
