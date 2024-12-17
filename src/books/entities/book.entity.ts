export interface Book {
    id: string;               // Unique identifier for the book
    title: string;            // Title of the book
    author: string;           // Author of the book
    category: string;         // Category of the book (e.g., Fiction, Non-fiction)
    available: boolean;       // Availability status (true if available, false if borrowed)
    borrowedBy?: string;      // User ID of the person who borrowed the book (optional)
    borrowDate?: string;      // Date when the book was borrowed (ISO format, optional)
    returnDate?: string;      // Expected return date (ISO format, optional)
    createdAt?: string;       // Timestamp when the book was created
    updatedAt?: string;       // Timestamp when the book details were last updated
  }
  