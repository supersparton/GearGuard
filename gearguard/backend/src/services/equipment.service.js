// src/services/equipment.service.js - Equipment service
const { supabaseAdmin } = require('../config/supabase');
const { NotFoundError, ApiError } = require('../utils/errors');

// Get all equipment with filters
const getAll = async (filters = {}) => {
    let query = supabaseAdmin
        .from('v_equipment')
        .select('*')
        .order('name');

    // Search filter (name or serial_number)
    if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,serial_number.ilike.%${filters.search}%`);
    }

    // Status filter
    if (filters.status) {
        query = query.eq('status', filters.status);
    }

    // Category filter
    if (filters.category_id) {
        query = query.eq('category_id', filters.category_id);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Equipment getAll error:', error);
        throw new ApiError(error.message);
    }

    return data || [];
};

// Get single equipment by ID
const getById = async (id) => {
    const { data, error } = await supabaseAdmin
        .from('v_equipment')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            throw new NotFoundError('Equipment not found');
        }
        throw new ApiError(error.message);
    }

    return data;
};

// Get equipment defaults for AUTO-FILL feature
const getDefaults = async (equipmentId) => {
    // Try to use the database function first
    const { data, error } = await supabaseAdmin
        .rpc('get_equipment_defaults', { p_equipment_id: equipmentId });

    if (error) {
        console.error('get_equipment_defaults RPC error:', error);

        // Fallback: query equipment directly
        const { data: equipment, error: eqError } = await supabaseAdmin
            .from('equipment')
            .select(`
                category_id,
                maintenance_team_id,
                default_technician_id
            `)
            .eq('id', equipmentId)
            .single();

        if (eqError) {
            throw new NotFoundError('Equipment not found');
        }

        return equipment;
    }

    return data?.[0] || null;
};

// Create equipment
const create = async (equipmentData) => {
    const { data, error } = await supabaseAdmin
        .from('equipment')
        .insert([equipmentData])
        .select()
        .single();

    if (error) {
        console.error('Equipment create error:', error);
        throw new ApiError(error.message);
    }

    return data;
};

// Update equipment
const update = async (id, updateData) => {
    const { id: _, created_at, ...safeData } = updateData;
    safeData.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
        .from('equipment')
        .update(safeData)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            throw new NotFoundError('Equipment not found');
        }
        throw new ApiError(error.message);
    }

    return data;
};

// Delete equipment
const deleteEquipment = async (id) => {
    const { error } = await supabaseAdmin
        .from('equipment')
        .delete()
        .eq('id', id);

    if (error) {
        throw new ApiError(error.message);
    }

    return true;
};

module.exports = {
    getAll,
    getById,
    getDefaults,
    create,
    update,
    delete: deleteEquipment
};
