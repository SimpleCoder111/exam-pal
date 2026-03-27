import { useState } from 'react';
import { API_BASE_URL } from '@/lib/api';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Users,
  QrCode,
  Link2,
  Copy,
  Check,
  X,
  Clock,
  History,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  useTeacherClasses,
  useClassQR,
  usePendingRequests,
  useClassEnrollments,
  useUpdateEnrollment,
  type TeacherClass,
} from '@/hooks/useTeacherClassrooms';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'ONGOING':
      return <Badge className="bg-primary/10 text-primary border-primary/20">Ongoing</Badge>;
    case 'COMPLETED':
      return <Badge variant="secondary">Completed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const TeacherClassroom = () => {
  const { toast } = useToast();
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('current');

  // API hooks
  const { data: classes = [], isLoading: classesLoading } = useTeacherClasses();
  const selectedClass: TeacherClass | undefined = classes.find(c => c.classId === selectedClassId) ?? classes[0];
  const effectiveClassId = selectedClass?.classId ?? null;

  const { data: qrData, isLoading: qrLoading } = useClassQR(showQRDialog ? effectiveClassId : null);
  const { data: pendingRequests = [], isLoading: requestsLoading } = usePendingRequests(effectiveClassId);
  const { data: enrolledStudents = [], isLoading: enrollmentsLoading } = useClassEnrollments(effectiveClassId);
  const updateEnrollment = useUpdateEnrollment();

  // Derived data
  const ongoingClasses = classes.filter(c => c.classStatus === 'ONGOING');
  const completedClasses = classes.filter(c => c.classStatus === 'COMPLETED');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: `${label} copied to clipboard` });
  };

  const copyInviteLink = () => {
    if (qrData?.joinUrl) {
      copyToClipboard(qrData.joinUrl, 'Invite link');
    }
  };

  const copyInviteToken = () => {
    if (qrData?.token) {
      copyToClipboard(qrData.token, 'Invite code');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApproveRequest = (classEnrolledId: number) => {
    updateEnrollment.mutate(
      { classEnrolledId, isApproved: true },
      {
        onSuccess: () => toast({ title: 'Approved', description: 'Student has been added to the class' }),
        onError: () => toast({ title: 'Error', description: 'Failed to approve request', variant: 'destructive' }),
      }
    );
  };

  const handleRejectRequest = (classEnrolledId: number) => {
    updateEnrollment.mutate(
      { classEnrolledId, isApproved: false },
      {
        onSuccess: () => toast({ title: 'Rejected', description: 'Request has been rejected' }),
        onError: () => toast({ title: 'Error', description: 'Failed to reject request', variant: 'destructive' }),
      }
    );
  };

  if (classesLoading) {
    return (
      <DashboardLayout navItems={teacherNavItems} role="teacher">
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96" />
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={teacherNavItems} role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Classroom</h1>
          <p className="text-muted-foreground">
            Manage students, view progress, and share invite codes
          </p>
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
            {ongoingClasses.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Current Classes</h3>
                  <p className="text-muted-foreground text-center mt-2">
                    You don't have any ongoing classes at the moment.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Class Selector */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle>Select Class</CardTitle>
                        <CardDescription>Choose a class to manage</CardDescription>
                      </div>
                      <Select
                        value={effectiveClassId?.toString() ?? ''}
                        onValueChange={(value) => setSelectedClassId(Number(value))}
                      >
                        <SelectTrigger className="w-full md:w-[300px]">
                          <SelectValue placeholder="Select a class" />
                        </SelectTrigger>
                        <SelectContent>
                          {ongoingClasses.map((cls) => (
                            <SelectItem key={cls.classId} value={cls.classId.toString()}>
                              {cls.className}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                </Card>

                {selectedClass && (
                  <>
                    {/* Stats Cards */}
                    <div className="grid gap-4 md:grid-cols-3">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Enrolled Students</CardTitle>
                          <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{enrollmentsLoading ? '—' : enrolledStudents.length}</div>
                          <p className="text-xs text-muted-foreground">Approved in class</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Class Period</CardTitle>
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm font-semibold">{selectedClass.classStart?.split('T')[0]} — {selectedClass.classEnd?.split('T')[0]}</div>
                          <p className="text-xs text-muted-foreground mt-1">{getStatusBadge(selectedClass.classStatus)}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{requestsLoading ? '—' : pendingRequests.length}</div>
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
                              <Input value={selectedClass.classToken ?? '—'} readOnly className="font-mono text-lg" />
                              <Button variant="outline" size="icon" onClick={copyInviteToken} disabled={!selectedClass.classToken}>
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
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
                                {qrLoading ? (
                                  <div className="w-48 h-48 flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                  </div>
                                ) : qrData?.qrBase64 ? (
                                  <img src={qrData.qrBase64} alt="QR Code" className="w-48 h-48 rounded-lg" />
                                ) : (
                                  <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                                    <QrCode className="h-16 w-16 text-muted-foreground" />
                                  </div>
                                )}
                                {qrData?.token && (
                                  <p className="text-sm text-muted-foreground mt-4">
                                    Code: <span className="font-mono font-bold">{qrData.token}</span>
                                  </p>
                                )}
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setShowQRDialog(false)}>
                                  Close
                                </Button>
                                {qrData?.qrBase64 && (
                                  <Button onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = qrData.qrBase64;
                                    link.download = `qr-${selectedClass.className}.png`;
                                    link.click();
                                    toast({ title: 'Downloaded', description: 'QR code image saved' });
                                  }}>
                                    Download QR
                                  </Button>
                                )}
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Join Requests */}
                    {!requestsLoading && pendingRequests.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Pending Join Requests
                            <Badge variant="secondary">{pendingRequests.length}</Badge>
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
                              {pendingRequests.map((request) => (
                                <TableRow key={request.classEnrolledId}>
                                  <TableCell className="font-medium">{request.studentName}</TableCell>
                                  <TableCell>{request.studentEmail}</TableCell>
                                  <TableCell>{request.requestAt}</TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-primary hover:bg-primary/10"
                                        onClick={() => handleApproveRequest(request.classEnrolledId)}
                                        disabled={updateEnrollment.isPending}
                                      >
                                        <Check className="h-4 w-4 mr-1" />
                                        Approve
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-destructive hover:bg-destructive/10"
                                        onClick={() => handleRejectRequest(request.classEnrolledId)}
                                        disabled={updateEnrollment.isPending}
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
                          {!enrollmentsLoading && <Badge variant="secondary">{enrolledStudents.length}</Badge>}
                        </CardTitle>
                        <CardDescription>
                          Students currently enrolled in this class
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {enrollmentsLoading ? (
                          <div className="space-y-3">
                            {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                          </div>
                        ) : enrolledStudents.length === 0 ? (
                          <p className="text-muted-foreground text-sm text-center py-8">No students enrolled yet.</p>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Student ID</TableHead>
                                <TableHead>Gender</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {enrolledStudents.map((student) => (
                                <TableRow key={student.id}>
                                  <TableCell>
                                    <div className="flex items-center gap-3">
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage
                                          src={student.profileImageUrl ? `${API_BASE_URL}${student.profileImageUrl}` : undefined}
                                          alt={student.name}
                                        />
                                        <AvatarFallback className="text-xs">
                                          {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="font-medium">{student.name}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="font-mono text-sm">{student.userId}</TableCell>
                                  <TableCell>{student.gender === 'M' ? 'Male' : student.gender === 'F' ? 'Female' : student.gender}</TableCell>
                                  <TableCell>{student.email}</TableCell>
                                  <TableCell>{student.phoneNumber}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </CardContent>
                    </Card>
                  </>
                )}
              </>
            )}
          </TabsContent>

          {/* Previous Classes Tab */}
          <TabsContent value="previous" className="space-y-6">
            {completedClasses.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {completedClasses.map((cls) => (
                  <Card key={cls.classId}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{cls.className}</CardTitle>
                        {getStatusBadge(cls.classStatus)}
                      </div>
                      <CardDescription>
                        {cls.classStart?.split('T')[0]} — {cls.classEnd?.split('T')[0]}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Academic Year</p>
                          <p className="text-sm font-medium">{cls.academicYear ?? '—'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <p className="text-sm font-medium">{cls.classStatus}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <History className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Previous Classes</h3>
                  <p className="text-muted-foreground text-center mt-2">
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
