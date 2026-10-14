/**
 * BooksHaven - Main Application Controller
 * Handles user interactions, book rendering, filtering, searching, and UI updates.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- State ---
  let books = BookStorage.getBooks();
  let currentFilter = 'all';
  let currentGenre = 'all';
  let currentSort = 'date-desc';
  let searchQuery = '';
  let selectedRating = 0;

  // --- DOM Elements ---
  const booksGrid = document.getElementById('booksGrid');
  const emptyState = document.getElementById('emptyState');
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const genreFilter = document.getElementById('genreFilter');
  const sortBySelect = document.getElementById('sortBySelect');
  const filterTabs = document.querySelectorAll('.tab-btn');
  const statCards = document.querySelectorAll('.stat-card');

  // Stats Counters & Badges
  const statTotal = document.getElementById('statTotalBooks');
  const statWant = document.getElementById('statWantToRead');
  const statReading = document.getElementById('statCurrentlyReading');
  const statCompleted = document.getElementById('statCompleted');
  const badgeAll = document.getElementById('badgeAll');
  const badgeWant = document.getElementById('badgeWant');
  const badgeReading = document.getElementById('badgeReading');
  const badgeCompleted = document.getElementById('badgeCompleted');

  // Modal Elements
  const bookModal = document.getElementById('bookModal');
  const bookForm = document.getElementById('bookForm');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const saveBtnText = document.getElementById('saveBtnText');
  const openAddModalBtn = document.getElementById('openAddModalBtn');
  const emptyStateAddBtn = document.getElementById('emptyStateAddBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelModalBtn = document.getElementById('cancelModalBtn');

  // Form Fields
  const bookIdInput = document.getElementById('bookId');
  const bookTitleInput = document.getElementById('bookTitle');
  const bookAuthorInput = document.getElementById('bookAuthor');
  const bookGenreInput = document.getElementById('bookGenre');
  const bookStatusInput = document.getElementById('bookStatus');
  const bookPagesInput = document.getElementById('bookPages');
  const bookCurrentPageInput = document.getElementById('bookCurrentPage');
  const bookRatingInput = document.getElementById('bookRating');
  const bookNotesInput = document.getElementById('bookNotes');
  const starButtons = document.querySelectorAll('#starRatingInput .star-btn');
  const toastContainer = document.getElementById('toastContainer');

  // --- Initialize App ---
  function init() {
    setupEventListeners();
    setupStarRating();
    updateUI();
  }

  // --- Event Listeners Setup ---
  function setupEventListeners() {
    // Open modal buttons
    openAddModalBtn.addEventListener('click', () => openModal());
    emptyStateAddBtn.addEventListener('click', () => openModal());

    // Close modal buttons
    closeModalBtn.addEventListener('click', closeModal);
    cancelModalBtn.addEventListener('click', closeModal);
    bookModal.addEventListener('click', (e) => {
      if (e.target === bookModal) closeModal();
    });

    // Close modal on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !bookModal.classList.contains('hidden')) {
        closeModal();
      }
    });

    // Form submit
    bookForm.addEventListener('submit', handleFormSubmit);

    // Search input
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      clearSearchBtn.style.display = searchQuery ? 'block' : 'none';
      renderBooks();
    });

    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearSearchBtn.style.display = 'none';
      searchInput.focus();
      renderBooks();
    });

    // Filter Tabs
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        currentFilter = tab.getAttribute('data-status');
        syncStatCardSelection(currentFilter);
        renderBooks();
      });
    });

    // Overview Stats Card Clicks
    statCards.forEach(card => {
      card.addEventListener('click', () => {
        const filter = card.getAttribute('data-filter');
        const targetTab = Array.from(filterTabs).find(t => t.getAttribute('data-status') === filter);
        if (targetTab) {
          targetTab.click();
        }
      });
    });

    // Dropdowns
    genreFilter.addEventListener('change', (e) => {
      currentGenre = e.target.value;
      renderBooks();
    });

    sortBySelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderBooks();
    });
  }

  // Sync stat card highlight with active tab
  function syncStatCardSelection(filter) {
    statCards.forEach(card => {
      if (card.getAttribute('data-filter') === filter) {
        card.classList.add('active-card');
      } else {
        card.classList.remove('active-card');
      }
    });
  }

  // --- Star Rating Input Component ---
  function setupStarRating() {
    starButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const value = parseInt(btn.getAttribute('data-value'), 10);
        selectedRating = (selectedRating === value) ? 0 : value; // toggle
        bookRatingInput.value = selectedRating;
        updateStarDisplay(selectedRating);
      });

      btn.addEventListener('mouseenter', () => {
        const val = parseInt(btn.getAttribute('data-value'), 10);
        highlightStars(val);
      });
    });

    document.getElementById('starRatingInput').addEventListener('mouseleave', () => {
      updateStarDisplay(selectedRating);
    });
  }

  function highlightStars(count) {
    starButtons.forEach(btn => {
      const val = parseInt(btn.getAttribute('data-value'), 10);
      btn.classList.toggle('hovered', val <= count);
    });
  }

  function updateStarDisplay(count) {
    starButtons.forEach(btn => {
      const val = parseInt(btn.getAttribute('data-value'), 10);
      btn.classList.remove('hovered');
      btn.classList.toggle('active', val <= count);
      const icon = btn.querySelector('i');
      if (icon) {
        if (val <= count) {
          icon.className = 'ph-fill ph-star';
        } else {
          icon.className = 'ph ph-star';
        }
      }
    });
  }

  // --- Modal Management ---
  function openModal(editBookId = null) {
    bookForm.reset();
    document.getElementById('titleError').textContent = '';
    document.getElementById('authorError').textContent = '';

    if (editBookId) {
      const book = books.find(b => b.id === editBookId);
      if (!book) return;

      modalTitle.textContent = 'Edit Book Details';
      modalSubtitle.textContent = 'Update information, reading progress, or personal notes.';
      saveBtnText.textContent = 'Save Changes';

      bookIdInput.value = book.id;
      bookTitleInput.value = book.title;
      bookAuthorInput.value = book.author;
      bookGenreInput.value = book.genre || 'Fiction';
      bookStatusInput.value = book.status || 'want-to-read';
      bookPagesInput.value = book.pages || '';
      bookCurrentPageInput.value = book.currentPage || 0;
      bookNotesInput.value = book.notes || '';
      selectedRating = book.rating || 0;
      bookRatingInput.value = selectedRating;
      updateStarDisplay(selectedRating);

      // Select theme radio
      const themeRadio = document.querySelector(`input[name="coverTheme"][value="${book.coverTheme || 'indigo'}"]`);
      if (themeRadio) themeRadio.checked = true;
    } else {
      modalTitle.textContent = 'Add a Book to Read';
      modalSubtitle.textContent = 'Fill in the details to add this book to your reading list.';
      saveBtnText.textContent = 'Save to List';

      bookIdInput.value = '';
      selectedRating = 0;
      bookRatingInput.value = 0;
      updateStarDisplay(0);

      // Default status to Want to Read
      bookStatusInput.value = currentFilter === 'all' || currentFilter === 'favorites' ? 'want-to-read' : currentFilter;
    }

    bookModal.classList.remove('hidden');
    bookTitleInput.focus();
  }

  function closeModal() {
    bookModal.classList.add('hidden');
  }

  // --- Form Submission & Validation ---
  function handleFormSubmit(e) {
    e.preventDefault();

    const title = bookTitleInput.value.trim();
    const author = bookAuthorInput.value.trim();
    const genre = bookGenreInput.value;
    const status = bookStatusInput.value;
    const pages = parseInt(bookPagesInput.value, 10) || null;
    let currentPage = parseInt(bookCurrentPageInput.value, 10) || 0;
    const rating = parseInt(bookRatingInput.value, 10) || 0;
    const notes = bookNotesInput.value.trim();
    const coverTheme = document.querySelector('input[name="coverTheme"]:checked')?.value || 'indigo';
    const id = bookIdInput.value;

    let hasError = false;
    if (!title) {
      document.getElementById('titleError').textContent = 'Please provide a book title.';
      hasError = true;
    } else {
      document.getElementById('titleError').textContent = '';
    }

    if (!author) {
      document.getElementById('authorError').textContent = 'Please provide the author name.';
      hasError = true;
    } else {
      document.getElementById('authorError').textContent = '';
    }

    if (hasError) return;

    if (pages && currentPage > pages) {
      currentPage = pages;
    }
    if (status === 'completed' && pages) {
      currentPage = pages;
    }

    const bookPayload = {
      title,
      author,
      genre,
      status,
      pages,
      currentPage,
      rating,
      notes,
      coverTheme
    };

    if (id) {
      // Update existing book
      BookStorage.updateBook({ id, ...bookPayload });
      showToast(`Updated "${title}"`, 'success', 'ph-check-circle');
    } else {
      // Add new book
      BookStorage.addBook(bookPayload);
      showToast(`Added "${title}" to your library!`, 'success', 'ph-bookmark-simple');
    }

    books = BookStorage.getBooks();
    closeModal();
    updateUI();
  }

  // --- Filter and Sort Logic ---
  function getFilteredAndSortedBooks() {
    return books
      .filter(book => {
        // Tab Status Filter
        if (currentFilter === 'favorites') {
          if (!book.isFavorite) return false;
        } else if (currentFilter !== 'all') {
          if (book.status !== currentFilter) return false;
        }

        // Genre Filter
        if (currentGenre !== 'all' && book.genre !== currentGenre) {
          return false;
        }

        // Live Search Query
        if (searchQuery) {
          const matchTitle = book.title?.toLowerCase().includes(searchQuery);
          const matchAuthor = book.author?.toLowerCase().includes(searchQuery);
          const matchGenre = book.genre?.toLowerCase().includes(searchQuery);
          const matchNotes = book.notes?.toLowerCase().includes(searchQuery);
          if (!matchTitle && !matchAuthor && !matchGenre && !matchNotes) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        switch (currentSort) {
          case 'date-asc':
            return (a.createdAt || 0) - (b.createdAt || 0);
          case 'title-asc':
            return (a.title || '').localeCompare(b.title || '');
          case 'author-asc':
            return (a.author || '').localeCompare(b.author || '');
          case 'rating-desc':
            return (b.rating || 0) - (a.rating || 0);
          case 'date-desc':
          default:
            return (b.createdAt || 0) - (a.createdAt || 0);
        }
      });
  }

  // --- Render Books to Grid ---
  function renderBooks() {
    const filtered = getFilteredAndSortedBooks();

    if (filtered.length === 0) {
      booksGrid.innerHTML = '';
      emptyState.classList.remove('hidden');
      return;
    }

    emptyState.classList.add('hidden');

    booksGrid.innerHTML = filtered.map(book => {
      // Status format
      let statusLabel = 'Want to Read';
      let statusClass = 'want-to-read';
      let statusIcon = 'ph-bookmark-simple';

      if (book.status === 'currently-reading') {
        statusLabel = 'Reading';
        statusClass = 'currently-reading';
        statusIcon = 'ph-book-open';
      } else if (book.status === 'completed') {
        statusLabel = 'Completed';
        statusClass = 'completed';
        statusIcon = 'ph-check-circle';
      }

      // Progress Calculation
      let progressHtml = '';
      if (book.pages && book.pages > 0) {
        const current = book.currentPage || 0;
        const percent = Math.min(100, Math.round((current / book.pages) * 100));
        progressHtml = `
          <div class="progress-container">
            <div class="progress-header">
              <span>Progress: <strong>${percent}%</strong></span>
              <span>${current} / ${book.pages} pages</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${percent}%;"></div>
            </div>
          </div>
        `;
      }

      // Stars
      let starsHtml = '';
      if (book.rating && book.rating > 0) {
        starsHtml = `
          <div class="rating-display" title="${book.rating} out of 5 stars">
            ${[1, 2, 3, 4, 5].map(i => `
              <i class="${i <= book.rating ? 'ph-fill ph-star' : 'ph ph-star empty-star'}"></i>
            `).join('')}
          </div>
        `;
      }

      // Notes
      const notesHtml = book.notes 
        ? `<p class="book-notes" title="${escapeHtml(book.notes)}">"${escapeHtml(book.notes)}"</p>` 
        : '';

      const isFav = book.isFavorite;

      return `
        <article class="book-card" data-id="${book.id}">
          <div class="book-card-hero theme-${book.coverTheme || 'indigo'}">
            <div class="card-top-bar">
              <span class="genre-pill">${escapeHtml(book.genre || 'General')}</span>
              <button class="favorite-btn ${isFav ? 'is-favorite' : ''}" data-action="favorite" title="${isFav ? 'Remove from favorites' : 'Mark as favorite'}">
                <i class="${isFav ? 'ph-fill ph-heart' : 'ph ph-heart'}"></i>
              </button>
            </div>
            
            <i class="ph-duotone ph-book-open card-hero-icon"></i>

            <span class="status-pill ${statusClass}">
              <i class="ph-bold ${statusIcon}"></i> ${statusLabel}
            </span>
          </div>

          <div class="book-card-body">
            <h3 class="book-title" title="${escapeHtml(book.title)}">${escapeHtml(book.title)}</h3>
            <p class="book-author">
              <i class="ph ph-feather"></i> ${escapeHtml(book.author)}
            </p>

            ${starsHtml}
            ${notesHtml}
            ${progressHtml}
          </div>

          <div class="book-card-footer">
            <select class="status-dropdown-btn" data-action="change-status" title="Change reading status">
              <option value="want-to-read" ${book.status === 'want-to-read' ? 'selected' : ''}>Want to Read</option>
              <option value="currently-reading" ${book.status === 'currently-reading' ? 'selected' : ''}>Currently Reading</option>
              <option value="completed" ${book.status === 'completed' ? 'selected' : ''}>Completed</option>
            </select>

            <div class="card-action-group">
              <button class="card-action-btn edit-btn" data-action="edit" title="Edit book details">
                <i class="ph ph-pencil-simple-line"></i>
              </button>
              <button class="card-action-btn delete-btn" data-action="delete" title="Delete book">
                <i class="ph ph-trash"></i>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach card event listeners
    attachCardActionListeners();
  }

  // --- Card Action Handlers ---
  function attachCardActionListeners() {
    const cards = booksGrid.querySelectorAll('.book-card');

    cards.forEach(card => {
      const bookId = card.getAttribute('data-id');

      // Status dropdown change
      const statusSelect = card.querySelector('[data-action="change-status"]');
      if (statusSelect) {
        statusSelect.addEventListener('change', (e) => {
          const newStatus = e.target.value;
          BookStorage.updateStatus(bookId, newStatus);
          books = BookStorage.getBooks();
          showToast(`Status updated to ${formatStatusName(newStatus)}`, 'info', 'ph-arrows-clockwise');
          updateUI();
        });
      }

      // Favorite toggle
      const favBtn = card.querySelector('[data-action="favorite"]');
      if (favBtn) {
        favBtn.addEventListener('click', () => {
          const updated = BookStorage.toggleFavorite(bookId);
          books = BookStorage.getBooks();
          if (updated) {
            showToast(
              updated.isFavorite ? `Added "${updated.title}" to Favorites!` : `Removed from Favorites`,
              'info',
              'ph-heart'
            );
          }
          updateUI();
        });
      }

      // Edit book
      const editBtn = card.querySelector('[data-action="edit"]');
      if (editBtn) {
        editBtn.addEventListener('click', () => {
          openModal(bookId);
        });
      }

      // Delete book
      const deleteBtn = card.querySelector('[data-action="delete"]');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
          const target = books.find(b => b.id === bookId);
          const confirmMsg = target ? `Delete "${target.title}" from your reading list?` : 'Delete this book?';
          if (confirm(confirmMsg)) {
            BookStorage.deleteBook(bookId);
            books = BookStorage.getBooks();
            showToast(`Book removed from list`, 'danger', 'ph-trash');
            updateUI();
          }
        });
      }
    });
  }

  // --- Update UI Counters & Stats ---
  function updateUI() {
    const total = books.length;
    const wantCount = books.filter(b => b.status === 'want-to-read').length;
    const readingCount = books.filter(b => b.status === 'currently-reading').length;
    const completedCount = books.filter(b => b.status === 'completed').length;

    // Overview Stats Numbers
    statTotal.textContent = total;
    statWant.textContent = wantCount;
    statReading.textContent = readingCount;
    statCompleted.textContent = completedCount;

    // Filter Badges
    badgeAll.textContent = total;
    badgeWant.textContent = wantCount;
    badgeReading.textContent = readingCount;
    badgeCompleted.textContent = completedCount;

    renderBooks();
  }

  // --- Toast Notifications ---
  function showToast(message, type = 'info', iconClass = 'ph-info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <i class="ph-bold ${iconClass}"></i>
      <span>${escapeHtml(message)}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 4000);
  }

  // --- Helper Utilities ---
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatStatusName(status) {
    switch (status) {
      case 'want-to-read': return 'Want to Read';
      case 'currently-reading': return 'Currently Reading';
      case 'completed': return 'Completed';
      default: return status;
    }
  }

  // Run start
  init();
});
