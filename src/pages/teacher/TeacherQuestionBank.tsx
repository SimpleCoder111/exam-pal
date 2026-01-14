import { useState, useRef } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Copy,
  MoreHorizontal,
  CheckCircle2,
  Circle,
  ToggleLeft,
  Code,
  PenLine,
  Lock,
  ChevronDown,
  Upload,
  Download,
  FileSpreadsheet,
  AlertCircle,
  Check,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { teacherNavItems } from '@/config/teacherNavItems';

// Question Types
type QuestionType = 'multiple_choice' | 'fill_blank' | 'true_false' | 'coding' | 'writing';

interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: number;
  subjectId: number;
  subjectName: string;
  chapterId: number;
  chapterName: string;
  topic: string;
  type: QuestionType;
  difficulty: 'easy' | 'medium' | 'hard';
  questionText: string;
  options?: QuestionOption[];
  correctAnswer?: string; // For fill_blank and true_false
  points: number;
  createdAt: string;
  updatedAt: string;
}

interface Subject {
  id: number;
  name: string;
  chapters: { id: number; name: string }[];
}

// Mock Data
// TODO: Replace with API call to fetch teacher's subjects
const mockSubjects: Subject[] = [
  {
    id: 1,
    name: 'Mathematics',
    chapters: [
      { id: 1, name: 'Algebra Basics' },
      { id: 2, name: 'Linear Equations' },
      { id: 3, name: 'Quadratic Equations' },
      { id: 4, name: 'Geometry Fundamentals' },
    ],
  },
  {
    id: 2,
    name: 'Physics',
    chapters: [
      { id: 5, name: 'Motion and Forces' },
      { id: 6, name: 'Energy and Work' },
      { id: 7, name: 'Waves and Sound' },
    ],
  },
];

// TODO: Replace with API call to fetch questions
const mockQuestions: Question[] = [
  {
    id: 1,
    subjectId: 1,
    subjectName: 'Mathematics',
    chapterId: 1,
    chapterName: 'Algebra Basics',
    topic: 'Variables',
    type: 'multiple_choice',
    difficulty: 'easy',
    questionText: 'What is the value of x in the equation: 2x + 5 = 15?',
    options: [
      { id: 'a', text: '5', isCorrect: true },
      { id: 'b', text: '10', isCorrect: false },
      { id: 'c', text: '7.5', isCorrect: false },
      { id: 'd', text: '3', isCorrect: false },
    ],
    points: 1,
    createdAt: '2026-01-10',
    updatedAt: '2026-01-10',
  },
  {
    id: 2,
    subjectId: 1,
    subjectName: 'Mathematics',
    chapterId: 2,
    chapterName: 'Linear Equations',
    topic: 'Slope',
    type: 'fill_blank',
    difficulty: 'medium',
    questionText: 'The slope of the line passing through points (2, 3) and (4, 7) is ___.',
    correctAnswer: '2',
    points: 2,
    createdAt: '2026-01-11',
    updatedAt: '2026-01-11',
  },
  {
    id: 3,
    subjectId: 2,
    subjectName: 'Physics',
    chapterId: 5,
    chapterName: 'Motion and Forces',
    topic: 'Newton\'s Laws',
    type: 'true_false',
    difficulty: 'easy',
    questionText: 'An object at rest will remain at rest unless acted upon by an external force.',
    correctAnswer: 'true',
    points: 1,
    createdAt: '2026-01-12',
    updatedAt: '2026-01-12',
  },
  {
    id: 4,
    subjectId: 1,
    subjectName: 'Mathematics',
    chapterId: 3,
    chapterName: 'Quadratic Equations',
    topic: 'Factoring',
    type: 'multiple_choice',
    difficulty: 'hard',
    questionText: 'Which of the following is a factor of x² - 5x + 6?',
    options: [
      { id: 'a', text: '(x - 1)', isCorrect: false },
      { id: 'b', text: '(x - 2)', isCorrect: true },
      { id: 'c', text: '(x + 3)', isCorrect: false },
      { id: 'd', text: '(x - 6)', isCorrect: false },
    ],
    points: 3,
    createdAt: '2026-01-13',
    updatedAt: '2026-01-13',
  },
  {
    id: 5,
    subjectId: 2,
    subjectName: 'Physics',
    chapterId: 6,
    chapterName: 'Energy and Work',
    topic: 'Kinetic Energy',
    type: 'fill_blank',
    difficulty: 'medium',
    questionText: 'The formula for kinetic energy is KE = ___ mv².',
    correctAnswer: '1/2',
    points: 2,
    createdAt: '2026-01-13',
    updatedAt: '2026-01-13',
  },
];

