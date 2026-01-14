import { useState } from 'react';
import { 
  Users, 
  Trophy, 
  TrendingUp, 
  TrendingDown,
  Star,
  Award,
  Target,
  Flame,
  Sparkles,
  Medal,
  Crown,
  ChevronRight,
  BookOpen,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { studentNavItems } from '@/config/studentNavItems';

interface ClassMember {
  id: number;
  name: string;
  avatar: string;
  score: number;
  rank: number;
  trend: 'up' | 'down' | 'same';
  isCurrentUser?: boolean;
}

interface Classroom {
  id: number;
  name: string;
  section: string;
  subject: string;
  teacher: string;
  teacherAvatar: string;
  totalStudents: number;
  myRank: number;
  myScore: number;
  classAverage: number;
  topScore: number;
  recentTrend: 'up' | 'down' | 'same';
  trendValue: number;
  color: string;
  topPerformers: ClassMember[];
}

const MOCK_CLASSROOMS: Classroom[] = [
  {
    id: 1,
    name: 'Class 10-A',
    section: 'Science Stream',
    subject: 'Mathematics',
    teacher: 'Mr. John Smith',
    teacherAvatar: 'JS',
    totalStudents: 35,
    myRank: 3,
    myScore: 88,
    classAverage: 72,
    topScore: 95,
    recentTrend: 'up',
    trendValue: 5,
    color: 'blue',
    topPerformers: [
      { id: 1, name: 'Alice Chen', avatar: 'AC', score: 95, rank: 1, trend: 'same' },
      { id: 2, name: 'Bob Wang', avatar: 'BW', score: 92, rank: 2, trend: 'up' },
      { id: 3, name: 'You', avatar: 'JD', score: 88, rank: 3, trend: 'up', isCurrentUser: true },
      { id: 4, name: 'Diana Lee', avatar: 'DL', score: 85, rank: 4, trend: 'down' },
      { id: 5, name: 'Eric Zhang', avatar: 'EZ', score: 82, rank: 5, trend: 'up' },
    ]
  },
  {
    id: 2,
    name: 'Class 10-A',
    section: 'Science Stream',
    subject: 'Physics',
    teacher: 'Ms. Sarah Johnson',
    teacherAvatar: 'SJ',
    totalStudents: 35,
    myRank: 5,
    myScore: 82,
    classAverage: 75,
    topScore: 94,
    recentTrend: 'up',
    trendValue: 3,
    color: 'purple',
    topPerformers: [
      { id: 1, name: 'Frank Liu', avatar: 'FL', score: 94, rank: 1, trend: 'same' },
      { id: 2, name: 'Grace Kim', avatar: 'GK', score: 91, rank: 2, trend: 'up' },
      { id: 3, name: 'Henry Wu', avatar: 'HW', score: 88, rank: 3, trend: 'down' },
      { id: 4, name: 'Ivy Chen', avatar: 'IC', score: 85, rank: 4, trend: 'same' },
      { id: 5, name: 'You', avatar: 'JD', score: 82, rank: 5, trend: 'up', isCurrentUser: true },
    ]
  },
  {
    id: 3,
    name: 'Class 10-A',
    section: 'Science Stream',
    subject: 'Chemistry',
    teacher: 'Dr. Michael Brown',
    teacherAvatar: 'MB',
    totalStudents: 35,
    myRank: 8,
    myScore: 76,
    classAverage: 70,
    topScore: 92,
    recentTrend: 'down',
    trendValue: 2,
    color: 'emerald',
    topPerformers: [
      { id: 1, name: 'Kevin Park', avatar: 'KP', score: 92, rank: 1, trend: 'up' },
      { id: 2, name: 'Lisa Wang', avatar: 'LW', score: 89, rank: 2, trend: 'same' },
      { id: 3, name: 'Mike Chen', avatar: 'MC', score: 86, rank: 3, trend: 'up' },
      { id: 4, name: 'Nancy Liu', avatar: 'NL', score: 83, rank: 4, trend: 'down' },
      { id: 5, name: 'Oscar Zhang', avatar: 'OZ', score: 80, rank: 5, trend: 'same' },
    ]
  },
];

const ENCOURAGEMENT_MESSAGES = {
  excellent: [
    { icon: Crown, message: "You're a star! Keep shining bright! ⭐", color: 'text-yellow-500' },
    { icon: Trophy, message: "Outstanding performance! You're crushing it!", color: 'text-amber-500' },
    { icon: Flame, message: "You're on fire! Unstoppable!", color: 'text-orange-500' },
  ],
  good: [
    { icon: TrendingUp, message: "Great progress! You're climbing the ranks!", color: 'text-emerald-500' },
    { icon: Target, message: "Solid work! The top spot is within reach!", color: 'text-blue-500' },
    { icon: Star, message: "You're doing amazing! Keep pushing!", color: 'text-purple-500' },
  ],
  improving: [
    { icon: Sparkles, message: "Every step counts! You're getting better!", color: 'text-cyan-500' },
    { icon: Award, message: "Don't give up! Your effort will pay off!", color: 'text-pink-500' },
    { icon: Target, message: "Focus on progress, not perfection!", color: 'text-indigo-500' },
  ],
  needsWork: [
    { icon: Flame, message: "Time to ignite your potential! You can do it!", color: 'text-rose-500' },
    { icon: TrendingUp, message: "Small steps lead to big achievements!", color: 'text-teal-500' },
    { icon: Star, message: "Believe in yourself! Your breakthrough is coming!", color: 'text-violet-500' },
  ],
};

const StudentClassrooms = () => {
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string; light: string; gradient: string }> = {
      blue: { 
        bg: 'bg-blue-500', 
        text: 'text-blue-500', 
        border: 'border-blue-500/30',
        light: 'bg-blue-500/10 dark:bg-blue-950/40',
        gradient: 'from-blue-500/20 to-blue-500/5'
      },
      purple: { 
        bg: 'bg-purple-500', 
        text: 'text-purple-500', 
        border: 'border-purple-500/30',
        light: 'bg-purple-500/10 dark:bg-purple-950/40',
        gradient: 'from-purple-500/20 to-purple-500/5'
      },
      emerald: { 
        bg: 'bg-emerald-500', 
        text: 'text-emerald-500', 
        border: 'border-emerald-500/30',
        light: 'bg-emerald-500/10 dark:bg-emerald-950/40',
        gradient: 'from-emerald-500/20 to-emerald-500/5'
      },
    };
    return colors[color] || colors.blue;
  };

  const getEncouragement = (rank: number, total: number, trend: 'up' | 'down' | 'same') => {
    const percentile = (rank / total) * 100;
    let category: keyof typeof ENCOURAGEMENT_MESSAGES;
    
    if (percentile <= 10) category = 'excellent';
    else if (percentile <= 30) category = 'good';
    else if (trend === 'up') category = 'improving';
    else category = 'needsWork';
    
    const messages = ENCOURAGEMENT_MESSAGES[category];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { icon: Crown, color: 'text-yellow-500 bg-yellow-500/10' };
    if (rank === 2) return { icon: Medal, color: 'text-gray-400 bg-gray-400/10' };
    if (rank === 3) return { icon: Medal, color: 'text-amber-600 bg-amber-600/10' };
    return null;
  };

  const overallStats = {
    averageRank: Math.round(MOCK_CLASSROOMS.reduce((acc, c) => acc + c.myRank, 0) / MOCK_CLASSROOMS.length),
    averageScore: Math.round(MOCK_CLASSROOMS.reduce((acc, c) => acc + c.myScore, 0) / MOCK_CLASSROOMS.length),
    totalClasses: MOCK_CLASSROOMS.length,
    improvingIn: MOCK_CLASSROOMS.filter(c => c.recentTrend === 'up').length,
  };

  return (
    <DashboardLayout navItems={studentNavItems} role="student">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Classrooms</h1>
            <p className="text-muted-foreground">Track your performance and compete with classmates</p>
          </div>
        </div>

        {/* Motivation Banner */}
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center md:text-left flex-1">
                <h3 className="text-xl font-semibold">You're doing great, Jane!</h3>
                <p className="text-muted-foreground mt-1">
                  You're in the <span className="font-semibold text-primary">top {Math.round((overallStats.averageRank / 35) * 100)}%</span> of your classes. 
                  {overallStats.improvingIn > 0 && ` You're improving in ${overallStats.improvingIn} subject${overallStats.improvingIn > 1 ? 's' : ''}!`}
                </p>
              </div>
              <div className="flex gap-4">
                <div className="text-center px-4 py-2 rounded-xl bg-background/50">
                  <p className="text-2xl font-bold text-primary">{overallStats.averageScore}%</p>
                  <p className="text-xs text-muted-foreground">Avg Score</p>
                </div>
                <div className="text-center px-4 py-2 rounded-xl bg-background/50">
                  <p className="text-2xl font-bold text-primary">#{overallStats.averageRank}</p>
                  <p className="text-xs text-muted-foreground">Avg Rank</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{overallStats.totalClasses}</p>
                  <p className="text-sm text-muted-foreground">Active Classes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{overallStats.improvingIn}</p>
                  <p className="text-sm text-muted-foreground">Improving In</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">#{Math.min(...MOCK_CLASSROOMS.map(c => c.myRank))}</p>
                  <p className="text-sm text-muted-foreground">Best Rank</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{Math.max(...MOCK_CLASSROOMS.map(c => c.myScore))}%</p>
                  <p className="text-sm text-muted-foreground">Best Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Classrooms */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Classes</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboards</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {MOCK_CLASSROOMS.map((classroom) => {
                const colors = getColorClasses(classroom.color);
                const encouragement = getEncouragement(classroom.myRank, classroom.totalStudents, classroom.recentTrend);
                const EncouragementIcon = encouragement.icon;
                
                return (
                  <Card 
                    key={classroom.id} 
                    className={`overflow-hidden transition-all hover:shadow-lg ${colors.border}`}
                  >
                    <div className={`h-2 ${colors.bg}`} />
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{classroom.subject}</CardTitle>
                          <CardDescription>{classroom.name} • {classroom.section}</CardDescription>
                        </div>
                        <Badge variant="outline" className="flex items-center gap-1">
                          {classroom.recentTrend === 'up' ? (
                            <TrendingUp className="w-3 h-3 text-emerald-500" />
                          ) : classroom.recentTrend === 'down' ? (
                            <TrendingDown className="w-3 h-3 text-red-500" />
                          ) : null}
                          <span className={classroom.recentTrend === 'up' ? 'text-emerald-500' : classroom.recentTrend === 'down' ? 'text-red-500' : ''}>
                            {classroom.recentTrend === 'up' ? '+' : classroom.recentTrend === 'down' ? '-' : ''}{classroom.trendValue}%
                          </span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* My Performance */}
                      <div className={`p-4 rounded-xl ${colors.light} border ${colors.border}`}>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium">Your Performance</span>
                          <div className="flex items-center gap-2">
                            <Badge className={`${colors.bg} text-white`}>Rank #{classroom.myRank}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-3xl font-bold">{classroom.myScore}%</p>
                            <p className="text-xs text-muted-foreground">Your Score</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-muted-foreground">{classroom.classAverage}%</p>
                            <p className="text-xs text-muted-foreground">Class Avg</p>
                          </div>
                        </div>
                        <Progress 
                          value={(classroom.myScore / classroom.topScore) * 100} 
                          className="h-2 mt-3" 
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {classroom.topScore - classroom.myScore} points to top scorer
                        </p>
                      </div>

                      {/* Encouragement Message */}
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                        <EncouragementIcon className={`w-5 h-5 ${encouragement.color}`} />
                        <p className="text-sm font-medium">{encouragement.message}</p>
                      </div>

                      {/* Top 3 Preview */}
                      <div>
                        <p className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-amber-500" />
                          Top Performers
                        </p>
                        <div className="flex items-center gap-2">
                          {classroom.topPerformers.slice(0, 3).map((member, idx) => {
                            const rankBadge = getRankBadge(member.rank);
                            return (
                              <div 
                                key={member.id}
                                className={`flex-1 p-2 rounded-lg text-center ${
                                  member.isCurrentUser ? 'bg-primary/10 border border-primary/30' : 'bg-secondary/50'
                                }`}
                              >
                                <div className="relative w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-1">
                                  <span className="text-xs font-medium">{member.avatar}</span>
                                  {rankBadge && (
                                    <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full ${rankBadge.color} flex items-center justify-center`}>
                                      <rankBadge.icon className="w-3 h-3" />
                                    </div>
                                  )}
                                </div>
                                <p className={`text-xs font-medium truncate ${member.isCurrentUser ? 'text-primary' : ''}`}>
                                  {member.isCurrentUser ? 'You' : member.name.split(' ')[0]}
                                </p>
                                <p className="text-xs text-muted-foreground">{member.score}%</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <Button variant="outline" className="w-full" onClick={() => setSelectedClassroom(classroom)}>
                        View Full Leaderboard
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            {MOCK_CLASSROOMS.map((classroom) => {
              const colors = getColorClasses(classroom.color);
              return (
                <Card key={classroom.id} className={colors.border}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg ${colors.light} flex items-center justify-center`}>
                            <BookOpen className={`w-4 h-4 ${colors.text}`} />
                          </div>
                          {classroom.subject}
                        </CardTitle>
                        <CardDescription>{classroom.name} • {classroom.totalStudents} students</CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Your Rank</p>
                        <p className="text-2xl font-bold">#{classroom.myRank}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {classroom.topPerformers.map((member) => {
                        const rankBadge = getRankBadge(member.rank);
                        return (
                          <div 
                            key={member.id}
                            className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                              member.isCurrentUser 
                                ? 'bg-primary/10 border border-primary/30' 
                                : 'hover:bg-secondary/50'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                              member.rank === 1 ? 'bg-yellow-500 text-white' :
                              member.rank === 2 ? 'bg-gray-400 text-white' :
                              member.rank === 3 ? 'bg-amber-600 text-white' :
                              'bg-secondary text-muted-foreground'
                            }`}>
                              {member.rank}
                            </div>
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                              <span className="text-sm font-medium">{member.avatar}</span>
                            </div>
                            <div className="flex-1">
                              <p className={`font-medium ${member.isCurrentUser ? 'text-primary' : ''}`}>
                                {member.name} {member.isCurrentUser && <Badge variant="secondary" className="ml-2">You</Badge>}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                {member.trend === 'up' && (
                                  <span className="flex items-center gap-1 text-emerald-500">
                                    <TrendingUp className="w-3 h-3" /> Rising
                                  </span>
                                )}
                                {member.trend === 'down' && (
                                  <span className="flex items-center gap-1 text-red-500">
                                    <TrendingDown className="w-3 h-3" /> Falling
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold">{member.score}%</p>
                              {rankBadge && (
                                <rankBadge.icon className={`w-4 h-4 ml-auto ${rankBadge.color.split(' ')[0]}`} />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>

        {/* Full Leaderboard Modal/Detail View */}
        {selectedClassroom && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedClassroom.subject} Leaderboard</CardTitle>
                    <CardDescription>{selectedClassroom.name} • {selectedClassroom.totalStudents} students</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedClassroom(null)}>✕</Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-y-auto max-h-[60vh]">
                <div className="divide-y">
                  {selectedClassroom.topPerformers.map((member) => {
                    const rankBadge = getRankBadge(member.rank);
                    return (
                      <div 
                        key={member.id}
                        className={`flex items-center gap-4 p-4 ${
                          member.isCurrentUser ? 'bg-primary/5' : ''
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          member.rank === 1 ? 'bg-yellow-500 text-white' :
                          member.rank === 2 ? 'bg-gray-400 text-white' :
                          member.rank === 3 ? 'bg-amber-600 text-white' :
                          'bg-secondary text-muted-foreground'
                        }`}>
                          {member.rank}
                        </div>
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          <span className="font-medium">{member.avatar}</span>
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${member.isCurrentUser ? 'text-primary' : ''}`}>
                            {member.name}
                          </p>
                          <div className="flex items-center gap-2">
                            {member.trend === 'up' && (
                              <Badge className="bg-emerald-500/10 text-emerald-500">
                                <TrendingUp className="w-3 h-3 mr-1" /> Improving
                              </Badge>
                            )}
                            {member.isCurrentUser && <Badge>You</Badge>}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">{member.score}%</p>
                          {rankBadge && <rankBadge.icon className={`w-5 h-5 ml-auto ${rankBadge.color.split(' ')[0]}`} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentClassrooms;
