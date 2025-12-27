// src/routes/calendar.routes.js - Calendar API routes
const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendar.controller');

// GET /api/calendar/events - Get calendar events
router.get('/events', calendarController.getEvents);

module.exports = router;
