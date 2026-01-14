import { 
  BarChart3, 
  BookOpen, 
  Calendar, 
  Trophy,
  Settings
} from 'lucide-react';

export const studentNavItems = [
  { label: 'Dashboard', href: '/student', icon: BarChart3 },
  { label: 'My Subjects', href: '/student/subjects', icon: BookOpen },
  { label: 'Exams', href: '/student/exams', icon: Calendar },
  { label: 'Results', href: '/student/results', icon: Trophy },
  { label: 'Settings', href: '/student/settings', icon: Settings },
];
