import { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search } from 'lucide-react';
import { sampleGrammar, getProgress, markCompleted, unmarkCompleted } from '@/lib/store';

export default function GrammarPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [progress, setProgress] = useState(getProgress());

  const filteredGrammar = useMemo(() => {
    return sampleGrammar.filter((item) => {
      const matchesSearch = !searchQuery ||
        item.pattern.includes(searchQuery) ||
        item.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.explanation.includes(searchQuery);
      const matchesLevel = !selectedLevel || item.level === selectedLevel;
      return matchesSearch && matchesLevel;
    });
  }, [searchQuery, selectedLevel]);

  const levels = [...new Set(sampleGrammar.map((g) => g.level))].sort();

  const toggleComplete = (itemId: string) => {
    const isCompleted = progress.grammar.completed.includes(itemId);
    if (isCompleted) {
      setProgress(unmarkCompleted('grammar', itemId));
    } else {
      setProgress(markCompleted('grammar', itemId));
    }
  };

  return (
    <Layout onSearch={(q) => setSearchQuery(q)}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">문법 (Grammar)</h1>
          <p className="text-muted-foreground mt-1">TOPIK II 필수 문법을 학습하세요</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="문법 검색... (Search grammar)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedLevel === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedLevel(null)}
              className="cursor-pointer"
            >
              전체
            </Button>
            {levels.map((level) => (
              <Button
                key={level}
                variant={selectedLevel === level ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLevel(level)}
                className="cursor-pointer"
              >
                Level {level}
              </Button>
            ))}
          </div>
        </div>

        {/* Grammar List */}
        <Accordion type="multiple" className="space-y-3">
          {filteredGrammar.map((item) => (
            <AccordionItem key={item.id} value={item.id} className="border rounded-lg border-border/50 px-4">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={progress.grammar.completed.includes(item.id)}
                  onCheckedChange={() => toggleComplete(item.id)}
                  className="cursor-pointer"
                />
                <AccordionTrigger className="flex-1 hover:no-underline py-4">
                  <div className="flex items-center gap-3 text-left">
                    <span className="text-lg font-semibold text-foreground">{item.pattern}</span>
                    <span className="text-sm text-muted-foreground hidden sm:inline">— {item.meaning}</span>
                    <Badge variant="secondary" className="text-xs ml-auto mr-2">Lv.{item.level}</Badge>
                  </div>
                </AccordionTrigger>
              </div>
              <AccordionContent className="pb-4">
                <Card className="border-0 bg-muted/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-primary">{item.meaning}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">설명 (Explanation)</h4>
                      <p className="text-sm text-foreground/80">{item.explanation}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">예문 (Examples)</h4>
                      <div className="space-y-2">
                        {item.examples.map((ex, idx) => (
                          <div key={idx} className="pl-3 border-l-2 border-primary/30">
                            <p className="text-sm text-foreground">{ex.korean}</p>
                            <p className="text-xs text-muted-foreground">{ex.translation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">{item.category}</Badge>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {filteredGrammar.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>검색 결과가 없습니다</p>
            <p className="text-sm">No results found</p>
          </div>
        )}
      </div>
    </Layout>
  );
}