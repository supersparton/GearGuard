// src/controllers/workcenters.controller.js - Work Centers Controller
const workCentersService = require('../services/workcenters.service');
const { AppError } = require('../utils/errors');

class WorkCentersController {
    async getAll(req, res, next) {
        try {
            const workCenters = await workCentersService.getAll();
            res.json(workCenters);
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const workCenter = await workCentersService.getById(id);

            if (!workCenter) {
                throw new AppError('Work center not found', 404);
            }

            res.json(workCenter);
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const workCenter = await workCentersService.create(req.body);
            res.status(201).json(workCenter);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const workCenter = await workCentersService.update(id, req.body);
            res.json(workCenter);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await workCentersService.delete(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new WorkCentersController();
