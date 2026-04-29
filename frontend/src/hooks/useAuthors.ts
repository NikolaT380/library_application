import { useState, useEffect } from 'react';
import api from '../axios/axios';
import type { Author } from '../api/types/author';

export const useAuthors = () => {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                const response = await api.get('/authors');
                setAuthors(response.data);
            } catch (error) {
                console.error("Error fetching authors:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAuthors();
    }, []);

    return { authors, loading };
};