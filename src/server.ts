import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import AuthRouter from './routes/auth'
import UserRoute from './routes/user'
import * as dotenv from 'dotenv'
import ErrorHandler from './middlewares/errorHandler'
import { v4 as uuidv4 } from 'uuid';
dotenv.config()

const app = express()
const PORT = Number(process.env.SERVER_PORT)

if(!PORT){
    process.exit(1)
}

const corsOption = {
    origin:'http://localhost:5173',
    credential:'include',
}
app.use((req, res, next) => {
    res.cookie("session",uuidv4()).header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use(cors(corsOption))
app.use(express.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cookieParser())




app.use('/api/auth',AuthRouter)
app.use('/api/user',UserRoute)
app.get('/api/cookies',(req,res)=>{
    res.status(200).cookie("token","secret",{httpOnly:true}).json({message:'test cookies'})
})
app.use(ErrorHandler)
app.listen(PORT,()=>{
    console.log(`Server is running on PORT:${PORT}`)
})