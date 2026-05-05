export interface Book {
    id: number;
    name: string;
    category: string;
    authorId: number;
    authorName: string;
    availableCopies: number;
    state: string;
}