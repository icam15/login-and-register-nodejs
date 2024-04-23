import express from "express";
import refreshTokenController from "../controller/refreshToken-controller.js";

const tokenRouter = express.Router();

tokenRouter.get('/api/user/current/token', refreshTokenController.getNewToken);


export {
    tokenRouter
}