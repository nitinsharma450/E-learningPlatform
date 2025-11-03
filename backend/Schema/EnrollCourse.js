import mongoose from "mongoose";

 let EnrollCourseSchema=mongoose.Schema({

    courseTitle:{type:String,required:true},
    user_id:{type:String,required:true},
    timeOfEnroll:{type:Date,default:Date.now()}
})

export const EnrollCourse=mongoose.model('EnrollCourseSchema',EnrollCourseSchema)