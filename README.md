# LectureIQ - Lecture to Notes & Quiz Generator

LectureIQ is a web-based study assistant that converts lecture content into structured study material.

It can generate:
- 📝 Smart Notes
- 📌 Summary
- 🎯 Key Points
- 🧠 Quiz Questions
- 🃏 Interactive Flashcards
- 🔑 Keywords
- 📚 Study History

The application also supports uploading lecture files such as TXT, PDF, and DOCX files and extracting their content automatically.

---

## ✨ Features

### 📝 Lecture to Notes

Enter lecture content manually or upload a lecture file.

LectureIQ processes the content and generates:

- Lecture title
- Summary
- Overview
- Key points
- Important keywords

---

### 📂 File Upload

LectureIQ supports:

- `.txt`
- `.pdf`
- `.docx`

Uploaded lecture content is extracted and processed automatically.

The application also performs text cleanup to improve readability when extracting content from files.

> Note: Complex multi-column PDFs, scanned PDFs, tables, and image-only documents may not always extract perfectly because they require advanced layout detection or OCR.

---

### 📖 Summary

The Summary section provides a concise version of the lecture content.

It is useful for:

- Quick revision
- Exam preparation
- Understanding the main concepts
- Reviewing long lectures

You can also copy the generated summary.

---

### 📌 Smart Notes

LectureIQ creates structured notes containing:

- Overview
- Key Points
- Keywords
- Summary

You can:

- Copy the notes
- Download the notes as a `.txt` file

---

### 🧠 Quiz Generator

The application automatically creates multiple-choice questions from the lecture content.

Quiz features include:

- Multiple-choice questions
- Option selection
- Score calculation
- Progress tracking
- Quiz submission
- Quiz reset/retry
- Best score tracking
- Sample question option

The quiz interface is designed to avoid unnecessary flickering when selecting an answer.

---

### 🃏 Interactive Flashcards

LectureIQ converts important lecture concepts into interactive flashcards.

Features include:

- Flip-card animation
- Previous/Next navigation
- Shuffle cards
- Reset cards
- Long-question support
- Scrollable card content

The flashcard animation is designed so that only the card itself flips instead of the surrounding page content.

---

### 📚 History

LectureIQ keeps track of generated study packs in the browser.

The History section allows you to:

- View previous generations
- Load previous study content
- Delete individual history entries
- Clear history

---

### 🌙 Dark / Light Theme

LectureIQ includes a theme toggle for switching between different visual modes.

The selected theme is stored locally in the browser.

---

### 📊 Dashboard

The dashboard provides quick statistics such as:

- Notes generated
- Quiz attempts
- Best quiz score
- Number of flashcards

---

### ✨ Interactive UI

The application includes:

- Animated interface
- Animated cards
- Smooth transitions
- Flashcard flip animation
- Toast notifications
- Loading indicators
- Scroll reveal animations
- Responsive layout
- Interactive navigation

---

## 🛠️ Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript
- CSS animations
- DOM manipulation
- Local Storage

### Backend

- Python
- Flask

### File Processing

- PyMuPDF
- PyPDF2
- python-docx

---

## 📁 Project Structure

```text
LectureIQ/
│
├── app.py
├── requirements.txt
├── README.md
│
├── templates/
│   └── index.html
│
└── static/
    ├── style.css
    └── script.js