// Sample TOPIK II Vocabulary Data
// You can replace this with your own vocabulary data

const vocabularyData = [
    {
        id: 1,
        korean: "경제",
        romanization: "gyeongje",
        english: "Economy",
        category: "work",
        example: "한국의 경제가 빠르게 성장하고 있습니다.",
        exampleTranslation: "Korea's economy is growing rapidly.",
        mastered: false
    },
    {
        id: 2,
        korean: "문화",
        romanization: "munhwa",
        english: "Culture",
        category: "society",
        example: "한국 문화는 세계적으로 유명합니다.",
        exampleTranslation: "Korean culture is famous worldwide.",
        mastered: false
    },
    {
        id: 3,
        korean: "교육",
        romanization: "gyoyuk",
        english: "Education",
        category: "education",
        example: "한국에서 교육은 매우 중요합니다.",
        exampleTranslation: "Education is very important in Korea.",
        mastered: false
    },
    {
        id: 4,
        korean: "환경",
        romanization: "hwangyeong",
        english: "Environment",
        category: "society",
        example: "환경 보호는 우리 모두의 책임입니다.",
        exampleTranslation: "Environmental protection is everyone's responsibility.",
        mastered: false
    },
    {
        id: 5,
        korean: "기술",
        romanization: "gisul",
        english: "Technology",
        category: "work",
        example: "한국은 첨단 기술로 유명합니다.",
        exampleTranslation: "Korea is famous for advanced technology.",
        mastered: false
    },
    {
        id: 6,
        korean: "여행",
        romanization: "yeohaeng",
        english: "Travel",
        category: "daily",
        example: "주말에 여행을 가는 것을 좋아합니다.",
        exampleTranslation: "I like to go on trips on weekends.",
        mastered: false
    },
    {
        id: 7,
        korean: "건강",
        romanization: "geongang",
        english: "Health",
        category: "daily",
        example: "건강을 위해 운동을 꾸준히 해야 합니다.",
        exampleTranslation: "You should exercise consistently for your health.",
        mastered: false
    },
    {
        id: 8,
        korean: "전통",
        romanization: "jeontong",
        english: "Tradition",
        category: "culture",
        example: "한국의 전통 문화를 보존하는 것이 중요합니다.",
        exampleTranslation: "It's important to preserve Korean traditional culture.",
        mastered: false
    },
    {
        id: 9,
        korean: "사회",
        romanization: "sahoe",
        english: "Society",
        category: "society",
        example: "현대 사회에서 기술은 매우 중요합니다.",
        exampleTranslation: "Technology is very important in modern society.",
        mastered: false
    },
    {
        id: 10,
        korean: "가족",
        romanization: "gajok",
        english: "Family",
        category: "daily",
        example: "가족과 함께 시간을 보내는 것이 좋습니다.",
        exampleTranslation: "It's nice to spend time with family.",
        mastered: false
    },
    {
        id: 11,
        korean: "식품",
        romanization: "sikpum",
        english: "Food products",
        category: "daily",
        example: "한국 식품은 세계적으로 인기가 있습니다.",
        exampleTranslation: "Korean food products are popular worldwide.",
        mastered: false
    },
    {
        id: 12,
        korean: "의료",
        romanization: "uiryo",
        english: "Medical",
        category: "work",
        example: "한국 의료 시스템은 매우 발달했습니다.",
        exampleTranslation: "Korea's medical system is very developed.",
        mastered: false
    },
    {
        id: 13,
        korean: "예술",
        romanization: "yesul",
        english: "Art",
        category: "culture",
        example: "한국 예술은 다양하고 풍부합니다.",
        exampleTranslation: "Korean art is diverse and rich.",
        mastered: false
    },
    {
        id: 14,
        korean: "과학",
        romanization: "gwahak",
        english: "Science",
        category: "education",
        example: "과학 기술의 발전이 사회를 변화시킵니다.",
        exampleTranslation: "The development of science and technology changes society.",
        mastered: false
    },
    {
        id: 15,
        korean: "정책",
        romanization: "chaengjeok",
        english: "Policy",
        category: "society",
        example: "정부의 새로운 정책이 시행되었습니다.",
        exampleTranslation: "The government's new policy has been implemented.",
        mastered: false
    }
];

