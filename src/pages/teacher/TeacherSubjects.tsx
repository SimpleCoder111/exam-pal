import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Book, BookOpen, Search } from 'lucide-react';
import { teacherNavItems } from '@/config/teacherNavItems';
import { useTeacherSubjects } from '@/hooks/useTeacherSubjects';

const TeacherSubjects = () => {
  const { data: subjects, isLoading } = useTeacherSubjects();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubjects = (subjects || []).filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSubjects = (subjects || []).length;
  const activeSubjects = (subjects || []).filter((s) => s.active).length;
  const totalChapters = (subjects || []).reduce(
    (acc, s) => acc + (s.chapterResponseList?.length ?? 0),
    0
  );

  return (
    <DashboardLayout navItems={teacherNavItems} role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Subjects</h1>
          <p className="text-muted-foreground">
            View your assigned subjects and chapters
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
              <Book className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <div className="text-2xl font-bold">{totalSubjects}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subjects</CardTitle>
              <Book className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <div className="text-2xl font-bold">{activeSubjects}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Chapters</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <div className="text-2xl font-bold">{totalChapters}</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search subjects by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Subjects List */}
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
        ) : !filteredSubjects.length ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-1">No subjects found</h3>
              <p className="text-muted-foreground text-sm">
                {searchQuery
                  ? 'Try adjusting your search query.'
                  : 'No subjects have been assigned to you yet.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Accordion type="multiple" className="w-full">
                {filteredSubjects.map((subject) => (
                  <AccordionItem
                    key={subject.id}
                    value={String(subject.id)}
                    className="border-b last:border-b-0"
                  >
                    <AccordionTrigger className="px-4 hover:no-underline py-4">
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
                            {subject.chapterResponseList?.length ?? 0} chapters
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="ml-14">
                        {subject.description && (
                          <p className="text-sm text-muted-foreground mb-4">
                            {subject.description}
                          </p>
                        )}
                        {subject.chapterResponseList?.length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-12">#</TableHead>
                                <TableHead>Chapter Name</TableHead>
                                <TableHead className="text-center">Questions</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {[...subject.chapterResponseList]
                                .sort((a, b) => a.orderIndex - b.orderIndex)
                                .map((chapter, idx) => (
                                  <TableRow key={chapter.id}>
                                    <TableCell className="text-muted-foreground">
                                      {idx + 1}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                      {chapter.name}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {chapter.questionCount ?? 0}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <Badge
                                        variant={chapter.active ? 'default' : 'secondary'}
                                      >
                                        {chapter.active ? 'Active' : 'Inactive'}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No chapters available.
                          </p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherSubjects;
