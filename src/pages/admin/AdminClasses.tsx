import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  GraduationCap,
  Users,
  BookOpen,
  Settings,
  Home,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  UserPlus,
  Calendar,
  Clock,
  UserCheck,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

// Types
interface Class {
  classId: number;
  className: string;
  classStart: string;
  classEnd: string;
  classStatus: 'ONGOING' | 'COMPLETED' | 'UPCOMING' | 'CANCELLED';
  classYear: string;
  teacherId: string;
}

interface ClassroomEnrollment {
  id: number;
  userId: string;
  classId: number;
}

interface Student {
  id: string;
  name: string;
  email: string;
}

interface Teacher {
  id: string;
  name: string;
}

// Mock data based on user's format
// TODO: Replace with API call to fetch classes
const mockClasses: Class[] = [
  {
    classEnd: "2026-04-07T00:00:00",
    classId: 2,
    className: "Grade 9th Math Class A",
    classStart: "2026-01-07T00:00:00",
    classStatus: "ONGOING",
    classYear: "2025-2026",
    teacherId: "T2026A0001"
  },
  {
    classEnd: "2026-04-07T00:00:00",
    classId: 3,
    className: "Grade 9th Math Class B",
    classStart: "2026-01-07T00:00:00",
    classStatus: "ONGOING",
    classYear: "2025-2026",
    teacherId: "T2026A0002"
  },
  {
    classEnd: "2026-04-07T00:00:00",
    classId: 4,
    className: "Grade 9th Math Class C",
    classStart: "2026-01-07T00:00:00",
    classStatus: "ONGOING",
    classYear: "2025-2026",
    teacherId: "T2026A0003"
  },
  {
    classEnd: "2026-04-07T00:00:00",
    classId: 5,
    className: "Grade 9th Chinese Class A",
    classStart: "2026-01-07T00:00:00",
    classStatus: "ONGOING",
    classYear: "2025-2026",
    teacherId: "T2026A0004"
  },
  {
    classEnd: "2026-04-07T00:00:00",
    classId: 6,
    className: "Grade 9th Chinese Class B",
    classStart: "2026-01-07T00:00:00",
    classStatus: "ONGOING",
    classYear: "2025-2026",
    teacherId: "T2026A0005"
  },
  {
    classEnd: "2025-12-15T00:00:00",
    classId: 7,
    className: "Grade 8th Science Class A",
    classStart: "2025-09-01T00:00:00",
    classStatus: "COMPLETED",
    classYear: "2025-2026",
    teacherId: "T2026A0006"
  },
];

// TODO: Replace with API call to fetch teachers
const mockTeachers: Teacher[] = [
  { id: "T2026A0001", name: "John Smith" },
  { id: "T2026A0002", name: "Jane Doe" },
  { id: "T2026A0003", name: "Robert Johnson" },
  { id: "T2026A0004", name: "Emily Chen" },
  { id: "T2026A0005", name: "Michael Brown" },
  { id: "T2026A0006", name: "Sarah Wilson" },
];

// TODO: Replace with API call to fetch students
const mockStudents: Student[] = [
  { id: "S2026A0001", name: "Alice Wang", email: "alice@school.edu" },
  { id: "S2026A0002", name: "Bob Lee", email: "bob@school.edu" },
  { id: "S2026A0003", name: "Carol Zhang", email: "carol@school.edu" },
  { id: "S2026A0004", name: "David Liu", email: "david@school.edu" },
  { id: "S2026A0005", name: "Eva Chen", email: "eva@school.edu" },
  { id: "S2026A0006", name: "Frank Wu", email: "frank@school.edu" },
  { id: "S2026A0007", name: "Grace Kim", email: "grace@school.edu" },
  { id: "S2026A0008", name: "Henry Park", email: "henry@school.edu" },
];

// TODO: Replace with API call to fetch enrollments
const mockEnrollments: ClassroomEnrollment[] = [
  { id: 1, userId: "S2026A0001", classId: 2 },
  { id: 2, userId: "S2026A0002", classId: 2 },
  { id: 3, userId: "S2026A0003", classId: 2 },
  { id: 4, userId: "S2026A0004", classId: 3 },
  { id: 5, userId: "S2026A0005", classId: 3 },
  { id: 6, userId: "S2026A0006", classId: 4 },
  { id: 7, userId: "S2026A0007", classId: 5 },
  { id: 8, userId: "S2026A0008", classId: 6 },
];

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: Home },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Subjects', href: '/admin/subjects', icon: BookOpen },
  { label: 'Classes', href: '/admin/classes', icon: GraduationCap },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

