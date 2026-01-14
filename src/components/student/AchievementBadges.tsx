import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Star,
  Flame,
  Target,
  Award,
  BookOpen,
  Zap,
  Crown,
  Medal,
  GraduationCap,
  Clock,
  TrendingUp,
  CheckCircle2,
  Lock,
  Sparkles,
  Gift,
  Calendar,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: "academic" | "streak" | "milestone" | "special";
  tier: "bronze" | "silver" | "gold" | "platinum";
  unlocked: boolean;
  unlockedDate?: string;
  progress?: number;
  maxProgress?: number;
  xpReward: number;
}

const achievements: Achievement[] = [
  // Academic Achievements
  {
    id: "perfect-score",
    name: "Perfect Score",
    description: "Score 100% on any exam",
    icon: Trophy,
    category: "academic",
    tier: "gold",
    unlocked: true,
    unlockedDate: "2025-01-08",
    xpReward: 500,
  },
  {
    id: "honor-roll",
    name: "Honor Roll",
    description: "Maintain 90%+ average for a month",
    icon: Star,
    category: "academic",
    tier: "gold",
    unlocked: true,
    unlockedDate: "2025-01-01",
    xpReward: 750,
  },
  {
    id: "top-performer",
    name: "Top of the Class",
    description: "Rank #1 in any exam",
    icon: Crown,
    category: "academic",
    tier: "platinum",
    unlocked: true,
    unlockedDate: "2024-12-20",
    xpReward: 1000,
  },
  {
    id: "rising-star",
    name: "Rising Star",
    description: "Improve score by 20% in a subject",
    icon: TrendingUp,
    category: "academic",
    tier: "silver",
    unlocked: true,
    unlockedDate: "2024-12-15",
    xpReward: 300,
  },
  {
    id: "subject-master",
    name: "Subject Master",
    description: "Score 90%+ in 5 exams of same subject",
    icon: GraduationCap,
    category: "academic",
    tier: "gold",
    unlocked: false,
    progress: 3,
    maxProgress: 5,
    xpReward: 600,
  },
  {
    id: "speed-demon",
    name: "Speed Demon",
    description: "Complete exam in half the allotted time with 80%+ score",
    icon: Zap,
    category: "academic",
    tier: "silver",
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    xpReward: 400,
  },

  // Streak Achievements
  {
    id: "study-streak-7",
    name: "Week Warrior",
    description: "Complete study tasks for 7 days straight",
    icon: Flame,
    category: "streak",
    tier: "bronze",
    unlocked: true,
    unlockedDate: "2025-01-10",
    xpReward: 200,
  },
  {
    id: "study-streak-30",
    name: "Monthly Master",
    description: "Maintain a 30-day study streak",
    icon: Flame,
    category: "streak",
    tier: "gold",
    unlocked: false,
    progress: 12,
    maxProgress: 30,
    xpReward: 800,
  },
  {
    id: "early-bird",
    name: "Early Bird",
    description: "Complete 5 study sessions before 8 AM",
    icon: Clock,
    category: "streak",
    tier: "bronze",
    unlocked: true,
    unlockedDate: "2025-01-05",
    xpReward: 150,
  },
  {
    id: "consistent-learner",
    name: "Consistent Learner",
    description: "Study every day for 2 weeks",
    icon: Calendar,
    category: "streak",
    tier: "silver",
    unlocked: false,
    progress: 8,
    maxProgress: 14,
    xpReward: 350,
  },

  // Milestone Achievements
  {
    id: "first-exam",
    name: "First Steps",
    description: "Complete your first exam",
    icon: Medal,
    category: "milestone",
    tier: "bronze",
    unlocked: true,
    unlockedDate: "2024-09-15",
    xpReward: 100,
  },
  {
    id: "exam-veteran",
    name: "Exam Veteran",
    description: "Complete 10 exams",
    icon: Award,
    category: "milestone",
    tier: "silver",
    unlocked: false,
    progress: 6,
    maxProgress: 10,
    xpReward: 400,
  },
  {
    id: "exam-master",
    name: "Exam Master",
    description: "Complete 50 exams",
    icon: Trophy,
    category: "milestone",
    tier: "platinum",
    unlocked: false,
    progress: 6,
    maxProgress: 50,
    xpReward: 2000,
  },
  {
    id: "study-plan-complete",
    name: "Plan Executor",
    description: "Complete a full weekly study plan",
    icon: CheckCircle2,
    category: "milestone",
    tier: "silver",
    unlocked: false,
    progress: 2,
    maxProgress: 7,
    xpReward: 300,
  },
  {
    id: "knowledge-seeker",
    name: "Knowledge Seeker",
    description: "Study 5 different subjects",
    icon: BookOpen,
    category: "milestone",
    tier: "bronze",
    unlocked: true,
    unlockedDate: "2024-11-20",
    xpReward: 200,
  },

  // Special Achievements
  {
    id: "comeback-kid",
    name: "Comeback Kid",
    description: "Pass an exam after previously failing it",
    icon: Sparkles,
    category: "special",
    tier: "gold",
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    xpReward: 500,
  },
  {
    id: "quick-learner",
    name: "Quick Learner",
    description: "Master a weak topic within a week",
    icon: Brain,
    category: "special",
    tier: "silver",
    unlocked: true,
    unlockedDate: "2025-01-12",
    xpReward: 350,
  },
  {
    id: "challenge-accepted",
    name: "Challenge Accepted",
    description: "Attempt an advanced difficulty exam",
    icon: Target,
    category: "special",
    tier: "silver",
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    xpReward: 400,
  },
];

