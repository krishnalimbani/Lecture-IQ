const state = {

    data: null,

    quizAnswers: {},

    quizSubmitted: false,

    flashcards: [],

    originalFlashcards: [],

    flashcardIndex: 0,

    history: [],

    stats: {

        notesGenerated: 0,

        quizAttempts: 0,

        bestScore: null

    }

};


// ============================================================
// DOM HELPERS
// ============================================================

const $ = selector =>
    document.querySelector(selector);


const $$ = selector =>
    document.querySelectorAll(selector);


// ============================================================
// SAMPLE LECTURE
// ============================================================

const SAMPLE_LECTURE = `
Artificial Intelligence is a branch of computer science that focuses
on creating systems capable of performing tasks that normally require
human intelligence.

Machine learning is a major part of artificial intelligence. It allows
computers to learn patterns from data and make predictions without being
explicitly programmed for every task.

Deep learning is a type of machine learning that uses neural networks
with multiple layers. These networks can process large amounts of data
and identify complex patterns.

Natural language processing allows computers to understand and process
human language. It is used in chatbots, translation systems, sentiment
analysis and voice assistants.

Computer vision allows machines to understand images and videos. It is
commonly used for object detection, facial recognition and medical image
analysis.

Artificial intelligence is widely used in education, healthcare,
finance, transportation and many other industries.
`.trim();


// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadTheme();

        loadStats();

        loadHistory();

        setupNavigation();

        setupInput();

        setupQuiz();

        setupFlashcards();

        setupHistory();

        setupTheme();

        setupModal();

        setupScrollReveal();

    }
);


// ============================================================
// NAVIGATION
// ============================================================

function setupNavigation() {

    $$(".nav-item").forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const targetId =
                    button.dataset.target;

                const target =
                    document.getElementById(
                        targetId
                    );


                if (!target) {
                    return;
                }


                $$(".nav-item").forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                });


                button.classList.add(
                    "active"
                );


                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    });

}


// ============================================================
// INPUT
// ============================================================

function setupInput() {

    $("#sampleLectureBtn")
        .addEventListener(
            "click",
            useSampleLecture
        );


    $("#clearInput")
        .addEventListener(
            "click",
            clearInput
        );


    $("#generateBtn")
        .addEventListener(
            "click",
            generateStudyPack
        );


    const dropZone =
        $("#dropZone");

    const fileInput =
        $("#fileInput");


    dropZone.addEventListener(
        "click",
        () => fileInput.click()
    );


    fileInput.addEventListener(
        "change",
        event => {

            const file =
                event.target.files[0];

            if (file) {
                uploadFile(file);
            }

        }
    );


    dropZone.addEventListener(
        "dragover",
        event => {

            event.preventDefault();

            dropZone.classList.add(
                "dragging"
            );

        }
    );


    dropZone.addEventListener(
        "dragleave",
        () => {

            dropZone.classList.remove(
                "dragging"
            );

        }
    );


    dropZone.addEventListener(
        "drop",
        event => {

            event.preventDefault();

            dropZone.classList.remove(
                "dragging"
            );


            const file =
                event.dataTransfer.files[0];


            if (file) {
                uploadFile(file);
            }

        }
    );


    $("#removeFile")
        .addEventListener(
            "click",
            removeFile
        );


    $("#copySummary")
        .addEventListener(
            "click",
            copySummary
        );


    $("#copyNotes")
        .addEventListener(
            "click",
            copyNotes
        );


    $("#downloadNotes")
        .addEventListener(
            "click",
            downloadNotes
        );

}


function useSampleLecture() {

    $("#lectureInput").value =
        SAMPLE_LECTURE;


    showToast(
        "Sample lecture added."
    );


    $("#lectureInput").focus();

}


function clearInput() {

    $("#lectureInput").value = "";

    removeFile();

    showToast(
        "Lecture input cleared."
    );

}


function removeFile() {

    $("#fileInput").value = "";

    $("#fileInfo")
        .classList.add("hidden");

    $("#fileName").textContent = "";

}


// ============================================================
// FILE UPLOAD
// ============================================================

