import { Toaster } from "@/components/ui/toaster";
import AdminExams from "./pages/admin/AdminExams";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Exam from "./pages/Exam";
import Results from "./pages/Results";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSubjects from "./pages/admin/AdminSubjects";
import AdminClasses from "./pages/admin/AdminClasses";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherQuestionBank from "./pages/teacher/TeacherQuestionBank";
import TeacherClassroom from "./pages/teacher/TeacherClassroom";
import TeacherExams from "./pages/teacher/TeacherExams";
import TeacherReports from "./pages/teacher/TeacherReports";
import TeacherSettings from "./pages/teacher/TeacherSettings";
import TeacherStudents from "./pages/teacher/TeacherStudents";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentSubjects from "./pages/student/StudentSubjects";
import StudentClassrooms from "./pages/student/StudentClassrooms";
import StudentExams from "./pages/student/StudentExams";
import StudentResults from "./pages/student/StudentResults";
import StudentSettings from "./pages/student/StudentSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/exam" element={<Exam />} />
              <Route path="/results" element={<Results />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/subjects" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminSubjects />
                </ProtectedRoute>
              } />
              <Route path="/admin/classes" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminClasses />
                </ProtectedRoute>
              } />
              <Route path="/admin/exams" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminExams />
                </ProtectedRoute>
              } />
              
              {/* Teacher Routes */}
              <Route path="/teacher" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherDashboard />
                </ProtectedRoute>
              } />
              <Route path="/teacher/questions" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherQuestionBank />
                </ProtectedRoute>
              } />
              <Route path="/teacher/classroom" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherClassroom />
                </ProtectedRoute>
              } />
              <Route path="/teacher/exams" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherExams />
                </ProtectedRoute>
              } />
              <Route path="/teacher/reports" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherReports />
                </ProtectedRoute>
              } />
              <Route path="/teacher/settings" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherSettings />
                </ProtectedRoute>
              } />
              <Route path="/teacher/students" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherStudents />
                </ProtectedRoute>
              } />
              
              {/* Student Routes */}
              <Route path="/student" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              <Route path="/student/subjects" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentSubjects />
                </ProtectedRoute>
              } />
              <Route path="/student/classrooms" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentClassrooms />
                </ProtectedRoute>
              } />
              <Route path="/student/exams" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentExams />
                </ProtectedRoute>
              } />
              <Route path="/student/results" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentResults />
                </ProtectedRoute>
              } />
              <Route path="/student/settings" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentSettings />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
