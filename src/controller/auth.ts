import { NextFunction, Request } from "express";
import { ISingleResponse } from "../types/generic";
import {
  IUserLogin,
  IUser,
  IUserAuthResponse,
  IJwtPayloadWithUsername,
  IJwtPayloadWithUserData,
} from "../types/user.type";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../configs/db";
import { ErrorResponse } from "../utils/errorResponse";
import QR from 'qrcode'
import * as dotenv from "dotenv";
dotenv.config();

const SendTokenResponse = (
  user: IUser,
  statusCode: number,
  res: ISingleResponse<IUserAuthResponse>
) => {
  const token = jwt.sign(user, process.env.JWT_SECRET as string);
  res
    .status(statusCode)
    .cookie("token", token, { httpOnly: false })
    .json({
      data: { user, token, success: true },
      success: true,
      timestamp: Date.now(),
    });
};
const HashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
};

export const Register = async (
  req: Request,
  res: ISingleResponse<IUserAuthResponse>,
  next: NextFunction
) => {
  const { username, password } = req.body;
  const hashPassword = await HashPassword(password);
  try {
    const sql = `INSERT INTO users (username,password,organize,role,createAt,updateAt)
    value (?,?,?,?,?,?)`;
    db.query(
      sql,
      [username, hashPassword, "local", "user", Date.now(), Date.now()],
      (error, result) => {
        if (!error) {
          const sql = `SELECT * FROM users WHERE username = ?`;
          db.query(sql, [username], (error, result: any) => {
            if (!error) {
              const user: IUser = result[0];
              SendTokenResponse(user, 200, res);
            } else {
              next(new ErrorResponse("sql Error", 400));
            }
          });
        } else {
          next(new ErrorResponse("sql Error", 400));
        }
      }
    );
  } catch (error) {
    next(new ErrorResponse("Server Error", 500));
  }
};

export const Login = async (
  req: Request,
  res: ISingleResponse<IUserAuthResponse>,
  next: NextFunction
) => {
  const { username, password } = req.body.payload;
  if (!username || !password) {
    next(new ErrorResponse("Please provide username and password", 400));
    return;
  }
  try {
    const sql = `SELECT * FROM users WHERE username = ?`;
    db.query(sql, [username], (error, result: any) => {
      if (!error) {
        if (result.length === 0) {
          next(new ErrorResponse("Invalid credential!", 400));
          return;
        } else {
          const user = result[0];
          const isCorrectPassword = bcrypt.compare(password, user.password);
          isCorrectPassword.then((status) => {
            if (status) {
              SendTokenResponse(user, 200, res);
            } else {
              next(new ErrorResponse("Invalid credential", 400));
              return;
            }
          });
        }
      } else {
        next(new ErrorResponse("Invalid credential!", 400));
        return;
      }
    });
  } catch (error) {
    next(new ErrorResponse("Server error", 500));
  }
};

export const LoginByToken = async (
  req: Request,
  res: ISingleResponse<IUser>,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      next(new ErrorResponse("You dont have access to this route", 400));
      return;
    }
    const secret = process.env.JWT_SECRET;
    const decode = jwt.verify(token, secret as string) as IUser;
    res
      .status(200)
      .json({ data: decode, success: true, timestamp: Date.now() });
  } catch (error) {
    next(new ErrorResponse("Server error", 500));
  }
};

export const LogoutToken = async (req:Request,res:ISingleResponse<string>,next:NextFunction) => {
  try{
    res.status(200).cookie("token","").json({data:"Delete token",success:true,timestamp:Date.now()})
  }catch(error){
    next(new ErrorResponse("Server error",500))
  }
}

export const QrGenerate = async(req:Request,res:ISingleResponse<string>,next:NextFunction) => {

  try{
    // const {username} = req.body.payload
    // const sql = `SELECT * FROM users WHERE username = ?`
    // db.query(sql,[username],(error,result:Array<any>)=>{
    //   if(error){
    //     next(new ErrorResponse("Server Error",500))
    //     return
    //   }
    //   else{
    //     if(result.length === 0){
    //       next(new ErrorResponse('User not found',404))
    //     }
    //     const encryptedData = jwt.sign(result[0],process.env.QR_SECRET as string)
    //   }
    // })
    const dataImage = QR.toDataURL('http://localhost:5173/qrcode')
    dataImage.then((value:string)=>res.status(200).json({data:value,success:true,timestamp:Date.now()}))
  }catch(error){
    next(new ErrorResponse("Server Error",500))
  }
}
export const QrLogin = async(req:Request,res:ISingleResponse<IUserAuthResponse>,next:NextFunction) => {
  try{
    const {token} = req.body
    const decode = jwt.verify(token,process.env.JWT_SECRET as string) as IUser
    const encodeForqr = jwt.sign(decode,process.env.JWT_SECRET as string)
    res.status(200).cookie("token",encodeForqr).json({data:{user:decode,success:true,token:encodeForqr},success:true,timestamp:Date.now()})
  }catch(error){
    next(new ErrorResponse("Invalid Credential",500))
  }
}