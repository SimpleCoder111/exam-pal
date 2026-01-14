import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { teacherNavItems } from '@/config/teacherNavItems';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText, 
  Award, 
  Download,
  Calendar
} from 'lucide-react';

// Mock data for analytics
const PERFORMANCE_TREND_DATA = [
  { month: 'Jan', average: 72, highest: 95, lowest: 45 },
  { month: 'Feb', average: 75, highest: 98, lowest: 48 },
  { month: 'Mar', average: 71, highest: 92, lowest: 42 },
  { month: 'Apr', average: 78, highest: 96, lowest: 52 },
  { month: 'May', average: 82, highest: 100, lowest: 58 },
  { month: 'Jun', average: 79, highest: 97, lowest: 55 },
];

const EXAM_STATISTICS = [
  { name: 'Midterm Exam', students: 45, avgScore: 78, passRate: 89 },
  { name: 'Quiz 1', students: 42, avgScore: 82, passRate: 95 },
  { name: 'Quiz 2', students: 44, avgScore: 75, passRate: 86 },
  { name: 'Final Exam', students: 43, avgScore: 80, passRate: 91 },
];

const CLASS_COMPARISON_DATA = [
  { class: 'Class 10-A', physics: 78, chemistry: 72, math: 85 },
  { class: 'Class 10-B', physics: 72, chemistry: 80, math: 76 },
  { class: 'Class 11-A', physics: 85, chemistry: 78, math: 82 },
  { class: 'Class 11-B', physics: 70, chemistry: 75, math: 79 },
];

const DIFFICULTY_DISTRIBUTION = [
  { name: 'Easy', value: 35, color: 'hsl(var(--chart-2))' },
  { name: 'Medium', value: 45, color: 'hsl(var(--chart-4))' },
  { name: 'Hard', value: 20, color: 'hsl(var(--chart-1))' },
];

const TOPIC_PERFORMANCE = [
  { topic: 'Mechanics', score: 85 },
  { topic: 'Thermodynamics', score: 72 },
  { topic: 'Optics', score: 78 },
  { topic: 'Electricity', score: 68 },
  { topic: 'Magnetism', score: 75 },
  { topic: 'Waves', score: 82 },
];

const STUDENT_DISTRIBUTION = [
  { range: '0-40', count: 5 },
  { range: '41-60', count: 12 },
  { range: '61-80', count: 25 },
  { range: '81-100', count: 18 },
];

