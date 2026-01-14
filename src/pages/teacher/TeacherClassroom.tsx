import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { teacherNavItems } from '@/config/teacherNavItems';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  QrCode, 
  Link2, 
  Copy, 
  Check, 
  X, 
  UserPlus,
  Clock,
  TrendingUp,
  Award,
  History,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for current classes
const MOCK_CURRENT_CLASSES = [
  {
    classId: 1,
    className: 'Grade 9th Math Class A',
    classYear: '2025-2026',
    classStatus: 'ONGOING',
    inviteCode: 'MATH9A-2025',
    studentCount: 32,
    avgProgress: 75,
    avgScore: 82,
  },
  {
    classId: 2,
    className: 'Grade 10th Math Class B',
    classYear: '2025-2026',
    classStatus: 'ONGOING',
    inviteCode: 'MATH10B-2025',
    studentCount: 28,
    avgProgress: 68,
    avgScore: 78,
  },
];

// Mock data for previous classes
const MOCK_PREVIOUS_CLASSES = [
  {
    classId: 101,
    className: 'Grade 8th Math Class A',
    classYear: '2024-2025',
    classStatus: 'COMPLETED',
    studentCount: 30,
    avgScore: 85,
    topPerformer: 'Alice Chen',
  },
  {
    classId: 102,
    className: 'Grade 9th Math Class C',
    classYear: '2024-2025',
    classStatus: 'COMPLETED',
    studentCount: 35,
    avgScore: 79,
    topPerformer: 'Bob Wilson',
  },
];

// Mock enrolled students
const MOCK_STUDENTS = [
  { id: 'S001', name: 'Alice Chen', email: 'alice@student.com', progress: 92, avgScore: 95, status: 'active', joinedAt: '2025-01-10' },
  { id: 'S002', name: 'Bob Wilson', email: 'bob@student.com', progress: 78, avgScore: 82, status: 'active', joinedAt: '2025-01-10' },
  { id: 'S003', name: 'Carol Davis', email: 'carol@student.com', progress: 85, avgScore: 88, status: 'active', joinedAt: '2025-01-11' },
  { id: 'S004', name: 'David Lee', email: 'david@student.com', progress: 65, avgScore: 70, status: 'active', joinedAt: '2025-01-12' },
  { id: 'S005', name: 'Emma Brown', email: 'emma@student.com', progress: 88, avgScore: 90, status: 'active', joinedAt: '2025-01-12' },
];

// Mock join requests
const MOCK_REQUESTS = [
  { id: 'R001', studentName: 'Frank Miller', email: 'frank@student.com', requestedAt: '2025-01-14T10:30:00', status: 'pending' },
  { id: 'R002', studentName: 'Grace Kim', email: 'grace@student.com', requestedAt: '2025-01-14T09:15:00', status: 'pending' },
  { id: 'R003', studentName: 'Henry Zhang', email: 'henry@student.com', requestedAt: '2025-01-13T16:45:00', status: 'pending' },
];