// Vocabulary Manager Class
class VocabularyManager {
    constructor() {
        this.vocabulary = vocabularyData;
        this.currentView = 'list';
        this.currentCardIndex = 0;
        this.filteredVocabulary = [...this.vocabulary];
        this.masteredWords = JSON.parse(localStorage.getItem('masteredWords')) || [];
        this.loadMasteredState();
    }

    loadMasteredState() {
        this.vocabulary.forEach(word => {
            if (this.masteredWords.includes(word.id)) {
                word.mastered = true;
            }
        });
    }

    saveMasteredState() {
        this.masteredWords = this.vocabulary.filter(w => w.mastered).map(w => w.id);
        localStorage.setItem('masteredWords', JSON.stringify(this.masteredWords));
    }

    search(query) {
        const searchTerm = query.toLowerCase();
        this.filteredVocabulary = this.vocabulary.filter(word => 
            word.korean.includes(searchTerm) ||
            word.english.toLowerCase().includes(searchTerm) ||
            word.romanization.toLowerCase().includes(searchTerm)
        );
        this.updateStats();
        return this.filteredVocabulary;
    }

    filterByCategory(category) {
        if (category === 'all') {
            this.filteredVocabulary = [...this.vocabulary];
        } else {
            this.filteredVocabulary = this.vocabulary.filter(word => word.category === category);
        }
        this.updateStats();
        return this.filteredVocabulary;
    }

    getMasteredCount() {
        return this.vocabulary.filter(w => w.mastered).length;
    }

    markAsMastered(id) {
        const word = this.vocabulary.find(w => w.id === id);
        if (word) {
            word.mastered = !word.mastered;
            this.saveMasteredState();
            this.updateStats();
        }
    }

    updateStats() {
        const totalCount = document.getElementById('total-count');
        const showingCount = document.getElementById('showing-count');
        const masteredCount = document.getElementById('mastered-count');

        if (totalCount) totalCount.textContent = this.vocabulary.length;
        if (showingCount) showingCount.textContent = this.filteredVocabulary.length;
        if (masteredCount) masteredCount.textContent = this.getMasteredCount();
    }

