import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Users,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Wifi,
  WifiOff,
  Play,
  Pause,
  Timer,
  Shield,
  Monitor,
  MousePointer,
  Keyboard,
  Copy,
  Camera,
  ExternalLink,
  Send,
  RefreshCw,
  Search,
  TrendingUp,
  Activity,
  FileText,
  AlertCircle,
  LogIn,
  LogOut,
  Ban,
} from 'lucide-react';

interface ExamSession {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  avatar: string;
  status: 'not_started' | 'logged_in' | 'in_progress' | 'submitted' | 'auto_submitted' | 'disconnected';
  loginTime: string | null;
  startTime: string | null;
  submitTime: string | null;
  currentQuestion: number;
  answeredQuestions: number;
  totalQuestions: number;
  timeRemaining: number; // in seconds
  alertCount: number;
  lastActivity: string;
  connectionStatus: 'online' | 'offline' | 'unstable';
  ipAddress: string;
  browser: string;
  autoSubmitReason?: string;
  activityLog: ActivityLog[];
}

interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'login' | 'start_exam' | 'answer' | 'navigate' | 'alert' | 'disconnect' | 'reconnect' | 'submit' | 'auto_submit' | 'tab_switch' | 'copy_attempt' | 'screenshot_attempt' | 'focus_lost' | 'focus_gained';
  description: string;
  severity: 'info' | 'warning' | 'critical';
  details?: string;
}

