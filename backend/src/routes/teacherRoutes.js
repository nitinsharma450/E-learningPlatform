import express from 'express'
import { teacherController } from '../controller/teacherController.js'

export const teacherRouter=express.Router()

teacherRouter.post('/login',teacherController.login)