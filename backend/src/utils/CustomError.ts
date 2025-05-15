import { ICustomError, ICustomErrorData } from "../types/CustomError.js";

class CustomError extends Error implements ICustomError {
    statusCode: number;
    data: ICustomErrorData;

    constructor(message: string, statusCode: number, data: ICustomErrorData) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
    }
}

export default CustomError;