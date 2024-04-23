import exprees from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import userController from "../controller/user-controller.js";

const userRouter = exprees.Router();

userRouter.use(authMiddleware);

userRouter.get('/api/user/current', userController.get);

export {
    userRouter
}