import { 
  BarChart3, 
  BookOpen, 
  Calendar, 
  Trophy,
  Medal,
  Settings
} from 'lucide-react';

export const studentNavItems = [
  { label: 'Dashboard', href: '/student', icon: BarChart3 },
  { label: 'My Classes', href: '/student/classes', icon: BookOpen },
  { label: 'Exams', href: '/student/exams', icon: Calendar },
  { label: 'Results', href: '/student/results', icon: Trophy },
  { label: 'Leaderboard', href: '/student/leaderboard', icon: Medal },
  { label: 'Settings', href: '/student/settings', icon: Settings },
];
