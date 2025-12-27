import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type CalendarEvent = Tables<'v_calendar'>;
type Team = Tables<'v_teams'>;

export function useCalendarEvents() {
    return useQuery({
        queryKey: ['calendar'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('v_calendar')
                .select('*')
                .order('event_date');

            if (error) throw error;
            return data as CalendarEvent[];
        },
    });
}

export function useTeams() {
    return useQuery({
        queryKey: ['teams'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('v_teams')
                .select('*')
                .eq('is_active', true)
                .order('name');

            if (error) throw error;
            return data as Team[];
        },
    });
}

export function useCreateTeam() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ name, description }: { name: string; description?: string }) => {
            const { data, error } = await supabase
                .from('maintenance_teams')
                .insert({ name, description })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teams'] });
        },
    });
}

export function useTeamMembers(teamId: string | null) {
    return useQuery({
        queryKey: ['team-members', teamId],
        queryFn: async () => {
            if (!teamId) return [];

            const { data, error } = await supabase
                .rpc('get_team_members', { p_team_id: teamId });

            if (error) throw error;
            return data ?? [];
        },
        enabled: !!teamId,
    });
}

export function useCategories() {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .eq('is_active', true)
                .order('sort_order');

            if (error) throw error;
            return data;
        },
    });
}

export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ name, icon, color, description }: { name: string; icon?: string; color?: string; description?: string }) => {
            const { data, error } = await supabase
                .from('categories')
                .insert({ name, icon, color, description })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
}
