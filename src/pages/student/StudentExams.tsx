import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { studentNavItems } from "@/config/studentNavItems";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Clock,
  Calendar,
  BookOpen,
  AlertTriangle,
  Lock,
  Play,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Copy,
  Minimize2,
  Shield,
  Timer,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface Exam {
  id: string;
  title: string;
  subject: string;
  professor: string;
  scheduledAt: Date;
  duration: number; // minutes
  totalQuestions: number;
  status: "upcoming" | "active" | "completed" | "missed";
  score?: number;
  totalMarks?: number;
  subjectId: number;
}

// Mock exams - one old, one current (active), one upcoming
const mockExams: Exam[] = [
  {
    id: "exam-1",
    title: "Data Structures Mid-Term",
    subject: "Data Structures",
    professor: "Dr. Smith",
    scheduledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    duration: 60,
    totalQuestions: 40,
    status: "completed",
    score: 35,
    totalMarks: 40,
    subjectId: 51,
  },
  {
    id: "exam-2",
    title: "C Programming Final Exam",
    subject: "C Programming",
    professor: "Prof. Johnson",
    scheduledAt: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes from now (active - can enter)
    duration: 30,
    totalQuestions: 25,
    status: "active",
    subjectId: 52,
  },
  {
    id: "exam-3",
    title: "Algorithms Quiz",
    subject: "Algorithms",
    professor: "Dr. Williams",
    scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    duration: 45,
    totalQuestions: 30,
    status: "upcoming",
    subjectId: 53,
  },
];

const examRules = [
  {
    icon: Eye,
    title: "No Tab Switching",
    description: "Switching to other tabs or windows will be detected and counted as suspicious activity.",
  },
  {
    icon: Minimize2,
    title: "No Window Minimizing",
    description: "Minimizing the browser window is not allowed during the exam.",
  },
  {
    icon: Copy,
    title: "No Copy & Paste",
    description: "Copy and paste functionality is disabled during the exam.",
  },
  {
    icon: EyeOff,
    title: "No Developer Tools",
    description: "Opening browser developer tools or web inspector is strictly prohibited.",
  },
  {
    icon: Shield,
    title: "3 Warnings Policy",
    description: "You have 3 chances. On the 4th violation, your exam will be auto-submitted.",
  },
  {
    icon: Timer,
    title: "Auto-Save Enabled",
    description: "Your answers are automatically saved. You can continue even after network issues.",
  },
];