const TeacherReports = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('6months');

  const stats = {
    totalStudents: 180,
    totalExams: 24,
    averageScore: 76.5,
    passRate: 88.2,
  };

  return (
    <DashboardLayout
      navItems={teacherNavItems}
      role="teacher"
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">Track student performance and exam statistics</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Subject</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="math">Mathematics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Class</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="10a">Class 10-A</SelectItem>
                    <SelectItem value="10b">Class 10-B</SelectItem>
                    <SelectItem value="11a">Class 11-A</SelectItem>
                    <SelectItem value="11b">Class 11-B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Date Range</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1month">Last Month</SelectItem>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                    <SelectItem value="1year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-500">+12%</span> from last semester
              </p>
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
                <Calendar className="h-3 w-3" />
                8 exams this month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageScore}%</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-500">+2.3%</span> improvement
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.passRate}%</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingDown className="h-3 w-3 text-amber-500" />
                <span className="text-amber-500">-0.5%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="trends" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="trends">Performance Trends</TabsTrigger>
            <TabsTrigger value="exams">Exam Statistics</TabsTrigger>
            <TabsTrigger value="classes">Class Comparison</TabsTrigger>
            <TabsTrigger value="topics">Topic Analysis</TabsTrigger>
          </TabsList>

          {/* Performance Trends Tab */}
          <TabsContent value="trends" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Score Trends Over Time</CardTitle>
                  <CardDescription>Average, highest, and lowest scores by month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={PERFORMANCE_TREND_DATA}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                        <YAxis className="text-xs fill-muted-foreground" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                          labelStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="average" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          dot={{ fill: 'hsl(var(--primary))' }}
                          name="Average"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="highest" 
                          stroke="hsl(var(--chart-2))" 
                          strokeWidth={2}
                          dot={{ fill: 'hsl(var(--chart-2))' }}
                          name="Highest"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="lowest" 
                          stroke="hsl(var(--chart-1))" 
                          strokeWidth={2}
                          dot={{ fill: 'hsl(var(--chart-1))' }}
                          name="Lowest"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Student Score Distribution</CardTitle>
                  <CardDescription>Number of students in each score range</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={STUDENT_DISTRIBUTION}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="range" className="text-xs fill-muted-foreground" />
                        <YAxis className="text-xs fill-muted-foreground" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                          labelStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="count" 
                          stroke="hsl(var(--primary))" 
                          fill="hsl(var(--primary) / 0.3)" 
                          name="Students"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Exam Statistics Tab */}
          <TabsContent value="exams" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Exam Performance Overview</CardTitle>
                  <CardDescription>Average scores and pass rates by exam</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={EXAM_STATISTICS}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
                        <YAxis className="text-xs fill-muted-foreground" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                          labelStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                        <Legend />
                        <Bar dataKey="avgScore" fill="hsl(var(--primary))" name="Avg Score" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="passRate" fill="hsl(var(--chart-2))" name="Pass Rate %" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Question Difficulty Distribution</CardTitle>
                  <CardDescription>Breakdown of questions by difficulty level</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={DIFFICULTY_DISTRIBUTION}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {DIFFICULTY_DISTRIBUTION.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Exam Details Table */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Exam Details</CardTitle>
                <CardDescription>Detailed statistics for each exam</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Exam Name</th>
                        <th className="text-center py-3 px-4 font-medium text-muted-foreground">Students</th>
                        <th className="text-center py-3 px-4 font-medium text-muted-foreground">Avg Score</th>
                        <th className="text-center py-3 px-4 font-medium text-muted-foreground">Pass Rate</th>
                        <th className="text-center py-3 px-4 font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {EXAM_STATISTICS.map((exam, index) => (
                        <tr key={index} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{exam.name}</td>
                          <td className="py-3 px-4 text-center">{exam.students}</td>
                          <td className="py-3 px-4 text-center">{exam.avgScore}%</td>
                          <td className="py-3 px-4 text-center">
                            <span className={exam.passRate >= 90 ? 'text-emerald-500' : exam.passRate >= 80 ? 'text-amber-500' : 'text-red-500'}>
                              {exam.passRate}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Badge variant={exam.passRate >= 85 ? 'default' : 'secondary'}>
                              {exam.passRate >= 85 ? 'Good' : 'Needs Review'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Class Comparison Tab */}
          <TabsContent value="classes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Class Performance Comparison</CardTitle>
                <CardDescription>Compare average scores across different classes and subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={CLASS_COMPARISON_DATA} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" domain={[0, 100]} className="text-xs fill-muted-foreground" />
                      <YAxis dataKey="class" type="category" width={80} className="text-xs fill-muted-foreground" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Legend />
                      <Bar dataKey="physics" fill="hsl(var(--chart-1))" name="Physics" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="chemistry" fill="hsl(var(--chart-2))" name="Chemistry" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="math" fill="hsl(var(--chart-3))" name="Math" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Class Rankings */}
            <div className="grid gap-4 md:grid-cols-3">
              {['physics', 'chemistry', 'math'].map((subject) => {
                const sorted = [...CLASS_COMPARISON_DATA].sort((a, b) => 
                  (b[subject as keyof typeof b] as number) - (a[subject as keyof typeof a] as number)
                );
                const colors = subject === 'physics' ? 'from-rose-500/20 to-rose-500/5 border-rose-500/30' 
                  : subject === 'chemistry' ? 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30'
                  : 'from-blue-500/20 to-blue-500/5 border-blue-500/30';
                
                return (
                  <Card key={subject} className={`bg-gradient-to-br ${colors}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg capitalize">{subject} Rankings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {sorted.map((cls, idx) => (
                          <div key={cls.class} className="flex items-center justify-between py-1">
                            <span className="flex items-center gap-2">
                              <Badge variant={idx === 0 ? 'default' : 'outline'} className="w-6 h-6 p-0 flex items-center justify-center">
                                {idx + 1}
                              </Badge>
                              <span className="text-sm">{cls.class}</span>
                            </span>
                            <span className="font-semibold">{cls[subject as keyof typeof cls]}%</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Topic Analysis Tab */}
          <TabsContent value="topics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Topic-wise Performance</CardTitle>
                <CardDescription>Average scores across different topics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={TOPIC_PERFORMANCE}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="topic" className="text-xs fill-muted-foreground" />
                      <YAxis domain={[0, 100]} className="text-xs fill-muted-foreground" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Bar 
                        dataKey="score" 
                        name="Score"
                        radius={[4, 4, 0, 0]}
                      >
                        {TOPIC_PERFORMANCE.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.score >= 80 ? 'hsl(var(--chart-2))' : entry.score >= 70 ? 'hsl(var(--chart-4))' : 'hsl(var(--chart-1))'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Topic Details */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {TOPIC_PERFORMANCE.map((topic) => {
                const status = topic.score >= 80 ? 'strong' : topic.score >= 70 ? 'good' : 'needs-improvement';
                const colors = status === 'strong' 
                  ? 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/30' 
                  : status === 'good' 
                  ? 'border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/30'
                  : 'border-red-500/30 bg-red-500/5 dark:bg-red-950/30';
                
                return (
                  <Card key={topic.topic} className={colors}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{topic.topic}</span>
                        <Badge variant={status === 'strong' ? 'default' : status === 'good' ? 'secondary' : 'destructive'}>
                          {topic.score}%
                        </Badge>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            status === 'strong' ? 'bg-emerald-500' : status === 'good' ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${topic.score}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {status === 'strong' ? 'Students excel in this topic' 
                          : status === 'good' ? 'Room for improvement' 
                          : 'Focus area - needs attention'}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TeacherReports;
