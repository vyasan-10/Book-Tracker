/**
 * BooksHaven - Main Application Logic
 * Implements the 5 core features cleanly without external dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {
  // State
  let books = BookStorage.getBooks();
  let currentFilter = 'all';
  let searchQuery = '';

  // DOM Elements
  const booksList = document.getElementById('booksList');
  const emptyState = document.getElementById('emptyState');
  const emptyStateMessage = document.getElementById('emptyStateMessage');
  const emptyStateAddBtn = document.getElementById('emptyStateAddBtn');
  const viewTitle = document.getElementById('viewTitle');

  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const filterTabs = document.querySelectorAll('.filter-tab');

  // Counts
  const countAll = document.getElementById('countAll');
  const countToRead = document.getElementById('countToRead');
  const countReading = document.getElementById('countReading');
  const countFinished = document.getElementById('countFinished');

  // Modal & Form Elements
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
    // Modal Open / Close
    openModalBtn.addEventListener('click', () => openAddModal());
    emptyStateAddBtn.addEventListener('click', () => openAddModal());
    closeModalBtn.addEventListener('click', closeAddModal);
    cancelModalBtn.addEventListener('click', closeAddModal);

    bookModal.addEventListener('click', (e) => {
      if (e.target === bookModal) closeAddModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !bookModal.hasAttribute('hidden')) {
        closeAddModal();
      }
    });

    // Form Submission with Validation
    bookForm.addEventListener('submit', handleAddBook);

    // Live Inline Validation Reset on Input
    bookTitle.addEventListener('input', () => {
      if (bookTitle.value.trim()) {
        clearFieldError(bookTitle, titleError);
      }
    });

    bookAuthor.addEventListener('input', () => {
      if (bookAuthor.value.trim()) {
        clearFieldError(bookAuthor, authorError);
      }
    });

    // Feature 3: Case-insensitive search by title or author
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

    // Status Filter Tabs
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = tab.getAttribute('data-filter');
        updateSectionHeading();
        renderBooks();
      });
    });
  }

  // --- Modal Helpers ---
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

  // --- Feature 1: Add a Book with Required Validation ---
  function handleAddBook(e) {
    e.preventDefault();

    const titleVal = bookTitle.value.trim();
    const authorVal = bookAuthor.value.trim();
    const statusVal = bookStatus.value;

    let isValid = true;

    // Validate Title
    if (!titleVal) {
      showFieldError(bookTitle, titleError, 'Please enter a book title.');
      isValid = false;
    } else {
      clearFieldError(bookTitle, titleError);
    }

    // Validate Author
    if (!authorVal) {
      showFieldError(bookAuthor, authorError, "Please enter the author's name.");
      isValid = false;
    } else {
      clearFieldError(bookAuthor, authorError);
    }

    if (!isValid) {
      if (!titleVal) bookTitle.focus();
      else if (!authorVal) bookAuthor.focus();
      return;
    }

    // Save Book via BookStorage (persists to localStorage)
    const newBook = BookStorage.addBook({
      title: titleVal,
      author: authorVal,
      status: statusVal
    });

    books = BookStorage.getBooks();
    closeAddModal();
    showToast(`Added "${newBook.title}" to ${newBook.status}`);
    updateUI();
  }

  // --- Feature 2 & 3: Filter, Search, and Newest-First Ordering ---
  function getVisibleBooks() {
    return books
      // Filter by Status Tab
      .filter(book => {
        if (currentFilter === 'all') return true;
        return book.status === currentFilter;
      })
      // Feature 3: Case-insensitive search by title or author (partial match)
      .filter(book => {
        if (!searchQuery) return true;
        const titleMatch = (book.title || '').toLowerCase().includes(searchQuery);
        const authorMatch = (book.author || '').toLowerCase().includes(searchQuery);
        return titleMatch || authorMatch;
      })
      // Feature 2: Display books newest first
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }

  // --- Safe DOM Rendering (Prevents Raw HTML Injection) ---
  function renderBooks() {
    const visibleBooks = getVisibleBooks();
    booksList.innerHTML = '';

    if (visibleBooks.length === 0) {
      emptyState.hidden = false;
      if (searchQuery) {
        emptyStateMessage.textContent = `No books match "${searchQuery}".`;
        emptyStateAddBtn.hidden = true;
      } else if (currentFilter !== 'all') {
        emptyStateMessage.textContent = `No books found under "${currentFilter}".`;
        emptyStateAddBtn.hidden = false;
      } else {
        emptyStateMessage.textContent = 'Your reading list is empty. Add a book to get started.';
        emptyStateAddBtn.hidden = false;
      }
      return;
    }

    emptyState.hidden = true;

    // Build each book card using safe DOM methods
    visibleBooks.forEach(book => {
      const li = document.createElement('li');
      li.className = 'book-item';
      li.dataset.id = book.id;

      // Book Main Info (Title, Author, Badge, Date)
      const mainInfo = document.createElement('div');
      mainInfo.className = 'book-main-info';

      // Title (rendered safely via textContent)
      const h3 = document.createElement('h3');
      h3.className = 'book-title';
      h3.textContent = book.title;

      // Author (rendered safely via textContent)
      const pAuthor = document.createElement('p');
      pAuthor.className = 'book-author';
      pAuthor.textContent = `by ${book.author}`;

      // Metadata Row
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

      // Book Actions (Status Dropdown + Delete)
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'book-actions';

      // Feature 4: Allow users to change a book's status directly from the book list
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

      // Change status handler
      select.addEventListener('change', (e) => {
        const newStatus = e.target.value;
        const updated = BookStorage.updateStatus(book.id, newStatus);
        if (updated) {
          books = BookStorage.getBooks();
          showToast(`Updated "${book.title}" to ${newStatus}`);
          updateUI();
        }
      });

      // Delete Button
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.type = 'button';
      deleteBtn.setAttribute('aria-label', `Delete ${book.title}`);
      deleteBtn.title = 'Delete book';
      deleteBtn.textContent = '✕';

      deleteBtn.addEventListener('click', () => {
        if (confirm(`Remove "${book.title}" from your reading list?`)) {
          BookStorage.deleteBook(book.id);
          books = BookStorage.getBooks();
          showToast(`Removed "${book.title}"`);
          updateUI();
        }
      });

      actionsDiv.appendChild(select);
      actionsDiv.appendChild(deleteBtn);

      li.appendChild(mainInfo);
      li.appendChild(actionsDiv);

      booksList.appendChild(li);
    });
  }

  // --- UI Update & Counter Synchronizer ---
  function updateUI() {
    books = BookStorage.getBooks();

    // Calculate Counts
    const total = books.length;
    const toReadCount = books.filter(b => b.status === 'To read').length;
    const readingCount = books.filter(b => b.status === 'Reading').length;
    const finishedCount = books.filter(b => b.status === 'Finished').length;

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
