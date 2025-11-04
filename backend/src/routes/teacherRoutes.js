import express from 'express'
import { teacherController } from '../controller/teacherController.js'

export const teacherRouter=express.Router()

teacherRouter.post('/login',teacherController.login)
teacherRouter.post('/course/searchTitles',teacherController.searchAllTitle)
teacherRouter.post('/course/content/upload',teacherController.courseContent)
teacherRouter.post('/courseContent/count',teacherController.countCourseContent)
teacherRouter.post('/profile/search',teacherController.searchProfile)
teacherRouter.post('/enroll/student/search',teacherController.searchEnrollStudent)
teacherRouter.post('/student/activeStudent',teacherController.searchActiveStudent)
