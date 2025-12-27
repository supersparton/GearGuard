// src/config/supabase.js - Supabase client configuration
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Validate required environment variables
if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co') {
    console.error('❌ SUPABASE_URL is not set or still has placeholder value');
}
if (!supabaseServiceKey || supabaseServiceKey === 'your-service-role-key') {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set or still has placeholder value');
}

// Create clients only if we have valid credentials
let supabaseAdmin = null;
let supabasePublic = null;

if (supabaseUrl && supabaseServiceKey && supabaseUrl !== 'https://your-project.supabase.co') {
    // Admin client - Bypasses RLS, use for server-side operations
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    // Public client - Uses anon key or service key
    supabasePublic = createClient(supabaseUrl, supabaseAnonKey || supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    console.log('✅ Supabase clients initialized successfully');
} else {
    console.error('⚠️ Supabase clients not initialized - check your .env file');
}

// Create user-specific client with access token
const createUserClient = (accessToken) => {
    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Supabase not configured');
    }
    return createClient(supabaseUrl, supabaseAnonKey || supabaseServiceKey, {
        global: {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    });
};

module.exports = {
    supabaseAdmin,
    supabasePublic,
    createUserClient
};
