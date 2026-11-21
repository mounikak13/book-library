
import React, { useEffect, useState } from "react";
import "./App.css";

const defaultBooks = [
  {
    id: 1,
    title: "Wings of Fire",
    author: "A.P.J. Abdul Kalam",
    genre: "Biography",
    status: "Read",
    cover: "https://covers.openlibrary.org/b/isbn/9788173711466-L.jpg"
  },
  {
    id: 2,
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Fiction",
    status: "Unread",
    cover: "https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg"
  },
  {
    id: 3,
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-Help",
    status: "Read",
    cover: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg"
  },
  {
    id: 4,
    title: "Clean Code",
    author: "Robert C. Martin",
    genre: "Technology",
    status: "Unread",
    cover: "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg"
  }
];

function App() {
  // Load books from LocalStorage
  const [books, setBooks] = useState(() => {
    try {
      const savedBooks = localStorage.getItem("myBooks");
      return savedBooks ? JSON.parse(savedBooks) : defaultBooks;
    } catch {
      return defaultBooks;
    }
  });

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [status, setStatus] = useState("Read");

  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [editId, setEditId] = useState(null);

  // Save books whenever collection changes
  useEffect(() => {
    localStorage.setItem("myBooks", JSON.stringify(books));
  }, [books]);

  // Count read and unread books
  const readCount = books.filter(
    (book) => book.status === "Read"
  ).length;

  const unreadCount = books.filter(
    (book) => book.status === "Unread"
  ).length;

  // Reset form
  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setGenre("");
    setStatus("Read");
    setEditId(null);
  };

  // Add or update book
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !author.trim() || !genre) {
      alert("Please fill all book details");
      return;
    }

    if (editId !== null) {
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === editId
            ? {
                ...book,
                title: title.trim(),
                author: author.trim(),
                genre,
                status
              }
            : book
        )
      );
    } else {
      const newBook = {
        id: Date.now(),
        title: title.trim(),
        author: author.trim(),
        genre,
        status,
        cover: ""
      };

      setBooks((prevBooks) => [...prevBooks, newBook]);
    }

    resetForm();
  };

  // Edit book
  const handleEdit = (book) => {
    setTitle(book.title);
    setAuthor(book.author);
    setGenre(book.genre);
    setStatus(book.status);
    setEditId(book.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Delete book
  const handleDelete = (id) => {
    if (window.confirm("Do you want to delete this book?")) {
      setBooks((prevBooks) =>
        prevBooks.filter((book) => book.id !== id)
      );

      if (editId === id) {
        resetForm();
      }
    }
  };

  // Search and filter books
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase());

    const matchesGenre =
      genreFilter === "All" || book.genre === genreFilter;

    const matchesStatus =
      statusFilter === "All" || book.status === statusFilter;

    return matchesSearch && matchesGenre && matchesStatus;
  });

  // Unique genres
  const genres = [...new Set(books.map((book) => book.genre))];

  return (
    <div className="app-container">

      {/* Header */}
      <header className="header">
        <div className="header-icon">📖</div>

        <div className="header-text">
          <h1>Book Library</h1>
          <p>Manage your personal book collection</p>
        </div>

        <div className="header-books">📚</div>
      </header>

      {/* Statistics */}
      <section className="stats">

        <div className="stat-box read-box">
          <div className="stat-icon">✓</div>
          <div>
            <h3>Books Read</h3>
            <h2>{readCount}</h2>
          </div>
        </div>

        <div className="stat-box unread-box">
          <div className="stat-icon">▮</div>
          <div>
            <h3>Books Unread</h3>
            <h2>{unreadCount}</h2>
          </div>
        </div>

      </section>

      {/* Add Book Form */}
      <section className="form-section">

        <h2>
          <span className="plus-icon">+</span>
          {editId !== null ? "Edit Book" : "Add New Book"}
        </h2>

        <form onSubmit={handleSubmit} className="book-form">

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              placeholder="Enter book title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Author</label>
            <input
              type="text"
              placeholder="Enter author name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Genre</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              <option value="">Select Genre</option>
              <option value="Fiction">Fiction</option>
              <option value="Biography">Biography</option>
              <option value="Self-Help">Self-Help</option>
              <option value="Technology">Technology</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="status-group">
            <label>Reading Status</label>

            <div className="radio-options">
              <label>
                <input
                  type="radio"
                  name="status"
                  value="Read"
                  checked={status === "Read"}
                  onChange={(e) => setStatus(e.target.value)}
                />
                Read
              </label>

              <label>
                <input
                  type="radio"
                  name="status"
                  value="Unread"
                  checked={status === "Unread"}
                  onChange={(e) => setStatus(e.target.value)}
                />
                Unread
              </label>
            </div>
          </div>

          <button type="submit" className="add-button">
            + {editId !== null ? "Update Book" : "Add Book"}
          </button>

          {editId !== null && (
            <button
              type="button"
              className="cancel-button"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}

        </form>
      </section>

      {/* Search and Filters */}
      <section className="filter-section">

        <div className="search-box">
          <span>⌕</span>
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Filter by Genre:</label>
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
          >
            <option value="All">All Genres</option>

            {genres.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Filter by Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Books</option>
            <option value="Read">Read</option>
            <option value="Unread">Unread</option>
          </select>
        </div>

      </section>

      {/* Book List */}
      <section className="books-section">

        <h2 className="books-heading">
          📖 My Books ({filteredBooks.length})
        </h2>

        {filteredBooks.length === 0 ? (
          <div className="no-books">
            No books found. Try another search or add a book!
          </div>
        ) : (

          <div className="books-grid">

            {filteredBooks.map((book) => (

              <div className="book-card" key={book.id}>

                <div className="cover-container">
                  {book.cover ? (
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="book-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="cover-placeholder">
                      📖
                      <span>{book.title}</span>
                    </div>
                  )}
                </div>

                <div className="book-details">

                  <h3>{book.title}</h3>

                  <p>Author: {book.author}</p>
                  <p>Genre: {book.genre}</p>

                  <div className="book-actions">

                    <span
                      className={
                        book.status === "Read"
                          ? "book-status read-status"
                          : "book-status unread-status"
                      }
                    >
                      {book.status === "Read" ? "✓" : "▮"}
                      {" "}{book.status}
                    </span>

                    <div className="action-buttons">

                      <button
                        className="edit-button"
                        onClick={() => handleEdit(book)}
                      >
                        ✎ Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() => handleDelete(book.id)}
                      >
                        ▤ Delete
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}

export default App;