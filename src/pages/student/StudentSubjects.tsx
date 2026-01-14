import { useState } from 'react';
import { 
  BookOpen, 
  User, 
  Clock, 
  FileText, 
  ChevronRight,
  Calendar,
  TrendingUp,
  CheckCircle,
  PlayCircle,
  Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { studentNavItems } from '@/config/studentNavItems';

interface Chapter {
  id: number;
  name: string;
  status: 'completed' | 'in-progress' | 'locked';
  lessons: number;
  completedLessons: number;
  quizScore?: number;
}

interface Subject {
  id: number;
  name: string;
  code: string;
  teacher: string;
  teacherAvatar: string;
  progress: number;
  totalChapters: number;
  completedChapters: number;
  nextExam?: string;
  averageScore: number;
  color: string;
  chapters: Chapter[];
}

const MOCK_SUBJECTS: Subject[] = [
  {
    id: 1,
    name: 'Mathematics',
    code: 'MATH-101',
    teacher: 'Mr. John Smith',
    teacherAvatar: 'JS',
    progress: 75,
    totalChapters: 12,
    completedChapters: 9,
    nextExam: 'Jan 15, 2026',
    averageScore: 88,
    color: 'blue',
    chapters: [
      { id: 1, name: 'Algebra Basics', status: 'completed', lessons: 8, completedLessons: 8, quizScore: 92 },
      { id: 2, name: 'Linear Equations', status: 'completed', lessons: 10, completedLessons: 10, quizScore: 85 },
      { id: 3, name: 'Quadratic Equations', status: 'completed', lessons: 12, completedLessons: 12, quizScore: 90 },
      { id: 4, name: 'Polynomials', status: 'in-progress', lessons: 8, completedLessons: 5 },
      { id: 5, name: 'Trigonometry', status: 'locked', lessons: 10, completedLessons: 0 },
      { id: 6, name: 'Calculus Intro', status: 'locked', lessons: 14, completedLessons: 0 },
    ]
  },
  {
    id: 2,
    name: 'Physics',
    code: 'PHY-101',
    teacher: 'Ms. Sarah Johnson',
    teacherAvatar: 'SJ',
    progress: 60,
    totalChapters: 10,
    completedChapters: 6,
    nextExam: 'Jan 18, 2026',
    averageScore: 82,
    color: 'purple',
    chapters: [
      { id: 1, name: 'Mechanics', status: 'completed', lessons: 12, completedLessons: 12, quizScore: 88 },
      { id: 2, name: 'Kinematics', status: 'completed', lessons: 10, completedLessons: 10, quizScore: 78 },
      { id: 3, name: 'Newton\'s Laws', status: 'completed', lessons: 8, completedLessons: 8, quizScore: 85 },
      { id: 4, name: 'Work & Energy', status: 'in-progress', lessons: 10, completedLessons: 4 },
      { id: 5, name: 'Thermodynamics', status: 'locked', lessons: 12, completedLessons: 0 },
    ]
  },
  {
    id: 3,
    name: 'Chemistry',
    code: 'CHEM-101',
    teacher: 'Dr. Michael Brown',
    teacherAvatar: 'MB',
    progress: 45,
    totalChapters: 8,
    completedChapters: 4,
    nextExam: 'Jan 20, 2026',
    averageScore: 76,
    color: 'emerald',
    chapters: [
      { id: 1, name: 'Atomic Structure', status: 'completed', lessons: 6, completedLessons: 6, quizScore: 80 },
      { id: 2, name: 'Chemical Bonding', status: 'completed', lessons: 8, completedLessons: 8, quizScore: 75 },
      { id: 3, name: 'States of Matter', status: 'in-progress', lessons: 6, completedLessons: 3 },
      { id: 4, name: 'Chemical Reactions', status: 'locked', lessons: 10, completedLessons: 0 },
    ]
  },
];

const StudentSubjects = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string; light: string }> = {
      blue: { 
        bg: 'bg-blue-500', 
        text: 'text-blue-500', 
        border: 'border-blue-500/30',
        light: 'bg-blue-500/10 dark:bg-blue-950/40'
      },
      purple: { 
        bg: 'bg-purple-500', 
        text: 'text-purple-500', 
        border: 'border-purple-500/30',
        light: 'bg-purple-500/10 dark:bg-purple-950/40'
      },
      emerald: { 
        bg: 'bg-emerald-500', 
        text: 'text-emerald-500', 
        border: 'border-emerald-500/30',
        light: 'bg-emerald-500/10 dark:bg-emerald-950/40'
      },
    };
    return colors[color] || colors.blue;
  };

  const getStatusIcon = (status: Chapter['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'in-progress':
        return <PlayCircle className="w-5 h-5 text-amber-500" />;
      case 'locked':
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: Chapter['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/30">In Progress</Badge>;
      case 'locked':
        return <Badge variant="secondary">Locked</Badge>;
    }
  };

  return (
    <DashboardLayout navItems={studentNavItems} role="student">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Subjects</h1>
            <p className="text-muted-foreground">Track your progress and explore course content</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="px-3 py-1">
              <BookOpen className="w-4 h-4 mr-1" />
              {MOCK_SUBJECTS.length} Enrolled
            </Badge>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {Math.round(MOCK_SUBJECTS.reduce((acc, s) => acc + s.progress, 0) / MOCK_SUBJECTS.length)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Overall Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {MOCK_SUBJECTS.reduce((acc, s) => acc + s.completedChapters, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Chapters Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {Math.round(MOCK_SUBJECTS.reduce((acc, s) => acc + s.averageScore, 0) / MOCK_SUBJECTS.length)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Cards or Detail View */}
        {selectedSubject ? (
          <div className="space-y-6">
            {/* Back Button and Subject Header */}
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => setSelectedSubject(null)}>
                ← Back to Subjects
              </Button>
            </div>
            
            <Card className={`${getColorClasses(selectedSubject.color).border} border-2`}>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-xl ${getColorClasses(selectedSubject.color).light} flex items-center justify-center`}>
                      <BookOpen className={`w-8 h-8 ${getColorClasses(selectedSubject.color).text}`} />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{selectedSubject.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <span>{selectedSubject.code}</span>
                        <span>•</span>
                        <User className="w-4 h-4" />
                        <span>{selectedSubject.teacher}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-center px-4 py-2 rounded-lg bg-secondary">
                      <p className="text-2xl font-bold">{selectedSubject.progress}%</p>
                      <p className="text-xs text-muted-foreground">Progress</p>
                    </div>
                    <div className="text-center px-4 py-2 rounded-lg bg-secondary">
                      <p className="text-2xl font-bold">{selectedSubject.averageScore}%</p>
                      <p className="text-xs text-muted-foreground">Avg Score</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Course Progress</span>
                    <span className="font-medium">{selectedSubject.completedChapters}/{selectedSubject.totalChapters} chapters</span>
                  </div>
                  <Progress value={selectedSubject.progress} className="h-3" />
                </div>
                
                {selectedSubject.nextExam && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 mb-6">
                    <Calendar className="w-5 h-5 text-amber-500" />
                    <span className="text-sm font-medium">Next Exam: {selectedSubject.nextExam}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chapters */}
            <Card>
              <CardHeader>
                <CardTitle>Course Chapters</CardTitle>
                <CardDescription>Complete chapters in order to unlock new content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedSubject.chapters.map((chapter, index) => (
                    <div 
                      key={chapter.id}
                      className={`p-4 rounded-lg border transition-all ${
                        chapter.status === 'locked' 
                          ? 'bg-muted/30 border-border opacity-60' 
                          : 'bg-card border-border hover:border-primary/50 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-semibold text-muted-foreground">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{chapter.name}</h4>
                            {getStatusIcon(chapter.status)}
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              {chapter.completedLessons}/{chapter.lessons} lessons
                            </span>
                            {chapter.quizScore !== undefined && (
                              <span className="flex items-center gap-1 text-emerald-500">
                                <Award className="w-4 h-4" />
                                Quiz: {chapter.quizScore}%
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(chapter.status)}
                          {chapter.status !== 'locked' && (
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                      {chapter.status === 'in-progress' && (
                        <div className="mt-3 ml-14">
                          <Progress value={(chapter.completedLessons / chapter.lessons) * 100} className="h-2" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Subjects</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {MOCK_SUBJECTS.map((subject) => {
                  const colors = getColorClasses(subject.color);
                  return (
                    <Card 
                      key={subject.id} 
                      className={`cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 ${colors.border}`}
                      onClick={() => setSelectedSubject(subject)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className={`w-12 h-12 rounded-xl ${colors.light} flex items-center justify-center`}>
                            <BookOpen className={`w-6 h-6 ${colors.text}`} />
                          </div>
                          <Badge variant="outline">{subject.code}</Badge>
                        </div>
                        <CardTitle className="mt-3">{subject.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {subject.teacher}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{subject.progress}%</span>
                            </div>
                            <Progress value={subject.progress} className="h-2" />
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Chapters</span>
                            <span className="font-medium">{subject.completedChapters}/{subject.totalChapters}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Avg Score</span>
                            <Badge className={`${
                              subject.averageScore >= 85 ? 'bg-emerald-500/10 text-emerald-500' :
                              subject.averageScore >= 70 ? 'bg-amber-500/10 text-amber-500' :
                              'bg-red-500/10 text-red-500'
                            }`}>
                              {subject.averageScore}%
                            </Badge>
                          </div>

                          {subject.nextExam && (
                            <div className="flex items-center gap-2 pt-2 border-t border-border text-sm">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Next exam:</span>
                              <span className="font-medium">{subject.nextExam}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="in-progress">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {MOCK_SUBJECTS.filter(s => s.progress < 100).map((subject) => {
                  const colors = getColorClasses(subject.color);
                  return (
                    <Card 
                      key={subject.id} 
                      className={`cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 ${colors.border}`}
                      onClick={() => setSelectedSubject(subject)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className={`w-12 h-12 rounded-xl ${colors.light} flex items-center justify-center`}>
                            <BookOpen className={`w-6 h-6 ${colors.text}`} />
                          </div>
                          <Badge variant="outline">{subject.code}</Badge>
                        </div>
                        <CardTitle className="mt-3">{subject.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {subject.teacher}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{subject.progress}%</span>
                            </div>
                            <Progress value={subject.progress} className="h-2" />
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Chapters</span>
                            <span className="font-medium">{subject.completedChapters}/{subject.totalChapters}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="completed">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg">No Completed Subjects Yet</h3>
                <p className="text-muted-foreground mt-1">Keep learning! Your completed subjects will appear here.</p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentSubjects;
