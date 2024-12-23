// src/books/books.types.ts
export interface Book {
    id: string;
    title: string;
    author: string;
    category: string;
    publicationYear: number;
    description?: string;
    createdAt: string;
    updatedAt: string;
  }
  