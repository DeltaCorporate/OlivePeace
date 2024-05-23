// middleware/responseHandler.js
export function responseHandler(req, res, next) {
    res.success = function (data, message = '') {
        res.status(200).json({
            status: 'success',
            message,
            data
        });
    };

    res.created = function (data, message = '') {
        res.status(201).json({
            status: 'success',
            message,
            data
        });
    };

    res.error = function (message, status = 400) {
        res.status(status).json({
            status: 'error',
            message
        });
    };

    next();
}
