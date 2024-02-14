import { NextFunction, Request } from "express";
import { IErrorResponse } from "../types/generic";
import { ErrorResponse } from "../utils/errorResponse";



export default function ErrorHandler(err:ErrorResponse,req:Request,res:IErrorResponse<string>,next:NextFunction):void{
        res.status(err.statuscode).json({error:err.message,success:false,timestamp:Date.now()})
}