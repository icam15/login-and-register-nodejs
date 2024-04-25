import googleOauthService, { authorizationUrl } from "../service/google-oauth-service.js"

const googleLogin = (req, res, next) => {
    res.redirect(authorizationUrl);
    next();
}

const googleLoginCallback = async  (req, res, next) => {
    try {
        const code = req.query.code
    const result = await googleOauthService.loginGoogle(code);
    res.status(200).json({
        data: result
    });
    }catch (e) {
        next(e)
    }
    
}

export default {
    googleLogin,
    googleLoginCallback
}