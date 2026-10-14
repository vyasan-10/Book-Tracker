# BooksHaven — Project Prompts & Development Log

## Prompt 1: Setting up the project

**Prompt:**

"Create the basic project structure for a Book Tracker website called BooksHaven using HTML, CSS, and JavaScript. Create the necessary files, including `index.html`, `styles.css`, `app.js`, `README.md`, and `PROMPTS.md`. For now, just set up a basic working page and make sure the CSS and JavaScript are connected properly. Don't start building the actual features yet."

**What happened:**

The initial project structure was set up with separate files for the page, styling, and JavaScript. This gave me a starting point to build the application gradually instead of trying to implement everything at once.

## Prompt 2: Implementing the main book-tracking features

**Prompt:**

"Implement the five main features of BooksHaven: adding books with a title, author, and reading status; displaying the newest books first; searching by title or author; changing a book's status; and saving the collection in localStorage so it remains after refreshing the page. Title and author should be required, with clear validation messages. Keep the implementation simple and use vanilla JavaScript. Update the prompt log with what was implemented and the tests performed."

**What was implemented:**

- **Add Book with Validation**: Form accepting title, author, and status (`To read`, `Reading`, or `Finished`) with inline validation.
- **Newest-First Display**: Book items timestamped and sorted descending by `createdAt`.
- **Live Search**: Instant case-insensitive filtering across both title and author fields.
- **Direct Status Modification**: Inline dropdown on each book card allowing immediate status updates.
- **LocalStorage Persistence**: Data persistence under `bookshaven_books` with safe DOM rendering (`textContent`).
- **Minimal Light Design**: Clean, warm editorial layout with soft neutral backgrounds, subtle borders, and clear typography.

**Tests performed:**
- Verified form validation on empty submissions.
- Verified adding books, sorting order, live search filtering, status switching, and persistence across reloads.

## Prompt 3: Adding a few more features

**Prompt:**

"I want to add a few more things. First, let users delete a book from their list, but show a confirmation before removing it. Also, add some simple counters to show how many books they have in each reading status. These numbers should update whenever a book is added, deleted, or moved to another status. Finally, make sure the website looks good on mobile too. The book cards, search bar, form, and counters should fit properly on smaller screens without any issues. Please work with the code that's already there instead of rebuilding everything."

**What was implemented:**

- **Delete with Confirmation Modal**: Added a dedicated accessible confirmation dialog (`#confirmDeleteModal`) showing the book title and asking for confirmation before deleting.
- **Live Status Counters**: Added an overview grid displaying counters for Total Books, To read, Reading, and Finished. These counters synchronize in real-time whenever a book is added, deleted, or its status changed.
- **Mobile Responsiveness**:
  - Implemented responsive breakpoints for mobile screens (<= 640px and <= 360px).
  - 2x2 grid for status counters on mobile screens.
  - Stacked book card actions and touch targets (minimum 40px–44px) to prevent accidental taps.
  - 16px font-size on inputs to prevent iOS Safari auto-zoom.
  - Enforced `overflow-x: hidden` to ensure zero horizontal scrolling.

## Prompt 4: Improving input validation

**Prompt:**

"I noticed that the title and author fields currently accept things like numbers or random special characters. Can you improve the validation so it rejects obviously invalid input without blocking legitimate book titles or author names?

Allow numbers, punctuation, accents, and special characters when they make sense in a real title or name. Reject values that contain only whitespace, only numbers in the author field, or strings made entirely of meaningless symbols. Trim leading and trailing spaces before saving.

Show a clear validation message next to the relevant field and prevent the book from being added if validation fails. Keep the existing design and functionality unchanged, and don't introduce any unnecessary dependencies.

Please test a few valid examples, such as "1984", "Harry Potter & the Philosopher's Stone", and "J. R. R. Tolkien", along with invalid inputs such as an author name containing only numbers and a title containing only symbols. Update PROMPTS.md with what you changed and the actual test results."

**What was changed:**

- **Whitespace Trimming**: Form inputs are trimmed of leading and trailing whitespace prior to validation and storage.
- **Title Validation Rules (`validateTitle`)**:
  - Rejects empty or whitespace-only input (`"Please enter a book title."`).
  - Requires at least one letter or digit (`/[\p{L}\p{N}]/u`), allowing numeric titles like *"1984"* or *"Fahrenheit 451"*, while rejecting strings composed purely of symbols like *"???"* or *"!@#$"* (`"Title must contain letters or numbers, not just symbols."`).
- **Author Validation Rules (`validateAuthor`)**:
  - Rejects empty or whitespace-only input (`"Please enter the author's name."`).
  - Requires at least one letter (`/\p{L}/u`), supporting international characters and accents (*"Gabriel García Márquez"*, *"Antoine de Saint-Exupéry"*).
  - Explicitly rejects author names consisting entirely of digits (`"Author name cannot consist only of numbers."`).
  - Rejects author names consisting purely of symbols or punctuation (`"Author name must contain letters, not just symbols."`).
- **Real-time Feedback**: Inline error messages display directly beneath the relevant input with visual error borders (`.input-error`), clearing automatically as valid input is typed.

**Actual Test Results:**

| Field | Input Tested | Expected | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Title** | `"1984"` | Valid | Valid (`value: "1984"`) | **PASS** |
| **Title** | `"Harry Potter & the Philosopher's Stone"` | Valid | Valid (`value: "Harry Potter & the Philosopher's Stone"`) | **PASS** |
| **Title** | `"Fahrenheit 451"` | Valid | Valid (`value: "Fahrenheit 451"`) | **PASS** |
| **Title** | `"  Dune  "` | Valid | Valid (trimmed to `"Dune"`) | **PASS** |
| **Title** | `"   "` (Whitespace only) | Invalid | Rejected: *"Please enter a book title."* | **PASS** |
| **Title** | `"???"` (Only symbols) | Invalid | Rejected: *"Title must contain letters or numbers, not just symbols."* | **PASS** |
| **Title** | `"!@#$%^&*()"` (Only symbols) | Invalid | Rejected: *"Title must contain letters or numbers, not just symbols."* | **PASS** |
| **Author** | `"J. R. R. Tolkien"` | Valid | Valid (`value: "J. R. R. Tolkien"`) | **PASS** |
| **Author** | `"Gabriel García Márquez"` | Valid | Valid (`value: "Gabriel García Márquez"`) | **PASS** |
| **Author** | `"Antoine de Saint-Exupéry"` | Valid | Valid (`value: "Antoine de Saint-Exupéry"`) | **PASS** |
| **Author** | `"12345"` (Only numbers) | Invalid | Rejected: *"Author name cannot consist only of numbers."* | **PASS** |
| **Author** | `"   "` (Whitespace only) | Invalid | Rejected: *"Please enter the author's name."* | **PASS** |
| **Author** | `"!@#$%"` (Only symbols) | Invalid | Rejected: *"Author name must contain letters, not just symbols."* | **PASS** |
| **Author** | `"---"` (Only symbols/hyphens) | Invalid | Rejected: *"Author name cannot consist only of numbers."* | **PASS** |
