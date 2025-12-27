// src/utils/helpers.js - Utility functions

// Check if value is a valid UUID
const isValidUUID = (value) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
};

// Remove undefined/null values from object
const cleanObject = (obj) => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            acc[key] = value;
        }
        return acc;
    }, {});
};

// Parse pagination params from query
const parsePagination = (query, defaults = { page: 1, pageSize: 20 }) => {
    const page = Math.max(1, parseInt(query.page) || defaults.page);
    const pageSize = Math.min(100, Math.max(1, parseInt(query.pageSize) || defaults.pageSize));
    const offset = (page - 1) * pageSize;

    return { page, pageSize, offset };
};

// Format date to ISO string date only
const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toISOString().split('T')[0];
};

module.exports = {
    isValidUUID,
    cleanObject,
    parsePagination,
    formatDate
};
