// ========== COMBINED PAYMENT + FLASHCARD SYSTEM ==========
console.log("Combined system loaded");

// Global state
let currentUserEmail = '';
let currentCardIndex = 0;
let currentDeck = [];
let currentLevel = 'b2';
let currentLesson = '';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    checkPremiumStatus();
    populateLessonSelector();
    console.log("Application initialized successfully");
}

function setupEventListeners() {
    // Premium button in navigation
    const premiumButton = document.getElementById('premiumButton');
    if (premiumButton) {
        premiumButton.addEventListener('click', openPaymentModal);
        console.log("Premium button event listener added");
    }
    
    // Flashcard flip
    const flashcard = document.getElementById('flashcard');
    if (flashcard) {
        flashcard.addEventListener('click', flipCard);
    }
    
    // Navigation buttons
    const flipBtn = document.getElementById('flipBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const shuffleBtn = document.getElementById('shuffleBtn');
    
    if (flipBtn) flipBtn.addEventListener('click', flipCard);
    if (prevBtn) prevBtn.addEventListener('click', showPreviousCard);
    if (nextBtn) nextBtn.addEventListener('click', showNextCard);
    if (shuffleBtn) shuffleBtn.addEventListener('click', shuffleDeck);
}

// ========== LESSON SELECTOR ==========
function populateLessonSelector() {
    const lessonSelect = document.getElementById('lessonSelect');
    if (!lessonSelect || !levels || !levels.b2) {
        console.error("Cannot populate lesson selector");
        return;
    }
    
    lessonSelect.innerHTML = '<option value="">-- Select a Lesson --</option>';
    
    const lessons = levels.b2.lessons;
    const lessonKeys = Object.keys(lessons);
    
    lessonKeys.forEach(lessonKey => {
        const lesson = lessons[lessonKey];
        const option = document.createElement('option');
        option.value = lessonKey;
        option.textContent = lesson.name;
        
        // Mark free vs premium
        if (lesson.premium) {
            option.textContent += ' 🔒';
        } else {
            option.textContent += ' 🆓';
        }
        
        lessonSelect.appendChild(option);
    });
    
    console.log("Lesson selector populated with", lessonKeys.length, "lessons");
}

function loadSelectedLesson() {
    const lessonSelect = document.getElementById('lessonSelect');
    const selectedLesson = lessonSelect.value;
    
    if (!selectedLesson) {
        // Clear display if no lesson selected
        clearFlashcardDisplay();
        return;
    }
    
    loadLesson(selectedLesson);
}

function clearFlashcardDisplay() {
    const germanText = document.getElementById('german-text');
    const englishText = document.getElementById('english-text');
    const currentSpan = document.getElementById('currentCard');
    const totalSpan = document.getElementById('totalCards');
    
    if (germanText) germanText.textContent = 'Select a lesson to start';
    if (englishText) englishText.textContent = 'Choose from the dropdown above';
    if (currentSpan) currentSpan.textContent = '1';
    if (totalSpan) totalSpan.textContent = '0';
    
    // Hide premium upsell, show free content
    showFreeContent();
}

// ========== FLASHCARD SYSTEM ==========
function loadLesson(lessonKey) {
    console.log("Loading lesson:", lessonKey);
    
    if (!levels || !levels[currentLevel] || !levels[currentLevel].lessons[lessonKey]) {
        console.error("Lesson not found:", lessonKey);
        return;
    }
    
    const lesson = levels[currentLevel].lessons[lessonKey];
    
    // PREMIUM CHECK - Show upsell for premium lessons (Lektion 3-13)
    if (lesson.premium && !isPremiumUser()) {
        showPremiumUpsell();
        return;
    }
    
    currentLesson = lessonKey;
    currentDeck = [...lesson.cards];
    currentCardIndex = 0;
    
    console.log("Loaded deck:", currentDeck.length, "cards");
    showCard();
    showFreeContent(); // Show flashcards
}

function showCard() {
    const germanText = document.getElementById('german-text');
    const englishText = document.getElementById('english-text');
    
    if (!germanText || !englishText || currentDeck.length === 0) {
        console.log("No cards to display");
        return;
    }

    const currentCard = currentDeck[currentCardIndex];
    germanText.textContent = currentCard.german;
    englishText.textContent = currentCard.english;

    // Reset card to front
    const flashcard = document.getElementById('flashcard');
    if (flashcard) {
        flashcard.classList.remove('flipped');
    }
    
    updateProgress();
}

function updateProgress() {
    const currentSpan = document.getElementById('currentCard');
    const totalSpan = document.getElementById('totalCards');
    
    if (currentSpan) currentSpan.textContent = currentCardIndex + 1;
    if (totalSpan) totalSpan.textContent = currentDeck.length;
}

function flipCard() {
    const flashcard = document.getElementById('flashcard');
    if (flashcard) {
        flashcard.classList.toggle('flipped');
    }
}

function showNextCard() {
    if (currentCardIndex < currentDeck.length - 1) {
        currentCardIndex++;
        showCard();
    }
}

function showPreviousCard() {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        showCard();
    }
}

