import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { teacherNavItems } from '@/config/teacherNavItems';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  Filter,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  Mail,
  Phone,
  Calendar,
  Award,
  BookOpen,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  MessageSquare,
  Download,
  MoreHorizontal,
  GraduationCap,
  BarChart3,
  FileText,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock student data
const mockStudents = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice.johnson@school.edu',
    phone: '+1 234 567 8901',
    avatar: '',
    class: '10th Grade - Section A',
    subjects: ['Mathematics', 'Physics'],
    averageScore: 92,
    trend: 'up',
    attendance: 98,
    examsCompleted: 12,
    lastActive: '2 hours ago',
    status: 'active',
    enrolledDate: '2024-09-01',
    parentName: 'Robert Johnson',
    parentEmail: 'robert.johnson@email.com',
    examHistory: [
      { id: 1, name: 'Mathematics Mid-Term', date: '2024-12-10', score: 95, maxScore: 100, grade: 'A+' },
      { id: 2, name: 'Physics Quiz 3', date: '2024-12-05', score: 88, maxScore: 100, grade: 'B+' },
      { id: 3, name: 'Mathematics Quiz 5', date: '2024-11-28', score: 92, maxScore: 100, grade: 'A' },
      { id: 4, name: 'Physics Mid-Term', date: '2024-11-20', score: 90, maxScore: 100, grade: 'A' },
    ],
    subjectPerformance: [
      { subject: 'Mathematics', average: 94, exams: 6, trend: 'up' },
      { subject: 'Physics', average: 89, exams: 6, trend: 'stable' },
    ],
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob.smith@school.edu',
    phone: '+1 234 567 8902',
    avatar: '',
    class: '10th Grade - Section A',
    subjects: ['Mathematics', 'Physics'],
    averageScore: 78,
    trend: 'stable',
    attendance: 92,
    examsCompleted: 11,
    lastActive: '1 day ago',
    status: 'active',
    enrolledDate: '2024-09-01',
    parentName: 'Mary Smith',
    parentEmail: 'mary.smith@email.com',
    examHistory: [
      { id: 1, name: 'Mathematics Mid-Term', date: '2024-12-10', score: 75, maxScore: 100, grade: 'C+' },
      { id: 2, name: 'Physics Quiz 3', date: '2024-12-05', score: 80, maxScore: 100, grade: 'B' },
      { id: 3, name: 'Mathematics Quiz 5', date: '2024-11-28', score: 78, maxScore: 100, grade: 'C+' },
    ],
    subjectPerformance: [
      { subject: 'Mathematics', average: 76, exams: 6, trend: 'down' },
      { subject: 'Physics', average: 80, exams: 5, trend: 'up' },
    ],
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol.davis@school.edu',
    phone: '+1 234 567 8903',
    avatar: '',
    class: '10th Grade - Section B',
    subjects: ['Mathematics'],
    averageScore: 85,
    trend: 'up',
    attendance: 95,
    examsCompleted: 10,
    lastActive: '5 hours ago',
    status: 'active',
    enrolledDate: '2024-09-01',
    parentName: 'David Davis',
    parentEmail: 'david.davis@email.com',
    examHistory: [
      { id: 1, name: 'Mathematics Mid-Term', date: '2024-12-10', score: 88, maxScore: 100, grade: 'B+' },
      { id: 2, name: 'Mathematics Quiz 5', date: '2024-11-28', score: 85, maxScore: 100, grade: 'B' },
    ],
    subjectPerformance: [
      { subject: 'Mathematics', average: 85, exams: 10, trend: 'up' },
    ],
  },
  {
    id: '4',
    name: 'Daniel Lee',
    email: 'daniel.lee@school.edu',
    phone: '+1 234 567 8904',
    avatar: '',
    class: '11th Grade - Section A',
    subjects: ['Physics'],
    averageScore: 58,
    trend: 'down',
    attendance: 78,
    examsCompleted: 8,
    lastActive: '3 days ago',
    status: 'at-risk',
    enrolledDate: '2024-09-01',
    parentName: 'Susan Lee',
    parentEmail: 'susan.lee@email.com',
    examHistory: [
      { id: 1, name: 'Physics Mid-Term', date: '2024-12-10', score: 52, maxScore: 100, grade: 'F' },
      { id: 2, name: 'Physics Quiz 3', date: '2024-12-05', score: 60, maxScore: 100, grade: 'D' },
    ],
    subjectPerformance: [
      { subject: 'Physics', average: 58, exams: 8, trend: 'down' },
    ],
  },
  {
    id: '5',
    name: 'Emma Wilson',
    email: 'emma.wilson@school.edu',
    phone: '+1 234 567 8905',
    avatar: '',
    class: '11th Grade - Section A',
    subjects: ['Mathematics', 'Physics'],
    averageScore: 96,
    trend: 'up',
    attendance: 100,
    examsCompleted: 12,
    lastActive: '1 hour ago',
    status: 'excellent',
    enrolledDate: '2024-09-01',
    parentName: 'James Wilson',
    parentEmail: 'james.wilson@email.com',
    examHistory: [
      { id: 1, name: 'Mathematics Mid-Term', date: '2024-12-10', score: 98, maxScore: 100, grade: 'A+' },
      { id: 2, name: 'Physics Mid-Term', date: '2024-12-10', score: 95, maxScore: 100, grade: 'A+' },
      { id: 3, name: 'Physics Quiz 3', date: '2024-12-05', score: 96, maxScore: 100, grade: 'A+' },
    ],
    subjectPerformance: [
      { subject: 'Mathematics', average: 97, exams: 6, trend: 'up' },
      { subject: 'Physics', average: 95, exams: 6, trend: 'up' },
    ],
  },
  {
    id: '6',
    name: 'Frank Brown',
    email: 'frank.brown@school.edu',
    phone: '+1 234 567 8906',
    avatar: '',
    class: '10th Grade - Section B',
    subjects: ['Mathematics', 'Physics'],
    averageScore: 72,
    trend: 'down',
    attendance: 85,
    examsCompleted: 9,
    lastActive: '2 days ago',
    status: 'warning',
    enrolledDate: '2024-09-01',
    parentName: 'Nancy Brown',
    parentEmail: 'nancy.brown@email.com',
    examHistory: [
      { id: 1, name: 'Mathematics Mid-Term', date: '2024-12-10', score: 70, maxScore: 100, grade: 'C' },
      { id: 2, name: 'Physics Quiz 3', date: '2024-12-05', score: 68, maxScore: 100, grade: 'D+' },
    ],
    subjectPerformance: [
      { subject: 'Mathematics', average: 74, exams: 5, trend: 'stable' },
      { subject: 'Physics', average: 70, exams: 4, trend: 'down' },
    ],
  },
];

