// src/routes/teams.routes.js - Teams API routes
const express = require('express');
const router = express.Router();
const teamsController = require('../controllers/teams.controller');
const { validateUUID } = require('../middleware/validate.middleware');

// GET /api/teams - List all active teams
router.get('/', teamsController.getAll);

// GET /api/teams/:id - Get single team
router.get('/:id', validateUUID('id'), teamsController.getById);

// GET /api/teams/:id/members - Get team members
router.get('/:id/members', validateUUID('id'), teamsController.getMembers);

// POST /api/teams - Create new team
// POST /api/teams - Create new team
router.post('/', teamsController.create);

// PUT /api/teams/:id - Update team
router.put('/:id', validateUUID('id'), teamsController.update);

// DELETE /api/teams/:id - Delete team
router.delete('/:id', validateUUID('id'), teamsController.remove);

// POST /api/teams/:id/members - Add member
router.post('/:id/members', validateUUID('id'), teamsController.addMember);

// DELETE /api/teams/:id/members/:userId - Remove member
router.delete('/:id/members/:userId', validateUUID('id'), teamsController.removeMember);

module.exports = router;