async function uploadFile(file) {

    const allowed = [
        ".txt",
        ".md",
        ".pdf",
        ".docx"
    ];


    const extension =
        "." +
        file.name
            .split(".")
            .pop()
            .toLowerCase();


    if (!allowed.includes(extension)) {

        showToast(
            "Please upload TXT, MD, PDF or DOCX."
        );

        return;
    }


    const formData =
        new FormData();


    formData.append(
        "file",
        file
    );


    showToast(
        "Reading file..."
    );


    try {

        const response =
            await fetch(
                "/upload",
                {
                    method: "POST",
                    body: formData
                }
            );


        const data =
            await response.json();


        if (!data.success) {
            throw new Error(
                data.error
            );
        }


        $("#lectureInput").value =
            data.text;


        $("#fileName").textContent =
            data.filename;


        $("#fileInfo")
            .classList.remove(
                "hidden"
            );


        showToast(
            "File loaded and cleaned successfully."
        );


        /*
         * Small visual focus animation.
         * It does not alter the text.
         */

        const textarea =
            $("#lectureInput");


        textarea.classList.remove(
            "file-loaded"
        );


        void textarea.offsetWidth;


        textarea.classList.add(
            "file-loaded"
        );

    }

    catch (error) {

        showToast(
            error.message ||
            "Could not read file."
        );

    }

}


// ============================================================
// GENERATE STUDY PACK
// ============================================================

async function generateStudyPack() {

    const text =
        $("#lectureInput")
            .value
            .trim();


    if (!text) {

        showToast(
            "Please enter lecture content first."
        );

        $("#lectureInput").focus();

        return;
    }


    const generateButton =
        $("#generateBtn");


    const generateText =
        $("#generateText");


    const spinner =
        $("#generateSpinner");


    generateButton.disabled =
        true;


    generateText.textContent =
        "Generating...";


    spinner.classList.remove(
        "hidden"
    );


    try {

        const response =
            await fetch(
                "/generate",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            text: text
                        })
                }
            );


        const data =
            await response.json();


        if (!data.success) {
            throw new Error(
                data.error
            );
        }


        state.data =
            data;


        state.quizAnswers = {};

        state.quizSubmitted =
            false;


        state.flashcards =
            [
                ...(data.flashcards || [])
            ];


        state.originalFlashcards =
            [
                ...(data.flashcards || [])
            ];


        state.flashcardIndex =
            0;


        renderSummary();

        renderNotes();

        renderQuiz();

        renderFlashcard();


        state.stats.notesGenerated++;

        saveStats();

        updateStats();


        saveHistoryItem(
            data
        );


        showToast(
            "Your study pack is ready!"
        );


        setTimeout(
            () => {

                $("#summary-section")
                    .scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

            },
            150
        );

    }

    catch (error) {

        showToast(
            error.message ||
            "Something went wrong."
        );

    }

    finally {

        generateButton.disabled =
            false;


        generateText.textContent =
            "Generate Study Pack";


        spinner.classList.add(
            "hidden"
        );

    }

}


// ============================================================
// SUMMARY
// ============================================================

function renderSummary() {

    const summary =
        state.data?.summary ||
        state.data?.notes?.overview ||
        "No summary available.";


    $("#summaryText").textContent =
        summary;

}


async function copySummary() {

    const text =
        $("#summaryText")
            .textContent
            .trim();


    if (!text) {
        return;
    }


    await copyToClipboard(
        text
    );


    showToast(
        "Summary copied."
    );

}


// ============================================================
// NOTES
// ============================================================

function renderNotes() {

    const notes =
        state.data?.notes;


    if (!notes) {
        return;
    }


    $("#notesTitle").textContent =
        state.data.title ||
        "Generated Lecture Notes";


    $("#overviewText").textContent =
        notes.overview ||
        state.data.summary ||
        "No overview available.";


    const keyPoints =
        $("#keyPoints");


    keyPoints.innerHTML = "";


    const points =
        notes.key_points || [];


    if (!points.length) {

        keyPoints.innerHTML = `
            <div class="empty-state">
                No key points found.
            </div>
        `;

    }

    else {

        points.forEach(
            (point, index) => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "key-point";


                item.innerHTML = `
                    <span class="key-point-number">
                        ${index + 1}
                    </span>

                    <span>
                        ${escapeHtml(point)}
                    </span>
                `;


                keyPoints.appendChild(
                    item
                );

            }
        );

    }


    const keywordContainer =
        $("#keywords");


    keywordContainer.innerHTML = "";


    const keywords =
        notes.keywords || [];


    if (!keywords.length) {

        keywordContainer.innerHTML = `
            <span class="empty-keyword">
                No keywords found
            </span>
        `;

    }

    else {

        keywords.forEach(
            keyword => {

                const span =
                    document.createElement(
                        "span"
                    );


                span.className =
                    "keyword";


                span.textContent =
                    keyword;


                keywordContainer.appendChild(
                    span
                );

            }
        );

    }

}


