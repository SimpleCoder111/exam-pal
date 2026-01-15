import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { adminNavItems } from '@/config/adminNavItems';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Settings,
  Shield,
  Bell,
  Palette,
  Clock,
  AlertTriangle,
  Mail,
  Smartphone,
  Globe,
  Building2,
  Save,
  RotateCcw,
  Upload,
  Eye,
  EyeOff,
  Lock,
  Users,
  FileText,
  Monitor,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExamDefaults {
  defaultDuration: number;
  defaultPassingMarks: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showResultsImmediately: boolean;
  allowReview: boolean;
  requireFullscreen: boolean;
  preventCopyPaste: boolean;
  preventTabSwitch: boolean;
}

interface SecuritySettings {
  maxLoginAttempts: number;
  sessionTimeout: number;
  maxViolationsBeforeWarning: number;
  maxViolationsBeforeAutoSubmit: number;
  autoSubmitOnDisconnect: boolean;
  disconnectGracePeriod: number;
  enableProctoring: boolean;
  enableScreenCapture: boolean;
  enableWebcamMonitoring: boolean;
  blockExternalDevices: boolean;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  notifyOnExamCreate: boolean;
  notifyOnExamStart: boolean;
  notifyOnExamComplete: boolean;
  notifyOnSecurityAlert: boolean;
  notifyOnLowPassRate: boolean;
  lowPassRateThreshold: number;
  dailyDigest: boolean;
  weeklyReport: boolean;
}

interface BrandingSettings {
  institutionName: string;
  institutionTagline: string;
  supportEmail: string;
  supportPhone: string;
  website: string;
  address: string;
  primaryColor: string;
  accentColor: string;
  logoUrl: string;
  faviconUrl: string;
  showPoweredBy: boolean;
}

