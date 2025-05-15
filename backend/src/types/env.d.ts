declare namespace NodeJS {
    interface ProcessEnv {
        MONGODB_URL: string;
        DB_NAME: string;
        PORT?: string;
    }
}