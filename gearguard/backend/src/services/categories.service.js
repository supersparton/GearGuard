// src/services/categories.service.js - Categories service
const { supabaseAdmin } = require('../config/supabase');
const { ApiError } = require('../utils/errors');

// Get all active categories
const getAll = async () => {
    const { data, error } = await supabaseAdmin
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')
        .order('name');

    if (error) {
        console.error('Categories getAll error:', error);
        throw new ApiError(error.message);
    }

    return data || [];
};

module.exports = { getAll };
