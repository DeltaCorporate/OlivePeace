import 'express';

declare module 'express-serve-static-core' {
    interface Request {
        user?: any;
    }

    interface Response {
        created?: any;
        error?: any;
        success?: any;
    }
}
