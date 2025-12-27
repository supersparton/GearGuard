// src/middleware/error.middleware.js - Global error handling

const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err.message);

    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack);
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        error: {
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};

const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        error: {
            message: `Route ${req.method} ${req.originalUrl} not found`
        }
    });
};

module.exports = { errorHandler, notFoundHandler };
