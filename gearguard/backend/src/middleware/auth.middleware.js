// src/middleware/auth.middleware.js - Authentication & Authorization

const { supabaseAdmin } = require('../config/supabase');
const { UnauthorizedError, ForbiddenError } = require('../utils/errors');

// Authenticate user from Bearer token
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('No token provided');
        }

        const token = authHeader.split(' ')[1];

        // Verify token with Supabase
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

        if (error || !user) {
            throw new UnauthorizedError('Invalid or expired token');
        }

        // Get user profile
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError) {
            console.error('Error fetching profile:', profileError);
            // Profile might not exist yet, create basic info from auth user
            req.user = {
                id: user.id,
                email: user.email,
                role: 'technician' // Default role
            };
        } else {
            req.user = {
                id: user.id,
                email: user.email,
                ...profile
            };
        }

        req.token = token;
        next();
    } catch (error) {
        next(error);
    }
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }

        const token = authHeader.split(' ')[1];
        const { data: { user } } = await supabaseAdmin.auth.getUser(token);

        if (user) {
            const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            req.user = { id: user.id, email: user.email, ...profile };
            req.token = token;
        }

        next();
    } catch (error) {
        // Ignore auth errors for optional auth
        next();
    }
};

// Require specific roles
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new UnauthorizedError('Authentication required'));
        }

        const userRole = req.user.role || 'technician';

        if (!roles.includes(userRole)) {
            return next(new ForbiddenError(`Role ${userRole} is not authorized. Required: ${roles.join(' or ')}`));
        }

        next();
    };
};

// Convenience middleware for common role checks
const requireAdmin = requireRole('admin');
const requireManager = requireRole('admin', 'manager');
const requireTechnician = requireRole('admin', 'manager', 'technician');

module.exports = {
    authenticate,
    optionalAuth,
    requireRole,
    requireAdmin,
    requireManager,
    requireTechnician
};
