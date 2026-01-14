import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { teacherNavItems } from '@/config/teacherNavItems';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  User,
  Bell,
  Shield,
  Palette,
  Key,
  Camera,
  Mail,
  Phone,
  GraduationCap,
  ClipboardCheck,
  Users,
  BookOpen,
  Clock,
  Volume2,
  Eye,
  EyeOff,
  Lock,
  Smartphone,
  Moon,
  Sun,
  Monitor,
  Languages,
  Save,
  Trash2,
  Download,
  FileText,
  Calculator,
  AlertTriangle,
  Settings2,
  Calendar,
} from 'lucide-react';

const TeacherSettings = () => {
  // Profile state
  const [profile, setProfile] = useState({
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@school.edu',
    phone: '+1 234 567 890',
    bio: 'Experienced Mathematics and Physics teacher with 10 years of teaching experience.',
    teacherId: 'TCH-2024-001',
    department: 'Science & Mathematics',
    subjects: ['Mathematics', 'Physics'],
    yearsOfExperience: 10,
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailStudentSubmissions: true,
    emailExamReminders: true,
    emailParentMessages: true,
    emailAdminAnnouncements: true,
    pushNewSubmission: true,
    pushExamStart: true,
    pushStudentQuestions: true,
    pushGradingReminders: true,
    soundEnabled: true,
    vibrationEnabled: true,
  });

  // Grading preferences
  const [gradingPrefs, setGradingPrefs] = useState({
    defaultPassingScore: '60',
    gradingScale: 'percentage',
    showDetailedFeedback: true,
    autoReleaseResults: false,
    resultReleaseDelay: '24',
    anonymousGrading: false,
    allowPartialCredit: true,
    roundingMethod: 'nearest',
  });

  // Exam settings
  const [examSettings, setExamSettings] = useState({
    defaultTimeLimit: '60',
    shuffleQuestions: true,
    shuffleOptions: true,
    showCorrectAnswers: true,
    allowLateSumbmission: false,
    lateSubmissionPenalty: '10',
    enableProctoringAlerts: true,
    maxAttempts: '1',
  });

  // Class management preferences
  const [classPrefs, setClassPrefs] = useState({
    autoEnrollStudents: false,
    requireApproval: true,
    sendWelcomeEmail: true,
    showClassLeaderboard: true,
    allowPeerDiscussion: true,
    enableAttendanceTracking: true,
  });

  // Appearance settings
  const [appearance, setAppearance] = useState({
    theme: 'system',
    language: 'en',
    fontSize: 'medium',
    compactMode: false,
  });

  // Security state
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully!');
  };

  const handleSaveNotifications = () => {
    toast.success('Notification preferences saved!');
  };

  const handleSaveGrading = () => {
    toast.success('Grading preferences saved!');
  };

  const handleSaveExamSettings = () => {
    toast.success('Exam settings saved!');
  };

  const handleSaveClassPrefs = () => {
    toast.success('Class management preferences saved!');
  };

  const handleSaveAppearance = () => {
    toast.success('Appearance settings saved!');
  };

  const handleChangePassword = () => {
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match!');
      return;
    }
    if (passwords.new.length < 8) {
      toast.error('Password must be at least 8 characters!');
      return;
    }
    toast.success('Password changed successfully!');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const handleExportData = () => {
    toast.success('Your data export has been initiated. You will receive an email shortly.');
  };

  return (
    <DashboardLayout navItems={teacherNavItems} role="teacher">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and teaching preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 h-auto gap-2 bg-transparent p-0">
            <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="grading" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <ClipboardCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Grading</span>
            </TabsTrigger>
            <TabsTrigger value="exams" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Exams</span>
            </TabsTrigger>
            <TabsTrigger value="class" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Class</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Key className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Profile Information
                </CardTitle>
                <CardDescription>Update your personal and professional information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {profile.firstName[0]}{profile.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h3 className="font-semibold">{profile.firstName} {profile.lastName}</h3>
                    <p className="text-sm text-muted-foreground">{profile.teacherId}</p>
                    <div className="flex gap-2 flex-wrap">
                      {profile.subjects.map((subject) => (
                        <Badge key={subject} variant="secondary">{subject}</Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Change Photo
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Basic Info */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" /> Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" /> Phone
                    </Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* Professional Info */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Teacher ID</Label>
                    <Input value={profile.teacherId} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Input value={profile.department} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>Years of Experience</Label>
                    <Input 
                      type="number" 
                      value={profile.yearsOfExperience} 
                      onChange={(e) => setProfile({ ...profile, yearsOfExperience: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Tell us about your teaching experience and expertise..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Email Notifications
                </CardTitle>
                <CardDescription>Choose what emails you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Student Submissions</Label>
                    <p className="text-sm text-muted-foreground">Get notified when students submit exams</p>
                  </div>
                  <Switch
                    checked={notifications.emailStudentSubmissions}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, emailStudentSubmissions: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Exam Reminders</Label>
                    <p className="text-sm text-muted-foreground">Reminders about scheduled exams</p>
                  </div>
                  <Switch
                    checked={notifications.emailExamReminders}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, emailExamReminders: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Parent Messages</Label>
                    <p className="text-sm text-muted-foreground">Messages from parents and guardians</p>
                  </div>
                  <Switch
                    checked={notifications.emailParentMessages}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, emailParentMessages: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Admin Announcements</Label>
                    <p className="text-sm text-muted-foreground">Important announcements from administration</p>
                  </div>
                  <Switch
                    checked={notifications.emailAdminAnnouncements}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, emailAdminAnnouncements: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-primary" />
                  Push Notifications
                </CardTitle>
                <CardDescription>Configure push notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Submission</Label>
                    <p className="text-sm text-muted-foreground">Alert when a student submits an exam</p>
                  </div>
                  <Switch
                    checked={notifications.pushNewSubmission}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, pushNewSubmission: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Exam Starting</Label>
                    <p className="text-sm text-muted-foreground">Alert when your exam is about to start</p>
                  </div>
                  <Switch
                    checked={notifications.pushExamStart}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, pushExamStart: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Student Questions</Label>
                    <p className="text-sm text-muted-foreground">Questions and clarifications from students</p>
                  </div>
                  <Switch
                    checked={notifications.pushStudentQuestions}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, pushStudentQuestions: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Grading Reminders</Label>
                    <p className="text-sm text-muted-foreground">Reminders for pending grades</p>
                  </div>
                  <Switch
                    checked={notifications.pushGradingReminders}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, pushGradingReminders: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5 text-primary" />
                  Sound & Vibration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sound Effects</Label>
                    <p className="text-sm text-muted-foreground">Play sounds for notifications</p>
                  </div>
                  <Switch
                    checked={notifications.soundEnabled}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, soundEnabled: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Vibration</Label>
                    <p className="text-sm text-muted-foreground">Vibrate for notifications on mobile</p>
                  </div>
                  <Switch
                    checked={notifications.vibrationEnabled}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, vibrationEnabled: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSaveNotifications}>
                <Save className="h-4 w-4 mr-2" />
                Save Notification Settings
              </Button>
            </div>
          </TabsContent>

          {/* Grading Preferences Tab */}
          <TabsContent value="grading" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Grading Scale & Scoring
                </CardTitle>
                <CardDescription>Configure how grades are calculated and displayed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Default Passing Score (%)</Label>
                    <Input
                      type="number"
                      value={gradingPrefs.defaultPassingScore}
                      onChange={(e) => setGradingPrefs({ ...gradingPrefs, defaultPassingScore: e.target.value })}
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Grading Scale</Label>
                    <Select
                      value={gradingPrefs.gradingScale}
                      onValueChange={(value) => setGradingPrefs({ ...gradingPrefs, gradingScale: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage (0-100%)</SelectItem>
                        <SelectItem value="letter">Letter Grade (A-F)</SelectItem>
                        <SelectItem value="points">Points Based</SelectItem>
                        <SelectItem value="gpa">GPA Scale (0-4.0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Rounding Method</Label>
                    <Select
                      value={gradingPrefs.roundingMethod}
                      onValueChange={(value) => setGradingPrefs({ ...gradingPrefs, roundingMethod: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nearest">Round to Nearest</SelectItem>
                        <SelectItem value="up">Round Up</SelectItem>
                        <SelectItem value="down">Round Down</SelectItem>
                        <SelectItem value="none">No Rounding</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Result Release Delay (hours)</Label>
                    <Input
                      type="number"
                      value={gradingPrefs.resultReleaseDelay}
                      onChange={(e) => setGradingPrefs({ ...gradingPrefs, resultReleaseDelay: e.target.value })}
                      min="0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5 text-primary" />
                  Grading Options
                </CardTitle>
                <CardDescription>Additional grading preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Detailed Feedback</Label>
                    <p className="text-sm text-muted-foreground">Include explanations for each answer</p>
                  </div>
                  <Switch
                    checked={gradingPrefs.showDetailedFeedback}
                    onCheckedChange={(checked) => setGradingPrefs({ ...gradingPrefs, showDetailedFeedback: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Release Results</Label>
                    <p className="text-sm text-muted-foreground">Automatically publish results after grading</p>
                  </div>
                  <Switch
                    checked={gradingPrefs.autoReleaseResults}
                    onCheckedChange={(checked) => setGradingPrefs({ ...gradingPrefs, autoReleaseResults: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Anonymous Grading</Label>
                    <p className="text-sm text-muted-foreground">Hide student names while grading</p>
                  </div>
                  <Switch
                    checked={gradingPrefs.anonymousGrading}
                    onCheckedChange={(checked) => setGradingPrefs({ ...gradingPrefs, anonymousGrading: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Partial Credit</Label>
                    <p className="text-sm text-muted-foreground">Give partial marks for partially correct answers</p>
                  </div>
                  <Switch
                    checked={gradingPrefs.allowPartialCredit}
                    onCheckedChange={(checked) => setGradingPrefs({ ...gradingPrefs, allowPartialCredit: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSaveGrading}>
                <Save className="h-4 w-4 mr-2" />
                Save Grading Preferences
              </Button>
            </div>
          </TabsContent>

          {/* Exam Settings Tab */}
          <TabsContent value="exams" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Time & Attempt Settings
                </CardTitle>
                <CardDescription>Default settings for new exams</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Default Time Limit (minutes)</Label>
                    <Input
                      type="number"
                      value={examSettings.defaultTimeLimit}
                      onChange={(e) => setExamSettings({ ...examSettings, defaultTimeLimit: e.target.value })}
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Maximum Attempts</Label>
                    <Select
                      value={examSettings.maxAttempts}
                      onValueChange={(value) => setExamSettings({ ...examSettings, maxAttempts: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Attempt</SelectItem>
                        <SelectItem value="2">2 Attempts</SelectItem>
                        <SelectItem value="3">3 Attempts</SelectItem>
                        <SelectItem value="unlimited">Unlimited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Late Submission Penalty (%)</Label>
                    <Input
                      type="number"
                      value={examSettings.lateSubmissionPenalty}
                      onChange={(e) => setExamSettings({ ...examSettings, lateSubmissionPenalty: e.target.value })}
                      min="0"
                      max="100"
                      disabled={!examSettings.allowLateSumbmission}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Question & Answer Options
                </CardTitle>
                <CardDescription>Control how questions and answers are presented</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Shuffle Questions</Label>
                    <p className="text-sm text-muted-foreground">Randomize question order for each student</p>
                  </div>
                  <Switch
                    checked={examSettings.shuffleQuestions}
                    onCheckedChange={(checked) => setExamSettings({ ...examSettings, shuffleQuestions: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Shuffle Answer Options</Label>
                    <p className="text-sm text-muted-foreground">Randomize option order for MCQ questions</p>
                  </div>
                  <Switch
                    checked={examSettings.shuffleOptions}
                    onCheckedChange={(checked) => setExamSettings({ ...examSettings, shuffleOptions: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Correct Answers</Label>
                    <p className="text-sm text-muted-foreground">Display correct answers after submission</p>
                  </div>
                  <Switch
                    checked={examSettings.showCorrectAnswers}
                    onCheckedChange={(checked) => setExamSettings({ ...examSettings, showCorrectAnswers: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Late Submission</Label>
                    <p className="text-sm text-muted-foreground">Accept submissions after deadline with penalty</p>
                  </div>
                  <Switch
                    checked={examSettings.allowLateSumbmission}
                    onCheckedChange={(checked) => setExamSettings({ ...examSettings, allowLateSumbmission: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Proctoring Alerts</Label>
                    <p className="text-sm text-muted-foreground">Notify on suspicious activity during exams</p>
                  </div>
                  <Switch
                    checked={examSettings.enableProctoringAlerts}
                    onCheckedChange={(checked) => setExamSettings({ ...examSettings, enableProctoringAlerts: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSaveExamSettings}>
                <Save className="h-4 w-4 mr-2" />
                Save Exam Settings
              </Button>
            </div>
          </TabsContent>

          {/* Class Management Tab */}
          <TabsContent value="class" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Student Enrollment
                </CardTitle>
                <CardDescription>Configure how students join your classes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Enroll Students</Label>
                    <p className="text-sm text-muted-foreground">Automatically add students assigned by admin</p>
                  </div>
                  <Switch
                    checked={classPrefs.autoEnrollStudents}
                    onCheckedChange={(checked) => setClassPrefs({ ...classPrefs, autoEnrollStudents: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Approval</Label>
                    <p className="text-sm text-muted-foreground">Manually approve student enrollment requests</p>
                  </div>
                  <Switch
                    checked={classPrefs.requireApproval}
                    onCheckedChange={(checked) => setClassPrefs({ ...classPrefs, requireApproval: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Send Welcome Email</Label>
                    <p className="text-sm text-muted-foreground">Email students when they join your class</p>
                  </div>
                  <Switch
                    checked={classPrefs.sendWelcomeEmail}
                    onCheckedChange={(checked) => setClassPrefs({ ...classPrefs, sendWelcomeEmail: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Class Features
                </CardTitle>
                <CardDescription>Enable or disable class features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Class Leaderboard</Label>
                    <p className="text-sm text-muted-foreground">Display rankings to motivate students</p>
                  </div>
                  <Switch
                    checked={classPrefs.showClassLeaderboard}
                    onCheckedChange={(checked) => setClassPrefs({ ...classPrefs, showClassLeaderboard: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Peer Discussion</Label>
                    <p className="text-sm text-muted-foreground">Enable discussion forums for students</p>
                  </div>
                  <Switch
                    checked={classPrefs.allowPeerDiscussion}
                    onCheckedChange={(checked) => setClassPrefs({ ...classPrefs, allowPeerDiscussion: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Attendance Tracking</Label>
                    <p className="text-sm text-muted-foreground">Track student attendance automatically</p>
                  </div>
                  <Switch
                    checked={classPrefs.enableAttendanceTracking}
                    onCheckedChange={(checked) => setClassPrefs({ ...classPrefs, enableAttendanceTracking: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSaveClassPrefs}>
                <Save className="h-4 w-4 mr-2" />
                Save Class Preferences
              </Button>
            </div>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  Theme & Display
                </CardTitle>
                <CardDescription>Customize the look and feel of your dashboard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'light', icon: Sun, label: 'Light' },
                      { value: 'dark', icon: Moon, label: 'Dark' },
                      { value: 'system', icon: Monitor, label: 'System' },
                    ].map(({ value, icon: Icon, label }) => (
                      <Button
                        key={value}
                        variant={appearance.theme === value ? 'default' : 'outline'}
                        className="flex flex-col h-auto py-4 gap-2"
                        onClick={() => setAppearance({ ...appearance, theme: value })}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Languages className="h-4 w-4" /> Language
                    </Label>
                    <Select
                      value={appearance.language}
                      onValueChange={(value) => setAppearance({ ...appearance, language: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="zh">中文</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <Select
                      value={appearance.fontSize}
                      onValueChange={(value) => setAppearance({ ...appearance, fontSize: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">Reduce spacing for more content on screen</p>
                  </div>
                  <Switch
                    checked={appearance.compactMode}
                    onCheckedChange={(checked) => setAppearance({ ...appearance, compactMode: checked })}
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveAppearance}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Appearance
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  Change Password
                </CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleChangePassword}>
                    <Key className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Active Sessions
                </CardTitle>
                <CardDescription>Manage your active login sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Monitor className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Chrome on Windows</p>
                      <p className="text-sm text-muted-foreground">Current session • Last active now</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-muted rounded-full">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Safari on iPhone</p>
                      <p className="text-sm text-muted-foreground">Last active 2 hours ago</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">End Session</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Data & Account
                </CardTitle>
                <CardDescription>Export your data or delete your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Export My Data</p>
                    <p className="text-sm text-muted-foreground">Download all your data including exams, grades, and reports</p>
                  </div>
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-lg bg-destructive/5">
                  <div>
                    <p className="font-medium text-destructive">Delete Account</p>
                    <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TeacherSettings;
