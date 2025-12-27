// src/routes/categories.routes.js - Categories API routes
const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories.controller');

// GET /api/categories - List all active categories
router.get('/', categoriesController.getAll);

module.exports = router;
