// src/controllers/equipment.controller.js - Equipment controller
const equipmentService = require('../services/equipment.service');
const { successResponse, createdResponse, noContentResponse } = require('../utils/response');

// GET /api/equipment
const getAll = async (req, res, next) => {
    try {
        const { search, status, category_id } = req.query;
        const equipment = await equipmentService.getAll({ search, status, category_id });

        successResponse(res, equipment, 'Equipment retrieved');
    } catch (error) {
        next(error);
    }
};

// GET /api/equipment/:id
const getById = async (req, res, next) => {
    try {
        const equipment = await equipmentService.getById(req.params.id);
        successResponse(res, equipment, 'Equipment retrieved');
    } catch (error) {
        next(error);
    }
};

// GET /api/equipment/:id/defaults - AUTO-FILL feature
const getDefaults = async (req, res, next) => {
    try {
        const defaults = await equipmentService.getDefaults(req.params.id);
        successResponse(res, defaults, 'Equipment defaults retrieved');
    } catch (error) {
        next(error);
    }
};

// POST /api/equipment
const create = async (req, res, next) => {
    try {
        const equipment = await equipmentService.create(req.body);
        createdResponse(res, equipment, 'Equipment created');
    } catch (error) {
        next(error);
    }
};

// PUT /api/equipment/:id
const update = async (req, res, next) => {
    try {
        const equipment = await equipmentService.update(req.params.id, req.body);
        successResponse(res, equipment, 'Equipment updated');
    } catch (error) {
        next(error);
    }
};

// DELETE /api/equipment/:id
const deleteEquipment = async (req, res, next) => {
    try {
        await equipmentService.delete(req.params.id);
        noContentResponse(res, 'Equipment deleted');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAll,
    getById,
    getDefaults,
    create,
    update,
    delete: deleteEquipment
};
