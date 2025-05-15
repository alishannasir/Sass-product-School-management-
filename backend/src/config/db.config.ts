import chalk from "chalk";
import mongoose from "mongoose";
import CustomError from "../utils/CustomError.js";

async function connectDB() {
    const MONGODB_URL = process.env.MONGODB_URL;
    console.log(chalk.red.bold.bgGreen.underline.italic(`MongoDB URL is ${MONGODB_URL}`));
    
    if (!MONGODB_URL) {
        throw new CustomError("MongoDB URL is not defined", 500, { envVariable: "MONGODB_URL" });
    }

    const DB_NAME = process.env.DB_NAME;
    try {
             const connectionInstance = await mongoose.connect(MONGODB_URL);        console.log(chalk.red.bold.bgGreen.underline.italic(`Database connected at host ${connectionInstance.connection.host} on port ${connectionInstance.connection.port}`));
         
    
    } catch (error:any) {
        throw new CustomError(
            "Database connection failed",
            500,
            { originalError: error.message }
        );
    }
}

export default connectDB;