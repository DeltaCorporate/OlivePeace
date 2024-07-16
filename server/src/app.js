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
import usersRouter from './routes/users.route.js';
import adminProductCategoriesRouter from './routes/admin/product-categories.route.js';
import productCategoriesRouter from './routes/product-categories.route.js';
import adminPromotionRouter from './routes/admin/promotion.route.js';
import productRouter from './routes/product.route.js';
import cartRouter from './routes/cart.route.js';
import {responseHandler} from "./middlewares/response-handler.middleware.js";
import {__root} from "#config/filePath.js";
import authRoute from "#app/src/routes/auth.route.js";
import scheduler from '/scheduler';
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
    origin: process.env.CLIENT_URL, // variable environnement CLIENT_URL sur le .env
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
app.use('/admin/product_categories', adminProductCategoriesRouter);
app.use('/admin/promotions', adminPromotionRouter);
app.use('cart', cartRouter);

app.use(function(req, res, next) {
    logger.error("404 Not Found")
    res.status(404).send({
        status: 404,
        message: "The requested resource was not found"
    });
});

app.get("/status", (req, res) => {
    logger.info("Checking the API status: Everything is OK");
    res.status(200).send({
        status: "UP",
        message: "The API is up and running!"
    });
});


// Startup
app.listen(process.env.PORT, () => {
    logger.info('Server is running on port '+ process.env.PORT);
});
