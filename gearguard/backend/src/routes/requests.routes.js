// src/routes/requests.routes.js - Maintenance Requests API routes
const express = require('express');
const router = express.Router();
const requestsController = require('../controllers/requests.controller');
const { validateUUID, validateRequired, validateStage, validatePriority, validateRequestType, validateRequestTarget } = require('../middleware/validate.middleware');

// GET /api/requests - List all requests
router.get('/', requestsController.getAll);

// GET /api/requests/kanban - Get requests grouped by stage for Kanban board
router.get('/kanban', requestsController.getKanban);

// GET /api/requests/:id - Get single request
router.get('/:id', validateUUID('id'), requestsController.getById);

// POST /api/requests - Create request (auto-fills from equipment defaults)
router.post('/', validateRequired('subject'), validateRequestTarget, validatePriority, validateRequestType, requestsController.create);

// PUT /api/requests/:id - Update request
router.put('/:id', validateUUID('id'), validateStage, validatePriority, requestsController.update);

// PATCH /api/requests/:id/stage - Update stage only (for Kanban drag-drop)
router.patch('/:id/stage', validateUUID('id'), validateRequired('stage'), validateStage, requestsController.updateStage);

// PATCH /api/requests/:id/assign - Assign technician to request
router.patch('/:id/assign', validateUUID('id'), requestsController.assignTechnician);

// DELETE /api/requests/:id - Delete request
router.delete('/:id', validateUUID('id'), requestsController.delete);

module.exports = router;
