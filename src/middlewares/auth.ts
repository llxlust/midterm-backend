import { NextFunction, Request, Response } from "express";
import ErrorHandler from "./errorHandler";
import {rateLimit} from 'express-rate-limit'
import { ErrorResponse } from "../utils/errorResponse";
import db from "../configs/db";
import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import { IJwtPayloadWithUsername, IRequestWithUser } from "../types/user.type";
import { IErrorResponse, ISingleResponse } from "../types/generic";
dotenv.config()
export const Protect = async(req:Request,res:Response,next:NextFunction)=>{
    const token = req.cookies.token
    console.log(token,":token")
    if(!token){
        next(new ErrorResponse("Not authorize to access this route",401))
        return
    }
    try{
            const secret = process.env.JWT_SECRET
            const decode = jwt.verify(token ,secret as string) as IJwtPayloadWithUsername
            const sql = `SELECT * FROM users WHERE username = ?`
            db.query(sql,[decode.username],(error,result:any)=>{
                if(error){
                    next(new ErrorResponse("Server error",500))
                    return
                }
                else{
                    if(result.length === 0){
                        next(new ErrorResponse("Not found user",400))
                        return
                    }
                    else{
                       ( req as IRequestWithUser).user = result[0]
                       next()
                    }
                }
            })
    }catch(error){
        next(new ErrorResponse("Server Error",500))
    }
}

export const Authorize = async (req:IRequestWithUser,res:Response,next:NextFunction) => {
    if(req.user?.role === "user"){
        next(new ErrorResponse("Not authorize this route",400))
    }else{
        next()
    }
   
}

export const limiter = rateLimit({
    windowMs:5 * 60 * 1000,
    limit:5,
    handler:function(req:Request,res:IErrorResponse<string>,next:NextFunction){
        next(new ErrorResponse("Too many request please try again",429))
    }
})