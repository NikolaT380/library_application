import { useState, useEffect, useCallback } from 'react';
import api from '../axios/axios';
import type { Country } from '../api/types/country';

export const useCountries = () => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchCountries = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/countries');
            setCountries(response.data);
        } catch (error) {
            console.error("Error fetching countries:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
       void fetchCountries();
    }, [fetchCountries]);

    const addCountry = async (name: string, continent: string) => {
        try {
            await api.post('/countries/add', { name, continent });

            await fetchCountries();
            return true;
        } catch (error) {
            console.error("Error adding country:", error);
            return false;
        }
    };

    const editCountry = async (id: number, name: string, continent: string) => {
        try {
            await api.put(`/countries/${id}/edit`, { name, continent });
            await fetchCountries();
            return true;
        } catch (error) {
            console.error("Error editing country:", error);
            return false;
        }
    };

    const deleteCountry = async (id: number) => {
        try {
            await api.delete(`/countries/${id}/delete`);

            await fetchCountries();
            return true;
        } catch (error) {
            console.error("Error deleting country:", error);
            return false;
        }
    };

    return { countries, loading, addCountry, editCountry, deleteCountry, fetchCountries };
};