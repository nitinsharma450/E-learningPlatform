import express from 'express'
import AdminMiddlewares from '../MiddleWare/AdminMiddleware.js'
import { adminController } from '../controller/adminController.js'

export const adminRouter=new express.Router()


adminRouter.use(AdminMiddlewares)

adminRouter.post('/teacher/add',adminController.create)
adminRouter.post('/teacher/count',adminController.count)