// src/routes/index.js - Route aggregator
const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const equipmentRoutes = require('./equipment.routes');
const requestsRoutes = require('./requests.routes');
const dashboardRoutes = require('./dashboard.routes');
const teamsRoutes = require('./teams.routes');
const categoriesRoutes = require('./categories.routes');
const calendarRoutes = require('./calendar.routes');
const workCentersRoutes = require('./workcenters.routes');
const usersRoutes = require('./users.routes');

const { authenticate } = require('../middleware/auth.middleware');

// Public routes
router.use('/auth', authRoutes);

// Protected routes - require authentication
router.use('/equipment', authenticate, equipmentRoutes);
router.use('/requests', authenticate, requestsRoutes);
router.use('/dashboard', authenticate, dashboardRoutes);
router.use('/teams', authenticate, teamsRoutes);
router.use('/categories', authenticate, categoriesRoutes);
router.use('/calendar', authenticate, calendarRoutes);
router.use('/workcenters', authenticate, workCentersRoutes);
router.use('/users', authenticate, usersRoutes);

// API info
router.get('/', (req, res) => {
    res.json({
        name: 'GearGuard API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            equipment: '/api/equipment',
            requests: '/api/requests',
            dashboard: '/api/dashboard',
            teams: '/api/teams',
            categories: '/api/categories',
            calendar: '/api/calendar'
        }
    });
});

module.exports = router;
