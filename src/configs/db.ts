import mysql2 from 'mysql2'
import * as dotenv from 'dotenv'
dotenv.config()
const db = mysql2.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PASSWORD),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})


export default db