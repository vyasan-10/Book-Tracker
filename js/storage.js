/**
 * BooksHaven - Storage Service
 * Safely manages persistence with localStorage without external dependencies.
 */

const STORAGE_KEY = 'bookshaven_books';

const BookStorage = {
  /**
   * Safely retrieves books array from localStorage.
   * Returns empty array if data is missing, corrupted, or invalid.
   */
  getBooks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      
      // Ensure each item has basic expected properties
      return parsed.filter(item => item && typeof item === 'object' && item.id);
    } catch (err) {
      console.warn('Unable to parse books from localStorage, resetting to empty list:', err);
      return [];
    }
  },

  /**
   * Safely serializes and saves the books array to localStorage.
   */
  saveBooks(books) {
    try {
      if (!Array.isArray(books)) return false;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
      return true;
    } catch (err) {
      console.error('Failed to save books to localStorage:', err);
      return false;
    }
  },

  /**
   * Adds a new book with unique ID and creation timestamp.
   * Prepends it to the list.
   */
  addBook({ title, author, status }) {
    const books = this.getBooks();
    const newBook = {
      id: 'book_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      title: title.trim(),
      author: author.trim(),
      status: status || 'To read',
      createdAt: Date.now()
    };

    books.unshift(newBook);
    this.saveBooks(books);
    return newBook;
  },

  /**
   * Updates a book's reading status directly.
   */
  updateStatus(id, newStatus) {
    const validStatuses = ['To read', 'Reading', 'Finished'];
    if (!validStatuses.includes(newStatus)) return null;

    const books = this.getBooks();
    const book = books.find(b => b.id === id);
    if (book) {
      book.status = newStatus;
      this.saveBooks(books);
      return book;
    }
    return null;
  },

  /**
   * Deletes a book by ID.
   */
  deleteBook(id) {
    const books = this.getBooks();
    const filtered = books.filter(b => b.id !== id);
    this.saveBooks(filtered);
    return filtered;
  }
};

window.BookStorage = BookStorage;
