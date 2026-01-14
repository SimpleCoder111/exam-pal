import { useState } from 'react';
import { Users, Plus, Search, MoreHorizontal, Pencil, UserX, UserCheck, Mail, Shield, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import { adminNavItems } from '@/config/adminNavItems';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
  department?: string;
  inviteCode?: string;
}

// Mock data - TODO: Replace with API call to fetch users
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@school.edu',
    role: 'teacher',
    status: 'active',
    createdAt: '2024-01-15',
    lastLogin: '2024-01-20',
    department: 'Mathematics',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@school.edu',
    role: 'teacher',
    status: 'active',
    createdAt: '2024-01-10',
    lastLogin: '2024-01-19',
    department: 'Science',
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike.w@school.edu',
    role: 'student',
    status: 'active',
    createdAt: '2024-01-12',
    lastLogin: '2024-01-20',
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.d@school.edu',
    role: 'student',
    status: 'active',
    createdAt: '2024-01-08',
    lastLogin: '2024-01-18',
  },
  {
    id: '5',
    name: 'James Brown',
    email: 'james.b@school.edu',
    role: 'student',
    status: 'inactive',
    createdAt: '2023-12-01',
    lastLogin: '2024-01-05',
  },
  {
    id: '6',
    name: 'Lisa Anderson',
    email: 'lisa.a@school.edu',
    role: 'teacher',
    status: 'inactive',
    createdAt: '2023-11-15',
    lastLogin: '2023-12-20',
    department: 'English',
  },
];

const AdminUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student' as 'teacher' | 'student',
    department: '',
  });

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Stats
  const totalTeachers = users.filter(u => u.role === 'teacher').length;
  const totalStudents = users.filter(u => u.role === 'student').length;
  const activeUsers = users.filter(u => u.status === 'active').length;

  const handleCreateUser = () => {
    // TODO: API call to create user
    // const response = await fetch('/api/users', {
    //   method: 'POST',
    //   body: JSON.stringify(formData),
    // });
    
    const newUser: User = {
      id: String(Date.now()),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      department: formData.role === 'teacher' ? formData.department : undefined,
      inviteCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
    };
    
    setUsers([...users, newUser]);
    setIsCreateDialogOpen(false);
    resetForm();
    
    toast({
      title: 'User Created',
      description: `${newUser.name} has been added successfully. Invite code: ${newUser.inviteCode}`,
    });
  };

  const handleEditUser = () => {
    if (!selectedUser) return;
    
    // TODO: API call to update user
    // const response = await fetch(`/api/users/${selectedUser.id}`, {
    //   method: 'PUT',
    //   body: JSON.stringify(formData),
    // });
    
    setUsers(users.map(user => 
      user.id === selectedUser.id 
        ? { 
            ...user, 
            name: formData.name, 
            email: formData.email, 
            role: formData.role,
            department: formData.role === 'teacher' ? formData.department : undefined,
          } 
        : user
    ));
    
    setIsEditDialogOpen(false);
    setSelectedUser(null);
    resetForm();
    
    toast({
      title: 'User Updated',
      description: 'User information has been updated successfully.',
    });
  };

  const handleToggleStatus = (user: User) => {
    // TODO: API call to toggle user status
    // const response = await fetch(`/api/users/${user.id}/status`, {
    //   method: 'PATCH',
    //   body: JSON.stringify({ status: user.status === 'active' ? 'inactive' : 'active' }),
    // });
    
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    setUsers(users.map(u => 
      u.id === user.id ? { ...u, status: newStatus } : u
    ));
    
    toast({
      title: newStatus === 'active' ? 'User Activated' : 'User Deactivated',
      description: `${user.name} has been ${newStatus === 'active' ? 'activated' : 'deactivated'}.`,
    });
  };

  const handleSendInvite = (user: User) => {
    // TODO: API call to send invite email
    // const response = await fetch(`/api/users/${user.id}/invite`, {
    //   method: 'POST',
    // });
    
    toast({
      title: 'Invite Sent',
      description: `An invitation email has been sent to ${user.email}.`,
    });
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || '',
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'student',
      department: '',
    });
  };

  const generateInviteCode = () => {
    // TODO: API call to generate invite code
    // const response = await fetch('/api/invite-codes', { method: 'POST' });
    
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    navigator.clipboard.writeText(code);
    
    toast({
      title: 'Invite Code Generated',
      description: `Code: ${code} has been copied to clipboard.`,
    });
  };

  return (
    <DashboardLayout navItems={adminNavItems} role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">Manage teachers and students in your organization</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={generateInviteCode}>
              <Shield className="mr-2 h-4 w-4" />
              Generate Invite Code
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTeachers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                {((activeUsers / users.length) * 100).toFixed(0)}% of total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>A list of all users in your organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-center mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="teacher">Teachers</SelectItem>
                  <SelectItem value="student">Students</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="w-[70px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'teacher' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.department || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'active' ? 'default' : 'outline'} 
                                 className={user.status === 'active' ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20' : ''}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.createdAt}</TableCell>
                        <TableCell>{user.lastLogin || '-'}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(user)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSendInvite(user)}>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Invite
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                                {user.status === 'active' ? (
                                  <>
                                    <UserX className="mr-2 h-4 w-4" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    Activate
                                  </>
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new teacher or student to your organization.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value: 'teacher' | 'student') => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.role === 'teacher' && (
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    placeholder="Enter department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateUser} disabled={!formData.name || !formData.email}>
                Create User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value: 'teacher' | 'student') => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.role === 'teacher' && (
                <div className="space-y-2">
                  <Label htmlFor="edit-department">Department</Label>
                  <Input
                    id="edit-department"
                    placeholder="Enter department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditUser} disabled={!formData.name || !formData.email}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;
