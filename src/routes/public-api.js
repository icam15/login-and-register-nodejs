import express from "express";
import userController from "../controller/user-controller.js";
import passport from "passport";
import authGoogleController from "../controller/auth-google-controller.js";


const publicRouter = express.Router();

publicRouter.post('/api/register', userController.register);
publicRouter.post('/api/login', userController.login);

publicRouter.get('/auth/google', passport.authenticate('google'));
publicRouter.get('/auth/google/callback', passport.authenticate('google'), authGoogleController.loginGoogleCallback)

export {
    publicRouter
}