# BooksHaven — Prompt Log

## Prompt 1: Setting up the project

**Prompt:**

"Create the basic project structure for a Book Tracker website called BooksHaven using HTML, CSS, and JavaScript. Set up the necessary files and make sure the HTML page loads the CSS and JavaScript correctly. For now, just create the basic working page without implementing the book-tracking features."

**What happened:**

The initial project structure was created with separate files for the HTML, CSS, and JavaScript. This gave me a starting point to develop the website gradually rather than building everything at once.

## Prompt 2: Adding and displaying books

**Prompt:**

"Let's start with the main functionality. Allow users to add a book with a title, author, and reading status. The title and author should be required, and the available statuses should be To read, Reading, and Finished. Display the newest books first and add a search box that can find books by title or author. Keep the code simple and use the existing project structure."

**What happened:**

The main book-tracking functionality was implemented, including the form, book list, and search. This established the core of the application before adding persistence and other improvements.

## Prompt 3: Saving books after a refresh

**Prompt:**

"Make sure the book list is saved in localStorage so that books are still there when the page is refreshed. The saved data should include each book's title, author, and current reading status. Load the saved books when the page opens and keep the stored data updated whenever a book is added or its status changes."

**What happened:**

The application was set up to save and restore the book collection using localStorage. I needed to verify that the books and their current statuses remained unchanged after refreshing the page.


## Prompt 4: Adding deletion, statistics, and mobile support

**Prompt:**

"I want to add a few more things to BooksHaven. Let users delete a book, but ask for confirmation before removing it. Add counters showing the total number of books and how many are To read, Reading, and Finished. Make sure the counts update when books are added, deleted, or moved to another status. Also, improve the layout so the book cards, form, search bar, and counters fit properly on mobile screens. Please work with the existing code instead of rebuilding everything."

**What happened:**

The application was extended with book deletion, reading statistics, and mobile layout improvements. These additions were intended to make the tracker more convenient to use.

**Testing:**

Confirmed that the counts update when a book is added, deleted, or moved to another status. Ensured the layout fits properly on mobile screens.


## Prompt 5: Improving form validation

**Prompt:**

"I noticed that the title and author fields can accept inputs that don't make sense, such as an author name containing only numbers or a title made entirely of random symbols. Improve the validation without blocking legitimate book titles or names. Allow numbers and punctuation where appropriate, trim unnecessary spaces, and show a clear error message when the input is invalid. Keep the existing design and functionality unchanged."

**Issue I noticed and how I fixed it:**

While testing the form, I noticed that I could enter numbers or random special characters in the title and author fields. The form accepted these inputs even when they didn't look like valid book information. I decided to improve the validation so that it would reject meaningless input without blocking legitimate titles such as "1984" or names such as "J. R. R. Tolkien".

I asked the AI to improve the validation and display clear error messages for invalid entries. After the changes, I tested valid titles and author names alongside numeric-only author names, whitespace-only input, and titles made entirely of symbols. I recorded the results based on what actually happened during testing.


**What happened:**

The validation was reviewed so that invalid or meaningless input could be rejected while legitimate titles and author names remained acceptable.

**Testing:**

Test valid examples such as `1984`, `Harry Potter & the Philosopher's Stone`, and `J. R. R. Tolkien`. Also test empty fields, whitespace-only input, a numeric-only author, and a title made entirely of symbols. Record which tests passed and any corrections made.



**One Time I got Ai wrong:**

The AI initially used different status names, such as `want-to-read`, `currently-reading`, and `completed`, instead of the exact categories specified in the assessment: `To read`, `Reading`, and `Finished`. I noticed that the implementation did not match the required status labels.

**How I fixed it:**

I asked the AI to align the status labels with the assessment requirements and ensure that the correct labels appeared throughout the application, including the book cards, status selector, and reading statistics.



