import { useState, useEffect } from 'react';
import api from '../axios/axios';
import type { Book } from '../api/types/book';

export const useBooks = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await api.get('/books');
                setBooks(response.data);
            } catch (error) {
                console.error("Error fetching books:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    return { books, loading };
};