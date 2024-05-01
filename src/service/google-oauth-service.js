import dotenv from "dotenv";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import { ResponseError } from "../error/response-error.js";
import { prisma } from "../app/database.js";
dotenv.config();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:4000/auth/google/callback'
);

const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
]

export const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope:scopes,
    include_granted_scopes: true
});



const loginGoogle = async (code) => {
    const {tokens} = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
        auth: oauth2Client,
        version : "v2"
    });

    const {data} = await oauth2.userinfo.get();

    if (!data) {
        throw new ResponseError (400, "User Google not exist");
    }

    let addUserGoogle = await prisma.user.findFirst({
        where: {
            email: data.email
        },
        select: {
            email: true,
            name: true
        }
    });
    
    
    const jwtPayload = {
        name: data.name,
        email: data.email
    };
    
    const jwtAccessToken = jwt.sign(jwtPayload, process.env.JWT_ACCESS_TOKEN, {
        expiresIn:"60s"
    });
    
    const jwtRefreshToken = jwt.sign(jwtPayload, process.env.JWT_REFRESH_TOKEN, {
        expiresIn: "1d"
    });
    
    if(!addUserGoogle) {
        addUserGoogle = await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: data.name,
                refresh_token: jwtRefreshToken
            },
            select:{
                email: true,
                name: true
            }
        });
    }
    

    return {
        addUserGoogle,
        jwtAccessToken,
        jwtRefreshToken
    }
}

export default {
    loginGoogle
}