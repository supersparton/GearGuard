import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface WorkCenter {
    id: string;
    name: string;
    code: string | null;
    cost_per_hour: number | null;
    capacity_time_efficiency: number | null;
    oee_target: number | null;
    is_active: boolean;
    created_at: string;
    updated_at?: string;
}

export function useWorkCenters() {
    return useQuery({
        queryKey: ['work-centers'],
        queryFn: async () => {
            const { data, error } = await (supabase as any)
                .from('work_centers')
                .select('*')
                .eq('is_active', true)
                .order('name');

            if (error) {
                console.error('Error fetching work centers:', error);
                return [];
            }
            return (data || []) as WorkCenter[];
        },
    });
}

export function useWorkCenter(id: string | null) {
    return useQuery({
        queryKey: ['work-center', id],
        queryFn: async () => {
            if (!id) return null;

            const { data, error } = await (supabase as any)
                .from('work_centers')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data as WorkCenter;
        },
        enabled: !!id,
    });
}

export function useCreateWorkCenter() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (workCenter: Partial<WorkCenter>) => {
            const { data, error } = await (supabase as any)
                .from('work_centers')
                .insert(workCenter)
                .select()
                .single();

            if (error) throw error;
            return data as WorkCenter;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['work-centers'] });
        },
    });
}

export function useUpdateWorkCenter() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: Partial<WorkCenter> & { id: string }) => {
            const { data, error } = await (supabase as any)
                .from('work_centers')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data as WorkCenter;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['work-centers'] });
        },
    });
}

export function useDeleteWorkCenter() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await (supabase as any)
                .from('work_centers')
                .update({ is_active: false })
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['work-centers'] });
        },
    });
}

// Get request count for a work center
export function useWorkCenterRequestCount(workCenterId: string | null) {
    return useQuery({
        queryKey: ['work-center-requests-count', workCenterId],
        queryFn: async () => {
            if (!workCenterId) return 0;

            const { count, error } = await (supabase as any)
                .from('maintenance_requests')
                .select('*', { count: 'exact', head: true })
                .eq('work_center_id', workCenterId);

            if (error) return 0;
            return count || 0;
        },
        enabled: !!workCenterId,
    });
}
