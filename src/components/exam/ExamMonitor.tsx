import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Wifi,
  WifiOff,
  Play,
  Shield,
  Monitor,
  Activity,
  AlertCircle,
  LogIn,
  Ban,
  Search,
  RefreshCw,
} from 'lucide-react';
import { useExamWebSocket, type ExamEvent } from '@/hooks/useExamWebSocket';

interface StudentSession {
  studentId: string;
  studentName: string;
  status: string;
  violationType: string | null;
  violationCount: number;
  remainingTime: number;
  lastEventType: string;
  lastEventTime: string;
  message: string | null;
  eventLog: ExamEvent[];
}

interface ExamMonitorProps {
  examId: string;
  examTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

const ExamMonitor = ({ examId, examTitle, isOpen, onClose }: ExamMonitorProps) => {
  const [sessions, setSessions] = useState<Map<string, StudentSession>>(new Map());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSession, setSelectedSession] = useState<StudentSession | null>(null);
  const [showActivityLog, setShowActivityLog] = useState(false);

  const handleEvent = useCallback((event: ExamEvent) => {
    setSessions(prev => {
      const next = new Map(prev);
      const existing = next.get(event.studentId);

      const session: StudentSession = {
        studentId: event.studentId,
        studentName: event.studentName,
        status: event.status,
        violationType: event.violationType,
        violationCount: event.violationCount,
        remainingTime: event.remainingTime,
        lastEventType: event.eventType,
        lastEventTime: event.currentTime,
        message: event.message,
        eventLog: [...(existing?.eventLog || []), event],
      };

      next.set(event.studentId, session);
      return next;
    });

    // Toast notifications for important events
    if (event.eventType === 'JOIN') {
      toast.info(`${event.studentName} joined the exam`);
    } else if (event.eventType === 'VIOLATION') {
      toast.warning(`Alert: ${event.studentName}`, {
        description: event.violationType || 'Security violation detected',
      });
    } else if (event.eventType === 'SUBMIT') {
      toast.success(`${event.studentName} submitted the exam`);
    } else if (event.eventType === 'DISCONNECT') {
      toast.error(`${event.studentName} disconnected`);
    }
  }, []);

  const { connected, error } = useExamWebSocket({
    examId,
    enabled: isOpen,
    onEvent: handleEvent,
  });

  // Keep selected session in sync
  useEffect(() => {
    if (selectedSession) {
      const updated = sessions.get(selectedSession.studentId);
      if (updated) setSelectedSession(updated);
    }
  }, [sessions, selectedSession?.studentId]);

  const sessionList = Array.from(sessions.values());

