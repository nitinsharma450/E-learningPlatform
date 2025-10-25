import express from 'express'
import AdminMiddlewares from '../MiddleWare/AdminMiddleware.js'
import { adminController } from '../controller/adminController.js'

export const adminRouter=new express.Router()


// adminRouter.use(AdminMiddlewares)

//teacher
adminRouter.post('/teacher/add',adminController.teacherCreate)
adminRouter.post('/teacher/count',adminController.teacherCount)
adminRouter.post('/save/credentials',adminController.teacherCredentialSave)
adminRouter.post('/profile/search',adminController.searchProfile)
adminRouter.post('/teacher/search',adminController.searchTeacher)

//courses

adminRouter.post('/course/add',adminController.courseCreate)
adminRouter.post('/course/searchAll',adminController.search)
adminRouter.post('/course/filter',adminController.filter)
adminRouter.post('/course/count',adminController.countCoures)

//student

adminRouter.post('/student/count',adminController.countStudent)