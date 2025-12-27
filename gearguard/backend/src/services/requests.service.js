// src/services/requests.service.js - Maintenance Requests service
const { supabaseAdmin } = require('../config/supabase');
const { NotFoundError, ApiError } = require('../utils/errors');
const { STAGES } = require('../config/constants');

// Get all requests with filters
const getAll = async (filters = {}) => {
    let query = supabaseAdmin
        .from('v_requests')
        .select('*')
        .order('created_at', { ascending: false });

    if (filters.stage) {
        query = query.eq('stage', filters.stage);
    }
    if (filters.priority) {
        query = query.eq('priority', filters.priority);
    }
    if (filters.equipment_id) {
        query = query.eq('equipment_id', filters.equipment_id);
    }
    if (filters.request_type) {
        query = query.eq('request_type', filters.request_type);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Requests getAll error:', error);
        throw new ApiError(error.message);
    }

    return data || [];
};

// Get requests grouped by stage for Kanban board
const getKanban = async () => {
    const { data, error } = await supabaseAdmin
        .from('v_requests')
        .select('*')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Requests getKanban error:', error);
        throw new ApiError(error.message);
    }

    // Group by stage
    const kanbanData = {
        new: [],
        in_progress: [],
        repaired: [],
        scrap: []
    };

    (data || []).forEach(request => {
        const stage = request.stage || 'new';
        if (kanbanData[stage]) {
            kanbanData[stage].push(request);
        } else {
            kanbanData.new.push(request);
        }
    });

    return kanbanData;
};

// Get single request by ID
const getById = async (id) => {
    const { data, error } = await supabaseAdmin
        .from('v_requests')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            throw new NotFoundError('Request not found');
        }
        throw new ApiError(error.message);
    }

    return data;
};

// Create new request (auto-fills from equipment or work center if not provided)
const create = async (requestData) => {
    // Get equipment defaults if equipment_id is provided
    if (requestData.equipment_id && !requestData.maintenance_team_id) {
        const { data: equipment } = await supabaseAdmin
            .from('equipment')
            .select('category_id, maintenance_team_id, default_technician_id')
            .eq('id', requestData.equipment_id)
            .single();

        if (equipment) {
            requestData.category_id = requestData.category_id || equipment.category_id;
            requestData.maintenance_team_id = requestData.maintenance_team_id || equipment.maintenance_team_id;
            requestData.assigned_technician_id = requestData.assigned_technician_id || equipment.default_technician_id;
        }
    }
    // Get work center defaults if work_center_id is provided
    else if (requestData.work_center_id && !requestData.maintenance_team_id) {
        // Logic for auto-filling from work center could go here
        // For now, we utilize the ID provided
    }

    const insertData = {
        subject: requestData.subject,
        description: requestData.description,
        request_type: requestData.request_type || 'corrective',
        priority: requestData.priority || 'medium',
        stage: 'new',
        equipment_id: requestData.equipment_id,
        work_center_id: requestData.work_center_id,
        category_id: requestData.category_id,
        maintenance_team_id: requestData.maintenance_team_id,
        assigned_technician_id: requestData.assigned_technician_id,
        created_by: requestData.created_by,
        scheduled_date: requestData.scheduled_date,
        due_date: requestData.due_date
    };

    const { data, error } = await supabaseAdmin
        .from('maintenance_requests')
        .insert([insertData])
        .select()
        .single();

    if (error) {
        console.error('Request create error:', error);
        throw new ApiError(error.message);
    }

    return data;
};

// Update request
const update = async (id, updateData) => {
    const { id: _, created_at, request_number, ...safeData } = updateData;
    safeData.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
        .from('maintenance_requests')
        .update(safeData)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            throw new NotFoundError('Request not found');
        }
        throw new ApiError(error.message);
    }

    return data;
};

// Update request stage (for Kanban drag & drop)
const updateStage = async (id, newStage) => {
    const updateData = {
        stage: newStage,
        updated_at: new Date().toISOString()
    };

    // Set started_at when moving to in_progress
    if (newStage === 'in_progress') {
        const { data: current } = await supabaseAdmin
            .from('maintenance_requests')
            .select('started_at')
            .eq('id', id)
            .single();

        if (!current?.started_at) {
            updateData.started_at = new Date().toISOString();
        }
    }

    // Set completed_at when moving to repaired or scrap
    if (newStage === 'repaired' || newStage === 'scrap') {
        updateData.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin
        .from('maintenance_requests')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            throw new NotFoundError('Request not found');
        }
        throw new ApiError(error.message);
    }

    return data;
};

// Assign technician to request
const assignTechnician = async (id, technicianId) => {
    const { data, error } = await supabaseAdmin
        .from('maintenance_requests')
        .update({
            assigned_technician_id: technicianId,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            throw new NotFoundError('Request not found');
        }
        throw new ApiError(error.message);
    }

    return data;
};

// Delete request
const deleteRequest = async (id) => {
    const { error } = await supabaseAdmin
        .from('maintenance_requests')
        .delete()
        .eq('id', id);

    if (error) {
        throw new ApiError(error.message);
    }

    return true;
};

module.exports = {
    getAll,
    getKanban,
    getById,
    create,
    update,
    updateStage,
    assignTechnician,
    delete: deleteRequest
};
