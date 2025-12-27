// src/controllers/users.controller.js
const usersService = require('../services/users.service');
const { successResponse } = require('../utils/response');

const getAll = async (req, res, next) => {
    try {
        const users = await usersService.getAll();
        successResponse(res, users, 'Users retrieved');
    } catch (error) {
        next(error);
    }
};

module.exports = { getAll };
