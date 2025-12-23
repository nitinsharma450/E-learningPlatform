import express from 'express'
import AdminMiddlewares from '../MiddleWare/AdminMiddleware.js'
import { adminController } from '../controller/adminController.js'

export const adminRouter=new express.Router()


// adminRouter.use(AdminMiddlewares)

//teacher
adminRouter.post('/teacher/add',adminController.teacherCreate)
adminRouter.post('/teacher/count',adminController.teacherCount)
adminRouter.post('/save/credentials',adminController.adminCredentialSave)
adminRouter.post('/profile/search',adminController.searchProfile)
adminRouter.post('/teacher/search',adminController.searchTeacher)
adminRouter.post('/teacher/activeTeacherCount',adminController.searchActiveTeachersCount)
adminRouter.post('/teacher/activeTeacherProfile',adminController.searchActiveTeacherProfile)
adminRouter.post('/teacher/blockUnblock',adminController.blockUnblockTeacher)
adminRouter.post('/teacher/getById',adminController.getTeacherById)
adminRouter.post('/teacher/update',adminController.updateTeacher)

//courses

adminRouter.post('/course/add',adminController.courseCreate)
adminRouter.post('/course/searchAll',adminController.search)
adminRouter.post('/course/filter',adminController.filter)
adminRouter.post('/course/count',adminController.countCoures)
adminRouter.post('/course/searchTitles',adminController.searchSubjectTitle)

//student

adminRouter.post('/student/count',adminController.countStudent)
adminRouter.post('/student/activeStudents',adminController.searchActiveStudents)
adminRouter.post('/student/searchAll',adminController.searchAllStudent)
adminRouter.post('/student/getActiveStudentProfile',adminController.activeStudentProfile)
adminRouter.post('/student/blockUnblock',adminController.blockUnblockStudent)
