// Progress tracking with localStorage

export interface StudyProgress {
  vocabulary: { completed: string[]; total: number };
  grammar: { completed: string[]; total: number };
  reading: { completed: string[]; total: number };
  listening: { completed: string[]; total: number };
  writing: { completed: string[]; total: number };
  quizScores: { date: string; score: number; total: number; section: string }[];
}

const STORAGE_KEY = 'topik-study-progress';

const defaultProgress: StudyProgress = {
  vocabulary: { completed: [], total: 0 },
  grammar: { completed: [], total: 0 },
  reading: { completed: [], total: 0 },
  listening: { completed: [], total: 0 },
  writing: { completed: [], total: 0 },
  quizScores: [],
};

export function getProgress(): StudyProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore parse errors
  }
  return defaultProgress;
}

export function saveProgress(progress: StudyProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function markCompleted(section: keyof Omit<StudyProgress, 'quizScores'>, itemId: string): StudyProgress {
  const progress = getProgress();
  if (!progress[section].completed.includes(itemId)) {
    progress[section].completed.push(itemId);
  }
  saveProgress(progress);
  return progress;
}

export function unmarkCompleted(section: keyof Omit<StudyProgress, 'quizScores'>, itemId: string): StudyProgress {
  const progress = getProgress();
  progress[section].completed = progress[section].completed.filter((id) => id !== itemId);
  saveProgress(progress);
  return progress;
}

export function addQuizScore(score: number, total: number, section: string): StudyProgress {
  const progress = getProgress();
  progress.quizScores.push({
    date: new Date().toISOString(),
    score,
    total,
    section,
  });
  saveProgress(progress);
  return progress;
}

export function getCompletionPercentage(section: keyof Omit<StudyProgress, 'quizScores'>): number {
  const progress = getProgress();
  const { completed, total } = progress[section];
  if (total === 0) return 0;
  return Math.round((completed.length / total) * 100);
}

// Sample data for the study sections
export interface VocabItem {
  id: string;
  korean: string;
  meaning: string;
  example: string;
  exampleTranslation: string;
  level: number;
  category: string;
}

export interface GrammarItem {
  id: string;
  pattern: string;
  meaning: string;
  explanation: string;
  examples: { korean: string; translation: string }[];
  level: number;
  category: string;
}

export interface ReadingItem {
  id: string;
  title: string;
  passage: string;
  questions: { question: string; options: string[]; answer: number }[];
  level: number;
  category: string;
}

export interface ListeningItem {
  id: string;
  title: string;
  transcript: string;
  questions: { question: string; options: string[]; answer: number }[];
  level: number;
  audioUrl?: string;
}

export interface WritingItem {
  id: string;
  title: string;
  taskType: string;
  prompt: string;
  tips: string[];
  sampleAnswer: string;
  keyExpressions: string[];
  level: number;
}

// Custom vocabulary (user-added, stored in localStorage)
const CUSTOM_VOCAB_KEY = 'topik-custom-vocabulary';

export function getCustomVocabulary(): VocabItem[] {
  try {
    const stored = localStorage.getItem(CUSTOM_VOCAB_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return [];
}

export function addCustomVocabulary(item: Omit<VocabItem, 'id'>): VocabItem[] {
  const custom = getCustomVocabulary();
  const newItem: VocabItem = {
    ...item,
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  };
  custom.push(newItem);
  localStorage.setItem(CUSTOM_VOCAB_KEY, JSON.stringify(custom));
  return custom;
}

export function deleteCustomVocabulary(id: string): VocabItem[] {
  const custom = getCustomVocabulary().filter((v) => v.id !== id);
  localStorage.setItem(CUSTOM_VOCAB_KEY, JSON.stringify(custom));
  return custom;
}

export function getAllVocabulary(): VocabItem[] {
  return [...sampleVocabulary, ...getCustomVocabulary()];
}

// Sample vocabulary data
export const sampleVocabulary: VocabItem[] = [
  { id: 'v1', korean: '경제', meaning: 'Economy', example: '한국의 경제가 빠르게 성장하고 있다.', exampleTranslation: "Korea's economy is growing rapidly.", level: 3, category: '사회' },
  { id: 'v2', korean: '환경', meaning: 'Environment', example: '환경 보호를 위해 노력해야 한다.', exampleTranslation: 'We must make efforts to protect the environment.', level: 3, category: '자연' },
  { id: 'v3', korean: '정치', meaning: 'Politics', example: '정치에 관심이 많은 학생들이 늘고 있다.', exampleTranslation: 'The number of students interested in politics is increasing.', level: 4, category: '사회' },
  { id: 'v4', korean: '문화유산', meaning: 'Cultural heritage', example: '한국의 문화유산을 보존해야 합니다.', exampleTranslation: "We must preserve Korea's cultural heritage.", level: 4, category: '문화' },
  { id: 'v5', korean: '취업', meaning: 'Employment / Getting a job', example: '대학 졸업 후 취업이 어려워졌다.', exampleTranslation: 'Getting a job after graduating from university has become difficult.', level: 3, category: '직업' },
  { id: 'v6', korean: '인공지능', meaning: 'Artificial intelligence', example: '인공지능 기술이 빠르게 발전하고 있다.', exampleTranslation: 'AI technology is developing rapidly.', level: 5, category: '과학' },
  { id: 'v7', korean: '전통', meaning: 'Tradition', example: '전통을 지키면서도 현대화를 추구해야 한다.', exampleTranslation: 'We should pursue modernization while preserving tradition.', level: 3, category: '문화' },
  { id: 'v8', korean: '의료', meaning: 'Medical care', example: '의료 서비스의 질이 높아지고 있다.', exampleTranslation: 'The quality of medical services is improving.', level: 4, category: '건강' },
  { id: 'v9', korean: '세계화', meaning: 'Globalization', example: '세계화 시대에 외국어 능력이 중요하다.', exampleTranslation: 'Foreign language skills are important in the era of globalization.', level: 5, category: '사회' },
  { id: 'v10', korean: '창의력', meaning: 'Creativity', example: '창의력을 키우기 위해 다양한 경험이 필요하다.', exampleTranslation: 'Various experiences are needed to develop creativity.', level: 4, category: '교육' },
  { id: 'v11', korean: '소통', meaning: 'Communication', example: '세대 간의 소통이 중요하다.', exampleTranslation: 'Communication between generations is important.', level: 3, category: '사회' },
  { id: 'v12', korean: '지속가능', meaning: 'Sustainable', example: '지속가능한 발전을 위해 노력해야 한다.', exampleTranslation: 'We must strive for sustainable development.', level: 5, category: '환경' },
];

// Sample grammar data
export const sampleGrammar: GrammarItem[] = [
  {
    id: 'g1', pattern: '-는 반면(에)', meaning: 'While / On the other hand',
    explanation: 'Used to contrast two opposing facts or situations. The first clause states one fact, and the second clause presents a contrasting fact.',
    examples: [
      { korean: '도시는 편리한 반면에 공기가 나쁘다.', translation: 'While the city is convenient, the air quality is bad.' },
      { korean: '이 식당은 비싼 반면에 맛이 좋다.', translation: 'While this restaurant is expensive, the food is good.' },
    ],
    level: 3, category: '대조',
  },
  {
    id: 'g2', pattern: '-기 마련이다', meaning: 'It is bound to / It is natural that',
    explanation: 'Expresses that something is natural or inevitable. Used to state that a certain result is expected.',
    examples: [
      { korean: '노력하면 성공하기 마련이다.', translation: 'If you make an effort, you are bound to succeed.' },
      { korean: '시간이 지나면 잊히기 마련이다.', translation: 'As time passes, it is natural to be forgotten.' },
    ],
    level: 4, category: '추측/판단',
  },
  {
    id: 'g3', pattern: '-을/ㄹ 뿐만 아니라', meaning: 'Not only ... but also',
    explanation: 'Used to add additional information. States that in addition to the first fact, there is another related fact.',
    examples: [
      { korean: '그는 영어뿐만 아니라 일본어도 잘한다.', translation: 'He is good not only at English but also at Japanese.' },
      { korean: '건강뿐만 아니라 행복도 중요하다.', translation: 'Not only health but also happiness is important.' },
    ],
    level: 3, category: '나열/추가',
  },
  {
    id: 'g4', pattern: '-는 셈이다', meaning: 'It amounts to / It is practically',
    explanation: 'Used to express that a situation can be considered as equivalent to something. Indicates an approximate judgment.',
    examples: [
      { korean: '매일 운동하니까 건강한 셈이다.', translation: 'Since I exercise every day, I am practically healthy.' },
      { korean: '10년이나 살았으니 한국 사람인 셈이다.', translation: 'Having lived here for 10 years, I am practically Korean.' },
    ],
    level: 4, category: '추측/판단',
  },
  {
    id: 'g5', pattern: '-도록', meaning: 'So that / In order to / Until',
    explanation: 'Indicates purpose, degree, or a state that continues until a certain point. Context determines the specific meaning.',
    examples: [
      { korean: '건강해지도록 매일 운동한다.', translation: 'I exercise every day so that I become healthy.' },
      { korean: '목이 아프도록 노래를 불렀다.', translation: 'I sang until my throat hurt.' },
    ],
    level: 3, category: '목적/정도',
  },
  {
    id: 'g6', pattern: '-는 데 (에)', meaning: 'In doing / For the purpose of',
    explanation: 'Used to express the context or situation in which something takes place, or the purpose/use of something.',
    examples: [
      { korean: '한국어를 배우는 데 시간이 많이 걸린다.', translation: 'It takes a lot of time to learn Korean.' },
      { korean: '이 책은 문법을 공부하는 데 도움이 된다.', translation: 'This book is helpful for studying grammar.' },
    ],
    level: 3, category: '목적/정도',
  },
];

// Sample reading data
export const sampleReading: ReadingItem[] = [
  {
    id: 'r1', title: '한국의 커피 문화', level: 3, category: '문화',
    passage: '한국에서 커피는 단순한 음료가 아니라 하나의 문화가 되었다. 서울의 거리를 걸으면 수많은 카페를 볼 수 있다. 한국인들은 카페에서 친구를 만나거나 혼자 공부를 하기도 한다. 특히 젊은 세대에게 카페는 중요한 사회적 공간이다. 최근에는 독특한 인테리어나 특별한 메뉴를 가진 카페들이 인기를 끌고 있다. 이러한 카페 문화는 한국의 빠른 도시화와 함께 발전해 왔다.',
    questions: [
      { question: '이 글의 주제는 무엇입니까?', options: ['한국의 음식 문화', '한국의 커피 문화', '서울의 관광지', '젊은 세대의 취미'], answer: 1 },
      { question: '한국인들이 카페에서 하는 활동이 아닌 것은?', options: ['친구 만나기', '공부하기', '요리하기', '사회적 교류'], answer: 2 },
    ],
  },
  {
    id: 'r2', title: '환경 보호의 중요성', level: 4, category: '환경',
    passage: '지구 온난화로 인해 전 세계적으로 이상 기후 현상이 증가하고 있다. 폭염, 홍수, 가뭄 등의 자연재해가 빈번해지면서 많은 사람들이 피해를 입고 있다. 과학자들은 이러한 현상의 주요 원인이 온실가스 배출이라고 지적한다. 따라서 각 국가와 개인이 탄소 배출을 줄이기 위한 노력을 해야 한다. 재생 에너지 사용, 대중교통 이용, 일회용품 줄이기 등 작은 실천부터 시작할 수 있다.',
    questions: [
      { question: '이 글에서 이상 기후의 주요 원인으로 지적된 것은?', options: ['인구 증가', '온실가스 배출', '산업 발전', '도시화'], answer: 1 },
      { question: '글에서 제안하지 않은 실천 방법은?', options: ['재생 에너지 사용', '대중교통 이용', '해외 여행 자제', '일회용품 줄이기'], answer: 2 },
    ],
  },
];

// Sample listening data
export const sampleListening: ListeningItem[] = [
  {
    id: 'l1', title: '대학 생활 안내', level: 3,
    transcript: '안녕하세요, 여러분. 오늘은 대학 생활에 대해 안내해 드리겠습니다. 먼저 수강 신청은 매 학기 시작 2주 전에 온라인으로 진행됩니다. 도서관은 평일 오전 9시부터 밤 10시까지 이용할 수 있습니다. 학생 식당은 점심시간에 가장 붐비니 시간을 잘 맞추시기 바랍니다. 동아리 활동에 관심이 있으시면 학생회관 1층을 방문해 주세요.',
    questions: [
      { question: '수강 신청은 언제 합니까?', options: ['학기 시작 후', '학기 시작 2주 전', '학기 시작 1달 전', '학기 중간'], answer: 1 },
      { question: '도서관 이용 시간은?', options: ['오전 8시~밤 9시', '오전 9시~밤 10시', '오전 10시~밤 11시', '24시간'], answer: 1 },
    ],
  },
  {
    id: 'l2', title: '직장 내 의사소통', level: 4,
    transcript: '효과적인 직장 내 의사소통을 위해서는 몇 가지 중요한 점이 있습니다. 첫째, 상대방의 이야기를 끝까지 들어야 합니다. 둘째, 자신의 의견을 명확하게 전달해야 합니다. 셋째, 비언어적 표현도 중요합니다. 표정이나 몸짓으로도 많은 것을 전달할 수 있기 때문입니다. 마지막으로, 이메일이나 메신저를 사용할 때는 오해가 생기지 않도록 정확한 표현을 사용해야 합니다.',
    questions: [
      { question: '효과적인 의사소통에서 중요하지 않은 것은?', options: ['상대방의 이야기 듣기', '명확한 의견 전달', '빠르게 말하기', '비언어적 표현'], answer: 2 },
      { question: '이메일 사용 시 주의할 점은?', options: ['빨리 보내기', '정확한 표현 사용', '이모티콘 사용', '짧게 쓰기'], answer: 1 },
    ],
  },
];

// Sample writing data
export const sampleWriting: WritingItem[] = [
  {
    id: 'w1', title: '그래프 설명하기 (51번)', taskType: 'Task 51', level: 3,
    prompt: '다음 그래프를 보고 내용을 설명하는 글을 쓰십시오. (그래프: 연도별 스마트폰 사용률 변화)',
    tips: ['그래프의 전체적인 추세를 먼저 설명하세요', '구체적인 수치를 포함하세요', '변화의 원인을 추측해 보세요'],
    sampleAnswer: '위 그래프는 2015년부터 2023년까지의 스마트폰 사용률 변화를 보여 주고 있다. 전체적으로 스마트폰 사용률은 꾸준히 증가하는 추세를 보이고 있다. 2015년에 70%였던 사용률은 2023년에 95%로 크게 증가하였다. 특히 2018년에서 2020년 사이에 급격한 증가가 있었는데, 이는 코로나19로 인한 비대면 활동의 증가와 관련이 있는 것으로 보인다.',
    keyExpressions: ['~을/를 보여 주고 있다', '전체적으로 ~는 추세를 보이고 있다', '~에서 ~로 증가/감소하였다', '이는 ~와/과 관련이 있는 것으로 보인다'],
  },
  {
    id: 'w2', title: '의견 쓰기 (53번)', taskType: 'Task 53', level: 4,
    prompt: '다음 주제에 대해 자신의 의견을 쓰십시오. "현대 사회에서 SNS의 영향"에 대해 찬성 또는 반대 입장을 밝히고 그 이유를 쓰십시오.',
    tips: ['서론에서 주제를 소개하고 입장을 밝히세요', '본론에서 2-3가지 근거를 제시하세요', '결론에서 의견을 정리하세요', '접속사를 적절히 사용하세요'],
    sampleAnswer: '현대 사회에서 SNS는 우리 생활에 큰 영향을 미치고 있다. 나는 SNS가 긍정적인 영향이 더 크다고 생각한다.\n\n첫째, SNS를 통해 전 세계 사람들과 소통할 수 있다. 지리적 제한 없이 다양한 문화를 접할 수 있으며, 이는 세계화 시대에 매우 중요한 능력이다.\n\n둘째, SNS는 정보를 빠르게 공유할 수 있는 플랫폼이다. 뉴스, 교육 자료, 전문 지식 등을 실시간으로 접할 수 있어 학습에도 도움이 된다.\n\n물론 개인정보 유출이나 가짜 뉴스 같은 문제도 있지만, 이는 올바른 사용 습관으로 해결할 수 있다고 생각한다. 따라서 SNS는 현대인에게 필수적인 소통 도구라고 할 수 있다.',
    keyExpressions: ['~에 큰 영향을 미치다', '~다고 생각한다', '첫째/둘째/셋째', '~을/를 통해', '따라서 ~라고 할 수 있다'],
  },
];