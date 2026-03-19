import { 
  LayoutDashboard, 
  Users, 
  School, 
  BookOpen,
  HelpCircle, 
  FileText, 
  BarChart3, 
  Settings 
} from 'lucide-react';

// Shared navigation items for all teacher pages
export const teacherNavItems = [
  { label: 'Dashboard', href: '/teacher', icon: LayoutDashboard },
  { label: 'Students', href: '/teacher/students', icon: Users },
  { label: 'Classroom', href: '/teacher/classroom', icon: School },
  { label: 'Subjects', href: '/teacher/subjects', icon: BookOpen },
  { label: 'Questions', href: '/teacher/questions', icon: HelpCircle },
  { label: 'Exams', href: '/teacher/exams', icon: FileText },
  { label: 'Reports', href: '/teacher/reports', icon: BarChart3 },
  { label: 'Settings', href: '/teacher/settings', icon: Settings },
];
