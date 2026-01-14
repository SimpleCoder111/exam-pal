import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { teacherNavItems } from '@/config/teacherNavItems';
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
  Monitor
} from 'lucide-react';
import ExamMonitor from '@/components/exam/ExamMonitor';
import { useToast } from '@/hooks/use-toast';

// Mock data for teacher's subjects
const TEACHER_SUBJECTS = [
  { id: 'math', name: 'Mathematics' },
  { id: 'physics', name: 'Physics' },
];

// Mock data for classes
const MOCK_CLASSES = [
  { id: 1, name: 'Grade 9th Math Class A', students: 32, subject: 'Mathematics' },
  { id: 2, name: 'Grade 10th Math Class B', students: 28, subject: 'Mathematics' },
  { id: 3, name: 'Grade 9th Math Class C', students: 30, subject: 'Mathematics' },
  { id: 4, name: 'Grade 10th Physics Class A', students: 25, subject: 'Physics' },
];

// Mock questions from question bank (with subject)
const MOCK_QUESTIONS = [
  { id: 'Q001', question: 'What is 2 + 2?', type: 'multiple_choice', difficulty: 'easy', topic: 'Arithmetic', chapter: 'Basic Operations', points: 5, subject: 'Mathematics' },
  { id: 'Q002', question: 'Solve for x: 2x + 5 = 15', type: 'fill_blank', difficulty: 'medium', topic: 'Algebra', chapter: 'Linear Equations', points: 10, subject: 'Mathematics' },
  { id: 'Q003', question: 'What is the derivative of x²?', type: 'multiple_choice', difficulty: 'hard', topic: 'Calculus', chapter: 'Derivatives', points: 15, subject: 'Mathematics' },
  { id: 'Q004', question: 'Is π a rational number?', type: 'true_false', difficulty: 'easy', topic: 'Number Theory', chapter: 'Real Numbers', points: 5, subject: 'Mathematics' },
  { id: 'Q005', question: 'Calculate the area of a circle with radius 5', type: 'fill_blank', difficulty: 'medium', topic: 'Geometry', chapter: 'Circles', points: 10, subject: 'Mathematics' },
  { id: 'Q006', question: 'What is the quadratic formula?', type: 'multiple_choice', difficulty: 'medium', topic: 'Algebra', chapter: 'Quadratic Equations', points: 10, subject: 'Mathematics' },
  { id: 'Q007', question: 'Prove that √2 is irrational', type: 'writing', difficulty: 'hard', topic: 'Number Theory', chapter: 'Proofs', points: 20, subject: 'Mathematics' },
  { id: 'Q008', question: 'What is 15% of 200?', type: 'fill_blank', difficulty: 'easy', topic: 'Arithmetic', chapter: 'Percentages', points: 5, subject: 'Mathematics' },
  { id: 'Q009', question: 'The sum of angles in a triangle is 180°', type: 'true_false', difficulty: 'easy', topic: 'Geometry', chapter: 'Triangles', points: 5, subject: 'Mathematics' },
  { id: 'Q010', question: 'Find the integral of 3x² dx', type: 'multiple_choice', difficulty: 'hard', topic: 'Calculus', chapter: 'Integration', points: 15, subject: 'Mathematics' },
  { id: 'Q011', question: 'What is Newton\'s First Law?', type: 'multiple_choice', difficulty: 'easy', topic: 'Mechanics', chapter: 'Laws of Motion', points: 5, subject: 'Physics' },
  { id: 'Q012', question: 'Calculate acceleration given F=10N and m=2kg', type: 'fill_blank', difficulty: 'medium', topic: 'Mechanics', chapter: 'Force', points: 10, subject: 'Physics' },
  { id: 'Q013', question: 'Energy can neither be created nor destroyed', type: 'true_false', difficulty: 'easy', topic: 'Energy', chapter: 'Conservation', points: 5, subject: 'Physics' },
];

