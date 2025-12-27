// src/controllers/auth.controller.js - Authentication controller
const authService = require('../services/auth.service');
const { successResponse } = require('../utils/response');

// POST /api/auth/login
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);

        successResponse(res, result, 'Login successful');
    } catch (error) {
        next(error);
    }
};

// POST /api/auth/logout
const logout = async (req, res, next) => {
    try {
        await authService.logout(req.token);
        successResponse(res, null, 'Logout successful');
    } catch (error) {
        next(error);
    }
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
    try {
        const profile = await authService.getProfile(req.user.id);
        successResponse(res, profile, 'Profile retrieved');
    } catch (error) {
        next(error);
    }
};

module.exports = { login, logout, getMe };