const statusColors: Record<Class['classStatus'], string> = {
  ONGOING: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  COMPLETED: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  UPCOMING: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const AdminClasses = () => {
  const { toast } = useToast();
  const [classes, setClasses] = useState<Class[]>(mockClasses);
  const [enrollments, setEnrollments] = useState<ClassroomEnrollment[]>(mockEnrollments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    className: '',
    classStart: '',
    classEnd: '',
    classStatus: 'UPCOMING' as Class['classStatus'],
    classYear: '2025-2026',
    teacherId: '',
  });
  
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  // Get unique years for filter
  const uniqueYears = [...new Set(classes.map(c => c.classYear))];

  // Filter classes
  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.teacherId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || cls.classStatus === statusFilter;
    const matchesYear = yearFilter === 'all' || cls.classYear === yearFilter;
    return matchesSearch && matchesStatus && matchesYear;
  });

  // Get teacher name by ID
  const getTeacherName = (teacherId: string) => {
    const teacher = mockTeachers.find(t => t.id === teacherId);
    return teacher?.name || teacherId;
  };

  // Get enrolled students count for a class
  const getEnrolledCount = (classId: number) => {
    return enrollments.filter(e => e.classId === classId).length;
  };

  // Get enrolled student IDs for a class
  const getEnrolledStudentIds = (classId: number) => {
    return enrollments.filter(e => e.classId === classId).map(e => e.userId);
  };

  // Stats
  const stats = {
    total: classes.length,
    ongoing: classes.filter(c => c.classStatus === 'ONGOING').length,
    completed: classes.filter(c => c.classStatus === 'COMPLETED').length,
    totalEnrollments: enrollments.length,
  };

  const resetForm = () => {
    setFormData({
      className: '',
      classStart: '',
      classEnd: '',
      classStatus: 'UPCOMING',
      classYear: '2025-2026',
      teacherId: '',
    });
  };

  const handleCreate = () => {
    // TODO: API call to create class
    const newClass: Class = {
      classId: Math.max(...classes.map(c => c.classId)) + 1,
      className: formData.className,
      classStart: new Date(formData.classStart).toISOString(),
      classEnd: new Date(formData.classEnd).toISOString(),
      classStatus: formData.classStatus,
      classYear: formData.classYear,
      teacherId: formData.teacherId,
    };
    
    setClasses([...classes, newClass]);
    setIsCreateDialogOpen(false);
    resetForm();
    
    toast({
      title: "Class Created",
      description: `${newClass.className} has been created successfully.`,
    });
  };

  const handleEdit = () => {
    if (!selectedClass) return;
    
    // TODO: API call to update class
    const updatedClasses = classes.map(cls =>
      cls.classId === selectedClass.classId
        ? {
            ...cls,
            className: formData.className,
            classStart: new Date(formData.classStart).toISOString(),
            classEnd: new Date(formData.classEnd).toISOString(),
            classStatus: formData.classStatus,
            classYear: formData.classYear,
            teacherId: formData.teacherId,
          }
        : cls
    );
    
    setClasses(updatedClasses);
    setIsEditDialogOpen(false);
    setSelectedClass(null);
    resetForm();
    
    toast({
      title: "Class Updated",
      description: "Class details have been updated successfully.",
    });
  };

  const handleDelete = () => {
    if (!selectedClass) return;
    
    // TODO: API call to delete class
    setClasses(classes.filter(c => c.classId !== selectedClass.classId));
    // Also remove enrollments for this class
    setEnrollments(enrollments.filter(e => e.classId !== selectedClass.classId));
    setIsDeleteDialogOpen(false);
    setSelectedClass(null);
    
    toast({
      title: "Class Deleted",
      description: "The class has been deleted successfully.",
    });
  };

  const handleEnrollStudents = () => {
    if (!selectedClass) return;
    
    // TODO: API call to update enrollments
    // Remove existing enrollments for this class
    const otherEnrollments = enrollments.filter(e => e.classId !== selectedClass.classId);
    
    // Add new enrollments
    const newEnrollments: ClassroomEnrollment[] = selectedStudents.map((studentId, index) => ({
      id: Math.max(...enrollments.map(e => e.id), 0) + index + 1,
      userId: studentId,
      classId: selectedClass.classId,
    }));
    
    setEnrollments([...otherEnrollments, ...newEnrollments]);
    setIsEnrollDialogOpen(false);
    setSelectedClass(null);
    setSelectedStudents([]);
    
    toast({
      title: "Enrollment Updated",
      description: `${newEnrollments.length} students enrolled in the class.`,
    });
  };

  const openEditDialog = (cls: Class) => {
    setSelectedClass(cls);
    setFormData({
      className: cls.className,
      classStart: cls.classStart.split('T')[0],
      classEnd: cls.classEnd.split('T')[0],
      classStatus: cls.classStatus,
      classYear: cls.classYear,
      teacherId: cls.teacherId,
    });
    setIsEditDialogOpen(true);
  };

  const openEnrollDialog = (cls: Class) => {
    setSelectedClass(cls);
    setSelectedStudents(getEnrolledStudentIds(cls.classId));
    setIsEnrollDialogOpen(true);
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  return (
    <DashboardLayout navItems={navItems} role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
            <p className="text-muted-foreground">
              Manage classes and student enrollments
            </p>
          </div>
          <Button onClick={() => {
            resetForm();
            setIsCreateDialogOpen(true);
          }}>
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
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ongoing</CardTitle>
              <Clock className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.ongoing}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEnrollments}</div>
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
                  placeholder="Search classes or teacher ID..."
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
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {uniqueYears.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Classes Table */}
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClasses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
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
                          <p className="font-medium">{getTeacherName(cls.teacherId)}</p>
                          <p className="text-sm text-muted-foreground">{cls.teacherId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{format(new Date(cls.classStart), 'MMM d, yyyy')}</p>
                          <p className="text-muted-foreground">to {format(new Date(cls.classEnd), 'MMM d, yyyy')}</p>
                        </div>
                      </TableCell>
                      <TableCell>{cls.classYear}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getEnrolledCount(cls.classId)} students
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[cls.classStatus]}>
                          {cls.classStatus}
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
                            <DropdownMenuItem onClick={() => openEditDialog(cls)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEnrollDialog(cls)}>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Manage Students
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedClass(cls);
                                setIsDeleteDialogOpen(true);
                              }}
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
          </CardContent>
        </Card>

        {/* Create/Edit Dialog */}
        <Dialog open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setIsEditDialogOpen(false);
            setSelectedClass(null);
            resetForm();
          }
        }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{isEditDialogOpen ? 'Edit Class' : 'Create New Class'}</DialogTitle>
              <DialogDescription>
                {isEditDialogOpen ? 'Update class details' : 'Add a new class to the system'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="className">Class Name</Label>
                <Input
                  id="className"
                  value={formData.className}
                  onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                  placeholder="e.g., Grade 9th Math Class A"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="teacherId">Teacher</Label>
                <Select
                  value={formData.teacherId}
                  onValueChange={(value) => setFormData({ ...formData, teacherId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTeachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name} ({teacher.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="classStart">Start Date</Label>
                  <Input
                    id="classStart"
                    type="date"
                    value={formData.classStart}
                    onChange={(e) => setFormData({ ...formData, classStart: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="classEnd">End Date</Label>
                  <Input
                    id="classEnd"
                    type="date"
                    value={formData.classEnd}
                    onChange={(e) => setFormData({ ...formData, classEnd: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="classYear">Academic Year</Label>
                  <Input
                    id="classYear"
                    value={formData.classYear}
                    onChange={(e) => setFormData({ ...formData, classYear: e.target.value })}
                    placeholder="e.g., 2025-2026"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="classStatus">Status</Label>
                  <Select
                    value={formData.classStatus}
                    onValueChange={(value: Class['classStatus']) => setFormData({ ...formData, classStatus: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
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
              <Button variant="outline" onClick={() => {
                setIsCreateDialogOpen(false);
                setIsEditDialogOpen(false);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button onClick={isEditDialogOpen ? handleEdit : handleCreate}>
                {isEditDialogOpen ? 'Save Changes' : 'Create Class'}
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
                Are you sure you want to delete "{selectedClass?.className}"? This will also remove all student enrollments for this class. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Enroll Students Dialog */}
        <Dialog open={isEnrollDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setIsEnrollDialogOpen(false);
            setSelectedClass(null);
            setSelectedStudents([]);
          }
        }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Manage Student Enrollment</DialogTitle>
              <DialogDescription>
                Select students to enroll in {selectedClass?.className}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <ScrollArea className="h-[300px] rounded-md border p-4">
                <div className="space-y-4">
                  {mockStudents.map((student) => (
                    <div key={student.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={student.id}
                        checked={selectedStudents.includes(student.id)}
                        onCheckedChange={() => toggleStudentSelection(student.id)}
                      />
                      <label
                        htmlFor={student.id}
                        className="flex-1 cursor-pointer text-sm"
                      >
                        <p className="font-medium">{student.name}</p>
                        <p className="text-muted-foreground">{student.email}</p>
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <p className="mt-2 text-sm text-muted-foreground">
                {selectedStudents.length} student(s) selected
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsEnrollDialogOpen(false);
                setSelectedStudents([]);
              }}>
                Cancel
              </Button>
              <Button onClick={handleEnrollStudents}>
                Save Enrollment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminClasses;
