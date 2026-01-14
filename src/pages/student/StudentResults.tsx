import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { studentNavItems } from "@/config/studentNavItems";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Target,
  Award,
  BookOpen,
  ChevronRight,
  Star,
  Zap,
  BarChart3,
  PieChart,
  Eye,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Mock exam history data
const examHistory = [
  {
    id: 1,
    name: "Calculus I - Midterm",
    subject: "Mathematics",
    date: "2025-01-10",
    score: 85,
    totalQuestions: 40,
    correctAnswers: 34,
    timeSpent: "1h 15m",
    averageScore: 72,
    rank: 5,
    totalStudents: 45,
    status: "passed",
  },
  {
    id: 2,
    name: "Physics Fundamentals Quiz",
    subject: "Physics",
    date: "2025-01-08",
    score: 92,
    totalQuestions: 25,
    correctAnswers: 23,
    timeSpent: "35m",
    averageScore: 68,
    rank: 2,
    totalStudents: 38,
    status: "passed",
  },
  {
    id: 3,
    name: "Data Structures - Chapter 5",
    subject: "Computer Science",
    date: "2025-01-05",
    score: 78,
    totalQuestions: 30,
    correctAnswers: 23,
    timeSpent: "50m",
    averageScore: 75,
    rank: 12,
    totalStudents: 42,
    status: "passed",
  },
  {
    id: 4,
    name: "English Literature Essay",
    subject: "English",
    date: "2025-01-02",
    score: 88,
    totalQuestions: 20,
    correctAnswers: 18,
    timeSpent: "1h 5m",
    averageScore: 70,
    rank: 3,
    totalStudents: 35,
    status: "passed",
  },
  {
    id: 5,
    name: "Chemistry Lab Test",
    subject: "Chemistry",
    date: "2024-12-28",
    score: 55,
    totalQuestions: 35,
    correctAnswers: 19,
    timeSpent: "1h 20m",
    averageScore: 62,
    rank: 28,
    totalStudents: 40,
    status: "failed",
  },
  {
    id: 6,
    name: "History of Science",
    subject: "History",
    date: "2024-12-20",
    score: 90,
    totalQuestions: 30,
    correctAnswers: 27,
    timeSpent: "45m",
    averageScore: 73,
    rank: 1,
    totalStudents: 32,
    status: "passed",
  },
];

// Performance trend data (last 6 months)
const performanceTrend = [
  { month: "Aug", score: 72, average: 68 },
  { month: "Sep", score: 78, average: 70 },
  { month: "Oct", score: 75, average: 69 },
  { month: "Nov", score: 82, average: 71 },
  { month: "Dec", score: 85, average: 72 },
  { month: "Jan", score: 88, average: 73 },
];

// Subject performance data
const subjectPerformance = [
  { subject: "Mathematics", score: 85, exams: 8, color: "hsl(var(--primary))" },
  { subject: "Physics", score: 92, exams: 6, color: "hsl(var(--success))" },
  { subject: "Computer Science", score: 78, exams: 10, color: "hsl(var(--accent))" },
  { subject: "English", score: 88, exams: 5, color: "hsl(var(--secondary))" },
  { subject: "Chemistry", score: 65, exams: 4, color: "hsl(var(--destructive))" },
];

// Skill radar data
const skillRadar = [
  { skill: "Problem Solving", value: 85, fullMark: 100 },
  { skill: "Time Management", value: 72, fullMark: 100 },
  { skill: "Accuracy", value: 88, fullMark: 100 },
  { skill: "Speed", value: 78, fullMark: 100 },
  { skill: "Comprehension", value: 90, fullMark: 100 },
  { skill: "Application", value: 82, fullMark: 100 },
];

// Grade distribution
const gradeDistribution = [
  { grade: "A (90-100)", count: 4, color: "hsl(var(--success))" },
  { grade: "B (80-89)", count: 8, color: "hsl(var(--primary))" },
  { grade: "C (70-79)", count: 5, color: "hsl(var(--accent))" },
  { grade: "D (60-69)", count: 2, color: "hsl(var(--muted))" },
  { grade: "F (<60)", count: 1, color: "hsl(var(--destructive))" },
];

const chartConfig = {
  score: {
    label: "Your Score",
    color: "hsl(var(--primary))",
  },
  average: {
    label: "Class Average",
    color: "hsl(var(--muted-foreground))",
  },
};

