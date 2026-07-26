import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, Lightbulb, FileText } from 'lucide-react';
import { sampleWriting, WritingItem, getProgress, markCompleted, unmarkCompleted } from '@/lib/store';

export default function WritingPage() {
  const [selectedItem, setSelectedItem] = useState<WritingItem | null>(null);
  const [showSample, setShowSample] = useState(false);
  const [progress, setProgress] = useState(getProgress());

  const toggleComplete = (itemId: string) => {
    const isCompleted = progress.writing.completed.includes(itemId);
    if (isCompleted) {
      setProgress(unmarkCompleted('writing', itemId));
    } else {
      setProgress(markCompleted('writing', itemId));
    }
  };

  if (selectedItem) {
    return (
      <Layout>
        <div className="space-y-6 max-w-3xl">
          <Button
            variant="ghost"
            onClick={() => { setSelectedItem(null); setShowSample(false); }}
            className="cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            목록으로 돌아가기 (Back to list)
          </Button>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-foreground">{selectedItem.title}</h1>
              <Badge variant="secondary">Lv.{selectedItem.level}</Badge>
            </div>
            <Badge variant="outline">{selectedItem.taskType}</Badge>
          </div>

          {/* Prompt */}
          <Card className="border-border/50 bg-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                문제 (Prompt)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground leading-relaxed">{selectedItem.prompt}</p>
            </CardContent>
          </Card>

          <Tabs defaultValue="tips" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tips" className="cursor-pointer">팁 (Tips)</TabsTrigger>
              <TabsTrigger value="expressions" className="cursor-pointer">핵심 표현</TabsTrigger>
              <TabsTrigger value="sample" className="cursor-pointer">모범 답안</TabsTrigger>
            </TabsList>

            <TabsContent value="tips" className="mt-4">
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    작성 팁 (Writing Tips)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {selectedItem.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-foreground/80">
                        <span className="text-primary font-bold">{idx + 1}.</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="expressions" className="mt-4">
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">핵심 표현 (Key Expressions)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedItem.keyExpressions.map((expr, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-md bg-primary/5">
                        <Badge variant="secondary" className="text-xs w-6 h-6 flex items-center justify-center p-0">
                          {idx + 1}
                        </Badge>
                        <span className="text-sm font-medium text-foreground">{expr}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sample" className="mt-4">
              <div className="space-y-3">
                {!showSample ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground mb-4">
                      먼저 직접 써 본 후에 모범 답안을 확인하세요
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Try writing your own answer first, then check the sample
                    </p>
                    <Button onClick={() => setShowSample(true)} className="cursor-pointer">
                      모범 답안 보기 (Show Sample Answer)
                    </Button>
                  </div>
                ) : (
                  <Card className="border-border/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">모범 답안 (Sample Answer)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
                        {selectedItem.sampleAnswer}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <Button
            variant="outline"
            onClick={() => {
              markCompleted('writing', selectedItem.id);
              setProgress(getProgress());
            }}
            className="cursor-pointer"
          >
            학습 완료 (Mark as Complete)
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">쓰기 (Writing)</h1>
          <p className="text-muted-foreground mt-1">TOPIK II 쓰기 유형별 연습을 하세요</p>
        </div>

        <div className="space-y-4">
          {sampleWriting.map((item) => (
            <Card key={item.id} className="border-border/50 hover:shadow-sm transition-shadow">
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={progress.writing.completed.includes(item.id)}
                    onCheckedChange={() => toggleComplete(item.id)}
                    className="mt-1 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <Badge variant="secondary" className="text-xs">Lv.{item.level}</Badge>
                      <Badge variant="outline" className="text-xs">{item.taskType}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.prompt}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedItem(item)}
                      className="mt-3 cursor-pointer"
                    >
                      학습하기 (Study)
                    </Button>
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