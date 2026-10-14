# 📚 BooksHaven — Personal Book Tracker & Wishlist

A modern, responsive, and aesthetically crafted web application to curate, organize, and track books you want to read. Built with pure **HTML5**, **Vanilla CSS3**, and **Modern JavaScript (ES6+)**.

---

## 🌟 Key Features

- **📖 "Want to Read" Wishlist & Reading Management**:
  - Keep track of books in three statuses: **Want to Read**, **Currently Reading**, and **Completed**.
  - Quick-switch reading status directly from book cards.
- **🔍 Instant Live Search & Filter**:
  - Real-time search across titles, authors, genres, and personal notes.
  - Category tabs with live item count badges (*All Books*, *Want to Read*, *Currently Reading*, *Completed*, *Favorites*).
  - Genre filter dropdown (*Fiction, Sci-Fi & Fantasy, Mystery, Non-Fiction, Philosophy, Romance, Classics, etc.*).
  - Sorting options: *Newest First, Oldest First, Title (A-Z), Author (A-Z), Highest Rated*.
- **📊 Real-time Library Overview**:
  - Interactive top stat counters for total books, want-to-read count, currently reading, and finished books.
  - Clicking any stat card instantly switches the view to those books.
- **🎨 Rich Editorial Design**:
  - Ambient glowing library backdrop, frosted glassmorphism cards (`backdrop-filter: blur`), custom spine gradient palettes (Indigo, Amber, Emerald, Rose, Violet, Teal).
  - Elegant typography featuring Google Fonts: *Fraunces* (editorial serif headers) and *Plus Jakarta Sans* (clean modern UI).
- **📝 Comprehensive Book Details**:
  - Title, Author, Genre, Total Pages, Pages Read with visual progress bar indicator.
  - 1–5 Star Rating with interactive star picker.
  - Personal reading thoughts, favorite quotes, or recommendation notes.
  - Favorite toggle (heart button) to quickly bookmark beloved titles.
- **💾 Persistent Storage**:
  - Built-in `localStorage` integration keeps all your books saved safely in your browser across sessions.
  - Preloaded with sample titles to look alive upon first launch.
- **🔔 Toast Feedback & Modals**:
  - Smooth animated modals for adding and editing books with inline validation.
  - Non-intrusive floating toast notifications for user actions.

---

## 📁 Project Directory Structure

```text
e:/Book Tracker/
├── index.html          # Semantic HTML5 markup, accessible modal dialogs, and layout
├── css/
│   └── style.css       # Design tokens, dark mode palette, glassmorphism & responsive layouts
├── js/
│   ├── storage.js      # LocalStorage layer, default sample data, and CRUD methods
│   └── app.js          # Interactive controller, state management, search/filter, and rendering
└── README.md           # Documentation and getting started guide
```

---

## 🚀 How to Run the Project

Since **BooksHaven** uses vanilla HTML, CSS, and JavaScript with no external build step required, you can open and run it immediately:

### Option 1: Direct in Browser
Double-click `index.html` in your file explorer, or right-click and choose **Open with > Chrome / Edge / Firefox**.

### Option 2: Using a Local Development Server (Recommended)
If you have Node.js or Python installed, you can start a lightweight server:

- **Using Python**:
  ```bash
  python -m http.server 3000
  ```
  Then open `http://localhost:3000` in your browser.

- **Using Node `npx serve`**:
  ```bash
  npx serve .
  ```

- **Using VS Code Live Server**:
  Right-click `index.html` and select **"Open with Live Server"**.

---

## 🛠️ Technology Stack

- **HTML5**: Semantic tags (`<header>`, `<main>`, `<section>`, `<article>`, `<dialog>`), ARIA accessibility roles and labels.
- **CSS3**: Custom CSS variables (design tokens), Flexbox & CSS Grid, glassmorphism with `backdrop-filter`, responsive media queries, CSS keyframe animations.
- **JavaScript**: ES6 Classes, modular event delegation, `localStorage` persistence, dynamic DOM injection with sanitization.
- **Icons & Fonts**: [Phosphor Icons](https://phosphoricons.com/) via CDN and [Google Fonts](https://fonts.google.com/) (*Fraunces* & *Plus Jakarta Sans*).
