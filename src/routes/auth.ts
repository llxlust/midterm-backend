import express, { NextFunction, Request } from 'express'
import { Login, LoginByToken, LogoutToken, QrGenerate, QrLogin, Register } from '../controller/auth'
import { limiter } from '../middlewares/auth'
const router = express.Router()

router.post('/login',limiter,Login)
router.post('/logout',LogoutToken)
router.post('/register',Register)
router.post('/token-login',LoginByToken)
router.post('/qr-login',QrLogin)
router.post('/qr-generate',QrGenerate)
export default router