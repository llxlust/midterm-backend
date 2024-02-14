import { Response } from "express"

export interface ISingleReturn<T>{
    data: T,
    success:boolean
    timestamp:number
}

export interface ISingleResponse<T> extends Response{
    json: (body:ISingleReturn<T>)=> this
}

export interface IErrorResponse<T> extends Response {
    json: (body:ISingleError<T>) => this
}

export interface ISingleError<T>{
    error: T,
    success: bool
    timestamp:number
}