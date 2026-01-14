import { 
  BookOpen, 
  FileText, 
  Users,
  PlusCircle,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { teacherNavItems } from '@/config/teacherNavItems';

const mySubjects = [
  { name: 'Mathematics', questions: 150, students: 120, color: 'bg-blue-500' },
  { name: 'Physics', questions: 98, students: 85, color: 'bg-purple-500' },
];

const upcomingExams = [
  { 
    name: 'Midterm - Mathematics', 
    date: 'Jan 15, 2026', 
    time: '09:00 AM',
    duration: '2 hours',
    students: 120,
    status: 'scheduled'
  },
  { 
    name: 'Quiz - Physics Ch.5', 
    date: 'Jan 12, 2026', 
    time: '02:00 PM',
    duration: '30 mins',
    students: 85,
    status: 'scheduled'
  },
];

const recentSubmissions = [
  { student: 'Alice Chen', exam: 'Quiz - Algebra', score: 92, status: 'graded', time: '2 hours ago' },
  { student: 'Bob Wang', exam: 'Quiz - Algebra', score: 85, status: 'graded', time: '3 hours ago' },
  { student: 'Carol Li', exam: 'Homework - Ch.3', score: null, status: 'pending', time: '4 hours ago' },
  { student: 'David Zhang', exam: 'Quiz - Algebra', score: 78, status: 'graded', time: '5 hours ago' },
];

const stats = [
  { label: 'Total Questions', value: '248', icon: FileText },
  { label: 'Active Exams', value: '3', icon: BookOpen },
  { label: 'My Students', value: '205', icon: Users },
  { label: 'Pending Reviews', value: '12', icon: AlertCircle },
];

const TeacherDashboard = () => {
  return (
    <DashboardLayout navItems={teacherNavItems} role="teacher">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-semibold text-foreground">Teacher Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your subjects, questions, and exams.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Add Question
            </Button>
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Exam
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* My Subjects */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">My Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              {mySubjects.map((subject) => (
                <div 
                  key={subject.name}
                  className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-3 h-3 rounded-full ${subject.color}`} />
                    <h3 className="font-semibold text-foreground">{subject.name}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Questions</p>
                      <p className="font-medium text-foreground">{subject.questions}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Students</p>
                      <p className="font-medium text-foreground">{subject.students}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
                      <h4 className="font-medium text-foreground">{exam.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {exam.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {exam.date}, {exam.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {exam.students} students
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Submissions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-heading">Recent Submissions</CardTitle>
              <Button variant="ghost" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentSubmissions.map((submission, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/30 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {submission.student.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{submission.student}</p>
                      <p className="text-sm text-muted-foreground truncate">{submission.exam}</p>
                    </div>
                    <div className="text-right">
                      {submission.status === 'graded' ? (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="font-medium text-foreground">{submission.score}%</span>
                        </div>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Pending</Badge>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">{submission.time}</p>
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

export default TeacherDashboard;
