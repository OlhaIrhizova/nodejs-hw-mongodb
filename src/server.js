import express from 'express';
import cors from 'cors';
import { logger } from './middlewares/logger.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { contactsRouter } from './routers/contactsRouters.js';


export const setupServer = () =>{
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(logger);

    app.use("/contacts", contactsRouter);

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
};


