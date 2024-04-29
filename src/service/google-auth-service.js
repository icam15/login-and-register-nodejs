import passport from "passport";
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import dotenv from "dotenv";
import { prisma } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
dotenv.config();

const strategy =  passport.use(
    new GoogleStrategy (
        {
            clientID:process.env.GOOGLE_CLIENT_ID,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET,
            callbackURL:'http://localhost:4000/auth/google/callback',
            scope:['email', 'profile'],
        },
        async (accesToken, refreshToken, profile, done) => {
            // console.log(profile._json.email);
            let findUser = await prisma.user.findFirst({
                where: { 
                    email: profile._json.email
                }
            });

            if (!findUser) {
                findUser = await prisma.user.create({
                    data:{
                        password:profile._json.name,
                        email: profile._json.email,
                        name: profile._json.name,
                    }
                })
            } else {
                throw new ResponseError (400, "Email user already exist")
            }
        }
    )
);

export default {
    strategy
}