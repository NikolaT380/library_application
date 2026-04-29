import { useState, useEffect } from 'react';
import api from '../axios/axios';
import type { Country } from '../api/types/country';

export const useCountries = () => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await api.get('/countries');
                setCountries(response.data);
            } catch (error) {
                console.error("Error fetching countries:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCountries();
    }, []);

    return { countries, loading };
};