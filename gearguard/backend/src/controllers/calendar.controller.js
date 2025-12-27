// src/controllers/calendar.controller.js - Calendar controller
const calendarService = require('../services/calendar.service');
const { successResponse } = require('../utils/response');

// GET /api/calendar/events
const getEvents = async (req, res, next) => {
    try {
        const { start_date, end_date } = req.query;
        const events = await calendarService.getEvents({ start_date, end_date });
        successResponse(res, events, 'Calendar events retrieved');
    } catch (error) {
        next(error);
    }
};

module.exports = { getEvents };
