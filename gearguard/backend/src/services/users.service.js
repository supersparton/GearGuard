// src/services/users.service.js
const { supabaseAdmin } = require('../config/supabase');

const getAll = async () => {
    // Get all profiles/users
    const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .order('first_name');

    if (error) {
        console.error('Error fetching users:', error);
        return [];
    }

    return data;
};

module.exports = { getAll };
