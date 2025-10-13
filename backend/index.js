import express from 'express'
import dotenv from 'dotenv'
import { DB_connect } from './connection.js';

dotenv.config()

const app=express();
app.use(express.json());

DB_connect
app.listen(3333,()=>{
    
    console.log(`server is running on port ${process.env.PORT}`)
})