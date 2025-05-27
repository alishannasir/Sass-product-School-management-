// Fixed app.ts file
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { CorsOptions } from "./src/types/corsOptions.types.js";

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Fixed double underscore

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
// json <in build global middleware>
app.use(express.json());
// urlencoded <inbuild middleware>
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const whiteList: String[] = ["http://localhost:5173", "http://localhost:8080"];
const corsOptions: CorsOptions = {
    origin: function (origin, cb) {
        if (whiteList.includes(origin!) || !origin) {
            cb(null, true);
        } else {
            cb(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsOptions));

// Cookie parser <third party middleware global>
app.use(cookieParser());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

import ownerRouter from "./src/routes/owner/owner.js";
app.use("/api/owner", ownerRouter);
import teacherRouter from "./src/routes/teacher/teacher.js";
app.use("/api/teacher", teacherRouter);
import selectionRole from "./src/routes/roleSelection.js"
app.use("/api/", selectionRole);
import studentRouter from "./src/routes/student/student.js";
app.use("/api/student", studentRouter);
// Error middleware
import errorMiddleware from "./src/middleware/error.middleware.js";
app.use(errorMiddleware);

// Export app
export default app;