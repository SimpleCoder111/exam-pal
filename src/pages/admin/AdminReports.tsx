import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { adminNavItems } from '@/config/adminNavItems';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  FileText,
  TrendingUp,
  TrendingDown,
  Users,
  GraduationCap,
  BookOpen,
  Clock,
  Target,
  Award,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Filter,
  RefreshCw,
  Printer,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for reports
const examPerformanceData = [
  { month: 'Sep', avgScore: 72, passRate: 78, totalExams: 45 },
  { month: 'Oct', avgScore: 75, passRate: 82, totalExams: 52 },
  { month: 'Nov', avgScore: 71, passRate: 76, totalExams: 48 },
  { month: 'Dec', avgScore: 78, passRate: 85, totalExams: 38 },
  { month: 'Jan', avgScore: 80, passRate: 88, totalExams: 56 },
];

const subjectPerformanceData = [
  { subject: 'Mathematics', avgScore: 76, students: 450, passRate: 82 },
  { subject: 'Physics', avgScore: 72, students: 320, passRate: 78 },
  { subject: 'Chemistry', avgScore: 74, students: 310, passRate: 80 },
  { subject: 'Biology', avgScore: 79, students: 280, passRate: 86 },
  { subject: 'English', avgScore: 81, students: 420, passRate: 89 },
  { subject: 'History', avgScore: 77, students: 250, passRate: 84 },
];

const teacherPerformanceData = [
  { name: 'John Smith', subject: 'Mathematics', avgScore: 78, examsCreated: 24, passRate: 85 },
  { name: 'Jane Doe', subject: 'Chemistry', avgScore: 75, examsCreated: 18, passRate: 80 },
  { name: 'Robert Brown', subject: 'English', avgScore: 82, examsCreated: 22, passRate: 90 },
  { name: 'Emily Wilson', subject: 'Mathematics', avgScore: 74, examsCreated: 20, passRate: 78 },
  { name: 'Michael Lee', subject: 'Physics', avgScore: 71, examsCreated: 16, passRate: 75 },
  { name: 'Sarah Chen', subject: 'Biology', avgScore: 80, examsCreated: 19, passRate: 87 },
];

const studentDistributionData = [
  { name: 'A+ (90-100)', value: 120, color: 'hsl(var(--chart-1))' },
  { name: 'A (80-89)', value: 280, color: 'hsl(var(--chart-2))' },
  { name: 'B (70-79)', value: 350, color: 'hsl(var(--chart-3))' },
  { name: 'C (60-69)', value: 220, color: 'hsl(var(--chart-4))' },
  { name: 'D (50-59)', value: 130, color: 'hsl(var(--chart-5))' },
  { name: 'F (<50)', value: 80, color: 'hsl(0 84% 60%)' },
];

const weeklyActivityData = [
  { day: 'Mon', exams: 12, submissions: 340, avgTime: 45 },
  { day: 'Tue', exams: 15, submissions: 420, avgTime: 48 },
  { day: 'Wed', exams: 18, submissions: 510, avgTime: 52 },
  { day: 'Thu', exams: 14, submissions: 380, avgTime: 46 },
  { day: 'Fri', exams: 20, submissions: 580, avgTime: 50 },
  { day: 'Sat', exams: 8, submissions: 220, avgTime: 55 },
  { day: 'Sun', exams: 5, submissions: 150, avgTime: 58 },
];

const recentExamsData = [
  { id: 'E001', title: 'Mid-Term Math', subject: 'Mathematics', teacher: 'John Smith', students: 32, avgScore: 78, passRate: 88, date: '2025-01-14' },
  { id: 'E002', title: 'Physics Final', subject: 'Physics', teacher: 'Michael Lee', students: 28, avgScore: 72, passRate: 75, date: '2025-01-13' },
  { id: 'E003', title: 'Chemistry Quiz', subject: 'Chemistry', teacher: 'Jane Doe', students: 30, avgScore: 85, passRate: 93, date: '2025-01-12' },
  { id: 'E004', title: 'Biology Test', subject: 'Biology', teacher: 'Sarah Chen', students: 25, avgScore: 79, passRate: 84, date: '2025-01-11' },
  { id: 'E005', title: 'English Essay', subject: 'English', teacher: 'Robert Brown', students: 35, avgScore: 81, passRate: 91, date: '2025-01-10' },
];

const securityAlertsData = [
  { id: 'A001', student: 'Student A', exam: 'Mid-Term Math', type: 'Tab Switch', count: 5, status: 'auto_submitted' },
  { id: 'A002', student: 'Student B', exam: 'Physics Final', type: 'Copy Attempt', count: 3, status: 'warning' },
  { id: 'A003', student: 'Student C', exam: 'Chemistry Quiz', type: 'Focus Lost', count: 8, status: 'auto_submitted' },
  { id: 'A004', student: 'Student D', exam: 'Biology Test', type: 'Tab Switch', count: 2, status: 'warning' },
];

