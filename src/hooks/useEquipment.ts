import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Equipment = Tables<'v_equipment'>;
type EquipmentInsert = {
    name: string;
    serial_number: string;
    description?: string;
    category_id?: string;
    department: string;
    location: string;
    maintenance_team_id: string;
    default_technician_id?: string;
    purchase_date: string;
    warranty_expiry?: string;
    notes?: string;
};

export function useEquipment() {
    return useQuery({
        queryKey: ['equipment'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('v_equipment')
                .select('*')
                .order('name');

            if (error) throw error;
            return data as Equipment[];
        },
    });
}

export function useEquipmentDefaults(equipmentId: string | null) {
    return useQuery({
        queryKey: ['equipment-defaults', equipmentId],
        queryFn: async () => {
            if (!equipmentId) return null;

            const { data, error } = await supabase
                .rpc('get_equipment_defaults', { p_equipment_id: equipmentId });

            if (error) throw error;
            return data?.[0] ?? null;
        },
        enabled: !!equipmentId,
    });
}

export function useCreateEquipment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (equipment: EquipmentInsert) => {
            const { data, error } = await supabase
                .from('equipment')
                .insert(equipment)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['equipment'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });
}

export function useUpdateEquipment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: { id: string;[key: string]: any }) => {
            const { data, error } = await supabase
                .from('equipment')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['equipment'] });
        },
    });
}