// Mock exam session data
const mockExamSessions: ExamSession[] = [
  {
    id: 'S001',
    studentId: 'STU001',
    studentName: 'Alice Johnson',
    studentEmail: 'alice@school.edu',
    avatar: '',
    status: 'in_progress',
    loginTime: '2025-01-14T09:00:00',
    startTime: '2025-01-14T09:02:00',
    submitTime: null,
    currentQuestion: 15,
    answeredQuestions: 14,
    totalQuestions: 25,
    timeRemaining: 2400,
    alertCount: 0,
    lastActivity: '10 seconds ago',
    connectionStatus: 'online',
    ipAddress: '192.168.1.101',
    browser: 'Chrome 120',
    activityLog: [
      { id: 'L001', timestamp: '2025-01-14T09:00:00', type: 'login', description: 'Student logged in', severity: 'info' },
      { id: 'L002', timestamp: '2025-01-14T09:02:00', type: 'start_exam', description: 'Started exam', severity: 'info' },
      { id: 'L003', timestamp: '2025-01-14T09:05:00', type: 'answer', description: 'Answered question 1', severity: 'info' },
      { id: 'L004', timestamp: '2025-01-14T09:25:00', type: 'answer', description: 'Answered question 14', severity: 'info' },
    ],
  },
  {
    id: 'S002',
    studentId: 'STU002',
    studentName: 'Bob Smith',
    studentEmail: 'bob@school.edu',
    avatar: '',
    status: 'in_progress',
    loginTime: '2025-01-14T08:58:00',
    startTime: '2025-01-14T09:01:00',
    submitTime: null,
    currentQuestion: 18,
    answeredQuestions: 17,
    totalQuestions: 25,
    timeRemaining: 1800,
    alertCount: 2,
    lastActivity: '1 minute ago',
    connectionStatus: 'online',
    ipAddress: '192.168.1.102',
    browser: 'Firefox 121',
    activityLog: [
      { id: 'L001', timestamp: '2025-01-14T08:58:00', type: 'login', description: 'Student logged in', severity: 'info' },
      { id: 'L002', timestamp: '2025-01-14T09:01:00', type: 'start_exam', description: 'Started exam', severity: 'info' },
      { id: 'L003', timestamp: '2025-01-14T09:15:00', type: 'tab_switch', description: 'Switched to another tab', severity: 'warning', details: 'Browser focus lost for 5 seconds' },
      { id: 'L004', timestamp: '2025-01-14T09:20:00', type: 'copy_attempt', description: 'Attempted to copy text', severity: 'critical', details: 'Copy action was blocked' },
    ],
  },
  {
    id: 'S003',
    studentId: 'STU003',
    studentName: 'Carol Davis',
    studentEmail: 'carol@school.edu',
    avatar: '',
    status: 'submitted',
    loginTime: '2025-01-14T08:55:00',
    startTime: '2025-01-14T09:00:00',
    submitTime: '2025-01-14T09:45:00',
    currentQuestion: 25,
    answeredQuestions: 25,
    totalQuestions: 25,
    timeRemaining: 0,
    alertCount: 0,
    lastActivity: '15 minutes ago',
    connectionStatus: 'offline',
    ipAddress: '192.168.1.103',
    browser: 'Chrome 120',
    activityLog: [
      { id: 'L001', timestamp: '2025-01-14T08:55:00', type: 'login', description: 'Student logged in', severity: 'info' },
      { id: 'L002', timestamp: '2025-01-14T09:00:00', type: 'start_exam', description: 'Started exam', severity: 'info' },
      { id: 'L003', timestamp: '2025-01-14T09:45:00', type: 'submit', description: 'Submitted exam manually', severity: 'info' },
    ],
  },
  {
    id: 'S004',
    studentId: 'STU004',
    studentName: 'Daniel Lee',
    studentEmail: 'daniel@school.edu',
    avatar: '',
    status: 'auto_submitted',
    loginTime: '2025-01-14T09:00:00',
    startTime: '2025-01-14T09:03:00',
    submitTime: '2025-01-14T10:33:00',
    currentQuestion: 20,
    answeredQuestions: 18,
    totalQuestions: 25,
    timeRemaining: 0,
    alertCount: 5,
    lastActivity: '2 minutes ago',
    connectionStatus: 'offline',
    ipAddress: '192.168.1.104',
    browser: 'Safari 17',
    autoSubmitReason: 'Time expired - Student ran out of time',
    activityLog: [
      { id: 'L001', timestamp: '2025-01-14T09:00:00', type: 'login', description: 'Student logged in', severity: 'info' },
      { id: 'L002', timestamp: '2025-01-14T09:03:00', type: 'start_exam', description: 'Started exam', severity: 'info' },
      { id: 'L003', timestamp: '2025-01-14T09:30:00', type: 'tab_switch', description: 'Switched to another tab', severity: 'warning', details: 'Browser focus lost for 12 seconds' },
      { id: 'L004', timestamp: '2025-01-14T09:45:00', type: 'disconnect', description: 'Connection lost', severity: 'warning', details: 'Internet connection interrupted' },
      { id: 'L005', timestamp: '2025-01-14T09:47:00', type: 'reconnect', description: 'Connection restored', severity: 'info' },
      { id: 'L006', timestamp: '2025-01-14T10:00:00', type: 'focus_lost', description: 'Window focus lost', severity: 'warning', details: 'Application went to background' },
      { id: 'L007', timestamp: '2025-01-14T10:15:00', type: 'screenshot_attempt', description: 'Screenshot attempt detected', severity: 'critical', details: 'PrintScreen key pressed' },
      { id: 'L008', timestamp: '2025-01-14T10:33:00', type: 'auto_submit', description: 'Exam auto-submitted', severity: 'critical', details: 'Time limit exceeded - 90 minutes elapsed' },
    ],
  },
  {
    id: 'S005',
    studentId: 'STU005',
    studentName: 'Emma Wilson',
    studentEmail: 'emma@school.edu',
    avatar: '',
    status: 'logged_in',
    loginTime: '2025-01-14T09:05:00',
    startTime: null,
    submitTime: null,
    currentQuestion: 0,
    answeredQuestions: 0,
    totalQuestions: 25,
    timeRemaining: 5400,
    alertCount: 0,
    lastActivity: '2 minutes ago',
    connectionStatus: 'online',
    ipAddress: '192.168.1.105',
    browser: 'Edge 120',
    activityLog: [
      { id: 'L001', timestamp: '2025-01-14T09:05:00', type: 'login', description: 'Student logged in', severity: 'info' },
    ],
  },
  {
    id: 'S006',
    studentId: 'STU006',
    studentName: 'Frank Brown',
    studentEmail: 'frank@school.edu',
    avatar: '',
    status: 'disconnected',
    loginTime: '2025-01-14T09:02:00',
    startTime: '2025-01-14T09:04:00',
    submitTime: null,
    currentQuestion: 8,
    answeredQuestions: 7,
    totalQuestions: 25,
    timeRemaining: 3600,
    alertCount: 1,
    lastActivity: '5 minutes ago',
    connectionStatus: 'offline',
    ipAddress: '192.168.1.106',
    browser: 'Chrome 120',
    activityLog: [
      { id: 'L001', timestamp: '2025-01-14T09:02:00', type: 'login', description: 'Student logged in', severity: 'info' },
      { id: 'L002', timestamp: '2025-01-14T09:04:00', type: 'start_exam', description: 'Started exam', severity: 'info' },
      { id: 'L003', timestamp: '2025-01-14T09:15:00', type: 'disconnect', description: 'Connection lost', severity: 'warning', details: 'Internet connection interrupted - awaiting reconnection' },
    ],
  },
  {
    id: 'S007',
    studentId: 'STU007',
    studentName: 'Grace Kim',
    studentEmail: 'grace@school.edu',
    avatar: '',
    status: 'not_started',
    loginTime: null,
    startTime: null,
    submitTime: null,
    currentQuestion: 0,
    answeredQuestions: 0,
    totalQuestions: 25,
    timeRemaining: 5400,
    alertCount: 0,
    lastActivity: 'Never',
    connectionStatus: 'offline',
    ipAddress: '-',
    browser: '-',
    activityLog: [],
  },
  {
    id: 'S008',
    studentId: 'STU008',
    studentName: 'Henry Zhang',
    studentEmail: 'henry@school.edu',
    avatar: '',
    status: 'auto_submitted',
    loginTime: '2025-01-14T09:01:00',
    startTime: '2025-01-14T09:02:00',
    submitTime: '2025-01-14T09:50:00',
    currentQuestion: 15,
    answeredQuestions: 12,
    totalQuestions: 25,
    timeRemaining: 0,
    alertCount: 8,
    lastActivity: '10 minutes ago',
    connectionStatus: 'offline',
    ipAddress: '192.168.1.108',
    browser: 'Chrome 120',
    autoSubmitReason: 'Exceeded maximum security violations (8 alerts)',
    activityLog: [
      { id: 'L001', timestamp: '2025-01-14T09:01:00', type: 'login', description: 'Student logged in', severity: 'info' },
      { id: 'L002', timestamp: '2025-01-14T09:02:00', type: 'start_exam', description: 'Started exam', severity: 'info' },
      { id: 'L003', timestamp: '2025-01-14T09:10:00', type: 'tab_switch', description: 'Switched to another tab (1st violation)', severity: 'warning', details: 'Browser focus lost for 8 seconds' },
      { id: 'L004', timestamp: '2025-01-14T09:15:00', type: 'copy_attempt', description: 'Attempted to copy text (2nd violation)', severity: 'critical', details: 'Ctrl+C pressed - action blocked' },
      { id: 'L005', timestamp: '2025-01-14T09:20:00', type: 'tab_switch', description: 'Switched to another tab (3rd violation)', severity: 'warning', details: 'Browser focus lost for 15 seconds' },
      { id: 'L006', timestamp: '2025-01-14T09:25:00', type: 'screenshot_attempt', description: 'Screenshot attempt (4th violation)', severity: 'critical', details: 'PrintScreen key detected' },
      { id: 'L007', timestamp: '2025-01-14T09:30:00', type: 'focus_lost', description: 'Window minimized (5th violation)', severity: 'warning', details: 'Application went to background for 20 seconds' },
      { id: 'L008', timestamp: '2025-01-14T09:35:00', type: 'tab_switch', description: 'Switched to another tab (6th violation)', severity: 'warning', details: 'Opened new browser tab' },
      { id: 'L009', timestamp: '2025-01-14T09:40:00', type: 'copy_attempt', description: 'Right-click context menu (7th violation)', severity: 'critical', details: 'Right-click detected - action blocked' },
      { id: 'L010', timestamp: '2025-01-14T09:45:00', type: 'tab_switch', description: 'Switched to another tab (8th violation)', severity: 'warning', details: 'Final warning triggered' },
      { id: 'L011', timestamp: '2025-01-14T09:50:00', type: 'auto_submit', description: 'Exam auto-submitted', severity: 'critical', details: 'Maximum violation limit (8) exceeded. Exam terminated for security reasons.' },
    ],
  },
];

