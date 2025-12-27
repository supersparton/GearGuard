// useRequests.js - Optional requests hook
import { useState, useEffect } from 'react';
import { supabase } from '../shared/supabase';

export const useRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('requests')
                .select('*');

            if (error) throw error;
            setRequests(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    return { requests, loading, error, refetch: fetchRequests };
};

export default useRequests;
