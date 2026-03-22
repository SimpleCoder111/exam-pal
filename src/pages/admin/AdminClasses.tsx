import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  GraduationCap, Plus, Search, MoreHorizontal, Edit, Trash2, Calendar, Clock, Users, UserPlus, Check, X,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { adminNavItems } from '@/config/adminNavItems';
import {
  useAdminClasses, useCreateClass, useDeleteClass, useUpdateClass,
  useAdminClassEnrollments, useAdminPendingEnrollments, useAdminUpdateEnrollment,
  useAdminEnrollStudent,
  AdminClassResponse,
} from '@/hooks/useAdminClasses';
import { useAdminSubjects } from '@/hooks/useAdminSubjects';
import { useAdminUsers, useAdminUsersByRole } from '@/hooks/useAdminUsers';

const statusColors: Record<string, string> = {
  ONGOING: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  COMPLETED: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  UPCOMING: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const AdminClasses = () => {
  const { data: classes = [], isLoading } = useAdminClasses();
  const { data: subjects = [] } = useAdminSubjects();
  const { data: users = [] } = useAdminUsers();
  const teachers = users.filter(u => u.role?.id === 2 || u.roleName?.toUpperCase() === 'TEACHER');
  const createClass = useCreateClass();
  const updateClass = useUpdateClass();
  const deleteClass = useDeleteClass();
  const updateEnrollment = useAdminUpdateEnrollment();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStudentsDialogOpen, setIsStudentsDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<AdminClassResponse | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    className: '',
    subjectId: 0,
    classStart: '',
    classEnd: '',
    classStatus: '',
    teacherId: '',
    academicYear: '2025-2026',
  });

  // Enrollment data
  const { data: enrolledStudents = [], isLoading: enrolledLoading } = useAdminClassEnrollments(
    isStudentsDialogOpen ? selectedClass?.classId ?? null : null
  );
  const { data: pendingRequests = [], isLoading: pendingLoading } = useAdminPendingEnrollments(
    isStudentsDialogOpen ? selectedClass?.classId ?? null : null
  );

  // Student search for "Add Student" (uses role ID 3 = student)
  const { data: allStudents = [] } = useAdminUsersByRole(isStudentsDialogOpen ? 3 : 0);
  const [studentSearch, setStudentSearch] = useState('');

  // Filter classes
  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cls.teacherName || cls.teacherId).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || cls.classStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: classes.length,
    ongoing: classes.filter(c => c.classStatus === 'ONGOING').length,
    completed: classes.filter(c => c.classStatus === 'COMPLETED').length,
    totalStudents: classes.reduce((sum, c) => sum + (c.studentCount || 0), 0),
  };

  const resetForm = () => {
    setFormData({ className: '', subjectId: 0, classStart: '', classEnd: '', classStatus: '', teacherId: '', academicYear: '2025-2026' });
  };

  const handleCreate = () => {
    if (!formData.className || !formData.subjectId) {
      toast.error('Please fill in class name and select a subject.');
      return;
    }
    createClass.mutate({
      className: formData.className,
      subjectId: formData.subjectId,
      classStart: formData.classStart,
      classEnd: formData.classEnd,
      classStatus: formData.classStatus,
      teacherId: formData.teacherId,
      academicYear: formData.academicYear,
    }, {
      onSuccess: () => {
        toast.success('Class created successfully.');
        setIsCreateDialogOpen(false);
        resetForm();
      },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleEdit = () => {
    if (!selectedClass) return;
    updateClass.mutate({
      classId: selectedClass.classId,
      className: formData.className,
      subjectId: formData.subjectId,
      classStart: formData.classStart,
      classEnd: formData.classEnd,
      classStatus: formData.classStatus,
      teacherId: formData.teacherId,
      academicYear: formData.academicYear,
    }, {
      onSuccess: () => {
        toast.success('Class updated successfully.');
        setIsEditDialogOpen(false);
        setSelectedClass(null);
        resetForm();
      },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleDelete = () => {
    if (!selectedClass) return;
    deleteClass.mutate(selectedClass.classId, {
      onSuccess: () => {
        toast.success('Class deleted successfully.');
        setIsDeleteDialogOpen(false);
        setSelectedClass(null);
      },
      onError: (err) => toast.error(err.message),
    });
  };

  const openEditDialog = (cls: AdminClassResponse) => {
    setSelectedClass(cls);
    const prefix = cls.className.split(' - ')[0] || cls.className;
    setFormData({
      className: prefix,
      subjectId: 0,
      classStart: cls.classStart?.split('T')[0] || '',
      classEnd: cls.classEnd?.split('T')[0] || '',
      classStatus: cls.classStatus || '',
      teacherId: cls.teacherId || '',
      academicYear: cls.classYear || '2025-2026',
    });
    setIsEditDialogOpen(true);
  };

  const openStudentsDialog = (cls: AdminClassResponse) => {
    setSelectedClass(cls);
    setStudentSearch('');
    setIsStudentsDialogOpen(true);
  };

  const handleEnrollmentAction = (classEnrolledId: number, isApproved: boolean) => {
    updateEnrollment.mutate({ classEnrolledId, isApproved }, {
      onSuccess: () => {
        toast.success(isApproved ? 'Student approved!' : 'Request rejected.');
      },
      onError: (err) => toast.error(err.message),
    });
  };

  // Filter available students (not already enrolled)
  const enrolledUserIds = new Set(enrolledStudents.map(s => s.userId));
  const availableStudents = (Array.isArray(allStudents) ? allStudents : [])
    .filter(s => s.status === 'ACTIVE' && !enrolledUserIds.has(s.userId))
    .filter(s => {
      if (!studentSearch) return true;
      const term = studentSearch.toLowerCase();
      return s.name.toLowerCase().includes(term) || s.userId.toLowerCase().includes(term);
    });

  return (
    <DashboardLayout navItems={adminNavItems} role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
            <p className="text-muted-foreground">Manage classes and student enrollments</p>
          </div>
          <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Class
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{stats.total}</div>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ongoing</CardTitle>
              <Clock className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold text-green-600">{stats.ongoing}</div>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{stats.completed}</div>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{stats.totalStudents}</div>}
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search classes or teacher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ONGOING">Ongoing</SelectItem>
                  <SelectItem value="UPCOMING">Upcoming</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Classes Table */}
        <Card>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class Name</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClasses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No classes found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredClasses.map((cls) => (
                      <TableRow key={cls.classId}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{cls.className}</p>
                            <p className="text-sm text-muted-foreground">ID: {cls.classId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{cls.teacherName || '—'}</p>
                            <p className="text-sm text-muted-foreground">{cls.teacherId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{cls.classStart ? format(new Date(cls.classStart), 'MMM d, yyyy') : '—'}</p>
                            <p className="text-muted-foreground">to {cls.classEnd ? format(new Date(cls.classEnd), 'MMM d, yyyy') : '—'}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1"
                            onClick={() => openStudentsDialog(cls)}
                          >
                            <Users className="h-3.5 w-3.5" />
                            {cls.studentCount ?? 0} students
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[cls.classStatus] || ''}>
                            {cls.classStatus || '—'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openStudentsDialog(cls)}>
                                <Users className="mr-2 h-4 w-4" />
                                Manage Students
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditDialog(cls)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => { setSelectedClass(cls); setIsDeleteDialogOpen(true); }}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Dialog */}
        <Dialog open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
          if (!open) { setIsCreateDialogOpen(false); setIsEditDialogOpen(false); setSelectedClass(null); resetForm(); }
        }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{isEditDialogOpen ? 'Edit Class' : 'Create New Class'}</DialogTitle>
              <DialogDescription>
                {isEditDialogOpen ? 'Update class details' : 'Add a new class to the system'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Class Name</Label>
                  <Input
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    placeholder="e.g., 9A, 10B, 12C"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Subject</Label>
                  <Select
                    value={formData.subjectId ? formData.subjectId.toString() : ''}
                    onValueChange={(v) => setFormData({ ...formData, subjectId: parseInt(v) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.filter(s => s.active).map((s) => (
                        <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Teacher</Label>
                <Select
                  value={formData.teacherId}
                  onValueChange={(v) => setFormData({ ...formData, teacherId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((t) => (
                      <SelectItem key={t.userId} value={t.userId}>
                        {t.name} ({t.userId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Start Date</Label>
                  <Input type="date" value={formData.classStart} onChange={(e) => setFormData({ ...formData, classStart: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>End Date</Label>
                  <Input type="date" value={formData.classEnd} onChange={(e) => setFormData({ ...formData, classEnd: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Academic Year</Label>
                  <Select value={formData.academicYear} onValueChange={(v) => setFormData({ ...formData, academicYear: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024-2025">2024-2025</SelectItem>
                      <SelectItem value="2025-2026">2025-2026</SelectItem>
                      <SelectItem value="2026-2027">2026-2027</SelectItem>
                      <SelectItem value="2027-2028">2027-2028</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select value={formData.classStatus} onValueChange={(v) => setFormData({ ...formData, classStatus: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UPCOMING">Upcoming</SelectItem>
                      <SelectItem value="ONGOING">Ongoing</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsCreateDialogOpen(false); setIsEditDialogOpen(false); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={isEditDialogOpen ? handleEdit : handleCreate} disabled={createClass.isPending || updateClass.isPending}>
                {(createClass.isPending || updateClass.isPending) ? 'Saving...' : isEditDialogOpen ? 'Save Changes' : 'Create Class'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Class</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedClass?.className}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete} disabled={deleteClass.isPending}>
                {deleteClass.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Student Management Dialog */}
        <Dialog open={isStudentsDialogOpen} onOpenChange={(open) => {
          if (!open) { setIsStudentsDialogOpen(false); setSelectedClass(null); setStudentSearch(''); }
        }}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {selectedClass?.className}
              </DialogTitle>
              <DialogDescription>Manage enrolled students and pending requests</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="enrolled" className="flex-1 overflow-hidden flex flex-col">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="enrolled" className="gap-1">
                  Enrolled
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">{enrolledStudents.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="pending" className="gap-1">
                  Pending
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">{pendingRequests.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="add">
                  <UserPlus className="h-3.5 w-3.5 mr-1" />
                  All Students
                </TabsTrigger>
              </TabsList>

              {/* Enrolled Students Tab */}
              <TabsContent value="enrolled" className="flex-1 overflow-auto mt-4">
                {enrolledLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
                  </div>
                ) : enrolledStudents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-10 w-10 mx-auto mb-2 opacity-40" />
                    <p>No enrolled students yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {enrolledStudents.map((student) => (
                      <div key={student.userId} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={student.displayProfileImageUrl?.startsWith('/uploads') ? `http://localhost:7000${student.displayProfileImageUrl}` : undefined} />
                          <AvatarFallback className="text-xs">{student.name?.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.userId} • {student.email}</p>
                        </div>
                        <Badge variant={student.status === 'ACTIVE' ? 'default' : 'secondary'} className="text-xs">
                          {student.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Pending Requests Tab */}
              <TabsContent value="pending" className="flex-1 overflow-auto mt-4">
                {pendingLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
                  </div>
                ) : pendingRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-10 w-10 mx-auto mb-2 opacity-40" />
                    <p>No pending requests</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {pendingRequests.map((req) => (
                      <div key={req.classEnrolledId} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="text-xs">{req.studentName?.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{req.studentName}</p>
                          <p className="text-xs text-muted-foreground">
                            {req.studentEmail} • Requested {req.requestAt ? format(new Date(req.requestAt), 'MMM d, yyyy') : '—'}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleEnrollmentAction(req.classEnrolledId, true)}
                            disabled={updateEnrollment.isPending}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                            onClick={() => handleEnrollmentAction(req.classEnrolledId, false)}
                            disabled={updateEnrollment.isPending}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* All Students Tab */}
              <TabsContent value="add" className="flex-1 overflow-hidden flex flex-col mt-4">
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search students by name or ID..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex-1 overflow-auto space-y-2">
                  {availableStudents.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">No available students found</p>
                    </div>
                  ) : (
                    availableStudents.slice(0, 50).map((student) => (
                      <div key={student.userId} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={student.displayProfileImageUrl?.startsWith('/uploads') ? `http://localhost:7000${student.displayProfileImageUrl}` : undefined} />
                          <AvatarFallback className="text-xs">{student.name?.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.userId} • {student.email}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">{student.gender === 'M' ? 'Male' : 'Female'}</Badge>
                        <Button
                          size="sm"
                          variant="default"
                          className="h-7 text-xs"
                          onClick={() => {
                            if (!studentDialogClassId) return;
                            enrollStudent.mutate(
                              { studentId: student.userId, classId: studentDialogClassId },
                              {
                                onSuccess: () => toast.success(`${student.name} enrolled successfully`),
                                onError: (err) => toast.error(err.message || 'Failed to enroll student'),
                              }
                            );
                          }}
                          disabled={enrollStudent.isPending}
                        >
                          <UserPlus className="h-3 w-3 mr-1" />
                          Enroll
                        </Button>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminClasses;
