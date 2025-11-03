import express from 'express'
import { studentController } from '../controller/studentController.js'



export const studentRouter=express.Router()


studentRouter.post('/save/credentials',studentController.saveCredentials)
studentRouter.post('/course/searchAll',studentController.searchAll)
studentRouter.post('/course/filterCourse',studentController.filter)
studentRouter.post('/profile/search',studentController.searchProfile)
studentRouter.post('/student/logout',studentController.logout)
studentRouter.post('/course/searchCourseByTitle',studentController.searchCourseByTitle)
studentRouter.post('/course/Enroll',studentController.enroll)