const tierColors = {
  bronze: {
    bg: "from-amber-600/20 to-amber-800/20",
    border: "border-amber-600/30",
    text: "text-amber-600",
    badge: "bg-amber-600/20 text-amber-700 dark:text-amber-400",
  },
  silver: {
    bg: "from-slate-400/20 to-slate-600/20",
    border: "border-slate-400/30",
    text: "text-slate-500",
    badge: "bg-slate-400/20 text-slate-600 dark:text-slate-300",
  },
  gold: {
    bg: "from-yellow-500/20 to-amber-500/20",
    border: "border-yellow-500/30",
    text: "text-yellow-600",
    badge: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
  },
  platinum: {
    bg: "from-violet-500/20 to-purple-500/20",
    border: "border-violet-500/30",
    text: "text-violet-500",
    badge: "bg-violet-500/20 text-violet-600 dark:text-violet-300",
  },
};

const categoryLabels = {
  academic: "Academic Excellence",
  streak: "Study Streaks",
  milestone: "Milestones",
  special: "Special Achievements",
};

const AchievementBadges = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const totalXP = unlockedAchievements.reduce((acc, a) => acc + a.xpReward, 0);
  const currentLevel = Math.floor(totalXP / 1000) + 1;
  const xpForNextLevel = (currentLevel * 1000) - totalXP;
  const levelProgress = ((totalXP % 1000) / 1000) * 100;

  const filteredAchievements = selectedCategory === "all" 
    ? achievements 
    : achievements.filter((a) => a.category === selectedCategory);

  const categories = ["all", "academic", "streak", "milestone", "special"];

  return (
    <div className="space-y-6">
      {/* Level & XP Card */}
      <Card className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-foreground">{currentLevel}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                  <Crown className="w-4 h-4 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Level {currentLevel}</h3>
                <p className="text-sm text-muted-foreground">Scholar Rank</p>
                <div className="flex items-center gap-2 mt-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{totalXP.toLocaleString()} XP</span>
                </div>
              </div>
            </div>

            <div className="flex-1 max-w-md">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progress to Level {currentLevel + 1}</span>
                <span className="font-medium text-foreground">{xpForNextLevel} XP needed</span>
              </div>
              <Progress value={levelProgress} className="h-3" />
            </div>

            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{unlockedAchievements.length}</div>
                <div className="text-xs text-muted-foreground">Unlocked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-muted-foreground">{achievements.length - unlockedAchievements.length}</div>
                <div className="text-xs text-muted-foreground">Locked</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Rewards */}
      <Card className="border-dashed border-2 border-accent/50 bg-accent/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                <Gift className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Daily Reward Available!</h4>
                <p className="text-sm text-muted-foreground">Complete today's study task to earn 50 XP</p>
              </div>
            </div>
            <Button size="sm" className="gap-2">
              <Sparkles className="w-4 h-4" />
              Claim
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
            className="capitalize"
          >
            {cat === "all" ? "All Badges" : categoryLabels[cat as keyof typeof categoryLabels]}
          </Button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAchievements.map((achievement) => {
          const Icon = achievement.icon;
          const tier = tierColors[achievement.tier];

          return (
            <Card
              key={achievement.id}
              className={cn(
                "relative overflow-hidden transition-all hover:shadow-lg",
                achievement.unlocked
                  ? `bg-gradient-to-br ${tier.bg} ${tier.border}`
                  : "bg-muted/30 border-muted opacity-75"
              )}
            >
              {!achievement.unlocked && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "w-14 h-14 rounded-xl flex items-center justify-center shrink-0",
                      achievement.unlocked
                        ? `bg-gradient-to-br ${tier.bg}`
                        : "bg-muted"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-7 h-7",
                        achievement.unlocked ? tier.text : "text-muted-foreground"
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground truncate">
                        {achievement.name}
                      </h4>
                      <Badge className={cn("text-xs shrink-0", tier.badge)}>
                        {achievement.tier}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {achievement.description}
                    </p>
                    
                    {achievement.unlocked ? (
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-muted-foreground">
                          Unlocked {new Date(achievement.unlockedDate!).toLocaleDateString()}
                        </span>
                        <Badge variant="outline" className="text-xs gap-1">
                          <Sparkles className="w-3 h-3" />
                          +{achievement.xpReward} XP
                        </Badge>
                      </div>
                    ) : (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">
                            {achievement.progress}/{achievement.maxProgress}
                          </span>
                        </div>
                        <Progress
                          value={(achievement.progress! / achievement.maxProgress!) * 100}
                          className="h-2"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Upcoming Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Close to Unlocking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {achievements
            .filter((a) => !a.unlocked && a.progress && a.progress / a.maxProgress! > 0.5)
            .slice(0, 3)
            .map((achievement) => {
              const Icon = achievement.icon;
              const progress = (achievement.progress! / achievement.maxProgress!) * 100;
              
              return (
                <div key={achievement.id} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">{achievement.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {achievement.progress}/{achievement.maxProgress}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  <Badge variant="outline" className="text-xs gap-1">
                    <Sparkles className="w-3 h-3" />
                    +{achievement.xpReward}
                  </Badge>
                </div>
              );
            })}
        </CardContent>
      </Card>
    </div>
  );
};

export default AchievementBadges;
