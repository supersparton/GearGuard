// constants.js - Application constants

export const REQUEST_STAGES = {
    PENDING: 'pending',
    APPROVED: 'approved',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    REJECTED: 'rejected',
};

export const EQUIPMENT_STATUS = {
    AVAILABLE: 'available',
    IN_USE: 'in_use',
    MAINTENANCE: 'maintenance',
    RETIRED: 'retired',
};

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    REQUESTS: '/requests',
    EQUIPMENT: '/equipment',
    CALENDAR: '/calendar',
};

export const API_ENDPOINTS = {
    EQUIPMENT: 'equipment',
    REQUESTS: 'requests',
    USERS: 'users',
};
