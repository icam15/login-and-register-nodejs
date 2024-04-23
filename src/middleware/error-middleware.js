import { ResponseError } from "../error/response-error.js";

const errormiddleware = async (err, req, res, next) => {
    if(!err) {
        next();
        return;
    }

    if(err instanceof ResponseError) {
        res.status(err.status).json({
            errors : err.message
        }).end();
    } else {
        res.status(400).json({
            errors : err.message
        }).end();
    }
}

export{
    errormiddleware
}