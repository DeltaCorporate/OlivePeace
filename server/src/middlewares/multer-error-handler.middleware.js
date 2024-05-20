import multer from "multer";

export const multerErrorHandlerMiddleware = (err, req, res, next) => {
    if (err)
        return res.status(400).json({ message: err.message });
    next();
};
