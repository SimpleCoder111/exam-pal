import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { adminNavItems } from '@/config/adminNavItems';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Plus, BookOpen, Clock, FileText, Wand2, ChevronRight, ChevronLeft, Check,
  Calendar, Shuffle, Eye, Edit, Trash2, Play, Monitor, Search
} from 'lucide-react';
import ExamMonitor from '@/components/exam/ExamMonitor';
import { useToast } from '@/hooks/use-toast';
import { useAdminExams, useCreateAdminExam, useDeleteAdminExam, useUpdateAdminExam, AdminExamResponse, CreateAdminExamPayload } from '@/hooks/useAdminExams';
import { useAdminSubjects } from '@/hooks/useAdminSubjects';
import { useAdminClasses } from '@/hooks/useAdminClasses';
import { useAdminQuestions } from '@/hooks/useAdminQuestions';

interface ExamFormData {
  title: string;
  subjectId: number | null;
  classId: number | null;
  duration: number;
  scheduledDate: string;
  scheduledTime: string;
}

interface AutoBuilderConfig {
  easyCount: number;
  mediumCount: number;
  hardCount: number;
}

const AdminExams = () => {
  const { toast } = useToast();

  // API hooks
  const { data: exams, isLoading: examsLoading } = useAdminExams();
  const { data: subjects, isLoading: subjectsLoading } = useAdminSubjects();
  const { data: classes, isLoading: classesLoading } = useAdminClasses();
  const createExamMutation = useCreateAdminExam();
  const deleteExamMutation = useDeleteAdminExam();
  const updateExamMutation = useUpdateAdminExam();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createMode, setCreateMode] = useState<'manual' | 'auto' | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);
  const [showMonitor, setShowMonitor] = useState(false);
  const [monitorExam, setMonitorExam] = useState<{ id: string; title: string } | null>(null);

  // View & Edit state
  const [viewExam, setViewExam] = useState<AdminExamResponse | null>(null);
  const [editingExam, setEditingExam] = useState<AdminExamResponse | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState<ExamFormData>({ title: '', subjectId: null, classId: null, duration: 60, scheduledDate: '', scheduledTime: '' });
  const [editAutoConfig, setEditAutoConfig] = useState<AutoBuilderConfig>({ easyCount: 5, mediumCount: 3, hardCount: 2 });
  const [editQuestionIds, setEditQuestionIds] = useState<number[]>([]);
  const [editIsDraft, setEditIsDraft] = useState(true);

  const [formData, setFormData] = useState<ExamFormData>({
    title: '',
    subjectId: null,
    classId: null,
    duration: 60,
    scheduledDate: '',
    scheduledTime: '',
  });

  const [autoConfig, setAutoConfig] = useState<AutoBuilderConfig>({
    easyCount: 5,
    mediumCount: 3,
    hardCount: 2,
  });

  const [isDraft, setIsDraft] = useState(true);
  const [questionSearch, setQuestionSearch] = useState('');

  // Fetch questions for manual mode when subject is selected
  const { data: adminQuestions, isLoading: questionsLoading } = useAdminQuestions(formData.subjectId);
  const allQuestions = adminQuestions || [];
  const filteredQuestions = allQuestions.filter(q =>
    !questionSearch || q.questionContent.toLowerCase().includes(questionSearch.toLowerCase()) ||
    q.questionType.toLowerCase().includes(questionSearch.toLowerCase()) ||
    q.difficulty.toLowerCase().includes(questionSearch.toLowerCase())
  );

  // Filter classes by selected subject (className format: "Class - Subject")
  const getSelectedSubjectName = (subjectId: number | null) =>
    subjectId ? subjects?.find(s => s.id === subjectId)?.name?.toLowerCase() : null;

  const filteredClasses = (classes || []).filter(cls => {
    const subjectName = getSelectedSubjectName(formData.subjectId);
    if (!subjectName) return true;
    return cls.className?.toLowerCase().includes(subjectName);
  });
  const editFilteredClasses = (classes || []).filter(cls => {
    const subjectName = getSelectedSubjectName(editFormData.subjectId);
    if (!subjectName) return true;
    return cls.className?.toLowerCase().includes(subjectName);
  });

  const handleQuestionToggle = (questionId: number) => {
    setSelectedQuestionIds(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleCreateExam = async () => {
    if (!formData.subjectId || !formData.classId || !formData.title) return;

    const examDate = formData.scheduledDate
      ? `${formData.scheduledDate} ${formData.scheduledTime ? `${formData.scheduledTime}:00` : '00:00:00'}`
      : new Date().toISOString().replace('T', ' ').substring(0, 19);

    const payload: CreateAdminExamPayload = {
      classId: formData.classId,
      subjectId: formData.subjectId,
      examDate,
      examTitle: formData.title,
      duration: formData.duration,
      examPaperType: createMode === 'auto' ? 'AUTO' : 'MANUAL',
      isDraft,
      ...(createMode === 'auto' ? {
        easyQuestions: autoConfig.easyCount,
        mediumQuestions: autoConfig.mediumCount,
        hardQuestions: autoConfig.hardCount,
      } : {
        questionIds: selectedQuestionIds,
      }),
    };

    try {
      await createExamMutation.mutateAsync(payload);
      toast({ title: 'Exam Created', description: `"${formData.title}" has been created successfully` });
      resetForm();
      setShowCreateDialog(false);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to create exam', variant: 'destructive' });
    }
  };

  const handleDeleteExam = async (examId: number, examTitle: string) => {
    try {
      await deleteExamMutation.mutateAsync(examId);
      toast({ title: 'Exam Deleted', description: `"${examTitle}" has been deleted` });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to delete exam', variant: 'destructive' });
    }
  };

  const handleOpenEdit = (exam: AdminExamResponse) => {
    setEditingExam(exam);
    const dateObj = exam.examDate ? new Date(exam.examDate) : null;
    setEditFormData({
      title: exam.examTitle,
      subjectId: exam.subjectId,
      classId: exam.classId,
      duration: exam.duration,
      scheduledDate: dateObj ? dateObj.toISOString().split('T')[0] : '',
      scheduledTime: dateObj ? dateObj.toTimeString().substring(0, 5) : '',
    });
    setEditAutoConfig({
      easyCount: exam.easyQuestions || 0,
      mediumCount: exam.mediumQuestions || 0,
      hardCount: exam.hardQuestions || 0,
    });
    setEditQuestionIds(exam.questionIds || []);
    setEditIsDraft(exam.examStatus?.toLowerCase() === 'draft');
    setShowEditDialog(true);
  };

  const handleUpdateExam = async () => {
    if (!editingExam || !editFormData.subjectId || !editFormData.classId || !editFormData.title) return;

    const examDate = editFormData.scheduledDate
      ? `${editFormData.scheduledDate} ${editFormData.scheduledTime ? `${editFormData.scheduledTime}:00` : '00:00:00'}`
      : new Date().toISOString().replace('T', ' ').substring(0, 19);

    const isAuto = editingExam.examPaperType === 'AUTO';

    const payload: CreateAdminExamPayload = {
      classId: editFormData.classId,
      subjectId: editFormData.subjectId,
      examDate,
      examTitle: editFormData.title,
      duration: editFormData.duration,
      examPaperType: editingExam.examPaperType,
      isDraft: editIsDraft,
      ...(isAuto ? {
        easyQuestions: editAutoConfig.easyCount,
        mediumQuestions: editAutoConfig.mediumCount,
        hardQuestions: editAutoConfig.hardCount,
      } : {
        questionIds: editQuestionIds,
      }),
    };

    try {
      await updateExamMutation.mutateAsync({ examId: editingExam.examId, payload });
      toast({ title: 'Exam Updated', description: `"${editFormData.title}" has been updated successfully` });
      setShowEditDialog(false);
      setEditingExam(null);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to update exam', variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setCreateMode(null);
    setCurrentStep(1);
    setSelectedQuestionIds([]);
    setQuestionSearch('');
    setFormData({
      title: '',
      subjectId: null,
      classId: null,
      duration: 60,
      scheduledDate: '',
      scheduledTime: '',
    });
    setAutoConfig({ easyCount: 5, mediumCount: 3, hardCount: 2 });
    setIsDraft(true);
  };

  const getStatusBadge = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'published':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">Published</Badge>;
      case 'ongoing':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Ongoing</Badge>;
      case 'completed':
        return <Badge variant="outline">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status || '—'}</Badge>;
    }
  };

  const getSubjectName = (subjectId: number) => {
    return subjects?.find(s => s.id === subjectId)?.name || '—';
  };

  const getClassName = (classId: number) => {
    return classes?.find(c => c.classId === classId)?.className || '—';
  };

  // --- Render helpers ---

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
              Manually select questions from the question bank
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

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Exam Title *</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter exam title"
          />
        </div>
        <div className="space-y-2">
          <Label>Subject *</Label>
          <Select 
            value={formData.subjectId?.toString() || ''} 
            onValueChange={(v) => setFormData({ ...formData, subjectId: parseInt(v), classId: null })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects?.map(s => (
                <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Assign to Class *</Label>
          <Select 
            value={formData.classId?.toString() || ''} 
            onValueChange={(v) => setFormData({ ...formData, classId: parseInt(v) })}
          >
            <SelectTrigger>
              <SelectValue placeholder={formData.subjectId ? "Select a class" : "Select a subject first"} />
            </SelectTrigger>
            <SelectContent>
              {filteredClasses.map(cls => (
                <SelectItem key={cls.classId} value={cls.classId.toString()}>
                  {cls.className} ({cls.studentCount} students)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Duration (minutes) *</Label>
          <Input
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
          <Label>Schedule Date</Label>
          <Input
            type="date"
            value={formData.scheduledDate}
            onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Schedule Time</Label>
          <Input
            type="time"
            value={formData.scheduledTime}
            onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
          />
        </div>
      </div>
    </div>
  );

  const renderAutoStep2 = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold">Question Distribution</Label>
        <p className="text-sm text-muted-foreground mb-4">
          Set the number of questions for each difficulty level
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-emerald-500/50 bg-emerald-500/10 dark:bg-emerald-950/40 dark:border-emerald-400/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-emerald-700 dark:text-emerald-400">Easy Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="number"
                value={autoConfig.easyCount}
                onChange={(e) => setAutoConfig({ ...autoConfig, easyCount: parseInt(e.target.value) || 0 })}
                min={0}
                className="text-center text-lg font-bold"
              />
            </CardContent>
          </Card>
          <Card className="border-amber-500/50 bg-amber-500/10 dark:bg-amber-950/40 dark:border-amber-400/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-amber-700 dark:text-amber-400">Medium Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="number"
                value={autoConfig.mediumCount}
                onChange={(e) => setAutoConfig({ ...autoConfig, mediumCount: parseInt(e.target.value) || 0 })}
                min={0}
                className="text-center text-lg font-bold"
              />
            </CardContent>
          </Card>
          <Card className="border-rose-500/50 bg-rose-500/10 dark:bg-rose-950/40 dark:border-rose-400/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-rose-700 dark:text-rose-400">Hard Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="number"
                value={autoConfig.hardCount}
                onChange={(e) => setAutoConfig({ ...autoConfig, hardCount: parseInt(e.target.value) || 0 })}
                min={0}
                className="text-center text-lg font-bold"
              />
            </CardContent>
          </Card>
        </div>
        <div className="mt-4 p-3 bg-muted rounded-lg flex items-center justify-between">
          <span className="text-sm font-medium">
            Total Questions: {autoConfig.easyCount + autoConfig.mediumCount + autoConfig.hardCount}
          </span>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Shuffle className="h-3 w-3" />
            Randomized
          </Badge>
        </div>
      </div>
    </div>
  );

  const renderManualStep2 = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
        <span className="text-sm font-medium">
          Selected: {selectedQuestionIds.length} questions
        </span>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search questions by content, type, difficulty, or chapter..."
          value={questionSearch}
          onChange={(e) => setQuestionSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      {questionsLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      ) : !allQuestions.length ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          {formData.subjectId ? 'No questions found for this subject.' : 'Please select a subject first.'}
        </p>
      ) : (
        <div className="max-h-[350px] overflow-y-auto border rounded-lg">
          <Table>
             <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuestions.map((q) => (
                <TableRow
                  key={q.id}
                  className={selectedQuestionIds.includes(q.id) ? 'bg-primary/5' : 'cursor-pointer hover:bg-muted/50'}
                  onClick={() => handleQuestionToggle(q.id)}
                >
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedQuestionIds.includes(q.id)}
                      onChange={() => handleQuestionToggle(q.id)}
                      className="rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium max-w-[250px] truncate">{q.questionContent || '—'}</TableCell>
                  <TableCell><Badge variant="outline">{q.questionType || '—'}</Badge></TableCell>
                  <TableCell><Badge variant="outline">{q.difficulty || '—'}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{q.points || '—'}</TableCell>
                </TableRow>
              ))}
              {filteredQuestions.length === 0 && questionSearch && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-6">
                    No questions match "{questionSearch}"
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Exam Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Title</p>
              <p className="font-medium">{formData.title || 'Untitled'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Subject</p>
              <p className="font-medium">{formData.subjectId ? getSubjectName(formData.subjectId) : '—'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Class</p>
              <p className="font-medium">{formData.classId ? getClassName(formData.classId) : '—'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">{formData.duration} minutes</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mode</p>
              <p className="font-medium">{createMode === 'auto' ? 'Auto Builder' : 'Manual Builder'}</p>
            </div>
            {createMode === 'auto' && (
              <div>
                <p className="text-sm text-muted-foreground">Questions</p>
                <p className="font-medium">
                  {autoConfig.easyCount} easy, {autoConfig.mediumCount} medium, {autoConfig.hardCount} hard
                </p>
              </div>
            )}
            {createMode === 'manual' && (
              <div>
                <p className="text-sm text-muted-foreground">Selected Questions</p>
                <p className="font-medium">{selectedQuestionIds.length}</p>
              </div>
            )}
            {formData.scheduledDate && (
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="font-medium">{formData.scheduledDate} {formData.scheduledTime}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <div className="flex items-center gap-2 mt-1">
                <Label htmlFor="isDraft" className="font-medium cursor-pointer">
                  {isDraft ? 'Draft' : 'Published'}
                </Label>
                <input
                  id="isDraft"
                  type="checkbox"
                  checked={isDraft}
                  onChange={(e) => setIsDraft(e.target.checked)}
                  className="accent-primary"
                />
                <span className="text-xs text-muted-foreground">Save as draft</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const canProceed = () => {
    if (currentStep === 1) return !!formData.title && !!formData.classId && !!formData.subjectId;
    if (createMode === 'manual' && currentStep === 2) return selectedQuestionIds.length > 0;
    if (createMode === 'auto' && currentStep === 2) return (autoConfig.easyCount + autoConfig.mediumCount + autoConfig.hardCount) > 0;
    return true;
  };

  const examList = exams || [];

  return (
    <DashboardLayout navItems={adminNavItems} role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Exams</h1>
            <p className="text-muted-foreground">
              Manage all exams across all teachers and subjects
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Exam
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {examsLoading ? <Skeleton className="h-8 w-12" /> : examList.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {examsLoading ? <Skeleton className="h-8 w-12" /> : 
                  examList.length > 0 
                    ? `${Math.round(examList.reduce((s, e) => s + e.duration, 0) / examList.length)} min` 
                    : '—'
                }
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {examsLoading ? <Skeleton className="h-8 w-12" /> : 
                  examList.filter(e => new Date(e.examDate) > new Date()).length
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Exams Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Exams</CardTitle>
            <CardDescription>View and manage exams from all teachers across all subjects</CardDescription>
          </CardHeader>
          <CardContent>
            {examsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : examList.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No exams found. Create your first exam!</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Exam Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {examList.map((exam) => (
                    <TableRow key={exam.examId}>
                      <TableCell className="font-medium">{exam.examTitle}</TableCell>
                      <TableCell>{getSubjectName(exam.subjectId)}</TableCell>
                      <TableCell>{getClassName(exam.classId)}</TableCell>
                      <TableCell>{exam.duration} min</TableCell>
                      <TableCell>
                        {exam.examDate 
                          ? new Date(exam.examDate).toLocaleDateString()
                          : '—'
                        }
                      </TableCell>
                      <TableCell>{getStatusBadge(exam.examStatus)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {(exam.examStatus?.toLowerCase() === 'published' || exam.examStatus?.toLowerCase() === 'ongoing') && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                setMonitorExam({ id: exam.examId.toString(), title: exam.examTitle });
                                setShowMonitor(true);
                              }}
                              title="Monitor Exam"
                            >
                              <Monitor className="h-4 w-4 text-primary" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => setViewExam(exam)} title="View Details">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(exam)} title="Edit Exam">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive"
                            onClick={() => handleDeleteExam(exam.examId, exam.examTitle)}
                            disabled={deleteExamMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
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
                  : `Step ${currentStep} of 3: ${
                      currentStep === 1 ? 'Exam Details' : 
                      currentStep === 2 ? (createMode === 'auto' ? 'Question Distribution' : 'Select Questions') : 
                      'Review & Create'
                    }`
                }
              </DialogDescription>
            </DialogHeader>

            {!createMode && renderModeSelection()}

            {createMode && currentStep === 1 && renderStep1()}
            {createMode === 'manual' && currentStep === 2 && renderManualStep2()}
            {createMode === 'auto' && currentStep === 2 && renderAutoStep2()}
            {currentStep === 3 && renderReviewStep()}

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
                  {currentStep < 3 && (
                    <Button onClick={() => setCurrentStep(currentStep + 1)} disabled={!canProceed()}>
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                  {currentStep === 3 && (
                    <Button onClick={handleCreateExam} disabled={createExamMutation.isPending}>
                      <Check className="mr-2 h-4 w-4" />
                      {createExamMutation.isPending ? 'Creating...' : 'Create Exam'}
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

        {/* View Exam Details Dialog */}
        <Dialog open={!!viewExam} onOpenChange={(open) => { if (!open) setViewExam(null); }}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Exam Details</DialogTitle>
              <DialogDescription>View exam information</DialogDescription>
            </DialogHeader>
            {viewExam && (
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Title</p>
                  <p className="font-medium">{viewExam.examTitle}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Subject</p>
                  <p className="font-medium">{getSubjectName(viewExam.subjectId)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Class</p>
                  <p className="font-medium">{getClassName(viewExam.classId)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{viewExam.duration} min</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Exam Date</p>
                  <p className="font-medium">{viewExam.examDate ? new Date(viewExam.examDate).toLocaleString() : '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Paper Type</p>
                  <p className="font-medium">{viewExam.examPaperType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Exam Status</p>
                  <div>{getStatusBadge(viewExam.examStatus)}</div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Paper Status</p>
                  <div>{getStatusBadge(viewExam.examPaperStatus)}</div>
                </div>
                {viewExam.examPaperType === 'AUTO' && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Question Distribution</p>
                    <p className="font-medium">{viewExam.easyQuestions} easy, {viewExam.mediumQuestions} medium, {viewExam.hardQuestions} hard</p>
                  </div>
                )}
                {viewExam.examPaperType === 'MANUAL' && viewExam.questionIds?.length > 0 && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Question IDs</p>
                    <p className="font-medium">{viewExam.questionIds.join(', ')}</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewExam(null)}>Close</Button>
              <Button onClick={() => { if (viewExam) { handleOpenEdit(viewExam); setViewExam(null); } }}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Exam Dialog */}
        <Dialog open={showEditDialog} onOpenChange={(open) => { if (!open) { setShowEditDialog(false); setEditingExam(null); } }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Exam</DialogTitle>
              <DialogDescription>Update exam details{editingExam ? ` — ${editingExam.examPaperType} mode` : ''}</DialogDescription>
            </DialogHeader>
            {editingExam && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Exam Title *</Label>
                    <Input value={editFormData.title} onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Subject *</Label>
                    <Select value={editFormData.subjectId?.toString() || ''} onValueChange={(v) => setEditFormData({ ...editFormData, subjectId: parseInt(v) })}>
                      <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                      <SelectContent>
                        {subjects?.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Class *</Label>
                    <Select value={editFormData.classId?.toString() || ''} onValueChange={(v) => setEditFormData({ ...editFormData, classId: parseInt(v) })}>
                      <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                      <SelectContent>
                        {editFilteredClasses.map(cls => <SelectItem key={cls.classId} value={cls.classId.toString()}>{cls.className}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Duration (min) *</Label>
                    <Input type="number" value={editFormData.duration} onChange={(e) => setEditFormData({ ...editFormData, duration: parseInt(e.target.value) || 60 })} min={10} max={300} />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" value={editFormData.scheduledDate} onChange={(e) => setEditFormData({ ...editFormData, scheduledDate: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input type="time" value={editFormData.scheduledTime} onChange={(e) => setEditFormData({ ...editFormData, scheduledTime: e.target.value })} />
                  </div>
                </div>

                {editingExam.examPaperType === 'AUTO' && (
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Easy Questions</Label>
                      <Input type="number" value={editAutoConfig.easyCount} onChange={(e) => setEditAutoConfig({ ...editAutoConfig, easyCount: parseInt(e.target.value) || 0 })} min={0} />
                    </div>
                    <div className="space-y-2">
                      <Label>Medium Questions</Label>
                      <Input type="number" value={editAutoConfig.mediumCount} onChange={(e) => setEditAutoConfig({ ...editAutoConfig, mediumCount: parseInt(e.target.value) || 0 })} min={0} />
                    </div>
                    <div className="space-y-2">
                      <Label>Hard Questions</Label>
                      <Input type="number" value={editAutoConfig.hardCount} onChange={(e) => setEditAutoConfig({ ...editAutoConfig, hardCount: parseInt(e.target.value) || 0 })} min={0} />
                    </div>
                  </div>
                )}

                {editingExam.examPaperType === 'MANUAL' && (
                  <div className="space-y-2">
                    <Label>Question IDs (comma-separated)</Label>
                    <Input
                      value={editQuestionIds.join(', ')}
                      onChange={(e) => setEditQuestionIds(e.target.value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)))}
                      placeholder="e.g. 452, 453, 454"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input id="editIsDraft" type="checkbox" checked={editIsDraft} onChange={(e) => setEditIsDraft(e.target.checked)} className="accent-primary" />
                  <Label htmlFor="editIsDraft" className="cursor-pointer">Save as draft</Label>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => { setShowEditDialog(false); setEditingExam(null); }}>Cancel</Button>
              <Button onClick={handleUpdateExam} disabled={updateExamMutation.isPending}>
                <Check className="mr-2 h-4 w-4" />
                {updateExamMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminExams;
