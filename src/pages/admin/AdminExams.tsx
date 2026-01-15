import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { adminNavItems } from '@/config/adminNavItems';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  BookOpen, 
  Clock, 
  Users, 
  FileText,
  Wand2,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  Calendar,
  Target,
  Shuffle,
  Eye,
  Edit,
  Trash2,
  Copy,
  Play,
  Monitor,
  Shield,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import ExamMonitor from '@/components/exam/ExamMonitor';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for ALL subjects (admin sees everything)
const ALL_SUBJECTS = [
  { id: 'math', name: 'Mathematics' },
  { id: 'physics', name: 'Physics' },
  { id: 'chemistry', name: 'Chemistry' },
  { id: 'biology', name: 'Biology' },
  { id: 'english', name: 'English' },
  { id: 'history', name: 'History' },
];

// Mock data for ALL teachers
const ALL_TEACHERS = [
  { id: 'T001', name: 'John Smith', subjects: ['Mathematics', 'Physics'] },
  { id: 'T002', name: 'Jane Doe', subjects: ['Chemistry', 'Biology'] },
  { id: 'T003', name: 'Robert Brown', subjects: ['English', 'History'] },
  { id: 'T004', name: 'Emily Wilson', subjects: ['Mathematics'] },
];

// Mock data for ALL classes (admin sees all)
const ALL_CLASSES = [
  { id: 1, name: 'Grade 9th Math Class A', students: 32, subject: 'Mathematics', teacher: 'John Smith' },
  { id: 2, name: 'Grade 10th Math Class B', students: 28, subject: 'Mathematics', teacher: 'Emily Wilson' },
  { id: 3, name: 'Grade 9th Math Class C', students: 30, subject: 'Mathematics', teacher: 'John Smith' },
  { id: 4, name: 'Grade 10th Physics Class A', students: 25, subject: 'Physics', teacher: 'John Smith' },
  { id: 5, name: 'Grade 9th Chemistry Class A', students: 27, subject: 'Chemistry', teacher: 'Jane Doe' },
  { id: 6, name: 'Grade 10th Biology Class A', students: 24, subject: 'Biology', teacher: 'Jane Doe' },
  { id: 7, name: 'Grade 9th English Class A', students: 30, subject: 'English', teacher: 'Robert Brown' },
  { id: 8, name: 'Grade 10th History Class A', students: 26, subject: 'History', teacher: 'Robert Brown' },
];

// Mock questions from ALL question banks
const ALL_QUESTIONS = [
  { id: 'Q001', question: 'What is 2 + 2?', type: 'multiple_choice', difficulty: 'easy', topic: 'Arithmetic', chapter: 'Basic Operations', points: 5, subject: 'Mathematics', createdBy: 'John Smith' },
  { id: 'Q002', question: 'Solve for x: 2x + 5 = 15', type: 'fill_blank', difficulty: 'medium', topic: 'Algebra', chapter: 'Linear Equations', points: 10, subject: 'Mathematics', createdBy: 'Emily Wilson' },
  { id: 'Q003', question: 'What is the derivative of x²?', type: 'multiple_choice', difficulty: 'hard', topic: 'Calculus', chapter: 'Derivatives', points: 15, subject: 'Mathematics', createdBy: 'John Smith' },
  { id: 'Q004', question: 'Is π a rational number?', type: 'true_false', difficulty: 'easy', topic: 'Number Theory', chapter: 'Real Numbers', points: 5, subject: 'Mathematics', createdBy: 'Emily Wilson' },
  { id: 'Q005', question: 'Calculate the area of a circle with radius 5', type: 'fill_blank', difficulty: 'medium', topic: 'Geometry', chapter: 'Circles', points: 10, subject: 'Mathematics', createdBy: 'John Smith' },
  { id: 'Q006', question: 'What is Newton\'s First Law?', type: 'multiple_choice', difficulty: 'easy', topic: 'Mechanics', chapter: 'Laws of Motion', points: 5, subject: 'Physics', createdBy: 'John Smith' },
  { id: 'Q007', question: 'Calculate acceleration given F=10N and m=2kg', type: 'fill_blank', difficulty: 'medium', topic: 'Mechanics', chapter: 'Force', points: 10, subject: 'Physics', createdBy: 'John Smith' },
  { id: 'Q008', question: 'What is the atomic number of Carbon?', type: 'multiple_choice', difficulty: 'easy', topic: 'Elements', chapter: 'Periodic Table', points: 5, subject: 'Chemistry', createdBy: 'Jane Doe' },
  { id: 'Q009', question: 'What is photosynthesis?', type: 'writing', difficulty: 'medium', topic: 'Plant Biology', chapter: 'Cell Processes', points: 15, subject: 'Biology', createdBy: 'Jane Doe' },
];

