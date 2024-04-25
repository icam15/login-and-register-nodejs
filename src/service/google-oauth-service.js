import dotenv from "dotenv";
import {google} from "googleapis";
import { ResponseError } from "../error/response-error.js";
import { prisma } from "../app/database.js";
dotenv.config();


// Confirguration
const oauth2Google = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:4000/auth/google/callback'
);

//Scopes
const scope = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
];

// Authorization Url
export const authorizationUrl = oauth2Google.generateAuthUrl({
    access_type: 'offline',
    scope: scope,
    include_granted_scopes: true
});

const loginGoogle = async (token) => {
    const getToken = oauth2Google.getToken(token)
    
    // Set Credentials
    oauth2Google.setCredentials(getToken)

    // Get User Info
    const auth = google.oauth2({
        auth: oauth2Google,
        version: 'v2'
    });

    const data = await auth.userinfo.get();
    if(!data) {
        throw new ResponseError(404, "Data not found" );
    }

    let user = await prisma.user.findFirst({
        where: {
            email : data.email
        }
    });

    if(user) {
        throw new ResponseError (400, "Your Emai is already exist in our data")
    };

    return await prisma.user.create({
        data: {
            email: data.email,
            name: data.name

        }
    });
}

export default {
    loginGoogle,
}