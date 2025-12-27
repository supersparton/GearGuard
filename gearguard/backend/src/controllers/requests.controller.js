// src/controllers/requests.controller.js - Maintenance Requests controller
const requestsService = require('../services/requests.service');
const { successResponse, createdResponse, noContentResponse } = require('../utils/response');

// GET /api/requests
const getAll = async (req, res, next) => {
    try {
        const { stage, priority, equipment_id, request_type } = req.query;
        const requests = await requestsService.getAll({ stage, priority, equipment_id, request_type });

        successResponse(res, requests, 'Requests retrieved');
    } catch (error) {
        next(error);
    }
};

// GET /api/requests/kanban
const getKanban = async (req, res, next) => {
    try {
        const kanbanData = await requestsService.getKanban();
        successResponse(res, kanbanData, 'Kanban data retrieved');
    } catch (error) {
        next(error);
    }
};

// GET /api/requests/:id
const getById = async (req, res, next) => {
    try {
        const request = await requestsService.getById(req.params.id);
        successResponse(res, request, 'Request retrieved');
    } catch (error) {
        next(error);
    }
};

// POST /api/requests
const create = async (req, res, next) => {
    try {
        const requestData = {
            ...req.body,
            created_by: req.user.id
        };
        const request = await requestsService.create(requestData);
        createdResponse(res, request, 'Request created');
    } catch (error) {
        next(error);
    }
};

// PUT /api/requests/:id
const update = async (req, res, next) => {
    try {
        const request = await requestsService.update(req.params.id, req.body);
        successResponse(res, request, 'Request updated');
    } catch (error) {
        next(error);
    }
};

// PATCH /api/requests/:id/stage
const updateStage = async (req, res, next) => {
    try {
        const { stage } = req.body;
        const request = await requestsService.updateStage(req.params.id, stage);
        successResponse(res, request, `Request moved to ${stage}`);
    } catch (error) {
        next(error);
    }
};

// PATCH /api/requests/:id/assign
const assignTechnician = async (req, res, next) => {
    try {
        const { technician_id } = req.body;
        const request = await requestsService.assignTechnician(req.params.id, technician_id);
        successResponse(res, request, 'Technician assigned');
    } catch (error) {
        next(error);
    }
};

// DELETE /api/requests/:id
const deleteRequest = async (req, res, next) => {
    try {
        await requestsService.delete(req.params.id);
        noContentResponse(res, 'Request deleted');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAll,
    getKanban,
    getById,
    create,
    update,
    updateStage,
    assignTechnician,
    delete: deleteRequest
};
