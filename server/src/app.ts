import express, { Application } from 'express';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import Controller from '@/utils/interfaces/controller.interface';
import ErrorMiddleware from '@/middleware/error.middleware';
import helmet from 'helmet';
import cookie from 'cookie-parser';
import CronDeleteInactiveUsers from '@/utils/scheduledFunctions/deleteInactiveUsers';
import CronDeleteOldPaymentAttempts from '@/utils/scheduledFunctions/deleteOldPaymentAttempts';

class App {
    public express: Application;
    public port: number;

    constructor(controllers: Controller[], port: number) {
        this.express = express();
        this.port = port;

        this.initialiseDatabaseConnection();
        this.initialiseMiddleware();
        this.initialiseControllers(controllers);
        this.initialiseErrorHandling();
        this.initialiseScheduledFunctions();
    }

    private initialiseMiddleware(): void {
        this.express.use(
            helmet({
                crossOriginResourcePolicy: false,
            })
        );
        this.express.use(
            cors({
                credentials: true,
                origin: [
                    `${process.env.CLIENT_URL}`,
                    `${process.env.ADMIN_URL}`,
                    `${process.env.SERVER_URL}`,
                    `${process.env.IOT_URL}`,
                ],
            })
        );
        this.express.use(morgan('dev'));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(compression());
        this.express.use(cookie());
        this.express.use(
            '/files',
            express.static(`./${process.env.UPLOADED_FILES_FOLDER_NAME}/files`)
        );
    }

    private initialiseControllers(controllers: Controller[]): void {
        controllers.forEach((controller: Controller) => {
            this.express.use('/api', controller.router);
        });
    }

    private initialiseErrorHandling(): void {
        this.express.use(ErrorMiddleware);
    }

    private initialiseDatabaseConnection(): void {
        const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH, MONGO_URI } =
            process.env;
        mongoose.connect(
            `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`
        );
        // mongoose.connect(`${MONGO_URI}`);
    }

    private initialiseScheduledFunctions(): void {
        CronDeleteInactiveUsers.deleteInactiveUsers();
        CronDeleteOldPaymentAttempts.deleteOldPaymentAttempts();
    }

    public listen(): void {
        this.express.listen(this.port, () => {
            console.log(`App listening on port ${this.port}`);
        });
    }
}

export default App;
