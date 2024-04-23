import { prisma } from "../app/database.js"
import { ResponseError } from "../error/response-error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const refreshToken = async (token) => {
    const findTokenUser = await prisma.user.findFirst({
        where: {
            refresh_token: token
        },
        select: {
            name: true,
            email: true
        }
    });

    if(!findTokenUser) {
        throw new ResponseError(403, "Token is undefined");
    }

    const refreshTokenVerify = jwt.verify(token, process.env.JWT_REFRESH_TOKEN)
    if(!refreshTokenVerify) {
        throw new ResponseError (403, "Token is not same");
    }

    const newAccessToken = jwt.sign(findTokenUser, process.env.JWT_ACCESS_TOKEN, {
        expiresIn: "60s"
    });

    return {
        accessToken: newAccessToken
    }
}

export default{
    refreshToken
}