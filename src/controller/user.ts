import { NextFunction, Request } from "express";
import { ISingleResponse } from "../types/generic";
import { IRequestWithUser, IUser } from "../types/user.type";
import { ErrorResponse } from "../utils/errorResponse";
import db from "../configs/db";

export const GetUserData = (
  req: IRequestWithUser,
  res: ISingleResponse<IUser>,
  next: NextFunction
) => {
  const username = req.user?.username;
  try {
    const sql = `SELECT * FROM users WHERE username = ?`;
    db.query(sql, [username], (error, result: any) => {
      if (error) {
        next(new ErrorResponse("Server Error", 500));
      } else {
        if (result.length === 0) {
          next(new ErrorResponse("User not found", 404));
        } else {
          const user = result[0] as IUser;
          res.status(200).json({ data: user,success:true, timestamp: Date.now() });
        }
      }
    });
  } catch (error) {
    next(new ErrorResponse("Server Error", 500));
  }
};
