// useEquipment.js - Optional equipment hook
import { useState, useEffect } from 'react';
import { supabase } from '../shared/supabase';

export const useEquipment = () => {
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEquipment = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('equipment')
                .select('*');

            if (error) throw error;
            setEquipment(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEquipment();
    }, []);

    return { equipment, loading, error, refetch: fetchEquipment };
};

export default useEquipment;