async function copyNotes() {

    if (!state.data) {

        showToast(
            "Generate notes first."
        );

        return;
    }


    const notes =
        state.data.notes || {};


    let text =
        `${state.data.title || "Lecture Notes"}\n\n`;


    text +=
        `SUMMARY\n${state.data.summary || ""}\n\n`;


    text +=
        `OVERVIEW\n${notes.overview || ""}\n\n`;


    text +=
        "KEY POINTS\n";


    (notes.key_points || [])
        .forEach(
            (point, index) => {

                text +=
                    `${index + 1}. ${point}\n`;

            }
        );


    text +=
        "\nKEYWORDS\n";


    text +=
        (notes.keywords || [])
            .join(", ");


    await copyToClipboard(
        text
    );


    showToast(
        "Notes copied."
    );

}


// ============================================================
// DOWNLOAD NOTES
// ============================================================

function downloadNotes() {

    if (!state.data) {

        showToast(
            "Generate notes first."
        );

        return;
    }


    const notes =
        state.data.notes || {};


    let text =
        `${state.data.title || "Lecture Notes"}\n\n`;


    text +=
        `SUMMARY\n${state.data.summary || ""}\n\n`;


    text +=
        `OVERVIEW\n${notes.overview || ""}\n\n`;


    text +=
        "KEY POINTS\n";


    (notes.key_points || [])
        .forEach(
            (point, index) => {

                text +=
                    `${index + 1}. ${point}\n`;

            }
        );


    text +=
        "\nKEYWORDS\n";


    text +=
        (notes.keywords || [])
            .join(", ");


    const blob =
        new Blob(
            [text],
            {
                type:
                    "text/plain;charset=utf-8"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        `${sanitizeFileName(
            state.data.title ||
            "Lecture Notes"
        )}.txt`;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );


    showToast(
        "Notes downloaded successfully."
    );

}


function sanitizeFileName(name) {

    return String(name)
        .replace(/[<>:"/\\|?*]/g, "")
        .replace(/\s+/g, "_")
        .trim()
        || "Lecture_Notes";

}


// ============================================================
// QUIZ
// ============================================================

function setupQuiz() {

    $("#submitQuiz")
        .addEventListener(
            "click",
            submitQuiz
        );


    $("#resetQuiz")
        .addEventListener(
            "click",
            resetQuiz
        );


    $("#sampleQuestionBtn")
        .addEventListener(
            "click",
            showSampleQuestion
        );

}


function renderQuiz() {

    const container =
        $("#quizContainer");


    const quiz =
        state.data?.quiz || [];


    state.quizAnswers = {};

    state.quizSubmitted =
        false;


    if (!quiz.length) {

        container.innerHTML = `
            <div class="empty-state glass-card">
                No quiz questions were generated.
            </div>
        `;


        $("#quizControls")
            .classList.add(
                "hidden"
            );


        return;
    }


    /*
     * QUIZ IS RENDERED ONLY ONCE.
     *
     * Selecting an option never calls renderQuiz().
     * This prevents screen flickering.
     */

    container.innerHTML = "";


    quiz.forEach(
        (question, questionIndex) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "quiz-card";


            card.dataset.questionIndex =
                questionIndex;


            const number =
                document.createElement(
                    "div"
                );


            number.className =
                "quiz-number";


            number.textContent =
                `QUESTION ${questionIndex + 1}`;


            const questionText =
                document.createElement(
                    "div"
                );


            questionText.className =
                "quiz-question";


            questionText.textContent =
                question.question;


            const options =
                document.createElement(
                    "div"
                );


            options.className =
                "quiz-options";


            question.options.forEach(
                (option, optionIndex) => {

                    const button =
                        document.createElement(
                            "button"
                        );


                    button.type =
                        "button";


                    button.className =
                        "quiz-option";


                    button.dataset.question =
                        questionIndex;


                    button.dataset.option =
                        optionIndex;


                    button.textContent =
                        `${String.fromCharCode(
                            65 + optionIndex
                        )}. ${option}`;


                    /*
                     * IMPORTANT:
                     * Only change selected class.
                     * Do not recreate the quiz.
                     */

                    button.addEventListener(
                        "click",
                        () => {

                            if (
                                state.quizSubmitted
                            ) {
                                return;
                            }


                            selectQuizOption(
                                questionIndex,
                                optionIndex,
                                options
                            );

                        }
                    );


                    options.appendChild(
                        button
                    );

                }
            );


            card.appendChild(
                number
            );


            card.appendChild(
                questionText
            );


            card.appendChild(
                options
            );


            container.appendChild(
                card
            );

        }
    );


    $("#quizControls")
        .classList.remove(
            "hidden"
        );


    $("#quizResult")
        .classList.add(
            "hidden"
        );


    updateQuizProgress();

}


function selectQuizOption(
    questionIndex,
    optionIndex,
    optionContainer
) {

    state.quizAnswers[
        questionIndex
    ] = optionIndex;


    optionContainer
        .querySelectorAll(
            ".quiz-option"
        )
        .forEach(
            button => {

                button.classList.remove(
                    "selected"
                );

            }
        );


    const selected =
        optionContainer.querySelector(
            `[data-option="${optionIndex}"]`
        );


    if (selected) {

        selected.classList.add(
            "selected"
        );

    }


    updateQuizProgress();

}


function updateQuizProgress() {

    const quiz =
        state.data?.quiz || [];


    const total =
        quiz.length;


    const answered =
        Object.keys(
            state.quizAnswers
        ).length;


    $("#quizProgress")
        .textContent =
        `${answered} of ${total} answered`;

}


function submitQuiz() {

    if (!state.data?.quiz?.length) {

        showToast(
            "Generate a quiz first."
        );

        return;
    }


    const quiz =
        state.data.quiz;


    let score = 0;


    quiz.forEach(
        (question, index) => {

            const selected =
                state.quizAnswers[index];


            if (
                selected !== undefined &&
                selected === question.answer
            ) {

                score++;

            }

        }
    );


    const percentage =
        Math.round(
            (score / quiz.length) * 100
        );


    state.quizSubmitted =
        true;


    state.stats.quizAttempts++;


    if (
        state.stats.bestScore === null ||
        percentage > state.stats.bestScore
    ) {

        state.stats.bestScore =
            percentage;

    }


    saveStats();

    updateStats();


    /*
     * Update only the existing DOM.
     * No quiz rerender.
     */

    quiz.forEach(
        (question, questionIndex) => {

            const card =
                document.querySelector(
                    `.quiz-card[data-question-index="${questionIndex}"]`
                );


            if (!card) {
                return;
            }


            const options =
                card.querySelectorAll(
                    ".quiz-option"
                );


            options.forEach(
                (button, optionIndex) => {

                    button.disabled =
                        true;


                    if (
                        optionIndex ===
                        question.answer
                    ) {

                        button.classList.add(
                            "correct"
                        );

                    }


                    if (
                        state.quizAnswers[
                            questionIndex
                        ] === optionIndex &&
                        optionIndex !==
                            question.answer
                    ) {

                        button.classList.add(
                            "wrong"
                        );

                    }

                }
            );


            let explanation =
                card.querySelector(
                    ".quiz-explanation"
                );


            if (!explanation) {

                explanation =
                    document.createElement(
                        "div"
                    );


                explanation.className =
                    "quiz-explanation";


                card.appendChild(
                    explanation
                );

            }


            explanation.textContent =
                question.explanation || "";

        }
    );


    const result =
        $("#quizResult");


    result.innerHTML = `

        <div>

            You scored
            <strong>
                ${score}/${quiz.length}
            </strong>

            (${percentage}%)

        </div>


        <div class="quiz-explanation">

            ${
                percentage >= 80
                    ? "Excellent work! 🎉"
                    : percentage >= 60
                        ? "Good job! Keep practicing."
                        : "Keep reviewing your notes and try again."
            }

        </div>

    `;


    result.classList.remove(
        "hidden"
    );


    showToast(
        `Quiz completed: ${percentage}%`
    );

}


function resetQuiz() {

    if (!state.data?.quiz?.length) {

        showToast(
            "Generate a quiz first."
        );

        return;
    }


    state.quizAnswers = {};

    state.quizSubmitted =
        false;


    document
        .querySelectorAll(
            ".quiz-option"
        )
        .forEach(
            button => {

                button.disabled =
                    false;


                button.classList.remove(
                    "selected",
                    "correct",
                    "wrong"
                );

            }
        );


    document
        .querySelectorAll(
            ".quiz-explanation"
        )
        .forEach(
            element => {

                element.remove();

            }
        );


    $("#quizResult")
        .classList.add(
            "hidden"
        );


    updateQuizProgress();


    showToast(
        "Quiz reset."
    );

}


// ============================================================
// SAMPLE QUESTION
// ============================================================

function showSampleQuestion() {

    $("#sampleModal")
        .classList.remove(
            "hidden"
        );

}


function setupModal() {

    $("#closeModal")
        .addEventListener(
            "click",
            closeModal
        );


    $(".modal-backdrop")
        .addEventListener(
            "click",
            closeModal
        );


    $$(".sample-options button")
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        $$(".sample-options button")
                            .forEach(
                                item => {

                                    item.style
                                        .borderColor =
                                        "";

                                }
                            );


                        button.style
                            .borderColor =
                            "var(--primary)";


                        showToast(
                            "Sample option selected."
                        );

                    }
                );

            }
        );

}


