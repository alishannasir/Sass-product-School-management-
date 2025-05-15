import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import { CorsOptions } from "./src/types/corsOptions.types.js";

const app = express();

// middlewares implement
// json <in build global middleware>
app.use(express.json());

// urlencoded <inbuild middleware>
app.use(express.urlencoded({ extended: true }));

const whiteList: String[] = ["http://localhost:5173", "http://localhost:5174"];
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

// cookie parser  <third party middleware global >
app.use(cookieParser());

// ouner route setup
import ownerRouter from "./src/routes/owner/owner.js";
app.use("/api/owner", ownerRouter);

// error middleware
import errorMiddleware from "./src/middleware/error.middleware.js";
app.use(errorMiddleware);

// export app
export default app;