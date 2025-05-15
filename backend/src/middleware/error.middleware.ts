import { NextFunction, Request, Response } from "express";

async function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Something went wrong";

    // Handle duplicate key error
    if (err.code === 11000) {
        message = "Duplicate key error";
        statusCode = 400;
    }

    res.status(statusCode).json({
        message,
        statusCode,
        data: err.data,
    });
}

export default errorMiddleware;