function closeModal() {

    $("#sampleModal")
        .classList.add(
            "hidden"
        );

}


// ============================================================
// FLASHCARDS
// ============================================================

function setupFlashcards() {

    $("#shuffleCards")
        .addEventListener(
            "click",
            shuffleFlashcards
        );


    $("#resetCards")
        .addEventListener(
            "click",
            resetFlashcards
        );

}


function renderFlashcard() {

    const area =
        $("#flashcardArea");


    if (!state.flashcards.length) {

        area.innerHTML = `
            <div class="empty-state glass-card">
                Generate your study pack to create flashcards.
            </div>
        `;

        return;
    }


    const card =
        state.flashcards[
            state.flashcardIndex
        ];


    area.innerHTML = `

        <div
            class="flashcard"
            id="activeFlashcard"
        >

            <div class="flashcard-inner">

                <div class="flashcard-face">

                    <div class="flashcard-content">

                        <span class="flashcard-label">
                            QUESTION
                        </span>

                        <div class="flashcard-text">
                            ${escapeHtml(card.question)}
                        </div>

                        <span class="flashcard-hint">
                            Click the card to reveal the answer
                        </span>

                    </div>

                </div>


                <div
                    class="
                        flashcard-face
                        flashcard-back
                    "
                >

                    <div class="flashcard-content">

                        <span class="flashcard-label">
                            ANSWER
                        </span>

                        <div class="flashcard-text">
                            ${escapeHtml(card.answer)}
                        </div>

                        <span class="flashcard-hint">
                            Click the card to flip back
                        </span>

                    </div>

                </div>

            </div>

        </div>


        <div class="flashcard-navigation">

            <button
                id="previousCard"
                type="button"
            >
                ←
            </button>


            <span class="flashcard-counter">

                ${state.flashcardIndex + 1}
                /
                ${state.flashcards.length}

            </span>


            <button
                id="nextCard"
                type="button"
            >
                →

            </button>

        </div>

    `;


    const flashcard =
        $("#activeFlashcard");


    flashcard.addEventListener(
        "click",
        event => {

            if (
                event.target.closest(
                    "button"
                )
            ) {
                return;
            }


            flashcard.classList.toggle(
                "is-flipped"
            );

        }
    );


    $("#previousCard")
        .addEventListener(
            "click",
            previousFlashcard
        );


    $("#nextCard")
        .addEventListener(
            "click",
            nextFlashcard
        );

}


