// src/middleware/validate.middleware.js - Request validation

const { ValidationError } = require('../utils/errors');
const { isValidUUID } = require('../utils/helpers');
const { STAGES, PRIORITIES, REQUEST_TYPES, EQUIPMENT_STATUS } = require('../config/constants');

// Validate UUID parameter
const validateUUID = (paramName) => {
    return (req, res, next) => {
        const value = req.params[paramName];
        if (!value || !isValidUUID(value)) {
            return next(new ValidationError(`Invalid ${paramName}: must be a valid UUID`));
        }
        next();
    };
};

// Validate request body has required fields
const validateRequired = (...fields) => {
    return (req, res, next) => {
        const missing = fields.filter(field => !req.body[field]);
        if (missing.length > 0) {
            return next(new ValidationError(`Missing required fields: ${missing.join(', ')}`));
        }
        next();
    };
};

// Validate stage value
const validateStage = (req, res, next) => {
    const { stage } = req.body;
    if (stage && !STAGES.includes(stage)) {
        return next(new ValidationError(`Invalid stage. Must be one of: ${STAGES.join(', ')}`));
    }
    next();
};

// Validate priority value
const validatePriority = (req, res, next) => {
    const { priority } = req.body;
    if (priority && !PRIORITIES.includes(priority)) {
        return next(new ValidationError(`Invalid priority. Must be one of: ${PRIORITIES.join(', ')}`));
    }
    next();
};

// Validate request type
const validateRequestType = (req, res, next) => {
    const { request_type } = req.body;
    if (request_type && !REQUEST_TYPES.includes(request_type)) {
        return next(new ValidationError(`Invalid request_type. Must be one of: ${REQUEST_TYPES.join(', ')}`));
    }
    next();
};

// Validate equipment status
const validateEquipmentStatus = (req, res, next) => {
    const { status } = req.body;
    if (status && !EQUIPMENT_STATUS.includes(status)) {
        return next(new ValidationError(`Invalid status. Must be one of: ${EQUIPMENT_STATUS.join(', ')}`));
    }
    next();
};

// Validate that request targets either equipment or work center
const validateRequestTarget = (req, res, next) => {
    const { equipment_id, work_center_id } = req.body;
    if (!equipment_id && !work_center_id) {
        return next(new ValidationError('Request must be associated with either an Equipment or a Work Center'));
    }
    next();
};

module.exports = {
    validateUUID,
    validateRequired,
    validateStage,
    validatePriority,
    validateRequestType,
    validateEquipmentStatus,
    validateRequestTarget
};
