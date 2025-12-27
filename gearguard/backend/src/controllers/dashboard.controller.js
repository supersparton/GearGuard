// src/controllers/dashboard.controller.js - Dashboard controller
const dashboardService = require('../services/dashboard.service');
const { successResponse } = require('../utils/response');

// GET /api/dashboard/stats
const getStats = async (req, res, next) => {
    try {
        const stats = await dashboardService.getStats();
        successResponse(res, stats, 'Dashboard stats retrieved');
    } catch (error) {
        next(error);
    }
};

// GET /api/dashboard/recent
const getRecentActivity = async (req, res, next) => {
    try {
        const activity = await dashboardService.getRecentActivity();
        successResponse(res, activity, 'Recent activity retrieved');
    } catch (error) {
        next(error);
    }
};

module.exports = { getStats, getRecentActivity };