// Mock ALL exams (admin sees all exams from all teachers)
const ALL_EXAMS = [
  { 
    id: 'E001', 
    title: 'Mid-Term Math Exam', 
    subject: 'Mathematics',
    class: 'Grade 9th Math Class A',
    teacher: 'John Smith',
    duration: 90,
    totalQuestions: 25,
    totalPoints: 100,
    passingMarks: 40,
    status: 'published',
    scheduledAt: '2025-01-20T09:00:00',
    createdAt: '2025-01-10'
  },
  { 
    id: 'E002', 
    title: 'Algebra Quiz', 
    subject: 'Mathematics',
    class: 'Grade 10th Math Class B',
    teacher: 'Emily Wilson',
    duration: 45,
    totalQuestions: 15,
    totalPoints: 50,
    passingMarks: 20,
    status: 'draft',
    scheduledAt: null,
    createdAt: '2025-01-12'
  },
  { 
    id: 'E003', 
    title: 'Geometry Test', 
    subject: 'Mathematics',
    class: 'Grade 9th Math Class C',
    teacher: 'John Smith',
    duration: 60,
    totalQuestions: 20,
    totalPoints: 75,
    passingMarks: 30,
    status: 'completed',
    scheduledAt: '2025-01-05T10:00:00',
    createdAt: '2025-01-01'
  },
  { 
    id: 'E004', 
    title: 'Physics Final Exam', 
    subject: 'Physics',
    class: 'Grade 10th Physics Class A',
    teacher: 'John Smith',
    duration: 120,
    totalQuestions: 40,
    totalPoints: 150,
    passingMarks: 60,
    status: 'ongoing',
    scheduledAt: '2025-01-15T14:00:00',
    createdAt: '2025-01-08'
  },
  { 
    id: 'E005', 
    title: 'Chemistry Basics Test', 
    subject: 'Chemistry',
    class: 'Grade 9th Chemistry Class A',
    teacher: 'Jane Doe',
    duration: 60,
    totalQuestions: 30,
    totalPoints: 100,
    passingMarks: 40,
    status: 'published',
    scheduledAt: '2025-01-22T10:00:00',
    createdAt: '2025-01-14'
  },
  { 
    id: 'E006', 
    title: 'Biology Mid-Term', 
    subject: 'Biology',
    class: 'Grade 10th Biology Class A',
    teacher: 'Jane Doe',
    duration: 90,
    totalQuestions: 35,
    totalPoints: 120,
    passingMarks: 48,
    status: 'draft',
    scheduledAt: null,
    createdAt: '2025-01-13'
  },
];

interface ExamFormData {
  title: string;
  description: string;
  subject: string;
  classId: string;
  teacherId: string;
  duration: number;
  passingMarks: number;
  scheduledDate: string;
  scheduledTime: string;
  shuffleQuestions: boolean;
  showResults: boolean;
  allowReview: boolean;
}

interface AutoBuilderConfig {
  easyCount: number;
  mediumCount: number;
  hardCount: number;
  topics: string[];
}

