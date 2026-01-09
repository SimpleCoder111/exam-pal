import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  Settings,
  BarChart3,
  UserPlus,
  Megaphone,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: BarChart3 },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Subjects', href: '/admin/subjects', icon: BookOpen },
  { label: 'Classes', href: '/admin/classes', icon: GraduationCap },
  { label: 'Announcements', href: '/admin/announcements', icon: Megaphone },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

const stats = [
  { label: 'Total Students', value: '1,234', change: '+12%', icon: Users, color: 'text-blue-500 bg-blue-500/10' },
  { label: 'Total Teachers', value: '48', change: '+3%', icon: GraduationCap, color: 'text-green-500 bg-green-500/10' },
  { label: 'Active Subjects', value: '24', change: '+2', icon: BookOpen, color: 'text-purple-500 bg-purple-500/10' },
  { label: 'Exams This Month', value: '156', change: '+8%', icon: Calendar, color: 'text-orange-500 bg-orange-500/10' },
];

const recentActivities = [
  { user: 'John Smith', action: 'created a new exam', subject: 'Mathematics', time: '2 hours ago' },
  { user: 'Jane Doe', action: 'completed exam', subject: 'Physics', time: '3 hours ago' },
  { user: 'Mike Johnson', action: 'added 20 questions', subject: 'Chemistry', time: '5 hours ago' },
  { user: 'Sarah Wilson', action: 'enrolled in class', subject: 'Grade 10-A', time: '6 hours ago' },
];

const gradeDistribution = [
  { grade: 'A', percentage: 25, color: 'bg-green-500' },
  { grade: 'B', percentage: 35, color: 'bg-blue-500' },
  { grade: 'C', percentage: 25, color: 'bg-yellow-500' },
  { grade: 'D', percentage: 10, color: 'bg-orange-500' },
  { grade: 'F', percentage: 5, color: 'bg-red-500' },
];

const AdminDashboard = () => {
  return (
    <DashboardLayout navItems={navItems} role="admin">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-semibold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening at your school.</p>
          </div>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Add New User
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="hover:shadow-card transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-semibold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{activity.user}</span>{' '}
                        {activity.action} in{' '}
                        <span className="font-medium">{activity.subject}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Grade Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Overall Grade Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gradeDistribution.map((item) => (
                  <div key={item.grade} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">Grade {item.grade}</span>
                      <span className="text-muted-foreground">{item.percentage}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.color} rounded-full transition-all duration-500`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <UserPlus className="w-6 h-6" />
                <span>Add User</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <BookOpen className="w-6 h-6" />
                <span>New Subject</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <GraduationCap className="w-6 h-6" />
                <span>Create Class</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Megaphone className="w-6 h-6" />
                <span>Announcement</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
