// src/services/auth.service.js - Authentication service
const { supabaseAdmin } = require('../config/supabase');
const { UnauthorizedError, NotFoundError } = require('../utils/errors');

// Login with email/password
const login = async (email, password) => {
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        throw new UnauthorizedError(error.message);
    }

    // Get user profile
    const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

    return {
        user: {
            id: data.user.id,
            email: data.user.email,
            ...profile
        },
        session: {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_at: data.session.expires_at
        }
    };
};

// Logout
const logout = async (token) => {
    const { error } = await supabaseAdmin.auth.admin.signOut(token);
    if (error) {
        console.error('Logout error:', error);
    }
    return true;
};

// Get user profile
const getProfile = async (userId) => {
    const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error || !data) {
        throw new NotFoundError('Profile not found');
    }

    return data;
};

module.exports = { login, logout, getProfile };
