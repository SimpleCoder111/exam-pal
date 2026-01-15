import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { adminNavItems } from '@/config/adminNavItems';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Bell,
  Plus,
  Send,
  Megaphone,
  Users,
  GraduationCap,
  Mail,
  MessageSquare,
  Clock,
  Calendar,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  MoreHorizontal,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Settings,
  Zap,
  FileText,
  AlertTriangle,
  Target,
  RefreshCw,
  Copy,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock announcements data
const mockAnnouncements = [
  {
    id: 'A001',
    title: 'System Maintenance Scheduled',
    message: 'The exam system will undergo maintenance on January 20th from 2:00 AM to 4:00 AM. Please plan accordingly.',
    audience: 'all',
    priority: 'high',
    status: 'active',
    createdAt: '2025-01-14T10:00:00',
    expiresAt: '2025-01-20T04:00:00',
    views: 245,
  },
  {
    id: 'A002',
    title: 'New Exam Guidelines Released',
    message: 'Updated exam conduct guidelines are now available. All teachers and students must review before the next exam period.',
    audience: 'all',
    priority: 'medium',
    status: 'active',
    createdAt: '2025-01-12T14:30:00',
    expiresAt: '2025-02-01T00:00:00',
    views: 189,
  },
  {
    id: 'A003',
    title: 'Quarter 1 Results Published',
    message: 'Q1 examination results are now available. Students can check their results through the student portal.',
    audience: 'students',
    priority: 'low',
    status: 'expired',
    createdAt: '2025-01-05T09:00:00',
    expiresAt: '2025-01-10T00:00:00',
    views: 412,
  },
  {
    id: 'A004',
    title: 'Teacher Training Workshop',
    message: 'Mandatory training session for exam monitoring tools. All teachers must attend on January 25th at 3 PM.',
    audience: 'teachers',
    priority: 'high',
    status: 'scheduled',
    createdAt: '2025-01-14T08:00:00',
    expiresAt: '2025-01-25T17:00:00',
    views: 0,
    scheduledFor: '2025-01-18T09:00:00',
  },
];

// Mock notification rules
const mockNotificationRules = [
  {
    id: 'R001',
    name: 'Exam Reminder',
    description: 'Send reminder 24 hours before scheduled exam',
    trigger: 'exam_scheduled',
    action: 'email',
    audience: 'students',
    enabled: true,
    lastTriggered: '2025-01-14T08:00:00',
    triggerCount: 156,
  },
  {
    id: 'R002',
    name: 'Security Alert',
    description: 'Notify admin when student exceeds violation threshold',
    trigger: 'security_violation',
    action: 'push',
    audience: 'admins',
    enabled: true,
    lastTriggered: '2025-01-14T10:30:00',
    triggerCount: 23,
  },
  {
    id: 'R003',
    name: 'Results Published',
    description: 'Notify students when exam results are available',
    trigger: 'results_published',
    action: 'email',
    audience: 'students',
    enabled: true,
    lastTriggered: '2025-01-10T14:00:00',
    triggerCount: 89,
  },
  {
    id: 'R004',
    name: 'Low Pass Rate Alert',
    description: 'Alert teachers when exam pass rate drops below 60%',
    trigger: 'low_pass_rate',
    action: 'email',
    audience: 'teachers',
    enabled: false,
    lastTriggered: null,
    triggerCount: 0,
  },
  {
    id: 'R005',
    name: 'Weekly Report',
    description: 'Send weekly performance summary to admins',
    trigger: 'weekly_schedule',
    action: 'email',
    audience: 'admins',
    enabled: true,
    lastTriggered: '2025-01-13T00:00:00',
    triggerCount: 12,
  },
];

