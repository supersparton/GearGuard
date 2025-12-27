import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Request = Tables<'v_requests'>;
type RequestInsert = {
    subject: string;
    description?: string;
    equipment_id: string;
    priority?: 'low' | 'medium' | 'high' | 'critical';
    request_type?: 'corrective' | 'preventive';
    due_date?: string;
    scheduled_date?: string;
    created_by: string;
    technician_id?: string;
    category_id?: string;
};

export function useRequests() {
    return useQuery({
        queryKey: ['requests'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('v_requests')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as Request[];
        },
    });
}

export function useRequestsByStage(stage: string) {
    const { data: requests, ...rest } = useRequests();
    return {
        data: requests?.filter(r => r.stage === stage) ?? [],
        ...rest,
    };
}

export function useCreateRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (request: RequestInsert) => {
            const { data, error } = await supabase
                .from('maintenance_requests')
                .insert(request)
                .select()
                .single();

            if (error) throw error;

            // Create notification for assigned technician
            if (data && request.technician_id) {
                await (supabase as any)
                    .from('notifications')
                    .insert({
                        user_id: request.technician_id,
                        title: 'New Assignment',
                        message: `You have been assigned to: ${request.subject}`,
                        type: 'assignment',
                        related_request_id: data.id,
                        is_read: false
                    });
            }

            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['requests'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
}

export function useUpdateRequestStage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, stage }: { id: string; stage: string }) => {
            const { data, error } = await supabase
                .from('maintenance_requests')
                .update({ stage: stage as 'new' | 'in_progress' | 'repaired' | 'scrap' })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['requests'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            queryClient.invalidateQueries({ queryKey: ['equipment'] });
        },
    });
}

export function useUpdateRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: { id: string;[key: string]: any }) => {
            const { data, error } = await supabase
                .from('maintenance_requests')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['requests'] });
        },
    });
}
