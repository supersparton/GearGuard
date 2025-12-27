// src/services/calendar.service.js - Calendar service
const { supabaseAdmin } = require('../config/supabase');
const { ApiError } = require('../utils/errors');

// Get calendar events with date range filter
const getEvents = async (filters = {}) => {
    // Query maintenance_requests directly to ensure we get all relevant data
    // tailored to the "Current Working Requests" requirement
    let query = supabaseAdmin
        .from('maintenance_requests')
        .select(`
            id,
            request_number,
            subject,
            description,
            request_type,
            priority,
            stage,
            scheduled_date,
            due_date,
            created_at,
            equipment:equipment_id (id, name),
            work_center:work_center_id (id, name)
        `)
        .not('stage', 'eq', 'scrap')
        .order('scheduled_date', { ascending: true, nullsFirst: false });

    // Apply filters if provided (mostly for optimization)
    // Note: We're lenient with dates to ensure we capture "Open" requests that might fall into the range based on created_at
    if (filters.start_date) {
        query = query.or(`scheduled_date.gte.${filters.start_date},due_date.gte.${filters.start_date},created_at.gte.${filters.start_date}`);
    }
    if (filters.end_date) {
        query = query.or(`scheduled_date.lte.${filters.end_date},due_date.lte.${filters.end_date},created_at.lte.${filters.end_date}`);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Calendar service error:', error);
        throw new ApiError(500, 'Failed to fetch calendar events');
    }

    // Transform to calendar event format
    return (data || []).map(r => {
        // Determine the effective date for the calendar
        // Priority: Scheduled Date -> Due Date -> Created Date
        const eventDate = r.scheduled_date || r.due_date || r.created_at;

        // Determine title prefix
        const targetName = r.equipment?.name || r.work_center?.name || 'General';

        return {
            id: r.id,
            request_number: r.request_number,
            title: r.subject, // Frontend EventBar uses this
            description: r.description,
            request_type: r.request_type,
            priority: r.priority,
            stage: r.stage,
            event_date: eventDate, // Critical for frontend filtering
            scheduled_date: r.scheduled_date,
            due_date: r.due_date,
            created_at: r.created_at,
            equipment_id: r.equipment?.id,
            equipment_name: targetName, // Mapped to equipment_name for frontend compatibility
            work_center_id: r.work_center?.id,
            is_preventive: r.request_type === 'preventive'
        };
    });
};

module.exports = { getEvents };
