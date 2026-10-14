/**
 * BooksHaven - Storage Service
 * Handles persistence with LocalStorage and initial default book collection.
 */

const STORAGE_KEY = 'bookshaven_library_v1';

// Initial curated starter library so the app is immediately alive and gorgeous
const DEFAULT_BOOKS = [
  {
    id: 'book-1',
    title: 'Tomorrow, and Tomorrow, and Tomorrow',
    author: 'Gabrielle Zevin',
    genre: 'Fiction',
    status: 'want-to-read',
    pages: 416,
    currentPage: 0,
    rating: 5,
    coverTheme: 'indigo',
    notes: 'A deeply moving story about identity, creativity, video games, and human connection.',
    isFavorite: true,
    createdAt: Date.now() - 86400000 * 3
  },
  {
    id: 'book-2',
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Philosophy & Mindset',
    status: 'currently-reading',
    pages: 320,
    currentPage: 184,
    rating: 5,
    coverTheme: 'amber',
    notes: 'An easy & proven way to build good habits and break bad ones. Implementing 1% daily changes.',
    isFavorite: true,
    createdAt: Date.now() - 86400000 * 5
  },
  {
    id: 'book-3',
    title: 'Dune: Book One',
    author: 'Frank Herbert',
    genre: 'Sci-Fi & Fantasy',
    status: 'want-to-read',
    pages: 688,
    currentPage: 0,
    rating: 4,
    coverTheme: 'emerald',
    notes: 'Recommended by book club. Classic epic set in the desert planet of Arrakis.',
    isFavorite: false,
    createdAt: Date.now() - 86400000 * 8
  },
  {
    id: 'book-4',
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    genre: 'Sci-Fi & Fantasy',
    status: 'want-to-read',
    pages: 303,
    currentPage: 0,
    rating: 4,
    coverTheme: 'rose',
    notes: 'Poignant Nobel-prize winning author tale told from an Artificial Friend perspective.',
    isFavorite: false,
    createdAt: Date.now() - 86400000 * 12
  },
  {
    id: 'book-5',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    genre: 'Non-Fiction',
    status: 'completed',
    pages: 256,
    currentPage: 256,
    rating: 5,
    coverTheme: 'teal',
    notes: 'Timeless lessons on wealth, greed, and happiness. Super insightful chapters.',
    isFavorite: true,
    createdAt: Date.now() - 86400000 * 20
  }
];

class BookStorage {
  static getBooks() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.saveBooks(DEFAULT_BOOKS);
        return DEFAULT_BOOKS;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading books from localStorage:', error);
      return DEFAULT_BOOKS;
    }
  }

  static saveBooks(books) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    } catch (error) {
      console.error('Error saving books to localStorage:', error);
    }
  }

  static addBook(bookData) {
    const books = this.getBooks();
    const newBook = {
      ...bookData,
      id: 'book-' + Date.now(),
      createdAt: Date.now(),
      isFavorite: bookData.isFavorite || false
    };
    books.unshift(newBook);
    this.saveBooks(books);
    return newBook;
  }

  static updateBook(updatedBook) {
    const books = this.getBooks();
    const index = books.findIndex(b => b.id === updatedBook.id);
    if (index !== -1) {
      books[index] = { ...books[index], ...updatedBook };
      this.saveBooks(books);
      return books[index];
    }
    return null;
  }

  static deleteBook(bookId) {
    const books = this.getBooks();
    const filtered = books.filter(b => b.id !== bookId);
    this.saveBooks(filtered);
    return filtered;
  }

  static toggleFavorite(bookId) {
    const books = this.getBooks();
    const book = books.find(b => b.id === bookId);
    if (book) {
      book.isFavorite = !book.isFavorite;
      this.saveBooks(books);
      return book;
    }
    return null;
  }

  static updateStatus(bookId, newStatus) {
    const books = this.getBooks();
    const book = books.find(b => b.id === bookId);
    if (book) {
      book.status = newStatus;
      if (newStatus === 'completed' && book.pages) {
        book.currentPage = book.pages;
      } else if (newStatus === 'want-to-read') {
        book.currentPage = 0;
      }
      this.saveBooks(books);
      return book;
    }
    return null;
  }
}

// Make accessible to window
window.BookStorage = BookStorage;
