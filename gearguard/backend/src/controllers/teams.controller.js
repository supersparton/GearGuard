// src/controllers/teams.controller.js - Teams controller
const teamsService = require('../services/teams.service');
const { successResponse } = require('../utils/response');

// GET /api/teams
const getAll = async (req, res, next) => {
    try {
        const teams = await teamsService.getAll();
        successResponse(res, teams, 'Teams retrieved');
    } catch (error) {
        next(error);
    }
};

// GET /api/teams/:id
const getById = async (req, res, next) => {
    try {
        const team = await teamsService.getById(req.params.id);
        successResponse(res, team, 'Team retrieved');
    } catch (error) {
        next(error);
    }
};

// GET /api/teams/:id/members
const getMembers = async (req, res, next) => {
    try {
        const members = await teamsService.getMembers(req.params.id);
        successResponse(res, members, 'Team members retrieved');
    } catch (error) {
        next(error);
    }
};

// POST /api/teams
const create = async (req, res, next) => {
    try {
        const team = await teamsService.create(req.body);
        successResponse(res, team, 'Team created successfully', 201);
    } catch (error) {
        next(error);
    }
};

// PUT /api/teams/:id
const update = async (req, res, next) => {
    try {
        const team = await teamsService.update(req.params.id, req.body);
        successResponse(res, team, 'Team updated successfully');
    } catch (error) {
        next(error);
    }
};

// DELETE /api/teams/:id
const remove = async (req, res, next) => {
    try {
        await teamsService.remove(req.params.id);
        successResponse(res, null, 'Team deleted successfully');
    } catch (error) {
        next(error);
    }
};

// POST /api/teams/:id/members
const addMember = async (req, res, next) => {
    try {
        const { userId, role } = req.body;
        const result = await teamsService.addMember(req.params.id, userId, role);
        successResponse(res, result, 'Member added successfully', 201);
    } catch (error) {
        next(error);
    }
};

// DELETE /api/teams/:id/members/:userId
const removeMember = async (req, res, next) => {
    try {
        await teamsService.removeMember(req.params.id, req.params.userId);
        successResponse(res, null, 'Member removed successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = { getAll, getById, getMembers, create, update, remove, addMember, removeMember };
