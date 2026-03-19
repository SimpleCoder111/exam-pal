import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { teacherNavItems } from '@/config/teacherNavItems';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Search,
  Users,
  Mail,
  Phone,
  Calendar,
  Eye,
  GraduationCap,
  MapPin,
} from 'lucide-react';
import { useTeacherStudents, type TeacherStudent } from '@/hooks/useTeacherStudents';
import { format } from 'date-fns';

const TeacherStudentsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<TeacherStudent | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { data: students = [], isLoading, isError } = useTeacherStudents();

  const filteredStudents = students.filter((student) => {
    const q = searchQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(q) ||
      student.email.toLowerCase().includes(q) ||
      student.userId.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Active</Badge>;
      case 'INACTIVE':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getGenderLabel = (g: string) => (g === 'M' ? 'Male' : g === 'F' ? 'Female' : g);

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').slice(0, 2);

  const openProfile = (student: TeacherStudent) => {
    setSelectedStudent(student);
    setIsProfileOpen(true);
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM dd, yyyy');
    } catch {
      return dateStr;
    }
  };

  return (
    <DashboardLayout navItems={teacherNavItems} role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Students</h1>
          <p className="text-muted-foreground mt-1">View students enrolled in your classes</p>
        </div>

        {/* Metric Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-3xl font-bold">{isLoading ? '—' : students.length}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or student ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
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
              {isLoading
                ? 'Loading students...'
                : `Showing ${filteredStudents.length} of ${students.length} students`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">Failed to load students</h3>
                <p className="text-muted-foreground">Please check your connection and try again.</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow
                        key={student.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => openProfile(student)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage
                                src={
                                  student.profileImageUrl
                                    ? `http://localhost:7000${student.profileImageUrl}`
                                    : undefined
                                }
                              />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {getInitials(student.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-sm text-muted-foreground">{student.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{student.userId}</TableCell>
                        <TableCell>{getGenderLabel(student.gender)}</TableCell>
                        <TableCell>{student.phoneNumber}</TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(student.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              openProfile(student);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredStudents.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No students found</h3>
                    <p className="text-muted-foreground">Try adjusting your search criteria</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Student Profile Dialog */}
        <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <DialogContent className="max-w-lg">
            {selectedStudent && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={
                          selectedStudent.profileImageUrl
                            ? `http://localhost:7000${selectedStudent.profileImageUrl}`
                            : undefined
                        }
                      />
                      <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                        {getInitials(selectedStudent.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span>{selectedStudent.name}</span>
                        {getStatusBadge(selectedStudent.status)}
                      </div>
                      <DialogDescription className="text-left font-mono">
                        {selectedStudent.userId}
                      </DialogDescription>
                    </div>
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-4">
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
                      <p className="font-medium">{selectedStudent.phoneNumber}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date of Birth</p>
                      <p className="font-medium">{formatDate(selectedStudent.dateOfBirth)}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Gender</p>
                      <p className="font-medium">{getGenderLabel(selectedStudent.gender)}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">{selectedStudent.address}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Joined</p>
                      <p className="font-medium">{formatDate(selectedStudent.createdAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <Button variant="outline" onClick={() => setIsProfileOpen(false)}>
                    Close
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

export default TeacherStudentsPage;
