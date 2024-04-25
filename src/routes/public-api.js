import express from "express";
import userController from "../controller/user-controller.js";
import googleOauthController from "../controller/google-oauth-controller.js";

const publicRouter = express.Router();


publicRouter.get('/auth/google', googleOauthController.googleLogin);
publicRouter.get('/auth/google/callback', googleOauthController.googleLoginCallback);

publicRouter.post('/api/register', userController.register);
publicRouter.post('/api/login', userController.login);






export {
    publicRouter
}