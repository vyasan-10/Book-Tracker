/**
 * BooksHaven - Main Application Logic
 * Implements book tracking, live counters, delete confirmation, search, and refined input validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // State
  let books = BookStorage.getBooks();
  let currentFilter = 'all';
  let searchQuery = '';
  let pendingDeleteBook = null;

  // DOM Elements
  const booksList = document.getElementById('booksList');
  const emptyState = document.getElementById('emptyState');
  const emptyStateMessage = document.getElementById('emptyStateMessage');
  const emptyStateAddBtn = document.getElementById('emptyStateAddBtn');
  const viewTitle = document.getElementById('viewTitle');

  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const counterCards = document.querySelectorAll('.counter-card');

  // Stats Counters
  const statTotal = document.getElementById('statTotal');
  const statToRead = document.getElementById('statToRead');
  const statReading = document.getElementById('statReading');
  const statFinished = document.getElementById('statFinished');

  // Filter Tab Badges
  const countAll = document.getElementById('countAll');
  const countToRead = document.getElementById('countToRead');
  const countReading = document.getElementById('countReading');
  const countFinished = document.getElementById('countFinished');

  // Add Book Modal Elements
  const openModalBtn = document.getElementById('openModalBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelModalBtn = document.getElementById('cancelModalBtn');
  const bookModal = document.getElementById('bookModal');
  const bookForm = document.getElementById('bookForm');
  const bookTitle = document.getElementById('bookTitle');
  const bookAuthor = document.getElementById('bookAuthor');
  const bookStatus = document.getElementById('bookStatus');
  const titleError = document.getElementById('titleError');
  const authorError = document.getElementById('authorError');

  // Delete Confirmation Modal Elements
  const confirmDeleteModal = document.getElementById('confirmDeleteModal');
  const closeDeleteModalBtn = document.getElementById('closeDeleteModalBtn');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const deleteModalMessage = document.getElementById('deleteModalMessage');

  const toast = document.getElementById('toast');
  let toastTimeout = null;

  // --- Initial Setup ---
  init();

  function init() {
    setupEventListeners();
    updateUI();
  }

  // --- Event Listeners ---
  function setupEventListeners() {
    // Add Book Modal
    openModalBtn.addEventListener('click', () => openAddModal());
    emptyStateAddBtn.addEventListener('click', () => openAddModal());
    closeModalBtn.addEventListener('click', closeAddModal);
    cancelModalBtn.addEventListener('click', closeAddModal);

    bookModal.addEventListener('click', (e) => {
      if (e.target === bookModal) closeAddModal();
    });

    // Delete Confirmation Modal
    closeDeleteModalBtn.addEventListener('click', closeDeleteModal);
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    confirmDeleteModal.addEventListener('click', (e) => {
      if (e.target === confirmDeleteModal) closeDeleteModal();
    });
    confirmDeleteBtn.addEventListener('click', handleConfirmDelete);

    // Escape Key for Modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (!bookModal.hasAttribute('hidden')) closeAddModal();
        if (!confirmDeleteModal.hasAttribute('hidden')) closeDeleteModal();
      }
    });

    // Form Submission
    bookForm.addEventListener('submit', handleAddBook);

    // Live Inline Validation Reset on Input
    bookTitle.addEventListener('input', () => {
      const res = validateTitle(bookTitle.value);
      if (res.isValid) {
        clearFieldError(bookTitle, titleError);
      }
    });

    bookAuthor.addEventListener('input', () => {
      const res = validateAuthor(bookAuthor.value);
      if (res.isValid) {
        clearFieldError(bookAuthor, authorError);
      }
    });

    // Search Input
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      clearSearchBtn.hidden = !searchQuery;
      renderBooks();
    });

    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearSearchBtn.hidden = true;
      searchInput.focus();
      renderBooks();
    });

    // Filter Tabs
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const filter = tab.getAttribute('data-filter');
        setFilter(filter);
      });
    });

    // Overview Counter Cards Click to Filter
    counterCards.forEach(card => {
      card.addEventListener('click', () => {
        const filter = card.getAttribute('data-filter');
        setFilter(filter);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const filter = card.getAttribute('data-filter');
          setFilter(filter);
        }
      });
    });
  }

  // Set Active Filter & Sync Tab + Counter Card Highlights
  function setFilter(filter) {
    currentFilter = filter;

    filterTabs.forEach(t => {
      t.classList.toggle('active', t.getAttribute('data-filter') === filter);
    });

    counterCards.forEach(c => {
      c.classList.toggle('active', c.getAttribute('data-filter') === filter);
    });

    updateSectionHeading();
    renderBooks();
  }

  // --- Input Validation Helpers ---
  /**
   * Validates book title:
   * - Must not be empty or whitespace only.
   * - Must contain at least one letter or number (supports Unicode characters & accents).
   * - Rejects strings composed solely of symbols or punctuation.
   */
  function validateTitle(rawTitle) {
    const title = (rawTitle || '').trim();
    if (!title) {
      return { isValid: false, message: 'Please enter a book title.' };
    }
    // Must contain at least one letter or digit (Unicode-aware)
    if (!/[\p{L}\p{N}]/u.test(title)) {
      return {
        isValid: false,
        message: 'Title must contain letters or numbers, not just symbols.'
      };
    }
    return { isValid: true, value: title };
  }

  /**
   * Validates author name:
   * - Must not be empty or whitespace only.
   * - Must contain at least one letter (supports Unicode characters, accents, initials).
   * - Rejects author names consisting purely of numbers (e.g., "12345").
   * - Rejects author names consisting purely of symbols or punctuation.
   */
  function validateAuthor(rawAuthor) {
    const author = (rawAuthor || '').trim();
    if (!author) {
      return { isValid: false, message: "Please enter the author's name." };
    }
    // Must contain at least one letter (\p{L} covers English & international alphabets)
    if (!/\p{L}/u.test(author)) {
      if (/^[\d\s.,\-_/\\#]+$/.test(author)) {
        return {
          isValid: false,
          message: "Author name cannot consist only of numbers."
        };
      }
      return {
        isValid: false,
        message: 'Author name must contain letters, not just symbols.'
      };
    }
    return { isValid: true, value: author };
  }

  // --- Add Modal Helpers ---
  function openAddModal() {
    bookForm.reset();
    clearFieldError(bookTitle, titleError);
    clearFieldError(bookAuthor, authorError);
    bookStatus.value = currentFilter !== 'all' ? currentFilter : 'To read';
    bookModal.removeAttribute('hidden');
    bookTitle.focus();
  }

  function closeAddModal() {
    bookModal.setAttribute('hidden', '');
  }

  function showFieldError(input, errorElement, message) {
    input.classList.add('input-error');
    errorElement.textContent = message;
  }

  function clearFieldError(input, errorElement) {
    input.classList.remove('input-error');
    errorElement.textContent = '';
  }

  // --- Delete Confirmation Modal Helpers ---
  function openDeleteModal(book) {
    pendingDeleteBook = book;
    deleteModalMessage.innerHTML = `Are you sure you want to remove <strong>${escapeHtml(book.title)}</strong> from your reading list?`;
    confirmDeleteModal.removeAttribute('hidden');
    confirmDeleteBtn.focus();
  }

  function closeDeleteModal() {
    confirmDeleteModal.setAttribute('hidden', '');
    pendingDeleteBook = null;
  }

  function handleConfirmDelete() {
    if (!pendingDeleteBook) return;

    const bookTitleDeleted = pendingDeleteBook.title;
    BookStorage.deleteBook(pendingDeleteBook.id);
    closeDeleteModal();
    showToast(`Removed "${bookTitleDeleted}" from your list`);
    updateUI(); // Updates counters immediately
  }

  // --- Add a Book with Refined Validation ---
  function handleAddBook(e) {
    e.preventDefault();

    const titleValidation = validateTitle(bookTitle.value);
    const authorValidation = validateAuthor(bookAuthor.value);
    const statusVal = bookStatus.value;

    let isValid = true;

    if (!titleValidation.isValid) {
      showFieldError(bookTitle, titleError, titleValidation.message);
      isValid = false;
    } else {
      clearFieldError(bookTitle, titleError);
    }

    if (!authorValidation.isValid) {
      showFieldError(bookAuthor, authorError, authorValidation.message);
      isValid = false;
    } else {
      clearFieldError(bookAuthor, authorError);
    }

    if (!isValid) {
      if (!titleValidation.isValid) bookTitle.focus();
      else if (!authorValidation.isValid) bookAuthor.focus();
      return;
    }

    // Save Book with clean trimmed values
    const newBook = BookStorage.addBook({
      title: titleValidation.value,
      author: authorValidation.value,
      status: statusVal
    });

    closeAddModal();
    showToast(`Added "${newBook.title}" to ${newBook.status}`);
    updateUI(); // Updates counters immediately
  }

  // --- Filter, Search, and Newest-First Ordering ---
  function getVisibleBooks() {
    return books
      .filter(book => {
        if (currentFilter === 'all') return true;
        return book.status === currentFilter;
      })
      .filter(book => {
        if (!searchQuery) return true;
        const titleMatch = (book.title || '').toLowerCase().includes(searchQuery);
        const authorMatch = (book.author || '').toLowerCase().includes(searchQuery);
        return titleMatch || authorMatch;
      })
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }

  // --- Safe DOM Rendering ---
  function renderBooks() {
    const visibleBooks = getVisibleBooks();
    booksList.innerHTML = '';

    if (visibleBooks.length === 0) {
      emptyState.hidden = false;
      if (searchQuery) {
        emptyStateMessage.textContent = `No books match "${searchQuery}".`;
        emptyStateAddBtn.hidden = true;
      } else if (currentFilter !== 'all') {
        emptyStateMessage.textContent = `No books found in "${currentFilter}".`;
        emptyStateAddBtn.hidden = false;
      } else {
        emptyStateMessage.textContent = 'Your reading list is empty. Add a book to get started.';
        emptyStateAddBtn.hidden = false;
      }
      return;
    }

    emptyState.hidden = true;

    visibleBooks.forEach(book => {
      const li = document.createElement('li');
      li.className = 'book-item';
      li.dataset.id = book.id;

      // Book Main Info
      const mainInfo = document.createElement('div');
      mainInfo.className = 'book-main-info';

      const h3 = document.createElement('h3');
      h3.className = 'book-title';
      h3.textContent = book.title;

      const pAuthor = document.createElement('p');
      pAuthor.className = 'book-author';
      pAuthor.textContent = `by ${book.author}`;

      const metaDiv = document.createElement('div');
      metaDiv.className = 'book-meta';

      const badge = document.createElement('span');
      badge.className = 'status-badge';
      badge.dataset.status = book.status;
      badge.textContent = book.status;

      const dateSpan = document.createElement('span');
      dateSpan.className = 'book-date';
      dateSpan.textContent = formatDate(book.createdAt);

      metaDiv.appendChild(badge);
      metaDiv.appendChild(dateSpan);

      mainInfo.appendChild(h3);
      mainInfo.appendChild(pAuthor);
      mainInfo.appendChild(metaDiv);

      // Book Actions
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'book-actions';

      // Status Dropdown
      const select = document.createElement('select');
      select.className = 'status-select';
      select.setAttribute('aria-label', `Change status for ${book.title}`);

      ['To read', 'Reading', 'Finished'].forEach(optVal => {
        const option = document.createElement('option');
        option.value = optVal;
        option.textContent = optVal;
        if (book.status === optVal) {
          option.selected = true;
        }
        select.appendChild(option);
      });

      // Status Change Listener
      select.addEventListener('change', (e) => {
        const newStatus = e.target.value;
        const updated = BookStorage.updateStatus(book.id, newStatus);
        if (updated) {
          showToast(`Updated "${book.title}" to ${newStatus}`);
          updateUI(); // Updates counters immediately
        }
      });

      // Delete Button with Confirmation
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.type = 'button';
      deleteBtn.setAttribute('aria-label', `Delete ${book.title}`);
      deleteBtn.title = 'Delete book';
      deleteBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
        <span>Delete</span>
      `;

      deleteBtn.addEventListener('click', () => {
        openDeleteModal(book);
      });

      actionsDiv.appendChild(select);
      actionsDiv.appendChild(deleteBtn);

      li.appendChild(mainInfo);
      li.appendChild(actionsDiv);

      booksList.appendChild(li);
    });
  }

  // --- Dynamic Counter & UI Updater ---
  function updateUI() {
    books = BookStorage.getBooks();

    // Calculate real-time counts
    const total = books.length;
    const toReadCount = books.filter(b => b.status === 'To read').length;
    const readingCount = books.filter(b => b.status === 'Reading').length;
    const finishedCount = books.filter(b => b.status === 'Finished').length;

    // Update Overview Counter Cards
    statTotal.textContent = total;
    statToRead.textContent = toReadCount;
    statReading.textContent = readingCount;
    statFinished.textContent = finishedCount;

    // Update Filter Tab Badges
    countAll.textContent = total;
    countToRead.textContent = toReadCount;
    countReading.textContent = readingCount;
    countFinished.textContent = finishedCount;

    renderBooks();
  }

  function updateSectionHeading() {
    if (currentFilter === 'all') {
      viewTitle.textContent = 'All Books';
    } else {
      viewTitle.textContent = currentFilter;
    }
  }

  function formatDate(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- Toast Notification Feedback ---
  function showToast(message) {
    if (toastTimeout) clearTimeout(toastTimeout);
    toast.textContent = message;
    toast.hidden = false;

    toastTimeout = setTimeout(() => {
      toast.hidden = true;
    }, 3000);
  }
});
