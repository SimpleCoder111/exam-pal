import { useState, useRef } from 'react';
import { 
  FileText, Plus, Search, Filter, Edit2, Trash2, 
  MoreHorizontal, CheckCircle2, Circle, ToggleLeft, Code, PenLine, Lock, 
  ChevronDown, Upload, Download, FileSpreadsheet, AlertCircle, Check, X, Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { teacherNavItems } from '@/config/teacherNavItems';
import { useTeacherSubjects, type TeacherSubject } from '@/hooks/useTeacherSubjects';
import {
  useTeacherQuestions, useQuestionSummary, useCreateQuestion, useUpdateQuestion,
  useDeleteQuestion, useImportQuestions,
  type ApiQuestion, type CreateQuestionPayload, type UpdateQuestionPayload,
} from '@/hooks/useTeacherQuestions';

// --- Type mappings ---

type QuestionType = 'multiple_choice' | 'fill_blank' | 'true_false' | 'coding' | 'writing';

const apiTypeToLocal = (t: string): QuestionType => {
  if (t === 'MULTIPLE_CHOICE') return 'multiple_choice';
  if (t === 'TRUE_FALSE') return 'true_false';
  if (t === 'FILL_BLANK') return 'fill_blank';
  return 'multiple_choice';
};

const localTypeToApi = (t: QuestionType) => {
  if (t === 'multiple_choice') return 'MULTIPLE_CHOICE' as const;
  if (t === 'true_false') return 'TRUE_FALSE' as const;
  return 'FILL_BLANK' as const;
};

const localDiffToApi = (d: string) => d.toUpperCase() as 'EASY' | 'MEDIUM' | 'HARD';

const questionTypeConfig: Record<QuestionType, { label: string; icon: React.ReactNode; color: string; available: boolean }> = {
  multiple_choice: { label: 'Multiple Choice', icon: <CheckCircle2 className="w-4 h-4" />, color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', available: true },
  fill_blank: { label: 'Fill in the Blank', icon: <Circle className="w-4 h-4" />, color: 'bg-green-500/10 text-green-600 border-green-500/20', available: true },
  true_false: { label: 'True/False', icon: <ToggleLeft className="w-4 h-4" />, color: 'bg-purple-500/10 text-purple-600 border-purple-500/20', available: true },
  coding: { label: 'Coding', icon: <Code className="w-4 h-4" />, color: 'bg-orange-500/10 text-orange-600 border-orange-500/20', available: false },
  writing: { label: 'Writing', icon: <PenLine className="w-4 h-4" />, color: 'bg-pink-500/10 text-pink-600 border-pink-500/20', available: false },
};

const difficultyConfig: Record<string, { label: string; color: string }> = {
  easy: { label: 'Easy', color: 'bg-green-500/10 text-green-600 border-green-500/20' },
  medium: { label: 'Medium', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
  hard: { label: 'Hard', color: 'bg-red-500/10 text-red-600 border-red-500/20' },
};

interface FormOption {
  optionId?: number;
  text: string;
  isCorrect: boolean;
}

const emptyOptions: FormOption[] = [
  { text: '', isCorrect: false },
  { text: '', isCorrect: false },
  { text: '', isCorrect: false },
  { text: '', isCorrect: false },
];

const TeacherQuestionBank = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filters
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [expandedFilters, setExpandedFilters] = useState(false);

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<ApiQuestion | null>(null);

  // Import state
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    chapterId: '',
    type: 'multiple_choice' as QuestionType,
    difficulty: 'medium' as string,
    questionText: '',
    options: [...emptyOptions] as FormOption[],
    correctAnswer: '',
  });

  // --- API hooks ---
  const { data: subjects = [], isLoading: subjectsLoading } = useTeacherSubjects();
  const subjectIdNum = selectedSubjectId ? parseInt(selectedSubjectId) : null;
  const { data: questionsData, isLoading: questionsLoading } = useTeacherQuestions(subjectIdNum);
  const { data: summary, isLoading: summaryLoading } = useQuestionSummary();
  const createMutation = useCreateQuestion();
  const updateMutation = useUpdateQuestion();
  const deleteMutation = useDeleteQuestion();
  const importMutation = useImportQuestions();

  const questions = questionsData?.questionData ?? [];
  const currentSubject = subjects.find(s => s.id.toString() === selectedSubjectId);
  const chapters = currentSubject?.chapterResponseList ?? [];

  // Auto-select first subject
  if (subjects.length > 0 && !selectedSubjectId) {
    setSelectedSubjectId(subjects[0].id.toString());
  }

  // Filter questions
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.questionContent.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChapter = selectedChapter === 'all' || q.chapterId.toString() === selectedChapter;
    const matchesType = selectedType === 'all' || apiTypeToLocal(q.questionType) === selectedType;
    const matchesDifficulty = selectedDifficulty === 'all' || q.difficulty.toLowerCase() === selectedDifficulty;
    return matchesSearch && matchesChapter && matchesType && matchesDifficulty;
  });

  // Stats from summary API
  const stats = [
    { label: 'Total Questions', value: summary?.totalQuestions ?? 0, icon: FileText },
    { label: 'Multiple Choice', value: summary?.totalMCQQuestions ?? 0, icon: CheckCircle2 },
    { label: 'Fill in Blank', value: summary?.totalFillBlankQuestions ?? 0, icon: Circle },
    { label: 'True/False', value: summary?.totalTrueFalseQuestions ?? 0, icon: ToggleLeft },
  ];

  // --- Handlers ---

  const handleOpenDialog = (question?: ApiQuestion) => {
    if (question) {
      setEditingQuestion(question);
      setFormData({
        chapterId: question.chapterId.toString(),
        type: apiTypeToLocal(question.questionType),
        difficulty: question.difficulty.toLowerCase(),
        questionText: question.questionContent,
        options: question.optionLists.length > 0
          ? question.optionLists.map(o => ({ optionId: o.optionId, text: o.optionText, isCorrect: o.isCorrect }))
          : [...emptyOptions],
        correctAnswer: question.questionType === 'FILL_BLANK'
          ? (question.optionLists[0]?.optionText ?? '')
          : question.questionType === 'TRUE_FALSE'
            ? (question.optionLists.find(o => o.isCorrect)?.optionText?.toLowerCase().includes('true') ? 'true' : 'false')
            : '',
      });
    } else {
      setEditingQuestion(null);
      setFormData({
        chapterId: '',
        type: 'multiple_choice',
        difficulty: 'medium',
        questionText: '',
        options: [...emptyOptions],
        correctAnswer: '',
      });
    }
    setIsDialogOpen(true);
  };

  const buildPayload = (): CreateQuestionPayload | UpdateQuestionPayload => {
    const apiType = localTypeToApi(formData.type);
    const base = {
      subjectId: parseInt(selectedSubjectId),
      chapterId: parseInt(formData.chapterId),
      questionType: apiType,
      questionContent: formData.questionText,
      difficulty: localDiffToApi(formData.difficulty),
      createdBy: user?.id ?? '',
    };

    if (apiType === 'MULTIPLE_CHOICE') {
      return {
        ...base,
        optionLists: formData.options
          .filter(o => o.text.trim())
          .map(o => ({
            ...(o.optionId ? { optionId: o.optionId } : {}),
            optionText: o.text,
            isCorrect: o.isCorrect,
          })),
      };
    }

    if (apiType === 'TRUE_FALSE') {
      const trueOpt = editingQuestion?.optionLists.find(o => o.optionText.toLowerCase().includes('true'));
      const falseOpt = editingQuestion?.optionLists.find(o => !o.optionText.toLowerCase().includes('true'));
      return {
        ...base,
        optionLists: [
          { ...(trueOpt?.optionId ? { optionId: trueOpt.optionId } : {}), optionText: 'True', isCorrect: formData.correctAnswer === 'true' },
          { ...(falseOpt?.optionId ? { optionId: falseOpt.optionId } : {}), optionText: 'False', isCorrect: formData.correctAnswer === 'false' },
        ],
      };
    }

    // FILL_BLANK
    const existingOpt = editingQuestion?.optionLists[0];
    return {
      ...base,
      optionLists: [
        { ...(existingOpt?.optionId ? { optionId: existingOpt.optionId } : {}), optionText: formData.correctAnswer, isCorrect: true },
      ],
    };
  };

  const handleSaveQuestion = async () => {
    const payload = buildPayload();
    try {
      if (editingQuestion) {
        await updateMutation.mutateAsync({ questionId: editingQuestion.questionId, payload: payload as UpdateQuestionPayload });
        toast({ title: 'Question updated successfully' });
      } else {
        await createMutation.mutateAsync({ subjectId: parseInt(selectedSubjectId), payload });
        toast({ title: 'Question created successfully' });
      }
      setIsDialogOpen(false);
      setEditingQuestion(null);
    } catch {
      toast({ title: 'Failed to save question', variant: 'destructive' });
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    try {
      await deleteMutation.mutateAsync(questionId);
      toast({ title: 'Question deleted successfully' });
    } catch {
      toast({ title: 'Failed to delete question', variant: 'destructive' });
    }
  };

  const handleOptionChange = (index: number, field: 'text' | 'isCorrect', value: string | boolean) => {
    const newOptions = [...formData.options];
    if (field === 'isCorrect') {
      newOptions.forEach((opt, i) => { opt.isCorrect = i === index ? (value as boolean) : false; });
    } else {
      newOptions[index] = { ...newOptions[index], text: value as string };
    }
    setFormData({ ...formData, options: newOptions });
  };

  // --- Import handlers ---

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setImportFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImport = async () => {
    if (!importFile || !selectedSubjectId) return;
    try {
      const result = await importMutation.mutateAsync({ subjectId: parseInt(selectedSubjectId), file: importFile });
      const data = result.data;
      toast({
        title: 'Import Successful',
        description: `${data.importedCount} imported, ${data.failedCount} failed.`,
      });
      setIsImportDialogOpen(false);
      setImportFile(null);
    } catch {
      toast({ title: 'Import failed', variant: 'destructive' });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

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
            <Button variant="outline" onClick={() => setIsImportDialogOpen(true)} disabled={!selectedSubjectId}>
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button onClick={() => handleOpenDialog()} disabled={!selectedSubjectId}>
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
                  {summaryLoading ? (
                    <Skeleton className="h-7 w-12" />
                  ) : (
                    <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                  )}
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
                <div key={type} className={`p-4 rounded-lg border ${config.color} relative ${!config.available ? 'opacity-60' : ''}`}>
                  {!config.available && <div className="absolute top-2 right-2"><Lock className="w-3 h-3" /></div>}
                  <div className="flex items-center gap-2 mb-2">
                    {config.icon}
                    <span className="font-medium text-sm">{config.label}</span>
                  </div>
                  {config.available ? (
                    <p className="text-xs opacity-80">
                      {type === 'multiple_choice' ? (summary?.totalMCQQuestions ?? '—') :
                       type === 'fill_blank' ? (summary?.totalFillBlankQuestions ?? '—') :
                       type === 'true_false' ? (summary?.totalTrueFalseQuestions ?? '—') : 0} questions
                    </p>
                  ) : (
                    <Badge variant="outline" className="text-xs">Coming Soon</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Subject selector + Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              {/* Subject selector */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={selectedSubjectId} onValueChange={(v) => { setSelectedSubjectId(v); setSelectedChapter('all'); }}>
                  <SelectTrigger className="sm:w-[260px]">
                    <SelectValue placeholder={subjectsLoading ? 'Loading...' : 'Select subject'} />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(s => (
                      <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search questions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
                </div>
                <Button variant="outline" onClick={() => setExpandedFilters(!expandedFilters)} className="sm:w-auto">
                  <Filter className="w-4 h-4 mr-2" />Filters
                  <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${expandedFilters ? 'rotate-180' : ''}`} />
                </Button>
              </div>

              <Collapsible open={expandedFilters}>
                <CollapsibleContent>
                  <div className="grid sm:grid-cols-3 gap-3 pt-3 border-t border-border">
                    <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                      <SelectTrigger><SelectValue placeholder="All Chapters" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Chapters</SelectItem>
                        {chapters.map(ch => (
                          <SelectItem key={ch.id} value={ch.id.toString()}>{ch.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {Object.entries(questionTypeConfig).filter(([, c]) => c.available).map(([type, c]) => (
                          <SelectItem key={type} value={type}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                      <SelectTrigger><SelectValue placeholder="All Difficulties" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Difficulties</SelectItem>
                        {Object.entries(difficultyConfig).map(([d, c]) => (
                          <SelectItem key={d} value={d}>{c.label}</SelectItem>
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
            {questionsLoading ? (
              <div className="p-8 space-y-4">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[45%]">Question</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Chapter</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuestions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {!selectedSubjectId ? 'Select a subject to view questions.' : 'No questions found.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredQuestions.map((q) => {
                      const localType = apiTypeToLocal(q.questionType);
                      const diffKey = q.difficulty.toLowerCase();
                      return (
                        <TableRow key={q.questionId}>
                          <TableCell>
                            <p className="font-medium text-foreground line-clamp-2 max-w-md">{q.questionContent}</p>
                            <p className="text-xs text-muted-foreground mt-1">By: {q.createdBy}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={questionTypeConfig[localType].color}>
                              <span className="flex items-center gap-1">
                                {questionTypeConfig[localType].icon}
                                <span className="hidden sm:inline">{questionTypeConfig[localType].label}</span>
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-foreground">{q.chapter}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={difficultyConfig[diffKey]?.color ?? ''}>
                              {difficultyConfig[diffKey]?.label ?? diffKey}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleOpenDialog(q)}>
                                  <Edit2 className="w-4 h-4 mr-2" />Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDeleteQuestion(q.questionId)} className="text-destructive">
                                  <Trash2 className="w-4 h-4 mr-2" />Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Question Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingQuestion ? 'Edit Question' : 'Add New Question'}</DialogTitle>
            </DialogHeader>

            <Tabs value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as QuestionType })}>
              <TabsList className="grid grid-cols-5 mb-4">
                {Object.entries(questionTypeConfig).map(([type, config]) => (
                  <TabsTrigger key={type} value={type} disabled={!config.available} className="text-xs sm:text-sm">
                    <span className="hidden sm:inline">{config.label}</span>
                    <span className="sm:hidden">{config.icon}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="space-y-4">
                {/* Chapter + Difficulty */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Chapter *</Label>
                    <Select value={formData.chapterId} onValueChange={(v) => setFormData({ ...formData, chapterId: v })}>
                      <SelectTrigger><SelectValue placeholder="Select chapter" /></SelectTrigger>
                      <SelectContent>
                        {chapters.filter(ch => ch.active).map(ch => (
                          <SelectItem key={ch.id} value={ch.id.toString()}>{ch.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Difficulty *</Label>
                    <Select value={formData.difficulty} onValueChange={(v) => setFormData({ ...formData, difficulty: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(difficultyConfig).map(([d, c]) => (
                          <SelectItem key={d} value={d}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

                {/* MCQ options */}
                <TabsContent value="multiple_choice" className="mt-0 space-y-3">
                  <Label>Answer Options *</Label>
                  <p className="text-xs text-muted-foreground">Check the correct answer</p>
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Checkbox checked={option.isCorrect} onCheckedChange={(checked) => handleOptionChange(index, 'isCorrect', !!checked)} />
                      <span className="font-medium text-muted-foreground w-6">{String.fromCharCode(65 + index)}.</span>
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
                    <RadioGroup value={formData.correctAnswer} onValueChange={(v) => setFormData({ ...formData, correctAnswer: v })} className="flex gap-6">
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
                    <p className="text-sm text-muted-foreground">This feature is under development.</p>
                  </div>
                </TabsContent>

                <TabsContent value="writing" className="mt-0">
                  <div className="p-8 text-center bg-secondary/30 rounded-lg">
                    <PenLine className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-medium text-foreground mb-2">Writing Questions Coming Soon</h3>
                    <p className="text-sm text-muted-foreground">This feature is under development.</p>
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveQuestion} disabled={!formData.chapterId || !formData.questionText || isSaving}>
                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingQuestion ? 'Save Changes' : 'Create Question'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Import Dialog */}
        <Dialog open={isImportDialogOpen} onOpenChange={(open) => { if (!open) { setIsImportDialogOpen(false); setImportFile(null); } }}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5" />
                Import Questions
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <p className="text-sm text-muted-foreground">
                Upload an Excel file to import questions into <strong>{currentSubject?.name ?? 'selected subject'}</strong>.
              </p>

              <FileDropzone
                accept=".xlsx,.xls"
                acceptLabel=".xlsx or .xls"
                file={importFile}
                onFileSelect={(file) => setImportFile(file)}
                onFileClear={() => setImportFile(null)}
                id="teacher-import-upload"
              />

              {importMutation.isError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Import failed. Please check the file format and try again.</AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsImportDialogOpen(false); setImportFile(null); }}>Cancel</Button>
              <Button onClick={handleImport} disabled={!importFile || importMutation.isPending}>
                {importMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Import
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default TeacherQuestionBank;
