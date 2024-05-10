import {config} from 'dotenv';
config();
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from './utils/logger.js';
import compression from 'compression';
import helmet from 'helmet';
import db from './sequelize/models/index.js';
import {mdb,mdb_connect} from "./mongoose/index.js";
import morganMiddleware from './middlewares/morgan.middleware.js';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
const app = express();

await mdb_connect();

try {
    await db.sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

db.sequelize.sync();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(morganMiddleware);

app.use('/', indexRouter);
app.use('/users', usersRouter);
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
app.use('/uploads', express.static('uploads'));


// Startup
app.listen(process.env.PORT, () => {
    logger.info('Server is running on port '+ process.env.PORT);
});