const StudentExams = () => {
  const navigate = useNavigate();
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [showRulesDialog, setShowRulesDialog] = useState(false);
  const [rulesAccepted, setRulesAccepted] = useState(false);

  const canEnterExam = (exam: Exam) => {
    const now = new Date();
    const examTime = new Date(exam.scheduledAt);
    const timeDiff = examTime.getTime() - now.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    
    // Can enter 5 minutes before exam start
    return minutesDiff <= 5 && exam.status === "active";
  };

  const getTimeUntilExam = (exam: Exam) => {
    const now = new Date();
    const examTime = new Date(exam.scheduledAt);
    const timeDiff = examTime.getTime() - now.getTime();
    
    if (timeDiff <= 0) return "Started";
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const handleEnterExam = (exam: Exam) => {
    setSelectedExam(exam);
    setShowRulesDialog(true);
    setRulesAccepted(false);
  };

  const handleStartExam = () => {
    if (selectedExam && rulesAccepted) {
      setShowRulesDialog(false);
      navigate(`/exam?subjectId=${selectedExam.subjectId}&examId=${selectedExam.id}&secure=true`);
    }
  };

  const getStatusBadge = (status: Exam["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Active</Badge>;
      case "upcoming":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Upcoming</Badge>;
      case "completed":
        return <Badge className="bg-primary/10 text-primary border-primary/20">Completed</Badge>;
      case "missed":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Missed</Badge>;
      default:
        return null;
    }
  };

  const upcomingExams = mockExams.filter(e => e.status === "upcoming" || e.status === "active");
  const completedExams = mockExams.filter(e => e.status === "completed" || e.status === "missed");

  return (
    <DashboardLayout navItems={studentNavItems} role="student">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">My Exams</h1>
          <p className="text-muted-foreground">View and take your scheduled examinations</p>
        </div>

        {/* Alert for upcoming exams */}
        {upcomingExams.some(e => e.status === "active") && (
          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="flex items-center gap-4 py-4">
              <div className="p-3 rounded-full bg-green-500/10">
                <Play className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">You have an active exam!</h3>
                <p className="text-sm text-muted-foreground">
                  You can enter the exam now. Make sure you're ready before starting.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming ({upcomingExams.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedExams.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6">
            <div className="grid gap-4">
              {upcomingExams.length === 0 ? (
                <Card className="p-12 text-center">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Upcoming Exams</h3>
                  <p className="text-muted-foreground">You don't have any exams scheduled for the next week.</p>
                </Card>
              ) : (
                upcomingExams.map((exam) => (
                  <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-foreground">{exam.title}</h3>
                            {getStatusBadge(exam.status)}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              {exam.subject}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {exam.scheduledAt.toLocaleDateString()} at{" "}
                              {exam.scheduledAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {exam.duration} minutes
                            </span>
                          </div>

                          <p className="text-sm text-muted-foreground">
                            {exam.totalQuestions} questions • Professor: {exam.professor}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          {exam.status === "active" && canEnterExam(exam) ? (
                            <Button onClick={() => handleEnterExam(exam)} className="gap-2">
                              <Play className="w-4 h-4" />
                              Enter Exam
                            </Button>
                          ) : exam.status === "active" ? (
                            <div className="text-right">
                              <Badge variant="outline" className="mb-2">
                                <Timer className="w-3 h-3 mr-1" />
                                Opens in {getTimeUntilExam(exam)}
                              </Badge>
                              <Button disabled className="gap-2">
                                <Lock className="w-4 h-4" />
                                Not Yet Available
                              </Button>
                            </div>
                          ) : (
                            <div className="text-right">
                              <Badge variant="outline" className="mb-2">
                                <Timer className="w-3 h-3 mr-1" />
                                Starts in {getTimeUntilExam(exam)}
                              </Badge>
                              <Button disabled variant="outline" className="gap-2">
                                <Lock className="w-4 h-4" />
                                Upcoming
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <div className="grid gap-4">
              {completedExams.length === 0 ? (
                <Card className="p-12 text-center">
                  <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Completed Exams</h3>
                  <p className="text-muted-foreground">You haven't completed any exams yet.</p>
                </Card>
              ) : (
                completedExams.map((exam) => (
                  <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-foreground">{exam.title}</h3>
                            {getStatusBadge(exam.status)}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              {exam.subject}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {exam.scheduledAt.toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {exam.status === "completed" && exam.score !== undefined && (
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">
                                {exam.score}/{exam.totalMarks}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {Math.round((exam.score / (exam.totalMarks || 1)) * 100)}%
                              </div>
                            </div>
                          )}
                          {exam.status === "missed" && (
                            <div className="flex items-center gap-2 text-destructive">
                              <XCircle className="w-5 h-5" />
                              <span className="font-medium">Missed</span>
                            </div>
                          )}
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Security Info Card */}
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5 text-primary" />
              Exam Security Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                <p>Our exam system monitors for suspicious activities to ensure exam integrity.</p>
              </div>
              <div className="flex items-start gap-3">
                <Timer className="w-4 h-4 text-primary mt-0.5" />
                <p>Answers are auto-saved every few seconds. You won't lose progress.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exam Rules Dialog */}
      <Dialog open={showRulesDialog} onOpenChange={setShowRulesDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Shield className="w-6 h-6 text-primary" />
              Exam Rules & Guidelines
            </DialogTitle>
            <DialogDescription>
              Please read and accept the following rules before starting your exam.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            {selectedExam && (
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-foreground">{selectedExam.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Duration: {selectedExam.duration} minutes • {selectedExam.totalQuestions} questions
                </p>
              </div>
            )}

            <div className="space-y-3">
              {examRules.map((rule, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="p-2 rounded-full bg-background">
                    <rule.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h5 className="font-medium text-foreground">{rule.title}</h5>
                    <p className="text-sm text-muted-foreground">{rule.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                <div>
                  <h5 className="font-medium text-foreground">Important Warning</h5>
                  <p className="text-sm text-muted-foreground">
                    Violating exam rules 4 times will result in automatic submission of your exam. 
                    Make sure you're in a quiet environment and close all unnecessary applications.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="accept-rules" 
                checked={rulesAccepted}
                onCheckedChange={(checked) => setRulesAccepted(checked === true)}
              />
              <label
                htmlFor="accept-rules"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I have read and agree to follow all exam rules
              </label>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowRulesDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleStartExam} disabled={!rulesAccepted} className="gap-2">
              <Play className="w-4 h-4" />
              Start Exam
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default StudentExams;
