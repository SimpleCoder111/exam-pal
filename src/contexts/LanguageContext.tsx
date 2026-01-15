import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'zh' | 'km';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.refresh': 'Refresh',
    'common.loading': 'Loading...',
    'common.noData': 'No data available',
    'common.success': 'Success',
    'common.error': 'Error',
    'common.warning': 'Warning',
    'common.confirm': 'Confirm',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.submit': 'Submit',
    'common.reset': 'Reset',
    'common.close': 'Close',
    'common.view': 'View',
    'common.download': 'Download',
    'common.upload': 'Upload',
    'common.settings': 'Settings',
    'common.logout': 'Logout',
    'common.profile': 'Profile',
    'common.language': 'Language',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.exams': 'Exams',
    'nav.students': 'Students',
    'nav.teachers': 'Teachers',
    'nav.classes': 'Classes',
    'nav.subjects': 'Subjects',
    'nav.reports': 'Reports',
    'nav.settings': 'Settings',
    'nav.notifications': 'Notifications',
    'nav.users': 'Users',
    'nav.questionBank': 'Question Bank',
    'nav.classrooms': 'Classrooms',
    'nav.results': 'Results',
    
    // Auth
    'auth.login': 'Login',
    'auth.logout': 'Logout',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.rememberMe': 'Remember me',
    'auth.forgotPassword': 'Forgot password?',
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.welcomeBack': 'Welcome back',
    'auth.enterCredentials': 'Enter your credentials to access your account',
    
    // Dashboard
    'dashboard.welcome': 'Welcome',
    'dashboard.overview': 'Overview',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.upcomingExams': 'Upcoming Exams',
    'dashboard.totalStudents': 'Total Students',
    'dashboard.totalTeachers': 'Total Teachers',
    'dashboard.activeExams': 'Active Exams',
    'dashboard.completedExams': 'Completed Exams',
    'dashboard.averageScore': 'Average Score',
    'dashboard.passRate': 'Pass Rate',
    
    // Exams
    'exam.title': 'Exam Title',
    'exam.subject': 'Subject',
    'exam.duration': 'Duration',
    'exam.totalMarks': 'Total Marks',
    'exam.passingMarks': 'Passing Marks',
    'exam.startTime': 'Start Time',
    'exam.endTime': 'End Time',
    'exam.status': 'Status',
    'exam.createExam': 'Create Exam',
    'exam.editExam': 'Edit Exam',
    'exam.deleteExam': 'Delete Exam',
    'exam.viewExam': 'View Exam',
    'exam.startExam': 'Start Exam',
    'exam.submitExam': 'Submit Exam',
    'exam.questions': 'Questions',
    'exam.timeRemaining': 'Time Remaining',
    'exam.flagQuestion': 'Flag Question',
    'exam.nextQuestion': 'Next Question',
    'exam.previousQuestion': 'Previous Question',
    'exam.scheduled': 'Scheduled',
    'exam.inProgress': 'In Progress',
    'exam.completed': 'Completed',
    'exam.draft': 'Draft',
    
    // Students
    'student.name': 'Student Name',
    'student.id': 'Student ID',
    'student.class': 'Class',
    'student.email': 'Email',
    'student.phone': 'Phone',
    'student.enrollmentDate': 'Enrollment Date',
    'student.performance': 'Performance',
    'student.attendance': 'Attendance',
    
    // Teachers
    'teacher.name': 'Teacher Name',
    'teacher.id': 'Teacher ID',
    'teacher.department': 'Department',
    'teacher.subjects': 'Subjects',
    'teacher.assignedClasses': 'Assigned Classes',
    
    // Reports
    'reports.title': 'Reports',
    'reports.generate': 'Generate Report',
    'reports.examReport': 'Exam Report',
    'reports.studentReport': 'Student Report',
    'reports.classReport': 'Class Report',
    'reports.performanceAnalysis': 'Performance Analysis',
    'reports.dateRange': 'Date Range',
    'reports.exportPDF': 'Export PDF',
    'reports.exportExcel': 'Export Excel',
    
    // Settings
    'settings.general': 'General',
    'settings.security': 'Security',
    'settings.notifications': 'Notifications',
    'settings.branding': 'Branding',
    'settings.examDefaults': 'Exam Defaults',
    'settings.theme': 'Theme',
    'settings.darkMode': 'Dark Mode',
    'settings.lightMode': 'Light Mode',
    'settings.systemTheme': 'System Theme',
    
    // Notifications
    'notifications.title': 'Notifications',
    'notifications.markAsRead': 'Mark as Read',
    'notifications.markAllAsRead': 'Mark All as Read',
    'notifications.noNotifications': 'No notifications',
    'notifications.announcements': 'Announcements',
    'notifications.messages': 'Messages',
    'notifications.automationRules': 'Automation Rules',
  },
  zh: {
    // Common
    'common.save': '保存',
    'common.cancel': '取消',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.add': '添加',
    'common.search': '搜索',
    'common.filter': '筛选',
    'common.export': '导出',
    'common.import': '导入',
    'common.refresh': '刷新',
    'common.loading': '加载中...',
    'common.noData': '暂无数据',
    'common.success': '成功',
    'common.error': '错误',
    'common.warning': '警告',
    'common.confirm': '确认',
    'common.back': '返回',
    'common.next': '下一步',
    'common.previous': '上一步',
    'common.submit': '提交',
    'common.reset': '重置',
    'common.close': '关闭',
    'common.view': '查看',
    'common.download': '下载',
    'common.upload': '上传',
    'common.settings': '设置',
    'common.logout': '退出登录',
    'common.profile': '个人资料',
    'common.language': '语言',
    
    // Navigation
    'nav.dashboard': '仪表盘',
    'nav.exams': '考试',
    'nav.students': '学生',
    'nav.teachers': '教师',
    'nav.classes': '班级',
    'nav.subjects': '科目',
    'nav.reports': '报告',
    'nav.settings': '设置',
    'nav.notifications': '通知',
    'nav.users': '用户',
    'nav.questionBank': '题库',
    'nav.classrooms': '教室',
    'nav.results': '成绩',
    
    // Auth
    'auth.login': '登录',
    'auth.logout': '退出',
    'auth.email': '邮箱',
    'auth.password': '密码',
    'auth.rememberMe': '记住我',
    'auth.forgotPassword': '忘记密码？',
    'auth.signIn': '登录',
    'auth.signUp': '注册',
    'auth.welcomeBack': '欢迎回来',
    'auth.enterCredentials': '请输入您的凭据以访问您的账户',
    
    // Dashboard
    'dashboard.welcome': '欢迎',
    'dashboard.overview': '概览',
    'dashboard.recentActivity': '最近活动',
    'dashboard.upcomingExams': '即将进行的考试',
    'dashboard.totalStudents': '学生总数',
    'dashboard.totalTeachers': '教师总数',
    'dashboard.activeExams': '进行中的考试',
    'dashboard.completedExams': '已完成的考试',
    'dashboard.averageScore': '平均分',
    'dashboard.passRate': '通过率',
    
    // Exams
    'exam.title': '考试标题',
    'exam.subject': '科目',
    'exam.duration': '时长',
    'exam.totalMarks': '总分',
    'exam.passingMarks': '及格分',
    'exam.startTime': '开始时间',
    'exam.endTime': '结束时间',
    'exam.status': '状态',
    'exam.createExam': '创建考试',
    'exam.editExam': '编辑考试',
    'exam.deleteExam': '删除考试',
    'exam.viewExam': '查看考试',
    'exam.startExam': '开始考试',
    'exam.submitExam': '提交考试',
    'exam.questions': '题目',
    'exam.timeRemaining': '剩余时间',
    'exam.flagQuestion': '标记问题',
    'exam.nextQuestion': '下一题',
    'exam.previousQuestion': '上一题',
    'exam.scheduled': '已安排',
    'exam.inProgress': '进行中',
    'exam.completed': '已完成',
    'exam.draft': '草稿',
    
    // Students
    'student.name': '学生姓名',
    'student.id': '学号',
    'student.class': '班级',
    'student.email': '邮箱',
    'student.phone': '电话',
    'student.enrollmentDate': '入学日期',
    'student.performance': '成绩表现',
    'student.attendance': '出勤率',
    
    // Teachers
    'teacher.name': '教师姓名',
    'teacher.id': '工号',
    'teacher.department': '部门',
    'teacher.subjects': '教授科目',
    'teacher.assignedClasses': '负责班级',
    
    // Reports
    'reports.title': '报告',
    'reports.generate': '生成报告',
    'reports.examReport': '考试报告',
    'reports.studentReport': '学生报告',
    'reports.classReport': '班级报告',
    'reports.performanceAnalysis': '成绩分析',
    'reports.dateRange': '日期范围',
    'reports.exportPDF': '导出PDF',
    'reports.exportExcel': '导出Excel',
    
    // Settings
    'settings.general': '通用',
    'settings.security': '安全',
    'settings.notifications': '通知',
    'settings.branding': '品牌',
    'settings.examDefaults': '考试默认设置',
    'settings.theme': '主题',
    'settings.darkMode': '深色模式',
    'settings.lightMode': '浅色模式',
    'settings.systemTheme': '跟随系统',
    
    // Notifications
    'notifications.title': '通知',
    'notifications.markAsRead': '标记为已读',
    'notifications.markAllAsRead': '全部标记为已读',
    'notifications.noNotifications': '暂无通知',
    'notifications.announcements': '公告',
    'notifications.messages': '消息',
    'notifications.automationRules': '自动化规则',
  },
  km: {
    // Common
    'common.save': 'រក្សាទុក',
    'common.cancel': 'បោះបង់',
    'common.delete': 'លុប',
    'common.edit': 'កែសម្រួល',
    'common.add': 'បន្ថែម',
    'common.search': 'ស្វែងរក',
    'common.filter': 'តម្រង',
    'common.export': 'នាំចេញ',
    'common.import': 'នាំចូល',
    'common.refresh': 'ធ្វើឱ្យស្រស់',
    'common.loading': 'កំពុងផ្ទុក...',
    'common.noData': 'គ្មានទិន្នន័យ',
    'common.success': 'ជោគជ័យ',
    'common.error': 'កំហុស',
    'common.warning': 'ការព្រមាន',
    'common.confirm': 'បញ្ជាក់',
    'common.back': 'ថយក្រោយ',
    'common.next': 'បន្ទាប់',
    'common.previous': 'មុន',
    'common.submit': 'ដាក់ស្នើ',
    'common.reset': 'កំណត់ឡើងវិញ',
    'common.close': 'បិទ',
    'common.view': 'មើល',
    'common.download': 'ទាញយក',
    'common.upload': 'ផ្ទុកឡើង',
    'common.settings': 'ការកំណត់',
    'common.logout': 'ចាកចេញ',
    'common.profile': 'ប្រវត្តិរូប',
    'common.language': 'ភាសា',
    
    // Navigation
    'nav.dashboard': 'ផ្ទាំងគ្រប់គ្រង',
    'nav.exams': 'ការប្រឡង',
    'nav.students': 'សិស្ស',
    'nav.teachers': 'គ្រូ',
    'nav.classes': 'ថ្នាក់រៀន',
    'nav.subjects': 'មុខវិជ្ជា',
    'nav.reports': 'របាយការណ៍',
    'nav.settings': 'ការកំណត់',
    'nav.notifications': 'ការជូនដំណឹង',
    'nav.users': 'អ្នកប្រើប្រាស់',
    'nav.questionBank': 'ធនាគារសំណួរ',
    'nav.classrooms': 'បន្ទប់រៀន',
    'nav.results': 'លទ្ធផល',
    
    // Auth
    'auth.login': 'ចូល',
    'auth.logout': 'ចាកចេញ',
    'auth.email': 'អ៊ីមែល',
    'auth.password': 'ពាក្យសម្ងាត់',
    'auth.rememberMe': 'ចងចាំខ្ញុំ',
    'auth.forgotPassword': 'ភ្លេចពាក្យសម្ងាត់?',
    'auth.signIn': 'ចូល',
    'auth.signUp': 'ចុះឈ្មោះ',
    'auth.welcomeBack': 'សូមស្វាគមន៍មកវិញ',
    'auth.enterCredentials': 'បញ្ចូលព័ត៌មានសម្គាល់របស់អ្នកដើម្បីចូលប្រើគណនី',
    
    // Dashboard
    'dashboard.welcome': 'សូមស្វាគមន៍',
    'dashboard.overview': 'ទិដ្ឋភាពទូទៅ',
    'dashboard.recentActivity': 'សកម្មភាពថ្មីៗ',
    'dashboard.upcomingExams': 'ការប្រឡងខាងមុខ',
    'dashboard.totalStudents': 'សិស្សសរុប',
    'dashboard.totalTeachers': 'គ្រូសរុប',
    'dashboard.activeExams': 'ការប្រឡងកំពុងដំណើរការ',
    'dashboard.completedExams': 'ការប្រឡងបានបញ្ចប់',
    'dashboard.averageScore': 'ពិន្ទុមធ្យម',
    'dashboard.passRate': 'អត្រាជាប់',
    
    // Exams
    'exam.title': 'ចំណងជើងប្រឡង',
    'exam.subject': 'មុខវិជ្ជា',
    'exam.duration': 'រយៈពេល',
    'exam.totalMarks': 'ពិន្ទុសរុប',
    'exam.passingMarks': 'ពិន្ទុជាប់',
    'exam.startTime': 'ពេលចាប់ផ្តើម',
    'exam.endTime': 'ពេលបញ្ចប់',
    'exam.status': 'ស្ថានភាព',
    'exam.createExam': 'បង្កើតការប្រឡង',
    'exam.editExam': 'កែការប្រឡង',
    'exam.deleteExam': 'លុបការប្រឡង',
    'exam.viewExam': 'មើលការប្រឡង',
    'exam.startExam': 'ចាប់ផ្តើមប្រឡង',
    'exam.submitExam': 'ដាក់ស្នើប្រឡង',
    'exam.questions': 'សំណួរ',
    'exam.timeRemaining': 'ពេលវេលានៅសល់',
    'exam.flagQuestion': 'សម្គាល់សំណួរ',
    'exam.nextQuestion': 'សំណួរបន្ទាប់',
    'exam.previousQuestion': 'សំណួរមុន',
    'exam.scheduled': 'បានកំណត់កាលវិភាគ',
    'exam.inProgress': 'កំពុងដំណើរការ',
    'exam.completed': 'បានបញ្ចប់',
    'exam.draft': 'ព្រាង',
    
    // Students
    'student.name': 'ឈ្មោះសិស្ស',
    'student.id': 'លេខសម្គាល់សិស្ស',
    'student.class': 'ថ្នាក់',
    'student.email': 'អ៊ីមែល',
    'student.phone': 'ទូរស័ព្ទ',
    'student.enrollmentDate': 'កាលបរិច្ឆេទចុះឈ្មោះ',
    'student.performance': 'សមត្ថភាព',
    'student.attendance': 'វត្តមាន',
    
    // Teachers
    'teacher.name': 'ឈ្មោះគ្រូ',
    'teacher.id': 'លេខសម្គាល់គ្រូ',
    'teacher.department': 'ផ្នែក',
    'teacher.subjects': 'មុខវិជ្ជាបង្រៀន',
    'teacher.assignedClasses': 'ថ្នាក់ទទួលខុសត្រូវ',
    
    // Reports
    'reports.title': 'របាយការណ៍',
    'reports.generate': 'បង្កើតរបាយការណ៍',
    'reports.examReport': 'របាយការណ៍ប្រឡង',
    'reports.studentReport': 'របាយការណ៍សិស្ស',
    'reports.classReport': 'របាយការណ៍ថ្នាក់',
    'reports.performanceAnalysis': 'ការវិភាគសមត្ថភាព',
    'reports.dateRange': 'ជួរកាលបរិច្ឆេទ',
    'reports.exportPDF': 'នាំចេញ PDF',
    'reports.exportExcel': 'នាំចេញ Excel',
    
    // Settings
    'settings.general': 'ទូទៅ',
    'settings.security': 'សុវត្ថិភាព',
    'settings.notifications': 'ការជូនដំណឹង',
    'settings.branding': 'ម៉ាកយីហោ',
    'settings.examDefaults': 'ការកំណត់ប្រឡងលំនាំដើម',
    'settings.theme': 'រូបរាង',
    'settings.darkMode': 'របៀបងងឹត',
    'settings.lightMode': 'របៀបភ្លឺ',
    'settings.systemTheme': 'តាមប្រព័ន្ធ',
    
    // Notifications
    'notifications.title': 'ការជូនដំណឹង',
    'notifications.markAsRead': 'សម្គាល់ថាបានអាន',
    'notifications.markAllAsRead': 'សម្គាល់ទាំងអស់ថាបានអាន',
    'notifications.noNotifications': 'គ្មានការជូនដំណឹង',
    'notifications.announcements': 'សេចក្តីប្រកាស',
    'notifications.messages': 'សារ',
    'notifications.automationRules': 'ច្បាប់ស្វ័យប្រវត្តិ',
  },
};

const languageNames: Record<Language, string> = {
  en: 'English',
  zh: '中文',
  km: 'ខ្មែរ',
};

export const getLanguageName = (lang: Language): string => languageNames[lang];
export const getAvailableLanguages = (): Language[] => ['en', 'zh', 'km'];

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app-language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('app-language', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
