import express, { Request, Response } from 'express'
import { Authorize, Protect } from '../middlewares/auth'
import { GetUserData } from '../controller/user'

const router = express.Router()

router.get('/profile',Protect,GetUserData)

export default router