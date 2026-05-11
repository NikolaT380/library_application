import { useState, useEffect, useCallback } from 'react';
import api from '../axios/axios';
import type { Author } from '../api/types/author';

export const useAuthors = () => {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchAuthors = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/authors');
            setAuthors(response.data);
        } catch (error) {
            console.error("Error fetching authors:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchAuthors();
    }, [fetchAuthors]);

    const addAuthor = async (name: string, surname: string, countryId: number) => {
        try {
            await api.post('/authors/add', { name, surname, countryId });
            await fetchAuthors();
            return true;
        } catch (error) {
            console.error("Error adding author:", error);
            return false;
        }
    };

    const editAuthor = async (id: number, name: string, surname: string, countryId: number) => {
        try {
            await api.put(`/authors/${id}/edit`, { name, surname, countryId });
            await fetchAuthors();
            return true;
        } catch (error) {
            console.error("Error editing author:", error);
            return false;
        }
    };

    const deleteAuthor = async (id: number) => {
        try {
            await api.delete(`/authors/${id}/delete`);
            await fetchAuthors();
            return true;
        } catch (error) {
            console.error("Error deleting author:", error);
            return false;
        }
    };

    return { authors, loading, addAuthor, editAuthor, deleteAuthor, fetchAuthors };
};