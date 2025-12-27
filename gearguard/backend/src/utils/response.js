// src/utils/response.js - Standard API response helpers

const successResponse = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

const createdResponse = (res, data, message = 'Created successfully') => {
    return successResponse(res, data, message, 201);
};

const paginatedResponse = (res, data, pagination, message = 'Success') => {
    return res.status(200).json({
        success: true,
        message,
        data,
        pagination: {
            page: pagination.page,
            pageSize: pagination.pageSize,
            total: pagination.total,
            totalPages: Math.ceil(pagination.total / pagination.pageSize)
        }
    });
};

const noContentResponse = (res, message = 'Deleted successfully') => {
    return res.status(200).json({
        success: true,
        message
    });
};

module.exports = {
    successResponse,
    createdResponse,
    paginatedResponse,
    noContentResponse
};
