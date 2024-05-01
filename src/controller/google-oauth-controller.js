import googleOauthService, { url } from "../service/google-oauth-service.js"

const loginGoogle = (req, res, next) => {
    try {
        res.redirect(url)
    }catch (e) {
        next(e);
    }
}

const loginGoogleCallback = async (req, res, next) => {
    try{
        const code = req.query.code
        const result = await  googleOauthService.loginGoogle(code);
        res.cookie("refreshToken", result.jwtRefreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.status(200).json({
            data: result.addUserGoogle,
            accessToken: result.jwtAccessToken
        });
        
    }catch (e) {
        next(e)
    }
}

export default {
    loginGoogle,
    loginGoogleCallback
}