const AdminExams = () => {
  const { toast } = useToast();
  const [exams, setExams] = useState(ALL_EXAMS);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createMode, setCreateMode] = useState<'manual' | 'auto' | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [questionFilter, setQuestionFilter] = useState({ difficulty: 'all', topic: 'all', type: 'all', subject: 'all' });
  const [showMonitor, setShowMonitor] = useState(false);
  const [monitorExam, setMonitorExam] = useState<{ id: string; title: string } | null>(null);
  
  // Admin-specific filters
  const [examFilter, setExamFilter] = useState({ 
    search: '', 
    status: 'all', 
    subject: 'all', 
    teacher: 'all' 
  });
  
  const [formData, setFormData] = useState<ExamFormData>({
    title: '',
    description: '',
    subject: 'Mathematics',
    classId: '',
    teacherId: '',
    duration: 60,
    passingMarks: 40,
    scheduledDate: '',
    scheduledTime: '',
    shuffleQuestions: true,
    showResults: true,
    allowReview: true,
  });

  const [autoConfig, setAutoConfig] = useState<AutoBuilderConfig>({
    easyCount: 5,
    mediumCount: 10,
    hardCount: 5,
    topics: [],
  });

  const topics = [...new Set(ALL_QUESTIONS.map(q => q.topic))];
  const questionTypes = [...new Set(ALL_QUESTIONS.map(q => q.type))];

  // Filter exams based on admin filters
  const filteredExams = exams.filter(exam => {
    if (examFilter.search && !exam.title.toLowerCase().includes(examFilter.search.toLowerCase())) return false;
    if (examFilter.status !== 'all' && exam.status !== examFilter.status) return false;
    if (examFilter.subject !== 'all' && exam.subject !== examFilter.subject) return false;
    if (examFilter.teacher !== 'all' && exam.teacher !== examFilter.teacher) return false;
    return true;
  });

  const filteredQuestions = ALL_QUESTIONS.filter(q => {
    if (questionFilter.difficulty !== 'all' && q.difficulty !== questionFilter.difficulty) return false;
    if (questionFilter.topic !== 'all' && q.topic !== questionFilter.topic) return false;
    if (questionFilter.type !== 'all' && q.type !== questionFilter.type) return false;
    if (questionFilter.subject !== 'all' && q.subject !== questionFilter.subject) return false;
    return true;
  });

  const totalPoints = selectedQuestions.reduce((sum, qId) => {
    const q = ALL_QUESTIONS.find(q => q.id === qId);
    return sum + (q?.points || 0);
  }, 0);

  const handleQuestionToggle = (questionId: string) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleSelectAll = () => {
    if (selectedQuestions.length === filteredQuestions.length) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions(filteredQuestions.map(q => q.id));
    }
  };

  const handleAutoGenerate = () => {
    const subjectQuestions = ALL_QUESTIONS.filter(q => q.subject === formData.subject);
    
    const easyPool = subjectQuestions.filter(q => q.difficulty === 'easy');
    const mediumPool = subjectQuestions.filter(q => q.difficulty === 'medium');
    const hardPool = subjectQuestions.filter(q => q.difficulty === 'hard');
    
    const selectWithDuplicates = (pool: typeof ALL_QUESTIONS, count: number) => {
      const selected: string[] = [];
      for (let i = 0; i < count; i++) {
        if (pool.length > 0) {
          const randomIndex = Math.floor(Math.random() * pool.length);
          selected.push(pool[randomIndex].id);
        }
      }
      return selected;
    };
    
    const selectedEasy = selectWithDuplicates(easyPool, autoConfig.easyCount);
    const selectedMedium = selectWithDuplicates(mediumPool, autoConfig.mediumCount);
    const selectedHard = selectWithDuplicates(hardPool, autoConfig.hardCount);
    
    const allSelected = [...selectedEasy, ...selectedMedium, ...selectedHard];
    setSelectedQuestions(allSelected);
    
    const hasDuplicates = new Set(allSelected).size !== allSelected.length;
    
    toast({ 
      title: 'Questions Generated', 
      description: `${allSelected.length} questions selected automatically${hasDuplicates ? ' (includes duplicates)' : ''}` 
    });
    
    setCurrentStep(3);
  };

  const handleCreateExam = () => {
    const selectedTeacher = ALL_TEACHERS.find(t => t.id === formData.teacherId);
    const newExam = {
      id: `E${Date.now()}`,
      title: formData.title,
      subject: formData.subject,
      class: ALL_CLASSES.find(c => c.id.toString() === formData.classId)?.name || '',
      teacher: selectedTeacher?.name || 'Admin Created',
      duration: formData.duration,
      totalQuestions: selectedQuestions.length,
      totalPoints: totalPoints,
      passingMarks: formData.passingMarks,
      status: 'draft' as const,
      scheduledAt: formData.scheduledDate ? `${formData.scheduledDate}T${formData.scheduledTime}:00` : null,
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setExams([newExam, ...exams]);
    resetForm();
    setShowCreateDialog(false);
    
    toast({ 
      title: 'Exam Created', 
      description: `"${newExam.title}" has been created successfully` 
    });
  };

  const handleDeleteExam = (examId: string) => {
    setExams(exams.filter(e => e.id !== examId));
    toast({ title: 'Exam Deleted', description: 'The exam has been removed' });
  };

  const handlePublishExam = (examId: string) => {
    setExams(exams.map(e => e.id === examId ? { ...e, status: 'published' } : e));
    toast({ title: 'Exam Published', description: 'The exam is now live' });
  };

  const handleCancelExam = (examId: string) => {
    setExams(exams.map(e => e.id === examId ? { ...e, status: 'draft' } : e));
    toast({ title: 'Exam Cancelled', description: 'The exam has been unpublished' });
  };

  const resetForm = () => {
    setCreateMode(null);
    setCurrentStep(1);
    setSelectedQuestions([]);
    setFormData({
      title: '',
      description: '',
      subject: 'Mathematics',
      classId: '',
      teacherId: '',
      duration: 60,
      passingMarks: 40,
      scheduledDate: '',
      scheduledTime: '',
      shuffleQuestions: true,
      showResults: true,
      allowReview: true,
    });
    setAutoConfig({
      easyCount: 5,
      mediumCount: 10,
      hardCount: 5,
      topics: [],
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'published':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Published</Badge>;
      case 'ongoing':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Ongoing</Badge>;
      case 'completed':
        return <Badge variant="outline">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Easy</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Medium</Badge>;
      case 'hard':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Hard</Badge>;
      default:
        return <Badge>{difficulty}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const labels: Record<string, string> = {
      multiple_choice: 'MCQ',
      fill_blank: 'Fill Blank',
      true_false: 'T/F',
      writing: 'Writing',
      coding: 'Coding',
    };
    return <Badge variant="outline">{labels[type] || type}</Badge>;
  };

  // Stats cards for admin overview
  const stats = {
    total: exams.length,
    draft: exams.filter(e => e.status === 'draft').length,
    published: exams.filter(e => e.status === 'published').length,
    ongoing: exams.filter(e => e.status === 'ongoing').length,
    completed: exams.filter(e => e.status === 'completed').length,
  };

  const renderModeSelection = () => (
    <div className="space-y-6 py-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Choose Exam Creation Mode</h3>
        <p className="text-muted-foreground">Select how you want to create your exam</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card 
          className="cursor-pointer hover:border-primary transition-colors"
          onClick={() => { setCreateMode('manual'); setCurrentStep(1); }}
        >
          <CardHeader className="text-center">
            <FileText className="h-12 w-12 mx-auto text-primary mb-2" />
            <CardTitle>Manual Builder</CardTitle>
            <CardDescription>
              Manually select questions from any teacher's question bank
            </CardDescription>
          </CardHeader>
        </Card>
        <Card 
          className="cursor-pointer hover:border-primary transition-colors"
          onClick={() => { setCreateMode('auto'); setCurrentStep(1); }}
        >
          <CardHeader className="text-center">
            <Wand2 className="h-12 w-12 mx-auto text-primary mb-2" />
            <CardTitle>Auto Builder</CardTitle>
            <CardDescription>
              Set question counts by difficulty and auto-generate the exam
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Exam Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter exam title"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Select value={formData.subject} onValueChange={(v) => setFormData({ ...formData, subject: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ALL_SUBJECTS.map(subj => (
                <SelectItem key={subj.id} value={subj.name}>{subj.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter exam description or instructions"
          rows={3}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="teacher">Assign to Teacher</Label>
          <Select value={formData.teacherId} onValueChange={(v) => setFormData({ ...formData, teacherId: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select a teacher" />
            </SelectTrigger>
            <SelectContent>
              {ALL_TEACHERS.map(teacher => (
                <SelectItem key={teacher.id} value={teacher.id}>
                  {teacher.name} ({teacher.subjects.join(', ')})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="class">Assign to Class *</Label>
          <Select value={formData.classId} onValueChange={(v) => setFormData({ ...formData, classId: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {ALL_CLASSES.filter(cls => cls.subject === formData.subject).map(cls => (
                <SelectItem key={cls.id} value={cls.id.toString()}>
                  {cls.name} ({cls.students} students) - {cls.teacher}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes) *</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
            min={10}
            max={300}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="passingMarks">Passing Marks (%)</Label>
          <Input
            id="passingMarks"
            type="number"
            value={formData.passingMarks}
            onChange={(e) => setFormData({ ...formData, passingMarks: parseInt(e.target.value) || 40 })}
            min={0}
            max={100}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="scheduledDate">Schedule Date (Optional)</Label>
        <div className="flex gap-2">
          <Input
            id="scheduledDate"
            type="date"
            value={formData.scheduledDate}
            onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
          />
          <Input
            type="time"
            value={formData.scheduledTime}
            onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
          />
        </div>
      </div>
      <Separator />
      <div className="space-y-3">
        <Label>Exam Settings</Label>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="shuffle" 
            checked={formData.shuffleQuestions}
            onCheckedChange={(checked) => setFormData({ ...formData, shuffleQuestions: !!checked })}
          />
          <label htmlFor="shuffle" className="text-sm">Shuffle questions for each student</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="showResults" 
            checked={formData.showResults}
            onCheckedChange={(checked) => setFormData({ ...formData, showResults: !!checked })}
          />
          <label htmlFor="showResults" className="text-sm">Show results immediately after submission</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="allowReview" 
            checked={formData.allowReview}
            onCheckedChange={(checked) => setFormData({ ...formData, allowReview: !!checked })}
          />
          <label htmlFor="allowReview" className="text-sm">Allow students to review answers after exam</label>
        </div>
      </div>
    </div>
  );

  const renderStep2Manual = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Select value={questionFilter.subject} onValueChange={(v) => setQuestionFilter({ ...questionFilter, subject: v })}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {ALL_SUBJECTS.map(s => (
              <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={questionFilter.difficulty} onValueChange={(v) => setQuestionFilter({ ...questionFilter, difficulty: v })}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
        <Select value={questionFilter.topic} onValueChange={(v) => setQuestionFilter({ ...questionFilter, topic: v })}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Topic" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Topics</SelectItem>
            {topics.map(t => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={questionFilter.type} onValueChange={(v) => setQuestionFilter({ ...questionFilter, type: v })}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {questionTypes.map(t => (
              <SelectItem key={t} value={t}>{t.replace('_', ' ')}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox 
            checked={selectedQuestions.length === filteredQuestions.length && filteredQuestions.length > 0}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm text-muted-foreground">
            {selectedQuestions.length} selected | Total: {totalPoints} points
          </span>
        </div>
      </div>

      <ScrollArea className="h-[300px] border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuestions.map(question => (
              <TableRow key={question.id}>
                <TableCell>
                  <Checkbox 
                    checked={selectedQuestions.includes(question.id)}
                    onCheckedChange={() => handleQuestionToggle(question.id)}
                  />
                </TableCell>
                <TableCell className="max-w-[200px] truncate">{question.question}</TableCell>
                <TableCell>{question.subject}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{question.createdBy}</TableCell>
                <TableCell>{getTypeBadge(question.type)}</TableCell>
                <TableCell>{getDifficultyBadge(question.difficulty)}</TableCell>
                <TableCell>{question.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );

  const renderStep2Auto = () => (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Easy Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              value={autoConfig.easyCount}
              onChange={(e) => setAutoConfig({ ...autoConfig, easyCount: parseInt(e.target.value) || 0 })}
              min={0}
              max={50}
            />
            <p className="text-xs text-muted-foreground mt-1">5 points each</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">Medium Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              value={autoConfig.mediumCount}
              onChange={(e) => setAutoConfig({ ...autoConfig, mediumCount: parseInt(e.target.value) || 0 })}
              min={0}
              max={50}
            />
            <p className="text-xs text-muted-foreground mt-1">10 points each</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Hard Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              value={autoConfig.hardCount}
              onChange={(e) => setAutoConfig({ ...autoConfig, hardCount: parseInt(e.target.value) || 0 })}
              min={0}
              max={50}
            />
            <p className="text-xs text-muted-foreground mt-1">15 points each</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Estimated Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span>Total Questions:</span>
            <span className="font-bold">{autoConfig.easyCount + autoConfig.mediumCount + autoConfig.hardCount}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span>Estimated Points:</span>
            <span className="font-bold">
              {(autoConfig.easyCount * 5) + (autoConfig.mediumCount * 10) + (autoConfig.hardCount * 15)}
            </span>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleAutoGenerate} className="w-full">
        <Wand2 className="mr-2 h-4 w-4" />
        Generate Questions
      </Button>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Exam Summary</CardTitle>
          <CardDescription>Review your exam before creating</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">Title</Label>
              <p className="font-medium">{formData.title || 'Not set'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Subject</Label>
              <p className="font-medium">{formData.subject}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Assigned Teacher</Label>
              <p className="font-medium">{ALL_TEACHERS.find(t => t.id === formData.teacherId)?.name || 'Admin Created'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Class</Label>
              <p className="font-medium">
                {ALL_CLASSES.find(c => c.id.toString() === formData.classId)?.name || 'Not selected'}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Duration</Label>
              <p className="font-medium">{formData.duration} minutes</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Passing Marks</Label>
              <p className="font-medium">{formData.passingMarks}%</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Scheduled</Label>
              <p className="font-medium">
                {formData.scheduledDate ? `${formData.scheduledDate} at ${formData.scheduledTime}` : 'Not scheduled'}
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-3xl font-bold text-primary">{selectedQuestions.length}</p>
                <p className="text-sm text-muted-foreground">Questions</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-3xl font-bold text-primary">{totalPoints}</p>
                <p className="text-sm text-muted-foreground">Total Points</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-3xl font-bold text-primary">{Math.ceil(totalPoints * formData.passingMarks / 100)}</p>
                <p className="text-sm text-muted-foreground">Passing Score</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <DashboardLayout navItems={adminNavItems} role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              Exam Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage all exams across all teachers and subjects
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Exam
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft</CardTitle>
              <Edit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.draft}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.published}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ongoing</CardTitle>
              <Play className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.ongoing}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Check className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search exams..."
                    className="pl-9"
                    value={examFilter.search}
                    onChange={(e) => setExamFilter({ ...examFilter, search: e.target.value })}
                  />
                </div>
              </div>
              <Select value={examFilter.status} onValueChange={(v) => setExamFilter({ ...examFilter, status: v })}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={examFilter.subject} onValueChange={(v) => setExamFilter({ ...examFilter, subject: v })}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {ALL_SUBJECTS.map(s => (
                    <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={examFilter.teacher} onValueChange={(v) => setExamFilter({ ...examFilter, teacher: v })}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Teacher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teachers</SelectItem>
                  {ALL_TEACHERS.map(t => (
                    <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Exams Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Exams</CardTitle>
            <CardDescription>
              View and manage exams from all teachers across all subjects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exam Title</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExams.map(exam => (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">{exam.title}</TableCell>
                    <TableCell>{exam.subject}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                        {exam.teacher}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate">{exam.class}</TableCell>
                    <TableCell>{exam.totalQuestions}</TableCell>
                    <TableCell>{exam.duration} min</TableCell>
                    <TableCell>{getStatusBadge(exam.status)}</TableCell>
                    <TableCell>
                      {exam.scheduledAt 
                        ? new Date(exam.scheduledAt).toLocaleDateString()
                        : <span className="text-muted-foreground">Not scheduled</span>
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Exam
                          </DropdownMenuItem>
                          {(exam.status === 'published' || exam.status === 'ongoing') && (
                            <DropdownMenuItem onClick={() => {
                              setMonitorExam({ id: exam.id, title: exam.title });
                              setShowMonitor(true);
                            }}>
                              <Monitor className="mr-2 h-4 w-4" />
                              Monitor Session
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {exam.status === 'draft' && (
                            <DropdownMenuItem onClick={() => handlePublishExam(exam.id)}>
                              <Play className="mr-2 h-4 w-4" />
                              Publish Exam
                            </DropdownMenuItem>
                          )}
                          {exam.status === 'published' && (
                            <DropdownMenuItem onClick={() => handleCancelExam(exam.id)}>
                              <X className="mr-2 h-4 w-4" />
                              Unpublish
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Export Results
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteExam(exam.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Exam
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create Exam Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={(open) => { 
          setShowCreateDialog(open); 
          if (!open) resetForm(); 
        }}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {!createMode ? 'Create New Exam' : `Create Exam - Step ${currentStep} of 3`}
              </DialogTitle>
              <DialogDescription>
                {!createMode 
                  ? 'Choose how you want to create your exam'
                  : currentStep === 1 
                    ? 'Configure exam details and settings'
                    : currentStep === 2
                      ? 'Select questions for your exam'
                      : 'Review and create your exam'
                }
              </DialogDescription>
            </DialogHeader>

            {!createMode && renderModeSelection()}
            
            {createMode && currentStep === 1 && renderStep1()}
            {createMode && currentStep === 2 && createMode === 'manual' && renderStep2Manual()}
            {createMode && currentStep === 2 && createMode === 'auto' && renderStep2Auto()}
            {createMode && currentStep === 3 && renderStep3()}

            {createMode && (
              <DialogFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    if (currentStep === 1) {
                      setCreateMode(null);
                    } else {
                      setCurrentStep(currentStep - 1);
                    }
                  }}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                {currentStep < 3 ? (
                  <Button 
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={currentStep === 1 && (!formData.title || !formData.classId)}
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleCreateExam}
                    disabled={selectedQuestions.length === 0}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Create Exam
                  </Button>
                )}
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>

        {/* Exam Monitor Dialog */}
        {monitorExam && (
          <ExamMonitor 
            examId={monitorExam.id}
            examTitle={monitorExam.title}
            isOpen={showMonitor}
            onClose={() => {
              setShowMonitor(false);
              setMonitorExam(null);
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminExams;
