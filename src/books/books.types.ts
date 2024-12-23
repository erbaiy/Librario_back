// src/books/books.types.ts
export interface Book {
    id: string;
    title: string;
    author: string;
    category: string;
    available: boolean;
    publicationYear: number;
    description?: string;
    
    createdAt: string;
    updatedAt: string;
  }
  