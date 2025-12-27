// src/routes/equipment.routes.js - Equipment API routes
const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipment.controller');
const { requireManager, requireAdmin } = require('../middleware/auth.middleware');
const { validateUUID, validateRequired, validateEquipmentStatus } = require('../middleware/validate.middleware');

// GET /api/equipment - List all equipment
router.get('/', equipmentController.getAll);

// GET /api/equipment/:id - Get single equipment
router.get('/:id', validateUUID('id'), equipmentController.getById);

// GET /api/equipment/:id/defaults - Get equipment defaults for AUTO-FILL
router.get('/:id/defaults', validateUUID('id'), equipmentController.getDefaults);

// POST /api/equipment - Create equipment (admin/manager only)
router.post('/', requireManager, validateRequired('name', 'serial_number'), validateEquipmentStatus, equipmentController.create);

// PUT /api/equipment/:id - Update equipment (admin/manager only)
router.put('/:id', requireManager, validateUUID('id'), validateEquipmentStatus, equipmentController.update);

// DELETE /api/equipment/:id - Delete equipment (admin only)
router.delete('/:id', requireAdmin, validateUUID('id'), equipmentController.delete);

module.exports = router;
