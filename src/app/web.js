import express from "express";
import { errormiddleware } from "../middleware/error-middleware.js";
import { publicRouter } from "../routes/public-api.js";
import cookieParser from "cookie-parser";
import { userRouter } from "../routes/api.js";
import { tokenRouter } from "../routes/refreshToken-api.js";

export const web = express();

web.use(express.json());
web.use(cookieParser());


web.use(publicRouter);

web.use(tokenRouter);

web.use(userRouter);

web.use(errormiddleware);