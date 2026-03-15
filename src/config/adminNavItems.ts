import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  FileText, 
  BarChart3, 
  Settings, 
  Bell,
  HelpCircle
} from 'lucide-react';

// Shared navigation items for all admin pages
export const adminNavItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Classes', href: '/admin/classes', icon: GraduationCap },
  { label: 'Subjects', href: '/admin/subjects', icon: BookOpen },
  { label: 'Question Bank', href: '/admin/questions', icon: HelpCircle },
  { label: 'Exams', href: '/admin/exams', icon: FileText },
  { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
  { label: 'Notifications', href: '/admin/notifications', icon: Bell },
];
