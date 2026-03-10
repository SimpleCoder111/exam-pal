import { useState } from 'react';
import { Users, Plus, Search, MoreHorizontal, Pencil, UserX, UserCheck, GraduationCap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { adminNavItems } from '@/config/adminNavItems';
import { toast } from 'sonner';
import {
  useAdminUsers,
  useCreateUser,
  useUpdateUser,
  useToggleUserStatus,
  getRoleId,
  type AdminUserResponse,
} from '@/hooks/useAdminUsers';

const AdminUsers = () => {
  const { data: users = [], isLoading } = useAdminUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const toggleStatus = useToggleUserStatus();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUserResponse | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'STUDENT',
    password: '',
    dob: '',
    gender: 'M',
    phoneNumber: '',
    address: '',
  });

  // Filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.roleName === roleFilter.toUpperCase();
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter.toUpperCase();
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Stats
  const totalTeachers = users.filter(u => u.roleName === 'TEACHER').length;
  const totalStudents = users.filter(u => u.roleName === 'STUDENT').length;
  const activeUsers = users.filter(u => u.status === 'ACTIVE').length;

  const handleCreateUser = () => {
    createUser.mutate(
      {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        password: formData.password,
        userId: '',
        dob: formData.dob,
        gender: formData.gender,
        roleId: getRoleId(formData.role),
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        status: true,
      },
      {
        onSuccess: (data) => {
          setIsCreateDialogOpen(false);
          resetForm();
          toast.success(`User ${data.name} created successfully (ID: ${data.userId})`);
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const handleEditUser = () => {
    if (!selectedUser) return;
    updateUser.mutate(
      {
        targetUserId: selectedUser.userId,
        userId: selectedUser.userId,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        password: formData.password || '***',
        dob: formData.dob,
        gender: formData.gender,
        roleId: getRoleId(formData.role),
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        status: selectedUser.status === 'ACTIVE',
      },
      {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          setSelectedUser(null);
          resetForm();
          toast.success('User updated successfully');
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const handleToggleStatus = (user: AdminUserResponse) => {
    const newStatus = user.status !== 'ACTIVE';
    toggleStatus.mutate(
      { userId: user.userId, status: newStatus },
      {
        onSuccess: () => toast.success(`${user.name} has been ${newStatus ? 'activated' : 'deactivated'}`),
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const openEditDialog = (user: AdminUserResponse) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.roleName,
      password: '',
      dob: user.dateOfBirth || '',
      gender: user.gender || 'M',
      phoneNumber: user.phoneNumber || '',
      address: user.address || '',
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', role: 'STUDENT', password: '', dob: '', gender: 'M', phoneNumber: '', address: '' });
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  const UserFormFields = () => (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Full Name</Label>
          <Input placeholder="Enter full name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" placeholder="Enter email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Role</Label>
          <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="TEACHER">Teacher</SelectItem>
              <SelectItem value="STUDENT">Student</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Gender</Label>
          <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="M">Male</SelectItem>
              <SelectItem value="F">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Password</Label>
          <Input type="password" placeholder="Enter password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Date of Birth</Label>
          <Input type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Phone Number</Label>
          <Input placeholder="Enter phone number" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Address</Label>
          <Input placeholder="Enter address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout navItems={adminNavItems} role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">Manage admins, teachers and students in your organization</p>
          </div>
          <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{totalTeachers}</div>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{totalStudents}</div>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-16" /> : (
                <>
                  <div className="text-2xl font-bold">{activeUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    {users.length > 0 ? ((activeUsers / users.length) * 100).toFixed(0) : 0}% of total
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>A list of all users in your organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-center mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by name, ID, or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8" />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[150px]"><SelectValue placeholder="Role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="TEACHER">Teacher</SelectItem>
                  <SelectItem value="STUDENT">Student</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[70px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 8 }).map((_, j) => (
                          <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No users found</TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-mono text-sm">{user.userId || '—'}</TableCell>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.roleName === 'ADMIN' ? 'destructive' : user.roleName === 'TEACHER' ? 'default' : 'secondary'}>
                            {user.roleName}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.gender === 'M' ? 'Male' : 'Female'}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'ACTIVE' ? 'default' : 'outline'}
                            className={user.status === 'ACTIVE' ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20' : ''}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(user)}>
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                                {user.status === 'ACTIVE' ? (
                                  <><UserX className="mr-2 h-4 w-4" /> Deactivate</>
                                ) : (
                                  <><UserCheck className="mr-2 h-4 w-4" /> Activate</>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Create User Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>Add a new user to your organization.</DialogDescription>
            </DialogHeader>
            <UserFormFields />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateUser} disabled={!formData.name || !formData.email || !formData.password || createUser.isPending}>
                {createUser.isPending ? 'Creating...' : 'Create User'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user information. Leave password blank to keep unchanged.</DialogDescription>
            </DialogHeader>
            <UserFormFields />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleEditUser} disabled={!formData.name || !formData.email || updateUser.isPending}>
                {updateUser.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;