function nextFlashcard() {

    if (!state.flashcards.length) {
        return;
    }


    state.flashcardIndex =
        (
            state.flashcardIndex + 1
        ) %
        state.flashcards.length;


    renderFlashcard();

}


function previousFlashcard() {

    if (!state.flashcards.length) {
        return;
    }


    state.flashcardIndex =
        (
            state.flashcardIndex -
            1 +
            state.flashcards.length
        ) %
        state.flashcards.length;


    renderFlashcard();

}


function shuffleFlashcards() {

    if (!state.flashcards.length) {

        showToast(
            "Generate flashcards first."
        );

        return;
    }


    for (
        let i =
            state.flashcards.length - 1;

        i > 0;

        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            state.flashcards[i],
            state.flashcards[j]
        ] = [
            state.flashcards[j],
            state.flashcards[i]
        ];

    }


    state.flashcardIndex =
        0;


    renderFlashcard();


    showToast(
        "Flashcards shuffled."
    );

}


function resetFlashcards() {

    if (!state.originalFlashcards.length) {

        showToast(
            "Generate flashcards first."
        );

        return;
    }


    state.flashcards =
        [
            ...state.originalFlashcards
        ];


    state.flashcardIndex =
        0;


    renderFlashcard();


    showToast(
        "Flashcards reset."
    );

}


