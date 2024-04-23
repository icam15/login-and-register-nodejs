import { logger } from "../app/logging.js";
import userService from "../service/user-service.js"

const register = async (req, res, next) => {
    try{
        logger.info(register)
        const result = await userService.register(req.body);
        res.status(200).json({
            data: result
        });
    }catch(e) {
        next(e)
    }
}

const login = async (req, res, next) => {
    try{
        logger.info(login);
        const result = await userService.login(req.body);
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            masAge: 24 * 60 * 60 * 1000
        });
        res.status(200).json({
            accessToken : result.accessToken
        });
    }catch(e) {
        next(e)
    }
}

const get = async (req, res, next) => {
    try {
        const result = await userService.get(req.user.email)
        res.status(200).json({
            data: result
        })
    }catch(e) {
        next(e);
    }
}

export default{
    register,
    login,
    get
}