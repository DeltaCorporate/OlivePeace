import jwt from 'jsonwebtoken';

export const isAuthenticated = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.error('', 401, { message: 'Token manquant' });

    const token = authHeader.split(' ')[1];
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET, { algorithm: 'HS256' });
        next();
    } catch (error) {
        return res.error('', 401, { message: 'Token invalide' });
    }
};

export const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) return res.error('', 401, { message: 'Token invalide' });

        const hasRole = roles.some(role => req.user.roles.includes(role));
        if (!hasRole)
            return res.error('', 403, { message: 'Action non autorisée' });

        next();
    };
};

export const isAdmin = (req,res,next) => {
    checkRole(['ROLE_ADMIN'])(req,res,next);
}

export const checkUserId = (userId) => {
    return async (req, res, next) => {
        if (req.user.id !== userId) {
            checkRole(['ROLE_ADMIN']);
        }
        next();
    };
};