import { prisma } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import { getUserValidation, loginValidation, registerValidation } from "../validation/user-validation.js"
import { validate } from "../validation/validation.js"
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { logger } from "../app/logging.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();


const register = async (request) => {
    const user = validate(registerValidation, request);

    const checkUser = await prisma.user.count({
        where:{
            email: user.email
        }
    });

    user.password = await bcrypt.hash(user.password, 5);

    if(checkUser === 1) {
        throw new ResponseError(400, "Email already Exist")
    }

    const result = await prisma.user.create({
        data: user,
        select:{
            name: true,
            password: true
        },
    });

    return result
}

const login = async(request) => {
    const login = validate(loginValidation, request)


    // Authentication user
    const findUser = await prisma.user.findFirst({
        where:{
            email: login.email
        },
        select: {
            id: true,
            password: true,
            email: true
        }
    });

    if(!findUser) {
        throw new ResponseError(404, "Username or Password is wrong");
    }

    const PasswordValid = await bcrypt.compare(login.password, findUser.password)

    if(!PasswordValid) {
        throw new ResponseError(404, "Username or Password is wrong");
    }

    // Send email 
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port : 465,
        secure: true,
        auth: {
            user: "bianskiza@gmail.com",
            pass: process.env.authEmail
        },
    })

    const mailOptions = {
        from: "bianskiza@gmail.com",
        to: findUser.email,
        subject : "You are login",
        text : "this is a test email sent using nodemailer"
        }
    
    const sendEmail = transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            logger.error("Error sending email");
        } else {
            logger.info("Email sent", info.response);
        }
        });

    //Authorization using jwt
    const accessToken = jwt.sign(findUser, process.env.JWT_ACCESS_TOKEN, {
        expiresIn: "60s"
    });

    const refreshToken = jwt.sign(findUser, process.env.JWT_REFRESH_TOKEN, {
        expiresIn: "1d"
    });

    //Update refresh_token in database
    const  result = await prisma.user.update({
        data:{
            refresh_token: refreshToken
        },
        where:{
            email: findUser.email,
            id: findUser.id
        },
        select: {
            refresh_token: true
        }
    });

    // Return data
    return {
        data: result,
        refreshToken: refreshToken,
        accessToken: accessToken,
        sendEmail
    }
}

const get = async (email) => {
    const emailUser = validate(getUserValidation, email);

    const getUser = await prisma.user.findFirst({
        where: {
            email: emailUser
        },
        select: {
            name :true,
            id: true
        }
    });

    if(!getUser) {
        throw new ResponseError(404, "User is not found");
    }

    return getUser
}

export default {
    register,
    login,
    get
}
