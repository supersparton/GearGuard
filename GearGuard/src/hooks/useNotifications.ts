import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Notification {
    id: string;
    user_id: string;
    title: string;
    message: string;
    type: 'assignment' | 'update' | 'overdue' | 'info';
    is_read: boolean;
    related_request_id?: string;
    created_at: string;
}

export function useNotifications() {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['notifications', user?.id],
        queryFn: async () => {
            if (!user) return [];

            // Use 'any' cast because table may not exist in types yet
            const { data, error } = await (supabase as any)
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) {
                // Table might not exist yet
                console.log('Notifications not available:', error.message);
                return [];
            }
            return (data || []) as Notification[];
        },
        enabled: !!user,
        refetchInterval: 30000, // Refetch every 30 seconds
    });
}

export function useUnreadCount() {
    const { data: notifications = [] } = useNotifications();
    return notifications.filter(n => !n.is_read).length;
}

export function useMarkAsRead() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (notificationId: string) => {
            const { error } = await (supabase as any)
                .from('notifications')
                .update({ is_read: true })
                .eq('id', notificationId);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
        },
    });
}

export function useMarkAllAsRead() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async () => {
            if (!user) return;

            const { error } = await (supabase as any)
                .from('notifications')
                .update({ is_read: true })
                .eq('user_id', user.id)
                .eq('is_read', false);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
        },
    });
}

// Helper to create a notification
export async function createNotification({
    userId,
    title,
    message,
    type = 'info',
    relatedRequestId
}: {
    userId: string;
    title: string;
    message: string;
    type?: 'assignment' | 'update' | 'overdue' | 'info';
    relatedRequestId?: string;
}) {
    const { error } = await (supabase as any)
        .from('notifications')
        .insert({
            user_id: userId,
            title,
            message,
            type,
            related_request_id: relatedRequestId,
            is_read: false
        });

    if (error) {
        console.error('Error creating notification:', error);
    }
}
