import express from 'express';
import cors from 'cors';
import { logger } from './middlewares/logger.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { contactsRouter } from './routers/contactsRouters.js';
import  authRouter from './routers/auth.js';
import cookieParser from 'cookie-parser';


export const setupServer = () =>{
    const app = express();

    app.use(cors());
    app.use(cookieParser());
    app.use(express.json());
    app.use(logger);

   


    app.use("/auth", authRouter);
    app.use("/contacts", contactsRouter);

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
};


