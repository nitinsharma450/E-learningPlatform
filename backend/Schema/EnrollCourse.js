import mongoose from "mongoose";

 let EnrollCourseSchema=mongoose.Schema({

    courseTitle:{type:String,required:true},
    user_id:{type:String,required:true},
    timeOfEnroll:{type:Date,default:Date.now()},
    isActive:{type:Boolean,required:true}
})

export const EnrollCourse=mongoose.model('EnrollCourseSchema',EnrollCourseSchema)