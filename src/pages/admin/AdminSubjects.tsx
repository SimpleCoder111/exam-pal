import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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

// Types
interface Chapter {
  id: string;
  name: string;
  description: string;
  orderIndex: number;
  isActive: boolean;
  questionCount: number;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  isActive: boolean;
  chapters: Chapter[];
  createdAt: string;
  updatedAt: string;
}

// Mock Data
const mockSubjects: Subject[] = [
  {
    id: '1',
    name: 'Mathematics',
    code: 'MATH101',
    description: 'Fundamental mathematics covering algebra, geometry, and calculus',
    isActive: true,
    chapters: [
      { id: '1-1', name: 'Algebra Basics', description: 'Introduction to algebraic expressions', orderIndex: 1, isActive: true, questionCount: 45 },
      { id: '1-2', name: 'Linear Equations', description: 'Solving linear equations and inequalities', orderIndex: 2, isActive: true, questionCount: 38 },
      { id: '1-3', name: 'Quadratic Equations', description: 'Quadratic formulas and applications', orderIndex: 3, isActive: true, questionCount: 52 },
      { id: '1-4', name: 'Geometry Fundamentals', description: 'Basic geometric shapes and properties', orderIndex: 4, isActive: false, questionCount: 0 },
    ],
    createdAt: '2024-01-15',
    updatedAt: '2024-03-20',
  },
  {
    id: '2',
    name: 'Physics',
    code: 'PHY101',
    description: 'Introduction to physics principles and mechanics',
    isActive: true,
    chapters: [
      { id: '2-1', name: 'Motion and Forces', description: 'Newton\'s laws and applications', orderIndex: 1, isActive: true, questionCount: 67 },
      { id: '2-2', name: 'Energy and Work', description: 'Conservation of energy principles', orderIndex: 2, isActive: true, questionCount: 43 },
      { id: '2-3', name: 'Waves and Sound', description: 'Wave properties and acoustics', orderIndex: 3, isActive: true, questionCount: 29 },
    ],
    createdAt: '2024-01-20',
    updatedAt: '2024-03-18',
  },
  {
    id: '3',
    name: 'Chemistry',
    code: 'CHEM101',
    description: 'Basic chemistry concepts and laboratory principles',
    isActive: true,
    chapters: [
      { id: '3-1', name: 'Atomic Structure', description: 'Atoms, electrons, and periodic table', orderIndex: 1, isActive: true, questionCount: 55 },
      { id: '3-2', name: 'Chemical Bonding', description: 'Types of chemical bonds', orderIndex: 2, isActive: true, questionCount: 41 },
    ],
    createdAt: '2024-02-01',
    updatedAt: '2024-03-15',
  },
  {
    id: '4',
    name: 'Biology',
    code: 'BIO101',
    description: 'Life sciences and cellular biology',
    isActive: false,
    chapters: [
      { id: '4-1', name: 'Cell Structure', description: 'Cell components and functions', orderIndex: 1, isActive: true, questionCount: 38 },
    ],
    createdAt: '2024-02-10',
    updatedAt: '2024-02-10',
  },
];

const AdminSubjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Subject dialog state
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    description: '',
    isActive: true,
  });

  // Chapter dialog state
  const [isChapterDialogOpen, setIsChapterDialogOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [chapterForm, setChapterForm] = useState({
    name: '',
    description: '',
    isActive: true,
  });

  // Delete confirmation state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'subject' | 'chapter'; id: string; subjectId?: string } | null>(null);

  // Filter subjects based on search
  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Subject CRUD operations
  const handleOpenSubjectDialog = (subject?: Subject) => {
    if (subject) {
      setEditingSubject(subject);
      setSubjectForm({
        name: subject.name,
        code: subject.code,
        description: subject.description,
        isActive: subject.isActive,
      });
    } else {
      setEditingSubject(null);
      setSubjectForm({ name: '', code: '', description: '', isActive: true });
    }
    setIsSubjectDialogOpen(true);
  };

  const handleSaveSubject = () => {
    // TODO: API call to create/update subject
    // POST /api/subjects or PUT /api/subjects/:id

    if (editingSubject) {
      setSubjects(
        subjects.map((s) =>
          s.id === editingSubject.id
            ? { ...s, ...subjectForm, updatedAt: new Date().toISOString().split('T')[0] }
            : s
        )
      );
      toast.success('Subject updated successfully');
    } else {
      const newSubject: Subject = {
        id: Date.now().toString(),
        ...subjectForm,
        chapters: [],
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setSubjects([...subjects, newSubject]);
      toast.success('Subject created successfully');
    }
    setIsSubjectDialogOpen(false);
  };

  const handleToggleSubjectStatus = (subjectId: string) => {
    // TODO: API call to toggle subject status
    // PATCH /api/subjects/:id/status

    setSubjects(
      subjects.map((s) =>
        s.id === subjectId ? { ...s, isActive: !s.isActive } : s
      )
    );
    toast.success('Subject status updated');
  };

  const handleDeleteSubject = () => {
    if (!deleteTarget || deleteTarget.type !== 'subject') return;

    // TODO: API call to delete subject
    // DELETE /api/subjects/:id

    setSubjects(subjects.filter((s) => s.id !== deleteTarget.id));
    setDeleteConfirmOpen(false);
    setDeleteTarget(null);
    toast.success('Subject deleted successfully');
  };

  // Chapter CRUD operations
  const handleOpenChapterDialog = (subjectId: string, chapter?: Chapter) => {
    setSelectedSubjectId(subjectId);
    if (chapter) {
      setEditingChapter(chapter);
      setChapterForm({
        name: chapter.name,
        description: chapter.description,
        isActive: chapter.isActive,
      });
    } else {
      setEditingChapter(null);
      setChapterForm({ name: '', description: '', isActive: true });
    }
    setIsChapterDialogOpen(true);
  };

  const handleSaveChapter = () => {
    if (!selectedSubjectId) return;

    // TODO: API call to create/update chapter
    // POST /api/subjects/:subjectId/chapters or PUT /api/chapters/:id

    if (editingChapter) {
      setSubjects(
        subjects.map((s) =>
          s.id === selectedSubjectId
            ? {
                ...s,
                chapters: s.chapters.map((c) =>
                  c.id === editingChapter.id ? { ...c, ...chapterForm } : c
                ),
                updatedAt: new Date().toISOString().split('T')[0],
              }
            : s
        )
      );
      toast.success('Chapter updated successfully');
    } else {
      const subject = subjects.find((s) => s.id === selectedSubjectId);
      const newChapter: Chapter = {
        id: `${selectedSubjectId}-${Date.now()}`,
        ...chapterForm,
        orderIndex: (subject?.chapters.length || 0) + 1,
        questionCount: 0,
      };
      setSubjects(
        subjects.map((s) =>
          s.id === selectedSubjectId
            ? {
                ...s,
                chapters: [...s.chapters, newChapter],
                updatedAt: new Date().toISOString().split('T')[0],
              }
            : s
        )
      );
      toast.success('Chapter added successfully');
    }
    setIsChapterDialogOpen(false);
  };

  const handleToggleChapterStatus = (subjectId: string, chapterId: string) => {
    // TODO: API call to toggle chapter status
    // PATCH /api/chapters/:id/status

    setSubjects(
      subjects.map((s) =>
        s.id === subjectId
          ? {
              ...s,
              chapters: s.chapters.map((c) =>
                c.id === chapterId ? { ...c, isActive: !c.isActive } : c
              ),
            }
          : s
      )
    );
    toast.success('Chapter status updated');
  };

  const handleDeleteChapter = () => {
    if (!deleteTarget || deleteTarget.type !== 'chapter' || !deleteTarget.subjectId) return;

    // TODO: API call to delete chapter
    // DELETE /api/chapters/:id

    setSubjects(
      subjects.map((s) =>
        s.id === deleteTarget.subjectId
          ? {
              ...s,
              chapters: s.chapters.filter((c) => c.id !== deleteTarget.id),
            }
          : s
      )
    );
    setDeleteConfirmOpen(false);
    setDeleteTarget(null);
    toast.success('Chapter deleted successfully');
  };

  const confirmDelete = (type: 'subject' | 'chapter', id: string, subjectId?: string) => {
    setDeleteTarget({ type, id, subjectId });
    setDeleteConfirmOpen(true);
  };

  // Stats
  const totalSubjects = subjects.length;
  const activeSubjects = subjects.filter((s) => s.isActive).length;
  const totalChapters = subjects.reduce((acc, s) => acc + s.chapters.length, 0);
  const totalQuestions = subjects.reduce(
    (acc, s) => acc + s.chapters.reduce((cAcc, c) => cAcc + c.questionCount, 0),
    0
  );

  return (
    <DashboardLayout navItems={adminNavItems} role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Subject Management</h1>
            <p className="text-muted-foreground">
              Manage subjects and their chapters for examinations
            </p>
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
              <div className="text-2xl font-bold">{totalSubjects}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subjects</CardTitle>
              <Book className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeSubjects}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Chapters</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalChapters}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
              <List className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalQuestions}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and View Toggle */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search subjects by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Subjects List/Grid */}
        {viewMode === 'list' ? (
          <Card>
            <CardContent className="p-0">
              <Accordion type="multiple" className="w-full">
                {filteredSubjects.map((subject) => (
                  <AccordionItem key={subject.id} value={subject.id} className="border-b last:border-b-0">
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
                              <Badge variant={subject.isActive ? 'default' : 'secondary'}>
                                {subject.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {subject.chapters.length} chapters • {subject.chapters.reduce((acc, c) => acc + c.questionCount, 0)} questions
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
                          <DropdownMenuItem onClick={() => handleToggleSubjectStatus(subject.id)}>
                            <Switch className="mr-2 h-4 w-4" />
                            {subject.isActive ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => confirmDelete('subject', subject.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Subject
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <AccordionContent className="px-4 pb-4">
                      <div className="ml-14">
                        <p className="text-sm text-muted-foreground mb-4">{subject.description}</p>
                        {subject.chapters.length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-12">#</TableHead>
                                <TableHead>Chapter Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-center">Questions</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {subject.chapters
                                .sort((a, b) => a.orderIndex - b.orderIndex)
                                .map((chapter) => (
                                  <TableRow key={chapter.id}>
                                    <TableCell>
                                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                                    </TableCell>
                                    <TableCell className="font-medium">{chapter.name}</TableCell>
                                    <TableCell className="text-muted-foreground max-w-xs truncate">
                                      {chapter.description}
                                    </TableCell>
                                    <TableCell className="text-center">{chapter.questionCount}</TableCell>
                                    <TableCell className="text-center">
                                      <Badge variant={chapter.isActive ? 'default' : 'secondary'}>
                                        {chapter.isActive ? 'Active' : 'Inactive'}
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
                                          <DropdownMenuItem
                                            onClick={() => handleOpenChapterDialog(subject.id, chapter)}
                                          >
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={() => handleToggleChapterStatus(subject.id, chapter.id)}
                                          >
                                            <Switch className="mr-2 h-4 w-4" />
                                            {chapter.isActive ? 'Deactivate' : 'Activate'}
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            className="text-destructive"
                                            onClick={() => confirmDelete('chapter', chapter.id, subject.id)}
                                          >
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
                            <Button
                              variant="link"
                              onClick={() => handleOpenChapterDialog(subject.id)}
                              className="mt-2"
                            >
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
                        <Badge variant="outline" className="mt-1">
                          {subject.code}
                        </Badge>
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
                        <DropdownMenuItem onClick={() => handleToggleSubjectStatus(subject.id)}>
                          <Switch className="mr-2 h-4 w-4" />
                          {subject.isActive ? 'Deactivate' : 'Activate'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => confirmDelete('subject', subject.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Subject
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {subject.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {subject.chapters.length} chapters
                      </span>
                      <span className="flex items-center gap-1">
                        <List className="h-4 w-4" />
                        {subject.chapters.reduce((acc, c) => acc + c.questionCount, 0)} questions
                      </span>
                    </div>
                    <Badge variant={subject.isActive ? 'default' : 'secondary'}>
                      {subject.isActive ? 'Active' : 'Inactive'}
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
                {editingSubject
                  ? 'Update the subject information below.'
                  : 'Fill in the details to create a new subject.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Subject Name</Label>
                <Input
                  id="name"
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  placeholder="e.g., Mathematics"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="code">Subject Code</Label>
                <Input
                  id="code"
                  value={subjectForm.code}
                  onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                  placeholder="e.g., MATH101"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={subjectForm.description}
                  onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                  placeholder="Brief description of the subject..."
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">Active Status</Label>
                <Switch
                  id="isActive"
                  checked={subjectForm.isActive}
                  onCheckedChange={(checked) => setSubjectForm({ ...subjectForm, isActive: checked })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSubjectDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveSubject} disabled={!subjectForm.name || !subjectForm.code}>
                {editingSubject ? 'Save Changes' : 'Create Subject'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Chapter Dialog */}
        <Dialog open={isChapterDialogOpen} onOpenChange={setIsChapterDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingChapter ? 'Edit Chapter' : 'Add New Chapter'}</DialogTitle>
              <DialogDescription>
                {editingChapter
                  ? 'Update the chapter information below.'
                  : 'Fill in the details to add a new chapter.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="chapterName">Chapter Name</Label>
                <Input
                  id="chapterName"
                  value={chapterForm.name}
                  onChange={(e) => setChapterForm({ ...chapterForm, name: e.target.value })}
                  placeholder="e.g., Introduction to Algebra"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="chapterDescription">Description</Label>
                <Textarea
                  id="chapterDescription"
                  value={chapterForm.description}
                  onChange={(e) => setChapterForm({ ...chapterForm, description: e.target.value })}
                  placeholder="Brief description of the chapter..."
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="chapterIsActive">Active Status</Label>
                <Switch
                  id="chapterIsActive"
                  checked={chapterForm.isActive}
                  onCheckedChange={(checked) => setChapterForm({ ...chapterForm, isActive: checked })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsChapterDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveChapter} disabled={!chapterForm.name}>
                {editingChapter ? 'Save Changes' : 'Add Chapter'}
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