    renderListView() {
        const container = document.getElementById('vocabulary-list');
        if (!container) return;

        container.innerHTML = '';

        if (this.filteredVocabulary.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12 text-gray-500">
                    <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p class="text-lg">No vocabulary found</p>
                </div>
            `;
            return;
        }

        this.filteredVocabulary.forEach(word => {
            const item = document.createElement('div');
            item.className = `vocab-item bg-white rounded-xl p-6 shadow-md ${word.mastered ? 'border-l-4 border-green-500' : ''}`;
            item.innerHTML = `
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <div class="flex items-center space-x-3 mb-2">
                            <span class="text-2xl font-bold text-gray-800 korean-text">${word.korean}</span>
                            <span class="text-gray-500">(${word.romanization})</span>
                            ${word.mastered ? '<span class="mastered-badge text-xs text-white px-2 py-1 rounded-full">Mastered</span>' : ''}
                        </div>
                        <p class="text-lg text-blue-600 font-medium mb-2">${word.english}</p>
                        <span class="category-tag category-${word.category}">${word.category}</span>
                        <div class="mt-4 p-4 bg-gray-50 rounded-lg">
                            <p class="text-gray-700 mb-2">${word.example}</p>
                            <p class="text-sm text-gray-500">${word.exampleTranslation}</p>
                        </div>
                    </div>
                    <button class="master-btn p-2 rounded-lg ${word.mastered ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'} hover:bg-green-200 transition" data-id="${word.id}">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </button>
                </div>
            `;
            container.appendChild(item);
        });

        // Add event listeners to master buttons
        document.querySelectorAll('.master-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(btn.dataset.id);
                this.markAsMastered(id);
                this.renderListView();
            });
        });
    }

    renderFlashcardView() {
        const card = document.getElementById('flashcard');
        const korean = document.getElementById('card-korean');
        const romanization = document.getElementById('card-romanization');
        const english = document.getElementById('card-english');
        const example = document.getElementById('card-example');
        const exampleTranslation = document.getElementById('card-example-translation');
        const currentNum = document.getElementById('current-card-num');
        const totalCards = document.getElementById('total-cards');

        if (!card || this.filteredVocabulary.length === 0) return;

        const word = this.filteredVocabulary[this.currentCardIndex];
        
        korean.textContent = word.korean;
        romanization.textContent = word.romanization;
        english.textContent = word.english;
        example.textContent = word.example;
        exampleTranslation.textContent = word.exampleTranslation;
        
        currentNum.textContent = this.currentCardIndex + 1;
        totalCards.textContent = this.filteredVocabulary.length;
        
        // Remove flipped class
        card.classList.remove('flipped');
    }

    nextCard() {
        if (this.currentCardIndex < this.filteredVocabulary.length - 1) {
            this.currentCardIndex++;
            this.renderFlashcardView();
        }
    }

    prevCard() {
        if (this.currentCardIndex > 0) {
            this.currentCardIndex--;
            this.renderFlashcardView();
        }
    }

    flipCard() {
        const card = document.getElementById('flashcard');
        if (card) {
            card.classList.toggle('flipped');
        }
    }

    setView(view) {
        this.currentView = view;
        const listView = document.getElementById('list-view');
        const flashcardView = document.getElementById('flashcard-view');
        const listBtn = document.getElementById('list-view-btn');
        const flashcardBtn = document.getElementById('flashcard-view-btn');

        if (view === 'list') {
            listView.classList.remove('hidden');
            flashcardView.classList.add('hidden');
            listBtn.classList.add('bg-blue-600', 'text-white');
            listBtn.classList.remove('bg-gray-200', 'text-gray-700');
            flashcardBtn.classList.remove('bg-blue-600', 'text-white');
            flashcardBtn.classList.add('bg-gray-200', 'text-gray-700');
            this.renderListView();
        } else {
            listView.classList.add('hidden');
            flashcardView.classList.remove('hidden');
            flashcardBtn.classList.add('bg-blue-600', 'text-white');
            flashcardBtn.classList.remove('bg-gray-200', 'text-gray-700');
            listBtn.classList.remove('bg-blue-600', 'text-white');
            listBtn.classList.add('bg-gray-200', 'text-gray-700');
            this.currentCardIndex = 0;
            this.renderFlashcardView();
        }
    }
}

// Initialize Vocabulary Manager
const vocabManager = new VocabularyManager();

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initial render
    vocabManager.updateStats();
    vocabManager.renderListView();

    // View toggle buttons
    document.getElementById('list-view-btn')?.addEventListener('click', () => {
        vocabManager.setView('list');
    });

    document.getElementById('flashcard-view-btn')?.addEventListener('click', () => {
        vocabManager.setView('flashcard');
    });

    // Search input
    document.getElementById('search-input')?.addEventListener('input', (e) => {
        vocabManager.search(e.target.value);
        if (vocabManager.currentView === 'list') {
            vocabManager.renderListView();
        }
    });

    // Category filter
    document.getElementById('category-filter')?.addEventListener('change', (e) => {
        vocabManager.filterByCategory(e.target.value);
        if (vocabManager.currentView === 'list') {
            vocabManager.renderListView();
        }
    });

    // Flashcard navigation
    document.getElementById('next-card')?.addEventListener('click', () => {
        vocabManager.nextCard();
    });

    document.getElementById('prev-card')?.addEventListener('click', () => {
        vocabManager.prevCard();
    });

    // Flashcard flip
    document.getElementById('flashcard')?.addEventListener('click', () => {
        vocabManager.flipCard();
    });

    // Mark as mastered in flashcard view
    document.getElementById('mark-mastered')?.addEventListener('click', () => {
        const word = vocabManager.filteredVocabulary[vocabManager.currentCardIndex];
        if (word) {
            vocabManager.markAsMastered(word.id);
            vocabManager.renderFlashcardView();
        }
    });

    // Keyboard navigation for flashcards
    document.addEventListener('keydown', (e) => {
        if (vocabManager.currentView === 'flashcard') {
            if (e.key === 'ArrowRight') {
                vocabManager.nextCard();
            } else if (e.key === 'ArrowLeft') {
                vocabManager.prevCard();
            } else if (e.key === ' ') {
                e.preventDefault();
                vocabManager.flipCard();
            }
        }
    });
});