const AdminSettings = () => {
  const { toast } = useToast();
  
  const [examDefaults, setExamDefaults] = useState<ExamDefaults>({
    defaultDuration: 60,
    defaultPassingMarks: 40,
    shuffleQuestions: true,
    shuffleOptions: true,
    showResultsImmediately: true,
    allowReview: true,
    requireFullscreen: true,
    preventCopyPaste: true,
    preventTabSwitch: true,
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    maxViolationsBeforeWarning: 3,
    maxViolationsBeforeAutoSubmit: 8,
    autoSubmitOnDisconnect: true,
    disconnectGracePeriod: 120,
    enableProctoring: false,
    enableScreenCapture: false,
    enableWebcamMonitoring: false,
    blockExternalDevices: false,
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    notifyOnExamCreate: true,
    notifyOnExamStart: true,
    notifyOnExamComplete: true,
    notifyOnSecurityAlert: true,
    notifyOnLowPassRate: true,
    lowPassRateThreshold: 60,
    dailyDigest: false,
    weeklyReport: true,
  });

  const [brandingSettings, setBrandingSettings] = useState<BrandingSettings>({
    institutionName: 'EduExam Academy',
    institutionTagline: 'Excellence in Education',
    supportEmail: 'support@eduexam.com',
    supportPhone: '+1 (555) 123-4567',
    website: 'https://eduexam.com',
    address: '123 Education Street, Learning City, LC 12345',
    primaryColor: '#6366f1',
    accentColor: '#8b5cf6',
    logoUrl: '',
    faviconUrl: '',
    showPoweredBy: true,
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = (section: string) => {
    toast({
      title: 'Settings Saved',
      description: `${section} settings have been updated successfully.`,
    });
    setHasChanges(false);
  };

  const handleReset = (section: string) => {
    toast({
      title: 'Settings Reset',
      description: `${section} settings have been reset to defaults.`,
    });
    setHasChanges(false);
  };

  const markChanged = () => {
    if (!hasChanges) setHasChanges(true);
  };

  return (
    <DashboardLayout navItems={adminNavItems} role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Settings className="h-8 w-8 text-primary" />
              System Settings
            </h1>
            <p className="text-muted-foreground mt-1">
              Configure system-wide settings for exams, security, and branding
            </p>
          </div>
          {hasChanges && (
            <Badge variant="secondary" className="animate-pulse">
              Unsaved Changes
            </Badge>
          )}
        </div>

        <Tabs defaultValue="exam" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="exam" className="gap-2">
              <FileText className="h-4 w-4 hidden sm:inline" />
              Exam Defaults
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4 hidden sm:inline" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4 hidden sm:inline" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="branding" className="gap-2">
              <Palette className="h-4 w-4 hidden sm:inline" />
              Branding
            </TabsTrigger>
          </TabsList>

          {/* Exam Defaults Tab */}
          <TabsContent value="exam" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Default Exam Settings
                </CardTitle>
                <CardDescription>
                  Configure default values for new exams. Teachers can override these for individual exams.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="defaultDuration">Default Duration (minutes)</Label>
                    <Input
                      id="defaultDuration"
                      type="number"
                      value={examDefaults.defaultDuration}
                      onChange={(e) => {
                        setExamDefaults({ ...examDefaults, defaultDuration: parseInt(e.target.value) || 60 });
                        markChanged();
                      }}
                      min={10}
                      max={300}
                    />
                    <p className="text-xs text-muted-foreground">Range: 10-300 minutes</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defaultPassingMarks">Default Passing Marks (%)</Label>
                    <Input
                      id="defaultPassingMarks"
                      type="number"
                      value={examDefaults.defaultPassingMarks}
                      onChange={(e) => {
                        setExamDefaults({ ...examDefaults, defaultPassingMarks: parseInt(e.target.value) || 40 });
                        markChanged();
                      }}
                      min={0}
                      max={100}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Question & Answer Settings</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Shuffle Questions</Label>
                        <p className="text-xs text-muted-foreground">Randomize question order for each student</p>
                      </div>
                      <Switch
                        checked={examDefaults.shuffleQuestions}
                        onCheckedChange={(checked) => {
                          setExamDefaults({ ...examDefaults, shuffleQuestions: checked });
                          markChanged();
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Shuffle Options</Label>
                        <p className="text-xs text-muted-foreground">Randomize answer options order</p>
                      </div>
                      <Switch
                        checked={examDefaults.shuffleOptions}
                        onCheckedChange={(checked) => {
                          setExamDefaults({ ...examDefaults, shuffleOptions: checked });
                          markChanged();
                        }}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Results & Review</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Show Results Immediately</Label>
                        <p className="text-xs text-muted-foreground">Display results right after submission</p>
                      </div>
                      <Switch
                        checked={examDefaults.showResultsImmediately}
                        onCheckedChange={(checked) => {
                          setExamDefaults({ ...examDefaults, showResultsImmediately: checked });
                          markChanged();
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Allow Answer Review</Label>
                        <p className="text-xs text-muted-foreground">Let students review their answers after exam</p>
                      </div>
                      <Switch
                        checked={examDefaults.allowReview}
                        onCheckedChange={(checked) => {
                          setExamDefaults({ ...examDefaults, allowReview: checked });
                          markChanged();
                        }}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Exam Security Defaults</h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Require Fullscreen</Label>
                        <p className="text-xs text-muted-foreground">Force fullscreen mode</p>
                      </div>
                      <Switch
                        checked={examDefaults.requireFullscreen}
                        onCheckedChange={(checked) => {
                          setExamDefaults({ ...examDefaults, requireFullscreen: checked });
                          markChanged();
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Prevent Copy/Paste</Label>
                        <p className="text-xs text-muted-foreground">Block clipboard actions</p>
                      </div>
                      <Switch
                        checked={examDefaults.preventCopyPaste}
                        onCheckedChange={(checked) => {
                          setExamDefaults({ ...examDefaults, preventCopyPaste: checked });
                          markChanged();
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Detect Tab Switch</Label>
                        <p className="text-xs text-muted-foreground">Track tab/window changes</p>
                      </div>
                      <Switch
                        checked={examDefaults.preventTabSwitch}
                        onCheckedChange={(checked) => {
                          setExamDefaults({ ...examDefaults, preventTabSwitch: checked });
                          markChanged();
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => handleReset('Exam Defaults')}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
              <Button onClick={() => handleSave('Exam Defaults')}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Authentication & Session
                </CardTitle>
                <CardDescription>
                  Configure login security and session management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Max Login Attempts</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[securitySettings.maxLoginAttempts]}
                        onValueChange={([value]) => {
                          setSecuritySettings({ ...securitySettings, maxLoginAttempts: value });
                          markChanged();
                        }}
                        min={3}
                        max={10}
                        step={1}
                        className="flex-1"
                      />
                      <span className="w-12 text-center font-medium">{securitySettings.maxLoginAttempts}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Account locks after this many failed attempts</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Session Timeout (minutes)</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[securitySettings.sessionTimeout]}
                        onValueChange={([value]) => {
                          setSecuritySettings({ ...securitySettings, sessionTimeout: value });
                          markChanged();
                        }}
                        min={15}
                        max={120}
                        step={5}
                        className="flex-1"
                      />
                      <span className="w-12 text-center font-medium">{securitySettings.sessionTimeout}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Inactive sessions expire after this duration</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Exam Violation Thresholds
                </CardTitle>
                <CardDescription>
                  Configure when to warn students and auto-submit exams
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Violations Before Warning</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[securitySettings.maxViolationsBeforeWarning]}
                        onValueChange={([value]) => {
                          setSecuritySettings({ ...securitySettings, maxViolationsBeforeWarning: value });
                          markChanged();
                        }}
                        min={1}
                        max={10}
                        step={1}
                        className="flex-1"
                      />
                      <span className="w-12 text-center font-medium">{securitySettings.maxViolationsBeforeWarning}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Show warning popup after this many violations</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Violations Before Auto-Submit</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[securitySettings.maxViolationsBeforeAutoSubmit]}
                        onValueChange={([value]) => {
                          setSecuritySettings({ ...securitySettings, maxViolationsBeforeAutoSubmit: value });
                          markChanged();
                        }}
                        min={3}
                        max={20}
                        step={1}
                        className="flex-1"
                      />
                      <span className="w-12 text-center font-medium">{securitySettings.maxViolationsBeforeAutoSubmit}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Auto-submit exam after this many violations</p>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-Submit on Disconnect</Label>
                      <p className="text-xs text-muted-foreground">Submit if connection lost beyond grace period</p>
                    </div>
                    <Switch
                      checked={securitySettings.autoSubmitOnDisconnect}
                      onCheckedChange={(checked) => {
                        setSecuritySettings({ ...securitySettings, autoSubmitOnDisconnect: checked });
                        markChanged();
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Disconnect Grace Period (seconds)</Label>
                    <Input
                      type="number"
                      value={securitySettings.disconnectGracePeriod}
                      onChange={(e) => {
                        setSecuritySettings({ ...securitySettings, disconnectGracePeriod: parseInt(e.target.value) || 120 });
                        markChanged();
                      }}
                      min={30}
                      max={300}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Advanced Proctoring
                </CardTitle>
                <CardDescription>
                  Configure advanced monitoring features (may require additional setup)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        Enable Proctoring
                        <Badge variant="secondary">Beta</Badge>
                      </Label>
                      <p className="text-xs text-muted-foreground">AI-powered exam monitoring</p>
                    </div>
                    <Switch
                      checked={securitySettings.enableProctoring}
                      onCheckedChange={(checked) => {
                        setSecuritySettings({ ...securitySettings, enableProctoring: checked });
                        markChanged();
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label>Screen Capture</Label>
                      <p className="text-xs text-muted-foreground">Periodic screenshots during exam</p>
                    </div>
                    <Switch
                      checked={securitySettings.enableScreenCapture}
                      onCheckedChange={(checked) => {
                        setSecuritySettings({ ...securitySettings, enableScreenCapture: checked });
                        markChanged();
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label>Webcam Monitoring</Label>
                      <p className="text-xs text-muted-foreground">Require camera access during exam</p>
                    </div>
                    <Switch
                      checked={securitySettings.enableWebcamMonitoring}
                      onCheckedChange={(checked) => {
                        setSecuritySettings({ ...securitySettings, enableWebcamMonitoring: checked });
                        markChanged();
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label>Block External Devices</Label>
                      <p className="text-xs text-muted-foreground">Detect secondary monitors/devices</p>
                    </div>
                    <Switch
                      checked={securitySettings.blockExternalDevices}
                      onCheckedChange={(checked) => {
                        setSecuritySettings({ ...securitySettings, blockExternalDevices: checked });
                        markChanged();
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => handleReset('Security')}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
              <Button onClick={() => handleSave('Security')}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Channels
                </CardTitle>
                <CardDescription>
                  Configure how notifications are delivered
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label>Email</Label>
                        <p className="text-xs text-muted-foreground">Send email notifications</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => {
                        setNotificationSettings({ ...notificationSettings, emailNotifications: checked });
                        markChanged();
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label>SMS</Label>
                        <p className="text-xs text-muted-foreground">Send SMS alerts</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) => {
                        setNotificationSettings({ ...notificationSettings, smsNotifications: checked });
                        markChanged();
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label>Push</Label>
                        <p className="text-xs text-muted-foreground">Browser push notifications</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => {
                        setNotificationSettings({ ...notificationSettings, pushNotifications: checked });
                        markChanged();
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Notification Events
                </CardTitle>
                <CardDescription>
                  Choose which events trigger notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Exam Created</Label>
                      <p className="text-xs text-muted-foreground">When a new exam is created</p>
                    </div>
                    <Switch
                      checked={notificationSettings.notifyOnExamCreate}
                      onCheckedChange={(checked) => {
                        setNotificationSettings({ ...notificationSettings, notifyOnExamCreate: checked });
                        markChanged();
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Exam Started</Label>
                      <p className="text-xs text-muted-foreground">When an exam begins</p>
                    </div>
                    <Switch
                      checked={notificationSettings.notifyOnExamStart}
                      onCheckedChange={(checked) => {
                        setNotificationSettings({ ...notificationSettings, notifyOnExamStart: checked });
                        markChanged();
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Exam Completed</Label>
                      <p className="text-xs text-muted-foreground">When all students complete exam</p>
                    </div>
                    <Switch
                      checked={notificationSettings.notifyOnExamComplete}
                      onCheckedChange={(checked) => {
                        setNotificationSettings({ ...notificationSettings, notifyOnExamComplete: checked });
                        markChanged();
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Security Alert</Label>
                      <p className="text-xs text-muted-foreground">On exam security violations</p>
                    </div>
                    <Switch
                      checked={notificationSettings.notifyOnSecurityAlert}
                      onCheckedChange={(checked) => {
                        setNotificationSettings({ ...notificationSettings, notifyOnSecurityAlert: checked });
                        markChanged();
                      }}
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Low Pass Rate Alert</Label>
                      <p className="text-xs text-muted-foreground">Alert when pass rate drops below threshold</p>
                    </div>
                    <Switch
                      checked={notificationSettings.notifyOnLowPassRate}
                      onCheckedChange={(checked) => {
                        setNotificationSettings({ ...notificationSettings, notifyOnLowPassRate: checked });
                        markChanged();
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Low Pass Rate Threshold (%)</Label>
                    <Input
                      type="number"
                      value={notificationSettings.lowPassRateThreshold}
                      onChange={(e) => {
                        setNotificationSettings({ ...notificationSettings, lowPassRateThreshold: parseInt(e.target.value) || 60 });
                        markChanged();
                      }}
                      min={0}
                      max={100}
                      disabled={!notificationSettings.notifyOnLowPassRate}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Scheduled Reports
                </CardTitle>
                <CardDescription>
                  Configure automated report delivery
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label>Daily Digest</Label>
                      <p className="text-xs text-muted-foreground">Summary of daily exam activity</p>
                    </div>
                    <Switch
                      checked={notificationSettings.dailyDigest}
                      onCheckedChange={(checked) => {
                        setNotificationSettings({ ...notificationSettings, dailyDigest: checked });
                        markChanged();
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label>Weekly Report</Label>
                      <p className="text-xs text-muted-foreground">Comprehensive weekly analytics</p>
                    </div>
                    <Switch
                      checked={notificationSettings.weeklyReport}
                      onCheckedChange={(checked) => {
                        setNotificationSettings({ ...notificationSettings, weeklyReport: checked });
                        markChanged();
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => handleReset('Notification')}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
              <Button onClick={() => handleSave('Notification')}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </TabsContent>

          {/* Branding Tab */}
          <TabsContent value="branding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Institution Information
                </CardTitle>
                <CardDescription>
                  Configure your institution's public information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="institutionName">Institution Name</Label>
                    <Input
                      id="institutionName"
                      value={brandingSettings.institutionName}
                      onChange={(e) => {
                        setBrandingSettings({ ...brandingSettings, institutionName: e.target.value });
                        markChanged();
                      }}
                      placeholder="Your Institution Name"
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="institutionTagline">Tagline</Label>
                    <Input
                      id="institutionTagline"
                      value={brandingSettings.institutionTagline}
                      onChange={(e) => {
                        setBrandingSettings({ ...brandingSettings, institutionTagline: e.target.value });
                        markChanged();
                      }}
                      placeholder="Excellence in Education"
                      maxLength={100}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={brandingSettings.supportEmail}
                      onChange={(e) => {
                        setBrandingSettings({ ...brandingSettings, supportEmail: e.target.value });
                        markChanged();
                      }}
                      placeholder="support@example.com"
                      maxLength={255}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supportPhone">Support Phone</Label>
                    <Input
                      id="supportPhone"
                      type="tel"
                      value={brandingSettings.supportPhone}
                      onChange={(e) => {
                        setBrandingSettings({ ...brandingSettings, supportPhone: e.target.value });
                        markChanged();
                      }}
                      placeholder="+1 (555) 123-4567"
                      maxLength={20}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={brandingSettings.website}
                    onChange={(e) => {
                      setBrandingSettings({ ...brandingSettings, website: e.target.value });
                      markChanged();
                    }}
                    placeholder="https://www.example.com"
                    maxLength={255}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={brandingSettings.address}
                    onChange={(e) => {
                      setBrandingSettings({ ...brandingSettings, address: e.target.value });
                      markChanged();
                    }}
                    placeholder="Enter your institution's address"
                    rows={2}
                    maxLength={500}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Theme & Colors
                </CardTitle>
                <CardDescription>
                  Customize your platform's appearance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={brandingSettings.primaryColor}
                        onChange={(e) => {
                          setBrandingSettings({ ...brandingSettings, primaryColor: e.target.value });
                          markChanged();
                        }}
                        className="w-16 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={brandingSettings.primaryColor}
                        onChange={(e) => {
                          setBrandingSettings({ ...brandingSettings, primaryColor: e.target.value });
                          markChanged();
                        }}
                        placeholder="#6366f1"
                        className="flex-1"
                        maxLength={7}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accentColor">Accent Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="accentColor"
                        type="color"
                        value={brandingSettings.accentColor}
                        onChange={(e) => {
                          setBrandingSettings({ ...brandingSettings, accentColor: e.target.value });
                          markChanged();
                        }}
                        className="w-16 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={brandingSettings.accentColor}
                        onChange={(e) => {
                          setBrandingSettings({ ...brandingSettings, accentColor: e.target.value });
                          markChanged();
                        }}
                        placeholder="#8b5cf6"
                        className="flex-1"
                        maxLength={7}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Logo</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload logo</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 2MB (Recommended: 200x50px)</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Upload Logo
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Favicon</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload favicon</p>
                      <p className="text-xs text-muted-foreground mt-1">ICO, PNG 32x32px or 16x16px</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Upload Favicon
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Display Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show "Powered by EduExam"</Label>
                    <p className="text-xs text-muted-foreground">Display branding in footer</p>
                  </div>
                  <Switch
                    checked={brandingSettings.showPoweredBy}
                    onCheckedChange={(checked) => {
                      setBrandingSettings({ ...brandingSettings, showPoweredBy: checked });
                      markChanged();
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => handleReset('Branding')}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
              <Button onClick={() => handleSave('Branding')}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;
