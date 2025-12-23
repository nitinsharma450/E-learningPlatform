import express from 'express'
import { teacherController } from '../controller/teacherController.js'
import { TeacherMiddleware } from '../MiddleWare/TeacherMiddleware.js' 

export const teacherRouter=express.Router()

teacherRouter.post('/login',teacherController.login)
teacherRouter.post('/course/searchTitles',teacherController.searchAllTitle)

teacherRouter.use(TeacherMiddleware)

teacherRouter.post('/course/content/upload',teacherController.courseContent)
teacherRouter.post('/courseContent/count',teacherController.countCourseContent)
teacherRouter.post('/profile/search',teacherController.searchProfile)
teacherRouter.post('/enroll/student/search',teacherController.searchEnrollStudent)
teacherRouter.post('/student/activeStudent',teacherController.searchActiveStudent)
teacherRouter.post('/teacher/logout',teacherController.logout)

