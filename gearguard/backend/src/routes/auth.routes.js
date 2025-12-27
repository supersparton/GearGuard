// src/routes/auth.routes.js - Authentication routes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validateRequired } = require('../middleware/validate.middleware');

// POST /api/auth/login - Login with email/password
router.post('/login', validateRequired('email', 'password'), authController.login);

// POST /api/auth/logout - Logout user
router.post('/logout', authenticate, authController.logout);

// GET /api/auth/me - Get current user profile
router.get('/me', authenticate, authController.getMe);

module.exports = router;
