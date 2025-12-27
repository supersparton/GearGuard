// src/services/teams.service.js - Teams service
const { supabaseAdmin } = require('../config/supabase');
const { NotFoundError, ApiError } = require('../utils/errors');

// Get all active teams
const getAll = async () => {
    // Try v_teams view first
    const { data, error } = await supabaseAdmin
        .from('v_teams')
        .select('*')
        .eq('is_active', true)
        .order('name');

    if (error) {
        console.error('Teams view error:', error);

        // Fallback: query maintenance_teams directly
        const { data: fallbackData } = await supabaseAdmin
            .from('maintenance_teams')
            .select('*')
            .eq('is_active', true)
            .order('name');

        return fallbackData || [];
    }

    return data || [];
};

// Get single team by ID
const getById = async (id) => {
    const { data, error } = await supabaseAdmin
        .from('v_teams')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            throw new NotFoundError('Team not found');
        }

        // Fallback
        const { data: fallbackData } = await supabaseAdmin
            .from('maintenance_teams')
            .select('*')
            .eq('id', id)
            .single();

        if (!fallbackData) {
            throw new NotFoundError('Team not found');
        }
        return fallbackData;
    }

    return data;
};

// Get team members using database function
const getMembers = async (teamId) => {
    // Try RPC function first
    const { data, error } = await supabaseAdmin
        .rpc('get_team_members', { p_team_id: teamId });

    if (error) {
        console.error('get_team_members RPC error:', error);

        // Fallback: query team_members with profiles join
        const { data: fallbackData } = await supabaseAdmin
            .from('team_members')
            .select(`
                id,
                role,
                user:user_id (id, first_name, last_name, email)
            `)
            .eq('team_id', teamId);

        return (fallbackData || []).map(m => ({
            user_id: m.user?.id,
            first_name: m.user?.first_name,
            last_name: m.user?.last_name,
            full_name: `${m.user?.first_name || ''} ${m.user?.last_name || ''}`.trim(),
            email: m.user?.email,
            team_role: m.role
        }));
    }

    return data || [];
};

// Create new team
const create = async (data) => {
    const { name, description } = data;

    // Default to active
    const teamData = {
        name,
        description,
        is_active: true
    };

    const { data: team, error } = await supabaseAdmin
        .from('maintenance_teams')
        .insert(teamData)
        .select()
        .single();

    if (error) {
        throw new ApiError(500, `Failed to create team: ${error.message}`);
    }

    return team;
};

// Update team
const update = async (id, data) => {
    const { name, description } = data;

    const { data: team, error } = await supabaseAdmin
        .from('maintenance_teams')
        .update({ name, description })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        throw new ApiError(500, `Failed to update team: ${error.message}`);
    }

    return team;
};

// Delete team (Soft Delete)
const remove = async (id) => {
    const { error } = await supabaseAdmin
        .from('maintenance_teams')
        .update({ is_active: false })
        .eq('id', id);

    if (error) {
        throw new ApiError(500, `Failed to delete team: ${error.message}`);
    }

    return { id };
};

// Add member to team
const addMember = async (teamId, userId, role = 'technician') => {
    const { data, error } = await supabaseAdmin
        .from('team_members')
        .insert({
            team_id: teamId,
            user_id: userId,
            role: role
        })
        .select()
        .single();

    if (error) {
        // Handle duplicate constraint if needed
        if (error.code === '23505') { // unique_violation
            throw new ApiError(409, 'User is already a member of this team');
        }
        throw new ApiError(500, `Failed to add member: ${error.message}`);
    }

    return data;
};

// Remove member from team
const removeMember = async (teamId, userId) => {
    const { error } = await supabaseAdmin
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', userId);

    if (error) {
        throw new ApiError(500, `Failed to remove member: ${error.message}`);
    }

    return { teamId, userId };
};

module.exports = { getAll, getById, getMembers, create, update, remove, addMember, removeMember };