const TeacherClassroom = () => {
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState(MOCK_CURRENT_CLASSES[0]);
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [copied, setCopied] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [showAddStudentDialog, setShowAddStudentDialog] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', studentId: '' });
  const [activeTab, setActiveTab] = useState('current');

  const inviteLink = `https://examflow.app/join/${selectedClass.inviteCode}`;

  const copyInviteCode = () => {
    navigator.clipboard.writeText(selectedClass.inviteCode);
    setCopied(true);
    toast({ title: 'Copied!', description: 'Invite code copied to clipboard' });
    setTimeout(() => setCopied(false), 2000);
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast({ title: 'Copied!', description: 'Invite link copied to clipboard' });
  };

  const regenerateCode = () => {
    toast({ title: 'Code Regenerated', description: 'New invite code has been generated' });
    // TODO: API call to regenerate code
  };

  const handleApproveRequest = (requestId: string) => {
    setRequests(requests.filter(r => r.id !== requestId));
    toast({ title: 'Approved', description: 'Student has been added to the class' });
    // TODO: API call to approve
  };

  const handleRejectRequest = (requestId: string) => {
    setRequests(requests.filter(r => r.id !== requestId));
    toast({ title: 'Rejected', description: 'Request has been rejected' });
    // TODO: API call to reject
  };

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.email) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    
    const student = {
      id: newStudent.studentId || `S${Date.now()}`,
      name: newStudent.name,
      email: newStudent.email,
      progress: 0,
      avgScore: 0,
      status: 'active' as const,
      joinedAt: new Date().toISOString().split('T')[0],
    };
    
    setStudents([...students, student]);
    setNewStudent({ name: '', email: '', studentId: '' });
    setShowAddStudentDialog(false);
    toast({ title: 'Student Added', description: `${student.name} has been added to the class` });
    // TODO: API call to add student
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (score >= 80) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
    if (score >= 70) return <Badge className="bg-yellow-100 text-yellow-800">Average</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>;
  };

  return (
    <DashboardLayout navItems={teacherNavItems} role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Classroom</h1>
            <p className="text-muted-foreground">
              Manage students, view progress, and share invite codes
            </p>
          </div>
          
          <div className="flex gap-2">
            <Dialog open={showAddStudentDialog} onOpenChange={setShowAddStudentDialog}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Student to Class</DialogTitle>
                  <DialogDescription>
                    Manually add a student to {selectedClass.className}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentName">Student Name *</Label>
                    <Input
                      id="studentName"
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                      placeholder="Enter student name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studentEmail">Email *</Label>
                    <Input
                      id="studentEmail"
                      type="email"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                      placeholder="Enter student email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studentId">Student ID (Optional)</Label>
                    <Input
                      id="studentId"
                      value={newStudent.studentId}
                      onChange={(e) => setNewStudent({ ...newStudent, studentId: e.target.value })}
                      placeholder="Enter student ID"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddStudentDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddStudent}>Add Student</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Class Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="current" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Current Classes
            </TabsTrigger>
            <TabsTrigger value="previous" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Previous Classes
            </TabsTrigger>
          </TabsList>

          {/* Current Classes Tab */}
          <TabsContent value="current" className="space-y-6">
            {/* Class Selector */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle>Select Class</CardTitle>
                    <CardDescription>Choose a class to manage</CardDescription>
                  </div>
                  <Select
                    value={selectedClass.classId.toString()}
                    onValueChange={(value) => {
                      const cls = MOCK_CURRENT_CLASSES.find(c => c.classId.toString() === value);
                      if (cls) setSelectedClass(cls);
                    }}
                  >
                    <SelectTrigger className="w-full md:w-[300px]">
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_CURRENT_CLASSES.map((cls) => (
                        <SelectItem key={cls.classId} value={cls.classId.toString()}>
                          {cls.className} ({cls.classYear})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
            </Card>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{students.length}</div>
                  <p className="text-xs text-muted-foreground">Enrolled in class</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Progress</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{selectedClass.avgProgress}%</div>
                  <Progress value={selectedClass.avgProgress} className="mt-2" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{selectedClass.avgScore}%</div>
                  <p className="text-xs text-muted-foreground">Class average</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{requests.length}</div>
                  <p className="text-xs text-muted-foreground">Awaiting approval</p>
                </CardContent>
              </Card>
            </div>

            {/* Invite Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="h-5 w-5" />
                  Invite Students
                </CardTitle>
                <CardDescription>
                  Share the invite code or QR code with students to join this class
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4 md:flex-row md:items-end">
                  <div className="flex-1 space-y-2">
                    <Label>Invite Code</Label>
                    <div className="flex gap-2">
                      <Input value={selectedClass.inviteCode} readOnly className="font-mono text-lg" />
                      <Button variant="outline" size="icon" onClick={copyInviteCode}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="icon" onClick={regenerateCode}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>Invite Link</Label>
                    <div className="flex gap-2">
                      <Input value={inviteLink} readOnly className="text-sm" />
                      <Button variant="outline" size="icon" onClick={copyInviteLink}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <QrCode className="h-4 w-4" />
                        Show QR Code
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Classroom QR Code</DialogTitle>
                        <DialogDescription>
                          Students can scan this QR code to request joining {selectedClass.className}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col items-center justify-center py-6">
                        {/* Placeholder QR Code - In production, use a QR library */}
                        <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                          <div className="text-center">
                            <QrCode className="h-16 w-16 mx-auto text-muted-foreground" />
                            <p className="text-sm text-muted-foreground mt-2">QR Code</p>
                            <p className="text-xs font-mono mt-1">{selectedClass.inviteCode}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">
                          Code: <span className="font-mono font-bold">{selectedClass.inviteCode}</span>
                        </p>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowQRDialog(false)}>
                          Close
                        </Button>
                        <Button onClick={() => {
                          toast({ title: 'Downloaded', description: 'QR code image saved' });
                        }}>
                          Download QR
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Join Requests */}
            {requests.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Pending Join Requests
                    <Badge variant="secondary">{requests.length}</Badge>
                  </CardTitle>
                  <CardDescription>
                    Students waiting for approval to join your class
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Requested At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.studentName}</TableCell>
                          <TableCell>{request.email}</TableCell>
                          <TableCell>
                            {new Date(request.requestedAt).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleApproveRequest(request.id)}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleRejectRequest(request.id)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* Enrolled Students */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Enrolled Students
                </CardTitle>
                <CardDescription>
                  Students currently enrolled in {selectedClass.className}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Avg. Score</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-mono text-sm">{student.id}</TableCell>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={student.progress} className="w-16" />
                            <span className="text-sm">{student.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{student.avgScore}%</TableCell>
                        <TableCell>{getScoreBadge(student.avgScore)}</TableCell>
                        <TableCell>{student.joinedAt}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Previous Classes Tab */}
          <TabsContent value="previous" className="space-y-6">
            {MOCK_PREVIOUS_CLASSES.length > 0 ? (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  {MOCK_PREVIOUS_CLASSES.map((cls) => (
                    <Card key={cls.classId}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{cls.className}</CardTitle>
                          <Badge variant="secondary">{cls.classYear}</Badge>
                        </div>
                        <CardDescription>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            {cls.classStatus}
                          </Badge>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Total Students</p>
                              <p className="text-2xl font-bold">{cls.studentCount}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Average Score</p>
                              <p className="text-2xl font-bold">{cls.avgScore}%</p>
                            </div>
                          </div>
                          <div className="pt-2 border-t">
                            <p className="text-sm text-muted-foreground">Top Performer</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Award className="h-4 w-4 text-yellow-500" />
                              <span className="font-medium">{cls.topPerformer}</span>
                            </div>
                          </div>
                          <Button variant="outline" className="w-full mt-2">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Performance Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle>Year-over-Year Performance</CardTitle>
                    <CardDescription>
                      Compare your class performance across academic years
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">2024-2025 Average</p>
                          <p className="text-sm text-muted-foreground">Across all classes</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">82%</p>
                          <p className="text-sm text-green-600">+5% from 2023-2024</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">2025-2026 Current</p>
                          <p className="text-sm text-muted-foreground">In progress</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">80%</p>
                          <p className="text-sm text-muted-foreground">On track</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <History className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Previous Classes</h3>
                  <p className="text-muted-foreground text-center mt-2">
                    You don't have any previous teaching records yet.<br />
                    Your class history will appear here after completing a class.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TeacherClassroom;
