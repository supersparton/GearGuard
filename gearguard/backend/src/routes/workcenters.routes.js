// src/routes/workcenters.routes.js - Work Centers API routes
const express = require('express');
const router = express.Router();
const workCentersController = require('../controllers/workcenters.controller');
const { requireManager } = require('../middleware/auth.middleware');
const { validateUUID, validateRequired } = require('../middleware/validate.middleware');

// GET /api/workcenters - List all work centers
router.get('/', workCentersController.getAll);

// GET /api/workcenters/:id - Get single work center
router.get('/:id', validateUUID('id'), workCentersController.getById);

// POST /api/workcenters - Create work center (manager only)
router.post('/', requireManager, validateRequired('name', 'code'), workCentersController.create);

// PUT /api/workcenters/:id - Update work center (manager only)
router.put('/:id', requireManager, validateUUID('id'), workCentersController.update);

// DELETE /api/workcenters/:id - Delete work center (manager only)
router.delete('/:id', requireManager, validateUUID('id'), workCentersController.delete);

module.exports = router;
