import {config} from 'dotenv';
config();
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from './utils/logger.util.js';
import compression from 'compression';
import helmet from 'helmet';
import db from './sequelize/models/index.js';
import cors from 'cors';
import {mdb_connect} from "./mongoose/index.js";
import morganMiddleware from './middlewares/morgan.middleware.js';
import indexRouter from './routes/index.route.js';
import adminProductCategoriesRouter from './routes/admin/product-categories.route.js';
import productCategoriesRouter from './routes/product-categories.route.js';
import adminPromotionRouter from './routes/admin/promotion.route.js';
import productRouter from './routes/product.route.js';
import cartRouter from './routes/cart.route.js';
import {responseHandler} from "./middlewares/response-handler.middleware.js";
import {__root} from "#config/filePath.js";
import authRoute from "#app/src/routes/auth.route.js";
import adminProductRouter from "#app/src/routes/admin/product.route.js";
import statsRouter from "#app/src/routes/stats.route.js";
import './scheduler.js';
import usersRoute from "#app/src/routes/admin/users.route.js";
import {checkRole, isAdmin, isAuthenticated} from "#app/src/middlewares/auth.middleware.js";
import dashboardLayoutsRoute from "#app/src/routes/dashboard-layouts.route.js";
import orderRoute from "#app/src/routes/order.route.js";
const app = express();
await mdb_connect();
try {
    await db.sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}


db.sequelize.sync();
app.use(helmet({
    crossOriginResourcePolicy: false,
}));
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: '*'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(morganMiddleware);
app.use(responseHandler);
app.use('/uploads', express.static(__root+'/src/uploads'));
app.use('/', indexRouter);
app.use('/auth', authRoute);
app.use('/products', productRouter);
app.use('/product_categories', productCategoriesRouter);
app.use('/admin',isAuthenticated, isAdmin);
app.use('/admin/products',adminProductRouter);
app.use('/admin/product_categories', adminProductCategoriesRouter);
app.use('/admin/promotions', adminPromotionRouter);
app.use('/admin/users',usersRoute);
app.use('/stats',isAuthenticated, isAdmin, statsRouter);
app.use('cart', isAuthenticated,cartRouter);
app.use('/config',isAuthenticated,checkRole(['ROLE_ADMIN','ROLE_STORE_KEEPER']));
app.use('/config',dashboardLayoutsRoute);
app.use('/orders',isAuthenticated,orderRoute)
app.use(function(req, res, next) {
    logger.error("404 Not Found")
    res.status(404).send({});
});

app.listen(3000, () => {
    logger.info('Server is running on port '+ 3000);
});
