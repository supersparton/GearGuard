// src/controllers/categories.controller.js - Categories controller
const categoriesService = require('../services/categories.service');
const { successResponse } = require('../utils/response');

// GET /api/categories
const getAll = async (req, res, next) => {
    try {
        const categories = await categoriesService.getAll();
        successResponse(res, categories, 'Categories retrieved');
    } catch (error) {
        next(error);
    }
};

module.exports = { getAll };
