import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft, CheckCircle2, XCircle } from 'lucide-react';
import { sampleReading, ReadingItem, getProgress, markCompleted, unmarkCompleted } from '@/lib/store';

export default function ReadingPage() {
  const [selectedReading, setSelectedReading] = useState<ReadingItem | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [progress, setProgress] = useState(getProgress());

  const toggleComplete = (itemId: string) => {
    const isCompleted = progress.reading.completed.includes(itemId);
    if (isCompleted) {
      setProgress(unmarkCompleted('reading', itemId));
    } else {
      setProgress(markCompleted('reading', itemId));
    }
  };

  const checkAnswers = () => {
    setShowResults(true);
    if (selectedReading) {
      markCompleted('reading', selectedReading.id);
      setProgress(getProgress());
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setShowResults(false);
  };

  if (selectedReading) {
    return (
      <Layout>
        <div className="space-y-6 max-w-3xl">
          <Button
            variant="ghost"
            onClick={() => { setSelectedReading(null); resetQuiz(); }}
            className="cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            목록으로 돌아가기 (Back to list)
          </Button>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-foreground">{selectedReading.title}</h1>
              <Badge variant="secondary">Lv.{selectedReading.level}</Badge>
            </div>
            <Badge variant="outline">{selectedReading.category}</Badge>
          </div>

          {/* Passage */}
          <Card className="border-border/50">
            <CardContent className="py-6">
              <p className="text-base leading-relaxed text-foreground whitespace-pre-line">
                {selectedReading.passage}
              </p>
            </CardContent>
          </Card>

          {/* Questions */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">문제 (Questions)</h2>
            {selectedReading.questions.map((q, qIdx) => (
              <Card key={qIdx} className="border-border/50">
                <CardContent className="py-4">
                  <div className="flex items-start gap-2 mb-4">
                    <span className="font-bold text-primary">{qIdx + 1}.</span>
                    <p className="font-medium text-foreground">{q.question}</p>
                    {showResults && (
                      parseInt(answers[qIdx]) === q.answer
                        ? <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto flex-shrink-0" />
                        : <XCircle className="w-5 h-5 text-red-500 ml-auto flex-shrink-0" />
                    )}
                  </div>
                  <RadioGroup
                    value={answers[qIdx] || ''}
                    onValueChange={(val) => setAnswers({ ...answers, [qIdx]: val })}
                    disabled={showResults}
                  >
                    {q.options.map((option, oIdx) => (
                      <div key={oIdx} className={`flex items-center space-x-2 p-2 rounded-md ${
                        showResults && oIdx === q.answer ? 'bg-green-50 dark:bg-green-950/20' : ''
                      } ${showResults && parseInt(answers[qIdx]) === oIdx && oIdx !== q.answer ? 'bg-red-50 dark:bg-red-950/20' : ''}`}>
                        <RadioGroupItem value={String(oIdx)} id={`q${qIdx}-o${oIdx}`} className="cursor-pointer" />
                        <Label htmlFor={`q${qIdx}-o${oIdx}`} className="cursor-pointer flex-1">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-3">
            {!showResults ? (
              <Button onClick={checkAnswers} className="cursor-pointer">
                정답 확인 (Check Answers)
              </Button>
            ) : (
              <Button onClick={resetQuiz} variant="outline" className="cursor-pointer">
                다시 풀기 (Try Again)
              </Button>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">읽기 (Reading)</h1>
          <p className="text-muted-foreground mt-1">읽기 지문을 읽고 문제를 풀어보세요</p>
        </div>

        <div className="space-y-4">
          {sampleReading.map((item) => (
            <Card key={item.id} className="border-border/50 hover:shadow-sm transition-shadow">
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={progress.reading.completed.includes(item.id)}
                    onCheckedChange={() => toggleComplete(item.id)}
                    className="mt-1 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <Badge variant="secondary" className="text-xs">Lv.{item.level}</Badge>
                      <Badge variant="outline" className="text-xs">{item.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.passage}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedReading(item)}
                        className="cursor-pointer"
                      >
                        읽기 시작 (Start Reading)
                      </Button>
                      <span className="text-xs text-muted-foreground">{item.questions.length} questions</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}