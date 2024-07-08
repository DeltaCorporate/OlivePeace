class PromotionNotValidException extends Error {
    constructor(message) {
        super(message);
        this.name = 'PromotionNotValidException';
        this.message = message || 'La promotion n\'est pas valide.';
        Error.captureStackTrace(this, this.constructor);
    }
}