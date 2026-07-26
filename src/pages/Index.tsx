import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  GraduationCap,
  FileText,
  Headphones,
  PenTool,
  TrendingUp,
  Target,
} from 'lucide-react';
import { getProgress } from '@/lib/store';

const sections = [
  { key: 'vocabulary', label: '어휘', labelEn: 'Vocabulary', icon: BookOpen, path: '/vocabulary', color: 'bg-blue-500/10 text-blue-600' },
  { key: 'grammar', label: '문법', labelEn: 'Grammar', icon: GraduationCap, path: '/grammar', color: 'bg-purple-500/10 text-purple-600' },
  { key: 'reading', label: '읽기', labelEn: 'Reading', icon: FileText, path: '/reading', color: 'bg-emerald-500/10 text-emerald-600' },
  { key: 'listening', label: '듣기', labelEn: 'Listening', icon: Headphones, path: '/listening', color: 'bg-orange-500/10 text-orange-600' },
  { key: 'writing', label: '쓰기', labelEn: 'Writing', icon: PenTool, path: '/writing', color: 'bg-pink-500/10 text-pink-600' },
];

export default function Index() {
  const navigate = useNavigate();
  const progress = getProgress();

  const totalCompleted = Object.values(progress)
    .filter((v) => typeof v === 'object' && 'completed' in v)
    .reduce((sum, section) => sum + (section as { completed: string[] }).completed.length, 0);

  const recentQuizzes = progress.quizScores.slice(-3).reverse();

  return (
    <Layout onSearch={(q) => navigate(`/vocabulary?search=${encodeURIComponent(q)}`)}>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 p-6 sm:p-8">
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              TOPIK II 학습에 오신 것을 환영합니다
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg mb-4">
              Welcome to your TOPIK II study space
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <span>{totalCompleted} items completed</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span>{recentQuizzes.length} recent quizzes</span>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
            <div className="text-[12rem] font-bold text-primary leading-none">한</div>
          </div>
        </div>

        {/* Study Sections Grid */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">학습 영역 (Study Sections)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((section) => {
              const Icon = section.icon;
              const sectionProgress = progress[section.key as keyof typeof progress] as { completed: string[]; total: number } | undefined;
              const completedCount = sectionProgress?.completed?.length || 0;
              const totalCount = sectionProgress?.total || 0;
              const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

              return (
                <Card
                  key={section.key}
                  className="cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 border-border/50"
                  onClick={() => navigate(section.path)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${section.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {totalCount > 0 && (
                        <span className="text-xs text-muted-foreground">{completedCount}/{totalCount}</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-base mb-1">{section.label}</CardTitle>
                    <p className="text-xs text-muted-foreground mb-3">{section.labelEn}</p>
                    {totalCount > 0 && (
                      <Progress value={percentage} className="h-1.5" />
                    )}
                    {totalCount === 0 && (
                      <p className="text-xs text-muted-foreground italic">Add materials to start</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Quiz Scores */}
        {recentQuizzes.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">최근 퀴즈 결과 (Recent Quiz Results)</h2>
            <div className="space-y-3">
              {recentQuizzes.map((quiz, idx) => (
                <Card key={idx} className="border-border/50">
                  <CardContent className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-medium text-sm">{quiz.section}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(quiz.date).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-primary">
                        {quiz.score}/{quiz.total}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {Math.round((quiz.score / quiz.total) * 100)}%
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Quick Start Guide */}
        <Card className="border-border/50 bg-muted/30">
          <CardContent className="py-6">
            <h3 className="font-semibold text-foreground mb-3">학습 안내 (Getting Started)</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• 각 학습 영역을 클릭하여 자료를 확인하세요</p>
              <p>• Click each study section to view materials</p>
              <p>• 진행 상황이 자동으로 저장됩니다</p>
              <p>• Your progress is saved automatically</p>
            </div>
            <Button
              className="mt-4 cursor-pointer"
              onClick={() => navigate('/vocabulary')}
            >
              학습 시작하기 (Start Learning)
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}