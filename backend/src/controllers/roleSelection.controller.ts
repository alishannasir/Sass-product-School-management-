import { Request, Response } from "express";
import { Role } from "../types/role.types.js";

export const getRoleOptions = (req: Request, res: Response): void => {
    const roles: Role[] = [
        { id: 1, name: "Owner" },
        { id: 2, name: "Teacher" },
        { id: 3, name: "Student" },
        { id: 4, name: "Parent" }
    ];

    res.status(200).json(roles);
};