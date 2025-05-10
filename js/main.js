// Book Management System
class LibrarySystem {
    constructor() {
        this.books = [];
        this.borrowedBooks = [];
        this.loadBooks();
        this.setupEventListeners();
    }

    async loadBooks() {
        try {
            const response = await fetch('../data/books.json');
            const data = await response.json();
            this.books = data.books;
            this.displayBooks(this.books);
        } catch (error) {
            console.error('Error loading books:', error);
        }
    }

    setupEventListeners() {
        // Search functionality
        const searchForm = document.getElementById('searchForm');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSearch();
            });
        }

        // Book borrowing
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('borrow-btn')) {
                const bookId = e.target.dataset.bookId;
                this.borrowBook(bookId);
            }
        });
    }

    handleSearch() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const category = document.getElementById('categorySelect').value;
        const author = document.getElementById('authorSelect').value;

        const filteredBooks = this.books.filter(book => {
            const matchesSearch = book.title.toLowerCase().includes(searchTerm) ||
                                book.author.toLowerCase().includes(searchTerm);
            const matchesCategory = category === 'all' || book.category === category;
            const matchesAuthor = author === 'all' || book.author === author;

            return matchesSearch && matchesCategory && matchesAuthor;
        });

        this.displayBooks(filteredBooks);
    }

    displayBooks(books) {
        const bookGrid = document.querySelector('.book-grid');
        if (!bookGrid) return;

        bookGrid.innerHTML = books.map(book => `
            <div class="book-card">
                <img src="${book.cover}" alt="${book.title}" class="book-cover">
                <div class="book-info">
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author">${book.author}</p>
                    <p class="book-category">${book.category}</p>
                    <p class="book-location">Location: ${book.location}</p>
                    <button class="btn borrow-btn" data-book-id="${book.id}" 
                            ${!book.available ? 'disabled' : ''}>
                        ${book.available ? 'Borrow' : 'Not Available'}
                    </button>
                </div>
            </div>
        `).join('');
    }

    borrowBook(bookId) {
        const book = this.books.find(b => b.id === bookId);
        if (!book || !book.available) return;

        // Add to borrowed books
        this.borrowedBooks.push({
            ...book,
            borrowDate: new Date(),
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
        });

        // Update book availability
        book.available = false;

        // Update display
        this.displayBooks(this.books);

        // Show success message
        alert(`Successfully borrowed "${book.title}". Due date: ${this.borrowedBooks[this.borrowedBooks.length - 1].dueDate.toLocaleDateString()}`);
    }

    returnBook(bookId) {
        const borrowedIndex = this.borrowedBooks.findIndex(b => b.id === bookId);
        if (borrowedIndex === -1) return;

        const book = this.books.find(b => b.id === bookId);
        if (book) {
            book.available = true;
        }

        this.borrowedBooks.splice(borrowedIndex, 1);
        this.displayBooks(this.books);
    }
}

// Initialize the library system when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.librarySystem = new LibrarySystem();
}); 