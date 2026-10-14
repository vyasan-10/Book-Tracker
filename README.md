# 📚 BooksTracker — Personal Book Tracker

BooksHaven is a modern, responsive web application for organizing and managing a personal reading list. It allows users to track books they want to read, are currently reading, and have finished, all from a simple browser-based interface.

## ✨ Features

- **Add books:** Save books with a title, author, and reading status.
- **Input validation:** Require meaningful titles and author names while allowing legitimate punctuation and numbers.
- **Reading status management:** Choose between `To read`, `Reading`, and `Finished`.
- **Book library:** Display books with the newest additions first.
- **Live search:** Find books by title or author.
- **Delete books:** Remove books from the collection with confirmation.
- **Reading statistics:** View the total number of books and counts for each reading status.
- **Persistent storage:** Save the collection in browser localStorage so it remains available after refreshing the page.
- **Responsive layout:** Use the application on desktop and mobile screens.

## 🛠️ Technology Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Browser localStorage

The application requires no backend, database, or build process.

## 📁 Project Structure

```text
Book Tracker/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   └── storage.js
├── README.md
└── PROMPTS.md
```

## 🚀 Getting Started

### Run locally

1. Clone the repository:

   ```bash
   git clone https://github.com/vyasan-10/Book-Tracker.git
   ```

2. Open the project folder:

   ```bash
   cd Book-Tracker
   ```

3. Open `index.html` in your browser.

Alternatively, run a local development server from the project directory:

```bash
python -m http.server 3000
```

Then visit `http://localhost:3000`.

## 💾 Data Storage

Books are stored in the browser using localStorage. The collection persists across page refreshes in the same browser and origin. Clearing browser data or switching browsers may make the saved collection unavailable.

## 🧪 Testing

Before submission, verify the following:

- Adding books with valid titles and author names.
- Validation of empty or invalid inputs.
- Newest-first ordering.
- Searching by title and author.
- Changing reading statuses.
- Persistence after refreshing the page.
- Deleting books and updating reading statistics.
- Responsive behavior on mobile screens.

## 📝 AI-Assisted Development

BooksHaven was developed incrementally with AI-assisted coding. `PROMPTS.md` documents the important prompts used during development, the observed outcomes, and any issues identified and corrected.

## 📄 License

No license has been specified for this project.