// Mock existing exams
const MOCK_EXAMS = [
  { 
    id: 'E001', 
    title: 'Mid-Term Math Exam', 
    subject: 'Mathematics',
    class: 'Grade 9th Math Class A',
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
    duration: 60,
    totalQuestions: 20,
    totalPoints: 75,
    passingMarks: 30,
    status: 'completed',
    scheduledAt: '2025-01-05T10:00:00',
    createdAt: '2025-01-01'
  },
];

interface ExamFormData {
  title: string;
  description: string;
  subject: string;
  classId: string;
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

const TeacherExams = () => {
  const { toast } = useToast();
  const [exams, setExams] = useState(MOCK_EXAMS);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createMode, setCreateMode] = useState<'manual' | 'auto' | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [questionFilter, setQuestionFilter] = useState({ difficulty: 'all', topic: 'all', type: 'all' });
  const [showMonitor, setShowMonitor] = useState(false);
  const [monitorExam, setMonitorExam] = useState<{ id: string; title: string } | null>(null);
  
  const [formData, setFormData] = useState<ExamFormData>({
    title: '',
    description: '',
    subject: 'Mathematics',
    classId: '',
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

  const topics = [...new Set(MOCK_QUESTIONS.map(q => q.topic))];
  const questionTypes = [...new Set(MOCK_QUESTIONS.map(q => q.type))];

  const filteredQuestions = MOCK_QUESTIONS.filter(q => {
    if (questionFilter.difficulty !== 'all' && q.difficulty !== questionFilter.difficulty) return false;
    if (questionFilter.topic !== 'all' && q.topic !== questionFilter.topic) return false;
    if (questionFilter.type !== 'all' && q.type !== questionFilter.type) return false;
    return true;
  });

  const totalPoints = selectedQuestions.reduce((sum, qId) => {
    const q = MOCK_QUESTIONS.find(q => q.id === qId);
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
    // Filter questions by selected subject
    const subjectQuestions = MOCK_QUESTIONS.filter(q => q.subject === formData.subject);
    
    const easyPool = subjectQuestions.filter(q => q.difficulty === 'easy');
    const mediumPool = subjectQuestions.filter(q => q.difficulty === 'medium');
    const hardPool = subjectQuestions.filter(q => q.difficulty === 'hard');
    
    // Helper to select questions with potential duplicates
    const selectWithDuplicates = (pool: typeof MOCK_QUESTIONS, count: number) => {
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
    
    setCurrentStep(3); // Move to review step
  };

  const handleCreateExam = () => {
    const newExam = {
      id: `E${Date.now()}`,
      title: formData.title,
      subject: formData.subject,
      class: MOCK_CLASSES.find(c => c.id.toString() === formData.classId)?.name || '',
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
    // TODO: API call to create exam with selected questions
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
        return <Badge className="bg-blue-100 text-blue-800">Published</Badge>;
      case 'ongoing':
        return <Badge className="bg-green-100 text-green-800">Ongoing</Badge>;
      case 'completed':
        return <Badge variant="outline">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return <Badge className="bg-green-100 text-green-800">Easy</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'hard':
        return <Badge className="bg-red-100 text-red-800">Hard</Badge>;
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
              Manually select questions from your question bank and customize every detail
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
              Set question counts by difficulty and let the system randomly generate the exam
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );

  const renderManualStep1 = () => (
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
              <SelectItem value="Mathematics">Mathematics</SelectItem>
              <SelectItem value="Physics">Physics</SelectItem>
              <SelectItem value="Chemistry">Chemistry</SelectItem>
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
          <Label htmlFor="class">Assign to Class *</Label>
          <Select value={formData.classId} onValueChange={(v) => setFormData({ ...formData, classId: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_CLASSES.map(cls => (
                <SelectItem key={cls.id} value={cls.id.toString()}>
                  {cls.name} ({cls.students} students)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
      </div>
      <div className="grid gap-4 md:grid-cols-2">
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

  const renderManualStep2 = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        <Select value={questionFilter.difficulty} onValueChange={(v) => setQuestionFilter({ ...questionFilter, difficulty: v })}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
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
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
            <SelectItem value="fill_blank">Fill in the Blank</SelectItem>
            <SelectItem value="true_false">True/False</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={handleSelectAll}>
          {selectedQuestions.length === filteredQuestions.length ? 'Deselect All' : 'Select All'}
        </Button>
      </div>

      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
        <span className="text-sm font-medium">
          Selected: {selectedQuestions.length} questions | Total Points: {totalPoints}
        </span>
      </div>

      <ScrollArea className="h-[350px] border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuestions.map((q) => (
              <TableRow key={q.id} className={selectedQuestions.includes(q.id) ? 'bg-primary/5' : ''}>
                <TableCell>
                  <Checkbox 
                    checked={selectedQuestions.includes(q.id)}
                    onCheckedChange={() => handleQuestionToggle(q.id)}
                  />
                </TableCell>
                <TableCell className="font-medium max-w-[300px] truncate">{q.question}</TableCell>
                <TableCell>{getTypeBadge(q.type)}</TableCell>
                <TableCell>{getDifficultyBadge(q.difficulty)}</TableCell>
                <TableCell>{q.topic}</TableCell>
                <TableCell>{q.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );

  const renderAutoStep1 = () => {
    // Filter questions by selected subject
    const subjectQuestions = formData.subject 
      ? MOCK_QUESTIONS.filter(q => q.subject === formData.subject)
      : [];
    
    const availableEasy = subjectQuestions.filter(q => q.difficulty === 'easy').length;
    const availableMedium = subjectQuestions.filter(q => q.difficulty === 'medium').length;
    const availableHard = subjectQuestions.filter(q => q.difficulty === 'hard').length;
    
    const easyDuplicateWarning = autoConfig.easyCount > availableEasy;
    const mediumDuplicateWarning = autoConfig.mediumCount > availableMedium;
    const hardDuplicateWarning = autoConfig.hardCount > availableHard;
    
    // Filter classes by selected subject
    const subjectClasses = formData.subject 
      ? MOCK_CLASSES.filter(c => c.subject === formData.subject)
      : [];

    return (
      <div className="space-y-6">
        {/* Subject Selection - Must be first */}
        <div className="space-y-2">
          <Label htmlFor="autoSubject" className="text-base font-semibold">Select Subject *</Label>
          <p className="text-sm text-muted-foreground mb-2">
            Choose the subject for this exam. Questions will be pulled from your question bank for this subject.
          </p>
          <Select 
            value={formData.subject} 
            onValueChange={(v) => {
              setFormData({ ...formData, subject: v, classId: '' });
              // Reset counts when subject changes
              setAutoConfig({ ...autoConfig, easyCount: 0, mediumCount: 0, hardCount: 0 });
            }}
          >
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Select your subject" />
            </SelectTrigger>
            <SelectContent>
              {TEACHER_SUBJECTS.map(subject => (
                <SelectItem key={subject.id} value={subject.name}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {formData.subject && (
          <>
            <Separator />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="autoTitle">Exam Title *</Label>
                <Input
                  id="autoTitle"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter exam title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="autoClass">Assign to Class *</Label>
                <Select value={formData.classId} onValueChange={(v) => setFormData({ ...formData, classId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectClasses.map(cls => (
                      <SelectItem key={cls.id} value={cls.id.toString()}>
                        {cls.name} ({cls.students} students)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="autoDuration">Duration (minutes) *</Label>
                <Input
                  id="autoDuration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
                  min={10}
                  max={300}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="autoPassingMarks">Passing Marks (%)</Label>
                <Input
                  id="autoPassingMarks"
                  type="number"
                  value={formData.passingMarks}
                  onChange={(e) => setFormData({ ...formData, passingMarks: parseInt(e.target.value) || 40 })}
                  min={0}
                  max={100}
                />
              </div>
            </div>
            <Separator />
            <div>
              <Label className="text-base font-semibold">Question Distribution</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Set the number of questions for each difficulty level from your {formData.subject} question bank
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                {/* Easy Questions Card - Dark mode friendly */}
                <Card className="border-emerald-500/50 bg-emerald-500/10 dark:bg-emerald-950/40 dark:border-emerald-400/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-emerald-700 dark:text-emerald-400 flex items-center justify-between">
                      Easy Questions
                      <Badge variant="outline" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-300 dark:border-emerald-600">
                        {availableEasy} available
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      type="number"
                      value={autoConfig.easyCount}
                      onChange={(e) => setAutoConfig({ ...autoConfig, easyCount: parseInt(e.target.value) || 0 })}
                      min={0}
                      max={50}
                      className="text-center text-lg font-bold"
                    />
                    {easyDuplicateWarning && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 text-center font-medium">
                        ⚠️ Will include duplicate questions
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Medium Questions Card - Dark mode friendly */}
                <Card className="border-amber-500/50 bg-amber-500/10 dark:bg-amber-950/40 dark:border-amber-400/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-amber-700 dark:text-amber-400 flex items-center justify-between">
                      Medium Questions
                      <Badge variant="outline" className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border-amber-300 dark:border-amber-600">
                        {availableMedium} available
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      type="number"
                      value={autoConfig.mediumCount}
                      onChange={(e) => setAutoConfig({ ...autoConfig, mediumCount: parseInt(e.target.value) || 0 })}
                      min={0}
                      max={50}
                      className="text-center text-lg font-bold"
                    />
                    {mediumDuplicateWarning && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 text-center font-medium">
                        ⚠️ Will include duplicate questions
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Hard Questions Card - Dark mode friendly */}
                <Card className="border-rose-500/50 bg-rose-500/10 dark:bg-rose-950/40 dark:border-rose-400/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-rose-700 dark:text-rose-400 flex items-center justify-between">
                      Hard Questions
                      <Badge variant="outline" className="bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 border-rose-300 dark:border-rose-600">
                        {availableHard} available
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      type="number"
                      value={autoConfig.hardCount}
                      onChange={(e) => setAutoConfig({ ...autoConfig, hardCount: parseInt(e.target.value) || 0 })}
                      min={0}
                      max={50}
                      className="text-center text-lg font-bold"
                    />
                    {hardDuplicateWarning && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 text-center font-medium">
                        ⚠️ Will include duplicate questions
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
              <div className="mt-4 p-3 bg-muted rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span className="text-sm font-medium">
                  Total Questions: {autoConfig.easyCount + autoConfig.mediumCount + autoConfig.hardCount}
                </span>
                <div className="flex flex-wrap gap-2">
                  {(easyDuplicateWarning || mediumDuplicateWarning || hardDuplicateWarning) && (
                    <Badge variant="outline" className="text-amber-600 dark:text-amber-400 border-amber-400">
                      Some duplicates may occur
                    </Badge>
                  )}
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Shuffle className="h-3 w-3" />
                    Randomized for each student
                  </Badge>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderReviewStep = () => {
    const selectedClass = MOCK_CLASSES.find(c => c.id.toString() === formData.classId);
    const selectedQs = MOCK_QUESTIONS.filter(q => selectedQuestions.includes(q.id));
    
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Exam Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Title</p>
                <p className="font-medium">{formData.title || 'Untitled Exam'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Class</p>
                <p className="font-medium">{selectedClass?.name || 'Not selected'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{formData.duration} minutes</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Passing Marks</p>
                <p className="font-medium">{formData.passingMarks}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Questions</p>
                <p className="font-medium">{selectedQuestions.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p className="font-medium">{totalPoints}</p>
              </div>
            </div>
            {formData.scheduledDate && (
              <div>
                <p className="text-sm text-muted-foreground">Scheduled At</p>
                <p className="font-medium">{formData.scheduledDate} {formData.scheduledTime}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Question Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 mb-4">
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-700">
                  {selectedQs.filter(q => q.difficulty === 'easy').length}
                </p>
                <p className="text-sm text-green-600">Easy</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-yellow-700">
                  {selectedQs.filter(q => q.difficulty === 'medium').length}
                </p>
                <p className="text-sm text-yellow-600">Medium</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-red-700">
                  {selectedQs.filter(q => q.difficulty === 'hard').length}
                </p>
                <p className="text-sm text-red-600">Hard</p>
              </div>
            </div>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {selectedQs.map((q, idx) => (
                  <div key={q.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">
                      <span className="font-medium mr-2">{idx + 1}.</span>
                      {q.question}
                    </span>
                    <div className="flex items-center gap-2">
                      {getDifficultyBadge(q.difficulty)}
                      <span className="text-sm text-muted-foreground">{q.points} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    );
  };

  const canProceed = () => {
    if (createMode === 'manual') {
      if (currentStep === 1) return formData.title && formData.classId;
      if (currentStep === 2) return selectedQuestions.length > 0;
    }
    if (createMode === 'auto') {
      if (currentStep === 1) return formData.title && formData.classId && (autoConfig.easyCount + autoConfig.mediumCount + autoConfig.hardCount) > 0;
    }
    return true;
  };

  return (
    <DashboardLayout navItems={teacherNavItems} role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Exams</h1>
            <p className="text-muted-foreground">
              Create, manage, and schedule exams for your classes
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Exam
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{exams.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{exams.filter(e => e.status === 'published').length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{exams.filter(e => e.status === 'draft').length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Check className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{exams.filter(e => e.status === 'completed').length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Exams Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Exams</CardTitle>
            <CardDescription>Manage your created exams</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Total Points</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">{exam.title}</TableCell>
                    <TableCell>{exam.class}</TableCell>
                    <TableCell>{exam.totalQuestions}</TableCell>
                    <TableCell>{exam.duration} min</TableCell>
                    <TableCell>{exam.totalPoints}</TableCell>
                    <TableCell>{getStatusBadge(exam.status)}</TableCell>
                    <TableCell>
                      {exam.scheduledAt 
                        ? new Date(exam.scheduledAt).toLocaleDateString() 
                        : <span className="text-muted-foreground">Not scheduled</span>
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {(exam.status === 'published' || exam.status === 'ongoing') && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setMonitorExam({ id: exam.id, title: exam.title });
                              setShowMonitor(true);
                            }}
                            title="Monitor Exam"
                          >
                            <Monitor className="h-4 w-4 text-primary" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
                {!createMode ? 'Create New Exam' : 
                 createMode === 'manual' ? 'Manual Exam Builder' : 'Auto Exam Builder'}
              </DialogTitle>
              <DialogDescription>
                {!createMode 
                  ? 'Choose how you want to create your exam'
                  : createMode === 'manual' 
                    ? `Step ${currentStep} of 3: ${currentStep === 1 ? 'Exam Details' : currentStep === 2 ? 'Select Questions' : 'Review & Create'}`
                    : `Step ${currentStep} of 2: ${currentStep === 1 ? 'Configuration' : 'Review & Create'}`
                }
              </DialogDescription>
            </DialogHeader>

            {!createMode && renderModeSelection()}

            {createMode === 'manual' && currentStep === 1 && renderManualStep1()}
            {createMode === 'manual' && currentStep === 2 && renderManualStep2()}
            {createMode === 'manual' && currentStep === 3 && renderReviewStep()}

            {createMode === 'auto' && currentStep === 1 && renderAutoStep1()}
            {createMode === 'auto' && currentStep === 2 && renderReviewStep()}

            {createMode && (
              <DialogFooter className="flex justify-between sm:justify-between">
                <div>
                  {currentStep > 1 && (
                    <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                  )}
                  {currentStep === 1 && (
                    <Button variant="ghost" onClick={resetForm}>
                      Change Mode
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => { setShowCreateDialog(false); resetForm(); }}>
                    Cancel
                  </Button>
                  {createMode === 'manual' && currentStep < 3 && (
                    <Button onClick={() => setCurrentStep(currentStep + 1)} disabled={!canProceed()}>
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                  {createMode === 'auto' && currentStep === 1 && (
                    <Button onClick={handleAutoGenerate} disabled={!canProceed()}>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Exam
                    </Button>
                  )}
                  {((createMode === 'manual' && currentStep === 3) || (createMode === 'auto' && currentStep === 2)) && (
                    <Button onClick={handleCreateExam}>
                      <Check className="mr-2 h-4 w-4" />
                      Create Exam
                    </Button>
                  )}
                </div>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>

        {/* Exam Monitor */}
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

export default TeacherExams;
