// ========== SECURITY SETUP ========== //
function setupSecurity() {
    // Prevent console errors from leaking info
    window.onerror = function(msg, url, lineNo, columnNo, error) {
        console.log('Application error handled securely');
        return false;
    };
    
    // Clickjacking protection
    if (window.self !== window.top) {
        window.top.location = window.self.location;
    }
    
    // Log security events (optional)
    console.log('Security initialized: Owitics Flashcards');
}

// Initialize security when page loads
document.addEventListener('DOMContentLoaded', function() {
    setupSecurity();
    console.log("DOM loaded, initializing app...");
    init();
});
// ========== ENHANCED APP LOGIC ========== //

// DOM Elements
const flashcardElement = document.getElementById('flashcard');
const germanTextElement = document.getElementById('german-text');
const englishTextElement = document.getElementById('english-text');
const prevButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn');
const shuffleButton = document.getElementById('shuffle-btn');
const currentCardSpan = document.getElementById('current');
const totalCardsSpan = document.getElementById('total');
const levelSelect = document.getElementById('level-select');
const lessonSelect = document.getElementById('lesson-select');

// State Variables
let currentCardIndex = 0;
let currentDeck = [];
let currentLevel = 'b2';
let currentLesson = '';

// Initialize the App
function init() {
    console.log("Initializing app...");
    console.log("Available levels:", Object.keys(levels));
    
    // Populate level selector
    populateLevelSelector();
    
    // Load the initial level and first lesson
    loadLevel(currentLevel);
    
    // Set up level change listener
    levelSelect.addEventListener('change', function() {
        loadLevel(this.value);
    });
    
    // Set up lesson change listener
    lessonSelect.addEventListener('change', function() {
        loadLesson(this.value);
    });
}

// Populate level selector dropdown
function populateLevelSelector() {
    levelSelect.innerHTML = '';
    
    Object.keys(levels).forEach(levelKey => {
        const option = document.createElement('option');
        option.value = levelKey;
        option.textContent = levels[levelKey].name;
        levelSelect.appendChild(option);
    });
}

// Populate lesson selector based on current level
function populateLessonSelector(levelKey) {
    lessonSelect.innerHTML = '';
    
    const level = levels[levelKey];
    const lessons = level.lessons;
    
    if (Object.keys(lessons).length === 0) {
        const option = document.createElement('option');
        option.textContent = "No lessons available";
        option.disabled = true;
        lessonSelect.appendChild(option);
        return;
    }
    
    Object.keys(lessons).forEach(lessonKey => {
        const option = document.createElement('option');
        option.value = lessonKey;
        option.textContent = lessons[lessonKey].name;
        lessonSelect.appendChild(option);
    });
    
    // Load the first lesson by default
    const firstLessonKey = Object.keys(lessons)[0];
    loadLesson(firstLessonKey);
}

// Load a specific level
function loadLevel(levelKey) {
    console.log("Loading level:", levelKey);
    
    if (!levels[levelKey]) {
        console.error("Level not found:", levelKey);
        return;
    }
    
    currentLevel = levelKey;
    
    // Populate lesson selector for this level
    populateLessonSelector(levelKey);
}

// Load a specific lesson
function loadLesson(lessonKey) {
    console.log("Loading lesson:", lessonKey);
    
    const level = levels[currentLevel];
    
    if (!level.lessons[lessonKey]) {
        console.error("Lesson not found:", lessonKey);
        germanTextElement.textContent = "Lesson data not loaded";
        englishTextElement.textContent = "Please check console";
        return;
    }
    
    currentLesson = lessonKey;
    currentDeck = [...level.lessons[lessonKey].cards];
    currentCardIndex = 0;
    
    console.log("Loaded deck:", currentDeck.length, "cards");
    showCard();
}

// Display the current card
function showCard() {
    if (currentDeck.length === 0) {
        germanTextElement.textContent = "No cards available";
        englishTextElement.textContent = "Select a lesson";
        totalCardsSpan.textContent = "0";
        return;
    }

    const currentCard = currentDeck[currentCardIndex];
    germanTextElement.textContent = currentCard.german;
    englishTextElement.textContent = currentCard.english;
    currentCardSpan.textContent = currentCardIndex + 1;
    totalCardsSpan.textContent = currentDeck.length;

    // Reset the card to front-facing when a new card is shown
    flashcardElement.classList.remove('flipped');

    // Update button states
    prevButton.disabled = currentCardIndex === 0;
    nextButton.disabled = currentCardIndex === currentDeck.length - 1;
}

// Flip the card on click
flashcardElement.addEventListener('click', function() {
    this.classList.toggle('flipped');
});

// Next Card
nextButton.addEventListener('click', function() {
    if (currentCardIndex < currentDeck.length - 1) {
        currentCardIndex++;
        showCard();
    }
});

// Previous Card
prevButton.addEventListener('click', function() {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        showCard();
    }
});

// Shuffle Deck
shuffleButton.addEventListener('click', function() {
    if (currentDeck.length === 0) return;
    
    // Fisher-Yates Shuffle Algorithm
    for (let i = currentDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentDeck[i], currentDeck[j]] = [currentDeck[j], currentDeck[i]];
    }
    currentCardIndex = 0;
    showCard();
});

// Start the application when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing app...");
    init();
});
// Premium system functions
function isPremiumUser() {
    return localStorage.getItem('premiumUser') === 'true';
}

function showPremiumUpsell() {
    const flashcardContainer = document.querySelector('.flashcard-container');
    flashcardContainer.innerHTML = `
        <div class="premium-upsell">
            <div class="premium-card">
                <h3>🔒 Premium Content Locked</h3>
                <p>Upgrade to unlock all 13 German B2 lessons!</p>
                
                <div class="premium-features">
                    <h4>What you get:</h4>
                    <ul>
                        <li>✅ 12 additional lessons (600+ cards)</li>
                        <li>✅ Full B2 vocabulary course</li>
                        <li>✅ Future C1/C2 content</li>
                        <li>✅ Priority support</li>
                    </ul>
                </div>
                
                <div class="pricing">
                    <div class="price-option">
                        <h4>Monthly</h4>
                        <p class="price">$9.99/month</p>
                        <button onclick="showPaymentModal('monthly')" class="subscribe-btn">Subscribe Now</button>
                    </div>
                    <div class="price-option">
                        <h4>Yearly (Save 40%)</h4>
                        <p class="price">$59.99/year</p>
                        <button onclick="showPaymentModal('yearly')" class="subscribe-btn">Subscribe Now</button>
                    </div>
                </div>
                
                <p class="free-trial">7-day free trial included • Cancel anytime</p>
            </div>
        </div>
    `;
}

function showPaymentModal(plan) {
    alert(`Payment system coming soon! Selected: ${plan} plan`);
    // We'll replace this with Stripe later
}

// Update loadLesson function to check premium status
function loadLesson(lessonKey) {
    console.log("Loading lesson:", lessonKey);
    
    const level = levels[currentLevel];
    
    if (!level.lessons[lessonKey]) {
        console.error("Lesson not found:", lessonKey);
        return;
    }
    
    const lesson = level.lessons[lessonKey];
    
    // PREMIUM CHECK - Add this block
    if (lesson.premium && !isPremiumUser()) {
        showPremiumUpsell();
        return;
    }
    
    currentLesson = lessonKey;
    currentDeck = [...lesson.cards];
    currentCardIndex = 0;
    
    console.log("Loaded deck:", currentDeck.length, "cards");
    showCard();
}
