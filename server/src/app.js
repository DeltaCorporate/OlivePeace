import {config} from 'dotenv';
config();
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from './utils/logger.js';
import compression from 'compression';
import helmet from 'helmet';
import morganMiddleware from './middlewares/morgan.middleware.js';


import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import cartRouter from './routes/cart.js';


const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(morganMiddleware);


app.use('/', indexRouter);
app.use('/users', usersRouter);
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