// ============================================================
// HISTORY
// ============================================================

function setupHistory() {

    $("#clearHistory")
        .addEventListener(
            "click",
            clearHistory
        );

}


function saveHistoryItem(data) {

    const item = {

        id:
            Date.now(),

        title:
            data.title ||
            "Lecture Notes",

        summary:
            data.summary ||
            "",

        notes:
            data.notes ||
            {},

        quiz:
            data.quiz ||
            [],

        flashcards:
            data.flashcards ||
            [],

        createdAt:
            new Date()
                .toLocaleString()

    };


    state.history.unshift(
        item
    );


    if (
        state.history.length > 15
    ) {

        state.history =
            state.history.slice(
                0,
                15
            );

    }


    localStorage.setItem(
        "lectureiq_history",
        JSON.stringify(
            state.history
        )
    );


    renderHistory();

}


function loadHistory() {

    try {

        const saved =
            localStorage.getItem(
                "lectureiq_history"
            );


        state.history =
            saved
                ? JSON.parse(saved)
                : [];

    }

    catch {

        state.history = [];

    }


    renderHistory();

}


function renderHistory() {

    const container =
        $("#historyList");


    if (!state.history.length) {

        container.innerHTML = `
            <div class="empty-state glass-card">
                No study packs generated yet.
            </div>
        `;

        return;
    }


    container.innerHTML = "";


    state.history.forEach(
        item => {

            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "history-item";


            element.innerHTML = `

                <div>

                    <h4>
                        ${escapeHtml(item.title)}
                    </h4>

                    <p>
                        ${escapeHtml(item.createdAt)}
                    </p>

                </div>


                <div class="history-actions">

                    <button
                        data-action="load"
                        data-id="${item.id}"
                        type="button"
                    >
                        Open
                    </button>


                    <button
                        data-action="delete"
                        data-id="${item.id}"
                        type="button"
                    >
                        Delete
                    </button>

                </div>

            `;


            container.appendChild(
                element
            );

        }
    );


    container
        .querySelectorAll("button")
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            Number(
                                button.dataset.id
                            );


                        const action =
                            button.dataset.action;


                        if (
                            action === "load"
                        ) {

                            loadHistoryItem(
                                id
                            );

                        }


                        if (
                            action === "delete"
                        ) {

                            deleteHistoryItem(
                                id
                            );

                        }

                    }
                );

            }
        );

}


function loadHistoryItem(id) {

    const item =
        state.history.find(
            entry =>
                entry.id === id
        );


    if (!item) {
        return;
    }


    state.data = {

        title:
            item.title,

        summary:
            item.summary,

        notes:
            item.notes,

        quiz:
            item.quiz,

        flashcards:
            item.flashcards

    };


    state.flashcards =
        [
            ...item.flashcards
        ];


    state.originalFlashcards =
        [
            ...item.flashcards
        ];


    state.flashcardIndex =
        0;


    state.quizAnswers = {};

    state.quizSubmitted =
        false;


    renderSummary();

    renderNotes();

    renderQuiz();

    renderFlashcard();


    showToast(
        "Study pack loaded from history."
    );


    $("#summary-section")
        .scrollIntoView({
            behavior: "smooth"
        });

}


