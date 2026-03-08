import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import {
  Book,
  BookOpen,
  Edit,
  GripVertical,
  LayoutGrid,
  List,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { adminNavItems } from '@/config/adminNavItems';
import {
  useAdminSubjects,
  useCreateSubject,
  useUpdateSubject,
  useToggleSubjectStatus,
  useDeleteSubject,
  useAddChapters,
  useUpdateChapter,
  useDeleteChapter,
  useToggleChapterStatus,
  type SubjectResponse,
  type ChapterResponse,
} from '@/hooks/useAdminSubjects';

const AdminSubjects = () => {
  const { data: subjects, isLoading } = useAdminSubjects();
  const createSubject = useCreateSubject();
  const updateSubject = useUpdateSubject();
  const toggleSubjectStatus = useToggleSubjectStatus();
  const deleteSubjectMutation = useDeleteSubject();
  const addChapters = useAddChapters();
  const updateChapter = useUpdateChapter();
  const deleteChapterMutation = useDeleteChapter();
  const toggleChapterStatus = useToggleChapterStatus();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Subject dialog state
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectResponse | null>(null);
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    description: '',
    isActive: true,
  });

  // Chapter dialog state
  const [isChapterDialogOpen, setIsChapterDialogOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<ChapterResponse | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [chapterForms, setChapterForms] = useState<Array<{ name: string; description: string; isActive: boolean }>>([
    { name: '', description: '', isActive: true },
  ]);

  // Delete confirmation state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'subject' | 'chapter'; id: number; subjectId?: number } | null>(null);

  // Filter subjects
  const filteredSubjects = (subjects || []).filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Subject CRUD
  const handleOpenSubjectDialog = (subject?: SubjectResponse) => {
    if (subject) {
      setEditingSubject(subject);
      setSubjectForm({ name: subject.name, code: subject.code, description: subject.description, isActive: subject.active });
    } else {
      setEditingSubject(null);
      setSubjectForm({ name: '', code: '', description: '', isActive: true });
    }
    setIsSubjectDialogOpen(true);
  };

  const handleSaveSubject = () => {
    if (editingSubject) {
      updateSubject.mutate(
        { id: editingSubject.id, ...subjectForm },
        {
          onSuccess: () => { toast.success('Subject updated successfully'); setIsSubjectDialogOpen(false); },
          onError: () => toast.error('Failed to update subject'),
        }
      );
    } else {
      createSubject.mutate(subjectForm, {
        onSuccess: () => { toast.success('Subject created successfully'); setIsSubjectDialogOpen(false); },
        onError: () => toast.error('Failed to create subject'),
      });
    }
  };

  const handleToggleSubjectStatus = (subject: SubjectResponse) => {
    toggleSubjectStatus.mutate(
      { id: subject.id, isActive: !subject.active },
      {
        onSuccess: () => toast.success('Subject status updated'),
        onError: () => toast.error('Failed to update status'),
      }
    );
  };

  const handleDeleteSubject = () => {
    if (!deleteTarget || deleteTarget.type !== 'subject') return;
    deleteSubjectMutation.mutate(deleteTarget.id, {
      onSuccess: () => { toast.success('Subject deleted successfully'); setDeleteConfirmOpen(false); setDeleteTarget(null); },
      onError: () => toast.error('Failed to delete subject'),
    });
  };

  // Chapter CRUD
  const handleOpenChapterDialog = (subjectId: number, chapter?: ChapterResponse) => {
    setSelectedSubjectId(subjectId);
    if (chapter) {
      setEditingChapter(chapter);
      setChapterForms([{ name: chapter.name, description: '', isActive: chapter.active }]);
    } else {
      setEditingChapter(null);
      setChapterForms([{ name: '', description: '', isActive: true }]);
    }
    setIsChapterDialogOpen(true);
  };

  const handleAddChapterForm = () => {
    setChapterForms([...chapterForms, { name: '', description: '', isActive: true }]);
  };

  const handleRemoveChapterForm = (index: number) => {
    if (chapterForms.length > 1) setChapterForms(chapterForms.filter((_, i) => i !== index));
  };

  const handleChapterFormChange = (index: number, field: string, value: string | boolean) => {
    const updated = [...chapterForms];
    updated[index] = { ...updated[index], [field]: value };
    setChapterForms(updated);
  };

  const handleSaveChapter = () => {
    if (!selectedSubjectId) return;

    if (editingChapter) {
      const form = chapterForms[0];
      updateChapter.mutate(
        { chapterId: editingChapter.id, name: form.name, description: form.description, index: editingChapter.orderIndex, isActive: form.isActive },
        {
          onSuccess: () => { toast.success('Chapter updated successfully'); setIsChapterDialogOpen(false); },
          onError: () => toast.error('Failed to update chapter'),
        }
      );
    } else {
      const validChapters = chapterForms.filter((cf) => cf.name.trim() !== '');
      if (validChapters.length === 0) { toast.error('Please add at least one chapter with a name'); return; }

      const subject = subjects?.find((s) => s.id === selectedSubjectId);
      const startIndex = (subject?.chapterResponseList.length || 0) + 1;

      addChapters.mutate(
        {
          subjectId: selectedSubjectId,
          chapters: validChapters.map((cf, i) => ({ name: cf.name, description: cf.description, isActive: cf.isActive, index: startIndex + i })),
        },
        {
          onSuccess: () => { toast.success(`${validChapters.length} chapter(s) added successfully`); setIsChapterDialogOpen(false); },
          onError: () => toast.error('Failed to add chapters'),
        }
      );
    }
  };

  const handleToggleChapterStatus = (chapter: ChapterResponse) => {
    toggleChapterStatus.mutate(
      { chapterId: chapter.id, isActive: !chapter.active },
      {
        onSuccess: () => toast.success('Chapter status updated'),
        onError: () => toast.error('Failed to update chapter status'),
      }
    );
  };

  const handleDeleteChapter = () => {
    if (!deleteTarget || deleteTarget.type !== 'chapter') return;
    deleteChapterMutation.mutate(deleteTarget.id, {
      onSuccess: () => { toast.success('Chapter deleted successfully'); setDeleteConfirmOpen(false); setDeleteTarget(null); },
      onError: () => toast.error('Failed to delete chapter'),
    });
  };

  const confirmDelete = (type: 'subject' | 'chapter', id: number, subjectId?: number) => {
    setDeleteTarget({ type, id, subjectId });
    setDeleteConfirmOpen(true);
  };

  // Stats
  const totalSubjects = (subjects || []).length;
  const activeSubjects = (subjects || []).filter((s) => s.active).length;
  const totalChapters = (subjects || []).reduce((acc, s) => acc + s.chapterResponseList.length, 0);
  const totalQuestions = (subjects || []).reduce(
    (acc, s) => acc + s.chapterResponseList.reduce((cAcc, c) => cAcc + c.questionCount, 0),
    0
  );

  return (
    <DashboardLayout navItems={adminNavItems} role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Subject Management</h1>
            <p className="text-muted-foreground">Manage subjects and their chapters for examinations</p>
          </div>
          <Button onClick={() => handleOpenSubjectDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Subject
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
              <Book className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-12" /> : <div className="text-2xl font-bold">{totalSubjects}</div>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subjects</CardTitle>
              <Book className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-12" /> : <div className="text-2xl font-bold">{activeSubjects}</div>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Chapters</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-12" /> : <div className="text-2xl font-bold">{totalChapters}</div>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
              <List className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-12" /> : <div className="text-2xl font-bold">{totalQuestions}</div>}
            </CardContent>
          </Card>
        </div>

        {/* Search and View Toggle */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search subjects by name or code..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
          </div>
          <div className="flex gap-2">
            <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')}>
              <List className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')}>
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <Card>
            <CardContent className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : viewMode === 'list' ? (
          <Card>
            <CardContent className="p-0">
              <Accordion type="multiple" className="w-full">
                {filteredSubjects.map((subject) => (
                  <AccordionItem key={subject.id} value={String(subject.id)} className="border-b last:border-b-0">
                    <div className="flex items-center px-4">
                      <AccordionTrigger className="flex-1 hover:no-underline py-4">
                        <div className="flex items-center gap-4 text-left">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Book className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{subject.name}</span>
                              <Badge variant="outline">{subject.code}</Badge>
                              <Badge variant={subject.active ? 'default' : 'secondary'}>
                                {subject.active ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {subject.chapterResponseList.length} chapters • {subject.chapterResponseList.reduce((acc, c) => acc + c.questionCount, 0)} questions
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="ml-2">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenSubjectDialog(subject)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Subject
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenChapterDialog(subject.id)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Chapter
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleSubjectStatus(subject)}>
                            <Switch className="mr-2 h-4 w-4" />
                            {subject.active ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => confirmDelete('subject', subject.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Subject
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <AccordionContent className="px-4 pb-4">
                      <div className="ml-14">
                        <p className="text-sm text-muted-foreground mb-4">{subject.description}</p>
                        {subject.chapterResponseList.length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-12">#</TableHead>
                                <TableHead>Chapter Name</TableHead>
                                <TableHead className="text-center">Questions</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {[...subject.chapterResponseList]
                                .sort((a, b) => a.orderIndex - b.orderIndex)
                                .map((chapter) => (
                                  <TableRow key={chapter.id}>
                                    <TableCell>
                                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                                    </TableCell>
                                    <TableCell className="font-medium">{chapter.name}</TableCell>
                                    <TableCell className="text-center">{chapter.questionCount}</TableCell>
                                    <TableCell className="text-center">
                                      <Badge variant={chapter.active ? 'default' : 'secondary'}>
                                        {chapter.active ? 'Active' : 'Inactive'}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem onClick={() => handleOpenChapterDialog(subject.id, chapter)}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                          </DropdownMenuItem>
                                          <DropdownMenuItem onClick={() => handleToggleChapterStatus(chapter)}>
                                            <Switch className="mr-2 h-4 w-4" />
                                            {chapter.active ? 'Deactivate' : 'Activate'}
                                          </DropdownMenuItem>
                                          <DropdownMenuItem className="text-destructive" onClick={() => confirmDelete('chapter', chapter.id, subject.id)}>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No chapters yet</p>
                            <Button variant="link" onClick={() => handleOpenChapterDialog(subject.id)} className="mt-2">
                              Add first chapter
                            </Button>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              {filteredSubjects.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Book className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No subjects found</p>
                  <p className="text-sm">Try adjusting your search or add a new subject</p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSubjects.map((subject) => (
              <Card key={subject.id} className="relative">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Book className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{subject.name}</CardTitle>
                        <Badge variant="outline" className="mt-1">{subject.code}</Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenSubjectDialog(subject)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Subject
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenChapterDialog(subject.id)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Chapter
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleSubjectStatus(subject)}>
                          <Switch className="mr-2 h-4 w-4" />
                          {subject.active ? 'Deactivate' : 'Activate'}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => confirmDelete('subject', subject.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Subject
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{subject.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {subject.chapterResponseList.length} chapters
                      </span>
                      <span className="flex items-center gap-1">
                        <List className="h-4 w-4" />
                        {subject.chapterResponseList.reduce((acc, c) => acc + c.questionCount, 0)} questions
                      </span>
                    </div>
                    <Badge variant={subject.active ? 'default' : 'secondary'}>
                      {subject.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Subject Dialog */}
        <Dialog open={isSubjectDialogOpen} onOpenChange={setIsSubjectDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingSubject ? 'Edit Subject' : 'Add New Subject'}</DialogTitle>
              <DialogDescription>
                {editingSubject ? 'Update the subject information below.' : 'Fill in the details to create a new subject.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Subject Name</Label>
                <Input id="name" value={subjectForm.name} onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })} placeholder="e.g., Mathematics" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="code">Subject Code</Label>
                <Input id="code" value={subjectForm.code} onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })} placeholder="e.g., MATH101" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={subjectForm.description} onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })} placeholder="Brief description of the subject..." rows={3} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">Active Status</Label>
                <Switch id="isActive" checked={subjectForm.isActive} onCheckedChange={(checked) => setSubjectForm({ ...subjectForm, isActive: checked })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSubjectDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveSubject} disabled={!subjectForm.name || !subjectForm.code || createSubject.isPending || updateSubject.isPending}>
                {(createSubject.isPending || updateSubject.isPending) ? 'Saving...' : editingSubject ? 'Save Changes' : 'Create Subject'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Chapter Dialog */}
        <Dialog open={isChapterDialogOpen} onOpenChange={setIsChapterDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingChapter ? 'Edit Chapter' : 'Add Chapters'}</DialogTitle>
              <DialogDescription>
                {editingChapter
                  ? 'Update the chapter information below.'
                  : 'Add one or more chapters to this subject. Click "Add Another Chapter" to add multiple chapters at once.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {chapterForms.map((form, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg relative">
                  {!editingChapter && chapterForms.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => handleRemoveChapterForm(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                  {!editingChapter && chapterForms.length > 1 && (
                    <div className="text-sm font-medium text-muted-foreground mb-2">Chapter {index + 1}</div>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor={`chapterName-${index}`}>Chapter Name</Label>
                    <Input id={`chapterName-${index}`} value={form.name} onChange={(e) => handleChapterFormChange(index, 'name', e.target.value)} placeholder="e.g., Introduction to Algebra" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`chapterDescription-${index}`}>Description</Label>
                    <Textarea id={`chapterDescription-${index}`} value={form.description} onChange={(e) => handleChapterFormChange(index, 'description', e.target.value)} placeholder="Brief description of the chapter..." rows={2} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`chapterIsActive-${index}`}>Active Status</Label>
                    <Switch id={`chapterIsActive-${index}`} checked={form.isActive} onCheckedChange={(checked) => handleChapterFormChange(index, 'isActive', checked)} />
                  </div>
                </div>
              ))}
              {!editingChapter && (
                <Button type="button" variant="outline" className="w-full" onClick={handleAddChapterForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another Chapter
                </Button>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsChapterDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveChapter} disabled={chapterForms.every((f) => !f.name.trim()) || addChapters.isPending || updateChapter.isPending}>
                {(addChapters.isPending || updateChapter.isPending)
                  ? 'Saving...'
                  : editingChapter
                    ? 'Save Changes'
                    : `Add ${chapterForms.filter((f) => f.name.trim()).length} Chapter(s)`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                {deleteTarget?.type === 'subject'
                  ? 'This will permanently delete this subject and all its chapters. This action cannot be undone.'
                  : 'This will permanently delete this chapter. This action cannot be undone.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteTarget?.type === 'subject' ? handleDeleteSubject : handleDeleteChapter}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminSubjects;
