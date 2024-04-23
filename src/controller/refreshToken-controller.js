import refreshTokenService from "../service/refresh-token-service.js";

const getNewToken = async (req, res, next) => {
    try{
        const token = req.cookies.refreshToken;
        const result = await refreshTokenService.refreshToken(token);
        res.status(200).json({
            accessToken : result.accessToken
        });

    }catch (e) {
        next(e);
    }
}

export default {
    getNewToken
}