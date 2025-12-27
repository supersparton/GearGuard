import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Dashboard = Tables<'v_dashboard'>;
type RecentActivity = Tables<'v_recent_activity'>;

export function useDashboard() {
    return useQuery({
        queryKey: ['dashboard'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('v_dashboard')
                .select('*')
                .single();

            if (error) throw error;
            return data as Dashboard;
        },
    });
}

export function useRecentActivity(limit = 10) {
    return useQuery({
        queryKey: ['recent-activity', limit],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('v_recent_activity')
                .select('*')
                .limit(limit);

            if (error) throw error;
            return data as RecentActivity[];
        },
    });
}

export function useRecentRequests(limit = 5) {
    return useQuery({
        queryKey: ['recent-requests', limit],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('v_requests')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return data;
        },
    });
}