function shuffleDeck() {
    if (currentDeck.length === 0) return;
    
    // Fisher-Yates shuffle
    for (let i = currentDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentDeck[i], currentDeck[j]] = [currentDeck[j], currentDeck[i]];
    }
    currentCardIndex = 0;
    showCard();
}

// ========== PREMIUM/PREMIUM CONTROLS ==========
function showPremiumUpsell() {
    const premiumUpsell = document.getElementById('premiumUpsell');
    const freeContent = document.querySelector('.free-content');
    
    if (premiumUpsell && freeContent) {
        freeContent.style.display = 'none';
        premiumUpsell.style.display = 'block';
    }
}

function showFreeContent() {
    const premiumUpsell = document.getElementById('premiumUpsell');
    const freeContent = document.querySelector('.free-content');
    
    if (premiumUpsell && freeContent) {
        freeContent.style.display = 'block';
        premiumUpsell.style.display = 'none';
    }
}

// ========== PAYMENT SYSTEM ==========
function openPaymentModal() {
    console.log("Opening payment modal");
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.style.display = 'block';
        console.log("Payment modal opened successfully");
    } else {
        console.error("Payment modal not found");
    }
}

function closePaymentModal() {
    console.log("Closing payment modal");
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.style.display = 'none';
        const emailInput = document.getElementById('userEmail');
        if (emailInput) emailInput.value = '';
    }
}

function processPayment() {
    console.log("Processing payment...");
    
    const emailInput = document.getElementById('userEmail');
    if (!emailInput) {
        alert('Email input not found');
        return;
    }
    
    const userEmail = emailInput.value.trim();
    
    if (!userEmail || !isValidEmail(userEmail)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    currentUserEmail = userEmail;
    console.log("Processing payment for:", userEmail);
    
    const handler = PaystackPop.setup({
        key: 'pk_live_0ad4453a77ae5457237c4ae64748381821766d04',
        email: userEmail,
        amount: 999, // €9.99 in cents
        currency: 'EUR',
        ref: 'SUB_' + Math.floor((Math.random() * 1000000000) + 1),
        metadata: {
            custom_fields: [
                {
                    display_name: "Subscription Type",
                    variable_name: "subscription_type", 
                    value: "monthly"
                }
            ]
        },
        onClose: function() {
            console.log("Payment window closed by user");
            alert('Subscription cancelled. You can subscribe anytime!');
        },
        callback: function(response) {
            console.log("Payment successful!", response);
            handleSuccessfulPayment(response);
        }
    });
    
    handler.openIframe();
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function handleSuccessfulPayment(response) {
    console.log("Handling successful payment:", response);
    
    closePaymentModal();
    alert('🎉 Subscription successful! You now have access to Lektion 3-13!');
    activatePremiumFeatures();
}

function activatePremiumFeatures() {
    console.log("Activating premium features");
    
    const premiumButton = document.getElementById('premiumButton');
    if (premiumButton) {
        premiumButton.style.display = 'none';
    }
    
    localStorage.setItem('premiumUser', 'true');
    localStorage.setItem('premiumEmail', currentUserEmail);
    localStorage.setItem('premiumSince', new Date().toISOString());
    
    // Reload current lesson if it was premium
    if (currentLesson) {
        loadLesson(currentLesson);
    }
}

function isPremiumUser() {
    return localStorage.getItem('premiumUser') === 'true';
}

function checkPremiumStatus() {
    const isPremium = isPremiumUser();
    console.log("Premium status check:", isPremium);
    
    if (isPremium) {
        activatePremiumFeatures();
    }
}

// Make functions globally available
window.openPaymentModal = openPaymentModal;
window.closePaymentModal = closePaymentModal;
window.processPayment = processPayment;
window.loadSelectedLesson = loadSelectedLesson;

// Close modal if clicked outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('paymentModal');
    if (event.target === modal) {
        closePaymentModal();
    }
}); 
