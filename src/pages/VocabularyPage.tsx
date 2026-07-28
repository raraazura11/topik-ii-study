import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, RotateCcw, ChevronLeft, ChevronRight, Shuffle, Plus, Trash2, X } from 'lucide-react';
import {
  getAllVocabulary,
  addCustomVocabulary,
  deleteCustomVocabulary,
  getCustomVocabulary,
  VocabItem,
  getProgress,
  markCompleted,
  unmarkCompleted,
} from '@/lib/store';

export default function VocabularyPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [progress, setProgress] = useState(getProgress());
  const [allVocab, setAllVocab] = useState<VocabItem[]>(getAllVocabulary());
  const [showAddForm, setShowAddForm] = useState(false);

  // Add form state
  const [newKorean, setNewKorean] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newExample, setNewExample] = useState('');
  const [newExampleTranslation, setNewExampleTranslation] = useState('');
  const [newLevel, setNewLevel] = useState(3);
  const [newCategory, setNewCategory] = useState('');

  const filteredVocab = useMemo(() => {
    return allVocab.filter((item) => {
      const matchesSearch = !searchQuery ||
        item.korean.includes(searchQuery) ||
        item.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.example.includes(searchQuery);
      const matchesLevel = !selectedLevel || item.level === selectedLevel;
      return matchesSearch && matchesLevel;
    });
  }, [searchQuery, selectedLevel, allVocab]);

  const levels = [...new Set(allVocab.map((v) => v.level))].sort();
  const customIds = useMemo(() => new Set(getCustomVocabulary().map((v) => v.id)), [allVocab]);

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

  const handleAdd = () => {
    if (!newKorean.trim() || !newMeaning.trim()) return;
    addCustomVocabulary({
      korean: newKorean.trim(),
      meaning: newMeaning.trim(),
      example: newExample.trim(),
      exampleTranslation: newExampleTranslation.trim(),
      level: newLevel,
      category: newCategory.trim() || '사용자',
    });
    setAllVocab(getAllVocabulary());
    setNewKorean('');
    setNewMeaning('');
    setNewExample('');
    setNewExampleTranslation('');
    setNewLevel(3);
    setNewCategory('');
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    deleteCustomVocabulary(id);
    setAllVocab(getAllVocabulary());
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">어휘 (Vocabulary)</h1>
            <p className="text-muted-foreground mt-1">TOPIK II 필수 단어를 학습하세요</p>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)} className="cursor-pointer">
            {showAddForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            {showAddForm ? '취소' : '단어 추가'}
          </Button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="py-6 space-y-4">
              <h3 className="font-semibold text-foreground">새 단어 추가 (Add New Word)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">한국어 (Korean) *</label>
                  <Input placeholder="예: 경제" value={newKorean} onChange={(e) => setNewKorean(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">의미 (Meaning) *</label>
                  <Input placeholder="Economy" value={newMeaning} onChange={(e) => setNewMeaning(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">예문 (Example)</label>
                  <Input placeholder="한국의 경제가 성장하고 있다." value={newExample} onChange={(e) => setNewExample(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">예문 번역 (Translation)</label>
                  <Input placeholder="Korea's economy is growing." value={newExampleTranslation} onChange={(e) => setNewExampleTranslation(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">레벨 (Level)</label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                  >
                    <option value={3}>Level 3</option>
                    <option value={4}>Level 4</option>
                    <option value={5}>Level 5</option>
                    <option value={6}>Level 6</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">카테고리 (Category)</label>
                  <Input placeholder="예: 사회, 문화" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                </div>
              </div>
              <Button onClick={handleAdd} disabled={!newKorean.trim() || !newMeaning.trim()} className="cursor-pointer">
                <Plus className="w-4 h-4 mr-2" /> 추가하기 (Add)
              </Button>
            </CardContent>
          </Card>
        )}

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

            <p className="text-sm text-muted-foreground">
              {filteredVocab.length} 단어 (words) · {customIds.size} 사용자 추가 (custom)
            </p>

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
                        {item.example && (
                          <>
                            <p className="text-sm text-foreground/80 mt-2">{item.example}</p>
                            <p className="text-xs text-muted-foreground mt-1">{item.exampleTranslation}</p>
                          </>
                        )}
                      </div>
                      {customIds.has(item.id) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive cursor-pointer flex-shrink-0"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
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