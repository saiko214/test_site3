// script.js
let currentQuizQuestions = []; // Тестке арналған ағымдағы сұрақтар
let currentQuestionIndex = 0;
let userAnswers = {};
const TOTAL_QUESTIONS_IN_TEST = 30;

// DOM элементтері
const mainMenu = document.getElementById('main-menu');
const variantSelection = document.getElementById('variant-selection');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const questionContainer = document.getElementById('question-container');
const nextButton = document.getElementById('next-button');
const finishButton = document.getElementById('finish-button');
const progressText = document.getElementById('progress-text');
const quizTitle = document.getElementById('quiz-title');

// Экрандарды ауыстыру функциясы
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function showMainMenu() {
    showScreen('main-menu');
}

function showVariantSelection() {
    showScreen('variant-selection');
}

/**
 * Вариантқа сәйкес тестті бастау
 * @param {string} variantKey - 'variant1', 'variant2', ...
 */
function startSpecificTest(variantKey) {
    let start, end;
    
    switch (variantKey) {
        case 'variant1': start = 1; end = 30; quizTitle.textContent = "Тест: 1-Вариант (Сұрақ 1-30)"; break;
        case 'variant2': start = 31; end = 60; quizTitle.textContent = "Тест: 2-Вариант (Сұрақ 31-60)"; break;
        case 'variant3': start = 61; end = 90; quizTitle.textContent = "Тест: 3-Вариант (Сұрақ 61-90)"; break;
        case 'variant4': start = 91; end = 120; quizTitle.textContent = "Тест: 4-Вариант (Сұрақ 91-120)"; break;
        case 'variant5': start = 121; end = 150; quizTitle.textContent = "Тест: 5-Вариант (Сұрақ 121-150)"; break;
        default: return;
    }

    currentQuizQuestions = allQuestions.slice(start - 1, end);
    initTest();
}

/**
 * Кездейсоқ 30 сұрақтан тұратын тестті бастау
 */
function startRandomTest() {
    // allQuestions массивін араластыру
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    
    // Алғашқы 30 сұрақты алу
    currentQuizQuestions = shuffled.slice(0, TOTAL_QUESTIONS_IN_TEST);
    quizTitle.textContent = "Тест: Кездейсоқ 30 Сұрақ";

    initTest();
}

// Тестті бастапқы қалыпқа келтіру
function initTest() {
    currentQuestionIndex = 0;
    userAnswers = {};
    nextButton.classList.remove('hidden');
    finishButton.classList.add('hidden');
    showScreen('quiz-screen');
    loadQuestion(currentQuestionIndex);
}

// Сұрақты жүктеу және көрсету
function loadQuestion(index) {
    const questionData = currentQuizQuestions[index];
    const questionNumber = index + 1;
    const totalQuestions = currentQuizQuestions.length;

    progressText.textContent = `${questionNumber} / ${totalQuestions}`;

    // Тестті аяқтау немесе келесі сұрақ түймелерін көрсету логикасы
    if (questionNumber === totalQuestions) {
        nextButton.classList.add('hidden');
        finishButton.classList.remove('hidden');
    } else {
        nextButton.classList.remove('hidden');
        finishButton.classList.add('hidden');
    }

    let optionsHtml = '';
    const questionId = questionData.id;

    // Сұрақ нұсқаларын генерациялау
    for (const key in questionData.options) {
        const optionValue = questionData.options[key];
        const isChecked = userAnswers[questionId] === key ? 'checked' : '';
        
        optionsHtml += `
            <li>
                <label class="option-label">
                    <input type="radio" 
                           name="question-${questionId}" 
                           value="${key}" 
                           onclick="saveAnswer(${questionId}, '${key}')"
                           ${isChecked}>
                    ${key}) ${optionValue}
                </label>
            </li>
        `;
    }

    questionContainer.innerHTML = `
        <h3>${questionData.id} Сұрақ. ${questionData.question}</h3>
        <ul class="options-list">
            ${optionsHtml}
        </ul>
    `;
}

// Пайдаланушы жауабын сақтау
function saveAnswer(questionId, answerKey) {
    userAnswers[questionId] = answerKey;
}

// Келесі сұраққа өту
function nextQuestion() {
    const currentQuestionId = currentQuizQuestions[currentQuestionIndex].id;
    
    // Жауап берілмеген болса, ескерту беру (міндетті емес)
    if (!userAnswers[currentQuestionId]) {
        alert("Жауапты таңдаңыз!");
        return;
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuizQuestions.length) {
        loadQuestion(currentQuestionIndex);
    } else {
        // Бұл кодқа жетуі мүмкін емес, бірақ сақтық үшін қалдырылды
        finishTest();
    }
}

// Тестті аяқтау және нәтижелерді көрсету
function finishTest() {
    const totalQuestions = currentQuizQuestions.length;
    let correctCount = 0;
    let incorrectAnswers = [];

    currentQuizQuestions.forEach(q => {
        const userAnswer = userAnswers[q.id];
        if (userAnswer && userAnswer === q.answer) {
            correctCount++;
        } else if (userAnswer) {
            incorrectAnswers.push({
                id: q.id,
                question: q.question,
                userAnswer: userAnswer,
                correctAnswer: q.answer
            });
        }
        // Жауап берілмесе де, қате ретінде саналады, бірақ тізімге қосылмайды
    });

    // Нәтижелерді есептеу
    const percentage = (correctCount / totalQuestions) * 100;
    const score = Math.round((correctCount / totalQuestions) * 100); // 30 сұрақтан 100 баллға аудару

    // Нәтижелерді көрсету
    document.getElementById('correct-count').textContent = correctCount;
    document.getElementById('percentage').textContent = `${percentage.toFixed(1)}%`;
    document.getElementById('score').textContent = `${score} / 100`;

    const incorrectAnswersDiv = document.getElementById('incorrect-answers');
    incorrectAnswersDiv.innerHTML = '';

    if (incorrectAnswers.length > 0) {
        document.getElementById('no-incorrect-answers').style.display = 'none';
        incorrectAnswers.forEach(item => {
            const originalQuestion = allQuestions.find(q => q.id === item.id);
            const userOptionText = originalQuestion.options[item.userAnswer] || "Жауап берілмеген";
            const correctOptionText = originalQuestion.options[item.correctAnswer];
            
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('incorrect-answer-item');
            itemDiv.innerHTML = `
                <p><strong>Сұрақ ${item.id}:</strong> ${item.question}</p>
                <p>Сіздің жауабыңыз: <strong>${item.userAnswer}) ${userOptionText}</strong></p>
                <p class="correct-answer">Дұрыс жауап: <strong>${item.correctAnswer}) ${correctOptionText}</strong></p>
            `;
            incorrectAnswersDiv.appendChild(itemDiv);
        });
    } else {
        document.getElementById('no-incorrect-answers').style.display = 'block';
    }

    showScreen('results-screen');
}

// Бастапқы бетті жүктеу
showMainMenu();