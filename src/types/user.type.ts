import { Request } from "express"
import { JwtPayload } from "jsonwebtoken"

export interface IUserLogin{
    username: string
    password: string
}

export interface IUser{
    username:string
    password:string
    organize:string
    role:string
    resetPasswordToken:string
    resetPasswordExpire:Date
    createAt:string
    updateAt:string
}

export interface IUserAuthResponse{
    user:IUser
    token:string
    success:boolean
}

export interface IJwtPayloadWithUsername extends JwtPayload{
    username:string
}
export interface IJwtPayloadWithUserData extends JwtPayload{
    user:IUser
}
export interface IRequestWithUser extends Request{
    user?:IUser
}