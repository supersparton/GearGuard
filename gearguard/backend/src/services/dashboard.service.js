// src/services/dashboard.service.js - Dashboard service
const { supabaseAdmin } = require('../config/supabase');
const { ApiError } = require('../utils/errors');

// Get dashboard statistics from v_dashboard view
const getStats = async () => {
    // Try to get from v_dashboard view first
    const { data, error } = await supabaseAdmin
        .from('v_dashboard')
        .select('*')
        .single();

    if (error) {
        console.error('Dashboard view error:', error);

        // Fallback: calculate stats manually
        return await calculateStatsManually();
    }

    return data;
};

// Fallback: Calculate stats manually if view doesn't exist
const calculateStatsManually = async () => {
    // Get equipment counts
    const { data: equipment } = await supabaseAdmin
        .from('equipment')
        .select('status');

    // Get request counts
    const { data: requests } = await supabaseAdmin
        .from('maintenance_requests')
        .select('stage, priority, request_type, due_date');

    const today = new Date().toISOString().split('T')[0];

    return {
        total_equipment: equipment?.length || 0,
        active_equipment: equipment?.filter(e => e.status === 'active').length || 0,
        under_maintenance_equipment: equipment?.filter(e => e.status === 'under_maintenance').length || 0,
        scrapped_equipment: equipment?.filter(e => e.status === 'scrapped').length || 0,

        total_requests: requests?.length || 0,
        new_requests: requests?.filter(r => r.stage === 'new').length || 0,
        in_progress_requests: requests?.filter(r => r.stage === 'in_progress').length || 0,
        repaired_requests: requests?.filter(r => r.stage === 'repaired').length || 0,
        scrap_requests: requests?.filter(r => r.stage === 'scrap').length || 0,
        open_requests: requests?.filter(r => ['new', 'in_progress'].includes(r.stage)).length || 0,
        overdue_requests: requests?.filter(r =>
            ['new', 'in_progress'].includes(r.stage) &&
            r.due_date &&
            r.due_date < today
        ).length || 0,

        corrective_requests: requests?.filter(r => r.request_type === 'corrective').length || 0,
        preventive_requests: requests?.filter(r => r.request_type === 'preventive').length || 0,

        critical_open: requests?.filter(r =>
            ['new', 'in_progress'].includes(r.stage) && r.priority === 'critical'
        ).length || 0,
        high_open: requests?.filter(r =>
            ['new', 'in_progress'].includes(r.stage) && r.priority === 'high'
        ).length || 0
    };
};

// Get recent activity
const getRecentActivity = async () => {
    // Try v_recent_activity view first
    const { data, error } = await supabaseAdmin
        .from('v_recent_activity')
        .select('*')
        .order('performed_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error('Recent activity view error:', error);

        // Fallback: query activity_log directly
        const { data: fallbackData } = await supabaseAdmin
            .from('activity_log')
            .select('*')
            .order('performed_at', { ascending: false })
            .limit(10);

        return fallbackData || [];
    }

    return data || [];
};

module.exports = { getStats, getRecentActivity };