const classes = ['All Classes', '10th Grade - Section A', '10th Grade - Section B', '11th Grade - Section A'];
const subjects = ['All Subjects', 'Mathematics', 'Physics'];
const statuses = ['All Status', 'excellent', 'active', 'warning', 'at-risk'];

const TeacherStudents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedStudent, setSelectedStudent] = useState<typeof mockStudents[0] | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Filter students
  const filteredStudents = mockStudents.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === 'All Classes' || student.class === selectedClass;
    const matchesSubject = selectedSubject === 'All Subjects' || student.subjects.includes(selectedSubject);
    const matchesStatus = selectedStatus === 'All Status' || student.status === selectedStatus;
    return matchesSearch && matchesClass && matchesSubject && matchesStatus;
  });

  // Calculate metrics
  const totalStudents = mockStudents.length;
  const averageScore = Math.round(mockStudents.reduce((sum, s) => sum + s.averageScore, 0) / totalStudents);
  const atRiskStudents = mockStudents.filter(s => s.status === 'at-risk' || s.status === 'warning').length;
  const excellentStudents = mockStudents.filter(s => s.status === 'excellent').length;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Excellent</Badge>;
      case 'active':
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Active</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Warning</Badge>;
      case 'at-risk':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">At Risk</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-green-500/10 text-green-600';
    if (grade.startsWith('B')) return 'bg-blue-500/10 text-blue-600';
    if (grade.startsWith('C')) return 'bg-yellow-500/10 text-yellow-600';
    return 'bg-red-500/10 text-red-600';
  };

  const openStudentProfile = (student: typeof mockStudents[0]) => {
    setSelectedStudent(student);
    setIsProfileOpen(true);
  };

  return (
    <DashboardLayout navItems={teacherNavItems} role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Students</h1>
            <p className="text-muted-foreground mt-1">Manage and track student performance</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Announcement
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-3xl font-bold">{totalStudents}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Class Average</p>
                  <p className="text-3xl font-bold">{averageScore}%</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-full">
                  <BarChart3 className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Top Performers</p>
                  <p className="text-3xl font-bold">{excellentStudents}</p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-full">
                  <Award className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Need Attention</p>
                  <p className="text-3xl font-bold">{atRiskStudents}</p>
                </div>
                <div className="p-3 bg-red-500/10 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subj) => (
                      <SelectItem key={subj} value={subj}>{subj}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status === 'All Status' ? status : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Student Roster
            </CardTitle>
            <CardDescription>
              Showing {filteredStudents.length} of {totalStudents} students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead className="text-center">Average</TableHead>
                  <TableHead className="text-center">Trend</TableHead>
                  <TableHead className="text-center">Attendance</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openStudentProfile(student)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {student.subjects.map((subj) => (
                          <Badge key={subj} variant="outline" className="text-xs">{subj}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`font-semibold ${getScoreColor(student.averageScore)}`}>
                        {student.averageScore}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {getTrendIcon(student.trend)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Progress value={student.attendance} className="w-16 h-2" />
                        <span className="text-sm text-muted-foreground">{student.attendance}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(student.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openStudentProfile(student); }}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <FileText className="h-4 w-4 mr-2" />
                            View Exams
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <Download className="h-4 w-4 mr-2" />
                            Export Report
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No students found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Student Profile Dialog */}
        <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedStudent && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedStudent.avatar} />
                      <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                        {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span>{selectedStudent.name}</span>
                        {getStatusBadge(selectedStudent.status)}
                      </div>
                      <DialogDescription className="text-left">
                        {selectedStudent.class}
                      </DialogDescription>
                    </div>
                  </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="overview" className="mt-4">
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="exams">Exam History</TabsTrigger>
                    <TabsTrigger value="contact">Contact Info</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4 mt-4">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="pt-4 text-center">
                          <Target className="h-8 w-8 mx-auto text-primary mb-2" />
                          <p className="text-2xl font-bold">{selectedStudent.averageScore}%</p>
                          <p className="text-xs text-muted-foreground">Average Score</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4 text-center">
                          <CheckCircle2 className="h-8 w-8 mx-auto text-green-500 mb-2" />
                          <p className="text-2xl font-bold">{selectedStudent.attendance}%</p>
                          <p className="text-xs text-muted-foreground">Attendance</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4 text-center">
                          <BookOpen className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                          <p className="text-2xl font-bold">{selectedStudent.examsCompleted}</p>
                          <p className="text-xs text-muted-foreground">Exams Taken</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4 text-center">
                          <Clock className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
                          <p className="text-sm font-medium">{selectedStudent.lastActive}</p>
                          <p className="text-xs text-muted-foreground">Last Active</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Subject Performance */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Subject Performance</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {selectedStudent.subjectPerformance.map((perf) => (
                          <div key={perf.subject} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{perf.subject}</span>
                                {getTrendIcon(perf.trend)}
                              </div>
                              <span className={`font-semibold ${getScoreColor(perf.average)}`}>
                                {perf.average}%
                              </span>
                            </div>
                            <Progress value={perf.average} className="h-2" />
                            <p className="text-xs text-muted-foreground">{perf.exams} exams completed</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="exams" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Recent Exams</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Exam</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead className="text-center">Score</TableHead>
                              <TableHead className="text-center">Grade</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedStudent.examHistory.map((exam) => (
                              <TableRow key={exam.id}>
                                <TableCell className="font-medium">{exam.name}</TableCell>
                                <TableCell>{exam.date}</TableCell>
                                <TableCell className="text-center">
                                  <span className={getScoreColor(exam.score)}>
                                    {exam.score}/{exam.maxScore}
                                  </span>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge className={getGradeColor(exam.grade)}>{exam.grade}</Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="contact" className="mt-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Student Contact</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Email</p>
                              <p className="font-medium">{selectedStudent.email}</p>
                            </div>
                          </div>
                          <Separator />
                          <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Phone</p>
                              <p className="font-medium">{selectedStudent.phone}</p>
                            </div>
                          </div>
                          <Separator />
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Enrolled Date</p>
                              <p className="font-medium">{selectedStudent.enrolledDate}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Parent/Guardian</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Users className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Name</p>
                              <p className="font-medium">{selectedStudent.parentName}</p>
                            </div>
                          </div>
                          <Separator />
                          <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Email</p>
                              <p className="font-medium">{selectedStudent.parentEmail}</p>
                            </div>
                          </div>
                          <Button className="w-full mt-4" variant="outline">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Contact Parent
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsProfileOpen(false)}>
                    Close
                  </Button>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Export Full Report
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default TeacherStudents;
