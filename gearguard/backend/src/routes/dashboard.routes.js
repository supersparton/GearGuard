// src/routes/dashboard.routes.js - Dashboard API routes
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');

// GET /api/dashboard/stats - Get all dashboard statistics
router.get('/stats', dashboardController.getStats);

// GET /api/dashboard/recent - Get recent activity
router.get('/recent', dashboardController.getRecentActivity);

module.exports = router;