const AdminReports = () => {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState('last_30_days');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState('all');

  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    toast({
      title: 'Export Started',
      description: `Generating ${format.toUpperCase()} report...`,
    });
    // Simulate export delay
    setTimeout(() => {
      toast({
        title: 'Export Complete',
        description: `Report has been downloaded as ${format.toUpperCase()}`,
      });
    }, 1500);
  };

  const stats = {
    totalStudents: 1180,
    totalTeachers: 24,
    totalExams: 239,
    avgPassRate: 82,
    avgScore: 76.4,
    totalSubmissions: 8420,
  };

  return (
    <DashboardLayout navItems={adminNavItems} role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-primary" />
              Reports & Analytics
            </h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive analytics across all exams, teachers, and students
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
              <FileText className="mr-2 h-4 w-4" />
              Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
              <Download className="mr-2 h-4 w-4" />
              PDF
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="space-y-2">
                <Label>Date Range</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                    <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                    <SelectItem value="last_90_days">Last 90 Days</SelectItem>
                    <SelectItem value="this_semester">This Semester</SelectItem>
                    <SelectItem value="this_year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="biology">Biology</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Teacher</Label>
                <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Teachers</SelectItem>
                    {teacherPerformanceData.map(t => (
                      <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                +12% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTeachers}</div>
              <p className="text-xs text-muted-foreground">Across 6 subjects</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalExams}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                +18% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Pass Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.avgPassRate}%</div>
              <Progress value={stats.avgPassRate} className="mt-2 h-1" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgScore}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                +3.2 from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Submissions</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSubmissions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">This period</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="performance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="performance">Performance Trends</TabsTrigger>
            <TabsTrigger value="subjects">Subject Analysis</TabsTrigger>
            <TabsTrigger value="teachers">Teacher Performance</TabsTrigger>
            <TabsTrigger value="activity">Activity Overview</TabsTrigger>
            <TabsTrigger value="security">Security Alerts</TabsTrigger>
          </TabsList>

          {/* Performance Trends Tab */}
          <TabsContent value="performance" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Score & Pass Rate Trends</CardTitle>
                  <CardDescription>Monthly average scores and pass rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={examPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))' 
                        }} 
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="avgScore" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        name="Avg Score"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="passRate" 
                        stroke="hsl(var(--chart-2))" 
                        strokeWidth={2}
                        name="Pass Rate %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Grade Distribution</CardTitle>
                  <CardDescription>Student performance distribution by grade</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={studentDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                      >
                        {studentDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Exams Table */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Exam Results</CardTitle>
                <CardDescription>Latest completed exams with performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exam Title</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Avg Score</TableHead>
                      <TableHead>Pass Rate</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentExamsData.map(exam => (
                      <TableRow key={exam.id}>
                        <TableCell className="font-medium">{exam.title}</TableCell>
                        <TableCell>{exam.subject}</TableCell>
                        <TableCell>{exam.teacher}</TableCell>
                        <TableCell>{exam.students}</TableCell>
                        <TableCell>
                          <span className={exam.avgScore >= 75 ? 'text-green-600' : exam.avgScore >= 60 ? 'text-yellow-600' : 'text-red-600'}>
                            {exam.avgScore}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={exam.passRate >= 80 ? 'default' : exam.passRate >= 60 ? 'secondary' : 'destructive'}>
                            {exam.passRate}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{exam.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subject Analysis Tab */}
          <TabsContent value="subjects" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Subject Performance Comparison</CardTitle>
                  <CardDescription>Average scores across all subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={subjectPerformanceData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" domain={[0, 100]} className="text-xs" />
                      <YAxis dataKey="subject" type="category" width={100} className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))' 
                        }} 
                      />
                      <Bar dataKey="avgScore" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Avg Score" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Student Enrollment by Subject</CardTitle>
                  <CardDescription>Number of students per subject</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={subjectPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="subject" className="text-xs" angle={-45} textAnchor="end" height={80} />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))' 
                        }} 
                      />
                      <Bar dataKey="students" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Students" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Subject Details Table */}
            <Card>
              <CardHeader>
                <CardTitle>Subject Performance Details</CardTitle>
                <CardDescription>Detailed metrics for each subject</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Avg Score</TableHead>
                      <TableHead>Pass Rate</TableHead>
                      <TableHead>Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjectPerformanceData.map(subject => (
                      <TableRow key={subject.subject}>
                        <TableCell className="font-medium">{subject.subject}</TableCell>
                        <TableCell>{subject.students}</TableCell>
                        <TableCell>{subject.avgScore}%</TableCell>
                        <TableCell>
                          <Badge variant={subject.passRate >= 85 ? 'default' : subject.passRate >= 75 ? 'secondary' : 'destructive'}>
                            {subject.passRate}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={subject.avgScore} className="w-20 h-2" />
                            <span className="text-xs text-muted-foreground">{subject.avgScore}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Teacher Performance Tab */}
          <TabsContent value="teachers" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Teacher Pass Rates</CardTitle>
                  <CardDescription>Student pass rates by teacher</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={teacherPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" className="text-xs" angle={-45} textAnchor="end" height={80} />
                      <YAxis domain={[0, 100]} className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))' 
                        }} 
                      />
                      <Bar dataKey="passRate" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Pass Rate %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Exams Created by Teacher</CardTitle>
                  <CardDescription>Number of exams created this period</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={teacherPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" className="text-xs" angle={-45} textAnchor="end" height={80} />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))' 
                        }} 
                      />
                      <Bar dataKey="examsCreated" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} name="Exams Created" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Teacher Details Table */}
            <Card>
              <CardHeader>
                <CardTitle>Teacher Performance Details</CardTitle>
                <CardDescription>Detailed metrics for each teacher</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Exams Created</TableHead>
                      <TableHead>Avg Score</TableHead>
                      <TableHead>Pass Rate</TableHead>
                      <TableHead>Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teacherPerformanceData.map(teacher => (
                      <TableRow key={teacher.name}>
                        <TableCell className="font-medium">{teacher.name}</TableCell>
                        <TableCell>{teacher.subject}</TableCell>
                        <TableCell>{teacher.examsCreated}</TableCell>
                        <TableCell>{teacher.avgScore}%</TableCell>
                        <TableCell>
                          <Badge variant={teacher.passRate >= 85 ? 'default' : teacher.passRate >= 75 ? 'secondary' : 'destructive'}>
                            {teacher.passRate}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {teacher.passRate >= 85 ? (
                            <span className="flex items-center gap-1 text-green-600 text-sm">
                              <TrendingUp className="h-4 w-4" /> Excellent
                            </span>
                          ) : teacher.passRate >= 75 ? (
                            <span className="flex items-center gap-1 text-yellow-600 text-sm">
                              <Target className="h-4 w-4" /> Good
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-red-600 text-sm">
                              <TrendingDown className="h-4 w-4" /> Needs Improvement
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Overview Tab */}
          <TabsContent value="activity" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Exam Activity</CardTitle>
                  <CardDescription>Exams and submissions by day of week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={weeklyActivityData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="day" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))' 
                        }} 
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="submissions" 
                        stackId="1"
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary)/0.3)"
                        name="Submissions"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="exams" 
                        stackId="2"
                        stroke="hsl(var(--chart-2))" 
                        fill="hsl(var(--chart-2)/0.3)"
                        name="Exams"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Average Exam Duration</CardTitle>
                  <CardDescription>Average time spent on exams by day</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyActivityData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="day" className="text-xs" />
                      <YAxis className="text-xs" unit=" min" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))' 
                        }} 
                        formatter={(value) => [`${value} minutes`, 'Avg Duration']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="avgTime" 
                        stroke="hsl(var(--chart-4))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--chart-4))' }}
                        name="Avg Time"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Activity Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Peak Day</p>
                      <p className="text-xl font-bold">Friday</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-chart-2/10 rounded-lg">
                      <Clock className="h-6 w-6 text-chart-2" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Duration</p>
                      <p className="text-xl font-bold">50 min</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-chart-3/10 rounded-lg">
                      <FileText className="h-6 w-6 text-chart-3" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Daily Avg Exams</p>
                      <p className="text-xl font-bold">13</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-chart-4/10 rounded-lg">
                      <Users className="h-6 w-6 text-chart-4" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Daily Submissions</p>
                      <p className="text-xl font-bold">371</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Alerts Tab */}
          <TabsContent value="security" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-muted-foreground">This period</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Auto-Submitted</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">23</div>
                  <p className="text-xs text-muted-foreground">Due to violations</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Alert Rate</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1.9%</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingDown className="h-3 w-3 text-green-500" />
                    -0.3% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Security Alerts</CardTitle>
                <CardDescription>Security violations and auto-submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Exam</TableHead>
                      <TableHead>Violation Type</TableHead>
                      <TableHead>Count</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {securityAlertsData.map(alert => (
                      <TableRow key={alert.id}>
                        <TableCell className="font-medium">{alert.student}</TableCell>
                        <TableCell>{alert.exam}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{alert.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className={alert.count >= 5 ? 'text-red-600 font-bold' : 'text-yellow-600'}>
                            {alert.count}
                          </span>
                        </TableCell>
                        <TableCell>
                          {alert.status === 'auto_submitted' ? (
                            <Badge variant="destructive">Auto-Submitted</Badge>
                          ) : (
                            <Badge variant="secondary">Warning</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminReports;