interface ExamMonitorProps {
  examId: string;
  examTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

const ExamMonitor = ({ examId, examTitle, isOpen, onClose }: ExamMonitorProps) => {
  const [sessions] = useState<ExamSession[]>(mockExamSessions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSession, setSelectedSession] = useState<ExamSession | null>(null);
  const [showActivityLog, setShowActivityLog] = useState(false);

  const filteredSessions = sessions.filter((session) =>
    session.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.studentEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate statistics
  const stats = {
    total: sessions.length,
    notStarted: sessions.filter(s => s.status === 'not_started').length,
    loggedIn: sessions.filter(s => s.status === 'logged_in').length,
    inProgress: sessions.filter(s => s.status === 'in_progress').length,
    submitted: sessions.filter(s => s.status === 'submitted').length,
    autoSubmitted: sessions.filter(s => s.status === 'auto_submitted').length,
    disconnected: sessions.filter(s => s.status === 'disconnected').length,
    online: sessions.filter(s => s.connectionStatus === 'online').length,
    totalAlerts: sessions.reduce((sum, s) => sum + s.alertCount, 0),
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m ${secs}s`;
  };

  const getStatusBadge = (status: ExamSession['status']) => {
    switch (status) {
      case 'not_started':
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" /> Not Started</Badge>;
      case 'logged_in':
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 gap-1"><LogIn className="h-3 w-3" /> Logged In</Badge>;
      case 'in_progress':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20 gap-1"><Play className="h-3 w-3" /> In Progress</Badge>;
      case 'submitted':
        return <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 gap-1"><CheckCircle2 className="h-3 w-3" /> Submitted</Badge>;
      case 'auto_submitted':
        return <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20 gap-1"><AlertTriangle className="h-3 w-3" /> Auto-Submitted</Badge>;
      case 'disconnected':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20 gap-1"><WifiOff className="h-3 w-3" /> Disconnected</Badge>;
    }
  };

  const getConnectionBadge = (status: ExamSession['connectionStatus']) => {
    switch (status) {
      case 'online':
        return <Badge variant="outline" className="text-green-600 gap-1"><Wifi className="h-3 w-3" /> Online</Badge>;
      case 'offline':
        return <Badge variant="outline" className="text-red-600 gap-1"><WifiOff className="h-3 w-3" /> Offline</Badge>;
      case 'unstable':
        return <Badge variant="outline" className="text-yellow-600 gap-1"><Activity className="h-3 w-3" /> Unstable</Badge>;
    }
  };

  const getSeverityIcon = (severity: ActivityLog['severity']) => {
    switch (severity) {
      case 'info':
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getActivityIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'login': return <LogIn className="h-4 w-4" />;
      case 'start_exam': return <Play className="h-4 w-4" />;
      case 'answer': return <FileText className="h-4 w-4" />;
      case 'navigate': return <MousePointer className="h-4 w-4" />;
      case 'alert': return <AlertTriangle className="h-4 w-4" />;
      case 'disconnect': return <WifiOff className="h-4 w-4" />;
      case 'reconnect': return <Wifi className="h-4 w-4" />;
      case 'submit': return <Send className="h-4 w-4" />;
      case 'auto_submit': return <Ban className="h-4 w-4" />;
      case 'tab_switch': return <ExternalLink className="h-4 w-4" />;
      case 'copy_attempt': return <Copy className="h-4 w-4" />;
      case 'screenshot_attempt': return <Camera className="h-4 w-4" />;
      case 'focus_lost': return <Eye className="h-4 w-4" />;
      case 'focus_gained': return <Eye className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const openActivityLog = (session: ExamSession) => {
    setSelectedSession(session);
    setShowActivityLog(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-primary" />
              Exam Monitor: {examTitle}
            </DialogTitle>
            <DialogDescription>
              Real-time monitoring of student exam sessions
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col gap-4">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
              <Card className="p-3">
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </Card>
              <Card className="p-3 bg-secondary/50">
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats.notStarted}</p>
                  <p className="text-xs text-muted-foreground">Not Started</p>
                </div>
              </Card>
              <Card className="p-3 bg-blue-500/10">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{stats.loggedIn}</p>
                  <p className="text-xs text-blue-600">Logged In</p>
                </div>
              </Card>
              <Card className="p-3 bg-green-500/10">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{stats.inProgress}</p>
                  <p className="text-xs text-green-600">In Progress</p>
                </div>
              </Card>
              <Card className="p-3 bg-purple-500/10">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{stats.submitted}</p>
                  <p className="text-xs text-purple-600">Submitted</p>
                </div>
              </Card>
              <Card className="p-3 bg-orange-500/10">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{stats.autoSubmitted}</p>
                  <p className="text-xs text-orange-600">Auto-Submit</p>
                </div>
              </Card>
              <Card className="p-3 bg-red-500/10">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{stats.disconnected}</p>
                  <p className="text-xs text-red-600">Disconnected</p>
                </div>
              </Card>
              <Card className="p-3 border-yellow-500/50">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">{stats.totalAlerts}</p>
                  <p className="text-xs text-yellow-600">Total Alerts</p>
                </div>
              </Card>
            </div>

            {/* Search and Refresh */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            {/* Sessions Table */}
            <Card className="flex-1 overflow-hidden">
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Connection</TableHead>
                      <TableHead className="text-center">Progress</TableHead>
                      <TableHead className="text-center">Time Left</TableHead>
                      <TableHead className="text-center">Alerts</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSessions.map((session) => (
                      <TableRow 
                        key={session.id} 
                        className={session.alertCount > 3 ? 'bg-red-500/5' : session.status === 'disconnected' ? 'bg-yellow-500/5' : ''}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={session.avatar} />
                              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {session.studentName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{session.studentName}</p>
                              <p className="text-xs text-muted-foreground">{session.studentEmail}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(session.status)}</TableCell>
                        <TableCell>{getConnectionBadge(session.connectionStatus)}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center gap-1">
                            <Progress value={(session.answeredQuestions / session.totalQuestions) * 100} className="w-16 h-2" />
                            <span className="text-xs text-muted-foreground">
                              {session.answeredQuestions}/{session.totalQuestions}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`text-sm font-medium ${session.timeRemaining < 600 ? 'text-red-600' : ''}`}>
                            {session.status === 'submitted' || session.status === 'auto_submitted' 
                              ? '-' 
                              : formatTime(session.timeRemaining)}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          {session.alertCount > 0 ? (
                            <Badge 
                              variant="outline" 
                              className={session.alertCount >= 5 ? 'text-red-600 border-red-500' : 'text-yellow-600 border-yellow-500'}
                            >
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {session.alertCount}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-green-600">
                              <Shield className="h-3 w-3 mr-1" />
                              0
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground">{session.lastActivity}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openActivityLog(session)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Log
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Activity Log Dialog */}
      <Dialog open={showActivityLog} onOpenChange={setShowActivityLog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          {selectedSession && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {selectedSession.studentName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span>{selectedSession.studentName}</span>
                    <p className="text-sm font-normal text-muted-foreground">{selectedSession.studentEmail}</p>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Session activity log and details
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="activity" className="flex-1 overflow-hidden flex flex-col">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="activity">Activity Log</TabsTrigger>
                  <TabsTrigger value="details">Session Details</TabsTrigger>
                </TabsList>

                <TabsContent value="activity" className="flex-1 overflow-hidden mt-4">
                  {selectedSession.status === 'auto_submitted' && selectedSession.autoSubmitReason && (
                    <Card className="mb-4 border-orange-500/50 bg-orange-500/5">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-orange-700">Auto-Submit Reason</p>
                            <p className="text-sm text-orange-600">{selectedSession.autoSubmitReason}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <ScrollArea className="h-[350px] pr-4">
                    <div className="space-y-3">
                      {selectedSession.activityLog.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>No activity recorded yet</p>
                        </div>
                      ) : (
                        selectedSession.activityLog.map((log, index) => (
                          <div 
                            key={log.id} 
                            className={`flex gap-3 p-3 rounded-lg border ${
                              log.severity === 'critical' ? 'bg-red-500/5 border-red-500/30' :
                              log.severity === 'warning' ? 'bg-yellow-500/5 border-yellow-500/30' :
                              'bg-muted/50 border-border'
                            }`}
                          >
                            <div className="flex flex-col items-center gap-1">
                              {getSeverityIcon(log.severity)}
                              {index < selectedSession.activityLog.length - 1 && (
                                <div className="w-px h-full bg-border" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                {getActivityIcon(log.type)}
                                <span className="font-medium text-sm">{log.description}</span>
                              </div>
                              {log.details && (
                                <p className="text-xs text-muted-foreground mb-1">{log.details}</p>
                              )}
                              <p className="text-xs text-muted-foreground">
                                {new Date(log.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="details" className="mt-4">
                  <div className="grid gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Session Information</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Status</p>
                          <div className="mt-1">{getStatusBadge(selectedSession.status)}</div>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Connection</p>
                          <div className="mt-1">{getConnectionBadge(selectedSession.connectionStatus)}</div>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Login Time</p>
                          <p className="font-medium">
                            {selectedSession.loginTime 
                              ? new Date(selectedSession.loginTime).toLocaleString()
                              : 'Not logged in'}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Exam Started</p>
                          <p className="font-medium">
                            {selectedSession.startTime 
                              ? new Date(selectedSession.startTime).toLocaleString()
                              : 'Not started'}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Submit Time</p>
                          <p className="font-medium">
                            {selectedSession.submitTime 
                              ? new Date(selectedSession.submitTime).toLocaleString()
                              : 'Not submitted'}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Alert Count</p>
                          <p className={`font-medium ${selectedSession.alertCount > 3 ? 'text-red-600' : ''}`}>
                            {selectedSession.alertCount} alerts
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Progress & Technical Info</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Questions Answered</p>
                          <p className="font-medium">{selectedSession.answeredQuestions} / {selectedSession.totalQuestions}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Current Question</p>
                          <p className="font-medium">
                            {selectedSession.currentQuestion > 0 
                              ? `Question ${selectedSession.currentQuestion}`
                              : '-'}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">IP Address</p>
                          <p className="font-medium font-mono">{selectedSession.ipAddress}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Browser</p>
                          <p className="font-medium">{selectedSession.browser}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExamMonitor;
