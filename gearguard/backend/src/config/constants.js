// src/config/constants.js - Application constants
module.exports = {
    // Request stages for Kanban
    STAGES: ['new', 'in_progress', 'repaired', 'scrap'],

    // Request types
    REQUEST_TYPES: ['corrective', 'preventive'],

    // Priority levels
    PRIORITIES: ['low', 'medium', 'high', 'critical'],

    // Equipment statuses
    EQUIPMENT_STATUS: ['active', 'under_maintenance', 'scrapped'],

    // User roles
    USER_ROLES: ['admin', 'manager', 'technician'],

    // Team member roles
    TEAM_ROLES: ['lead', 'technician'],

    // Pagination defaults
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100
};
