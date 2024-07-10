// middleware/responseHandler.js
export function responseHandler(req, res, next) {
    res.success = function (data, message = '') {
        res.status(200).json({
            message,
            data,
        });
    };

    res.created = function (data, message = '') {
        res.status(201).json({
            message,
            data
        });
    };

    res.error = function (message, status = 400, errors = []) {
        res.status(status).json({
            message,
            data: null,
            errors
        });
    };

    next();
}