  const filteredSessions = sessionList.filter(s =>
    s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const stats = {
    total: sessionList.length,
    inProgress: sessionList.filter(s => s.status === 'IN_PROGRESS').length,
    submitted: sessionList.filter(s => s.status === 'SUBMITTED').length,
    disconnected: sessionList.filter(s => s.status === 'DISCONNECTED').length,
    totalViolations: sessionList.reduce((sum, s) => sum + s.violationCount, 0),
  };

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return '0m 0s';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m ${secs}s`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20 gap-1"><Play className="h-3 w-3" /> In Progress</Badge>;
      case 'SUBMITTED':
        return <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 gap-1"><CheckCircle2 className="h-3 w-3" /> Submitted</Badge>;
      case 'AUTO_SUBMITTED':
        return <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20 gap-1"><AlertTriangle className="h-3 w-3" /> Auto-Submitted</Badge>;
      case 'DISCONNECTED':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20 gap-1"><WifiOff className="h-3 w-3" /> Disconnected</Badge>;
      default:
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" /> {status}</Badge>;
    }
  };

  const getEventBadge = (eventType: string) => {
    switch (eventType) {
      case 'JOIN':
        return <Badge variant="outline" className="text-blue-600 gap-1"><LogIn className="h-3 w-3" /> Join</Badge>;
      case 'REJOIN':
        return <Badge variant="outline" className="text-blue-600 gap-1"><RefreshCw className="h-3 w-3" /> Rejoin</Badge>;
      case 'HEARTBEAT':
        return <Badge variant="outline" className="text-green-600 gap-1"><Activity className="h-3 w-3" /> Heartbeat</Badge>;
      case 'VIOLATION':
        return <Badge variant="outline" className="text-red-600 gap-1"><AlertTriangle className="h-3 w-3" /> Violation</Badge>;
      case 'SUBMIT':
        return <Badge variant="outline" className="text-purple-600 gap-1"><CheckCircle2 className="h-3 w-3" /> Submit</Badge>;
      case 'DISCONNECT':
        return <Badge variant="outline" className="text-red-600 gap-1"><XCircle className="h-3 w-3" /> Disconnect</Badge>;
      default:
        return <Badge variant="outline" className="gap-1">{eventType}</Badge>;
    }
  };

  const formatEventTime = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleTimeString();
    } catch {
      return isoString;
    }
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
            <DialogDescription className="flex items-center gap-2">
              Real-time monitoring via WebSocket
              {connected ? (
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20 gap-1">
                  <Wifi className="h-3 w-3" /> Connected
                </Badge>
              ) : (
                <Badge className="bg-red-500/10 text-red-600 border-red-500/20 gap-1">
                  <WifiOff className="h-3 w-3" /> Disconnected
                </Badge>
              )}
              {error && <span className="text-xs text-destructive">{error}</span>}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col gap-4">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <Card className="p-3">
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
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
              <Card className="p-3 bg-red-500/10">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{stats.disconnected}</p>
                  <p className="text-xs text-red-600">Disconnected</p>
                </div>
              </Card>
              <Card className="p-3 border-yellow-500/50">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">{stats.totalViolations}</p>
                  <p className="text-xs text-yellow-600">Violations</p>
                </div>
              </Card>
            </div>

            {/* Search */}
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-xs text-muted-foreground">
                  {connected ? 'Live' : 'Offline'}
                </span>
              </div>
            </div>

            {/* Sessions Table */}
            <Card className="flex-1 overflow-hidden">
              <ScrollArea className="h-[400px]">
                {filteredSessions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <Monitor className="h-12 w-12 mb-3 opacity-40" />
                    <p className="font-medium">
                      {connected ? 'Waiting for students to join...' : 'Connecting to exam session...'}
                    </p>
                    <p className="text-xs mt-1">
                      {connected
                        ? 'Student events will appear here in real time'
                        : 'Attempting to establish WebSocket connection'}
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Event</TableHead>
                        <TableHead className="text-center">Time Left</TableHead>
                        <TableHead className="text-center">Violations</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSessions.map((session) => (
                        <TableRow
                          key={session.studentId}
                          className={
                            session.violationCount >= 5
                              ? 'bg-red-500/5'
                              : session.status === 'DISCONNECTED'
                              ? 'bg-yellow-500/5'
                              : ''
                          }
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                  {session.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{session.studentName}</p>
                                <p className="text-xs text-muted-foreground">{session.studentId}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(session.status)}</TableCell>
                          <TableCell>{getEventBadge(session.lastEventType)}</TableCell>
                          <TableCell className="text-center">
                            <span className={`text-sm font-medium ${session.remainingTime > 0 && session.remainingTime < 600 ? 'text-red-600' : ''}`}>
                              {session.status === 'SUBMITTED' || session.status === 'AUTO_SUBMITTED'
                                ? '-'
                                : formatTime(session.remainingTime)}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            {session.violationCount > 0 ? (
                              <Badge
                                variant="outline"
                                className={session.violationCount >= 5 ? 'text-red-600 border-red-500' : 'text-yellow-600 border-yellow-500'}
                              >
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                {session.violationCount}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-green-600">
                                <Shield className="h-3 w-3 mr-1" /> 0
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="text-xs text-muted-foreground">
                              {formatEventTime(session.lastEventTime)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedSession(session);
                                setShowActivityLog(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" /> Log
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
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
                      {selectedSession.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span>{selectedSession.studentName}</span>
                    <p className="text-sm font-normal text-muted-foreground">{selectedSession.studentId}</p>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Event log — {selectedSession.eventLog.length} event(s) received
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="events" className="flex-1 overflow-hidden flex flex-col">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="events">Event Log</TabsTrigger>
                  <TabsTrigger value="details">Session Details</TabsTrigger>
                </TabsList>

                <TabsContent value="events" className="flex-1 overflow-hidden mt-4">
                  <ScrollArea className="h-[350px] pr-4">
                    <div className="space-y-2">
                      {selectedSession.eventLog.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>No events recorded yet</p>
                        </div>
                      ) : (
                        [...selectedSession.eventLog].reverse().map((event, index) => (
                          <div
                            key={index}
                            className={`flex gap-3 p-3 rounded-lg border ${
                              event.eventType === 'VIOLATION'
                                ? 'bg-red-500/5 border-red-500/30'
                                : event.eventType === 'DISCONNECT'
                                ? 'bg-yellow-500/5 border-yellow-500/30'
                                : 'bg-muted/50 border-border'
                            }`}
                          >
                            <div className="flex-shrink-0 mt-0.5">
                              {event.eventType === 'VIOLATION' ? (
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                              ) : event.eventType === 'DISCONNECT' ? (
                                <AlertCircle className="h-4 w-4 text-yellow-500" />
                              ) : (
                                <CheckCircle2 className="h-4 w-4 text-blue-500" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                {getEventBadge(event.eventType)}
                                <span className="text-xs text-muted-foreground">
                                  {formatEventTime(event.currentTime)}
                                </span>
                              </div>
                              <p className="text-sm">
                                Status: <span className="font-medium">{event.status}</span>
                                {event.violationType && (
                                  <span className="text-red-600"> — {event.violationType}</span>
                                )}
                              </p>
                              {event.message && (
                                <p className="text-xs text-muted-foreground mt-1">{event.message}</p>
                              )}
                              <p className="text-xs text-muted-foreground">
                                Violations: {event.violationCount} · Remaining: {formatTime(event.remainingTime)}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="details" className="mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Session Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Student ID</p>
                        <p className="font-medium font-mono">{selectedSession.studentId}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <div className="mt-1">{getStatusBadge(selectedSession.status)}</div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Remaining Time</p>
                        <p className="font-medium">{formatTime(selectedSession.remainingTime)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Violation Count</p>
                        <p className={`font-medium ${selectedSession.violationCount > 3 ? 'text-red-600' : ''}`}>
                          {selectedSession.violationCount}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Violation Type</p>
                        <p className="font-medium">{selectedSession.violationType || 'None'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Event</p>
                        <div className="mt-1">{getEventBadge(selectedSession.lastEventType)}</div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Updated</p>
                        <p className="font-medium">{formatEventTime(selectedSession.lastEventTime)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Events</p>
                        <p className="font-medium">{selectedSession.eventLog.length}</p>
                      </div>
                    </CardContent>
                  </Card>
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
