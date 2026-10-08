# 🎓 LectureIQ - Lecture to Notes & Quiz Generator

LectureIQ is a web-based smart study assistant that converts lecture
content into structured and interactive study material.

It helps students transform lengthy lecture content into:

- 📝 Smart Notes
- 📌 Summaries
- 🎯 Key Points
- 🧠 Quiz Questions
- 🃏 Interactive Flashcards
- 🔑 Keywords
- 📚 Study History

LectureIQ supports manual lecture input as well as TXT, PDF, and DOCX
file uploads.

---

## ✨ Features

### 📝 Lecture to Notes

Enter lecture content manually or upload a lecture file.

LectureIQ generates:

- Lecture title
- Summary
- Overview
- Key points
- Important keywords

### 📂 File Upload

Supported formats:

- `.txt`
- `.pdf`
- `.docx`

The application extracts text from uploaded documents and processes it
before generating study material.

### 📖 Summary

Generates a concise extractive summary of the lecture.

Useful for:

- Quick revision
- Exam preparation
- Understanding important concepts
- Reviewing lengthy lectures

### 📌 Smart Notes

Generated notes contain:

- Overview
- Key points
- Keywords
- Summary

Users can:

- Copy notes
- Download notes as a `.txt` file

### 🧠 Quiz Generator

LectureIQ automatically creates multiple-choice questions.

Features:

- Multiple-choice questions
- Answer selection
- Score calculation
- Progress tracking
- Quiz submission
- Quiz reset/retry
- Best score tracking
- Sample question option

### 🃏 Interactive Flashcards

Important concepts are converted into interactive flashcards.

Features:

- Flip animation
- Previous/Next navigation
- Shuffle cards
- Reset cards
- Long-question support
- Scrollable content

### 📚 History

The History section stores previously generated study material locally
in the browser.

Users can:

- View previous generations
- Load previous study content
- Delete history entries
- Clear history

### 🌙 Theme Support

LectureIQ includes a theme toggle for a better user experience.

### 📊 Dashboard

The dashboard displays:

- Notes generated
- Quiz attempts
- Best quiz score
- Number of flashcards

### ✨ Interactive UI

The interface includes:

- Smooth animations
- Flashcard flip animation
- Loading indicators
- Toast notifications
- Scroll reveal animations
- Responsive layout
- Interactive navigation

---

# 🛠️ Technology Stack

## Frontend

- HTML5
- CSS3
- JavaScript
- CSS Animations
- Browser Local Storage

## Backend

- Python 3
- Flask

## Document Processing

- PyMuPDF
- PyPDF2
- python-docx

## Development Tools

- Visual Studio Code
- Git
- GitHub

---

# 🧠 Models and Algorithms Used

LectureIQ currently does not depend on an external machine-learning
model or large-language model API.

Instead, it uses lightweight NLP-inspired text-processing techniques
implemented in Python.

## 1. Text Preprocessing

Uploaded or manually entered lecture content is cleaned and normalized.

Operations include:

- Removing unnecessary whitespace
- Normalizing line breaks
- Handling soft hyphens
- Reconnecting words split across PDF lines
- Organizing paragraphs and sentences

## 2. Sentence Segmentation

Lecture content is divided into individual sentences using punctuation
and text-processing rules.

## 3. Keyword Extraction

Important words are identified using word-frequency analysis while
filtering common stop words.

The process includes:

1. Tokenizing the text
2. Normalizing words
3. Removing common stop words
4. Counting word frequency
5. Selecting important keywords

## 4. Extractive Summary Generation

The summary is generated using sentence scoring.

Sentences are scored using factors such as:

- Important keyword occurrence
- Sentence relevance
- Position within the lecture
- Distribution across different sections

High-scoring sentences are selected and returned in their original
document order.

## 5. Key Point Extraction

Important sentences are selected from different sections of the lecture
to provide better coverage of the overall content.

## 6. Quiz Generation

Multiple-choice questions are generated from important lecture sentences
and keywords.

Each quiz question contains:

- Question
- Correct answer
- Distractor options
- Score calculation

## 7. Flashcard Generation

Important concepts are converted into question-and-answer flashcards.

Users can:

- Flip cards
- Navigate between cards
- Shuffle cards
- Reset cards

---

# 📚 Project Modules

## Module 1 - Input Management

Accepts lecture content through:

- Text input
- TXT files
- PDF files
- DOCX files

## Module 2 - Text Extraction

Extracts readable text from uploaded documents.

## Module 3 - Text Processing

Cleans, normalizes, and organizes extracted content.

## Module 4 - Summary Generation

Produces a concise extractive summary.

## Module 5 - Notes Generation

Creates structured notes containing:

- Overview
- Key points
- Keywords
- Summary

## Module 6 - Quiz Generation

Creates multiple-choice questions and calculates the user's score.

## Module 7 - Flashcards

Creates interactive question-and-answer flashcards.

## Module 8 - History

Stores previously generated study material locally in the browser.

## Module 9 - User Interface

Provides:

- Responsive design
- Animations
- Theme switching
- Toast notifications
- Interactive navigation
- Loading states

---

# 🔄 System Workflow

```text
              Lecture Content
                    │
          ┌─────────┴─────────┐
          │                   │
      Enter Text         Upload File
          │                   │
          └─────────┬─────────┘
                    ↓
             Text Extraction
                    ↓
             Text Processing
                    ↓
           Sentence Analysis
                    ↓
        ┌───────────┼───────────┐
        ↓           ↓           ↓
     Summary      Notes      Keywords
        │           │
        └───────────┼───────────┘
                    ↓
             Quiz Generation
                    ↓
           Flashcard Generation
                    ↓
            Interactive Dashboard
