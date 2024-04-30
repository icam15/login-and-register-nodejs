import express from "express";
import userController from "../controller/user-controller.js";
import passport from "passport";
import googleOauthController from "../controller/google-oauth-controller.js";
// import authGoogleController from "../controller/auth-google-controller.js";


const publicRouter = express.Router();

publicRouter.post('/api/register', userController.register);
publicRouter.post('/api/login', userController.login);

publicRouter.get('/auth/google', googleOauthController.loginGoogle);
publicRouter.get('/auth/google/callback', googleOauthController.loginGoogleCallback);

export {
    publicRouter
}