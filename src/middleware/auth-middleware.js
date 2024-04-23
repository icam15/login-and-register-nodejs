import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export const authMiddleware = (req, res, next) => {
    const getJwt = req.headers ['authorization']
    if(!getJwt) {
        res.status(401).json({
            errros: "User Unathorization"
        });
    }

    const jwtToken = getJwt.split(' ')[1];
    const secret = process.env.JWT_ACCESS_TOKEN;

    try{
        const jwtDecode = jwt.verify(jwtToken, secret);
        req.user = jwtDecode;
    } catch(e) {
        return res.status(401).json({
            message: "Unathorization"
        });
    }
    next()
}