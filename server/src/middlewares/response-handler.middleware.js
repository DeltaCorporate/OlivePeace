// middleware/responseHandler.js
export function responseHandler(req, res, next) {
    res.success = function (data = {}, message = '') {
        res.status(200).json(
            data
        );
    };

    res.created = function (data, message = '') {
        res.status(201).json(data);
    };

    res.error = function (message, status = 400, errors = []) {
        res.status(status).json(errors);
    };
    next();
}
