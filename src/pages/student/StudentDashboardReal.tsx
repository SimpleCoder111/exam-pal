import { 
  BookOpen, 
  Clock, 
  Trophy,
  Calendar,
  ArrowRight,
  CheckCircle,
  Star,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Link } from 'react-router-dom';
import { studentNavItems } from '@/config/studentNavItems';
import { useStudentProfile } from '@/hooks/useStudentProfile';

const formatName = (name?: string | null) => {
  if (!name) return 'Student';
  return name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
};

const StudentDashboardReal = () => {
  const { data: profile, isLoading: profileLoading, error: profileError } = useStudentProfile();

  return (
    <DashboardLayout navItems={studentNavItems} role="student">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            {profileLoading ? (
              <Skeleton className="h-9 w-64 mb-2" />
            ) : (
              <h1 className="font-heading text-3xl font-semibold text-foreground">
                Welcome Back, {formatName(profile?.name)}!
              </h1>
            )}
            <p className="text-muted-foreground mt-1">Here's your learning progress and upcoming activities.</p>
          </div>
          <Link to="/exam">
            <Button>
              <BookOpen className="w-4 h-4 mr-2" />
              Take Practice Exam
            </Button>
          </Link>
        </div>

        {/* Profile Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">My Profile</CardTitle>
          </CardHeader>
          <CardContent>
            {profileLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : profileError ? (
              <p className="text-sm text-destructive">Failed to load profile. Please try again later.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Student ID</p>
                  <p className="font-medium text-foreground">{profile?.id || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{profile?.email || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">{profile?.phoneNumber || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium text-foreground">
                    {profile?.gender === 'M' ? 'Male' : profile?.gender === 'F' ? 'Female' : profile?.gender || '—'}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats - placeholder for future APIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-semibold text-foreground">—</p>
              <p className="text-sm text-muted-foreground">Enrolled Subjects</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/50 flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-accent-foreground" />
              </div>
              <p className="text-2xl font-semibold text-foreground">—</p>
              <p className="text-sm text-muted-foreground">Upcoming Exams</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-semibold text-foreground">—</p>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/50 flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-6 h-6 text-accent-foreground" />
              </div>
              <p className="text-2xl font-semibold text-foreground">—</p>
              <p className="text-sm text-muted-foreground">Class Rank</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Enrolled Subjects - awaiting API */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-heading">My Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No subjects loaded yet. API integration pending.</p>
            </CardContent>
          </Card>

          {/* Leaderboard - awaiting API */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No leaderboard data yet. API integration pending.</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming Exams - awaiting API */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Upcoming Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No upcoming exams yet. API integration pending.</p>
            </CardContent>
          </Card>

          {/* Recent Results - awaiting API */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Recent Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No results yet. API integration pending.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboardReal;
