import { 
  BookOpen, 
  Clock, 
  Trophy,
  BarChart3,
  Calendar,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Link } from 'react-router-dom';
import { studentNavItems } from '@/config/studentNavItems';
import { useStudentProfile } from '@/hooks/useStudentProfile';

const enrolledSubjects = [
  { name: 'Mathematics', teacher: 'Mr. Smith', progress: 75, nextExam: 'Jan 15' },
  { name: 'Physics', teacher: 'Ms. Johnson', progress: 60, nextExam: 'Jan 18' },
  { name: 'Chemistry', teacher: 'Dr. Brown', progress: 45, nextExam: 'Jan 20' },
];

const upcomingExams = [
  { 
    name: 'Midterm - Mathematics', 
    subject: 'Mathematics',
    date: 'Jan 15, 2026', 
    time: '09:00 AM',
    duration: '2 hours',
  },
  { 
    name: 'Quiz - Physics Ch.5', 
    subject: 'Physics',
    date: 'Jan 12, 2026', 
    time: '02:00 PM',
    duration: '30 mins',
  },
];

const recentResults = [
  { exam: 'Quiz - Algebra', subject: 'Mathematics', score: 92, maxScore: 100, date: 'Jan 5', grade: 'A' },
  { exam: 'Homework - Ch.3', subject: 'Physics', score: 85, maxScore: 100, date: 'Jan 3', grade: 'B+' },
  { exam: 'Quiz - Organic', subject: 'Chemistry', score: 78, maxScore: 100, date: 'Jan 1', grade: 'B' },
];

const leaderboard = [
  { rank: 1, name: 'Alice Chen', points: 2450, avatar: 'AC' },
  { rank: 2, name: 'Bob Wang', points: 2380, avatar: 'BW' },
  { rank: 3, name: 'You', points: 2250, avatar: 'JD', isCurrentUser: true },
  { rank: 4, name: 'David Zhang', points: 2100, avatar: 'DZ' },
  { rank: 5, name: 'Eva Liu', points: 1980, avatar: 'EL' },
];

const StudentDashboard = () => {
  const { data: profile, isLoading: profileLoading } = useStudentProfile();

  const displayName = profile?.name
    ? profile.name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
    : 'Student';

  return (
    <DashboardLayout navItems={studentNavItems} role="student">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-semibold text-foreground">
              Welcome Back, {profileLoading ? '...' : displayName}!
            </h1>
            <p className="text-muted-foreground mt-1">Here's your learning progress and upcoming activities.</p>
          </div>
          <Link to="/exam">
            <Button>
              <BookOpen className="w-4 h-4 mr-2" />
              Take Practice Exam
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-2">
                <BookOpen className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-2xl font-semibold text-foreground">3</p>
              <p className="text-sm text-muted-foreground">Enrolled Subjects</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
              <p className="text-2xl font-semibold text-foreground">2</p>
              <p className="text-sm text-muted-foreground">Upcoming Exams</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-2xl font-semibold text-foreground">85%</p>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-6 h-6 text-purple-500" />
              </div>
              <p className="text-2xl font-semibold text-foreground">#3</p>
              <p className="text-sm text-muted-foreground">Class Rank</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Enrolled Subjects */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-heading">My Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {enrolledSubjects.map((subject) => (
                  <div key={subject.name} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-foreground">{subject.name}</h4>
                        <p className="text-sm text-muted-foreground">{subject.teacher}</p>
                      </div>
                      <Badge variant="outline">Next: {subject.nextExam}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Course Progress</span>
                        <span className="font-medium text-foreground">{subject.progress}%</span>
                      </div>
                      <Progress value={subject.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-heading flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((student) => (
                  <div 
                    key={student.rank}
                    className={`flex items-center gap-3 p-2 rounded-lg ${
                      student.isCurrentUser ? 'bg-primary/10 border border-primary/30' : ''
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      student.rank === 1 ? 'bg-yellow-500 text-white' :
                      student.rank === 2 ? 'bg-gray-400 text-white' :
                      student.rank === 3 ? 'bg-amber-600 text-white' :
                      'bg-secondary text-muted-foreground'
                    }`}>
                      {student.rank}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">{student.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${student.isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                        {student.name}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">{student.points}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming Exams */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-heading">Upcoming Exams</CardTitle>
              <Button variant="ghost" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingExams.map((exam, index) => (
                  <div key={index} className="p-4 bg-secondary/30 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-foreground">{exam.name}</h4>
                        <p className="text-sm text-muted-foreground">{exam.subject}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        View
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {exam.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {exam.time} ({exam.duration})
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Results */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-heading">Recent Results</CardTitle>
              <Button variant="ghost" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentResults.map((result, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/30 transition-colors">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg ${
                      result.grade.startsWith('A') ? 'bg-green-500/10 text-green-600' :
                      result.grade.startsWith('B') ? 'bg-blue-500/10 text-blue-600' :
                      'bg-yellow-500/10 text-yellow-600'
                    }`}>
                      {result.grade}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{result.exam}</p>
                      <p className="text-sm text-muted-foreground">{result.subject}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">{result.score}/{result.maxScore}</p>
                      <p className="text-xs text-muted-foreground">{result.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
