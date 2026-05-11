import { useState, useCallback } from 'react';
import api from '../axios/axios';

export interface Book {
    id: number;
    name: string;
    category: string;
    authorId: number;
    authorName: string;
    state?: string;
    availableCopies: number;
}

export const useBooks = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [totalPages, setTotalPages] = useState<number>(0);

    const fetchBooks = useCallback(async (params: any = { page: 0, size: 10 }) => {
        setLoading(true);
        try {
            const response = await api.get('/books/search', { params });

            setBooks(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching books:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const addBook = async (name: string, category: string, authorId: number, availableCopies: number) => {
        try {
            await api.post('/books/add', { name, category, authorId, availableCopies });
            return true;
        } catch (error) {
            console.error("Error adding book:", error);
            return false;
        }
    };

    const editBook = async (id: number, name: string, category: string, authorId: number, availableCopies: number, state?: string) => {
        try {
            await api.put(`/books/${id}/edit`, { name, category, authorId, availableCopies, state });
            return true;
        } catch (error) {
            console.error("Error editing book:", error);
            return false;
        }
    };

    const deleteBook = async (id: number) => {
        try {
            await api.delete(`/books/${id}/delete`);
            return true;
        } catch (error) {
            console.error("Error deleting book:", error);
            return false;
        }
    };

    const rentBook = async (id: number) => {
        try {
            await api.post(`/books/${id}/rent`);
            return true;
        } catch (error) {
            console.error("Error renting book:", error);
            return false;
        }
    };

    return { books, loading, totalPages, fetchBooks, addBook, editBook, deleteBook, rentBook };
};