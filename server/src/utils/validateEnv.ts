import { cleanEnv, str, port } from 'envalid';

function validateEnv(): void {
    cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ['development', 'production'],
        }),
        PORT: port({ default: 5000 }),
        JWT_ACCESS_SECRET: str(),
        JWT_REFRESH_SECRET: str(),
        JWT_ACCESS_SECRET_LIFETIME: str(),
        JWT_REFRESH_SECRET_LIFETIME: str(),
        JWT_REFRESH_SECRET_LIFETIME_COOKIE: str(),
        NODE_CRON_INTERVAL: str(),
        NOT_ACTIVATED_USER_LIFETIME: str(),
        PAYMENT_ATTEMPTS_LIFETIME: str(),
        FIRST_ADMIN_EMAIL: str(),
        MONGO_PATH: str(),
        MONGO_USER: str(),
        MONGODB_DB_CLOUD_NAME: str(),
        MONGODB_DB_TOOLS_FOLDERNAME: str(),
        MONGO_PASSWORD: str(),
        MONGO_URI: str(),
        STRIPE_SECRET_KEY: str(),
        MONGO_PATH_BACKUP: str(),
        CLIENT_URL: str(),
        ADMIN_URL: str(),
        SERVER_URL: str(),
        FIREBASE_API_KEY: str(),
        FIREBASE_AUTH_DOMAIN: str(),
        FIREBASE_PROJECT_ID: str(),
        FIREBASE_STORAGE_BUCKET: str(),
        FIREBASE_MESSAGING_SENDER_ID: str(),
        FIREBASE_APP_ID: str(),
        MAILER_SMPT_HOST: str(),
        MAILER_SMPT_PORT: str(),
        MAILER_SMPT_USER: str(),
        MAILER_SMPT_PASSWORD: str(),
        UPLOADED_FILES_FOLDER_NAME: str(),
        MONGODUMP_EXE: str(),
        MONGORESTORE_EXE: str(),
        BACKUP_MONGODB_FOLDER_NAME: str(),
        MONGODB_DB_NAME: str()

    });
}

export default validateEnv;