const StudentResults = () => {
  const [selectedExam, setSelectedExam] = useState<typeof examHistory[0] | null>(null);

  const overallStats = {
    averageScore: Math.round(examHistory.reduce((acc, e) => acc + e.score, 0) / examHistory.length),
    totalExams: examHistory.length,
    passRate: Math.round((examHistory.filter(e => e.status === "passed").length / examHistory.length) * 100),
    bestSubject: "Physics",
    improvement: 16,
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 80) return "text-primary";
    if (score >= 70) return "text-accent-foreground";
    if (score >= 60) return "text-muted-foreground";
    return "text-destructive";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { label: "Excellent", variant: "default" as const, className: "bg-success text-success-foreground" };
    if (score >= 80) return { label: "Good", variant: "default" as const, className: "bg-primary text-primary-foreground" };
    if (score >= 70) return { label: "Average", variant: "secondary" as const, className: "" };
    if (score >= 60) return { label: "Pass", variant: "outline" as const, className: "" };
    return { label: "Needs Improvement", variant: "destructive" as const, className: "" };
  };

  return (
    <DashboardLayout navItems={studentNavItems} role="student">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">My Results</h1>
          <p className="text-muted-foreground mt-1">Track your exam performance and progress over time</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">{overallStats.averageScore}%</div>
              <div className="text-xs text-muted-foreground">Average Score</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-5 h-5 text-success" />
              </div>
              <div className="text-2xl font-bold text-foreground">{overallStats.passRate}%</div>
              <div className="text-xs text-muted-foreground">Pass Rate</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-2">
                <BookOpen className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">{overallStats.totalExams}</div>
              <div className="text-xs text-muted-foreground">Exams Taken</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-2">
                <Star className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">{overallStats.bestSubject}</div>
              <div className="text-xs text-muted-foreground">Best Subject</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div className="text-2xl font-bold text-foreground">+{overallStats.improvement}%</div>
              <div className="text-xs text-muted-foreground">Improvement</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="history" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="history" className="gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Exam History</span>
              <span className="sm:hidden">History</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Performance Analytics</span>
              <span className="sm:hidden">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="subjects" className="gap-2">
              <PieChart className="w-4 h-4" />
              <span className="hidden sm:inline">Subject Breakdown</span>
              <span className="sm:hidden">Subjects</span>
            </TabsTrigger>
          </TabsList>

          {/* Exam History Tab */}
          <TabsContent value="history" className="space-y-4">
            <div className="grid gap-4">
              {examHistory.map((exam) => {
                const scoreBadge = getScoreBadge(exam.score);
                const isAboveAverage = exam.score > exam.averageScore;

                return (
                  <Card 
                    key={exam.id} 
                    className="hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => setSelectedExam(selectedExam?.id === exam.id ? null : exam)}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Exam Info */}
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              exam.status === "passed" ? "bg-success/10" : "bg-destructive/10"
                            }`}>
                              <span className={`text-lg font-bold ${getScoreColor(exam.score)}`}>
                                {exam.score}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                {exam.name}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <BookOpen className="w-3 h-3" />
                                  {exam.subject}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(exam.date).toLocaleDateString()}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {exam.timeSpent}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Score & Stats */}
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <Badge className={scoreBadge.className} variant={scoreBadge.variant}>
                              {scoreBadge.label}
                            </Badge>
                            <div className="flex items-center gap-1 mt-1 text-sm">
                              {isAboveAverage ? (
                                <TrendingUp className="w-3 h-3 text-success" />
                              ) : (
                                <TrendingDown className="w-3 h-3 text-destructive" />
                              )}
                              <span className={isAboveAverage ? "text-success" : "text-destructive"}>
                                {isAboveAverage ? "+" : ""}{exam.score - exam.averageScore}% vs avg
                              </span>
                            </div>
                          </div>
                          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                            <Award className="w-4 h-4" />
                            <span>Rank #{exam.rank}/{exam.totalStudents}</span>
                          </div>
                          <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${
                            selectedExam?.id === exam.id ? "rotate-90" : ""
                          }`} />
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {selectedExam?.id === exam.id && (
                        <div className="mt-4 pt-4 border-t border-border animate-fade-in">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-secondary/30 rounded-lg">
                              <div className="text-lg font-bold text-foreground">
                                {exam.correctAnswers}/{exam.totalQuestions}
                              </div>
                              <div className="text-xs text-muted-foreground">Correct Answers</div>
                            </div>
                            <div className="text-center p-3 bg-secondary/30 rounded-lg">
                              <div className="text-lg font-bold text-foreground">{exam.averageScore}%</div>
                              <div className="text-xs text-muted-foreground">Class Average</div>
                            </div>
                            <div className="text-center p-3 bg-secondary/30 rounded-lg">
                              <div className="text-lg font-bold text-foreground">#{exam.rank}</div>
                              <div className="text-xs text-muted-foreground">Class Rank</div>
                            </div>
                            <div className="text-center p-3 bg-secondary/30 rounded-lg">
                              <div className="text-lg font-bold text-foreground">{exam.timeSpent}</div>
                              <div className="text-xs text-muted-foreground">Time Spent</div>
                            </div>
                          </div>
                          <div className="mt-4">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-muted-foreground">Score Progress</span>
                              <span className="font-medium">{exam.score}%</span>
                            </div>
                            <Progress value={exam.score} className="h-2" />
                          </div>
                          <div className="mt-4 flex justify-end">
                            <Button variant="outline" size="sm" className="gap-2">
                              <Eye className="w-4 h-4" />
                              Review Answers
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Performance Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Performance Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Performance Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceTrend}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis 
                          dataKey="month" 
                          className="text-muted-foreground"
                          tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <YAxis 
                          domain={[50, 100]} 
                          className="text-muted-foreground"
                          tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="hsl(var(--primary))"
                          strokeWidth={3}
                          dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="average"
                          stroke="hsl(var(--muted-foreground))"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={{ fill: 'hsl(var(--muted-foreground))', strokeWidth: 2 }}
                        />
                        <Legend />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Skill Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-accent-foreground" />
                    Skills Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={skillRadar}>
                        <PolarGrid className="stroke-border" />
                        <PolarAngleAxis 
                          dataKey="skill" 
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                        />
                        <PolarRadiusAxis 
                          angle={30} 
                          domain={[0, 100]} 
                          tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <Radar
                          name="Skills"
                          dataKey="value"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Grade Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-success" />
                    Grade Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={gradeDistribution} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis 
                          type="category" 
                          dataKey="grade" 
                          width={80}
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                          {gradeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Quick Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg border border-success/20">
                    <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Improving Trend</div>
                      <div className="text-sm text-muted-foreground">
                        Your scores increased by 16% over the last 6 months
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Award className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Top 10% in Physics</div>
                      <div className="text-sm text-muted-foreground">
                        You consistently rank in the top performers
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                    <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                      <Target className="w-5 h-5 text-destructive" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Focus on Chemistry</div>
                      <div className="text-sm text-muted-foreground">
                        Consider extra practice in this subject
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg border border-accent/20">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Time Management</div>
                      <div className="text-sm text-muted-foreground">
                        Average completion time: 52 minutes
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Subject Breakdown Tab */}
          <TabsContent value="subjects" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Subject Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-primary" />
                    Subject Scores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={subjectPerformance}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="score"
                          nameKey="subject"
                          label={({ subject, score }) => `${subject.split(' ')[0]}: ${score}%`}
                          labelLine={false}
                        >
                          {subjectPerformance.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                          formatter={(value: number) => [`${value}%`, 'Score']}
                        />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Subject Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-accent-foreground" />
                    Subject Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {subjectPerformance.map((subject, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: subject.color }}
                          />
                          <span className="font-medium text-foreground">{subject.subject}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-muted-foreground">{subject.exams} exams</span>
                          <span className={`font-semibold ${getScoreColor(subject.score)}`}>
                            {subject.score}%
                          </span>
                        </div>
                      </div>
                      <Progress 
                        value={subject.score} 
                        className="h-2"
                        style={{ 
                          ['--progress-background' as string]: subject.color 
                        }}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Subject Comparison Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Subject Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subjectPerformance}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis 
                        dataKey="subject" 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                        interval={0}
                        angle={-20}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        domain={[0, 100]} 
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        formatter={(value: number) => [`${value}%`, 'Average Score']}
                      />
                      <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                        {subjectPerformance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentResults;
