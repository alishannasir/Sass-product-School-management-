import { Request, Response, NextFunction } from "express";

function AsyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
    return function (req: Request, res: Response, next: NextFunction) {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

export default AsyncHandler;