function deleteHistoryItem(id) {

    state.history =
        state.history.filter(
            item =>
                item.id !== id
        );


    localStorage.setItem(
        "lectureiq_history",
        JSON.stringify(
            state.history
        )
    );


    renderHistory();


    showToast(
        "History item deleted."
    );

}


function clearHistory() {

    if (!state.history.length) {

        showToast(
            "History is already empty."
        );

        return;
    }


    state.history = [];


    localStorage.removeItem(
        "lectureiq_history"
    );


    renderHistory();


    showToast(
        "History cleared."
    );

}


// ============================================================
// STATS
// ============================================================

function loadStats() {

    try {

        const saved =
            localStorage.getItem(
                "lectureiq_stats"
            );


        if (saved) {

            state.stats =
                JSON.parse(
                    saved
                );

        }

    }

    catch {

        state.stats = {

            notesGenerated: 0,

            quizAttempts: 0,

            bestScore: null

        };

    }


    updateStats();

}


function saveStats() {

    localStorage.setItem(
        "lectureiq_stats",
        JSON.stringify(
            state.stats
        )
    );

}


function updateStats() {

    $("#notesCount").textContent =
        state.stats.notesGenerated;


    $("#quizCount").textContent =
        state.stats.quizAttempts;


    $("#bestScore").textContent =
        state.stats.bestScore === null
            ? "—"
            : `${state.stats.bestScore}%`;


    $("#flashcardCount").textContent =
        state.flashcards.length;

}


// ============================================================
// THEME
// ============================================================

function setupTheme() {

    $("#themeToggle")
        .addEventListener(
            "click",
            toggleTheme
        );

}


function loadTheme() {

    const theme =
        localStorage.getItem(
            "lectureiq_theme"
        );


    if (theme === "dark") {

        document.documentElement
            .setAttribute(
                "data-theme",
                "dark"
            );


        $("#themeIcon").textContent =
            "☀";

    }

}


function toggleTheme() {

    const current =
        document.documentElement
            .getAttribute(
                "data-theme"
            );


    if (current === "dark") {

        document.documentElement
            .removeAttribute(
                "data-theme"
            );


        localStorage.setItem(
            "lectureiq_theme",
            "light"
        );


        $("#themeIcon").textContent =
            "☾";

    }

    else {

        document.documentElement
            .setAttribute(
                "data-theme",
                "dark"
            );


        localStorage.setItem(
            "lectureiq_theme",
            "dark"
        );


        $("#themeIcon").textContent =
            "☀";

    }

}


// ============================================================
// SCROLL REVEAL
// ============================================================

function setupScrollReveal() {

    if (
        !(
            "IntersectionObserver"
            in window
        )
    ) {
        return;
    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.style
                                .opacity =
                                "1";


                            entry.target.style
                                .transform =
                                "translateY(0)";


                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.08
            }
        );


    $$(".reveal")
        .forEach(
            element => {

                element.style.opacity =
                    "0";


                element.style.transform =
                    "translateY(18px)";


                observer.observe(
                    element
                );

            }
        );

}


// ============================================================
// TOAST
// ============================================================

let toastTimer = null;


function showToast(message) {

    const toast =
        $("#toast");


    $("#toastMessage")
        .textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2600
        );

}


// ============================================================
// CLIPBOARD
// ============================================================

async function copyToClipboard(text) {

    try {

        await navigator.clipboard
            .writeText(text);

    }

    catch {

        const textarea =
            document.createElement(
                "textarea"
            );


        textarea.value =
            text;


        textarea.style.position =
            "fixed";


        textarea.style.opacity =
            "0";


        document.body.appendChild(
            textarea
        );


        textarea.select();


        document.execCommand(
            "copy"
        );


        textarea.remove();

    }

}


// ============================================================
// HTML ESCAPING
// ============================================================

function escapeHtml(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}