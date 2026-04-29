import type { Author } from "./author";

export interface Book {
    id: number;
    name: string;
    category: string;
    author: Author;
    availableCopies: number;
    state: string;
    rentCount: number;
}