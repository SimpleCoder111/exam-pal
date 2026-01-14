import { 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  Users, 
  BarChart3,
  Settings
} from 'lucide-react';

// Shared navigation items for all teacher pages
export const teacherNavItems = [
  { label: 'Dashboard', href: '/teacher', icon: LayoutDashboard },
  { label: 'Question Bank', href: '/teacher/questions', icon: FileText },
  { label: 'Exams', href: '/teacher/exams', icon: BookOpen },
  { label: 'My Students', href: '/teacher/students', icon: Users },
  { label: 'Reports', href: '/teacher/reports', icon: BarChart3 },
  { label: 'Settings', href: '/teacher/settings', icon: Settings },
];