// Mock sent messages
const mockSentMessages = [
  {
    id: 'M001',
    subject: 'Important: Exam Schedule Update',
    message: 'Dear Students, please note the updated exam schedule for Mathematics...',
    recipients: 'Grade 10 Students',
    recipientCount: 120,
    sentAt: '2025-01-14T11:00:00',
    deliveredCount: 118,
    openedCount: 95,
    channel: 'email',
  },
  {
    id: 'M002',
    subject: 'Reminder: Submit Exam Papers',
    message: 'Teachers, please ensure all exam papers are submitted by Friday...',
    recipients: 'All Teachers',
    recipientCount: 24,
    sentAt: '2025-01-13T09:00:00',
    deliveredCount: 24,
    openedCount: 22,
    channel: 'email',
  },
  {
    id: 'M003',
    subject: 'Congratulations!',
    message: 'You have successfully completed the certification exam...',
    recipients: 'Certification Candidates',
    recipientCount: 45,
    sentAt: '2025-01-12T16:00:00',
    deliveredCount: 45,
    openedCount: 42,
    channel: 'push',
  },
];

interface AnnouncementForm {
  title: string;
  message: string;
  audience: string;
  priority: string;
  expiresAt: string;
  scheduleFor: string;
}

interface MessageForm {
  subject: string;
  message: string;
  recipientType: string;
  recipientFilter: string;
  channel: string;
}

interface RuleForm {
  name: string;
  description: string;
  trigger: string;
  action: string;
  audience: string;
  enabled: boolean;
}

