import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  UserPlus,
  TrendingUp,
  TrendingDown,
  Calendar,
  Bell,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { adminNavItems } from '@/config/adminNavItems';
import { useAdminDashboardStats, useAdminDashboardActivities, useAdminDashboardGrades } from '@/hooks/useAdminDashboard';

const gradeColors: Record<string, string> = {
  A: 'bg-green-500',
  B: 'bg-blue-500',
  C: 'bg-yellow-500',
  D: 'bg-orange-500',
  E: 'bg-purple-500',
  F: 'bg-red-500',
};

const formatTimeAgo = (timestamp: string) => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useAdminDashboardStats();
  const { data: activities, isLoading: activitiesLoading } = useAdminDashboardActivities(10);
  const { data: grades, isLoading: gradesLoading } = useAdminDashboardGrades();

  const statCards = stats ? [
    { label: 'Total Students', value: stats.totalStudent.toLocaleString(), change: stats.studentChange, icon: Users, color: 'text-blue-500 bg-blue-500/10' },
    { label: 'Total Teachers', value: stats.totalTeacher.toLocaleString(), change: stats.teacherChange, icon: GraduationCap, color: 'text-green-500 bg-green-500/10' },
    { label: 'Active Subjects', value: stats.activeSubject.toLocaleString(), change: stats.subjectChange, icon: BookOpen, color: 'text-purple-500 bg-purple-500/10' },
    { label: 'Exams This Month', value: stats.examThisMonth.toLocaleString(), change: stats.examChange, icon: Calendar, color: 'text-orange-500 bg-orange-500/10' },
  ] : [];

  const isNegativeChange = (change: string) => change.startsWith('-');

  return (
    <DashboardLayout navItems={adminNavItems} role="admin">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-semibold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening at your school.</p>
          </div>
          <Button onClick={() => navigate('/admin/users')}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add New User
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <Skeleton className="w-12 h-12 rounded-lg" />
                      <Skeleton className="w-12 h-4" />
                    </div>
                    <div className="mt-4 space-y-2">
                      <Skeleton className="w-20 h-8" />
                      <Skeleton className="w-24 h-4" />
                    </div>
                  </CardContent>
                </Card>
              ))
            : statCards.map((stat) => (
                <Card key={stat.label} className="hover:shadow-card transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <span className={`text-sm font-medium flex items-center gap-1 ${isNegativeChange(stat.change) ? 'text-destructive' : 'text-green-600'}`}>
                        {isNegativeChange(stat.change) ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
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
                {activitiesLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                        <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="w-3/4 h-4" />
                          <Skeleton className="w-16 h-3" />
                        </div>
                      </div>
                    ))
                  : activities && activities.length > 0
                    ? activities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Activity className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground">
                              {activity.action}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{formatTimeAgo(activity.timestamp)}</p>
                          </div>
                        </div>
                      ))
                    : <p className="text-sm text-muted-foreground">No recent activity</p>}
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
                {gradesLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-full h-2" />
                      </div>
                    ))
                  : grades?.map((item) => (
                      <div key={item.grade} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-foreground">Grade {item.grade}</span>
                          <span className="text-muted-foreground">{item.percentage}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full ${gradeColors[item.grade] ?? 'bg-primary'} rounded-full transition-all duration-500`}
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
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate('/admin/users')}>
                <UserPlus className="w-6 h-6" />
                <span>Add User</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate('/admin/subjects')}>
                <BookOpen className="w-6 h-6" />
                <span>New Subject</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate('/admin/classes')}>
                <GraduationCap className="w-6 h-6" />
                <span>Create Class</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate('/admin/notifications')}>
                <Bell className="w-6 h-6" />
                <span>Notification</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
