import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, RotateCcw, ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import { sampleVocabulary, VocabItem, getProgress, markCompleted, unmarkCompleted } from '@/lib/store';

export default function VocabularyPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [progress, setProgress] = useState(getProgress());

  const filteredVocab = useMemo(() => {
    return sampleVocabulary.filter((item) => {
      const matchesSearch = !searchQuery ||
        item.korean.includes(searchQuery) ||
        item.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.example.includes(searchQuery);
      const matchesLevel = !selectedLevel || item.level === selectedLevel;
      return matchesSearch && matchesLevel;
    });
  }, [searchQuery, selectedLevel]);

  const levels = [...new Set(sampleVocabulary.map((v) => v.level))].sort();

  const toggleComplete = (itemId: string) => {
    const isCompleted = progress.vocabulary.completed.includes(itemId);
    if (isCompleted) {
      setProgress(unmarkCompleted('vocabulary', itemId));
    } else {
      setProgress(markCompleted('vocabulary', itemId));
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSearchParams(query ? { search: query } : {});
  };

  const shuffleFlashcards = () => {
    setFlashcardIndex(Math.floor(Math.random() * filteredVocab.length));
    setShowAnswer(false);
  };

  const nextFlashcard = () => {
    setFlashcardIndex((prev) => (prev + 1) % filteredVocab.length);
    setShowAnswer(false);
  };

  const prevFlashcard = () => {
    setFlashcardIndex((prev) => (prev - 1 + filteredVocab.length) % filteredVocab.length);
    setShowAnswer(false);
  };

  const currentFlashcard: VocabItem | undefined = filteredVocab[flashcardIndex];

  return (
    <Layout onSearch={handleSearch}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">어휘 (Vocabulary)</h1>
          <p className="text-muted-foreground mt-1">TOPIK II 필수 단어를 학습하세요</p>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="list" className="cursor-pointer">목록 (List)</TabsTrigger>
            <TabsTrigger value="flashcard" className="cursor-pointer">플래시카드 (Flashcard)</TabsTrigger>
          </TabsList>

          {/* List View */}
          <TabsContent value="list" className="space-y-4 mt-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="단어 검색... (Search words)"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
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

            {/* Vocabulary List */}
            <div className="space-y-3">
              {filteredVocab.map((item) => (
                <Card key={item.id} className="border-border/50 hover:shadow-sm transition-shadow">
                  <CardContent className="py-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={progress.vocabulary.completed.includes(item.id)}
                        onCheckedChange={() => toggleComplete(item.id)}
                        className="mt-1 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-lg font-semibold text-foreground">{item.korean}</span>
                          <span className="text-sm text-muted-foreground">— {item.meaning}</span>
                          <Badge variant="secondary" className="text-xs">Lv.{item.level}</Badge>
                          <Badge variant="outline" className="text-xs">{item.category}</Badge>
                        </div>
                        <p className="text-sm text-foreground/80 mt-2">{item.example}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.exampleTranslation}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredVocab.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>검색 결과가 없습니다</p>
                  <p className="text-sm">No results found</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Flashcard View */}
          <TabsContent value="flashcard" className="mt-4">
            {currentFlashcard ? (
              <div className="flex flex-col items-center space-y-6">
                <div className="text-sm text-muted-foreground">
                  {flashcardIndex + 1} / {filteredVocab.length}
                </div>

                <Card
                  className="w-full max-w-lg min-h-[280px] flex items-center justify-center cursor-pointer hover:shadow-lg transition-all duration-300"
                  onClick={() => setShowAnswer(!showAnswer)}
                >
                  <CardContent className="text-center py-12 px-8">
                    {!showAnswer ? (
                      <div className="space-y-4">
                        <p className="text-4xl font-bold text-foreground">{currentFlashcard.korean}</p>
                        <p className="text-sm text-foreground/70 mt-4">{currentFlashcard.example}</p>
                        <p className="text-xs text-muted-foreground mt-6">Click to reveal meaning</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-2xl font-bold text-foreground">{currentFlashcard.korean}</p>
                        <p className="text-xl text-primary font-medium">{currentFlashcard.meaning}</p>
                        <div className="pt-4 border-t border-border">
                          <p className="text-sm text-foreground/80">{currentFlashcard.example}</p>
                          <p className="text-xs text-muted-foreground mt-1">{currentFlashcard.exampleTranslation}</p>
                        </div>
                        <div className="flex gap-2 justify-center pt-2">
                          <Badge variant="secondary">Lv.{currentFlashcard.level}</Badge>
                          <Badge variant="outline">{currentFlashcard.category}</Badge>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex items-center gap-4">
                  <Button variant="outline" size="icon" onClick={prevFlashcard} className="cursor-pointer">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={shuffleFlashcards} className="cursor-pointer">
                    <Shuffle className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setShowAnswer(false)} className="cursor-pointer">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={nextFlashcard} className="cursor-pointer">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>표시할 단어가 없습니다</p>
                <p className="text-sm">No vocabulary to display</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}