const questionTypeConfig: Record<QuestionType, { label: string; icon: React.ReactNode; color: string; available: boolean }> = {
  multiple_choice: { 
    label: 'Multiple Choice', 
    icon: <CheckCircle2 className="w-4 h-4" />, 
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    available: true 
  },
  fill_blank: { 
    label: 'Fill in the Blank', 
    icon: <Circle className="w-4 h-4" />, 
    color: 'bg-green-500/10 text-green-600 border-green-500/20',
    available: true 
  },
  true_false: { 
    label: 'True/False', 
    icon: <ToggleLeft className="w-4 h-4" />, 
    color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    available: true 
  },
  coding: { 
    label: 'Coding', 
    icon: <Code className="w-4 h-4" />, 
    color: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    available: false 
  },
  writing: { 
    label: 'Writing', 
    icon: <PenLine className="w-4 h-4" />, 
    color: 'bg-pink-500/10 text-pink-600 border-pink-500/20',
    available: false 
  },
};

const difficultyConfig: Record<string, { label: string; color: string }> = {
  easy: { label: 'Easy', color: 'bg-green-500/10 text-green-600 border-green-500/20' },
  medium: { label: 'Medium', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
  hard: { label: 'Hard', color: 'bg-red-500/10 text-red-600 border-red-500/20' },
};

const TeacherQuestionBank = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedChapter, setSelectedChapter] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [expandedFilters, setExpandedFilters] = useState(false);
  
  // Bulk import state
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importStep, setImportStep] = useState<'upload' | 'preview' | 'importing'>('upload');
  const [importedQuestions, setImportedQuestions] = useState<Question[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [selectedImportSubject, setSelectedImportSubject] = useState<string>('');

  // Form state for new/edit question
  const [formData, setFormData] = useState({
    subjectId: '',
    chapterId: '',
    topic: '',
    type: 'multiple_choice' as QuestionType,
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    questionText: '',
    points: 1,
    options: [
      { id: 'a', text: '', isCorrect: false },
      { id: 'b', text: '', isCorrect: false },
      { id: 'c', text: '', isCorrect: false },
      { id: 'd', text: '', isCorrect: false },
    ] as QuestionOption[],
    correctAnswer: '',
  });

  // Get available chapters based on selected subject
  const availableChapters = selectedSubject !== 'all'
    ? mockSubjects.find(s => s.id.toString() === selectedSubject)?.chapters || []
    : mockSubjects.flatMap(s => s.chapters);

  const formChapters = formData.subjectId
    ? mockSubjects.find(s => s.id.toString() === formData.subjectId)?.chapters || []
    : [];

  // Filter questions
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || q.subjectId.toString() === selectedSubject;
    const matchesChapter = selectedChapter === 'all' || q.chapterId.toString() === selectedChapter;
    const matchesType = selectedType === 'all' || q.type === selectedType;
    const matchesDifficulty = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
    return matchesSearch && matchesSubject && matchesChapter && matchesType && matchesDifficulty;
  });

  // Stats
  const stats = [
    { label: 'Total Questions', value: questions.length, icon: FileText },
    { label: 'Multiple Choice', value: questions.filter(q => q.type === 'multiple_choice').length, icon: CheckCircle2 },
    { label: 'Fill in Blank', value: questions.filter(q => q.type === 'fill_blank').length, icon: Circle },
    { label: 'True/False', value: questions.filter(q => q.type === 'true_false').length, icon: ToggleLeft },
  ];

  const handleOpenDialog = (question?: Question) => {
    if (question) {
      setEditingQuestion(question);
      setFormData({
        subjectId: question.subjectId.toString(),
        chapterId: question.chapterId.toString(),
        topic: question.topic,
        type: question.type,
        difficulty: question.difficulty,
        questionText: question.questionText,
        points: question.points,
        options: question.options || [
          { id: 'a', text: '', isCorrect: false },
          { id: 'b', text: '', isCorrect: false },
          { id: 'c', text: '', isCorrect: false },
          { id: 'd', text: '', isCorrect: false },
        ],
        correctAnswer: question.correctAnswer || '',
      });
    } else {
      setEditingQuestion(null);
      setFormData({
        subjectId: '',
        chapterId: '',
        topic: '',
        type: 'multiple_choice',
        difficulty: 'medium',
        questionText: '',
        points: 1,
        options: [
          { id: 'a', text: '', isCorrect: false },
          { id: 'b', text: '', isCorrect: false },
          { id: 'c', text: '', isCorrect: false },
          { id: 'd', text: '', isCorrect: false },
        ],
        correctAnswer: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveQuestion = () => {
    // TODO: Replace with API call to save question
    const subject = mockSubjects.find(s => s.id.toString() === formData.subjectId);
    const chapter = subject?.chapters.find(c => c.id.toString() === formData.chapterId);

    const questionData: Question = {
      id: editingQuestion?.id || questions.length + 1,
      subjectId: parseInt(formData.subjectId),
      subjectName: subject?.name || '',
      chapterId: parseInt(formData.chapterId),
      chapterName: chapter?.name || '',
      topic: formData.topic,
      type: formData.type,
      difficulty: formData.difficulty,
      questionText: formData.questionText,
      points: formData.points,
      options: formData.type === 'multiple_choice' ? formData.options : undefined,
      correctAnswer: formData.type !== 'multiple_choice' ? formData.correctAnswer : undefined,
      createdAt: editingQuestion?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    if (editingQuestion) {
      setQuestions(questions.map(q => q.id === editingQuestion.id ? questionData : q));
    } else {
      setQuestions([...questions, questionData]);
    }

    setIsDialogOpen(false);
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (id: number) => {
    // TODO: Replace with API call to delete question
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleDuplicateQuestion = (question: Question) => {
    // TODO: Replace with API call to duplicate question
    const newQuestion = {
      ...question,
      id: questions.length + 1,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleOptionChange = (index: number, field: 'text' | 'isCorrect', value: string | boolean) => {
    const newOptions = [...formData.options];
    if (field === 'isCorrect') {
      // For single correct answer, uncheck others
      newOptions.forEach((opt, i) => {
        opt.isCorrect = i === index ? (value as boolean) : false;
      });
    } else {
      newOptions[index] = { ...newOptions[index], text: value as string };
    }
    setFormData({ ...formData, options: newOptions });
  };

  // Bulk Import Functions
  const downloadCSVTemplate = () => {
    const headers = [
      'question_text',
      'type',
      'difficulty',
      'topic',
      'chapter',
      'points',
      'option_a',
      'option_b',
      'option_c',
      'option_d',
      'correct_answer'
    ];
    
    const sampleRows = [
      [
        'What is 2 + 2?',
        'multiple_choice',
        'easy',
        'Arithmetic',
        'Algebra Basics',
        '1',
        '3',
        '4',
        '5',
        '6',
        'b'
      ],
      [
        'The value of pi is approximately 3.14',
        'true_false',
        'easy',
        'Constants',
        'Algebra Basics',
        '1',
        '',
        '',
        '',
        '',
        'true'
      ],
      [
        'The capital of France is ___',
        'fill_blank',
        'medium',
        'Geography',
        'Linear Equations',
        '2',
        '',
        '',
        '',
        '',
        'Paris'
      ],
    ];
    
    const csvContent = [
      headers.join(','),
      ...sampleRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'question_bank_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const parseCSV = (text: string): string[][] => {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentCell = '';
    let insideQuotes = false;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];
      
      if (char === '"') {
        if (insideQuotes && nextChar === '"') {
          currentCell += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        currentRow.push(currentCell.trim());
        currentCell = '';
      } else if ((char === '\n' || (char === '\r' && nextChar === '\n')) && !insideQuotes) {
        currentRow.push(currentCell.trim());
        if (currentRow.some(cell => cell !== '')) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentCell = '';
        if (char === '\r') i++;
      } else {
        currentCell += char;
      }
    }
    
    // Don't forget the last cell/row
    if (currentCell || currentRow.length > 0) {
      currentRow.push(currentCell.trim());
      if (currentRow.some(cell => cell !== '')) {
        rows.push(currentRow);
      }
    }
    
    return rows;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.name.endsWith('.csv')) {
      setImportErrors(['Please upload a CSV file. For Excel files, save as CSV first.']);
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = parseCSV(text);
        
        if (rows.length < 2) {
          setImportErrors(['CSV file is empty or contains only headers.']);
          return;
        }
        
        const headers = rows[0].map(h => h.toLowerCase().trim());
        const dataRows = rows.slice(1);
        
        const errors: string[] = [];
        const parsed: Question[] = [];
        
        const subject = mockSubjects.find(s => s.id.toString() === selectedImportSubject);
        if (!subject) {
          setImportErrors(['Please select a subject first.']);
          return;
        }
        
        dataRows.forEach((row, index) => {
          const rowNum = index + 2;
          
          const getValue = (header: string) => {
            const idx = headers.indexOf(header);
            return idx >= 0 ? row[idx] || '' : '';
          };
          
          const questionText = getValue('question_text');
          const type = getValue('type') as QuestionType;
          const difficulty = getValue('difficulty') as 'easy' | 'medium' | 'hard';
          const topic = getValue('topic');
          const chapterName = getValue('chapter');
          const points = parseInt(getValue('points')) || 1;
          const correctAnswer = getValue('correct_answer');
          
          // Validation
          if (!questionText) {
            errors.push(`Row ${rowNum}: Missing question text`);
            return;
          }
          
          if (!['multiple_choice', 'fill_blank', 'true_false'].includes(type)) {
            errors.push(`Row ${rowNum}: Invalid type "${type}". Use: multiple_choice, fill_blank, or true_false`);
            return;
          }
          
          if (!['easy', 'medium', 'hard'].includes(difficulty)) {
            errors.push(`Row ${rowNum}: Invalid difficulty "${difficulty}". Use: easy, medium, or hard`);
            return;
          }
          
          const chapter = subject.chapters.find(c => 
            c.name.toLowerCase() === chapterName.toLowerCase()
          );
          
          if (!chapter) {
            errors.push(`Row ${rowNum}: Chapter "${chapterName}" not found in ${subject.name}`);
            return;
          }
          
          let options: QuestionOption[] | undefined;
          if (type === 'multiple_choice') {
            const optA = getValue('option_a');
            const optB = getValue('option_b');
            const optC = getValue('option_c');
            const optD = getValue('option_d');
            
            if (!optA || !optB) {
              errors.push(`Row ${rowNum}: Multiple choice questions need at least options A and B`);
              return;
            }
            
            if (!['a', 'b', 'c', 'd'].includes(correctAnswer.toLowerCase())) {
              errors.push(`Row ${rowNum}: Correct answer for MCQ must be a, b, c, or d`);
              return;
            }
            
            options = [
              { id: 'a', text: optA, isCorrect: correctAnswer.toLowerCase() === 'a' },
              { id: 'b', text: optB, isCorrect: correctAnswer.toLowerCase() === 'b' },
              { id: 'c', text: optC, isCorrect: correctAnswer.toLowerCase() === 'c' },
              { id: 'd', text: optD, isCorrect: correctAnswer.toLowerCase() === 'd' },
            ].filter(opt => opt.text);
          }
          
          if (type === 'true_false' && !['true', 'false'].includes(correctAnswer.toLowerCase())) {
            errors.push(`Row ${rowNum}: True/False answer must be "true" or "false"`);
            return;
          }
          
          if (type === 'fill_blank' && !correctAnswer) {
            errors.push(`Row ${rowNum}: Fill in the blank requires a correct answer`);
            return;
          }
          
          parsed.push({
            id: questions.length + parsed.length + 1,
            subjectId: subject.id,
            subjectName: subject.name,
            chapterId: chapter.id,
            chapterName: chapter.name,
            topic: topic || 'General',
            type,
            difficulty,
            questionText,
            options,
            correctAnswer: type !== 'multiple_choice' ? correctAnswer : undefined,
            points,
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0],
          });
        });
        
        setImportErrors(errors);
        setImportedQuestions(parsed);
        
        if (parsed.length > 0) {
          setImportStep('preview');
        }
      } catch (error) {
        setImportErrors(['Failed to parse CSV file. Please check the format.']);
      }
    };
    
    reader.readAsText(file);
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConfirmImport = () => {
    setImportStep('importing');
    
    // Simulate import delay
    setTimeout(() => {
      setQuestions([...questions, ...importedQuestions]);
      
      toast({
        title: 'Import Successful',
        description: `${importedQuestions.length} questions imported successfully.`,
      });
      
      // Reset and close
      setIsImportDialogOpen(false);
      setImportStep('upload');
      setImportedQuestions([]);
      setImportErrors([]);
      setSelectedImportSubject('');
    }, 1000);
  };

  const resetImportDialog = () => {
    setIsImportDialogOpen(false);
    setImportStep('upload');
    setImportedQuestions([]);
    setImportErrors([]);
    setSelectedImportSubject('');
  };

  return (
    <DashboardLayout navItems={teacherNavItems} role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-semibold text-foreground">Question Bank</h1>
            <p className="text-muted-foreground mt-1">Create and manage questions for your subjects.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Import CSV
            </Button>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Question Types Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Question Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(questionTypeConfig).map(([type, config]) => (
                <div 
                  key={type}
                  className={`p-4 rounded-lg border ${config.color} relative ${!config.available ? 'opacity-60' : ''}`}
                >
                  {!config.available && (
                    <div className="absolute top-2 right-2">
                      <Lock className="w-3 h-3" />
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    {config.icon}
                    <span className="font-medium text-sm">{config.label}</span>
                  </div>
                  {config.available ? (
                    <p className="text-xs opacity-80">
                      {questions.filter(q => q.type === type).length} questions
                    </p>
                  ) : (
                    <Badge variant="outline" className="text-xs">Coming Soon</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              {/* Search & Quick Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setExpandedFilters(!expandedFilters)}
                  className="sm:w-auto"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${expandedFilters ? 'rotate-180' : ''}`} />
                </Button>
              </div>

              {/* Expanded Filters */}
              <Collapsible open={expandedFilters}>
                <CollapsibleContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-border">
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Subjects" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        {mockSubjects.map(subject => (
                          <SelectItem key={subject.id} value={subject.id.toString()}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Chapters" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Chapters</SelectItem>
                        {availableChapters.map(chapter => (
                          <SelectItem key={chapter.id} value={chapter.id.toString()}>
                            {chapter.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {Object.entries(questionTypeConfig)
                          .filter(([, config]) => config.available)
                          .map(([type, config]) => (
                            <SelectItem key={type} value={type}>
                              {config.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Difficulties" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Difficulties</SelectItem>
                        {Object.entries(difficultyConfig).map(([diff, config]) => (
                          <SelectItem key={diff} value={diff}>
                            {config.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </CardContent>
        </Card>

        {/* Questions Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Question</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Subject / Chapter</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead className="text-center">Points</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuestions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No questions found. Create your first question to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQuestions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell>
                        <div className="max-w-md">
                          <p className="font-medium text-foreground line-clamp-2">{question.questionText}</p>
                          <p className="text-xs text-muted-foreground mt-1">Topic: {question.topic}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={questionTypeConfig[question.type].color}>
                          <span className="flex items-center gap-1">
                            {questionTypeConfig[question.type].icon}
                            <span className="hidden sm:inline">{questionTypeConfig[question.type].label}</span>
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium text-foreground">{question.subjectName}</p>
                          <p className="text-muted-foreground text-xs">{question.chapterName}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={difficultyConfig[question.difficulty].color}>
                          {difficultyConfig[question.difficulty].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-medium">{question.points}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenDialog(question)}>
                              <Edit2 className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicateQuestion(question)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteQuestion(question.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add/Edit Question Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingQuestion ? 'Edit Question' : 'Add New Question'}
              </DialogTitle>
            </DialogHeader>

            <Tabs value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as QuestionType })}>
              <TabsList className="grid grid-cols-5 mb-4">
                {Object.entries(questionTypeConfig).map(([type, config]) => (
                  <TabsTrigger 
                    key={type} 
                    value={type}
                    disabled={!config.available}
                    className="text-xs sm:text-sm"
                  >
                    <span className="hidden sm:inline">{config.label}</span>
                    <span className="sm:hidden">{config.icon}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="space-y-4">
                {/* Common Fields */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Subject *</Label>
                    <Select 
                      value={formData.subjectId} 
                      onValueChange={(v) => setFormData({ ...formData, subjectId: v, chapterId: '' })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockSubjects.map(subject => (
                          <SelectItem key={subject.id} value={subject.id.toString()}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Chapter *</Label>
                    <Select 
                      value={formData.chapterId} 
                      onValueChange={(v) => setFormData({ ...formData, chapterId: v })}
                      disabled={!formData.subjectId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select chapter" />
                      </SelectTrigger>
                      <SelectContent>
                        {formChapters.map(chapter => (
                          <SelectItem key={chapter.id} value={chapter.id.toString()}>
                            {chapter.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Topic *</Label>
                    <Input
                      placeholder="e.g., Variables, Forces"
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Difficulty *</Label>
                    <Select 
                      value={formData.difficulty} 
                      onValueChange={(v) => setFormData({ ...formData, difficulty: v as 'easy' | 'medium' | 'hard' })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(difficultyConfig).map(([diff, config]) => (
                          <SelectItem key={diff} value={diff}>
                            {config.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Points *</Label>
                    <Input
                      type="number"
                      min={1}
                      value={formData.points}
                      onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Question Text *</Label>
                  <Textarea
                    placeholder="Enter your question here..."
                    rows={3}
                    value={formData.questionText}
                    onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                  />
                </div>

                {/* Type-specific content */}
                <TabsContent value="multiple_choice" className="mt-0 space-y-3">
                  <Label>Answer Options *</Label>
                  <p className="text-xs text-muted-foreground">Check the correct answer</p>
                  {formData.options.map((option, index) => (
                    <div key={option.id} className="flex items-center gap-3">
                      <Checkbox
                        checked={option.isCorrect}
                        onCheckedChange={(checked) => handleOptionChange(index, 'isCorrect', !!checked)}
                      />
                      <span className="font-medium text-muted-foreground w-6">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <Input
                        placeholder={`Option ${String.fromCharCode(65 + index)}`}
                        value={option.text}
                        onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="fill_blank" className="mt-0 space-y-3">
                  <div className="space-y-2">
                    <Label>Correct Answer *</Label>
                    <p className="text-xs text-muted-foreground">Use ___ in the question to indicate the blank</p>
                    <Input
                      placeholder="Enter the correct answer"
                      value={formData.correctAnswer}
                      onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="true_false" className="mt-0 space-y-3">
                  <div className="space-y-2">
                    <Label>Correct Answer *</Label>
                    <RadioGroup
                      value={formData.correctAnswer}
                      onValueChange={(v) => setFormData({ ...formData, correctAnswer: v })}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="true" />
                        <Label htmlFor="true" className="font-normal cursor-pointer">True</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="false" />
                        <Label htmlFor="false" className="font-normal cursor-pointer">False</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </TabsContent>

                <TabsContent value="coding" className="mt-0">
                  <div className="p-8 text-center bg-secondary/30 rounded-lg">
                    <Code className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-medium text-foreground mb-2">Coding Questions Coming Soon</h3>
                    <p className="text-sm text-muted-foreground">
                      This feature is under development. You'll be able to create coding challenges with test cases.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="writing" className="mt-0">
                  <div className="p-8 text-center bg-secondary/30 rounded-lg">
                    <PenLine className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-medium text-foreground mb-2">Writing Questions Coming Soon</h3>
                    <p className="text-sm text-muted-foreground">
                      This feature is under development. You'll be able to create essay and long-form questions.
                    </p>
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveQuestion}
                disabled={!formData.subjectId || !formData.chapterId || !formData.questionText || !formData.topic}
              >
                {editingQuestion ? 'Save Changes' : 'Create Question'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bulk Import Dialog */}
        <Dialog open={isImportDialogOpen} onOpenChange={(open) => !open && resetImportDialog()}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5" />
                Import Questions from CSV
              </DialogTitle>
            </DialogHeader>

            {importStep === 'upload' && (
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label>Select Subject *</Label>
                  <p className="text-sm text-muted-foreground">
                    All imported questions will be added to this subject
                  </p>
                  <Select value={selectedImportSubject} onValueChange={setSelectedImportSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSubjects.map(subject => (
                        <SelectItem key={subject.id} value={subject.id.toString()}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedImportSubject && (
                  <>
                    <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="csv-upload"
                      />
                      <label htmlFor="csv-upload" className="cursor-pointer">
                        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="font-medium text-foreground mb-1">Click to upload CSV file</p>
                        <p className="text-sm text-muted-foreground">
                          Or drag and drop your file here
                        </p>
                      </label>
                    </div>

                    <Button variant="outline" onClick={downloadCSVTemplate} className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download CSV Template
                    </Button>

                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <p className="font-medium text-sm">CSV Format Guide:</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• <strong>question_text</strong>: The question (required)</li>
                        <li>• <strong>type</strong>: multiple_choice, fill_blank, or true_false</li>
                        <li>• <strong>difficulty</strong>: easy, medium, or hard</li>
                        <li>• <strong>topic</strong>: Question topic</li>
                        <li>• <strong>chapter</strong>: Must match existing chapter names</li>
                        <li>• <strong>points</strong>: Number of points</li>
                        <li>• <strong>option_a/b/c/d</strong>: For multiple choice only</li>
                        <li>• <strong>correct_answer</strong>: a/b/c/d for MCQ, true/false for T/F, or text for fill blank</li>
                      </ul>
                    </div>
                  </>
                )}

                {importErrors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <ul className="list-disc list-inside space-y-1">
                        {importErrors.slice(0, 5).map((err, i) => (
                          <li key={i} className="text-sm">{err}</li>
                        ))}
                        {importErrors.length > 5 && (
                          <li className="text-sm">...and {importErrors.length - 5} more errors</li>
                        )}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {importStep === 'preview' && (
              <div className="flex-1 overflow-hidden flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      {importedQuestions.length} questions ready to import
                    </p>
                    {importErrors.length > 0 && (
                      <p className="text-sm text-amber-600 dark:text-amber-400">
                        {importErrors.length} rows had errors and were skipped
                      </p>
                    )}
                  </div>
                </div>

                <ScrollArea className="flex-1 border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%]">Question</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Chapter</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead>Points</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {importedQuestions.map((q, i) => (
                        <TableRow key={i}>
                          <TableCell className="max-w-[200px]">
                            <p className="truncate">{q.questionText}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={questionTypeConfig[q.type].color}>
                              {questionTypeConfig[q.type].label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{q.chapterName}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={difficultyConfig[q.difficulty].color}>
                              {difficultyConfig[q.difficulty].label}
                            </Badge>
                          </TableCell>
                          <TableCell>{q.points}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>

                {importErrors.length > 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <p className="font-medium mb-2">Skipped rows with errors:</p>
                      <ScrollArea className="max-h-24">
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {importErrors.map((err, i) => (
                            <li key={i}>{err}</li>
                          ))}
                        </ul>
                      </ScrollArea>
                    </AlertDescription>
                  </Alert>
                )}

                <DialogFooter>
                  <Button variant="outline" onClick={() => setImportStep('upload')}>
                    <X className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={handleConfirmImport}>
                    <Check className="w-4 h-4 mr-2" />
                    Import {importedQuestions.length} Questions
                  </Button>
                </DialogFooter>
              </div>
            )}

            {importStep === 'importing' && (
              <div className="py-12 text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="font-medium text-foreground">Importing questions...</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Please wait while we add your questions
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default TeacherQuestionBank;
