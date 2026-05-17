import { useCallback, useState } from 'react';
import api from '../axios/axios';

export type BooksViewMode = 'ROW' | 'CARD';

export const useBooksViewPreference = () => {
    const [viewMode, setViewMode] = useState<BooksViewMode>('ROW');
    const [loadingPreference, setLoadingPreference] = useState<boolean>(true);

    const fetchViewMode = useCallback(async () => {
        setLoadingPreference(true);
        try {
            const response = await api.get('/users/preferences/books-view');
            const mode = response.data?.booksViewMode;
            setViewMode(mode === 'CARD' ? 'CARD' : 'ROW');
        } catch (error) {
            console.error('Error fetching books view preference:', error);
            setViewMode('ROW');
        } finally {
            setLoadingPreference(false);
        }
    }, []);

    const updateViewMode = useCallback(async (mode: BooksViewMode) => {
        setViewMode(mode);
        try {
            await api.put('/users/preferences/books-view', { booksViewMode: mode });
        } catch (error) {
            console.error('Error updating books view preference:', error);
        }
    }, []);

    return {
        viewMode,
        loadingPreference,
        fetchViewMode,
        updateViewMode
    };
};