const AdminNotifications = () => {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [notificationRules, setNotificationRules] = useState(mockNotificationRules);
  const [sentMessages] = useState(mockSentMessages);
  
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showRuleDialog, setShowRuleDialog] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<string | null>(null);
  const [editingRule, setEditingRule] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [announcementForm, setAnnouncementForm] = useState<AnnouncementForm>({
    title: '',
    message: '',
    audience: 'all',
    priority: 'medium',
    expiresAt: '',
    scheduleFor: '',
  });

  const [messageForm, setMessageForm] = useState<MessageForm>({
    subject: '',
    message: '',
    recipientType: 'all',
    recipientFilter: '',
    channel: 'email',
  });

  const [ruleForm, setRuleForm] = useState<RuleForm>({
    name: '',
    description: '',
    trigger: 'exam_scheduled',
    action: 'email',
    audience: 'students',
    enabled: true,
  });

  const filteredAnnouncements = announcements.filter(a => {
    if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    return true;
  });

  const handleCreateAnnouncement = () => {
    const newAnnouncement = {
      id: `A${Date.now()}`,
      ...announcementForm,
      status: announcementForm.scheduleFor ? 'scheduled' : 'active',
      createdAt: new Date().toISOString(),
      views: 0,
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    setShowAnnouncementDialog(false);
    resetAnnouncementForm();
    toast({
      title: 'Announcement Created',
      description: announcementForm.scheduleFor ? 'Announcement scheduled successfully' : 'Announcement published successfully',
    });
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
    toast({ title: 'Announcement Deleted' });
  };

  const handleSendMessage = () => {
    toast({
      title: 'Message Sent',
      description: `Message sent to ${messageForm.recipientType === 'all' ? 'all users' : messageForm.recipientType}`,
    });
    setShowMessageDialog(false);
    resetMessageForm();
  };

  const handleCreateRule = () => {
    const newRule = {
      id: `R${Date.now()}`,
      ...ruleForm,
      lastTriggered: null,
      triggerCount: 0,
    };
    setNotificationRules([...notificationRules, newRule]);
    setShowRuleDialog(false);
    resetRuleForm();
    toast({ title: 'Notification Rule Created' });
  };

  const handleToggleRule = (id: string) => {
    setNotificationRules(rules => 
      rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r)
    );
  };

  const handleDeleteRule = (id: string) => {
    setNotificationRules(rules => rules.filter(r => r.id !== id));
    toast({ title: 'Rule Deleted' });
  };

  const resetAnnouncementForm = () => {
    setAnnouncementForm({
      title: '',
      message: '',
      audience: 'all',
      priority: 'medium',
      expiresAt: '',
      scheduleFor: '',
    });
    setEditingAnnouncement(null);
  };

  const resetMessageForm = () => {
    setMessageForm({
      subject: '',
      message: '',
      recipientType: 'all',
      recipientFilter: '',
      channel: 'email',
    });
  };

  const resetRuleForm = () => {
    setRuleForm({
      name: '',
      description: '',
      trigger: 'exam_scheduled',
      action: 'email',
      audience: 'students',
      enabled: true,
    });
    setEditingRule(null);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Active</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Scheduled</Badge>;
      case 'expired':
        return <Badge variant="outline">Expired</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getAudienceBadge = (audience: string) => {
    switch (audience) {
      case 'all':
        return <Badge variant="outline"><Users className="h-3 w-3 mr-1" />All</Badge>;
      case 'teachers':
        return <Badge variant="outline"><GraduationCap className="h-3 w-3 mr-1" />Teachers</Badge>;
      case 'students':
        return <Badge variant="outline"><Users className="h-3 w-3 mr-1" />Students</Badge>;
      case 'admins':
        return <Badge variant="outline"><Settings className="h-3 w-3 mr-1" />Admins</Badge>;
      default:
        return <Badge variant="outline">{audience}</Badge>;
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'email':
        return <Badge variant="outline"><Mail className="h-3 w-3 mr-1" />Email</Badge>;
      case 'push':
        return <Badge variant="outline"><Bell className="h-3 w-3 mr-1" />Push</Badge>;
      case 'sms':
        return <Badge variant="outline"><MessageSquare className="h-3 w-3 mr-1" />SMS</Badge>;
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  // Stats
  const stats = {
    activeAnnouncements: announcements.filter(a => a.status === 'active').length,
    scheduledAnnouncements: announcements.filter(a => a.status === 'scheduled').length,
    activeRules: notificationRules.filter(r => r.enabled).length,
    totalSent: sentMessages.reduce((sum, m) => sum + m.recipientCount, 0),
  };

  return (
    <DashboardLayout navItems={adminNavItems} role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Bell className="h-8 w-8 text-primary" />
              Notifications
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage announcements, messages, and notification rules
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowMessageDialog(true)}>
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </Button>
            <Button onClick={() => setShowAnnouncementDialog(true)}>
              <Megaphone className="mr-2 h-4 w-4" />
              New Announcement
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Announcements</CardTitle>
              <Megaphone className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeAnnouncements}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.scheduledAnnouncements}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
              <Zap className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeRules}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSent.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="announcements" className="space-y-4">
          <TabsList>
            <TabsTrigger value="announcements" className="gap-2">
              <Megaphone className="h-4 w-4" />
              Announcements
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-2">
              <Mail className="h-4 w-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="rules" className="gap-2">
              <Zap className="h-4 w-4" />
              Automation Rules
            </TabsTrigger>
          </TabsList>

          {/* Announcements Tab */}
          <TabsContent value="announcements" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>System Announcements</CardTitle>
                    <CardDescription>Manage public announcements for teachers and students</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search announcements..."
                        className="pl-9 w-[200px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Audience</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAnnouncements.map(announcement => (
                      <TableRow key={announcement.id}>
                        <TableCell>
                          <div className="max-w-[250px]">
                            <p className="font-medium truncate">{announcement.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{announcement.message}</p>
                          </div>
                        </TableCell>
                        <TableCell>{getAudienceBadge(announcement.audience)}</TableCell>
                        <TableCell>{getPriorityBadge(announcement.priority)}</TableCell>
                        <TableCell>{getStatusBadge(announcement.status)}</TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {announcement.views}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(announcement.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDeleteAnnouncement(announcement.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Sent Messages</CardTitle>
                    <CardDescription>History of direct messages sent to users</CardDescription>
                  </div>
                  <Button onClick={() => setShowMessageDialog(true)}>
                    <Send className="mr-2 h-4 w-4" />
                    Compose Message
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Delivered</TableHead>
                      <TableHead>Opened</TableHead>
                      <TableHead>Sent At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sentMessages.map(message => (
                      <TableRow key={message.id}>
                        <TableCell>
                          <div className="max-w-[250px]">
                            <p className="font-medium truncate">{message.subject}</p>
                            <p className="text-xs text-muted-foreground truncate">{message.message}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{message.recipients}</p>
                            <p className="text-xs text-muted-foreground">{message.recipientCount} recipients</p>
                          </div>
                        </TableCell>
                        <TableCell>{getActionBadge(message.channel)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span>{message.deliveredCount}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4 text-blue-600" />
                            <span>{message.openedCount}</span>
                            <span className="text-muted-foreground text-xs">
                              ({Math.round((message.openedCount / message.deliveredCount) * 100)}%)
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(message.sentAt).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Automation Rules Tab */}
          <TabsContent value="rules" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Automation Rules</CardTitle>
                    <CardDescription>Configure automatic notifications based on events</CardDescription>
                  </div>
                  <Button onClick={() => setShowRuleDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Rule
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notificationRules.map(rule => (
                    <Card key={rule.id} className={!rule.enabled ? 'opacity-60' : ''}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className={`p-2 rounded-lg ${rule.enabled ? 'bg-primary/10' : 'bg-muted'}`}>
                              <Zap className={`h-5 w-5 ${rule.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">{rule.name}</h4>
                                {!rule.enabled && <Badge variant="secondary">Disabled</Badge>}
                              </div>
                              <p className="text-sm text-muted-foreground">{rule.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  Trigger: {rule.trigger.replace('_', ' ')}
                                </Badge>
                                {getActionBadge(rule.action)}
                                {getAudienceBadge(rule.audience)}
                              </div>
                              {rule.lastTriggered && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  Last triggered: {new Date(rule.lastTriggered).toLocaleString()} • 
                                  Total: {rule.triggerCount} times
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={rule.enabled}
                              onCheckedChange={() => handleToggleRule(rule.id)}
                            />
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Rule
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Test Rule
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => handleDeleteRule(rule.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Announcement Dialog */}
        <Dialog open={showAnnouncementDialog} onOpenChange={(open) => {
          setShowAnnouncementDialog(open);
          if (!open) resetAnnouncementForm();
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Announcement</DialogTitle>
              <DialogDescription>
                Create a new system announcement for teachers and students
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={announcementForm.title}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                  placeholder="Announcement title"
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={announcementForm.message}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
                  placeholder="Announcement message..."
                  rows={4}
                  maxLength={1000}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Audience</Label>
                  <Select 
                    value={announcementForm.audience} 
                    onValueChange={(v) => setAnnouncementForm({ ...announcementForm, audience: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="teachers">Teachers Only</SelectItem>
                      <SelectItem value="students">Students Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select 
                    value={announcementForm.priority} 
                    onValueChange={(v) => setAnnouncementForm({ ...announcementForm, priority: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="expiresAt">Expires At</Label>
                  <Input
                    id="expiresAt"
                    type="datetime-local"
                    value={announcementForm.expiresAt}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, expiresAt: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduleFor">Schedule For (Optional)</Label>
                  <Input
                    id="scheduleFor"
                    type="datetime-local"
                    value={announcementForm.scheduleFor}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, scheduleFor: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAnnouncementDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAnnouncement} disabled={!announcementForm.title || !announcementForm.message}>
                {announcementForm.scheduleFor ? 'Schedule' : 'Publish'} Announcement
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Send Message Dialog */}
        <Dialog open={showMessageDialog} onOpenChange={(open) => {
          setShowMessageDialog(open);
          if (!open) resetMessageForm();
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Send Message</DialogTitle>
              <DialogDescription>
                Send a direct message to teachers or students
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Recipients</Label>
                  <Select 
                    value={messageForm.recipientType} 
                    onValueChange={(v) => setMessageForm({ ...messageForm, recipientType: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="teachers">All Teachers</SelectItem>
                      <SelectItem value="students">All Students</SelectItem>
                      <SelectItem value="class">Specific Class</SelectItem>
                      <SelectItem value="subject">By Subject</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Channel</Label>
                  <Select 
                    value={messageForm.channel} 
                    onValueChange={(v) => setMessageForm({ ...messageForm, channel: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="push">Push Notification</SelectItem>
                      <SelectItem value="both">Email + Push</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {(messageForm.recipientType === 'class' || messageForm.recipientType === 'subject') && (
                <div className="space-y-2">
                  <Label>Filter</Label>
                  <Input
                    placeholder={messageForm.recipientType === 'class' ? 'Select class...' : 'Select subject...'}
                    value={messageForm.recipientFilter}
                    onChange={(e) => setMessageForm({ ...messageForm, recipientFilter: e.target.value })}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={messageForm.subject}
                  onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })}
                  placeholder="Message subject"
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="messageContent">Message</Label>
                <Textarea
                  id="messageContent"
                  value={messageForm.message}
                  onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                  placeholder="Type your message..."
                  rows={6}
                  maxLength={2000}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendMessage} disabled={!messageForm.subject || !messageForm.message}>
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Rule Dialog */}
        <Dialog open={showRuleDialog} onOpenChange={(open) => {
          setShowRuleDialog(open);
          if (!open) resetRuleForm();
        }}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Notification Rule</DialogTitle>
              <DialogDescription>
                Set up automatic notifications based on system events
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="ruleName">Rule Name</Label>
                <Input
                  id="ruleName"
                  value={ruleForm.name}
                  onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })}
                  placeholder="e.g., Exam Reminder"
                  maxLength={50}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ruleDescription">Description</Label>
                <Textarea
                  id="ruleDescription"
                  value={ruleForm.description}
                  onChange={(e) => setRuleForm({ ...ruleForm, description: e.target.value })}
                  placeholder="What does this rule do?"
                  rows={2}
                  maxLength={200}
                />
              </div>
              <div className="space-y-2">
                <Label>Trigger Event</Label>
                <Select 
                  value={ruleForm.trigger} 
                  onValueChange={(v) => setRuleForm({ ...ruleForm, trigger: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exam_scheduled">Exam Scheduled</SelectItem>
                    <SelectItem value="exam_started">Exam Started</SelectItem>
                    <SelectItem value="exam_completed">Exam Completed</SelectItem>
                    <SelectItem value="results_published">Results Published</SelectItem>
                    <SelectItem value="security_violation">Security Violation</SelectItem>
                    <SelectItem value="low_pass_rate">Low Pass Rate</SelectItem>
                    <SelectItem value="daily_schedule">Daily (Scheduled)</SelectItem>
                    <SelectItem value="weekly_schedule">Weekly (Scheduled)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Notification Type</Label>
                  <Select 
                    value={ruleForm.action} 
                    onValueChange={(v) => setRuleForm({ ...ruleForm, action: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="push">Push Notification</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Send To</Label>
                  <Select 
                    value={ruleForm.audience} 
                    onValueChange={(v) => setRuleForm({ ...ruleForm, audience: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="students">Students</SelectItem>
                      <SelectItem value="teachers">Teachers</SelectItem>
                      <SelectItem value="admins">Admins</SelectItem>
                      <SelectItem value="all">Everyone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                  <Label>Enable Rule</Label>
                  <p className="text-xs text-muted-foreground">Rule will be active immediately</p>
                </div>
                <Switch
                  checked={ruleForm.enabled}
                  onCheckedChange={(checked) => setRuleForm({ ...ruleForm, enabled: checked })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRuleDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateRule} disabled={!ruleForm.name}>
                Create Rule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminNotifications;
